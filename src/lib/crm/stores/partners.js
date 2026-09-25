/**
 * Lab partners: the record, the cities it serves, its own price list, its
 * sign-in accounts, and the performance figures shown on the list and the
 * profile. Server only.
 *
 * ── PERFORMANCE IS COMPUTED, NOT STORED ──────────────────────────────────
 * Assigned / pending / completed / turnaround / revenue / payable are
 * aggregates over bookings and settlements, run for the partners on the
 * current page only (one grouped query each), so they can never drift from
 * the bookings they describe.
 *
 * The payable figure uses eligibleWhere() from ./settlements, the same test
 * settlement generation uses, so "payable pending" on this screen is exactly
 * what the next statement would contain plus what earlier ones still owe.
 */
import { query, transaction } from "@/lib/db";
import { revokeAllSessions } from "@/lib/admin/auth";
import { hashPassword, passwordProblem } from "@/lib/admin/password";

import { logActivity, notify } from "../activity";
import { OPEN_STATUSES, partnerCode } from "../constants";
import { UserError } from "../guard";
import { eligibleWhere } from "./settlements";

const text = (value, max) => String(value ?? "").trim().slice(0, max);
const like = (value) => `%${String(value).replace(/[%_]/g, "\\$&")}%`;

export const AGREEMENT_STATUSES = [
  { key: "none", label: "No agreement", tone: "slate" },
  { key: "draft", label: "Draft", tone: "amber" },
  { key: "sent", label: "Sent for signing", tone: "blue" },
  { key: "signed", label: "Signed", tone: "emerald" },
  { key: "expired", label: "Expired", tone: "rose" },
];
export const AGREEMENT = Object.fromEntries(AGREEMENT_STATUSES.map((a) => [a.key, a]));

export const PARTNER_RECORD_STATUSES = [
  { key: "active", label: "Active", tone: "emerald" },
  { key: "inactive", label: "Inactive", tone: "slate" },
  { key: "suspended", label: "Suspended", tone: "rose" },
];
export const PARTNER_RECORD_STATUS = Object.fromEntries(PARTNER_RECORD_STATUSES.map((a) => [a.key, a]));

/** "XXXXXXXX1234" — enough for a person to recognise the account, not to use it. */
export const maskAccount = (acc) => {
  const s = String(acc ?? "").replace(/\s+/g, "");
  if (!s) return "";
  return s.length <= 4 ? s : `${"•".repeat(Math.min(8, s.length - 4))}${s.slice(-4)}`;
};

/* ── List ─────────────────────────────────────────────────────────────── */

const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";

/** URL search params → listPartners filters (the page and the export share it). */
export function partnerFiltersFrom(sp) {
  return {
    search: String(one(sp.q)).slice(0, 80),
    status: one(sp.status) || null,
    cityId: one(sp.city) || null,
    agreement: one(sp.agreement) || null,
  };
}

/**
 * filters: { search, status, cityId, agreement, limit, offset }
 * Rows carry the performance figures from partnerStats().
 */
