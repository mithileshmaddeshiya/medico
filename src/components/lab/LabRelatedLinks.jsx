// SSR component — plain links, no state, nothing to hydrate.
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Internal-link block for a lab city, rendered from the city's optional
 * `relatedLinks` field (see buildContent in src/data/lab/cities.js). No field,
 * no block — Varanasi renders exactly as before.
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
 */
export default function LabRelatedLinks({ related }) {
  const groups = (related?.groups ?? []).filter((g) => g?.links?.length);
  if (!groups.length) return null;

  return (
    <section
      aria-labelledby="lab-related-heading"
      className="border-t border-slate-200/80 bg-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-9 sm:py-12">

        <h2
          id="lab-related-heading"
          className="text-balance text-lg min-[400px]:text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900"
        >
          {related.heading}
        </h2>

        {related.intro && (
          <p className="mt-2 max-w-2xl text-[12.5px] sm:text-[13.5px] leading-relaxed text-slate-500">
            {related.intro}
          </p>
        )}

        <div className="mt-6 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <nav
              key={group.title}
              aria-label={group.title}
              className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 sm:p-5"
            >
              <h3 className="text-[13px] font-bold text-emerald-900">
                {group.title}
              </h3>

              <ul className="mt-3 space-y-2">
                {group.links.map(({ href, label, sub }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group flex items-start gap-1.5 text-[12.5px] sm:text-[13px] font-medium leading-snug text-slate-700 transition-colors hover:text-emerald-700"
                    >
                      <span className="min-w-0">
                        {label}
                        {sub && (
                          <span className="mt-0.5 block text-[11.5px] font-normal text-slate-500">
                            {sub}
                          </span>
                        )}
                      </span>
                      <ArrowUpRight
                        aria-hidden
                        className="mt-px h-3.5 w-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-emerald-600"
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
