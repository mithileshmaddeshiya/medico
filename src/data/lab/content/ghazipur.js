/**
 * /lab-test/ghazipur — the district's long-form copy and its FAQs.
 *
 * ── THE ARGUMENT THIS PAGE MAKES, AND WHY IT IS NOT ANY OTHER PAGE'S ─────
 * Every district page on this site has to argue from its own situation, or
 * Google reads the set as one page with the noun swapped and indexes none of
 * them properly. The four neighbours already argue:
 *
 *   Deoria / Siwan   — "the big diagnostics are far, skip the journey"
 *   Varanasi         — "the labs are here, skip the queue"
 *   Ballia           — the Ganga diara, the water, and the summer
 *   Mau / Azamgarh   — loom and karkhana work, and the mandal HQ crowd
 *
 * Ghazipur's problem is the opposite of Deoria's. Varanasi is roughly 80 km —
 * about an hour and a half on a good run, and a direct train — and that
 * closeness is itself the habit: a family will board a gaadi for a CBC because
 * "Banaras chalte hain" is easier to say than to find out what is available at
 * home. This page does not tell anyone to stop going to Varanasi. It draws the
 * line where the line actually is: routine pathology does not need that trip,
 * imaging and specialists do.
 *
 * ── WHAT IS GENUINELY LOCAL HERE ─────────────────────────────────────────
 * Three things, and each earns a section rather than a sentence:
 *
 *   1. THE FAUJI BELT. Ghazipur is known for how many of its households have
 *      someone serving or retired from the armed forces and paramilitary —
 *      Gahmar, on the Ganga in Zamania tehsil, is the village the district is
 *      known by for it. That produces two readers nobody else's page has: the
 *      young man preparing for a recruitment rally, and the ex-serviceman's
 *      family whose routine follow-up slips because the man of the house is
 *      posted elsewhere for most of the year.
 *
 *      ⚠ WE DO NOT DO THE RECRUITMENT MEDICAL. That is done at the rally and
 *      at military hospitals, and this page says so in plain words rather than
 *      going quiet about it — the same rule the Gulf medical gets on the Siwan
 *      page. A candidate who thought his medical was handled here would lose
 *      his rally. The keyword is not worth that, which is also why no
 *      "army medical" term appears in this city's keyword list.
 *
 *   2. THE GANGA, AND WHOSE SECTION THE WATER IS. The river runs the length of
 *      this district and Sevrai, Bhanwarkol, Revatipur, Gahmar and Zamania
 *      take its water. But the arsenic story of the middle Ganga plain is
 *      ALREADY WRITTEN, at length, on the Ballia page — see the
 *      `ganga-patti-paani-ballia` section. Repeating it here would be the
 *      duplicate this whole file exists to avoid, so Ghazipur's flood section
 *      stays on what is specific to the weeks after the water goes — typhoid
 *      and jaundice — and LINKS to Ballia for the rest.
 *
 *   3. DILDARNAGAR AND ZAMANIA — the rail side of the district. The Delhi–
 *      Howrah main line runs through here, which is why so much of this
 *      district's travel is by train and why a 6 AM collection slot is what
 *      makes a same-day trip possible at all.
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
 * NOT CLAIMED however well it would rank: "24 hour lab in Ghazipur".
 * Collection runs 6 AM–9 PM, so the page says "report 24 ghante me" — true —
 * and never "24 ghante khula lab", which is not.
 *
 * The district hospital and the private clinics are described as existing,
 * which they do. No named institution is claimed as a partner, because none
 * is.
 *
 * Distances are hedged ("kareeb") because they are road distances that vary by
 * route, not measured facts.
 *
 * ── HOW THE KEYWORDS ARE PLACED ──────────────────────────────────────────
 * One primary term ("lab test in Ghazipur" / "Ghazipur me lab test"), carried
 * by the URL, the h1, the title and the lead. Everything else gets a SEPARATE
 * heading, because a heading ranks and a keyword buried in a paragraph mostly
 * does not: pathology lab / diagnostic centre, dengue-typhoid-malaria, CBC,
 * sugar-HbA1c-thyroid, full body checkup, price / rate list. Each appears in
 * ONE h2 and then reads as ordinary prose.
 *
 * ── INTERNAL LINKS ───────────────────────────────────────────────────────
 * Paragraph parts shaped { text, href } render as real in-prose links (see
 * LabContent). Every href below must be a route that renders:
 *   /lab-test/{varanasi,ballia,mau,azamgarh}   (src/data/lab/cities.js)
 *   /blogs/lab-test/varanasi                   (src/data/blogs/varanasi/)
 *   /blogs/full-body-checkup/varanasi
 */

/* Link targets. Constants so a route rename is a one-line fix here instead of
   a hunt through the prose — and so a typo shows up as `undefined` in the href
   rather than as a silent 404 in production. */