export async function listPartners(filters = {}) {
  const where = ["p.status <> 'deleted'"];
  const params = [];
  if (filters.status && PARTNER_RECORD_STATUS[filters.status]) {
    where.push("p.status = ?");
    params.push(filters.status);
  }
  if (filters.agreement && AGREEMENT[filters.agreement]) {
    where.push("p.agreement_status = ?");
    params.push(filters.agreement);
  }
  if (filters.cityId) {
    // The partner's home city, or any city it serves.
    where.push("(p.city_id = ? OR EXISTS (SELECT 1 FROM partner_cities pc WHERE pc.partner_id = p.id AND pc.city_id = ?))");
    params.push(Number(filters.cityId) || 0, Number(filters.cityId) || 0);
  }
  if (filters.search) {
    const q = String(filters.search).trim();
    const code = /^\s*lab\s*0*(\d+)\s*$/i.exec(q);
    const digits = q.replace(/\D/g, "");
    const ors = ["p.name LIKE ?", "p.contact_person LIKE ?", "p.email LIKE ?"];
    params.push(like(q), like(q), like(q));
    if (digits.length >= 4) {
      ors.push("p.phone LIKE ?", "p.alt_phone LIKE ?");
      params.push(like(digits), like(digits));
    }
    if (code) {
      ors.push("p.id = ?");
      params.push(Number(code[1]));
    }
    where.push(`(${ors.join(" OR ")})`);
  }

  const clause = `WHERE ${where.join(" AND ")}`;
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 25));
  const offset = Math.max(0, Number(filters.offset) || 0);

  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT p.id, p.name, p.contact_person, p.phone, p.alt_phone, p.email, p.city, p.city_id, p.status,
              p.agreement_status, p.joined_on, p.created_at
       FROM partners p ${clause}
       ORDER BY p.status = 'active' DESC, p.name
       LIMIT ${limit} OFFSET ${offset}`,
      params
    ),
    query(`SELECT COUNT(*) AS n FROM partners p ${clause}`, params),
  ]);

  const stats = await partnerStats(rows.map((r) => r.id));
  return { rows: rows.map((r) => ({ ...r, ...(stats.get(Number(r.id)) ?? emptyStats()) })), total: Number(count.n), limit, offset };
}

const emptyStats = () => ({
  assigned: 0,
  pending: 0,
  awaiting: 0,
  completed: 0,
  cancelled: 0,
  rejected: 0,
  avg_tat_hours: null,
  revenue: 0,
  unsettled: 0,
  unsettled_count: 0,
  settlements_owed: 0,
  paid_total: 0,
  payable_pending: 0,
});

/** Performance figures for a set of partner ids → Map(id → stats). */
export async function partnerStats(ids) {
  const list = [...new Set(ids.map(Number).filter(Boolean))];
  const out = new Map(list.map((id) => [id, emptyStats()]));
  if (!list.length) return out;
  const marks = list.map(() => "?").join(",");
  const e = eligibleWhere();

  const [[bk], [un], [st]] = await Promise.all([
    query(
      `SELECT b.partner_id,
              COUNT(*) AS assigned,
              SUM(b.status IN (${OPEN_STATUSES.map(() => "?").join(",")}) AND b.partner_status IN ('pending','accepted')) AS pending,
              SUM(b.partner_status = 'pending' AND b.status <> 'cancelled') AS awaiting,
              SUM(b.partner_status = 'accepted' AND b.status IN ('report_ready','report_delivered','completed')) AS completed,
              SUM(b.status = 'cancelled') AS cancelled,
              SUM(b.partner_status = 'rejected') AS rejected,
              AVG(CASE WHEN b.sample_received_at IS NOT NULL AND b.report_ready_at IS NOT NULL
                       THEN TIMESTAMPDIFF(MINUTE, b.sample_received_at, b.report_ready_at) END) / 60 AS avg_tat_hours,
              COALESCE(SUM(CASE WHEN b.status <> 'cancelled' AND b.partner_status <> 'rejected' THEN b.final_amount END), 0) AS revenue
       FROM bookings b
       WHERE b.deleted_at IS NULL AND b.partner_id IN (${marks})
       GROUP BY b.partner_id`,
      [...OPEN_STATUSES, ...list]
    ),
    query(
      `SELECT b.partner_id, COUNT(*) AS n, COALESCE(SUM(b.partner_cost), 0) AS amount
       FROM bookings b WHERE b.partner_id IN (${marks}) AND ${e.sql.join(" AND ")}
       GROUP BY b.partner_id`,
      list
    ),
    query(
      `SELECT partner_id,
              COALESCE(SUM(CASE WHEN status IN ('pending','processing','on_hold') THEN partner_payable + adjustments - paid_amount END), 0) AS owed,
              COALESCE(SUM(CASE WHEN status = 'paid' THEN paid_amount END), 0) AS paid
       FROM settlements WHERE partner_id IN (${marks}) GROUP BY partner_id`,
      list
    ),
  ]);

  for (const r of bk) {
    Object.assign(out.get(Number(r.partner_id)), {
      assigned: Number(r.assigned),
      pending: Number(r.pending ?? 0),
      awaiting: Number(r.awaiting ?? 0),
      completed: Number(r.completed ?? 0),
      cancelled: Number(r.cancelled ?? 0),
      rejected: Number(r.rejected ?? 0),
      avg_tat_hours: r.avg_tat_hours === null ? null : Number(r.avg_tat_hours),
      revenue: Number(r.revenue),
    });
  }
  for (const r of un) Object.assign(out.get(Number(r.partner_id)), { unsettled: Number(r.amount), unsettled_count: Number(r.n) });
  for (const r of st) {
    Object.assign(out.get(Number(r.partner_id)), { settlements_owed: Math.max(0, Number(r.owed)), paid_total: Number(r.paid) });
  }
  for (const s of out.values()) s.payable_pending = Math.round((s.unsettled + s.settlements_owed) * 100) / 100;
  return out;
}

/* ── One partner ──────────────────────────────────────────────────────── */

export async function getPartner(id) {
  const [rows] = await query(
    `SELECT p.*, sc.name AS city_name, u.name AS created_by_name
     FROM partners p
     LEFT JOIN service_cities sc ON sc.id = p.city_id
     LEFT JOIN admin_users u ON u.id = p.created_by
     WHERE p.id = ? AND p.status <> 'deleted' LIMIT 1`,
    [Number(id) || 0]
  );
  if (!rows[0]) return null;
  const [cities] = await query(
    `SELECT sc.id, sc.name FROM partner_cities pc JOIN service_cities sc ON sc.id = pc.city_id
     WHERE pc.partner_id = ? ORDER BY sc.sort_order, sc.name`,
    [rows[0].id]
  );
  return { ...rows[0], cities };
}

/* ── Create / edit ────────────────────────────────────────────────────── */

const GSTIN = /^[0-9A-Z]{15}$/;
const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;

function readInput(input) {
  const phoneDigits = (v) => String(v ?? "").replace(/\D/g, "").slice(-10);
  const share = String(input.defaultSharePct ?? "").trim();
  const out = {
    name: text(input.name, 160),
    contact_person: text(input.contactPerson, 80),
    phone: phoneDigits(input.phone),
    alt_phone: text(input.altPhone, 15),
    email: text(input.email, 160).toLowerCase(),
    address: text(input.address, 400),
    city_id: input.cityId ? Number(input.cityId) || null : null,
    gstin: text(input.gstin, 20).toUpperCase().replace(/\s+/g, ""),
    bank_name: text(input.bankName, 120),
    bank_account: text(input.bankAccount, 40).replace(/\s+/g, ""),
    bank_ifsc: text(input.bankIfsc, 15).toUpperCase(),
    upi_id: text(input.upiId, 80),
    services: text(input.services, 1000),
    pricing_note: text(input.pricingNote, 1000),
    default_share_pct: share === "" ? null : Math.round(Number(share) * 100) / 100,
    agreement_status: AGREEMENT[input.agreementStatus] ? input.agreementStatus : "none",
    status: PARTNER_RECORD_STATUS[input.status] ? input.status : "active",
    joined_on: /^\d{4}-\d{2}-\d{2}$/.test(String(input.joinedOn ?? "")) ? input.joinedOn : null,
    notes: text(input.notes, 2000),
  };

  if (!out.name) throw new UserError("Enter the lab's name.");
  if (out.phone && out.phone.length !== 10) throw new UserError("Enter a valid 10-digit mobile number.");
  if (out.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(out.email)) throw new UserError("That email does not look right.");
  if (out.gstin && !GSTIN.test(out.gstin)) throw new UserError("A GSTIN is 15 letters and digits.");
  if (out.bank_ifsc && !IFSC.test(out.bank_ifsc)) throw new UserError("An IFSC looks like SBIN0001234 — 4 letters, a zero, then 6 letters or digits.");
  if (out.bank_account && !/^[0-9A-Za-z]{6,40}$/.test(out.bank_account)) throw new UserError("The account number should be letters and digits only.");
  if (out.default_share_pct !== null && !(out.default_share_pct >= 0 && out.default_share_pct <= 100)) {
    throw new UserError("The share must be between 0 and 100%.");
  }
  return out;
}

const ymdOf = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d ?? null);

/**
 * Create (id null) or update a partner, and replace the cities it serves.
 * Returns the id.
 */
export async function savePartner(id, input, { user }) {
  const next = readInput(input);
  const cityIds = [...new Set((input.cityIds ?? []).map(Number).filter((n) => Number.isInteger(n) && n > 0))].slice(0, 200);

  return transaction(async (conn) => {
    if (next.city_id) {
      const [[c]] = await conn.execute("SELECT name FROM service_cities WHERE id = ?", [next.city_id]);
      next.city = c?.name ?? "";
      if (!c) next.city_id = null;
    } else {
      next.city = "";
    }

    let before = null;
    let pid = Number(id) || 0;
    if (pid) {
      const [[row]] = await conn.execute("SELECT * FROM partners WHERE id = ? AND status <> 'deleted' FOR UPDATE", [pid]);
      if (!row) throw new UserError("That partner was not found.");
      before = row;
      // Not sent = keep the stored account number (the edit form does not
      // echo it back in full).
      if (input.bankAccount === undefined) next.bank_account = row.bank_account;
      const cols = Object.keys(next);
      await conn.execute(`UPDATE partners SET ${cols.map((c) => `${c} = ?`).join(", ")} WHERE id = ?`, [...cols.map((c) => next[c]), pid]);
    } else {
      const cols = [...Object.keys(next), "created_by"];
      const values = [...Object.values(next), user?.id ?? null];
      const [res] = await conn.execute(
        `INSERT INTO partners (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`,
        values
      );
      pid = res.insertId;
    }

    // partner_cities is a pure join table ("which cities this lab serves
    // today"), rewritten wholesale on every save. Its rows are a statement
    // about the present, not records with history — the one place in the CRM
    // a hard DELETE is allowed (see CRM conventions). The change itself is
    // kept in the activity row below (cities before/after).
    const [oldCities] = await conn.execute("SELECT city_id FROM partner_cities WHERE partner_id = ?", [pid]);
    const oldIds = oldCities.map((r) => Number(r.city_id)).sort((a, b) => a - b);
    await conn.execute("DELETE FROM partner_cities WHERE partner_id = ?", [pid]);
    if (cityIds.length) {
      const [valid] = await conn.execute(
        `SELECT id FROM service_cities WHERE id IN (${cityIds.map(() => "?").join(",")}) AND status <> 'deleted'`,
        cityIds
      );
      for (const c of valid) await conn.execute("INSERT INTO partner_cities (partner_id, city_id) VALUES (?, ?)", [pid, c.id]);
    }
    const newIds = [...cityIds].sort((a, b) => a - b);

    if (before) {
      const changed = Object.keys(next).filter((k) => String(ymdOf(before[k]) ?? "") !== String(next[k] ?? "") && !(k === "default_share_pct" && Number(before[k]) === Number(next[k]) && before[k] !== null && next[k] !== null));
      const citiesChanged = oldIds.join(",") !== newIds.join(",");
      if (changed.length || citiesChanged) {
        await logActivity({
          conn,
          user,
          action: "update",
          entity: "partners",
          entityId: pid,
          partnerId: pid,
          summary: `Edited ${next.name}: ${[...changed, ...(citiesChanged ? ["cities served"] : [])].join(", ")}`.slice(0, 255),
          before: { ...Object.fromEntries(changed.map((k) => [k, ymdOf(before[k])])), ...(citiesChanged ? { cities: oldIds } : {}) },
          after: { ...Object.fromEntries(changed.map((k) => [k, next[k]])), ...(citiesChanged ? { cities: newIds } : {}) },
        });
      }
    } else {
      await logActivity({
        conn,
        user,
        action: "create",
        entity: "partners",
        entityId: pid,
        partnerId: pid,
        summary: `Added lab partner ${next.name} (${partnerCode(pid)})`,
        after: { ...next, cities: newIds },
      });
    }
    return pid;
  });
}

/** Soft delete (status 'deleted'); bookings keep pointing at it. */
export async function archivePartner(id, { user }) {
  const [[p]] = await query("SELECT id, name, status FROM partners WHERE id = ? AND status <> 'deleted'", [Number(id) || 0]);
  if (!p) throw new UserError("That partner was not found.");
  const [[open]] = await query(
    `SELECT COUNT(*) AS n FROM bookings WHERE partner_id = ? AND deleted_at IS NULL
       AND partner_status IN ('pending','accepted') AND status IN (${OPEN_STATUSES.map(() => "?").join(",")})`,
    [p.id, ...OPEN_STATUSES]
  );
  if (Number(open.n)) throw new UserError(`This lab still has ${open.n} open orders. Reassign them first.`);
  await query("UPDATE partners SET status = 'deleted', deleted_at = UTC_TIMESTAMP() WHERE id = ?", [p.id]);
  await query("UPDATE admin_users SET status = 'disabled' WHERE role = 'partner' AND partner_id = ? AND status = 'active'", [p.id]);
  const [logins] = await query("SELECT id FROM admin_users WHERE role = 'partner' AND partner_id = ?", [p.id]);
  for (const l of logins) await revokeAllSessions(l.id);
  await logActivity({
    user,
    action: "delete",
    entity: "partners",
    entityId: p.id,
    partnerId: p.id,
    summary: `Removed lab partner ${p.name}; its logins were disabled`,
    before: { status: p.status },
    after: { status: "deleted" },
  });
  return { ok: true };
}

/* ── Pricing ──────────────────────────────────────────────────────────── */

/** Tests (active and hidden) with the partner's own price beside the standard one. */
export async function listPartnerPricing(partnerId, { search = "", limit = 50, offset = 0, overridesOnly = false } = {}) {
  const where = ["t.status IN ('active','hidden')"];
  const params = [Number(partnerId) || 0];
  if (search) {
    where.push("(t.name LIKE ? OR t.code LIKE ?)");
    params.push(like(search), like(search));
  }
  if (overridesOnly) where.push("pp.price IS NOT NULL");
  const lim = Math.min(200, Math.max(1, Number(limit) || 50));
  const off = Math.max(0, Number(offset) || 0);
  const clause = where.join(" AND ");
  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT t.id, t.name, t.code, t.is_package, t.status, t.price, t.partner_price, pp.price AS own_price, pp.updated_at AS own_updated_at
       FROM lab_tests t LEFT JOIN partner_prices pp ON pp.test_id = t.id AND pp.partner_id = ?
       WHERE ${clause}
       ORDER BY pp.price IS NULL, t.is_package DESC, t.sort_order, t.name
       LIMIT ${lim} OFFSET ${off}`,
      params
    ),
    query(
      `SELECT COUNT(*) AS n FROM lab_tests t LEFT JOIN partner_prices pp ON pp.test_id = t.id AND pp.partner_id = ? WHERE ${clause}`,
      params
    ),
  ]);
  return { rows, total: Number(count.n), limit: lim, offset: off };
}

