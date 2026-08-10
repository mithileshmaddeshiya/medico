import { LAB_PHONE, defaultFooter } from "@/data/lab/defaults";
import { SITE, url } from "@/lib/site";

/**
 * /terms
 *
 * These terms described a medicine-ordering platform: prescription
 * verification, order fulfilment by "independent licensed pharmacy partners",
 * medicine availability, third-party delivery delays. That business no longer
 * exists here, and terms that describe a service a site does not provide are
 * worse than none — this is the document a customer and a regulator both read
 * to find out what was actually agreed to.
 *
 * ── WHAT THESE TERMS NOW SAY, AND WHY EACH CLAUSE IS HERE ────────────────
 * The service is: a booking is taken on this site, a trained phlebotomist
 * collects a sample at the customer's home, a laboratory processes it, and a
 * report comes back as a PDF. So the clauses that matter are the ones that
 * follow from THAT — who may book, what a booking is and is not, that a sample
 * can be rejected on technical grounds, that a report is not a diagnosis, and
 * that this is not an emergency service.
 *
 * The medical disclaimer and the emergency clause are the two that must never
 * be softened or removed. A lab report with a "high" flag is the single most
 * common way a person self-treats, and this site's own copy tells readers to
 * take borderline values to a doctor — the terms have to say the same thing.
 *
 * NOTHING HERE MAY CLAIM AN ACCREDITATION THE BUSINESS DOES NOT HOLD. Same
 * rule as everywhere else on this site — see src/data/home.js.
 */
export const metadata = {
  title: "Terms & Conditions — MedicoBharat Lab Test",

  description:
    "MedicoBharat ke lab test aur home sample collection service ki terms & conditions — booking, sample collection, report aur medical disclaimer.",

  keywords: [
    "MedicoBharat terms",
    "lab test terms and conditions",
    "home sample collection terms",
    "diagnostic service terms",
    "lab report disclaimer",
  ],

  alternates: {
    canonical: url("/terms"),
  },

  authors: [{ name: "MedicoBharat" }],

  publisher: "MedicoBharat",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Terms & Conditions — MedicoBharat Lab Test",
    description:
      "Booking, home sample collection, reports aur medical disclaimer se judi MedicoBharat ki official terms & conditions.",
    url: url("/terms"),
    siteName: "MedicoBharat",
    type: "website",
  },
};

/* The numbered clauses, kept as data so the numbering can never drift out of
   step with the content — renumbering by hand is how a clause ends up cited by
   the wrong number in a complaint. */
