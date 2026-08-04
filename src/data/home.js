/**
 * The home page's content — every word of it, in one file.
 *
 * ── WHY THIS FILE EXISTS ──────────────────────────────────────────────────
 * The home page used to be a medicine-delivery page assembled by a "use
 * client" provider that read src/data/medicine/homeData.js. Both are gone. The
 * site is a lab-test service, and this is the page that has to say so — to a
 * reader in the first three seconds, and to a crawler that currently has this
 * domain filed under "online pharmacy".
 *
 * ── THE ONE RULE THAT MATTERS MOST HERE ───────────────────────────────────
 * NOTHING BELOW MAY BE A CLAIM WE CANNOT STAND BEHIND. No accreditation (we
 * are not NABL accredited and must never imply it), no pathologist sign-off,
 * no ratings, no patient counts, no partner-lab names, no "24x7". The
 * confirmed set is exactly this, and it is all this file uses:
 *
 *   · free home sample collection, no visiting charge
 *   · a trained phlebotomist who carries an ID card
 *   · home-visit slots from 6 AM, all seven days
 *   · reports within 24 hours, as a PDF on WhatsApp and email
 *   · payment at collection, cash or UPI
 *
 * The same rule governs src/data/lab/defaults.js — see the warning above
 * defaultFaqs there. An invented number on a home page is worse than a missing
 * one: it is the page every other page on the domain points at.
 *
 * ── AND THE SECOND RULE: DO NOT REPEAT THE CITY PAGES ─────────────────────
 * /lab-test/varanasi, /lab-test/gorakhpur and /lab-test/deoria each carry a
 * long, hand-written guide about that town. If this page says the same things
 * in the same order, Google indexes one of the four and filters the rest — the
 * exact doorway-page problem the note in src/data/lab/defaults.js describes.
 *
 * So the altitude here is deliberately different. The city pages answer "lab
 * test in MY town — price, areas, booking". This page answers the questions
 * that have no town in them: which test for which symptom, what to screen for
 * at what age, how the whole thing works end to end. Those are the queries a
 * home page can win, and they are not on any city page.
 *
 * ── LINKS INSIDE THE PROSE ────────────────────────────────────────────────
 * A paragraph may be an array of parts, so a sentence can carry a real link:
 * `["text ", { text: "anchor", href: "/lab-test/deoria" }, " more"]`. That is
 * worth far more than another entry in a link column — the anchor sits in a
 * sentence a crawler is already reading for topic. See LabContent.jsx.
 *
 * EVERY href BELOW MUST BE A ROUTE THAT RENDERS. The three city pages come
 * from src/data/lab/cities.js and the two guides from src/data/blogs/varanasi/.
 * If a city is ever unpublished, the links naming it here have to go with it.
 */
import { LAB_PHONE } from "@/data/lab/defaults";

/* ── Metadata ─────────────────────────────────────────────────────────────
   The title is the single most important string on the site: it is what a
   brand search shows, and it is what currently says "Online Medicine
   Delivery". 56 characters, so Google renders it whole — this page sets its
   title absolutely (see the home page's generateMetadata), so the root
   layout's " | MedicoBharat" suffix is NOT appended on top of it. */
