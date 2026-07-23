import { ArrowRight, Check, PhoneCall, ShieldCheck } from "lucide-react";

// `cta` and `phone` come from the city document (or its generated default) —
// see defaultCta in src/data/labDefaults.js. Nothing here may assert an
// accreditation MedicoBharat does not hold; keep it that way when editing.
export default function LabCta({ cta, phone }) {
  const proof = cta?.proof ?? [];

  return (
    <section aria-label="Book a lab test" className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-7 sm:pb-10">
        {/* A quiet, low band — one line of intent, one row of proof, two actions.
            Restraint is what makes it read as clinical rather than promotional. */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-50/80 to-white px-4 py-4 sm:px-6 sm:py-5 ring-1 ring-emerald-100 shadow-[0_1px_2px_rgba(6,78,59,0.03)]">
          {/* Left accent rail — a single vertical stroke gives the band structure
              without adding height, and reads as a medical marker, not decoration. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-linear-to-b from-emerald-400 to-teal-500"
          />

          {/* Row only from md. At sm the copy would be squeezed into ~165px
              beside two buttons and the heading would break over four lines. */}
          <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between md:gap-6">

            {/* COPY — badge sits beside the text, top-aligned while the heading
                wraps to two lines, centred once it fits on one. */}
            <div className="flex min-w-0 items-start gap-2.5 md:items-center md:gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 ring-1 ring-emerald-200 shadow-[0_2px_6px_-2px_rgba(6,78,59,0.15)] md:mt-0 md:h-9 md:w-9 md:rounded-xl">
                <ShieldCheck className="h-4 w-4 md:h-4.5 md:w-4.5" strokeWidth={2.1} />
              </span>

              <div className="min-w-0">
                <h2 className="text-pretty text-[14px] min-[380px]:text-[15px] sm:text-[16.5px] md:text-[17px] lg:text-[18px] font-bold leading-snug tracking-tight text-slate-900">
                  {cta?.headingLead}{" "}
                  <span className="text-emerald-700">{cta?.headingAccent}</span>
                </h2>

                {/* Each proof carries its own tick. Dot separators looked cleaner
                    on one line, but a wrap left the dot orphaned at the start of
                    the next line — a tick per item survives any wrap. */}
                {proof.length > 0 && (
                  <ul className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10.5px] min-[380px]:text-[11px] sm:text-[11.5px] font-medium text-slate-500">
                    {proof.map((p) => (
                      <li key={p} className="flex items-center gap-1">
                        <Check
                          aria-hidden
                          className="h-3 w-3 shrink-0 text-emerald-500"
                          strokeWidth={3}
                        />
                        <span className="whitespace-nowrap">{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* ACTIONS — full-width stack on phones (bigger tap targets, no
                cramped side-by-side), one row of equal-height buttons from md. */}
            <div className="flex shrink-0 flex-col gap-2 md:flex-row md:gap-2.5">
              <a
                href="#book"
                className="group inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 text-[13px] font-bold text-white shadow-[0_6px_16px_-8px_rgba(5,150,105,0.9)] hover:bg-emerald-700 hover:shadow-[0_10px_20px_-8px_rgba(5,150,105,0.9)] active:scale-[0.98] transition-all duration-200 md:h-10 md:w-auto md:px-5"
              >
                Book a Test
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={2.4}
                />
              </a>

              <a
                href={`tel:${String(phone ?? "").replace(/\s/g, "")}`}
                aria-label={`Call us at ${phone}`}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-[13px] font-bold text-emerald-700 ring-1 ring-emerald-200 hover:ring-emerald-400 hover:bg-emerald-50/60 active:scale-[0.98] transition-all duration-200 md:h-10 md:w-auto md:px-5"
              >
                <PhoneCall className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
                <span className="tabular-nums whitespace-nowrap">{phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
