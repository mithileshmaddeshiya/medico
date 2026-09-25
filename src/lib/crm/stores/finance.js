/**
 * Finance — payments, refunds, expenses and the revenue / P&L figures.
 * Server only.
 *
 * ── WHAT COUNTS AS MONEY ─────────────────────────────────────────────────
 * Revenue here is CASH: payments with status 'paid', dated by received_at,
 * minus refunds with status 'processed', dated by processed_at. A pending
 * payment is a promise, not revenue — it is shown as "Pending amount", never
 * added in.
 *
 * The P&L also carries an ACCRUAL view — bookings that reached report_ready
 * (or later) in the period, at their final_amount and partner_cost — because
 * margin is earned when the work is done, not when the customer pays. Every
 * screen labels which view a figure belongs to; mixing them silently is how
 * an owner gets misled.
 *
 * ── WHO WRITES WHAT ──────────────────────────────────────────────────────
 * Payment rows are written by stores/bookings.js (recordPayment,
 * setPaymentStatus). Refund and expense rows are written here. Every refund
 * change runs in a transaction that ends in recomputeBookingPayment(), the
 * only writer of bookings.paid_amount / refunded_amount / payment_status.
 * Nothing is ever DELETEd: an expense is soft-deleted, a refund is rejected.
 */
import { query, transaction } from "@/lib/db";

import { logActivity, notify } from "../activity";
import {
  EXPENSE_CATEGORY,
  PAYMENT_MODE,
  REFUND_STATUS,
  TXN_STATUS,
  bookingCode,
  parseBookingCode,
} from "../constants";
import { addDays, daysIn, istDay, istDaySql, previous, range } from "../dates";
import { dateRangeOf } from "../filters";
import { UserError } from "../guard";
import { lockBooking, recomputeBookingPayment, scopeWhere } from "./bookings";

const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";
const text = (value, max) => String(value ?? "").trim().slice(0, max);
const money = (value) => {
  const n = Math.round(Number(String(value ?? "").replace(/[,₹\s]/g, "")) * 100) / 100;
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const like = (value) => `%${String(value).replace(/[%_]/g, "\\$&")}%`;
const validYmd = (v) => /^\d{4}-\d{2}-\d{2}$/.test(String(v ?? ""));
const n = (v) => Number(v ?? 0) || 0;
const inr = (v) => `₹${n(v).toLocaleString("en-IN")}`;
const DAY = (col) => `DATE_FORMAT(${istDaySql(col)}, '%Y-%m-%d')`;

export const refundCode = (id) => (id ? `RF${String(id).padStart(4, "0")}` : "—");

/** "PAY5001" / "pay 5001" → 5001, else null. */
const parsePaymentCode = (q) => {
  const m = /^\s*pay\s*(\d+)\s*$/i.exec(String(q ?? ""));
  return m ? Number(m[1]) : null;
};

/**
 * A datetime-local value typed in IST ("2026-09-25T14:30") → the UTC
 * "YYYY-MM-DD HH:MM:SS" the DB stores. recordPayment() writes what it is
 * given as-is, so the conversion happens here, before the call.
 */
export function istLocalToUtc(value) {
  const v = String(value ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v)) return null;
  const d = new Date(`${v.slice(0, 16)}:00+05:30`);
  if (Number.isNaN(d.getTime())) return null;
  if (d.getTime() > Date.now() + 5 * 60000) throw new UserError("The date and time cannot be in the future.");
  return d.toISOString().slice(0, 19).replace("T", " ");
}

/** Now in IST as a datetime-local value — the default for "received at". */
export function nowIstLocal() {
  return new Date(Date.now() + 330 * 60000).toISOString().slice(0, 16);
}

/* ── Period helpers ───────────────────────────────────────────────────── */

const shift = (r, days) => range("custom", { from: addDays(r.fromDay, days), to: addDays(r.toDay, days) });

/** 1st of last month → the same day-of-month (clamped), for a like-for-like month-to-date comparison. */
export function lastMonthToDate() {
  const today = istDay();
  const [y, m, d] = today.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 2, 1));
  const len = new Date(Date.UTC(y, m - 1, 0)).getUTCDate();
  const from = first.toISOString().slice(0, 10);
  const to = `${from.slice(0, 8)}${String(Math.min(d, len)).padStart(2, "0")}`;
  return range("custom", { from, to });
}

/** The whole of last month (for "last month total"). */
function lastMonthFull() {
  const today = istDay();
  const [y, m] = today.split("-").map(Number);
  const from = new Date(Date.UTC(y, m - 2, 1)).toISOString().slice(0, 10);
  const to = new Date(Date.UTC(y, m - 1, 0)).toISOString().slice(0, 10);
  return range("custom", { from, to });
}

/** Conditional-sum columns for several windows in one scan. */
function windowSums(windows, dateCol, valueCol, extra = () => "1 = 1") {
  const cols = [];
  const params = [];
  for (const [key, r, cond] of windows) {
    cols.push(`COALESCE(SUM(CASE WHEN ${dateCol} >= ? AND ${dateCol} < ? AND ${extra(cond)} THEN ${valueCol} END), 0) AS \`${key}\``);
    params.push(r.from, r.to);
  }
  return { sql: cols.join(",\n"), params };
}

/* ═══ PAYMENTS ═══════════════════════════════════════════════════════════ */

