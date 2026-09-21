import Link from "next/link";
import { linkTitle } from "@/lib/linkTitle";
import {
  BadgeCheck,
  Clock,
  FileText,
  HeartPulse,
  MapPin,
  Phone,
  ShieldAlert,
  Wallet,
} from "lucide-react";

import { LAB_PHONE } from "@/data/lab/defaults";
import { coverageEn, coverageHi } from "@/lib/coverage";
import { getLabCities } from "@/lib/labCities";
import { ORG_REF, WEBSITE_ID, graph, ldJson } from "@/lib/schema";
import { SITE, url } from "@/lib/site";

/**
 * /about
 *
 * This page used to describe an online pharmacy — "genuine medicines",
 * "prescription medicine support", "24/7 customer support", "fast delivery".
 * All of it belonged to the retired medicine section, and two of those claims
 * (24/7 support, delivery) were not things the business actually does.
 *
 * ── THE RULE THIS PAGE IS WRITTEN UNDER ───────────────────────────────────
 * An About page is where a search engine and a cautious reader both go to
 * decide whether a health service is real. So it may only state what is
 * confirmed — free home collection, a trained phlebotomist with an ID card,
 * 6 AM slots seven days a week, reports in 24 hours, cash or UPI at
 * collection. No accreditation, no ratings, no patient counts, no partner-lab
 * names. See the warning at the top of src/data/home.js.
 *
 * The section that says what we do NOT claim is deliberate and load-bearing.
 * It is also the reason the rest of the page is believable.
 */
export const metadata = {
  // 55 characters before the root layout appends " | MedicoBharat".
  title: "About MedicoBharat — Lab Test at Home",

  description:
    // `coverageEn()`, not `coverage()`. Naming all six towns costs ~55
    // characters and pushed this to 207 — a third of the budget spent on a list
    // the page body carries in full anyway. The English helper is used because
    // THIS description is in English; the Hinglish one would mix registers.
    // See src/lib/coverage.js.
    `MedicoBharat books lab tests and full body checkups across ${coverageEn()}. What we promise, and what we deliberately do not claim.`,

  keywords: [
    "MedicoBharat",
    "Medico Bharat",
    "about MedicoBharat",
    "MedicoBharat lab test",
    "lab test at home service",
    "home sample collection service",
    "diagnostic service Purvanchal",
  ],

  alternates: {
    canonical: url("/about"),
  },

  authors: [{ name: "MedicoBharat" }],

  publisher: "MedicoBharat",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "About MedicoBharat — Lab Test at Home",
    description:
      "Lab tests and full body checkups with free home sample collection. What MedicoBharat promises, and what it does not claim.",
    url: url("/about"),
    siteName: "MedicoBharat",
    type: "website",
  },
};

/* What we promise. Every card is a fact with a number in it, and every number
   is one the rest of the site keeps. */
const PROMISES = [
  {
    icon: Wallet,
    title: "Collection ka koi charge nahi",
    text: "Card par jo price likha hai, sirf wahi. Na visiting charge, na convenience fee.",
  },
  {
    icon: BadgeCheck,
    title: "Phlebotomist ID card ke saath",
    text: "Sample dene se pehle uska ID card dekh lena aapka haq hai — aur hum ye khud kehte hain.",
  },
  {
    icon: Clock,
    title: "Slot subah 6 baje se",
    text: "Saaton din. Fasting wale test jaldi ho jaate hain, taaki aap turant naashta kar sakein.",
  },
  {
    icon: FileText,
    title: "Report 24 ghante me",
    text: "WhatsApp aur email dono par PDF me. Report lene dobara jaana nahi padta.",
  },
  {
    icon: Phone,
    title: "Baat Hindi me",
    text: "Booking se le kar report samjhane tak. Sawaal poochhna kabhi awkward nahi hona chahiye.",
  },
  {
    icon: HeartPulse,
    title: "Payment collection ke waqt",
    text: "Cash ya UPI — PhonePe, Google Pay, Paytm. Advance kuch nahi lena padta.",
  },
];

