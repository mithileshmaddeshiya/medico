/**
 * /lab-test/khalilabad — the district's long-form copy and its FAQs.
 *
 * ── WHAT THIS PAGE ARGUES THAT NO OTHER PAGE HERE DOES ───────────────────
 * Khalilabad is the headquarters of Sant Kabir Nagar, and its geography is the
 * whole reason this copy exists rather than a template with the name swapped:
 * it sits almost exactly BETWEEN two bigger cities — Gorakhpur roughly 40 km
 * east, Basti roughly 35 km west — on the main Gorakhpur–Lucknow line.
 *
 * Every other city here argues some version of "the big labs are far away, skip
 * the journey". That argument does not fit this town, because here the labs are
 * not far. Both cities are an hour away and people go to both. So the argument
 * this page makes is the opposite one, and it is this page's own:
 *
 *   1. CONTINUITY, NOT DISTANCE. Because two cities are equally close, a
 *      household's tests end up scattered — HbA1c in Gorakhpur in March, the
 *      next one in Basti in June, a third somewhere local in September. Three
 *      machines, three method-dependent reference ranges, and a doctor who
 *      cannot tell a real change from a laboratory one. Home collection's value
 *      here is that it is ONE place, reachable without deciding anything.
 *   2. THE COMMUTER. This is a daily up-down belt: the station is on the main
 *      line and a large share of working people leave for Gorakhpur or Basti in
 *      the morning and return at night. A lab queue does not fit into that day
 *      at either end, which is why prescriptions sit for weeks. A 6 AM slot at
 *      home does fit — sample first, train after.
 *   3. THE TWO NAMES. The district is Sant Kabir Nagar, the town is Khalilabad,
 *      and Magahar — where Kabir's memorial stands — is a few kilometres away.
 *      People search both names, and unlike Kushinagar/Padrauna there is only
 *      ONE page here, so it carries both on purpose. Mau does the same with
 *      "Maunath Bhanjan"; see content/mau.js.
 *
 * The blocks and their villages — Mehdawal, Dhanghata, Bakhira, Hainsar Bazar,
 * Santha, Baghauli, Nath Nagar, Semariyawan, Pauli, Belhar Kala — get the
 * coverage section, with the address advice this district actually needs.
 *
 * ── CLAIMS ───────────────────────────────────────────────────────────────
 * Only the confirmed set: free home collection, a trained phlebotomist with an
 * ID card, slots from 6 AM, reports within 24 hours for routine tests, cash/UPI
 * at collection, a confirmation call in about 30 minutes, a visit of about 10
 * minutes. NOT claimed anywhere, however well it would rank: NABL
 * accreditation, pathologist verification, cold-chain transport, barcoded
 * tubes, a lab open 24 hours, or a walk-in counter of ours anywhere in this
 * district. There is none, and this page says so in plain words.
 *
 * ⚠ THE TITLE PROMISES "Report in 24 Hours". That is the strongest promise in
 * the section's titles, so the page has to qualify it honestly and it does, in
 * two places: the report section and the last FAQ — routine pathology in 24
 * hours, cultures in 48 to 72 hours because an organism has to be grown first.
 * If that qualification is ever edited out, change the title too.
 *
 * Clinically only the uncontroversial: dengue NS1's 1–5 day window, Widal
 * needing 5–7 days of fever, HbA1c quarterly for a diabetic, urine
 * microalbumin as the earliest diabetic-kidney signal, B12 deficiency being
 * common on a vegetarian diet, TSH repeated 6–8 weeks after a dose change,
 * liver enzymes worth watching on long-running medication.
 *
 * The AES / Japanese Encephalitis warning is written here in this page's own
 * words rather than copied from content/kushinagar.js. It tells a parent NOT to
 * book a test and to go to a hospital, and it must never be softened into a
 * booking prompt.
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

const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_DEORIA = "/lab-test/deoria";
const LAB_LUCKNOW = "/lab-test/lucknow";

/* The guides that exist under content/blogs/deoria/ — the nearest belt's own
   reading. Every href is checked against a real file; there is no
   content/blogs/khalilabad/ yet, and linking to one that does not exist would
   put a 404 in the body copy of a brand-new page. */
const GUIDE_LAB_TEST = "/blogs/lab-test/deoria";
const GUIDE_PATHOLOGY = "/blogs/pathology-lab/deoria";
const GUIDE_HOME_COLLECTION = "/blogs/home-sample-collection/deoria";
const GUIDE_FULL_BODY = "/blogs/full-body-checkup/deoria";
const GUIDE_DIABETES = "/blogs/diabetes-thyroid-test/deoria";
const GUIDE_LIVER_KIDNEY = "/blogs/liver-kidney-test/deoria";
const GUIDE_VITAMIN = "/blogs/vitamin-b12-d-test/deoria";
const GUIDE_DENGUE = "/blogs/dengue-typhoid-test/deoria";