/** URL → payment list filters (shared by the page and its export). */
export function paymentFiltersFrom(sp) {
  const r = dateRangeOf(sp);
  const mode = one(sp.mode);
  const status = one(sp.status);
  return {
    ...(r ? { from: r.from, to: r.to, fromDay: r.fromDay, toDay: r.toDay } : {}),
    rangeLabel: r?.label ?? null,
    mode: PAYMENT_MODE[mode] ? mode : null,
    status: TXN_STATUS[status] ? status : null,
    collectorId: Number(one(sp.collector)) || null,
    search: one(sp.q).trim().slice(0, 80),
  };
}

function paymentWhere(f) {
  const where = ["1 = 1"];
  const params = [];
  if (f.from) {
    where.push("pm.received_at >= ?");
    params.push(f.from);
  }
  if (f.to) {
    where.push("pm.received_at < ?");
    params.push(f.to);
  }
  if (f.mode) {
    where.push("pm.mode = ?");
    params.push(f.mode);
  }
  if (f.status) {
    where.push("pm.status = ?");
    params.push(f.status);
  }
  if (f.collectorId) {
    where.push("pm.collected_by = ?");
    params.push(f.collectorId);
  }
  if (f.search) {
    const q = f.search;
    const ors = ["b.patient_name LIKE ?", "c.name LIKE ?", "pm.reference LIKE ?"];
    params.push(like(q), like(q), like(q));
    const pay = parsePaymentCode(q);
    if (pay) {
      ors.push("pm.id = ?");
      params.push(pay);
    }
    const code = parseBookingCode(q);
    if (code) {
      ors.push("pm.booking_id = ?");
      params.push(code);
    }
    const digits = q.replace(/\D/g, "");
    if (digits.length >= 4 && !/^pay/i.test(q)) {
      ors.push("b.patient_phone LIKE ?", "c.phone LIKE ?");
      params.push(like(digits), like(digits));
    }
    where.push(`(${ors.join(" OR ")})`);
  }
  return { sql: `WHERE ${where.join(" AND ")}`, params };
}

const PAYMENT_FROM = `FROM payments pm
  LEFT JOIN bookings b ON b.id = pm.booking_id
  LEFT JOIN customers c ON c.id = pm.customer_id
  LEFT JOIN admin_users u ON u.id = pm.collected_by`;

/** The transactions list, newest first, paginated in SQL. */
export async function listPayments(filters = {}) {
  const w = paymentWhere(filters);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 25));
  const offset = Math.max(0, Number(filters.offset) || 0);
  const [[rows], [[agg]]] = await Promise.all([
    query(
      `SELECT pm.*, b.patient_name, b.patient_phone, b.city, b.status AS booking_status,
              c.name AS customer_name, c.phone AS customer_phone, u.name AS collected_by_name
       ${PAYMENT_FROM} ${w.sql}
       ORDER BY pm.received_at DESC, pm.id DESC
       LIMIT ${limit} OFFSET ${offset}`,
      w.params
    ),
    query(
      `SELECT COUNT(*) AS n,
              COALESCE(SUM(CASE WHEN pm.status = 'paid' THEN pm.amount END), 0) AS paid,
              COALESCE(SUM(CASE WHEN pm.status = 'pending' THEN pm.amount END), 0) AS pending
       ${PAYMENT_FROM} ${w.sql}`,
      w.params
    ),
  ]);
  return { rows, total: n(agg.n), paidSum: n(agg.paid), pendingSum: n(agg.pending), limit, offset };
}

/**
 * The payments dashboard strip. Every window is IST; comparisons are
 * like-for-like (this week so far vs the same days last week, month-to-date
 * vs the same days of last month), not a partial period vs a full one.
 */
export async function paymentKpis() {
  const today = range("today");
  const week = range("week");
  const month = range("month");
  const lastMonth = lastMonthToDate();
  const W = [
    ["today", today],
    ["yesterday", range("yesterday")],
    ["week", week],
    ["lastWeek", shift(week, -7)],
    ["month", month],
    ["lastMonth", lastMonth],
    ["online", month, "online"],
    ["onlinePrev", lastMonth, "online"],
    ["cash", month, "cash"],
    ["cashPrev", lastMonth, "cash"],
    ["upi", month, "upi"],
    ["upiPrev", lastMonth, "upi"],
  ];
  const earliest = [lastMonth.from, shift(week, -7).from].sort()[0];
  const pay = windowSums(W, "received_at", "amount", (mode) => (mode ? `mode = '${mode}'` : "1 = 1"));
  const ref = windowSums(
    [
      ["month", month],
      ["lastMonth", lastMonth],
    ],
    "processed_at",
    "amount"
  );
  const spark = range("custom", { from: addDays(today.fromDay, -13), to: today.fromDay });

  const [[[p]], [[r]], [[all]], [[pending]], [daily]] = await Promise.all([
    query(`SELECT ${pay.sql} FROM payments WHERE status = 'paid' AND received_at >= ?`, [...pay.params, earliest]),
    query(`SELECT ${ref.sql} FROM refunds WHERE status = 'processed' AND processed_at >= ?`, [...ref.params, lastMonth.from]),
    query(
      `SELECT (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'paid')
            - (SELECT COALESCE(SUM(amount), 0) FROM refunds WHERE status = 'processed') AS net`
    ),
    query(
      `SELECT COALESCE(SUM(GREATEST(0, final_amount - paid_amount + refunded_amount)), 0) AS amount,
              COALESCE(SUM(final_amount - paid_amount + refunded_amount > 0.009), 0) AS bookings
       FROM bookings WHERE deleted_at IS NULL AND status <> 'cancelled'`
    ),
    query(
      `SELECT ${DAY("received_at")} AS d, SUM(amount) AS amount FROM payments
       WHERE status = 'paid' AND received_at >= ? AND received_at < ? GROUP BY d`,
      [spark.from, spark.to]
    ),
  ]);

  const byDay = Object.fromEntries(daily.map((row) => [row.d, n(row.amount)]));
  const out = Object.fromEntries(Object.entries(p).map(([k, v]) => [k, n(v)]));
  return {
    ...out,
    refunds: n(r.month),
    refundsPrev: n(r.lastMonth),
    allTimeNet: n(all.net),
    pendingAmount: n(pending.amount),
    pendingBookings: n(pending.bookings),
    spark: daysIn(spark).map((d) => byDay[d] ?? 0),
  };
}

