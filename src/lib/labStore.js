/**
 * Everything the lab section writes to MySQL, in one place. Server only.
 *
 * The API routes stay about HTTP — parsing, validating, answering — and call
 * these for the database side. Tables are described in src/lib/dbSchema.js.
 */
import { LAB_CITIES } from "@/data/lab/cities";
import { MAX_QTY } from "@/lib/labCart";

import { transaction } from "./db";
import { getCatalog } from "./testCatalog";

/**
 * The price list, from MySQL (see src/lib/testCatalog.js). Every city shares
 * one list. `fresh: true` skips the 30s memo — checkout uses it so it always
 * charges the price in the database right now.
 */
export const getTests = async ({ fresh = false } = {}) => (await getCatalog({ fresh })).tests;

/** The city whose price list a page shows: /lab-test/<slug>, else none. */
export const cityForPath = (path) => {
  const slug = /^\/lab-test\/([^/?#]+)/.exec(String(path ?? ""))?.[1];
  return slug ? LAB_CITIES.find((c) => c.slug === slug)?.name ?? null : null;
};

export const CART_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** Create the cart row on its first tap; later taps just touch it. */
async function upsertCart(conn, { cartId, city, path }) {
  await conn.execute(
    `INSERT INTO carts (id, city, page_path) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
       city = COALESCE(VALUES(city), city),
       page_path = VALUES(page_path),
       status = IF(status = 'checked_out', status, 'active')`,
    [cartId, city, path]
  );
}

/**
 * One tap in the cart: add, +, −, remove. `qty` is the new quantity (0 =
 * removed), `from` the quantity the browser showed before the tap. The
 * action is named here from those two, not taken from the request.
 */
export async function recordCartChange({ cartId, testId, from, qty, seq, path }) {
  const city = cityForPath(path);
  const test = (await getTests()).find((t) => t.id === testId);
  if (!test) return { ok: false, error: "Unknown test." };

  const before = Math.min(MAX_QTY, Math.max(0, Math.floor(Number(from) || 0)));
  const after = Math.min(MAX_QTY, Math.max(0, Math.floor(Number(qty) || 0)));
  const action =
    after === 0 ? "remove" : before === 0 ? "add" : after > before ? "increment" : "decrement";

  await transaction(async (conn) => {
    await upsertCart(conn, { cartId, city, path });

    // Only a LATER tap may overwrite the row (see `seq` in dbSchema.js). MySQL
    // applies SET clauses left to right, so qty is compared against the old seq.
    await conn.execute(
      `INSERT INTO cart_items (cart_id, test_id, test_name, unit_price, qty, seq)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         qty = IF(VALUES(seq) > seq, VALUES(qty), qty),
         test_name = VALUES(test_name),
         unit_price = VALUES(unit_price),
         seq = GREATEST(seq, VALUES(seq))`,
      [cartId, testId, test.name, test.price ?? null, after, seq]
    );

    await conn.execute(
      `INSERT INTO cart_events (cart_id, test_id, action, qty_before, qty_after, page_path)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [cartId, testId, action, before, after, path]
    );
  });

  return { ok: true, action };
}

/** The visitor emptied the cart. */
export async function recordCartClear({ cartId, seq, path }) {
  await transaction(async (conn) => {
    await upsertCart(conn, { cartId, city: cityForPath(path), path });
    await conn.execute(
      "UPDATE cart_items SET qty = 0, seq = ? WHERE cart_id = ? AND seq < ?",
      [seq, cartId, seq]
    );
    await conn.execute("UPDATE carts SET status = 'cleared' WHERE id = ?", [cartId]);
    await conn.execute(
      "INSERT INTO cart_events (cart_id, action, page_path) VALUES (?, 'clear', ?)",
      [cartId, path]
    );
  });
  return { ok: true };
}

/** Close a cart once an order was placed from it. Runs inside the order's transaction. */
async function checkoutCart(conn, cartId) {
  if (!cartId) return;
  // The cart row may not exist if every tap failed to reach us — skip quietly.
  const [res] = await conn.execute(
    "UPDATE carts SET status = 'checked_out' WHERE id = ?",
    [cartId]
  );
  if (res.affectedRows) {
    await conn.execute(
      "INSERT INTO cart_events (cart_id, action) VALUES (?, 'checkout')",
      [cartId]
    );
  }
}

const cartIdOrNull = (id) => (CART_ID.test(String(id ?? "")) ? String(id) : null);

async function insertLead(conn, lead, { cartId = null, source = "form" } = {}) {
  const [res] = await conn.execute(
    `INSERT INTO leads (cart_id, source, name, phone, city, address, test)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [cartIdOrNull(cartId), source, lead.name, lead.phone, lead.city, lead.address ?? "", (lead.test ?? "").slice(0, 400)]
  );
  return res.insertId;
}

/** A plain enquiry form (hero card, booking modal, popup). */
export const recordLead = (lead) => transaction((conn) => insertLead(conn, lead));

async function insertOrder(conn, { cartId, leadId, customer, bill, priceListCity, method, status, razorpayOrderId }) {
  const [res] = await conn.execute(
    `INSERT INTO orders
       (cart_id, lead_id, payment_method, status, customer_name, customer_phone,
        customer_city, customer_address, price_list_city, amount, mrp_total, razorpay_order_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      cartIdOrNull(cartId), leadId ?? null, method, status, customer.name, customer.phone,
      customer.city, customer.address ?? "", priceListCity ?? null, bill.total, bill.mrpTotal,
      razorpayOrderId ?? null,
    ]
  );
  const orderId = res.insertId;

  for (const l of bill.lines) {
    await conn.execute(
      `INSERT INTO order_items (order_id, test_id, test_name, qty, unit_price, unit_mrp, line_total)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, l.id, l.name, l.qty, l.price, l.mrp, l.lineTotal]
    );
  }
  return orderId;
}

/**
 * "Pay at home collection": the lead and a pending order, together. `bill`
 * is priceCart() run on the server's price list.
 */
export const recordCodOrder = ({ cartId, lead, customer, bill, priceListCity }) =>
  transaction(async (conn) => {
    const leadId = await insertLead(conn, lead, { cartId, source: "cart_cod" });
    const orderId = await insertOrder(conn, {
      cartId, leadId, customer, bill, priceListCity, method: "cod", status: "pending_collection",
    });
    await checkoutCart(conn, cartId);
    return { leadId, orderId };
  });

/** A Razorpay order was created; the payment has not happened yet. */
export const recordOnlineOrder = ({ cartId, customer, bill, priceListCity, razorpayOrderId }) =>
  transaction((conn) =>
    insertOrder(conn, {
      cartId, customer, bill, priceListCity, method: "online", status: "created", razorpayOrderId,
    })
  );

/**
 * The payment signature checked out. Marks the order paid, saves its lead and
 * closes its cart. Idempotent: a second call for the same payment changes
 * nothing, so a retried /verify cannot create a duplicate lead.
 */
export const markOrderPaid = ({ razorpayOrderId, paymentId, lead }) =>
  transaction(async (conn) => {
    const [rows] = await conn.execute(
      "SELECT id, cart_id, lead_id, status FROM orders WHERE razorpay_order_id = ? FOR UPDATE",
      [razorpayOrderId]
    );
    const order = rows[0];
    if (!order) {
      // Order row missing (DB was down at /order time): keep the lead anyway.
      return { leadId: await insertLead(conn, lead, { source: "cart_online" }), orderId: null };
    }
    if (order.status === "paid") return { leadId: order.lead_id, orderId: order.id };

    const leadId = await insertLead(conn, lead, { cartId: order.cart_id, source: "cart_online" });
    await conn.execute(
      `UPDATE orders SET status = 'paid', razorpay_payment_id = ?, paid_at = UTC_TIMESTAMP(), lead_id = ?
       WHERE id = ?`,
      [paymentId, leadId, order.id]
    );
    await checkoutCart(conn, order.cart_id);
    return { leadId, orderId: order.id };
  });
