/**
 * Reading and writing articles from the admin panel. Server only.
 *
 * The public reader (src/lib/blogs/fromDb.js) only ever sees `published` rows.
 * This module sees everything — drafts, archived posts and the bin — because
 * that is what a back office is for.
 *
 * Nothing here deletes. `remove()` goes through softDelete(), like the rest of
 * the panel; a post that is "deleted" keeps its row, its body and, crucially,
 * its route, so the redirect that should replace it can be written from the
 * post itself instead of being reconstructed from memory.
 */
import { revalidatePath } from "next/cache";

import { invalidateBlogIndex } from "@/lib/blogs";
import { slugify } from "@/lib/blogs/normalise";
import { query } from "@/lib/db";

import { audit } from "./audit";
import { headingsOf, imagesOf, linksOf, sanitizeHtml, textOf } from "./sanitizeHtml";
import { scorePage } from "./seoScore";
import { softDelete, visible } from "./softDelete";

const jsonOrNull = (value) =>
  value === null || value === undefined ? null : JSON.stringify(value);

const parse = (value, fallback) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

/** A DATE column as YYYY-MM-DD without a timezone shift. */
const dateOnly = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 10);
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/* ── Reading ──────────────────────────────────────────────────────────────── */

/**
 * The list view. Filterable by status, city and free text; deleted posts are
 * hidden until the bin is asked for explicitly.
 */
export async function listPosts({
  status = null,
  city = null,
  search = "",
  includeDeleted = false,
  limit = 100,
  offset = 0,
} = {}) {
  const where = [status ? "status = ?" : visible("", includeDeleted)];
  const params = [];
  if (status) params.push(status);

  if (city) {
    where.push("city = ?");
    params.push(city);
  }
  if (search) {
    where.push("(title LIKE ? OR description LIKE ? OR category LIKE ? OR focus_keyword LIKE ?)");
    const like = `%${search}%`;
    params.push(like, like, like, like);
  }

  const [rows] = await query(
    `SELECT id, category, city, city_name, title, description, focus_keyword,
            status, seo_score, noindex, in_sitemap, published_at, updated_on,
            hero_media_id, sort_order, updated_at
     FROM blog_posts
     WHERE ${where.join(" AND ")}
     ORDER BY FIELD(status, 'draft', 'published', 'archived', 'deleted'), updated_at DESC
     LIMIT ${Math.min(500, Number(limit) || 100)} OFFSET ${Math.max(0, Number(offset) || 0)}`,
    params
  );

  return rows.map((row) => ({
    ...row,
    href: `/blogs/${row.category}/${row.city}`,
    publishedAt: dateOnly(row.published_at),
    updatedOn: dateOnly(row.updated_on),
  }));
}

/** Counts per status, for the tabs above the list. */
export async function postCounts() {
  const [rows] = await query(
    "SELECT status, COUNT(*) AS n FROM blog_posts GROUP BY status"
  );
  return Object.fromEntries(rows.map((row) => [row.status, Number(row.n)]));
}

/** One post, in full, whatever its status. */
export async function getPost(id) {
  const [rows] = await query("SELECT * FROM blog_posts WHERE id = ? LIMIT 1", [Number(id) || 0]);
  const row = rows[0];
  if (!row) return null;

  return {
    ...row,
    keywords: parse(row.keywords_json, []),
    takeaways: parse(row.takeaways_json, []),
    faqs: parse(row.faqs_json, []),
    relatedLinks: parse(row.related_json, null),
    sections: parse(row.sections_json, []),
    publishedAt: dateOnly(row.published_at),
    updatedOn: dateOnly(row.updated_on),
    href: `/blogs/${row.category}/${row.city}`,
  };
}

/* ── Importing a file-backed post into the editor ─────────────────────────── */

/**
 * Structured sections → the HTML the editor works in.
 *
 * Run ONCE, the first time somebody opens an imported post for editing, and
 * never on render. The conversion is lossy in one direction only: a typed
 * `{ note: … }` block becomes a div the sanitiser allows and the CSS styles
 * identically, but it is no longer typed data. That is an acceptable trade the
 * moment a human decides to edit the post — and until they do, the post keeps
 * rendering from its sections and nothing is converted at all.
 *
 * Kept here rather than in the importer so that a post imported months ago is
 * converted by whatever this function does today.
 */
