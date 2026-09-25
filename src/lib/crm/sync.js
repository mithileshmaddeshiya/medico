/**
 * Website → CRM. Server only.
 *
 * The public site keeps writing exactly what it always wrote — leads, orders,
 * order_items (src/lib/labStore.js). This file turns those rows into CRM
 * records: a customer, a booking with its items, a payment for a verified
 * online payment, and a notification.
 *
 * ── WHY AFTER, NOT INSIDE, THE WEBSITE'S TRANSACTION ─────────────────────
 * A patient's booking must never fail because the CRM could not write. So the
 * website saves first, on its own; then the route calls the hooks below, which
 * swallow and log their own errors. If a hook never ran (the CRM tables were
 * missing, the function timed out), syncPending() catches the order up later:
 * it is called on every CRM dashboard load and every pulse, throttled.
 *
 * Everything here is idempotent: bookings.order_id and payments.
 * gateway_payment_id are UNIQUE, and each step checks before it writes, so
 * running a sync twice changes nothing the second time.
 */
import { query, transaction } from "@/lib/db";

import { logActivity, notify } from "./activity";
import { bookingCode } from "./constants";
import { insertBooking, recomputeBookingPayment } from "./stores/bookings";
import { upsertCustomer, validPhone } from "./stores/customers";
import { ensureCitiesSeeded } from "./stores/lookups";

/** Match a free-text city from the website to an operational city. */
async function cityIdFor(conn, name) {
  const clean = String(name ?? "").trim();
  if (!clean) return null;
  const [rows] = await conn.execute(
    "SELECT id FROM service_cities WHERE (name = ? OR slug = ?) AND status <> 'deleted' LIMIT 1",
    [clean, clean.toLowerCase().replace(/[^a-z0-9]+/g, "-")]
  );
  return rows[0]?.id ?? null;
}

/**
 * Create (or bring up to date) the booking for one website order.
 * Only orders that are real bookings are synced: paid online, or pay-at-
 * collection. An online order still at "created" is an abandoned checkout.
 */
export async function syncOrder(orderId) {
  const [[order]] = await query("SELECT * FROM orders WHERE id = ?", [Number(orderId) || 0]);
  if (!order) return null;
  if (!["paid", "pending_collection", "cancelled", "refunded"].includes(order.status)) return null;

  const [[existing]] = await query("SELECT id, status FROM bookings WHERE order_id = ?", [order.id]);
  if (existing) return reconcile(order, existing);
  if (["cancelled", "refunded"].includes(order.status)) return null; // never became work

  if (!validPhone(order.customer_phone)) {
    console.warn(`[crm/sync] order ${order.id} has an invalid phone; not synced`);
    return null;
  }

  const bookingId = await transaction(async (conn) => {
    // Re-check under the transaction: two syncs racing for the same order.
    const [[again]] = await conn.execute("SELECT id FROM bookings WHERE order_id = ? FOR UPDATE", [order.id]);
    if (again) return again.id;

    const cityId = await cityIdFor(conn, order.customer_city);
    const customer = await upsertCustomer(
      conn,
      { phone: order.customer_phone, name: order.customer_name, address: order.customer_address, city: order.customer_city, city_id: cityId },
      { source: "website" }
    );

    const [items] = await conn.execute(
      `SELECT i.*, t.partner_price, t.is_package FROM order_items i
       LEFT JOIN lab_tests t ON t.id = i.test_id WHERE i.order_id = ? ORDER BY i.id`,
      [order.id]
    );
    const lines = items.map((i) => ({
      test_id: i.test_id,
      name: i.test_name,
      is_package: i.is_package ? 1 : 0,
      qty: Number(i.qty),
      unit_price: Number(i.unit_price),
      unit_mrp: Number(i.unit_mrp),
      partner_cost: Number(i.partner_price ?? 0),
      line_total: Number(i.line_total),
    }));
    const subtotal = Math.round(lines.reduce((s, l) => s + l.line_total, 0) * 100) / 100;
    // The order's amount is the truth of what was charged; anything above the
    // lines is the home-collection fee (see insertOrder in src/lib/labStore.js).
    const fee = Math.max(0, Math.round((Number(order.amount) - subtotal) * 100) / 100);

    const id = await insertBooking(conn, {
      customerId: customer.id,
      leadId: order.lead_id,
      orderId: order.id,
      patient: {
        name: order.customer_name,
        phone: order.customer_phone,
        address: order.customer_address,
        cityId,
        city: order.customer_city,
      },
      source: "website",
      priced: { lines, subtotal, partnerCost: lines.reduce((s, l) => s + l.partner_cost * l.qty, 0) },
      discount: 0,
      collectionFee: fee,
      paymentMode: order.payment_method === "online" ? "online" : "cash",
      status: "booked",
      createdAt: order.created_at,
      notes: order.payment_method === "cod" ? "Website booking · pay at collection" : "Website booking · paid online",
    });

    if (order.lead_id) {
      await conn.execute(
        "UPDATE leads SET booking_id = ?, customer_id = ?, channel = 'website', status = IF(status IN ('new','contacted','follow_up'), 'booked', status) WHERE id = ?",
        [id, customer.id, order.lead_id]
      );
    }

    await logActivity({
      conn,
      user: null,
      action: "create",
      entity: "bookings",
      entityId: id,
      summary: `New website booking ${bookingCode(id)} · ${order.customer_name} (${order.payment_method === "online" ? "paid online" : "pay at collection"})`,
      after: { order_id: order.id, amount: order.amount },
    });
    return id;
  });

  await notify({
    type: "booking.new",
    title: `New website booking ${bookingCode(bookingId)}`,
    body: `${order.customer_name} · ${order.customer_city} · ₹${Number(order.amount).toLocaleString("en-IN")}`,
    link: `/crm/bookings/${bookingId}`,
    perm: "bookings.view",
  });

  return reconcile(order, { id: bookingId });
}

