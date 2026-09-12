/**
 * /lab-test/maharajganj — the district's long-form copy and its FAQs.
 *
 * ── TWO PLACES ARE CALLED MAHARAJGANJ, AND ONE OF THEM IS OURS TOO ───────
 * This is the DISTRICT of Maharajganj: headquarters Maharajganj Sadar, north of
 * Gorakhpur (~50 km), running up to the Nepal border at Sonauli. There is also
 * a town called Maharajganj inside AZAMGARH district, and it is already an
 * `areas` entry on /lab-test/azamgarh — so our own site now carries the name
 * twice, legitimately, for two different places.
 *
 * That is not a detail to leave to a search engine. A reader who lands here
 * from "Maharajganj me blood test" could be either person, so the copy names
 * the ambiguity in its own section, states which district this page serves, and
 * links to the Azamgarh page for the other one. Do not remove that section, and
 * do not let this page start claiming the Azamgarh town — Azamgarh's entry
 * covers it and its schema says "Maharajganj, Azamgarh", which is correct.
 *
 * ── WHAT THIS PAGE ARGUES THAT NO OTHER PAGE HERE DOES ───────────────────
 *   1. CHOOSING A CENTRE IS CHOOSING A JOURNEY. The district's collection
 *      counters sit in four bazaars — Sadar, Nautanwa, Siswa Bazar, Pharenda —
 *      while the population is spread across Terai blocks 25 to 60 km from
 *      them. So "diagnostic centre kahan hai" is really "kitna safar karna
 *      hai", and that is the question this page answers. Padrauna's page is
 *      the opposite case (a town reader who already has a counter in walking
 *      reach) and its five-question checklist is NOT repeated here.
 *   2. THE BORDER BELT. Nautanwa and Sonauli run on border trade and transport;
 *      the working day starts before dawn and people move constantly. For them
 *      a PDF report that lives on the phone is worth more than paper. No other
 *      page on this site has a border section, because no other district here
 *      touches a border.
 *   3. ONE ROAD, ONE CITY. Unlike Khalilabad (pulled between two cities) or
 *      Siwan (three), everything from this district funnels to Gorakhpur. That
 *      makes the Gorakhpur day expensive, and it makes sequencing it properly
 *      the single most useful thing a patient here can do.
 *
 * ── CLAIMS ───────────────────────────────────────────────────────────────
 * Only the confirmed set: free home collection, a trained phlebotomist with an
 * ID card, slots from 6 AM, reports within 24 hours for routine tests, cash/UPI
 * at collection, a confirmation call in about 30 minutes, a visit of about 10
 * minutes. NOT claimed anywhere, however well it would rank: NABL
 * accreditation, pathologist verification, cold-chain transport, barcoded
 * tubes, a lab open 24 hours, or a walk-in counter of ours anywhere in this
 * district. There is none, and the page says so in plain words.
 *
 * ⚠ SCOPE. We serve the INDIAN side of this district. The copy names Sonauli
 * because it is a town in this district, not to advertise across the border,
 * and it must never promise collection in Nepal.
 *
 * "Diagnostic centre" leads the title because that is what this district types
 * when it wants a place. The page answers that search honestly — with the
 * distance maths and three checkable questions — and never with a boast about
 * being the best. Same rule as content/gopalganj.js and content/lucknow.js.
 *
 * Clinically only the uncontroversial: dengue NS1's 1–5 day window, Widal
 * needing 5–7 days of fever, HbA1c quarterly for a diabetic, urine
 * microalbumin as the earliest diabetic-kidney signal, B12 deficiency being
 * common on a vegetarian diet, TSH repeated 6–8 weeks after a dose change.
 *
 * The AES / Japanese Encephalitis warning is written in this page's own words.
 * This district is named in that belt on /lab-test/gorakhpur too. It tells a
 * parent NOT to book a test and to go to a hospital, and it must never be
 * softened into a booking prompt.
 *
 * ── PRICES ───────────────────────────────────────────────────────────────
 * The rate list appears in the price section, the price FAQ and the Hindi
 * section, and all three must match defaultTests() in src/data/lab/defaults.js.
 *
 * ── SECTION IDS ──────────────────────────────────────────────────────────
 * Every `id` below is an anchor target. Renaming one breaks any link to it
 * silently, with no build error. Grep the id before changing it.
 */

const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_KUSHINAGAR = "/lab-test/kushinagar";
const LAB_AZAMGARH = "/lab-test/azamgarh";

/* The guides that exist under content/blogs/ — checked against real files.
   There is no content/blogs/maharajganj/ yet, so nothing points at one. */
const GUIDE_LAB_TEST = "/blogs/lab-test/deoria";
const GUIDE_PATHOLOGY = "/blogs/pathology-lab/deoria";
const GUIDE_HOME_COLLECTION = "/blogs/home-sample-collection/deoria";
const GUIDE_FULL_BODY = "/blogs/full-body-checkup/deoria";
const GUIDE_DIABETES = "/blogs/diabetes-thyroid-test/deoria";
const GUIDE_LIVER_KIDNEY = "/blogs/liver-kidney-test/deoria";
const GUIDE_VITAMIN = "/blogs/vitamin-b12-d-test/deoria";
const GUIDE_DENGUE = "/blogs/dengue-typhoid-test/deoria";

