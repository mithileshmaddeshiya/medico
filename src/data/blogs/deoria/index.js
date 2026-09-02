/**
 * Deoria's articles, in the order they should appear in a listing.
 *
 * ── ADDING THE NEXT DEORIA BLOG ──────────────────────────────────────────
 * 1. Copy lab-test-in-deoria.js to a new file in this folder, named after the
 *    URL you want: /blogs/<category>/deoria → <category>.js.
 * 2. Change `category` (it becomes the URL segment and must be unique for this
 *    city), the title, description, keywords, sections and faqs.
 * 3. Import it below AND add it to the array. BOTH steps — see the warning.
 *
 * The route, the sitemap entry, the OG share card, the BlogPosting + FAQ +
 * Breadcrumb schema and the related-article cards all pick it up on their own.
 *
 * ⚠ A FILE THAT IS NOT IN THIS ARRAY DOES NOT EXIST. It compiles, it lints, it
 * sits in git looking finished — and its URL 404s, it is in no sitemap, and
 * nothing links it. diabetes-thyroid-test-in-deoria.js was committed in 93f7efd
 * and left out of this list; it was dead for the whole time it looked done, and
 * every sibling that linked /blogs/full-body-checkup/deoria was pointing at a
 * 404 for the same reason. Writing the post is the easy half.
 *
 * Two posts in this folder may not share a `category`: the pair (category,
 * city) is the URL, so a duplicate would make one of them unreachable. The
 * registry in ../index.js throws at import time if that ever happens.
 *
 * ── HOW THE EIGHT DIVIDE THE GROUND ──────────────────────────────────────
 * They only survive together because each answers a question the others do
 * not. Before adding a ninth, check it is not one of these:
 *
 *   /lab-test/deoria                       → "book kahan se" — form, rate, menu
 *   /blogs/lab-test/deoria                 → "kaun sa test kab" (clinical)
 *   /blogs/pathology-lab/deoria            → "sample dene kahan" (geography)
 *   /blogs/home-sample-collection/deoria   → "ghar par kaise hota hai" (process)
 *   /blogs/full-body-checkup/deoria        → "kaun sa package, kitne ka"
 *   /blogs/diabetes-thyroid-test/deoria    → sugar, thyroid, lipid ka form
 *   /blogs/dengue-typhoid-test/deoria      → bukhar — kis din kaun sa test
 *   /blogs/liver-kidney-test/deoria        → LFT aur KFT
 *   /blogs/vitamin-b12-d-test/deoria       → thakan, khoon ki kami, vitamin
 *
 * Every one of them keeps the same two rules: NOT ONE PRICE (rates live only in
 * src/data/lab/content/deoria.js, linked as #lab-test-price-deoria), and no
 * claim beyond the five the business confirms — free home collection, a trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI
 * on collection. No NABL, no "certified", no "sabse sasta", no walk-in counter
 * in Deoria, and no X-ray/ultrasound/ECG — those are stated as NOT ours
 * wherever a reader might assume otherwise.
 */
import { dengueTyphoidDeoria } from "./dengue-typhoid-test-in-deoria";
import { diabetesThyroidDeoria } from "./diabetes-thyroid-test-in-deoria";
import { fullBodyCheckupDeoria } from "./full-body-checkup-in-deoria";
import { homeSampleCollectionDeoria } from "./home-sample-collection-in-deoria";
import { labTestDeoria } from "./lab-test-in-deoria";
import { liverKidneyDeoria } from "./liver-kidney-test-in-deoria";
import { pathologyLabDeoria } from "./pathology-lab-in-deoria";
import { vitaminB12DDeoria } from "./vitamin-b12-d-test-in-deoria";

/* Ordered by what a reader needs first, not by publish date — the listing shows
   them in this order, and "kaun sa test kab" is the question almost everyone
   arrives with. The three service-shaped guides come next (where, how, which
   package), and the four test-specific ones last, because a reader reaches
   those already holding a prescription. */
export const deoriaBlogs = [
  labTestDeoria,
  // Second on purpose: the clinical guide ("kaun sa test kab") is the one a
  // reader needs first. This one answers "sample dene kahan jaana padega" —
  // the locality and "diagnostic centre near me" lane, which is a different
  // question and therefore does not compete with either the guide above or
  // the service page at /lab-test/deoria.
  pathologyLabDeoria,
  // Where → how. The one above owns the map; this one owns the fifteen minutes
  // at the door, and the readers for whom home collection is the only way the
  // test happens at all — bedridden, elderly, children, women.
  homeSampleCollectionDeoria,
  fullBodyCheckupDeoria,
  diabetesThyroidDeoria,
  dengueTyphoidDeoria,
  liverKidneyDeoria,
  vitaminB12DDeoria,
];
