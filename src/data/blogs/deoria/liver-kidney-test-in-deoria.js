/**
 * /blogs/liver-kidney-test/deoria — the LFT + KFT guide.
 *
 * ── THE LANE ─────────────────────────────────────────────────────────────
 * Deoria's set now splits by QUESTION, not by keyword:
 *
 *   /lab-test/deoria                       → book kahan se, rate, menu
 *   /blogs/lab-test/deoria                 → kaun sa test kab (clinical)
 *   /blogs/pathology-lab/deoria            → sample dene kahan (geography)
 *   /blogs/home-sample-collection/deoria   → ghar par kaise hota hai
 *   /blogs/diabetes-thyroid-test/deoria    → sugar/thyroid/lipid ka form
 *   /blogs/full-body-checkup/deoria        → kaun sa package, kis ke liye
 *   /blogs/dengue-typhoid-test/deoria      → bukhar ki jaanch
 *   /blogs/liver-kidney-test/deoria        → LFT aur KFT (this)
 *
 * "LFT test in Deoria" and "KFT test in Deoria" are typed as abbreviations by
 * people holding a prescription, which is why the abbreviations lead the
 * headings and the expansions follow — not the other way round. The two tests
 * share one page because they share one reader: the person on sugar or BP
 * medicine whose doctor writes both once a year, and the household that meets
 * these words for the first time after a jaundice scare.
 *
 * ── WHY THIS IS DEORIA'S PAGE ────────────────────────────────────────────
 * /lab-test/deoria carries #flood-water-diseases-deoria because the district's
 * water is a seasonal health story, and jaundice is the part of that story
 * families here recognise by sight before any test is ordered. That is this
 * page's local anchor, together with the other genuinely local habit it names
 * plainly: pain-killers and untested remedies taken for weeks without anyone
 * checking what the liver and kidneys are doing.
 *
 * ── THE LINE THIS PAGE MUST NOT CROSS ────────────────────────────────────
 * Liver and kidney numbers are the easiest in pathology to over-read. This
 * page never says a number is safe, dangerous, or means a disease. It says
 * what is in the panel, what changes it, when it is repeated, and who decides
 * — the doctor, every time. Alcohol and self-medication are named as things to
 * DISCLOSE before a test, never judged.
 *
 * ── NO PRICES, NO NEW CLAIMS ─────────────────────────────────────────────
 * Not one rate; rates live only in src/data/lab/content/deoria.js. Only the
 * five confirmed claims: free home collection, trained phlebotomist with an ID
 * card, slots from 6 AM, reports in 24 hours, cash/UPI on collection. NOT
 * claimed: NABL accreditation, pathologist verification, "certified" anything,
 * same-day reports. Ultrasound is stated as NOT ours — it is written on half
 * the prescriptions that carry an LFT, so the page has to say where it does
 * and does not happen.
 *
 * ── IMAGES: NONE ─────────────────────────────────────────────────────────
 * og:image resolves to /blogs/liver-kidney-test/deoria/og, drawn from the title.
 */
import {
  BLOG_AUTHOR,
  BLOG_PUBLISHER,
  INDEXABLE,
  canonicalFor,
} from "../shared";

/* Link targets as constants. Section ids come from
   src/data/lab/content/deoria.js; rename one there and these anchors break
   silently. */
const LAB_DEORIA = "/lab-test/deoria";
const LAB_DEORIA_FLOOD = "/lab-test/deoria#flood-water-diseases-deoria";
const LAB_DEORIA_DIABETES = "/lab-test/deoria#diabetes-thyroid-screening-deoria";
const LAB_DEORIA_FULLBODY = "/lab-test/deoria#full-body-checkup-deoria";
const LAB_DEORIA_PRICE = "/lab-test/deoria#lab-test-price-deoria";
const LAB_DEORIA_PREPARE = "/lab-test/deoria#prepare-for-test-deoria";
const LAB_DEORIA_REPORTS = "/lab-test/deoria#reports-deoria";
const LAB_DEORIA_BOOK = "/lab-test/deoria#how-to-book-deoria";
const LAB_DEORIA_HOME = "/lab-test/deoria#home-sample-collection-deoria";
const LAB_DEORIA_GORAKHPUR = "/lab-test/deoria#gorakhpur-travel-deoria";
const LAB_DEORIA_MIGRANT = "/lab-test/deoria#migrant-workers-checkup-deoria";

