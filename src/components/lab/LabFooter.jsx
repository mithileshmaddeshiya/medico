// SSR component — no 'use client' needed.
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_CITY, LAB_CITIES } from "@/data/labCities";

/* Brand icons as inline SVGs (lucide-react no longer ships brand logos). */
function FacebookIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function YoutubeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.11-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.39.52A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.13c1.89.52 9.39.52 9.39.52s7.5 0 9.39-.52a3 3 0 0 0 2.11-2.13A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.57V8.43L15.82 12 9.6 15.57Z" />
    </svg>
  );
}

/* ── Edit your data here ───────────────────────────── */
// Cities are NOT listed here — they come from src/data/labCities.js so one
// entry there lights up the route, this footer, the form and the sitemap.

// The tests people actually search for by name — keyword-bearing internal links
// carry far more SEO weight here than a second copy of the top navigation.
const POPULAR_TESTS = [
  "CBC Test",
  "Full Body Checkup",
  "Thyroid Profile",
  "Blood Sugar Test",
  "Vitamin D Test",
  "Lipid Profile",
];

// Navigation and legal moved to the bottom bar, where they belong.
const LEGAL_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const SOCIALS = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "YouTube", href: "#", Icon: YoutubeIcon },
];

const CONTACT = {
  phone: "+91 98912 33525",
  email: "medicobharat@gmail.com",
};
/* ──────────────────────────────────────────────────── */

export default function LabFooter({ city = DEFAULT_CITY }) {
  // Other live cities first (real cross-links), then this city's own areas as
  // plain text — a link to a page that does not exist yet helps nobody.
  const otherCities = LAB_CITIES.filter((c) => c.slug !== city.slug);

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
            Accurate lab tests &amp; health checkups at home in {city.name} — free
            sample collection, NABL-accredited labs &amp; reports in 24 hours.
          </p>

          {/* Socials */}
          <div className="mt-3 flex items-center gap-2">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-emerald-700 ring-1 ring-emerald-200/70 shadow-sm hover:text-white hover:bg-emerald-600 hover:ring-emerald-600 transition-all"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* AREAS + OTHER CITIES (SEO) */}
        <div className="lg:col-span-3">
          <h4 className="text-sm font-semibold text-emerald-900 mb-2.5">
            Areas We Cover in {city.name}
          </h4>

          {/* Localities as text: the keywords index, and nobody hits a 404 */}
          <p className="text-sm leading-6 text-slate-600">
            {city.areas.join(" · ")}
            {city.areas.length > 0 && " and nearby areas."}
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
          <ul className="space-y-1.5 text-sm text-slate-600">
            {POPULAR_TESTS.map((t) => (
              <li key={t}>
                <Link
                  href={`/lab-test/${city.slug}#tests`}
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
              href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              aria-label={`Call us at ${CONTACT.phone}`}
              className="flex items-center gap-2 hover:text-emerald-700 transition-colors"
            >
              <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="tabular-nums">{CONTACT.phone}</span>
            </a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-emerald-700 transition-colors">
              <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="break-all">{CONTACT.email}</span>
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              {city.name}, {city.state}
            </div>
            {/* Hours as text, not an image — local search reads this line */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
              Open all 7 days · Slots from 6 AM
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM — navigation and legal live here so the columns above stay
          keyword-bearing (cities, tests) instead of repeating the menu. */}
      <div className="border-t border-emerald-100 bg-emerald-50/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col items-center gap-2 text-[12.5px] text-slate-500 md:flex-row md:justify-between">

          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
            {LEGAL_LINKS.map((l, i) => (
              <span key={l.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-emerald-300" />}
                <Link href={l.href} className="hover:text-emerald-700 transition-colors">
                  {l.label}
                </Link>
              </span>
            ))}
          </nav>

          <span className="text-center">
            © {new Date().getFullYear()} Medicobharat · Tests processed by certified partner laboratories.
          </span>
        </div>
      </div>
    </footer>
  );
}
