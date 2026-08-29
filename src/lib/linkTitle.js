/**
 * A human description of where a link goes, derived from its href.
 *
 * ── WHY THIS EXISTS ───────────────────────────────────────────────────────
 * An SEO extension flagged "34 links without TITLE" and the `title` attribute
 * was added across the lab section in response. Two things are worth writing
 * down so the next person does not have to re-derive them:
 *
 *   1. `title` is NOT a ranking signal. Google ranks a link on its anchor text
 *      and surrounding context; the attribute has no consumer in search. It is
 *      a mouse-hover tooltip, and this audience is overwhelmingly on phones,
 *      where it never renders at all. Nothing here will move a position.
 *
 *   2. Because of that, the ONLY way these earn their bytes is by telling a
 *      desktop reader something the visible text does not already say. A title
 *      that repeats its own anchor text is pure duplication — some screen
 *      readers announce both, so "Deoria" becomes "Deoria, Deoria".
 *
 * So titles are DERIVED from the destination rather than typed per link: a
 * route knows what it contains, the anchor text usually does not repeat it, and
 * a derived string cannot drift out of sync with the page it describes the way
 * 34 hand-typed strings would.
 *
 * ⚠ Do NOT stuff keywords in here. It is a tooltip, it does not rank, and a
 * page whose every link tooltip is a keyword string is a spam signal, not an
 * optimisation. Describe the destination in plain words and stop.
 */

/** "bhatpar-rani" → "Bhatpar Rani". Only for slugs we render into prose. */
const titleCase = (slug) =>
  String(slug ?? "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/* Static routes, described once. */
const STATIC_TITLES = {
  "/": "MedicoBharat home — lab test rate list and booking",
  "/about": "About MedicoBharat — who we are and where we collect samples",
  "/contact": "Contact MedicoBharat — phone number and booking help",
  "/privacy": "How MedicoBharat handles your personal and health data",
  "/terms": "Terms of service for MedicoBharat lab test bookings",
  "/blogs": "Health guides — which test to take, fasting rules and reading a report",
  "/lab-test": "Lab test rate list and home collection in every city we serve",
};

/* Blog categories, keyed by the first path segment under /blogs. */
const BLOG_TITLES = {
  "lab-test": (city) => `Guide: which lab test to take and when, in ${city}`,
  "full-body-checkup": (city) => `Guide: what a full body checkup should include in ${city}`,
  "pathology-lab": (city) => `Guide: how to choose a reliable pathology lab in ${city}`,
};

/**
 * `href` → tooltip, or undefined when we have nothing useful to say.
 *
 * Returning undefined rather than a vague string is deliberate: React omits the
 * attribute entirely, and no tooltip is better than "Read more".
 */
export function linkTitle(href) {
  const raw = String(href ?? "").trim();
  if (!raw) return undefined;

  // Drop the hash so /blogs/lab-test/varanasi#fasting-aur-taiyari still matches
  // its route, then describe the section it lands on.
  const [path, hash] = raw.split("#");

  // A bare in-page anchor — the visible text is already the heading, so the
  // only thing left to add is that the link moves you rather than navigating.
  if (!path && hash) return "Jump to this section";

  const clean = path.replace(/\/+$/, "") || "/";

  if (STATIC_TITLES[clean]) return STATIC_TITLES[clean];

  const parts = clean.split("/").filter(Boolean);

  // /lab-test/<city>
  if (parts[0] === "lab-test" && parts[1]) {
    return `Lab test and blood test at home in ${titleCase(parts[1])} — free sample collection`;
  }

  // /blogs/<category>/<city>
  if (parts[0] === "blogs" && parts[1] && parts[2]) {
    const build = BLOG_TITLES[parts[1]];
    if (build) return build(titleCase(parts[2]));
    return `Guide for ${titleCase(parts[2])}`;
  }

  return undefined;
}
