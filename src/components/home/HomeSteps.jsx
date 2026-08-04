// SSR component — nothing here has state.
import { ClipboardList, FileCheck2, Home, PhoneCall } from "lucide-react";

/**
 * "Booking se report tak" — the four steps, with the timings the site actually
 * promises everywhere else.
 *
 * This block exists to remove one specific doubt, and it is the doubt that
 * stops a first booking more than price does: what happens after I submit the
 * form? Nobody has met the phlebotomist, nobody knows whether they will be
 * called, and nobody wants to be waiting at home all day. So every step names
 * a time — 30 minutes to the call, 10 minutes for the visit, 24 hours to the
 * report — and every one of those numbers is one the rest of the site keeps.
 *
 * Icons are stored as strings in src/data/home.js and mapped back here, the
 * same convention the lab components use. An unknown name falls back rather
 * than crashing.
 */
const ICONS = {
  "clipboard-list": ClipboardList,
  "phone-call": PhoneCall,
  home: Home,
  "file-check": FileCheck2,
};

export default function HomeSteps({ data }) {
  const steps = data?.steps ?? [];
  if (!steps.length) return null;

  return (
    <section
      aria-labelledby="home-steps-heading"
      className="border-t border-slate-100 bg-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="home-steps-heading"
            className="text-balance text-xl min-[400px]:text-2xl sm:text-[28px] md:text-[32px] font-extrabold tracking-tight text-slate-900"
          >
            {data.heading}
          </h2>
          <p className="mt-2.5 text-[12.5px] sm:text-[14px] leading-relaxed text-slate-500">
            {data.intro}
          </p>
        </div>

        {/* An ordered list, because the order is the content. A crawler reading
            <ol> knows these are sequential steps; a grid of <div>s does not
            say that. */}
        <ol className="mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = ICONS[step.icon] ?? ClipboardList;

            return (
              <li
                key={step.title}
                className="group relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-emerald-100/90 shadow-[0_1px_2px_rgba(6,78,59,0.04),0_14px_34px_-22px_rgba(6,78,59,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:ring-emerald-300/80"
              >
                {/* The step number, oversized and faint in the corner. It reads
                    as sequence at a glance without competing with the title. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-1 -top-3 text-[64px] font-extrabold leading-none text-emerald-50 transition-colors duration-300 group-hover:text-emerald-100"
                >
                  {i + 1}
                </span>

                <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-[0_8px_18px_-8px_rgba(5,150,105,0.7)] transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                </span>

                <h3 className="relative mt-4 text-[15px] font-bold tracking-tight text-slate-900">
                  {step.title}
                </h3>
                <p className="relative mt-1.5 text-[12.5px] leading-relaxed text-slate-500">
                  {step.text}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
