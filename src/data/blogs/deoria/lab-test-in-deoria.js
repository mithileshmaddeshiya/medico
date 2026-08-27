/**
 * /blogs/lab-test/deoria — "Deoria Me Lab Test — Kaun Sa Package Aur Kab"
 *
 * ── THE ONE THING THAT KEEPS THIS OFF /lab-test/deoria's TOES ────────────
 * Deoria now has two URLs about lab tests, and they only stay out of each
 * other's way because each answers a different question:
 *
 *   /lab-test/deoria        → "kahan se karaun" — booking form, price, menu
 *   /blogs/lab-test/deoria  → "kaun sa karaun"  — package chunna, din, report
 *
 * That split is not cosmetic. The service page is the one that has to rank for
 * "lab test in Deoria" and "blood test home collection Deoria" — it carries the
 * DiagnosticLab schema, the areaServed, the price list and the form. If this
 * article chased the same intent it would split the district's traffic across
 * two of our own URLs and neither would win. So:
 *
 *   • THIS ARTICLE STATES NO PRICE. Not one number. Every sentence that would
 *     have carried a rate links to #lab-test-price-deoria instead, so the rate
 *     lives in exactly one file (src/data/lab/content/deoria.js) and cannot
 *     drift between two pages.
 *   • It carries no booking form and no phone number of its own — "book kaise
 *     karein" is a link out, every time.
 *   • Its headings are decisions ("kaun sa package", "kis din", "kya dekhein"),
 *     not services ("home collection", "our tests").
 *
 * ── WHY DEORIA GETS ITS OWN GUIDE AT ALL ─────────────────────────────────
 * Until this shipped, /lab-test/deoria's "Test Chunne Me Madad" block sent
 * every reader to /blogs/lab-test/varanasi. That guide is good, but a Deoria
 * reader was being handed a Varanasi URL, and the four things that actually
 * differ about testing in this district were in neither page's guide lane:
 *
 *   1. Gorakhpur. Deoria's referral traffic goes to BRD and the private
 *      hospitals there, and the single most useful thing a patient can do is
 *      walk into that OPD with the report already in hand.
 *   2. The flood-and-fever belt. Rapti and Ghaghara backwater means the
 *      post-monsoon window here is typhoid, dengue and water-borne illness,
 *      and the day a fever test is taken decides whether it is worth taking.
 *   3. Migration. A very large number of households here have someone working
 *      in the Gulf or in a metro, home for a few weeks, and that visit is when
 *      the whole family's testing gets done — in one slot.
 *   4. Anaemia and B12 in a largely vegetarian district.
 *
 * ── CLAIMS ───────────────────────────────────────────────────────────────
 * Operationally, only the five the business confirms: free home collection, a
 * trained phlebotomist with an ID card, slots from 6 AM, reports in 24 hours,
 * cash/UPI on collection. NOT claimed anywhere here: NABL accreditation,
 * pathologist verification, cold-chain transport, barcode tracking, sealed
 * single-use needles. Those were removed from this project once already — see
 * the warning above defaultFaqs in src/data/lab/defaults.js — and a blog is not
 * a loophole for putting them back.
 *
 * Clinically, only the uncontroversial: dengue NS1's 1–5 day window, Widal
 * needing 5–7 days of fever, HbA1c quarterly for a diabetic, urine
 * microalbumin as the earliest diabetic-kidney signal, B12 deficiency being
 * common on a vegetarian diet, biotin stopped before a hormone assay. Nothing
 * here diagnoses, and the AES paragraph sends the reader to a hospital rather
 * than to a booking form — that is deliberate and must not be softened.
 *
 * ── INTERNAL LINKS ───────────────────────────────────────────────────────
 * The point of the piece. Every href is a constant below and every one renders
 * today: /lab-test/deoria and eight of its section anchors (ids are in
 * src/data/lab/content/deoria.js — rename one there and the anchors here break
 * silently), /lab-test/salempur, /lab-test/gorakhpur, /lab-test/varanasi, the
 * two Varanasi guides, / and /contact.
 *
 * ── IMAGES: DELIBERATELY NONE ────────────────────────────────────────────
 * No hero, no in-body photographs. /public has no Deoria photography, and the
 * rule that the sibling articles state — `src` must name a file that really
 * exists in /public — is not one to bend. (It has already been broken once:
 * lab-test-in-varanasi.js points its hero at /navheroimage/labtestimg.webp,
 * which is not in /public.) Nothing breaks by leaving them out: `hero` is
 * optional, and og:image resolves to the generated card at
 * /blogs/lab-test/deoria/og, which is drawn from the title and needs no file.
 */
import {
  BLOG_AUTHOR,
  BLOG_PUBLISHER,
  INDEXABLE,
  canonicalFor,
} from "../shared";

/* Link targets as constants — a route rename is one line here instead of a hunt
   through the prose, and a typo surfaces as `undefined` in the href rather than
   as a silent 404 in production. */
