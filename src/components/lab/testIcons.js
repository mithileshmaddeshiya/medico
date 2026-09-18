import {
  Activity,
  Beaker,
  Bug,
  ChartLine,
  Clock,
  Droplets,
  FlaskConical,
  Gauge,
  HeartPulse,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  Thermometer,
  UserRound,
} from "lucide-react";

/**
 * Icons cannot travel through Firestore, so a test stores its icon as a string
 * and this registry maps it back. An unknown name falls back to the flask
 * rather than crashing — a typo in the console is a wrong icon, never a 500.
 *
 * Shared by the test cards (LabServices) and the cart, so a test looks the
 * same in both places.
 */
export const ICONS = {
  gauge: Gauge,
  droplets: Droplets,
  activity: Activity,
  "chart-line": ChartLine,
  flask: FlaskConical,
  beaker: Beaker,
  "heart-pulse": HeartPulse,
  stethoscope: Stethoscope,
  sun: Sun,
  pill: Pill,
  bug: Bug,
  sparkles: Sparkles,
  "user-round": UserRound,
  thermometer: Thermometer,
  "shield-check": ShieldCheck,
  clock: Clock,
};

export const iconFor = (name) => ICONS[name] ?? FlaskConical;

// Full class strings — Tailwind only picks up literals, never built-up names.
// A tint typed wrong in Firestore falls back to emerald instead of putting the
// literal "undefined" into a className.
const TINT = {
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  teal: "bg-teal-50 text-teal-600 ring-teal-100",
};
export const tint = (key) => TINT[key] ?? TINT.emerald;
