/**
 * The figures behind the command center: /crm (dashboard), /crm/executive,
 * and the three operations queues (collections, samples, reports). Server
 * only.
 *
 * ── EVERY FIGURE IS ONE AGGREGATE QUERY ──────────────────────────────────
 * Nothing here loads a table into JavaScript to count it. Each number is a
 * COUNT/SUM in MySQL, bounded by an indexed column (status, created_at,
 * collection_date, partner_id, received_at), and the page runs them together
 * with Promise.all. With tens of thousands of bookings the dashboard still
 * reads a few hundred index entries, not the table.
 *
 * ── DAYS ARE IST DAYS ────────────────────────────────────────────────────
 * "Today" is the Indian calendar day (src/lib/crm/dates.js), and a DATETIME
 * is bucketed by its IST day with istDaySql() — never CURDATE(), which is the
 * UTC day and would put a 02:00 IST booking on yesterday's bar.
 */
import { query } from "@/lib/db";

import { CONVERTED_LEAD, OPEN_STATUSES, PIPELINE } from "../constants";
import { addDays, daysIn, istDay, istDaySql, range } from "../dates";
import { scopeWhere } from "./bookings";

const TZ = "Asia/Kolkata";
const list = (arr) => arr.map(() => "?").join(",");
const num = (v) => Number(v ?? 0) || 0;
const like = (value) => `%${String(value).replace(/[%_]/g, "\\$&")}%`;

/** A DATE / DATETIME value from mysql2 → its YYYY-MM-DD key. */
const dkey = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d ?? "").slice(0, 10));

/** A query that must not take the page down with it (a table from a later migration). */
const safe = (promise, fallback, label) =>
  promise.catch((err) => {
    console.error(`[crm/dashboard] ${label} failed`, err);
    return fallback;
  });

/** Zero-filled day series over `days`, from rows of { d, v }. */
function series(days, rows, field = "v") {
  const map = new Map(rows.map((r) => [dkey(r.d), num(r[field])]));
  return days.map((d) => map.get(d) ?? 0);
}

/** The last `n` IST days ending today, as a range and its day list. */
export function lastDays(n = 14) {
  const today = istDay();
  const r = range("custom", { from: addDays(today, -(n - 1)), to: today });
  return { range: r, days: daysIn(r), today, yesterday: addDays(today, -1) };
}

/* ── Header ───────────────────────────────────────────────────────────── */

