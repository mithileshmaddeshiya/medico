/**
 * Long-form SEO copy for /lab-test/ballia.
 *
 * WHY THIS FILE EXISTS AND NOT A TEMPLATE. Same reason deoria.js, gorakhpur.js,
 * salempur.js and azamgarh.js exist: a page that is another city's page with the
 * noun swapped does not get indexed — Google reads it as a doorway page. Five
 * lab pages are already live, so the sixth has the least room of all of them to
 * repeat an argument that has already been made.
 *
 * Two sections are this page's own and appear nowhere else on the site:
 *   • ganga-patti-paani-ballia — the Ganga belt and the diara: what the water
 *     question here actually is, what a blood test can and cannot answer about
 *     it, and the flat statement that we do NOT test water. It is written as
 *     much to stop a wrong purchase as to earn one.
 *   • garmi-loo-ballia — May–June in Ballia, which is regularly among the
 *     hottest stretches in the state: what dehydration does to a kidney report,
 *     who needs watching, and why the 6 AM slot matters more here than anywhere.
 *
 * Deliberately NOT repeated here, because another page owns it:
 *   • "book from outside for the people at home"      → salempur.js
 *   • "the migrant's checkup when he comes home"      → deoria.js
 *   • "get the report before the OPD visit"           → gorakhpur.js
 *   • the anaemia-in-women-and-children section       → deoria.js
 *   • the mandal-headquarters distance argument       → azamgarh.js
 * Out-migration is as real in Ballia as anywhere in Purvanchal and it is
 * touched in ONE paragraph of the report section (forwarding a PDF to whoever
 * is outside), not given a heading — two other pages already argue it, and a
 * third costs all three.
 *
 * ── Claims and their sourcing ────────────────────────────────────────────
 * Only the confirmed set (see the warning above defaultFaqs in
 * src/data/lab/defaults.js): free home collection, a trained phlebotomist
 * carrying an ID card, slots from 6 AM, reports in 24 hours, cash/UPI at
 * collection, a callback in about 30 minutes, a visit of about 10 minutes.
 * NOT claimed here, however well it would rank: NABL accreditation, cold-chain
 * transport, barcoded tubes, pathologist verification, a "24 ghante khula lab",
 * a water-testing service, or a walk-in counter of our own anywhere in the
 * district. There isn't one — this is a home-collection service area, and the
 * copy says so in its own heading rather than leaving the reader to guess.
 *
 * Local geography is stated only where it is checkable and hedged the way the
 * other city files hedge it ("kareeb", "aam taur par"): Ballia is UP's eastern
 * edge, the Ganga runs along its south and east and the Ghaghara (Sarayu) along
 * the north, the two meet near the district's eastern end, Bihar starts across
 * the water on both sides, and the district is divided into six tehsils —
 * Sadar, Rasra, Bansdih, Bairia, Sikandarpur and Belthara Road. The arsenic
 * paragraph is written as what has been REPORTED in the Ganga-belt blocks and
 * as an instruction to get the handpump itself tested through the block or Jal
 * Nigam — not as a finding of ours, and not as something a blood test settles.
 * The lines worth re-checking before a paid push: the tehsil list, the Varanasi
 * and Gorakhpur distances, and the city PIN in the seed entry.
 *
 * ── How the keywords are placed ──────────────────────────────────────────
 * One primary term ("lab test in Ballia" / "Ballia me lab test"), carried by the
 * URL, the H1, the title and the lead section. Everything else gets its OWN
 * heading, because a heading ranks and a term buried mid-paragraph mostly does
 * not: pathology lab / diagnostic centre, home sample collection with the
 * tehsil towns named, sugar and thyroid follow-up, fever panel, full body
 * checkup, price / rate list, fasting, report. Each appears in ONE H2 and then
 * reads as prose.
 *
 * ── Internal links ───────────────────────────────────────────────────────
 * Paragraph parts of the form { text, href } render as real in-prose links (see
 * LabContent). Every href below must be a route that renders:
 *   /lab-test/{varanasi,gorakhpur,azamgarh}        (src/data/lab/cities.js)
 *   /blogs/{lab-test,full-body-checkup}/varanasi    (src/data/blogs/varanasi/)
 *   /contact
 */

/* Link targets, kept as constants so a route rename is a one-line fix here
   rather than a hunt through the prose — and so a typo shows up as `undefined`
   in the href instead of as a silent 404 in production. */
const LAB_VARANASI = "/lab-test/varanasi";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_AZAMGARH = "/lab-test/azamgarh";
const GUIDE_LAB_TEST = "/blogs/lab-test/varanasi";
const GUIDE_FULL_BODY = "/blogs/full-body-checkup/varanasi";

