/**
 * Customers. Server only.
 *
 * One row per 10-digit phone number — the phone is how a patient is
 * recognised on a call, on WhatsApp and on the website form alike, so it is
 * the natural key and it is UNIQUE. A website booking, a phone booking and a
 * walk-in from the same number all land on the same profile.
 */
import { query, transaction } from "@/lib/db";

import { logActivity } from "../activity";
import { OPEN_STATUSES } from "../constants";
import { dateRangeOf } from "../filters";
import { UserError } from "../guard";

export const cleanPhone = (value) => String(value ?? "").replace(/\D/g, "").slice(-10);
export const validPhone = (value) => /^[6-9]\d{9}$/.test(cleanPhone(value));

const text = (value, max) => String(value ?? "").trim().slice(0, max);
const age = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 && n < 130 ? Math.round(n) : null;
};
const gender = (value) => (["male", "female", "other"].includes(value) ? value : "");

/**
 * Find-or-create by phone, inside the caller's transaction.
 *
 * On an existing customer only BLANK fields are filled from `input`, unless
 * `overwrite` is set (a staff edit of the profile itself). A website booking
 * for "Papa" from the daughter's phone must not rename the account holder —
 * the booking keeps its own patient name for that.
 */
export async function upsertCustomer(conn, input, { user = null, overwrite = false, source = "website" } = {}) {
  const phone = cleanPhone(input.phone);
  if (!validPhone(phone)) throw new UserError("Enter a valid 10-digit mobile number.");

  const fields = {
    name: text(input.name, 80),
    alt_phone: text(input.alt_phone ?? input.altPhone, 15),
    email: text(input.email, 160).toLowerCase(),
    age: age(input.age),
    gender: gender(input.gender),
    address: text(input.address, 400),
    city_id: input.city_id ?? input.cityId ?? null,
    city: text(input.city, 80),
    area: text(input.area, 120),
    landmark: text(input.landmark, 160),
  };

  const [rows] = await conn.execute("SELECT * FROM customers WHERE phone = ? FOR UPDATE", [phone]);
  const existing = rows[0];

  if (!existing) {
    if (!fields.name) throw new UserError("Enter the customer's name.");
    const [res] = await conn.execute(
      `INSERT INTO customers (phone, alt_phone, name, email, age, gender, address, city_id, city, area, landmark, source, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        phone, fields.alt_phone, fields.name, fields.email, fields.age, fields.gender, fields.address,
        fields.city_id, fields.city, fields.area, fields.landmark, String(source).slice(0, 20), user?.id ?? null,
      ]
    );
    return { id: res.insertId, created: true };
  }

  const patch = {};
  for (const [key, value] of Object.entries(fields)) {
    const empty = value === "" || value === null || value === undefined;
    if (empty) continue;
    const current = existing[key];
    const currentEmpty = current === "" || current === null || current === undefined;
    if ((overwrite || currentEmpty) && String(current ?? "") !== String(value)) patch[key] = value;
  }
  if (existing.status === "deleted") {
    patch.status = "active";
    patch.deleted_at = null;
  }

  if (Object.keys(patch).length) {
    const sets = Object.keys(patch).map((k) => `${k} = ?`).join(", ");
    await conn.execute(`UPDATE customers SET ${sets} WHERE id = ?`, [...Object.values(patch), existing.id]);
  }
  return { id: existing.id, created: false, patch };
}

export async function getCustomerByPhone(phone) {
  const [rows] = await query("SELECT * FROM customers WHERE phone = ? LIMIT 1", [cleanPhone(phone)]);
  return rows[0] ?? null;
}

/** Staff edit of a profile. */
export async function updateCustomer(id, input, { user }) {
  const [rows] = await query("SELECT * FROM customers WHERE id = ? LIMIT 1", [Number(id) || 0]);
  const before = rows[0];
  if (!before) throw new UserError("That customer no longer exists.");

  const phone = cleanPhone(input.phone ?? before.phone);
  if (!validPhone(phone)) throw new UserError("Enter a valid 10-digit mobile number.");
  if (phone !== before.phone) {
    const [dupe] = await query("SELECT id FROM customers WHERE phone = ? AND id <> ?", [phone, before.id]);
    if (dupe.length) throw new UserError("Another customer already has that mobile number.");
  }
  const name = text(input.name, 80);
  if (!name) throw new UserError("Enter the customer's name.");

  const after = {
    phone,
    name,
    alt_phone: text(input.alt_phone, 15),
    email: text(input.email, 160).toLowerCase(),
    age: age(input.age),
    gender: gender(input.gender),
    address: text(input.address, 400),
    city_id: input.city_id ? Number(input.city_id) : null,
    city: text(input.city, 80),
    area: text(input.area, 120),
    landmark: text(input.landmark, 160),
    notes: text(input.notes, 2000),
  };

  const sets = Object.keys(after).map((k) => `${k} = ?`).join(", ");
  await query(`UPDATE customers SET ${sets} WHERE id = ?`, [...Object.values(after), before.id]);

  const changed = Object.keys(after).filter((k) => String(before[k] ?? "") !== String(after[k] ?? ""));
  if (changed.length) {
    await logActivity({
      user,
      action: "update",
      entity: "customers",
      entityId: before.id,
      summary: `Updated customer ${name}: ${changed.join(", ")}`,
      before: Object.fromEntries(changed.map((k) => [k, before[k]])),
      after: Object.fromEntries(changed.map((k) => [k, after[k]])),
    });
  }
  return { id: before.id };
}

/* ── The CRM's customer screens ───────────────────────────────────────────
   Everything below is read by /crm/customers and the `customers` export.
   Money on a profile comes from the bookings' payment cache (paid_amount /
   refunded_amount, kept by recomputeBookingPayment), so the list, the
   profile and the booking screen always agree on "total spent". */

const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";
const like = (value) => `%${String(value).replace(/[%_]/g, "\\$&")}%`;
const OPEN_BOOKING = `(${OPEN_STATUSES.map((s) => `'${s}'`).join(",")})`;

/** URL → customer filters. Shared by the list page and the export. */
export function customerFiltersFrom(sp) {
  const r = dateRangeOf(sp);
  const sort = one(sp.sort);
  return {
    from: r?.from ?? null,
    to: r?.to ?? null,
    rangeLabel: r?.label ?? null,
    cityId: Number(one(sp.city)) || null,
    pending: one(sp.pending) === "1",
    search: text(one(sp.q), 80),
    sort: ["newest", "spent", "bookings", "last"].includes(sort) ? sort : "newest",
  };
}

const CUSTOMER_SORTS = {
  newest: "c.created_at DESC, c.id DESC",
  spent: "total_spent DESC, c.id DESC",
  bookings: "bookings_count DESC, c.id DESC",
  last: "last_booking IS NULL, last_booking DESC",
};

function customerWhere(f) {
  const where = ["c.status = 'active'"];
  const params = [];
  if (f.from) {
    where.push("c.created_at >= ?");
    params.push(f.from);
  }
  if (f.to) {
    where.push("c.created_at < ?");
    params.push(f.to);
  }
  if (f.cityId) {
    where.push("c.city_id = ?");
    params.push(f.cityId);
  }
  if (f.pending) {
    where.push(`EXISTS (SELECT 1 FROM bookings pb WHERE pb.customer_id = c.id AND pb.deleted_at IS NULL AND pb.status IN ${OPEN_BOOKING})`);
  }
  if (f.search) {
    const q = f.search;
    const digits = q.replace(/\D/g, "");
    const code = /^\s*cu\s*0*(\d+)\s*$/i.exec(q);
    const ors = ["c.name LIKE ?", "c.email LIKE ?"];
    params.push(like(q), like(q));
    if (code) {
      ors.push("c.id = ?");
      params.push(Number(code[1]));
    }
    if (digits.length >= 4) {
      ors.push("c.phone LIKE ?", "c.alt_phone LIKE ?");
      params.push(like(digits), like(digits));
    }
    where.push(`(${ors.join(" OR ")})`);
  }
  return { sql: `WHERE ${where.join(" AND ")}`, params };
}

// Correlated per-row figures (index idx_bookings_customer); the page is 25 rows.
const PER_CUSTOMER = (col) => `(SELECT ${col} FROM bookings b WHERE b.customer_id = c.id AND b.deleted_at IS NULL)`;

export async function listCustomers(filters = {}) {
  const w = customerWhere(filters);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 25));
  const offset = Math.max(0, Number(filters.offset) || 0);
  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT c.*, sc.name AS city_name,
              ${PER_CUSTOMER("COUNT(*)")} AS bookings_count,
              ${PER_CUSTOMER(`COALESCE(SUM(b.status IN ${OPEN_BOOKING}), 0)`)} AS pending_bookings,
              ${PER_CUSTOMER("MAX(b.created_at)")} AS last_booking,
              ${PER_CUSTOMER("COALESCE(SUM(b.paid_amount - b.refunded_amount), 0)")} AS total_spent
       FROM customers c
       LEFT JOIN service_cities sc ON sc.id = c.city_id
       ${w.sql}
       ORDER BY ${CUSTOMER_SORTS[filters.sort] ?? CUSTOMER_SORTS.newest}
       LIMIT ${limit} OFFSET ${offset}`,
      w.params
    ),
    query(`SELECT COUNT(*) AS n FROM customers c ${w.sql}`, w.params),
  ]);
  return { rows, total: Number(count.n), limit, offset };
}

