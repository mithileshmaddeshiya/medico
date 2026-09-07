/**
 * The one place the whole site reads articles from.
 *
 * ── HOW YOU PUBLISH A POST NOW ───────────────────────────────────────────
 * Drop a JSON file here:
 *
 *   content/blogs/<city>/<category>.json   →   /blogs/<category>/<city>
 *
 * That is the entire step. The folder is the city, the filename is the
 * category, and together they ARE the URL. The route, the /blogs listing, the
 * sitemap, the OG share card, the BlogPosting + FAQ + Breadcrumb schema, the
 * home page rail and the related-article cards all pick it up on their own.
 * See content/blogs/README.md for the field list.
 *
 * ── WHAT THIS REPLACED, AND WHY ──────────────────────────────────────────
 * Articles used to be JavaScript modules under src/data/blogs/, each one
 * imported by its city's index.js, which was in turn imported by a registry
 * index.js. Two problems, and the second is the one that mattered.
 *
 * 1. A NEW POST TOOK THREE EDITS, and forgetting one was silent. A file left
 *    out of its city array compiled, linted and sat in git looking finished —
 *    while its URL 404'd, it was in no sitemap, and every sibling linking to it
 *    pointed at a dead page. That happened to diabetes-thyroid-test-in-deoria
 *    for an entire commit. Here there is no array to forget.
 *
 * 2. EVERY PAGE CARRIED EVERY ARTICLE. The registry imported all fifteen post
 *    modules at the top level, so `import { getLatestBlogs } from "@/data/blogs"`
 *    on the 404 page pulled ~500 KB of article prose into that page's module
 *    graph. It grew with each post, on pages that only ever showed a title and
 *    a description. At a hundred posts it is megabytes; at "unlimited" it does
 *    not work at all.
 *
 * The fix is that article text is no longer code. It is data on disk, read by
 * this file, and the two things that ask for it ask for different amounts:
 *
 *   getBlogs() and friends → metadata only (metaOf in ./normalise.js).
 *     Bodies are parsed, measured and thrown away. A thousand posts cost about
 *     as much memory as one page of prose.
 *
 *   getBlog(category, city) → ONE file, the one being rendered.
 *     Nothing else is touched. This is what /blogs/<category>/<city> calls.
 *
 * So the cost of the hundredth article is one more small file on disk and one
 * more entry in the index. Nothing that renders it gets bigger.
 *
 * ── SERVER ONLY ──────────────────────────────────────────────────────────
 * This module reads the filesystem, so it may only be imported by Server
 * Components, Route Handlers and the `generate*` functions. A client component
 * that needs `partsOf` imports it from ./normalise, which touches no Node
 * built-ins.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { metaOf, normalisePost, slugify } from "./normalise";

/**
 * Where the articles live.
 *
 * Outside src/ on purpose: nothing under content/ is ever bundled, imported or
 * type-checked, so adding a post cannot change one byte of the JavaScript the
 * browser downloads. `process.cwd()` is the project root during `next build`,
 * `next dev` and `next start` alike.
 *
 * ⚠ Reading these files at REQUEST time (rather than at build) needs them
 * traced into the deployment — see `outputFileTracingIncludes` in
 * next.config.mjs. Removing that entry breaks the sitemap route, which
 * revalidates daily and so runs on the server, long after the build.
 */
const CONTENT_DIR = path.join(process.cwd(), "content", "blogs");

/**
 * How many post files are read at once while building the index.
 *
 * Bounded rather than `Promise.all` over everything: the point of this module
 * is that the article count does not drive memory, and an unbounded fan-out
 * would hold every article's text at once — exactly the thing being fixed. At
 * this width the peak is a couple of dozen files no matter how many exist.
 */
const READ_WIDTH = 24;

