import Link from "next/link";
import { linkTitle } from "@/lib/linkTitle";
import { CalendarDays, Clock } from "lucide-react";

import { blogs } from "@/data/blogs";
import { getLabCities } from "@/lib/labCities";
import { ORG_REF, WEBSITE_ID, graph, ldJson } from "@/lib/schema";
import { SITE, url } from "@/lib/site";

/**
 * /blogs — the guide index.
 *
 * ── WHY IT EXISTS ─────────────────────────────────────────────────────────
 * `/blogs/<category>/<city>` served articles and `/blogs` itself was a 404 —
 * which is why the breadcrumbs on every post deliberately skip the middle level
 * and go Home → the town's lab page → the article. That was the right call while
 * the hub did not exist; it is not a reason to leave it missing.
 *
 * Without a hub, an article was reachable only from the home page rail and from
 * the related-links block on a city page. Nothing crawled the set as a set, and
 * a new guide could only be found by whatever happened to link it.
 *
 * ── WHAT IT DOES NOT DO ───────────────────────────────────────────────────
 * It does not introduce a "/blogs" breadcrumb level on the posts. The existing
 * trail — Home → <town> me lab test → article — is the truer hierarchy: a guide
 * about lab tests in Varanasi sits under Varanasi's service page, not under a
 * generic blog index. This page is a discovery surface, not a parent.
 *
 * ⚠ THE POSTS ARE THE THIN PART, NOT THIS PAGE. Two guides exist and both are
 * about Varanasi. Five of the six towns we serve have none. A hub over two
 * articles is close to a doorway page — this earns its place once each town has
 * its own guides, which is the single biggest content gap on the site.
 */
export const metadata = {
  title: "Lab Test Guides — Kaun Sa Test Kab",

  description:
    "Lab test se pehle kya jaanna chahiye — kaun sa test kab, fasting kab zaroori hai, report kaise padhein aur full body checkup me kya hona chahiye.",

  keywords: [
    "lab test guide",
    "kaun sa lab test kab karayein",
    "blood test se pehle fasting",
    "lab test report kaise padhein",
    "full body checkup me kya hota hai",
    "health checkup guide Hindi",
  ],

  alternates: { canonical: url("/blogs") },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    title: "Lab Test Guides — Kaun Sa Test Kab",
    description:
      "Kaun sa test kab, fasting kab zaroori hai, aur report kaise padhein — MedicoBharat ke lab test guides.",
    url: url("/blogs"),
    siteName: "MedicoBharat",
    locale: "en_IN",
  },
};

/** "lab-test" → "Lab Test". Same rule the article pages use. */
const categoryLabel = (category) =>
  category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/** "2026-08-03" → "3 August 2026". Fixed locale so SSR and client agree. */
const readableDate = (iso) => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
};

export default async function BlogsIndexPage() {
  const labCities = await getLabCities();

  // Newest first. `blogs` is the normalised registry — never re-sort it in
  // place, other callers read the same array.
  const posts = [...blogs].sort((a, b) =>
    String(b.publishedAt).localeCompare(String(a.publishedAt))
  );

  const pageUrl = url("/blogs");

  const ids = {
    page: `${pageUrl}#webpage`,
    list: `${pageUrl}#guides`,
    breadcrumb: `${pageUrl}#breadcrumb`,
  };

  /* A CollectionPage whose ItemList members are the articles. Each entry is a
     bare `url` + `name` rather than an inlined BlogPosting: the full node lives
     on the article's own page, and repeating a partial copy here would put two
     descriptions of the same article into the index with different levels of
     detail. */
  const jsonLd = graph(
    {
      "@type": "CollectionPage",
      "@id": ids.page,
      url: pageUrl,
      name: "Lab Test Guides",
      description: metadata.description,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ids.list },
      breadcrumb: { "@id": ids.breadcrumb },
      inLanguage: ["hi-IN", "en-IN"],
      publisher: ORG_REF,
    },
    {
      "@type": "ItemList",
      "@id": ids.list,
      name: "MedicoBharat — lab test guides",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: post.title,
        url: `${SITE}${post.href}`,
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": ids.breadcrumb,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Guides", item: pageUrl },
      ],
    }
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }}
      />

      <section className="border-b border-slate-200 bg-linear-to-b from-emerald-50/70 to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 sm:pt-28 pb-10 sm:pb-12">
          <nav aria-label="Breadcrumb" className="text-[12px] text-slate-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" title={linkTitle("/")} className="hover:text-emerald-700">Home</Link>
              </li>
              <li aria-hidden className="text-slate-300">/</li>
              <li className="font-medium text-slate-700">Guides</li>
            </ol>
          </nav>

          <h1 className="mt-5 max-w-3xl text-balance text-[28px] min-[400px]:text-[32px] sm:text-[40px] font-extrabold leading-[1.12] tracking-tight text-slate-900">
            Lab test guides — kaun sa test kab, aur report ka matlab kya
          </h1>

          <p className="mt-3.5 max-w-2xl text-pretty text-[14px] sm:text-[15.5px] leading-relaxed text-slate-600">
            Test karane se pehle ke sawaal — kis symptom me kaun sa test, fasting
            kab zaroori hai, full body checkup me kya-kya hona chahiye, aur
            report ke numbers ka matlab kya hai. Sab kuch seedhi bhasha me.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="guides-heading"
        className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14"
      >
        <h2 id="guides-heading" className="sr-only">
          Sabhi guides
        </h2>

        <ul className="grid gap-5 sm:grid-cols-2">
          {posts.map((post) => {
            const published = readableDate(post.publishedAt);

            return (
              <li key={post.href}>
                <Link
                  href={post.href}
                  title={linkTitle(post.href)}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 transition hover:border-emerald-300 hover:shadow-[0_12px_30px_-18px_rgba(6,78,59,.45)]"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                    {categoryLabel(post.category)} · {post.cityName}
                  </span>

                  <h3 className="mt-2 text-balance text-[17px] font-bold leading-snug text-slate-900">
                    {post.title}
                  </h3>

                  <p className="mt-2.5 line-clamp-3 text-[13px] leading-relaxed text-slate-600">
                    {post.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] text-slate-500">
                    {published && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays aria-hidden className="h-3.5 w-3.5" />
                        <time dateTime={post.publishedAt}>{published}</time>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <Clock aria-hidden className="h-3.5 w-3.5" />
                      {post.readingMinutes} min
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* The hand-off out of a reading page and into a booking one. Built from
            the live city list, so it cannot point at a town we have stopped
            serving. */}
        <div className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-7">
          <h2 className="text-[18px] sm:text-[21px] font-extrabold tracking-tight text-emerald-950">
            Padh liya — ab test book kar lijiye
          </h2>

          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-slate-600">
            Free home sample collection, slot subah 6 baje se, report 24 ghante
            me. Apna sheher chuniye:
          </p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {labCities.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/lab-test/${city.slug}`}
                  title={linkTitle(`/lab-test/${city.slug}`)}
                  className="inline-flex rounded-lg bg-white px-3.5 py-2 text-[12.5px] font-semibold text-emerald-800 ring-1 ring-emerald-200 transition hover:bg-emerald-600 hover:text-white hover:ring-emerald-600"
                >
                  {`Lab test in ${city.name}`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
