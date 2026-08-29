/**
 * Default page content for a lab-test city.
 *
 * THIS IS WHAT MAKES ADDING A CITY CHEAP. A city entry only has to carry the
 * facts that are genuinely different — slug, name, state, areas. Everything
 * else on the page (hero copy, tests, prices, FAQs, SEO prose, CTA) is
 * generated from these templates with the city's name filled in, so a
 * four-field entry still renders a complete page.
 *
 * Anything you *do* put in the city entry wins over the value here — see
 * buildContent() in src/data/lab/cities.js. So a city can override one FAQ, or
 * its whole test list, without repeating the rest.
 *
 * Icons are stored as STRINGS, not components. Each client component maps the
 * string back to a lucide icon through its own registry — a name with no match
 * falls back to a neutral icon rather than crashing.
 */

export const LAB_PHONE = "+91 989-123-3525";
export const LAB_WHATSAPP = "919891233525";

// Written once because it is printed twice in the footer — as the contact line
// and as the `mailto:` behind the Gmail icon in the social row. Two literals
// would be two chances for them to disagree.
export const LAB_EMAIL = "support.medicobharat@gmail.com";

/**
 * Share-card image for the lab pages (Open Graph + Twitter).
 *
 * MUST be a JPG or PNG at 1200×630 — NOT WebP. WhatsApp and several social
 * scrapers refuse to render a WebP og:image, which is why a mobile share of the
 * old hero (`.webp`) came up as a blank grey box. Keep it under ~300 KB so
 * WhatsApp fetches it in time to build the preview.
 *
 * The file goes in `public/og/`, so this path resolves to `/public/og/lab-test.jpg`.
 * A city can override it with its own `ogImage` field in Firestore.
 */
export const LAB_OG_IMAGE = "/og/ogtag.jpg";

/* ── Hero ─────────────────────────────────────────────────────────────────── */

