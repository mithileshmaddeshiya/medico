/**
 * The SEO checks the editor runs while you type, and the score it shows.
 *
 * Pure functions, no imports from the server — the same module runs in the
 * browser beside the TipTap editor (so the panel updates live) and on the
 * server at save time (so the stored `seo_score` is the real one and cannot be
 * faked by a POST). One implementation, one set of numbers.
 *
 * ── WHAT THIS IS, AND WHAT IT IS NOT ─────────────────────────────────────
 * It is a checklist of things that are objectively true or false about a page:
 * the title is 51 characters, the focus keyword is not in the H1, three images
 * have no alt text, there are no internal links. Those are worth surfacing
 * because they are cheap to fix and easy to miss.
 *
 * It is NOT a prediction of where the page will rank, and the panel says so on
 * screen. A green 100 on a thin, duplicated page beats nothing. The one thing
 * that would genuinely hurt this site is publishing medical claims to fill a
 * word count — so `length` is a hint here, never a hard failure, and there is
 * deliberately no "keyword density" check at all. Writing to a density target
 * is how you get prose that reads like it was written for a crawler, which is
 * both the thing Google's helpful-content work is aimed at and the thing a
 * patient trying to understand a blood test cannot use.
 *
 * ── THE RULES ARE ORDINARY ───────────────────────────────────────────────
 * Title 30–60 characters, description 70–160, one H1, a sensible heading
 * outline, the focus keyword in the title / description / first paragraph /
 * one subheading, alt text on images, at least one internal link, a slug that
 * is short and readable. Nothing exotic, nothing invented.
 */

/** Severity of a failed check. `error` costs the most, `hint` costs nothing. */
const WEIGHT = { error: 12, warn: 6, hint: 0 };

const words = (text) => String(text ?? "").split(/\s+/).filter(Boolean);

/** Does `text` contain `keyword`, ignoring case, punctuation and word order? */
export function containsKeyword(text, keyword) {
  const haystack = String(text ?? "").toLowerCase();
  const needle = String(keyword ?? "").trim().toLowerCase();
  if (!needle) return false;
  if (haystack.includes(needle)) return true;

  // "lab test at home" should also match "lab test done at home" — an exact
  // substring test fails normal English and pushes writers into stilted phrasing.
  const parts = needle.split(/\s+/).filter((w) => w.length > 2);
  return parts.length > 1 && parts.every((part) => haystack.includes(part));
}

/**
 * Run every check.
 *
 * `page` is what the editor holds right now:
 *   { title, description, slug, focusKeyword, bodyHtml, headings, links,
 *     images, heroAlt, canonical, noindex }
 *
 * Returns `{ score, checks, passed, failed }`. Each check is
 * `{ id, label, status: "pass" | "warn" | "error" | "hint", detail }` — the
 * detail is a sentence naming the actual number, because "title too long" is
 * not actionable and "title is 74 characters, aim for under 60" is.
 */
