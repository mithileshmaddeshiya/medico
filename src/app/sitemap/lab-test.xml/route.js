import { getLabCitySlugs } from "@/lib/labCities";
import { SITE } from "@/lib/site";

export const revalidate = 86400; // regenerate once per day instead of every request

/**
 * Every /lab-test/<city> we serve.
 *
 * Derived from the same list the pages and generateStaticParams read, never
 * hand-typed. The hand-typed version submitted "/lab-test/varansi" — a typo for
 * varanasi — so the only URL in this sitemap was a 404 and the real page was
 * never submitted at all. A generated list cannot drift from the routes that
 * actually exist, and a new city is in the sitemap the moment it ships.
 */
export async function GET() {
  const slugs = await getLabCitySlugs();
  const lastmod = new Date().toISOString().split("T")[0];

  const urls = slugs
    .map(
      (slug) => `
    <url>
      <loc>${SITE}/lab-test/${slug}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>`
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}
