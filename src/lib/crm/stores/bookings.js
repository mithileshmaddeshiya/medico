/**
 * Bookings — the unit of work — and the workflow that moves one from "booked"
 * to "completed". Server only.
 *
 * ── EVERY STATE CHANGE GOES THROUGH HERE ─────────────────────────────────
 * Status, collection, partner and report state live on the booking row and
 * are only ever changed by the functions in this file, each of which:
 *   1. reads the row FOR UPDATE inside a transaction (two people pressing
 *      "collected" at once cannot both win),
 *   2. checks the caller's scope (a partner may only touch its own bookings,
 *      a collector only the collections assigned to them),
 *   3. keeps the related columns consistent (collected → sample_collected,
 *      report uploaded → report_ready …) and stamps the time,
 *   4. writes one activity row with before/after, and raises notifications.
 *
 * Nothing here trusts an amount from a form except where staff are entering
 * one on purpose (a discount, a manual price for a "call for price" test);
 * catalogue prices are read from lab_tests at the moment of booking.
 */
import { query, transaction } from "@/lib/db";

import { logActivity, notify } from "../activity";
import {
  BOOKING_STATUS,
  COLLECTION_STATUS,
  OPEN_STATUSES,
  PIPELINE,
  SOURCE,
  bookingCode,
  parseBookingCode,
} from "../constants";
import { UserError } from "../guard";
import { cleanPhone, upsertCustomer, validPhone } from "./customers";

const text = (value, max) => String(value ?? "").trim().slice(0, max);
const money = (value) => {
  const n = Math.round(Number(value) * 100) / 100;
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const like = (value) => `%${String(value).replace(/[%_]/g, "\\$&")}%`;
const ymd = (value) => (/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? "")) ? String(value) : null);

/* ── Pricing ──────────────────────────────────────────────────────────── */

/**
 * Price a list of requested items from the catalogue.
 *
 *   items: [{ testId, qty?, price? }]  or  [{ name, price }] for a custom line
 *
 * `price` on a catalogue item is honoured only when `allowOverride` (staff
 * creating a booking by hand) — never for anything arriving from the website.
 * Partner cost: that partner's own price if set, else the test's standard
 * partner_price, else 0 (and the settlement screen shows it as unset).
 */
export async function priceItems(items, { partnerId = null, allowOverride = false, conn = null } = {}) {
  const exec = conn ? conn.execute.bind(conn) : query;
  const ids = [...new Set(items.map((i) => i.testId).filter(Boolean).map(String))];

  const catalogue = new Map();
  if (ids.length) {
    const [rows] = await exec(
      `SELECT t.id, t.name, t.is_package, t.price, t.mrp, t.partner_price, t.tat_hours,
              ${partnerId ? "pp.price" : "NULL"} AS partner_own_price
       FROM lab_tests t
       ${partnerId ? "LEFT JOIN partner_prices pp ON pp.test_id = t.id AND pp.partner_id = ?" : ""}
       WHERE t.id IN (${ids.map(() => "?").join(",")})`,
      partnerId ? [partnerId, ...ids] : ids
    );
    for (const r of rows) catalogue.set(String(r.id), r);
  }

  const lines = [];
  let tat = 0;
  for (const item of items) {
    const qty = Math.min(10, Math.max(1, Math.floor(Number(item.qty) || 1)));
    if (item.testId) {
      const t = catalogue.get(String(item.testId));
      if (!t) throw new UserError("One of the selected tests no longer exists.");
      const override = allowOverride && item.price !== undefined && item.price !== "" && item.price !== null;
      const unit = override ? money(item.price) : t.price === null ? null : Number(t.price);
      if (unit === null) throw new UserError(`${t.name} has no set price — enter one.`);
      const partnerCost =
        t.partner_own_price !== null && t.partner_own_price !== undefined
          ? Number(t.partner_own_price)
          : t.partner_price !== null
            ? Number(t.partner_price)
            : 0;
      tat = Math.max(tat, Number(t.tat_hours ?? 24));
      lines.push({
        test_id: t.id,
        name: t.name,
        is_package: t.is_package ? 1 : 0,
        qty,
        unit_price: unit,
        unit_mrp: t.mrp !== null ? Math.max(Number(t.mrp), unit) : unit,
        partner_cost: partnerCost,
        line_total: Math.round(unit * qty * 100) / 100,
      });
    } else if (item.name) {
      const unit = money(item.price);
      lines.push({
        test_id: null,
        name: text(item.name, 200),
        is_package: 0,
        qty,
        unit_price: unit,
        unit_mrp: unit,
        partner_cost: money(item.partnerCost),
        line_total: Math.round(unit * qty * 100) / 100,
      });
    }
  }
  if (!lines.length) throw new UserError("Add at least one test or package.");

  const subtotal = lines.reduce((s, l) => s + l.line_total, 0);
  const partnerCost = lines.reduce((s, l) => s + l.partner_cost * l.qty, 0);
  return { lines, subtotal: Math.round(subtotal * 100) / 100, partnerCost: Math.round(partnerCost * 100) / 100, tatHours: tat || 24 };
}

