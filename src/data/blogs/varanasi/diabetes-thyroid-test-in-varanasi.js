/**
 * /blogs/diabetes-thyroid-test/varanasi — "Varanasi Me Sugar, Thyroid Aur Lipid Test"
 *
 * ── THE LANE ─────────────────────────────────────────────────────────────
 * Varanasi's set only survives together because each page answers a question
 * the others do not:
 *
 *   /lab-test/varanasi                        → "book kahan se" — form, rate, menu
 *   /blogs/lab-test/varanasi                  → "kaun sa test kab" (poori guide)
 *   /blogs/full-body-checkup/varanasi         → "package me kya hona chahiye"
 *   /blogs/pathology-lab/varanasi             → "kis lab par bharosa karun"
 *   /blogs/home-sample-collection/varanasi    → "ghar par hota kaise hai"
 *   /blogs/dengue-typhoid-test/varanasi       → bukhar — kis din kaun sa test
 *   /blogs/liver-kidney-test/varanasi         → LFT aur KFT
 *   /blogs/diabetes-thyroid-test/varanasi     → sugar, thyroid, lipid (this)
 *
 * This one is for the reader who already knows which family of tests they
 * need — sugar, thyroid or cholesterol — and is stuck on the next question:
 * fasting, PP ya HbA1c me farq kya hai, TSH ki report ke baad kya, aur dobara
 * kab. The parent guide at /blogs/lab-test/varanasi names these tests in one
 * row of a table and hands the subject over here; it does not repeat any of
 * the detail below.
 *
 * ── NO PRICES ────────────────────────────────────────────────────────────
 * "Thyroid test price in Varanasi" is one of the strongest queries this page
 * targets, and the page still states NOT ONE RATE. The section that answers it
 * explains what the price actually depends on — method, panel size, whether
 * home collection is charged extra — and links to #lab-test-price-varanasi for
 * the number. That way the rate lives in exactly one file
 * (src/data/lab/content/varanasi.js) and cannot drift across six pages, and
 * the reader still gets a real answer instead of a dead end.
 *
 * ── CLAIMS ───────────────────────────────────────────────────────────────
 * Only the five the business confirms: free home collection, a trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI
 * on collection. No NABL, no "certified", no accuracy claim, no price
 * comparison. No X-ray/ultrasound/ECG — heart risk here means lipid profile,
 * not a machine we do not have.
 *
 * ── CLINICAL CARE ────────────────────────────────────────────────────────
 * Every clinical statement here is the standard, uncontroversial one: HbA1c
 * every three months for a diabetic, TSH 6-8 weeks after a dose change,
 * thyroxine taken AFTER the sample, biotin stopped 48-72 hours before a
 * hormone assay, no alcohol 24 hours before a lipid profile. Nothing here
 * diagnoses and nothing names a target number to act on — every place a reader
 * could act on a value, the text says "doctor ko dikhaiye".
 *
 * ── IMAGES: NONE ─────────────────────────────────────────────────────────
 * /public has no photography for this subject and a stock lab photo next to a
 * paragraph about HbA1c means nothing. `hero` is optional; og:image resolves to
 * the generated card at /blogs/diabetes-thyroid-test/varanasi/og.
 */
import {
  BLOG_AUTHOR,
  BLOG_PUBLISHER,
  INDEXABLE,
  canonicalFor,
} from "../shared";

/* Link targets as constants — a route rename is one line here instead of a hunt
   through the prose. Service-page anchors come from
   src/data/lab/content/varanasi.js; rename one there and these break. */
const LAB_VARANASI = "/lab-test/varanasi";
const LAB_VARANASI_DIABETES = "/lab-test/varanasi#diabetes-thyroid-heart-screening";
const LAB_VARANASI_PRICE = "/lab-test/varanasi#lab-test-price-varanasi";
const LAB_VARANASI_PREPARE = "/lab-test/varanasi#how-to-prepare-for-blood-test";
const LAB_VARANASI_POPULAR = "/lab-test/varanasi#popular-blood-tests-varanasi";
const LAB_VARANASI_WOMEN = "/lab-test/varanasi#pregnancy-women-health-tests";
const LAB_VARANASI_BOOK = "/lab-test/varanasi#how-to-book-lab-test-varanasi";

