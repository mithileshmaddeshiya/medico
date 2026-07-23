import {
  AlarmClock,
  Bike,
  CalendarDays,
  FileText,
  ShieldCheck,
} from "lucide-react";

/**
 * Icons cannot travel through Firestore, so a promise stores its icon as a
 * string and this registry maps it back. An unknown name falls back to the
 * shield rather than crashing the page — a typo in the console is a wrong
 * icon, never a 500.
 */
const ICONS = {
  bike: Bike,
  "alarm-clock": AlarmClock,
  "file-text": FileText,
  "calendar-days": CalendarDays,
  "shield-check": ShieldCheck,
};

// `promises` comes from the city document (or its generated default) — see
// defaultTrustStrip in src/data/labDefaults.js.
export default function LabTrustStrip({ promises = [] }) {
  if (!promises.length) return null;

  return (
    // Hidden on phones — on a small screen these four cards push the tests far
    // below the fold; the same promises already appear on the test cards there.
    <section aria-label="Our service promises" className="hidden sm:block bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <ul className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4">
          {promises.map(({ icon, title, highlight, sub }) => {
            const Icon = ICONS[icon] ?? ShieldCheck;

            return (
              <li
                key={title}
                className="group relative overflow-hidden rounded-2xl bg-white p-3 sm:p-4 ring-1 ring-emerald-100/90 shadow-[0_1px_2px_rgba(6,78,59,0.04),0_10px_28px_-16px_rgba(6,78,59,0.35)] hover:ring-emerald-300/80 hover:shadow-[0_2px_4px_rgba(6,78,59,0.05),0_18px_36px_-18px_rgba(6,78,59,0.45)] hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Soft emerald glow in the corner — brightens on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-linear-to-br from-emerald-200/50 to-teal-100/30 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                />
                {/* Hairline of light along the top edge — the premium detail */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-5 top-0 h-px bg-linear-to-r from-transparent via-emerald-300/80 to-transparent"
                />

                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 text-white ring-1 ring-white/40 shadow-[0_6px_16px_-5px_rgba(5,150,105,0.65)] group-hover:scale-105 group-hover:shadow-[0_10px_22px_-6px_rgba(5,150,105,0.7)] transition-all duration-300">
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                </span>

                <p className="relative mt-3 text-[12.5px] sm:text-[13.5px] font-bold leading-snug text-slate-900">
                  {title}{" "}
                  {highlight && (
                    <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {highlight}
                    </span>
                  )}
                </p>
                {sub && (
                  <p className="relative mt-1 text-[10.5px] sm:text-[11.5px] leading-snug text-slate-500">
                    {sub}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
