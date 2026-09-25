import { firebaseConfig } from "@/lib/firebaseConfig";
import { notifyOwnerOnWhatsapp } from "@/lib/notifyWhatsapp";
import { markOrderPaid } from "@/lib/labStore";
import { syncFromWebsite } from "@/lib/crm/sync";
import { fetchOrder, verifyPaymentSignature } from "@/lib/razorpay";

/**
 * Confirms a payment the checkout widget reports as successful.
 *
 * The widget's callback runs in the browser, so on its own it proves nothing.
 * The signature check below is what turns it into a fact. After that, the
 * booking details are read back from the Razorpay ORDER (written by
 * /api/checkout/order), not from this request — the amount and the tests on the
 * saved lead are what was actually charged.
 *
 * The lead goes into the same `labLeads` collection, with the same fields, as
 * a form booking (see src/app/api/lab-lead/route.js), so the team works paid
 * and unpaid bookings from one list. The payment is spelled out in `test`.
 *
 * In MySQL the order saved by /api/checkout/order is marked paid, the lead is
 * saved and linked to it, and the cart is closed (src/lib/labStore.js).
 */

const FIRESTORE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

const inr = (paise) => `₹${(Number(paise) / 100).toLocaleString("en-IN")}`;

async function saveLead(lead) {
  const response = await fetch(`${FIRESTORE}/labLeads?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        name: { stringValue: lead.name },
        phone: { stringValue: lead.phone },
        city: { stringValue: lead.city },
        address: { stringValue: lead.address },
        test: { stringValue: lead.test },
        status: { stringValue: "new" },
        createdAt: { timestampValue: new Date().toISOString() },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Firestore write failed: ${response.status} ${await response.text()}`);
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const orderId = String(body?.orderId ?? "");
  const paymentId = String(body?.paymentId ?? "");
  const signature = String(body?.signature ?? "");

  if (!verifyPaymentSignature({ orderId, paymentId, signature })) {
    return Response.json(
      { ok: false, error: "We could not verify this payment. If money was deducted, please call us." },
      { status: 400 }
    );
  }

  // Verified: the patient has paid. Nothing below may turn that into an error
  // on their screen — a failed save is logged, and the payment and its notes
  // are still in the Razorpay dashboard to work from.
  try {
    const order = await fetchOrder(orderId);
    const notes = order.notes ?? {};

    const lead = {
      name: String(notes.name ?? ""),
      phone: String(notes.phone ?? ""),
      city: String(notes.city ?? ""),
      address: String(notes.address ?? ""),
      test: `PAID ONLINE ${inr(order.amount)} · ${notes.tests ?? ""} · ${paymentId}`.slice(0, 400),
    };

    const [firestore, mysql] = await Promise.allSettled([
      saveLead(lead),
      markOrderPaid({ razorpayOrderId: orderId, paymentId, lead }),
    ]);
    if (firestore.status === "rejected") {
      console.error(`[checkout] payment ${paymentId}: Firestore did not save the lead`, firestore.reason);
    }
    if (mysql.status === "rejected") {
      console.error(`[checkout] payment ${paymentId}: MySQL did not record it`, mysql.reason);
    } else {
      // Booking + verified payment into the CRM. Never throws.
      await syncFromWebsite(mysql.value);
    }

    try {
      await notifyOwnerOnWhatsapp(lead);
    } catch (err) {
      console.error("[checkout] saved, but the WhatsApp notification failed", err);
    }
  } catch (err) {
    console.error(`[checkout] payment ${paymentId} verified but the booking was not saved`, err);
  }

  return Response.json({ ok: true, paymentId });
}
