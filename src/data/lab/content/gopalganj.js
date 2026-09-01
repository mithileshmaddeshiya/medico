/**
 * /lab-test/gopalganj — the district's long-form copy and its FAQs.
 *
 * ── THE ARGUMENT THIS PAGE MAKES, AND WHY IT IS NOT ANY OTHER PAGE'S ─────
 * Every district page on this site has to argue from its own situation, or
 * Google reads the set as one page with the noun swapped and indexes none of
 * them properly. The neighbours already argue:
 *
 *   Deoria / Salempur — "the big diagnostics are far, skip the journey"
 *   Siwan             — pulled three ways: Chhapra, Patna, Gorakhpur
 *   Ghazipur          — Varanasi is an hour away and that closeness is a habit
 *   Ballia            — the Ganga diara, the water, the summer
 *   Kushinagar        — the cane mill belt and children's fevers
 *
 * Gopalganj's situation is the inverse of Ghazipur's and a degree past Siwan's:
 * NOTHING is close. Siwan is about 30 km but is itself a district town, not a
 * referral centre; after that the nearest real options are Chhapra (~85 km),
 * Muzaffarpur (~100 km across the Gandak), Gorakhpur (~120 km on NH-27) and
 * Patna (~150 km). And for some weeks a year the Gandak decides which of those
 * roads is usable at all. So this page does not say "skip the journey" — it
 * says the journey is not one decision, it is four, and it is seasonal. That
 * is Gopalganj's own argument and nobody else's here.
 *
 * ── WHAT IS GENUINELY LOCAL HERE ─────────────────────────────────────────
 * Four things, and each earns a section rather than a sentence:
 *
 *   1. THE GANDAK AND THE EMBANKMENT. The Narayani/Gandak runs along this
 *      district's eastern side, the Valmiki Nagar barrage upstream decides how
 *      much water arrives, and Barauli, Sidhwalia, Baikunthpur, Manjha and
 *      Kuchaikote take it. This is NOT Ballia's arsenic story (that is water
 *      chemistry, and it is already written at length on Ballia's page), and
 *      it is not Ghazipur's post-flood month either.
 *
 *      ⚠ AND IT IS WHERE THIS PAGE HAS TO ADMIT A LIMIT. When water is
 *      standing and a link road is cut, a collection round cannot reach a
 *      diara tola, and the section says so in plain words instead of quietly
 *      taking the booking. A page that promised a 6 AM visit into a flooded
 *      block would be lying in the one week the reader most needs the truth.
 *      Same rule as the Gulf medical on Siwan's page and the recruitment
 *      medical on Ghazipur's: say what we cannot do, then be useful about
 *      what we can — which here is the fortnight BEFORE and the month AFTER.
 *
 *   2. PREGNANCY AND THE ANTENATAL PANEL. No other city page on this site owns
 *      this, and it is one of the most common reasons a household here books
 *      blood work at all. Deoria and Siwan each carry one line about CBC in
 *      pregnancy inside their anaemia sections; this page gives the antenatal
 *      panel a heading of its own, because a woman in Bhore or Kateya who
 *      cannot spend a day at a town lab is exactly who home collection was
 *      built for.
 *
 *      ⚠ It stays a TESTING page throughout. It never advises on treatment,
 *      never names a dose, and it says outright that the panel is decided by
 *      the doctor's parcha, not by this page.
 *
 *   3. THAWE JUNCTION AND NH-27 — the four-direction problem described above.
 *      Thawe is the district's rail junction, a few kilometres out of town,
 *      and NH-27 puts Gorakhpur and Muzaffarpur on the same road in opposite
 *      directions. This is why a 6 AM slot matters here more than anywhere:
 *      it is what makes a same-day trip in any of the four directions work.
 *
 *   4. MIGRATION — REFERENCED, NOT REWRITTEN. Gopalganj is a high
 *      out-migration district, exactly like Siwan next door. Siwan's page
 *      already argues that at length (`gulf-jaane-wale-siwan`), and kala-azar,
 *      which occurs across both, is written up there too
 *      (`lamba-bukhar-kala-azar-siwan`). Repeating either here would be the
 *      duplicate this whole file exists to avoid, so Gopalganj's travel
 *      section states its own version in a paragraph and LINKS across.
 *
 * ── CLAIMS ───────────────────────────────────────────────────────────────
 * Only the five this business confirms: free home collection, a trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI
 * on collection. NOT claimed anywhere: NABL accreditation, pathologist
 * verification, cold-chain transport, barcode tracking, sealed single-use
 * needles — removed from this project once already, see the warning above
 * defaultFaqs in src/data/lab/defaults.js. There is no walk-in counter in this
 * district and nothing here says there is.
 *
 * NOT CLAIMED however well it would rank:
 *
 *   "RT-PCR test lab in Gopalganj"  — we do not run RT-PCR. It needs a
 *       molecular lab, and there is no such test in defaultTests(). The page
 *       says so plainly in `rt-pcr-covid-gopalganj` and answers the question
 *       honestly in the FAQ, and for that reason NO RT-PCR term appears in
 *       this city's `keywords` array in src/data/lab/cities.js. Ranking for a
 *       test we cannot run is a bait, and it is the kind that ends at a
 *       doorstep with a phlebotomist who has to say no.
 *
 *   "24 hour lab in Gopalganj" — collection runs 6 AM to evening. The page
 *       says "report 24 ghante me", which is true, never "24 ghante khula".
 *
 *   "Sabse sasta" / "best lab in Gopalganj" — no comparative price or quality
 *       claim is made in the copy. Two FAQs DO carry the words "affordable"
 *       and "best diagnostic centre", because that is what people type — but
 *       both answer with checkable facts (the rate is on the card, collection
 *       adds nothing, here is how to judge a lab) instead of with a boast.
 *       That is the only place those words appear.
 *
 *   "Same day report" — the site's commitment is 24 hours. The report section
 *       says what is actually true: routine work is often back the same day
 *       when the sample is given early, and the promise is 24 hours. It never
 *       inverts those two.
 *
 * The Sadar Hospital and the private clinics are described as existing, which
 * they do. No named institution is claimed as a partner, because none is.
 *
 * Distances are hedged ("kareeb") because they are road distances that vary by
 * route, not measured facts.
 *
 * ── HOW THE KEYWORDS ARE PLACED ──────────────────────────────────────────
 * One primary term ("lab test in Gopalganj" / "Gopalganj me lab test"),
 * carried by the URL, the h1, the title and the lead. Everything else gets a
 * SEPARATE heading, because a heading ranks and a keyword buried in a
 * paragraph mostly does not: pathology lab / diagnostic centre / near me,
 * home collection by locality (Station Road, bus stand, market, Thawe, Hathua
 * and the blocks), online booking, flood illness, dengue-typhoid-malaria, the
 * antenatal panel, diabetes and thyroid, liver function test, full body
 * checkup package, price and rate list, RT-PCR, report timing, fasting. Each
 * appears in ONE h2 and then reads as ordinary prose.
 *
 * The locality heading is what makes a search from ANY corner of the district
 * land here — "<kasba> me blood test" is how this is actually typed, and the
 * only honest way to rank for it is to name the places a round really reaches
 * and to say plainly that there is no branch office in any of them.
 *
 * ── INTERNAL LINKS ───────────────────────────────────────────────────────
 * Paragraph parts shaped { text, href } render as real in-prose links (see
 * LabContent). Every href below must be a route that renders:
 *   /lab-test/{siwan,deoria,gorakhpur,kushinagar}   (src/data/lab/cities.js)
 *   /blogs/lab-test/{deoria,varanasi}               (src/data/blogs/)
 *   /blogs/full-body-checkup/varanasi
 */

