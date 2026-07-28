import { SITE } from "@/lib/site";

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
const CHILDREN = [
  "/sitemap/static.xml",
  "/sitemap/medicine-delivery.xml",
  "/sitemap/lab-test.xml",
  "/sitemap/blogs.xml",
];

export async function GET() {
  const lastmod = new Date().toISOString();

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
