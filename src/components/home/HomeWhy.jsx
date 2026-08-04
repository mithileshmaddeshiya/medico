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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="home-why-heading"
            className="text-balance text-xl min-[400px]:text-2xl sm:text-[28px] md:text-[32px] font-extrabold tracking-tight text-slate-900"
          >
            {data.heading}
          </h2>
          <p className="mt-2.5 text-[12.5px] sm:text-[14px] leading-relaxed text-slate-500">
            {data.intro}
          </p>
        </div>

        <ul className="mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {points.map(({ icon, title, text }) => {
            const Icon = ICONS[icon] ?? ShieldCheck;
            // The honesty card is tinted a shade apart so it reads as a
            // deliberate statement rather than as a sixth benefit.
            const candid = icon === "shield-alert";

            return (
              <li
                key={title}
                className={`group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 ${
                  candid
                    ? "bg-slate-900 text-white ring-1 ring-slate-800 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.9)]"
                    : "bg-white ring-1 ring-emerald-100/90 shadow-[0_1px_2px_rgba(6,78,59,0.04),0_14px_34px_-24px_rgba(6,78,59,0.45)] hover:ring-emerald-300/80"
                }`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${
                    candid
                      ? "bg-white/10 text-emerald-300 ring-1 ring-white/15"
                      : "bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-[0_8px_18px_-8px_rgba(5,150,105,0.7)]"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                </span>

                <h3
                  className={`mt-4 text-[15px] font-bold tracking-tight ${
                    candid ? "text-white" : "text-slate-900"
                  }`}
                >
                  {title}
                </h3>
                <p
                  className={`mt-1.5 text-[12.5px] leading-relaxed ${
                    candid ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {text}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
