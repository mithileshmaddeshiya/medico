/**
 * Long-form SEO copy for /lab-test/mau.
 *
 * WHY THIS FILE EXISTS AND NOT A TEMPLATE. Same reason deoria.js, gorakhpur.js,
 * salempur.js, azamgarh.js and ballia.js exist: a page that is another city's
 * page with the noun swapped does not get indexed — Google reads it as a
 * doorway page. Six lab pages are already live, so the seventh has the least
 * room of all of them to repeat an argument that has already been made.
 *
 * Two sections are this page's own and appear nowhere else on the site:
 *   • powerloom-bunkar-sehat-mau — Mau is a powerloom town before it is
 *     anything else. What a blood test can honestly say about a life spent in
 *     a loom shed (anaemia, sugar, vitamin D, thyroid), and — more importantly
 *     — what it CANNOT: cotton dust and a long cough are not blood-test
 *     questions. The TB paragraph deliberately sends the reader to a free
 *     government sputum test and tells them NOT to buy a TB antibody blood
 *     test, which is a sale refused on purpose.
 *   • shift-fasting-taiyari-mau — the fasting rules rewritten for a district
 *     where a large share of adults works night or rotating loom shifts: what
 *     "10–12 ghante khaali pet" means when your day is inverted, why a fasting
 *     sample straight off a night shift is a bad sample, and which tests do not
 *     care what time it is. No other city file argues sample TIMING this way.
 *
 * Deliberately NOT repeated here, because another page owns it:
 *   • "book from outside for the people at home"      → salempur.js
 *   • "the migrant's checkup when he comes home"      → deoria.js
 *   • "get the report before the OPD visit"           → gorakhpur.js
 *   • the anaemia-in-women-and-children section       → deoria.js
 *   • the mandal-headquarters distance argument       → azamgarh.js
 *   • the Ganga belt / handpump-arsenic section       → ballia.js
 *   • the May–June heat-and-dehydration section       → ballia.js
 * Out-migration and Gulf work are as real in Mau as anywhere in Purvanchal and
 * are touched in ONE paragraph of the report section (forwarding a PDF to
 * whoever is outside), not given a heading — two other pages already argue it.
 *
 * ── Claims and their sourcing ────────────────────────────────────────────
 * Only the confirmed set (see the warning above defaultFaqs in
 * src/data/lab/defaults.js): free home collection, a trained phlebotomist
 * carrying an ID card, slots from 6 AM, reports in 24 hours, cash/UPI at
 * collection, a confirmation call in about 30 minutes, a visit of about 10
 * minutes, cultures in 48–72 hours.
 *
 * NOT claimed here, however well it would rank: NABL accreditation, cold-chain
 * transport, barcoded tubes, pathologist verification, a "24 ghante khula lab",
 * spirometry or any lung-function service, a TB test of our own, or a walk-in
 * counter anywhere in the district. There isn't one — this is a home-collection
 * service area, and the copy says so in its own heading rather than leaving the
 * reader to guess.
 *
 * Local geography is kept to the four things that are checkable, and is hedged
 * the way the other city files hedge it ("kareeb", "aam taur par"): the town is
 * also called Maunath Bhanjan, Mau Junction sits in the city, the Ghaghara
 * (Saryu) runs along the district's northern side with Doharighat on it, and
 * the mohalle and block towns named in the coverage section. Nothing else is
 * asserted — no tehsil count, no district-formation history, no road distances
 * to Azamgarh, Varanasi or Gorakhpur — because none of it is needed to make the
 * argument and each line would be one more thing to verify. The one distance in
 * the file is the "20 se 40 kilometre" span from the city to the block towns in
 * the lead, which is written as a range for that reason. The powerloom
 * paragraph states an industry the town is known for, not a headcount — no
 * worker numbers or loom counts are quoted anywhere, because nobody here has
 * surveyed them.
 *
 * ⚠ RE-CHECK BEFORE ANY PAID PUSH: the city mohalla names (Sahadatpura,
 * Mirzahadipura, Alinagar, Purani Bazar), the block-town list in the coverage
 * section, that 20–40 km span, and the city PIN in the seed entry. Those are
 * the four things in this file a local reader would catch first.
 *
 * ── How the keywords are placed ──────────────────────────────────────────
 * One primary term ("lab test in Mau" / "Mau me lab test"), carried by the URL,
 * the H1, the title and the lead section, with "Maunath Bhanjan" — the town's
 * official name and a genuine alternate search term, not a misspelling — named
 * in the lead, in an H2 and in its own FAQ. Everything else gets its OWN
 * heading, because a heading ranks and a term buried mid-paragraph mostly does
 * not: pathology lab / diagnostic centre, home sample collection with the block
 * towns named, sugar and thyroid follow-up, fever panel, full body checkup,
 * price / rate list, fasting, report.
 *
 * ── Internal links ───────────────────────────────────────────────────────
 * Paragraph parts of the form { text, href } render as real in-prose links (see
 * LabContent). Every href below must be a route that renders:
 *   /lab-test/{varanasi,gorakhpur,azamgarh}         (src/data/lab/cities.js)
 *   /blogs/{lab-test,full-body-checkup}/varanasi    (src/data/blogs/varanasi/)
 *   /contact
 * Ballia is linked from this city's `relatedLinks` block in cities.js rather
 * than from the prose — three in-prose city links in one paragraph is already
 * the most a reader will follow.
 */

/* Link targets, kept as constants so a route rename is a one-line fix here
   rather than a hunt through the prose — and so a typo shows up as `undefined`
   in the href instead of as a silent 404 in production. */
const LAB_VARANASI = "/lab-test/varanasi";
const LAB_GORAKHPUR = "/lab-test/gorakhpur";
const LAB_AZAMGARH = "/lab-test/azamgarh";
const GUIDE_LAB_TEST = "/blogs/lab-test/varanasi";
const GUIDE_FULL_BODY = "/blogs/full-body-checkup/varanasi";

