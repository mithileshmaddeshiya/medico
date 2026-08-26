/**
 * /blogs/lab-test/varanasi — "Varanasi Me Lab Test — Kaun Sa Test Kab"
 *
 * ── WHY THIS ARTICLE IS NOT THE /lab-test/varanasi PAGE AGAIN ─────────────
 * The service page at /lab-test/varanasi already sells the service: what we
 * collect, from which localities, at what price, book here. If this article
 * repeated that, Google would have two URLs on one domain making the same
 * argument and would pick one — usually the older one — and drop the other.
 * That is the doorway-page failure the Deoria copy was rewritten to escape
 * (see the note at the top of src/data/lab/content/deoria.js).
 *
 * So this is deliberately the OTHER half of the reader's problem. The service
 * page answers "kahan se karaun". This one answers "karaun bhi to kaun sa,
 * kab, aur report aane ke baad kya". Price is NOT repeated here — the one
 * paragraph about cost links to the price section on the service page instead,
 * so the number lives in exactly one place and cannot drift.
 *
 * ── WHY SO MUCH OF IT IS TABLES AND LISTS ────────────────────────────────
 * The first draft was ten sections of five paragraphs each. Every fact was
 * there and none of it was findable: a reader with one question ("mujhe kaun
 * sa test karana hai") had to read four hundred words to answer it, and a
 * search engine had no compact block to lift into a snippet. The same facts as
 * a three-column table answer the question at a glance, and a "shikayat →
 * test" table is exactly the shape a featured snippet is built from.
 *
 * Prose is kept where the point is an argument (why timing matters, how to
 * judge a lab). Tables are used where the point is a lookup.
 *
 * ── Claims ───────────────────────────────────────────────────────────────
 * Only the five the operation actually confirms: free home collection, a
 * trained phlebotomist carrying an ID card, slots from 6 AM, reports in 24
 * hours, cash/UPI on collection. Cold-chain transport, barcode tracking and
 * sealed single-use needles are NOT claimed — they are unverified. The older
 * Varanasi service copy does use them; that is a known inconsistency, not a
 * precedent to copy here.
 *
 * Clinical statements are the standard, uncontroversial ones — NS1 in the
 * first five days, Widal after day five, HbA1c every three months for a
 * diabetic, biotin stopped before a hormone assay. Nothing here diagnoses; the
 * article says "doctor ko dikhaiye" wherever a number could be acted on.
 *
 * ── Keyword placement ────────────────────────────────────────────────────
 * One primary term, "Varanasi me lab test", carried by the URL, the title and
 * the lead. Everything else gets its OWN heading, because a heading ranks and
 * a phrase buried mid-paragraph mostly does not: kaun sa test kab, umar ke
 * hisaab se, dengue/typhoid, fasting, report padhna, lab chunna. Each appears
 * in one H2 and then reads as ordinary prose.
 *
 * ── Internal links ───────────────────────────────────────────────────────
 * Paragraph and list parts shaped { text, href } render as real in-prose links.
 * Every href below must be a route that exists:
 *   /lab-test/varanasi  and its section anchors        (src/data/lab/cities.js)
 *   /lab-test/{deoria,gorakhpur}                       (same)
 *   /blogs/full-body-checkup/varanasi                  (./)
 *   /, /contact
 * The all-cities link grid at the foot of the page is NOT listed here — it is
 * generated from the live city lists so it can never point at a town we have
 * stopped serving.
 *
 * ── Images ───────────────────────────────────────────────────────────────
 * Two: the hero (a lab photograph) plus a booking banner in the section about
 * booking a slot.
 *
 * THE RULE FOR ADDING MORE, and it is the one worth keeping: `src` must be a
 * file that exists in /public. The old blogData.js carried image URLs for
 * /public/blogs/*.webp files that were never added to the repo, which is why
 * the blog page ended up rendering no images at all and the article schema
 * pointed at a 404.
 *
 * The banner below is a brand asset reused here because it is what exists
 * today, and it sits in the one section where it is on topic — beside the
 * booking steps — rather than being sprinkled through the clinical sections,
 * where a stock photo next to a paragraph about NS1 timing would mean nothing.
 *
 * A second banner used to sit in the "Varanasi ke baahar" section: a delivery
 * photograph captioned "test ke baad dawa". It went with the medicine section.
 * An image whose alt text and caption advertise a service the site no longer
 * offers is a topical signal pointing the wrong way — and alt text is read.
 *
 * When Varanasi gets its own photography, drop the files in
 * /public/blogs/varanasi/ and change the `src` strings here — nothing else.
 */
