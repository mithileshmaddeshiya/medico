/**
 * Leads, calls and follow-ups — the call-centre side of the CRM. Server only.
 *
 * ── THE LEADS TABLE IS SHARED ────────────────────────────────────────────
 * The public website writes leads (source = form / cart_cod / cart_online)
 * and the old /admin panel still reads and moves them. So:
 *   - `source` is the website's column and is never written here (a lead a
 *     member of staff types in keeps the column default); `channel` is where
 *     the lead came from in business terms, and that is what the CRM shows.
 *   - old rows carry the panel's stage names (collected, done, lost,
 *     archived). They are READ as the nearest CRM status through
 *     LEAD_STATUS_SQL / leadStatus(); the CRM only ever writes its own keys.
 *   - the panel's `assigned_to` (free text) and `follow_up_on` (a DATE) are
 *     kept in step when the CRM assigns or schedules, so the old screen does
 *     not show stale information while both are in use.
 *
 * ── TIME ─────────────────────────────────────────────────────────────────
 * calls.called_at and follow_ups.due_at are UTC DATETIMEs. Forms use
 * <input type="datetime-local">, which the staff fill in IST; istInputToUtc()
 * converts on the way in and utcToIstInput() on the way back out.
 */
import { query, transaction } from "@/lib/db";

import { logActivity, notify } from "../activity";
import {
  CALL_OUTCOME,
  CONVERTED_LEAD,
  LEAD_STATUS,
  LEAD_STATUSES,
  LEGACY_LEAD_STATUS,
  SOURCE,
  leadCode,
} from "../constants";
import { range } from "../dates";
import { dateRangeOf } from "../filters";
import { UserError } from "../guard";
import { cleanPhone, validPhone } from "./customers";

const text = (value, max) => String(value ?? "").trim().slice(0, max);
const like = (value) => `%${String(value).replace(/[%_]/g, "\\$&")}%`;
const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";
const int = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

/* ── Vocabulary ───────────────────────────────────────────────────────── */

/** Where a lead came from. Same keys (and badge colours) as a booking's source. */
export const LEAD_CHANNELS = ["website", "phone", "whatsapp", "walk_in", "referral", "partner", "other"].map((k) => SOURCE[k]);
const CHANNEL_KEYS = LEAD_CHANNELS.map((c) => c.key);

/** Statuses a lead is still being worked in. */
export const OPEN_LEAD = ["new", "contacted", "follow_up"];
/** Closing a lead with one of these needs a reason. */
export const NEEDS_REASON = ["not_interested", "cancelled"];

const KNOWN = LEAD_STATUSES.map((s) => s.key);

/**
 * SQL: a lead row's status as a CRM key — legacy stage names mapped, anything
 * unrecognised read as "new". Built from constants only, so it is safe to
 * inline.
 */
export const LEAD_STATUS_SQL = `(CASE WHEN l.status IN (${KNOWN.map((k) => `'${k}'`).join(",")}) THEN l.status ${Object.entries(
  LEGACY_LEAD_STATUS
)
  .map(([from, to]) => `WHEN l.status = '${from}' THEN '${to}'`)
  .join(" ")} ELSE 'new' END)`;

const inList = (list) => list.map((k) => `'${k}'`).join(",");

/* ── Time helpers ─────────────────────────────────────────────────────── */

const IST_MIN = 330;
const sqlTime = (d) => d.toISOString().slice(0, 19).replace("T", " ");

/** "2026-09-25T14:30" typed in IST → "2026-09-25 09:00:00" UTC, or null. */
export function istInputToUtc(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(String(value ?? ""));
  if (!m) return null;
  const [, y, mo, d, h, mi] = m.map(Number);
  const utc = new Date(Date.UTC(y, mo - 1, d, h, mi) - IST_MIN * 60000);
  return Number.isNaN(utc.getTime()) ? null : utc;
}

/** A UTC instant → the "YYYY-MM-DDTHH:MM" a datetime-local input shows in IST. */
export function utcToIstInput(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Date(d.getTime() + IST_MIN * 60000).toISOString().slice(0, 16);
}

/** Tomorrow at 10:00 IST, as a datetime-local value — the usual call-back default. */
export function defaultFollowUpInput() {
  const ist = new Date(Date.now() + IST_MIN * 60000 + 86400000);
  return `${ist.toISOString().slice(0, 10)}T10:00`;
}

/** "in 3 h", "in 2 days", "20 min overdue", "2 days overdue". */
export function fromNow(value, now = Date.now()) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const s = Math.round((d.getTime() - now) / 1000);
  const abs = Math.abs(s);
  const span =
    abs < 60
      ? "now"
      : abs < 3600
        ? `${Math.round(abs / 60)} min`
        : abs < 86400
          ? `${Math.round(abs / 3600)} h`
          : `${Math.round(abs / 86400)} day${Math.round(abs / 86400) === 1 ? "" : "s"}`;
  if (span === "now") return "due now";
  return s >= 0 ? `in ${span}` : `${span} overdue`;
}

/** Seconds → "3 min 20 s". */
export function duration(sec) {
  const n = Math.max(0, Math.round(Number(sec) || 0));
  if (!n) return "—";
  const m = Math.floor(n / 60);
  const s = n % 60;
  return m ? `${m} min${s ? ` ${s} s` : ""}` : `${s} s`;
}

/* ── Shared validation ────────────────────────────────────────────────── */

async function staffMember(id, exec = query) {
  if (!id) return null;
  const [[u]] = await exec("SELECT id, name, email, role FROM admin_users WHERE id = ? AND status = 'active'", [Number(id)]);
  if (!u || u.role === "partner") throw new UserError("Pick an active staff member.");
  return u;
}

