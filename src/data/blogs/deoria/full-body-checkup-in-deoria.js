/**
 * /blogs/full-body-checkup/deoria — "Deoria Me Full Body Checkup Kaise Chunein"
 *
 * ── WHY THIS EXISTS, AND WHY IT IS NOT THE VARANASI POST WITH A NEW NOUN ──
 * ../index.js used to say the obvious next Deoria post was this one, and that
 * it was being held back on purpose: /blogs/full-body-checkup/varanasi is
 * written to be read from any district, so a Deoria copy had to earn its place
 * with genuinely local material rather than a search-and-replace of the city
 * name — which is how a site ends up with seven near-identical pages.
 *
 * It earns it by taking a different half of the question. Varanasi's post is
 * about WHAT SHOULD BE IN A PACKAGE — the "80+ parameters" claim pulled apart,
 * which is a national argument and stays there. This post is about WHICH
 * PACKAGE, FOR WHOM, IN WHICH MONTH — choosing and planning — and every worked
 * example in it is a Deoria one: the joint family that wants one slot, the
 * person home from Surat or Delhi for ten days, the farmer who will not sit
 * through two visits, and the Gorakhpur OPD date a report should reach before
 * the patient does.
 *
 *   /lab-test/deoria                      → book kahan se, rate, menu
 *   /blogs/lab-test/deoria                → kaun sa test kab (clinical)
 *   /blogs/pathology-lab/deoria           → sample dene kahan (geography)
 *   /blogs/diabetes-thyroid-test/deoria   → sugar/thyroid/lipid ka form
 *   /blogs/full-body-checkup/deoria       → kaun sa package, kis ke liye (this)
 *
 * ── "KITNE KA HOTA HAI" WITHOUT A SINGLE NUMBER ──────────────────────────
 * "Full body checkup kitne ka hota hai" is the biggest query this page is for,
 * and it is answered honestly — by explaining WHAT DECIDES the amount and then
 * sending the reader to the one file that carries rates
 * (src/data/lab/content/deoria.js, rendered at #lab-test-price-deoria). Do not
 * put a figure in here later "just for this one". The moment a rate lives on
 * two pages it starts to drift, and the cheaper of the two is the one a reader
 * screenshots and arrives with.
 *
 * ── CLAIMS ───────────────────────────────────────────────────────────────
 * Only the five the business confirms: free home collection, a trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI
 * on collection. NOT claimed: NABL accreditation, pathologist verification,
 * "certified" anything, same-day reports, or any comparative price claim
 * ("affordable", "sabse sasta", "best package"). X-ray, ultrasound, ECG and TMT
 * are stated as NOT ours — a full body checkup page that lets a reader assume
 * imaging is included is the single most likely way this page becomes a
 * complaint at the door.
 *
 * ── FAQs ─────────────────────────────────────────────────────────────────
 * "Full body checkup me kam se kam kaun se test hone chahiye" is NOT asked
 * here — /blogs/lab-test/deoria already owns that question, and two FAQPage
 * nodes on one domain answering it would compete for one rich result. The
 * seven below were checked against /lab-test/deoria (8), /blogs/lab-test/deoria
 * (7), /blogs/pathology-lab/deoria (7) and /blogs/diabetes-thyroid-test/deoria
 * (7).
 *
 * ── IMAGES: NONE ─────────────────────────────────────────────────────────
 * /public has no Deoria photography and `src` must name a file that exists.
 * og:image resolves to the generated card at
 * /blogs/full-body-checkup/deoria/og, drawn from the title.
 */
import {
  BLOG_AUTHOR,
  BLOG_PUBLISHER,
  INDEXABLE,
  canonicalFor,
} from "../shared";

/* Link targets as constants — a route rename is one line here instead of a hunt
   through the prose, and a typo surfaces as `undefined` in the href rather than
   as a silent 404. Section ids come from src/data/lab/content/deoria.js; rename
   one there and these anchors break silently. */
const LAB_DEORIA = "/lab-test/deoria";
const LAB_DEORIA_FULLBODY = "/lab-test/deoria#full-body-checkup-deoria";
const LAB_DEORIA_PRICE = "/lab-test/deoria#lab-test-price-deoria";
const LAB_DEORIA_PREPARE = "/lab-test/deoria#prepare-for-test-deoria";
const LAB_DEORIA_REPORTS = "/lab-test/deoria#reports-deoria";
const LAB_DEORIA_BOOK = "/lab-test/deoria#how-to-book-deoria";
const LAB_DEORIA_HOME = "/lab-test/deoria#home-sample-collection-deoria";
const LAB_DEORIA_GORAKHPUR = "/lab-test/deoria#gorakhpur-travel-deoria";
const LAB_DEORIA_MIGRANT = "/lab-test/deoria#migrant-workers-checkup-deoria";
const LAB_DEORIA_ANAEMIA = "/lab-test/deoria#anaemia-women-children-deoria";

