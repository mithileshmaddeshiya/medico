/**
 * /lab-test/kushinagar — the district's long-form copy and its FAQs.
 *
 * ── THE NAME PROBLEM, AND WHY IT SHAPES THIS WHOLE PAGE ──────────────────
 * Kushinagar is the only district on this site whose headquarters is not the
 * town the district is named after. The administrative centre — the hospital,
 * the courts, the market, most of the population that has money to spend on a
 * checkup — is PADRAUNA. "Kushinagar" (Kasia) is the Buddhist pilgrimage town
 * about 15 km away.
 *
 * That splits the search demand in two, and it is not a small split: a person
 * in the district headquarters types "Padrauna me blood test", while the
 * district name is what anyone outside types. A page that carried only one of
 * those names would miss half its own district. So both names run through this
 * copy on purpose — the h1, the lead paragraph, an H2 of its own, several FAQs
 * and the Hindi section all carry the pair. Mau does the same thing with
 * "Maunath Bhanjan" (see content/mau.js); this is the same fix for a sharper
 * version of the same problem, because here the two names are two DIFFERENT
 * towns, not two names for one.
 *
 * ── WHAT IS GENUINELY LOCAL HERE ─────────────────────────────────────────
 * Four things, and each earns a section rather than a sentence:
 *
 *   1. AES / Japanese Encephalitis. This district sits in the worst-affected
 *      belt in the country, and the honest thing a lab page can do about that
 *      is to tell a parent NOT to book a test. That section sends them to a
 *      hospital. It must never be softened into a booking prompt.
 *   2. Sugarcane. Ramkola, Padrauna, Khadda, Sewrahi and Captainganj run on
 *      mill and field work that is seasonal and physical, and the crushing
 *      season is when nobody has half a day to spare for a lab queue.
 *   3. The Gandak (Narayani). Khadda, Nebua Naurangia and Vishunpura take
 *      flood water, and the weeks after it are typhoid, jaundice and dengue
 *      weather — the season where the DAY a test is taken decides whether it
 *      was worth taking.
 *   4. Gorakhpur, ~50 km away, is where the specialists are. The single most
 *      useful thing a patient here can do is walk into that OPD with the
 *      report already in hand.
 *
 * ── CLAIMS ───────────────────────────────────────────────────────────────
 * Only the five this business confirms: free home collection, a trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI
 * on collection. NOT claimed anywhere: NABL accreditation, pathologist
 * verification, cold-chain transport, barcode tracking, sealed single-use
 * needles — removed from this project once already, see the warning above
 * defaultFaqs in src/data/lab/defaults.js. There is no walk-in counter in this
 * district and this page says so in plain words rather than letting a reader
 * assume one.
 *
 * Clinically only the uncontroversial: dengue NS1's 1–5 day window, Widal
 * needing 5–7 days of fever, HbA1c quarterly for a diabetic, urine
 * microalbumin as the earliest diabetic-kidney signal, B12 deficiency being
 * common on a vegetarian diet. TB is answered by sending the reader to a DOTS
 * centre — the TB antibody blood test is not reliable and is not offered.
 *
 * ── PRICES ───────────────────────────────────────────────────────────────
 * The rate list appears ONCE, in the price section and in the price FAQ, and
 * matches defaultTests() in src/data/lab/defaults.js. Change a price there and
 * this file has to change with it — that pair is the one place on this page
 * where drift is possible, so it is worth a grep before any price edit.
 *
 * ── SECTION IDS ──────────────────────────────────────────────────────────
 * Every `id` below is an anchor target. They are linked from the blog guides
 * and from this city's own relatedLinks in src/data/lab/cities.js — renaming
 * one here breaks those links silently, with no build error. Grep the id
 * before changing it.
 */

