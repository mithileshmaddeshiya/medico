/**
 * Long-form SEO copy for /lab-test/azamgarh.
 *
 * WHY THIS FILE EXISTS AND NOT A TEMPLATE. Same reason deoria.js, gorakhpur.js
 * and salempur.js exist: a page that is another city's page with the noun
 * swapped does not get indexed — Google reads it as a doorway page. Four lab
 * pages are already live, so the fifth has the least room of any of them to
 * repeat an argument that has already been made.
 *
 * So the angle here is Azamgarh's own, and it is one no other page on the site
 * makes. Azamgarh is a MANDAL headquarters — Mau and Ballia both refer inward
 * to it — and it is also one of UP's most populous districts, seven tehsils
 * wide, where the far edge of the jile is a 50–60 kilometre run from the city
 * where the labs actually sit. That combination is the page's whole argument:
 * the crowd at the counter is a division's crowd, and the person standing in it
 * has often already travelled an hour to reach it.
 *
 * Two sections are this page's own and appear nowhere else on the site:
 *   • mandal-mukhyalaya-doori-azamgarh — the division + district-size argument
 *   • bunkar-karigar-azamgarh — the weaving and artisan belt (Mubarakpur's
 *     saree looms, Nizamabad's black pottery), written as occupational health:
 *     what a person sitting at a loom for ten hours should actually get tested,
 *     and what they should see a doctor for instead of testing.
 *
 * Deliberately NOT repeated here, because another page owns it:
 *   • "book from outside for the people at home" → salempur.js
 *   • "get the report before the OPD visit" → gorakhpur.js
 *   • the anaemia-in-women-and-children section → deoria.js
 * The Gulf-remittance reality of this belt is real and it is touched in ONE
 * paragraph of the report section (forwarding a PDF abroad), not given a
 * heading — a second page arguing the same thing costs both of them.
 *
 * ── Claims and their sourcing ────────────────────────────────────────────
 * Only the confirmed set (see the warning above defaultFaqs in
 * src/data/lab/defaults.js): free home collection, a trained phlebotomist
 * carrying an ID card, slots from 6 AM, reports in 24 hours, cash/UPI at
 * collection, a callback in about 30 minutes, a visit of about 10 minutes.
 * NOT claimed here, however well it would rank: NABL accreditation, cold-chain
 * transport, barcoded tubes, pathologist verification, a "24 ghante khula lab",
 * or a walk-in counter of our own anywhere in the district. There isn't one —
 * this is a home-collection service area, and the copy says so in its own
 * heading rather than leaving the reader to guess.
 *
 * Local geography is stated only where it is checkable and hedged the way the
 * other city files hedge it ("kareeb", "aam taur par"): the Tamsa (Tons) runs
 * through the city, the Ghaghara runs along the district's northern edge,
 * Varanasi and Gorakhpur are both roughly a hundred kilometres away, and the
 * district is divided into seven tehsils. The two lines worth re-checking
 * before a paid push are those two distances and the city PIN in the seed entry.
 *
 * ── How the keywords are placed ──────────────────────────────────────────
 * One primary term ("lab test in Azamgarh" / "Azamgarh me lab test"), carried
 * by the URL, the H1, the title and the lead section. Everything else gets its
 * OWN heading, because a heading ranks and a term buried mid-paragraph mostly
 * does not: pathology lab / diagnostic centre, home sample collection with the
 * tehsil towns named, sugar and thyroid follow-up, fever panel, full body
 * checkup, price / rate list, fasting, report. Each appears in ONE H2 and then
 * reads as prose.
 *
 * ── Internal links ───────────────────────────────────────────────────────
 * Paragraph parts of the form { text, href } render as real in-prose links (see
 * LabContent). Every href below must be a route that renders:
 *   /lab-test/{varanasi,gorakhpur,deoria,salempur}  (src/data/lab/cities.js)
 *   /blogs/{lab-test,full-body-checkup}/varanasi    (src/data/blogs/varanasi/)
 *   /contact
 */

/* Link targets, kept as constants so a route rename is a one-line fix here
   rather than a hunt through the prose — and so a typo shows up as `undefined`
   in the href instead of as a silent 404 in production. */
const LAB_VARANASI = "/lab-test/varanasi";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_DEORIA = "/lab-test/deoria";
const GUIDE_LAB_TEST = "/blogs/lab-test/varanasi";
const GUIDE_FULL_BODY = "/blogs/full-body-checkup/varanasi";

