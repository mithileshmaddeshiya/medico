'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, ChevronDown, Clock3 } from "lucide-react";

/**
 * Long-form SEO block. Everything the crawler reads comes in as `sections`,
 * from the city document or its generated default — see defaultContent in
 * src/data/lab/defaults.js.
 *
 * Shape: { id, h, p: [paragraph, ...] } — `id` doubles as the anchor target,
 * and the layout plus the "On this page" rail build themselves from the array.
 *
 * The FIRST section is the lead: its heading is the block's own <h2> and its
 * paragraphs are the intro. It used to render as one more <h3> underneath a
 * hardcoded "… Ki Poori Jaankari" <h2>, which put two near-identical headings
 * back to back — on a phone that was six lines of bold text before a single
 * sentence of content. It is also left out of the rail, because a page listing
 * its own title as a jump link is a link to where the reader already is.
 */

// Average Hindi/Hinglish reading speed on a phone, rounded down deliberately —
// an under-promise here reads better than "12 min" over a wall of text.
const WORDS_PER_MINUTE = 180;

export default function LabContent({ city, sections = [] }) {
  const [expanded, setExpanded] = useState(false);
  // Which section the reader is currently on — drives the rail highlight.
  // Starts on the first *listed* section, not the lead, which has no rail entry.
  const [activeId, setActiveId] = useState(sections[1]?.id ?? null);
  const articleRef = useRef(null);
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const buttonRef = useRef(null);
  const contentRef = useRef(null);
  // Anchor clicked while the article was still clipped — scrolled to only
  // after the expand transition settles, see the effect below.
  const pendingId = useRef(null);
  // Collapsed height of the article on desktop, in px — see the effect below.
  // null on phones, where the fixed Tailwind clamp is used instead.
  const [clampHeight, setClampHeight] = useState(null);
  // Full height of the prose, in px — the open state's max-height.
  const [openHeight, setOpenHeight] = useState(null);

  /**
   * The open state used to be a flat `max-h-[400rem]` — 6400px. A city with a
   * long guide (Varanasi runs past that) stayed clipped *after* pressing the
   * button, so the reader hit a cut paragraph with "Read Less" underneath and
   * no way to see the rest.
   *
   * Measuring the prose instead means the clamp is always exactly as tall as
   * the text, whatever the city, viewport or font. The +8 is slack for
   * sub-pixel rounding; max-height above the content adds no empty space.
   *
   * Observed on the inner wrapper, not the <article> — the article is the
   * element being clipped, so its own box would just report the clamp back.
   */
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const measure = () => setOpenHeight(Math.ceil(content.getBoundingClientRect().height) + 8);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [sections]);

  // The collapsed column used to stop well above the outline card, leaving the
  // rail hanging into empty space. On desktop the clip height is measured from
  // the rail instead of hardcoded, so the teaser plus its button end level with
  // the card no matter how many sections a city has.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !sections.length) return;

    const mq = window.matchMedia("(min-width: 1024px)");

    const measure = () => {
      // Below lg the rail is hidden and the button goes full width — nothing to
      // match, so hand the clamp back to the max-h-72 / sm:max-h-80 classes.
      if (!mq.matches || !rail.offsetHeight) {
        setClampHeight(null);
        return;
      }
      // The button sits outside the article but inside the column, so its
      // height and its mt-5 (20px) come off the rail's height.
      const button = buttonRef.current;
      const below = button ? button.offsetHeight + 20 : 62;
      // Floor: a rail short enough to clip the teaser to a stub would read as
      // broken. Better to overshoot the card slightly than show two lines.
      setClampHeight(Math.max(240, Math.round(rail.offsetHeight - below)));
    };

    measure();

    // Rail height moves with the viewport (link text wraps at narrower widths),
    // so re-measure rather than reading it once on mount.
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    mq.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      mq.removeEventListener("change", measure);
    };
  }, [sections]);

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

  // A jump link tapped while collapsed used to land in the wrong place: the
  // browser scrolled immediately, while the article was still growing under
  // it. Expand first, let the max-height transition finish, then scroll.
  useEffect(() => {
    if (!expanded || !pendingId.current) return;
    const id = pendingId.current;
    const timer = setTimeout(() => {
      pendingId.current = null;
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 520);
    return () => clearTimeout(timer);
  }, [expanded]);

  const jumpTo = useCallback(
    (e, id) => {
      e.preventDefault();
      setActiveId(id);
      if (expanded) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      pendingId.current = id;
      setExpanded(true);
    },
    [expanded]
  );

  // Collapsing from halfway down the article would otherwise leave the reader
  // stranded in the footer — bring them back to the top of the block.
  const toggle = useCallback(() => {
    setExpanded((wasExpanded) => {
      if (wasExpanded) {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return !wasExpanded;
    });
  }, []);

  if (!sections.length) return null;

  // `rest` is what the reader can jump to; `lead` titles the block. A city
  // document with a single section still renders — it just has no outline.
  const [lead, ...rest] = sections;

  const words = sections.reduce(
    (total, s) => total + (s.p ?? []).reduce((n, para) => n + para.split(/\s+/).length, 0),
    0
  );
  const readMinutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

  return (
    <section
      ref={sectionRef}
      aria-label={`About lab tests in ${city}`}
      className="scroll-mt-20 border-t border-slate-200/80 bg-linear-to-b from-white to-slate-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Block header — the prose used to start cold with an h2, so on a
            phone it read as leftover text rather than a guide worth opening.

            The heading is the lead section's own, so the block has exactly one
            title. The hardcoded "… Ki Poori Jaankari" that used to sit here was
            the weaker of the two anyway: this one carries the terms the page is
            actually trying to rank for. */}
        <header className="max-w-2xl">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-emerald-700 ring-1 ring-emerald-100">
            <BookOpen className="h-3 w-3" strokeWidth={2.6} />
            Guide
          </p>
          <h2 className="mt-3 text-balance text-xl min-[400px]:text-2xl sm:text-[28px] font-extrabold leading-tight tracking-tight text-slate-900">
            {lead.h}
          </h2>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] sm:text-[13.5px] text-slate-500">
            <span>Price, home collection, report aur kaunsa test kab karana hai</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11.5px] font-semibold text-slate-600 ring-1 ring-slate-200">
              <Clock3 className="h-3 w-3" strokeWidth={2.4} />
              {readMinutes} min read
            </span>
          </p>
        </header>

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,250px)_1fr] lg:gap-12">

          {/* RAIL — jump links, desktop only. Doubles as a visible outline of the
              page for crawlers and as navigation for a long read. The lead is
              absent by design: it is the title above, not somewhere to jump. */}
          <nav
            aria-label="On this page"
            className={`lg:sticky lg:top-24 lg:self-start ${rest.length ? "hidden lg:block" : "hidden"}`}
          >
            <div
              ref={railRef}
              className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-24px_rgba(15,23,42,0.25)] backdrop-blur-sm"
            >
              <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                <BookOpen className="h-3.5 w-3.5" strokeWidth={2.4} />
                On this page
              </p>

              <ul className="mt-4 space-y-0.5">
                {rest.map((s, i) => {
                  const isActive = activeId === s.id;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={(e) => jumpTo(e, s.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={`group relative flex items-start gap-2.5 rounded-lg py-2 pl-4 pr-2 text-[12.5px] leading-snug transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
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
                        <span
                          aria-hidden
                          className={`mt-px shrink-0 text-[10.5px] font-bold tabular-nums ${
                            isActive ? "text-emerald-600" : "text-slate-300"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="line-clamp-3">{s.h}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          <div className="min-w-0 max-w-3xl">

            {/* No outline on a phone. There used to be a tap-to-open jump list
                here, but on a narrow screen it was a bordered box of eleven
                full-sentence links standing between the reader and the first
                word of the article — chrome in the way of the thing they came
                for. The rail stays on desktop, where it costs nothing: it sits
                in a column the prose was never going to use. */}

            {/* PROSE — plain semantic h2/p so the copy indexes cleanly; the only
                styling is rhythm and a marker beside each heading.

                Collapsed state only clips the height — the full text stays in the
                DOM, so a crawler reads every word whether or not it is expanded. */}
            {/* No top margin — that gap existed to clear the outline box. Now
                the prose starts level with the rail on desktop. */}
            <div className="relative">
              <article
                ref={articleRef}
                id="lab-content"
                // Open: the measured height of the prose, so nothing is ever
                // cut off. Collapsed on desktop: measured off the rail so both
                // columns end on the same line. The classes are the pre-measure
                // and phone fallback.
                style={
                  expanded
                    ? openHeight
                      ? { maxHeight: `${openHeight}px` }
                      : { maxHeight: "none" }
                    : clampHeight
                      ? { maxHeight: `${clampHeight}px` }
                      : undefined
                }
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out motion-reduce:transition-none ${
                  // A 176px peek showed one heading and half a sentence, which
                  // read as broken rather than as a preview. Show a full first
                  // paragraph instead, so the teaser is worth reading on its own.
                  expanded ? "max-h-none" : "max-h-72 sm:max-h-80"
                }`}
              >
                {/* One wrapper around all the prose — the box the open height is
                    measured from. */}
                <div ref={contentRef}>
                  {/* Lead — no heading here, it is the <h2> above. Its id stays
                      so old links to #lab-test-in-varanasi still land. */}
                  <div id={lead.id} className="scroll-mt-24">
                    {(lead.p ?? []).map((para, j) => (
                      <p
                        key={j}
                        className="mt-3.5 pl-4 text-[13.5px] first:mt-0 sm:text-[15px] leading-[1.85] text-slate-600"
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  {rest.map((s) => (
                    <div
                      key={s.id}
                      id={s.id}
                      data-section
                      className="mt-8 scroll-mt-24 border-t border-slate-200/70 pt-8 sm:mt-10 sm:pt-10"
                    >
                      <h3 className="relative pl-4 text-[17px] sm:text-[20px] md:text-[22px] font-extrabold leading-snug tracking-tight text-balance text-slate-900">
                        <span
                          aria-hidden
                          className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-1 rounded-full bg-linear-to-b from-emerald-400 to-teal-500"
                        />
                        {s.h}
                      </h3>

                      {/* `?? []` — a section typed into Firestore without any
                          paragraphs should render its heading, not a 500. */}
                      {(s.p ?? []).map((para, j) => (
                        <p
                          key={j}
                          className="mt-3.5 pl-4 text-[13.5px] sm:text-[15px] leading-[1.85] text-slate-600"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </article>

              {/* Fade over the cut edge — signals "there is more" without a
                  hard line through a half-shown sentence. */}
              {!expanded && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-slate-50 via-slate-50/85 to-transparent"
                />
              )}
            </div>

            {/* Full width on a phone so it is a clear thumb target, inline on
                larger screens where a stretched button looks broken.

                `sm:ml-4` matches the `pl-4` every paragraph and heading carries,
                so the button's left edge lines up with the first letter of the
                prose instead of hanging 16px outside it. Left off below sm,
                where the button is w-full and the margin would push it past the
                right edge of the column. */}
            <button
              ref={buttonRef}
              type="button"
              onClick={toggle}
              aria-expanded={expanded}
              aria-controls="lab-content"
              className="group mt-5 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-3 text-[13px] font-bold text-white shadow-[0_10px_24px_-12px_rgba(5,150,105,0.7)] ring-1 ring-emerald-600/20 transition-all duration-200 hover:bg-emerald-700 hover:shadow-[0_14px_28px_-12px_rgba(5,150,105,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-[0.98] sm:ml-4 sm:inline-flex sm:w-auto sm:py-2.5 sm:text-[12.5px]"
            >
              {expanded ? "Read Less" : `Poora Guide Padhein — ${readMinutes} min`}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
                strokeWidth={2.6}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
