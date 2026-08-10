// SSR component — nothing here has state.
import {
  BadgeCheck,
  Languages,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  Sunrise,
  Wallet,
} from "lucide-react";

/**
 * "Log MedicoBharat par kyun bharosa karte hain."
 *
 * ── WHY THE LAST CARD IS ABOUT WHAT WE DON'T CLAIM ───────────────────────
 * Every health-service home page in this market says the same six things, and
 * a reader has learned to discount all of them. What they have not read
 * anywhere is a company naming its own limits — that it is not NABL
 * accredited, that it is not open 24x7. Saying so costs nothing (both are
 * true, and pretending otherwise is the sort of claim a manual action is
 * written for) and it is what makes the other five cards believable.
 *
 * The icon for that card is `shield-alert`, not a warning triangle: it is a
 * statement of honesty, not an error.
 *
 * ── WHY THE CARDS ARE THIS TIGHT ─────────────────────────────────────────
 * The icon sits BESIDE the title rather than stacked above it, and the copy is
 * held to one or two sentences (see the note in src/data/home.js). Stacked, six
 * cards ran two full screens on a phone and the section read as filler someone
 * scrolls past. Beside, the same six promises read as a spec sheet — which is
 * the point: this block earns trust by being specific and checkable, not by
 * being large. Nothing was dropped to shrink it; every fact still shows.
 *
 * Icons arrive as strings from src/data/home.js — same convention as the lab
 * components. An unknown name falls back to the shield rather than crashing.
 */
const ICONS = {
  wallet: Wallet,
  "badge-check": BadgeCheck,
  sunrise: Sunrise,
  "message-circle": MessageCircle,
  languages: Languages,
  "shield-alert": ShieldAlert,
};

export default function HomeWhy({ data }) {
  const points = data?.points ?? [];
  if (!points.length) return null;

  return (
    <section
      aria-labelledby="home-why-heading"
      className="border-t border-emerald-100 bg-linear-to-b from-white to-emerald-50/50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-11">

        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="home-why-heading"
            className="text-balance text-lg min-[400px]:text-xl sm:text-2xl md:text-[26px] font-extrabold tracking-tight text-slate-900"
          >
            {data.heading}
          </h2>
          <p className="mt-2 text-[12px] sm:text-[13px] leading-snug text-slate-500">
            {data.intro}
          </p>
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {points.map(({ icon, title, text }) => {
            const Icon = ICONS[icon] ?? ShieldCheck;
            // The honesty card is tinted a shade apart so it reads as a
            // deliberate statement rather than as a sixth benefit.
            const candid = icon === "shield-alert";

            return (
              <li
                key={title}
                // `items-start`, not `items-center`: the icon lines up with the
                // title's first line, so cards with a one-line and a two-line
                // body still read as one row.
                className={`group flex items-start gap-3 rounded-xl p-3.5 transition-all duration-300 hover:-translate-y-0.5 ${
                  candid
                    ? "bg-slate-900 text-white ring-1 ring-slate-800 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.9)]"
                    : "bg-white ring-1 ring-emerald-100/90 shadow-[0_1px_2px_rgba(6,78,59,0.04),0_10px_26px_-22px_rgba(6,78,59,0.45)] hover:ring-emerald-300/80"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105 ${
                    candid
                      ? "bg-white/10 text-emerald-300 ring-1 ring-white/15"
                      : "bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-[0_6px_14px_-7px_rgba(5,150,105,0.7)]"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                </span>

                {/* `min-w-0` so a long unbroken word wraps inside the card
                    instead of stretching the flex item past its column. */}
                <div className="min-w-0">
                  <h3
                    className={`text-[13.5px] font-bold leading-snug tracking-tight ${
                      candid ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {title}
                  </h3>
                  <p
                    className={`mt-1 text-[12px] leading-snug ${
                      candid ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {text}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
