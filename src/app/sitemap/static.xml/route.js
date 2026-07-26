export const revalidate = 86400; // regenerate once per day instead of every request

export async function GET() {
  const baseUrl = "https://www.medicobharat.com";

  const pages = [
    { route: "", priority: "1.0", changefreq: "daily" },

    // Core pages
    { route: "/about", priority: "0.7", changefreq: "monthly" },
    { route: "/contact", priority: "0.7", changefreq: "monthly" },
    { route: "/blogs", priority: "0.7", changefreq: "daily" },
    { route: "/privacy", priority: "0.3", changefreq: "yearly" },
    { route: "/terms", priority: "0.3", changefreq: "yearly" },
  ];

  const lastmod = new Date().toISOString().split("T")[0];

  const urls = pages
    .map(
      (item) => `
    <url>
      <loc>${baseUrl}${item.route}</loc>
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
