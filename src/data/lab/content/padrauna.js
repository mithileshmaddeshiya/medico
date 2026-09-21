/**
 * /lab-test/padrauna — the town's long-form copy and its FAQs.
 *
 * ── WHY THIS PAGE EXISTS SEPARATELY FROM /lab-test/kushinagar ────────────
 * Padrauna is the district headquarters of Kushinagar, and the Kushinagar page
 * already names it — the same relationship Salempur has with Deoria, only
 * sharper, because the demand here is bigger than the district page can hold.
 * Two pages for one district only work when they argue DIFFERENT things, so the
 * split is drawn on purpose and it is drawn on the reader, not on the noun:
 *
 *   /lab-test/kushinagar is written for the DISTRICT — the reader in Khadda,
 *   Tamkuhi Raj, Sewrahi or Nebua Naurangia who is 20–45 km from the nearest
 *   collection counter. Its arguments are distance, the sugarcane season, the
 *   Gandak's flood weeks, and the AES warning. None of those are repeated here.
 *
 *   THIS page is written for the reader who is INSIDE Padrauna town, where the
 *   counters actually are. Distance is not their problem; a counter within
 *   walking reach is. So this page argues the four things a town reader
 *   actually weighs, and each is this page's own:
 *
 *     1. A collection counter is not a laboratory. The sample travels to a city
 *        lab whichever door it starts from — so starting from your own costs
 *        nothing in reliability and saves the morning.
 *     2. The morning. Fasting tests collide with the bazaar opening, the
 *        tehsil and collectorate hours, school and the district hospital OPD
 *        queue. A 6 AM slot at home is the only version that fits.
 *     3. How to judge a lab without believing a boast — the "best diagnostic
 *        centre" search, answered with checkable questions instead of a claim.
 *     4. Women's tests in a small town, where the person who most needs a
 *        haemoglobin or thyroid test is the one least likely to spend half a
 *        day in a queue for it.
 *
 * The mohalla section (Durga Chowk, Bank Road, Station Road, Ramkola Road,
 * Kasia Road, Tarya Sujan) is the other half of the separation: the district
 * page lists TOWNS, this one lists STREETS. If this file ever gets edited into
 * a restatement of the district page's argument, delete the entry in
 * src/data/lab/cities.js rather than keep both — one filtered page and one
 * ranking page is the likeliest outcome of two pages saying the same thing.
 *
 * ── AES IS DELIBERATELY NOT RE-ARGUED HERE ───────────────────────────────
 * The district page carries the encephalitis warning in full, because that is
 * the section that must never be softened. Repeating it here would duplicate
 * the most safety-critical copy on the site across two URLs, where the two
 * versions can drift apart. Instead the fever section below states the rule in
 * two lines and LINKS to the district page's section. Keep it that way.
 *
 * ── CLAIMS ───────────────────────────────────────────────────────────────
 * Only the confirmed set: free home collection, a trained phlebotomist with an
 * ID card, slots from 6 AM, reports within 24 hours, cash/UPI at collection, a
 * confirmation call in about 30 minutes, a visit of about 10 minutes. NOT
 * claimed anywhere, however well it would rank: NABL accreditation,
 * pathologist verification, cold-chain transport, barcoded tubes, a lab open 24
 * hours, or a walk-in counter of ours anywhere in Padrauna. There is none, and
 * this page says so in plain words rather than letting a reader assume one.
 *
 * "Best diagnostic centre in Padrauna" is a real search and it is answered — in
 * ONE section and ONE FAQ, both of which refuse the boast and give the reader
 * checkable tests instead. Do not move that phrase into the body copy as a
 * claim about us. Same rule as content/gopalganj.js and content/lucknow.js.
 *
 * Clinically only the uncontroversial: dengue NS1's 1–5 day window, Widal
 * needing 5–7 days of fever, HbA1c quarterly for a diabetic, urine
 * microalbumin as the earliest diabetic-kidney signal, B12 deficiency being
 * common on a vegetarian diet, TSH repeated 6–8 weeks after a dose change.
 *
 * ── PRICES ───────────────────────────────────────────────────────────────
 * The rate list appears in the price section, the price FAQ and the Hindi
 * section, and all three must match defaultTests() in src/data/lab/defaults.js.
 * Grep this file before any price edit.
 *
 * ── SECTION IDS ──────────────────────────────────────────────────────────
 * Every `id` below is an anchor target and some are linked from
 * src/data/lab/cities.js. Renaming one breaks those links silently, with no
 * build error. Grep the id before changing it.
 */

const LAB_KUSHINAGAR = "/lab-test/kushinagar";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_DEORIA = "/lab-test/deoria";
const AES_SECTION = `${LAB_KUSHINAGAR}#bachchon-me-dimaagi-bukhar-kushinagar`;

/* The guides that exist under content/blogs/deoria/ — this belt's own reading.
   Every href here is checked against a real file; a guide folder for Padrauna
   does not exist yet, and linking to one that does not would be a 404 in the
   body copy of a brand-new page. */
const GUIDE_LAB_TEST = "/blogs/lab-test/deoria";
const GUIDE_PATHOLOGY = "/blogs/pathology-lab/deoria";
const GUIDE_HOME_COLLECTION = "/blogs/home-sample-collection/deoria";
const GUIDE_FULL_BODY = "/blogs/full-body-checkup/deoria";
const GUIDE_DIABETES = "/blogs/diabetes-thyroid-test/deoria";
const GUIDE_LIVER_KIDNEY = "/blogs/liver-kidney-test/deoria";
const GUIDE_VITAMIN = "/blogs/vitamin-b12-d-test/deoria";
const GUIDE_DENGUE = "/blogs/dengue-typhoid-test/deoria";

