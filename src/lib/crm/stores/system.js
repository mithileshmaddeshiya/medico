/**
 * The CRM's system screens: accounts, role permissions and SLA settings.
 * Server only.
 *
 * ── ACCOUNTS ─────────────────────────────────────────────────────────────
 * Same admin_users table and the same session machinery as the website
 * admin (src/app/admin/users/actions.js), so the same rules hold:
 *   · a password is only ever stored as hashPassword()'s scrypt string, and
 *     is never written to the activity log;
 *   · disabling an account or resetting its password revokes every session
 *     it has — a new password that leaves the thief's cookie alive does
 *     nothing;
 *   · nobody changes their own role or disables themselves;
 *   · only an owner creates or touches an owner, and the last active owner
 *     cannot be demoted or disabled (that would lock everyone out of
 *     /crm/roles and /crm/users for good).
 *
 * ── ROLE PERMISSIONS ─────────────────────────────────────────────────────
 * crm_role_permissions holds the owner's override per role; no row means the
 * defaults in src/lib/crm/permissions.js. Owner is never stored — it is
 * everything, always. A partner can never be granted PARTNER_FORBIDDEN.
 *
 * ── SLA SETTINGS ─────────────────────────────────────────────────────────
 * The `settings` key/value table, keys crm.sla.*. getSlaSettings() is what
 * the dashboard and SLA alerts read; it never throws.
 */
import { cache } from "react";

import { query } from "@/lib/db";
import { revokeAllSessions } from "@/lib/admin/auth";
import { hashPassword, passwordProblem } from "@/lib/admin/password";
import { logActivity } from "@/lib/crm/activity";
import { SLA_DEFAULTS } from "@/lib/crm/constants";
import { UserError } from "@/lib/crm/guard";
import { ALL_PERMS, DEFAULT_ROLE_PERMS, PARTNER_FORBIDDEN, ROLE_LABEL, ROLES } from "@/lib/crm/permissions";

const likeOf = (s) => `%${String(s).replace(/[%_\\]/g, "\\$&")}%`;

/* ── SLA settings ─────────────────────────────────────────────────────── */

export const SLA_FIELDS = [
  {
    key: "partner_accept_hours",
    label: "Lab partner must accept within",
    unit: "hours",
    min: 1,
    max: 72,
    hint: "After a booking is sent to a lab, it is flagged if the lab has not accepted or rejected it in this time.",
  },
  {
    key: "sample_receive_hours",
    label: "Lab must receive the sample within",
    unit: "hours",
    min: 1,
    max: 72,
    hint: "Counted from collection. A sample not marked received by then is flagged.",
  },
  {
    key: "report_grace_hours",
    label: "Report grace period",
    unit: "hours",
    min: 0,
    max: 72,
    hint: "Extra time allowed past the test's turnaround before a report counts as late. 0 = flag it the moment it is due.",
  },
  {
    key: "payment_pending_days",
    label: "Payment pending alert after",
    unit: "days",
    min: 1,
    max: 60,
    hint: "A booking with money still owed this long after it was booked appears in the pending-payments alert.",
  },
];

const SLA_KEY = (k) => `crm.sla.${k}`;

/**
 * { partner_accept_hours, sample_receive_hours, report_grace_hours,
 *   payment_pending_days } — numbers, defaults filled in. Never throws.
 */
export const getSlaSettings = cache(async () => {
  const out = Object.fromEntries(SLA_FIELDS.map((f) => [f.key, SLA_DEFAULTS[f.key]]));
  try {
    const [rows] = await query(
      `SELECT \`key\`, value FROM settings WHERE \`key\` IN (${SLA_FIELDS.map(() => "?").join(",")})`,
      SLA_FIELDS.map((f) => SLA_KEY(f.key))
    );
    for (const row of rows) {
      const field = SLA_FIELDS.find((f) => SLA_KEY(f.key) === row.key);
      const n = Number(row.value);
      if (field && row.value !== null && row.value !== "" && Number.isFinite(n) && n >= field.min && n <= field.max) {
        out[field.key] = n;
      }
    }
  } catch (err) {
    console.error("[crm] SLA settings could not be read — using defaults", err);
  }
  return out;
});

