/**
 * Local source of truth for the lab-test section.
 *
 * Works exactly like src/data/medicine/cityData.js does for the medicine pages: the
 * content lives here, in the repo, and is read straight off local data — there
 * is no Firestore round trip any more. src/lib/labCities.js is now a thin
 * reader over the `LAB_CITIES` list this file builds.
 *
 * NOTE HOW SHORT AN ENTRY IS. Only the facts that differ between cities live
 * here; every word on the page — hero, tests, prices, FAQs, SEO copy, CTA —
 * comes from src/data/lab/defaults.js with the city's name filled in. That is
 * what keeps adding a city cheap.
 *
 * ── Adding a city ───────────────────────────────────────────────────────
 * Add an object to LAB_CITY_SEED below with:
 *
 *   slug        (string)   URL segment: /lab-test/<slug>. Defaults to name.
 *   name        (string)   Display name used in every heading and sentence.
 *   state       (string)   Footer address line and the local-business schema.
 *   areas       (array)    Localities covered; rendered as text (SEO), offered
 *                          in the booking form, and listed in areaServed.
 *   areaContext (string)   Optional; the place name each `areas` entry is
 *                          QUALIFIED BY in the schema, which publishes them as
 *                          "<area>, <areaContext>". Defaults to `name`, which
 *                          is right whenever the city IS the district — Deoria's
 *                          "Barhaj, Deoria" is how that address is written.
 *                          Set it when the city is a TOWN and the areas are
 *                          district towns rather than its own mohallas:
 *                          Khalilabad sets "Sant Kabir Nagar", so the markup
 *                          says "Mehdawal, Sant Kabir Nagar" and not "Mehdawal,
 *                          Khalilabad" — which names a place that does not
 *                          exist. Structured data that invents a place is worse
 *                          than structured data that omits one.
 *   postalCode  (string)   Optional; local-business schema only.
 *   geo         { lat, lng } Optional; town-centre coordinates, schema only.
 *                          Use the town centre — this is a service area, not a
 *                          walk-in address, so a precise pin would be a lie.
 *   gbp         (string)   Optional; THIS city's own Google Business Profile as
 *                          a full https://www.google.com/maps/place/… URL. It
 *                          becomes `hasMap` and joins `sameAs` on the city's
 *                          DiagnosticLab node — our half of the handshake that
 *                          ties the page to a Google-verified record of the
 *                          business. See GBP_MAP_URL in src/lib/schema.js for
 *                          why this is the highest-value string on the page,
 *                          and never guess one: a wrong Maps link points the
 *                          markup at somebody else's lab.
 *   updated     (string)   Optional; ISO date the copy was last reviewed. Feeds
 *                          `dateModified` in the page schema. Bump it when you
 *                          actually rewrite the copy — never on a deploy.
 *   order       (number)   Optional; lower sorts first, else sorted by name.
 *   published   (boolean)  Optional; set false to hide without deleting.
 *
 * That is enough for a complete page. The route, footer cross-links, booking
 * dropdown, sitemap, metadata and schema all pick it up on their own.
 *
 * ── Overriding the copy for one city ────────────────────────────────────
 * Any of these optional fields replaces the generated default for that city
 * only. Leave a field out and the default is used.
 *
 *   title, description            (string)  metadata
 *   keywords                      (array of string)
 *   hero                          { h1, image, imageAlt, formTitle }
 *   trustStrip                    [{ icon, title, highlight, sub }]
 *   tests                         [{ id, icon, tint, name, sub, tags,
 *                                    fasting, price, mrp, params }]
 *   filters                       [{ key, label, heading }]
 *   faqs                          [{ q, a }]
 *   cta                           { headingLead, headingAccent, proof: [] }
 *   content                       [{ id, h, p: [] }]
 *   howTo                         { heading, intro, steps: [{ icon, title,
 *                                   text }] }  the numbered "How to book"
 *                                   row under the guide. Setting `steps`
 *                                   replaces all five.
 *   callBanner                    { heading, buttonText }
 *   footer                        { tagline, popularTests: [], email,
 *                                   phone, hours }
 *   relatedLinks                  { heading, intro, groups: [{ title,
 *                                   links: [{ href, label, sub }] }] }
 *                                 In-body internal links; omitted → no block.
 *
 * `icon` values are strings, not components — see src/data/lab/defaults.js for
 * the names each registry understands.
 */
import { azamgarhContent, azamgarhFaqs } from "./content/azamgarh";
import { balliaContent, balliaFaqs } from "./content/ballia";
import { deoriaContent, deoriaFaqs } from "./content/deoria";
import { ghazipurContent, ghazipurFaqs } from "./content/ghazipur";
import { gopalganjContent, gopalganjFaqs } from "./content/gopalganj";
import { gorakhpurContent, gorakhpurFaqs } from "./content/gorakhpur";
import { khalilabadContent, khalilabadFaqs } from "./content/khalilabad";
import { kushinagarContent, kushinagarFaqs } from "./content/kushinagar";
import { lucknowContent, lucknowFaqs } from "./content/lucknow";
import { maharajganjContent, maharajganjFaqs } from "./content/maharajganj";
import { mauContent, mauFaqs } from "./content/mau";
import { padraunaContent, padraunaFaqs } from "./content/padrauna";
import { salempurContent, salempurFaqs } from "./content/salempur";
import { siwanContent, siwanFaqs } from "./content/siwan";
import { varanasiContent } from "./content/varanasi";
import {
  CITY_ALIASES,
  defaultCallBanner,
  defaultContent,
  defaultCta,
  defaultDescription,
  defaultFaqs,
  defaultFilters,
  defaultFooter,
  defaultHero,
  defaultHowTo,
  defaultKeywords,
  defaultTests,
  defaultTitle,
  defaultTrustStrip,
  varanasiFaqs,
} from "./defaults";

/* ── The cities we serve ──────────────────────────────────────────────────
   Just the facts that differ per city. Everything else is filled in from
   src/data/lab/defaults.js when LAB_CITIES is built at the bottom of this file. */