async function writeItems(conn, bookingId, lines) {
  await conn.execute("UPDATE booking_items SET status = 'removed' WHERE booking_id = ? AND status = 'active'", [bookingId]);
  for (const l of lines) {
    await conn.execute(
      `INSERT INTO booking_items (booking_id, test_id, name, is_package, qty, unit_price, unit_mrp, partner_cost, line_total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [bookingId, l.test_id, l.name, l.is_package, l.qty, l.unit_price, l.unit_mrp, l.partner_cost, l.line_total]
    );
  }
}

/* ── Payment cache ────────────────────────────────────────────────────── */

/**
 * Recompute a booking's paid_amount / refunded_amount / payment_status from
 * its payment and refund rows. The only writer of those three columns.
 */
export async function recomputeBookingPayment(conn, bookingId) {
  const [[b]] = await conn.execute("SELECT final_amount FROM bookings WHERE id = ?", [bookingId]);
  if (!b) return null;
  const [[p]] = await conn.execute(
    `SELECT COALESCE(SUM(CASE WHEN status = 'paid' THEN amount END), 0) AS paid,
            SUM(status = 'failed') AS failed, COUNT(*) AS n
     FROM payments WHERE booking_id = ?`,
    [bookingId]
  );
  const [[r]] = await conn.execute(
    "SELECT COALESCE(SUM(amount), 0) AS refunded FROM refunds WHERE booking_id = ? AND status = 'processed'",
    [bookingId]
  );
  const paid = Number(p.paid);
  const refunded = Number(r.refunded);
  const due = Number(b.final_amount);
  const net = paid - refunded;

  let status;
  if (refunded > 0 && net <= 0.009) status = "refunded";
  else if (net + 0.009 >= due && due > 0) status = "paid";
  else if (net > 0) status = "partial";
  else if (Number(p.failed) > 0 && Number(p.failed) === Number(p.n)) status = "failed";
  else status = "pending";

  await conn.execute("UPDATE bookings SET paid_amount = ?, refunded_amount = ?, payment_status = ? WHERE id = ?", [
    paid,
    refunded,
    status,
    bookingId,
  ]);
  return { paid, refunded, status };
}

/* ── Create ───────────────────────────────────────────────────────────── */

/**
 * Create a booking (offline, or from a converted lead). Website bookings are
 * created by src/lib/crm/sync.js through the same insertBooking().
 *
 * input: {
 *   name, phone, altPhone, age, gender, email,
 *   address, cityId, city, area, landmark,
 *   items: [{ testId, qty, price? } | { name, price }],
 *   discount, collectionFee, source, collectionDate, collectionSlot,
 *   collectorId, partnerId, paymentMode, notes, leadId,
 *   payment: { amount, mode, reference }   // optional, collected now
 * }
 */
export async function createBooking(input, { user }) {
  const phone = cleanPhone(input.phone);
  if (!validPhone(phone)) throw new UserError("Enter a valid 10-digit mobile number.");
  if (!text(input.name, 80)) throw new UserError("Enter the patient's name.");
  const source = SOURCE[input.source] ? input.source : "phone";

  const result = await transaction(async (conn) => {
    const cityName = await resolveCityName(conn, input.cityId, input.city);
    const customer = await upsertCustomer(
      conn,
      { ...input, phone, city: cityName, city_id: input.cityId || null },
      { user, source }
    );
    const partnerId = input.partnerId ? Number(input.partnerId) : null;
    const priced = await priceItems(input.items ?? [], { partnerId, allowOverride: true, conn });

    const id = await insertBooking(conn, {
      customerId: customer.id,
      leadId: input.leadId ? Number(input.leadId) : null,
      orderId: null,
      patient: {
        name: text(input.name, 80),
        phone,
        altPhone: text(input.altPhone, 15),
        age: input.age,
        gender: input.gender,
        address: text(input.address, 400),
        cityId: input.cityId ? Number(input.cityId) : null,
        city: cityName,
        area: text(input.area, 120),
        landmark: text(input.landmark, 160),
      },
      source,
      priced,
      discount: money(input.discount),
      collectionFee: money(input.collectionFee),
      collectionDate: ymd(input.collectionDate),
      collectionSlot: text(input.collectionSlot, 40),
      paymentMode: input.paymentMode,
      notes: text(input.notes, 2000),
      status: input.confirm === false ? "booked" : "confirmed",
      userId: user?.id ?? null,
    });

    if (input.leadId) {
      await conn.execute(
        "UPDATE leads SET status = 'booked', booking_id = ?, customer_id = ?, status_changed_at = UTC_TIMESTAMP() WHERE id = ?",
        [id, customer.id, Number(input.leadId)]
      );
    }

    if (input.payment && Number(input.payment.amount) > 0) {
      await conn.execute(
        `INSERT INTO payments (booking_id, customer_id, amount, mode, status, reference, collected_by, created_by, notes)
         VALUES (?, ?, ?, ?, 'paid', ?, ?, ?, 'Recorded at booking')`,
        [id, customer.id, money(input.payment.amount), paymentModeOr(input.payment.mode, "cash"), text(input.payment.reference, 120), user?.id ?? null, user?.id ?? null]
      );
      await recomputeBookingPayment(conn, id);
    }

    await logActivity({
      conn,
      user,
      action: "create",
      entity: "bookings",
      entityId: id,
      summary: `Created booking ${bookingCode(id)} for ${text(input.name, 80)} (${SOURCE[source].label})`,
      after: { source, items: priced.lines.map((l) => l.name), subtotal: priced.subtotal },
    });
    return { id, customerId: customer.id };
  });

  // Assignment runs as its own step so it carries its own activity row and
  // notification exactly as if it had been done from the booking screen.
  if (input.collectorId) {
    await assignCollector(result.id, { collectorId: input.collectorId, date: input.collectionDate, slot: input.collectionSlot }, { user });
  }
  if (input.partnerId) await assignPartner(result.id, { partnerId: input.partnerId }, { user });

  await notify({
    type: "booking.new",
    title: `New booking ${bookingCode(result.id)}`,
    body: `${text(input.name, 80)} · ${SOURCE[source].label}`,
    link: `/crm/bookings/${result.id}`,
    perm: "bookings.view",
  });

  return result;
}

const paymentModeOr = (mode, fallback) =>
  ["cash", "upi", "online", "card", "bank_transfer", "other"].includes(mode) ? mode : fallback;

async function resolveCityName(conn, cityId, fallback) {
  if (!cityId) return text(fallback, 80);
  const [[c]] = await conn.execute("SELECT name FROM service_cities WHERE id = ?", [Number(cityId)]);
  return c?.name ?? text(fallback, 80);
}

/** The shared INSERT, used by createBooking and the website sync. */
export async function insertBooking(conn, b) {
  const discount = Math.min(b.discount ?? 0, b.priced.subtotal);
  const final = Math.max(0, Math.round((b.priced.subtotal - discount + (b.collectionFee ?? 0)) * 100) / 100);

  const [res] = await conn.execute(
    `INSERT INTO bookings
       (customer_id, lead_id, order_id, patient_name, patient_phone, alt_phone, age, gender, address,
        city_id, city, area, landmark, source, status, collection_date, collection_slot,
        subtotal, discount, collection_fee, final_amount, partner_cost, payment_mode, notes,
        created_by, updated_by, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, UTC_TIMESTAMP()))`,
    [
      b.customerId,
      b.leadId ?? null,
      b.orderId ?? null,
      b.patient.name,
      b.patient.phone,
      b.patient.altPhone ?? "",
      Number(b.patient.age) > 0 && Number(b.patient.age) < 130 ? Math.round(Number(b.patient.age)) : null,
      ["male", "female", "other"].includes(b.patient.gender) ? b.patient.gender : "",
      b.patient.address ?? "",
      b.patient.cityId ?? null,
      b.patient.city ?? "",
      b.patient.area ?? "",
      b.patient.landmark ?? "",
      b.source,
      b.status ?? "booked",
      b.collectionDate ?? null,
      b.collectionSlot ?? "",
      b.priced.subtotal,
      discount,
      b.collectionFee ?? 0,
      final,
      b.priced.partnerCost,
      paymentModeOr(b.paymentMode, ""),
      b.notes ?? "",
      b.userId ?? null,
      b.userId ?? null,
      b.createdAt ?? null,
    ]
  );
  await writeItems(conn, res.insertId, b.priced.lines);
  return res.insertId;
}

/* ── Read ─────────────────────────────────────────────────────────────── */

/** WHERE fragments for a scope (see scopeOf in ../guard.js). */
export function scopeWhere(scope, alias = "b") {
  if (scope?.none) return { sql: ["1 = 0"], params: [] };
  if (scope?.partnerId) return { sql: [`${alias}.partner_id = ?`, `${alias}.partner_status <> 'rejected'`], params: [scope.partnerId] };
  if (scope?.collectorId) return { sql: [`${alias}.collector_id = ?`], params: [scope.collectorId] };
  return { sql: [], params: [] };
}

const SORTS = {
  newest: "b.created_at DESC",
  oldest: "b.created_at ASC",
  collection: "b.collection_date IS NULL, b.collection_date ASC, b.collection_slot ASC",
  amount: "b.final_amount DESC",
  updated: "b.updated_at DESC",
};

/**
 * The booking list, server-side filtered and paginated.
 *
 * filters: { from, to (UTC datetime strings, `to` exclusive), dateField
 *   ('created' | 'collection'), cityId, area, testId, partnerId, collectorId,
 *   status (string | array), open (bool), paymentStatus, source, reportStatus,
 *   collectionStatus, partnerStatus, search, sort, limit, offset }
 */
export async function listBookings(filters = {}, scope = {}) {
  const where = ["b.deleted_at IS NULL"];
  const params = [];
  const s = scopeWhere(scope);
  where.push(...s.sql);
  params.push(...s.params);

  if (filters.from || filters.to) {
    if (filters.dateField === "collection") {
      if (filters.fromDay) {
        where.push("b.collection_date >= ?");
        params.push(filters.fromDay);
      }
      if (filters.toDay) {
        where.push("b.collection_date <= ?");
        params.push(filters.toDay);
      }
    } else {
      if (filters.from) {
        where.push("b.created_at >= ?");
        params.push(filters.from);
      }
      if (filters.to) {
        where.push("b.created_at < ?");
        params.push(filters.to);
      }
    }
  }
  const eq = (col, value) => {
    if (value === undefined || value === null || value === "") return;
    where.push(`${col} = ?`);
    params.push(value);
  };
  eq("b.city_id", filters.cityId ? Number(filters.cityId) : null);
  eq("b.area", filters.area);
  eq("b.partner_id", filters.partnerId ? Number(filters.partnerId) : null);
  eq("b.collector_id", filters.collectorId ? Number(filters.collectorId) : null);
  eq("b.payment_status", filters.paymentStatus);
  eq("b.source", filters.source);
  eq("b.report_status", filters.reportStatus);
  eq("b.collection_status", filters.collectionStatus);
  eq("b.partner_status", filters.partnerStatus);
  eq("b.customer_id", filters.customerId ? Number(filters.customerId) : null);

  if (filters.unassignedPartner) where.push("b.partner_id IS NULL");
  if (filters.unassignedCollector) where.push("b.collector_id IS NULL");

  const statuses = [].concat(filters.status ?? []).filter((x) => BOOKING_STATUS[x]);
  if (statuses.length) {
    where.push(`b.status IN (${statuses.map(() => "?").join(",")})`);
    params.push(...statuses);
  } else if (filters.open) {
    where.push(`b.status IN (${OPEN_STATUSES.map(() => "?").join(",")})`);
    params.push(...OPEN_STATUSES);
  }

  if (filters.testId) {
    where.push("EXISTS (SELECT 1 FROM booking_items i WHERE i.booking_id = b.id AND i.status = 'active' AND i.test_id = ?)");
    params.push(String(filters.testId));
  }

  if (filters.search) {
    const q = String(filters.search).trim();
    const code = parseBookingCode(q);
    const digits = q.replace(/\D/g, "");
    const ors = ["b.patient_name LIKE ?"];
    params.push(like(q));
    if (code) {
      ors.push("b.id = ?");
      params.push(code);
    }
    if (digits.length >= 4) {
      ors.push("b.patient_phone LIKE ?", "b.alt_phone LIKE ?");
      params.push(like(digits), like(digits));
    }
    where.push(`(${ors.join(" OR ")})`);
  }

  const clause = `WHERE ${where.join(" AND ")}`;
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 25));
  const offset = Math.max(0, Number(filters.offset) || 0);
  const order = SORTS[filters.sort] ?? SORTS.newest;

  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT b.*, p.name AS partner_name, u.name AS collector_name,
              (SELECT GROUP_CONCAT(i.name ORDER BY i.id SEPARATOR ' + ') FROM booking_items i
                WHERE i.booking_id = b.id AND i.status = 'active') AS items_label,
              (SELECT COUNT(*) FROM booking_items i WHERE i.booking_id = b.id AND i.status = 'active') AS items_count
       FROM bookings b
       LEFT JOIN partners p ON p.id = b.partner_id
       LEFT JOIN admin_users u ON u.id = b.collector_id
       ${clause}
       ORDER BY ${order}
       LIMIT ${limit} OFFSET ${offset}`,
      params
    ),
    query(`SELECT COUNT(*) AS n FROM bookings b ${clause}`, params),
  ]);

  return { rows: scope?.partnerId ? rows.map(forPartner) : rows, total: Number(count.n), limit, offset };
}