/** Paid collection by mode for a window (defaults to this month). */
export async function collectionByMode(r = range("month")) {
  const [rows] = await query(
    `SELECT mode, COALESCE(SUM(amount), 0) AS amount, COUNT(*) AS n FROM payments
     WHERE status = 'paid' AND received_at >= ? AND received_at < ? GROUP BY mode`,
    [r.from, r.to]
  );
  return rows.map((row) => ({ mode: row.mode, amount: n(row.amount), count: n(row.n) }));
}

/* ── Record payment: find the booking ─────────────────────────────────── */

const DUE = "GREATEST(0, b.final_amount - b.paid_amount + b.refunded_amount)";

/**
 * Open bookings to take a payment against — by booking code, phone or name.
 * With no query: the most recent bookings that still have money due.
 * Scoped: a collector only finds the bookings assigned to them.
 */
export async function searchPayableBookings(q, scope = {}) {
  const s = scopeWhere(scope);
  const where = ["b.deleted_at IS NULL", "b.status <> 'cancelled'", ...s.sql];
  const params = [...s.params];
  const term = text(q, 80);
  if (term) {
    const ors = ["b.patient_name LIKE ?"];
    params.push(like(term));
    const code = parseBookingCode(term);
    if (code) {
      ors.push("b.id = ?");
      params.push(code);
    }
    const digits = term.replace(/\D/g, "");
    if (digits.length >= 4) {
      ors.push("b.patient_phone LIKE ?", "b.alt_phone LIKE ?");
      params.push(like(digits), like(digits));
    }
    where.push(`(${ors.join(" OR ")})`);
  } else {
    where.push(`${DUE} > 0.009`);
  }
  const [rows] = await query(
    `SELECT b.id, b.patient_name, b.patient_phone, b.city, b.status, b.payment_status, b.final_amount,
            b.paid_amount, b.refunded_amount, b.created_at, ${DUE} AS due,
            (SELECT GROUP_CONCAT(i.name ORDER BY i.id SEPARATOR ' + ') FROM booking_items i
              WHERE i.booking_id = b.id AND i.status = 'active') AS items_label
     FROM bookings b WHERE ${where.join(" AND ")}
     ORDER BY (${DUE} > 0.009) DESC, b.created_at DESC LIMIT 20`,
    params
  );
  return rows;
}

/** One booking's money summary, for the payment form. */
export async function payableBooking(id, scope = {}) {
  const s = scopeWhere(scope);
  const [rows] = await query(
    `SELECT b.id, b.patient_name, b.patient_phone, b.city, b.status, b.payment_status, b.final_amount,
            b.paid_amount, b.refunded_amount, ${DUE} AS due,
            (SELECT GROUP_CONCAT(i.name ORDER BY i.id SEPARATOR ' + ') FROM booking_items i
              WHERE i.booking_id = b.id AND i.status = 'active') AS items_label
     FROM bookings b WHERE b.id = ? AND b.deleted_at IS NULL ${s.sql.length ? `AND ${s.sql.join(" AND ")}` : ""} LIMIT 1`,
    [Number(id) || 0, ...s.params]
  );
  return rows[0] ?? null;
}

/* ═══ REFUNDS ════════════════════════════════════════════════════════════ */

export function refundFiltersFrom(sp) {
  const r = dateRangeOf(sp);
  const status = one(sp.status);
  const mode = one(sp.mode);
  return {
    ...(r ? { from: r.from, to: r.to } : {}),
    rangeLabel: r?.label ?? null,
    status: REFUND_STATUS[status] ? status : null,
    mode: PAYMENT_MODE[mode] ? mode : null,
    search: one(sp.q).trim().slice(0, 80),
  };
}

function refundWhere(f, { withStatus = true } = {}) {
  const where = ["1 = 1"];
  const params = [];
  if (f.from) {
    where.push("r.created_at >= ?");
    params.push(f.from);
  }
  if (f.to) {
    where.push("r.created_at < ?");
    params.push(f.to);
  }
  if (withStatus && f.status) {
    where.push("r.status = ?");
    params.push(f.status);
  }
  if (f.mode) {
    where.push("r.mode = ?");
    params.push(f.mode);
  }
  if (f.search) {
    const q = f.search;
    const ors = ["b.patient_name LIKE ?", "r.reference LIKE ?", "r.reason LIKE ?"];
    params.push(like(q), like(q), like(q));
    const code = parseBookingCode(q);
    if (code) {
      ors.push("r.booking_id = ?");
      params.push(code);
    }
    const rf = /^\s*rf\s*(\d+)\s*$/i.exec(q);
    if (rf) {
      ors.push("r.id = ?");
      params.push(Number(rf[1]));
    }
    const digits = q.replace(/\D/g, "");
    if (digits.length >= 4) {
      ors.push("b.patient_phone LIKE ?");
      params.push(like(digits));
    }
    where.push(`(${ors.join(" OR ")})`);
  }
  return { sql: `WHERE ${where.join(" AND ")}`, params };
}