function readCall(input) {
  const direction = input.direction === "outbound" ? "outbound" : "inbound";
  const outcome = CALL_OUTCOME[input.outcome] ? input.outcome : "answered";
  const minutes = Number(String(input.durationMin ?? "").replace(",", "."));
  const durationSec = Number.isFinite(minutes) && minutes > 0 ? Math.min(6 * 3600, Math.round(minutes * 60)) : 0;
  return { direction, outcome, durationSec, notes: text(input.notes, 1000) };
}

/* ── Leads: filters and lists ─────────────────────────────────────────── */

/** URL → lead filters. Shared by /crm/leads and the `leads` export. */
export function leadFiltersFrom(sp, { user = null } = {}) {
  const r = dateRangeOf(sp);
  const assigned = one(sp.assigned);
  return {
    from: r?.from ?? null,
    to: r?.to ?? null,
    rangeLabel: r?.label ?? null,
    status: LEAD_STATUS[one(sp.status)] ? one(sp.status) : null,
    channel: CHANNEL_KEYS.includes(one(sp.channel)) ? one(sp.channel) : null,
    city: text(one(sp.city), 80) || null,
    unassigned: assigned === "none",
    assignedUserId: assigned === "me" ? user?.id ?? null : int(assigned),
    search: text(one(sp.q), 80),
  };
}

function leadWhere(f, { withStatus = true } = {}) {
  const where = ["l.deleted_at IS NULL"];
  const params = [];
  if (f.from) {
    where.push("l.created_at >= ?");
    params.push(f.from);
  }
  if (f.to) {
    where.push("l.created_at < ?");
    params.push(f.to);
  }
  if (withStatus && f.status) {
    where.push(`${LEAD_STATUS_SQL} = ?`);
    params.push(f.status);
  }
  if (f.channel) {
    where.push("l.channel = ?");
    params.push(f.channel);
  }
  if (f.city) {
    where.push("l.city = ?");
    params.push(f.city);
  }
  if (f.unassigned) where.push("l.assigned_user_id IS NULL");
  else if (f.assignedUserId) {
    where.push("l.assigned_user_id = ?");
    params.push(f.assignedUserId);
  }
  if (f.search) {
    const q = f.search;
    const digits = q.replace(/\D/g, "");
    const code = /^\s*ld\s*0*(\d+)\s*$/i.exec(q);
    const ors = ["l.name LIKE ?"];
    params.push(like(q));
    if (code) {
      ors.push("l.id = ?");
      params.push(Number(code[1]));
    }
    if (digits.length >= 4) {
      ors.push("l.phone LIKE ?");
      params.push(like(digits));
    }
    where.push(`(${ors.join(" OR ")})`);
  }
  return { sql: `WHERE ${where.join(" AND ")}`, params };
}

