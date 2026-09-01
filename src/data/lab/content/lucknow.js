/**
 * /lab-test/lucknow — the city's long-form copy and its FAQs.
 *
 * ── THE ARGUMENT THIS PAGE MAKES, AND WHY IT IS NOT ANY OTHER PAGE'S ─────
 * This is the site's first state capital and its first real metro, and it must
 * not borrow either of the two big-city arguments already in use:
 *
 *   Varanasi   — "the labs are all here; skip the QUEUE."
 *   Gorakhpur  — "everything is here, which is why everything is CROWDED —
 *                 the saving is in timing the test around your appointment."
 *   The eleven district pages — "the big labs are NOT here; skip the JOURNEY."
 *
 * Lucknow's problem is none of those. There is a lab on almost every main road
 * here; nobody in this city is short of labs. What this city is short of is a
 * free morning, because THE DISTANCE IN LUCKNOW IS INSIDE THE CITY. Gomti
 * Nagar to Alambagh, Jankipuram to Telibagh, Chinhat to Rajajipuram — each is
 * roughly 20 to 25 kilometres of city traffic, and a fasting test at the far
 * end of that is not a half-hour errand, it is half a working day. So the
 * argument here is: the lab you found on the map is on the wrong side of the
 * city, and the trip — not the test — is what keeps getting postponed.
 *
 * That thesis is also why this page is organised by LOCALITY more heavily than
 * any other city page on the site. It is not keyword decoration: naming the
 * mohallas IS the argument, because the whole point is that a Gomti Nagar
 * reader and an Alambagh reader have different journeys and the same solution.
 *
 * ── WHAT IS GENUINELY LOCAL HERE ─────────────────────────────────────────
 * Four things, and each earns a section rather than a sentence:
 *
 *   1. THE CROSS-CITY TRIP ITSELF (`sheher-ke-andar-doori-lucknow`). The
 *      thesis above, stated once, plainly, with the honest limit attached: we
 *      are not faster than traffic either, which is why the slot is a window
 *      and not a minute.
 *
 *   2. THE HOSPITAL APPOINTMENT, AND WHY IT IS NOT GORAKHPUR'S SECTION.
 *      Gorakhpur's `opd-se-pehle-report-gorakhpur` is written for the person
 *      who has TRAVELLED IN from another district and must not waste the trip.
 *      Lucknow's reader is a RESIDENT whose hospital is 15 to 20 km across her
 *      own city — so for her the report costs two cross-town journeys before
 *      the appointment even happens, one to give the sample and one to collect
 *      the paper. That is the intracity thesis applied to hospitals, and it is
 *      a different sentence from Gorakhpur's, not the same one relocated.
 *
 *      ⚠ SGPGI, KGMU, RMLIMS, Balrampur and Civil are named as GEOGRAPHY and
 *      nothing else — they are why people cross this city. Nothing here may
 *      suggest an association with them, a partnership, or that we collect on
 *      their behalf. We do not. Same rule as AIIMS and BRD on Gorakhpur's page.
 *
 *   3. THE SALARIED HOUSEHOLD (`naukri-peshaa-office-lucknow`). A government
 *      and office city: the annual checkup that never happens because the only
 *      free slot is a Sunday, the pre-employment panel, and the vitamin D and
 *      B12 story that belongs to indoor work rather than to any district page.
 *
 *      ⚠ The vitamin paragraph stays modest. It says low sun exposure and
 *      indoor work make deficiency common and that the test is cheap — it does
 *      NOT blame the city's air for any disease, and it does not tell anyone
 *      to start a supplement. That decision is the doctor's.
 *
 *   4. PARENTS LIVING ALONE (`akele-rehne-wale-bujurg-lucknow`). The exact
 *      inverse of the district pages, and worth saying out loud: on those
 *      pages the earner is away and the family is in the village; here the
 *      parents are in the city with a lab on every road and still do not get
 *      tested, because the son or daughter who would have driven them is in
 *      another state. Nobody else's page has this reader.
 *
 * ── CLAIMS ───────────────────────────────────────────────────────────────
 * Only the five this business confirms: free home collection, a trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI
 * on collection. NOT claimed anywhere: NABL accreditation, pathologist
 * verification, cold-chain transport, barcode tracking, sealed single-use
 * needles — removed from this project once already, see the warning above
 * defaultFaqs in src/data/lab/defaults.js.
 *
 * ⚠ THIS MATTERS MORE ON THIS PAGE THAN ON ANY OTHER. Lucknow is where the
 * big accredited chains actually operate, so the temptation to match their
 * claims is strongest here — and matching them would be the one lie that a
 * reader in this city is best placed to catch. The page competes on what is
 * true instead: the collection is free, the rate is on the card, the slot
 * starts at 6 AM, and there is no counter to travel to.
 *
 * There is NO walk-in counter in Lucknow and nothing here says there is.
 *
 * NOT CLAIMED however well it would rank:
 *
 *   "RT-PCR test lab in Lucknow" — we do not run RT-PCR. It needs a molecular
 *       lab, and there is no such test in defaultTests(). The page says so
 *       plainly in `rt-pcr-lucknow` and answers it honestly in the FAQ, and
 *       for that reason NO RT-PCR term appears in this city's `keywords` array
 *       in src/data/lab/cities.js. Same rule as GAMCA on Siwan, the
 *       recruitment medical on Ghazipur, and RT-PCR on Gopalganj.
 *
 *   "24 hour lab in Lucknow" — collection runs 6 AM to evening. The page says
 *       "report 24 ghante me", which is true, never "24 ghante khula lab".
 *
 *   "Sabse sasta" / "best diagnostic centre in Lucknow" — no comparative price
 *       or quality claim is made in the copy. Two FAQs DO carry the words
 *       "affordable" and "best diagnostic centre", because that is what people
 *       type — but both answer with checkable facts instead of a boast. That
 *       is the only place those words appear.
 *
 *   "Same day report" — the commitment is 24 hours. The report section says
 *       what is true: routine work is often back the same day when the sample
 *       is given early, and the promise is 24 hours. It never inverts the two.
 *
 *   Speed across this city. The page explicitly says we are not faster than
 *       Lucknow traffic. A "phlebotomist in 30 minutes to any address" promise
 *       would break first in Alambagh at 9 AM, and it is not made.
 *
 * Distances inside the city are hedged ("kareeb") because they are road
 * distances that vary by route and hour, not measured facts.
 *
 * ── HOW THE KEYWORDS ARE PLACED ──────────────────────────────────────────
 * One primary term ("lab test in Lucknow" / "Lucknow me lab test"), carried by
 * the URL, the h1, the title and the lead. Everything else gets a SEPARATE
 * heading, because a heading ranks and a keyword buried in a paragraph mostly
 * does not: pathology lab / diagnostic centre / near me, home collection by
 * locality, online booking, the hospital appointment, office and
 * pre-employment, elderly parents, diabetes and thyroid, liver function test,
 * kidney function and lipid profile, dengue and typhoid, full body checkup
 * package, price and rate list, RT-PCR, report timing, fasting.
 *
 * The locality section carries the seven neighbourhood queries — Hazratganj,
 * Gomti Nagar, Aliganj, Indira Nagar, Alambagh/Charbagh, Aminabad, Ashiyana —
 * inside its own h2 and then names about thirty more in prose, so a search
 * from ANY part of this city lands here. The only honest way to rank for
 * "pathology lab near <mohalla>" is to say plainly that there is no branch in
 * that mohalla and that the collection comes to it instead.
 *
 * ── INTERNAL LINKS ───────────────────────────────────────────────────────
 * Paragraph parts shaped { text, href } render as real in-prose links (see
 * LabContent). Every href below must be a route that renders:
 *   /lab-test/{varanasi,gorakhpur,azamgarh}   (src/data/lab/cities.js)
 *   /blogs/lab-test/varanasi  + anchors       (src/data/blogs/varanasi/)
 *   /blogs/full-body-checkup/varanasi
 */