/* The Varanasi sibling. The link runs both ways on purpose — that guide
   links here too, and a one-way link tells a crawler two pages are related but
   nothing about which one owns the subject. */
const BLOG_LIVER_KIDNEY_VARANASI = "/blogs/liver-kidney-test/varanasi";
const LAB_SALEMPUR = "/lab-test/salempur";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_KUSHINAGAR = "/lab-test/kushinagar";

const BLOG_LAB_DEORIA = "/blogs/lab-test/deoria";
const BLOG_PATHOLOGY_DEORIA = "/blogs/pathology-lab/deoria";
const BLOG_PATHOLOGY_DEORIA_ONELAB =
  "/blogs/pathology-lab/deoria#report-aur-ek-hi-lab-deoria";
const BLOG_HOME_DEORIA = "/blogs/home-sample-collection/deoria";
const BLOG_HOME_DEORIA_FASTING = "/blogs/home-sample-collection/deoria#fasting-slot-ghar-par-deoria";
const BLOG_FULLBODY_DEORIA = "/blogs/full-body-checkup/deoria";
const BLOG_DIABETES_DEORIA = "/blogs/diabetes-thyroid-test/deoria";
const BLOG_DENGUE_DEORIA = "/blogs/dengue-typhoid-test/deoria";

const CONTACT = "/contact";

