/**
 * Single source of truth for every city the lab-test section serves.
 *
 * Adding a city = adding one entry here. The route stops redirecting it, the
 * footer starts linking it, the booking dropdown picks up its areas and the
 * sitemap can map over the same list — nothing else needs editing.
 *
 *   slug   → URL segment: /lab-test/<slug>
 *   name   → display name used in headings and copy
 *   state  → shown in the footer address line
 *   areas  → localities covered; rendered as text (SEO) and offered in the form
 */
export const LAB_CITIES = [
  {
    slug: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    areas: ["Sarnath", "Ramnagar", "Bhelupur", "Lanka", "Sigra", "Cantt"],
  },
];

export const DEFAULT_CITY = LAB_CITIES[0];

export const LIVE_CITY_SLUGS = LAB_CITIES.map((c) => c.slug);

export const getCity = (slug) =>
  LAB_CITIES.find((c) => c.slug === String(slug ?? "").toLowerCase());
