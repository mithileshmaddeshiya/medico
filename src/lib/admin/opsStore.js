/**
 * Leads, orders and carts — the operational side of the panel. Server only.
 *
 * These are the only tables the panel reads that it did not create. They are
 * written by the public site (src/lib/labStore.js) and the rule here is
 * narrow on purpose: the panel may move a record through its workflow and
 * attach notes to it, and that is all. It may not edit a customer's phone
 * number, retype an address or change what an order was charged.
 *
 * ── WHY SO LITTLE IS EDITABLE ────────────────────────────────────────────
 * An order row is the record of what the server actually charged, priced from
 * the server's own list at the moment of checkout — see priceCart() in
 * src/lib/labCart.js and the comment in dbSchema.js about money being DECIMAL
 * rupees and never a float. If the panel could rewrite `amount`, the row would
 * stop being evidence of a transaction and start being someone's opinion of
 * one. Refunds and corrections belong in a status and a note, both of which
 * leave the original intact.
 *
 * Nothing is deleted. Archiving a lead sets status 'archived' — the person
 * still asked us to come to their house, and that is not ours to erase.
 */
import { query } from "@/lib/db";

import { audit } from "./audit";

/**
 * The lead pipeline, in order. `leads.status` is a free VARCHAR in the public
 * schema, so this list — not the column — is what defines the workflow.
 *
 * 'archived' is the soft-deleted state and is deliberately not offered as a
 * forward step; it is reached through the delete button.
 */
export const LEAD_STAGES = [
  { key: "new", label: "New", tone: "amber" },
  { key: "contacted", label: "Contacted", tone: "sky" },
  { key: "booked", label: "Booked", tone: "indigo" },
  { key: "collected", label: "Sample collected", tone: "violet" },
  { key: "done", label: "Report sent", tone: "emerald" },
  { key: "lost", label: "Lost", tone: "slate" },
];

export const ORDER_STATUSES = [
  { key: "created", label: "Awaiting payment", tone: "amber" },
  { key: "paid", label: "Paid", tone: "emerald" },
  { key: "pending_collection", label: "Pay at collection", tone: "sky" },
  { key: "failed", label: "Failed", tone: "rose" },
  { key: "cancelled", label: "Cancelled", tone: "slate" },
  { key: "refunded", label: "Refunded", tone: "violet" },
];

const like = (value) => `%${String(value).replace(/[%_]/g, "\\$&")}%`;

/* ── Leads ────────────────────────────────────────────────────────────────── */

