import Link from "next/link";
import { MapPin, Phone, ArrowRight, FlaskConical } from "lucide-react";

import { getLabCities } from "@/lib/labCities";

/**
 * Shown when /lab-test/<slug> names a city we do not serve.
 *
 * SEO intent (this is a *real* 404 — page.js already sends robots:noindex for
 * an unknown slug, so the body is never indexed):
 *   • It must NOT redirect to Varanasi. A 200 on a mistyped URL is a soft-404 —
 *     Google crawls the dead URL forever and the content never matches it.
 *   • It IS a recovery page: every path out of it points at a page that ranks —
 *     the live cities, the tests those cities offer, and the site's key pages —
 *     so a lost visitor (and the crawler following them) lands somewhere useful
 *     instead of bouncing. The footer under this page adds the rest of the mesh.
 *
 * `cities[0]` is the flagship (getLabCities sorts by `order`); its popular tests
 * and phone drive the secondary CTAs so this page needs no hardcoded city.
 */
export default async function LabCityNotFound() {
  const cities = await getLabCities();
  const flagship = cities[0] ?? null;
  const popularTests = flagship?.footer?.popularTests ?? [];
  const phone = flagship?.footer?.phone ?? "";

  return (
    <section className="bg-gradient-to-b from-emerald-50/70 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16">

        {/* ── Message ─────────────────────────────────────────────────────── */}
        <div className="text-center">
          <span className="mx-auto flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-linear-to-br from-emerald-600 to-teal-600 text-white ring-6 ring-white shadow-[0_10px_24px_-12px_rgba(5,150,105,0.9)]">
            <MapPin className="h-5.5 w-5.5 sm:h-6 sm:w-6" strokeWidth={2.2} />
          </span>

          <h1 className="mt-4 text-balance text-xl min-[400px]:text-2xl sm:text-[28px] font-extrabold tracking-tight text-slate-900">
            We are not in this city yet
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-balance text-[13px] sm:text-[14.5px] leading-relaxed text-slate-500">
            Home sample collection is not live at this address yet. You can still
            book a lab test with free home collection in the cities we serve
            today — pick one below.
          </p>
        </div>

        {/* ── Cities we serve (primary recovery) ──────────────────────────── */}
        <div className="mt-7">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
            Cities We Serve
          </h2>
          <ul className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/lab-test/${city.slug}`}
                  className="group inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-5 text-[13px] font-bold text-white shadow-[0_6px_16px_-8px_rgba(5,150,105,0.9)] hover:bg-emerald-700 active:scale-[0.98] transition-all duration-200"
                >
                  Lab Test in {city.name}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    strokeWidth={2.4}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Popular tests in the flagship city (keyword-rich internal links) ─
            Real anchor text ("Full Body Checkup in Varanasi") pointing at a page
            that ranks — the kind of link that makes a 404 useful to a crawler,
            not just a dead end. */}
        {flagship && popularTests.length > 0 && (
          <div className="mt-9">
            <h2 className="text-center text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
              Popular Tests in {flagship.name}
            </h2>
            <ul className="mx-auto mt-3 flex max-w-2xl flex-wrap items-center justify-center gap-2">
              {popularTests.map((test) => (
                <li key={test}>
                  {/* No `#book` — the form sits in the hero, so the top of the
                      page is already the form. The hash only ended up in the
                      address bar. */}
                  <Link
                    href={`/lab-test/${flagship.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[12.5px] font-semibold text-slate-700 ring-1 ring-emerald-200 hover:text-emerald-700 hover:ring-emerald-400 transition-colors"
                  >
                    <FlaskConical className="h-3.5 w-3.5 text-emerald-600 shrink-0" strokeWidth={2.1} />
                    {test} in {flagship.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Honest call option ──────────────────────────────────────────────
            Areas next to a served city are often covered even when the exact
            slug is not — so a call can still help, without promising service we
            do not run. */}
        {phone && (
          <div className="mt-9 mx-auto max-w-md rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 px-4 py-4 text-center ring-1 ring-emerald-100">
            <p className="text-[13px] font-medium text-slate-600">
              Live near one of these cities? We may already collect from your area.
            </p>
            <a
              href={`tel:${String(phone).replace(/\s/g, "")}`}
              aria-label={`Call us at ${phone}`}
              className="mt-2.5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[13px] font-bold text-emerald-700 ring-1 ring-emerald-200 hover:ring-emerald-400 active:scale-[0.98] transition-all duration-200"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
              Call to check your area
            </a>
          </div>
        )}

        {/* ── Quick links to key pages ────────────────────────────────────── */}
        <nav
          aria-label="Site links"
          className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-[12.5px] font-semibold text-emerald-700"
        >
          <Link href="/" className="hover:text-emerald-900 transition-colors">Home</Link>
          <span aria-hidden className="h-1 w-1 rounded-full bg-emerald-300" />
          <Link href="/about" className="hover:text-emerald-900 transition-colors">About Us</Link>
          <span aria-hidden className="h-1 w-1 rounded-full bg-emerald-300" />
          <Link href="/contact" className="hover:text-emerald-900 transition-colors">Contact Us</Link>
        </nav>

      </div>
    </section>
  );
}
