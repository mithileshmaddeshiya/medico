/**
 * /blogs/home-sample-collection/deoria — "Deoria Me Ghar Par Blood Test"
 *
 * ── THE LANE, AND THE ONE IT MUST NOT STEAL ──────────────────────────────
 * Deoria now has six URLs in this neighbourhood. They survive together only
 * because each answers a question the others do not:
 *
 *   /lab-test/deoria                       → book kahan se, rate, menu
 *   /blogs/lab-test/deoria                 → kaun sa test kab (clinical)
 *   /blogs/pathology-lab/deoria            → sample dene KAHAN (geography)
 *   /blogs/diabetes-thyroid-test/deoria    → sugar/thyroid/lipid ka form
 *   /blogs/full-body-checkup/deoria        → kaun sa package, kis ke liye
 *   /blogs/dengue-typhoid-test/deoria      → bukhar ki jaanch
 *   /blogs/home-sample-collection/deoria   → ghar par KAISE hota hai (this)
 *
 * ⚠ /blogs/pathology-lab/deoria already owns the map — which mohallas, which
 * kasbas, how to write an address, and the five-step booking ORDER (form →
 * call → visit → payment → report). None of that is repeated here. This page
 * starts where that one stops: the fifteen minutes at the door, and the people
 * for whom home collection is not a convenience but the only way the test
 * happens at all — the bedridden, the elderly whose veins have gone thin,
 * children, women who would otherwise skip the test, and the household whose
 * earning member is in Surat or Delhi and is booking from there.
 *
 * ── WHAT THIS PAGE PROMISES, AND WHAT IT REFUSES TO ──────────────────────
 * Only the five confirmed claims: free home collection, a trained phlebotomist
 * with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI on
 * collection. NOT claimed: NABL accreditation, pathologist verification,
 * "certified" anything, same-day reports, 24-hour or night collection, and —
 * the one this page is most tempted by — a GUARANTEED FEMALE PHLEBOTOMIST.
 * The request can be noted; it cannot be promised, and the FAQ says exactly
 * that. A promise made here is broken at somebody's door.
 *
 * There is also no walk-in counter in Deoria. See the comment above `geo` in
 * src/data/lab/cities.js. This page must never read as "aapke mohalle wali
 * branch se koi aayega".
 *
 * ── NO PRICES ────────────────────────────────────────────────────────────
 * Not one rate. Rates live only in src/data/lab/content/deoria.js, rendered at
 * #lab-test-price-deoria. Six pages now describe this service; the moment a
 * figure is copied onto a second one it starts to drift.
 *
 * ── IMAGES: NONE ─────────────────────────────────────────────────────────
 * /public has no Deoria photography and `src` must name a file that exists.
 * og:image resolves to /blogs/home-sample-collection/deoria/og.
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
const LAB_DEORIA_HOME = "/lab-test/deoria#home-sample-collection-deoria";
const LAB_DEORIA_PREPARE = "/lab-test/deoria#prepare-for-test-deoria";
const LAB_DEORIA_REPORTS = "/lab-test/deoria#reports-deoria";
const LAB_DEORIA_BOOK = "/lab-test/deoria#how-to-book-deoria";
const LAB_DEORIA_PRICE = "/lab-test/deoria#lab-test-price-deoria";
const LAB_DEORIA_ANAEMIA = "/lab-test/deoria#anaemia-women-children-deoria";
const LAB_DEORIA_MIGRANT = "/lab-test/deoria#migrant-workers-checkup-deoria";
const LAB_DEORIA_LAB = "/lab-test/deoria#pathology-lab-diagnostic-centre-deoria";

const LAB_SALEMPUR = "/lab-test/salempur";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_KUSHINAGAR = "/lab-test/kushinagar";

const BLOG_LAB_DEORIA = "/blogs/lab-test/deoria";
const BLOG_PATHOLOGY_DEORIA = "/blogs/pathology-lab/deoria";
const BLOG_PATHOLOGY_DEORIA_PATA = "/blogs/pathology-lab/deoria#pata-landmark-deoria";
const BLOG_PATHOLOGY_DEORIA_HOME = "/blogs/pathology-lab/deoria#ghar-se-kaunsi-jaanch";
const BLOG_PATHOLOGY_DEORIA_BOOK = "/blogs/pathology-lab/deoria#online-blood-test-book-deoria";
const BLOG_PATHOLOGY_DEORIA_AREA = "/blogs/pathology-lab/deoria#deoria-mohalla-kasba-coverage";
const BLOG_FULLBODY_DEORIA = "/blogs/full-body-checkup/deoria";
const BLOG_DIABETES_DEORIA = "/blogs/diabetes-thyroid-test/deoria";
const BLOG_DENGUE_DEORIA = "/blogs/dengue-typhoid-test/deoria";

const CONTACT = "/contact";

export const homeSampleCollectionDeoria = {
  category: "home-sample-collection",
  city: "deoria",

  /* 44 characters. The root layout appends " | MedicoBharat", so Google renders
     59 — inside the ~60 it will show. The phrase people actually type is
     "ghar par blood test", so that is the phrase in the title. */
  title: "Deoria Me Ghar Par Blood Test Kaise Karayein",

  /* ~151 characters. Hinglish, with the English terms that must match left
     intact: blood test, home sample collection. */
  description:
    "Deoria me ghar par blood test kaise hota hai — visit ke din kya hota hai, bujurg aur bachchon ka kya dhyaan rakhein, aur fasting ka slot kaise chunein.",

  /* Ordered strongest first. Every term here appears in the visible copy. */
  keywords: [
    "Blood Test at Home in Deoria",
    "Home Sample Collection Deoria",
    "Deoria Me Blood Test Ghar Par Kaise Karaye",
    "Ghar Se Blood Sample Collection Deoria",
    "Blood Sample Collection at Home Deoria",
    "Home Collection Lab Deoria",
    "Free Home Sample Collection Lab Deoria",
    "Pathology Lab Home Visit Deoria",
    "Lab Test in Deoria",
    "Blood Test in Deoria",
    "Bujurgon Ka Blood Test Ghar Par Deoria",
    "Bachche Ka Blood Test Deoria",
    "Home Collection Deoria Sadar Rudrapur",
  ],

  canonical: canonicalFor("home-sample-collection", "deoria"),
  robots: INDEXABLE,
  author: BLOG_AUTHOR,
  publisher: BLOG_PUBLISHER,

  publishedAt: "2026-09-02",
  updatedAt: "2026-09-02",

  /* Stated rather than computed. Update it when the article grows a section. */
  readingMinutes: 9,

  /** The skimmer's version of the whole article. */
  takeaways: [
    "Ghar par sample lene se report par koi farak nahi padta — sample kahan liya gaya, isse result nahi badalta. Farak sirf itna hai ki mareez ko nikalna nahi padta.",
    "Poori visit lagbhag pandrah minute ki hoti hai, aur usme sabse zyada waqt sui me nahi, pehchan aur label me lagta hai — wahi hissa report ko sahi banata hai.",
    "Bujurg, bistar par pade mareez, patli nas, bachcha ya pregnancy — ye booking ke waqt batayi jaane wali baatein hain, darwaze par nahi.",
    "Fasting wale test ke liye subah 6 baje ka pehla slot hi sabse aasan hai: raat ka khaana 9 baje tak, subah sirf saada paani, aur sample ke turant baad naashta.",
    "Mahila phlebotomist ki request note kar li jaati hai, lekin uska vaada nahi kiya jaata — jo vaada nibhaya na ja sake, wo darwaze par tootta hai.",
  ],

  sections: [
    {
      id: "ghar-par-blood-test-deoria-matlab",
      heading: "Deoria Me Ghar Par Blood Test — Ye Suvidha Nahi, Kai Logon Ke Liye Ekmatra Raasta Hai",
      lead: "Sawaal ye nahi ki aaram mil raha hai. Sawaal ye hai ki test ho paayega ya nahi.",
      blocks: [
        "Ghar se sample lene ka matlab itna hi hai ki jo khoon ya peshab ka sample kisi counter par diya jaata, wo aapke ghar par le liya jaata hai. Sample kahan liya gaya, isse report nahi badalti — machine, method aur reference range wahi rehte hain. Isliye ghar par karwane me kuch \"kam\" nahi hota.",
        "Lekin Deoria me iska asli mol un logon ke liye hai jinke liye counter tak pahunchna hi sabse badi rukavat hai. Bujurg jinke ghutne jawab de chuke hain aur bachche bahar kaam karte hain. Bistar par pade mareez. Bukhar me tapta hua aadmi jise bike par bithana hi galat hai. Chhote bachche. Aur wo mahilaayein jo bahar jaakar line me lagne ke bajaye test hi taal deti hain.",
        {
          note: {
            title: "Hamara Deoria me koi counter nahi hai",
            text: "MedicoBharat Deoria me home collection service chalata hai. Kisi mohalle me hamari branch ya walk-in counter hone ka daawa is page par nahi kiya gaya. Aur jo jaanch machine par hoti hai — X-ray, ultrasound, ECG, CT scan — wo humse nahi hoti; unke liye imaging centre par jaana hi padega.",
            tone: "warn",
          },
        },
        [
          "Kaun si jaanch ghar par ho jaati hai aur kis ke liye centre jaana hi padega, uski poori table ",
          { text: "yahan hai", href: BLOG_PATHOLOGY_DEORIA_HOME },
          ". Aur booking ka poora kram — form se report tak paanch step — ",
          { text: "yahan", href: BLOG_PATHOLOGY_DEORIA_BOOK },
          ". Ye page uske beech ka hissa hai: darwaza khulne ke baad kya hota hai.",
        ],
      ],
    },

    {
      id: "visit-ke-din-kya-hota-hai-deoria",
      heading: "Visit Ke Din Kya Hota Hai — Pandrah Minute Ka Poora Hisaab",
      lead: "Sui do minute ki hai. Baaki tera minute wo hain jo report ko sahi banate hain.",
      blocks: [
        "Log sochte hain ghar par sample lene wala aaya, sui lagayi aur chala gaya. Asal me visit ka zyadatar waqt un cheezon me jaata hai jo baad me report ki sacchai tay karti hain. Ek baar poora kram dekh lijiye, taaki darwaze par kuch anjaana na lage.",
        {
          list: [
            "Pehchan — phlebotomist ID card ke saath aata hai. Aap use dekh sakte hain aur dekhna chahiye; ye aapka haq hai, sankoch ki baat nahi.",
            "Milaan — kiska test hai, kaunsa test hai, aur booking me kya likha tha. Naam, umar aur test ka milaan yahin hota hai, kyunki reference range umar aur gender par badalti hai.",
            "Taiyaari — haath dhona, dastane, naya sterile needle aapke saamne khola jaana. Har sample ke liye naya needle — ye poochhne ki cheez nahi honi chahiye, lekin poochh lena galat bhi nahi hai.",
            "Sample — aam blood test me do se teen minute. Alag test ke liye alag rang ki tube hoti hai, isliye ek se zyada tube bharna normal hai, ismein ghabraane wali koi baat nahi.",
            "Label — tube par usi waqt, aapke saamne naam likha jaata hai. Poore kaam me sabse zaroori kadam yahi hai; galat label ka matlab galat report hai.",
            "Payment aur parcha — cash ya UPI, wahi rate jo pehle bataya gaya tha. Booking ka number ya slip sambhaal lijiye, report usi se judti hai.",
          ],
        },
        {
          note: {
            title: "Sui ke baad do minute daabiye, ragadiye mat",
            text: "Rui ko sui wali jagah par seedha daba kar do minute rakhiye aur haath sidha rakhiye. Ragadne se aur haath mod lene se hi zyadatar neel padta hai. Us haath se agle kuch ghante bhaari saamaan mat uthaiye. Neel pad bhi jaaye to wo apne aap kuch dinon me chala jaata hai.",
            tone: "info",
          },
        },
      ],
    },

    {
      id: "bujurg-aur-bistar-par-mareez-deoria",
      heading: "Bujurg Aur Bistar Par Pade Mareez — Kya Pehle Bata Dena Chahiye",
      lead: "Ye baatein booking ke waqt kaam aati hain, darwaze par nahi.",
      blocks: [
        "Deoria ke bahut se gharon me hi ye sabse aam mamla hai: bujurg ghar par hain, bachche bahar kaam karte hain, aur test har teen mahine par karana hota hai. Aise mareezon me sample lena thoda alag hota hai, aur phlebotomist us taiyaari ke saath aa sake iske liye kuch baatein pehle bata deni chahiye.",
        {
          list: [
            "Mareez bistar par hai, uth nahi sakta, ya sahara chahiye — ye sabse zaroori jaankari hai, kyunki sample bistar par hi liya jaayega.",
            "Nas patli ho chuki hai, ya pehle bhi sui me dikkat aati rahi hai. Purani baar kaunsa haath chala tha, ye yaad ho to bata dijiye.",
            "Khoon patla karne wali dawa chal rahi hai — is haalat me dabav thoda zyada der rakhna padta hai.",
            "Paralysis, fracture, ya kisi ek haath me dikkat — dusra haath istemal hoga, ye pehle se pata hona chahiye.",
            "Sunayi kam deta hai ya yaadasht ki dikkat hai — ghar ka koi vyakti paas rahe, taaki milaan aur nirdesh dono aasan rahein.",
            "Ek mobile number jo us waqt uthaya ja sake. Aap bahar rehte hain to apna number dijiye aur ghar par kaun milega wo bhi likh dijiye.",
          ],
        },
        [
          "Bujurg mareez ko sample se pehle paani pilate rahiye — fasting me bhi saada paani mana nahi hai, aur paani ki kami me nas milna mushkil ho jaata hai. Poori taiyaari ",
          { text: "service page par", href: LAB_DEORIA_PREPARE },
          " likhi hai. Bahar rehkar ghar walon ka test karwane walon ke liye ",
          { text: "alag hissa", href: LAB_DEORIA_MIGRANT },
          " hai.",
        ],
      ],
    },

    {
      id: "bachchon-ka-sample-deoria",
      heading: "Bachche Ka Blood Test Ghar Par — Ghabrahat Bachche Ko Nahi, Ghar Ko Hoti Hai",
      lead: "Bachche ka sample lena aam kaam hai; use aasan banane ke kuch tay tareeke hain.",
      blocks: [
        "Bachche ka test ghar par hone ka sabse bada fayda yahi hai ki wo apni jagah par, apne logon ke beech rehta hai. Kuch chhoti baatein visit ko bahut aasan bana deti hain.",
        {
          list: [
            "Bachche ko pehle se dara kar mat rakhiye, lekin jhooth bhi mat boliye ki \"kuch nahi hoga\". Itna kehna kaafi hai ki thodi der ke liye chubhega.",
            "Bachcha kisi ki god me ho — maa ya pita ki. Lita kar zabardasti pakadne se kaam mushkil hota hai.",
            "Sample se pehle paani ya doodh — bashart ki test me fasting na ho. Zyadatar bachchon ke test (CBC, vitamin, thyroid) me fasting nahi lagti.",
            "Bachche ke test me khoon bahut kam matra me liya jaata hai, aur umar ke hisaab se hi liya jaata hai. Ye wo baat hai jispar ghar sabse zyada ghabrata hai aur sabse kam zaroorat hoti hai.",
            "Sui ke baad do minute dabaiye aur uske baad bachche ko kuch khila dijiye — dhyaan hatta bhi jaata hai aur kamzori bhi nahi lagti.",
          ],
        },
        [
          "Bachchon aur mahilaon me khoon ki kami ke test par service page ka ",
          { text: "anaemia wala section", href: LAB_DEORIA_ANAEMIA },
          " padh lijiye, aur bukhar me bachche ka kaunsa test kis din hota hai wo ",
          { text: "bukhar wali guide", href: BLOG_DENGUE_DEORIA },
          " me hai.",
        ],
      ],
    },

    {
      id: "fasting-slot-ghar-par-deoria",
      heading: "Fasting Wale Test Ghar Par — Slot Ka Poora Ganit",
      lead: "Fasting mushkil isliye nahi hoti ki bhookh lagti hai; isliye hoti hai ki slot der ka le liya jaata hai.",
      blocks: [
        "Fasting sirf kuch test me lagti hai — fasting sugar, lipid profile, aur package (kyunki package me ye dono aa jaate hain). HbA1c, TSH, CBC, vitamin D aur B12 me fasting bilkul nahi lagti. Ghar par sample lene ka sabse bada fayda yahi hai ki fasting todne ke liye aapko kahin jaana nahi padta — sample ke turant baad naashta ho jaata hai.",
        {
          list: [
            "Subah 6 baje ka pehla slot lijiye. Slot jitna der ka hoga, khaali pet utni der rehni padegi.",
            "Raat ka khaana 9 baje tak kar lijiye — isse 10 se 12 ghante apne aap poore ho jaate hain.",
            "Beech me sirf saada paani. Chai, doodh, biscuit, toffee ya paan — inme se kuch bhi fasting tod deta hai.",
            "Naashta taiyaar rakhiye. Sample lene ke turant baad kha sakte hain, aur bujurgon aur bachchon ke liye ye zaroori hai.",
            "Ghar ke kai log test kara rahe hain to sabka slot ek hi rakhiye — jinke test me fasting nahi hai unhe bhookha rakhne ki zaroorat nahi.",
            "Niyamit dawa chal rahi hai to use apne aap band mat kijiye. Booking ke waqt bata dijiye ki kya-kya chal raha hai.",
          ],
        },
        [
          "Kaunse test me fasting lagti hai aur kaunse me nahi, uski poori table ",
          { text: "sugar aur thyroid wali guide", href: BLOG_DIABETES_DEORIA },
          " me hai. Package hamesha khaali pet hota hai — us par ",
          { text: "full body checkup wali guide", href: BLOG_FULLBODY_DEORIA },
          " dekh lijiye.",
        ],
      ],
    },

    {
      id: "kuch-galat-ho-jaye-to-deoria",
      heading: "Nas Nahi Mili, Chakkar Aa Gaya — Jo Ho Sakta Hai Aur Uska Kya Kiya Jaata Hai",
      lead: "Ye kam hota hai, lekin hota hai. Pehle se pata ho to ghabrahat nahi hoti.",
      blocks: [
        "Sample lena ek chhota lekin asli kaam hai, aur usme kuch cheezein ho sakti hain. Inhe chhipaane ka koi matlab nahi — ulta, pehle se pata hona hi sabse bada aaram hai.",
        {
          table: {
            caption: "Ghar par sample lete waqt jo ho sakta hai",
            head: ["Kya hua", "Kyun hota hai", "Kya kiya jaata hai"],
            rows: [
              [
                "Pehli baar me nas nahi mili",
                "Patli nas, thand, ya paani ki kami",
                "Dusra haath dekha jaata hai; do koshish ke baad rukna hi theek hai, phir slot dobara tay hota hai",
              ],
              [
                "Neel pad gaya",
                "Sui ke baad ragadna ya dabav na rakhna",
                "Kuch dinon me apne aap chala jaata hai; us haath se bhaari kaam mat kijiye",
              ],
              [
                "Chakkar ya kamzori lagi",
                "Khaali pet, garmi, ya sui ka dar",
                "Lita dijiye, pair thode ooncha rakhiye, aur test ke baad turant kuch khila dijiye",
              ],
              [
                "Bachche ne haath hila diya",
                "Aam baat hai",
                "God me sahara dekar dobara liya jaata hai; zabardasti nahi ki jaati",
              ],
              [
                "Tube dobara bharni padi",
                "Kabhi sample kam pad jaata hai",
                "Ye normal hai; report ki sacchai ke liye poora sample hona zaroori hai",
              ],
              [
                "Sample dobara chahiye, lab se call aayi",
                "Kabhi-kabhi hota hai",
                "Dobara collection ke liye alag charge nahi liya jaata",
              ],
            ],
          },
        },
        {
          note: {
            title: "Ghar par sample lene ke liye ek jagah taiyaar rakhiye",
            text: "Ek kursi ya bistar jiske paas roshni ho, aur ek mez ya stool jispar tube rakhi ja sake. Pankha ya bulb ki roshni seedhi ho to nas dekhne me aasani hoti hai. Poori aastin wala kapda ho to use upar chadhaya ja sake — tight aastin sabse aam chhoti rukavat hai.",
            tone: "info",
          },
        },
      ],
    },

    {
      id: "mahilaon-ke-liye-ghar-par-sample-deoria",
      heading: "Mahilaon Ke Liye Ghar Par Sample — Deoria Me Sabse Kam Boli Jaane Wali Wajah",
      lead: "Bahut se test isliye nahi hote ki ghar se nikalna hi tay nahi ho paata.",
      blocks: [
        "Deoria me thyroid, haemoglobin, ferritin aur vitamin B12 ki jaanch mahilaon me sabse zyada zaroori hoti hai — aur sabse zyada taali bhi jaati hai. Wajah hamesha bimari ki gambhirta nahi hoti; aksar wajah itni hi hoti hai ki ghar se nikalna, kisi ke saath jaana aur line me lagna, teenon ek saath tay nahi ho paate. Ghar par sample lene se ye teenon rukavatein hat jaati hain.",
        {
          list: [
            "Slot us waqt ka lijiye jab ghar par aaram ho — subah ke slot me aksar ye sabse aasan rehta hai.",
            "Ghar ka koi vyakti saath rahe, ye aap tay kar sakti hain; iske liye alag se kuch bataana nahi padta.",
            "Periods chal rahe hon to CBC aur haemoglobin dono karaye ja sakte hain — ye ruk-ruk kar karane wali cheez nahi hai. Doctor ne koi khaas din likha ho to wahi maaniye.",
            "Pregnancy me doctor jo test likhe wahi karaiye, aur booking ke waqt pregnancy ki jaankari de dijiye.",
            "Mahila phlebotomist ki request booking ke waqt likhwayi ja sakti hai. Ise note kar liya jaata hai, lekin iska vaada nahi kiya jaata — aur ye baat pehle hi saaf bata di jaati hai.",
          ],
        },
        [
          "Auraton aur ladkiyon me khoon ki kami par ",
          { text: "anaemia wala section", href: LAB_DEORIA_ANAEMIA },
          " padh lijiye, aur thakan ya baal jhadne par kaunse test hote hain wo ",
          { text: "clinical guide", href: BLOG_LAB_DEORIA },
          " me hai.",
        ],
      ],
    },

    {
      id: "report-ke-baad-ghar-par-deoria",
      heading: "Sample Ke Baad — Report Kab, Kahan Aur Use Sambhalna Kaise Hai",
      lead: "Report ghar par sample dene se der se nahi aati.",
      blocks: [
        "Ghar se liya gaya sample usi din lab tak pahunchta hai, aur report 24 ghante ke andar WhatsApp aur email par PDF me aa jaati hai. Blood culture jaise test me 48 se 72 ghante lagte hain, aur ye booking ke waqt hi bata diya jaata hai. Report ke liye kahin jaane ki zaroorat nahi padti — na sample dene, na report lene.",
        {
          list: [
            "Email wali copy sambhaal kar rakhiye. Phone badal jaaye ya WhatsApp saaf ho jaaye, tab bhi report wahin padi rehti hai.",
            "Report kholte hi upar ka hissa dekh lijiye — naam, umar, aur sample ka din aur waqt. Fasting wale test me ye teesri cheez maayne rakhti hai.",
            "Purani report ke saath ek hi folder me rakhiye. Doctor ko dikhate waqt tulna hi sabse zyada kaam aati hai.",
            "Jo number aap mahino tak dekhenge — HbA1c, TSH, creatinine, haemoglobin — unhe hamesha ek hi lab se karaiye.",
          ],
        },
        [
          "Report kab aur kis roop me aati hai wo ",
          { text: "report wale section", href: LAB_DEORIA_REPORTS },
          " me hai, aur rate ",
          { text: "Deoria ki price list", href: LAB_DEORIA_PRICE },
          " me — is guide me ek bhi number jaan-boojh kar nahi likha gaya.",
        ],
      ],
    },

    {
      id: "aage-kya-karein-home-collection-deoria",
      heading: "Aage Kya Karein",
      lead: "Teen kadam, isi kram me.",
      blocks: [
        {
          list: [
            "Parcha nikaal lijiye aur dekh lijiye ki kis test me fasting hai. Fasting hai to subah 6 baje ka pehla slot lijiye.",
            "Booking ke waqt teen baatein zaroor likhwaiye: mareez ki halat (bujurg, bistar par, bachcha, pregnancy), poora pata landmark ke saath, aur ek chalta hua mobile number.",
            "Ghar me ek se zyada log test kara rahe hain to sabki booking ek hi slot me kar dijiye.",
          ],
        },
        [
          "Booking ke liye ",
          { text: "Deoria ka form", href: LAB_DEORIA_BOOK },
          " bhar dijiye ya ",
          { text: "call kar lijiye", href: CONTACT },
          ". Kaunse mohalle aur kasbe cover hote hain wo ",
          { text: "coverage wale hisse", href: BLOG_PATHOLOGY_DEORIA_AREA },
          " me hai, pata likhne ka tareeka ",
          { text: "yahan", href: BLOG_PATHOLOGY_DEORIA_PATA },
          ", aur Salempur tehsil ke liye ",
          { text: "uska apna page", href: LAB_SALEMPUR },
          ".",
        ],
      ],
    },
  ],

  /* Seven questions in this post's own lane — bistar par mareez, bachche ka
     sample, neel, chakkar, mahila staff, fasting ka slot, aur ghar par kya
     taiyaar rakhein. Deliberately ABSENT because other pages own them:
     phlebotomist ki pehchan, raat me collection, mohalla coverage, sample ka
     transport, bahar se booking (sab /blogs/pathology-lab/deoria), collection
     free hai ya nahi (/lab-test/deoria), aur ghar ke kai log ek visit me
     (/blogs/diabetes-thyroid-test/deoria aur /blogs/full-body-checkup/deoria). */
  faqs: [
    {
      question: "Mareez bistar par hai aur uth nahi sakta — kya phir bhi ghar par sample ho jaayega?",
      answer:
        "Haan, sample bistar par hi liya ja sakta hai; iske liye mareez ko uthana zaroori nahi. Booking ke waqt itna zaroor bata dijiye ki mareez chal-phir nahi sakta, aur agar nas patli ho chuki hai ya pehle bhi sui me dikkat aayi hai to wo bhi — phlebotomist usi taiyaari ke saath aata hai. Bistar ke paas thodi roshni aur ek mez ya stool rakh dijiye jahan tube rakhi ja sake, aur poori aastin wala kapda ho to wo upar chadhne layak ho. Khoon patla karne wali dawa chal rahi ho to wo bhi bata dijiye, kyunki us haalat me dabav thodi der zyada rakha jaata hai.",
    },
    {
      question: "Chhote bachche ka blood test ghar par karwana theek hai? Kitna khoon liya jaata hai?",
      answer:
        "Bilkul theek hai, aur ghar par karwane ka fayda ye hai ki bachcha apni jagah aur apne logon ke beech rehta hai. Khoon utni hi matra me liya jaata hai jitni us test aur us umar ke liye zaroori hai — ye wo baat hai jispar ghar sabse zyada ghabrata hai aur sabse kam zaroorat hoti hai. Bachche ko god me sahara dekar bithaiye, pehle se dara kar mat rakhiye, aur test ke turant baad kuch khila dijiye. Zyadatar bachchon ke test — CBC, vitamin, thyroid — me fasting nahi lagti, isliye sample se pehle paani ya doodh diya ja sakta hai.",
    },
    {
      question: "Sui wali jagah par neel pad gaya hai — kya ye chinta ki baat hai?",
      answer:
        "Aam taur par nahi. Neel zyadatar tab padta hai jab sui nikalne ke baad rui ko ragad diya jaata hai ya us par kaafi der dabav nahi rakha jaata. Sahi tareeka ye hai ki rui ko seedha daba kar do minute rakhiye, haath sidha rakhiye aur agle kuch ghante us haath se bhaari saamaan mat uthaiye. Pad chuka neel apne aap kuch dinon me chala jaata hai. Lekin us jagah par sujan badhti jaaye, dard bahut badh jaaye, ya khoon rukne ka naam hi na le — khaas kar khoon patla karne wali dawa chal rahi ho to — to apne doctor ko dikha lijiye.",
    },
    {
      question: "Khaali pet sample dene par chakkar aata hai — kya karein?",
      answer:
        "Ye kai logon ke saath hota hai aur isse bacha ja sakta hai. Subah ka pehla slot lijiye taaki khaali pet ka samay lamba na kheenche, fasting me bhi saada paani peete rahiye, aur sample ke turant baad ke liye naashta pehle se taiyaar rakhiye — ghar par sample ka sabse bada fayda yahi hai ki khaana turant mil jaata hai. Sample lete waqt baithne ke bajaye lete rahiye agar aapko pehle chakkar aata raha ho, aur ye baat phlebotomist ko pehle hi bata dijiye. Chakkar aane par lita kar pair thoda ooncha rakh dena hi sabse pehla upaay hai.",
    },
    {
      question: "Ghar par sample lene mahila staff aa sakti hai kya?",
      answer:
        "Booking ke waqt ye request likhwayi ja sakti hai aur wo note kar li jaati hai, lekin hum iska vaada nahi karte — us din us ilaake me kaun uplabdh hai, us par nirbhar karta hai. Hum yahi baat pehle se saaf bata dete hain, kyunki jo vaada nibhaya na ja sake wo darwaze par tootta hai. Aap ye zaroor kar sakti hain ki slot us waqt ka lein jab ghar par koi aur maujood ho, aur ghar ka koi vyakti paas rahe. Phlebotomist ID card ke saath aata hai aur poora kaam aapke saamne hota hai — tube par naam bhi aapke saamne likha jaata hai.",
    },
    {
      question: "Subah ka slot nahi mil paaya — kya fasting wala test din me baad me ho sakta hai?",
      answer:
        "Ho sakta hai, lekin uska matlab hai ki aapko utni der khaali pet rehna padega — 10 se 12 ghante fasting ka hisaab slot se pehle poora hona chahiye, chahe slot kisi bhi waqt ka ho. Isi liye subah 6 baje ka pehla slot sabse aasan padta hai. Agar din me baad ka slot le rahe hain to raat ka khaana usi hisaab se kijiye aur beech me sirf saada paani lijiye. Ek aasan raasta ye bhi hai: jis test me fasting nahi lagti — HbA1c, TSH, CBC, vitamin D, B12 — unhe kisi bhi waqt karwa lijiye, aur fasting wale test ke liye agli subah ka slot le lijiye.",
    },
    {
      question: "Ghar par sample lene se pehle mujhe kya taiyaar rakhna chahiye?",
      answer:
        "Paanch cheezein kaafi hain. Ek — doctor ka parcha ya uski photo. Do — baithne ki ek jagah jahan roshni ho, aur paas me ek mez ya stool jispar tube rakhi ja sake. Teen — aisa kapda jiski aastin upar chadh sake; tight aastin sabse aam chhoti rukavat hai. Chaar — fasting wala test hai to naashta taiyaar, aur nahi hai to paani pi kar rakhiye. Paanch — jo dawaiyan niyam se chal rahi hain unki list, aur purani report agar wahi test dobara ho raha ho. Payment sample lene ke waqt cash ya UPI se hota hai, isliye wo bhi taiyaar rakh lijiye.",
    },
  ],

  relatedLinks: {
    heading: "Deoria Ke Liye Aage Ki Jaankari",
    intro:
      "Is guide me visit ke din ka poora tareeka hai. Kaunse mohalle cover hain wo diagnostic guide me, kaun sa test kab wo clinical guide me, aur rate sirf service page par.",
    groups: [
      {
        title: "Deoria Ki Doosri Guides",
        links: [
          {
            href: BLOG_PATHOLOGY_DEORIA,
            label: "Deoria me diagnostic centre aur blood test",
            sub: "Mohalle, kasbe, pata likhne ka tareeka aur booking ka kram",
          },
          {
            href: BLOG_LAB_DEORIA,
            label: "Deoria me kaun sa lab test kab karayein",
            sub: "Umar, shikayat aur bukhar ke din ke hisaab se poori guide",
          },
          {
            href: BLOG_FULLBODY_DEORIA,
            label: "Deoria me full body checkup kaise chunein",
            sub: "Daam kis baat par tay hota hai, aur kis ke liye kaun sa package",
          },
          {
            href: BLOG_DENGUE_DEORIA,
            label: "Deoria me dengue aur typhoid test kab karayein",
            sub: "Bukhar ke kis din kaunsa test, aur platelet ka matlab",
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
            href: LAB_DEORIA_HOME,
            label: "Home sample collection — coverage aur slot",
          },
          {
            href: LAB_DEORIA_LAB,
            label: "Pathology lab aur diagnostic centre — service page par",
          },
          {
            href: LAB_DEORIA_PRICE,
            label: "Deoria me lab test ka rate list",
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
