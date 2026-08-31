/**
 * /blogs/pathology-lab/deoria — "Deoria Me Diagnostic Centre Aur Blood Test"
 *
 * ── DEORIA NOW HAS THREE URLs IN THIS NEIGHBOURHOOD ──────────────────────
 * They only survive together because each answers a question the others do
 * not. Before adding a fourth, check it is not one of these:
 *
 *   /lab-test/deoria             → "book kahan se karaun" — form, price, menu
 *   /blogs/lab-test/deoria       → "kaun sa test kab"     — package, din, report
 *   /blogs/pathology-lab/deoria  → "sample dene kahan jaana padega" (this)
 *
 * The lane here is GEOGRAPHY, and it is the one lane Deoria genuinely owns.
 * The "diagnostic centre near me" / "pathology lab in Deoria" / "blood test
 * lab in Deoria" family of queries is not a clinical question at all — the
 * person typing it wants to know which building to walk into and how far it
 * is. This page answers exactly that, and its answer is the honest one: for
 * routine pathology there is no building, and for X-ray or ultrasound there
 * is, and it is not ours.
 *
 * That is why the mohalla-level material lives here and not on the service
 * page. /lab-test/deoria names the district's towns because they become
 * `areaServed` in its schema; naming Civil Lines, Ramgulam Tola or Gorakhpur
 * Road in schema would be a precision the business does not have. In prose, as
 * "yahan tak sample lene aaya jaata hai, pata aise likhiye", the same words are
 * true and useful.
 *
 * ── THE CLAIM THIS PAGE EXISTS TO NOT MAKE ───────────────────────────────
 * A locality keyword ("diagnostic lab in Civil Lines Deoria") is an invitation
 * to imply a branch there. THERE IS NO WALK-IN COUNTER IN DEORIA. See the
 * comment above `geo` in src/data/lab/cities.js — the pin is the town centre on
 * purpose, because a street address would be a claim we cannot keep. So the
 * locality section says outright that this is not a branch list, and that note
 * is the first callout a reader meets. Do not soften it into "our Civil Lines
 * centre" for the sake of the keyword; that sentence is the one that turns a
 * ranking page into a complaint.
 *
 * ── PHARMACY KEYWORDS: DELIBERATELY ABSENT ───────────────────────────────
 * The brief this page was drafted from also carried "online medicine delivery
 * in Deoria", "medical store home delivery Deoria" and "buy medicines online
 * Deoria". NONE of them are here, in the copy or the keywords array.
 * MedicoBharat retired the medicine section: /medicine-delivery/* and the three
 * Deoria medicine guides are 308-redirected to /lab-test/deoria (see
 * MEDICINE_BLOG_REDIRECTS in next.config.mjs). Writing a pharmacy page now
 * would (a) advertise a service that cannot be fulfilled and (b) re-point the
 * site's topical signal at the exact thing those redirects were built to move
 * it away from. If medicine delivery ever comes back, it needs a service page
 * first, not a blog.
 *
 * ── NO PRICES, SAME AS THE SIBLINGS ──────────────────────────────────────
 * Not one rate. Every sentence that would carry a number links to
 * #lab-test-price-deoria instead, so the rate lives in one file
 * (src/data/lab/content/deoria.js) and cannot drift across three pages.
 *
 * ── CLAIMS THAT ARE MADE ─────────────────────────────────────────────────
 * Only the five the business confirms: free home collection, a trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI
 * on collection. NOT claimed: NABL accreditation, pathologist verification,
 * "certified" anything, same-day reports, 24-hour opening, or any comparative
 * price claim ("affordable", "sabse sasta"). Those were removed from this
 * project once already — see the warning above defaultFaqs in
 * src/data/lab/defaults.js — and a blog is not a loophole for putting them
 * back. The imaging table states plainly that X-ray, ultrasound and ECG are NOT
 * on our menu; listing a service we do not run is the one mistake that costs
 * the booking and the trust in the same visit.
 *
 * ── FAQs: SEVEN THAT NOBODY ELSE ANSWERS ─────────────────────────────────
 * /lab-test/deoria already carries a FAQPage node covering cost, coverage,
 * report time, fasting, booking, Gorakhpur travel and "do I need to visit a
 * lab". /blogs/lab-test/deoria carries seven more on package choice, fever days
 * and repeat testing. Two FAQPage nodes on one domain answering the same
 * question compete for one rich result, so every question below was checked
 * against both lists first.
 *
 * ── IMAGES: NONE ─────────────────────────────────────────────────────────
 * /public has no Deoria photography, and `src` must name a file that really
 * exists there. `hero` is optional and og:image resolves to the generated card
 * at /blogs/pathology-lab/deoria/og, which is drawn from the title.
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
const LAB_DEORIA_LAB = "/lab-test/deoria#pathology-lab-diagnostic-centre-deoria";
const LAB_DEORIA_HOME = "/lab-test/deoria#home-sample-collection-deoria";
const LAB_DEORIA_GORAKHPUR = "/lab-test/deoria#gorakhpur-travel-deoria";
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
const LAB_KUSHINAGAR = "/lab-test/kushinagar";
const LAB_VARANASI = "/lab-test/varanasi";

const BLOG_LAB_DEORIA = "/blogs/lab-test/deoria";
const BLOG_LAB_DEORIA_FEVER = "/blogs/lab-test/deoria#bukhar-me-kis-din-test";
const BLOG_PATHOLOGY_VARANASI = "/blogs/pathology-lab/varanasi";
const BLOG_FULLBODY_VARANASI = "/blogs/full-body-checkup/varanasi";
const BLOG_LAB_VARANASI_REPORT = "/blogs/lab-test/varanasi#report-kaise-padhein";

const HOME_RATE_LIST = "/";
const CONTACT = "/contact";

export const pathologyLabDeoria = {
  category: "pathology-lab",
  city: "deoria",

  /* 42 characters. The root layout appends " | MedicoBharat" (template in
     src/app/layout.js), so Google renders 57 — inside the ~60 it will show.
     Deliberately NOT "Best Diagnostic Lab in Deoria": a title that calls itself
     the best is a claim, and this page's argument is that you should not take
     that claim from anyone, us included. "Pathology lab" is not in the title
     because 45 characters is the ceiling and "diagnostic centre" plus "blood
     test" are the two bigger queries; it carries the URL slug and appears in
     the description, the headings and the copy throughout. */
  title: "Deoria Me Diagnostic Centre Aur Blood Test",

  /* ~150 characters, so it renders whole on desktop and on a phone. Hinglish,
     because the page and the searcher both are, with the English terms that
     have to match left intact: diagnostic centre, pathology lab, blood test. */
  description:
    "Deoria me diagnostic centre ya pathology lab dhoondh rahe hain? Kaun si jaanch ghar par hoti hai, kaunse mohalle cover hain aur booking kaise hoti hai.",

  /* Ordered strongest first, and this array is the checklist the headings,
     tables and FAQs were written against — every term here appears in the
     visible copy. What is NOT here: "full body checkup package in Deoria" (that
     is /blogs/lab-test/deoria's table and /lab-test/deoria's menu), anything
     with a price adjective, and every pharmacy term from the brief — see the
     header note. */
  keywords: [
    "Blood Test Lab in Deoria",
    "Diagnostic Centre in Deoria",
    // Both spellings on purpose: "centre" and "center" are two different
    // strings a person types. Prose uses "Centre", like the rest of the site.
    "Diagnostic Center in Deoria",
    "Diagnostic Centre Near Me Deoria",
    "Pathology Lab in Deoria",
    "Pathology Lab in Deoria Uttar Pradesh",
    "Free Home Sample Collection Lab Deoria",
    "Diagnostic Home Collection Deoria",
    "Pathology Lab Home Visit Deoria",
    "Book Blood Test Online Deoria",
    "Thyroid Blood Test in Deoria",
    "Diabetes Test Lab Deoria",
    "Blood Test in Civil Lines Deoria",
    "Pathology Lab Near Gorakhpur Road Deoria",
    "Blood Test Ramgulam Tola Deoria",
    "Deoria Sadar Rudrapur Barhaj blood test",
  ],

  canonical: canonicalFor("pathology-lab", "deoria"),
  robots: INDEXABLE,
  author: BLOG_AUTHOR,
  publisher: BLOG_PUBLISHER,

  publishedAt: "2026-08-31",
  updatedAt: "2026-08-31",

  /* Stated rather than computed: a number that changes every time a sentence is
     edited is a number nobody maintains. Update it when the article grows a
     section. */
  readingMinutes: 8,

  /** The skimmer's version of the whole article. */
  takeaways: [
    "Routine blood aur urine ki jaanch ke liye Deoria me kisi counter par jaana zaroori nahi — sample ghar se liya ja sakta hai, isliye \"near me\" ka matlab doori nahi, aapke pate tak pahunch hai.",
    "X-ray, ultrasound, ECG aur sonography sample par nahi hoti — unke liye centre par jaana hi padega, aur wo hum nahi karte.",
    "Deoria me late visit ki sabse badi wajah galat pata hoti hai. Mohalla ya gaon ke saath ek landmark aur ek chalta hua mobile number likhna aadha kaam kar deta hai.",
    "HbA1c, TSH, creatinine aur haemoglobin jaise follow-up number hamesha ek hi lab se karaiye — alag machine ki reference range alag hoti hai.",
  ],

  sections: [
    {
      id: "diagnostic-centre-near-me-deoria",
      heading: "\"Diagnostic Centre Near Me\" — Deoria Me Iska Jawab Badal Chuka Hai",
      lead: "Routine jaanch me doori utni maayne nahi rakhti jitni log samajhte hain.",
      blocks: [
        "Deoria me jab koi \"blood test lab in Deoria\", \"pathology lab near me\" ya \"diagnostic centre Deoria\" search karta hai, to sawaal seedha ek hi hota hai: sample dene kahan jaana padega aur kitni door. Isi ek sawaal par aksar test tal jaata hai — subah khaali pet nikalna, sawaari pakadna, counter par line, aur do din baad report lene ke liye dobara wahi chakkar.",
        "Routine pathology me is sawaal ka jawab ab alag hai. Khoon aur peshab ki saari aam jaanch sirf sample par hoti hai. Sample kahan liya gaya, isse result nahi badalta — isliye sample aapke ghar par liya ja sakta hai, chahe aap Deoria Sadar ke kisi mohalle me rehte hon ya jile ke kisi kasbe me. \"Near me\" ka matlab ab \"sabse paas wala counter\" nahi, \"aapke pate tak aane wali service\" hai.",
        {
          note: {
            title: "Ye kisi branch ka pata nahi hai",
            text: "MedicoBharat Deoria me home collection service hai — yahan hamara koi walk-in counter nahi hai, aur is page par kisi mohalle me apni building hone ka daawa nahi kiya gaya. Neeche mohallon ke naam isliye hain ki sample lene wahan tak aaya jaata hai, aur pata kis tarah likhna chahiye ye bataya ja sake. Jahan sach me building me jaana zaroori hai — X-ray, ultrasound, ECG — wo bhi aage saaf likha hai.",
            tone: "info",
          },
        },
        [
          "Sample lene ka kaam trained phlebotomist karta hai, ID card ke saath, aapke saamne. Home visit ke slot subah 6 baje se shuru hote hain, home collection ka koi alag visiting charge nahi hai, aur report 24 ghante ke andar WhatsApp aur email par PDF me aa jaati hai. Yahi baatein ",
          { text: "Deoria ke pathology lab aur diagnostic centre wale section", href: LAB_DEORIA_LAB },
          " me bhi likhi hain — aur jo cheez hum confirm nahi kar sakte, wo hum likhte bhi nahi.",
        ],
      ],
    },

    {
      id: "deoria-mohalla-kasba-coverage",
      heading: "Deoria Sheher Ke Mohalle Aur Jile Ke Kasbe — Kahan Tak Sample Liya Jaata Hai",
      lead: "Civil Lines se lekar Bhatni tak — aur har jagah pata likhne ka apna tareeka.",
      blocks: [
        "Deoria sheher ka daayra bada nahi hai. Civil Lines, Kacheri Road, Malviya Road, Ramgulam Tola, Station Road aur Gorakhpur Road ke aas-paas ke mohalle — ye sab sheher ke andar hi hain, aur sheher ke andar collection ka koi alag hisaab nahi hai. Farq sirf itna padta hai ki aapka pata dhoondhne me kitni der lagti hai, aur wo aapke likhe hue pate par tika hota hai.",
        {
          table: {
            caption: "Deoria me ilaaka aur pata likhne ka tareeka",
            head: ["Ilaaka", "Sheher ya kasba", "Pate ke saath kya zaroor likhein"],
            rows: [
              [
                "Civil Lines, Kacheri Road",
                "Deoria Sadar",
                "Building ya office ka naam aur floor — kacheri ke aas-paas ek jaisi imarat kai hain",
              ],
              [
                "Ramgulam Tola, Malviya Road",
                "Deoria Sadar",
                "Gali ka naam, aur sabse paas ka mandir, school ya jaani-pehchani dukaan",
              ],
              [
                "Station Road, Gorakhpur Road ke aas-paas",
                "Deoria Sadar",
                "Sabse paas ka chauraha, petrol pump ya hotel — road lambi hai, sirf road ka naam kaafi nahi",
              ],
              [
                "Rudrapur, Barhaj, Bhatpar Rani",
                "Jile ke kasbe",
                "Mohalle ke saath block office, thana ya bazaar ka landmark",
              ],
              [
                "Gauri Bazar, Baitalpur, Lar, Bhatni",
                "Jile ke kasbe",
                "Gaon ka naam, post office, aur ek mobile number jo us waqt uthaya ja sake",
              ],
              [
                "Salempur aur uske aas-paas",
                "Alag page",
                "Salempur tehsil ke liye apna page aur apna form hai — wahin se book kijiye",
              ],
            ],
          },
        },
        [
          "Poori coverage list — kaunse kasbe, kaunse slot — ",
          { text: "home sample collection wale section", href: LAB_DEORIA_HOME },
          " me hai. Salempur tehsil ke liye ",
          { text: "Salempur ka apna page", href: LAB_SALEMPUR },
          " hai, jismein wahan ke ilaake aur booking form dono alag hain.",
        ],
        "Aap in kasbon ke aas-paas ke kisi gaon me rehte hain aur sure nahi hain ki address cover hota hai ya nahi — to booking se pehle ek call kar lijiye. Hum saaf bata denge, taaki aap intezaar kar ke pareshan na hon.",
      ],
    },

    {
      id: "pata-landmark-deoria",
      heading: "Pata Kaise Likhein — Deoria Me Late Visit Ki Sabse Badi Wajah",
      lead: "Zyadatar deri phlebotomist ke na aane se nahi, pata na milne se hoti hai.",
      blocks: [
        "Deoria ke pate sheher jaise nahi hote. Yahan house number aur sector se zyada kaam landmark karta hai. Booking form me paanch cheezein daal dijiye, aur visit time par hone ke chance kaafi badh jaate hain.",
        {
          list: [
            "Mohalla ya gaon ka poora naam, aur uske saath post office ya block ka naam — Deoria jile me ek hi naam ke gaon ek se zyada jagah milte hain.",
            "Ek landmark jo shaam ko bhi dikhe: mandir, school, bank, petrol pump, block office ya chauraha. \"Gali no. 3\" akela kaafi nahi hota.",
            "Ghar tak gaadi aa sakti hai ya nahi — gali sankri hai to likh dijiye ki kis chauraha ya dukaan tak aana hai aur aage kaun milega.",
            "Ek mobile number jo us waqt uthaya ja sake. Bujurg ka test hai aur phone bete ke paas hai to bete ka number dijiye, aur pate par kaun milega wo bhi likh dijiye.",
            "Ghar me ek se zyada log test kara rahe hain to sabki booking ek hi slot me kar dijiye — ek hi visit me sabka sample ho jaayega.",
          ],
        },
        [
          "Koi bujurg hai, bistar par hai, diabetic hai jinki nas patli ho chuki hai, ya operation ke baad recovery kar raha hai — ye booking ke waqt bata dijiye. Sample dene se pehle ki poori taiyaari ",
          { text: "yahan", href: LAB_DEORIA_PREPARE },
          " likhi hai.",
        ],
      ],
    },

    {
      id: "ghar-se-kaunsi-jaanch",
      heading: "Kaun Si Jaanch Ghar Par Ho Jaati Hai, Aur Kis Ke Liye Centre Jaana Hi Padega",
      lead: "Sample wali jaanch ghar par. Machine wali jaanch ke liye building me jaana hoga.",
      blocks: [
        "Ye farq samajh lena is poore page ka sabse kaam ka hissa hai. Jo jaanch sirf khoon ya peshab ke sample par hoti hai, wo ghar se ho jaati hai. Jo jaanch machine par, aapke saamne honi hoti hai, wo ghar par ho hi nahi sakti — kisi bhi lab se nahi.",
        {
          table: {
            caption: "Deoria me ghar se hone wali aur na hone wali jaanch",
            head: ["Jaanch", "Ghar par sample?", "Dhyaan dene ki baat"],
            rows: [
              [
                "CBC, haemoglobin",
                "Haan",
                "Fasting ki zaroorat nahi — din me kabhi bhi",
              ],
              [
                "Blood sugar (fasting aur PP), HbA1c",
                "Haan",
                "Fasting wala sample subah; PP naashte ke theek 2 ghante baad, yaani doosra sample",
              ],
              [
                "Thyroid — T3, T4, TSH",
                "Haan",
                "Fasting nahi; thyroid ki goli sample ke BAAD lijiye, pehle nahi",
              ],
              [
                "Lipid profile, LFT, KFT",
                "Haan",
                "Lipid aur zyadatar full body package me 10–12 ghante fasting",
              ],
              [
                "Vitamin D, vitamin B12, ferritin",
                "Haan",
                "Fasting nahi; biotin ya multivitamin 48–72 ghante pehle band",
              ],
              [
                "Dengue, typhoid, malaria panel",
                "Haan",
                "Bukhar ka kaunsa din hai — yahi tay karta hai ki test kaam aayega ya nahi",
              ],
              [
                "Urine routine",
                "Haan",
                "Subah ka pehla sample sabse achha; container pehle se le lijiye",
              ],
              [
                "X-ray, ultrasound, sonography, ECG",
                "Nahi",
                "Machine par hoti hai — Deoria ya Gorakhpur me imaging centre par jaana hoga. Hum ye nahi karte.",
              ],
            ],
          },
        },
        [
          "Bukhar me din ginne ka poora hisaab — NS1 kis din tak, Widal kis din ke baad — ",
          { text: "Deoria ki lab test guide", href: BLOG_LAB_DEORIA_FEVER },
          " me alag se likha hai. Aur Gorakhpur kab jaana zaroori hai aur kab nahi, wo ",
          { text: "yahan", href: LAB_DEORIA_GORAKHPUR },
          " saaf likha hai — routine pathology ke liye jaana zaroori nahi hai, imaging ya specialist ke liye ho sakta hai.",
        ],
      ],
    },

    {
      id: "sabse-aam-blood-test-deoria",
      heading: "Deoria Me Ghar Se Sabse Zyada Karaye Jaane Wale Blood Test",
      lead: "Thyroid, sugar aur khoon ki kami — teen sabse aam wajah.",
      blocks: [
        [
          "Thyroid ka test (T3, T4, TSH) yahan sabse zyada mange jaane wale test me hai — wazan ka badhna ya ghatna, baal jhadna, thakan aur irregular periods, in shikayaton par doctor pehle yahi likhta hai. Isme fasting nahi chahiye, isliye slot kisi bhi waqt liya ja sakta hai. Ek baat dhyaan me rakhiye: thyroid ki goli sample dene ke baad lijiye. Sugar aur thyroid ki screening ka poora hissa ",
          { text: "yahan", href: LAB_DEORIA_DIABETES },
          " hai.",
        ],
        [
          "Diabetes ke liye Deoria me teen number chalte hain — fasting sugar, PP sugar aur HbA1c. Naye marij ke liye fasting aur PP dono, aur pehle se diabetes hai to HbA1c har teen mahine. Diabetic hain to saal me ek baar urine microalbumin aur KFT bhi karana chahiye; kidney par asar ka sabse pehla ishara wahi deta hai. Rate ",
          { text: "Deoria ki price list", href: LAB_DEORIA_PRICE },
          " me hai — is guide me ek bhi number jaan-boojh kar nahi likha gaya.",
        ],
        [
          "Teesri sabse aam wajah kamzori aur thakan hai. Yahan galti ye hoti hai ki haemoglobin kam aaya aur log sirf iron ki goli shuru kar dete hain. Kam haemoglobin par ferritin aur vitamin B12 bhi dekhna chahiye — Deoria jaise zyadatar shaakahaari jile me B12 ki kami aam hai. Auraton aur teenage ladkiyon ke liye ",
          { text: "anaemia wala section", href: LAB_DEORIA_ANAEMIA },
          " padh lijiye, aur saal ka routine checkup karana ho to ",
          { text: "full body checkup ka menu", href: LAB_DEORIA_FULLBODY },
          " khula hua hai.",
        ],
      ],
    },

    {
      id: "online-blood-test-book-deoria",
      heading: "Deoria Me Online Blood Test Book Karna — Kis Order Me Kya Hota Hai",
      lead: "Form se lekar report tak, paanch step.",
      blocks: [
        {
          list: [
            "Test ya package chuniye. Tay nahi kar paa rahe to bhi form bhar dijiye — call par bata denge.",
            "Form me naam, mobile number, mohalla ya gaon aur landmark bhariye. Doctor ka parcha hai to uski photo taiyaar rakhiye.",
            "Lagbhag 30 minute me confirmation call aati hai, jismein slot aur pata confirm hota hai, aur fasting chahiye ya nahi ye bata diya jaata hai.",
            "Tay time par trained phlebotomist ID card ke saath ghar aata hai aur sample aapke saamne liya jaata hai. Home collection ka koi alag visiting charge nahi — aap sirf test ka wahi rate dete hain jo pehle bataya gaya tha, cash ya UPI me, sample lene ke waqt.",
            "Report 24 ghante ke andar WhatsApp aur email par PDF me aati hai. Culture jaise test me 48–72 ghante lagte hain, aur wo booking ke waqt hi bata diya jaata hai.",
          ],
        },
        [
          "Booking ka form aur poora tareeka ",
          { text: "Deoria ke service page", href: LAB_DEORIA_BOOK },
          " par hai. Bahar rehte hain aur ghar walon ka test karana hai to bhi booking aap hi kar sakte hain — number ghar wale ka dijiye, aur ",
          { text: "bahar kaam karne walon ke liye likha hissa", href: LAB_DEORIA_MIGRANT },
          " ek baar dekh lijiye.",
        ],
      ],
    },

    {
      id: "report-aur-ek-hi-lab-deoria",
      heading: "Report Aane Ke Baad — Header Me Kya Dekhein",
      lead: "Numbers se pehle report ke upar wala hissa padhiye.",
      blocks: [
        "Report kholte hi log seedhe \"High\" aur \"Low\" par chale jaate hain. Uske pehle upar wala hissa ek baar dekh lena chahiye — wahin se pata chalta hai ki report bharose layak hai ya nahi.",
        {
          list: [
            "Naam, umar aur gender sahi hain ya nahi — reference range gender aur umar ke hisaab se badalti hai.",
            "Sample kis din aur kis waqt liya gaya — fasting wale test me ye zaroori hai.",
            "Test ka method likha hai ya nahi. Method badalne par number thoda badalta hai, aur follow-up me yahi confusion paida karta hai.",
            "Reference range usi report par chhapi hai ya nahi. Internet ke chart se number mat milaiye — har lab ka analyser aur range apna hota hai.",
          ],
        },
        [
          "Isi wajah se ek baat baar-baar kahi jaati hai: jo number aap mahino tak track karte hain — HbA1c, TSH, creatinine, haemoglobin — unhe hamesha ek hi lab se karaiye. Ek jagah TSH 4.5 aur doosri jagah 4.1 aane ka matlab ye nahi ki thyroid badal gaya. Report kab tak aur kahan aati hai wo ",
          { text: "report wale section", href: LAB_DEORIA_REPORTS },
          " me hai, aur numbers ko line-by-line samajhna ho to ",
          { text: "report kaise padhein", href: BLOG_LAB_VARANASI_REPORT },
          " alag guide me hai.",
        ],
        {
          note: {
            title: "Flag ka matlab diagnosis nahi hota",
            text: "Range se thoda bahar hona bahut aam hai aur aksar harmless. Lekin tezi se girta platelet count, bahut zyada blood sugar ke saath ulti ya susti, khatarnak had tak kam haemoglobin, ya bahut badha creatinine ke saath peshab ka kam ho jaana — in chaar me usi din doctor ko dikhaiye, intezaar mat kijiye.",
            tone: "warn",
          },
        },
      ],
    },

    {
      id: "deoria-ke-aas-paas-ke-jile",
      heading: "Deoria Ke Aas-paas — Kis Jile Ka Apna Page Hai",
      blocks: [
        [
          "Har jile ka apna page, apna form aur apne ilaake hain — ",
          { text: "Salempur", href: LAB_SALEMPUR },
          " (Bhatni, Lar aur Bhatpar Rani ke aas-paas), ",
          { text: "Kushinagar", href: LAB_KUSHINAGAR },
          ", ",
          { text: "Gorakhpur", href: LAB_GORAKHPUR },
          " aur ",
          { text: "Varanasi", href: LAB_VARANASI },
          ". Jis jile me aap rehte hain, booking wahin ke page se kijiye — coverage aur slot wahin ke likhe hote hain.",
        ],
        [
          "Lab chunte waqt kya-kya poochhna chahiye, aur ek lab kya-kya nahi keh sakta — us par alag se poora guide hai: ",
          { text: "pathology lab kaise chunein", href: BLOG_PATHOLOGY_VARANASI },
          ". Wo Varanasi ke naam se likha hai, lekin sawaal har jile me wahi hain.",
        ],
      ],
    },

    {
      id: "aage-kya-karein-diagnostic-deoria",
      heading: "Aage Kya Karein",
      blocks: [
        [
          "Test tay hai to booking seedhi hai — ",
          { text: "Deoria ka service page", href: LAB_DEORIA },
          " kholiye, form bhariye, aur lagbhag 30 minute me confirmation call aa jaayegi. ",
          { text: "Saare test aur rate ek jagah", href: HOME_RATE_LIST },
          " dekhne hon to home page par poori list hai.",
        ],
        [
          "Test tay nahi hai to pehle ",
          { text: "Deoria ki lab test guide", href: BLOG_LAB_DEORIA },
          " padh lijiye — kaun sa package kis ke liye hai aur bukhar me kis din kaun sa test, dono wahan hain. Saal ka routine checkup karana ho to ",
          { text: "full body checkup me kya hona chahiye", href: BLOG_FULLBODY_VARANASI },
          " kaam aayega.",
        ],
        [
          "Aur agar sirf itna poochhna hai ki aapka mohalla ya gaon cover hota hai ya nahi — ",
          { text: "call kar lijiye", href: CONTACT },
          ". Ek minute ka jawab hai, aur intezaar karne se behtar hai.",
        ],
      ],
    },
  ],

  /* Seven questions, all in this page's own lane — jagah, pata, machine wali
     jaanch, ek hi lab. Checked against /lab-test/deoria's FAQPage (cost,
     coverage, report time, fasting, booking, Gorakhpur, "do I need to visit a
     lab") and against /blogs/lab-test/deoria's seven (package, dengue ka din,
     Gorakhpur OPD, gaon coverage, alag lab, haemoglobin, GAMCA) so that no
     question is answered twice on this domain. */
  faqs: [
    {
      question: "Deoria me MedicoBharat ka koi diagnostic centre ya walk-in counter hai?",
      answer:
        "Nahi. Deoria me hum home collection service hain — koi walk-in counter nahi hai, aur kisi mohalle me apni branch hone ka daawa hum nahi karte. Routine blood aur urine ki jaanch ke liye iski zaroorat bhi nahi padti: sample aapke ghar se liya jaata hai aur report 24 ghante me PDF me aa jaati hai. Jahan machine par jaanch honi hai — X-ray, ultrasound, ECG — wahan aapko imaging centre jaana hi hoga, aur wo hamari service me shaamil nahi hai.",
    },
    {
      question: "Civil Lines, Ramgulam Tola ya Gorakhpur Road par ghar hai — sample lene koi aayega?",
      answer:
        "Haan, Deoria Sadar ke mohalle sheher ke andar hi hain aur wahan collection hoti hai. Pata likhte waqt sirf road ka naam mat likhiye — Gorakhpur Road aur Station Road dono lambi hain. Sabse paas ka chauraha, petrol pump, mandir, school ya bank likh dijiye, aur Civil Lines ya Kacheri Road ke aas-paas ho to building ka naam aur floor bhi. Isse visit time par hone ke chance sabse zyada badhte hain.",
    },
    {
      question: "Deoria me raat me ya 24 ghante sample collection hota hai?",
      answer:
        "Nahi. Home visit ke slot subah 6 baje se shuru hote hain aur shaam tak chalte hain, isliye fasting wale test subah aur baaki test din me kabhi bhi ho jaate hain. Hum 24 ghante khula lab hone ka daawa nahi karte — hum 24 ghante me report milne ka karte hain. Raat ko turant jaanch ki zaroorat ho to wo emergency hai, aur uske liye hospital jaana chahiye, booking nahi karni chahiye.",
    },
    {
      question: "Sugar ke fasting aur PP dono test karane hain — do baar sample dena padta hai?",
      answer:
        "Haan. Fasting sugar khaali pet liya jaata hai aur PP sugar naashte ke theek 2 ghante baad — ye do alag sample hain, ek hi baar me dono nahi ho sakte. Isliye subah ka jaldi wala slot lijiye, fasting sample dijiye, turant naashta kar lijiye, aur do ghante baad doosra sample. Booking ke waqt bata dijiye ki fasting aur PP dono chahiye, taaki dono ka time ek saath tay ho jaaye. HbA1c me ye jhanjhat nahi hai — usme fasting lagti hi nahi.",
    },
    {
      question: "Ghar par sample lene wala kaun aata hai, aur use kaise pehchanein?",
      answer:
        "Trained phlebotomist aata hai aur uske paas ID card hota hai — maangne me sankoch mat kijiye, dikhana uska kaam hai. Sample aapke saamne liya jaata hai. Booking ke waqt jo test tay hue the wahi liye jaane chahiye, aur rate wahi hona chahiye jo pehle bataya gaya tha; home collection ka koi alag visiting charge nahi hai. Payment sample lene ke waqt hota hai, cash ya UPI se.",
    },
    {
      question: "Main sheher se bahar rehta hoon — Deoria me ghar walon ka test book kar sakta hoon?",
      answer:
        "Haan, aur ye yahan aam baat hai. Booking aap kar sakte hain, lekin form me mobile number us insaan ka dijiye jo us waqt ghar par milega, warna confirmation call kaam nahi karegi. Pate ke saath landmark zaroor likhiye aur ye bhi bata dijiye ki ghar par kaun milega. Report PDF me aati hai, isliye wo aapko bhi mil jaayegi aur ghar walon ko bhi.",
    },
    {
      question: "Ghar par liya gaya sample lab tak pahunchne me kharab to nahi hota?",
      answer:
        "Sample lene ke baad wo usi din processing ke liye bhej diya jaata hai, aur routine blood aur urine test isi tareeke se hote hain — ye koi nayi vyavastha nahi hai. Aap apni taraf se do cheezein kar sakte hain: jo slot tay hua hai us par taiyaar rahiye, aur fasting wale test me saada paani peete rahiye. Der sabse zyada tab hoti hai jab pata nahi milta, isliye landmark likhna sabse kaam ki cheez hai.",
    },
  ],

  relatedLinks: {
    heading: "Deoria Ke Liye Aage Kya Dekhein",
    intro:
      "Is guide me jagah, pata aur booking ka tareeka hai. Test chunna aur report samajhna alag guide me hai, aur price sirf service page par.",
    groups: [
      {
        title: "Deoria Lab Test",
        links: [
          {
            href: LAB_DEORIA,
            label: "Deoria me lab test — booking aur free home collection",
            sub: "Deoria Sadar, Rudrapur, Barhaj, Bhatpar Rani aur aas-paas",
          },
          {
            href: LAB_DEORIA_HOME,
            label: "Home sample collection — kaunse kasbe, kaunse slot",
          },
          {
            href: LAB_DEORIA_PRICE,
            label: "Deoria me lab test ka price",
            sub: "CBC, thyroid, HbA1c aur full body package",
          },
          {
            href: LAB_DEORIA_BOOK,
            label: "Booking kaise hoti hai — ek slot me poora ghar",
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
            href: LAB_KUSHINAGAR,
            label: "Kushinagar me lab test",
            sub: "Padrauna aur aas-paas ke kasbe",
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
            href: BLOG_LAB_DEORIA,
            label: "Deoria me kaun sa test aur kab",
            sub: "Package chunna, bukhar me din ginna, report dekhna",
          },
          {
            href: BLOG_PATHOLOGY_VARANASI,
            label: "Pathology lab chunte waqt kya poochhein",
            sub: "Paanch sawaal — kisi bhi lab ke liye",
          },
          {
            href: BLOG_FULLBODY_VARANASI,
            label: "Full body checkup me kya hona chahiye",
            sub: "Package me kya chhoot jaata hai",
          },
          { href: CONTACT, label: "Contact — coverage aur test chunne me madad" },
        ],
      },
    ],
  },
};
