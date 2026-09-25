/**
 * Report files and their verify → send trail. Server only.
 *
 *   upload   a lab partner (its own accepted orders) or staff with
 *            reports.manage. Any earlier live version becomes 'replaced' —
 *            kept, never deleted, so "which report did we send on Tuesday"
 *            always has an answer.
 *   verify   staff with reports.verify; a doctor/manager has looked at it
 *   send     staff with reports.verify; records who sent it, when and how
 *
 * Files live in crm_files (bytes in MySQL — the host's filesystem is read-only
 * at runtime). They are only ever served by /api/crm/files/[id], which checks
 * the requester may see the booking the file belongs to.
 */
import { createHash } from "node:crypto";

import { query, transaction } from "@/lib/db";

import { logActivity, notify } from "../activity";
import { bookingCode } from "../constants";
import { UserError } from "../guard";
import { applyRaw, lockBooking, scopeWhere, setReportDue, stageEffects, stageIndex } from "./bookings";

export const MAX_REPORT_BYTES = 8 * 1024 * 1024;

const TYPES = {
  "application/pdf": { ext: "pdf", magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  "image/jpeg": { ext: "jpg", magic: [0xff, 0xd8, 0xff] },
  "image/png": { ext: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
};

/** Check a File's real type by its first bytes, not by what the browser claimed. */
export function sniff(buffer) {
  for (const [mime, t] of Object.entries(TYPES)) {
    if (t.magic.every((b, i) => buffer[i] === b)) return { mime, ext: t.ext };
  }
  return null;
}

export async function storeFile(conn, { buffer, filename, kind, entity, entityId, partnerId, user }) {
  const type = sniff(buffer);
  if (!type) throw new UserError("Upload a PDF, JPG or PNG file.");
  if (buffer.length > MAX_REPORT_BYTES) throw new UserError("That file is larger than 8 MB.");
  if (buffer.length < 100) throw new UserError("That file is empty.");

  const safeName =
    String(filename ?? "file")
      .replace(/[^\w.\- ]+/g, "")
      .replace(/\.[^.]*$/, "")
      .slice(0, 120) || "file";

  const [res] = await conn.execute(
    `INSERT INTO crm_files (kind, entity, entity_id, partner_id, filename, mime, bytes, sha256, data, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      kind,
      entity,
      String(entityId),
      partnerId ?? null,
      `${safeName}.${type.ext}`,
      type.mime,
      buffer.length,
      createHash("sha256").update(buffer).digest("hex"),
      buffer,
      user?.id ?? null,
    ]
  );
  return res.insertId;
}

/** Upload a report for a booking. */
export async function uploadReport(bookingId, { buffer, filename, remarks = "" }, { user, scope = {} }) {
  const out = await transaction(async (conn) => {
    const b = await lockBooking(conn, bookingId, scope);
    if (b.status === "cancelled") throw new UserError("This booking is cancelled.");
    if (scope.partnerId && b.partner_status !== "accepted") throw new UserError("Accept the order before uploading its report.");
    if (stageIndex(b.status) < stageIndex("sample_collected")) throw new UserError("The sample has not been collected yet.");

    const fileId = await storeFile(conn, {
      buffer,
      filename: filename || `report-${bookingCode(b.id)}`,
      kind: "report",
      entity: "bookings",
      entityId: b.id,
      partnerId: b.partner_id,
      user,
    });
    const [[v]] = await conn.execute("SELECT COALESCE(MAX(version), 0) + 1 AS v FROM reports WHERE booking_id = ?", [b.id]);
    await conn.execute("UPDATE reports SET status = 'replaced' WHERE booking_id = ? AND status IN ('uploaded','verified')", [b.id]);
    const [res] = await conn.execute(
      "INSERT INTO reports (booking_id, partner_id, file_id, version, remarks, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)",
      [b.id, b.partner_id, fileId, Number(v.v), String(remarks ?? "").trim().slice(0, 1000), user?.id ?? null]
    );

    // A replacement after delivery re-opens delivery; otherwise → report ready.
    const target = stageIndex(b.status) >= stageIndex("report_ready") ? null : "report_ready";
    const patch = target ? stageEffects(b, target) : {};
    await applyRaw(conn, b.id, { ...patch, report_ready_at: "UTC_TIMESTAMP()" }, {
      ...(target ? { status: target } : {}),
      report_status: "report_ready",
      updated_by: user?.id ?? null,
    });
    await setReportDue(conn, b.id);

    await logActivity({
      conn,
      user,
      action: "upload",
      entity: "bookings",
      entityId: b.id,
      partnerId: b.partner_id,
      summary: `${user?.name || "Someone"} uploaded report v${v.v} for ${bookingCode(b.id)}${Number(v.v) > 1 ? " (replaced earlier version)" : ""}`,
      after: { report_id: res.insertId, version: Number(v.v), bytes: buffer.length },
    });
    return { b, reportId: res.insertId, version: Number(v.v) };
  });

  await notify({
    type: "report.uploaded",
    title: `Report uploaded · ${bookingCode(out.b.id)}`,
    body: `${out.b.patient_name} — verify and send it`,
    link: `/crm/bookings/${out.b.id}#report`,
    perm: "reports.verify",
    severity: "success",
  });
  return out;
}

async function lockReport(conn, reportId) {
  const [[r]] = await conn.execute("SELECT * FROM reports WHERE id = ? FOR UPDATE", [Number(reportId) || 0]);
  if (!r) throw new UserError("That report was not found.");
  return r;
}

export async function verifyReport(reportId, { user }) {
  return transaction(async (conn) => {
    const r = await lockReport(conn, reportId);
    if (r.status !== "uploaded") throw new UserError(r.status === "verified" ? "Already verified." : "Only the latest uploaded report can be verified.");
    const b = await lockBooking(conn, r.booking_id);
    await conn.execute("UPDATE reports SET status = 'verified', verified_by = ?, verified_at = UTC_TIMESTAMP() WHERE id = ?", [user.id, r.id]);
    await applyRaw(conn, b.id, {}, { report_status: "verified", updated_by: user.id });
    await logActivity({
      conn,
      user,
      action: "verify",
      entity: "bookings",
      entityId: b.id,
      partnerId: b.partner_id,
      summary: `${user.name || user.email} verified report v${r.version} for ${bookingCode(b.id)}`,
      after: { report_id: r.id },
    });
    return { ok: true };
  });
}

/** Reject a report back to the lab (wrong patient, unreadable scan …). */
export async function rejectReport(reportId, { user, reason }) {
  const why = String(reason ?? "").trim().slice(0, 300);
  if (!why) throw new UserError("Say what is wrong with the report.");
  const out = await transaction(async (conn) => {
    const r = await lockReport(conn, reportId);
    if (!["uploaded", "verified"].includes(r.status)) throw new UserError("That report is not live.");
    const b = await lockBooking(conn, r.booking_id);
    await conn.execute("UPDATE reports SET status = 'rejected', remarks = CONCAT(remarks, ?) WHERE id = ?", [` [rejected: ${why}]`, r.id]);
    await applyRaw(conn, b.id, {}, {
      report_status: "report_pending",
      ...(b.status === "report_ready" ? { status: "processing" } : {}),
      updated_by: user.id,
    });
    await logActivity({
      conn,
      user,
      action: "reject",
      entity: "bookings",
      entityId: b.id,
      partnerId: b.partner_id,
      summary: `Report v${r.version} for ${bookingCode(b.id)} sent back to the lab — ${why}`,
    });
    return b;
  });
  if (out.partner_id) {
    await notify({
      type: "report.rejected",
      title: `Report for ${bookingCode(out.id)} needs re-upload`,
      body: why,
      link: `/crm/bookings/${out.id}`,
      partnerId: out.partner_id,
      severity: "danger",
    });
  }
  return { ok: true };
}

/** Mark the report as delivered to the patient. `via`: whatsapp | email | print | other. */
export async function sendReport(reportId, { user, via = "whatsapp" }) {
  const channel = ["whatsapp", "email", "print", "sms", "other"].includes(via) ? via : "other";
  const out = await transaction(async (conn) => {
    const r = await lockReport(conn, reportId);
    if (!["uploaded", "verified", "sent"].includes(r.status)) throw new UserError("That report is not live.");
    const b = await lockBooking(conn, r.booking_id);
    await conn.execute(
      "UPDATE reports SET status = 'sent', sent_by = ?, sent_at = UTC_TIMESTAMP(), sent_via = ? WHERE id = ?",
      [user.id, channel, r.id]
    );
    const toDelivered = stageIndex(b.status) < stageIndex("report_delivered");
    await applyRaw(conn, b.id, toDelivered ? stageEffects(b, "report_delivered") : {}, {
      ...(toDelivered ? { status: "report_delivered" } : {}),
      report_status: "sent",
      updated_by: user.id,
    });
    await logActivity({
      conn,
      user,
      action: "send",
      entity: "bookings",
      entityId: b.id,
      partnerId: b.partner_id,
      summary: `${user.name || user.email} sent report v${r.version} for ${bookingCode(b.id)} by ${channel}`,
      after: { report_id: r.id, via: channel },
    });
    return b;
  });
  await notify({
    type: "report.sent",
    title: `Report delivered · ${bookingCode(out.id)}`,
    body: out.patient_name,
    link: `/crm/bookings/${out.id}`,
    perm: "bookings.view",
    severity: "success",
  });
  return { ok: true };
}

/**
 * A file, if `user` may see it. Staff with reports.view see every report;
 * a partner only files stamped with their partner_id; a collector only
 * prescriptions on their own collections.
 */
export async function readFile(fileId, user, scope) {
  const [[f]] = await query("SELECT * FROM crm_files WHERE id = ? AND status = 'active'", [Number(fileId) || 0]);
  if (!f) return null;

  if (scope.partnerId) {
    if (Number(f.partner_id) !== Number(scope.partnerId)) return null;
    return f;
  }
  if (f.entity === "bookings" && (scope.collectorId || !user.perms.includes("reports.view")) && user.role !== "owner") {
    const s = scopeWhere(scope);
    const [[b]] = await query(
      `SELECT b.id FROM bookings b WHERE b.id = ? ${s.sql.length ? `AND ${s.sql.join(" AND ")}` : ""}`,
      [Number(f.entity_id) || 0, ...s.params]
    );
    if (!b || f.kind === "report") return null;
  }
  return f;
}

/** The live reports list (for /crm/reports), scoped. */
export async function listReportQueue({ status = null, search = "", limit = 25, offset = 0 } = {}, scope = {}) {
  const s = scopeWhere(scope);
  const where = ["b.deleted_at IS NULL", "b.status <> 'cancelled'", ...s.sql];
  const params = [...s.params];
  if (status === "overdue") {
    where.push("b.report_due_at IS NOT NULL AND b.report_due_at < UTC_TIMESTAMP() AND b.report_status IN ('sample_received','processing','report_pending','waiting')");
  } else if (status) {
    where.push("b.report_status = ?");
    params.push(status);
  } else {
    where.push("b.status IN ('sample_collected','sample_received','processing','report_ready','report_delivered')");
  }
  if (search) {
    const code = Number(String(search).replace(/^mb/i, "")) || 0;
    where.push("(b.patient_name LIKE ? OR b.id = ?)");
    params.push(`%${String(search).replace(/[%_]/g, "\\$&")}%`, code);
  }
  const clause = `WHERE ${where.join(" AND ")}`;
  const lim = Math.min(100, Math.max(1, Number(limit) || 25));
  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT b.id, b.patient_name, b.age, b.gender, b.status, b.report_status, b.partner_id, b.partner_status,
              b.sample_received_at, b.report_due_at, b.report_ready_at, b.delivered_at, b.city,
              p.name AS partner_name,
              (SELECT GROUP_CONCAT(i.name SEPARATOR ' + ') FROM booking_items i WHERE i.booking_id = b.id AND i.status = 'active') AS items_label,
              (SELECT r.id FROM reports r WHERE r.booking_id = b.id AND r.status IN ('uploaded','verified','sent') ORDER BY r.id DESC LIMIT 1) AS report_id,
              (SELECT r.file_id FROM reports r WHERE r.booking_id = b.id AND r.status IN ('uploaded','verified','sent') ORDER BY r.id DESC LIMIT 1) AS file_id,
              (SELECT r.status FROM reports r WHERE r.booking_id = b.id AND r.status IN ('uploaded','verified','sent') ORDER BY r.id DESC LIMIT 1) AS live_report_status
       FROM bookings b LEFT JOIN partners p ON p.id = b.partner_id
       ${clause}
       ORDER BY (b.report_due_at IS NULL), b.report_due_at ASC, b.id DESC
       LIMIT ${lim} OFFSET ${Math.max(0, Number(offset) || 0)}`,
      params
    ),
    query(`SELECT COUNT(*) AS n FROM bookings b ${clause}`, params),
  ]);
  return { rows, total: Number(count.n), limit: lim, offset: Math.max(0, Number(offset) || 0) };
}

