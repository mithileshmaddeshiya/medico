import Link from "next/link";
import { linkTitle } from "@/lib/linkTitle";
import { CalendarDays, Clock } from "lucide-react";

import { getBlogs } from "@/lib/blogs";
import { getLabCities } from "@/lib/labCities";
import { ORG_REF, WEBSITE_ID, graph, ldJson } from "@/lib/schema";
import { SITE, url } from "@/lib/site";

/**
 * /blogs — THE hub. Every article on the site hangs off this one page.
 *
 * ── WHY EVERYTHING POINTS HERE ────────────────────────────────────────────
 * This page existed for a while and nothing linked to it. It was in the
 * sitemap, so Google knew the URL, but not one page on the site carried an
 * anchor to it — three separate comments elsewhere in the codebase still said
 * "/blogs has no hub page" and told the next person not to link it. Meanwhile
 * every surface that wanted to show guides listed EVERY guide: the home page
 * rendered the full set twice over (the card rail and the "Padhne Ke Liye"
 * column), and the block at the foot of each article listed every other
 * article on the site.
 *
 * That shape works at fifteen posts and breaks at fifty. A rail that grows
 * without limit takes over the home page; a footer block carrying two hundred
 * links on every article is what Google reads as a link dump rather than
 * navigation. And it is a lot of linking for very little crawl benefit — the
 * same pages linked over and over from everywhere.
 *
 * So the links were inverted. Every other surface now shows a HANDFUL and
 * hands off to this page, and this page carries the complete set. One hop from
 * anywhere on the site to here, one hop from here to any article — which is
 * the shape a crawler follows cleanly, and the shape that does not change when
 * the tenth article becomes the two hundredth.
 *
 * The surfaces that feed it: the footer's quick links (every page on the
 * site), the home page rail's "sabhi guides" button, the home page's "Aage
 * Kahan Jaayein" column, and BlogCityLinks at the foot of every article.
 *
 * ── WHY IT GROUPS BY CITY ─────────────────────────────────────────────────
 * A flat newest-first grid was fine for fifteen. At two hundred it is a wall
 * with no structure, and the reader who wants Deoria has to scan all of it.
 * The sections are the towns, in the order src/lib/blogs ranks them (the town
 * with the newest guide first), with a jump nav above so any town is one tap
 * away. Every article still renders as a real link in the HTML — nothing is
 * paginated away or hidden behind a click, because a link a crawler cannot see
 * is a link that does not count.
 *
 * ── WHAT IT DOES NOT DO ───────────────────────────────────────────────────
 * It does not introduce a "/blogs" breadcrumb level on the posts. The existing
 * trail — Home → <town> me lab test → article — is the truer hierarchy: a guide
 * about lab tests in Varanasi sits under Varanasi's service page, not under a
 * generic blog index. This page is a discovery surface, not a parent.
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
  /* Metadata only — titles, descriptions, dates. The hub carries every article
     the site has, and still costs the same per post whether that is fifteen or
     fifteen hundred, because no article body is ever loaded here. */
  const [labCities, posts] = await Promise.all([getLabCities(), getBlogs()]);

  /* Grouped into towns, in the order src/lib/blogs already sorted them — the
     town with the newest guide first, and within a town the sequence its author
     chose. Insertion order of a Map is what preserves both, so this needs no
     second sort and cannot disagree with the rest of the site. */
  const byCity = new Map();
  for (const post of posts) {
    if (!byCity.has(post.city)) {
      byCity.set(post.city, { city: post.city, name: post.cityName, posts: [] });
    }
    byCity.get(post.city).posts.push(post);
  }
  const cityGroups = [...byCity.values()];

  const pageUrl = url("/blogs");

  const ids = {
    page: `${pageUrl}#webpage`,
    list: `${pageUrl}#guides`,
    breadcrumb: `${pageUrl}#breadcrumb`,
  };

  /* The articles in the exact order the page renders them, town by town. An
     ItemList whose `position` values disagree with the visible order is telling
     Google something the page does not — so this is derived from the same
     groups the markup below iterates, not sorted a second time. */
  const listed = cityGroups.flatMap((group) => group.posts);

  /* A CollectionPage whose ItemList members are the articles. Each entry is a
     bare `url` + `name` rather than an inlined BlogPosting: the full node lives
     on the article's own page, and repeating a partial copy here would put two
     descriptions of the same article into the index with different levels of
     detail.

     Every article is listed, however many there are. This node is the machine
     readable form of what makes this page the hub — one document that names the
     complete set. */
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
      numberOfItems: listed.length,
      itemListElement: listed.map((post, i) => ({
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

          {/* The jump nav. Real anchors to the sections below, so a reader who
              wants one town gets there in a tap instead of scrolling past the
              others — and so does Google, which reads these as the page's own
              table of contents. Hidden when there is only one town, because a
              nav offering one destination is furniture. */}
          {cityGroups.length > 1 && (
            <nav
              aria-label="Sheher ke hisaab se guides"
              className="mt-6 flex flex-wrap items-center gap-2"
            >
              <span className="text-[11.5px] font-semibold text-slate-500">
                Sheher chuniye:
              </span>
              {cityGroups.map((group) => (
                <a
                  key={group.city}
                  href={`#guides-${group.city}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[12.5px] font-semibold text-emerald-800 ring-1 ring-emerald-200 transition hover:bg-emerald-600 hover:text-white hover:ring-emerald-600"
                >
                  {group.name}
                  <span className="text-[11px] font-bold text-emerald-500/80 group-hover:text-white">
                    {group.posts.length}
                  </span>
                </a>
              ))}
            </nav>
          )}
        </div>
      </section>

      <section
        aria-labelledby="guides-heading"
        className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14"
      >
        <h2 id="guides-heading" className="sr-only">
          Sabhi guides
        </h2>

        {/* One block per town. Every article renders as a real anchor in the
            HTML — nothing paginated, nothing behind a "load more", because a
            link a crawler cannot see is a link that does not count. */}
        {cityGroups.map((group, index) => (
          <div key={group.city} className={index ? "mt-12 sm:mt-14" : ""}>
            <h3
              id={`guides-${group.city}`}
              className="scroll-mt-24 text-balance text-[19px] sm:text-[22px] font-extrabold tracking-tight text-slate-900"
            >
              {group.name} ke guides
              <span className="ml-2 align-middle text-[12.5px] font-semibold text-slate-400">
                {group.posts.length}
              </span>
            </h3>

            {/* Straight into the town's booking page from its own heading —
                the reader who scrolled to this town is the reader most likely
                to want it. Rendered only when that page exists. */}
            {labCities.some((city) => city.slug === group.city) && (
              <Link
                href={`/lab-test/${group.city}`}
                title={linkTitle(`/lab-test/${group.city}`)}
                className="mt-1.5 inline-flex text-[12.5px] font-semibold text-emerald-700 underline-offset-4 hover:underline"
              >
                {group.name} me lab test book kariye →
              </Link>
            )}

            <ul className="mt-5 grid gap-5 sm:grid-cols-2">
              {group.posts.map((post) => {
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

                      <h4 className="mt-2 text-balance text-[17px] font-bold leading-snug text-slate-900">
                        {post.title}
                      </h4>

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
          </div>
        ))}

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