/** A profile with its headline figures. */
export async function getCustomer(id) {
  const [rows] = await query(
    `SELECT c.*, sc.name AS city_name, cb.name AS created_by_name
     FROM customers c
     LEFT JOIN service_cities sc ON sc.id = c.city_id
     LEFT JOIN admin_users cb ON cb.id = c.created_by
     WHERE c.id = ? LIMIT 1`,
    [Number(id) || 0]
  );
  const c = rows[0];
  if (!c) return null;
  const [[[s]], [[t]]] = await Promise.all([
    query(
      `SELECT COUNT(*) AS bookings,
              COALESCE(SUM(b.status IN ${OPEN_BOOKING}), 0) AS open_bookings,
              MAX(b.created_at) AS last_booking,
              COALESCE(SUM(b.paid_amount - b.refunded_amount), 0) AS spent,
              COALESCE(SUM(CASE WHEN b.status <> 'cancelled' THEN GREATEST(b.final_amount - b.paid_amount + b.refunded_amount, 0) END), 0) AS pending_amount,
              COALESCE(SUM(b.refunded_amount), 0) AS refunded
       FROM bookings b WHERE b.customer_id = ? AND b.deleted_at IS NULL`,
      [c.id]
    ),
    query(
      `SELECT COALESCE(SUM(i.qty), 0) AS tests FROM booking_items i JOIN bookings b ON b.id = i.booking_id
       WHERE b.customer_id = ? AND b.deleted_at IS NULL AND b.status <> 'cancelled' AND i.status = 'active'`,
      [c.id]
    ),
  ]);
  return {
    ...c,
    stats: {
      bookings: Number(s.bookings),
      openBookings: Number(s.open_bookings),
      lastBooking: s.last_booking,
      spent: Number(s.spent),
      pendingAmount: Number(s.pending_amount),
      refunded: Number(s.refunded),
      tests: Number(t.tests),
    },
  };
}

