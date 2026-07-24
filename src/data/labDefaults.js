/**
 * Default page content for a lab-test city.
 *
 * THIS IS WHAT MAKES ADDING A CITY CHEAP. A Firestore document only has to
 * carry the facts that are genuinely different — slug, name, state, areas.
 * Everything else on the page (hero copy, tests, prices, FAQs, SEO prose, CTA)
 * is generated from these templates with the city's name filled in, so a
 * four-field document still renders a complete page.
 *
 * Anything you *do* put in the Firestore document wins over the value here —
 * see mergeLabCityContent() in src/lib/labCities.js. So a city can override
 * one FAQ, or its whole test list, without repeating the rest.
 *
 * Icons are stored as STRINGS, not components: Firestore holds data, and a
 * React component cannot survive a round trip through it. Each client
 * component maps the string back to a lucide icon through its own registry —
 * a name with no match falls back to a neutral icon rather than crashing.
 */

export const LAB_PHONE = "+91 989-123-3525";
export const LAB_WHATSAPP = "919891233525";

/* ── Hero ─────────────────────────────────────────────────────────────────── */

export const defaultHero = (city) => ({
  // The h1 is screen-reader only — the hero itself is image + booking form.
  h1: `Lab Test in ${city} with Free Home Sample Collection`,
  image: "/navheroimage/navheroo.webp",
  imageAlt: "Lab test at home",
  formTitle: "Book Your Sample Collection",
});

/* ── Trust strip ──────────────────────────────────────────────────────────
   Four promises shown before the prices. Each is a concrete, checkable claim
   (a time, an hour, a day) rather than a vague adjective. */

export const defaultTrustStrip = () => [
  {
    icon: "bike",
    title: "Home Sample Collection",
    highlight: "in 60 mins",
    sub: "Trained phlebotomist reaches your door",
  },
  {
    icon: "alarm-clock",
    title: "Home Visit Slots",
    highlight: "from 6 AM",
    sub: "Fasting tests done early, before breakfast",
  },
  {
    icon: "file-text",
    title: "Online Reports",
    highlight: "in 24 hours",
    sub: "Delivered on WhatsApp & email as PDF",
  },
  {
    icon: "calendar-days",
    title: "Service Available",
    highlight: "on Sunday",
    sub: "Open all 7 days, holidays included",
  },
];

/* ── Tests & packages ─────────────────────────────────────────────────────
   `price` — what the patient pays (₹). `mrp` — the struck-through list price;
   leave it out and the card shows the price with no discount pill.
   `price: null` renders a "Call for price" card instead.
   `params` — number of parameters in a checkup package; single tests omit it.

   ORDER MATTERS: cheapest first. The first thing a patient sees on a phone is
   a ₹100 test, not a ₹2,999 package — a high number at the top reads as "this
   is expensive" and they leave before scrolling. Tests with `price: null` go
   last: "Call for price" is the weakest opener. */