export const liverKidneyDeoria = {
  category: "liver-kidney-test",
  city: "deoria",

  /* 45 characters. The root layout appends " | MedicoBharat", so Google renders
     60 — just inside the ~60 it will show. The abbreviations lead because that
     is what is written on the prescription and typed into the search box. */
  title: "Deoria Me LFT Aur KFT Test — Liver Aur Kidney",

  /* ~129 characters. Hinglish, with the English terms that must match left
     intact: LFT, KFT, SGPT, creatinine. */
  description:
    "Deoria me LFT aur KFT test me kya-kya aata hai, SGPT aur creatinine kis baat se badalte hain, aur inme fasting lagti hai ya nahi.",

  /* Ordered strongest first. Every term here appears in the visible copy. */
  keywords: [
    "LFT Test in Deoria",
    "KFT Test in Deoria",
    "Liver Function Test in Deoria",
    "Kidney Function Test in Deoria",
    "SGPT SGOT Test in Deoria",
    "Creatinine Test in Deoria",
    "Bilirubin Test Deoria",
    "Urea Creatinine Test Deoria",
    "Peeliya Ka Test Deoria",
    "Liver Test at Home in Deoria",
    "Blood Test at Home in Deoria",
    "Home Sample Collection Deoria",
    "Lab Test in Deoria",
    "Kidney Test Barhaj Rudrapur Deoria",
  ],

  canonical: canonicalFor("liver-kidney-test", "deoria"),
  robots: INDEXABLE,
  author: BLOG_AUTHOR,
  publisher: BLOG_PUBLISHER,

  publishedAt: "2026-09-02",
  updatedAt: "2026-09-02",

  /* Stated rather than computed. Update it when the article grows a section. */
  readingMinutes: 9,

  /** The skimmer's version of the whole article. */
  takeaways: [
    "LFT aur KFT do panel hain, do akele test nahi — LFT me SGPT, SGOT aur bilirubin jaise hisse aate hain, KFT me creatinine aur urea jaise.",
    "Dono me aam taur par fasting nahi lagti. Fasting tab aati hai jab inke saath sugar ya lipid bhi ho raha ho, ya package me ho rahe hon.",
    "Sugar ya BP ki dawa chal rahi hai to KFT saal me ek baar — kidney par asar ka sabse pehla ishara yahin milta hai, aur wo shikayat se bahut pehle milta hai.",
    "Dard ki goli, purani chalti dawa, sharaab aur bina jaanch wale desi nuskhe — ye chaaron report ko badalte hain. Inhe chhipaana report ko bekaar kar deta hai.",
    "Ek number ka badha hona bimari nahi hoti. Faisla doctor lakshan, purani report aur dobara jaanch — teenon ko milakar karta hai.",
  ],

  sections: [
    {
      id: "lft-kft-kya-hain-deoria",
      heading: "LFT Aur KFT Kya Hain — Do Chup Rehne Wale Ang Ki Jaanch",
      lead: "Liver aur kidney dono kaafi der tak shikayat nahi karte. Isi liye inhe jaancha jaata hai.",
      blocks: [
        "LFT ka poora naam Liver Function Test hai aur KFT ka Kidney Function Test. Dono ek akela test nahi, ek panel hain — yaani kai numbers ek saath, jinhe milakar padha jaata hai. Isi liye report me ek hi jagah paanch-chhah line dikhti hain, aur isi liye kisi ek line ko alag se uthakar matlab nikalna galat hota hai.",
        "In dono ango ki khaas baat ye hai ki ye kaafi der tak apna kaam adhoore roop me bhi chalate rehte hain. Jab tak saaf lakshan dikhte hain — aankhon ya peshab ka rang badalna, pair par sujan, bhookh khatam ho jaana, bahut thakan — tab tak sthiti kaafi aage badh chuki hoti hai. Isi liye Deoria me in do panel ko do halaton me likha jaata hai: ya to koi shikayat aa gayi ho, ya sugar-BP jaisi koi cheez pehle se chal rahi ho aur uska asar dekhna ho.",
        {
          note: {
            title: "Ye jaanch ki guide hai, ilaaj ki nahi",
            text: "Yahan ye likha hai ki in panel me kya aata hai, unhe kis baat se badalte dekha jaata hai, aur fasting tatha dobara jaanch ka kya niyam hai. Yahan ye nahi likha ki kaunsa number kitna hona chahiye, uska kya matlab hai, ya kaun si dawa leni hai. Report ka matlab aapka doctor nikaalta hai, aur sirf wahi nikaal sakta hai.",
            tone: "warn",
          },
        },
      ],
    },

    {
      id: "lft-test-deoria-kya-aata-hai",
      heading: "LFT Test In Deoria — Liver Function Test Me Kya-Kya Aata Hai",
      lead: "Ek parche par likhi ek line, report me kai numbers.",
      blocks: [
        "Jab doctor \"LFT\" likhta hai to wo ek panel maang raha hota hai. Alag-alag lab ke panel me thoda farak ho sakta hai, lekin aam taur par ismein ye hisse aate hain — aur inhe alag-alag nahi, ek saath padha jaata hai.",
        {
          list: [
            "SGPT (ALT) aur SGOT (AST) — liver ke enzyme. Inka badhna liver par kisi na kisi dabav ka ishara hota hai, aur wo dabav kai wajah se ho sakta hai.",
            "Bilirubin (total aur direct) — peeliya me sabse zyada dekha jaane wala hissa yahi hai.",
            "Alkaline Phosphatase (ALP) — liver aur pitt ki nali dono se juda number.",
            "Total protein aur albumin — liver ka lamba kaam ye batate hain, ek din ka nahi.",
            "GGT — kuch panel me hota hai; doctor iske hisaab se aage tay karta hai.",
          ],
        },
        "Ek baat jo Deoria me sabse zyada uljhan paida karti hai: SGPT ka thoda upar hona bahut aam hai, aur akele us number se koi bimari tay nahi hoti. Wo dawa se, mote sharir se, sharaab se, kisi hue infection se, ya kuch hafte pehle ke bukhar se bhi upar dikh sakta hai. Isi liye doctor aksar use kuch hafte baad dobara karwata hai — dobara jaanch shak nahi, tareeka hai.",
        [
          "Bukhar ke saath peeliya jaisa lagna ho to doctor LFT ke saath bukhar ka panel bhi likhta hai; us par ",
          { text: "alag guide", href: BLOG_DENGUE_DEORIA },
          " hai.",
        ],
      ],
    },

    {
      id: "peeliya-aur-paani-deoria",
      heading: "Peeliya Aur Paani — Deoria Me Liver Ki Jaanch Kis Mausam Me Badhti Hai",
      lead: "Barsaat ke baad ka paani yahan sirf bukhar nahi laata.",
      blocks: [
        "Deoria jile me barsaat ke baad paani der tak thehra rehta hai, aur peene ke paani ka srot usi se prabhavit hota hai. Yahi wo mahine hote hain jab peeliya ke mamle badhte hain, aur ghar wale aksar ise dekhkar hi pehchan lete hain — aankhon ka peela pad jaana, peshab ka rang gehra ho jaana, bhookh ka bilkul khatam ho jaana, aur ulti.",
        {
          list: [
            "Peeliya jaisa lage to doctor ko dikhaana pehla kadam hai; test uske baad ka hai, uski jagah nahi.",
            "Doctor aam taur par LFT likhta hai, aur zaroorat par uske saath aur jaanch bhi — kya, ye wo aapke lakshan dekhkar tay karta hai.",
            "Ismein aksar ultrasound bhi likha jaata hai. Wo machine par hota hai aur humse nahi hota — uske liye imaging centre par jaana hi padega.",
            "Ghar me ek se zyada logon ko ek saath ye shikayat ho — jo yahan hota hai — to paani aur khaane ki safai par turant dhyaan dijiye, aur sabki jaanch ek hi visit me karwa lijiye.",
            "Peeliya me aaram aur khaan-paan ki salah doctor deta hai. Internet ke nuskhe is mamle me sabse zyada nuksaan pahunchate hain.",
          ],
        },
        [
          "Barsaat aur paani se hone wali bimariyon par service page ka ",
          { text: "alag section", href: LAB_DEORIA_FLOOD },
          " hai, aur us mausam me kaunsi jaanch zyada karayi jaati hai wo ",
          { text: "clinical guide", href: BLOG_LAB_DEORIA },
          " me likha hai.",
        ],
      ],
    },

    {
      id: "kft-test-deoria-kya-aata-hai",
      heading: "KFT Test In Deoria — Kidney Function Test Me Kya Dekha Jaata Hai",
      lead: "Creatinine akela nahi padha jaata.",
      blocks: [
        "KFT bhi ek panel hai. Ismein aam taur par ye hisse aate hain, aur inhe umar, wazan aur mareez ki halat ke saath milakar dekha jaata hai.",
        {
          list: [
            "Creatinine — sabse zyada jaana-pehchana number, lekin akele iska matlab nikalna sabse aam galti hai.",
            "Blood urea aur BUN — kidney ke kaam ka doosra ishara; ye paani ki kami se bhi hilte hain.",
            "Uric acid — kai panel me shaamil hota hai.",
            "Sodium, potassium jaise electrolyte — doctor ke kahe anusar.",
            "eGFR — kuch report me creatinine ke saath ginkar likha jaata hai; ise doctor hi padhta hai.",
            "Urine routine aur urine microalbumin — ye alag sample par hote hain aur kidney ki jaanch me aksar inhe saath likha jaata hai.",
          ],
        },
        {
          note: {
            title: "Creatinine paani se bhi hilta hai",
            text: "Bahut kam paani peene ke baad, ya garmi me kaam karne ke baad liya gaya sample creatinine ko thoda upar dikha sakta hai. Isi liye sample se pehle sadharan roop se paani peete rahiye — fasting me bhi saada paani mana nahi hai — aur ek number dekh kar ghabraiye mat. Doctor zaroorat lage to use dobara karwata hai.",
            tone: "info",
          },
        },
        [
          "Report ka header, method aur reference range kaise padhe jaate hain — aur kyun in numbers ko hamesha ek hi lab se karwana chahiye — wo ",
          { text: "yahan likha hai", href: BLOG_PATHOLOGY_DEORIA_ONELAB },
          ".",
        ],
      ],
    },

    {
      id: "sugar-bp-wale-mareez-kft-deoria",
      heading: "Sugar Ya BP Ki Dawa Chal Rahi Hai — KFT Saal Me Ek Baar Kyun",
      lead: "Kidney par asar ka pehla ishara shikayat se bahut pehle aata hai.",
      blocks: [
        "Deoria me sabse zyada KFT unhi logon ka hota hai jinhe kidney ki koi shikayat hai hi nahi — aur yahi iska sahi istemal hai. Sugar aur BP dono lambe samay me kidney par asar daal sakte hain, aur wo asar shuru me kisi lakshan ke bina hota hai. Isi liye dawa par chal rahe mareez ke liye saal me ek baar KFT aur urine microalbumin likha jaata hai; ye wahi jaanch hai jo sabse zyada chhoot jaati hai kyunki \"abhi to sab theek hai\".",
        {
          list: [
            "Sugar ki dawa par hain — saal me ek baar KFT aur urine microalbumin, doctor ke kahe anusar.",
            "BP ki dawa par hain — saal me ek baar KFT; kuch dawaiyon me doctor jaldi bhi bulata hai.",
            "Dono chal rahe hain — dono jaanch ek hi sample me ho jaati hain, alag visit nahi lagti.",
            "Dard ki goli lambe samay se chal rahi ho — ye baat doctor ko zaroor bataiye; wo apne hisaab se KFT ka antaraal tay karta hai.",
            "Ghar me kisi ko kidney ki bimari rahi ho — ye jaankari bhi doctor ke faisle me shaamil hoti hai.",
          ],
        },
        [
          "Sugar aur thyroid ki jaanch ka poora form aur follow-up ",
          { text: "us guide", href: BLOG_DIABETES_DEORIA },
          " me hai, aur service page par ",
          { text: "sugar-thyroid screening ka section", href: LAB_DEORIA_DIABETES },
          ". Saal ka routine ek saath karwana ho to ",
          { text: "full body checkup wali guide", href: BLOG_FULLBODY_DEORIA },
          " dekh lijiye — KFT aur LFT dono achhe package ka hissa hote hain.",
        ],
      ],
    },

    {
      id: "lft-kft-table-deoria",
      heading: "Ek Nazar Me — LFT Aur KFT, Kis Ke Liye Aur Fasting Chahiye Ya Nahi",
      lead: "Booking se pehle isi table par ek nazar daal lijiye.",
      blocks: [
        "Ye aam salah hai, koi vyaktigat salah nahi. Doctor ne alag antaraal likha ho to wahi chalega — parche ki photo booking ke waqt bhej dijiye.",
        {
          table: {
            caption: "LFT aur KFT — aam salah",
            head: ["Test", "Kis ke liye", "Aam taur par kitni baar", "Fasting"],
            rows: [
              [
                "LFT (Liver Function Test)",
                "Peeliya jaisa lakshan, lambi dawa, ya routine ke hisse ke roop me",
                "Saal me ek baar; shikayat ho to doctor ke kahe anusar",
                "Aam taur par nahi",
              ],
              [
                "KFT (Kidney Function Test)",
                "Sugar ya BP ki dawa par ho, ya pair par sujan jaisi shikayat ho",
                "Saal me ek baar; dawa par ho to doctor ke kahe anusar",
                "Aam taur par nahi",
              ],
              [
                "Urine Routine",
                "Peshab me jalan, jhaag, rang ka badalna",
                "Doctor ke kahe anusar",
                "Nahi",
              ],
              [
                "Urine Microalbumin",
                "Sugar ki dawa par chal rahe mareez",
                "Saal me ek baar",
                "Nahi",
              ],
              [
                "LFT + KFT ek saath",
                "Routine checkup ya package me",
                "Saal me ek baar",
                "Package me haan, kyunki usme sugar aur lipid bhi hote hain",
              ],
              [
                "Ultrasound (pet ka)",
                "Doctor likhe to",
                "Doctor ke kahe anusar",
                "Centre par hota hai — humse nahi hota",
              ],
            ],
          },
        },
        [
          "Fasting ka poora ganit aur slot chunne ka tareeka ",
          { text: "ghar par sample wali guide", href: BLOG_HOME_DEORIA_FASTING },
          " me hai. Har test ka rate ",
          { text: "Deoria ki price list", href: LAB_DEORIA_PRICE },
          " me — is guide me ek bhi number jaan-boojh kar nahi likha gaya.",
        ],
      ],
    },

    {
      id: "dawa-sharab-nuskha-deoria",
      heading: "Dawa, Sharaab Aur Bina Jaanch Wale Nuskhe — Test Se Pehle Batane Wali Baatein",
      lead: "Ye jaankari chhipaane se report bekaar ho jaati hai, sahi nahi.",
      blocks: [
        "Liver aur kidney ke numbers un cheezon se badalte hain jo aap roz lete hain. Lab ko aur doctor ko ye pata hona chahiye — is jaankari se koi faisla aapke khilaaf nahi hota, balki report ka sahi matlab nikalta hai.",
        {
          list: [
            "Dard ki goli — kamar, ghutne ya sar dard ke liye lambe samay se chal rahi ho to ye sabse zaroori jaankari hai.",
            "Sharaab — kitni aur kitne dinon se. Test se ek-do din pehle uska asar numbers par saaf dikhta hai, isliye ye baat batana zaroori hai.",
            "Bina jaanch wale desi ya jadi-booti ke nuskhe — bahut se nuskhe liver ke numbers hila dete hain. Inhe \"dawa nahi hai\" maankar chhod dena sabse aam galti hai.",
            "Bodybuilding ka protein powder ya supplement — ye creatinine par asar daal sakta hai.",
            "Bukhar ya koi infection abhi-abhi hua ho — ye baat report padte waqt doctor ke kaam aati hai.",
            "Pehle karayi gayi report — LFT aur KFT dono me tulna sabse zyada kaam ki cheez hai.",
          ],
        },
        {
          note: {
            title: "Dawa apne aap band nahi karni hai",
            text: "Test se pehle koi niyamit dawa rokni hai ya nahi, ye sirf aapka doctor tay karta hai. Ye page kisi dawa ko rokne ya shuru karne ki salah nahi deta. Jo chal raha hai use booking ke waqt bata dijiye — bas itna kaafi hai.",
            tone: "warn",
          },
        },
      ],
    },

    {
      id: "ghar-se-sample-lft-kft-deoria",
      heading: "Deoria Me LFT Aur KFT Ghar Se Kaise Hote Hain",
      lead: "Dono khoon ke sample par hote hain — kahin jaana zaroori nahi.",
      blocks: [
        "LFT aur KFT dono khoon ke sample par hote hain, aur urine routine ya microalbumin ke liye peshab ka sample ghar par hi de diya jaata hai — bartan collection ke waqt mil jaata hai ya pehle se bata diya jaata hai. Trained phlebotomist ID card ke saath ghar aata hai, sample aapke saamne leta hai, aur report 24 ghante ke andar WhatsApp aur email par PDF me aati hai.",
        {
          list: [
            "Fasting aam taur par nahi lagti — slot din me kabhi bhi liya ja sakta hai. Package me ho raha ho to subah 6 baje ka pehla slot lijiye.",
            "Sample se pehle sadharan roop se paani peete rahiye; paani ki kami creatinine aur urea dono par asar daalti hai.",
            "Urine ka sample dena ho to subah ka pehla peshab sabse achha maana jaata hai — ye booking ke waqt bata diya jaata hai.",
            "Ghar ke kai logon ka test ek hi visit me ho jaata hai, aur collection tab bhi free rehta hai.",
            "Payment sample lene ke waqt, cash ya UPI se, wahi rate jo pehle bataya gaya tha.",
          ],
        },
        [
          "Visit ke din kya hota hai, bujurg aur bistar par pade mareez ka kya dhyaan rakha jaata hai — us par ",
          { text: "poori guide", href: BLOG_HOME_DEORIA },
          " hai. Coverage — Deoria Sadar, Rudrapur, Barhaj, Bhatpar Rani, Gauri Bazar, Baitalpur, Lar aur Bhatni — ",
          { text: "home collection wale section", href: LAB_DEORIA_HOME },
          " me likhi hai; Salempur tehsil ke liye ",
          { text: "uska apna page", href: LAB_SALEMPUR },
          " hai.",
        ],
      ],
    },

    {
      id: "report-ke-baad-lft-kft-deoria",
      heading: "Report Aa Gayi — Ab Kya, Aur Dobara Kab",
      lead: "Ek number ka badha hona bimari nahi hota.",
      blocks: [
        "In dono panel me kisi ek line ke aage \"High\" likha mil jaana bahut aam hai. Wo apne aap me na diagnosis hai, na khatra. Doctor teen cheezein milakar padhta hai: aapke lakshan, purani report, aur zaroorat lage to dobara jaanch. Isi liye report ke saath purani report bhi le jaana chahiye — LFT aur KFT dono me farak hi asli jaankari deta hai.",
        {
          note: {
            title: "In haalaton me intezaar nahi kiya jaata",
            text: "Peshab ka bahut kam ho jaana ya bilkul band ho jaana; poore sharir ya chehre par tezi se sujan; saans phoolna; ulti band na hona; ya aankhon ka tezi se peela padna aur behoshi jaisa lagna — inme report ka intezaar nahi karte, mareez ko usi waqt doctor ya aspatal le jaate hain.",
            tone: "warn",
          },
        },
        [
          "Report kab aur kis roop me aati hai wo ",
          { text: "report wale section", href: LAB_DEORIA_REPORTS },
          " me hai. Gorakhpur me dikhana ho to report ek din pehle taiyaar rakhna sabse aasan rehta hai — ",
          { text: "us par alag hissa", href: LAB_DEORIA_GORAKHPUR },
          " hai. Bahar kaam karne wale ghar aaye hon to ",
          { text: "unke liye likha hissa", href: LAB_DEORIA_MIGRANT },
          " dekh lijiye.",
        ],
      ],
    },

    {
      id: "aage-kya-karein-lft-kft-deoria",
      heading: "Aage Kya Karein",
      lead: "Teen kadam, isi kram me.",
      blocks: [
        {
          list: [
            "Parcha dekhiye — LFT likha hai, KFT, ya dono. Saath me urine ka koi test likha ho to wo bhi, kyunki uske liye sample alag hota hai.",
            "Jo dawa, supplement ya nuskha chal raha hai uski list bana lijiye aur booking ke waqt bata dijiye.",
            "Purani report nikaal kar rakh lijiye. Doctor ko dono saath dikhaiye — is jaanch me tulna hi sabse zyada kaam aati hai.",
          ],
        },
        [
          "Booking ke liye ",
          { text: "Deoria ka form", href: LAB_DEORIA_BOOK },
          " bhar dijiye ya ",
          { text: "call kar lijiye", href: CONTACT },
          ". Saal ka poora routine ek saath karana ho to ",
          { text: "package ka menu", href: LAB_DEORIA_FULLBODY },
          " dekh lijiye, aur sample dene ki jagah tatha mohalla coverage ",
          { text: "diagnostic centre wali guide", href: BLOG_PATHOLOGY_DEORIA },
          " me hai.",
        ],
      ],
    },
  ],

  /* Seven questions in this post's own lane — fasting, SGPT ka thoda badhna,
     peeliya, creatinine dobara, sugar/BP wale ka saalana KFT, sharaab aur
     dawa ka disclosure, aur ek hi sample me dono. Checked against
     /lab-test/deoria (8), /blogs/lab-test/deoria (7),
     /blogs/pathology-lab/deoria (7), /blogs/diabetes-thyroid-test/deoria (7),
     /blogs/full-body-checkup/deoria (7), /blogs/dengue-typhoid-test/deoria (7)
     and /blogs/home-sample-collection/deoria (7). */
  faqs: [
    {
      question: "LFT aur KFT me khaali pet rehna padta hai kya?",
      answer:
        "Aam taur par nahi. Dono panel ke liye fasting zaroori nahi hoti, isliye sample din me kabhi bhi diya ja sakta hai. Fasting sirf do halaton me aati hai: doctor ne inke saath fasting sugar ya lipid profile bhi likha ho, ya aap poora package karwa rahe hon — package me sugar aur lipid dono hote hain, isliye wo hamesha khaali pet hota hai. Ek baat dhyaan rakhiye: fasting ho ya na ho, saada paani peete rahiye. Paani ki kami creatinine aur urea dono ko thoda upar dikha sakti hai.",
    },
    {
      question: "SGPT thoda badha hua aaya hai — kya ye ghabraane ki baat hai?",
      answer:
        "Report ka matlab aapka doctor hi nikaalega, aur wo ise akele nahi padhta — lakshan, purani report aur baaki numbers ke saath padhta hai. Itna zaroor jaan lijiye ki SGPT ka thoda upar hona bahut aam hai aur wo kai sadharan wajah se ho sakta hai: koi dawa chal rahi ho, kuch hafte pehle bukhar hua ho, wazan zyada ho, sharaab li ho, ya koi bina jaanch wala nuskha chal raha ho. Isi liye doctor aksar kuch hafte baad dobara karwata hai — dobara jaanch shak nahi, tareeka hai. Us beech jo bhi dawa ya nuskha chal raha hai, use doctor ko bata dijiye.",
    },
    {
      question: "Aankhein peeli lag rahi hain — kaunsa test karana chahiye?",
      answer:
        "Pehla kadam doctor ko dikhaana hai, test uske baad ka hai. Aam taur par is haalat me LFT likha jaata hai, jismein bilirubin bhi aata hai, aur doctor lakshan ke hisaab se aur jaanch bhi jod sakta hai. Ismein aksar pet ka ultrasound bhi likha jaata hai — wo machine par hota hai, humse nahi hota, aur uske liye imaging centre par jaana padega; khoon wali jaanch ghar se ho jaati hai. Ghar me ek se zyada logon ko ek saath ye shikayat ho to peene ke paani aur khaane ki safai par turant dhyaan dijiye, aur sabka sample ek hi visit me karwa lijiye.",
    },
    {
      question: "Creatinine badha hua aaya hai — dobara test kitne din baad karwana chahiye?",
      answer:
        "Wo tareekh aapka doctor batata hai, kyunki wo aapki umar, dawa aur baaki numbers dekhkar tay hoti hai — kisi ko kuch dinon me dobara chahiye, kisi ko mahine bhar baad. Do cheezein aap apni taraf se kar sakte hain: sample se pehle sadharan roop se paani peete rahiye, kyunki paani ki kami se ye number thoda upar dikh sakta hai; aur dobara jaanch usi lab se karwaiye jahan pehli hui thi, kyunki alag analyser ke numbers ki tulna galat raaste par le jaati hai. Purani report saath rakhiye — is jaanch me farak hi asli jaankari hai.",
    },
    {
      question: "Sugar aur BP ki dawa chal rahi hai — kidney ke liye saal me kya karana chahiye?",
      answer:
        "Aam salah ye hai ki saal me ek baar KFT aur urine microalbumin karwa liya jaaye, aur ye antaraal aapka doctor apne hisaab se badal sakta hai. Iska maqsad ye hai ki kidney par asar ka pehla ishara shikayat aane se bahut pehle mil jaaye — is stage par koi lakshan nahi hota, isi liye ye jaanch sabse zyada chhoot jaati hai. KFT aur urine wale test ek hi visit me ho jaate hain, aur inke saath HbA1c bhi ho raha ho to alag visit nahi lagti. Dard ki goli lambe samay se chal rahi ho to ye baat doctor ko zaroor bataiye.",
    },
    {
      question: "Sharaab peene wale ko LFT se pehle kya batana chahiye?",
      answer:
        "Kitni leti hai aur kitne dinon se — ye baat doctor ko saaf bata dijiye. Ismein koi faisla aapke khilaaf nahi hota; ye jaankari isliye zaroori hai kyunki liver ke numbers uske asar se badalte hain, aur bina is jaankari ke report ka matlab galat nikal sakta hai. Test se ek-do din pehle liya gaya sample ye asar aur saaf dikhata hai. Yahi baat dard ki goli, lambe samay se chal rahi kisi bhi dawa, protein supplement aur bina jaanch wale desi nuskhon par bhi lagu hoti hai — inhe \"dawa nahi hai\" maankar chhod dena sabse aam galti hai.",
    },
    {
      question: "LFT aur KFT dono likhe hain — kya do baar sample dena padega?",
      answer:
        "Nahi. Dono khoon ke sample par hote hain aur ek hi visit me ho jaate hain; alag test ke liye alag rang ki tube bharni pad sakti hai, lekin sui ek hi baar lagti hai. Iske saath sugar, thyroid ya lipid bhi likha ho to wo bhi usi sample me ho jaate hain — bas fasting ka niyam un test ka lagu ho jaayega. Haan, doctor ne urine routine ya microalbumin likha hai to peshab ka sample alag se dena hoga; uske liye bartan collection ke waqt mil jaata hai ya pehle se bata diya jaata hai, aur aam taur par subah ka pehla peshab sabse achha maana jaata hai.",
    },
  ],

  relatedLinks: {
    heading: "Deoria Ke Liye Aage Ki Jaankari",
    intro:
      "Is guide me LFT aur KFT hain. Kaun sa test kab karana chahiye wo clinical guide me, ghar par visit ka tareeka home collection guide me, aur rate sirf service page par.",
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
            href: BLOG_FULLBODY_DEORIA,
            label: "Deoria me full body checkup kaise chunein",
            sub: "Daam kis baat par tay hota hai, aur package me KFT-LFT hain ya nahi",
          },
          {
            href: BLOG_HOME_DEORIA,
            label: "Deoria me ghar par blood test kaise karayein",
            sub: "Visit ke din ka poora tareeka, bujurg aur bachchon ka dhyaan",
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
            href: LAB_DEORIA_PRICE,
            label: "Deoria me lab test ka rate list",
            sub: "LFT, KFT, urine aur package — sab ek jagah",
          },
          {
            href: LAB_DEORIA_PREPARE,
            label: "Sample dene se pehle ki taiyaari",
          },
          {
            href: LAB_DEORIA_REPORTS,
            label: "Report kab milegi aur kaise aayegi",
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
          {
            href: BLOG_LIVER_KIDNEY_VARANASI,
            label: "Varanasi me LFT aur KFT",
            sub: "Wahi guide, Varanasi ke liye",
          },
        ],
      },
    ],
  },
};
