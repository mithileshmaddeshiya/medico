/**
 * /blogs/full-body-checkup/varanasi — "Varanasi Me Full Body Checkup — Kya Karayein"
 *
 * ── WHY THIS POST EXISTS, AND WHY IT IS NOT THE OTHER TWO PAGES ──────────
 * Varanasi now has three URLs in the same neighbourhood, and they only stay
 * out of each other's way because each one answers a different question:
 *
 *   /lab-test/varanasi              → "kahan se karaun" — booking, price, menu
 *   /blogs/lab-test/varanasi        → "kaun sa test kab" — symptom, din, report
 *   /blogs/full-body-checkup/varanasi (this) → "package me kya hona chahiye"
 *
 * The service page gives full body checkup three paragraphs, because it has a
 * whole service to describe. The guide at /blogs/lab-test/varanasi mentions it
 * in one paragraph, because its subject is choosing a test off a prescription.
 * Neither of them answers the question a person actually types before paying —
 * "is ₹999 package me kya chhoot raha hai" — and that question has its own
 * search demand ("full body checkup in Varanasi", "full body checkup price",
 * "kitne parameter hone chahiye"). That gap is this article.
 *
 * The line that keeps it from becoming a doorway page: this post never states
 * a price. Every sentence that would have carried a number links to the price
 * section of the service page instead, so the rate lives in exactly one file
 * (src/data/lab/content/varanasi.js) and can never drift between three pages.
 *
 * ── DE-DUPLICATION THAT WAS DONE WHEN THIS SHIPPED ───────────────────────
 * ../varanasi/lab-test-in-varanasi.js used to carry an FAQ, "Full body checkup
 * me kam se kam kaun se test hone chahiye?", and two full-body keywords. Two
 * FAQPage nodes on one domain answering one question compete for one rich
 * result, so that FAQ was replaced with an anaemia question — which is in that
 * article's own lane — and the keywords moved here. The prose link from that
 * article to this one was added in the same edit.
 *
 * ── WHY THE TABLES ARE THE POINT ─────────────────────────────────────────
 * A person comparing packages is doing a lookup, not reading an essay: "mere
 * package me thyroid hai ya nahi", "35 saal me kya chahiye", "80 parameter ka
 * matlab kya". Each of those is a row in a table here, which is also the shape
 * a featured snippet is built from. Prose is kept only where the point is an
 * argument the reader has not heard — chiefly the parameter-count section,
 * which is the one genuinely non-obvious thing this article has to say.
 *
 * ── Claims ───────────────────────────────────────────────────────────────
 * Operationally, only the five the business confirms: free home collection, a
 * trained phlebotomist with an ID card, slots from 6 AM, reports in 24 hours,
 * cash/UPI on collection. Cold chain, barcoding and sealed needles are NOT
 * claimed here — same rule as the sibling article, and for the same reason.
 *
 * Clinically, only the uncontroversial standards: five systems in a real
 * panel, HbA1c quarterly for a diabetic, urine microalbumin as the earliest
 * diabetic-kidney signal, B12 deficiency being common in vegetarian diets,
 * TSH repeated 6–8 weeks after a dose change, biotin stopped before a hormone
 * assay. Nothing here diagnoses, and every number that could be acted on ends
 * in "doctor ko dikhaiye".
 *
 * ── Internal links ───────────────────────────────────────────────────────
 * The whole point of the piece, so every href is a constant below and every
 * one is a route that renders today:
 *   /lab-test/varanasi + 7 of its section anchors  (src/data/lab/content/varanasi.js)
 *   /lab-test/gorakhpur, /lab-test/deoria          (src/data/lab/cities.js)
 *   /blogs/lab-test/varanasi + 3 anchors           (./lab-test-in-varanasi.js)
 *   /medicine-delivery/deoria                      (src/data/medicine/cityData.js)
 *   /contact
 * If a section id in varanasiContent is ever renamed, the anchors here break
 * silently — they are listed in that file's header note for exactly that reason.
 *
 * ── Images: deliberately none ────────────────────────────────────────────
 * This post ships with no hero and no in-body photographs. Every image in
 * /public today belongs to the medicine side or is the one phlebotomy photo
 * the sibling article already uses as its hero — so anything placed here
 * would either be off-topic or a duplicate of another article's LCP image.
 *
 * Nothing breaks by leaving them out. `hero` is optional (index.js normalises
 * a missing one to null and page.js renders the masthead without the figure),
 * and og:image, twitter:image and the BlogPosting `image` all resolve to the
 * generated share card at /blogs/full-body-checkup/varanasi/og, which is drawn
 * from the title and needs no file.
 *
 * TO ADD ONE LATER: drop real Varanasi photography in /public/blogs/varanasi/
 * and add a `hero: { src, alt, caption }` here, plus `image: {...}` on any
 * section that earns one. The rule that must not be broken is the one the old
 * blogData.js broke — `src` has to name a file that actually exists in
 * /public, or the article schema ends up pointing at a 404.
 */
import {
  BLOG_AUTHOR,
  BLOG_PUBLISHER,
  INDEXABLE,
  canonicalFor,
} from "../shared";

/* Link targets as constants — a route rename is then one line here instead of
   a hunt through the prose, and a typo surfaces as `undefined` in the href
   rather than as a silent 404 in production. */