/** A file in content/blogs/<city>/, read and normalised, or null if absent. */
async function readPost(city, category) {
  const file = path.join(CONTENT_DIR, city, `${category}.json`);

  let raw;
  try {
    raw = await readFile(file, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    // Naming the file matters: a stray trailing comma in one post should not
    // read as "the blog system is broken".
    throw new Error(`[blogs] content/blogs/${city}/${category}.json is not valid JSON — ${error.message}`);
  }

  return normalisePost(parsed, { category, city });
}

/** Every (city, category) pair on disk. Cheap — directory names only. */
async function listRoutes() {
  let cityDirs;
  try {
    cityDirs = await readdir(CONTENT_DIR, { withFileTypes: true });
  } catch (error) {
    // No content directory yet is a legitimate state for a fresh checkout, and
    // it should show as "no articles", not as a build failure.
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const routes = [];

  for (const dir of cityDirs) {
    if (!dir.isDirectory()) continue;
    const city = slugify(dir.name);
    if (!city) continue;

    const files = await readdir(path.join(CONTENT_DIR, dir.name));
    for (const file of files) {
      // `_`-prefixed files are scratch or shared fragments, not posts.
      if (!file.endsWith(".json") || file.startsWith("_")) continue;
      const category = slugify(file.slice(0, -".json".length));
      if (category) routes.push({ city, category });
    }
  }

  return routes;
}

/**
 * Metadata for every post, sorted: cities stay grouped, and a city's guides
 * keep the sequence its author chose.
 *
 * ── WITHIN A CITY: the post's own `order` ────────────────────────────────
 * That is what preserves the curated sequence the old hand-written city arrays
 * encoded — "kaun sa test kab" first because it is the question almost everyone
 * arrives with, the service-shaped guides next, the test-specific ones last
 * because a reader reaches those already holding a prescription.
 *
 * ── ACROSS CITIES: the city with the newest guide first ──────────────────
 * The link grid at the foot of every article renders this list in order, and a
 * column that alternates Varanasi, Deoria, Varanasi, Deoria reads as a jumble;
 * one town at a time reads as a section. So cities are ranked rather than
 * interleaved — by their newest article, ties broken alphabetically.
 *
 * Ranked, not listed, on purpose. The old registry kept the city order in a
 * hand-written array, which is one more file to remember to edit; a town whose
 * first guide ships today simply sorts to the front on its own.
 *
 * A duplicate route is thrown on rather than silently resolved. Two files
 * cannot produce the same URL — the path IS the URL — but a `slugify` that
 * folds two different filenames together can, and that would leave one post
 * permanently unreachable with no error anywhere.
 */
async function buildIndex() {
  const routes = await listRoutes();
  const list = [];

  for (let i = 0; i < routes.length; i += READ_WIDTH) {
    const batch = routes.slice(i, i + READ_WIDTH);
    const posts = await Promise.all(
      batch.map(({ city, category }) => readPost(city, category))
    );
    // metaOf drops sections/faqs/takeaways here; the bodies just read are
    // unreachable from this point and can be collected.
    for (const post of posts) if (post) list.push(metaOf(post));
  }

  const seen = new Set();
  for (const post of list) {
    if (seen.has(post.href)) {
      throw new Error(`[blogs] two files resolve to the route ${post.href}`);
    }
    seen.add(post.href);
  }

  /* Each city's newest publish date, so a city can be ranked as a whole. */
  const newestIn = new Map();
  for (const post of list) {
    const seen = newestIn.get(post.city) ?? "";
    const date = String(post.publishedAt ?? "");
    if (date > seen) newestIn.set(post.city, date);
  }

  return list.sort(
    (a, b) =>
      // Cities, newest-guide-first…
      String(newestIn.get(b.city)).localeCompare(String(newestIn.get(a.city))) ||
      a.city.localeCompare(b.city) ||
      // …then the author's chosen sequence within the city.
      a.order - b.order ||
      String(b.publishedAt).localeCompare(String(a.publishedAt)) ||
      a.href.localeCompare(b.href)
  );
}

/**
 * The index, built once.
 *
 * Memoised in production because the files cannot change under a running
 * build or server, and every page that lists articles would otherwise re-read
 * the whole directory. NOT memoised in development, so a post you just added
 * shows up on refresh instead of after a restart.
 */
let indexPromise = null;

function loadIndex() {
  if (process.env.NODE_ENV !== "production") return buildIndex();
  indexPromise ??= buildIndex();
  return indexPromise;
}

/* ── The public API ───────────────────────────────────────────────────────
   Async throughout, like src/lib/labCities.js, so callers do not have to care
   whether a lookup touches the disk. */

/** Metadata for every post. No bodies — see metaOf in ./normalise.js. */
export async function getBlogs() {
  return loadIndex();
}

/**
 * One post, in full, or null when nothing is published at that route.
 *
 * The only function that loads an article body, and it loads exactly one.
 */
export async function getBlog(category, city) {
  const wantedCategory = slugify(decodeURIComponent(String(category ?? "")));
  const wantedCity = slugify(decodeURIComponent(String(city ?? "")));
  if (!wantedCategory || !wantedCity) return null;
  return readPost(wantedCity, wantedCategory);
}

/** Params for generateStaticParams — one entry per published article. */
export async function getBlogParams() {
  const list = await loadIndex();
  return list.map((post) => ({ category: post.category, city: post.city }));
}

/** Every post for a city, newest first. */
export async function getBlogsByCity(city) {
  const wanted = slugify(city);
  const list = await loadIndex();
  return list
    .filter((post) => post.city === wanted)
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
}

/**
 * What to link at the foot of an article.
 *
 * The city's other posts first — same town, same reader, so those are the most
 * likely next click — then posts from other cities to fill up to `limit`. Only
 * same-city would leave the first article written for a new town with an empty
 * "Related Articles" heading linking nowhere.
 */
export async function getRelatedBlogs(post, limit = 4) {
  const list = await loadIndex();
  if (!post) return list.slice(0, limit);

  const sameCity = list.filter(
    (item) => item.city === post.city && item.href !== post.href
  );
  const elsewhere = list.filter((item) => item.city !== post.city);

  return [...sameCity, ...elsewhere].slice(0, limit);
}

/**
 * The newest posts across every city — for the home page rail and the 404.
 *
 * `limit` omitted means all of them; the home page wants every guide, and a
 * typed number there is one more thing to remember to raise.
 */
export async function getLatestBlogs(limit = Infinity) {
  const list = await loadIndex();
  return [...list]
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
    .slice(0, limit);
}

export { partsOf, slugify } from "./normalise";
