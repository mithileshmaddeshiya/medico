import Link from "next/link";
import { linkTitle } from "@/lib/linkTitle";
import {
  ArrowRight,
  BookOpen,
  FlaskConical,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";

import LabFooter from "@/components/lab/LabFooter";
import LabNavbar from "@/components/lab/LabNavbar";
import NotFoundPath from "@/components/lab/NotFoundPath";
import { getLatestBlogs } from "@/lib/blogs";
import { LAB_PHONE } from "@/data/lab/defaults";
import { getDefaultLabCity, getLabCities } from "@/lib/labCities";
import { getShellData } from "@/lib/shell";

/**
 * The site-wide 404.
 *
 * ── WHY THIS FILE HAD TO EXIST ────────────────────────────────────────────
 * /lab-test/[city] had its own not-found.js; nothing else did. So every 404
 * outside that one segment — a mistyped URL, an old campaign link, a stale
 * backlink, a shared link with a trailing character — landed on Next.js's bare
 * default page: no header, no footer, not one link out. That is a crawl dead
 * end and a guaranteed bounce, and it is not hypothetical here. The lab route
 * sets `dynamicParams = false`, next.config.mjs carries five redirect rules for
 * a retired section, and the domain has indexed history from when it was a
 * pharmacy.
 *
 * ── WHY IT MOUNTS ITS OWN CHROME ──────────────────────────────────────────
 * app/not-found.js renders inside the ROOT layout, not inside (main)'s — route
 * group layouts do not apply to it. The root layout owns <html>/<body> and
 * nothing else, so the navbar and footer have to be mounted here explicitly or
 * this page would still be a dead end with nicer text on it.
 *
 * The footer needs a city for its contact block; a 404 has no city, so it gets
 * the default one — the same fallback [city]/layout.js uses for exactly this
 * reason.
 *
 * ── WHAT IT DELIBERATELY DOES NOT DO ──────────────────────────────────────
 * It does not redirect. A 404 that redirects to the home page is what Google
 * calls a soft 404 and treats as one, and it destroys the diagnostic signal in
 * Search Console that tells you which link is broken. This page returns a real
 * 404 status and offers the reader somewhere useful to go instead.
 *
 * There is no `metadata` export: Next.js serves this with a 404 status, and a
 * status code is a stronger and more honest signal than a robots meta tag. A
 * page nobody should index does not need to say so twice.
 */
export default async function NotFound() {
  const [{ labCities }, cities, fallbackCity] = await Promise.all([
    getShellData(),
    getLabCities(),
    getDefaultLabCity(),
  ]);

  const guides = await getLatestBlogs(2);

  // The four places a lost reader most often meant to reach. Every href is a
  // live route; nothing here is a guess at a page that might exist.
  const shortcuts = [
    { href: "/", label: "Home", note: "MedicoBharat ka main page", Icon: Home },
    {
      href: "/lab-test",
      label: "Lab test rate list",
      note: "Har sheher ke test aur rate",
      Icon: FlaskConical,
    },
    {
      href: "/blogs",
      label: "Health guides",
      note: "Kaunsa test, kab aur kyun",
      Icon: BookOpen,
    },
    {
      href: "/contact",
      label: "Contact",
      note: "Booking me madad chahiye?",
      Icon: MessageCircle,
    },
  ];

  const bookHref = fallbackCity?.slug
    ? `/lab-test/${fallbackCity.slug}`
    : "/lab-test";

  return (
    <>
      <LabNavbar />

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────────────────────────
            Soft grid + two blurred colour washes behind a big gradient "404".
            All decoration is aria-hidden and static apart from the ECG trace,
            which reuses the navbar's `.ecg-line` loop and so already stops
            under prefers-reduced-motion. */}
        <section className="relative isolate overflow-hidden bg-linear-to-b from-emerald-50/80 via-white to-white">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(16_185_129/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(16_185_129/0.08)_1px,transparent_1px)] bg-size-[36px_36px] mask-[radial-gradient(ellipse_at_top,black_35%,transparent_75%)]"
          />
          <div
            aria-hidden
            className="absolute -top-24 left-1/2 -z-10 h-80 w-xl max-w-[120vw] -translate-x-1/2 rounded-full bg-emerald-300/30 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute top-40 -right-24 -z-10 h-64 w-64 rounded-full bg-teal-300/25 blur-3xl"
          />

          <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-28 sm:pt-36 pb-14 sm:pb-20 text-center">
            <span className="lab-fade-in inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/80 px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-wide text-emerald-700 shadow-sm backdrop-blur">
              <Search aria-hidden className="h-3.5 w-3.5" />
              Error 404 · Page nahi mila
            </span>

            {/* The numeral is decorative — the h1 below carries the meaning,
                so a screen reader hears one sentence, not "four zero four".
                The white ECG trace runs through the digits like a monitor. */}
            <div
              aria-hidden
              className="lab-pop-in relative mx-auto mt-6 w-fit select-none"
            >
              <p className="bg-linear-to-br from-emerald-600 via-teal-500 to-emerald-800 bg-clip-text text-[104px] min-[400px]:text-[128px] sm:text-[176px] font-black leading-none tracking-[-0.06em] text-transparent">
                404
              </p>
              <svg
                viewBox="0 0 240 24"
                fill="none"
                className="absolute left-1/2 top-1/2 w-[112%] -translate-x-1/2 -translate-y-1/2"
              >
                <path
                  className="ecg-line"
                  d="M0 12 H52 l4 -9 6 18 5 -14 4 10 H144 l4 -6 4 6 H240"
                  stroke="url(#nfEcg)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="nfEcg"
                    x1="0"
                    y1="0"
                    x2="240"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#ffffff" stopOpacity="0" />
                    <stop offset="0.2" stopColor="#ffffff" />
                    <stop offset="0.8" stopColor="#ffffff" />
                    <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h1 className="mt-6 text-balance text-[24px] min-[400px]:text-[28px] sm:text-[36px] font-extrabold leading-[1.15] tracking-tight text-slate-900">
              Ye page yahan nahi hai — lekin aapka test yahin book ho jaayega
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-pretty text-[14px] sm:text-[15.5px] leading-relaxed text-slate-600">
              Ho sakta hai link purana ho ya address me kuch chhoot gaya ho.
              Neeche se apna sheher chuniye, ya seedhe call kar lijiye — home
              sample collection sirf ₹100 me, report 24 ghante me.
            </p>

            <NotFoundPath />

            <div className="mt-8 flex flex-col min-[480px]:flex-row items-stretch min-[480px]:items-center justify-center gap-3">
              <Link
                href={bookHref}
                title={linkTitle(bookHref)}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 text-[14px] font-bold text-white shadow-[0_12px_28px_-12px_rgba(5,150,105,0.9)] transition hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98]"
              >
                Lab test book karein
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <a
                href={`tel:${LAB_PHONE.replace(/[^+\d]/g, "")}`}
                title={`Call ${LAB_PHONE} to book a lab test`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[14px] font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-200 transition hover:bg-emerald-50/60 hover:ring-emerald-400 active:scale-[0.98]"
              >
                <Phone aria-hidden className="h-4 w-4" />
                {LAB_PHONE}
              </a>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-20">
          {/* ── Shortcuts ─────────────────────────────────────────────────── */}
          <nav aria-label="Popular pages">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {shortcuts.map(({ href, label, note, Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    title={linkTitle(href)}
                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_14px_30px_-18px_rgba(5,150,105,0.55)]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition group-hover:bg-emerald-600 group-hover:text-white group-hover:ring-emerald-600">
                      <Icon aria-hidden className="h-4.5 w-4.5" strokeWidth={2.1} />
                    </span>
                    <span className="mt-3 text-[14px] font-bold text-slate-900">
                      {label}
                    </span>
                    <span className="mt-0.5 text-[12px] leading-snug text-slate-500">
                      {note}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Cities ────────────────────────────────────────────────────────
              Every live city, so a reader who mistyped a city URL lands one tap
              from the page they wanted. Built from the live list — nothing here
              can point at a town we have stopped serving. */}
          <section
            aria-labelledby="nf-cities"
            className="mt-10 rounded-3xl bg-linear-to-br from-emerald-50 to-teal-50/60 p-5 sm:p-7 ring-1 ring-emerald-100"
          >
            <h2
              id="nf-cities"
              className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-emerald-900"
            >
              <MapPin aria-hidden className="h-4 w-4 text-emerald-600" />
              Hum in sheher me sample collect karte hain
            </h2>

            <ul className="mt-4 flex flex-wrap gap-2">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/lab-test/${city.slug}`}
                    title={linkTitle(`/lab-test/${city.slug}`)}
                    className="inline-flex rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold text-slate-700 ring-1 ring-emerald-200/70 transition hover:text-emerald-700 hover:ring-emerald-400"
                  >
                    {`Lab test in ${city.name}`}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {guides.length > 0 && (
            <section aria-labelledby="nf-guides" className="mt-10">
              <h2
                id="nf-guides"
                className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-emerald-900"
              >
                <BookOpen aria-hidden className="h-4 w-4 text-emerald-600" />
                Padhne layak
              </h2>

              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {guides.map((post) => (
                  <li key={post.href}>
                    <Link
                      href={post.href}
                      title={linkTitle(post.href)}
                      className="group flex h-full items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 transition hover:border-emerald-300 hover:bg-emerald-50/40"
                    >
                      <span>
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                          {post.cityName}
                        </span>
                        <span className="mt-1.5 block text-[14px] font-bold leading-snug text-slate-900">
                          {post.title}
                        </span>
                      </span>
                      <ArrowRight
                        aria-hidden
                        className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-600"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>

      {/* The footer prints a city's contact block, and a 404 has no city — so it
          gets the default one, the same fallback [city]/layout.js uses. */}
      <LabFooter city={fallbackCity} labCities={labCities} />
    </>
  );
}