export async function listLeads(filters = {}) {
  const w = leadWhere(filters);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 25));
  const offset = Math.max(0, Number(filters.offset) || 0);
  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT l.*, ${LEAD_STATUS_SQL} AS crm_status, u.name AS assigned_name,
              (SELECT MIN(f.due_at) FROM follow_ups f WHERE f.lead_id = l.id AND f.status = 'pending') AS next_follow_up,
              (SELECT COUNT(*) FROM calls c WHERE c.lead_id = l.id) AS calls_count
       FROM leads l
       LEFT JOIN admin_users u ON u.id = l.assigned_user_id
       ${w.sql}
       ORDER BY l.created_at DESC, l.id DESC
       LIMIT ${limit} OFFSET ${offset}`,
      w.params
    ),
    query(`SELECT COUNT(*) AS n FROM leads l ${w.sql}`, w.params),
  ]);
  return { rows, total: Number(count.n), limit, offset };
}

/** Lead counts per CRM status under the same filters (for the tabs). */
export async function leadStatusCounts(filters = {}) {
  const w = leadWhere(filters, { withStatus: false });
  const [rows] = await query(`SELECT ${LEAD_STATUS_SQL} AS s, COUNT(*) AS n FROM leads l ${w.sql} GROUP BY s`, w.params);
  const out = Object.fromEntries(KNOWN.map((k) => [k, 0]));
  for (const r of rows) out[r.s] = Number(r.n);
  return out;
}

/** The call-centre KPI strip for a named period. */
export async function leadKpis(period = "7d") {
  const r = range(period) ?? range("7d");
  const today = range("today");
  const [[[calls]], [[leads]], [[fu]], [[rev]]] = await Promise.all([
    query(
      `SELECT COUNT(*) AS n, COALESCE(SUM(direction = 'inbound' AND outcome = 'missed'), 0) AS missed
       FROM calls WHERE called_at >= ? AND called_at < ?`,
      [r.from, r.to]
    ),
    query(
      `SELECT COUNT(*) AS n,
              COALESCE(SUM(l.status IN (${inList(CONVERTED_LEAD)}) OR l.booking_id IS NOT NULL), 0) AS converted
       FROM leads l WHERE l.deleted_at IS NULL AND l.created_at >= ? AND l.created_at < ?`,
      [r.from, r.to]
    ),
    query(
      `SELECT COALESCE(SUM(due_at >= ? AND due_at < ?), 0) AS today,
              COALESCE(SUM(due_at < UTC_TIMESTAMP()), 0) AS overdue
       FROM follow_ups WHERE status = 'pending'`,
      [today.from, today.to]
    ),
    query(
      `SELECT COALESCE(SUM(b.final_amount), 0) AS amount, COUNT(*) AS n
       FROM bookings b LEFT JOIN leads l ON l.id = b.lead_id
       WHERE b.deleted_at IS NULL AND b.status <> 'cancelled'
         AND b.created_at >= ? AND b.created_at < ?
         AND (b.source IN ('phone','whatsapp') OR l.channel IN ('phone','whatsapp'))`,
      [r.from, r.to]
    ),
  ]);
  const newLeads = Number(leads.n);
  const converted = Number(leads.converted);
  return {
    label: r.label,
    calls: Number(calls.n),
    missed: Number(calls.missed),
    newLeads,
    converted,
    conversion: newLeads ? (converted / newLeads) * 100 : null,
    dueToday: Number(fu.today),
    overdue: Number(fu.overdue),
    revenue: Number(rev.amount),
    revenueBookings: Number(rev.n),
  };
}

/* ── One lead ─────────────────────────────────────────────────────────── */

export async function getLead(id) {
  const leadId = Number(id) || 0;
  const [rows] = await query(
    `SELECT l.*, ${LEAD_STATUS_SQL} AS crm_status, u.name AS assigned_name, cb.name AS created_by_name,
            COALESCE(l.customer_id, (SELECT c2.id FROM customers c2 WHERE c2.phone = l.phone AND c2.status = 'active' LIMIT 1)) AS matched_customer_id
     FROM leads l
     LEFT JOIN admin_users u ON u.id = l.assigned_user_id
     LEFT JOIN admin_users cb ON cb.id = l.created_by
     WHERE l.id = ? LIMIT 1`,
    [leadId]
  );
  const lead = rows[0];
  if (!lead) return null;
  const [[bookings], [customer]] = await Promise.all([
    query(
      `SELECT id, status, final_amount, created_at FROM bookings
       WHERE deleted_at IS NULL AND (lead_id = ? OR id = ?) ORDER BY id DESC`,
      [leadId, lead.booking_id ?? 0]
    ),
    lead.matched_customer_id
      ? query("SELECT id, name, phone FROM customers WHERE id = ?", [lead.matched_customer_id])
      : Promise.resolve([[]]),
  ]);
  return { ...lead, bookings, customer: customer[0] ?? null };
}

/**
 * An open lead on this phone from the last 30 days — the duplicate a new
 * enquiry most likely is.
 */
export async function findOpenLead(phone, { excludeId = null } = {}) {
  const [rows] = await query(
    `SELECT l.id, l.name, l.created_at, ${LEAD_STATUS_SQL} AS crm_status FROM leads l
     WHERE l.phone = ? AND l.deleted_at IS NULL
       AND l.created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY)
       AND ${LEAD_STATUS_SQL} IN (${inList(OPEN_LEAD)})
       ${excludeId ? "AND l.id <> ?" : ""}
     ORDER BY l.id DESC LIMIT 1`,
    excludeId ? [cleanPhone(phone), Number(excludeId)] : [cleanPhone(phone)]
  );
  return rows[0] ?? null;
}

/**
 * Create a lead from the CRM (a call, a WhatsApp message, a walk-in).
 *
 * input: { name, phone, channel, test, interestedPackage, city, area, address,
 *          assignedUserId, followUpAt (IST datetime-local), followUpNote, notes,
 *          call: { direction, outcome, durationMin, notes } | null }
 *
 * Returns { duplicate } instead of saving when an open lead on the same phone
 * exists and `force` is not set, so the form can offer the existing one.
 */
export async function createLead(input, { user, force = false }) {
  const phone = cleanPhone(input.phone);
  if (!validPhone(phone)) throw new UserError("Enter a valid 10-digit mobile number.");
  const name = text(input.name, 80);
  if (!name) throw new UserError("Enter the person's name.");
  const channel = CHANNEL_KEYS.includes(input.channel) ? input.channel : "phone";
  const assignee = await staffMember(int(input.assignedUserId));
  const followUpAt = input.followUpAt ? istInputToUtc(input.followUpAt) : null;
  if (input.followUpAt && !followUpAt) throw new UserError("The follow-up time is not valid.");
  const call = input.call ? readCall(input.call) : null;

  if (!force) {
    const duplicate = await findOpenLead(phone);
    if (duplicate) return { duplicate };
  }

  const status = followUpAt ? "follow_up" : call && call.outcome === "answered" ? "contacted" : "new";

  const out = await transaction(async (conn) => {
    const [[customer]] = await conn.execute("SELECT id FROM customers WHERE phone = ? AND status = 'active' LIMIT 1", [phone]);
    const [res] = await conn.execute(
      `INSERT INTO leads (name, phone, city, address, test, status, channel, area, interested_package,
                          customer_id, assigned_user_id, assigned_to, follow_up_on, created_by, notes, status_changed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())`,
      [
        name,
        phone,
        text(input.city, 80),
        text(input.address, 400),
        text(input.test, 400),
        status,
        channel,
        text(input.area, 120),
        text(input.interestedPackage, 200),
        customer?.id ?? null,
        assignee?.id ?? null,
        text(assignee?.name ?? "", 80),
        followUpAt ? utcToIstInput(followUpAt).slice(0, 10) : null,
        user?.id ?? null,
        text(input.notes, 1000),
      ]
    );
    const id = res.insertId;

    await logActivity({
      conn,
      user,
      action: "create",
      entity: "leads",
      entityId: id,
      summary: `Created lead ${leadCode(id)} for ${name} (${SOURCE[channel].label})`,
      after: { channel, status, test: text(input.test, 200), package: text(input.interestedPackage, 200), assigned_user_id: assignee?.id ?? null },
    });

    let callId = null;
    if (call) {
      const [c] = await conn.execute(
        `INSERT INTO calls (lead_id, customer_id, phone, name, direction, outcome, duration_sec, notes, user_id, called_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())`,
        [id, customer?.id ?? null, phone, name, call.direction, call.outcome, call.durationSec, call.notes, user?.id ?? null]
      );
      callId = c.insertId;
      await logActivity({
        conn,
        user,
        action: "create",
        entity: "calls",
        entityId: callId,
        summary: `Logged ${call.direction} call with ${name} · ${CALL_OUTCOME[call.outcome].label} · ${leadCode(id)}`,
        after: { lead_id: id, ...call },
      });
    }

    let followUpUser = null;
    if (followUpAt) {
      followUpUser = assignee?.id ?? user?.id ?? null;
      const [f] = await conn.execute(
        `INSERT INTO follow_ups (lead_id, customer_id, due_at, assigned_user_id, note, created_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, customer?.id ?? null, sqlTime(followUpAt), followUpUser, text(input.followUpNote, 500) || `Call back ${name}`, user?.id ?? null]
      );
      await logActivity({
        conn,
        user,
        action: "create",
        entity: "follow_ups",
        entityId: f.insertId,
        summary: `Scheduled follow-up with ${name} (${leadCode(id)}) for ${utcToIstInput(followUpAt).replace("T", " ")} IST`,
        after: { lead_id: id, due_at: sqlTime(followUpAt), assigned_user_id: followUpUser },
      });
    }
    return { id, callId, followUpUser };
  });

  await notify({
    type: "lead.new",
    title: `New lead ${leadCode(out.id)} · ${name}`,
    body: [SOURCE[channel].label, text(input.city, 80), text(input.test, 120)].filter(Boolean).join(" · "),
    link: `/crm/leads/${out.id}`,
    perm: "leads.view",
  });
  if (assignee && assignee.id !== user?.id) {
    await notify({ type: "lead.assigned", title: `Lead assigned to you · ${name}`, body: leadCode(out.id), link: `/crm/leads/${out.id}`, userId: assignee.id });
  } else if (out.followUpUser && out.followUpUser !== user?.id) {
    await notify({ type: "followup.assigned", title: `Follow-up assigned to you · ${name}`, link: "/crm/follow-ups", userId: out.followUpUser });
  }
  return { id: out.id };
}