export async function saveSlaSettings(input, { user }) {
  const before = await getSlaSettings();
  const after = {};
  for (const f of SLA_FIELDS) {
    const raw = String(input[f.key] ?? "").trim();
    const n = Number(raw);
    if (raw === "" || !Number.isFinite(n) || n < f.min || n > f.max) {
      throw new UserError(`${f.label}: enter ${f.min}–${f.max} ${f.unit}.`);
    }
    after[f.key] = Math.round(n * 10) / 10;
  }
  const changed = SLA_FIELDS.filter((f) => Number(before[f.key]) !== after[f.key]);
  if (!changed.length) return false;

  for (const f of changed) {
    await query(
      "INSERT INTO settings (`key`, value, updated_by) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value), updated_by = VALUES(updated_by)",
      [SLA_KEY(f.key), String(after[f.key]), user.id]
    );
  }
  await logActivity({
    user,
    action: "update",
    entity: "settings",
    entityId: "crm.sla",
    summary: `SLA timings changed: ${changed.map((f) => `${f.label.toLowerCase()} ${before[f.key]} → ${after[f.key]} ${f.unit}`).join("; ")}`.slice(0, 255),
    before: Object.fromEntries(changed.map((f) => [f.key, before[f.key]])),
    after: Object.fromEntries(changed.map((f) => [f.key, after[f.key]])),
  });
  return true;
}

/* ── Accounts ─────────────────────────────────────────────────────────── */

export const USER_STATUS = {
  active: { label: "Active", tone: "emerald" },
  disabled: { label: "Disabled", tone: "slate" },
  deleted: { label: "Deleted", tone: "rose" },
};

const ROLE_KEYS = ROLES.map((r) => r.key);

