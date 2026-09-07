/**
 * The shape a post file is turned into before anything renders it.
 *
 * Pure functions only — no filesystem, no Node built-ins. The loader in
 * ./index.js reads the JSON; this file decides what a valid post looks like,
 * and src/components/blog/BlogProse.jsx imports `partsOf` from here without
 * dragging a single article's text into its bundle.
 *
 * ── WHY THE POST FILES CARRY SO LITTLE ───────────────────────────────────
 * A post used to repeat `canonical`, `robots`, `author` and `publisher` — four
 * fields identical on every article, copy-pasted into each one. They are
 * derived here instead. `category` and `city` are gone too: the file's own path
 * says both (content/blogs/<city>/<category>.json), so they cannot drift out of
 * sync with the URL the way a typed field can.
 */
import { BRAND_LOGO } from "@/lib/schema";
import { SITE } from "@/lib/site";

/** URL-safe slug, same rules as the lab section's (src/data/lab/cities.js). */
export const slugify = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** "varanasi" → "Varanasi", "bhatpar-rani" → "Bhatpar Rani". */
export const titleCase = (slug) =>
  String(slug ?? "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/**
 * A paragraph as an array of parts.
 *
 * A plain string is one part. An array is already parts, each either a string
 * or `{ text, href }` — the shape the page turns into a real <Link>. Same
 * convention as the lab section's prose, see partsOf in LabContent.jsx.
 */
export const partsOf = (para) => (Array.isArray(para) ? para : [para]);

/** The plain text of a paragraph, links flattened — used for word counts. */
const textOf = (para) =>
  partsOf(para)
    .map((part) => (typeof part === "string" ? part : (part?.text ?? "")))
    .join("");

/** Byline for every post. Articles here are editorial, not personally authored. */
export const BLOG_AUTHOR = {
  name: "MedicoBharat Editorial Team",
  url: SITE,
};

/**
 * Publisher node for BlogPosting.
 *
 * The logo is IMPORTED from src/lib/schema.js, not retyped. Two files here used
 * to spell out a path to /navbar/navbg.webp — a file that has never existed in
 * /public — so the publisher logo on every article 404'd, which is on its own
 * enough for Google to withhold the Article rich result. Sharing the constant
 * means the same company can never be described with two different logos on the
 * same domain, and there is one path to check if it ever moves.
 */
export const BLOG_PUBLISHER = {
  name: "MedicoBharat",
  logo: BRAND_LOGO,
};

/**
 * The indexing rules an article ships with.
 *
 * `max-image-preview: large` is the one that matters here: without it Google
 * shows a thumbnail instead of a full-width image in Discover and mobile
 * results. Set `"noindex": true` in a post's JSON to hold it back — the sitemap
 * at src/app/sitemap/blogs.xml/route.js drops it automatically rather than
 * submitting a URL that can never be indexed.
 */
const INDEXABLE = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

const NOINDEX = { index: false, follow: true };

/** The canonical for a post. Always absolute, always www — see src/lib/site.js. */
export const canonicalFor = (category, city) =>
  `${SITE}/blogs/${category}/${city}`;

/**
 * One block of a section's body.
 *
 * A section is a sequence of these rather than a flat list of paragraphs,
 * because a wall of six paragraphs is the thing readers skip and the thing a
 * search result cannot pull a useful snippet out of. The same facts as a table
 * or a list get read, get scanned, and — for a "kaun sa test kab" question —
 * are what a featured snippet is actually built from.
 *
 * Authored form, in a section's `blocks` array:
 *
 *   "plain paragraph"                     → paragraph
 *   ["text ", { text, href }, " more"]    → paragraph with in-prose links
 *   { "list": [...] }                     → bulleted list (items may be parts)
 *   { "table": { head, rows } }           → table
 *   { "note": { title, text, tone } }     → callout; tone "info" or "warn"
 *
 * `paras` is still accepted and means "every entry is a paragraph".
 */
const normaliseBlock = (block, index, sectionId) => {
  if (typeof block === "string" || Array.isArray(block)) {
    return { kind: "p", parts: partsOf(block) };
  }

  if (block?.list) {
    const items = block.list.filter(Boolean);
    return items.length ? { kind: "list", items } : null;
  }

  if (block?.table) {
    const { head = [], rows = [] } = block.table;
    if (!rows.length) return null;
    return { kind: "table", head, rows, caption: block.table.caption ?? null };
  }

  if (block?.note) {
    const { title = "", text = "", tone = "info" } = block.note;
    if (!text) return null;
    return { kind: "note", title, text, tone: tone === "warn" ? "warn" : "info" };
  }

  // An unrecognised block is dropped rather than crashing the build. It is
  // still worth knowing about, so it is named in the server log.
  console.warn(`[blogs] ${sectionId}: block ${index} has no recognised shape`);
  return null;
};

/**
 * One section, in the shape the page renders.
 *
 * `id` becomes the heading's anchor and its entry in the on-page contents, so
 * it must be stable: once an article is live, changing an id breaks every link
 * anyone has shared to that section. Write it explicitly in the post; the
 * fallback to a slugified heading exists only so a post with no ids still gets
 * anchors.
 */
const normaliseSection = (section, index, postId) => {
  const heading = String(section?.heading ?? "").trim();
  if (!heading) {
    throw new Error(`[blogs] ${postId}: section ${index} has no heading`);
  }

  const id = slugify(section.id) || slugify(heading) || `section-${index + 1}`;

  // `blocks` (mixed), `paras` (all paragraphs) or `content` (a single string).
  // A section with none of them renders its heading and nothing else rather
  // than throwing — a heading alone is recoverable, a build failure on a live
  // site is not.
  const source = Array.isArray(section.blocks)
    ? section.blocks
    : Array.isArray(section.paras)
      ? section.paras
      : section.content
        ? [section.content]
        : [];

  return {
    id,
    heading,
    /** Optional one-line summary under the heading. */
    lead: section.lead ?? null,
    blocks: source
      .map((block, i) => normaliseBlock(block, i, `${postId}#${id}`))
      .filter(Boolean),
    // Optional in-body image. `src` must be a real file under /public — an
    // image path that 404s costs the rich result it was added to earn.
    image: section.image?.src ? section.image : null,
  };
};

/** Every word a section renders, links and table cells flattened. */
const wordsOf = (section) =>
  section.blocks
    .flatMap((block) => {
      if (block.kind === "p") return [textOf(block.parts)];
      if (block.kind === "list") return block.items.map(textOf);
      if (block.kind === "table") return block.rows.flat().map(textOf);
      if (block.kind === "note") return [block.text];
      return [];
    })
    .join(" ");

/** Rough reading time, used when a post does not state one. ~200 wpm. */
const readingTimeOf = (sections) => {
  const words = sections
    .map(wordsOf)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/**
 * A post file plus its route, turned into the object every page reads.
 *
 * `category` and `city` come from the caller — the loader derives them from the
 * file path — never from the file's own contents. A malformed post throws here,
 * at build, naming the file, rather than rendering a broken page.
 */
export function normalisePost(raw, { category, city }) {
  const id = `${category}/${city}`;

  if (!category || !city) {
    throw new Error(`[blogs] a post is missing category or city (got "${id}")`);
  }
  if (!raw?.title || !raw?.description) {
    throw new Error(`[blogs] ${id}: title and description are required`);
  }

  const sections = (raw.sections ?? []).map((section, i) =>
    normaliseSection(section, i, id)
  );

  return {
    category,
    city,
    /** Display name for prose and headings — "varanasi" reads badly in a sentence. */
    cityName: raw.cityName || titleCase(city),
    /** The route this post lives at. Never build this string by hand elsewhere. */
    href: `/blogs/${category}/${city}`,
    canonical: canonicalFor(category, city),
    robots: raw.noindex ? NOINDEX : INDEXABLE,
    author: BLOG_AUTHOR,
    publisher: BLOG_PUBLISHER,

    title: raw.title,
    description: raw.description,
    keywords: raw.keywords ?? [],
    /* Position within its city's listing. Replaces the hand-ordered array the
       old registry kept in <city>/index.js — a post now says where it belongs
       instead of a second file having to be edited to place it. */
    order: Number.isFinite(raw.order) ? raw.order : 1000,
    publishedAt: raw.publishedAt ?? null,
    // `updatedAt` drives dateModified and the visible "updated" line; a post
    // that only sets publishedAt is treated as never revised, which is honest.
    updatedAt: raw.updatedAt || raw.publishedAt || null,
    readingMinutes: raw.readingMinutes ?? readingTimeOf(sections),
    hero: raw.hero?.src ? raw.hero : null,

    /**
     * The three or four things a reader gets even if they read nothing else.
     * Rendered as a box directly under the intro — it is the part a skimmer
     * reads, and the part a search snippet most often lifts.
     */
    takeaways: raw.takeaways ?? [],
    sections,
    faqs: raw.faqs ?? [],
    relatedLinks: raw.relatedLinks ?? null,
  };
}

/**
 * The card-sized view of a post: everything a listing, a sitemap entry or a
 * related-article tile needs, and none of the body.
 *
 * This is the whole reason the site can carry an unlimited number of articles.
 * /blogs, the home page rail, the 404 page and both sitemaps ask for the LIST;
 * if the list carried `sections`, every one of those pages would hold the full
 * text of every article. They hold well under a kilobyte per post instead, and
 * only /blogs/<category>/<city> ever loads a body — its own, one file.
 */
export const metaOf = (post) =>
  post && {
    category: post.category,
    city: post.city,
    cityName: post.cityName,
    href: post.href,
    canonical: post.canonical,
    robots: post.robots,
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    order: post.order,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    readingMinutes: post.readingMinutes,
    hero: post.hero,
  };
