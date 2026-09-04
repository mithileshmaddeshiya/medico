/**
 * /blogs/dengue-typhoid-test/deoria — the fever panel guide.
 *
 * ── THE LANE ─────────────────────────────────────────────────────────────
 * Deoria's existing set answers four different questions. This is the fifth:
 *
 *   /lab-test/deoria                      → book kahan se, rate, menu
 *   /blogs/lab-test/deoria                → kaun sa test kab (poori clinical)
 *   /blogs/pathology-lab/deoria           → sample dene kahan (geography)
 *   /blogs/diabetes-thyroid-test/deoria   → sugar/thyroid/lipid ka form
 *   /blogs/full-body-checkup/deoria       → kaun sa package, kis ke liye
 *   /blogs/dengue-typhoid-test/deoria     → bukhar ki jaanch (this)
 *
 * ⚠ OVERLAP TO RESPECT: /blogs/lab-test/deoria has a section called
 * "Bukhar Aaya Hai — Test Kis Din Karana Chahiye" and one FAQ on the dengue
 * day. That is the SUMMARY. This page is the long form, and it goes where the
 * summary cannot: NS1 vs IgM vs IgG as three different tests, what a Widal
 * title can and cannot settle, why the platelet count is read as a trend and
 * not as one number, and what to do when the first report is negative and the
 * fever is not. The dengue-day FAQ is NOT repeated below — two FAQPage nodes
 * on one domain answering the same question compete for one rich result.
 *
 * ── WHY THIS IS DEORIA'S PAGE AND NOT A GENERIC ONE ──────────────────────
 * The district's fever season is a water season. /lab-test/deoria already
 * carries #fever-season-deoria and #flood-water-diseases-deoria for that
 * reason. This page is written for the weeks after the rain: standing water in
 * the mohallas and the low villages, a household where three people run a
 * temperature in the same week, and a family that cannot take a feverish
 * patient on a bike to a counter — which is exactly when home collection stops
 * being a convenience and starts being the reason the test happens at all.
 *
 * ── THE LINE THIS PAGE MUST NOT CROSS ────────────────────────────────────
 * A fever page is the easiest page on a lab site to turn into medical advice.
 * It does not say which medicine, which dose, when to stop, or what a number
 * "means" for the patient. It says which test, on which day, and when NOT to
 * wait. The four red flags are in a `warn` callout on purpose: they are the
 * only place this page tells anyone to act now, and they send them to a doctor,
 * not to a booking form.
 *
 * ── NO PRICES, SAME AS THE SIBLINGS ──────────────────────────────────────
 * Not one rate. Every sentence that would carry a number links to
 * #lab-test-price-deoria instead, so the rate lives in one file
 * (src/data/lab/content/deoria.js) and cannot drift across six pages.
 *
 * ── CLAIMS ───────────────────────────────────────────────────────────────
 * Only the five the business confirms: free home collection, a trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours (culture
 * 48–72, and that is stated wherever culture is mentioned), cash/UPI on
 * collection. NOT claimed: NABL accreditation, pathologist verification,
 * "certified" anything, same-day reports, 24-hour or emergency collection —
 * this is a fever page and the temptation to promise a night visit is real, so
 * the guide says plainly that a night emergency belongs at a hospital.
 *
 * ── IMAGES: NONE ─────────────────────────────────────────────────────────
 * /public has no Deoria photography and `src` must name a file that exists.
 * og:image resolves to /blogs/dengue-typhoid-test/deoria/og.
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
const LAB_DEORIA_FEVER = "/lab-test/deoria#fever-season-deoria";
const LAB_DEORIA_FLOOD = "/lab-test/deoria#flood-water-diseases-deoria";
const LAB_DEORIA_HOME = "/lab-test/deoria#home-sample-collection-deoria";
const LAB_DEORIA_PRICE = "/lab-test/deoria#lab-test-price-deoria";
const LAB_DEORIA_REPORTS = "/lab-test/deoria#reports-deoria";
const LAB_DEORIA_BOOK = "/lab-test/deoria#how-to-book-deoria";
const LAB_DEORIA_PREPARE = "/lab-test/deoria#prepare-for-test-deoria";
const LAB_DEORIA_GORAKHPUR = "/lab-test/deoria#gorakhpur-travel-deoria";

/* The Varanasi sibling. The link runs both ways on purpose — that guide
   links here too, and a one-way link tells a crawler two pages are related but
   nothing about which one owns the subject. */
