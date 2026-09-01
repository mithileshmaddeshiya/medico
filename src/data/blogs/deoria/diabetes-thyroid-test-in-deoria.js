/**
 * /blogs/diabetes-thyroid-test/deoria — the metabolic panel guide.
 *
 * ── WHY THIS POST EXISTS, AND WHY IT IS NOT EITHER SIBLING ───────────────
 * Deoria already has two articles and a service page, and each owns a lane:
 *
 *   /lab-test/deoria             the SERVICE — booking, coverage, the rates
 *   /blogs/lab-test/deoria       "kaun sa test kab" — the clinical guide
 *   /blogs/pathology-lab/deoria  "sample dene kahan jaana padega" — locality
 *
 * Sugar, thyroid and lipid were the one high-intent cluster with no home of
 * its own: the clinical guide gives all three a single shared section
 * (`sugar-thyroid-aur-kamzori`), which answers "kya ye karana chahiye" and
 * stops there. The questions people actually ask next — fasting sugar ya PP ya
 * HbA1c, TSH akela ya poora profile, lipid me fasting kitni der, aur ye sab
 * dobara kab — had nowhere to be answered.
 *
 * So this post is the FOLLOW-UP lane, not a second clinical guide. Its spine
 * is: which of these tests, in which form, how often, and how to read the
 * repeat. Every place it would restate the clinical guide it LINKS instead.
 *
 * ⚠ MEASURE THE NEXT ONE. The Gorakhpur file's rule applies to blogs too (see
 * the header of src/data/lab/content/gorakhpur.js): a fourth Deoria post that
 * shares five-word shingles with these three at more than about 20% is a
 * doorway page, however true every sentence in it is.
 *
 * ── NO PRICES, SAME AS THE SIBLINGS ──────────────────────────────────────
 * Not one rate is stated, and that is a hard rule on this domain rather than a
 * preference: the numbers live in defaultTests() and in
 * /lab-test/deoria#lab-test-price-deoria, and a rate repeated in a fourth file
 * is a rate that will eventually disagree with itself.
 *
 * This matters here because "thyroid test price in Deoria" is one of the
 * queries this post is written for. It is answered the honest way — by
 * explaining what actually decides that price (TSH alone versus the full T3,
 * T4 and TSH profile, and whether collection is charged on top) and then
 * linking to the one page that carries the number. A reader who wants the
 * figure is one click away; a reader who wanted to understand the bill got
 * something better.
 *
 * ── CLAIMS ───────────────────────────────────────────────────────────────
 * Only the five the business confirms: free home collection, a trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI
 * on collection. NOT claimed: NABL accreditation, pathologist verification,
 * "certified" anything, same-day reports, 24-hour opening, or any comparative
 * price claim. Those were removed from this project once already — see the
 * warning above defaultFaqs in src/data/lab/defaults.js — and a blog is not a
 * loophole for putting them back.
 *
 * ⚠ THIS IS A TESTING GUIDE, NOT A TREATMENT GUIDE. It says which test, in
 * what form, and how often. It never names a drug, a dose, a target number to
 * aim for, or a diet. Every place a reader might act on a result, the sentence
 * ends at the doctor. Diabetes and thyroid are exactly the two conditions
 * where people self-adjust medication off an internet page, so this line is
 * held throughout and in every FAQ.
 *
 * ── NOT COVERED HERE, DELIBERATELY ───────────────────────────────────────
 * Pharmacy. The brief this post was drafted from carried "online medicine
 * delivery in Deoria", "pharmacy near me Deoria", "medical store home delivery
 * Deoria", "emergency medicine delivery Deoria" and "24 hours medical store in
 * Deoria". None of them are here, in the copy or the keywords, and the reason
 * is the same one recorded in pathology-lab-in-deoria.js: MedicoBharat retired
 * the medicine section, /medicine-delivery/* and the three Deoria medicine
 * guides are 308-redirected (MEDICINE_BLOG_REDIRECTS in next.config.mjs), and
 * a pharmacy blog would advertise a service that cannot be fulfilled while
 * re-pointing the site's topical signal at the exact thing those redirects
 * exist to move it away from. Confirmed again with the user on 2026-09-01.
 *
 * Imaging, for the same kind of reason. "CT scan / ultrasound centre in
 * Deoria" was on the brief with the author's own "agar partner labs hain"
 * attached to it. There are none, so the post says plainly that these are done
 * on a machine at a centre and are not ours to offer.
 *
 * ── IMAGES: NONE ─────────────────────────────────────────────────────────
 * /public has no Deoria photography and `src` must name a file that really
 * exists there. og:image resolves to the generated card at
 * /blogs/diabetes-thyroid-test/deoria/og, drawn from the title.
 */
import {
  BLOG_AUTHOR,
  BLOG_PUBLISHER,
  INDEXABLE,
  canonicalFor,
} from "../shared";

