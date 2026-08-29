import { SITE } from "@/lib/site";

export const revalidate = 86400; // regenerate once per day instead of every request

/**
 * The handful of one-off pages that are not generated from a city list.
 *
 * ⚠ EVERY ROUTE HERE MUST ACTUALLY RESOLVE. "/blogs" was once in this list with
 * no page.js behind it, so the sitemap was handing Google a 404. Both hub pages
 * now exist — src/app/(main)/lab-test/page.js and src/app/(main)/blogs/page.js —
 * which is why they are listed again. If either is ever removed, remove its line
 * here in the same commit.
 *
 * Individual posts live in sitemap/blogs.xml and individual cities in
 * sitemap/lab-test.xml; this file carries only the hubs and the one-offs.
 */
/**
 * ⚠ `reviewed` IS A REAL DATE, TYPED BY A HUMAN, AND MUST STAY THAT WAY.
 *
 * This file used to stamp `new Date()` on every URL, so with `revalidate =
 * 86400` it told Google that the privacy policy and the terms changed every
 * single day. A lastmod that is always "today" is one Google learns to ignore —
 * see the note at the top of sitemap/blogs.xml, which got this right.
 *
 * These are static pages, so there is nothing to derive it from. When you
 * genuinely rewrite one of them, bump its date here by hand. Do NOT wire this
 * back to the clock, and do not bump a date because a deploy happened.
 */
const pages = [
  { route: "", priority: "1.0", changefreq: "weekly", reviewed: "2026-08-24" },

  // Core pages
  { route: "/lab-test", priority: "0.8", changefreq: "weekly", reviewed: "2026-08-24" },
  { route: "/blogs", priority: "0.6", changefreq: "weekly", reviewed: "2026-08-24" },
  { route: "/about", priority: "0.7", changefreq: "monthly", reviewed: "2026-08-24" },
  { route: "/contact", priority: "0.7", changefreq: "monthly", reviewed: "2026-08-24" },
  { route: "/privacy", priority: "0.3", changefreq: "yearly", reviewed: "2026-08-24" },
  { route: "/terms", priority: "0.3", changefreq: "yearly", reviewed: "2026-08-24" },
];

export async function GET() {
  const urls = pages
    .map(
      (item) => `
    <url>
      <loc>${SITE}${item.route}</loc>
      <lastmod>${item.reviewed}</lastmod>
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
