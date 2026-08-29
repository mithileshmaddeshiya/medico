/**
 * The one place the site's own URL is written down.
 *
 * It used to be hardcoded in eleven files, and four of them (about, contact,
 * privacy, terms) had drifted to the non-www domain. To Google those are two
 * different sites, so those pages were declaring a canonical that immediately
 * 301s somewhere else — a contradictory signal that costs crawl budget.
 *
 * Import SITE (or the url() helper) everywhere. Never type the domain again.
 */
export const SITE = "https://www.medicobharat.com";

/** Absolute URL for a site-relative path: url("/about") → https://…/about */
export const url = (path = "/") =>
  `${SITE}${path.startsWith("/") ? path : `/${path}`}`;

/** Phone number used across the site, in the one format the markup expects. */
export const SITE_PHONE = "+91 989-123-3525";

/**
 * The same number in E.164 — the only form schema.org, `tel:` links and
 * WhatsApp deep links should ever carry.
 *
 * ── WHY IT IS DERIVED AND NOT TYPED ───────────────────────────────────────
 * src/lib/schema.js declared its own `BRAND_PHONE = "+916392108234"` — a
 * completely different number from the +91 989-123-3525 that the footer, the
 * booking form, the contact page, the WhatsApp handoff and every city page's
 * DiagnosticLab node all use. So the Organization node that every other node
 * on the site resolves to published one number while the visible site
 * published another.
 *
 * That is the precise failure the comment at the top of the contact page warns
 * about. Local ranking is built on NAP consistency — Name, Address, Phone
 * appearing identically across a site, its schema and its Business Profile —
 * and two numbers on one domain is exactly the signal that stops a business
 * being matched to a single entity. On the brand node it is the worst possible
 * place for it.
 *
 * Deriving it means the two can never disagree again. Change SITE_PHONE and
 * every representation follows.
 *
 * ⚠ If +91 63921 08234 is a real second line, it does NOT belong here. Put it
 * on the Organization's `contactPoint` as an additional entry with its own
 * `contactType`, and leave the primary number alone.
 */
export const SITE_PHONE_E164 = `+${SITE_PHONE.replace(/\D/g, "")}`;
