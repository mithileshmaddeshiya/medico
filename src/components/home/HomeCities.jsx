// SSR component — plain links, nothing to hydrate.
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

/**
 * The cities we serve, as cards that link into /lab-test/<slug>.
 *
 * ── WHY THIS IS THE MOST IMPORTANT BLOCK ON THE HOME PAGE ────────────────
 * The home page is the strongest page on the domain — it is what every
 * external link, every business listing and every brand search points at. What
 * it links to is what gets crawled first and ranked hardest. These three cards
 * are how that strength reaches the pages that actually earn bookings.
 *
 * The anchors are descriptive on purpose ("Varanasi me lab test", not
 * "Varanasi"): the anchor text is the topical signal, and a bare city name
 * tells a crawler nothing about what the destination page is for.
 *
 * The localities under each card are plain text, never links. They index as
 * keywords — "Sarnath me blood test" is a real query — and there is no page
 * behind a locality, so linking them would be inventing 30 URLs that 404.
 *
 * `cities` comes from the live list (src/data/lab/cities.js) through the page,
 * so an unpublished city disappears from here rather than leaving a dead card
 * on the site's most linked page.
 */

// How many localities each card shows before "aur aas-paas ke ilaake". Enough
// for a reader to find their own; few enough that the three cards stay the
// same height on a desktop row.
const AREAS_SHOWN = 5;

export default function HomeCities({ data, cities = [] }) {
  if (!cities.length) return null;

  return (
    <section
      id="cities"
      aria-labelledby="home-cities-heading"
      className="border-t border-slate-100 bg-slate-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="home-cities-heading"
            className="text-balance text-xl min-[400px]:text-2xl sm:text-[28px] md:text-[32px] font-extrabold tracking-tight text-slate-900"
          >
            {data.heading}
          </h2>
          <p className="mt-2.5 text-[12.5px] sm:text-[14px] leading-relaxed text-slate-500">
            {data.intro}
          </p>
        </div>

        <ul className="mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => {
            const areas = city.areas ?? [];
            const shown = areas.slice(0, AREAS_SHOWN);
            const rest = areas.length - shown.length;

            return (
              <li key={city.slug}>
                {/* The whole card is one link. Two links to the same URL in one
                    card (a heading link and a "book now" link) is a pattern
                    crawlers collapse anyway, and on a phone a full-card target
                    is the difference between a tap that works and one that
                    lands in the gap between two elements. */}
                <Link
                  href={`/lab-test/${city.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:ring-emerald-300 hover:shadow-[0_18px_40px_-24px_rgba(6,78,59,0.5)]"
                >
                  {/* Emerald wash that warms on hover — the card's only motion
                      besides the lift, so it reads as a surface, not a banner. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-linear-to-br from-emerald-100/70 to-teal-50/40 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-70"
                  />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {/* h3 — the section's h2 is the heading above. */}
                      <h3 className="text-[17px] font-extrabold tracking-tight text-slate-900">
                        Lab Test in {city.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.2} />
                        {city.state}
                      </p>
                    </div>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition-all duration-300 group-hover:bg-linear-to-br group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:text-white group-hover:ring-transparent">
                      <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                    </span>
                  </div>

                  {shown.length > 0 && (
                    <p className="relative mt-3.5 text-[12px] leading-relaxed text-slate-500">
                      <span className="font-semibold text-slate-600">Ilaake: </span>
                      {shown.join(" · ")}
                      {rest > 0 && ` aur ${rest} aur ilaake`}
                    </p>
                  )}

                  <p className="relative mt-3.5 flex flex-wrap gap-x-2 gap-y-1 text-[11.5px] font-semibold text-emerald-700">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 ring-1 ring-emerald-100">
                      Free home collection
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 ring-1 ring-emerald-100">
                      Report 24 hrs
                    </span>
                  </p>

                  <span className="relative mt-auto pt-4 text-[12.5px] font-bold text-emerald-700 transition-colors group-hover:text-emerald-800">
                    Rate list aur booking dekhein →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