async function lockLead(conn, id) {
  const [rows] = await conn.execute(
    `SELECT l.*, ${LEAD_STATUS_SQL} AS crm_status FROM leads l WHERE l.id = ? AND l.deleted_at IS NULL FOR UPDATE`,
    [Number(id) || 0]
  );
  if (!rows[0]) throw new UserError("That lead was not found.");
  return rows[0];
}

/**
 * Move a lead along the pipeline. "Booked" is set by converting it (the new
 * booking form does that); "Completed" only once it is booked. Not interested
 * and Cancelled need a reason, which is kept as a note on the lead, and close
 * any call-backs still pending.
 */
export async function setLeadStatus(id, status, { user, reason = "" }) {
  if (!LEAD_STATUS[status]) throw new UserError("Unknown status.");
  const why = text(reason, 300);
  if (NEEDS_REASON.includes(status) && !why) throw new UserError(`Say why the lead is ${LEAD_STATUS[status].label.toLowerCase()}.`);

  return transaction(async (conn) => {
    const l = await lockLead(conn, id);
    if (l.crm_status === status && l.status === status) return { changed: false };
    if (status === "booked" && !l.booking_id) throw new UserError("Convert the lead to a booking to mark it booked.");
    if (status === "completed" && !l.booking_id && l.crm_status !== "booked") throw new UserError("Only a booked lead can be completed.");

    await conn.execute("UPDATE leads SET status = ?, status_changed_at = UTC_TIMESTAMP() WHERE id = ?", [status, l.id]);

    let cancelled = 0;
    if (NEEDS_REASON.includes(status) || status === "completed") {
      const [res] = await conn.execute(
        "UPDATE follow_ups SET status = 'cancelled', done_at = UTC_TIMESTAMP(), done_by = ? WHERE lead_id = ? AND status = 'pending'",
        [user?.id ?? null, l.id]
      );
      cancelled = res.affectedRows;
    }
    if (why) {
      await conn.execute("INSERT INTO admin_notes (entity, entity_id, body, user_id, user_email) VALUES ('lead', ?, ?, ?, ?)", [
        String(l.id),
        `${LEAD_STATUS[status].label}: ${why}`,
        user?.id ?? null,
        user?.email ?? "",
      ]);
    }
    await logActivity({
      conn,
      user,
      action: "status",
      entity: "leads",
      entityId: l.id,
      summary: `${leadCode(l.id)}: ${LEAD_STATUS[l.crm_status]?.label ?? l.status} → ${LEAD_STATUS[status].label}${why ? ` (${why.slice(0, 120)})` : ""}${cancelled ? ` · ${cancelled} follow-up${cancelled === 1 ? "" : "s"} cancelled` : ""}`,
      before: { status: l.status },
      after: { status, ...(why ? { reason: why } : {}) },
    });
    return { changed: true };
  });
}

/** Give a lead to a member of staff (or take it back). */
export async function assignLead(id, assignedUserId, { user }) {
  const assignee = await staffMember(int(assignedUserId));
  const out = await transaction(async (conn) => {
    const l = await lockLead(conn, id);
    if (Number(l.assigned_user_id ?? 0) === Number(assignee?.id ?? 0)) return { l, changed: false };
    await conn.execute("UPDATE leads SET assigned_user_id = ?, assigned_to = ? WHERE id = ?", [
      assignee?.id ?? null,
      text(assignee?.name ?? "", 80),
      l.id,
    ]);
    await logActivity({
      conn,
      user,
      action: "assign",
      entity: "leads",
      entityId: l.id,
      summary: assignee ? `Assigned ${leadCode(l.id)} to ${assignee.name || assignee.email}` : `Unassigned ${leadCode(l.id)}`,
      before: { assigned_user_id: l.assigned_user_id },
      after: { assigned_user_id: assignee?.id ?? null },
    });
    return { l, changed: true };
  });
  if (out.changed && assignee && assignee.id !== user?.id) {
    await notify({
      type: "lead.assigned",
      title: `Lead assigned to you · ${out.l.name}`,
      body: [leadCode(out.l.id), out.l.test].filter(Boolean).join(" · ").slice(0, 200),
      link: `/crm/leads/${out.l.id}`,
      userId: assignee.id,
    });
  }
  return out;
}