const LAB_VARANASI = "/lab-test/varanasi";
const LAB_VARANASI_FULLBODY = "/lab-test/varanasi#full-body-checkup-varanasi";
const LAB_VARANASI_PRICE = "/lab-test/varanasi#lab-test-price-varanasi";
const LAB_VARANASI_POPULAR = "/lab-test/varanasi#popular-blood-tests-varanasi";
const LAB_VARANASI_HOME = "/lab-test/varanasi#home-sample-collection-varanasi";
const LAB_VARANASI_DIABETES = "/lab-test/varanasi#diabetes-thyroid-screening";
const LAB_VARANASI_WOMEN = "/lab-test/varanasi#pregnancy-women-health-tests";
const LAB_VARANASI_REPORTS = "/lab-test/varanasi#reports-turnaround-time";
const LAB_VARANASI_BOOK = "/lab-test/varanasi#book";

const BLOG_LAB_VARANASI = "/blogs/lab-test/varanasi";
const BLOG_LAB_VARANASI_FASTING = "/blogs/lab-test/varanasi#fasting-aur-taiyari";
const BLOG_LAB_VARANASI_REPORT = "/blogs/lab-test/varanasi#report-kaise-padhein";
const BLOG_LAB_VARANASI_FEVER = "/blogs/lab-test/varanasi#bukhar-me-test-ka-din";

const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_DEORIA = "/lab-test/deoria";
const MEDICINE_DEORIA = "/medicine-delivery/deoria";
const CONTACT = "/contact";

