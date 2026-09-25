/**
 * The CRM's activity log and notifications. Server only.
 *
 * ── ONE LOG ──────────────────────────────────────────────────────────────
 * Activity is written to admin_audit — the same append-only table the website
 * admin writes — extended with the actor's role and name and, when the record
 * belongs to a lab partner, that partner's id (so a partner's own activity
 * feed is one indexed query, and never shows them anybody else's).
 *
 * Logging must never break the thing it logs: failures are reported to the
 * console and swallowed, exactly like src/lib/admin/audit.js.
 *
 * `system` actor: a website booking, a payment verified by Razorpay — things
 * that happened without anyone signed in. Pass `user: null`.
 */
import { headers } from "next/headers";

import { query } from "@/lib/db";

import { istDayBounds } from "./dates";

const SECRET = new Set(["password_hash", "data", "token_hash", "bank_account"]);

function serialise(value) {
  if (value === null || value === undefined) return null;
  const safe = {};
  for (const [key, entry] of Object.entries(value)) {
    if (SECRET.has(key)) safe[key] = "[redacted]";
    else if (Buffer.isBuffer(entry)) safe[key] = `[${entry.length} bytes]`;
    else if (entry instanceof Date) safe[key] = entry.toISOString();
    else if (typeof entry === "bigint") safe[key] = String(entry);
    else safe[key] = entry;
  }
  const json = JSON.stringify(safe);
  return json.length > 60_000 ? JSON.stringify({ truncated: true, bytes: json.length }) : json;
}

async function requestMeta() {
  try {
    const h = await headers();
    return {
      ip: h.get("x-forwarded-for")?.split(",")[0]?.trim()?.slice(0, 45) ?? null,
      ua: (h.get("user-agent") ?? "").slice(0, 255) || null,
    };
  } catch {
    return { ip: null, ua: null }; // outside a request (a script)
  }
}

/**
 * Record one change.
 *
 *   action    short verb: create, update, status, assign, accept, reject,
 *             upload, verify, send, payment, refund, delete, restore, export …
 *   entity    table-ish noun: bookings, customers, leads, payments, reports …
 *   summary   the sentence the feed shows ("Changed status Pending → Confirmed")
 *   partnerId the partner the record belongs to, if any
 */
export async function logActivity({
  user = null,
  action,
  entity,
  entityId = "",
  summary = "",
  before = null,
  after = null,
  partnerId = null,
  conn = null,
}) {
  try {
    const { ip, ua } = await requestMeta();
    const exec = conn ? conn.execute.bind(conn) : query;
    await exec(
      `INSERT INTO admin_audit
         (user_id, user_email, user_name, user_role, action, entity, entity_id, summary,
          before_json, after_json, ip, user_agent, partner_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user?.id ?? null,
        (user?.email ?? "").slice(0, 160),
        (user?.name ?? (user ? "" : "System")).slice(0, 80),
        (user?.role ?? "system").slice(0, 20),
        String(action).slice(0, 40),
        String(entity).slice(0, 40),
        String(entityId ?? "").slice(0, 120),
        String(summary ?? "").slice(0, 255),
        serialise(before),
        serialise(after),
        ip,
        ua,
        partnerId ?? (user?.isPartner ? user.partnerId : null),
      ]
    );
  } catch (err) {
    console.error("[crm] activity log write failed — the change itself was saved", err);
  }
}

/**
 * Raise a notification.
 *
 *   notify({ type: "booking.new", title, body, link, perm: "bookings.view" })
 *     → every staff user who holds bookings.view
 *   notify({ ..., partnerId: 3 })          → that partner's users
 *   notify({ ..., userId: 12 })            → one person (a collector, say)
 *
 * Never throws.
 */
export async function notify({
  type,
  title,
  body = "",
  link = "",
  perm = "",
  partnerId = null,
  userId = null,
  severity = "info",
  conn = null,
}) {
  try {
    const audience = userId ? "user" : partnerId ? "partner" : "staff";
    const exec = conn ? conn.execute.bind(conn) : query;
    await exec(
      `INSERT INTO notifications (type, title, body, link, audience, perm, partner_id, user_id, severity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(type).slice(0, 40),
        String(title).slice(0, 160),
        String(body ?? "").slice(0, 500),
        String(link ?? "").slice(0, 255),
        audience,
        String(perm ?? "").slice(0, 40),
        partnerId,
        userId,
        severity,
      ]
    );
  } catch (err) {
    console.error("[crm] notification write failed", err);
  }
}

