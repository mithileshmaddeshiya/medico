/**
 * Every status, source and mode in the CRM, with its label and colour tone.
 * Plain data — imported by server stores (to validate) and client components
 * (to render). The ENUMs in src/lib/crm/schema.js must list the same keys.
 *
 * Tones map to the StatusBadge palette in src/components/crm/ui.jsx:
 * blue, sky, indigo, violet, amber, orange, emerald, teal, rose, slate.
 */

const toMap = (list) => Object.fromEntries(list.map((s) => [s.key, s]));

/* ── Booking pipeline ─────────────────────────────────────────────────────
   The order here IS the workflow board's column order. */
export const BOOKING_STATUSES = [
  { key: "booked", label: "Booked", tone: "slate" },
  { key: "confirmed", label: "Confirmed", tone: "blue" },
  { key: "collection_assigned", label: "Collection assigned", tone: "sky" },
  { key: "sample_collected", label: "Sample collected", tone: "indigo" },
  { key: "sample_received", label: "Received by lab", tone: "violet" },
  { key: "processing", label: "Processing", tone: "amber" },
  { key: "report_ready", label: "Report ready", tone: "teal" },
  { key: "report_delivered", label: "Report delivered", tone: "emerald" },
  { key: "completed", label: "Completed", tone: "emerald" },
  { key: "cancelled", label: "Cancelled", tone: "rose" },
];
export const BOOKING_STATUS = toMap(BOOKING_STATUSES);
export const PIPELINE = BOOKING_STATUSES.filter((s) => s.key !== "cancelled").map((s) => s.key);

/** Statuses that count as "open work" — not finished, not cancelled. */
export const OPEN_STATUSES = PIPELINE.filter((s) => s !== "completed");

export const COLLECTION_STATUSES = [
  { key: "unassigned", label: "Not assigned", tone: "slate" },
  { key: "assigned", label: "Assigned", tone: "sky" },
  { key: "confirmed", label: "Confirmed", tone: "blue" },
  { key: "on_the_way", label: "On the way", tone: "indigo" },
  { key: "arrived", label: "Arrived", tone: "violet" },
  { key: "collected", label: "Collected", tone: "emerald" },
  { key: "failed", label: "Failed", tone: "rose" },
  { key: "cancelled", label: "Cancelled", tone: "slate" },
];
export const COLLECTION_STATUS = toMap(COLLECTION_STATUSES);

export const PARTNER_STATUSES = [
  { key: "unassigned", label: "No lab", tone: "slate" },
  { key: "pending", label: "Awaiting lab", tone: "amber" },
  { key: "accepted", label: "Accepted", tone: "emerald" },
  { key: "rejected", label: "Rejected", tone: "rose" },
];
export const PARTNER_STATUS = toMap(PARTNER_STATUSES);

export const REPORT_STATUSES = [
  { key: "waiting", label: "Waiting for sample", tone: "slate" },
  { key: "sample_received", label: "Sample received", tone: "violet" },
  { key: "processing", label: "Processing", tone: "amber" },
  { key: "report_pending", label: "Report pending", tone: "orange" },
  { key: "report_ready", label: "Report ready", tone: "teal" },
  { key: "verified", label: "Verified", tone: "blue" },
  { key: "sent", label: "Sent", tone: "emerald" },
  { key: "completed", label: "Completed", tone: "emerald" },
];
export const REPORT_STATUS = toMap(REPORT_STATUSES);

/* ── Where a booking / lead came from ───────────────────────────────────── */
export const SOURCES = [
  { key: "website", label: "Online", tone: "blue" },
  { key: "phone", label: "Phone", tone: "violet" },
  { key: "whatsapp", label: "WhatsApp", tone: "emerald" },
  { key: "walk_in", label: "Walk-in", tone: "amber" },
  { key: "referral", label: "Referral", tone: "teal" },
  { key: "partner", label: "Partner", tone: "indigo" },
  { key: "offline", label: "Offline", tone: "slate" },
  { key: "other", label: "Other", tone: "slate" },
];
export const SOURCE = toMap(SOURCES);
export const isOnlineSource = (source) => source === "website";

/* ── Money ──────────────────────────────────────────────────────────────── */
export const PAYMENT_MODES = [
  { key: "cash", label: "Cash", tone: "amber" },
  { key: "upi", label: "UPI", tone: "violet" },
  { key: "online", label: "Online", tone: "blue" },
  { key: "card", label: "Card", tone: "indigo" },
  { key: "bank_transfer", label: "Bank transfer", tone: "teal" },
  { key: "other", label: "Other", tone: "slate" },
];
export const PAYMENT_MODE = toMap(PAYMENT_MODES);

export const PAYMENT_STATUSES = [
  { key: "paid", label: "Paid", tone: "emerald" },
  { key: "partial", label: "Partial", tone: "amber" },
  { key: "pending", label: "Pending", tone: "orange" },
  { key: "failed", label: "Failed", tone: "rose" },
  { key: "refunded", label: "Refunded", tone: "violet" },
];
export const PAYMENT_STATUS = toMap(PAYMENT_STATUSES);

/** Status of one payment row (a booking's status is PAYMENT_STATUSES). */
export const TXN_STATUSES = [
  { key: "paid", label: "Paid", tone: "emerald" },
  { key: "pending", label: "Pending", tone: "orange" },
  { key: "failed", label: "Failed", tone: "rose" },
  { key: "void", label: "Void", tone: "slate" },
];
export const TXN_STATUS = toMap(TXN_STATUSES);

