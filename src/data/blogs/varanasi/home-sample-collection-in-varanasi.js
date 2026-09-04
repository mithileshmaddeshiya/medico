/**
 * /blogs/home-sample-collection/varanasi — "Ghar Par Blood Test Varanasi"
 *
 * ── WHY A FOURTH VARANASI GUIDE ──────────────────────────────────────────
 * Varanasi now has five pages in this neighbourhood, and they only survive
 * together because each answers a question the others do not:
 *
 *   /lab-test/varanasi                        → "book kahan se" — form, rate, menu
 *   /blogs/lab-test/varanasi                  → "kaun sa test kab" (clinical)
 *   /blogs/full-body-checkup/varanasi         → "package me kya hona chahiye"
 *   /blogs/pathology-lab/varanasi             → "kis lab par bharosa karun"
 *   /blogs/home-sample-collection/varanasi    → "ghar par hota kaise hai" (this)
 *
 * The lane here is the PROCESS and the MAP: the fifteen minutes at the door,
 * who home collection is the only workable route for (bujurg, bistar par pade
 * mareez, bachche, mahilayein), and which parts of the city a collection
 * actually reaches. Deoria's equivalent (../deoria/home-sample-collection-in-
 * deoria.js) owns the same lane for that town; this one carries the Varanasi
 * geography the Deoria page cannot.
 *
 * ── WHY THE LOCALITY TABLE IS HERE AND NOT ITS OWN URL ───────────────────
 * "Pathology lab in Lanka Varanasi", "blood test in Sigra", "home collection
 * Pandeypur" are real, separate searches. The tempting move is a page per
 * locality — and that is exactly the doorway-page pattern that got the old
 * Deoria copy rewritten (see the note at the top of src/data/lab/content/
 * deoria.js). Thirty near-identical pages differing only in a place name is
 * what Google files under scaled content abuse, and it takes the good pages
 * down with it.
 *
 * So the localities live in ONE table, on the one page where the question
 * ("mere ilaake me aayenge?") is actually being asked, and each row carries a
 * fact that is true only of that area — the ghat-side lanes take a two-
 * wheeler, the Ring Road colonies need a landmark, Ramnagar is across the
 * bridge so the first slot matters. A table row that says something real is
 * worth more than a page that says nothing.
 *
 * ── CLAIMS ───────────────────────────────────────────────────────────────
 * Only the five the business confirms: free home collection, a trained
 * phlebotomist carrying an ID card, slots from 6 AM, reports in 24 hours,
 * cash/UPI on collection. NOT claimed: cold-chain boxes, barcode printing at
 * the door, NABL, "certified", any accuracy or price comparison. The older
 * service copy in src/data/lab/content/varanasi.js does use some of those —
 * that is a known inconsistency, not a precedent to copy.
 *
 * No X-ray, ultrasound or ECG anywhere: they are not on the menu, and the
 * section "kya ghar par nahi ho sakta" says so out loud rather than leaving a
 * reader to find out at the door.
 *
 * ── NO PRICES ────────────────────────────────────────────────────────────
 * Not one rate. Every sentence that would carry a number links to
 * #lab-test-price-varanasi instead, so the rate lives in exactly one file.
 *
 * ── IMAGES ───────────────────────────────────────────────────────────────
 * One: the hero. `src` must be a file that exists in /public — the old
 * blogData.js carried /public/blogs/*.webp paths for files never added to the
 * repo, which is why the blog rendered no images and the Article schema
 * pointed at a 404. /navheroimage/labtestimg.webp does exist; it was checked.
 */
import {
  BLOG_AUTHOR,
  BLOG_PUBLISHER,
  INDEXABLE,
  canonicalFor,
} from "../shared";

/* Link targets as constants — a route rename is one line here instead of a
   hunt through the prose, and a typo shows up as `undefined` in the href
   rather than as a silent 404 in production. Service-page anchors come from
   src/data/lab/content/varanasi.js; rename one there and these break. */
const LAB_VARANASI = "/lab-test/varanasi";
const LAB_VARANASI_HOME = "/lab-test/varanasi#home-sample-collection-varanasi";
const LAB_VARANASI_PRICE = "/lab-test/varanasi#lab-test-price-varanasi";
const LAB_VARANASI_PREPARE = "/lab-test/varanasi#how-to-prepare-for-blood-test";
const LAB_VARANASI_REPORTS = "/lab-test/varanasi#reports-turnaround-time";
const LAB_VARANASI_BOOK = "/lab-test/varanasi#how-to-book-lab-test-varanasi";
const LAB_VARANASI_WOMEN = "/lab-test/varanasi#pregnancy-women-health-tests";
const LAB_VARANASI_POPULAR = "/lab-test/varanasi#popular-blood-tests-varanasi";

/* The sibling guides. Every one of these is a live route — the Varanasi set in
   ./index.js and the Deoria set in ../deoria/index.js. */
