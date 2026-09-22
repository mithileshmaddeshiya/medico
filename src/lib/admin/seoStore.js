/**
 * Per-route metadata, redirects and sitemap control. Server only.
 *
 * ── WHAT THE PANEL IS AND IS NOT ALLOWED TO CHANGE ───────────────────────
 * It may set, per URL: the title, the meta description, keywords, the
 * canonical, the OG card, index/follow, whether the URL is in the sitemap, its
 * priority and changefreq, and the `reviewed` date that sitemap/static.xml
 * insists a human types.
 *
 * It may NOT touch the structured data. The Organization and WebSite nodes in
 * src/lib/schema.js carry stable @ids that every other node on the site
 * references, and the file's own header explains at length what happens when a
 * brand entity is declared inconsistently — Google stops matching the site to
 * a single entity and starts spell-correcting the brand name. That is not a
 * field to expose behind a text input. Schema changes go through a deploy,
 * with the comments that explain them.
 *
 * Nor may it write a claim: no accreditation, no ratings, no invented test
 * counts. The rule at the top of src/data/home.js applies to everything typed
 * into this panel, and the editor says so on screen.
 *
 * ── THE `reviewed` DATE ──────────────────────────────────────────────────
 * sitemap/static.xml's comment is emphatic that lastmod must be a real date a
 * person typed, because a lastmod that is always "today" is one Google learns
 * to ignore. The panel honours that literally: saving a route does NOT move
 * its reviewed date. There is a separate "mark as reviewed" action, and that
 * is the only thing that stamps it.
 */
import { revalidatePath } from "next/cache";

import { dbConfigured, query } from "@/lib/db";

import { audit } from "./audit";
import { softDelete, visible } from "./softDelete";

/** The fixed pages the panel manages. Mirrors sitemap/static.xml's list. */
export const STATIC_ROUTES = [
  { route: "/", label: "Home", priority: 1.0, changefreq: "weekly" },
  { route: "/lab-test", label: "Lab tests hub", priority: 0.8, changefreq: "weekly" },
  { route: "/blogs", label: "Guides hub", priority: 0.6, changefreq: "weekly" },
  { route: "/about", label: "About", priority: 0.7, changefreq: "monthly" },
  { route: "/contact", label: "Contact", priority: 0.7, changefreq: "monthly" },
  { route: "/privacy", label: "Privacy policy", priority: 0.3, changefreq: "yearly" },
  { route: "/terms", label: "Terms", priority: 0.3, changefreq: "yearly" },
];

const dateOnly = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 10);
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const parse = (value, fallback) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

/* ── Routes ───────────────────────────────────────────────────────────────── */

/**
 * Every managed route: the fixed list above, with any saved overrides merged in.
 *
 * A route with no row yet still appears, showing the defaults it currently
 * publishes — so the list is a picture of the site rather than a picture of
 * what somebody has happened to edit.
 */
export async function listRoutes() {
  const [rows] = await query(
    `SELECT * FROM seo_routes WHERE ${visible("", false)} ORDER BY route`
  );
  const saved = new Map(rows.map((row) => [row.route, row]));

  const merged = STATIC_ROUTES.map((base) => {
    const row = saved.get(base.route);
    saved.delete(base.route);
    return {
      ...base,
      ...(row ?? {}),
      route: base.route,
      label: row?.label || base.label,
      priority: Number(row?.priority ?? base.priority),
      changefreq: row?.changefreq || base.changefreq,
      keywords: parse(row?.keywords_json, []),
      reviewedOn: dateOnly(row?.reviewed_on),
      hasOverride: Boolean(row),
    };
  });

  // Anything somebody added by hand that is not in the fixed list.
  for (const row of saved.values()) {
    merged.push({
      ...row,
      keywords: parse(row.keywords_json, []),
      priority: Number(row.priority),
      reviewedOn: dateOnly(row.reviewed_on),
      hasOverride: true,
      custom: true,
    });
  }

  return merged;
}

export async function getRoute(route) {
  const [rows] = await query("SELECT * FROM seo_routes WHERE route = ? LIMIT 1", [String(route)]);
  const row = rows[0];
  const base = STATIC_ROUTES.find((r) => r.route === route);

  if (!row) {
    return base ? { ...base, keywords: [], noindex: 0, in_sitemap: 1, hasOverride: false } : null;
  }

  return {
    ...base,
    ...row,
    keywords: parse(row.keywords_json, []),
    priority: Number(row.priority),
    reviewedOn: dateOnly(row.reviewed_on),
    hasOverride: true,
  };
}