/* ── Calls ────────────────────────────────────────────────────────────── */

/** URL → call-log filters. Shared by /crm/calls and the `calls` export. */
export function callFiltersFrom(sp, { user = null } = {}) {
  const r = dateRangeOf(sp);
  const staff = one(sp.staff);
  return {
    from: r?.from ?? null,
    to: r?.to ?? null,
    rangeLabel: r?.label ?? null,
    direction: ["inbound", "outbound"].includes(one(sp.direction)) ? one(sp.direction) : null,
    outcome: CALL_OUTCOME[one(sp.outcome)] ? one(sp.outcome) : null,
    userId: staff === "me" ? user?.id ?? null : int(staff),
    search: text(one(sp.q), 80),
  };
}

function callWhere(f) {
  const where = ["1 = 1"];
  const params = [];
  if (f.from) {
    where.push("c.called_at >= ?");
    params.push(f.from);
  }
  if (f.to) {
    where.push("c.called_at < ?");
    params.push(f.to);
  }
  if (f.direction) {
    where.push("c.direction = ?");
    params.push(f.direction);
  }
  if (f.outcome) {
    where.push("c.outcome = ?");
    params.push(f.outcome);
  }
  if (f.userId) {
    where.push("c.user_id = ?");
    params.push(f.userId);
  }
  if (f.leadId) {
    where.push("c.lead_id = ?");
    params.push(Number(f.leadId));
  }
  if (f.customerId) {
    // A customer's calls: linked to the profile, or simply from their number.
    where.push("(c.customer_id = ? OR c.phone = ?)");
    params.push(Number(f.customerId), cleanPhone(f.customerPhone ?? ""));
  }
  if (f.search) {
    const digits = f.search.replace(/\D/g, "");
    const ors = ["c.name LIKE ?"];
    params.push(like(f.search));
    if (digits.length >= 4) {
      ors.push("c.phone LIKE ?");
      params.push(like(digits));
    }
    where.push(`(${ors.join(" OR ")})`);
  }
  return { sql: `WHERE ${where.join(" AND ")}`, params };
}

export async function listCalls(filters = {}) {
  const w = callWhere(filters);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 25));
  const offset = Math.max(0, Number(filters.offset) || 0);
  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT c.*, u.name AS user_name, l.name AS lead_name, cu.name AS customer_name
       FROM calls c
       LEFT JOIN admin_users u ON u.id = c.user_id
       LEFT JOIN leads l ON l.id = c.lead_id
       LEFT JOIN customers cu ON cu.id = c.customer_id
       ${w.sql}
       ORDER BY c.called_at DESC, c.id DESC
       LIMIT ${limit} OFFSET ${offset}`,
      w.params
    ),
    query(`SELECT COUNT(*) AS n FROM calls c ${w.sql}`, w.params),
  ]);
  return { rows, total: Number(count.n), limit, offset };
}

export async function callStats(filters = {}) {
  const w = callWhere(filters);
  const [[s]] = await query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(c.direction = 'inbound'), 0) AS inbound,
            COALESCE(SUM(c.direction = 'outbound'), 0) AS outbound,
            COALESCE(SUM(c.direction = 'inbound' AND c.outcome = 'missed'), 0) AS missed,
            COALESCE(SUM(c.direction = 'outbound' AND c.outcome IN ('no_answer','busy','switched_off')), 0) AS unreached,
            AVG(CASE WHEN c.outcome = 'answered' AND c.duration_sec > 0 THEN c.duration_sec END) AS avg_sec
     FROM calls c ${w.sql}`,
    w.params
  );
  return {
    total: Number(s.total),
    inbound: Number(s.inbound),
    outbound: Number(s.outbound),
    missed: Number(s.missed),
    unreached: Number(s.unreached),
    avgSec: s.avg_sec === null ? null : Number(s.avg_sec),
  };
}

/**
 * Log one call. The number is matched server-side: to the open (or recent)
 * lead on it and to the customer on it, unless the form named them. An
 * answered call on a "new" lead moves it to "contacted".
 *
 * input: { phone, name, direction, outcome, durationMin, notes, calledAt,
 *          leadId, customerId, bookingId, createLead }
 */