export const kushinagarContent = [
  {
    id: "lab-test-in-kushinagar",
    h: "Kushinagar Me Lab Test — Padrauna Se Kasia Tak Ghar Baithe Blood Test Booking Aur Free Home Sample Collection",
    p: [
      "Kushinagar jile me jaanch ka asli kharcha test ki fees nahi, us tak pahunchne ka safar hai. Collection centre zyadatar Padrauna me hain — zila aspatal ke aas-paas, Bank Road aur purani bazar ke kareeb — aur jile ka bada hissa wahan se 20 se 45 kilometre door baitha hai. Khadda, Tamkuhi Raj, Sewrahi, Nebua Naurangia ya Fazilnagar se ek CBC ke liye nikalne ka matlab hai subah ki gaadi, khaali pet safar, counter par line, aur report lene ke liye doosre din phir wahi rasta. Ganne ke seson me, jab mill aur khet dono chal rahe hote hain, ye do din ki dihadi ka nuksan hai — aur wo aksar test ke daam se zyada baith jaata hai.",
      "Home sample collection isi rasta kharch ko khatam kar deta hai. Aap apna pata dete hain, apna slot chunte hain, aur trained phlebotomist ID card ke saath aapke darwaze par aata hai. Sample wahin liya jaata hai aur report 24 ghante ke andar WhatsApp aur email par PDF me aa jaati hai — na kiraya, na khaali pet ka safar, na line, na doosra chakkar, aur na kaam se chhutti.",
      "Yahan routine pathology ke saare test aur health package book hote hain — CBC, Thyroid Profile, Blood Sugar, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test, Vitamin D, Vitamin B12, Dengue, Urine Routine aur Full Body Checkup. Doctor ka parcha hai to usi panel ke hisaab se booking ho jaati hai; koi test is page par naam se na dikhe to parche ke saath ek call kar lijiye — zyadatar test usi home visit me ho jaate hain.",
      "Ek naam ki baat pehle hi saaf kar dena theek rahega, kyunki is jile me ye sabse zyada uljhan paida karti hai: jila Kushinagar hai, lekin jila mukhyalaya Padrauna hai. Kushinagar (Kasia) wo teerth sthal hai jahan Mahaparinirvan mandir aur Ramabhar stupa hain, aur wo Padrauna se kareeb 15 kilometre door hai. Aap \"Kushinagar me lab test\" dhoondhein ya \"Padrauna me blood test\" — ye page dono ke liye hai, aur service dono jagah wahi hai.",
    ],
  },

  {
    /* "Kushinagar me pathology lab", "Padrauna me diagnostic centre", "lab test
       near me" — teenon ka intent ek hi hai: jaana kahan padega. Isliye alag
       heading aur us par seedha jawab, sabse pehle ye ki hamara counter hai hi
       nahi. Mau wale page se alag tark yahan ye hai ki wahan waqt ka sawaal
       hai, yahan doori aur seson ka: ganne ki peraai ke mahino me aadha din
       nikaalna sabse mehnga padta hai. */
    id: "pathology-lab-diagnostic-centre-kushinagar",
    h: "Kushinagar Ya Padrauna Me Pathology Lab Aur Diagnostic Centre Dhoondh Rahe Hain?",
    p: [
      "Pehle ek baat saaf kar dena theek rahega: hamara koi walk-in counter Kushinagar jile me nahi hai, na Padrauna me aur na Kasia me — aur is page par kahin ye nahi likha jaayega ki hai. Ye home collection service hai. Hum aapke ghar se sample lete hain, aur wahi sach hai jo yahan likha hai.",
      "Iska matlab samajh lena kaam ka hai. Sheher ke chhote collection centre par bhi aam taur par sirf sample liya jaata hai; jaanch badi lab me hoti hai aur report wahin se banti hai. Yaani sample ko safar to karna hi hai. Sawaal sirf itna hai ki us safar ki shuruaat aapke ghar se ho, ya aapke gaadi pakadne, line lagane aur wapas aane ke baad. Blood aur urine ke saare aam test sirf sample par hote hain, isliye ghar se shuruaat karna kisi tarah kam bharosemand nahi hai — bas aadha din bach jaata hai.",
      "Sample dene se pehle teen cheezein kar lijiye: phlebotomist ka ID card dekh lijiye, doctor ka parcha saamne rakh dijiye taaki wahi panel liya jaaye jo likha hai, aur jis test ke card par 'Call for price' likha hai uska daam pehle pooch lijiye. Home visit ke slot subah 6 baje se shuru hote hain aur shaam tak chalte hain. Report 24 ghante ke andar aati hai — hum 24 ghante khula lab hone ka daawa nahi karte, 24 ghante me report milne ka karte hain.",
      "Aur ek aadat jo yahan sabse zyada nuksan karti hai: jo test aap mahino tak dohrate hain — HbA1c, TSH, creatinine, haemoglobin — unhe har baar alag alag jagah se mat karaiye. Ye Padrauna me ek jagah, phir Gorakhpur me dikhane ke bahane doosri jagah, phir Deoria me teesri jagah karwa lene se hota hai. Alag machine aur method ke reference range thode alag hote hain, isliye ek jagah TSH 4.5 aur doosri jagah 4.1 aane ka matlab ye nahi ki aapka thyroid badal gaya. Doctor badlav dekhta hai, sirf aaj ka number nahi.",
    ],
  },

  {
    id: "home-sample-collection-kushinagar",
    h: "Padrauna, Kasia, Hata, Ramkola Se Khadda Aur Tamkuhi Raj Tak — Kahan Kahan Sample Liya Jaata Hai",
    p: [
      "Jile me Padrauna, Kushinagar (Kasia), Hata, Ramkola, Tamkuhi Raj, Khadda, Captainganj, Sewrahi, Fazilnagar, Dudahi, Nebua Naurangia, Vishunpura, Sukrauli aur Motichak jaise kasbe aur inse lage gaon aam taur par cover hote hain. Aapka gaon is list me naam se nahi hai to maan kar mat baithiye ki service nahi hai; booking se pehle ek call kar lijiye — cover hota hai to usi waqt slot book ho jaayega, aur nahi hota to hum saaf bata denge, taaki aap intezaar kar ke pareshan na hon.",
      "Pata likhne ka tarika is jile me doosron se zyada maayne rakhta hai, kyunki yahan gaon door door hain aur ek hi naam ke do gaon paas paas hona bahut aam hai. Gaon me sirf gaon ka naam kaafi nahi hota: tola ya purwa ka naam likhiye, saath me post office aur thana ka naam, aur ek jaana pehchana landmark — school, mandir ya masjid, chini mill, petrol pump, tiraha ya bank. Late visit ki sabse badi wajah yahi hoti hai, na ki doori.",
      "Gandak (Narayani) ke kinare wale ilaake ke liye — Khadda, Nebua Naurangia, Vishunpura aur unse lage gaon — ek baat aur jod dijiye: pahunchne ka rasta kaunsa hai, kis chauraha, bandh ya ghat se mudna hai. Barsaat ke mahino me kai raste badal jaate hain aur nadi ke paas pahunchna waqt maangta hai. Booking ke waqt ye bata dena poori visit ko aasan kar deta hai, aur slot bhi usi hisaab se rakha jaata hai.",
      "Mobile number wahi dijiye jo us waqt chalu rahega, aur ho sake to ek doosra number bhi likh dijiye. Kai gaon me network ek hi kone me aata hai, aur mill ke seson me ghar ka aadmi khet ya mill par hota hai — phlebotomist ka ek call chhoot jaane se poori visit atak jaati hai.",
      "Ghar me ek se zyada log test kara rahe hain — maa-baap, dada-dadi, bachche — to sabki booking ek hi slot me kar dijiye. Ek hi visit me sabka sample ho jaata hai. Koi bujurg hai, bistar par hai, diabetic hai jinki nas patli ho gayi hai, ya operation ke baad recovery kar raha hai — to ye booking ke waqt bata dijiye.",
    ],
  },

  {
    /* Ye section is page ka sabse zaroori hissa hai, aur wo isliye ki iska
       jawab "book kar lijiye" NAHI hai. Kushinagar AES/JE belt ke sabse
       prabhavit jilon me hai. Ise kabhi bhi booking prompt me mat badaliye. */
    id: "bachchon-me-dimaagi-bukhar-kushinagar",
    h: "Bachche Ko Tez Bukhar Ke Saath Jhatke — Ye Lab Ka Nahi, Aspatal Ka Maamla Hai",
    p: [
      "Gorakhpur–Kushinagar–Deoria belt me barsaat ke baad bachchon me dimaagi bukhar (AES / Japanese Encephalitis) ke maamle aate rahe hain, aur is jile ne wo daur bahut kareeb se dekha hai. Isliye ye baat is page par sabse upar honi chahiye, na ki kisi kone me.",
      "Bachche ko tez bukhar ke saath jhatke aayein, behoshi ho, gardan akad jaaye, lagatar ulti ho, ya wo sust pada rahe aur pehchan na paaye — to lab test book mat kijiye. Seedha najdeeki aspatal le jaaiye. Padrauna ka zila aspatal, ya Gorakhpur ka BRD — jo bhi pahunch me ho, turant. Ismein ek-ek ghanta maayne rakhta hai, aur home collection ka intezaar khatarnak hai.",
      "Blood test in halaat me pehla jawab hai hi nahi. Jo jaanch chahiye hoti hai wo aspatal me hoti hai aur usme waqt ki bandish hoti hai. Ghar par sample lena us jaanch ka vikalp nahi hai, aur hum wo daawa nahi karenge.",
      "Bukhar saada hai — jhatke nahi, behoshi nahi, gardan theek hai — to niche wala section aapke kaam ka hai: kis din kaunsa test karana chahiye. Shak ho to pehle doctor ko dikha lijiye, phir test.",
    ],
  },

  {
    id: "bukhar-dengue-typhoid-kushinagar",
    h: "Kushinagar Me Dengue, Typhoid Aur Malaria Test — Bukhar Ke Kis Din Kaunsa Test",
    p: [
      "Baadh ke paani ke baad ke hafte is jile me sabse zyada test wale hafte hote hain, aur wahi hafte hain jab sabse zyada test bekaar bhi jaate hain — isliye nahi ki lab galat hai, balki isliye ki test galat din par karaya gaya. Din ginna yahan sabse kaam ki baat hai.",
      "Dengue NS1 antigen sirf bukhar ke pehle 1 se 5 din me bharosemand hai. Paanchve din ke baad NS1 aksar negative aa jaata hai, aur tab Dengue IgM antibody karana chahiye. Typhoid ke Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye — pehle karane par jhootha negative aata hai aur dobara karana padta hai. Thand aur kampkampi ke saath bukhar ho to malaria ki jaanch, kyunki paani bharne wale ilaakon me wo abhi bhi milta hai.",
      "Koi bhi bukhar ho, CBC saath me zaroor karayein. Platelet count aur haematocrit wahi do number hain jo doctor roz dekhta hai, aur wahi batate hain ki maamla ghar par sambhal jaayega ya bharti karna padega. Aankhon me peelapan, gehra peshab aur bhookh khatm ho jaaye to LFT karayein — Gandak ke paani ke baad hepatitis A aur E ka mausam yahi hota hai.",
      "Ek cheez jo yahan aksar der se hoti hai: bukhar teen din se zyada khinch jaaye to intezaar mat kijiye. Seson me chini mill aur khet ka kaam chhodna mushkil hota hai, isliye log paanchve-chhathe din tak dawa se kaam chalate hain — aur tab tak wo din nikal chuka hota hai jismein dengue ka sahi test hota.",
    ],
  },

  {
    id: "ganna-mill-mazdoor-kushinagar",
    h: "Ganne Ke Khet Aur Chini Mill Me Kaam Karne Walon Ke Liye — Kaunsi Jaanch Kaam Ki Hai",
    p: [
      "Ramkola, Padrauna, Khadda, Sewrahi aur Captainganj ke aas-paas ka bada hissa ganne par chalta hai, aur peraai ke seson me kaam lamba, dhoop me aur bhaari hota hai. Is tarah ke kaam me teen cheezein aam hain, aur teenon ek hi sample se pakad me aa jaati hain: haemoglobin ki kami, vitamin D aur B12 ki kami, aur thyroid ki gadbadi jo thakan ko aur badha deti hai. CBC, Vitamin D, Vitamin B12 aur TSH — chaaron ek hi home visit me ho jaate hain.",
      "Seson me pani kam peena aur pasine ka nuksan bhi aam hai. Isse kidney ke number — urea aur creatinine — jhoothe taur par badhe hue dikh sakte hain. Isliye KFT karane se pehle do din theek se paani peejiye, aur sample dene wale ko bata dijiye ki aap dhoop me bhaari kaam karte hain. Number padhne wale ke liye ye jaankari maayne rakhti hai.",
      "Ek jaanch jo yahan log maangte hain aur jo hum nahi karte, wo saaf bata dena zaroori hai: do hafte se zyada khaansi, shaam ko bukhar, raat ko paseena, wazan girna ya balgam me khoon ho to TB ka shak hota hai — aur uski jaanch balgam se hoti hai, khoon se nahi. Wo najdeeki sarkari aspatal ya DOTS centre par muft hoti hai. TB ka antibody wala blood test bharosemand nahi hai aur hum wo karte bhi nahi.",
      "Machine par kaam karte waqt kat jaana, ya kisi purani chot ka theek na hona — inmein blood sugar dekhna kaam ka hota hai. Ghaav der se bharna diabetes ka sabse aam anadekha ishaara hai, aur uski jaanch sirf ek fasting sugar aur HbA1c se ho jaati hai.",
    ],
  },

  {
    id: "gorakhpur-travel-kushinagar",
    h: "Gorakhpur Dikhane Ja Rahe Hain — Report Ek Din Pehle Taiyaar Rakhiye",
    p: [
      "Kushinagar se specialist dikhane ka matlab aksar Gorakhpur hota hai — Padrauna se kareeb 50 kilometre. Aur wahan ka sabse thakane wala hissa ilaaj nahi, chakkar hai: subah nikliye, OPD me number lagaiye, doctor test likh de, wahin kisi lab me sample dijiye, report ka intezaar kijiye — ya doosre din phir se aaiye.",
      "Iska seedha hal ye hai ki jo test doctor pichhli baar likh chuka hai, ya jo follow-up har visit par dohraya jaata hai — HbA1c, TSH, creatinine, haemoglobin — wo Kushinagar me hi ek din pehle karwa lijiye. Report 24 ghante me PDF me phone par aa jaati hai, aur aap OPD me parcha le kar nahi, report le kar ghuste hain. Ek poora din aur ek poora kiraya bach jaata hai.",
      "Operation se pehle maange jaane wale routine test bhi isi tarah pehle ho sakte hain, agar doctor ne list de rakhi hai. Us din jo naya test doctor likhe, wo alag baat hai — lekin dohraye jaane wale test pehle karwa lena hamesha faayde ka sauda hai.",
      "Ek baat dhyaan rahe: follow-up test hamesha ek hi lab me karayein. Gorakhpur me ek baar, Padrauna me doosri baar karwane se number badla hua lagta hai jabki sehat waisi ki waisi hoti hai — reference range machine aur method ke saath badalti hai, aapka thyroid nahi.",
    ],
  },

  {
    id: "diabetes-thyroid-screening-kushinagar",
    h: "Sugar, HbA1c Aur Thyroid — Dawa Bahar Se Shuru Hui, Follow-up Yahin Chhoot Jaata Hai",
    p: [
      "Is jile me ek pattern bahut aam hai: dawa Gorakhpur ya kisi bade sheher se shuru hoti hai, aur uske baad follow-up chhoot jaata hai — kyunki har teen mahine me wahi safar dobara karna mushkil hai. Nateeja ye hota ki dawa saalon chalti rehti hai aur ye kabhi pata nahi chalta ki wo kaam kar bhi rahi hai ya nahi.",
      "Jinhe diabetes hai unke liye teen cheezein tay hain: HbA1c har teen mahine, saal me ek baar lipid profile, aur saal me ek baar kidney function ke saath urine microalbumin. Urine microalbumin sabse pehla ishaara deta hai ki diabetes kidney par asar daalna shuru kar chuka hai — aur yahi test log sabse zyada chhodte hain. Teenon ghar se sample de kar ho jaate hain, isliye follow-up chhootne ki koi wajah nahi bachti.",
      "Thyroid ki dawa chal rahi ho to TSH dawa ki dose badalne ke 6 se 8 hafte baad dohrana chahiye, uske pehle nahi — pehle karane par number abhi tak sthir hua hi nahi hota. Aur test ke din goli blood nikalne ke BAAD lijiye, pehle nahi; pehle lene par T4 jhootha zyada dikhta hai aur dose galat adjust ho sakti hai.",
      "Naya shak ho — zyada pyaas, raat me baar-baar peshab, ghaav der se bharna, ya wazan-baal-thakan ki shikayat — to shuruaat seedhi hai: fasting sugar ke saath HbA1c, aur thyroid ke liye TSH ke saath T3-T4. Ek hi sample me dono panel ho jaate hain.",
    ],
  },

  {
    id: "full-body-checkup-kushinagar",
    h: "Kushinagar Me Full Body Checkup Package — Kis Package Me Kya Hota Hai",
    p: [
      "Full body checkup ka matlab ye nahi ki sab kuch jaanch liya gaya. Matlab ye hai ki paanch system ek saath dekhe gaye — khoon (CBC), sugar, liver (LFT), kidney (KFT) aur lipid. Basic package yahi paanch deta hai, aur 30 saal ke baad saal me ek baar iske liye kisi shikayat ki zaroorat nahi hoti.",
      "Advanced package inhi ke saath thyroid, HbA1c aur vitamin jodta hai. 40 ke baad, ya ghar me diabetes ya thyroid ki history ho, to yahi sahi level hai. Senior package 55 ke upar walon ke liye hai — dil, haddi aur sugar ki screening ek saath.",
      "Parameter ki ginti par mat jaaiye. Ek CBC akela hi 20 se zyada parameter gin leta hai, isliye \"80+ parameters\" wala package agar thyroid ya HbA1c chhod deta hai to wo 45 parameter wale se kamzor hai. Package chunte waqt ginti nahi, ye dekhiye ki wo paanch system cover ho rahe hain ya nahi — aur aapki apni shikayat ka test usme hai ya nahi.",
      "Ghar ke chaar log ek saath checkup kara rahe hain to ek hi slot me sabki booking kar dijiye. Ek visit, ek phlebotomist, aur sabki report usi 24 ghante ke andar. Videsh ya bade sheher se koi ghar aaya hua hai to yahi sabse achha waqt hota hai — aur wo mauka aksar nikal jaata hai.",
    ],
  },

  {
    id: "lab-test-price-kushinagar",
    h: "Kushinagar Me Lab Test Price Aur Rate List — Kaunsa Test Kitne Ka",
    p: [
      "Rate poore jile me ek hi hai. Padrauna me jo daam hai, wahi Khadda, Tamkuhi Raj, Sewrahi aur Nebua Naurangia me hai — doori ke naam par kuch nahi badhta, aur home sample collection bilkul free hai. Na visiting charge, na convenience fee, na baad me judne wala koi amount.",
      "Blood Sugar ₹100, CBC ₹400, Thyroid Profile ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1000, Vitamin B12 ₹1200 aur Dengue ₹1200. Package me Basic Full Body Checkup ₹999 se, Advanced Full Body ₹1999 se aur Senior Citizen Pack ₹2999 se shuru hota hai. Kuch test — jaise Fever Panel — parche ke hisaab se banaye jaate hain, isliye unka daam call par bataya jaata hai; wo daam booking se pehle bata diya jaata hai, sample lene ke baad nahi.",
      "Payment sample lene ke waqt hota hai, cash ya UPI se — PhonePe, Google Pay ya Paytm. Advance kisi cheez ka nahi lagta. Booking ke waqt total pooch lena aapka haq hai, aur jo total us waqt bataya jaaye wahi aana chahiye.",
      "Ek baat jo paise se zyada bachati hai: ek hi visit me ghar ke sabhi logon ka sample karwa lijiye. Chaar log alag alag din par karayein to chaar visit hoti hain aur chaar baar taalne ka mauka milta hai; ek slot me ho jaaye to kisi ka test chhootta nahi.",
    ],
  },

  {
    id: "prepare-for-test-kushinagar",
    h: "Sample Dene Se Pehle Kya Karein — Fasting Ke Niyam Aur Khet-Mill Ki Shift Ke Hisaab Se Waqt",
    p: [
      "Fasting sirf blood sugar, lipid profile, insulin aur zyadatar full body package me chahiye — 10 se 12 ghante. 14 ghante se zyada faaka karne se result bigadta hai, sudharta nahi. CBC, thyroid, HbA1c, vitamin D, B12, dengue aur urine routine me fasting ki zaroorat nahi hoti.",
      "Fasting ke dauran saada paani peete rahiye. Paani ki kami haemoglobin, urea aur creatinine ko jhoothe taur par badha deti hai — aur dhoop me kaam karne walon me ye galti sabse aam hai. Chai, doodh aur toffee bhi fasting todte hain; sirf paani chalta hai.",
      "Khet ya mill ki shift ke hisaab se slot chuniye. Peraai ke seson me subah 6 baje ka slot sabse aasan padta hai — sample ho jaata hai aur din ka kaam nahi rukta. Raat ki shift karne wale apne \"din\" ke hisaab se sochein: sone se pehle ke 10-12 ghante ka faaka hi aapki fasting hai, aur sample uske turant baad hona chahiye.",
      "Thyroid ki goli blood nikalne ke BAAD lijiye. Biotin ya multivitamin supplement kisi bhi hormone test se 48 se 72 ghante pehle band kar dijiye — biotin assay me interfere karta hai. Baaki regular dawaiyan usi samay par leni chahiye jab tak doctor mana na kare. Purani report, chal rahi dawaiyon ki list aur doctor ka parcha saamne rakh dijiye.",
    ],
  },

  {
    id: "reports-kushinagar",
    h: "Report Kab Milegi — 24 Ghante Me WhatsApp Par PDF, Aur Usmein Kya Dekhein",
    p: [
      "Routine test ki report 24 ghante ke andar WhatsApp aur email dono par PDF me aa jaati hai. Culture jaise kuch test 48 se 72 ghante lete hain, aur ye booking ke waqt hi bata diya jaata hai — taaki aap doctor ka appointment usi hisaab se rakhein. Report lene ke liye kahin jaana nahi padta.",
      "Report par \"High\" ya \"Low\" ka flag diagnosis nahi hai, doctor se milne ka ishaara hai. Thoda sa range se bahar hona bahut aam hai aur aksar harmless. Report ke saath chhapi reference range hi padhiye — internet ke chart se mat milaiye, kyunki har lab ka analyser aur method alag hota hai aur range usi ke hisaab se chhapi jaati hai.",
      "Chaar result aise hain jinmein intezaar nahi karna chahiye: tezi se girta platelet count; bahut zyada blood sugar ke saath ulti ya susti; khatarnak had tak kam haemoglobin; aur bahut badha creatinine ke saath peshab ka kam ho jaana. Inmein usi din doctor ko dikhaiye.",
      "Purani report sambhaal kar rakhiye — phone me ek folder kaafi hai. Doctor ko sirf aaj ka number nahi, badlav dekhna hota hai, aur wahi badlav batata hai ki dawa kaam kar rahi hai ya nahi.",
    ],
  },

  {
    id: "how-to-book-kushinagar",
    h: "Kushinagar Me Lab Test Kaise Book Karein — Online Form Ya Ek Phone Call",
    p: [
      "Booking ka tarika seedha hai. Is page par upar diye form me apna naam, mobile number, ilaaka aur test chuniye — ya seedha call kar dijiye. Doctor ka parcha hai to uski photo taiyaar rakhiye; usi panel ke hisaab se booking ho jaayegi.",
      "Lagbhag 30 minute me confirmation call aata hai. Usmein teen cheezein tay hoti hain: slot ka waqt, poora pata landmark ke saath, aur ye ki test me fasting chahiye ya nahi. Isi call par total daam bhi bata diya jaata hai.",
      "Slot subah 6 baje se shuru hote hain aur shaam tak chalte hain. Fasting wale test subah rakhwaiye; baaki test din me kabhi bhi ho jaate hain. Phlebotomist ID card ke saath aata hai aur sample aapke saamne leta hai.",
      "Booking ke waqt ye zaroor bata dijiye: ghar me kitne logon ka test hai, koi bujurg ya bistar par to nahi, aur gaon me hain to tola, post office aur landmark. Ye teen jaankariyan hi wo cheez hain jo visit ko time par pahunchati hain.",
    ],
  },

  {
    /* Devanagari section. Is jile ka bada hissa Hindi me hi search karta hai,
       aur poora page Hinglish me hone ke kaaran Devanagari query se choot jaata
       tha. Ye anuvaad nahi hai — yahan wahi baatein hain jo upar hain, chhoti
       aur seedhi shakl me, taaki ye duplicate content na bane. */
    id: "kushinagar-lab-test-hindi",
    h: "कुशीनगर (पडरौना) में लैब टेस्ट — घर से सैंपल कलेक्शन की पूरी जानकारी (हिंदी में)",
    p: [
      "कुशीनगर जिले में खून और पेशाब की सभी सामान्य जाँच घर बैठे हो जाती हैं। आपको कहीं जाना नहीं पड़ता — प्रशिक्षित फ्लेबोटोमिस्ट पहचान पत्र के साथ आपके घर आता है, आपके सामने सैंपल लेता है, और रिपोर्ट 24 घंटे के अंदर व्हाट्सएप और ईमेल पर पीडीएफ में आ जाती है। होम सैंपल कलेक्शन पूरी तरह मुफ़्त है; आप सिर्फ़ जाँच का वही दाम देते हैं जो कार्ड पर लिखा है।",
      "जिला मुख्यालय पडरौना है और कुशीनगर (कसया) वह तीर्थ स्थल है जहाँ महापरिनिर्वाण मंदिर है — दोनों जगह यही सेवा उपलब्ध है। इसके अलावा हाटा, रामकोला, तमकुहीराज, खड्डा, कप्तानगंज, सेवरही, फ़ाज़िलनगर, दुदही, नेबुआ नौरंगिया और विशुनपुरा जैसे कस्बे और उनसे लगे गाँव भी शामिल हैं। अपने गाँव का नाम सूची में न दिखे तो एक बार फ़ोन कर लीजिए।",
      "कौन सी जाँच कब — यह सबसे ज़रूरी बात है। बुख़ार के पहले 1 से 5 दिन में डेंगू NS1, पाँचवें दिन के बाद डेंगू IgM, और टाइफ़ाइड की विडाल जाँच के लिए कम से कम 5 से 7 दिन का बुख़ार चाहिए। हर बुख़ार में CBC साथ में ज़रूर कराएँ। शुगर, लिपिड और ज़्यादातर फुल बॉडी पैकेज में 10 से 12 घंटे खाली पेट रहना पड़ता है; उस दौरान सादा पानी पीते रहिए।",
      "एक चेतावनी जो इस जिले के लिए सबसे ज़रूरी है: बच्चे को तेज़ बुख़ार के साथ झटके आएँ, बेहोशी हो, गर्दन अकड़ जाए या वह सुस्त पड़ा रहे — तो जाँच बुक मत कीजिए, सीधे नज़दीकी अस्पताल ले जाइए। ऐसे में एक-एक घंटा मायने रखता है और घर पर सैंपल का इंतज़ार ख़तरनाक है।",
      "बुकिंग के लिए ऊपर दिया फ़ॉर्म भर दीजिए या फ़ोन कर दीजिए। लगभग 30 मिनट में कॉल आकर समय, पता और यह तय हो जाता है कि जाँच में खाली पेट रहना है या नहीं। भुगतान सैंपल लेते समय नक़द या यूपीआई से होता है।",
    ],
  },
];

