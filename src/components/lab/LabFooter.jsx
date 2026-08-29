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
// Gmail has no fa6 brand glyph — the simple-icons pack is where it lives.
import { SiGmail } from "react-icons/si";

import { siteFooter } from "@/data/lab/defaults";

/**
 * Brand-icon registry for the footer's social row. Keyed by the `type` string
 * stored in footer.social (see defaultFooter in src/data/lab/defaults.js) so
 * the data stays icon-agnostic — a type with no match here renders a neutral
 * globe instead of a blank gap. `brand` tints the hover to each platform's
 * colour.
 */
const SOCIAL_ICONS = {
  instagram: { Icon: FaInstagram, brand: "hover:bg-[#E1306C]" },
  facebook: { Icon: FaFacebookF, brand: "hover:bg-[#1877F2]" },
  whatsapp: { Icon: FaWhatsapp, brand: "hover:bg-[#25D366]" },
  gmail: { Icon: SiGmail, brand: "hover:bg-[#EA4335]" },
  youtube: { Icon: FaYoutube, brand: "hover:bg-[#FF0000]" },
  twitter: { Icon: FaXTwitter, brand: "hover:bg-black" },
  x: { Icon: FaXTwitter, brand: "hover:bg-black" },
};

/**
 * Footer navigation to the site's key pages. EVERY href here must be a route
 * that actually renders — a footer link that 404s bleeds crawl budget and
 * trust. These five are verified live (/, /about, /contact, /privacy, /terms);
 * do not add /blogs here, that hub route does not exist.
 */
const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

/**
 * The site's one footer — on every page, city page or not.
 *
 * ── TWO MODES, ONE COMPONENT ─────────────────────────────────────────────
 * With a `city` it is the city footer it always was: that town's localities,
 * that town's contact block, the other cities as cross-links. WITHOUT a city —
 * the home page, /about, /contact, an article — it renders the sitewide
 * version: every city we serve, the brand's contact block, no locality list.
 *
 * It is one component rather than two because the two footers were 95% the
 * same markup, and the site previously ran a second `common/Footer` built
 * around medicine delivery. Two footers meant two link graphs, and the
 * medicine one was pointing at a section that no longer exists.
 *
 * `labCities` is every live city (the layout passes it in — the footer takes
 * data, it does not fetch it). It no longer takes the guide list: those links
 * now live in each page's in-body `relatedLinks` block, where the anchor can
 * describe the article instead of repeating its full title in a narrow column.
 */
