/**
 * Formatting shared by server and client. Every date is rendered in IST with a
 * fixed locale, so the server's string and the browser's are identical — a
 * locale-dependent format is a hydration mismatch.
 *
 * MySQL runs in UTC here (pool timezone "Z"), so a DATETIME read back is a UTC
 * instant and is shown converted to Asia/Kolkata.
 */

const TZ = "Asia/Kolkata";

export const rupees = (value, { decimals = 0 } = {}) =>
  value === null || value === undefined || value === ""
    ? "—"
    : `₹${Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`;

/** ₹1.2L, ₹45.3K — for KPI tiles where the full figure does not fit. */
export function rupeesShort(value) {
  const n = Number(value ?? 0);
  if (Math.abs(n) >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (Math.abs(n) >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`;
  if (Math.abs(n) >= 1e4) return `₹${(n / 1e3).toFixed(1)}K`;
  return rupees(n);
}

export const num = (value) => Number(value ?? 0).toLocaleString("en-IN");

export const pct = (value, digits = 0) =>
  value === null || value === undefined || Number.isNaN(Number(value))
    ? "—"
    : `${Number(value).toFixed(digits)}%`;

const toDate = (value) => {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

/** 25 Sep 2026 */
export function date(value) {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-IN", { timeZone: TZ, day: "numeric", month: "short", year: "numeric" });
}

/** 25 Sep 2026, 09:32 am */
export function dateTime(value) {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleString("en-IN", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** 09:32 am */
export function time(value) {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleTimeString("en-IN", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
}

/**
 * A DATE column (collection_date, spent_on) — no time, no zone. mysql2 hands
 * DATE back as a JS Date at UTC midnight (pool timezone "Z"), so it is read in
 * UTC, not converted to IST, or it would never shift but it could.
 */
export function day(value) {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-IN", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" });
}

/** "5 min ago", "3 h ago", "2 days ago", then a date. `now` is passed for stable SSR. */
export function ago(value, now = Date.now()) {
  const d = toDate(value);
  if (!d) return "—";
  const s = Math.round((now - d.getTime()) / 1000);
  if (s < 45) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  if (s < 86400 * 7) return `${Math.round(s / 86400)} day${Math.round(s / 86400) === 1 ? "" : "s"} ago`;
  return date(d);
}

/** Duration in hours → "3 h", "1 d 4 h". */
export function hours(h) {
  if (h === null || h === undefined || Number.isNaN(Number(h))) return "—";
  const n = Math.round(Number(h));
  if (n < 24) return `${n} h`;
  const d = Math.floor(n / 24);
  const r = n % 24;
  return r ? `${d} d ${r} h` : `${d} d`;
}

/** Today in IST as YYYY-MM-DD — the value a date filter compares against. */
export function todayIST(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86400000);
  return d.toLocaleDateString("en-CA", { timeZone: TZ });
}

/** 9876543210 → 98765 43210 */
export const phone = (value) => {
  const s = String(value ?? "").replace(/\D/g, "");
  return s.length === 10 ? `${s.slice(0, 5)} ${s.slice(5)}` : String(value ?? "");
};

export const telHref = (value) => `tel:+91${String(value ?? "").replace(/\D/g, "").slice(-10)}`;
export const waHref = (value, text = "") =>
  `https://wa.me/91${String(value ?? "").replace(/\D/g, "").slice(-10)}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const mapHref = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(String(address ?? ""))}`;

export const initials = (name) =>
  String(name ?? "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("") || "?";

/** Percentage change a → b, null when there is no base to compare with. */
export function change(current, previous) {
  const c = Number(current ?? 0);
  const p = Number(previous ?? 0);
  if (!p) return c ? null : 0;
  return ((c - p) / p) * 100;
}

/** Has this instant already passed? (For "delayed" badges on server-rendered rows.) */
export const isPast = (value) => {
  const d = toDate(value);
  return Boolean(d) && d.getTime() < Date.now();
};
