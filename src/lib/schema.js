/**
 * The site's brand entity, written once.
 *
 * ── WHY THIS FILE EXISTS ──────────────────────────────────────────────────
 * Search a brand name Google has no record of and it does not show you that
 * brand — it "corrects" the spelling to a string it already knows. Searching
 * "medicobharat" returned results for "medical bharat", which means Google held
 * no entity for this name at all: our own markup never declared one.
 *
 * What we had instead was a `Pharmacy` node on the home page and a
 * `parentOrganization: { name: "MedicoBharat", url: SITE }` stub repeated in
 * every city page. Those stubs share a name but no identifier, so a crawler has
 * no way to tell that they are the SAME organisation — it sees a dozen
 * unrelated businesses that happen to be similarly named.
 *
 * So the organisation is declared once, here, with a stable `@id`, and every
 * other node on the site points at that `@id` instead of repeating a stub. That
 * is the whole trick: one entity, many references. `alternateName` teaches the
 * spellings people actually type, and `sameAs` ties the entity to profiles that
 * exist off our own domain — which is the only part of this a search engine can
 * independently verify.
 *
 * ⚠ NOTHING IN HERE MAY BE A CLAIM WE CANNOT STAND BEHIND. No accreditation, no
 * ratings, no awards, no partner lab names. Schema is a machine-readable
 * statement of fact, and an unverifiable one in structured data is worse than
 * none — it is exactly what a manual action is written for. Only add a
 * `sameAs` profile that is genuinely ours and genuinely live.
 */
import { SITE } from "./site";

/* ── Stable identifiers ───────────────────────────────────────────────────
   Fragment URLs, never a page URL: `#organization` is the company, and it is
   the same company on every page, so its id must not change per route. Import
   these anywhere a node needs to reference the brand. */
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;
export const LOGO_ID = `${SITE}/#logo`;

/** Reference to the organisation — use instead of repeating a name/url stub. */
export const ORG_REF = { "@id": ORG_ID };

/**
 * The Google Business Profile, as its public Maps URL.
 *
 * ── WHY THIS IS THE MOST VALUABLE STRING IN THIS FILE ─────────────────────
 * There is no markup that "attaches" a web page to a Business Profile — people
 * look for one and it does not exist. What actually ties the two together is
 * corroboration: the profile points at this website, this website points back
 * at the profile, and the name, phone and city agree on both ends. This
 * constant is our half of that handshake, and a Maps URL is the one link in
 * `sameAs` that resolves to a Google-verified record of the business.
 *
 * ── HOW TO FILL IT ────────────────────────────────────────────────────────
 * Google Maps → find the profile → Share → Copy link, then expand the short
 * `maps.app.goo.gl/…` link to its full `https://www.google.com/maps/place/…`
 * form by opening it once and copying the address bar. A short link works but
 * redirects; the expanded URL is what should be published.
 *
 * LEAVE IT EMPTY UNTIL YOU HAVE THE REAL URL. Every property below is written
 * to disappear when this is "" — a wrong or guessed Maps link is a `sameAs`
 * pointing at somebody else's business, which is worse than no link at all.
 */
export const GBP_MAP_URL = "";

/**
 * Profiles that are actually ours and actually live.
 *
 * This is the load-bearing property for brand recognition: it is the only place
 * our markup points at something a search engine can check without taking our
 * word for it. A dead or wrong link here is worse than a short list — do not
 * add a profile until it exists and carries the same name, phone and city as
 * the site does.
 */
export const BRAND_PROFILES = [
  "https://www.instagram.com/medicobharat_01/",
  "https://www.facebook.com/profile.php?id=61591803531075",
  // Included only once it is set — see GBP_MAP_URL above.
  ...(GBP_MAP_URL ? [GBP_MAP_URL] : []),
];

/**
 * The spellings this brand is genuinely typed as.
 *
 * "Medico Bharat" (spaced) and the Devanagari form are how a reader in Purvanchal
 * writes the name; without them Google has nothing to match those queries to and
 * falls back to spell-correction. These are spellings of OUR name only — never
 * put a competitor's name or a generic phrase here.
 */