/** Payment and cancellation state from the order, onto the booking. */
async function reconcile(order, booking) {
  if (order.status === "paid" && order.razorpay_payment_id) {
    const inserted = await transaction(async (conn) => {
      const [[has]] = await conn.execute("SELECT id FROM payments WHERE gateway_payment_id = ?", [order.razorpay_payment_id]);
      if (has) return false;
      const [[b]] = await conn.execute("SELECT customer_id FROM bookings WHERE id = ? FOR UPDATE", [booking.id]);
      await conn.execute(
        `INSERT INTO payments (booking_id, customer_id, amount, mode, status, reference, gateway_payment_id, received_at, notes)
         VALUES (?, ?, ?, 'online', 'paid', ?, ?, COALESCE(?, UTC_TIMESTAMP()), 'Razorpay — verified signature')`,
        [booking.id, b?.customer_id ?? null, order.amount, order.razorpay_order_id ?? "", order.razorpay_payment_id, order.paid_at]
      );
      await recomputeBookingPayment(conn, booking.id);
      await logActivity({
        conn,
        user: null,
        action: "payment",
        entity: "bookings",
        entityId: booking.id,
        summary: `Online payment ₹${Number(order.amount).toLocaleString("en-IN")} verified for ${bookingCode(booking.id)}`,
        after: { gateway_payment_id: order.razorpay_payment_id },
      });
      return true;
    });
    if (inserted) {
      await notify({
        type: "payment.online",
        title: `Online payment ₹${Number(order.amount).toLocaleString("en-IN")}`,
        body: `${order.customer_name} · ${bookingCode(booking.id)}`,
        link: `/crm/bookings/${booking.id}`,
        perm: "payments.view",
        severity: "success",
      });
    }
  }

  // Cancelled on the website side (from the admin orders screen): reflect it,
  // but never un-cancel or overwrite work already done in the CRM.
  if (["cancelled", "refunded"].includes(order.status) && booking.status && !["cancelled", "completed"].includes(booking.status)) {
    await query(
      "UPDATE bookings SET status = 'cancelled', cancelled_at = UTC_TIMESTAMP(), cancel_reason = ? WHERE id = ? AND status <> 'cancelled'",
      [`Order ${order.status} on the website`, booking.id]
    );
    await logActivity({
      user: null,
      action: "status",
      entity: "bookings",
      entityId: booking.id,
      summary: `${bookingCode(booking.id)} cancelled — website order ${order.status}`,
      before: { status: booking.status },
      after: { status: "cancelled" },
    });
  }
  return booking.id;
}

/** A plain enquiry from a website form: link it to a known customer, ring the bell. */
export async function syncLead(leadId) {
  const [[lead]] = await query("SELECT id, name, phone, city, test, source FROM leads WHERE id = ?", [Number(leadId) || 0]);
  if (!lead) return;
  await query(
    "UPDATE leads l JOIN customers c ON c.phone = l.phone SET l.customer_id = c.id WHERE l.id = ? AND l.customer_id IS NULL",
    [lead.id]
  );
  if (lead.source === "form") {
    await notify({
      type: "lead.new",
      title: `New website lead · ${lead.name}`,
      body: [lead.city, lead.test].filter(Boolean).join(" · ").slice(0, 200),
      link: `/crm/leads/${lead.id}`,
      perm: "leads.view",
    });
  }
}

/**
 * Hook for the public routes. Pass whatever labStore returned:
 *   recordLead      → a lead id (number)
 *   recordCodOrder  → { leadId, orderId }
 *   markOrderPaid   → { leadId, orderId }
 * Never throws.
 */
export async function syncFromWebsite(result) {
  try {
    if (typeof result === "number" || typeof result === "bigint") {
      await syncLead(Number(result));
      return;
    }
    if (result?.orderId) await syncOrder(result.orderId);
    else if (result?.leadId) await syncLead(result.leadId);
  } catch (err) {
    console.error("[crm/sync] website → CRM sync failed; syncPending() will retry", err);
  }
}

/**
 * Catch up anything a hook missed: orders with no booking, and paid orders
 * whose payment never reached the booking. At most once a minute per server
 * process, 50 orders per pass. Never throws.
 */
export async function syncPending({ force = false } = {}) {
  const now = Date.now();
  if (!force && globalThis.__mbCrmSyncAt && now - globalThis.__mbCrmSyncAt < 60_000) return 0;
  globalThis.__mbCrmSyncAt = now;

  try {
    // Cities first, so a synced booking can be matched to its city.
    await ensureCitiesSeeded();
    const [rows] = await query(
      `SELECT o.id FROM orders o
       LEFT JOIN bookings b ON b.order_id = o.id
       WHERE (b.id IS NULL AND o.status IN ('paid','pending_collection'))
          OR (b.id IS NOT NULL AND o.status = 'paid' AND o.razorpay_payment_id IS NOT NULL
              AND NOT EXISTS (SELECT 1 FROM payments p WHERE p.gateway_payment_id = o.razorpay_payment_id))
          OR (b.id IS NOT NULL AND o.status IN ('cancelled','refunded') AND b.status NOT IN ('cancelled','completed'))
       ORDER BY o.id
       LIMIT 50`
    );
    for (const r of rows) {
      try {
        await syncOrder(r.id);
      } catch (err) {
        console.error(`[crm/sync] order ${r.id} did not sync`, err);
      }
    }
    return rows.length;
  } catch (err) {
    console.error("[crm/sync] catch-up pass failed", err);
    return 0;
  }
}
