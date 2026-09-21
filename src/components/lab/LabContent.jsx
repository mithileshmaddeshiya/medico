'use client'

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { linkTitle } from "@/lib/linkTitle";
import Link from "next/link";
import { ArrowUpRight, BookOpen, ChevronDown, Clock3 } from "lucide-react";

/**
 * Long-form SEO block. Everything the crawler reads comes in as `sections`,
 * from the city document or its generated default — see defaultContent in
 * src/data/lab/defaults.js.
 *
 * Shape: { id, h, p: [paragraph, ...] } — `id` doubles as the anchor target,
 * and the layout plus the "On this page" rail build themselves from the array.
 *
 * A paragraph is USUALLY a plain string. It may also be an array of parts, so a
 * city can put a real internal link inside its prose:
 *
 *   p: [
 *     "Kaun sa test kab karana chahiye, wo ",
 *     { text: "is guide me likha hai", href: "/blogs/lab-test/varanasi" },
 *     ".",
 *   ]
 *
 * That matters more than it looks: a contextual link inside a sentence carries
 * its anchor text as a topical signal, which a footer link column does not. The
 * string form stays valid, so every existing city renders unchanged.
 *
 * The FIRST section is the lead: its heading is the block's own <h2> and its
 * paragraphs are the intro. It used to render as one more <h3> underneath a
 * hardcoded "… Ki Poori Jaankari" <h2>, which put two near-identical headings
 * back to back — on a phone that was six lines of bold text before a single
 * sentence of content. It is also left out of the rail, because a page listing
 * its own title as a jump link is a link to where the reader already is.
 *
 * ── `related` — THE IN-BODY LINK BLOCK ───────────────────────────────────
 * Same `{ heading, intro?, groups: [{ title, links: [{href, label, sub?}] }] }`
 * shape LabRelatedLinks takes — the city's `relatedLinks` field on a city page,
 * `homeRelatedLinks()` on the home page. It is rendered HERE, at the end of the
 * guide, instead of as its own full-width band underneath: the pages had grown
 * into a stack of separately-titled sections, and a reader who has just
 * finished the guide is already at the bottom of this column — that is where
 * somewhere-to-go-next belongs, not in a new band with its own heading.
 *
 * It sits INSIDE the collapsible <article>, at the end of the prose, so it is
 * clipped with everything else and only appears once the reader has pressed
 * "Poora Guide Padhein" — on desktop and on phones alike. A collapsed page is
 * the offer; the links are for the reader who chose to keep reading.
 *
 * Clipped, NOT conditionally mounted — `{expanded && …}` would keep every one
 * of these hrefs out of the HTML until a click, and this block is the main
 * thing linking a city page to its guides. Under the clamp they are still in
 * the markup, so a crawler follows them without expanding anything.
 *
 * LabRelatedLinks is still the standalone band, for the blog posts. Pass
 * `related` here only where the page should not have a second band; passing
 * both would duplicate every link on one page.
 */

// Average Hindi/Hinglish reading speed on a phone, rounded down deliberately —
// an under-promise here reads better than "12 min" over a wall of text.
const WORDS_PER_MINUTE = 180;

/** A paragraph in part form; a plain string is a single-part paragraph. */
const partsOf = (para) => (Array.isArray(para) ? para : [para]);

/** Just the words of a paragraph — used for the read-time estimate. */
const paraText = (para) =>
  partsOf(para)
    .map((part) => (typeof part === "string" ? part : (part?.text ?? "")))
    .join("");

/**
 * One paragraph, with any `{ text, href }` parts rendered as internal links.
 *
 * next/link so the click is a client navigation like every other link on the
 * site; the href is still a real <a href> in the HTML, which is all a crawler
 * needs. Underlined rather than colour-only, so the link is distinguishable
 * without relying on colour alone.
 */
function Paragraph({ para, className }) {
  return (
    <p className={className}>
      {partsOf(para).map((part, i) => {
        if (typeof part === "string") return <Fragment key={i}>{part}</Fragment>;
        if (part?.href) {
          return (
            <Link
              key={i}
              href={part.href}
              title={part.title ?? linkTitle(part.href)}
              className="font-semibold text-emerald-700 underline underline-offset-2 decoration-emerald-300 transition-colors hover:text-emerald-800 hover:decoration-emerald-600"
            >
              {part.text}
            </Link>
          );
        }
        return <Fragment key={i}>{part?.text ?? ""}</Fragment>;
      })}
    </p>
  );
}