export const balliaContent = [
  {
    id: "lab-test-in-ballia",
    h: "Ballia Me Lab Test — Ghar Baithe Blood Test Booking Aur Free Home Sample Collection",
    p: [
      "Ballia me jaanch ka sabse bada kharcha fees nahi, safar hai. Lab aur collection centre sheher me hain — Station Road, Bhrigu Ashram, Kachehri aur zila aspatal ke aas-paas — aur jile ka bada hissa wahan se 30 se 50 kilometre door baitha hai. Rasra, Sikandarpur, Belthara Road, Bansdih ya Bairia se ek CBC ke liye nikalne ka matlab hai subah ki gaadi, khaali pet safar, counter par line, aur report lene ke liye doosre din phir wahi rasta.",
      "Home sample collection isi rasta kharch ko khatam karta hai. Aap apna pata dete hain, subah ka slot chunte hain, aur trained phlebotomist ID card ke saath aapke darwaze par aata hai. Sample wahin liya jaata hai aur report 24 ghante ke andar WhatsApp aur email par PDF me aa jaati hai — na kiraya, na khaali pet ka safar, na line, na doosra chakkar.",
      "Yahan routine pathology ke saare test aur health package book hote hain — CBC, Thyroid Profile, Blood Sugar, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test, Vitamin D, Vitamin B12, Dengue, Urine Routine aur Full Body Checkup. Doctor ka parcha hai to usi panel ke hisaab se booking ho jaati hai; koi test is page par naam se na dikhe to parche ke saath ek call kar lijiye — zyadatar test usi home visit me ho jaate hain.",
    ],
  },

  {
    /* "Ballia me pathology lab", "diagnostic centre Ballia", "lab test near me"
       — teenon ka intent ek hi hai: jaana kahan padega. Isliye alag heading aur
       us par seedha jawab, sabse pehle ye ki hamara counter hai hi nahi. Azamgarh
       wale page se alag baat yahan ye hai ki wahan bheed ka tark hai, yahan
       nadi aur doori ka: jile ka aakar utna bada nahi, par rasta paani se kata
       hua hai. */
    id: "pathology-lab-diagnostic-centre-ballia",
    h: "Ballia Me Pathology Lab Ya Diagnostic Centre Dhoondh Rahe Hain?",
    p: [
      "Pehle ek baat saaf kar dena theek rahega: hamara koi walk-in counter Ballia me nahi hai, aur is page par kahin ye nahi likha jaayega ki hai. Ye home collection service hai — hum aapke ghar se sample lete hain, aur wahi sach hai jo yahan likha hai.",
      "Iska matlab samajh lena kaam ka hai. Sheher ke chhote collection centre par bhi aam taur par sirf sample liya jaata hai; jaanch badi lab me hoti hai aur report wahin se banti hai. Yaani sample ko safar to karna hi hai. Sawaal sirf itna hai ki us safar ki shuruaat aapke ghar se ho, ya aapke gaadi pakadne, line lagane aur wapas aane ke baad. Blood aur urine ke saare aam test sirf sample par hote hain, isliye ghar se shuruaat karna kisi tarah kam bharosemand nahi hai — bas ek poora din bach jaata hai.",
      "Sample lene ka kaam trained phlebotomist karta hai, ID card ke saath, aapke saamne. Sample dene se pehle teen cheezein kar lijiye: uska ID card dekh lijiye, doctor ka parcha saamne rakh dijiye taaki wahi panel liya jaaye jo likha hai, aur jis test ke card par 'Call for price' likha hai uska daam pehle pooch lijiye. Home visit ke slot subah 6 baje se shuru hote hain aur shaam tak chalte hain. Report 24 ghante ke andar aati hai — hum 24 ghante khula lab hone ka daawa nahi karte, 24 ghante me report milne ka karte hain.",
      "Aur ek aadat jo yahan sabse zyada nuksan karti hai: jo test aap mahino tak dohrate hain — HbA1c, TSH, creatinine, haemoglobin — unhe har baar alag alag jagah se mat karaiye. Ye sheher me ek jagah, phir mele ke bahane doosri jagah, phir Ganga paar Buxar me karwa lene se hota hai. Alag machine aur method ke reference range thode alag hote hain, isliye ek jagah TSH 4.5 aur doosri jagah 4.1 aane ka matlab ye nahi ki aapka thyroid badal gaya. Doctor badlav dekhta hai, sirf aaj ka number nahi.",
    ],
  },

  {
    id: "home-sample-collection-ballia",
    h: "Ballia Sheher Aur Jile Me Home Sample Collection — Station Road Se Rasra, Bansdih, Bairia Aur Belthara Road Tak",
    p: [
      "Sheher me collection Station Road, Bhrigu Ashram, Kachehri, Chowk, Agrasen Chauraha aur zila aspatal ke aas-paas hoti hai. Jile me Phephna, Rasra, Bansdih, Bairia, Sikandarpur, Belthara Road, Reoti, Maniyar, Sahatwar, Nagra, Chitbara Gaon, Garwar, Dubhar, Sohaon, Hanumanganj, Beruarbari aur Murli Chhapra jaise kasbe aur inse lage gaon aam taur par cover hote hain. Aapka gaon is list me naam se nahi hai to maan kar mat baithiye ki service nahi hai; booking se pehle ek call kar lijiye — cover hota hai to usi waqt slot book ho jaayega, aur nahi hota to hum saaf bata denge, taaki aap intezaar kar ke pareshan na hon.",
      "Pata likhne ka tarika yahan doosre jilon se zyada maayne rakhta hai, kyunki yahan raste nadi ke hisaab se chalte hain. Sheher me mohalle ka naam aur ek jaana pehchana landmark likhiye — school, mandir ya masjid, petrol pump, tiraha, bank. Gaon me sirf gaon ka naam kaafi nahi hota: tola ya purwa ka naam likhiye, saath me post office aur thana ka naam. Ek hi naam ke do gaon paas paas hone bahut aam baat hai, aur late visit ki sabse badi wajah yahi hoti hai.",
      "Ganga ya Sarayu ke kinare wale gaon me ek baat aur jod dijiye: bandh ke kis taraf hain, aur pahunchne ka rasta kaunsa hai — kaunse chauraha ya ghat se mudna hai. Barsaat ke mahino me kai raste badal jaate hain aur diara ke ilaake me pahunchna waqt maangta hai. Booking ke waqt ye bata dena poori visit ko aasan kar deta hai, aur slot bhi usi hisaab se rakha jaata hai.",
      "Mobile number wahi dijiye jo us waqt chalu rahega, aur ho sake to ek doosra number bhi likh dijiye. Kai gaon me network ek hi kone me aata hai — phlebotomist ka ek call chhoot jaane se poori visit atak jaati hai.",
      "Ghar me ek se zyada log test kara rahe hain — maa-baap, dada-dadi, bachche — to sabki booking ek hi slot me kar dijiye; ek hi visit me sabka sample ho jaayega. Aur ye baat khaas taur par unke liye hai jinke ghar me koi bujurg hai, bistar par hai, lakwe ya operation ke baad recovery kar raha hai, ya koi diabetic hai jinki nas patli ho gayi hai — booking ke waqt ye bata dijiye, taaki aane wala taiyaari ke saath aaye aur baar baar sui na lagani pade. Sample se thodi der pehle mareez ko paani pila dijiye, jab tak fasting ke niyam mana na karein; paani ki kami se nas dhoondhna sach me mushkil ho jaata hai.",
    ],
  },

  {
    /* Is page ka apna hissa (1/2). Ganga-patti aur diara ka paani — Ballia ki
       apni cheez hai, aur site ke kisi doosre page par nahi hai. Yahan sabse
       zaroori baat ye hai ki ye section BECHNE ke liye nahi likha gaya: arsenic
       ka jawab blood test nahi hai, paani ki jaanch hai, aur wo hum karte hi
       nahi — ye saaf likha hai. Jo hum sach me kar sakte hain (LFT, KFT, CBC ki
       nigrani) sirf utna claim kiya gaya hai, aur chamdi ke lakshan seedhe
       doctor ke paas bheje gaye hain. */
    id: "ganga-patti-paani-ballia",
    h: "Ganga Patti Aur Diara Ke Gaon — Paani, Arsenic Aur Wo Jaanch Jo Sach Me Kaam Ki Hai",
    p: [
      "Ballia UP ka aakhiri chhor hai. Jile ke dakshin aur poorab me Ganga chalti hai, uttar me Sarayu (Ghaghara), aur dono ka sangam jile ke poorabi kone ke paas hota hai. Isi wajah se yahan gaon ki ek badi ginti diara aur bandh ke aas-paas basi hai, jahan har saal paani ka chadhna-utarna zindagi ka hissa hai. Sehat ke lihaz se is bhugol ki do alag alag baatein hain, aur inhe aapas me mila dena sabse aam galti hai.",
      "Pehli baat handpump ke paani ki. Ganga se lage kai gaon me handpump ke paani me arsenic milne ki baat samay samay par saamne aati rahi hai, aur log poochhte hain ki 'iski jaanch ka test kaunsa hai'. Seedha jawab ye hai: arsenic ka pata paani ki jaanch se chalta hai, khoon ki jaanch se nahi — aur hum paani ki jaanch nahi karte, na hi is page par uska koi package hai. Agar aapke gaon me shak hai to handpump ka paani block, Jal Nigam ya jal sansthan ke zariye jaanchwaiye; asli ilaaj bhi wahi hai — paani ka source badalna, kisi jaanche hue source se peene ka paani lena. Koi lab test paani theek nahi karta.",
      "Iska matlab ye nahi ki jaanch ka koi kaam hi nahi. Jo cheez sach me kaam ki hai wo nigrani hai: lambe samay se ek hi sandigdh source ka paani pi rahe parivaar me Liver Function Test, Kidney Function Test aur CBC saal me ek baar dekh lena samajhdari hai, kyunki ye teenon batate hain ki sharir par kahin dabaav to nahi pad raha. Ye teenon ek hi sample me ho jaate hain aur ghar par ho jaate hain. Lekin inka positive ya negative aana arsenic ka saboot nahi hota — ye sirf sehat ki tasveer deta hai, jise doctor padhta hai.",
      "Aur ek baat bilkul saaf: hatheli aur talwe ki khaal ka mota hona, badan par kaale-safed daag, chamdi par aise nishaan jo bade ho rahe hain — inka jawab koi blood test nahi hai. Seedha doctor ko dikhaiye, aur unhe ye zaroor bataiye ki peene ka paani kis source se aata hai. Ye baat batana diagnosis ka aadha kaam kar deta hai, aur package ke bharose baithna sabse bada nuksan karta hai.",
      "Doosri baat baadh aur barsaat ke baad ki hai, jo alag cheez hai. Jab paani utarta hai to peene ka paani aur naali ka paani paas paas aa jaate hain, aur usi ke saath typhoid, peeliya (hepatitis A aur E) aur pet ki bimariyan badh jaati hain. Aankhon ka peelapan, gehra peshab, ulti jaisa lagna aur bhookh ka khatam ho jaana dikhe to Liver Function Test (total aur direct bilirubin ke saath), Hepatitis A IgM aur Hepatitis E IgM karana chahiye. Pregnancy me peeliya ho to turant doctor ko dikhaiye — Hepatitis E garbhawastha me kahin zyada khatarnak hota hai aur ismein intezaar nahi karna chahiye.",
    ],
  },

  {
    /* Is page ka apna hissa (2/2). Ballia ki garmi — May-June me yahan ka naam
       sabse zyada garam jagahon me aata hai, aur iska seedha asar report par
       padta hai (dehydration se urea/creatinine aur haemoglobin jhoothe taur par
       badhe hue). Ye section 6 AM slot wale hamare apne claim ko sabse theek
       jagah par istemal karta hai, aur loo ko emergency ki tarah doctor ke paas
       bhejta hai — kyunki wo lab ka kaam hai hi nahi. */
    id: "garmi-loo-ballia",
    h: "Ballia Ki Garmi Me Jaanch — May-June Me Slot, Paani Aur Report Ka Sach",
    p: [
      "May aur June me Ballia ka naam raajya ki sabse garam jagahon me aksar aata hai, aur ye baat sirf mausam ki khabar nahi hai — iska seedha asar aapki report par padta hai. Sharir me paani ki kami hoti hai to khoon gaadha ho jaata hai, aur usi ke saath urea, creatinine aur haemoglobin jhoothe taur par badhe hue aa jaate hain. Wahi report thandi subah me, paani pi kar dene par alag aa sakti hai. Isliye garmi me ek hi cheez sabse zyada maayne rakhti hai: sample kis waqt liya gaya.",
      "Yahi wajah hai ki garmi ke mahino me subah 6 se 8 baje ka slot lena chahiye. Fasting wale test — Fasting Blood Sugar, Lipid Profile aur zyadatar full body package — waise bhi subah maangte hain, aur fasting me saada paani peena mana nahi hai, balki zaroori hai. Raat ka khana 9 baje tak khatam kijiye, subah paani pi lijiye, aur sample dete hi naashta kar lijiye. 14 ghante se zyada bhookhe rehna, wo bhi is garmi me, faayda nahi, nuksan karta hai.",
      "Kis par khaas dhyan chahiye, ye bhi seedha hai. Jinki BP ki dawa chal rahi hai — khaas kar wo dawa jo peshab badhati hai — unme garmi me sodium aur potassium neeche chale jaate hain, aur kamzori, chakkar aur pindliyon me ainthan usi ka nateeja hoti hai. Aise me saal ke is hisse me ek baar Kidney Function Test ke saath electrolytes dekh lena kaam ka hai. Diabetes wale bujurgon me garmi ke saath sugar ka bigadna aur bhi jaldi hota hai, isliye HbA1c ka teen mahine wala chakra garmi me taalna nahi chahiye.",
      "Khet, bhatta, mandi ya dhoop me kaam karne walon ki thakan ko 'garmi lag gayi hai' keh kar mahino nikaal diya jaata hai. Kabhi kabhi wo sirf garmi hoti hai, aur kabhi haemoglobin ki kami, thyroid, ya bina pata chala sugar. CBC, TSH aur Fasting Blood Sugar — teen saste test — ye tay kar dete hain ki baat mausam ki hai ya kisi aur cheez ki.",
      "Aur ek chetavani jo is jile me har garmi me kaam aati hai: kisi ko loo lag jaaye — tez bukhar ke saath pasina band ho jaaye, behoshi ya bhram ki halat ho, ulti ruk na rahi ho, ya bujurg sust pade hon — to lab test book mat kijiye, seedha najdeeki hospital le jaaiye. Ye emergency hai aur ismein har minute maayne rakhta hai; sample ka intezaar khatarnak hai.",
    ],
  },

  {
    id: "sugar-thyroid-followup-ballia",
    h: "Sugar, HbA1c Aur Thyroid Test Ballia Me — Dawa Bahar Se Shuru Hui, Follow-up Yahin Chhoot Jaata Hai",
    p: [
      "Yahan ek hi kahani baar baar milti hai: dikhaya Varanasi me, ya Patna me, ya Ganga paar Buxar me — dawa shuru ho gayi, parcha ghar aa gaya, aur uske baad ki jaanch kabhi hui hi nahi. Dawa medical se har mahine milti rehti hai, aur do saal beet jaate hain bina ye jaane ki dawa asar kar bhi rahi hai ya nahi. Ilaaj ka aadha hissa jaanch hai, aur wahi hissa doori ki wajah se chhoot jaata hai — kyunki log sochte hain ki jaanch bhi wahin karani padegi jahan dikhaya tha. Nahi padegi: routine blood test kahin bhi ho sakta hai, aur report doctor ko WhatsApp par dikhayi ja sakti hai.",
      "Diabetes ka calendar seedha sa hai. Har teen mahine me HbA1c — ye pichhle do-teen mahine ka ausat batata hai aur ismein fasting nahi chahiye, isliye ise taalne ki koi wajah hi nahi. Saal me ek baar Lipid Profile. Saal me ek baar Kidney Function Test ke saath urine microalbumin — microalbumin wahi test hai jo sabse pehle ishaara deta hai ki kidney par asar shuru ho raha hai, aur wahi sabse zyada chhoda jaata hai. Aur saal me ek baar aankh ka fundus check, jo lab ka nahi, doctor ka kaam hai.",
      "Thyroid ka niyam bhi utna hi seedha hai. Dawa ki dose badle to 6 se 8 hafte baad TSH dohraiye; uske baad har 6 se 12 mahine me. Jinhone kabhi karaya hi nahi — 35 ke baad ki mahilayein, jinke ghar me kisi ko thyroid hai, pregnancy plan kar rahi mahilayein, ya jinhe lagatar thakan, baal jhadna, wazan ka bina wajah badhna-ghatna ya periods ki gadbadi hai — unke liye ek baar TSH karana kaafi hai ye jaanne ke liye ki dikkat idhar hai ya nahi.",
      "BP ki dawa chal rahi hai to saal me ek baar kidney function aur electrolytes dekh lena chahiye, kyunki kuch dawaiyan inhe halka sa badal deti hain. Aur agar ghar me kai log dawa par hain, jo yahan ke bade parivaaron me aam hai, to sabka follow-up ek hi din, ek hi slot me karwa lijiye — ek visit me sabka sample ho jaayega aur agli baar ke liye taarikh bhi ek hi yaad rakhni padegi.",
      [
        "Ilaaj sheher se bahar chal raha hai to report wahan bhi utni hi chalti hai. ",
        { text: "Varanasi me lab test", href: LAB_VARANASI },
        " isi tarah ghar par hota hai, ",
        { text: "Gorakhpur me lab test", href: LAB_GORAKHPUR },
        " bhi, aur mandal mukhyalaya me dikhana ho to ",
        { text: "Azamgarh me lab test", href: LAB_AZAMGARH },
        " bhi usi tarah book hota hai.",
      ],
    ],
  },

  {
    id: "bukhar-dengue-typhoid-ballia",
    h: "Ballia Me Dengue, Typhoid Aur Malaria Test — Bukhar Ke Kis Din Kaunsa Test",
    p: [
      "Barsaat ke baad, jab nadi ka paani utarta hai aur gaon ke gadde bhare rehte hain, July se November ke beech bukhar ka bojh sabse zyada ho jaata hai. Sabse aam galti bimari pehchan-ne me nahi, din ginne me hoti hai — test sahi hota hai par galat din par, report negative aa jaati hai, aur ilaaj hafta bhar late ho jaata hai.",
      "Seedha niyam ye hai. Dengue me NS1 antigen bukhar ke pehle 1 se 5 din tak bharosemand hai; paanchve din ke baad wo aksar negative aa jaata hai aur tab IgM antibody karana padta hai. Typhoid me Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye, warna titre badhte hi nahi — aur is ilaake me typhoid endemic hai, isliye purane infection se bhi Widal positive aa sakta hai; sirf usi ke bharose ilaaj tay karna theek nahi. Typhidot IgM jaldi positive hota hai. Bukhar me thand aur kanpkanpi ho to malaria antigen aur peripheral smear jodiye. Jo bhi karayein, CBC saath me zaroor karwaiye — girta platelet count aur badhta haematocrit wahi cheez hai jo roz dekhi jaati hai.",
      "Mele aur bhead wale dinon me ek alag dhyan chahiye. Kartik Purnima ke Dadri mele me, Chhath ke ghaton par aur shaadi-byah ke mausam me bahar ka khana aur bahar ka paani dono badh jaate hain, aur uske do-teen hafte baad typhoid aur peeliya ke mareez alag se dikhte hain. Ghar ke kisi ek aadmi ko lambe bukhar ke saath pet ki shikayat ho to poore parivaar ke peene ke paani par ek baar sochiye — sirf ek aadmi ka test karwa lena adhoora kaam hai.",
      "Bukhar me ghar se nikalna sabse bhaari kaam hota hai, aur yahi wo waqt hai jab home collection sabse zyada kaam aata hai. Slot subah ka lijiye, kyunki bukhar ka panel aksar do-teen din baad dohrana padta hai aur ek hi samay par dohrana behtar rehta hai — do report ka aapas me milaan tabhi theek baithta hai.",
      "Ek zaroori chetavani. Bachche ko tez bukhar ke saath jhatke aayein, behoshi ho, gardan akad jaaye, lagatar ulti ho ya wo sust pada rahe — to lab test book mat kijiye, seedha najdeeki hospital le jaaiye. Ye emergency hai aur ismein ek-ek ghanta maayne rakhta hai; blood test iska pehla jawab nahi hai aur home collection ka intezaar khatarnak hai.",
    ],
  },

  {
    id: "full-body-checkup-ballia",
    h: "Ballia Me Full Body Checkup Package — 45, 72 Aur 88 Parameter Wale Plan",
    p: [
      "Achha full body checkup parameter ki ginti se nahi, coverage se tay hota hai. Kam se kam paanch cheezein aani chahiye: blood count (CBC), sugar, heart ke liye lipid profile, liver function, aur kidney function ke saath urine routine. Iske upar thyroid, Vitamin D aur B12 jud jaayein to package se sach me kuch pata chalta hai.",
      "Basic Full Body Checkup (45 parameter, ₹999) un logon ke liye theek hai jinki umar kam hai aur koi shikayat nahi — saal ka ek baseline ban jaata hai. Advanced Full Body (72 parameter, ₹1,999) me thyroid, HbA1c aur vitamins jud jaate hain; 30 se 50 saal walon ke liye yahi sabse sahi baithta hai. Senior Citizen Pack (88 parameter, ₹2,999) 55 ke upar ke liye hai, jismein heart, haddi aur sugar ki screening ek saath hoti hai.",
      "Package apne risk ke hisaab se chuniye, price ke hisaab se nahi. Ghar me diabetes ya dil ki bimari chali aa rahi hai to HbA1c, lipid aur kidney markers ko priority dijiye. Ghar ka khana zyadatar shakahari hai to Vitamin B12 saal wale panel me hona hi chahiye. Aur khet ya bahar ka kaam karte hain phir bhi thakan nahi jaati, to CBC aur thyroid ko chhodiye mat — ye do test hi sabse zyada jawab dete hain.",
      "Ek galatfehmi door kar lena zaroori hai: full body checkup har bimari nahi pakadta. Ye screening hai — jo cheez chup chaap badh rahi hoti hai use jaldi pakadne ke liye. Koi shikayat pehle se hai to package ke bharose mat baithiye, doctor ko dikhaiye aur wahi test karaiye jo wo kahe.",
      [
        "Poora package ek hi sample me ho jaata hai aur zyadatar package fasting maangte hain, isliye subah ka slot lijiye. Ghar ke kai log ek saath karaa rahe hain to sabka ek hi slot me book kijiye. Kis umar me kaun sa package theek rehta hai aur '80+ parameters' ka sach kya hai, wo ",
        { text: "full body checkup wali guide", href: GUIDE_FULL_BODY },
        " me alag se likha hai.",
      ],
    ],
  },

  {
    id: "lab-test-price-ballia",
    h: "Ballia Me Lab Test Price Aur Rate List — Kaunsa Test Kitne Ka",
    p: [
      "Is page par har card par jo price likha hai, wahi aapko dena hai. Home sample collection uske upar free hai — na visiting charge, na travel charge, na koi hidden fee. Jile ke kisi bhi kasbe me daam wahi rehta hai jo sheher me hai; Rasra, Bairia ya Belthara Road door hone par kuch extra nahi lagta.",
      "Rate list is tarah hai: Blood Sugar ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1,000, Vitamin B12 ₹1,200 aur Dengue (NS1, IgG, IgM) ₹1,200. Ye wahi rate hain jo hamare doosre sheheron me hain.",
      "Package me bachat sabse zyada hoti hai. Basic Full Body ₹999 me 45 parameter deta hai — wahi test alag alag karane par kharcha kai guna ho jaata hai. Advanced ₹1,999 me 72 parameter aur Senior Citizen Pack ₹2,999 me 88 parameter deta hai.",
      "Kuch test, jaise Fever Panel (malaria, typhoid aur dengue ek saath), price par nahi balki us waqt ki zaroorat par tay hote hain — unke card par 'Call for price' likha rehta hai. Aise me phone par pooch lijiye; sample dene se pehle price bata diya jaata hai. Payment sample lene ke waqt hi hota hai — cash ya UPI se, PhonePe, Google Pay ya Paytm.",
    ],
  },

  {
    id: "fasting-taiyari-ballia",
    h: "Sample Dene Se Pehle Kya Karein, Kya Na Karein — Fasting Ke Niyam",
    p: [
      "Fasting wale test — Fasting Blood Sugar, Lipid Profile aur zyadatar full body package — me 10 se 12 ghante kuch nahi khana hota. Saada paani peena mana nahi hai, balki zaroori hai: paani ki kami se nas dhoondhna mushkil ho jaata hai aur haemoglobin, urea tatha creatinine jhoothe taur par badhe hue aate hain — is jile ki garmi me ye sabse jaldi hota hai. Raat ka khana 9 baje tak khatam kar lijiye aur subah 6 se 8 baje ka slot lijiye.",
      "Fasting sample se pehle chai — doodh wali to bilkul nahi — biscuit, toffee, paan, khaini ya gutkha kuch bhi nahi. Ek chai bhi sugar aur lipid ki report badal deti hai, aur phir wahi test dobara karana padta hai. Sirf saada paani.",
      "Lipid Profile ya Liver Function Test se kam se kam 24 ghante pehle sharaab bilkul na lein — ek shaam ki peene se hi triglycerides aur liver enzymes kaafi badh jaate hain. Kidney function ya CPK karana ho to ek din pehle bahut bhaari mehnat avoid kijiye; khet ka kaam, lambi cycle ya dhoop me lagatar zor bhi ismein aata hai.",
      "Dawa ka aam niyam ye hai ki apni rozana ki goliyan usi samay lijiye, jab tak doctor mana na kare. Do exception hain: thyroid ki goli sample dene ke baad leni chahiye, aur biotin ya multivitamin kisi bhi hormone test se 2 se 3 din pehle band kar dena chahiye. Phlebotomist ko bata dijiye ki aap kaun kaun si dawa le rahe hain — is baat se report padhne wale ka kaam aasan ho jaata hai.",
      "Aur ek baat un logon ke liye jinka kaam subah jaldi shuru hota hai: non-fasting test — CBC, Thyroid Profile, HbA1c, Vitamin D, Vitamin B12, Dengue — din me kabhi bhi ho sakte hain. Sirf fasting wale test subah ke slot maangte hain. Isliye agar subah ka waqt nahi nikal pa raha to booking ke waqt bata dijiye; jo test bina fasting ke hote hain unka slot baad ka bhi rakha ja sakta hai.",
    ],
  },

  {
    id: "report-ballia",
    h: "Report Kab Milegi — 24 Ghante Me WhatsApp Par PDF, Aur Use Kaise Padhein",
    p: [
      "Zyadatar routine test ki report 24 ghante ke andar aa jaati hai — CBC, sugar, lipid, LFT, KFT, thyroid aur urine routine. Vitamin aur hormone me aam taur par utna hi samay lagta hai. Culture jaan boojh kar dheere hote hain: urine ya blood culture me 48 se 72 ghante lagte hain, kyunki pehle organism ko ugana padta hai aur uske baad hi pata chalta hai ki kaunsi dawa asar karegi. Isse jaldi ka vaada koi bhi lab imaandari se nahi kar sakta.",
      "Report WhatsApp aur email dono par PDF me aati hai, aur is jile me iska faayda alag hi hai. Ghar par maa-baap hain aur bete Mumbai, Surat, Delhi ya Gulf me — report bas forward kar dijiye, wahan baithe log usi waqt padh lete hain aur agla faisla saath me hota hai. Doctor Ballia me ho, Varanasi me ho ya Ganga paar — kagaz le kar bhaagne ki zaroorat nahi, aur report kho jaane ka darr bhi nahi. Purani report bhi phone me sambhal kar rakhiye; doctor ko badlav dekhna hota hai, sirf aaj ka number nahi.",
      "Number ko report par chhape reference range se hi milaiye, internet ke kisi chart se nahi. Range machine aur method ke hisaab se badalti hai, aur umar tatha ling ke hisaab se bhi. Thoda sa high ya low hona bahut aam hai aur aksar koi bimari nahi hoti — ye diagnosis nahi, doctor se poochne ka ishaara hai. WhatsApp par report kisi group me mat daaliye; ye aapki niji jaankari hai.",
      [
        "Kuch result me intezaar nahi karna chahiye, usi din doctor chahiye: dengue me tezi se girta platelet count, bahut zyada sugar ke saath ulti ya susti, bahut kam haemoglobin, ya bahut badha creatinine ke saath peshab kam hona. Tabiyat kharab lag rahi ho to kisi ke phone ka intezaar mat kijiye, seedha dikhaiye. Numbers ka matlab kya hota hai aur kis flag par ghabrana nahi chahiye, ye ",
        { text: "report kaise padhein wale hisse", href: `${GUIDE_LAB_TEST}#report-kaise-padhein` },
        " me detail me likha hai.",
      ],
    ],
  },

  {
    id: "how-to-book-ballia",
    h: "Ballia Me Lab Test Kaise Book Karein — Online Form Ya Ek Phone Call",
    p: [
      "Is page par apna test ya package chuniye aur booking form bhar dijiye — naam, mobile number, apna mohalla ya gaon, aur ek landmark. Ya seedha phone kar dijiye. Doctor ka parcha hai to uska photo saath rakhiye, kyunki panel usi ke hisaab se book hota hai.",
      "Parche ke naam milte julte hote hain aur yahi sabse aam galti ki jad hai. Thyroid me 'Total' aur 'Free' alag test hain; sugar me 'Fasting' aur 'PP' do alag sample hain, jabki HbA1c ek hi sample me teen mahine ka ausat batata hai aur usme fasting nahi chahiye; typhoid me Widal aur Typhidot alag hain; aur 'liver test' aam taur par LFT hota hai, 'kidney test' KFT. Parche ka photo bhej dene se ye galti hoti hi nahi.",
      "Booking ke baad confirm karne ke liye call aam taur par 30 minute ke andar aati hai — slot, pata aur ye ki test me fasting chahiye ya nahi. Aane wale phlebotomist ke paas ID card hota hai; sample dene se pehle use dekh lena aapka haq hai. Poori visit lagbhag 10 minute ki hoti hai. Payment usi waqt hota hai, cash ya UPI se. Uske baad aapko kuch karna nahi hai — report taiyaar hone par WhatsApp aur email par PDF khud aa jaayegi.",
      [
        "Ek aakhri baat: aap jile ke kisi aise gaon me hain jo is page par naam se nahi likha, ya bandh ke us paar diara me hain, to bhi ek call kar ke pooch lijiye — cover hota hai to wahi slot book ho jaayega, aur nahi hota to hum saaf bata denge. Number aur poora pata ",
        { text: "contact page", href: "/contact" },
        " par mil jaayega. Aur kaun sa test kis shikayat, umar aur mausam me karana chahiye, ye ",
        { text: "hamari poori guide", href: GUIDE_LAB_TEST },
        " me detail me likha hai.",
      ],
    ],
  },

  {
    /* Devanagari section, ek baar.
       Is jile me bahut si search Hindi me type hoti hai — "बलिया में लैब टेस्ट",
       "खून की जांच", "रेट लिस्ट". Poore page ko transliterate karna galat hota:
       baaki copy Hinglish me hai aur wahi log padhte hain. Ek alag section dono
       cover kar deta hai — aur ye upar likhi baaton ka anuvaad hai, naya daawa
       nahi, isliye claims kahin bhi alag nahi padte. */
    id: "ballia-lab-test-hindi",
    h: "बलिया में लैब टेस्ट — घर से सैंपल कलेक्शन की पूरी जानकारी (हिंदी में)",
    p: [
      "बलिया में खून की जांच के लिए अब शहर तक जाकर लाइन लगाने की ज़रूरत नहीं है। सीबीसी, थायरॉइड, शुगर, एचबीए1सी, लिपिड प्रोफाइल, लिवर और किडनी फंक्शन टेस्ट, विटामिन डी, विटामिन बी12, डेंगू, यूरिन रूटीन और फुल बॉडी चेकअप — ये सारी जांच सैंपल पर होती हैं, और सैंपल आपके घर से लिया जा सकता है।",
      "होम सैंपल कलेक्शन बिल्कुल मुफ़्त है। आप सिर्फ़ टेस्ट का वही दाम देते हैं जो कार्ड पर लिखा है — कोई विज़िटिंग चार्ज या छिपा हुआ शुल्क नहीं, और ज़िले के दूर वाले कस्बों में भी वही रेट लगता है। सुबह 6 बजे से स्लॉट शुरू हो जाते हैं, ताकि खाली पेट वाली जांच जल्दी हो जाए और आप तुरंत नाश्ता कर सकें। रिपोर्ट 24 घंटे में व्हाट्सएप और ईमेल पर पीडीएफ में आ जाती है।",
      "रेट लिस्ट: ब्लड शुगर ₹100, सीबीसी ₹400, थायरॉइड प्रोफाइल ₹550, एचबीए1सी ₹600, लिवर फंक्शन टेस्ट ₹600, किडनी फंक्शन टेस्ट ₹700, लिपिड प्रोफाइल ₹800, विटामिन डी ₹1,000, विटामिन बी12 ₹1,200 और डेंगू ₹1,200। बेसिक फुल बॉडी चेकअप ₹999 में 45 पैरामीटर, एडवांस ₹1,999 में 72 और सीनियर सिटिज़न पैक ₹2,999 में 88 पैरामीटर देता है।",
      "सैंपल शहर में स्टेशन रोड, भृगु आश्रम, कचहरी और चौक के आस-पास लिया जाता है, और ज़िले में फेफना, रसड़ा, बांसडीह, बैरिया, सिकंदरपुर, बेल्थरा रोड, रेवती, मनियर, सहतवार, नगरा, चितबड़ागांव, गड़वार, दुबहड़ और मुरली छपरा तक। आपका गाँव इस सूची में न हो तो एक बार फ़ोन कर लीजिए — कवर होने पर उसी समय स्लॉट बुक हो जाएगा। पता लिखते समय टोला या पुरवा का नाम, एक लैंडमार्क और बांध के किस तरफ़ हैं यह ज़रूर बताइए।",
      "गर्मी के महीनों में सुबह का स्लॉट लीजिए — शरीर में पानी की कमी से यूरिया, क्रिएटिनिन और हीमोग्लोबिन झूठे तौर पर बढ़े हुए आते हैं। खाली पेट वाली जांच में सादा पानी पीना मना नहीं है, बल्कि ज़रूरी है। जिनकी शुगर, बीपी या थायरॉइड की दवा चल रही है, उनके लिए घर पर जांच का सबसे बड़ा फ़ायदा यही है कि फॉलो-अप छूटता नहीं — हर तीन महीने में एचबीए1सी, साल में एक बार लिपिड और किडनी फंक्शन, और दवा की डोज़ बदलने के 6 से 8 हफ़्ते बाद टीएसएच। पेमेंट सैंपल लेते समय नकद या यूपीआई से होता है।",
      [
        "हैंडपंप के पानी में आर्सेनिक की जांच पानी की जांच से होती है, खून से नहीं — वह हम नहीं करते; उसके लिए ब्लॉक या जल निगम से पानी की जांच कराइए। किसी को लू लग जाए, बेहोशी हो, या बच्चे को तेज़ बुखार के साथ झटके आएं — तो जांच बुक करने के बजाय सीधे नज़दीकी अस्पताल ले जाइए, यह आपात स्थिति है। कौन सी जांच कब करानी चाहिए, इसकी पूरी जानकारी ",
        { text: "हमारी गाइड में", href: GUIDE_LAB_TEST },
        " दी गई है।",
      ],
    ],
  },
];

