import { CART_ID, recordCartChange, recordCartClear } from "@/lib/labStore";

/**
 * Records one cart tap in MySQL (carts / cart_items / cart_events).
 *
 * The browser's cart still lives in localStorage and never waits on this — the
 * store in src/components/lab/cart/cartStore.js fires it and moves on. So a
 * failure here is logged and answered, but can never break the cart.
 *
 * Body: { cartId, seq, path, testId, from, qty }  — a change to one test
 *       { cartId, seq, path, action: "clear" }     — the cart was emptied
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const cartId = String(body?.cartId ?? "");
  const seq = Number(body?.seq);
  const path = String(body?.path ?? "").slice(0, 255) || null;

  if (!CART_ID.test(cartId) || !Number.isSafeInteger(seq) || seq < 0) {
    return Response.json({ ok: false, error: "Invalid cart." }, { status: 400 });
  }

  try {
    const result =
      body?.action === "clear"
        ? await recordCartClear({ cartId, seq, path })
        : await recordCartChange({
            cartId,
            seq,
            path,
            testId: String(body?.testId ?? "").slice(0, 80),
            from: body?.from,
            qty: body?.qty,
          });
    return Response.json(result, { status: result.ok ? 200 : 400 });
  } catch (err) {
    console.error("[cart] could not record the cart change", err);
    return Response.json({ ok: false, error: "Not saved." }, { status: 502 });
  }
}
