/**
 * City page overrides. Server only.
 *
 * ── WHAT THIS DOES AND DOES NOT OWN ──────────────────────────────────────
 * src/data/lab/cities.js stays the source of truth for what a city IS: its
 * slug, its localities, its district context, its coordinates, its Google
 * Business Profile link. Those are facts about the world, several of them feed
 * structured data, and getting one wrong publishes a place that does not
 * exist — the file's own comments are emphatic about that, and they are right.
 * None of it is editable from a web form.
 *
 * This table owns only what is genuinely editorial and safe to change without
 * a deploy: the page's title, meta description and keywords, its H1, its hero
 * image and alt text, its sitemap priority, and whether it is published at all.
 * src/lib/labCities.js merges these over the file's values.
 *
 * (The table also has intro_html, faqs_json, noindex and in_sitemap columns.
 * They are not offered: the city page has no slot for an intro, and a city
 * page must never be noindexed or left out of the sitemap while it is linked
 * from every footer — hiding it is the one takedown, and it removes all three
 * together. See the robots note in src/app/(lab)/lab-test/[city]/page.js.)
 *
 * A NULL column means "use the file's value", so an empty row changes nothing
 * and deleting an override restores the built-in copy exactly.
 *
 * ── CITIES ADDED FROM THE PANEL ──────────────────────────────────────────
 * /admin/cities/new creates a row in `lab_cities` with the same facts a file
 * entry has — name, state, localities, district context, PIN, coordinates,
 * GBP link. They are validated here as strictly as the file's own normalise()
 * would treat them (a half-filled coordinate pair or a non-Maps GBP link is
 * refused with a message, not silently dropped), then built with that same
 * function, so the page they get is the shared template like every other
 * city. The file's cities stay file-only: their slugs cannot be created here.
 */
import { revalidatePath } from "next/cache";

import { LAB_CITIES, buildCity, slugify } from "@/data/lab/cities";
import { dbConfigured, query } from "@/lib/db";

import { audit } from "./audit";
import { sanitizeHtml } from "./sanitizeHtml";
import { visible } from "./softDelete";

const parse = (value, fallback) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

const dateOnly = (value) => (value ? String(value).slice(0, 10) : null);

/**
 * Every city the site serves, with its override merged on top.
 *
 * Built from the FILE list, not from the table — a city with no row still
 * appears, because it still has a page. Listing only overridden cities would
 * make this screen a list of what somebody has edited rather than a list of
 * the site's city pages.
 */
/* ── Cities added in the panel ──────────────────────────────────────────── */

const FILE_SLUGS = new Set(LAB_CITIES.map((city) => city.slug));

/** A lab_cities row as the fields a src/data/lab/cities.js entry would have. */
function rowToFields(row) {
  const lat = row.lat === null ? null : Number(row.lat);
  const lng = row.lng === null ? null : Number(row.lng);
  return {
    slug: row.slug,
    name: row.name,
    state: row.state,
    areas: parse(row.areas_json, []),
    areaContext: row.area_context || undefined,
    aliases: parse(row.aliases_json, undefined),
    postalCode: row.postal_code || undefined,
    geo: Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : undefined,
    gbp: row.gbp || undefined,
    order: Number(row.sort_order),
    published: row.status === "published",
  };
}

/**
 * Every panel-added city (not deleted), built exactly like a file city, with
 * `custom: true` and the raw facts for the edit form. Never throws — an
 * unreachable database leaves the site on the file's cities alone.
 */
export async function customCities() {
  if (!dbConfigured()) return [];
  try {
    const [rows] = await query("SELECT * FROM lab_cities WHERE status <> 'deleted' ORDER BY sort_order, name");
    return rows
      .map((row) => {
        const fields = rowToFields(row);
        const city = buildCity(fields);
        return city && { ...city, custom: true, customStatus: row.status, facts: fields };
      })
      .filter(Boolean);
  } catch (err) {
    console.error("[cities] could not read panel cities", err);
    return [];
  }
}