export const khalilabadContent = [
  {
    id: "lab-test-in-khalilabad",
    h: "Khalilabad Me Lab Test — Ghar Baithe Blood Test Booking Aur Free Home Sample Collection",
    p: [
      "Khalilabad ki jagah hi is sheher ki sabse badi soodhkarta aur sabse badi dikkat, dono hai. Gorakhpur kareeb 40 kilometre poorab, Basti kareeb 35 kilometre paschim, aur beech me ye kasba — main line ke station ke saath. Bade lab dono taraf hain, aur dono ek ghante ki doori par. Isliye yahan ka reader ye nahi kehta ki lab door hai. Wo ye kehta hai ki \"kara lenge, Gorakhpur jaate hi hain\" — aur wahi parcha teen hafte jeb me pada rehta hai.",
      "Home sample collection is aadat ko tod deta hai. Aap Khalilabad me apna pata dete hain, subah ka slot chunte hain, aur trained phlebotomist ID card ke saath aapke darwaze par aata hai. Sample wahin liya jaata hai, poori visit lagbhag 10 minute ki hoti hai, aur routine test ki report 24 ghante ke andar WhatsApp aur email par PDF me aa jaati hai. Na kisi sheher ka faisla, na line, na report lene ka doosra chakkar.",
      "Yahan routine pathology ke saare test aur health package book hote hain — CBC, Thyroid Profile (TSH), Blood Sugar, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test, Vitamin D, Vitamin B12, Dengue, Urine Routine aur Full Body Checkup. Doctor ka parcha hai to usi panel ke hisaab se booking ho jaati hai; koi test is page par naam se na dikhe to parche ke saath ek call kar lijiye.",
      "Collection sirf Khalilabad sheher tak nahi hai. Magahar, Mehdawal, Dhanghata, Bakhira, Hainsar Bazar, Santha, Baghauli, Nath Nagar, Semariyawan, Pauli aur Belhar Kala jaise kasbe aur unse lage gaon aam taur par cover hote hain — yaani poora Sant Kabir Nagar jila, ek hi rate par.",
    ],
  },

  {
    /* "Khalilabad me pathology lab", "diagnostic centre in Khalilabad", "blood
       test lab near me" — teenon ka intent ek hai: jaana kahan padega. Is page
       ka jawab doosre sheheron se alag hona chahiye, aur hai: yahan tark doori
       ka nahi, is baat ka hai ki sample waise bhi isi sheher se nikalta hai. */
    id: "pathology-lab-diagnostic-centre-khalilabad",
    h: "Khalilabad Me Pathology Lab Ya Diagnostic Centre Dhoondh Rahe Hain?",
    p: [
      "Pehle ek baat saaf kar dena theek rahega: hamara koi walk-in counter Khalilabad me nahi hai, aur is page par kahin ye nahi likha jaayega ki hai. Ye home collection service hai — hum aapke ghar se sample lete hain, aur wahi sach hai jo yahan likha hai.",
      "Ab wo baat jo yahan sabse zyada kaam ki hai. Is sheher me jo collection point hain, unmein se zyadatar sirf sample lete hain; jaanch aksar Gorakhpur ya Basti ki badi lab me hoti hai aur report wahin se banti hai. Yaani sample ko safar to karna hi hai — chahe wo aapke ghar se nikle ya bazaar ke counter se. Sawaal sirf itna hai ki us safar ki shuruaat kahan se ho, aur ismein aapka aadha din lage ya na lage.",
      [
        "Blood aur urine ke saare aam test sirf sample par hote hain, isliye ghar se shuruaat karna kisi tarah kam bharosemand nahi hai. Darwaze par kya hota hai aur kaun sa test ghar par ho jaata hai — wo poora ",
        { text: "ghar par sample wali guide", href: GUIDE_HOME_COLLECTION },
        " me likha hai, aur lab chunne se pehle kya poochhna chahiye wo ",
        { text: "pathology lab wali guide", href: GUIDE_PATHOLOGY },
        " me.",
      ],
      "Jo jaanch ghar par nahi ho sakti, uske baare me bhi saaf rehna theek hai: X-ray, sonography, CT, MRI, endoscopy aur biopsy machine aur doctor par hote hain, sample par nahi. Unke liye jaana hi padega. Ye page unke liye nahi hai aur hum unhe book karne ka daawa nahi karte.",
      "Sample dene se pehle teen cheezein kar lijiye: phlebotomist ka ID card dekh lijiye, doctor ka parcha saamne rakh dijiye taaki wahi panel liya jaaye jo likha hai, aur jis test ke card par 'Call for price' likha hai uska daam pehle pooch lijiye. Home visit ke slot subah 6 baje se shuru hote hain aur shaam tak chalte hain.",
    ],
  },

  {
    /* IS PAGE KA APNA TARK — aur is section ko kabhi kisi doosre sheher ke page
       par mat copy kijiye. Wahan tark doori ka hai; yahan do sheher barabar
       paas hain, isliye samasya doori nahi, bikhraav hai. Yahi wo cheez hai jo
       is page ko Gorakhpur aur Deoria ke page se alag rakhti hai. */
    id: "ek-hi-jagah-se-test-khalilabad",
    h: "Gorakhpur Ek Baar, Basti Doosri Baar — Isi Aadat Se Report Dhokha De Deti Hai",
    p: [
      "Do sheher barabar paas hone ka ek nuksan hai jise yahan koi ginta nahi. Ek baar Gorakhpur me kaam tha, wahin test kara liya. Teen mahine baad Basti me shaadi thi, wahin dobara kara liya. Chauthi baar sheher me hi kisi counter par de diya. Teen report, teen alag jagah — aur doctor ke saamne teen number, jinki aapas me tulna hoti hi nahi.",
      "Wajah samajh lena zaroori hai, kyunki isse ghabrahat bhi kam hoti hai. Har lab ki machine aur method thode alag hote hain, aur isi wajah se report par chhapi reference range bhi alag hoti hai. Ek jagah TSH 4.5 aata hai aur doosri jagah 4.1 — iska matlab ye nahi ki teen mahine me aapka thyroid badal gaya. Doctor ilaaj number dekh kar nahi, badlav dekh kar tay karta hai; aur badlav tabhi dikhta hai jab pichhli aur agli report ek hi tarah se bani ho.",
      "Ye baat un teen-chaar test par sabse zyada lagti hai jo log saalon dohrate hain: HbA1c, TSH, creatinine aur haemoglobin. Sugar ka ilaaj chal raha ho, thyroid ki goli chal rahi ho, ya kidney par nazar rakhni ho — inhe hamesha ek hi jagah se karaiye. Sasta-mehnga baad ki baat hai; pehli baat ek jagah tay karna hai.",
      "Ghar se sample dene ka asli faayda yahan yahi hai. Har baar shehar chunna nahi padta, mausam ya kaam ke hisaab se jagah nahi badalti, aur teen saal ki reportein ek hi tarah ki rehti hain — sab aapke phone me PDF ke roop me, ek hi jagah. Purani report sambhal kar rakhiye aur nayi ke saath doctor ko dikhaiye; is ek aadat se jitna faayda hota hai, utna kisi mehnge package se nahi hota.",
      [
        "Aur ye sirf is sheher tak nahi hai. Aap kaam ya ilaaj ke silsile me kuch mahine kisi doosre sheher me rehte hain to wahi service wahan bhi chalti hai — ",
        { text: "Gorakhpur me lab test", href: LAB_GORAKHPUR },
        ", ",
        { text: "Deoria me lab test", href: LAB_DEORIA },
        " aur ",
        { text: "Lucknow me lab test", href: LAB_LUCKNOW },
        " — same rate, same tarika. Isliye jagah badalne par bhi aapki report ka silsila tootta nahi.",
      ],
    ],
  },

  {
    /* Doosra apna section. Ye belt rozana up-down karti hai — station main line
       par hai — aur isi wajah se parcha hafton pada rehta hai. Kisi aur sheher
       ke page par ye tark nahi hai; Gorakhpur ka page uske ULTA hai (wahan
       reader OPD ke liye aata hai, yahan se reader kaam par jaata hai). */
    id: "roz-up-down-karne-walon-ke-liye-khalilabad",
    h: "Roz Gorakhpur Ya Basti Aana-Jaana Hai? Subah 6 Baje Wala Slot Isi Ke Liye Hai",
    p: [
      "Is kasbe ki badi aabadi rozana bahar nikalti hai — koi Gorakhpur, koi Basti, koi paas ke bazaar. Train aur gaadi ka waqt tay hai; lab me number lagne ka waqt tay nahi hai. Isi ek farq ki wajah se yahan test tab hota hai jab tabiyat bigadti hai, tab nahi jab doctor likhta hai.",
      "Home visit ke slot subah 6 baje se shuru hote hain, aur is aadat ke liye ye sabse kaam ka waqt hai. Fasting wala sample nikalne se pehle ho jaata hai, aap turant naashta karke nikal jaate hain, aur report shaam tak ya agli subah tak phone par aa jaati hai — jise aap raste me hi doctor ko forward kar sakte hain. Ek bhi chhutti nahi lagti, aur yahi wajah hai ki test tal-ta nahi.",
      "Ghar par koi aur bhi jaanch karani hai — maa-baap, dada-dadi, bachche — to sabki booking ek hi slot me kar dijiye. Ek hi visit me sabka sample ho jaata hai, aur aapko sirf ek subah nikaalni padti hai. Bujurg hain, bistar par hain, diabetic hain jinki nas patli ho gayi hai, ya pehle sample lene me dikkat aayi hai — ye booking ke waqt bata dijiye, taaki aane wala taiyaari ke saath aaye.",
      "Aap khud bahar rehte hain aur ghar walon ka test karana hai to bhi booking aap hi kar sakte hain. Ghar ka pata, ek landmark, aur wahan maujood kisi ka chalu mobile number dijiye — aur bata dijiye ki confirmation call kis number par aani chahiye. Wo call aam taur par 30 minute ke andar aati hai. Payment sample lene ke waqt hota hai, cash ya UPI se, isliye ghar walon par bojh bhi nahi rehta.",
    ],
  },

  {
    /* Naam wala section. Jila Sant Kabir Nagar, mukhyalaya Khalilabad — aur
       search dono naamon se hoti hai. Yahan Kushinagar/Padrauna wali sthiti
       NAHI hai (wahan do page hain, isliye naam bant gaye); yahan ek hi page
       hai, isliye ye dono naam khud carry karta hai — Mau ki tarah. */
    id: "sant-kabir-nagar-khalilabad-naam",
    h: "Sant Kabir Nagar Me Lab Test — Jila Aur Sheher Ka Naam Alag Hai, Service Ek Hi Hai",
    p: [
      "Ek naam ki uljhan pehle hi saaf kar dena theek rahega. Jila Sant Kabir Nagar hai aur uska mukhyalaya Khalilabad hai — do naam, ek hi jagah ke liye. Bahar ka koi vyakti aksar jile ka naam likhta hai aur yahan ka rehne wala sheher ka. Aap \"Khalilabad me blood test\" dhoondhein ya \"Sant Kabir Nagar me lab test\" — ye page dono ke liye hai, aur service poore jile me ek hi rate par hai.",
      "Jile ka naam Sant Kabir ke naam par hai, aur Magahar — jahan unka mazaar aur samadhi dono hain — Khalilabad se bas kuchh hi kilometre par hai. Wahan aur uske aas-paas ke gaon me bhi collection usi tarah hoti hai jaise sheher me: wahi slot, wahi rate, wahi 24 ghante wali report.",
      "Ye baat isliye likhi hai ki naam ki uljhan booking me der karati hai. Log soch lete hain ki jo service \"Sant Kabir Nagar\" ke naam se dikh rahi hai wo shayad kisi aur kasbe ki hai, ya ye ki sheher ke bahar wale gaon me nahi aayegi. Aisa kuch nahi hai. Pata likhte waqt jila, block aur apne gaon ka naam likh dijiye — baaki hum sambhaal lete hain.",
    ],
  },

  {
    id: "home-sample-collection-mehdawal-dhanghata-bakhira",
    h: "Mehdawal, Dhanghata, Bakhira Aur Hainsar Bazar Tak Home Sample Collection — Pata Kaise Likhein",
    p: [
      "Sample Khalilabad sheher ke saath Magahar, Mehdawal, Dhanghata, Bakhira, Hainsar Bazar, Santha, Baghauli, Nath Nagar, Semariyawan, Pauli aur Belhar Kala tak liya jaata hai, aur in kasbon se lage gaon bhi aam taur par cover hote hain. Aapka gaon is list me naam se nahi hai to maan kar mat baithiye ki service nahi hai — booking se pehle ek call kar lijiye. Cover hota hai to usi call par slot book ho jaayega, aur nahi hota to hum saaf bata denge, taaki aap intezaar kar ke pareshan na hon.",
      "Is jile me pata likhne ka tarika visit ke waqt par sabse zyada asar daalta hai — doori se zyada. Gaon ka naam akela kaafi nahi hota: tola ya purwa ka naam likhiye, saath me block aur gram panchayat, post office ya thana ka naam, aur ek aisa landmark jo har koi jaanta ho — primary school, mandir ya masjid, block office, bank, petrol pump, chauraha ya bijli ka transformer. Ek hi naam ke do gaon paas paas hona yahan aam baat hai.",
      "Bakhira aur Dhanghata ki taraf ke neeche wale ilaakon ke liye ek baat aur jod dijiye: pahunchne ka rasta kaunsa hai, kis bandh, pul ya chauraha se mudna hai. Barsaat ke mahino me kai link road par paani aa jaata hai aur rasta badalna padta hai. Ye booking ke waqt bata dena poori visit ko aasan kar deta hai, aur slot bhi usi hisaab se rakha jaata hai.",
      "Mobile number wahi dijiye jo us waqt chalu rahega, aur ho sake to ek doosra number bhi likh dijiye. Kai gaon me network ek hi kone me aata hai, aur ghar ka aadmi subah khet ya kaam par nikal jaata hai — phlebotomist ka ek call chhoot jaane se poori visit atak jaati hai.",
    ],
  },

  {
    id: "bukhar-dengue-typhoid-khalilabad",
    h: "Khalilabad Me Dengue, Typhoid Aur Malaria Test — Bukhar Ke Kis Din Kaunsa Test",
    p: [
      "Barsaat ke baad, July se November ke beech, bukhar ka bojh yahan sabse zyada rehta hai — khaas kar un gaon me jahan paani ruk jaata hai. Sabse aam galti bimari pehchan-ne me nahi, din ginne me hoti hai: test sahi hota hai par galat din par, report negative aati hai, aur ilaaj hafta bhar late ho jaata hai.",
      "Niyam seedha hai. Dengue me NS1 antigen bukhar ke pehle 1 se 5 din tak bharosemand hai; paanchve din ke baad wo aksar negative aa jaata hai aur tab IgM antibody karana padta hai. Typhoid me Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye, warna titre badhte hi nahi — aur is ilaake me typhoid endemic hai, isliye purane infection se bhi Widal positive aa sakta hai; sirf usi par ilaaj tay karna theek nahi. Typhidot IgM jaldi positive hota hai. Thand aur kanpkanpi ho to malaria antigen aur peripheral smear jodiye. Jo bhi karayein, CBC saath me zaroor karwaiye — girta platelet count wahi cheez hai jo roz dekhi jaati hai.",
      "Bukhar me ghar se nikalna sabse bhaari kaam hota hai, aur yahi wo waqt hai jab ghar par sample lena sabse zyada kaam aata hai. Slot subah ka lijiye, kyunki bukhar ka panel aksar do-teen din baad dohrana padta hai aur ek hi samay par dohrana behtar rehta hai.",
      [
        "Ek chetavani, jise halka mat leejiye — aur is par hamara jawab \"book kar lijiye\" NAHI hai. Bachche ko tez bukhar ke saath jhatke aayein, behoshi ho, gardan akad jaaye, lagatar ulti ho ya wo sust pada rahe aur pehchan na paaye — to lab test book mat kijiye. Seedha najdeeki aspatal le jaaiye: Khalilabad ka zila aspatal, ya Gorakhpur ka BRD, jo bhi pahunch me ho. Gorakhpur–Basti belt me barsaat ke baad bachchon me dimaagi bukhar (AES / Japanese Encephalitis) ke maamle aate rahe hain; ismein ek-ek ghanta maayne rakhta hai aur home collection ka intezaar khatarnak hai. Bukhar saada ho — jhatke nahi, behoshi nahi — to kis din kaunsa panel lena hai, wo ",
        { text: "dengue aur typhoid wali guide", href: GUIDE_DENGUE },
        " me detail me hai.",
      ],
    ],
  },

  {
    id: "sugar-thyroid-hba1c-khalilabad",
    h: "Khalilabad Me Sugar Test, Thyroid Test (TSH) Aur HbA1c — Kis Mahine Kaunsa",
    p: [
      "Sugar aur thyroid do sabse zyada karaye jaane wale test hain, aur do sabse zyada galat samay par karaye jaane wale bhi. Blood Sugar Fasting khaali pet hota hai aur PP khaana khaane ke theek 2 ghante baad — ye do alag sample hain, ek nahi. HbA1c teen mahine ka ausat batata hai, ek hi sample me, aur ismein fasting nahi chahiye. Isliye \"aaj sugar theek hai\" aur \"teen mahine se sugar theek hai\" do alag baatein hain, aur ilaaj doosri par tay hota hai.",
      "Diabetes ka ilaaj chal raha hai to saal ka hisaab seedha rakhiye: har teen mahine me HbA1c, saal me ek baar Lipid Profile, aur saal me ek baar Kidney Function Test ke saath urine microalbumin. Microalbumin wahi test hai jo sabse pehle ishaara deta hai ki kidney par asar shuru ho raha hai, aur wahi sabse zyada chhoda jaata hai — kyunki use alag se likhwana padta hai.",
      "Thyroid me Total aur Free alag test hain. Parche par T3/T4/TSH likha ho to Thyroid Profile, aur FT3/FT4 likha ho to free wala. Dawa chal rahi ho to dose badalne ke 6 se 8 hafte baad TSH dohraiye, uske baad har 6 se 12 mahine me. Thyroid ki goli sample dene ke baad leni chahiye, pehle nahi — aur biotin ya multivitamin kisi bhi hormone test se 2 se 3 din pehle band kar dena chahiye.",
      [
        "In dono ka poora hisaab — fasting, PP ya HbA1c me se kaunsa kab, aur TSH kis din — ",
        { text: "sugar aur thyroid wali guide", href: GUIDE_DIABETES },
        " me hai. Aur yaad rahe: inhe hamesha ek hi jagah se dohraiye, warna number ka farq bimari ka nahi, machine ka nikal aata hai.",
      ],
    ],
  },

  {
    id: "lft-kft-vitamin-khalilabad",
    h: "Lambi Chalne Wali Dawa, LFT, KFT Aur Vitamin D–B12 Test Khalilabad Me",
    p: [
      "Ek baat jo yahan aksar chhoot jaati hai: jin logon ki dawa lambe samay se chal rahi hai — TB ki dawa, mirgi ki dawa, BP ya sugar ki goli, ya dard ki dawa jo mahino se chal rahi ho — unke liye samay samay par liver aur kidney dekhna ilaaj ka hissa hai, alag kharcha nahi. Liver Function Test bilirubin, SGOT aur SGPT dekhta hai; Kidney Function Test urea, creatinine aur uric acid, aur uske saath urine routine.",
      "LFT karana kab zaroori ho jaata hai: aankh ya peshab me peelapan, lagatar kamzori, bhookh na lagna, ya pet ke daayein-upar dard. Sharaab lete hain to LFT aur Lipid Profile se kam se kam 24 ghante pehle bilkul na lein — ek shaam ki peene se hi triglycerides aur liver enzymes kaafi badh jaate hain, aur report bewajah ki ghabrahat de deti hai. KFT se ek din pehle bahut bhaari mehnat avoid kijiye, aur paani kam mat peejiye: paani ki kami se urea aur creatinine jhoothe taur par badhe hue aate hain.",
      "Vitamin D aur B12 me fasting nahi chahiye, aur in dono ki kami is ilaake me bahut aam hai. Din bhar andar ya gaadi me rehne walon me Vitamin D ki kami milti hai, aur shudh shakahari khana chalne wale gharon me B12 ki — jo sirf khoon nahi, nason par bhi asar daalti hai: haath-pair me jhunjhuni, sunnpan aur yaaddasht ki dikkat.",
      [
        "Ye chaaron test ek hi sample me ho jaate hain, isliye alag alag din nikaalne ki zaroorat nahi. Kaunsa number kis had ke baad dekhne layak hai wo ",
        { text: "liver aur kidney wali guide", href: GUIDE_LIVER_KIDNEY },
        " me hai, aur vitamin ki kami ke lakshan aur ilaaj ",
        { text: "Vitamin B12 aur D wali guide", href: GUIDE_VITAMIN },
        " me.",
      ],
    ],
  },

  {
    id: "full-body-checkup-khalilabad",
    h: "Khalilabad Me Full Body Checkup Package — 45, 72 Aur 88 Parameter Wale Plan",
    p: [
      "Achha full body checkup parameter ki ginti se nahi, coverage se tay hota hai. Kam se kam paanch cheezein aani chahiye: blood count (CBC), sugar, dil ke liye lipid profile, liver function, aur kidney function ke saath urine routine. Iske upar thyroid, Vitamin D aur B12 jud jaayein to package se sach me kuch pata chalta hai.",
      "Basic Full Body Checkup (45 parameter, ₹999) un logon ke liye theek hai jinki umar kam hai aur koi shikayat nahi — saal ka ek baseline ban jaata hai. Advanced Full Body (72 parameter, ₹1,999) me thyroid, HbA1c aur vitamins jud jaate hain; 30 se 50 saal walon ke liye yahi sabse sahi baithta hai. Senior Citizen Pack (88 parameter, ₹2,999) 55 ke upar ke liye hai, jismein dil, haddi aur sugar ki screening ek saath hoti hai.",
      "Package apne risk ke hisaab se chuniye, daam ke hisaab se nahi. Ghar me diabetes ya dil ki bimari chali aa rahi hai to HbA1c, lipid aur kidney markers ko priority dijiye. Aur ek galatfehmi door kar lena zaroori hai: full body checkup har bimari nahi pakadta. Ye screening hai — jo cheez chup chaap badh rahi hoti hai use jaldi pakadne ke liye. Koi shikayat pehle se hai to package ke bharose mat baithiye, doctor ko dikhaiye aur wahi test karaiye jo wo kahe.",
      [
        "Poora package ek hi sample me ho jaata hai aur zyadatar package fasting maangte hain, isliye subah ka slot lijiye. Ghar ke kai log ek saath karaa rahe hain to sabka ek hi slot me book kijiye. Umar aur risk ke hisaab se kaunsa level theek rehta hai, wo ",
        { text: "full body checkup wali guide", href: GUIDE_FULL_BODY },
        " me alag se likha hai.",
      ],
    ],
  },

  {
    id: "lab-test-price-khalilabad",
    h: "Khalilabad Me Lab Test Price Aur Rate List — Kaunsa Test Kitne Ka",
    p: [
      "Is page par har card par jo price likha hai, wahi aapko dena hai. Home sample collection uske upar free hai — na visiting charge, na travel charge, na koi hidden fee. Poora amount confirmation call par bata diya jaata hai, sample lene se pehle.",
      "Rate list ye rahi: Blood Sugar ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1,000, Vitamin B12 ₹1,200 aur Dengue (NS1, IgG, IgM) ₹1,200. Rate poore jile me ek hi hai — Khalilabad me jo daam hai, wahi Mehdawal, Dhanghata, Bakhira aur Semariyawan me hai. Doori ke naam par kuch nahi badhta.",
      "Bachat package me sabse zyada hai: Basic Full Body ₹999 me 45 parameter, Advanced Full Body ₹1,999 me 72 parameter, aur Senior Citizen Pack ₹2,999 me 88 parameter. Wahi test alag alag karane par kharcha kai guna ho jaata hai.",
      "Kuch test, jaise Fever Panel (malaria, typhoid aur dengue ek saath), price par nahi balki us waqt ki zaroorat par tay hote hain — unke card par 'Call for price' likha rehta hai. Phone par pooch lijiye; sample dene se pehle daam bata diya jaata hai. Payment sample lene ke waqt hi hota hai — cash ya UPI se, PhonePe, Google Pay ya Paytm.",
    ],
  },

  {
    id: "fasting-taiyari-khalilabad",
    h: "Sample Dene Se Pehle Kya Karein, Kya Na Karein — Fasting Ke Niyam",
    p: [
      "Fasting wale test — Fasting Blood Sugar, Lipid Profile aur zyadatar full body package — me 10 se 12 ghante kuch nahi khana hota. Saada paani peena mana nahi hai, balki zaroori hai: paani ki kami se nas dhoondhna mushkil ho jaata hai aur haemoglobin, urea tatha creatinine jhoothe taur par badhe hue aate hain. Raat ka khana 9 baje tak khatam kar lijiye aur subah 6 se 8 baje ka slot lijiye. 14 ghante se zyada bhookhe rehna faayda nahi, nuksan karta hai.",
      "Fasting sample se pehle chai — doodh wali to bilkul nahi — biscuit, toffee, paan ya gutkha kuch bhi nahi. Ek chai bhi sugar aur lipid ki report badal deti hai, aur phir wahi test dobara karana padta hai. Sirf saada paani.",
      "Bina fasting wale test yaad rakhiye, taaki bewajah bhookhe na rahein: CBC, Thyroid Profile, HbA1c, Vitamin D, Vitamin B12 aur zyadatar bukhar ke panel ke liye khaali pet hone ki zaroorat nahi hai.",
      "Dawa ka aam niyam ye hai ki apni rozana ki goliyan usi samay lijiye, jab tak doctor mana na kare. Do exception hain: thyroid ki goli sample dene ke baad leni chahiye, aur biotin ya multivitamin kisi bhi hormone test se 2 se 3 din pehle band kar dena chahiye. Phlebotomist ko bata dijiye ki aap kaun kaun si dawa le rahe hain.",
    ],
  },

  {
    /* ⚠ Title "Lab Test in Khalilabad — Report in 24 Hours" ka jawab yahi
       section hai. Pehla paragraph us waade ko qualify karta hai — routine 24
       ghante, culture 48 se 72 — aur ye qualification hatani nahi hai. */
    id: "report-khalilabad",
    h: "Report Kab Milegi — 24 Ghante Me WhatsApp Par PDF, Aur Use Kaise Padhein",
    p: [
      "Zyadatar routine test ki report 24 ghante ke andar aa jaati hai — CBC, sugar, lipid, LFT, KFT, thyroid aur urine routine. Vitamin aur hormone me aam taur par utna hi samay lagta hai. Culture is niyam ka apwaad hai aur jaan boojh kar dheere hota hai: urine ya blood culture me 48 se 72 ghante lagte hain, kyunki pehle organism ko ugana padta hai aur uske baad hi pata chalta hai ki kaunsi dawa asar karegi. Isse jaldi ka vaada koi bhi lab imaandari se nahi kar sakta, aur hum bhi nahi karte.",
      "Report WhatsApp aur email dono par PDF me aati hai, aur is belt me iska faayda sabse zyada hai. Doctor Gorakhpur me ho, Basti me, Lucknow me, ya ghar ka koi vyakti bahar kaam kar raha ho — report bas forward kar dijiye. Kagaz le kar bhaagne ki zaroorat nahi, aur report kho jaane ka darr bhi nahi.",
      "Number ko report par chhape reference range se hi milaiye, internet ke kisi chart se nahi. Range machine aur method ke hisaab se badalti hai, aur umar tatha ling ke hisaab se bhi. Thoda sa high ya low hona bahut aam hai aur aksar koi bimari nahi hoti — ye diagnosis nahi, doctor se poochne ka ishaara hai. WhatsApp par report kisi group me mat daaliye; ye aapki niji jaankari hai.",
      [
        "Kuch result me intezaar nahi karna chahiye, usi din doctor chahiye: dengue me tezi se girta platelet count, bahut zyada sugar ke saath ulti ya susti, bahut kam haemoglobin, ya bahut badha creatinine ke saath peshab kam hona. Numbers ka matlab kya hota hai aur kis flag par ghabrana nahi chahiye, ye ",
        { text: "report kaise padhein wale hisse", href: `${GUIDE_LAB_TEST}#report-kaise-padhein` },
        " me detail me likha hai.",
      ],
    ],
  },

  {
    id: "how-to-book-khalilabad",
    h: "Khalilabad Me Lab Test Kaise Book Karein — Online Form Ya Ek Phone Call",
    p: [
      "Is page par apna test ya package chuniye aur booking form bhar dijiye — naam, mobile number, apna gaon ya mohalla, block, aur ek landmark. Ya seedha phone kar dijiye. Doctor ka parcha hai to uska photo saath rakhiye, kyunki panel usi ke hisaab se book hota hai.",
      "Test ke naam milte julte hote hain — Thyroid Profile Total aur Free, Sugar Fasting aur PP, Widal aur Typhidot, LFT aur KFT ke saath urine microalbumin — aur parche ka photo hone par ye galti hoti hi nahi. Parche par sirf \"full body\" likha hai bina detail ke, to bhi photo bhej dijiye; package me kya kya aata hai wo bata diya jaayega.",
      "Booking ke baad confirm karne ke liye call aam taur par 30 minute ke andar aati hai — slot, pata, aur ye ki test me fasting chahiye ya nahi. Aane wale phlebotomist ke paas ID card hota hai; sample dene se pehle use dekh lena aapka haq hai. Poori visit lagbhag 10 minute ki hoti hai aur payment usi waqt hota hai, cash ya UPI se.",
      [
        "Ek aakhri baat: aap Sant Kabir Nagar jile ke kisi aise gaon me hain jo is page par naam se nahi likha, to bhi ek call kar ke pooch lijiye — cover hota hai to wahi slot book ho jaayega, aur nahi hota to hum saaf bata denge. Number aur poora pata ",
        { text: "contact page", href: "/contact" },
        " par mil jaayega.",
      ],
    ],
  },

  {
    /* Devanagari section, ek baar. Is belt me bahut si search Hindi me type hoti
       hai — "खलीलाबाद में लैब टेस्ट", "खून की जांच", "रेट लिस्ट". Poore page ko
       transliterate karna galat hota: baaki copy Hinglish me hai aur wahi log
       padhte hain. Ye upar likhi baaton ka anuvaad hai, naya daawa nahi. */
    id: "khalilabad-lab-test-hindi",
    h: "खलीलाबाद में लैब टेस्ट — घर से सैंपल कलेक्शन की पूरी जानकारी (हिंदी में)",
    p: [
      "खलीलाबाद और संत कबीर नगर में खून की जांच के लिए अब गोरखपुर या बस्ती जाने की ज़रूरत नहीं है। सीबीसी, थायरॉइड (टीएसएच), शुगर, एचबीए1सी, लिपिड प्रोफाइल, लिवर और किडनी फंक्शन टेस्ट, विटामिन डी, विटामिन बी12, डेंगू और फुल बॉडी चेकअप — ये सारी जांच सैंपल पर होती हैं, और सैंपल आपके घर से लिया जा सकता है।",
      "होम सैंपल कलेक्शन बिल्कुल मुफ़्त है। आप सिर्फ़ टेस्ट का वही दाम देते हैं जो कार्ड पर लिखा है — कोई विज़िटिंग चार्ज या छिपा हुआ शुल्क नहीं। सुबह 6 बजे से स्लॉट शुरू हो जाते हैं, ताकि खाली पेट वाली जांच जल्दी हो जाए और रोज़ आना-जाना करने वालों की गाड़ी या ट्रेन न छूटे। रूटीन जांच की रिपोर्ट 24 घंटे में व्हाट्सएप और ईमेल पर पीडीएफ में आ जाती है; कल्चर में 48 से 72 घंटे लगते हैं।",
      "रेट लिस्ट: ब्लड शुगर ₹100, सीबीसी ₹400, थायरॉइड प्रोफाइल ₹550, एचबीए1सी ₹600, लिवर फंक्शन टेस्ट ₹600, किडनी फंक्शन टेस्ट ₹700, लिपिड प्रोफाइल ₹800, विटामिन डी ₹1,000, विटामिन बी12 ₹1,200 और डेंगू ₹1,200। बेसिक फुल बॉडी चेकअप ₹999 में 45 पैरामीटर, एडवांस ₹1,999 में 72 और सीनियर सिटिज़न पैक ₹2,999 में 88 पैरामीटर देता है। पूरे ज़िले में एक ही रेट है।",
      "सैंपल खलीलाबाद शहर के साथ मगहर, मेहदावल, धनघटा, बखिरा, हैंसर बाज़ार, संथा, बघौली, नाथनगर, सेमरियावां, पौली और बेलहर कला तक लिया जाता है। आपका गाँव इस सूची में न हो तो एक बार फ़ोन कर लीजिए। पता लिखते समय टोला या पुरवा, ब्लॉक और ग्राम पंचायत का नाम, और एक जाना-पहचाना लैंडमार्क ज़रूर डालिए — यहाँ मकान नंबर से ज़्यादा काम लैंडमार्क आता है।",
      "हमारा खलीलाबाद में कोई वॉक-इन काउंटर नहीं है, और हम यह दावा नहीं करते। यह घर से सैंपल लेने की सेवा है: प्रशिक्षित फ़्लेबोटोमिस्ट आईडी कार्ड के साथ आपके घर आता है, सैंपल आपके सामने लिया जाता है, और पेमेंट उसी समय नकद या यूपीआई से होता है।",
      [
        "बच्चे को तेज़ बुखार के साथ झटके, बेहोशी, गर्दन में अकड़न या लगातार उल्टी हो, तो जांच बुक करने के बजाय सीधे नज़दीकी अस्पताल ले जाइए — यह आपात स्थिति है और इसमें एक-एक घंटा मायने रखता है। कौन सी जांच कब करानी चाहिए, यह ",
        { text: "हमारी गाइड में", href: GUIDE_LAB_TEST },
        " दिया गया है।",
      ],
    ],
  },
];