const LAB_VARANASI = "/lab-test/varanasi";
const LAB_BALLIA = "/lab-test/ballia";
const LAB_MAU = "/lab-test/mau";
const LAB_AZAMGARH = "/lab-test/azamgarh";
// Deep link into Ballia's water section rather than repeating it here — see
// point 2 in the header. The anchor is that section's `id` in content/ballia.js;
// renaming it there breaks this link and nothing will warn you.
const BALLIA_PAANI = `${LAB_BALLIA}#ganga-patti-paani-ballia`;
const GUIDE_LAB_TEST = "/blogs/lab-test/varanasi";
const GUIDE_FULL_BODY = "/blogs/full-body-checkup/varanasi";

export const ghazipurContent = [
  {
    id: "lab-test-in-ghazipur",
    h: "Ghazipur Me Lab Test — Ghar Baithe Blood Test Booking Aur Free Home Sample Collection",
    p: [
      "Ghazipur ki dikkat wo nahi hai jo Deoria ya Siwan ki hai. Yahan se Varanasi kareeb 80 kilometre hai — seedhi sadak, seedhi train, aur subah nikal kar shaam tak laut aane wali doori. Aur yahi aadat ban gayi hai: CBC jaisi choti jaanch ke liye bhi ghar me tay ho jaata hai ki \"Banaras chalte hain\", bina ye dekhe ki wo jaanch ghar par ho sakti thi ya nahi.",
      "Ek CBC ke liye Varanasi jaane ka matlab hai — subah ki gaadi, khaali pet ka safar, wahan ki line, aur report ke liye ya to shaam tak rukna ya doosre din dobara jaana. Do sau rupaye ka test aur poora din. Ye page us aadat ko todne ke liye hai, Varanasi jaane se rokne ke liye nahi.",
      "Home sample collection me aap Ghazipur me apne ghar ka pata dete hain, subah ka slot chunte hain, aur trained phlebotomist ID card ke saath aapke darwaze par aata hai. Sample wahin liya jaata hai aur report 24 ghante me WhatsApp aur email par PDF me aa jaati hai. Home collection ka koi alag charge nahi.",
      "Yahan routine pathology ke saare test aur checkup package book hote hain — CBC, Thyroid Profile, Blood Sugar, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test, Vitamin D, Vitamin B12, Dengue aur Full Body Checkup. Doctor ne parcha likh diya hai to usi panel ke hisaab se booking ho jaati hai; koi test is page par na dikhe to prescription ke saath ek call kar lijiye.",
      [
        "Kaun sa test kab karana chahiye, bukhar me kis din test matlab rakhta hai, aur report ke numbers me kya dekhna chahiye — us par alag se guide hai: ",
        { text: "kaun sa test kab karayein", href: GUIDE_LAB_TEST },
        ".",
      ],
    ],
  },

  {
    id: "pathology-lab-diagnostic-centre-ghazipur",
    h: "Ghazipur Me Pathology Lab Ya Diagnostic Centre Dhoondh Rahe Hain?",
    p: [
      "Log \"Ghazipur me pathology lab\", \"diagnostic centre near me\" ya \"blood test near me\" isliye search karte hain kyunki unhe lagta hai kahin jaana hi padega. Zila mukhyalaya par district hospital hai aur sheher me kai private clinic bhi, lekin routine pathology me ab kahin jaana zaroori nahi raha — khoon aur peshaab ke jitne bhi aam test hain, wo sample par hote hain, aur sample aapke ghar par liya ja sakta hai.",
      "Iska matlab ye nahi ki har cheez ghar par ho jaayegi. X-ray, ultrasound, ECG, CT scan aur MRI machine par hote hain, aur unke liye centre par hi jaana padega. Ye page unke liye nahi hai; ye un test ke liye hai jinke liye aaj bhi log subah ki line me lagte hain jabki lagne ki zaroorat nahi.",
      "Hum Ghazipur me koi walk-in counter hone ka daawa nahi karte. Jo hai wo ye hai: aapke ghar par sample lene wali service, poore jile me, subah 6 baje se shaam tak ke slot me.",
    ],
  },

  {
    id: "home-sample-collection-ghazipur",
    h: "Ghazipur Sheher Aur Jile Me Home Sample Collection — Lanka, Mahuabagh Se Zamania, Saidpur, Mohammadabad Aur Dildarnagar Tak",
    p: [
      "Sheher me Lanka, Mahuabagh, Vishveshwarganj, Rauza aur Nandganj ki taraf ke mohalle cover hote hain. Jile me Zamania, Saidpur, Mohammadabad (Yusufpur), Kasimabad, Jakhanian, Sevrai, Dildarnagar, Gahmar, Revatipur aur Bhanwarkol tatha inse lage gaon.",
      "Aapke gaon ka naam is list me na ho to bhi ek baar call kar lijiye. Ye zila Ganga ke dono kinaron par faila hua hai aur bahut se tole apne block ya station ke naam se hi jaane jaate hain — cover hone par usi call par slot book ho jaata hai.",
      "Pata likhte waqt landmark zaroor daaliye. Yahan house number se kaam nahi chalta: school, mandir, masjid, petrol pump, bazaar, station ya panchayat bhavan — koi ek nishani likh dijiye aur apne block ya tehsil ka naam saath me. Ghar par koi bujurg hai ya bistar par hai, ye bhi booking ke waqt bata dijiye, taaki phlebotomist us hisaab se taiyaar aaye.",
      [
        "Jile ke poorab me Ballia aur uttar me Mau ki seema lagti hai. Un taraf ke reader ke liye ",
        { text: "Ballia me lab test", href: LAB_BALLIA },
        " aur ",
        { text: "Mau me lab test", href: LAB_MAU },
        " — dono par yahi service usi tarah chalti hai.",
      ],
    ],
  },

  {
    id: "varanasi-ek-ghanta-ghazipur",
    h: "Varanasi Kab Jaana Zaroori Hai Aur Kab Nahi — Ek Ghante Ki Doori Ka Sach",
    p: [
      "Varanasi kareeb 80 kilometre par hai aur wahin is poore ilaake ke bade sansthan, specialist aur imaging centre hain. Us doori ka faayda asli hai — lekin wo faayda un cheezon ke liye hai jo sirf wahan ho sakti hain.",
      "Routine pathology unme nahi aati. CBC, sugar, thyroid, liver, kidney, lipid, vitamin, dengue — ye sab sample par hote hain, aur sample Ghazipur me aapke ghar par liya ja sakta hai. Inke liye gaadi pakadna sirf ek din aur ek kiraya kharch karna hai, natija wahi rehta hai.",
      "Varanasi jaana tab zaroori hai jab MRI, CT scan, endoscopy jaisi imaging chahiye, ya kisi specialist ki OPD me dikhana ho, ya kisi bade operation ki baat ho. Aur us din ke liye ek baat sabse zyada kaam ki hai: report pehle se haath me le kar jaaiye.",
      "Wajah seedhi hai. Doctor pehli hi baithak me report dekh kar aage badh jaata hai. Report nahi hai to wo test likh kar agli tareekh de deta hai — matlab wahi safar dobara, wahi kiraya dobara. Ek din pehle ghar par sample de dena us doosre safar ko bacha leta hai.",
      [
        "Varanasi me bhi yahi service chalti hai, agar wahin rukna ho: ",
        { text: "Varanasi me lab test", href: LAB_VARANASI },
        ". Aur ",
        { text: "Azamgarh", href: LAB_AZAMGARH },
        " ki taraf ka kaam ho to wahan bhi.",
      ],
    ],
  },

  {
    /* ⚠ THE SECTION THAT MUST NOT DRIFT INTO A SALES PITCH.
       The recruitment medical is done at the rally and at military hospitals.
       This section exists to say that plainly and then be useful about the part
       we CAN do — the routine bloodwork a candidate wants to see beforehand,
       and the follow-up an ex-serviceman's family keeps missing. Read the file
       header before editing a word of it. */
    id: "fauji-parivaar-ghazipur",
    h: "Fauj Se Jude Gharon Ke Liye — Bharti Se Pehle Ki Jaanch, Aur Wo Follow-up Jo Chhoot Jaata Hai",
    p: [
      "Ghazipur ke bahut se ghar fauj aur ardh-sainik balon se jude hain — Gahmar to is baat ke liye hi jaana jaata hai. Isse do tarah ke sawaal yahan sabse zyada aate hain, aur dono ka jawab alag hai.",
      "Pehla, bharti ki taiyaari karne wale ladke. Saaf baat pehle: bharti ka medical rally me aur military aspatal me hota hai — wo hum nahi karte, aur kisi aur ki report wahan chalti bhi nahi. Uska koi vikalp is page par nahi hai. Lekin uske pehle apni haalat jaan lena kaam ka hai: CBC se haemoglobin aur khoon ki kami saamne aa jaati hai, jo is umar ke ladkon me daudne aur stamina par seedha asar daalti hai, aur Blood Sugar se wo cheez pata chalti hai jiska kisi ko shaq bhi nahi hota. Kuch kam nikla to sudhaarne ka waqt bacha rehta hai — mahine bhar ki dawa aur khaana kaafi hota hai.",
      "Doosra, aur zyada zaroori: fauj se retire ho chuke log aur wo parivaar jinke ghar ka aadmi saal bhar bahar posted rehta hai. Card hone ke baad bhi routine jaanch isliye chhoot jaati hai kyunki polyclinic door hai aur ghar par sirf mahilaen aur bujurg hain. Sugar, HbA1c, Lipid aur Kidney Function — yahi wo chaar hain jo saal-do-saal me chup-chaap badalte hain, aur inhi ki jaanch sabse aasani se ghar par ho jaati hai.",
      "Chutti par ghar aaye ho aur do hafte me sab kaam nipatana ho — checkup us list me sabse aakhir me aata hai aur aksar reh jaata hai. Subah ka ek slot, dus minute, aur report phone par: is ek maukey ke liye Full Body Checkup ke package theek baithte hain.",
      [
        "Package me kya hona chahiye aur \"80+ parameters\" ka kya matlab hota hai, ye ",
        { text: "full body checkup wali guide", href: GUIDE_FULL_BODY },
        " me detail me likha hai.",
      ],
    ],
  },

  {
    id: "ganga-baadh-jaundice-ghazipur",
    h: "Ganga Ka Paani Utarne Ke Baad — Jaundice, Typhoid Aur LFT Ki Jaanch",
    p: [
      "Ganga is jile ki lambai me behti hai, aur Sevrai, Bhanwarkol, Revatipur, Gahmar tatha Zamania ki taraf ka ilaaka har saal uske paani se kuch na kuch jhelta hai. Paani utarne ke baad ka mahina sabse nazuk hota hai — kuan aur handpump ka paani milawat le leta hai, aur wahin se typhoid aur jaundice shuru hote hain.",
      "Is mausam me teen cheezein dhyan me rakhiye. Aankhon ya peshaab me peelapan dikhe to Liver Function Test — bilirubin, SGOT, SGPT — pehla test hai. Lagatar bukhar 5-7 din se zyada chale to typhoid ki jaanch matlab rakhti hai. Aur ulti-dast ke baad kamzori bani rahe to CBC aur Kidney Function Test se pata chalta hai ki paani ki kami ne kitna asar dala.",
      "Jaundice me sabse zyada nuksaan gharelu nuskhon me lage waqt se hota hai. Peelapan dikhte hi LFT karwa lena isliye sahi hai ki number bata dete hain ki maamla halka hai ya doctor ke paas jaane wala — aur ye faisla jitni jaldi ho, utna behtar. Paani utarne ke baad peene ka paani ubaal kar peene ki salah har baar dohrayi jaati hai, aur har baar isliye kyunki wahi ek aadat is mausam ke aadhe maamle rok deti hai.",
      [
        "Ganga patti ke paani me arsenic aur uske asar par is belt ke liye alag se likha gaya hai — ",
        { text: "Ballia ke page par Ganga patti wala hissa", href: BALLIA_PAANI },
        " — kyunki wo baat Ghazipur, Ballia aur Buxar tak ek jaisi hai. Yahan wahi dobara likhne ke bajaye wahin bhej dena zyada imaandari hai.",
      ],
    ],
  },

  {
    id: "bukhar-dengue-typhoid-ghazipur",
    h: "Ghazipur Me Dengue, Typhoid Aur Malaria Test — Bukhar Ke Kis Din Kaunsa Test",
    p: [
      "Barsaat ke baad yahan bukhar ka mausam shuru hota hai, aur sabse aam galti ye hoti hai ki test galat din par kara liya jaata hai. Report \"negative\" aa jaati hai, log nishchint ho jaate hain, aur bimari chalti rehti hai.",
      "Seedha niyam ye hai. Dengue NS1 bukhar ke pehle 1 se 5 din me sahi jawab deta hai; paanchve din ke baad NS1 ki jagah IgM matlab rakhta hai. Typhoid ke Widal test ke liye kam se kam 5 se 7 din ka bukhar chahiye — teesre din ka Widal aksar bekaar jaata hai. Malaria ki jaanch bukhar chadhte waqt sabse achhi hoti hai.",
      "Har bukhar me CBC saath me karwa lijiye. Platelet ka girna, white cell ka pattern aur haemoglobin — teenon milkar doctor ko wo tasveer dete hain jo akela ek test nahi de paata. Fever Panel me malaria, typhoid aur dengue ek saath aa jaate hain; uska price is page ke rate card par \"call for price\" isliye hai kyunki panel me kya jodna hai wo lakshan aur bukhar ke din par tay hota hai.",
      "Aur ek baat jo har mausam par lagu hai: bachche ko tez bukhar ke saath jhatke aayein, behoshi ho, gardan akad jaaye ya wo sust pada rahe — to ghar par sample ka intezaar bilkul mat kijiye, seedha najdeeki aspatal le jaaiye. Aise me ek ek ghanta maayne rakhta hai.",
      [
        "Bukhar ke kis din kaunsa test — is par din-war samjhaane wali ",
        { text: "guide yahan hai", href: GUIDE_LAB_TEST },
        ".",
      ],
    ],
  },

  {
    id: "anaemia-mahilaen-ghazipur",
    h: "Ghazipur Me CBC Test Aur Khoon Ki Kami — Ghar Ki Mahilaon Me Sabse Zyada Chhoot Jaane Wali Jaanch",
    p: [
      "Is jile ke bahut se gharon me kamane wala aadmi bahar rehta hai, aur ghar mahilaen sambhaalti hain — apne aur bachchon ke saath bujurgon ka bhi. Aisi grihasthi me apni jaanch sabse aakhir me aati hai, aur aksar aati hi nahi.",
      "Khoon ki kami yahan itni aam hai ki ise bimari maana hi nahi jaata. Thakan, chakkar, saans phoolna, chidchidapan aur bachchon ka padhai me man na lagna — inhe kamzori keh kar chhod diya jaata hai, jabki inke peeche aksar haemoglobin ka kam hona hota hai.",
      "CBC (Complete Blood Count) isi ka jawab hai. Ismein haemoglobin ke saath red cell ka size aur count bhi aata hai, jisse pata chalta hai ki kami lohe (iron) ki hai ya kisi aur wajah se. Sirf haemoglobin dekh lena aadha jawab hai; ilaaj poore jawab par tay hota hai. Iron ki dawa shuru karne se pehle ek CBC karwa lena isliye theek hai ki tab pata rehta hai ki dawa kaam kar rahi hai ya nahi.",
      "CBC me fasting nahi chahiye aur ye is page ke sabse saste test me se ek hai. Ghar par sample dene ka faayda yahan sabse zyada hai — jis mahila ke paas aadha din nikalne ka waqt nahi hota, wahi sabse zyada is jaanch se chhoot jaati hai. Ek visit me ghar ke kai logon ka sample bhi liya ja sakta hai.",
    ],
  },

  {
    id: "diabetes-thyroid-screening-ghazipur",
    h: "Ghazipur Me Sugar Test, HbA1c Aur Thyroid Test (TSH) — Kis Umar Me Kya Karana Chahiye",
    p: [
      "Sugar aur thyroid dono chupke se badhte hain. Jab tak lakshan dikhte hain — bahut pyaas, baar baar peshaab, wazan ka girna ya badhna, thakan, baal jhadna — tab tak kaafi waqt nikal chuka hota hai. Isi liye inhe lakshan par nahi, umar aur ghar ke itihaas par jaancha jaata hai.",
      "Aam salah ye hai: 30 ke baad saal me ek baar Fasting Blood Sugar. Ghar me kisi ko diabetes hai, wazan zyada hai, ya pehle sugar border par nikla tha — to sugar ke saath HbA1c bhi, jo teen mahine ka ausat batata hai aur ek din ke khaane-peene se nahi badalta. Mahilaon me thyroid zyada aam hai, isliye 30 ke baad TSH ek baar zaroor.",
      "Jo pehle se dawa par hain, unke liye asli baat follow-up hai. Bahut se log dawa Varanasi ya Delhi me shuru karte hain aur ghar aakar wahi purani dose chalate rehte hain, bina dobara jaanche. HbA1c har teen mahine aur TSH doctor ke kahe anusar — yahi wo jaanch hai jo sabse zyada chhoot jaati hai, aur sabse saste me ho jaati hai.",
      "Fasting wale test ke liye subah 6 baje se slot rakhe gaye hain, taaki sample dekar aap turant naashta kar sakein. HbA1c aur TSH me fasting nahi chahiye — wo din me kabhi bhi ho sakte hain.",
    ],
  },

  {
    id: "full-body-checkup-ghazipur",
    h: "Ghazipur Me Full Body Checkup Package — 45, 72 Aur 88 Parameter Wale Plan",
    p: [
      "Full body checkup ka matlab har test karana nahi hota. Matlab ye hota hai ki wo test ek saath ho jaayein jo milkar tasveer banate hain — khoon, sugar, charbi, liver aur kidney. Usse aage ka faisla report dekh kar hota hai, pehle se nahi.",
      "Teen package hain. Basic Full Body Checkup ₹999 me 45 parameter — CBC, sugar, lipid, LFT aur KFT. Advanced Full Body ₹1,999 me 72 parameter — isi me thyroid, HbA1c aur vitamin jud jaate hain. Senior Citizen Pack ₹2,999 me 88 parameter, jo 55 saal se upar walon ke liye dil, haddi aur sugar par zyada dhyan deta hai.",
      "Kis ke liye kaun sa: pehli baar checkup kara rahe hain aur koi shikayat nahi hai to Basic kaafi hai. Sugar, thyroid ya vitamin ki shikayat pehle rahi ho, ya lambe samay baad ghar aaye hain, to Advanced zyada kaam ka hai. Ghar ke bujurgon ke liye Senior Pack.",
      [
        "Package me kya hona chahiye aur \"80+ parameters\" jaise vaade me kitna dum hota hai — ",
        { text: "ye guide wahi samjhaati hai", href: GUIDE_FULL_BODY },
        ".",
      ],
      "Teenon package me 10 se 12 ghante ki fasting chahiye, isliye inhe subah ke slot me rakhwaana hi theek rehta hai.",
    ],
  },

  {
    id: "lab-test-price-ghazipur",
    h: "Ghazipur Me Lab Test Price Aur Rate List — Kaunsa Test Kitne Ka",
    p: [
      "Daam wahi hai jo is page ke card par likha hai. Home sample collection ka koi alag charge nahi — na visiting fee, na koi hidden cost. Aap sirf test ka price dete hain.",
      "Aam test ke price: Blood Sugar ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1,000, Vitamin B12 ₹1,200 aur Dengue (NS1, IgG, IgM) ₹1,200.",
      "Package: Basic Full Body Checkup ₹999, Advanced Full Body ₹1,999 aur Senior Citizen Pack ₹2,999. Fever Panel par daam nahi likha hai kyunki usmein kya kya jodna hai wo lakshan aur bukhar ke din par tay hota hai — call par bata diya jaata hai.",
      "Payment sample lene ke waqt hota hai, cash ya UPI (PhonePe, Google Pay, Paytm) se. Ek se zyada logon ka test ek hi visit me ho sakta hai — ek hi phlebotomist, ek hi trip, aur collection tab bhi free. Varanasi jaakar test karane se jo kiraya aur din bachta hai, wo iske upar hai.",
    ],
  },

  {
    id: "prepare-for-test-ghazipur",
    h: "Sample Dene Se Pehle Kya Karein, Kya Na Karein — Fasting Ke Niyam",
    p: [
      "Fasting ka matlab 10 se 12 ghante kuch na khana, aur is beech saada paani peete rehna. Chai, doodh, biscuit, toffee ya paan — inme se kuch bhi report badal deta hai. Raat ka khaana 9 baje tak kar lijiye aur subah 7-8 baje ka slot lijiye; itna hi kaafi hai.",
      "Fasting kin me chahiye: Fasting Blood Sugar, Lipid Profile aur teenon Full Body package me. Kin me nahi: CBC, Thyroid Profile, HbA1c, Vitamin D, Vitamin B12 aur Dengue — ye din me kabhi bhi ho sakte hain.",
      "Dawa band mat kijiye apne aap se. Blood pressure, thyroid ya dil ki dawa niyam se lete hain to usi tarah lijiye, aur booking ke waqt bata dijiye — kis dawa se kaunsa number badalta hai, ye lab ko pata hona chahiye. Sugar ki dawa ya insulin par hain to fasting sample ka waqt doctor se ek baar poochh lena behtar hai.",
      "Agar usi din Varanasi ya kahin bahar nikalna hai to slot subah 6 baje ka rakhwaaiye — sample dekar naashta kar lijiye aur gaadi pakad lijiye. Dildarnagar aur Zamania ki taraf se subah ki train pakadne walon ke liye yahi sabse kaam ka intezaam hai.",
      "Sample se pehle raat bhar ki achhi neend aur din bhar paani — ye do cheezein sample lene ka kaam aasan kar deti hain; nas na milne ki dikkat aksar paani ki kami se hoti hai. Bahut mehnat wala kaam ya vyayam sample se theek pehle mat kijiye.",
    ],
  },

  {
    id: "reports-ghazipur",
    h: "Report Kab Milegi — 24 Ghante Me WhatsApp Par PDF, Aur Use Kaise Padhein",
    p: [
      "Zyadatar routine test ki report 24 ghante ke andar taiyaar ho jaati hai aur WhatsApp tatha email dono par PDF me bhej di jaati hai. Culture jaise test 48 se 72 ghante lete hain, kyunki usmein pehle organism ugana padta hai — ye der takneek ki hai, sust rafteer ki nahi.",
      "Report phone par hone ka sabse bada faayda safar me dikhta hai. Varanasi ya Lucknow me kisi doctor ko dikhana ho to PDF forward kar dijiye — kagaz sambhaal kar le jaane, bheegne ya kho jaane ka jhanjhat khatam. Ghar ka aadmi bahar posted hai to use bhi wahi file bhej di jaati hai, aur wo wahin baithe doctor se salah le leta hai.",
      "Purani report bhi phone me padi rehti hai, aur doctor ke liye do report ka farak ek report se kahin zyada kaam ka hota hai. Sugar aur thyroid me to poora ilaaj isi farak par tay hota hai.",
      "Report me har number ke saath ek normal range likhi hoti hai. Ek-do number range se thoda idhar-udhar hona apne aap me kuch nahi kehta — matlab tabhi banta hai jab use lakshan aur baaki numbers ke saath padha jaaye. Isi liye report ka faisla doctor karta hai, internet nahi.",
      [
        "Report me kya dekhna chahiye aur kaunsa number kis baat ka ishaara hai — ",
        { text: "report kaise padhein", href: `${GUIDE_LAB_TEST}#report-kaise-padhein` },
        " me saada bhasha me likha hai.",
      ],
    ],
  },

  {
    id: "how-to-book-ghazipur",
    h: "Ghazipur Me Lab Test Kaise Book Karein — Online Form Ya Ek Phone Call",
    p: [
      "Booking ka tarika seedha hai. Is page par upar diye form me apna naam, mobile number, ilaaka aur test chuniye — ya seedha call kar dijiye. Doctor ka parcha hai to uski photo taiyaar rakhiye; usi panel ke hisaab se booking ho jaayegi.",
      "Lagbhag 30 minute me confirmation call aata hai. Usmein teen cheezein tay hoti hain: slot ka waqt, poora pata landmark ke saath, aur ye ki test me fasting chahiye ya nahi. Isi call par total daam bhi bata diya jaata hai — baad me koi naya charge nahi judta.",
      "Slot subah 6 baje se shuru hote hain aur shaam tak chalte hain. Fasting wale test subah rakhwaiye. Phlebotomist ID card ke saath aata hai aur sample aapke saamne leta hai — dene se pehle card dekh lena aapka hak hai.",
      "Booking ke waqt ye zaroor bata dijiye: ghar me kitne logon ka test hai, koi bujurg ya bistar par to nahi, aur gaon me hain to tehsil, tola aur landmark. Yahi teen jaankariyan visit ko waqt par pahunchati hain.",
      [
        "Aas-paas ke jile bhi isi tarah cover hote hain — ",
        { text: "Ballia me lab test", href: LAB_BALLIA },
        ", ",
        { text: "Mau me lab test", href: LAB_MAU },
        " aur ",
        { text: "Varanasi me lab test", href: LAB_VARANASI },
        ".",
      ],
    ],
  },

  {
    /* Devanagari section. Is jile ka bada hissa Hindi me hi search karta hai,
       aur poora page Hinglish me hone ke kaaran Devanagari query se choot jaata
       tha. Ye anuvaad nahi hai — yahan wahi baatein hain jo upar hain, chhoti
       aur seedhi shakl me, taaki ye duplicate content na bane. */
    id: "ghazipur-lab-test-hindi",
    h: "ग़ाज़ीपुर में लैब टेस्ट — घर से सैंपल कलेक्शन की पूरी जानकारी (हिंदी में)",
    p: [
      "ग़ाज़ीपुर ज़िले में खून और पेशाब की सभी सामान्य जाँच घर बैठे हो जाती हैं। कहीं जाना नहीं पड़ता — प्रशिक्षित फ्लेबोटोमिस्ट पहचान पत्र के साथ आपके घर आता है, आपके सामने सैंपल लेता है, और रिपोर्ट 24 घंटे के अंदर व्हाट्सएप और ईमेल पर पीडीएफ में आ जाती है। होम सैंपल कलेक्शन पूरी तरह मुफ़्त है; आप सिर्फ़ जाँच का वही दाम देते हैं जो कार्ड पर लिखा है।",
      "वाराणसी यहाँ से लगभग 80 किलोमीटर है, और यही आदत बन गई है कि छोटी सी जाँच के लिए भी लोग गाड़ी पकड़ लेते हैं। CBC, शुगर, थायरॉइड, लिवर, किडनी, लिपिड, विटामिन और डेंगू — ये सब सैंपल पर होते हैं और घर पर हो सकते हैं। वाराणसी जाना तब ज़रूरी है जब MRI, CT स्कैन या किसी विशेषज्ञ को दिखाना हो — और उस दिन रिपोर्ट पहले से हाथ में ले जाइए, वरना डॉक्टर जाँच लिखकर अगली तारीख़ दे देता है।",
      "शहर में लंका, महुआबाग, विश्वेश्वरगंज और रौज़ा की तरफ़, तथा ज़िले में ज़मानिया, सैदपुर, मोहम्मदाबाद (यूसुफ़पुर), क़ासिमाबाद, जखनियाँ, सेवराई, दिलदारनगर, गहमर, रेवतीपुर और भाँवरकोल के आसपास सैंपल लिया जाता है। अपने गाँव का नाम सूची में न दिखे तो एक बार फ़ोन कर लीजिए, और पता लिखते समय कोई एक निशानी ज़रूर डालिए।",
      "कौन सी जाँच कब — यह सबसे ज़रूरी बात है। बुख़ार के पहले 1 से 5 दिन में डेंगू NS1, पाँचवें दिन के बाद डेंगू IgM, और टाइफ़ाइड की विडाल जाँच के लिए कम से कम 5 से 7 दिन का बुख़ार चाहिए। हर बुख़ार में CBC साथ में ज़रूर कराएँ। शुगर, लिपिड और सभी फुल बॉडी पैकेज में 10 से 12 घंटे खाली पेट रहना पड़ता है; उस दौरान सादा पानी पीते रहिए।",
      "एक चेतावनी: बच्चे को तेज़ बुख़ार के साथ झटके आएँ, बेहोशी हो, गर्दन अकड़ जाए या वह सुस्त पड़ा रहे — तो जाँच बुक मत कीजिए, सीधे नज़दीकी अस्पताल ले जाइए। ऐसे में एक-एक घंटा मायने रखता है।",
      "फ़ौज की भर्ती का मेडिकल रैली और सैन्य अस्पताल में होता है — वह हम नहीं करते। लेकिन उससे पहले CBC और शुगर की जाँच करा लेना काम की बात है, क्योंकि कुछ कम निकले तो सुधारने का समय बचा रहता है।",
      "बुकिंग के लिए ऊपर दिया फ़ॉर्म भर दीजिए या फ़ोन कर दीजिए। लगभग 30 मिनट में कॉल आकर समय, पता और यह तय हो जाता है कि जाँच में खाली पेट रहना है या नहीं। भुगतान सैंपल लेते समय नक़द या यूपीआई से होता है।",
    ],
  },
];