/**
 * Set (or clear, with price null) a partner's own cost for one test. The
 * booking already priced keeps its snapshot; new assignments use this.
 */
export async function setPartnerPrice(partnerId, testId, price, { user }) {
  const pid = Number(partnerId) || 0;
  const [[p]] = await query("SELECT id, name FROM partners WHERE id = ? AND status <> 'deleted'", [pid]);
  if (!p) throw new UserError("That partner was not found.");
  const [[t]] = await query("SELECT id, name, partner_price FROM lab_tests WHERE id = ?", [String(testId)]);
  if (!t) throw new UserError("That test was not found.");
  const [[old]] = await query("SELECT price FROM partner_prices WHERE partner_id = ? AND test_id = ?", [pid, t.id]);
  const before = old ? Number(old.price) : null;

  if (price === null) {
    if (before === null) return { ok: true, unchanged: true };
    // partner_prices holds one override per (partner, test) and nothing else —
    // a relationship, not a record. Clearing an override removes that single
    // row so the standard partner price applies again; the old value is kept
    // in the activity log below.
    await query("DELETE FROM partner_prices WHERE partner_id = ? AND test_id = ?", [pid, t.id]);
  } else {
    const value = Math.round(Number(price) * 100) / 100;
    if (!Number.isFinite(value) || value < 0) throw new UserError("Enter a price of ₹0 or more.");
    if (before === value) return { ok: true, unchanged: true };
    await query(
      `INSERT INTO partner_prices (partner_id, test_id, price, updated_by) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE price = VALUES(price), updated_by = VALUES(updated_by)`,
      [pid, t.id, value, user?.id ?? null]
    );
    price = value;
  }

  await logActivity({
    user,
    action: "update",
    entity: "partners",
    entityId: pid,
    partnerId: pid,
    summary:
      price === null
        ? `${p.name}: removed own price for ${t.name} (was ₹${before}) — standard partner price applies`
        : `${p.name}: price for ${t.name} ${before === null ? "set to" : `₹${before} →`} ₹${price}`,
    before: { test_id: t.id, price: before },
    after: { test_id: t.id, price },
  });
  return { ok: true };
}

