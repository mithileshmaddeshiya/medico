/**
 * Long-form SEO copy for /lab-test/gorakhpur.
 *
 * ── WHY THIS FILE EXISTS AND NOT defaultContent() ────────────────────────
 * Google does not index a page that is another page with one noun swapped — it
 * reads it as a doorway page. Varanasi and Deoria both carry hand-written copy
 * for exactly that reason (see the notes at the top of ./varanasi.js and
 * ./deoria.js), and a third city on the generated fallback would be the one
 * that fails to rank while the other two do.
 *
 * ── HOW CLOSE IS TOO CLOSE ───────────────────────────────────────────────
 * The first draft of this file was measured against the other two pages with a
 * 5-word shingle overlap. Deoria vs Varanasi — two pages that already rank
 * independently — sit at about 20%. That draft came out at 61% against Deoria,
 * because half its sections were Deoria's paragraphs with the city name
 * changed: anaemia, packages, prices, fasting, reports, booking. Every fact was
 * true and the page would still have been a duplicate.
 *
 * So this rewrite keeps the facts and throws away the sentences. Where a topic
 * could not be given a genuinely Gorakhpur angle, the section was cut rather
 * than padded — and two sections that only this city needs were added in their
 * place: the OPD-appointment one and the pre-operative panel. IF YOU ADD A
 * FOURTH CITY, MEASURE IT THE SAME WAY BEFORE PUBLISHING.
 *
 * ── THE ARGUMENT THIS PAGE MAKES ─────────────────────────────────────────
 * Each city page answers a different reader:
 *
 *   Varanasi  — "the labs are all here; skip the queue."
 *   Deoria    — "the big labs are NOT here; skip the journey."
 *   Gorakhpur — "everything is here, which is why everything is crowded. The
 *                saving is not in finding a lab, it is in TIMING the test
 *                around your appointment or your admission."
 *
 * AIIMS Gorakhpur, BRD Medical College and the district hospital are all in
 * this city, so it is where the region is referred to — from Kushinagar,
 * Maharajganj, Deoria, Sant Kabir Nagar, Basti and Siddharthnagar, from the
 * Bihar districts across the border, and from the Nepal border towns. The
 * reader here is very often someone with an OPD slip or an operation date.
 *
 * ⚠ AIIMS and BRD are named as GEOGRAPHY and nothing else — they are why this
 * city is a referral hub. Nothing here may suggest an association with them, a
 * partnership, or that we collect on their behalf. We do not.
 *
 * ── Claims ───────────────────────────────────────────────────────────────
 * Only the confirmed set (see the warning above defaultFaqs in
 * src/data/lab/defaults.js): free home collection, a trained phlebotomist
 * carrying an ID card, slots from 6 AM, reports in 24 hours on WhatsApp and
 * email, cash/UPI on collection. Cold-chain transport, barcode tracking and
 * sealed single-use needles are NOT claimed — they are unverified.
 *
 * NOT CLAIMED, however well it would rank: "24 hour lab in Gorakhpur". The page
 * says "report 24 ghante me", which is true, and never "24 ghante khula lab".
 *
 * The pre-operative section lists the panel a hospital typically asks for. It
 * does NOT say we clear anyone for surgery, and it tells the reader to follow
 * the hospital's own list — because that list is the one that counts.
 *
 * The prices quoted are the same numbers the test cards render from
 * defaultTests(). If those change, this section changes with them.
 *
 * ── The encephalitis paragraph ───────────────────────────────────────────
 * This region has a long AES / Japanese Encephalitis history, and BRD is where
 * those children are taken. The only responsible thing a lab page can say is
 * "do not book a test, go to a hospital now" — so that is what it says, twice
 * (once in the fever section, once in the FAQs), and it is the one place on
 * this page that tells a reader NOT to use the service.
 *
 * ── Internal links ───────────────────────────────────────────────────────
 * Paragraph parts of the form { text, href } render as in-prose links (see
 * LabContent). Every href must be a route that exists:
 *   /lab-test/{deoria,varanasi}            (src/data/lab/cities.js)
 *   /medicine-delivery/deoria              (src/data/medicine/cityData.js)
 *   /blogs/lab-test/varanasi  + anchors    (src/data/blogs/varanasi/)
 *   /contact
 */

/* Link targets as constants: a route rename is a one-line fix here instead of a
   hunt through the prose, and a typo shows up as `undefined` in the href rather
   than as a silent 404 in production. */
const LAB_DEORIA = "/lab-test/deoria";
const LAB_VARANASI = "/lab-test/varanasi";
const MEDICINE_DEORIA = "/medicine-delivery/deoria";
const GUIDE_WHICH_TEST = "/blogs/lab-test/varanasi";
const GUIDE_FEVER_DAYS = "/blogs/lab-test/varanasi#bukhar-me-test-ka-din";
const GUIDE_FASTING = "/blogs/lab-test/varanasi#fasting-aur-taiyari";
const GUIDE_REPORT = "/blogs/lab-test/varanasi#report-kaise-padhein";
const GUIDE_AGE = "/blogs/lab-test/varanasi#umar-ke-hisaab-se-test";
const CONTACT = "/contact";