export const defaultHero = (city) => ({
  // The page's h1, and it is REAL VISIBLE TEXT now — see LabHero.jsx. It used
  // to be `sr-only`, because the headline was burned into the banner artwork
  // below; a raster headline is unindexable, and the same file being the hero
  // on all six city pages meant the single most prominent element on the page
  // was byte-identical across the pages we want ranked for six different towns.
  h1: `Lab Test in ${city} with Free Home Sample Collection`,

  // The one-line promise under the h1. Short on purpose: it sits above the
  // fold on a phone, where anything longer than two lines pushes the booking
  // form off the screen.
  h1Sub: `Ghar baithe blood test book kijiye — free home sample collection ${city} me, report 24 ghante me.`,

  // One banner for every city page. 1696x927, so LabHero's hero box is
  // aspect-11/6 — replacing this file with a different shape means changing
  // that class too, otherwise the artwork's own headline and the contact bar
  // along the bottom get cropped.
  //
  // WebP, not the original PNG: the source was 1.8 MB and this is the LCP
  // element on six pages, marked `priority`, for an audience on mobile data.
  // Same pixel dimensions, 128 KB instead of 1829 KB.
  //
  // ⚠ STILL A SHARED ASSET. The artwork carries its own printed headline, so
  // it now says on screen roughly what the h1 above it says. That is the one
  // piece of this fix that needs a designer rather than a code change: a
  // per-city banner with no baked-in text. See imageAlt below.
  image: "/navheroimage/herocity.webp",

  // The banner has its copy burned into the artwork and a crawler cannot read
  // pixels, so the alt carries that wording rather than describing the photo.
  // The city name is spliced in because this alt is the one piece of the hero
  // that is per-city — the h1 above it is screen-reader only as well.
  imageAlt: `MedicoBharat Lab Test in ${city} — accurate tests, better health. Blood test, advanced technology, safe aur hygienic, free home sample collection.`,
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

/* ── "How to book" steps ──────────────────────────────────────────────────
   The numbered row under the long-form guide — see src/components/lab/LabHowTo.jsx.
   Five steps, in order, and every timing in them is one the rest of the site
   already states: 30 minutes to the call, ~10 minutes for the visit, 6–24 hours
   for a routine report.

   ⚠ SAME RULE AS defaultFaqs BELOW: every claim here must be literally true of
   the actual operation. Do NOT add cold-chain / temperature-controlled
   transport, pathologist verification, barcoded tubes or NABL accreditation to
   step 4 — all four were removed from this project on 23 Jul 2026 because they
   could not be confirmed with the partner lab. */

export const defaultHowTo = (city) => ({
  heading: `How to book a lab test in ${city}`,
  intro:
    "Five steps from booking to report — and the same timings we state everywhere else on this page.",
  steps: [
    {
      icon: "clipboard-list",
      title: "Booking Made Easy",
      text: "Pick a test or package on this page and fill the form, or just call us. Have a doctor's prescription? Keep a photo handy so we run exactly that panel.",
    },
    {
      icon: "headset",
      title: "Guidance",
      text: "We call you back in about 30 minutes to confirm the slot and address, and to tell you whether the test needs fasting.",
    },
    {
      icon: "test-tube",
      title: "Sample Collection",
      text: `A trained phlebotomist reaches your ${city} address with an ID card and draws the sample in front of you. About 10 minutes, and collection is free.`,
    },
    {
      icon: "microscope",
      title: "Lab Processing",
      text: "The sample goes to the lab the same morning. Most routine tests are reported within 6 to 24 hours of reaching there; cultures take 48 to 72.",
    },
    {
      icon: "file-heart",
      title: "Report and Support",
      text: "The PDF report comes on WhatsApp and email, so you can show your doctor right away. Anything unclear in it — call us and we will explain.",
    },
  ],
});

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
   and feeds the "On this page" rail.

   ⚠ READ THIS BEFORE LAUNCHING A NEW CITY ON THESE DEFAULTS.

   What used to sit here was Varanasi's article with `${city}` interpolated into
   it. Every city therefore inherited Varanasi's facts under its own name. When
   Deoria was added, its live page claimed Deoria is Purvanchal's healthcare
   centre and offered home collection at Assi Ghat, Sarnath, DLW, Godowlia and
   the Babatpur airport route — none of which exist in Deoria. That copy now
   lives in src/data/lab/content/varanasi.js where it belongs.

   What remains here is deliberately generic: medical and procedural guidance
   that is true in any city, plus the city's own name and its real `areas`.
   There are no invented local landmarks, no claims about a city's standing in
   its region, and no service claims beyond the confirmed set (see the warning
   above defaultFaqs).

   BUT GENERIC ALSO MEANS DUPLICATE. Two cities running on these defaults get
   near-identical pages, and Google indexes at most one of them — the rest are
   filtered as doorway pages. So these defaults are a scaffold for a city that
   is not live yet, NOT something to launch on. Before a city goes into the
   sitemap, give it its own file in src/data/lab/content/ and set `content` and
   `faqs` on its seed entry, the way varanasi and deoria do. */

export const defaultContent = (city, areas = []) => {
  // Only the city's own localities are ever named — never a hardcoded list, which
  // is how Varanasi's neighbourhoods ended up being offered in Deoria.
  const areaText = areas.length ? areas.join(", ") : `${city} ke har ilaake`;

  return [
  {
    id: "lab-test-overview",
    h: `${city} Me Lab Test — Online Blood Test Booking, Free Home Sample Collection`,
    p: [
      `${city} me lab test karana ab lab tak jaane par nirbhar nahi hai. Zyadatar routine pathology — blood count, sugar, thyroid, liver, kidney, lipid, vitamin aur urine ke test — sirf ek sample par hote hain, aur wo sample aapke ghar par liya ja sakta hai. Isse subah khaali pet safar karna, counter par line lagana aur report lene ke liye doosri baar jaana, teenon bach jaate hain.`,
      `Booking ka tarika seedha hai. Apna test ya health package chuniye, subah ka slot lijiye, aur trained phlebotomist ID card ke saath aapke ghar ${city} me aata hai. Sample wahin liya jaata hai aur report 24 ghante ke andar WhatsApp aur email par PDF me aa jaati hai — kagaz lene dobara jaane ki zaroorat nahi.`,
      `Aap individual test bhi book kar sakte hain — CBC, thyroid profile, HbA1c, liver function test, kidney function test, lipid profile, vitamin D aur vitamin B12 — ya phir ek hi sample me 45 se 88 parameter wala full body health checkup. Doctor ka likha hua panel, surgery se pehle ki jaanch, pregnancy profile aur saal me ek baar hone wali routine screening, sab isi tarike se book hoti hai.`,
    ],
  },

  {
    id: "home-sample-collection",
    h: `Poore ${city} Me Free Home Sample Collection`,
    p: [
      `Home sample collection free hai — aap sirf test ka wahi price dete hain jo card par likha hai, na koi visiting charge na koi hidden fee. Trained phlebotomist ID card ke saath aata hai; sample dene se pehle use dekh lena aapka haq hai. Poori visit lagbhag 10 minute ki hoti hai, aur payment usi waqt cash ya UPI se hota hai.`,
      `Subah 6 baje se slot shuru hote hain, kyunki fasting wale test — fasting blood sugar, lipid profile aur zyadatar full body package — 10 se 12 ghante khaali pet maangte hain. Non-fasting test jaise CBC, thyroid profile, dengue NS1, vitamin D ya HbA1c din me kabhi bhi ho sakte hain.`,
      `${city} me hum ${areaText} me sample collect karte hain. Aapka pata is list me naam se nahi hai to booking se pehle ek call kar lijiye — cover hone par usi waqt slot book ho jaayega, aur nahi hone par hum saaf bata denge.`,
      `Pata likhte waqt ek landmark zaroor daaliye aur mobile number chalu rakhiye; late visit ki sabse aam wajah adhoora pata hoti hai. Ghar me ek se zyada log test kara rahe hain to sabki booking ek hi slot me kar dijiye. Koi bujurg hai, bistar par hai, diabetic hai jinki nas patli ho gayi hai, ya operation ke baad recovery kar raha hai — ye booking ke waqt bata dijiye.`,
    ],
  },

  {
    id: "popular-blood-tests",
    h: `${city} Me Sabse Zyada Book Hone Wale Blood Tests Aur Wo Kya Batate Hain`,
    p: [
      `Complete Blood Count (CBC) sabse zyada order hone wala test hai. Ye haemoglobin, RBC, WBC aur platelet count naapta hai, aur bukhar, kamzori, baar-baar infection ya khoon ki kami ke shak me doctor sabse pehle yahi likhte hain. Haemoglobin kam aane par aage iron studies, ferritin aur vitamin B12 kiya jaata hai, kyunki sirf iron ki goli shuru kar dena adhoora ilaaj hai.`,
      `Thyroid Profile (TSH, T3, T4) doosre number par hai. Bina wajah wazan badhna ya ghatna, baal jhadna, periods ka irregular hona, hamesha thakan, thand zyada lagna, ya infertility ki jaanch — sab isi test tak le aate hain. Hypothyroidism North India me bahut common hai aur diagnose hone ke baad aasani se control ho jaata hai, lekin test karayenge tabhi pata chalega. Jo log pehle se thyroxine le rahe hain, unhe dose change ke baad har 6 se 8 hafte me TSH dohrana chahiye, phir har 6 se 12 mahine me.`,
      `Diabetes ke test — Fasting Blood Sugar, Post Prandial Blood Sugar aur HbA1c — iske turant baad aate hain. HbA1c pichhle 2 se 3 mahine ka average sugar control batata hai aur ismein fasting ki zaroorat nahi hoti, isliye jinka khaane ka time fix nahi rehta unke liye ye sabse bharosemand test hai. Jo pehle se diabetic hain unhe har teen mahine me HbA1c aur saal me ek baar kidney function ke saath urine microalbumin karana chahiye.`,
      `Baaki top list ye hai: cholesterol aur triglycerides ke liye Lipid Profile, bilirubin, SGOT, SGPT aur alkaline phosphatase ke liye Liver Function Test (LFT), urea, creatinine aur uric acid ke liye Kidney Function Test (KFT/RFT), Vitamin D aur Vitamin B12, Urine Routine aur Microscopy, Blood Group aur Rh typing, inflammation ke liye ESR aur CRP, aur bukhar ka panel — Dengue NS1, Widal, Malaria aur Typhidot. Hepatitis B (HBsAg), Hepatitis C aur HIV screening operation se pehle, dialysis se pehle aur pregnancy me aksar karayi jaati hai.`,
    ],
  },

  {
    id: "full-body-checkup",
    h: `${city} Me Full Body Health Checkup — Ismein Kya Kya Hona Chahiye`,
    p: [
      `Asli full body checkup sirf parameter ki lambi list nahi hoti. Kam se kam paanch system cover hone chahiye: blood (CBC, ESR), sugar (fasting glucose aur HbA1c), heart risk (complete lipid profile), liver (poora LFT with albumin aur globulin), aur kidney (urea, creatinine, uric acid, electrolytes ke saath urine routine). Iske upar thyroid profile, vitamin D aur B12 jod dijiye — tab package me sach me kuch pakad me aata hai.`,
      `Basic package aam taur par 45 se 60 parameter ka hota hai aur 30 saal se kam umar ke healthy logon ke yearly baseline ke liye theek hai. Advanced package 70 se 85 parameter ka hota hai, jismein thyroid, vitamins, iron studies aur electrolytes jud jaate hain — 30 se 50 saal ke working adults ke liye yahi sahi fit hai. Comprehensive package 90 se 100+ parameter ka hota hai, jismein cardiac risk markers, HbA1c, urine microalbumin aur kabhi kabhi 50 se upar ke purushon ke liye PSA ya mahilaon ke liye hormone panel bhi shamil hota hai.`,
      `Package price dekh kar nahi, apne risk dekh kar chuniye. Ghar me diabetes ya heart disease ki history hai to basic package me bhi HbA1c, lipid profile aur kidney markers ko priority dijiye. Din bhar andar baithte hain aur dhoop kam milti hai to extra liver enzymes se zyada zaroori vitamin D aur B12 hai. Aur shudh shakahari khana chalta ho to Vitamin B12 ki kami itni common hai ki use saal ke panel me jagah milni hi chahiye.`,
    ],
  },

  {
    // Card prices, not market estimates. The old version quoted an "indicative
    // range" for the city — numbers nobody had surveyed, on a page that also
    // shows the real price beside every test. Quoting the actual cards keeps the
    // prose and the price list from ever contradicting each other.
    id: "lab-test-price",
    h: `${city} Me Lab Test Ka Price`,
    p: [
      `Har card par jo price likha hai, wahi aapko dena hai — home sample collection uske upar free hai, na visiting charge na koi hidden fee. Payment sample lene ke waqt hota hai, cash ya UPI (PhonePe, Google Pay, Paytm) se.`,
      `Aam test ke price: Blood Sugar ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1,000, Vitamin B12 ₹1,200 aur Dengue (NS1, IgG, IgM) ₹1,200.`,
      `Bachat package me sabse zyada hai: Basic Full Body Checkup ₹999 me 45 parameter, Advanced Full Body ₹1,999 me 72 parameter, aur Senior Citizen Pack ₹2,999 me 88 parameter. Wahi test alag alag karane par kharcha kai guna ho jaata hai.`,
      `Kuch test, jaise Fever Panel, us waqt ki zaroorat par tay hote hain — unke card par "Call for price" likha rehta hai. Phone par pooch lijiye; sample dene se pehle price bata diya jaata hai.`,
    ],
  },

  {
    id: "fever-dengue-typhoid-testing",
    h: `${city} Me Bukhar: Dengue, Typhoid, Malaria Aur Jaundice Ki Jaanch`,
    p: [
      `Monsoon ke baad viral fever, dengue aur typhoid tezi se badhte hain — jama paani, cooler aur chhat ki tanki machhar ke liye maakool haalat bana dete hain. Sabse badi galti jo patients karte hain wo hai galat din par galat test karana, jisse sahi ilaaj lagbhag ek hafta late ho jaata hai.`,
      `Timing sabse zaroori hai. Dengue NS1 antigen sirf bukhar ke pehle 1 se 5 din me hi bharosemand hai. Paanchve din ke baad NS1 aksar negative aa jaata hai aur tab Dengue IgM antibody karana padta hai. Doosre din IgM ya aathve din NS1 karayenge to dengue hone ke bawajood report negative aa sakti hai. Dono me se koi bhi test ho, saath me CBC zaroor jodiye — girta hua platelet count aur badhta haematocrit hi wo cheez hai jo doctor roz monitor karta hai.`,
      `Typhoid me Widal test ke liye kam se kam 5 se 7 din ka bukhar chahiye, tabhi antibody titre badhte hain; doosre din karaya gaya Widal lagbhag bekaar hota hai. Aur jahan typhoid endemic hai, wahan purane infection se bhi Widal positive aa sakta hai. Typhidot IgM jaldi positive hota hai, aur pehle hafte me blood culture aaj bhi sabse pakka jawab deta hai. Jis bukhar me thand aur kanpkanpi ho, usme malaria antigen aur peripheral smear zaroor jodiye.`,
      `Jaundice alag se dhyan maangta hai. Paani se failne wale Hepatitis A aur Hepatitis E garmi me aur monsoon ke baad badh jaate hain, khaas kar wahan jahan peene ka paani aur sewage line paas paas chalti hai. Aankhon ka peelapan, gehra peshab, ulti jaisa lagna aur bhookh khatam hona — in sab par LFT (total aur direct bilirubin ke saath), Hepatitis A IgM aur Hepatitis E IgM karana chahiye. Pregnancy me jaundice ho to turant doctor ko dikhaiye, kyunki Hepatitis E garbhawastha me kahin zyada khatarnak hota hai.`,
    ],
  },

  {
    id: "diabetes-thyroid-heart-screening",
    h: "Diabetes, Thyroid Aur Heart Risk Screening",
    p: [
      `Duniya ki sabse badi diabetic aabadi me se ek India me hai, aur bahut bade hisse ko tab tak pata hi nahi chalta jab tak koi complication saamne na aa jaaye. Agar aapki umar 30 se upar hai, kamar ke aas paas wazan zyada hai, mummy-papa ya bhai-behen me kisi ko diabetes hai, ya pregnancy me sugar badha tha — to saal me ek baar fasting sugar aur HbA1c zaroor karayein. Aur agar pyaas zyada lag rahi hai, raat me baar baar peshab aa raha hai, ghaav der se bhar rahe hain ya wazan achanak gir raha hai, to intezaar mat kijiye.`,
      `Jinhe pehle se diabetes hai, unka saal bhar ka schedule seedha sa hai: har teen mahine me HbA1c, saal me ek baar lipid profile, saal me ek baar kidney function ke saath urine microalbumin, aur saal me ek baar aankhon ka fundus check. Urine microalbumin sabse pehla warning hai ki diabetes kidney par asar daal raha hai — aur yahi test log sabse zyada chhodte hain.`,
      `Thyroid test ke liye log zyada hi intezaar karte hain. 35 ke baad mahilayein, jinke parivaar me history hai, pregnancy plan kar rahi ya pehli trimester wali mahilayein, aur jinko lagatar thakan, baal jhadna ya periods ki gadbadi hai — sabko ek baar TSH karana chahiye. Subclinical hypothyroidism, yaani TSH badha hua lekin T3 aur T4 normal, kaafi common hai aur aksar sirf monitoring maangta hai — isi wajah se ek baseline value haath me hona faydemand hai.`,
    ],
  },

  {
    id: "pregnancy-women-health-tests",
    h: `${city} Me Pregnancy Aur Women's Health Tests`,
    p: [
      `Pehli trimester ke standard antenatal panel me CBC, blood group aur Rh typing, fasting aur post-prandial sugar ya OGTT, TSH, urine routine aur culture, HIV, HBsAg, VDRL, aur aksar thalassemia screen shamil hota hai. Rh-negative maa ko indirect Coombs test aur samay par anti-D planning chahiye hoti hai, isliye blood group report kabhi late nahi honi chahiye. Double marker test 11 se 13 hafte ke beech hota hai, aur agar wo chhoot gaya to quadruple marker 15 se 20 hafte ke beech.`,
      `Is ilaake me pregnancy ke dauran anaemia sabse badi samasya hai. Pregnancy me haemoglobin 11 g/dL se neeche ho to sirf iron ki goli shuru karna kaafi nahi, jaanch honi chahiye — ferritin, vitamin B12 aur folate batate hain ki wajah iron ki kami hai, B12 ki kami hai, ya kuch aur. CBC har trimester me kam se kam ek baar dohraiye.`,
      `Pregnancy ke alawa, jin mahilaon ko irregular periods, acne, chehre par anchahe baal ya conceive karne me dikkat hai, unki jaanch aam taur par PCOS panel se hoti hai: LH, FSH, prolactin, testosterone, DHEAS, TSH, fasting insulin aur fasting glucose. Ye cycle ke din par depend karte hain, isliye apni gynaecologist se pooch lijiye ki kis din sample dena hai — aam taur par cycle ke doosre se paanchve din ke beech.`,
    ],
  },

  {
    id: "how-to-prepare-for-blood-test",
    h: "Blood Test Se Pehle Ki Taiyari",
    p: [
      `Fasting test — fasting blood sugar, lipid profile, insulin aur zyadatar full body package — me 10 se 12 ghante bina khaaye rehna hota hai. Saada paani peena na sirf allowed hai balki zaroori hai: hydrated vein se sample aasani se nikalta hai, aur paani ki kami haemoglobin, urea aur creatinine ko jhoothe taur par badha deti hai. Raat ka khaana 9 baje tak khatam kijiye aur subah 7 se 9 baje ka slot lijiye. 14 ghante se zyada faaka karna ulta nuksan karta hai aur result bigaad deta hai.`,
      `Lipid profile ya liver function test se kam se kam 24 ghante pehle sharaab bilkul na lein — ek shaam ki peene se hi triglycerides aur liver enzymes kaafi badh jaate hain. CPK, LDH ya kidney function test se ek din pehle heavy gym avoid kijiye, kyunki tez exercise se muscle enzymes aur creatinine badh jaate hain. Aur aadat me fasting sample se pehle kuch bhi mat khaaiye — ek biscuit poora test kharab kar deta hai.`,
      `Dawaiyon ka aam niyam ye hai ki apni regular tablets usi samay par lijiye jab tak doctor mana na kare, do exception ke saath: thyroid ki goli blood nikalne ke baad leni chahiye, aur biotin ya multivitamin supplement kisi bhi hormone test se 48 se 72 ghante pehle band kar dena chahiye, kyunki biotin assay me interfere karta hai. Phlebotomist ko hamesha bata dijiye ki aap kya kya le rahe hain.`,
    ],
  },

  {
    id: "choosing-a-reliable-lab",
    h: `${city} Me Bharosemand Lab Kaise Chunein`,
    p: [
      `Ek achhe lab ki pehchaan uske quality control se hoti hai: machines ki niyamit calibration, sahi tarike se store kiye gaye reagent, trained staff, aur consistent turnaround time. Aap sidha ye sab nahi dekh sakte, lekin do cheezein zaroor pooch sakte hain — lab kitne saal se chal raha hai, aur wo apni report par test ka method (jaise CLIA/ECLIA) likhta hai ya nahi. Yahi farq hota hai ek aisi machine me jo number deti hai aur ek aisi machine me jo sahi number deti hai.`,
      `Collection ke waqt khud dhyan dijiye. Nayi sterile needle aapke saamne khule, har test ke liye sahi rang ki vacutainer ho, tube aapke darwaze par barcode ho — lab pahunch kar nahi, tube sahi level tak bhare, aur anticoagulant wali tube halke se ulti-seedhi ki jaaye. Clotted ya kam bhara sample hi wo sabse aam wajah hai jiske liye lab dobara sample maangti hai — aur galat tarike se liya gaya sample haemolysis kar deta hai, jisse potassium jhoothe taur par badh jaata hai aur bewajah panic ho jaata hai.`,
      `Aakhir me, repeat test ke liye har baar usi lab me jaaiye. Alag alag analyser aur method ke reference range thode alag hote hain, isliye ek lab me TSH 4.5 aur doosri me 4.1 aane ka matlab ye nahi ki aapka thyroid badal gaya. Jo cheez aap mahino tak track kar rahe hain — HbA1c, TSH, creatinine, ferritin — usme lab ki consistency utni hi zaroori hai jitni khud ka number.`,
    ],
  },

  {
    id: "reports-turnaround-time",
    h: "Report, Turnaround Time Aur Result Kaise Padhein",
    p: [
      `Zyadatar routine test — CBC, sugar, lipid, LFT, KFT, thyroid, urine routine — sample lab pahunchne ke 6 se 24 ghante ke andar ya usi din report ho jaate hain. Vitamin aur hormone assay me aam taur par 24 ghante lagte hain. Culture jaan boojh kar dheeme hote hain: urine ya blood culture me 48 se 72 ghante lagte hain kyunki pehle organism ko ugana padta hai, tabhi antibiotic sensitivity test hoti hai — koi bhi lab isse jaldi ka imaandari se vaada nahi kar sakti.`,
      `Result ke saath chhapi reference range padhiye, internet ke chart se mat milaiye — range method ke hisaab se aur umar tatha ling ke hisaab se badalti hai. High ya low ka flag diagnosis nahi, doctor se milne ka ishaara hai. Thoda sa range se bahar hona bahut common hai aur aksar harmless — jaise haal me hui sardi ke baad halka ESR badha hona, ya Gilbert's syndrome me thoda sa bilirubin badha hona, jo poori tarah benign hai.`,
      `Kuch result appointment ka intezaar nahi maangte, usi din doctor chahiye: dengue me tezi se girta platelet count, bahut zyada blood sugar ke saath ulti ya susti, khatarnak had tak kam haemoglobin, ya bahut badha hua creatinine ke saath peshab ka kam hona. Accredited labs inhe critical value maan kar patient ko phone karti hain, lekin agar tabiyat kharab lag rahi hai to phone ka intezaar mat kijiye.`,
    ],
  },

  {
    id: "how-to-book-lab-test",
    h: `${city} Me Lab Test Kaise Book Karein`,
    p: [
      `Is page par apna test ya package chuniye, parameter list aur price dekhiye, aur booking form bhar dijiye. Doctor ka parcha hai to uska photo saath rakhiye — isse wahi panel liya jaata hai jo aapke physician ne likha tha, khaas kar jahan naam milte julte hote hain, jaise Thyroid Profile Total aur Free.`,
      `Apna ${city} ka address landmark ke saath likhiye aur collection slot chuniye. Fasting wale test subah ke slot me hi karaaiye. Booking confirm hone ke baad trained phlebotomist aam taur par 60 minute ke andar pahunch jaata hai — uske paas ID card hota hai, sample dene se pehle dekh lijiye.`,
      `Poori visit lagbhag 10 minute ki hoti hai. Payment usi waqt cash ya UPI se hota hai. Uske baad aapko kuch nahi karna — report taiyaar hone par WhatsApp aur email par PDF khud aa jaayegi.`,
    ],
  },

  ];
};

/**
 * FAQ schema for rich results in Google. Render this in the same page as the
 * LabContent block. Keep the questions and answers here identical in meaning to
 * the visible FAQ section above — mismatched schema can get the markup ignored.
 */
export const varanasiFaqs = [
  {
    q: "Is home blood sample collection in Varanasi safe?",
    a: "Yes. Every draw uses a fresh single-use needle and a sealed vacutainer opened in front of you, the phlebotomist is trained and identity-verified, and the sample is transported in a temperature-controlled box to protect result accuracy.",
  },
  {
    q: "Do I need to fast before every blood test?",
    a: "No. Only fasting blood sugar, lipid profile, insulin and most full body checkup packages need 10 to 12 hours of fasting. CBC, thyroid profile, HbA1c, vitamin D, vitamin B12 and dengue tests do not require fasting. Plain water is allowed while fasting.",
  },
  {
    q: "How much does a full body checkup cost in Varanasi?",
    a: "A basic full body checkup in Varanasi typically costs between ₹999 and ₹1,499, an advanced package between ₹1,800 and ₹2,800, and a comprehensive package between ₹3,000 and ₹5,000 depending on the number of parameters included.",
  },
  {
    q: "How soon will I get my lab test report?",
    a: "Routine tests such as CBC, sugar, lipid profile, LFT, KFT and thyroid are reported within 6 to 24 hours of the sample reaching the lab. Cultures take 48 to 72 hours. Reports are delivered as a PDF by SMS and email.",
  },
  {
    q: "When should a dengue test be done in Varanasi?",
    a: "Dengue NS1 antigen is accurate only during the first 1 to 5 days of fever. From day 5 onwards, the Dengue IgM antibody test is used instead. A CBC should be done alongside either test to monitor platelet count.",
  },
  {
    q: "Do I need a doctor's prescription to book a lab test?",
    a: "Most routine tests and health packages can be booked without a prescription. Certain specialised tests require one as per regulation, and uploading your prescription helps ensure the exact panel your doctor advised is processed.",
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
  email: LAB_EMAIL,
  phone: LAB_PHONE,
  hours: "Open all 7 days · Slots from 6 AM",
  // Social handles. `type` maps to a brand icon in LabFooter's registry — an
  // unknown type falls back to a neutral globe rather than breaking the row.
  // These are the real profiles used in the site's schema (see app/layout.js);
  // update the href here (or per city in Firestore) if a handle ever changes.
  //
  // The Gmail entry is the odd one out: it is not a profile, it is the same
  // mailto: the contact block already carries, offered again as a one-tap icon
  // for the reader who scans the row rather than reading the block. It is built
  // from LAB_EMAIL for that reason — one address, printed twice.
  social: [
    { type: "instagram", label: "Instagram", href: "https://www.instagram.com/medicobharat_01/" },
    { type: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61591803531075" },
    { type: "whatsapp", label: "WhatsApp", href: `https://wa.me/${LAB_WHATSAPP}` },
    { type: "gmail", label: "Email", href: `mailto:${LAB_EMAIL}` },
  ],
});

/**
 * The footer for a page that is NOT about one city — the home page, /about,
 * /contact, an article.
 *
 * Same contact details and the same social row as a city footer (it is built
 * from the same function), so the two modes can never print a different phone
 * number or a different address. Only the tagline differs, because the city
 * template with no city to interpolate reads "…at home in  —", which is what
 * the footer showed on every non-city page before this existed.
 *
 * No city names are hardcoded in the tagline on purpose: the footer already
 * renders the live list from src/data/lab/cities.js right beside this line,
 * and a hardcoded pair of names goes stale the day a city is added.
 */
export const siteFooter = () => ({
  ...defaultFooter(""),
  tagline:
    "Lab test aur full body checkup ghar baithe — free home sample collection, trained phlebotomist aur report 24 ghante me, poore Purvanchal me.",
});

/* ── Metadata ─────────────────────────────────────────────────────────────── */

/**
 * ⚠ BOTH OF THESE HAVE A CHARACTER BUDGET. READ IT BEFORE EDITING.
 *
 * The root layout appends " | MedicoBharat" — 15 characters — to every title,
 * and Google renders roughly 60 in total. So a title generated here has 45 to
 * work with. It was `Lab Test in ${city} | Free Home Sample Collection`, which
 * is 49 before the suffix and came out at 65 for Varanasi: cut in the SERP, on
 * the flagship city page, while the five cities that override this default all
 * fit comfortably. The shorter form below matches the pattern those five
 * already use, so an overriding city and an inheriting one now read alike.
 *
 * The description budget is ~155 characters. The old one ran to 216 for
 * Varanasi — it named the state, then four localities, then "and nearby areas",
 * and the last quarter was never shown. It was also the site's only English
 * description: the other five cities write theirs in the Hinglish the pages are
 * actually in, which is the register this audience searches in and the one that
 * wins the click.
 *
 * Two localities, not four. Four is what pushed it over, and a reader scanning
 * a result does not need the full coverage list — that is what the page is for.
 */
export const defaultTitle = (city) => `Lab Test in ${city} — Blood Test at Home`;

/** Google truncates a description around here. Not a hard limit — a budget. */
const DESCRIPTION_BUDGET = 155;

/**
 * ⚠ IT FITS THE BUDGET BY CONSTRUCTION, NOT BY LUCK.
 *
 * A fixed template cannot: the length depends on the city's name and on how
 * long its localities happen to be. Tuned by hand against the six cities that
 * exist today, it silently overflows on the seventh — which is exactly how the
 * previous version came to emit 216 characters for Varanasi.
 *
 * So it tries two localities, then one, then none, and takes the first that
 * fits. A long name like "Salempur, Deoria" loses a locality instead of losing
 * the end of the sentence.
 */
export const defaultDescription = (city, state, areas = []) => {
  const build = (count) => {
    const where = count && areas.length
      ? `${areas.slice(0, count).join(", ")} samet poore sheher me`
      : `${city} me`;

    return `${city} me ghar baithe lab test — ${where} free home sample collection. CBC, thyroid, sugar aur full body checkup.`;
  };

  return (
    [2, 1, 0].map(build).find((text) => text.length <= DESCRIPTION_BUDGET) ??
    build(0)
  );
};

/**
 * Alternate names a city is also searched by, keyed by slug. Varanasi is very
 * commonly searched as "Banaras", so that spelling has to appear in the keywords
 * or all of that traffic silently misses this page. A city can override this by
 * setting its own `aliases` array in Firestore — that wins over the fallback.
 */
export const CITY_ALIASES = {
  varanasi: ["Banaras"],
  // No entry for Deoria on purpose. "Devaria" and "Deoriya" were added here as
  // alternate spellings and taken back out — the correct spelling is Deoria,
  // and the base keywords above already carry it. An alias is only worth adding
  // when a city is genuinely known by a DIFFERENT name (Varanasi → Banaras),
  // not for a misspelling of the same one: putting a wrong spelling in the
  // metadata just publishes it in our own name.
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
  // "<area> <city>" is how these are actually searched — "Lab Test in Sarnath
  // Varanasi". But an area whose own name already contains the city produces a
  // stutter: Deoria's "Deoria Sadar" came out as "Lab Test in Deoria Sadar
  // Deoria". Where the city is already in the area name, it is not repeated.
  ...areas.map((area) =>
    area.toLowerCase().includes(city.toLowerCase())
      ? `Lab Test in ${area}`
      : `Lab Test in ${area} ${city}`
  ),
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