/**
 * What a lab partner may see of a booking: who the patient is and what to
 * run, never the customer's price, MedicoBharat's margin, the internal notes,
 * or the patient's phone and home address.
 */
const HIDDEN_FROM_PARTNER = [
  "notes",
  "patient_phone",
  "alt_phone",
  "address",
  "landmark",
  "subtotal",
  "discount",
  "collection_fee",
  "final_amount",
  "paid_amount",
  "refunded_amount",
  "payment_mode",
  "payment_status",
  "customer_id",
  "customer_name",
  "customer_email",
  "lead_id",
  "order_id",
  "collector_name",
  "collector_phone",
  "payments",
  "refunds",
];

export const omit = (row, keys) => Object.fromEntries(Object.entries(row).filter(([k]) => !keys.includes(k)));

export function forPartner(b) {
  return b ? omit(b, HIDDEN_FROM_PARTNER) : b;
}

export async function getBooking(id, scope = {}) {
  const bookingId = Number(id) || 0;
  const s = scopeWhere(scope);
  const [rows] = await query(
    `SELECT b.*, p.name AS partner_name, p.phone AS partner_phone, u.name AS collector_name, u.phone AS collector_phone,
            cu.name AS customer_name, cu.email AS customer_email,
            cb.name AS created_by_name, ub.name AS updated_by_name
     FROM bookings b
     LEFT JOIN partners p ON p.id = b.partner_id
     LEFT JOIN admin_users u ON u.id = b.collector_id
     LEFT JOIN customers cu ON cu.id = b.customer_id
     LEFT JOIN admin_users cb ON cb.id = b.created_by
     LEFT JOIN admin_users ub ON ub.id = b.updated_by
     WHERE b.id = ? ${s.sql.length ? `AND ${s.sql.join(" AND ")}` : ""} LIMIT 1`,
    [bookingId, ...s.params]
  );
  const booking = rows[0];
  if (!booking) return null;

  const partner = Boolean(scope?.partnerId);
  const [[items], [reports], [payments], [refunds]] = await Promise.all([
    query("SELECT * FROM booking_items WHERE booking_id = ? AND status = 'active' ORDER BY id", [bookingId]),
    query(
      `SELECT r.*, f.filename, f.mime, f.bytes, uu.name AS uploaded_by_name, vu.name AS verified_by_name, su.name AS sent_by_name
       FROM reports r JOIN crm_files f ON f.id = r.file_id
       LEFT JOIN admin_users uu ON uu.id = r.uploaded_by
       LEFT JOIN admin_users vu ON vu.id = r.verified_by
       LEFT JOIN admin_users su ON su.id = r.sent_by
       WHERE r.booking_id = ? ORDER BY r.id DESC`,
      [bookingId]
    ),
    partner
      ? Promise.resolve([[]])
      : query(
          `SELECT pm.*, u.name AS collected_by_name FROM payments pm
           LEFT JOIN admin_users u ON u.id = pm.collected_by
           WHERE pm.booking_id = ? ORDER BY pm.id DESC`,
          [bookingId]
        ),
    partner ? Promise.resolve([[]]) : query("SELECT * FROM refunds WHERE booking_id = ? ORDER BY id DESC", [bookingId]),
  ]);

  const shaped = {
    ...booking,
    items: partner ? items.map((i) => omit(i, ["unit_price", "unit_mrp", "line_total"])) : items,
    reports,
    payments,
    refunds,
  };
  return partner ? forPartner(shaped) : shaped;
}