/* ── Sign-in accounts ─────────────────────────────────────────────────── */

export async function listPartnerLogins(partnerId) {
  const [rows] = await query(
    `SELECT id, name, email, phone, status, last_login_at, created_at FROM admin_users
     WHERE role = 'partner' AND partner_id = ? AND status <> 'deleted' ORDER BY status = 'active' DESC, name`,
    [Number(partnerId) || 0]
  );
  return rows;
}

export async function createPartnerLogin(partnerId, { name, email, password }, { user }) {
  const pid = Number(partnerId) || 0;
  const [[p]] = await query("SELECT id, name, status FROM partners WHERE id = ? AND status <> 'deleted'", [pid]);
  if (!p) throw new UserError("That partner was not found.");
  const mail = text(email, 160).toLowerCase();
  const who = text(name, 80);
  if (!who) throw new UserError("Enter the person's name.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) throw new UserError("That does not look like an email address.");
  const problem = passwordProblem(password);
  if (problem) throw new UserError(problem);

  let res;
  try {
    [res] = await query(
      "INSERT INTO admin_users (email, name, password_hash, role, partner_id) VALUES (?, ?, ?, 'partner', ?)",
      [mail, who, await hashPassword(password), pid]
    );
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") throw new UserError("There is already an account with that email.");
    throw err;
  }

  await logActivity({
    user,
    action: "create",
    entity: "partners",
    entityId: pid,
    partnerId: pid,
    summary: `Created partner login ${mail} for ${p.name}`,
    after: { user_id: res.insertId, email: mail, name: who, role: "partner" },
  });
  return { ok: true, id: res.insertId };
}

export async function setPartnerLoginStatus(partnerId, userId, status, { user }) {
  if (!["active", "disabled"].includes(status)) throw new UserError("Unknown status.");
  const pid = Number(partnerId) || 0;
  const [[acc]] = await query(
    "SELECT id, email, status FROM admin_users WHERE id = ? AND role = 'partner' AND partner_id = ? AND status <> 'deleted'",
    [Number(userId) || 0, pid]
  );
  if (!acc) throw new UserError("That login does not belong to this lab.");
  if (acc.status === status) return { ok: true };

  await query("UPDATE admin_users SET status = ? WHERE id = ?", [status, acc.id]);
  // A disabled account must stop working on its next click, not whenever its
  // cookie happens to expire.
  if (status === "disabled") await revokeAllSessions(acc.id);

  await logActivity({
    user,
    action: status === "active" ? "restore" : "archive",
    entity: "partners",
    entityId: pid,
    partnerId: pid,
    summary: `${acc.email} ${status === "active" ? "re-enabled" : "disabled and signed out"}`,
    before: { status: acc.status },
    after: { status },
  });
  if (status === "disabled") {
    await notify({ type: "partner.login", title: `Partner login disabled: ${acc.email}`, link: `/crm/partners/${pid}?tab=logins`, perm: "partners.manage" });
  }
  return { ok: true };
}

/* ── Activity ─────────────────────────────────────────────────────────── */

/**
 * Everything stamped with this partner: edits to the partner itself and every
 * booking / report / settlement event that carried its partner_id.
 */
export async function partnerActivity(partnerId, { limit = 60 } = {}) {
  const pid = Number(partnerId) || 0;
  const [rows] = await query(
    `SELECT a.id, a.user_name, a.user_email, a.user_role, a.action, a.entity, a.entity_id, a.summary, a.created_at
     FROM admin_audit a
     WHERE a.partner_id = ? OR (a.entity = 'partners' AND a.entity_id = ?)
     ORDER BY a.id DESC LIMIT ${Math.min(200, Math.max(1, Number(limit) || 60))}`,
    [pid, String(pid)]
  );
  return rows;
}

/* ── Partner orders board ─────────────────────────────────────────────── */

/** The SLA for a partner to accept an order: settings override, else default. */
export async function partnerAcceptSla(fallback) {
  try {
    const [[row]] = await query("SELECT value FROM settings WHERE `key` = 'crm.sla.partner_accept_hours'");
    const n = Number(row?.value);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  } catch {
    return fallback;
  }
}

/** Counts for the board's tabs, optionally for one partner. */
export async function partnerOrderCounts(partnerId = null) {
  const where = ["b.deleted_at IS NULL", "b.partner_id IS NOT NULL"];
  const params = [];
  if (partnerId) {
    where.push("b.partner_id = ?");
    params.push(Number(partnerId) || 0);
  }
  const [[row]] = await query(
    `SELECT
       SUM(b.partner_status = 'pending' AND b.status NOT IN ('cancelled','completed')) AS awaiting,
       SUM(b.partner_status = 'rejected' AND b.status NOT IN ('cancelled','completed')) AS rejected,
       SUM(b.partner_status = 'accepted' AND b.status IN ('booked','confirmed','collection_assigned','sample_collected','sample_received','processing')) AS inlab,
       SUM(b.partner_status = 'accepted' AND b.status IN ('sample_received','processing') AND b.report_ready_at IS NULL
           AND b.report_due_at IS NOT NULL AND b.report_due_at < UTC_TIMESTAMP()) AS overdue,
       SUM(b.partner_status = 'accepted' AND b.status IN ('report_ready','report_delivered','completed')) AS completed
     FROM bookings b WHERE ${where.join(" AND ")}`,
    params
  );
  return Object.fromEntries(Object.entries(row).map(([k, v]) => [k, Number(v ?? 0)]));
}

/**
 * Accepted orders whose report is past due. listBookings has no "due before"
 * filter, so this one tab has its own query (same columns, same shape).
 */
export async function listOverdueReports({ partnerId = null, limit = 25, offset = 0 } = {}) {
  const where = [
    "b.deleted_at IS NULL",
    "b.partner_status = 'accepted'",
    "b.status IN ('sample_received','processing')",
    "b.report_ready_at IS NULL",
    "b.report_due_at IS NOT NULL",
    "b.report_due_at < UTC_TIMESTAMP()",
  ];
  const params = [];
  if (partnerId) {
    where.push("b.partner_id = ?");
    params.push(Number(partnerId) || 0);
  }
  const lim = Math.min(100, Math.max(1, Number(limit) || 25));
  const off = Math.max(0, Number(offset) || 0);
  const clause = where.join(" AND ");
  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT b.*, p.name AS partner_name,
              (SELECT GROUP_CONCAT(i.name ORDER BY i.id SEPARATOR ' + ') FROM booking_items i
                WHERE i.booking_id = b.id AND i.status = 'active') AS items_label
       FROM bookings b LEFT JOIN partners p ON p.id = b.partner_id
       WHERE ${clause} ORDER BY b.report_due_at ASC LIMIT ${lim} OFFSET ${off}`,
      params
    ),
    query(`SELECT COUNT(*) AS n FROM bookings b WHERE ${clause}`, params),
  ]);
  return { rows, total: Number(count.n), limit: lim, offset: off };
}
