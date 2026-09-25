/**
 * Chart colours for the finance screens. Plain data, server- and client-safe.
 *
 * The eight categorical slots are the validated default order (adjacent CVD
 * ΔE ≥ 9.1, normal-vision ≥ 19.6 on white — checked with the dataviz
 * validator). Three slots sit under 3:1 contrast on white, so every chart that
 * uses them ships visible labels and a table beside it.
 *
 * Colour follows the ENTITY, never its rank: a payment mode or an expense
 * category always gets the slot of its position in constants.js, so "Cash"
 * is the same orange on every screen whatever else is on screen with it.
 */
import { EXPENSE_CATEGORIES, PAYMENT_MODES } from "@/lib/crm/constants";

export const SERIES = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"];

export const MODE_COLOR = Object.fromEntries(PAYMENT_MODES.map((m, i) => [m.key, SERIES[i % SERIES.length]]));
export const CATEGORY_COLOR = Object.fromEntries(EXPENSE_CATEGORIES.map((c, i) => [c.key, SERIES[i % SERIES.length]]));

/** Chart chrome, tuned to the CRM's slate-on-white surface. */
export const INK = {
  grid: "#e2e8f0",
  axis: "#cbd5e1",
  muted: "#64748b",
  primary: "#0f172a",
  accent: SERIES[0],
};