export async function logCall(input, { user }) {
  const phone = cleanPhone(input.phone);
  if (!validPhone(phone)) throw new UserError("Enter a valid 10-digit mobile number.");
  const call = readCall(input);
  const calledAt = input.calledAt ? istInputToUtc(input.calledAt) : null;
  if (input.calledAt && !calledAt) throw new UserError("The call time is not valid.");
  if (calledAt && calledAt.getTime() > Date.now() + 5 * 60000) throw new UserError("The call time is in the future.");
  let name = text(input.name, 80);

  const out = await transaction(async (conn) => {
    let lead = null;
    if (input.leadId) {
      lead = await lockLead(conn, input.leadId);
    } else {
      const [rows] = await conn.execute(
        `SELECT l.*, ${LEAD_STATUS_SQL} AS crm_status FROM leads l
         WHERE l.phone = ? AND l.deleted_at IS NULL
           AND (${LEAD_STATUS_SQL} IN (${inList(OPEN_LEAD)}) OR l.created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY))
         ORDER BY ${LEAD_STATUS_SQL} IN (${inList(OPEN_LEAD)}) DESC, l.id DESC LIMIT 1`,
        [phone]
      );
      lead = rows[0] ?? null;
    }
    let customerId = int(input.customerId);
    if (!customerId) {
      const [[c]] = await conn.execute("SELECT id, name FROM customers WHERE phone = ? AND status = 'active' LIMIT 1", [phone]);
      customerId = c?.id ?? null;
      if (!name && c) name = c.name;
    }
    if (!name && lead) name = lead.name;

    let createdLead = null;
    if (!lead && input.createLead && call.outcome === "answered") {
      if (!name) throw new UserError("Enter the caller's name to create a lead.");
      const [res] = await conn.execute(
        `INSERT INTO leads (name, phone, city, test, status, channel, customer_id, assigned_user_id, assigned_to, created_by, notes, status_changed_at)
         VALUES (?, ?, '', ?, 'contacted', 'phone', ?, ?, ?, ?, ?, UTC_TIMESTAMP())`,
        [name, phone, text(input.test, 400), customerId, user?.id ?? null, text(user?.name ?? "", 80), user?.id ?? null, call.notes.slice(0, 1000)]
      );
      createdLead = res.insertId;
      lead = { id: createdLead, name, crm_status: "contacted", status: "contacted" };
      await logActivity({
        conn,
        user,
        action: "create",
        entity: "leads",
        entityId: createdLead,
        summary: `Created lead ${leadCode(createdLead)} for ${name} from a call`,
        after: { channel: "phone", status: "contacted" },
      });
    }

    const [res] = await conn.execute(
      `INSERT INTO calls (lead_id, customer_id, booking_id, phone, name, direction, outcome, duration_sec, notes, user_id, called_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, UTC_TIMESTAMP()))`,
      [
        lead?.id ?? null,
        customerId,
        int(input.bookingId),
        phone,
        name,
        call.direction,
        call.outcome,
        call.durationSec,
        call.notes,
        user?.id ?? null,
        calledAt ? sqlTime(calledAt) : null,
      ]
    );
    await logActivity({
      conn,
      user,
      action: "create",
      entity: "calls",
      entityId: res.insertId,
      summary: `Logged ${call.direction} call ${call.direction === "inbound" ? "from" : "to"} ${name || phone} · ${CALL_OUTCOME[call.outcome].label}${lead ? ` · ${leadCode(lead.id)}` : ""}`,
      after: { phone, lead_id: lead?.id ?? null, customer_id: customerId, ...call },
    });
    // Also on the lead's own history, so its timeline reads as one story.
    if (lead && !createdLead) {
      await logActivity({
        conn,
        user,
        action: "call",
        entity: "leads",
        entityId: lead.id,
        summary: `${call.direction === "inbound" ? "Inbound" : "Outbound"} call · ${CALL_OUTCOME[call.outcome].label}${call.durationSec ? ` · ${duration(call.durationSec)}` : ""}`,
      });
    }

    if (lead && !createdLead && lead.crm_status === "new" && call.outcome === "answered") {
      await conn.execute("UPDATE leads SET status = 'contacted', status_changed_at = UTC_TIMESTAMP() WHERE id = ?", [lead.id]);
      await logActivity({
        conn,
        user,
        action: "status",
        entity: "leads",
        entityId: lead.id,
        summary: `${leadCode(lead.id)}: New → Contacted (call answered)`,
        before: { status: lead.status },
        after: { status: "contacted" },
      });
    }
    return { id: res.insertId, leadId: lead?.id ?? null, createdLead, customerId };
  });

  if (out.createdLead) {
    await notify({ type: "lead.new", title: `New lead ${leadCode(out.createdLead)} · ${name}`, body: "From a phone call", link: `/crm/leads/${out.createdLead}`, perm: "leads.view" });
  }
  return out;
}

/* ── Follow-ups ───────────────────────────────────────────────────────── */

