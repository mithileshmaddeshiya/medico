/**
 * /blogs/pathology-lab/varanasi — "Varanasi Me Pathology Lab Kaise Chunein"
 *
 * ── WHY A THIRD VARANASI URL, AND HOW IT STAYS OUT OF THE OTHER TWO'S WAY ─
 * Varanasi now has four pages in the same neighbourhood. They only survive
 * together because each answers a question the others do not:
 *
 *   /lab-test/varanasi                     → "book kahan se karaun" — form, price, menu
 *   /blogs/lab-test/varanasi               → "kaun sa test kab" — symptom, din, report
 *   /blogs/full-body-checkup/varanasi      → "package me kya hona chahiye"
 *   /blogs/pathology-lab/varanasi (this)   → "kis lab par bharosa karun"
 *
 * The lane here is TRUST, not booking and not clinical choice: how a person
 * picks a lab in a city full of them, what MedicoBharat does, and — the part
 * that makes the page worth reading — what it deliberately does NOT claim.
 * That last section is the reason this article exists rather than being three
 * more paragraphs on the service page: an honest limits list is a bad fit for a
 * page whose job is to convert, and a very good fit for a page whose job is to
 * be believed.
 *
 * It is also the only page on the site written for the BRAND query. Google was
 * spell-correcting "medicobharat" to "medical bharat" (see the note in
 * src/lib/schema.js), and "MedicoBharat Varanasi" had no page that answered it
 * directly. Now it does.
 *
 * ── WHAT WAS REMOVED FROM THE SOURCE COPY THIS WAS DRAFTED FROM ──────────
 * The brief for this page arrived carrying claims this business cannot stand
 * behind. Every one of them was cut, and each is listed here so nobody puts it
 * back thinking it was an oversight:
 *
 *   "certified labs" / "certified automated analyzers"
 *       → CUT. No accreditation is claimed anywhere on this site. NABL and
 *         pathologist verification were removed from this project once already
 *         (see the warning above defaultFaqs in src/data/lab/defaults.js).
 *   "High Accuracy" / "modern machines" / "precise test results"
 *       → CUT. Unverifiable, and every lab's website says it.
 *   "100% hygienic"
 *       → CUT. Replaced by what is actually true and checkable: the sample is
 *         drawn in front of you, by someone carrying an ID card.
 *   "Same-Day Reports" / "Instant Digital Report"
 *       → CUT, and it contradicted itself in the same sentence as "24 ghante".
 *         The site's number is 24 hours for routine work; cultures take 48–72.
 *   "Budget-Friendly Rates" / "kam daam mein premium"
 *       → CUT. A price comparison we cannot substantiate. What replaces it is
 *         checkable: the rate is on the card, and home collection adds nothing
 *         to it.
 *   "Cardiac Markers"
 *       → CUT. Not on the menu (see defaultTests in src/data/lab/defaults.js).
 *         Listing a test we do not run is the one mistake that costs a booking
 *         AND the trust in the same visit. Heart risk here means lipid profile.
 *
 * ── NO PRICES, SAME AS THE SIBLINGS ──────────────────────────────────────
 * Not one rate is stated. Every sentence that would carry a number links to
 * #lab-test-price-varanasi instead, so the rate lives in one file
 * (src/data/lab/content/varanasi.js) and cannot drift across four pages.
 *
 * ── CLAIMS THAT ARE MADE ─────────────────────────────────────────────────
 * Only the five the business confirms: free home collection, a trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI
 * on collection. Nothing else.
 *
 * ── IMAGES: NONE ─────────────────────────────────────────────────────────
 * /public has no Varanasi photography. `hero` is optional and og:image resolves
 * to the generated card at /blogs/pathology-lab/varanasi/og. Note that the
 * sibling lab-test-in-varanasi.js points its hero at
 * /navheroimage/labtestimg.webp, which is NOT in /public — that is a live bug,
 * not a pattern to copy.
 */
import {
  BLOG_AUTHOR,
  BLOG_PUBLISHER,
  INDEXABLE,
  canonicalFor,
} from "../shared";

/* Link targets as constants — a route rename is one line here instead of a hunt
   through the prose. Section ids come from src/data/lab/content/varanasi.js;
   rename one there and these anchors break silently. */