export const maharajganjContent = [
  {
    id: "lab-test-in-maharajganj",
    h: "Maharajganj Me Lab Test — Ghar Baithe Blood Test Booking Aur Free Home Sample Collection",
    p: [
      "Seedha jawab pehle. Maharajganj jile me routine pathology ke saare test ghar par ho jaate hain — CBC, Blood Sugar, HbA1c, Thyroid Profile (TSH), Lipid Profile, Liver Function Test, Kidney Function Test, Vitamin D, Vitamin B12, Dengue, Urine Routine aur Full Body Checkup. Trained phlebotomist ID card ke saath aapke darwaze par aata hai, sample wahin liya jaata hai, aur routine test ki report 24 ghante ke andar WhatsApp aur email par PDF me aa jaati hai.",
      "Ab wo baat jo is jile me sabse zyada maayne rakhti hai. Yahan jaanch ka asli kharcha test ka daam nahi hai — us tak pahunchne ka safar hai. Collection counter char bazaaron me simte hue hain: Sadar, Nautanwa, Siswa Bazar aur Pharenda (Anand Nagar). Jile ki aabadi ka bada hissa in bazaaron se 25 se 60 kilometre door baitha hai — Nichlaul, Brijmanganj, Laxmipur, Paniyara, Partawal aur Mithaura ki taraf. Ek CBC ke liye subah nikalna, gaadi pakadna, line lagana, aur report ke liye doosre din phir wahi rasta — ye poora din ka kaam hai.",
      "Home sample collection wahi din wapas de deta hai. Aap apna gaon aur block dete hain, subah ka slot chunte hain, aur visit lagbhag 10 minute ki hoti hai. Na kiraya, na khaali pet ka safar, na line, na doosra chakkar, aur na dihadi ka nuksan.",
      "Collection Maharajganj Sadar ke saath Nautanwa, Sonauli, Pharenda (Anand Nagar), Siswa Bazar, Nichlaul, Ghughli, Paniyara, Brijmanganj, Partawal, Laxmipur aur Mithaura jaise kasbon aur unse lage gaon tak hoti hai — poore jile me ek hi rate par. Doctor ka parcha hai to usi panel ke hisaab se booking ho jaati hai.",
    ],
  },

  {
    /* IS PAGE KI LEAD INTENT. "Maharajganj me diagnostic centre" search ka
       jawab yahan hai — aur jawab imaandari se doori ka hisaab hai, kisi
       daawe se nahi. Padrauna ka "best diagnostic centre kaise chunein" wala
       paanch-sawaal section yahan DOBARA nahi likha gaya: wahan reader ke paas
       counter paidal doori par hai, yahan wo 30-50 km door hai. Do alag
       sawaal, do alag jawab — isliye dono page alag rehte hain. */
    id: "diagnostic-centre-maharajganj",
    h: "Maharajganj Me Diagnostic Centre Ya Pathology Lab Dhoondh Rahe Hain?",
    p: [
      "Pehle ek baat saaf: hamara koi walk-in counter is jile me nahi hai — na Sadar me, na Nautanwa me — aur is page par kahin ye nahi likha jaayega ki hai. Ye home collection service hai. Hum aapke ghar se sample lete hain, aur wahi sach hai jo yahan likha hai.",
      "Ab us sawaal ka asli jawab jo aap dhoondh rahe hain. Is jile me \"kaunsa diagnostic centre\" chunna, asal me \"kitna safar\" chunna hai. Counter char bazaaron me hain aur gaon door door. Aur ek baat jo aksar nahi bataayi jaati: chhote collection centre par bhi zyadatar sirf sample liya jaata hai; jaanch badi lab me hoti hai, aam taur par Gorakhpur me, aur report wahin se banti hai. Yaani sample ko safar to karna hi hai. Sawaal sirf itna bachta hai ki us safar ki shuruaat aapke darwaze se ho, ya aapke 40 kilometre chalne ke baad.",
      "Blood aur urine ke saare aam test sirf sample par hote hain, isliye ghar se shuruaat karna kisi tarah kam bharosemand nahi hai — bas ek din bach jaata hai.",
      "Kisi bhi centre par jaayein, teen cheezein poochh lena aapka haq hai, aur ye teeno jaanchi ja sakti hain: poora daam sample lene se pehle bataya jaayega ya baad me; sample lene wale ke paas pehchan-patra hai ya nahi; aur report kitne ghante me milegi, saaf shabdon me. Hamara jawab teenon par likha hua hai — daam confirmation call par, phlebotomist ke paas ID card, aur routine test ki report 24 ghante me. Hum ye nahi kahenge ki hum jile ke sabse achhe hain; wo koi bhi keh sakta hai aur koi bhi jaanch nahi sakta.",
      [
        "Darwaze par kya hota hai aur kaunsa test ghar par ho jaata hai — wo poora ",
        { text: "ghar par sample wali guide", href: GUIDE_HOME_COLLECTION },
        " me hai, aur lab chunne se pehle kya dekhna chahiye wo ",
        { text: "pathology lab wali guide", href: GUIDE_PATHOLOGY },
        " me.",
      ],
      "Jo jaanch ghar par ho hi nahi sakti, uske baare me bhi saaf rehna theek hai: X-ray, sonography, CT, MRI, endoscopy aur biopsy machine aur doctor par hote hain, sample par nahi. Unke liye jaana hi padega, aur hum unhe book karne ka daawa nahi karte.",
    ],
  },

  {
    /* Naam wala section, aur ye is page ki apni zaroorat hai: ek Maharajganj ye
       jila hai, doosra Azamgarh jile ka kasba — jo hamare hi Azamgarh page ki
       areas list me hai. Ise hataiye mat. */
    id: "kaunsa-maharajganj-maharajganj",
    h: "Do Maharajganj Hain — Ye Page Kis Ke Liye Hai",
    p: [
      "Ek uljhan pehle hi door kar dena theek rahega, kyunki is naam ke do alag jagah hain aur dono Uttar Pradesh me hain.",
      "Ye page Maharajganj JILE ke liye hai — wo jila jiska mukhyalaya Maharajganj Sadar hai, jo Gorakhpur se kareeb 50 kilometre uttar padta hai, aur jiski seema Nepal se Sonauli par milti hai. Nautanwa, Pharenda (Anand Nagar), Siswa Bazar, Nichlaul, Ghughli aur Brijmanganj isi jile ke kasbe hain.",
      [
        "Ek doosra Maharajganj Azamgarh jile me bhi hai — wahan ka kasba, ye jila nahi. Aap us taraf rehte hain to aapke liye ",
        { text: "Azamgarh wala page", href: LAB_AZAMGARH },
        " hai; wahan bhi yahi home collection chalti hai aur rate bhi wahi hai. Booking ke waqt jile ka naam likh dena dono taraf uljhan bacha deta hai.",
      ],
      "Aur haan — hamari service is jile ke bharatiya hisse me hai. Sonauli ka naam yahan isliye hai ki wo is jile ka kasba hai, seema paar collection ka daawa hum nahi karte.",
    ],
  },

  {
    /* Border belt ka apna section. Site ke kisi aur page par border nahi hai,
       kyunki koi aur jila seema par nahi hai. */
    id: "nautanwa-sonauli-border-belt-maharajganj",
    h: "Nautanwa Aur Sonauli Ki Taraf — Jinka Din Bhor Se Shuru Hota Hai",
    p: [
      "Nautanwa aur Sonauli ki taraf ka din baaki jile se alag chalta hai. Bazaar, transport aur maal-dhulai ka kaam bhor se shuru ho jaata hai, aur dukaan ya gaadi chhod kar do ghante nikalna seedha nuksan hai. Yahi wajah hai ki is belt me parcha likh jaane ke baad bhi test hafton tak nahi hota — paisa nahi rukta, ghanta rukta hai.",
      "Home visit ke slot subah 6 baje se shuru hote hain, aur is aadat ke liye yahi sabse kaam ka waqt hai. Fasting wala sample kaam shuru hone se pehle ho jaata hai, aap turant naashta kar lete hain, aur din apne samay par chalta hai.",
      "Doosri baat jo is belt me sabse zyada kaam aati hai: report kagaz par nahi, phone par aati hai. Jo log din bhar chalte-phirte hain, ya jinka kaam dono taraf ke bazaaron me hai, unke liye PDF ka matlab ye hai ki report kabhi kho nahi sakti aur kahin se bhi doctor ko bheji ja sakti hai. Purani report bhi phone me sambhaal kar rakhiye — doctor aaj ka number nahi, badlav dekhta hai.",
      "Ghar me ek se zyada log test kara rahe hain to sabki booking ek hi slot me kar dijiye; ek hi visit me sabka sample ho jaata hai. Bujurg hain, bistar par hain, ya diabetic hain jinki nas patli ho gayi hai — ye booking ke waqt bata dijiye, taaki aane wala taiyaari ke saath aaye.",
    ],
  },

  {
    id: "terai-blocks-home-collection-maharajganj",
    h: "Nichlaul, Brijmanganj, Laxmipur Aur Ghughli Tak — Pata Kaise Likhein",
    p: [
      "Sample Maharajganj Sadar ke saath Nautanwa, Sonauli, Pharenda (Anand Nagar), Siswa Bazar, Nichlaul, Ghughli, Paniyara, Brijmanganj, Partawal, Laxmipur aur Mithaura tak liya jaata hai, aur in kasbon se lage gaon bhi aam taur par cover hote hain. Aapka gaon is soochi me naam se nahi hai to maan kar mat baithiye ki service nahi hai — ek call kar lijiye. Cover hota hai to usi call par slot tay ho jaayega, aur nahi hota to hum saaf bata denge, taaki aap intezaar kar ke pareshan na hon.",
      "Is jile me late visit ki sabse badi wajah doori nahi, pata hoti hai. Gaon ka naam akela kaafi nahi hota: tola ya purwa ka naam likhiye, saath me block aur gram panchayat, post office ya thana, aur ek aisa landmark jo har koi jaanta ho — primary school, mandir ya masjid, block office, bank, chini mill, petrol pump ya chauraha. Ek hi naam ke do gaon paas paas hona yahan aam baat hai.",
      "Uttar ki taraf — Nichlaul, Laxmipur aur jangal se lage ilaake — ke liye ek line aur jod dijiye: pahunchne ka rasta kaunsa hai, kis chauraha ya pul se mudna hai. Barsaat ke mahino me Rapti, Rohin aur Chandan ke kinare ke kai link road par paani aa jaata hai aur rasta badalna padta hai. Ye booking ke waqt bata dena poori visit ko aasan kar deta hai, aur slot bhi usi hisaab se rakha jaata hai.",
      "Mobile number wahi dijiye jo us waqt chalu rahega, aur ho sake to ek doosra number bhi likh dijiye. Kai gaon me network ek hi kone me aata hai, aur subah ghar ka aadmi khet ya kaam par nikal jaata hai — phlebotomist ka ek call chhoot jaane se poori visit atak jaati hai.",
    ],
  },

  {
    /* Teesra apna tark: is jile se referral ka ek hi rasta hai. Khalilabad do
       sheher ke beech hai, Siwan teen taraf khinchta hai — yahan sirf Gorakhpur
       hai, aur isi wajah se us ek din ki planning sabse keemti cheez hai. */
    id: "gorakhpur-ke-din-ki-taiyari-maharajganj",
    h: "Gorakhpur Ka Ek Din — Use Teen Din Banne Se Kaise Rokein",
    p: [
      "Is jile ki ek khaas baat hai: aage ka rasta ek hi hai. Specialist, imaging aur bade sansthan — sab Gorakhpur me, kareeb 50 kilometre dakshin. Kisi doosri disha me koi vikalp nahi hai. Isliye yahan Gorakhpur ka din mehnga padta hai, aur usi ek din ko sahi kram me lagana is jile ki sabse kaam ki aadat hai.",
      "Galat kram ye hai, aur sabse aam bhi: subah nikliye, OPD me number lagaiye, doctor test likh de, wahin kisi lab me sample dijiye, report ka intezaar kijiye — ya doosre din phir aaiye. Ek kaam ke liye do ya teen din chale jaate hain, aur kiraya har baar alag lagta hai.",
      "Sahi kram ye hai: jo blood aur urine ke test doctor ne pichhli baar likhe the, ya jo saalana dohrane wale hain, unhe Gorakhpur jaane se ek din pehle ghar par karwa lijiye. Report agli subah tak phone par aa jaati hai. Ab aap OPD me report haath me le kar baithte hain — doctor wahi test dobara nahi likhta, aur ek hi visit me baat aage badh jaati hai.",
      [
        "Jo cheezein sirf machine par hoti hain — MRI, CT, sonography se aage ki jaanch, endoscopy, biopsy — unke liye jaana hi padega, aur unhi ke liye wo din rakhiye. Aap kuch dinon ke liye Gorakhpur me hi ruke hain to wahan bhi yahi service chalti hai: ",
        { text: "Gorakhpur me lab test", href: LAB_GORAKHPUR },
        ". Aur padosi jile ki taraf ke liye ",
        { text: "Kushinagar me lab test", href: LAB_KUSHINAGAR },
        " bhi isi tarah book hota hai.",
      ],
    ],
  },

  {
    /* Ye section booking prompt me kabhi mat badaliye. Is belt ka naam
       /lab-test/gorakhpur ki copy me bhi is chetavani ke saath aata hai. */
    id: "bachchon-me-dimaagi-bukhar-maharajganj",
    h: "Bachche Ko Tez Bukhar Ke Saath Jhatke — Ye Lab Ka Nahi, Aspatal Ka Maamla Hai",
    p: [
      "Gorakhpur–Maharajganj–Kushinagar belt me barsaat ke baad bachchon me dimaagi bukhar (AES / Japanese Encephalitis) ke maamle aate rahe hain. Isliye ye baat is page par kisi kone me nahi, yahan honi chahiye.",
      "Bachche ko tez bukhar ke saath jhatke aayein, behoshi ho, gardan akad jaaye, lagatar ulti ho, ya wo sust pada rahe aur pehchan na paaye — to lab test book mat kijiye. Seedha najdeeki aspatal le jaaiye: jile ka aspatal, ya Gorakhpur ka BRD — jo bhi pahunch me ho, turant. Ismein ek-ek ghanta maayne rakhta hai, aur home collection ka intezaar khatarnak hai.",
      "Blood test in halaat me pehla jawab hai hi nahi. Jo jaanch chahiye hoti hai wo aspatal me hoti hai aur usme waqt ki bandish hoti hai. Ghar par sample lena us jaanch ka vikalp nahi hai, aur hum wo daawa nahi karenge.",
      "Bukhar saada hai — jhatke nahi, behoshi nahi, gardan theek hai — to neeche wala section aapke kaam ka hai: kis din kaunsa test karana chahiye.",
    ],
  },

  {
    id: "bukhar-dengue-typhoid-maharajganj",
    h: "Maharajganj Me Dengue, Typhoid Aur Malaria Test — Bukhar Ke Kis Din Kaunsa",
    p: [
      "July se November ke beech, barsaat utarne ke baad, bukhar ka bojh is jile me sabse bhaari rehta hai — khaas kar un gaon me jahan paani ruk jaata hai. Aur yahan sabse mehngi galti bimari pehchan-ne me nahi hoti, din ginne me hoti hai. Test bilkul sahi hota hai, par galat din par; report negative aa jaati hai, aur ilaaj poora hafta peechhe khisak jaata hai.",
      "Din ka hisaab ye hai. Dengue me NS1 antigen bukhar ke pehle 1 se 5 din tak hi bharosemand hai — paanchve din ke baad wo aksar negative dikhata hai, aur tab IgM antibody karana padta hai. Typhoid me Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye, warna titre badhte hi nahi; aur is belt me typhoid endemic hai, isliye purana infection bhi Widal positive kar sakta hai — sirf usi ek report par ilaaj tay karna theek nahi. Typhidot IgM isse jaldi positive ho jaata hai. Bukhar ke saath thand aur kanpkanpi ho to malaria antigen aur peripheral smear bhi jodwa lijiye. Aur jo bhi karayein, CBC chhodiye mat — girta platelet count wahi ek cheez hai jis par roz nazar rakhi jaati hai.",
      "Bukhar me ghar se nikalna sabse bhaari kaam lagta hai, aur theek isi waqt ghar par sample lena sabse zyada kaam aata hai. Slot subah ka lijiye — bukhar ka panel aksar do-teen din baad dohrana padta hai, aur dono baar ek hi samay ka sample lena behtar rehta hai.",
      [
        "Kis din kaunsa panel lena chahiye, uska poora hisaab ",
        { text: "dengue aur typhoid wali guide", href: GUIDE_DENGUE },
        " me hai.",
      ],
    ],
  },

  {
    id: "sugar-thyroid-hba1c-maharajganj",
    h: "Maharajganj Me Sugar Test, Thyroid Test (TSH) Aur HbA1c — Kis Mahine Kaunsa",
    p: [
      "Ye do test sabse zyada karaye jaate hain aur sabse zyada galat din par bhi. Sugar me Fasting aur PP do alag sample hain — pehla khaali pet, doosra khaana khaane ke theek 2 ghante baad — aur inhe ek maan lena hi sabse aam galti hai. HbA1c in dono se alag cheez hai: ek hi sample me pichhle teen mahine ka ausat, aur uske liye khaali pet rehne ki zaroorat nahi. Isi liye \"aaj ka sugar theek hai\" aur \"teen mahine se sugar theek hai\" ek baat nahi hai, aur dawa doosri par tay hoti hai.",
      "Sugar ka ilaaj chal raha hai to saal ka hisaab yaad rakh lijiye: HbA1c har teen mahine, Lipid Profile saal me ek baar, aur Kidney Function Test saal me ek baar — us KFT ke saath urine microalbumin zaroor jodwaiye. Microalbumin sabse pehle batata hai ki kidney par asar shuru hua hai, aur wahi sabse zyada chhoot jaata hai, kyunki use parche par alag se likhwana padta hai.",
      "Thyroid me Total aur Free do alag panel hote hain: parche par T3/T4/TSH ho to Thyroid Profile, aur FT3/FT4 ho to free wala. Dawa chal rahi ho to dose badalne ke 6 se 8 hafte baad TSH dohraiye, aur uske baad har 6 se 12 mahine me. Do chhoti baatein ismein sabse zyada farak daalti hain — goli sample ke baad leni hai, aur biotin ya multivitamin hormone test se 2–3 din pehle rok dena hai.",
      [
        "Ek aur baat jo is jile me bahut kaam aati hai: ye dohraye jaane wale test hamesha ek hi jagah se karaiye. Aaj Sadar me, agli baar Gorakhpur me, phir kisi teesre counter par — teen alag machine ke number aapas me tulte hi nahi. Poora hisaab ",
        { text: "sugar aur thyroid wali guide", href: GUIDE_DIABETES },
        " me hai.",
      ],
    ],
  },

  {
    id: "lft-kft-vitamin-maharajganj",
    h: "LFT, KFT Aur Vitamin D–B12 Test Maharajganj Me — Kab Karana Chahiye",
    p: [
      "Liver Function Test bilirubin, SGOT aur SGPT dekhta hai. Karana kab chahiye: aankh ya peshab me peelapan, lagatar kamzori, bhookh na lagna, pet ke daayein-upar dard, ya koi dawa jo mahino se chal rahi ho — TB ki dawa, mirgi ki dawa, ya dard ki dawa. Sharaab lete hain to LFT aur Lipid Profile se kam se kam 24 ghante pehle bilkul na lein; ek shaam ki peene se hi triglycerides aur liver enzymes kaafi badh jaate hain aur report bewajah ki ghabrahat de deti hai.",
      "Kidney Function Test me urea, creatinine aur uric acid aate hain, aur iske saath urine routine hona hi chahiye — warna aadhi tasveer milti hai. Sugar ya BP ki dawa chal rahi ho to ye saal me ek baar zaroori hai. Sample se ek din pehle bahut bhaari mehnat mat kijiye, aur paani peete rahiye: paani ki kami me urea aur creatinine dono asli se upar aa jaate hain aur bewajah dar paida karte hain.",
      "Vitamin D aur B12 ke liye khaali pet rehne ki zaroorat nahi hai. Vitamin D ki kami un logon me milti hai jo din bhar andar ya gaadi me rehte hain, aur B12 ki un gharon me jahan khana shudh shakahari hai. B12 ko halka mat leejiye — wo sirf khoon par nahi, nason par asar daalti hai, aur haath-pair me jhunjhuni, sunnpan ya yaaddasht ki dikkat usi ka ishaara ho sakti hai.",
      [
        "Ye chaaron test ek hi sample me ho jaate hain, isliye alag alag din nikaalne ki zaroorat nahi. Kaunsa number kis had ke baad dekhne layak hai wo ",
        { text: "liver aur kidney wali guide", href: GUIDE_LIVER_KIDNEY },
        " me hai, aur vitamin ki kami ki poori baat ",
        { text: "Vitamin B12 aur D wali guide", href: GUIDE_VITAMIN },
        " me.",
      ],
    ],
  },

  {
    id: "full-body-checkup-maharajganj",
    h: "Maharajganj Me Full Body Checkup Package — 45, 72 Aur 88 Parameter Wale Plan",
    p: [
      "Package ki taakat uske parameter number me nahi, uski soochi me hoti hai. Paanch hisse har haal me hone chahiye: khoon ki ginti (CBC), sugar, dil ke liye lipid profile, liver ki jaanch, aur kidney ki jaanch urine routine ke saath. Inke upar thyroid, Vitamin D aur B12 bhi aa jaayein, tab package sach me kuch batata hai.",
      "Teen plan hain. Basic Full Body Checkup — 45 parameter, ₹999 — un logon ke liye theek hai jinki umar kam hai aur abhi koi shikayat nahi; saal ka ek baseline ban jaata hai. Advanced Full Body — 72 parameter, ₹1,999 — me thyroid, HbA1c aur vitamin jud jaate hain, aur 30 se 50 ki umar me yahi sabse sahi baithta hai. Senior Citizen Pack — 88 parameter, ₹2,999 — 55 ke upar walon ke liye hai, jahan dil, haddi aur sugar teenon ek saath dekhe jaate hain.",
      "Chunte waqt daam nahi, apna risk dekhiye. Ghar me sugar ya dil ki bimari chali aa rahi hai to HbA1c, lipid aur kidney ke marker sabse pehle aane chahiye. Aur ek galatfehmi khatam kar lena zaroori hai: package har bimari nahi pakadta. Ye screening hai — chup-chaap badhne wali cheez ko jaldi pakadne ka tarika. Pehle se koi shikayat hai to package ka intezaar mat kijiye; doctor ko dikhaiye aur wahi karaiye jo wo likhe.",
      [
        "Poora package ek hi sample me ho jaata hai aur zyadatar package fasting maangte hain, isliye subah ka slot lijiye. Ghar ke kai log ek saath karaa rahe hain to sabka ek hi slot me book kijiye. Umar aur risk ke hisaab se kaunsa level theek rehta hai, wo ",
        { text: "full body checkup wali guide", href: GUIDE_FULL_BODY },
        " me alag se likha hai.",
      ],
    ],
  },

  {
    id: "lab-test-price-maharajganj",
    h: "Maharajganj Me Lab Test Price Aur Rate List — Kaunsa Test Kitne Ka",
    p: [
      "Jo daam card par likha hai, aapko wahi dena hai — usse ek rupya upar kuch nahi. Ghar se sample lena uske upar muft hai: na visiting charge, na travel charge, na baad me judne wala koi amount. Poora total confirmation call par bata diya jaata hai, sui lagne se pehle.",
      "Rate list ye rahi: Blood Sugar ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1,000, Vitamin B12 ₹1,200 aur Dengue (NS1, IgG, IgM) ₹1,200.",
      "Ek baat is jile ke liye khaas taur par: rate poore jile me ek hi hai. Sadar me jo daam hai, wahi Nichlaul, Brijmanganj, Nautanwa aur Laxmipur me hai. Doori ke naam par kuch nahi badhta, aur ghar se sample lene ka alag charge kahin nahi lagta — jo jile ke door wale blocks ke liye sabse bada farak hai.",
      "Bachat package me sabse zyada hai: Basic Full Body ₹999 me 45 parameter, Advanced Full Body ₹1,999 me 72 parameter, aur Senior Citizen Pack ₹2,999 me 88 parameter. Kuch test, jaise Fever Panel, us waqt ki zaroorat par tay hote hain aur unke card par 'Call for price' likha rehta hai — daam sample dene se pehle bata diya jaata hai. Payment usi waqt hota hai, cash ya UPI se.",
    ],
  },

  {
    id: "fasting-taiyari-maharajganj",
    h: "Sample Dene Se Pehle Kya Karein, Kya Na Karein — Fasting Ke Niyam",
    p: [
      "Khaali pet sirf teen cheezon ke liye rehna padta hai — Fasting Blood Sugar, Lipid Profile, aur zyadatar full body package — aur us dauraan 10 se 12 ghante kuch khana nahi hai. Saada paani band mat kijiye; ulta zaroori hai. Paani kam ho to nas dhoondhna mushkil ho jaata hai, aur haemoglobin, urea tatha creatinine teenon asli se upar dikhte hain. Sabse aasan tarika: raat ka khana 9 baje tak nipta lijiye aur subah 6 se 8 wala pehla slot le lijiye. 14 ghante se aage bhookha rehna koi faayda nahi deta.",
      "Is beech chai bilkul nahi — doodh wali to bilkul hi nahi — aur na biscuit, na toffee, na paan ya gutkha. Ek chai jitni cheez sugar aur lipid dono ke number hila deti hai, aur uska anjaam yahi hota hai ki wahi test dobara dena padta hai.",
      "Aur jinme fasting lagti hi nahi, unke naam par bhookhe rehne ki koi zaroorat nahi: CBC, Thyroid Profile, HbA1c, Vitamin D, Vitamin B12, aur bukhar ke zyadatar panel bina khaali pet ke ho jaate hain.",
      "Rozana ki dawa apne usi samay par leti rahiye, jab tak doctor mana na kare. Ismein do chhoot hain: thyroid ki goli sample ke baad leni hai, pehle nahi; aur biotin ya multivitamin kisi bhi hormone test se 2–3 din pehle rok dena chahiye. Aapki dawaiyon ki list phlebotomist ko bata dena isi liye zaroori hai.",
    ],
  },

  {
    id: "report-maharajganj",
    h: "Report Kab Milegi — 24 Ghante Me WhatsApp Par PDF, Aur Use Kaise Padhein",
    p: [
      "Routine jaanch ki report 24 ghante ke andar aa jaati hai — CBC, sugar, lipid, LFT, KFT, thyroid aur urine routine isi daayre me hain, aur vitamin tatha hormone bhi aam taur par utne hi samay me. Ek hi cheez is niyam se bahar hai: culture. Urine ya blood culture me 48 se 72 ghante lagte hain kyunki organism pehle ugaana padta hai, aur uske baad hi pata chalta hai ki kaun si dawa us par asar karegi. Isse jaldi ka vaada jo bhi kare, wo culture nahi samajh raha.",
      "Report kagaz par nahi, PDF me aati hai — WhatsApp par bhi aur email par bhi. Is jile ke liye iska matlab saaf hai: doctor Sadar me ho, Gorakhpur me ho, ya ghar ka koi vyakti bahar kaam kar raha ho, report bhejne me ek minute lagta hai. Na le jaane ki zaroorat, na kho jaane ka darr.",
      "Number padhte waqt ek hi niyam hai: unhe usi report par chhapi reference range se milaiye, internet par mile kisi chart se nahi. Wo range machine, method, umar aur ling ke saath badalti hai. Ek-do line par \"High\" ya \"Low\" likha aa jaana bahut aam hai aur aksar kisi bimari ka matlab nahi rakhta — wo diagnosis nahi, doctor se poochhne ka ishaara hai. Aur report kisi WhatsApp group me mat daaliye; ye aapki niji jaankari hai.",
      [
        "Kuch result me intezaar nahi karna chahiye, usi din doctor chahiye: dengue me tezi se girta platelet count, bahut zyada sugar ke saath ulti ya susti, bahut kam haemoglobin, ya bahut badha creatinine ke saath peshab kam hona. Numbers ka matlab kya hota hai aur kis flag par ghabrana nahi chahiye, ye ",
        { text: "report kaise padhein wale hisse", href: `${GUIDE_LAB_TEST}#report-kaise-padhein` },
        " me detail me likha hai.",
      ],
    ],
  },

  {
    id: "how-to-book-maharajganj",
    h: "Maharajganj Me Lab Test Kaise Book Karein — Online Form Ya Ek Phone Call",
    p: [
      "Do hi tarike hain. Is page par apna test ya package chun kar form bhar dijiye — naam, mobile number, gaon ya mohalla, block, aur ek landmark — ya seedha phone kar lijiye. Doctor ka parcha ho to uska photo saath rakhiye; panel usi parche ke hisaab se banta hai.",
      "Parche ka photo ek khaas wajah se maanga jaata hai: test ke naam aapas me bahut milte-julte hain. Thyroid Profile ka Total aur Free, sugar ka Fasting aur PP, typhoid ka Widal aur Typhidot, aur KFT ke saath alag se likha urine microalbumin — photo saamne ho to inme galti hoti hi nahi. Parche par sirf \"full body\" likha ho, tab bhi photo bhej dijiye; usme kya-kya aata hai wo call par bata diya jaayega.",
      "Booking ke baad confirmation call aam taur par 30 minute me aa jaati hai, aur usi par teen cheezein tay hoti hain — slot, poora pata, aur fasting chahiye ya nahi. Jo phlebotomist aata hai uske paas ID card hota hai, aur sample dene se pehle use dekh lena aapka haq hai. Poori visit lagbhag 10 minute ki hai, aur payment usi waqt — cash ya UPI se.",
      [
        "Aap is jile ke kisi aise gaon me hain jo is page par naam se nahi likha, to bhi ek call kar ke pooch lijiye — cover hota hai to wahi slot book ho jaayega, aur nahi hota to hum saaf bata denge. Number aur poora pata ",
        { text: "contact page", href: "/contact" },
        " par mil jaayega.",
      ],
    ],
  },

  {
    /* Devanagari section, ek baar. Upar likhi baaton ka anuvaad hai, naya daawa
       nahi — isliye claims kahin bhi alag nahi padte. */
    id: "maharajganj-lab-test-hindi",
    h: "महराजगंज में लैब टेस्ट — घर से सैंपल कलेक्शन की पूरी जानकारी (हिंदी में)",
    p: [
      "महराजगंज ज़िले में खून की जांच के लिए अब गोरखपुर जाने की ज़रूरत नहीं है। सीबीसी, शुगर, एचबीए1सी, थायरॉइड (टीएसएच), लिपिड प्रोफाइल, लिवर और किडनी फंक्शन टेस्ट, विटामिन डी, विटामिन बी12, डेंगू और फुल बॉडी चेकअप — ये सारी जांच सैंपल पर होती हैं, और सैंपल आपके घर से लिया जा सकता है।",
      "होम सैंपल कलेक्शन बिल्कुल मुफ़्त है। आप सिर्फ़ टेस्ट का वही दाम देते हैं जो कार्ड पर लिखा है — कोई विज़िटिंग चार्ज या छिपा हुआ शुल्क नहीं। सुबह 6 बजे से स्लॉट शुरू हो जाते हैं, ताकि खाली पेट वाली जांच काम शुरू होने से पहले हो जाए। रूटीन जांच की रिपोर्ट 24 घंटे में व्हाट्सएप और ईमेल पर पीडीएफ में आ जाती है; कल्चर में 48 से 72 घंटे लगते हैं।",
      "रेट लिस्ट: ब्लड शुगर ₹100, सीबीसी ₹400, थायरॉइड प्रोफाइल ₹550, एचबीए1सी ₹600, लिवर फंक्शन टेस्ट ₹600, किडनी फंक्शन टेस्ट ₹700, लिपिड प्रोफाइल ₹800, विटामिन डी ₹1,000, विटामिन बी12 ₹1,200 और डेंगू ₹1,200। बेसिक फुल बॉडी चेकअप ₹999 में 45 पैरामीटर, एडवांस ₹1,999 में 72 और सीनियर सिटिज़न पैक ₹2,999 में 88 पैरामीटर देता है। पूरे ज़िले में एक ही रेट है।",
      "सैंपल महराजगंज सदर के साथ नौतनवा, सोनौली, फरेंदा (आनंद नगर), सिसवा बाज़ार, निचलौल, घुघली, पनियरा, बृजमनगंज, परतावल, लक्ष्मीपुर और मिठौरा तक लिया जाता है। आपका गाँव इस सूची में न हो तो एक बार फ़ोन कर लीजिए। पता लिखते समय टोला या पुरवा, ब्लॉक और ग्राम पंचायत का नाम, और एक जाना-पहचाना लैंडमार्क ज़रूर डालिए।",
      "हमारा इस ज़िले में कोई वॉक-इन काउंटर नहीं है, और हम यह दावा नहीं करते। यह घर से सैंपल लेने की सेवा है: प्रशिक्षित फ़्लेबोटोमिस्ट आईडी कार्ड के साथ आपके घर आता है, सैंपल आपके सामने लिया जाता है, और पेमेंट उसी समय नकद या यूपीआई से होता है।",
      [
        "बच्चे को तेज़ बुखार के साथ झटके, बेहोशी, गर्दन में अकड़न या लगातार उल्टी हो, तो जांच बुक करने के बजाय सीधे नज़दीकी अस्पताल ले जाइए — यह आपात स्थिति है और इसमें एक-एक घंटा मायने रखता है। कौन सी जांच कब करानी चाहिए, यह ",
        { text: "हमारी गाइड में", href: GUIDE_LAB_TEST },
        " दिया गया है।",
      ],
    ],
  },
];

