/**
 * Reader for the lab-test cities.
 *
 * This used to fetch the `labCities` Firestore collection over REST; the
 * cities now live in the repo (src/data/labCities.js), read straight off local
 * data exactly like the medicine pages read src/data/cityData.js. So this file
 * is a thin set of getters over that list — no network, no cache, no fallback.
 *
 * The functions stay async so their many callers (pages, layouts, sitemap)
 * keep working unchanged; there is just nothing to await any more. 
 */
import { LAB_CITIES, slugify } from "@/data/labCities";

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
 * Flat list for the booking form's city dropdown: every city plus its own
 * localities, in one array, ending with "Other".
 */
export async function getLabCityOptions() {
  return [...LAB_CITIES.flatMap((city) => [city.name, ...city.areas]), "Other"];
}