/** Greeting and long date, in IST — computed here so render stays pure. */
export function todayHeader() {
  const now = new Date();
  const hour = Number(now.toLocaleString("en-US", { timeZone: TZ, hour: "numeric", hourCycle: "h23" }));
  return {
    greeting: hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening",
    dateLabel: now.toLocaleDateString("en-IN", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    today: istDay(now),
  };
}

/* ── Series ───────────────────────────────────────────────────────────── */

/** Bookings created per IST day. */
export async function bookingSeries(r) {
  const [rows] = await query(
    `SELECT ${istDaySql("created_at")} AS d, COUNT(*) AS v FROM bookings
     WHERE created_at >= ? AND created_at < ? AND deleted_at IS NULL GROUP BY d`,
    [r.from, r.to]
  );
  return rows;
}

/**
 * Money in, net of refunds, per IST day: paid payments by received_at, minus
 * processed refunds by processed_at. Returns [{ d, v }].
 */
export async function revenueSeries(r) {
  const [[paid], [refunded]] = await Promise.all([
    query(
      `SELECT ${istDaySql("received_at")} AS d, SUM(amount) AS v FROM payments
       WHERE received_at >= ? AND received_at < ? AND status = 'paid' GROUP BY d`,
      [r.from, r.to]
    ),
    query(
      `SELECT ${istDaySql("processed_at")} AS d, SUM(amount) AS v FROM refunds
       WHERE status = 'processed' AND processed_at >= ? AND processed_at < ? GROUP BY d`,
      [r.from, r.to]
    ),
  ]);
  const map = new Map();
  for (const p of paid) map.set(dkey(p.d), num(p.v));
  for (const x of refunded) map.set(dkey(x.d), (map.get(dkey(x.d)) ?? 0) - num(x.v));
  return [...map].map(([d, v]) => ({ d, v }));
}

/** Collections scheduled / collected per collection day. */
async function collectionSeries(fromDay, toDay) {
  const [rows] = await query(
    `SELECT collection_date AS d, COUNT(*) AS scheduled, SUM(collection_status = 'collected') AS collected
     FROM bookings
     WHERE collection_date >= ? AND collection_date <= ? AND deleted_at IS NULL AND status <> 'cancelled'
     GROUP BY collection_date`,
    [fromDay, toDay]
  );
  return rows;
}

async function leadSeries(r) {
  const [rows] = await query(
    `SELECT ${istDaySql("created_at")} AS d, COUNT(*) AS v FROM leads WHERE created_at >= ? AND created_at < ? GROUP BY d`,
    [r.from, r.to]
  );
  return rows;
}

/* ── Pipeline ─────────────────────────────────────────────────────────── */

/** When a booking entered the stage it is in — what "waiting" is measured from. */
const SINCE = `COALESCE(CASE b.status
  WHEN 'sample_collected' THEN b.collected_at
  WHEN 'sample_received' THEN b.sample_received_at
  WHEN 'processing' THEN b.processing_at
  WHEN 'report_ready' THEN b.report_ready_at
  WHEN 'report_delivered' THEN b.delivered_at
  WHEN 'completed' THEN b.completed_at
  ELSE b.created_at END, b.created_at)`;

const DUE = "(b.final_amount - b.paid_amount + b.refunded_amount)";

/**
 * Per stage: count, the oldest wait in minutes, the money still due, pending
 * lab acceptances — plus how many were completed today. One query on the
 * status index.
 */
export async function pipelineCounts() {
  const today = range("today");
  const [rows] = await query(
    `SELECT b.status, COUNT(*) AS n,
            MAX(TIMESTAMPDIFF(MINUTE, ${SINCE}, UTC_TIMESTAMP())) AS oldest_min,
            SUM(GREATEST(0, ${DUE})) AS due,
            SUM(${DUE} > 0) AS due_n,
            SUM(b.partner_status = 'pending') AS partner_pending
     FROM bookings b
     WHERE b.deleted_at IS NULL
       AND (b.status IN (${list(OPEN_STATUSES)}) OR (b.status = 'completed' AND b.completed_at >= ?))
     GROUP BY b.status`,
    [...OPEN_STATUSES, today.from]
  );
  const by = Object.fromEntries(rows.map((r) => [r.status, r]));
  const stage = (k) => ({
    n: num(by[k]?.n),
    oldestMin: by[k]?.oldest_min === null || by[k]?.oldest_min === undefined ? null : num(by[k].oldest_min),
  });
  const open = OPEN_STATUSES.map((k) => by[k]).filter(Boolean);
  return {
    stages: Object.fromEntries(PIPELINE.map((k) => [k, stage(k)])),
    completedToday: num(by.completed?.n),
    due: open.reduce((s, r) => s + num(r.due), 0),
    dueCount: open.reduce((s, r) => s + num(r.due_n), 0),
    partnerPending: open.reduce((s, r) => s + num(r.partner_pending), 0),
    samplesPending: num(by.sample_collected?.n),
    reportsPending: num(by.sample_received?.n) + num(by.processing?.n),
    inLab: num(by.sample_received?.n) + num(by.processing?.n),
    openTotal: open.reduce((s, r) => s + num(r.n), 0),
  };
}

/** The few longest-waiting bookings in every open stage — one UNION, each arm on the status index. */
export async function pipelineItems(perStage = 4) {
  const lim = Math.min(10, Math.max(1, Number(perStage) || 4));
  const arm = `(SELECT b.id, b.patient_name, b.status, b.source, b.payment_status, b.partner_status,
                       b.collection_date, b.collection_slot,
                       (b.report_due_at IS NOT NULL AND b.report_due_at < UTC_TIMESTAMP()
                        AND b.status IN ('sample_received','processing')) AS overdue,
                       (b.collection_date IS NOT NULL AND b.collection_date < ?) AS collection_late,
                       TIMESTAMPDIFF(MINUTE, ${SINCE}, UTC_TIMESTAMP()) AS wait_min
                FROM bookings b
                WHERE b.deleted_at IS NULL AND b.status = ?
                ORDER BY ${SINCE} ASC LIMIT ${lim})`;
  const stages = OPEN_STATUSES;
  const today = istDay();
  const [rows] = await query(
    stages.map(() => arm).join(" UNION ALL "),
    stages.flatMap((s) => [today, s])
  );
  const out = Object.fromEntries(stages.map((s) => [s, []]));
  for (const r of rows) {
    out[r.status]?.push({
      ...r,
      wait_min: num(r.wait_min),
      overdue: Boolean(num(r.overdue)),
      collection_late: Boolean(num(r.collection_late)) && ["booked", "confirmed", "collection_assigned"].includes(r.status),
    });
  }
  return out;
}

/* ── Snapshots ────────────────────────────────────────────────────────── */

/**
 * Pending samples and pending reports as they stood 24 hours ago, from the
 * stage timestamps — the comparison for two figures that are counts "right
 * now", not per-day totals. Bounded to bookings of the last 90 days.
 */
async function pendingYesterday() {
  const [[row]] = await query(
    `SELECT
       SUM(b.collected_at <= t.at AND (b.sample_received_at IS NULL OR b.sample_received_at > t.at)
           AND (b.cancelled_at IS NULL OR b.cancelled_at > t.at)) AS samples,
       SUM(b.sample_received_at <= t.at AND (b.report_ready_at IS NULL OR b.report_ready_at > t.at)
           AND (b.cancelled_at IS NULL OR b.cancelled_at > t.at)) AS reports
     FROM bookings b
     JOIN (SELECT DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 DAY) AS at) t
     WHERE b.created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 90 DAY) AND b.deleted_at IS NULL`
  );
  return { samples: num(row?.samples), reports: num(row?.reports) };
}

/** Active lab partners, and how many of them had an order in the last 30 days (and the 30 before). */
export async function partnerActivity() {
  const [[row]] = await query(
    `SELECT COUNT(*) AS total,
            SUM(EXISTS (SELECT 1 FROM bookings b WHERE b.partner_id = p.id AND b.deleted_at IS NULL
                        AND b.partner_assigned_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY))) AS active,
            SUM(EXISTS (SELECT 1 FROM bookings b WHERE b.partner_id = p.id AND b.deleted_at IS NULL
                        AND b.partner_assigned_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 60 DAY)
                        AND b.partner_assigned_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY))) AS previous
     FROM partners p WHERE p.status = 'active'`
  );
  return { total: num(row?.total), active: num(row?.active), previous: num(row?.previous) };
}

/** Leads today: new (created today), contacted and converted (moved today). */
export async function leadsToday() {
  const today = range("today");
  const [[row]] = await query(
    `SELECT SUM(created_at >= ?) AS created,
            SUM(status_changed_at >= ? AND status IN ('contacted','follow_up')) AS contacted,
            SUM(status_changed_at >= ? AND status IN (${list(CONVERTED_LEAD)})) AS converted
     FROM leads WHERE created_at >= ? OR status_changed_at >= ?`,
    [today.from, today.from, today.from, ...CONVERTED_LEAD, today.from, today.from]
  );
  return { created: num(row?.created), contacted: num(row?.contacted), converted: num(row?.converted) };
}

/** Today's collections, per collector (NULL = not assigned yet). */
export async function collectorsOn(dayYmd) {
  const [rows] = await query(
    `SELECT b.collector_id, u.name AS collector_name, COUNT(*) AS total,
            SUM(b.collection_status = 'collected') AS done,
            SUM(b.collection_status = 'failed') AS failed
     FROM bookings b LEFT JOIN admin_users u ON u.id = b.collector_id
     WHERE b.collection_date = ? AND b.deleted_at IS NULL AND b.status <> 'cancelled'
     GROUP BY b.collector_id, u.name
     ORDER BY b.collector_id IS NULL, total DESC`,
    [dayYmd]
  );
  return rows.map((r) => ({
    collectorId: r.collector_id,
    name: r.collector_name,
    total: num(r.total),
    done: num(r.done),
    failed: num(r.failed),
    pending: num(r.total) - num(r.done) - num(r.failed),
  }));
}

/** Partners by open orders, with what is waiting on them. */
export async function partnerSnapshot(limit = 5) {
  const [rows] = await query(
    `SELECT p.id, p.name, COUNT(*) AS open_n,
            SUM(b.partner_status = 'pending') AS pending_n,
            SUM(b.status IN ('sample_received','processing')) AS in_lab
     FROM bookings b JOIN partners p ON p.id = b.partner_id
     WHERE b.deleted_at IS NULL AND b.status IN (${list(OPEN_STATUSES)}) AND b.partner_status <> 'rejected'
     GROUP BY p.id, p.name
     ORDER BY open_n DESC
     LIMIT ${Math.min(20, Math.max(1, Number(limit) || 5))}`,
    OPEN_STATUSES
  );
  return rows.map((r) => ({ id: r.id, name: r.name, open: num(r.open_n), pending: num(r.pending_n), inLab: num(r.in_lab) }));
}

/** Cities by bookings in a range (non-cancelled). */
export async function topCities(r, limit = 5) {
  const [rows] = await query(
    `SELECT COALESCE(NULLIF(b.city, ''), 'City not set') AS city, MAX(b.city_id) AS city_id, COUNT(*) AS n
     FROM bookings b
     WHERE b.created_at >= ? AND b.created_at < ? AND b.deleted_at IS NULL AND b.status <> 'cancelled'
     GROUP BY COALESCE(NULLIF(b.city, ''), 'City not set')
     ORDER BY n DESC
     LIMIT ${Math.min(20, Math.max(1, Number(limit) || 5))}`,
    [r.from, r.to]
  );
  return rows.map((x) => ({ city: x.city, cityId: x.city_id, n: num(x.n) }));
}

/* ── The dashboard ────────────────────────────────────────────────────── */

/**
 * Everything the KPI row, the board and the side cards need, in parallel.
 * `money` switches on the revenue figures (revenue.view / payments.view).
 */
export async function dashboardData({ money = false } = {}) {
  const { range: r14, days, today, yesterday } = lastDays(14);
  const month = range("month");

  const [bookings, collections, pipeline, items, before, revenue, partners, leads, leadDays, collectors, partnerTop, cities] =
    await Promise.all([
      bookingSeries(r14),
      collectionSeries(r14.fromDay, r14.toDay),
      pipelineCounts(),
      pipelineItems(4),
      pendingYesterday(),
      money ? revenueSeries(r14) : Promise.resolve([]),
      partnerActivity(),
      safe(leadsToday(), { created: 0, contacted: 0, converted: 0 }, "leads today"),
      safe(leadSeries(r14), [], "lead series"),
      collectorsOn(today),
      partnerSnapshot(5),
      topCities(month, 1),
    ]);

  const bookingSpark = series(days, bookings);
  const collectedSpark = series(days, collections, "collected");
  const scheduledSpark = series(days, collections, "scheduled");
  const revenueSpark = series(days, revenue);
  const leadSpark = series(days, leadDays);
  const last = days.length - 1;

  return {
    today,
    yesterday,
    kpis: {
      bookings: { today: bookingSpark[last], yesterday: bookingSpark[last - 1], spark: bookingSpark },
      collections: {
        collected: collectedSpark[last],
        scheduled: scheduledSpark[last],
        collectedYesterday: collectedSpark[last - 1],
        spark: collectedSpark,
      },
      samples: { now: pipeline.samplesPending, yesterday: before.samples },
      reports: { now: pipeline.reportsPending, yesterday: before.reports },
      revenue: money ? { today: revenueSpark[last], yesterday: revenueSpark[last - 1], spark: revenueSpark } : null,
      due: { amount: pipeline.due, count: pipeline.dueCount },
      partners,
      leads: { today: leadSpark[last], yesterday: leadSpark[last - 1], spark: leadSpark, ...leads },
    },
    pipeline,
    items,
    collectors,
    partnerTop,
    topCity: cities[0] ?? null,
  };
}

/* ── Owner overview ───────────────────────────────────────────────────── */

const pad = (x) => String(x).padStart(2, "0");

/** Last month from its 1st to the same day-of-month as today (capped at its last day). */
function lastMonthToDate(todayYmd) {
  const [y, m, d] = todayYmd.split("-").map(Number);
  const py = m === 1 ? y - 1 : y;
  const pm = m === 1 ? 12 : m - 1;
  const lastDay = new Date(Date.UTC(py, pm, 0)).getUTCDate();
  const from = `${py}-${pad(pm)}-01`;
  return {
    toDate: range("custom", { from, to: `${py}-${pad(pm)}-${pad(Math.min(d, lastDay))}` }),
    full: range("custom", { from, to: `${py}-${pad(pm)}-${pad(lastDay)}` }),
    label: new Date(Date.UTC(py, pm - 1, 1)).toLocaleDateString("en-IN", { timeZone: "UTC", month: "long" }),
  };
}

const sumRows = (rows) => rows.reduce((s, r) => s + num(r.v), 0);

/**
 * The owner's one screen. Money figures are always included — the page is
 * gated on executive.view.
 */
export async function executiveData() {
  const today = range("today");
  const yesterday = range("yesterday");
  const month = range("month");
  const prev = lastMonthToDate(today.fromDay);

  const [pipeline, bookingsToday, revenueMonth, revenuePrevToDate, revenuePrevFull, cities, leads, partners, margin, activity] =
    await Promise.all([
      pipelineCounts(),
      bookingSeries({ from: yesterday.from, to: today.to }),
      revenueSeries(month),
      revenueSeries(prev.toDate),
      revenueSeries(prev.full),
      topCities(month, 5),
      safe(leadsToday(), { created: 0, contacted: 0, converted: 0 }, "leads today"),
      partnerPerformance(8),
      monthMargin(month),
      partnerActivity(),
    ]);

  const monthDays = daysIn(month);
  const daily = series(monthDays, revenueMonth);
  const byDay = new Map(bookingsToday.map((r) => [dkey(r.d), num(r.v)]));

  return {
    monthLabel: new Date(`${month.fromDay}T00:00:00Z`).toLocaleDateString("en-IN", { timeZone: "UTC", month: "long", year: "numeric" }),
    prevLabel: prev.label,
    bookingsToday: byDay.get(today.fromDay) ?? 0,
    bookingsYesterday: byDay.get(yesterday.fromDay) ?? 0,
    revenueToday: daily[monthDays.indexOf(today.fromDay)] ?? 0,
    revenueMonth: sumRows(revenueMonth),
    revenuePrevToDate: sumRows(revenuePrevToDate),
    revenuePrevFull: sumRows(revenuePrevFull),
    daily: monthDays.map((d, i) => ({ day: d, value: daily[i] })),
    pipeline,
    cities,
    leads,
    partners,
    partnerActivity: activity,
    margin,
  };
}

/**
 * Active partners with their open orders and average turnaround (sample
 * received → report ready) over the last 30 days.
 */
export async function partnerPerformance(limit = 8) {
  const [rows] = await query(
    `SELECT p.id, p.name, p.city,
            SUM(b.status IN (${list(OPEN_STATUSES)}) AND b.partner_status <> 'rejected') AS open_n,
            SUM(b.partner_status = 'pending' AND b.status IN (${list(OPEN_STATUSES)})) AS pending_n,
            AVG(CASE WHEN b.report_ready_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY) AND b.sample_received_at IS NOT NULL
                     THEN TIMESTAMPDIFF(MINUTE, b.sample_received_at, b.report_ready_at) / 60 END) AS avg_tat,
            SUM(b.partner_assigned_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY)) AS orders_30d
     FROM partners p
     LEFT JOIN bookings b ON b.partner_id = p.id AND b.deleted_at IS NULL AND b.status <> 'cancelled'
          AND (b.status IN (${list(OPEN_STATUSES)}) OR b.partner_assigned_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY))
     WHERE p.status = 'active'
     GROUP BY p.id, p.name, p.city
     ORDER BY open_n DESC, orders_30d DESC
     LIMIT ${Math.min(30, Math.max(1, Number(limit) || 8))}`,
    [...OPEN_STATUSES, ...OPEN_STATUSES, ...OPEN_STATUSES]
  );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    city: r.city,
    open: num(r.open_n),
    pending: num(r.pending_n),
    avgTat: r.avg_tat === null ? null : num(r.avg_tat),
    orders30: num(r.orders_30d),
  }));
}