const BLOG_DENGUE_VARANASI = "/blogs/dengue-typhoid-test/varanasi";
const LAB_SALEMPUR = "/lab-test/salempur";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_KUSHINAGAR = "/lab-test/kushinagar";

const BLOG_LAB_DEORIA = "/blogs/lab-test/deoria";
const BLOG_LAB_DEORIA_FEVER = "/blogs/lab-test/deoria#bukhar-me-kis-din-test";
const BLOG_PATHOLOGY_DEORIA = "/blogs/pathology-lab/deoria";
const BLOG_PATHOLOGY_DEORIA_HOME = "/blogs/pathology-lab/deoria#ghar-se-kaunsi-jaanch";
const BLOG_PATHOLOGY_DEORIA_PATA = "/blogs/pathology-lab/deoria#pata-landmark-deoria";
const BLOG_PATHOLOGY_DEORIA_ONELAB =
  "/blogs/pathology-lab/deoria#report-aur-ek-hi-lab-deoria";
const BLOG_FULLBODY_DEORIA = "/blogs/full-body-checkup/deoria";
const BLOG_DIABETES_DEORIA = "/blogs/diabetes-thyroid-test/deoria";

const CONTACT = "/contact";

export const dengueTyphoidDeoria = {
  category: "dengue-typhoid-test",
  city: "deoria",

  /* 37 characters. The root layout appends " | MedicoBharat", so Google renders
     52 — inside the ~60 it will show. Dengue and typhoid are in the title
     because they are the two queries; malaria and platelet count carry in the
     description, the headings and the table. */
  title: "Deoria Me Dengue Aur Typhoid Test Kab",

  /* ~140 characters. Hinglish, with the English terms that must match left
     intact: dengue, typhoid, NS1, Widal, platelet. */
  description:
    "Deoria me bukhar par dengue, typhoid aur malaria ka test kis din karayein, NS1 aur Widal ka matlab kya hai, aur platelet dobara kab dekhein.",

  /* Ordered strongest first. Every term here appears in the visible copy. */
  keywords: [
    "Dengue Test in Deoria",
    "Typhoid Test in Deoria",
    "Widal Test in Deoria",
    "Malaria Test in Deoria",
    "Platelet Count Test in Deoria",
    "NS1 Antigen Test Deoria",
    "Bukhar Ka Test Deoria",
    "Fever Panel Test Deoria",
    "CBC Test in Deoria",
    "Blood Test at Home in Deoria",
    "Home Sample Collection Deoria",
    "Lab Test in Deoria",
    "Dengue Test at Home Deoria",
    "Blood Test in Rudrapur Deoria",
    "Fever Test Barhaj Bhatpar Rani",
  ],

  canonical: canonicalFor("dengue-typhoid-test", "deoria"),
  robots: INDEXABLE,
  author: BLOG_AUTHOR,
  publisher: BLOG_PUBLISHER,

  publishedAt: "2026-09-02",
  updatedAt: "2026-09-02",

  /* Stated rather than computed. Update it when the article grows a section. */
  readingMinutes: 10,

  /** The skimmer's version of the whole article. */
  takeaways: [
    "Bukhar me sabse badi galti test ka na karana nahi, galat din par karana hai — pehle hi din ka dengue ya typhoid test aksar negative aata hai aur log nishchint ho jaate hain.",
    "Dengue ke teen test alag cheezein hain: NS1 shuru ke dinon ka, IgM baad ke dinon ka, aur IgG purani cheez batata hai. Doctor kaun sa likhega ye bukhar ke din par tay hota hai.",
    "Widal ek ishara hai, faisla nahi. Typhoid me culture zyada bharosemand hai, aur usme 48 se 72 ghante lagte hain — ye booking ke waqt hi bata diya jaata hai.",
    "Platelet count ek number nahi, ek dhaara hai. Usse ek report se nahi, do-teen report ki tulna se pada jaata hai — aur tulna tabhi sahi hoti hai jab har baar ek hi lab ho.",
    "Bukhar wale mareez ko baahar le jaana zaroori nahi — sample ghar par liya ja sakta hai. Lekin raat ki emergency lab ka kaam nahi hai, wo aspatal ka hai.",
  ],

  sections: [
    {
      id: "bukhar-me-din-ki-galti-deoria",
      heading: "Deoria Me Bukhar Ki Jaanch — Sabse Badi Galti Din Ki Hoti Hai",
      lead: "Test galat nahi tha. Din galat tha.",
      blocks: [
        "Deoria me barsaat ke baad ka mahina bukhar ka mahina hota hai, aur sabse aam kahani ye hai: pehle din bukhar aaya, usi shaam dengue aur typhoid ka test karwa liya, dono negative aaye, ghar wale nishchint ho gaye — aur teen din baad haalat bigad gayi. Test ne dhokha nahi diya. Test us din wo cheez dhoondh hi nahi sakta tha, kyunki wo cheez us waqt khoon me utni matra me hoti hi nahi.",
        "Har bimari apne apne din par pakad me aati hai. Isi liye \"kaunsa test\" se pehle ka sawaal hai \"kis din\". Ye guide wahi ek sawaal poori tarah kholti hai — dengue, typhoid, malaria aur platelet count, chaaron ke liye.",
        {
          note: {
            title: "Ye jaanch ki guide hai, ilaaj ki nahi",
            text: "Yahan ye likha hai ki kis din kaun sa test karana chahiye aur report ke sath aage kya karna hota hai. Yahan ye nahi likha ki kaun si dawa leni hai, kitni leni hai, ya kab band karni hai. Bukhar ka ilaaj doctor karta hai; ye page sirf ye tay karne me madad karta hai ki doctor ke paas kaunsi report leke jaana hai.",
            tone: "warn",
          },
        },
        [
          "Bukhar ke din ka chhota saar clinical guide me bhi hai — ",
          { text: "bukhar me kis din test", href: BLOG_LAB_DEORIA_FEVER },
          ". Ye page usi ka lamba roop hai, jismein har test alag se khola gaya hai.",
        ],
      ],
    },

    {
      id: "dengue-test-deoria-ns1-igm-igg",
      heading: "Dengue Test In Deoria — NS1, IgM Aur IgG Teen Alag Cheezein Hain",
      lead: "Ek hi bimari, teen alag test, teen alag din.",
      blocks: [
        "\"Dengue ka test\" kehne se kaam nahi chalta, kyunki dengue ke naam par teen alag test hote hain aur teenon ek jaisa jawab nahi dete. Parche par jo likha ho wahi karwaiye — aur agar aapko khud tay karna pad raha ho, to din dekhiye.",
        {
          list: [
            "NS1 antigen — bukhar ke shuruaati dinon ka test hai. Bahut jaldi karaya jaaye to bhi aur der se karaya jaaye to bhi, dono me chhoot jaane ka khatra rehta hai.",
            "Dengue IgM — sharir ki pratikriya batata hai, aur wo pratikriya banne me kuch din lagte hain. Isi liye bukhar ke baad wale dinon me iska matlab nikalta hai.",
            "Dengue IgG — aksar purane sampark ka ishara hota hai, abhi ke bukhar ka nahi. Akela IgG positive dekh kar ghabraana galat hai.",
            "CBC — dengue me sabse zyada kaam ka test yahi hai, kyunki platelet aur baaki ginti isi me aati hai. Aur ise ek baar nahi, doctor ke kahe anusar dobara bhi dekha jaata hai.",
          ],
        },
        "Isi wajah se doctor aksar dengue ke saath CBC bhi likhta hai, aur akela dengue card negative aane par bhi CBC par nazar rakhta hai. Bukhar teen din se zyada khinch raha ho aur pehla test negative aaya ho, to test dobara karana galat nahi hai — wo pehle test ka apmaan nahi, agle din ki jaanch hai.",
        [
          "Sample ghar se hi liya ja sakta hai; bukhar wale mareez ko lekar nikalna zaroori nahi. Deoria me kaun si jaanch ghar par hoti hai, uski poori list ",
          { text: "yahan hai", href: BLOG_PATHOLOGY_DEORIA_HOME },
          ".",
        ],
      ],
    },

    {
      id: "typhoid-widal-test-deoria",
      heading: "Typhoid Test In Deoria — Widal Ka Matlab, Aur Uski Seema",
      lead: "Widal ishara deta hai. Faisla culture aur doctor karte hain.",
      blocks: [
        "Deoria me typhoid ke liye sabse zyada Widal test karaya jaata hai, aur usi ke saath sabse zyada galatfehmi bhi judi hai. Widal ka number kai wajah se upar dikh sakta hai — purana typhoid, purana tika, ya ilaake me ghoom rahi koi aur cheez. Isliye akela Widal positive dekh kar \"typhoid ho gaya\" maan lena aur akela negative dekh kar nishchint ho jaana, dono thik nahi hain.",
        {
          list: [
            "Widal — shuruaati dinon me aksar negative rehta hai, kyunki uske positive hone me bhi kuch din lagte hain. Bukhar ke pehle din ka Widal aksar kuch nahi batata.",
            "Blood culture — typhoid me zyada bharosemand maana jaata hai aur shuruaati dinon me hi sabse achha kaam karta hai. Ismein 48 se 72 ghante lagte hain, aur ye booking ke waqt hi bata diya jaata hai.",
            "Typhi IgM card — kuch jagah likha jaata hai; ise bhi doctor apne hisaab se padta hai, akela nahi.",
            "CBC — typhoid me bhi likha jaata hai, kyunki khoon ki ginti ka apna ishara hota hai.",
          ],
        },
        {
          note: {
            title: "Culture ka ek zaroori niyam",
            text: "Blood culture ka sample antibiotic shuru hone se pehle liya jaaye to uska matlab sabse saaf hota hai. Dawa pehle se chal rahi hai to ye baat booking ke waqt aur doctor ko dono ko bata dijiye. Apne aap dawa rokni nahi hai — ye faisla sirf doctor ka hai.",
            tone: "warn",
          },
        },
        [
          "Typhoid Deoria me paani se judi bimariyon ke saath aata hai. Barsaat ke baad kaunsi jaanch zyada karayi jaati hai, us par ",
          { text: "flood aur paani se hone wali bimariyon ka section", href: LAB_DEORIA_FLOOD },
          " service page par hai.",
        ],
      ],
    },

    {
      id: "malaria-aur-doosri-wajah-deoria",
      heading: "Malaria Aur Baaki Wajah — Bukhar Sirf Do Naam Nahi Hai",
      lead: "Dengue aur typhoid negative aane ka matlab \"kuch nahi hai\" nahi hota.",
      blocks: [
        "Deoria me bukhar ki wajah sirf dengue aur typhoid nahi hoti. Malaria yahan ab bhi milta hai, khaas kar un ilaakon me jahan barsaat ka paani ruka rehta hai. Malaria ke liye antigen card aur khoon ka smear dono chalte hain, aur inka sabse achha waqt wo hota hai jab bukhar chadha hua ho — ye baat booking ke waqt bata di jaaye to slot usi hisaab se rakh diya jaata hai.",
        "Iske alawa peshab ka infection, gale ya chest ka infection, aur kuch mausami bimariyan bhi wahi bukhar deti hain. Isi liye doctor aksar ek saath teen-chaar test likhta hai — wo confusion nahi hai, wo ek-ek karke wajah kaatne ka tareeka hai. Aur isi liye ye page ye nahi kehta ki aap khud tay kar lijiye ki kaunsa test karana hai.",
        {
          list: [
            "Bukhar ke saath peshab me jalan ya baar-baar peshab — doctor urine routine bhi likhta hai; wo bhi ghar se liye sample par ho jaata hai.",
            "Bukhar ke saath khaansi aur saans ki dikkat — yahan chest ka X-ray likha ja sakta hai, aur wo humse nahi hota; uske liye imaging centre par jaana hoga.",
            "Bachche ka tez bukhar — ismein intezaar nahi kiya jaata; pehle doctor, phir jo wo likhe wo test.",
            "Bukhar ke saath peeliya jaisa lagna, aankh ya peshab ka rang badalna — doctor LFT likh sakta hai; wo ghar se ho jaata hai.",
          ],
        },
      ],
    },

    {
      id: "platelet-count-deoria",
      heading: "Platelet Count — Deoria Me Sabse Zyada Ghabrahat Isi Number Se Hoti Hai",
      lead: "Ek number se nahi, do-teen report ki dhaara se pada jaata hai.",
      blocks: [
        "Dengue ke seezan me platelet count ghar-ghar ka shabd ban jaata hai, aur uske saath ghabrahat bhi. Samajhne ki baat ye hai: platelet ka ek din ka number utna nahi batata jitna uski dhaara batati hai — wo gir raha hai, tik gaya hai, ya wapas chadh raha hai. Isi liye doctor ek hi report par faisla nahi karta aur CBC dobara likhta hai.",
        {
          list: [
            "CBC ke liye fasting nahi chahiye — din me kabhi bhi sample diya ja sakta hai. Bukhar me ye sabse bada aaram hai.",
            "Dobara CBC kab karana hai ye doctor batata hai. Apne aap roz karwana na zaroori hai, na madadgar.",
            "Har baar ek hi lab se karwaiye. Do labs ke analyser alag hote hain, aur platelet jaise number me tulna tabhi kaam ki hai jab machine wahi ho.",
            "Report par sample lene ka din aur waqt likha hota hai — dobara karwate waqt wahi tulna ka aadhaar banta hai.",
          ],
        },
        {
          note: {
            title: "In haalaton me intezaar nahi kiya jaata",
            text: "Naak, masudon ya peshab-latrine me khoon dikhe; ulti band na ho ya paani tak na tik raha ho; mareez sust pade, behosh jaisa lage ya bahut kam peshab aaye; ya pet me tez dard ho — in me report ka intezaar nahi karte, mareez ko usi waqt aspatal le jaate hain. Ye baat bachchon aur bujurgon ke liye aur zyada lagu hoti hai.",
            tone: "warn",
          },
        },
        [
          "Ek hi lab se karwane ki wajah aur report ka header kaise padha jaata hai, wo ",
          { text: "yahan vistaar se likha hai", href: BLOG_PATHOLOGY_DEORIA_ONELAB },
          ".",
        ],
      ],
    },

    {
      id: "kis-din-kaun-sa-test-table-deoria",
      heading: "Ek Nazar Me — Bukhar Ke Kis Din Kaun Sa Test",
      lead: "Booking se pehle isi table par ek nazar daal lijiye.",
      blocks: [
        "Ye aam salah hai, koi vyaktigat salah nahi. Doctor ne alag test ya alag din likha ho to wahi chalega — parche ki photo booking ke waqt bhej dijiye.",
        {
          table: {
            caption: "Bukhar ke din ke hisaab se aam salah",
            head: ["Bukhar ka din", "Aam taur par kya likha jaata hai", "Fasting", "Report"],
            rows: [
              [
                "Pehla din",
                "Aam taur par doctor ko dikhaana; test ka din aksar aage rakha jaata hai",
                "Nahi",
                "—",
              ],
              [
                "Dusre se paanchve din",
                "CBC, malaria, aur dengue me NS1 (doctor ke kahe anusar)",
                "Nahi",
                "24 ghante ke andar",
              ],
              [
                "Paanchve din ke baad",
                "CBC dobara, dengue IgM, Widal (doctor ke kahe anusar)",
                "Nahi",
                "24 ghante ke andar",
              ],
              [
                "Bukhar 5-7 din se upar khinch raha ho",
                "Blood culture — shuru me dawa se pehle liya jaaye to sabse saaf",
                "Nahi",
                "48 se 72 ghante",
              ],
              [
                "Platelet par nazar rakhni ho",
                "CBC dobara, doctor ke kahe hue antaraal par",
                "Nahi",
                "24 ghante ke andar",
              ],
              [
                "Bukhar utarne ke baad ka routine",
                "Package ke liye kam se kam do hafte ruk jaaiye",
                "Haan (package me)",
                "24 ghante ke andar",
              ],
            ],
          },
        },
        [
          "Bukhar ke baad routine checkup kab karana chahiye aur us me kya hona chahiye, us par alag guide hai — ",
          { text: "Deoria me full body checkup kaise chunein", href: BLOG_FULLBODY_DEORIA },
          ". Bukhar wale test ke rate ",
          { text: "Deoria ki price list", href: LAB_DEORIA_PRICE },
          " me hain; is guide me ek bhi number jaan-boojh kar nahi likha gaya.",
        ],
      ],
    },

    {
      id: "barsaat-ke-baad-deoria-seezan",
      heading: "Barsaat Ke Baad Ka Deoria — Jab Ek Ghar Me Teen Log Beemar Padte Hain",
      lead: "Yahan bukhar akela nahi aata, mohalle ke saath aata hai.",
      blocks: [
        "Deoria jile me barsaat ke baad paani jaldi nahi utarta. Mohalle ki nichli galiyaan, gaon ke pokhre ke kinare aur kheton se lage tole — inhi jagahon se sabse zyada bukhar ke mareez aate hain, aur aksar ek hi ghar me do-teen log ek saath. Aise me do practical baatein hain jo bahut farak daalti hain.",
        {
          list: [
            "Ghar ke jitne logon ko bukhar hai, sabki booking ek hi slot me kar dijiye. Ek hi visit me sabka sample ho jaata hai aur collection tab bhi free hai.",
            "Har mareez ka apna test likha hota hai — sab par ek hi panel mat lagaiye. Kis-kis ka kaunsa test hai, ye booking ke waqt saaf bata dijiye.",
            "Mareez chalne-firne layak nahi hai to ye bata dijiye; phlebotomist usi taiyaari ke saath aata hai aur sample bistar par hi le liya jaata hai.",
            "Pata poora likhiye — mohalla ya gaon, post office ya block, aur ek aisa landmark jo shaam ko bhi dikhe. Deoria me deri ka sabse bada karan pata na milna hai.",
            "Peene ka paani, khaane ki safai aur machhar — bimari ka ilaaj test se nahi hota, lekin agla mareez inhi teen cheezon se rukta hai.",
          ],
        },
        [
          "Seezan me kaunsi jaanch sabse zyada karayi jaati hai, us par ",
          { text: "fever season wala section", href: LAB_DEORIA_FEVER },
          " hai, aur pata likhne ka poora tareeka ",
          { text: "yahan", href: BLOG_PATHOLOGY_DEORIA_PATA },
          ". Rudrapur, Barhaj, Bhatpar Rani, Gauri Bazar, Baitalpur, Lar aur Bhatni tak coverage ",
          { text: "home collection wale section", href: LAB_DEORIA_HOME },
          " me likhi hai; Salempur tehsil ke liye ",
          { text: "uska apna page", href: LAB_SALEMPUR },
          " hai.",
        ],
      ],
    },

    {
      id: "bukhar-me-ghar-se-sample-deoria",
      heading: "Bukhar Me Ghar Se Sample — Kya Dhyaan Rakhein",
      lead: "Mareez ko baahar le jaana zaroori nahi. Lekin raat ki emergency lab ka kaam nahi hai.",
      blocks: [
        "Bukhar ke test — CBC, dengue, malaria, Widal, urine routine — sab khoon ya peshab ke sample par hote hain, aur inme se kisi me fasting nahi lagti. Iska matlab ye hai ki mareez ko kahin le jaane ki zaroorat nahi: trained phlebotomist ID card ke saath ghar aata hai, sample aapke saamne leta hai, aur report 24 ghante ke andar WhatsApp aur email par PDF me aati hai. Culture likha ho to 48 se 72 ghante lagte hain aur ye booking ke waqt hi bata diya jaata hai.",
        {
          list: [
            "Slot subah 6 baje se shuru hote hain. Malaria me bukhar chadhne ke waqt ka sample zyada kaam ka hota hai — ye baat call par bata dijiye.",
            "Mareez ne paani nahi piya ho to nas milne me dikkat hoti hai. Fasting kisi bukhar wale test me nahi lagti, isliye paani pilate rahiye.",
            "Booking ke waqt bata dijiye ki kaun si dawa chal rahi hai, khaas kar antibiotic — culture ke liye ye jaankari zaroori hai.",
            "Payment sample lene ke waqt, cash ya UPI se, wahi rate jo pehle bataya gaya tha. Home collection ka koi alag visiting charge nahi hai.",
          ],
        },
        {
          note: {
            title: "Raat ki emergency me lab nahi, aspatal",
            text: "Hum Deoria me 24 ghante ya raat ki collection ka daawa nahi karte. Raat me haalat bigde — behoshi, saans ki dikkat, khoon aana, bachche ka tez bukhar ya jhatka — to lab ka intezaar nahi kiya jaata; mareez ko seedhe aspatal le jaaiye. Test uske baad bhi ho sakta hai, ilaaj ruk nahi sakta.",
            tone: "warn",
          },
        },
        [
          "Sample dene se pehle ki poori taiyaari ",
          { text: "service page par", href: LAB_DEORIA_PREPARE },
          " hai, aur report kab tatha kaise aati hai wo ",
          { text: "report wale section", href: LAB_DEORIA_REPORTS },
          " me.",
        ],
      ],
    },

    {
      id: "aage-kya-karein-bukhar-deoria",
      heading: "Aage Kya Karein",
      lead: "Teen kadam, isi kram me.",
      blocks: [
        {
          list: [
            "Bukhar ka pehla din yaad kar ke likh lijiye. Poore ilaaj me sabse zyada kaam yahi tareekh aati hai, aur yahi tay karti hai ki kaunsa test kis din hoga.",
            "Doctor ko dikhaiye aur parche ki photo booking ke waqt bhej dijiye. Khud panel chunne ki koshish mat kijiye.",
            "Ghar me ek se zyada log beemar hain to sabki booking ek hi slot me kar dijiye — ek visit me sabka sample ho jaayega.",
          ],
        },
        [
          "Booking ke liye ",
          { text: "Deoria ka form", href: LAB_DEORIA_BOOK },
          " bhar dijiye ya ",
          { text: "call kar lijiye", href: CONTACT },
          ". Kaun sa test kab karana chahiye us par poori clinical guide ",
          { text: "yahan hai", href: BLOG_LAB_DEORIA },
          ", sample dene ki jagah aur mohalla coverage ",
          { text: "diagnostic centre wali guide", href: BLOG_PATHOLOGY_DEORIA },
          " me, aur Gorakhpur me ilaaj chal raha ho to ",
          { text: "us se pehle ki taiyaari", href: LAB_DEORIA_GORAKHPUR },
          " dekh lijiye.",
        ],
      ],
    },
  ],

  /* Seven questions in this post's own lane — negative report, Widal ka matlab,
     platelet dobara, fasting, ghar ke kai mareez, culture ka samay, bukhar ke
     baad routine. "Dengue ka test kis din karana chahiye" is deliberately
     ABSENT: /blogs/lab-test/deoria owns it. Checked against /lab-test/deoria
     (8), /blogs/lab-test/deoria (7), /blogs/pathology-lab/deoria (7),
     /blogs/diabetes-thyroid-test/deoria (7) and /blogs/full-body-checkup/deoria
     (7). */
  faqs: [
    {
      question: "Dengue aur typhoid dono negative aaye lekin bukhar abhi bhi hai — ab kya karein?",
      answer:
        "Sabse pehle doctor ko wahi report dikhaiye; negative report bhi jaankari hai, wo kai wajah kaat deti hai. Do baatein dhyaan me rakhiye: shuruaati dinon me liya gaya sample aksar negative aata hai kyunki us waqt bimari pakad me nahi aati, aur bukhar ki wajah in do naam ke bahar bhi ho sakti hai — malaria, peshab ka infection, gale ya chest ka infection. Isi liye doctor aksar kuch din baad dobara test ya koi alag test likhta hai, aur uske saath CBC par nazar rakhta hai. Dobara test karana pehle test ki galti nahi, agle din ki jaanch hai.",
    },
    {
      question: "Widal positive aaya hai — kya typhoid pakka ho gaya?",
      answer:
        "Nahi, Widal akela faisla nahi karta. Uska number purane typhoid, purane tike ya ilaake me ghoom rahi kisi aur cheez se bhi upar dikh sakta hai, aur shuruaati dinon me wo negative bhi ho sakta hai jabki bimari maujood ho. Isi liye doctor use aapke lakshan, bukhar ke din aur CBC ke saath milakar padhta hai, aur zaroorat lage to blood culture likhta hai — usmein 48 se 72 ghante lagte hain aur wo baat booking ke waqt bata di jaati hai. Report dekh kar apne aap dawa shuru ya band karna is bimari me sabse mehngi galti hai.",
    },
    {
      question: "Platelet count kam aaya hai — dobara CBC kitne din baad karwana chahiye?",
      answer:
        "Ye antaraal aapka doctor batata hai, kyunki wo aapke number aur haalat dono dekhkar tay hota hai — kisi ko agle din dobara chahiye, kisi ko do din baad. Roz apne aap karwana na zaroori hai aur na hi usse kuch tay hota hai. Do cheezein aap kar sakte hain: har baar ek hi lab se karwaiye, kyunki alag analyser ke number ki tulna galat raaste par le jaati hai, aur purani report saath rakhiye, kyunki platelet me dhaara dekhi jaati hai, ek akela number nahi. CBC me fasting nahi lagti, isliye slot kisi bhi waqt liya ja sakta hai.",
    },
    {
      question: "Bukhar ke test me khaali pet rehna padta hai kya?",
      answer:
        "Nahi. CBC, dengue ke card test, malaria, Widal aur urine routine — inme se kisi me fasting nahi lagti, isliye sample din me kabhi bhi diya ja sakta hai aur mareez ko bhookha rakhne ki zaroorat bilkul nahi hai. Bukhar me paani pilate rehna behtar hai, kyunki paani ki kami me nas milne me dikkat hoti hai. Fasting sirf tab aati hai jab doctor sugar ya lipid bhi likh de, ya aap bukhar utarne ke baad routine package karwa rahe hon — us haalat me subah ka pehla slot le lijiye.",
    },
    {
      question: "Ghar me teen logon ko bukhar hai — sabka test ek hi visit me ho jaayega?",
      answer:
        "Haan, ek hi visit me teenon ka sample liya ja sakta hai aur home collection phir bhi free rehta hai. Booking ke waqt sirf ye bata dijiye ki kitne log hain aur kis-kis ka kaunsa test hai — sab par ek hi panel mat lagwaiye, kyunki har mareez ke bukhar ka din alag ho sakta hai aur uske hisaab se test badal jaata hai. Kisi ko chalne-firne me dikkat hai ya bistar par hai to wo bhi bata dijiye. Har vyakti ki report alag PDF me, 24 ghante ke andar WhatsApp aur email par aa jaati hai.",
    },
    {
      question: "Blood culture likha hai — report 24 ghante me kyun nahi aati?",
      answer:
        "Culture me sample ko lab me kuch din badhne diya jaata hai; ye machine par turant padha jaane wala test nahi hai. Isi liye usme aam taur par 48 se 72 ghante lagte hain, aur ye baat booking ke waqt hi bata di jaati hai taaki aap intezaar me pareshan na hon. Ek baat aur — culture ka sample antibiotic shuru hone se pehle liya jaaye to uska matlab sabse saaf hota hai, isliye jo dawa chal rahi hai wo lab aur doctor dono ko bata dijiye. Dawa apne aap rokni nahi hai; wo faisla sirf doctor ka hai.",
    },
    {
      question: "Bukhar theek hone ke baad koi test dobara karana chahiye?",
      answer:
        "Doctor aksar ek follow-up CBC likhta hai, khaas kar dengue ke baad, taaki ye dikh jaaye ki ginti wapas apni jagah par aa gayi. Uske alawa lambe bukhar ke baad kamzori rehna aam hai, aur usmein haemoglobin, ferritin ya vitamin B12 dekhe jaate hain. Lekin poora routine package bukhar utarne ke turant baad mat karwaiye — kam se kam do hafte ruk jaaiye, warna kai number bimari ki wajah se hile hue milenge aur wahi aage ke saalon ki tulna kharab karega.",
    },
  ],

  relatedLinks: {
    heading: "Deoria Ke Liye Aage Ki Jaankari",
    intro:
      "Is guide me bukhar ke din aur uske test hain. Kaun sa test kab karana chahiye wo clinical guide me, jagah aur pata diagnostic guide me, aur rate sirf service page par.",
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
            href: BLOG_PATHOLOGY_DEORIA,
            label: "Deoria me diagnostic centre aur blood test",
            sub: "Mohalle, kasbe, pata likhne ka tareeka aur booking",
          },
          {
            href: BLOG_FULLBODY_DEORIA,
            label: "Deoria me full body checkup kaise chunein",
            sub: "Daam kis baat par tay hota hai, aur kis ke liye kaun sa package",
          },
          {
            href: BLOG_DIABETES_DEORIA,
            label: "Deoria me sugar, thyroid aur lipid ki jaanch",
            sub: "Fasting kis me chahiye, HbA1c aur TSH dobara kab",
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
            href: LAB_DEORIA_FEVER,
            label: "Bukhar ke seezan me kya karayein — service page par",
          },
          {
            href: LAB_DEORIA_PRICE,
            label: "Deoria me lab test ka rate list",
            sub: "CBC, dengue, Widal, malaria aur package — sab ek jagah",
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
            href: BLOG_DENGUE_VARANASI,
            label: "Varanasi me dengue aur typhoid test",
            sub: "Wahi guide, Varanasi ke liye",
          },
        ],
      },
    ],
  },
};
