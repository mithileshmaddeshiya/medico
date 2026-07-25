/**
 * Sends a booking to the shop's WhatsApp — without the patient ever leaving
 * the site.
 *
 * WhatsApp is a closed network: no server can just "send a WhatsApp". It has to
 * go through a gateway, and a gateway needs credentials. Three are supported,
 * and the first one configured wins. Configure none and this is a silent no-op —
 * the lead is still saved to Firestore either way.
 *
 * ── Option A: skwebtech (wa.skwebtech.in) — the one in use ──────────────
 *   SKWEBTECH_APIKEY       the JWT from the skwebtech dashboard
 *   SKWEBTECH_CAMPAIGN     optional; defaults to new_lab_test_booking
 *   SKWEBTECH_DESTINATION  optional; the number the alerts land on
 *
 *   A reseller in front of WhatsApp's own API, so the same template rules
 *   apply: the message body is fixed by an approved template and we only fill
 *   its variables. See sendViaSkwebtech for why the order matters.
 *
 *   The API key is a JWT and JWTs expire. The one issued on 24 Jul 2026 dies on
 *   31 Jul 2026 — a week. Nothing here can renew it; when notifications go
 *   quiet, that is the first thing to check (the server log says so plainly).
 *
 * ── Option B: Meta WhatsApp Cloud API (official) ────────────────────────
 *   WHATSAPP_TOKEN      permanent access token
 *   WHATSAPP_PHONE_ID   phone number id from the Meta app dashboard
 *   WHATSAPP_TEMPLATE   optional; the name of an approved template
 *
 *   Free for service conversations, and the data never leaves Meta — who
 *   already carry the message anyway. Setup takes about an hour: Meta Business
 *   account → WhatsApp product → a sender number (NOT the number you want to be
 *   notified on, it cannot message itself).
 *
 *   IMPORTANT: Meta only allows free-form text inside a 24-hour window that
 *   opens when the owner messages the business number. Outside it, only an
 *   approved template goes through. Set WHATSAPP_TEMPLATE once you have one
 *   approved, and notifications keep arriving at 3 AM too.
 *
 * ── Option C: CallMeBot (fastest to switch on) ──────────────────────────
 *   CALLMEBOT_APIKEY    the key their bot replies with
 *
 *   Five minutes, no business account, no cost. Send "I allow callmebot to send
 *   me messages" on WhatsApp to +34 644 51 95 23 and it replies with your key.
 *
 *   The trade-off is real and worth stating: the message passes through a free
 *   third-party service, and these messages carry a patient's name, mobile and
 *   home address. It is fine for testing and for a small volume you accept the
 *   risk on. For the long run, Option A is the one to be on.
 */

/** The number the bookings should land on, digits only, with country code. */
export const OWNER_WHATSAPP = "919891233525";

