/**
 * Long-form SEO copy for /lab-test/deoria.
 *
 * WHY THIS FILE EXISTS AND NOT A TEMPLATE. Google does not index a page that is
 * another page with one noun swapped — it treats it as a doorway page. Before
 * this file, /lab-test/deoria rendered Varanasi's copy with "Deoria" pasted in,
 * so the page told readers that Deoria is Purvanchal's healthcare centre and
 * that we collect samples at Assi Ghat, Sarnath, DLW and the Babatpur airport
 * route. All of that is Varanasi. None of it is true here.
 *
 * So this is written from Deoria's own situation, and it deliberately argues
 * the OPPOSITE case to Varanasi's page. Varanasi's pitch is "the labs are here,
 * skip the queue". Deoria's is "the big labs are not here, skip the journey" —
 * a genuinely different reader with a genuinely different problem.
 *
 * ── Claims and their sourcing ────────────────────────────────────────────
 * Service claims are kept to the four the operation actually confirms (see the
 * warning above defaultFaqs in src/data/lab/defaults.js): free home collection,
 * a trained phlebotomist carrying an ID card, slots from 6 AM, reports in 24
 * hours, cash/UPI on collection. Cold-chain transport, barcode tracking and
 * sealed single-use needles are NOT claimed here — they are unverified, and the
 * Varanasi copy's use of them is a known inconsistency, not a precedent.
 *
 * NOT CLAIMED, deliberately, however well it would rank: "24 hour lab in
 * Deoria". Collection runs 6 AM–9 PM (see openingHours in the page's schema),
 * so the page says "report 24 ghante me" — which is true — and never "24 ghante
 * khula lab", which is not. A keyword is not worth a claim the operation
 * cannot keep.
 *
 * Geographic and epidemiological statements are hedged where they are general
 * knowledge rather than measured fact ("kareeb", "aam taur par"). The two worth
 * a second look before a big push are the Gorakhpur distance and the AES
 * paragraph — see the notes in README terms in the commit message.
 *
 * ── How the keywords are placed ──────────────────────────────────────────
 * One primary term per page ("lab test in Deoria" / "Deoria me lab test"),
 * carried by the URL, the H1, the title and the lead section. Everything else
 * is a SEPARATE heading, because a heading ranks and a keyword buried in a
 * paragraph mostly does not: pathology lab / diagnostic centre, dengue-typhoid-
 * malaria, CBC, sugar-HbA1c-thyroid, full body checkup, price/rate list. Each
 * appears in ONE H2 and then reads as normal prose — repeating "lab test in
 * Deoria" in every heading is the stuffing that Google demotes, not what it
 * rewards.
 *
 * ── Internal links ───────────────────────────────────────────────────────
 * The paragraph parts of the form { text, href } render as real in-prose links
 * (see LabContent). They are placed only where the sentence genuinely leads
 * somewhere — after the test comes the prescription, so those links point at
 * /medicine-delivery/<town>; the Gorakhpur/Varanasi paragraph points at the
 * other lab city. Every href here must be a route that exists:
 *   /medicine-delivery/{deoria,salempur,barhaj,lar,bhatni}   (medicine cityData)
 *   /lab-test/varanasi                                       (lab cities)
 *   /blogs/{online-medicine-delivery,medicine-home-delivery,buy-medicines-online}/deoria
 *   /contact
 */

/* Link targets used below. Kept as constants so a route rename is a one-line
   fix here instead of a hunt through the prose — and so a typo shows up as
   `undefined` in the href rather than as a silent 404 in production. */
const MEDICINE_DEORIA = "/medicine-delivery/deoria";
const MEDICINE_SALEMPUR = "/medicine-delivery/salempur";
const MEDICINE_BARHAJ = "/medicine-delivery/barhaj";
const MEDICINE_LAR = "/medicine-delivery/lar";
const MEDICINE_BHATNI = "/medicine-delivery/bhatni";
const LAB_VARANASI = "/lab-test/varanasi";

