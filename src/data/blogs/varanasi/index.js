/**
 * Varanasi's articles, in the order they should appear in a listing.
 *
 * ── ADDING THE NEXT VARANASI BLOG ────────────────────────────────────────
 * 1. Copy lab-test-in-varanasi.js to a new file in this folder, named after
 *    the URL you want: /blogs/<category>/varanasi → <category>.js.
 * 2. Change `category` (it becomes the URL segment and must be unique for
 *    this city), the title, description, keywords, sections and faqs.
 * 3. Import it below AND add it to the array. BOTH steps — see the warning.
 *
 * The route, the sitemap entry, the OG share card, the BlogPosting + FAQ +
 * Breadcrumb schema, the related-article cards on the other Varanasi posts and
 * the all-cities link grid all pick it up on their own — nothing else in the
 * codebase needs editing.
 *
 * ⚠ A FILE THAT IS NOT IN THIS ARRAY DOES NOT EXIST. It compiles, it lints, it
 * sits in git looking finished — and its URL 404s, it is in no sitemap, and
 * nothing links it. That is exactly what happened to Deoria's
 * diabetes-thyroid-test post (committed in 93f7efd, left out of the list): it
 * was dead for the whole time it looked done, and every sibling linking to it
 * pointed at a 404. Writing the post is the easy half.
 *
 * Two posts in this folder may not share a `category`: the pair (category,
 * city) is the URL, so a duplicate would make one of them unreachable. The
 * registry in ../index.js throws at import time if that ever happens.
 *
 * ── HOW THE SEVEN DIVIDE THE GROUND ──────────────────────────────────────
 * They only survive together because each answers a question the others do
 * not. Before adding an eighth, check it is not one of these:
 *
 *   /lab-test/varanasi                      → "book kahan se" — form, rate, menu
 *   /blogs/lab-test/varanasi                → "kaun sa test kab" (clinical)
 *   /blogs/pathology-lab/varanasi           → "kis lab par bharosa karun"
 *   /blogs/home-sample-collection/varanasi  → "ghar par kaise hota hai" + ilaaka
 *   /blogs/full-body-checkup/varanasi       → "kaun sa package, kya hona chahiye"
 *   /blogs/diabetes-thyroid-test/varanasi   → sugar, thyroid, lipid
 *   /blogs/dengue-typhoid-test/varanasi     → bukhar — kis din kaun sa test, CBC
 *   /blogs/liver-kidney-test/varanasi       → LFT aur KFT
 *
 * The obvious next one is vitamin B12 aur D, which Deoria already has at
 * /blogs/vitamin-b12-d-test/deoria and Varanasi does not.
 *
 * Every one of them keeps the same two rules: NOT ONE PRICE (rates live only in
 * src/data/lab/content/varanasi.js, linked as #lab-test-price-varanasi), and no
 * claim beyond the five the business confirms — free home collection, a trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI
 * on collection. No NABL, no "certified", no "sabse sasta", and no
 * X-ray/ultrasound/ECG — those are stated as NOT ours wherever a reader might
 * otherwise assume they are.
 */
import { dengueTyphoidVaranasi } from "./dengue-typhoid-test-in-varanasi";
import { diabetesThyroidVaranasi } from "./diabetes-thyroid-test-in-varanasi";
import { fullBodyCheckupVaranasi } from "./full-body-checkup-in-varanasi";
import { homeSampleCollectionVaranasi } from "./home-sample-collection-in-varanasi";
import { labTestVaranasi } from "./lab-test-in-varanasi";
import { liverKidneyVaranasi } from "./liver-kidney-test-in-varanasi";
import { pathologyLabVaranasi } from "./pathology-lab-in-varanasi";

/* Ordered by what a reader needs first, not by publish date — the listing shows
   them in this order, and "kaun sa test kab" is the question almost everyone
   arrives with. The service-shaped guides come next (trust, how, which
   package), and the three test-specific ones last, because a reader reaches
   those already holding a prescription. Same order as Deoria's list, for the
   same reason. */
export const varanasiBlogs = [
  labTestVaranasi,
  // Second on purpose: the trust/brand page, the one a reader opens after the
  // clinical guide rather than before it. It also owns the "MedicoBharat
  // Varanasi" brand query, which no other page answers directly.
  pathologyLabVaranasi,
  // Trust → process. This one owns the fifteen minutes at the door, the city's
  // locality coverage, and the readers for whom home collection is the only way
  // the test happens at all — bedridden, elderly, children, women.
  homeSampleCollectionVaranasi,
  fullBodyCheckupVaranasi,
  diabetesThyroidVaranasi,
  dengueTyphoidVaranasi,
  liverKidneyVaranasi,
];
