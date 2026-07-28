// SSR component — no 'use client' needed.
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaYoutube,
  FaXTwitter,
  FaGlobe,
} from "react-icons/fa6";

/**
 * Brand-icon registry for the footer's social row. Keyed by the `type` string
 * stored in footer.social (see defaultFooter in labDefaults.js) so the data
 * stays icon-agnostic — a type with no match here renders a neutral globe
 * instead of a blank gap. `brand` tints the hover to each platform's colour.
 */
const SOCIAL_ICONS = {
  instagram: { Icon: FaInstagram, brand: "hover:bg-[#E1306C]" },
  facebook: { Icon: FaFacebookF, brand: "hover:bg-[#1877F2]" },
  whatsapp: { Icon: FaWhatsapp, brand: "hover:bg-[#25D366]" },
  youtube: { Icon: FaYoutube, brand: "hover:bg-[#FF0000]" },
  twitter: { Icon: FaXTwitter, brand: "hover:bg-black" },
  x: { Icon: FaXTwitter, brand: "hover:bg-black" },
};

/**
 * Footer navigation to the site's key pages. EVERY href here must be a route
 * that actually renders — a footer link that 404s bleeds crawl budget and
 * trust. These five are verified live (/, /about, /contact, /privacy, /terms);
 * do not add /blogs or a city medicine page here until that route exists.
 */
const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

/**
 * `city` is the full Firestore document — its `footer` key carries the tagline,
 * popular tests and contact details (see defaultFooter in labDefaults.js).
 * `otherCities` is every *other* live city, already filtered by the layout —
 * real cross-links, while this city's own areas stay plain text, because a
 * link to a page that does not exist yet helps nobody.
 */