export const defaultTests = () => [
  { id: "sugar",      icon: "gauge",       tint: "amber",   name: "Blood Sugar Test",     sub: "Fasting & PP glucose",                 tags: ["Popular", "Diabetes"], fasting: true,  price: 100,  mrp: 180  },
  { id: "cbc",        icon: "droplets",    tint: "rose",    name: "CBC Test",             sub: "Complete Blood Count",                 tags: ["Popular"],             fasting: false, price: 400,  mrp: 700  },
  { id: "thyroid",    icon: "activity",    tint: "violet",  name: "Thyroid Profile",      sub: "T3, T4 and TSH",                       tags: ["Popular"],             fasting: false, price: 550,  mrp: 900  },
  { id: "hba1c",      icon: "chart-line",  tint: "sky",     name: "HbA1c Test",           sub: "3-month sugar average",                tags: ["Diabetes"],            fasting: false, price: 600,  mrp: 1000 },
  { id: "lft",        icon: "flask",       tint: "teal",    name: "Liver Function Test",  sub: "Bilirubin, SGOT, SGPT",                tags: ["Organ"],               fasting: false, price: 600,  mrp: 1000 },
  { id: "kft",        icon: "beaker",      tint: "sky",     name: "Kidney Function Test", sub: "Urea, creatinine & uric acid",         tags: ["Organ"],               fasting: false, price: 700,  mrp: 1150 },
  { id: "lipid",      icon: "heart-pulse", tint: "rose",    name: "Lipid Profile",        sub: "Cholesterol & triglycerides",          tags: ["Heart"],               fasting: true,  price: 800,  mrp: 1300 },
  { id: "pkg-basic",  icon: "stethoscope", tint: "emerald", name: "Full Body Checkup",    sub: "Basic — CBC, sugar, lipid, LFT & KFT", tags: ["Packages", "Popular"], fasting: true,  price: 999,  mrp: 1800, params: 45 },
  { id: "vitd",       icon: "sun",         tint: "amber",   name: "Vitamin D Test",       sub: "25-OH Vitamin D level",                tags: ["Vitamins"],            fasting: false, price: 1000, mrp: 1700 },
  { id: "vitb12",     icon: "pill",        tint: "violet",  name: "Vitamin B12 Test",     sub: "Serum B12 level",                      tags: ["Vitamins"],            fasting: false, price: 1200, mrp: 2000 },
  { id: "dengue",     icon: "bug",         tint: "emerald", name: "Dengue Test",          sub: "NS1 antigen, IgG & IgM",               tags: ["Fever"],               fasting: false, price: 1200, mrp: 1900 },
  { id: "pkg-adv",    icon: "sparkles",    tint: "teal",    name: "Advanced Full Body",   sub: "Basic + thyroid, HbA1c & vitamins",    tags: ["Packages", "Popular"], fasting: true,  price: 1999, mrp: 3600, params: 72 },
  { id: "pkg-senior", icon: "user-round",  tint: "violet",  name: "Senior Citizen Pack",  sub: "55+ — heart, bones & sugar screening", tags: ["Packages"],            fasting: true,  price: 2999, mrp: 5200, params: 88 },
  { id: "fever",      icon: "thermometer", tint: "teal",    name: "Fever Panel",          sub: "Malaria, typhoid & dengue",            tags: ["Fever"],               fasting: false, price: null              },
];

// `heading` drives the H2 above the grid — it changes with the active chip.
export const defaultFilters = () => [
  { key: "All",      label: "All Tests", heading: "Trusted Lab Tests & Health Packages" },
  { key: "Packages", label: "Packages",  heading: "Health Checkup Packages" },
  { key: "Popular",  label: "Popular",   heading: "Popular Lab Tests" },
  { key: "Diabetes", label: "Diabetes",  heading: "Diabetes Tests" },
  { key: "Heart",    label: "Heart",     heading: "Heart Tests" },
  { key: "Vitamins", label: "Vitamins",  heading: "Vitamin Tests" },
  { key: "Fever",    label: "Fever",     heading: "Fever Tests" },
  { key: "Organ",    label: "Organ",     heading: "Organ Function Tests" },
];

/* ── FAQs ─────────────────────────────────────────────────────────────────
   The questions a patient actually hesitates on before booking: who comes,
   what it costs, when the report lands.

   EVERY CLAIM HERE MUST BE LITERALLY TRUE OF THE ACTUAL OPERATION. Removed on
   23 Jul 2026 because they could not be confirmed: NABL accreditation,
   pathologist verification of reports, cold-chain transport, barcode tracking,
   sealed single-use needles. Do not reintroduce any of them — in this file or
   in Firestore — without checking with the partner lab first. What survives is
   what we know: free home collection, a trained phlebotomist with an ID card,
   6 AM slots, reports in 24 hours, cash/UPI on collection. */

