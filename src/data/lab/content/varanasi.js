/**
 * Long-form SEO copy for /lab-test/varanasi.
 *
 * This text used to live in defaultContent() in src/data/lab/defaults.js, where
 * it was treated as the fallback for EVERY city — with `${city}` interpolated
 * into sentences whose facts were Varanasi's alone. The moment a second city
 * (Deoria) was added, its page went live claiming "Deoria poore Purvanchal ka
 * healthcare centre hai" and offering home collection in Assi Ghat, Sarnath,
 * DLW, Godowlia and the Babatpur airport route — none of which are in Deoria.
 *
 * So the Varanasi copy now lives here, under Varanasi's own name, and the
 * city-specific claims are hardcoded rather than templated. Nothing about the
 * rendered Varanasi page changes: the old defaults were only ever correct for
 * this one city, and this is that same text with `${city}` resolved.
 *
 * Section ids are unchanged on purpose — LabContent turns `id` into the anchor
 * target, so an existing link to #lab-test-in-varanasi still lands.
 */
export const varanasiContent = [
  {
    id: "lab-test-in-varanasi",
    h: "Varanasi Me Lab Test — Online Blood Test Booking, Free Home Sample Collection",
    p: [
      "Varanasi poore Purvanchal ka healthcare centre hai. Chandauli, Jaunpur, Ghazipur, Mirzapur, Bhadohi, Ballia, Azamgarh aur Bihar ke border districts se roz patients yahan aate hain — kyunki specialist doctors, tertiary hospitals aur bade diagnostic labs asal me yahi par hain. Iska matlab ye bhi hai ki Lanka, Sunderpur, Bhelupur aur Cantt ki labs me subah 7 baje se 10 baje tak lambi line lagti hai, kyunki har fasting sample isi window me dena hota hai.",
      "Lab test online book karne se ye poori line hat jaati hai. Aap apna test ya health package choose kijiye, morning slot select kijiye, aur trained phlebotomist aapke ghar Varanasi me aa kar aapke saamne fresh sterile needle se sample leta hai. Report seedhe aapke phone par PDF me aa jaati hai. Na traffic me travel, na khaali pet plastic chair par intezaar, aur na hi counter par bill dekh kar surprise.",
      "Aap individual test bhi book kar sakte hain — CBC, thyroid profile, HbA1c, liver function test, kidney function test, lipid profile, vitamin D aur vitamin B12 — ya phir ek hi sample me 60 se 90 parameter wala full body health checkup. Doctor ka likha hua panel, pre-employment checkup, surgery se pehle ki jaanch, pregnancy profile aur saal me ek baar hone wali routine screening, sab isi tarike se book hoti hai.",
    ],
  },

  {
    id: "home-sample-collection-varanasi",
    h: "Poore Varanasi Me Free Home Sample Collection",
    p: [
      "Certified phlebotomist aapke address par sealed collection kit, single-use vacutainer, nayi disposable needle aur barcode printer le kar aata hai. Tube aapke saamne label aur barcode hoti hai, isliye do patients ke sample aapas me badalne ka koi chance nahi rehta. Uske baad sample temperature-controlled box me lab tak jaata hai — kyunki Varanasi ki dopahar ki garmi me garam hua blood sample potassium, LDH aur glucose ki galat value de deta hai.",
      "Subah 6:30 se 10:30 baje ke slot fasting tests ke liye rakhe jaate hain, jaise fasting blood sugar, lipid profile aur insulin. Non-fasting tests jaise CBC, thyroid profile, dengue NS1, vitamin D ya HbA1c din bhar kabhi bhi ho sakte hain. Ghar me koi bujurg hai, bed-rest par hai, diabetic hai jinki vein patli ho gayi hai, ya operation ke baad recovery kar raha hai — to booking ke waqt bata dijiye, taki experienced phlebotomist bheja jaaye.",
      "Home collection poore sheher me available hai: Lanka, Sunderpur, Nagwa, Assi Ghat, Samne Ghat, Ravindrapuri, Bhelupur, Durgakund, Sigra, Mahmoorganj, Maldahiya, Cantt, Nadesar, Kachahari, Chowk, Godowlia, Dashashwamedh, Lahurabir, Bhojubir, Pandeypur, Ashapur, Sarnath, Shivpur, Chandmari, DLW, Chitaipur, Susuwahi, Karaundi, Lahartara, Manduadih, Rathyatra, Bajardiha, Ramnagar, aur Ring Road tatha Babatpur airport route ki nayi colonies.",
      "Purane sheher ki tangg galiyon me — Chowk, Godowlia aur ghaton ke aas paas, jahan char pahiya gaadi ja hi nahi sakti — collection two-wheeler se hoti hai. Isliye booking karte waqt location theek se pin kijiye aur ek landmark zaroor likhiye. Agar ghar ke teen-chaar log ek saath test kara rahe hain to sabka sample ek hi slot me book kijiye: ek visit, ek trip, aur aksar package discount bhi.",
    ],
  },

  {
    id: "popular-blood-tests-varanasi",
    h: "Varanasi Me Sabse Zyada Book Hone Wale Blood Tests Aur Wo Kya Batate Hain",
    p: [
      "Complete Blood Count (CBC) sheher ka sabse zyada order hone wala test hai. Ye haemoglobin, RBC, WBC aur platelet count naapta hai, aur bukhar, kamzori, baar-baar infection ya anaemia ke shak me doctor sabse pehle yahi likhte hain. Purvanchal me anaemia bahut aam hai, khaas kar auraton aur teenage ladkiyon me — isliye haemoglobin kam aane par aage iron studies, ferritin aur vitamin B12 kiya jaata hai.",
      "Thyroid Profile (TSH, T3, T4) doosre number par hai. Bina wajah wazan badhna ya ghatna, baal jhadna, periods ka irregular hona, hamesha thakan, thand zyada lagna, ya infertility ki jaanch — sab isi test tak le aate hain. Hypothyroidism North India me bahut common hai aur diagnose hone ke baad aasani se control ho jaata hai, lekin test karayenge tabhi pata chalega. Jo log pehle se thyroxine le rahe hain, unhe dose change ke baad har 6 se 8 hafte me TSH dohrana chahiye, phir har 6 se 12 mahine me.",
      "Diabetes ke test — Fasting Blood Sugar, Post Prandial Blood Sugar aur HbA1c — iske turant baad aate hain. HbA1c pichhle 2 se 3 mahine ka average sugar control batata hai aur ismein fasting ki zaroorat nahi hoti, isliye jinka khaane ka time fix nahi rehta unke liye ye sabse bharosemand test hai. Jo pehle se diabetic hain unhe har teen mahine me HbA1c aur saal me ek baar kidney function ke saath urine microalbumin karana chahiye.",
      "Baaki top list ye hai: cholesterol aur triglycerides ke liye Lipid Profile, bilirubin, SGOT, SGPT aur alkaline phosphatase ke liye Liver Function Test (LFT), urea, creatinine aur uric acid ke liye Kidney Function Test (KFT/RFT), Vitamin D aur Vitamin B12, Urine Routine aur Microscopy, Blood Group aur Rh typing, inflammation ke liye ESR aur CRP, aur bukhar ka panel — Dengue NS1, Widal, Malaria aur Typhidot. Hepatitis B (HBsAg), Hepatitis C aur HIV screening operation se pehle, dialysis se pehle aur pregnancy me aksar karayi jaati hai.",
    ],
  },

  {
    id: "full-body-checkup-varanasi",
    h: "Varanasi Me Full Body Health Checkup — Ismein Kya Kya Hona Chahiye",
    p: [
      "Asli full body checkup sirf parameter ki lambi list nahi hoti. Kam se kam paanch system cover hone chahiye: blood (CBC, ESR), sugar (fasting glucose aur HbA1c), heart risk (complete lipid profile), liver (poora LFT with albumin aur globulin), aur kidney (urea, creatinine, uric acid, electrolytes ke saath urine routine). Iske upar thyroid profile, vitamin D aur B12 jod dijiye — tab package me sach me kuch pakad me aata hai.",
      "Basic package aam taur par 45 se 60 parameter ka hota hai aur 30 saal se kam umar ke healthy logon ke yearly baseline ke liye theek hai. Advanced package 70 se 85 parameter ka hota hai, jismein thyroid, vitamins, iron studies aur electrolytes jud jaate hain — 30 se 50 saal ke working adults ke liye yahi sahi fit hai. Comprehensive package 90 se 100+ parameter ka hota hai, jismein cardiac risk markers, HbA1c, urine microalbumin aur kabhi kabhi 50 se upar ke purushon ke liye PSA ya mahilaon ke liye hormone panel bhi shamil hota hai.",
      "Package price dekh kar nahi, apne risk dekh kar chuniye. Ghar me diabetes ya heart disease ki history hai to basic package me bhi HbA1c, lipid profile aur kidney markers ko priority dijiye. Din bhar desk par baithte hain aur dhoop kam milti hai to extra liver enzymes se zyada zaroori vitamin D aur B12 hai. Aur agar aap vegetarian hain — jo Varanasi ke zyadatar gharon me hai — to B12 deficiency itni common hai ki use saal ke panel me jagah milni hi chahiye.",
    ],
  },

  {
    id: "lab-test-price-varanasi",
    h: "Varanasi Me Lab Test Price (Indicative Range)",
    p: [
      "Varanasi ka rate Delhi aur Lucknow se kaafi kam padta hai, lekin ek achhe, established lab aur chhote collection point ke beech farq bahut hota hai. Sheher me aam taur par milne wale range: CBC ₹200–₹400, ESR ₹100–₹200, Fasting Blood Sugar ₹80–₹150, HbA1c ₹400–₹700, Lipid Profile ₹450–₹800, Liver Function Test ₹450–₹800, Kidney Function Test ₹500–₹900.",
      "Hormone aur vitamin ke liye: Thyroid Profile (T3, T4, TSH) ₹350–₹600, Vitamin D (25-OH) ₹900–₹1,600, Vitamin B12 ₹700–₹1,200, Ferritin ₹500–₹900, Urine Routine ₹100–₹250. Bukhar ke season ke test: Dengue NS1 Antigen ₹600–₹1,100, Dengue IgG/IgM ₹700–₹1,200, Widal ₹200–₹400, Malaria Antigen ₹300–₹600, Typhidot ₹500–₹900.",
      "Asli bachat health package me hoti hai. Basic full body checkup aam taur par ₹999 se ₹1,499 ke beech, advanced package ₹1,800 se ₹2,800 ke beech, aur comprehensive package ₹3,000 se ₹5,000 ke beech aata hai — wahi test alag alag karane par bill aasani se ₹8,000 paar kar jaata hai.",
      "Paisa dene se pehle do cheezein confirm kar lijiye: home collection sach me free hai ya bill ke end me jud jaayega, aur quoted price usi method ka hai jo aapke doctor ne likha hai (CLIA aur ECLIA method purane ELISA se mehnge hote hain lekin hormone ke liye zyada reliable hain). Jo test ₹150 sasta hai lekin dobara sahi lab me karana pade, wo sasta nahi hai.",
    ],
  },

  {
    id: "fever-dengue-typhoid-testing-varanasi",
    h: "Varanasi Me Bukhar: Dengue, Typhoid, Malaria Aur Jaundice Ki Jaanch",
    p: [
      "July se November tak sheher me viral fever, dengue aur typhoid tezi se badhte hain — monsoon ke baad jal-bharav, purane wardon me ghani basti, aur cooler tatha chhat ki tanki me jama paani machhar ke liye perfect conditions bana dete hain. Sabse badi galti jo patients karte hain wo hai galat din par galat test karana, jisse ilaaj lagbhag ek hafta late ho jaata hai.",
      "Timing sabse zaroori hai. Dengue NS1 antigen sirf bukhar ke pehle 1 se 5 din me hi bharosemand hai. Paanchve din ke baad NS1 aksar negative aa jaata hai aur tab Dengue IgM antibody karana padta hai. Doosre din IgM ya aathve din NS1 karayenge to dengue hone ke bawajood report negative aa sakti hai. Dono me se koi bhi test ho, saath me CBC zaroor jodiye — girta hua platelet count aur badhta haematocrit hi wo cheez hai jo doctor roz monitor karta hai.",
      "Typhoid me Widal test ke liye kam se kam 5 se 7 din ka bukhar chahiye, tabhi antibody titre badhte hain; doosre din karaya gaya Widal lagbhag bekaar hota hai. Aur jahan typhoid endemic hai, wahan purane infection se bhi Widal positive aa sakta hai. Typhidot IgM jaldi positive hota hai, aur pehle hafte me blood culture aaj bhi sabse pakka jawab deta hai. Jis bukhar me thand aur kanpkanpi ho, usme malaria antigen aur peripheral smear zaroor jodiye.",
      "Jaundice Varanasi ka doosra khaas pattern hai. Paani se failne wale Hepatitis A aur Hepatitis E garmi me aur monsoon ke baad badh jaate hain, khaas kar wahan jahan peene ka paani aur sewage line paas paas chalti hai. Aankhon ka peelapan, gehra peshab, ulti jaisa lagna aur bhookh khatam hona — in sab par LFT (total aur direct bilirubin ke saath), Hepatitis A IgM aur Hepatitis E IgM karana chahiye. Pregnancy me jaundice ho to turant doctor ko dikhaiye, kyunki Hepatitis E garbhawastha me kahin zyada khatarnak hota hai.",
    ],
  },

  {
    id: "diabetes-thyroid-heart-screening",
    h: "Diabetes, Thyroid Aur Heart Risk Screening",
    p: [
      "Duniya ki sabse badi diabetic aabadi me se ek India me hai, aur bahut bade hisse ko tab tak pata hi nahi chalta jab tak koi complication saamne na aa jaaye. Agar aapki umar 30 se upar hai, kamar ke aas paas wazan zyada hai, mummy-papa ya bhai-behen me kisi ko diabetes hai, ya pregnancy me sugar badha tha — to saal me ek baar fasting sugar aur HbA1c zaroor karayein. Aur agar pyaas zyada lag rahi hai, raat me baar baar peshab aa raha hai, ghaav der se bhar rahe hain ya wazan achanak gir raha hai, to intezaar mat kijiye.",
      "Jinhe pehle se diabetes hai, unka saal bhar ka schedule seedha sa hai: har teen mahine me HbA1c, saal me ek baar lipid profile, saal me ek baar kidney function ke saath urine microalbumin, aur saal me ek baar aankhon ka fundus check. Urine microalbumin sabse pehla warning hai ki diabetes kidney par asar daal raha hai — aur yahi test log sabse zyada chhodte hain.",
      "Thyroid test ke liye log zyada hi intezaar karte hain. 35 ke baad mahilayein, jinke parivaar me history hai, pregnancy plan kar rahi ya pehli trimester wali mahilayein, aur jinko lagatar thakan, baal jhadna ya periods ki gadbadi hai — sabko ek baar TSH karana chahiye. Subclinical hypothyroidism, yaani TSH badha hua lekin T3 aur T4 normal, kaafi common hai aur aksar sirf monitoring maangta hai — isi wajah se ek baseline value haath me hona faydemand hai.",
    ],
  },

  {
    id: "pregnancy-women-health-tests",
    h: "Varanasi Me Pregnancy Aur Women's Health Tests",
    p: [
      "Pehli trimester ke standard antenatal panel me CBC, blood group aur Rh typing, fasting aur post-prandial sugar ya OGTT, TSH, urine routine aur culture, HIV, HBsAg, VDRL, aur aksar thalassemia screen shamil hota hai. Rh-negative maa ko indirect Coombs test aur samay par anti-D planning chahiye hoti hai, isliye blood group report kabhi late nahi honi chahiye. Double marker test 11 se 13 hafte ke beech hota hai, aur agar wo chhoot gaya to quadruple marker 15 se 20 hafte ke beech.",
      "Is ilaake me pregnancy ke dauran anaemia sabse badi samasya hai. Pregnancy me haemoglobin 11 g/dL se neeche ho to sirf iron ki goli shuru karna kaafi nahi, jaanch honi chahiye — ferritin, vitamin B12 aur folate batate hain ki wajah iron ki kami hai, B12 ki kami hai, ya kuch aur. CBC har trimester me kam se kam ek baar dohraiye.",
      "Pregnancy ke alawa, jin mahilaon ko irregular periods, acne, chehre par anchahe baal ya conceive karne me dikkat hai, unki jaanch aam taur par PCOS panel se hoti hai: LH, FSH, prolactin, testosterone, DHEAS, TSH, fasting insulin aur fasting glucose. Ye cycle ke din par depend karte hain, isliye apni gynaecologist se pooch lijiye ki kis din sample dena hai — aam taur par cycle ke doosre se paanchve din ke beech.",
    ],
  },

  {
    id: "how-to-prepare-for-blood-test",
    h: "Blood Test Se Pehle Ki Taiyari",
    p: [
      "Fasting test — fasting blood sugar, lipid profile, insulin aur zyadatar full body package — me 10 se 12 ghante bina khaaye rehna hota hai. Saada paani peena na sirf allowed hai balki zaroori hai: hydrated vein se sample aasani se nikalta hai, aur paani ki kami haemoglobin, urea aur creatinine ko jhoothe taur par badha deti hai. Raat ka khaana 9 baje tak khatam kijiye aur subah 7 se 9 baje ka slot lijiye. 14 ghante se zyada faaka karna ulta nuksan karta hai aur result bigaad deta hai.",
      "Lipid profile ya liver function test se kam se kam 24 ghante pehle sharaab bilkul na lein — ek shaam ki peene se hi triglycerides aur liver enzymes kaafi badh jaate hain. CPK, LDH ya kidney function test se ek din pehle heavy gym avoid kijiye, kyunki tez exercise se muscle enzymes aur creatinine badh jaate hain. Aur aadat me fasting sample se pehle kuch bhi mat khaaiye — ek biscuit poora test kharab kar deta hai.",
      "Dawaiyon ka aam niyam ye hai ki apni regular tablets usi samay par lijiye jab tak doctor mana na kare, do exception ke saath: thyroid ki goli blood nikalne ke baad leni chahiye, aur biotin ya multivitamin supplement kisi bhi hormone test se 48 se 72 ghante pehle band kar dena chahiye, kyunki biotin assay me interfere karta hai. Phlebotomist ko hamesha bata dijiye ki aap kya kya le rahe hain.",
    ],
  },

  {
    id: "choosing-a-reliable-lab",
    h: "Varanasi Me Bharosemand Lab Kaise Chunein",
    p: [
      "Ek achhe lab ki pehchaan uske quality control se hoti hai: machines ki niyamit calibration, sahi tarike se store kiye gaye reagent, trained staff, aur consistent turnaround time. Aap sidha ye sab nahi dekh sakte, lekin do cheezein zaroor pooch sakte hain — lab kitne saal se chal raha hai, aur wo apni report par test ka method (jaise CLIA/ECLIA) likhta hai ya nahi. Yahi farq hota hai ek aisi machine me jo number deti hai aur ek aisi machine me jo sahi number deti hai.",
      "Collection ke waqt khud dhyan dijiye. Nayi sterile needle aapke saamne khule, har test ke liye sahi rang ki vacutainer ho, tube aapke darwaze par barcode ho — lab pahunch kar nahi, tube sahi level tak bhare, aur anticoagulant wali tube halke se ulti-seedhi ki jaaye. Clotted ya kam bhara sample hi wo sabse aam wajah hai jiske liye lab dobara sample maangti hai — aur galat tarike se liya gaya sample haemolysis kar deta hai, jisse potassium jhoothe taur par badh jaata hai aur bewajah panic ho jaata hai.",
      "Aakhir me, repeat test ke liye har baar usi lab me jaaiye. Alag alag analyser aur method ke reference range thode alag hote hain, isliye ek lab me TSH 4.5 aur doosri me 4.1 aane ka matlab ye nahi ki aapka thyroid badal gaya. Jo cheez aap mahino tak track kar rahe hain — HbA1c, TSH, creatinine, ferritin — usme lab ki consistency utni hi zaroori hai jitni khud ka number.",
    ],
  },

  {
    id: "reports-turnaround-time",
    h: "Report, Turnaround Time Aur Result Kaise Padhein",
    p: [
      "Zyadatar routine test — CBC, sugar, lipid, LFT, KFT, thyroid, urine routine — sample lab pahunchne ke 6 se 24 ghante ke andar ya usi din report ho jaate hain. Vitamin aur hormone assay me aam taur par 24 ghante lagte hain. Culture jaan boojh kar dheeme hote hain: urine ya blood culture me 48 se 72 ghante lagte hain kyunki pehle organism ko ugana padta hai, tabhi antibiotic sensitivity test hoti hai — koi bhi lab isse jaldi ka imaandari se vaada nahi kar sakti.",
      "Result ke saath chhapi reference range padhiye, internet ke chart se mat milaiye — range method ke hisaab se aur umar tatha ling ke hisaab se badalti hai. High ya low ka flag diagnosis nahi, doctor se milne ka ishaara hai. Thoda sa range se bahar hona bahut common hai aur aksar harmless — jaise haal me hui sardi ke baad halka ESR badha hona, ya Gilbert's syndrome me thoda sa bilirubin badha hona, jo poori tarah benign hai.",
      "Kuch result appointment ka intezaar nahi maangte, usi din doctor chahiye: dengue me tezi se girta platelet count, bahut zyada blood sugar ke saath ulti ya susti, khatarnak had tak kam haemoglobin, ya bahut badha hua creatinine ke saath peshab ka kam hona. Accredited labs inhe critical value maan kar patient ko phone karti hain, lekin agar tabiyat kharab lag rahi hai to phone ka intezaar mat kijiye.",
    ],
  },

  {
    id: "how-to-book-lab-test-varanasi",
    h: "Varanasi Me Lab Test Kaise Book Karein",
    p: [
      "Test ya package ka naam search kijiye, test page par parameter list aur price dekhiye, aur booking me add kar dijiye. Agar doctor ka parcha hai to use upload kar dijiye — isse lab confirm kar leti hai ki wahi panel process ho raha hai jo aapke physician ne likha tha, khaas kar jahan naam milte julte hote hain, jaise Thyroid Profile Total aur Free.",
      "Apna Varanasi ka address landmark ke saath likhiye, collection slot chuniye aur confirm kar dijiye. Aapko SMS milega jismein phlebotomist ka naam aur visit ka time window hoga. Fasting ki instructions, agar koi hain, confirmation ke saath hi aa jaati hain — taki raat 10 baje kisi ko yaad karne ki zaroorat na pade.",
      "Phlebotomist aata hai, aapka naam aur test list verify karta hai, sample leta hai aur tube aapke saamne barcode karta hai. Poori visit lagbhag 10 minute ki hoti hai. Sample lab pahunchne par ek notification aata hai, aur report taiyaar hone par doosra.",
    ],
  },
];