export const FOLLOW_UP_TABS = [
  { key: "overdue", label: "Overdue" },
  { key: "today", label: "Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "done", label: "Done" },
];

function followUpTabWhere(tab) {
  const today = range("today");
  switch (tab) {
    case "overdue":
      return { sql: "f.status = 'pending' AND f.due_at < UTC_TIMESTAMP()", params: [] };
    case "today":
      return { sql: "f.status = 'pending' AND f.due_at >= UTC_TIMESTAMP() AND f.due_at < ?", params: [today.to] };
    case "upcoming":
      return { sql: "f.status = 'pending' AND f.due_at >= ?", params: [today.to] };
    default:
      return { sql: "f.status IN ('done','cancelled')", params: [] };
  }
}

/** Follow-ups for one tab, optionally one person's. */
export async function listFollowUps({ tab = "today", assigneeId = null, limit = 25, offset = 0 } = {}) {
  const t = followUpTabWhere(tab);
  const where = [t.sql];
  const params = [...t.params];
  if (assigneeId === "none") where.push("f.assigned_user_id IS NULL");
  else if (assigneeId) {
    where.push("f.assigned_user_id = ?");
    params.push(Number(assigneeId));
  }
  const clause = `WHERE ${where.join(" AND ")}`;
  const lim = Math.min(100, Math.max(1, Number(limit) || 25));
  const off = Math.max(0, Number(offset) || 0);
  const order = tab === "done" ? "COALESCE(f.done_at, f.created_at) DESC" : tab === "overdue" ? "f.due_at DESC" : "f.due_at ASC";
  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT f.*, l.name AS lead_name, l.phone AS lead_phone, l.test AS lead_test, l.interested_package AS lead_package,
              ${LEAD_STATUS_SQL} AS lead_status, cu.name AS customer_name, cu.phone AS customer_phone,
              u.name AS assignee_name, d.name AS done_by_name
       FROM follow_ups f
       LEFT JOIN leads l ON l.id = f.lead_id
       LEFT JOIN customers cu ON cu.id = f.customer_id
       LEFT JOIN admin_users u ON u.id = f.assigned_user_id
       LEFT JOIN admin_users d ON d.id = f.done_by
       ${clause}
       ORDER BY ${order}, f.id DESC
       LIMIT ${lim} OFFSET ${off}`,
      params
    ),
    query(`SELECT COUNT(*) AS n FROM follow_ups f ${clause}`, params),
  ]);
  return { rows, total: Number(count.n), limit: lim, offset: off };
}

export async function followUpCounts({ assigneeId = null } = {}) {
  const out = {};
  await Promise.all(
    FOLLOW_UP_TABS.map(async (t) => {
      const w = followUpTabWhere(t.key);
      const params = [...w.params];
      let extra = "";
      if (assigneeId === "none") extra = "AND f.assigned_user_id IS NULL";
      else if (assigneeId) {
        extra = "AND f.assigned_user_id = ?";
        params.push(Number(assigneeId));
      }
      const [[r]] = await query(`SELECT COUNT(*) AS n FROM follow_ups f WHERE ${w.sql} ${extra}`, params);
      out[t.key] = Number(r.n);
    })
  );
  return out;
}

/** Follow-ups on a lead or a customer (their detail pages). */
export async function followUpsFor({ leadId = null, customerId = null }) {
  const [rows] = await query(
    `SELECT f.*, u.name AS assignee_name, d.name AS done_by_name, cb.name AS created_by_name
     FROM follow_ups f
     LEFT JOIN admin_users u ON u.id = f.assigned_user_id
     LEFT JOIN admin_users d ON d.id = f.done_by
     LEFT JOIN admin_users cb ON cb.id = f.created_by
     WHERE ${leadId ? "f.lead_id = ?" : "f.customer_id = ?"}
     ORDER BY f.status = 'pending' DESC, f.due_at DESC LIMIT 100`,
    [Number(leadId ?? customerId) || 0]
  );
  return rows;
}

/**
 * Schedule a call-back on a lead or a customer. A new/contacted lead moves to
 * "Follow-up". The assignee (default: the lead's owner, else whoever
 * scheduled it) is notified when it is someone else.
 */
export async function scheduleFollowUp(input, { user }) {
  const leadId = int(input.leadId);
  let customerId = int(input.customerId);
  if (!leadId && !customerId) throw new UserError("A follow-up needs a lead or a customer.");
  const due = istInputToUtc(input.dueAt);
  if (!due) throw new UserError("Pick the date and time to call back.");
  if (due.getTime() < Date.now() - 5 * 60000) throw new UserError("Pick a time in the future.");
  const note = text(input.note, 500);

  const out = await transaction(async (conn) => {
    let lead = null;
    if (leadId) {
      lead = await lockLead(conn, leadId);
      if (!OPEN_LEAD.includes(lead.crm_status) && lead.crm_status !== "booked") {
        throw new UserError(`This lead is ${LEAD_STATUS[lead.crm_status].label.toLowerCase()} — reopen it first.`);
      }
      customerId = customerId ?? lead.customer_id ?? null;
    }
    // An explicit choice must be valid; the default (the lead's owner, else
    // whoever is scheduling) quietly falls back if that account is gone.
    const exec = conn.execute.bind(conn);
    const explicit = int(input.assignedUserId);
    let assignee = explicit ? await staffMember(explicit, exec) : null;
    if (!explicit) {
      assignee = await staffMember(lead?.assigned_user_id ?? user?.id, exec).catch(() => null);
      if (!assignee && user?.id) assignee = await staffMember(user.id, exec).catch(() => null);
    }
    const who = lead?.name ?? (customerId ? (await conn.execute("SELECT name FROM customers WHERE id = ?", [customerId]))[0][0]?.name : "") ?? "";

    const [res] = await conn.execute(
      `INSERT INTO follow_ups (lead_id, customer_id, booking_id, due_at, assigned_user_id, note, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [lead?.id ?? null, customerId, int(input.bookingId), sqlTime(due), assignee?.id ?? null, note || `Call back ${who}`.trim(), user?.id ?? null]
    );
    await logActivity({
      conn,
      user,
      action: "create",
      entity: "follow_ups",
      entityId: res.insertId,
      summary: `Scheduled follow-up with ${who || "customer"} for ${utcToIstInput(due).replace("T", " ")} IST${assignee ? ` · ${assignee.name || assignee.email}` : ""}`,
      after: { lead_id: lead?.id ?? null, customer_id: customerId, due_at: sqlTime(due), assigned_user_id: assignee?.id ?? null, note },
    });

    if (lead) {
      const moves = ["new", "contacted"].includes(lead.crm_status);
      await conn.execute(
        `UPDATE leads SET follow_up_on = ?${moves ? ", status = 'follow_up', status_changed_at = UTC_TIMESTAMP()" : ""} WHERE id = ?`,
        [utcToIstInput(due).slice(0, 10), lead.id]
      );
      await logActivity({
        conn,
        user,
        action: moves ? "status" : "follow_up",
        entity: "leads",
        entityId: lead.id,
        summary: `Follow-up set for ${utcToIstInput(due).replace("T", " ")} IST${moves ? ` · ${LEAD_STATUS[lead.crm_status].label} → Follow-up` : ""}`,
        before: moves ? { status: lead.status } : null,
        after: moves ? { status: "follow_up" } : null,
      });
    }
    return { id: res.insertId, assignee, who, lead };
  });

  if (out.assignee && out.assignee.id !== user?.id) {
    await notify({
      type: "followup.assigned",
      title: `Follow-up for you · ${out.who || "customer"}`,
      body: `${utcToIstInput(due).replace("T", " ")} IST${note ? ` · ${note.slice(0, 120)}` : ""}`,
      link: out.lead ? `/crm/leads/${out.lead.id}` : "/crm/follow-ups",
      userId: out.assignee.id,
    });
  }
  return { id: out.id };
}

