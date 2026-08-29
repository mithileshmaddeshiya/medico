import Image from "next/image";
import { linkTitle } from "@/lib/linkTitle";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Check, Clock, Phone, RefreshCw } from "lucide-react";

import BlogCityLinks from "@/components/blog/BlogCityLinks";
import BlogProse from "@/components/blog/BlogProse";
import BlogShare from "@/components/blog/BlogShare";
// Same shape, same job: a hand-picked in-body link block. It takes a plain
// `related` object and renders links — nothing in it is lab-specific, so it is
// reused here rather than duplicated. See the note at the top of that file.
import LabRelatedLinks from "@/components/lab/LabRelatedLinks";
import { blogs, getBlog, getRelatedBlogs } from "@/data/blogs";
import { getLabCities, getLabCity } from "@/lib/labCities";
import { ORG_REF, WEBSITE_ID, graph, ldJson } from "@/lib/schema";
import { SITE, SITE_PHONE } from "@/lib/site";

/**
 * The article's share card, rendered by the `og/route.js` handler beside this
 * file.
 *
 * A generated route rather than a file in /public, because the old `image:`
 * field in blogData.js pointed at /public/blogs/*.webp files that were never
 * added — so the OG tags and the article schema both named a 404, which is
 * enough on its own for Google to withhold the rich result. This URL is stable
 * across builds and feeds og:image, twitter:image and the schema alike.
 */
const ogImage = (category, city) => `${SITE}/blogs/${category}/${city}/og`;

/** Absolute URL for an image path that may be site-relative. */
const absolute = (path) => (path?.startsWith("http") ? path : `${SITE}${path}`);

/** "lab-test" → "Lab Test" — the visible category chip and articleSection. */
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

export async function generateStaticParams() {
  return blogs.map((blog) => ({ category: blog.category, city: blog.city }));
}

export async function generateMetadata({ params }) {
  const { category, city } = await params;
  const blog = getBlog(category, city);

  if (!blog) return {};

  const share = ogImage(blog.category, blog.city);

  return {
    title: blog.title,
    description: blog.description,
    keywords: blog.keywords,
    robots: blog.robots,

    alternates: { canonical: blog.canonical },

    openGraph: {
      type: "article",
      title: blog.title,
      description: blog.description,
      url: blog.canonical,
      siteName: "MedicoBharat",
      locale: "en_IN",
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author?.name].filter(Boolean),
      section: categoryLabel(blog.category),
      tags: blog.keywords?.slice(0, 10),
      images: [
        { url: share, width: 1200, height: 630, alt: blog.title },
        // The real photograph, second. Some scrapers prefer the first entry and
        // some pick the largest; either way both resolve.
        ...(blog.hero ? [{ url: absolute(blog.hero.src), alt: blog.hero.alt }] : []),
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: [share],
    },
  };
}