export const padraunaContent = [
  {
    id: "lab-test-in-padrauna",
    h: "Padrauna Me Lab Test — Ghar Baithe Blood Test Booking Aur Free Home Sample Collection",
    p: [
      "Padrauna Kushinagar jile ka mukhyalaya hai, aur jile me jaanch se judi har cheez yahin hai — zila aspatal, doctor ki clinic, aur bazaar me khule collection counter. Isliye yahan rehne wale reader ki dikkat doori nahi hai. Uski dikkat samay hai. Parcha shaam ko milta hai, test khaali pet ka hota hai, aur agli subah wahi ghanta test ke liye dena padta hai jis ghante me dukaan kholni hai, bachche ko school bhejna hai, ya tehsil aur kacheri ka kaam nipatana hai. Report lene ke liye doosre din phir ek chakkar lagta hai.",
      "Home sample collection ye poora ghanta wapas de deta hai. Aap Padrauna me apna pata aur mohalla dete hain, subah ka slot chunte hain, aur trained phlebotomist ID card ke saath aapke darwaze par aata hai. Sample wahin liya jaata hai, poori visit lagbhag 10 minute ki hoti hai, aur report 24 ghante ke andar WhatsApp aur email par PDF me aa jaati hai. Na line, na khaali pet ka safar, na report lene ka doosra chakkar.",
      "Yahan routine pathology ke saare test aur health package book hote hain — CBC, Thyroid Profile (TSH), Blood Sugar, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test, Vitamin D, Vitamin B12, Dengue, Urine Routine aur Full Body Checkup. Doctor ka parcha hai to usi panel ke hisaab se booking ho jaati hai; koi test is page par naam se na dikhe to parche ke saath ek call kar lijiye.",
      [
        "Ek baat naam ki. Jila Kushinagar hai aur mukhyalaya Padrauna — do alag kasbe hain, ek hi jile me. Ye page Padrauna sheher ke liye hai: yahan ke mohalle, yahan ke landmark, yahan ki subah. Aap Khadda, Tamkuhi Raj, Sewrahi, Nebua Naurangia ya Kasia ki taraf rehte hain to ",
        { text: "Kushinagar jile wala page", href: LAB_KUSHINAGAR },
        " aapke kaam ka hai — service dono jagah wahi hai, bas wahan ka hisaab doori ka hai aur yahan ka samay ka.",
      ],
    ],
  },

  {
    /* "Padrauna me pathology lab", "diagnostic center in Padrauna", "medical
       laboratory", "blood test lab near me" — chaaron ka intent ek hai: jaana
       kahan padega. Is page ka jawab jile wale page se alag hona chahiye, aur
       hai: wahan tark doori ka hai, yahan ye ki counter aur lab do alag cheezein
       hain. Ye baat sheher ke reader ke liye hi maayne rakhti hai, kyunki uske
       paas counter to hai. */
    id: "pathology-lab-diagnostic-center-padrauna",
    h: "Padrauna Me Pathology Lab, Diagnostic Centre Ya Medical Laboratory Dhoondh Rahe Hain?",
    p: [
      "Pehle ek baat saaf: hamara koi walk-in counter Padrauna me nahi hai, aur is page par kahin ye nahi likha jaayega ki hai. Ye home collection service hai — hum aapke ghar se sample lete hain, aur wahi sach hai jo yahan likha hai.",
      "Ab wo baat, jo sheher me rehne wale ko sabse zyada kaam aati hai: collection counter aur laboratory ek cheez nahi hain. Bazaar me, Bank Road par ya zila aspatal ke aas-paas jo chhote centre dikhte hain, unme se zyadatar sirf sample lete hain. Jaanch badi lab me hoti hai — aksar Gorakhpur ya usse aage — aur report wahin se banti hai. Yaani sample ko safar to karna hi hai. Sawaal sirf itna hai ki us safar ki shuruaat aapke ghar se ho, ya aapke taiyaar hone, chalne, line lagane aur wapas aane ke baad.",
      [
        "Blood aur urine ke saare aam test sirf sample par hote hain, isliye ghar se shuruaat karna kisi tarah kam bharosemand nahi hai — bas ek subah bach jaati hai. Darwaze par kya hota hai, kaun sa test ghar par ho jaata hai aur kaun sa nahi, ye poora ",
        { text: "ghar par sample wali guide", href: GUIDE_HOME_COLLECTION },
        " me likha hai.",
      ],
      "Jo test ghar par nahi ho sakte, unke baare me bhi saaf rehna theek hai: X-ray, sonography, CT, MRI, endoscopy aur biopsy machine aur doctor par hote hain, sample par nahi. Inke liye aapko jaana hi padega — Padrauna me ya Gorakhpur me. Ye page unke liye nahi hai, aur hum unhe book karne ka daawa nahi karte.",
      "Ek aadat jo sheher me sabse zyada nuksan karti hai: jo test aap mahino tak dohrate hain — HbA1c, TSH, creatinine, haemoglobin — unhe har baar alag alag jagah se mat karaiye. Alag machine aur method ke reference range thode alag hote hain, isliye ek jagah TSH 4.5 aur doosri jagah 4.1 aane ka matlab ye nahi ki thyroid badal gaya. Doctor badlav dekhta hai, sirf aaj ka number nahi.",
    ],
  },

  {
    /* "Best diagnostic center in Padrauna" ek asli search hai aur iska jawab
       dena chahiye — lekin daawa kar ke nahi. Ye section aur iska FAQ hi wo do
       jagah hain jahan ye shabd is page par aata hai, aur dono jagah jawab
       jaanchne layak sawaalon me badal diya gaya hai. Wahi niyam jo
       content/gopalganj.js aur content/lucknow.js par hai. */
    id: "best-diagnostic-center-padrauna",
    h: "Padrauna Me Best Diagnostic Centre Kaise Chunein — Paanch Sawaal Jo Poochh Lene Chahiye",
    p: [
      "Hum ye nahi kahenge ki hum Padrauna ke sabse achhe hain. Koi bhi lab ye keh sakti hai aur koi bhi ise jaanch nahi sakta — isliye is jumle ki keemat zero hai. Jo jaanchi ja sakti hai wo ye paanch cheezein hain, aur yahi poochh kar aap kisi bhi lab ko park sakte hain, hamein bhi.",
      "Pehla: daam pehle bataya jaata hai ya sample lene ke baad? Is page par har test ka price card par likha hai, home collection uske upar free hai, aur poora amount confirmation call par bata diya jaata hai — sui lagne se pehle, uske baad nahi. Doosra: sample lene wala kaun hai aur uske paas pehchan hai? Aane wale phlebotomist ke paas ID card hota hai; use dekh lena aapka haq hai, aur sample aapke saamne liya jaata hai.",
      "Teesra: report kab tak milegi, saaf shabdon me? Hamara jawab routine test ke liye 24 ghante hai. Culture 48 se 72 ghante lete hain kyunki organism pehle ugana padta hai — jo lab isse jaldi ka vaada kare, wo ya to culture nahi samajh rahi ya aapko sahi nahi bata rahi. Chautha: report par reference range aur test ka poora naam chhapa hai ya sirf ek number? Number bina range ke bekaar hai. Paanchva: jo lab keh rahi hai wo likh kar de rahi hai ya sirf bol rahi hai? WhatsApp par aayi PDF ek record hai; mooh-zubani rate nahi.",
      "Aur ek cheez par bharosa mat kijiye: bade daam par. Mehnga hona quality ka saboot nahi hai, aur sabse sasta hona bhi nahi. Ek hi test do jagah se karaane par report ke number thode alag aa sakte hain — ye dhokha nahi, method ka farq hai. Isliye lab chunne ka sabse achha tarika yahi hai ki ek chuniye aur usi par tike rahiye, taaki aapka doctor purani aur nayi report ko seedha mila sake.",
    ],
  },

  {
    /* Is page ka apna hissa aur jile wale page se sabse saaf farq: wahan
       KASBON ki list hai, yahan MOHALLON aur SADKON ki. Landmark ke naam wahi
       hain jo log khud pata likhte waqt likhte hain. */
    id: "mohalla-home-collection-padrauna",
    h: "Durga Chowk, Bank Road, Station Road Aur Ramkola Road — Padrauna Ke Mohallon Me Home Sample Collection",
    p: [
      "Sheher me collection Padrauna ke lagbhag har mohalle me hoti hai. Durga Chowk aur uske aas-paas ki galiyan, Central Bank Road, Station Road, Ramkola Road ki taraf ka ilaaka, Kasia Road, Tarya Sujan ki taraf, zila aspatal aur tehsil ke aas-paas ka hissa, purani bazaar aur naye banne wale mohalle — sab ismein aate hain. Sheher se sate gaon aur Ramkola, Hata, Sewrahi tatha Captainganj jaise kareebi kasbe bhi aam taur par cover hote hain.",
      "Padrauna me pata likhne ka tarika ek khaas wajah se maayne rakhta hai: yahan ghar ka number aksar kaam nahi aata, landmark aata hai. Isliye mohalle ke naam ke saath ek aisi jagah likhiye jo har kisi ko pata ho — Durga Chowk, Central Bank ki branch, station, petrol pump, koi mandir ya masjid, school, tehsil ya zila aspatal ka gate. \"Bank Road, Durga Chowk se do sau meter aage, medical store ke upar wali manzil\" jaisa pata sabse tez kaam karta hai; \"makan number 14, Padrauna\" sabse dheere.",
      "Galiyon me ek aur cheez hoti hai jo late visit ki asli wajah banti hai — ek hi naam ki do jagah, ya wo mod jo Google Maps par nahi dikhta. Booking ke waqt ye keh dena kaafi hota hai ki kis taraf se mudna hai. Mobile number wahi dijiye jo us waqt chalu rahega, aur ho sake to ghar ke kisi doosre vyakti ka number bhi likh dijiye.",
      [
        "Aapka mohalla ya gaon is list me naam se nahi hai to maan kar mat baithiye ki service nahi hai — ek call kar lijiye. Cover hota hai to usi call par slot book ho jaayega, aur nahi hota to hum saaf bata denge, taaki aap intezaar kar ke pareshan na hon. Number aur poora pata ",
        { text: "contact page", href: "/contact" },
        " par hai.",
      ],
      "Ghar me ek se zyada log test kara rahe hain — maa-baap, dada-dadi, bachche — to sabki booking ek hi slot me kar dijiye. Ek hi visit me sabka sample ho jaata hai, aur package walon ka fasting bhi ek saath nikal jaata hai.",
    ],
  },

  {
    /* Sheher ke reader ki asli lagat: aadha ghanta nahi, subah ka wo ghanta jo
       kisi aur kaam ka hai. Jile wale page ka tark doori ka hai, ye samay ka —
       dono kabhi ek jaise nahi padhne chahiye. */
    id: "subah-ka-samay-padrauna",
    h: "Dukaan, Bazaar, Tehsil Aur School Ki Subah — Fasting Test Ke Liye 6 Baje Ka Slot",
    p: [
      "Padrauna ki subah tay hai. Bazaar aur dukaanein ek samay par khulti hain, tehsil, kacheri aur bank ka apna waqt hai, school ki gaadi apne waqt par aati hai, aur zila aspatal ki OPD me line usse bhi pehle lag jaati hai. Fasting wala test theek isi khidki me girta hai — aur yahi wajah hai ki likha hua test hafton tak nahi hota. Paisa nahi rukta, ghanta rukta hai.",
      "Home visit ke slot subah 6 baje se shuru hote hain, aur sheher me iska faayda seedha hai: sample ghar par ho jaata hai, aap turant naashta kar lete hain, aur dukaan ya daftar apne samay par khulti hai. Dukaan chalane walon ke liye ye khaas kar kaam ka hai — counter chhod kar do ghante nikalna aksar test ke daam se mehnga padta hai.",
      "Fasting ka niyam bhi isi hisaab se sochiye: 10 se 12 ghante kuch nahi khana hai, saada paani peena hai. Raat ka khana 9 baje tak khatam kar lijiye aur 6 se 8 baje ke beech ka slot lijiye. 14 ghante se zyada bhookhe rehna faayda nahi karta, nuksan karta hai — aur din bhar khaali pet dukaan par baithna to bilkul nahi.",
      "Sarkari naukri, school ke teacher, bank aur court se jude log ek aur galti karte hain: chhutti ke din ka intezaar. Isse test mahine bhar aage khisak jaata hai. Kaam wale din ki subah ka slot lijiye — visit 10 minute ki hai, aur report shaam tak ya agli subah tak phone par aa jaati hai, jise aap kahin se bhi doctor ko forward kar sakte hain.",
    ],
  },

  {
    id: "online-blood-test-booking-padrauna",
    h: "Padrauna Me Online Blood Test Booking — Form Bhariye Ya Ek Phone Call Kijiye",
    p: [
      "Booking ke do hi tarike hain aur dono seedhe hain. Is page par apna test ya package chuniye aur booking form bhar dijiye — naam, mobile number, mohalla ya gaon, aur ek landmark. Ya seedha phone kar dijiye. Online blood test booking ka matlab yahan yahi hai: aap apna slot online chunte hain, baaki sab aapke darwaze par hota hai.",
      "Booking ke baad confirm karne ke liye call aam taur par 30 minute ke andar aati hai. Us call par teen cheezein tay hoti hain — slot, poora pata, aur ye ki test me fasting chahiye ya nahi. Poora amount bhi usi call par bata diya jaata hai, sample lene se pehle.",
      "Doctor ka parcha hai to uska photo booking ke waqt bhej dijiye. Test ke naam milte julte hote hain — Thyroid Profile Total aur Free, Sugar Fasting aur PP, Widal aur Typhidot, LFT aur KFT ke saath urine microalbumin — aur parche ka photo hone par ye galti hoti hi nahi. Parche par \"full body\" bina detail ke likha hai to bhi photo bhej dijiye; package me kya kya aata hai wo bata diya jaayega.",
      "Payment sample lene ke waqt hota hai — cash ya UPI se, PhonePe, Google Pay ya Paytm. Uske baad aapko kuch nahi karna: report taiyaar hone par WhatsApp aur email par PDF khud aa jaayegi.",
      "Aap Padrauna se bahar rehte hain aur ghar walon ka test karana hai to bhi booking aap hi kar sakte hain. Ghar ka pata, landmark, aur wahan maujood kisi ka chalu number dijiye, aur bata dijiye ki confirmation call kis number par aani chahiye — apne number par bhi karwa sakte hain.",
    ],
  },

  {
    /* Chhote sheher me mahilaon ki jaanch sabse zyada taali jaati hai, aur wajah
       aksar paisa nahi — bahar nikalne aur line me lagne ka intezaam hoti hai.
       Ye section is page ka apna hai; jile wale page par nahi hai. Deoria ke
       anaemia wale section se overlap se bachne ke liye yahan tark alag hai:
       wahan kaun sa test, yahan kyun rah jaata hai aur kaise poora hota hai. */
    id: "mahilaon-ki-jaanch-padrauna",
    h: "Padrauna Me Women Health Checkup — Wo Jaanch Jo Ghar Ki Auraton Ki Sabse Zyada Taali Jaati Hai",
    p: [
      "Ghar me sabse zyada test us vyakti ka rukta hai jo sabse kam shikayat karta hai. Thakan, chakkar, saans phoolna, kamzori, baal jhadna, vajan ka badhna ya ghatna — inhe \"kaam ki thakan\" keh kar saal nikal jaata hai. Aur jab test likha bhi jaata hai, to sheher me bhi ek dikkat rehti hai: bahar jaana, kisi ko saath le jaana, line me lagna. Sample ghar par ho jaana isi rukawat ko hata deta hai, aur yahi is service ka sabse bada faayda hai.",
      "Jo jaanch sabse pehle honi chahiye wo mehngi nahi hai. CBC haemoglobin ke saath RBC ka size aur shape bhi batata hai, jisse pata chalta hai ki kami iron ki hai ya vitamin ki — haemoglobin kam nikalne par sirf iron ki goli shuru kar dena adhoora ilaaj hai. Thyroid Profile (TSH) doosri sabse zaroori hai, kyunki thyroid ki gadbadi ke lakshan itne aam hote hain ki wo saalon chhoot jaati hai. Iske saath Blood Sugar, Vitamin D aur Vitamin B12 — shudh shakahari khana chalne wale gharon me B12 ki kami bahut aam hai, aur wo sirf khoon nahi, nason par bhi asar daalti hai.",
      "Pregnancy me ye aur zaroori ho jaata hai. Blood group aur Rh factor, CBC, blood sugar, TSH aur urine routine — ye sab sample par hote hain aur ghar par ho jaate hain. Har trimester me kam se kam ek baar CBC dohraiye. Panel doctor ke parche se tay hota hai, is page se nahi — parche ka photo bhej dijiye aur wahi liya jaayega. Khoon aana, tez pet dard, lagatar ulti ya bukhar ho to test book karne se pehle doctor ko dikhaiye.",
      [
        "Ghar ki mahilaon ka checkup ek hi slot me karwana sabse aasan rehta hai — maa, dadi aur beti, teenon ka sample ek visit me ho jaata hai. Kaun sa vitamin test kab kaam ka hai, ye ",
        { text: "Vitamin B12 aur D wali guide", href: GUIDE_VITAMIN },
        " me alag se likha hai, aur umar ke hisaab se package chunne ke liye ",
        { text: "full body checkup wali guide", href: GUIDE_FULL_BODY },
        " padh lijiye.",
      ],
    ],
  },

  {
    id: "sugar-thyroid-hba1c-padrauna",
    h: "Padrauna Me Sugar Test, Thyroid Test (TSH) Aur HbA1c — Diabetes Health Checkup Kitne Mahine Me",
    p: [
      "Sugar aur thyroid do sabse zyada karaye jaane wale test hain, aur do sabse zyada galat samay par karaye jaane wale bhi. Blood Sugar Fasting khaali pet hota hai aur PP khaana khaane ke theek 2 ghante baad — ye do alag sample hain, ek nahi. HbA1c teen mahine ka ausat batata hai, ek hi sample me, aur ismein fasting nahi chahiye. Isliye \"aaj sugar theek hai\" aur \"teen mahine se sugar theek hai\" do alag baatein hain, aur ilaaj doosri par tay hota hai.",
      "Diabetes ka ilaaj chal raha hai to saal ka hisaab seedha rakhiye: har teen mahine me HbA1c, saal me ek baar Lipid Profile, aur saal me ek baar Kidney Function Test ke saath urine microalbumin. Microalbumin wahi test hai jo sabse pehle ishaara deta hai ki kidney par asar shuru ho raha hai, aur wahi sabse zyada chhoda jaata hai — kyunki wo alag se likhwana padta hai.",
      "Thyroid me Total aur Free alag test hain. Parche par T3/T4/TSH likha ho to Thyroid Profile, aur FT3/FT4 likha ho to free wala. Dawa chal rahi ho to dose badalne ke 6 se 8 hafte baad TSH dohraiye, uske baad har 6 se 12 mahine me. Thyroid ki goli sample dene ke baad leni chahiye, pehle nahi — aur biotin ya multivitamin kisi bhi hormone test se 2 se 3 din pehle band kar dena chahiye.",
      [
        "Ghar me kisi ko sugar ya BP hai, ya wajan zyada hai, to 30 saal ke baad saal me ek baar sugar aur lipid dekh lena samajhdari hai — lakshan aane ka intezaar karne ka matlab hai kai saal der. Kaun sa test kab, iska poora hisaab ",
        { text: "sugar aur thyroid wali guide", href: GUIDE_DIABETES },
        " me hai.",
      ],
    ],
  },

  {
    id: "liver-kidney-lipid-vitamin-padrauna",
    h: "Padrauna Me Liver Function Test (LFT), Kidney Function Test (KFT), Lipid Profile, Vitamin D Aur B12",
    p: [
      "Liver Function Test bilirubin, SGOT aur SGPT dekhta hai. Karana kab chahiye: aankh ya peshab me peelapan, lagatar kamzori, bhookh na lagna, pet ke daayein-upar dard, ya lambi chalne wali dawa (TB, mirgi, dard ki dawa) chal rahi ho. Sharaab lete hain to LFT se kam se kam 24 ghante pehle bilkul na lein — ek shaam ki peene se hi triglycerides aur liver enzymes kaafi badh jaate hain, aur report jhoothi ghabrahat de deti hai.",
      "Kidney Function Test urea, creatinine aur uric acid dekhta hai. Sugar ya BP ka ilaaj chal raha ho to saal me ek baar zaroori hai, aur uske saath urine routine bhi. KFT se ek din pehle bahut bhaari mehnat avoid kijiye. Paani kam peene se creatinine aur urea jhoothe taur par badhe hue aate hain, isliye fasting me bhi saada paani peena mana nahi hai — zaroori hai.",
      "Lipid Profile cholesterol aur triglycerides dekhta hai aur ismein fasting chahiye. Ise saal me ek baar karwa lena 35 ke baad har us vyakti ke liye theek hai jiske ghar me dil ki bimari ya sugar ki history hai. Vitamin D aur B12 me fasting nahi chahiye — din bhar andar rehne walon me Vitamin D ki kami aur shudh shakahari khana chalne walon me B12 ki kami bahut aam hai.",
      [
        "Ye chaaron test ek hi sample me ho jaate hain, isliye alag alag din nikaalne ki zaroorat nahi. Kaunsa number kis had ke baad dekhne layak hai, ye ",
        { text: "liver aur kidney wali guide", href: GUIDE_LIVER_KIDNEY },
        " me detail me likha hai.",
      ],
    ],
  },

  {
    /* Bukhar ka section jaan boojh kar chhota hai. Kis din kaunsa test — wo is
       belt ka common gyaan hai aur jile ke page par bhi hai; yahan use dohraya
       nahi jaata, sirf niyam diya jaata hai. Aur AES ki chetavani yahan RE-ARGUE
       nahi hoti: do line aur jile wale page ke section ka link. Ise kabhi
       booking prompt me mat badaliye. */
    id: "cbc-dengue-bukhar-padrauna",
    h: "Padrauna Me CBC Test Aur Dengue Test — Bukhar Ke Kis Din Kaunsa Test Sahi Hai",
    p: [
      "Bukhar me sabse aam galti bimari pehchan-ne me nahi, din ginne me hoti hai. Test sahi hota hai par galat din par, report negative aati hai, aur ilaaj hafta bhar late ho jaata hai. Niyam seedha hai: dengue me NS1 antigen bukhar ke pehle 1 se 5 din tak bharosemand hai, paanchve din ke baad aksar negative aa jaata hai aur tab IgM antibody karana padta hai. Typhoid me Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye; is ilaake me typhoid endemic hai, isliye purane infection se bhi Widal positive aa sakta hai aur sirf usi par ilaaj tay karna theek nahi. Thand aur kanpkanpi ho to malaria antigen aur smear jodiye.",
      "Jo bhi karayein, CBC saath me zaroor karwaiye. Girta platelet count wahi cheez hai jo dengue me roz dekhi jaati hai, aur ise dohrana padta hai — ek hi samay par, ek hi jagah se, warna do report ka farq bimari ka nahi, method ka nikal aata hai. Bukhar me ghar se nikalna sabse bhaari kaam hota hai, aur ye wahi mauka hai jab ghar par sample lena sabse zyada kaam aata hai.",
      [
        "Ek chetavani, jise halka mat leejiye. Bachche ko tez bukhar ke saath jhatke aayein, behoshi ho, gardan akad jaaye, lagatar ulti ho ya wo sust pada rahe — to lab test book mat kijiye, seedha najdeeki aspatal le jaaiye. Padrauna ka zila aspatal ya Gorakhpur ka BRD, jo pahunch me ho, turant. Is belt me barsaat ke baad dimaagi bukhar (AES / Japanese Encephalitis) ke maamle aate rahe hain aur ismein ek-ek ghanta maayne rakhta hai; poori baat ",
        { text: "yahan likhi hai", href: AES_SECTION },
        ".",
      ],
      [
        "Bukhar saada hai — jhatke nahi, behoshi nahi, gardan theek hai — to kis din kaunsa panel lena chahiye, uska poora hisaab ",
        { text: "dengue aur typhoid wali guide", href: GUIDE_DENGUE },
        " me hai.",
      ],
    ],
  },

  {
    id: "full-body-checkup-padrauna",
    h: "Padrauna Me Full Body Checkup — Preventive Aur Senior Citizen Health Checkup Package",
    p: [
      "Achha full body checkup parameter ki ginti se nahi, coverage se tay hota hai. Kam se kam paanch cheezein aani chahiye: blood count (CBC), sugar, dil ke liye lipid profile, liver function, aur kidney function ke saath urine routine. Iske upar thyroid, Vitamin D aur B12 jud jaayein to package se sach me kuch pata chalta hai.",
      "Basic Full Body Checkup (45 parameter, ₹999) un logon ke liye theek hai jinki umar kam hai aur koi shikayat nahi — saal ka ek baseline ban jaata hai. Advanced Full Body (72 parameter, ₹1,999) me thyroid, HbA1c aur vitamins jud jaate hain; 30 se 50 saal walon ke liye yahi sabse sahi baithta hai. Senior Citizen Pack (88 parameter, ₹2,999) 55 ke upar ke liye hai, jismein dil, haddi aur sugar ki screening ek saath hoti hai.",
      "Bujurgon ke liye ghar par package karana khaas kar kaam ka hai. Jinke liye ghar se nikalna hi sabse mushkil hissa hai — bujurg, lakwe ya operation ke baad recovery kar rahe log, bahut kamzor mareez — unka poora package ek hi sample me ho jaata hai. Booking ke waqt haalat bata dijiye: bistar par hain, diabetic hain jinki nas patli ho gayi hai, ya pehle sample lene me dikkat aayi hai. Isse aane wala taiyaari ke saath aata hai aur baar baar sui nahi lagani padti.",
      "Package apne risk ke hisaab se chuniye, daam ke hisaab se nahi. Ghar me diabetes ya dil ki bimari chali aa rahi hai to HbA1c, lipid aur kidney markers ko priority dijiye. Aur ek galatfehmi door kar lena zaroori hai: full body checkup har bimari nahi pakadta. Ye screening hai — jo cheez chup chaap badh rahi hoti hai use jaldi pakadne ke liye. Koi shikayat pehle se hai to package ke bharose mat baithiye, doctor ko dikhaiye aur wahi test karaiye jo wo kahe.",
      "Zyadatar package fasting maangte hain, isliye subah ka slot lijiye aur ghar ke sabhi logon ka ek hi slot me book kar dijiye.",
    ],
  },

  {
    id: "lab-test-price-padrauna",
    h: "Padrauna Me Lab Test Price Aur Rate List — Kaunsa Test Kitne Ka",
    p: [
      "Is page par har card par jo price likha hai, wahi aapko dena hai. Home sample collection uske upar free hai — na visiting charge, na travel charge, na koi hidden fee. Poora amount confirmation call par bata diya jaata hai, sample lene se pehle.",
      "Rate list ye rahi: Blood Sugar ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1,000, Vitamin B12 ₹1,200 aur Dengue (NS1, IgG, IgM) ₹1,200. Ye wahi rate hain jo hamare doosre sheheron me hain — Padrauna me na kam lagta hai na zyada.",
      "Bachat package me sabse zyada hai: Basic Full Body ₹999 me 45 parameter, Advanced Full Body ₹1,999 me 72 parameter, aur Senior Citizen Pack ₹2,999 me 88 parameter. Wahi test alag alag karane par kharcha kai guna ho jaata hai.",
      "Kuch test, jaise Fever Panel (malaria, typhoid aur dengue ek saath), price par nahi balki us waqt ki zaroorat par tay hote hain — unke card par 'Call for price' likha rehta hai. Phone par pooch lijiye; sample dene se pehle daam bata diya jaata hai. Payment sample lene ke waqt hi hota hai — cash ya UPI se, PhonePe, Google Pay ya Paytm.",
    ],
  },

  {
    id: "fasting-taiyari-padrauna",
    h: "Sample Dene Se Pehle Kya Karein, Kya Na Karein — Fasting Ke Niyam",
    p: [
      "Fasting wale test — Fasting Blood Sugar, Lipid Profile aur zyadatar full body package — me 10 se 12 ghante kuch nahi khana hota. Saada paani peena mana nahi hai, balki zaroori hai: paani ki kami se nas dhoondhna mushkil ho jaata hai aur haemoglobin, urea tatha creatinine jhoothe taur par badhe hue aate hain.",
      "Fasting sample se pehle chai — doodh wali to bilkul nahi — biscuit, toffee, paan ya gutkha kuch bhi nahi. Ek chai bhi sugar aur lipid ki report badal deti hai, aur phir wahi test dobara karana padta hai. Sirf saada paani.",
      "Bina fasting wale test yaad rakhiye, taaki bewajah bhookhe na rahein: CBC, Thyroid Profile, HbA1c, Vitamin D, Vitamin B12 aur zyadatar bukhar ke panel ke liye khaali pet hone ki zaroorat nahi hai.",
      "Dawa ka aam niyam ye hai ki apni rozana ki goliyan usi samay lijiye, jab tak doctor mana na kare. Do exception hain: thyroid ki goli sample dene ke baad leni chahiye, aur biotin ya multivitamin kisi bhi hormone test se 2 se 3 din pehle band kar dena chahiye. Phlebotomist ko bata dijiye ki aap kaun kaun si dawa le rahe hain.",
    ],
  },

  {
    id: "report-padrauna",
    h: "Report Kab Milegi — 24 Ghante Me WhatsApp Par PDF, Aur Use Kaise Padhein",
    p: [
      "Zyadatar routine test ki report 24 ghante ke andar aa jaati hai — CBC, sugar, lipid, LFT, KFT, thyroid aur urine routine. Vitamin aur hormone me aam taur par utna hi samay lagta hai. Culture jaan boojh kar dheere hote hain: urine ya blood culture me 48 se 72 ghante lagte hain, kyunki pehle organism ko ugana padta hai aur uske baad hi pata chalta hai ki kaunsi dawa asar karegi.",
      "Report WhatsApp aur email dono par PDF me aati hai. Doctor Padrauna me ho, Gorakhpur me, ya ghar ka koi vyakti bahar baitha ho — report bas forward kar dijiye. Kagaz le kar bhaagne ki zaroorat nahi, aur report kho jaane ka darr bhi nahi. Purani report bhi phone me sambhal kar rakhiye; doctor badlav dekhta hai, sirf aaj ka number nahi.",
      "Number ko report par chhape reference range se hi milaiye, internet ke kisi chart se nahi. Range machine aur method ke hisaab se badalti hai, aur umar tatha ling ke hisaab se bhi. Thoda sa high ya low hona bahut aam hai aur aksar koi bimari nahi hoti — ye diagnosis nahi, doctor se poochne ka ishaara hai. WhatsApp par report kisi group me mat daaliye; ye aapki niji jaankari hai.",
      [
        "Kuch result me intezaar nahi karna chahiye, usi din doctor chahiye: dengue me tezi se girta platelet count, bahut zyada sugar ke saath ulti ya susti, bahut kam haemoglobin, ya bahut badha creatinine ke saath peshab kam hona. Numbers ka matlab kya hota hai aur kis flag par ghabrana nahi chahiye, ye ",
        { text: "report kaise padhein wale hisse", href: `${GUIDE_LAB_TEST}#report-kaise-padhein` },
        " me detail me likha hai.",
      ],
    ],
  },

  {
    id: "gorakhpur-deoria-safar-padrauna",
    h: "Gorakhpur Ya Deoria Jaane Ki Zaroorat Kab Hai Aur Kab Nahi",
    p: [
      "Har cheez ke liye safar zaroori nahi hai. Routine pathology — blood count, sugar, thyroid, liver, kidney, lipid, vitamin, urine routine, bukhar ka panel — sample par hoti hai, aur sample kahin se bhi liya ja sakta hai. In sabke liye Padrauna me ghar par sample dena aur report phone par lena bilkul kaafi hai.",
      [
        "Safar tab banta hai jab baat imaging ya specialist ki ho — MRI, CT scan, sonography se aage angiography, endoscopy, biopsy, ya kisi super-speciality doctor ki OPD. Gorakhpur yahan se kareeb 50 kilometre hai aur zyadatar log wahin jaate hain; kuch kaam ke liye Deoria bhi. Us din ki ek hi taiyaari kaam ki hai: blood test pehle ghar par karwa lijiye, taaki doctor ke saamne baithte waqt report haath me ho aur ek hi visit me baat ban jaaye — warna wo test likhega aur agli date de dega. ",
        { text: "Gorakhpur me lab test", href: LAB_GORAKHPUR },
        " aur ",
        { text: "Deoria me lab test", href: LAB_DEORIA },
        " bhi isi tarah ghar par hota hai, agar aap wahan kisi ke saath ruke hain.",
      ],
      [
        "Lab chunne se pehle kya dekhna chahiye — ye ",
        { text: "pathology lab kaise chunein wali guide", href: GUIDE_PATHOLOGY },
        " me likha hai, aur kaun sa test kab karana chahiye, shikayat aur umar ke hisaab se, wo ",
        { text: "poori guide", href: GUIDE_LAB_TEST },
        " me.",
      ],
    ],
  },

  {
    /* Devanagari section, ek baar. Is belt me bahut si search Hindi me type hoti
       hai — "पड़रौना में लैब टेस्ट", "खून की जांच", "रेट लिस्ट". Poore page ko
       transliterate karna galat hota: baaki copy Hinglish me hai aur wahi log
       padhte hain. Ye upar likhi baaton ka anuvaad hai, naya daawa nahi. */
    id: "padrauna-lab-test-hindi",
    h: "पड़रौना में लैब टेस्ट — घर से सैंपल कलेक्शन की पूरी जानकारी (हिंदी में)",
    p: [
      "पड़रौना में खून की जांच के लिए अब सुबह का समय निकालने की ज़रूरत नहीं है। सीबीसी, थायरॉइड (टीएसएच), शुगर, एचबीए1सी, लिपिड प्रोफाइल, लिवर और किडनी फंक्शन टेस्ट, विटामिन डी, विटामिन बी12, डेंगू और फुल बॉडी चेकअप — ये सारी जांच सैंपल पर होती हैं, और सैंपल आपके घर से लिया जा सकता है।",
      "होम सैंपल कलेक्शन बिल्कुल मुफ़्त है। आप सिर्फ़ टेस्ट का वही दाम देते हैं जो कार्ड पर लिखा है — कोई विज़िटिंग चार्ज या छिपा हुआ शुल्क नहीं। सुबह 6 बजे से स्लॉट शुरू हो जाते हैं, ताकि खाली पेट वाली जांच जल्दी हो जाए, आप तुरंत नाश्ता कर लें और दुकान या दफ़्तर अपने समय पर खुले। रिपोर्ट 24 घंटे में व्हाट्सएप और ईमेल पर पीडीएफ में आ जाती है।",
      "रेट लिस्ट: ब्लड शुगर ₹100, सीबीसी ₹400, थायरॉइड प्रोफाइल ₹550, एचबीए1सी ₹600, लिवर फंक्शन टेस्ट ₹600, किडनी फंक्शन टेस्ट ₹700, लिपिड प्रोफाइल ₹800, विटामिन डी ₹1,000, विटामिन बी12 ₹1,200 और डेंगू ₹1,200। बेसिक फुल बॉडी चेकअप ₹999 में 45 पैरामीटर, एडवांस ₹1,999 में 72 और सीनियर सिटिज़न पैक ₹2,999 में 88 पैरामीटर देता है।",
      "सैंपल पड़रौना के लगभग हर मोहल्ले से लिया जाता है — दुर्गा चौक, सेंट्रल बैंक रोड, स्टेशन रोड, रामकोला रोड, कसिया रोड, तरया सुजान की तरफ़, ज़िला अस्पताल और तहसील के आस-पास का हिस्सा, और शहर से सटे गाँव। पता लिखते समय मोहल्ले के नाम के साथ एक जाना-पहचाना लैंडमार्क ज़रूर डालिए — यहाँ मकान नंबर से ज़्यादा काम लैंडमार्क आता है।",
      "हमारा पड़रौना में कोई वॉक-इन काउंटर नहीं है, और हम यह दावा नहीं करते। यह घर से सैंपल लेने की सेवा है: प्रशिक्षित फ़्लेबोटोमिस्ट आईडी कार्ड के साथ आपके घर आता है, सैंपल आपके सामने लिया जाता है, और पेमेंट उसी समय नकद या यूपीआई से होता है। पूरी विज़िट लगभग 10 मिनट की होती है।",
      [
        "बच्चे को तेज़ बुखार के साथ झटके, बेहोशी, गर्दन में अकड़न या लगातार उल्टी हो, तो जांच बुक करने के बजाय सीधे नज़दीकी अस्पताल ले जाइए — यह आपात स्थिति है, और ",
        { text: "इसकी पूरी जानकारी यहाँ है", href: AES_SECTION },
        "। कौन सी जांच कब करानी चाहिए, यह ",
        { text: "हमारी गाइड में", href: GUIDE_LAB_TEST },
        " दिया गया है।",
      ],
    ],
  },
];

