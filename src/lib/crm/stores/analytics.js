/**
 * Analytics: every chart is ONE grouped SQL query over an indexed date
 * column, zero-filled here into the x axis the chart draws. Pages run them in
 * parallel. Nothing pulls raw booking rows into JS except the report
 * turnaround percentiles, which read at most 2,000 recent durations.
 *
 * ── TWO WAYS TO COUNT MONEY (never mixed in one figure) ─────────────────
 *   Cash     what actually moved: payments.amount with status 'paid', by
 *            received_at, minus refunds.amount with status 'processed', by
 *            processed_at.
 *   Accrual  what was earned: bookings not cancelled, not deleted, whose
 *            report is in (report_ready or later) — final_amount is booked
 *            revenue, partner_cost the lab's share, the difference margin.
 *            Bucketed by the booking's created_at (indexed; a booking's
 *            report_ready_at is not).
 *   Expenses expenses.amount, status 'active', by spent_on (a DATE, so it is
 *            compared with the IST calendar days, not the UTC bounds).
 *
 * ── TIME ─────────────────────────────────────────────────────────────────
 * Ranges come from src/lib/crm/dates.js (IST days → UTC bounds, `to`
 * exclusive). Up to 92 days the x axis is IST days; beyond, IST months.
 *
 * Partners never reach these pages (analytics.view is partner-forbidden), so
 * nothing here takes a scope.
 */
import { query } from "@/lib/db";
import { daysIn, istDay, istDaySql, previous, range } from "@/lib/crm/dates";

const ACCRUED = "b.status IN ('report_ready','report_delivered','completed')";
const LIVE = "b.deleted_at IS NULL";
const IN_RANGE = (col) => `${col} >= ? AND ${col} < ?`;
const num = (v) => Number(v ?? 0) || 0;
const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";

/* ── Range & buckets ────────────────────────────────────────────────────── */

export const RANGE_PRESETS = [
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
  { key: "6m", label: "6 Months" },
  { key: "1y", label: "1 Year" },
];

/** URL → { key, r, prev }. Unknown or incomplete custom ranges fall back to 30 days. */
export function analyticsRange(sp) {
  const want = one(sp.range) || "30d";
  const known = want === "custom" || RANGE_PRESETS.some((p) => p.key === want);
  let key = known ? want : "30d";
  let r = range(key, { from: one(sp.from), to: one(sp.to) });
  if (!r) {
    key = "30d";
    r = range("30d");
  }
  return { key, r, prev: previous(r) };
}