export const deoriaContent = [
  {
    id: "lab-test-in-deoria",
    h: "Deoria Me Lab Test — Ghar Baithe Blood Test Booking Aur Free Home Sample Collection",
    p: [
      "Deoria ki sabse badi dikkat test karana nahi, test ke liye safar karna hai. Zila mukhyalaya par district hospital aur kai private clinic hain, lekin bade multi-speciality diagnostic setup zyadatar Gorakhpur me hain, jo yahan se kareeb 55–60 kilometre door hai. Nateeja ye hota hai ki ek CBC ya thyroid ke liye bhi log subah bus ya train pakadte hain, khaali pet do-teen ghante safar karte hain, sample dete hain, aur report lene phir ek din jaate hain. Ek test, do trip, poora din.",
      "Home sample collection is poore chakkar ko khatam kar deta hai. Aap Deoria me apne ghar ka pata dete hain, subah ka slot chunte hain, aur trained phlebotomist ID card ke saath aapke darwaze par aata hai. Sample wahin liya jaata hai aur report 24 ghante me WhatsApp aur email par PDF me aa jaati hai — na bus ka kiraya, na khaali pet ka safar, na report lene ke liye doosra din.",
      "Yahan routine pathology ke saare test aur checkup package book hote hain — CBC, Thyroid Profile, Blood Sugar, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test, Vitamin D, Vitamin B12, Dengue aur Full Body Checkup. Doctor ne parcha likh diya hai to usi panel ke hisaab se booking ho jaati hai; agar koi test is page par nahi dikh raha to prescription ke saath call kar lijiye.",
    ],
  },

  {
    // "pathology lab in Deoria" aur "diagnostic centre in Deoria" — dono ki
    // apni search demand hai aur dono ka intent ek hi hai: jaanch kahan hogi.
    // Isliye ek alag heading, aur us par seedha jawab.
    id: "pathology-lab-diagnostic-centre-deoria",
    h: "Deoria Me Pathology Lab Ya Diagnostic Centre Dhoondh Rahe Hain?",
    p: [
      "Zyadatar log \"Deoria me pathology lab\", \"diagnostic centre Deoria\" ya \"lab test near me\" isliye search karte hain kyunki unhe ye jaanna hai ki sample kahan dena padega. Iska jawab aaj seedha hai: routine pathology ke liye aapko kahin jaana hi nahi hai. Blood aur urine ke saare aam test sirf sample par hote hain, aur sample aapke ghar par liya ja sakta hai — Deoria Sadar ho, koi mohalla ho ya jile ka koi kasba.",
      "Sample lene ka kaam trained phlebotomist karta hai, ID card ke saath, aapke saamne. Home visit ke slot subah 6 baje se shuru hote hain aur shaam tak chalte hain, isliye fasting wale test subah aur baaki test din me kabhi bhi ho jaate hain. Report 24 ghante ke andar WhatsApp aur email par PDF me aati hai. Ek baat saaf rakhiye — hum 24 ghante khula lab hone ka daawa nahi karte; 24 ghante report milne ka karte hain.",
      "Lab chunte waqt do cheezein poochhne layak hoti hain: report par test ka method likha hai ya nahi, aur repeat test har baar usi jagah se ho raha hai ya nahi. Alag alag machine aur method ke reference range thode alag hote hain, isliye ek jagah TSH 4.5 aur doosri jagah 4.1 aane ka matlab ye nahi ki aapka thyroid badal gaya. Jo cheez aap mahino tak track karte hain — HbA1c, TSH, creatinine, haemoglobin — usme consistency utni hi zaroori hai jitna khud ka number.",
    ],
  },

  {
    id: "home-sample-collection-deoria",
    h: "Deoria Jile Me Home Sample Collection — Sadar, Rudrapur, Barhaj, Salempur, Bhatpar Rani Aur Lar",
    p: [
      "Collection Deoria Sadar ke saath saath jile ke kasbon me bhi hoti hai — Rudrapur, Barhaj, Salempur, Bhatpar Rani, Gauri Bazar, Baitalpur, Lar aur Bhatni. Aap in kasbon ke aas paas ke gaon me rehte hain aur sure nahi hain ki aapka address cover hota hai ya nahi, to booking se pehle ek call kar lijiye; hum saaf bata denge, taaki aap intezaar kar ke pareshan na hon.",
      "Deoria ke pate sheher jaise nahi hote. Yahan house number aur sector se zyada kaam landmark karta hai — school, mandir, bank, petrol pump, block office, chauraha. Booking form me apna gaon ya mohalla likhne ke saath ek landmark zaroor daaliye aur mobile number chalu rakhiye. Zyadatar late visit ki wajah galat pata hoti hai, na ki phlebotomist ka na aana.",
      "Fasting wale test ke liye subah 6 baje se slot shuru hote hain. Iska faayda gaon-kasbe me sheher se zyada hai: kheti ya dukaan ka kaam subah hi shuru ho jaata hai, aur 10–12 ghante khaali pet rehne ke baad koi din bhar bhookha nahi baith sakta. Jaldi wala slot lijiye, sample dijiye, aur turant naashta kar lijiye.",
      "Ghar me ek se zyada log test kara rahe hain — maa-baap, dada-dadi, bachche — to sabki booking ek hi slot me kar dijiye. Ek hi visit me sabka sample ho jaayega. Agar koi bujurg hai, bistar par hai, diabetic hai jinki nas patli ho gayi hai, ya operation ke baad recovery kar raha hai, to ye booking ke waqt bata dijiye.",
      [
        "Inhi kasbon me dawa bhi ghar tak pahunchti hai, isliye test ke baad parche ki dawa ke liye dobara bazaar jaane ki zaroorat nahi — ",
        { text: "Salempur me medicine delivery", href: MEDICINE_SALEMPUR },
        ", ",
        { text: "Barhaj me medicine delivery", href: MEDICINE_BARHAJ },
        ", ",
        { text: "Lar me medicine delivery", href: MEDICINE_LAR },
        " aur ",
        { text: "Bhatni me medicine delivery", href: MEDICINE_BHATNI },
        " — sab isi jile me chalti hai.",
      ],
    ],
  },

  {
    id: "gorakhpur-travel-deoria",
    h: "Gorakhpur Jaane Ki Zaroorat Kab Hai Aur Kab Nahi",
    p: [
      "Har cheez ke liye Gorakhpur jaana zaroori nahi hai. Routine pathology — blood count, sugar, thyroid, liver, kidney, lipid, vitamin, urine routine, bukhar ka panel — sample par hoti hai, aur sample kahin se bhi liya ja sakta hai. In sabke liye ghar par sample dena aur report phone par lena bilkul kaafi hai.",
      "Gorakhpur ya Varanasi jaana tab banta hai jab baat imaging ya specialist procedure ki ho — MRI, CT scan, angiography, endoscopy, biopsy, ya kisi super-speciality doctor ki OPD. Ye machine aur doctor par hote hain, sample par nahi, isliye inka koi home option hota hi nahi.",
      [
        "Isliye seedha faisla ye hai: parche par sirf blood aur urine ke test likhe hain to ghar par karaiye. Parche par scan ya procedure likha hai to safar ki planning kijiye — aur us trip se pehle blood test ghar par karwa lijiye, taaki specialist ke paas jaate waqt report pehle se haath me ho aur ek visit me baat ban jaaye. Kisi ka ilaaj Varanasi me chal raha hai to wahan bhi yahi suvidha hai — ",
        { text: "Varanasi me lab test aur home sample collection", href: LAB_VARANASI },
        " usi tarah book hota hai.",
      ],
    ],
  },

  {
    id: "fever-season-deoria",
    h: "Deoria Me Dengue, Typhoid Aur Malaria Test — Bukhar Me Kaunsa Test Kis Din",
    p: [
      "Jile me bukhar ka bojh July se November ke beech sabse zyada rehta hai. Monsoon ke baad khet aur gaon me jama paani, cooler aur chhat ki tanki ka paani, aur nichle ilaakon me jal-bharav — ye sab machhar ke liye maakool haalat bana dete hain. Sabse aam galti ye hoti hai ki test galat din par karaya jaata hai, jisse sahi ilaaj hafta bhar late ho jaata hai.",
      "Dengue me din ginna sabse zaroori hai. NS1 antigen sirf bukhar ke pehle 1 se 5 din tak bharosemand hai; paanchve din ke baad wo aksar negative aa jaata hai aur tab IgM antibody karana padta hai. Doosre din IgM ya aathve din NS1 karayenge to dengue hone ke bawajood report negative aa sakti hai. Dono me se jo bhi ho, saath me CBC zaroor karaiye — girta platelet count hi wo cheez hai jo roz dekhi jaati hai.",
      "Typhoid me Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye, warna titre badhte hi nahi. Is ilaake me typhoid endemic hai, isliye purane infection se bhi Widal positive aa sakta hai — sirf Widal par ilaaj tay karna theek nahi. Typhidot IgM jaldi positive hota hai aur pehle hafte me blood culture sabse pakka jawab deta hai. Bukhar me thand aur kanpkanpi ho to malaria antigen aur peripheral smear jodiye.",
      "Ek zaroori chetavani. Gorakhpur–Deoria–Kushinagar belt me barsaat ke baad bachchon me dimaagi bukhar (AES / Japanese Encephalitis) ke maamle aate rahe hain. Agar bachche ko tez bukhar ke saath jhatke aayein, behoshi ho, gardan akad jaaye, lagatar ulti ho ya wo sust pada rahe — to lab test book mat kijiye. Seedha najdeeki hospital le jaaiye. Ye emergency hai aur ismein ek-ek ghanta maayne rakhta hai; blood test iska pehla jawab nahi hai, aur home collection ka intezaar khatarnak hai.",
    ],
  },

  {
    id: "flood-water-diseases-deoria",
    h: "Baadh Ke Baad Jaundice Aur Typhoid — Deoria Me LFT Aur Hepatitis Ki Jaanch",
    p: [
      "Deoria jile se Ghaghara (Saryu), Rapti aur Chhoti Gandak guzarti hain, aur barsaat me nadi kinare ke ilaakon me paani bharna aam baat hai. Barhaj jaise kasbe nadi ke bilkul paas padte hain. Baadh ke baad peene ka paani ganda hone ka khatra sabse zyada hota hai — handpump doob jaate hain, kuwein me gandagi mil jaati hai, aur wahi paani ghar tak pahunchta hai.",
      "Iska seedha asar do bimariyon me dikhta hai: typhoid aur jaundice. Paani se failne wale Hepatitis A aur Hepatitis E baadh ke baad wale mahino me badh jaate hain. Aankhon aur peshab ka peela hona, bhookh khatam ho jaana, ulti jaisa lagna aur bahut kamzori — in sab par Liver Function Test (total aur direct bilirubin ke saath), Hepatitis A IgM aur Hepatitis E IgM karana chahiye.",
      "Garbhwati mahila ko jaundice ho to bilkul der mat kijiye, turant doctor ko dikhaiye. Hepatitis E pregnancy me aam logon ke muqable kahin zyada khatarnak hota hai, aur ismein intezaar karna theek nahi.",
      "Baadh ke baad lagatar dast, pet dard ya bukhar ho to Urine Routine aur Stool Routine bhi kaam ke test hain. Aur ilaaj ke saath saath ek behad saada cheez sabse zyada bachati hai — paani ubaal kar peena, khaas kar jab tak paani ka source theek na ho jaaye.",
    ],
  },

  {
    id: "anaemia-women-children-deoria",
    h: "Deoria Me CBC Test Aur Khoon Ki Kami (Anaemia) — Sabse Zyada Chhoot Jaane Wali Jaanch",
    p: [
      "Purvi Uttar Pradesh me khoon ki kami sabse aam aur sabse zyada nazarandaaz ki jaane wali samasya hai — khaas kar auraton, kishori ladkiyon aur chhote bachchon me. Lakshan itne dheere aate hain ki log unhe kamzori ya 'kaam ki thakan' samajh lete hain: hamesha thakan, chakkar, saans phoolna, chehre aur nakhun ka peelapan, dhyan na lagna.",
      "Pehla test CBC hai, jo haemoglobin ke saath RBC ka size aur shape bhi batata hai — aur yahi se pata chalta hai ki kami iron ki hai ya vitamin ki. Haemoglobin kam nikle to sirf iron ki goli shuru kar dena adhoora ilaaj hai. Aage ferritin, Vitamin B12 aur folate karana chahiye, kyunki B12 ki kami me iron dene se faayda nahi hota.",
      "Pregnancy me ye aur zaroori ho jaata hai. Har trimester me kam se kam ek baar CBC dohraiye. Haemoglobin 11 g/dL se neeche ho to wajah pakadna zaroori hai, sirf goli shuru karna kaafi nahi.",
      "Ghar me shudh shakahari khana chalta hai — jo is ilaake ke bahut se gharon me hai — to Vitamin B12 ki kami itni common hai ki use saal me ek baar hone wale panel me jagah milni hi chahiye. B12 ki kami sirf khoon nahi, nason par bhi asar daalti hai: haath-pair me jhunjhuni, sunnpan aur yaaddasht ki dikkat.",
    ],
  },

  {
    id: "migrant-workers-checkup-deoria",
    h: "Bahar Kaam Karne Walon Ka Full Body Checkup — Ghar Aane Par Ek Baar",
    p: [
      "Deoria jile se bahut bade paimane par log kaam ke liye bahar rehte hain — Mumbai, Delhi, Punjab, Gujarat aur khadi desh. Saal me ek ya do baar hi ghar aana hota hai, aur usi chhutti me shaadi, khet, rishtedaari sab nipatana hota hai. Sehat ki jaanch hamesha aakhri number par chali jaati hai, aur aksar ho hi nahi paati.",
      "Isi wajah se ghar par sample dena in logon ke liye sabse aasan tarika hai. Chhutti ke pehle ya doosre din subah ka slot lijiye — ek visit, 10 minute, aur report chhutti khatam hone se pehle haath me. Ek baseline report saath rakhne ka faayda ye hai ki agli baar number badla to pata chal jaata hai.",
      "Wapas aane par jo panel aam taur par sabse kaam ka rehta hai: CBC, Blood Sugar (fasting aur PP) ya HbA1c, Lipid Profile, Liver Function Test aur Kidney Function Test, aur Vitamin D tatha B12. Jo log bahar lambi shift, kam dhoop aur bahar ka khana jhelte hain, unme vitamin ki kami aur badha hua lipid bahut aam milta hai.",
      [
        "Agar bahar rehte hue lagatar bukhar, wazan girna, khaansi ya peeliyapan raha ho, to ye baat booking ke waqt zaroor bataiye aur doctor ko bhi. Aise me sirf routine package kaafi nahi hota, alag se jaanch chahiye hoti hai. Aur ghar par ma-baap ki regular dawa chal rahi hai to wapas jaane se pehle ",
        { text: "Deoria me online medicine delivery", href: MEDICINE_DEORIA },
        " set kar dijiye — parcha bhej dene par dawa ghar tak pahunch jaati hai.",
      ],
    ],
  },

  {
    id: "diabetes-thyroid-screening-deoria",
    h: "Deoria Me Sugar Test, HbA1c Aur Thyroid Test (TSH) — Kis Umar Me Kya Karana Chahiye",
    p: [
      "Diabetes ab sirf sheher ki bimari nahi rahi; kasbon aur gaon me bhi utni hi tezi se badh rahi hai, aur bahut logon ko tab tak pata nahi chalta jab tak koi complication saamne na aa jaaye. 30 saal ke baad, ya pehle hi agar ghar me kisi ko diabetes hai, pet ke aas paas wazan zyada hai, ya pregnancy me sugar badha tha — to saal me ek baar Fasting Blood Sugar aur HbA1c karana chahiye.",
      "Ye lakshan dikhein to saal khatam hone ka intezaar mat kijiye: bahut pyaas lagna, raat me baar baar peshab, ghaav ka der se bharna, aankhon se dhundhla dikhna, ya bina koshish ke wazan girna. HbA1c ka ek bada faayda ye hai ki ismein fasting ki zaroorat nahi hoti — jinka khaane ka koi fix time nahi hai, unke liye yahi sabse aasan aur bharosemand test hai.",
      "Jinhe pehle se diabetes hai, unka saal bhar ka plan seedha sa hai: har teen mahine me HbA1c, saal me ek baar Lipid Profile, aur saal me ek baar Kidney Function Test ke saath urine microalbumin. Microalbumin sabse pehla ishaara deta hai ki kidney par asar shuru ho raha hai — aur yahi test log sabse zyada chhodte hain.",
      "Thyroid ke liye ek baar TSH un sabko karana chahiye jinko lagatar thakan hai, baal jhad rahe hain, periods gadbad hain, wazan bina wajah badh ya ghat raha hai, ya jo pregnancy plan kar rahi hain. Thyroid ki dawa pehle se chal rahi hai to dose badalne ke 6 se 8 hafte baad TSH dohraiye, uske baad har 6 se 12 mahine me.",
    ],
  },

  {
    id: "full-body-checkup-deoria",
    h: "Deoria Me Full Body Checkup Package — 45, 72 Aur 88 Parameter Wale Plan",
    p: [
      "Achha full body checkup parameter ki ginti se nahi, coverage se tay hota hai. Kam se kam paanch cheezein aani chahiye: blood count (CBC), sugar, heart ke liye lipid profile, liver function, aur kidney function ke saath urine routine. Iske upar thyroid, Vitamin D aur B12 jud jaayein to package se sach me kuch pata chalta hai.",
      "Basic Full Body Checkup (45 parameter, ₹999) un logon ke liye theek hai jinki umar kam hai aur koi shikayat nahi — saal ka ek baseline ban jaata hai. Advanced Full Body (72 parameter, ₹1,999) me thyroid, HbA1c aur vitamins jud jaate hain; 30 se 50 saal ke logon ke liye yahi sabse sahi baithta hai. Senior Citizen Pack (88 parameter, ₹2,999) 55 saal ke upar ke liye hai, jismein heart, haddi aur sugar ki screening ek saath hoti hai.",
      "Package apne risk ke hisaab se chuniye, price ke hisaab se nahi. Ghar me diabetes ya dil ki bimari ki history hai to HbA1c, lipid aur kidney markers ko priority dijiye. Din bhar andar kaam karte hain aur dhoop kam milti hai to Vitamin D aur B12 zyada zaroori hain. Aur 55 ke baad haddi tatha sugar ki screening ko har saal dohrana chahiye, ek baar kara ke chhod dena nahi.",
      "Poora package ek hi sample me ho jaata hai aur zyadatar package fasting maangte hain, isliye subah ka slot lijiye. Ghar ke kai log ek saath karaa rahe hain to sabka ek hi slot me book kijiye.",
    ],
  },

  {
    id: "lab-test-price-deoria",
    h: "Deoria Me Lab Test Price Aur Rate List — Kaunsa Test Kitne Ka",
    p: [
      "Is page par har card par jo price likha hai, wahi aapko dena hai. Home sample collection uske upar free hai — na koi visiting charge, na travel charge, na koi hidden fee. Yahi wajah hai ki bahar se dekhne me price alag alag lagne par bhi asli kharcha ghar par karane me kam padta hai: bus ya auto ka kiraya dono taraf ka, aur report lene ka doosra chakkar, sab bach jaata hai.",
      "Deoria ki rate list ise tarah hai: Blood Sugar ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1,000, Vitamin B12 ₹1,200 aur Dengue (NS1, IgG, IgM) ₹1,200.",
      "Package me bachat sabse zyada hoti hai. Basic Full Body ₹999 me 45 parameter deta hai — wahi test alag alag karane par kharcha kai guna ho jaata hai. Advanced ₹1,999 me 72 parameter aur Senior Citizen Pack ₹2,999 me 88 parameter deta hai.",
      "Kuch test, jaise Fever Panel (malaria, typhoid, dengue ek saath), price par nahi balki us waqt ki zaroorat par tay hote hain — unke card par 'Call for price' likha rehta hai. Aise me phone par pooch lijiye, sample dene se pehle price bata diya jaata hai. Payment sample lene ke waqt hi hota hai — cash ya UPI se, PhonePe, Google Pay ya Paytm.",
    ],
  },

  {
    id: "prepare-for-test-deoria",
    h: "Sample Dene Se Pehle Kya Karein, Kya Na Karein — Fasting Ke Niyam",
    p: [
      "Fasting wale test — Fasting Blood Sugar, Lipid Profile aur zyadatar full body package — me 10 se 12 ghante kuch nahi khana hota. Saada paani peena mana nahi hai, balki zaroori hai: paani ki kami se nas dhoondhna mushkil ho jaata hai aur haemoglobin, urea tatha creatinine jhoothe taur par badhe hue aate hain. Raat ka khana 9 baje tak khatam kar lijiye aur subah 6 se 8 baje ka slot lijiye. 14 ghante se zyada bhookhe rehna faayda nahi, nuksan karta hai.",
      "Fasting sample se pehle chai, doodh wali chai, biscuit, toffee ya gutkha — kuch bhi nahi. Ek chai bhi sugar aur lipid ki report badal deti hai, aur phir wahi test dobara karana padta hai. Sirf saada paani.",
      "Lipid Profile ya Liver Function Test se kam se kam 24 ghante pehle sharaab bilkul na lein — ek shaam ki peene se hi triglycerides aur liver enzymes kaafi badh jaate hain. Kidney function ya CPK karana ho to ek din pehle bahut bhaari mehnat ya gym avoid kijiye.",
      "Dawa ka aam niyam ye hai ki apni rozana ki goliyan usi samay lijiye, jab tak doctor mana na kare. Do exception hain: thyroid ki goli sample dene ke baad leni chahiye, aur biotin ya multivitamin kisi bhi hormone test se 2 se 3 din pehle band kar dena chahiye. Phlebotomist ko bata dijiye ki aap kaun kaun si dawa le rahe hain, aur doctor ka parcha saamne rakhiye taaki wahi panel liya jaaye jo likha hai.",
    ],
  },

  {
    id: "reports-deoria",
    h: "Report Kab Milegi — 24 Ghante Me WhatsApp Par PDF, Aur Use Kaise Padhein",
    p: [
      "Zyadatar routine test ki report 24 ghante ke andar aa jaati hai — CBC, sugar, lipid, LFT, KFT, thyroid aur urine routine. Vitamin aur hormone me aam taur par utna hi samay lagta hai. Culture jaan boojh kar dheere hote hain: urine ya blood culture me 48 se 72 ghante lagte hain, kyunki pehle organism ko ugana padta hai aur uske baad hi ye pata chalta hai ki kaunsi dawa asar karegi. Isse jaldi ka vaada koi bhi lab imaandari se nahi kar sakta.",
      "Report WhatsApp aur email dono par PDF me aati hai. Iska ek bada faayda Deoria jaise jile me ye hai ki report seedhe phone par rehti hai — Gorakhpur ya Lucknow ke doctor ko dikhana ho to bas forward kar dijiye, kagaz le kar jaane ki zaroorat nahi. Purani report bhi phone me sambhal kar rakhiye; doctor ko badlav dekhna hota hai, sirf aaj ka number nahi.",
      "Number ko report par chhape reference range se hi milaiye, internet ke kisi chart se nahi. Range machine aur method ke hisaab se badalti hai, aur umar tatha ling ke hisaab se bhi. Thoda sa high ya low hona bahut aam hai aur aksar koi bimari nahi hoti — ye diagnosis nahi, doctor se poochne ka ishaara hai.",
      [
        "Kuch result me intezaar nahi karna chahiye, usi din doctor chahiye: dengue me tezi se girta platelet count, bahut zyada sugar ke saath ulti ya susti, bahut kam haemoglobin, ya bahut badha creatinine ke saath peshab kam hona. Tabiyat kharab lag rahi ho to kisi ke phone ka intezaar mat kijiye, seedha dikhaiye. Report ke baad doctor ne dawa likh di ho to wo bhi ",
        { text: "Deoria me ghar tak medicine delivery", href: MEDICINE_DEORIA },
        " se mangwa sakte hain — parche ka photo bhejiye, dawa ghar par aa jaayegi.",
      ],
    ],
  },

  {
    id: "how-to-book-deoria",
    h: "Deoria Me Lab Test Kaise Book Karein — Online Form Ya Ek Phone Call",
    p: [
      "Is page par apna test ya package chuniye aur booking form bhar dijiye — naam, mobile number, apna ilaaka aur landmark. Ya phir seedha phone kar dijiye; agar doctor ka parcha hai to usi ke hisaab se panel book kar diya jaata hai. Parche ka photo saath rakhiye, kyunki kai test ke naam milte julte hote hain, jaise Thyroid Profile Total aur Free.",
      "Slot chunte waqt dhyan rakhiye ki fasting wale test subah ke slot me hi karaane hain. Booking confirm hone ke baad phlebotomist aam taur par 60 minute ke andar pahunch jaata hai. Aane wale ke paas ID card hota hai — sample dene se pehle use dekh lijiye, ye aapka haq hai.",
      "Poori visit lagbhag 10 minute ki hoti hai. Payment usi waqt hota hai, cash ya UPI se. Uske baad aapko kuch karna nahi hai — report taiyaar hone par WhatsApp aur email par PDF khud aa jaayegi.",
      [
        "Ek aakhri baat: agar aap Deoria jile ke kisi aise gaon me hain jo is page par naam se nahi likha, to maan kar mat baithiye ki service nahi hai. Ek call kar ke pooch lijiye — cover hota hai to wahi slot book ho jaayega, aur nahi hota to hum saaf bata denge. Number aur poora pata ",
        { text: "contact page", href: "/contact" },
        " par mil jaayega.",
      ],
    ],
  },

  {
    /* Devanagari section, ek baar.
       Deoria me bahut si search Hindi me type hoti hai — "देवरिया में लैब टेस्ट",
       "खून की जांच", "रेट लिस्ट". Poore page ko transliterate karna galat hota:
       baaki copy Hinglish me hai aur wahi log padhte hain. Ek alag section me
       Devanagari rakhna dono cover kar deta hai — aur ye upar likhi baaton ka
       anuvaad hai, naya daawa nahi, isliye claims kahin bhi alag nahi padte. */
    id: "deoria-lab-test-hindi",
    h: "देवरिया में लैब टेस्ट — घर से सैंपल कलेक्शन की पूरी जानकारी (हिंदी में)",
    p: [
      "देवरिया में खून की जांच के लिए अब गोरखपुर जाने की ज़रूरत नहीं है। सीबीसी, थायरॉइड, शुगर, एचबीए1सी, लिपिड प्रोफाइल, लिवर और किडनी फंक्शन टेस्ट, विटामिन डी, विटामिन बी12, डेंगू और फुल बॉडी चेकअप — ये सारी जांच सैंपल पर होती हैं, और सैंपल आपके घर से लिया जा सकता है।",
      "होम सैंपल कलेक्शन बिल्कुल मुफ़्त है। आप सिर्फ़ टेस्ट का वही दाम देते हैं जो कार्ड पर लिखा है — कोई विज़िटिंग चार्ज या छिपा हुआ शुल्क नहीं। सुबह 6 बजे से स्लॉट शुरू हो जाते हैं, ताकि खाली पेट वाली जांच जल्दी हो जाए और आप तुरंत नाश्ता कर सकें। रिपोर्ट 24 घंटे में व्हाट्सएप और ईमेल पर पीडीएफ में आ जाती है।",
      "देवरिया की रेट लिस्ट: ब्लड शुगर ₹100, सीबीसी ₹400, थायरॉइड प्रोफाइल ₹550, एचबीए1सी ₹600, लिवर फंक्शन टेस्ट ₹600, किडनी फंक्शन टेस्ट ₹700, लिपिड प्रोफाइल ₹800, विटामिन डी ₹1,000, विटामिन बी12 ₹1,200 और डेंगू ₹1,200। बेसिक फुल बॉडी चेकअप ₹999 में 45 पैरामीटर, एडवांस ₹1,999 में 72 और सीनियर सिटिज़न पैक ₹2,999 में 88 पैरामीटर देता है।",
      "सैंपल देवरिया सदर के साथ रुद्रपुर, बरहज, सलेमपुर, भटपार रानी, गौरी बाज़ार, बैतालपुर, लार और भटनी में भी लिया जाता है। आपका गाँव इस सूची में न हो तो एक बार फ़ोन कर लीजिए — कवर होने पर उसी समय स्लॉट बुक हो जाएगा।",
      [
        "बच्चे को तेज़ बुखार के साथ झटके, बेहोशी या लगातार उल्टी हो, तो जांच बुक करने के बजाय सीधे नज़दीकी अस्पताल ले जाइए — यह आपात स्थिति है। और जांच के बाद डॉक्टर ने दवा लिखी हो तो ",
        { text: "देवरिया में दवा की होम डिलीवरी", href: MEDICINE_DEORIA },
        " से वह भी घर पर मंगवाई जा सकती है।",
      ],
    ],
  },
];