export const HOME_META = {
  title: "Lab Test at Home — Free Sample Collection | MedicoBharat",

  // ~155 characters, so it survives on desktop and mobile alike. Hinglish on
  // purpose: the whole site is Hinglish, this audience searches in Hinglish,
  // and a snippet in the reader's own register wins the click. The English
  // terms that have to match a query ("lab test", "blood test", "full body
  // checkup", "home sample collection") are all still in it.
  description:
    "Ghar baithe lab test aur full body checkup book karein — CBC, thyroid, sugar aur vitamin test. Free home sample collection, report 24 ghante me WhatsApp par.",

  /* `keywords` is a weak-to-zero ranking signal on its own. The reason to keep
     it honest and specific is that it is the checklist the headings, FAQs and
     prose below are written against — every term here appears in the visible
     copy of this page. A keyword that appears ONLY in this array is the kind
     that gets a page filtered rather than ranked. */
  keywords: [
    // Brand — the whole point of the rewrite. Google was spell-correcting
    // "medicobharat" to "medical bharat"; see src/lib/schema.js.
    "MedicoBharat",
    "Medico Bharat",
    "MedicoBharat lab test",

    // Primary, location-free. Google fills the city in from the searcher's
    // position, which the schema's areaServed answers.
    "lab test at home",
    "lab test near me",
    "blood test at home",
    "blood test near me",
    "home sample collection",
    "online lab test booking",
    "pathology lab near me",
    "diagnostic centre near me",
    "full body checkup at home",
    "full body checkup near me",

    // Test-wise — the highest-intent queries this page answers
    "CBC test price",
    "thyroid test at home",
    "TSH test price",
    "HbA1c test at home",
    "lipid profile test price",
    "liver function test at home",
    "kidney function test at home",
    "vitamin D test at home",
    "vitamin B12 test price",
    "dengue test at home",
    "full body checkup package price",

    // The questions this page exists to answer, and which no city page does
    "kaun sa lab test kab karayein",
    "blood test se pehle fasting",
    "lab test report kaise padhein",
    "umar ke hisaab se health checkup",

    // Regional — the district names in the service area
    "lab test in Varanasi",
    "lab test in Gorakhpur",
    "lab test in Deoria",
    "lab test in Purvanchal",

    // Devanagari — the script a large share of this audience types in
    "घर पर लैब टेस्ट",
    "घर से सैंपल कलेक्शन",
    "खून की जांच घर पर",
    "फुल बॉडी चेकअप",
  ],
};

/* ── Hero ─────────────────────────────────────────────────────────────────
   The h1 is VISIBLE here, unlike on the city pages where the hero is an image
   plus the booking form and the h1 is screen-reader only. A home page whose
   biggest promise is invisible to the reader is a home page that has to be
   read to be understood, and most of this traffic is on a phone in a hurry. */
export const HOME_HERO = {
  eyebrow: "Free home sample collection · Report 24 ghante me",

  // Two halves so the accent colour can fall on the phrase that carries the
  // primary keyword rather than on a random word in the middle of it.
  h1Lead: "Lab Test Ghar Baithe —",
  h1Accent: "Free Home Sample Collection",

  lead:
    "CBC, thyroid, sugar, vitamin aur full body checkup — sample aapke ghar se liya jaata hai aur report 24 ghante me WhatsApp par PDF me aa jaati hai. Na line, na khaali pet safar, na report lene dobara jaana.",

  /* Four facts, not four adjectives. Every one of them is checkable and every
     one of them is in the confirmed set at the top of this file. */
  points: [
    "Collection bilkul free — sirf test ka price",
    "Slot subah 6 baje se, saaton din",
    "Trained phlebotomist, ID card ke saath",
    "Payment sample lete waqt — cash ya UPI",
  ],

  formTitle: "Book Your Sample Collection",

  // Same asset the city heroes use, so there is one hero image to maintain.
  image: "/navheroimage/labtestimg.webp",
  imageAlt:
    "MedicoBharat ka trained phlebotomist ghar par blood sample collect karte hue",
};

/* ── How it works ─────────────────────────────────────────────────────────
   Four steps, with the actual timings the site promises elsewhere. The point
   of this block on a home page is to remove the one doubt that stops a first
   booking: "kya hoga booking ke baad". */
export const HOME_STEPS = {
  heading: "Booking Se Report Tak — Poora Process",
  intro:
    "Char step, aur teenon timing wahi hain jo hum har page par likhte hain — na koi chhupa charge, na koi surprise.",
  steps: [
    {
      icon: "clipboard-list",
      title: "Test chuniye",
      text: "Neeche ki list se test ya package chuniye, ya form bhar dijiye. Doctor ka parcha hai to uska photo saath rakhiye — wahi panel liya jaayega.",
    },
    {
      icon: "phone-call",
      title: "Hum call karenge",
      text: "Lagbhag 30 minute me call aata hai — slot aur address confirm karne ke liye. Fasting wale test ke liye subah ka slot suggest kiya jaata hai.",
    },
    {
      icon: "home",
      title: "Ghar par collection",
      text: "Trained phlebotomist ID card ke saath aata hai, aapke saamne sample leta hai. Poori visit lagbhag 10 minute. Payment wahin — cash ya UPI.",
    },
    {
      icon: "file-check",
      title: "Report 24 ghante me",
      text: "PDF report WhatsApp aur email dono par aati hai, taaki aap turant doctor ko dikha sakein. Kuch special test 48–72 ghante lete hain.",
    },
  ],
};

