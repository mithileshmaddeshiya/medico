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
 */
import { revalidatePath } from "next/cache";

import { LAB_CITIES } from "@/data/lab/cities";
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

  return LAB_CITIES.map((city) => {
    const row = overrides.get(city.slug);
    return {
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
      status: row?.status ?? (city.published === false ? "hidden" : "published"),
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
  if (!LAB_CITIES.some((city) => city.slug === slug)) {
    return {
      ok: false,
      // A city is added in src/data/lab/cities.js, where its localities, its
      // district context and its Maps link live. Inventing one here would
      // create a page with no facts behind it.
      error: "That city is not in the site's city list. Add it in src/data/lab/cities.js first.",
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

  // Imported lazily: src/lib/labCities.js imports this module to read the
  // overrides, so a static import back would be a cycle.
  (await import("@/lib/labCities")).invalidateLabCities();

  try {
    revalidatePath(`/lab-test/${slug}`);
    revalidatePath("/sitemap/lab-test.xml");
    // Every footer lists the cities, so hiding one touches every page.
    revalidatePath("/", "layout");
  } catch {
    /* outside a request scope */
  }

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