export async function listUsers({ role = null, status = null, search = "", limit = 25, offset = 0 } = {}) {
  const where = [status && USER_STATUS[status] ? "u.status = ?" : "u.status <> 'deleted'"];
  const params = status && USER_STATUS[status] ? [status] : [];
  if (role && ROLE_KEYS.includes(role)) {
    where.push("u.role = ?");
    params.push(role);
  }
  if (search) {
    where.push("(u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)");
    params.push(likeOf(search), likeOf(search), likeOf(search));
  }
  const clause = where.join(" AND ");
  const lim = Math.min(100, Math.max(1, Number(limit) || 25));
  const off = Math.max(0, Number(offset) || 0);
  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.status, u.partner_id, u.last_login_at, u.created_at,
              p.name AS partner_name
       FROM admin_users u LEFT JOIN partners p ON p.id = u.partner_id
       WHERE ${clause}
       ORDER BY u.status = 'active' DESC, FIELD(u.role, 'owner') DESC, u.name, u.email
       LIMIT ${lim} OFFSET ${off}`,
      params
    ),
    query(`SELECT COUNT(*) AS n FROM admin_users u WHERE ${clause}`, params),
  ]);
  return { rows, total: Number(count.n) };
}

async function activeOwners(exceptId = 0) {
  const [[row]] = await query("SELECT COUNT(*) AS n FROM admin_users WHERE role = 'owner' AND status = 'active' AND id <> ?", [exceptId]);
  return Number(row.n);
}

async function checkPartner(role, partnerId) {
  if (role !== "partner") return null;
  const id = Number(partnerId) || 0;
  if (!id) throw new UserError("A lab partner account must be linked to a lab. Pick one.");
  const [[p]] = await query("SELECT id, name FROM partners WHERE id = ? AND status <> 'deleted'", [id]);
  if (!p) throw new UserError("That lab partner does not exist.");
  return p.id;
}

const cleanPhone = (v) => String(v ?? "").replace(/\D/g, "").slice(-10);

export async function createUser(input, { user }) {
  const name = String(input.name ?? "").trim().slice(0, 80);
  const email = String(input.email ?? "").trim().toLowerCase().slice(0, 160);
  const role = String(input.role ?? "");
  const phone = cleanPhone(input.phone);
  const password = String(input.password ?? "");

  if (name.length < 2) throw new UserError("Enter the person's name.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new UserError("That does not look like an email address.");
  if (!ROLE_KEYS.includes(role)) throw new UserError("Pick a role.");
  if (role === "owner" && user.role !== "owner") throw new UserError("Only an owner can create another owner.");
  if (phone && phone.length !== 10) throw new UserError("A mobile number has 10 digits.");
  const problem = passwordProblem(password);
  if (problem) throw new UserError(problem);
  const partnerId = await checkPartner(role, input.partnerId);

  let res;
  try {
    [res] = await query(
      "INSERT INTO admin_users (email, name, password_hash, role, partner_id, phone, status) VALUES (?, ?, ?, ?, ?, ?, 'active')",
      [email, name, await hashPassword(password), role, partnerId, phone]
    );
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") throw new UserError("There is already an account with that email.");
    throw err;
  }
  await logActivity({
    user,
    action: "create",
    entity: "admin_users",
    entityId: res.insertId,
    summary: `Added user ${name} (${email}) as ${ROLE_LABEL[role] ?? role}`,
    after: { name, email, role, partner_id: partnerId, phone },
  });
  return res.insertId;
}

async function loadTarget(id, actor) {
  const [[target]] = await query(
    "SELECT id, name, email, phone, role, status, partner_id FROM admin_users WHERE id = ?",
    [Number(id) || 0]
  );
  if (!target || target.status === "deleted") throw new UserError("That account no longer exists.");
  if (target.role === "owner" && actor.role !== "owner") throw new UserError("Only an owner can change an owner's account.");
  return target;
}

/** Name, phone, role, lab and status in one save. */
export async function updateUser(id, input, { user }) {
  const target = await loadTarget(id, user);
  const self = Number(target.id) === Number(user.id);

  const name = String(input.name ?? target.name).trim().slice(0, 80);
  const phone = input.phone === undefined ? target.phone : cleanPhone(input.phone);
  const role = String(input.role ?? target.role);
  const status = String(input.status ?? target.status);

  if (name.length < 2) throw new UserError("Enter the person's name.");
  if (phone && phone.length !== 10) throw new UserError("A mobile number has 10 digits.");
  if (!ROLE_KEYS.includes(role)) throw new UserError("Pick a role.");
  if (!["active", "disabled"].includes(status)) throw new UserError("Unknown status.");
  if (self && role !== target.role) throw new UserError("You cannot change your own role.");
  if (self && status !== "active") throw new UserError("You cannot disable the account you are signed in with.");
  if (role === "owner" && target.role !== "owner" && user.role !== "owner") throw new UserError("Only an owner can make someone an owner.");

  const losesOwner = target.role === "owner" && target.status === "active" && (role !== "owner" || status !== "active");
  if (losesOwner && (await activeOwners(target.id)) < 1) {
    throw new UserError("This is the only active owner. Make someone else an owner first.");
  }

  const partnerId = role === "partner" ? await checkPartner(role, input.partnerId ?? target.partner_id) : null;

  const next = { name, phone, role, status, partner_id: partnerId };
  const before = {};
  const after = {};
  for (const [k, v] of Object.entries(next)) {
    const old = k === "partner_id" ? (target.partner_id ? Number(target.partner_id) : null) : target[k];
    if (String(old ?? "") !== String(v ?? "")) {
      before[k] = old;
      after[k] = v;
    }
  }
  if (!Object.keys(after).length) return { changed: false };

  await query("UPDATE admin_users SET name = ?, phone = ?, role = ?, status = ?, partner_id = ? WHERE id = ?", [
    name, phone, role, status, partnerId, target.id,
  ]);

  // Losing access (disabled, or a role change that narrows it) must take
  // effect now, not when the cookie expires.
  const revoked = ("status" in after && status !== "active") || "role" in after || "partner_id" in after;
  if (revoked) await revokeAllSessions(target.id);

  const parts = [];
  if ("role" in after) parts.push(`role ${ROLE_LABEL[before.role] ?? before.role} → ${ROLE_LABEL[role] ?? role}`);
  if ("status" in after) parts.push(status === "active" ? "re-enabled" : "disabled");
  if ("partner_id" in after && role === "partner") parts.push("lab changed");
  if ("name" in after) parts.push("name");
  if ("phone" in after) parts.push("mobile");
  await logActivity({
    user,
    action: "status" in after ? (status === "active" ? "restore" : "archive") : "update",
    entity: "admin_users",
    entityId: target.id,
    summary: `${target.email}: ${parts.join(", ")}${revoked ? " — signed out everywhere" : ""}`.slice(0, 255),
    before,
    after,
  });
  return { changed: true, revoked };
}

export async function resetUserPassword(id, password, { user }) {
  const target = await loadTarget(id, user);
  if (Number(target.id) === Number(user.id)) throw new UserError("Change your own password from your profile.");
  const problem = passwordProblem(password);
  if (problem) throw new UserError(problem);
  await query("UPDATE admin_users SET password_hash = ? WHERE id = ?", [await hashPassword(password), target.id]);
  await revokeAllSessions(target.id);
  // The password itself is never logged — only that it changed.
  await logActivity({
    user,
    action: "update",
    entity: "admin_users",
    entityId: target.id,
    summary: `Temporary password set for ${target.email}; all their sessions revoked`,
  });
}

/* ── Role permissions ─────────────────────────────────────────────────── */

export const EDITABLE_ROLES = ROLES.filter((r) => r.key !== "owner");

const cleanPerms = (role, list) => {
  const set = new Set(list.filter((p) => ALL_PERMS.includes(p)));
  if (role === "partner") for (const p of PARTNER_FORBIDDEN) set.delete(p);
  return ALL_PERMS.filter((p) => set.has(p));
};

/** { role: { perms: [...], custom: bool, updatedAt, updatedBy } } for every editable role. */
export async function getRoleMatrix() {
  const [rows] = await query(
    `SELECT r.role, r.perms_json, r.updated_at, u.name AS updated_by_name, u.email AS updated_by_email
     FROM crm_role_permissions r LEFT JOIN admin_users u ON u.id = r.updated_by`
  );
  const stored = Object.fromEntries(rows.map((r) => [r.role, r]));
  return Object.fromEntries(
    EDITABLE_ROLES.map(({ key }) => {
      const row = stored[key];
      let list = DEFAULT_ROLE_PERMS[key] ?? [];
      if (row) {
        try {
          list = typeof row.perms_json === "string" ? JSON.parse(row.perms_json) : row.perms_json;
        } catch {
          /* unreadable override: the defaults apply, as in guard.js */
        }
      }
      return [
        key,
        {
          perms: cleanPerms(key, Array.isArray(list) ? list : []),
          custom: Boolean(row),
          updatedAt: row?.updated_at ?? null,
          updatedBy: row ? row.updated_by_name || row.updated_by_email || null : null,
        },
      ];
    })
  );
}

export async function saveRolePerms(role, perms, { user, reset = false }) {
  if (role === "owner") throw new UserError("The owner always has every permission.");
  if (!EDITABLE_ROLES.some((r) => r.key === role)) throw new UserError("Unknown role.");
  // Someone who holds roles.manage without being the owner must not be able
  // to widen their own role from here.
  if (user.role !== "owner" && user.role === role) throw new UserError("Only the owner can change the permissions of your own role.");

  const matrix = await getRoleMatrix();
  const before = matrix[role].perms;
  const next = cleanPerms(role, reset ? DEFAULT_ROLE_PERMS[role] ?? [] : perms);

  const added = next.filter((p) => !before.includes(p));
  const removed = before.filter((p) => !next.includes(p));
  if (!added.length && !removed.length && !(reset && matrix[role].custom)) return { changed: false };

  await query(
    `INSERT INTO crm_role_permissions (role, perms_json, updated_by) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE perms_json = VALUES(perms_json), updated_by = VALUES(updated_by)`,
    [role, JSON.stringify(next), user.id]
  );

  const label = ROLE_LABEL[role] ?? role;
  const bits = [added.length && `+${added.length}`, removed.length && `−${removed.length}`].filter(Boolean).join(" ");
  await logActivity({
    user,
    action: "update",
    entity: "roles",
    entityId: role,
    summary: reset ? `Reset ${label} permissions to default${bits ? ` (${bits})` : ""}` : `Changed ${label} permissions (${bits})`,
    before: { perms: before, removed },
    after: { perms: next, added },
  });
  return { changed: true, added, removed };
}