const LAB_DEORIA = "/lab-test/deoria";
const LAB_DEORIA_LAB = "/lab-test/deoria#pathology-lab-diagnostic-centre-deoria";
const LAB_DEORIA_HOME = "/lab-test/deoria#home-sample-collection-deoria";
const LAB_DEORIA_GORAKHPUR = "/lab-test/deoria#gorakhpur-travel-deoria";
const LAB_DEORIA_FEVER = "/lab-test/deoria#fever-season-deoria";
const LAB_DEORIA_FLOOD = "/lab-test/deoria#flood-water-diseases-deoria";
const LAB_DEORIA_ANAEMIA = "/lab-test/deoria#anaemia-women-children-deoria";
const LAB_DEORIA_MIGRANT = "/lab-test/deoria#migrant-workers-checkup-deoria";
const LAB_DEORIA_DIABETES = "/lab-test/deoria#diabetes-thyroid-screening-deoria";
const LAB_DEORIA_FULLBODY = "/lab-test/deoria#full-body-checkup-deoria";
const LAB_DEORIA_PRICE = "/lab-test/deoria#lab-test-price-deoria";
const LAB_DEORIA_PREPARE = "/lab-test/deoria#prepare-for-test-deoria";
const LAB_DEORIA_REPORTS = "/lab-test/deoria#reports-deoria";
const LAB_DEORIA_BOOK = "/lab-test/deoria#how-to-book-deoria";

const LAB_SALEMPUR = "/lab-test/salempur";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_VARANASI = "/lab-test/varanasi";

const BLOG_LAB_VARANASI = "/blogs/lab-test/varanasi";
const BLOG_LAB_VARANASI_REPORT = "/blogs/lab-test/varanasi#report-kaise-padhein";
const BLOG_FULLBODY_VARANASI = "/blogs/full-body-checkup/varanasi";

const HOME_RATE_LIST = "/";
const CONTACT = "/contact";