/* ── Why us ───────────────────────────────────────────────────────────────
   Read this block twice before editing it. Every card is a promise we keep,
   written as a checkable fact. The last card is deliberately about what we do
   NOT claim — a home page that only makes claims reads like every other one,
   and being explicit about the limits is what makes the rest believable. */
export const HOME_WHY = {
  heading: "Log MedicoBharat Par Kyun Bharosa Karte Hain",
  intro:
    "Hum wahi likhte hain jo sach me karte hain — aur jo nahi karte, wo bhi saaf likha hai.",
  points: [
    {
      icon: "wallet",
      title: "Collection ka koi charge nahi",
      text: "Card par jo price likha hai, sirf wahi dena hai. Na visiting charge, na convenience fee, na koi hidden amount — na 1 test par, na 10 par.",
    },
    {
      icon: "badge-check",
      title: "Phlebotomist ID card ke saath",
      text: "Jo staff aata hai uske paas ID card hota hai. Sample dene se pehle use dekh lena aapka haq hai — aur hum ye kehte hain, chhupate nahi.",
    },
    {
      icon: "sunrise",
      title: "Subah 6 baje se slot",
      text: "Fasting wale test — sugar, lipid, zyadatar full body package — 10 se 12 ghante khaali pet maangte hain. Jaldi slot ka matlab hai jaldi naashta.",
    },
    {
      icon: "message-circle",
      title: "Report WhatsApp par, PDF me",
      text: "Report lene dobara jaana nahi padta. PDF WhatsApp aur email dono par aati hai — jitni baar chahe kholiye, doctor ko forward kar dijiye.",
    },
    {
      icon: "languages",
      title: "Baat Hindi me hoti hai",
      text: "Booking se le kar report samjhane tak — sab Hindi ya Hinglish me. Kaun sa test kab karana hai, ye poochhna kabhi awkward nahi hona chahiye.",
    },
    {
      icon: "shield-alert",
      title: "Jo claim nahi karte",
      text: "Hum NABL accredited hone ka daawa nahi karte, na 24x7 khule rehne ka. Slot 6 AM se raat tak hain, aur jo nahi kar sakte wo pehle hi bata dete hain.",
    },
  ],
};

/* ── Cities ───────────────────────────────────────────────────────────────
   The heading and intro only — the cards themselves are built from the live
   city list, so a new city appears here the day it is published and an
   unpublished one disappears instead of leaving a 404 on the home page. */
export const HOME_CITIES = {
  heading: "Hum Kin Sheher Me Sample Collect Karte Hain",
  intro:
    "Har sheher ka apna page hai — usi sheher ke rate, wahi ke ilaake aur wahi ka booking form. Apna sheher kholiye.",
};

/* ── Guides ───────────────────────────────────────────────────────────────
   The rail that links the articles. Same reasoning: the list is built from
   src/data/blogs, never typed here. */
export const HOME_GUIDES = {
  heading: "Test Chunne Aur Report Padhne Ki Guide",
  intro:
    "Kaun sa test kab karayein, fasting ke niyam, aur report ke numbers ka matlab — bina jargon ke, Hindi me likha hua.",
};

/* ── FAQs ─────────────────────────────────────────────────────────────────
   Brand-level and process-level questions ONLY. The "kya aap <sheher> me
   aate hain" and "<sheher> me kitna kharcha" questions belong to the city
   pages and are already answered there — repeating them here would put the
   same Q&A on four URLs, which is how a site ends up competing with itself.

   Every answer opens with the answer. A question whose reply starts with
   background is a question a snippet cannot be lifted from. */