export const REFUND_STATUSES = [
  { key: "requested", label: "Requested", tone: "amber" },
  { key: "approved", label: "Approved", tone: "blue" },
  { key: "processed", label: "Processed", tone: "emerald" },
  { key: "rejected", label: "Rejected", tone: "slate" },
];
export const REFUND_STATUS = toMap(REFUND_STATUSES);

export const SETTLEMENT_STATUSES = [
  { key: "pending", label: "Pending", tone: "amber" },
  { key: "processing", label: "Processing", tone: "blue" },
  { key: "paid", label: "Paid", tone: "emerald" },
  { key: "on_hold", label: "On hold", tone: "rose" },
  { key: "void", label: "Void", tone: "slate" },
];
export const SETTLEMENT_STATUS = toMap(SETTLEMENT_STATUSES);

export const EXPENSE_CATEGORIES = [
  { key: "fuel", label: "Fuel & travel" },
  { key: "salary", label: "Salaries" },
  { key: "rent", label: "Rent" },
  { key: "marketing", label: "Marketing" },
  { key: "supplies", label: "Collection supplies" },
  { key: "logistics", label: "Sample logistics" },
  { key: "software", label: "Software & phone" },
  { key: "other", label: "Other" },
];
export const EXPENSE_CATEGORY = toMap(EXPENSE_CATEGORIES);

/* ── Leads ──────────────────────────────────────────────────────────────── */
export const LEAD_STATUSES = [
  { key: "new", label: "New", tone: "blue" },
  { key: "contacted", label: "Contacted", tone: "sky" },
  { key: "follow_up", label: "Follow-up", tone: "amber" },
  { key: "booked", label: "Booked", tone: "indigo" },
  { key: "completed", label: "Completed", tone: "emerald" },
  { key: "cancelled", label: "Cancelled", tone: "slate" },
  { key: "not_interested", label: "Not interested", tone: "rose" },
];
/* The admin panel's older stage names, still on existing rows. Read as the
   nearest CRM status; the CRM never writes them. */
export const LEGACY_LEAD_STATUS = {
  collected: "booked",
  done: "completed",
  lost: "not_interested",
  archived: "cancelled",
};
export const LEAD_STATUS = toMap(LEAD_STATUSES);
export const leadStatus = (key) => LEAD_STATUS[LEGACY_LEAD_STATUS[key] ?? key] ?? LEAD_STATUS.new;
export const CONVERTED_LEAD = ["booked", "completed", "collected", "done"];

export const CALL_OUTCOMES = [
  { key: "answered", label: "Answered", tone: "emerald" },
  { key: "missed", label: "Missed", tone: "rose" },
  { key: "no_answer", label: "No answer", tone: "orange" },
  { key: "busy", label: "Busy", tone: "amber" },
  { key: "switched_off", label: "Switched off", tone: "slate" },
  { key: "callback", label: "Asked to call back", tone: "sky" },
];
export const CALL_OUTCOME = toMap(CALL_OUTCOMES);

/* ── Catalog ────────────────────────────────────────────────────────────── */
export const TEST_CATEGORIES = [
  { key: "blood", label: "Blood" },
  { key: "diabetes", label: "Diabetes" },
  { key: "thyroid", label: "Thyroid" },
  { key: "liver", label: "Liver" },
  { key: "kidney", label: "Kidney" },
  { key: "vitamins", label: "Vitamins" },
  { key: "heart", label: "Heart" },
  { key: "fever", label: "Fever" },
  { key: "full_body", label: "Full Body" },
  { key: "other", label: "Other" },
];
export const TEST_CATEGORY = toMap(TEST_CATEGORIES);

export const SAMPLE_TYPES = ["Blood", "Urine", "Stool", "Swab", "Sputum", "Other"];

export const COLLECTION_SLOTS = [
  "06:00 – 07:00",
  "07:00 – 08:00",
  "08:00 – 09:00",
  "09:00 – 10:00",
  "10:00 – 11:00",
  "11:00 – 12:00",
  "12:00 – 13:00",
  "14:00 – 16:00",
  "16:00 – 18:00",
];

export const GENDERS = [
  { key: "male", label: "Male" },
  { key: "female", label: "Female" },
  { key: "other", label: "Other" },
];

/* ── Codes shown to people ──────────────────────────────────────────────── */
export const bookingCode = (id) => (id ? `MB${id}` : "—");
export const leadCode = (id) => (id ? `LD${String(id).padStart(5, "0")}` : "—");
export const paymentCode = (id) => (id ? `PAY${id}` : "—");
export const settlementCode = (id) => (id ? `ST${String(id).padStart(4, "0")}` : "—");
export const partnerCode = (id) => (id ? `LAB${String(id).padStart(3, "0")}` : "—");
export const customerCode = (id) => (id ? `CU${String(id).padStart(5, "0")}` : "—");

/** "MB10245", "mb10245", "10245" → 10245; anything else → null. */
export function parseBookingCode(value) {
  const m = /^\s*(?:mb)?\s*(\d{3,})\s*$/i.exec(String(value ?? ""));
  return m ? Number(m[1]) : null;
}

/** SLA defaults (hours), overridable in /crm/settings (settings table). */
export const SLA_DEFAULTS = {
  partner_accept_hours: 2,
  sample_receive_hours: 6,
  report_grace_hours: 0,
  payment_pending_days: 2,
  followup_overdue_hours: 0,
};
