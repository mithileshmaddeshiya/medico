'use client'

import { useState } from "react";
import { ChevronDown } from "lucide-react";

// `faqs` come from the city document (or its generated default) — see
// defaultFaqs in src/data/labDefaults.js. Shape: [{ q, a }].
export default function LabFaq({ city, faqs = [] }) {
  const [open, setOpen] = useState(0);

  if (!faqs.length) return null;

  // FAQPage schema — the same answers, in the shape Google reads for rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="bg-white border-t border-slate-100"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-8 sm:pb-12">

        <h2 className="text-balance text-center text-xl min-[400px]:text-2xl sm:text-[28px] md:text-[32px] font-extrabold tracking-tight text-slate-900">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-center text-[12.5px] sm:text-[13.5px] text-slate-500">
          {city} me lab test, home collection aur report se jude aam sawaal
        </p>

        {/* Only one answer open at a time so the list never becomes a wall of
            text; grid-rows animates the height instead of snapping open. */}
        <ul className="mt-6 sm:mt-8 space-y-2.5">
          {faqs.map(({ q, a }, i) => {
            const isOpen = open === i;
            return (
              <li
                key={q}
                className={`overflow-hidden rounded-xl bg-white transition-all duration-300 ${
                  isOpen
                    ? "ring-1 ring-emerald-300 shadow-[0_10px_26px_-18px_rgba(6,78,59,0.4)]"
                    : "ring-1 ring-slate-200 hover:ring-emerald-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left sm:py-3.5"
                >
                  <span
                    className={`text-[13px] sm:text-[14.5px] font-semibold leading-snug transition-colors duration-200 ${
                      isOpen ? "text-emerald-700" : "text-slate-800"
                    }`}
                  >
                    {q}
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={`h-4.5 w-4.5 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-emerald-600" : "text-slate-400"
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-[12px] sm:text-[13px] leading-relaxed text-slate-500">
                      {a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