/**
 * Khalilabad's own FAQs.
 *
 * The generated defaults ask the same seven questions for every city with the
 * name swapped — exactly the duplication that keeps a new page out of the
 * index, and the FAQ block is the part Google is most likely to lift into a
 * rich result, so near-identical answers across cities actively hurt.
 *
 * Three of these are this district's own and appear nowhere else on the site:
 * the two-name question (Sant Kabir Nagar vs Khalilabad), the daily-commuter
 * question, and the "do I go to Gorakhpur or Basti" question — which is
 * answered differently here than on any other page, because for this town the
 * problem was never distance.
 *
 * The two that decide a booking are placed first — page.js renders the first
 * eight, so this list is exactly eight.
 *
 * The rate line in the first answer must match the price section above AND
 * defaultTests() in src/data/lab/defaults.js.
 *
 * `links` is optional per FAQ and renders UNDER the answer, never inside the
 * schema text: the JSON-LD has to mirror the readable answer exactly, so the
 * links live outside `a`. See LabFaq.
 */
export const khalilabadFaqs = [
  {
    q: "How much does a lab test cost in Khalilabad, and is home sample collection free?",
    a: "You pay only the price printed on the test card — home sample collection in Khalilabad is completely free, with no visiting charge and no hidden fee. Blood Sugar is ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, and the Basic Full Body Checkup starts at ₹999. The rate is the same across the district — Mehdawal, Dhanghata or Bakhira costs no more than the town. The total is confirmed on the call before the visit, and payment is taken at collection, by cash or UPI.",
  },
  {
    q: "Do you have a pathology lab or collection centre in Khalilabad where I can walk in?",
    a: "No — we have no walk-in counter in Khalilabad or anywhere in Sant Kabir Nagar, and we do not claim to. This is a home collection service: a trained phlebotomist comes to your address with an ID card and the sample is drawn in front of you. It is worth knowing that most small collection points here are not laboratories either — they take the sample and it travels to a larger lab in Gorakhpur or Basti anyway. Starting that journey from your own door costs nothing in reliability and saves you half a day.",
  },
  {
    q: "The district is Sant Kabir Nagar but the town is Khalilabad — is this page for both?",
    a: "Yes, both, and at the same rates. Sant Kabir Nagar is the district and Khalilabad is its headquarters town; Magahar, where Sant Kabir's memorial stands, is a few kilometres away and is covered too. Whether you search for a blood test in Khalilabad or a lab test in Sant Kabir Nagar, the booking, the slots and the report are identical. When you book, give your block and gram panchayat along with the village name — that is what decides how quickly the visit reaches you.",
  },
  {
    q: "Which areas of Sant Kabir Nagar do you cover for home blood test collection?",
    a: "Khalilabad town along with Magahar, Mehdawal, Dhanghata, Bakhira, Hainsar Bazar, Santha, Baghauli, Nath Nagar, Semariyawan, Pauli and Belhar Kala, and the villages adjoining them are usually covered. If your village is not named here, please call anyway — if it is covered, the slot is booked on the same call, and if it is not we will say so plainly rather than let you wait. Include the tola or purwa, the block and panchayat, the post office or police station, and one landmark, because two villages of the same name close together is common here.",
  },
  {
    q: "Do I have to travel to Gorakhpur or Basti from Khalilabad for a blood test?",
    a: "Not for routine pathology — and for this town the bigger problem was never the distance. Gorakhpur is about 40 km one way and Basti about 35 km the other, so tests end up scattered between them: one HbA1c in one city, the next in the other, and the two numbers cannot be compared because reference ranges vary with the machine and method. Every blood and urine test is run on a sample that can be drawn at your home, which keeps all of them in one place. Those cities are genuinely necessary only for imaging such as MRI, CT or endoscopy, or to see a specialist in person — and on that day, go with the report already in hand.",
    links: [
      { href: LAB_GORAKHPUR, label: "Lab test in Gorakhpur" },
      { href: LAB_LUCKNOW, label: "Lab test in Lucknow" },
    ],
  },
  {
    q: "I travel to work every day — how do I fit a blood test into that?",
    a: "Take the earliest slot. Home visits start at 6 AM, so a fasting sample is drawn before you leave, you eat immediately afterwards, and no part of your day is spent on it — the whole visit is about ten minutes. The report reaches you as a PDF on WhatsApp and email within 24 hours for routine tests, so you can forward it to your doctor from anywhere. If you live away from home altogether, you can still book for your family: give the house address with a landmark, a working mobile number of someone who is there, and tell us which number the confirmation call should go to.",
  },
  {
    q: "My child has a high fever with seizures — should I book a lab test?",
    a: "No. A high fever with seizures, unconsciousness, a stiff neck, repeated vomiting or extreme drowsiness needs the nearest hospital immediately — the district hospital in Khalilabad or BRD in Gorakhpur, whichever you can reach. This is an emergency and every hour counts. The Gorakhpur–Basti belt has seen cases of acute encephalitis syndrome (AES / Japanese Encephalitis) in children after the monsoon, and waiting for a home collection is dangerous. A blood test is not the first answer here at all.",
  },
  {
    q: "Which tests need fasting, and will I really get the report in 24 hours?",
    a: "Fasting Blood Sugar, Lipid Profile and most Full Body Checkup packages need 10 to 12 hours without food; plain water is allowed and is important, but tea, milk, a biscuit or a toffee are not — a single cup of tea is enough to change the result. CBC, Thyroid Profile, HbA1c, Vitamin D and B12 need no fasting. On the report: routine pathology is sent within 24 hours as a PDF on WhatsApp and email, and often the same evening if the sample is drawn early. Cultures are the honest exception and take 48 to 72 hours, because the organism has to be grown before it can be tested against a medicine.",
    links: [{ href: GUIDE_LAB_TEST, label: "Which test, and when — a guide" }],
  },
];
