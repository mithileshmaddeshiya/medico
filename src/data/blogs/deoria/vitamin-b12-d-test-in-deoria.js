/**
 * /blogs/vitamin-b12-d-test/deoria — the "thakan aur kamzori" panel.
 *
 * ── THE LANE ─────────────────────────────────────────────────────────────
 * The eighth Deoria URL, and the one the others kept pointing at without
 * having anywhere to send anybody:
 *
 *   /lab-test/deoria                       → book kahan se, rate, menu
 *   /blogs/lab-test/deoria                 → kaun sa test kab (clinical)
 *   /blogs/pathology-lab/deoria            → sample dene kahan (geography)
 *   /blogs/home-sample-collection/deoria   → ghar par kaise hota hai
 *   /blogs/diabetes-thyroid-test/deoria    → sugar/thyroid/lipid ka form
 *   /blogs/full-body-checkup/deoria        → kaun sa package, kis ke liye
 *   /blogs/dengue-typhoid-test/deoria      → bukhar ki jaanch
 *   /blogs/liver-kidney-test/deoria        → LFT aur KFT
 *   /blogs/vitamin-b12-d-test/deoria       → thakan, kamzori, CBC (this)
 *
 * CBC lives HERE and not on the fever page on purpose. The fever guide needs
 * CBC as a platelet trend — one paragraph, in service of dengue. The query
 * "CBC test price in Deoria" is a different person entirely: tired, not
 * feverish, usually a woman, usually with "khoon ki kami" already suspected at
 * home. That reader needs what a CBC contains, what it does not settle on its
 * own, and what is checked alongside it — which is this page.
 *
 * ── WHY THIS IS DEORIA'S PAGE ────────────────────────────────────────────
 * /lab-test/deoria carries #anaemia-women-children-deoria because anaemia in
 * women and girls is the district's most common quiet finding, and
 * /blogs/pathology-lab/deoria already names the local pattern in one line —
 * mostly vegetarian households, so B12 deficiency is common and haemoglobin
 * alone gets treated with an iron tablet. This page is that one line opened
 * out, with the second local fact beside it: a district with no shortage of
 * sunlight still returns low vitamin D, because the people who work indoors
 * and the people who work covered from the sun are both here.
 *
 * ── THE LINE THIS PAGE MUST NOT CROSS ────────────────────────────────────
 * No dose, no brand, no "kitni goli". Supplements are the single easiest thing
 * for a lab page to start prescribing, and this one does not — it says which
 * test, when it is repeated, and that starting or stopping anything is the
 * doctor's call. The one hard instruction it does give is the reverse: tell
 * the lab and the doctor what supplement is ALREADY running, because a B12
 * result taken during treatment reads differently.
 *
 * ── FAQs ─────────────────────────────────────────────────────────────────
 * "Haemoglobin kam aaya hai — sirf iron ki goli kaafi hai?" is NOT asked here.
 * /blogs/lab-test/deoria owns it. The section on ferritin covers the same
 * ground in prose without duplicating the FAQPage entry.
 *
 * ── NO PRICES, NO NEW CLAIMS ─────────────────────────────────────────────
 * Not one rate — including in the section that answers "CBC test price in
 * Deoria", which explains what sets the amount and links to the one file that
 * carries it. Only the five confirmed claims: free home collection, trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI
 * on collection.
 *
 * ── IMAGES: NONE ─────────────────────────────────────────────────────────
 * og:image resolves to /blogs/vitamin-b12-d-test/deoria/og.
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
const LAB_DEORIA_ANAEMIA = "/lab-test/deoria#anaemia-women-children-deoria";
const LAB_DEORIA_FULLBODY = "/lab-test/deoria#full-body-checkup-deoria";
const LAB_DEORIA_PRICE = "/lab-test/deoria#lab-test-price-deoria";
const LAB_DEORIA_PREPARE = "/lab-test/deoria#prepare-for-test-deoria";
const LAB_DEORIA_REPORTS = "/lab-test/deoria#reports-deoria";
const LAB_DEORIA_BOOK = "/lab-test/deoria#how-to-book-deoria";
const LAB_DEORIA_HOME = "/lab-test/deoria#home-sample-collection-deoria";
const LAB_DEORIA_MIGRANT = "/lab-test/deoria#migrant-workers-checkup-deoria";
const LAB_DEORIA_DIABETES = "/lab-test/deoria#diabetes-thyroid-screening-deoria";

const LAB_SALEMPUR = "/lab-test/salempur";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_KUSHINAGAR = "/lab-test/kushinagar";

const BLOG_LAB_DEORIA = "/blogs/lab-test/deoria";
const BLOG_LAB_DEORIA_KAMZORI = "/blogs/lab-test/deoria#sugar-thyroid-aur-kamzori";
const BLOG_PATHOLOGY_DEORIA = "/blogs/pathology-lab/deoria";
const BLOG_PATHOLOGY_DEORIA_ONELAB =
  "/blogs/pathology-lab/deoria#report-aur-ek-hi-lab-deoria";
const BLOG_HOME_DEORIA = "/blogs/home-sample-collection/deoria";
const BLOG_HOME_DEORIA_MAHILA =
  "/blogs/home-sample-collection/deoria#mahilaon-ke-liye-ghar-par-sample-deoria";
const BLOG_HOME_DEORIA_BACHCHE = "/blogs/home-sample-collection/deoria#bachchon-ka-sample-deoria";
const BLOG_FULLBODY_DEORIA = "/blogs/full-body-checkup/deoria";
const BLOG_DIABETES_DEORIA = "/blogs/diabetes-thyroid-test/deoria";
const BLOG_DENGUE_DEORIA = "/blogs/dengue-typhoid-test/deoria";
const BLOG_LIVER_KIDNEY_DEORIA = "/blogs/liver-kidney-test/deoria";

const CONTACT = "/contact";

export const vitaminB12DDeoria = {
  category: "vitamin-b12-d-test",
  city: "deoria",

  /* 37 characters. The root layout appends " | MedicoBharat", so Google renders
     52 — comfortably inside the ~60 it will show. All three names are in the
     title because all three are separate queries. */
  title: "Deoria Me Vitamin D, B12 Aur CBC Test",

  /* ~139 characters. Hinglish, with the English terms that must match left
     intact: CBC, haemoglobin, ferritin, vitamin D, B12. */
  description:
    "Deoria me thakan aur kamzori par kaunse test hote hain — CBC, haemoglobin, ferritin, vitamin D aur B12, aur inme fasting lagti hai ya nahi.",

  /* Ordered strongest first. Every term here appears in the visible copy. */
  keywords: [
    "Vitamin D Test in Deoria",
    "Vitamin B12 Test in Deoria",
    "Vitamin D and B12 Test Deoria",
    "CBC Test Price in Deoria",
    "CBC Test in Deoria",
    "Haemoglobin Test in Deoria",
    "Khoon Ki Kami Ka Test Deoria",
    "Anaemia Test in Deoria",
    "Ferritin Test in Deoria",
    "Thakan Aur Kamzori Ka Test Deoria",
    "Blood Test at Home in Deoria",
    "Home Sample Collection Deoria",
    "Lab Test in Deoria",
    "Mahilaon Ka Blood Test Deoria",
  ],

  canonical: canonicalFor("vitamin-b12-d-test", "deoria"),
  robots: INDEXABLE,
  author: BLOG_AUTHOR,
  publisher: BLOG_PUBLISHER,

  publishedAt: "2026-09-02",
  updatedAt: "2026-09-02",

  /* Stated rather than computed. Update it when the article grows a section. */
  readingMinutes: 9,

  /** The skimmer's version of the whole article. */
  takeaways: [
    "Thakan ki jaanch ek test nahi hoti. Aam taur par CBC ke saath ferritin, vitamin B12, vitamin D aur thyroid dekhe jaate hain — kaun sa, ye doctor tay karta hai.",
    "CBC ek panel hai, ek number nahi — haemoglobin uska ek hissa hai. Isi liye \"haemoglobin karwa lo\" aur \"CBC karwa lo\" ek baat nahi hai.",
    "In me se kisi test me fasting nahi lagti. Slot din me kabhi bhi liya ja sakta hai — yahi wajah hai ki ye sabse aasan test hain aur sabse zyada taale jaate hain.",
    "B12 ki goli ya injection pehle se chal raha ho to test se pehle ye zaroor bataiye — ilaaj ke beech liya gaya sample alag padha jaata hai.",
    "Vitamin D dhoop wale jile me bhi kam nikalta hai, kyunki dhoop kitni mili ye kaam aur kapdon par nirbhar karta hai, mausam par nahi.",
  ],

  sections: [
    {
      id: "thakan-kamzori-deoria",
      heading: "Thakan Aur Kamzori — Deoria Me Sabse Zyada Anadekhi Ki Jaane Wali Shikayat",
      lead: "\"Kamzori hai\" ek lakshan hai, koi bimari nahi. Jaanch usi ko naam deti hai.",
      blocks: [
        "Deoria me sabse zyada boli jaane wali shikayat yahi hai — hamesha thaka rehna, kaam me man na lagna, chakkar aana, saans jaldi phool jaana, baal jhadna, haath-pair me jhunjhuni. Aur sabse zyada ise hi taala jaata hai, kyunki ise bimari nahi maana jaata. Ghar me tay ho jaata hai ki \"kamzori hai\", bazaar se koi tonic ya iron ki goli aa jaati hai, aur baat wahin ruk jaati hai.",
        "Dikkat ye hai ki ek jaisi thakan ke peechhe kai alag wajah ho sakti hain — khoon ki kami, vitamin B12 ki kami, vitamin D ki kami, thyroid ka badal jaana, ya sugar. Inka ilaaj alag hai. Isi liye jaanch ka maqsad thakan ko naapna nahi, uski wajah ko naam dena hota hai.",
        {
          note: {
            title: "Ye jaanch ki guide hai, ilaaj ki nahi",
            text: "Yahan ye likha hai ki kaunse test hote hain, unme fasting lagti hai ya nahi, aur unhe dobara kab dekha jaata hai. Yahan koi dawa, koi supplement, koi dose ya kisi cheez ki matra nahi likhi gayi — wo faisla sirf aapke doctor ka hai. Report ke number dekh kar apne aap goli shuru ya band kar dena is mamle me sabse aam galti hai.",
            tone: "warn",
          },
        },
        [
          "Kamzori par Deoria ke teen sabse aam sawaal ",
          { text: "clinical guide", href: BLOG_LAB_DEORIA_KAMZORI },
          " me hain. Ye page unme se ek — vitamin aur khoon ki kami — ko poora kholta hai.",
        ],
      ],
    },

    {
      id: "cbc-test-deoria",
      heading: "CBC Test In Deoria — Ismein Kya Aata Hai, Aur Daam Kis Baat Par Tay Hota Hai",
      lead: "CBC ek panel hai. Haemoglobin uska ek hissa hai, poora test nahi.",
      blocks: [
        "CBC ka poora naam Complete Blood Count hai, aur ye khoon ki ginti ka panel hai — ek akela number nahi. Isi liye \"sirf haemoglobin karwa lo\" aur \"CBC karwa lo\" do alag baatein hain. CBC me aam taur par ye sab aata hai:",
        {
          list: [
            "Haemoglobin — khoon ki kami ka sabse jaana-pehchana hissa.",
            "RBC aur uske saath MCV, MCH jaise numbers — inhi se ishara milta hai ki kami iron ki taraf ki hai ya B12 ki taraf ki.",
            "WBC aur uski ginti ke hisse — infection ke silsile me inhe dekha jaata hai.",
            "Platelet count — bukhar ke mausam me sabse zyada dekha jaane wala number.",
            "PCV, RDW jaise numbers — inhe doctor baaki ke saath milakar padhta hai.",
          ],
        },
        "Iska daam is baat par tay hota hai ki aap sirf CBC karwa rahe hain, ya uske saath ferritin, vitamin B12 aur vitamin D bhi. CBC apne aap me un test me hai jinka rate sabse kam padta hai; jo cheez daam badhati hai wo vitamin wale test hain, kyunki unke liye alag reagent aur alag machine lagti hai. Home sample collection Deoria me free hai, isliye usse daam par koi farak nahi padta.",
        [
          "Har test ka rate ",
          { text: "Deoria ki price list", href: LAB_DEORIA_PRICE },
          " me ek hi jagah likha hai — is guide me ek bhi number jaan-boojh kar nahi likha gaya, taaki rate do pages par alag-alag na ho jaaye. Package me CBC pehle se shaamil hota hai; ",
          { text: "package ka menu", href: LAB_DEORIA_FULLBODY },
          " ek baar dekh lijiye.",
        ],
        [
          "Bukhar ke dinon me CBC dobara kyun dekha jaata hai aur platelet ko dhaara ki tarah kaise padha jaata hai — wo ",
          { text: "bukhar wali guide", href: BLOG_DENGUE_DEORIA },
          " me hai.",
        ],
      ],
    },

    {
      id: "haemoglobin-ferritin-deoria",
      heading: "Khoon Ki Kami — Haemoglobin Ke Aage Ferritin Kyun Dekha Jaata Hai",
      lead: "Haemoglobin batata hai ki kami hai. Ferritin batata hai ki zakhira kitna bacha hai.",
      blocks: [
        "Deoria me sabse aam kahani ye hai: haemoglobin kam aaya, iron ki goli shuru ho gayi, kuch hafte baad thakan waisi ki waisi. Wajah aksar ye hoti hai ki kami sirf iron ki thi hi nahi. Isi liye doctor haemoglobin ke saath do aur cheezein dekhta hai.",
        {
          list: [
            "Ferritin — sharir me iron ka zakhira. Haemoglobin theek dikhne par bhi ferritin kam ho sakta hai, aur thakan wahin se aati hai.",
            "Vitamin B12 — kami hone par khoon ki ginti bhi badalti hai aur thakan bhi rehti hai; ismein iron ki goli se kuch nahi hota.",
            "CBC ke andar ke MCV jaise numbers — ye ishara dete hain ki kami kis taraf ki ho sakti hai.",
            "Thyroid (TSH) — thakan aur wazan ki shikayat me ise saath likha jaata hai.",
          ],
        },
        "Mahilaon aur teenage ladkiyon me ye jaanch sabse zyada zaroori hoti hai aur sabse zyada chhoot jaati hai. Periods ke dauraan hone wali kami, garbhavastha, aur khaan-paan — teenon milkar is jile me anaemia ko aam bana dete hain.",
        [
          "Auraton aur bachchon me khoon ki kami par service page ka ",
          { text: "anaemia wala section", href: LAB_DEORIA_ANAEMIA },
          " padh lijiye. Thyroid ka poora hissa ",
          { text: "sugar-thyroid wali guide", href: BLOG_DIABETES_DEORIA },
          " me hai.",
        ],
      ],
    },

    {
      id: "vitamin-b12-test-deoria",
      heading: "Vitamin B12 Test In Deoria — Shaakahaari Khaan-Paan Wale Jile Ki Aam Kami",
      lead: "Ye kami dheere aati hai, aur uske lakshan aksar kisi aur cheez ke maane jaate hain.",
      blocks: [
        "Vitamin B12 zyadatar mans, machhli, anda aur doodh se milta hai. Deoria jaise zyadatar shaakahaari jile me iski kami aam hai — aur ye ek din me nahi hoti, saalon me hoti hai. Isi liye jab tak pata chalta hai, tab tak log ise apni aadat maan chuke hote hain.",
        {
          list: [
            "Hamesha rehne wali thakan aur kamzori, jo aaram se bhi nahi jaati.",
            "Haath-pair me jhunjhuni ya sunn pan jaisa lagna.",
            "Jeebh me jalan ya muh me chhaale bar-bar hona.",
            "Yaadasht aur dhyaan me farak, chidchidapan.",
            "Khoon ki ginti me badlav — isi liye CBC ke saath ise dekha jaata hai.",
          ],
        },
        {
          note: {
            title: "Goli ya injection pehle se chal raha ho to ye zaroor bataiye",
            text: "B12 ki goli ya injection chal raha ho aur usi beech test kara liya jaaye, to report ilaaj ke asar ke saath aati hai. Ye galat nahi hota, lekin ise usi roop me padha jaana chahiye. Isliye booking ke waqt aur doctor ko dono ko bata dijiye ki kya, kab se chal raha hai. Apne aap goli band kar ke test karwana theek nahi — ye faisla doctor ka hai.",
            tone: "warn",
          },
        },
        "Ek baat aur, jo Deoria me sabse zyada kaam ki hai: B12 ki kami un logon me bhi milti hai jo bahar kaam karte hain aur ghar se door khaate hain. Ghar aane par ek baar ye jaanch karwa lena sabse aasan mauka hota hai, kyunki report aane tak wo yahin rehte hain.",
        [
          "Bahar kaam karne walon ke liye ",
          { text: "alag hissa", href: LAB_DEORIA_MIGRANT },
          " service page par hai.",
        ],
      ],
    },

    {
      id: "vitamin-d-test-deoria",
      heading: "Vitamin D Test In Deoria — Dhoop Ki Kami Nahi Hai, Phir Bhi Kami Nikalti Hai",
      lead: "Sawaal ye nahi ki dhoop hai ya nahi. Sawaal ye hai ki aap tak pahunchti hai ya nahi.",
      blocks: [
        "Deoria me dhoop ki koi kami nahi, phir bhi vitamin D kam nikalna aam hai. Wajah seedhi hai: dhoop kitni mili ye mausam par nahi, aapke kaam aur kapdon par nirbhar karta hai. Din bhar dukaan, office ya ghar ke andar rehne wale, poore dhake hue kapdon me rehne wali mahilaayein, bujurg jo bahar kam nikalte hain, aur wo log jo subah nikal kar shaam ko lautte hain — in sab me ye kami milti hai.",
        {
          list: [
            "Kamar, ghutne aur pindliyon me lagataar dard ya khinchav.",
            "Hadiyon aur maanspeshiyon me kamzori, seedhi kursi se uthne me dikkat.",
            "Bar-bar thakan, aur kaam ke baad zyada der tak dard rehna.",
            "Bachchon me chalne-firne ya haddiyon ki shikayat — ismein doctor ko dikhana zaroori hai.",
          ],
        },
        "Vitamin D ka test aam taur par saal me ek baar se zyada nahi chahiye hota, aur agar ilaaj chal raha ho to dobara kab karana hai ye doctor tay karta hai — is test ko har mahine dohraane ka koi fayda nahi. Ismein fasting nahi lagti, isliye slot din me kabhi bhi liya ja sakta hai.",
        [
          "Kamar aur ghutne ke dard ke saath agar sugar ya thyroid ki shikayat bhi ho, to doctor un test ko saath likhta hai — unka form ",
          { text: "yahan", href: BLOG_DIABETES_DEORIA },
          " samjhaya gaya hai. Lambi dawa chal rahi ho to ",
          { text: "LFT-KFT wali guide", href: BLOG_LIVER_KIDNEY_DEORIA },
          " bhi ek baar dekh lijiye.",
        ],
      ],
    },

    {
      id: "kaun-sa-test-table-deoria",
      heading: "Ek Nazar Me — Thakan Par Kaun Sa Test, Fasting Aur Dobara Kab",
      lead: "Booking se pehle isi table par ek nazar daal lijiye.",
      blocks: [
        "Ye aam salah hai, koi vyaktigat salah nahi. Doctor ne aapke liye alag panel ya alag samay likha ho to wahi chalega — parche ki photo booking ke waqt bhej dijiye.",
        {
          table: {
            caption: "Thakan aur kamzori — aam salah",
            head: ["Test", "Kis ke liye", "Fasting", "Dobara aam taur par kab"],
            rows: [
              [
                "CBC",
                "Har thakan ki shikayat me, pehla test",
                "Nahi",
                "Doctor ke kahe anusar",
              ],
              [
                "Ferritin",
                "Haemoglobin kam ho, ya mahilaon aur ladkiyon me thakan ho",
                "Nahi",
                "Ilaaj chal raha ho to doctor ke kahe anusar",
              ],
              [
                "Vitamin B12",
                "Shaakahaari khaan-paan, jhunjhuni, lambi thakan",
                "Nahi",
                "Ilaaj ke baad doctor ke kahe anusar",
              ],
              [
                "Vitamin D",
                "Kamar-ghutne ka dard, andar rehne wala kaam, bujurg",
                "Nahi",
                "Aam taur par saal me ek baar",
              ],
              [
                "TSH (thyroid)",
                "Thakan ke saath wazan ya baal ki shikayat",
                "Nahi",
                "Saal me ek baar; dawa par ho to doctor ke kahe anusar",
              ],
              [
                "Blood sugar",
                "Thakan ke saath pyaas ya baar-baar peshab",
                "Fasting sugar me haan",
                "Saal me ek baar",
              ],
            ],
          },
        },
        [
          "Poora saal ka routine ek saath karana ho to alag-alag book karne ke bajaye package dekh lijiye — ",
          { text: "Deoria me full body checkup kaise chunein", href: BLOG_FULLBODY_DEORIA },
          " us par alag guide hai. Sugar aur thyroid ki screening service page par ",
          { text: "yahan", href: LAB_DEORIA_DIABETES },
          " hai.",
        ],
      ],
    },

    {
      id: "mahilayein-bachche-deoria",
      heading: "Mahilaayein, Ladkiyaan Aur Bachche — Deoria Me Sabse Zyada Zaroorat Yahin Hai",
      lead: "Aur sabse zyada ye jaanch yahin taali bhi jaati hai.",
      blocks: [
        "Is jile me ye jaanch sabse zyada jinke liye zaroori hai, wahi log sabse kam karwate hain. Wajah bimari ki gambhirta nahi hoti — wajah aksar itni hi hoti hai ki ghar se nikalna, kisi ke saath jaana aur line me lagna tay nahi ho paata. Ghar par sample lene se ye teenon rukavatein hat jaati hain, aur inme se kisi test me fasting bhi nahi lagti.",
        {
          list: [
            "Teenage ladkiyaan — periods shuru hone ke baad thakan ya chakkar ki shikayat par CBC aur ferritin.",
            "Mahilaayein — thakan, baal jhadna ya periods ki shikayat par CBC, ferritin, thyroid aur B12 ek saath.",
            "Garbhavastha me — doctor jo likhe wahi, aur booking ke waqt pregnancy ki jaankari de dijiye.",
            "Bachche — kamzori, bhookh na lagna ya padhai me dhyaan na lagne par doctor ke kahe anusar CBC aur vitamin.",
            "Bujurg — thakan aur haddiyon ke dard par vitamin D aur B12 dono, aur unka sample bistar par hi liya ja sakta hai.",
          ],
        },
        [
          "Mahilaon ke liye ghar par sample dene ka poora tareeka ",
          { text: "yahan likha hai", href: BLOG_HOME_DEORIA_MAHILA },
          ", aur bachchon ke sample ka ",
          { text: "yahan", href: BLOG_HOME_DEORIA_BACHCHE },
          ".",
        ],
      ],
    },

    {
      id: "ghar-se-sample-vitamin-deoria",
      heading: "Deoria Me Ye Jaanch Ghar Se Kaise Hoti Hai",
      lead: "Chaaron test khoon ke sample par, aur kisi me fasting nahi.",
      blocks: [
        "CBC, ferritin, vitamin B12 aur vitamin D — chaaron khoon ke sample par hote hain aur chaaron me fasting nahi lagti. Iska matlab ye hai ki slot din me kabhi bhi liya ja sakta hai aur kisi ko bhookha rehne ki zaroorat nahi. Trained phlebotomist ID card ke saath ghar aata hai, sample aapke saamne leta hai, aur report 24 ghante ke andar WhatsApp aur email par PDF me aati hai.",
        {
          list: [
            "Slot subah 6 baje se shuru hote hain, lekin in test ke liye subah zaroori nahi — apni suvidha ka waqt lijiye.",
            "Jo supplement pehle se chal raha ho — iron, B12, vitamin D, ya koi tonic — uska naam booking ke waqt bata dijiye.",
            "Ghar ke kai logon ka sample ek hi visit me ho jaata hai, aur collection tab bhi free hai.",
            "Payment sample lene ke waqt, cash ya UPI se, wahi rate jo pehle bataya gaya tha.",
            "Doctor ne inke saath sugar ya lipid bhi likha ho, tab fasting lagegi — us haalat me subah ka pehla slot lijiye.",
          ],
        },
        [
          "Visit ke din poora kya hota hai — pandrah minute ka hisaab — wo ",
          { text: "ghar par sample wali guide", href: BLOG_HOME_DEORIA },
          " me hai. Coverage aur slot ",
          { text: "home collection wale section", href: LAB_DEORIA_HOME },
          " me, aur sample se pehle ki taiyaari ",
          { text: "yahan", href: LAB_DEORIA_PREPARE },
          ".",
        ],
      ],
    },

    {
      id: "report-ke-baad-vitamin-deoria",
      heading: "Report Aa Gayi — Supplement Shuru Karne Se Pehle",
      lead: "Number apne aap koi goli nahi likhta.",
      blocks: [
        "Vitamin ki report par \"Low\" dekhte hi bazaar se koi supplement le aana — ye is poore mamle me sabse aam galti hai. Kitni matra, kitne dinon tak, aur khaali goli se kaam chalega ya kuch aur chahiye, ye faisla doctor lakshan aur baaki numbers dekhkar karta hai. Aur ilaaj shuru hone ke baad turant dobara test karwane ka koi fayda nahi hota — dobara kab, ye bhi doctor hi batata hai.",
        {
          list: [
            "Report doctor ko dikhaiye, aur uske saath purani report bhi le jaaiye — is jaanch me farak sabse zyada kaam ka hota hai.",
            "Jo supplement pehle se chal raha ho uska naam saath le jaaiye. Aadhi jaankari se poora faisla nahi hota.",
            "Ek number ke aage \"Low\" likha hona apne aap me poori kahani nahi hai; doctor use baaki panel ke saath padhta hai.",
            "Jo number aap mahino tak dekhenge — haemoglobin, ferritin, B12 — unhe hamesha ek hi lab se karaiye.",
          ],
        },
        [
          "Report ka header, method aur reference range kaise padhe jaate hain, wo ",
          { text: "yahan vistaar se likha hai", href: BLOG_PATHOLOGY_DEORIA_ONELAB },
          ", aur report kab tatha kaise aati hai wo ",
          { text: "report wale section", href: LAB_DEORIA_REPORTS },
          " me.",
        ],
      ],
    },

    {
      id: "aage-kya-karein-vitamin-deoria",
      heading: "Aage Kya Karein",
      lead: "Teen kadam, isi kram me.",
      blocks: [
        {
          list: [
            "Thakan kitne dinon se hai aur uske saath aur kya hai — jhunjhuni, dard, baal jhadna, wazan ka badalna — ye likh lijiye. Doctor ka panel isi se banta hai.",
            "Jo tonic, goli ya injection pehle se chal raha ho uska naam note kar lijiye aur booking ke waqt bata dijiye.",
            "Slot apni suvidha ka lijiye — in test me fasting nahi lagti, isliye subah ka intezaar karne ki zaroorat nahi.",
          ],
        },
        [
          "Booking ke liye ",
          { text: "Deoria ka form", href: LAB_DEORIA_BOOK },
          " bhar dijiye ya ",
          { text: "call kar lijiye", href: CONTACT },
          ". Kaun sa test kab karana chahiye us par poori clinical guide ",
          { text: "yahan hai", href: BLOG_LAB_DEORIA },
          ", aur sample dene ki jagah tatha mohalla coverage ",
          { text: "diagnostic centre wali guide", href: BLOG_PATHOLOGY_DEORIA },
          " me.",
        ],
      ],
    },
  ],

  /* Seven questions in this post's own lane — CBC me kya aata hai aur daam,
     fasting, chal raha supplement, vitamin D dobara, bachche, CBC vs
     haemoglobin, aur sudhaar dikhne me kitna samay. "Haemoglobin kam aaya hai
     — sirf iron ki goli kaafi hai?" is deliberately ABSENT:
     /blogs/lab-test/deoria owns it. Checked against all seven other Deoria
     FAQPage nodes. */
  faqs: [
    {
      question: "CBC test in Deoria — ismein kya-kya aata hai aur daam kis baat par tay hota hai?",
      answer:
        "CBC yaani Complete Blood Count khoon ki ginti ka panel hai, ek akela number nahi. Ismein haemoglobin, RBC aur uske saath MCV jaise numbers, WBC ki ginti, aur platelet count aate hain — isi liye ek CBC hi bees se zyada parameters gin leta hai. Daam is baat par tay hota hai ki aap sirf CBC karwa rahe hain ya uske saath ferritin, vitamin B12 aur vitamin D bhi, kyunki vitamin wale test ke liye alag reagent aur machine lagti hai. CBC apne aap me kam rate wale test me aata hai, aur home collection Deoria me free hai. Rate Deoria ke service page par ek hi jagah likha hai.",
    },
    {
      question: "Vitamin D aur B12 test me khaali pet rehna padta hai kya?",
      answer:
        "Nahi. Vitamin D, vitamin B12, CBC aur ferritin — in chaaron me fasting nahi lagti, isliye sample din me kabhi bhi diya ja sakta hai aur bhookha rehne ki zaroorat bilkul nahi hai. Yahi in test ki sabse aasan baat hai, aur yahi wajah hai ki inhe taalne ka koi karan nahi banta. Fasting sirf tab aayegi jab doctor ne inke saath fasting sugar ya lipid profile bhi likha ho, ya aap poora package karwa rahe hon — us haalat me subah 6 baje ka pehla slot le lijiye aur raat ka khaana 9 baje tak kar lijiye.",
    },
    {
      question: "B12 ki goli ya injection pehle se chal raha hai — kya ab test karwana theek hai?",
      answer:
        "Test karwaya ja sakta hai, lekin ye jaankari doctor aur lab dono ko honi chahiye — ki kya chal raha hai aur kab se. Ilaaj ke beech liya gaya sample ilaaj ke asar ke saath aata hai, aur use usi roop me padha jaana chahiye; bina ye bataye report ka matlab galat nikal sakta hai. Apne aap goli ya injection band karke test karwana theek nahi hai — kab rukna hai ya nahi rukna, ye faisla sirf aapke doctor ka hai. Booking ke waqt supplement ka naam bata dena hi kaafi hai; iske liye kisi alag taiyaari ki zaroorat nahi.",
    },
    {
      question: "Vitamin D ka test kitne-kitne din par dobara karana chahiye?",
      answer:
        "Bina kisi ilaaj ke, aam taur par saal me ek baar se zyada iski zaroorat nahi hoti. Ilaaj chal raha ho to dobara kab karana hai ye aapka doctor batata hai, kyunki wo dawa ke roop aur aapki halat dono par nirbhar karta hai — har mahine dohraane se koi jaankari nahi milti, sirf kharcha badhta hai. Do cheezein kaam ki hain: purani report sambhaal kar rakhiye, aur dobara jaanch usi lab se karwaiye jahan pehli hui thi, kyunki alag analyser ke numbers ki tulna galat raaste par le jaati hai.",
    },
    {
      question: "Bachche ko kamzori lagti hai aur bhookh nahi lagti — kaunsa test karayein?",
      answer:
        "Pehle bachche ko doctor ko dikhaiye; panel wahi tay karega, kyunki bachchon me umar ke hisaab se test aur unki reference range dono badalti hain. Aam taur par CBC pehla test hota hai, aur zaroorat lage to uske saath ferritin, vitamin B12 ya vitamin D bhi likhe jaate hain. Achhi baat ye hai ki inme fasting nahi lagti, isliye bachche ko bhookha rakhne ki zaroorat nahi hoti aur sample ghar par hi liya ja sakta hai. Khoon utni hi matra me liya jaata hai jitni us test aur us umar ke liye zaroori hai.",
    },
    {
      question: "Sirf haemoglobin karwa lein ya poora CBC — dono me farak kya hai?",
      answer:
        "Haemoglobin CBC ka ek hissa hai, alag test nahi. Akela haemoglobin itna hi batata hai ki kami hai ya nahi; poora CBC iske aage ye ishara deta hai ki kami kis tarah ki ho sakti hai — RBC ka aakar, WBC ki ginti aur platelet count sab usi report me aate hain. Isi liye doctor aam taur par poora CBC likhta hai, aur thakan ki shikayat me uske saath ferritin ya vitamin B12 bhi jodta hai. Dono ek hi sample par hote hain, isliye alag visit nahi lagti aur sui ek hi baar lagti hai.",
    },
    {
      question: "Ilaaj shuru hone ke baad dobara test kab karayein — sudhaar dikhne me kitna samay lagta hai?",
      answer:
        "Ye samay har vyakti aur har kami me alag hota hai, aur dobara jaanch ki tareekh sirf aapka doctor tay karta hai. Ek baat sabhi par lagu hai: ilaaj shuru hone ke turant baad test karwana kuch nahi batata, kyunki numbers ko badalne me samay lagta hai — aur us report ko dekh kar ghabraana ya khush hona, dono galat rahega. Us beech agar thakan waisi ki waisi hai ya badh rahi hai, to agla test khud tay karne ke bajaye doctor ko dobara dikhaiye. Purani saari report ek folder me rakhiye; tulna hi is jaanch ka asli kaam hai.",
    },
  ],

  relatedLinks: {
    heading: "Deoria Ke Liye Aage Ki Jaankari",
    intro:
      "Is guide me thakan, khoon ki kami aur vitamin hain. Kaun sa test kab karana chahiye wo clinical guide me, ghar par visit ka tareeka home collection guide me, aur rate sirf service page par.",
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
            href: BLOG_HOME_DEORIA,
            label: "Deoria me ghar par blood test kaise karayein",
            sub: "Visit ke din ka poora tareeka, bujurg aur bachchon ka dhyaan",
          },
          {
            href: BLOG_FULLBODY_DEORIA,
            label: "Deoria me full body checkup kaise chunein",
            sub: "Daam kis baat par tay hota hai, aur kis ke liye kaun sa package",
          },
          {
            href: BLOG_LIVER_KIDNEY_DEORIA,
            label: "Deoria me LFT aur KFT test",
            sub: "Liver aur kidney ke panel me kya aata hai",
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
            href: LAB_DEORIA_ANAEMIA,
            label: "Auraton aur bachchon me khoon ki kami — service page par",
          },
          {
            href: LAB_DEORIA_PRICE,
            label: "Deoria me lab test ka rate list",
            sub: "CBC, ferritin, vitamin D, B12 aur package — sab ek jagah",
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
        ],
      },
    ],
  },
};