/* Link targets as constants — a route rename is one line here instead of a hunt
   through the prose, and a typo surfaces as `undefined` in the href rather than
   as a silent 404. Section ids come from src/data/lab/content/deoria.js and
   from the sibling posts; rename one there and these anchors break silently. */
const LAB_DEORIA = "/lab-test/deoria";
const LAB_DEORIA_DIABETES = "/lab-test/deoria#diabetes-thyroid-screening-deoria";
const LAB_DEORIA_FULLBODY = "/lab-test/deoria#full-body-checkup-deoria";
const LAB_DEORIA_PRICE = "/lab-test/deoria#lab-test-price-deoria";
const LAB_DEORIA_PREPARE = "/lab-test/deoria#prepare-for-test-deoria";
const LAB_DEORIA_REPORTS = "/lab-test/deoria#reports-deoria";
const LAB_DEORIA_BOOK = "/lab-test/deoria#how-to-book-deoria";
const LAB_DEORIA_HOME = "/lab-test/deoria#home-sample-collection-deoria";
const LAB_DEORIA_ANAEMIA = "/lab-test/deoria#anaemia-women-children-deoria";

const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_SALEMPUR = "/lab-test/salempur";
const LAB_KUSHINAGAR = "/lab-test/kushinagar";

const BLOG_LAB_DEORIA = "/blogs/lab-test/deoria";
const BLOG_LAB_DEORIA_SUGAR = "/blogs/lab-test/deoria#sugar-thyroid-aur-kamzori";
const BLOG_LAB_DEORIA_UMAR = "/blogs/lab-test/deoria#kis-umar-me-kaun-sa-checkup";
const BLOG_LAB_DEORIA_PREP = "/blogs/lab-test/deoria#test-se-pehle-taiyari-deoria";
const BLOG_LAB_DEORIA_REPORT = "/blogs/lab-test/deoria#report-me-kya-dekhein-deoria";
const BLOG_LAB_DEORIA_GKP = "/blogs/lab-test/deoria#gorakhpur-jaane-se-pehle";
const BLOG_LAB_DEORIA_LAB = "/blogs/lab-test/deoria#bharosemand-lab-kaise-chunein-deoria";

const BLOG_PATHOLOGY_DEORIA = "/blogs/pathology-lab/deoria";
const BLOG_PATHOLOGY_DEORIA_HOME = "/blogs/pathology-lab/deoria#ghar-se-kaunsi-jaanch";
const BLOG_PATHOLOGY_DEORIA_PATA = "/blogs/pathology-lab/deoria#pata-landmark-deoria";
const BLOG_PATHOLOGY_DEORIA_ONELAB = "/blogs/pathology-lab/deoria#report-aur-ek-hi-lab-deoria";

const BLOG_FULLBODY_DEORIA = "/blogs/full-body-checkup/deoria";
const BLOG_FULLBODY_VARANASI = "/blogs/full-body-checkup/varanasi";

const CONTACT = "/contact";

