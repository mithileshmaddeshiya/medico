import { validateLead } from "@/components/lab/leadForm";
import { priceCart, summariseLines } from "@/lib/labCart";
import { getTests, recordOnlineOrder } from "@/lib/labStore";
import { createOrder, razorpayConfigured, razorpayKeyId } from "@/lib/razorpay";

/**
 * Starts an online payment for a cart.
 *
 * The browser sends test ids and quantities only. The amount is worked out
 * HERE, from the price list in MySQL as it is right now, and that is the
 * amount the Razorpay order is created for — so the checkout widget can only
 * ever charge what the price list says.
 *
 * The patient's details ride along as order notes. That way the booking is
 * visible in the Razorpay dashboard even if the confirmation step after
 * payment never reaches us (closed tab, dropped network).
 *
 * The order and its priced lines are also saved to MySQL with status
 * "created"; /api/checkout/verify flips it to "paid". An order still "created"
 * later on is a payment window that was opened and never completed.
 */

const MAX = { name: 80, city: 80, address: 400 };
const clean = (value, max) => String(value ?? "").trim().slice(0, max);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const customer = {
    name: clean(body?.customer?.name, MAX.name),
    phone: clean(body?.customer?.phone, 10),
    city: clean(body?.customer?.city, MAX.city),
    address: clean(body?.customer?.address, MAX.address),
  };

  const problem = validateLead(customer);
  if (problem) {
    return Response.json({ ok: false, error: problem.message }, { status: 400 });
  }

  const priceListCity = clean(body?.city, MAX.city) || null;
  const cart = priceCart(body?.items, await getTests({ fresh: true }));
  if (cart.lines.length === 0) {
    return Response.json(
      { ok: false, error: "Your cart is empty — please add a test first." },
      { status: 400 }
    );
  }

  if (!razorpayConfigured()) {
    console.error("[checkout] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set");
    return Response.json(
      {
        ok: false,
        error: "Online payment is unavailable right now. Choose pay at home collection, or call us.",
      },
      { status: 503 }
    );
  }

  const summary = summariseLines(cart.lines);

  try {
    const order = await createOrder({
      amount: cart.total,
      receipt: `mb_${Date.now()}`,
      notes: {
        name: customer.name,
        phone: customer.phone,
        city: customer.city,
        // Razorpay rejects any note value over 256 characters, and the
        // checkout now collects a full address (up to 400). The full text is
        // saved with the order in MySQL (recordOnlineOrder below); the note
        // only has to be enough for the lead built in /verify.
        address: (customer.address || "—").slice(0, 250),
        // Same 256-character note limit: a long cart would otherwise stop the
        // payment from starting. The priced lines themselves are in MySQL.
        tests: summary.slice(0, 250),
      },
    });

    try {
      await recordOnlineOrder({
        cartId: body?.cartId,
        customer,
        bill: cart,
        priceListCity,
        razorpayOrderId: order.id,
      });
    } catch (err) {
      // The payment can still go ahead: /verify saves the lead even without
      // this row, and Razorpay holds the order either way.
      console.error("[checkout] Razorpay order created but not saved to MySQL", err);
    }

    return Response.json({
      ok: true,
      keyId: razorpayKeyId(),
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      summary,
    });
  } catch (err) {
    console.error("[checkout] could not create the Razorpay order", err);
    return Response.json(
      { ok: false, error: "Could not start the payment. Please try again or call us." },
      { status: 502 }
    );
  }
}