export const BRAND_ALTERNATE_NAMES = [
  "Medico Bharat",
  "Medicobharat",
  "MedicoBharat Healthcare",
  "मेडिको भारत",
];

const BRAND_PHONE = "+916392108234";
const BRAND_EMAIL = "medicobharat@gmail.com";

/**
 * The organisation itself. Declared on the home page (root layout) and
 * referenced by `@id` everywhere else.
 *
 * Typed `Organization`, not `MedicalOrganization`: this node is the company
 * behind both sections of the site. The medical typing belongs on the nodes
 * that describe a service — the `Pharmacy` node on the home page and the
 * `DiagnosticLab` node on each lab page — and both point back here.
 */
export const organizationNode = () => ({
  "@type": "Organization",
  "@id": ORG_ID,
  name: "MedicoBharat",
  alternateName: BRAND_ALTERNATE_NAMES,
  url: SITE,
  logo: {
    "@type": "ImageObject",
    "@id": LOGO_ID,
    url: `${SITE}/navbar/navbg.webp`,
    contentUrl: `${SITE}/navbar/navbg.webp`,
    caption: "MedicoBharat",
  },
  image: { "@id": LOGO_ID },
  description:
    "MedicoBharat online medicine delivery aur ghar par lab test sample collection karta hai — Deoria jile aur aas-paas ke sheher me.",
  email: BRAND_EMAIL,
  telephone: BRAND_PHONE,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Deoria",
    addressRegion: "Uttar Pradesh",
    postalCode: "274001",
    addressCountry: "IN",
  },
  areaServed: { "@type": "State", name: "Uttar Pradesh" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: BRAND_PHONE,
    email: BRAND_EMAIL,
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["Hindi", "English"],
  },
  knowsLanguage: ["hi-IN", "en-IN"],
  // NOTE: no `hasMap` here. `hasMap` is a property of Place, and an Organization
  // is not a Place — the company is not the building. It belongs on the nodes
  // that ARE places: the Pharmacy in the root layout and the DiagnosticLab on
  // each lab page, both of which are LocalBusiness subtypes. The Maps URL still
  // reaches this node through `sameAs`, which is Thing-level and valid anywhere.
  sameAs: BRAND_PROFILES,
});

/**
 * The website, as distinct from the company that publishes it.
 *
 * `alternateName` here is what a "site:" or brand query matches against, and
 * `publisher` is the link that makes the two entities one story rather than
 * two. `inLanguage` is both — the pages are written in Hinglish, which is Hindi
 * vocabulary in Latin script, so both codes are declared honestly.
 */
export const websiteNode = () => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE,
  name: "MedicoBharat",
  alternateName: BRAND_ALTERNATE_NAMES,
  description:
    "Online medicine delivery aur home sample collection wale lab test — MedicoBharat.",
  publisher: ORG_REF,
  inLanguage: ["hi-IN", "en-IN"],
});

/**
 * Wrap nodes in a single `@graph`.
 *
 * One script per page instead of three or four separate ones: a graph is what
 * lets `{ "@id": … }` references resolve without the crawler having to stitch
 * documents together, and it is also how the page says "these nodes are about
 * each other" rather than "here are some unrelated facts".
 *
 * Nested arrays are flattened and falsy entries dropped, so a caller can pass a
 * node conditionally without guarding the call site.
 */
export const graph = (...nodes) => ({
  "@context": "https://schema.org",
  "@graph": nodes.flat().filter(Boolean),
});

/**
 * JSON-LD serialised for `dangerouslySetInnerHTML`.
 *
 * The `<` escape is not optional. City copy is authored text; the day a string
 * in it contains `</script>` the tag closes early and the rest of the payload
 * lands in the document as markup. `<` is still valid JSON, so the parsed
 * value is unchanged. See node_modules/next/dist/docs/01-app/02-guides/json-ld.md.
 */
export const ldJson = (data) => JSON.stringify(data).replace(/</g, "\\u003c");
