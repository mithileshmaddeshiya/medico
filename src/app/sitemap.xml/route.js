import { blogs } from "@/data/blogs";
import { getLabCities } from "@/lib/labCities";
import { SITE } from "@/lib/site";

/**
 * The newest hand-typed review date in sitemap/static.xml.
 *
 * The static pages have nothing to derive a date from, so theirs are typed by a
 * human in that file. This mirrors the newest of them so the index can include
 * them in its own calculation. Bump it whenever you bump one there.
 */
const STATIC_REVIEWED = "2026-08-24";

export const revalidate = 86400; // regenerate once per day instead of every request

/**
 * The sitemap *index* — the one URL robots.txt points Google at.
 *
 * This must use <sitemapindex>/<sitemap>, not <urlset>/<url>. It used to be an
 * app/sitemap.js, and that file convention can only ever emit a <urlset>: Google
 * then read the four children as four ordinary page URLs that happen to end in
 * .xml, never opened them as sitemaps, and so not one real page on the site was
 * ever submitted. That is why /lab-test/* showed as "Discovered – not indexed".
 *
 * Keep this a route handler for that reason — do not "simplify" it back to
 * app/sitemap.js.
 */
/* "/sitemap/medicine-delivery.xml" used to be in this list. It is gone with
   the section it described — submitting URLs that now 308 to a lab page would
   spend crawl budget confirming a redirect Google will follow from the old
   links anyway, and a sitemap full of redirects is a signal that the sitemap
   is not maintained. The redirects themselves live in next.config.mjs. */
const CHILDREN = [
  "/sitemap/static.xml",
  "/sitemap/lab-test.xml",
  "/sitemap/blogs.xml",
];

/**
 * The index's own `lastmod` is the newest date any child actually carries — not
 * the clock.
 *
 * It was `new Date().toISOString()`, which with `revalidate = 86400` told Google
 * that all four child sitemaps changed every day forever. A lastmod that always
 * says "now" is one Google learns to ignore, and the ignored signal here is the
 * one that decides how often it bothers re-reading the children at all.
 *
 * Reading the real dates means computing them from the same sources the children
 * do, so this can never disagree with them.
 */
async function newestChildDate() {
  const cities = await getLabCities();

  const dates = [
    // The static pages' hand-maintained review dates live in the child itself;
    // STATIC_REVIEWED mirrors the newest of them. Bump it when you bump one there.
    STATIC_REVIEWED,
    ...cities.map((city) => city.updated),
    ...blogs.map((blog) => blog.updatedAt),
  ].filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(String(date ?? "")));

  // Plain string comparison is correct and total for ISO YYYY-MM-DD.
  return dates.length ? dates.sort().at(-1) : STATIC_REVIEWED;
}

export async function GET() {
  const lastmod = await newestChildDate();

  const sitemaps = CHILDREN.map(
    (path) => `
  <sitemap>
    <loc>${SITE}${path}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
  ).join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps}
</sitemapindex>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}
