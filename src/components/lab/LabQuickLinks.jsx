// SSR component — no 'use client', and no state anywhere in it.
import { ChevronDown } from "lucide-react";
import Link from "next/link";

/**
 * QUICK LINKS — the collapsed index band that closes every page.
 *
 * ── WHY <details> AND NOT A REACT ACCORDION ──────────────────────────────
 * The lab pages are Hinglish, so Chrome offers to translate them, and the
 * translator rewrites text nodes behind React's back. Every React-controlled
 * accordion on this site had to be guarded against that (see the removeChild
 * patch in src/app/layout.js). A native <details> needs no state, no hydration
 * and no guard: the browser opens it, React never re-renders it, and it works
 * with JS switched off. It is also the reason this file has no "use client".
 *
 * ── WHAT A CRAWLER SEES ──────────────────────────────────────────────────
 * Everything inside a closed <details> IS in the HTML and IS indexed — this is
 * not the same as `display:none` content. Google has said it may weight
 * collapsed content slightly lower, which is exactly the right trade here: this
 * is an index of links, not the page's argument. The links that have to carry
 * ranking weight are in the prose above and in the footer.
 *
 * ── EVERY href MUST RENDER ───────────────────────────────────────────────
 * Same rule as the footer: the city links are built from the live list, so a
 * city that is unpublished disappears from here with it, and nothing in this
 * band can 404. Do not add locality links — no locality has a page of its own.
 */

/**
 * One collapsed row. The summary carried a "(7 Cities)" count until the list was
 * small enough that the number undersold it — the pattern this was modelled on
 * says "(159 Cities)", where the figure IS the pull. At seven it is not, so the
 * title stands on its own.
 */
function Panel({ title, children }) {
  return (
    /* `overflow-hidden` is what makes this read as ONE box. Without it the
       summary's own background paints over the rounded corners and the open
       panel looks like two stacked cards — a white pill sitting on a tinted
       one. The radius lives here; nothing inside repeats it. */
    <details className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors duration-200 open:border-emerald-200 open:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_14px_34px_-26px_rgba(6,78,59,0.45)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[13px] sm:text-[13.5px] font-bold tracking-tight text-slate-900 transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 group-open:bg-emerald-50/60 group-open:text-emerald-900 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">{title}</span>
        <ChevronDown
          aria-hidden
          className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180 group-open:text-emerald-600"
          strokeWidth={2.4}
        />
      </summary>

      <div className="border-t border-emerald-100/80 px-4 py-3">{children}</div>
    </details>
  );
}

export default function LabQuickLinks({ cities = [], currentSlug = null }) {
  const published = cities.filter((c) => c?.slug && c?.name);
  if (!published.length) return null;

  /* The summary line carries "Diagnostic Centre in <City>" — one of the nine
     base terms in defaultKeywords() (src/data/lab/defaults.js), and a phrase
     that appears nowhere else in the visible copy of a city page. The city's own
     name goes in it where there is one, because "Diagnostic Centre in Mau" is
     what someone types; "Diagnostic Centre in Uttar Pradesh" is not.

     "& Nearby Cities" is not padding — the panel lists all seven, so a title
     naming only this city would describe something the box does not contain.
     Spelling is "Centre", the form every keyword in defaults.js already uses;
     switch both or neither, never one. */
  const current = published.find((c) => c.slug === currentSlug) ?? null;
  const panelTitle = current
    ? `Diagnostic Centre in ${current.name} & Nearby Cities`
    : "Diagnostic Centre in ";

  return (
    <section
      aria-labelledby="quick-links-heading"
      className="border-t border-slate-200/80 bg-slate-50/70"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* The accent bar is the same one the guide's headings carry (see
            LabContent) — it is what makes this band read as part of the site
            rather than a widget bolted to the bottom of it. */}
        <h2
          id="quick-links-heading"
          className="relative pl-4 text-lg sm:text-xl font-extrabold tracking-tight text-slate-900"
        >
          <span
            aria-hidden
            className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-1 rounded-full bg-linear-to-b from-emerald-400 to-teal-500"
          />
          Quick Links
        </h2>

        <div className="mt-4 space-y-2.5">
          <Panel title={panelTitle}>
            {/* Bare city names. They read as "Lab Test in <City>" to a screen
                reader — that is what `aria-label` on each row is for — but the
                visible anchor is the name alone, the same treatment the footer's
                city column got. The "lab test in <city>" phrase itself is not
                lost: it is the panel's own summary line, every city page's
                <title>, and the in-body anchors in the guide above.

                Flex-wrap, not a grid. A four-column grid divides the full 1152px
                container evenly, so once the labels became bare names — "Mau",
                "Ballia" — each sat alone in a 270px cell with 200px of empty
                space beside it. Wrapping packs them to their own width instead,
                and the row reads as one list rather than four sparse columns. */}
            <ul className="flex flex-wrap gap-x-1 gap-y-0.5">
              {published.map((c) => {
                const isCurrent = c.slug === currentSlug;

                // A page does not link to itself — that is noise in the link
                // graph. It still appears, so the count stays honest.
                if (isCurrent) {
                  return (
                    <li key={c.slug}>
                      <span className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px] leading-snug">
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
                        />
                        <span className="font-bold text-emerald-800">{c.name}</span>
                        <span className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-px text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                          Yahin
                        </span>
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={c.slug}>
                    <Link
                      href={`/lab-test/${c.slug}`}
                      aria-label={`Lab Test in ${c.name}`}
                      className="group/row flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px] leading-snug text-slate-700 transition-colors duration-200 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 transition-colors duration-200 group-hover/row:bg-emerald-500"
                      />
                      {c.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Panel>

          {/* An "Areas We Cover (70 Areas)" panel used to sit here, listing every
              city's localities. Removed. The localities are not lost: a city
              page's footer prints that city's own list as a full-width line, and
              the prose in src/data/lab/content/ names them where they are part
              of a sentence rather than part of a list. */}
        </div>

        {/* A "Home · About Us · Contact Us · Privacy Policy · Terms" row used to
            sit here. Removed: the footer starts a few pixels below this band and
            carries the same five links in its Quick Links column, with two of
            them repeated again in the copyright bar. A third copy in between was
            not navigation, it was noise. Those links are NOT lost — see
            QUICK_LINKS in src/components/lab/LabFooter.jsx. */}
      </div>
    </section>
  );
}