const LAB_VARANASI = "/lab-test/varanasi";
const LAB_VARANASI_HOME = "/lab-test/varanasi#home-sample-collection-varanasi";
const LAB_VARANASI_POPULAR = "/lab-test/varanasi#popular-blood-tests-varanasi";
const LAB_VARANASI_FULLBODY = "/lab-test/varanasi#full-body-checkup-varanasi";
const LAB_VARANASI_PRICE = "/lab-test/varanasi#lab-test-price-varanasi";
const LAB_VARANASI_FEVER = "/lab-test/varanasi#fever-dengue-typhoid-testing-varanasi";
const LAB_VARANASI_DIABETES = "/lab-test/varanasi#diabetes-thyroid-heart-screening";
const LAB_VARANASI_WOMEN = "/lab-test/varanasi#pregnancy-women-health-tests";
const LAB_VARANASI_PREPARE = "/lab-test/varanasi#how-to-prepare-for-blood-test";
const LAB_VARANASI_CHOOSE = "/lab-test/varanasi#choosing-a-reliable-lab";
const LAB_VARANASI_REPORTS = "/lab-test/varanasi#reports-turnaround-time";
const LAB_VARANASI_BOOK = "/lab-test/varanasi#how-to-book-lab-test-varanasi";

const BLOG_LAB_VARANASI = "/blogs/lab-test/varanasi";
const BLOG_LAB_VARANASI_FASTING = "/blogs/lab-test/varanasi#fasting-aur-taiyari";
const BLOG_LAB_VARANASI_REPORT = "/blogs/lab-test/varanasi#report-kaise-padhein";
const BLOG_FULLBODY_VARANASI = "/blogs/full-body-checkup/varanasi";
/* The four newer Varanasi guides. Each of them links back to this page for the
   trust question, so every link here runs both ways. */
const BLOG_HOME_VARANASI = "/blogs/home-sample-collection/varanasi";
const BLOG_DIABETES_VARANASI = "/blogs/diabetes-thyroid-test/varanasi";
const BLOG_DENGUE_VARANASI = "/blogs/dengue-typhoid-test/varanasi";
const BLOG_LIVER_KIDNEY_VARANASI = "/blogs/liver-kidney-test/varanasi";
const BLOG_LAB_DEORIA = "/blogs/lab-test/deoria";

const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_AZAMGARH = "/lab-test/azamgarh";
const HOME_RATE_LIST = "/";
const CONTACT = "/contact";
const ABOUT = "/about";