export default function LabContent({ city, sections = [], related = null }) {
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

  // A group with an empty `links` array would render a heading over nothing.
  const relatedGroups = (related?.groups ?? []).filter((g) => g?.links?.length);

  const words = sections.reduce(
    (total, s) =>
      total + (s.p ?? []).reduce((n, para) => n + paraText(para).split(/\s+/).length, 0),
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

        <div className="mt-5 grid gap-6 sm:mt-6 lg:mt-8 lg:grid-cols-[minmax(0,250px)_1fr] lg:gap-12">

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
                        title={`Jump to: ${s.h}`}
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
                      so old links to #lab-test-in-varanasi still land.

                      ── THE PROSE IS TIGHTER ON A PHONE, DELIBERATELY ─────
                      Line height 1.65 below 640px against 1.85 above it, the
                      gap between paragraphs 10px against 14px, and the gap
                      under the header 20px against 24px. One set of numbers
                      cannot serve both widths: 1.85 is right for a 15px line
                      running most of a laptop column, but the phone line is
                      13.5px and about seven words long, so the same ratio put
                      more air between the lines than there was ink on them and
                      the guide read as a heap of loose sentences rather than
                      paragraphs. 1.65 is still clear of the 1.5 floor for body
                      text — this is tightening, not cramming, and it should
                      not go below that.
                      Every one of these is a responsive PAIR. Editing one half
                      silently changes the other viewport too; keep both. */}
                  <div id={lead.id} className="scroll-mt-24">
                    {(lead.p ?? []).map((para, j) => (
                      <Paragraph
                        key={j}
                        para={para}
                        /* `sm:first:mt-0` is not redundant next to `first:mt-0`:
                           the paragraph gap is a responsive pair now, and a
                           plain `first:` utility sits OUTSIDE the sm media
                           block, so `sm:mt-3.5` would win back inside it and
                           push the first line of the guide down on desktop. */
                        className="mt-2.5 sm:mt-3.5 first:mt-0 sm:first:mt-0 pl-4 text-[13.5px] sm:text-[15px] leading-[1.65] sm:leading-[1.85] text-slate-600"
                      />
                    ))}
                  </div>

                  {rest.map((s) => (
                    <div
                      key={s.id}
                      id={s.id}
                      data-section
                      className="mt-7 scroll-mt-24 border-t border-slate-200/70 pt-7 sm:mt-10 sm:pt-10"
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
                        <Paragraph
                          key={j}
                          para={para}
                          className="mt-2.5 pl-4 sm:mt-3.5 text-[13.5px] sm:text-[15px] leading-[1.65] sm:leading-[1.85] text-slate-600"
                        />
                      ))}
                    </div>
                  ))}

                  {/* ── WHERE TO GO NEXT ──────────────────────────────────
                      What used to be the LabRelatedLinks band below this
                      section. Folded in here it costs the page one heading
                      and one band of chrome instead of two, and it lands
                      where the reader already is — at the end of the guide
                      they just finished.

                      INSIDE the clipped article on purpose, so it only
                      appears once the reader presses "Poora Guide Padhein" —
                      at every width, phones included. A page that has not
                      been expanded is a price list and a booking form, not a
                      wall of links. It is still in the HTML either way, which
                      is the whole reason it is clipped rather than mounted on
                      `expanded`: a crawler reads every one of these hrefs
                      without a click, exactly as it reads the prose above.

                      The cards are gone with the band: inside the reading
                      column a white card on white would be a box around a
                      box. Hairline-divided rows carry the same "this is an
                      index" reading, and the headings reuse the accent-bar
                      pairing the prose uses above. */}
                  {relatedGroups.length > 0 && (
                    <div className="mt-7 border-t border-slate-200/70 pt-7 sm:mt-10 sm:pt-10">
                      <h3 className="relative pl-4 text-[17px] sm:text-[20px] md:text-[22px] font-extrabold leading-snug tracking-tight text-balance text-slate-900">
                        <span
                          aria-hidden
                          className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-1 rounded-full bg-linear-to-b from-emerald-400 to-teal-500"
                        />
                        {related.heading}
                      </h3>

                      {related.intro && (
                        <p className="mt-2.5 pl-4 sm:mt-3.5 text-[13.5px] sm:text-[15px] leading-[1.65] sm:leading-[1.85] text-slate-600">
                          {related.intro}
                        </p>
                      )}

                      {/* Two columns, not the band's three: this column is
                          narrower than the full page was, and a third would
                          leave every link wrapping onto three lines. */}
                      <div className="mt-6 grid gap-x-8 gap-y-7 pl-4 sm:grid-cols-2">
                        {relatedGroups.map((group) => (
                          <nav key={group.title} aria-label={group.title}>
                            <h4 className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.13em] text-emerald-700">
                              <span
                                aria-hidden
                                className="h-3.5 w-1 rounded-full bg-linear-to-b from-emerald-400 to-teal-500"
                              />
                              {group.title}
                            </h4>

                            {/* `-mx-2` lets a row's hover tint run past the
                                text to the edges of the column, so the whole
                                row reads as the target rather than the words
                                in it. */}
                            <ul className="mt-2 -mx-2 divide-y divide-slate-100">
                              {group.links.map(({ href, label, sub }) => (
                                <li key={href}>
                                  <Link
                                    href={href}
                                    title={sub ?? linkTitle(href)}
                                    className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors duration-200 hover:bg-emerald-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                  >
                                    <span className="min-w-0 flex-1">
                                      <span className="block text-[12.5px] sm:text-[13px] font-semibold leading-snug text-slate-800 transition-colors group-hover:text-emerald-800">
                                        {label}
                                      </span>
                                      {sub && (
                                        <span className="mt-0.5 block text-[11.5px] leading-snug text-slate-500">
                                          {sub}
                                        </span>
                                      )}
                                    </span>
                                    <ArrowUpRight
                                      aria-hidden
                                      className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-600"
                                      strokeWidth={2.6}
                                    />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </nav>
                        ))}
                      </div>
                    </div>
                  )}
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
