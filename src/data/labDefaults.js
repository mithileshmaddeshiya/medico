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

export const defaultFaqs = (city) => [
  {
    q: `How much does home sample collection cost in ${city}?`,
    a: `Home sample collection in ${city} is completely free. You pay only for the test — no visiting charge and no hidden fees. A trained phlebotomist comes to your door, collects the sample and carries it safely to the lab.`,
  },
  {
    q: "Who collects the sample, and how soon do they arrive?",
    a: "A trained phlebotomist (lab technician) with a verified ID card comes to your home, usually within 60 minutes of your booking being confirmed. You can check the ID card before the collection starts.",
  },
  {
    q: "When and how will I get my report?",
    a: "Most reports are ready within 24 hours and are sent as a PDF on both WhatsApp and email, so you can show them to your doctor right away. A few specialised tests take 48–72 hours — we tell you the exact timeline at the time of booking.",
  },
  {
    q: "Which tests require fasting?",
    a: "Tests such as Fasting Blood Sugar, Lipid Profile and the Full Body Checkup need 8–12 hours of fasting. That is why home visit slots start at 6 AM — give your sample early and have your breakfast right after. Tests like CBC, Thyroid Profile and Vitamin D need no fasting at all.",
  },
  {
    q: "What if I have a question about my report?",
    a: `Call us at ${LAB_PHONE} and we will help you read the report and, where a value needs explaining, put you back in touch with the lab that ran the test. Keep any earlier reports handy — a doctor acts on the trend between readings, not on a single number.`,
  },
  {
    q: "How do I book a test, and what payment options are available?",
    a: `Select a test on this page and fill the "Book Now" form, or simply call us at ${LAB_PHONE}. You can pay in cash at the time of sample collection, or by UPI (PhonePe, Google Pay, Paytm).`,
  },
];

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
});

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export const defaultTitle = (city) =>
  `Lab Test in ${city} | Free Home Sample Collection`;

export const defaultDescription = (city, state, areas = []) =>
  `Book lab tests in ${city}, ${state} with free home sample collection by MedicoBharat. Trained phlebotomists, reports in 24 hours and affordable prices${
    areas.length ? ` across ${areas.slice(0, 4).join(", ")} and nearby areas` : ""
  }.`;

export const defaultKeywords = (city, areas = []) => [
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
  // "near me" searches carry no city of their own — Google fills that in from
  // the searcher's location, which the DiagnosticLab schema's areaServed answers.
  "Lab Test Near Me",
  "Blood Test Near Me",
  "Full Body Checkups Near Me",
  "MedicoBharat Lab Test",
  "Online Lab Test Booking",
];