/**
 * Deoria's own FAQs.
 *
 * The generated defaults ask the same seven questions for every city with the
 * name swapped, which is exactly the duplication that keeps a second city out
 * of the index — and the FAQ block is the part Google is most likely to lift
 * into a rich result, so near-identical answers across cities actively hurt.
 *
 * These are the questions a Deoria reader actually has and a Varanasi reader
 * does not: do I still have to travel to Gorakhpur, is my village covered, and
 * what do I do about a child with fever and seizures. The two that decide a
 * booking are placed first — page.js renders the first eight.
 *
 * `links` is optional per FAQ and renders UNDER the answer, never inside the
 * schema text: the JSON-LD has to mirror the readable answer exactly, so the
 * links live outside `a`. See LabFaq.
 *
 * Claims are limited to the confirmed set: free home collection, trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI.
 */
export const deoriaFaqs = [
  {
    q: "Deoria me lab test ka kitna kharcha aata hai, aur kya home sample collection free hai?",
    a: "Aap sirf test ka wahi price dete hain jo card par likha hai — Deoria me home sample collection bilkul free hai, na visiting charge na koi hidden fee. Rate list is tarah hai: Blood Sugar ₹100, CBC ₹400, Thyroid Profile ₹550, Lipid Profile ₹800 aur Basic Full Body Checkup ₹999 se shuru. Payment sample lene ke waqt cash ya UPI se hota hai.",
  },
  {
    q: "Kya lab test ke liye mujhe Deoria se Gorakhpur jaana padega?",
    a: "Routine pathology ke liye bilkul nahi. Blood aur urine ke saare test — CBC, sugar, thyroid, liver, kidney, lipid, vitamin, dengue — sample par hote hain, aur sample aapke ghar Deoria me hi liya ja sakta hai. Gorakhpur ya Varanasi jaana sirf tab zaroori hai jab MRI, CT scan, endoscopy jaisi imaging ho ya kisi specialist ki OPD me dikhana ho. Aisi trip se pehle blood test ghar par karwa lena behtar hai, taaki report pehle se haath me ho.",
    links: [{ href: LAB_VARANASI, label: "Varanasi me lab test" }],
  },
  {
    q: "Deoria jile me aap kaun kaun se ilaake cover karte hain?",
    a: "Hum Deoria Sadar ke saath Rudrapur, Barhaj, Salempur, Bhatpar Rani, Gauri Bazar, Baitalpur, Lar, Bhatni aur inke aas-paas ke ilaakon me sample collect karte hain. Aapka gaon is list me naam se nahi hai to bhi ek baar call kar ke pooch lijiye — cover hone par usi waqt slot book ho jaayega. Pata likhte waqt ek landmark zaroor daaliye, kyunki yahan house number se zyada landmark kaam aata hai.",
    links: [
      { href: MEDICINE_SALEMPUR, label: "Salempur medicine delivery" },
      { href: MEDICINE_BARHAJ, label: "Barhaj medicine delivery" },
      { href: MEDICINE_LAR, label: "Lar medicine delivery" },
      { href: MEDICINE_BHATNI, label: "Bhatni medicine delivery" },
    ],
  },
  {
    q: "Bachche ko tez bukhar ke saath jhatke aa rahe hain — kya lab test book karun?",
    a: "Nahi. Tez bukhar ke saath jhatke, behoshi, gardan akadna, lagatar ulti ya bahut susti ho to seedha najdeeki hospital le jaaiye — ye emergency hai aur ismein der khatarnak hai. Gorakhpur–Deoria–Kushinagar belt me barsaat ke baad bachchon me dimaagi bukhar (AES / Japanese Encephalitis) ke maamle aate rahe hain. Home sample collection ka intezaar mat kijiye; blood test iska pehla jawab nahi hai.",
  },
  {
    q: "Deoria me lab test ki report kitni jaldi mil jaati hai?",
    a: "Zyadatar routine test ki report 24 ghante ke andar taiyaar ho jaati hai aur WhatsApp tatha email dono par PDF me bhej di jaati hai. Culture jaise test 48 se 72 ghante lete hain, kyunki pehle organism ugana padta hai. Report phone par hone ka faayda ye hai ki Gorakhpur ya Lucknow ke doctor ko dikhana ho to bas forward kar dijiye — kagaz le kar jaane ki zaroorat nahi.",
  },
  {
    q: "Kaun se test me khaali pet (fasting) rehna zaroori hai?",
    a: "Fasting Blood Sugar, Lipid Profile aur zyadatar Full Body Checkup package me 10 se 12 ghante kuch nahi khana hota; saada paani pi sakte hain. Chai, doodh, biscuit ya toffee bhi nahi — ek chai se hi report badal jaati hai. CBC, Thyroid Profile, HbA1c, Vitamin D aur B12 me koi fasting nahi chahiye. Isi liye home visit ke slot subah 6 baje se shuru hote hain, taaki sample de kar aap turant naashta kar sakein.",
  },
  {
    // "Deoria me pathology lab / diagnostic centre / lab test near me" — teenon
    // ka intent ek hi hai, aur wo intent yahi sawaal hai.
    q: "Deoria me pathology lab ya diagnostic centre jaana padega, ya ghar par hi ho jaayega?",
    a: "Routine pathology ke liye kahin jaane ki zaroorat nahi — sample aapke ghar par liya jaata hai. Home visit ke slot subah 6 baje se shuru hote hain aur shaam tak chalte hain, isliye fasting wale test subah aur CBC, thyroid, HbA1c, vitamin jaise test din me kabhi bhi ho jaate hain. Hum 24 ghante khula lab hone ka daawa nahi karte; report 24 ghante ke andar milne ka karte hain.",
  },
  {
    q: "Deoria me booking kaise karein, payment ka kya tarika hai, aur test ke baad dawa kaise milegi?",
    a: "Is page par test chun kar form bhar dijiye ya seedha call kar dijiye. Doctor ka parcha hai to uska photo saath rakhiye, taaki wahi panel liya jaaye jo likha hai. Booking confirm hone ke baad trained phlebotomist aam taur par 60 minute me pahunch jaata hai — uske paas ID card hota hai, sample dene se pehle dekh lijiye. Payment usi waqt cash ya UPI (PhonePe, Google Pay, Paytm) se hota hai. Report ke baad likhi hui dawa ghar tak mangwane ka option alag se hai.",
    links: [{ href: MEDICINE_DEORIA, label: "Deoria me medicine delivery" }],
  },
];
