import { ArrowRight, PhoneCall, ShieldCheck } from "lucide-react";

const PHONE = "+91 98912 33525";

// Claims the page already makes elsewhere — no invented numbers, so the strip
// stays credible rather than salesy.
const PROOF = ["NABL-accredited labs", "Free home collection", "Reports in 24 hrs"];

export default function LabCta({ city = "Varanasi" }) {
  return (
    <section aria-label="Book a lab test" className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-7 sm:pb-10">
        {/* A quiet, low band — one line of intent, one row of proof, two actions.
            Restraint is what makes it read as clinical rather than promotional. */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-50/80 to-white px-3.5 py-3.5 sm:px-6 sm:py-5 ring-1 ring-emerald-100 shadow-[0_1px_2px_rgba(6,78,59,0.03)]">
          {/* Left accent rail — a single vertical stroke gives the band structure
              without adding height, and reads as a medical marker, not decoration. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-linear-to-b from-emerald-400 to-teal-500"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">

            {/* COPY — badge sits beside the text, top-aligned on a phone (where
                the heading wraps to two lines) and centred once it fits one. */}
            <div className="flex min-w-0 items-start gap-2.5 sm:items-center sm:gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 ring-1 ring-emerald-200 shadow-[0_2px_6px_-2px_rgba(6,78,59,0.15)] sm:mt-0 sm:h-9 sm:w-9 sm:rounded-xl">
                <ShieldCheck className="h-4 w-4 sm:h-4.5 sm:w-4.5" strokeWidth={2.1} />
              </span>

              <div className="min-w-0">
                <h2 className="text-pretty text-[13.5px] min-[380px]:text-[14.5px] sm:text-[16.5px] md:text-[18px] font-bold leading-snug tracking-tight text-slate-900">
                  Book a lab test in {city} —{" "}
                  <span className="text-emerald-700">sample collected at home</span>
                </h2>

                {/* Proof points, dot-separated: reads as a fact line, not a banner */}
                <ul className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] min-[380px]:text-[10.5px] sm:text-[11.5px] font-medium text-slate-500">
                  {PROOF.map((p, i) => (
                    <li key={p} className="flex items-center gap-1.5 sm:gap-2">
                      {i > 0 && (
                        <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-emerald-300" />
                      )}
                      <span className="whitespace-nowrap">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ACTIONS — full-width stack on phones (bigger tap targets, no
                cramped side-by-side), one row of equal-height buttons from sm. */}
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:gap-2.5">
              <a
                href="#book"
                className="group inline-flex h-11 w-full items-center justify-center sm:h-10 sm:w-auto sm:flex-1 gap-1.5 rounded-lg bg-emerald-600 px-4 sm:px-5 text-[12.5px] sm:text-[13px] font-bold text-white shadow-[0_6px_16px_-8px_rgba(5,150,105,0.9)] hover:bg-emerald-700 hover:shadow-[0_10px_20px_-8px_rgba(5,150,105,0.9)] active:scale-[0.98] transition-all duration-200"
              >
                Book a Test
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={2.4}
                />
              </a>

              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                aria-label={`Call us at ${PHONE}`}
                className="inline-flex h-11 w-full items-center justify-center sm:h-10 sm:w-auto sm:flex-1 gap-2 rounded-lg bg-white px-4 sm:px-5 text-[12.5px] sm:text-[13px] font-bold text-emerald-700 ring-1 ring-emerald-200 hover:ring-emerald-400 hover:bg-emerald-50/60 active:scale-[0.98] transition-all duration-200"
              >
                <PhoneCall className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
                <span className="tabular-nums whitespace-nowrap">{PHONE}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