const monthKeys = (fromDay, toDay) => {
  const keys = [];
  let [y, m] = fromDay.split("-").map(Number);
  const [ty, tm] = toDay.split("-").map(Number);
  while (y < ty || (y === ty && m <= tm)) {
    keys.push(`${y}-${String(m).padStart(2, "0")}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return keys;
};

/** Day buckets up to 92 days, month buckets beyond. */
export function bucketsOf(r) {
  return r.days <= 92 ? { unit: "day", keys: daysIn(r) } : { unit: "month", keys: monthKeys(r.fromDay, r.toDay) };
}

/** UTC DATETIME column → its IST day or month, as a string key. */
const bucketSql = (unit, col) =>
  unit === "day"
    ? `DATE_FORMAT(${istDaySql(col)}, '%Y-%m-%d')`
    : `DATE_FORMAT(DATE_ADD(${col}, INTERVAL 330 MINUTE), '%Y-%m')`;

/** A DATE column is already a calendar day: no zone shift. */
const dateBucketSql = (unit, col) => (unit === "day" ? `DATE_FORMAT(${col}, '%Y-%m-%d')` : `DATE_FORMAT(${col}, '%Y-%m')`);

/** Rows [{ k, …fields }] → one zero-filled array per field, aligned to keys. */
function fill(keys, rows, fields) {
  const byKey = new Map(rows.map((row) => [String(row.k), row]));
  return Object.fromEntries(fields.map((f) => [f, keys.map((k) => num(byKey.get(k)?.[f]))]));
}

/** The last 12 IST months, this one included. */
export function last12Months() {
  const today = istDay();
  const [y, m] = today.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1 - 11, 1)).toISOString().slice(0, 10);
  return range("custom", { from: start, to: today });
}

const pctOf = (part, whole) => (whole ? (num(part) / num(whole)) * 100 : null);

/* ── Shared building blocks ─────────────────────────────────────────────── */

async function bookingTotals(r) {
  const [[row]] = await query(
    `SELECT COUNT(*) AS n, COALESCE(SUM(b.status = 'cancelled'), 0) AS cancelled
     FROM bookings b WHERE ${LIVE} AND ${IN_RANGE("b.created_at")}`,
    [r.from, r.to]
  );
  return { bookings: num(row.n), cancelled: num(row.cancelled), cancelRate: pctOf(row.cancelled, row.n) };
}

async function bookingTrend(r, { unit, keys }) {
  const [rows] = await query(
    `SELECT ${bucketSql(unit, "b.created_at")} AS k, COUNT(*) AS n, SUM(b.status = 'cancelled') AS cancelled
     FROM bookings b WHERE ${LIVE} AND ${IN_RANGE("b.created_at")} GROUP BY k`,
    [r.from, r.to]
  );
  return fill(keys, rows, ["n", "cancelled"]);
}

/** Cash in the range: paid payments, processed refunds, net. One round trip. */
async function cashTotals(r) {
  const [[row]] = await query(
    `SELECT
       (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'paid' AND ${IN_RANGE("received_at")}) AS paid,
       (SELECT COUNT(*) FROM payments WHERE status = 'paid' AND ${IN_RANGE("received_at")}) AS payments,
       (SELECT COALESCE(SUM(amount), 0) FROM refunds WHERE status = 'processed' AND ${IN_RANGE("processed_at")}) AS refunded,
       (SELECT COUNT(*) FROM refunds WHERE status = 'processed' AND ${IN_RANGE("processed_at")}) AS refunds`,
    [r.from, r.to, r.from, r.to, r.from, r.to, r.from, r.to]
  );
  const paid = num(row.paid);
  const refunded = num(row.refunded);
  return { paid, refunded, net: paid - refunded, payments: num(row.payments), refunds: num(row.refunds) };
}

/** Net cash per bucket = paid by received_at − processed refunds by processed_at. */
async function cashTrend(r, { unit, keys }) {
  const [[paid], [refunded]] = await Promise.all([
    query(
      `SELECT ${bucketSql(unit, "received_at")} AS k, SUM(amount) AS amt
       FROM payments WHERE status = 'paid' AND ${IN_RANGE("received_at")} GROUP BY k`,
      [r.from, r.to]
    ),
    // refunds has no index on processed_at; it is a small table (one row per refund).
    query(
      `SELECT ${bucketSql(unit, "processed_at")} AS k, SUM(amount) AS amt
       FROM refunds WHERE status = 'processed' AND ${IN_RANGE("processed_at")} GROUP BY k`,
      [r.from, r.to]
    ),
  ]);
  const p = fill(keys, paid, ["amt"]).amt;
  const f = fill(keys, refunded, ["amt"]).amt;
  return { paid: p, refunded: f, net: p.map((v, i) => v - f[i]) };
}

/** Accrual: booked revenue and partner cost of bookings whose report is in. */
async function accrualTotals(r) {
  const [[row]] = await query(
    `SELECT COUNT(*) AS n, COALESCE(SUM(b.final_amount), 0) AS revenue, COALESCE(SUM(b.partner_cost), 0) AS cost
     FROM bookings b WHERE ${LIVE} AND ${ACCRUED} AND ${IN_RANGE("b.created_at")}`,
    [r.from, r.to]
  );
  const revenue = num(row.revenue);
  const cost = num(row.cost);
  return { bookings: num(row.n), revenue, cost, margin: revenue - cost, marginPct: pctOf(revenue - cost, revenue) };
}

async function expenseTotal(r) {
  const [[row]] = await query(
    "SELECT COALESCE(SUM(amount), 0) AS amt, COUNT(*) AS n FROM expenses WHERE status = 'active' AND spent_on >= ? AND spent_on <= ?",
    [r.fromDay, r.toDay]
  );
  return { amount: num(row.amt), count: num(row.n) };
}

/** Leads created in the range, and how far each got. Monotone: contacted ⊇ booked ⊇ completed. */
async function leadFunnel(r) {
  const [[row]] = await query(
    `SELECT COUNT(*) AS total,
       COALESCE(SUM(l.status <> 'new' OR l.booking_id IS NOT NULL), 0) AS contacted,
       COALESCE(SUM(l.booking_id IS NOT NULL OR l.status IN ('booked','completed','collected','done')), 0) AS booked,
       COALESCE(SUM(l.status IN ('completed','done') OR b.status IN ('report_delivered','completed')), 0) AS completed
     FROM leads l
     LEFT JOIN bookings b ON b.id = l.booking_id AND b.deleted_at IS NULL
     WHERE ${IN_RANGE("l.created_at")} AND l.status <> 'deleted'`,
    [r.from, r.to]
  );
  const total = num(row.total);
  return {
    total,
    contacted: num(row.contacted),
    booked: num(row.booked),
    completed: num(row.completed),
    conversion: pctOf(row.booked, total),
  };
}

/**
 * Customers who booked (not cancelled) in the range; "repeat" = at least two
 * non-cancelled bookings up to the end of the range, so a previous period is
 * judged by what was known then.
 */
async function repeatCustomers(r) {
  const [[row]] = await query(
    `SELECT COUNT(*) AS customers,
       COALESCE(SUM(t.n >= 2), 0) AS repeat_in_range,
       COALESCE(SUM(t.ever >= 2), 0) AS repeat_ever
     FROM (
       SELECT b.customer_id, COUNT(*) AS n,
         (SELECT COUNT(*) FROM bookings b2
          WHERE b2.customer_id = b.customer_id AND b2.deleted_at IS NULL AND b2.status <> 'cancelled' AND b2.created_at < ?) AS ever
       FROM bookings b
       WHERE ${LIVE} AND b.status <> 'cancelled' AND ${IN_RANGE("b.created_at")}
       GROUP BY b.customer_id
     ) t`,
    [r.to, r.from, r.to]
  );
  return {
    customers: num(row.customers),
    repeatInRange: num(row.repeat_in_range),
    repeat: num(row.repeat_ever),
    repeatPct: pctOf(row.repeat_ever, row.customers),
  };
}

/** Sample received → report ready, in minutes, for bookings created in the range. */
const TAT_MIN = "TIMESTAMPDIFF(MINUTE, b.sample_received_at, b.report_ready_at)";
const TAT_WHERE = `${LIVE} AND b.sample_received_at IS NOT NULL AND b.report_ready_at IS NOT NULL
  AND b.report_ready_at >= b.sample_received_at AND ${IN_RANGE("b.created_at")}`;

async function tatSummary(r) {
  const [[row]] = await query(
    `SELECT COUNT(*) AS n, AVG(t.m) / 60 AS avg_h,
       COALESCE(SUM(t.m < 720), 0) AS b1,
       COALESCE(SUM(t.m >= 720 AND t.m < 1440), 0) AS b2,
       COALESCE(SUM(t.m >= 1440 AND t.m < 2880), 0) AS b3,
       COALESCE(SUM(t.m >= 2880), 0) AS b4
     FROM (SELECT ${TAT_MIN} AS m FROM bookings b WHERE ${TAT_WHERE}) t`,
    [r.from, r.to]
  );
  return {
    count: num(row.n),
    avgHours: row.avg_h === null ? null : num(row.avg_h),
    buckets: [
      { label: "Under 12 h", value: num(row.b1) },
      { label: "12–24 h", value: num(row.b2) },
      { label: "24–48 h", value: num(row.b3) },
      { label: "Over 48 h", value: num(row.b4) },
    ],
  };
}

/** Median and 90th percentile from the latest ≤2,000 turnarounds in the range. */
async function tatPercentiles(r) {
  const [rows] = await query(
    `SELECT ${TAT_MIN} AS m FROM bookings b WHERE ${TAT_WHERE} ORDER BY b.created_at DESC LIMIT 2000`,
    [r.from, r.to]
  );
  const mins = rows.map((x) => num(x.m)).sort((a, b) => a - b);
  const at = (p) => (mins.length ? mins[Math.min(mins.length - 1, Math.floor(p * (mins.length - 1) + 0.5))] / 60 : null);
  return { sample: mins.length, p50: at(0.5), p90: at(0.9) };
}

/* ── Business analytics ─────────────────────────────────────────────────── */

export async function getBusinessAnalytics(r, prev, { withRevenue = false } = {}) {
  const b = bucketsOf(r);
  const [
    totals,
    prevTotals,
    trend,
    cash,
    prevCash,
    cashLine,
    funnel,
    prevFunnel,
    [cityRows],
    [testRows],
    [sourceRows],
    repeat,
    prevRepeat,
    tat,
    prevTat,
    pct,
  ] = await Promise.all([
    bookingTotals(r),
    bookingTotals(prev),
    bookingTrend(r, b),
    withRevenue ? cashTotals(r) : null,
    withRevenue ? cashTotals(prev) : null,
    withRevenue ? cashTrend(r, b) : null,
    leadFunnel(r),
    leadFunnel(prev),
    query(
      `SELECT COALESCE(sc.name, NULLIF(TRIM(b.city), ''), 'City not set') AS label, COUNT(*) AS n
       FROM bookings b LEFT JOIN service_cities sc ON sc.id = b.city_id
       WHERE ${LIVE} AND b.status <> 'cancelled' AND ${IN_RANGE("b.created_at")}
       GROUP BY label ORDER BY n DESC, label LIMIT 10`,
      [r.from, r.to]
    ),
    query(
      `SELECT MAX(bi.name) AS label, MAX(bi.is_package) AS pkg, COUNT(*) AS n
       FROM bookings b JOIN booking_items bi ON bi.booking_id = b.id AND bi.status = 'active'
       WHERE ${LIVE} AND b.status <> 'cancelled' AND ${IN_RANGE("b.created_at")}
       GROUP BY COALESCE(bi.test_id, bi.name) ORDER BY n DESC, label LIMIT 10`,
      [r.from, r.to]
    ),
    query(
      `SELECT b.source, COUNT(*) AS n FROM bookings b
       WHERE ${LIVE} AND b.status <> 'cancelled' AND ${IN_RANGE("b.created_at")} GROUP BY b.source`,
      [r.from, r.to]
    ),
    repeatCustomers(r),
    repeatCustomers(prev),
    tatSummary(r),
    tatSummary(prev),
    tatPercentiles(r),
  ]);

  const bySource = Object.fromEntries(sourceRows.map((x) => [x.source, num(x.n)]));
  const active = sourceRows.reduce((a, x) => a + num(x.n), 0);
  const topCities = cityRows.map((x) => ({ label: x.label, value: num(x.n) }));
  const otherCities = active - topCities.reduce((a, x) => a + x.value, 0);

  return {
    unit: b.unit,
    keys: b.keys,
    totals,
    prevTotals,
    trend: {
      bookings: trend.n,
      cancelled: trend.cancelled,
      cancelRate: trend.n.map((n, i) => (n ? (trend.cancelled[i] / n) * 100 : 0)),
    },
    cash,
    prevCash,
    cashLine,
    funnel,
    prevFunnel,
    cities: otherCities > 0 ? [...topCities, { label: "All other cities", value: otherCities }] : topCities,
    tests: testRows.map((x) => ({ label: x.label, value: num(x.n), pkg: Boolean(num(x.pkg)) })),
    active,
    sources: bySource,
    repeat,
    prevRepeat,
    tat: { ...tat, ...pct },
    prevTat,
  };
}

/* ── Partner analytics ──────────────────────────────────────────────────── */

export const PARTNER_SORTS = {
  orders: { label: "Orders", key: (p) => p.assigned, dir: -1 },
  accept: { label: "Acceptance", key: (p) => p.acceptRate ?? -1, dir: -1 },
  response: { label: "Response time", key: (p) => p.acceptHours ?? Infinity, dir: 1 },
  tat: { label: "Turnaround", key: (p) => p.tatHours ?? Infinity, dir: 1 },
  overdue: { label: "Late reports", key: (p) => p.overdue, dir: -1 },
  revenue: { label: "Revenue", key: (p) => p.revenue, dir: -1, money: true },
  margin: { label: "Margin", key: (p) => p.margin, dir: -1, money: true },
};

/**
 * One row per lab partner with activity in the range.
 *
 * Assignments and rejections come from the activity log, because assigning
 * the order to another lab overwrites partner_status on the booking — the
 * log is the only place a rejection survives. Everything else is read from
 * the bookings created in the range that are with the lab now.
 */
export async function getPartnerAnalytics(r, { partnerId = null, sort = "orders" } = {}) {
  const pid = Number(partnerId) || null;
  const [[bookingRows], [auditRows]] = await Promise.all([
    query(
      `SELECT b.partner_id,
         COUNT(*) AS n,
         COALESCE(SUM(b.partner_status = 'accepted'), 0) AS accepted,
         COALESCE(SUM(b.partner_status = 'pending'), 0) AS pending,
         COALESCE(SUM(${ACCRUED}), 0) AS completed,
         COALESCE(SUM(b.status = 'cancelled'), 0) AS cancelled,
         AVG(CASE WHEN b.partner_responded_at >= b.partner_assigned_at
             THEN TIMESTAMPDIFF(MINUTE, b.partner_assigned_at, b.partner_responded_at) END) / 60 AS accept_h,
         AVG(CASE WHEN b.report_ready_at >= b.sample_received_at
             THEN ${TAT_MIN} END) / 60 AS tat_h,
         COALESCE(SUM(b.status <> 'cancelled' AND b.report_due_at IS NOT NULL AND (
             (b.report_ready_at IS NULL AND b.report_due_at < UTC_TIMESTAMP()) OR b.report_ready_at > b.report_due_at)), 0) AS overdue,
         COALESCE(SUM(CASE WHEN ${ACCRUED} THEN b.final_amount END), 0) AS revenue,
         COALESCE(SUM(CASE WHEN ${ACCRUED} THEN b.partner_cost END), 0) AS cost
       FROM bookings b
       WHERE ${LIVE} AND b.partner_id IS NOT NULL AND ${IN_RANGE("b.created_at")} ${pid ? "AND b.partner_id = ?" : ""}
       GROUP BY b.partner_id`,
      pid ? [r.from, r.to, pid] : [r.from, r.to]
    ),
    // A partner assignment logs after.partner_id = the lab; a collector
    // assignment (same action) logs collector_id instead, so it drops out.
    query(
      `SELECT a.partner_id,
         COUNT(DISTINCT CASE WHEN a.action = 'assign' THEN a.entity_id END) AS assigned,
         COUNT(DISTINCT CASE WHEN a.action = 'reject' THEN a.entity_id END) AS rejected
       FROM admin_audit a
       WHERE ${IN_RANGE("a.created_at")} AND a.entity = 'bookings' AND a.partner_id IS NOT NULL
         AND (a.action = 'reject'
              OR (a.action = 'assign' AND JSON_UNQUOTE(JSON_EXTRACT(a.after_json, '$.partner_id')) = CAST(a.partner_id AS CHAR)))
         ${pid ? "AND a.partner_id = ?" : ""}
       GROUP BY a.partner_id`,
      pid ? [r.from, r.to, pid] : [r.from, r.to]
    ),
  ]);

  const ids = [...new Set([...bookingRows, ...auditRows].map((x) => Number(x.partner_id)))];
  const [names] = ids.length
    ? await query(`SELECT id, name, city, status FROM partners WHERE id IN (${ids.map(() => "?").join(",")})`, ids)
    : [[]];
  const nameOf = new Map(names.map((p) => [Number(p.id), p]));
  const bk = new Map(bookingRows.map((x) => [Number(x.partner_id), x]));
  const au = new Map(auditRows.map((x) => [Number(x.partner_id), x]));

  const rows = ids.map((id) => {
    const b = bk.get(id) ?? {};
    const a = au.get(id) ?? {};
    const accepted = num(b.accepted);
    const rejected = num(a.rejected);
    const revenue = num(b.revenue);
    const cost = num(b.cost);
    return {
      id,
      name: nameOf.get(id)?.name ?? `Partner #${id}`,
      city: nameOf.get(id)?.city ?? "",
      partnerStatus: nameOf.get(id)?.status ?? "",
      // At least the orders with the lab now, even if an old assignment predates the log.
      assigned: Math.max(num(a.assigned), num(b.n)),
      current: num(b.n),
      accepted,
      rejected,
      pending: num(b.pending),
      completed: num(b.completed),
      acceptRate: pctOf(accepted, accepted + rejected),
      acceptHours: b.accept_h === null || b.accept_h === undefined ? null : num(b.accept_h),
      tatHours: b.tat_h === null || b.tat_h === undefined ? null : num(b.tat_h),
      overdue: num(b.overdue),
      revenue,
      cost,
      margin: revenue - cost,
      marginPct: pctOf(revenue - cost, revenue),
    };
  });

  const s = PARTNER_SORTS[sort] ?? PARTNER_SORTS.orders;
  rows.sort((x, y) => (s.key(x) - s.key(y)) * s.dir || x.name.localeCompare(y.name));
  return rows;
}