const REFUND_FROM = `FROM refunds r
  LEFT JOIN bookings b ON b.id = r.booking_id
  LEFT JOIN admin_users ru ON ru.id = r.requested_by
  LEFT JOIN admin_users pu ON pu.id = r.processed_by`;

export async function listRefunds(filters = {}) {
  const w = refundWhere(filters);
  const c = refundWhere(filters, { withStatus: false });
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 25));
  const offset = Math.max(0, Number(filters.offset) || 0);
  const [[rows], [[agg]], [counts]] = await Promise.all([
    query(
      `SELECT r.*, b.patient_name, b.patient_phone, b.paid_amount AS booking_paid, b.refunded_amount AS booking_refunded,
              b.payment_status AS booking_payment_status, ru.name AS requested_by_name, pu.name AS processed_by_name
       ${REFUND_FROM} ${w.sql}
       ORDER BY r.id DESC LIMIT ${limit} OFFSET ${offset}`,
      w.params
    ),
    query(`SELECT COUNT(*) AS n, COALESCE(SUM(r.amount), 0) AS amount ${REFUND_FROM} ${w.sql}`, w.params),
    query(`SELECT r.status, COUNT(*) AS n FROM refunds r LEFT JOIN bookings b ON b.id = r.booking_id ${c.sql} GROUP BY r.status`, c.params),
  ]);
  return {
    rows,
    total: n(agg.n),
    amount: n(agg.amount),
    counts: Object.fromEntries(counts.map((x) => [x.status, n(x.n)])),
    limit,
    offset,
  };
}

/** Paid, refunded and still-open refund amounts for a booking. */
async function refundable(conn, bookingId, { exceptRefundId = 0 } = {}) {
  const [[p]] = await conn.execute(
    "SELECT COALESCE(SUM(amount), 0) AS paid FROM payments WHERE booking_id = ? AND status = 'paid'",
    [bookingId]
  );
  const [[r]] = await conn.execute(
    `SELECT COALESCE(SUM(CASE WHEN status = 'processed' THEN amount END), 0) AS processed,
            COALESCE(SUM(CASE WHEN status IN ('requested','approved') THEN amount END), 0) AS open
     FROM refunds WHERE booking_id = ? AND id <> ?`,
    [bookingId, exceptRefundId]
  );
  const paid = n(p.paid);
  const processed = n(r.processed);
  const open = n(r.open);
  return { paid, processed, open, available: Math.max(0, Math.round((paid - processed - open) * 100) / 100) };
}

/** For the "Request refund" dialog: what was paid on a booking and what can still be refunded. */
export async function refundLookup(codeOrId) {
  const id = parseBookingCode(codeOrId) ?? (Number(codeOrId) || 0);
  if (!id) return null;
  const [[b]] = await query(
    "SELECT id, patient_name, patient_phone, final_amount, payment_status, status FROM bookings WHERE id = ? AND deleted_at IS NULL",
    [id]
  );
  if (!b) return null;
  const [payments] = await query(
    "SELECT id, amount, mode, received_at, gateway_payment_id FROM payments WHERE booking_id = ? AND status = 'paid' ORDER BY id",
    [id]
  );
  const conn = { execute: (sql, params) => query(sql, params) };
  const m = await refundable(conn, id);
  return {
    id: b.id,
    code: bookingCode(b.id),
    name: b.patient_name,
    finalAmount: n(b.final_amount),
    paymentStatus: b.payment_status,
    status: b.status,
    ...m,
    payments: payments.map((x) => ({ id: x.id, amount: n(x.amount), mode: x.mode, online: Boolean(x.gateway_payment_id) })),
  };
}

export async function requestRefund(input, { user }) {
  const bookingId = parseBookingCode(input.booking) ?? (Number(input.bookingId) || 0);
  if (!bookingId) throw new UserError("Enter the booking ID (MB…).");
  const amount = money(input.amount);
  if (!(amount > 0)) throw new UserError("Enter the refund amount.");
  const mode = PAYMENT_MODE[input.mode] ? input.mode : null;
  if (!mode) throw new UserError("Pick how the refund will be paid.");
  const reason = text(input.reason, 500);
  if (!reason) throw new UserError("Say why the customer is being refunded.");

  const out = await transaction(async (conn) => {
    const b = await lockBooking(conn, bookingId);
    const m = await refundable(conn, b.id);
    if (m.paid <= 0) throw new UserError(`${bookingCode(b.id)} has no paid amount to refund.`);
    if (amount > m.available + 0.009) {
      throw new UserError(`At most ${inr(m.available)} can be refunded on ${bookingCode(b.id)} (paid ${inr(m.paid)}, already refunded or requested ${inr(m.processed + m.open)}).`);
    }
    let paymentId = Number(input.paymentId) || null;
    if (paymentId) {
      const [[pm]] = await conn.execute("SELECT id FROM payments WHERE id = ? AND booking_id = ? AND status = 'paid'", [paymentId, b.id]);
      if (!pm) paymentId = null;
    }
    const [res] = await conn.execute(
      `INSERT INTO refunds (booking_id, payment_id, amount, reason, mode, status, requested_by)
       VALUES (?, ?, ?, ?, ?, 'requested', ?)`,
      [b.id, paymentId, amount, reason, mode, user?.id ?? null]
    );
    await logActivity({
      conn,
      user,
      action: "refund",
      entity: "refunds",
      entityId: res.insertId,
      summary: `Requested refund ${refundCode(res.insertId)} of ${inr(amount)} on ${bookingCode(b.id)} — ${reason.slice(0, 120)}`,
      before: null,
      after: { booking_id: b.id, payment_id: paymentId, amount, mode, status: "requested", reason },
    });
    return { b, id: res.insertId };
  });

  await notify({
    type: "refund.requested",
    title: `Refund requested · ${inr(amount)}`,
    body: `${bookingCode(out.b.id)} · ${out.b.patient_name} — ${reason.slice(0, 140)}`,
    link: `/crm/refunds?status=requested`,
    perm: "refunds.manage",
    severity: "warning",
  });
  return { ok: true, id: out.id };
}