/**
 * Estimated margin this month: customer amount minus partner cost for every
 * non-cancelled booking whose report became ready this month. Bounded by
 * created_at (90 days before the month) so it rides the created index.
 */
export async function monthMargin(r) {
  const [[row]] = await query(
    `SELECT COUNT(*) AS n, COALESCE(SUM(b.final_amount), 0) AS gross, COALESCE(SUM(b.partner_cost), 0) AS cost
     FROM bookings b
     WHERE b.deleted_at IS NULL AND b.status IN ('report_ready','report_delivered','completed')
       AND b.report_ready_at >= ? AND b.report_ready_at < ?
       AND b.created_at >= DATE_SUB(?, INTERVAL 90 DAY)`,
    [r.from, r.to, r.from]
  );
  const gross = num(row?.gross);
  const cost = num(row?.cost);
  return { count: num(row?.n), gross, cost, margin: gross - cost, pct: gross > 0 ? ((gross - cost) / gross) * 100 : null };
}

/* ── Collections queue ────────────────────────────────────────────────── */

function collectionWhere({ day, collectorId, cityId, status }, scope, { withStatus = true } = {}) {
  const where = ["b.deleted_at IS NULL", "b.status <> 'cancelled'", "b.collection_date = ?"];
  const params = [day];
  const s = scopeWhere(scope);
  where.push(...s.sql);
  params.push(...s.params);
  if (collectorId === "none") where.push("b.collector_id IS NULL");
  else if (collectorId) {
    where.push("b.collector_id = ?");
    params.push(Number(collectorId));
  }
  if (cityId) {
    where.push("b.city_id = ?");
    params.push(Number(cityId));
  }
  if (withStatus && status) {
    where.push("b.collection_status = ?");
    params.push(status);
  }
  return { where, params };
}

