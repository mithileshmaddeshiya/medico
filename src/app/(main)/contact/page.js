import Link from "next/link";
import { linkTitle } from "@/lib/linkTitle";
import { Clock3, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

import { LAB_PHONE, LAB_WHATSAPP, defaultFooter } from "@/data/lab/defaults";
import { getLabCities } from "@/lib/labCities";
import { ORG_REF, WEBSITE_ID, graph, ldJson } from "@/lib/schema";
import { SITE, url } from "@/lib/site";

/**
 * /contact
 *
 * ── WHY EVERY NUMBER ON THIS PAGE IS IMPORTED ────────────────────────────
 * This page used to hardcode its own contact details, and they had drifted:
 * the WhatsApp button dialled 7303995446 while the footer and the schema on
 * every other page used 9891233525, and the email said
 * support@medicobharat.com while the rest of the site said
 * support.medicobharat@gmail.com.
 *
 * That is not a cosmetic bug. Local ranking is built on NAP consistency —
 * Name, Address, Phone appearing identically across a site, its schema and its
 * business profile. Two phone numbers on one domain is exactly the signal that
 * stops a business being matched to a single entity, and the contact page is
 * the page a crawler weights most heavily for it.
 *
 * So nothing here is typed. LAB_PHONE, LAB_WHATSAPP and defaultFooter().email
 * come from src/data/lab/defaults.js — the same source the footer, the booking
 * form and the DiagnosticLab schema read. Change a number there and it changes
 * everywhere at once, which is the only way it stays consistent.
 *
 * The copy is lab-test copy now. It used to offer "medicine ordering
 * assistance" and "prescription support" for a section that no longer exists.
 */
export const metadata = {
  title: "Contact MedicoBharat — Lab Test Booking Help",

  description:
    "Lab test booking, collection ke ilaake, report ya price ka sawaal — MedicoBharat se WhatsApp, phone ya email par baat kijiye. Slot subah 6 baje se.",

  keywords: [
    "Contact MedicoBharat",
    "MedicoBharat phone number",
    "lab test booking help",
    "home sample collection booking",
    "lab test customer support",
    "blood test booking number",
  ],

  alternates: {
    canonical: url("/contact"),
  },

  authors: [{ name: "MedicoBharat" }],

  publisher: "MedicoBharat",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Contact MedicoBharat — Lab Test Booking Help",
    description:
      "Lab test booking, coverage aur report se jude sawaal — WhatsApp, phone ya email par baat kijiye.",
    url: url("/contact"),
    siteName: "MedicoBharat",
    type: "website",
  },
};