/* ── Workflow ─────────────────────────────────────────────────────────── */

export async function lockBooking(conn, id, scope = {}) {
  const s = scopeWhere(scope);
  const [rows] = await conn.execute(
    `SELECT b.* FROM bookings b WHERE b.id = ? AND b.deleted_at IS NULL
     ${s.sql.length ? `AND ${s.sql.join(" AND ")}` : ""} FOR UPDATE`,
    [Number(id) || 0, ...s.params]
  );
  if (!rows[0]) throw new UserError("That booking was not found, or it is not assigned to you.");
  return rows[0];
}

export const stageIndex = (status) => PIPELINE.indexOf(status);

/**
 * Columns that go with reaching a pipeline stage. Applied for every stage
 * between the old one and the new, so jumping from "confirmed" straight to
 * "processing" still stamps collected/received times rather than leaving
 * holes that break the turnaround figures.
 */
export function stageEffects(booking, target) {
  const patch = {};
  const from = stageIndex(booking.status);
  const to = stageIndex(target);
  const passes = (stage) => from < stageIndex(stage) && to >= stageIndex(stage);
  const now = "UTC_TIMESTAMP()";

  if (passes("sample_collected")) {
    if (!["collected"].includes(booking.collection_status)) patch.collection_status = "'collected'";
    if (!booking.collected_at) patch.collected_at = now;
  }
  if (passes("sample_received")) {
    if (!booking.sample_received_at) patch.sample_received_at = now;
    patch.report_status = "'sample_received'";
  }
  if (passes("processing")) {
    if (!booking.processing_at) patch.processing_at = now;
    patch.report_status = "'processing'";
  }
  if (passes("report_ready")) {
    if (!booking.report_ready_at) patch.report_ready_at = now;
    patch.report_status = "'report_ready'";
  }
  if (passes("report_delivered")) {
    if (!booking.delivered_at) patch.delivered_at = now;
    patch.report_status = "'sent'";
  }
  if (passes("completed")) {
    if (!booking.completed_at) patch.completed_at = now;
    patch.report_status = "'completed'";
  }
  return patch;
}

export async function applyRaw(conn, id, patch, params = {}) {
  const sets = [];
  const values = [];
  for (const [col, expr] of Object.entries(patch)) sets.push(`${col} = ${expr}`);
  for (const [col, value] of Object.entries(params)) {
    sets.push(`${col} = ?`);
    values.push(value);
  }
  if (!sets.length) return;
  await conn.execute(`UPDATE bookings SET ${sets.join(", ")} WHERE id = ?`, [...values, id]);
}

/** Set the report due time from the slowest test's TAT, once the lab has the sample. */
export async function setReportDue(conn, id) {
  await conn.execute(
    `UPDATE bookings b SET report_due_at = DATE_ADD(COALESCE(b.sample_received_at, UTC_TIMESTAMP()), INTERVAL
       (SELECT COALESCE(MAX(t.tat_hours), 24) FROM booking_items i LEFT JOIN lab_tests t ON t.id = i.test_id
        WHERE i.booking_id = b.id AND i.status = 'active') HOUR)
     WHERE b.id = ? AND b.report_due_at IS NULL`,
    [id]
  );
}