export default async function BlogPage({ params }) {
  const { category, city } = await params;
  const blog = getBlog(category, city);

  if (!blog) notFound();

  /* The lab page for this town, looked up rather than assumed. Every CTA and
     breadcrumb below is rendered only when it resolves — an article may be
     written for a town whose service page has not shipped yet, and a link that
     might not resolve is not a link.

     There used to be a second lookup here for the medicine section. That
     section is retired and its URLs are permanently redirected, so the article
     now has exactly one service page to point at. */
  const [labCity, labCities] = await Promise.all([
    getLabCity(blog.city),
    getLabCities(),
  ]);

  const related = getRelatedBlogs(blog);
  const published = readableDate(blog.publishedAt);
  const updated =
    blog.updatedAt && blog.updatedAt !== blog.publishedAt
      ? readableDate(blog.updatedAt)
      : null;

  /* ── Structured data ─────────────────────────────────────────────────────
     One @graph rather than three separate <script> tags: that is what lets the
     `{"@id": …}` references below resolve, and it is how the page says these
     nodes are about each other instead of listing unrelated facts. The
     organisation and website nodes themselves are emitted once in the root
     layout (src/app/layout.js) and only referenced here — see src/lib/schema.js
     for why one entity with many references beats a repeated stub. */
  const articleNode = {
    "@type": "BlogPosting",
    "@id": `${blog.canonical}#article`,
    headline: blog.title,
    description: blog.description,
    image: [
      ogImage(blog.category, blog.city),
      ...(blog.hero ? [absolute(blog.hero.src)] : []),
    ],
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: ORG_REF,
    publisher: ORG_REF,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": blog.canonical },
    articleSection: categoryLabel(blog.category),
    inLanguage: ["hi-IN", "en-IN"],
    keywords: blog.keywords?.slice(0, 15).join(", "),
    // What the article is *about*, as a place. This is the property that ties
    // the piece to the town rather than relying on the word appearing in the
    // headline, and it is what a "<city> me lab test" query matches against.
    about: { "@type": "City", name: blog.cityName },
    timeRequired: `PT${blog.readingMinutes}M`,
  };

  /* Breadcrumbs.
     Every item must be a route that renders. There is deliberately NO "/blogs"
     level here: that hub page does not exist, and a BreadcrumbList naming a 404
     is worse than none — Google drops the whole rich result and spends crawl
     budget finding out.

     So the trail goes Home → the town's service page → this article. That is
     also the truer hierarchy: the article is about lab tests in this town, and
     the page above it is that town's lab page, not a generic blog index. When a
     town has no service page the trail falls back to Home → article, which is a
     valid two-item list. */
  const parentCrumb = labCity
    ? { name: `${labCity.name} me lab test`, item: `${SITE}/lab-test/${labCity.slug}` }
    : null;

  const breadcrumbNode = {
    "@type": "BreadcrumbList",
    "@id": `${blog.canonical}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      ...(parentCrumb
        ? [{ "@type": "ListItem", position: 2, name: parentCrumb.name, item: parentCrumb.item }]
        : []),
      {
        "@type": "ListItem",
        position: parentCrumb ? 3 : 2,
        name: blog.title,
        item: blog.canonical,
      },
    ],
  };

  const faqNode = blog.faqs.length
    ? {
        "@type": "FAQPage",
        "@id": `${blog.canonical}#faq`,
        mainEntity: blog.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: ldJson(graph(articleNode, breadcrumbNode, faqNode)),
        }}
      />

      {/* ── MASTHEAD ─────────────────────────────────────────────────────────
          Title and meta on a tinted band, then the body on white. The band is
          what separates "an article" from "a page with text on it".

          From `lg` up the hero sits in a narrow column to the right of the
          headline rather than spanning the full width: at full width this
          16:9 banner pushed the first paragraph most of a screen down. Below
          `lg` the columns stack and it goes back to full width, where it has
          the room to stay readable. */}
      <header className="border-b border-slate-200 bg-linear-to-b from-emerald-50/70 to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-10">

          {/* Visible breadcrumb — the same trail as the schema above. Crawlers
              weight a breadcrumb they can see over one that exists only in
              JSON, and it is the reader's way back up. */}
          <nav aria-label="Breadcrumb" className="text-[12px] text-slate-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" title={linkTitle("/")} className="hover:text-emerald-700">Home</Link>
              </li>

              {/* Same trail as the schema above — and the same reason there is
                  no "Health Guides" level: /blogs does not exist. */}
              {parentCrumb && (
                <>
                  <li aria-hidden className="text-slate-300">/</li>
                  <li>
                    <Link
                      href={parentCrumb.item.replace(SITE, "")}
                      title={linkTitle(parentCrumb.item.replace(SITE, ""))}
                      className="hover:text-emerald-700"
                    >
                      {parentCrumb.name}
                    </Link>
                  </li>
                </>
              )}

              <li aria-hidden className="text-slate-300">/</li>
              <li className="font-medium text-slate-700">{blog.cityName}</li>
            </ol>
          </nav>

          {/* `items-center`, not `items-start`. The two columns are never the
              same height — the text block runs to roughly 400px, the image plus
              its caption to roughly 435px — and top-aligning them left a ragged
              ~115px of dead space under the byline. Centring splits the
              difference so the whole masthead reads as one balanced block
              whatever the headline's length. */}
          <div className="mt-6 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <span className="inline-block rounded-full bg-emerald-600/10 px-3 py-1 text-[11.5px] font-bold uppercase tracking-wide text-emerald-800">
                {categoryLabel(blog.category)} · {blog.cityName}
              </span>

              {/* The page's only h1. Every section below starts at h2. */}
              <h1 className="mt-4 text-[27px] sm:text-[38px] font-extrabold leading-[1.15] tracking-tight text-balance text-slate-900">
                {blog.title}
              </h1>

              {/* max-w-xl once the columns split: inside a 7-of-12 column the
                  line was already ~620px, and a 2xl cap on top of that did
                  nothing. Capping it here keeps the measure near 70 characters,
                  which is where a paragraph stays comfortable to read. */}
              <p className="mt-4 max-w-2xl text-[15px] sm:text-[17px] leading-relaxed text-slate-600 lg:max-w-xl">
                {blog.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-slate-500">
                <span className="font-medium text-slate-600">{blog.author?.name}</span>

                {published && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays aria-hidden className="h-3.5 w-3.5" />
                    {/* dateTime carries the machine-readable value; the text is
                        for the reader. Both come from the same field. */}
                    <time dateTime={blog.publishedAt}>{published}</time>
                  </span>
                )}

                {updated && (
                  <span className="inline-flex items-center gap-1.5">
                    <RefreshCw aria-hidden className="h-3.5 w-3.5" />
                    Updated <time dateTime={blog.updatedAt}>{updated}</time>
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5">
                  <Clock aria-hidden className="h-3.5 w-3.5" />
                  {blog.readingMinutes} min
                </span>
              </div>
            </div>

            {/* HERO — the LCP element, so `priority` and no lazy loading. The
                fixed ratio box reserves the space before the file arrives,
                which is what keeps the layout from shifting as it loads.

                The source is a 16:9 banner, so the box is 16:9 too: crop it to
                anything squarer and `object-cover` starts cutting the artwork's
                own text off at the edges. On a phone it opens up to 3:2, where
                a full-width 16:9 strip would be too short to read.

                `sizes` has to match the column it actually lands in, or Next
                serves a 1088px file for a ~440px slot.

                No `lg:mt-14` any more — that margin existed to shove the image
                down towards the middle of the text block, which is what the
                grid's `items-center` now does properly and without leaving a
                hole under the byline. */}
            {blog.hero && (
              <figure className="lg:col-span-5">
                <div className="relative aspect-3/2 sm:aspect-16/9 w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-900/5">
                  <Image
                    src={blog.hero.src}
                    alt={blog.hero.alt}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 440px"
                    className="object-cover object-center"
                  />
                </div>

                {blog.hero.caption && (
                  // Two lines at this width, so the height it adds is
                  // predictable — which is what lets the centring above stay
                  // balanced instead of drifting with the caption's length.
                  <figcaption className="mt-2.5 text-[12px] leading-relaxed text-slate-500">
                    {blog.hero.caption}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">

          {/* ── SIDEBAR ────────────────────────────────────────────────────
              First in the DOM, second on the grid (lg:order-2). On a phone
              that puts the contents list and the booking card directly under
              the headline, which is where both are actually useful; on desktop
              the rail sticks beside the prose instead of scrolling away. */}
          <aside className="lg:col-span-4 lg:order-2">
            <div className="lg:sticky lg:top-24 space-y-5">

              {blog.sections.length > 3 && (
                <nav
                  aria-labelledby="blog-toc-heading"
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <h2
                    id="blog-toc-heading"
                    className="text-[12px] font-bold uppercase tracking-wide text-emerald-900"
                  >
                    Is page par
                  </h2>

                  <ol className="mt-3 space-y-2">
                    {blog.sections.map((section, i) => (
                      <li key={section.id} className="flex gap-2.5">
                        <span
                          aria-hidden
                          className="mt-px text-[10.5px] font-bold tabular-nums text-slate-300"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <a
                          href={`#${section.id}`}
                          title={`Jump to: ${section.heading}`}
                          className="text-[12.5px] font-medium leading-snug text-slate-600 transition-colors hover:text-emerald-700"
                        >
                          {section.heading}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {/* Booking card. Rendered only for a town that has a service
                  page — same rule as the CTA further down. */}
              {labCity && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
                  <p className="text-[13.5px] font-bold text-emerald-950">
                    {labCity.name} me ghar par sample collection
                  </p>

                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-600">
                    Free home collection · slot subah 6 baje se · report 24 ghante me.
                  </p>

                  <Link
                    href={`/lab-test/${labCity.slug}#book`}
                    title={`Book a lab test in ${labCity.name} — free home sample collection`}
                    className="mt-4 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Test book karein
                  </Link>

                  <a
                    href={`tel:${SITE_PHONE.replace(/[^+\d]/g, "")}`}
                    title={`Call ${SITE_PHONE} to book a lab test`}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-600 px-4 py-2.5 text-[13px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <Phone aria-hidden className="h-3.5 w-3.5" />
                    {SITE_PHONE}
                  </a>
                </div>
              )}
            </div>
          </aside>

          {/* ── ARTICLE ────────────────────────────────────────────────────── */}
          <article className="min-w-0 lg:col-span-8 lg:order-1">

            {/* The skimmer's version of the whole piece. Most readers stop
                here, and a search snippet is often lifted from exactly this
                kind of tight summary near the top. */}
            {blog.takeaways.length > 0 && (
              <section
                aria-labelledby="blog-takeaways-heading"
                className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6"
              >
                <h2
                  id="blog-takeaways-heading"
                  className="text-[13px] font-bold uppercase tracking-wide text-emerald-900"
                >
                  Ek nazar me
                </h2>

                <ul className="mt-3.5 space-y-2.5">
                  {blog.takeaways.map((point, i) => (
                    <li key={i} className="flex gap-2.5">
                      <Check
                        aria-hidden
                        className="mt-[3px] h-4 w-4 shrink-0 text-emerald-600"
                        strokeWidth={2.8}
                      />
                      <span className="text-[13.5px] leading-relaxed text-slate-700">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <BlogProse sections={blog.sections} />

            {/* CTA — rendered only when this town has a service page. The href
                is checked against the live city list above, so it cannot 404. */}
            {labCity && (
              <div className="mt-12 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 p-6 sm:p-8 text-white">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {blog.cityName} me abhi book kijiye
                </h2>

                <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-emerald-50">
                  {`Free home sample collection, slot subah 6 baje se, aur report 24 ghante me — poore ${blog.cityName} me.`}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/lab-test/${labCity.slug}`}
                    title={linkTitle(`/lab-test/${labCity.slug}`)}
                    className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-[14px] font-bold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    {labCity.name} me lab test book karein
                  </Link>

                  <Link
                    href="/"
                    title={linkTitle("/")}
                    className="inline-flex items-center rounded-xl border border-white/70 px-6 py-3 text-[14px] font-bold text-white transition hover:bg-white/10"
                  >
                    Sabhi test aur rate list
                  </Link>
                </div>
              </div>
            )}

            {/* FAQs — the visible copy behind the FAQPage node above. Plain
                markup, not an accordion: an answer hidden behind JavaScript is
                an answer that may not be counted. */}
            {blog.faqs.length > 0 && (
              <section aria-labelledby="blog-faq-heading" className="mt-14">
                <h2
                  id="blog-faq-heading"
                  className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900"
                >
                  Aksar poochhe jaane wale sawaal
                </h2>

                <div className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
                  {blog.faqs.map((faq) => (
                    <div key={faq.question} className="p-5">
                      <h3 className="text-[14.5px] font-bold leading-snug text-slate-900">
                        {faq.question}
                      </h3>
                      <p className="mt-2 text-[13.5px] leading-[1.75] text-slate-600">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Hand-picked contextual links for this post, if it declares any. */}
            {blog.relatedLinks && (
              <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200">
                <LabRelatedLinks related={blog.relatedLinks} />
              </div>
            )}

            <BlogShare url={blog.canonical} title={blog.title} />

            {/* The generated grid: every lab town and every other guide. Built
                from the live lists so it cannot point at a town we have
                stopped serving. */}
            <BlogCityLinks labCities={labCities} posts={blogs} current={blog.href} />

            {related.length > 0 && (
              <section aria-labelledby="blog-related-heading" className="mt-12">
                <h2
                  id="blog-related-heading"
                  className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900"
                >
                  Aage padhiye
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {related.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={linkTitle(item.href)}
                      className="rounded-xl border border-slate-200 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                        {item.cityName}
                      </span>

                      <h3 className="mt-1.5 text-[14.5px] font-bold leading-snug text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>
      </div>
    </>
  );
}
