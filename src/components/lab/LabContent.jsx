'use client'

import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";

/**
 * Long-form SEO block. Everything the crawler reads lives in `SECTIONS` —
 * replace the paragraphs below with the real copy when it is ready; the layout,
 * anchors and the "On this page" rail all build themselves from this array.
 *
 * Shape: { id, h, p: [paragraph, ...] }  — `id` doubles as the anchor target.
 * A `data` prop of the same shape overrides the defaults per city.
 */
const SECTIONS = (city) => [
  {
    id: "lab-test-at-home",
    h: `Lab Tests at Home in ${city}`,
    p: [
      `Getting a blood test done in ${city} no longer means standing in a queue at a diagnostic centre. A trained phlebotomist reaches your address, collects the sample in front of you using a sealed, single-use needle, and carries it to the lab in a temperature-controlled box. You stay home; only the report travels.`,
      `Home collection is free on every test listed on this page. What you pay is the test price you see on the card — there is no visiting charge, no packaging fee and no separate charge for reporting.`,
    ],
  },
  {
    id: "popular-tests",
    h: "Which tests do people book most often?",
    p: [
      `CBC, Thyroid Profile, Blood Sugar and the Full Body Checkup make up most bookings in ${city}. Seasonal panels move too — the Fever Panel covering malaria, typhoid and dengue is booked heavily through the monsoon, while Vitamin D and Vitamin B12 stay steady all year.`,
      `If a doctor has written a test that is not listed on this page, call us with the prescription — most routine pathology tests can be arranged at the same home visit.`,
    ],
  },
  {
    id: "preparation",
    h: "How to prepare before your sample is collected",
    p: [
      `Fasting tests such as Fasting Blood Sugar, the Lipid Profile and the Full Body Checkup need 8–12 hours without food; plain water is fine and should not be skipped. Booking an early slot makes this easier — collection starts at 6 AM, so you can eat right after the sample is taken.`,
      `Keep your prescription and any earlier reports handy. Carrying forward previous values helps the pathologist flag a trend rather than a single reading, which is what your doctor actually acts on.`,
    ],
  },
  {
    id: "reports",
    h: "Reports, accuracy and what happens after collection",
    p: [
      `Samples are processed at NABL-accredited partner labs, and every report is verified by a qualified pathologist before it leaves the system. Each vial is barcode-tracked from your door to the analyser, so a sample cannot be mixed up along the way.`,
      `Most reports reach you within 24 hours as a PDF on WhatsApp and email — the same file you can forward to your doctor or print at a shop. Specialised tests that need longer incubation take 48–72 hours, and that timeline is told to you at the time of booking, not after.`,
    ],
  },
];

export default function LabContent({ city = "Varanasi", data }) {
  const sections = data?.length ? data : SECTIONS(city);
  const [expanded, setExpanded] = useState(false);

  return (
    <section aria-label={`About lab tests in ${city}`} className="bg-slate-50 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,220px)_1fr] lg:gap-12">

          {/* RAIL — jump links, desktop only. Doubles as a visible outline of the
              page for crawlers and as navigation for a long read. */}
          <nav aria-label="On this page" className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400">
              <BookOpen className="h-3.5 w-3.5" strokeWidth={2.2} />
              On this page
            </p>
            <ul className="mt-3 space-y-2 border-l border-slate-200 pl-4">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setExpanded(true)}
                    className="block text-[12.5px] leading-snug text-slate-500 hover:text-emerald-700 transition-colors duration-200"
                  >
                    {s.h}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* PROSE — plain semantic h2/p so the copy indexes cleanly; the only
              styling is rhythm and a marker beside each heading.

              Collapsed state only clips the height — the full text stays in the
              DOM, so a crawler reads every word whether or not it is expanded. */}
          <div className="max-w-3xl">
            <div className="relative">
              <article
                id="lab-content"
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                  expanded ? "max-h-[400rem]" : "max-h-36 sm:max-h-40"
                }`}
              >
                {sections.map((s, i) => (
                  <div key={s.id} id={s.id} className={`scroll-mt-24 ${i > 0 ? "mt-7 sm:mt-9" : ""}`}>
                    <h2 className="relative pl-4 text-[15.5px] sm:text-[18px] md:text-[20px] font-extrabold leading-snug tracking-tight text-slate-900">
                      <span
                        aria-hidden
                        className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-1 rounded-full bg-linear-to-b from-emerald-400 to-teal-500"
                      />
                      {s.h}
                    </h2>

                    {s.p.map((para, j) => (
                      <p
                        key={j}
                        className="mt-2.5 pl-4 text-[12.5px] sm:text-[13.5px] leading-relaxed text-slate-600"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                ))}
              </article>

              {/* Fade over the cut edge — signals "there is more" without a
                  hard line through a half-shown sentence. */}
              {!expanded && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-slate-50 to-transparent"
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls="lab-content"
              className="group mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[12.5px] font-bold text-emerald-700 ring-1 ring-emerald-200 hover:ring-emerald-400 hover:bg-emerald-50/60 active:scale-[0.98] transition-all duration-200"
            >
              {expanded ? "Read Less" : "Read More"}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                strokeWidth={2.4}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
