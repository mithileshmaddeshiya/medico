import Link from "next/link";
import { ArrowRight, Phone, Search } from "lucide-react";

import LabFooter from "@/components/lab/LabFooter";
import LabNavbar from "@/components/lab/LabNavbar";
import { getLatestBlogs } from "@/data/blogs";
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

  const guides = getLatestBlogs(2);

  return (
    <>
      <LabNavbar />

      <main className="flex-1">
        <section className="bg-linear-to-b from-emerald-50/70 to-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-28 sm:pt-32 pb-12 sm:pb-16 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-wide text-emerald-700">
              <Search aria-hidden className="h-3.5 w-3.5" />
              404 — page nahi mila
            </span>

            <h1 className="mt-5 text-balance text-[26px] min-[400px]:text-[30px] sm:text-[38px] font-extrabold leading-[1.14] tracking-tight text-slate-900">
              Ye page yahan nahi hai — lekin aapka test yahin book ho jaayega
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-pretty text-[14px] sm:text-[15.5px] leading-relaxed text-slate-600">
              Ho sakta hai link purana ho ya address me kuch chhoot gaya ho.
              Neeche se apna sheher chuniye, ya seedhe call kar lijiye — free
              home sample collection, report 24 ghante me.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-[13.5px] font-bold text-white transition hover:bg-emerald-700"
              >
                Home page par jaayein
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>

              <a
                href={`tel:${LAB_PHONE.replace(/[^+\d]/g, "")}`}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-600 px-5 py-3 text-[13.5px] font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                <Phone aria-hidden className="h-4 w-4" />
                {LAB_PHONE}
              </a>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-16">
          {/* Every live city, so a reader who mistyped a city URL lands one tap
              from the page they wanted. Built from the live list — nothing here
              can point at a town we have stopped serving. */}
          <section aria-labelledby="nf-cities">
            <h2
              id="nf-cities"
              className="text-[13px] font-bold uppercase tracking-wide text-emerald-900"
            >
              Hum in sheher me sample collect karte hain
            </h2>

            <ul className="mt-3.5 flex flex-wrap gap-2">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/lab-test/${city.slug}`}
                    className="inline-flex rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[12.5px] font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    {`Lab test in ${city.name}`}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {guides.length > 0 && (
            <section aria-labelledby="nf-guides" className="mt-9">
              <h2
                id="nf-guides"
                className="text-[13px] font-bold uppercase tracking-wide text-emerald-900"
              >
                Padhne layak
              </h2>

              <ul className="mt-3.5 grid gap-3 sm:grid-cols-2">
                {guides.map((post) => (
                  <li key={post.href}>
                    <Link
                      href={post.href}
                      className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                        {post.cityName}
                      </span>
                      <p className="mt-1.5 text-[14px] font-bold leading-snug text-slate-900">
                        {post.title}
                      </p>
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
