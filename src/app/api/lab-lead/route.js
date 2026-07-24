import { firebaseConfig } from "@/lib/firebaseConfig";
import { notifyOwnerOnWhatsapp } from "@/lib/notifyWhatsapp";

/**
 * Receives a booking from the lab enquiry form.
 *
 * The form used to call `window.open("https://wa.me/…")`, which threw the
 * patient out of the site into WhatsApp and only *hoped* they pressed send. If
 * they cancelled, the booking was gone and we never knew it existed.
 *
 * Now the browser POSTs here, the lead is written to Firestore straight away,
 * and the patient stays on the page. Nothing depends on them having WhatsApp.
 *
 * The owner notification is best-effort and deliberately cannot fail the
 * request: if WhatsApp is misconfigured or Meta is down, the lead is already
 * saved and can be worked from the Firestore console.
 */

const FIRESTORE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

// Caps so a scripted POST cannot write megabytes into the collection.
const MAX = { name: 80, city: 80, address: 400, test: 120 };

const clean = (value, max) => String(value ?? "").trim().slice(0, max);

function validate(body) {
  const name = clean(body.name, MAX.name);
  const city = clean(body.city, MAX.city);
  const phone = clean(body.phone, 10);
  const address = clean(body.address, MAX.address);
  const test = clean(body.test, MAX.test);

  // Mirrors the client-side checks. The browser's copy is for fast feedback;
  // this one is the copy that actually decides.
  if (name.length < 2) return { error: "Please enter your name." };
  if (!city) return { error: "Please select your city." };
  if (!/^[6-9]\d{9}$/.test(phone))
    return { error: "Please enter a valid 10-digit Indian mobile number." };
  // Address is optional — kept if given, but not required to book. The team
  // confirms the full address on the follow-up call.

  return { lead: { name, city, phone, address, test } };
}

async function saveLead(lead) {
  const body = {
    fields: {
      name: { stringValue: lead.name },
      phone: { stringValue: lead.phone },
      city: { stringValue: lead.city },
      address: { stringValue: lead.address },
      test: { stringValue: lead.test || "" },
      status: { stringValue: "new" },
      createdAt: { timestampValue: new Date().toISOString() },
    },
  };

  // POST (not PATCH) so Firestore allocates the document id — two people
  // booking in the same second cannot overwrite each other.
  const response = await fetch(
    `${FIRESTORE}/labLeads?key=${firebaseConfig.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Firestore write failed: ${response.status} ${await response.text()}`
    );
  }

  return response.json();
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { error, lead } = validate(body);
  if (error) return Response.json({ ok: false, error }, { status: 400 });

  try {
    await saveLead(lead);
  } catch (err) {
    console.error("[lab-lead] could not save the booking", err);
    return Response.json(
      { ok: false, error: "Could not save your request. Please call us instead." },
      { status: 502 }
    );
  }

  // Saved is saved. A failed notification must not tell the patient to book
  // again — that would create duplicate leads for the same person. The booking
  // is already in Firestore and can be worked from there.
  try {
    const result = await notifyOwnerOnWhatsapp(lead);
    if (!result.provider) {
      console.warn(
        "[lab-lead] saved, but no WhatsApp gateway is configured — see src/lib/notifyWhatsapp.js"
      );
    }
  } catch (err) {
    console.error("[lab-lead] saved, but the WhatsApp notification failed", err);
  }

  return Response.json({ ok: true });
}