/**
 * Move a booking's master status (staff). Forward to any later stage, back one
 * stage to correct a mistake, or to cancelled (with a reason). Reopening a
 * cancelled booking goes back to "booked".
 */
export async function setBookingStatus(id, status, { user, reason = "", scope = {} }) {
  if (!BOOKING_STATUS[status]) throw new UserError("Unknown status.");

  const out = await transaction(async (conn) => {
    const b = await lockBooking(conn, id, scope);
    if (b.status === status) return { booking: b, changed: false };

    const patch = {};
    const params = { updated_by: user?.id ?? null };

    if (status === "cancelled") {
      if (!text(reason, 300)) throw new UserError("Say why the booking is being cancelled.");
      patch.cancelled_at = "UTC_TIMESTAMP()";
      params.cancel_reason = text(reason, 300);
      if (!["collected"].includes(b.collection_status)) params.collection_status = "cancelled";
    } else if (b.status === "cancelled") {
      if (status !== "booked" && status !== "confirmed") throw new UserError("Reopen a cancelled booking as Booked or Confirmed first.");
      patch.cancelled_at = "NULL";
      params.cancel_reason = "";
      if (b.collection_status === "cancelled") params.collection_status = b.collector_id ? "assigned" : "unassigned";
    } else {
      const from = stageIndex(b.status);
      const to = stageIndex(status);
      if (to < from - 1) throw new UserError("A booking can only be moved back one step at a time.");
      if (to >= stageIndex("report_ready") && from < stageIndex("report_ready")) {
        const [[r]] = await conn.execute(
          "SELECT COUNT(*) AS n FROM reports WHERE booking_id = ? AND status IN ('uploaded','verified','sent')",
          [b.id]
        );
        if (!Number(r.n)) throw new UserError("Upload the report before marking it ready.");
      }
      if (status === "collection_assigned" && !b.collector_id) throw new UserError("Assign a collector first.");
      Object.assign(patch, stageEffects(b, status));
    }

    params.status = status;
    await applyRaw(conn, b.id, patch, params);
    if (stageIndex(status) >= stageIndex("sample_received")) await setReportDue(conn, b.id);

    await logActivity({
      conn,
      user,
      action: "status",
      entity: "bookings",
      entityId: b.id,
      partnerId: b.partner_id,
      summary: `${bookingCode(b.id)}: ${BOOKING_STATUS[b.status].label} → ${BOOKING_STATUS[status].label}${reason ? ` (${text(reason, 120)})` : ""}`,
      before: { status: b.status },
      after: { status, ...(reason ? { reason } : {}) },
    });
    return { booking: b, changed: true };
  });

  if (out.changed) {
    const b = out.booking;
    if (status === "cancelled") {
      await notify({
        type: "booking.cancelled",
        title: `Booking ${bookingCode(b.id)} cancelled`,
        body: `${b.patient_name}${reason ? ` · ${text(reason, 120)}` : ""}`,
        link: `/crm/bookings/${b.id}`,
        perm: "bookings.view",
        severity: "warning",
      });
      if (b.partner_id) {
        await notify({ type: "booking.cancelled", title: `Order ${bookingCode(b.id)} cancelled`, link: `/crm/bookings/${b.id}`, partnerId: b.partner_id, severity: "warning" });
      }
      if (b.collector_id) {
        await notify({ type: "booking.cancelled", title: `Collection ${bookingCode(b.id)} cancelled`, link: `/crm/collections`, userId: b.collector_id, severity: "warning" });
      }
    }
    if (status === "sample_collected") {
      await notify({ type: "sample.collected", title: `Sample collected · ${bookingCode(b.id)}`, body: b.patient_name, link: `/crm/bookings/${b.id}`, perm: "bookings.view", severity: "success" });
    }
  }
  return out;
}

/** Edit the booking's details (not its workflow state). Staff only. */
export async function updateBooking(id, input, { user }) {
  return transaction(async (conn) => {
    const b = await lockBooking(conn, id);
    if (b.status === "cancelled") throw new UserError("Reopen the booking before editing it.");

    const phone = cleanPhone(input.phone ?? b.patient_phone);
    if (!validPhone(phone)) throw new UserError("Enter a valid 10-digit mobile number.");

    const next = {
      patient_name: text(input.name ?? b.patient_name, 80),
      patient_phone: phone,
      alt_phone: text(input.altPhone ?? b.alt_phone, 15),
      age: input.age === undefined ? b.age : Number(input.age) > 0 && Number(input.age) < 130 ? Math.round(Number(input.age)) : null,
      gender: input.gender === undefined ? b.gender : ["male", "female", "other"].includes(input.gender) ? input.gender : "",
      address: text(input.address ?? b.address, 400),
      city_id: input.cityId === undefined ? b.city_id : input.cityId ? Number(input.cityId) : null,
      city: input.cityId === undefined ? b.city : await resolveCityName(conn, input.cityId, input.city),
      area: text(input.area ?? b.area, 120),
      landmark: text(input.landmark ?? b.landmark, 160),
      source: input.source && SOURCE[input.source] ? input.source : b.source,
      collection_date: input.collectionDate === undefined ? b.collection_date : ymd(input.collectionDate),
      collection_slot: text(input.collectionSlot ?? b.collection_slot, 40),
      payment_mode: input.paymentMode === undefined ? b.payment_mode : paymentModeOr(input.paymentMode, ""),
      notes: text(input.notes ?? b.notes, 2000),
      partner_notes: text(input.partnerNotes ?? b.partner_notes, 1000),
    };
    if (!next.patient_name) throw new UserError("Enter the patient's name.");

    let totals = null;
    if (Array.isArray(input.items)) {
      const priced = await priceItems(input.items, { partnerId: b.partner_id, allowOverride: true, conn });
      await writeItems(conn, b.id, priced.lines);
      totals = priced;
    }
    const subtotal = totals ? totals.subtotal : Number(b.subtotal);
    const discount = Math.min(input.discount === undefined ? Number(b.discount) : money(input.discount), subtotal);
    const fee = input.collectionFee === undefined ? Number(b.collection_fee) : money(input.collectionFee);
    Object.assign(next, {
      subtotal,
      discount,
      collection_fee: fee,
      final_amount: Math.max(0, Math.round((subtotal - discount + fee) * 100) / 100),
      partner_cost: totals ? totals.partnerCost : Number(b.partner_cost),
      updated_by: user?.id ?? null,
    });

    const changed = Object.keys(next).filter(
      (k) => k !== "updated_by" && String(b[k] instanceof Date ? ymdOf(b[k]) : b[k] ?? "") !== String(next[k] ?? "")
    );
    const sets = Object.keys(next).map((k) => `${k} = ?`).join(", ");
    await conn.execute(`UPDATE bookings SET ${sets} WHERE id = ?`, [...Object.values(next), b.id]);
    await recomputeBookingPayment(conn, b.id);

    if (changed.length || totals) {
      await logActivity({
        conn,
        user,
        action: "update",
        entity: "bookings",
        entityId: b.id,
        partnerId: b.partner_id,
        summary: `Edited ${bookingCode(b.id)}: ${[...changed, ...(totals ? ["tests"] : [])].filter((v, i, a) => a.indexOf(v) === i).join(", ")}`,
        before: Object.fromEntries(changed.map((k) => [k, b[k]])),
        after: Object.fromEntries(changed.map((k) => [k, next[k]])),
      });
    }
    return { id: b.id };
  });
}

