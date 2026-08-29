/**
 * /lab-test/siwan — the district's long-form copy and its FAQs.
 *
 * ── THE FIRST BIHAR DISTRICT ON THIS SITE, AND IT CHANGES THE ARGUMENT ───
 * Every other city here is Uttar Pradesh, and every one of them runs on the
 * same referral chain: the district has clinics, the big diagnostics are in
 * Gorakhpur or Varanasi, so the page argues "skip the journey".
 *
 * Siwan does not sit in that chain. It is a Bihar district on the UP border,
 * and its people are pulled in THREE directions at once — Chhapra (~60 km) for
 * the divisional hospital, Patna (~135 km) for PMCH and IGIMS, and Gorakhpur
 * (~110 km) across the border, which is nearer than their own state capital
 * and is where a lot of this district's families already go. A page that
 * copied Deoria's "Gorakhpur mat jaaiye" line would be answering a question
 * this reader is not asking. So the travel section here names all three and
 * says what each is actually for.
 *
 * ── WHAT IS GENUINELY LOCAL HERE ─────────────────────────────────────────
 * Four things, and each earns a section rather than a sentence:
 *
 *   1. GULF MIGRATION. Siwan is one of the highest out-migration districts in
 *      the country — Saudi, UAE, Qatar, and Delhi/Mumbai/Punjab. That produces
 *      two readers nobody else's page has: the man about to leave, who needs
 *      to know where his sugar and liver numbers stand BEFORE the official
 *      medical, and the man home for two weeks after three years away, who
 *      will not get another chance for a checkup.
 *
 *      ⚠ AND IT IS THE EASIEST PLACE ON THIS SITE TO WRITE A LIE. The Gulf
 *      pre-departure medical (GAMCA / Wafid) can ONLY be done at a
 *      Wafid-approved centre. We are not one, and this page says so in plain
 *      words rather than going quiet about it. A page that let a man think his
 *      visa medical was handled here would cost him his flight. The keyword is
 *      worth a lot; it is not worth that.
 *
 *   2. KALA-AZAR. Bihar is the country's visceral leishmaniasis belt and this
 *      district has reported cases. The honest thing a lab page can do about a
 *      fever running past two weeks with a swollen abdomen is to send the
 *      reader to a government hospital — where, under the national programme,
 *      diagnosis and treatment are free. That section must never be softened
 *      into a booking prompt. Kushinagar's page does the same with AES.
 *
 *      We do NOT offer an rK39 test and this page never implies we do. CBC is
 *      described as what it is: a test that can show a clue, not a diagnosis.
 *
 *   3. THE GHAGHARA AND THE DAHA. Darauli, Guthani, Andar and Siswan take
 *      flood water most years, and the weeks after it are typhoid and jaundice
 *      weather — the season where the DAY a test is taken decides whether it
 *      was worth taking.
 *
 *   4. SIWAN JUNCTION. This is a rail town before it is a road town. The
 *      Chhapra–Gorakhpur line is how people here actually reach a specialist,
 *      and a train at 5 AM is the reason a 6 AM collection slot matters.
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
 * NOT CLAIMED however well it would rank: "24 hour lab in Siwan". Collection
 * runs 6 AM–9 PM, so the page says "report 24 ghante me" — true — and never
 * "24 ghante khula lab", which is not.
 *
 * Distances are hedged ("kareeb") because they are road distances that vary by
 * route, not measured facts.
 *
 * ── HOW THE KEYWORDS ARE PLACED ──────────────────────────────────────────
 * One primary term ("lab test in Siwan" / "Siwan me lab test"), carried by the
 * URL, the h1, the title and the lead. Everything else gets a SEPARATE
 * heading, because a heading ranks and a keyword buried in a paragraph mostly
 * does not: pathology lab / diagnostic centre, dengue-typhoid-malaria, CBC,
 * sugar-HbA1c-thyroid, full body checkup, price / rate list. Each appears in
 * ONE h2 and then reads as ordinary prose. Repeating "lab test in Siwan" in
 * every heading is the stuffing Google demotes, not what it rewards.
 *
 * ── INTERNAL LINKS ───────────────────────────────────────────────────────
 * Paragraph parts shaped { text, href } render as real in-prose links (see
 * LabContent). Every href below must be a route that renders:
 *   /lab-test/{deoria,salempur,gorakhpur,varanasi}   (src/data/lab/cities.js)
 *   /blogs/lab-test/{deoria,varanasi}                (src/data/blogs/)
 *   /blogs/full-body-checkup/varanasi
 */

/* Link targets. Constants so a route rename is a one-line fix here instead of
   a hunt through the prose — and so a typo shows up as `undefined` in the href
   rather than as a silent 404 in production. */
const LAB_DEORIA = "/lab-test/deoria";
const LAB_SALEMPUR = "/lab-test/salempur";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_VARANASI = "/lab-test/varanasi";
const GUIDE_LAB_TEST = "/blogs/lab-test/varanasi";
const GUIDE_LAB_TEST_DEORIA = "/blogs/lab-test/deoria";
const GUIDE_FULL_BODY = "/blogs/full-body-checkup/varanasi";

