/**
 * Articles, read from MySQL. Server only.
 *
 * ── WHY THE DATABASE AND NOT THE FILES ───────────────────────────────────
 * content/blogs/<city>/<category>.json is still here and still works — see the
 * long note at the top of ./index.js for why that design is good. It has one
 * property the admin panel cannot live with: publishing means writing a file,
 * and on Vercel the filesystem is read-only at runtime. A panel that writes a
 * post to disk would appear to work in `next dev` and silently lose every post
 * in production.
 *
 * So the panel writes to MySQL, and this module reads it back in exactly the
 * shape ./normalise.js produces. ./index.js then layers the two:
 *
 *   a route in the database  →  the database wins
 *   a route only on disk     →  the file is used, unchanged
 *   the database unreachable →  the files alone, and the site stays up
 *
 * That is the same arrangement src/lib/testCatalog.js already uses for prices,
 * and for the same reason: the dynamic source is authoritative, the file is the
 * floor the site cannot fall through.
 *
 * ── THE FIFTY-ODD EXISTING POSTS ─────────────────────────────────────────
 * They stay as files until somebody imports them (`npm run blogs:import`),
 * which copies each one into the table with its structured `sections` intact.
 * An imported post renders identically — the importer does not convert prose
 * into HTML it might mangle. The first time one is opened in the editor, and
 * only then, its sections are flattened to HTML and the editor takes over.
 */
import { dbConfigured, query } from "@/lib/db";
import { SITE } from "@/lib/site";

import { BLOG_AUTHOR, BLOG_PUBLISHER, canonicalFor, titleCase } from "./normalise";

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

/** JSON columns come back parsed by mysql2, but a hand-written NULL does not. */
const json = (value, fallback) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

/** A DATE column as YYYY-MM-DD, never a timezone-shifted ISO string. */
const dateOnly = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 10);
  // mysql2 hands back a Date at local midnight; toISOString would roll it back
  // a day east of UTC, and a publish date that moves is a lastmod that lies.
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const heroOf = (row) => {
  if (row.hero_media_id) {
    return {
      src: `/media/${row.hero_media_id}/${row.category}-${row.city}.webp`,
      alt: row.hero_alt || row.title,
    };
  }
  return row.hero_src ? { src: row.hero_src, alt: row.hero_alt || row.title } : null;
};

/** Rough reading time from the body text, matching ./normalise.js's ~200 wpm. */
const readingTimeOf = (html) => {
  const words = String(html ?? "")
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/** One row → the object every page reads. Same keys as normalisePost(). */
function shape(row) {
  const robots = row.noindex
    ? { index: false, follow: !row.nofollow }
    : row.nofollow
      ? { ...INDEXABLE, follow: false, googleBot: { ...INDEXABLE.googleBot, follow: false } }
      : INDEXABLE;

  return {
    category: row.category,
    city: row.city,
    cityName: row.city_name || titleCase(row.city),
    href: `/blogs/${row.category}/${row.city}`,
    canonical: row.canonical || canonicalFor(row.category, row.city),
    robots,
    author: BLOG_AUTHOR,
    publisher: BLOG_PUBLISHER,

    title: row.title,
    description: row.description,
    keywords: json(row.keywords_json, []),
    order: row.sort_order ?? 1000,
    publishedAt: dateOnly(row.published_at),
    updatedAt: dateOnly(row.updated_on) || dateOnly(row.published_at),
    readingMinutes: row.reading_minutes || readingTimeOf(row.body_html),
    hero: heroOf(row),

    takeaways: json(row.takeaways_json, []),
    /* An imported post keeps its structured sections and renders through
       BlogProse exactly as it did from disk. A post written in the panel has
       `bodyHtml` instead, and the page renders that. A post can hold both
       during an import→edit transition; bodyHtml wins, because it is the one
       somebody edited last. */
    sections: json(row.sections_json, []),
    bodyHtml: row.body_html || null,
    faqs: json(row.faqs_json, []),
    relatedLinks: json(row.related_json, null),

    /* Only the database knows these; the file-backed posts simply do not have
       them, and every consumer treats absent as the default. */
    inSitemap: row.in_sitemap !== 0,
    priority: Number(row.priority ?? 0.9),
    changefreq: row.changefreq || "weekly",
    seoScore: row.seo_score ?? 0,
    source: "db",
  };
}

/** The columns a listing needs — never body_html or sections_json. */
const META_COLUMNS = `
  category, city, city_name, title, description, keywords_json, canonical,
  hero_media_id, hero_src, hero_alt, noindex, nofollow, in_sitemap, priority,
  changefreq, seo_score, reading_minutes, sort_order, published_at, updated_on`;

/**
 * Metadata for every PUBLISHED post. Drafts, archived and deleted posts are
 * not part of the site and never appear here — the panel has its own reader
 * (src/lib/admin/blogStore.js) for those.
 *
 * Never throws: a database that is down means the site falls back to the files,
 * which is the whole point of the arrangement.
 */
export async function dbBlogMeta() {
  if (!dbConfigured()) return [];

  try {
    const [rows] = await query(
      `SELECT ${META_COLUMNS}, NULL AS body_html, NULL AS sections_json,
              NULL AS takeaways_json, NULL AS faqs_json, NULL AS related_json
       FROM blog_posts
       WHERE status = 'published'
       ORDER BY city, sort_order, published_at DESC`
    );
    return rows.map(shape);
  } catch (err) {
    console.error("[blogs] could not read posts from MySQL, using content/blogs only", err);
    return [];
  }
}

/** One published post in full, or null. The only query that loads a body. */
export async function dbBlog(category, city) {
  if (!dbConfigured()) return null;

  try {
    const [rows] = await query(
      `SELECT ${META_COLUMNS}, body_html, sections_json, takeaways_json,
              faqs_json, related_json
       FROM blog_posts
       WHERE category = ? AND city = ? AND status = 'published'
       LIMIT 1`,
      [category, city]
    );
    return rows[0] ? shape(rows[0]) : null;
  } catch (err) {
    console.error(`[blogs] could not read ${category}/${city} from MySQL`, err);
    return null;
  }
}

/**
 * A preview of an unpublished post, for the panel's "View draft" link.
 *
 * Draft URLs are noindex without exception — a draft that leaks into the index
 * is a half-written page competing with the finished one for the same query.
 */
export async function dbBlogDraft(category, city) {
  if (!dbConfigured()) return null;

  const [rows] = await query(
    `SELECT ${META_COLUMNS}, body_html, sections_json, takeaways_json,
            faqs_json, related_json
     FROM blog_posts
     WHERE category = ? AND city = ? AND status <> 'deleted'
     LIMIT 1`,
    [category, city]
  );
  if (!rows[0]) return null;

  return { ...shape(rows[0]), robots: { index: false, follow: false }, isDraft: true };
}

export { SITE };