/**
 * Ghazipur's FAQs.
 *
 * Every one is this district's own question. Deliberately NOT copied from
 * defaultFaqs(): the generated set answers "kya aap mere ilaake me aate hain"
 * and "kitna kharcha" in a city-neutral way, and this district's versions have
 * to carry the Varanasi-is-an-hour-away question and the recruitment medical.
 *
 * The rate line in the first answer must match the price section above AND
 * defaultTests() in src/data/lab/defaults.js. Those three are the only places
 * a price appears for this city.
 */
export const ghazipurFaqs = [
  {
    q: "How much does a lab test cost in Ghazipur, and is home sample collection free?",
    a: "You pay only the price printed on the test card — home sample collection in Ghazipur is completely free, with no visiting charge and no hidden fee. Blood Sugar is ₹100, CBC ₹400, Thyroid Profile ₹550, Lipid Profile ₹800, and the Basic Full Body Checkup starts at ₹999. Payment is taken at the time of collection, by cash or UPI.",
  },
  {
    q: "Do I have to travel from Ghazipur to Varanasi for a lab test?",
    a: "Not for routine pathology. CBC, sugar, thyroid, liver, kidney, lipid, vitamin and dengue tests are all run on a sample, and that sample can be drawn at your home in Ghazipur. Varanasi is about 80 kilometres away, so people go out of habit — but there is nothing to be gained by spending a whole day and the fare on a CBC. Varanasi is necessary when there is imaging such as MRI, CT or endoscopy, or a specialist to see in person — and on that day, go with the report already in hand, or the doctor will prescribe tests and give you another date.",
    links: [{ href: LAB_VARANASI, label: "Lab test in Varanasi" }],
  },
  {
    q: "Can the army recruitment medical be done here?",
    a: "No. The recruitment medical is conducted at the rally and at a military hospital — we do not perform it, and no one else's report is accepted there. There is no alternative to it here. What is worth doing beforehand is having a CBC (for haemoglobin and anaemia) and a Blood Sugar test done at home: if something is low, there is still time to correct it, and both are among the least expensive tests on this page.",
  },
  {
    q: "Which areas of Ghazipur district do you cover?",
    a: "In the city: Lanka, Mahuabagh, Vishveshwarganj, Rauza and towards Nandganj. In the district: Zamania, Saidpur, Mohammadabad (Yusufpur), Kasimabad, Jakhanian, Sevrai, Dildarnagar, Gahmar, Revatipur and the areas around Bhanwarkol. If your village is not named in this list, please call anyway — if it is covered, the slot is booked on the same call. Do include the tehsil name and a landmark in the address, because a landmark is far more useful here than a house number.",
  },
  {
    q: "There is jaundice after the flood — which test should be done?",
    a: "As soon as yellowing of the eyes or urine appears, a Liver Function Test — bilirubin, SGOT, SGPT — is the first test; the numbers show whether this is mild or something to take to a doctor. The month after the water recedes is hardest on Sevrai, Bhanwarkol, Revatipur and Gahmar, because the drinking water picks up contamination. If a fever continues beyond 5 to 7 days, have the typhoid tests done as well, and if weakness persists after vomiting and loose motions, a CBC along with a Kidney Function Test.",
    links: [{ href: BALLIA_PAANI, label: "More on the water along the Ganga belt" }],
  },
  {
    q: "How quickly will I get my lab test report in Ghazipur?",
    a: "Most routine tests are reported within 24 hours, and the report is sent as a PDF on both WhatsApp and email. Tests such as cultures take 48 to 72 hours, because the organism has to be grown first. Having the report on your phone means that if you need to show it to a doctor in Varanasi or Lucknow, you simply forward it — and if someone from the family is posted away, the same file can be sent to them and advice taken from there.",
  },
  {
    q: "Which tests require fasting?",
    a: "Fasting Blood Sugar, Lipid Profile and all three Full Body Checkup packages need 10 to 12 hours without food; plain water is allowed. Tea, milk, a biscuit or a toffee are not — a single cup of tea is enough to change the result. CBC, Thyroid Profile, HbA1c, Vitamin D, Vitamin B12 and Dengue need no fasting at all. This is why home visit slots start at 6 AM — if you are travelling that day, give the sample, have breakfast and catch your train.",
  },
  {
    // "Ghazipur me pathology lab / diagnostic centre / lab test near me" — all
    // three carry the same intent, and this question is that intent.
    q: "Do I need to visit a pathology lab or diagnostic centre in Ghazipur, or can it be done at home?",
    a: "For routine pathology you do not need to go anywhere — the sample is collected at your home. Home visit slots start at 6 AM and run until evening, so fasting tests can be done in the morning and tests such as CBC, thyroid, HbA1c and vitamins at any time of day. X-rays, ultrasound and CT or MRI are done on a machine, and for those you do have to go to a centre. We do not claim to be a lab that is open 24 hours; what we do commit to is a report within 24 hours.",
  },
  {
    q: "How do I book in Ghazipur, and what are the payment options?",
    a: "Choose a test on this page and fill in the form, or simply call us. If you have a doctor's prescription, keep a photo of it handy so that exactly the panel written on it is run. Once the booking is confirmed, a trained phlebotomist usually arrives within 60 minutes — they carry an ID card, and you are welcome to check it before giving the sample. Payment is taken at that time, by cash or UPI (PhonePe, Google Pay, Paytm). Several people in the same household can be tested in a single visit.",
    links: [{ href: GUIDE_LAB_TEST, label: "Which test, and when — a guide" }],
  },
];