export const pathologyLabVaranasi = {
  category: "pathology-lab",
  city: "varanasi",

  /* 44 characters. The root layout appends " | MedicoBharat" (template in
     src/app/layout.js), so Google renders 59 — just inside the ~60 it shows.
     Deliberately NOT "Best Pathology Lab in Varanasi": a title that calls
     itself the best is a claim, and this page's whole argument is that you
     should not take such a claim from anyone, us included. */
  title: "Varanasi Me Pathology Lab Kaise Chunein",

  /* ~155 characters. Hinglish, with the English terms that have to match left
     intact: pathology lab, diagnostic centre, home collection. */
  description:
    "Varanasi me pathology lab ya diagnostic centre chunte waqt kya poochhein, MedicoBharat kya karta hai aur kya nahi — home collection, report aur rate ki saaf baat.",

  /* Ordered strongest first. Every term here appears in the visible copy — a
     keyword that lives only in this array is the kind that gets a page filtered
     rather than ranked. */
  keywords: [
    "Pathology Lab in Varanasi",
    "Best Pathology Lab in Varanasi",
    "Diagnostic Centre in Varanasi",
    // Both spellings on purpose: "centre" and "center" are two different
    // strings a person types. Prose uses "Centre", like the rest of the site.
    "Diagnostic Center in Varanasi",
    "MedicoBharat Varanasi",
    "Medico Bharat Varanasi",
    "Blood Test Home Collection Varanasi",
    "Lab Test Home Collection Varanasi",
    "Varanasi me pathology lab kaise chunein",
    "Banaras me pathology lab",
    "Blood Test in Varanasi",
    "Lab Test Near Me Varanasi",
    "Sarnath Lanka Bhelupur blood test",
  ],

  canonical: canonicalFor("pathology-lab", "varanasi"),
  robots: INDEXABLE,
  author: BLOG_AUTHOR,
  publisher: BLOG_PUBLISHER,

  publishedAt: "2026-08-27",
  updatedAt: "2026-08-27",

  /* Stated, not computed — a number that changes with every edited sentence is
     a number nobody maintains. */
  readingMinutes: 7,

  /** The skimmer's version of the whole article. */
  takeaways: [
    "Lab ka daawa nahi, uske jawab dekhiye: rate pehle likha hai ya baad me, report kitne ghante me, aur method report par chhapa hai ya nahi.",
    "Routine pathology ke liye Varanasi me kahin jaana zaroori nahi — blood aur urine ke aam test sirf sample par hote hain, aur sample ghar par liya ja sakta hai.",
    "Follow-up test hamesha ek hi lab me karayein. Alag analyser ki reference range alag hoti hai, isliye number badla hua lagta hai jabki sehat waise ki waise hai.",
    "Hum NABL accreditation ka daawa nahi karte. Jo cheez confirm nahi kar sakte, wo hum likhte bhi nahi — aur yahi sawaal aapko har lab se poochhna chahiye.",
  ],

  sections: [
    {
      id: "varanasi-me-pathology-lab-chunna",
      heading: "Varanasi Me Lab Ki Kami Nahi Hai — Bharose Ki Hai",
      blocks: [
        "Lanka, Sunderpur, Bhelupur, Sigra, Cantt aur Sarnath — Varanasi me har kuch sau meter par ek collection point mil jaata hai, aur poore Purvanchal se log yahin jaanch karane aate hain. Isliye \"lab kahan hai\" koi sawaal hi nahi hai. Sawaal ye hai ki inmein se kis par bharosa karein, jab har ek ka board kareeb-kareeb ek jaisi baat kehta hai.",
        "Is guide me wahi hai: lab chunte waqt kya poochhna chahiye, MedicoBharat Varanasi me theek kya karta hai, aur — jo hissa aksar kahin nahi milta — kya nahi karta. Booking, poori price list aur test menu is page par nahi hai; wo service page ka kaam hai.",
        [
          "Book karna hai to seedhe ",
          { text: "Varanasi me lab test aur free home sample collection", href: LAB_VARANASI },
          " kholiye. Is article me ek bhi rate nahi likha hai, jaan-boojh kar — rate ek hi jagah rahega to purana kabhi nahi hoga.",
        ],
      ],
    },

    {
      id: "medicobharat-varanasi-kya-karta-hai",
      heading: "MedicoBharat Varanasi Me Karta Kya Hai",
      lead: "Seedha jawab, bina ghumaye.",
      blocks: [
        "MedicoBharat ek lab test service hai jo aapke ghar se blood aur urine ka sample collect karti hai. Aap test chunte hain, hum lagbhag 30 minute me call kar ke slot aur pata confirm karte hain, trained phlebotomist ID card ke saath aata hai, sample aapke saamne liya jaata hai, aur report 24 ghante ke andar WhatsApp aur email par PDF me aa jaati hai.",
        {
          table: {
            caption: "Kya milta hai — aur wo cheez aap khud kaise jaanch sakte hain",
            head: ["Cheez", "Kya matlab", "Aap kaise check karein"],
            rows: [
              [
                "Free home sample collection",
                "Sample ghar par, koi visiting charge nahi",
                "Booking ke waqt total poochhiye — jo card par likha hai bas wahi aana chahiye",
              ],
              [
                "Trained phlebotomist, ID card ke saath",
                "Sample aapke saamne liya jaata hai",
                "Darwaze par ID card maangiye — ye aapka haq hai",
              ],
              [
                "Slot subah 6 baje se",
                "Fasting wale test subah nipat jaate hain",
                "Booking par time chuniye; confirmation call par dobara tay ho jaata hai",
              ],
              [
                "Report 24 ghante me",
                "Routine test ki PDF WhatsApp aur email par",
                "Culture jaise test 48–72 ghante lete hain — ye pehle hi bata diya jaata hai",
              ],
              [
                "Payment sample lene par",
                "Cash ya UPI — PhonePe, Google Pay, Paytm",
                "Advance kisi cheez ka nahi lagta",
              ],
            ],
          },
        },
        [
          "Test ka poora menu — CBC, thyroid, sugar, HbA1c, lipid, LFT, KFT, vitamin D, B12, dengue aur full body package — ",
          { text: "popular blood tests wale section", href: LAB_VARANASI_POPULAR },
          " me hai, aur package ka byora ",
          { text: "yahan", href: LAB_VARANASI_FULLBODY },
          ".",
        ],
      ],
    },

    {
      id: "kya-hum-daawa-nahi-karte",
      heading: "Aur Ye Cheezein Hum Nahi Karte",
      lead: "Ye section is page par sabse zaroori hai.",
      blocks: [
        "Har lab ki website ye batati hai ki wo kya karti hai. Bahut kam ye batati hain ki kya nahi karti — aur aksar wahi cheez hoti hai jiske liye aap ghar se nikal chuke hote hain.",
        {
          list: [
            "Hum NABL accreditation ka daawa nahi karte. Agar aapko accredited lab chahiye — kai insurance aur videsh ke kaam me chahiye hoti hai — to ye seedha poochh kar tay kar lijiye, hamse bhi aur kisi bhi lab se.",
            "Hum X-ray, ultrasound, ECG, CT ya MRI nahi karte. Ye sirf pathology hai — blood aur urine ke test. Imaging ke liye aapko centre par hi jaana padega.",
            "Hum 24 ghante khula lab hone ka daawa nahi karte. 24 ghante report milne ka karte hain — do alag baatein hain.",
            "Hum cardiac marker jaise emergency test nahi karte. Seene me dard ho raha hai to lab test book mat kijiye — seedha hospital jaaiye.",
            "Hum report par diagnosis nahi likhte aur dawa nahi batate. Report doctor ke liye hai; number samajhne me madad kar sakte hain, ilaaj nahi.",
          ],
        },
        {
          note: {
            title: "Emergency me lab pehla kadam nahi hai",
            text: "Seene me dard, saans phoolna, behoshi, jhatke, gardan ki akdan ke saath tez bukhar, ya bahut tez khoon behna — in sab me sample ka intezaar khatarnak hai. Seedha najdeeki hospital jaaiye. Blood test uske baad ka hissa hai, uska vikalp nahi.",
            tone: "warn",
          },
        },
      ],
    },

    {
      id: "varanasi-popular-package",
      heading: "Varanasi Me Sabse Zyada Karaye Jaane Wale Package",
      lead: "Kis package me kya, aur wo kis ke liye bana hai.",
      blocks: [
        {
          table: {
            caption: "Varanasi me popular health checkup package",
            head: ["Package", "Ismein kya", "Kis ke liye"],
            rows: [
              [
                "Full Body Checkup (basic)",
                "CBC, blood sugar, lipid profile, LFT, KFT, urine routine",
                "Saal me ek baar, 30 ke baad har bade ke liye",
              ],
              [
                "Advanced Full Body",
                "Basic ke saath thyroid, HbA1c aur vitamin D/B12",
                "40 ke baad, ya ghar me diabetes/thyroid ki history ho to",
              ],
              [
                "Diabetes ki screening",
                "Fasting sugar, PP sugar, HbA1c",
                "Zyada pyaas, baar-baar peshab, ghaav der se bharna",
              ],
              [
                "Heart risk",
                "Lipid profile — cholesterol aur triglycerides",
                "35 ke baad, ya ghar me heart ki history ho to",
              ],
              [
                "Thyroid Profile",
                "T3, T4 aur TSH",
                "Wazan, baal, thakan, irregular periods",
              ],
              [
                "Barsaat ka fever panel",
                "Dengue, typhoid aur malaria ki jaanch, CBC ke saath",
                "Teen din se zyada ka bukhar",
              ],
            ],
          },
        },
        [
          "Rate aur har package me theek-theek kitne test hain — wo ",
          { text: "Varanasi ki price list", href: LAB_VARANASI_PRICE },
          " me hai. Package me kya chhoot jaata hai aur \"80+ parameters\" ka sach kya hai, uspar poori guide alag hai: ",
          { text: "full body checkup me kya hona chahiye", href: BLOG_FULLBODY_VARANASI },
          ".",
        ],
        [
          "Bukhar ka poora panel ",
          { text: "yahan", href: LAB_VARANASI_FEVER },
          ", diabetes-thyroid-heart ki screening ",
          { text: "yahan", href: LAB_VARANASI_DIABETES },
          ", aur pregnancy aur mahilaon ki sehat ke test ",
          { text: "yahan", href: LAB_VARANASI_WOMEN },
          " hain.",
        ],
      ],
    },

    {
      id: "home-collection-varanasi-kaise",
      heading: "Varanasi Me Home Sample Collection Kaise Book Hota Hai",
      lead: "Chaar step, aur har step me kya hota hai.",
      blocks: [
        {
          list: [
            "Test chuniye — doctor ke parche ke hisaab se, ya shikayat ke hisaab se. Parcha hai to uski photo taiyaar rakhiye; usi panel ke hisaab se booking ho jaayegi.",
            "Pata aur slot bhariye — Varanasi ka apna mohalla aur wo waqt jo aapko theek lage. Fasting wale test ke liye subah ka slot chuniye.",
            "Confirmation call — lagbhag 30 minute me. Ismein slot aur pata pakka hota hai, aur ye bhi bata diya jaata hai ki test me fasting chahiye ya nahi.",
            "Sample aur report — phlebotomist ID card ke saath aata hai, sample aapke saamne leta hai, aur report 24 ghante ke andar WhatsApp aur email par PDF me aati hai.",
          ],
        },
        [
          "Kaunse ilaake cover hote hain — Sarnath, Ramnagar, Bhelupur, Lanka, Sigra, Cantt aur unke aas-paas — wo ",
          { text: "home sample collection wale section", href: LAB_VARANASI_HOME },
          " me hai. Aapka pata in ilaakon ke bahar hai aur aap sure nahi hain, to booking se pehle ek call kar lijiye. Step-by-step booking ",
          { text: "yahan", href: LAB_VARANASI_BOOK },
          " hai.",
        ],
        [
          "Sample dene se pehle kya dhyaan rakhna hai — fasting kitni der, kaunsi dawa kab leni hai — uspar ",
          { text: "taiyari wala section", href: LAB_VARANASI_PREPARE },
          " hai, aur guide me ",
          { text: "fasting aur taiyari ka hissa", href: BLOG_LAB_VARANASI_FASTING },
          " hai.",
        ],
      ],
    },

    {
      id: "lab-chunte-waqt-kya-poochhein",
      heading: "Kisi Bhi Lab Se Poochhne Layak Paanch Sawaal",
      lead: "Hamse bhi. Jawab na mile to wahi jawab hai.",
      blocks: [
        "\"Best pathology lab in Varanasi\" ka koi ek jawab nahi hota, aur jo bhi khud ko sabse behtar bataye usse thoda sawaal poochh lena chahiye. Ye paanch cheezein pooch kar aap khud faisla kar sakte hain.",
        {
          table: {
            caption: "Paanch sawaal, aur sahi jawab kaisa dikhta hai",
            head: ["Sawaal", "Sahi jawab", "Chinta ki baat"],
            rows: [
              [
                "Rate pehle likha milta hai?",
                "Haan — booking se pehle, likhit me",
                "\"Sample ke baad bata denge\"",
              ],
              [
                "Home collection ka alag charge?",
                "Nahi, ya rate me pehle se juda hua",
                "Visiting charge jo baad me judta hai",
              ],
              [
                "Report kitne ghante me, kis format me?",
                "Saaf ginti, aur PDF",
                "\"Jaldi mil jaayegi\"",
              ],
              [
                "Sample lene wala ID card ke saath aata hai?",
                "Haan, aur dikhata hai",
                "Naam-pata poochhne par tal-matol",
              ],
              [
                "Report par reference range usi lab ki hai?",
                "Haan — method aur range dono chhape hote hain",
                "Range hai hi nahi, ya kisi aur ki nakal",
              ],
            ],
          },
        },
        [
          "Aakhri sawaal sabse kam poochha jaata hai aur sabse zyada kaam ka hai. Jo cheez aap mahino tak track karte hain — HbA1c, TSH, creatinine, haemoglobin — usmein ek hi lab par tike rehna utna hi zaroori hai jitna khud ka number, kyunki alag analyser aur alag method ki range thodi alag hoti hai. Iska poora hissa ",
          { text: "bharosemand lab kaise chunein", href: LAB_VARANASI_CHOOSE },
          " me hai.",
        ],
        [
          "Report aane ke baad usmein kya dekhna chahiye, aur kaunse result usi din doctor ko dikhane chahiye — wo ",
          { text: "report kaise padhein", href: BLOG_LAB_VARANASI_REPORT },
          " me hai. Report kab tak aati hai aur kahan aati hai, wo ",
          { text: "yahan", href: LAB_VARANASI_REPORTS },
          ".",
        ],
      ],
    },

    {
      id: "aage-kya-karein-varanasi",
      heading: "Aage Kya Karein",
      blocks: [
        [
          "Test tay hai to booking seedhi hai — ",
          { text: "Varanasi ka service page", href: LAB_VARANASI },
          " kholiye, form bhariye, aur lagbhag 30 minute me confirmation call aa jaayegi. ",
          { text: "Saare test aur rate ek jagah", href: HOME_RATE_LIST },
          " dekhne hon to home page par poori list hai.",
        ],
        [
          "Tay nahi kar paa rahe ki kaun sa test karana hai — to ",
          { text: "call kar ke poochh lijiye", href: CONTACT },
          ", ya pehle ",
          { text: "kaun sa test kab karayein wali guide", href: BLOG_LAB_VARANASI },
          " padh lijiye. Hamare baare me aur jaanna ho to ",
          { text: "About page", href: ABOUT },
          " par hai.",
        ],
        [
          "Varanasi ke bahar se hain — ",
          { text: "Gorakhpur", href: LAB_GORAKHPUR },
          ", ",
          { text: "Azamgarh", href: LAB_AZAMGARH },
          " aur ",
          { text: "Deoria ke liye guide", href: BLOG_LAB_DEORIA },
          " — har jile ka apna page, apna form aur apne ilaake hain.",
        ],
      ],
    },
  ],

  /* Six questions, all in this page's own trust lane. Deliberately NOT here:
     fasting hours, dengue timing, report timing, full-body parameter count and
     the cost question — those are already FAQPage entries on
     /blogs/lab-test/varanasi, /blogs/full-body-checkup/varanasi and
     /lab-test/varanasi, and two FAQPage nodes on one domain answering the same
     question compete for one rich result. */
  faqs: [
    {
      question: "MedicoBharat Varanasi me kya-kya hota hai aur kya nahi hota?",
      answer:
        "Hota hai: routine pathology — CBC, thyroid, blood sugar, HbA1c, lipid, liver aur kidney function, vitamin D aur B12, dengue, urine routine aur full body checkup package. Sample aapke ghar se liya jaata hai aur report 24 ghante me PDF me aati hai. Nahi hota: X-ray, ultrasound, ECG, CT ya MRI — ye imaging hai, pathology nahi, aur iske liye centre par jaana padega. Cardiac marker jaise emergency test bhi hum nahi karte.",
    },
    {
      question: "Kya MedicoBharat NABL accredited lab hai?",
      answer:
        "Hum NABL accreditation ka daawa nahi karte. Jo cheez hum confirm nahi kar sakte, wo hum apne page par likhte bhi nahi — aur yahi wajah hai ki is site par kahin \"certified\" ya \"accredited\" nahi likha milega. Agar aapko accredited lab ki report chahiye — kai insurance claim aur videsh ke kaam me chahiye hoti hai — to ye sawaal booking se pehle seedha poochh lijiye, hamse bhi aur kisi bhi lab se.",
    },
    {
      question: "Home sample collection ka koi extra charge lagta hai?",
      answer:
        "Nahi. Home sample collection free hai — aap sirf test ka wahi price dete hain jo card par likha hai. Na visiting charge, na convenience fee, na koi baad me judne wala amount. Payment sample lene ke waqt hota hai, cash ya UPI se. Booking ke waqt total poochh lena aapka haq hai, aur jo total us waqt bataya jaaye wahi aana chahiye.",
    },
    {
      question: "Report kis format me milti hai — doctor use maan lenge?",
      answer:
        "Report PDF me WhatsApp aur email dono par aati hai, aur usmein har test ke saath uski reference range chhapi hoti hai — wahi range jo us lab ke method par lagoo hoti hai. Doctor ko dikhane ke liye phone par PDF kaafi hoti hai; chahein to print bhi nikaal sakte hain. Report ke number ko internet ke kisi chart se mat milaiye, uske saath chhapi range se hi milaiye.",
    },
    {
      question: "Collection centre par jaakar sample dene aur ghar par dene me farq kya hai?",
      answer:
        "Test aur report me koi farq nahi — sample wahi hai. Farq safar ka hai: fasting wale test me subah khaali pet lab tak jaana sabse mushkil hissa hota hai, aur report lene ke liye dobara jaana ek aur din le leta hai. Ghar se sample dene par ye dono chakkar khatm ho jaate hain. Bujurg, chhote bachche, pregnancy, operation ke baad recovery aur wo log jinka din kaam se bandha hai — inke liye yahi asli fayda hai.",
    },
    {
      question: "Purani report sample lene wale ko dikhani chahiye?",
      answer:
        "Haan, aur ye choti si baat bahut kaam ki hai. Purani report, chal rahi dawaiyon ki list aur doctor ka parcha saath rakhiye. Isse do cheezein hoti hain: jo test dohraya ja raha hai wo usi tarah karaya jaata hai jaise pehle hua tha, aur agar koi dawa test ko prabhavit karti hai — jaise thyroid ki goli ya biotin wala supplement — to wo pehle hi pakad me aa jaata hai.",
    },
  ],

  relatedLinks: {
    heading: "Varanasi Ke Liye Aage Kya Dekhein",
    intro:
      "Is guide me lab chunna aur bharosa karna hai. Booking, price aur poora test menu service page par hai.",
    groups: [
      {
        title: "Varanasi Lab Test",
        links: [
          {
            href: LAB_VARANASI,
            label: "Varanasi me lab test — booking aur free home collection",
            sub: "Sarnath, Lanka, Bhelupur, Sigra, Cantt aur Ramnagar",
          },
          {
            href: LAB_VARANASI_PRICE,
            label: "Varanasi me lab test ka price",
            sub: "CBC, thyroid, HbA1c aur full body package",
          },
          {
            href: LAB_VARANASI_HOME,
            label: "Home sample collection — kaunse ilaake, kaunse slot",
          },
          {
            href: LAB_VARANASI_REPORTS,
            label: "Report kitne der me aur kahan aati hai",
          },
        ],
      },
      {
        title: "Doosre Guide",
        links: [
          {
            href: BLOG_LAB_VARANASI,
            label: "Kaun sa test kab karayein — poori guide",
            sub: "Shikayat, umar aur mausam ke hisaab se",
          },
          {
            href: BLOG_FULLBODY_VARANASI,
            label: "Full body checkup me kya hona chahiye",
            sub: "\"80+ parameters\" ka sach, aur kya chhod dena chahiye",
          },
          {
            href: BLOG_HOME_VARANASI,
            label: "Varanasi me ghar par blood test",
            sub: "Kis ilaake me aate hain, aur darwaze par kya hota hai",
          },
          {
            href: BLOG_DIABETES_VARANASI,
            label: "Varanasi me sugar, thyroid aur lipid test",
            sub: "Thyroid ka daam kis baat par tay hota hai",
          },
          {
            href: BLOG_DENGUE_VARANASI,
            label: "Varanasi me dengue aur typhoid test — kis din",
            sub: "Galat din ka test negative aata hai",
          },
          {
            href: BLOG_LIVER_KIDNEY_VARANASI,
            label: "Varanasi me LFT aur KFT — kab karayein",
          },
          {
            href: BLOG_LAB_DEORIA,
            label: "Deoria me kaun sa test kab karayein",
            sub: "Us jile ke liye alag guide",
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
            href: LAB_AZAMGARH,
            label: "Azamgarh me lab test",
            sub: "Mandal mukhyalaya — poore jile me home collection",
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