export default function LabFooter({ city, otherCities = [], medicineCities = [] }) {
  const areas = city?.areas ?? [];
  const footer = city?.footer ?? {};
  const social = (footer.social ?? []).filter((s) => s && s.href);

  // A town served by BOTH sections — matched on slug, so /lab-test/deoria finds
  // /medicine-delivery/deoria. Surfaced first and styled a shade stronger: it is
  // the most relevant link in this block, and the only one that keeps the reader
  // in their own town. Varanasi has no medicine page today, so it simply lists
  // the towns that do rather than showing nothing.
  const sameTown = medicineCities.find((c) => c.slug === city?.slug) ?? null;
  const otherTowns = medicineCities.filter((c) => c.slug !== sameTown?.slug);

  return (
    <footer id="footer-section" className="relative mt-2 sm:mt-4 bg-gradient-to-b from-emerald-50/60 via-teal-50/40 to-white border-t border-emerald-100">
      {/* One real <h2> for the whole footer landmark. It is screen-reader only,
          but it gives the footer's <h3> column titles a parent to sit under —
          an <h4> with no h2/h3 above it is the kind of broken heading order an
          SEO audit flags. Keyword-bearing, so it earns its place in the outline. */}
      <h2 className="sr-only">
        MedicoBharat — Lab Tests &amp; Health Checkups at Home in {city.name}
      </h2>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 sm:py-4 grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2.5 sm:gap-y-4 lg:grid-cols-12">

        {/* BRAND — full width on phones (it is the tallest block; letting it
            span both columns keeps the four short sections below it aligned in a
            tidy 2×2 instead of leaving a ragged gap beside it). */}
        <div className="col-span-2 lg:col-span-3">
          <Link href="/" aria-label="MedicoBharat Lab Test — Home" className="inline-block">
            <Image
              src="/navbar/lablogo.png"
              alt={`MedicoBharat — Lab Test in ${city.name}`}
              width={260}
              height={76}
              className="h-8 sm:h-10 w-auto object-contain cursor-pointer mb-1 sm:mb-1.5"
            />
          </Link>
          <p className="text-[12px] text-slate-600 leading-5 max-w-xs">
            {footer.tagline}
          </p>

          {/* SOCIAL — real profiles from footer.social, left-aligned to match
              the rest of the footer. `flex-wrap` lets the row reflow on a narrow
              phone. Each is a 40px tap target that fills with the platform's
              colour on hover. */}
          {social.length > 0 && (
            <ul className="mt-2 sm:mt-3 flex flex-wrap gap-2">
              {social.map((s) => {
                const { Icon, brand } = SOCIAL_ICONS[s.type] ?? {
                  Icon: FaGlobe,
                  brand: "hover:bg-emerald-600",
                };
                return (
                  <li key={s.label ?? s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label ?? s.type ?? "Social profile"}
                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-white text-emerald-700 ring-1 ring-emerald-200 shadow-[0_2px_6px_-3px_rgba(6,78,59,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:text-white hover:ring-transparent active:scale-95 ${brand}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* QUICK LINKS — the footer is a site's second sitemap: it passes link
            equity to the pages that matter and gives a crawler a route to each
            from every lab page. Only routes that actually exist are listed, so
            no link here can 404. */}
        <nav aria-label="Quick links" className="lg:col-span-2">
          <h3 className="text-[13px] font-semibold text-emerald-900 mb-2">Quick Links</h3>
          <ul className="space-y-1 text-[12.5px] text-slate-600">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-emerald-700 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* AREAS + OTHER CITIES (SEO) */}
        <div className="lg:col-span-2">
          <h3 className="text-[13px] font-semibold text-emerald-900 mb-2">
            Areas We Cover in {city.name}
          </h3>

          {/* Localities as text: the keywords index, and nobody hits a 404 */}
          <p className="text-[12.5px] leading-5 text-slate-600">
            {areas.length > 0
              ? `${areas.join(" · ")} and nearby areas.`
              : `${city.name} and nearby areas.`}
          </p>

          {otherCities.length > 0 && (
            <nav aria-label="Cities we serve">
              <h3 className="mt-3 text-[13px] font-semibold text-emerald-900 mb-2">Other Cities</h3>
              <ul className="space-y-1 text-[12.5px] text-slate-600">
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
            </nav>
          )}

        </div>

        {/* MEDICINE DELIVERY — takes the column "Popular Tests in <city>" used
            to occupy, which keeps the row at a balanced 3+2+2+2+3 of twelve.
            Those popular-test links were the cheapest in the footer anyway:
            they scrolled to the form on this same page rather than pointing at
            another URL, and the test names are still on the page as the cards
            themselves. These links do reach somewhere new — before them, the
            lab section carried no link at all into /medicine-delivery/*.

            The same-town page goes first and is weighted a shade stronger: it
            is the one a reader here actually wants, since someone booking a
            blood test in Deoria is the same person who needs the prescription
            filled in Deoria. */}
        {medicineCities.length > 0 && (
          <nav aria-label="Medicine delivery" className="lg:col-span-2">
            <h3 className="text-[13px] font-semibold text-emerald-900 mb-2">
              Medicine Delivery
            </h3>
            <ul className="space-y-1 text-[12.5px] text-slate-600">
              {sameTown && (
                <li>
                  <Link
                    href={`/medicine-delivery/${sameTown.slug}`}
                    className="font-medium text-emerald-800 hover:text-emerald-700 transition-colors"
                  >
                    Medicine Delivery in {sameTown.name}
                  </Link>
                </li>
              )}
              {otherTowns.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/medicine-delivery/${c.slug}`}
                    className="hover:text-emerald-700 transition-colors"
                  >
                    Medicine Delivery in {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* CONTACT / NAP — a semantic <address> so the crawler reads it as the
            business's contact block, and the name + locality here match the
            DiagnosticLab schema on the page (see page.js). Consistent NAP across
            page, schema and footer is what local ranking is built on. No street
            address is invented — only what we can stand behind is printed. */}
        <div className="lg:col-span-3">
          <h3 className="text-[13px] font-semibold text-emerald-900 mb-2">Contact</h3>

          <address className="not-italic space-y-1.5 text-[12.5px] text-slate-600">
            <p className="font-semibold text-slate-700">
              MedicoBharat — Lab Test in {city.name}
            </p>
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
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              {city.name}, {city.state}
            </p>
            {/* Hours as text, not an image — local search reads this line */}
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
              {footer.hours}
            </p>
          </address>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5 flex flex-col items-center gap-0.5 sm:gap-1 text-[11px] sm:text-[12px] text-slate-500 sm:flex-row sm:justify-between">
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
