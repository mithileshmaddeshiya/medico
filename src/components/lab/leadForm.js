/**
 * The one submit path every enquiry form on the site goes through.
 *
 * There are two forms with deliberately different faces — LabLeadCard (the
 * green-tab card in the hero and the "Book Now" modal) and PopupLeadForm (the
 * compact on-load popup). What must NOT differ between them is the part a
 * patient never sees: which fields are required, what a bad mobile number is
 * called, where the lead is POSTed, and what we say when it fails.
 *
 * That is what lives here. Two forms, two designs, one pipe — so the day the
 * endpoint moves or the phone rule changes, it changes once and both forms
 * follow. Without this the second form would have been a copy of the first's
 * submit block, and copies drift.
 *
 * Client-safe on purpose: no Firebase, no env, nothing server-only. The actual
 * write and the WhatsApp notification happen behind /api/lab-lead — see
 * src/app/api/lab-lead/route.js and src/lib/notifyWhatsapp.js.
 */
import { LAB_PHONE } from "@/data/lab/defaults";

/**
 * The first thing wrong with the form, or null when it is fine.
 *
 * Returns the FIELD as well as the message so the caller can turn that one box
 * red and put the cursor in it — a message alone leaves the patient hunting
 * for which of three boxes it means.
 *
 * The rules mirror validate() in the API route. The server is the one that
 * counts; this exists so a patient is told about a typo in the same second
 * rather than after a round trip.
 */
export function validateLead({ name, phone, city }) {
  if (String(name ?? "").trim().length < 2) {
    return {
      field: "name",
      message: "Please enter your name — we will use it when we call.",
    };
  }

  if (!/^[6-9]\d{9}$/.test(String(phone ?? ""))) {
    return {
      field: "phone",
      message: "Please enter a 10 digit mobile number, e.g. 98912 34567.",
    };
  }

  if (!city) {
    return {
      field: "city",
      message: "Please select your city so we can send the nearest team.",
    };
  }

  return null;
}

/**
 * Send the lead. Never throws — an offline phone is the normal case here, not
 * an exception, and a form that crashes on it loses the booking twice over.
 *
 * `address` and `test` are optional: the popup collects neither, and the API
 * treats both as blank-able.
 */
export async function postLead(lead) {
  try {
    const response = await fetch("/api/lab-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.ok) {
      return {
        ok: false,
        error:
          result.error ||
          `Booking could not be placed. Please call us at ${LAB_PHONE}.`,
      };
    }

    return { ok: true };
  } catch {
    // Offline, or the request never reached us — the phone number is the
    // fallback that always works.
    return { ok: false, error: "Please check your internet, or call us directly." };
  }
}
