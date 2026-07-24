/**
 * Server-side reader for the `labCities` Firestore collection.
 *
 * SERVER ONLY — do not import this from a "use client" component. Pages,
 * layouts, sitemap.js and robots.js are the intended callers; anything a
 * client component needs must be passed down as a prop.
 *
 * Why the REST API instead of the firebase SDK: `fetch` is the only data call
 * Next.js can cache and revalidate on its own. Going through REST means the
 * lab pages stay statically generated, refresh themselves every hour, and pick
 * up a brand-new city without a redeploy — none of which the SDK gives us.
 */
import { cache } from "react";

import { firebaseConfig } from "./firebaseConfig";
import { SEED_LAB_CITIES, FALLBACK_CITY } from "@/data/labCities";
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
} from "@/data/labDefaults";

const COLLECTION = "labCities";

/** How long a Firestore read is reused before it is fetched again (seconds). */
export const LAB_CITIES_REVALIDATE = 3600;

/** Pass to revalidateTag() to refresh every lab page the moment a city changes. */
export const LAB_CITIES_TAG = "lab-cities";

const REST_ROOT =
  `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}` +
  `/databases/(default)/documents`;

/* ── Firestore REST → plain JS ─────────────────────────────────────────────
   REST wraps every value in a type tag ({ stringValue: "..." }), so a document
   has to be unwrapped before the rest of the app can use it. */

function toPlain(value) {
  if (!value || typeof value !== "object") return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) return (value.arrayValue.values ?? []).map(toPlain);
  if ("mapValue" in value) return fieldsToPlain(value.mapValue.fields);
  return null;
}

function fieldsToPlain(fields = {}) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, toPlain(value)])
  );
}

/* ── Normalising ──────────────────────────────────────────────────────────
   Firestore is edited by hand, so nothing coming out of it can be trusted to
   have the right shape. Every document is squeezed into the same object here
   — that way a typo in the console can never reach a rendered page. */

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

/** An object, or null. Guards against a field saved as a string by mistake. */
const obj = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : null;

/**
 * Firestore document merged over the generated defaults.
 *
 * Every section is all-or-nothing on purpose: overriding `faqs` replaces the
 * whole list rather than merging item by item. Half a list merged into another
 * half is impossible to reason about when you are editing in the console.
 * `hero`, `cta`, `callBanner` and `footer` are small enough that a per-key
 * merge is still predictable, so those fill in field by field.
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
    content: objList(fields.content) ?? defaultContent(name),
    callBanner: { ...defaultCallBanner(name), ...(obj(fields.callBanner) ?? {}) },
    footer: { ...defaultFooter(name), ...(obj(fields.footer) ?? {}) },
  };
}

function normalise(fields, docId) {
  const slug = slugify(fields.slug || docId);
  const name = str(fields.name);

  // A city with no slug or no display name cannot be rendered or linked.
  if (!slug || !name) return null;

  const base = {
    slug,
    name,
    state: str(fields.state) || FALLBACK_CITY.state,
    areas: strList(fields.areas) ?? [],
    // Alternate names this city is searched by. A Firestore `aliases` array
    // wins; otherwise the built-in fallback (e.g. Varanasi → "Banaras") applies,
    // so a doc that predates the field still gets its alt-name keywords.
    aliases: strList(fields.aliases) ?? CITY_ALIASES[slug] ?? [],
    postalCode: fields.postalCode ? str(fields.postalCode) : null,
    // Only an explicit `published: false` hides a city — a document that
    // predates the field must not silently disappear from the site.
    published: fields.published !== false,
    order: Number.isFinite(fields.order) ? fields.order : Number.MAX_SAFE_INTEGER,
  };

  return { ...base, ...buildContent(fields, base) };
}

const byOrderThenName = (a, b) =>
  a.order - b.order || a.name.localeCompare(b.name, "en");

/* ── Fetching ─────────────────────────────────────────────────────────────── */

async function fetchDocuments() {
  const documents = [];
  let pageToken = "";

  // Firestore caps a listing at 300 documents per response; the loop bound is
  // a runaway guard, not a real limit on how many cities the site can have.
  for (let page = 0; page < 20; page++) {
    const url = new URL(`${REST_ROOT}/${COLLECTION}`);
    url.searchParams.set("pageSize", "300");
    url.searchParams.set("key", firebaseConfig.apiKey);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const response = await fetch(url.toString(), {
      next: { revalidate: LAB_CITIES_REVALIDATE, tags: [LAB_CITIES_TAG] },
    });

    if (!response.ok) {
      throw new Error(
        `Firestore ${COLLECTION} responded ${response.status} ${response.statusText}`
      );
    }

    const json = await response.json();
    documents.push(...(json.documents ?? []));

    if (!json.nextPageToken) break;
    pageToken = json.nextPageToken;
  }

  return documents;
}

/** The local seed run through the same normaliser, so a fallback page is
 *  identical in shape to a Firestore-backed one. */
const seedCities = () =>
  SEED_LAB_CITIES.map((city) => normalise(city, city.slug))
    .filter(Boolean)
    .sort(byOrderThenName);

/**
 * Every published city, fully populated.
 *
 * Wrapped in React `cache` so the page, its layout, generateMetadata and
 * generateStaticParams share one result per render instead of four.
 *
 * Never throws: a Firestore outage falls back to the local seed so the build
 * and the live site keep working with whatever cities we last shipped.
 */
export const getLabCities = cache(async () => {
  let documents;

  try {
    documents = await fetchDocuments();
  } catch (error) {
    console.error(
      "[labCities] Firestore read failed — serving the local seed instead.",
      error
    );
    return seedCities();
  }

  const cities = documents
    .map((doc) => normalise(fieldsToPlain(doc.fields), doc.name?.split("/").pop()))
    .filter((city) => city && city.published)
    .sort(byOrderThenName);

  // An empty collection means the upload has not been run yet — same fallback.
  return cities.length ? cities : seedCities();
});

/** One city by slug, or null when we do not serve it (→ a real 404). */
export async function getLabCity(slug) {
  const wanted = slugify(decodeURIComponent(String(slug ?? "")));
  if (!wanted) return null;

  const cities = await getLabCities();
  return cities.find((city) => city.slug === wanted) ?? null;
}

/** Slugs for generateStaticParams and the sitemap. */
export async function getLabCitySlugs() {
  const cities = await getLabCities();
  return cities.map((city) => city.slug);
}

/**
 * The city every "…in <city>" default falls back to — first by `order`.
 * Used for the footer on a 404 and for copy that renders before a city is known.
 */
export async function getDefaultLabCity() {
  const cities = await getLabCities();
  return cities[0] ?? normalise(FALLBACK_CITY, FALLBACK_CITY.slug);
}

/**
 * Flat list for the booking form's city dropdown: every city plus its own
 * localities, in one array, ending with "Other".
 */
export async function getLabCityOptions() {
  const cities = await getLabCities();
  return [...cities.flatMap((city) => [city.name, ...city.areas]), "Other"];
}