const COLLECTION_COLUMNS = `b.id, b.patient_name, b.patient_phone, b.alt_phone, b.age, b.gender, b.address, b.area, b.landmark,
  b.city, b.city_id, b.collection_date, b.collection_slot, b.collection_status, b.status, b.payment_status,
  b.final_amount, b.paid_amount, b.refunded_amount, b.collection_note, b.notes, b.collector_id, b.source,
  u.name AS collector_name,
  (SELECT GROUP_CONCAT(i.name ORDER BY i.id SEPARATOR ' + ') FROM booking_items i
    WHERE i.booking_id = b.id AND i.status = 'active') AS items_label`;

const shapeCollection = (r) => ({
  ...r,
  due: Math.max(0, num(r.final_amount) - num(r.paid_amount) + num(r.refunded_amount)),
});

/**
 * The collections for one day. `assignedOnly` leaves the unassigned ones to
 * their own section (listUnassignedCollections) on the staff view.
 */
export async function listCollections(filters, scope = {}, { limit = 25, offset = 0, assignedOnly = false } = {}) {
  const { where, params } = collectionWhere(filters, scope);
  if (assignedOnly && filters.collectorId !== "none") where.push("b.collector_id IS NOT NULL");
  const clause = `WHERE ${where.join(" AND ")}`;
  const lim = Math.min(100, Math.max(1, Number(limit) || 25));
  const off = Math.max(0, Number(offset) || 0);

  const sum = collectionWhere(filters, scope, { withStatus: false });
  const [[rows], [[count]], [[summary]]] = await Promise.all([
    query(
      `SELECT ${COLLECTION_COLUMNS}
       FROM bookings b LEFT JOIN admin_users u ON u.id = b.collector_id
       ${clause}
       ORDER BY b.collection_slot = '', b.collection_slot ASC, b.id ASC
       LIMIT ${lim} OFFSET ${off}`,
      params
    ),
    query(`SELECT COUNT(*) AS n FROM bookings b ${clause}`, params),
    query(
      `SELECT COUNT(*) AS total,
              SUM(b.collector_id IS NOT NULL) AS assigned,
              SUM(b.collection_status = 'collected') AS done,
              SUM(b.collection_status = 'failed') AS failed,
              SUM(b.collector_id IS NULL) AS unassigned
       FROM bookings b WHERE ${sum.where.join(" AND ")}`,
      sum.params
    ),
  ]);
  const assigned = num(summary?.assigned);
  const done = num(summary?.done);
  const failed = num(summary?.failed);
  return {
    rows: rows.map(shapeCollection),
    total: num(count.n),
    limit: lim,
    offset: off,
    summary: {
      total: num(summary?.total),
      assigned,
      done,
      failed,
      pending: Math.max(0, num(summary?.total) - num(summary?.unassigned) - done - failed),
      unassigned: num(summary?.unassigned),
    },
  };
}