export function scorePage(page = {}) {
  const {
    title = "",
    description = "",
    slug = "",
    focusKeyword = "",
    bodyText = "",
    headings = [],
    links = { internal: [], external: [] },
    images = [],
    heroAlt = "",
    noindex = false,
  } = page;

  const checks = [];
  const add = (id, label, status, detail) => checks.push({ id, label, status, detail });

  const keyword = String(focusKeyword ?? "").trim();
  const bodyWords = words(bodyText).length;
  const firstParagraph = bodyText.slice(0, 300);

  /* ── Title ───────────────────────────────────────────────────────────── */
  const titleLength = title.trim().length;
  if (!titleLength) {
    add("title", "Title", "error", "There is no title. This is the single most important line on the page.");
  } else if (titleLength < 30) {
    add("title", "Title", "warn", `${titleLength} characters — short enough that Google may rewrite it. Aim for 30–60.`);
  } else if (titleLength > 60) {
    // The site's template appends " | MedicoBharat" (see src/app/layout.js), so
    // the real rendered title is ~15 characters longer than what is typed here.
    add("title", "Title", "warn", `${titleLength} characters, plus " | MedicoBharat" from the template — it will be cut off in results. Aim for under 60.`);
  } else {
    add("title", "Title", "pass", `${titleLength} characters — fits in a search result.`);
  }

  /* ── Description ─────────────────────────────────────────────────────── */
  const descLength = description.trim().length;
  if (!descLength) {
    add("description", "Meta description", "error", "Empty — Google will lift a sentence from the page instead, and it usually picks a worse one.");
  } else if (descLength < 70) {
    add("description", "Meta description", "warn", `${descLength} characters. Under about 70 wastes the space you are given.`);
  } else if (descLength > 160) {
    add("description", "Meta description", "warn", `${descLength} characters — the tail will be replaced with an ellipsis. Aim for 70–160.`);
  } else {
    add("description", "Meta description", "pass", `${descLength} characters.`);
  }

  /* ── Focus keyword ───────────────────────────────────────────────────── */
  if (!keyword) {
    add("focus", "Focus keyword", "hint", "Not set. Setting one turns on the placement checks below.");
  } else {
    add(
      "focus-title",
      "Keyword in title",
      containsKeyword(title, keyword) ? "pass" : "warn",
      containsKeyword(title, keyword)
        ? `"${keyword}" appears in the title.`
        : `"${keyword}" is not in the title — this is the placement that matters most.`
    );

    add(
      "focus-description",
      "Keyword in description",
      containsKeyword(description, keyword) ? "pass" : "hint",
      containsKeyword(description, keyword)
        ? "Present."
        : "Not in the description. It is bolded in results when it matches the query, which lifts click-through."
    );

    add(
      "focus-intro",
      "Keyword in the opening",
      containsKeyword(firstParagraph, keyword) ? "pass" : "warn",
      containsKeyword(firstParagraph, keyword)
        ? "Appears in the first paragraph."
        : "Not in the first ~50 words. A reader who does not see their question answered up front leaves."
    );

    const inHeading = headings.some((h) => containsKeyword(h.text, keyword));
    add(
      "focus-heading",
      "Keyword in a subheading",
      inHeading ? "pass" : "hint",
      inHeading ? "Present in at least one H2/H3." : "Not in any subheading."
    );

    add(
      "focus-slug",
      "Keyword in the URL",
      containsKeyword(slug.replace(/-/g, " "), keyword) ? "pass" : "hint",
      containsKeyword(slug.replace(/-/g, " "), keyword)
        ? "The URL contains it."
        : "The URL does not contain it. Worth fixing before publishing — never after."
    );
  }

  /* ── Structure ───────────────────────────────────────────────────────── */
  const h2s = headings.filter((h) => h.level === 2);
  if (!headings.length) {
    add("headings", "Headings", bodyWords > 300 ? "warn" : "hint", "No subheadings. A wall of text is what readers skip and what a featured snippet cannot be built from.");
  } else if (!h2s.length) {
    add("headings", "Headings", "warn", "There are H3s but no H2 — the outline starts at the wrong level.");
  } else {
    // A jump from H2 straight to H4 is the outline equivalent of a missing
    // step: a screen reader announces a level that has no parent.
    let skipped = false;
    let previous = 2;
    for (const h of headings) {
      if (h.level > previous + 1) skipped = true;
      previous = h.level;
    }
    add(
      "headings",
      "Headings",
      skipped ? "warn" : "pass",
      skipped
        ? `${headings.length} headings, but the outline skips a level.`
        : `${h2s.length} sections, properly nested.`
    );
  }

  /* ── Length ──────────────────────────────────────────────────────────── */
  if (bodyWords < 150) {
    add("length", "Length", "warn", `${bodyWords} words. Short enough that the page may read as thin — but do not pad it. Answer the question properly or merge it into another guide.`);
  } else {
    add("length", "Length", "pass", `${bodyWords} words, about a ${Math.max(1, Math.round(bodyWords / 200))} minute read.`);
  }

  /* ── Links ───────────────────────────────────────────────────────────── */
  add(
    "internal-links",
    "Internal links",
    links.internal.length ? "pass" : "warn",
    links.internal.length
      ? `${links.internal.length} link${links.internal.length === 1 ? "" : "s"} to other pages here.`
      : "None. An article with no internal links is a dead end for a reader and for a crawler."
  );

  if (links.external.length) {
    add("external-links", "Outbound links", "pass", `${links.external.length} — automatically marked nofollow noopener.`);
  }

  /* ── Images ──────────────────────────────────────────────────────────── */
  const missingAlt = images.filter((img) => !img.hasAlt).length;
  if (!images.length && !heroAlt) {
    add("images", "Images", "hint", "No images. Not required, but a diagram or a photo is what gets a guide into Google Images.");
  } else if (missingAlt) {
    add("images", "Image alt text", "error", `${missingAlt} image${missingAlt === 1 ? " has" : "s have"} no alt text — invisible to a screen reader and worth nothing in image search.`);
  } else {
    add("images", "Image alt text", "pass", "Every image describes itself.");
  }

  /* ── Slug ────────────────────────────────────────────────────────────── */
  const slugWords = slug.split("-").filter(Boolean);
  if (!slug) {
    add("slug", "URL", "error", "No URL slug.");
  } else if (slugWords.length > 6) {
    add("slug", "URL", "hint", `${slugWords.length} words. Shorter URLs get clicked and shared more.`);
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    add("slug", "URL", "error", "The slug has characters that do not belong in a URL.");
  } else {
    add("slug", "URL", "pass", `/${slug} — clean and readable.`);
  }

  /* ── Indexing ────────────────────────────────────────────────────────── */
  if (noindex) {
    add("robots", "Indexing", "warn", "This page is set to noindex — it will be excluded from the sitemap and can never appear in search.");
  }

  /*
   * The score.
   *
   * Starts at 100 and loses the weight of each failure, so a page with nothing
   * wrong is 100 and the number means "how much is left to fix" rather than
   * being a curve fitted to look encouraging. Hints cost nothing by design:
   * they are suggestions, and a checklist that punishes you for declining a
   * suggestion is one people learn to ignore entirely.
   */
  const lost = checks.reduce((sum, check) => sum + (WEIGHT[check.status] ?? 0), 0);
  const score = Math.max(0, Math.min(100, 100 - lost));

  return {
    score,
    checks,
    passed: checks.filter((c) => c.status === "pass").length,
    failed: checks.filter((c) => c.status === "error" || c.status === "warn").length,
  };
}

/** Colour band for the score dial — the same thresholds everywhere in the panel. */
export const scoreBand = (score) =>
  score >= 85 ? "good" : score >= 60 ? "ok" : "poor";

/**
 * How a result will most likely look in Google.
 *
 * Rendered as the preview above the editor's SEO panel. The title carries the
 * template suffix from src/app/layout.js because that is what is actually
 * published — a preview that shows the untemplated title is a preview of a
 * page that does not exist.
 */
export function serpPreview({ title, description, path }, site = "https://www.medicobharat.com") {
  const full = `${String(title ?? "").trim()} | MedicoBharat`;
  return {
    title: full.length > 62 ? `${full.slice(0, 61).trimEnd()}…` : full,
    url: `${site.replace(/^https?:\/\//, "")}${path ?? ""}`.replace(/\/$/, "") || site,
    description:
      String(description ?? "").length > 160
        ? `${description.slice(0, 159).trimEnd()}…`
        : String(description ?? ""),
  };
}
