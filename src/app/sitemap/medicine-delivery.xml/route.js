import { cityData } from "@/data/medicine/cityData";
import { SITE } from "@/lib/site";

export const revalidate = 86400; // regenerate once per day instead of every request

/**
 * Every /medicine-delivery/<city> we serve, read off cityData rather than
 * hand-typed — the lab sitemap next door shipped a 404 for a year because its
 * list was typed by hand. Adding a city to src/data/medicine/cityData.js is all it takes
 * for it to appear here.
 */
export async function GET() {
  const slugs = Object.keys(cityData);
  const lastmod = new Date().toISOString().split("T")[0];

  const urls = slugs
    .map(
      (slug) => `
    <url>
      <loc>${SITE}/medicine-delivery/${slug}</loc>
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