export async function listLeads({
  status = null,
  city = null,
  source = null,
  search = "",
  from = null,
  to = null,
  includeArchived = false,
  limit = 50,
  offset = 0,
} = {}) {
  const where = [];
  const params = [];

  if (status) {
    where.push("l.status = ?");
    params.push(status);
  } else if (!includeArchived) {
    where.push("l.status <> 'archived'");
  }

  if (city) {
    where.push("l.city = ?");
    params.push(city);
  }
  if (source) {
    where.push("l.source = ?");
    params.push(source);
  }
  if (search) {
    where.push("(l.name LIKE ? OR l.phone LIKE ? OR l.test LIKE ? OR l.address LIKE ?)");
    params.push(like(search), like(search), like(search), like(search));
  }
  if (from) {
    where.push("l.created_at >= ?");
    params.push(`${from} 00:00:00`);
  }
  if (to) {
    where.push("l.created_at <= ?");
    params.push(`${to} 23:59:59`);
  }

  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT l.*, o.id AS order_id, o.amount, o.status AS order_status, o.payment_method,
              (SELECT COUNT(*) FROM admin_notes n
                WHERE n.entity = 'lead' AND n.entity_id = CAST(l.id AS CHAR) AND n.status = 'active') AS notes
       FROM leads l
       LEFT JOIN orders o ON o.lead_id = l.id
       ${clause}
       ORDER BY l.created_at DESC
       LIMIT ${Math.min(200, Number(limit) || 50)} OFFSET ${Math.max(0, Number(offset) || 0)}`,
      params
    ),
    query(`SELECT COUNT(*) AS n FROM leads l ${clause}`, params),
  ]);

  return { rows, total: Number(count.n) };
}

export async function leadCounts() {
  const [rows] = await query("SELECT status, COUNT(*) AS n FROM leads GROUP BY status");
  return Object.fromEntries(rows.map((r) => [r.status, Number(r.n)]));
}

export async function getLead(id) {
  const [[rows], [orders], [notes]] = await Promise.all([
    query("SELECT * FROM leads WHERE id = ? LIMIT 1", [Number(id) || 0]),
    query(
      `SELECT o.*, (SELECT JSON_ARRAYAGG(JSON_OBJECT(
           'name', i.test_name, 'qty', i.qty, 'price', i.unit_price, 'total', i.line_total))
         FROM order_items i WHERE i.order_id = o.id) AS items
       FROM orders o WHERE o.lead_id = ? ORDER BY o.id DESC`,
      [Number(id) || 0]
    ),
    query(
      `SELECT id, body, user_email, created_at FROM admin_notes
       WHERE entity = 'lead' AND entity_id = ? AND status = 'active' ORDER BY id DESC`,
      [String(id)]
    ),
  ]);

  const lead = rows[0];
  if (!lead) return null;
  return { ...lead, orders, notes };
}

/** Move a lead along the pipeline. The only field of a lead the panel writes. */
export async function setLeadStatus(id, status, { user } = {}) {
  const stage = LEAD_STAGES.find((s) => s.key === status);
  if (!stage && status !== "archived") return { ok: false, error: "Unknown stage." };

  const [rows] = await query("SELECT id, name, status FROM leads WHERE id = ? LIMIT 1", [
    Number(id) || 0,
  ]);
  const lead = rows[0];
  if (!lead) return { ok: false, error: "That lead no longer exists." };

  await query("UPDATE leads SET status = ?, deleted_at = NULL WHERE id = ?", [status, lead.id]);
  await audit({
    user,
    action: "update",
    entity: "leads",
    entityId: lead.id,
    summary: `${lead.name}: ${lead.status} → ${status}`,
    before: { status: lead.status },
    after: { status },
  });

  return { ok: true };
}

/** Who is chasing this lead, and when to call back. */
export async function setLeadFollowUp(id, { assignedTo = "", followUpOn = null }, { user } = {}) {
  await query("UPDATE leads SET assigned_to = ?, follow_up_on = ? WHERE id = ?", [
    String(assignedTo ?? "").slice(0, 80),
    followUpOn || null,
    Number(id) || 0,
  ]);
  await audit({
    user,
    action: "update",
    entity: "leads",
    entityId: id,
    summary: `assigned to ${assignedTo || "nobody"}${followUpOn ? `, call back ${followUpOn}` : ""}`,
  });
  return { ok: true };
}

/* ── Orders ───────────────────────────────────────────────────────────────── */

export async function listOrders({
  status = null,
  method = null,
  search = "",
  from = null,
  to = null,
  includeArchived = false,
  limit = 50,
  offset = 0,
} = {}) {
  const where = [];
  const params = [];

  if (status) {
    where.push("o.status = ?");
    params.push(status);
  } else if (!includeArchived) {
    where.push("o.status <> 'archived'");
  }

  if (method) {
    where.push("o.payment_method = ?");
    params.push(method);
  }
  if (search) {
    where.push("(o.customer_name LIKE ? OR o.customer_phone LIKE ? OR o.razorpay_order_id LIKE ? OR o.id = ?)");
    params.push(like(search), like(search), like(search), Number(search) || 0);
  }
  if (from) {
    where.push("o.created_at >= ?");
    params.push(`${from} 00:00:00`);
  }
  if (to) {
    where.push("o.created_at <= ?");
    params.push(`${to} 23:59:59`);
  }

  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT o.*, (SELECT COUNT(*) FROM order_items i WHERE i.order_id = o.id) AS line_count
       FROM orders o ${clause}
       ORDER BY o.created_at DESC
       LIMIT ${Math.min(200, Number(limit) || 50)} OFFSET ${Math.max(0, Number(offset) || 0)}`,
      params
    ),
    query(`SELECT COUNT(*) AS n FROM orders o ${clause}`, params),
  ]);

  return { rows, total: Number(count.n) };
}

export async function getOrder(id) {
  const [[rows], [items], [notes]] = await Promise.all([
    query("SELECT * FROM orders WHERE id = ? LIMIT 1", [Number(id) || 0]),
    query("SELECT * FROM order_items WHERE order_id = ? ORDER BY id", [Number(id) || 0]),
    query(
      `SELECT id, body, user_email, created_at FROM admin_notes
       WHERE entity = 'order' AND entity_id = ? AND status = 'active' ORDER BY id DESC`,
      [String(id)]
    ),
  ]);

  const order = rows[0];
  if (!order) return null;
  return { ...order, items, notes };
}

/**
 * Change an order's status.
 *
 * `paid` cannot be set by hand. A payment is proven by a verified Razorpay
 * signature and nothing else (see /api/checkout/verify) — an order marked paid
 * from a back office is a claim that money arrived with no evidence that it
 * did, and it is exactly the entry that turns a reconciliation into an
 * argument. Everything else is a legitimate operational call.
 */