import {
  BLOG_AUTHOR,
  BLOG_PUBLISHER,
  INDEXABLE,
  canonicalFor,
} from "../shared";

/* Link targets, as constants: a route rename is then a one-line fix here
   rather than a hunt through the prose, and a typo shows up as `undefined` in
   the href instead of as a silent 404 in production. */
const LAB_VARANASI = "/lab-test/varanasi";
const LAB_VARANASI_PRICE = "/lab-test/varanasi#lab-test-price-varanasi";
const LAB_VARANASI_FULLBODY = "/lab-test/varanasi#full-body-checkup-varanasi";
const LAB_VARANASI_FEVER = "/lab-test/varanasi#fever-dengue-typhoid-testing-varanasi";
const LAB_VARANASI_PREGNANCY = "/lab-test/varanasi#pregnancy-women-health-tests";
const LAB_VARANASI_BOOK = "/lab-test/varanasi#book";
const LAB_DEORIA = "/lab-test/deoria";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
/* The sibling guide. This article stops at "package me kya hona chahiye" in one
   sentence and hands the subject over — see the de-duplication note at the top
   of ./full-body-checkup-in-varanasi.js for what moved there and why. */
const BLOG_FULLBODY_VARANASI = "/blogs/full-body-checkup/varanasi";
const CONTACT = "/contact";

