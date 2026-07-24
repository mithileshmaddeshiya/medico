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
