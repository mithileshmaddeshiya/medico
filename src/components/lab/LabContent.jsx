'use client'

import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";

/**
 * Long-form SEO block. Everything the crawler reads comes in as `sections`,
 * from the city document or its generated default — see defaultContent in
 * src/data/labDefaults.js.
 *
 * Shape: { id, h, p: [paragraph, ...] } — `id` doubles as the anchor target,
 * and the layout plus the "On this page" rail build themselves from the array.
 */
export default function LabContent({ city, sections = [] }) {
  const [expanded, setExpanded] = useState(false);

  if (!sections.length) return null;

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

                    {/* `?? []` — a section typed into Firestore without any
                        paragraphs should render its heading, not a 500. */}
                    {(s.p ?? []).map((para, j) => (
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
