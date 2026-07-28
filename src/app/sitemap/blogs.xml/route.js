import { blogs } from "@/data/blogData";
import { SITE } from "@/lib/site";

export const revalidate = 86400; // regenerate once per day instead of every request

/**
 * Every /blogs/<category>/<city> post, read off blogData rather than hand-typed.
 *
 * A post whose metadata says robots.index === false is left out on purpose:
 * submitting a noindex URL is what Search Console flags as "Submitted URL marked
 * 'noindex'", and it spends crawl budget on a page that can never rank.
 */
export async function GET() {
  const lastmod = new Date().toISOString().split("T")[0];

  const urls = blogs
    .filter((blog) => blog?.category && blog?.city && blog?.robots?.index !== false)
    .map(
      (blog) => `
    <url>
      <loc>${SITE}/blogs/${blog.category}/${blog.city}</loc>
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