async function lockFollowUp(conn, id) {
  const [[f]] = await conn.execute(
    `SELECT f.*, COALESCE(l.name, cu.name, '') AS who, l.phone AS lead_phone, cu.phone AS customer_phone
     FROM follow_ups f LEFT JOIN leads l ON l.id = f.lead_id LEFT JOIN customers cu ON cu.id = f.customer_id
     WHERE f.id = ? FOR UPDATE`,
    [Number(id) || 0]
  );
  if (!f) throw new UserError("That follow-up was not found.");
  return f;
}

/**
 * Mark a follow-up done. The outcome note goes on the lead (or customer) as
 * a note; with `call` set it is also logged as an outbound call. A lead in
 * "Follow-up" with nothing else pending goes back to "Contacted".
 */
export async function completeFollowUp(id, { user, note = "", call = null }) {
  const outcome = text(note, 1000);
  const result = await transaction(async (conn) => {
    const f = await lockFollowUp(conn, id);
    if (f.status !== "pending") throw new UserError("This follow-up is already closed.");
    await conn.execute("UPDATE follow_ups SET status = 'done', done_at = UTC_TIMESTAMP(), done_by = ? WHERE id = ?", [user?.id ?? null, f.id]);
    await logActivity({
      conn,
      user,
      action: "done",
      entity: "follow_ups",
      entityId: f.id,
      summary: `Follow-up with ${f.who || "customer"} done${outcome ? ` — ${outcome.slice(0, 140)}` : ""}`,
      before: { status: "pending" },
      after: { status: "done", outcome },
    });
    if (outcome) {
      const [entity, entityId] = f.lead_id ? ["lead", f.lead_id] : ["customer", f.customer_id];
      if (entityId) {
        await conn.execute("INSERT INTO admin_notes (entity, entity_id, body, user_id, user_email) VALUES (?, ?, ?, ?, ?)", [
          entity,
          String(entityId),
          `Follow-up: ${outcome}`,
          user?.id ?? null,
          user?.email ?? "",
        ]);
      }
    }
    if (f.lead_id) {
      const [[l]] = await conn.execute(`SELECT l.id, l.status, ${LEAD_STATUS_SQL} AS crm_status FROM leads l WHERE l.id = ?`, [f.lead_id]);
      const [[p]] = await conn.execute("SELECT COUNT(*) AS n FROM follow_ups WHERE lead_id = ? AND status = 'pending'", [f.lead_id]);
      if (l && l.crm_status === "follow_up" && !Number(p.n)) {
        await conn.execute("UPDATE leads SET status = 'contacted', status_changed_at = UTC_TIMESTAMP(), follow_up_on = NULL WHERE id = ?", [l.id]);
        await logActivity({
          conn,
          user,
          action: "status",
          entity: "leads",
          entityId: l.id,
          summary: `${leadCode(l.id)}: Follow-up → Contacted (follow-up done)`,
          before: { status: l.status },
          after: { status: "contacted" },
        });
      }
    }
    return f;
  });

  if (call) {
    await logCall(
      {
        phone: result.lead_phone || result.customer_phone,
        name: result.who,
        direction: "outbound",
        outcome: call.outcome,
        durationMin: call.durationMin,
        notes: outcome,
        leadId: result.lead_id,
        customerId: result.customer_id,
      },
      { user }
    );
  }
  return { ok: true };
}

export async function rescheduleFollowUp(id, dueAt, { user }) {
  const due = istInputToUtc(dueAt);
  if (!due) throw new UserError("Pick the new date and time.");
  if (due.getTime() < Date.now() - 5 * 60000) throw new UserError("Pick a time in the future.");
  return transaction(async (conn) => {
    const f = await lockFollowUp(conn, id);
    if (f.status !== "pending") throw new UserError("This follow-up is already closed.");
    await conn.execute("UPDATE follow_ups SET due_at = ? WHERE id = ?", [sqlTime(due), f.id]);
    if (f.lead_id) await conn.execute("UPDATE leads SET follow_up_on = ? WHERE id = ?", [utcToIstInput(due).slice(0, 10), f.lead_id]);
    await logActivity({
      conn,
      user,
      action: "update",
      entity: "follow_ups",
      entityId: f.id,
      summary: `Rescheduled follow-up with ${f.who || "customer"} to ${utcToIstInput(due).replace("T", " ")} IST`,
      before: { due_at: f.due_at },
      after: { due_at: sqlTime(due) },
    });
    return { ok: true };
  });
}

export async function cancelFollowUp(id, { user, reason = "" }) {
  return transaction(async (conn) => {
    const f = await lockFollowUp(conn, id);
    if (f.status !== "pending") throw new UserError("This follow-up is already closed.");
    await conn.execute("UPDATE follow_ups SET status = 'cancelled', done_at = UTC_TIMESTAMP(), done_by = ? WHERE id = ?", [user?.id ?? null, f.id]);
    await logActivity({
      conn,
      user,
      action: "cancel",
      entity: "follow_ups",
      entityId: f.id,
      summary: `Cancelled follow-up with ${f.who || "customer"}${reason ? ` — ${text(reason, 140)}` : ""}`,
      before: { status: "pending" },
      after: { status: "cancelled", reason: text(reason, 300) },
    });
    return { ok: true };
  });
}