export const labTestVaranasi = {
  category: "lab-test",
  city: "varanasi",

  /* 39 characters, and it has to stay short: the root layout appends
     " | MedicoBharat" (template in src/app/layout.js), so Google renders 54 —
     just inside the ~60 it will show. Primary keyword first, then the question
     the article actually answers; both survive truncation. */
  title: "Varanasi Me Lab Test — Kaun Sa Test Kab",

  /* ~155 characters, so it renders whole on desktop and mobile. Hinglish on
     purpose — the page is Hinglish and so is the searcher — while keeping the
     English terms that must match: lab test, blood test, full body checkup. */
  description:
    "Varanasi me lab test kaun sa aur kab karayein — symptom, umar aur mausam ke hisaab se poori guide. Fasting ke niyam, full body checkup aur report padhne ka tarika.",

  /* Ordered strongest first. `keywords` is a weak ranking signal on its own —
     the reason to keep it honest is that it is the checklist the headings,
     tables and FAQs below are written against. Every term here appears in the
     visible copy; a keyword that lives ONLY in this array is the kind that
     gets a page filtered rather than ranked. */
  keywords: [
    // Primary
    "Lab Test at Home in Varanasi",
    "Blood Test at Home in Varanasi",
    "Home Sample Collection in Varanasi",
    "Blood Test in Varanasi",
    "Diagnostic Lab in Varanasi",
    "Pathology Lab in Varanasi",
    "Full Body Checkup in Varanasi",
    "Full Body Checkup at Home in Varanasi",
    "Home Collection Lab in Varanasi",
    "Lab Test Near Me in Varanasi",
    // Supporting / Informational
    "How to Book Lab Test at Home in Varanasi",
    "Home Blood Sample Collection in Varanasi",
    "Online Lab Test Booking in Varanasi",
    "Diagnostic Test at Home in Varanasi",
    "Health Checkup at Home in Varanasi",
    "Blood Test Price in Varanasi",
    "Full Body Checkup Price in Varanasi",
    "Blood Test Home Collection Varanasi",
    "Pathology Test at Home in Varanasi",
    "Affordable Lab Test in Varanasi"
  ],

  canonical: canonicalFor("lab-test", "varanasi"),
  robots: INDEXABLE,
  author: BLOG_AUTHOR,
  publisher: BLOG_PUBLISHER,

  publishedAt: "2026-08-03",
  updatedAt: "2026-08-03",

  /* Reading time is stated rather than computed: a number that changes every
     time a sentence is edited is a number nobody maintains. Update it when the
     article grows a section. */
  readingMinutes: 8,

  /**
   * The hero, and the article's only image. It is a lab photograph on a lab
   * page — see the images note at the top of this file.
   *
   * Rendered with `priority`: it is the LCP element, and a lazy-loaded LCP
   * image is the commonest reason a content page fails Core Web Vitals.
   */
  hero: {
    src: "/navheroimage/labtestimg.webp",
    alt: "MedicoBharat ki trained phlebotomist Varanasi me ek patient ke ghar par blood sample le rahi hain",
    caption:
      "Home sample collection: sample ghar par liya jaata hai, report phone par PDF me aati hai.",
  },

  /** The skimmer's version of the whole article. */
  takeaways: [
    "Shikayat se test chuniye, list se nahi — thakan par CBC, wazan/baal par thyroid, pyaas-peshab par sugar aur HbA1c.",
    "Bukhar me din ginna sabse zaroori hai: dengue NS1 sirf pehle 5 din, Widal 5-7 din ke baad. Galat din ka test negative aata hai.",
    "Fasting sirf sugar, lipid aur insulin me chahiye — 10 se 12 ghante, paani peete rahiye. CBC, thyroid aur HbA1c me nahi.",
    "Follow-up test hamesha ek hi lab me karayein — alag lab ki reference range alag hoti hai, isliye number badla hua lagta hai.",
  ],

  sections: [
    {
      id: "varanasi-me-lab-test-guide",
      heading: "Varanasi Me Lab Test: Sawaal Test Ka Nahi, Sahi Test Ka Hai",
      blocks: [
        "Varanasi me lab ki kami nahi hai. Lanka, Sunderpur, Bhelupur, Sigra aur Cantt me har do sau meter par ek collection point mil jaata hai, aur poore Purvanchal se log yahin test karane aate hain. Dikkat isliye \"test kahan karaun\" nahi hai — dikkat ye hai ki parche par jo likha hai uske alawa kya karana chahiye, kab karana chahiye, aur jo report haath me aayi hai usme ghabrane wali baat hai bhi ya nahi.",
        "Neeche symptom ke hisaab se, umar ke hisaab se aur Varanasi ke mausam ke hisaab se ye likha hai ki kaun sa test kab matlab rakhta hai — aur utna hi zaroori, kab wo test bekaar chala jaata hai. Bahut se test sirf isliye dobara karane padte hain kyunki wo galat din par karaye gaye the, na ki isliye ki lab kharab thi.",
        [
          "Booking, poori price list, test menu aur aapke ilaake me collection ka time — wo sab service page par hai: ",
          { text: "Varanasi me lab test aur free home sample collection", href: LAB_VARANASI },
          ". Ye guide uske aage ka hissa hai — test chunna aur report samajhna.",
        ],
      ],
    },

    {
      id: "symptom-ke-hisaab-se-test",
      heading: "Shikayat Ke Hisaab Se: Kaun Sa Test Karayein",
      lead: "Sabse aam shikayat, uska pehla test, aur wo test kyun.",
      blocks: [
        {
          table: {
            caption: "Shikayat se test — pehla step",
            head: ["Shikayat", "Pehla test", "Kyun"],
            rows: [
              [
                "Hamesha thakan, kamzori, chakkar",
                "CBC",
                "Haemoglobin aur blood count. Kam nikle to aage ferritin aur iron studies.",
              ],
              [
                "Wazan badhna/ghatna, baal jhadna, irregular periods",
                "Thyroid Profile (TSH, T3, T4)",
                "Ek TSH se hi tasveer saaf ho jaati hai.",
              ],
              [
                "Zyada pyaas, raat me baar-baar peshab, ghaav der se bharna",
                "Fasting Sugar + HbA1c",
                "HbA1c pichhle 2–3 mahine ka average batata hai, ismein fasting nahi chahiye.",
              ],
              [
                "Aankhon me peelapan, gehra peshab, bhookh khatam",
                "LFT (bilirubin total + direct)",
                "Jaundice ki wajah liver me hai ya nahi, yahi batata hai.",
              ],
              [
                "Paon/chehre par sujan, peshab me jhaag, purana BP",
                "KFT + Urine Routine",
                "Kidney par asar shuru hua ya nahi — sabse pehla ishaara yahin milta hai.",
              ],
              [
                "Haddi-jodon me dard, jhunjhuni, dhundhlapan",
                "Vitamin D + Vitamin B12",
                "Vegetarian gharon me B12 ki kami bahut aam hai.",
              ],
              [
                "3 din se zyada bukhar",
                "CBC + din ke hisaab se dengue/typhoid panel",
                "Test ka din galat hua to report negative aa jaati hai — neeche dekhiye.",
              ],
            ],
          },
        },
        [
          "Ek baat jo table nahi bata sakta: haemoglobin kam nikle to wahin mat rukiye. Iron ki goli haemoglobin to badha degi, lekin agar asli wajah B12 ki kami thi to wo waise hi chalti rahegi. Isi tarah ",
          { text: "pregnancy aur women's health ke panel", href: LAB_VARANASI_PREGNANCY },
          " alag hote hain — unme cycle ka din aur trimester dono maayne rakhte hain.",
        ],
      ],
    },

    {
      id: "umar-ke-hisaab-se-test",
      heading: "Umar Ke Hisaab Se: Saal Me Ek Baar Kya Karayein",
      lead: "Koi shikayat na ho tab bhi — ye saal ka baseline panel hai.",
      blocks: [
        {
          table: {
            caption: "Yearly screening — umar ke hisaab se",
            head: ["Umar", "Har saal", "Ghar me history ho to jodiye"],
            rows: [
              [
                "20–30",
                "CBC, Fasting Sugar, Thyroid Profile, Vitamin D",
                "Vitamin B12",
              ],
              [
                "30–45",
                "Upar wala + Lipid Profile, LFT, KFT",
                "HbA1c",
              ],
              [
                "45+",
                "Upar wala + HbA1c, Urine Microalbumin, Electrolytes",
                "Purushon me PSA (doctor ki salah par), mahilaon me hormone panel",
              ],
            ],
          },
        },
        "Ek baseline report sambhaal kar rakhiye — ye report se zyada keemti cheez hai. Aaj ka number tab kaam aata hai jab paanch saal baad koi value badalti hai aur ye pata karna hota hai ki wo hamesha se aisi thi ya ab hui hai.",
        [
          "In sab ko alag-alag karane se accha ek package me karana hota hai — ek hi sample, kam kharcha, aur saare number ek hi date ke, jinhe aapas me padha ja sake. Package me kaun se test hone chahiye, \"80+ parameters\" ka matlab kya hota hai aur umar ke hisaab se kaun sa level lena chahiye — uski poori guide alag hai: ",
          { text: "Varanasi me full body checkup — kya karayein", href: BLOG_FULLBODY_VARANASI },
          ". Package aur booking ",
          { text: "full body checkup wale section", href: LAB_VARANASI_FULLBODY },
          " par hai.",
        ],
        {
          note: {
            tone: "info",
            title: "Jo koi package nahi karta",
            text: "Pichhli report se milaana. Har report ek folder me rakhiye ya phone me scan kar lijiye. Ek akela HbA1c 6.4 ek number hai; teen saal ka 5.8 → 6.1 → 6.4 ek pattern hai — aur doctor pattern par action leta hai.",
          },
        },
      ],
    },

    {
      id: "bukhar-me-test-ka-din",
      heading: "Bukhar Me Test Ka Din: Yahi Sabse Badi Galti Hai",
      lead: "Sahi test, galat din — report negative aayegi aur ilaaj ek hafta late ho jayega.",
      blocks: [
        "July se November tak Varanasi me dengue, typhoid, malaria aur viral fever tezi se badhte hain. Monsoon ke baad jal-bharav, purane wardon ki ghani basti, aur cooler tatha chhat ki tanki me jama paani machhar ke liye theek conditions bana dete hain. Is season me bukhar aane par sabse badi galti galat din par test karana hai.",
        {
          table: {
            caption: "Bukhar ke test — kis din kaun sa",
            head: ["Test", "Kab karayein", "Kab bekaar hai"],
            rows: [
              [
                "Dengue NS1 Antigen",
                "Bukhar ke din 1 se 5",
                "5ve din ke baad — aksar negative aa jaata hai",
              ],
              [
                "Dengue IgM Antibody",
                "5ve din ke baad",
                "Shuru ke 2–3 din me — antibody abhi bane hi nahi",
              ],
              [
                "Widal (typhoid)",
                "5 se 7 din ka bukhar hone par",
                "Doosre din — titre abhi badhe nahi hote",
              ],
              [
                "Typhidot IgM",
                "Widal se jaldi positive hota hai",
                "—",
              ],
              [
                "Blood Culture",
                "Pehle hafte me — sabse pakka jawab",
                "Antibiotic shuru karne ke baad",
              ],
              [
                "Malaria Antigen + Smear",
                "Thand aur kanpkanpi wale bukhar me, kabhi bhi",
                "—",
              ],
            ],
          },
        },
        {
          note: {
            tone: "warn",
            title: "CBC hamesha saath me",
            text: "Dengue ka koi bhi test ho, CBC zaroor jodiye. Girta hua platelet count aur badhta haematocrit hi wo cheez hai jo doctor roz monitor karta hai — antigen ki report nahi.",
          },
        },
        [
          "Garmi aur monsoon ke baad jaundice Varanasi ka apna pattern hai — paani se failne wale Hepatitis A aur E, khaas kar wahan jahan peene ka paani aur sewage line paas-paas chalti hai. Aankhon ka peelapan aur gehra peshab dikhe to LFT ke saath Hepatitis A IgM aur E IgM karayein. Pregnancy me jaundice ho to turant doctor ko dikhaiye. ",
          { text: "Bukhar ke poore panel ki list yahan hai", href: LAB_VARANASI_FEVER },
          ".",
        ],
      ],
    },

    {
      id: "fasting-aur-taiyari",
      heading: "Fasting Aur Taiyari: Test Se Pehle Kya Karein",
      lead: "Aadhe galat result taiyari ki galti se aate hain, lab ki galti se nahi.",
      blocks: [
        {
          table: {
            caption: "Fasting kis test me chahiye",
            head: ["Fasting chahiye (10–12 ghante)", "Fasting nahi chahiye"],
            rows: [
              [
                "Fasting Blood Sugar, Lipid Profile, Insulin, zyadatar full body package",
                "CBC, Thyroid Profile, HbA1c, Vitamin D, Vitamin B12, Dengue, Typhoid, Urine Routine",
              ],
            ],
          },
        },
        {
          list: [
            "Saada paani peete rahiye — ye allowed hi nahi, zaroori hai. Paani ki kami haemoglobin, urea aur creatinine ko jhoothe taur par badha deti hai.",
            "Raat ka khaana 9 baje tak khatam kijiye aur subah 7 se 9 ka slot lijiye. 14 ghante se zyada faaka result bigadta hai, sudharta nahi.",
            "Sharaab lipid profile aur LFT se 24 ghante pehle bilkul band — ek shaam ki peene se triglycerides aur liver enzymes kaafi badh jaate hain.",
            "CPK, LDH ya KFT se ek din pehle heavy gym avoid kijiye — tez exercise se muscle enzymes aur creatinine badh jaate hain.",
            "Thyroid ki goli blood nikalne ke BAAD lijiye, pehle nahi — warna T4 jhootha hi zyada dikhega aur dose galat adjust ho sakta hai.",
            "Biotin ya multivitamin supplement kisi bhi hormone test se 48–72 ghante pehle band kar dijiye — biotin assay me interfere karta hai.",
          ],
        },
        "Baaki regular dawaiyan usi samay par lijiye jab tak doctor mana na kare, aur phlebotomist ko bata dijiye ki aap kya-kya le rahe hain.",
      ],
    },

    {
      id: "home-collection-kaise-hota-hai",
      heading: "Ghar Par Sample Dena: Process Aur Do Cheezein Jo Khud Dekhein",
      image: {
        src: "/callimg/contactimg.webp",
        alt: "MedicoBharat par call ya online booking se Varanasi me ghar par lab test ka slot book karne ka banner",
        caption:
          "Slot subah 6 baje se milte hain — fasting test ke liye pehla slot sabse aasan padta hai.",
      },
      blocks: [
        {
          list: [
            "Test ya package chuniye, Varanasi ka address landmark ke saath likhiye, subah ka slot select kijiye, confirm kar dijiye.",
            "Trained phlebotomist ID card ke saath aata hai. Poori visit lagbhag 10 minute ki hoti hai.",
            "Report 24 ghante me PDF me aa jaati hai. Home collection ka koi alag charge nahi hai.",
          ],
        },
        {
          note: {
            tone: "warn",
            title: "Collection ke waqt khud dekh lijiye",
            text: "Ek — needle aapke saamne khule; pehle se nikli hui needle par sawaal poochne me kuch galat nahi hai. Do — tube par naam aur test list wahin verify ho jaaye, lab pahunchne ke baad nahi.",
          },
        },
        [
          "Purane sheher ki tangg galiyon me — Chowk, Godowlia aur ghaton ke aas-paas, jahan char pahiya gaadi ja hi nahi sakti — collection two-wheeler se hoti hai. Isliye location theek se pin kijiye aur ek landmark zaroor likhiye. Ghar ke teen-chaar log ek saath test kara rahe hain to sabka sample ek hi slot me book kijiye. ",
          { text: "Booking form yahan hai", href: LAB_VARANASI_BOOK },
          " — parcha ho to upload kar dijiye, taaki wahi panel process ho jo doctor ne likha tha.",
        ],
        "Ghar me koi bujurg hai, bed-rest par hai, diabetic hai jinki vein patli ho gayi hai, ya operation ke baad recovery kar raha hai — booking ke waqt ye likh dijiye. Isse experienced phlebotomist bheja ja sakta hai aur do baar sui lagne ki nobat nahi aati.",
      ],
    },

    {
      id: "report-kaise-padhein",
      heading: "Report Aa Gayi — Ab Ise Kaise Padhein",
      blocks: [
        "Pehla niyam: report ke saath chhapi reference range padhiye, internet ke chart se mat milaiye. Range method ke hisaab se, umar ke hisaab se aur ling ke hisaab se badalti hai — isi wajah se ek hi test ki do labs ki report ka \"normal\" alag dikh sakta hai, aur dono sahi ho sakti hain.",
        "Doosra niyam: High ya Low ka flag diagnosis nahi hai, doctor se milne ka ishaara hai. Thoda sa range se bahar hona bahut aam hai aur aksar harmless — jaise haal me hui sardi ke baad halka ESR badha hona, ya Gilbert's syndrome me thoda bilirubin badha rehna, jo poori tarah benign hai.",
        {
          table: {
            caption: "Report kab tak aati hai",
            head: ["Test", "Turnaround"],
            rows: [
              ["CBC, Sugar, Lipid, LFT, KFT, Thyroid, Urine", "Lagbhag 24 ghante"],
              ["Vitamin aur hormone assay", "Lagbhag 24 ghante"],
              ["Urine ya Blood Culture", "48 se 72 ghante"],
            ],
          },
        },
        "Culture jaan-boojh kar dheeme hote hain: pehle organism ko ugana padta hai, tabhi antibiotic sensitivity nikalti hai. Koi bhi lab isse jaldi ka imaandari se vaada nahi kar sakti.",
        {
          note: {
            tone: "warn",
            title: "Ye result appointment ka intezaar nahi maangte",
            text: "Tezi se girta platelet count, bahut zyada blood sugar ke saath ulti ya susti, khatarnak had tak kam haemoglobin, ya bahut badha creatinine ke saath peshab ka kam hona — inme usi din doctor chahiye. Tabiyat kharab lag rahi ho to kisi call ka intezaar mat kijiye.",
          },
        },
        [
          "Report aa jaane ke baad agla kadam use doctor ko dikhana hai — PDF WhatsApp par rehti hai, isliye forward kar dena hi kaafi hai. Purani report bhi phone me sambhal kar rakhiye: doctor ko badlav dekhna hota hai, sirf aaj ka number nahi. Saal ka routine checkup planning kar rahe hain to ",
          { text: "full body checkup me kya hona chahiye", href: BLOG_FULLBODY_VARANASI },
          " pehle padh lijiye.",
        ],
      ],
    },

    {
      id: "lab-kaise-chunein-varanasi",
      heading: "Varanasi Me Lab Chunte Waqt Kya Poochhein",
      blocks: [
        {
          list: [
            "Lab kitne saal se chal rahi hai — quality control waqt ke saath hi banta hai.",
            "Report par test ka METHOD likha jaata hai ya nahi (jaise CLIA ya ECLIA). Method chhapna is baat ka sabse saaf sanket hai ki lab ko apne number par bharosa hai.",
            "Quoted price usi method ka hai ya nahi — CLIA aur ECLIA purane ELISA se mehnge padte hain lekin hormone ke liye zyada reliable hain.",
            "Home collection ka charge sach me nahi hai, ya bill ke aakhir me jud jaayega.",
          ],
        },
        "Jo test ₹150 sasta pada lekin dobara sahi lab me karana pade, wo sasta nahi tha. Isi tarah, jo report doctor ke samajh me na aaye kyunki usme method aur range nahi likhi — wo report nahi, ek kagaz hai.",
        {
          note: {
            tone: "info",
            title: "Follow-up test ek hi lab me",
            text: "Alag analyser aur alag method ki reference range thodi alag hoti hai, isliye ek lab me TSH 4.5 aur doosri me 4.1 aane ka matlab ye nahi ki thyroid badal gaya. HbA1c, TSH, creatinine aur ferritin jaise number jo aap mahino track kar rahe hain — unke liye lab badalna sabse bada confusion paida karta hai.",
          },
        },
        [
          "Rate ki poori list ek hi jagah rakhi hai, taaki number sirf ek jagah maintain ho aur kabhi purana na pade: ",
          { text: "Varanasi me lab test ka price range", href: LAB_VARANASI_PRICE },
          ".",
        ],
      ],
    },

    {
      id: "varanasi-ke-baahar",
      heading: "Varanasi Ke Baahar Se Aa Rahe Hain To Yeh Padhiye",
      blocks: [
        "Chandauli, Jaunpur, Ghazipur, Mirzapur, Bhadohi, Ballia aur Azamgarh se roz log Varanasi aate hain — kyunki specialist doctor, tertiary hospital aur bade diagnostic setup yahin hain. Lekin ek baat saaf samajh lijiye: safar sirf tab zaroori hai jab baat imaging ya procedure ki ho — MRI, CT scan, angiography, endoscopy, biopsy — ya kisi super-speciality OPD ki. Ye machine aur doctor par hote hain, sample par nahi.",
        "Parche par sirf blood aur urine ke test likhe hain — CBC, sugar, thyroid, liver, kidney, lipid, vitamin, dengue — to unke liye Varanasi aane ki koi zaroorat nahi. Ye sab sample par hote hain, aur sample aapke apne sheher me liya ja sakta hai.",
        [
          "Aur agar trip specialist ke liye hai, to blood test us trip se PEHLE apne ghar par karwa lijiye. Report haath me le kar jaayenge to ek hi visit me baat ban jaayegi, warna doctor test likh kar agli date de dega aur ek poora din dobara lagega. Deoria aur aas-paas ke logon ke liye yahi suvidha wahin hai — ",
          { text: "Deoria me lab test aur home sample collection", href: LAB_DEORIA },
          ".",
        ],
      ],
    },

    {
      id: "aage-kya-karein",
      heading: "Chhoti Si Checklist",
      blocks: [
        {
          list: [
            "Parche ka poora test naam booking me daaliye — \"Thyroid Profile Total\" aur \"Free\" alag test hain, aur naam milte-julte hone ki wajah se yahi sabse zyada galat book hota hai.",
            "Fasting chahiye ya nahi, pehle pooch lijiye, aur raat ka khaana us hisaab se rakhiye.",
            "Bukhar ka test hai to din giniye — NS1 pehle 5 din, Widal 5ve din ke baad.",
            "Report aane par pichhli report nikaliye aur dono ko saath rakhiye.",
            "Koi number ghabrane wala lage to khud faisla mat kijiye — doctor ko dikhaiye.",
          ],
        },
        [
          "Booking me ya test chunne me confusion ho to ",
          { text: "humein call kar lijiye", href: CONTACT },
          "; parche ke hisaab se sahi panel batana isi kaam ka hissa hai.",
        ],
      ],
    },
  ],

  /* Questions a Varanasi reader actually types, and deliberately NOT the ones
     already answered on the service page (jaise "kya home collection free
     hai", "kitne baje slot milta hai"). Two FAQ blocks answering the same
     question on one domain compete with each other for the same rich result. */
  faqs: [
    {
      question: "Varanasi me blood test se pehle kitne ghante fasting karni chahiye?",
      answer:
        "Fasting blood sugar, lipid profile, insulin aur zyadatar full body package ke liye 10 se 12 ghante. Saada paani peete rahiye — paani ki kami haemoglobin, urea aur creatinine ko jhoothe taur par badha deti hai. CBC, thyroid, HbA1c, vitamin D, B12, dengue aur urine routine ke liye fasting ki zaroorat nahi hoti. 14 ghante se zyada faaka karne se result bigadta hai, sudharta nahi.",
    },
    {
      question: "Bukhar aaya hai — dengue ka test kis din karana chahiye?",
      answer:
        "Dengue NS1 antigen sirf bukhar ke pehle 1 se 5 din me bharosemand hai. Paanchve din ke baad NS1 aksar negative aa jaata hai aur tab Dengue IgM antibody karana chahiye. Dono me se koi bhi test ho, saath me CBC zaroor karayein — platelet count aur haematocrit hi wo cheez hai jo doctor roz monitor karta hai. Typhoid ke Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye.",
    },
    {
      /* This slot used to ask "full body checkup me kam se kam kaun se test
         hone chahiye". That question now has its own article and its own FAQ
         at /blogs/full-body-checkup/varanasi, and two FAQPage nodes on one
         domain answering one question compete for one rich result — so this
         one moved back into this article's own lane. */
      question: "Haemoglobin kam aaya hai — sirf iron ki goli kaafi hai?",
      answer:
        "Nahi. Haemoglobin kam aane par wahin rukna sabse aam galti hai. Iron ki goli haemoglobin to badha degi, lekin agar asli wajah vitamin B12 ki kami thi to wo waise hi chalti rahegi aur kuch mahine baad number phir gir jaayega. Kam haemoglobin par ferritin, iron studies aur vitamin B12 karana chahiye, taaki kami ki wajah pata chale. Purvanchal me auraton aur teenage ladkiyon me anaemia bahut aam hai, aur vegetarian gharon me B12 ki kami usse bhi aam.",
    },
    {
      question: "Thyroid ki dawa lene wale log test se pehle goli lein ya baad me?",
      answer:
        "Blood nikalne ke BAAD lein. Test se pehle thyroxine lene par T4 jhootha hi zyada dikhega aur dose galat adjust ho sakta hai. Iske alawa biotin ya multivitamin supplement kisi bhi hormone test se 48 se 72 ghante pehle band kar dena chahiye, kyunki biotin assay me interfere karta hai. Baaki regular dawaiyan usi samay par leni chahiye jab tak doctor mana na kare.",
    },
    {
      question: "Report me High ya Low likha hai — kya ghabrane ki baat hai?",
      answer:
        "Flag diagnosis nahi, doctor se milne ka ishaara hai. Thoda sa range se bahar hona bahut aam hai aur aksar harmless — jaise sardi ke baad halka ESR badha hona. Lekin kuch result usi din doctor maangte hain: tezi se girta platelet count, bahut zyada blood sugar ke saath ulti ya susti, khatarnak had tak kam haemoglobin, ya bahut badha creatinine ke saath peshab ka kam hona. Report ke saath chhapi reference range hi padhiye, internet ke chart se mat milaiye.",
    },
    {
      question: "HbA1c kitne mahine me dohrana chahiye?",
      answer:
        "Jinhe diabetes hai unhe har teen mahine me HbA1c karana chahiye, saal me ek baar lipid profile, aur saal me ek baar kidney function ke saath urine microalbumin. Urine microalbumin sabse pehla ishaara deta hai ki diabetes kidney par asar daal raha hai — aur yahi test log sabse zyada chhodte hain. Jinhe diabetes nahi hai lekin ghar me history hai, unke liye saal me ek baar kaafi hai.",
    },
    {
      question: "Har baar alag lab me test karane se farq padta hai kya?",
      answer:
        "Haan, jab aap kisi number ko mahino tak track kar rahe hain. Alag analyser aur alag method ki reference range thodi alag hoti hai, isliye ek lab me TSH 4.5 aur doosri me 4.1 aane ka matlab ye nahi ki thyroid badal gaya. HbA1c, TSH, creatinine aur ferritin jaise follow-up test ke liye hamesha ek hi lab par tike rahiye.",
    },
    {
      question: "Chowk aur Godowlia ki galiyon me bhi home collection aati hai?",
      answer:
        "Haan. Jahan char pahiya gaadi nahi ja sakti, wahan collection two-wheeler se hoti hai. Booking karte waqt location theek se pin kijiye aur ek landmark zaroor likhiye — purane sheher me address se zyada landmark kaam aata hai. Ghar ke kai log test kara rahe hain to sabka sample ek hi slot me book kar dijiye.",
    },
    {
      question: "Varanasi ke bahar se aa rahe hain to blood test yahin karayein ya apne sheher me?",
      answer:
        "Blood aur urine ke saare routine test sample par hote hain, isliye unke liye Varanasi aane ki zaroorat nahi — apne sheher me karwa lijiye. Varanasi aana tab banta hai jab MRI, CT scan, endoscopy jaisi imaging ho ya kisi specialist ki OPD me dikhana ho. Aisi trip se pehle blood test ghar par karwa lena behtar hai, taaki report pehle se haath me ho aur ek hi visit me kaam ban jaaye.",
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
      "Is guide me test chunna aur report samajhna hai. Booking, price aur poora test menu service page par hai.",
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
            href: LAB_VARANASI_FULLBODY,
            label: "Full body checkup me kya-kya hona chahiye",
          },
          {
            href: LAB_VARANASI_FEVER,
            label: "Dengue, typhoid aur jaundice ka poora panel",
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
            href: LAB_DEORIA,
            label: "Deoria me lab test",
            sub: "Gorakhpur ka safar bachane wala option",
          },
        ],
      },
      {
        title: "Doosre Guide",
        links: [
          {
            href: BLOG_FULLBODY_VARANASI,
            label: "Varanasi me full body checkup — kya karayein",
            sub: "Package me kya hona chahiye, umar ke hisaab se kaun sa level",
          },
          {
            href: "/",
            label: "Sabhi lab test aur rate list",
            sub: "Har sheher me wahi rate — ek hi page par",
          },
          { href: CONTACT, label: "Contact — booking aur test chunne me madad" },
        ],
      },
    ],
  },
};