const BLOG_LAB_VARANASI = "/blogs/lab-test/varanasi";
const BLOG_LAB_VARANASI_FASTING = "/blogs/lab-test/varanasi#fasting-aur-taiyari";
const BLOG_LAB_VARANASI_REPORT = "/blogs/lab-test/varanasi#report-kaise-padhein";
const BLOG_FULLBODY_VARANASI = "/blogs/full-body-checkup/varanasi";
const BLOG_PATHOLOGY_VARANASI = "/blogs/pathology-lab/varanasi";
const BLOG_HOME_VARANASI = "/blogs/home-sample-collection/varanasi";
const BLOG_HOME_VARANASI_FASTING =
  "/blogs/home-sample-collection/varanasi#fasting-slot-ka-ganit";
const BLOG_LIVER_KIDNEY_VARANASI = "/blogs/liver-kidney-test/varanasi";
const BLOG_DENGUE_VARANASI = "/blogs/dengue-typhoid-test/varanasi";
const BLOG_DIABETES_DEORIA = "/blogs/diabetes-thyroid-test/deoria";

const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_AZAMGARH = "/lab-test/azamgarh";
const CONTACT = "/contact";

export const diabetesThyroidVaranasi = {
  category: "diabetes-thyroid-test",
  city: "varanasi",

  /* 41 characters. The root layout appends " | MedicoBharat" (template in
     src/app/layout.js), so Google renders 56 — inside the ~60 it will show.
     City first because the search almost always carries it, then the three
     test families, which are the words a reader scans for. */
  title: "Varanasi Me Sugar, Thyroid Aur Lipid Test",

  /* ~155 characters, so it renders whole on desktop and mobile. Hinglish, with
     the English terms that must match left intact: sugar test, thyroid test,
     HbA1c, lipid profile. */
  description:
    "Varanasi me sugar test, thyroid test aur lipid profile — fasting, PP ya HbA1c kaun sa kab, TSH ki report ke baad kya, aur dobara kitne mahine me.",

  /* Ordered strongest first. Every term here appears in the visible copy; a
     keyword that lives ONLY in this array is the kind that gets a page filtered
     rather than ranked. */
  keywords: [
    "Diabetes Test in Varanasi",
    "Sugar Test in Varanasi",
    "Thyroid Test Price in Varanasi",
    "Thyroid Test in Varanasi",
    "HbA1c Test in Varanasi",
    "Blood Sugar Test at Home Varanasi",
    "Lipid Profile Test in Varanasi",
    "Cholesterol Test in Varanasi",
    "TSH Test in Varanasi",
    "Fasting Blood Sugar Test Varanasi",
    "Diabetes Test at Home in Varanasi",
    "Thyroid Test at Home Varanasi",
    "Blood Test in Varanasi",
    "Lab Test in Varanasi",
    "Pathology Lab in Varanasi",
    "Free Home Sample Collection Varanasi",
  ],

  canonical: canonicalFor("diabetes-thyroid-test", "varanasi"),
  robots: INDEXABLE,
  author: BLOG_AUTHOR,
  publisher: BLOG_PUBLISHER,

  publishedAt: "2026-09-04",
  updatedAt: "2026-09-04",

  /* Stated rather than computed: a number that changes every time a sentence is
     edited is a number nobody maintains. */
  readingMinutes: 9,

  /** The skimmer's version of the whole article. */
  takeaways: [
    "Fasting sugar, PP sugar aur HbA1c teen alag sawaal ka jawab hain — ek doosre ki jagah nahi lete.",
    "HbA1c me fasting nahi lagti, isliye jinka khaane ka samay fix nahi wo isi se shuru kar sakte hain.",
    "Thyroid ki goli sample ke BAAD lijiye, aur biotin ya multivitamin 48-72 ghante pehle band kar dijiye.",
    "Diabetic ka saal: har 3 mahine HbA1c, saal me ek baar lipid, aur saal me ek baar KFT ke saath urine microalbumin.",
  ],

  sections: [
    {
      id: "sugar-thyroid-lipid-varanasi",
      heading: "Sugar, Thyroid Aur Lipid — Teen Jaanch Jo Bina Bataye Badalti Hain",
      blocks: [
        "Ye teen test Varanasi me sabse zyada karaye jaane wale test me se hain, aur teenon ki ek hi khaasiyat hai: shuruaat me inka koi lakshan nahi hota. Sugar tab pata chalta hai jab pyaas, peshab ya thakan tang karne lage; thyroid tab, jab wazan, baal ya periods gadbadane lagein; aur cholesterol aksar tab, jab kuch bada ho chuka ho. Isliye in teenon me test lakshan ka intezaar karke nahi, samay dekhkar karaya jaata hai.",
        "Dusri baat jo sabse zyada confusion paida karti hai: sugar ka koi ek test nahi hota. Fasting sugar, post-prandial sugar aur HbA1c teen alag sawaalon ka jawab dete hain, aur teenon ki apni jagah hai. Yahi haal thyroid ka hai — sirf TSH, ya poora profile, ya free T3-T4, ye faisla parche par likha hota hai aur booking me galat chun liya jaata hai.",
        [
          "Neeche teenon ka poora hisaab hai: kaunsa test kis sawaal ka jawab hai, fasting kitni, report ke baad kya, aur dobara kab. Booking, poora menu aur rate service page par hai — ",
          {
            text: "Varanasi me diabetes, thyroid aur heart risk screening",
            href: LAB_VARANASI_DIABETES,
          },
          ".",
        ],
        {
          note: {
            title: "Ye page kisi number ka matlab nahi bata sakta",
            text: "Yahan ye likha hai ki kaunsa test kab hota hai aur usse pehle kya dhyaan rakhna hai. Report me aaya koi bhi number — sugar, TSH ya cholesterol — apne doctor ko hi dikhaiye. Ek value par dawa shuru ya band karna, aur internet ke chart se apni report milana, dono nuksaandeh hain.",
            tone: "warn",
          },
        },
      ],
    },

    {
      id: "sugar-test-fasting-pp-hba1c",
      heading: "Varanasi Me Sugar Test — Fasting, PP Ya HbA1c? Teenon Ek Cheez Nahi Hain",
      lead: "Ek hi beemari, teen alag sawaal — aur teenon ke jawab alag din ke kaam aate hain.",
      blocks: [
        "Fasting blood sugar batata hai ki raat bhar bina khaaye rehne par sharir sugar kahan rakhta hai. Post-prandial (PP) sugar batata hai ki khaane ke baad sugar kitna upar jaakar kitni der me wapas aata hai — aur bahut se logon me fasting normal hota hai jabki PP badha hua. HbA1c teesra sawaal poochta hai: pichhle do-teen mahine ka average control kaisa raha. Isme ek din ki laparwahi ya ek din ka parhez chhupta nahi.",
        {
          table: {
            caption: "Sugar ke teen test — kaunsa kis kaam ka",
            head: ["Test", "Fasting", "Kya batata hai"],
            rows: [
              [
                "Fasting Blood Sugar (FBS)",
                "10-12 ghante",
                "Khaali pet ki sugar. Screening ka sabse aam pehla test.",
              ],
              [
                "Post-Prandial (PP) Sugar",
                "Nahi — khaana shuru karne ke theek 2 ghante baad",
                "Khaane ke baad sugar kitna badhta hai. Fasting normal ho phir bhi ye badha mil sakta hai.",
              ],
              [
                "HbA1c",
                "Nahi lagti",
                "Pichhle 2-3 mahine ka average. Follow-up ka asli test yahi hai.",
              ],
              [
                "Urine Microalbumin",
                "Nahi",
                "Diabetes kidney par asar daal raha hai ya nahi — sabse pehla ishaara.",
              ],
            ],
          },
        },
        {
          note: {
            title: "PP sugar me do ghante khaane ke SHURU se ginte hain",
            text: "Sabse aam galti yahi hai: log khaana khatam karne ke baad se do ghante ginte hain. Ginti pehla nivala uthane ke waqt se shuru hoti hai. Aadha ghanta idhar-udhar hone par number kaafi badal jaata hai, aur report par shak chala jaata hai lab par.",
            tone: "info",
          },
        },
        [
          "Ghar par sample lene par PP ka slot lagana aasan hai — naashta apne samay par kijiye aur do ghante baad ka slot le lijiye. Slot ka poora ganit ",
          { text: "home collection wali guide", href: BLOG_HOME_VARANASI_FASTING },
          " me hai.",
        ],
      ],
    },

    {
      id: "diabetes-follow-up-varanasi",
      heading: "Diabetes Ka Asli Kaam Pehli Jaanch Nahi, Follow-Up Hai",
      lead: "Pehla test bata deta hai. Uske baad ka saal tay karta hai ki aage kya hoga.",
      blocks: [
        "Jinhe diabetes hai unke liye saal ka schedule seedha sa hai, aur uska sabse chhoota hua hissa kidney wala test hai. Urine microalbumin sabse pehla ishaara deta hai ki sugar kidney par asar daalna shuru kar chuka hai — us stage par, jab abhi bahut kuch kiya ja sakta hai. Yahi test log sabse zyada chhodte hain, kyunki usme koi takleef nahi hoti.",
        {
          table: {
            caption: "Diabetic ka saal — kaunsa test kitni baar",
            head: ["Test", "Kitni baar", "Kyun"],
            rows: [
              ["HbA1c", "Har 3 mahine", "Average control — dawa ka asar isi se dikhta hai."],
              ["Fasting aur PP Sugar", "Doctor ke kehne par", "Rozmarra ka control aur dose adjust."],
              ["Lipid Profile", "Saal me ek baar", "Heart risk — diabetes me ye alag se dekha jaata hai."],
              [
                "KFT ke saath Urine Microalbumin",
                "Saal me ek baar",
                "Kidney par asar ka sabse pehla ishaara.",
              ],
              ["Liver Function Test", "Saal me ek baar", "Fatty liver diabetes ke saath aam hai."],
              ["Vitamin B12", "Doctor ke kehne par", "Lambi metformin par B12 kam ho sakta hai."],
            ],
          },
        },
        [
          "Jinhe diabetes nahi hai lekin ghar me history hai, wazan zyada hai, ya pregnancy me sugar badha tha — unke liye saal me ek baar fasting sugar aur HbA1c kaafi hai. Kidney aur liver ke test alag se ",
          {
            text: "LFT aur KFT wali guide",
            href: BLOG_LIVER_KIDNEY_VARANASI,
          },
          " me samjhaye gaye hain.",
        ],
      ],
    },

    {
      id: "thyroid-test-varanasi-kaunsa",
      heading: "Thyroid Test In Varanasi — Sirf TSH, Ya Poora Profile?",
      lead: "Booking me sabse zyada galti isi naam par hoti hai.",
      blocks: [
        "Thyroid ke naam se kai test bikte hain aur unke naam itne milte-julte hain ki galat book ho jaana aam baat hai. \"Thyroid Profile\" aam taur par TSH, T3 aur T4 hota hai. \"Free Thyroid Profile\" me FT3 aur FT4 hote hain — ye alag test hai, alag rate hai, aur zyadatar logon ko iski zaroorat nahi hoti. Screening ke liye akela TSH kaafi maana jaata hai; poora profile tab, jab doctor likhe.",
        {
          list: [
            "Parche par jo poora naam likha hai, wahi booking me daaliye — \"Thyroid Profile Total\" aur \"Free\" alag test hain.",
            "Thyroid me fasting nahi lagti. Subah ka sample thoda behtar maana jaata hai kyunki TSH din bhar me thoda ghatta-badhta hai, lekin ye zaroori shart nahi hai.",
            "Thyroxine (thyroid ki goli) sample lene ke BAAD lijiye. Pehle lene par T4 jhootha hi zyada dikhega aur dose galat adjust ho sakta hai.",
            "Biotin ya multivitamin supplement kisi bhi hormone test se 48 se 72 ghante pehle band kar dijiye — biotin assay me interfere karta hai.",
            "Follow-up hamesha ek hi lab me karayein. Ek lab me TSH 4.5 aur doosri me 4.1 aane ka matlab ye nahi ki thyroid badal gaya.",
          ],
        },
        [
          "35 ke baad mahilayein, jinke parivaar me history hai, pregnancy plan kar rahi ya pehli trimester wali mahilayein, aur jinko lagatar thakan, baal jhadna ya periods ki gadbadi hai — sabko ek baar TSH karana chahiye. Pregnancy ka poora panel ",
          { text: "service page par", href: LAB_VARANASI_WOMEN },
          " hai.",
        ],
      ],
    },

    {
      id: "thyroid-test-price-varanasi",
      heading: "Thyroid Test Price In Varanasi — Daam Kis Baat Par Tay Hota Hai",
      lead: "Number ek jagah rakha hai. Yahan ye samajhna hai ki wo number kis wajah se badalta hai.",
      blocks: [
        "\"Thyroid test kitne ka hai\" ka jawab ek number nahi ho sakta, kyunki thyroid ke naam se teen alag cheezein bikti hain. Rate teen baaton par badalta hai, aur teenon aap khud check kar sakte hain:",
        {
          list: [
            "Panel me kitne test hain — akela TSH, TSH+T3+T4 wala profile, aur FT3+FT4 wala free profile teen alag daam hain.",
            "Method kaunsa hai — hormone ke liye CLIA aur ECLIA purane ELISA se mehnge padte hain lekin unhi ko zyada bharosemand maana jaata hai. Report par method likha hota hai; wahi dekhiye.",
            "Home collection ka charge jud raha hai ya nahi — humare yahan nahi judta, lekin poochhna har jagah banta hai.",
          ],
        },
        [
          "Rate ki poori list ek hi jagah rakhi hai, taaki number sirf ek jagah maintain ho aur kabhi purana na pade: ",
          { text: "Varanasi me lab test ka price range", href: LAB_VARANASI_PRICE },
          ". Wahi page sugar, HbA1c aur lipid ka range bhi rakhta hai.",
        ],
        {
          note: {
            title: "Sabse sasta test aksar sabse mehnga padta hai",
            text: "Jo test thoda sasta hai lekin dobara doosri lab me karana pade, wo sasta nahi hai. Aur jis number ko aap mahino tak track kar rahe hain — HbA1c, TSH — usme lab badalna sabse mehngi galti hai, kyunki purani report se tulna hi bekaar ho jaati hai.",
            tone: "info",
          },
        },
      ],
    },

    {
      id: "tsh-report-ke-baad",
      heading: "TSH Ki Report Aa Gayi — Ab Kya, Aur Dobara Kab",
      blocks: [
        "Report par lagi \"High\" ya \"Low\" ki chhap diagnosis nahi hai; wo doctor ko dikhane ka ishaara hai. Thyroid me ek aur baat khaas hai: bahut se logon me TSH thoda badha hua aata hai jabki T3 aur T4 bilkul normal hote hain. Ye haalat aam hai aur aksar sirf dobara jaanch maangti hai, turant dawa nahi. Yahi faisla doctor ka hai, aapka ya internet ka nahi.",
        {
          table: {
            caption: "Thyroid — dobara test kab",
            head: ["Haalat", "Dobara kab"],
            rows: [
              ["Dawa shuru hui ya dose badla", "6 se 8 hafte baad TSH"],
              ["Dose set ho chuka hai, sab theek chal raha hai", "Har 6 se 12 mahine me ek baar"],
              ["TSH halka sa badha, T3-T4 normal", "Doctor jo kahe — aksar kuch hafte baad dobara"],
              ["Pregnancy me thyroid", "Gynaecologist ke bataye samay par — ismein niyam alag hote hain"],
              ["Koi lakshan nahi, sirf routine", "Saal me ek baar kaafi hai"],
            ],
          },
        },
        [
          "Report padhne ka poora tarika — flag ka matlab, reference range, aur kis number par usi din doctor chahiye — alag se likha hai: ",
          {
            text: "report aa gayi, ab ise kaise padhein",
            href: BLOG_LAB_VARANASI_REPORT,
          },
          ".",
        ],
      ],
    },

    {
      id: "lipid-profile-varanasi",
      heading: "Lipid Profile Test In Varanasi — Fasting Kitni Aur Kis Umar Se",
      blocks: [
        "Lipid profile me total cholesterol, LDL, HDL, triglycerides aur unka aapasi anupaat aata hai. Ye wahi test hai jo \"heart ka test\" samajh kar dhoonda jaata hai — aur yahi wo jagah hai jahan saaf keh dena zaroori hai: hum ECG, TMT ya echo nahi karte, wo machine par hote hain. Blood se heart risk ka andaza lipid profile aur sugar se lagta hai.",
        {
          list: [
            "Fasting 10 se 12 ghante — khaas kar triglycerides ke liye, jo khaane se sabse zyada hilte hain.",
            "Test se kam se kam 24 ghante pehle sharaab bilkul nahi. Ek shaam ki peene se hi triglycerides kaafi badh jaate hain.",
            "Ek din pehle bahut heavy khaana ya bahut tez gym dono se number badalta hai.",
            "Beemari, bukhar ya kisi operation ke turant baad lipid profile karane ka matlab nahi — wo dinon me apne aap gadbad rehta hai.",
            "30 ke baad saal me ek baar; ghar me heart disease ya diabetes ki history ho to isse pehle bhi, jaisa doctor kahe.",
          ],
        },
        [
          "Fasting aur taiyari ka poora niyam ",
          { text: "yahan likha hai", href: BLOG_LAB_VARANASI_FASTING },
          ", aur service page par bhi ek ",
          { text: "taiyari wala hissa", href: LAB_VARANASI_PREPARE },
          " hai.",
        ],
      ],
    },

    {
      id: "ek-nazar-me-sugar-thyroid-lipid",
      heading: "Ek Nazar Me — Kaun Sa Test, Kitni Baar, Fasting Chahiye Ya Nahi",
      lead: "Ek hi table jo poore page ka jawab de deti hai.",
      blocks: [
        {
          table: {
            caption: "Sugar, thyroid aur lipid — poora hisaab",
            head: ["Test", "Fasting", "Kitni baar", "Kis ke liye"],
            rows: [
              [
                "Fasting Blood Sugar",
                "10-12 ghante",
                "Saal me ek baar (screening)",
                "30 se upar, wazan zyada, ghar me history",
              ],
              [
                "PP Sugar",
                "Khaane ke 2 ghante baad",
                "Doctor ke kehne par",
                "Fasting normal lekin shak ho",
              ],
              [
                "HbA1c",
                "Nahi",
                "Diabetic — har 3 mahine",
                "Control dekhne ka sabse bharosemand test",
              ],
              [
                "TSH",
                "Nahi",
                "Saal me ek baar; dose badle to 6-8 hafte baad",
                "Thakan, wazan, baal, periods, pregnancy plan",
              ],
              [
                "Thyroid Profile (T3, T4, TSH)",
                "Nahi",
                "Doctor ke kehne par",
                "Jab TSH ke saath poora picture chahiye",
              ],
              [
                "Lipid Profile",
                "10-12 ghante",
                "Saal me ek baar",
                "30 ke baad, ya pehle agar history hai",
              ],
              [
                "Urine Microalbumin",
                "Nahi",
                "Diabetic — saal me ek baar",
                "Kidney par asar ka pehla ishaara",
              ],
            ],
          },
        },
        [
          "In sab ko ek hi sample me karana ho to package sasta padta hai aur ek hi baar sui lagti hai. Package me kya hona chahiye, ye ",
          { text: "full body checkup wali guide", href: BLOG_FULLBODY_VARANASI },
          " me hai.",
        ],
      ],
    },

    {
      id: "varanasi-me-ghar-se-kaise",
      heading: "Varanasi Me Ye Jaanch Ghar Se Kaise Hoti Hai",
      blocks: [
        "Sugar, thyroid aur lipid — teenon sample par hone wale test hain, isliye teenon ghar par ho jaate hain. Ismein sabse bada faayda fasting wale test me hai: sample ke turant baad naashta ho jaata hai, lab tak khaali pet jaana nahi padta.",
        {
          list: [
            "Fasting sugar aur lipid ke liye subah 6 baje ka pehla slot lijiye.",
            "HbA1c aur TSH ke liye din me kabhi bhi — inme fasting nahi lagti.",
            "PP sugar ke liye naashta apne samay par kijiye aur theek do ghante baad ka slot lijiye.",
            "Ghar ke kai log test kara rahe hain to sabka slot ek hi rakhiye — ek visit me kaam ho jaata hai.",
            "Report 24 ghante ke andar phone par PDF me aa jaati hai; payment sample ke waqt cash ya UPI se hota hai.",
          ],
        },
        [
          "Ghar par sample lene ki poori prakriya — darwaze par kya hota hai, kis ilaake me aate hain — alag guide me hai: ",
          {
            text: "Varanasi me ghar par blood test",
            href: BLOG_HOME_VARANASI,
          },
          ".",
        ],
      ],
    },

    {
      id: "aage-kya-karein-diabetes-thyroid",
      heading: "Chhoti Si Checklist",
      blocks: [
        {
          list: [
            "Parche ka poora test naam booking me daaliye — thyroid me \"Total\" aur \"Free\" alag test hain.",
            "Fasting wale test (FBS, lipid, package) ke liye subah ka pehla slot lijiye; HbA1c aur TSH me fasting nahi lagti.",
            "PP sugar me do ghante khaana SHURU karne se giniye.",
            "Thyroid ki goli sample ke baad lijiye; biotin 48-72 ghante pehle band kar dijiye.",
            "Lipid se 24 ghante pehle sharaab nahi.",
            "Follow-up hamesha ek hi lab me — HbA1c aur TSH me lab badalna tulna hi khatam kar deta hai.",
            "Report ka koi bhi number khud tay mat kijiye — doctor ko dikhaiye.",
          ],
        },
        [
          "Test chunne ya booking me confusion ho to ",
          { text: "humein call kar lijiye", href: CONTACT },
          "; parche ke hisaab se sahi panel batana isi kaam ka hissa hai.",
        ],
      ],
    },
  ],

  /* Questions a Varanasi reader actually types about these three test families,
     and deliberately NOT the ones already answered on the service page or in
     the parent guide. Two FAQ blocks answering the same question on one domain
     compete with each other for the same rich result. */
  faqs: [
    {
      question: "Varanasi me thyroid test ki price kitni hoti hai?",
      answer:
        "Ye is baat par tay hota hai ki panel me kya hai. Akela TSH, TSH ke saath T3 aur T4 wala thyroid profile, aur FT3-FT4 wala free profile — teenon alag test hain aur teenon ka rate alag hai. Method bhi farq daalta hai: hormone ke liye CLIA aur ECLIA purane ELISA se mehnge padte hain lekin zyada bharosemand maane jaate hain. Home collection ka koi alag charge nahi judta. Rate ka poora range service page par ek hi jagah rakha gaya hai.",
    },
    {
      question: "Sugar test ke liye kitne ghante fasting karni chahiye?",
      answer:
        "Fasting blood sugar aur lipid profile ke liye 10 se 12 ghante. Saada paani peete rahiye — paani ki kami se kai number jhoothe taur par badh jaate hain. HbA1c me fasting bilkul nahi lagti, isliye jinka khaane ka samay fix nahi rehta unke liye wahi sabse aasan test hai. Post-prandial sugar me fasting nahi, balki timing maayne rakhti hai: khaana shuru karne ke theek do ghante baad sample.",
    },
    {
      question: "HbA1c aur fasting sugar me se kaunsa test behtar hai?",
      answer:
        "Dono alag sawaal ka jawab dete hain, isliye ek doosre ki jagah nahi lete. Fasting sugar us din ki sugar batata hai; HbA1c pichhle do se teen mahine ka average batata hai aur usme ek din ka parhez chhupta nahi. Jinhe diabetes hai unhe har teen mahine me HbA1c karana chahiye. Jinhe nahi hai lekin ghar me history hai, unke liye saal me ek baar fasting sugar aur HbA1c dono kaafi hain.",
    },
    {
      question: "Thyroid ki dawa lene wale log test se pehle goli lein ya baad me?",
      answer:
        "Blood nikalne ke BAAD lijiye. Test se pehle thyroxine lene par T4 jhootha hi zyada dikhega aur dose galat adjust ho sakta hai. Iske alawa biotin ya multivitamin supplement kisi bhi hormone test se 48 se 72 ghante pehle band kar dena chahiye, kyunki biotin assay me interfere karta hai. Baaki regular dawaiyan usi samay par leni chahiye jab tak doctor mana na kare.",
    },
    {
      question: "TSH badha hua hai lekin T3 aur T4 normal hain — iska matlab kya hai?",
      answer:
        "Ye haalat kaafi aam hai aur aksar turant dawa nahi maangti, sirf dobara jaanch maangti hai. Kitne samay baad dohrana hai aur kuch karna hai ya nahi, ye faisla doctor ka hai — report ke saath poori history dekh kar. Apne aap dawa shuru karna ya internet ke chart se apni value milana dono nuksaandeh hain. Dawa shuru hone ya dose badalne ke baad TSH 6 se 8 hafte me dohraya jaata hai.",
    },
    {
      question: "Lipid profile se pehle sharaab se kitni door rehna chahiye?",
      answer:
        "Kam se kam 24 ghante. Ek shaam ki peene se hi triglycerides aur liver enzymes kaafi badh jaate hain, aur us report par doctor ka faisla galat dishaa me ja sakta hai. Ek din pehle bahut heavy khaana aur bahut tez gym bhi number hila dete hain. Bukhar ya kisi operation ke turant baad lipid profile karane ka matlab nahi hota — wo dinon tak apne aap gadbad rehta hai.",
    },
    {
      question: "Diabetes hai to saal bhar me kaun se test karane chahiye?",
      answer:
        "Har teen mahine me HbA1c, saal me ek baar lipid profile, saal me ek baar kidney function ke saath urine microalbumin, aur saal me ek baar liver function. Urine microalbumin sabse pehla ishaara deta hai ki sugar kidney par asar daal raha hai, aur yahi test log sabse zyada chhodte hain kyunki usme koi takleef nahi hoti. Lambe samay tak metformin chal rahi ho to doctor vitamin B12 bhi jodne ko keh sakte hain.",
    },
    {
      question: "Ye teenon test ek hi sample me ho jaate hain?",
      answer:
        "Haan. Sugar, HbA1c, thyroid aur lipid ek hi visit me liye gaye sample se ho jaate hain — bas alag test ke liye alag rang ki tube bharni padti hai, isliye do-teen tube dekhna normal hai. Ek se zyada tube ka matlab zyada khoon nahi hota. Agar in sab ke saath liver, kidney aur vitamin bhi karane hain to package aksar alag-alag test karane se sasta padta hai.",
    },
    {
      question: "Varanasi me ye test ghar par ho jaate hain?",
      answer:
        "Haan, teenon sample par hone wale test hain, isliye ghar par ho jaate hain. Fasting wale test — fasting sugar aur lipid — ke liye subah 6 baje ka pehla slot lijiye; sample ke turant baad naashta kar sakte hain. HbA1c aur TSH din me kabhi bhi ho sakte hain kyunki unme fasting nahi lagti. Report 24 ghante ke andar phone par PDF me aa jaati hai.",
    },
  ],

  /**
   * Hand-picked contextual links, rendered as a block under the article.
   *
   * The all-cities grid below it is generated from the live city lists, so this
   * block is only for the links a generator cannot know.
   */
  relatedLinks: {
    heading: "Varanasi Ke Liye Aage Kya Dekhein",
    intro:
      "Is guide me sugar, thyroid aur lipid ka poora hisaab hai. Booking, price aur test menu service page par hain.",
    groups: [
      {
        title: "Varanasi Lab Test",
        links: [
          {
            href: LAB_VARANASI_DIABETES,
            label: "Diabetes, thyroid aur heart risk screening",
            sub: "Service page ka wahi hissa, ek nazar me",
          },
          {
            href: LAB_VARANASI_PRICE,
            label: "Varanasi me lab test ka price range",
            sub: "Thyroid, HbA1c, lipid aur package",
          },
          {
            href: LAB_VARANASI_POPULAR,
            label: "Varanasi me sabse zyada karaye jaane wale test",
          },
          {
            href: LAB_VARANASI_BOOK,
            label: "Booking ka poora kram — form se report tak",
          },
        ],
      },
      {
        title: "Doosre Varanasi Guide",
        links: [
          {
            href: BLOG_LAB_VARANASI,
            label: "Varanasi me lab test — kaun sa test kab",
            sub: "Symptom, umar aur mausam ke hisaab se",
          },
          {
            href: BLOG_HOME_VARANASI,
            label: "Varanasi me ghar par blood test",
            sub: "Kis ilaake me aate hain, slot aur poori prakriya",
          },
          {
            href: BLOG_LIVER_KIDNEY_VARANASI,
            label: "Varanasi me LFT aur KFT — kab karayein",
            sub: "Diabetic ka saal ka kidney wala test",
          },
          {
            href: BLOG_DENGUE_VARANASI,
            label: "Varanasi me dengue aur typhoid test — kis din",
          },
          {
            href: BLOG_FULLBODY_VARANASI,
            label: "Varanasi me full body checkup — kya karayein",
            sub: "Ye teenon ek hi package me",
          },
          {
            href: BLOG_PATHOLOGY_VARANASI,
            label: "Varanasi me pathology lab kaise chunein",
          },
        ],
      },
      {
        title: "Aas-paas Ke Sheher",
        links: [
          {
            href: BLOG_DIABETES_DEORIA,
            label: "Deoria me sugar aur thyroid test",
            sub: "Wahi guide, Deoria ke liye",
          },
          {
            href: LAB_GORAKHPUR,
            label: "Gorakhpur me lab test",
            sub: "OPD se pehle report taiyaar rakhne ka tarika",
          },
          {
            href: LAB_AZAMGARH,
            label: "Azamgarh me lab test",
            sub: "Mandal mukhyalaya — poore jile me home collection",
          },
          { href: CONTACT, label: "Contact — booking aur test chunne me madad" },
        ],
      },
    ],
  },
};
