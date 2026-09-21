/**
 * Where this service actually operates, written once.
 *
 * ── WHY THIS FILE EXISTS ──────────────────────────────────────────────────
 * Six city pages were live — Varanasi, Deoria, Gorakhpur, Salempur, Azamgarh
 * and Ballia — each with a full page, full schema, geo coordinates and a
 * sitemap entry. Every *brand-level* statement about coverage still named
 * three of them:
 *
 *   src/app/layout.js       root meta description, and <meta name="coverage">
 *   src/lib/schema.js       Organization.description  ← renders on every page
 *   src/app/(main)/about    metadata description, and the body copy
 *   src/data/home.js        the "MedicoBharat kya hai?" FAQ answer
 *
 * The Organization description is the definition of the brand as far as a
 * crawler is concerned, so half the service area was excluded from the entity
 * that every other node on the site resolves to. The city pages said one thing
 * and the entity they all reference said another.
 *
 * Hardcoding six names instead of three would have fixed it until the seventh
 * city shipped. So the list is derived from the same `LAB_CITIES` the routes,
 * the sitemap and `areaServed` already read — add a city there and every
 * sentence on this list updates with it, in both languages.
 *
 * ⚠ These strings go into meta descriptions, which Google truncates around 155
 * characters. `coverageShort()` exists for that reason — use it in metadata and
 * keep the full list for body copy and schema.
 */
import { LAB_CITIES } from "@/data/lab/cities";

/** Every published city's display name, in the order the site lists them. */
export const SERVICE_CITIES = LAB_CITIES.map((city) => city.name);

/** How many towns we serve — for copy that states the number. */
export const SERVICE_CITY_COUNT = SERVICE_CITIES.length;

/**
 * Join a list the way a sentence does: "A, B and C".
 *
 * `conjunction` is the only thing that differs between the English and the
 * Hinglish forms, so both share this rather than keeping two near-identical
 * functions that can drift apart.
 */
const sentenceJoin = (items, conjunction) => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} ${conjunction} ${items[items.length - 1]}`;
};

/** "Varanasi, Gorakhpur, Deoria, Salempur, Azamgarh and Ballia" */
export const coverage = () => sentenceJoin(SERVICE_CITIES, "and");

/** "Varanasi, Gorakhpur, Deoria, Salempur, Azamgarh aur Ballia" */
export const coverageHi = () => sentenceJoin(SERVICE_CITIES, "aur");

/**
 * The regional short form, for meta descriptions. HINGLISH — see below.
 *
 * Naming six towns costs ~55 characters, a third of what a meta description
 * has. This names the two largest and then the region, so the description still
 * says *where* without spending its whole budget on a list the page body
 * carries in full anyway.
 *
 * ⚠ IT IS ONE LANGUAGE. The first version read "Purvanchal — Varanasi and
 * Deoria se 4 aur jile", which is English and Hinglish in the same breath —
 * `sentenceJoin(…, "and")` glued to a Hinglish tail. It is Hinglish throughout
 * now, to match the pages that use it. For an ENGLISH description use
 * `coverageEn()` below; do not reach for this one and hope.
 */
export const coverageShort = () =>
  `${SERVICE_CITIES.slice(0, 2).join(", ")} samet Purvanchal ke ${
    SERVICE_CITIES.length
  } jile`;

/**
 * The English equivalent, for the pages whose metadata is in English.
 *
 * Deliberately a count rather than a list: it stays the same length whatever
 * the towns are called, so a description built on it cannot overflow when the
 * seventh city ships with a long name.
 */
export const coverageEn = () =>
  `${SERVICE_CITY_COUNT} districts of Purvanchal, Uttar Pradesh`;

/** "poore Purvanchal me — Varanasi se Ballia tak" style bookend for body copy. */
export const coverageSpan = () =>
  SERVICE_CITIES.length > 1
    ? `${SERVICE_CITIES[0]} se ${SERVICE_CITIES[SERVICE_CITIES.length - 1]} tak`
    : SERVICE_CITIES[0] ?? "";