export const defaultFaqs = (city, areas = [], aliases = []) => {
  // Real localities named in Hinglish — matches "<area> me blood test" searches;
  // falls back to the city when no areas are set.
  const areaText = areas.length
    ? `${areas.slice(0, 6).join(", ")} aur aas-paas ke ilaake`
    : `${city} ke har ilaake`;

  const faqs = [
    {
      // Snippet-friendly: pehla hi hissa "free hai / kitne ka hai" ka jawab de
      // deta hai, jo featured snippet jeet-ta hai.
      q: `${city} me lab test ka kitna kharcha hai, aur kya home sample collection free hai?`,
      a: `Aap sirf test ka price dete hain jo har card par likha hai — ${city} me home sample collection bilkul free hai, na koi visiting charge na koi hidden fee. Ek trained phlebotomist aapke ghar aata hai, aapke saamne sample leta hai aur lab tak pahunchata hai.`,
    },
    {
      q: `Kya main ${city} me ghar par blood test kara sakta hoon?`,
      a: `Haan. Verified ID card wala ek trained phlebotomist aapke ${city} wale ghar par aata hai — aam taur par booking confirm hone ke 60 minute ke andar — aur aapke saamne sample leta hai. Collection shuru hone se pehle aap uska ID card check kar sakte hain.`,
    },
    {
      q: `${city} me aap home sample collection ke liye kaun-kaun se area cover karte hain?`,
      a: `Hum ${areaText} me sample collect karte hain. Aap aas-paas rehte hain par sure nahi ki aapka address cover hota hai? ${LAB_PHONE} par call karein, hum book karne se pehle confirm kar denge.`,
    },
    {
      q: `${city} me mujhe lab test ki report kitni jaldi mil jaayegi?`,
      a: `Zyadatar report 24 ghante ke andar taiyaar ho jaati hai aur WhatsApp aur email dono par PDF ke roop me bhej di jaati hai, taaki aap turant apne doctor ko dikha sakein. Kuch special test 48–72 ghante lete hain — sahi time hum booking ke waqt bata dete hain.`,
    },
    {
      q: "Kaun se lab test me sample dene se pehle fasting (khaali pet) zaroori hai?",
      a: "Fasting Blood Sugar, Lipid Profile aur Full Body Checkup jaise test me 8–12 ghante ki fasting chahiye; saada paani pi sakte hain. Isiliye home visit slot subah 6 baje se shuru hote hain — jaldi sample dein aur uske turant baad naashta karein. CBC, Thyroid Profile aur Vitamin D me koi fasting nahi chahiye.",
    },
    {
      q: `${city} me main kaun-kaun se lab test aur health package book kar sakta hoon?`,
      a: `Aap routine pathology test aur checkup package book kar sakte hain — CBC, Thyroid Profile, Blood Sugar, HbA1c, Lipid Profile, Liver (LFT) aur Kidney (KFT) test, Vitamin D aur B12, Dengue aur Full Body Checkup. Agar doctor ne koi aisa test likha hai jo is page par nahi hai, to prescription ke saath ${LAB_PHONE} par call karein — zyadatar test usi home visit me ho jaate hain.`,
    },
    {
      q: `${city} me lab test kaise book karein, aur payment ke kya option hain?`,
      a: `Is page par koi test chunein aur "Book Now" form bharein, ya seedhe ${LAB_PHONE} par call karein. Aap sample collection ke waqt cash de sakte hain, ya UPI se — PhonePe, Google Pay ya Paytm.`,
    },
  ];

  // Alternate-name FAQ (jaise Varanasi ke liye "Banaras"). Jo log official naam
  // kabhi nahi type karte unhe capture karta hai, aur dono naam ek hi sheher ke
  // hone ki baat plain fact ke roop me kehta hai — isse zyada koi claim nahi.
  const alias = aliases[0];
  if (alias) {
    faqs.splice(3, 0, {
      q: `Kya aap ${alias} me lab test karte hain?`,
      a: `Haan — "${alias}" aur "${city}" ek hi sheher ke do naam hain, isliye is page ki har service applicable hai. Chahe aap "${alias}" me lab test dhoondein ya "${city}" me, aapko wahi free home sample collection aur 24-ghante me report milti hai.`,
    });
  }

  return faqs;
};

/* ── CTA band ─────────────────────────────────────────────────────────────
   Claims the page already makes elsewhere — no invented numbers, so the strip
   stays credible rather than salesy. */

export const defaultCta = (city) => ({
  headingLead: `Book a lab test in ${city} —`,
  headingAccent: "sample collected at home",
  proof: ["Trained phlebotomist", "Free home collection", "Reports in 24 hrs"],
});

/* ── Long-form SEO copy ───────────────────────────────────────────────────
   Shape: { id, h, p: [paragraph, ...] } — `id` doubles as the anchor target
   and feeds the "On this page" rail. */

export const defaultContent = (city) => [
  {
    id: "lab-test-at-home",
    h: `Lab Tests at Home in ${city}`,
    p: [
      `Getting a blood test done in ${city} no longer means standing in a queue at a diagnostic centre. A trained phlebotomist reaches your address, collects the sample in front of you, and carries it to the lab. You stay home; only the report travels.`,
      `Home collection is free on every test listed on this page. What you pay is the test price you see on the card — there is no visiting charge, no packaging fee and no separate charge for reporting.`,
    ],
  },
  {
    id: "popular-tests",
    h: "Which tests do people book most often?",
    p: [
      `CBC, Thyroid Profile, Blood Sugar and the Full Body Checkup make up most bookings in ${city}. Seasonal panels move too — the Fever Panel covering malaria, typhoid and dengue is booked heavily through the monsoon, while Vitamin D and Vitamin B12 stay steady all year.`,
      `If a doctor has written a test that is not listed on this page, call us with the prescription — most routine pathology tests can be arranged at the same home visit.`,
    ],
  },
  {
    id: "preparation",
    h: "How to prepare before your sample is collected",
    p: [
      `Fasting tests such as Fasting Blood Sugar, the Lipid Profile and the Full Body Checkup need 8–12 hours without food; plain water is fine and should not be skipped. Booking an early slot makes this easier — collection starts at 6 AM, so you can eat right after the sample is taken.`,
      `Keep your prescription and any earlier reports handy. Carrying forward previous values lets your doctor read a trend rather than a single reading, which is what they actually act on.`,
    ],
  },
  {
    id: "reports",
    h: "Reports and what happens after collection",
    p: [
      `Samples are processed at our partner laboratories, and the report is issued by the laboratory that ran the test.`,
      `Most reports reach you within 24 hours as a PDF on WhatsApp and email — the same file you can forward to your doctor or print at a shop. Specialised tests that need longer incubation take 48–72 hours, and that timeline is told to you at the time of booking, not after.`,
    ],
  },
];