export const diabetesThyroidDeoria = {
  category: "diabetes-thyroid-test",
  city: "deoria",

  /* 44 characters. The root layout appends " | MedicoBharat", so Google renders
     59 — just inside the ~60 it will show. All three test names are in it
     because all three are separate queries, and none of them survives being
     pushed into the description alone. */
  title: "Deoria Me Sugar, Thyroid Aur Lipid Ki Jaanch",

  /* ~152 characters, so it renders whole on desktop and on a phone. Hinglish,
     because the page and the searcher both are, with the English terms that
     must match left intact: HbA1c, TSH, lipid profile. */
  description:
    "Deoria me sugar, thyroid aur lipid profile test — fasting kis me chahiye, HbA1c aur TSH dobara kab karayein, aur ghar se sample kaise diya jaata hai.",

  /* Ordered strongest first, and this array is the checklist the headings,
     tables and FAQs were written against — every term here appears in the
     visible copy. What is NOT here: any pharmacy term from the brief, any
     imaging term, and any price adjective. See the header. */
  keywords: [
    "Diabetes Test Lab Deoria",
    "Thyroid Test Price in Deoria",
    "Lipid Profile Test Deoria",
    "Sugar Test in Deoria",
    "HbA1c Test in Deoria",
    "TSH Test in Deoria",
    "Thyroid Test in Deoria",
    "Blood Sugar Test at Home Deoria",
    "Fasting Blood Sugar Test Deoria",
    "Cholesterol Test in Deoria",
    "Diabetes Checkup Deoria",
    "Thyroid Profile T3 T4 TSH Deoria",
    "Blood Test at Home in Deoria",
    "Blood Sample Collection at Home Deoria",
    "Lab Test in Deoria",
  ],

  canonical: canonicalFor("diabetes-thyroid-test", "deoria"),
  robots: INDEXABLE,
  author: BLOG_AUTHOR,
  publisher: BLOG_PUBLISHER,

  publishedAt: "2026-09-01",
  updatedAt: "2026-09-01",

  /* Stated rather than computed: a number that changes every time a sentence is
     edited is a number nobody maintains. Update it when the article grows a
     section. */
  readingMinutes: 9,

  /** The skimmer's version of the whole article. */
  takeaways: [
    "Sugar, thyroid aur lipid — teenon bina lakshan ke badalte hain, isliye inhe shikayat par nahi, tay samay par jaancha jaata hai.",
    "Fasting sirf teen jagah chahiye: fasting sugar, lipid profile aur full body package. HbA1c aur TSH me fasting bilkul nahi lagti — ye din me kabhi bhi ho sakte hain.",
    "Follow-up hi asli kaam hai. Dawa shuru ho chuki ho to HbA1c har teen mahine aur TSH doctor ke kahe anusar — yahi wo jaanch hai jo sabse zyada chhoot jaati hai.",
    "Thyroid ka daam is baat par tay hota hai ki TSH akela ho raha hai ya poora T3-T4-TSH profile — dono alag test hain, aur doctor ka parcha hi ye tay karta hai.",
    "Report ka matlab doctor nikaalta hai. Number dekh kar dawa apne aap shuru ya band karna is do bimari me sabse aam aur sabse mehngi galti hai.",
  ],

  sections: [
    {
      id: "teen-jaanch-jo-chup-chaap-badalti-hain",
      heading: "Sugar, Thyroid Aur Lipid — Teen Jaanch Jo Bina Bataye Badalti Hain",
      lead: "Inka intezaar lakshan ka nahi kiya jaata, kyunki lakshan aane tak der ho chuki hoti hai.",
      blocks: [
        "Deoria me sabse zyada jo teen jaanch karayi jaati hain wo yahi hain — blood sugar, thyroid aur lipid profile. Aur teenon me ek baat common hai jo inhe baaki test se alag karti hai: ye apne aap kuch nahi bataatin. Bukhar ho to pata chal jaata hai, chot lage to dikh jaata hai — lekin sugar dheere badhta hai, thyroid dheere badalta hai aur cholesterol to kabhi kuch kehta hi nahi.",
        "Jab tak lakshan saamne aate hain — bahut pyaas lagna, baar baar peshaab, wazan ka bina wajah girna ya badhna, hamesha ki thakan, baal jhadna, thand zyada lagna — tab tak mahine ya saal nikal chuke hote hain. Isi liye in teenon ko shikayat par nahi, umar aur ghar ke itihaas par jaancha jaata hai.",
        {
          note: {
            title: "Is guide me kya hai aur kya nahi",
            text: "Yahan ye likha hai ki kaun sa test kis roop me karana chahiye, usmein fasting lagti hai ya nahi, aur use dobara kab dohraana hota hai. Yahan ye nahi likha ki kaun si dawa leni hai, kitni leni hai, ya kis number ko kahan tak laana hai — wo faisla aapke doctor ka hai aur sirf uska hai. Ye jaanch ki guide hai, ilaaj ki nahi.",
            tone: "warn",
          },
        },
        [
          "Ye teenon kis umar me shuru karne chahiye aur kis ke saath, ispar clinical guide me alag se likha hai — ",
          { text: "umar ke hisaab se kaun sa checkup", href: BLOG_LAB_DEORIA_UMAR },
          ". Ye guide uske aage ka hissa hai: form, fasting aur follow-up.",
        ],
      ],
    },

    {
      id: "sugar-test-kaunsa-form-deoria",
      heading: "Deoria Me Sugar Test — Fasting, PP Ya HbA1c? Teenon Ek Cheez Nahi Hain",
      lead: "Sabse zyada uljhan yahin hoti hai, aur usi se galat test book ho jaata hai.",
      blocks: [
        "\"Sugar ki jaanch\" ek naam hai, lekin uske teen alag roop hain, aur teenon alag sawaal ka jawab dete hain. Booking se pehle ye samajh lena poora chakkar bacha deta hai.",
        {
          table: {
            caption: "Sugar ki teen jaanch — kis ka kya matlab hai",
            head: ["Jaanch", "Kya batati hai", "Fasting", "Kab kaam ki hai"],
            rows: [
              [
                "Fasting Blood Sugar (FBS)",
                "Khaali pet ka sugar level — us ek subah ka",
                "Haan, 10-12 ghante",
                "Pehli baar screening, aur saal me ek baar",
              ],
              [
                "Post Prandial (PP)",
                "Khaane ke theek 2 ghante baad ka level",
                "Nahi, par naashte ka waqt note karna zaroori",
                "Jab doctor fasting ke saath likhe",
              ],
              [
                "HbA1c",
                "Pichhle lagbhag 3 mahine ka ausat",
                "Bilkul nahi",
                "Follow-up ke liye — ek din ke khaane se nahi badalta",
              ],
            ],
          },
        },
        "Sabse kaam ka farak yahi aakhri hai. Fasting sugar ek subah ki tasveer hai — us din raat ko der se khaya, neend poori nahi hui, ya bimari chal rahi hai to number hil jaata hai. HbA1c teen mahine ka ausat hai, isliye use \"aaj sambhal kar\" nahi badla ja sakta. Yahi wajah hai ki dawa par chal rahe logon ka asli follow-up HbA1c se hota hai, fasting sugar se nahi.",
        {
          note: {
            title: "Fasting aur PP dono likhe hain? Do sample lagenge",
            text: "Fasting sample khaali pet liya jaata hai aur PP sample naashte ke theek 2 ghante baad — ye do alag sample hain aur ek hi visit me nahi ho sakte. Subah ka pehla slot lijiye, fasting sample dijiye, turant naashta kar lijiye, aur do ghante baad doosra. Booking ke waqt ye bata dena zaroori hai ki dono chahiye, taaki dono ka waqt saath me tay ho jaaye.",
            tone: "info",
          },
        },
        [
          "Deoria me fasting wale sample ke liye subah 6 baje se slot rakhe gaye hain, taaki aap sample dekar turant naashta kar sakein — ",
          { text: "ghar se sample kaise liya jaata hai", href: LAB_DEORIA_HOME },
          " wo service page par likha hai.",
        ],
      ],
    },

    {
      id: "hba1c-follow-up-deoria",
      heading: "Diabetes Test Lab Deoria — Asli Kaam Pehli Jaanch Nahi, Follow-Up Hai",
      lead: "Jile me sabse zyada chhootne wali jaanch yahi hai, aur sabse saste me ho jaati hai.",
      blocks: [
        "Deoria me sugar ki pehli jaanch aksar ho jaati hai. Jo nahi hota wo uske baad ka hissa hai. Bahut se log dawa Gorakhpur, Lucknow ya Delhi me shuru karwate hain, parcha lekar ghar aa jaate hain, aur phir saalon wahi dose chalati rehti hai — bina ek baar bhi dobara jaanche.",
        "Wajah bimari nahi, doori hai. Dawa likhne wala doctor doosre sheher me baitha hai, aur uske paas dobara jaane ka matlab poora din aur kiraya hai. Us safar ke bina jaanch nahi hoti, aur jaanch ke bina safar bekaar jaata hai — isi chakkar me follow-up chhoot jaata hai.",
        "Ise todne ka tareeka seedha hai: jaanch ghar par karwa lijiye aur report saath le kar jaaiye. HbA1c me fasting nahi lagti, isliye use kisi bhi din, kisi bhi waqt karwaya ja sakta hai. Doctor ko dikhane wale din report pehle se haath me ho, to pehli hi baithak me baat aage badhti hai.",
        {
          list: [
            "HbA1c — aam taur par har teen mahine, jab tak doctor kuch aur na kahe.",
            "Kidney Function Test aur Lipid Profile — saal me ek baar, kyunki sugar ka asar sabse pehle chup-chaap gurde aur charbi par dikhta hai.",
            "Urine routine — jab doctor likhe; ye bhi ghar se liye sample par ho jaata hai.",
            "Aankh aur pair ki jaanch lab me nahi hoti — uske liye doctor ko dikhana hi padta hai, aur wo isi ke saath chalta hai.",
          ],
        },
        [
          "Gorakhpur dikhane ja rahe hain to ek din pehle sample de dena sabse zyada kaam ka rehta hai — ",
          { text: "us din ki taiyaari alag se likhi hai", href: BLOG_LAB_DEORIA_GKP },
          ". Aur agar ilaaj wahin chal raha hai to ",
          { text: "Gorakhpur me lab test", href: LAB_GORAKHPUR },
          " ka page bhi hai.",
        ],
        {
          note: {
            title: "Number dekh kar dawa mat badaliye",
            text: "HbA1c ya sugar ka number theek aa gaya iska matlab ye nahi ki dawa band karni hai, aur badha hua number aane par apne aap dose badha lena usse bhi zyada khatarnak hai. Report ka kaam sirf doctor ko sahi tasveer dena hai. Ye is guide ki sabse zaroori line hai.",
            tone: "warn",
          },
        },
      ],
    },

    {
      id: "thyroid-test-price-deoria",
      heading: "Thyroid Test Price In Deoria — Daam Kis Baat Par Tay Hota Hai",
      lead: "\"Thyroid test\" ke naam se do alag jaanch bikti hain, aur log aksar galat wali maang lete hain.",
      blocks: [
        "Thyroid ka daam poochhne par alag-alag jawab isliye milte hain kyunki \"thyroid test\" se do alag cheezein hoti hain. Ek hai akela TSH, aur doosra hai poora Thyroid Profile jismein T3, T4 aur TSH teenon aate hain. Ye do alag test hain, inka daam alag hai, aur inme se kaun sa chahiye ye aapke parche se tay hota hai, dukaan se nahi.",
        {
          table: {
            caption: "TSH akela ya poora profile — farak kya hai",
            head: ["Jaanch", "Ismein kya aata hai", "Aam taur par kab likha jaata hai"],
            rows: [
              [
                "TSH (akela)",
                "Sirf thyroid stimulating hormone",
                "Pehli screening me, aur dawa chal rahi ho to follow-up me",
              ],
              [
                "Thyroid Profile",
                "T3, T4 aur TSH — teenon saath",
                "Jab TSH bahar nikla ho, ya doctor poori tasveer dekhna chahe",
              ],
            ],
          },
        },
        "Isliye daam poochhte waqt ek line aur jod deejiye: \"parche par TSH likha hai ya T3-T4-TSH?\" Isse aapko sahi rate bhi milega aur galat test bhi nahi hoga. Parcha na ho to uski photo dikha dijiye — booking ke waqt usi ke hisaab se panel lagta hai.",
        "Daam ka doosra hissa wo hai jo aksar bill me baad me judta hai — sample lene ka charge. Yahan wo nahi judta: home collection free hai, aur jo rate card par likha hai wahi collection ke waqt liya jaata hai. Kisi bhi lab se tulna karte waqt teen cheezein poochh lijiye — test ka rate, collection ka charge, aur report kab tak.",
        [
          "Thyroid, sugar aur baaki har test ka rate ek hi jagah likha hai, taaki wo teen page par alag-alag na ho jaaye — ",
          { text: "Deoria ka poora rate list", href: LAB_DEORIA_PRICE },
          ".",
        ],
      ],
    },

    {
      id: "thyroid-report-aur-dobara-jaanch",
      heading: "TSH Ki Report Aa Gayi — Ab Kya, Aur Dobara Kab",
      lead: "Ek report se faisla nahi hota; is jaanch me do report ka farak zyada kehta hai.",
      blocks: [
        "Thyroid ki report me sabse pehle TSH dekha jaata hai, aur uske saath ek normal range likhi hoti hai. Range se thoda idhar-udhar hona apne aap me kuch nahi kehta — matlab tab banta hai jab use lakshan, umar, dawa aur baaki numbers ke saath padha jaaye. Yahi wajah hai ki is report ka faisla doctor karta hai, internet nahi.",
        "Do baatein is jaanch me khaas hain. Pehli, TSH din bhar me thoda upar-neeche hota rehta hai, isliye ise aam taur par subah ka sample lekar dekha jaata hai aur ek hi tarah se dohraaya jaata hai. Doosri, dawa shuru hone ke baad TSH turant nahi badalta — usse pehle kuch hafte lagte hain, isliye doctor dobara jaanch ka waqt khud batata hai. Us waqt se pehle jaanch karwa lena sirf uljhan badhata hai.",
        {
          list: [
            "Dawa par hain — TSH dobara wahi karwaiye jo doctor ne kaha ho, aur us tareekh se pehle nahi.",
            "Dawa par nahi hain aur pehli baar border par nikla hai — doctor aksar kuch hafte baad dohraane ko kehta hai.",
            "Har baar ek hi lab se karwaiye. Alag machine ki reference range alag hoti hai, aur follow-up me farak dekha jaata hai, akela number nahi.",
            "Purani report sambhaal kar rakhiye. PDF phone me rehti hai — use delete mat kijiye.",
          ],
        },
        [
          "Ek hi lab se jaanch karwaane ki wajah aur report ke header me kya dekhna chahiye, wo alag se likha hai — ",
          { text: "report aur ek hi lab", href: BLOG_PATHOLOGY_DEORIA_ONELAB },
          ". Aur report ke numbers padhne par ",
          { text: "ye hissa", href: BLOG_LAB_DEORIA_REPORT },
          " hai.",
        ],
        {
          note: {
            title: "Garbhavastha me thyroid",
            text: "Pregnancy me thyroid ki jaanch aur uske niyam alag hote hain, aur usmein der karna theek nahi hota. Aisi soorat me apne doctor se hi poochhiye ki kaun si jaanch kab karani hai — is page ki aam salah us par lagu nahi hoti.",
            tone: "warn",
          },
        },
      ],
    },

    {
      id: "lipid-profile-test-deoria",
      heading: "Lipid Profile Test Deoria — Ismein Kya Aata Hai Aur Fasting Kitni Der",
      lead: "Cholesterol kabhi koi lakshan nahi deta, isliye ye jaanch hi uska ek matra pata hai.",
      blocks: [
        "Lipid Profile me chaar cheezein aati hain — total cholesterol, LDL, HDL aur triglycerides. Inhe milakar padha jaata hai; akela ek number kuch nahi kehta. Aur is jaanch ki sabse badi baat ye hai ki ye us cheez ko pakadti hai jo mehsoos hi nahi hoti.",
        "Fasting is jaanch me chahiye — 10 se 12 ghante, aur us beech sirf saada paani. Chai, doodh, biscuit ya toffee, koi bhi ek cheez triglycerides ka number hila deti hai. Raat ka khaana 9 baje tak kar lijiye aur subah ka pehla slot lijiye; itna hi kaafi hai.",
        {
          list: [
            "Jinka wazan badh raha hai ya pet nikal aaya hai.",
            "Jinhe sugar hai — inme ye saal me ek baar hona hi chahiye.",
            "Jinke ghar me kisi ko kam umar me dil ki bimari rahi ho.",
            "Jo tambaku ya sharaab lete hain, aur jinka kaam din bhar baithe rehne ka hai.",
            "40 ke baad har kisi ko, kam se kam ek baar, jab tak doctor kuch aur na kahe.",
          ],
        },
        "Deoria me is jaanch ka ek local pehlu bhi hai. Yahan bahut se log kaam ke liye bahar rehte hain — Delhi, Mumbai, Punjab, Gujarat aur khadi desh — jahan lambi shift, bahar ka khaana aur baithe rehne wala kaam aam hai. Ghar aane par jo ek panel sabse zyada kaam ka nikalta hai usmein lipid profile hamesha hota hai, aur wo chhutti ke pehle hi din ke subah ke slot me nipat jaata hai.",
        [
          "Sharaab test se ek din pehle nahi leni chahiye — wo lipid aur liver dono ke number badal deti hai. Sample se pehle ki poori taiyaari ",
          { text: "yahan likhi hai", href: BLOG_LAB_DEORIA_PREP },
          ", aur service page par bhi ",
          { text: "fasting ke niyam", href: LAB_DEORIA_PREPARE },
          " hain.",
        ],
      ],
    },

    {
      id: "kitni-baar-aur-fasting-table-deoria",
      heading: "Ek Nazar Me — Kaun Sa Test, Kitni Baar, Fasting Chahiye Ya Nahi",
      lead: "Booking se pehle isi table par ek nazar daal lijiye.",
      blocks: [
        "Ye aam salah hai, koi vyaktigat salah nahi. Doctor ne aapke liye alag samay ya alag panel likha ho to wahi chalega — parche ki photo booking ke waqt bhej dijiye.",
        {
          table: {
            caption: "Sugar, thyroid aur lipid — aam salah",
            head: ["Test", "Kis ke liye", "Aam taur par kitni baar", "Fasting"],
            rows: [
              [
                "Fasting Blood Sugar",
                "30 ke baad har kisi ko",
                "Saal me ek baar",
                "Haan",
              ],
              [
                "HbA1c",
                "Sugar ki dawa par ho, ya sugar border par nikla ho",
                "Har 3 mahine (doctor ke kahe anusar)",
                "Nahi",
              ],
              [
                "TSH",
                "Mahilaon me 30 ke baad; thakan ya wazan ki shikayat ho to",
                "Saal me ek baar; dawa par ho to doctor ke kahe anusar",
                "Nahi",
              ],
              [
                "Thyroid Profile (T3, T4, TSH)",
                "Jab TSH bahar nikla ho ya doctor likhe",
                "Doctor ke kahe anusar",
                "Nahi",
              ],
              [
                "Lipid Profile",
                "40 ke baad, aur sugar ya wazan ki shikayat par pehle se",
                "Saal me ek baar",
                "Haan",
              ],
              [
                "Kidney Function Test",
                "Sugar ya BP ki dawa par ho to",
                "Saal me ek baar",
                "Nahi",
              ],
            ],
          },
        },
        [
          "In sab ko ek saath karwana ho to alag-alag book karne ke bajaye package dekh lijiye — ",
          { text: "Deoria me kaun sa full body package kis ke liye", href: BLOG_FULLBODY_DEORIA },
          " us par alag guide hai, aur ",
          { text: "package me kya-kya aata hai", href: LAB_DEORIA_FULLBODY },
          " wo service page par.",
        ],
      ],
    },

    {
      id: "deoria-me-ghar-se-sample-sugar-thyroid",
      heading: "Deoria Me Ye Jaanch Ghar Se Kaise Hoti Hai",
      lead: "In teenon ke liye kahin jaana zaroori nahi — teenon sirf sample par hote hain.",
      blocks: [
        "Sugar, HbA1c, TSH, Thyroid Profile aur Lipid Profile — paanchon khoon ke sample par hote hain, aur sample kahan liya gaya isse result nahi badalta. Isliye inke liye Deoria me kisi counter tak jaana zaroori nahi hai. Trained phlebotomist ID card ke saath aapke ghar aata hai, sample aapke saamne leta hai, aur report 24 ghante ke andar WhatsApp aur email par PDF me aa jaati hai.",
        {
          note: {
            title: "Yahan hamara koi counter nahi hai",
            text: "MedicoBharat Deoria me home collection service hai — kisi mohalle me hamari branch hone ka daawa is page par nahi kiya gaya. Aur jo jaanch machine par hoti hai — X-ray, ultrasound, ECG, CT scan — wo humse nahi hoti; unke liye imaging centre par jaana hi padega. Thyroid me kabhi sonography likhi jaati hai, aur wo bhi centre par hi hogi.",
            tone: "info",
          },
        },
        {
          list: [
            "Slot subah 6 baje se shuru hote hain — fasting wale test isi window me rakhwaiye.",
            "Ek visit me ghar ke kai logon ka sample ho jaata hai, aur collection tab bhi free hai.",
            "Dawa niyam se lete hain to band mat kijiye — booking ke waqt bata dijiye ki kya kya chal raha hai.",
            "Payment sample lene ke waqt, cash ya UPI se. Rate wahi jo pehle bataya gaya tha.",
          ],
        },
        [
          "Kaun si jaanch ghar par ho jaati hai aur kis ke liye centre jaana hi padega, us par poori list ",
          { text: "yahan hai", href: BLOG_PATHOLOGY_DEORIA_HOME },
          ". Aur pata likhne ka tareeka — jo Deoria me late visit ki sabse badi wajah hai — ",
          { text: "yahan", href: BLOG_PATHOLOGY_DEORIA_PATA },
          ".",
        ],
        [
          "Booking ke liye ",
          { text: "service page ka form", href: LAB_DEORIA_BOOK },
          " bhar dijiye ya ",
          { text: "call kar lijiye", href: CONTACT },
          ". Lagbhag 30 minute me confirmation call aata hai jismein slot, pata, fasting aur total daam chaaron tay ho jaate hain.",
        ],
      ],
    },

    {
      id: "aage-kya-karein-sugar-thyroid-deoria",
      heading: "Aage Kya Karein",
      lead: "Teen kadam, isi kram me.",
      blocks: [
        {
          list: [
            "Parcha nikaaliye aur dekhiye ki usmein TSH likha hai ya Thyroid Profile, aur sugar me fasting hai ya PP bhi. Yahi ek minute poore chakkar ko theek kar deta hai.",
            "Fasting wale test ke liye subah ka pehla slot lijiye, aur raat ka khaana 9 baje tak kar lijiye.",
            "Report aa jaaye to use apne doctor ko dikhaiye — aur purani report bhi saath rakhiye, kyunki in do bimariyon me farak hi sab kuch batata hai.",
          ],
        },
        [
          "Kaun sa test kab karana chahiye, is par poori clinical guide ",
          { text: "yahan hai", href: BLOG_LAB_DEORIA },
          ". Sample dene kahan jaana padega aur kaunse mohalle cover hain, wo ",
          { text: "diagnostic centre wali guide", href: BLOG_PATHOLOGY_DEORIA },
          " me hai. Aur booking tatha rate ",
          { text: "Deoria ke service page", href: LAB_DEORIA },
          " par.",
        ],
      ],
    },
  ],

  /* Seven questions, all in this post's own lane — form, fasting, follow-up,
     thyroid ka daam. Checked against /lab-test/deoria's FAQPage (cost,
     coverage, report time, fasting, booking, Gorakhpur, "do I need to visit a
     lab"), against /blogs/lab-test/deoria's seven (package, dengue ka din,
     Gorakhpur OPD, gaon coverage, alag lab, haemoglobin, GAMCA) and against
     /blogs/pathology-lab/deoria's seven (counter, mohalla, raat, fasting+PP,
     phlebotomist, bahar se booking, sample transport) so that no question is
     answered twice on this domain.

     ⚠ The fasting+PP question is NOT repeated here — pathology-lab already
     owns it. This post covers that ground in a callout instead. */
  faqs: [
    {
      question: "Deoria me thyroid test ka price kis baat par tay hota hai?",
      answer:
        "Is par ki aap akela TSH karwa rahe hain ya poora Thyroid Profile jismein T3, T4 aur TSH teenon aate hain — ye do alag test hain aur inka rate alag hai. Kaun sa chahiye ye doctor ke parche se tay hota hai, isliye booking ke waqt parche ki photo bhej deejiye. Home sample collection ka koi alag charge nahi hai, isliye jo rate card par likha hai wahi collection ke waqt liya jaata hai, aur total confirmation call par pehle hi bata diya jaata hai. Har test ka rate Deoria ke service page par ek hi jagah likha hai.",
    },
    {
      question: "HbA1c aur fasting sugar me se kaun sa karwana chahiye?",
      answer:
        "Ye is par hai ki aap kya jaanna chahte hain. Fasting Blood Sugar us ek subah ka level batata hai aur pehli screening ke liye theek hai — usmein 10 se 12 ghante khaali pet rehna padta hai. HbA1c pichhle lagbhag teen mahine ka ausat batata hai, usmein fasting bilkul nahi lagti, aur ek din ke khaane-peene se wo nahi badalta — isi liye dawa par chal rahe logon ka follow-up HbA1c se hota hai. Doctor ne dono likhe hain to dono karwaiye; ek doosre ki jagah nahi le sakta.",
    },
    {
      question: "Thyroid ki dawa chal rahi hai — TSH kitne din baad dobara karwaana chahiye?",
      answer:
        "Wo tareekh aapka doctor batata hai, aur us se pehle jaanch karwa lena sirf uljhan badhata hai — dawa shuru ya badalne ke baad TSH ko sthir hone me kuch hafte lagte hain. Do baatein apni taraf se kar sakte hain: har baar ek hi lab se karwaiye, kyunki alag machine ki reference range alag hoti hai aur is jaanch me do report ka farak dekha jaata hai; aur purani report sambhaal kar rakhiye, PDF phone me rehti hai. Number dekh kar dawa apne aap badalna is bimari me sabse aam galti hai.",
    },
    {
      question: "Lipid profile me kitne ghante khaali pet rehna padta hai?",
      answer:
        "10 se 12 ghante, aur us beech sirf saada paani. Chai, doodh, biscuit, toffee ya paan — inme se kuch bhi triglycerides ka number badal deta hai, isliye ek cup chai bhi nahi. Sabse aasan tareeka ye hai ki raat ka khaana 9 baje tak kar lijiye aur subah ka pehla slot lijiye; sample dene ke turant baad naashta kar sakte hain. Test se ek din pehle sharaab se parhez rakhiye, kyunki wo lipid aur liver dono ke number hila deti hai.",
    },
    {
      question: "Sugar ki dawa subah leni hai aur fasting sample bhi dena hai — pehle kya karein?",
      answer:
        "Ye apne doctor se ek baar poochh lijiye, kyunki jawab is par nirbhar karta hai ki aap kaun si dawa lete hain aur insulin par hain ya nahi. Apne aap dawa chhodni nahi chahiye. Jo aap kar sakte hain wo ye hai ki subah 6 baje ka pehla slot lijiye, taaki sample jaldi ho jaaye aur aapka dawa aur naashte ka waqt zyada na khiske. Booking ke waqt bata dijiye ki aap sugar ki dawa ya insulin par hain — ye jaankari lab ke paas honi chahiye.",
    },
    {
      question: "Thyroid me sonography bhi likhi hai — kya wo bhi ghar par ho jaayegi?",
      answer:
        "Nahi. Sonography, ultrasound, X-ray, ECG aur CT scan machine par hote hain aur unke liye imaging centre par jaana hi padega — ye hamari service me shaamil nahi hai aur hum Deoria me koi imaging partner hone ka daawa nahi karte. Khoon par hone wali jaanch — TSH, Thyroid Profile, sugar, HbA1c, lipid — sab ghar se liye sample par ho jaati hain. Doctor ne dono likhe hain to khoon wali jaanch ghar par karwa lijiye aur sonography ke liye centre jaaiye; report dono saath dikhaiye.",
    },
    {
      question: "Ghar ke chaar log sugar aur thyroid karwana chahte hain — alag-alag visit lagegi?",
      answer:
        "Nahi, ek hi visit me sabka sample liya ja sakta hai aur collection phir bhi free rehta hai. Booking ke waqt sirf bata dijiye ki kitne log hain aur kis-kis ka kaun sa test hai, taaki phlebotomist utni taiyaari ke saath aaye. Dhyan ek baat ka rakhiye — jinka fasting wala test hai (fasting sugar ya lipid) wo sab khaali pet rahein, aur jinka sirf HbA1c ya TSH hai unhe fasting ki zaroorat nahi hai. Ek subah me poora ghar nipat jaata hai.",
    },
  ],

  relatedLinks: {
    heading: "Deoria Ke Liye Aage Ki Jaankari",
    intro:
      "Is guide me form, fasting aur follow-up hai. Kaun sa test kab karana chahiye wo clinical guide me, jagah aur pata diagnostic guide me, aur rate sirf service page par.",
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
            href: BLOG_FULLBODY_DEORIA,
            label: "Deoria me full body checkup — kaun sa package",
            sub: "Teen package ka farak, aur do labs ko tolne ka tareeka",
          },
          {
            href: BLOG_PATHOLOGY_DEORIA,
            label: "Deoria me diagnostic centre aur blood test",
            sub: "Mohalle, kasbe, pata likhne ka tareeka aur booking",
          },
          {
            href: BLOG_FULLBODY_VARANASI,
            label: "Package me kya hona chahiye",
            sub: "\"80+ parameters\" ka sach — har jile par ek jaisa lagu",
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
            sub: "Sugar, thyroid, HbA1c, lipid aur package — sab ek jagah",
          },
          {
            href: LAB_DEORIA_DIABETES,
            label: "Sugar aur thyroid screening — service page par",
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