/* Link targets. Constants so a route rename is a one-line fix here instead of
   a hunt through the prose — and so a typo shows up as `undefined` in the href
   rather than as a silent 404 in production. */
const LAB_VARANASI = "/lab-test/varanasi";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_AZAMGARH = "/lab-test/azamgarh";

const GUIDE_LAB_TEST = "/blogs/lab-test/varanasi";
const GUIDE_FULL_BODY = "/blogs/full-body-checkup/varanasi";
const GUIDE_FASTING = "/blogs/lab-test/varanasi#fasting-aur-taiyari";
const GUIDE_REPORT = "/blogs/lab-test/varanasi#report-kaise-padhein";

export const lucknowContent = [
  {
    id: "lab-test-in-lucknow",
    h: "Lucknow Me Lab Test — Ghar Baithe Blood Test Booking Aur Free Home Sample Collection",
    p: [
      "Lucknow me lab ki kami nahi hai. Har badi sadak par ek diagnostic centre hai, har mohalle ke paas ek collection point hai, aur naam bhi sab jaante hain. Phir bhi jo test doctor ne teen hafte pehle likha tha, wo aaj tak nahi hua — aur wajah lab nahi, raasta hai.",
      "Is sheher me doori bahar nahi, andar hai. Gomti Nagar se Alambagh, Jankipuram se Telibagh, Chinhat se Rajajipuram — har ek kareeb 20 se 25 kilometre sheher ke traffic ka. Khaali pet nikal kar us paar jaana, wahan line me lagna, aur report ke liye dobara wahi safar karna — ye aadhe din ka kaam hai, das minute ka nahi. Isi liye test taalta rehta hai.",
      "MedicoBharat lab test Lucknow me home sample collection par chalta hai. Aap apne ghar ka pata dete hain, subah ka slot chunte hain, aur trained phlebotomist ID card ke saath aapke darwaze par aata hai. Sample aapke saamne liya jaata hai aur report 24 ghante ke andar WhatsApp aur email dono par PDF me aa jaati hai. Home collection ka koi alag charge nahi — na visiting fee, na koi chhupa hua kharch.",
      "Yahan routine pathology ke saare test aur checkup package book hote hain — CBC, Thyroid Profile (T3, T4, TSH), Blood Sugar, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test, Vitamin D, Vitamin B12, Dengue aur Full Body Checkup. Doctor ne parcha likh diya hai to usi panel ke hisaab se booking ho jaati hai; koi test is page ke card par na dikhe to prescription ke saath ek call kar lijiye.",
      [
        "Kaun sa test kab karana chahiye, bukhar me kis din test matlab rakhta hai, aur report ke numbers me kya dekhna chahiye — us par alag se guide hai: ",
        { text: "kaun sa test kab karayein", href: GUIDE_LAB_TEST },
        ".",
      ],
    ],
  },

  {
    id: "pathology-lab-diagnostic-centre-lucknow",
    h: "Lucknow Me Pathology Lab Ya Diagnostic Centre Dhoondh Rahe Hain? \"Lab Near Me\" Ka Seedha Jawab",
    p: [
      "\"Pathology lab near me Lucknow\", \"best diagnostic centre in Lucknow\", \"blood test near me\" — ye teenon ek hi soch se search hote hain: kahin jaana padega, to sabse paas wali jagah kaun si hai. Is sheher me uska jawab aksar dhokha de deta hai, kyunki map par jo lab sabse paas dikhti hai wo do kilometre door ho sakti hai aur subah ke traffic me chalees minute door bhi.",
      "Asli sawaal ye hai hi nahi ki lab kahan hai. Asli sawaal ye hai ki jaana zaroori hai ya nahi — aur routine pathology me nahi hai. Khoon aur peshaab ke jitne bhi aam test hain, wo sample par hote hain, aur sample aapke ghar par liya ja sakta hai. Jo cheez machine par hoti hai — X-ray, ultrasound, ECG, CT scan, MRI — uske liye centre par jaana hi padega, aur ye page unke liye nahi hai.",
      "Ek baat saaf kar dein, kyunki is sheher me ye zyada maayne rakhti hai: hum Lucknow me koi walk-in counter ya branch hone ka daawa nahi karte, aur na hi kisi accreditation ka. Jo hai wo ye hai — aapke ghar par sample lene wali service, poore sheher me, subah 6 baje se shaam tak ke slot me, card par likhe daam par.",
      "MedicoBharat pathology lab Lucknow ki poori rate list isi page par neeche hai. Kisi bhi lab se tulna karni ho to teen cheezein poochhiye — test ka rate, collection ka charge, aur report kab tak. Jo teenon ka seedha jawab de, wahi book karne layak hai.",
    ],
  },

  {
    /* THE HYPER-LOCAL CORE OF THIS PAGE. The mohalla names are the argument,
       not decoration — see point 1 in the file header. Anything named here has
       to be somewhere a collection round genuinely reaches; the sixteen in the
       booking dropdown are in src/data/lab/cities.js, and the rest are named
       here because a sixteen-item dropdown is already the limit of usable on a
       phone. Do not add a locality to catch a query. */
    id: "home-collection-areas-lucknow",
    h: "Poore Lucknow Me Blood Test Home Collection — Hazratganj, Gomti Nagar, Indira Nagar, Aliganj, Alambagh, Charbagh, Aminabad Aur Ashiyana",
    p: [
      "Home collection poore sheher me hai. Beech sheher me Hazratganj, Kaiserbagh, Aminabad, Chowk, Naka, Aishbagh, Lalbagh aur Civil Lines ki taraf. Gomti paar Gomti Nagar aur Gomti Nagar Extension, Vibhuti Khand, Indira Nagar, Nishatganj, Mahanagar, Daliganj, Chinhat aur Faizabad Road ki nayi colonies.",
      "Uttar aur paschim me Aliganj, Nirala Nagar, Jankipuram, Jankipuram Extension, Vikas Nagar, Gudamba, Triveni Nagar, Sitapur Road ki taraf, tatha Rajajipuram, Balaganj, Thakurganj, Dubagga aur Hardoi Road ka ilaaka. Dakshin me Alambagh, Charbagh, Krishna Nagar, Ashiyana, Bangla Bazaar, LDA Colony, Sarojini Nagar, Amausi, Para, Kanpur Road ki taraf, aur Telibagh, Vrindavan Yojana, Sushant Golf City tatha Raebareli Road ki nayi township.",
      "Log aksar \"pathology lab near Hazratganj\", \"medical lab near Gomti Nagar\", \"blood testing lab in Aliganj\", \"blood collection centre in Indira Nagar\", \"pathology lab near Alambagh Charbagh\", \"diagnostic lab near Aminabad\" ya \"blood test at home in Ashiyana\" search karte hain. In sab ka jawab ek hi hai, aur wo saaf hai: in mohallon me hamari koi branch nahi hai — collection aapke ghar aati hai, chaahe aap in me se kisi bhi ilaake me hon.",
      "Aapki colony ka naam upar na dikhe to bhi ek baar call kar lijiye. Ye sheher har saal Faizabad Road, Sitapur Road, Kanpur Road aur Raebareli Road ki taraf failta ja raha hai, aur nayi township ke naam list se hamesha ek kadam aage rehte hain.",
      "Pata likhte waqt sector aur tower ka number zaroor daaliye. Gomti Nagar aur Jankipuram jaise ilaakon me sirf colony ka naam kaafi nahi hota — Vishal Khand, Vipul Khand, Vinay Khand ya Sector ka number, aur ek landmark (school, park, mandir, market, petrol pump) likh dijiye. Apartment me rehte hain to tower aur flat number, aur gate par naam bata dena zaroori hai, warna guard andar nahi aane deta aur slot nikal jaata hai.",
    ],
  },

  {
    /* ⚠ THE SECTION THAT MUST NOT TURN INTO A SPEED PROMISE. The honest limit
       — that we are not faster than this city's traffic — is the reason this
       section is credible at all. Do not replace it with "30 minute me
       phlebotomist". Read the file header. */
    id: "sheher-ke-andar-doori-lucknow",
    h: "Lucknow Me Asli Doori Sheher Ke Andar Hai — Aur Ek Test Ke Liye Aadha Din Kyun Chala Jaata Hai",
    p: [
      "Chhote sheher me sawaal hota hai ki lab hai ya nahi. Lucknow me lab har taraf hai, phir bhi test chhoot jaata hai — kyunki yahan ka kharch paisa nahi, waqt hai.",
      "Hisaab seedha hai. Fasting test subah ka hota hai, aur subah ka waqt hi sabse mehnga hai. Bachche school ja rahe hain, ghar ka ek aadmi office nikal raha hai, aur usi beech khaali pet 20 kilometre paar karke lab pahunchna hai. Wahan line, phir wapsi ka traffic, aur do din baad report lene ka doosra chakkar. Ek CBC ke liye do trip aur aadha din — aur isi hisaab me test agle mahine par tal jaata hai.",
      "Ghar par sample dene se ye poora hisaab hat jaata hai. Subah 6 baje se slot shuru hote hain, sample dene me das minute lagte hain, aur report phone par aati hai — lene jaana hi nahi padta. Jo aadha din bachta hai, wahi is service ka asli faayda hai; test ka daam to card par wahi likha hai.",
      "Ab wo baat jo hum saaf keh dena chahte hain: hum Lucknow ke traffic se tez nahi hain. Isi liye slot ek waqt nahi, ek window hota hai, aur confirmation call par wahi window bataya jaata hai. Barsaat ke din, jaam ya kisi rasta band hone par thoda aage-peeche ho sakta hai — aisi soorat me phone karke bata diya jaata hai, chup-chaap intezaar nahi karwaaya jaata. Jo lab kisi bhi pate par 30 minute ka vaada karti hai, us vaade ko subah 9 baje Alambagh ya Hazratganj me ek baar jaanch lijiye.",
      "Ek visit me ghar ke kai logon ka sample liya ja sakta hai, aur collection tab bhi free rehta hai. Is sheher me yahi sabse zyada kaam ka intezaam hai — jab ek trip me hi ghar ke teen log nipat jaayein, to jo bacha wo teen trip ka waqt hai.",
    ],
  },

  {
    id: "book-blood-test-online-lucknow",
    h: "Lucknow Me Blood Test Online Book Kaise Karein — Form Ya Ek Phone Call",
    p: [
      "Booking ka tarika seedha hai. Is page par upar diye form me apna naam, mobile number, ilaaka aur test chuniye — ya seedha call kar dijiye. Doctor ka parcha hai to uski photo taiyaar rakhiye; usi panel ke hisaab se booking ho jaayegi aur koi test chhootega nahi.",
      "Lagbhag 30 minute me confirmation call aata hai. Usmein chaar cheezein tay hoti hain: slot ka window, poora pata sector, tower aur landmark ke saath, ye ki test me fasting chahiye ya nahi, aur total daam. Isi call par saara hisaab saaf ho jaata hai — baad me koi naya charge nahi judta.",
      "Slot subah 6 baje se shuru hote hain aur shaam tak chalte hain. Fasting wale test hamesha subah rakhwaiye, aur office jaana ho to 6 se 7 ka pehla slot lijiye — sample dekar naashta kar lijiye aur nikal jaaiye. Phlebotomist ID card ke saath aata hai aur sample aapke saamne leta hai; dene se pehle card dekh lena aapka hak hai.",
      "Apartment ya gated society me rehte hain to booking ke waqt ye zaroor bata dijiye — society ka naam, tower, flat number, aur gate par kis naam se entry milegi. Lucknow ki nayi township me sabse zyada slot isi ek wajah se nikalte hain, testing ki kisi dikkat se nahi.",
      "Online booking ka ek faayda aur hai jo aksar dhyan me nahi aata — jo test aapne book kiya wahi report me aata hai, aur uska record aapke phone par rehta hai. Zubaani order me test badal jaane ki jo shikayat hoti hai, wo yahan nahi hoti.",
    ],
  },

  {
    /* ⚠ SGPGI, KGMU, RMLIMS, Balrampur and Civil are GEOGRAPHY here and
       nothing else — they are why people cross this city. No association,
       partnership or collection-on-their-behalf may ever be implied. Same rule
       as AIIMS and BRD on Gorakhpur's page. And note that this section is NOT
       Gorakhpur's: that one is written for the visitor from another district,
       this one for the resident whose hospital is across her own city. Read
       the file header before editing it. */
    id: "opd-tareekh-se-pehle-lucknow",
    h: "OPD Ki Tareekh Mil Gayi Hai — Bade Aspatal Me Dikhane Se Pehle Report Taiyaar Rakhiye",
    p: [
      "Lucknow me bade sansthan sheher ke alag-alag chhor par hain. SGPGI Raebareli Road ki taraf, KGMU purane sheher ki taraf, RMLIMS Gomti Nagar ki taraf, aur Balrampur tatha Civil beech sheher me. Aap kahin bhi rehte hon, inme se ek to aapke ghar se 15 se 20 kilometre door padta hi hai.",
      "Isi se wo galti hoti hai jo sabse mehngi padti hai. OPD ki tareekh milti hai, aap us din pahunchte hain, doctor dekhta hai aur test likh kar agli tareekh de deta hai — kyunki report saath nahi thi. Ab wahi safar dobara, aur beech me do-teen hafte. Bade sansthan me agli tareekh jaldi nahi milti, aur ye baat sabse zyada un logon ko mehngi padti hai jinke ghar me koi bujurg ya bimaar hai.",
      "Isi liye tareekh milte hi ek kaam kar lijiye: parche par jo routine jaanch pehle se likhi hai, wo ghar par karwa lijiye. CBC, sugar, HbA1c, thyroid, liver, kidney aur lipid — ye sab sample par hote hain aur inke liye sansthan tak jaana zaroori nahi. Report PDF me phone par rehti hai, aur wahi dikha dena kaafi hota hai.",
      "Ek baat saaf hai aur zaroori hai: hum kisi aspatal ya sansthan se jude nahi hain, na unki taraf se sample lete hain. Aspatal apni jaanch apne yahan karwana kahe to wahi kijiye — uski list hi chalti hai. Ye page us routine jaanch ke liye hai jo aap pehle se karwa kar ja sakte hain, taaki pehli hi baithak me baat aage badhe.",
      "Operation ki tareekh mili ho to bhi yahi baat lagu hoti hai — aspatal jo panel maange, uski copy leke us hisaab se booking karwa lijiye, aur uski apni list ko hi aakhri maaniye.",
    ],
  },

  {
    id: "naukri-peshaa-office-lucknow",
    h: "Naukri-Peshaa Logon Ke Liye — Saal Bhar Ka Checkup, Pre-Employment Panel Aur Vitamin D Ki Kami",
    p: [
      "Ye sarkari daftar aur office ka sheher hai. Sachivalaya, vibhaagon ke daftar, bank, school, aur Gomti Nagar tatha Vibhuti Khand ki taraf ke private office — in sab me kaam karne walon ka ek jaisa haal hai: saal bhar ka checkup sirf isliye nahi hota kyunki uske liye ek poora din chahiye, aur wo din kabhi khaali nahi hota.",
      "Subah 6 se 7 ka slot isi ke liye hai. Fasting sample ghar par dijiye, naashta kijiye aur waqt par office nikal jaaiye — chhutti lene ki zaroorat nahi padti. Ghar ke doosre logon ka sample bhi usi visit me ho jaata hai.",
      "Nayi naukri ke pre-employment checkup me aam taur par CBC, Blood Sugar, Liver Function Test, Kidney Function Test aur Lipid Profile aate hain, kabhi thyroid bhi. Company ya sansthan apni list deti hai — wahi list chalti hai, isliye uski photo booking ke waqt bhej deejiye aur usi panel ke hisaab se sample liya jaayega.",
      "Ek cheez is tarah ki zindagi me bahut aam hai aur bahut der se pakadi jaati hai — Vitamin D aur Vitamin B12 ki kami. Din bhar andar baithe rehna, dhoop kam lagna aur bahar ka khaana — inse thakan, kamar aur ghutne ka dard, haath-pair me jhunjhuni aur dhyan na lagna shuru hota hai, jise log \"kaam ki thakan\" keh kar chhod dete hain. Vitamin D ₹1,000 aur Vitamin B12 ₹1,200 me ho jaata hai aur dono me fasting nahi chahiye.",
      "Number kam nikle to dawa apne aap se shuru mat kijiye — kitni, kab tak aur kis roop me, ye doctor tay karta hai, aur Vitamin D me apne mann se zyada le lena nuksaan karta hai. Test ka kaam sirf itna hai ki tasveer saaf kar de.",
    ],
  },

  {
    id: "akele-rehne-wale-bujurg-lucknow",
    h: "Ghar Par Akele Rehne Wale Maa-Baap Ke Liye — Wo Jaanch Jo Sheher Me Rehte Hue Bhi Chhoot Jaati Hai",
    p: [
      "Is sheher ke bahut se gharon me maa-baap akele rehte hain aur bachche Delhi, Bangalore, Pune ya videsh me hain. Lab ghar se do kilometre par hai, phir bhi jaanch nahi hoti — kyunki le jaane wala koi nahi hai. Auto pakadna, khaali pet line me khada rehna aur do din baad report lene dobara jaana, ye 70 saal ki umar me chhoti baat nahi hai.",
      "Home collection ka sabse seedha faayda yahi hai. Sample ghar par liya jaata hai, dus minute lagte hain, aur report PDF me aa jaati hai — jise bachche jahan bhi hon, wahin dekh lete hain aur waheen se doctor se baat kar lete hain. Bahut se ghar isi tarah chalte hain, aur ismein koi kami ki baat nahi hai.",
      "Is umar me jo jaanch sabse zyada kaam ki rehti hai wo ye hain: Blood Sugar aur HbA1c, Kidney Function Test, Lipid Profile, CBC, aur thyroid ke liye TSH. Inme se koi bhi apne aap lakshan nahi dikhata — ye chup-chaap badalte hain, aur inka pata sirf number se chalta hai. Senior Citizen Pack ₹2,999 me 88 parameter ke saath inhi par dhyan deta hai.",
      "Booking bachche bahar se bhi kar sakte hain. Form me mobile number wahi dijiye jo ghar par uthaya jaayega, aur booking ke waqt bata dijiye ki mareez bujurg hain, bistar par hain, ya sunne me dikkat hai — phlebotomist us hisaab se taiyaar aata hai aur dhyan rakhta hai. Payment bhi UPI se bahar se ho jaata hai.",
      "Aur ek baat jo bhool jaati hai: purani report sambhaal kar rakhiye. Bujurgon me doctor ke liye ek report se zyada kaam ki cheez do report ka farak hoti hai — sugar, kidney aur thyroid me to poora faisla usi farak par hota hai. PDF phone me rehti hai, isliye ise delete mat kijiye.",
    ],
  },

  {
    id: "diabetes-thyroid-lucknow",
    h: "Lucknow Me Diabetes Checkup, Sugar Test, HbA1c Aur Thyroid Test Price (TSH)",
    p: [
      "Sugar aur thyroid dono chupke se badhte hain. Jab tak lakshan dikhte hain — bahut pyaas, baar baar peshaab, wazan ka girna ya badhna, thakan, baal jhadna — tab tak kaafi waqt nikal chuka hota hai. Isi liye inhe lakshan par nahi, umar aur ghar ke itihaas par jaancha jaata hai.",
      "Aam salah ye hai: 30 ke baad saal me ek baar Fasting Blood Sugar (₹100). Ghar me kisi ko diabetes hai, wazan zyada hai, baithe rehne wali naukri hai, ya pehle sugar border par nikla tha — to sugar ke saath HbA1c (₹600) bhi, jo teen mahine ka ausat batata hai aur ek din ke khaane-peene se nahi badalta. Mahilaon me thyroid zyada aam hai, isliye 30 ke baad Thyroid Profile (T3, T4, TSH — ₹550) ek baar zaroor.",
      "Jo pehle se dawa par hain unke liye asli baat follow-up hai, aur is sheher me wo isliye chhootta hai ki dawa likhne wala doctor sheher ke doosre chhor par baithta hai. HbA1c har teen mahine aur TSH doctor ke kahe anusar — dono ghar par ho jaate hain, dono me fasting nahi chahiye, aur dono din me kabhi bhi ho sakte hain.",
      "Diabetes ke saath saal me ek baar Kidney Function Test aur Lipid Profile bhi karwa lijiye. Sugar ka asar sabse pehle chup-chaap gurde aur charbi par dikhta hai, aur wo dono is page par alag se book ho jaate hain — inke baare me agla section hai.",
      "Fasting wale test ke liye subah 6 baje se slot rakhe gaye hain, taaki sample dekar aap turant naashta kar sakein aur din shuru kar sakein.",
    ],
  },

  {
    id: "liver-function-test-lucknow",
    h: "Lucknow Me Liver Function Test (LFT) — Fatty Liver Aur Peeliya Ki Jaanch",
    p: [
      "Liver Function Test ab is sheher me sirf peeliye ke liye nahi ho raha. Jo wajah tezi se badh rahi hai wo fatty liver hai — aur wo sharaab se juda maamla hona zaroori nahi. Baithe rehne wali naukri, bahar ka khaana, badhta wazan, sugar aur badha hua lipid — ye sab usi taraf le jaate hain, aur shuruaat me koi lakshan nahi hota.",
      "LFT me kya aata hai: total aur direct bilirubin, SGOT (AST), SGPT (ALT), alkaline phosphatase, aur protein tatha albumin. Inhe milakar padha jaata hai — akela ek number kuch nahi kehta. Daam ₹600 hai aur report 24 ghante me aa jaati hai.",
      "Kaun karwaaye: jinka sugar ya lipid pehle se kharaab hai, jinka wazan badh raha hai, jo lambe samay se koi dawa le rahe hain — dard ki goli, TB ki dawa, ya koi bhi lambi chalne wali dawa — aur jinhe pet ke upari daahine hisse me bhaaripan, bhookh na lagna ya bina wajah ki thakan rehti hai. Ultrasound me \"fatty liver\" likha aaya ho to LFT usi ke saath ka doosra aadha hai.",
      "Aur peeliya — aankhon ya peshaab me peelapan dikhte hi LFT pehla test hai. Ismein der karna sabse bada nuksaan karta hai: number bata dete hain ki maamla halka hai ya doctor ke paas turant jaane wala, aur ye faisla jitni jaldi ho utna behtar. Gharelu nuskhon me hafte nikal jaana hi is bimari me sabse zyada bigaadta hai.",
      "LFT me fasting zaroori nahi hai, lekin doctor ne Lipid Profile ke saath likha hai to fasting Lipid ke liye chahiye hogi — us soorat me subah ka slot le lijiye. LFT Basic Full Body Checkup me pehle se shaamil hai.",
    ],
  },

  {
    id: "kidney-lipid-profile-lucknow",
    h: "Lucknow Me Kidney Function Test Package Aur Lipid Profile Test Price — Do Chup-Chaap Chalne Wale Test",
    p: [
      "Kidney Function Test aur Lipid Profile ek hi wajah se saath likhe jaate hain: dono aisi cheezein pakadte hain jo mehsoos nahi hoti. Gurda kaafi kharab hone tak koi lakshan nahi deta, aur cholesterol to kabhi nahi deta — pata tab chalta hai jab kuch ho chuka hota hai.",
      "Kidney Function Test ₹700 me hota hai aur ismein urea, creatinine aur uric acid aate hain. Ye kis ke liye hai: jinhe sugar hai, jinka blood pressure badha rehta hai, jo dard ki goli aksar khaate hain, jinke pair ya chehre par subah soojan rehti hai, aur jinke ghar me kisi ko gurde ki bimari rahi ho. Sugar ya BP ki dawa par hain to saal me ek baar ye jaanch chhodni nahi chahiye.",
      "Lipid Profile ₹800 me hota hai aur ismein total cholesterol, LDL, HDL aur triglycerides aate hain. Isme fasting chahiye — 10 se 12 ghante, sirf saada paani. Baithe rehne wali naukri, bahar ka aur tala hua khaana, aur wazan ka badhna — is sheher me ye teenon aam hain, aur teenon ka asar sabse pehle isi report me dikhta hai.",
      "Dono ek hi sample me ho jaate hain, aur Basic Full Body Checkup ₹999 me dono pehle se shaamil hain — CBC, sugar aur LFT ke saath. Alag-alag karwaane se package aksar sasta padta hai, isliye doctor ne sirf ek likha ho tab bhi ek baar dekh lijiye ki package me kya-kya aa raha hai.",
      "Report me ek-do number range se thoda idhar-udhar hona apne aap me kuch nahi kehta. Matlab tabhi banta hai jab use lakshan, umar, dawa aur baaki numbers ke saath padha jaaye — aur ye kaam doctor ka hai, internet ka nahi.",
    ],
  },

  {
    id: "bukhar-dengue-typhoid-lucknow",
    h: "Lucknow Me Dengue, Typhoid Aur Malaria Test — Bukhar Ke Kis Din Kaunsa Test",
    p: [
      "Barsaat ke baad is sheher me dengue har saal ka maamla hai, aur sabse aam galti ye hoti hai ki test galat din par kara liya jaata hai. Report \"negative\" aa jaati hai, ghar wale nishchint ho jaate hain, aur bimari chalti rehti hai.",
      "Seedha niyam ye hai. Dengue NS1 bukhar ke pehle 1 se 5 din me sahi jawab deta hai; paanchve din ke baad NS1 ki jagah IgM matlab rakhta hai. Typhoid ke Widal test ke liye kam se kam 5 se 7 din ka bukhar chahiye — teesre din ka Widal aksar bekaar jaata hai aur galat tasalli de deta hai. Malaria ki jaanch bukhar chadhte waqt sabse achhi hoti hai.",
      "Har bukhar me CBC (₹400) saath me karwa lijiye. Platelet ka girna, white cell ka pattern aur haemoglobin — teenon milkar doctor ko wo tasveer dete hain jo akela ek test nahi de paata. Dengue me platelet ka rojana dekha jaana zaroori ho jaata hai, aur yahi wo jagah hai jahan ghar par sample lena sabse zyada kaam aata hai: bimar aadmi ko roz lab tak le jaane ki zaroorat nahi padti.",
      "Fever Panel me malaria, typhoid aur dengue ek saath aa jaate hain; uska daam is page ke rate card par \"call for price\" isliye hai kyunki panel me kya jodna hai wo lakshan aur bukhar ke din par tay hota hai.",
      "Aur ek chetavni jo har mausam par lagu hai: dengue me platelet bahut gir jaaye, naak ya mashude se khoon aaye, lagatar ulti ho, pet me tez dard ho, ya mareez sust pada rahe — to ghar par sample ka intezaar bilkul mat kijiye, seedha aspatal le jaaiye. Bachche ko tez bukhar ke saath jhatke aayein ya gardan akad jaaye, tab bhi yahi baat hai. Aise me ek ek ghanta maayne rakhta hai.",
      [
        "Bukhar ke kis din kaunsa test — is par din-war samjhaane wali ",
        { text: "guide yahan hai", href: GUIDE_LAB_TEST },
        ".",
      ],
    ],
  },

  {
    id: "full-body-checkup-lucknow",
    h: "Lucknow Me Full Body Checkup Package — 45, 72 Aur 88 Parameter Wale Plan",
    p: [
      "Full body checkup ka matlab har test karana nahi hota. Matlab ye hota hai ki wo test ek saath ho jaayein jo milkar tasveer banate hain — khoon, sugar, charbi, liver aur kidney. Usse aage ka faisla report dekh kar hota hai, pehle se nahi.",
      "Teen package hain. Basic Full Body Checkup ₹999 me 45 parameter — CBC, sugar, lipid, LFT aur KFT. Advanced Full Body ₹1,999 me 72 parameter — isi me thyroid, HbA1c aur vitamin jud jaate hain. Senior Citizen Pack ₹2,999 me 88 parameter, jo 55 saal se upar walon ke liye dil, haddi aur sugar par zyada dhyan deta hai.",
      "Kis ke liye kaun sa: pehli baar checkup kara rahe hain aur koi shikayat nahi hai to Basic kaafi hai. Baithe rehne wali naukri, badhta wazan, ya sugar, thyroid tatha vitamin ki shikayat pehle rahi ho — to Advanced zyada kaam ka hai, kyunki usmein wahi teen cheezein judti hain. Ghar ke bujurgon ke liye Senior Pack.",
      "Poore parivaar ka checkup ek hi subah me ho sakta hai — ek phlebotomist, ek visit, sab ka sample, aur collection phir bhi free. Is sheher me yahi package ka sabse bada faayda hai: teen logon ke liye teen alag din nahi nikaalne padte.",
      [
        "Package me kya hona chahiye aur \"80+ parameters\" jaise vaade me kitna dum hota hai — ",
        { text: "ye guide wahi samjhaati hai", href: GUIDE_FULL_BODY },
        ".",
      ],
      "Teenon package me 10 se 12 ghante ki fasting chahiye, isliye inhe subah ke slot me rakhwaana hi theek rehta hai.",
    ],
  },

  {
    id: "lab-test-price-lucknow",
    h: "Lucknow Me Lab Test Price Aur Rate List — Kaunsa Test Kitne Ka",
    p: [
      "Daam wahi hai jo is page ke card par likha hai. Home sample collection ka koi alag charge nahi — na visiting fee, na koi hidden cost. Aap sirf test ka price dete hain, aur wahi price collection ke waqt liya jaata hai.",
      "Aam test ke price: Blood Sugar ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1,000, Vitamin B12 ₹1,200 aur Dengue (NS1, IgG, IgM) ₹1,200.",
      "Package: Basic Full Body Checkup ₹999, Advanced Full Body ₹1,999 aur Senior Citizen Pack ₹2,999. Fever Panel par daam nahi likha hai kyunki usmein kya kya jodna hai wo lakshan aur bukhar ke din par tay hota hai — call par bata diya jaata hai.",
      "Hum ye nahi kehte ki hamara daam sheher me sabse kam hai; aisa daawa koi bhi kar sakta hai aur koi bhi jaanch nahi sakta. Jo hum kehte hain wo jaancha ja sakta hai — rate upar card par likha hai, home collection uske upar kuch nahi jodta, aur confirmation call par total bata diya jaata hai. Kisi bhi lab se tulna karni ho to teen cheezein poochhiye: test ka rate, collection ka charge, aur report ka waqt.",
      "Payment sample lene ke waqt hota hai, cash ya UPI (PhonePe, Google Pay, Paytm) se. Ek se zyada logon ka test ek hi visit me ho sakta hai — ek hi phlebotomist, ek hi trip, aur collection tab bhi free. Sheher paar karke lab jaane me jo petrol, auto ka kiraya aur aadha din jaata hai, wo iske upar bachta hai.",
    ],
  },

  {
    /* ⚠ THE SECTION THAT MUST NOT BECOME A SALES PITCH. RT-PCR needs a
       molecular lab; there is no such test in defaultTests() and we do not run
       it. Lucknow has plenty of labs that do, which makes an honest "no" here
       cheap to give and expensive to get wrong. Same rule as the Gulf medical
       on Siwan's page and the recruitment medical on Ghazipur's — and it is
       also why NO RT-PCR term appears in this city's keywords array. */
    id: "rt-pcr-lucknow",
    h: "RT-PCR Test Lucknow Me — Ye Hum Nahi Karte, Aur Kyun Nahi",
    p: [
      "Saaf baat pehle: RT-PCR test hum nahi karte. Wo ek molecular lab me hota hai jahan alag machine aur alag setup chahiye, aur is page par jo bhi test dikhte hain unme RT-PCR nahi hai. Hum uske liye aapka sample nahi lete.",
      "Lucknow me ye jaanch karne wale sarkari aspatal aur molecular lab dono hain, isliye sahi jagah dhoondhna yahan mushkil nahi hai. Safar ya visa ke liye report chahiye to us centre se pehle hi poochh lijiye ki unki report us maksad ke liye maany hai ya nahi, aur report kitne ghante me milegi — ye do sawaal bahut si pareshani bacha dete hain.",
      "Hum ye baat isliye likh rahe hain kyunki log \"RT-PCR test lab Lucknow\" search karke aise page par pahunch jaate hain jo saaf jawab nahi dete: phone karte hain, waqt lagate hain, aur aakhir me pata chalta hai ki wahan hoti hi nahi. Ek page ka pehla kaam sahi jawab dena hai, chaahe wo jawab \"nahi\" hi kyun na ho.",
      "Jo hum karte hain wo ye hai — routine pathology, ghar se sample lekar: CBC, Blood Sugar, HbA1c, Thyroid Profile, Lipid Profile, Liver aur Kidney Function Test, Vitamin D, Vitamin B12, Dengue aur Full Body Checkup ke package. Kisi lambi bimari ke baad kamzori mehsoos ho rahi ho to CBC, Vitamin D aur Vitamin B12 ka panel aksar sabse kaam ka nikalta hai — lekin wo bhi doctor ke kahe par karaaiye, apne aap se nahi.",
    ],
  },

  {
    id: "report-same-day-lucknow",
    h: "Report Kab Milegi — Same Day Ya 24 Ghante Me WhatsApp Par PDF",
    p: [
      "Sach wahi likhenge jo hai. Zyadatar routine test — CBC, sugar, lipid, LFT, KFT, thyroid, urine routine — sample lab pahunchne ke baad 6 se 24 ghante me taiyaar ho jaate hain, aur agar sample subah jaldi diya gaya ho to report aksar usi din shaam tak aa jaati hai. Lekin hamara vaada 24 ghante ka hai, same day ka nahi — kyunki collection ka waqt, sheher me doori aur test ka type teenon isme farak daalte hain.",
      "Kuch test jaan-boojh kar dheeme hote hain. Culture — urine ya blood culture — me 48 se 72 ghante lagte hain, kyunki pehle organism ko ugana padta hai, tabhi antibiotic ki sensitivity pata chalti hai. Koi bhi lab isse jaldi ka imaandari se vaada nahi kar sakti.",
      "Report WhatsApp aur email dono par PDF me bhej di jaati hai, aur is sheher me iska sabse bada faayda ye hai ki report lene ka doosra chakkar hi nahi lagta — jo asal me aadha din bachata hai. Doctor sheher ke doosre chhor par ho, ya bachche doosre sheher me, file bhej dijiye aur baat wahin ho jaayegi.",
      "Purani report bhi phone me padi rehti hai, aur doctor ke liye do report ka farak ek report se kahin zyada kaam ka hota hai. Sugar, thyroid aur kidney me to poora ilaaj isi farak par tay hota hai — isi liye report delete mat kijiye, ek folder bana kar rakh lijiye.",
      [
        "Report me har number ke saath ek normal range likhi hoti hai. Ek-do number range se thoda idhar-udhar hona apne aap me kuch nahi kehta — matlab tabhi banta hai jab use lakshan aur baaki numbers ke saath padha jaaye. Kya dekhna chahiye, wo ",
        { text: "report kaise padhein", href: GUIDE_REPORT },
        " me saada bhasha me likha hai.",
      ],
    ],
  },

  {
    id: "fasting-taiyari-lucknow",
    h: "Sample Dene Se Pehle Kya Karein, Kya Na Karein — Fasting Ke Niyam",
    p: [
      "Fasting ka matlab 10 se 12 ghante kuch na khana, aur is beech saada paani peete rehna. Chai, doodh, biscuit, toffee ya paan — inme se kuch bhi report badal deta hai; ek cup chai kaafi hai sugar aur lipid ka number hila dene ke liye. Raat ka khaana 9 baje tak kar lijiye aur subah 6-7 baje ka slot lijiye; itna hi kaafi hai.",
      "Fasting kin me chahiye: Fasting Blood Sugar, Lipid Profile aur teenon Full Body package me. Kin me nahi: CBC, Thyroid Profile, HbA1c, Vitamin D, Vitamin B12 aur Dengue — ye din me kabhi bhi ho sakte hain, isliye inhe office ke baad shaam ke slot me bhi rakhwaaya ja sakta hai.",
      "Dawa apne aap se band mat kijiye. Blood pressure, thyroid ya dil ki dawa niyam se lete hain to usi tarah lijiye, aur booking ke waqt bata dijiye — kis dawa se kaunsa number badalta hai, ye lab ko pata hona chahiye. Sugar ki dawa ya insulin par hain to fasting sample ka waqt doctor se ek baar poochh lena behtar hai.",
      "Sample se pehle raat bhar ki achhi neend aur din bhar paani — ye do cheezein sample lene ka kaam aasan kar deti hain; nas na milne ki dikkat aksar paani ki kami se hoti hai. Gym ya bhaari vyayam sample se theek pehle mat kijiye, aur sharaab ka test se ek din pehle parhez rakhiye — wo liver aur lipid dono ke number badal deta hai.",
      [
        "Fasting aur taiyaari par poori list ",
        { text: "yahan hai", href: GUIDE_FASTING },
        ".",
      ],
    ],
  },

  {
    /* Devanagari section. Sheher ka bada hissa Hindi me search karta hai, aur
       poora page Hinglish me hone ke kaaran Devanagari query se choot jaata
       tha. Ye anuvaad nahi hai — yahan wahi baatein hain jo upar hain, chhoti
       aur seedhi shakl me, taaki ye duplicate content na bane. */
    id: "lucknow-lab-test-hindi",
    h: "लखनऊ में लैब टेस्ट — घर से सैंपल कलेक्शन की पूरी जानकारी (हिंदी में)",
    p: [
      "लखनऊ में लैब की कमी नहीं है — कमी सुबह के वक़्त की है। गोमती नगर से आलमबाग, जानकीपुरम से तेलीबाग, चिनहट से राजाजीपुरम — हर एक लगभग 20 से 25 किलोमीटर शहर के ट्रैफ़िक का। ख़ाली पेट उस पार जाना, वहाँ लाइन, और रिपोर्ट के लिए दोबारा वही सफ़र — इसी हिसाब में जाँच टलती रहती है।",
      "घर से सैंपल कलेक्शन में यह पूरा हिसाब हट जाता है। प्रशिक्षित फ्लेबोटोमिस्ट पहचान पत्र के साथ आपके घर आता है, आपके सामने सैंपल लेता है, और रिपोर्ट 24 घंटे के अंदर व्हाट्सएप तथा ईमेल पर पीडीएफ़ में आ जाती है — लेने जाना ही नहीं पड़ता। होम कलेक्शन पूरी तरह मुफ़्त है; आप सिर्फ़ जाँच का वही दाम देते हैं जो कार्ड पर लिखा है।",
      "पूरे शहर में सुविधा है — हज़रतगंज, क़ैसरबाग़, अमीनाबाद, चौक, नाका, ऐशबाग़, गोमती नगर, विभूति खंड, इंदिरा नगर, निशातगंज, महानगर, चिनहट, अलीगंज, निराला नगर, जानकीपुरम, विकास नगर, त्रिवेणी नगर, राजाजीपुरम, ठाकुरगंज, आलमबाग, चारबाग, कृष्णा नगर, आशियाना, बंगला बाज़ार, एलडीए कॉलोनी, सरोजिनी नगर, तेलीबाग, वृंदावन योजना और रायबरेली रोड तथा फ़ैज़ाबाद रोड की नई कॉलोनियाँ। इन मोहल्लों में हमारी कोई ब्रांच नहीं है — कलेक्शन आपके घर आती है।",
      "एक बात साफ़ कह दें: हम लखनऊ के ट्रैफ़िक से तेज़ नहीं हैं। इसीलिए स्लॉट एक समय नहीं, एक विंडो होता है, और वही कन्फ़र्मेशन कॉल पर बता दिया जाता है। जो लैब किसी भी पते पर 30 मिनट का वादा करे, उसे सुबह 9 बजे आलमबाग में एक बार जाँच लीजिए।",
      "बड़े संस्थान शहर के अलग-अलग छोर पर हैं — एसजीपीजीआई, केजीएमयू, आरएमएलआईएमएस, बलरामपुर और सिविल। ओपीडी की तारीख़ मिलते ही पर्ची पर लिखी रूटीन जाँच पहले करा लीजिए, वरना डॉक्टर जाँच लिखकर अगली तारीख़ दे देता है और वही सफ़र दोबारा करना पड़ता है। हम किसी अस्पताल से जुड़े नहीं हैं; अस्पताल अपनी सूची दे तो वही चलेगी।",
      "कौन सी जाँच कब — बुख़ार के पहले 1 से 5 दिन में डेंगू NS1, पाँचवें दिन के बाद डेंगू IgM, और टाइफ़ाइड की विडाल जाँच के लिए कम से कम 5 से 7 दिन का बुख़ार चाहिए। हर बुख़ार में CBC साथ में ज़रूर कराएँ। शुगर, लिपिड और सभी फुल बॉडी पैकेज में 10 से 12 घंटे खाली पेट रहना पड़ता है; उस दौरान सादा पानी पीते रहिए।",
      "दाम: ब्लड शुगर ₹100, CBC ₹400, थायरॉइड प्रोफ़ाइल ₹550, HbA1c ₹600, लिवर फ़ंक्शन टेस्ट ₹600, किडनी फ़ंक्शन टेस्ट ₹700, लिपिड प्रोफ़ाइल ₹800, विटामिन डी ₹1,000, विटामिन बी12 ₹1,200, डेंगू ₹1,200। पैकेज ₹999, ₹1,999 और ₹2,999 से।",
      "एक बात साफ़ है: RT-PCR टेस्ट हम नहीं करते। वह मॉलिक्युलर लैब में होता है और इस पेज पर उपलब्ध जाँचों में नहीं है — लखनऊ में वह करने वाले सरकारी अस्पताल और लैब दोनों हैं।",
      "एक चेतावनी: डेंगू में प्लेटलेट बहुत गिर जाए, नाक या मसूड़े से खून आए, लगातार उल्टी हो, या मरीज़ सुस्त पड़ा रहे — तो जाँच बुक मत कीजिए, सीधे अस्पताल ले जाइए। बच्चे को तेज़ बुख़ार के साथ झटके आएँ, तब भी यही बात है।",
      "बुकिंग के लिए ऊपर दिया फ़ॉर्म भर दीजिए या फ़ोन कर दीजिए। लगभग 30 मिनट में कॉल आकर समय, पता, खाली पेट रहना है या नहीं, और कुल दाम — चारों तय हो जाते हैं। सोसाइटी में रहते हैं तो टावर, फ़्लैट नंबर और गेट पर किस नाम से एंट्री मिलेगी, यह ज़रूर बता दीजिए।",
    ],
  },
];