const LAB_CITY_SEED = [
  {
    slug: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    areas: ["Sarnath", "Ramnagar", "Bhelupur", "Lanka", "Sigra", "Cantt"],
    postalCode: "221001",
    geo: { lat: 25.3176, lng: 82.9739 },
    updated: "2026-07-30",
    order: 1,
    published: true,

    /* 45 characters; the root layout appends " | MedicoBharat" (template in
       src/app/layout.js), so Google renders 60. That is the longest title in
       the section and it sits exactly on the ~60 it will show — deliberate,
       because the city's name is long and both halves earn their place, but do
       not add a word to it.

       This city inherited defaultTitle() until the section's titles were split
       apart, and the default is "Lab Test in <city> — Blood Test at Home" —
       which is exactly the pairing Deoria keeps. Two of our pages would have
       carried the same formula again, so the flagship city now states its own:
       the exact phrase first, then the promise that separates this service from
       a walk-in lab. See the block comment above defaultTitle in
       src/data/lab/defaults.js for the one-pairing-per-city rule. */
    title: "Lab Test in Varanasi — Free Sample Collection",
    // This copy used to be defaultContent() — the fallback every city inherited
    // — even though every fact in it is Varanasi's. It is unchanged, just moved
    // under the city it was actually written about. See labContent/varanasi.js.
    /* Closing call strip. The heading IS one tracked search phrase, title
       cased — no tail, no second keyword. See defaultCallBanner in
       src/data/lab/defaults.js for which phrase each city takes and why. */
    callBanner: {
      heading: "Lab Test at Home in Varanasi",
    },

    /* Same rule as the strip above — ONE tracked phrase, and a different one
       from the strip's, so the page uses two of its phrases rather than one
       twice. "blood sample collection from home varanasi" — the strip above took
       "lab test at home in varanasi".
       `intro` and the five steps come from defaultHowTo and are unchanged:
       they describe a procedure, and a procedure is the same in every town. */
    howTo: { heading: "How to book blood sample collection from home in Varanasi" },

    content: varanasiContent,

    /* Varanasi was the ONLY city still running defaultFaqs. varanasiFaqs has
       existed in src/data/lab/defaults.js since the section was built — its own
       doc comment says "render this in the same page as the LabContent block" —
       but nothing ever imported it, so the flagship city answered its questions
       with the generic template while the other nine answered with their own. */
    faqs: varanasiFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       The other half of the link between this page and the Varanasi guide at
       /blogs/lab-test/varanasi. The guide already links here in four places;
       without this block the link ran one way only, and a one-way link tells a
       crawler the two pages are related but tells it nothing about which is the
       page to rank for "Varanasi me lab test".

       The split is deliberate and the anchors say so: this page is the service
       (book, price, menu), the guide is the reading (which test, when, how to
       read the report). Every href is a route that exists — the guides in
       content/blogs/varanasi/, the other cities in the seed below, and the
       home page. The medicine-delivery links that used to sit in this block
       are gone with the section; do not add them back. */
    relatedLinks: {
      heading: "Test Chunne Me Madad Chahiye?",
      intro:
        "Is page par booking aur price hai. Kaun sa test kab karana chahiye, fasting ke niyam aur report padhne ka tarika — wo guide me likha hai.",
      groups: [
        {
          title: "Varanasi Ke Liye Guide",
          links: [
            {
              href: "/blogs/pathology-lab/varanasi",
              label: "Varanasi me pathology lab kaise chunein",
              sub: "Poochhne layak paanch sawaal — aur hum kya daawa nahi karte",
            },
            {
              href: "/blogs/lab-test/varanasi",
              label: "Varanasi me lab test — kaun sa test kab karayein",
              sub: "Symptom, umar aur mausam ke hisaab se poori guide",
            },
            {
              href: "/blogs/full-body-checkup/varanasi",
              label: "Varanasi me full body checkup — kya karayein",
              sub: "Package me kya hona chahiye, \"80+ parameters\" ka sach",
            },
            {
              href: "/blogs/home-sample-collection/varanasi",
              label: "Varanasi me ghar par blood test — poori prakriya",
              sub: "Kis ilaake me aate hain, aur darwaze par kya hota hai",
            },
            {
              href: "/blogs/diabetes-thyroid-test/varanasi",
              label: "Varanasi me sugar, thyroid aur lipid test",
              sub: "Fasting, PP ya HbA1c — aur thyroid ka daam kis par tay hai",
            },
            {
              href: "/blogs/dengue-typhoid-test/varanasi",
              label: "Varanasi me dengue aur typhoid test — kis din",
              sub: "NS1, Widal, malaria aur platelet count ka matlab",
            },
            {
              href: "/blogs/liver-kidney-test/varanasi",
              label: "Varanasi me LFT aur KFT — kab karayein",
              sub: "Peelapan, sugar aur BP wale saal me ek baar",
            },
            {
              href: "/blogs/lab-test/varanasi#fasting-aur-taiyari",
              label: "Blood test se pehle fasting aur taiyari",
            },
            {
              href: "/blogs/lab-test/varanasi#report-kaise-padhein",
              label: "Report aa gayi — ab ise kaise padhein",
            },
          ],
        },
        {
          title: "Doosre Sheher",
          links: [
            {
              href: "/lab-test/gorakhpur",
              label: "Gorakhpur me lab test",
              sub: "Purvanchal ka referral hub — OPD se pehle report",
            },
            // Rajdhani, kareeb 320 km paschim. Is sheher se log SGPGI aur KGMU
            // ke liye wahan jaate hain, aur Lucknow ka page is page par wapas
            // aata hai — link dono taraf, warna ek naya URL crawl hi nahi hota.
            {
              href: "/lab-test/lucknow",
              label: "Lucknow me lab test",
              sub: "Rajdhani — bade sansthan me dikhana ho to report pehle taiyaar",
            },
            // Azamgarh se ilaaj ke liye Varanasi aana aam hai, isliye link dono
            // taraf hai — Azamgarh ka page bhi is page par aata hai. Ek naya URL
            // sitemap se nahi, links se crawl hota hai.
            {
              href: "/lab-test/azamgarh",
              label: "Azamgarh me lab test",
              sub: "Mandal mukhyalaya — poore jile me home collection",
            },
            {
              href: "/lab-test/deoria",
              label: "Deoria me lab test",
              sub: "Gorakhpur ka safar bachane wala option",
            },
            {
              href: "/lab-test/ballia",
              label: "Ballia me lab test",
              sub: "UP ka aakhiri jila — imaging ke liye yahan aana padta hai",
            },
            // Ghazipur ka page is page ko naam se leta hai ("Varanasi kareeb
            // 80 km"), aur ye link uska jawab hai. Ek naya URL sitemap se nahi,
            // links se crawl hota hai — aur ek taraf ka link crawler ko sirf
            // itna batata hai ki do page jude hain, ye nahi ki dono asli hain.
            {
              href: "/lab-test/ghazipur",
              label: "Ghazipur me lab test",
              sub: "Kareeb 80 km — Ganga kinare ka padosi jila",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "deoria",
    name: "Deoria",
    state: "Uttar Pradesh",
    /* Deoria Sadar plus the district towns collection actually reaches. These
       are not decorative: they render in the footer, fill the booking form's
       dropdown, become `areaServed` in the schema, and are what a "<town> me
       blood test" search matches on. Lar and Bhatni were added because the
       medicine section already serves both, so the town is genuinely covered
       and the lab page can honestly name it. Do NOT pad this list with towns
       nobody visits — an areaServed we cannot serve is a lie in schema form. */
    areas: [
      "Deoria Sadar",
      "Rudrapur",
      "Barhaj",
      "Salempur",
      "Bhatpar Rani",
      "Gauri Bazar",
      "Baitalpur",
      "Lar",
      "Bhatni",
    ],
    postalCode: "274001",
    /* Deoria town centre. Deliberately the CENTRE and not a street pin: there is
       no walk-in counter here — this is a home-collection service area, and a
       precise address in the schema would be a claim we cannot keep. Google
       reads `geo` on a service-area business as "roughly here", which is true. */
    geo: { lat: 26.5024, lng: 83.7791 },
    updated: "2026-07-30",
    order: 2,
    published: true,

    /* Deoria carries its own copy rather than the generated defaults, because a
       page that is another city's page with the noun swapped does not get
       indexed — Google reads it as a doorway page. `content` and `faqs` are the
       two blocks that decide that, so both are hand-written here, and the title
       and description are set so the search result itself does not read as a
       duplicate of Varanasi's. See src/data/lab/content/deoria.js. */

    // 39 characters, and it has to stay short: the root layout appends
    // " | MedicoBharat" (template in src/app/layout.js), so what Google
    // actually renders is 54 — just inside the ~60 it will show. The previous
    // title was 63 BEFORE the suffix and got cut at "…Free Sample Coll…", so
    // the strongest phrase on it was never seen. Primary keyword first, then
    // the second-biggest query on this page; both survive the truncation.
    title: "Lab Test in Deoria — Blood Test at Home",

    // ~150 characters, so it renders whole on both desktop and mobile. The old
    // one ran past 230 and lost everything after "…Rudrapur, Barhaj". Written
    // in Hinglish deliberately: the page is Hinglish, the searcher here is, and
    // a snippet in the reader's own register wins the click. The English terms
    // that must match ("lab test", "blood test", "full body checkup") are all
    // still in it.
    description:
      "Deoria me lab test aur blood test ghar baithe book karein — CBC, thyroid, sugar aur full body checkup. Free home sample collection, report 24 ghante me.",

    /* ── THE H1 IS VISIBLE NOW — KEEP IT SHORT ────────────────────────────
       It used to be `sr-only`, and every city's override was written on that
       basis: "it costs a reader nothing", so each one carried every keyword
       variant at once. Deoria's ran to 86 characters, Gorakhpur's to 109.

       The hero renders the h1 as real text now (see LabHero.jsx), because a
       headline burned into a shared banner image is unreadable to a crawler and
       identical on all six pages. A 109-character heading that nobody saw is
       fine; the same heading at the top of a phone screen is a wall of text,
       and a heading stuffed with comma-separated variants is one of the oldest
       spam patterns there is.

       So the h1 opens with the phrase people actually type — "Lab Test in
       <city>" — and stops. The secondary terms ("pathology lab", "full body
       checkup", "blood test") moved into `h1Sub`, where they sit in a real
       sentence. Terms in a sentence a reader reads are worth more than terms
       crammed into a heading, and the sub-line was going to be written anyway.

       Budget: h1 under ~60 characters, h1Sub under ~140. */
    hero: {
      h1: "Lab Test in Deoria — Blood Test Ghar Baithe",
      h1Sub:
        "Pathology lab ke saare test aur full body checkup — Deoria me free home sample collection, report 24 ghante me WhatsApp par.",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out instead of taking defaultKeywords(), which only produces
       "<template> in Deoria" nine times over plus one line per area. That
       misses the two things Deoria traffic actually is: test-wise long-tail
       ("CBC test price in Deoria"), which converts because the searcher has
       already decided what they want, and Devanagari, which is how a large
       share of this district types.

       Ordered strongest first. `keywords` is a weak-to-zero ranking signal on
       its own — the reason to keep this list honest and specific is that it is
       the checklist the page's headings, FAQs and prose are written against.
       Every term below appears in the visible copy; a keyword that appears
       ONLY here is the kind that gets a page filtered, not ranked. */
    keywords: [
      "Lab Test at Home in Deoria",
      "Blood Test at Home in Deoria",
      "Home Sample Collection in Deoria",
      "Blood Test in Deoria",
      "Diagnostic Lab in Deoria",
      "Pathology Lab in Deoria",
      "Full Body Checkup in Deoria",
      "Full Body Checkup at Home in Deoria",
      "Home Collection Lab in Deoria",
      "Lab Test Near Me in Deoria"
    ],

    /* Closing call strip. The heading IS one tracked search phrase, title
       cased — no tail, no second keyword. See defaultCallBanner in
       src/data/lab/defaults.js for which phrase each city takes and why. */
    callBanner: {
      heading: "Blood Test at Home in Deoria",
    },

    /* Same rule as the strip above — ONE tracked phrase, and a different one
       from the strip's, so the page uses two of its phrases rather than one
       twice. "health checkup package deoria". The h1 has "lab test in deoria" and the
       strip has "blood test at home in deoria", so this is the third.
       `intro` and the five steps come from defaultHowTo and are unchanged:
       they describe a procedure, and a procedure is the same in every town. */
    howTo: { heading: "How to book a health checkup package in Deoria" },

    content: deoriaContent,
    faqs: deoriaFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. The other cities are also
       in the footer, but a footer is byte-identical on every lab page and gets
       discounted as boilerplate; these anchors are descriptive and per-city.
       The guides are the real gain — nothing else on the site links a lab page
       into /blogs/*.

       This block used to be two-thirds medicine delivery: five town pages and
       three medicine guides, all of which are now permanently redirected (see
       next.config.mjs). A link block is a crawl path, and a path made of
       redirects is one the crawler learns to stop following. What replaces
       them are the routes a reader on this page actually wants next.

       Every href here is checked against a real route: the guides live in
       content/blogs/varanasi/ and the cities in the seed above. */
    relatedLinks: {
      heading: "Deoria Ke Liye Aage Ki Jaankari",
      intro:
        "Kaun sa test kab karana chahiye, report ke numbers ka matlab, aur aas-paas ke jile — sab ek jagah.",
      groups: [
        {
          title: "Test Chunne Me Madad",
          links: [
            // Deoria ka apna guide, isliye sabse pehle. Pehle yahan sirf
            // Varanasi ke guide the — is jile ka reader ek doosre sheher ka
            // URL khol raha tha. Wo dono ab bhi neeche hain, kyunki unmein
            // report padhna aur package chunna hai, jo har jile me ek jaisa hai.
            {
              href: "/blogs/lab-test/deoria",
              label: "Deoria me kaun sa test kab karayein — poori guide",
              sub: "Package, bukhar ka din, Gorakhpur se pehle ki taiyaari",
            },
            {
              href: "/blogs/lab-test/varanasi",
              label: "Kaun sa test kab karayein — poori guide",
              sub: "Shikayat, umar aur mausam ke hisaab se",
            },
            {
              href: "/blogs/full-body-checkup/varanasi",
              label: "Full body checkup me kya hona chahiye",
              sub: "\"80+ parameters\" ka sach, aur kya chhod dena chahiye",
            },
            {
              href: "/blogs/lab-test/varanasi#fasting-aur-taiyari",
              label: "Blood test se pehle fasting aur taiyaari",
            },
            {
              href: "/blogs/lab-test/varanasi#report-kaise-padhein",
              label: "Report aa gayi — ab ise kaise padhein",
            },
          ],
        },
        {
          title: "Doosre Sheher",
          links: [
            {
              href: "/lab-test/kushinagar",
              label: "Kushinagar me lab test",
              sub: "Kasia, Hata aur Tamkuhi Raj ka padosi zila",
            },
            // Us jile ka mukhyalaya, jiska apna page hai. Ek naya URL sitemap
            // se nahi, links se crawl hota hai — aur Padrauna ka page is page
            // par wapas aata hai, isliye link dono taraf hai.
            {
              href: "/lab-test/padrauna",
              label: "Padrauna me lab test",
              sub: "Kushinagar ka mukhyalaya — sheher ke mohalle naam se",
            },
            // Jile ke andar ka page, isliye pehle. Salempur tehsil ka apna page
            // hai aur wahan ke reader ko yahi anchor us tak le jaata hai.
            {
              href: "/lab-test/salempur",
              label: "Salempur me lab test",
              sub: "Bhatni, Lar aur Bhatpar Rani ke aas-paas ka ilaaka",
            },
            // Siwan ka page is page ko naam se leta hai; ye link uska jawab
            // hai. Ek naya URL sitemap se nahi, links se crawl hota hai.
            {
              href: "/lab-test/siwan",
              label: "Siwan me lab test",
              sub: "Seema ke us paar Bihar ka jila, kareeb 60 km",
            },
            {
              href: "/lab-test/gorakhpur",
              label: "Gorakhpur me lab test",
              sub: "Wahan OPD dikhana ho to report pehle taiyaar",
            },
            {
              href: "/lab-test/varanasi",
              label: "Varanasi me lab test",
              sub: "Imaging ya specialist ke liye jaana ho to",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "gorakhpur",
    name: "Gorakhpur",
    state: "Uttar Pradesh",

    /* City neighbourhoods first, then the district towns collection actually
       reaches. These are not decorative: they render in the footer, fill the
       booking form's dropdown, become `areaServed` in the schema, and are what
       a "<mohalla> me blood test" search matches on. Kept to the localities a
       Gorakhpur reader would recognise by name — an areaServed we cannot serve
       is a lie in schema form, and a 30-item dropdown is unusable on a phone.
       The full list, including the smaller mohallas, is in the page copy. */
    areas: [
      "Golghar",
      "Civil Lines",
      "Betiahata",
      "Mohaddipur",
      "Taramandal",
      "Rustampur",
      "Medical College Road",
      "Gorakhnath",
      "Kunraghat",
      "Sahjanwa",
      "Pipraich",
      "Chauri Chaura",
    ],

    postalCode: "273001",

    /* Gorakhpur town centre. Deliberately the CENTRE and not a street pin:
       there is no walk-in counter here — this is a home-collection service
       area, and a precise address in the schema would be a claim we cannot
       keep. Google reads `geo` on a service-area business as "roughly here". */
    geo: { lat: 26.7606, lng: 83.3732 },

    updated: "2026-08-03",
    order: 3,
    published: true,

    /* Gorakhpur carries its own copy rather than the generated defaults, for
       the same reason Deoria does: a page that is another city's page with the
       noun swapped reads as a doorway page and does not get indexed. `content`
       and `faqs` are the two blocks that decide that, and the title and
       description are written so the search result itself does not look like a
       duplicate of the other two cities.

       The angle is Gorakhpur's own — it is the region's referral hub, so the
       reader is often here for an OPD appointment and can save an entire trip
       by having the report in hand. See src/data/lab/content/gorakhpur.js. */

    /* 39 characters; the root layout appends " | MedicoBharat" (template in
       src/app/layout.js), so Google renders 54 — inside the ~60 it will show.

       It read "Lab Test in Gorakhpur — Blood Test at Home" until the section's
       titles were split apart (see the block comment above defaultTitle in
       src/data/lab/defaults.js): eleven cities shared that one pairing, so the
       whole section chased one phrase with only the town name differing. This
       page takes "pathology lab" as its lead because that is what a reader
       heading to the referral hub types when they are looking for a place, and
       keeps "Blood Test" as the tail so the bigger query survives beside it. */
    title: "Pathology Lab in Gorakhpur — Blood Test",

    // ~157 characters, so it renders whole on desktop and mobile. Deliberately
    // NOT Deoria's description with the city swapped — it leads with the thing
    // only this city's page argues (report before the OPD visit), so the two
    // snippets do not read as the same page twice.
    description:
      // 149 characters. It was 167 and the tail was being cut in the SERP; the
      // "report 24 ghante me" clause moved out because the OPD line is the one
      // thing here no other city page says, and it earns the space.
      "Gorakhpur me lab test ghar baithe — OPD se pehle report taiyaar rakhiye. CBC, thyroid, sugar aur full body checkup, free home sample collection.",

    /* ── THE H1 IS VISIBLE NOW — KEEP IT SHORT ────────────────────────────
       It used to be `sr-only`, and every city's override was written on that
       basis: "it costs a reader nothing", so each one carried every keyword
       variant at once. Deoria's ran to 86 characters, Gorakhpur's to 109.

       The hero renders the h1 as real text now (see LabHero.jsx), because a
       headline burned into a shared banner image is unreadable to a crawler and
       identical on all six pages. A 109-character heading that nobody saw is
       fine; the same heading at the top of a phone screen is a wall of text,
       and a heading stuffed with comma-separated variants is one of the oldest
       spam patterns there is.

       So the h1 opens with the phrase people actually type — "Lab Test in
       <city>" — and stops. The secondary terms ("pathology lab", "full body
       checkup", "blood test") moved into `h1Sub`, where they sit in a real
       sentence. Terms in a sentence a reader reads are worth more than terms
       crammed into a heading, and the sub-line was going to be written anyway.

       Budget: h1 under ~60 characters, h1Sub under ~140. */
    hero: {
      h1: "Lab Test in Gorakhpur — Blood Test Ghar Baithe",
      h1Sub:
        "CBC, thyroid, sugar se full body checkup tak — Gorakhpur me trained phlebotomist ghar aakar sample lega, report 24 ghante me.",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out instead of taking defaultKeywords(), which only produces
       "<template> in Gorakhpur" nine times plus one line per area. That misses
       the three things Gorakhpur traffic actually is: test-wise long tail,
       which converts because the searcher has already decided; the mohalla
       modifiers, which is how a city this spread out is searched; and
       Devanagari, which is how a large share of this district types.

       `keywords` is a weak-to-zero ranking signal on its own — the reason to
       keep this list honest is that it is the checklist the page's headings,
       FAQs and prose are written against. Every term below appears in the
       visible copy. */
    keywords: [
      "Lab Test at Home in Gorakhpur",
      "Blood Test at Home in Gorakhpur",
      "Home Sample Collection in Gorakhpur",
      "Blood Test in Gorakhpur",
      "Diagnostic Lab in Gorakhpur",
      "Pathology Lab in Gorakhpur",
      "Full Body Checkup in Gorakhpur",
      "Full Body Checkup at Home in Gorakhpur",
      "Home Collection Lab in Gorakhpur",
      "Lab Test Near Me in Gorakhpur"
    ],

    /* Closing call strip. The heading IS one tracked search phrase, title
       cased — no tail, no second keyword. See defaultCallBanner in
       src/data/lab/defaults.js for which phrase each city takes and why. */
    callBanner: {
      heading: "Blood Test Home Collection in Gorakhpur",
    },

    /* Same rule as the strip above — ONE tracked phrase, and a different one
       from the strip's, so the page uses two of its phrases rather than one
       twice. "full body health checkup in gorakhpur". Still NOT "best pathology lab
       in gorakhpur", which is on the list and is a claim we cannot make.
       `intro` and the five steps come from defaultHowTo and are unchanged:
       they describe a procedure, and a procedure is the same in every town. */
    howTo: { heading: "How to book a full body health checkup in Gorakhpur" },

    content: gorakhpurContent,
    faqs: gorakhpurFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. The footer already carries
       some of these, but a footer is byte-identical on every lab page and gets
       discounted as boilerplate; these anchors are descriptive and per-city.

       Every href is checked against a real route: the lab cities in the seed
       above and the guides in content/blogs/varanasi/. */
    relatedLinks: {
      heading: "Gorakhpur Ke Aas-paas MedicoBharat Ki Doosri Services",
      intro:
        "Aas-paas ke jilon me bhi wahi home collection, aur test chunne se le kar report padhne tak ke guide.",
      groups: [
        {
          title: "Aas-paas Ke Sheher",
          links: [
            {
              href: "/lab-test/kushinagar",
              label: "Kushinagar me lab test",
              sub: "Kasia se Khadda tak — wahan se log yahin dikhane aate hain",
            },
            // Kareeb 50 km, aur us jile ka mukhyalaya. Padrauna ka page is
            // sheher ko naam se leta hai (specialist aur imaging ke liye yahin
            // aana padta hai), isliye link dono taraf hai — ek taraf ka link
            // crawler ko sirf itna batata hai ki do page jude hain.
            {
              href: "/lab-test/padrauna",
              label: "Padrauna me lab test",
              sub: "Kareeb 50 km — OPD se pehle report ghar par taiyaar",
            },
            // Siwan ka page is sheher ko baar baar naam se leta hai — wahan se
            // log kareeb 110 km chal kar yahan dikhane aate hain, aur ye link
            // us baat ka jawab hai. Link dono taraf rakhna hi ek naye URL ko
            // crawl karwata hai.
            {
              href: "/lab-test/siwan",
              label: "Siwan me lab test",
              sub: "Bihar ka jila — wahan se log yahin dikhane aate hain",
            },
            {
              href: "/lab-test/deoria",
              label: "Deoria me lab test",
              sub: "Gorakhpur ka safar bachane wala option",
            },
            // Kareeb 40 km paschim, isi line par. Us page ka poora tark ye hai
            // ki wahan ke log aadhe Gorakhpur aur aadhe Basti chale jaate hain,
            // aur is sheher ko wo naam se leta hai — isliye link dono taraf
            // hai. Ek naya URL sitemap se nahi, links se crawl hota hai.
            {
              href: "/lab-test/khalilabad",
              label: "Khalilabad me lab test",
              sub: "Sant Kabir Nagar — kareeb 40 km, isi line par",
            },
            // Is page ki copy pehle se kehti hai ki Maharajganj se log yahan
            // refer ho kar aate hain. Ab us vaakya ka link bhi hai, aur us
            // page se wapsi ka link bhi — ek taraf ka link crawler ko sirf
            // itna batata hai ki do page jude hain.
            {
              href: "/lab-test/maharajganj",
              label: "Maharajganj me lab test",
              sub: "Kareeb 50 km uttar — Nautanwa aur Sonauli ki taraf tak",
            },
            // Azamgarh mandal se log yahan OPD ke liye aate hain, isliye link
            // dono taraf hai — Azamgarh ka page bhi is page par aata hai.
            {
              href: "/lab-test/azamgarh",
              label: "Azamgarh me lab test",
              sub: "Mubarakpur, Nizamabad aur Lalganj tak home collection",
            },
            {
              href: "/lab-test/varanasi",
              label: "Varanasi me lab test",
              sub: "Ilaaj Varanasi me chal raha ho to",
            },
            // Is sheher se aage ka referral aksar Lucknow jaata hai — SGPGI,
            // KGMU aur RMLIMS wahin hain. Lucknow ka page is page par wapas
            // aata hai, isliye link dono taraf chalta hai.
            {
              href: "/lab-test/lucknow",
              label: "Lucknow me lab test",
              sub: "Rajdhani ke bade sansthan me tareekh mili ho to",
            },
          ],
        },
        {
          title: "Test Chunne Me Madad",
          links: [
            {
              href: "/blogs/lab-test/varanasi",
              label: "Kaun sa test kab karayein — poori guide",
              sub: "Shikayat, umar aur mausam ke hisaab se",
            },
            {
              href: "/blogs/full-body-checkup/varanasi",
              label: "Full body checkup me kya hona chahiye",
            },
            {
              href: "/blogs/lab-test/varanasi#fasting-aur-taiyari",
              label: "Fasting ke niyam aur test se pehle ki taiyaari",
            },
            {
              href: "/blogs/lab-test/varanasi#report-kaise-padhein",
              label: "Report aa gayi — ab ise kaise padhein",
            },
          ],
        },
      ],
    },
  },
  {
    /* ── Salempur ──────────────────────────────────────────────────────────
       The first entry in this list that is NOT a district headquarters:
       Salempur is a tehsil town inside Deoria district, and it is already named
       as an `areas` entry on /lab-test/deoria. That makes it the one city here
       with a real cannibalisation risk — two pages of ours competing for
       "Salempur me lab test", with the likely outcome being that Google indexes
       one and filters the other.

       It is still worth its own page because the search is real and the intent
       is different: someone typing "Salempur me blood test" is asking whether
       anyone comes to THEIR kasba, and a district page that mentions their town
       once in a list does not answer that. What makes it safe is that the copy
       argues something Deoria's page does not — see the header of
       src/data/lab/content/salempur.js. If that ever gets edited down into a
       rewrite of Deoria's page, delete this entry rather than keep both. */
    slug: "salempur",
    name: "Salempur",
    state: "Uttar Pradesh",

    /* The kasbas around Salempur that collection actually reaches. NOT the
       whole tehsil, and deliberately NOT "Salempur" itself — the booking form
       renders `[name, ...areas, "Other"]`, so repeating the town here would
       print it twice in the dropdown.

       Overlap with Deoria's list (Barhaj, Lar, Bhatni, Bhatpar Rani) is
       intentional and honest: the same van covers them, and both pages name
       them because a reader in Lar could plausibly search either town. These
       become `areaServed` in the schema — do not pad the list with places we
       cannot serve. */
    areas: [
      "Bhatni",
      "Lar",
      "Bhatpar Rani",
      "Bhagalpur",
      "Majhauli Raj",
      "Rampur Karkhana",
      "Barhaj",
    ],

    // Salempur town's PIN. Schema only. Worth re-checking against a delivery
    // slip before any paid push — it is the one field here nobody on the page
    // ever reads, so a wrong value would sit in the markup unnoticed.
    postalCode: "274509",

    /* Salempur town centre, and approximate on purpose — same rule as the other
       cities: there is no walk-in counter here, this is a home-collection
       service area, and a precise street pin in the schema would be a claim we
       cannot keep. Google reads `geo` on a service-area business as "roughly
       here", which is true. */
    geo: { lat: 26.2989, lng: 83.8636 },

    updated: "2026-08-14",
    order: 4,
    published: true,

    // 41 characters; the root layout appends " | MedicoBharat" (template in
    // src/app/layout.js), so Google renders 56 — inside the ~60 it will show.
    //
    // "Blood Test in Salempur" leads, and it is the EXACT phrase, not "Lab Test
    // in Salempur — Blood Test at Home" (what this was): that version carried
    // "blood test" and "Salempur" but never next to each other, so the phrase a
    // reader actually types was not in the title at all. Lab test stays as the
    // second half, so both queries survive the truncation.
    title: "Blood Test in Salempur — Lab Test at Home",

    // ~155 characters, so it survives whole on desktop and mobile. Written to
    // NOT read like Deoria's snippet: it names the surrounding kasbas rather
    // than the district, which is what distinguishes the two results when both
    // show for one query.
    description:
      "Salempur, Bhatni aur Lar me lab test ghar baithe book karein — CBC, thyroid, sugar aur full body checkup. Free home sample collection, report 24 ghante me.",

    /* ── THE H1 IS VISIBLE NOW — KEEP IT SHORT ────────────────────────────
       It used to be `sr-only`, and every city's override was written on that
       basis: "it costs a reader nothing", so each one carried every keyword
       variant at once. Deoria's ran to 86 characters, Gorakhpur's to 109.

       The hero renders the h1 as real text now (see LabHero.jsx), because a
       headline burned into a shared banner image is unreadable to a crawler and
       identical on all six pages. A 109-character heading that nobody saw is
       fine; the same heading at the top of a phone screen is a wall of text,
       and a heading stuffed with comma-separated variants is one of the oldest
       spam patterns there is.

       So the h1 opens with the phrase people actually type — "Lab Test in
       <city>" — and stops. The secondary terms ("pathology lab", "full body
       checkup", "blood test") moved into `h1Sub`, where they sit in a real
       sentence. Terms in a sentence a reader reads are worth more than terms
       crammed into a heading, and the sub-line was going to be written anyway.

       Budget: h1 under ~60 characters, h1Sub under ~140. */
    hero: {
      h1: "Lab Test in Salempur — Blood Test Ghar Baithe",
      h1Sub:
        "Salempur aur aas-paas ke gaon me pathology lab ke test ghar baithe — free sample collection, report 24 ghante me phone par.",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out rather than taking defaultKeywords(), which would produce
       "<template> in Salempur" nine times plus one line per area and miss the
       three things this town's traffic actually is: test-wise long tail, the
       neighbouring-kasba modifiers (a Bhatni or Lar reader rarely types
       "Salempur"), and Devanagari.

       "Salempur" alone is ambiguous — there are Salempurs in several districts —
       so the district-qualified forms are carried explicitly rather than left
       to Google to infer.

       `keywords` is a weak-to-zero ranking signal by itself; the reason to keep
       it honest is that it is the checklist the page's headings, FAQs and prose
       are written against. Every term below appears in the visible copy. */
    keywords: [
      "Lab Test at Home in Salempur",
      "Blood Test at Home in Salempur",
      "Home Sample Collection in Salempur",
      "Blood Test in Salempur",
      "Diagnostic Lab in Salempur",
      "Pathology Lab in Salempur",
      "Full Body Checkup in Salempur",
      "Full Body Checkup at Home in Salempur",
      "Home Collection Lab in Salempur",
      "Lab Test Near Me in Salempur"
    ],

    /* Closing call strip. The heading IS one tracked search phrase, title
       cased — no tail, no second keyword. See defaultCallBanner in
       src/data/lab/defaults.js for which phrase each city takes and why. */
    callBanner: {
      heading: "Lab Test Service in Salempur",
    },

    /* Same rule as the strip above — ONE tracked phrase, and a different one
       from the strip's, so the page uses two of its phrases rather than one
       twice. One tracked phrase ("lab test service salempur"), used by the strip.
       Written in the neighbours' shape.
       `intro` and the five steps come from defaultHowTo and are unchanged:
       they describe a procedure, and a procedure is the same in every town. */
    howTo: { heading: "How to book a blood test at home in Salempur" },

    content: salempurContent,
    faqs: salempurFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. This block matters more
       here than on the other cities: a brand-new URL two levels down in a
       district gets crawled through links, not through the sitemap alone, so
       the district page is named first and links back (see Deoria's block).

       Every href is checked against a real route: the cities in the seed above
       and the guides in content/blogs/varanasi/. */
    relatedLinks: {
      heading: "Salempur Ke Aas-paas Aur Aage Ki Jaankari",
      intro:
        "Aas-paas ke sheher jahan yahi home collection chalti hai, aur ye tay karne ke liye guide ki kaun sa test kab karana chahiye.",
      groups: [
        {
          title: "Aas-paas Ke Sheher",
          links: [
            {
              href: "/lab-test/deoria",
              label: "Deoria me lab test",
              sub: "Zila mukhyalaya — poore jile ki rate list aur booking",
            },
            // Is tehsil ki poorabi seema Bihar se lagti hai, aur Siwan ka page
            // Bhatni aur Salempur ko naam se leta hai — link dono taraf rakhna
            // hi ek naye URL ko crawl karwata hai.
            {
              href: "/lab-test/siwan",
              label: "Siwan me lab test",
              sub: "Bhatni-Mairwa hokar Bihar ki taraf ka padosi jila",
            },
            {
              href: "/lab-test/gorakhpur",
              label: "Gorakhpur me lab test",
              sub: "Wahan OPD dikhana ho to report pehle taiyaar",
            },
            {
              href: "/lab-test/varanasi",
              label: "Varanasi me lab test",
              sub: "Ilaaj Varanasi me chal raha ho to",
            },
          ],
        },
        {
          title: "Test Chunne Me Madad",
          links: [
            {
              href: "/blogs/lab-test/varanasi",
              label: "Kaun sa test kab karayein — poori guide",
              sub: "Shikayat, umar aur mausam ke hisaab se",
            },
            {
              href: "/blogs/full-body-checkup/varanasi",
              label: "Full body checkup me kya hona chahiye",
              sub: "\"80+ parameters\" ka sach, aur kya chhod dena chahiye",
            },
            {
              href: "/blogs/lab-test/varanasi#fasting-aur-taiyari",
              label: "Blood test se pehle fasting aur taiyaari",
            },
            {
              href: "/blogs/lab-test/varanasi#report-kaise-padhein",
              label: "Report aa gayi — ab ise kaise padhein",
            },
          ],
        },
      ],
    },
  },
  {
    /* ── Azamgarh ──────────────────────────────────────────────────────────
       A district headquarters again, and the first city here that is also a
       MANDAL headquarters — Mau and Ballia refer inward to it. That, plus the
       plain size of the district (seven tehsils, ~50–60 km from the far edge to
       the city where the labs are), is the whole argument of this page's copy
       and the reason it does not read like Gorakhpur's or Deoria's.

       There is no cannibalisation risk of the Salempur kind here: Azamgarh is
       not named as an `areas` entry on any other lab page, and the towns below
       are its own — nothing in this list is claimed by Deoria or Salempur. See
       src/data/lab/content/azamgarh.js for which sections are this page's own
       and which arguments were deliberately left to the other four. */
    slug: "azamgarh",
    name: "Azamgarh",
    state: "Uttar Pradesh",

    /* City localities first, then the tehsil towns collection actually reaches.
       These are not decorative: they render in the footer, fill the booking
       form's dropdown, become `areaServed` in the schema, and are what a
       "<kasba> me blood test" search matches on. Kept to twelve — the full
       list, including Mehnagar, Jeanpur, Sagri, Martinganj, Budhanpur,
       Jahanaganj, Ahiraula and Deogaon, is in the page copy, because a
       twenty-item dropdown is unusable on a phone. An areaServed we cannot
       serve is a lie in schema form; do not pad this list. */
    areas: [
      "Sidhari",
      "Civil Lines",
      "Kachehri",
      "Rani Ki Sarai",
      "Mubarakpur",
      "Nizamabad",
      "Bilariyaganj",
      "Sarai Mir",
      "Lalganj",
      "Phulpur",
      "Maharajganj",
      "Atraulia",
    ],

    // Azamgarh city PIN. Schema only. Worth re-checking against a delivery slip
    // before any paid push — it is the one field here nobody on the page ever
    // reads, so a wrong value would sit in the markup unnoticed.
    postalCode: "276001",

    /* Azamgarh town centre, and approximate on purpose — same rule as the other
       cities: there is no walk-in counter here, this is a home-collection
       service area, and a precise street pin in the schema would be a claim we
       cannot keep. Google reads `geo` on a service-area business as "roughly
       here", which is true. */
    geo: { lat: 26.0685, lng: 83.1836 },

    updated: "2026-08-15",
    order: 5,
    published: true,

    // 43 characters; the root layout appends " | MedicoBharat" (template in
    // src/app/layout.js), so Google renders 58 — inside the ~60 it will show.
    // Primary keyword first, then this page's own second query. The tail used
    // to be "Blood Test at Home", which ten other cities also carried — see the
    // block comment above defaultTitle in src/data/lab/defaults.js.
    title: "Lab Test in Azamgarh — Free Home Collection",

    // ~153 characters, so it renders whole on desktop and mobile. Written to
    // NOT read like the other cities' snippets: it names the span from the city
    // mohalla to the weaving towns, which is what distinguishes this result
    // when more than one of our pages shows for a district-level query.
    description:
      "Azamgarh me lab test ghar baithe — Sidhari se Mubarakpur tak free home sample collection. CBC, thyroid, sugar aur full body checkup, report 24 ghante me.",

    /* ── THE H1 IS VISIBLE NOW — KEEP IT SHORT ────────────────────────────
       It used to be `sr-only`, and every city's override was written on that
       basis: "it costs a reader nothing", so each one carried every keyword
       variant at once. Deoria's ran to 86 characters, Gorakhpur's to 109.

       The hero renders the h1 as real text now (see LabHero.jsx), because a
       headline burned into a shared banner image is unreadable to a crawler and
       identical on all six pages. A 109-character heading that nobody saw is
       fine; the same heading at the top of a phone screen is a wall of text,
       and a heading stuffed with comma-separated variants is one of the oldest
       spam patterns there is.

       So the h1 opens with the phrase people actually type — "Lab Test in
       <city>" — and stops. The secondary terms ("pathology lab", "full body
       checkup", "blood test") moved into `h1Sub`, where they sit in a real
       sentence. Terms in a sentence a reader reads are worth more than terms
       crammed into a heading, and the sub-line was going to be written anyway.

       Budget: h1 under ~60 characters, h1Sub under ~140. */
    hero: {
      h1: "Lab Test in Azamgarh — Blood Test Ghar Baithe",
      h1Sub:
        "Blood test, thyroid, sugar aur full body checkup — Azamgarh me free home sample collection, report 24 ghante me WhatsApp par.",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out rather than taking defaultKeywords(), which would produce
       "<template> in Azamgarh" nine times plus one line per area and miss the
       three things this district's traffic actually is: test-wise long tail,
       which converts because the searcher has already decided; the tehsil-town
       modifiers, because a reader in Mubarakpur or Lalganj rarely types
       "Azamgarh"; and Devanagari, which is how a large share of this district
       types.

       `keywords` is a weak-to-zero ranking signal by itself; the reason to keep
       it honest is that it is the checklist the page's headings, FAQs and prose
       are written against. Every term below appears in the visible copy — a
       keyword that appears ONLY here is the kind that gets a page filtered. */
    keywords: [
      "Lab Test at Home in Azamgarh",
      "Blood Test at Home in Azamgarh",
      "Home Sample Collection in Azamgarh",
      "Blood Test in Azamgarh",
      "Diagnostic Lab in Azamgarh",
      "Pathology Lab in Azamgarh",
      "Full Body Checkup in Azamgarh",
      "Full Body Checkup at Home in Azamgarh",
      "Home Collection Lab in Azamgarh",
      "Lab Test Near Me in Azamgarh"
    ],

    /* Closing call strip. The heading IS one tracked search phrase, title
       cased — no tail, no second keyword. See defaultCallBanner in
       src/data/lab/defaults.js for which phrase each city takes and why. */
    callBanner: {
      heading: "Pathology Lab in Azamgarh",
    },

    /* Same rule as the strip above — ONE tracked phrase, and a different one
       from the strip's, so the page uses two of its phrases rather than one
       twice. "blood test at home azamgarh" — the strip above took the pathology-lab
       phrase, so the two do not overlap.
       `intro` and the five steps come from defaultHowTo and are unchanged:
       they describe a procedure, and a procedure is the same in every town. */
    howTo: { heading: "How to book a blood test at home in Azamgarh" },

    content: azamgarhContent,
    faqs: azamgarhFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. A brand-new URL gets
       crawled through links, not through the sitemap alone, so the two cities
       this district actually travels to — Varanasi and Gorakhpur — are named
       first and both link back (see their blocks above).

       Every href is checked against a real route: the cities in the seed above
       and the guides in content/blogs/varanasi/. */
    relatedLinks: {
      heading: "Azamgarh Ke Aas-paas Aur Aage Ki Jaankari",
      intro:
        "Jin sheheron me ilaaj ya imaging ke liye jaana padta hai, wahan bhi yahi home collection chalti hai — aur ye tay karne ke liye guide ki kaun sa test kab karana chahiye.",
      groups: [
        {
          title: "Aas-paas Ke Sheher",
          links: [
            {
              href: "/lab-test/varanasi",
              label: "Varanasi me lab test",
              sub: "Imaging ya specialist ke liye jaana ho to",
            },
            {
              href: "/lab-test/gorakhpur",
              label: "Gorakhpur me lab test",
              sub: "Wahan OPD dikhana ho to report pehle taiyaar",
            },
            {
              href: "/lab-test/deoria",
              label: "Deoria me lab test",
              sub: "Jile ka apna page — rate list aur booking",
            },
            // Mandal ke apne jile: Azamgarh ki copy Ballia aur Mau dono ko naam
            // se leti hai, isliye link dono taraf hai — ek naya URL sitemap se
            // nahi, links se crawl hota hai. Mau iss jile se hi kata tha, aur
            // uska page yahan wapas link karta hai.
            {
              href: "/lab-test/ballia",
              label: "Ballia me lab test",
              sub: "Ganga-patti aur diara ke gaon tak home collection",
            },
            // Ghazipur ka page is jile ko naam se leta hai; link dono taraf
            // rakhna hi ek naye URL ko crawl karwata hai.
            {
              href: "/lab-test/ghazipur",
              label: "Ghazipur me lab test",
              sub: "Zamania, Saidpur aur Mohammadabad tak home collection",
            },
            {
              href: "/lab-test/mau",
              label: "Mau me lab test",
              sub: "Ghosi, Madhuban aur Doharighat tak ghar se sample",
            },
          ],
        },
        {
          title: "Test Chunne Me Madad",
          links: [
            {
              href: "/blogs/lab-test/varanasi",
              label: "Kaun sa test kab karayein — poori guide",
              sub: "Shikayat, umar aur mausam ke hisaab se",
            },
            {
              href: "/blogs/full-body-checkup/varanasi",
              label: "Full body checkup me kya hona chahiye",
              sub: "\"80+ parameters\" ka sach, aur kya chhod dena chahiye",
            },
            {
              href: "/blogs/lab-test/varanasi#fasting-aur-taiyari",
              label: "Blood test se pehle fasting aur taiyaari",
            },
            {
              href: "/blogs/lab-test/varanasi#report-kaise-padhein",
              label: "Report aa gayi — ab ise kaise padhein",
            },
          ],
        },
      ],
    },
  },
  {
    /* ── Ballia ────────────────────────────────────────────────────────────
       UP ka aakhiri jila: dakshin-poorab me Ganga, uttar me Sarayu (Ghaghara),
       dono paar Bihar. Us bhugol se do cheezein nikalti hain jo is page ki
       apni hain aur site par kahin aur nahi — diara/Ganga-patti ka paani
       (arsenic ka sawaal, jiska jawab is page par saaf "ye blood test nahi
       hai" hai), aur May-June ki garmi, jo yahan raajya me sabse zyada hoti
       hai aur report ke number tak badal deti hai.

       Cannibalisation ka khatra nahi hai: Ballia kisi doosre lab page ke
       `areas` me naam se nahi hai, aur neeche ke kasbe iske apne hain —
       inme se koi Azamgarh, Deoria ya Salempur ne claim nahi kiya. Azamgarh
       ka page Ballia ko mandal ke andar naam se leta hai, isliye dono taraf
       link hai. Kaunse arguments jaan boojh kar doosre pages ke liye chhode
       gaye, wo src/data/lab/content/ballia.js ke header me likha hai. */
    slug: "ballia",
    name: "Ballia",
    state: "Uttar Pradesh",

    /* City localities first, then the tehsil towns collection actually reaches.
       These are not decorative: they render in the footer, fill the booking
       form's dropdown, become `areaServed` in the schema, and are what a
       "<kasba> me blood test" search matches on. Kept to twelve — the fuller
       list, including Sahatwar, Nagra, Chitbara Gaon, Garwar, Dubhar, Sohaon,
       Hanumanganj, Beruarbari aur Murli Chhapra, is in the page copy, because a
       twenty-item dropdown is unusable on a phone. An areaServed we cannot
       serve is a lie in schema form; do not pad this list. */
    areas: [
      "Ballia Sadar",
      "Station Road",
      "Bhrigu Ashram",
      "Kachehri",
      "Phephna",
      "Rasra",
      "Bansdih",
      "Bairia",
      "Sikandarpur",
      "Belthara Road",
      "Reoti",
      "Maniyar",
    ],

    // Ballia city PIN. Schema only. Worth re-checking against a delivery slip
    // before any paid push — it is the one field here nobody on the page ever
    // reads, so a wrong value would sit in the markup unnoticed.
    postalCode: "277001",

    /* Ballia town centre, and approximate on purpose — same rule as the other
       cities: there is no walk-in counter here, this is a home-collection
       service area, and a precise street pin in the schema would be a claim we
       cannot keep. Google reads `geo` on a service-area business as "roughly
       here", which is true. */
    geo: { lat: 25.7585, lng: 84.1477 },

    updated: "2026-08-16",
    order: 6,
    published: true,

    // 38 characters; the root layout appends " | MedicoBharat" (template in
    // src/app/layout.js), so Google renders 53 — inside the ~60 it will show.
    // "Blood Test in Ballia" is the exact phrase and leads; the tail is this
    // page's own, not the "Blood Test at Home" ten other cities carried — see
    // the block comment above defaultTitle in src/data/lab/defaults.js.
    title: "Blood Test in Ballia — Home Collection",

    // ~152 characters, so it renders whole on desktop and mobile. Written to
    // NOT read like the other cities' snippets: it names the span from the city
    // to the tehsil towns that are furthest from it, which is what distinguishes
    // this result when more than one of our pages shows for a regional query.
    description:
      "Ballia me lab test ghar baithe — Rasra, Bansdih, Bairia aur Belthara Road tak free home sample collection. CBC, thyroid, sugar aur full body checkup.",

    /* ── THE H1 IS VISIBLE NOW — KEEP IT SHORT ────────────────────────────
       It used to be `sr-only`, and every city's override was written on that
       basis: "it costs a reader nothing", so each one carried every keyword
       variant at once. Deoria's ran to 86 characters, Gorakhpur's to 109.

       The hero renders the h1 as real text now (see LabHero.jsx), because a
       headline burned into a shared banner image is unreadable to a crawler and
       identical on all six pages. A 109-character heading that nobody saw is
       fine; the same heading at the top of a phone screen is a wall of text,
       and a heading stuffed with comma-separated variants is one of the oldest
       spam patterns there is.

       So the h1 opens with the phrase people actually type — "Lab Test in
       <city>" — and stops. The secondary terms ("pathology lab", "full body
       checkup", "blood test") moved into `h1Sub`, where they sit in a real
       sentence. Terms in a sentence a reader reads are worth more than terms
       crammed into a heading, and the sub-line was going to be written anyway.

       Budget: h1 under ~60 characters, h1Sub under ~140. */
    hero: {
      h1: "Lab Test in Ballia — Blood Test Ghar Baithe",
      h1Sub:
        "Pathology lab ke test aur full body checkup — Ballia me free home sample collection, report 24 ghante me seedhe phone par.",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out rather than taking defaultKeywords(), which would produce
       "<template> in Ballia" nine times plus one line per area and miss the
       three things this district's traffic actually is: test-wise long tail,
       which converts because the searcher has already decided; the tehsil-town
       modifiers, because a reader in Rasra or Belthara Road rarely types
       "Ballia"; and Devanagari, which is how a large share of this district
       types.

       `keywords` is a weak-to-zero ranking signal by itself; the reason to keep
       it honest is that it is the checklist the page's headings, FAQs and prose
       are written against. Every term below appears in the visible copy — a
       keyword that appears ONLY here is the kind that gets a page filtered. */
    keywords: [
      "Lab Test at Home in Ballia",
      "Blood Test at Home in Ballia",
      "Home Sample Collection in Ballia",
      "Blood Test in Ballia",
      "Diagnostic Lab in Ballia",
      "Pathology Lab in Ballia",
      "Full Body Checkup in Ballia",
      "Full Body Checkup at Home in Ballia",
      "Home Collection Lab in Ballia",
      "Lab Test Near Me in Ballia"
    ],

    /* Closing call strip. The heading IS one tracked search phrase, title
       cased — no tail, no second keyword. See defaultCallBanner in
       src/data/lab/defaults.js for which phrase each city takes and why. */
    callBanner: {
      heading: "Blood Sample Collection in Ballia",
    },

    /* Same rule as the strip above — ONE tracked phrase, and a different one
       from the strip's, so the page uses two of its phrases rather than one
       twice. "lab test at home in ballia"; the strip took "blood sample collection
       ballia".
       `intro` and the five steps come from defaultHowTo and are unchanged:
       they describe a procedure, and a procedure is the same in every town. */
    howTo: { heading: "How to book a lab test at home in Ballia" },

    content: balliaContent,
    faqs: balliaFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. A brand-new URL gets
       crawled through links, not through the sitemap alone, so the three places
       this district actually travels to for treatment — Varanasi, Azamgarh
       (mandal mukhyalaya) and Gorakhpur — are named first, and Azamgarh links
       back (see its block above).

       Every href is checked against a real route: the cities in the seed above
       and the guides in content/blogs/varanasi/. */
    relatedLinks: {
      heading: "Ballia Ke Aas-paas Aur Aage Ki Jaankari",
      intro:
        "Jin sheheron me ilaaj ya imaging ke liye jaana padta hai, wahan bhi yahi home collection chalti hai — aur ye tay karne ke liye guide ki kaun sa test kab karana chahiye.",
      groups: [
        {
          title: "Aas-paas Ke Sheher",
          links: [
            {
              href: "/lab-test/varanasi",
              label: "Varanasi me lab test",
              sub: "Imaging ya specialist ke liye jaana ho to",
            },
            {
              href: "/lab-test/azamgarh",
              label: "Azamgarh me lab test",
              sub: "Mandal mukhyalaya — wahan bhi ghar se sample",
            },
            {
              href: "/lab-test/gorakhpur",
              label: "Gorakhpur me lab test",
              sub: "Wahan OPD dikhana ho to report pehle taiyaar",
            },
            // Padosi jila, aur Mau ka page yahan link karta hai — link dono
            // taraf rakhna hi ek naye URL ko crawl karwata hai.
            {
              href: "/lab-test/mau",
              label: "Mau me lab test",
              sub: "Ghosi, Madhuban aur Doharighat tak ghar se sample",
            },
            // Ghazipur is jile se Ganga ke saath-saath lagta hai, aur uska page
            // Ballia ke paani wale hisse par seedha link karta hai — ye us link
            // ka jawab hai.
            {
              href: "/lab-test/ghazipur",
              label: "Ghazipur me lab test",
              sub: "Ganga ke saath-saath lagta padosi jila",
            },
          ],
        },
        {
          title: "Test Chunne Me Madad",
          links: [
            {
              href: "/blogs/lab-test/varanasi",
              label: "Kaun sa test kab karayein — poori guide",
              sub: "Shikayat, umar aur mausam ke hisaab se",
            },
            {
              href: "/blogs/full-body-checkup/varanasi",
              label: "Full body checkup me kya hona chahiye",
              sub: "\"80+ parameters\" ka sach, aur kya chhod dena chahiye",
            },
            {
              href: "/blogs/lab-test/varanasi#fasting-aur-taiyari",
              label: "Blood test se pehle fasting aur taiyaari",
            },
            {
              href: "/blogs/lab-test/varanasi#report-kaise-padhein",
              label: "Report aa gayi — ab ise kaise padhein",
            },
          ],
        },
      ],
    },
  },

  {
    /* ── Mau ───────────────────────────────────────────────────────────────
       Azamgarh se kata hua jila, aur jila mukhyalaya ka asli naam Maunath
       Bhanjan hai — yaani ek hi jagah ke do naam, Varanasi/Banaras wali
       sthiti. URL sirf ek naam le sakta hai, isliye doosra naam description,
       h1, keywords, ek H2 aur ek FAQ me rakha gaya hai.

       Is page ki apni do cheezein, jo site par kahin aur nahi hain: powerloom
       aur karkhane wala kaam (jismein sabse zaroori baat wo hai jo hum NAHI
       bechte — lambi khaansi ka jawab blood test nahi, balgam ki sarkari muft
       jaanch hai), aur raat/badalti shift walon ke liye sample ka sahi waqt.

       Cannibalisation ka khatra nahi hai: Mau kisi doosre lab page ke `areas`
       me naam se nahi hai, aur neeche ke kasbe iske apne hain — inme se koi
       Azamgarh, Ballia ya Deoria ne claim nahi kiya. Azamgarh ka page Mau ko
       naam se leta hai, isliye dono taraf link hai. Kaunse arguments jaan
       boojh kar doosre pages ke liye chhode gaye, wo
       src/data/lab/content/mau.js ke header me likha hai. */
    slug: "mau",
    name: "Mau",
    state: "Uttar Pradesh",

    /* City mohalle first, then the block towns collection actually reaches.
       These are not decorative: they render in the footer, fill the booking
       form's dropdown, become `areaServed` in the schema, and are what a
       "<kasba> me blood test" search matches on. Kept to twelve — the fuller
       list, including Ranipur, Walidpur, Ratanpura, Pardaha, Amila, Adari,
       Khurhat, Sarai Lakhansi aur Baraipar, is in the page copy, because a
       twenty-item dropdown is unusable on a phone. An areaServed we cannot
       serve is a lie in schema form; do not pad this list. */
    areas: [
      "Mau Sadar",
      "Sahadatpura",
      "Mirzahadipura",
      "Alinagar",
      "Purani Bazar",
      "Station Road",
      "Ghosi",
      "Madhuban",
      "Muhammadabad Gohna",
      "Kopaganj",
      "Doharighat",
      "Chiraiyakot",
    ],

    // Maunath Bhanjan (Mau city) PIN. Schema only. Worth re-checking against a
    // delivery slip before any paid push — it is the one field here nobody on
    // the page ever reads, so a wrong value would sit in the markup unnoticed.
    postalCode: "275101",

    /* Mau town centre, and approximate on purpose — same rule as the other
       cities: there is no walk-in counter here, this is a home-collection
       service area, and a precise street pin in the schema would be a claim we
       cannot keep. Google reads `geo` on a service-area business as "roughly
       here", which is true. */
    geo: { lat: 25.9417, lng: 83.5611 },

    updated: "2026-08-24",
    order: 7,
    published: true,

    /* No `aliases` entry, and none in CITY_ALIASES either — deliberately.
       "Maunath Bhanjan" IS a genuine second name for this town (the Varanasi →
       Banaras case, not a misspelling), but `aliases` only feeds
       defaultKeywords() and defaultFaqs(), and this city overrides both, so
       wiring it up would be config that changes nothing. The alternate name is
       carried where it actually works instead: the description below, the h1,
       the keywords, an H2 in the copy, the lead paragraph, and an FAQ of its
       own in content/mau.js. */

    // 43 characters; the root layout appends " | MedicoBharat" (template in
    // src/app/layout.js), so Google renders 58 — inside the ~60 it will show.
    // "Maunath Bhanjan" is deliberately NOT in the title: it would push the
    // line past truncation. It sits in the description instead. The short town
    // name leaves room for the package query, which is this page's own tail —
    // the section no longer repeats one pairing across eleven cities, see the
    // block comment above defaultTitle in src/data/lab/defaults.js.
    title: "Lab Test in Mau — Full Body Checkup at Home",

    // ~154 characters, so it renders whole on desktop and mobile. Leads with
    // BOTH names because a large share of this district types the official one,
    // then names the block towns that are furthest from the city — which is
    // what distinguishes this result when more than one of our pages shows for
    // a regional query.
    description:
      "Maunath Bhanjan (Mau) me lab test ghar baithe — Ghosi, Madhuban aur Doharighat tak free home sample collection. CBC, thyroid, sugar aur full body checkup.",

    // The h1 is screen-reader only (the hero is image + form), so it costs a
    // reader nothing and carries the terms the URL cannot: the official name,
    // "blood test", "pathology lab" and "full body checkup".
    hero: {
      h1: "Lab Test in Mau (Maunath Bhanjan) — Blood Test, Pathology Lab Aur Full Body Checkup Ke Liye Free Home Sample Collection",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out rather than taking defaultKeywords(), which would produce
       "<template> in Mau" nine times plus one line per area and miss the four
       things this district's traffic actually is: the official name, which a
       lot of people type and the URL cannot carry; test-wise long tail, which
       converts because the searcher has already decided; the block-town
       modifiers, because a reader in Ghosi or Doharighat rarely types "Mau";
       and Devanagari, which is how a large share of this district types.

       `keywords` is a weak-to-zero ranking signal by itself; the reason to keep
       it honest is that it is the checklist the page's headings, FAQs and prose
       are written against. Every term below appears in the visible copy — a
       keyword that appears ONLY here is the kind that gets a page filtered. */
    keywords: [
      "Lab Test at Home in Mau",
      "Blood Test at Home in Mau",
      "Home Sample Collection in Mau",
      "Blood Test in Mau",
      "Diagnostic Lab in Mau",
      "Pathology Lab in Mau",
      "Full Body Checkup in Mau",
      "Full Body Checkup at Home in Mau",
      "Home Collection Lab in Mau",
      "Lab Test Near Me in Mau"
    ],

    /* Closing call strip. The heading IS one tracked search phrase, title
       cased — no tail, no second keyword. See defaultCallBanner in
       src/data/lab/defaults.js for which phrase each city takes and why. */
    callBanner: {
      heading: "Pathology Lab Home Collection in Mau",
    },

    /* Same rule as the strip above — ONE tracked phrase, and a different one
       from the strip's, so the page uses two of its phrases rather than one
       twice. Mau has one tracked phrase and the strip above uses it, so this is
       written in the same shape as its neighbours.
       `intro` and the five steps come from defaultHowTo and are unchanged:
       they describe a procedure, and a procedure is the same in every town. */
    howTo: { heading: "How to book a lab test at home in Mau" },

    content: mauContent,
    faqs: mauFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. A brand-new URL gets
       crawled through links, not through the sitemap alone, so the places this
       district actually travels to for treatment — Azamgarh (the parent
       district and mandal mukhyalaya), Varanasi and Gorakhpur — are named
       first, with Ballia added because it is the one neighbour this page does
       NOT link to from its prose. Azamgarh links back (see its block above).

       Every href is checked against a real route: the cities in the seed above
       and the guides in content/blogs/varanasi/. */
    relatedLinks: {
      heading: "Mau Ke Aas-paas Aur Aage Ki Jaankari",
      intro:
        "Jin sheheron me ilaaj ya imaging ke liye jaana padta hai, wahan bhi yahi home collection chalti hai — aur ye tay karne ke liye guide ki kaun sa test kab karana chahiye.",
      groups: [
        {
          title: "Aas-paas Ke Sheher",
          links: [
            {
              href: "/lab-test/azamgarh",
              label: "Azamgarh me lab test",
              sub: "Mandal mukhyalaya — wahan bhi ghar se sample",
            },
            {
              href: "/lab-test/varanasi",
              label: "Varanasi me lab test",
              sub: "Imaging ya specialist ke liye jaana ho to",
            },
            {
              href: "/lab-test/gorakhpur",
              label: "Gorakhpur me lab test",
              sub: "Wahan OPD dikhana ho to report pehle taiyaar",
            },
            {
              href: "/lab-test/ballia",
              label: "Ballia me lab test",
              sub: "Padosi jila — wahan bhi wahi rate, wahi service",
            },
            // Ghazipur ka page Mau ko naam se leta hai; link dono taraf rakhna
            // hi ek naye URL ko crawl karwata hai.
            {
              href: "/lab-test/ghazipur",
              label: "Ghazipur me lab test",
              sub: "Dakshin ka padosi jila — Ghazipur city se Zamania tak",
            },
          ],
        },
        {
          title: "Test Chunne Me Madad",
          links: [
            {
              href: "/blogs/lab-test/varanasi",
              label: "Kaun sa test kab karayein — poori guide",
              sub: "Shikayat, umar aur mausam ke hisaab se",
            },
            {
              href: "/blogs/full-body-checkup/varanasi",
              label: "Full body checkup me kya hona chahiye",
              sub: "\"80+ parameters\" ka sach, aur kya chhod dena chahiye",
            },
            {
              href: "/blogs/lab-test/varanasi#fasting-aur-taiyari",
              label: "Blood test se pehle fasting aur taiyaari",
            },
            {
              href: "/blogs/lab-test/varanasi#report-kaise-padhein",
              label: "Report aa gayi — ab ise kaise padhein",
            },
          ],
        },
      ],
    },
  },
  {
    /* ── Kushinagar ────────────────────────────────────────────────────────
       The only district here whose headquarters is NOT the town the district
       is named after. Padrauna is the administrative centre — hospital, courts,
       market, and most of the population that books a checkup. Kushinagar
       (Kasia) is the Buddhist pilgrimage town about 15 km away.

       That splits the search demand cleanly in two: the district name is what
       everyone outside types, "Padrauna" is what the people who live at the
       headquarters type. Both names therefore run through the description, the
       h1, the keywords and the copy — see the note at the top of
       content/kushinagar.js. Mau does the same for "Maunath Bhanjan", but there
       the two names are one town; here they are two, which is why the copy says
       so in plain words rather than treating them as synonyms.

       It also completes the belt: Gorakhpur, Deoria and Kushinagar are the
       three districts that share the AES/JE season and the same referral road
       to BRD. All three now link to each other. */
    slug: "kushinagar",
    name: "Kushinagar",
    state: "Uttar Pradesh",

    /* Headquarters first, then the pilgrimage town, then the block towns
       collection actually reaches. These are not decorative: they render in the
       footer, fill the booking form's dropdown, become `areaServed` in the
       schema, and are what a "<kasba> me blood test" search matches on. Kept to
       twelve — Dudahi, Sukrauli, Motichak and the smaller villages are named in
       the page copy instead, because a twenty-item dropdown is unusable on a
       phone. An areaServed we cannot serve is a lie in schema form; do not pad
       this list. */
    areas: [
      "Padrauna",
      "Kasia",
      "Hata",
      "Ramkola",
      "Tamkuhi Raj",
      "Khadda",
      "Captainganj",
      "Sewrahi",
      "Fazilnagar",
      "Nebua Naurangia",
      "Vishunpura",
      "Dudahi",
    ],

    // Padrauna PIN — the headquarters, not the pilgrimage town (Kasia is
    // 274403). Schema only. Worth re-checking against a delivery slip before
    // any paid push: it is the one field here nobody on the page ever reads, so
    // a wrong value would sit in the markup unnoticed.
    postalCode: "274304",

    /* Padrauna town centre, and approximate on purpose — same rule as every
       other city: there is no walk-in counter here, this is a home-collection
       service area, and a precise street pin in the schema would be a claim we
       cannot keep. Google reads `geo` on a service-area business as "roughly
       here", which is true. Deliberately Padrauna and not Kasia: the geo point
       should sit where the demand and the population are. */
    geo: { lat: 26.9008, lng: 83.98 },

    updated: "2026-08-27",
    order: 8,
    published: true,

    /* No `aliases` entry, and none in CITY_ALIASES either. "Padrauna" is NOT an
       alternate name for Kushinagar — it is a different town in the same
       district — so putting it in `aliases` would be wrong on the facts, and
       `aliases` only feeds defaultKeywords() and defaultFaqs(), both of which
       this city overrides anyway. The name is carried where it actually works:
       the description, the h1, the keywords, two H2s and three FAQs. */

    // 35 characters; the root layout appends " | MedicoBharat" (template in
    // src/app/layout.js), so Google renders 50 — comfortably inside the ~60.
    // "Padrauna" is deliberately NOT in the title, and now for a second reason
    // as well: that town has its own page, and "Diagnostic Centre in Padrauna"
    // is ITS title. This one takes the district's own exact phrase and stops.
    title: "Blood Test in Kushinagar — Lab Test",

    // ~157 characters, so it renders whole on desktop and mobile. It used to
    // open "Padrauna aur Kushinagar me lab test ghar baithe"; the headquarters
    // now has its own page (/lab-test/padrauna) whose snippet leads with that
    // name, so this one leads with the district and Kasia and names the block
    // towns furthest from the headquarters. That is what distinguishes the two
    // results when both show for one regional query.
    description:
      "Kushinagar jile me lab test ghar baithe — Kasia, Hata, Ramkola, Khadda aur Tamkuhi Raj tak free home sample collection. CBC, thyroid, sugar aur full body checkup.",

    // The h1 is screen-reader only (the hero is image + form), so it costs a
    // reader nothing and carries the terms the URL cannot: the pilgrimage
    // town's name, "blood test", "pathology lab" and "full body checkup". It
    // read "Kushinagar Aur Padrauna" until the town got its own page — see the
    // warning above `keywords`.
    hero: {
      h1: "Lab Test in Kushinagar — Kasia Se Khadda Tak Blood Test, Pathology Lab Aur Full Body Checkup Ke Liye Free Home Sample Collection",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out rather than taking defaultKeywords(), which would produce
       "<template> in Kushinagar" nine times plus one line per area and miss the
       two things this district's traffic actually is: the block-town modifiers,
       because a reader in Khadda or Tamkuhi Raj rarely types the district name,
       and the district's own seasonal demand.

       ⚠ "Lab Test in Padrauna" and "Blood Test in Padrauna" used to be the
       third and fourth lines here. They were REMOVED when /lab-test/padrauna
       shipped, and they must not come back: the headquarters town now has its
       own page and those exact phrases are its title and h1. Two of our pages
       chasing one exact phrase does not produce two ranking pages — it produces
       one, with the other filtered as a near-duplicate. This page keeps the
       district and Kasia; the town's own page keeps the town, and the two link
       to each other in the copy and in relatedLinks below.

       `keywords` is a weak-to-zero ranking signal by itself; the reason to keep
       it honest is that it is the checklist the page's headings, FAQs and prose
       are written against. Every term below appears in the visible copy — a
       keyword that appears ONLY here is the kind that gets a page filtered. */
    keywords: [
      "Lab Test in Kushinagar",
      "Blood Test in Kushinagar",
      "Lab Test in Kasia",
      "Blood Test at Home in Kushinagar",
      "Home Sample Collection in Kushinagar",
      "Pathology Lab in Kushinagar",
      "Diagnostic Centre in Kushinagar",
      "Full Body Checkup in Kushinagar",
      "Dengue Test in Kushinagar",
      "Lab Test Near Me in Kushinagar"
    ],

    /* Closing call strip. The heading IS one tracked search phrase, title
       cased — no tail, no second keyword. See defaultCallBanner in
       src/data/lab/defaults.js for which phrase each city takes and why. */
    callBanner: {
      heading: "Blood Test at Home in Kushinagar",
    },

    /* Same rule as the strip above — ONE tracked phrase, and a different one
       from the strip's, so the page uses two of its phrases rather than one
       twice. This one carries Kasia — the pilgrimage town the district is named
       after, which the URL holds but the strip's phrase does not. It carried
       Padrauna until that town got its own page.
       `intro` and the five steps come from defaultHowTo and are unchanged:
       they describe a procedure, and a procedure is the same in every town. */
    howTo: { heading: "How to book a lab test in Kushinagar and Kasia" },

    content: kushinagarContent,
    faqs: kushinagarFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. A brand-new URL gets
       crawled through links, not through the sitemap alone, so the two
       districts this one actually travels to — Gorakhpur for specialists and
       Deoria for everything to the south — are named first, and both of them
       link back (see their blocks above). Varanasi is there for imaging and
       referrals that go past Gorakhpur.

       Every href is checked against a real route: the cities in this seed and
       the guides in content/blogs/. */
    relatedLinks: {
      heading: "Kushinagar Ke Aas-paas Aur Aage Ki Jaankari",
      intro:
        "Jile ke mukhyalaya ka apna page, wo sheher jahan ilaaj ya imaging ke liye jaana padta hai, aur ye tay karne ke liye guide ki kaun sa test kab karana chahiye.",
      groups: [
        {
          title: "Aas-paas Ke Sheher",
          links: [
            // The other half of the two-way link with /lab-test/padrauna. The
            // town page links back in its lead paragraph and in its own
            // relatedLinks; a one-way link tells a crawler the two pages are
            // related but not which one is the page for "Padrauna me blood
            // test". The `sub` says out loud which reader belongs where, so
            // the two pages read as a pair rather than as rivals.
            {
              href: "/lab-test/padrauna",
              label: "Padrauna me lab test",
              sub: "Jila mukhyalaya — sheher ke mohalle aur landmark wala page",
            },
            {
              href: "/lab-test/gorakhpur",
              label: "Gorakhpur me lab test",
              sub: "Specialist aur BRD — wahan dikhana ho to report pehle taiyaar",
            },
            {
              href: "/lab-test/deoria",
              label: "Deoria me lab test",
              sub: "Jile ke dakshin se laga padosi zila",
            },
            {
              href: "/lab-test/varanasi",
              label: "Varanasi me lab test",
              sub: "Imaging ya specialist ke liye aage jaana ho to",
            },
          ],
        },
        {
          title: "Test Chunne Me Madad",
          links: [
            {
              href: "/blogs/lab-test/deoria",
              label: "Kaun sa test kab karayein — is belt ke liye guide",
              sub: "Package, bukhar ka din, Gorakhpur se pehle ki taiyaari",
            },
            {
              href: "/blogs/full-body-checkup/varanasi",
              label: "Full body checkup me kya hona chahiye",
              sub: "Package me kya chhoot jaata hai, umar ke hisaab se kaun sa level",
            },
            {
              href: "/blogs/lab-test/varanasi#report-kaise-padhein",
              label: "Report aa gayi — ab ise kaise padhein",
            },
          ],
        },
      ],
    },
  },

  {
    /* ── PADRAUNA — THE SECOND PAGE IN KUSHINAGAR DISTRICT ───────────────
       The Salempur situation again, and sharper. Padrauna is the DISTRICT
       HEADQUARTERS of Kushinagar, it is the first entry in that city's `areas`
       list, and the Kushinagar page was written carrying both names because
       nothing else covered the town. So this entry is the riskiest kind of
       addition there is: two of our own pages, one district, overlapping names.

       Two things make it safe, and if either is ever undone this entry should
       be deleted rather than kept:

       1. THE ARGUMENT IS DIFFERENT. Kushinagar's page is written for the reader
          20–45 km out — distance, the cane season, the Gandak's flood weeks,
          the AES warning. This page is written for the reader inside the town,
          where the counters are: a counter is not a laboratory, the morning is
          the real cost, how to judge a lab without believing a boast, and the
          household's women's tests. See the header of content/padrauna.js.

       2. THE EXACT-MATCH PHRASES WERE HANDED OVER. "Lab Test in Padrauna" and
          "Blood Test in Padrauna" used to sit in Kushinagar's `keywords`, and
          its `description` opened with the town's name. Both were changed when
          this entry was added — the district page now leads with Kushinagar and
          Kasia and links here for the town. Two pages chasing one exact phrase
          is how you get one filtered page instead of two ranking ones.

       The AES/encephalitis warning is deliberately NOT re-argued here: this
       page states the rule in two lines and links to the district page's
       section. That copy is the most safety-critical on the site and must live
       in one place, or the two versions drift. */
    slug: "padrauna",
    name: "Padrauna",
    state: "Uttar Pradesh",

    /* MOHALLAS AND ROADS, not towns — that is the whole point of the split from
       /lab-test/kushinagar, whose `areas` are the district's block towns. These
       render in the footer, fill the booking form's dropdown, become
       `areaServed` in the schema, and are what a "<landmark> ke paas blood
       test" search matches on. "Padrauna" itself is deliberately absent: the
       form renders `[name, ...areas, "Other"]`, so repeating it would print the
       town twice in the dropdown.

       ⚠ ONLY places INSIDE the town belong here. The schema builder renders
       each entry as "<area>, Padrauna", so listing a separate town such as
       Ramkola, Hata or Sewrahi would publish "Ramkola, Padrauna" — which names
       a place that does not exist and claims a town as a locality of another.
       Those towns are Kushinagar's `areas`, they are named in this page's prose
       and in its coverage FAQ as NEARBY towns, and that is where they stay.
       Do not pad this list; an areaServed we cannot serve is a lie in schema
       form, and one we mis-describe is a different kind of lie. */
    areas: [
      "Durga Chowk",
      "Central Bank Road",
      "Station Road",
      "Ramkola Road",
      "Kasia Road",
      "Tarya Sujan",
    ],

    // Padrauna town's PIN — the same one Kushinagar's entry carries, because
    // that entry uses the headquarters' PIN rather than Kasia's (274403). Two
    // entries sharing a postal code is correct here: they are two pages about
    // one town's postal area, seen at two different scales. Schema only.
    postalCode: "274304",

    /* Padrauna town centre, and approximate on purpose — same rule as every
       other city: there is no walk-in counter here, this is a home-collection
       service area, and a precise street pin in the schema would be a claim we
       cannot keep. This is the same point Kushinagar's entry uses, which is
       consistent rather than duplicated: its `geo` was already deliberately set
       to Padrauna and not Kasia, because that is where the demand is. */
    geo: { lat: 26.9008, lng: 83.98 },

    updated: "2026-09-09",
    order: 13,
    published: true,

    /* 42 characters; the root layout appends " | MedicoBharat" (template in
       src/app/layout.js), so Google renders 57 — inside the ~60 it shows.

       This is the ONLY page in the section that leads with "Diagnostic Centre",
       and that is the point. Eleven city titles used to read "Lab Test in <X> —
       Blood Test at Home", so the whole section competed for one phrase pair
       with the town name as the only difference; every title is now a different
       lead + tail pairing (see the block comment above defaultTitle in
       src/data/lab/defaults.js). Here the lead term is the one this town types
       when it is looking for a place rather than a test, and the tail keeps
       "Blood Test" so the bigger query survives beside it.

       "Centre" is the British spelling and it is used consistently on this page
       — title, the H2 in content/padrauna.js, `keywords` and the FAQ. Google
       treats the two spellings as the same word, so mixing them buys nothing
       and just reads as a typo. */
    title: "Diagnostic Centre in Padrauna — Blood Test",

    // ~152 characters, so it renders whole on desktop and mobile. Written to
    // NOT read like Kushinagar's snippet: that one names the district's block
    // towns, this one names streets, which is what separates the two results
    // when both show for one regional query.
    description:
      "Padrauna me blood test ghar baithe book karein — Durga Chowk, Bank Road, Station Road aur Ramkola Road tak free home sample collection, report 24 ghante me.",

    /* The h1 renders as real text in the hero (see LabHero.jsx), so it opens
       with the phrase people type and stops; the secondary terms sit in
       `h1Sub`, inside a sentence. Budget: h1 under ~60 characters, h1Sub under
       ~140. Same rule as Salempur's — do not turn either into a list of
       comma-separated variants. */
    hero: {
      h1: "Lab Test in Padrauna — Blood Test Ghar Baithe",
      h1Sub:
        "Padrauna ke har mohalle me pathology lab ke test ghar par — free home sample collection, report 24 ghante me WhatsApp par.",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out rather than taking defaultKeywords(), which would produce
       "<template> in Padrauna" nine times plus one line per area. The list is
       the town's four intents, in the order they convert: the service itself,
       the "where do I have to go" search (pathology lab / diagnostic centre /
       medical laboratory, all three of which mean the same thing to the person
       typing them), the booking search, and the two tests this town asks for
       most.

       The landmark long-tails ("pathology lab near Durga Chowk", "blood test
       near Central Bank Road") are NOT listed here even though they are real
       searches — they belong in the visible copy, where they appear in the
       mohalla section and its FAQ, and a keywords list is not where a long-tail
       is won. `keywords` is a weak-to-zero ranking signal by itself; the reason
       to keep it honest is that it is the checklist the page's headings, FAQs
       and prose are written against. Every term below appears in the visible
       copy — a keyword that appears ONLY here is the kind that gets a page
       filtered. */
    keywords: [
      "Lab Test in Padrauna",
      "Blood Test in Padrauna",
      "Blood Test at Home in Padrauna",
      "Home Sample Collection in Padrauna",
      "Pathology Lab in Padrauna",
      "Diagnostic Centre in Padrauna",
      "Medical Laboratory in Padrauna",
      "Online Blood Test Booking in Padrauna",
      "Full Body Checkup in Padrauna",
      "Thyroid Test in Padrauna",
      "Sugar Test in Padrauna",
      "Lab Test Near Me in Padrauna"
    ],

    /* Closing call strip. The heading IS one tracked search phrase, title
       cased — no tail, no second keyword. See defaultCallBanner in
       src/data/lab/defaults.js for which phrase each city takes and why. */
    callBanner: {
      heading: "Blood Test at Home in Padrauna",
    },

    /* Same rule as the strip above — ONE tracked phrase, and a different one
       from the strip's, so the page uses two of its phrases rather than one
       twice. This one takes "online blood test booking in padrauna", which the
       booking section answers directly.
       `intro` and the five steps come from defaultHowTo and are unchanged:
       they describe a procedure, and a procedure is the same in every town. */
    howTo: { heading: "How to book a blood test online in Padrauna" },

    content: padraunaContent,
    faqs: padraunaFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. This block matters more
       here than on most cities: a brand-new URL inside a district that already
       has a page gets crawled through links, not the sitemap alone, and the
       link to the district page has to run BOTH ways or a crawler reads the two
       as unrelated. Kushinagar's block links back — see its entry above.

       Every href is checked against a real route: the cities in this seed and
       the guides in content/blogs/deoria/. There is no content/blogs/padrauna/
       yet, so nothing points at one. */
    relatedLinks: {
      heading: "Padrauna Ke Aas-paas Aur Aage Ki Jaankari",
      intro:
        "Jile ke doosre kasbon ka page, wo sheher jahan imaging ya specialist ke liye jaana padta hai, aur ye tay karne ke liye guide ki kaun sa test kab karana chahiye.",
      groups: [
        {
          title: "Aas-paas Ke Sheher",
          links: [
            {
              href: "/lab-test/kushinagar",
              label: "Kushinagar jile me lab test",
              sub: "Kasia, Hata, Khadda aur Tamkuhi Raj ki taraf rehte hain to",
            },
            {
              href: "/lab-test/gorakhpur",
              label: "Gorakhpur me lab test",
              sub: "Kareeb 50 km — specialist aur imaging wahin hain",
            },
            {
              href: "/lab-test/deoria",
              label: "Deoria me lab test",
              sub: "Dakshin ka padosi zila — wahan bhi yahi home collection",
            },
          ],
        },
        {
          title: "Test Chunne Me Madad",
          links: [
            {
              href: "/blogs/pathology-lab/deoria",
              label: "Pathology lab kaise chunein — paanch sawaal",
              sub: "Daam, ID card, report ka samay — kya poochhna chahiye",
            },
            {
              href: "/blogs/lab-test/deoria",
              label: "Kaun sa test kab karayein — is belt ke liye guide",
              sub: "Shikayat, umar aur mausam ke hisaab se",
            },
            {
              href: "/blogs/full-body-checkup/deoria",
              label: "Full body checkup me kya hona chahiye",
              sub: "Package me kya chhoot jaata hai, umar ke hisaab se kaun sa level",
            },
            {
              href: "/blogs/diabetes-thyroid-test/deoria",
              label: "Sugar, thyroid aur HbA1c — kis mahine kaunsa test",
              sub: "Fasting, PP ya HbA1c, aur TSH kab dohrana hai",
            },
            {
              href: "/blogs/lab-test/deoria#report-kaise-padhein",
              label: "Report aa gayi — ab ise kaise padhein",
            },
          ],
        },
      ],
    },
  },

  {
    /* ── SIWAN — THE FIRST BIHAR DISTRICT ON THIS SITE ───────────────────
       Every other city here is Uttar Pradesh, and that is not a cosmetic
       difference. `state` feeds the footer address line and `addressRegion` in
       the LocalBusiness schema, so this entry is the first one that makes the
       markup say Bihar — check it renders as Bihar and not the DEFAULT_STATE
       fallback before any paid push.

       It also breaks the referral pattern every other page here argues from.
       Deoria, Kushinagar and Salempur all say "the specialists are in
       Gorakhpur, skip the journey". Siwan is pulled three ways at once —
       Chhapra (~60 km) for the divisional hospital, Patna (~135 km) for PMCH
       and IGIMS, and Gorakhpur (~110 km) across the border, which is nearer
       than its own state capital. The copy names all three; see
       content/siwan.js. */
    slug: "siwan",
    name: "Siwan",
    state: "Bihar",

    /* ⚠ VERIFY THIS LIST AGAINST THE ROUTE BEFORE PUSHING TRAFFIC AT IT.
       These are the district headquarters and the block towns along the main
       roads — the ones a collection round can plausibly reach. They are not
       decorative: they render in the footer, fill the booking form's dropdown,
       become `areaServed` in the schema, and are what a "<kasba> me blood
       test" search matches on. An areaServed we cannot serve is a lie in
       schema form, so trim anything the round does not actually cover rather
       than leaving it in to catch a query.

       Kept to twelve. Hussainganj, Nautan, Lakri Nabiganj, Siswan and
       Bhagwanpur Hat are named in the page copy instead — a twenty-item
       dropdown is unusable on a phone. */
    areas: [
      "Siwan Sadar",
      "Maharajganj",
      "Mairwa",
      "Barharia",
      "Andar",
      "Basantpur",
      "Darauli",
      "Guthani",
      "Raghunathpur",
      "Pachrukhi",
      "Hasanpura",
      "Goriakothi",
    ],

    // Siwan town PIN. Schema only — nobody on the page ever reads this field,
    // so a wrong value would sit in the markup unnoticed. Worth checking
    // against a delivery slip.
    postalCode: "841226",

    /* Siwan town centre, and approximate on purpose — same rule as every other
       city: there is no walk-in counter here, this is a home-collection service
       area, and a precise street pin in the schema would be a claim we cannot
       keep. Google reads `geo` on a service-area business as "roughly here",
       which is true. */
    geo: { lat: 26.2214, lng: 84.3597 },

    updated: "2026-08-29",
    order: 9,
    published: true,

    /* No CITY_ALIASES entry. "Sivan" and "Siwaan" are misspellings of the same
       name, not a different name the town is known by — and the rule set with
       Deoria stands: an alias is worth adding only for a genuinely different
       name (Varanasi → Banaras). Putting a wrong spelling in the metadata
       publishes it in our own name. */

    // 38 characters. It has to stay short: the root layout appends
    // " | MedicoBharat", so what Google renders is 53 — inside the ~60 it will
    // show. The lead is the full service phrase rather than the bare "Lab Test
    // in Siwan" this used to open with — one pairing per city now, see the
    // block comment above defaultTitle in src/data/lab/defaults.js.
    title: "Blood Test at Home in Siwan — Lab Test",

    // ~152 characters, so it renders whole on desktop and mobile. Hinglish
    // deliberately: the page is Hinglish and so is the searcher here, and a
    // snippet in the reader's own register wins the click. The English terms
    // that must match ("lab test", "blood test", "full body checkup") are all
    // still in it. Bihar is named because this is the site's only Bihar page
    // and "Siwan" alone is ambiguous to anyone outside the belt.
    description:
      "Siwan (Bihar) me lab test aur blood test ghar baithe book karein — CBC, thyroid, sugar aur full body checkup. Free home sample collection, report 24 ghante me.",

    /* h1 under ~60 characters, h1Sub under ~140 — the budget set when the h1
       stopped being sr-only. The h1 opens with the phrase people actually type
       and stops; the secondary terms live in h1Sub, inside a real sentence,
       where they are worth more than they would be crammed into a heading. */
    hero: {
      h1: "Lab Test in Siwan — Blood Test Ghar Baithe",
      h1Sub:
        "Pathology lab ke saare test aur full body checkup — Siwan me free home sample collection, report 24 ghante me WhatsApp par.",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out instead of taking defaultKeywords(), which would only
       produce "<template> in Siwan" nine times plus one line per area. That
       misses what Siwan traffic actually is: test-wise long-tail, which
       converts because the searcher has already decided, and the district's
       own two intents — the Gulf-bound worker and the Chhapra/Patna traveller.

       Ordered strongest first. `keywords` is a weak-to-zero ranking signal on
       its own; the reason to keep it honest is that it is the checklist the
       headings, FAQs and prose are written against. Every term below appears
       in the visible copy. A keyword that appears ONLY here is the kind that
       gets a page filtered, not ranked — which is also why there is no
       "GAMCA" or "Wafid" term in this list: the page says plainly that we do
       not do that medical, so ranking for it would be a bait. */
    keywords: [
      "Lab Test at Home in Siwan",
      "Blood Test at Home in Siwan",
      "Home Sample Collection in Siwan",
      "Blood Test in Siwan",
      "Lab Test in Siwan Bihar",
      "Diagnostic Lab in Siwan",
      "Pathology Lab in Siwan",
      "Full Body Checkup in Siwan",
      "Full Body Checkup at Home in Siwan",
      "CBC Test Price in Siwan",
      "Thyroid Test in Siwan",
      "Sugar Test at Home in Siwan",
      "Dengue Test in Siwan",
      "Home Collection Lab in Siwan",
      "Lab Test Near Me in Siwan",
      "सीवान में लैब टेस्ट",
      "सीवान में ब्लड टेस्ट घर पर",
      "सीवान में फुल बॉडी चेकअप",
    ],

    /* Closing call strip. The heading IS one tracked search phrase, title
       cased — no tail, no second keyword. See defaultCallBanner in
       src/data/lab/defaults.js for which phrase each city takes and why. */
    callBanner: {
      heading: "Lab Test at Home in Siwan",
    },

    /* Same rule as the strip above — ONE tracked phrase, and a different one
       from the strip's, so the page uses two of its phrases rather than one
       twice. Not on the tracked list; written in the same shape as its neighbours.
       `intro` and the five steps come from defaultHowTo and are unchanged:
       they describe a procedure, and a procedure is the same in every town. */
    howTo: { heading: "How to book a blood test at home in Siwan" },

    content: siwanContent,
    faqs: siwanFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. The other cities are in
       the footer too, but a footer is byte-identical on every lab page and gets
       discounted as boilerplate; these anchors are descriptive and per-city.

       Siwan has no guide of its own yet, so the "test chunne me madad" group
       points at the Deoria and Varanasi guides — the questions they answer
       (which test on which day, how to read a report, what belongs in a
       package) are district-neutral. If a Siwan guide is ever written, it goes
       first in that group, the way Deoria's does on its own page.

       Every href here is checked against a real route: the guides live in
       content/blogs/ and the cities in the seed above. */
    relatedLinks: {
      heading: "Siwan Ke Liye Aage Ki Jaankari",
      intro:
        "Kaun sa test kab karana chahiye, report ke numbers ka matlab, aur seemaa ke us paar ke jile — sab ek jagah.",
      groups: [
        {
          title: "Test Chunne Me Madad",
          links: [
            {
              href: "/blogs/lab-test/deoria",
              label: "Kaun sa test kab karayein — poori guide",
              sub: "Package, bukhar ka din, bade sheher jaane se pehle ki taiyaari",
            },
            {
              href: "/blogs/full-body-checkup/varanasi",
              label: "Full body checkup me kya hona chahiye",
              sub: "\"80+ parameters\" ka sach, aur kya chhod dena chahiye",
            },
            {
              href: "/blogs/lab-test/varanasi#fasting-aur-taiyari",
              label: "Blood test se pehle fasting aur taiyaari",
            },
            {
              href: "/blogs/lab-test/varanasi#report-kaise-padhein",
              label: "Report aa gayi — ab ise kaise padhein",
            },
          ],
        },
        {
          title: "Aas-Paas Ke Jile",
          links: [
            // Bihar ka doosra page aur sabse nazdeek zila — kareeb 30 km,
            // uttar ki taraf. Gopalganj ka page is page ke Gulf aur kala-azar
            // wale hisson me link karta hai, isliye link dono taraf hai: ek
            // naya URL sitemap se nahi, links se crawl hota hai.
            {
              href: "/lab-test/gopalganj",
              label: "Gopalganj me lab test",
              sub: "Kareeb 30 km uttar — Gandak patti aur Thawe ki taraf ka zila",
            },
            // Seema ke us paar ka sabse nazdeek page. Siwan ka paschimi hissa
            // Bhatni-Salempur ki taraf khulta hai.
            {
              href: "/lab-test/salempur",
              label: "Salempur me lab test",
              sub: "Bhatni aur Lar ki taraf ka seemaa se laga ilaaka",
            },
            {
              href: "/lab-test/deoria",
              label: "Deoria me lab test",
              sub: "UP ki taraf ka zila mukhyalaya, kareeb 60 km",
            },
            {
              href: "/lab-test/gorakhpur",
              label: "Gorakhpur me lab test",
              sub: "Specialist ki OPD dikhani ho to report pehle taiyaar",
            },
            {
              href: "/lab-test/varanasi",
              label: "Varanasi me lab test",
              sub: "Imaging ya bade sansthan ke liye jaana ho to",
            },
          ],
        },
      ],
    },
  },

  {
    /* ── GHAZIPUR — THE DISTRICT THAT IS TOO CLOSE TO VARANASI ───────────
       Its page argues the opposite of Deoria's and Siwan's. Those two are far
       from everything, so their copy says "skip the journey". Ghazipur is
       about 80 km from Varanasi on a direct road and a direct train, and that
       closeness is the habit the page addresses: a family will travel for a
       CBC because going is easier than finding out what is available at home.

       That distinction is not decoration. Four neighbouring districts already
       have pages here — Ballia, Mau, Azamgarh, Varanasi — and a fifth that
       repeated any of their arguments would be read as a doorway page and
       indexed as none of them. See the header of content/ghazipur.js for which
       argument belongs to which district, and read it before editing this
       city's copy. */
    slug: "ghazipur",
    name: "Ghazipur",
    state: "Uttar Pradesh",

    /* City localities first, then the tehsil and block towns collection
       actually reaches. These are not decorative: they render in the footer,
       fill the booking form's dropdown, become `areaServed` in the schema, and
       are what a "<kasba> me blood test" search matches on. An areaServed we
       cannot serve is a lie in schema form — trim anything the round does not
       cover rather than leaving it in to catch a query.

       Kept to twelve. Bahadurganj, Karanda, Deokali, Mardah, Baraachawar and
       Manihari are named in the page copy instead: a twenty-item dropdown is
       unusable on a phone. */
    areas: [
      "Ghazipur City",
      "Lanka",
      "Mahuabagh",
      "Nandganj",
      "Zamania",
      "Saidpur",
      "Mohammadabad",
      "Kasimabad",
      "Jakhanian",
      "Dildarnagar",
      "Gahmar",
      "Sevrai",
    ],

    // Ghazipur city PIN. Schema only — nobody on the page ever reads this
    // field, so a wrong value would sit in the markup unnoticed. Worth
    // checking against a delivery slip.
    postalCode: "233001",

    /* Ghazipur town centre, and approximate on purpose — same rule as every
       other city: there is no walk-in counter here, this is a home-collection
       service area, and a precise street pin in the schema would be a claim we
       cannot keep. Google reads `geo` on a service-area business as "roughly
       here", which is true. */
    geo: { lat: 25.5788, lng: 83.5776 },

    updated: "2026-08-29",
    order: 10,
    published: true,

    /* No CITY_ALIASES entry. "Gazipur" and "Ghazeepur" are misspellings of the
       same name, not a different name the town is known by — and the rule set
       with Deoria stands: an alias is worth adding only for a genuinely
       different name (Varanasi → Banaras). Putting a wrong spelling in the
       metadata publishes it in our own name. */

    // 41 characters. It has to stay short: the root layout appends
    // " | MedicoBharat", so what Google renders is 56 — inside the ~60 it will
    // show. Primary keyword first, then this page's own second query — the
    // "Blood Test at Home" tail it used to carry was on ten other cities too,
    // see the block comment above defaultTitle in src/data/lab/defaults.js.
    title: "Lab Test in Ghazipur — Blood Test Booking",

    // ~151 characters, so it renders whole on desktop and mobile. Hinglish
    // deliberately: the page is Hinglish and so is the searcher here, and a
    // snippet in the reader's own register wins the click. The English terms
    // that must match ("lab test", "blood test", "full body checkup") are all
    // still in it.
    description:
      "Ghazipur me lab test aur blood test ghar baithe book karein — CBC, thyroid, sugar aur full body checkup. Free home sample collection, report 24 ghante me.",

    /* h1 under ~60 characters, h1Sub under ~140 — the budget set when the h1
       stopped being sr-only. The h1 opens with the phrase people actually type
       and stops; the secondary terms live in h1Sub, inside a real sentence,
       where they are worth more than they would be crammed into a heading. */
    hero: {
      h1: "Lab Test in Ghazipur — Blood Test Ghar Baithe",
      h1Sub:
        "Pathology lab ke saare test aur full body checkup — Ghazipur me free home sample collection, report 24 ghante me WhatsApp par.",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out instead of taking defaultKeywords(), which would only
       produce "<template> in Ghazipur" nine times plus one line per area.
       That misses what Ghazipur traffic actually is: test-wise long-tail,
       which converts because the searcher has already decided, the two biggest
       block towns as their own terms, and Devanagari, which is how a large
       share of this district types.

       Ordered strongest first. `keywords` is a weak-to-zero ranking signal on
       its own; the reason to keep it honest is that it is the checklist the
       headings, FAQs and prose are written against. Every term below appears
       in the visible copy. A keyword that appears ONLY here is the kind that
       gets a page filtered, not ranked — which is also why there is no "army
       medical" or "bharti medical" term in this list: the page says plainly
       that we do not do that medical, so ranking for it would be a bait. */
    keywords: [
      "Lab Test at Home in Ghazipur",
      "Blood Test at Home in Ghazipur",
      "Home Sample Collection in Ghazipur",
      "Blood Test in Ghazipur",
      "Diagnostic Lab in Ghazipur",
      "Pathology Lab in Ghazipur",
      "Full Body Checkup in Ghazipur",
      "Full Body Checkup at Home in Ghazipur",
      "CBC Test Price in Ghazipur",
      "Thyroid Test in Ghazipur",
      "Sugar Test at Home in Ghazipur",
      "Dengue Test in Ghazipur",
      "Lab Test in Zamania",
      "Blood Test in Mohammadabad Ghazipur",
      "Home Collection Lab in Ghazipur",
      "Lab Test Near Me in Ghazipur",
      "ग़ाज़ीपुर में लैब टेस्ट",
      "गाजीपुर में ब्लड टेस्ट घर पर",
      "गाजीपुर में फुल बॉडी चेकअप",
    ],

    /* Closing call strip. The heading IS one tracked search phrase, title
       cased — no tail, no second keyword. See defaultCallBanner in
       src/data/lab/defaults.js for which phrase each city takes and why. */
    callBanner: {
      heading: "Blood Test at Home in Ghazipur",
    },

    /* Same rule as the strip above — ONE tracked phrase, and a different one
       from the strip's, so the page uses two of its phrases rather than one
       twice. Not on the tracked list; written in the same shape as its neighbours.
       `intro` and the five steps come from defaultHowTo and are unchanged:
       they describe a procedure, and a procedure is the same in every town. */
    howTo: { heading: "How to book a lab test at home in Ghazipur" },

    content: ghazipurContent,
    faqs: ghazipurFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. The other cities are in
       the footer too, but a footer is byte-identical on every lab page and gets
       discounted as boilerplate; these anchors are descriptive and per-city.

       Ghazipur has no guide of its own yet, so the "test chunne me madad"
       group points at the Varanasi guides — which is the right fallback here
       rather than Deoria's, because Varanasi is this district's own referral
       city and the guide is written from there. If a Ghazipur guide is ever
       written, it goes first in that group.

       Every href here is checked against a real route: the guides live in
       content/blogs/ and the cities in the seed above. */
    relatedLinks: {
      heading: "Ghazipur Ke Liye Aage Ki Jaankari",
      intro:
        "Kaun sa test kab karana chahiye, report ke numbers ka matlab, aur aas-paas ke jile — sab ek jagah.",
      groups: [
        {
          title: "Test Chunne Me Madad",
          links: [
            {
              href: "/blogs/lab-test/varanasi",
              label: "Kaun sa test kab karayein — poori guide",
              sub: "Shikayat, umar aur mausam ke hisaab se",
            },
            {
              href: "/blogs/full-body-checkup/varanasi",
              label: "Full body checkup me kya hona chahiye",
              sub: "\"80+ parameters\" ka sach, aur kya chhod dena chahiye",
            },
            {
              href: "/blogs/lab-test/varanasi#fasting-aur-taiyari",
              label: "Blood test se pehle fasting aur taiyaari",
            },
            {
              href: "/blogs/lab-test/varanasi#report-kaise-padhein",
              label: "Report aa gayi — ab ise kaise padhein",
            },
          ],
        },
        {
          title: "Aas-Paas Ke Jile",
          links: [
            {
              href: "/lab-test/varanasi",
              label: "Varanasi me lab test",
              sub: "Kareeb 80 km — imaging ya specialist ke liye jaana ho to",
            },
            {
              href: "/lab-test/ballia",
              label: "Ballia me lab test",
              sub: "Ganga patti, diara ke gaon aur paani se judi jaanch",
            },
            {
              href: "/lab-test/mau",
              label: "Mau me lab test",
              sub: "Ghosi, Madhuban aur Doharighat ki taraf ka padosi zila",
            },
            {
              href: "/lab-test/azamgarh",
              label: "Azamgarh me lab test",
              sub: "Mandal mukhyalaya, uttar-paschim ki taraf",
            },
          ],
        },
      ],
    },
  },

  {
    /* ── GOPALGANJ — THE DISTRICT WHERE NOTHING IS CLOSE ─────────────────
       Bihar #2 on this site, and it must not repeat Bihar #1. Siwan's page
       argues a three-way pull (Chhapra, Patna, Gorakhpur) and owns the Gulf
       migration and kala-azar copy. Gopalganj's argument is one degree past
       that: Siwan itself is ~30 km but is only another district town, and
       after it Chhapra (~85 km), Muzaffarpur (~100 km across the Gandak),
       Gorakhpur (~120 km on NH-27) and Patna (~150 km) sit in four different
       directions — so the journey here is not one decision but four, and for
       some weeks a year the Gandak decides which road is usable at all.

       Read the header of content/gopalganj.js before editing this city's
       copy; it records which argument belongs to which district and, more
       importantly, the two places this page deliberately says NO — RT-PCR,
       which we do not run, and a flooded diara tola, which a collection round
       cannot reach. Neither of those is a gap to be filled in later. */
    slug: "gopalganj",
    name: "Gopalganj",
    state: "Bihar",

    /* ⚠ VERIFY THIS LIST AGAINST THE ROUTE BEFORE PUSHING TRAFFIC AT IT.
       District headquarters plus the block towns along the main roads — the
       ones a collection round can plausibly reach. They are not decorative:
       they render in the footer, fill the booking form's dropdown, become
       `areaServed` in the schema, and are what a "<kasba> me blood test"
       search matches on. An areaServed we cannot serve is a lie in schema
       form, so trim anything the round does not actually cover rather than
       leaving it in to catch a query.

       Kept to twelve. Vijayipur, Phulwaria, Panchdeori and Sasamusa are named
       in the page copy instead — a twenty-item dropdown is unusable on a
       phone. */
    areas: [
      "Gopalganj City",
      "Thawe",
      "Hathua",
      "Mirganj",
      "Kuchaikote",
      "Barauli",
      "Sidhwalia",
      "Baikunthpur",
      "Manjha",
      "Uchkagaon",
      "Bhore",
      "Kateya",
    ],

    // Gopalganj town PIN. Schema only — nobody on the page ever reads this
    // field, so a wrong value would sit in the markup unnoticed. Worth
    // checking against a delivery slip.
    postalCode: "841428",

    /* Gopalganj town centre, and approximate on purpose — same rule as every
       other city: there is no walk-in counter here, this is a home-collection
       service area, and a precise street pin in the schema would be a claim we
       cannot keep. */
    geo: { lat: 26.4676, lng: 84.4334 },

    updated: "2026-09-01",
    order: 11,
    published: true,

    /* No CITY_ALIASES entry. "Gopalgunj" is a misspelling of the same name,
       not a different name the town is known by — the rule set with Deoria
       stands. Note that there is also a Gopalganj in Bangladesh, which is why
       "Bihar" is carried in the description and the Hindi section: the name
       alone is ambiguous to a search engine, and disambiguating it in the copy
       is worth more than any alias would be. */

    // 43 characters. It has to stay short: the root layout appends
    // " | MedicoBharat", so what Google renders is 58 — inside the ~60 it will
    // show. "Blood Test in Gopalganj" is the exact phrase and leads; the
    // package query takes the tail, and that pairing is this page's own — see
    // the block comment above defaultTitle in src/data/lab/defaults.js.
    title: "Blood Test in Gopalganj — Full Body Checkup",

    // ~152 characters, so it renders whole on desktop and mobile. Hinglish
    // deliberately: the page is Hinglish and so is the searcher here. Bihar is
    // named for the disambiguation reason noted above.
    description:
      "Gopalganj (Bihar) me lab test aur blood test ghar baithe book karein — CBC, thyroid, sugar, full body checkup. Free home collection, report 24 ghante me.",

    /* h1 under ~60 characters, h1Sub under ~140 — the budget set when the h1
       stopped being sr-only. The h1 opens with the phrase people actually type
       and stops; the secondary terms live in h1Sub, inside a real sentence. */
    hero: {
      h1: "Lab Test in Gopalganj — Blood Test Ghar Baithe",
      h1Sub:
        "Pathology lab ke saare test aur full body checkup — Gopalganj (Bihar) me free home sample collection, report 24 ghante me WhatsApp par.",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out instead of taking defaultKeywords(), which would only
       produce "<template> in Gopalganj" nine times plus one line per area.
       That misses what this district's traffic actually is: test-wise
       long-tail, the in-town landmarks people navigate by (Station Road, the
       bus stand, the market), the two block towns big enough to be searched on
       their own (Thawe, Hathua), and Devanagari, which is how a large share of
       this district types.

       Ordered strongest first. `keywords` is a weak-to-zero ranking signal on
       its own; the reason to keep it honest is that it is the checklist the
       headings, FAQs and prose are written against. Every term below appears
       in the visible copy — the two comparative ones ("Affordable…",
       "Best Diagnostic Centre…") appear in the FAQ questions, and their
       answers refuse the boast and give checkable facts instead.

       ⚠ NO RT-PCR TERM, deliberately, even though it was on the brief. We do
       not run RT-PCR (see `rt-pcr-covid-gopalganj` in content/gopalganj.js,
       which says so plainly). A keyword for a test we cannot perform is the
       kind that gets a page filtered rather than ranked — and it ends at a
       doorstep with a phlebotomist who has to say no. Same rule as GAMCA on
       Siwan and the recruitment medical on Ghazipur. */
    keywords: [
      "Lab Test in Gopalganj",
      "MedicoBharat Lab Test Gopalganj",
      "Blood Test Home Collection in Gopalganj",
      "Lab Test at Home in Gopalganj",
      "Pathology Lab Near Me in Gopalganj",
      "MedicoBharat Pathology Gopalganj Bihar",
      "Diagnostic Centre in Gopalganj",
      "Best Diagnostic Centre in Gopalganj",
      "Affordable Lab Tests in Gopalganj",
      "Book Blood Test Online in Gopalganj",
      "Same Day Lab Test Reports in Gopalganj",
      "Home Sample Collection in Gopalganj",
      "Full Body Checkup Package in Gopalganj",
      "Full Body Checkup at Home in Gopalganj",
      "Thyroid Test Price in Gopalganj",
      "Diabetes Checkup Lab in Gopalganj",
      "Liver Function Test in Gopalganj",
      "CBC Test Price in Gopalganj",
      "Dengue Test in Gopalganj",
      "Lab Test Near Bus Stand Gopalganj",
      "Blood Test Near Station Road Gopalganj",
      "Blood Testing Lab in Gopalganj Market",
      "Lab Test in Thawe Gopalganj",
      "Blood Test in Hathua Gopalganj",
      "Lab Test in Gopalganj Bihar",
      "गोपालगंज में लैब टेस्ट",
      "गोपालगंज में ब्लड टेस्ट घर पर",
      "गोपालगंज में फुल बॉडी चेकअप",
      "गोपालगंज में थायराइड टेस्ट",
    ],

    /* Closing call strip. The heading IS one tracked search phrase, title
       cased — no tail, no second keyword. See defaultCallBanner in
       src/data/lab/defaults.js for which phrase each city takes and why. */
    callBanner: {
      heading: "Blood Test Home Collection in Gopalganj",
    },

    /* Same rule as the strip above — ONE tracked phrase, and a different one
       from the strip's, so the page uses two of its phrases rather than one
       twice. This one takes "book blood test online gopalganj".
       `intro` and the five steps come from defaultHowTo and are unchanged:
       they describe a procedure, and a procedure is the same in every town. */
    howTo: { heading: "How to book a blood test online in Gopalganj" },

    content: gopalganjContent,
    faqs: gopalganjFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. The other cities are in
       the footer too, but a footer is byte-identical on every lab page and
       gets discounted as boilerplate; these anchors are descriptive and
       per-city.

       Gopalganj has no guide of its own yet, so the "test chunne me madad"
       group points at the Deoria guide — the right fallback here rather than
       Varanasi's, because Deoria is written from the same side of the border
       and answers the same district-neutral questions.

       Siwan comes first among the neighbours: it is the nearest page, the only
       other Bihar page, and it carries the migration and kala-azar sections
       this page links into rather than repeats. Siwan's own relatedLinks
       points back here, so the link runs both ways — a new URL is crawled from
       links, not from the sitemap.

       Every href here is checked against a real route: the guides live in
       content/blogs/ and the cities in the seed above. */
    relatedLinks: {
      heading: "Gopalganj Ke Liye Aage Ki Jaankari",
      intro:
        "Kaun sa test kab karana chahiye, report ke numbers ka matlab, aur aas-paas ke jile — sab ek jagah.",
      groups: [
        {
          title: "Test Chunne Me Madad",
          links: [
            {
              href: "/blogs/lab-test/deoria",
              label: "Kaun sa test kab karayein — poori guide",
              sub: "Package, bukhar ka din, bade sheher jaane se pehle ki taiyaari",
            },
            {
              href: "/blogs/full-body-checkup/varanasi",
              label: "Full body checkup me kya hona chahiye",
              sub: "\"80+ parameters\" ka sach, aur kya chhod dena chahiye",
            },
            {
              href: "/blogs/lab-test/varanasi#fasting-aur-taiyari",
              label: "Blood test se pehle fasting aur taiyaari",
            },
            {
              href: "/blogs/lab-test/varanasi#report-kaise-padhein",
              label: "Report aa gayi — ab ise kaise padhein",
            },
          ],
        },
        {
          title: "Aas-Paas Ke Jile",
          links: [
            {
              href: "/lab-test/siwan",
              label: "Siwan me lab test",
              sub: "Kareeb 30 km — bahar jaane walon ki jaanch aur lamba bukhar wahan likha hai",
            },
            {
              href: "/lab-test/deoria",
              label: "Deoria me lab test",
              sub: "Seema ke us paar UP ka zila mukhyalaya",
            },
            {
              href: "/lab-test/kushinagar",
              label: "Kushinagar me lab test",
              sub: "NH-27 par Gorakhpur ki taraf, ganna patti ka ilaaka",
            },
            {
              href: "/lab-test/gorakhpur",
              label: "Gorakhpur me lab test",
              sub: "Specialist ki OPD dikhani ho to report pehle taiyaar",
            },
          ],
        },
      ],
    },
  },

  {
    /* ── LUCKNOW — THE FIRST METRO, AND THE FIRST CITY WHOSE DISTANCE IS
       INTERNAL ──────────────────────────────────────────────────────────
       Every other page in this seed argues about a journey BETWEEN towns.
       Lucknow's argues about a journey inside one: Gomti Nagar to Alambagh,
       Jankipuram to Telibagh, Chinhat to Rajajipuram — each roughly 20 to 25
       km of city traffic, which is what actually postpones a fasting test
       here. Nobody in this city is short of labs; they are short of a free
       morning.

       Read the header of content/lucknow.js before editing this city's copy.
       It records why this is NOT Varanasi's "skip the queue" and NOT
       Gorakhpur's "time it around your appointment", and it carries three
       warnings that matter more here than anywhere else on the site:

         · no accreditation claim, because Lucknow is where the accredited
           chains actually operate and a borrowed claim is catchable here;
         · no speed promise, because we are not faster than this city's
           traffic and the page says so;
         · SGPGI, KGMU, RMLIMS, Balrampur and Civil are named as GEOGRAPHY
           only — no association, ever. Same rule as AIIMS on Gorakhpur. */
    slug: "lucknow",
    name: "Lucknow",
    state: "Uttar Pradesh",

    /* ⚠ VERIFY THIS LIST AGAINST THE ROUTE BEFORE PUSHING TRAFFIC AT IT.
       These render in the footer, fill the booking form's dropdown, become
       `areaServed` in the schema, and are what a "<mohalla> me blood test"
       search matches on. An areaServed we cannot serve is a lie in schema
       form — trim anything the round does not cover rather than leaving it in
       to catch a query.

       SIXTEEN, not the twelve every district gets, and that is a deliberate
       exception rather than drift: a district's twelve are its block towns and
       they cover it, whereas Lucknow has more than forty localities anyone
       would recognise and a twelve-item list would simply be wrong for most
       readers. Sixteen is the most a phone dropdown stays usable at. About
       thirty more — Kaiserbagh, Nishatganj, Thakurganj, Aishbagh, Balaganj,
       Daliganj, Nirala Nagar, LDA Colony, Bangla Bazaar, Krishna Nagar,
       Sarojini Nagar, Vrindavan Yojana, Sushant Golf City, Gudamba, Triveni
       Nagar, Dubagga, Amausi and the rest — are named in the page copy
       instead, which is where they do their work anyway. Do NOT push this list
       past sixteen; add to the copy. */
    areas: [
      "Hazratganj",
      "Gomti Nagar",
      "Indira Nagar",
      "Aliganj",
      "Mahanagar",
      "Nishatganj",
      "Chinhat",
      "Jankipuram",
      "Vikas Nagar",
      "Rajajipuram",
      "Alambagh",
      "Charbagh",
      "Aminabad",
      "Chowk",
      "Ashiyana",
      "Telibagh",
    ],

    // Hazratganj / GPO PIN. Schema only — nobody on the page ever reads this
    // field, so a wrong value would sit in the markup unnoticed.
    postalCode: "226001",

    /* City centre, and approximate on purpose — same rule as every other city,
       and it matters most here: there is no walk-in counter in Lucknow, this
       is a home-collection service area covering the whole city, and a precise
       street pin would read as a branch address we do not have. */
    geo: { lat: 26.8467, lng: 80.9462 },

    updated: "2026-09-01",
    order: 12,
    published: true,

    /* No CITY_ALIASES entry. "Lakhnau" is the same name transliterated, not a
       different name the city is known by — the rule set with Deoria stands.
       (Varanasi → Banaras is the only genuine alias on this site so far.) */

    // 42 characters. It has to stay short: the root layout appends
    // " | MedicoBharat", so what Google renders is 57 — inside the ~60 it will
    // show. "Pathology lab" leads because in a city this size the search is for
    // a PLACE, and this page's whole argument is that the nearest place on the
    // map is not the nearest one in traffic. See content/lucknow.js.
    title: "Pathology Lab in Lucknow — Home Collection",

    // ~151 characters, so it renders whole on desktop and mobile. Four
    // localities are spent in the snippet on purpose: this page's whole
    // argument is per-mohalla, and a searcher in Gomti Nagar who sees her own
    // locality in the snippet clicks a result she would otherwise scroll past.
    description:
      "Lucknow me lab test aur blood test ghar baithe book karein — Gomti Nagar, Hazratganj, Indira Nagar, Alambagh. Free home collection, report 24 ghante me.",

    /* h1 under ~60 characters, h1Sub under ~140 — the budget set when the h1
       stopped being sr-only. The h1 opens with the phrase people actually type
       and stops; the secondary terms live in h1Sub, inside a real sentence. */
    hero: {
      h1: "Lab Test in Lucknow — Blood Test Ghar Baithe",
      h1Sub:
        "Gomti Nagar se Alambagh tak poore Lucknow me free home sample collection — saare pathology test aur full body checkup, report 24 ghante me.",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out instead of taking defaultKeywords(), which would produce
       "<template> in Lucknow" nine times plus one line per area — and in a
       metro that is exactly the wrong shape. What this city's traffic actually
       is: test-wise long-tail with a price intent, and above all MOHALLA-WISE
       queries, because "pathology lab near <locality>" is how a metro is
       searched. All seven neighbourhood terms below appear in one h2 and then
       in prose in `home-collection-areas-lucknow`.

       Ordered strongest first. `keywords` is a weak-to-zero ranking signal on
       its own; the reason to keep it honest is that it is the checklist the
       headings, FAQs and prose are written against. Every term below appears
       in the visible copy — the two comparative ones ("Affordable…", "Best
       Diagnostic Centre…") appear in the FAQ questions, whose answers refuse
       the boast and give checkable facts instead.

       ⚠ NO RT-PCR TERM, deliberately, even though it was on the brief. We do
       not run RT-PCR (see `rt-pcr-lucknow` in content/lucknow.js, which says
       so plainly and points the reader at the government hospitals and
       molecular labs here that do). A keyword for a test we cannot perform is
       the kind that gets a page filtered rather than ranked. Same rule as
       GAMCA on Siwan, the recruitment medical on Ghazipur, RT-PCR on
       Gopalganj. */
    keywords: [
      "Lab Test in Lucknow",
      "MedicoBharat Lab Test Lucknow",
      "Blood Test Home Collection in Lucknow",
      "Lab Test at Home in Lucknow",
      "Pathology Lab Near Me in Lucknow",
      "MedicoBharat Pathology Lab Lucknow",
      "Diagnostic Centre in Lucknow",
      "Best Diagnostic Centre in Lucknow",
      "Affordable Lab Tests in Lucknow",
      "Book Blood Test Online in Lucknow",
      "Same Day Lab Test Reports in Lucknow",
      "Home Sample Collection in Lucknow",
      "Full Body Checkup Package in Lucknow",
      "Full Body Checkup at Home in Lucknow",
      "Thyroid Test Price in Lucknow",
      "Diabetes Checkup Lab in Lucknow",
      "Liver Function Test in Lucknow",
      "Kidney Function Test Package in Lucknow",
      "Lipid Profile Test Price in Lucknow",
      "CBC Test Price in Lucknow",
      "Dengue Test in Lucknow",
      // The seven mohalla queries from the brief, in the form they are typed.
      "Pathology Lab Near Hazratganj Lucknow",
      "Medical Lab Near Gomti Nagar Lucknow",
      "Blood Testing Lab in Aliganj Lucknow",
      "Blood Collection Centre in Indira Nagar Lucknow",
      "Pathology Lab Near Alambagh Charbagh Lucknow",
      "Diagnostic Lab Near Aminabad Lucknow",
      "Blood Test at Home in Ashiyana Lucknow",
      "लखनऊ में लैब टेस्ट",
      "लखनऊ में ब्लड टेस्ट घर पर",
      "लखनऊ में फुल बॉडी चेकअप",
      "लखनऊ में थायराइड टेस्ट",
    ],

    /* Closing call strip. The heading IS one tracked search phrase, title
       cased — no tail, no second keyword. See defaultCallBanner in
       src/data/lab/defaults.js for which phrase each city takes and why. */
    callBanner: {
      heading: "Blood Test Home Collection in Lucknow",
    },

    /* Same rule as the strip above — ONE tracked phrase, and a different one
       from the strip's, so the page uses two of its phrases rather than one
       twice. This one takes "book blood test online lucknow".
       `intro` and the five steps come from defaultHowTo and are unchanged. */
    howTo: { heading: "How to book a blood test online in Lucknow" },

    content: lucknowContent,
    faqs: lucknowFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       This city has no neighbour in the seed — every other page here is in
       Purvanchal, 250 to 320 km east — so there is no "aas-paas ke jile" group
       to write, and inventing one would be the kind of link block a crawler
       correctly discounts. The group is honestly titled as other cities where
       the same service runs, and each `sub` says the distance rather than
       implying proximity.

       Lucknow has no guide of its own yet, so the reading group points at the
       Varanasi guides, which are the site's fullest and are district-neutral
       on the questions they answer. If a Lucknow guide is written, it goes
       first in that group.

       Varanasi's and Gorakhpur's own relatedLinks point back here — both are
       cities this one is a referral destination for, and the link runs both
       ways because a new URL is crawled from links, not from the sitemap. */
    relatedLinks: {
      heading: "Lucknow Ke Liye Aage Ki Jaankari",
      intro:
        "Kaun sa test kab karana chahiye, report ke numbers ka matlab, aur UP ke doosre sheher jahan yahi service chalti hai.",
      groups: [
        {
          title: "Test Chunne Me Madad",
          links: [
            {
              href: "/blogs/lab-test/varanasi",
              label: "Kaun sa test kab karayein — poori guide",
              sub: "Shikayat, umar aur mausam ke hisaab se",
            },
            {
              href: "/blogs/full-body-checkup/varanasi",
              label: "Full body checkup me kya hona chahiye",
              sub: "\"80+ parameters\" ka sach, aur kya chhod dena chahiye",
            },
            {
              href: "/blogs/lab-test/varanasi#fasting-aur-taiyari",
              label: "Blood test se pehle fasting aur taiyaari",
            },
            {
              href: "/blogs/lab-test/varanasi#report-kaise-padhein",
              label: "Report aa gayi — ab ise kaise padhein",
            },
          ],
        },
        {
          title: "UP Ke Doosre Sheher",
          links: [
            {
              href: "/lab-test/varanasi",
              label: "Varanasi me lab test",
              sub: "Purvanchal ka sabse bada sheher, kareeb 320 km poorab",
            },
            {
              href: "/lab-test/gorakhpur",
              label: "Gorakhpur me lab test",
              sub: "Purvanchal ka referral hub — wahan se log yahan tak aate hain",
            },
            {
              href: "/lab-test/azamgarh",
              label: "Azamgarh me lab test",
              sub: "Mandal mukhyalaya, Purvanchal ke beech me",
            },
            // Khalilabad ka page is sheher ko naam se leta hai — main line
            // seedhi yahan aati hai aur bade sansthan ke liye log yahi aate
            // hain — isliye link dono taraf hai.
            {
              href: "/lab-test/khalilabad",
              label: "Khalilabad me lab test",
              sub: "Sant Kabir Nagar — Gorakhpur line par, kareeb 230 km poorab",
            },
          ],
        },
      ],
    },
  },

  {
    /* ── KHALILABAD — SANT KABIR NAGAR ───────────────────────────────────
       The first city on this site whose problem is NOT distance, and that is
       why it is worth its own page rather than a mention on Gorakhpur's.

       It sits between two bigger cities — Gorakhpur roughly 40 km east, Basti
       roughly 35 km west — on the main Gorakhpur–Lucknow line. Every other page
       here argues some version of "the big labs are far, skip the journey".
       That argument is simply false in this town: the labs are an hour away in
       either direction and people go to both. So the copy argues the opposite
       and it is this page's own — because two cities are equally close, a
       household's repeat tests get SCATTERED between them, and an HbA1c done in
       Gorakhpur in March cannot be compared with one done in Basti in June.
       Continuity, not distance. See content/khalilabad.js.

       Two more things are this page's own: the daily commuter (this belt goes
       up-down for work, which is why prescriptions sit for weeks) and the two
       names — the district is Sant Kabir Nagar, the town is Khalilabad. Unlike
       Kushinagar/Padrauna there is only ONE page here, so it carries both names
       itself, the way Mau carries "Maunath Bhanjan".

       ⚠ Basti has no page on this site. It is named in the copy as geography
       and nothing links to /lab-test/basti — do not add such a link until that
       page exists. */
    slug: "khalilabad",
    name: "Khalilabad",
    state: "Uttar Pradesh",

    /* Magahar first — Sant Kabir's memorial town, a few km out and the name
       most searched alongside the district's — then the blocks and market towns
       collection actually reaches. These render in the footer, fill the booking
       form's dropdown, become `areaServed` in the schema, and are what a
       "<kasba> me blood test" search matches on.

       "Khalilabad" itself is deliberately absent: the form renders
       `[name, ...areas, "Other"]`, so repeating it would print the town twice
       in the dropdown. Kept to eleven — the smaller villages are named in the
       page copy instead, because a twenty-item dropdown is unusable on a phone.
       Do not pad this list; an areaServed we cannot serve is a lie in schema
       form. */
    areas: [
      "Magahar",
      "Mehdawal",
      "Dhanghata",
      "Bakhira",
      "Hainsar Bazar",
      "Santha",
      "Baghauli",
      "Nath Nagar",
      "Semariyawan",
      "Pauli",
      "Belhar Kala",
    ],

    /* ⚠ THIS FIELD IS WHY THE LIST ABOVE IS ALLOWED TO HOLD TOWNS.
       The schema publishes each area as "<area>, <areaContext>", and without
       this it would default to the city's name and emit "Mehdawal, Khalilabad"
       — a place that does not exist, because Mehdawal is a block town in the
       same district, not a mohalla of this one. With it the markup says
       "Mehdawal, Sant Kabir Nagar", which is how that address is actually
       written. Every other city on this site is also its district, so this is
       the only entry that needs it so far. */
    areaContext: "Sant Kabir Nagar",

    // Khalilabad town's PIN. Schema only, and worth re-checking against a
    // delivery slip before any paid push: it is the one field here nobody on
    // the page ever reads, so a wrong value would sit in the markup unnoticed.
    postalCode: "272175",

    /* Khalilabad town centre, and approximate on purpose — same rule as every
       other city: there is no walk-in counter here, this is a home-collection
       service area, and a precise street pin in the schema would be a claim we
       cannot keep. Google reads `geo` on a service-area business as "roughly
       here", which is true. */
    geo: { lat: 26.7745, lng: 83.0716 },

    updated: "2026-09-12",
    order: 14,
    published: true,

    /* No `aliases` entry, and none in CITY_ALIASES either. "Sant Kabir Nagar"
       is the DISTRICT's name, not a second name for this town — the Kushinagar
       case, not the Varanasi → Banaras case — so putting it in `aliases` would
       be wrong on the facts. It is carried where it actually works instead: the
       description, the h1Sub, the keywords, an H2 of its own, the lead
       paragraph, two FAQs and the Hindi section.

       ⚠ 43 characters; the root layout appends " | MedicoBharat" (template in
       src/app/layout.js), so Google renders 58 — inside the ~60 it shows.

       The tail is a PROMISE, not a keyword, and it is the only title in the
       section that makes one. That is deliberate: this is a new URL competing
       against established results in a two-city catchment, and "Report in 24
       Hours" is the one thing on the page a reader can decide on from the SERP
       alone. It is also the reason the copy has to keep qualifying it —
       routine pathology in 24 hours, cultures in 48 to 72 — in the report
       section and the last FAQ. EDIT THAT QUALIFICATION OUT AND THIS TITLE
       BECOMES A CLAIM WE DO NOT KEEP. The pairing (lead "Lab Test in X", tail
       "Report in 24 Hours") is unused by any other city; see the block comment
       above defaultTitle in src/data/lab/defaults.js for that rule. */
    title: "Lab Test in Khalilabad — Report in 24 Hours",

    // ~154 characters, so it renders whole on desktop and mobile. Both names in
    // the first six words, because half this district's searches use the
    // district's name and half the town's — then the block towns, which is what
    // distinguishes this result from Gorakhpur's when both show for one
    // regional query.
    description:
      "Khalilabad aur Sant Kabir Nagar me blood test ghar baithe — Magahar, Mehdawal, Dhanghata aur Bakhira tak free home sample collection, report 24 ghante me.",

    /* The h1 opens with the phrase people type and stops; the secondary terms
       sit in `h1Sub`, inside a real sentence. Budget: h1 under ~60 characters,
       h1Sub under ~140. The district's name goes in the sub-line rather than
       the heading — it would double the heading's length for a name the reader
       standing in Khalilabad does not use. */
    hero: {
      h1: "Lab Test in Khalilabad — Blood Test Ghar Baithe",
      h1Sub:
        "Sant Kabir Nagar jile me pathology lab ke test ghar par — free home sample collection, routine report 24 ghante me WhatsApp par.",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out rather than taking defaultKeywords(), which would produce
       "<template> in Khalilabad" nine times plus one line per area and miss the
       one thing this district's traffic actually is: it is searched under TWO
       names. Both are carried explicitly rather than left to Google to infer,
       because "Sant Kabir Nagar" and "Khalilabad" share no substring — an
       engine has no way to guess they are the same place from the strings
       alone, the way it might with "Maunath Bhanjan" and "Mau".

       `keywords` is a weak-to-zero ranking signal by itself; the reason to keep
       it honest is that it is the checklist the page's headings, FAQs and prose
       are written against. Every term below appears in the visible copy — a
       keyword that appears ONLY here is the kind that gets a page filtered. */
    keywords: [
      "Lab Test in Khalilabad",
      "Blood Test in Khalilabad",
      "Blood Test at Home in Khalilabad",
      "Home Sample Collection in Khalilabad",
      "Pathology Lab in Khalilabad",
      "Diagnostic Centre in Khalilabad",
      "Lab Test in Sant Kabir Nagar",
      "Blood Test in Sant Kabir Nagar",
      "Full Body Checkup in Khalilabad",
      "Thyroid Test in Khalilabad",
      "Sugar Test in Khalilabad",
      "Lab Test Near Me in Khalilabad"
    ],

    /* Closing call strip. The heading IS one tracked search phrase, title
       cased — no tail, no second keyword. See defaultCallBanner in
       src/data/lab/defaults.js for which phrase each city takes and why. */
    callBanner: {
      heading: "Blood Test at Home in Khalilabad",
    },

    /* Same rule as the strip above — ONE tracked phrase, and a different one
       from the strip's, so the page uses two of its phrases rather than one
       twice. This one carries Mehdawal, the largest block town, which the URL
       cannot hold and which its own readers type instead of the district name.
       `intro` and the five steps come from defaultHowTo and are unchanged:
       they describe a procedure, and a procedure is the same in every town. */
    howTo: { heading: "How to book a lab test in Khalilabad and Mehdawal" },

    content: khalilabadContent,
    faqs: khalilabadFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. A brand-new URL gets
       crawled through links, not through the sitemap alone, so the two pages
       this town's readers genuinely travel to are named first — Gorakhpur, and
       Lucknow because the main line runs straight there and the big institutes
       are at the other end of it. Both link back; see their blocks above.

       Basti is the nearer neighbour on the other side and is NOT here, because
       there is no page for it. Naming a town in the copy is honest; linking to
       a route that does not exist is a 404.

       Every href is checked against a real route: the cities in this seed and
       the guides in content/blogs/deoria/. */
    relatedLinks: {
      heading: "Khalilabad Ke Aas-paas Aur Aage Ki Jaankari",
      intro:
        "Wo sheher jahan imaging, specialist ya bade sansthan ke liye jaana padta hai — wahan bhi yahi home collection chalti hai — aur ye tay karne ke liye guide ki kaun sa test kab karana chahiye.",
      groups: [
        {
          title: "Aas-paas Ke Sheher",
          links: [
            {
              href: "/lab-test/gorakhpur",
              label: "Gorakhpur me lab test",
              sub: "Kareeb 40 km — OPD se pehle report haath me",
            },
            {
              href: "/lab-test/lucknow",
              label: "Lucknow me lab test",
              sub: "Main line seedhi jaati hai — bade sansthan me dikhana ho to",
            },
            {
              href: "/lab-test/deoria",
              label: "Deoria me lab test",
              sub: "Gorakhpur ke us paar ka zila — wahi service, wahi rate",
            },
          ],
        },
        {
          title: "Test Chunne Me Madad",
          links: [
            {
              href: "/blogs/lab-test/deoria",
              label: "Kaun sa test kab karayein — is belt ke liye guide",
              sub: "Shikayat, umar aur mausam ke hisaab se",
            },
            {
              href: "/blogs/pathology-lab/deoria",
              label: "Pathology lab kaise chunein — paanch sawaal",
              sub: "Daam, ID card, report ka samay — kya poochhna chahiye",
            },
            {
              href: "/blogs/full-body-checkup/deoria",
              label: "Full body checkup me kya hona chahiye",
              sub: "Package me kya chhoot jaata hai, umar ke hisaab se kaun sa level",
            },
            {
              href: "/blogs/dengue-typhoid-test/deoria",
              label: "Dengue aur typhoid — bukhar ke kis din kaunsa test",
              sub: "NS1, Widal, malaria aur platelet count ka matlab",
            },
            {
              href: "/blogs/lab-test/deoria#report-kaise-padhein",
              label: "Report aa gayi — ab ise kaise padhein",
            },
          ],
        },
      ],
    },
  },


  {
    /* ── MAHARAJGANJ — THE BORDER DISTRICT ───────────────────────────────
       ⚠ THE NAME IS NOT UNIQUE ON THIS SITE. "Maharajganj" is also a town in
       AZAMGARH district and is already an \`areas\` entry there, so the schema
       on /lab-test/azamgarh legitimately says "Maharajganj, Azamgarh". Both
       are correct and both stay. What makes that safe is that this page names
       the ambiguity in its own section and links to Azamgarh's page for the
       other one — see content/maharajganj.js. Do not let either page start
       claiming the other's Maharajganj.

       WHAT THIS PAGE ARGUES, and it is not any other city's argument:
         · Choosing a centre here is choosing a JOURNEY. The counters sit in
           four bazaars (Sadar, Nautanwa, Siswa Bazar, Pharenda) while the
           population is spread 25–60 km out across the Terai blocks. Padrauna
           is the opposite case — a town reader with a counter in walking reach
           — and its five-question checklist is deliberately not repeated.
         · The border belt. Nautanwa and Sonauli run on trade and transport and
           start before dawn; no other district on this site touches a border.
         · One road, one city. Unlike Khalilabad (two cities) or Siwan (three),
           everything here funnels to Gorakhpur ~50 km south, which is why
           sequencing that one day properly is the page's most useful advice.

       ⚠ SCOPE: the Indian side only. Sonauli is named because it is a town of
       this district, never to imply collection across the border. */
    slug: "maharajganj",
    name: "Maharajganj",
    state: "Uttar Pradesh",

    /* The blocks and market towns collection actually reaches. These render in
       the footer, fill the booking form's dropdown, become \`areaServed\` in the
       schema, and are what a "<kasba> me blood test" search matches on.

       No \`areaContext\` needed: this city IS its district, so the schema's
       "<area>, Maharajganj" is how these addresses are actually written — the
       Deoria case, not the Khalilabad one.

       "Maharajganj" itself is deliberately absent: the form renders
       \`[name, ...areas, "Other"]\`, so repeating it would print the town twice.
       Do not pad this list; an areaServed we cannot serve is a lie in schema
       form, and nothing across the border belongs in it. */
    areas: [
      "Nautanwa",
      "Sonauli",
      "Pharenda",
      "Siswa Bazar",
      "Nichlaul",
      "Ghughli",
      "Paniyara",
      "Brijmanganj",
      "Partawal",
      "Laxmipur",
      "Mithaura",
    ],

    // Maharajganj Sadar's PIN. Schema only, and worth re-checking against a
    // delivery slip before any paid push: it is the one field here nobody on
    // the page ever reads, so a wrong value would sit in the markup unnoticed.
    postalCode: "273303",

    /* Maharajganj town centre, and approximate on purpose — same rule as every
       other city: there is no walk-in counter here, this is a home-collection
       service area, and a precise street pin in the schema would be a claim we
       cannot keep. */
    geo: { lat: 27.144, lng: 83.5636 },

    updated: "2026-09-12",
    order: 15,
    published: true,

    /* ⚠ 43 characters; the root layout appends " | MedicoBharat" (template in
       src/app/layout.js), so Google renders 58 — inside the ~60 it shows.

       "Diagnostic Centre" leads because that is what this district types when
       it wants a PLACE, and the page's own lead section answers exactly that
       search — with the distance maths, not with a boast. Padrauna is the only
       other city leading on that term and its tail is "Blood Test", so the
       lead+tail pairing here is still unique; see the block comment above
       defaultTitle in src/data/lab/defaults.js for that rule. "Lab Test" takes
       the tail so the section's main phrase survives beside it. */
    title: "Diagnostic Centre in Maharajganj — Lab Test",

    // ~155 characters, so it renders whole on desktop and mobile. It names the
    // far blocks rather than the headquarters, because that is what separates
    // this result from Gorakhpur's when both show for one regional query — and
    // because those are the readers for whom the service changes the most.
    description:
      "Maharajganj me lab test aur blood test ghar baithe — Nautanwa, Sonauli, Nichlaul aur Siswa Bazar tak free home sample collection, report 24 ghante me.",

    /* The h1 opens with the phrase people type and stops; the secondary terms
       sit in \`h1Sub\`, inside a real sentence. Budget: h1 under ~60 characters,
       h1Sub under ~140. */
    hero: {
      h1: "Lab Test in Maharajganj — Blood Test Ghar Baithe",
      h1Sub:
        "Poore jile me pathology lab ke test ghar par — Sadar se Nautanwa aur Nichlaul tak free home sample collection, routine report 24 ghante me.",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out rather than taking defaultKeywords(), which would produce
       "<template> in Maharajganj" nine times plus one line per area and miss
       the two things this district's traffic actually is: the "centre" search
       (the term the title leads on, and the one a reader uses when they want a
       place rather than a test), and the far block towns — a reader in
       Nichlaul or Nautanwa rarely types the district's name.

       \`keywords\` is a weak-to-zero ranking signal by itself; the reason to keep
       it honest is that it is the checklist the page's headings, FAQs and prose
       are written against. Every term below appears in the visible copy — a
       keyword that appears ONLY here is the kind that gets a page filtered. */
    keywords: [
      "Diagnostic Centre in Maharajganj",
      "Lab Test in Maharajganj",
      "Blood Test in Maharajganj",
      "Pathology Lab in Maharajganj",
      "Blood Test at Home in Maharajganj",
      "Home Sample Collection in Maharajganj",
      "Full Body Checkup in Maharajganj",
      "Thyroid Test in Maharajganj",
      "Sugar Test in Maharajganj",
      "Lab Test in Nautanwa",
      "Blood Test in Sonauli",
      "Lab Test Near Me in Maharajganj"
    ],

    /* Closing call strip. The heading IS one tracked search phrase, title
       cased — no tail, no second keyword. See defaultCallBanner in
       src/data/lab/defaults.js for which phrase each city takes and why. */
    callBanner: {
      heading: "Blood Test at Home in Maharajganj",
    },

    /* Same rule as the strip above — ONE tracked phrase, and a different one
       from the strip's, so the page uses two of its phrases rather than one
       twice. This one carries Nautanwa, the district's biggest town after
       Sadar, which the URL cannot hold and which its own readers type.
       \`intro\` and the five steps come from defaultHowTo and are unchanged:
       they describe a procedure, and a procedure is the same in every town. */
    howTo: { heading: "How to book a lab test in Maharajganj and Nautanwa" },

    content: maharajganjContent,
    faqs: maharajganjFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. A brand-new URL gets
       crawled through links, not the sitemap alone. Gorakhpur is named first
       because it is the only referral city this district has, and it links
       back (see its block above). Azamgarh is here for the name clash, not for
       geography — it is the other Maharajganj's page, and a reader who landed
       on the wrong one needs that link more than any other on this page.

       Every href is checked against a real route: the cities in this seed and
       the guides in content/blogs/deoria/. */
    relatedLinks: {
      heading: "Maharajganj Ke Aas-paas Aur Aage Ki Jaankari",
      intro:
        "Jahan specialist ya imaging ke liye jaana padta hai wahan bhi yahi home collection chalti hai — aur ye tay karne ke liye guide ki kaun sa test kab karana chahiye.",
      groups: [
        {
          title: "Aas-paas Ke Sheher",
          links: [
            {
              href: "/lab-test/gorakhpur",
              label: "Gorakhpur me lab test",
              sub: "Kareeb 50 km dakshin — OPD se pehle report haath me",
            },
            {
              href: "/lab-test/kushinagar",
              label: "Kushinagar me lab test",
              sub: "Poorab ka padosi jila — wahi service, wahi rate",
            },
            {
              href: "/lab-test/azamgarh",
              label: "Azamgarh me lab test",
              sub: "Azamgarh wale Maharajganj kasbe ke liye ye page hai",
            },
          ],
        },
        {
          title: "Test Chunne Me Madad",
          links: [
            {
              href: "/blogs/pathology-lab/deoria",
              label: "Pathology lab kaise chunein — paanch sawaal",
              sub: "Daam, ID card, report ka samay — kya poochhna chahiye",
            },
            {
              href: "/blogs/lab-test/deoria",
              label: "Kaun sa test kab karayein — is belt ke liye guide",
              sub: "Shikayat, umar aur mausam ke hisaab se",
            },
            {
              href: "/blogs/full-body-checkup/deoria",
              label: "Full body checkup me kya hona chahiye",
              sub: "Package me kya chhoot jaata hai, umar ke hisaab se kaun sa level",
            },
            {
              href: "/blogs/dengue-typhoid-test/deoria",
              label: "Dengue aur typhoid — bukhar ke kis din kaunsa test",
              sub: "NS1, Widal, malaria aur platelet count ka matlab",
            },
            {
              href: "/blogs/lab-test/deoria#report-kaise-padhein",
              label: "Report aa gayi — ab ise kaise padhein",
            },
          ],
        },
      ],
    },
  },
];

/** State used when a city entry leaves `state` out. */
const DEFAULT_STATE = LAB_CITY_SEED[0].state;

/* ── Normalising ──────────────────────────────────────────────────────────
   Every entry is squeezed into the same shape so a typo in the seed can never
   reach a rendered page — a missing field falls back rather than crashing. */

export const slugify = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const str = (value) => String(value ?? "").trim();

/** A non-empty array of strings, or null when the field is unusable. */
const strList = (value) => {
  if (!Array.isArray(value)) return null;
  const list = value.map(str).filter(Boolean);
  return list.length ? list : null;
};

/** A non-empty array of objects, or null — used for faqs, tests, content. */
const objList = (value) => {
  if (!Array.isArray(value)) return null;
  const list = value.filter((item) => item && typeof item === "object");
  return list.length ? list : null;
};

/** An object, or null. Guards against a field written as a string by mistake. */
const obj = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : null;

/**
 * A Google Business Profile URL, or null.
 *
 * Validated rather than trusted, for the same reason `geo` requires two real
 * numbers: this value is published in `hasMap` and `sameAs`, where a wrong link
 * does not degrade gracefully — it asserts that some other business IS us. A
 * string that is not recognisably a Google Maps URL is dropped, so a typo or a
 * pasted GBP *dashboard* link (business.google.com/…, which is our private
 * admin screen and 404s for everyone else) publishes nothing instead of
 * publishing a lie.
 *
 * Both forms are accepted: the expanded `/maps/place/…` URL, which is what
 * should be published, and the `maps.app.goo.gl` short link that Share → Copy
 * gives you. The short one redirects, so expand it when you can.
 */
const gbpUrl = (value) => {
  const url = str(value);
  if (!url) return null;
  return /^https:\/\/(?:www\.)?google\.[a-z.]+\/maps\/|^https:\/\/maps\.app\.goo\.gl\/|^https:\/\/goo\.gl\/maps\//.test(
    url
  )
    ? url
    : null;
};

/**
 * A city entry merged over the generated defaults.
 *
 * Every section is all-or-nothing on purpose: overriding `faqs` replaces the
 * whole list rather than merging item by item. `hero`, `cta`, `callBanner` and
 * `footer` are small enough that a per-key merge is still predictable, so those
 * fill in field by field.
 */
function buildContent(fields, base) {
  const { name, state, areas, aliases } = base;

  return {
    // ── metadata ──
    title: str(fields.title) || defaultTitle(name),
    description: str(fields.description) || defaultDescription(name, state, areas),
    keywords: strList(fields.keywords) ?? defaultKeywords(name, areas, aliases),

    // ── sections ──
    hero: { ...defaultHero(name), ...(obj(fields.hero) ?? {}) },
    trustStrip: objList(fields.trustStrip) ?? defaultTrustStrip(),
    tests: objList(fields.tests) ?? defaultTests(),
    filters: objList(fields.filters) ?? defaultFilters(),
    faqs: objList(fields.faqs) ?? defaultFaqs(name, areas, aliases),
    cta: { ...defaultCta(name), ...(obj(fields.cta) ?? {}) },
    // `areas` is passed through so the generated copy can only ever name this
    // city's own localities — the fallback used to carry a hardcoded list of
    // Varanasi neighbourhoods, which every other city then advertised.
    content: objList(fields.content) ?? defaultContent(name, areas),
    // Per-key merge, like `cta` and `callBanner`: a city can retitle the block
    // without restating all five steps. Passing `steps` replaces the array
    // wholesale — a per-item merge across two lists of different lengths is not
    // predictable enough to be worth it.
    howTo: { ...defaultHowTo(name), ...(obj(fields.howTo) ?? {}) },
    callBanner: { ...defaultCallBanner(name), ...(obj(fields.callBanner) ?? {}) },
    footer: { ...defaultFooter(name), ...(obj(fields.footer) ?? {}) },
    // Optional and with NO default on purpose. A generated link block would be
    // the same boilerplate on every city — the value is in hand-picked anchors
    // pointing at routes that exist for THAT city, so a city without the field
    // simply renders no block. Rendered by LabContent's `related` prop.
    relatedLinks: obj(fields.relatedLinks),
  };
}

function normalise(fields, id) {
  const slug = slugify(fields.slug || id);
  const name = str(fields.name);

  // A city with no slug or no display name cannot be rendered or linked.
  if (!slug || !name) return null;

  const base = {
    slug,
    name,
    state: str(fields.state) || DEFAULT_STATE,
    areas: strList(fields.areas) ?? [],
    // What each `areas` entry is qualified by in the schema. Falls back to the
    // city's own name, which is correct wherever the city is also the district.
    // See the field list at the top of this file for when to override it.
    areaContext: str(fields.areaContext) || name,
    // Alternate names this city is searched by (e.g. Varanasi → "Banaras").
    aliases: strList(fields.aliases) ?? CITY_ALIASES[slug] ?? [],
    postalCode: fields.postalCode ? str(fields.postalCode) : null,
    // This city's own Business Profile. Optional, validated, and null when
    // absent — the page then falls back to the brand-wide GBP_MAP_URL and, if
    // that is empty too, omits the property rather than inventing one.
    gbp: gbpUrl(fields.gbp),
    // Schema only, and only when BOTH numbers are real numbers — a half-filled
    // pair would emit `latitude: undefined`, which invalidates the whole
    // GeoCoordinates node rather than just omitting it.
    geo:
      Number.isFinite(fields.geo?.lat) && Number.isFinite(fields.geo?.lng)
        ? { lat: fields.geo.lat, lng: fields.geo.lng }
        : null,
    // ISO date the copy was last reviewed; null → the page omits dateModified
    // rather than inventing one. Only YYYY-MM-DD is accepted, so a typo drops
    // the field instead of publishing a date Google cannot parse.
    updated: /^\d{4}-\d{2}-\d{2}$/.test(str(fields.updated))
      ? str(fields.updated)
      : null,
    // Only an explicit `published: false` hides a city.
    published: fields.published !== false,
    order: Number.isFinite(fields.order) ? fields.order : Number.MAX_SAFE_INTEGER,
  };

  return { ...base, ...buildContent(fields, base) };
}

const byOrderThenName = (a, b) =>
  a.order - b.order || a.name.localeCompare(b.name, "en");

/**
 * Every published city, fully populated and sorted — the list the whole lab
 * section reads through src/lib/labCities.js. Built once at module load.
 */
export const LAB_CITIES = LAB_CITY_SEED
  .map((city) => normalise(city, city.slug))
  .filter((city) => city && city.published)
  .sort(byOrderThenName);