/**
 * A new customer typed in by staff. The phone is the key: if it is already
 * on file, nothing is written and `{ existingId }` comes back so the form can
 * link to that profile instead.
 */
export async function createCustomer(input, { user }) {
  const phone = cleanPhone(input.phone);
  if (!validPhone(phone)) throw new UserError("Enter a valid 10-digit mobile number.");
  if (!text(input.name, 80)) throw new UserError("Enter the customer's name.");
  const existing = await getCustomerByPhone(phone);
  // A soft-deleted profile on the number is brought back by upsertCustomer below.
  if (existing && existing.status !== "deleted") return { existingId: existing.id, existingName: existing.name };

  return transaction(async (conn) => {
    let city = text(input.city, 80);
    const cityId = Number(input.city_id) || null;
    if (cityId) {
      const [[sc]] = await conn.execute("SELECT name FROM service_cities WHERE id = ?", [cityId]);
      city = sc?.name ?? city;
    }
    const res = await upsertCustomer(conn, { ...input, phone, city, city_id: cityId }, { user, overwrite: true, source: "offline" });
    const notes = text(input.notes, 2000);
    if (notes) await conn.execute("UPDATE customers SET notes = ? WHERE id = ?", [notes, res.id]);
    await logActivity({
      conn,
      user,
      action: res.created ? "create" : "update",
      entity: "customers",
      entityId: res.id,
      summary: `${res.created ? "Created" : "Updated"} customer ${text(input.name, 80)} (${phone})`,
      after: { phone, name: text(input.name, 80), city, area: text(input.area, 120) },
    });
    return { id: res.id };
  });
}

/** Payments and refunds across all of a customer's bookings. */
export async function customerMoney(id) {
  const cid = Number(id) || 0;
  const [[payments], [refunds]] = await Promise.all([
    query(
      `SELECT pm.*, u.name AS collected_by_name
       FROM payments pm
       LEFT JOIN bookings b ON b.id = pm.booking_id
       LEFT JOIN admin_users u ON u.id = pm.collected_by
       WHERE pm.customer_id = ? OR b.customer_id = ?
       ORDER BY pm.received_at DESC, pm.id DESC LIMIT 200`,
      [cid, cid]
    ),
    query(
      `SELECT r.* FROM refunds r JOIN bookings b ON b.id = r.booking_id
       WHERE b.customer_id = ? ORDER BY r.id DESC LIMIT 100`,
      [cid]
    ),
  ]);
  return { payments, refunds };
}

