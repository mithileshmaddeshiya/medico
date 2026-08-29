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
import { gorakhpurContent, gorakhpurFaqs } from "./content/gorakhpur";
import { kushinagarContent, kushinagarFaqs } from "./content/kushinagar";
import { mauContent, mauFaqs } from "./content/mau";
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
    // This copy used to be defaultContent() — the fallback every city inherited
    // — even though every fact in it is Varanasi's. It is unchanged, just moved
    // under the city it was actually written about. See labContent/varanasi.js.
    content: varanasiContent,

    /* ── In-body internal links ────────────────────────────────────────────
       The other half of the link between this page and the Varanasi guide at
       /blogs/lab-test/varanasi. The guide already links here in four places;
       without this block the link ran one way only, and a one-way link tells a
       crawler the two pages are related but tells it nothing about which is the
       page to rank for "Varanasi me lab test".

       The split is deliberate and the anchors say so: this page is the service
       (book, price, menu), the guide is the reading (which test, when, how to
       read the report). Every href is a route that exists — the guides in
       src/data/blogs/varanasi/, the other cities in the seed below, and the
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
       src/data/blogs/varanasi/ and the cities in the seed above. */
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
              sub: "Padrauna, Hata aur Tamkuhi Raj ka padosi zila",
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

    // 42 characters. It has to stay short: the root layout appends
    // " | MedicoBharat" (template in src/app/layout.js), so Google renders 57 —
    // just inside the ~60 it will show. Primary keyword first, then the second
    // biggest query on the page; both survive truncation.
    title: "Lab Test in Gorakhpur — Blood Test at Home",

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

    content: gorakhpurContent,
    faqs: gorakhpurFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. The footer already carries
       some of these, but a footer is byte-identical on every lab page and gets
       discounted as boilerplate; these anchors are descriptive and per-city.

       Every href is checked against a real route: the lab cities in the seed
       above and the guides in src/data/blogs/varanasi/. */
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
              sub: "Padrauna aur Kasia — wahan se log yahin dikhane aate hain",
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

    content: salempurContent,
    faqs: salempurFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. This block matters more
       here than on the other cities: a brand-new URL two levels down in a
       district gets crawled through links, not through the sitemap alone, so
       the district page is named first and links back (see Deoria's block).

       Every href is checked against a real route: the cities in the seed above
       and the guides in src/data/blogs/varanasi/. */
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

    // 41 characters; the root layout appends " | MedicoBharat" (template in
    // src/app/layout.js), so Google renders 56 — inside the ~60 it will show.
    // Primary keyword first, then the second-biggest query on the page; both
    // survive the truncation.
    title: "Lab Test in Azamgarh — Blood Test at Home",

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

    content: azamgarhContent,
    faqs: azamgarhFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. A brand-new URL gets
       crawled through links, not through the sitemap alone, so the two cities
       this district actually travels to — Varanasi and Gorakhpur — are named
       first and both link back (see their blocks above).

       Every href is checked against a real route: the cities in the seed above
       and the guides in src/data/blogs/varanasi/. */
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

    // 39 characters; the root layout appends " | MedicoBharat" (template in
    // src/app/layout.js), so Google renders 54 — inside the ~60 it will show.
    // Primary keyword first, then the second-biggest query on the page; both
    // survive the truncation.
    title: "Lab Test in Ballia — Blood Test at Home",

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

    content: balliaContent,
    faqs: balliaFaqs,

    /* ── In-body internal links ────────────────────────────────────────────
       Rendered by LabContent at the end of the guide. A brand-new URL gets
       crawled through links, not through the sitemap alone, so the three places
       this district actually travels to for treatment — Varanasi, Azamgarh
       (mandal mukhyalaya) and Gorakhpur — are named first, and Azamgarh links
       back (see its block above).

       Every href is checked against a real route: the cities in the seed above
       and the guides in src/data/blogs/varanasi/. */
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

    // 36 characters; the root layout appends " | MedicoBharat" (template in
    // src/app/layout.js), so Google renders 51 — comfortably inside the ~60 it
    // will show. "Maunath Bhanjan" is deliberately NOT in the title: it would
    // push the line to the truncation edge and cost the "blood test" half,
    // which is the bigger query. It sits in the description instead.
    title: "Lab Test in Mau — Blood Test at Home",

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
       and the guides in src/data/blogs/varanasi/. */
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

    // 43 characters; the root layout appends " | MedicoBharat" (template in
    // src/app/layout.js), so Google renders 58 — just inside the ~60 it shows.
    // "Padrauna" is deliberately NOT in the title: it would push the line past
    // truncation and cost the "blood test" half, which is the bigger query. It
    // leads the description instead, where there is room for it.
    title: "Lab Test in Kushinagar — Blood Test at Home",

    // ~158 characters, so it renders whole on desktop and mobile. Padrauna
    // first, because that is where the readers are, then the block towns that
    // are furthest from the headquarters — which is what distinguishes this
    // result when more than one of our pages shows for a regional query.
    description:
      "Padrauna aur Kushinagar me lab test ghar baithe — Hata, Ramkola, Khadda aur Tamkuhi Raj tak free home sample collection. CBC, thyroid, sugar aur full body checkup.",

    // The h1 is screen-reader only (the hero is image + form), so it costs a
    // reader nothing and carries the terms the URL cannot: the headquarters'
    // name, "blood test", "pathology lab" and "full body checkup".
    hero: {
      h1: "Lab Test in Kushinagar Aur Padrauna — Blood Test, Pathology Lab Aur Full Body Checkup Ke Liye Free Home Sample Collection",
    },

    /* ── Keywords ──────────────────────────────────────────────────────────
       Written out rather than taking defaultKeywords(), which would produce
       "<template> in Kushinagar" nine times plus one line per area and miss the
       three things this district's traffic actually is: Padrauna, which the URL
       cannot carry and which half the district types; the block-town modifiers,
       because a reader in Khadda or Tamkuhi Raj rarely types the district name;
       and the district's own seasonal demand.

       `keywords` is a weak-to-zero ranking signal by itself; the reason to keep
       it honest is that it is the checklist the page's headings, FAQs and prose
       are written against. Every term below appears in the visible copy — a
       keyword that appears ONLY here is the kind that gets a page filtered. */
    keywords: [
      "Lab Test in Kushinagar",
      "Blood Test in Kushinagar",
      "Lab Test in Padrauna",
      "Blood Test in Padrauna",
      "Home Sample Collection in Kushinagar",
      "Pathology Lab in Kushinagar",
      "Diagnostic Centre in Kushinagar",
      "Full Body Checkup in Kushinagar",
      "Dengue Test in Kushinagar",
      "Lab Test Near Me in Kushinagar"
    ],

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
       the guides in src/data/blogs/. */
    relatedLinks: {
      heading: "Kushinagar Ke Aas-paas Aur Aage Ki Jaankari",
      intro:
        "Jin sheheron me ilaaj ya imaging ke liye jaana padta hai, wahan bhi yahi home collection chalti hai — aur ye tay karne ke liye guide ki kaun sa test kab karana chahiye.",
      groups: [
        {
          title: "Aas-paas Ke Sheher",
          links: [
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

    // 37 characters. It has to stay short: the root layout appends
    // " | MedicoBharat", so what Google renders is 52 — inside the ~60 it will
    // show. Primary keyword first, then the second-biggest query on this page;
    // both survive truncation.
    title: "Lab Test in Siwan — Blood Test at Home",

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
       src/data/blogs/ and the cities in the seed above. */
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
            // Seema ke us paar ka sabse nazdeek page, isliye pehle. Siwan ka
            // paschimi hissa Bhatni-Salempur ki taraf khulta hai.
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

    // 40 characters. It has to stay short: the root layout appends
    // " | MedicoBharat", so what Google renders is 55 — inside the ~60 it will
    // show. Primary keyword first, then the second-biggest query on this page.
    title: "Lab Test in Ghazipur — Blood Test at Home",

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
       src/data/blogs/ and the cities in the seed above. */
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