const REFUND_MOVES = {
  approved: ["requested"],
  rejected: ["requested", "approved"],
  processed: ["approved"],
};

/**
 * Move a refund along requested → approved → processed (or → rejected).
 * The booking is locked first, then the refund — the same order
 * requestRefund() takes — so two people acting at once queue, not deadlock.
 */
export async function moveRefund(refundId, to, { user, reason = "", reference = "", mode = "", processedAt = "" }) {
  if (!REFUND_MOVES[to]) throw new UserError("Unknown refund step.");
  const id = Number(refundId) || 0;
  const [[peek]] = await query("SELECT booking_id FROM refunds WHERE id = ?", [id]);
  if (!peek) throw new UserError("That refund was not found.");

  const out = await transaction(async (conn) => {
    const b = await lockBooking(conn, peek.booking_id);
    const [[r]] = await conn.execute("SELECT * FROM refunds WHERE id = ? FOR UPDATE", [id]);
    if (!REFUND_MOVES[to].includes(r.status)) {
      throw new UserError(`This refund is ${REFUND_STATUS[r.status]?.label.toLowerCase() ?? r.status}; it cannot be ${REFUND_STATUS[to].label.toLowerCase()} now.`);
    }
    const before = { status: r.status, mode: r.mode, reference: r.reference, processed_at: r.processed_at, booking_payment_status: b.payment_status };
    let after = { status: to };
    let payment = null;

    if (to === "approved") {
      await conn.execute("UPDATE refunds SET status = 'approved' WHERE id = ?", [r.id]);
    } else if (to === "rejected") {
      const why = text(reason, 200);
      if (!why) throw new UserError("Say why the refund is rejected.");
      await conn.execute("UPDATE refunds SET status = 'rejected', reason = LEFT(CONCAT(reason, ?), 500) WHERE id = ?", [
        ` [rejected: ${why}]`,
        r.id,
      ]);
      after = { status: to, reject_reason: why };
    } else {
      const m = await refundable(conn, b.id, { exceptRefundId: r.id });
      const room = m.paid - m.processed;
      if (n(r.amount) > room + 0.009) {
        throw new UserError(`Only ${inr(room)} is left to refund on ${bookingCode(b.id)} — the payments have changed since this was requested.`);
      }
      const how = PAYMENT_MODE[mode] ? mode : r.mode;
      const ref = text(reference, 120);
      if (!ref && how !== "cash") throw new UserError("Enter the transaction ID / UTR of the refund.");
      let at = null;
      if (validYmd(processedAt)) {
        if (processedAt > istDay()) throw new UserError("The processed date cannot be in the future.");
        // A past date is stamped at IST noon of that day; today is stamped now.
        at = processedAt === istDay() ? null : `${processedAt} 06:30:00`;
      }
      await conn.execute(
        `UPDATE refunds SET status = 'processed', mode = ?, reference = ?, processed_by = ?,
                processed_at = COALESCE(?, UTC_TIMESTAMP()) WHERE id = ?`,
        [how, ref, user?.id ?? null, at, r.id]
      );
      payment = await recomputeBookingPayment(conn, b.id);
      after = { status: to, mode: how, reference: ref, processed_at: at ?? "now", booking_payment_status: payment?.status };
    }

    const verb = { approved: "Approved", rejected: "Rejected", processed: "Processed" }[to];
    await logActivity({
      conn,
      user,
      action: "refund",
      entity: "refunds",
      entityId: r.id,
      summary: `${verb} refund ${refundCode(r.id)} (${inr(r.amount)}) on ${bookingCode(b.id)} · ${REFUND_STATUS[r.status].label} → ${REFUND_STATUS[to].label}${
        to === "rejected" ? ` — ${text(reason, 100)}` : ""
      }${payment ? ` · payment ${b.payment_status} → ${payment.status}` : ""}`,
      before,
      after,
    });
    return { b, r, payment };
  });

  if (to === "processed") {
    await notify({
      type: "refund.processed",
      title: `Refund processed · ${inr(out.r.amount)}`,
      body: `${bookingCode(out.b.id)} · ${out.b.patient_name}${out.payment?.status === "refunded" ? " · fully refunded" : ""}`,
      link: `/crm/bookings/${out.b.id}`,
      perm: "payments.view",
      severity: "info",
    });
  } else if (to === "approved") {
    await notify({
      type: "refund.approved",
      title: `Refund approved — ready to pay · ${inr(out.r.amount)}`,
      body: `${bookingCode(out.b.id)} · ${out.b.patient_name}`,
      link: "/crm/refunds?status=approved",
      perm: "refunds.manage",
    });
  } else if (out.r.requested_by && out.r.requested_by !== user?.id) {
    await notify({
      type: "refund.rejected",
      title: `Refund rejected · ${bookingCode(out.b.id)}`,
      body: text(reason, 200),
      link: "/crm/refunds?status=rejected",
      userId: out.r.requested_by,
      severity: "warning",
    });
  }
  return { ok: true };
}

/* ═══ EXPENSES ═══════════════════════════════════════════════════════════ */