export async function setOrderStatus(id, status, { user, reason = "" } = {}) {
  if (status === "paid") {
    return {
      ok: false,
      error:
        "An order can only be marked paid by a verified payment. Record what happened as a note instead.",
    };
  }
  if (!ORDER_STATUSES.some((s) => s.key === status) && status !== "archived") {
    return { ok: false, error: "Unknown status." };
  }

  const [rows] = await query("SELECT id, status, amount, customer_name FROM orders WHERE id = ?", [
    Number(id) || 0,
  ]);
  const order = rows[0];
  if (!order) return { ok: false, error: "That order no longer exists." };

  await query("UPDATE orders SET status = ?, deleted_at = NULL WHERE id = ?", [status, order.id]);
  await audit({
    user,
    action: "update",
    entity: "orders",
    entityId: order.id,
    summary: `#${order.id} ${order.status} → ${status}${reason ? ` (${reason})` : ""}`,
    before: { status: order.status },
    after: { status },
  });

  return { ok: true };
}

/* ── Carts ────────────────────────────────────────────────────────────────── */

/**
 * Carts that were filled and never checked out.
 *
 * This is the most directly useful list in the panel: somebody chose three
 * tests, saw the total and stopped. They are a warm lead with a known basket
 * and no phone number, which is what makes the cart_events trail worth keeping.
 */
export async function listCarts({ status = "active", limit = 50, offset = 0 } = {}) {
  const [rows] = await query(
    `SELECT c.*,
            (SELECT COUNT(*) FROM cart_items i WHERE i.cart_id = c.id AND i.qty > 0) AS items,
            (SELECT COALESCE(SUM(i.qty * i.unit_price), 0) FROM cart_items i
              WHERE i.cart_id = c.id AND i.qty > 0) AS value,
            (SELECT COUNT(*) FROM cart_events e WHERE e.cart_id = c.id) AS taps
     FROM carts c
     ${status ? "WHERE c.status = ?" : ""}
     ORDER BY c.updated_at DESC
     LIMIT ${Math.min(200, Number(limit) || 50)} OFFSET ${Math.max(0, Number(offset) || 0)}`,
    status ? [status] : []
  );

  return rows;
}

export async function getCart(id) {
  const [[carts], [items], [events]] = await Promise.all([
    query("SELECT * FROM carts WHERE id = ? LIMIT 1", [String(id)]),
    query("SELECT * FROM cart_items WHERE cart_id = ? ORDER BY updated_at DESC", [String(id)]),
    query("SELECT * FROM cart_events WHERE cart_id = ? ORDER BY id DESC LIMIT 100", [String(id)]),
  ]);

  const cart = carts[0];
  if (!cart) return null;
  return { ...cart, items, events };
}

/* ── Notes ────────────────────────────────────────────────────────────────── */

export async function addNote(entity, entityId, body, { user } = {}) {
  const text = String(body ?? "").trim().slice(0, 2000);
  if (!text) return { ok: false, error: "The note is empty." };

  await query(
    `INSERT INTO admin_notes (entity, entity_id, body, user_id, user_email)
     VALUES (?, ?, ?, ?, ?)`,
    [String(entity).slice(0, 40), String(entityId).slice(0, 120), text, user?.id ?? null, user?.email ?? ""]
  );

  await audit({ user, action: "create", entity: "admin_notes", entityId, summary: text.slice(0, 120) });
  return { ok: true };
}

/* ── Dashboard figures ────────────────────────────────────────────────────── */

/**
 * The numbers on the front page.
 *
 * Revenue counts `paid` orders only. A `pending_collection` order is money
 * somebody intends to hand over at the door, which is not the same thing and
 * must not be added to a figure labelled revenue — it is reported beside it,
 * named for what it is.
 */
export async function dashboardStats() {
  const [[leads], [orders], [carts], [topTests], [daily]] = await Promise.all([
    query(
      `SELECT COUNT(*) AS total,
              SUM(created_at >= CURDATE()) AS today,
              SUM(created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) AS week,
              SUM(status = 'new') AS untouched
       FROM leads WHERE status <> 'archived'`
    ),
    query(
      `SELECT COUNT(*) AS total,
              SUM(status = 'paid') AS paid,
              SUM(status = 'pending_collection') AS at_collection,
              COALESCE(SUM(CASE WHEN status = 'paid' THEN amount END), 0) AS revenue,
              COALESCE(SUM(CASE WHEN status = 'paid' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                                THEN amount END), 0) AS revenue_30d,
              COALESCE(SUM(CASE WHEN status = 'pending_collection' THEN amount END), 0) AS expected
       FROM orders WHERE status <> 'archived'`
    ),
    query(
      `SELECT SUM(status = 'active') AS open,
              SUM(status = 'checked_out') AS converted,
              SUM(status = 'active' AND updated_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 DAY)) AS stale
       FROM carts`
    ),
    query(
      `SELECT test_name, SUM(qty) AS qty, COUNT(DISTINCT order_id) AS orders
       FROM order_items GROUP BY test_name ORDER BY qty DESC LIMIT 8`
    ),
    query(
      `SELECT DATE(created_at) AS day, COUNT(*) AS leads
       FROM leads WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)
       GROUP BY DATE(created_at) ORDER BY day`
    ),
  ]);

  return {
    leads: leads[0],
    orders: orders[0],
    carts: carts[0],
    topTests,
    daily,
  };
}