/**
 * Lucknow's FAQs.
 *
 * Every one is this city's own question. Deliberately NOT copied from
 * defaultFaqs(): the generated set answers "kya aap mere ilaake me aate hain"
 * and "kitna kharcha" in a city-neutral way, and a metro's versions have to
 * carry the cross-city journey, the traffic, the hospital appointment, the
 * parents living alone, and the two questions this page exists to answer
 * honestly — RT-PCR, and "which is the best / cheapest lab".
 *
 * ⚠ The "affordable" and "best diagnostic centre" questions below are the ONLY
 * place those words appear on this page, and both answers refuse the boast and
 * give checkable facts instead. Do not move those words into the body copy.
 *
 * ⚠ The traffic answer must not turn into a speed promise — see the same
 * warning on `sheher-ke-andar-doori-lucknow`.
 *
 * There are twelve, which is exactly the cap in the route
 * (src/app/(lab)/lab-test/[city]/page.js). A thirteenth would not render, so
 * if one is added another has to go.
 *
 * The rate line in the first answer must match the price section above AND
 * defaultTests() in src/data/lab/defaults.js. Those three are the only places
 * a price appears for this city.
 */
export const lucknowFaqs = [
  {
    q: "How much does a lab test cost in Lucknow, and is home sample collection free?",
    a: "You pay only the price printed on the test card — home sample collection anywhere in Lucknow is completely free, with no visiting charge and no hidden fee. Blood Sugar is ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, and the Basic Full Body Checkup starts at ₹999. The total is confirmed on the call before the visit, and payment is taken at the time of collection, by cash or UPI.",
  },
  {
    // "affordable lab tests in lucknow" — the intent, answered without a
    // comparative claim. See the warning above this array.
    q: "Are lab tests in Lucknow affordable, and how do I know I am not being overcharged?",
    a: "We will not tell you our rates are the lowest in the city, because any lab can say that and no one can check it. What you can check is this: every rate is printed on the card on this page, home sample collection adds nothing to it, and the full amount is told to you on the confirmation call before anyone comes to your door. If you are comparing labs, ask all of them the same three questions — what does the test itself cost, what does collection cost, and when does the report come. A lab that answers all three plainly is the one to book.",
  },
  {
    // "best diagnostic center in lucknow" — same treatment.
    q: "Which is the best diagnostic centre in Lucknow?",
    a: "We are not going to call ourselves the best, and in a city with this many labs we would be careful with anyone who does. What is worth judging a lab on is checkable: is the price told to you before the visit, does the person collecting the sample carry an ID card, is the sample drawn in front of you, and is a clear report time committed to. On this page the answers are yes, yes, yes, and 24 hours for routine tests. We hold no accreditation and we do not claim one, and there is no walk-in counter of ours in Lucknow — this is a home collection service across the whole city, with slots from 6 AM.",
  },
  {
    q: "Do you do the RT-PCR test in Lucknow?",
    a: "No. RT-PCR requires a molecular laboratory, and it is not among the tests available on this page — we do not collect samples for it. Lucknow has both government hospitals and molecular laboratories that do run it, so it is not hard to find here. If you need the report for travel or a visa, confirm two things with that centre first: that their report is accepted for your purpose, and how many hours it takes. What we run is routine pathology collected from your home — CBC, blood sugar, HbA1c, thyroid, lipid, liver and kidney function, vitamins, dengue and the full body checkup packages.",
  },
  {
    q: "Will I get a same day lab test report in Lucknow?",
    a: "Often, but the commitment is 24 hours. Most routine tests — CBC, sugar, lipid, LFT, KFT, thyroid, urine routine — are ready 6 to 24 hours after the sample reaches the lab, so a sample given early in the morning is usually reported the same evening. What we promise is a report within 24 hours, sent as a PDF on both WhatsApp and email, because collection time, distance across the city and the type of test all affect it. Cultures are the exception and take 48 to 72 hours, since the organism has to be grown before sensitivity can be tested.",
  },
  {
    q: "Which areas of Lucknow do you cover?",
    a: "The whole city. In the centre: Hazratganj, Kaiserbagh, Aminabad, Chowk, Naka, Aishbagh, Lalbagh and Civil Lines. Across the Gomti: Gomti Nagar and Gomti Nagar Extension, Vibhuti Khand, Indira Nagar, Nishatganj, Mahanagar, Daliganj, Chinhat and the newer colonies along Faizabad Road. North and west: Aliganj, Nirala Nagar, Jankipuram, Vikas Nagar, Gudamba, Triveni Nagar, Rajajipuram, Balaganj, Thakurganj and Dubagga. South: Alambagh, Charbagh, Krishna Nagar, Ashiyana, Bangla Bazaar, LDA Colony, Sarojini Nagar, Amausi, Telibagh, Vrindavan Yojana and Sushant Golf City. We have no branch in any of these localities — the collection comes to you.",
  },
  {
    // The city's own question, and the one place an over-promise would be
    // easiest to make. Read the warning above this array.
    q: "How quickly can the phlebotomist reach my address in Lucknow traffic?",
    a: "We give you a slot window rather than a single time, and that window is told to you on the confirmation call. We are not faster than this city's traffic and we would rather say so than promise a fixed thirty minutes to any address — that promise breaks first in Alambagh or Hazratganj at 9 AM. If something on the road delays the visit, you get a phone call about it instead of being left waiting. Booking the first slot, from 6 AM, is the most reliable way to have the sample given before the city gets moving.",
  },
  {
    q: "I have an OPD appointment at a big hospital in Lucknow. Should I get the tests done before I go?",
    a: "For the routine tests already written on your prescription, yes — that is usually the difference between the appointment moving forward and the doctor prescribing tests and giving you another date, which in a big institute can be weeks away. CBC, sugar, HbA1c, thyroid, liver, kidney and lipid are all run on a sample and can be collected at your home, and the report is a PDF you can simply show. To be clear, we are not associated with any hospital or institute and do not collect on their behalf: if the hospital asks for its tests to be done in its own laboratory, follow their list — theirs is the one that counts.",
  },
  {
    q: "My parents live alone in Lucknow. Can I book a test for them from another city?",
    a: "Yes, and this is one of the most common bookings we take here. Fill in the form with the mobile number that will actually be answered at their home, and tell us at the time of booking if the patient is elderly, bedridden or hard of hearing, so the phlebotomist comes prepared. The sample is collected at their home in about ten minutes and the report reaches you as a PDF wherever you are, so you can take it to a doctor from there. Payment can be made by UPI from outside the city. For this age the tests that matter most are blood sugar and HbA1c, kidney function, lipid profile, CBC and TSH — none of which show symptoms on their own.",
  },
  {
    q: "Which tests require fasting, and which can be done after office hours?",
    a: "Fasting Blood Sugar, Lipid Profile and all three Full Body Checkup packages need 10 to 12 hours without food; plain water is allowed throughout. Tea, milk, a biscuit or a toffee are not — a single cup of tea is enough to change the result. CBC, Thyroid Profile, HbA1c, Vitamin D, Vitamin B12 and Dengue need no fasting at all, so those can be booked for an evening slot after work. Slots start at 6 AM precisely so that a fasting sample can be given, breakfast eaten, and the office reached on time without taking leave.",
  },
  {
    q: "Which full body checkup package should I choose in Lucknow?",
    a: "If this is your first checkup and you have no particular complaint, the Basic Full Body Checkup at ₹999 covers 45 parameters — CBC, sugar, lipid, liver and kidney function — and is enough. The Advanced Full Body at ₹1,999 covers 72 parameters and adds thyroid, HbA1c and vitamins, which is the one worth taking if you have a desk job, rising weight, or a past complaint of sugar, thyroid or vitamin deficiency. The Senior Citizen Pack at ₹2,999 covers 88 parameters and weights the panel towards heart, bones and sugar for those over 55. All three need 10 to 12 hours of fasting, so book a morning slot.",
  },
  {
    q: "How do I book a blood test online in Lucknow, and what are the payment options?",
    a: "Choose your test on this page and fill in the form, or simply call us. If you have a doctor's prescription, keep a photo of it handy so that exactly the panel written on it is run. A confirmation call comes within about 30 minutes and settles four things — the slot window, the full address, whether fasting is needed, and the total amount. If you live in an apartment or a gated society, give the tower and flat number and the name entry will be allowed under, because that is what holds visits up here more than anything else. Payment is taken at collection, by cash or UPI (PhonePe, Google Pay, Paytm), and several people in the same household can be tested in a single visit at no extra collection charge.",
    links: [{ href: GUIDE_LAB_TEST, label: "Which test, and when — a guide" }],
  },
];
