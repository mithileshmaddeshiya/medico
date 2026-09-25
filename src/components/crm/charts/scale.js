/**
 * The chart kit's shared arithmetic: palette, number formats, nice ticks and
 * axis labels. Plain functions, no React — imported by the client charts and
 * by server pages alike.
 *
 * Formats travel as STRING keys ("count" | "rupees" | "pct" | "hours"), never
 * as functions, because a server page cannot hand a function to a client
 * component. Every chart and table resolves the key here.
 *
 * ── COLOUR ───────────────────────────────────────────────────────────────
 * Categorical slots are the dataviz reference palette, in its fixed order,
 * validated on the CRM's white card (#ffffff, light mode):
 *   node validate_palette.js "#2a78d6,#eb6834,#1baf7a,#eda100,#e87ba4,#008300"
 *   → all checks pass; aqua, yellow and magenta sit under 3:1 contrast, so
 *   every chart that can use them ships a legend with values and a table view.
 * ORDINAL is a one-hue blue ramp (validated with --ordinal) for ordered
 * buckets — funnel stages, age bands, turnaround bands — where the order is
 * the meaning. The CRM has no dark theme, so no dark steps are defined.
 */

export const SERIES = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300"];
export const ORDINAL = ["#86b6ef", "#5598e7", "#2a78d6", "#1c5cab"];
/** Diverging poles for a value that can go below zero (profit). */
export const POSITIVE = "#2a78d6";
export const NEGATIVE = "#e34948";

export const INK = {
  primary: "#0f172a", // slate-900
  secondary: "#475569", // slate-600
  muted: "#64748b", // slate-500
  grid: "#e2e8f0", // slate-200 — hairline, one step off the white card
  axis: "#cbd5e1", // slate-300
};

const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/** Full value, as the tooltip and table show it. */
export function fmt(kind, v) {
  if (v === null || v === undefined || Number.isNaN(Number(v))) return "—";
  const x = Number(v);
  switch (kind) {
    case "rupees":
      return `${x < 0 ? "−" : ""}₹${Math.abs(Math.round(x)).toLocaleString("en-IN")}`;
    case "pct":
      return `${x.toFixed(Math.abs(x) < 10 && x % 1 !== 0 ? 1 : 0)}%`;
    case "hours": {
      const h = Math.round(x * 10) / 10;
      if (h < 48) return `${h % 1 ? h.toFixed(1) : h} h`;
      return `${(h / 24).toFixed(1)} d`;
    }
    default:
      return Math.round(x).toLocaleString("en-IN");
  }
}

/** Compact value for axis ticks and bar tips: ₹1.2L, ₹45K, 1.2K. */
export function fmtShort(kind, v) {
  const x = n(v);
  const a = Math.abs(x);
  const sign = x < 0 ? "−" : "";
  if (kind === "rupees") {
    if (a >= 1e7) return `${sign}₹${trim(a / 1e7)}Cr`;
    if (a >= 1e5) return `${sign}₹${trim(a / 1e5)}L`;
    if (a >= 1e3) return `${sign}₹${trim(a / 1e3)}K`;
    return `${sign}₹${Math.round(a)}`;
  }
  if (kind === "pct" || kind === "hours") return fmt(kind, x);
  if (a >= 1e5) return `${sign}${trim(a / 1e5)}L`;
  if (a >= 1e4) return `${sign}${trim(a / 1e3)}K`;
  return fmt("count", x);
}

const trim = (x) => (x >= 100 ? Math.round(x).toString() : x.toFixed(1).replace(/\.0$/, ""));

/**
 * Clean ticks from 0 (or a negative min) to at least `max`: 0 / 1,000 / 2,000.
 * Steps are 1, 2, 2.5 or 5 × 10^k.
 */
export function niceTicks(max, min = 0, count = 4) {
  const hi = Math.max(n(max), 0);
  const lo = Math.min(n(min), 0);
  const span = hi - lo || 1;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  const unit = Math.max(step, 1); // nothing here is fractional: counts, rupees, whole percents
  const start = Math.floor(lo / unit) * unit;
  const ticks = [];
  for (let t = start; t < hi + unit - 1e-9; t += unit) ticks.push(Math.round(t * 1e6) / 1e6);
  if (ticks.length < 2) ticks.push(unit);
  return ticks;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-25" → "25 Sep"; "2026-09" → "Sep 26". Parsed by hand: no time zone can shift it. */
export function xLabel(key, long = false) {
  const [y, m, d] = String(key).split("-");
  const mon = MONTHS[Number(m) - 1] ?? m;
  if (d) return long ? `${Number(d)} ${mon} ${y}` : `${Number(d)} ${mon}`;
  return long ? `${mon} ${y}` : `${mon} ${String(y).slice(2)}`;
}

/** Which of `count` x positions get a label: about `want` of them, evenly, always the last. */
export function labelEvery(count, want = 6) {
  const every = Math.max(1, Math.ceil(count / want));
  return (i) => (count - 1 - i) % every === 0;
}
