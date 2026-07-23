// SSR component — no 'use client' needed.
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * `city` is the full Firestore document — its `footer` key carries the tagline,
 * popular tests and contact details (see defaultFooter in labDefaults.js).
 * `otherCities` is every *other* live city, already filtered by the layout —
 * real cross-links, while this city's own areas stay plain text, because a
 * link to a page that does not exist yet helps nobody.
 */
export default function LabFooter({ city, otherCities = [] }) {
  const areas = city?.areas ?? [];
  const footer = city?.footer ?? {};
  const popularTests = footer.popularTests ?? [];

  return (
    <footer id="footer-section" className="relative mt-6 bg-gradient-to-b from-emerald-50/60 via-teal-50/40 to-white border-t border-emerald-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-12">

        {/* BRAND */}
        <div className="lg:col-span-3">
          <Link href="/" aria-label="MedicoBharat Lab Test — Home" className="inline-block">
            <Image
              src="/navbar/lablogo.png"
              alt="MedicoBharat Lab Test Logo"
              width={260}
              height={76}
              className="h-12 sm:h-14 w-auto object-contain cursor-pointer mb-2"
            />
          </Link>
          <p className="text-[13px] text-slate-600 leading-6 max-w-xs">
            {footer.tagline}
          </p>
        </div>

        {/* AREAS + OTHER CITIES (SEO) */}
        <div className="lg:col-span-3">
          <h4 className="text-sm font-semibold text-emerald-900 mb-2.5">
            Areas We Cover in {city.name}
          </h4>

          {/* Localities as text: the keywords index, and nobody hits a 404 */}
          <p className="text-sm leading-6 text-slate-600">
            {areas.length > 0
              ? `${areas.join(" · ")} and nearby areas.`
              : `${city.name} and nearby areas.`}
          </p>

          {otherCities.length > 0 && (
            <>
              <h4 className="mt-4 text-sm font-semibold text-emerald-900 mb-2.5">Other Cities</h4>
              <ul className="space-y-1.5 text-sm text-slate-600">
                {otherCities.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/lab-test/${c.slug}`}
                      className="hover:text-emerald-700 transition-colors"
                    >
                      Lab Test in {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* POPULAR TESTS (SEO) */}
        <div className="lg:col-span-3">
          <h4 className="text-sm font-semibold text-emerald-900 mb-2.5">
            Popular Tests in {city.name}
          </h4>
          {/* No "#tests" fragment — it put a hash in the address bar that the
              canonical URL does not carry, and the two reading differently is
              exactly the kind of thing that looks like a bug in an SEO audit. */}
          <ul className="space-y-1.5 text-sm text-slate-600">
            {popularTests.map((t) => (
              <li key={t}>
                <Link
                  href={`/lab-test/${city.slug}`}
                  className="hover:text-emerald-700 transition-colors"
                >
                  {t} in {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div className="lg:col-span-3">
          <h4 className="text-sm font-semibold text-emerald-900 mb-2.5">Contact</h4>

          <div className="space-y-2 text-sm text-slate-600">
            <a
              href={`tel:${String(footer.phone ?? "").replace(/\s/g, "")}`}
              aria-label={`Call us at ${footer.phone}`}
              className="flex items-center gap-2 hover:text-emerald-700 transition-colors"
            >
              <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="tabular-nums">{footer.phone}</span>
            </a>
            <a href={`mailto:${footer.email}`} className="flex items-center gap-2 hover:text-emerald-700 transition-colors">
              <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="break-all">{footer.email}</span>
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              {city.name}, {city.state}
            </div>
            {/* Hours as text, not an image — local search reads this line */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
              {footer.hours}
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT — same emerald wash as the rest of the footer, one shade
          deeper, so the bar reads as the end of the page rather than a
          different site. The year is computed, not typed, so it never goes stale.

          The two legal links are not decoration: the booking form on this page
          collects a name, a mobile number and a full home address, and the DPDP
          Act 2023 requires the privacy notice to be reachable from where that
          collection happens. Do not remove them without replacing them. */}
      <div className="border-t border-emerald-100 bg-emerald-50/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col items-center gap-1.5 text-[11.5px] sm:text-[12.5px] text-slate-500 sm:flex-row sm:justify-between">
          <p className="text-center">
            © {new Date().getFullYear()} MedicoBharat. All Rights Reserved.
          </p>

          <nav aria-label="Legal" className="flex items-center gap-2">
            <Link href="/privacy" className="hover:text-emerald-700 transition-colors">
              Privacy Policy
            </Link>
            <span aria-hidden className="h-1 w-1 rounded-full bg-emerald-300" />
            <Link href="/terms" className="hover:text-emerald-700 transition-colors">
              Terms &amp; Conditions
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
