/**
 * Seed data for the lab-test section — NOT the live source any more.
 *
 * Cities live in the Firestore collection `labCities` (one document per city,
 * document id = slug) and are read by src/lib/labCities.js. This file is the
 * fallback that keeps the site up when Firestore is unreachable, and the
 * payload the /upload page pushes into Firestore the first time.
 *
 * NOTE HOW SHORT AN ENTRY IS. Only the facts that differ between cities live
 * here; every word on the page — hero, tests, prices, FAQs, SEO copy, CTA —
 * comes from src/data/labDefaults.js with the city's name filled in.
 *
 * ── Adding a city ───────────────────────────────────────────────────────
 * Firebase console → `labCities` → new document, id = the slug. Fill in:
 *
 *   slug        (string)   URL segment: /lab-test/<slug>. Defaults to the doc id.
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
 * `icon` values are strings, not components — see src/data/labDefaults.js for
 * the names each registry understands.
 */
export const SEED_LAB_CITIES = [
  {
    slug: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    areas: ["Sarnath", "Ramnagar", "Bhelupur", "Lanka", "Sigra", "Cantt"],
    postalCode: "221001",
    order: 1,
    published: true,
  },
];

/**
 * Used only when Firestore returns nothing at all — every rendered page still
 * needs a city-shaped object rather than a crash.
 */
export const FALLBACK_CITY = SEED_LAB_CITIES[0];