const LAB_SALEMPUR = "/lab-test/salempur";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_KUSHINAGAR = "/lab-test/kushinagar";

const BLOG_LAB_DEORIA = "/blogs/lab-test/deoria";
const BLOG_LAB_DEORIA_UMAR = "/blogs/lab-test/deoria#kis-umar-me-kaun-sa-checkup";
const BLOG_LAB_DEORIA_GKP = "/blogs/lab-test/deoria#gorakhpur-jaane-se-pehle";
const BLOG_LAB_DEORIA_LAB = "/blogs/lab-test/deoria#bharosemand-lab-kaise-chunein-deoria";
const BLOG_PATHOLOGY_DEORIA = "/blogs/pathology-lab/deoria";
const BLOG_PATHOLOGY_DEORIA_HOME = "/blogs/pathology-lab/deoria#ghar-se-kaunsi-jaanch";
const BLOG_PATHOLOGY_DEORIA_PATA = "/blogs/pathology-lab/deoria#pata-landmark-deoria";
const BLOG_DIABETES_DEORIA = "/blogs/diabetes-thyroid-test/deoria";
const BLOG_DIABETES_DEORIA_TABLE =
  "/blogs/diabetes-thyroid-test/deoria#kitni-baar-aur-fasting-table-deoria";
const BLOG_FULLBODY_VARANASI = "/blogs/full-body-checkup/varanasi";

const CONTACT = "/contact";

