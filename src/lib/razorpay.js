/**
 * Razorpay, server side only.
 *
 * Talks to Razorpay's REST API with fetch instead of the `razorpay` npm SDK —
 * the two calls used here (create an order, read it back) do not justify a
 * dependency, and fetch keeps this runnable in any runtime Next picks.
 *
 * Keys come from the environment and nowhere else:
 *   RAZORPAY_KEY_ID      rzp_live_… / rzp_test_…
 *   RAZORPAY_KEY_SECRET  the matching secret
 *
 * Neither is NEXT_PUBLIC_. The key id is not secret — the checkout widget needs
 * it — but it is handed to the browser per order by /api/checkout/order, so the
 * id and secret are always a matching pair from one place. The secret must
 * never reach a client bundle: anyone holding it can create orders and forge
 * payment signatures.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

const API = "https://api.razorpay.com/v1";

const keys = () => ({
  id: process.env.RAZORPAY_KEY_ID ?? "",
  secret: process.env.RAZORPAY_KEY_SECRET ?? "",
});

export const razorpayConfigured = () => {
  const { id, secret } = keys();
  return Boolean(id && secret);
};

export const razorpayKeyId = () => keys().id;

async function call(path, init = {}) {
  const { id, secret } = keys();
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const reason = data?.error?.description || `HTTP ${response.status}`;
    throw new Error(`Razorpay ${path}: ${reason}`);
  }
  return data;
}

/**
 * Create an order. `amount` is in RUPEES here and converted to paise, so no
 * caller can be off by a factor of 100.
 *
 * Razorpay caps notes at 15 keys of 256 characters each; values are trimmed to
 * fit rather than failing the checkout over a long address.
 */
export function createOrder({ amount, receipt, notes = {} }) {
  const safeNotes = Object.fromEntries(
    Object.entries(notes)
      .slice(0, 15)
      .map(([k, v]) => [k, String(v ?? "").slice(0, 250)])
  );

  return call("/orders", {
    method: "POST",
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: String(receipt).slice(0, 40),
      notes: safeNotes,
    }),
  });
}

/** Read an order back — the source of truth for what was actually charged. */
export const fetchOrder = (orderId) =>
  call(`/orders/${encodeURIComponent(orderId)}`);

/**
 * Checkout's success callback is only a claim until this passes: the signature
 * is HMAC-SHA256 of "order_id|payment_id" under the key secret, and only
 * Razorpay and this server hold that secret.
 */
export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  const { secret } = keys();
  if (!secret || !orderId || !paymentId || !signature) return false;

  const expected = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && timingSafeEqual(a, b);
}
