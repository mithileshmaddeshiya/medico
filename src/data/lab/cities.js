/**
 * Local source of truth for the lab-test section.
 *
 * Works exactly like src/data/medicine/cityData.js does for the medicine pages: the
 * content lives here, in the repo, and is read straight off local data — there
 * is no Firestore round trip any more. src/lib/labCities.js is now a thin
 * reader over the `LAB_CITIES` list this file builds.
 *
 * NOTE HOW SHORT AN ENTRY IS. Only the facts that differ between cities live
 * here; every word on the page — hero, tests, prices, FAQs, SEO copy, CTA —
 * comes from src/data/lab/defaults.js with the city's name filled in. That is
 * what keeps adding a city cheap.
 *
 * ── Adding a city ───────────────────────────────────────────────────────
 * Add an object to LAB_CITY_SEED below with:
 *
 *   slug        (string)   URL segment: /lab-test/<slug>. Defaults to name.
 *   name        (string)   Display name used in every heading and sentence.
 *   state       (string)   Footer address line and the local-business schema.
 *   areas       (array)    Localities covered; rendered as text (SEO), offered
 *                          in the booking form, and listed in areaServed.
 *   postalCode  (string)   Optional; local-business schema only.
 *   order       (number)   Optional; lower sorts first, else sorted by name.
 *   published   (boolean)  Optional; set false to hide without deleting.
 *
 * That is enough for a complete page. The route, footer cross-links, booking
 * dropdown, sitemap, metadata and schema all pick it up on their own.
 *
 * ── Overriding the copy for one city ────────────────────────────────────
 * Any of these optional fields replaces the generated default for that city
 * only. Leave a field out and the default is used.
 *
 *   title, description            (string)  metadata
 *   keywords                      (array of string)
 *   hero                          { h1, image, imageAlt, formTitle }
 *   trustStrip                    [{ icon, title, highlight, sub }]
 *   tests                         [{ id, icon, tint, name, sub, tags,
 *                                    fasting, price, mrp, params }]
 *   filters                       [{ key, label, heading }]
 *   faqs                          [{ q, a }]
 *   cta                           { headingLead, headingAccent, proof: [] }
 *   content                       [{ id, h, p: [] }]
 *   callBanner                    { heading, buttonText }
 *   footer                        { tagline, popularTests: [], email,
 *                                   phone, hours }
 *
 * `icon` values are strings, not components — see src/data/lab/defaults.js for
 * the names each registry understands.
 */
import { deoriaContent, deoriaFaqs } from "./content/deoria";
import { varanasiContent } from "./content/varanasi";
import {
  CITY_ALIASES,
  defaultCallBanner,
  defaultContent,
  defaultCta,
  defaultDescription,
  defaultFaqs,
  defaultFilters,
  defaultFooter,
  defaultHero,
  defaultKeywords,
  defaultTests,
  defaultTitle,
  defaultTrustStrip,
} from "./defaults";

/* ── The cities we serve ──────────────────────────────────────────────────
   Just the facts that differ per city. Everything else is filled in from
   src/data/lab/defaults.js when LAB_CITIES is built at the bottom of this file. */
const LAB_CITY_SEED = [
  {
    slug: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    areas: ["Sarnath", "Ramnagar", "Bhelupur", "Lanka", "Sigra", "Cantt"],
    postalCode: "221001",
    order: 1,
    published: true,
    // This copy used to be defaultContent() — the fallback every city inherited
    // — even though every fact in it is Varanasi's. It is unchanged, just moved
    // under the city it was actually written about. See labContent/varanasi.js.
    content: varanasiContent,
  },
  {
    slug: "deoria",
    name: "Deoria",
    state: "Uttar Pradesh",
    areas: [
      "Deoria Sadar",
      "Rudrapur",
      "Barhaj",
      "Salempur",
      "Bhatpar Rani",
      "Gauri Bazar",
      "Baitalpur",
    ],
    postalCode: "274001",
    order: 2,
    published: true,

    /* Deoria carries its own copy rather than the generated defaults, because a
       page that is another city's page with the noun swapped does not get
       indexed — Google reads it as a doorway page. `content` and `faqs` are the
       two blocks that decide that, so both are hand-written here, and the title
       and description are set so the search result itself does not read as a
       duplicate of Varanasi's. See src/data/lab/content/deoria.js. */
    title: "Lab Test in Deoria | Blood Test at Home, Free Sample Collection",
    description:
      "Book blood tests in Deoria, Uttar Pradesh without travelling to Gorakhpur. Free home sample collection across Deoria Sadar, Rudrapur, Barhaj, Salempur and Bhatpar Rani, slots from 6 AM and reports on WhatsApp in 24 hours.",
    content: deoriaContent,
    faqs: deoriaFaqs,
  },
];

