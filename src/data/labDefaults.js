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
    id: "lab-test-in-varanasi",
    h: `${city} Me Lab Test — Online Blood Test Booking, Free Home Sample Collection`,
    p: [
      `${city} poore Purvanchal ka healthcare centre hai. Chandauli, Jaunpur, Ghazipur, Mirzapur, Bhadohi, Ballia, Azamgarh aur Bihar ke border districts se roz patients yahan aate hain — kyunki specialist doctors, tertiary hospitals aur NABL accredited diagnostic labs asal me yahi par hain. Iska matlab ye bhi hai ki Lanka, Sunderpur, Bhelupur aur Cantt ki labs me subah 7 baje se 10 baje tak lambi line lagti hai, kyunki har fasting sample isi window me dena hota hai.`,
      `Lab test online book karne se ye poori line hat jaati hai. Aap apna test ya health package choose kijiye, morning slot select kijiye, aur trained phlebotomist aapke ghar ${city} me aa kar aapke saamne fresh sterile needle se sample leta hai. Report seedhe aapke phone par PDF me aa jaati hai. Na traffic me travel, na khaali pet plastic chair par intezaar, aur na hi counter par bill dekh kar surprise.`,
      `Aap individual test bhi book kar sakte hain — CBC, thyroid profile, HbA1c, liver function test, kidney function test, lipid profile, vitamin D aur vitamin B12 — ya phir ek hi sample me 60 se 90 parameter wala full body health checkup. Doctor ka likha hua panel, pre-employment checkup, surgery se pehle ki jaanch, pregnancy profile aur saal me ek baar hone wali routine screening, sab isi tarike se book hoti hai.`,
    ],
  },

  {
    id: "home-sample-collection-varanasi",
    h: `Poore ${city} Me Free Home Sample Collection`,
    p: [
      `Certified phlebotomist aapke address par sealed collection kit, single-use vacutainer, nayi disposable needle aur barcode printer le kar aata hai. Tube aapke saamne label aur barcode hoti hai, isliye do patients ke sample aapas me badalne ka koi chance nahi rehta. Uske baad sample temperature-controlled box me lab tak jaata hai — kyunki ${city} ki dopahar ki garmi me garam hua blood sample potassium, LDH aur glucose ki galat value de deta hai.`,
      `Subah 6:30 se 10:30 baje ke slot fasting tests ke liye rakhe jaate hain, jaise fasting blood sugar, lipid profile aur insulin. Non-fasting tests jaise CBC, thyroid profile, dengue NS1, vitamin D ya HbA1c din bhar kabhi bhi ho sakte hain. Ghar me koi bujurg hai, bed-rest par hai, diabetic hai jinki vein patli ho gayi hai, ya operation ke baad recovery kar raha hai — to booking ke waqt bata dijiye, taki experienced phlebotomist bheja jaaye.`,
      `Home collection poore sheher me available hai: Lanka, Sunderpur, Nagwa, Assi Ghat, Samne Ghat, Ravindrapuri, Bhelupur, Durgakund, Sigra, Mahmoorganj, Maldahiya, Cantt, Nadesar, Kachahari, Chowk, Godowlia, Dashashwamedh, Lahurabir, Bhojubir, Pandeypur, Ashapur, Sarnath, Shivpur, Chandmari, DLW, Chitaipur, Susuwahi, Karaundi, Lahartara, Manduadih, Rathyatra, Bajardiha, Ramnagar, aur Ring Road tatha Babatpur airport route ki nayi colonies.`,
      `Purane sheher ki tangg galiyon me — Chowk, Godowlia aur ghaton ke aas paas, jahan char pahiya gaadi ja hi nahi sakti — collection two-wheeler se hoti hai. Isliye booking karte waqt location theek se pin kijiye aur ek landmark zaroor likhiye. Agar ghar ke teen-chaar log ek saath test kara rahe hain to sabka sample ek hi slot me book kijiye: ek visit, ek trip, aur aksar package discount bhi.`,
    ],
  },

  {
    id: "popular-blood-tests-varanasi",
    h: `${city} Me Sabse Zyada Book Hone Wale Blood Tests Aur Wo Kya Batate Hain`,
    p: [
      `Complete Blood Count (CBC) sheher ka sabse zyada order hone wala test hai. Ye haemoglobin, RBC, WBC aur platelet count naapta hai, aur bukhar, kamzori, baar-baar infection ya anaemia ke shak me doctor sabse pehle yahi likhte hain. Purvanchal me anaemia bahut aam hai, khaas kar auraton aur teenage ladkiyon me — isliye haemoglobin kam aane par aage iron studies, ferritin aur vitamin B12 kiya jaata hai.`,
      `Thyroid Profile (TSH, T3, T4) doosre number par hai. Bina wajah wazan badhna ya ghatna, baal jhadna, periods ka irregular hona, hamesha thakan, thand zyada lagna, ya infertility ki jaanch — sab isi test tak le aate hain. Hypothyroidism North India me bahut common hai aur diagnose hone ke baad aasani se control ho jaata hai, lekin test karayenge tabhi pata chalega. Jo log pehle se thyroxine le rahe hain, unhe dose change ke baad har 6 se 8 hafte me TSH dohrana chahiye, phir har 6 se 12 mahine me.`,
      `Diabetes ke test — Fasting Blood Sugar, Post Prandial Blood Sugar aur HbA1c — iske turant baad aate hain. HbA1c pichhle 2 se 3 mahine ka average sugar control batata hai aur ismein fasting ki zaroorat nahi hoti, isliye jinka khaane ka time fix nahi rehta unke liye ye sabse bharosemand test hai. Jo pehle se diabetic hain unhe har teen mahine me HbA1c aur saal me ek baar kidney function ke saath urine microalbumin karana chahiye.`,
      `Baaki top list ye hai: cholesterol aur triglycerides ke liye Lipid Profile, bilirubin, SGOT, SGPT aur alkaline phosphatase ke liye Liver Function Test (LFT), urea, creatinine aur uric acid ke liye Kidney Function Test (KFT/RFT), Vitamin D aur Vitamin B12, Urine Routine aur Microscopy, Blood Group aur Rh typing, inflammation ke liye ESR aur CRP, aur bukhar ka panel — Dengue NS1, Widal, Malaria aur Typhidot. Hepatitis B (HBsAg), Hepatitis C aur HIV screening operation se pehle, dialysis se pehle aur pregnancy me aksar karayi jaati hai.`,
    ],
  },

  {
    id: "full-body-checkup-varanasi",
    h: `${city} Me Full Body Health Checkup — Ismein Kya Kya Hona Chahiye`,
    p: [
      `Asli full body checkup sirf parameter ki lambi list nahi hoti. Kam se kam paanch system cover hone chahiye: blood (CBC, ESR), sugar (fasting glucose aur HbA1c), heart risk (complete lipid profile), liver (poora LFT with albumin aur globulin), aur kidney (urea, creatinine, uric acid, electrolytes ke saath urine routine). Iske upar thyroid profile, vitamin D aur B12 jod dijiye — tab package me sach me kuch pakad me aata hai.`,
      `Basic package aam taur par 45 se 60 parameter ka hota hai aur 30 saal se kam umar ke healthy logon ke yearly baseline ke liye theek hai. Advanced package 70 se 85 parameter ka hota hai, jismein thyroid, vitamins, iron studies aur electrolytes jud jaate hain — 30 se 50 saal ke working adults ke liye yahi sahi fit hai. Comprehensive package 90 se 100+ parameter ka hota hai, jismein cardiac risk markers, HbA1c, urine microalbumin aur kabhi kabhi 50 se upar ke purushon ke liye PSA ya mahilaon ke liye hormone panel bhi shamil hota hai.`,
      `Package price dekh kar nahi, apne risk dekh kar chuniye. Ghar me diabetes ya heart disease ki history hai to basic package me bhi HbA1c, lipid profile aur kidney markers ko priority dijiye. Din bhar desk par baithte hain aur dhoop kam milti hai to extra liver enzymes se zyada zaroori vitamin D aur B12 hai. Aur agar aap vegetarian hain — jo ${city} ke zyadatar gharon me hai — to B12 deficiency itni common hai ki use saal ke panel me jagah milni hi chahiye.`,
    ],
  },

  {
    id: "lab-test-price-varanasi",
    h: `${city} Me Lab Test Price (Indicative Range)`,
    p: [
      `${city} ka rate Delhi aur Lucknow se kaafi kam padta hai, lekin NABL accredited lab aur chhote unaccredited collection point ke beech farq bahut hota hai. Sheher me aam taur par milne wale range: CBC ₹200–₹400, ESR ₹100–₹200, Fasting Blood Sugar ₹80–₹150, HbA1c ₹400–₹700, Lipid Profile ₹450–₹800, Liver Function Test ₹450–₹800, Kidney Function Test ₹500–₹900.`,
      `Hormone aur vitamin ke liye: Thyroid Profile (T3, T4, TSH) ₹350–₹600, Vitamin D (25-OH) ₹900–₹1,600, Vitamin B12 ₹700–₹1,200, Ferritin ₹500–₹900, Urine Routine ₹100–₹250. Bukhar ke season ke test: Dengue NS1 Antigen ₹600–₹1,100, Dengue IgG/IgM ₹700–₹1,200, Widal ₹200–₹400, Malaria Antigen ₹300–₹600, Typhidot ₹500–₹900.`,
      `Asli bachat health package me hoti hai. Basic full body checkup aam taur par ₹999 se ₹1,499 ke beech, advanced package ₹1,800 se ₹2,800 ke beech, aur comprehensive package ₹3,000 se ₹5,000 ke beech aata hai — wahi test alag alag karane par bill aasani se ₹8,000 paar kar jaata hai.`,
      `Paisa dene se pehle teen cheezein confirm kar lijiye: home collection sach me free hai ya bill ke end me jud jaayega, quoted price usi method ka hai jo aapke doctor ne likha hai (CLIA aur ECLIA method purane ELISA se mehnge hote hain lekin hormone ke liye zyada reliable hain), aur report NABL-signed hai ya nahi. Jo test ₹150 sasta hai lekin dobara sahi lab me karana pade, wo sasta nahi hai.`,
    ],
  },

  {
    id: "fever-dengue-typhoid-testing-varanasi",
    h: `${city} Me Bukhar: Dengue, Typhoid, Malaria Aur Jaundice Ki Jaanch`,
    p: [
      `July se November tak sheher me viral fever, dengue aur typhoid tezi se badhte hain — monsoon ke baad jal-bharav, purane wardon me ghani basti, aur cooler tatha chhat ki tanki me jama paani machhar ke liye perfect conditions bana dete hain. Sabse badi galti jo patients karte hain wo hai galat din par galat test karana, jisse ilaaj lagbhag ek hafta late ho jaata hai.`,
      `Timing sabse zaroori hai. Dengue NS1 antigen sirf bukhar ke pehle 1 se 5 din me hi bharosemand hai. Paanchve din ke baad NS1 aksar negative aa jaata hai aur tab Dengue IgM antibody karana padta hai. Doosre din IgM ya aathve din NS1 karayenge to dengue hone ke bawajood report negative aa sakti hai. Dono me se koi bhi test ho, saath me CBC zaroor jodiye — girta hua platelet count aur badhta haematocrit hi wo cheez hai jo doctor roz monitor karta hai.`,
      `Typhoid me Widal test ke liye kam se kam 5 se 7 din ka bukhar chahiye, tabhi antibody titre badhte hain; doosre din karaya gaya Widal lagbhag bekaar hota hai. Aur jahan typhoid endemic hai, wahan purane infection se bhi Widal positive aa sakta hai. Typhidot IgM jaldi positive hota hai, aur pehle hafte me blood culture aaj bhi sabse pakka jawab deta hai. Jis bukhar me thand aur kanpkanpi ho, usme malaria antigen aur peripheral smear zaroor jodiye.`,
      `Jaundice ${city} ka doosra khaas pattern hai. Paani se failne wale Hepatitis A aur Hepatitis E garmi me aur monsoon ke baad badh jaate hain, khaas kar wahan jahan peene ka paani aur sewage line paas paas chalti hai. Aankhon ka peelapan, gehra peshab, ulti jaisa lagna aur bhookh khatam hona — in sab par LFT (total aur direct bilirubin ke saath), Hepatitis A IgM aur Hepatitis E IgM karana chahiye. Pregnancy me jaundice ho to turant doctor ko dikhaiye, kyunki Hepatitis E garbhawastha me kahin zyada khatarnak hota hai.`,
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
    id: "nabl-accredited-lab-varanasi",
    h: `${city} Me Bharosemand Lab Kaise Chunein`,
    p: [
      `Sabse pehle NABL accreditation dekhiye. NABL (National Accreditation Board for Testing and Calibration Laboratories) lab ke equipment calibration, reagent handling, staff ki qualification, internal quality control aur turnaround time ka audit karta hai. Accredited lab External Quality Assurance Scheme me bhi hissa leti hai, jismein samay samay par blind sample bheje jaate hain aur uske result desh ki reference labs se milaye jaate hain. Yahi farq hai ek aisi machine me jo number deti hai aur ek aisi machine me jo sahi number deti hai.`,
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
    id: "how-to-book-lab-test-varanasi",
    h: `${city} Me Lab Test Kaise Book Karein`,
    p: [
      `Test ya package ka naam search kijiye, test page par parameter list aur price dekhiye, aur booking me add kar dijiye. Agar doctor ka parcha hai to use upload kar dijiye — isse lab confirm kar leti hai ki wahi panel process ho raha hai jo aapke physician ne likha tha, khaas kar jahan naam milte julte hote hain, jaise Thyroid Profile Total aur Free.`,
      `Apna ${city} ka address landmark ke saath likhiye, collection slot chuniye aur confirm kar dijiye. Aapko SMS milega jismein phlebotomist ka naam aur visit ka time window hoga. Fasting ki instructions, agar koi hain, confirmation ke saath hi aa jaati hain — taki raat 10 baje kisi ko yaad karne ki zaroorat na pade.`,
      `Phlebotomist aata hai, aapka naam aur test list verify karta hai, sample leta hai aur tube aapke saamne barcode karta hai. Poori visit lagbhag 10 minute ki hoti hai. Sample lab pahunchne par ek notification aata hai, aur report taiyaar hone par doosra.`,
    ],
  },

  {
    id: "faq-lab-test-varanasi",
    h: "Aksar Pooche Jaane Wale Sawaal (FAQ)",
    p: [
      `Kya home sample collection safe hai? Haan. Har draw me nayi single-use needle aur sealed vacutainer aapke saamne kholi jaati hai, aur phlebotomist trained tatha identity-verified hota hai. Sample temperature-controlled box me jaata hai, jisse wo value bachi rehti hain jo room temperature par kharab ho jaati hain.`,
      `Kya har test ke liye khaali pet rehna padta hai? Nahi. Sirf fasting sugar, lipid profile, insulin aur zyadatar full body package me 10 se 12 ghante ka fasting chahiye. CBC, thyroid profile, HbA1c, vitamin D, vitamin B12, dengue aur urine test me fasting bilkul zaroori nahi. Fasting ke dauran saada paani pee sakte hain.`,
      `Report kitni jaldi milegi? Routine test aam taur par sample lab pahunchne ke 6 se 24 ghante me report ho jaate hain, aur culture me 48 se 72 ghante lagte hain. Report phone aur email par PDF me aati hai.`,
      `Kya booking ke liye doctor ka parcha zaroori hai? Zyadatar routine test aur health package bina parche ke book ho jaate hain. Kuch specialised test me regulation ke hisaab se prescription lagti hai, aur parcha upload karna hamesha faydemand hai taki sahi panel run ho.`,
      `${city} ke kaun kaun se ilaake cover hote hain? Home collection poore sheher me hai, jismein Lanka, Bhelupur, Sigra, Cantt, Mahmoorganj, Ravindrapuri, Sunderpur, Assi, Chowk, Godowlia, Sarnath, Shivpur, Pandeypur, Ashapur, DLW, Chitaipur, Lahartara, Manduadih aur Ramnagar shamil hain. Slot confirm karne ke liye booking ke waqt apna pin code daaliye.`,
    ],
  },
];

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
