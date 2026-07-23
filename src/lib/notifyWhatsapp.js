/**
 * Sends a booking to the shop's WhatsApp — without the patient ever leaving
 * the site.
 *
 * WhatsApp is a closed network: no server can just "send a WhatsApp". It has to
 * go through a gateway, and a gateway needs credentials. Two are supported, and
 * whichever is configured wins. Configure neither and this is a silent no-op —
 * the lead is still saved to Firestore either way.
 *
 * ── Option A: Meta WhatsApp Cloud API (official) ────────────────────────
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
 * ── Option B: CallMeBot (fastest to switch on) ──────────────────────────
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
  const text = formatLead(lead);

  // Meta first: it is the official route, so if both are configured it is
  // almost certainly the one that was meant.
  if (process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_ID) {
    return sendViaMeta(text);
  }

  if (process.env.CALLMEBOT_APIKEY) {
    return sendViaCallMeBot(text);
  }

  return { provider: null, reason: "no WhatsApp gateway configured" };
}
