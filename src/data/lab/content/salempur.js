/**
 * Long-form SEO copy for /lab-test/salempur.
 *
 * WHY THIS FILE EXISTS AND NOT A TEMPLATE. Same reason deoria.js and
 * gorakhpur.js exist: Google does not index a page that is another page with one
 * noun swapped — it reads it as a doorway page. Salempur is the riskiest of the
 * four on that count, because it sits INSIDE Deoria district and is already
 * named as an area on /lab-test/deoria. If this page repeated Deoria's
 * argument in Deoria's order, the likeliest outcome is not two ranking pages
 * but one, with this one filtered.
 *
 * So the angle is deliberately one step smaller than Deoria's. Deoria's page
 * argues "the big labs are in Gorakhpur, skip the journey". This page is
 * written for the tehsil: the reader here is in a kasba or a village around it,
 * the nearest thing to a lab is a collection counter in the bazaar whose sample
 * travels to a city anyway, and half the households have someone working
 * outside who is the one who actually arranges the parents' tests. That last
 * point — booking from outside for people at home — is this page's own section
 * and appears nowhere else on the site.
 *
 * ── Claims and their sourcing ────────────────────────────────────────────
 * Only the confirmed set (see the warning above defaultFaqs in
 * src/data/lab/defaults.js): free home collection, a trained phlebotomist
 * carrying an ID card, slots from 6 AM, reports in 24 hours, cash/UPI at
 * collection, a callback in about 30 minutes, a visit of about 10 minutes.
 * NOT claimed here, however well it would rank: NABL accreditation, cold-chain
 * transport, barcoded tubes, pathologist verification, a "24 ghante khula lab"
 * in Salempur, or a walk-in counter of our own anywhere in the tehsil. There
 * isn't one — this is a home-collection service area, and the copy says so.
 *
 * Geography is hedged the way deoria.js hedges it ("kareeb", "aam taur par").
 * The two lines worth re-checking before a paid push are the Salempur–Deoria
 * and Salempur–Gorakhpur distances, and the town PIN in the city entry.
 *
 * ── How the keywords are placed ──────────────────────────────────────────
 * One primary term ("lab test in Salempur" / "Salempur me lab test"), carried
 * by the URL, the H1, the title and the lead section. Everything else gets its
 * OWN heading, because a heading ranks and a term buried mid-paragraph mostly
 * does not: pathology lab / collection centre, home sample collection with the
 * surrounding kasbas named, fever panel, full body checkup, price / rate list,
 * fasting, report. Each appears in ONE H2 and then reads as prose.
 *
 * ── Internal links ───────────────────────────────────────────────────────
 * Paragraph parts of the form { text, href } render as real in-prose links (see
 * LabContent). Every href below must be a route that renders:
 *   /lab-test/{deoria,gorakhpur,varanasi}          (src/data/lab/cities.js)
 *   /blogs/{lab-test,full-body-checkup}/varanasi   (src/data/blogs/varanasi/)
 *   /contact
 */

/* Link targets, kept as constants so a route rename is a one-line fix here
   rather than a hunt through the prose — and so a typo shows up as `undefined`
   in the href instead of as a silent 404 in production. */
const LAB_DEORIA = "/lab-test/deoria";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_VARANASI = "/lab-test/varanasi";
const GUIDE_LAB_TEST = "/blogs/lab-test/varanasi";
const GUIDE_FULL_BODY = "/blogs/full-body-checkup/varanasi";