export const HOME_FAQS = [
  {
    q: "MedicoBharat kya hai?",
    a: `MedicoBharat ek lab test service hai jo aapke ghar se blood aur urine sample collect karti hai — Varanasi, Gorakhpur aur Deoria jile me. Aap CBC, thyroid, sugar, vitamin, liver, kidney aur full body checkup jaise test book kar sakte hain. Home sample collection free hai, aur report 24 ghante me WhatsApp aur email par PDF me aa jaati hai. Booking ${LAB_PHONE} par call kar ke bhi ho jaati hai.`,
  },
  {
    q: "Kya ghar par blood test karana sach me free hota hai?",
    a: "Home sample collection free hai — aap sirf test ka wahi price dete hain jo card par likha hai. Na visiting charge, na convenience fee, na koi hidden amount. Payment sample lene ke waqt hota hai, cash ya UPI (PhonePe, Google Pay, Paytm) se.",
  },
  {
    q: "Lab test book karne ke liye doctor ka parcha zaroori hai kya?",
    a: "Zyadatar routine test aur health package bina prescription ke book ho jaate hain — CBC, thyroid profile, sugar, lipid, vitamin D, vitamin B12 aur full body checkup. Kuch specialised test niyam ke hisaab se parcha maangte hain. Doctor ne kuch likha hai to uska photo booking ke waqt saath rakhiye, taaki bilkul wahi panel liya jaaye jo unhone likha tha.",
  },
  {
    q: "Kaun se test me fasting (khaali pet) zaroori hai?",
    a: "Fasting Blood Sugar, Lipid Profile, insulin aur zyadatar Full Body Checkup package me 10 se 12 ghante ki fasting chahiye; saada paani peena allowed hai aur zaroori bhi. CBC, Thyroid Profile, HbA1c, Vitamin D, Vitamin B12 aur Dengue test me koi fasting nahi chahiye. Isi wajah se home visit slot subah 6 baje se shuru hote hain — sample dijiye aur turant naashta kar lijiye.",
  },
  {
    q: "Report kitni der me milti hai aur kahan aati hai?",
    a: "Zyadatar report 24 ghante ke andar taiyaar ho jaati hai aur WhatsApp aur email dono par PDF ke roop me bhej di jaati hai — report lene dobara jaane ki zaroorat nahi. Culture jaise kuch test 48 se 72 ghante lete hain, kyunki unme pehle organism ko ugana padta hai. Sahi time hum booking ke waqt hi bata dete hain.",
  },
  {
    q: "Ghar par sample lene kaun aata hai?",
    a: "Ek trained phlebotomist aata hai jiske paas ID card hota hai — sample dene se pehle aap wo dekh sakte hain, aur dekhna chahiye. Sample aapke saamne liya jaata hai aur poori visit lagbhag 10 minute ki hoti hai. Ghar me bujurg hain, koi bistar par hai, diabetic hain jinki nas patli ho gayi hai, ya operation ke baad recovery chal rahi hai — ye booking ke waqt bata dijiye.",
  },
  {
    q: "Ek hi visit me ghar ke kai logon ka test ho sakta hai?",
    a: "Haan. Sabki booking ek hi slot me kar dijiye — phlebotomist ek hi visit me sabka sample le lega, aur har vyakti ki report alag aayegi. Ye sabse aasan tareeka hai jab poore parivaar ka saal-bhar ka checkup ek saath karana ho.",
  },
  {
    q: "Kya main apne sheher se bahar ke liye bhi book kar sakta hoon?",
    a: `Booking form me apna sheher chuniye; jo ilaake hum cover karte hain wo har sheher ke page par likhe hain. Aapka pata list me naam se nahi hai to ${LAB_PHONE} par ek call kar lijiye — cover hone par usi waqt slot book ho jaayega, aur nahi hone par hum saaf bata denge. Hum wahi jagah promise karte hain jahan sach me pahunch sakte hain.`,
  },
];

/* ── Long-form SEO copy ───────────────────────────────────────────────────
   Shape: { id, h, p: [paragraph, ...] } — `id` doubles as the anchor target
   and feeds LabContent's "On this page" rail. The FIRST section is the lead:
   its heading becomes the block's own h2 and it is left out of the rail.

   Read the "do not repeat the city pages" note at the top of this file before
   adding a section. The test is simple: if this paragraph would be equally
   true and equally placed on /lab-test/varanasi, it belongs there, not here. */