const CLAUSES = [
  {
    title: "Introduction",
    body: "Ye Terms & Conditions MedicoBharat ke istemaal par laagu hoti hain. Is website ka upyog karke ya koi booking karke aap in shartein, laagu kanoonon aur is platform ki policies se sahmat hote hain. Aap in shartein se sahmat nahi hain to kripya service ka upyog na karein.",
  },
  {
    title: "MedicoBharat kya karta hai",
    body: "MedicoBharat ek lab test booking aur home sample collection service hai. Hum aapke diye gaye pate par ek trained phlebotomist bhejte hain jo aapka blood ya urine sample collect karta hai, use laboratory tak pahunchate hain, aur report aapko PDF ke roop me bhejte hain. MedicoBharat koi medical diagnosis, ilaaj, prescription ya doctor ki consultation nahi deta.",
  },
  {
    title: "Kaun booking kar sakta hai",
    body: "Booking 18 saal ya usse zyada umar ka vyakti hi kar sakta hai. Kisi bachche ka ya aise vyakti ka test book karte samay jo khud sahmati dene ki sthiti me nahi hai, aap ye pushti karte hain ki aapke paas uski or se sahmati dene ka adhikaar hai. Sample lete waqt kisi vayask ka maujood rehna zaroori hai.",
  },
  {
    title: "Booking, slot aur pata",
    body: "Form bharne ka matlab confirm slot nahi hota. Hum aapse call kar ke slot aur pata confirm karte hain, uske baad hi booking pakki maani jaati hai. Sahi pata, landmark aur chalu mobile number dena aapki zimmedari hai — der se pahunchne ki sabse aam wajah adhoora pata hoti hai. Aapka ilaaka hamare service area se bahar nikla to hum booking se pehle hi saaf bata denge.",
  },
  {
    title: "Test chunna aur doctor ka parcha",
    body: "Zyadatar routine test aur health package bina prescription ke book kiye ja sakte hain. Kuch specialised test niyam ke anusaar valid prescription maangte hain, aur uske bina wo test nahi kiya ja sakta. Aap jo test chunte hain uski zimmedari aapki hai; doctor ne kuch likha hai to uska photo booking ke waqt dijiye taaki wahi panel liya jaaye — test ke naam aksar milte-julte hote hain.",
  },
  {
    title: "Sample collection aur dobara sample",
    body: "Sample aapke saamne liya jaata hai aur poori visit lagbhag 10 minute ki hoti hai. Kabhi-kabhi technical wajahon se dobara sample lena padta hai — sample clot ho jaana, tube sahi level tak na bharna, haemolysis, ya fasting ka niyam poora na hona. Aise maamlon me dobara collection ka koi alag charge nahi lagta, lekin report me utni der lag jaati hai. Fasting wale test me nirdharit samay tak kuch na khana aapki zimmedari hai; galat taiyaari par liya gaya sample galat result de sakta hai.",
  },
  {
    title: "Price aur payment",
    body: `Har test ka price is website par likha hai aur home sample collection uske upar free hai — koi visiting charge ya chhupa shulk nahi. Payment sample collection ke waqt hota hai, cash ya UPI se. Jin test par "Call for price" likha hai unka price sample lene se pehle bata diya jaata hai. Price kabhi-kabhi badal sakte hain; jo price booking confirm karte waqt bataya gaya, wahi laagu hoga.`,
  },
  {
    title: "Report aur turnaround time",
    body: "Zyadatar routine test ki report 24 ghante ke andar taiyaar ho jaati hai aur WhatsApp tatha email par PDF me bheji jaati hai. Culture jaise kuch test 48 se 72 ghante lete hain, kyunki unme pehle organism ugana padta hai. Ye samay anumaan hai, guarantee nahi — sample ki quality, dobara test ki zaroorat ya technical dikkat se der ho sakti hai. Aisi sthiti me hum aapko batayenge.",
  },
  {
    title: "Medical disclaimer",
    body: "Lab report koi diagnosis nahi hai. Report par 'high' ya 'low' ka flag sirf ye batata hai ki value chhapi hui reference range se bahar hai — iska matlab bimari nahi hota, aur thoda sa bahar hona bahut aam hai. Is website par di gayi saari jaankari sirf samanya shiksha ke liye hai aur kisi bhi soorat me doctor ki salah ka vikalp nahi hai. Koi bhi dawa shuru karna, band karna ya uska dose badalna sirf ek registered medical practitioner ki salah par hi kijiye.",
  },
  {
    title: "Ye emergency service nahi hai",
    body: "Tez bukhar ke saath jhatke ya behoshi, gardan akadna, saans lene me takleef, seene me dard, lagatar ulti, ya bahut zyada kamzori — in sthitiyon me lab test book mat kijiye, seedha najdeeki hospital jaaiye. MedicoBharat ambulance, emergency care ya 24 ghante ki medical sahayata nahi deta, aur home visit ke slot subah 6 baje se shaam tak hi hote hain.",
  },
  {
    title: "Cancellation",
    body: "Booking confirm hone ke baad bhi aap phlebotomist ke aane se pehle kabhi bhi call kar ke cancel ya reschedule kar sakte hain — koi charge nahi lagta, kyunki payment collection ke waqt hi hota hai. Hamari taraf se bhi booking cancel ya reschedule ho sakti hai — mausam, staff ki uplabdhta, ya aapka pata service area se bahar nikalne par. Aisi har sthiti me hum aapko call kar ke batayenge.",
  },
  {
    title: "Aapki zimmedariyan",
    body: "Sahi naam, mobile number aur pata dena; fasting wale test me nirdharit samay tak khaali pet rehna; jo dawaiyan aap le rahe hain unke baare me phlebotomist ko batana; ghar me koi bujurg, bistar par pada vyakti, ya operation ke baad recovery kar raha vyakti ho to booking ke waqt ye jaankari dena; aur collection ke waqt payment poora karna.",
  },
  {
    title: "Service availability",
    body: "Service sirf un sheher aur ilaakon me uplabdh hai jo is website par listed hain, aur ye list badal sakti hai. Ho sakta hai kuch test har jagah, har din uplabdh na hon — aisa hone par hum booking se pehle bata denge. Hum kisi bhi aise ilaake me service ka vaada nahi karte jahan hum sach me pahunch nahi sakte.",
  },
  {
    title: "Limitation of liability",
    body: "Kanoon dwara anumat adhiktam seema tak, MedicoBharat kisi bhi apratyaksh nuksan, report me der, dobara sample ki zaroorat, ya customer dwara report ki apni vyakhya ke aadhaar par liye gaye kisi bhi nirnay ke liye zimmedar nahi hoga. Kisi bhi sthiti me hamari kul zimmedari us booking ke liye aapke dwara di gayi rakam se adhik nahi hogi.",
  },
  {
    title: "In shartein me badlav",
    body: "Ye shartein samay-samay par badli ja sakti hain. Badlav is page par publish hote hi laagu ho jaate hain, isliye booking se pehle ise ek baar dekh lena uchit rehta hai.",
  },
];