export async function listUnassignedCollections({ day, cityId }, limit = 50) {
  const { where, params } = collectionWhere({ day, cityId, collectorId: "none" }, {});
  const [rows] = await query(
    `SELECT ${COLLECTION_COLUMNS}
     FROM bookings b LEFT JOIN admin_users u ON u.id = b.collector_id
     WHERE ${where.join(" AND ")}
     ORDER BY b.collection_slot = '', b.collection_slot ASC, b.id ASC
     LIMIT ${Math.min(100, Math.max(1, Number(limit) || 50))}`,
    params
  );
  return rows.map(shapeCollection);
}

/* ── Samples queue ────────────────────────────────────────────────────── */

export const SAMPLE_TABS = [
  { key: "awaiting", label: "Collected, awaiting lab" },
  { key: "received", label: "Received by lab" },
  { key: "processing", label: "Processing" },
  { key: "today", label: "All today" },
];

function sampleTabWhere(tab, todayFrom) {
  switch (tab) {
    case "received":
      return { sql: "b.status = 'sample_received'", params: [], order: "b.sample_received_at ASC" };
    case "processing":
      return { sql: "b.status = 'processing'", params: [], order: "b.processing_at ASC" };
    case "today":
      return { sql: "b.collected_at >= ? AND b.status <> 'cancelled'", params: [todayFrom], order: "b.collected_at DESC" };
    default:
      return { sql: "b.status = 'sample_collected'", params: [], order: "b.collected_at ASC" };
  }
}

