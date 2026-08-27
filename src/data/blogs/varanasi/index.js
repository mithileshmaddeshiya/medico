/**
 * Varanasi's articles, in the order they should appear in a listing.
 *
 * ── ADDING THE NEXT VARANASI BLOG ────────────────────────────────────────
 * 1. Copy lab-test-in-varanasi.js to a new file in this folder, named after
 *    the URL you want: /blogs/<category>/varanasi → <category>.js.
 * 2. Change `category` (it becomes the URL segment and must be unique for
 *    this city), the title, description, keywords, sections and faqs.
 * 3. Import it below and add it to the array.
 *
 * That is the whole job. The route, the sitemap entry, the OG share card, the
 * BlogPosting + FAQ + Breadcrumb schema, the related-article cards on the
 * other Varanasi posts and the all-cities link grid all pick it up on their
 * own — nothing else in the codebase needs editing.
 *
 * Two posts in this folder may not share a `category`: the pair (category,
 * city) is the URL, so a duplicate would make one of them unreachable. The
 * registry in ../index.js throws at import time if that ever happens.
 */
import { fullBodyCheckupVaranasi } from "./full-body-checkup-in-varanasi";
import { labTestVaranasi } from "./lab-test-in-varanasi";
import { pathologyLabVaranasi } from "./pathology-lab-in-varanasi";

export const varanasiBlogs = [
  labTestVaranasi,
  fullBodyCheckupVaranasi,
  // Third, and last in the list on purpose: it is the trust/brand page, the one
  // a reader opens after the two clinical guides rather than before them.
  pathologyLabVaranasi,
];