export const azamgarhContent = [
  {
    id: "lab-test-in-azamgarh",
    h: "Azamgarh Me Lab Test — Ghar Baithe Blood Test Booking Aur Free Home Sample Collection",
    p: [
      "Azamgarh me jaanch karana mushkil isliye nahi hai ki lab nahi hain — mushkil isliye hai ki wo sab sheher me hain aur jila bahut bada hai. Sidhari, Civil Lines aur Kachehri ke aas-paas ke counter par subah bheed lagti hai, aur us bheed me khade aadhe log wahi hain jo Mehnagar, Atraulia, Phulpur ya Lalganj se ek ghanta safar kar ke pahunche hain. Ek CBC ya TSH ke liye poora din chala jaata hai, aur report lene ka doosra chakkar alag.",
      "Home sample collection isi chakkar ko khatam karta hai. Aap apna pata dete hain, subah ka slot chunte hain, aur trained phlebotomist ID card ke saath aapke darwaze par aata hai. Sample wahin liya jaata hai aur report 24 ghante ke andar WhatsApp aur email par PDF me aa jaati hai — na kiraya, na khaali pet ka safar, na line, na report lene ka doosra din.",
      "Yahan routine pathology ke saare test aur health package book hote hain — CBC, Thyroid Profile, Blood Sugar, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test, Vitamin D, Vitamin B12, Dengue, Urine Routine aur Full Body Checkup. Doctor ka parcha hai to usi panel ke hisaab se booking ho jaati hai; koi test is page par naam se na dikhe to parche ke saath ek call kar lijiye — zyadatar test usi home visit me ho jaate hain.",
    ],
  },

  {
    /* "Azamgarh me pathology lab", "diagnostic centre Azamgarh", "lab test near
       me" — teenon ka intent ek hi hai: jaana kahan padega. Isliye alag heading
       aur us par seedha jawab, sabse pehle ye ki hamara counter hai hi nahi.
       Deoria wale page se alag baat yahan ye hai ki yahan counter ki kami nahi
       hai — bheed aur doori hai. */
    id: "pathology-lab-diagnostic-centre-azamgarh",
    h: "Azamgarh Me Pathology Lab Ya Diagnostic Centre Dhoondh Rahe Hain?",
    p: [
      "Pehle ek baat saaf kar dena theek rahega: hamara koi walk-in counter Azamgarh me nahi hai, aur is page par kahin ye nahi likha jaayega ki hai. Ye home collection service hai — hum aapke ghar se sample lete hain, aur wahi sach hai jo yahan likha hai.",
      "Iska matlab samajh lena kaam ka hai. Sheher ke chhote collection centre par bhi aam taur par sirf sample liya jaata hai; jaanch badi lab me hoti hai aur report wahin se banti hai. Yaani sample ko safar to karna hi hai. Sawaal sirf itna hai ki us safar ki shuruaat aapke ghar se ho, ya aapke bas pakadne, line lagane aur wapas aane ke baad. Blood aur urine ke saare aam test sirf sample par hote hain, isliye ghar se shuruaat karna kisi tarah kam bharosemand nahi hai — bas ek poora din bach jaata hai.",
      "Sample lene ka kaam trained phlebotomist karta hai, ID card ke saath, aapke saamne. Sample dene se pehle teen cheezein kar lijiye: uska ID card dekh lijiye, doctor ka parcha saamne rakh dijiye taaki wahi panel liya jaaye jo likha hai, aur jis test ke card par 'Call for price' likha hai uska daam pehle pooch lijiye. Home visit ke slot subah 6 baje se shuru hote hain aur shaam tak chalte hain. Report 24 ghante ke andar aati hai — hum 24 ghante khula lab hone ka daawa nahi karte, 24 ghante me report milne ka karte hain.",
      "Aur ek aadat jo yahan sabse zyada nuksan karti hai: jo test aap mahino tak dohrate hain — HbA1c, TSH, creatinine, haemoglobin — unhe har baar alag alag jagah se mat karaiye. Alag machine aur method ke reference range thode alag hote hain, isliye ek jagah TSH 4.5 aur doosri jagah 4.1 aane ka matlab ye nahi ki aapka thyroid badal gaya. Doctor badlav dekhta hai, sirf aaj ka number nahi.",
    ],
  },

  {
    /* Is page ka apna hissa (1/2). Azamgarh mandal ka mukhyalaya hai aur jila
       saat tehsil ka hai — yahi wo baat hai jo site ke kisi doosre page par
       nahi likhi, aur yahi is page ko Gorakhpur aur Varanasi ke pages se alag
       banati hai. Koi bhi doori "kareeb" ke saath likhi gayi hai. */
    id: "mandal-mukhyalaya-doori-azamgarh",
    h: "Mandal Mukhyalaya Ki Bheed Aur Saat Tehsil Ka Faasla — Sample Ghar Se Dene Ka Sabse Bada Faayda",
    p: [
      "Azamgarh sirf jila mukhyalaya nahi, mandal mukhyalaya hai — Mau aur Ballia dono ka rukh isi taraf hota hai. Iske upar jila khud itna bada hai ki uske ek chhor se doosre chhor tak pahunchne me hi aadha din lag jaata hai. Sadar ke alawa Sagri, Nizamabad, Phulpur, Lalganj, Martinganj aur Budhanpur — saat tehsil, aur inme rehne walon ke liye 'sheher jaana' koi chhoti baat nahi hai.",
      "Isi wajah se yahan ek aisi cheez hoti hai jo bade sheher me nahi hoti: log jaanch tab tak taalte hain jab tak kisi doosre kaam se sheher jaana na ho. Kachehri ka kaam, bank ka kaam, bachche ka daakhila — usi din 'chalo blood test bhi karwa lete hain'. Uska nateeja ye hota hai ki fasting wala test bina khaali pet ke ho jaata hai, ya do mahine baad hota hai, ya hota hi nahi. Jo test samay par honi thi wo samay par nahi hoti — aur diabetes, thyroid aur kidney me samay hi sabse badi cheez hai.",
      "Ghar par sample dene ka sabse bada faayda paise ka nahi, timing ka hai. Aapko sheher jaane ke kisi kaam ka intezaar nahi karna padta. Jis din doctor ne kaha, us din ka slot mil jaata hai; fasting wala test subah 6 baje hota hai aur aap turant naashta kar lete hain; aur report seedhe phone par aa jaati hai, isliye lene ke liye dobara nikalna hi nahi padta.",
      "Zila aspatal, mandaliya aspatal aur rajkiya medical college ki OPD me dikhana ho to bhi ye kaam ka hai — parche par likhe blood aur urine ke test ek din pehle ghar par karwa lijiye, taaki doctor ke saamne baithte waqt report haath me ho. Warna hota ye hai ki OPD me number lagta hai, test likha jaata hai, phir line, aur report ke liye doosre din phir aana padta hai.",
      [
        "Safar tab banta hai jab baat imaging ya specialist ki ho — X-ray se aage MRI ya CT scan, sonography se aage angiography, endoscopy, biopsy, ya kisi super-speciality doctor ki OPD. Ye machine aur doctor par hote hain, sample par nahi, isliye inka koi home option hota hi nahi; yahan se log aam taur par Varanasi ya Lucknow ki taraf jaate hain aur Purvanchal Expressway ke baad wo safar pehle se aasan hua hai. Aisi trip se pehle blood test ghar par karwa lijiye, taaki report pehle se haath me ho. Ilaaj Varanasi me chal raha hai to ",
        { text: "Varanasi me lab test", href: LAB_VARANASI },
        " bhi isi tarah ghar par hota hai, Gorakhpur me dikhana ho to ",
        { text: "Gorakhpur me lab test", href: LAB_GORAKHPUR },
        " bhi, aur ",
        { text: "Deoria me lab test", href: LAB_DEORIA },
        " bhi usi tarah book hota hai.",
      ],
      [
        "Aur agar aap Mau, Ballia ya Jaunpur ki taraf se sirf jaanch ke liye Azamgarh aane ki soch rahe hain to ruk jaaiye — routine blood test ke liye aana zaroori nahi hai. Kaun sa test kis shikayat, umar aur mausam me karana chahiye, ye ",
        { text: "hamari poori guide", href: GUIDE_LAB_TEST },
        " me detail me likha hai.",
      ],
    ],
  },

  {
    id: "home-sample-collection-azamgarh",
    h: "Azamgarh Sheher Aur Jile Me Home Sample Collection — Sidhari, Civil Lines Se Mubarakpur, Nizamabad Aur Lalganj Tak",
    p: [
      "Sheher me collection Sidhari, Civil Lines, Kachehri, Chowk, Bhanwarnath, Pahadpur aur Rani Ki Sarai ke aas-paas hoti hai. Jile me Mubarakpur, Nizamabad, Bilariyaganj, Sarai Mir, Lalganj, Phulpur, Maharajganj, Atraulia, Mehnagar, Jeanpur, Sagri, Martinganj, Budhanpur, Jahanaganj, Ahiraula aur Deogaon jaise kasbe aur inse lage gaon aam taur par cover hote hain. Aapka gaon is list me naam se nahi hai to maan kar mat baithiye ki service nahi hai; booking se pehle ek call kar lijiye — cover hota hai to usi waqt slot book ho jaayega, aur nahi hota to hum saaf bata denge, taaki aap intezaar kar ke pareshan na hon.",
      "Pata likhne ka tarika yahan seedha asar daalta hai. Sheher me mohalle ka naam aur ek jaana pehchana landmark likhiye — school, mandir ya masjid, petrol pump, tiraha, bank. Gaon me sirf gaon ka naam kaafi nahi hota: tola ya purwa ka naam likhiye, saath me post office ya thana ka naam. Ek hi naam ke do gaon paas paas hone bahut aam baat hai, aur late visit ki sabse badi wajah yahi hoti hai.",
      "Mobile number wahi dijiye jo us waqt chalu rahega, aur ho sake to ek doosra number bhi likh dijiye. Kai gaon me network ek hi kone me aata hai — phlebotomist ka ek call chhoot jaane se poori visit atak jaati hai.",
      "Ghar me ek se zyada log test kara rahe hain — maa-baap, dada-dadi, bachche — to sabki booking ek hi slot me kar dijiye; ek hi visit me sabka sample ho jaayega. Aur ye baat khaas taur par unke liye hai jinke ghar me koi bujurg hai, bistar par hai, lakwe ya operation ke baad recovery kar raha hai, ya koi diabetic hai jinki nas patli ho gayi hai — booking ke waqt ye bata dijiye, taaki aane wala taiyaari ke saath aaye aur baar baar sui na lagani pade. Sample se thodi der pehle mareez ko paani pila dijiye, jab tak fasting ke niyam mana na karein; paani ki kami se nas dhoondhna sach me mushkil ho jaata hai.",
    ],
  },

  {
    /* Is page ka apna hissa (2/2). Mubarakpur ka saree karobar aur Nizamabad ki
       kaali mitti ke bartan — Azamgarh ki apni pehchaan hai, aur yahan ke
       karigar ki dinacharya (das ghante baithe rehna, kam roshni, kam dhoop)
       se jude test genuinely alag hain. Ye occupational health hai, koi service
       ka naya daawa nahi: jo cheez doctor ka kaam hai — chest ke lakshan,
       lagatar khansi — use saaf saaf doctor ke paas bheja gaya hai, kyunki uska
       jawab blood test nahi hai. */
    id: "bunkar-karigar-azamgarh",
    h: "Bunkar Aur Karigar Ke Liye — Mubarakpur, Nizamabad Aur Sarai Mir Ke Kaam Se Judi Jaanch",
    p: [
      "Azamgarh ka ek bada hissa apne haath ke kaam par chalta hai — Mubarakpur ke saree ke karghe, Nizamabad ke kaale bartan, Sarai Mir aur aas-paas ke chhote karkhane. Is kaam ki dinacharya sehat par jo asar daalti hai wo kisi aur pesha se alag hai, aur usi hisaab se jaanch chunni chahiye.",
      "Sabse pehli baat dhoop ki hai. Karghe par ya bhatti ke andar das-baarah ghante beetne ka matlab hai dhoop lagbhag na ke barabar. Vitamin D ki kami is tarah ke kaam me bahut aam hai, aur wo thakan, kamar aur ghutne ka dard, aur haddi me halka halka dard ban kar saamne aati hai — jise log 'baithne ka dard' samajh kar saalon nikaal dete hain. Saath me Vitamin B12 bhi dekh leejiye, khaas kar agar khana zyadatar shakahari hai: iski kami sirf khoon nahi, nason par bhi asar daalti hai, jisse haath-pair me jhunjhuni aur sunnpan hota hai.",
      "Doosri baat khoon ki kami ki hai. Ghar ke andar chalne wale kaam me — kadhai, silai, bartan, karghe ki madad — mahilaon aur kishoriyon ki thakan ko aksar 'kaam ki thakan' maan liya jaata hai. CBC ek chhota aur sasta test hai jo yahi batata hai: haemoglobin kam hai ya nahi. Kam nikle to sirf iron ki goli shuru kar dena adhoora ilaaj hai — ferritin, Vitamin B12 aur folate se pata chalta hai ki kami hai kis cheez ki.",
      "Teesri baat un logon ke liye jo lambe samay se ek hi jagah baithte hain aur chalna kam hota hai: sugar aur lipid. Umar 30 paar hai, kamar ke aas-paas wazan badha hai, ya ghar me kisi ko diabetes hai — to saal me ek baar Fasting Blood Sugar ke saath HbA1c aur Lipid Profile karwa lena chahiye. Ye teenon ek hi sample me ho jaate hain, aur ismein se kisi ke liye bhi kaam se chhutti lene ki zaroorat nahi.",
      "Aur ek cheez saaf saaf: dhaage ki dhool, rang, ya bhatti ke dhuen ke beech kaam karte hue agar lagatar khansi hai, saans phoolti hai, seene me jakadan rehti hai, khansi me khoon aaya hai, ya bina wajah wazan gir raha hai — to iska jawab koi blood test nahi hai. Seedha doctor ko dikhaiye. Ye lakshan chest ki jaanch maangte hain, aur unhe package ke bharose chhod dena sabse bada nuksan karta hai.",
    ],
  },

  {
    id: "sugar-thyroid-followup-azamgarh",
    h: "Sugar, HbA1c Aur Thyroid Test Azamgarh Me — Dawa Sheher Se, Par Follow-up Jaanch Chhoot Jaati Hai",
    p: [
      "Yahan ek hi kahani baar baar milti hai: dikhaya sheher me, dawa shuru ho gayi, aur uske baad ki jaanch kabhi hui hi nahi. Dawa chalti rehti hai, medical se har mahine mil jaati hai, aur do saal beet jaate hain bina ye jaane ki dawa asar kar bhi rahi hai ya nahi. Ilaaj ka aadha hissa jaanch hai, aur wahi hissa doori ki wajah se chhoot jaata hai.",
      "Diabetes ka calendar seedha sa hai. Har teen mahine me HbA1c — ye pichhle do-teen mahine ka ausat batata hai aur ismein fasting nahi chahiye, isliye ise taalne ki koi wajah hi nahi. Saal me ek baar Lipid Profile. Saal me ek baar Kidney Function Test ke saath urine microalbumin — microalbumin wahi test hai jo sabse pehle ishaara deta hai ki kidney par asar shuru ho raha hai, aur wahi sabse zyada chhoda jaata hai. Aur saal me ek baar aankh ka fundus check, jo lab ka nahi, doctor ka kaam hai.",
      "Thyroid ka niyam bhi utna hi seedha hai. Dawa ki dose badle to 6 se 8 hafte baad TSH dohraiye; uske baad har 6 se 12 mahine me. Jinhone kabhi karaya hi nahi — 35 ke baad ki mahilayein, jinke ghar me kisi ko thyroid hai, pregnancy plan kar rahi mahilayein, ya jinhe lagatar thakan, baal jhadna, wazan ka bina wajah badhna-ghatna ya periods ki gadbadi hai — unke liye ek baar TSH karana kaafi hai ye jaanne ke liye ki dikkat idhar hai ya nahi.",
      "BP ki dawa chal rahi hai to saal me ek baar kidney function aur electrolytes dekh lena chahiye, kyunki kuch dawaiyan inhe halka sa badal deti hain. Aur agar ghar me kai log dawa par hain — jo yahan ke bade parivaaron me aam hai — to sabka follow-up ek hi din, ek hi slot me karwa lijiye. Ek visit me sabka sample ho jaayega aur agli baar ke liye taarikh bhi ek hi yaad rakhni padegi.",
    ],
  },

  {
    id: "bukhar-dengue-typhoid-azamgarh",
    h: "Azamgarh Me Dengue, Typhoid Aur Malaria Test — Bukhar Ke Kis Din Kaunsa Test",
    p: [
      "Azamgarh sheher Tamsa nadi ke kinare basa hai aur jile ki uttari seema par Ghaghara chalti hai. Barsaat ke baad in dono ke kinare ke ilaakon me paani ruk jaata hai, aur usi ke saath July se November ke beech bukhar ka bojh sabse zyada ho jaata hai. Sabse aam galti bimari pehchan-ne me nahi, din ginne me hoti hai — test sahi hota hai par galat din par, aur report negative aane par ilaaj hafta bhar late ho jaata hai.",
      "Seedha niyam ye hai. Dengue me NS1 antigen bukhar ke pehle 1 se 5 din tak bharosemand hai; paanchve din ke baad wo aksar negative aa jaata hai aur tab IgM antibody karana padta hai. Typhoid me Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye, warna titre badhte hi nahi — aur is ilaake me typhoid endemic hai, isliye purane infection se bhi Widal positive aa sakta hai; sirf usi ke bharose ilaaj tay karna theek nahi. Typhidot IgM jaldi positive hota hai. Bukhar me thand aur kanpkanpi ho to malaria antigen aur peripheral smear jodiye. Jo bhi karayein, CBC saath me zaroor karwaiye — girta platelet count aur badhta haematocrit wahi cheez hai jo roz dekhi jaati hai.",
      "Paani se failne wali bimari par alag dhyan chahiye, khaas kar baadh ke baad aur wahan jahan peene ka paani aur naali paas paas chalti hai. Aankhon ka peelapan, gehra peshab, ulti jaisa lagna aur bhookh ka khatam ho jaana — in par Liver Function Test (total aur direct bilirubin ke saath), Hepatitis A IgM aur Hepatitis E IgM karana chahiye. Pregnancy me peeliya ho to turant doctor ko dikhaiye; Hepatitis E garbhawastha me kahin zyada khatarnak hota hai aur ismein intezaar nahi karna chahiye.",
      "Bukhar me ghar se nikalna sabse bhaari kaam hota hai, aur yahi wo waqt hai jab home collection sabse zyada kaam aata hai. Slot subah ka lijiye, kyunki bukhar ka panel aksar do-teen din baad dohrana padta hai aur ek hi samay par dohrana behtar rehta hai — do report ka aapas me milaan tabhi theek baithta hai.",
      "Ek zaroori chetavani. Bachche ko tez bukhar ke saath jhatke aayein, behoshi ho, gardan akad jaaye, lagatar ulti ho ya wo sust pada rahe — to lab test book mat kijiye, seedha najdeeki hospital le jaaiye. Ye emergency hai aur ismein ek-ek ghanta maayne rakhta hai; blood test iska pehla jawab nahi hai aur home collection ka intezaar khatarnak hai.",
    ],
  },

  {
    id: "full-body-checkup-azamgarh",
    h: "Azamgarh Me Full Body Checkup Package — 45, 72 Aur 88 Parameter Wale Plan",
    p: [
      "Achha full body checkup parameter ki ginti se nahi, coverage se tay hota hai. Kam se kam paanch cheezein aani chahiye: blood count (CBC), sugar, heart ke liye lipid profile, liver function, aur kidney function ke saath urine routine. Iske upar thyroid, Vitamin D aur B12 jud jaayein to package se sach me kuch pata chalta hai.",
      "Basic Full Body Checkup (45 parameter, ₹999) un logon ke liye theek hai jinki umar kam hai aur koi shikayat nahi — saal ka ek baseline ban jaata hai. Advanced Full Body (72 parameter, ₹1,999) me thyroid, HbA1c aur vitamins jud jaate hain; 30 se 50 saal walon ke liye yahi sabse sahi baithta hai. Senior Citizen Pack (88 parameter, ₹2,999) 55 ke upar ke liye hai, jismein heart, haddi aur sugar ki screening ek saath hoti hai.",
      "Package apne risk ke hisaab se chuniye, price ke hisaab se nahi. Ghar me diabetes ya dil ki bimari chali aa rahi hai to HbA1c, lipid aur kidney markers ko priority dijiye. Din bhar chhat ke neeche kaam hota hai aur dhoop kam milti hai to Vitamin D ko jagah dijiye. Aur ghar ka khana shudh shakahari hai — jo yahan bahut se gharon me hai — to Vitamin B12 saal wale panel me hona hi chahiye.",
      "Ek galatfehmi door kar lena zaroori hai: full body checkup har bimari nahi pakadta. Ye screening hai — jo cheez chup chaap badh rahi hoti hai use jaldi pakadne ke liye. Koi shikayat pehle se hai to package ke bharose mat baithiye, doctor ko dikhaiye aur wahi test karaiye jo wo kahe.",
      [
        "Poora package ek hi sample me ho jaata hai aur zyadatar package fasting maangte hain, isliye subah ka slot lijiye. Ghar ke kai log ek saath karaa rahe hain to sabka ek hi slot me book kijiye. Kis umar me kaun sa package theek rehta hai aur '80+ parameters' ka sach kya hai, wo ",
        { text: "full body checkup wali guide", href: GUIDE_FULL_BODY },
        " me alag se likha hai.",
      ],
    ],
  },

  {
    id: "lab-test-price-azamgarh",
    h: "Azamgarh Me Lab Test Price Aur Rate List — Kaunsa Test Kitne Ka",
    p: [
      "Is page par har card par jo price likha hai, wahi aapko dena hai. Home sample collection uske upar free hai — na visiting charge, na travel charge, na koi hidden fee. Jile ke kisi bhi kasbe me daam wahi rehta hai jo sheher me hai; door hone par kuch extra nahi lagta.",
      "Rate list is tarah hai: Blood Sugar ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1,000, Vitamin B12 ₹1,200 aur Dengue (NS1, IgG, IgM) ₹1,200. Ye wahi rate hain jo hamare doosre sheheron me hain.",
      "Package me bachat sabse zyada hoti hai. Basic Full Body ₹999 me 45 parameter deta hai — wahi test alag alag karane par kharcha kai guna ho jaata hai. Advanced ₹1,999 me 72 parameter aur Senior Citizen Pack ₹2,999 me 88 parameter deta hai.",
      "Kuch test, jaise Fever Panel (malaria, typhoid aur dengue ek saath), price par nahi balki us waqt ki zaroorat par tay hote hain — unke card par 'Call for price' likha rehta hai. Aise me phone par pooch lijiye; sample dene se pehle price bata diya jaata hai. Payment sample lene ke waqt hi hota hai — cash ya UPI se, PhonePe, Google Pay ya Paytm.",
    ],
  },

  {
    id: "fasting-taiyari-azamgarh",
    h: "Sample Dene Se Pehle Kya Karein, Kya Na Karein — Fasting Ke Niyam",
    p: [
      "Fasting wale test — Fasting Blood Sugar, Lipid Profile aur zyadatar full body package — me 10 se 12 ghante kuch nahi khana hota. Saada paani peena mana nahi hai, balki zaroori hai: paani ki kami se nas dhoondhna mushkil ho jaata hai aur haemoglobin, urea tatha creatinine jhoothe taur par badhe hue aate hain. Raat ka khana 9 baje tak khatam kar lijiye aur subah 6 se 8 baje ka slot lijiye. 14 ghante se zyada bhookhe rehna faayda nahi, nuksan karta hai.",
      "Fasting sample se pehle chai — doodh wali to bilkul nahi — biscuit, toffee, paan ya gutkha kuch bhi nahi. Ek chai bhi sugar aur lipid ki report badal deti hai, aur phir wahi test dobara karana padta hai. Sirf saada paani.",
      "Lipid Profile ya Liver Function Test se kam se kam 24 ghante pehle sharaab bilkul na lein — ek shaam ki peene se hi triglycerides aur liver enzymes kaafi badh jaate hain. Kidney function ya CPK karana ho to ek din pehle bahut bhaari mehnat avoid kijiye; khet ka bhaari kaam, lambi cycle ya karghe par lagatar zor bhi ismein aata hai.",
      "Dawa ka aam niyam ye hai ki apni rozana ki goliyan usi samay lijiye, jab tak doctor mana na kare. Do exception hain: thyroid ki goli sample dene ke baad leni chahiye, aur biotin ya multivitamin kisi bhi hormone test se 2 se 3 din pehle band kar dena chahiye. Phlebotomist ko bata dijiye ki aap kaun kaun si dawa le rahe hain — is baat se report padhne wale ka kaam aasan ho jaata hai.",
      "Aur ek baat un logon ke liye jinka kaam subah jaldi shuru hota hai: non-fasting test — CBC, Thyroid Profile, HbA1c, Vitamin D, Vitamin B12, Dengue — din me kabhi bhi ho sakte hain. Sirf fasting wale test subah ke slot maangte hain. Isliye agar subah ka waqt nahi nikal pa raha to booking ke waqt bata dijiye; jo test bina fasting ke hote hain unka slot baad ka bhi rakha ja sakta hai.",
    ],
  },

  {
    id: "report-azamgarh",
    h: "Report Kab Milegi — 24 Ghante Me WhatsApp Par PDF, Aur Use Kaise Padhein",
    p: [
      "Zyadatar routine test ki report 24 ghante ke andar aa jaati hai — CBC, sugar, lipid, LFT, KFT, thyroid aur urine routine. Vitamin aur hormone me aam taur par utna hi samay lagta hai. Culture jaan boojh kar dheere hote hain: urine ya blood culture me 48 se 72 ghante lagte hain, kyunki pehle organism ko ugana padta hai aur uske baad hi pata chalta hai ki kaunsi dawa asar karegi. Isse jaldi ka vaada koi bhi lab imaandari se nahi kar sakta.",
      "Report WhatsApp aur email dono par PDF me aati hai, aur is jile me iska faayda alag hi hai. Ghar par maa-baap hain aur bete Gulf, Mumbai ya Surat me — report bas forward kar dijiye, wahan baithe log usi waqt padh lete hain aur agla faisla saath me hota hai. Doctor Azamgarh me ho, Varanasi me ya Lucknow me — kagaz le kar bhaagne ki zaroorat nahi, aur report kho jaane ka darr bhi nahi. Purani report bhi phone me sambhal kar rakhiye; doctor ko badlav dekhna hota hai, sirf aaj ka number nahi.",
      "Number ko report par chhape reference range se hi milaiye, internet ke kisi chart se nahi. Range machine aur method ke hisaab se badalti hai, aur umar tatha ling ke hisaab se bhi. Thoda sa high ya low hona bahut aam hai aur aksar koi bimari nahi hoti — ye diagnosis nahi, doctor se poochne ka ishaara hai. WhatsApp par report kisi group me mat daaliye; ye aapki niji jaankari hai.",
      [
        "Kuch result me intezaar nahi karna chahiye, usi din doctor chahiye: dengue me tezi se girta platelet count, bahut zyada sugar ke saath ulti ya susti, bahut kam haemoglobin, ya bahut badha creatinine ke saath peshab kam hona. Tabiyat kharab lag rahi ho to kisi ke phone ka intezaar mat kijiye, seedha dikhaiye. Numbers ka matlab kya hota hai aur kis flag par ghabrana nahi chahiye, ye ",
        { text: "report kaise padhein wale hisse", href: `${GUIDE_LAB_TEST}#report-kaise-padhein` },
        " me detail me likha hai.",
      ],
    ],
  },

  {
    id: "how-to-book-azamgarh",
    h: "Azamgarh Me Lab Test Kaise Book Karein — Online Form Ya Ek Phone Call",
    p: [
      "Is page par apna test ya package chuniye aur booking form bhar dijiye — naam, mobile number, apna mohalla ya gaon, aur ek landmark. Ya seedha phone kar dijiye. Doctor ka parcha hai to uska photo saath rakhiye, kyunki panel usi ke hisaab se book hota hai.",
      "Parche ke naam milte julte hote hain aur yahi sabse aam galti ki jad hai. Thyroid me 'Total' aur 'Free' alag test hain; sugar me 'Fasting' aur 'PP' do alag sample hain, jabki HbA1c ek hi sample me teen mahine ka ausat batata hai aur usme fasting nahi chahiye; typhoid me Widal aur Typhidot alag hain; aur 'liver test' aam taur par LFT hota hai, 'kidney test' KFT. Parche ka photo bhej dene se ye galti hoti hi nahi.",
      "Booking ke baad confirm karne ke liye call aam taur par 30 minute ke andar aati hai — slot, pata aur ye ki test me fasting chahiye ya nahi. Aane wale phlebotomist ke paas ID card hota hai; sample dene se pehle use dekh lena aapka haq hai. Poori visit lagbhag 10 minute ki hoti hai. Payment usi waqt hota hai, cash ya UPI se. Uske baad aapko kuch karna nahi hai — report taiyaar hone par WhatsApp aur email par PDF khud aa jaayegi.",
      [
        "Ek aakhri baat: aap jile ke kisi aise gaon me hain jo is page par naam se nahi likha, to bhi ek call kar ke pooch lijiye — cover hota hai to wahi slot book ho jaayega, aur nahi hota to hum saaf bata denge. Number aur poora pata ",
        { text: "contact page", href: "/contact" },
        " par mil jaayega.",
      ],
    ],
  },

  {
    /* Devanagari section, ek baar.
       Is jile me bahut si search Hindi me type hoti hai — "आजमगढ़ में लैब टेस्ट",
       "खून की जांच", "रेट लिस्ट". Poore page ko transliterate karna galat hota:
       baaki copy Hinglish me hai aur wahi log padhte hain. Ek alag section dono
       cover kar deta hai — aur ye upar likhi baaton ka anuvaad hai, naya daawa
       nahi, isliye claims kahin bhi alag nahi padte. */
    id: "azamgarh-lab-test-hindi",
    h: "आज़मगढ़ में लैब टेस्ट — घर से सैंपल कलेक्शन की पूरी जानकारी (हिंदी में)",
    p: [
      "आज़मगढ़ में खून की जांच के लिए अब शहर तक जाकर लाइन लगाने की ज़रूरत नहीं है। सीबीसी, थायरॉइड, शुगर, एचबीए1सी, लिपिड प्रोफाइल, लिवर और किडनी फंक्शन टेस्ट, विटामिन डी, विटामिन बी12, डेंगू, यूरिन रूटीन और फुल बॉडी चेकअप — ये सारी जांच सैंपल पर होती हैं, और सैंपल आपके घर से लिया जा सकता है।",
      "होम सैंपल कलेक्शन बिल्कुल मुफ़्त है। आप सिर्फ़ टेस्ट का वही दाम देते हैं जो कार्ड पर लिखा है — कोई विज़िटिंग चार्ज या छिपा हुआ शुल्क नहीं, और ज़िले के दूर वाले कस्बों में भी वही रेट लगता है। सुबह 6 बजे से स्लॉट शुरू हो जाते हैं, ताकि खाली पेट वाली जांच जल्दी हो जाए और आप तुरंत नाश्ता कर सकें। रिपोर्ट 24 घंटे में व्हाट्सएप और ईमेल पर पीडीएफ में आ जाती है।",
      "रेट लिस्ट: ब्लड शुगर ₹100, सीबीसी ₹400, थायरॉइड प्रोफाइल ₹550, एचबीए1सी ₹600, लिवर फंक्शन टेस्ट ₹600, किडनी फंक्शन टेस्ट ₹700, लिपिड प्रोफाइल ₹800, विटामिन डी ₹1,000, विटामिन बी12 ₹1,200 और डेंगू ₹1,200। बेसिक फुल बॉडी चेकअप ₹999 में 45 पैरामीटर, एडवांस ₹1,999 में 72 और सीनियर सिटिज़न पैक ₹2,999 में 88 पैरामीटर देता है।",
      "सैंपल शहर में सिधारी, सिविल लाइंस, कचहरी, चौक और भंवरनाथ के आस-पास लिया जाता है, और ज़िले में मुबारकपुर, निज़ामाबाद, बिलरियागंज, सराय मीर, लालगंज, फूलपुर, महराजगंज, अतरौलिया, मेहनगर, जीयनपुर, सगड़ी, मार्टीनगंज और बूढ़नपुर तक। आपका गाँव इस सूची में न हो तो एक बार फ़ोन कर लीजिए — कवर होने पर उसी समय स्लॉट बुक हो जाएगा। पता लिखते समय टोला या पुरवा का नाम और एक लैंडमार्क ज़रूर डालिए।",
      "जिनकी शुगर, बीपी या थायरॉइड की दवा चल रही है, उनके लिए घर पर जांच का सबसे बड़ा फ़ायदा यही है कि फॉलो-अप छूटता नहीं — हर तीन महीने में एचबीए1सी, साल में एक बार लिपिड और किडनी फंक्शन, और दवा की डोज़ बदलने के 6 से 8 हफ़्ते बाद टीएसएच। पेमेंट सैंपल लेते समय नकद या यूपीआई से होता है।",
      [
        "बच्चे को तेज़ बुखार के साथ झटके, बेहोशी, गर्दन में अकड़न या लगातार उल्टी हो, तो जांच बुक करने के बजाय सीधे नज़दीकी अस्पताल ले जाइए — यह आपात स्थिति है। कौन सी जांच कब करानी चाहिए, इसकी पूरी जानकारी ",
        { text: "हमारी गाइड में", href: GUIDE_LAB_TEST },
        " दी गई है।",
      ],
    ],
  },
];