export default function TermsPage() {
  const { email } = defaultFooter("");

  return (
    <section className="w-full overflow-hidden bg-linear-to-b from-emerald-50/70 to-white pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-[11.5px] font-bold text-emerald-800 shadow-sm">
            Lab test &amp; home sample collection
          </span>

          <h1 className="mt-4 text-balance text-[28px] sm:text-[40px] font-extrabold leading-[1.12] tracking-tight text-slate-900">
            Terms &amp; Conditions
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-[13.5px] sm:text-[15px] leading-relaxed text-slate-600">
            Ye shartein MedicoBharat ki lab test booking aur home sample
            collection service par laagu hoti hain. Booking se pehle ek baar
            padh lijiye.
          </p>
        </div>

        <ol className="mt-10 space-y-4">
          {CLAUSES.map((clause, i) => (
            <li
              key={clause.title}
              className="rounded-2xl bg-white p-5 sm:p-7 ring-1 ring-emerald-100/90 shadow-[0_1px_2px_rgba(6,78,59,0.04)]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[13px] font-extrabold tabular-nums text-emerald-700 ring-1 ring-emerald-100">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h2 className="text-[16px] sm:text-[19px] font-extrabold tracking-tight text-slate-900">
                  {clause.title}
                </h2>
              </div>

              <p className="mt-3 text-[13px] sm:text-[14.5px] leading-[1.8] text-slate-600">
                {clause.body}
              </p>
            </li>
          ))}
        </ol>

        {/* The two clauses that must be impossible to miss, repeated as a
            highlighted band. Legal text buried in clause nine is text nobody
            reads — and these are the two where not reading them has a real
            cost to a real person. */}
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-7">
          <h2 className="text-[16px] sm:text-[19px] font-extrabold tracking-tight text-slate-900">
            Do Baatein Jo Sabse Zaroori Hain
          </h2>

          <ul className="mt-3 space-y-3 text-[13px] sm:text-[14.5px] leading-[1.8] text-slate-700">
            <li>
              <strong className="font-bold text-slate-900">
                Report diagnosis nahi hai.
              </strong>{" "}
              Kisi bhi value ke aadhaar par khud dawa shuru, band ya change mat
              kijiye — report doctor ko dikhaiye.
            </li>
            <li>
              <strong className="font-bold text-slate-900">
                Emergency me test book mat kijiye.
              </strong>{" "}
              Jhatke, behoshi, saans ki takleef, seene me dard ya lagatar ulti
              ho to seedha hospital jaaiye. Ye service uske liye nahi hai.
            </li>
          </ul>
        </div>

        {/* CONTACT — the same phone and email the whole site prints, imported
            rather than typed. See the note in the contact page about why NAP
            consistency is not cosmetic. */}
        <div className="mt-6 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 text-white">
          <h2 className="text-[20px] sm:text-[26px] font-extrabold tracking-tight">
            Sawaal Ho To Sampark Kijiye
          </h2>

          <div className="mt-4 space-y-2 text-[13.5px] text-emerald-50">
            <p>
              <a
                href={`tel:${LAB_PHONE.replace(/\s/g, "")}`}
                className="font-semibold underline underline-offset-2 decoration-emerald-200 hover:decoration-white"
              >
                {LAB_PHONE}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${email}`}
                className="break-all font-semibold underline underline-offset-2 decoration-emerald-200 hover:decoration-white"
              >
                {email}
              </a>
            </p>
            <p className="break-all">{SITE}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