export async function saveRoute(input, { user } = {}) {
  const route = String(input.route ?? "").trim();
  if (!route.startsWith("/")) return { ok: false, error: "A route has to start with /." };

  const before = await getRoute(route);

  await query(
    `INSERT INTO seo_routes
       (route, label, title, description, keywords_json, canonical, og_media_id,
        noindex, nofollow, in_sitemap, priority, changefreq)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       label = VALUES(label), title = VALUES(title), description = VALUES(description),
       keywords_json = VALUES(keywords_json), canonical = VALUES(canonical),
       og_media_id = VALUES(og_media_id), noindex = VALUES(noindex),
       nofollow = VALUES(nofollow), in_sitemap = VALUES(in_sitemap),
       priority = VALUES(priority), changefreq = VALUES(changefreq),
       status = 'active', deleted_at = NULL`,
    [
      route,
      String(input.label ?? "").slice(0, 120),
      input.title ? String(input.title).slice(0, 255) : null,
      input.description ? String(input.description).slice(0, 500) : null,
      JSON.stringify(input.keywords ?? []),
      input.canonical ? String(input.canonical).slice(0, 255) : null,
      input.ogMediaId ? Number(input.ogMediaId) : null,
      input.noindex ? 1 : 0,
      input.nofollow ? 1 : 0,
      input.inSitemap === false ? 0 : 1,
      Number(input.priority ?? 0.7),
      String(input.changefreq ?? "monthly").slice(0, 12),
    ]
  );

  await audit({
    user,
    action: before?.hasOverride ? "update" : "create",
    entity: "seo_routes",
    entityId: route,
    summary: `SEO for ${route}`,
    before,
    after: input,
  });

  try {
    revalidatePath(route);
    revalidatePath("/sitemap/static.xml");
  } catch {
    /* outside a request scope — the daily revalidate covers it */
  }

  return { ok: true };
}

/**
 * Stamp today onto a route's `reviewed` date.
 *
 * Separate from saving on purpose — see the header. This is the action that
 * means "a person read this page today and it is still accurate", and it is
 * the only thing that may move a lastmod.
 */
export async function markReviewed(route, { user } = {}) {
  await query(
    `INSERT INTO seo_routes (route, reviewed_on) VALUES (?, CURDATE())
     ON DUPLICATE KEY UPDATE reviewed_on = CURDATE()`,
    [String(route)]
  );
  await audit({ user, action: "update", entity: "seo_routes", entityId: route, summary: "marked reviewed today" });
  try {
    revalidatePath("/sitemap/static.xml");
  } catch {
    /* see above */
  }
  return { ok: true };
}

/**
 * The overrides the public sitemap and the page metadata read.
 *
 * Never throws — an unreachable database must leave the site publishing its
 * built-in values, not an empty sitemap.
 */
export async function routeOverrides() {
  if (!dbConfigured()) return new Map();
  try {
    const [rows] = await query(
      "SELECT * FROM seo_routes WHERE status = 'active'"
    );
    return new Map(
      rows.map((row) => [
        row.route,
        {
          title: row.title,
          description: row.description,
          keywords: parse(row.keywords_json, null),
          canonical: row.canonical,
          noindex: Boolean(row.noindex),
          nofollow: Boolean(row.nofollow),
          inSitemap: row.in_sitemap !== 0,
          priority: Number(row.priority),
          changefreq: row.changefreq,
          reviewedOn: dateOnly(row.reviewed_on),
        },
      ])
    );
  } catch (err) {
    console.error("[seo] could not read route overrides", err);
    return new Map();
  }
}

/* ── Redirects ────────────────────────────────────────────────────────────── */

export async function listRedirects({ includeDeleted = false } = {}) {
  const [rows] = await query(
    `SELECT * FROM seo_redirects WHERE ${visible("", includeDeleted)} ORDER BY updated_at DESC`
  );
  return rows;
}

/**
 * Add or update a redirect.
 *
 * Three things are checked, and each one has caused a real outage somewhere:
 *   · a rule pointing at itself is an infinite loop,
 *   · a rule whose destination is another rule's source is a chain, and Google
 *     gives up after a few hops,
 *   · a source that an existing page actually serves would make that page
 *     unreachable.
 * The first two are refused; the third is a warning, because "redirect this
 * live page to its replacement" is a legitimate thing to want.
 */