/** State used when a city entry leaves `state` out. */
const DEFAULT_STATE = LAB_CITY_SEED[0].state;

/* ── Normalising ──────────────────────────────────────────────────────────
   Every entry is squeezed into the same shape so a typo in the seed can never
   reach a rendered page — a missing field falls back rather than crashing. */

export const slugify = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const str = (value) => String(value ?? "").trim();

/** A non-empty array of strings, or null when the field is unusable. */
const strList = (value) => {
  if (!Array.isArray(value)) return null;
  const list = value.map(str).filter(Boolean);
  return list.length ? list : null;
};

/** A non-empty array of objects, or null — used for faqs, tests, content. */
const objList = (value) => {
  if (!Array.isArray(value)) return null;
  const list = value.filter((item) => item && typeof item === "object");
  return list.length ? list : null;
};

/** An object, or null. Guards against a field written as a string by mistake. */
const obj = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : null;

/**
 * A city entry merged over the generated defaults.
 *
 * Every section is all-or-nothing on purpose: overriding `faqs` replaces the
 * whole list rather than merging item by item. `hero`, `cta`, `callBanner` and
 * `footer` are small enough that a per-key merge is still predictable, so those
 * fill in field by field.
 */
function buildContent(fields, base) {
  const { name, state, areas, aliases } = base;

  return {
    // ── metadata ──
    title: str(fields.title) || defaultTitle(name),
    description: str(fields.description) || defaultDescription(name, state, areas),
    keywords: strList(fields.keywords) ?? defaultKeywords(name, areas, aliases),

    // ── sections ──
    hero: { ...defaultHero(name), ...(obj(fields.hero) ?? {}) },
    trustStrip: objList(fields.trustStrip) ?? defaultTrustStrip(),
    tests: objList(fields.tests) ?? defaultTests(),
    filters: objList(fields.filters) ?? defaultFilters(),
    faqs: objList(fields.faqs) ?? defaultFaqs(name, areas, aliases),
    cta: { ...defaultCta(name), ...(obj(fields.cta) ?? {}) },
    // `areas` is passed through so the generated copy can only ever name this
    // city's own localities — the fallback used to carry a hardcoded list of
    // Varanasi neighbourhoods, which every other city then advertised.
    content: objList(fields.content) ?? defaultContent(name, areas),
    callBanner: { ...defaultCallBanner(name), ...(obj(fields.callBanner) ?? {}) },
    footer: { ...defaultFooter(name), ...(obj(fields.footer) ?? {}) },
  };
}

function normalise(fields, id) {
  const slug = slugify(fields.slug || id);
  const name = str(fields.name);

  // A city with no slug or no display name cannot be rendered or linked.
  if (!slug || !name) return null;

  const base = {
    slug,
    name,
    state: str(fields.state) || DEFAULT_STATE,
    areas: strList(fields.areas) ?? [],
    // Alternate names this city is searched by (e.g. Varanasi → "Banaras").
    aliases: strList(fields.aliases) ?? CITY_ALIASES[slug] ?? [],
    postalCode: fields.postalCode ? str(fields.postalCode) : null,
    // Only an explicit `published: false` hides a city.
    published: fields.published !== false,
    order: Number.isFinite(fields.order) ? fields.order : Number.MAX_SAFE_INTEGER,
  };

  return { ...base, ...buildContent(fields, base) };
}

const byOrderThenName = (a, b) =>
  a.order - b.order || a.name.localeCompare(b.name, "en");

/**
 * Every published city, fully populated and sorted — the list the whole lab
 * section reads through src/lib/labCities.js. Built once at module load.
 */
export const LAB_CITIES = LAB_CITY_SEED
  .map((city) => normalise(city, city.slug))
  .filter((city) => city && city.published)
  .sort(byOrderThenName);