export const salempurContent = [
  {
    id: "lab-test-in-salempur",
    h: "Salempur Me Lab Test — Ghar Baithe Blood Test Booking Aur Free Home Sample Collection",
    p: [
      "Salempur tehsil mukhyalaya hai, lekin jaanch ke maamle me yahan ka reader hamesha ek qadam door khada hota hai. Chhoti si shikayat par bhi parcha likhwane ke baad sawaal wahi rehta hai — sample kahan dein. Zila mukhyalaya Deoria yahan se kareeb 30 kilometre hai aur Gorakhpur kareeb 75 kilometre; bade diagnostic setup wahin hain. Ek CBC ya thyroid ke liye bhi log subah khaali pet nikalte hain, tempo ya train pakadte hain, sample dete hain, aur report lene doosre din phir jaate hain.",
      "Home sample collection ye poora chakkar khatam kar deta hai. Aap Salempur me apna pata dete hain, subah ka slot chunte hain, aur trained phlebotomist ID card ke saath aapke darwaze par aata hai. Sample wahin liya jaata hai aur report 24 ghante ke andar WhatsApp aur email par PDF me aa jaati hai — na kiraya, na khaali pet ka safar, na report lene ka doosra din.",
      "Yahan routine pathology ke saare test aur checkup package book hote hain — CBC, Thyroid Profile, Blood Sugar, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test, Vitamin D, Vitamin B12, Dengue aur Full Body Checkup. Doctor ka parcha hai to usi panel ke hisaab se booking ho jaati hai; koi test is page par naam se na dikhe to parche ke saath ek call kar lijiye.",
    ],
  },

  {
    /* "Salempur me pathology lab", "collection centre Salempur", "lab test near
       me" — teenon ka intent ek hi hai: sample kahan dena padega. Isliye alag
       heading aur us par seedha jawab. Deoria wale page se alag baat yahan ye
       hai ki kasbe me counter to hota hai, par sample phir bhi safar karta hai. */
    id: "pathology-lab-collection-centre-salempur",
    h: "Salempur Me Pathology Lab Ya Collection Centre Dhoondh Rahe Hain?",
    p: [
      "Ek baat pehle saaf kar dena theek rahega: hamara koi walk-in counter Salempur me nahi hai, aur is page par kahin ye nahi likha jaayega ki hai. Ye home collection service hai — hum aapke ghar se sample lete hain, aur wahi sach hai jo yahan likha hai.",
      "Iska matlab kya nikalta hai, wo samajhne layak hai. Kasbe me jo chhote collection centre hain, wahan bhi sirf sample liya jaata hai; jaanch bade sheher ki lab me hi hoti hai aur report wahin se banti hai. Yaani sample ko safar to karna hi hai. Sawaal sirf itna hai ki us safar ki shuruaat aapke ghar se ho ya bazaar tak aapke chalne ke baad. Blood aur urine ke saare aam test sirf sample par hote hain, isliye ghar se shuruaat karna kisi tarah kam bharosemand nahi hai — bas ek trip kam ho jaati hai.",
      "Sample lene ka kaam trained phlebotomist karta hai, ID card ke saath, aapke saamne. Sample dene se pehle teen cheezein kar lijiye: uska ID card dekh lijiye, doctor ka parcha saamne rakh dijiye taaki wahi panel liya jaaye jo likha hai, aur jo test card par 'Call for price' likha hai uska daam pehle pooch lijiye. Home visit ke slot subah 6 baje se shuru hote hain aur shaam tak chalte hain. Report 24 ghante ke andar aati hai — hum 24 ghante khula lab hone ka daawa nahi karte, 24 ghante me report milne ka karte hain.",
      "Ek aur baat jo kasbe me sabse zyada nuksan karti hai: jo test aap mahino tak dohrate hain — HbA1c, TSH, creatinine, haemoglobin — unhe har baar alag alag jagah se mat karaiye. Alag machine aur method ke reference range thode alag hote hain, isliye ek jagah TSH 4.5 aur doosri jagah 4.1 aane ka matlab ye nahi ki aapka thyroid badal gaya. Doctor badlav dekhta hai, sirf aaj ka number nahi.",
    ],
  },

  {
    id: "home-sample-collection-salempur",
    h: "Salempur Ke Aas-paas Home Sample Collection — Bhatni, Lar, Bhatpar Rani, Bhagalpur Aur Majhauli Raj",
    p: [
      "Collection Salempur kasbe ke saath aas-paas ke ilaakon me bhi hoti hai — Bhatni, Lar, Bhatpar Rani, Bhagalpur, Majhauli Raj, Rampur Karkhana aur Barhaj tak. In kasbon se lage gaon bhi aam taur par cover hote hain. Aapka gaon is list me naam se nahi hai to maan kar mat baithiye ki service nahi hai; booking se pehle ek call kar lijiye — cover hota hai to usi waqt slot book ho jaayega, aur nahi hota to hum saaf bata denge, taaki aap intezaar kar ke pareshan na hon.",
      "Yahan ke pate sheher jaise nahi hote, aur late visit ki sabse badi wajah yahi hoti hai. Gaon ka naam kaafi nahi hai — tola ya purwa ka naam likhiye, saath me ek aisa landmark jo har koi jaanta ho: primary school, mandir ya masjid, block office, bank, petrol pump, chauraha, ya bijli ka transformer. Ek hi naam ke do gaon paas paas hone bhi aam baat hai, isliye post office ya thana ka naam likh dena aur bhi behtar rehta hai.",
      "Mobile number wahi dijiye jo us waqt aapke paas chalu rahega, aur ho sake to ek doosra number bhi likh dijiye. Kai gaon me network ek hi kone me aata hai — agar phlebotomist ka phone nahi laga to wahi ek call chhoot jaane se poori visit atak jaati hai.",
      "Fasting wale test ke liye subah 6 baje se slot shuru hote hain, aur is ilaake me iska faayda sheher se zyada hai. Khet ka kaam, doodh ka kaam ya dukaan — sab subah shuru ho jaate hain, aur 10–12 ghante khaali pet rehne ke baad koi din bhar bhookha nahi baith sakta. Jaldi wala slot lijiye, sample dijiye, aur turant naashta kar lijiye.",
      [
        "Ghar me ek se zyada log test kara rahe hain — maa-baap, dada-dadi, bachche — to sabki booking ek hi slot me kar dijiye; ek hi visit me sabka sample ho jaayega. Aur ye tay karne me ki kaun sa test karana chahiye — shikayat, umar aur mausam ke hisaab se — ",
        { text: "hamari poori guide", href: GUIDE_LAB_TEST },
        " kaam aayegi.",
      ],
    ],
  },

  {
    /* Is page ka apna hissa. Salempur belt se bahut bade paimane par log bahar
       kaam karte hain, aur ghar ke test aksar wahi arrange karte hain. Ye baat
       site ke kisi aur page par nahi likhi hai — aur yahi is page ko Deoria ke
       page se alag banati hai. */
    id: "bahar-se-booking-salempur",
    h: "Bahar Rehte Hain Aur Ghar Walon Ka Test Karana Hai — Phone Se Booking",
    p: [
      "Is ilaake ke bahut se gharon me kamane wala bahar hai — Mumbai, Delhi, Surat, Punjab ya khadi desh — aur ghar par maa-baap. Bimari ki khabar phone par milti hai, aur wahin se sabse badi bebasi shuru hoti hai: parcha kaun le jaayega, sample kahan dega, report kaun laayega. Aksar test isliye nahi hota ki koi le jaane wala nahi hai, isliye nahi ki paise nahi hain.",
      "Booking ke liye ghar par hona zaroori nahi hai. Aap kahin se bhi form bhar sakte hain ya call kar sakte hain — bas ghar ka pata, landmark, aur wahan maujood kisi ka chalu mobile number dijiye. Confirm karne ke liye call aam taur par 30 minute ke andar aati hai; wo call kis number par aani chahiye, ye booking ke waqt bata dijiye — apne number par bhi karwa sakte hain.",
      "Parcha ghar par hai to uska photo WhatsApp par mangwa lijiye aur wahi bhej dijiye, taaki jo panel doctor ne likha hai wahi liya jaaye. Test ke naam milte julte hote hain — Thyroid Profile Total aur Free, Widal aur Typhidot, Sugar Fasting aur PP — aur parche ka photo hone par ye galti hoti hi nahi.",
      "Payment sample lene ke waqt hota hai, cash ya UPI se. UPI chuniye to ye ghar walon par bojh nahi rehta — PhonePe, Google Pay ya Paytm se aap wahin se kar dete hain. Report bhi 24 ghante me WhatsApp aur email par PDF me aati hai, isliye wo aapke phone par bhi utni hi aasani se pahunch jaati hai jitni ghar par.",
      [
        "Chhutti me khud ghar aa rahe hain to apna ek baseline checkup bhi isi bahane karwa lijiye — bahar lambi shift, kam dhoop aur bahar ka khana jhelne walon me vitamin ki kami aur badha hua lipid bahut aam milta hai. Kis umar me kaun sa package theek rehta hai, wo ",
        { text: "full body checkup wali guide", href: GUIDE_FULL_BODY },
        " me alag se likha hai.",
      ],
    ],
  },

  {
    id: "bujurg-mareez-ghar-par-jaanch-salempur",
    h: "Bujurg Aur Bistar Par Pade Mareez Ka Sample Ghar Par — Salempur Me Sabse Kaam Ka Faayda",
    p: [
      "Home collection ka sabse bada faayda un logon ko milta hai jinke liye ghar se nikalna hi sabse mushkil hissa hai: bujurg, lakwe ya operation ke baad recovery kar rahe log, bahut kamzor mareez, aur wo pregnant mahilaein jinhe safar mana hai. Inke liye tempo tak paidal jaana, wahan baithna aur wapas aana — jaanch se zyada thaka dene wala kaam yahi hota hai.",
      "Booking ke waqt mareez ki haalat bata dijiye. Bujurg hain, bistar par hain, diabetic hain jinki nas patli ho gayi hai, ya pehle bhi sample lene me dikkat aayi hai — ye batana kaam ka hota hai, taaki aane wala taiyaari ke saath aaye aur baar baar sui na lagani pade. Sample lene se pehle mareez ko thoda paani pila dijiye, jab tak fasting ke niyam mana na karein; paani ki kami se nas dhoondhna sach me mushkil ho jaata hai.",
      "Jinka BP ya sugar ka ilaaj chal raha hai, unke liye ghar par jaanch ka ek aur faayda hai — jo test chhoot jaate the wo ab chhootte nahi. Diabetes me har teen mahine me HbA1c, saal me ek baar Lipid Profile, aur saal me ek baar Kidney Function Test ke saath urine microalbumin — microalbumin wahi test hai jo sabse pehle ishaara deta hai ki kidney par asar shuru ho raha hai, aur wahi sabse zyada chhoda jaata hai.",
      "Thyroid ki dawa chal rahi ho to dose badalne ke 6 se 8 hafte baad TSH dohraiye, uske baad har 6 se 12 mahine me. Ye wo jaanch hai jiske liye log poora din nahi lagana chahte aur isliye taalte rehte hain — ghar par 10 minute me ho jaati hai.",
    ],
  },

  {
    id: "deoria-gorakhpur-safar-salempur",
    h: "Deoria Ya Gorakhpur Jaane Ki Zaroorat Kab Hai Aur Kab Nahi",
    p: [
      "Har cheez ke liye safar zaroori nahi hai. Routine pathology — blood count, sugar, thyroid, liver, kidney, lipid, vitamin, urine routine, bukhar ka panel — sample par hoti hai, aur sample kahin se bhi liya ja sakta hai. In sabke liye ghar par sample dena aur report phone par lena bilkul kaafi hai.",
      "Safar tab banta hai jab baat imaging ya specialist procedure ki ho — X-ray se aage MRI, CT scan, sonography se aage angiography, endoscopy, biopsy, ya kisi super-speciality doctor ki OPD. Ye machine aur doctor par hote hain, sample par nahi, isliye inka koi home option hota hi nahi. Yahan se log aam taur par Deoria, Gorakhpur ya Varanasi hi jaate hain, aur Bhatni junction hone ki wajah se train se nikalna aasan bhi rehta hai.",
      [
        "Isliye faisla seedha hai: parche par sirf blood aur urine ke test likhe hain to ghar par karaiye. Scan ya procedure likha hai to trip ki planning kijiye — aur us trip se pehle blood test ghar par karwa lijiye, taaki doctor ke saamne baithte waqt report pehle se haath me ho aur ek hi visit me baat ban jaaye. Jile ke mukhyalaya par rehte hain ya wahan kisi ke saath ruke hain to ",
        { text: "Deoria me lab test", href: LAB_DEORIA },
        " bhi isi tarah ghar par hota hai, ",
        { text: "Gorakhpur me lab test", href: LAB_GORAKHPUR },
        " bhi, aur ilaaj Varanasi me chal raha ho to ",
        { text: "Varanasi me home sample collection", href: LAB_VARANASI },
        " bhi usi tarah book hota hai.",
      ],
    ],
  },

  {
    id: "parche-ke-test-samajhna-salempur",
    h: "Parche Par Likha Test Samajh Nahi Aa Raha — Naam Ka Confusion Kaise Door Karein",
    p: [
      "Kasbe me galat test ho jaana bahut aam hai, aur wajah aksar doctor ya lab nahi — naam ka confusion hota hai. Parcha jaldi me likha jaata hai, ghar par koi doosra padhta hai, aur bookings me ek milta julta naam chun liya jaata hai. Paisa bhi jaata hai aur din bhi.",
      "Jo jodiyan sabse zyada gadbadati hain, ye rahin. Thyroid me 'Total' aur 'Free' alag test hain — parche par T3/T4/TSH likha ho to Thyroid Profile, aur FT3/FT4 likha ho to free wala. Sugar me 'Fasting' aur 'PP' do alag sample hain (ek khaali pet, doosra khaana khaane ke 2 ghante baad), jabki HbA1c ek hi sample me teen mahine ka ausat batata hai aur usme fasting nahi chahiye. Typhoid me Widal aur Typhidot alag hain. 'Liver test' aam taur par LFT hota hai aur 'kidney test' KFT — lekin agar parche par urine microalbumin ya creatinine ratio bhi likha hai to wo alag se jodna padta hai.",
      "Sabse aasan hal yahi hai: parche ka photo saath rakhiye aur booking ke waqt bhej dijiye. Panel usi ke hisaab se book kar diya jaata hai. Doctor ne 'full body' likh diya hai bina detail ke, to bhi photo bhej dijiye — package me kya kya aata hai wo bata diya jaata hai, taaki koi zaroori cheez chhoot na jaaye aur bewajah koi test dobara na ho.",
      "Aur jo test parche par likha hi nahi hai use apne mann se mat jodiye. Har extra number ka matlab nahi hota; kuch to bina wajah ki ghabrahat hi paida karte hain. Kya karana chahiye ye samajhna ho to pehle padh lijiye, phir book kijiye.",
    ],
  },

  {
    id: "bukhar-panel-salempur",
    h: "Salempur Me Dengue, Typhoid Aur Malaria Test — Bukhar Ke Kis Din Kaunsa Test",
    p: [
      "Barsaat ke baad, July se November ke beech, bukhar ka bojh yahan sabse zyada rehta hai. Sabse aam galti bimari pehchan-ne me nahi, din ginne me hoti hai — test sahi hota hai par galat din par, aur report negative aane par ilaaj hafta bhar late ho jaata hai.",
      "Seedha niyam ye hai. Dengue me NS1 antigen bukhar ke pehle 1 se 5 din tak bharosemand hai; paanchve din ke baad wo aksar negative aa jaata hai aur tab IgM antibody karana padta hai. Typhoid me Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye, warna titre badhte hi nahi — aur is ilaake me typhoid endemic hai, isliye purane infection se bhi Widal positive aa sakta hai; sirf usi par ilaaj tay karna theek nahi. Typhidot IgM jaldi positive hota hai. Bukhar me thand aur kanpkanpi ho to malaria antigen aur peripheral smear jodiye. Jo bhi karayein, CBC saath me zaroor karwaiye — girta platelet count wahi cheez hai jo roz dekhi jaati hai.",
      "Bukhar me sample dene ke liye ghar se nikalna sabse bhaari kaam hota hai, aur yahi wo waqt hai jab home collection sabse zyada kaam aata hai. Slot subah ka lijiye, kyunki bukhar ka panel aksar do-teen din baad dohrana padta hai aur ek hi samay par dohrana behtar rehta hai.",
      "Ek zaroori chetavani. Gorakhpur–Deoria–Kushinagar belt me barsaat ke baad bachchon me dimaagi bukhar (AES / Japanese Encephalitis) ke maamle aate rahe hain. Bachche ko tez bukhar ke saath jhatke aayein, behoshi ho, gardan akad jaaye, lagatar ulti ho ya wo sust pada rahe — to lab test book mat kijiye, seedha najdeeki hospital le jaaiye. Ye emergency hai aur ismein ek-ek ghanta maayne rakhta hai; blood test iska pehla jawab nahi hai aur home collection ka intezaar khatarnak hai.",
    ],
  },

  {
    id: "full-body-checkup-salempur",
    h: "Salempur Me Full Body Checkup Package — 45, 72 Aur 88 Parameter Wale Plan",
    p: [
      "Achha full body checkup parameter ki ginti se nahi, coverage se tay hota hai. Kam se kam paanch cheezein aani chahiye: blood count (CBC), sugar, heart ke liye lipid profile, liver function, aur kidney function ke saath urine routine. Iske upar thyroid, Vitamin D aur B12 jud jaayein to package se sach me kuch pata chalta hai.",
      "Basic Full Body Checkup (45 parameter, ₹999) un logon ke liye theek hai jinki umar kam hai aur koi shikayat nahi — saal ka ek baseline ban jaata hai. Advanced Full Body (72 parameter, ₹1,999) me thyroid, HbA1c aur vitamins jud jaate hain; 30 se 50 saal walon ke liye yahi sabse sahi baithta hai. Senior Citizen Pack (88 parameter, ₹2,999) 55 ke upar ke liye hai, jismein heart, haddi aur sugar ki screening ek saath hoti hai.",
      "Package apne risk ke hisaab se chuniye, price ke hisaab se nahi. Ghar me diabetes ya dil ki bimari chali aa rahi hai to HbA1c, lipid aur kidney markers ko priority dijiye. Ghar ka khana shudh shakahari hai — jo yahan bahut se gharon me hai — to Vitamin B12 ko saal wale panel me jagah milni hi chahiye; iski kami sirf khoon nahi, nason par bhi asar daalti hai, jisse haath-pair me jhunjhuni aur sunnpan hota hai.",
      "Ek galatfehmi door kar lena zaroori hai: full body checkup har bimari nahi pakadta. Ye screening hai — jo cheez chup chaap badh rahi hoti hai use jaldi pakadne ke liye. Koi shikayat pehle se hai to package ke bharose mat baithiye, doctor ko dikhaiye aur wahi test karaiye jo wo kahe.",
      "Poora package ek hi sample me ho jaata hai aur zyadatar package fasting maangte hain, isliye subah ka slot lijiye. Ghar ke kai log ek saath karaa rahe hain to sabka ek hi slot me book kijiye.",
    ],
  },

  {
    id: "lab-test-price-salempur",
    h: "Salempur Me Lab Test Price Aur Rate List — Kaunsa Test Kitne Ka",
    p: [
      "Is page par har card par jo price likha hai, wahi aapko dena hai. Home sample collection uske upar free hai — na visiting charge, na travel charge, na koi hidden fee. Chhote kasbe me iska matlab bade sheher se zyada hai: bahar se daam bhale barabar lagen, asli kharcha ghar par karane me kam padta hai, kyunki aane-jaane ka kiraya dono taraf ka aur report lene ka doosra chakkar bach jaata hai.",
      "Rate list ise tarah hai: Blood Sugar ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1,000, Vitamin B12 ₹1,200 aur Dengue (NS1, IgG, IgM) ₹1,200. Ye wahi rate hain jo hamare doosre sheheron me hain — kasba hone ki wajah se yahan koi alag daam nahi lagta.",
      "Package me bachat sabse zyada hoti hai. Basic Full Body ₹999 me 45 parameter deta hai — wahi test alag alag karane par kharcha kai guna ho jaata hai. Advanced ₹1,999 me 72 parameter aur Senior Citizen Pack ₹2,999 me 88 parameter deta hai.",
      "Kuch test, jaise Fever Panel (malaria, typhoid aur dengue ek saath), price par nahi balki us waqt ki zaroorat par tay hote hain — unke card par 'Call for price' likha rehta hai. Aise me phone par pooch lijiye; sample dene se pehle price bata diya jaata hai. Payment sample lene ke waqt hi hota hai — cash ya UPI se, PhonePe, Google Pay ya Paytm.",
    ],
  },

  {
    id: "fasting-taiyari-salempur",
    h: "Sample Dene Se Pehle Kya Karein, Kya Na Karein — Fasting Ke Niyam",
    p: [
      "Fasting wale test — Fasting Blood Sugar, Lipid Profile aur zyadatar full body package — me 10 se 12 ghante kuch nahi khana hota. Saada paani peena mana nahi hai, balki zaroori hai: paani ki kami se nas dhoondhna mushkil ho jaata hai aur haemoglobin, urea tatha creatinine jhoothe taur par badhe hue aate hain. Raat ka khana 9 baje tak khatam kar lijiye aur subah 6 se 8 baje ka slot lijiye. 14 ghante se zyada bhookhe rehna faayda nahi, nuksan karta hai.",
      "Fasting sample se pehle chai — doodh wali to bilkul nahi — biscuit, toffee, paan ya gutkha kuch bhi nahi. Ek chai bhi sugar aur lipid ki report badal deti hai, aur phir wahi test dobara karana padta hai. Sirf saada paani.",
      "Lipid Profile ya Liver Function Test se kam se kam 24 ghante pehle sharaab bilkul na lein — ek shaam ki peene se hi triglycerides aur liver enzymes kaafi badh jaate hain. Kidney function ya CPK karana ho to ek din pehle bahut bhaari mehnat avoid kijiye; khet ka bhaari kaam ya lambi cycle bhi ismein aata hai.",
      "Dawa ka aam niyam ye hai ki apni rozana ki goliyan usi samay lijiye, jab tak doctor mana na kare. Do exception hain: thyroid ki goli sample dene ke baad leni chahiye, aur biotin ya multivitamin kisi bhi hormone test se 2 se 3 din pehle band kar dena chahiye. Phlebotomist ko bata dijiye ki aap kaun kaun si dawa le rahe hain.",
    ],
  },

  {
    id: "report-salempur",
    h: "Report Kab Milegi — 24 Ghante Me WhatsApp Par PDF, Aur Use Kaise Padhein",
    p: [
      "Zyadatar routine test ki report 24 ghante ke andar aa jaati hai — CBC, sugar, lipid, LFT, KFT, thyroid aur urine routine. Vitamin aur hormone me aam taur par utna hi samay lagta hai. Culture jaan boojh kar dheere hote hain: urine ya blood culture me 48 se 72 ghante lagte hain, kyunki pehle organism ko ugana padta hai aur uske baad hi pata chalta hai ki kaunsi dawa asar karegi. Isse jaldi ka vaada koi bhi lab imaandari se nahi kar sakta.",
      "Report WhatsApp aur email dono par PDF me aati hai, aur is ilaake me iska faayda sabse zyada hai. Doctor Deoria me ho, Gorakhpur me, ya ghar ka koi vyakti Mumbai me baitha ho — report bas forward kar dijiye. Kagaz le kar bhaagne ki zaroorat nahi, aur report kho jaane ka darr bhi nahi. Purani report bhi phone me sambhal kar rakhiye; doctor ko badlav dekhna hota hai, sirf aaj ka number nahi.",
      "Number ko report par chhape reference range se hi milaiye, internet ke kisi chart se nahi. Range machine aur method ke hisaab se badalti hai, aur umar tatha ling ke hisaab se bhi. Thoda sa high ya low hona bahut aam hai aur aksar koi bimari nahi hoti — ye diagnosis nahi, doctor se poochne ka ishaara hai. WhatsApp par report kisi group me mat daaliye; ye aapki niji jaankari hai.",
      [
        "Kuch result me intezaar nahi karna chahiye, usi din doctor chahiye: dengue me tezi se girta platelet count, bahut zyada sugar ke saath ulti ya susti, bahut kam haemoglobin, ya bahut badha creatinine ke saath peshab kam hona. Tabiyat kharab lag rahi ho to kisi ke phone ka intezaar mat kijiye, seedha dikhaiye. Numbers ka matlab kya hota hai aur kis flag par ghabrana nahi chahiye, ye ",
        { text: "report kaise padhein wale hisse", href: `${GUIDE_LAB_TEST}#report-kaise-padhein` },
        " me detail me likha hai.",
      ],
    ],
  },

  {
    id: "how-to-book-salempur",
    h: "Salempur Me Lab Test Kaise Book Karein — Online Form Ya Ek Phone Call",
    p: [
      "Is page par apna test ya package chuniye aur booking form bhar dijiye — naam, mobile number, apna gaon ya mohalla, aur ek landmark. Ya seedha phone kar dijiye. Doctor ka parcha hai to uska photo saath rakhiye, kyunki panel usi ke hisaab se book hota hai.",
      "Booking ke baad confirm karne ke liye call aam taur par 30 minute ke andar aati hai — slot, pata aur ye ki test me fasting chahiye ya nahi. Slot chunte waqt itna dhyan rakhiye ki fasting wale test subah ke slot me hi karaane hain. Aane wale phlebotomist ke paas ID card hota hai; sample dene se pehle use dekh lena aapka haq hai.",
      "Poori visit lagbhag 10 minute ki hoti hai. Payment usi waqt hota hai, cash ya UPI se. Uske baad aapko kuch karna nahi hai — report taiyaar hone par WhatsApp aur email par PDF khud aa jaayegi.",
      [
        "Ek aakhri baat: aap Salempur tehsil ke kisi aise gaon me hain jo is page par naam se nahi likha, to bhi ek call kar ke pooch lijiye — cover hota hai to wahi slot book ho jaayega, aur nahi hota to hum saaf bata denge. Number aur poora pata ",
        { text: "contact page", href: "/contact" },
        " par mil jaayega.",
      ],
    ],
  },

  {
    /* Devanagari section, ek baar.
       Is belt me bahut si search Hindi me type hoti hai — "सलेमपुर में लैब टेस्ट",
       "खून की जांच", "रेट लिस्ट". Poore page ko transliterate karna galat hota:
       baaki copy Hinglish me hai aur wahi log padhte hain. Ek alag section dono
       cover kar deta hai — aur ye upar likhi baaton ka anuvaad hai, naya daawa
       nahi, isliye claims kahin bhi alag nahi padte. */
    id: "salempur-lab-test-hindi",
    h: "सलेमपुर में लैब टेस्ट — घर से सैंपल कलेक्शन की पूरी जानकारी (हिंदी में)",
    p: [
      "सलेमपुर में खून की जांच के लिए अब देवरिया या गोरखपुर जाने की ज़रूरत नहीं है। सीबीसी, थायरॉइड, शुगर, एचबीए1सी, लिपिड प्रोफाइल, लिवर और किडनी फंक्शन टेस्ट, विटामिन डी, विटामिन बी12, डेंगू और फुल बॉडी चेकअप — ये सारी जांच सैंपल पर होती हैं, और सैंपल आपके घर से लिया जा सकता है।",
      "होम सैंपल कलेक्शन बिल्कुल मुफ़्त है। आप सिर्फ़ टेस्ट का वही दाम देते हैं जो कार्ड पर लिखा है — कोई विज़िटिंग चार्ज या छिपा हुआ शुल्क नहीं। सुबह 6 बजे से स्लॉट शुरू हो जाते हैं, ताकि खाली पेट वाली जांच जल्दी हो जाए और आप तुरंत नाश्ता कर सकें। रिपोर्ट 24 घंटे में व्हाट्सएप और ईमेल पर पीडीएफ में आ जाती है।",
      "रेट लिस्ट: ब्लड शुगर ₹100, सीबीसी ₹400, थायरॉइड प्रोफाइल ₹550, एचबीए1सी ₹600, लिवर फंक्शन टेस्ट ₹600, किडनी फंक्शन टेस्ट ₹700, लिपिड प्रोफाइल ₹800, विटामिन डी ₹1,000, विटामिन बी12 ₹1,200 और डेंगू ₹1,200। बेसिक फुल बॉडी चेकअप ₹999 में 45 पैरामीटर, एडवांस ₹1,999 में 72 और सीनियर सिटिज़न पैक ₹2,999 में 88 पैरामीटर देता है।",
      "सैंपल सलेमपुर कस्बे के साथ भटनी, लार, भटपार रानी, भागलपुर, मझौली राज, रामपुर कारखाना और बरहज तक लिया जाता है। आपका गाँव इस सूची में न हो तो एक बार फ़ोन कर लीजिए — कवर होने पर उसी समय स्लॉट बुक हो जाएगा। पता लिखते समय टोला या पुरवा का नाम और एक लैंडमार्क ज़रूर डालिए।",
      "घर से बाहर रहते हैं और माता-पिता की जांच करवानी है, तो बुकिंग आप कहीं से भी कर सकते हैं — घर का पता, लैंडमार्क और वहाँ मौजूद किसी का चालू मोबाइल नंबर दे दीजिए। पेमेंट सैंपल लेते समय नकद या यूपीआई से होता है, और रिपोर्ट व्हाट्सएप पर आ जाती है।",
      [
        "बच्चे को तेज़ बुखार के साथ झटके, बेहोशी, गर्दन में अकड़न या लगातार उल्टी हो, तो जांच बुक करने के बजाय सीधे नज़दीकी अस्पताल ले जाइए — यह आपात स्थिति है। कौन सी जांच कब करानी चाहिए, इसकी पूरी जानकारी ",
        { text: "हमारी गाइड में", href: GUIDE_LAB_TEST },
        " दी गई है।",
      ],
    ],
  },
];