export const labTestDeoria = {
  category: "lab-test",
  city: "deoria",

  /* 41 characters. The root layout appends " | MedicoBharat" (template in
     src/app/layout.js), so Google renders 56 — inside the ~60 it will show.
     "Deoria Me Lab Test" leads, because that is the query; the half that
     survives truncation is still the half that matters. */
  title: "Deoria Me Lab Test — Kaun Sa Package Aur Kab",

  /* ~155 characters, so it renders whole on desktop and on a phone. Hinglish,
     because the page and the searcher both are, with the English terms that
     have to match left intact: lab test, full body checkup, blood test. */
  description:
    "Deoria me kaun sa lab test aur full body checkup package karayein, bukhar me kis din test ho, aur report me kya dekhein — bina jargon ke poori guide.",

  /* Ordered strongest first, and this array is the checklist the headings,
     tables and FAQs below were written against — every term here appears in
     the visible copy. Note what is NOT here: "lab test in Deoria price" and
     "blood test home collection Deoria book" belong to the service page, which
     is the page that can actually answer them. */
  keywords: [
    "Deoria lab test",
    "Lab Test in Deoria",
    "Blood Test in Deoria",
    "Full Body Checkup in Deoria",
    "Best Pathology Lab in Deoria",
    "Pathology Lab in Deoria",
    "Diagnostic Centre in Deoria",
    // Both spellings kept on purpose: "centre" and "center" are two different
    // strings a person types, and only one of them is in the service page's
    // keyword list. Prose uses "Centre" throughout, like the rest of the site.
    "Diagnostic Center in Deoria",
    "Blood Test Home Collection Deoria",
    "Health Checkup Package in Deoria",
    "Deoria me kaun sa test karayein",
    "Dengue Test in Deoria",
    "Typhoid Test in Deoria",
    "Thyroid Test in Deoria",
    "Sugar Test in Deoria",
    "Deoria Rudrapur Barhaj lab test",
  ],

  canonical: canonicalFor("lab-test", "deoria"),
  robots: INDEXABLE,
  author: BLOG_AUTHOR,
  publisher: BLOG_PUBLISHER,

  publishedAt: "2026-08-27",
  updatedAt: "2026-08-27",

  /* Stated rather than computed: a number that changes every time a sentence is
     edited is a number nobody maintains. Update it when the article grows a
     section. */
  readingMinutes: 9,

  /** The skimmer's version of the whole article. */
  takeaways: [
    "Package shikayat se chuniye, parameter ki ginti se nahi — 80 parameter wala package agar thyroid chhod deta hai to wo 45 parameter wale se kamzor hai.",
    "Bukhar me din ginna sabse zaroori hai: dengue NS1 sirf pehle 5 din, Widal (typhoid) 5-7 din ke baad. Galat din ka test negative aata hai aur dobara karana padta hai.",
    "Gorakhpur OPD dikhane ja rahe hain to report ek din pehle karwa lijiye — parcha le kar wapas aana ek poora din aur ek poora kiraya bacha leta hai.",
    "Bachche ko tez bukhar ke saath jhatke, behoshi ya gardan ki akdan ho — test book mat kijiye, seedhe hospital jaaiye.",
  ],

  sections: [
    {
      id: "deoria-me-lab-test-guide",
      heading: "Deoria Me Lab Test: Sawaal \"Kahan\" Ka Nahi, \"Kaun Sa\" Ka Hai",
      blocks: [
        "Deoria sheher me collection centre ki kami nahi hai. Civil Lines, Kacheri Road, Malviya Road aur station ke aas-paas kai jagah sample liya jaata hai, aur Rudrapur, Barhaj, Bhatpar Rani jaise kasbon me bhi centre khul chuke hain. Isliye asli dikkat \"test kahan karaun\" nahi hai. Asli dikkat teen hain: parche par jo likha hai uske alawa kya karana chahiye, wo test kis din karana chahiye, aur jo report haath me aayi hai usme ghabrane wali baat hai bhi ya nahi.",
        "Yahi teen sawaal is guide me hain — Deoria jile ke hisaab se. Kaun sa checkup package kis ke liye bana hai, bukhar me kis din kaun sa test matlab rakhta hai, Gorakhpur dikhane jaane se pehle kya taiyaar rakhna chahiye, aur report ke numbers me kya dekhna chahiye.",
        [
          "Booking, poori price list, test menu aur aapke ilaake me collection ka time — wo sab service page par hai: ",
          { text: "Deoria me lab test aur free home sample collection", href: LAB_DEORIA },
          ". Is guide me ek bhi rate nahi likha hai, jaan-boojh kar — rate ek hi jagah rahega to purana kabhi nahi hoga.",
        ],
      ],
    },

    {
      id: "popular-checkup-package-deoria",
      heading: "Deoria Me Sabse Zyada Karaye Jaane Wale Test Aur Package",
      lead: "Kis package me kya aata hai, aur wo kis ke liye bana hai.",
      blocks: [
        "Deoria me log jo test sabse zyada karate hain wo char group me aa jaate hain — routine full body, sugar-thyroid, bukhar ka panel, aur kamzori-thakan wala. Neeche wahi hai, is hisaab se ki har ek me kya hota hai aur kise karana chahiye.",
        {
          table: {
            caption: "Deoria me popular health checkup package aur test",
            head: ["Package / Test", "Ismein kya aata hai", "Kis ke liye"],
            rows: [
              [
                "Full Body Checkup (basic)",
                "CBC, blood sugar, lipid profile, LFT, KFT",
                "Saal me ek baar, 30 saal ke baad har bade ke liye — bina kisi shikayat ke bhi",
              ],
              [
                "Advanced Full Body",
                "Basic ke saath thyroid, HbA1c aur vitamin",
                "40 ke baad, ya ghar me diabetes/thyroid ki history ho to",
              ],
              [
                "Diabetes & Sugar Profile",
                "Fasting sugar, PP sugar, HbA1c",
                "Zyada pyaas, raat me baar-baar peshab, ghaav der se bharna, ya pehle se diabetes",
              ],
              [
                "Thyroid Profile",
                "T3, T4 aur TSH",
                "Wazan badhna-ghatna, baal jhadna, thakan, irregular periods",
              ],
              [
                "Fever Panel",
                "Dengue, typhoid aur malaria ki jaanch, CBC ke saath",
                "Teen din se zyada ka bukhar — barsaat ke baad khaas taur par",
              ],
              [
                "Anaemia ka panel",
                "CBC, phir zaroorat par ferritin aur vitamin B12",
                "Lagatar thakan, chakkar, saans phoolna — auraton aur bachchon me sabse aam",
              ],
              [
                "Senior Citizen package",
                "Heart, haddi aur sugar ki screening ek saath",
                "55 saal ke upar, saal me ek baar",
              ],
            ],
          },
        },
        [
          "In sabka rate, kis package me theek-theek kitne test hain, aur konsa abhi available hai — wo ",
          { text: "Deoria ki price list", href: LAB_DEORIA_PRICE },
          " me hai. Package ka poora menu ",
          { text: "full body checkup wale section", href: LAB_DEORIA_FULLBODY },
          " me khula hua hai.",
        ],
        {
          note: {
            title: "Parameter ki ginti par mat jaaiye",
            text: "\"80+ parameters\" sunne me bada lagta hai, lekin ek CBC akela hi 20 se zyada parameter gin leta hai. Isliye 80 parameter wala package agar thyroid ya HbA1c chhod deta hai, to wo 45 parameter wale se kamzor hai. Ginti nahi, ye dekhiye ki paanch system — khoon, sugar, liver, kidney aur thyroid — cover ho rahe hain ya nahi.",
            tone: "info",
          },
        },
      ],
    },

    {
      id: "kis-umar-me-kaun-sa-checkup",
      heading: "Umar Ke Hisaab Se: Kis Ko Kaun Sa Checkup Chahiye",
      lead: "Bina shikayat ke bhi kya karana chahiye — umar ke hisaab se.",
      blocks: [
        {
          table: {
            caption: "Umar aur haalat ke hisaab se checkup",
            head: ["Kaun", "Kam se kam kya", "Kitne samay me"],
            rows: [
              [
                "18–30 saal",
                "CBC, blood sugar, thyroid — ladkiyon me haemoglobin zaroor",
                "Do saal me ek baar, shikayat ho to turant",
              ],
              [
                "30–45 saal",
                "Basic full body — CBC, sugar, lipid, LFT, KFT",
                "Saal me ek baar",
              ],
              [
                "45 ke upar",
                "Full body ke saath thyroid, HbA1c aur vitamin D/B12",
                "Saal me ek baar",
              ],
              [
                "Diabetes wale",
                "HbA1c; saal me ek baar KFT ke saath urine microalbumin aur lipid",
                "HbA1c har teen mahine",
              ],
              [
                "Garbhvati mahilayein",
                "Jo doctor ne likha hai wahi — CBC, blood group, sugar, thyroid",
                "Doctor ke bataye schedule par",
              ],
              [
                "Bujurg aur bistar par rehne wale",
                "Senior package; ghar par hi sample",
                "Saal me ek baar, ya doctor ke kehne par",
              ],
            ],
          },
        },
        [
          "Ghar me kai log ek saath karana chahte hain to sabki booking ek hi slot me kar dijiye — ek hi visit me sab ka sample ho jaata hai. Kaise, wo ",
          { text: "booking wale section", href: LAB_DEORIA_BOOK },
          " me likha hai.",
        ],
        [
          "Package ke andar ki gehri baat — kis package me kya chhoot jaata hai, kaun sa add-on kis ke liye hai — uspar alag guide hai: ",
          { text: "full body checkup me kya-kya hona chahiye", href: BLOG_FULLBODY_VARANASI },
          ".",
        ],
      ],
    },

    {
      id: "bukhar-me-kis-din-test",
      heading: "Bukhar Aaya Hai — Test Kis Din Karana Chahiye",
      lead: "Deoria me barsaat ke baad ka sabse zaroori hissa: din ginna.",
      blocks: [
        "Deoria jile ka bada hissa Rapti aur Ghaghara ke paani ke daayre me aata hai. Barsaat ke baad yahan bukhar ka mausam sabse lamba chalta hai, aur usi mausam me sabse zyada test bekaar jaate hain — isliye nahi ki lab galat hai, balki isliye ki test galat din par karaya gaya.",
        {
          table: {
            caption: "Bukhar ke din aur sahi test",
            head: ["Bukhar ka din", "Kaun sa test", "Kyun"],
            rows: [
              [
                "Din 1–5",
                "Dengue NS1 antigen + CBC",
                "NS1 sirf shuruaati dino me bharosemand hai",
              ],
              [
                "Din 5 ke baad",
                "Dengue IgM antibody + CBC",
                "Is waqt tak NS1 aksar negative aa jaata hai",
              ],
              [
                "Din 5–7 ke baad",
                "Typhoid (Widal) + CBC",
                "Pehle karane par jhootha negative aata hai",
              ],
              [
                "Thand-kampkampi ke saath bukhar",
                "Malaria ki jaanch + CBC",
                "Paani bharne wale ilaakon me abhi bhi milta hai",
              ],
              [
                "Peeliya jaisa lag raha ho",
                "LFT — bilirubin ke saath",
                "Paani se failne wale hepatitis A/E ka mausam yahi hai",
              ],
            ],
          },
        },
        "Koi bhi bukhar ho, CBC saath me zaroor karayein. Platelet count aur haematocrit wahi do number hain jo doctor roz dekhta hai, aur wahi batate hain ki maamla ghar par sambhal jaayega ya bharti karna padega.",
        {
          note: {
            title: "Ye lab ka nahi, hospital ka maamla hai",
            text: "Gorakhpur–Deoria–Kushinagar belt me barsaat ke baad bachchon me dimaagi bukhar (AES / Japanese Encephalitis) ke maamle aate rahe hain. Bachche ko tez bukhar ke saath jhatke aayein, behoshi ho, gardan akad jaaye, lagatar ulti ho ya wo sust pada rahe — to lab test book mat kijiye. Seedha najdeeki hospital le jaaiye. Ismein ek-ek ghanta maayne rakhta hai, aur home collection ka intezaar khatarnak hai.",
            tone: "warn",
          },
        },
        [
          "Mausam ke hisaab se poora panel aur paani se failne wali bimariyon ka hissa service page par khula hai — ",
          { text: "bukhar ke mausam ka section", href: LAB_DEORIA_FEVER },
          " aur ",
          { text: "baadh ke baad ke test", href: LAB_DEORIA_FLOOD },
          ".",
        ],
      ],
    },

    {
      id: "gorakhpur-jaane-se-pehle",
      heading: "Gorakhpur Dikhane Ja Rahe Hain — Ek Din Pehle Ye Kar Lijiye",
      blocks: [
        "Deoria se specialist dikhane ka matlab aksar Gorakhpur hota hai. Aur wahan ka sabse thakane wala hissa ilaaj nahi, chakkar hai: subah nikliye, OPD me number lagaiye, doctor test likh de, wahin kisi lab me sample dijiye, report ka intezaar kijiye — ya doosre din phir se aaiye.",
        "Iska seedha hal ye hai ki jo test doctor pichhli baar likh chuka hai, ya jo follow-up har baar hota hai, wo Deoria me hi ek din pehle karwa lijiye. Report PDF me phone par aa jaati hai, aur aap OPD me parcha le kar nahi — report le kar ghuste hain. Ek poora din aur ek poora kiraya bach jaata hai.",
        {
          list: [
            "Follow-up wale test jo har visit par dohraye jaate hain — HbA1c, TSH, creatinine, haemoglobin.",
            "Operation se pehle maange jaane wale routine test, agar doctor ne pehle hi list de rakhi hai.",
            "Wo test jinki report me 24 ghante lagte hain — unhe usi din karwana matlab ek aur trip.",
          ],
        },
        [
          "Ek baat dhyaan rahe: follow-up test hamesha ek hi lab me karayein. Alag analyser aur alag method ki reference range thodi alag hoti hai, isliye ek lab me TSH 4.5 aur doosri me 4.1 aane ka matlab ye nahi ki thyroid badal gaya. Iska poora hissa ",
          { text: "Gorakhpur wale section", href: LAB_DEORIA_GORAKHPUR },
          " me hai. Aap Gorakhpur me hi rehte ya ruke hain to ",
          { text: "wahan ka apna page", href: LAB_GORAKHPUR },
          " hai.",
        ],
      ],
    },

    {
      id: "sugar-thyroid-aur-kamzori",
      heading: "Sugar, Thyroid Aur Kamzori — Deoria Ke Teen Sabse Aam Sawaal",
      blocks: [
        "Bukhar ke alawa, is jile me sabse zyada test inhi teen wajahon se hote hain. Teenon me ek-ek aam galti hai jo test dobara karwa deti hai.",
        {
          table: {
            caption: "Teen aam shikayat, pehla test, aur aam galti",
            head: ["Shikayat", "Pehla test", "Aam galti"],
            rows: [
              [
                "Zyada pyaas, baar-baar peshab, ghaav der se bharna",
                "Fasting sugar + HbA1c",
                "Sirf fasting sugar par bharosa. HbA1c pichhle 2–3 mahine ka average deta hai aur ismein fasting nahi chahiye.",
              ],
              [
                "Wazan, baal, thakan, irregular periods",
                "Thyroid Profile (TSH, T3, T4)",
                "Test se pehle thyroxine ki goli le lena — T4 jhootha zyada dikhta hai. Goli blood nikalne ke BAAD lijiye.",
              ],
              [
                "Lagatar thakan, chakkar, saans phoolna",
                "CBC",
                "Haemoglobin kam aate hi seedhe iron ki goli. Wajah B12 ki kami bhi ho sakti hai — ferritin aur B12 bhi dekhiye.",
              ],
            ],
          },
        },
        [
          "Deoria jaise zyadatar shaakahaari jile me vitamin B12 ki kami aam hai, aur auraton aur teenage ladkiyon me anaemia usse bhi aam. Isi wajah se ",
          { text: "anaemia aur mahilaon ki sehat", href: LAB_DEORIA_ANAEMIA },
          " ka alag section service page par hai. Sugar aur thyroid ki screening ka hissa ",
          { text: "yahan", href: LAB_DEORIA_DIABETES },
          " hai.",
        ],
        "Jinhe diabetes hai unke liye ek chhoti si baat sabse zyada kaam ki hai: saal me ek baar urine microalbumin karwaiye. Yahi test sabse pehle bata deta hai ki diabetes kidney par asar daalna shuru kar chuka hai, aur yahi test log sabse zyada chhodte hain.",
      ],
    },

    {
      id: "videsh-aur-bahar-rehne-wale",
      heading: "Bahar Kaam Karne Wale Ghar Aaye Hain — Ek Slot Me Sab Ho Jaaye",
      blocks: [
        "Deoria ke bahut se gharon me koi na koi Gulf me ya kisi bade sheher me kaam karta hai, aur saal me ek baar kuch hafton ke liye ghar aata hai. Wahi kuch hafte poore ghar ki jaanch ka mauka hote hain — aur aksar nikal jaate hain.",
        {
          list: [
            "Ghar aane ke pehle hafte me hi booking kar lijiye — report aur uske baad doctor dikhane ka waqt bach jaata hai.",
            "Ek hi slot me maa-baap, dada-dadi aur bachche — sabka sample ek visit me ho jaata hai.",
            "Wapas jaane wale ke liye khud ka basic checkup — sugar, thyroid, liver, kidney aur vitamin D/B12. Lambi shift, dhoop se door kaam aur bahar ka khaana in paanchon me dikhta hai.",
          ],
        },
        [
          "Bahar kaam karne walon ke checkup ka hissa service page par ",
          { text: "yahan", href: LAB_DEORIA_MIGRANT },
          " hai. Salempur, Bhatni aur Lar ke aas-paas ke gharon ke liye ",
          { text: "Salempur ka apna page", href: LAB_SALEMPUR },
          " hai, jismein wahan ke ilaake aur booking form hain.",
        ],
        {
          note: {
            title: "Visa ya job wala medical alag cheez hai",
            text: "Videsh jaane ke liye jo \"GAMCA\" ya company ka pre-employment medical hota hai, wo sirf notified centre par hi hota hai aur usmein X-ray jaisi cheezein bhi shaamil hoti hain. Wo hum nahi karte. Ghar se sample lena us medical ka vikalp nahi hai — haan, apni jaankari ke liye pehle se sugar, thyroid ya haemoglobin dekh lena zaroor kaam aata hai.",
            tone: "warn",
          },
        },
      ],
    },

    {
      id: "ghar-se-sample-dene-ka-fayda",
      heading: "Ghar Se Sample Dene Ka Asli Fayda Kya Hai",
      lead: "Chhoot nahi — bache hue chakkar.",
      blocks: [
        "Home collection ka sabse bada fayda kisi discount me nahi hai. Wo teen chakkar bachne me hai, aur wo teenon chakkar hi asli rukawat hote hain.",
        {
          list: [
            "Subah khaali pet lab tak safar — fasting wale test ka sabse mushkil hissa. Ghar par sample dene se ye poora hissa khatm ho jaata hai.",
            "Counter par line — bujurg, chhote bachche, garbhvati mahilaon aur operation ke baad recovery kar rahe logon ke liye ye sabse bhaari hissa hai.",
            "Report lene ke liye dobara jaana — report WhatsApp aur email par PDF me 24 ghante ke andar aa jaati hai, isliye dobara jaana hi nahi padta.",
          ],
        },
        "Kaam ka tarika seedha hai: test chuniye, hum lagbhag 30 minute me call kar ke slot aur pata confirm karte hain, trained phlebotomist ID card ke saath ghar aata hai, aur sample aapke saamne liya jaata hai. Home sample collection free hai — aap sirf test ka wahi price dete hain jo card par likha hai. Payment sample lene ke waqt, cash ya UPI se.",
        [
          "Kaunse kasbe cover hote hain, slot kis waqt se milte hain aur booking me kya-kya poocha jaata hai — wo ",
          { text: "home sample collection wale section", href: LAB_DEORIA_HOME },
          " me hai.",
        ],
      ],
    },

    {
      id: "test-se-pehle-taiyari-deoria",
      heading: "Sample Dene Se Pehle Kya Dhyaan Rakhein",
      blocks: [
        {
          list: [
            "Fasting sirf blood sugar, lipid profile, insulin aur zyadatar full body package me chahiye — 10 se 12 ghante. 14 ghante se zyada faaka karne se result bigadta hai, sudharta nahi.",
            "Fasting me saada paani peete rahiye. Paani ki kami haemoglobin, urea aur creatinine ko jhoothe taur par badha deti hai.",
            "CBC, thyroid, HbA1c, vitamin D, B12, dengue aur urine routine — inmein fasting ki zaroorat nahi.",
            "Thyroid ki goli blood nikalne ke BAAD lijiye, pehle nahi. Baaki regular dawaiyan usi samay par, jab tak doctor mana na kare.",
            "Biotin ya multivitamin supplement kisi bhi hormone test se 48 se 72 ghante pehle band kar dijiye — biotin assay me interfere karta hai.",
            "Sample se ek din pehle bahut zyada mehnat, sharab aur bahut tel-masaale wala khaana chhod dijiye — lipid aur liver ke number is se hilte hain.",
          ],
        },
        [
          "Purani report, chal rahi dawaiyon ki list aur doctor ka parcha saath rakhiye — sample lene wale ko dikha dijiye. Poori taiyaari ki list ",
          { text: "yahan", href: LAB_DEORIA_PREPARE },
          " hai.",
        ],
      ],
    },

    {
      id: "report-me-kya-dekhein-deoria",
      heading: "Report Aa Gayi — Ab Ismein Kya Dekhein",
      blocks: [
        "Report par \"High\" ya \"Low\" ka flag diagnosis nahi hai, doctor se milne ka ishaara hai. Thoda sa range se bahar hona bahut aam hai aur aksar harmless — jaise sardi ke baad halka ESR badha hona.",
        "Report ke saath chhapi reference range hi padhiye. Internet ke chart se mat milaiye: har lab ka analyser aur method alag hota hai, aur range usi ke hisaab se chhapi jaati hai.",
        {
          note: {
            title: "Ye result usi din doctor ko dikhaiye",
            text: "Tezi se girta platelet count; bahut zyada blood sugar ke saath ulti ya susti; khatarnak had tak kam haemoglobin; ya bahut badha creatinine ke saath peshab ka kam ho jaana. In chaar me intezaar nahi karna chahiye.",
            tone: "warn",
          },
        },
        [
          "Report kab tak aati hai aur kis-kis jagah aati hai — wo ",
          { text: "report wale section", href: LAB_DEORIA_REPORTS },
          " me hai. Report ke numbers ko line-by-line samajhna ho to uspar poora hissa alag guide me hai: ",
          { text: "report aa gayi — ab ise kaise padhein", href: BLOG_LAB_VARANASI_REPORT },
          ".",
        ],
      ],
    },

    {
      id: "bharosemand-lab-kaise-chunein-deoria",
      heading: "Deoria Me Bharosemand Pathology Lab Kaise Chunein",
      lead: "Poochhne layak paanch sawaal — bina kisi ke naam liye.",
      blocks: [
        "\"Best pathology lab in Deoria\" ka koi ek jawab nahi hota, aur jo bhi khud ko sabse achha bataye usse thoda sawaal poochh lena chahiye. Ye paanch cheezein pooch kar aap khud faisla kar sakte hain — kisi bhi lab ke baare me, hamare baare me bhi.",
        {
          list: [
            "Rate pehle se likha hua milta hai ya sample lene ke baad bataya jaata hai? Rate pehle likha hona chahiye.",
            "Home collection ka koi alag visiting charge to nahi? Charge hai to wo rate me judna chahiye, baad me nahi aana chahiye.",
            "Report kitne ghante me, aur kis format me — PDF milegi ya sirf kaagaz?",
            "Sample lene wala ID card ke saath aata hai ya nahi?",
            "Report par jo reference range chhapi hai, wo usi lab ki hai ya kisi aur ki nakal? Follow-up ke liye ek hi lab par tikna hai, isliye ye maayne rakhta hai.",
          ],
        },
        [
          "Hum kya karte hain aur kya nahi karte, wo saaf likha hua hai — ",
          { text: "Deoria ka pathology lab aur diagnostic centre wala section", href: LAB_DEORIA_LAB },
          " padh lijiye. Jo cheez hum confirm nahi kar sakte, wo hum apne page par likhte bhi nahi.",
        ],
      ],
    },

    {
      id: "aage-kya-karein-deoria",
      heading: "Aage Kya Karein",
      blocks: [
        [
          "Test chun liya hai to booking seedhi hai — ",
          { text: "Deoria ka service page", href: LAB_DEORIA },
          " kholiye, form bhariye, aur lagbhag 30 minute me confirmation call aa jaayegi. ",
          { text: "Saare test aur rate ek jagah", href: HOME_RATE_LIST },
          " dekhne hon to home page par poori list hai.",
        ],
        [
          "Abhi tay nahi kar paa rahe ki kaun sa test karana hai — to ",
          { text: "call kar ke poochh lijiye", href: CONTACT },
          ". Parcha hai to uski photo taiyaar rakhiye, usi panel ke hisaab se booking ho jaayegi.",
        ],
        [
          "Aas-paas ke jile: ",
          { text: "Salempur", href: LAB_SALEMPUR },
          ", ",
          { text: "Gorakhpur", href: LAB_GORAKHPUR },
          " aur ",
          { text: "Varanasi", href: LAB_VARANASI },
          " — har ek ka apna page, apna form aur apne ilaake hain.",
        ],
      ],
    },
  ],

  /* Seven questions, and every one of them is Deoria's own lane — package
     chunna, din ginna, Gorakhpur, ek hi lab. What is deliberately NOT here:
     "Deoria me lab test ka kitna kharcha", "kya aap mere ilaake me aate hain"
     and "report kitne der me" — those three are already FAQPage entries on
     /lab-test/deoria, and two FAQPage nodes on one domain answering the same
     question compete for one rich result. */
  faqs: [
    {
      question: "Deoria me full body checkup me kam se kam kaun se test hone chahiye?",
      answer:
        "Paanch system cover hone chahiye: khoon (CBC), sugar, liver (LFT), kidney (KFT) aur lipid profile. 40 saal ke baad ismein thyroid, HbA1c aur vitamin D/B12 bhi jodna chahiye. Parameter ki ginti par mat jaaiye — ek CBC akela hi 20 se zyada parameter gin leta hai, isliye \"80+ parameters\" wala package agar thyroid chhod deta hai to wo 45 parameter wale se kamzor hai.",
    },
    {
      question: "Deoria me bukhar aane par dengue ka test kis din karana chahiye?",
      answer:
        "Dengue NS1 antigen sirf bukhar ke pehle 1 se 5 din me bharosemand hai. Paanchve din ke baad NS1 aksar negative aa jaata hai aur tab Dengue IgM antibody karana chahiye. Typhoid ke Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye — pehle karane par jhootha negative aata hai. Koi bhi bukhar ho, CBC saath me zaroor karayein, kyunki platelet count aur haematocrit hi wo do number hain jo doctor roz dekhta hai.",
    },
    {
      question: "Gorakhpur me doctor dikhana hai — test Deoria me karayein ya wahin?",
      answer:
        "Jo test doctor pehle se likh chuka hai ya jo har visit par dohraye jaate hain — HbA1c, TSH, creatinine, haemoglobin — unhe Deoria me hi ek din pehle karwa lijiye. Report 24 ghante me PDF me aa jaati hai, aur aap OPD me parcha le kar nahi, report le kar ghuste hain. Isse ek poora din aur ek poora kiraya bachta hai. Naya test jo doctor us din likhe, wo alag baat hai.",
    },
    {
      question: "Deoria ke gaon aur kasbon me bhi ghar se sample liya jaata hai?",
      answer:
        "Deoria sheher ke saath Rudrapur, Barhaj, Bhatpar Rani, Gauri Bazar, Baitalpur, Lar aur Bhatni ke ilaakon me home collection hota hai. Salempur tehsil aur uske aas-paas ke kasbon ke liye alag page hai. Aap in kasbon ke aas-paas ke gaon me rehte hain aur sure nahi hain ki aapka address cover hota hai ya nahi, to booking se pehle ek call kar lijiye — hum saaf bata denge, taaki aap intezaar kar ke pareshan na hon.",
    },
    {
      question: "Har baar alag lab me test karane se farq padta hai kya?",
      answer:
        "Haan, jab aap kisi number ko mahino tak track kar rahe hain. Alag analyser aur alag method ki reference range thodi alag hoti hai, isliye ek lab me TSH 4.5 aur doosri me 4.1 aane ka matlab ye nahi ki thyroid badal gaya. HbA1c, TSH, creatinine aur ferritin jaise follow-up test ke liye hamesha ek hi lab par tike rahiye.",
    },
    {
      question: "Haemoglobin kam aaya hai — sirf iron ki goli kaafi hai?",
      answer:
        "Nahi. Haemoglobin kam aane par wahin ruk jaana sabse aam galti hai. Iron ki goli haemoglobin badha degi, lekin agar asli wajah vitamin B12 ki kami thi to wo waise hi chalti rahegi aur kuch mahine baad number phir gir jaayega. Kam haemoglobin par ferritin aur vitamin B12 bhi karana chahiye. Deoria jaise zyadatar shaakahaari jile me B12 ki kami aam hai, aur auraton aur teenage ladkiyon me anaemia usse bhi aam.",
    },
    {
      question: "Videsh jaane ke liye jo medical hota hai, kya wo aap karte hain?",
      answer:
        "Nahi. Videsh ke liye hone wala GAMCA ya company ka pre-employment medical sirf notified centre par hota hai aur usmein X-ray jaisi cheezein bhi shaamil hoti hain — ghar se sample lena uska vikalp nahi hai. Haan, us medical se pehle apni jaankari ke liye sugar, thyroid, haemoglobin aur liver ke test karwa lena kaam aata hai, taaki koi cheez aakhri waqt par pakad me na aaye.",
    },
  ],

  relatedLinks: {
    heading: "Deoria Ke Liye Aage Kya Dekhein",
    intro:
      "Is guide me test chunna, din ginna aur report samajhna hai. Booking, price aur poora test menu service page par hai.",
    groups: [
      {
        title: "Deoria Lab Test",
        links: [
          {
            href: LAB_DEORIA,
            label: "Deoria me lab test — booking aur free home collection",
            sub: "Rudrapur, Barhaj, Bhatpar Rani aur aas-paas ke ilaake",
          },
          {
            href: LAB_DEORIA_PRICE,
            label: "Deoria me lab test ka price",
            sub: "CBC, thyroid, HbA1c aur full body package",
          },
          {
            href: LAB_DEORIA_FULLBODY,
            label: "Full body checkup package — poora menu",
          },
          {
            href: LAB_DEORIA_BOOK,
            label: "Booking kaise hoti hai — ek slot me poora ghar",
          },
        ],
      },
      {
        title: "Aas-paas Ke Sheher",
        links: [
          {
            href: LAB_SALEMPUR,
            label: "Salempur me lab test",
            sub: "Bhatni, Lar aur Bhatpar Rani ke aas-paas ka ilaaka",
          },
          {
            href: LAB_GORAKHPUR,
            label: "Gorakhpur me lab test",
            sub: "Wahan OPD dikhana ho to report pehle taiyaar",
          },
          {
            href: LAB_VARANASI,
            label: "Varanasi me lab test",
            sub: "Imaging ya specialist ke liye jaana ho to",
          },
        ],
      },
      {
        title: "Doosre Guide",
        links: [
          {
            href: BLOG_FULLBODY_VARANASI,
            label: "Full body checkup me kya hona chahiye",
            sub: "Package me kya chhoot jaata hai, umar ke hisaab se kaun sa level",
          },
          {
            href: BLOG_LAB_VARANASI,
            label: "Kaun sa test kab karayein — poori guide",
            sub: "Shikayat, umar aur mausam ke hisaab se",
          },
          {
            href: HOME_RATE_LIST,
            label: "Sabhi lab test aur rate list",
            sub: "Har sheher me wahi rate — ek hi page par",
          },
          { href: CONTACT, label: "Contact — booking aur test chunne me madad" },
        ],
      },
    ],
  },
};