/**
 * Kushinagar's FAQs.
 *
 * Every one is this district's own question. Deliberately NOT copied from
 * defaultFaqs(): the generated set answers "kya aap mere ilaake me aate hain"
 * and "kitna kharcha" in a city-neutral way, and this district's versions have
 * to carry the Padrauna/Kasia split, the mill season and the AES warning.
 *
 * The rate line in the first answer must match the price section above AND
 * defaultTests() in src/data/lab/defaults.js. Those three are the only places
 * a price appears for this city.
 */
export const kushinagarFaqs = [
  {
    q: "Kushinagar me lab test ka kitna kharcha aata hai, aur kya home sample collection free hai?",
    a: "Aap sirf test ka wahi price dete hain jo card par likha hai — home sample collection bilkul free hai, na visiting charge na koi hidden fee. Rate is tarah hai: Blood Sugar ₹100, CBC ₹400, Thyroid Profile ₹550, HbA1c ₹600, Lipid Profile ₹800 aur Basic Full Body Checkup ₹999 se shuru. Khadda, Tamkuhi Raj ya Nebua Naurangia jaise door ke kasbon me bhi wahi rate lagta hai jo Padrauna me hai. Payment sample lene ke waqt cash ya UPI se hota hai.",
  },
  {
    q: "Kya Kushinagar ya Padrauna me aapka koi lab ya collection centre hai?",
    a: "Nahi — hamara koi walk-in counter is jile me nahi hai, na Padrauna me aur na Kasia me, aur hum aisa daawa nahi karte. Ye home collection service hai: trained phlebotomist ID card ke saath aapke ghar aata hai aur sample wahin liya jaata hai. Home visit ke slot subah 6 baje se shuru hote hain aur shaam tak chalte hain. Hum 24 ghante khula lab hone ka daawa bhi nahi karte; report 24 ghante ke andar milne ka karte hain.",
  },
  {
    q: "Jila Kushinagar hai lekin main Padrauna me rehta hoon — kya ye page mere liye hai?",
    a: "Haan. Kushinagar jile ka mukhyalaya Padrauna hi hai, aur Kushinagar (Kasia) wo teerth sthal hai jo wahan se kareeb 15 kilometre door hai. Is page ki har service dono jagah laagu hoti hai, aur rate bhi wahi hai. Aap \"Padrauna me blood test\" dhoondhein ya \"Kushinagar me lab test\" — booking ka tarika, slot aur report sab ek hi hai.",
  },
  {
    q: "Kushinagar jile me aap kaun kaun se kasbe cover karte hain?",
    a: "Padrauna, Kushinagar (Kasia), Hata, Ramkola, Tamkuhi Raj, Khadda, Captainganj, Sewrahi, Fazilnagar, Dudahi, Nebua Naurangia, Vishunpura, Sukrauli aur Motichak — aur inse lage gaon bhi aam taur par cover hote hain. Aapka gaon is list me naam se na ho to bhi ek baar call kar ke pooch lijiye. Pata likhte waqt tola ya purwa ka naam, post office, thana aur ek landmark zaroor likhiye — ek hi naam ke do gaon paas paas hona yahan aam hai, aur late visit ki sabse badi wajah yahi hoti hai.",
  },
  {
    q: "Bachche ko tez bukhar ke saath jhatke aa rahe hain — kaunsa test book karein?",
    a: "Koi test book mat kijiye. Tez bukhar ke saath jhatke, behoshi, gardan ki akdan, lagatar ulti ya bahut susti — ye AES ya dimaagi bukhar ke ishaare ho sakte hain, aur is belt me wo maamle aate rahe hain. Seedha najdeeki aspatal le jaaiye — Padrauna ka zila aspatal ya Gorakhpur ka BRD, jo bhi pahunch me ho. Ismein ek-ek ghanta maayne rakhta hai aur home collection ka intezaar khatarnak hai. Blood test iska pehla jawab hai hi nahi.",
  },
  {
    q: "Bukhar aaya hai — dengue ka test kis din karana chahiye?",
    a: "Dengue NS1 antigen sirf bukhar ke pehle 1 se 5 din me bharosemand hai; paanchve din ke baad wo aksar negative aa jaata hai aur tab Dengue IgM antibody karana chahiye. Typhoid ke Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye — pehle karane par jhootha negative aata hai. Koi bhi bukhar ho, CBC saath me zaroor karayein: platelet count aur haematocrit hi wo do number hain jo doctor roz dekhta hai. Bukhar teen din se zyada khinch jaaye to intezaar mat kijiye.",
  },
  {
    q: "Gorakhpur me doctor dikhana hai — test Kushinagar me karayein ya wahin?",
    a: "Jo test doctor pehle se likh chuka hai ya jo har visit par dohraye jaate hain — HbA1c, TSH, creatinine, haemoglobin — unhe yahin ek din pehle karwa lijiye. Report 24 ghante me PDF me aa jaati hai, aur aap OPD me parcha le kar nahi, report le kar ghuste hain: ek poora din aur ek poora kiraya bach jaata hai. Follow-up test hamesha ek hi lab me karayein — alag machine aur method ki reference range thodi alag hoti hai, isliye number badla hua lagta hai jabki sehat waisi ki waisi hoti hai.",
  },
  {
    q: "Ganne ke khet ya chini mill me kaam karte hain, lambe samay se khaansi hai — kaunsa test karayein?",
    a: "Lambi khaansi ka jawab khoon ki jaanch nahi hai. Do hafte se zyada khaansi, shaam ko bukhar, raat ko paseena, wazan girna ya balgam me khoon ho to TB ka shak hota hai, aur uski jaanch balgam se hoti hai — najdeeki sarkari aspatal ya DOTS centre par, muft. TB ka antibody wala blood test bharosemand nahi hai aur hum wo karte bhi nahi. Jo hum kar sakte hain wo alag hai: dhoop me bhaari kaam karne walon me haemoglobin ki kami, Vitamin D aur B12 ki kami aur thyroid ki gadbadi aam hai — CBC, Vitamin D, Vitamin B12 aur TSH ek hi sample me ghar par ho jaate hain.",
  },
];