/* ── Financial analytics ────────────────────────────────────────────────── */

export const AGE_BUCKETS = [
  { key: "a", label: "0–2 days" },
  { key: "b", label: "3–7 days" },
  { key: "c", label: "8–30 days" },
  { key: "d", label: "Over 30 days" },
];

export async function getFinanceAnalytics(r, prev) {
  const b = bucketsOf(r);
  const m12 = last12Months();
  const months = { unit: "month", keys: monthKeys(m12.fromDay, m12.toDay) };

  const [
    cash,
    prevCash,
    cashLine,
    accrual,
    prevAccrual,
    expenses,
    prevExpenses,
    [modeRows],
    [expenseRows],
    [pendingRows],
    monthlyCash,
    [monthlyAccrual],
    [monthlyExpenses],
  ] = await Promise.all([
    cashTotals(r),
    cashTotals(prev),
    cashTrend(r, b),
    accrualTotals(r),
    accrualTotals(prev),
    expenseTotal(r),
    expenseTotal(prev),
    query(
      `SELECT mode, COALESCE(SUM(amount), 0) AS amt, COUNT(*) AS n
       FROM payments WHERE status = 'paid' AND ${IN_RANGE("received_at")} GROUP BY mode`,
      [r.from, r.to]
    ),
    query(
      `SELECT category, COALESCE(SUM(amount), 0) AS amt, COUNT(*) AS n
       FROM expenses WHERE status = 'active' AND spent_on >= ? AND spent_on <= ?
       GROUP BY category ORDER BY amt DESC`,
      [r.fromDay, r.toDay]
    ),
    // A snapshot, not a range: what is owed right now, by how old the booking is.
    query(
      `SELECT CASE
           WHEN TIMESTAMPDIFF(DAY, b.created_at, UTC_TIMESTAMP()) <= 2 THEN 'a'
           WHEN TIMESTAMPDIFF(DAY, b.created_at, UTC_TIMESTAMP()) <= 7 THEN 'b'
           WHEN TIMESTAMPDIFF(DAY, b.created_at, UTC_TIMESTAMP()) <= 30 THEN 'c'
           ELSE 'd' END AS k,
         COUNT(*) AS n,
         COALESCE(SUM(GREATEST(b.final_amount - (b.paid_amount - b.refunded_amount), 0)), 0) AS due
       FROM bookings b
       WHERE ${LIVE} AND b.status <> 'cancelled' AND b.payment_status IN ('pending','partial') AND b.final_amount > 0
       GROUP BY k`
    ),
    cashTrend(m12, months),
    query(
      `SELECT ${bucketSql("month", "b.created_at")} AS k,
         COALESCE(SUM(b.final_amount), 0) AS revenue, COALESCE(SUM(b.partner_cost), 0) AS cost
       FROM bookings b WHERE ${LIVE} AND ${ACCRUED} AND ${IN_RANGE("b.created_at")} GROUP BY k`,
      [m12.from, m12.to]
    ),
    query(
      `SELECT ${dateBucketSql("month", "spent_on")} AS k, COALESCE(SUM(amount), 0) AS amt
       FROM expenses WHERE status = 'active' AND spent_on >= ? AND spent_on <= ? GROUP BY k`,
      [m12.fromDay, m12.toDay]
    ),
  ]);

  const acc = fill(months.keys, monthlyAccrual, ["revenue", "cost"]);
  const exp = fill(months.keys, monthlyExpenses, ["amt"]).amt;
  const margin = acc.revenue.map((v, i) => v - acc.cost[i]);
  const pending = fill(
    AGE_BUCKETS.map((a) => a.key),
    pendingRows,
    ["n", "due"]
  );

  return {
    unit: b.unit,
    keys: b.keys,
    cash,
    prevCash,
    cashLine,
    accrual,
    prevAccrual,
    expenses,
    prevExpenses,
    profit: accrual.margin - expenses.amount,
    prevProfit: prevAccrual.margin - prevExpenses.amount,
    modes: Object.fromEntries(modeRows.map((x) => [x.mode, { amount: num(x.amt), count: num(x.n) }])),
    expenseCategories: expenseRows.map((x) => ({ key: x.category, amount: num(x.amt), count: num(x.n) })),
    pending: AGE_BUCKETS.map((a, i) => ({ ...a, count: pending.n[i], due: pending.due[i] })),
    months: {
      keys: months.keys,
      cash: monthlyCash.net,
      revenue: acc.revenue,
      cost: acc.cost,
      margin,
      expenses: exp,
      profit: margin.map((v, i) => v - exp[i]),
      from: m12.fromDay,
      to: m12.toDay,
    },
  };
}

