import { getLabCities } from "@/lib/labCities";
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
/**
 * `lastmod` comes from the city's own `updated` field, never from the clock.
 *
 * It used to be `new Date()`, so with `revalidate = 86400` this file told Google
 * that all six city pages changed yesterday, and the day before, and the day
 * before that. A lastmod that always says "today" is one Google learns to ignore
 * entirely — which is exactly the reasoning already written at the top of
 * sitemap/blogs.xml, where it was got right.
 *
 * `updated` is already in src/data/lab/cities.js for every city. An entry
 * without one, or with an unparseable one, emits no <lastmod> at all: no date is
 * a neutral signal, a wrong date is a false one.
 */
const lastmodOf = (city) =>
  /^\d{4}-\d{2}-\d{2}$/.test(String(city.updated ?? ""))
    ? `
      <lastmod>${city.updated}</lastmod>`
    : "";

export async function GET() {
  const cities = await getLabCities();

  const urls = cities
    .map(
      (city) => `
    <url>
      <loc>${SITE}/lab-test/${city.slug}</loc>${lastmodOf(city)}
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