/**
 * Padrauna's own FAQs.
 *
 * The generated defaults ask the same seven questions for every city with the
 * name swapped — exactly the duplication that keeps a second page in the same
 * district out of the index, and the FAQ block is the part Google is most
 * likely to lift into a rich result, so near-identical answers actively hurt.
 *
 * These are the questions a PADRAUNA TOWN reader has and a Khadda or Tamkuhi
 * Raj reader does not: is there a counter near Durga Chowk or Bank Road, which
 * mohallas are covered, which lab should I trust, and can the women of the
 * house be tested without anyone taking half a day off. The two that decide a
 * booking are placed first — page.js renders the first eight, so this list is
 * exactly eight.
 *
 * ⚠ The "best diagnostic centre" answer refuses the boast and gives checkable
 * facts instead. Do not turn it into a claim, and do not move that phrase into
 * the body copy. Same rule as content/gopalganj.js and content/lucknow.js.
 *
 * The rate line in the first answer must match the price section above AND
 * defaultTests() in src/data/lab/defaults.js.
 *
 * `links` is optional per FAQ and renders UNDER the answer, never inside the
 * schema text: the JSON-LD has to mirror the readable answer exactly, so the
 * links live outside `a`. See LabFaq.
 */
export const padraunaFaqs = [
  {
    q: "How much does a lab test cost in Padrauna, and is home sample collection free?",
    a: "You pay only the price printed on the test card — home sample collection in Padrauna is completely free, with no visiting charge and no hidden fee. Blood Sugar is ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, and the Basic Full Body Checkup starts at ₹999. The total is confirmed on the call before anyone comes, and payment is taken at the time of collection, by cash or UPI.",
  },
  {
    q: "Do you have a pathology lab or collection centre in Padrauna where I can walk in?",
    a: "No — we have no walk-in counter in Padrauna, near Durga Chowk, on Bank Road or anywhere else in the town, and we do not claim to. This is a home collection service: a trained phlebotomist comes to your address with an ID card and the sample is drawn in front of you. It is worth knowing that most small collection centres are not laboratories either — they take the sample and it travels to a city lab anyway. Starting that journey from your own door costs nothing in reliability and saves you the morning.",
  },
  {
    q: "Which areas of Padrauna do you cover for home blood test collection?",
    a: "Nearly the whole town: Durga Chowk and the lanes around it, Central Bank Road, Station Road, the Ramkola Road side, Kasia Road, towards Tarya Sujan, the area around the district hospital and tehsil, the old bazaar mohallas and the newer colonies — along with the villages adjoining the town and nearby places such as Ramkola, Hata, Sewrahi and Captainganj. If your mohalla is not named here, please call anyway; if it is covered, the slot is booked on the same call. Write a landmark with the address — here a landmark works far better than a house number.",
  },
  {
    q: "How do I book a blood test online in Padrauna?",
    a: "Choose your test or package on this page and fill the booking form with your name, mobile number, mohalla and a landmark — or simply call. A confirmation call usually comes within about 30 minutes and settles three things: the slot, the address, and whether the test needs fasting. The full amount is told to you on that call, before the visit. If you have a doctor's prescription, send a photo at the time of booking so that exactly the panel written on it is run. Payment is taken at collection by cash or UPI, and the report arrives within 24 hours as a PDF on WhatsApp and email.",
  },
  {
    q: "Which is the best diagnostic centre in Padrauna?",
    a: "We are not going to call ourselves the best, and we would be careful with any lab that does. What is worth judging a lab on is checkable: is the price told to you before the visit, does the person collecting the sample carry an ID card, is the sample drawn in front of you, is a clear report time committed to, and does the report print the reference range beside every value. On this page the answers are yes, yes, yes, 24 hours for routine tests, and yes. One more thing helps more than choosing the 'best' — pick one lab and stay with it, so your doctor can compare an old report with a new one directly.",
  },
  {
    q: "Can a sample be taken at home for elderly or bedridden patients in Padrauna?",
    a: "Yes, and this is exactly who it helps most. Please describe the patient's condition when booking — elderly, bedridden, recovering after an operation, diabetic with veins that have become difficult, or a history of trouble during earlier draws — so that whoever comes arrives prepared. Give the patient a little water beforehand unless the fasting instructions say otherwise, since dehydration makes a vein genuinely hard to find. If several people in the house are being tested, book them into a single slot; all the samples are taken in one visit.",
  },
  {
    q: "Which tests should women in the house get done, and can they be done at home?",
    a: "All of them are done on a sample, so yes. The ones most often delayed are CBC for haemoglobin, Thyroid Profile (TSH), Blood Sugar, Vitamin D and Vitamin B12 — B12 deficiency is common in vegetarian households and affects the nerves, not only the blood. In pregnancy, blood group and Rh factor, CBC, blood sugar, TSH and urine routine are all collected at home, and a CBC should be repeated at least once each trimester. The panel is decided by your doctor's prescription, not by this page, so send a photo of it. With bleeding, severe abdominal pain, persistent vomiting or fever, see a doctor first rather than booking a test.",
  },
  {
    q: "Do I have to go to Gorakhpur or Deoria from Padrauna for a blood test?",
    a: "Not for routine pathology. CBC, sugar, HbA1c, thyroid, liver, kidney, lipid, vitamin and dengue tests are all run on a sample, and that sample can be drawn at your home in Padrauna. Gorakhpur, roughly 50 km away, is necessary for imaging such as MRI, CT or endoscopy, or to see a specialist in person. On the day of such a trip, go with the report already in hand — otherwise the doctor will prescribe tests and give you another date, and the journey has to be made twice.",
    links: [
      { href: LAB_GORAKHPUR, label: "Lab test in Gorakhpur" },
      { href: LAB_KUSHINAGAR, label: "Lab test in Kushinagar district" },
    ],
  },
];