export function expenseFiltersFrom(sp) {
  const r = dateRangeOf(sp);
  const category = one(sp.category);
  const mode = one(sp.mode);
  return {
    ...(r ? { fromDay: r.fromDay, toDay: r.toDay } : {}),
    rangeLabel: r?.label ?? null,
    category: EXPENSE_CATEGORY[category] ? category : null,
    mode: PAYMENT_MODE[mode] ? mode : null,
    cityId: Number(one(sp.city)) || null,
    search: one(sp.q).trim().slice(0, 80),
  };
}

function expenseWhere(f, { withCategory = true } = {}) {
  const where = ["e.status = 'active'"];
  const params = [];
  if (f.fromDay) {
    where.push("e.spent_on >= ?");
    params.push(f.fromDay);
  }
  if (f.toDay) {
    where.push("e.spent_on <= ?");
    params.push(f.toDay);
  }
  if (withCategory && f.category) {
    where.push("e.category = ?");
    params.push(f.category);
  }
  if (f.mode) {
    where.push("e.mode = ?");
    params.push(f.mode);
  }
  if (f.cityId) {
    where.push("e.city_id = ?");
    params.push(f.cityId);
  }
  if (f.search) {
    where.push("(e.paid_to LIKE ? OR e.reference LIKE ? OR e.notes LIKE ?)");
    params.push(like(f.search), like(f.search), like(f.search));
  }
  return { sql: `WHERE ${where.join(" AND ")}`, params };
}

export async function listExpenses(filters = {}) {
  const w = expenseWhere(filters);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 25));
  const offset = Math.max(0, Number(filters.offset) || 0);
  const [[rows], [[agg]]] = await Promise.all([
    query(
      `SELECT e.*, DATE_FORMAT(e.spent_on, '%Y-%m-%d') AS spent_day, sc.name AS city_name, u.name AS created_by_name
       FROM expenses e
       LEFT JOIN service_cities sc ON sc.id = e.city_id
       LEFT JOIN admin_users u ON u.id = e.created_by
       ${w.sql}
       ORDER BY e.spent_on DESC, e.id DESC LIMIT ${limit} OFFSET ${offset}`,
      w.params
    ),
    query(`SELECT COUNT(*) AS n, COALESCE(SUM(e.amount), 0) AS amount FROM expenses e ${w.sql}`, w.params),
  ]);
  return { rows, total: n(agg.n), amount: n(agg.amount), limit, offset };
}

/** Spend by category for the filtered view (every filter except category itself). */
export async function expensesByCategory(filters = {}) {
  const w = expenseWhere(filters, { withCategory: false });
  const [rows] = await query(
    `SELECT e.category, COALESCE(SUM(e.amount), 0) AS amount, COUNT(*) AS n FROM expenses e ${w.sql}
     GROUP BY e.category ORDER BY amount DESC`,
    w.params
  );
  return rows.map((r) => ({ category: r.category, amount: n(r.amount), count: n(r.n) }));
}

export async function expenseKpis() {
  const month = range("month");
  const lastMtd = lastMonthToDate();
  const lastFull = lastMonthFull();
  const [[[t]], [[top]]] = await Promise.all([
    query(
      `SELECT
         COALESCE(SUM(CASE WHEN spent_on BETWEEN ? AND ? THEN amount END), 0) AS month,
         COALESCE(SUM(CASE WHEN spent_on BETWEEN ? AND ? THEN 1 END), 0) AS monthCount,
         COALESCE(SUM(CASE WHEN spent_on BETWEEN ? AND ? THEN amount END), 0) AS lastMtd,
         COALESCE(SUM(CASE WHEN spent_on BETWEEN ? AND ? THEN amount END), 0) AS lastFull
       FROM expenses WHERE status = 'active' AND spent_on >= ?`,
      [month.fromDay, month.toDay, month.fromDay, month.toDay, lastMtd.fromDay, lastMtd.toDay, lastFull.fromDay, lastFull.toDay, lastFull.fromDay]
    ),
    query(
      `SELECT category, SUM(amount) AS amount FROM expenses
       WHERE status = 'active' AND spent_on BETWEEN ? AND ? GROUP BY category ORDER BY amount DESC LIMIT 1`,
      [month.fromDay, month.toDay]
    ),
  ]);
  return {
    month: n(t.month),
    monthCount: n(t.monthCount),
    lastMtd: n(t.lastMtd),
    lastFull: n(t.lastFull),
    topCategory: top ? { category: top.category, amount: n(top.amount) } : null,
  };
}

function readExpense(input) {
  const category = EXPENSE_CATEGORY[input.category] ? input.category : null;
  if (!category) throw new UserError("Pick a category.");
  const amount = money(input.amount);
  if (!(amount > 0)) throw new UserError("Enter the amount spent.");
  if (amount > 10_000_000) throw new UserError("That amount looks wrong — check the digits.");
  const spentOn = validYmd(input.spentOn) ? input.spentOn : null;
  if (!spentOn) throw new UserError("Enter the date it was spent.");
  if (spentOn > istDay()) throw new UserError("The date cannot be in the future.");
  const mode = PAYMENT_MODE[input.mode] ? input.mode : null;
  if (!mode) throw new UserError("Pick how it was paid.");
  return {
    category,
    amount,
    spent_on: spentOn,
    mode,
    paid_to: text(input.paidTo, 120),
    city_id: Number(input.cityId) || null,
    reference: text(input.reference, 120),
    notes: text(input.notes, 500),
  };
}

