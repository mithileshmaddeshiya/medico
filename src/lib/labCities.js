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
import { LAB_CITIES, slugify } from "@/data/lab/cities";

export { slugify };

/** Every published city, fully populated and sorted by `order` then name. */
export async function getLabCities() {
  return LAB_CITIES;
}

/** One city by slug, or null when we do not serve it (→ a real 404). */
export async function getLabCity(slug) {
  const wanted = slugify(decodeURIComponent(String(slug ?? "")));
  if (!wanted) return null;
  return LAB_CITIES.find((city) => city.slug === wanted) ?? null;
}

/** Slugs for generateStaticParams and the sitemap. */
export async function getLabCitySlugs() {
  return LAB_CITIES.map((city) => city.slug);
}

/**
 * The city every "…in <city>" default falls back to — first by `order`.
 * Used for the footer on a 404 and for copy that renders before a city is known.
 */
export async function getDefaultLabCity() {
  return LAB_CITIES[0] ?? null;
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