/**
 * Samples between the patient's arm and the lab. `receiveHours` is the SLA:
 * a sample in transit longer than that is flagged delayed (computed here,
 * from SQL minutes, so the page never reads the clock).
 */
export async function listSamples({ tab = "awaiting", search = "", cityId = null, partnerId = null, limit = 25, offset = 0 }, scope = {}, receiveHours = 6) {
  const today = range("today");
  const base = ["b.deleted_at IS NULL"];
  const baseParams = [];
  const s = scopeWhere(scope);
  base.push(...s.sql);
  baseParams.push(...s.params);
  if (cityId) {
    base.push("b.city_id = ?");
    baseParams.push(Number(cityId));
  }
  if (partnerId) {
    base.push(partnerId === "none" ? "b.partner_id IS NULL" : "b.partner_id = ?");
    if (partnerId !== "none") baseParams.push(Number(partnerId));
  }
  if (search) {
    const code = Number(String(search).trim().replace(/^mb/i, "")) || 0;
    base.push("(b.patient_name LIKE ? OR b.id = ?)");
    baseParams.push(like(String(search).trim()), code);
  }

  const t = sampleTabWhere(tab, today.from);
  const clause = `WHERE ${[...base, t.sql].join(" AND ")}`;
  const params = [...baseParams, ...t.params];
  const lim = Math.min(100, Math.max(1, Number(limit) || 25));
  const off = Math.max(0, Number(offset) || 0);

  const [[rows], [[count]], [[counts]]] = await Promise.all([
    query(
      `SELECT b.id, b.patient_name, b.age, b.gender, b.city, b.status, b.collected_at, b.sample_received_at, b.processing_at,
              b.report_due_at, b.partner_id, b.partner_status, p.name AS partner_name, u.name AS collector_name,
              TIMESTAMPDIFF(MINUTE, b.collected_at, COALESCE(b.sample_received_at, UTC_TIMESTAMP())) AS transit_min,
              TIMESTAMPDIFF(MINUTE, COALESCE(b.processing_at, b.sample_received_at), UTC_TIMESTAMP()) AS in_lab_min,
              (b.report_due_at IS NOT NULL AND b.report_due_at < UTC_TIMESTAMP()) AS report_late,
              (SELECT GROUP_CONCAT(i.name ORDER BY i.id SEPARATOR ' + ') FROM booking_items i
                WHERE i.booking_id = b.id AND i.status = 'active') AS items_label
       FROM bookings b
       LEFT JOIN partners p ON p.id = b.partner_id
       LEFT JOIN admin_users u ON u.id = b.collector_id
       ${clause}
       ORDER BY ${t.order}, b.id
       LIMIT ${lim} OFFSET ${off}`,
      params
    ),
    query(`SELECT COUNT(*) AS n FROM bookings b ${clause}`, params),
    query(
      `SELECT SUM(b.status = 'sample_collected') AS awaiting,
              SUM(b.status = 'sample_collected' AND b.collected_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL ? HOUR)) AS delayed_count,
              SUM(b.status = 'sample_received') AS received,
              SUM(b.status = 'processing') AS processing,
              SUM(b.collected_at >= ? AND b.status <> 'cancelled') AS today
       FROM bookings b
       WHERE ${[...base, "(b.status IN ('sample_collected','sample_received','processing') OR b.collected_at >= ?)"].join(" AND ")}`,
      [Number(receiveHours) || 6, today.from, ...baseParams, today.from]
    ),
  ]);

  const limitMin = (Number(receiveHours) || 6) * 60;
  return {
    rows: rows.map((r) => ({
      ...r,
      transit_min: r.transit_min === null ? null : num(r.transit_min),
      in_lab_min: r.in_lab_min === null ? null : num(r.in_lab_min),
      delayed: r.transit_min !== null && num(r.transit_min) > limitMin,
      report_late: Boolean(num(r.report_late)),
      // A partner never sees who collected (see forPartner in ./bookings.js).
      ...(scope.partnerId ? { collector_name: null } : {}),
    })),
    total: num(count.n),
    limit: lim,
    offset: off,
    counts: {
      awaiting: num(counts?.awaiting),
      delayed: num(counts?.delayed_count),
      received: num(counts?.received),
      processing: num(counts?.processing),
      today: num(counts?.today),
    },
  };
}