export async function saveExpense(id, input, { user }) {
  const e = readExpense(input);
  if (!id) {
    const [res] = await query(
      `INSERT INTO expenses (category, amount, spent_on, mode, paid_to, city_id, reference, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [e.category, e.amount, e.spent_on, e.mode, e.paid_to, e.city_id, e.reference, e.notes, user?.id ?? null]
    );
    await logActivity({
      user,
      action: "create",
      entity: "expenses",
      entityId: res.insertId,
      summary: `Added expense ${inr(e.amount)} · ${EXPENSE_CATEGORY[e.category].label}${e.paid_to ? ` · ${e.paid_to}` : ""} (${e.spent_on})`,
      after: e,
    });
    return { ok: true, id: res.insertId };
  }

  return transaction(async (conn) => {
    const [[row]] = await conn.execute(
      `SELECT id, category, amount, DATE_FORMAT(spent_on, '%Y-%m-%d') AS spent_on, mode, paid_to, city_id, reference, notes, status
       FROM expenses WHERE id = ? FOR UPDATE`,
      [Number(id) || 0]
    );
    if (!row || row.status !== "active") throw new UserError("That expense was not found.");
    const before = {};
    const after = {};
    for (const k of Object.keys(e)) {
      const was = k === "amount" ? n(row[k]) : k === "city_id" ? (row[k] ? Number(row[k]) : null) : row[k];
      if (String(was ?? "") !== String(e[k] ?? "")) {
        before[k] = was;
        after[k] = e[k];
      }
    }
    if (!Object.keys(after).length) return { ok: true, unchanged: true };
    await conn.execute(
      `UPDATE expenses SET category = ?, amount = ?, spent_on = ?, mode = ?, paid_to = ?, city_id = ?, reference = ?, notes = ?
       WHERE id = ?`,
      [e.category, e.amount, e.spent_on, e.mode, e.paid_to, e.city_id, e.reference, e.notes, row.id]
    );
    await logActivity({
      conn,
      user,
      action: "update",
      entity: "expenses",
      entityId: row.id,
      summary: `Edited expense #${row.id} (${EXPENSE_CATEGORY[e.category].label}): ${Object.keys(after).join(", ").replace(/_/g, " ")}${
        after.amount !== undefined ? ` · ${inr(before.amount)} → ${inr(after.amount)}` : ""
      }`,
      before,
      after,
    });
    return { ok: true };
  });
}

/** Soft delete — the row stays, marked deleted, and drops out of every total. */
export async function deleteExpense(id, { user }) {
  return transaction(async (conn) => {
    const [[row]] = await conn.execute("SELECT id, category, amount, paid_to, status FROM expenses WHERE id = ? FOR UPDATE", [Number(id) || 0]);
    if (!row || row.status !== "active") throw new UserError("That expense was not found.");
    await conn.execute("UPDATE expenses SET status = 'deleted', deleted_at = UTC_TIMESTAMP() WHERE id = ?", [row.id]);
    await logActivity({
      conn,
      user,
      action: "delete",
      entity: "expenses",
      entityId: row.id,
      summary: `Deleted expense #${row.id} · ${inr(row.amount)} ${EXPENSE_CATEGORY[row.category]?.label ?? row.category}${row.paid_to ? ` · ${row.paid_to}` : ""}`,
      before: { status: "active", amount: n(row.amount), category: row.category },
      after: { status: "deleted" },
    });
    return { ok: true };
  });
}

/* ═══ REVENUE / P&L ══════════════════════════════════════════════════════ */

/** A booking is "earned" when its report is ready; older rows may lack the stamp. */
const EARNED_AT = "COALESCE(b.report_ready_at, b.delivered_at, b.completed_at, b.created_at)";
const EARNED = `b.deleted_at IS NULL AND b.status IN ('report_ready','report_delivered','completed')
  AND ${EARNED_AT} >= ? AND ${EARNED_AT} < ?`;

/** Headline totals for one window: cash, accrual, costs. */
export async function plTotals(r) {
  const [[[cash]], [[acc]], [[exp]], [[st]]] = await Promise.all([
    query(
      `SELECT
         (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'paid' AND received_at >= ? AND received_at < ?) AS collected,
         (SELECT COALESCE(SUM(amount), 0) FROM refunds WHERE status = 'processed' AND processed_at >= ? AND processed_at < ?) AS refunds`,
      [r.from, r.to, r.from, r.to]
    ),
    query(
      `SELECT COUNT(*) AS n, COALESCE(SUM(b.final_amount), 0) AS revenue, COALESCE(SUM(b.partner_cost), 0) AS cost
       FROM bookings b WHERE ${EARNED}`,
      [r.from, r.to]
    ),
    query("SELECT COALESCE(SUM(amount), 0) AS amount FROM expenses WHERE status = 'active' AND spent_on BETWEEN ? AND ?", [
      r.fromDay,
      r.toDay,
    ]),
    query(
      "SELECT COALESCE(SUM(paid_amount), 0) AS amount, COUNT(*) AS n FROM settlements WHERE status = 'paid' AND paid_on BETWEEN ? AND ?",
      [r.fromDay, r.toDay]
    ),
  ]);
  const collected = n(cash.collected);
  const refunds = n(cash.refunds);
  const revenue = n(acc.revenue);
  const cost = n(acc.cost);
  const margin = revenue - cost;
  const expenses = n(exp.amount);
  return {
    collected,
    refunds,
    netCash: collected - refunds,
    earnedBookings: n(acc.n),
    bookedRevenue: revenue,
    partnerCost: cost,
    grossMargin: margin,
    marginPct: revenue > 0 ? (margin / revenue) * 100 : null,
    expenses,
    netProfit: margin - expenses,
    settlementsPaid: n(st.amount),
    settlementsCount: n(st.n),
  };
}