/**
 * Maharajganj's own FAQs.
 *
 * The generated defaults ask the same seven questions for every city with the
 * name swapped — the duplication that keeps a new page out of the index, and
 * the FAQ block is the part Google is most likely to lift into a rich result,
 * so near-identical answers across cities actively hurt.
 *
 * Three are this district's own and appear nowhere else on the site: the
 * diagnostic-centre question answered as a distance problem, the "which
 * Maharajganj" question, and the Gorakhpur-day sequencing question.
 *
 * The two that decide a booking are placed first — page.js renders the first
 * eight, so this list is exactly eight.
 *
 * The rate line in the first answer must match the price section above AND
 * defaultTests() in src/data/lab/defaults.js.
 */
export const maharajganjFaqs = [
  {
    q: "How much does a lab test cost in Maharajganj, and is home sample collection free?",
    a: "You pay only the price printed on the test card — home sample collection is completely free, with no visiting charge and no hidden fee. Blood Sugar is ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, and the Basic Full Body Checkup starts at ₹999. The rate is the same everywhere in the district: Nichlaul, Brijmanganj or Nautanwa costs no more than Sadar. The total is confirmed on the call before the visit, and payment is taken at collection, by cash or UPI.",
  },
  {
    q: "Which is the nearest diagnostic centre in Maharajganj, and do you have one?",
    a: "We have no walk-in counter anywhere in this district and we do not claim to — this is a home collection service, and a trained phlebotomist comes to your address with an ID card. It is worth knowing what a centre actually is here: the counters are concentrated in four bazaars — Sadar, Nautanwa, Siswa Bazar and Pharenda — and most of them only draw the sample, which then travels to a larger laboratory, usually in Gorakhpur. So choosing a centre in this district is really choosing how far you travel, not where the testing happens. At any centre, ask three things: is the full price told to you before the sample is taken, does the person drawing it carry an ID card, and how many hours until the report.",
  },
  {
    q: "There is a Maharajganj in Azamgarh as well — which one is this page for?",
    a: "This page is for Maharajganj DISTRICT, whose headquarters is Maharajganj Sadar, about 50 km north of Gorakhpur, running up to the Nepal border at Sonauli. Nautanwa, Pharenda (Anand Nagar), Siswa Bazar, Nichlaul, Ghughli and Brijmanganj are towns of this district. The other Maharajganj is a town inside Azamgarh district and is covered on the Azamgarh page, at the same rates. Writing the district name when you book removes the confusion at both ends.",
    links: [{ href: LAB_AZAMGARH, label: "Lab test in Azamgarh" }],
  },
  {
    q: "Which areas of Maharajganj district do you cover for home blood test collection?",
    a: "Maharajganj Sadar along with Nautanwa, Sonauli, Pharenda (Anand Nagar), Siswa Bazar, Nichlaul, Ghughli, Paniyara, Brijmanganj, Partawal, Laxmipur and Mithaura, and the villages adjoining them, are usually covered. If your village is not named here, please call anyway — if it is covered the slot is booked on the same call, and if it is not we will say so plainly rather than let you wait. Include the tola or purwa, the block and gram panchayat, the post office or police station, and one landmark; two villages of the same name close together is common here. Our service is on the Indian side of the district — we do not collect samples across the border.",
  },
  {
    q: "I have to go to Gorakhpur to see a specialist — should I get the blood tests done there?",
    a: "Get them done at home the day before instead. Everything from this district funnels to Gorakhpur, about 50 km south, and the usual sequence wastes it: you travel, wait in the OPD, the doctor prescribes tests, you give the sample there, and then you either wait for the report or come back another day. If the blood and urine tests are already done at home, the report is on your phone by the next morning and you sit down in front of the doctor with it in hand. Only the machine-based investigations — MRI, CT, endoscopy, biopsy — genuinely need that trip.",
    links: [{ href: LAB_GORAKHPUR, label: "Lab test in Gorakhpur" }],
  },
  {
    q: "Can a sample be taken at home for an elderly or bedridden patient?",
    a: "Yes, and in a district this spread out they are the people it helps most. Please describe the patient's condition when booking — elderly, bedridden, recovering after an operation, diabetic with veins that have become difficult, or a history of trouble during an earlier draw — so that whoever comes arrives prepared and a second prick is avoided. Give a little water beforehand unless the fasting instructions say otherwise, since dehydration genuinely makes a vein hard to find. If several people in the house are being tested, book them into one slot and all the samples are taken in a single visit.",
  },
  {
    q: "My child has a high fever with seizures — should I book a lab test?",
    a: "No. A high fever with seizures, unconsciousness, a stiff neck, repeated vomiting or extreme drowsiness needs the nearest hospital immediately — the district hospital, or BRD in Gorakhpur, whichever you can reach. This is an emergency and every hour counts. The Gorakhpur–Maharajganj–Kushinagar belt has seen cases of acute encephalitis syndrome (AES / Japanese Encephalitis) in children after the monsoon, and waiting for a home collection is dangerous. A blood test is not the first answer here at all.",
  },
  {
    q: "Which tests need fasting, and how soon does the report arrive?",
    a: "Fasting Blood Sugar, Lipid Profile and most Full Body Checkup packages need 10 to 12 hours without food; plain water is allowed and is important, but tea, milk, a biscuit or a toffee are not — one cup of tea is enough to change the result. CBC, Thyroid Profile, HbA1c, Vitamin D and B12 need no fasting at all, so there is no reason to go hungry for them. Routine reports are sent within 24 hours as a PDF on WhatsApp and email, often the same evening when the sample is drawn early. Cultures are the exception at 48 to 72 hours, because the organism has to be grown before it can be tested against a medicine.",
    links: [{ href: GUIDE_LAB_TEST, label: "Which test, and when — a guide" }],
  },
];
