/**
 * Fields every article repeats, written once.
 *
 * These used to be copy-pasted into all three Deoria posts in the old
 * src/data/blogData.js — including a `publisher.logo` pointing at
 * https://www.medicobharat.com/logo.png, a file that does not exist in
 * /public. A publisher logo that 404s invalidates the Article rich result it
 * is there to earn, so it now points at the same asset the organisation node
 * in src/lib/schema.js uses.
 *
 * Import these instead of retyping them. A new post should only carry what is
 * genuinely different about it.
 */
import { BRAND_LOGO } from "@/lib/schema";
import { SITE } from "@/lib/site";

/** Byline for every post. Articles here are editorial, not personally authored. */
export const BLOG_AUTHOR = {
  name: "MedicoBharat Editorial Team",
  url: SITE,
};

/**
 * Publisher node for BlogPosting.
 *
 * The logo is IMPORTED from src/lib/schema.js, not retyped. Both files used to
 * spell out `${SITE}/navbar/navbg.webp` — a file that has never existed in
 * /public — so the publisher logo on both articles 404'd, which is on its own
 * enough for Google to withhold the Article rich result. Exactly the bug the
 * comment at the top of this file describes, repeated.
 *
 * Sharing the constant means the same company can never be described with two
 * different logos on the same domain, and there is now only one path to check
 * if it ever moves again.
 */
export const BLOG_PUBLISHER = {
  name: "MedicoBharat",
  logo: BRAND_LOGO,
};

/**
 * The indexing rules an article ships with.
 *
 * `max-image-preview: large` is the one that matters here: without it Google
 * shows a thumbnail instead of a full-width image in Discover and mobile
 * results. Set `robots: { index: false }` on a post to hold it back — the
 * sitemap in src/app/sitemap/blogs.xml/route.js drops it automatically rather
 * than submitting a URL that can never be indexed.
 */
export const INDEXABLE = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

/** The canonical for a post. Always absolute, always www — see src/lib/site.js. */
export const canonicalFor = (category, city) =>
  `${SITE}/blogs/${category}/${city}`;