/* Link targets. Constants so a route rename is a one-line fix here instead of
   a hunt through the prose — and so a typo shows up as `undefined` in the href
   rather than as a silent 404 in production. */
const LAB_SIWAN = "/lab-test/siwan";
const LAB_DEORIA = "/lab-test/deoria";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_KUSHINAGAR = "/lab-test/kushinagar";

/* Deep links into Siwan's page rather than repeating it here — see point 4 of
   the header. The anchors are those sections' `id` in content/siwan.js;
   renaming them there breaks these links and nothing will warn you. */
const SIWAN_KALA_AZAR = `${LAB_SIWAN}#lamba-bukhar-kala-azar-siwan`;
const SIWAN_GULF = `${LAB_SIWAN}#gulf-jaane-wale-siwan`;

const GUIDE_LAB_TEST = "/blogs/lab-test/deoria";
const GUIDE_FULL_BODY = "/blogs/full-body-checkup/varanasi";
const GUIDE_FASTING = "/blogs/lab-test/varanasi#fasting-aur-taiyari";
const GUIDE_REPORT = "/blogs/lab-test/varanasi#report-kaise-padhein";

export const gopalganjContent = [
  {
    id: "lab-test-in-gopalganj",
    h: "Gopalganj Me Lab Test — Ghar Baithe Blood Test Booking Aur Free Home Sample Collection",
    p: [
      "Gopalganj ki dikkat ek nahi, chaar hain. Siwan kareeb 30 kilometre hai lekin wo khud ek zila mukhyalaya hai, koi bada referral centre nahi. Uske aage Chhapra kareeb 85 kilometre, Muzaffarpur Gandak paar kareeb 100, Gorakhpur NH-27 par kareeb 120 aur Patna kareeb 150 kilometre. Yaani jaana kahin bhi ho, poora din jaata hai — aur saal me kuch hafte Gandak tay karti hai ki kaun si sadak chalu bhi hai.",
      "Isi wajah se yahan sabse zyada nuksaan un jaanchon ka hota hai jo asal me sabse aasan hain. Ek CBC ya ek sugar test ke liye subah ki gaadi pakadna, khaali pet safar karna, wahan line me lagna aur report ke liye dobara jaana — do sau rupaye ka test aur do din. Ye page usi aadat ko todne ke liye hai.",
      "MedicoBharat ki lab test service Gopalganj me home sample collection par chalti hai. Aap apne ghar ka pata dete hain, subah ka slot chunte hain, aur trained phlebotomist ID card ke saath aapke darwaze par aata hai. Sample aapke saamne liya jaata hai aur report 24 ghante ke andar WhatsApp aur email dono par PDF me aa jaati hai. Home collection ka koi alag charge nahi — na visiting fee, na koi chhupa hua kharch.",
      "Yahan routine pathology ke saare test aur checkup package book hote hain — CBC, Thyroid Profile (T3, T4, TSH), Blood Sugar, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test, Vitamin D, Vitamin B12, Dengue aur Full Body Checkup. Doctor ne parcha likh diya hai to usi panel ke hisaab se booking ho jaati hai; koi test is page ke card par na dikhe to prescription ke saath ek call kar lijiye — bata diya jaayega ki wo ho sakta hai ya nahi.",
      [
        "Kaun sa test kab karana chahiye, bukhar me kis din test matlab rakhta hai, aur report ke numbers me kya dekhna chahiye — us par alag se guide hai: ",
        { text: "kaun sa test kab karayein", href: GUIDE_LAB_TEST },
        ".",
      ],
    ],
  },

  {
    id: "pathology-lab-diagnostic-centre-gopalganj",
    h: "Gopalganj Me Pathology Lab Ya Diagnostic Centre Dhoondh Rahe Hain? \"Lab Near Me\" Ka Seedha Jawab",
    p: [
      "Log \"Gopalganj me pathology lab\", \"diagnostic centre near me\" ya \"blood test near me\" isliye search karte hain kyunki unhe lagta hai kahin jaana hi padega. Zila mukhyalaya par Sadar Hospital hai aur sheher me kai private clinic aur collection centre bhi. Lekin routine pathology me ab kahin jaana zaroori nahi raha — khoon aur peshaab ke jitne bhi aam test hain, wo sample par hote hain, aur sample aapke ghar par liya ja sakta hai.",
      "Iska matlab ye nahi ki har cheez ghar par ho jaayegi. X-ray, ultrasound, ECG, CT scan aur MRI machine par hote hain, aur unke liye centre par hi jaana padega. Ye page unke liye nahi hai; ye un test ke liye hai jinke liye aaj bhi log subah ki line me lagte hain jabki lagne ki zaroorat nahi.",
      "Aur ek baat saaf kar dein: hum Gopalganj me koi walk-in counter ya branch hone ka daawa nahi karte. Jo hai wo ye hai — aapke ghar par sample lene wali service, poore jile me, subah 6 baje se shaam tak ke slot me. Koi bhi lab aapko \"Gopalganj branch\" bata kar bulaaye to uska pata pehle poochh lijiye; ye ek chhota sawaal hai jo kaafi kuch bata deta hai.",
      "MedicoBharat pathology Gopalganj Bihar ki poori rate list isi page par neeche hai — har test ka daam card par likha hai, aur wahi daam collection ke waqt liya jaata hai.",
    ],
  },

  {
    id: "home-collection-areas-gopalganj",
    h: "Gopalganj Me Blood Test Home Collection — Station Road Aur Bus Stand Se Thawe, Hathua, Mirganj Aur Bhore Tak",
    p: [
      "Sheher me Station Road, bus stand ke aas-paas ka ilaaka, Sadar Hospital ki taraf, bazaar aur main market ke mohalle, aur Thawe road ki taraf ke ghar — sab cover hote hain. Log aksar \"pathology lab near bus stand Gopalganj\" ya \"medical lab near Station Road\" search karte hain; yahan jawab ye hai ki aapko bus stand ya station tak aane ki zaroorat hi nahi — sample lene wala aapke ghar par aayega.",
      "Jile me Thawe, Hathua, Mirganj, Kuchaikote, Barauli, Sidhwalia, Baikunthpur, Manjha, Uchkagaon, Bhore, Kateya, Vijayipur, Phulwaria, Panchdeori aur Sasamusa ki taraf ke gaon aur tole cover hote hain. Thawe Junction sheher se kareeb chhah kilometre par hai aur us taraf ke bahut se ghar apne tole ke naam se hi jaane jaate hain — isliye list me naam na dikhe to bhi ek baar call kar lijiye.",
      "Pata likhte waqt landmark zaroor daaliye. Yahan house number se kaam nahi chalta: school, mandir, masjid, petrol pump, bazaar, chowk, station ya panchayat bhavan — koi ek nishani likh dijiye, aur saath me apne block aur panchayat ka naam. Sirf \"Gopalganj\" likh dena kaafi nahi hota; jile me kai gaon milte-julte naam se hain.",
      "Booking ke waqt teen cheezein aur bata dijiye: ghar me kitne logon ka test hai, koi bujurg ya bistar par pada mareez to nahi, aur ghar tak gaadi ya bike aa sakti hai ya nahi. Yahi teen jaankariyan visit ko waqt par pahunchati hain aur phlebotomist ko us hisaab se taiyaar aane deti hain.",
      [
        "Jile ke paschim me Siwan aur seema ke us paar Deoria tatha Kushinagar padte hain. Un taraf ke reader ke liye ",
        { text: "Siwan me lab test", href: LAB_SIWAN },
        ", ",
        { text: "Deoria me lab test", href: LAB_DEORIA },
        " aur ",
        { text: "Kushinagar me lab test", href: LAB_KUSHINAGAR },
        " — teenon par yahi service usi tarah chalti hai.",
      ],
    ],
  },

  {
    id: "book-blood-test-online-gopalganj",
    h: "Gopalganj Me Blood Test Online Book Kaise Karein — Form Ya Ek Phone Call",
    p: [
      "Booking ka tarika seedha hai. Is page par upar diye form me apna naam, mobile number, ilaaka aur test chuniye — ya seedha call kar dijiye. Doctor ka parcha hai to uski photo taiyaar rakhiye; usi panel ke hisaab se booking ho jaayegi aur koi test chhootega nahi.",
      "Lagbhag 30 minute me confirmation call aata hai. Usmein chaar cheezein tay hoti hain: slot ka waqt, poora pata landmark ke saath, ye ki test me fasting chahiye ya nahi, aur total daam. Isi call par saara hisaab saaf ho jaata hai — baad me koi naya charge nahi judta.",
      "Slot subah 6 baje se shuru hote hain aur shaam tak chalte hain. Fasting wale test hamesha subah rakhwaiye. Phlebotomist ID card ke saath aata hai aur sample aapke saamne leta hai — dene se pehle card dekh lena aapka hak hai, aur maangne me sankoch mat kijiye.",
      "Ek visit me ghar ke kai logon ka sample liya ja sakta hai — ek hi trip, aur collection tab bhi free. Jin gharon me bujurg hain ya kaam par jaane wale log subah nikal jaate hain, unke liye yahi sabse aasan tarika hai: sab ka sample ek saath, ek hi subah.",
      "Online booking ka ek faayda aur hai jo aksar dhyan me nahi aata — jo test aapne book kiya wahi report me aata hai, aur uska record aapke phone par rehta hai. Zubaani order me test badal jaane ki jo shikayat hoti hai, wo yahan nahi hoti.",
    ],
  },

  {
    /* ⚠ THE SECTION WHERE WE ADMIT A LIMIT. Read the file header before
       editing a word of it. During peak flooding a collection round cannot
       reach a cut-off diara tola, and this section says so. Do not soften it
       into "hum har jagah pahunchte hain" to catch the query — that sentence
       is the one that turns a ranking page into a complaint, and it would be
       made in the one week the reader most needs the truth. */
    id: "gandak-baadh-gopalganj",
    h: "Gandak Ka Paani — Baadh Se Pehle, Baadh Ke Baad, Aur Wo Hafte Jab Hum Nahi Pahunch Paate",
    p: [
      "Gandak (Narayani) is jile ke poorabi kinare se guzarti hai, aur upar Valmiki Nagar barrage se chhoda gaya paani hi bahut kuch tay karta hai. Barauli, Sidhwalia, Baikunthpur, Manjha aur Kuchaikote ki taraf ka ilaaka har saal us paani se kuch na kuch jhelta hai — kabhi tatbandh par dabaav, kabhi link road ka doob jaana.",
      "Pehle wo baat jo koi lab nahi likhta: jab paani khada ho aur link road kati ho, tab hamari collection ki gaadi us tole tak nahi pahunch paati. Aise me hum booking le kar aapko intezaar karwaane ke bajaye call par saaf bata dete hain ki abhi pahunchna mumkin nahi hai. Ye is page ka sabse imaandar hissa hai, aur isse hum peeche nahi hatenge.",
      "Isi liye do waqt sabse kaam ke hain. Ek, paani chadhne se pehle ka pandrah din — ghar ke bujurg, sugar ya BP ki dawa par chal rahe log, aur garbhvati mahilaen — inki jo jaanch pending hai wo isi khidki me nipta lijiye. Do, paani utarne ke baad ka mahina, jo bimari ke lihaaz se saal ka sabse nazuk waqt hota hai.",
      "Paani utarne ke baad handpump aur kuwein ka paani milawat le leta hai, aur wahin se typhoid aur jaundice shuru hote hain. Teen cheezein dhyan me rakhiye: aankhon ya peshaab me peelapan dikhte hi Liver Function Test (bilirubin, SGOT, SGPT); lagatar bukhar 5 se 7 din se zyada chale to typhoid ki jaanch; aur ulti-dast ke baad kamzori bani rahe to CBC ke saath Kidney Function Test, jisse pata chalta hai ki paani ki kami ne kitna asar dala.",
      "Garbhvati mahila ko baadh ke baad jaundice ho to bilkul der mat kijiye — turant doctor ko dikhaiye. Ye ek maamla hai jismein intezaar karna sahi nahi hota, aur ise ghar par sample ke bharose bilkul mat chhodiye.",
      "Aur wahi purani salah, jo har saal isliye dohrai jaati hai kyunki wo kaam karti hai: jab tak paani ka source theek na ho jaaye, peene ka paani ubaal kar peejiye. Ye ek aadat is mausam ke aadhe maamle rok deti hai.",
    ],
  },

  {
    id: "bukhar-dengue-typhoid-malaria-gopalganj",
    h: "Gopalganj Me Dengue, Typhoid Aur Malaria Test — Bukhar Ke Kis Din Kaunsa Test",
    p: [
      "Barsaat ke baad yahan bukhar ka mausam shuru hota hai, aur sabse aam galti ye hoti hai ki test galat din par kara liya jaata hai. Report \"negative\" aa jaati hai, ghar wale nishchint ho jaate hain, aur bimari chalti rehti hai.",
      "Seedha niyam ye hai. Dengue NS1 bukhar ke pehle 1 se 5 din me sahi jawab deta hai; paanchve din ke baad NS1 ki jagah IgM matlab rakhta hai. Typhoid ke Widal test ke liye kam se kam 5 se 7 din ka bukhar chahiye — teesre din ka Widal aksar bekaar jaata hai aur galat tasalli de deta hai. Malaria ki jaanch bukhar chadhte waqt sabse achhi hoti hai.",
      "Har bukhar me CBC saath me karwa lijiye. Platelet ka girna, white cell ka pattern aur haemoglobin — teenon milkar doctor ko wo tasveer dete hain jo akela ek test nahi de paata. Fever Panel me malaria, typhoid aur dengue ek saath aa jaate hain; uska daam is page ke rate card par \"call for price\" isliye hai kyunki panel me kya jodna hai wo lakshan aur bukhar ke din par tay hota hai.",
      [
        "Ek bukhar aisa hai jo is belt me alag se dhyan maangta hai — do hafte se zyada chalne wala bukhar jismein tilli badh jaati hai aur wazan girta hai. Kala-azar is ilaake me hota hai, aur uski jaanch tatha ilaaj sarkari kendron par muft milta hai. Us par is site par alag se likha gaya hai: ",
        { text: "lamba bukhar aur kala-azar", href: SIWAN_KALA_AZAR },
        " — baat Siwan aur Gopalganj dono par ek jaisi lagu hoti hai.",
      ],
      "Aur ek chetavni jo har mausam par lagu hai: bachche ko tez bukhar ke saath jhatke aayein, behoshi ho, gardan akad jaaye ya wo sust pada rahe — to ghar par sample ka intezaar bilkul mat kijiye, seedha najdeeki aspatal le jaaiye. Aise me ek ek ghanta maayne rakhta hai, aur koi bhi lab report us waqt se zyada keemti nahi hai.",
      [
        "Bukhar ke kis din kaunsa test — is par din-war samjhaane wali ",
        { text: "guide yahan hai", href: GUIDE_LAB_TEST },
        ".",
      ],
    ],
  },

  {
    /* ⚠ TESTING ONLY. This section names panels and says who decides them —
       the doctor. It must never drift into advice on treatment, dose, diet or
       what a number "means" for a pregnancy. Read the file header. */
    id: "garbhvati-mahila-jaanch-gopalganj",
    h: "Gopalganj Me Garbhvati Mahila Ki Jaanch — Blood Group, CBC, Sugar Aur Thyroid Ghar Par",
    p: [
      "Is jile ke bahut se gharon me kamane wala aadmi bahar rehta hai, aur ghar mahilaen sambhaalti hain. Aisi grihasthi me garbhvati mahila ka lab test sabse zyada isliye chhoot jaata hai kyunki uske liye kisi ko saath jaana padta hai, aadha din lagta hai aur gaadi ka intezaam karna padta hai. Ghar par sample dene ka sabse bada faayda yahin dikhta hai.",
      "Jo jaanch aam taur par likhi jaati hai wo ye hain: Blood Group aur Rh factor, CBC (haemoglobin ke liye), Blood Sugar, thyroid ke liye TSH, aur Urine Routine. Inke saath doctor apne hisaab se aur test likh sakta hai. Saaf baat — panel doctor ke parche se tay hota hai, is page se nahi; hum wahi karte hain jo likha ho.",
      "Haemoglobin par khaas dhyan dijiye. Is ilaake me khoon ki kami itni aam hai ki use bimari maana hi nahi jaata — thakan, chakkar, saans phoolna aur chehre ka peelapan \"kamzori\" keh kar chhod diya jaata hai. Pregnancy me CBC har trimester me kam se kam ek baar dohraana chahiye, taaki number badalne par waqt rehte pata chal jaaye.",
      "Sirf haemoglobin dekh lena aadha jawab hai. CBC me red cell ka size aur count bhi aata hai, jisse doctor ko pata chalta hai ki kami ki wajah kya hai — aur ilaaj poore jawab par tay hota hai, aadhe par nahi. Iron ki dawa shuru karne se pehle aur kuch hafte baad, dono baar CBC karwa lena isliye theek hai ki tab pata rehta hai ki dawa kaam kar rahi hai ya nahi.",
      "CBC, blood group aur TSH me fasting nahi chahiye — ye din me kabhi bhi ho sakte hain. Sugar ki jaanch me fasting ka niyam doctor bataata hai, isliye booking ke waqt parche ki photo bhej deejiye. Ek visit me ghar ke doosre logon ka sample bhi liya ja sakta hai, aur collection tab bhi free rehta hai.",
      "Kisi bhi tarah ka khoon aana, tez pet dard, lagatar ulti, chakkar ke saath dhundhla dikhna ya bukhar — inme se kuch bhi ho to jaanch book karne se pehle doctor ko dikhaiye. Ye lab ka nahi, turant dekhne ka maamla hai.",
    ],
  },

  {
    id: "diabetes-thyroid-gopalganj",
    h: "Gopalganj Me Diabetes Checkup, Sugar Test, HbA1c Aur Thyroid Test (TSH) — Kis Umar Me Kya",
    p: [
      "Sugar aur thyroid dono chupke se badhte hain. Jab tak lakshan dikhte hain — bahut pyaas, baar baar peshaab, wazan ka girna ya badhna, thakan, baal jhadna — tab tak kaafi waqt nikal chuka hota hai. Isi liye inhe lakshan par nahi, umar aur ghar ke itihaas par jaancha jaata hai.",
      "Aam salah ye hai: 30 ke baad saal me ek baar Fasting Blood Sugar. Ghar me kisi ko diabetes hai, wazan zyada hai, ya pehle sugar border par nikla tha — to sugar ke saath HbA1c bhi, jo teen mahine ka ausat batata hai aur ek din ke khaane-peene se nahi badalta. Mahilaon me thyroid zyada aam hai, isliye 30 ke baad TSH ek baar zaroor.",
      "Jo pehle se dawa par hain unke liye asli baat follow-up hai — aur yahi is jile me sabse zyada chhootne wali cheez hai. Bahut se log dawa Patna, Muzaffarpur, Gorakhpur ya Delhi me shuru karte hain, ghar aakar wahi purani dose chalate rehte hain, aur saalon dobara nahi jaanchte. HbA1c har teen mahine aur TSH doctor ke kahe anusar — dono ghar par ho jaate hain aur dono sabse saste me ho jaate hain.",
      "Ek baat khaas kar diabetes ke mareezon ke liye: sugar ke saath saal me ek baar Kidney Function Test aur Lipid Profile bhi karwa lijiye. Sugar ka asar sabse pehle chup-chaap gurde aur charbi par dikhta hai, aur wo dono is page par alag se book ho jaate hain.",
      "Fasting wale test ke liye subah 6 baje se slot rakhe gaye hain, taaki sample dekar aap turant naashta kar sakein. HbA1c aur TSH me fasting nahi chahiye — wo din me kabhi bhi ho sakte hain.",
    ],
  },

  {
    id: "liver-function-test-gopalganj",
    h: "Gopalganj Me Liver Function Test — Peeliya, Fatty Liver Aur Wo Jaanch Jo Der Se Hoti Hai",
    p: [
      "Liver Function Test (LFT) is jile me do wajahon se sabse zyada likha jaata hai: baadh ke baad ka peeliya, aur wo shikayat jo mahino chalti rehti hai — bhookh na lagna, pet ke upari daahine hisse me bhaaripan, jee michlana aur bina wajah ki thakan.",
      "LFT me kya aata hai: total aur direct bilirubin, SGOT (AST), SGPT (ALT), alkaline phosphatase, aur protein tatha albumin. Inhe milakar padha jaata hai — akela ek number kuch nahi kehta. Aankhon ya peshaab me peelapan dikhte hi LFT karwa lena isliye sahi hai ki number bata dete hain ki maamla halka hai ya doctor ke paas turant jaane wala, aur ye faisla jitni jaldi ho utna behtar.",
      "Peeliye me sabse zyada nuksaan gharelu nuskhon me lage waqt se hota hai — jhaad-phoonk aur \"peela paani\" jaise ilaaj me hafte nikal jaate hain, aur usi beech maamla bigadta hai. Ek LFT ka daam ₹600 hai aur report 24 ghante me aa jaati hai; us ek report par jo faisla hota hai wo intezaar se kahin sasta padta hai.",
      "Doosri wajah aajkal tezi se badh rahi hai — fatty liver. Ye ab sirf sharaab peene walon ki bimari nahi rahi; badhta wazan, sugar aur badha hua lipid isi taraf le jaate hain, aur shuruaat me koi lakshan nahi hota. Isi liye jinka sugar ya lipid pehle se kharaab hai, unke saal-bhar ke panel me LFT ko jagah milni chahiye. Dawaiyon ka lamba istemaal — dard ki goli, TB ki dawa, ya koi bhi lambi chalne wali dawa — bhi liver par asar daalta hai, aur ye baat booking ke waqt bataani chahiye.",
      "LFT me fasting zaroori nahi hai, lekin doctor ne Lipid Profile ke saath likha hai to fasting Lipid ke liye chahiye hogi — us soorat me subah ka slot le lijiye. Pathology me LFT aksar Kidney Function Test aur CBC ke saath hi karaaya jaata hai, aur teenon Basic Full Body Checkup me pehle se shaamil hain.",
    ],
  },

  {
    id: "bade-shehar-safar-gopalganj",
    h: "Chhapra, Muzaffarpur, Gorakhpur Ya Patna — Kab Jaana Zaroori Hai, Aur Report Pehle Kyun",
    p: [
      "Gopalganj se koi bhi bada sansthan paas nahi hai. Siwan kareeb 30 kilometre hai lekin wo khud ek zila mukhyalaya hai. Chhapra kareeb 85, Muzaffarpur Gandak paar kareeb 100, Gorakhpur NH-27 par kareeb 120 aur Patna kareeb 150 kilometre — chaaron alag disha me, aur chaaron ek poora din maangte hain. Ye doori asli hai, aur is page ka maksad aapko jaane se rokna nahi hai.",
      "Baat sirf itni hai ki us safar ka faayda un cheezon me hai jo sirf wahan ho sakti hain — MRI, CT scan, endoscopy jaisi imaging, kisi specialist ki OPD, ya kisi bade operation ki taiyaari. Routine pathology unme nahi aati. CBC, sugar, thyroid, liver, kidney, lipid, vitamin, dengue — ye sab sample par hote hain, aur sample Gopalganj me aapke ghar par liya ja sakta hai. Inke liye gaadi pakadna sirf ek din aur ek kiraya kharch karna hai; natija wahi rehta hai.",
      "Aur jis din jaana hi hai, us din ke liye ek baat sabse zyada kaam ki hai: report pehle se haath me le kar jaaiye. Wajah seedhi hai — doctor pehli hi baithak me report dekh kar aage badh jaata hai. Report nahi hai to wo test likh kar agli tareekh de deta hai, matlab wahi safar dobara, wahi kiraya dobara, aur beech me pandrah din. Ek din pehle ghar par sample de dena us doosre safar ko bacha leta hai.",
      "Thawe Junction se train pakadne walon ke liye subah 6 baje ka slot isi liye rakha gaya hai. Sample dijiye, naashta kijiye, gaadi pakadiye — report usi shaam ya agle din phone par aa jaayegi.",
      [
        "Is jile se bahut log kaam ke liye bahar rehte hain — Delhi, Mumbai, Punjab, Gujarat aur khadi desh. Saal me ek-do baar hi ghar aana hota hai aur usi chhutti me sab nipatana hota hai, isliye checkup hamesha aakhri number par chala jaata hai. Ghar aane ke pehle ya doosre din ka ek subah ka slot iska sabse aasan hal hai. Bahar jaane wale kaamgaron ki jaanch par is site par alag se likha gaya hai — ",
        { text: "bahar jaane se pehle kya jaanch lena chahiye", href: SIWAN_GULF },
        " — aur wo baat Gopalganj par usi tarah lagu hoti hai.",
      ],
      [
        "Seema ke us paar ka safar bhi aam hai. Us taraf yahi service chalti hai: ",
        { text: "Gorakhpur me lab test", href: LAB_GORAKHPUR },
        " aur ",
        { text: "Kushinagar me lab test", href: LAB_KUSHINAGAR },
        ".",
      ],
    ],
  },

  {
    id: "full-body-checkup-gopalganj",
    h: "Gopalganj Me Full Body Checkup Package — 45, 72 Aur 88 Parameter Wale Plan",
    p: [
      "Full body checkup ka matlab har test karana nahi hota. Matlab ye hota hai ki wo test ek saath ho jaayein jo milkar tasveer banate hain — khoon, sugar, charbi, liver aur kidney. Usse aage ka faisla report dekh kar hota hai, pehle se nahi.",
      "Teen package hain. Basic Full Body Checkup ₹999 me 45 parameter — CBC, sugar, lipid, LFT aur KFT. Advanced Full Body ₹1,999 me 72 parameter — isi me thyroid, HbA1c aur vitamin jud jaate hain. Senior Citizen Pack ₹2,999 me 88 parameter, jo 55 saal se upar walon ke liye dil, haddi aur sugar par zyada dhyan deta hai.",
      "Kis ke liye kaun sa: pehli baar checkup kara rahe hain aur koi shikayat nahi hai to Basic kaafi hai. Sugar, thyroid ya vitamin ki shikayat pehle rahi ho, ya lambe samay baad ghar aaye hain, to Advanced zyada kaam ka hai. Ghar ke bujurgon ke liye Senior Pack — aur unka sample ghar par lena hi sabse aasan hai.",
      "Poore parivaar ka checkup ek hi subah me ho sakta hai. Ek phlebotomist, ek visit, sab ka sample — aur collection phir bhi free. Chhutti par ghar aaye hain aur do hafte me sab kaam nipatana hai to yahi ek slot sabse zyada kaam ka rehta hai.",
      [
        "Package me kya hona chahiye aur \"80+ parameters\" jaise vaade me kitna dum hota hai — ",
        { text: "ye guide wahi samjhaati hai", href: GUIDE_FULL_BODY },
        ".",
      ],
      "Teenon package me 10 se 12 ghante ki fasting chahiye, isliye inhe subah ke slot me rakhwaana hi theek rehta hai.",
    ],
  },

  {
    id: "lab-test-price-gopalganj",
    h: "Gopalganj Me Lab Test Price Aur Rate List — Thyroid Test Price Se Full Body Package Tak",
    p: [
      "Daam wahi hai jo is page ke card par likha hai. Home sample collection ka koi alag charge nahi — na visiting fee, na koi hidden cost. Aap sirf test ka price dete hain, aur wahi price collection ke waqt liya jaata hai.",
      "Aam test ke price: Blood Sugar ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1,000, Vitamin B12 ₹1,200 aur Dengue (NS1, IgG, IgM) ₹1,200.",
      "Package: Basic Full Body Checkup ₹999, Advanced Full Body ₹1,999 aur Senior Citizen Pack ₹2,999. Fever Panel par daam nahi likha hai kyunki usmein kya kya jodna hai wo lakshan aur bukhar ke din par tay hota hai — call par bata diya jaata hai.",
      "Hum ye nahi kehte ki hamara daam sabse kam hai; aisa daawa koi bhi kar sakta hai aur koi bhi jaanch nahi sakta. Jo hum kehte hain wo jaancha ja sakta hai — rate upar card par likha hai, home collection uske upar kuch nahi jodta, aur confirmation call par total bata diya jaata hai. Kisi bhi lab se tulna karni ho to teen cheezein poochhiye: test ka rate, collection ka charge, aur report ka waqt.",
      "Payment sample lene ke waqt hota hai, cash ya UPI (PhonePe, Google Pay, Paytm) se. Ek se zyada logon ka test ek hi visit me ho sakta hai — ek hi phlebotomist, ek hi trip, aur collection tab bhi free. Chhapra ya Muzaffarpur jaakar test karane se jo kiraya aur din bachta hai, wo iske upar hai.",
    ],
  },

  {
    /* ⚠ THE SECTION THAT MUST NOT BECOME A SALES PITCH. RT-PCR needs a
       molecular lab; there is no such test in defaultTests() and we do not run
       it. This section exists to say that plainly and then be useful about
       what we CAN do. Same rule as the Gulf medical on Siwan's page and the
       recruitment medical on Ghazipur's — and it is also why NO RT-PCR term
       appears in this city's keywords array. Read the file header. */
    id: "rt-pcr-covid-gopalganj",
    h: "RT-PCR Test Gopalganj Me — Ye Hum Nahi Karte, Aur Kyun Nahi",
    p: [
      "Saaf baat pehle: RT-PCR test hum nahi karte. Wo ek molecular lab me hota hai jahan alag machine aur alag setup chahiye, aur is page par jo bhi test dikhte hain unme RT-PCR nahi hai. Hum uske liye aapka sample nahi lete.",
      "Aisi jaanch ke liye sarkari zila aspatal ya koi molecular testing lab hi sahi jagah hai. Safar ya visa ke liye report chahiye to us centre se pehle hi poochh lijiye ki unki report us maksad ke liye maany hai ya nahi — ye ek sawaal bahut si pareshani bacha deta hai.",
      "Hum ye baat isliye likh rahe hain kyunki log \"RT-PCR test lab Gopalganj\" search karke aise page par pahunch jaate hain jo saaf jawab nahi dete: phone karte hain, waqt lagate hain, aur aakhir me pata chalta hai ki wahan hoti hi nahi. Ek page ka pehla kaam sahi jawab dena hai, chaahe wo jawab \"nahi\" hi kyun na ho.",
      "Jo hum karte hain wo ye hai — routine pathology, ghar se sample lekar: CBC, Blood Sugar, HbA1c, Thyroid Profile, Lipid Profile, Liver aur Kidney Function Test, Vitamin D, Vitamin B12, Dengue aur Full Body Checkup ke package. Kisi lambi bimari ke baad kamzori mehsoos ho rahi ho to CBC, Vitamin D aur Vitamin B12 ka panel aksar sabse kaam ka nikalta hai — lekin wo bhi doctor ke kahe par karaaiye, apne aap se nahi.",
    ],
  },

  {
    id: "report-same-day-gopalganj",
    h: "Report Kab Milegi — Same Day Ya 24 Ghante Me WhatsApp Par PDF",
    p: [
      "Sach wahi likhenge jo hai. Zyadatar routine test — CBC, sugar, lipid, LFT, KFT, thyroid, urine routine — sample lab pahunchne ke baad 6 se 24 ghante me taiyaar ho jaate hain, aur agar sample subah jaldi diya gaya ho to report aksar usi din shaam tak aa jaati hai. Lekin hamara vaada 24 ghante ka hai, same day ka nahi — kyunki collection ka waqt, doori aur test ka type teenon isme farak daalte hain.",
      "Kuch test jaan-boojh kar dheeme hote hain. Culture — urine ya blood culture — me 48 se 72 ghante lagte hain, kyunki pehle organism ko ugana padta hai, tabhi antibiotic ki sensitivity pata chalti hai. Koi bhi lab isse jaldi ka imaandari se vaada nahi kar sakti, aur jo kare use ek baar poochh lena chahiye ki kaise.",
      "Report WhatsApp aur email dono par PDF me bhej di jaati hai. Iska sabse bada faayda safar me dikhta hai — Chhapra, Muzaffarpur, Gorakhpur ya Patna me kisi doctor ko dikhana ho to file forward kar dijiye; kagaz sambhaal kar le jaane, bheegne ya kho jaane ka jhanjhat khatam. Ghar ka aadmi bahar kaam karta hai to use bhi wahi file bhej di jaati hai aur wo wahin se salah le leta hai.",
      "Purani report bhi phone me padi rehti hai, aur doctor ke liye do report ka farak ek report se kahin zyada kaam ka hota hai. Sugar aur thyroid me to poora ilaaj isi farak par tay hota hai — isi liye report delete mat kijiye, ek folder bana kar rakh lijiye.",
      [
        "Report me har number ke saath ek normal range likhi hoti hai. Ek-do number range se thoda idhar-udhar hona apne aap me kuch nahi kehta — matlab tabhi banta hai jab use lakshan aur baaki numbers ke saath padha jaaye. Isi liye report ka faisla doctor karta hai, internet nahi. Kya dekhna chahiye, wo ",
        { text: "report kaise padhein", href: GUIDE_REPORT },
        " me saada bhasha me likha hai.",
      ],
    ],
  },

  {
    id: "fasting-taiyari-gopalganj",
    h: "Sample Dene Se Pehle Kya Karein, Kya Na Karein — Fasting Ke Niyam",
    p: [
      "Fasting ka matlab 10 se 12 ghante kuch na khana, aur is beech saada paani peete rehna. Chai, doodh, biscuit, toffee, paan ya gutkha — inme se kuch bhi report badal deta hai; ek cup chai kaafi hai sugar aur lipid ka number hila dene ke liye. Raat ka khaana 9 baje tak kar lijiye aur subah 7-8 baje ka slot lijiye; itna hi kaafi hai.",
      "Fasting kin me chahiye: Fasting Blood Sugar, Lipid Profile aur teenon Full Body package me. Kin me nahi: CBC, Thyroid Profile, HbA1c, Blood Group, Vitamin D, Vitamin B12 aur Dengue — ye din me kabhi bhi ho sakte hain.",
      "Dawa apne aap se band mat kijiye. Blood pressure, thyroid ya dil ki dawa niyam se lete hain to usi tarah lijiye, aur booking ke waqt bata dijiye — kis dawa se kaunsa number badalta hai, ye lab ko pata hona chahiye. Sugar ki dawa ya insulin par hain to fasting sample ka waqt doctor se ek baar poochh lena behtar hai.",
      "Sample se pehle raat bhar ki achhi neend aur din bhar paani — ye do cheezein sample lene ka kaam aasan kar deti hain; nas na milne ki dikkat aksar paani ki kami se hoti hai. Bahut mehnat wala kaam ya vyayam sample se theek pehle mat kijiye, aur sharaab ka test se ek din pehle parhez rakhiye — wo liver aur lipid dono ke number badal deta hai.",
      [
        "Agar usi din Thawe se train pakadni hai ya Chhapra-Muzaffarpur nikalna hai, to slot subah 6 baje ka rakhwaaiye. Fasting aur taiyaari par poori list ",
        { text: "yahan hai", href: GUIDE_FASTING },
        ".",
      ],
    ],
  },

  {
    /* Devanagari section. Is jile ka bahut bada hissa Hindi me hi search karta
       hai, aur poora page Hinglish me hone ke kaaran Devanagari query se choot
       jaata tha. Ye anuvaad nahi hai — yahan wahi baatein hain jo upar hain,
       chhoti aur seedhi shakl me, taaki ye duplicate content na bane. */
    id: "gopalganj-lab-test-hindi",
    h: "गोपालगंज में लैब टेस्ट — घर से सैंपल कलेक्शन की पूरी जानकारी (हिंदी में)",
    p: [
      "गोपालगंज ज़िले (बिहार) में खून और पेशाब की सभी सामान्य जाँच घर बैठे हो जाती हैं। कहीं जाना नहीं पड़ता — प्रशिक्षित फ्लेबोटोमिस्ट पहचान पत्र के साथ आपके घर आता है, आपके सामने सैंपल लेता है, और रिपोर्ट 24 घंटे के अंदर व्हाट्सएप तथा ईमेल पर पीडीएफ़ में आ जाती है। होम सैंपल कलेक्शन पूरी तरह मुफ़्त है; आप सिर्फ़ जाँच का वही दाम देते हैं जो कार्ड पर लिखा है।",
      "यहाँ से कोई बड़ा शहर पास नहीं है — सीवान लगभग 30 किलोमीटर, छपरा लगभग 85, मुज़फ़्फ़रपुर लगभग 100, गोरखपुर लगभग 120 और पटना लगभग 150 किलोमीटर। CBC, शुगर, थायरॉइड, लिवर, किडनी, लिपिड, विटामिन और डेंगू — ये सब सैंपल पर होते हैं और घर पर हो सकते हैं। बड़े शहर तब जाइए जब MRI, CT स्कैन या किसी विशेषज्ञ को दिखाना हो — और उस दिन रिपोर्ट पहले से हाथ में ले जाइए, वरना डॉक्टर जाँच लिखकर अगली तारीख़ दे देता है और वही सफ़र दोबारा करना पड़ता है।",
      "शहर में स्टेशन रोड, बस स्टैंड के आसपास, सदर अस्पताल की तरफ़ और मुख्य बाज़ार के मोहल्ले, तथा ज़िले में थावे, हथुआ, मीरगंज, कुचायकोट, बरौली, सिधवलिया, बैकुंठपुर, माँझा, उचकागाँव, भोरे, कटेया, विजयीपुर, फुलवरिया और पंचदेवरी के आसपास सैंपल लिया जाता है। अपने गाँव का नाम सूची में न दिखे तो एक बार फ़ोन कर लीजिए, और पता लिखते समय कोई एक निशानी तथा अपने प्रखंड का नाम ज़रूर डालिए।",
      "गंडक का पानी चढ़ने पर एक बात साफ़ रखिए: जब लिंक रोड कटी हो और पानी खड़ा हो, तब हमारी गाड़ी उस टोले तक नहीं पहुँच पाती — हम फ़ोन पर साफ़ बता देते हैं। इसलिए पानी चढ़ने से पहले के पंद्रह दिन और पानी उतरने के बाद का महीना सबसे काम का है। पानी उतरने के बाद आँख या पेशाब में पीलापन दिखे तो लिवर फ़ंक्शन टेस्ट, 5-7 दिन से ज़्यादा बुख़ार चले तो टाइफ़ाइड की जाँच, और उल्टी-दस्त के बाद कमज़ोरी रहे तो CBC के साथ किडनी फ़ंक्शन टेस्ट कराइए।",
      "कौन सी जाँच कब — बुख़ार के पहले 1 से 5 दिन में डेंगू NS1, पाँचवें दिन के बाद डेंगू IgM, और टाइफ़ाइड की विडाल जाँच के लिए कम से कम 5 से 7 दिन का बुख़ार चाहिए। हर बुख़ार में CBC साथ में ज़रूर कराएँ। शुगर, लिपिड और सभी फुल बॉडी पैकेज में 10 से 12 घंटे खाली पेट रहना पड़ता है; उस दौरान सादा पानी पीते रहिए।",
      "गर्भवती महिला की जाँच — ब्लड ग्रुप, CBC, शुगर, TSH और यूरिन रूटीन — घर पर ही हो जाती है, और पैनल डॉक्टर की पर्ची से तय होता है। खून की कमी यहाँ बहुत आम है, इसलिए हीमोग्लोबिन पर ख़ास ध्यान दीजिए और हर तिमाही में कम से कम एक बार CBC दोहराइए।",
      "एक बात साफ़ है: RT-PCR टेस्ट हम नहीं करते। वह मॉलिक्युलर लैब में होता है और इस पेज पर उपलब्ध जाँचों में नहीं है — उसके लिए सरकारी ज़िला अस्पताल या मॉलिक्युलर लैब ही सही जगह है।",
      "एक चेतावनी: बच्चे को तेज़ बुख़ार के साथ झटके आएँ, बेहोशी हो, गर्दन अकड़ जाए या वह सुस्त पड़ा रहे — तो जाँच बुक मत कीजिए, सीधे नज़दीकी अस्पताल ले जाइए। ऐसे में एक-एक घंटा मायने रखता है।",
      "बुकिंग के लिए ऊपर दिया फ़ॉर्म भर दीजिए या फ़ोन कर दीजिए। लगभग 30 मिनट में कॉल आकर समय, पता, खाली पेट रहना है या नहीं, और कुल दाम — चारों तय हो जाते हैं। भुगतान सैंपल लेते समय नक़द या यूपीआई से होता है।",
    ],
  },
];