const ymdOf = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d);

/** Assign (or reassign / clear) the home-collection staff member. */
export async function assignCollector(id, { collectorId, date, slot }, { user }) {
  const out = await transaction(async (conn) => {
    const b = await lockBooking(conn, id);
    if (b.status === "cancelled") throw new UserError("This booking is cancelled.");
    if (["collected"].includes(b.collection_status)) throw new UserError("The sample has already been collected.");

    let collector = null;
    if (collectorId) {
      const [[u]] = await conn.execute(
        "SELECT id, name, role FROM admin_users WHERE id = ? AND status = 'active'",
        [Number(collectorId)]
      );
      if (!u || u.role === "partner") throw new UserError("Pick an active staff member.");
      collector = u;
    }

    const params = {
      collector_id: collector?.id ?? null,
      collection_status: collector ? "assigned" : "unassigned",
      updated_by: user?.id ?? null,
    };
    if (date !== undefined) params.collection_date = ymd(date) ?? ymdOf(b.collection_date) ?? null;
    if (slot !== undefined && slot !== null) params.collection_slot = text(slot, 40) || b.collection_slot;
    if (collector && stageIndex(b.status) < stageIndex("collection_assigned")) params.status = "collection_assigned";
    if (!collector && b.status === "collection_assigned") params.status = "confirmed";

    await applyRaw(conn, b.id, {}, params);
    await logActivity({
      conn,
      user,
      action: "assign",
      entity: "bookings",
      entityId: b.id,
      partnerId: b.partner_id,
      summary: collector
        ? `Assigned collection of ${bookingCode(b.id)} to ${collector.name}`
        : `Removed collector from ${bookingCode(b.id)}`,
      before: { collector_id: b.collector_id },
      after: { collector_id: collector?.id ?? null, collection_date: params.collection_date, collection_slot: params.collection_slot },
    });
    return { b, collector };
  });

  if (out.collector && out.collector.id !== out.b.collector_id) {
    await notify({
      type: "collection.assigned",
      title: `New collection · ${bookingCode(out.b.id)}`,
      body: `${out.b.patient_name} · ${out.b.area || out.b.city}`,
      link: "/crm/collections",
      userId: out.collector.id,
    });
  }
  return { ok: true };
}

/** Send a booking to a lab partner (or clear it). The partner must accept. */
export async function assignPartner(id, { partnerId }, { user }) {
  const out = await transaction(async (conn) => {
    const b = await lockBooking(conn, id);
    if (b.status === "cancelled") throw new UserError("This booking is cancelled.");
    if (stageIndex(b.status) >= stageIndex("report_ready")) throw new UserError("The report is already in — the lab can no longer be changed.");

    let partner = null;
    if (partnerId) {
      const [[p]] = await conn.execute("SELECT id, name, status FROM partners WHERE id = ?", [Number(partnerId)]);
      if (!p || p.status !== "active") throw new UserError("Pick an active lab partner.");
      partner = p;
    }

    // Partner cost follows the partner: re-price the lines from their list.
    const [items] = await conn.execute(
      "SELECT test_id, name, qty, unit_price, partner_cost FROM booking_items WHERE booking_id = ? AND status = 'active'",
      [b.id]
    );
    let partnerCost = 0;
    for (const it of items) {
      let cost = Number(it.partner_cost);
      if (it.test_id) {
        const [[row]] = await conn.execute(
          `SELECT COALESCE(${partner ? "(SELECT price FROM partner_prices WHERE partner_id = ? AND test_id = t.id)" : "NULL"}, t.partner_price, 0) AS cost
           FROM lab_tests t WHERE t.id = ?`,
          partner ? [partner.id, it.test_id] : [it.test_id]
        );
        if (row) cost = Number(row.cost);
        await conn.execute(
          "UPDATE booking_items SET partner_cost = ? WHERE booking_id = ? AND test_id = ? AND status = 'active'",
          [cost, b.id, it.test_id]
        );
      }
      partnerCost += cost * Number(it.qty);
    }

    await applyRaw(
      conn,
      b.id,
      partner ? { partner_assigned_at: "UTC_TIMESTAMP()", partner_responded_at: "NULL" } : { partner_assigned_at: "NULL", partner_responded_at: "NULL" },
      {
        partner_id: partner?.id ?? null,
        partner_status: partner ? "pending" : "unassigned",
        partner_reject_reason: "",
        partner_cost: Math.round(partnerCost * 100) / 100,
        updated_by: user?.id ?? null,
      }
    );

    await logActivity({
      conn,
      user,
      action: "assign",
      entity: "bookings",
      entityId: b.id,
      partnerId: partner?.id ?? b.partner_id,
      summary: partner ? `Assigned ${bookingCode(b.id)} to ${partner.name}` : `Removed lab from ${bookingCode(b.id)}`,
      before: { partner_id: b.partner_id },
      after: { partner_id: partner?.id ?? null },
    });
    return { b, partner };
  });

  if (out.partner && out.partner.id !== out.b.partner_id) {
    await notify({
      type: "partner.order",
      title: `New order ${bookingCode(out.b.id)}`,
      body: "Accept or reject it from your orders.",
      link: `/crm/bookings/${out.b.id}`,
      partnerId: out.partner.id,
      severity: "warning",
    });
  }
  return { ok: true };
}

