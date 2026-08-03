/**
 * The blog registry — one place the whole site reads articles from.
 *
 * ── WHY A FOLDER PER CITY ────────────────────────────────────────────────
 * This replaces src/data/blogData.js, which was a single 500-line array with
 * every post inlined. Three posts fitted; the fourth did not, and the moment
 * a second city arrived there was nowhere obvious to put it. The lab section
 * had already solved the same problem — src/data/lab/cities.js plus a file per
 * city under content/ — so the blogs now follow that shape:
 *
 *   src/data/blogs/
 *   ├── index.js            ← you are here: registry + lookups
 *   ├── shared.js           ← author, publisher, robots, canonical helper
 *   ├── varanasi/
 *   │   ├── index.js        ← the city's list
 *   │   └── lab-test-in-varanasi.js
 *   └── deoria/
 *       ├── index.js
 *       └── …three posts
 *
 * To add a city: create the folder with an index.js exporting an array, then
 * import it into CITY_BLOGS below. To add a post to a city that already
 * exists, you never touch this file at all.
 *
 * ── WHAT NORMALISATION BUYS ──────────────────────────────────────────────
 * Posts are written in two eras. The Deoria posts give each section a single
 * `content` string; the Varanasi post gives `paras`, an array, where a
 * paragraph may itself be an array of parts so it can carry in-prose links.
 * The page should not know that. So every post is squeezed into one shape
 * here, and a malformed post throws at import time — at build, in a stack
 * trace naming the file — rather than rendering a broken page in production.
 */
import { deoriaBlogs } from "./deoria";
import { varanasiBlogs } from "./varanasi";

/**
 * Every city's list, in the order a listing should show them.
 *
 * Varanasi first: it is the newest article and the only lab-test guide, so it
 * is the one worth putting in front of a reader who lands on /blogs/* from
 * anywhere else.
 */
const CITY_BLOGS = [varanasiBlogs, deoriaBlogs];

/** URL-safe slug, same rules as the lab section's (src/data/lab/cities.js). */
const slugify = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** "varanasi" → "Varanasi", "bhatpar-rani" → "Bhatpar Rani". */
const titleCase = (slug) =>
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
const partsOf = (para) => (Array.isArray(para) ? para : [para]);

/** The plain text of a paragraph, links flattened — used for word counts. */
const textOf = (para) =>
  partsOf(para)
    .map((part) => (typeof part === "string" ? part : (part?.text ?? "")))
    .join("");

/**
 * One block of a section's body.
 *
 * A section is a sequence of these rather than a flat list of paragraphs,
 * because a wall of six paragraphs is the thing readers skip and the thing a
 * search result cannot pull a useful snippet out of. The same facts as a table
 * or a list get read, get scanned, and — for a "kaun sa test kab" question —
 * are what a featured snippet is actually built from.
 *
 * Authored form, in a post's `blocks` array:
 *
 *   "plain paragraph"                        → paragraph
 *   ["text ", { text, href }, " more"]       → paragraph with in-prose links
 *   { list: [...] }                          → bulleted list (items may be parts)
 *   { table: { head: [...], rows: [[...]] } } → table
 *   { note: { title, text, tone } }          → callout; tone "info" | "warn"
 *
 * `paras` is still accepted and means "every entry is a paragraph" — that is
 * what the older Deoria posts use.
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
 * fallback to a slugified heading exists only so the older posts, which have
 * no ids, still get anchors.
 */
const normaliseSection = (section, index, postId) => {
  const heading = String(section?.heading ?? "").trim();
  if (!heading) {
    throw new Error(`[blogs] ${postId}: section ${index} has no heading`);
  }

  const id = slugify(section.id) || slugify(heading) || `section-${index + 1}`;

  // `blocks` (mixed), `paras` (all paragraphs) or `content` (the original
  // single string). A section with none of them renders its heading and
  // nothing else rather than throwing — a heading alone is recoverable, a
  // build failure on a live site is not.
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
    // Optional in-body image. `src` must be a real file under /public — see the
    // images note in varanasi/lab-test-in-varanasi.js for why that is a rule
    // and not a preference.
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

function normalise(post) {
  const category = slugify(post?.category);
  const city = slugify(post?.city);
  const id = `${category}/${city}`;

  if (!category || !city) {
    throw new Error(
      `[blogs] a post is missing category or city (got "${post?.category}" / "${post?.city}")`
    );
  }
  if (!post.title || !post.description) {
    throw new Error(`[blogs] ${id}: title and description are required`);
  }

  const sections = (post.sections ?? []).map((section, i) =>
    normaliseSection(section, i, id)
  );

  return {
    ...post,
    category,
    city,
    /** Display name for prose and headings — "varanasi" reads badly in a sentence. */
    cityName: post.cityName || titleCase(city),
    /** The route this post lives at. Never build this string by hand elsewhere. */
    href: `/blogs/${category}/${city}`,
    keywords: post.keywords ?? [],
    faqs: post.faqs ?? [],
    sections,
    /**
     * The three or four things a reader gets even if they read nothing else.
     * Rendered as a box directly under the intro — it is the part a skimmer
     * reads, and the part a search snippet most often lifts.
     */
    takeaways: post.takeaways ?? [],
    hero: post.hero?.src ? post.hero : null,
    relatedLinks: post.relatedLinks ?? null,
    readingMinutes: post.readingMinutes ?? readingTimeOf(sections),
    // `updatedAt` drives dateModified and the visible "updated" line; a post
    // that only sets publishedAt is treated as never revised, which is honest.
    updatedAt: post.updatedAt || post.publishedAt || null,
  };
}

/**
 * Every article, normalised and flattened.
 *
 * Built once at module load. A duplicate route is thrown on rather than
 * silently resolved, because `blogs.find()` would just return whichever came
 * first and the other post would be unreachable with no error anywhere.
 */
export const blogs = (() => {
  const list = CITY_BLOGS.flat().map(normalise);

  const seen = new Set();
  for (const post of list) {
    if (seen.has(post.href)) {
      throw new Error(`[blogs] two posts share the route ${post.href}`);
    }
    seen.add(post.href);
  }

  return list;
})();

/** One post by its route parts, or null — the lookup every route handler uses. */
export const getBlog = (category, city) =>
  blogs.find(
    (post) => post.category === slugify(category) && post.city === slugify(city)
  ) ?? null;

/** Every post for a city, newest first. */
export const getBlogsByCity = (city) =>
  blogs
    .filter((post) => post.city === slugify(city))
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));

/**
 * What to link at the foot of an article.
 *
 * The city's other posts first — same town, same reader, so those are the most
 * likely next click — then posts from other cities to fill up to `limit`. The
 * old page listed ONLY same-city posts, which meant the Varanasi article, being
 * the only one for its city, would have rendered an empty "Related Articles"
 * heading and linked nowhere.
 */
export const getRelatedBlogs = (post, limit = 4) => {
  if (!post) return blogs.slice(0, limit);

  const sameCity = blogs.filter(
    (item) => item.city === post.city && item.href !== post.href
  );
  const elsewhere = blogs.filter((item) => item.city !== post.city);

  return [...sameCity, ...elsewhere].slice(0, limit);
};

/** The newest posts across every city — for the homepage rail. */
export const getLatestBlogs = (limit = 3) =>
  [...blogs]
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
    .slice(0, limit);

export { partsOf, slugify };