export const mauContent = [
  {
    id: "lab-test-in-mau",
    h: "Mau Me Lab Test — Ghar Baithe Blood Test Booking Aur Free Home Sample Collection",
    p: [
      "Mau me jaanch ka asli kharcha fees nahi, waqt hai. Lab aur collection centre sheher me hain — Station Road, Mau Junction ke aas-paas, Purani Bazar aur zila aspatal ke kareeb — aur jile ka bada hissa wahan se 20 se 40 kilometre door baitha hai. Ghosi, Madhuban, Muhammadabad Gohna, Kopaganj ya Doharighat se ek CBC ke liye nikalne ka matlab hai subah ki gaadi, khaali pet safar, counter par line, aur report lene ke liye doosre din phir wahi rasta. Jinki dihadi rukti hai, unke liye ye do din ki majdoori ka nuksan hai — test ke daam se aksar zyada.",
      "Home sample collection isi rasta kharch ko khatam karta hai. Aap apna pata dete hain, apna slot chunte hain, aur trained phlebotomist ID card ke saath aapke darwaze par aata hai. Sample wahin liya jaata hai aur report 24 ghante ke andar WhatsApp aur email par PDF me aa jaati hai — na kiraya, na khaali pet ka safar, na line, na doosra chakkar, aur na kaam se chhutti.",
      "Yahan routine pathology ke saare test aur health package book hote hain — CBC, Thyroid Profile, Blood Sugar, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test, Vitamin D, Vitamin B12, Dengue, Urine Routine aur Full Body Checkup. Doctor ka parcha hai to usi panel ke hisaab se booking ho jaati hai; koi test is page par naam se na dikhe to parche ke saath ek call kar lijiye — zyadatar test usi home visit me ho jaate hain.",
      "Ek naam ki baat pehle hi saaf kar dena theek rahega, kyunki log dono tarah se dhoondhte hain: Mau aur Maunath Bhanjan ek hi jagah ke do naam hain. Aap \"Mau me lab test\" likhein ya \"Maunath Bhanjan me blood test\", ye page dono ke liye hai aur service bhi wahi hai.",
    ],
  },

  {
    /* "Mau me pathology lab", "diagnostic centre Mau", "lab test near me" —
       teenon ka intent ek hi hai: jaana kahan padega. Isliye alag heading aur
       us par seedha jawab, sabse pehle ye ki hamara counter hai hi nahi.
       Ballia wale page se alag baat yahan ye hai ki wahan nadi aur doori ka
       tark hai, yahan waqt ka: is jile me bahut se log ghante ke hisaab se
       kamate hain, aur unke liye aadha din nikaalna sabse mehnga hai. */
    id: "pathology-lab-diagnostic-centre-mau",
    h: "Mau (Maunath Bhanjan) Me Pathology Lab Ya Diagnostic Centre Dhoondh Rahe Hain?",
    p: [
      "Pehle ek baat saaf kar dena theek rahega: hamara koi walk-in counter Mau me nahi hai, aur is page par kahin ye nahi likha jaayega ki hai. Ye home collection service hai — hum aapke ghar se sample lete hain, aur wahi sach hai jo yahan likha hai.",
      "Iska matlab samajh lena kaam ka hai. Sheher ke chhote collection centre par bhi aam taur par sirf sample liya jaata hai; jaanch badi lab me hoti hai aur report wahin se banti hai. Yaani sample ko safar to karna hi hai. Sawaal sirf itna hai ki us safar ki shuruaat aapke ghar se ho, ya aapke gaadi pakadne, line lagane aur wapas aane ke baad. Blood aur urine ke saare aam test sirf sample par hote hain, isliye ghar se shuruaat karna kisi tarah kam bharosemand nahi hai — bas aadha din bach jaata hai.",
      "Sample lene ka kaam trained phlebotomist karta hai, ID card ke saath, aapke saamne. Sample dene se pehle teen cheezein kar lijiye: uska ID card dekh lijiye, doctor ka parcha saamne rakh dijiye taaki wahi panel liya jaaye jo likha hai, aur jis test ke card par 'Call for price' likha hai uska daam pehle pooch lijiye. Home visit ke slot subah 6 baje se shuru hote hain aur shaam tak chalte hain. Report 24 ghante ke andar aati hai — hum 24 ghante khula lab hone ka daawa nahi karte, 24 ghante me report milne ka karte hain.",
      "Aur ek aadat jo yahan sabse zyada nuksan karti hai: jo test aap mahino tak dohrate hain — HbA1c, TSH, creatinine, haemoglobin — unhe har baar alag alag jagah se mat karaiye. Ye sheher me ek jagah, phir Azamgarh me dikhane ke bahane doosri jagah, phir Varanasi me teesri jagah karwa lene se hota hai. Alag machine aur method ke reference range thode alag hote hain, isliye ek jagah TSH 4.5 aur doosri jagah 4.1 aane ka matlab ye nahi ki aapka thyroid badal gaya. Doctor badlav dekhta hai, sirf aaj ka number nahi.",
    ],
  },

  {
    id: "home-sample-collection-mau",
    h: "Mau Sheher Aur Jile Me Home Sample Collection — Sahadatpura Se Ghosi, Madhuban, Kopaganj Aur Doharighat Tak",
    p: [
      "Sheher me collection Sahadatpura, Mirzahadipura, Alinagar, Purani Bazar, Station Road, Chowk aur zila aspatal ke aas-paas hoti hai. Jile me Ghosi, Madhuban, Muhammadabad Gohna, Kopaganj, Doharighat, Chiraiyakot, Ranipur, Walidpur, Ratanpura, Pardaha, Amila, Adari, Khurhat, Sarai Lakhansi aur Baraipar jaise kasbe aur inse lage gaon aam taur par cover hote hain. Aapka gaon is list me naam se nahi hai to maan kar mat baithiye ki service nahi hai; booking se pehle ek call kar lijiye — cover hota hai to usi waqt slot book ho jaayega, aur nahi hota to hum saaf bata denge, taaki aap intezaar kar ke pareshan na hon.",
      "Pata likhne ka tarika yahan doosre jilon se zyada maayne rakhta hai, kyunki sheher ke mohalle ghane hain aur galiyan tang. Mohalle ka naam aur ek jaana pehchana landmark zaroor likhiye — school, mandir ya masjid, petrol pump, tiraha, bank, ya wo loom shed jise aas-paas ke sab jaante hain. Gaon me sirf gaon ka naam kaafi nahi hota: tola ya purwa ka naam likhiye, saath me post office aur thana ka naam. Ek hi naam ke do gaon paas paas hone bahut aam baat hai, aur late visit ki sabse badi wajah yahi hoti hai.",
      "Ghaghara ke kinare wale ilaake ke liye — Doharighat aur uske aas-paas ke gaon — ek baat aur jod dijiye: pahunchne ka rasta kaunsa hai, kis chauraha ya ghat se mudna hai. Barsaat ke mahino me kai raste badal jaate hain aur nadi ke paas pahunchna waqt maangta hai. Booking ke waqt ye bata dena poori visit ko aasan kar deta hai, aur slot bhi usi hisaab se rakha jaata hai.",
      "Mobile number wahi dijiye jo us waqt chalu rahega, aur ho sake to ek doosra number bhi likh dijiye. Loom ke shor me phone ki ghanti aksar sunayi nahi deti aur kai gaon me network ek hi kone me aata hai — phlebotomist ka ek call chhoot jaane se poori visit atak jaati hai.",
      "Ghar me ek se zyada log test kara rahe hain — maa-baap, dada-dadi, bachche — to sabki booking ek hi slot me kar dijiye; ek hi visit me sabka sample ho jaayega. Aur ye baat khaas taur par unke liye hai jinke ghar me koi bujurg hai, bistar par hai, lakwe ya operation ke baad recovery kar raha hai, ya koi diabetic hai jinki nas patli ho gayi hai — booking ke waqt ye bata dijiye, taaki aane wala taiyaari ke saath aaye aur baar baar sui na lagani pade. Sample se thodi der pehle mareez ko paani pila dijiye, jab tak fasting ke niyam mana na karein; paani ki kami se nas dhoondhna sach me mushkil ho jaata hai.",
    ],
  },

  {
    /* Is page ka apna hissa (1/2). Mau powerloom ka sheher hai — ye is jile ki
       apni cheez hai aur site ke kisi doosre page par nahi hai.

       Is section me sabse zaroori baat wo hai jo hum BECHTE nahi: khaansi,
       saans aur cotton dust ka jawab blood test nahi hai. TB ka antibody wala
       blood test yahan saaf mana kiya gaya hai (WHO ki negative recommendation
       aur India me in kits par rok — hum ye test karte bhi nahi), aur reader ko
       sarkari DOTS centre bheja gaya hai jahan sputum jaanch muft hai. Ek sale
       jaan boojh kar chhodi gayi hai, kyunki wo sale galat hoti.

       Jo hum sach me kar sakte hain — CBC, sugar, lipid, TSH, Vitamin D, B12 —
       sirf utna claim kiya gaya hai. Koi worker headcount ya loom ki ginti nahi
       di gayi: wo aankda kisi ne yahan naapa nahi hai. */
    id: "powerloom-bunkar-sehat-mau",
    h: "Loom Aur Karkhane Me Kaam Karne Walon Ke Liye — Kaunsi Jaanch Kaam Ki Hai Aur Kaunsi Bilkul Nahi",
    p: [
      "Mau ki pehchaan uske powerloom aur kapde ke kaam se hai. Sheher ka bada hissa loom shed, tana-bana, dyeing, cutting aur saree ke kaam se juda hua hai, aur is kaam ka apna ek routine hai: band shed me ghante bhar baithna, dhaage ka jhaala aur roshni kam, machine ka lagatar shor, khaana kaam ke beech me kabhi bhi, aur bahut logon ke liye raat ki shift. Sehat par iska asar hota hai — lekin har asar ka jawab lab test nahi hai, aur yahi baat sabse pehle saaf honi chahiye.",
      "Pehle wo baat jiska jawab hamare paas nahi hai. Dhaage ki dhool wale shed me saalon kaam karne se saans aur chhaati ki shikayat hoti hai — subah seene me jakadan, kaam par jaate hi khaansi, saans phoolna. Iski jaanch khoon se nahi hoti. Iske liye doctor ko dikhana padta hai aur saans ki jaanch (lung function / spirometry) karani padti hai, jo hum nahi karte aur is page par uska koi package nahi hai. Koi bhi 'chest package' ye jawab nahi dega — us par paisa lagana bacha lijiye aur seedha doctor ke paas jaaiye, aur unhe apne kaam ki jagah ke baare me zaroor bataiye. Ye baat batana aadha diagnosis kar deti hai.",
      "Doosri baat isse bhi zyada zaroori hai. Do hafte se zyada ki khaansi, shaam ko bukhar, raat ko paseena, wazan ka girna, ya balgam me khoon — inme se kuch bhi ho to TB ka shak hota hai, aur TB ki jaanch balgam (sputum) se hoti hai, khoon ke antibody test se nahi. TB ka 'blood test' — IgG/IgM wala — bharosemand nahi hai, isi wajah se us par rok hai, aur hum wo test karte hi nahi. Balgam ki jaanch najdeeki sarkari aspatal ya DOTS centre par hoti hai aur muft hoti hai. Kisi bhi private package ke bharose is par mahine mat gawaiye — ghar me chhote bachche hon to bilkul nahi.",
      "Ab wo jo sach me kaam ka hai. Band shed me din bhar rehne walon me Vitamin D ki kami aam hai, aur ye haddi aur pindliyon ke dard, kamar dard aur us thakan ke roop me nikalti hai jo neend se nahi jaati. Ghar ka khana zyadatar shakahari ho to Vitamin B12 ki kami usi ke saath chalti hai, aur uska asar sun-sun hona, jhunjhuni aur yaad-dasht par padta hai. Lagatar thakan, saans phoolna aur chakkar ke peeche aksar sirf haemoglobin ki kami hoti hai, jise CBC pakad leta hai. Aur bina wajah wazan badhna-ghatna, baal jhadna ya thand zyada lagna ho to TSH ek baar dekh lena chahiye. Ye chaaron — CBC, Vitamin D, Vitamin B12 aur TSH — ek hi sample me ho jaate hain aur ghar par ho jaate hain.",
      "Ek aur cheez jo is kaam ke saath chupke se aati hai: ghante bhar ek jagah baithna, chai aur khaini ka lagatar chalna, khaane ka koi tay waqt na hona, aur raat ki shift. Ye milkar sugar aur cholesterol dono ko bigadte hain, aur 35 ke baad ye chup chaap hota hai. Isliye is kaam se jude logon ke liye saal me ek baar HbA1c aur Lipid Profile karana samajhdari hai — HbA1c isliye ki usme fasting nahi chahiye aur shift ke hisaab se use kabhi bhi diya ja sakta hai. Aur haan, machine ke shor se kaan ka kam sunayi dena — ye bhi asli hai, par ye lab ka nahi, ENT doctor ka kaam hai.",
    ],
  },

  {
    id: "sugar-thyroid-followup-mau",
    h: "Sugar, HbA1c Aur Thyroid Test Mau Me — Dawa Bahar Se Shuru Hui, Follow-up Yahin Chhoot Jaata Hai",
    p: [
      "Yahan ek hi kahani baar baar milti hai: dikhaya Azamgarh me, ya Varanasi me, ya Gorakhpur me — dawa shuru ho gayi, parcha ghar aa gaya, aur uske baad ki jaanch kabhi hui hi nahi. Dawa medical se har mahine milti rehti hai, aur do saal beet jaate hain bina ye jaane ki dawa asar kar bhi rahi hai ya nahi. Ilaaj ka aadha hissa jaanch hai, aur wahi hissa doori ki wajah se chhoot jaata hai — kyunki log sochte hain ki jaanch bhi wahin karani padegi jahan dikhaya tha. Nahi padegi: routine blood test kahin bhi ho sakta hai, aur report doctor ko WhatsApp par dikhayi ja sakti hai.",
      "Diabetes ka calendar seedha sa hai. Har teen mahine me HbA1c — ye pichhle do-teen mahine ka ausat batata hai aur ismein fasting nahi chahiye, isliye ise taalne ki koi wajah hi nahi. Saal me ek baar Lipid Profile. Saal me ek baar Kidney Function Test ke saath urine microalbumin — microalbumin wahi test hai jo sabse pehle ishaara deta hai ki kidney par asar shuru ho raha hai, aur wahi sabse zyada chhoda jaata hai. Aur saal me ek baar aankh ka fundus check, jo lab ka nahi, doctor ka kaam hai.",
      "Thyroid ka niyam bhi utna hi seedha hai. Dawa ki dose badle to 6 se 8 hafte baad TSH dohraiye; uske baad har 6 se 12 mahine me. Jinhone kabhi karaya hi nahi — 35 ke baad ki mahilayein, jinke ghar me kisi ko thyroid hai, pregnancy plan kar rahi mahilayein, ya jinhe lagatar thakan, baal jhadna, wazan ka bina wajah badhna-ghatna ya periods ki gadbadi hai — unke liye ek baar TSH karana kaafi hai ye jaanne ke liye ki dikkat idhar hai ya nahi. Ek baat aur: TSH din ke waqt ke saath thoda upar-neeche hota hai, isliye jab bhi dohrayein, lagbhag usi samay ka sample dijiye — warna do report ki tulna galat baith jaati hai.",
      "BP ki dawa chal rahi hai to saal me ek baar kidney function aur electrolytes dekh lena chahiye, kyunki kuch dawaiyan inhe halka sa badal deti hain. Aur agar ghar me kai log dawa par hain, jo yahan ke bade parivaaron me aam hai, to sabka follow-up ek hi din, ek hi slot me karwa lijiye — ek visit me sabka sample ho jaayega aur agli baar ke liye taarikh bhi ek hi yaad rakhni padegi.",
      [
        "Ilaaj sheher se bahar chal raha hai to report wahan bhi utni hi chalti hai. ",
        { text: "Azamgarh me lab test", href: LAB_AZAMGARH },
        " isi tarah ghar par hota hai — mandal mukhyalaya hone ki wajah se bahut log wahin dikhate hain — aur ",
        { text: "Varanasi me lab test", href: LAB_VARANASI },
        " ya ",
        { text: "Gorakhpur me lab test", href: LAB_GORAKHPUR },
        " bhi usi tarah book hota hai.",
      ],
    ],
  },

  {
    id: "bukhar-dengue-typhoid-mau",
    h: "Mau Me Dengue, Typhoid Aur Malaria Test — Bukhar Ke Kis Din Kaunsa Test",
    p: [
      "Barsaat ke baad, jab mohalle ki naaliyan bhar jaati hain aur Ghaghara ka paani utarta hai, July se November ke beech bukhar ka bojh sabse zyada ho jaata hai. Sabse aam galti bimari pehchan-ne me nahi, din ginne me hoti hai — test sahi hota hai par galat din par, report negative aa jaati hai, aur ilaaj hafta bhar late ho jaata hai.",
      "Seedha niyam ye hai. Dengue me NS1 antigen bukhar ke pehle 1 se 5 din tak bharosemand hai; paanchve din ke baad wo aksar negative aa jaata hai aur tab IgM antibody karana padta hai. Typhoid me Widal ke liye kam se kam 5 se 7 din ka bukhar chahiye, warna titre badhte hi nahi — aur is ilaake me typhoid endemic hai, isliye purane infection se bhi Widal positive aa sakta hai; sirf usi ke bharose ilaaj tay karna theek nahi. Typhidot IgM jaldi positive hota hai. Bukhar me thand aur kanpkanpi ho to malaria antigen aur peripheral smear jodiye. Jo bhi karayein, CBC saath me zaroor karwaiye — girta platelet count aur badhta haematocrit wahi cheez hai jo roz dekhi jaati hai.",
      "Ghane mohallon me ek alag dhyan chahiye. Jahan ghar se ghar sata hua hai, chhat par tanki khuli hai aur galiyon me paani thehra rehta hai, wahan dengue ek ghar me nahi, ek gali me phailta hai. Ghar ke ek aadmi ko dengue nikle to baaki logon ka bukhar 'mausami' maan kar mat chhodiye — aur ye bhi: ek hi ghar me do-teen logon ko lambe bukhar ke saath pet ki shikayat ho to poore parivaar ke peene ke paani par ek baar sochiye. Sirf ek aadmi ka test karwa lena adhoora kaam hai.",
      "Bukhar me ghar se nikalna sabse bhaari kaam hota hai, aur yahi wo waqt hai jab home collection sabse zyada kaam aata hai. Slot subah ka lijiye, kyunki bukhar ka panel aksar do-teen din baad dohrana padta hai aur ek hi samay par dohrana behtar rehta hai — do report ka aapas me milaan tabhi theek baithta hai.",
      "Ek zaroori chetavani. Bachche ko tez bukhar ke saath jhatke aayein, behoshi ho, gardan akad jaaye, lagatar ulti ho ya wo sust pada rahe — to lab test book mat kijiye, seedha najdeeki hospital le jaaiye. Ye emergency hai aur ismein ek-ek ghanta maayne rakhta hai; blood test iska pehla jawab nahi hai aur home collection ka intezaar khatarnak hai.",
    ],
  },

  {
    id: "full-body-checkup-mau",
    h: "Mau Me Full Body Checkup Package — 45, 72 Aur 88 Parameter Wale Plan",
    p: [
      "Achha full body checkup parameter ki ginti se nahi, coverage se tay hota hai. Kam se kam paanch cheezein aani chahiye: blood count (CBC), sugar, heart ke liye lipid profile, liver function, aur kidney function ke saath urine routine. Iske upar thyroid, Vitamin D aur B12 jud jaayein to package se sach me kuch pata chalta hai.",
      "Basic Full Body Checkup (45 parameter, ₹999) un logon ke liye theek hai jinki umar kam hai aur koi shikayat nahi — saal ka ek baseline ban jaata hai. Advanced Full Body (72 parameter, ₹1,999) me thyroid, HbA1c aur vitamins jud jaate hain; 30 se 50 saal walon ke liye yahi sabse sahi baithta hai. Senior Citizen Pack (88 parameter, ₹2,999) 55 ke upar ke liye hai, jismein heart, haddi aur sugar ki screening ek saath hoti hai.",
      "Package apne risk ke hisaab se chuniye, price ke hisaab se nahi. Ghar me diabetes ya dil ki bimari chali aa rahi hai to HbA1c, lipid aur kidney markers ko priority dijiye. Ghar ka khana zyadatar shakahari hai to Vitamin B12 saal wale panel me hona hi chahiye. Aur din bhar band jagah me kaam karte hain, dhoop kam milti hai, phir bhi kamar aur pindliyon ka dard nahi jaata — to Vitamin D aur CBC ko chhodiye mat; ye do test hi sabse zyada jawab dete hain.",
      "Ek galatfehmi door kar lena zaroori hai: full body checkup har bimari nahi pakadta. Ye screening hai — jo cheez chup chaap badh rahi hoti hai use jaldi pakadne ke liye. Koi shikayat pehle se hai to package ke bharose mat baithiye, doctor ko dikhaiye aur wahi test karaiye jo wo kahe. Khaas kar khaansi, saans ya seene ki shikayat — uska jawab kisi bhi package me nahi hai.",
      [
        "Poora package ek hi sample me ho jaata hai aur zyadatar package fasting maangte hain, isliye subah ka slot lijiye. Ghar ke kai log ek saath karaa rahe hain to sabka ek hi slot me book kijiye. Kis umar me kaun sa package theek rehta hai aur '80+ parameters' ka sach kya hai, wo ",
        { text: "full body checkup wali guide", href: GUIDE_FULL_BODY },
        " me alag se likha hai.",
      ],
    ],
  },

  {
    id: "lab-test-price-mau",
    h: "Mau Me Lab Test Price Aur Rate List — Kaunsa Test Kitne Ka",
    p: [
      "Is page par har card par jo price likha hai, wahi aapko dena hai. Home sample collection uske upar free hai — na visiting charge, na travel charge, na koi hidden fee. Jile ke kisi bhi kasbe me daam wahi rehta hai jo sheher me hai; Ghosi, Madhuban ya Doharighat door hone par kuch extra nahi lagta.",
      "Rate list is tarah hai: Blood Sugar ₹100, CBC ₹400, Thyroid Profile (T3, T4, TSH) ₹550, HbA1c ₹600, Liver Function Test ₹600, Kidney Function Test ₹700, Lipid Profile ₹800, Vitamin D ₹1,000, Vitamin B12 ₹1,200 aur Dengue (NS1, IgG, IgM) ₹1,200. Ye wahi rate hain jo hamare doosre sheheron me hain.",
      "Package me bachat sabse zyada hoti hai. Basic Full Body ₹999 me 45 parameter deta hai — wahi test alag alag karane par kharcha kai guna ho jaata hai. Advanced ₹1,999 me 72 parameter aur Senior Citizen Pack ₹2,999 me 88 parameter deta hai.",
      "Kuch test, jaise Fever Panel (malaria, typhoid aur dengue ek saath), price par nahi balki us waqt ki zaroorat par tay hote hain — unke card par 'Call for price' likha rehta hai. Aise me phone par pooch lijiye; sample dene se pehle price bata diya jaata hai. Payment sample lene ke waqt hi hota hai — cash ya UPI se, PhonePe, Google Pay ya Paytm.",
    ],
  },

  {
    /* Is page ka apna hissa (2/2). Fasting ke niyam har city file me hain, par
       yahan wo shift ke hisaab se likhe gaye hain — kyunki is jile me raat ki
       aur badalti shift aam hai, aur "subah khaali pet aaiye" wali salah aise
       aadmi par laagu hi nahi hoti jo subah 6 baje kaam se lauta ho.

       Ismein ek salah jaan boojh kar sale ke khilaaf hai: raat bhar jaag kar
       fasting sample mat dijiye, chhutti wale din dijiye. Aur HbA1c ko fasting
       sugar par tarjeeh di gayi hai — jo sasta bhi nahi hai, par shift wale ke
       liye sach me behtar hai. */
    id: "shift-fasting-taiyari-mau",
    h: "Sample Dene Se Pehle Kya Karein — Fasting Ke Niyam, Aur Raat Ki Shift Walon Ke Liye Sahi Waqt",
    p: [
      "Fasting wale test — Fasting Blood Sugar, Lipid Profile aur zyadatar full body package — me 10 se 12 ghante kuch nahi khana hota. Saada paani peena mana nahi hai, balki zaroori hai: paani ki kami se nas dhoondhna mushkil ho jaata hai aur haemoglobin, urea tatha creatinine jhoothe taur par badhe hue aate hain. Raat ka khana 9 baje tak khatam kar lijiye aur subah 6 se 8 baje ka slot lijiye. 14 ghante se zyada bhookhe rehna faayda nahi, nuksan karta hai.",
      "Fasting sample se pehle chai — doodh wali to bilkul nahi — biscuit, toffee, paan, khaini ya gutkha kuch bhi nahi. Ek chai bhi sugar aur lipid ki report badal deti hai, aur phir wahi test dobara karana padta hai. Sirf saada paani.",
      "Ab wo baat jo is jile me sabse zyada poochi jaati hai: kaam raat ka hai, din me neend hoti hai — fasting kaise karein? Niyam ghadi ka nahi, ginti ka hai: aakhri khaane ke 10 se 12 ghante baad ka sample fasting sample hai, chahe wo aapke din ka koi bhi hissa ho. Lekin ek cheez se bachiye — raat bhar shift kar ke, bina soye, subah seedha fasting sample mat dijiye. Bina neend ki raat khud sugar aur lipid ko upar-neeche kar deti hai, aur us report par doctor ka faisla galat baith sakta hai. Sabse behtar tarika: fasting wale test chhutti wale din karaiye, jis din raat ko normal neend hui ho.",
      "Aur ek aasan raasta jo bahut kam log jaante hain: sugar ki nigrani ke liye fasting test zaroori hi nahi hai. HbA1c pichhle do-teen mahine ka ausat batata hai, usme fasting bilkul nahi chahiye, aur wo din ke kisi bhi waqt diya ja sakta hai. Badalti shift me kaam karne walon ke liye yahi sabse bharosemand test hai. Isi tarah CBC, Thyroid Profile, Vitamin D, Vitamin B12, Dengue aur Urine Routine bhi bina fasting ke hote hain — inke liye subah ka slot lena zaroori nahi. Booking ke waqt bata dijiye ki aapki shift kaunsi hai; jo test bina fasting ke hote hain unka slot aapke jaagne ke hisaab se rakha ja sakta hai.",
      "Do cheezein aur, jo shift se alag hain par utni hi zaroori. Lipid Profile ya Liver Function Test se kam se kam 24 ghante pehle sharaab bilkul na lein — ek shaam ki peene se hi triglycerides aur liver enzymes kaafi badh jaate hain. Aur kidney function ya CPK karana ho to ek din pehle bahut bhaari mehnat avoid kijiye; loom ka bhaari kaam, gatthar uthana ya dhoop me lagatar zor bhi ismein aata hai.",
      "Dawa ka aam niyam ye hai ki apni rozana ki goliyan usi samay lijiye, jab tak doctor mana na kare. Do exception hain: thyroid ki goli sample dene ke baad leni chahiye, aur biotin ya multivitamin kisi bhi hormone test se 2 se 3 din pehle band kar dena chahiye. Phlebotomist ko bata dijiye ki aap kaun kaun si dawa le rahe hain aur aapki shift kya hai — is baat se report padhne wale ka kaam aasan ho jaata hai.",
    ],
  },

  {
    id: "report-mau",
    h: "Report Kab Milegi — 24 Ghante Me WhatsApp Par PDF, Aur Use Kaise Padhein",
    p: [
      "Zyadatar routine test ki report 24 ghante ke andar aa jaati hai — CBC, sugar, lipid, LFT, KFT, thyroid aur urine routine. Vitamin aur hormone me aam taur par utna hi samay lagta hai. Culture jaan boojh kar dheere hote hain: urine ya blood culture me 48 se 72 ghante lagte hain, kyunki pehle organism ko ugana padta hai aur uske baad hi pata chalta hai ki kaunsi dawa asar karegi. Isse jaldi ka vaada koi bhi lab imaandari se nahi kar sakta.",
      "Report WhatsApp aur email dono par PDF me aati hai, aur is jile me iska faayda alag hi hai. Ghar par maa-baap hain aur bete Surat, Mumbai, Delhi ya Gulf me — report bas forward kar dijiye, wahan baithe log usi waqt padh lete hain aur agla faisla saath me hota hai. Doctor Mau me ho, Azamgarh me ho ya Varanasi me — kagaz le kar bhaagne ki zaroorat nahi, aur report kho jaane ka darr bhi nahi. Purani report bhi phone me sambhal kar rakhiye; doctor ko badlav dekhna hota hai, sirf aaj ka number nahi.",
      "Number ko report par chhape reference range se hi milaiye, internet ke kisi chart se nahi. Range machine aur method ke hisaab se badalti hai, aur umar tatha ling ke hisaab se bhi. Thoda sa high ya low hona bahut aam hai aur aksar koi bimari nahi hoti — ye diagnosis nahi, doctor se poochne ka ishaara hai. WhatsApp par report kisi group me mat daaliye; ye aapki niji jaankari hai.",
      [
        "Kuch result me intezaar nahi karna chahiye, usi din doctor chahiye: dengue me tezi se girta platelet count, bahut zyada sugar ke saath ulti ya susti, bahut kam haemoglobin, ya bahut badha creatinine ke saath peshab kam hona. Tabiyat kharab lag rahi ho to kisi ke phone ka intezaar mat kijiye, seedha dikhaiye. Numbers ka matlab kya hota hai aur kis flag par ghabrana nahi chahiye, ye ",
        { text: "report kaise padhein wale hisse", href: `${GUIDE_LAB_TEST}#report-kaise-padhein` },
        " me detail me likha hai.",
      ],
    ],
  },

  {
    id: "how-to-book-mau",
    h: "Mau Me Lab Test Kaise Book Karein — Online Form Ya Ek Phone Call",
    p: [
      "Is page par apna test ya package chuniye aur booking form bhar dijiye — naam, mobile number, apna mohalla ya gaon, aur ek landmark. Ya seedha phone kar dijiye. Doctor ka parcha hai to uska photo saath rakhiye, kyunki panel usi ke hisaab se book hota hai.",
      "Parche ke naam milte julte hote hain aur yahi sabse aam galti ki jad hai. Thyroid me 'Total' aur 'Free' alag test hain; sugar me 'Fasting' aur 'PP' do alag sample hain, jabki HbA1c ek hi sample me teen mahine ka ausat batata hai aur usme fasting nahi chahiye; typhoid me Widal aur Typhidot alag hain; aur 'liver test' aam taur par LFT hota hai, 'kidney test' KFT. Parche ka photo bhej dene se ye galti hoti hi nahi.",
      "Booking ke baad confirm karne ke liye call aam taur par 30 minute ke andar aati hai — slot, pata aur ye ki test me fasting chahiye ya nahi. Aane wale phlebotomist ke paas ID card hota hai; sample dene se pehle use dekh lena aapka haq hai. Poori visit lagbhag 10 minute ki hoti hai. Payment usi waqt hota hai, cash ya UPI se. Uske baad aapko kuch karna nahi hai — report taiyaar hone par WhatsApp aur email par PDF khud aa jaayegi.",
      [
        "Ek aakhri baat: aap jile ke kisi aise gaon me hain jo is page par naam se nahi likha, to bhi ek call kar ke pooch lijiye — cover hota hai to wahi slot book ho jaayega, aur nahi hota to hum saaf bata denge. Number aur poora pata ",
        { text: "contact page", href: "/contact" },
        " par mil jaayega. Aur kaun sa test kis shikayat, umar aur mausam me karana chahiye, ye ",
        { text: "hamari poori guide", href: GUIDE_LAB_TEST },
        " me detail me likha hai.",
      ],
    ],
  },

  {
    /* Devanagari section, ek baar.
       Is jile me bahut si search Hindi me type hoti hai — "मऊ में लैब टेस्ट",
       "खून की जांच", "रेट लिस्ट". Poore page ko transliterate karna galat hota:
       baaki copy Hinglish me hai aur wahi log padhte hain. Ek alag section dono
       cover kar deta hai — aur ye upar likhi baaton ka anuvaad hai, naya daawa
       nahi, isliye claims kahin bhi alag nahi padte. */
    id: "mau-lab-test-hindi",
    h: "मऊ (मऊनाथ भंजन) में लैब टेस्ट — घर से सैंपल कलेक्शन की पूरी जानकारी (हिंदी में)",
    p: [
      "मऊ में खून की जांच के लिए अब शहर तक जाकर लाइन लगाने की ज़रूरत नहीं है। सीबीसी, थायरॉइड, शुगर, एचबीए1सी, लिपिड प्रोफाइल, लिवर और किडनी फंक्शन टेस्ट, विटामिन डी, विटामिन बी12, डेंगू, यूरिन रूटीन और फुल बॉडी चेकअप — ये सारी जांच सैंपल पर होती हैं, और सैंपल आपके घर से लिया जा सकता है।",
      "होम सैंपल कलेक्शन बिल्कुल मुफ़्त है। आप सिर्फ़ टेस्ट का वही दाम देते हैं जो कार्ड पर लिखा है — कोई विज़िटिंग चार्ज या छिपा हुआ शुल्क नहीं, और ज़िले के दूर वाले कस्बों में भी वही रेट लगता है। सुबह 6 बजे से स्लॉट शुरू हो जाते हैं, ताकि खाली पेट वाली जांच जल्दी हो जाए और आप तुरंत नाश्ता कर सकें। रिपोर्ट 24 घंटे में व्हाट्सएप और ईमेल पर पीडीएफ में आ जाती है।",
      "रेट लिस्ट: ब्लड शुगर ₹100, सीबीसी ₹400, थायरॉइड प्रोफाइल ₹550, एचबीए1सी ₹600, लिवर फंक्शन टेस्ट ₹600, किडनी फंक्शन टेस्ट ₹700, लिपिड प्रोफाइल ₹800, विटामिन डी ₹1,000, विटामिन बी12 ₹1,200 और डेंगू ₹1,200। बेसिक फुल बॉडी चेकअप ₹999 में 45 पैरामीटर, एडवांस ₹1,999 में 72 और सीनियर सिटिज़न पैक ₹2,999 में 88 पैरामीटर देता है।",
      "सैंपल शहर में सहादतपुरा, मिर्ज़ाहादीपुरा, अलीनगर, पुरानी बाज़ार, स्टेशन रोड और चौक के आस-पास लिया जाता है, और ज़िले में घोसी, मधुबन, मुहम्मदाबाद गोहना, कोपागंज, दोहरीघाट, चिरैयाकोट, रानीपुर, वलीदपुर, रतनपुरा, परदहां, अमिला और सराय लखंसी तक। आपका गाँव इस सूची में न हो तो एक बार फ़ोन कर लीजिए — कवर होने पर उसी समय स्लॉट बुक हो जाएगा। पता लिखते समय टोला या पुरवा का नाम, पोस्ट ऑफिस और एक लैंडमार्क ज़रूर बताइए।",
      "जो लोग लूम या कारखाने में काम करते हैं, उनके लिए एक ज़रूरी बात: दो हफ़्ते से ज़्यादा की खांसी, शाम को बुखार, वज़न गिरना या बलगम में खून — इसकी जांच खून से नहीं, बलगम से होती है, और वह नज़दीकी सरकारी अस्पताल या डॉट्स सेंटर पर मुफ़्त होती है। टीबी का एंटीबॉडी वाला ब्लड टेस्ट भरोसेमंद नहीं है और हम वह करते भी नहीं। सांस या सीने की शिकायत का जवाब भी किसी पैकेज में नहीं है — सीधे डॉक्टर को दिखाइए और उन्हें अपने काम की जगह के बारे में ज़रूर बताइए।",
      [
        "रात की शिफ़्ट में काम करते हैं तो खाली पेट वाली जांच छुट्टी वाले दिन कराइए, रात भर जागकर नहीं — बिना नींद की रात खुद शुगर और लिपिड को बदल देती है। एचबीए1सी, सीबीसी, थायरॉइड, विटामिन डी और बी12 में खाली पेट की ज़रूरत नहीं होती, ये दिन में कभी भी हो सकते हैं। पेमेंट सैंपल लेते समय नकद या यूपीआई से होता है। कौन सी जांच कब करानी चाहिए, इसकी पूरी जानकारी ",
        { text: "हमारी गाइड में", href: GUIDE_LAB_TEST },
        " दी गई है।",
      ],
    ],
  },
];