/** A partner accepts or rejects an order sent to them. */
export async function partnerRespond(id, { accept, reason = "" }, { user, scope }) {
  const out = await transaction(async (conn) => {
    const b = await lockBooking(conn, id, scope);
    if (b.partner_status !== "pending") throw new UserError("This order has already been answered.");
    if (!accept && !text(reason, 300)) throw new UserError("Say why you cannot take this order.");

    await applyRaw(
      conn,
      b.id,
      { partner_responded_at: "UTC_TIMESTAMP()" },
      { partner_status: accept ? "accepted" : "rejected", partner_reject_reason: accept ? "" : text(reason, 300) }
    );
    await logActivity({
      conn,
      user,
      action: accept ? "accept" : "reject",
      entity: "bookings",
      entityId: b.id,
      partnerId: b.partner_id,
      summary: `${user?.name || "Partner"} ${accept ? "accepted" : "rejected"} ${bookingCode(b.id)}${accept ? "" : ` (${text(reason, 120)})`}`,
      before: { partner_status: b.partner_status },
      after: { partner_status: accept ? "accepted" : "rejected" },
    });
    return b;
  });

  await notify({
    type: accept ? "partner.accepted" : "partner.rejected",
    title: `${accept ? "Lab accepted" : "Lab rejected"} ${bookingCode(out.id)}`,
    body: accept ? out.patient_name : `Reassign it · ${text(reason, 120)}`,
    link: `/crm/bookings/${out.id}`,
    perm: "bookings.assign",
    severity: accept ? "success" : "danger",
  });
  return { ok: true };
}

/**
 * The lab's own progress: sample received, processing. Partner-scoped when
 * called from the partner portal; staff may call it too.
 */
export async function labProgress(id, stage, { user, scope = {}, note = "" }) {
  if (!["sample_received", "processing"].includes(stage)) throw new UserError("Unknown step.");
  const out = await transaction(async (conn) => {
    const b = await lockBooking(conn, id, scope);
    if (scope.partnerId && b.partner_status !== "accepted") throw new UserError("Accept the order first.");
    if (b.status === "cancelled") throw new UserError("This booking is cancelled.");
    if (stageIndex(b.status) >= stageIndex(stage)) throw new UserError("Already done.");

    const patch = stageEffects(b, stage);
    await applyRaw(conn, b.id, patch, {
      status: stage,
      updated_by: user?.id ?? null,
      ...(note ? { partner_notes: text(`${b.partner_notes}\n${note}`.trim(), 1000) } : {}),
    });
    await setReportDue(conn, b.id);
    await logActivity({
      conn,
      user,
      action: "status",
      entity: "bookings",
      entityId: b.id,
      partnerId: b.partner_id,
      summary: `${user?.name || "Lab"} marked ${bookingCode(b.id)} ${BOOKING_STATUS[stage].label.toLowerCase()}`,
      before: { status: b.status },
      after: { status: stage },
    });
    return b;
  });

  if (stage === "sample_received") {
    await notify({
      type: "sample.received",
      title: `Lab received sample · ${bookingCode(out.id)}`,
      body: out.patient_name,
      link: `/crm/bookings/${out.id}`,
      perm: "bookings.view",
      severity: "success",
    });
  }
  return { ok: true };
}

/**
 * The collector's buttons: confirmed, on the way, arrived, collected, failed.
 * Collector-scoped (only their own); staff with collections.manage may too.
 */
export async function updateCollection(id, status, { user, scope = {}, note = "" }) {
  if (!COLLECTION_STATUS[status] || ["unassigned", "assigned", "cancelled"].includes(status)) {
    throw new UserError("Unknown collection step.");
  }
  if (status === "failed" && !text(note, 500)) throw new UserError("Say why the collection failed.");

  const out = await transaction(async (conn) => {
    const b = await lockBooking(conn, id, scope);
    if (b.status === "cancelled") throw new UserError("This booking is cancelled.");
    if (b.collection_status === "collected" && status !== "collected") throw new UserError("Already collected.");
    if (!b.collector_id) throw new UserError("Assign a collector first.");

    const patch = {};
    const params = { collection_status: status, updated_by: user?.id ?? null };
    if (status === "arrived") patch.arrived_at = "UTC_TIMESTAMP()";
    if (note) params.collection_note = text(note, 500);
    if (status === "collected") {
      Object.assign(patch, stageEffects(b, "sample_collected"));
      patch.collected_at = "UTC_TIMESTAMP()";
      if (stageIndex(b.status) < stageIndex("sample_collected")) params.status = "sample_collected";
    }
    await applyRaw(conn, b.id, patch, params);
    await logActivity({
      conn,
      user,
      action: "collection",
      entity: "bookings",
      entityId: b.id,
      partnerId: b.partner_id,
      summary: `${user?.name || "Collector"} marked ${bookingCode(b.id)} ${COLLECTION_STATUS[status].label.toLowerCase()}${note ? ` — ${text(note, 100)}` : ""}`,
      before: { collection_status: b.collection_status },
      after: { collection_status: status },
    });
    return b;
  });

  if (status === "collected") {
    await notify({ type: "sample.collected", title: `Sample collected · ${bookingCode(out.id)}`, body: out.patient_name, link: `/crm/bookings/${out.id}`, perm: "bookings.view", severity: "success" });
    if (out.partner_id) {
      await notify({ type: "sample.collected", title: `Sample on its way · ${bookingCode(out.id)}`, link: `/crm/bookings/${out.id}`, partnerId: out.partner_id });
    }
  }
  if (status === "failed") {
    await notify({ type: "collection.failed", title: `Collection failed · ${bookingCode(out.id)}`, body: text(note, 160), link: `/crm/bookings/${out.id}`, perm: "bookings.view", severity: "danger" });
  }
  return { ok: true };
}

/* ── Payments on a booking ────────────────────────────────────────────── */