export const siwanContent = [
  {
    id: "lab-test-in-siwan",
    h: "Siwan Me Lab Test — Ghar Baithe Blood Test Booking Aur Free Home Sample Collection",
    p: [
      "Siwan me test karana mushkil nahi hai; mushkil ye hai ki har chhoti jaanch ke liye din nikal jaata hai. Zila mukhyalaya par Sadar Hospital aur bahut se private clinic hain, lekin bade diagnostic setup zyadatar Chhapra aur Patna me hain — Chhapra kareeb 60 kilometre, Patna kareeb 135 kilometre. Bahut se parivaar Gorakhpur bhi jaate hain, jo kareeb 110 kilometre par apne hi rajya ki rajdhani se nazdeek padta hai. Ek CBC ya thyroid ke liye bhi subah train pakadna, khaali pet safar karna, sample dena, aur report ke liye phir ek din nikalna — ek test, do trip, poora din.",
      "Home sample collection is poore chakkar ko khatam kar deta hai. Aap Siwan me apne ghar ka pata dete hain, subah ka slot chunte hain, aur trained phlebotomist ID card ke saath aapke darwaze par aata hai. Sample wahin liya jaata hai aur report 24 ghante me WhatsApp aur email par PDF me aa jaati hai — na train ka kiraya, na khaali pet ka safar, na report lene ke liye doosra din.",
      "Yahan routine pathology ke saare test aur checkup package book hote hain — CBC, Thyroid Profile, Blood Sugar, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test, Vitamin D, Vitamin B12, Dengue aur Full Body Checkup. Doctor ne parcha likh diya hai to usi panel ke hisaab se booking ho jaati hai; koi test is page par na dikhe to prescription ke saath ek call kar lijiye.",
      [
        "Kaun sa test kab karana chahiye, bukhar me kis din test matlab rakhta hai, aur report ke numbers me kya dekhna chahiye — us par alag se guide hai: ",
        { text: "kaun sa test kab karayein", href: GUIDE_LAB_TEST },
        ".",
      ],
    ],
  },

  {
    id: "pathology-lab-diagnostic-centre-siwan",
    h: "Siwan Me Pathology Lab Ya Diagnostic Centre Dhoondh Rahe Hain?",
    p: [
      "Log aam taur par \"Siwan me pathology lab\", \"diagnostic centre near me\" ya \"blood test near me\" isliye search karte hain kyunki unhe lagta hai kahin jaana hi padega. Routine pathology me ab ye zaroori nahi raha. Khoon aur peshaab ke jitne bhi aam test hain, wo sample par hote hain — aur sample aapke ghar par liya ja sakta hai.",
      "Iska matlab ye nahi ki har cheez ghar par ho jaayegi. X-ray, ultrasound, ECG, CT scan aur MRI machine par hote hain, aur unke liye centre par hi jaana padega. Ye page unke liye nahi hai; ye un test ke liye hai jinke liye aaj bhi log line me lagte hain jabki lagne ki zaroorat nahi.",
      "Hum Siwan me koi walk-in counter hone ka daawa nahi karte. Jo hai wo ye hai: aapke ghar par sample lene wali service, poore jile me, subah 6 baje se shaam tak ke slot me — aur home collection ka koi alag charge nahi.",
    ],
  },

  {
    id: "home-sample-collection-siwan",
    h: "Siwan Jile Me Home Sample Collection — Sadar, Maharajganj, Mairwa, Barharia, Andar Aur Darauli",
    p: [
      "Sample collection Siwan Sadar tak simit nahi hai. Jile ke bade kasbon aur unse lage gaon me visit hoti hai — Maharajganj, Mairwa, Barharia, Andar, Basantpur, Darauli, Guthani, Raghunathpur, Pachrukhi, Hasanpura, Goriakothi aur Jiradei ke aas-paas ka ilaaka.",
      "Aapke gaon ka naam is list me na ho to bhi ek baar call kar lijiye. Ye zila blocks me faila hua hai aur bahut se tole apne block headquarter ke naam se hi jaane jaate hain — cover hone par usi call par slot book ho jaata hai.",
      "Pata likhte waqt landmark zaroor daaliye. Yahan house number se kaam nahi chalta: school, mandir, masjid, petrol pump, bazaar ya panchayat bhavan — koi ek nishani likh dijiye aur apne block ka naam saath me. Ghar par koi bujurg hai ya bistar par hai, ye bhi booking ke waqt bata dijiye, taaki phlebotomist us hisaab se taiyaar aaye.",
      [
        "Jile ke paschim me UP ki seema shuru ho jaati hai. Bhatni aur Salempur ki taraf ke reader ke liye ",
        { text: "Salempur ka apna page", href: LAB_SALEMPUR },
        " hai, aur zila mukhyalaya ke liye ",
        { text: "Deoria me lab test", href: LAB_DEORIA },
        " — dono par yahi service usi tarah chalti hai.",
      ],
    ],
  },

  {
    /* ⚠ THE SECTION THAT MUST NOT DRIFT INTO A SALES PITCH.
       The Gulf medical is a licensed process at approved centres. This section
       exists to say clearly that we are not one — and then to be useful about
       the part we CAN do, which is the routine bloodwork a man wants to see
       before he pays for the official medical. Read the file header before
       editing a word of it. */
    id: "gulf-jaane-wale-siwan",
    h: "Gulf Ya Bahar Jaane Se Pehle — Kaunsi Jaanch Kaam Ki Hai, Aur Kaunsi Yahan Nahi Hoti",
    p: [
      "Siwan ke har mohalle me koi na koi ghar aisa hai jahan se koi Saudi, Dubai, Qatar, Delhi, Mumbai ya Punjab me kaam karta hai. Isliye ye sawaal yahan sabse zyada poocha jaata hai: bahar jaane se pehle kya jaanch karani chahiye?",
      "Pehle wo baat jo saaf honi chahiye. Gulf ka jo official pre-departure medical hota hai — GAMCA / Wafid wala — wo sirf approved centre par hi ho sakta hai, aur uski report seedha unke system me jaati hai. Wo hum nahi karte, aur na hi uska koi vikalp de sakte hain. Uske liye aapko approved centre par hi jaana hoga; kisi aur ki report wahan chalti hi nahi.",
      "Jo hum kar sakte hain wo ye hai: official medical se pehle apni asli haalat dekh lena. Bahut se log medical me fail hone ke baad jaan paate hain ki sugar badha hua tha ya liver ke numbers kharab the — aur tab tak agent ka paisa, medical ki fees aur kabhi kabhi ticket, sab ja chuka hota hai. Blood Sugar, HbA1c, Liver Function Test aur Lipid Profile — ye chaar aapko pehle hi bata deti hain ki aap kahan khade hain. Kuch bhi galat nikla to sudhaarne ka waqt bacha rehta hai.",
      "Doosra reader wo hai jo teen saal baad do hafte ke liye ghar aaya hai. Us do hafte me shaadi, rishtedaari aur zameen ke kaam ke beech checkup sabse aakhir me aata hai, aur aksar reh jaata hai. Ghar par sample dena isi liye kaam ka hai — subah ka ek slot, dus minute, aur report phone par. Full Body Checkup ke package isi ek maukey ke liye theek baithte hain.",
      [
        "Package me kya hona chahiye aur \"80+ parameters\" ka kya matlab hota hai, ye ",
        { text: "full body checkup wali guide", href: GUIDE_FULL_BODY },
        " me detail me likha hai.",
      ],
    ],
  },

  {
    /* ⚠ SAFETY SECTION — the same role AES plays on the Kushinagar page.
       Its job is to STOP a booking and send the reader to a hospital. It must
       never be rewritten to end in a call to action, and it must not name a
       test we do not sell. */
    id: "lamba-bukhar-kala-azar-siwan",
    h: "Bukhar Do Hafte Se Zyada Chal Raha Hai — Ye Lab Se Pehle Aspatal Ka Maamla Hai",
    p: [
      "Ek baat jo Bihar ke is hisse me sabse zyada maayne rakhti hai. Bukhar agar do hafte se zyada chal raha ho, saath me pet — khaas kar baayin taraf — phoola hua lage, wazan girta ja raha ho, khoon ki kami dikhe aur rang kaala padta ja raha ho, to ise saada bukhar maan kar test book mat kijiye. Ye kala-azar (visceral leishmaniasis) ke lakshan ho sakte hain, aur Bihar ise sabse zyada jhelne wale rajyon me hai.",
      "Aise me seedha sarkari aspatal ya PHC jaaiye. Rashtriya karyakram ke tahat kala-azar ki jaanch aur poora ilaaj sarkari kendron par muft hota hai — private me paisa kharch karne ki zaroorat nahi, aur wahi jagah hai jahan is bimari ki sahi jaanch hoti hai. Der karna hi is bimari me sabse bada khatra hai.",
      "Hum kala-azar ki confirm karne wali jaanch nahi karte, aur ye page aisa koi daawa nahi karta. CBC me khoon ki kami aur cell count ka girna ek ishaara zaroor de sakta hai, lekin ishaara nidaan nahi hota. Lambe bukhar me doctor ko dikhana pehla kadam hai, test doosra.",
      "Yahi baat bachchon ke tez bukhar par bhi lagu hoti hai. Jhatke aayein, behoshi ho, gardan akad jaaye, lagatar ulti ho ya bachcha sust pada rahe — to ghar par sample ka intezaar bilkul mat kijiye, najdeeki aspatal le jaaiye. Ek ek ghanta maayne rakhta hai.",
    ],
  },

  {
    id: "bukhar-dengue-typhoid-siwan",
    h: "Siwan Me Dengue, Typhoid Aur Malaria Test — Bukhar Ke Kis Din Kaunsa Test",
    p: [
      "Barsaat ke baad yahan bukhar ka mausam shuru hota hai, aur sabse aam galti ye hoti hai ki test galat din par kara liya jaata hai. Report \"negative\" aa jaati hai, log nishchint ho jaate hain, aur bimari chalti rehti hai.",
      "Seedha niyam ye hai. Dengue NS1 bukhar ke pehle 1 se 5 din me sahi jawab deta hai; paanchve din ke baad NS1 ki jagah IgM matlab rakhta hai. Typhoid ke Widal test ke liye kam se kam 5 se 7 din ka bukhar chahiye — teesre din ka Widal aksar bekaar jaata hai. Malaria ki jaanch bukhar chadhte waqt sabse achhi hoti hai.",
      "Har bukhar me CBC saath me karwa lijiye. Platelet ka girna, white cell ka pattern aur haemoglobin — teenon milkar doctor ko wo tasveer dete hain jo akela ek test nahi de paata. Fever Panel me malaria, typhoid aur dengue ek saath aa jaate hain; uska price is page ke rate card par \"call for price\" isliye hai kyunki panel me kya jodna hai wo lakshan par tay hota hai.",
      [
        "Bukhar ke kis din kaunsa test — is par din-war samjhaane wali ",
        { text: "guide yahan hai", href: GUIDE_LAB_TEST },
        ".",
      ],
    ],
  },

  {
    id: "baadh-jaundice-typhoid-siwan",
    h: "Ghaghara Aur Daha Ke Paani Ke Baad — Jaundice, Typhoid Aur LFT Ki Jaanch",
    p: [
      "Darauli, Guthani, Andar aur Siswan ki taraf ka ilaaka Ghaghara (Saryu) aur Daha nadi ke paani se har saal kuch na kuch jhelta hai. Paani utarne ke baad ka mahina sabse nazuk hota hai — kuan aur handpump ka paani milawat le leta hai, aur wahin se typhoid aur jaundice shuru hote hain.",
      "Is mausam me teen cheezein dhyan me rakhiye. Aankhon ya peshaab me peelapan dikhe to Liver Function Test — bilirubin, SGOT, SGPT — pehla test hai. Lagatar bukhar 5-7 din se zyada chale to typhoid ki jaanch matlab rakhti hai. Aur ulti-dast ke baad kamzori bani rahe to CBC aur Kidney Function Test se pata chalta hai ki paani ki kami ne kitna asar dala.",
      "Jaundice me sabse zyada nuksaan gharelu nuskhon me lage waqt se hota hai. Peelapan dikhte hi LFT karwa lena isliye sahi hai ki number bata dete hain ki maamla halka hai ya doctor ke paas jaane wala — aur ye faisla jitni jaldi ho, utna behtar.",
      "Paani utarne ke baad piya jaane wala paani ubaal kar peene ki salah har baar dohrayi jaati hai, aur har baar isliye kyunki wahi ek aadat is poore mausam ke aadhe maamle rok deti hai.",
    ],
  },

  {
    id: "chhapra-patna-gorakhpur-travel-siwan",
    h: "Chhapra, Patna Ya Gorakhpur — Kab Jaana Zaroori Hai Aur Kab Nahi",
    p: [
      "Siwan ka reader teen taraf khincha jaata hai, aur teenon ke apne kaam hain. Chhapra kareeb 60 kilometre par mandal ka aspatal hai. Patna kareeb 135 kilometre par PMCH, IGIMS jaise bade sansthan hain. Aur Gorakhpur kareeb 110 kilometre par — apni rajdhani se nazdeek — jahan bahut se parivaar pehle se dikhate aaye hain.",
      "Routine pathology ke liye in teenon me se kahin jaane ki zaroorat nahi hai. CBC, sugar, thyroid, liver, kidney, lipid, vitamin, dengue — ye sab sample par hote hain, aur sample Siwan me aapke ghar par liya ja sakta hai. Safar tab zaroori hai jab MRI, CT scan, endoscopy jaisi imaging chahiye ya kisi specialist ki OPD me dikhana ho.",
      "Aur agar safar zaroori hai, to ek cheez us safar ko aadha kar deti hai: report pehle se haath me lekar jaana. Doctor pehli hi baithak me dekh kar aage badh jaata hai, warna wo aapko test likh kar wapas bhejta hai aur agli tareekh de deta hai — matlab wahi safar dobara. Siwan Junction se Chhapra aur Gorakhpur, dono taraf subah ki gaadiyan hain; ek din pehle ghar par sample de dena isi wajah se sabse kaam ka intezaam hai.",
      [
        "Gorakhpur ki taraf jaa rahe hain to wahan bhi yahi service chalti hai — ",
        { text: "Gorakhpur me lab test", href: LAB_GORAKHPUR },
        ". Varanasi ki taraf ka kaam ho to ",
        { text: "Varanasi me lab test", href: LAB_VARANASI },
        ".",
      ],
    ],
  },

  {
    id: "anaemia-women-children-siwan",
    h: "Siwan Me CBC Test Aur Khoon Ki Kami — Sabse Zyada Chhoot Jaane Wali Jaanch",
    p: [
      "Khoon ki kami is ilaake me itni aam hai ki ise bimari maana hi nahi jaata. Thakan, chakkar, saans phoolna, chidchidapan aur padhai me man na lagna — inhe kamzori keh kar chhod diya jaata hai, jabki inke peeche aksar haemoglobin ka kam hona hota hai.",
      "CBC (Complete Blood Count) isi ka jawab hai. Ismein haemoglobin ke saath red cell ka size aur count bhi aata hai, jisse pata chalta hai ki kami lohe (iron) ki hai ya kisi aur wajah se. Sirf haemoglobin dekh lena aadha jawab hai; ilaaj poore jawab par tay hota hai.",
      "Kin par sabse pehle dhyan dena chahiye: kishoriyan aur mahilaen, garbhavastha me, doodh pilane wali maayein, aur wo bachche jo baar baar bimaar padte hain ya kad me peeche reh jaate hain. Iron ki dawa shuru karne se pehle ek CBC karwa lena isliye theek hai ki tab pata rehta hai ki dawa kaam kar rahi hai ya nahi — dobara test se number khud bata dete hain.",
      "CBC me fasting nahi chahiye, aur ye is page ke sabse sasta test me se ek hai. Ghar par sample dene ka faayda yahan sabse zyada hai, kyunki jis mahila ke paas aadha din nikalne ka waqt nahi hota, wahi sabse zyada is jaanch se chhoot jaati hai.",
    ],
  },

  {
    id: "diabetes-thyroid-screening-siwan",
    h: "Siwan Me Sugar Test, HbA1c Aur Thyroid Test (TSH) — Kis Umar Me Kya Karana Chahiye",
    p: [
      "Sugar aur thyroid dono chupke se badhte hain. Jab tak lakshan dikhte hain — bahut pyaas, baar baar peshaab, wazan ka girna ya badhna, thakan, baal jhadna — tab tak kaafi waqt nikal chuka hota hai. Isi liye inhe lakshan par nahi, umar aur ghar ke itihaas par jaancha jaata hai.",
      "Aam salah ye hai: 30 ke baad saal me ek baar Fasting Blood Sugar. Ghar me kisi ko diabetes hai, wazan zyada hai, ya pehle sugar border par nikla tha — to sugar ke saath HbA1c bhi, jo teen mahine ka ausat batata hai aur ek din ke khaane-peene se nahi badalta. Mahilaon me thyroid zyada aam hai, isliye 30 ke baad TSH ek baar zaroor.",
      "Jo pehle se dawa par hain, unke liye asli baat follow-up hai. Bahar kaam karne wale bahut se log dawa Delhi, Mumbai ya Gulf me shuru karte hain aur ghar aakar wahi purani dose chalate rehte hain, bina dobara jaanche. HbA1c har teen mahine aur TSH doctor ke kahe anusar — yahi wo jaanch hai jo sabse zyada chhoot jaati hai, aur sabse saste me ho jaati hai.",
      "Fasting wale test ke liye subah 6 baje se slot rakhe gaye hain, taaki sample dekar aap turant naashta kar sakein. HbA1c aur TSH me fasting nahi chahiye — wo din me kabhi bhi ho sakte hain.",
    ],
  },

  {
    id: "full-body-checkup-siwan",
    h: "Siwan Me Full Body Checkup Package — 45, 72 Aur 88 Parameter Wale Plan",
    p: [
      "Full body checkup ka matlab har test karana nahi hota. Matlab ye hota hai ki wo test ek saath ho jaayein jo milkar tasveer banate hain — khoon, sugar, charbi, liver aur kidney. Usse aage ka faisla report dekh kar hota hai, pehle se nahi.",
      "Teen package hain. Basic Full Body Checkup ₹999 me 45 parameter — CBC, sugar, lipid, LFT aur KFT. Advanced Full Body ₹1,999 me 72 parameter — isi me thyroid, HbA1c aur vitamin jud jaate hain. Senior Citizen Pack ₹2,999 me 88 parameter, jo 55 saal se upar walon ke liye dil, haddi aur sugar par zyada dhyan deta hai.",
      "Kis ke liye kaun sa: pehli baar checkup kara rahe hain aur koi shikayat nahi hai to Basic kaafi hai. Sugar, thyroid ya vitamin ki shikayat pehle rahi ho, ya bahar se lambe samay baad ghar aaye hain, to Advanced zyada kaam ka hai. Ghar ke bujurgon ke liye Senior Pack.",
      [
        "Package me kya hona chahiye aur \"80+ parameters\" jaise vaade me kitna dum hota hai — ",
        { text: "ye guide wahi samjhaati hai", href: GUIDE_FULL_BODY },
        ".",
      ],
      "Teenon package me 10 se 12 ghante ki fasting chahiye, isliye inhe subah ke slot me rakhwaana hi theek rehta hai.",
    ],
  },

  {
    id: "lab-test-price-siwan",
    h: "Siwan Me Lab Test Price Aur Rate List — Kaunsa Test Kitne Ka",
    p: [
      "Daam wahi hai jo is page ke card par likha hai. Home sample collection ka koi alag charge nahi — na visiting fee, na koi hidden cost. Aap sirf test ka price dete hain.",
      "Aam test ke price: Blood Sugar ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1,000, Vitamin B12 ₹1,200 aur Dengue (NS1, IgG, IgM) ₹1,200.",
      "Package: Basic Full Body Checkup ₹999, Advanced Full Body ₹1,999 aur Senior Citizen Pack ₹2,999. Fever Panel par daam nahi likha hai kyunki usmein kya kya jodna hai wo lakshan aur bukhar ke din par tay hota hai — call par bata diya jaata hai.",
      "Payment sample lene ke waqt hota hai, cash ya UPI (PhonePe, Google Pay, Paytm) se. Ek se zyada logon ka test ek hi visit me ho sakta hai — ek hi phlebotomist, ek hi trip, aur collection tab bhi free.",
    ],
  },

  {
    id: "prepare-for-test-siwan",
    h: "Sample Dene Se Pehle Kya Karein, Kya Na Karein — Fasting Ke Niyam",
    p: [
      "Fasting ka matlab 10 se 12 ghante kuch na khana, aur is beech saada paani peete rehna. Chai, doodh, biscuit, toffee ya paan — inme se kuch bhi report badal deta hai. Raat ka khaana 9 baje tak kar lijiye aur subah 7-8 baje ka slot lijiye; itna hi kaafi hai.",
      "Fasting kin me chahiye: Fasting Blood Sugar, Lipid Profile aur teenon Full Body package me. Kin me nahi: CBC, Thyroid Profile, HbA1c, Vitamin D, Vitamin B12 aur Dengue — ye din me kabhi bhi ho sakte hain.",
      "Dawa band mat kijiye apne aap se. Blood pressure, thyroid ya dil ki dawa niyam se lete hain to usi tarah lijiye, aur booking ke waqt bata dijiye — kis dawa se kaunsa number badalta hai, ye lab ko pata hona chahiye. Sugar ki dawa ya insulin par hain to fasting sample ka waqt doctor se ek baar poochh lena behtar hai.",
      "Sample se pehle raat bhar ki achhi neend aur din bhar paani — ye do cheezein sample lene ka kaam aasan kar deti hain. Nas na milne ki dikkat aksar paani ki kami se hoti hai. Bahut mehnat wala kaam ya vyayam sample se theek pehle mat kijiye; kuch number us se bhi hil jaate hain.",
    ],
  },

  {
    id: "reports-siwan",
    h: "Report Kab Milegi — 24 Ghante Me WhatsApp Par PDF, Aur Use Kaise Padhein",
    p: [
      "Zyadatar routine test ki report 24 ghante ke andar taiyaar ho jaati hai aur WhatsApp tatha email dono par PDF me bhej di jaati hai. Culture jaise test 48 se 72 ghante lete hain, kyunki usmein pehle organism ugana padta hai — ye der takneek ki hai, sust rafteer ki nahi.",
      "Report phone par hone ka sabse bada faayda safar me dikhta hai. Chhapra, Patna ya Gorakhpur me kisi doctor ko dikhana ho to PDF forward kar dijiye — kagaz sambhaal kar le jaane, bheegne ya kho jaane ka jhanjhat khatam. Purani report bhi phone me padi rehti hai, aur doctor ke liye do report ka farak ek report se kahin zyada kaam ka hota hai.",
      "Report me har number ke saath ek normal range likhi hoti hai. Ek-do number range se thoda idhar-udhar hona apne aap me kuch nahi kehta — matlab tabhi banta hai jab use lakshan aur baaki numbers ke saath padha jaaye. Isi liye report ka faisla doctor karta hai, internet nahi.",
      [
        "Report me kya dekhna chahiye aur kaunsa number kis baat ka ishaara hai — ",
        { text: "report kaise padhein", href: `${GUIDE_LAB_TEST}#report-kaise-padhein` },
        " me saada bhasha me likha hai.",
      ],
    ],
  },

  {
    id: "how-to-book-siwan",
    h: "Siwan Me Lab Test Kaise Book Karein — Online Form Ya Ek Phone Call",
    p: [
      "Booking ka tarika seedha hai. Is page par upar diye form me apna naam, mobile number, ilaaka aur test chuniye — ya seedha call kar dijiye. Doctor ka parcha hai to uski photo taiyaar rakhiye; usi panel ke hisaab se booking ho jaayegi.",
      "Lagbhag 30 minute me confirmation call aata hai. Usmein teen cheezein tay hoti hain: slot ka waqt, poora pata landmark ke saath, aur ye ki test me fasting chahiye ya nahi. Isi call par total daam bhi bata diya jaata hai — baad me koi naya charge nahi judta.",
      "Slot subah 6 baje se shuru hote hain aur shaam tak chalte hain. Fasting wale test subah rakhwaiye. Phlebotomist ID card ke saath aata hai aur sample aapke saamne leta hai — dene se pehle card dekh lena aapka hak hai.",
      "Booking ke waqt ye zaroor bata dijiye: ghar me kitne logon ka test hai, koi bujurg ya bistar par to nahi, aur gaon me hain to block, tola aur landmark. Yahi teen jaankariyan visit ko waqt par pahunchati hain.",
      [
        "Aas-paas ke jile bhi isi tarah cover hote hain — ",
        { text: "Deoria me lab test", href: LAB_DEORIA },
        " aur ",
        { text: "Salempur me lab test", href: LAB_SALEMPUR },
        ". Kis test ka kya matlab hai, uspar ",
        { text: "Deoria wali guide", href: GUIDE_LAB_TEST_DEORIA },
        " padhi ja sakti hai — jile alag hain, sawaal wahi hain.",
      ],
    ],
  },

  {
    /* Devanagari section. Is jile ka bada hissa Hindi me hi search karta hai,
       aur poora page Hinglish me hone ke kaaran Devanagari query se choot jaata
       tha. Ye anuvaad nahi hai — yahan wahi baatein hain jo upar hain, chhoti
       aur seedhi shakl me, taaki ye duplicate content na bane. */
    id: "siwan-lab-test-hindi",
    h: "सीवान में लैब टेस्ट — घर से सैंपल कलेक्शन की पूरी जानकारी (हिंदी में)",
    p: [
      "सीवान ज़िले में खून और पेशाब की सभी सामान्य जाँच घर बैठे हो जाती हैं। कहीं जाना नहीं पड़ता — प्रशिक्षित फ्लेबोटोमिस्ट पहचान पत्र के साथ आपके घर आता है, आपके सामने सैंपल लेता है, और रिपोर्ट 24 घंटे के अंदर व्हाट्सएप और ईमेल पर पीडीएफ में आ जाती है। होम सैंपल कलेक्शन पूरी तरह मुफ़्त है; आप सिर्फ़ जाँच का वही दाम देते हैं जो कार्ड पर लिखा है।",
      "ज़िला मुख्यालय सीवान के अलावा महाराजगंज, मैरवा, बड़हरिया, आंदर, बसंतपुर, दरौली, गुठनी, रघुनाथपुर, पचरुखी, हसनपुरा, गोरेयाकोठी और जीरादेई के आसपास के इलाक़ों में भी सैंपल लिया जाता है। अपने गाँव का नाम सूची में न दिखे तो एक बार फ़ोन कर लीजिए, और पता लिखते समय कोई एक निशानी ज़रूर डालिए।",
      "कौन सी जाँच कब — यह सबसे ज़रूरी बात है। बुख़ार के पहले 1 से 5 दिन में डेंगू NS1, पाँचवें दिन के बाद डेंगू IgM, और टाइफ़ाइड की विडाल जाँच के लिए कम से कम 5 से 7 दिन का बुख़ार चाहिए। हर बुख़ार में CBC साथ में ज़रूर कराएँ। शुगर, लिपिड और सभी फुल बॉडी पैकेज में 10 से 12 घंटे खाली पेट रहना पड़ता है; उस दौरान सादा पानी पीते रहिए।",
      "एक चेतावनी जो इस ज़िले के लिए सबसे ज़रूरी है। बुख़ार दो हफ़्ते से ज़्यादा चले, पेट फूला लगे, वज़न गिरता जाए और कमज़ोरी बढ़ती जाए — तो जाँच बुक करने के बजाय सीधे सरकारी अस्पताल जाइए। ये कालाजार के लक्षण हो सकते हैं, और राष्ट्रीय कार्यक्रम के तहत उसकी जाँच और इलाज सरकारी केंद्रों पर मुफ़्त है। इसी तरह बच्चे को तेज़ बुख़ार के साथ झटके आएँ या वह सुस्त पड़ा रहे, तो तुरंत अस्पताल — घर पर सैंपल का इंतज़ार मत कीजिए।",
      "खाड़ी देशों में जाने से पहले होने वाला सरकारी मेडिकल (GAMCA / Wafid) केवल अनुमोदित केंद्र पर ही होता है — वह हम नहीं करते। लेकिन उससे पहले अपनी शुगर, HbA1c, लिवर और लिपिड की जाँच घर पर करा लेना काम की बात है, क्योंकि कुछ गड़बड़ निकले तो सुधारने का समय बचा रहता है।",
      "बुकिंग के लिए ऊपर दिया फ़ॉर्म भर दीजिए या फ़ोन कर दीजिए। लगभग 30 मिनट में कॉल आकर समय, पता और यह तय हो जाता है कि जाँच में खाली पेट रहना है या नहीं। भुगतान सैंपल लेते समय नक़द या यूपीआई से होता है।",
    ],
  },
];