/**
 * Azamgarh's own FAQs.
 *
 * The generated defaults ask the same seven questions for every city with the
 * name swapped — exactly the duplication that keeps a fifth page out of the
 * index, and the FAQ block is the part Google is most likely to lift into a
 * rich result, so near-identical answers across cities actively hurt.
 *
 * These are written against the questions an Azamgarh reader actually has and
 * a Deoria or Gorakhpur reader does not: is there a counter in Sidhari, does
 * anyone come out as far as Mubarakpur or Mehnagar, can the report be ready
 * before the OPD at the district hospital, and can a sample be given by
 * someone whose working day starts at six. The two that decide a booking are
 * placed first — page.js renders the first eight, so this list is exactly eight.
 *
 * The "bachche ko jhatke" emergency question is deliberately NOT here: three
 * other cities already carry it as an FAQ, and a fourth identical Q&A in the
 * schema is duplication where it costs the most. The same warning is in the
 * fever section's prose, so nothing is lost to a reader.
 *
 * `links` is optional per FAQ and renders UNDER the answer, never inside the
 * schema text: the JSON-LD has to mirror the readable answer exactly, so the
 * links live outside `a`. See LabFaq.
 *
 * Claims are limited to the confirmed set: free home collection, trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI.
 */
export const azamgarhFaqs = [
  {
    q: "Azamgarh me lab test ka kitna kharcha aata hai, aur kya home sample collection free hai?",
    a: "Aap sirf test ka wahi price dete hain jo card par likha hai — Azamgarh me home sample collection bilkul free hai, na visiting charge na koi hidden fee. Rate list is tarah hai: Blood Sugar ₹100, CBC ₹400, Thyroid Profile ₹550, HbA1c ₹600, Lipid Profile ₹800 aur Basic Full Body Checkup ₹999 se shuru. Jile ke door wale kasbon me bhi wahi rate lagta hai jo sheher me hai. Payment sample lene ke waqt cash ya UPI se hota hai.",
  },
  {
    q: "Kya Azamgarh me aapka koi lab ya collection centre hai — Sidhari ya Civil Lines me?",
    a: "Nahi — hamara koi walk-in counter Azamgarh me nahi hai, aur hum aisa daawa nahi karte. Ye home collection service hai: trained phlebotomist ID card ke saath aapke ghar aata hai aur sample wahin liya jaata hai, chahe aap Sidhari me hon ya jile ke kisi gaon me. Home visit ke slot subah 6 baje se shuru hote hain aur shaam tak chalte hain. Hum 24 ghante khula lab hone ka daawa bhi nahi karte; report 24 ghante ke andar milne ka karte hain.",
  },
  {
    q: "Azamgarh jile me aap kaun kaun se ilaake cover karte hain?",
    a: "Sheher me Sidhari, Civil Lines, Kachehri, Chowk, Bhanwarnath, Pahadpur aur Rani Ki Sarai ke aas-paas, aur jile me Mubarakpur, Nizamabad, Bilariyaganj, Sarai Mir, Lalganj, Phulpur, Maharajganj, Atraulia, Mehnagar, Jeanpur, Sagri, Martinganj, Budhanpur, Jahanaganj, Ahiraula aur Deogaon tak — inse lage gaon bhi aam taur par cover hote hain. Aapka gaon is list me naam se nahi hai to bhi ek baar call kar ke pooch lijiye. Pata likhte waqt tola ya purwa ka naam aur ek landmark (school, mandir, masjid, block office, tiraha) zaroor daaliye, kyunki yahan house number se zyada landmark kaam aata hai.",
  },
  {
    q: "Zila aspatal ya medical college ki OPD me dikhana hai — kya test ek din pehle ghar par ho sakta hai?",
    a: "Haan, aur yahi sabse kaam ka tarika hai. Parche par likhe blood aur urine ke test ek din pehle ghar par karwa lijiye; report 24 ghante ke andar WhatsApp par PDF me aa jaati hai, isliye doctor ke saamne baithte waqt wo haath me hoti hai aur ek hi visit me baat ban jaati hai. Warna OPD me number lagta hai, test likha jaata hai, phir line, aur report ke liye doosre din phir aana padta hai. Sirf X-ray, sonography, CT ya MRI jaisi imaging ke liye jaana zaroori hai — wo sample par nahi, machine par hoti hai.",
    links: [{ href: GUIDE_LAB_TEST, label: "Kaun sa test kab karayein — guide" }],
  },
  {
    q: "Bukhar me dengue aur typhoid ka test kis din karana chahiye?",
    a: "Dengue me NS1 antigen bukhar ke pehle 1 se 5 din tak bharosemand hai; paanchve din ke baad wo aksar negative aa jaata hai aur tab Dengue IgM antibody karana padta hai. Typhoid me Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye, warna titre badhte hi nahi; Typhidot IgM jaldi positive hota hai. Thand aur kanpkanpi ho to malaria antigen aur peripheral smear jodiye. Jo bhi karayein, CBC saath me zaroor karwaiye — girta platelet count wahi cheez hai jo roz dekhi jaati hai. Bukhar ka panel do-teen din baad dohrana pad sakta hai, isliye ek hi samay ka slot lijiye.",
  },
  {
    q: "Subah ka waqt nahi nikal pata — kya sample shaam ko liya ja sakta hai?",
    a: "Non-fasting test — CBC, Thyroid Profile, HbA1c, Vitamin D, Vitamin B12, Dengue aur Urine Routine — din me kabhi bhi ho sakte hain, aur home visit ke slot subah 6 baje se shaam tak chalte hain. Sirf fasting wale test — Fasting Blood Sugar, Lipid Profile aur zyadatar Full Body Checkup package — subah ke slot maangte hain, kyunki unme 10 se 12 ghante kuch nahi khana hota. Booking ke waqt apna waqt bata dijiye; jo test bina fasting ke hote hain unka slot aapke hisaab se rakha ja sakta hai.",
  },
  {
    q: "Sugar ya thyroid ki dawa chal rahi hai — follow-up jaanch kab kab karani chahiye?",
    a: "Diabetes me har teen mahine me HbA1c (ismein fasting nahi chahiye), saal me ek baar Lipid Profile, aur saal me ek baar Kidney Function Test ke saath urine microalbumin — microalbumin wahi test hai jo sabse pehle ishaara deta hai ki kidney par asar shuru ho raha hai aur wahi sabse zyada chhoot jaata hai. Thyroid me dose badalne ke 6 se 8 hafte baad TSH dohraiye, uske baad har 6 se 12 mahine me. Ghar ke kai log dawa par hain to sabka follow-up ek hi slot me karwa lijiye — ek visit me sabka sample ho jaayega.",
  },
  {
    q: "Azamgarh me booking kaise karein, aur doctor ka parcha bhejna zaroori hai?",
    a: "Is page par test ya package chuniye aur form bhar dijiye — naam, mobile number, mohalla ya gaon aur ek landmark — ya seedha call kar dijiye. Confirm karne ke liye call aam taur par 30 minute ke andar aati hai, jismein slot, pata aur fasting ki baat tay ho jaati hai. Parcha zaroori nahi hai, lekin hai to uska photo bhej dijiye: Thyroid Total aur Free, Sugar Fasting aur PP, Widal aur Typhidot jaise milte julte naam ki wajah se galat test ho jaana sabse aam galti hai, aur photo hone par ye galti hoti hi nahi.",
    links: [{ href: "/contact", label: "Contact — number aur booking help" }],
  },
];
