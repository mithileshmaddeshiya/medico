/**
 * /blogs/liver-kidney-test/varanasi — "Varanasi Me LFT Aur KFT Test Kab Karayein"
 *
 * ── THE LANE ─────────────────────────────────────────────────────────────
 * Varanasi's set only survives together because each page answers a question
 * the others do not. This one owns two organs that share one property: they
 * stay quiet. Liver and kidney damage does not hurt in the stage where it can
 * still be reversed, which is why LFT and KFT are ordered "for no reason" and
 * then turn out to be the reason.
 *
 * It does NOT repeat:
 *   /blogs/lab-test/varanasi              → LFT/KFT get one row of a table there
 *   /blogs/full-body-checkup/varanasi     → counts them as two lines of a panel
 *   /blogs/diabetes-thyroid-test/varanasi → names urine microalbumin once, then
 *                                            hands the kidney subject over here
 *   /blogs/dengue-typhoid-test/varanasi   → sends jaundice cases here for LFT
 *
 * ── WHY THE "BINA JAANCH WALE NUSKHE" SECTION EXISTS ─────────────────────
 * In this region the commonest thing a jaundice patient does before any test
 * is take an unlabelled herbal preparation. That is not a claim about any
 * particular remedy and this page makes none; it simply says what a lab can
 * see — that some unlabelled preparations move liver enzymes, and that the
 * doctor needs to know what was taken to read the report. Stating the fact
 * without naming or condemning anything is the honest version, and it is the
 * part of this article a reader in Varanasi will not find elsewhere.
 *
 * ── CLAIMS ───────────────────────────────────────────────────────────────
 * Only the five the business confirms: free home collection, a trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI
 * on collection. No NABL, no "certified", no accuracy claim.
 *
 * No ultrasound anywhere on this page, and it says so out loud: fatty liver
 * and stones are found on ultrasound, which is a machine we do not have. A
 * page about the liver that quietly implies otherwise would cost a booking and
 * the trust in the same visit.
 *
 * ── CLINICAL CARE ────────────────────────────────────────────────────────
 * Standard, uncontroversial statements only: no alcohol 24 hours before an
 * LFT, no heavy gym before creatinine, water allowed during fasting, urine
 * microalbumin yearly for a diabetic. No reference value is named as safe or
 * unsafe; every number leads to "doctor ko dikhaiye".
 *
 * ── NO PRICES ────────────────────────────────────────────────────────────
 * Not one rate. Sentences that would carry a number link to
 * #lab-test-price-varanasi instead.
 *
 * ── IMAGES: NONE ─────────────────────────────────────────────────────────
 * /public has no photography for this subject; og:image resolves to the
 * generated card at /blogs/liver-kidney-test/varanasi/og.
 */
import {
  BLOG_AUTHOR,
  BLOG_PUBLISHER,
  INDEXABLE,
  canonicalFor,
} from "../shared";

/* Link targets as constants — a route rename is one line here instead of a
   hunt through the prose. Service-page anchors come from
   src/data/lab/content/varanasi.js; rename one there and these break. */
const LAB_VARANASI = "/lab-test/varanasi";
const LAB_VARANASI_POPULAR = "/lab-test/varanasi#popular-blood-tests-varanasi";
const LAB_VARANASI_FEVER = "/lab-test/varanasi#fever-dengue-typhoid-testing-varanasi";
const LAB_VARANASI_PRICE = "/lab-test/varanasi#lab-test-price-varanasi";
const LAB_VARANASI_PREPARE = "/lab-test/varanasi#how-to-prepare-for-blood-test";
const LAB_VARANASI_BOOK = "/lab-test/varanasi#how-to-book-lab-test-varanasi";
const LAB_VARANASI_FULLBODY = "/lab-test/varanasi#full-body-checkup-varanasi";

const BLOG_LAB_VARANASI = "/blogs/lab-test/varanasi";
const BLOG_LAB_VARANASI_REPORT = "/blogs/lab-test/varanasi#report-kaise-padhein";
const BLOG_LAB_VARANASI_FASTING = "/blogs/lab-test/varanasi#fasting-aur-taiyari";
const BLOG_HOME_VARANASI = "/blogs/home-sample-collection/varanasi";
const BLOG_DIABETES_VARANASI = "/blogs/diabetes-thyroid-test/varanasi";
const BLOG_DENGUE_VARANASI = "/blogs/dengue-typhoid-test/varanasi";
const BLOG_FULLBODY_VARANASI = "/blogs/full-body-checkup/varanasi";
const BLOG_PATHOLOGY_VARANASI = "/blogs/pathology-lab/varanasi";
const BLOG_LIVER_KIDNEY_DEORIA = "/blogs/liver-kidney-test/deoria";

