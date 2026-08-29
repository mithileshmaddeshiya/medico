// SSR component — plain links, no state, nothing to hydrate.
import Link from "next/link";
import { linkTitle } from "@/lib/linkTitle";
import { ArrowUpRight } from "lucide-react";

/**
 * Standalone internal-link band. No groups, no block.
 *
 * WHERE IT IS USED. The blog posts, and nothing else. The lab city pages and
 * the home page used to render it under LabContent; both now pass the same
 * object into LabContent's `related` prop instead, which renders the identical
 * link list at the end of the guide's reading column rather than as a second
 * full-width band. Do not add it back to a page that already does that: the
 * page would carry every one of these links twice.
 *
 * A blog post has no LabContent to fold it into, which is why the band still
 * exists.
 *
 * WHY A BLOCK AND NOT JUST MORE FOOTER LINKS. The footer already cross-links
 * the other cities, but a footer is boilerplate: it is byte-identical on every
 * page, so a crawler discounts it. This block is per-city, sits in the body,
 * and carries descriptive anchors ("Gorakhpur me lab test — OPD se pehle
 * report"), which is what actually passes a topical signal.
 *
 * It is also most of what links a city page into /blogs/* — those articles are
 * otherwise reachable from the header menu, the footer column and each other.
 *
 * Shape:
 *   relatedLinks: {
 *     heading, intro?,
 *     groups: [{ title, links: [{ href, label, sub? }] }],
 *   }
 *
 * EVERY href MUST be a route that renders. A block of links is a crawl path;
 * one 404 in it wastes crawl budget on every city page that carries it.
 *
 * ── HOW IT IS BUILT ──────────────────────────────────────────────────────
 * Each link is a full-width ROW, not a run of underlined text: the whole row
 * highlights on hover and the arrow is pinned to the right edge. That is what
 * makes a two-line entry (label + `sub`) read as one target instead of a
 * heading with a stray arrow floating beside its first line — and it gives a
 * thumb something the width of the card to hit rather than the text itself.
 *
 * The group titles reuse the site's small-caps label style (the same one on
 * LabContent's rail and its "Guide" pill), so this block looks like part of
 * the same page rather than a link dump bolted to the bottom of it.
 */
export default function LabRelatedLinks({ related }) {
  const groups = (related?.groups ?? []).filter((g) => g?.links?.length);
  if (!groups.length) return null;

  return (
    <section
      aria-labelledby="lab-related-heading"
      className="border-t border-slate-200/80 bg-linear-to-b from-slate-50/80 to-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-9 sm:py-12">

        <h2
          id="lab-related-heading"
          className="text-balance text-lg min-[400px]:text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900"
        >
          {related.heading}
        </h2>

        {related.intro && (
          <p className="mt-2 max-w-xl text-[12.5px] sm:text-[13.5px] leading-relaxed text-slate-500">
            {related.intro}
          </p>
        )}

        {/* `items-stretch` is the grid default and is what keeps the cards the
            same height when one group has four links and another has two. */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <nav
              key={group.title}
              aria-label={group.title}
              className="rounded-2xl bg-white p-4 sm:p-5 ring-1 ring-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_30px_-24px_rgba(15,23,42,0.35)] transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_36px_-24px_rgba(15,23,42,0.45)]"
            >
              {/* Accent bar + small caps — the same pairing the long-form
                  block's headings use, so the two read as one system. */}
              <h3 className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.13em] text-emerald-700">
                <span
                  aria-hidden
                  className="h-3.5 w-1 rounded-full bg-linear-to-b from-emerald-400 to-teal-500"
                />
                {group.title}
              </h3>

              {/* Hairlines between rows, not gaps: a divided list reads as an
                  index, which is what this is. `-mx-*` lets each row's hover
                  tint run the full width of the card's padding box. */}
              <ul className="mt-3 -mx-2 divide-y divide-slate-100">
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

                      {/* Pinned right and vertically centred on the row, so it
                          points at the row rather than at the first line. */}
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
    </section>
  );
}