export const HOME_CONTENT = [
  {
    id: "lab-test-at-home",
    h: "Lab Test Ghar Baithe — MedicoBharat Kaise Kaam Karta Hai",
    p: [
      "Routine pathology ka lagbhag poora hissa — blood count, sugar, thyroid, liver, kidney, lipid, vitamin aur urine ke test — ek sample par hota hai. Aur wo sample lab me hi dena zaroori nahi hai. MedicoBharat wahi sample aapke ghar se leta hai, usi din lab tak pahunchata hai, aur report seedhe aapke phone par bhejta hai.",
      "Iska sabse bada fayda kisi discount me nahi hai, teen chakkar bachne me hai. Pehla — subah khaali pet lab tak safar karna, jo fasting wale test me sabse mushkil hissa hota hai. Doosra — counter par line. Teesra — report lene ke liye dobara jaana. Bujurg, chhote bachche, pregnancy, operation ke baad recovery aur wo har vyakti jiska din kaam se bandha hai — in sabke liye yahi teen chakkar asli rukawat hote hain.",
      "Kaam ka tarika seedha hai: aap test chunte hain, hum lagbhag 30 minute me call kar ke slot aur pata confirm karte hain, trained phlebotomist ID card ke saath ghar aata hai, aur report 24 ghante ke andar WhatsApp aur email par PDF me pahunch jaati hai. Home sample collection free hai — aap sirf test ka wahi price dete hain jo card par likha hai.",
      [
        "Aap kis sheher me hain uske hisaab se page alag hai, kyunki rate, ilaake aur booking form wahi ke hone chahiye. ",
        { text: "Varanasi me lab test", href: "/lab-test/varanasi" },
        ", ",
        { text: "Gorakhpur me lab test", href: "/lab-test/gorakhpur" },
        " aur ",
        { text: "Deoria me lab test", href: "/lab-test/deoria" },
        " — teenon ka apna poora page hai.",
      ],
    ],
  },

  {
    id: "kaun-sa-test-kab",
    h: "Kaun Sa Lab Test Kab Karana Chahiye — Shikayat Ke Hisaab Se",
    p: [
      "Sabse aam galti test na karana nahi hai — galat test karana hai. Neeche wahi shikayatein hain jinke liye log sabse zyada aate hain, aur unme sabse pehle kya karana chahiye.",
      "Lagatar thakan, kamzori ya chakkar: pehla test Complete Blood Count (CBC) hai, jo haemoglobin, RBC, WBC aur platelet count batata hai. Haemoglobin kam nikle to sirf iron ki goli shuru kar dena adhoora ilaaj hai — aage ferritin, vitamin B12 aur zaroorat par thyroid dekhna chahiye, kyunki teenon ki kami ek jaisi thakan deti hai aur teenon ka ilaaj alag hai.",
      "Bina wajah wazan badhna ya ghatna, baal jhadna, periods ka irregular hona, thand zyada lagna: Thyroid Profile (TSH ke saath T3 aur T4). Hypothyroidism North India me bahut common hai, diagnose hone ke baad aasani se control ho jaata hai, aur test karaye bina kabhi pata nahi chalta. Jo pehle se thyroxine le rahe hain unhe dose badalne ke 6 se 8 hafte baad TSH dohrana chahiye.",
      "Zyada pyaas, raat me baar-baar peshab, ghaav der se bharna, achanak wazan girna: Fasting Blood Sugar aur HbA1c. HbA1c pichhle 2 se 3 mahine ka average sugar batata hai aur ismein fasting nahi chahiye — jinka khaane ka time fix nahi rehta unke liye yahi sabse bharosemand test hai.",
      "Bukhar: yahan timing hi sab kuch hai. Dengue NS1 antigen sirf bukhar ke pehle 1 se 5 din me bharosemand hai; paanchve din ke baad Dengue IgM karana padta hai. Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye, warna report lagbhag bekaar hoti hai. Thand aur kanpkanpi wale bukhar me malaria antigen jodiye. Kisi bhi bukhar ke panel ke saath CBC zaroor karayein — girta platelet count wahi cheez hai jo doctor roz dekhta hai.",
      "Aankhon ka peelapan, gehra peshab, bhookh khatam hona: Liver Function Test poore panel ke saath, aur Hepatitis A IgM tatha Hepatitis E IgM. Pregnancy me jaundice ho to intezaar bilkul mat kijiye — Hepatitis E garbhawastha me kahin zyada khatarnak hota hai.",
      [
        "Har shikayat ka poora breakdown, mausam ka asar aur report ke numbers ka matlab hamari lambi guide me likha hai: ",
        { text: "kaun sa test kab karayein — poori guide", href: "/blogs/lab-test/varanasi" },
        ".",
      ],
    ],
  },

  {
    id: "umar-ke-hisaab-se-checkup",
    h: "Umar Ke Hisaab Se Health Checkup — Kis Umar Me Kya",
    p: [
      "Full body checkup har umar me ek jaisa nahi hona chahiye. Package ka price dekh kar chunna sabse aam galti hai; sahi tarika apna risk dekh kar chunna hai.",
      "20 se 30 saal: saal me ek baar ek baseline kaafi hai — CBC, fasting sugar, liver aur kidney function, aur thyroid. Is umar me asli kaam number nikalna nahi, aage ke liye ek reference banana hai. Shudh shakahari khana chalta ho to Vitamin B12 zaroor jodiye; is aabadi me uski kami itni common hai ki use panel me jagah milni hi chahiye.",
      "30 se 45 saal: yahin se lipid profile aur HbA1c zaroori ho jaate hain, khaas kar agar kamar ke aas-paas wazan badha hai, din bhar baithne wala kaam hai, ya ghar me kisi ko diabetes ya heart disease hai. Dhoop kam milti hai to Vitamin D bhi. Yahi wo umar hai jahan advanced package — jismein thyroid, vitamins aur iron studies jud jaate hain — sach me kaam ka hota hai.",
      "45 se 60 saal: saal me ek baar poora panel, aur ismein kidney ke saath urine microalbumin zaroor. Microalbumin sabse pehla warning hai ki sugar ya BP kidney par asar daal raha hai, aur yahi test log sabse zyada chhodte hain. Mahilaon me is umar me haemoglobin aur thyroid par nazar rakhni chahiye.",
      "60 ke baad: har cheez pehle se zyada dheere badalti hai, isliye monitoring ki value badh jaati hai. CBC, sugar aur HbA1c, lipid, liver, kidney, thyroid, Vitamin D aur B12 — saal me ek baar. Jo pehle se diabetic hain unhe har teen mahine me HbA1c karana chahiye, na ki saal me ek baar.",
      "Pregnancy alag schedule maangti hai: pehli trimester me CBC, blood group aur Rh typing, sugar ya OGTT, TSH, urine routine, aur HIV, HBsAg tatha VDRL. Rh-negative maa ke liye blood group report kabhi late nahi honi chahiye. Haemoglobin 11 g/dL se neeche ho to sirf iron ki goli kaafi nahi — ferritin, B12 aur folate batate hain ki wajah kya hai.",
      [
        "Package me sach me kya-kya hona chahiye aur \"80+ parameters\" ka matlab kya hota hai, ye alag se likha hai: ",
        { text: "full body checkup — kya karayein aur kya na karayein", href: "/blogs/full-body-checkup/varanasi" },
        ".",
      ],
    ],
  },

  {
    id: "fasting-aur-taiyari",
    h: "Sample Dene Se Pehle Ki Taiyari",
    p: [
      "Fasting wale test — fasting blood sugar, lipid profile, insulin aur zyadatar full body package — me 10 se 12 ghante bina khaaye rehna hota hai. Saada paani peena sirf allowed nahi, zaroori hai: hydrated nas se sample aasani se nikalta hai, aur paani ki kami haemoglobin, urea aur creatinine ko jhoothe taur par badha deti hai. Raat ka khaana 9 baje tak khatam kijiye aur subah ka slot lijiye. 14 ghante se zyada faaka karna ulta nuksan karta hai.",
      "Lipid profile ya liver function test se kam se kam 24 ghante pehle sharaab bilkul nahi — ek shaam ki peene se hi triglycerides aur liver enzymes kaafi badh jaate hain. Kidney function ya CPK karana ho to ek din pehle heavy gym avoid kijiye, kyunki tez exercise se creatinine aur muscle enzymes badh jaate hain.",
      "Dawaiyon ka aam niyam ye hai ki apni regular tablet usi samay lijiye jab tak doctor mana na kare — do exception ke saath. Thyroid ki goli blood nikalne ke baad leni chahiye, aur biotin ya multivitamin supplement kisi bhi hormone test se 48 se 72 ghante pehle band kar dena chahiye, kyunki biotin assay me interfere karta hai. Phlebotomist ko bata dijiye ki aap kya le rahe hain.",
      "Aur ek chhoti si cheez jo sabse zyada visit late karati hai: adhoora pata. Ghar ka pata landmark ke saath likhiye aur mobile number chalu rakhiye. Ghar me ek se zyada log test kara rahe hain to sabki booking ek hi slot me kar dijiye.",
    ],
  },

  {
    id: "price-aur-payment",
    h: "Lab Test Ka Price Aur Payment",
    p: [
      "Har card par jo price likha hai, wahi aapko dena hai. Home sample collection uske upar free hai — na visiting charge, na convenience fee, na koi hidden amount. Payment sample lene ke waqt hota hai: cash ya UPI (PhonePe, Google Pay, Paytm).",
      "Aam test ke price: Blood Sugar ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1,000, Vitamin B12 ₹1,200 aur Dengue (NS1, IgG, IgM) ₹1,200.",
      "Bachat package me sabse zyada hai: Basic Full Body Checkup ₹999 me 45 parameter, Advanced Full Body ₹1,999 me 72 parameter, aur Senior Citizen Pack ₹2,999 me 88 parameter. Wahi test alag-alag karane par kharcha kai guna ho jaata hai — yahi wajah hai ki saal ka routine checkup package me karana samajhdari hai, aur ek shikayat ki jaanch single test me.",
      `Kuch test us waqt ki zaroorat par tay hote hain — jaise Fever Panel — aur unke card par "Call for price" likha rehta hai. ${LAB_PHONE} par pooch lijiye; price sample dene se pehle bata diya jaata hai, baad me nahi.`,
    ],
  },

  {
    id: "report-kaise-padhein",
    h: "Report Aa Gayi — Ab Ise Kaise Padhein",
    p: [
      "Report ke saath chhapi reference range hi padhiye, internet ke chart se mat milaiye. Range lab ke method ke hisaab se badalti hai, aur umar tatha ling ke hisaab se bhi. High ya low ka flag apne aap me diagnosis nahi hai — wo doctor se milne ka ishaara hai.",
      "Thoda sa range se bahar hona bahut common hai aur aksar harmless: haal me hui sardi ke baad halka ESR badha hona, ya Gilbert's syndrome me thoda sa bilirubin badha rehna, jo poori tarah benign hai. Isi tarah ek lab me TSH 4.5 aur doosri me 4.1 aane ka matlab ye nahi ki thyroid badal gaya — alag analyser ke reference range alag hote hain.",
      "Isi wajah se ek niyam yaad rakhiye: jo cheez aap mahino tak track kar rahe hain — HbA1c, TSH, creatinine, ferritin — uske liye har baar wahi lab chuniye. Consistency utni hi zaroori hai jitna khud ka number.",
      "Kuch result appointment ka intezaar nahi maangte, usi din doctor chahiye: dengue me tezi se girta platelet count, bahut zyada blood sugar ke saath ulti ya susti, khatarnak had tak kam haemoglobin, ya bahut badha creatinine ke saath peshab ka kam hona. Tabiyat kharab lag rahi ho to kisi phone call ka intezaar mat kijiye.",
    ],
  },

  {
    id: "sheher-aur-coverage",
    h: "Hum Kahan-Kahan Sample Collect Karte Hain",
    p: [
      [
        "Abhi home sample collection teen jilon me hai: ",
        { text: "Varanasi", href: "/lab-test/varanasi" },
        " — Sarnath, Ramnagar, Bhelupur, Lanka, Sigra aur Cantt tak; ",
        { text: "Gorakhpur", href: "/lab-test/gorakhpur" },
        " — Golghar, Civil Lines, Betiahata, Mohaddipur, Taramandal, Rustampur, Medical College Road aur Kunraghat tak; aur ",
        { text: "Deoria", href: "/lab-test/deoria" },
        " — Deoria Sadar, Rudrapur, Barhaj, Salempur, Bhatpar Rani, Gauri Bazar, Baitalpur, Lar aur Bhatni tak.",
      ],
      "Har sheher ka apna page hai, aur wo jaan-boojh kar hai. Us page par usi sheher ke ilaake, usi sheher ka booking form aur usi sheher ke liye likhi gayi jaankari milti hai — ek hi page par teen jilon ka mix ho jaata to na booking form kaam ka rehta, na jaankari.",
      [
        "Aapka pata upar ki list me naam se nahi hai lekin aas-paas hi hai? ",
        { text: "Contact page", href: "/contact" },
        " par diye number par ek call kar lijiye. Cover hone par usi waqt slot book ho jaayega, aur nahi hone par hum saaf bata denge — kyunki jis jagah pahunch nahi sakte, uska vaada karna sabse mehnga jhooth hai.",
      ],
    ],
  },

  {
    id: "bharosa-kaise-banta-hai",
    h: "Ek Bharosemand Lab Kaise Chunein",
    p: [
      "Achhe lab ki pehchaan uske quality control se hoti hai — machines ki niyamit calibration, sahi tarike se store kiye gaye reagent, trained staff, aur consistent turnaround time. Ye sab aap seedha nahi dekh sakte, lekin do cheezein pooch zaroor sakte hain: lab kitne saal se chal raha hai, aur report par test ka method (jaise CLIA ya ECLIA) likha jaata hai ya nahi.",
      "Collection ke waqt khud dhyan dijiye. Nayi needle aapke saamne khule, har test ke liye sahi rang ki vacutainer ho, tube sahi level tak bhare, aur anticoagulant wali tube halke se ulti-seedhi ki jaaye. Kam bhara ya clotted sample hi wo sabse aam wajah hai jiske liye lab dobara sample maangti hai — aur galat tarike se liya gaya sample haemolysis kar deta hai, jisse potassium jhootha badh jaata hai aur bewajah panic hota hai.",
      [
        "Hamari taraf se jo pakka hai wo yahi hai: collection free, phlebotomist ke paas ID card, slot subah 6 baje se, report 24 ghante me, aur payment sample lete waqt. Isse aage ka koi daawa hum nahi karte — na accreditation ka, na 24x7 khule rehne ka. ",
        { text: "MedicoBharat ke baare me", href: "/about" },
        " page par yahi baat detail me likhi hai.",
      ],
    ],
  },
];