/** Every live report file on the customer's bookings, newest first. */
export async function customerReports(id) {
  const [rows] = await query(
    `SELECT r.id, r.booking_id, r.file_id, r.version, r.status, r.uploaded_at, r.sent_at, r.sent_via,
            f.filename, f.mime, f.bytes, p.name AS partner_name,
            (SELECT GROUP_CONCAT(i.name ORDER BY i.id SEPARATOR ' + ') FROM booking_items i
              WHERE i.booking_id = b.id AND i.status = 'active') AS items_label
     FROM reports r
     JOIN bookings b ON b.id = r.booking_id
     JOIN crm_files f ON f.id = r.file_id AND f.status = 'active'
     LEFT JOIN partners p ON p.id = COALESCE(r.partner_id, b.partner_id)
     WHERE b.customer_id = ? AND b.deleted_at IS NULL AND r.status IN ('uploaded','verified','sent')
     ORDER BY r.uploaded_at DESC, r.id DESC LIMIT 200`,
    [Number(id) || 0]
  );
  return rows;
}

export async function customerBookingIds(id) {
  const [rows] = await query("SELECT id FROM bookings WHERE customer_id = ? AND deleted_at IS NULL ORDER BY id DESC LIMIT 200", [Number(id) || 0]);
  return rows.map((r) => r.id);
}

/** Notifications raised about the customer's bookings. */
export async function customerNotifications(bookingIds) {
  const ids = bookingIds.map(Number).filter(Boolean).slice(0, 200);
  if (!ids.length) return [];
  const links = ids.map((b) => `/crm/bookings/${b}`);
  const [rows] = await query(
    `SELECT id, type, title, body, link, severity, created_at FROM notifications
     WHERE audience = 'staff' AND link IN (${links.map(() => "?").join(",")})
     ORDER BY id DESC LIMIT 60`,
    links
  );
  return rows;
}

/**
 * The raw material of a customer's journey: enquiries, bookings (with their
 * collection / lab / report / delivery stamps), calls, reports sent,
 * payments and refunds. The profile page merges them into one timeline.
 */
export async function customerJourney(customer) {
  const cid = Number(customer.id) || 0;
  const [[bookings], [calls], [reports], [payments], [leads], [refunds]] = await Promise.all([
    query(
      `SELECT b.id, b.created_at, b.source, b.status, b.final_amount, b.collected_at, b.sample_received_at,
              b.report_ready_at, b.delivered_at, b.cancelled_at, b.cancel_reason, p.name AS partner_name,
              (SELECT GROUP_CONCAT(i.name ORDER BY i.id SEPARATOR ' + ') FROM booking_items i
                WHERE i.booking_id = b.id AND i.status = 'active') AS items_label
       FROM bookings b LEFT JOIN partners p ON p.id = b.partner_id
       WHERE b.customer_id = ? AND b.deleted_at IS NULL ORDER BY b.id DESC LIMIT 100`,
      [cid]
    ),
    query(
      `SELECT c.id, c.lead_id, c.direction, c.outcome, c.duration_sec, c.notes, c.called_at, u.name AS user_name
       FROM calls c LEFT JOIN admin_users u ON u.id = c.user_id
       WHERE c.customer_id = ? OR c.phone = ? ORDER BY c.called_at DESC LIMIT 100`,
      [cid, customer.phone]
    ),
    query(
      `SELECT r.id, r.booking_id, r.version, r.sent_at, r.sent_via
       FROM reports r JOIN bookings b ON b.id = r.booking_id
       WHERE b.customer_id = ? AND b.deleted_at IS NULL AND r.sent_at IS NOT NULL LIMIT 200`,
      [cid]
    ),
    query(
      `SELECT pm.id, pm.booking_id, pm.amount, pm.mode, pm.status, pm.received_at
       FROM payments pm LEFT JOIN bookings b ON b.id = pm.booking_id
       WHERE (pm.customer_id = ? OR b.customer_id = ?) AND pm.status IN ('paid','pending') LIMIT 200`,
      [cid, cid]
    ),
    query(
      `SELECT id, created_at, channel, test, interested_package FROM leads
       WHERE deleted_at IS NULL AND (customer_id = ? OR phone = ?) ORDER BY id DESC LIMIT 50`,
      [cid, customer.phone]
    ),
    query(
      `SELECT r.id, r.booking_id, r.amount, r.processed_at FROM refunds r JOIN bookings b ON b.id = r.booking_id
       WHERE b.customer_id = ? AND r.status = 'processed' AND r.processed_at IS NOT NULL LIMIT 100`,
      [cid]
    ),
  ]);
  return { bookings, calls, reports, payments, leads, refunds };
}
