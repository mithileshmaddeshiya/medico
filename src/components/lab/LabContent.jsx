'use client'

import { useEffect, useRef, useState } from "react";
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
  // Which section the reader is currently on — drives the rail highlight.
  const [activeId, setActiveId] = useState(sections[0]?.id ?? null);
  const articleRef = useRef(null);

  // Scroll-spy: mark the section nearest the top of the viewport as active so
  // the rail always shows where you are. Cheap — one observer for the article.
  useEffect(() => {
    if (!sections.length) return;
    const nodes = articleRef.current?.querySelectorAll("[data-section]");
    if (!nodes?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // Trigger a touch below the sticky header so the active link flips as a
      // heading reaches reading position, not when it first peeks in.
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [sections]);

  if (!sections.length) return null;

  return (
    <section
      aria-label={`About lab tests in ${city}`}
      className="border-t border-slate-200/80 bg-linear-to-b from-white to-slate-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-12">

          {/* RAIL — jump links, desktop only. Doubles as a visible outline of the
              page for crawlers and as navigation for a long read. */}
          <nav
            aria-label="On this page"
            className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
          >
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-24px_rgba(15,23,42,0.25)] backdrop-blur-sm">
              <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                <BookOpen className="h-3.5 w-3.5" strokeWidth={2.4} />
                On this page
              </p>

              <ul className="mt-4 space-y-0.5">
                {sections.map((s) => {
                  const isActive = activeId === s.id;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={() => setExpanded(true)}
                        aria-current={isActive ? "true" : undefined}
                        className={`group relative flex items-start gap-2.5 rounded-lg py-1.5 pl-3.5 pr-2 text-[12.5px] leading-snug transition-colors duration-200 ${
                          isActive
                            ? "bg-emerald-50 font-semibold text-emerald-800"
                            : "text-slate-500 hover:bg-slate-50 hover:text-emerald-700"
                        }`}
                      >
                        {/* Active accent bar */}
                        <span
                          aria-hidden
                          className={`absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full transition-colors duration-200 ${
                            isActive
                              ? "bg-linear-to-b from-emerald-400 to-teal-500"
                              : "bg-transparent group-hover:bg-slate-200"
                          }`}
                        />
                        {s.h}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* PROSE — plain semantic h2/p so the copy indexes cleanly; the only
              styling is rhythm and a marker beside each heading.

              Collapsed state only clips the height — the full text stays in the
              DOM, so a crawler reads every word whether or not it is expanded. */}
          <div className="max-w-3xl">
            <div className="relative">
              <article
                ref={articleRef}
                id="lab-content"
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                  expanded ? "max-h-[400rem]" : "max-h-44 sm:max-h-52"
                }`}
              >
                {sections.map((s, i) => (
                  <div
                    key={s.id}
                    id={s.id}
                    data-section
                    className={`scroll-mt-24 ${i > 0 ? "mt-9 sm:mt-11" : ""}`}
                  >
                    <h2 className="relative pl-4 text-[16px] sm:text-[19px] md:text-[21px] font-extrabold leading-snug tracking-tight text-slate-900">
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
                        className="mt-3 pl-4 text-[13px] sm:text-[14px] leading-[1.75] text-slate-600"
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
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-slate-50 via-slate-50/80 to-transparent"
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls="lab-content"
              className="group mt-5 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-[12.5px] font-bold text-white shadow-[0_10px_24px_-12px_rgba(5,150,105,0.7)] ring-1 ring-emerald-600/20 transition-all duration-200 hover:bg-emerald-700 hover:shadow-[0_14px_28px_-12px_rgba(5,150,105,0.8)] active:scale-[0.98]"
            >
              {expanded ? "Read Less" : "Read More"}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                strokeWidth={2.6}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
