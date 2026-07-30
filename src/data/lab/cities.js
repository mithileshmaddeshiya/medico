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
 *   geo         { lat, lng } Optional; town-centre coordinates, schema only.
 *                          Use the town centre — this is a service area, not a
 *                          walk-in address, so a precise pin would be a lie.
 *   updated     (string)   Optional; ISO date the copy was last reviewed. Feeds
 *                          `dateModified` in the page schema. Bump it when you
 *                          actually rewrite the copy — never on a deploy.
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
 *   relatedLinks                  { heading, intro, groups: [{ title,
 *                                   links: [{ href, label, sub }] }] }
 *                                 In-body internal links; omitted → no block.
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
    geo: { lat: 25.3176, lng: 82.9739 },
    updated: "2026-07-30",
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
    /* Deoria Sadar plus the district towns collection actually reaches. These
       are not decorative: they render in the footer, fill the booking form's
       dropdown, become `areaServed` in the schema, and are what a "<town> me
       blood test" search matches on. Lar and Bhatni were added because the
       medicine section already serves both, so the town is genuinely covered
       and the lab page can honestly name it. Do NOT pad this list with towns
       nobody visits — an areaServed we cannot serve is a lie in schema form. */
    areas: [
      "Deoria Sadar",
      "Rudrapur",
      "Barhaj",
      "Salempur",
      "Bhatpar Rani",
      "Gauri Bazar",
      "Baitalpur",
      "Lar",
      "Bhatni",
    ],
    postalCode: "274001",
    /* Deoria town centre. Deliberately the CENTRE and not a street pin: there is
       no walk-in counter here — this is a home-collection service area, and a
       precise address in the schema would be a claim we cannot keep. Google
       reads `geo` on a service-area business as "roughly here", which is true. */
    geo: { lat: 26.5024, lng: 83.7791 },
    updated: "2026-07-30",
    order: 2,
    published: true,

    /* Deoria carries its own copy rather than the generated defaults, because a
       page that is another city's page with the noun swapped does not get
       indexed — Google reads it as a doorway page. `content` and `faqs` are the
       two blocks that decide that, so both are hand-written here, and the title
       and description are set so the search result itself does not read as a
       duplicate of Varanasi's. See src/data/lab/content/deoria.js. */

    // 39 characters, and it has to stay short: the root layout appends
    // " | MedicoBharat" (template in src/app/layout.js), so what Google
    // actually renders is 54 — just inside the ~60 it will show. The previous
    // title was 63 BEFORE the suffix and got cut at "…Free Sample Coll…", so
    // the strongest phrase on it was never seen. Primary keyword first, then
    // the second-biggest query on this page; both survive the truncation.
    title: "Lab Test in Deoria — Blood Test at Home",

    // ~150 characters, so it renders whole on both desktop and mobile. The old
    // one ran past 230 and lost everything after "…Rudrapur, Barhaj". Written
    // in Hinglish deliberately: the page is Hinglish, the searcher here is, and
    // a snippet in the reader's own register wins the click. The English terms
    // that must match ("lab test", "blood test", "full body checkup") are all
    // still in it.
    description:
      "Deoria me lab test aur blood test ghar baithe book karein — CBC, thyroid, sugar aur full body checkup. Free home sample collection, report 24 ghante me.",

    // The h1 is screen-reader only (the hero is image + form), so it costs a
    // reader nothing and carries the two terms the URL cannot: "blood test" and
    // "pathology". The default was "Lab Test in Deoria with Free Home Sample
    // Collection", which repeated the title without adding a term.
    hero: {
      h1: "Lab Test in Deoria — Blood Test & Pathology Lab with Free Home Sample Collection",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out instead of taking defaultKeywords(), which only produces
       "<template> in Deoria" nine times over plus one line per area. That
       misses the two things Deoria traffic actually is: test-wise long-tail
       ("CBC test price in Deoria"), which converts because the searcher has
       already decided what they want, and Devanagari, which is how a large
       share of this district types.

       Ordered strongest first. `keywords` is a weak-to-zero ranking signal on
       its own — the reason to keep this list honest and specific is that it is
       the checklist the page's headings, FAQs and prose are written against.
       Every term below appears in the visible copy; a keyword that appears
       ONLY here is the kind that gets a page filtered, not ranked. */
    keywords: [
      // Primary
      "lab test in Deoria",
      "Deoria me lab test",
      "blood test in Deoria",
      "pathology lab in Deoria",
      "diagnostic centre in Deoria",
      "lab test at home Deoria",
      "home sample collection Deoria",
      "blood test home collection Deoria",
      "lab test price in Deoria",
      "lab test rate list Deoria",
      "best pathology lab Deoria",
      "online lab test booking Deoria",

      // Test-wise long tail — the highest-intent queries on the page
      "CBC test in Deoria",
      "CBC test price in Deoria",
      "thyroid test in Deoria",
      "TSH test Deoria",
      "sugar test in Deoria",
      "HbA1c test in Deoria",
      "full body checkup in Deoria",
      "full body health checkup package Deoria",
      "lipid profile test Deoria",
      "liver function test Deoria",
      "kidney function test Deoria",
      "vitamin D test in Deoria",
      "vitamin B12 test in Deoria",
      "dengue test in Deoria",
      "typhoid test in Deoria",
      "malaria test in Deoria",
      "urine routine test Deoria",
      "hepatitis test in Deoria",

      // Area modifiers — how a district search is actually typed
      "lab test in Deoria Sadar",
      "blood test in Rudrapur Deoria",
      "blood test in Barhaj Deoria",
      "lab test in Salempur",
      "lab test in Bhatpar Rani",
      "lab test in Gauri Bazar Deoria",
      "lab test in Baitalpur Deoria",
      "lab test in Lar Deoria",
      "lab test in Bhatni",

      // Devanagari — same intents, the script a big share of this district types
      "देवरिया में लैब टेस्ट",
      "देवरिया में खून की जांच",
      "देवरिया में पैथोलॉजी लैब",
      "घर से सैंपल कलेक्शन देवरिया",
      "देवरिया लैब टेस्ट रेट लिस्ट",
      "देवरिया में फुल बॉडी चेकअप",

      // Location-free queries — Google supplies the city from the searcher's
      // position, which the DiagnosticLab schema's areaServed answers.
      "lab test near me",
      "blood test near me",
      "pathology lab near me",
      "full body checkup near me",
      "MedicoBharat lab test Deoria",
    ],

    content: deoriaContent,
    faqs: deoriaFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabRelatedLinks below the guide. The medicine towns are also
       in the footer, but a footer is byte-identical on every lab page and gets
       discounted as boilerplate; these anchors are descriptive and per-city.
       The three guides are the real gain — nothing else on the site links a lab
       page into /blogs/*.

       Every href here is checked against a real route: the medicine towns exist
       in src/data/medicine/cityData.js, the guides in src/data/blogData.js, and
       varanasi in the seed above. */
    relatedLinks: {
      heading: "Deoria Jile Me MedicoBharat Ki Doosri Services",
      intro:
        "Test ke baad dawa, aas-paas ke kasbon ki delivery, aur Deoria ke liye likhe gaye guide — sab ek jagah.",
      groups: [
        {
          title: "Deoria Me Medicine Delivery",
          links: [
            {
              href: "/medicine-delivery/deoria",
              label: "Deoria me online medicine delivery",
              sub: "Parcha bhejiye, dawa ghar par",
            },
            { href: "/medicine-delivery/salempur", label: "Salempur me medicine delivery" },
            { href: "/medicine-delivery/barhaj", label: "Barhaj me medicine delivery" },
            { href: "/medicine-delivery/lar", label: "Lar me medicine delivery" },
            { href: "/medicine-delivery/bhatni", label: "Bhatni me medicine delivery" },
          ],
        },
        {
          title: "Deoria Ke Liye Guide",
          links: [
            {
              href: "/blogs/online-medicine-delivery/deoria",
              label: "Online medicine delivery in Deoria",
            },
            {
              href: "/blogs/medicine-home-delivery/deoria",
              label: "Medicine home delivery in Deoria",
            },
            {
              href: "/blogs/buy-medicines-online/deoria",
              label: "Deoria me online dawa kaise mangwayein",
            },
          ],
        },
        {
          title: "Doosre Sheher Aur Madad",
          links: [
            {
              href: "/lab-test/varanasi",
              label: "Varanasi me lab test",
              sub: "Imaging ya specialist ke liye jaana ho to",
            },
            { href: "/contact", label: "Contact — number aur booking help" },
            { href: "/about", label: "MedicoBharat ke baare me" },
          ],
        },
      ],
    },
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
    // Optional and with NO default on purpose. A generated link block would be
    // the same boilerplate on every city — the value is in hand-picked anchors
    // pointing at routes that exist for THAT city, so a city without the field
    // simply renders no block. See LabRelatedLinks.
    relatedLinks: obj(fields.relatedLinks),
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
    // Schema only, and only when BOTH numbers are real numbers — a half-filled
    // pair would emit `latitude: undefined`, which invalidates the whole
    // GeoCoordinates node rather than just omitting it.
    geo:
      Number.isFinite(fields.geo?.lat) && Number.isFinite(fields.geo?.lng)
        ? { lat: fields.geo.lat, lng: fields.geo.lng }
        : null,
    // ISO date the copy was last reviewed; null → the page omits dateModified
    // rather than inventing one. Only YYYY-MM-DD is accepted, so a typo drops
    // the field instead of publishing a date Google cannot parse.
    updated: /^\d{4}-\d{2}-\d{2}$/.test(str(fields.updated))
      ? str(fields.updated)
      : null,
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