/**
 * Ballia's own FAQs.
 *
 * The generated defaults ask the same seven questions for every city with the
 * name swapped — exactly the duplication that keeps a sixth page out of the
 * index, and the FAQ block is the part Google is most likely to lift into a
 * rich result, so near-identical answers across cities actively hurt.
 *
 * These are written against the questions a Ballia reader actually has and a
 * Deoria or Azamgarh reader does not: does anyone come out to Rasra, Bairia or
 * across the bandh, is the handpump-water question something a blood test can
 * answer, what the summer does to a report, and whether treatment started in
 * Varanasi or across the river in Bihar can be followed up from home. The two
 * that decide a booking are placed first — page.js renders the first eight, so
 * this list is exactly eight.
 *
 * The "bachche ko jhatke" emergency question is deliberately NOT here: three
 * other cities already carry it as an FAQ, and a fourth identical Q&A in the
 * schema is duplication where it costs the most. The same warning is in the
 * fever section's prose and again in the heat section, so nothing is lost.
 *
 * `links` is optional per FAQ and renders UNDER the answer, never inside the
 * schema text: the JSON-LD has to mirror the readable answer exactly, so the
 * links live outside `a`. See LabFaq.
 *
 * Claims are limited to the confirmed set: free home collection, trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI.
 */