/* ── Reading ──────────────────────────────────────────────────────────── */

/**
 * The SQL condition that limits notifications to what `user` may see. Staff
 * notifications carry a permission; the list of the user's permissions is
 * passed in as parameters, never interpolated.
 */
export function notificationScope(user) {
  if (user.isPartner) {
    return {
      sql: "((n.audience = 'partner' AND n.partner_id = ?) OR (n.audience = 'user' AND n.user_id = ?))",
      params: [user.partnerId, user.id],
    };
  }
  const perms = user.role === "owner" ? null : user.perms;
  const permSql = perms
    ? perms.length
      ? `(n.perm = '' OR n.perm IN (${perms.map(() => "?").join(",")}))`
      : "n.perm = ''"
    : "1=1";
  return {
    sql: `((n.audience = 'staff' AND ${permSql}) OR (n.audience = 'user' AND n.user_id = ?))`,
    params: [...(perms ?? []), user.id],
  };
}

export async function unreadCount(user) {
  const scope = notificationScope(user);
  const [rows] = await query(
    `SELECT COUNT(*) AS n FROM notifications n
     LEFT JOIN notification_reads r ON r.notification_id = n.id AND r.user_id = ?
     WHERE ${scope.sql}
       AND n.id > (SELECT notif_seen_id FROM admin_users WHERE id = ?)
       AND r.notification_id IS NULL
       AND n.created_at > DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY)`,
    [user.id, ...scope.params, user.id]
  );
  return Number(rows[0]?.n ?? 0);
}

export async function listNotifications(user, { limit = 30, before = null, unreadOnly = false } = {}) {
  const scope = notificationScope(user);
  const where = [scope.sql];
  const params = [...scope.params];
  if (before) {
    where.push("n.id < ?");
    params.push(Number(before));
  }
  const [rows] = await query(
    `SELECT n.*, (r.notification_id IS NOT NULL OR n.id <= u.notif_seen_id) AS is_read
     FROM notifications n
     JOIN admin_users u ON u.id = ?
     LEFT JOIN notification_reads r ON r.notification_id = n.id AND r.user_id = ?
     WHERE ${where.join(" AND ")}
     ${unreadOnly ? "HAVING is_read = 0" : ""}
     ORDER BY n.id DESC
     LIMIT ${Math.min(100, Math.max(1, Number(limit) || 30))}`,
    [user.id, user.id, ...params]
  );
  return rows.map((r) => ({ ...r, is_read: Boolean(Number(r.is_read)) }));
}

export async function markRead(user, id) {
  await query("INSERT IGNORE INTO notification_reads (notification_id, user_id) VALUES (?, ?)", [
    Number(id) || 0,
    user.id,
  ]);
}

export async function markAllRead(user) {
  await query(
    "UPDATE admin_users SET notif_seen_id = (SELECT COALESCE(MAX(id), 0) FROM notifications) WHERE id = ?",
    [user.id]
  );
}

/**
 * The activity feed. A partner sees only rows stamped with their partner_id;
 * staff without activity.view see only their own actions.
 */