export default async function ContactPage() {
  const cities = await getLabCities();
  const { email, hours } = defaultFooter("");

  const tel = `tel:${LAB_PHONE.replace(/\s/g, "")}`;
  const whatsapp = `https://wa.me/${LAB_WHATSAPP}`;

  /* ContactPage joined to the site graph. `mainEntity` resolves to the same
     organisation @id the root layout declares, and the ContactPoint below
     carries the same number the whole site prints — which is the entire point
     of the note at the top of this file. */
  const contactNode = {
    "@type": "ContactPage",
    "@id": `${SITE}/contact#webpage`,
    url: url("/contact"),
    name: metadata.title,
    description: metadata.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: ORG_REF,
    mainEntity: {
      "@type": "ContactPoint",
      telephone: LAB_PHONE,
      email,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["Hindi", "English"],
    },
    publisher: ORG_REF,
    inLanguage: ["hi-IN", "en-IN"],
  };

  const breadcrumbNode = {
    "@type": "BreadcrumbList",
    "@id": `${SITE}/contact#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Contact", item: url("/contact") },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: ldJson(graph(contactNode, breadcrumbNode)),
        }}
      />

      <section className="w-full overflow-hidden bg-linear-to-b from-emerald-50/70 to-white pt-24 sm:pt-32 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative mx-auto max-w-3xl text-center">
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 h-52 w-52 -translate-x-1/2 rounded-full bg-emerald-200/40 blur-3xl"
            />

            <span className="relative inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-[11.5px] font-bold text-emerald-800 shadow-sm">
              {hours}
            </span>

            <h1 className="relative mt-4 text-balance text-[30px] sm:text-[42px] font-extrabold leading-[1.12] tracking-tight text-slate-900">
              Contact{" "}
              <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                MedicoBharat
              </span>
            </h1>

            <p className="relative mt-4 text-[14px] sm:text-[16.5px] leading-relaxed text-slate-600">
              Test book karana ho, ye poochhna ho ki aapka ilaaka cover hota hai
              ya nahi, ya report aur price se juda koi sawaal ho — call kijiye,
              WhatsApp kijiye ya email likhiye. Baat Hindi me hoti hai.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">

          {/* ── THREE WAYS TO REACH US ──────────────────────────────────── */}
          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* PHONE — first, because it is the fastest way to a booking and
                the number this business is actually reached on. */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-emerald-100/90 shadow-[0_1px_2px_rgba(6,78,59,0.04),0_14px_34px_-24px_rgba(6,78,59,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:ring-emerald-300/80">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-[0_8px_18px_-8px_rgba(5,150,105,0.7)]">
                <Phone className="h-5 w-5" strokeWidth={1.9} />
              </span>

              <h2 className="mt-4 text-[16px] font-bold tracking-tight text-slate-900">
                Call kijiye
              </h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">
                Sabse tez tarika. Slot, ilaaka aur price — teenon ek call me
                confirm ho jaate hain.
              </p>

              <a
                href={tel}
                title="Call MedicoBharat to book a lab test"
                className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-[13px] font-bold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                <Phone className="h-3.5 w-3.5" strokeWidth={2.4} />
                <span className="tabular-nums">{LAB_PHONE}</span>
              </a>
            </div>

            {/* WHATSAPP */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-emerald-100/90 shadow-[0_1px_2px_rgba(6,78,59,0.04),0_14px_34px_-24px_rgba(6,78,59,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:ring-emerald-300/80">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                <FaWhatsapp className="h-6 w-6" aria-hidden />
              </span>

              <h2 className="mt-4 text-[16px] font-bold tracking-tight text-slate-900">
                WhatsApp
              </h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">
                Doctor ka parcha bhejna ho to yahi sabse aasan hai — photo
                bhejiye, wahi panel book ho jaayega.
              </p>

              <a
                href={whatsapp}
                title="Chat with MedicoBharat on WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-[13px] font-bold text-white transition hover:opacity-90 active:scale-[0.98]"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden />
                Chat karein
              </a>
            </div>

            {/* EMAIL */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-emerald-100/90 shadow-[0_1px_2px_rgba(6,78,59,0.04),0_14px_34px_-24px_rgba(6,78,59,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:ring-emerald-300/80 sm:col-span-2 lg:col-span-1">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                <Mail className="h-5 w-5" strokeWidth={1.9} />
              </span>

              <h2 className="mt-4 text-[16px] font-bold tracking-tight text-slate-900">
                Email
              </h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">
                Report se juda koi sawaal, ya likhit me kuch bhejna ho to yahan
                likhiye.
              </p>

              <a
                href={`mailto:${email}`}
                title={`Email MedicoBharat at ${email}`}
                className="mt-4 inline-block break-all text-[13px] font-bold text-emerald-700 underline underline-offset-2 decoration-emerald-300 hover:decoration-emerald-600"
              >
                {email}
              </a>
            </div>
          </div>

          {/* ── WHAT WE CAN HELP WITH + WHERE WE COME ───────────────────── */}
          <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-2">

            <div className="rounded-2xl bg-white p-5 sm:p-6 ring-1 ring-slate-200/80">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  <ShieldCheck className="h-5 w-5" strokeWidth={2} />
                </span>
                <h2 className="text-[17px] font-bold tracking-tight text-slate-900">
                  Kis cheez me madad milti hai
                </h2>
              </div>

              <ul className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-slate-600">
                <li>• Test ya package chunne me — kaun sa test kab karana chahiye</li>
                <li>• Doctor ke parche ke hisaab se sahi panel book karne me</li>
                <li>• Ye confirm karne me ki aapka pata cover hota hai ya nahi</li>
                <li>• Fasting ke niyam aur slot ke time me</li>
                <li>• Report na milne ya PDF dobara chahiye hone par</li>
                <li>• Us test ka price jo is site par listed nahi hai</li>
              </ul>

              <p className="mt-4 rounded-xl bg-amber-50 p-3.5 text-[12.5px] leading-relaxed text-amber-900 ring-1 ring-amber-200">
                <strong className="font-bold">Emergency me call mat kijiye.</strong>{" "}
                Tez bukhar ke saath jhatke, behoshi, saans ki takleef, seene me
                dard ya lagatar ulti ho to seedha najdeeki hospital jaaiye. Lab
                test iska pehla jawab nahi hai.
              </p>
            </div>

            <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50/60 p-5 sm:p-6 ring-1 ring-emerald-100">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 ring-1 ring-emerald-100">
                  <Clock3 className="h-5 w-5" strokeWidth={2} />
                </span>
                <h2 className="text-[17px] font-bold tracking-tight text-slate-900">
                  Timing aur coverage
                </h2>
              </div>

              <p className="mt-4 text-[13px] leading-relaxed text-slate-600">
                Home visit ke slot <strong className="font-semibold text-slate-800">subah 6 baje se</strong>{" "}
                shuru hote hain aur shaam tak chalte hain, saaton din. Report 24
                ghante me milti hai — lab 24 ghante khula nahi rehta, aur hum
                aisa daawa bhi nahi karte.
              </p>

              {/* Cities as links: /contact is a page both readers and crawlers
                  reach, and a route from here into each city page is worth more
                  than a paragraph about how responsive we are. */}
              <nav aria-label="Cities we serve" className="mt-4">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.1em] text-emerald-800">
                  Jin sheher me collection hoti hai
                </h3>
                <ul className="mt-2.5 space-y-1.5">
                  {cities.map((city) => (
                    <li key={city.slug}>
                      <Link
                        href={`/lab-test/${city.slug}`}
                        title={linkTitle(`/lab-test/${city.slug}`)}
                        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-700 transition-colors hover:text-emerald-700"
                      >
                        <MapPin
                          aria-hidden
                          className="h-3.5 w-3.5 shrink-0 text-emerald-500"
                          strokeWidth={2.2}
                        />
                        Lab Test in {city.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <p className="mt-4 text-[12.5px] leading-relaxed text-slate-500">
                Aapka gaon ya mohalla in page par listed nahi hai? Ek call kar
                lijiye — cover hone par usi waqt slot book ho jaayega, aur nahi
                hone par hum saaf bata denge.
              </p>
            </div>
          </div>

          {/* ── CTA ─────────────────────────────────────────────────────── */}
          <div className="mt-5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-8 sm:px-10 sm:py-10 text-center text-white">
            <h2 className="text-balance text-[22px] sm:text-[30px] font-extrabold leading-tight tracking-tight">
              Call Karne Ki Bhi Zaroorat Nahi
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-[13.5px] sm:text-[15px] leading-relaxed text-emerald-50">
              Form bhar dijiye — hum lagbhag 30 minute me call kar ke slot aur
              pata confirm kar lenge.
            </p>

            <div className="mt-6">
              <Link
                href="/#book"
                title="Go to the booking form on the home page"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-7 text-[13.5px] font-bold text-emerald-700 transition hover:bg-emerald-50 active:scale-[0.98]"
              >
                Booking form kholein
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