/* ── Reports queue ────────────────────────────────────────────────────── */

export const REPORT_TABS = [
  { key: "awaiting", label: "Awaiting report" },
  { key: "overdue", label: "Overdue" },
  { key: "verify", label: "Ready to verify", status: "report_ready" },
  { key: "verified", label: "Verified — to send", status: "verified" },
  { key: "sent", label: "Sent", status: "sent" },
  { key: "all", label: "All" },
];

const AWAITING = ["sample_received", "processing", "report_pending"];

/** Tab counts for /crm/reports — one scoped query. */
export async function reportTabCounts(scope = {}) {
  const s = scopeWhere(scope);
  const [[row]] = await query(
    `SELECT SUM(b.report_status IN (${list(AWAITING)})) AS awaiting,
            SUM(b.report_due_at IS NOT NULL AND b.report_due_at < UTC_TIMESTAMP()
                AND b.report_status IN ('sample_received','processing','report_pending','waiting')) AS overdue,
            SUM(b.report_status = 'report_ready') AS verify,
            SUM(b.report_status = 'verified') AS verified,
            SUM(b.report_status = 'sent') AS sent,
            SUM(b.status IN ('sample_collected','sample_received','processing','report_ready','report_delivered')) AS all_n
     FROM bookings b
     WHERE ${["b.deleted_at IS NULL", "b.status <> 'cancelled'", "b.status IN ('sample_collected','sample_received','processing','report_ready','report_delivered','completed')", ...s.sql].join(" AND ")}`,
    [...AWAITING, ...s.params]
  );
  return {
    awaiting: num(row?.awaiting),
    overdue: num(row?.overdue),
    verify: num(row?.verify),
    verified: num(row?.verified),
    sent: num(row?.sent),
    all: num(row?.all_n),
  };
}