export async function listActivity(
  user,
  { entity = null, entityId = null, actorId = null, action = null, from = null, to = null, search = "", limit = 50, offset = 0 } = {}
) {
  const where = [];
  const params = [];

  if (user.isPartner) {
    where.push("a.partner_id = ?");
    params.push(user.partnerId);
  } else if (user.role !== "owner" && !user.perms.includes("activity.view")) {
    where.push("a.user_id = ?");
    params.push(user.id);
  }
  if (entity) {
    where.push("a.entity = ?");
    params.push(entity);
  }
  if (entityId !== null && entityId !== undefined && entityId !== "") {
    where.push("a.entity_id = ?");
    params.push(String(entityId));
  }
  if (actorId) {
    where.push("a.user_id = ?");
    params.push(Number(actorId));
  }
  if (action) {
    where.push("a.action = ?");
    params.push(action);
  }
  if (from) {
    // IST days, not UTC ones: an entry at 02:00 IST belongs to that IST day.
    where.push("a.created_at >= ?");
    params.push(istDayBounds(from)?.start ?? `${from} 00:00:00`);
  }
  if (to) {
    where.push("a.created_at < ?");
    params.push(istDayBounds(to)?.end ?? `${to} 23:59:59`);
  }
  if (search) {
    where.push("(a.summary LIKE ? OR a.entity_id = ? OR a.user_email LIKE ?)");
    const like = `%${String(search).replace(/[%_]/g, "\\$&")}%`;
    params.push(like, String(search).replace(/^mb/i, ""), like);
  }
  // Failed sign-ins are security noise in an operations feed.
  where.push("a.action <> 'login_failed'");

  const clause = `WHERE ${where.join(" AND ")}`;
  const lim = Math.min(200, Math.max(1, Number(limit) || 50));
  const off = Math.max(0, Number(offset) || 0);

  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT a.id, a.user_id, a.user_email, a.user_name, a.user_role, a.action, a.entity, a.entity_id,
              a.summary, a.before_json, a.after_json, a.ip, a.user_agent, a.created_at
       FROM admin_audit a ${clause}
       ORDER BY a.id DESC LIMIT ${lim} OFFSET ${off}`,
      params
    ),
    query(`SELECT COUNT(*) AS n FROM admin_audit a ${clause}`, params),
  ]);

  return { rows, total: Number(count.n) };
}

/**
 * The history of ONE record, for its detail page. Anyone who may open the
 * record may read its history; a partner still sees only rows stamped with
 * their own partner_id (so an internal "reassigned to another lab" row about
 * the same booking stays invisible to them).
 */
export async function recordHistory(user, entity, entityId, { limit = 60 } = {}) {
  const params = [entity, String(entityId)];
  let extra = "";
  if (user.isPartner) {
    extra = "AND a.partner_id = ?";
    params.push(user.partnerId);
  }
  const [rows] = await query(
    `SELECT a.id, a.user_name, a.user_email, a.user_role, a.action, a.summary, a.before_json, a.after_json, a.created_at
     FROM admin_audit a
     WHERE a.entity = ? AND a.entity_id = ? ${extra}
     ORDER BY a.id DESC LIMIT ${Math.min(200, Math.max(1, Number(limit) || 60))}`,
    params
  );
  return rows;
}

/** Where a feed row links to. */
export function activityLink(row) {
  const id = row.entity_id;
  if (!id) return null;
  switch (row.entity) {
    case "bookings":
      return `/crm/bookings/${id}`;
    case "customers":
      return `/crm/customers/${id}`;
    case "leads":
      return `/crm/leads/${id}`;
    case "partners":
      return `/crm/partners/${id}`;
    case "settlements":
      return `/crm/settlements/${id}`;
    case "payments":
      return `/crm/payments?q=PAY${id}`;
    case "lab_tests":
      return `/crm/tests/${encodeURIComponent(id)}`;
    case "service_cities":
      return `/crm/cities/${id}`;
    case "service_areas":
      return "/crm/areas";
    case "roles":
    case "crm_role_permissions":
      return "/crm/roles";
    case "settings":
      return "/crm/settings";
    default:
      return null;
  }
}