export default function LabFooter({ city = null, labCities = [] }) {
  // Sitewide mode has no city, so the contact block falls back to the brand's
  // own details — the same values a city inherits when it does not override
  // them, so the two modes can never print a different phone number.
  const footer = city?.footer ?? siteFooter();
  const social = (footer.social ?? []).filter((s) => s && s.href);
  const areas = city?.areas ?? [];

  // On a city page, that city is dropped from the list — a page linking to
  // itself is noise in the link graph.
  const otherCities = city
    ? labCities.filter((c) => c.slug !== city.slug)
    : labCities;

  const heading = city
    ? `MedicoBharat — Lab Tests & Health Checkups at Home in ${city.name}`
    : "MedicoBharat — Lab Tests & Health Checkups at Home";

  return (
    <footer
      id="footer-section"
      className="relative mt-2 sm:mt-4 bg-linear-to-b from-emerald-50/60 via-teal-50/40 to-white border-t border-emerald-100"
    >
      {/* One real <h2> for the whole footer landmark. It is screen-reader only,
          but it gives the footer's <h3> column titles a parent to sit under —
          an <h4> with no h2/h3 above it is the kind of broken heading order an
          SEO audit flags. Keyword-bearing, so it earns its place in the outline. */}
      <h2 className="sr-only">{heading}</h2>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-5 grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4 lg:grid-cols-12">

        {/* BRAND — full width on phones (it is the tallest block; letting it
            span both columns keeps the short sections below it aligned instead
            of leaving a ragged gap beside it). One span wider on desktop than
            it used to be: the guides column is gone, and its width is split
            between this block and the city list rather than left as a hole. */}
        <div className="col-span-2 lg:col-span-4">
          <Link href="/" aria-label="MedicoBharat Lab Test — Home" className="inline-block">
            {/* Same trimmed WebP and same true 3.56:1 ratio as the navbar — see
                the note there. No `priority`: this sits at the bottom of the
                page and must never compete with the hero for bandwidth. */}
            <Image
              src="/navbar/lablogo.webp"
              alt={
                city
                  ? `MedicoBharat — Lab Test in ${city.name}`
                  : "MedicoBharat — Lab Test at Home"
              }
              width={320}
              height={90}
              className="h-8 sm:h-10 w-auto object-contain cursor-pointer mb-1 sm:mb-1.5"
            />
          </Link>
          <p className="text-[12px] text-slate-600 leading-5 max-w-xs">
            {footer.tagline}
          </p>

          {/* SOCIAL — real profiles from footer.social, left-aligned to match
              the rest of the footer. `flex-wrap` lets the row reflow on a narrow
              phone. Each is a 32px tap target that fills with the platform's
              colour on hover. */}
          {social.length > 0 && (
            <ul className="mt-2 sm:mt-3 flex flex-wrap gap-2">
              {social.map((s) => {
                const { Icon, brand } = SOCIAL_ICONS[s.type] ?? {
                  Icon: FaGlobe,
                  brand: "hover:bg-emerald-600",
                };
                // A new tab is right for a profile on someone else's site and
                // wrong for a mailto: — that one hands off to the mail app and
                // would leave an empty tab behind on desktop.
                const isExternal = /^https?:/i.test(s.href);
                return (
                  <li key={s.label ?? s.href}>
                    <a
                      href={s.href}
                      {...(isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
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
            from every page. Only routes that actually exist are listed, so no
            link here can 404. */}
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

        {/* CITIES — the section's whole point. The city's own localities used to
            sit above this list inside the same column; with a twelve-locality
            city (Azamgarh) that paragraph wrapped to seven lines in a
            two-of-twelve-wide column, pushing "Other Cities" far below the
            other columns and leaving the rest of the footer as empty space. The
            localities now render as one full-width line under the grid — same
            text, same keywords, a fraction of the height. */}
        <div className="lg:col-span-3">
          {otherCities.length > 0 && (
            <nav aria-label="Cities we serve">
              <h3 className="text-[13px] font-semibold text-emerald-900 mb-2">
                {city ? "Other Cities" : "Cities We Serve"}
              </h3>
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

        {/* The guides used to have a column of their own here. Their titles are
            full sentences ("Varanasi Me Lab Test — Kaun Sa Test Kab"), which in
            a two-of-twelve-wide column wrapped to two lines each and read as
            spilling out of their box. They are not lost: every city page links
            all four guide entry points from `relatedLinks` at the end of the
            guide (see src/data/lab/cities.js) and the home page does the same
            through homeRelatedLinks() — both with descriptive anchors, which is
            worth more than a repeated footer link anyway. If a guide ever ships
            that no page links in-body, put it back here rather than leaving it
            reachable from the sitemap alone. */}

        {/* CONTACT / NAP — a semantic <address> so the crawler reads it as the
            business's contact block, and the name + locality here match the
            DiagnosticLab schema on the page (see the city page). Consistent NAP
            across page, schema and footer is what local ranking is built on. No
            street address is invented — only what we can stand behind. */}
        {/* Full width on phones: with the guides column gone there are three
            short blocks under the brand, and a 2-column phone grid would leave
            this one alone on a half-width row with the email breaking mid-word.
            Across both columns it reads as the closing block it is. */}
        <div className="col-span-2 lg:col-span-3">
          <h3 className="text-[13px] font-semibold text-emerald-900 mb-2">Contact</h3>

          <address className="not-italic space-y-1.5 text-[12.5px] text-slate-600">
            <p className="font-semibold text-slate-700">
              {city
                ? `MedicoBharat — Lab Test in ${city.name}`
                : "MedicoBharat — Lab Test at Home"}
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
              {city ? `${city.name}, ${city.state}` : "Purvanchal, Uttar Pradesh"}
            </p>
            {/* Hours as text, not an image — local search reads this line */}
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
              {footer.hours}
            </p>
          </address>
        </div>
      </div>

      {/* AREAS — the city's localities, as one full-width line rather than a
          column of its own. It is plain text on purpose: these are the names a
          "<locality> me blood test" search matches on, and none of them has a
          page to link to, so a link here would 404. Full width because the list
          grows with the city — twelve localities in a narrow column is seven
          wrapped lines and a lopsided footer; across the container it is one or
          two. Only on a city page; sitewide mode has no localities. */}
      {city && (
        <div className="border-t border-emerald-100/70">
          <p className="max-w-6xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5 text-[12px] leading-5 text-slate-600">
            <span className="font-semibold text-emerald-900">
              Areas We Cover in {city.name}:
            </span>{" "}
            {areas.length > 0
              ? `${areas.join(" · ")} and nearby areas.`
              : `${city.name} and nearby areas.`}
          </p>
        </div>
      )}

      {/* COPYRIGHT — same emerald wash as the rest of the footer, one shade
          deeper, so the bar reads as the end of the page rather than a
          different site. The year is computed, not typed, so it never goes stale.

          The two legal links are not decoration: the booking form collects a
          name, a mobile number and a full home address, and the DPDP Act 2023
          requires the privacy notice to be reachable from where that collection
          happens. Do not remove them without replacing them. */}
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