export const fullBodyCheckupVaranasi = {
  category: "full-body-checkup",
  city: "varanasi",

  /* 43 characters. The root layout appends " | MedicoBharat" (template in
     src/app/layout.js), so Google renders 58 — inside the ~60 it will show.
     Primary keyword first, and the half that survives truncation is still
     "Varanasi Me Full Body Checkup". */
  title: "Varanasi Me Full Body Checkup — Kya Karayein",

  /* ~156 characters, so it renders whole on desktop and on a phone. Hinglish,
     because the page and the searcher both are — with the English terms that
     have to match kept intact: full body checkup, package, parameter. */
  description:
    "Varanasi me full body checkup me kaun se test hone chahiye, sasta package me kya chhoot jaata hai, aur umar ke hisaab se kaun sa package sahi hai — poori guide.",

  /* Ordered strongest first. This array is the checklist the headings, tables
     and FAQs below were written against — every term here appears in the
     visible copy. A keyword that lives only in this array is the kind that gets
     a page filtered instead of ranked. */
  keywords: [
    // Primary — the commercial-informational cluster this post is built to win
    "full body checkup in Varanasi",
    "Varanasi me full body checkup",
    "full body health checkup Varanasi",
    "full body checkup me kaun se test hote hain",
    "full body checkup me kitne parameter hote hain",
    "best full body checkup package Varanasi",
    "whole body checkup Varanasi",
    "health checkup package Varanasi",

    // The decisions the article actually helps a reader make
    "sasta full body checkup sahi hai ya nahi",
    "basic vs advanced health package",
    "full body checkup kitne saal me ek baar",
    "30 ki umar me kaun se test karayein",
    "full body checkup me thyroid hai ya nahi",
    "full body checkup report kaise padhein",
    "full body checkup se pehle fasting",
    "pre employment medical checkup Varanasi",
    "family health checkup package",
    "senior citizen health checkup Varanasi",
    "women health checkup package Varanasi",

    // Local + service, kept few — the service page owns these
    "full body checkup at home Varanasi",
    "home sample collection Varanasi",
    "lab test in Varanasi",
    "pathology lab in Varanasi",
    "diagnostic centre in Varanasi",

    // Devanagari — same intents, the script a large share of Purvanchal types
    "वाराणसी में फुल बॉडी चेकअप",
    "फुल बॉडी चेकअप में कौन से टेस्ट होते हैं",
    "फुल बॉडी चेकअप कितने साल में कराएं",
    "घर से सैंपल कलेक्शन वाराणसी",

    // Location-free — Google supplies the city from the searcher's position
    "full body checkup near me",
    "health checkup package near me",
    "MedicoBharat Varanasi",
  ],

  canonical: canonicalFor("full-body-checkup", "varanasi"),
  robots: INDEXABLE,
  author: BLOG_AUTHOR,
  publisher: BLOG_PUBLISHER,

  publishedAt: "2026-08-04",
  updatedAt: "2026-08-04",

  /* Stated rather than computed: a number that changes every time a sentence
     is edited is a number nobody maintains. Update it when the article grows
     a section. */
  readingMinutes: 9,

  /* No `hero` on purpose — see the images note at the top of this file. The
     masthead renders as a single full-width text column without it, and the
     share card is generated, so nothing downstream needs a file. */

  /** The skimmer's version of the whole article. */
  takeaways: [
    "Parameter ki ginti mat dekhiye, system giniye. Blood, sugar, heart, liver aur kidney — paanchon cover hone chahiye, warna wo full body checkup nahi hai.",
    "Ek CBC hi 18 se 22 parameter ginta hai. \"80+ parameters\" wale package me asal me 8 se 10 test hi ho sakte hain.",
    "Package price dekh kar nahi, apni umar aur ghar ki history dekh kar chuniye — 45 ke baad urine microalbumin aur HbA1c ke bina panel adhoora hai.",
    "Ek baseline report sambhaal kar rakhiye. Ek akela number sirf number hai; teen saal ka trend hi wo cheez hai jis par doctor action leta hai.",
  ],

  sections: [
    {
      id: "full-body-checkup-varanasi-kya-hai",
      heading: "Varanasi Me Full Body Checkup: Ginti Nahi, System Dekhiye",
      blocks: [
        "Varanasi me full body checkup ke offer ki kami nahi hai. Lanka, Sunderpur, Bhelupur, Sigra aur Cantt ke collection points par lage board, WhatsApp par ghoomte package, aur \"80+ parameters\" likhe hue pamphlet — sab ek hi baat par competition kar rahe hain: kaun kam paise me zyada parameter de raha hai. Aur yahi wo jagah hai jahan zyadatar log galat package khareed lete hain.",
        "Kyunki parameter ki ginti se ye pata hi nahi chalta ki aapke sharir ke kitne hisse actually check huye. Ek accha checkup wo hai jismein paanch system cover hote hain — khoon, sugar, heart ka risk, liver aur kidney — chahe uski ginti 55 ho. Ek bekaar checkup wo hai jismein 90 parameter hain lekin unme se 40 ek hi test ke sub-parameter hain, aur thyroid ya vitamin usme hai hi nahi.",
        [
          "Is guide me wahi likha hai: package me kya-kya hona chahiye, sasta package me kya chhoot jaata hai, kis umar me kaun sa level lena chahiye, aur report aane ke baad usme sabse pehle kya dekhna hai. Booking, poora test menu aur rate — wo sab service page par hai: ",
          { text: "Varanasi me lab test aur free home sample collection", href: LAB_VARANASI },
          ".",
        ],
      ],
    },

    {
      id: "package-me-kya-hona-chahiye",
      heading: "Full Body Checkup Me Kaun Se Test Hone Chahiye",
      lead: "Paanch system minimum, do system bonus. Isse kam kuch bhi ho to wo screening hai, full body checkup nahi.",
      blocks: [
        {
          table: {
            caption: "Package ka minimum — system ke hisaab se",
            head: ["System", "Zaroori test", "Ye kya pakadta hai"],
            rows: [
              [
                "Khoon",
                "CBC + ESR",
                "Anaemia, infection, platelet ki gadbadi, chhupi hui sujan",
              ],
              [
                "Sugar",
                "Fasting Blood Sugar + HbA1c",
                "Diabetes, aur pichhle 2–3 mahine ka asli control",
              ],
              [
                "Heart risk",
                "Complete Lipid Profile",
                "Cholesterol, triglycerides, LDL/HDL ratio",
              ],
              [
                "Liver",
                "LFT — albumin aur globulin ke saath",
                "Fatty liver, hepatitis ka asar, lambi dawa ka side effect",
              ],
              [
                "Kidney",
                "KFT (urea, creatinine, uric acid, electrolytes) + Urine Routine",
                "Kidney par pehla asar, infection, peshab me protein",
              ],
              [
                "Thyroid (bonus, lekin lena chahiye)",
                "Thyroid Profile — kam se kam TSH",
                "Thakan, wazan, baal jhadna, periods ki gadbadi",
              ],
              [
                "Vitamin (bonus, lekin lena chahiye)",
                "Vitamin D + Vitamin B12",
                "Haddi-jodon ka dard, jhunjhuni, hamesha ki kamzori",
              ],
            ],
          },
        },
        [
          "In saat me se har ek kis shikayat par sabse zyada kaam aata hai, wo ",
          { text: "Varanasi me sabse zyada book hone wale blood test", href: LAB_VARANASI_POPULAR },
          " wale section me detail me likha hai. Yahan sirf itna samajhna kaafi hai: koi bhi ek system chhoot gaya to package ka matlab hi adhoora ho jaata hai — kyunki jo cheez check hi nahi hui, wo \"normal\" nahi hai, wo bas unknown hai.",
        ],
        {
          note: {
            tone: "info",
            title: "Ek hi sample me sab kyun",
            text: "Alag-alag din alag-alag test karane par saare number alag date ke ho jaate hain, aur unhe aapas me padha nahi ja sakta. Ek hi sample ka panel doctor ko poori tasveer ek saath deta hai — aur sui bhi ek hi baar lagti hai.",
          },
        },
      ],
    },

    {
      id: "parameter-ginti-ka-sach",
      heading: "\"80+ Parameters\" Ka Matlab Kya Hota Hai",
      lead: "Ye article ki sabse kaam ki baat hai — aur wahi jo koi pamphlet nahi likhta.",
      blocks: [
        "Parameter aur test do alag cheezein hain. Test ek jaanch hai; parameter us jaanch se nikalne wala ek number. Ek CBC hi machine se 18 se 22 number nikalta hai — haemoglobin, RBC, WBC, platelet, MCV, MCH, MCHC, differential count, aur aage. Iska matlab ye hua ki sirf CBC, lipid profile aur LFT jodne se hi ginti 40 paar kar jaati hai, aur poster par \"40+ parameters\" chhap jaata hai — jabki asal me sirf teen test huye hain.",
        {
          table: {
            caption: "Package par likha hua, aur uska asli matlab",
            head: ["Package me likha", "Asli baat"],
            rows: [
              [
                "\"80+ parameters\"",
                "Ginti sub-parameter ki hai. 80 ka matlab 8 se 10 test bhi ho sakta hai — poochhiye TEST kitne hain.",
              ],
              [
                "\"Complete Lipid Profile\"",
                "Total, HDL, LDL, VLDL, triglycerides aur 2 ratio — 7 parameter, lekin ek hi test.",
              ],
              [
                "\"Liver Function Test\"",
                "Kabhi-kabhi sirf bilirubin, SGOT aur SGPT. Albumin, globulin, A/G ratio aur GGT chhoot jaate hain — aur asli jaankari unhi me hoti hai.",
              ],
              [
                "\"Thyroid included\"",
                "Aksar sirf TSH. T3 aur T4 alag charge par jud'te hain.",
              ],
              [
                "\"Kidney Profile\"",
                "Urea aur creatinine to rehte hain; uric acid, electrolytes aur urine routine aksar nahi.",
              ],
              [
                "\"Vitamin Profile\"",
                "Kabhi sirf Vitamin D. B12 alag test hai — aur veg gharon me wahi zyada zaroori hai.",
              ],
              [
                "\"Diabetes Screening\"",
                "Sirf fasting sugar ho sakta hai. HbA1c ke bina 3 mahine ka control pata nahi chalta.",
              ],
            ],
          },
        },
        {
          note: {
            tone: "warn",
            title: "Kharidne se pehle ek hi sawaal",
            text: "Parameter ki ginti mat poochhiye — TEST ki list maangiye, likhit me. Jis package me test ke naam nahi bataye jaa rahe, sirf ginti batayi jaa rahi hai, wahan aksar HbA1c, B12, thyroid ya urine routine me se koi na koi gayab hota hai.",
          },
        },
        [
          "Rate ki poori list ek hi jagah rakhi gayi hai taaki wo kabhi purani na pade aur teen pages par alag-alag na dikhe: ",
          { text: "Varanasi me lab test aur package ka price range", href: LAB_VARANASI_PRICE },
          ". Wahan basic, advanced aur comprehensive — teenon ka indicative range hai.",
        ],
      ],
    },

    {
      id: "umar-ke-hisaab-se-package",
      heading: "Kis Umar Me Kaun Sa Package",
      lead: "Package price dekh kar nahi, apni umar aur ghar ki history dekh kar chuniye.",
      blocks: [
        {
          table: {
            caption: "Umar ke hisaab se package level",
            head: ["Umar", "Package level", "Isme ye zaroor hona chahiye"],
            rows: [
              [
                "20–30",
                "Basic (45–60 parameter)",
                "CBC, Fasting Sugar, TSH, Vitamin D, LFT — saal ka baseline banane ke liye",
              ],
              [
                "30–45",
                "Advanced (70–85 parameter)",
                "Upar wala + HbA1c, complete lipid profile, KFT, Vitamin B12",
              ],
              [
                "45–60",
                "Comprehensive (90+ parameter)",
                "Upar wala + Urine Microalbumin, electrolytes, iron studies/ferritin",
              ],
              [
                "60+",
                "Comprehensive + add-on",
                "Upar wala + calcium, har baar electrolytes; purushon me PSA doctor ki salah par",
              ],
            ],
          },
        },
        "Ghar me diabetes ya heart disease ki history hai to apni umar se ek level upar wala package lijiye. Family history koi formality nahi hai — mummy-papa ya bhai-behen me kisi ko diabetes hai to aapka risk seedha kai guna badh jaata hai, aur ye wo ek jaankari hai jo kisi bhi test se pehle package chunne ka faisla badal deti hai.",
        [
          "45 ke baad Urine Microalbumin ko chhodna sabse mehnga shortcut hai. Yahi sabse pehla ishaara deta hai ki diabetes ya BP kidney par asar daalna shuru kar chuka hai — creatinine badhne se saal-do saal pehle. Aur yahi test packages me sabse zyada chhoota hai. ",
          { text: "Diabetes, thyroid aur heart risk screening ka poora schedule yahan hai", href: LAB_VARANASI_DIABETES },
          ".",
        ],
        {
          note: {
            tone: "info",
            title: "30 se kam umar me bhi ek baar",
            text: "20 se 30 ki umar me bimari nikalne ka chance kam hai — lekin baseline banane ka yahi sahi waqt hai. Aaj ka normal number tab kaam aata hai jab paanch saal baad koi value badalti hai aur ye tay karna hota hai ki wo hamesha se aisi thi ya ab hui hai.",
          },
        },
      ],
    },

    {
      id: "kis-ko-kaunsa-add-on",
      heading: "Apne Hisaab Se Package Me Kya Jodein",
      lead: "Ek hi package sab par fit nahi baithta. Ye rahe wo add-on jo aam taur par sabse zyada kaam aate hain.",
      blocks: [
        {
          table: {
            caption: "Add-on — kis ke liye kya",
            head: ["Aap kaun hain", "Package me ye jodiye", "Kyun"],
            rows: [
              [
                "Shuddh shakahari parivaar",
                "Vitamin B12",
                "B12 mukhya roop se animal source se milta hai — Varanasi ke veg gharon me kami bahut aam hai",
              ],
              [
                "Din bhar desk ya indoor kaam",
                "Vitamin D",
                "Dhoop kam milti hai; haddi-jodon ka dard aur thakan aksar yahin se aati hai",
              ],
              [
                "Ghar me diabetes ki history",
                "HbA1c + Urine Microalbumin",
                "Sugar ka average aur kidney par pehla asar — dono ek saath",
              ],
              [
                "Ghar me heart disease ki history",
                "Complete Lipid Profile (sirf total cholesterol nahi)",
                "Risk LDL, HDL aur triglycerides ke ratio se pata chalta hai, akele number se nahi",
              ],
              [
                "Roz 3 se zyada dawa lene wale",
                "LFT + KFT har 6 mahine",
                "Lambe samay ki dawa liver aur kidney par asar daalti hai — chup-chaap",
              ],
              [
                "Irregular periods, acne, conceive me dikkat",
                "TSH, prolactin, fasting insulin (cycle ke din par)",
                "PCOS panel cycle ke din par depend karta hai — gynaecologist se din pooch lijiye",
              ],
              [
                "Pregnancy plan kar rahi mahilayein",
                "TSH, CBC, Ferritin, Blood Group + Rh",
                "Anaemia aur thyroid dono conceive karne se pehle theek hone chahiye",
              ],
              [
                "Bujurg maa-baap",
                "Vitamin B12, calcium, electrolytes, urine routine",
                "Kamzori aur bhoolne ki shikayat me B12 aur electrolytes sabse pehle dekhe jaate hain",
              ],
            ],
          },
        },
        [
          "Mahilaon ke liye pregnancy, PCOS aur hormone ke panel alag tarah se bante hain — unme cycle ka din aur trimester dono maayne rakhte hain, isliye unhe general package me thonsna theek nahi hota. ",
          { text: "Pregnancy aur women's health tests ka alag section yahan hai", href: LAB_VARANASI_WOMEN },
          ".",
        ],
      ],
    },

    {
      id: "checkup-se-pehle-taiyari",
      heading: "Checkup Se Pehle: Sirf Teen Cheezein Yaad Rakhiye",
      blocks: [
        {
          list: [
            "Zyadatar full body package me 10 se 12 ghante ki fasting chahiye, kyunki usme fasting sugar aur lipid profile dono hote hain. Raat ka khaana 9 baje tak khatam kijiye aur subah 7 se 9 ka slot lijiye.",
            "Saada paani peete rahiye — ye allowed hi nahi, zaroori hai. Paani ki kami haemoglobin, urea aur creatinine ko jhoothe taur par badha deti hai aur poora package shaq ke ghere me aa jaata hai.",
            "Thyroid ki goli blood nikalne ke BAAD lijiye, aur biotin ya multivitamin supplement 48 se 72 ghante pehle band kar dijiye — biotin hormone assay me interfere karta hai.",
          ],
        },
        [
          "Sharaab, heavy gym, kaun se test me fasting chahiye hi nahi, aur baaki dawaiyon ka niyam — ye sab ek jagah likha hai: ",
          { text: "blood test se pehle fasting aur taiyari ki poori guide", href: BLOG_LAB_VARANASI_FASTING },
          ". Ek biscuit bhi poore fasting panel ko kharab kar deta hai, isliye ye padh lena ek baar ka kaam hai.",
        ],
      ],
    },

    {
      id: "family-package-aur-booking",
      heading: "Ghar Ke Chaar Log Ek Saath: Family Checkup Ka Sahi Tarika",
      blocks: [
        "Family checkup ka sabse bada fayda paise ka nahi, timing ka hai. Jab ghar ke chaar log ek hi subah, ek hi slot me sample dete hain, to chaaron report ek hi date ki hoti hain — aur doctor ek hi baithak me poore parivaar ka pattern dekh leta hai. Alag-alag hafton me karaya gaya checkup yahi cheez kho deta hai.",
        {
          list: [
            "Sabka package alag chuniye, slot ek rakhiye — 28 saal ke bete ko basic chahiye, 58 ke pitaji ko comprehensive.",
            "Address landmark ke saath likhiye. Purane sheher me — Chowk, Godowlia aur ghaton ke aas-paas — address se zyada landmark kaam aata hai.",
            "Ghar me koi bujurg hai, bed-rest par hai, diabetic hai jinki vein patli ho gayi hai, ya operation ke baad recovery kar raha hai — booking me likh dijiye, taaki experienced phlebotomist bheja ja sake.",
            "Doctor ka parcha ho to upload kar dijiye, taaki wahi panel process ho jo likha gaya tha — \"Thyroid Profile Total\" aur \"Free\" alag test hain aur naam milte-julte hone ki wajah se yahi sabse zyada galat book hota hai.",
          ],
        },
        [
          "Poore Varanasi me collection free hai — Lanka, Sunderpur, Bhelupur, Sigra, Cantt, Sarnath, DLW, Ramnagar se le kar Ring Road ki nayi colonies tak. Kaun se ilaake cover hain aur tangg galiyon me collection kaise hoti hai, wo ",
          { text: "home sample collection wale section", href: LAB_VARANASI_HOME },
          " me hai. Slot lene ke liye ",
          { text: "booking form yahan hai", href: LAB_VARANASI_BOOK },
          ".",
        ],
      ],
    },

    {
      id: "report-me-kya-dekhein",
      heading: "Report Aa Gayi — Package Ki Report Me Sabse Pehle Kya Dekhein",
      lead: "60 number ek saath aayen to nazar kahin bhi ja sakti hai. Ye rahi tarteeb.",
      blocks: [
        {
          list: [
            "Haemoglobin — kam nikle to wahin mat rukiye. Iron ki goli haemoglobin badha degi, lekin asli wajah B12 ki kami thi to wo waise hi chalti rahegi.",
            "HbA1c — ek number me pichhle teen mahine. Fasting sugar normal aane ke bawajood HbA1c badha ho sakta hai.",
            "Creatinine ke saath urine routine — akela creatinine adhoora hai; peshab me protein ya pus cell isse pehle dikh jaate hain.",
            "Triglycerides aur HDL — total cholesterol \"normal\" hone par bhi ye dono risk bata dete hain.",
            "TSH — thoda sa badha hua TSH normal T3-T4 ke saath bahut aam hai aur aksar sirf monitoring maangta hai.",
            "Vitamin D aur B12 — inki kami se aane wali thakan ko log mahino mausam samajhte rehte hain.",
          ],
        },
        "Do niyam har number par lagte hain. Ek: report ke saath chhapi reference range padhiye, internet ke chart se mat milaiye — range method, umar aur ling ke hisaab se badalti hai. Do: High ya Low ka flag diagnosis nahi, doctor se milne ka ishaara hai.",
        {
          note: {
            tone: "warn",
            title: "Ye result appointment ka intezaar nahi maangte",
            text: "Bahut zyada blood sugar ke saath ulti ya susti, khatarnak had tak kam haemoglobin, tezi se girta platelet count, ya bahut badha creatinine ke saath peshab ka kam hona — inme usi din doctor chahiye. Tabiyat kharab lag rahi ho to kisi call ka intezaar mat kijiye.",
          },
        },
        [
          "Har flag ka matlab kya hota hai aur kis number par ghabrana chahiye — ye ",
          { text: "report kaise padhein wale section", href: BLOG_LAB_VARANASI_REPORT },
          " me detail me likha hai. Package kitne ghante me aata hai, culture me itna time kyun lagta hai — wo ",
          { text: "report aur turnaround time", href: LAB_VARANASI_REPORTS },
          " me hai.",
        ],
      ],
    },

    {
      id: "kitne-saal-me-ek-baar",
      heading: "Full Body Checkup Kitne Saal Me Ek Baar",
      blocks: [
        {
          table: {
            caption: "Dohrane ka schedule",
            head: ["Kaun", "Kitni baar"],
            rows: [
              [
                "30 se kam, koi shikayat nahi",
                "Har 2 saal me ek baar — lekin pehla baseline abhi",
              ],
              ["30–45, koi shikayat nahi", "Saal me ek baar"],
              [
                "45+",
                "Saal me ek baar poora panel; BP aur sugar saal me do baar",
              ],
              [
                "Diabetes wale",
                "HbA1c har 3 mahine; poora panel saal me ek baar urine microalbumin ke saath",
              ],
              [
                "Thyroid ki dawa par",
                "Dose badalne ke baad 6–8 hafte me TSH, phir har 6–12 mahine me",
              ],
              [
                "Koi nayi shikayat",
                "Schedule ka intezaar mat kijiye — shikayat ke hisaab se test karayein",
              ],
            ],
          },
        },
        [
          "Aakhri wali line sabse zaroori hai. Saal ka checkup screening hai — bina shikayat ke chalne wali jaanch. Teen din se bukhar hai, aankhon me peelapan hai, ya paon par sujan hai, to saal ke package ka intezaar karna galat hai; us waqt ",
          { text: "shikayat aur bukhar ke din ke hisaab se test", href: BLOG_LAB_VARANASI_FEVER },
          " karana chahiye. Dengue NS1 sirf pehle 5 din chalta hai — wo intezaar nahi karta.",
        ],
        {
          note: {
            tone: "info",
            title: "Report ek folder me rakhiye",
            text: "Har report scan kar ke phone me rakh lijiye. Ek akela HbA1c 6.4 ek number hai; teen saal ka 5.8 → 6.1 → 6.4 ek pattern hai — aur doctor pattern par action leta hai, number par nahi.",
          },
        },
      ],
    },

    {
      id: "pre-employment-aur-doosre-checkup",
      heading: "Job, Shaadi Aur Insurance Wale Checkup Alag Hote Hain",
      blocks: [
        "Har checkup ek jaisa nahi hota, aur teen tarah ke checkup ke liye log aksar galat package le lete hain. Pre-employment ya job ke liye hone wale checkup me aam taur par CBC, blood group, blood sugar, LFT, KFT, urine routine, HBsAg, HIV aur kabhi-kabhi chest ka check maanga jaata hai — lekin asli list company ki hoti hai, isliye unse likhit me maang lijiye aur usi hisaab se book kijiye.",
        "Shaadi se pehle ya conceive karne se pehle wale panel me thalassemia screen, blood group aur Rh typing, TSH, CBC, HIV, HBsAg aur VDRL ka rehna aam hai. Rh-negative mahilaon ke liye blood group report kabhi late nahi honi chahiye. Aur operation se pehle wale panel me clotting time aur infection screening jud'te hain, jo saal ke routine package me nahi hote.",
        [
          "In teenon me ek baat common hai: list doctor ya sansthan deta hai, aur usme se ek bhi test chhootne par kaam rukta hai. Parcha ya list booking ke saath bhej dijiye; confusion ho to ",
          { text: "humein call kar lijiye", href: CONTACT },
          " — sahi panel batana isi kaam ka hissa hai.",
        ],
      ],
    },

    {
      id: "varanasi-ke-baahar-se",
      heading: "Varanasi Ke Baahar Se Aa Rahe Hain To",
      blocks: [
        "Chandauli, Jaunpur, Ghazipur, Mirzapur, Bhadohi, Ballia aur Azamgarh se roz log Varanasi aate hain, kyunki specialist doctor aur bade diagnostic setup yahin hain. Lekin full body checkup ke liye safar ki zaroorat nahi hai. Package ke saare test — CBC, sugar, lipid, LFT, KFT, thyroid, vitamin, urine — sample par hote hain, aur sample aapke apne sheher me liya ja sakta hai. Safar tab banta hai jab baat MRI, CT scan, endoscopy ya kisi super-speciality OPD ki ho.",
        [
          "Aur agar trip specialist ke liye hai, to checkup us trip se PEHLE apne ghar par karwa lijiye. Report haath me le kar jaayenge to ek hi visit me baat ban jaayegi; warna doctor test likh kar agli date de dega aur ek poora din dobara lagega. Aas-paas ke logon ke liye yahi suvidha wahin hai — ",
          { text: "Gorakhpur me lab test", href: LAB_GORAKHPUR },
          " aur ",
          { text: "Deoria me lab test aur home sample collection", href: LAB_DEORIA },
          ".",
        ],
        [
          "Checkup ke baad ka aakhri kadam parche par likhi dawa hai. Test aur dawa ke beech ka gap hi wo jagah hai jahan ilaaj rukta hai, isliye ",
          { text: "MedicoBharat medicine delivery", href: MEDICINE_DEORIA },
          " bhi wahi platform karta hai — parcha bhejiye, dawa ghar par.",
        ],
      ],
    },

    {
      id: "package-chunne-ki-checklist",
      heading: "Package Kharidne Se Pehle Chhoti Si Checklist",
      blocks: [
        {
          list: [
            "Parameter ki ginti nahi, TEST ki list maangiye — likhit me.",
            "Paanch system check kijiye: khoon, sugar, heart, liver, kidney. Thyroid aur vitamin bhi ho to aur behtar.",
            "HbA1c, Vitamin B12 aur Urine Routine — teenon package me hain ya nahi, ye alag se poochhiye. Yahi sabse zyada gayab rehte hain.",
            "45 ke baad Urine Microalbumin hai ya nahi, ye confirm kijiye.",
            "Home collection ka charge sach me nahi hai, ya bill ke aakhir me jud jaayega.",
            "Report par test ka method (jaise CLIA ya ECLIA) chhapta hai ya nahi — method chhapna is baat ka sabse saaf sanket hai ki lab ko apne number par bharosa hai.",
            "Follow-up ke liye agle saal usi lab me jaana hai — alag analyser ki reference range alag hoti hai.",
          ],
        },
        [
          "Jo package ₹300 sasta pada lekin usme HbA1c nahi tha aur wo alag se karana pada, wo sasta nahi tha. ",
          { text: "Varanasi me full body checkup ke package aur unme kya-kya hota hai", href: LAB_VARANASI_FULLBODY },
          " — wo service page par hai, aur booking bhi wahin se hoti hai.",
        ],
      ],
    },
  ],

  /* Questions a reader types before paying for a package — and deliberately
     NOT the ones already answered on the service page or in the sibling
     article (fasting ke ghante, dengue ka din, report ke flag). Two FAQ blocks
     answering one question on one domain compete for one rich result. */
  faqs: [
    {
      question: "Varanasi me full body checkup me kitne parameter hone chahiye?",
      answer:
        "Ginti se zyada zaroori ye hai ki kaun se test hain. Ek accha basic package aam taur par 45 se 60 parameter ka hota hai, advanced 70 se 85 ka aur comprehensive 90 se upar ka — lekin ek CBC hi 18 se 22 parameter ginta hai, isliye \"80+ parameters\" ka matlab sirf 8 se 10 test bhi ho sakta hai. Kharidne se pehle parameter ki ginti nahi, TEST ki list maangiye, aur dekhiye ki blood, sugar, heart, liver aur kidney — paanchon system cover ho rahe hain ya nahi.",
    },
    {
      question: "Sasta full body checkup package kaam ka hota hai ya nahi?",
      answer:
        "Kaam ka tab hai jab usme paanchon system hon. Sasta package aksar teen jagah kaatta hai: HbA1c hata kar sirf fasting sugar rakhta hai, LFT me albumin aur globulin nahi deta, aur Vitamin B12 tatha Urine Routine chhod deta hai. Teenon hi wo test hain jo asli jaankari dete hain. Jo package ₹300 sasta pada lekin usme HbA1c nahi tha aur wo alag se karana pada, wo sasta nahi tha.",
    },
    {
      question: "Full body checkup kitne saal me ek baar karana chahiye?",
      answer:
        "30 saal se kam umar me aur koi shikayat na ho to har do saal me ek baar kaafi hai, lekin pehla baseline aaj hi bana lena chahiye. 30 se 45 ke beech saal me ek baar, aur 45 ke baad saal me ek baar poora panel ke saath BP aur sugar saal me do baar. Jinhe diabetes hai unhe HbA1c har teen mahine me karana chahiye. Koi nayi shikayat ho — bukhar, sujan, peelapan — to saal ke checkup ka intezaar mat kijiye, us shikayat ka test turant karayein.",
    },
    {
      question: "Package me thyroid me sirf TSH hai — T3 aur T4 bhi karana chahiye?",
      answer:
        "Pehli baar screening ke liye akela TSH aam taur par kaafi hota hai; TSH normal aane par zyadatar logon ko aage kuch nahi chahiye. Lekin TSH badha ya ghata hua aaye, ya pehle se thyroxine chal rahi ho, ya baal jhadna, wazan ka badalna aur periods ki gadbadi jaisi shikayat ho, to poora Thyroid Profile (TSH ke saath T3 aur T4) karana chahiye. Dose badalne ke baad TSH 6 se 8 hafte me dohrana hota hai.",
    },
    {
      question: "Full body checkup ghar se sample de kar ho sakta hai?",
      answer:
        "Haan. Poore Varanasi me free home sample collection hai — Lanka, Sunderpur, Bhelupur, Sigra, Cantt, Sarnath, DLW, Ramnagar se le kar Ring Road ki nayi colonies tak. Trained phlebotomist ID card ke saath aata hai, poori visit lagbhag 10 minute ki hoti hai aur report 24 ghante me PDF me aa jaati hai. Purane sheher ki tangg galiyon me collection two-wheeler se hoti hai, isliye booking me landmark zaroor likhiye.",
    },
    {
      question: "Ghar ke chaar log ek saath full body checkup kara sakte hain?",
      answer:
        "Haan, aur karana bhi ek saath hi chahiye. Sabka package alag ho sakta hai — 28 saal ke bete ko basic, 58 ke pitaji ko comprehensive — lekin slot ek hi rakhiye. Isse chaaron report ek hi date ki hoti hain aur doctor ek hi baithak me poore parivaar ka pattern dekh leta hai. Ek visit, ek trip, aur bujurg ya bed-rest wale sadasya ke liye booking me pehle se likh dijiye taaki experienced phlebotomist bheja ja sake.",
    },
    {
      question: "Job ke liye pre-employment checkup me kya-kya hota hai?",
      answer:
        "Aam taur par CBC, blood group, blood sugar, LFT, KFT, urine routine, HBsAg, HIV aur kabhi-kabhi chest ka check. Lekin asli list company ki hoti hai aur har company ki alag hoti hai, isliye unse likhit me list maang lijiye aur usi hisaab se book kijiye — saal wala routine package aur pre-employment panel ek cheez nahi hain. Shaadi se pehle ya conceive karne se pehle wale panel me thalassemia screen, blood group aur Rh typing, TSH aur VDRL jud'te hain.",
    },
    {
      question: "Full body checkup ki report kitne din me aa jaati hai?",
      answer:
        "Package ke zyadatar test — CBC, sugar, lipid, LFT, KFT, thyroid, urine routine, vitamin aur hormone assay — lagbhag 24 ghante me report ho jaate hain. Agar package me urine ya blood culture juda hai to usme 48 se 72 ghante lagte hain, kyunki pehle organism ko ugana padta hai tabhi antibiotic sensitivity nikalti hai. Koi bhi lab culture ke liye isse jaldi ka imaandari se vaada nahi kar sakti.",
    },
    {
      question: "Checkup me sab normal aaya to bhi doctor ko dikhana chahiye?",
      answer:
        "Ek baar dikha lena behtar hai, khaas kar pehli report. Doctor wo cheez dekhta hai jo akela number nahi batata — jaise normal range ke andar rehte hue bhi HbA1c ka upari sire par hona, ya haemoglobin ka theek hona lekin ferritin ka kam hona. Aur report ek folder me sambhaal kar rakhiye: ek akela number sirf number hai, teen saal ka trend hi wo cheez hai jis par action liya jaata hai.",
    },
  ],

  /**
   * Hand-picked contextual links, rendered as a block under the article.
   *
   * The all-cities grid below it is generated from the live city lists, so this
   * block is only for what a generator cannot know: the exact sections of the
   * service page this article defers to, and the sibling guide it splits the
   * subject with.
   */
  relatedLinks: {
    heading: "Varanasi Ke Liye Aage Kya Dekhein",
    intro:
      "Is guide me package chunna aur report samajhna hai. Booking, poora test menu aur price service page par hai.",
    groups: [
      {
        title: "Varanasi Lab Test",
        links: [
          {
            href: LAB_VARANASI,
            label: "Varanasi me lab test — booking aur free home collection",
            sub: "Slot subah 6 baje se, report 24 ghante me",
          },
          {
            href: LAB_VARANASI_FULLBODY,
            label: "Varanasi me full body checkup ke package",
            sub: "Basic, advanced aur comprehensive me kya-kya hota hai",
          },
          {
            href: LAB_VARANASI_PRICE,
            label: "Lab test aur package ka price range",
            sub: "CBC, thyroid, HbA1c, full body package",
          },
          {
            href: LAB_VARANASI_DIABETES,
            label: "Diabetes, thyroid aur heart risk screening",
          },
          {
            href: LAB_VARANASI_WOMEN,
            label: "Pregnancy aur women's health tests",
          },
        ],
      },
      {
        title: "Doosri Guide",
        links: [
          {
            href: BLOG_LAB_VARANASI,
            label: "Varanasi me lab test — kaun sa test kab karayein",
            sub: "Symptom, umar aur mausam ke hisaab se",
          },
          {
            href: BLOG_LAB_VARANASI_FASTING,
            label: "Blood test se pehle fasting aur taiyari",
          },
          {
            href: BLOG_LAB_VARANASI_REPORT,
            label: "Report aa gayi — ab ise kaise padhein",
          },
        ],
      },
      {
        title: "Aas-paas Ke Sheher",
        links: [
          {
            href: LAB_GORAKHPUR,
            label: "Gorakhpur me lab test",
            sub: "OPD se pehle report taiyaar rakhne ka tarika",
          },
          {
            href: LAB_DEORIA,
            label: "Deoria me lab test",
            sub: "Gorakhpur ka safar bachane wala option",
          },
          { href: CONTACT, label: "Contact — package chunne me madad" },
        ],
      },
    ],
  },
};