/**
 * Mau's own FAQs.
 *
 * The generated defaults ask the same seven questions for every city with the
 * name swapped — exactly the duplication that keeps a seventh page out of the
 * index, and the FAQ block is the part Google is most likely to lift into a
 * rich result, so near-identical answers across cities actively hurt.
 *
 * These are written against the questions a Mau reader actually has and a
 * Ballia or Azamgarh reader does not: is "Maunath Bhanjan" the same place (a
 * real alternate name, and the one a lot of people type), does anyone come out
 * to Ghosi, Madhuban or Doharighat, what a loom worker's cough is and is not a
 * blood-test question, and how fasting works on a night shift. The two that
 * decide a booking are placed first — page.js renders the first eight, so this
 * list is exactly eight.
 *
 * The "bachche ko jhatke" emergency question is deliberately NOT here: three
 * other cities already carry it as an FAQ, and a fourth identical Q&A in the
 * schema is duplication where it costs the most. The same warning is in the
 * fever section's prose.
 *
 * `links` is optional per FAQ and renders UNDER the answer, never inside the
 * schema text: the JSON-LD has to mirror the readable answer exactly, so the
 * links live outside `a`. See LabFaq.
 *
 * Claims are limited to the confirmed set: free home collection, trained
 * phlebotomist with an ID card, slots from 6 AM, reports in 24 hours, cash/UPI.
 */