export const balliaFaqs = [
  {
    q: "Ballia me lab test ka kitna kharcha aata hai, aur kya home sample collection free hai?",
    a: "Aap sirf test ka wahi price dete hain jo card par likha hai — Ballia me home sample collection bilkul free hai, na visiting charge na koi hidden fee. Rate list is tarah hai: Blood Sugar ₹100, CBC ₹400, Thyroid Profile ₹550, HbA1c ₹600, Lipid Profile ₹800 aur Basic Full Body Checkup ₹999 se shuru. Rasra, Bairia ya Belthara Road jaise door ke kasbon me bhi wahi rate lagta hai jo sheher me hai. Payment sample lene ke waqt cash ya UPI se hota hai.",
  },
  {
    q: "Kya Ballia me aapka koi lab ya collection centre hai — Station Road ya Bhrigu Ashram ke paas?",
    a: "Nahi — hamara koi walk-in counter Ballia me nahi hai, aur hum aisa daawa nahi karte. Ye home collection service hai: trained phlebotomist ID card ke saath aapke ghar aata hai aur sample wahin liya jaata hai, chahe aap sheher me hon ya jile ke kisi gaon me. Home visit ke slot subah 6 baje se shuru hote hain aur shaam tak chalte hain. Hum 24 ghante khula lab hone ka daawa bhi nahi karte; report 24 ghante ke andar milne ka karte hain.",
  },
  {
    q: "Ballia jile me aap kaun kaun se ilaake cover karte hain — Rasra, Bairia aur diara ke gaon bhi?",
    a: "Sheher me Station Road, Bhrigu Ashram, Kachehri, Chowk aur zila aspatal ke aas-paas, aur jile me Phephna, Rasra, Bansdih, Bairia, Sikandarpur, Belthara Road, Reoti, Maniyar, Sahatwar, Nagra, Chitbara Gaon, Garwar, Dubhar, Sohaon, Hanumanganj, Beruarbari aur Murli Chhapra tak — inse lage gaon bhi aam taur par cover hote hain. Aapka gaon is list me naam se nahi hai to bhi ek baar call kar ke pooch lijiye. Pata likhte waqt tola ya purwa ka naam, post office, ek landmark aur ye zaroor bataiye ki aap bandh ke kis taraf hain — barsaat me diara ke raste badal jaate hain aur late visit ki sabse badi wajah yahi hoti hai.",
  },
  {
    q: "Handpump ke paani me arsenic ki baat sunte hain — kya iska koi blood test hota hai?",
    a: "Arsenic ka pata paani ki jaanch se chalta hai, khoon ki jaanch se nahi — aur hum paani ki jaanch nahi karte, na is page par uska koi package hai. Gaon me shak ho to handpump ka paani block, Jal Nigam ya jal sansthan se jaanchwaiye, aur peene ka paani kisi jaanche hue source se lijiye; asli ilaaj wahi hai. Jaanch ka kaam sirf nigrani ka hai: lambe samay se ek hi sandigdh source ka paani pi rahe parivaar me saal me ek baar Liver Function Test, Kidney Function Test aur CBC dekh lena samajhdari hai. Chamdi par kaale-safed daag ya hatheli-talwe ka mota hona dikhe to seedha doctor ko dikhaiye aur unhe paani ka source zaroor bataiye.",
  },
  {
    q: "Garmi me report par asar padta hai kya — May-June me sample kab dena chahiye?",
    a: "Haan, padta hai. Sharir me paani ki kami se khoon gaadha ho jaata hai aur urea, creatinine tatha haemoglobin jhoothe taur par badhe hue aa jaate hain. Isliye garmi me subah 6 se 8 baje ka slot lijiye. Fasting me saada paani peena mana nahi hai, balki zaroori hai — sirf chai, doodh, biscuit ya kuch khaana mana hai. BP ki dawa par hain aur garmi me chakkar, kamzori ya pindliyon me ainthan ho rahi hai to Kidney Function Test ke saath electrolytes dekh lijiye. Aur kisi ko loo lag jaaye — behoshi, bhram, ya pasina band — to test book karne ke bajaye seedha hospital le jaaiye.",
  },
  {
    q: "Bukhar me dengue aur typhoid ka test kis din karana chahiye?",
    a: "Dengue me NS1 antigen bukhar ke pehle 1 se 5 din tak bharosemand hai; paanchve din ke baad wo aksar negative aa jaata hai aur tab Dengue IgM antibody karana padta hai. Typhoid me Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye, warna titre badhte hi nahi; Typhidot IgM jaldi positive hota hai. Thand aur kanpkanpi ho to malaria antigen aur peripheral smear jodiye. Jo bhi karayein, CBC saath me zaroor karwaiye — girta platelet count wahi cheez hai jo roz dekhi jaati hai. Baadh ke baad peelapan, gehra peshab ya ulti jaisa lage to LFT ke saath Hepatitis A aur E IgM karaiye.",
  },
  {
    q: "Ilaaj Varanasi ya Ganga paar Bihar me chal raha hai — kya follow-up jaanch Ballia me ghar par ho sakti hai?",
    a: "Haan. Routine blood test kahin bhi ho sakta hai; ye zaroori nahi ki jaanch wahin ho jahan aapne dikhaya tha. Report 24 ghante ke andar WhatsApp aur email par PDF me aati hai, jise aap doctor ko dikha sakte hain ya bhej sakte hain. Diabetes me har teen mahine me HbA1c, saal me ek baar Lipid Profile aur Kidney Function Test ke saath urine microalbumin; thyroid me dose badalne ke 6 se 8 hafte baad TSH, uske baad har 6 se 12 mahine me. Ek hi test ko baar baar alag alag jagah se mat karaiye — reference range alag hone se tulna galat baithti hai.",
    links: [{ href: GUIDE_LAB_TEST, label: "Kaun sa test kab karayein — guide" }],
  },
  {
    q: "Ballia me booking kaise karein, aur doctor ka parcha bhejna zaroori hai?",
    a: "Is page par test ya package chuniye aur form bhar dijiye — naam, mobile number, mohalla ya gaon aur ek landmark — ya seedha call kar dijiye. Confirm karne ke liye call aam taur par 30 minute ke andar aati hai, jismein slot, pata aur fasting ki baat tay ho jaati hai. Parcha zaroori nahi hai, lekin hai to uska photo bhej dijiye: Thyroid Total aur Free, Sugar Fasting aur PP, Widal aur Typhidot jaise milte julte naam ki wajah se galat test ho jaana sabse aam galti hai, aur photo hone par ye galti hoti hi nahi. Ghar me kai log karaa rahe hain to sabki booking ek hi slot me kar dijiye — ek visit me sabka sample ho jaayega.",
    links: [{ href: "/contact", label: "Contact — number aur booking help" }],
  },
];