/**
 * Siwan's FAQs.
 *
 * Every one is this district's own question. Deliberately NOT copied from
 * defaultFaqs(): the generated set answers "kya aap mere ilaake me aate hain"
 * and "kitna kharcha" in a city-neutral way, and this district's versions have
 * to carry the Gulf medical, the three-way travel question and the long-fever
 * warning.
 *
 * The rate line in the first answer must match the price section above AND
 * defaultTests() in src/data/lab/defaults.js. Those three are the only places
 * a price appears for this city.
 */
export const siwanFaqs = [
  {
    q: "Siwan me lab test ka kitna kharcha aata hai, aur kya home sample collection free hai?",
    a: "Aap sirf test ka wahi price dete hain jo card par likha hai — Siwan me home sample collection bilkul free hai, na visiting charge na koi hidden fee. Rate list is tarah hai: Blood Sugar ₹100, CBC ₹400, Thyroid Profile ₹550, Lipid Profile ₹800 aur Basic Full Body Checkup ₹999 se shuru. Payment sample lene ke waqt cash ya UPI se hota hai.",
  },
  {
    q: "Kya Gulf jaane ka medical (GAMCA / Wafid) yahan ho jaayega?",
    a: "Nahi. Gulf ka pre-departure medical sirf Wafid-approved centre par hi hota hai aur uski report seedha unke system me jaati hai — hum wo nahi karte, aur kisi aur ki report wahan chalti bhi nahi. Uske liye approved centre par hi jaana hoga. Haan, us medical se pehle apni Blood Sugar, HbA1c, Liver Function Test aur Lipid Profile ghar par karwa lena kaam ka hai: kuch galat nikla to sudhaarne ka waqt bacha rehta hai, aur medical me fail hone par jo paisa aur ticket jaata hai wo bach jaata hai.",
  },
  {
    q: "Kya lab test ke liye mujhe Siwan se Chhapra ya Patna jaana padega?",
    a: "Routine pathology ke liye bilkul nahi. Blood aur urine ke saare test — CBC, sugar, thyroid, liver, kidney, lipid, vitamin, dengue — sample par hote hain, aur sample aapke ghar Siwan me hi liya ja sakta hai. Chhapra, Patna ya Gorakhpur jaana sirf tab zaroori hai jab MRI, CT scan, endoscopy jaisi imaging ho ya kisi specialist ki OPD me dikhana ho. Aisi trip se pehle blood test ghar par karwa lijiye, taaki report pehle se haath me ho — warna doctor test likh kar agli tareekh de deta hai aur wahi safar dobara karna padta hai.",
    links: [
      { href: LAB_GORAKHPUR, label: "Gorakhpur me lab test" },
      { href: LAB_VARANASI, label: "Varanasi me lab test" },
    ],
  },
  {
    q: "Siwan jile me aap kaun kaun se ilaake cover karte hain?",
    a: "Hum Siwan Sadar ke saath Maharajganj, Mairwa, Barharia, Andar, Basantpur, Darauli, Guthani, Raghunathpur, Pachrukhi, Hasanpura, Goriakothi aur Jiradei tatha inke aas-paas ke ilaakon me sample collect karte hain. Aapka gaon is list me naam se nahi hai to bhi ek baar call kar ke pooch lijiye — cover hone par usi waqt slot book ho jaayega. Pata likhte waqt block ka naam aur ek landmark zaroor daaliye, kyunki yahan house number se zyada landmark kaam aata hai.",
  },
  {
    q: "Bukhar do hafte se zyada chal raha hai aur pet phoola lag raha hai — kya test book karun?",
    a: "Pehle doctor ko dikhaiye. Lamba bukhar, pet ka phoolna, wazan girna aur badhti kamzori — Bihar me ye kala-azar ke lakshan bhi ho sakte hain, aur rashtriya karyakram ke tahat uski jaanch aur ilaaj sarkari aspatal me muft hota hai. Hum wo confirm karne wali jaanch nahi karte. CBC ek ishaara zaroor de sakta hai, lekin ishaara nidaan nahi hota — lambe bukhar me pehla kadam doctor hai, test doosra. Yahi baat bachche ke tez bukhar par bhi lagu hai: jhatke, behoshi ya sust padna dikhe to seedha aspatal, ghar par sample ka intezaar nahi.",
  },
  {
    q: "Siwan me lab test ki report kitni jaldi mil jaati hai?",
    a: "Zyadatar routine test ki report 24 ghante ke andar taiyaar ho jaati hai aur WhatsApp tatha email dono par PDF me bhej di jaati hai. Culture jaise test 48 se 72 ghante lete hain, kyunki pehle organism ugana padta hai. Report phone par hone ka faayda ye hai ki Chhapra, Patna ya Gorakhpur ke doctor ko dikhana ho to bas forward kar dijiye — kagaz le kar jaane ki zaroorat nahi.",
  },
  {
    q: "Kaun se test me khaali pet (fasting) rehna zaroori hai?",
    a: "Fasting Blood Sugar, Lipid Profile aur teenon Full Body Checkup package me 10 se 12 ghante kuch nahi khana hota; saada paani pi sakte hain. Chai, doodh, biscuit ya toffee bhi nahi — ek chai se hi report badal jaati hai. CBC, Thyroid Profile, HbA1c, Vitamin D, Vitamin B12 aur Dengue me koi fasting nahi chahiye. Isi liye home visit ke slot subah 6 baje se shuru hote hain, taaki sample de kar aap turant naashta kar sakein.",
  },
  {
    // "Siwan me pathology lab / diagnostic centre / lab test near me" — teenon
    // ka intent ek hi hai, aur wo intent yahi sawaal hai.
    q: "Siwan me pathology lab ya diagnostic centre jaana padega, ya ghar par hi ho jaayega?",
    a: "Routine pathology ke liye kahin jaane ki zaroorat nahi — sample aapke ghar par liya jaata hai. Home visit ke slot subah 6 baje se shuru hote hain aur shaam tak chalte hain, isliye fasting wale test subah aur CBC, thyroid, HbA1c, vitamin jaise test din me kabhi bhi ho jaate hain. X-ray, ultrasound aur CT-MRI machine par hote hain, unke liye centre par hi jaana hoga. Hum 24 ghante khula lab hone ka daawa nahi karte; report 24 ghante ke andar milne ka karte hain.",
  },
  {
    q: "Siwan me booking kaise karein aur payment ka kya tarika hai?",
    a: "Is page par test chun kar form bhar dijiye ya seedha call kar dijiye. Doctor ka parcha hai to uska photo saath rakhiye, taaki wahi panel liya jaaye jo likha hai. Booking confirm hone ke baad trained phlebotomist aam taur par 60 minute me pahunch jaata hai — uske paas ID card hota hai, sample dene se pehle dekh lijiye. Payment usi waqt cash ya UPI (PhonePe, Google Pay, Paytm) se hota hai.",
    links: [{ href: GUIDE_LAB_TEST, label: "Kaun sa test kab karayein — guide" }],
  },
];