export const gorakhpurContent = [
  {
    id: "lab-test-in-gorakhpur",
    h: "Gorakhpur Me Lab Test — Ghar Baithe Blood Test Booking Aur Free Home Sample Collection",
    p: [
      "Gorakhpur me lab dhoondhna kabhi samasya nahi rahi. AIIMS, BRD Medical College aur district hospital — teenon isi sheher me hain, aur inke chaaron taraf collection counters ki koi kami nahi. Samasya ulti hai: kyunki poora ilaaka yahin refer hota hai, isliye har counter par utni hi bheed hai. Kushinagar, Maharajganj, Deoria, Sant Kabir Nagar, Basti aur Siddharthnagar ke saath Bihar ke seemavarti jile aur Nepal border ke kasbe — sab ka rasta yahin aa kar milta hai.",
      "Bheed ka waqt bhi tay hai. Subah 7 se 10 baje ke beech har fasting sample dena hota hai, isliye Medical College Road, Golghar, Betiahata aur Mohaddipur ke counters par usi window me line lagti hai. Sheher lamba-chauda hai aur in raston par traffic bhi bhaari rehta hai — khaali pet aadha ghanta jam me nikalna kisi ke bhi test se pehle ka sahi tareeka nahi hai.",
      "Ghar par sample dene se ye poora hissa hat jaata hai. Test ya package chuniye, Gorakhpur ka pata landmark ke saath likhiye, subah ka slot lijiye — trained phlebotomist ID card ke saath aata hai, sample aapke saamne leta hai, aur report 24 ghante ke andar WhatsApp aur email par PDF me pahunch jaati hai. Home collection par koi alag charge nahi lagta.",
      [
        "Routine pathology ke saare test yahan book hote hain — CBC, Thyroid Profile, Blood Sugar, HbA1c, Lipid Profile, LFT, KFT, Vitamin D, Vitamin B12, Dengue aur Full Body Checkup. Doctor ka parcha hai to usi panel ke hisaab se booking ho jaati hai. Kis shikayat par kaun sa test hota hai, ye ",
        { text: "alag guide me", href: GUIDE_WHICH_TEST },
        " detail se likha hai.",
      ],
    ],
  },

  {
    /* ⭐ The section that makes this page Gorakhpur's own. Neither of the other
       two cities can argue it, because neither is where the region's OPD
       appointments actually happen. */
    id: "opd-se-pehle-report-gorakhpur",
    h: "OPD Se Pehle Report Taiyaar Rakhiye — Gorakhpur Me Ek Poora Din Bachane Ka Tarika",
    p: [
      "Sabse zyada waqt lab me nahi jaata, do baar aane-jaane me jaata hai. Kahani hamesha ek jaisi hoti hai: number lagta hai, doctor dekhta hai, parche par CBC ya sugar ya thyroid likh deta hai, aur kehta hai — report le kar aaiye. Ab ek din sample dene me, phir ek din dobara dikhane me. Ek consultation, teen din, aur beech me chhutti bhi.",
      "Iska hal seedha hai aur kam logon ko pata hai. Parcha aapke paas pehle se hai — purani visit ka, kisi ne dekh kar likha ho, ya follow-up ka — to appointment se ek din pehle subah sample de dijiye. Agle din report phone me hogi aur aap OPD me use dikha kar usi visit me dawa likhwa lenge.",
      "Jo log sheher ke bahar se aate hain, unke liye ye ginti aur badi ho jaati hai. Kushinagar ya Maharajganj se subah nikalna, number lagwana, phir test ke liye rukna ya khaali haath lautna — ek din me nahi nipatta. Apne kasbe me ek raat pehle sample dijiye, subah report ke saath chaliye.",
      [
        "Booking ke waqt parche ka photo bhej dena sabse zaroori step hai. Test ke naam aksar milte-julte hote hain — Thyroid Profile Total aur Free do alag cheezein hain — aur galat panel book ho jaane par poori planning bekaar chali jaati hai. Aur agar aap khud tay kar rahe hain ki saal me kya karana chahiye, to ",
        { text: "umar ke hisaab se banaya gaya panel", href: GUIDE_AGE },
        " dekh lijiye.",
      ],
    ],
  },

  {
    /* ⭐ Second Gorakhpur-only section. Surgeries and admissions happen in this
       city, so the pre-op panel is a real, high-intent query here and nowhere
       else on the site. Framed as "the hospital's list is the one that counts"
       so it never reads as us clearing anyone for theatre. */
    id: "operation-se-pehle-test-gorakhpur",
    h: "Operation Ya Admission Se Pehle Ke Test — Gorakhpur Me Ye Aksar Poochhe Jaate Hain",
    p: [
      "Gorakhpur me operation ki date mil jaane ke baad ek list thama di jaati hai, aur us list ke bina admission aage nahi badhta. Aam taur par usme yahi cheezein hoti hain: CBC, Blood Group aur Rh typing, Blood Sugar, Kidney Function Test, Liver Function Test, aur infection screening — HBsAg, Anti-HCV tatha HIV. Kuch surgery me clotting dekhne ke liye PT/INR bhi maanga jaata hai.",
      "Yahan ek zaroori baat: list hamesha aapke hospital ki maanie, kisi article ki nahi — hamari bhi nahi. Har department aur har surgery ki apni zaroorat hoti hai, aur ek test chhoot jaane par date aage badh jaati hai. Parche ko saamne rakh kar wahi naam booking me daaliye.",
      "Timing ka faayda yahan bhi wahi hai. Ye saare test sample par hote hain, isliye admission se do-teen din pehle ghar par sample de dijiye — report haath me le kar jaayenge to counter par ek chakkar kam lagega. Aur agar aap kisi ke saath tehar kar aaye hain, to sample us kamre par bhi liya ja sakta hai jahan aap ruke hain.",
      "Operation se pehle ka CBC aksar wo pehla mauka hota hai jab khoon ki kami pakad me aati hai. Haemoglobin kam nikal aaye to sirf iron ki goli shuru kar dena adhoora hai — ferritin, Vitamin B12 aur folate se pata chalta hai ki wajah kya hai. Ye baat operation ke liye bhi maayne rakhti hai, isliye report doctor ko waqt rehte dikha dijiye.",
    ],
  },

  {
    // "Gorakhpur me pathology lab", "diagnostic centre Gorakhpur" aur "blood
    // test near me" — teen alag search, intent ek: jaana kahan hai. Deoria ka
    // jawab tha "yahan bade lab hain hi nahi". Gorakhpur ka ulta hai: lab bahut
    // hain, isliye sawaal chunne ka hai — aur wahi is section ka angle hai.
    id: "pathology-lab-diagnostic-centre-gorakhpur",
    h: "Gorakhpur Me Pathology Lab Kaise Chunein — Bheed Nahi, Ye Do Cheezein Dekhiye",
    p: [
      "Is sheher me sawaal \"lab kahan hai\" nahi, \"kaunsi lab\" hai. Aur bahar se dekh kar ye tay nahi hota: chamakti reception aur bade board ka machine ki calibration se koi rishta nahi. Do cheezein aisi hain jo aap sach me pooch sakte hain, aur wahi kaafi bata deti hain.",
      "Pehli — report par test ka method chhapta hai ya nahi. CLIA, ECLIA, ELISA — hormone aur vitamin me ye farq asli hota hai, aur jo lab apna method likhti hai wo apne number ke peeche khadi hai. Doosri — reference range report par khud chhapi hai ya nahi. Range machine, umar aur ling ke hisaab se badalti hai; jo report aapko internet par range dhoondhne par majboor kar de, wo adhoori report hai.",
      "Teesri baat poochne ki nahi, karne ki hai: jo number aap mahino tak track kar rahe hain — HbA1c, TSH, creatinine, haemoglobin — unke liye lab badalte mat rahiye. Do alag analyser par TSH 4.5 aur 4.1 aane ka matlab thyroid ka badalna nahi hai, sirf machine ka badalna hai. Doctor ko badlav dekhna hota hai, aur badlav tabhi dikhta hai jab baaki sab kuch same rahe.",
      "Aur jahan tak jaane ki baat hai — routine pathology ke liye kahin jaana hi nahi padta. Blood aur urine ke saare aam test sample par hote hain, aur sample Golghar ho ya Sahjanwa, aapke ghar par liya ja sakta hai. Hum 24 ghante khuli lab hone ka daawa nahi karte; 24 ghante me report dene ka karte hain.",
    ],
  },

  {
    id: "home-sample-collection-gorakhpur",
    h: "Poore Gorakhpur Me Home Sample Collection — Sheher Ke Mohalle Aur Jile Ke Kasbe",
    p: [
      "Sheher me collection in ilaakon me hoti hai: Golghar, Civil Lines, Betiahata, Mohaddipur, Taramandal, Rustampur, Medical College Road, Asuran, Shahpur, Gorakhnath, Bashharatpur, Jatepur, Padri Bazar, Kunraghat, Rapti Nagar, Bargadwa, Nausarh, Khorabar, Ramgarh Tal ke aas-paas ki colony aur Transport Nagar tarf ke naye mohalle.",
      "Jile ke kasbon me bhi sample liya jaata hai — Sahjanwa, Pipraich, Chauri Chaura, Bansgaon, Campierganj, Gola Bazar, Khajni aur Barhalganj tak. Aapka mohalla ya gaon upar naam se na ho to maan kar mat baithiye ki service nahi hai; ek call kar lijiye. Cover hota hai to usi waqt slot ban jaayega, aur nahi hota to hum saaf mana kar denge — taaki aap subah se khaali pet intezaar na karein.",
      "Pata likhne ka tareeka yahan thoda alag chahiye. Gorakhpur ke naye mohalle tezi se base hain aur bahut si galiyan map par theek nahi aatin, isliye plot number se zyada kaam landmark karta hai — school, mandir, bank, petrol pump, hospital gate ya chauraha. Ek landmark aur ek chaalu mobile number, bas itna kaafi hai. Der ki zyadatar wajah adhoora pata hoti hai.",
      "Ghar ke kai log ek saath karaa rahe hain to sabki booking ek hi slot me kar dijiye — ek visit me sabka sample ho jaayega. Koi bujurg hai, bistar par hai, jinki nas patli ho gayi hai, ya operation ke baad recovery kar raha hai, to booking me ye likh dijiye taaki experienced phlebotomist bheja ja sake.",
    ],
  },

  {
    id: "bahar-se-aane-wale-gorakhpur",
    h: "Gorakhpur Ke Bahar Se Aa Rahe Hain — Kaunsa Kaam Yahan, Kaunsa Ghar Par",
    p: [
      "Har parche ke liye bus pakad lena aadat ban jaati hai, aur aadhe se zyada mauke par uski zaroorat hi nahi hoti. Farq samajh lijiye: blood aur urine ke saare test sirf sample par hote hain — CBC, sugar, thyroid, liver, kidney, lipid, vitamin, bukhar ka panel. Inke liye kis sheher me sample liya gaya, isse result par koi asar nahi padta.",
      "Yahan aana tab banta hai jab machine ya doctor khud chahiye ho — MRI, CT scan, angiography, endoscopy, biopsy, ya kisi super-speciality ki OPD. Inka koi ghar wala option hota hi nahi, aur inhi ke liye Gorakhpur poore ilaake ka centre hai.",
      [
        "Isliye niyam simple hai: parche par sirf jaanch likhi hai to apne sheher me ghar par karaiye; scan ya specialist hai to trip planning kijiye aur us trip se pehle blood test karwa lijiye. Deoria taraf ke logon ke liye wahi suvidha wahin hai — ",
        { text: "Deoria me lab test aur home sample collection", href: LAB_DEORIA },
        ". Aur jinka ilaaj Varanasi me chal raha hai, unke liye ",
        { text: "Varanasi me lab test", href: LAB_VARANASI },
        ".",
      ],
      "Bihar ke seemavarti jilon aur Nepal border ke kasbon se aane walon ke liye ek practical faayda: report kagaz par nahi, PDF me aati hai. Wo kho nahi sakti, bheeg nahi sakti, aur kisi bhi doctor ko — yahan, Lucknow me ya seema paar — sirf forward karni hoti hai.",
    ],
  },

  {
    id: "fever-season-gorakhpur",
    h: "Gorakhpur Me Dengue, Typhoid Aur Malaria Test — Bukhar Me Kaunsa Test Kis Din",
    p: [
      "⚠ Sabse pehle wo baat jo is poore page par sabse zaroori hai. Bachche ko tez bukhar ke saath jhatke aayein, behoshi ho, gardan akad jaaye, lagatar ulti ho ya wo sust pada rahe — to koi test book mat kijiye. Seedha najdeeki hospital le jaaiye. Gorakhpur–Kushinagar–Maharajganj belt me barsaat ke baad bachchon me dimaagi bukhar (AES / Japanese Encephalitis) ke maamle aate rahe hain, aur ismein ek-ek ghanta maayne rakhta hai. Blood test iska pehla jawab nahi hai, aur ghar par sample ka intezaar khatarnak hai.",
      "Baaki bukhar me sabse badi galti timing ki hoti hai — test sahi, din galat. Dengue ka NS1 antigen sirf bukhar ke pehle 1 se 5 din tak bharosemand hai; chhathe din wahi test aksar negative aata hai aur tab IgM antibody karana hota hai. Doosre din IgM ya aathve din NS1 karayenge to dengue hone par bhi report negative aa sakti hai, aur ilaaj ek hafta peeche chala jaata hai.",
      "Dengue ka koi bhi test ho, CBC saath me zaroor jodiye. Antigen ki report ek baar ki cheez hai; girta platelet count aur badhta haematocrit wo cheez hai jo roz dekhi jaati hai aur jisi par bharti karne ka faisla hota hai.",
      [
        "Typhoid ka Widal bhi apna waqt maangta hai — paanch se saat din ka bukhar ho tab hi titre itne badhte hain ki kuch pata chale. Aur yahan ek local dikkat aur hai: ye ilaaka typhoid ke liye endemic hai, matlab bahut logon me purane infection ki wajah se bhi Widal halka positive nikal aata hai. Isliye akele Widal par dawa shuru karna theek nahi — Typhidot IgM jaldi jawab de deta hai, aur pehle hafte me blood culture se pakka pata chalta hai. Bukhar ke saath thand aur kanpkanpi ho to malaria antigen tatha smear alag se jodiye. Kis test ka kaunsa din hai, uski poori table ",
        { text: "yahan di hui hai", href: GUIDE_FEVER_DAYS },
        ".",
      ],
    ],
  },

  {
    id: "water-jaundice-gorakhpur",
    h: "Barsaat Ke Baad Peeliya — Gorakhpur Me LFT Aur Hepatitis Ki Jaanch",
    p: [
      "Rapti aur Rohin ke kinare wale ilaake aur sheher ke nichle mohalle barsaat me sabse pehle doobte hain. Paani utar jaata hai, khatra uske baad shuru hota hai — handpump doob chuke hote hain, pipeline me leakage se gandagi mil jaati hai, aur wahi paani gharon tak pahunchta rehta hai.",
      "Do bimariyan isi raste aati hain: typhoid aur peeliya. Paani se failne wale Hepatitis A aur Hepatitis E in mahino me badh jaate hain. Aankh aur peshab ka peela pad jaana, bhookh ka poori tarah khatam ho jaana, ulti jaisa lagna aur bahut kamzori — in par Liver Function Test (total aur direct bilirubin ke saath) tatha Hepatitis A IgM aur E IgM karana chahiye.",
      "Garbhwati mahila ko peeliya ho to intezaar bilkul mat kijiye, usi din doctor ko dikhaiye. Hepatitis E pregnancy me aam logon ke muqable kahin zyada khatarnak hota hai — ye wo ek sthiti hai jahan der sabse mehngi padti hai.",
      "Pet kharab rehna, dast ya halka bukhar lagatar bana ho to Urine Routine aur Stool Routine bhi is mausam me kaam ke test hain. Aur jab tak nal ya handpump ka paani bharose layak na ho jaaye, sabse zyada bachaav kisi test se nahi, ek aadat se hota hai — paani ubaal kar peena.",
    ],
  },

  {
    id: "diabetes-thyroid-screening-gorakhpur",
    h: "Gorakhpur Me Sugar, HbA1c Aur Thyroid Test — Follow-up Ka Sahi Waqt",
    p: [
      "Ek baar diagnosis ho jaane ke baad asli kaam follow-up ka hota hai, aur yahi sabse zyada chhootta hai. Doctor ne dawa likh di, tabiyat theek lagne lagi, aur agli jaanch saal bhar taal di gayi — ye pattern har jagah dikhta hai. Sugar aur thyroid dono me dawa ka sahi dose tabhi tay hota hai jab number samay par dekha jaaye.",
      "Diabetes ka calendar teen cheezon ka hai. HbA1c teen-teen mahine par — kyunki wahi batata hai ki pichhle season me control kaisa raha, na ki aaj subah kya khaya. Saal me ek baar dil ke liye Lipid Profile. Aur saal me ek baar kidney, jismein KFT ke saath urine microalbumin zaroor ho — ye chhota sa test wo pehla sanket deta hai jo creatinine badhne se kaafi pehle aa jaata hai, aur isi ko log sabse zyada chhod dete hain. Thyroid alag chalta hai: dose badle to 6 se 8 hafte baad TSH, phir har 6 se 12 mahine me.",
      "Jinhe abhi tak diagnosis nahi hua — 30 ke baad saal me ek baar Fasting Blood Sugar aur HbA1c kar lena chahiye, aur usse pehle bhi agar ghar me kisi ko diabetes hai, pet ke aas-paas wazan zyada hai, ya pregnancy me sugar badha tha. HbA1c ka bada faayda ye hai ki ismein fasting nahi chahiye, isliye jinka khaane ka koi fix time nahi, unke liye yahi sabse aasan test hai.",
      "In lakshanon par saal khatam hone ka intezaar mat kijiye: bahut pyaas, raat me baar-baar peshab, ghaav ka der se bharna, dhundhla dikhna, ya bina koshish ke wazan girna. Aur thyroid ke liye ek TSH un sabko karana chahiye jinko lagatar thakan hai, baal jhad rahe hain, periods gadbad hain, ya jo pregnancy plan kar rahi hain.",
    ],
  },

  {
    id: "full-body-checkup-gorakhpur",
    h: "Gorakhpur Me Full Body Checkup — Kaunsa Package Kiske Liye Hai",
    p: [
      "Package chunte waqt log parameter ginti dekhte hain, aur wahi sabse kam kaam ki cheez hai. 45 ho ya 88 — asli sawaal ye hai ki paanch system chhoote to nahi: khoon, sugar, dil, liver aur kidney. In paanchon ke bina lambi list bhi adhoori hai, aur in paanchon ke saath thyroid, Vitamin D tatha B12 jud jaayein to package sach me kuch pakadta hai.",
      "Basic Full Body Checkup (45 parameter, ₹999) un logon ke liye hai jinki umar kam hai aur koi shikayat nahi — ye saal ka baseline ban jaata hai, aur baseline ki keemat aaj nahi, paanch saal baad samajh aati hai. Advanced Full Body (72 parameter, ₹1,999) me thyroid, HbA1c aur vitamins jud jaate hain; 30 se 50 ke beech ke logon ke liye yahi sahi baithta hai. Senior Citizen Pack (88 parameter, ₹2,999) 55 ke upar ke liye hai, jismein heart, haddi aur sugar ek saath dekhi jaati hai.",
      "Chunne ka niyam ek hi hai — apna risk dekhiye, price nahi. Parivaar me diabetes ya dil ki bimari chali aa rahi ho to HbA1c, lipid aur kidney ke marker sabse upar rakhiye. Jinka kaam chhat ke neeche hi katta hai aur dhoop mushkil se milti hai, unke liye Vitamin D aur B12 zyada matlab rakhte hain. Aur 55 ke baad screening ek baar ki cheez nahi rehti — usi panel ko har saal dohrana hi uska poora faayda deta hai.",
      "Poora package ek hi sample me nipat jaata hai aur zyadatar package fasting maangte hain, isliye subah ka slot lijiye. Ghar ke kai log saath karaa rahe hain to sabka ek hi slot — ek visit, ek trip, aur sabke number ek hi date ke, jinhe aapas me padha ja sake.",
    ],
  },

  {
    id: "lab-test-price-gorakhpur",
    h: "Gorakhpur Me Lab Test Price Aur Rate List",
    p: [
      "Is page par har card par jo price likha hai, wahi dena hai — home sample collection uske upar free hai. Na visiting charge, na travel charge, na bill ke aakhir me judne wali koi fee. Sheher me auto ka dono taraf ka kiraya aur report lene ka doosra chakkar bach jaata hai, isliye ghar par karane me asli kharcha kam padta hai, zyada nahi.",
      "Rate list: Blood Sugar ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1,000, Vitamin B12 ₹1,200 aur Dengue (NS1, IgG, IgM) ₹1,200.",
      "Package me bachat sabse zyada hai: Basic Full Body ₹999 (45 parameter), Advanced ₹1,999 (72 parameter) aur Senior Citizen Pack ₹2,999 (88 parameter). Yahi test ek-ek kar ke karane par bill kai guna upar chala jaata hai.",
      "Fever Panel (malaria, typhoid aur dengue ek saath) jaise kuch test us waqt ki zaroorat par tay hote hain, isliye unke card par 'Call for price' likha rehta hai — phone par pooch lijiye, sample lene se pehle price bata diya jaata hai. Payment sample ke waqt hi hota hai, cash ya UPI se (PhonePe, Google Pay, Paytm).",
    ],
  },

  {
    id: "prepare-for-test-gorakhpur",
    h: "Sample Se Pehle — Fasting Ke Niyam Aur Do Aam Galtiyan",
    p: [
      "Fasting sirf kuch test me chahiye: Fasting Blood Sugar, Lipid Profile aur zyadatar full body package. 10 se 12 ghante, aur saada paani peete rehna zaroori hai — paani ki kami se nas dhoondhna mushkil hota hai aur haemoglobin, urea tatha creatinine jhoothe taur par badhe hue aate hain. CBC, Thyroid Profile, HbA1c, Vitamin D aur B12 me fasting bilkul nahi chahiye.",
      "Pehli aam galti: subah ki chai. \"Sirf ek chai\" se sugar aur lipid dono badal jaate hain, aur wahi test dobara karana padta hai. Doodh wali chai, biscuit, toffee, gutkha — fasting sample se pehle kuch bhi nahi, sirf saada paani. Raat ka khana 9 baje tak khatam kijiye aur subah 6 se 8 ka slot lijiye; 14 ghante se zyada bhookhe rehna result sudharta nahi, bigadta hai.",
      "Doosri aam galti: thyroid ki goli test se pehle le lena. Wo sample dene ke BAAD leni chahiye, warna T4 jhootha hi zyada dikhega aur dose galat adjust ho sakta hai. Isi tarah biotin ya multivitamin kisi bhi hormone test se 2 se 3 din pehle band kar dena chahiye — biotin assay me interfere karta hai.",
      [
        "Baaki: lipid ya LFT se 24 ghante pehle sharaab bilkul nahi, aur kidney function ya CPK se ek din pehle bhaari mehnat ya gym nahi. Apni rozana ki dawa usi samay lijiye jab tak doctor mana na kare, aur phlebotomist ko bata dijiye ki aap kya-kya le rahe hain. Poori taiyaari ki list ",
        { text: "is guide me", href: GUIDE_FASTING },
        " hai.",
      ],
    ],
  },

  {
    id: "reports-gorakhpur",
    h: "Report Kab Aur Kaise Milegi — 24 Ghante Me WhatsApp Par PDF",
    p: [
      "Routine test — CBC, sugar, lipid, LFT, KFT, thyroid, urine routine — ki report 24 ghante ke andar aa jaati hai. Vitamin aur hormone me bhi lagbhag utna hi. Culture jaan-boojh kar dheere hote hain: urine ya blood culture me 48 se 72 ghante lagte hain, kyunki pehle organism ugaana padta hai aur uske baad hi pata chalta hai ki kaunsi dawa asar karegi — isse jaldi ka vaada koi lab imaandari se nahi kar sakti.",
      "Report WhatsApp aur email dono par PDF me jaati hai. Gorakhpur me iska ek khaas faayda hai: OPD me number lagne par report phone me hi rehti hai — na file dhoondhni padti hai, na kagaz mudta hai, bas kholni hoti hai. Purani report bhi phone me rakhiye; doctor ko aaj ka number nahi, teen saal ka rukh dekhna hota hai.",
      [
        "Number ko hamesha report par chhapi range se milaiye, internet ke chart se nahi. Thoda high ya low hona bahut aam hai aur aksar koi bimari nahi — ye diagnosis nahi, doctor se poochne ka ishaara hai. Report padhne ka poora tareeka ",
        { text: "yahan samjhaya gaya hai", href: GUIDE_REPORT },
        ".",
      ],
      [
        "Kuch result usi din doctor maangte hain, intezaar nahi: tezi se girta platelet count, bahut zyada sugar ke saath ulti ya susti, bahut kam haemoglobin, ya badha creatinine ke saath peshab kam hona. Aur report ke baad likhi hui dawa aas-paas ke jilon me ghar tak pahunchti hai — jaise ",
        { text: "Deoria me medicine delivery", href: MEDICINE_DEORIA },
        ".",
      ],
    ],
  },

  {
    id: "how-to-book-gorakhpur",
    h: "Gorakhpur Me Booking — Form Bhariye Ya Ek Call Kar Dijiye",
    p: [
      "Upar se test ya package chuniye aur form bhar dijiye — naam, mobile, ilaaka aur landmark. Ya seedha phone kar lijiye. Doctor ka parcha hai to uska photo saath rakhiye; usi ke hisaab se panel book ho jaata hai aur naam ki galti ki gunjaish khatam ho jaati hai.",
      "Slot chunte waqt sirf ek baat yaad rakhni hai — fasting wale test subah ke slot me. Booking confirm hone ke baad phlebotomist aam taur par 60 minute me pahunch jaata hai, ID card ke saath. Sample dene se pehle wo card dekh lena aapka haq hai, aur poochne me kuch galat nahi.",
      "Visit lagbhag 10 minute ki hoti hai. Payment usi waqt, cash ya UPI se. Uske baad aapko kuch nahi karna — report taiyaar hote hi WhatsApp aur email par PDF khud aa jaayegi.",
      [
        "Aur agar kal kisi doctor ke saath appointment hai, to aaj hi sample de dijiye — kal report haath me hogi. Kuch bhi confusion ho, ya aapka mohalla list me na dikhe, to ",
        { text: "contact page", href: CONTACT },
        " par number hai. Parche ke hisaab se sahi panel bata dena isi kaam ka hissa hai.",
      ],
    ],
  },

  {
    /* Devanagari section, ek baar.
       Gorakhpur me bahut si search Hindi me type hoti hai. Poore page ko
       transliterate karna galat hota — baaki copy Hinglish me hai aur wahi log
       padhte hain. Ek section me Devanagari dono cover kar deta hai. Ye upar
       likhi baaton ka saar hai, naya daawa nahi. Deoria ke Hindi section se
       jaan-bujh kar alag likha gaya hai: wahan zor "Gorakhpur mat jaaiye" par
       tha, yahan "OPD se pehle report" par. */
    id: "gorakhpur-lab-test-hindi",
    h: "गोरखपुर में लैब टेस्ट — घर से सैंपल कलेक्शन की पूरी जानकारी (हिंदी में)",
    p: [
      "गोरखपुर में जांच कराने की सबसे बड़ी दिक्कत लैब ढूँढना नहीं, भीड़ है। एम्स, बीआरडी और ज़िला अस्पताल — तीनों यहीं हैं, इसलिए आसपास के पूरे इलाके के मरीज़ इसी शहर में आते हैं, और सुबह 7 से 10 बजे के बीच हर काउंटर पर लाइन लगती है।",
      "सबसे ज़्यादा फ़ायदा तब होता है जब डॉक्टर से दिखाना हो। पर्चे पर जांच लिखी है तो अपॉइंटमेंट से एक दिन पहले घर पर सैंपल दे दीजिए — रिपोर्ट 24 घंटे में आ जाएगी और आप ओपीडी में रिपोर्ट लेकर जाएँगे। दो चक्कर का काम एक में। ऑपरेशन या भर्ती से पहले वाली जांच में भी यही तरीका काम करता है।",
      "होम सैंपल कलेक्शन बिल्कुल मुफ़्त है — आप सिर्फ़ टेस्ट का वही दाम देते हैं जो कार्ड पर लिखा है। सुबह 6 बजे से स्लॉट शुरू हो जाते हैं, ताकि खाली पेट वाली जांच जल्दी निपटे और आप तुरंत नाश्ता कर सकें। रिपोर्ट व्हाट्सएप और ईमेल पर पीडीएफ में आती है।",
      "रेट लिस्ट: ब्लड शुगर ₹100, सीबीसी ₹400, थायरॉइड प्रोफाइल ₹550, एचबीए1सी ₹600, लिवर फंक्शन टेस्ट ₹600, किडनी फंक्शन टेस्ट ₹700, लिपिड प्रोफाइल ₹800, विटामिन डी ₹1,000, विटामिन बी12 ₹1,200, डेंगू ₹1,200। फुल बॉडी चेकअप ₹999 (45 पैरामीटर), एडवांस ₹1,999 (72) और सीनियर सिटिज़न पैक ₹2,999 (88)।",
      "सैंपल गोलघर, सिविल लाइंस, बेतियाहाता, मोहद्दीपुर, तारामंडल, रुस्तमपुर, मेडिकल कॉलेज रोड, गोरखनाथ और कुँवराघाट के साथ-साथ सहजनवा, पिपराइच, चौरी चौरा, बांसगांव, कैम्पियरगंज और खजनी जैसे कस्बों में भी लिया जाता है। पता लिखते समय कोई लैंडमार्क ज़रूर डालिए।",
      "⚠ बच्चे को तेज़ बुखार के साथ झटके, बेहोशी, गर्दन में अकड़न या लगातार उल्टी हो — तो जांच बुक मत कीजिए, सीधे नज़दीकी अस्पताल ले जाइए। यह आपात स्थिति है और इसमें देर ख़तरनाक है।",
    ],
  },
];

