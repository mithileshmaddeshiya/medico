/**
 * Deoria's articles, in the order they should appear in a listing.
 *
 * ── ADDING THE NEXT DEORIA BLOG ──────────────────────────────────────────
 * 1. Copy lab-test-in-deoria.js to a new file in this folder, named after the
 *    URL you want: /blogs/<category>/deoria → <category>.js.
 * 2. Change `category` (it becomes the URL segment and must be unique for this
 *    city), the title, description, keywords, sections and faqs.
 * 3. Import it below and add it to the array.
 *
 * The route, the sitemap entry, the OG share card, the BlogPosting + FAQ +
 * Breadcrumb schema and the related-article cards all pick it up on their own.
 *
 * Two posts in this folder may not share a `category`: the pair (category,
 * city) is the URL, so a duplicate would make one of them unreachable. The
 * registry in ../index.js throws at import time if that ever happens.
 *
 * THE OBVIOUS NEXT ONE is /blogs/full-body-checkup/deoria. It is not here yet
 * on purpose: the Varanasi article of that name is written to be read from any
 * district and this guide links it, so a Deoria copy would have to earn its
 * place with genuinely local material rather than a search-and-replace of the
 * city name — which is how a site ends up with seven near-identical pages.
 */
import { labTestDeoria } from "./lab-test-in-deoria";
import { pathologyLabDeoria } from "./pathology-lab-in-deoria";

export const deoriaBlogs = [
  labTestDeoria,
  // Second on purpose: the clinical guide ("kaun sa test kab") is the one a
  // reader needs first. This one answers "sample dene kahan jaana padega" —
  // the locality and "diagnostic centre near me" lane, which is a different
  // question and therefore does not compete with either the guide above or
  // the service page at /lab-test/deoria.
  pathologyLabDeoria,
];