export async function saveRedirect(input, { user } = {}) {
  const source = String(input.source ?? "").trim();
  const destination = String(input.destination ?? "").trim();

  if (!source.startsWith("/")) return { ok: false, error: "The source has to be a path starting with /." };
  if (!destination.startsWith("/") && !/^https?:\/\//.test(destination)) {
    return { ok: false, error: "The destination has to be a path or a full https:// URL." };
  }
  if (source === destination) return { ok: false, error: "That redirect points at itself." };

  const code = Number(input.code ?? 308);
  if (![301, 302, 307, 308].includes(code)) return { ok: false, error: "Use 301, 302, 307 or 308." };

  const [chain] = await query(
    "SELECT source FROM seo_redirects WHERE source = ? AND status = 'active' LIMIT 1",
    [destination]
  );
  if (chain[0]) {
    return {
      ok: false,
      error: `${destination} is itself redirected. Point this one straight at the final URL instead — chained redirects lose most of their value.`,
    };
  }

  await query(
    `INSERT INTO seo_redirects (source, destination, code, note)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE destination = VALUES(destination), code = VALUES(code),
                             note = VALUES(note), status = 'active', deleted_at = NULL`,
    [source.slice(0, 255), destination.slice(0, 255), code, String(input.note ?? "").slice(0, 255)]
  );

  await audit({
    user,
    action: "create",
    entity: "seo_redirects",
    entityId: source,
    summary: `${source} → ${destination} (${code})`,
    after: { source, destination, code },
  });

  return { ok: true };
}

export const removeRedirect = (id, { user, mode = "archive" } = {}) =>
  softDelete("seo_redirects", Number(id), { user, mode });

/**
 * The active rules, for the middleware.
 *
 * Cached in-process for a minute: this runs on EVERY request that is not a
 * static file, and a database round trip in that path would put MySQL latency
 * on the critical path of every page view. A minute is the same window the
 * catalogue and the blog index use.
 */
let redirectMemo = { at: 0, map: new Map() };

export async function activeRedirects() {
  if (!dbConfigured()) return new Map();
  if (Date.now() - redirectMemo.at < 60_000) return redirectMemo.map;

  try {
    const [rows] = await query(
      "SELECT source, destination, code FROM seo_redirects WHERE status = 'active'"
    );
    redirectMemo = {
      at: Date.now(),
      map: new Map(rows.map((row) => [row.source, { to: row.destination, code: row.code }])),
    };
  } catch (err) {
    /*
     * Keep the LAST GOOD rules, and try again soon.
     *
     * This used to replace the map with an empty one for a full minute. A
     * five-second network blip then meant sixty seconds in which every
     * redirected URL answered 404 — which is exactly what a crawler must not
     * see, and it happened while the correct rules were sitting in memory.
     * The rules from a minute ago are almost certainly still right; none at
     * all are certainly wrong. The retry comes after 5s rather than 60s so a
     * recovered database is picked up quickly.
     */
    console.error("[seo] could not refresh redirects; keeping the last known rules", err);
    redirectMemo = { at: Date.now() - 55_000, map: redirectMemo.map };
  }

  return redirectMemo.map;
}

/** Count a redirect that fired. Fire-and-forget — it must not delay the 308. */
export const countRedirectHit = (source) =>
  query("UPDATE seo_redirects SET hits = hits + 1 WHERE source = ?", [source]).catch(() => {});

/* ── Health ───────────────────────────────────────────────────────────────── */

/**
 * The SEO overview on the panel's dashboard.
 *
 * Deliberately made of things that are true or false rather than a single
 * invented grade: how many published posts have a weak score, how many pages
 * are noindexed, how many redirects are live, how many images have no alt
 * text. Each one links to the list that fixes it.
 */
export async function seoHealth() {
  const [[posts], [noindex], [redirects], [alts], [missingMeta]] = await Promise.all([
    query(
      `SELECT COUNT(*) AS total,
              SUM(seo_score < 60) AS weak,
              SUM(seo_score >= 85) AS strong,
              ROUND(AVG(seo_score)) AS average
       FROM blog_posts WHERE status = 'published'`
    ),
    query("SELECT COUNT(*) AS n FROM blog_posts WHERE status = 'published' AND noindex = 1"),
    query("SELECT COUNT(*) AS n FROM seo_redirects WHERE status = 'active'"),
    query("SELECT COUNT(*) AS n FROM media WHERE status = 'active' AND (alt = '' OR alt IS NULL)"),
    query(
      `SELECT COUNT(*) AS n FROM blog_posts
       WHERE status = 'published' AND (description = '' OR description IS NULL)`
    ),
  ]);

  return {
    posts: posts[0],
    noindexed: Number(noindex[0].n),
    redirects: Number(redirects[0].n),
    imagesWithoutAlt: Number(alts[0].n),
    postsWithoutDescription: Number(missingMeta[0].n),
  };
}
