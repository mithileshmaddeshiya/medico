import { ArrowRight, Check, Clock, House, PhoneCall, ShieldCheck, Syringe } from "lucide-react";

import BookFormLink from "./BookFormLink";

// `cta` and `phone` come from the city document (or its generated default) —
// see defaultCta in src/data/lab/defaults.js. Nothing here may assert an
// accreditation MedicoBharat does not hold; keep it that way when editing.

/** An icon for a proof line, by what it says; a tick for anything else. */
const iconFor = (text) => {
  const t = String(text).toLowerCase();
  if (t.includes("phlebotom")) return Syringe;
  if (t.includes("home") || t.includes("collection")) return House;
  if (t.includes("report") || t.includes("hrs") || t.includes("hour")) return Clock;
  return Check;
};

/**
 * The booking band: a solid emerald card, white type, two actions.
 *
 *   phone                                   md and up
 *   ┌──────────────────────────────┐        ┌───────────────────────────────────────────────┐
 *   │ 🛡 Book a lab test in Deoria  │        │ 🛡 Book a lab test in Deoria — sample …        │
 *   │    Sample collected at home   │        │    ✓ … ✓ … ✓ …         [Book a Test] [Call]    │
 *   │ ┌────────┬────────┬────────┐  │        └───────────────────────────────────────────────┘
 *   │ │syringe │ house  │ clock  │  │
 *   │ │Trained │Home    │Reports │  │
 *   │ └────────┴────────┴────────┘  │
 *   │ [ Book a Test ][ Call to Book]│
 *   └──────────────────────────────┘
 *
 * The data writes the heading as one sentence with a dash ("Book a lab test
 * in Deoria —" + "sample collected at home"). On a phone it broke mid-phrase,
 * so there the dash is dropped and the accent takes its own line; from md up
 * it reads as the one sentence it was written as.
 */
export default function LabCta({ cta, phone }) {
  const proof = cta?.proof ?? [];
  const rawLead = String(cta?.headingLead ?? "");
  const lead = rawLead.replace(/\s*[—–-]\s*$/, "");
  const hasDash = lead !== rawLead;

  return (
    <section aria-label="Book a lab test" className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-7 sm:pb-10">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-emerald-600 to-teal-700 px-4 py-5 text-white shadow-[0_18px_40px_-22px_rgba(5,150,105,0.8)] sm:px-6 md:py-5">
          {/* Two soft circles for depth — decoration only. */}
          <span aria-hidden className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10" />
          <span aria-hidden className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-teal-400/20" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
            {/* ── COPY ─────────────────────────────────────────────────── */}
            <div className="min-w-0">
              <div className="flex items-start gap-3 md:items-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
                  <ShieldCheck className="h-5 w-5" strokeWidth={2.1} aria-hidden />
                </span>
                <h2 className="min-w-0 text-[17px] font-bold leading-snug tracking-tight sm:text-[18px] lg:text-[19px]">
                  {lead}
                  {hasDash && <span className="hidden md:inline"> —</span>}{" "}
                  <span className="block font-semibold text-emerald-100 first-letter:uppercase md:inline md:first-letter:normal-case">
                    {cta?.headingAccent}
                  </span>
                </h2>
              </div>

              {proof.length > 0 && (
                /* Phone: one panel split in three equal cells — icon over label
                   — so no item is ever left alone on a second row. From md up:
                   one inline row of ticks under the heading. */
                <ul className="mt-4 grid grid-cols-3 divide-x divide-white/15 rounded-xl bg-white/10 py-2.5 ring-1 ring-white/15 md:mt-2 md:ml-[52px] md:flex md:flex-wrap md:gap-x-4 md:gap-y-1 md:divide-x-0 md:rounded-none md:bg-transparent md:py-0 md:ring-0">
                  {proof.map((p) => {
                    const Icon = iconFor(p);
                    return (
                      <li
                        key={p}
                        className="flex flex-col items-center gap-1 px-1.5 text-center text-[11.5px] font-medium leading-tight text-white/90 md:flex-row md:gap-1.5 md:px-0 md:text-left md:text-[12.5px]"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-emerald-100" strokeWidth={2.1} aria-hidden />
                        <span className="md:whitespace-nowrap">{p}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* ── ACTIONS ─────────────────────────────────────────────────
                Two equal buttons on phones (a grid keeps them the same width
                whatever the label), an auto-width row from md. The call button
                does not print the number: it reads as an action, and the tel:
                link still dials it. */}
            <div className="grid grid-cols-2 gap-2.5 md:flex md:shrink-0">
              <BookFormLink className="group inline-flex h-12 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-white px-3 text-[14px] font-bold text-emerald-700 shadow-[0_8px_18px_-10px_rgba(0,0,0,0.45)] transition-all duration-200 hover:bg-emerald-50 active:scale-[0.98] md:h-11 md:w-auto md:px-6">
                Book a Test
                <ArrowRight
                  className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={2.4}
                  aria-hidden
                />
              </BookFormLink>

              <a
                href={`tel:${String(phone ?? "").replace(/\s/g, "")}`}
                title={`Call ${phone} to book a lab test`}
                aria-label={`Call us at ${phone}`}
                className="inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-xl px-3 text-[14px] font-bold text-white ring-[1.5px] ring-white/60 transition-all duration-200 hover:bg-white/10 hover:ring-white active:scale-[0.98] md:h-11 md:w-auto md:px-6"
              >
                <PhoneCall className="h-4 w-4 shrink-0" strokeWidth={2.2} aria-hidden />
                <span className="whitespace-nowrap">Call to Book</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