/**
 * The "awaiting report" tab: listReportQueue (./reports.js) filters on one
 * report status; this tab spans three, so it runs the same query shape with
 * an IN list. Same columns, same order, same scope.
 */
export async function listAwaitingReports({ search = "", limit = 25, offset = 0 } = {}, scope = {}) {
  const s = scopeWhere(scope);
  const where = ["b.deleted_at IS NULL", "b.status <> 'cancelled'", `b.report_status IN (${list(AWAITING)})`, ...s.sql];
  const params = [...AWAITING, ...s.params];
  if (search) {
    const code = Number(String(search).trim().replace(/^mb/i, "")) || 0;
    where.push("(b.patient_name LIKE ? OR b.id = ?)");
    params.push(like(String(search).trim()), code);
  }
  const clause = `WHERE ${where.join(" AND ")}`;
  const lim = Math.min(100, Math.max(1, Number(limit) || 25));
  const off = Math.max(0, Number(offset) || 0);
  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT b.id, b.patient_name, b.age, b.gender, b.status, b.report_status, b.partner_id, b.partner_status,
              b.sample_received_at, b.report_due_at, b.report_ready_at, b.delivered_at, b.city,
              p.name AS partner_name,
              (SELECT GROUP_CONCAT(i.name SEPARATOR ' + ') FROM booking_items i WHERE i.booking_id = b.id AND i.status = 'active') AS items_label,
              NULL AS report_id, NULL AS file_id, NULL AS live_report_status
       FROM bookings b LEFT JOIN partners p ON p.id = b.partner_id
       ${clause}
       ORDER BY (b.report_due_at IS NULL), b.report_due_at ASC, b.id DESC
       LIMIT ${lim} OFFSET ${off}`,
      params
    ),
    query(`SELECT COUNT(*) AS n FROM bookings b ${clause}`, params),
  ]);
  return { rows, total: num(count.n), limit: lim, offset: off };
}

/** Who uploaded / verified / sent each live report on a page of the queue. */
export async function reportTrail(reportIds) {
  const ids = [...new Set(reportIds.filter(Boolean).map(Number))];
  if (!ids.length) return {};
  const [rows] = await query(
    `SELECT r.id, r.version, r.uploaded_at, r.verified_at, r.sent_at, r.sent_via,
            uu.name AS uploaded_by_name, vu.name AS verified_by_name, su.name AS sent_by_name
     FROM reports r
     LEFT JOIN admin_users uu ON uu.id = r.uploaded_by
     LEFT JOIN admin_users vu ON vu.id = r.verified_by
     LEFT JOIN admin_users su ON su.id = r.sent_by
     WHERE r.id IN (${list(ids)})`,
    ids
  );
  return Object.fromEntries(rows.map((r) => [r.id, r]));
}