export const fullBodyCheckupDeoria = {
  category: "full-body-checkup",
  city: "deoria",

  /* 41 characters. The root layout appends " | MedicoBharat" (template in
     src/app/layout.js), so Google renders 56 — inside the ~60 it will show.
     Deliberately NOT "Best Full Body Checkup in Deoria": the whole argument of
     this page is that "best" is a word a package cannot earn, only its test
     list can. */
  title: "Deoria Me Full Body Checkup Kaise Chunein",

  /* ~141 characters, so it renders whole on desktop and on a phone. Hinglish,
     because the page and the searcher both are, with the English terms that
     have to match left intact: full body checkup, package. */
  description:
    "Deoria me full body checkup ka daam kis baat par tay hota hai, kis umar me kaun sa package sahi hai, aur ghar se sample kaise diya jaata hai.",

  /* Ordered strongest first. Every term here appears in the visible copy —
     that is what this array is, a checklist the headings and tables were
     written against, not a place to park words the page never says. */
  keywords: [
    "Full Body Checkup in Deoria",
    "Full Body Checkup Price in Deoria",
    "Deoria Me Full Body Checkup Kitne Ka Hota Hai",
    "Health Checkup Package Deoria",
    "Whole Body Checkup Deoria",
    "Full Body Test at Home in Deoria",
    "Annual Health Checkup Deoria",
    "Family Health Checkup Deoria",
    "Lab Test in Deoria",
    "Blood Test at Home in Deoria",
    "Home Sample Collection Deoria",
    "Full Body Checkup Deoria Sadar",
    "Health Checkup Package Rudrapur Barhaj",
  ],

  canonical: canonicalFor("full-body-checkup", "deoria"),
  robots: INDEXABLE,
  author: BLOG_AUTHOR,
  publisher: BLOG_PUBLISHER,

  publishedAt: "2026-09-02",
  updatedAt: "2026-09-02",

  /* Stated rather than computed: a number that changes every time a sentence is
     edited is a number nobody maintains. Update it when the article grows a
     section. */
  readingMinutes: 10,

  /** The skimmer's version of the whole article. */
  takeaways: [
    "Package ka daam test ki ginti se nahi, us me kaunse test hain isse tay hota hai — 60 saste parameters ek HbA1c ke barabar nahi hote.",
    "Do package tolna ho to ginti mat miliye, soochi milaiye: sugar, kidney, liver, thyroid, lipid aur khoon ki ginti — ye chhah hisse har poore package me hone chahiye.",
    "Koi dawa nahi chal rahi to saal me ek baar kaafi hai. Dawa chal rahi hai to package saal me ek baar, aur us bimari ka apna test doctor ke kahe anusar.",
    "Poore ghar ka sample ek hi visit me ho jaata hai aur collection tab bhi free hai — Deoria me sabse aasan tareeka yahi hai.",
    "X-ray, ultrasound, ECG aur TMT humse nahi hote. Jo package inhe apne andar bataye, uski soochi ek baar dhyaan se padh lijiye.",
  ],

  sections: [
    {
      id: "full-body-checkup-deoria-matlab",
      heading:
        "Full Body Checkup Ka Matlab Kya Hai — Aur Deoria Me Log Ise Kab Karate Hain",
      lead: "Ye ek test nahi, ek soochi hai. Aur soochi hi ise poora ya aadha banati hai.",
      blocks: [
        "\"Full body checkup\" koi ek jaanch nahi hai. Ye kai test ka ek bandal hai jo ek hi sample se, ek hi baar me ho jaata hai — sugar, kidney, liver, thyroid, cholesterol aur khoon ki ginti jaise hisse milkar ise banate hain. Isi liye do labs ke \"full body checkup\" ek doosre se bilkul alag ho sakte hain, aur dono apne aap ko poora bataate hain.",
        "Deoria me ye checkup zyadatar teen mauko par karaya jaata hai. Pehla — saal ka routine, jab ghar me kisi ko koi shikayat nahi hoti lekin umar 35 paar kar chuki hoti hai. Doosra — jab koi bahar se, Surat, Delhi, Mumbai ya Gulf se, kuch dinon ke liye ghar aata hai aur usi beech sab kuch nipta lena hota hai. Teesra — Gorakhpur me doctor dikhane se pehle, taaki report haath me rahe aur ek chakkar bach jaaye.",
        {
          note: {
            title: "Is guide me kya hai aur kya nahi",
            text: "Yahan ye likha hai ki package kaise chunein, uska daam kis baat par tay hota hai aur saal me kab karana chahiye. Yahan ye nahi likha ki aapke number ka kya matlab hai ya kaun si dawa leni hai — wo faisla aapke doctor ka hai aur sirf uska hai. Aur is poore page par kisi test ka rate jaan-boojh kar nahi likha gaya: rate ek hi jagah rehta hai, taaki wo do pages par alag-alag na ho jaaye.",
            tone: "warn",
          },
        },
        [
          "Kis umar me kaun sa checkup shuru karna chahiye, uski poori clinical list ",
          { text: "yahan hai", href: BLOG_LAB_DEORIA_UMAR },
          ". Ye guide uske aage ka hissa hai — chunne aur planning ka.",
        ],
      ],
    },

    {
      id: "full-body-checkup-price-deoria",
      heading:
        "Deoria Me Full Body Checkup Kitne Ka Hota Hai — Daam Kis Baat Par Tay Hota Hai",
      lead: "Ginti se nahi. Soochi se.",
      blocks: [
        "Ye sabse zyada poochha jaane wala sawaal hai, aur iska seedha jawab ye hai: package ka daam is baat par tay hota hai ki us me kaunse test hain — kitne hain, us par nahi. Kuch test sasta padte hain: haemoglobin, blood group, urine routine. Kuch mehnge padte hain kyunki unke liye alag reagent aur alag machine lagti hai: HbA1c, thyroid profile, vitamin D, vitamin B12. Ek package me 60 saste parameters daal kar ginti badhayi ja sakti hai, aur wo phir bhi us package se kamzor rahega jismein 30 test hain lekin unme HbA1c, TSH, KFT aur lipid profile shaamil hain.",
        {
          table: {
            caption: "Package ka daam kin cheezon se badalta hai — aur kin se nahi",
            head: ["Baat", "Daam par asar", "Kyun"],
            rows: [
              [
                "Package me kaunse test hain",
                "Sabse zyada asar",
                "Thyroid, HbA1c aur vitamin wale test package ka bada hissa banate hain",
              ],
              [
                "Kitne parameters likhe hain",
                "Bahut kam asar",
                "Ek CBC akela hi bees se zyada parameters gin leta hai — ginti apne aap kuch nahi batati",
              ],
              [
                "Vitamin D aur B12 shaamil hain ya nahi",
                "Saaf asar",
                "Ye do alag test hain; package me hon to daam upar jaata hai aur package poora bhi hota hai",
              ],
              [
                "Home sample collection",
                "Koi asar nahi",
                "Deoria me collection free hai — visiting charge naam ki koi cheez nahi hai",
              ],
              [
                "Ghar me kitne log karwa rahe hain",
                "Per person rate wahi",
                "Ek visit me kai sample ho jaate hain, lekin har vyakti ka apna package aur apna rate",
              ],
              [
                "X-ray, ultrasound, ECG, TMT",
                "Hamare package me hain hi nahi",
                "Ye machine par hote hain aur hamari service me shaamil nahi hain",
              ],
            ],
          },
        },
        [
          "Deoria ke liye har test aur har package ka rate ek hi jagah likha hai — ",
          { text: "Deoria ki price list", href: LAB_DEORIA_PRICE },
          " me. Package me kya-kya aata hai wo ",
          { text: "service page ke menu", href: LAB_DEORIA_FULLBODY },
          " me khula hua hai. Is guide me ek bhi number jaan-boojh kar nahi likha gaya, taaki rate do jagah alag-alag na ho jaaye.",
        ],
        {
          note: {
            title: "Package hamesha sasta padta hai — lekin sirf tab jab wo aapke kaam ka ho",
            text: "Alag-alag test book karne se package aam taur par kam padta hai. Lekin doctor ne agar sirf teen test likhe hain, to 40 test wala package sasta nahi — wo mehnga hai. Parcha haath me hai to wahi karwaiye; package tab lijiye jab koi shikayat na ho aur saal ka routine karana ho.",
            tone: "info",
          },
        },
      ],
    },

    {
      id: "kis-ke-liye-kaun-sa-package-deoria",
      heading: "Kis Ke Liye Kaun Sa Package — Umar Aur Kaam Ke Hisaab Se",
      lead: "Ek hi package sabke liye theek nahi hota. Yahan Deoria ke chhah aam mamle hain.",
      blocks: [
        "Ye aam salah hai, koi vyaktigat salah nahi. Doctor ne aapke liye kuch alag likha ho to wahi chalega — parche ki photo booking ke waqt bhej dijiye aur usi hisaab se panel bana diya jaayega.",
        {
          table: {
            caption: "Deoria me kis ke liye kaun sa checkup — aam salah",
            head: ["Kaun", "Kam se kam kya hona chahiye", "Aam taur par kitni baar"],
            rows: [
              [
                "20 se 30 saal, koi shikayat nahi",
                "CBC, blood sugar, TSH, vitamin B12 aur vitamin D",
                "Do saal me ek baar; thakan rehti ho to har saal",
              ],
              [
                "30 se 45 saal",
                "Upar ka sab, aur uske saath lipid profile, liver (LFT) aur kidney (KFT)",
                "Saal me ek baar",
              ],
              [
                "45 ke upar, ya ghar me sugar/BP ka itihaas",
                "Poora package jismein HbA1c aur KFT zaroor hon",
                "Saal me ek baar; dawa chal rahi ho to doctor ke kahe anusar",
              ],
              [
                "Mahilaayein — thakan, baal jhadna, periods ki shikayat",
                "CBC, ferritin, thyroid profile, vitamin B12, vitamin D",
                "Saal me ek baar",
              ],
              [
                "Bahar kaam karne wale, ghar 10-15 din ke liye aaye hain",
                "Poora package ek hi subah me — CBC, sugar, LFT, KFT, lipid, thyroid",
                "Har baar ghar aane par ek baar",
              ],
              [
                "Kheti ya mazdoori karne wale",
                "CBC (haemoglobin ke liye), sugar, LFT aur KFT",
                "Saal me ek baar, kaam ke seezan se pehle",
              ],
            ],
          },
        },
        [
          "Sugar, thyroid aur lipid me kaunsa form karana hai — fasting, PP ya HbA1c — us par alag guide hai: ",
          { text: "Deoria me sugar, thyroid aur lipid ki jaanch", href: BLOG_DIABETES_DEORIA },
          ". Auraton aur ladkiyon me khoon ki kami par ",
          { text: "anaemia wala section", href: LAB_DEORIA_ANAEMIA },
          " padh lijiye.",
        ],
      ],
    },

    {
      id: "saal-me-kab-checkup-deoria",
      heading: "Saal Me Kab Karayein — Deoria Me Mahine Ka Farq Padta Hai",
      lead: "Routine checkup aur bukhar ka mausam ek saath nahi chalte.",
      blocks: [
        "Routine full body checkup ka matlab hai apni sadharan halat ka number nikaalna. Isi liye ise us waqt nahi karana chahiye jab aap beemar hon. Bukhar ke dauraan aur uske turant baad CBC ke kai number apne aap upar-neeche rehte hain, aur us report ko baad me \"apna normal\" maan lena galat rahega — agle saal ki tulna bhi usi se bigadti hai.",
        {
          list: [
            "Barsaat aur uske baad ka mahina — Deoria me yahi bukhar, dengue aur typhoid ka seezan hai. Us waqt bimari ka test kijiye, routine package nahi.",
            "Jaada ka mausam — routine checkup ke liye sabse aasan waqt. Fasting bhi asaan rehti hai aur ghar par log maujood rehte hain.",
            "Ghar me koi bahar se aaya ho — pahunchte hi book kar dijiye, kyunki report aane tak wo yahin rehta hai aur doctor ko dikha bhi sakta hai.",
            "Gorakhpur me OPD ki tareekh mili ho — us se kam se kam do din pehle sample de dijiye, taaki report saath jaaye.",
            "Beemar the aur ab theek hain — routine package ke liye kam se kam do hafte ruk jaaiye.",
          ],
        },
        [
          "Gorakhpur jaane se pehle kya-kya taiyaar rakhna chahiye, uski poori list ",
          { text: "yahan hai", href: BLOG_LAB_DEORIA_GKP },
          ", aur ",
          { text: "Gorakhpur travel wala section", href: LAB_DEORIA_GORAKHPUR },
          " service page par. Bahar se ghar aaye logon ke liye ",
          { text: "alag hissa", href: LAB_DEORIA_MIGRANT },
          " likha hua hai.",
        ],
      ],
    },

    {
      id: "do-package-kaise-tolen-deoria",
      heading: "Do Package Saamne Hain — Kaise Tay Karein Kaun Sa Behtar Hai",
      lead: "Ginti chhod dijiye. Chhah hisse dhoondhiye.",
      blocks: [
        "Deoria me aksar do package saamne rakhe jaate hain aur reader dono me se ginti bada wala chun leta hai. Ginti sabse kam kaam ki cheez hai. Dono soochiyan saamne rakhiye aur in chhah hisson par nishaan lagaiye — jitne hisse milein, package utna poora hai.",
        {
          list: [
            "Sugar — sirf fasting sugar hai, ya HbA1c bhi? HbA1c teen mahine ka ausat batata hai aur wahi package ko asli banata hai.",
            "Kidney — KFT, ya kam se kam creatinine aur urea. Ghar me sugar ya BP ka itihaas ho to ye chhoot nahi sakta.",
            "Liver — LFT, jismein SGPT, SGOT aur bilirubin aate hain.",
            "Thyroid — sirf TSH hai ya poora T3-T4-TSH profile? Dono alag cheez hain aur alag rate ke hain.",
            "Lipid — poora lipid profile, sirf \"cholesterol\" naam ka ek akela number nahi.",
            "Khoon ki ginti — CBC; aur mahilaon ke liye ho to saath me ferritin ya vitamin B12 bhi.",
          ],
        },
        [
          "\"80+ parameters\" jaise daawe ka matlab kya hota hai aur unhe kaise pada jaata hai, us par ek poori guide alag se hai — ",
          { text: "package me kya hona chahiye", href: BLOG_FULLBODY_VARANASI },
          ". Wo har jile par ek jaisa lagu hota hai, isliye yahan dobara nahi likha gaya.",
        ],
        {
          note: {
            title: "Machine wali jaanch package me nahi hoti",
            text: "Kuch package me X-ray, ECG, ultrasound ya TMT likha milta hai. Hamare package me ye nahi hain, aur hum Deoria me kisi imaging centre se jude hone ka daawa nahi karte. Jo jaanch sirf khoon ya peshab ke sample par hoti hai wahi ghar se hoti hai; baaki ke liye centre par jaana hi padega.",
            tone: "warn",
          },
        },
        [
          "Kisi bhi lab ko tolne ka aam tareeka — report ka header, method aur reference range — ",
          { text: "yahan likha hai", href: BLOG_LAB_DEORIA_LAB },
          ".",
        ],
      ],
    },

    {
      id: "package-se-pehle-taiyari-deoria",
      heading: "Package Book Karne Se Pehle Chaar Cheezein Taiyaar Rakhiye",
      lead: "Yahi chaar cheezein confirmation call ko do minute ka bana deti hain.",
      blocks: [
        {
          list: [
            "Doctor ka parcha, agar hai to. Uski photo booking ke waqt bhej dijiye — package usi hisaab se ghata-badha diya jaata hai.",
            "Purani report, agar pichhle saal karayi thi. Package ka asli fayda pichhle saal se farak dekhne me hai, kisi ek akele number me nahi.",
            "Dawaiyon ki list — sugar, BP, thyroid, khoon patla karne wali ya koi bhi niyamit dawa. Ye jaankari lab ke paas honi chahiye.",
            "Fasting ka faisla. Package me sugar aur lipid dono hote hain, isliye package hamesha khaali pet hota hai — 10 se 12 ghante, beech me sirf saada paani.",
          ],
        },
        [
          "Sample dene se pehle ki poori taiyaari — kya khaana hai, kya nahi, aur bujurgon ka kya dhyaan rakhna hai — ",
          { text: "service page par", href: LAB_DEORIA_PREPARE },
          " likhi hai. Kaunse test me fasting lagti hai aur kaunse me bilkul nahi, uski table ",
          { text: "yahan", href: BLOG_DIABETES_DEORIA_TABLE },
          " hai.",
        ],
      ],
    },

    {
      id: "poore-ghar-ka-checkup-deoria",
      heading: "Poore Ghar Ka Full Body Checkup Ek Saath — Deoria Me Sabse Aasan Tareeka",
      lead: "Ek subah, ek visit, sabka sample.",
      blocks: [
        "Deoria me zyadatar ghar joint hain, aur sabse aam sawaal yahi hota hai — \"ghar me chaar log hain, kya chaar baar aana padega?\" Nahi. Ek hi visit me sabka sample liya ja sakta hai, aur collection tab bhi free rehta hai. Booking ke waqt sirf ye bata dijiye ki kitne log hain aur kis-kis ka kaun sa package hai, taaki phlebotomist utni taiyaari ke saath aaye.",
        {
          list: [
            "Sabka slot ek hi rakhiye. Slot subah 6 baje se shuru hote hain, aur package wale ko pehla slot hi lena chahiye.",
            "Fasting sabke liye ek jaisi hogi, kyunki package me sugar aur lipid dono hote hain. Jis bachche ka sirf CBC ya vitamin ho raha hai use khaali pet rakhne ki zaroorat nahi.",
            "Bujurg, bistar par pade mareez, ya jinki nas patli ho chuki hai — ye booking ke waqt bata dijiye, taaki usi hisaab se taiyaari ho.",
            "Payment sample lene ke waqt, cash ya UPI se — per person wahi rate jo pehle bataya gaya tha.",
            "Report 24 ghante ke andar WhatsApp aur email par PDF me aati hai. Har vyakti ki apni report, alag.",
          ],
        },
        [
          "Kaun si jaanch ghar par ho jaati hai aur kis ke liye centre jaana hi padega, uski poori list ",
          { text: "yahan hai", href: BLOG_PATHOLOGY_DEORIA_HOME },
          ". Deoria me pata kaise likhein — jo yahan late visit ki sabse badi wajah hai — ",
          { text: "wo yahan", href: BLOG_PATHOLOGY_DEORIA_PATA },
          ". Aur coverage, yaani kaunse kasbe aur kaunse slot, ",
          { text: "home collection wale section", href: LAB_DEORIA_HOME },
          " me.",
        ],
      ],
    },

    {
      id: "report-aane-ke-baad-package-deoria",
      heading: "Package Ki Report Aa Gayi — Ab Ismein Kya Dekhein",
      lead: "Report lambi hoti hai. Usme se chaar cheezein hi turant maayne rakhti hain.",
      blocks: [
        "Package ki report do-teen page ki hoti hai aur usmein kai jagah \"High\" ya \"Low\" likha mil jaata hai. Ghabraiye mat — range se thoda bahar hona bahut aam hai aur aksar harmless. Do kaam zaroor kijiye: poori report apne doctor ko dikhaiye, aur pichhle saal ki report saath rakhiye. Package ka asli fayda tulna me hai — saal bhar me kaunsa number kis taraf khiska, ye ek akeli report nahi bata sakti.",
        {
          note: {
            title: "In chaar halaton me usi din doctor ko dikhaiye",
            text: "Tezi se girta platelet count; bahut zyada blood sugar ke saath ulti ya susti; khatarnak had tak kam haemoglobin; ya bahut badha creatinine ke saath peshab ka kam ho jaana. In chaar me intezaar nahi kiya jaata. Baaki numbers agli OPD tak ruk sakte hain.",
            tone: "warn",
          },
        },
        [
          "Report kab tak aur kis roop me aati hai wo ",
          { text: "report wale section", href: LAB_DEORIA_REPORTS },
          " me hai. Aur ek baat jo package karane walon ke liye sabse zaroori hai: jo number aap saal-dar-saal track karenge — HbA1c, TSH, creatinine, haemoglobin — unhe hamesha ek hi lab se karaiye, kyunki har lab ka analyser aur reference range apna hota hai.",
        ],
      ],
    },

    {
      id: "aage-kya-karein-fullbody-deoria",
      heading: "Aage Kya Karein",
      lead: "Teen kadam, isi kram me.",
      blocks: [
        {
          list: [
            "Upar wali chhah-hisse wali soochi lekar package ka menu ek baar padhiye — jo hissa gayab ho use booking ke waqt jodwa lijiye.",
            "Subah 6 baje ka pehla slot lijiye aur raat ka khaana 9 baje tak kar lijiye. Package hamesha khaali pet hota hai.",
            "Ghar ke jitne log karana chahte hain, sabki booking ek hi slot me kar dijiye — ek subah me poora ghar nipat jaata hai.",
          ],
        },
        [
          "Booking ke liye ",
          { text: "Deoria ka form", href: LAB_DEORIA_BOOK },
          " bhar dijiye ya ",
          { text: "call kar lijiye", href: CONTACT },
          ". Lagbhag 30 minute me confirmation call aati hai jismein slot, pata, fasting aur total daam chaaron tay ho jaate hain. Kaun sa test kab karana chahiye, us par poori clinical guide ",
          { text: "yahan hai", href: BLOG_LAB_DEORIA },
          ", aur sample dene ki jagah tatha mohalla coverage ",
          { text: "diagnostic centre wali guide", href: BLOG_PATHOLOGY_DEORIA },
          " me.",
        ],
      ],
    },
  ],

  /* Seven questions, all in this post's own lane — daam ka aadhaar, package vs
     alag test, ginti ka jaal, mausam, ghar ke kai log, imaging, purani report.
     "Full body checkup me kam se kam kaun se test hone chahiye" is deliberately
     absent: /blogs/lab-test/deoria owns it, and two FAQPage nodes answering one
     question compete for a single rich result. */
  faqs: [
    {
      question: "Deoria me full body checkup kitne ka hota hai — daam kis baat par tay hota hai?",
      answer:
        "Daam is baat par tay hota hai ki package me kaunse test hain, kitne parameters likhe hain us par nahi. HbA1c, thyroid profile, vitamin D aur vitamin B12 jaise test package ka bada hissa banate hain, jabki haemoglobin ya urine routine jaise test sasta padte hain — isi liye 60 parameters wala package 30 test wale package se kamzor bhi ho sakta hai. Home sample collection Deoria me free hai, isliye uska koi alag charge nahi judta. Har package aur test ka rate Deoria ke service page par ek hi jagah likha hai, aur total confirmation call par pehle hi bata diya jaata hai.",
    },
    {
      question: "Package lena chahiye ya doctor ke likhe hue alag-alag test?",
      answer:
        "Parcha haath me hai to wahi karwaiye. Doctor ne teen test likhe hain aur aap 40 test wala package le lete hain to wo sasta nahi pada — us me se 37 test ka aapke abhi ke sawaal se koi lena-dena nahi hai. Package tab sahi baithta hai jab koi khaas shikayat na ho aur aap saal ka routine karana chahte hon, kyunki tab alag-alag test book karne se package aam taur par kam padta hai. Tay na kar paayein to booking form bhar dijiye aur parche ki photo bhej dijiye — call par bata diya jaayega ki aapke liye kya theek rahega.",
    },
    {
      question: "Ek package me 80 parameters likhe hain aur doosre me 40 — kya pehla behtar hai?",
      answer:
        "Zaroori nahi. Ek akela CBC hi bees se zyada parameters gin leta hai, isliye ginti badhana aasan hai aur wo apne aap kuch nahi batati. Dono soochi saamne rakhiye aur chhah hisse dekhiye: sugar me HbA1c hai ya nahi, kidney ke liye KFT (ya kam se kam creatinine aur urea), liver ke liye LFT, thyroid me sirf TSH hai ya poora profile, poora lipid profile, aur CBC. Jis package me ye chhah mil jaayein wo behtar hai, chaahe uski ginti kam ho. Jismein vitamin D aur B12 bhi hon wo aur poora hai, lekin uska daam bhi usi hisaab se rahega.",
    },
    {
      question: "Bukhar abhi-abhi utra hai — kya main full body checkup karwa sakta hoon?",
      answer:
        "Routine package ke liye kam se kam do hafte ruk jaaiye. Bukhar ke dauraan aur uske turant baad CBC ke kai number apne aap upar-neeche rehte hain, aur us report ko baad me apna sadharan number maan lena galat rahega — agle saal ki tulna bhi usi se bigadti hai. Ye baat sirf routine checkup par lagu hai: doctor ne bimari ke silsile me koi test likha hai to wo turant karwaiye, use rokna nahi hai. Deoria me barsaat ke baad ka mahina bimari ke test ka hota hai; routine package ke liye jaada ka mausam sabse aasan rehta hai.",
    },
    {
      question: "Ghar ke chaar log package karana chahte hain — rate alag hoga aur visit alag?",
      answer:
        "Visit ek hi lagegi, rate har vyakti ka apna. Ek hi subah me chaaron ka sample liya ja sakta hai aur home collection phir bhi free rehta hai; booking ke waqt sirf bata dijiye ki kitne log hain aur kis-kis ka kaun sa package hai. Sabko khaali pet rakhiye, kyunki package me sugar aur lipid dono hote hain — haan, jis bachche ka sirf CBC ya vitamin ho raha hai use fasting ki zaroorat nahi. Har vyakti ki report alag PDF me, 24 ghante ke andar WhatsApp aur email par aa jaati hai.",
    },
    {
      question: "Kya aapke full body checkup me X-ray, ECG ya ultrasound bhi shaamil hai?",
      answer:
        "Nahi. Hamare package me sirf wo jaanch hai jo khoon ya peshab ke sample par hoti hai. X-ray, ultrasound, ECG, TMT aur CT scan machine par hote hain, unke liye centre par jaana hi padta hai, aur hum Deoria me kisi imaging centre se jude hone ka daawa nahi karte. Doctor ne dono likhe hain to khoon wali jaanch ghar se karwa lijiye aur imaging ke liye centre jaaiye — dono report doctor ko ek saath dikhaiye. Kisi bhi package me imaging likha dikhe to poochh lijiye ki wo kis centre par hoga aur uska rate alag hai ya nahi.",
    },
    {
      question: "Pichhle saal ki report kho gayi hai — kya package ka poora fayda ab bhi milega?",
      answer:
        "Fayda hai — is saal ka number apne aap me kaam ka hai aur wahi agle saal ka aadhaar ban jaayega. Lekin poora fayda tulna me hai: saal bhar me creatinine, HbA1c ya haemoglobin kis taraf khiska, ye ek akeli report nahi bata sakti. Isliye is baar ki PDF sambhaal kar rakhiye — wo WhatsApp aur email dono par aati hai, isliye phone badalne par bhi email me padi rehti hai. Aur aage ke liye ek baat: jo number aap saal-dar-saal dekhenge unhe hamesha ek hi lab se karaiye, kyunki har lab ka analyser aur reference range apna hota hai.",
    },
  ],

  relatedLinks: {
    heading: "Deoria Ke Liye Aage Ki Jaankari",
    intro:
      "Is guide me package chunna aur planning hai. Kaun sa test kab karana chahiye wo clinical guide me, jagah aur pata diagnostic guide me, aur rate sirf service page par.",
    groups: [
      {
        title: "Deoria Ki Doosri Guides",
        links: [
          {
            href: BLOG_LAB_DEORIA,
            label: "Deoria me kaun sa lab test kab karayein",
            sub: "Umar, shikayat aur bukhar ke din ke hisaab se poori guide",
          },
          {
            href: BLOG_DIABETES_DEORIA,
            label: "Deoria me sugar, thyroid aur lipid ki jaanch",
            sub: "Fasting kis me chahiye, HbA1c aur TSH dobara kab",
          },
          {
            href: BLOG_PATHOLOGY_DEORIA,
            label: "Deoria me diagnostic centre aur blood test",
            sub: "Mohalle, kasbe, pata likhne ka tareeka aur booking",
          },
          {
            href: BLOG_FULLBODY_VARANASI,
            label: "Package me kya hona chahiye",
            sub: "\"80+ parameters\" ka sach — har jile par ek jaisa lagu",
          },
        ],
      },
      {
        title: "Booking Aur Rate",
        links: [
          {
            href: LAB_DEORIA,
            label: "Deoria me lab test — booking aur free home collection",
            sub: "Deoria Sadar, Rudrapur, Barhaj, Bhatpar Rani aur aas-paas",
          },
          {
            href: LAB_DEORIA_FULLBODY,
            label: "Full body checkup ka menu — service page par",
            sub: "Package me kaunse test aate hain, poori soochi",
          },
          {
            href: LAB_DEORIA_PRICE,
            label: "Deoria me lab test aur package ka rate list",
          },
          {
            href: LAB_DEORIA_PREPARE,
            label: "Sample dene se pehle ki taiyaari",
          },
        ],
      },
      {
        title: "Aas-paas Ke Jile",
        links: [
          {
            href: LAB_SALEMPUR,
            label: "Salempur me lab test",
            sub: "Bhatni, Lar aur Bhatpar Rani ke aas-paas ka ilaaka",
          },
          {
            href: LAB_GORAKHPUR,
            label: "Gorakhpur me lab test",
            sub: "Ilaaj wahan chal raha ho to report pehle taiyaar",
          },
          {
            href: LAB_KUSHINAGAR,
            label: "Kushinagar me lab test",
            sub: "Padrauna, Hata aur Tamkuhi Raj ka padosi jila",
          },
        ],
      },
    ],
  },
};
