/**
 * Reader for the lab-test cities.
 *
 * This used to fetch the `labCities` Firestore collection over REST; the
 * cities now live in the repo (src/data/lab/cities.js), read straight off local
 * data exactly like the medicine pages read src/data/medicine/cityData.js. So this file
 * is a thin set of getters over that list — no network, no cache, no fallback.
 *
 * The functions stay async so their many callers (pages, layouts, sitemap)
 * keep working unchanged; there is just nothing to await any more. 
 */
import { LAB_CITIES, byOrderThenName, slugify } from "@/data/lab/cities";
import { cityOverrides, customCities } from "@/lib/admin/cityStore";

export { slugify };

/*
 * ── EDITS FROM THE ADMIN PANEL ───────────────────────────────────────────
 * src/data/lab/cities.js stays the source of every fact about a city. The
 * panel may override only the editorial fields — title, description,
 * keywords, the hero's H1, image and alt text — and may hide a city, which is
 * the documented way to take a page down: the city leaves this list, so it
 * leaves the routes, the sitemap and the footer together. (A separate noindex
 * switch is deliberately not offered; see the robots note in
 * src/app/(lab)/lab-test/[city]/page.js for why these pages must never be
 * indexed-off while still linked and submitted.)
 *
 * Merged here because every consumer — metadata, hero, schema, sitemap,
 * footer — already reads through these getters. cityOverrides() never throws:
 * an unreachable database leaves the site on the file's values, which is what
 * it served before the panel existed. A one-minute memo keeps this to one
 * query per minute, since a single page render calls these several times.
 */
const MEMO_MS = 60_000;
let memo = null; // { at, cities }

async function citiesWithOverrides() {
  if (memo && Date.now() - memo.at < MEMO_MS) return memo.cities;

  const [overrides, custom] = await Promise.all([cityOverrides(), customCities()]);
  const cities = [];

  // The file's cities plus the published ones added in the panel (table
  // lab_cities). A panel city can never shadow a file city with the same slug.
  const fileSlugs = new Set(LAB_CITIES.map((city) => city.slug));
  const all = [
    ...LAB_CITIES,
    ...custom.filter((city) => city.published && !fileSlugs.has(city.slug)),
  ].sort(byOrderThenName);

  for (const city of all) {
    const o = overrides.get(city.slug);
    if (!o) {
      cities.push(city);
      continue;
    }
    if (o.hidden) continue;

    const hero = { ...city.hero };
    if (o.h1) hero.h1 = o.h1;
    if (o.heroAlt) hero.imageAlt = o.heroAlt;
    // A panel image is WebP — right for the hero, and never used as the share
    // card, which stays the JPG in LAB_OG_IMAGE because WhatsApp will not
    // render a WebP og:image.
    if (o.heroMediaId) hero.image = `/media/${o.heroMediaId}/lab-test-in-${city.slug}.webp`;

    cities.push({
      ...city,
      title: o.title || city.title,
      description: o.description || city.description,
      keywords: o.keywords?.length ? o.keywords : city.keywords,
      hero,
      // The guide and FAQs edited in the panel, whole-list replacements like
      // the file's own `content` / `faqs` fields. Empty = the built-in ones.
      content: o.content?.length ? o.content : city.content,
      faqs: o.faqs?.length ? o.faqs : city.faqs,
      sitemapPriority: Number.isFinite(o.priority) ? o.priority : undefined,
    });
  }

  memo = { at: Date.now(), cities };
  return cities;
}

/** Drop the memo now — called by the panel the moment a city page is saved. */
export function invalidateLabCities() {
  memo = null;
}

/** Every published city, fully populated and sorted by `order` then name. */
export async function getLabCities() {
  return citiesWithOverrides();
}

/** One city by slug, or null when we do not serve it (→ a real 404). */
export async function getLabCity(slug) {
  const wanted = slugify(decodeURIComponent(String(slug ?? "")));
  if (!wanted) return null;
  return (await citiesWithOverrides()).find((city) => city.slug === wanted) ?? null;
}

/** Slugs for generateStaticParams and the sitemap. */
export async function getLabCitySlugs() {
  return (await citiesWithOverrides()).map((city) => city.slug);
}

/**
 * The city every "…in <city>" default falls back to — first by `order`.
 * Used for the footer on a 404 and for copy that renders before a city is known.
 */
export async function getDefaultLabCity() {
  return (await citiesWithOverrides())[0] ?? null;
}

/**
 * The booking form's city dropdown for ONE city: the city itself, then its own
 * localities, then "Other".
 *
 * This used to return every live city's name and localities in a single flat
 * list, so the form on /lab-test/deoria opened with Varanasi, Sarnath, Lanka,
 * Bhelupur and Cantt above Deoria's own areas. The intent was that a visitor
 * from a neighbouring town could still book — but the cost was a Deoria reader
 * scrolling past six Varanasi localities to find their own, on a page that is
 * otherwise entirely about Deoria. It also contradicted the page's schema,
 * which lists only this city in `areaServed`.
 *
 * "Other" stays at the end, so someone outside the listed localities can still
 * submit the form and be called back — the neighbouring-town case is covered
 * without putting another city's areas in front of everyone else.
 *
 * An unknown slug yields just ["Other"] rather than an empty list, so a form
 * rendered off a bad slug still has a usable option instead of a blank select.
 */
export async function getLabCityOptions(slug) {
  const city = await getLabCity(slug);
  if (!city) return ["Other"];
  return [city.name, ...city.areas, "Other"];
}