const GBP = /^https:\/\/(?:www\.)?google\.[a-z.]+\/maps\/|^https:\/\/maps\.app\.goo\.gl\/|^https:\/\/goo\.gl\/maps\//;

/** "Rudrapur, Barhaj\nLar" → ["Rudrapur", "Barhaj", "Lar"], de-duplicated. */
const list = (value) => [
  ...new Set(
    String(value ?? "")
      .split(/[\n,]/)
      .map((item) => item.trim().replace(/\s+/g, " ").slice(0, 80))
      .filter(Boolean)
  ),
];

/**
 * Validate a city's facts. `{ error }` or `{ value }` — never half of each.
 * Every rule is one the file's normalise() applies silently; here a wrong
 * value is sent back with a sentence instead of quietly dropped.
 */
export function validateCityFacts(input) {
  const name = String(input.name ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
  if (name.length < 2) return { error: "The city needs a name." };

  const slug = slugify(input.slug || name).slice(0, 120);
  if (!slug) return { error: "That name does not make a usable URL. Type the URL part yourself." };
  // /admin/cities/new is the create screen, so a city called "new" could never be edited.
  if (slug === "new") return { error: "“new” is reserved. Pick another URL." };

  const state = String(input.state ?? "").trim().slice(0, 80) || "Uttar Pradesh";

  const areas = list(input.areas);
  if (!areas.length) {
    return {
      error:
        "Add at least one locality you actually collect from. They become the page's areaServed and fill the booking form's dropdown.",
    };
  }
  if (areas.length > 40) return { error: "That is more than 40 localities — list only the ones you really cover." };

  const postalCode = String(input.postalCode ?? "").trim();
  if (postalCode && !/^\d{6}$/.test(postalCode)) return { error: "A PIN code is six digits." };

  const latRaw = String(input.lat ?? "").trim();
  const lngRaw = String(input.lng ?? "").trim();
  let lat = null;
  let lng = null;
  if (latRaw || lngRaw) {
    lat = Number(latRaw);
    lng = Number(lngRaw);
    if (!latRaw || !lngRaw || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return { error: "Enter both latitude and longitude, or leave both empty." };
    }
    if (lat < 6 || lat > 38 || lng < 68 || lng > 98) {
      return { error: "Those coordinates are not in India. Latitude comes first, e.g. 26.50, 83.78." };
    }
  }

  const gbp = String(input.gbp ?? "").trim();
  if (gbp && !GBP.test(gbp)) {
    return {
      error:
        "That is not a Google Maps link. Use the page's public Maps URL (google.com/maps/place/… or maps.app.goo.gl/…), not the Business Profile dashboard.",
    };
  }

  const order = Number(input.order);

  return {
    value: {
      slug,
      name,
      state,
      areas,
      areaContext: String(input.areaContext ?? "").trim().slice(0, 80) || null,
      aliases: list(input.aliases).slice(0, 10),
      postalCode: postalCode || null,
      lat,
      lng,
      gbp: gbp || null,
      order: Number.isFinite(order) && String(input.order ?? "").trim() !== "" ? Math.round(order) : 1000,
      status: input.status === "hidden" ? "hidden" : "published",
    },
  };
}

/** Clear every cache that lists cities, then the pages that show them. */
async function refreshCity(slug) {
  // Imported lazily: src/lib/labCities.js imports this module to read the
  // overrides, so a static import back would be a cycle.
  (await import("@/lib/labCities")).invalidateLabCities();

  try {
    revalidatePath(`/lab-test/${slug}`);
    revalidatePath("/sitemap/lab-test.xml");
    revalidatePath("/sitemap.xml");
    // Every footer lists the cities, so adding or hiding one touches every page.
    revalidatePath("/", "layout");
  } catch {
    /* outside a request scope */
  }
}

const factParams = (value) => [
  value.name, value.state, JSON.stringify(value.areas), value.areaContext,
  value.aliases.length ? JSON.stringify(value.aliases) : null, value.postalCode,
  value.lat, value.lng, value.gbp, value.order, value.status,
];

/** Create a city page. Refuses a slug the file or the table already has. */
export async function createCity(input, { user } = {}) {
  const { error, value } = validateCityFacts(input);
  if (error) return { ok: false, error };

  if (FILE_SLUGS.has(value.slug)) {
    return { ok: false, error: `/lab-test/${value.slug} already exists. Edit that city instead.` };
  }
  const [existing] = await query("SELECT status FROM lab_cities WHERE slug = ?", [value.slug]);
  if (existing[0]) {
    return {
      ok: false,
      error:
        existing[0].status === "deleted"
          ? `/lab-test/${value.slug} was created before and removed. Pick another URL.`
          : `/lab-test/${value.slug} already exists. Edit that city instead.`,
    };
  }

  await query(
    `INSERT INTO lab_cities
       (name, state, areas_json, area_context, aliases_json, postal_code, lat, lng, gbp, sort_order, status, slug)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [...factParams(value), value.slug]
  );

  await audit({
    user,
    action: "create",
    entity: "lab_cities",
    entityId: value.slug,
    summary: `added city page /lab-test/${value.slug}`,
    after: value,
  });

  await refreshCity(value.slug);
  return { ok: true, slug: value.slug };
}

/** Change the facts of a panel-added city. Its slug (the URL) is fixed. */
export async function updateCityFacts(input, { user } = {}) {
  const slug = String(input.slug ?? "");
  const [rows] = await query("SELECT * FROM lab_cities WHERE slug = ? AND status <> 'deleted'", [slug]);
  const before = rows[0];
  if (!before) return { ok: false, error: "Only cities added in the panel can have their details edited here." };

  // The URL is linked, shared and indexed once it exists — it does not move.
  const { error, value } = validateCityFacts({ ...input, slug });
  if (error) return { ok: false, error };

  await query(
    `UPDATE lab_cities SET name = ?, state = ?, areas_json = ?, area_context = ?, aliases_json = ?,
       postal_code = ?, lat = ?, lng = ?, gbp = ?, sort_order = ?, status = ?
     WHERE slug = ?`,
    [...factParams(value), slug]
  );

  await audit({
    user,
    action: "update",
    entity: "lab_cities",
    entityId: slug,
    summary: `city details for /lab-test/${slug}`,
    before,
    after: value,
  });

  await refreshCity(slug);
  return { ok: true, slug };
}

export async function listCities() {
  let overrides = new Map();

  if (dbConfigured()) {
    try {
      const [rows] = await query(`SELECT * FROM city_overrides WHERE ${visible("", false)}`);
      overrides = new Map(rows.map((row) => [row.slug, row]));
    } catch (err) {
      console.error("[cities] could not read overrides", err);
    }
  }

  const custom = await customCities();

  return [...LAB_CITIES, ...custom.filter((city) => !FILE_SLUGS.has(city.slug))].map((city) => {
    const row = overrides.get(city.slug);
    return {
      custom: Boolean(city.custom),
      facts: city.facts ?? null,
      slug: city.slug,
      name: city.name,
      state: city.state,
      areas: city.areas ?? [],
      href: `/lab-test/${city.slug}`,
      // What the page publishes today: the override if there is one, else the
      // value the file generates.
      title: row?.title ?? city.title,
      description: row?.description ?? city.description,
      h1: row?.h1 ?? city.hero?.h1 ?? null,
      noindex: Boolean(row?.noindex),
      inSitemap: row ? row.in_sitemap !== 0 : true,
      priority: Number(row?.priority ?? 0.9),
      // A panel city hidden in its own details form is hidden whatever an
      // override says; otherwise the override decides, else it is live.
      status:
        city.customStatus === "hidden"
          ? "hidden"
          : row?.status ?? (city.published === false ? "hidden" : "published"),
      seoScore: row?.seo_score ?? 0,
      reviewedOn: dateOnly(row?.reviewed_on),
      hasOverride: Boolean(row),
      heroMediaId: row?.hero_media_id ?? null,
      faqs: parse(row?.faqs_json, null),
      introHtml: row?.intro_html ?? null,
      keywords: parse(row?.keywords_json, null),
      heroAlt: row?.hero_alt ?? null,
      /* Only what was actually overridden — what the edit form's boxes hold.
         Pre-filling a box with the generated text would freeze that text into
         the override on the next save, and later improvements to the shared
         template would silently stop reaching this city. */
      edited: {
        title: row?.title ?? "",
        description: row?.description ?? "",
        h1: row?.h1 ?? "",
      },
    };
  });
}

export async function getCity(slug) {
  const cities = await listCities();
  return cities.find((city) => city.slug === slug) ?? null;
}

export async function saveCity(input, { user } = {}) {
  const slug = String(input.slug ?? "").trim();
  if (!FILE_SLUGS.has(slug) && !(await customCities()).some((city) => city.slug === slug)) {
    return {
      ok: false,
      // A city is added in src/data/lab/cities.js, where its localities, its
      // district context and its Maps link live. Inventing one here would
      // create a page with no facts behind it.
      error: "That city is not in the site's city list. Add it with “Add a city” first.",
    };
  }

  const before = await getCity(slug);
  const empty = (value) => {
    const text = String(value ?? "").trim();
    return text === "" ? null : text;
  };

  await query(
    `INSERT INTO city_overrides
       (slug, title, description, keywords_json, h1, hero_media_id, hero_alt,
        intro_html, faqs_json, noindex, in_sitemap, priority, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title), description = VALUES(description),
       keywords_json = VALUES(keywords_json), h1 = VALUES(h1),
       hero_media_id = VALUES(hero_media_id), hero_alt = VALUES(hero_alt),
       intro_html = VALUES(intro_html), faqs_json = VALUES(faqs_json),
       noindex = VALUES(noindex), in_sitemap = VALUES(in_sitemap),
       priority = VALUES(priority), status = VALUES(status), deleted_at = NULL`,
    [
      slug,
      empty(input.title),
      empty(input.description),
      input.keywords?.length ? JSON.stringify(input.keywords) : null,
      empty(input.h1),
      input.heroMediaId ? Number(input.heroMediaId) : null,
      empty(input.heroAlt),
      input.introHtml ? sanitizeHtml(input.introHtml) : null,
      input.faqs?.length ? JSON.stringify(input.faqs) : null,
      input.noindex ? 1 : 0,
      input.inSitemap === false ? 0 : 1,
      Number(input.priority ?? 0.9),
      input.status === "hidden" ? "hidden" : "published",
    ]
  );

  await audit({
    user,
    action: before?.hasOverride ? "update" : "create",
    entity: "city_overrides",
    entityId: slug,
    summary: `city page ${slug}`,
    before,
    after: input,
  });

  await refreshCity(slug);
  return { ok: true };
}

/**
 * The overrides the public city page reads.
 *
 * Never throws — a database problem must leave the city pages rendering their
 * built-in copy, not an empty page.
 */
export async function cityOverrides() {
  if (!dbConfigured()) return new Map();

  try {
    // Hidden rows are returned too: "hidden" is how a city page is taken
    // down, so the reader needs to see it in order to drop the city.
    const [rows] = await query("SELECT * FROM city_overrides WHERE status <> 'deleted'");
    return new Map(
      rows.map((row) => [
        row.slug,
        {
          title: row.title,
          description: row.description,
          keywords: parse(row.keywords_json, null),
          h1: row.h1,
          heroMediaId: row.hero_media_id,
          heroAlt: row.hero_alt,
          introHtml: row.intro_html,
          faqs: parse(row.faqs_json, null),
          priority: Number(row.priority),
          hidden: row.status === "hidden",
        },
      ])
    );
  } catch (err) {
    console.error("[cities] could not read overrides", err);
    return new Map();
  }
}