const BLOG_LAB_VARANASI = "/blogs/lab-test/varanasi";
const BLOG_LAB_VARANASI_FASTING = "/blogs/lab-test/varanasi#fasting-aur-taiyari";
const BLOG_LAB_VARANASI_REPORT = "/blogs/lab-test/varanasi#report-kaise-padhein";
const BLOG_PATHOLOGY_VARANASI = "/blogs/pathology-lab/varanasi";
const BLOG_FULLBODY_VARANASI = "/blogs/full-body-checkup/varanasi";
const BLOG_DIABETES_VARANASI = "/blogs/diabetes-thyroid-test/varanasi";
const BLOG_DENGUE_VARANASI = "/blogs/dengue-typhoid-test/varanasi";
const BLOG_LIVER_KIDNEY_VARANASI = "/blogs/liver-kidney-test/varanasi";
const BLOG_HOME_DEORIA = "/blogs/home-sample-collection/deoria";

const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_GHAZIPUR = "/lab-test/ghazipur";
const CONTACT = "/contact";

export const homeSampleCollectionVaranasi = {
  category: "home-sample-collection",
  city: "varanasi",

  /* 44 characters. The root layout appends " | MedicoBharat" (template in
     src/app/layout.js), so Google renders 59 — just inside the ~60 it shows.
     The phrase people type ("ghar par blood test") comes first and survives
     truncation. */
  title: "Ghar Par Blood Test Varanasi — Poori Prakriya",

  /* ~155 characters, so it renders whole on desktop and mobile. Hinglish, with
     the English terms that have to match left intact: home sample collection,
     blood test, lab test. */
  description:
    "Varanasi me ghar par blood test kaise hota hai — free home sample collection ka poora tarika, kis ilaake me aati hai, fasting slot aur report ka samay.",

  /* Ordered strongest first. Every term here appears in the visible copy; a
     keyword that lives ONLY in this array is the kind that gets a page
     filtered rather than ranked. */
  keywords: [
    "Blood Test at Home Varanasi",
    "Lab Test at Home in Varanasi",
    "Free Home Sample Collection Varanasi",
    "Pathology Home Collection Varanasi",
    "Home Sample Collection in Varanasi",
    "Online Blood Test Booking Varanasi",
    "Blood Sample Collection From Home Varanasi",
    "Ghar Par Blood Test Varanasi",
    "Home Collection Lab in Varanasi",
    "Blood Test in Varanasi",
    "Lab Test in Varanasi",
    // Hyper-local: each of these has its own row in the coverage table below,
    // and each row says something true only of that area.
    "Home Collection Blood Test Pandeypur Varanasi",
    "Blood Test in Sigra Varanasi",
    "Pathology Lab in Lanka Varanasi",
    "Lab Test in Mahmoorganj Varanasi",
    "Blood Test Godowlia Chowk Varanasi",
    "Sundarpur Blood Test Varanasi",
    "Sarnath Pathology Lab Varanasi",
    "Diagnostic Lab in Cantt Varanasi",
  ],

  canonical: canonicalFor("home-sample-collection", "varanasi"),
  robots: INDEXABLE,
  author: BLOG_AUTHOR,
  publisher: BLOG_PUBLISHER,

  publishedAt: "2026-09-04",
  updatedAt: "2026-09-04",

  /* Stated rather than computed: a number that changes every time a sentence
     is edited is a number nobody maintains. Update it when a section is
     added. */
  readingMinutes: 9,

  /* The hero, and the article's only image. A collection photograph on a
     collection page. Rendered with `priority` — it is the LCP element, and a
     lazy-loaded LCP image is the commonest reason a content page fails Core
     Web Vitals. */
  hero: {
    src: "/navheroimage/labtestimg.webp",
    alt: "MedicoBharat ki trained phlebotomist Varanasi me ek ghar par blood sample collect kar rahi hain",
    caption:
      "Home sample collection: sample aapke ghar par liya jaata hai, report phone par PDF me aati hai.",
  },

  /** The skimmer's version of the whole article. */
  takeaways: [
    "Poori visit pandrah minute ki hoti hai — sui do minute ki, baaki milaan, label aur dabav.",
    "Fasting wale test me subah 6 baje ka pehla slot lijiye; slot jitna der ka, bhookh utni lambi.",
    "Purane sheher ki galiyon me — Chowk, Godowlia, ghaton ke paas — collection two-wheeler se hoti hai, isliye landmark address se zyada kaam aata hai.",
    "Ghar ke kai log test kara rahe hain to sabka sample ek hi slot me book kijiye — ek visit, ek trip.",
  ],

  sections: [
    {
      id: "ghar-par-blood-test-varanasi",
      heading:
        "Varanasi Me Ghar Par Blood Test — Suvidha Se Zyada, Kai Logon Ke Liye Ekmatra Raasta",
      blocks: [
        "Varanasi me lab ki kami nahi hai. Lanka, Sigra, Bhelupur, Mahmoorganj aur Cantt me har thodi doori par ek collection point mil jaata hai. Phir bhi subah 7 se 10 baje ke beech wahi ek drishya har jagah dikhta hai — khaali pet log line me, kyunki fasting sample isi window me dena hota hai, aur sheher ka traffic Godowlia se Lanka tak usi waqt sabse bhaari hota hai.",
        "Ghar par sample lene ka asli faayda line bachana nahi hai. Asli faayda ye hai ki bahut se logon ke liye test warna hota hi nahi. Bistar par pada mareez, ghutne ke dard se seedhiyan na utar sakne wale bujurg, chhota bachcha, akeli rehne wali mahila, ya wo ghar jahan bade log doosre sheher me hain aur maa-baap yahin — in sab ke liye \"lab tak jaana\" hi wo kadam hai jispar test rukta hai.",
        [
          "Ye guide un pandrah minute ke baare me hai jo aapke darwaze par hote hain. Booking ka form, poora test menu aur rate service page par hai: ",
          {
            text: "Varanasi me lab test aur free home sample collection",
            href: LAB_VARANASI,
          },
          ". Aur kaun sa test kab karana chahiye, wo alag guide me hai — ",
          { text: "Varanasi me lab test: kaun sa test kab", href: BLOG_LAB_VARANASI },
          ".",
        ],
        {
          note: {
            title: "Home collection ka charge alag se nahi jodta",
            text: "Sample ghar par lene ka koi extra paisa nahi lagta. Aap wahi rate dete hain jo test ka hai, aur wo booking ke waqt hi bata diya jaata hai. Payment sample lene ke waqt cash ya UPI se hota hai — pehle advance dene ki zaroorat nahi.",
            tone: "info",
          },
        },
      ],
    },

    {
      id: "visit-ke-din-kya-hota-hai",
      heading: "Darwaza Khulne Ke Baad Kya Hota Hai — Pandrah Minute Ka Hisaab",
      lead: "Sui do minute ki hai. Baaki tera minute wo hain jo report ko sahi banate hain.",
      blocks: [
        "Log sochte hain ki sample lene wala aaya, sui lagayi aur chala gaya. Asal me visit ka zyadatar waqt un cheezon me jaata hai jo baad me report ki sacchai tay karti hain. Ek baar poora kram dekh lijiye, taaki darwaze par kuch anjaana na lage.",
        {
          list: [
            "Pehchan — phlebotomist ID card ke saath aata hai. Aap use dekh sakte hain aur dekhna chahiye. Ye aapka haq hai, sankoch ki baat nahi.",
            "Milaan — kiska test hai, kaunsa test hai, aur booking me kya likha tha. Naam, umar aur test ka milaan yahin hota hai, kyunki reference range umar aur gender par badalti hai.",
            "Taiyaari — haath dhona, dastane, aur nayi sterile needle aapke saamne kholi jaana. Har sample ke liye nayi needle.",
            "Sample — aam blood test me do se teen minute. Alag test ke liye alag rang ki tube hoti hai, isliye ek se zyada tube bharna bilkul normal hai; iska matlab ye nahi ki zyada khoon liya ja raha hai.",
            "Label — tube par usi waqt, aapke saamne naam likha jaata hai. Poore kaam ka sabse zaroori kadam yahi hai: galat label ka matlab galat report hai.",
            "Payment aur parcha — cash ya UPI, wahi rate jo booking ke waqt bataya gaya tha. Booking number ya slip sambhaal lijiye, report usi se judti hai.",
          ],
        },
        {
          note: {
            title: "Sui ke baad do minute daabiye — ragadiye mat",
            text: "Rui ko sui wali jagah par seedha daba kar do minute rakhiye aur haath seedha rakhiye. Ragadne se aur haath mod lene se hi zyadatar neel padta hai. Us haath se agle kuch ghante bhaari saamaan mat uthaiye. Neel pad bhi jaaye to wo apne aap kuch dinon me chala jaata hai.",
            tone: "info",
          },
        },
      ],
    },

    {
      id: "varanasi-ilaake-home-collection",
      heading: "Varanasi Ke Kis Ilaake Me Home Collection Aati Hai",
      lead: "Poore sheher me — lekin har ilaake ki apni ek baat hai jo booking ke waqt kaam aati hai.",
      blocks: [
        "Sabse aam sawaal yahi hota hai: \"mere ilaake me aayenge?\" Jawab poore sheher ke liye haan hai — Ring Road aur Babatpur route ki nayi colonies samet. Lekin sheher ka har hissa ek jaisa nahi hai. Purane sheher me gaadi nahi ghusti, Ramnagar pul ke us paar hai, aur Cantt ke aas-paas subah ka traffic slot ko der kar sakta hai. Neeche wahi baatein ilaake ke hisaab se rakhi hain.",
        {
          table: {
            caption: "Ilaake ke hisaab se — booking me kya dhyaan rakhein",
            head: ["Ilaaka", "Kya dhyaan rakhna hai"],
            rows: [
              [
                "Lanka, Sundarpur, Nagwa, BHU ke aas-paas",
                "Student aur hostel ke pate bahut hote hain — room number aur block zaroor likhiye, warna phlebotomist gate par atak jaata hai.",
              ],
              [
                "Sigra, Mahmoorganj, Maldahiya, Rathyatra",
                "Sheher ka beech ka hissa, gaadi aaram se pahunchti hai. Subah 6 se 8 ka slot yahan sabse jaldi bhar jaata hai — fasting test ke liye ek din pehle book kar lijiye.",
              ],
              [
                "Bhelupur, Durgakund, Ravindrapuri, Assi, Samne Ghat",
                "Colony ka naam aur gali number dono likhiye. Assi aur Samne Ghat ki taraf ghaat ke paas ke pate landmark se hi milte hain.",
              ],
              [
                "Chowk, Godowlia, Dashashwamedh, Lahurabir",
                "Purana sheher — char pahiya gaadi ja hi nahi sakti, collection two-wheeler se hoti hai. Yahan landmark address se zyada kaam aata hai.",
              ],
              [
                "Cantt, Nadesar, Kachahari, Andhrapul",
                "Station aur Cantt ke aas-paas subah traffic bhaari rehta hai. Slot me thodi der ho to phone uthaiye — phlebotomist raaste me hi hota hai.",
              ],
              [
                "Pandeypur, Ashapur, Bhojubir, Shivpur, Sarnath",
                "Sheher se bahar ki taraf failta hua hissa. Nayi colonies me makaan number aksar nahi lage hote — mandir, school ya mode ka naam likh dijiye.",
              ],
              [
                "DLW, Chitaipur, Susuwahi, Karaundi, Manduadih",
                "Quarter aur sector number likhna zaroori hai. Ek hi number ke quarter kai sector me hote hain.",
              ],
              [
                "Ramnagar aur pul ke us paar",
                "Pul par subah aur shaam jam lagta hai. Fasting wale test ke liye din ka pehla slot lijiye, warna bhookh lambi khinch jaati hai.",
              ],
              [
                "Ring Road aur Babatpur airport route ki nayi colonies",
                "Google pin theek se lagaiye. Naye ilaake me plot number se zyada bharosemand landmark hota hai.",
              ],
            ],
          },
        },
        [
          "Ilaakon ki poori list aur slot ka samay service page par hai: ",
          {
            text: "poore Varanasi me free home sample collection",
            href: LAB_VARANASI_HOME,
          },
          ". Apna ilaaka list me na dikhe to ",
          { text: "ek call kar lijiye", href: CONTACT },
          " — aas-paas ka slot aksar nikal aata hai.",
        ],
      ],
    },

    {
      id: "kya-ghar-par-nahi-ho-sakta",
      heading: "Ghar Par Kya Nahi Ho Sakta — Ye Pehle Jaan Lena Behtar Hai",
      lead: "Aadhi jaankari ka sabse bura asar ye hota hai ki pata darwaze par chalta hai.",
      blocks: [
        "Blood aur urine ke lagbhag saare routine test ghar par ho jaate hain — CBC, sugar, HbA1c, thyroid, lipid, LFT, KFT, vitamin D, vitamin B12, dengue, Widal, urine routine aur poora full body package. Ye sab sample par hote hain, aur sample kahin bhi liya ja sakta hai.",
        {
          list: [
            "X-ray, ultrasound, ECG, TMT, CT scan aur MRI — ye humare menu me hain hi nahi. Ye machine par hote hain, sample par nahi. Parche par inme se kuch likha hai to uske liye imaging centre jaana hi hoga.",
            "Kuch test me sample ka samay bandha hota hai — jaise post-prandial sugar, jo khaana shuru karne ke theek do ghante baad chahiye. Ismein slot ka waqt test ka hissa hai, suvidha nahi.",
            "Cycle ke din par depend karne wale hormone test (PCOS panel jaise LH, FSH, prolactin) ghar par ho jaate hain, lekin din gynaecologist se pooch kar hi book kijiye.",
            "Culture wale test — urine ya blood culture — ghar se ho jaate hain, lekin unki report 24 ghante me nahi, 48 se 72 ghante me aati hai. Ye samay test ka hissa hai, deri nahi.",
          ],
        },
        [
          "Kaun se test sabse zyada karaye jaate hain aur wo batate kya hain, uski poori list ",
          { text: "service page par", href: LAB_VARANASI_POPULAR },
          " hai. Hum kya daawa nahi karte, wo alag guide me saaf likha hai — ",
          {
            text: "Varanasi me pathology lab kaise chunein",
            href: BLOG_PATHOLOGY_VARANASI,
          },
          ".",
        ],
      ],
    },

    {
      id: "bujurg-aur-bistar-par-mareez",
      heading: "Bujurg Aur Bistar Par Pade Mareez — Booking Me Kya Bata Dena Chahiye",
      lead: "Ye baatein booking ke waqt kaam aati hain, darwaze par nahi.",
      blocks: [
        "Varanasi ke bahut se gharon me yahi sabse aam mamla hai: bujurg ghar par hain, bachche doosre sheher me kaam karte hain, aur test har teen mahine par karana hota hai. Aise mareezon me sample lena thoda alag hota hai, aur phlebotomist us taiyaari ke saath aa sake, iske liye kuch baatein pehle bata deni chahiye.",
        {
          list: [
            "Mareez bistar par hai, uth nahi sakta, ya sahara chahiye — ye sabse zaroori jaankari hai, kyunki sample bistar par hi liya jaayega.",
            "Nas patli ho chuki hai, ya pehle bhi sui me dikkat aati rahi hai. Pichhli baar kaunsa haath chala tha, ye yaad ho to bata dijiye.",
            "Khoon patla karne wali dawa chal rahi hai — is haalat me dabav thoda zyada der rakhna padta hai.",
            "Paralysis, fracture, ya kisi ek haath me dikkat — dusra haath istemal hoga, ye pehle se pata hona chahiye.",
            "Sunayi kam deta hai ya yaadasht ki dikkat hai — ghar ka koi vyakti paas rahe, taaki milaan aur nirdesh dono aasan rahein.",
            "Ek mobile number jo us waqt uthaya ja sake. Aap sheher se bahar rehte hain to apna number dijiye aur ghar par kaun milega wo bhi likh dijiye.",
          ],
        },
        [
          "Bujurg mareez ko sample se pehle paani pilate rahiye — fasting me bhi saada paani mana nahi hai, aur paani ki kami me nas milna mushkil ho jaata hai. Poori taiyaari ",
          { text: "service page par likhi hai", href: LAB_VARANASI_PREPARE },
          ".",
        ],
      ],
    },

    {
      id: "bachche-aur-mahilayein",
      heading: "Bachche Aur Mahilayein — Ghar Par Sample Ka Sabse Bada Faayda",
      blocks: [
        "Bachche ka test ghar par hone ka faayda seedha sa hai: wo apni jagah par, apne logon ke beech rehta hai. Kuch chhoti baatein visit ko bahut aasan bana deti hain.",
        {
          list: [
            "Bachche ko pehle se dara kar mat rakhiye, lekin jhooth bhi mat boliye ki \"kuch nahi hoga\". Itna kehna kaafi hai ki thodi der ke liye chubhega.",
            "Bachcha kisi ki god me ho — maa ya pita ki. Lita kar zabardasti pakadne se kaam mushkil hota hai.",
            "Sample se pehle paani ya doodh, bashart ki test me fasting na ho. Zyadatar bachchon ke test — CBC, vitamin, thyroid — me fasting nahi lagti.",
            "Sui ke baad do minute dabaiye aur phir bachche ko kuch khila dijiye. Dhyaan bhi hat jaata hai aur kamzori bhi nahi lagti.",
          ],
        },
        "Mahilaon ke liye ghar par sample lene ki wajah aksar boli nahi jaati, lekin wo sabse aam wajahon me se ek hai. Pregnancy ke dauran baar-baar lab tak jaana, chhote bachche ko chhod kar nikalna, ya sheher ke bheed wale hisse me akele line me khada hona — ye teenon aise kaaran hain jinki wajah se test taalte-taalte reh jaata hai. Ghar par sample lene se ye rukawat khatam ho jaati hai, aur mahila phlebotomist ki request booking ke waqt likhi ja sakti hai.",
        [
          "Pregnancy ka poora panel aur mahilaon ke liye zaroori test service page ke ",
          {
            text: "pregnancy aur women's health wale hisse",
            href: LAB_VARANASI_WOMEN,
          },
          " me hain. Is ilaake me pregnancy ke dauran anaemia sabse badi samasya hai, isliye CBC har trimester me kam se kam ek baar dohraiye.",
        ],
      ],
    },

    {
      id: "fasting-slot-ka-ganit",
      heading: "Fasting Wale Test Ghar Par — Slot Ka Poora Ganit",
      lead: "Fasting mushkil isliye nahi hoti ki bhookh lagti hai; isliye hoti hai ki slot der ka le liya jaata hai.",
      blocks: [
        "Fasting sirf kuch test me lagti hai — fasting blood sugar, lipid profile, insulin, aur package (kyunki package me ye dono aa jaate hain). HbA1c, TSH, CBC, vitamin D, vitamin B12, dengue aur urine routine me fasting bilkul nahi lagti. Ghar par sample lene ka sabse bada faayda yahi hai ki fasting todne ke liye kahin jaana nahi padta — sample ke turant baad naashta ho jaata hai.",
        {
          table: {
            caption: "Fasting chahiye ya nahi — ek nazar me",
            head: ["Test", "Fasting", "Slot"],
            rows: [
              ["Fasting Blood Sugar", "10-12 ghante", "Subah 6-8 baje"],
              ["Lipid Profile", "10-12 ghante", "Subah 6-8 baje"],
              ["Full body package", "10-12 ghante", "Subah 6-8 baje"],
              ["HbA1c", "Nahi", "Din me kabhi bhi"],
              ["Thyroid Profile (TSH, T3, T4)", "Nahi", "Subah behtar, zaroori nahi"],
              ["CBC", "Nahi", "Din me kabhi bhi"],
              ["Vitamin D, Vitamin B12", "Nahi", "Din me kabhi bhi"],
              ["Dengue NS1, Widal, Malaria", "Nahi", "Bukhar ke sahi din par"],
              [
                "Post-Prandial Sugar",
                "Nahi — khaane ke theek 2 ghante baad",
                "Naashte ke 2 ghante baad",
              ],
            ],
          },
        },
        {
          list: [
            "Subah 6 baje ka pehla slot lijiye. Slot jitna der ka hoga, khaali pet utni der rehni padegi.",
            "Raat ka khaana 9 baje tak kar lijiye — isse 10 se 12 ghante apne aap poore ho jaate hain.",
            "Beech me sirf saada paani. Chai, doodh, biscuit, toffee ya paan — inme se koi bhi fasting tod deta hai.",
            "Naashta taiyaar rakhiye. Sample ke turant baad kha sakte hain, aur bujurgon aur bachchon ke liye ye zaroori hai.",
            "Ghar ke kai log test kara rahe hain to sabka slot ek hi rakhiye — jinke test me fasting nahi hai unhe bhookha rakhne ki zaroorat nahi.",
            "Niyamit dawa apne aap band mat kijiye. Booking ke waqt bata dijiye ki kya-kya chal raha hai.",
          ],
        },
        [
          "Fasting aur taiyari ka poora hissa guide me alag se likha hai: ",
          {
            text: "blood test se pehle fasting aur taiyari",
            href: BLOG_LAB_VARANASI_FASTING,
          },
          ". Package hamesha khaali pet hota hai — us par ",
          { text: "full body checkup wali guide", href: BLOG_FULLBODY_VARANASI },
          " dekh lijiye.",
        ],
      ],
    },

    {
      id: "nas-nahi-mili-to",
      heading: "Nas Nahi Mili, Chakkar Aa Gaya — Jo Ho Sakta Hai Aur Uska Kya Kiya Jaata Hai",
      blocks: [
        "Ye baatein aam hain aur inme se kisi me bhi ghabrane wali koi baat nahi. Pehle se pata hone par darwaze par ye chhoti si baat lagti hain, aur na pata hone par badi.",
        {
          table: {
            caption: "Aam dikkat aur uska tay tareeka",
            head: ["Kya hua", "Kya kiya jaata hai"],
            rows: [
              [
                "Pehli baar me nas nahi mili",
                "Dusra haath dekha jaata hai. Do koshish ke baad rukna hi sahi tareeka hai — teesri baar zabardasti karne se neel padta hai aur sample bhi kharab hota hai.",
              ],
              [
                "Chakkar ya ghabrahat",
                "Lita diya jaata hai, paer thode ooncha. Ye zyadatar khaali pet aur ghabrahat se hota hai, khoon nikalne se nahi. Kuch minute me theek ho jaata hai.",
              ],
              [
                "Sui wali jagah par neel",
                "Dabav kam padne se hota hai. Pehle din thandi sikai, agle din garam. Apne aap kuch dinon me chala jaata hai.",
              ],
              [
                "Sample jam gaya (clotted) ya kam bhara",
                "Lab dobara sample maangti hai. Dobara collection ka koi alag charge nahi lagta.",
              ],
              [
                "Bujurg ki nas bahut patli hai",
                "Chhoti needle aur haath ki nas se sample liya jaata hai. Booking me pehle bata dene par isi taiyaari ke saath aaya jaata hai.",
              ],
            ],
          },
        },
        {
          note: {
            title: "Ek se zyada tube ka matlab zyada khoon nahi",
            text: "Alag test ke liye alag rang ki tube hoti hai, kyunki har tube me alag preservative hota hai. Teen tube dekh kar ghar walon ko lagta hai bahut khoon nikal gaya — asal me poora milaakar itna hota hai jitna sharir kuch hi ghanton me bana leta hai.",
            tone: "info",
          },
        },
      ],
    },

    {
      id: "report-kab-aur-kaise",
      heading: "Sample Ke Baad — Report Kab, Kahan Aur Use Sambhalna Kaise Hai",
      blocks: [
        "Routine test ki report 24 ghante ke andar phone par PDF me aa jaati hai. Culture wale test isse alag hain: unme bacteria ko badhne ka samay dena padta hai, isliye 48 se 72 ghante lagte hain. Ye samay test ka hissa hai — jo lab culture ki report agle din de de, uska matlab ye nahi ki wo tez hai.",
        {
          list: [
            "Report PDF me aati hai. Use phone me ek hi folder me rakhiye, taareekh ke saath naam badal kar — \"HbA1c Aug 2026\" jaisa naam do saal baad kaam aata hai.",
            "Purani report phenkiye mat. Doctor ke liye sabse kaam ki cheez ek number nahi, do number ka farq hoti hai.",
            "Follow-up test hamesha ek hi lab me karayein. Alag analyser ki reference range thodi alag hoti hai, isliye ek lab me TSH 4.5 aur doosri me 4.1 aane ka matlab ye nahi ki thyroid badal gaya.",
            "Report me \"High\" ya \"Low\" ka flag diagnosis nahi hai — wo doctor ko dikhane ka ishaara hai.",
          ],
        },
        [
          "Report aane ke baad usme dekhna kya hai, ye alag se likha hai: ",
          {
            text: "report aa gayi — ab ise kaise padhein",
            href: BLOG_LAB_VARANASI_REPORT,
          },
          ". Kis test ki report kitne samay me aati hai, wo ",
          { text: "service page par", href: LAB_VARANASI_REPORTS },
          " hai.",
        ],
      ],
    },

    {
      id: "aage-kya-karein-home-collection",
      heading: "Chhoti Si Checklist",
      blocks: [
        {
          list: [
            "Parche ka poora test naam booking me daaliye — \"Thyroid Profile Total\" aur \"Free\" alag test hain, aur naam milte-julte hone ki wajah se yahi sabse zyada galat book hota hai.",
            "Fasting chahiye ya nahi, pehle confirm kar lijiye, aur raat ka khaana us hisaab se rakhiye.",
            "Address ke saath ek landmark zaroor likhiye — purane sheher me landmark address se zyada kaam aata hai.",
            "Ghar me bujurg, bistar par pada mareez ya bachcha hai to booking me likh dijiye.",
            "Ghar ke saare log ek hi slot me book kijiye — ek visit, ek trip.",
            "Sample ke baad do minute dabaiye, ragadiye mat.",
          ],
        },
        [
          "Booking ka poora kram — form se report tak — ",
          { text: "yahan hai", href: LAB_VARANASI_BOOK },
          ". Test chunne me confusion ho to ",
          { text: "humein call kar lijiye", href: CONTACT },
          "; parche ke hisaab se sahi panel batana isi kaam ka hissa hai.",
        ],
      ],
    },
  ],

  /* Questions a Varanasi reader actually types about home collection — and
     deliberately NOT the ones already answered on the service page or in the
     clinical guide. Two FAQ blocks answering the same question on one domain
     compete with each other for the same rich result. */
  faqs: [
    {
      question: "Varanasi me home sample collection ka charge kitna hai?",
      answer:
        "Ghar par sample lene ka alag se koi charge nahi hai. Aap sirf test ka wahi rate dete hain jo booking ke waqt bataya jaata hai, aur payment sample lene ke samay cash ya UPI se hota hai. Rate ki poori list service page par ek hi jagah rakhi hai, taaki number kabhi purana na pade.",
    },
    {
      question: "Chowk aur Godowlia ki tangg galiyon me bhi home collection aati hai?",
      answer:
        "Haan. Jahan char pahiya gaadi nahi ja sakti — Chowk, Godowlia, Dashashwamedh aur ghaton ke aas-paas ki galiyan — wahan collection two-wheeler se hoti hai. Booking karte waqt location theek se pin kijiye aur ek landmark zaroor likhiye. Purane sheher me landmark address se zyada bharosemand hota hai.",
    },
    {
      question: "Subah kitne baje se sample lene aate hain?",
      answer:
        "Pehla slot subah 6 baje se shuru hota hai. Fasting wale test — fasting sugar, lipid profile aur full body package — ke liye yahi slot lijiye, kyunki slot jitna der ka hoga, khaali pet utni der rehni padegi. Jin test me fasting nahi lagti, jaise CBC, HbA1c, thyroid aur vitamin D, wo din me kabhi bhi ho sakte hain.",
    },
    {
      question: "Ghar par blood test karane se report ki quality par farq padta hai kya?",
      answer:
        "Nahi, agar sample sahi tarike se liya aur label kiya gaya ho. Report ki sacchai teen cheezon par tikti hai — sahi tube, tube ka theek se bharna, aur tube par usi waqt sahi naam ka label lagna. Ye teenon aapke saamne hote hain. Galat tarike se liya gaya ya kam bhara sample hi wo sabse aam wajah hai jiske liye lab dobara sample maangti hai.",
    },
    {
      question: "Ghar ke chaar log ek saath test kara sakte hain?",
      answer:
        "Haan, aur yahi sabse achha tareeka hai. Sabka sample ek hi slot me book kijiye — ek visit me kaam ho jaata hai. Dhyan sirf itna rakhiye ki jinke test me fasting lagti hai unka slot subah ka ho, aur jinke test me fasting nahi lagti unhe bhookha rakhne ki zaroorat nahi. Har vyakti ka poora naam aur umar alag-alag likhiye, kyunki reference range umar par badalti hai.",
    },
    {
      question: "Kya ghar par ECG, X-ray ya ultrasound bhi ho jaata hai?",
      answer:
        "Nahi. Hum sirf sample par hone wale test karte hain — blood aur urine. ECG, X-ray, ultrasound, TMT, CT scan aur MRI machine par hote hain aur unke liye imaging centre jaana hoga. Parche par blood aur urine ke test likhe hain to wo sab ghar par ho jaayenge.",
    },
    {
      question: "Sample dene ke kitni der baad report milti hai?",
      answer:
        "Routine test ki report 24 ghante ke andar phone par PDF me aa jaati hai. Culture wale test — urine ya blood culture — me 48 se 72 ghante lagte hain, kyunki usme bacteria ko badhne ka samay dena padta hai. Ye deri nahi, test ka hi hissa hai.",
    },
    {
      question: "Mahila phlebotomist bhej sakte hain?",
      answer:
        "Booking ke waqt request likh dijiye, taaki slot usi hisaab se lagaya ja sake. Ghar par sample lene ki bahut si booking isi wajah se hoti hai — pregnancy me baar-baar lab jaana, chhote bachche ko chhod kar nikalna, ya bheed wale ilaake me akele line me khada hona. Advance me batane par ye aasan ho jaata hai.",
    },
    {
      question: "Bistar par pade mareez ka sample kaise liya jaata hai?",
      answer:
        "Sample bistar par hi liya jaata hai — mareez ko uthana nahi padta. Booking ke waqt itna zaroor bata dijiye ki mareez uth nahi sakta, nas patli hai ya khoon patla karne wali dawa chal rahi hai, taaki phlebotomist usi taiyaari ke saath aaye. Sample se pehle mareez ko paani pilate rahiye; fasting me bhi saada paani mana nahi hai aur paani ki kami me nas milna mushkil ho jaata hai.",
    },
  ],

  /**
   * Hand-picked contextual links, rendered as a block under the article.
   *
   * The all-cities grid below it is generated from the live city lists, so this
   * block is only for the links a generator cannot know: the exact section of
   * the service page this article defers to, and the neighbouring guides.
   */
  relatedLinks: {
    heading: "Varanasi Ke Liye Aage Kya Dekhein",
    intro:
      "Is guide me ghar par sample lene ki poori prakriya hai. Booking, price aur test menu service page par hain; kaun sa test kab karana hai wo alag guide me.",
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
            href: LAB_VARANASI_PRICE,
            label: "Varanasi me lab test ka price range",
            sub: "CBC, thyroid, HbA1c, full body package",
          },
          {
            href: LAB_VARANASI_PREPARE,
            label: "Blood test se pehle ki taiyari",
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
            sub: "Fasting, PP ya HbA1c — teenon ek cheez nahi hain",
          },
          {
            href: BLOG_DENGUE_VARANASI,
            label: "Varanasi me dengue aur typhoid test — kis din",
            sub: "NS1 pehle 5 din, Widal 5ve din ke baad",
          },
          {
            href: BLOG_LIVER_KIDNEY_VARANASI,
            label: "Varanasi me LFT aur KFT — kab karayein",
          },
          {
            href: BLOG_FULLBODY_VARANASI,
            label: "Varanasi me full body checkup — kya karayein",
          },
          {
            href: BLOG_PATHOLOGY_VARANASI,
            label: "Varanasi me pathology lab kaise chunein",
            sub: "Poochhne layak paanch sawaal",
          },
        ],
      },
      {
        title: "Aas-paas Ke Sheher",
        links: [
          {
            href: BLOG_HOME_DEORIA,
            label: "Deoria me ghar par blood test",
            sub: "Wahi prakriya, Deoria ke liye",
          },
          {
            href: LAB_GORAKHPUR,
            label: "Gorakhpur me lab test",
            sub: "OPD se pehle report taiyaar rakhne ka tarika",
          },
          {
            href: LAB_GHAZIPUR,
            label: "Ghazipur me lab test",
            sub: "Kareeb 80 km — Ganga kinare ka padosi jila",
          },
          { href: CONTACT, label: "Contact — booking aur test chunne me madad" },
        ],
      },
    ],
  },
};
