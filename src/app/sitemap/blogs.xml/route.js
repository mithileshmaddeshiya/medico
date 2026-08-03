import { blogs } from "@/data/blogs";
import { SITE } from "@/lib/site";

export const revalidate = 86400; // regenerate once per day instead of every request

/**
 * Every /blogs/<category>/<city> post, read off the registry in
 * src/data/blogs/ rather than hand-typed.
 *
 * A post whose metadata says robots.index === false is left out on purpose:
 * submitting a noindex URL is what Search Console flags as "Submitted URL marked
 * 'noindex'", and it spends crawl budget on a page that can never rank.
 *
 * `lastmod` is the post's own `updatedAt`, not today's date. It used to be
 * today's — which told Google that every article changed every single day, and
 * a lastmod that is always "now" is one Google learns to ignore entirely.
 */
/** Only a real YYYY-MM-DD is emitted — an unparseable date drops the element. */
const lastmodOf = (blog) =>
  /^\d{4}-\d{2}-\d{2}$/.test(String(blog.updatedAt ?? ""))
    ? `
      <lastmod>${blog.updatedAt}</lastmod>`
    : "";

export async function GET() {
  const urls = blogs
    .filter((blog) => blog?.category && blog?.city && blog?.robots?.index !== false)
    .map(
      (blog) => `
    <url>
      <loc>${SITE}/blogs/${blog.category}/${blog.city}</loc>${lastmodOf(blog)}
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
