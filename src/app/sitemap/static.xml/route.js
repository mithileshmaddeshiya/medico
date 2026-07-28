import { SITE } from "@/lib/site";

export const revalidate = 86400; // regenerate once per day instead of every request

/**
 * The handful of one-off pages that are not generated from a city list.
 *
 * Every route here must actually resolve — "/blogs" used to be in this list and
 * has no page.js behind it, so the sitemap was handing Google a 404. Individual
 * posts live in sitemap/blogs.xml; there is no /blogs hub page to submit.
 */
const pages = [
  { route: "", priority: "1.0", changefreq: "daily" },

  // Core pages
  { route: "/about", priority: "0.7", changefreq: "monthly" },
  { route: "/contact", priority: "0.7", changefreq: "monthly" },
  { route: "/privacy", priority: "0.3", changefreq: "yearly" },
  { route: "/terms", priority: "0.3", changefreq: "yearly" },
];

export async function GET() {
  const lastmod = new Date().toISOString().split("T")[0];

  const urls = pages
    .map(
      (item) => `
    <url>
      <loc>${SITE}${item.route}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>${item.changefreq}</changefreq>
      <priority>${item.priority}</priority>
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