/* ── Closing call strip ───────────────────────────────────────────────────── */

export const defaultCallBanner = (city) => ({
  heading: `Book Your Health Checkup in ${city}`,
  buttonText: "Book Now — Call Us",
});

/* ── Footer ───────────────────────────────────────────────────────────────
   The tests people search for by name — keyword-bearing internal links carry
   far more SEO weight here than a second copy of the top navigation. */

export const defaultFooter = (city) => ({
  tagline: `Lab tests & health checkups at home in ${city} — free sample collection by trained phlebotomists & reports in 24 hours.`,
  popularTests: [
    "CBC Test",
    "Full Body Checkup",
    "Thyroid Profile",
    "Blood Sugar Test",
    "Vitamin D Test",
    "Lipid Profile",
  ],
  email: "medicobharat@gmail.com",
  phone: LAB_PHONE,
  hours: "Open all 7 days · Slots from 6 AM",
  // Social handles. `type` maps to a brand icon in LabFooter's registry — an
  // unknown type falls back to a neutral globe rather than breaking the row.
  // These are the real profiles used in the site's schema (see app/layout.js);
  // update the href here (or per city in Firestore) if a handle ever changes.
  social: [
    { type: "instagram", label: "Instagram", href: "https://www.instagram.com/medicobharat_01/" },
    { type: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61591803531075" },
    { type: "whatsapp", label: "WhatsApp", href: `https://wa.me/${LAB_WHATSAPP}` },
  ],
});

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export const defaultTitle = (city) =>
  `Lab Test in ${city} | Free Home Sample Collection`;

export const defaultDescription = (city, state, areas = []) =>
  `Book lab tests in ${city}, ${state} with free home sample collection by MedicoBharat. Trained phlebotomists, reports in 24 hours and affordable prices${
    areas.length ? ` across ${areas.slice(0, 4).join(", ")} and nearby areas` : ""
  }.`;

/**
 * Alternate names a city is also searched by, keyed by slug. Varanasi is very
 * commonly searched as "Banaras", so that spelling has to appear in the keywords
 * or all of that traffic silently misses this page. A city can override this by
 * setting its own `aliases` array in Firestore — that wins over the fallback.
 */
export const CITY_ALIASES = {
  varanasi: ["Banaras"],
};

export const defaultKeywords = (city, areas = [], aliases = []) => [
  `Lab Test in ${city}`,
  `Blood Test in ${city}`,
  `Pathology Lab in ${city}`,
  `Home Sample Collection in ${city}`,
  `Full Body Checkup in ${city}`,
  `Diagnostic Centre in ${city}`,
  `Lab Test at Home ${city}`,
  `Best Lab in ${city}`,
  `Lab Test Price in ${city}`,
  ...areas.map((area) => `Lab Test in ${area} ${city}`),
  // The same searches under the city's alternate name(s) — e.g. "Lab Test in
  // Banaras" for Varanasi. Without these, a searcher who never types the
  // official name is invisible to this page.
  ...aliases.flatMap((alt) => [
    `Lab Test in ${alt}`,
    `Blood Test in ${alt}`,
    `Full Body Checkup in ${alt}`,
    `Home Sample Collection in ${alt}`,
    `Pathology Lab in ${alt}`,
  ]),
  // "near me" searches carry no city of their own — Google fills that in from
  // the searcher's location, which the DiagnosticLab schema's areaServed answers.
  "Lab Test Near Me",
  "Blood Test Near Me",
  "Full Body Checkups Near Me",
  "MedicoBharat Lab Test",
  "Online Lab Test Booking",
];
