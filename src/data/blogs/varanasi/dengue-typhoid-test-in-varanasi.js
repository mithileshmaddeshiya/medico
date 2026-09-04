/**
 * /blogs/dengue-typhoid-test/varanasi — "Varanasi Me Dengue Typhoid Test Kis Din"
 *
 * ── THE LANE ─────────────────────────────────────────────────────────────
 * Varanasi's set only survives together because each page answers a question
 * the others do not. This one owns FEVER, and inside fever it owns one thing
 * the others only mention in passing: THE DAY. Dengue NS1 in the first five
 * days, IgM after them, Widal not before day five — every one of those is a
 * timing rule, and a test done on the wrong day comes back negative in a
 * patient who has the disease. That is the single commonest reason treatment
 * in this city starts a week late, and it is not a lab failure.
 *
 * The parent guide at /blogs/lab-test/varanasi has ONE table row about fever
 * timing and links here. It must stay one row: two pages arguing the same
 * point in the same depth on one domain means Google picks one and drops the
 * other.
 *
 * ── WHY CBC LIVES HERE ───────────────────────────────────────────────────
 * "CBC blood test in Varanasi" is a strong query with no natural home. The
 * clinical guide names CBC in a symptom table; the package guide counts it as
 * one line of a panel. Neither explains what a platelet count actually means
 * during a fever — which is the question the whole city asks between July and
 * November, and the one that sends families to a hospital at 2 AM over a
 * number that was never dangerous. So CBC gets its own H2 here, in the context
 * where it matters most.
 *
 * ── CLAIMS ───────────────────────────────────────────────────────────────
 * Only the five the business confirms: free home collection, a trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI
 * on collection. No NABL, no "certified", no accuracy claim. Blood culture is
 * named as a test that takes 48-72 hours BECAUSE it must — a lab promising a
 * next-day culture report is promising something that cannot be done.
 *
 * ── CLINICAL CARE, AND WHY THIS PAGE IS THE MOST CAREFUL OF THE SET ──────
 * Fever is the one subject on this site where a reader can be genuinely
 * harmed by acting on a web page. So: no platelet number is named as safe or
 * unsafe, no treatment is suggested, and the warning callouts say plainly that
 * some situations need a doctor the same day rather than another test. The
 * clinical statements are the standard, uncontroversial ones — NS1 days 1-5,
 * IgM after day 5, Widal after day 5-7, culture in the first week, malaria
 * smear with chills. Nothing here diagnoses.
 *
 * ── NO PRICES ────────────────────────────────────────────────────────────
 * Not one rate. Sentences that would carry a number link to
 * #lab-test-price-varanasi instead.
 *
 * ── IMAGES: NONE ─────────────────────────────────────────────────────────
 * /public has no photography for this subject; og:image resolves to the
 * generated card at /blogs/dengue-typhoid-test/varanasi/og.
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
const LAB_VARANASI_FEVER = "/lab-test/varanasi#fever-dengue-typhoid-testing-varanasi";
const LAB_VARANASI_POPULAR = "/lab-test/varanasi#popular-blood-tests-varanasi";
const LAB_VARANASI_PRICE = "/lab-test/varanasi#lab-test-price-varanasi";
const LAB_VARANASI_REPORTS = "/lab-test/varanasi#reports-turnaround-time";
const LAB_VARANASI_BOOK = "/lab-test/varanasi#how-to-book-lab-test-varanasi";

const BLOG_LAB_VARANASI = "/blogs/lab-test/varanasi";
const BLOG_LAB_VARANASI_FEVER = "/blogs/lab-test/varanasi#bukhar-me-test-ka-din";
const BLOG_LAB_VARANASI_REPORT = "/blogs/lab-test/varanasi#report-kaise-padhein";
const BLOG_HOME_VARANASI = "/blogs/home-sample-collection/varanasi";
const BLOG_HOME_VARANASI_ILAKA =
  "/blogs/home-sample-collection/varanasi#varanasi-ilaake-home-collection";
const BLOG_DIABETES_VARANASI = "/blogs/diabetes-thyroid-test/varanasi";
const BLOG_LIVER_KIDNEY_VARANASI = "/blogs/liver-kidney-test/varanasi";
const BLOG_FULLBODY_VARANASI = "/blogs/full-body-checkup/varanasi";
const BLOG_PATHOLOGY_VARANASI = "/blogs/pathology-lab/varanasi";
const BLOG_DENGUE_DEORIA = "/blogs/dengue-typhoid-test/deoria";

const LAB_GHAZIPUR = "/lab-test/ghazipur";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const CONTACT = "/contact";

export const dengueTyphoidVaranasi = {
  category: "dengue-typhoid-test",
  city: "varanasi",

  /* 39 characters. The root layout appends " | MedicoBharat" (template in
     src/app/layout.js), so Google renders 54 — comfortably inside the ~60 it
     shows. "Kis din" is the whole argument of the page and it survives
     truncation. */
  title: "Varanasi Me Dengue Typhoid Test Kis Din",

  /* ~150 characters, renders whole on desktop and mobile. Hinglish, with the
     English terms that must match left intact: dengue, typhoid, NS1, Widal,
     platelet, CBC. */
  description:
    "Varanasi me bukhar ki jaanch — dengue NS1 kis din, Widal kab, malaria aur CBC kyun. Platelet count ka matlab aur ghar se sample lene ka tarika.",

  /* Ordered strongest first. Every term here appears in the visible copy; a
     keyword that lives ONLY in this array is the kind that gets a page
     filtered rather than ranked. */
  keywords: [
    "Dengue Typhoid Test in Varanasi",
    "Dengue Test in Varanasi",
    "Typhoid Test in Varanasi",
    "CBC Blood Test in Varanasi",
    "Platelet Count Test Varanasi",
    "NS1 Antigen Test Varanasi",
    "Widal Test in Varanasi",
    "Malaria Test in Varanasi",
    "Fever Panel Test Varanasi",
    "Bukhar Ki Jaanch Varanasi",
    "Blood Test in Varanasi",
    "Lab Test in Varanasi",
    "Pathology Lab in Varanasi",
    "Blood Test at Home Varanasi",
    "Free Home Sample Collection Varanasi",
  ],

  canonical: canonicalFor("dengue-typhoid-test", "varanasi"),
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
    "Bukhar me sabse badi galti test ki nahi, DIN ki hoti hai — galat din ka test negative aata hai.",
    "Dengue NS1 sirf pehle 1 se 5 din bharosemand hai; paanchve din ke baad IgM antibody.",
    "Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye — doosre din ka Widal lagbhag bekaar hai.",
    "Kisi bhi bukhar ke test ke saath CBC zaroor jodiye; platelet aur haematocrit doctor roz dekhta hai.",
  ],

  sections: [
    {
      id: "bukhar-ki-jaanch-varanasi",
      heading: "Varanasi Me Bukhar Ki Jaanch — Sabse Badi Galti Din Ki Hoti Hai",
      blocks: [
        "July se November tak Varanasi me viral fever, dengue aur typhoid ek saath badhte hain. Monsoon ke baad jal-bharav, purane wardon ki ghani basti, aur cooler tatha chhat ki tanki me jama paani — machhar ke liye isse behtar haalat nahi hoti. Aur is mausam me sabse zyada nuksaan test na karane se nahi hota; galat din par test karane se hota hai.",
        "Bukhar ke test antibody aur antigen par chalte hain, aur dono sharir me ek tay kram se aate hain. Dengue ka NS1 antigen shuruaat me milta hai aur baad me gaayab ho jaata hai. Typhoid ka Widal shuruaat me milta hi nahi, kyunki antibody banne me hi paanch-saat din lagte hain. Isliye doosre din ka Widal aur aathve din ka NS1 — dono \"negative\" report de sakte hain jabki beemari maujood ho. Report galat nahi hoti; din galat hota hai.",
        [
          "Neeche poora hisaab hai: bukhar ke kis din kaun sa test, CBC kyun har baar saath jaata hai, aur platelet ke number ka matlab kya hai. Bukhar ka poora panel aur rate service page par hai — ",
          {
            text: "Varanasi me dengue, typhoid, malaria aur jaundice ki jaanch",
            href: LAB_VARANASI_FEVER,
          },
          ".",
        ],
        {
          note: {
            title: "Kuch haalat me test se pehle doctor",
            text: "Lagatar ulti, pet me tez dard, saans phoolna, khoon aana (naak, mash-udhe ya ulti me), peshab bahut kam ho jaana, bahut susti ya behoshi jaisa lagna, ya bachche ka doodh chhod dena — in me se kuch bhi ho to report ka intezaar mat kijiye. Seedha doctor ke paas jaiye. Test tab bhi hoga, lekin pehla kadam wo nahi hai.",
            tone: "warn",
          },
        },
      ],
    },

    {
      id: "dengue-test-varanasi-ns1-igm",
      heading: "Dengue Test In Varanasi — NS1, IgM Aur IgG Teen Alag Cheezein Hain",
      lead: "Teenon ka naam \"dengue test\" hai, lekin teenon alag sawaal poochte hain.",
      blocks: [
        "NS1 antigen wo protein pakadta hai jo virus khud banata hai, isliye wo bukhar ki shuruaat me hi milta hai — pehle 1 se 5 din. Paanchve din ke baad NS1 aksar negative aa jaata hai, chahe dengue ho. IgM antibody sharir ka jawab hai, aur wo banne me lagbhag paanch din lagta hai — isliye IgM us waqt kaam aata hai jab NS1 ka samay nikal chuka ho. IgG purane infection ka nishan hai; akela IgG positive hone ka matlab aam taur par \"is baar ka bukhar\" nahi hota.",
        {
          table: {
            caption: "Dengue ke teen test — kis din kaunsa",
            head: ["Test", "Kab", "Kya batata hai"],
            rows: [
              [
                "NS1 Antigen",
                "Bukhar ke din 1 se 5",
                "Virus ka apna protein. Sabse jaldi pakadne wala test.",
              ],
              [
                "Dengue IgM",
                "Din 5 ke baad",
                "Sharir ka jawab. NS1 ka samay nikal jaane par yahi kaam aata hai.",
              ],
              [
                "Dengue IgG",
                "Doctor ke kehne par",
                "Purana infection. Akela IgG is baar ke bukhar ka jawab nahi deta.",
              ],
              [
                "CBC (saath me)",
                "Har din, jab doctor kahe",
                "Platelet aur haematocrit — jo roz monitor hota hai.",
              ],
            ],
          },
        },
        {
          note: {
            title: "NS1 negative ka matlab \"dengue nahi hai\" nahi hota",
            text: "Agar bukhar ko paanch din se zyada ho chuke hain to NS1 ka negative aana normal hai. Aise me doctor IgM likhta hai. Isi tarah pehle do din ka IgM negative aana bhi normal hai. Report ko din ke saath padhiye, akela mat padhiye.",
            tone: "info",
          },
        },
      ],
    },

    {
      id: "typhoid-test-varanasi-widal",
      heading: "Typhoid Test In Varanasi — Widal Ka Matlab Aur Uski Seema",
      blocks: [
        "Widal antibody ka titre naapta hai, aur antibody banne me hi paanch se saat din lag jaate hain. Isliye bukhar ke doosre din karaya gaya Widal lagbhag bekaar hota hai — wo negative aayega chahe typhoid ho. Doosri seema ye hai ki jahan typhoid pehle se failta rehta hai, wahan purane infection ki wajah se bhi Widal thoda positive aa sakta hai. Yahi wajah hai ki akela Widal dekh kar ilaaj shuru karna theek nahi maana jaata.",
        {
          list: [
            "Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye.",
            "Typhidot IgM Widal se thoda jaldi positive hota hai, isliye doctor kabhi-kabhi wahi likhte hain.",
            "Pehle hafte me blood culture aaj bhi sabse pakka jawab deta hai — lekin uski report 48 se 72 ghante me aati hai, kyunki bacteria ko badhne ka samay dena padta hai.",
            "Antibiotic shuru hone ke baad blood culture ka faayda kaafi kam ho jaata hai. Isliye culture karana hai to dawa se pehle sample dena behtar hai — ye doctor hi tay karega.",
            "Widal ke saath CBC bhi dekha jaata hai; typhoid me WBC ka pattern apne aap me ek ishaara hota hai.",
          ],
        },
        [
          "Bukhar ka poora panel — dengue, Widal, malaria, Typhidot aur jaundice ke test — ek saath ",
          { text: "service page par", href: LAB_VARANASI_FEVER },
          " hai. Culture ki report me zyada samay kyun lagta hai, wo ",
          { text: "report ke samay wale hisse", href: LAB_VARANASI_REPORTS },
          " me likha hai.",
        ],
      ],
    },

    {
      id: "malaria-aur-baaki-wajah",
      heading: "Malaria Aur Baaki Wajah — Bukhar Sirf Do Naam Nahi Hai",
      blocks: [
        "Varanasi me bukhar ka matlab har baar dengue ya typhoid nahi hota. Thand aur kanpkanpi ke saath aane wale bukhar me malaria antigen aur peripheral smear zaroor jodne chahiye. Aur is sheher ka ek alag pattern jaundice ka hai: paani se failne wale Hepatitis A aur E garmi me aur monsoon ke baad badh jaate hain, khaas kar wahan jahan peene ka paani aur sewage line paas-paas chalti hain.",
        {
          table: {
            caption: "Bukhar ke saath kya-kya dikh raha hai — pehla test",
            head: ["Saath me kya hai", "Pehla test"],
            rows: [
              ["Thand lagkar kanpkanpi ke saath bukhar", "Malaria antigen aur peripheral smear"],
              ["Aankhon ka peelapan, gehra peshab, ulti jaisa lagna", "LFT (bilirubin ke saath), Hepatitis A IgM, Hepatitis E IgM"],
              ["Peshab me jalan ya baar-baar peshab", "Urine routine aur urine culture"],
              ["Khaansi aur gale ka dard, mausam badalne par", "CBC, aur doctor ke kehne par CRP"],
              ["Bukhar 5 din se zyada, koi saaf wajah nahi", "CBC ke saath dengue IgM aur Widal — dono"],
            ],
          },
        },
        {
          note: {
            title: "Pregnancy me jaundice — turant doctor",
            text: "Pregnancy ke dauran aankhon ka peelapan ya gehra peshab dikhe to intezaar mat kijiye. Hepatitis E garbhawastha me kahin zyada khatarnak hota hai, aur ye wo ek haalat hai jahan test se pehle doctor zaroori hai.",
            tone: "warn",
          },
        },
      ],
    },

    {
      id: "cbc-blood-test-varanasi-platelet",
      heading: "CBC Blood Test In Varanasi — Platelet Ka Number Sabse Zyada Ghabrahat Deta Hai",
      lead: "CBC bukhar ka sabse zaroori test hai, aur uska sabse galat samjha jaane wala hissa platelet count hai.",
      blocks: [
        "CBC — Complete Blood Count — Varanasi ka sabse zyada karaya jaane wala test hai. Ismein haemoglobin, RBC, WBC aur platelet count aate hain. Bukhar me iska mahatva ye hai ki doctor beemari ki disha isi se pakadta hai: WBC ka pattern viral aur bacterial me alag hota hai, aur platelet tatha haematocrit ka rozana ka rukh hi dengue me sabse zyada dekha jaane wala sanket hai.",
        "Ghar walon ki ghabrahat lagbhag hamesha ek hi number par hoti hai — platelet. Yahan do baatein saaf samajh leni chahiye. Pehli: platelet ka ek din ka number utna nahi batata jitna do din ka rukh batata hai; isliye doctor use dohrata hai. Doosri: faisla akele platelet par nahi hota — mareez kaisa dikh raha hai, kahin se khoon to nahi aa raha, peshab ho raha hai ya nahi, ye sab uske saath dekha jaata hai.",
        {
          list: [
            "CBC me fasting nahi lagti — kisi bhi samay ho sakta hai.",
            "Bukhar me CBC aksar rozana ya ek din chhod kar dohraya jaata hai; ye normal hai, ismein kuch galat nahi hua hai.",
            "Har baar ek hi lab me karayein — rozana ka rukh tabhi tulna karne layak rehta hai.",
            "Purani report saath rakhiye. Doctor ko ek number se zyada do number ka farq kaam aata hai.",
            "Report me \"Low\" ki chhap apne aap me khatra nahi hai; kis number par kya karna hai, ye doctor tay karega.",
          ],
        },
        {
          note: {
            title: "Platelet par khud faisla mat kijiye",
            text: "Is page par jaan-boojh kar koi platelet ka number nahi likha gaya. Kaunsi value par kya karna hai ye mareez ki haalat dekh kar doctor tay karta hai, internet nahi. Lekin khoon aana, tez pet dard, lagatar ulti, saans phoolna ya bahut susti — in me se kuch bhi ho to number ka intezaar kiye bina doctor ke paas jaiye.",
            tone: "warn",
          },
        },
      ],
    },

    {
      id: "ek-nazar-me-bukhar-ka-din",
      heading: "Ek Nazar Me — Bukhar Ke Kis Din Kaun Sa Test",
      lead: "Poore page ka jawab ek table me.",
      blocks: [
        {
          table: {
            caption: "Bukhar ka din aur uska test",
            head: ["Bukhar ka din", "Kaun sa test", "Kyun"],
            rows: [
              [
                "Din 1-2",
                "CBC, malaria antigen (agar thand-kanpkanpi ho)",
                "Abhi antibody bane hi nahi hain. NS1 ho sakta hai, lekin dengue ka shak ho tabhi.",
              ],
              [
                "Din 1-5",
                "Dengue NS1 + CBC",
                "NS1 ka sahi samay yahi hai. CBC baseline deta hai.",
              ],
              [
                "Din 5-7",
                "Dengue IgM + Widal + CBC",
                "NS1 ka samay nikal gaya; ab antibody wale test kaam ke hain.",
              ],
              [
                "Din 7 ke baad, bukhar bana hua hai",
                "Dengue IgM, Widal, LFT, urine routine — doctor ke hisaab se",
                "Ab wajah dhoondhne ka daayra badhta hai.",
              ],
              [
                "Kabhi bhi, agar peelapan dikhe",
                "LFT, Hepatitis A IgM, Hepatitis E IgM",
                "Varanasi me paani se failne wala jaundice aam hai.",
              ],
            ],
          },
        },
        [
          "Yahi table symptom aur umar ke hisaab se poori guide me bhi ek row rakhti hai — ",
          { text: "Varanasi me kaun sa test kab", href: BLOG_LAB_VARANASI_FEVER },
          ". Report aane ke baad usme kya dekhna hai, wo ",
          { text: "report wale hisse", href: BLOG_LAB_VARANASI_REPORT },
          " me hai.",
        ],
      ],
    },

    {
      id: "barsaat-ke-baad-varanasi",
      heading: "Barsaat Ke Baad Ka Varanasi — Jab Ek Ghar Me Teen Log Beemar Padte Hain",
      blocks: [
        "Is mausam me sabse aam drishya ek hi hota hai: ghar me pehle ek ko bukhar aata hai, phir do din baad doosre ko. Dengue ek se doosre me nahi failta — machhar se failta hai, aur machhar ghar me ek hi hote hain. Isliye ek ghar me kai log beemar padna dengue me bilkul aam hai, aur wo baat khud ek sanket hai.",
        {
          list: [
            "Ghar me ek ko dengue nikla hai to baaki ko bukhar aane par usi din ke hisaab se test kijiye — unke din alag hain, isliye unka test bhi alag ho sakta hai.",
            "Ghar ke kai log ek saath test kara rahe hain to sabka sample ek hi slot me book kijiye. Ek visit, ek trip.",
            "Cooler, gamla, chhat ki tanki aur purane tyre ka paani hafte me ek baar badal dijiye — machhar wahin paida hote hain.",
            "Bukhar ke mareez ko paani aur ORS dete rahiye. Paani ki kami se haematocrit jhootha badha hua dikhta hai aur nas milna bhi mushkil hota hai.",
            "Apne aap antibiotic mat shuru kijiye. Antibiotic ke baad blood culture ka faayda kaafi kam ho jaata hai.",
          ],
        },
        [
          "Bukhar me lab tak jaana sabse mushkil kaam hota hai, isliye is mausam me home collection sabse zyada isi wajah se book hoti hai. Kis ilaake me aate hain, wo ",
          { text: "yahan dekh lijiye", href: BLOG_HOME_VARANASI_ILAKA },
          ".",
        ],
      ],
    },

    {
      id: "bukhar-me-ghar-se-sample",
      heading: "Bukhar Me Ghar Se Sample — Kya Dhyaan Rakhein",
      blocks: [
        "Bukhar ke saare aam test — CBC, NS1, IgM, Widal, malaria, LFT, urine routine — sample par hote hain, isliye ghar par ho jaate hain. Bukhar wale mareez ko lab tak le jaane ka koi faayda nahi hota, aur bheed me le jaane ka nuksaan hi hota hai.",
        {
          list: [
            "Bukhar ke test me fasting nahi lagti — jab doctor kahe, tab sample de dijiye.",
            "Bukhar kis din se hai, ye booking me likh dijiye. Poore page ka faisla isi ek jaankari par tikta hai.",
            "Mareez ko sample se pehle paani pilate rahiye. Paani ki kami me nas milna mushkil ho jaata hai.",
            "Doctor rozana CBC dohrane ko kahe to slot ek hi samay ka rakhiye — ek hi waqt ke number aapas me tulna karne layak hote hain.",
            "Report 24 ghante ke andar phone par PDF me aa jaati hai. Culture wale test me 48 se 72 ghante lagte hain.",
          ],
        },
        [
          "Darwaze par kya hota hai aur bujurg ya bachche ke sample me kya alag hota hai — wo poori prakriya ",
          { text: "home collection wali guide", href: BLOG_HOME_VARANASI },
          " me hai.",
        ],
      ],
    },

    {
      id: "aage-kya-karein-bukhar",
      heading: "Chhoti Si Checklist",
      blocks: [
        {
          list: [
            "Sabse pehle din giniye — bukhar kis din se hai. Test uske hisaab se chuna jaata hai.",
            "NS1 pehle 5 din, IgM 5ve din ke baad, Widal 5 se 7 din ke baad.",
            "Kisi bhi bukhar ke test ke saath CBC zaroor jodiye.",
            "Thand-kanpkanpi ho to malaria antigen aur smear bhi.",
            "Peelapan dikhe to LFT ke saath Hepatitis A aur E IgM.",
            "Rozana CBC ho raha hai to ek hi lab, ek hi samay.",
            "Khoon aana, tez pet dard, lagatar ulti, saans phoolna ya bahut susti — report ka intezaar nahi, seedha doctor.",
          ],
        },
        [
          "Kaunsa test chuna jaaye ismein confusion ho to ",
          { text: "humein call kar lijiye", href: CONTACT },
          "; parche aur bukhar ke din ke hisaab se sahi panel batana isi kaam ka hissa hai.",
        ],
      ],
    },
  ],

  /* Questions a Varanasi reader actually types during fever season, and
     deliberately NOT the ones already answered on the service page or in the
     parent guide. Two FAQ blocks answering the same question on one domain
     compete with each other for the same rich result. */
  faqs: [
    {
      question: "Varanasi me dengue ka test bukhar ke kis din karana chahiye?",
      answer:
        "Dengue NS1 antigen sirf bukhar ke pehle 1 se 5 din me bharosemand hai. Paanchve din ke baad NS1 aksar negative aa jaata hai chahe dengue ho, aur tab Dengue IgM antibody karana chahiye. Dono me se koi bhi test ho, saath me CBC zaroor karayein — platelet count aur haematocrit hi wo cheez hai jo doctor roz monitor karta hai.",
    },
    {
      question: "Widal test kitne din ke bukhar ke baad karana chahiye?",
      answer:
        "Kam se kam 5 se 7 din ke bukhar ke baad. Widal antibody ka titre naapta hai aur antibody banne me hi itna samay lag jaata hai, isliye doosre din ka Widal lagbhag bekaar hota hai. Jahan typhoid pehle se failta rehta hai wahan purane infection se bhi Widal thoda positive aa sakta hai — isliye akele Widal par ilaaj shuru karna theek nahi maana jaata. Pehle hafte me blood culture sabse pakka jawab deta hai.",
    },
    {
      question: "NS1 negative aaya hai — kya iska matlab dengue nahi hai?",
      answer:
        "Zaroori nahi. Agar bukhar ko paanch din se zyada ho chuke hain to NS1 ka negative aana bilkul normal hai, kyunki us waqt tak antigen kam ho chuka hota hai. Aise me doctor Dengue IgM likhta hai. Isi tarah pehle do din ka IgM negative aana bhi normal hai. Bukhar ke test ki report hamesha bukhar ke din ke saath padhi jaati hai, akeli nahi.",
    },
    {
      question: "Platelet count kitna hone par ghabrana chahiye?",
      answer:
        "Is page par jaan-boojh kar koi number nahi likha gaya, kyunki faisla akele platelet par nahi hota — mareez ki haalat, khoon aana ya na aana, peshab ka hona, aur do din ka rukh sab saath me dekha jaata hai. Ye faisla doctor ka hai. Lekin khoon aana, tez pet dard, lagatar ulti, saans phoolna, peshab bahut kam ho jaana ya bahut susti — in me se kuch bhi ho to report ka intezaar kiye bina doctor ke paas jaiye.",
    },
    {
      question: "Bukhar me CBC roz karana zaroori hai kya?",
      answer:
        "Doctor kahe to haan. Dengue me platelet aur haematocrit ka rozana ka rukh hi sabse zyada dekha jaane wala sanket hai, aur ek din ka number utna nahi batata jitna do din ka farq. Rozana test ho raha ho to do baatein rakhiye — ek hi lab, aur ho sake to ek hi samay ka slot. Alag lab aur alag samay ke number aapas me theek se tulna nahi karte.",
    },
    {
      question: "Bukhar ke test me fasting karni padti hai?",
      answer:
        "Nahi. Dengue NS1, IgM, Widal, malaria antigen, Typhidot aur CBC — in me se kisi me fasting nahi lagti. Jab doctor kahe tab sample diya ja sakta hai. Bukhar ke mareez ko paani aur ORS dete rahiye: paani ki kami se haematocrit jhootha badha hua dikhta hai aur nas milna bhi mushkil ho jaata hai.",
    },
    {
      question: "Ek ghar me teen logon ko bukhar hai — sabka test ek saath ho sakta hai?",
      answer:
        "Haan, aur sabka sample ek hi slot me book kar lena hi behtar hai — ek visit me kaam ho jaata hai. Dhyan sirf itna rakhiye ki har vyakti ka bukhar kis din se hai wo alag-alag likhiye, kyunki test ka chunaav usi din par tikta hai. Ek ghar me kai log beemar padna dengue me aam hai — wo ek se doosre me nahi failta, machhar se failta hai, aur machhar ghar me ek hi hote hain.",
    },
    {
      question: "Blood culture ki report agle din kyun nahi milti?",
      answer:
        "Kyunki usme bacteria ko badhne ka samay dena padta hai — ye test ka hi hissa hai, deri nahi. Culture ki report aam taur par 48 se 72 ghante me aati hai, jabki routine test ki report 24 ghante ke andar aa jaati hai. Jo lab culture ki report agle din dene ka vaada kare, wo aisi cheez ka vaada kar rahi hai jo ho hi nahi sakti.",
    },
    {
      question: "Bukhar me ghar se sample lena theek rehta hai?",
      answer:
        "Haan, aur is mausam me sabse zyada booking isi wajah se hoti hai. Bukhar ke saare aam test — CBC, NS1, IgM, Widal, malaria, LFT, urine routine — sample par hote hain, isliye ghar par ho jaate hain. Bukhar wale mareez ko bheed wali jagah le jaane ka koi faayda nahi. Booking me bukhar kis din se hai ye zaroor likhiye, aur report 24 ghante ke andar phone par PDF me aa jaati hai.",
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
      "Is guide me bukhar ka din aur uska test hai. Booking, poora fever panel aur rate service page par hain.",
    groups: [
      {
        title: "Varanasi Lab Test",
        links: [
          {
            href: LAB_VARANASI_FEVER,
            label: "Varanasi me dengue, typhoid aur jaundice ka panel",
            sub: "Service page ka fever wala hissa",
          },
          {
            href: LAB_VARANASI_POPULAR,
            label: "Varanasi me sabse zyada karaye jaane wale test",
            sub: "CBC sabse upar — aur wo batata kya hai",
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
            href: BLOG_HOME_VARANASI,
            label: "Varanasi me ghar par blood test",
            sub: "Bukhar me lab tak jaane se bachne ka tarika",
          },
          {
            href: BLOG_LIVER_KIDNEY_VARANASI,
            label: "Varanasi me LFT aur KFT — kab karayein",
            sub: "Peelapan dikhe to pehla test LFT hai",
          },
          {
            href: BLOG_DIABETES_VARANASI,
            label: "Varanasi me sugar, thyroid aur lipid test",
          },
          {
            href: BLOG_FULLBODY_VARANASI,
            label: "Varanasi me full body checkup — kya karayein",
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
            href: BLOG_DENGUE_DEORIA,
            label: "Deoria me dengue aur typhoid test",
            sub: "Wahi guide, Deoria ke liye",
          },
          {
            href: LAB_GHAZIPUR,
            label: "Ghazipur me lab test",
            sub: "Kareeb 80 km — Ganga kinare ka padosi jila",
          },
          {
            href: LAB_GORAKHPUR,
            label: "Gorakhpur me lab test",
            sub: "Purvanchal ka referral hub",
          },
          { href: CONTACT, label: "Contact — booking aur test chunne me madad" },
        ],
      },
    ],
  },
};