export function sectionsToHtml(sections = []) {
  const escape = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  // A paragraph's parts are strings or { text, href } — the same convention
  // partsOf() decodes in src/lib/blogs/normalise.js.
  const inline = (parts) =>
    (Array.isArray(parts) ? parts : [parts])
      .map((part) =>
        typeof part === "string"
          ? escape(part)
          : part?.href
            ? `<a href="${escape(part.href)}">${escape(part.text ?? part.href)}</a>`
            : escape(part?.text ?? "")
      )
      .join("");

  const out = [];

  for (const section of sections) {
    out.push(`<h2 id="${escape(section.id ?? slugify(section.heading))}">${escape(section.heading)}</h2>`);
    if (section.lead) out.push(`<p class="lead">${inline(section.lead)}</p>`);

    for (const block of section.blocks ?? []) {
      if (block.kind === "p") out.push(`<p>${inline(block.parts)}</p>`);
      else if (block.kind === "list") {
        out.push(`<ul>${block.items.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`);
      } else if (block.kind === "table") {
        const head = block.head?.length
          ? `<thead><tr>${block.head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead>`
          : "";
        const body = block.rows
          .map((row) => `<tr>${row.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
          .join("");
        out.push(`<table>${head}<tbody>${body}</tbody></table>`);
      } else if (block.kind === "note") {
        out.push(
          `<div class="note ${block.tone === "warn" ? "note-warn" : "note-info"}">` +
            (block.title ? `<p><strong>${escape(block.title)}</strong></p>` : "") +
            `<p>${escape(block.text)}</p></div>`
        );
      }
    }

    if (section.image?.src) {
      out.push(`<img src="${escape(section.image.src)}" alt="${escape(section.image.alt ?? "")}" />`);
    }
  }

  return sanitizeHtml(out.join("\n"));
}

/**
 * The body the editor should open with.
 *
 * `body_html` if the post has one, otherwise its sections converted on the
 * spot. Converting on OPEN rather than on save means an imported post is never
 * silently rewritten just because somebody clicked into it and left again.
 */
export const editableBody = (post) =>
  post?.body_html || (post?.sections?.length ? sectionsToHtml(post.sections) : "");

/* ── Writing ──────────────────────────────────────────────────────────────── */

/** The score, computed from the same inputs the editor shows. */
function scoreOf(input, html) {
  const text = textOf(html);
  return scorePage({
    title: input.title,
    description: input.description,
    slug: input.category,
    focusKeyword: input.focusKeyword,
    bodyText: text,
    headings: headingsOf(html),
    links: linksOf(html),
    images: imagesOf(html),
    heroAlt: input.heroAlt,
    noindex: input.noindex,
  }).score;
}

/**
 * Create or update a post.
 *
 * ── THE ROUTE IS THE IDENTITY ────────────────────────────────────────────
 * (category, city) is the URL. Changing either on a post that is already
 * published changes a live URL, so the caller must have written a redirect
 * first — `changeRoute()` below does both in one transaction and is the only
 * supported way to do it. This function refuses a route change on a published
 * post rather than quietly breaking an indexed page.
 */
export async function savePost(input, { user } = {}) {
  const category = slugify(input.category);
  const city = slugify(input.city);

  if (!category || !city) return { ok: false, error: "A URL needs both a category and a city." };
  if (!String(input.title ?? "").trim()) return { ok: false, error: "The post needs a title." };

  const html = sanitizeHtml(input.bodyHtml ?? "");
  const score = scoreOf({ ...input, category }, html);
  const existing = input.id ? await getPost(input.id) : null;

  if (existing && existing.status === "published") {
    if (existing.category !== category || existing.city !== city) {
      return {
        ok: false,
        error:
          "This post is live at its current URL. Use “Change URL”, which writes the 301 at the same time.",
      };
    }
  }

  const values = [
    category,
    city,
    String(input.cityName ?? "").slice(0, 120),
    String(input.title).slice(0, 255),
    String(input.description ?? "").slice(0, 500),
    String(input.focusKeyword ?? "").slice(0, 120),
    jsonOrNull(input.keywords ?? []),
    html || null,
    jsonOrNull(input.takeaways ?? []),
    jsonOrNull(input.faqs ?? []),
    jsonOrNull(input.relatedLinks ?? null),
    input.heroMediaId ? Number(input.heroMediaId) : null,
    String(input.heroAlt ?? "").slice(0, 255),
    input.canonical ? String(input.canonical).slice(0, 255) : null,
    input.noindex ? 1 : 0,
    input.nofollow ? 1 : 0,
    input.inSitemap === false ? 0 : 1,
    Number(input.priority ?? 0.9),
    String(input.changefreq ?? "weekly").slice(0, 12),
    score,
    Number(input.sortOrder ?? 1000),
    input.publishedAt || null,
    input.updatedOn || null,
  ];

  if (existing) {
    await query(
      `UPDATE blog_posts SET
         category = ?, city = ?, city_name = ?, title = ?, description = ?,
         focus_keyword = ?, keywords_json = ?, body_html = ?, takeaways_json = ?,
         faqs_json = ?, related_json = ?, hero_media_id = ?, hero_alt = ?,
         canonical = ?, noindex = ?, nofollow = ?, in_sitemap = ?, priority = ?,
         changefreq = ?, seo_score = ?, sort_order = ?, published_at = ?, updated_on = ?
       WHERE id = ?`,
      [...values, existing.id]
    );

    await audit({
      user,
      action: "update",
      entity: "blog_posts",
      entityId: existing.id,
      summary: `edited “${input.title}” (SEO ${score})`,
      before: { ...existing, body_html: undefined, sections_json: undefined },
      after: { title: input.title, category, city, seo_score: score },
    });

    await refresh(existing, { category, city });
    return { ok: true, id: existing.id, score };
  }

  // A route that already exists — including one in the bin — must not be
  // created twice. The unique key would refuse it anyway; this gives the
  // person a sentence instead of a database error, and points at the bin.
  const [clash] = await query(
    "SELECT id, status FROM blog_posts WHERE category = ? AND city = ? LIMIT 1",
    [category, city]
  );
  if (clash[0]) {
    return {
      ok: false,
      error:
        clash[0].status === "deleted"
          ? "A deleted post already owns that URL. Restore it from the bin instead of creating a second one."
          : "There is already a post at that URL.",
    };
  }

  const [result] = await query(
    `INSERT INTO blog_posts
       (category, city, city_name, title, description, focus_keyword, keywords_json,
        body_html, takeaways_json, faqs_json, related_json, hero_media_id, hero_alt,
        canonical, noindex, nofollow, in_sitemap, priority, changefreq, seo_score,
        sort_order, published_at, updated_on, status, author_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
    [...values, user?.id ?? null]
  );

  await audit({
    user,
    action: "create",
    entity: "blog_posts",
    entityId: result.insertId,
    summary: `created “${input.title}” at /blogs/${category}/${city}`,
    after: { title: input.title, category, city, seo_score: score },
  });

  return { ok: true, id: result.insertId, score, created: true };
}

/**
 * Publish, unpublish or archive.
 *
 * Publishing stamps `published_at` the first time only — a re-publish after an
 * edit must not move the original date. `updated_on` moves instead, which is
 * what feeds `dateModified` and the sitemap's lastmod. Bumping publishedAt on
 * every edit is the thing sitemap/blogs.xml's own comment warns about: a
 * lastmod that always says "today" is one Google learns to ignore.
 */
export async function setStatus(id, status, { user } = {}) {
  const allowed = ["draft", "published", "archived"];
  if (!allowed.includes(status)) return { ok: false, error: "Unknown status." };

  const post = await getPost(id);
  if (!post) return { ok: false, error: "That post no longer exists." };

  if (status === "published") {
    const problems = [];
    if (!post.title?.trim()) problems.push("a title");
    if (!post.description?.trim()) problems.push("a meta description");
    if (!post.body_html && !post.sections?.length) problems.push("a body");
    if (problems.length) {
      return { ok: false, error: `It still needs ${problems.join(", ")} before it can go live.` };
    }
  }

  await query(
    `UPDATE blog_posts
        SET status = ?,
            published_at = ${status === "published" ? "COALESCE(published_at, CURDATE())" : "published_at"},
            updated_on = ${status === "published" ? "CURDATE()" : "updated_on"},
            deleted_at = NULL
      WHERE id = ?`,
    [status, post.id]
  );

  await audit({
    user,
    action: status === "published" ? "publish" : status === "archived" ? "archive" : "unpublish",
    entity: "blog_posts",
    entityId: post.id,
    summary: `${post.title} → ${status}`,
    before: { status: post.status },
    after: { status },
  });

  await refresh(post);
  return { ok: true, status };
}

/**
 * Move a published post to a new URL, writing the redirect in the same breath.
 *
 * This is the only route change the panel allows on a live post, and the
 * redirect is not optional. A URL that has been indexed and then moved without
 * one is a 404 where a ranking page used to be, and the traffic does not come
 * back on its own.
 */
export async function changeRoute(id, { category, city }, { user } = {}) {
  const post = await getPost(id);
  if (!post) return { ok: false, error: "That post no longer exists." };

  const nextCategory = slugify(category);
  const nextCity = slugify(city);
  if (!nextCategory || !nextCity) return { ok: false, error: "The new URL is not valid." };

  const from = `/blogs/${post.category}/${post.city}`;
  const to = `/blogs/${nextCategory}/${nextCity}`;
  if (from === to) return { ok: true, unchanged: true };

  const [clash] = await query(
    "SELECT id FROM blog_posts WHERE category = ? AND city = ? AND id <> ? LIMIT 1",
    [nextCategory, nextCity, post.id]
  );
  if (clash[0]) return { ok: false, error: "Another post already owns that URL." };

  await query("UPDATE blog_posts SET category = ?, city = ? WHERE id = ?", [
    nextCategory,
    nextCity,
    post.id,
  ]);

  // 308 rather than 301: identical meaning to a search engine, and it also
  // preserves the request method. Same choice next.config.mjs documents for
  // the retired medicine section.
  await query(
    `INSERT INTO seo_redirects (source, destination, code, note)
     VALUES (?, ?, 308, ?)
     ON DUPLICATE KEY UPDATE destination = VALUES(destination), status = 'active',
                             note = VALUES(note), deleted_at = NULL`,
    [from, to, `post moved by ${user?.email ?? "the panel"}`]
  );

  await audit({
    user,
    action: "update",
    entity: "blog_posts",
    entityId: post.id,
    summary: `moved ${from} → ${to}, 308 written`,
    before: { category: post.category, city: post.city },
    after: { category: nextCategory, city: nextCity },
  });

  await refresh(post, { category: nextCategory, city: nextCity });
  return { ok: true, from, to };
}

/**
 * Soft-delete a post.
 *
 * `redirectTo` is offered in the UI and strongly recommended for anything that
 * was ever published: a deleted article's URL is still linked from other posts
 * and still in Google's index, and a 404 there throws away everything the page
 * earned. Not forced — a draft that was never live has nothing to redirect.
 */
export async function removePost(id, { user, redirectTo = "", mode = "delete" } = {}) {
  const post = await getPost(id);
  if (!post) return { ok: false, error: "That post no longer exists." };

  const result = await softDelete("blog_posts", post.id, { user, mode });
  if (!result.ok) return result;

  if (redirectTo) {
    await query(
      `INSERT INTO seo_redirects (source, destination, code, note)
       VALUES (?, ?, 308, ?)
       ON DUPLICATE KEY UPDATE destination = VALUES(destination), status = 'active', deleted_at = NULL`,
      [post.href, redirectTo, `${post.title} was removed`]
    );
  }

  await refresh(post);
  return { ...result, redirected: Boolean(redirectTo) };
}

/* ── Cache ────────────────────────────────────────────────────────────────── */

/**
 * Make a change visible immediately.
 *
 * The in-process blog index is dropped and the affected routes are
 * revalidated, so "publish" means the page is live now rather than within the
 * minute the TTL allows. Both old and new paths are revalidated on a move —
 * the old one so it starts serving its redirect, the new one so it exists.
 */
async function refresh(post, next = null) {
  invalidateBlogIndex();

  const paths = new Set(["/blogs", "/sitemap/blogs.xml", "/sitemap.xml", "/"]);
  if (post?.category && post?.city) paths.add(`/blogs/${post.category}/${post.city}`);
  if (next?.category && next?.city) paths.add(`/blogs/${next.category}/${next.city}`);

  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch {
      // revalidatePath throws outside a request scope (a script, a cron). The
      // TTL in src/lib/blogs/index.js covers that case; it is not worth
      // failing a save over.
    }
  }
}

/** Cities that already have posts — the filter dropdown on the list. */
export async function postCities() {
  const [rows] = await query(
    `SELECT city, city_name, COUNT(*) AS n FROM blog_posts
     WHERE status <> 'deleted' GROUP BY city, city_name ORDER BY city`
  );
  return rows;
}