/* ── CTA band + closing call strip ────────────────────────────────────────
   Same shapes the lab city pages use (defaultCta / defaultCallBanner), so the
   existing LabCta and LabCallBanner components render them unchanged. */
export const HOME_CTA = {
  headingLead: "Lab test book kijiye —",
  headingAccent: "sample ghar se liya jaayega",
  proof: ["Trained phlebotomist", "Free home collection", "Reports in 24 hrs"],
};

export const HOME_CALL_BANNER = {
  heading: "Ghar Baithe Apna Health Checkup Book Kijiye",
  buttonText: "Book Now — Call Us",
};

/* ── In-body internal links ───────────────────────────────────────────────
   Built from the live lists, not typed — a city that is unpublished or a guide
   that is removed disappears from this block instead of leaving a 404 on the
   home page, which is the single worst place on the site to have one.

   This is the home page's biggest link-equity hand-off: it is the page every
   other page points at, so what it points at in return is what gets crawled
   first. The static links at the end are all verified routes. */
export const homeRelatedLinks = (labCities = [], guides = []) => {
  const cityLinks = labCities.map((city) => ({
    href: `/lab-test/${city.slug}`,
    label: `${city.name} me lab test`,
    sub: "Rate list, ilaake aur booking form",
  }));

  const guideLinks = guides.map((post) => ({
    href: post.href,
    label: post.title,
    sub: `${post.cityName} · ${post.readingMinutes} min read`,
  }));

  const groups = [
    cityLinks.length && {
      title: "Sheher Ke Hisaab Se Lab Test",
      links: cityLinks,
    },
    guideLinks.length && {
      title: "Padhne Ke Liye",
      links: guideLinks,
    },
    {
      title: "MedicoBharat",
      links: [
        { href: "/about", label: "Hamare baare me — hum kya karte hain" },
        { href: "/contact", label: "Contact — number aur booking help" },
        { href: "/privacy", label: "Privacy policy" },
        { href: "/terms", label: "Terms & conditions" },
      ],
    },
  ].filter(Boolean);

  return {
    heading: "Aage Kahan Jaayein",
    intro:
      "Apne sheher ka page kholiye booking ke liye, ya guide padhiye ye tay karne ke liye ki kaun sa test karana chahiye.",
    groups,
  };
};
