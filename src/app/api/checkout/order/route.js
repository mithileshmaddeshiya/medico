import { validateLead } from "@/components/lab/leadForm";
import { LAB_CITIES } from "@/data/lab/cities";
import { defaultTests } from "@/data/lab/defaults";
import { priceCart, summariseLines } from "@/lib/labCart";
import { createOrder, razorpayConfigured, razorpayKeyId } from "@/lib/razorpay";

/**
 * Starts an online payment for a cart.
 *
 * The browser sends test ids and quantities only. The amount is worked out
 * HERE, from the server's own price list for the page's city, and that is the
 * amount the Razorpay order is created for — so the checkout widget can only
 * ever charge what the price list says.
 *
 * The patient's details ride along as order notes. That way the booking is
 * visible in the Razorpay dashboard even if the confirmation step after
 * payment never reaches us (closed tab, dropped network).
 */

const MAX = { name: 80, city: 80, address: 400 };
const clean = (value, max) => String(value ?? "").trim().slice(0, max);

/** The city page's own price list; the shared default everywhere else. */
const testsFor = (cityName) =>
  LAB_CITIES.find((c) => c.name === cityName)?.tests ?? defaultTests();

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

  const cart = priceCart(body?.items, testsFor(clean(body?.city, MAX.city)));
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
        address: customer.address || "—",
        tests: summary,
      },
    });

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