/** Human-readable booking, the way it should read on a phone. */
export function formatLead(lead) {
  return [
    lead.test ? "🧪 New lab test booking" : "🧪 New sample collection booking",
    "",
    lead.test ? `Test: ${lead.test}` : null,
    `Name: ${lead.name}`,
    `Mobile: ${lead.phone}`,
    `City: ${lead.city}`,
    `Address: ${lead.address}`,
    "",
    `Call back: https://wa.me/91${lead.phone}`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/**
 * One template variable, made safe to send.
 *
 * WhatsApp rejects a template parameter that is empty, or that contains a
 * newline, a tab, or four spaces in a row. Address is an optional field and is
 * typed by hand across several lines — left raw it is the one value that would
 * reliably bounce the whole notification.
 */
const param = (value) => String(value ?? "").replace(/\s+/g, " ").trim() || "—";

async function sendViaSkwebtech(lead) {
  // The body of a WhatsApp template is fixed and approved; we only fill its
  // {{1}}…{{n}} slots. So this array is positional — its length and order have
  // to match the `new_lab_test_booking` template exactly. Nothing here can read
  // the approved template, so a wrong order fails silently: the gateway happily
  // returns success and the message arrives with the mobile number printed
  // under "City". Confirmed against a real message on 25 Jul 2026; if the
  // template is ever edited, re-check this list against it.
  //
  //   {{1}} Name   {{2}} Mobile   {{3}} City   {{4}} Address   {{5}} Test
  const templateParams = [
    param(lead.name),
    param(lead.phone),
    param(lead.city),
    param(lead.address),
    param(lead.test || "Sample collection"),
  ];

  const response = await fetch("https://wa.skwebtech.in/api/campaigns/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: process.env.SKWEBTECH_APIKEY,
      campaignName: process.env.SKWEBTECH_CAMPAIGN || "new_lab_test_booking",
      destination: process.env.SKWEBTECH_DESTINATION || OWNER_WHATSAPP,
      userName: "Medico Bharat",
      templateParams,
      source: "api",
      // Sent as documented. We pass literal values rather than $Attribute
      // placeholders, so there is nothing for paramsFallbackValue to fall back
      // to — it stays empty on purpose.
      media: {},
      buttons: [],
      carouselCards: [],
      location: {},
      attributes: {},
      paramsFallbackValue: {},
    }),
    cache: "no-store",
  });

  const body = await response.text();

  if (!response.ok) {
    // 401/403 here almost always means the JWT expired, not that the code is
    // wrong. Say so, so nobody goes hunting through the payload.
    const hint =
      response.status === 401 || response.status === 403
        ? " — the SKWEBTECH_APIKEY has most likely expired; issue a new one"
        : "";
    throw new Error(`skwebtech ${response.status}: ${body}${hint}`);
  }

  // A 200 is not a delivery. The gateway answers 200 with success:false for a
  // wrong campaign name or a template/parameter-count mismatch, which is
  // exactly the failure a first setup hits.
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    parsed = null;
  }

  if (parsed && parsed.success === false) {
    throw new Error(
      `skwebtech refused the message: ${parsed.message || body} — check that the ` +
        `"${process.env.SKWEBTECH_CAMPAIGN || "new_lab_test_booking"}" template is ` +
        `approved and takes exactly ${templateParams.length} variables`
    );
  }

  return { provider: "skwebtech" };
}

async function sendViaMeta(text) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const template = process.env.WHATSAPP_TEMPLATE;

  // A template message survives outside the 24-hour window; plain text does not.
  const payload = template
    ? {
        messaging_product: "whatsapp",
        to: OWNER_WHATSAPP,
        type: "template",
        template: {
          name: template,
          language: { code: "en" },
          components: [
            { type: "body", parameters: [{ type: "text", text }] },
          ],
        },
      }
    : {
        messaging_product: "whatsapp",
        to: OWNER_WHATSAPP,
        type: "text",
        text: { body: text },
      };

  const response = await fetch(
    `https://graph.facebook.com/v21.0/${phoneId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Meta Cloud API ${response.status}: ${await response.text()}`
    );
  }

  return { provider: "meta" };
}

async function sendViaCallMeBot(text) {
  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", `+${OWNER_WHATSAPP}`);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", process.env.CALLMEBOT_APIKEY);

  const response = await fetch(url.toString(), { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`CallMeBot ${response.status}: ${await response.text()}`);
  }

  return { provider: "callmebot" };
}

/**
 * Best-effort delivery. Returns a result object; throws only so the caller can
 * log it — a failed notification must never fail the patient's booking, which
 * has already been saved by then.
 */
export async function notifyOwnerOnWhatsapp(lead) {
  // skwebtech first — it is the gateway this site is actually set up on. It
  // takes the lead itself, not the formatted text, because a template message
  // carries fields in slots, not one block of prose.
  if (process.env.SKWEBTECH_APIKEY) {
    return sendViaSkwebtech(lead);
  }

  const text = formatLead(lead);

  // Meta next: it is the official route, so if both are configured it is
  // almost certainly the one that was meant.
  if (process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_ID) {
    return sendViaMeta(text);
  }

  if (process.env.CALLMEBOT_APIKEY) {
    return sendViaCallMeBot(text);
  }

  return { provider: null, reason: "no WhatsApp gateway configured" };
}