/**
 * Gopalganj's FAQs.
 *
 * Every one is this district's own question. Deliberately NOT copied from
 * defaultFaqs(): the generated set answers "kya aap mere ilaake me aate hain"
 * and "kitna kharcha" in a city-neutral way, and this district's versions have
 * to carry the four-direction travel question, the Gandak, the antenatal
 * panel, and the two questions this page exists to answer honestly — RT-PCR,
 * and "which is the best / cheapest lab".
 *
 * ⚠ The "affordable" and "best diagnostic centre" questions below are the ONLY
 * place those words appear on this page, and both answers refuse the boast and
 * give checkable facts instead. Do not move those words into the body copy.
 *
 * The rate line in the first answer must match the price section above AND
 * defaultTests() in src/data/lab/defaults.js. Those three are the only places
 * a price appears for this city.
 */
export const gopalganjFaqs = [
  {
    q: "How much does a lab test cost in Gopalganj, and is home sample collection free?",
    a: "You pay only the price printed on the test card — home sample collection in Gopalganj is completely free, with no visiting charge and no hidden fee. Blood Sugar is ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Lipid Profile ₹800, and the Basic Full Body Checkup starts at ₹999. The total is confirmed on the call before the visit, and payment is taken at the time of collection, by cash or UPI.",
  },
  {
    // "affordable lab tests in gopalganj" — the intent, answered without a
    // comparative claim. See the warning above this array.
    q: "Are lab tests in Gopalganj affordable, and how do I know I am not being overcharged?",
    a: "We will not tell you our rates are the lowest, because any lab can say that and no one can check it. What you can check is this: every rate is printed on the card on this page, home sample collection adds nothing to it, and the full amount is told to you on the confirmation call before anyone comes to your door. If you are comparing labs, ask all of them the same three questions — what does the test itself cost, what does collection cost, and when does the report come. A lab that answers all three plainly is the one to book.",
  },
  {
    // "best diagnostic center in gopalganj" — same treatment.
    q: "Which is the best diagnostic centre in Gopalganj?",
    a: "We are not going to call ourselves the best, and we would be careful with any lab that does. What is worth judging a lab on is checkable: is the price told to you before the visit, does the person collecting the sample carry an ID card, is the sample drawn in front of you, and is a clear report time committed to. On this page the answers are yes, yes, yes, and 24 hours for routine tests. There is no walk-in counter of ours in Gopalganj — this is a home collection service across the district, with slots from 6 AM.",
  },
  {
    q: "Do you do the RT-PCR test in Gopalganj?",
    a: "No. RT-PCR requires a molecular laboratory, and it is not among the tests available on this page — we do not collect samples for it. For that, a government district hospital or a molecular testing laboratory is the right place, and if you need the report for travel or a visa, confirm with that centre first that their report is accepted for your purpose. What we do run is routine pathology collected from your home: CBC, blood sugar, HbA1c, thyroid, lipid, liver and kidney function, vitamins, dengue and the full body checkup packages.",
  },
  {
    q: "Will I get a same day lab test report in Gopalganj?",
    a: "Often, but the commitment is 24 hours. Most routine tests — CBC, sugar, lipid, LFT, KFT, thyroid, urine routine — are ready 6 to 24 hours after the sample reaches the lab, so a sample given early in the morning is usually reported the same evening. What we promise is a report within 24 hours, sent as a PDF on both WhatsApp and email, because collection time, distance and the type of test all affect it. Cultures are the exception and take 48 to 72 hours, since the organism has to be grown before sensitivity can be tested.",
  },
  {
    q: "Which areas of Gopalganj district do you cover?",
    a: "In the town: Station Road, the area around the bus stand, towards Sadar Hospital, the main market mohallas and the Thawe road side. In the district: Thawe, Hathua, Mirganj, Kuchaikote, Barauli, Sidhwalia, Baikunthpur, Manjha, Uchkagaon, Bhore, Kateya, Vijayipur, Phulwaria, Panchdeori and the villages around them. If your village is not named here, please call anyway — if it is covered, the slot is booked on the same call. Do include your block and panchayat name and one landmark in the address, because a landmark is far more useful here than a house number.",
  },
  {
    q: "Can you collect a sample from my village when the Gandak is in flood?",
    a: "Not always, and we would rather say so than take the booking. When water is standing and the link road is cut, our collection round cannot reach a diara tola — in that case we tell you plainly on the call instead of letting you wait. That is why the fortnight before the water rises and the month after it recedes are the two windows worth using: get the pending tests of elderly members, anyone on sugar or BP medication, and expectant mothers done in the first, and watch for jaundice and typhoid in the second.",
  },
  {
    q: "Can tests for pregnancy be done at home in Gopalganj?",
    a: "Yes — blood group and Rh factor, CBC for haemoglobin, blood sugar, TSH for thyroid and urine routine are all done on a sample collected at your home, which matters in households where someone would otherwise have to accompany the mother to a town lab for half a day. The panel itself is decided by your doctor's prescription, not by this page, so send a photo of it at the time of booking and exactly what is written will be run. Haemoglobin deserves particular attention here, and a CBC should be repeated at least once each trimester. If there is any bleeding, severe abdominal pain, persistent vomiting or fever, see a doctor first rather than booking a test.",
  },
  {
    q: "Do I have to travel to Chhapra, Muzaffarpur, Gorakhpur or Patna for a blood test?",
    a: "Not for routine pathology. CBC, sugar, thyroid, liver, kidney, lipid, vitamin and dengue tests are all run on a sample, and that sample can be drawn at your home in Gopalganj. Those cities are roughly 85, 100, 120 and 150 kilometres away in four different directions, and each of them costs a full day. They are necessary for imaging such as MRI, CT or endoscopy, or for a specialist to be seen in person — and on that day, go with the report already in hand, or the doctor will prescribe tests and give you another date.",
    links: [{ href: LAB_GORAKHPUR, label: "Lab test in Gorakhpur" }],
  },
  {
    q: "Which tests require fasting, and which do not?",
    a: "Fasting Blood Sugar, Lipid Profile and all three Full Body Checkup packages need 10 to 12 hours without food; plain water is allowed throughout. Tea, milk, a biscuit or a toffee are not — a single cup of tea is enough to change the result. CBC, Thyroid Profile, HbA1c, blood group, Vitamin D, Vitamin B12 and Dengue need no fasting at all and can be done at any time of day. This is why home visit slots start at 6 AM: if you are catching a train from Thawe that morning, give the sample, have your breakfast and go.",
  },
  {
    q: "How do I book a blood test online in Gopalganj, and what are the payment options?",
    a: "Choose your test on this page and fill in the form, or simply call us. If you have a doctor's prescription, keep a photo of it handy so that exactly the panel written on it is run. A confirmation call comes within about 30 minutes and settles four things — the slot, the full address with a landmark, whether fasting is needed, and the total amount. The phlebotomist carries an ID card, and you are welcome to check it before giving the sample. Payment is taken at that time, by cash or UPI (PhonePe, Google Pay, Paytm). Several people in the same household can be tested in a single visit at no extra collection charge.",
    links: [{ href: GUIDE_LAB_TEST, label: "Which test, and when — a guide" }],
  },
];