/**
 * Gorakhpur's own FAQs.
 *
 * The generated defaults ask the same seven questions for every city with the
 * name swapped, which is exactly the duplication that keeps a third city out of
 * the index — and the FAQ block is the part Google is most likely to lift into a
 * rich result, so near-identical answers across cities actively hurt.
 *
 * These are questions a Gorakhpur reader has and a Deoria or Varanasi reader
 * does not: I have an OPD slip, I have an operation date, the counters are
 * packed in the morning, I am coming in from outside the district. The two that
 * decide a booking are placed first — page.js renders the first eight.
 *
 * `links` is optional per FAQ and renders UNDER the answer, never inside the
 * schema text: the JSON-LD has to mirror the readable answer exactly, so the
 * links live outside `a`. See LabFaq.
 */
export const gorakhpurFaqs = [
  {
    q: "Kal doctor ko dikhana hai aur parche par test likhe hain — kya report kal tak mil jaayegi?",
    a: "Haan. Zyadatar routine test ki report 24 ghante ke andar aa jaati hai, isliye appointment se ek din pehle subah ka slot le lijiye. Agle din aap OPD me report le kar jaayenge aur doctor usi visit me dawa likh dega — do trip ka kaam ek me. Booking ke waqt parche ka photo bhej dijiye taaki wahi panel liya jaaye jo likha hai; test ke naam aksar milte-julte hote hain.",
  },
  {
    q: "Gorakhpur me lab test ka kitna kharcha hai, aur kya home collection free hai?",
    a: "Home sample collection free hai — aap sirf test ka wahi price dete hain jo card par likha hai, koi visiting charge ya hidden fee nahi. Blood Sugar ₹100, CBC ₹400, Thyroid Profile ₹550, HbA1c ₹600, Lipid Profile ₹800, aur Basic Full Body Checkup ₹999 se. Fever Panel jaise kuch test par 'Call for price' likha rehta hai — sample lene se pehle price bata diya jaata hai. Payment cash ya UPI se, sample ke waqt.",
  },
  {
    q: "Operation se pehle wale test bhi ghar par ho jaayenge?",
    a: "Blood aur urine wale saare test ghar par ho jaate hain — CBC, blood group aur Rh typing, sugar, KFT, LFT aur HBsAg, Anti-HCV tatha HIV screening. Kuch surgery me PT/INR bhi maanga jaata hai. Lekin list hamesha apne hospital ki maanie, kyunki har department ki zaroorat alag hoti hai aur ek test chhootne par date aage badh jaati hai. Admission se do-teen din pehle sample de dijiye taaki report waqt par haath me ho.",
  },
  {
    q: "Bachche ko tez bukhar ke saath jhatke aa rahe hain — kya lab test book karun?",
    a: "Nahi. Tez bukhar ke saath jhatke, behoshi, gardan akadna, lagatar ulti ya bahut susti ho to seedha najdeeki hospital le jaaiye — ye emergency hai aur ismein der khatarnak hai. Gorakhpur–Kushinagar–Maharajganj belt me barsaat ke baad bachchon me dimaagi bukhar (AES / Japanese Encephalitis) ke maamle aate rahe hain. Home sample collection ka intezaar mat kijiye; blood test iska pehla jawab nahi hai.",
  },
  {
    q: "Gorakhpur me aap kaun kaun se mohalle aur kasbe cover karte hain?",
    a: "Sheher me Golghar, Civil Lines, Betiahata, Mohaddipur, Taramandal, Rustampur, Medical College Road, Asuran, Shahpur, Gorakhnath, Kunraghat, Rapti Nagar, Khorabar aur aas-paas ke mohalle. Jile me Sahjanwa, Pipraich, Chauri Chaura, Bansgaon, Campierganj, Gola Bazar, Khajni aur Barhalganj. Aapka mohalla is list me na ho to ek call kar lijiye — cover hone par usi waqt slot ban jaayega. Pata likhte waqt landmark zaroor daaliye, kyunki naye mohalle map par theek nahi aate.",
  },
  {
    q: "Main Kushinagar ya Maharajganj se aa raha hoon — blood test Gorakhpur me karaun ya apne sheher me?",
    a: "Apne sheher me. Blood aur urine ke saare routine test sample par hote hain, aur kis sheher me sample liya gaya isse result par koi farq nahi padta. Gorakhpur aana tab zaroori hai jab MRI, CT scan, endoscopy jaisi imaging ho ya kisi specialist ki OPD me dikhana ho — aur aisi trip se pehle blood test ghar par karwa lena hi sabse samajhdari ka kaam hai, taaki report saath me ho aur ek visit me baat ban jaaye.",
    links: [{ href: LAB_DEORIA, label: "Deoria me lab test" }],
  },
  {
    q: "Kaun se test me khaali pet rehna zaroori hai, aur chai pi sakte hain?",
    a: "Fasting Blood Sugar, Lipid Profile aur zyadatar Full Body Checkup package me 10 se 12 ghante kuch nahi khana hota. Chai bilkul nahi — ek chai se hi sugar aur lipid ki report badal jaati hai aur test dobara karana padta hai. Sirf saada paani, aur wo peete rehna zaroori hai. CBC, Thyroid Profile, HbA1c, Vitamin D aur B12 me koi fasting nahi chahiye. Thyroid ki goli sample dene ke baad leni chahiye, pehle nahi.",
  },
  {
    q: "Gorakhpur me lab chunte waqt kya dekhna chahiye?",
    a: "Do cheezein report par dikhti hain aur bahut kuch bata deti hain: test ka method likha hai ya nahi (jaise CLIA ya ECLIA), aur reference range report par khud chhapi hai ya nahi. Teesri baat khud karni hoti hai — jo number aap mahino track kar rahe hain, jaise HbA1c, TSH ya creatinine, unke liye lab badalte mat rahiye. Alag analyser ki range thodi alag hoti hai, isliye ek jagah TSH 4.5 aur doosri jagah 4.1 aane ka matlab thyroid ka badalna nahi hota.",
  },
];