/** One row per IST day in the range, zero-filled — the trend chart and the export. */
export async function revenueDaily(r) {
  const [[pay], [ref], [earned], [exp], [created]] = await Promise.all([
    query(
      `SELECT ${DAY("received_at")} AS d, SUM(amount) AS amount FROM payments
       WHERE status = 'paid' AND received_at >= ? AND received_at < ? GROUP BY d`,
      [r.from, r.to]
    ),
    query(
      `SELECT ${DAY("processed_at")} AS d, SUM(amount) AS amount FROM refunds
       WHERE status = 'processed' AND processed_at >= ? AND processed_at < ? GROUP BY d`,
      [r.from, r.to]
    ),
    query(
      `SELECT ${DAY(EARNED_AT)} AS d, COUNT(*) AS n, SUM(b.final_amount) AS revenue, SUM(b.partner_cost) AS cost
       FROM bookings b WHERE ${EARNED} GROUP BY d`,
      [r.from, r.to]
    ),
    query(
      `SELECT DATE_FORMAT(spent_on, '%Y-%m-%d') AS d, SUM(amount) AS amount FROM expenses
       WHERE status = 'active' AND spent_on BETWEEN ? AND ? GROUP BY d`,
      [r.fromDay, r.toDay]
    ),
    query(
      `SELECT ${DAY("b.created_at")} AS d, COUNT(*) AS n FROM bookings b
       WHERE b.deleted_at IS NULL AND b.status <> 'cancelled' AND b.created_at >= ? AND b.created_at < ? GROUP BY d`,
      [r.from, r.to]
    ),
  ]);
  const map = (rows, pick) => Object.fromEntries(rows.map((row) => [row.d, pick(row)]));
  const P = map(pay, (x) => n(x.amount));
  const R = map(ref, (x) => n(x.amount));
  const E = map(earned, (x) => x);
  const X = map(exp, (x) => n(x.amount));
  const C = map(created, (x) => n(x.n));
  return daysIn(r).map((d) => {
    const collected = P[d] ?? 0;
    const refunds = R[d] ?? 0;
    const revenue = n(E[d]?.revenue);
    const cost = n(E[d]?.cost);
    return {
      day: d,
      collected,
      refunds,
      net: collected - refunds,
      newBookings: C[d] ?? 0,
      earnedBookings: n(E[d]?.n),
      bookedRevenue: revenue,
      partnerCost: cost,
      margin: revenue - cost,
      expenses: X[d] ?? 0,
    };
  });
}

/** Breakdowns for the revenue page. City / partner / channel are accrual; mode is cash. */
export async function revenueBreakdowns(r) {
  const [[city], [partner], [mode], [channel]] = await Promise.all([
    query(
      `SELECT COALESCE(NULLIF(b.city, ''), 'No city') AS label, COUNT(*) AS n,
              SUM(b.final_amount) AS revenue, SUM(b.partner_cost) AS cost
       FROM bookings b WHERE ${EARNED} GROUP BY label ORDER BY revenue DESC LIMIT 12`,
      [r.from, r.to]
    ),
    query(
      `SELECT b.partner_id AS id, COALESCE(p.name, 'No lab assigned') AS label, COUNT(*) AS n,
              SUM(b.final_amount) AS revenue, SUM(b.partner_cost) AS cost
       FROM bookings b LEFT JOIN partners p ON p.id = b.partner_id
       WHERE ${EARNED} GROUP BY b.partner_id, label ORDER BY revenue DESC LIMIT 12`,
      [r.from, r.to]
    ),
    query(
      `SELECT mode, COUNT(*) AS n, SUM(amount) AS amount FROM payments
       WHERE status = 'paid' AND received_at >= ? AND received_at < ? GROUP BY mode`,
      [r.from, r.to]
    ),
    query(
      `SELECT IF(b.source = 'website', 'online', 'offline') AS channel, COUNT(*) AS n,
              SUM(b.final_amount) AS revenue, SUM(b.partner_cost) AS cost
       FROM bookings b WHERE ${EARNED} GROUP BY channel`,
      [r.from, r.to]
    ),
  ]);
  const shape = (x) => {
    const revenue = n(x.revenue);
    const cost = n(x.cost);
    return { id: x.id ?? null, label: x.label ?? x.channel, count: n(x.n), revenue, cost, margin: revenue - cost, marginPct: revenue > 0 ? ((revenue - cost) / revenue) * 100 : null };
  };
  return {
    city: city.map(shape),
    partner: partner.map(shape),
    mode: mode.map((x) => ({ mode: x.mode, amount: n(x.amount), count: n(x.n) })),
    channel: ["online", "offline"].map((k) => shape(channel.find((c) => c.channel === k) ?? { channel: k })),
  };
}

/** Everything the revenue page shows for a range, plus the previous equal-length period. */
export async function revenueReport(r) {
  const prev = previous(r);
  const [totals, before, daily, breakdowns, [[pending]]] = await Promise.all([
    plTotals(r),
    prev ? plTotals(prev) : null,
    revenueDaily(r),
    revenueBreakdowns(r),
    query(
      `SELECT COALESCE(SUM(GREATEST(0, final_amount - paid_amount + refunded_amount)), 0) AS amount
       FROM bookings WHERE deleted_at IS NULL AND status <> 'cancelled'`
    ),
  ]);
  return { range: r, previous: prev, totals, before, daily, ...breakdowns, pendingAmount: n(pending.amount) };
}