/**
 * Salempur's own FAQs.
 *
 * The generated defaults ask the same seven questions for every city with the
 * name swapped — exactly the duplication that keeps a fourth page out of the
 * index, and the FAQ block is the part Google is most likely to lift into a
 * rich result, so near-identical answers across cities actively hurt.
 *
 * These are the questions a Salempur reader has and a Deoria-town reader does
 * not: is there actually a lab here, is my village covered, and can I book from
 * outside for my parents. The two that decide a booking are placed first —
 * page.js renders the first eight, so this list is exactly eight.
 *
 * `links` is optional per FAQ and renders UNDER the answer, never inside the
 * schema text: the JSON-LD has to mirror the readable answer exactly, so the
 * links live outside `a`. See LabFaq.
 *
 * Claims are limited to the confirmed set: free home collection, trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI.
 */
export const salempurFaqs = [
  {
    q: "How much does a lab test cost in Salempur, and is home sample collection free?",
    a: "You pay only the price printed on the test card — home sample collection in Salempur is completely free, with no visiting charge and no hidden fee. Blood Sugar is ₹100, CBC ₹400, Thyroid Profile ₹550, Lipid Profile ₹800, and the Basic Full Body Checkup starts at ₹999. Being a small town makes no difference to the rate. Payment is taken at the time of collection, by cash or UPI.",
  },
  {
    q: "Do I have to travel from Salempur to Deoria or Gorakhpur for a lab test?",
    a: "Not for routine pathology. Every blood and urine test — CBC, sugar, thyroid, liver, kidney, lipid, vitamin, dengue — is run on a sample, and that sample can be drawn at your home in Salempur. Deoria, Gorakhpur or Varanasi is necessary only for imaging such as MRI, CT or endoscopy, or to see a specialist in person. Before a trip like that, it is worth having the blood tests done at home so the report is already in hand.",
    links: [
      { href: LAB_DEORIA, label: "Lab test in Deoria" },
      { href: LAB_GORAKHPUR, label: "Lab test in Gorakhpur" },
    ],
  },
  {
    q: "Which areas around Salempur do you cover?",
    a: "We collect samples in Salempur town along with Bhatni, Lar, Bhatpar Rani, Bhagalpur, Majhauli Raj, Rampur Karkhana, Barhaj and the villages adjoining them. If your village is not named in this list, please call anyway — if it is covered, the slot is booked on the same call. When writing the address, include the tola or purwa and a landmark (a school, temple, block office or crossing), because a landmark is far more useful here than a house number.",
  },
  {
    q: "I work away from home — can I book a test for my parents from here?",
    a: "Yes. You do not need to be at the house to book. On the form, give the home address with a landmark and a working mobile number of someone who is there, and tell us which number the confirmation call should go to — it can be yours. Send a photo of the doctor's prescription so that exactly the panel written on it is run. Payment is taken at the time of collection, by cash or UPI, and the report arrives within 24 hours as a PDF on WhatsApp and email, so it reaches your phone as well.",
  },
  {
    q: "Do you have a lab or collection centre in Salempur where I can walk in and give a sample?",
    a: "No — we have no walk-in counter in Salempur, and we do not claim to. This is a home collection service: a trained phlebotomist comes to your home with an ID card and the sample is drawn there. Home visit slots start at 6 AM and run until evening. We also do not claim to be a lab that is open 24 hours; what we do commit to is a report within 24 hours.",
  },
  {
    q: "Can a sample be taken at home for an elderly or bedridden patient?",
    a: "Yes, and this is exactly who it helps most. Please describe the patient's condition when booking — elderly, bedridden, diabetic with veins that have become difficult, or a history of trouble during earlier draws — so that whoever comes arrives prepared. Give the patient a little water beforehand, unless the fasting instructions say otherwise. If several people in the house are being tested, book them into a single slot; all the samples can be taken in one visit.",
  },
  {
    q: "My child has a high fever with seizures — should I book a lab test?",
    a: "No. A high fever with seizures, unconsciousness, a stiff neck, repeated vomiting or extreme drowsiness needs the nearest hospital immediately — this is an emergency, and any delay is dangerous. The Gorakhpur–Deoria–Kushinagar belt has seen cases of acute encephalitis syndrome (AES / Japanese Encephalitis) in children after the monsoon. Do not wait for a home collection; a blood test is not the first answer here.",
  },
  {
    q: "Which tests require fasting, and how soon does the report arrive?",
    a: "Fasting Blood Sugar, Lipid Profile and most Full Body Checkup packages need 10 to 12 hours without food; plain water is allowed, but tea, milk, a biscuit or a toffee are not — a single cup of tea is enough to change the result. CBC, Thyroid Profile, HbA1c, Vitamin D and B12 need no fasting. Most routine tests are reported within 24 hours as a PDF on WhatsApp and email; tests such as cultures take 48 to 72 hours.",
    links: [{ href: GUIDE_LAB_TEST, label: "Which test, and when — a guide" }],
  },
];