export default async function AboutMedicoBharat() {
  const cities = await getLabCities();

  /* AboutPage, joined to the site's graph rather than left standing alone.
     `mainEntity` is the point of the node: it says this page is about the
     organisation declared in the root layout — the same @id every city page
     and the home page resolve to. One entity, many references. */
  const aboutNode = {
    "@type": "AboutPage",
    "@id": `${SITE}/about#webpage`,
    url: url("/about"),
    name: metadata.title,
    description: metadata.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: ORG_REF,
    mainEntity: ORG_REF,
    publisher: ORG_REF,
    inLanguage: ["hi-IN", "en-IN"],
  };

  const breadcrumbNode = {
    "@type": "BreadcrumbList",
    "@id": `${SITE}/about#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "About", item: url("/about") },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: ldJson(graph(aboutNode, breadcrumbNode)),
        }}
      />

      {/* pt clears the fixed header — the old `py-10` on this page put the
          eyebrow underneath the navbar on every phone. */}
      <section className="w-full bg-linear-to-b from-emerald-50/70 to-white pt-24 sm:pt-32 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-white/80 px-4 py-1.5 text-[11.5px] font-bold text-emerald-800 ring-1 ring-emerald-200/80 backdrop-blur">
              Lab test · Home sample collection
            </span>

            <h1 className="mt-4 text-balance text-[30px] sm:text-[42px] font-extrabold leading-[1.12] tracking-tight text-slate-900">
              About{" "}
              <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                MedicoBharat
              </span>
            </h1>

            <p className="mt-4 text-[14px] sm:text-[16.5px] leading-relaxed text-slate-600">
              MedicoBharat ek lab test service hai. Hum aapke ghar se blood aur
              urine ka sample lete hain, lab tak pahunchate hain, aur report
              seedhe aapke phone par bhejte hain — {coverageHi()} jile me.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

          {/* ── WHY WE EXIST ────────────────────────────────────────────── */}
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <h2 className="text-[22px] sm:text-[28px] font-extrabold tracking-tight text-slate-900">
                Hum Kyun Shuru Hue
              </h2>

              <div className="mt-4 space-y-4 text-[13.5px] sm:text-[15px] leading-relaxed text-slate-600">
                <p>
                  Purvanchal me test karana mushkil nahi hai — test ke liye
                  safar karna mushkil hai. Ek CBC ya thyroid ke liye bhi log
                  subah khaali pet bus pakadte hain, counter par line lagate
                  hain, aur report lene ke liye agle din dobara jaate hain. Ek
                  test, do trip, poora din.
                </p>
                <p>
                  Sach ye hai ki routine pathology ka lagbhag poora hissa sirf
                  sample par hota hai — blood count, sugar, thyroid, liver,
                  kidney, lipid, vitamin aur urine ke test. Aur sample ghar par
                  liya ja sakta hai. Yahi ek baat hai jis par MedicoBharat khada
                  hai.
                </p>
                <p>
                  Iska sabse zyada faayda unhe hota hai jinke liye ye teen
                  chakkar sach me rukawat hain: bujurg, chhote bachche,
                  pregnancy, operation ke baad recovery, aur wo har vyakti jiska
                  din kaam se bandha hai.
                </p>
              </div>
            </div>

            {/* Cities, as links — /about is a page people and crawlers both
                reach, and a link from here into each city page is worth more
                than another paragraph about ourselves. */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50/60 p-6 ring-1 ring-emerald-100">
                <h2 className="text-[15px] font-extrabold tracking-tight text-emerald-950">
                  Hum kahan sample collect karte hain
                </h2>

                <ul className="mt-4 space-y-2.5">
                  {cities.map((city) => (
                    <li key={city.slug}>
                      <Link
                        href={`/lab-test/${city.slug}`}
                        title={linkTitle(`/lab-test/${city.slug}`)}
                        className="group flex items-start gap-2.5 rounded-xl bg-white p-3.5 ring-1 ring-emerald-100 transition-all duration-200 hover:ring-emerald-300 hover:shadow-[0_10px_24px_-18px_rgba(6,78,59,0.6)]"
                      >
                        <MapPin
                          aria-hidden
                          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                          strokeWidth={2.2}
                        />
                        <span className="min-w-0">
                          <span className="block text-[13.5px] font-bold text-slate-900 transition-colors group-hover:text-emerald-800">
                            Lab Test in {city.name}
                          </span>
                          <span className="mt-0.5 block text-[11.5px] leading-snug text-slate-500">
                            {city.areas.slice(0, 4).join(" · ")}
                            {city.areas.length > 4 && " aur aas-paas ke ilaake"}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-[12px] leading-relaxed text-slate-500">
                  Aapka pata in list me naam se nahi hai lekin aas-paas hi hai?{" "}
                  <a
                    href={`tel:${LAB_PHONE.replace(/\s/g, "")}`}
                    title={`Call ${LAB_PHONE} to book a lab test`}
                    className="font-semibold text-emerald-700 underline underline-offset-2 decoration-emerald-300 hover:decoration-emerald-600"
                  >
                    {LAB_PHONE}
                  </a>{" "}
                  par ek call kar lijiye — cover hone par usi waqt slot book ho
                  jaayega.
                </p>
              </div>
            </div>
          </div>

          {/* ── WHAT WE PROMISE ─────────────────────────────────────────── */}
          <div className="mt-12 sm:mt-16">
            <h2 className="text-[22px] sm:text-[28px] font-extrabold tracking-tight text-slate-900">
              Hum Kya Vaada Karte Hain
            </h2>
            <p className="mt-2 max-w-2xl text-[13px] sm:text-[14px] leading-relaxed text-slate-500">
              Chhe baatein, aur har ek me ek number hai — kyunki jo cheez naapi
              nahi ja sakti, uska vaada karna aasan hota hai.
            </p>

            <ul className="mt-6 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PROMISES.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="group rounded-2xl bg-white p-5 ring-1 ring-emerald-100/90 shadow-[0_1px_2px_rgba(6,78,59,0.04),0_14px_34px_-24px_rgba(6,78,59,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:ring-emerald-300/80"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-[0_8px_18px_-8px_rgba(5,150,105,0.7)] transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>

                  <h3 className="mt-4 text-[15px] font-bold tracking-tight text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* ── WHAT WE DO NOT CLAIM ────────────────────────────────────────
              The most important block on this page. Every health service in
              this market makes the same six promises, and a reader has learned
              to discount all of them. What nobody has read is a company naming
              its own limits — and doing so is what makes the six cards above
              worth believing. It is also simply true, which is the only reason
              that matters: an unverifiable claim in a health business's own
              About page is what a manual action is written for. */}
          <div className="mt-12 sm:mt-16 rounded-2xl bg-slate-900 p-6 sm:p-8 text-white ring-1 ring-slate-800">
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-300 ring-1 ring-white/15">
                <ShieldAlert className="h-5 w-5" strokeWidth={1.9} />
              </span>

              <div className="min-w-0">
                <h2 className="text-[18px] sm:text-[22px] font-extrabold tracking-tight">
                  Aur Hum Kya Daawa Nahi Karte
                </h2>

                <ul className="mt-4 space-y-3 text-[13px] sm:text-[14px] leading-relaxed text-slate-300">
                  <li>
                    <span className="font-semibold text-white">
                      Hum NABL accredited hone ka daawa nahi karte.
                    </span>{" "}
                    Ye ek formal accreditation hai aur jab tak wo sach me na ho,
                    use likhna galat hai — chahe wo kitna hi achha dikhe.
                  </li>
                  <li>
                    <span className="font-semibold text-white">
                      Hum 24x7 khule hone ka daawa nahi karte.
                    </span>{" "}
                    Home visit ke slot subah 6 baje se raat tak hain. Report 24
                    ghante me milti hai — lab 24 ghante khula nahi rehta, aur
                    dono baatein alag hain.
                  </li>
                  <li>
                    <span className="font-semibold text-white">
                      Hum har jagah pahunchne ka daawa nahi karte.
                    </span>{" "}
                    Jo ilaake cover hote hain wo har sheher ke page par likhe
                    hain. Aapka pata us list me nahi hai to hum saaf bata denge,
                    intezaar nahi karayenge.
                  </li>
                  <li>
                    <span className="font-semibold text-white">
                      Hum diagnosis nahi karte.
                    </span>{" "}
                    Report par high ya low ka flag ilaaj ki salah nahi hai. Wo
                    doctor se milne ka ishaara hai, aur ye faisla hamesha doctor
                    ka hi rehna chahiye.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── CTA ─────────────────────────────────────────────────────── */}
          <div className="mt-12 sm:mt-16 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-8 sm:px-10 sm:py-10 text-center text-white">
            <h2 className="text-balance text-[22px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
              Apna Test Ghar Baithe Book Kijiye
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-[13.5px] sm:text-[15px] leading-relaxed text-emerald-50">
              Free home sample collection, slot subah 6 baje se, aur report 24
              ghante me WhatsApp par — sabhi test aur rate list ek hi page par.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/#book"
                title="Go to the booking form on the home page"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-[13.5px] font-bold text-emerald-700 transition hover:bg-emerald-50 active:scale-[0.98]"
              >
                Test book karein
              </Link>

              <a
                href={`tel:${LAB_PHONE.replace(/\s/g, "")}`}
                title={`Call ${LAB_PHONE} to book a lab test`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/70 px-6 text-[13.5px] font-bold text-white transition hover:bg-white/10 active:scale-[0.98]"
              >
                <Phone className="h-4 w-4" strokeWidth={2.3} />
                {LAB_PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