/** Record money received against a booking. */
export async function recordPayment(bookingId, input, { user, scope = {} }) {
  const amount = money(input.amount);
  if (!(amount > 0)) throw new UserError("Enter the amount received.");
  const mode = paymentModeOr(input.mode, null);
  if (!mode) throw new UserError("Pick how it was paid.");
  const status = ["paid", "pending", "failed"].includes(input.status) ? input.status : "paid";

  const out = await transaction(async (conn) => {
    const b = await lockBooking(conn, bookingId, scope);
    const [res] = await conn.execute(
      `INSERT INTO payments (booking_id, customer_id, amount, mode, status, reference, collected_by, received_at, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, UTC_TIMESTAMP()), ?, ?)`,
      [
        b.id,
        b.customer_id,
        amount,
        mode,
        status,
        text(input.reference, 120),
        input.collectedBy ? Number(input.collectedBy) : user?.id ?? null,
        input.receivedAt ? String(input.receivedAt).replace("T", " ").slice(0, 19) : null,
        text(input.notes, 500),
        user?.id ?? null,
      ]
    );
    const before = { payment_status: b.payment_status, paid_amount: b.paid_amount };
    const after = await recomputeBookingPayment(conn, b.id);
    if (!b.payment_mode) await conn.execute("UPDATE bookings SET payment_mode = ? WHERE id = ?", [mode, b.id]);

    await logActivity({
      conn,
      user,
      action: "payment",
      entity: "bookings",
      entityId: b.id,
      summary: `Recorded ₹${amount.toLocaleString("en-IN")} ${mode.toUpperCase().replace("_", " ")} (${status}) on ${bookingCode(b.id)} · payment ${before.payment_status} → ${after.status}`,
      before,
      after: { payment_id: res.insertId, amount, mode, status, payment_status: after.status },
    });
    return { b, paymentId: res.insertId, after };
  });

  await notify({
    type: status === "failed" ? "payment.failed" : "payment.received",
    title: status === "failed" ? `Payment failed · ${bookingCode(out.b.id)}` : `Payment received ₹${amount.toLocaleString("en-IN")}`,
    body: `${out.b.patient_name} · ${mode.toUpperCase().replace("_", " ")}`,
    link: `/crm/bookings/${out.b.id}`,
    perm: "payments.view",
    severity: status === "failed" ? "danger" : "success",
  });
  return { ok: true, paymentId: out.paymentId };
}

/** Change one payment's status (e.g. pending → paid, or void a mistake). */
export async function setPaymentStatus(paymentId, status, { user, reason = "" }) {
  if (!["paid", "pending", "failed", "void"].includes(status)) throw new UserError("Unknown status.");
  return transaction(async (conn) => {
    const [[p]] = await conn.execute("SELECT * FROM payments WHERE id = ? FOR UPDATE", [Number(paymentId) || 0]);
    if (!p) throw new UserError("That payment was not found.");
    if (p.gateway_payment_id && status !== "paid") {
      throw new UserError("A verified online payment cannot be changed here. Record a refund instead.");
    }
    if (status === "void" && !text(reason, 300)) throw new UserError("Say why this payment is being voided.");
    await conn.execute("UPDATE payments SET status = ?, notes = CONCAT(notes, ?) WHERE id = ?", [
      status,
      reason ? ` [${status}: ${text(reason, 200)}]` : "",
      p.id,
    ]);
    const after = p.booking_id ? await recomputeBookingPayment(conn, p.booking_id) : null;
    await logActivity({
      conn,
      user,
      action: "payment",
      entity: "payments",
      entityId: p.id,
      summary: `Changed payment PAY${p.id} (₹${Number(p.amount).toLocaleString("en-IN")}) ${p.status} → ${status}${reason ? ` — ${text(reason, 100)}` : ""}${p.booking_id ? ` · ${bookingCode(p.booking_id)}` : ""}`,
      before: { status: p.status },
      after: { status, booking_payment_status: after?.status },
    });
    return { ok: true };
  });
}

/* ── Soft delete ──────────────────────────────────────────────────────── */

/** Remove a booking from every list. Owner only (checked by the caller). Reversible. */
export async function archiveBooking(id, { user, restore = false }) {
  const [[b]] = await query("SELECT id, patient_name, deleted_at FROM bookings WHERE id = ?", [Number(id) || 0]);
  if (!b) throw new UserError("That booking was not found.");
  await query(`UPDATE bookings SET deleted_at = ${restore ? "NULL" : "UTC_TIMESTAMP()"} WHERE id = ?`, [b.id]);
  await logActivity({
    user,
    action: restore ? "restore" : "delete",
    entity: "bookings",
    entityId: b.id,
    summary: `${restore ? "Restored" : "Deleted"} booking ${bookingCode(b.id)} (${b.patient_name})`,
  });
  return { ok: true };
}

/* ── Notes ────────────────────────────────────────────────────────────── */

/**
 * A dated, attributed note on any CRM record (booking, customer, lead,
 * partner). Stored in admin_notes — the table the website admin already uses
 * for notes on leads and orders — so there is one notes history, not two.
 * `internal` notes on a booking are hidden from its lab partner.
 */
export async function addNote(entity, entityId, body, { user, scope = {}, partnerId = null }) {
  const text = String(body ?? "").trim().slice(0, 2000);
  if (!text) throw new UserError("The note is empty.");
  if (entity === "booking" && (scope.partnerId || scope.collectorId)) {
    await transaction((conn) => lockBooking(conn, entityId, scope)); // throws if not theirs
  }
  await query(
    "INSERT INTO admin_notes (entity, entity_id, body, user_id, user_email) VALUES (?, ?, ?, ?, ?)",
    [entity, String(entityId), text, user?.id ?? null, user?.email ?? ""]
  );
  await logActivity({
    user,
    action: "note",
    entity: entity === "booking" ? "bookings" : `${entity}s`,
    entityId,
    partnerId,
    summary: `Note: ${text.slice(0, 160)}`,
  });
  return { ok: true };
}

export async function listNotes(entity, entityId) {
  const [rows] = await query(
    `SELECT n.id, n.body, n.user_email, n.created_at, u.name AS user_name, u.role AS user_role
     FROM admin_notes n LEFT JOIN admin_users u ON u.id = n.user_id
     WHERE n.entity = ? AND n.entity_id = ? AND n.status = 'active' ORDER BY n.id DESC LIMIT 100`,
    [entity, String(entityId)]
  );
  return rows;
}