export const mauFaqs = [
  {
    q: "Mau me lab test ka kitna kharcha aata hai, aur kya home sample collection free hai?",
    a: "Aap sirf test ka wahi price dete hain jo card par likha hai — Mau me home sample collection bilkul free hai, na visiting charge na koi hidden fee. Rate list is tarah hai: Blood Sugar ₹100, CBC ₹400, Thyroid Profile ₹550, HbA1c ₹600, Lipid Profile ₹800 aur Basic Full Body Checkup ₹999 se shuru. Ghosi, Madhuban ya Doharighat jaise door ke kasbon me bhi wahi rate lagta hai jo sheher me hai. Payment sample lene ke waqt cash ya UPI se hota hai.",
  },
  {
    q: "Kya Mau me aapka koi lab ya collection centre hai — Station Road ya Sahadatpura ke paas?",
    a: "Nahi — hamara koi walk-in counter Mau me nahi hai, aur hum aisa daawa nahi karte. Ye home collection service hai: trained phlebotomist ID card ke saath aapke ghar aata hai aur sample wahin liya jaata hai, chahe aap sheher me hon ya jile ke kisi gaon me. Home visit ke slot subah 6 baje se shuru hote hain aur shaam tak chalte hain. Hum 24 ghante khula lab hone ka daawa bhi nahi karte; report 24 ghante ke andar milne ka karte hain.",
  },
  {
    q: "Kya aap Maunath Bhanjan me bhi lab test karte hain?",
    a: "Haan — Mau aur Maunath Bhanjan ek hi jagah ke do naam hain, isliye is page ki har service wahan laagu hoti hai. Aap \"Maunath Bhanjan me blood test\" dhoondhein ya \"Mau me lab test\", aapko wahi free home sample collection, wahi rate aur 24 ghante me report milti hai. Sheher me Sahadatpura, Mirzahadipura, Alinagar, Purani Bazar, Station Road aur Chowk ke aas-paas se sample liya jaata hai.",
  },
  {
    q: "Mau jile me aap kaun kaun se ilaake cover karte hain — Ghosi, Madhuban aur Doharighat bhi?",
    a: "Sheher me Sahadatpura, Mirzahadipura, Alinagar, Purani Bazar, Station Road, Chowk aur zila aspatal ke aas-paas, aur jile me Ghosi, Madhuban, Muhammadabad Gohna, Kopaganj, Doharighat, Chiraiyakot, Ranipur, Walidpur, Ratanpura, Pardaha, Amila, Adari, Khurhat, Sarai Lakhansi aur Baraipar tak — inse lage gaon bhi aam taur par cover hote hain. Aapka gaon is list me naam se nahi hai to bhi ek baar call kar ke pooch lijiye. Pata likhte waqt tola ya purwa ka naam, post office aur ek landmark zaroor likhiye — ek hi naam ke do gaon paas paas hona yahan aam hai, aur late visit ki sabse badi wajah yahi hoti hai.",
  },
  {
    q: "Loom ya karkhane me kaam karte hain aur khaansi lambe samay se hai — kaunsa test karayein?",
    a: "Lambi khaansi ka jawab khoon ki jaanch nahi hai. Do hafte se zyada khaansi, shaam ko bukhar, raat ko paseena, wazan girna ya balgam me khoon ho to TB ka shak hota hai, aur uski jaanch balgam se hoti hai — najdeeki sarkari aspatal ya DOTS centre par, muft. TB ka antibody wala blood test bharosemand nahi hai aur hum wo karte bhi nahi. Saans ya seene ki jakadan ke liye doctor ko dikhaiye aur unhe apne kaam ki jagah ke baare me bataiye; iski jaanch saans ki jaanch se hoti hai, jo hum nahi karte. Jo hum kar sakte hain wo alag hai: band jagah me kaam karne walon me Vitamin D aur B12 ki kami, haemoglobin ki kami aur thyroid ki gadbadi aam hai — CBC, Vitamin D, Vitamin B12 aur TSH ek hi sample me ghar par ho jaate hain.",
  },
  {
    q: "Raat ki shift me kaam karta hoon — fasting wala test kaise karaun?",
    a: "Fasting ka niyam ghadi ka nahi, ginti ka hai: aakhri khaane ke 10 se 12 ghante baad ka sample fasting sample hai. Lekin raat bhar shift kar ke, bina soye, subah seedha fasting sample mat dijiye — bina neend ki raat khud sugar aur lipid ko upar-neeche kar deti hai. Fasting wale test chhutti wale din karaiye, jis din raat ko normal neend hui ho. Aur sugar ki nigrani ke liye HbA1c behtar hai: usme fasting bilkul nahi chahiye aur wo din me kabhi bhi diya ja sakta hai. CBC, Thyroid Profile, Vitamin D, Vitamin B12 aur Dengue bhi bina fasting ke hote hain. Booking ke waqt apni shift bata dijiye, slot usi hisaab se rakh diya jaayega.",
  },
  {
    q: "Ilaaj Azamgarh ya Varanasi me chal raha hai — kya follow-up jaanch Mau me ghar par ho sakti hai?",
    a: "Haan. Routine blood test kahin bhi ho sakta hai; ye zaroori nahi ki jaanch wahin ho jahan aapne dikhaya tha. Report 24 ghante ke andar WhatsApp aur email par PDF me aati hai, jise aap doctor ko dikha sakte hain ya bhej sakte hain. Diabetes me har teen mahine me HbA1c, saal me ek baar Lipid Profile aur Kidney Function Test ke saath urine microalbumin; thyroid me dose badalne ke 6 se 8 hafte baad TSH, uske baad har 6 se 12 mahine me. Ek hi test ko baar baar alag alag jagah se mat karaiye — reference range alag hone se tulna galat baithti hai.",
    links: [{ href: GUIDE_LAB_TEST, label: "Kaun sa test kab karayein — guide" }],
  },
  {
    q: "Mau me booking kaise karein, aur doctor ka parcha bhejna zaroori hai?",
    a: "Is page par test ya package chuniye aur form bhar dijiye — naam, mobile number, mohalla ya gaon aur ek landmark — ya seedha call kar dijiye. Confirm karne ke liye call aam taur par 30 minute ke andar aati hai, jismein slot, pata aur fasting ki baat tay ho jaati hai. Parcha zaroori nahi hai, lekin hai to uska photo bhej dijiye: Thyroid Total aur Free, Sugar Fasting aur PP, Widal aur Typhidot jaise milte julte naam ki wajah se galat test ho jaana sabse aam galti hai, aur photo hone par ye galti hoti hi nahi. Ghar me kai log karaa rahe hain to sabki booking ek hi slot me kar dijiye — ek visit me sabka sample ho jaayega.",
    links: [{ href: "/contact", label: "Contact — number aur booking help" }],
  },
];