const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_AZAMGARH = "/lab-test/azamgarh";
const CONTACT = "/contact";

export const liverKidneyVaranasi = {
  category: "liver-kidney-test",
  city: "varanasi",

  /* 41 characters. The root layout appends " | MedicoBharat" (template in
     src/app/layout.js), so Google renders 56 — inside the ~60 it shows. The
     two abbreviations people actually type come before the question. */
  title: "Varanasi Me LFT Aur KFT Test Kab Karayein",

  /* ~155 characters, renders whole on desktop and mobile. Hinglish, with the
     English terms that must match left intact: liver function test, kidney
     function test, LFT, KFT. */
  description:
    "Varanasi me liver function test (LFT) aur kidney function test (KFT) — kismein kya aata hai, kis ko kab karana chahiye, fasting aur report ka matlab.",

  /* Ordered strongest first. Every term here appears in the visible copy; a
     keyword that lives ONLY in this array is the kind that gets a page
     filtered rather than ranked. */
  keywords: [
    "Kidney Function Test in Varanasi",
    "Liver Function Test in Varanasi",
    "KFT Test in Varanasi",
    "LFT Test in Varanasi",
    "Creatinine Test in Varanasi",
    "SGPT SGOT Test Varanasi",
    "Urine Microalbumin Test Varanasi",
    "Jaundice Test in Varanasi",
    "Bilirubin Test in Varanasi",
    "Uric Acid Test in Varanasi",
    "Blood Test in Varanasi",
    "Lab Test in Varanasi",
    "Pathology Lab in Varanasi",
    "Blood Test at Home Varanasi",
    "Free Home Sample Collection Varanasi",
  ],

  canonical: canonicalFor("liver-kidney-test", "varanasi"),
  robots: INDEXABLE,
  author: BLOG_AUTHOR,
  publisher: BLOG_PUBLISHER,

  publishedAt: "2026-09-04",
  updatedAt: "2026-09-04",

  /* Stated rather than computed: a number that changes every time a sentence is
     edited is a number nobody maintains. */
  readingMinutes: 8,

  /** The skimmer's version of the whole article. */
  takeaways: [
    "Liver aur kidney dono chup rehte hain — jab takleef shuru hoti hai tab tak kaafi hissa beet chuka hota hai.",
    "LFT se 24 ghante pehle sharaab nahi, aur KFT se ek din pehle bahut tez gym nahi — dono number hila dete hain.",
    "Sugar ya BP ki dawa chal rahi hai to saal me ek baar KFT ke saath urine microalbumin zaroor.",
    "Peelapan, gehra peshab ya ulti jaisa lagna — pehla test LFT hai, aur Varanasi me Hepatitis A/E saath me dekhe jaate hain.",
  ],

  sections: [
    {
      id: "lft-kft-kya-hain",
      heading: "LFT Aur KFT — Do Chup Rehne Wale Ang Ki Jaanch",
      blocks: [
        "Liver aur kidney me ek baat common hai: dono me dard nahi hota. Jab tak koi lakshan saamne aata hai — peelapan, sujan, peshab ka kam hona, bahut thakan — tab tak kaafi kuch ho chuka hota hai. Isliye in dono ki jaanch takleef par nahi, sthiti par ki jaati hai: sugar hai, BP hai, dawa lambe samay se chal rahi hai, ya saal ka routine checkup hai.",
        "Doosri baat jo confusion paida karti hai: KFT aur RFT ek hi cheez hain — Kidney Function Test aur Renal Function Test. Lab alag naam se likh sakti hai; parche par jo likha hai wahi booking me daaliye.",
        [
          "Neeche dono test ka poora hisaab hai — kismein kya aata hai, kis ko kab karana chahiye, taiyari me kya, aur report ke baad kya. Poora test menu aur rate service page par hai: ",
          {
            text: "Varanasi me sabse zyada karaye jaane wale blood test",
            href: LAB_VARANASI_POPULAR,
          },
          ".",
        ],
        {
          note: {
            title: "Fatty liver aur pathri blood test me nahi dikhte",
            text: "LFT liver ke enzyme aur bilirubin batata hai; wo liver ka structure nahi dekhta. Fatty liver, pathri aur kidney ka size ultrasound par dikhte hain, aur ultrasound humare menu me nahi hai — wo machine par hota hai, sample par nahi. Parche par ultrasound likha hai to uske liye imaging centre jaana hoga.",
            tone: "warn",
          },
        },
      ],
    },

    {
      id: "lft-test-varanasi-kya-aata-hai",
      heading: "LFT Test In Varanasi — Liver Function Test Me Kya-Kya Aata Hai",
      lead: "Ek panel, chhe-saat number — aur har ek alag baat kehta hai.",
      blocks: [
        "Liver Function Test ek akela test nahi, ek panel hai. Usme enzyme bhi hote hain aur liver ka banaya hua protein bhi, aur doctor unhe ek saath padhta hai — akela ek number kam hi kuch batata hai.",
        {
          table: {
            caption: "LFT ke hisse — kya-kya dekha jaata hai",
            head: ["Hissa", "Kya batata hai"],
            rows: [
              [
                "Total aur Direct Bilirubin",
                "Peelapan ka number. Aankh aur peshab ka rang isi se juda hota hai.",
              ],
              [
                "SGPT (ALT) aur SGOT (AST)",
                "Liver cell ke enzyme. Inka badhna liver par kisi tarah ke dabav ka ishaara hota hai.",
              ],
              [
                "Alkaline Phosphatase (ALP)",
                "Bile ke raaste ka hissa. Haddi se bhi juda hota hai, isliye ise akela nahi padha jaata.",
              ],
              [
                "Total Protein, Albumin, Globulin",
                "Liver ka banaya hua protein — lambe samay ki haalat ka andaza yahin se lagta hai.",
              ],
              [
                "GGT",
                "Kuch panel me hota hai. Bile ke raaste aur kuch dawaiyon ke asar se juda.",
              ],
            ],
          },
        },
        {
          list: [
            "LFT me aam taur par fasting zaroori nahi hoti, lekin agar package ya lipid ke saath ho raha hai to fasting lagegi — kyunki lipid me lagti hai.",
            "Test se kam se kam 24 ghante pehle sharaab bilkul nahi. Ek shaam ki peene se hi enzyme kaafi badh jaate hain aur report galat disha me le jaati hai.",
            "Doctor ko poori dawa list bataiye — dard ki goli, antibiotic, TB ki dawa aur kai aam dawaiyan liver enzyme par asar daalti hain.",
          ],
        },
      ],
    },

    {
      id: "peelapan-aur-paani-varanasi",
      heading: "Peelapan Aur Paani — Varanasi Me Liver Ki Jaanch Kis Mausam Me Badhti Hai",
      blocks: [
        "Varanasi ka apna ek pattern hai. Paani se failne wale Hepatitis A aur Hepatitis E garmi me aur monsoon ke baad badh jaate hain, khaas kar un ilaakon me jahan peene ka paani aur sewage line paas-paas chalti hain. Isliye is sheher me peelapan dikhne par LFT akela nahi karaya jaata — uske saath Hepatitis A IgM aur Hepatitis E IgM bhi dekhe jaate hain.",
        {
          list: [
            "Aankhon ka peelapan, gehra peshab, bhookh khatam ho jaana, ulti jaisa lagna — in me se kuch bhi ho to pehla test LFT hai, bilirubin ke saath.",
            "Bukhar ke saath peelapan ho to bukhar wala panel bhi saath jaata hai — ye do alag beemari ek saath ho sakti hain.",
            "Pregnancy me peelapan dikhe to intezaar bilkul mat kijiye, seedha doctor ke paas jaiye. Hepatitis E garbhawastha me kahin zyada khatarnak hota hai.",
            "Ghar me kisi ek ko jaundice hua hai to paani ubaal kar peena aur bahar ka khula khaana band karna sabse seedha kadam hai.",
          ],
        },
        [
          "Bukhar aur jaundice ka poora panel service page ke ",
          { text: "fever wale hisse", href: LAB_VARANASI_FEVER },
          " me hai, aur bukhar ke kis din kaun sa test hota hai wo ",
          {
            text: "dengue-typhoid wali guide",
            href: BLOG_DENGUE_VARANASI,
          },
          " me.",
        ],
      ],
    },

    {
      id: "kft-test-varanasi-kya-dekha-jaata-hai",
      heading: "KFT Test In Varanasi — Kidney Function Test Me Kya Dekha Jaata Hai",
      blocks: [
        "Kidney Function Test bhi ek panel hai. Ismein wo cheezein naapi jaati hain jo kidney ko sharir se bahar nikalni hoti hain, aur wo namak jinka santulan kidney rakhti hai.",
        {
          table: {
            caption: "KFT ke hisse — kya-kya dekha jaata hai",
            head: ["Hissa", "Kya batata hai"],
            rows: [
              ["Creatinine", "Kidney ke kaam ka sabse aam paimana."],
              ["Urea / BUN", "Kidney aur paani ka santulan dono se juda."],
              ["Uric Acid", "Jodo ke dard aur khaan-paan se juda number."],
              [
                "Sodium, Potassium, Chloride",
                "Namak ka santulan. Ulti, dast ya diuretic dawa me ye zaroori hote hain.",
              ],
              [
                "eGFR",
                "Creatinine, umar aur gender se nikala gaya andaza. Report par apne aap chhapta hai.",
              ],
              [
                "Urine Routine",
                "Protein, sugar, pus cell — kidney ki sabse pehli jhalak yahin milti hai.",
              ],
            ],
          },
        },
        {
          note: {
            title: "Sample se pehle paani zaroor peete rahiye",
            text: "Paani ki kami se urea aur creatinine jhoothe taur par badhe hue dikhte hain, aur nas milna bhi mushkil ho jaata hai. Fasting me bhi saada paani mana nahi hai — sirf chai, doodh, juice aur khaana mana hai. Test se ek din pehle bahut tez gym bhi avoid kijiye, kyunki tez exercise se creatinine badh jaata hai.",
            tone: "info",
          },
        },
      ],
    },

    {
      id: "sugar-bp-wale-kft-kyun",
      heading: "Sugar Ya BP Ki Dawa Chal Rahi Hai — KFT Saal Me Ek Baar Kyun",
      lead: "Kidney par asar sabse pehle peshab me dikhta hai, khoon me nahi.",
      blocks: [
        "Diabetes aur high BP — dono kidney par dheere-dheere asar daalte hain, aur wo asar shuruaat me creatinine me nahi dikhta. Sabse pehla ishaara peshab me thoda sa protein aana hota hai, aur wahi urine microalbumin pakadta hai. Ye us stage par pata chalta hai jab abhi bahut kuch kiya ja sakta hai — aur yahi wo test hai jo log sabse zyada chhodte hain, kyunki usme koi takleef nahi hoti.",
        {
          table: {
            caption: "Kis ko LFT/KFT kab",
            head: ["Kaun", "Kaun sa test", "Kitni baar"],
            rows: [
              [
                "Diabetes hai",
                "KFT + Urine Microalbumin, aur LFT",
                "Saal me ek baar (HbA1c har 3 mahine alag se)",
              ],
              ["High BP hai", "KFT + Urine Routine", "Saal me ek baar"],
              [
                "Lambe samay se koi dawa chal rahi hai",
                "LFT aur KFT",
                "Jaisa likhne wala doctor kahe",
              ],
              ["Peelapan ya gehra peshab", "LFT (bilirubin ke saath) + Hepatitis A/E IgM", "Turant"],
              ["Paer ya chehre par sujan, peshab kam", "KFT + Urine Routine", "Turant, doctor ko dikha kar"],
              ["Jodo me dard, khaas kar angoothe me", "Uric Acid ke saath KFT", "Doctor ke kehne par"],
              ["Koi lakshan nahi, sirf routine", "Package me dono", "Saal me ek baar 30 ke baad"],
            ],
          },
        },
        [
          "Diabetic ka poora saal — HbA1c, lipid aur ye kidney wala test — ",
          {
            text: "sugar aur thyroid wali guide",
            href: BLOG_DIABETES_VARANASI,
          },
          " me ek table me rakha gaya hai.",
        ],
      ],
    },

    {
      id: "dawa-sharaab-aur-nuskhe",
      heading: "Dawa, Sharaab Aur Bina Label Wale Nuskhe — Test Se Pehle Batane Wali Baatein",
      blocks: [
        "Report padhne wale doctor ke liye sabse kaam ki jaankari wo hoti hai jo report par nahi likhi hoti: aap kya-kya le rahe hain. Liver aur kidney dono wahi ang hain jo sharir me aayi har cheez ko sambhaalte hain, isliye unke number us cheez se hilte hain.",
        {
          list: [
            "Sharaab — LFT se kam se kam 24 ghante pehle bilkul nahi. Ye chhupane ki cheez nahi hai; chhupane se sirf report ka matlab galat nikalta hai.",
            "Dard ki goli, antibiotic, TB ki dawa aur kai aam dawaiyan liver enzyme badha sakti hain. Poori list bata dijiye, chahe wo \"sirf ek goli\" ho.",
            "Bina label wale ya bina parche wale nuskhe — jo bhi liya ho, use bhi bata dijiye. Kuch anlabelled preparation liver enzyme hila dete hain, aur doctor ko sirf itna jaanna hota hai ki report ko kis nazar se padhna hai.",
            "Protein powder aur creatine supplement creatinine badha dete hain. Gym jaate hain to ye zaroor bataiye.",
            "Test se ek din pehle bahut tez exercise nahi — creatinine aur muscle enzyme dono badh jaate hain.",
            "Paani peete rahiye. Paani ki kami wali report sabse zyada bewajah ghabrahat paida karti hai.",
          ],
        },
        {
          note: {
            title: "Peelapan me apne aap koi nuskha shuru mat kijiye",
            text: "Jaundice me sabse pehla kadam wajah pata karna hai — Hepatitis A, E, dawa ka asar, ya kuch aur. Wajah alag hone par aage ka rasta bilkul alag hota hai. Bina wajah jaane kuch bhi shuru karna liver par ek aur bojh hai, aur doctor ke liye report padhna mushkil kar deta hai.",
            tone: "warn",
          },
        },
      ],
    },

    {
      id: "taiyari-aur-ghar-se-sample",
      heading: "Varanasi Me LFT Aur KFT Ghar Se Kaise Hote Hain",
      blocks: [
        "Dono sample par hone wale test hain, isliye dono ghar par ho jaate hain. Urine routine bhi saath ho to sample ka container pehle se de diya jaata hai — subah ka pehla peshab sabse achha maana jaata hai.",
        {
          list: [
            "Akela LFT ya KFT karana ho to fasting zaroori nahi. Package ya lipid ke saath ho raha ho to 10 se 12 ghante fasting lagegi.",
            "Fasting wale case me subah 6 baje ka pehla slot lijiye — sample ke turant baad naashta ho jaata hai.",
            "Saada paani peete rahiye, fasting me bhi.",
            "Urine sample ke liye container pehle maang lijiye; subah ka pehla peshab dijiye.",
            "Report 24 ghante ke andar phone par PDF me aa jaati hai. Urine culture ho to 48 se 72 ghante lagte hain.",
            "Payment sample ke waqt cash ya UPI se — home collection ka koi alag charge nahi judta.",
          ],
        },
        [
          "Taiyari ka poora niyam ",
          { text: "service page par", href: LAB_VARANASI_PREPARE },
          " aur ghar par sample lene ki poori prakriya ",
          { text: "home collection wali guide", href: BLOG_HOME_VARANASI },
          " me hai.",
        ],
      ],
    },

    {
      id: "report-aa-gayi-lft-kft",
      heading: "Report Aa Gayi — Ab Kya, Aur Dobara Kab",
      blocks: [
        "In dono panel me akela ek number kam hi kuch batata hai. Doctor poora panel ek saath padhta hai, aur usse zyada wo purani report se tulna karta hai. Isliye do cheezein sabse kaam ki hain: purani report sambhaal kar rakhna, aur follow-up ek hi lab me karana.",
        {
          list: [
            "Thoda sa range se bahar hona bahut aam hai — ek din ki dawa, ek shaam ki sharaab, ya paani ki kami se bhi hota hai.",
            "Doctor aksar kuch hafton baad dohrane ko kehta hai. Dobara test karna \"kuch galat hai\" ka matlab nahi — number ka rukh dekhna hi tarika hai.",
            "Peshab bahut kam ho jaana, paer ya chehre par sujan, saans phoolna, ya peelapan ke saath ulti — ye report ka intezaar karne wali baatein nahi hain. Seedha doctor.",
            "Follow-up hamesha ek hi lab me. Alag analyser ki reference range thodi alag hoti hai, isliye chhota farq beemari ka farq nahi hota.",
          ],
        },
        [
          "Report me flag, reference range aur kis number par usi din doctor chahiye — ye poora hissa alag se likha hai: ",
          {
            text: "report aa gayi, ab ise kaise padhein",
            href: BLOG_LAB_VARANASI_REPORT,
          },
          ".",
        ],
      ],
    },

    {
      id: "aage-kya-karein-lft-kft",
      heading: "Chhoti Si Checklist",
      blocks: [
        {
          list: [
            "Parche par LFT/KFT ke saath aur kya likha hai wo dekhiye — package ya lipid saath ho to fasting lagegi.",
            "LFT se 24 ghante pehle sharaab nahi.",
            "KFT se ek din pehle bahut tez gym nahi; protein powder ya creatine lete hain to bata dijiye.",
            "Paani peete rahiye — fasting me bhi saada paani chalta hai.",
            "Dawa aur koi bhi bina label wala nuskha, sab bata dijiye.",
            "Sugar ya BP hai to saal me ek baar KFT ke saath urine microalbumin.",
            "Purani report saath rakhiye, aur follow-up usi lab me karayein.",
          ],
        },
        [
          "Ye dono test package me bhi aate hain — package me kya hona chahiye wo ",
          { text: "full body checkup wali guide", href: BLOG_FULLBODY_VARANASI },
          " me hai. Booking me confusion ho to ",
          { text: "humein call kar lijiye", href: CONTACT },
          ".",
        ],
      ],
    },
  ],

  /* Questions a Varanasi reader actually types about these two panels, and
     deliberately NOT the ones already answered on the service page or in the
     sibling guides. Two FAQ blocks answering the same question on one domain
     compete with each other for the same rich result. */
  faqs: [
    {
      question: "LFT test se pehle fasting karni padti hai?",
      answer:
        "Akela LFT karana ho to aam taur par fasting zaroori nahi hoti. Lekin agar LFT full body package ke saath ya lipid profile ke saath ho raha hai to 10 se 12 ghante fasting lagegi, kyunki lipid me lagti hai. Jo baat fasting se zyada zaroori hai wo ye: test se kam se kam 24 ghante pehle sharaab bilkul nahi, kyunki ek shaam ki peene se hi liver enzyme kaafi badh jaate hain.",
    },
    {
      question: "KFT aur RFT me kya farq hai?",
      answer:
        "Koi farq nahi — Kidney Function Test aur Renal Function Test ek hi panel ke do naam hain. Alag lab alag naam likh sakti hai. Booking karte waqt wahi naam daaliye jo aapke parche par likha hai, aur panel me kya-kya shamil hai wo confirm kar lijiye: creatinine, urea, uric acid aur electrolytes aam taur par ismein aate hain.",
    },
    {
      question: "Creatinine test se pehle kya dhyaan rakhna chahiye?",
      answer:
        "Do baatein. Pehli, paani peete rahiye — paani ki kami se urea aur creatinine jhoothe taur par badhe hue dikhte hain. Doosri, test se ek din pehle bahut tez gym mat kijiye, kyunki tez exercise se creatinine badh jaata hai. Protein powder ya creatine supplement lete hain to ye zaroor bata dijiye, warna report ka matlab galat nikal sakta hai.",
    },
    {
      question: "Peelapan dikh raha hai — Varanasi me pehla test kaunsa karana chahiye?",
      answer:
        "LFT, total aur direct bilirubin ke saath. Varanasi me iske saath Hepatitis A IgM aur Hepatitis E IgM bhi aksar dekhe jaate hain, kyunki paani se failne wale ye dono garmi me aur monsoon ke baad badh jaate hain. Bukhar bhi saath ho to bukhar ka panel bhi jodna padta hai. Pregnancy me peelapan dikhe to test se pehle turant doctor ko dikhaiye — Hepatitis E garbhawastha me kahin zyada khatarnak hota hai.",
    },
    {
      question: "Sugar hai to kidney ka kaunsa test karana chahiye?",
      answer:
        "Saal me ek baar KFT ke saath urine microalbumin. Yahi wo test hai jo sabse pehle batata hai ki sugar kidney par asar daalna shuru kar chuka hai — us stage par, jab abhi bahut kuch kiya ja sakta hai. Aur yahi test log sabse zyada chhodte hain, kyunki usme koi takleef nahi hoti. Iske alawa saal me ek baar LFT bhi, kyunki fatty liver diabetes ke saath aam hai.",
    },
    {
      question: "SGPT ya SGOT thoda sa badha hua hai — ghabrane ki baat hai?",
      answer:
        "Thoda sa range se bahar hona bahut aam hai aur akela ek number kam hi kuch batata hai — doctor poora panel ek saath padhta hai aur purani report se tulna karta hai. Kai baar ek shaam ki sharaab, koi dawa, ya ek din ka bhaari khaana bhi enzyme hila deta hai. Isliye doctor aksar kuch hafton baad dohrane ko kehta hai. Dobara test karna \"kuch galat hai\" ka matlab nahi, number ka rukh dekhne ka tarika hai.",
    },
    {
      question: "Fatty liver blood test se pata chal jaata hai?",
      answer:
        "Nahi. LFT liver ke enzyme aur bilirubin batata hai, wo liver ka structure nahi dekhta. Fatty liver, pathri aur kidney ka size ultrasound par dikhte hain, aur ultrasound humare menu me nahi hai — wo machine par hota hai, sample par nahi. LFT ka badha hua number doctor ko ultrasound likhne ki wajah zaroor de sakta hai, lekin jawab ultrasound hi dega.",
    },
    {
      question: "LFT aur KFT ghar par ho jaate hain?",
      answer:
        "Haan, dono sample par hone wale test hain. Urine routine bhi saath karana ho to container pehle se de diya jaata hai — subah ka pehla peshab sabse achha maana jaata hai. Akela LFT ya KFT ho to fasting zaroori nahi; package ke saath ho to subah 6 baje ka pehla slot lijiye. Report 24 ghante ke andar phone par PDF me aa jaati hai, aur urine culture ho to 48 se 72 ghante lagte hain.",
    },
    {
      question: "Uric acid ka test KFT me aata hai ya alag hota hai?",
      answer:
        "Aam taur par uric acid KFT panel ka hissa hota hai, lekin har lab ka panel bilkul ek jaisa nahi hota — isliye booking ke waqt confirm kar lijiye ki panel me kya-kya shamil hai. Jodo me dard, khaas kar paer ke angoothe me, uric acid dekhne ki sabse aam wajah hoti hai. Test se ek din pehle bahut zyada protein wala khaana aur sharaab dono number badha dete hain.",
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
      "Is guide me LFT aur KFT ka poora hisaab hai. Booking, price aur test menu service page par hain.",
    groups: [
      {
        title: "Varanasi Lab Test",
        links: [
          {
            href: LAB_VARANASI,
            label: "Varanasi me lab test — booking aur home collection",
            sub: "Free home sample collection, slot subah 6 baje se",
          },
          {
            href: LAB_VARANASI_POPULAR,
            label: "Varanasi me sabse zyada karaye jaane wale test",
            sub: "LFT, KFT aur baaki panel — ek nazar me",
          },
          {
            href: LAB_VARANASI_FULLBODY,
            label: "Full body checkup me kya-kya hona chahiye",
            sub: "Liver aur kidney dono ismein aate hain",
          },
          {
            href: LAB_VARANASI_PRICE,
            label: "Varanasi me lab test ka price range",
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
            href: BLOG_DIABETES_VARANASI,
            label: "Varanasi me sugar, thyroid aur lipid test",
            sub: "Diabetic ka saal — kidney wala test ismein",
          },
          {
            href: BLOG_DENGUE_VARANASI,
            label: "Varanasi me dengue aur typhoid test — kis din",
            sub: "Bukhar ke saath peelapan ho to",
          },
          {
            href: BLOG_HOME_VARANASI,
            label: "Varanasi me ghar par blood test",
            sub: "Urine sample aur slot ka poora tarika",
          },
          {
            href: BLOG_LAB_VARANASI_FASTING,
            label: "Blood test se pehle fasting aur taiyari",
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
            href: BLOG_LIVER_KIDNEY_DEORIA,
            label: "Deoria me LFT aur KFT",
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
