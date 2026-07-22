'use client'

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const PHONE = "+91 98912 33525";

// City-aware questions — the ones a patient actually hesitates on before
// booking: who comes, what it costs, when the report lands, is it accurate.
const buildFaqs = (city) => [
  {
    q: `How much does home sample collection cost in ${city}?`,
    a: `Home sample collection in ${city} is completely free. You pay only for the test — no visiting charge and no hidden fees. A trained phlebotomist comes to your door, collects the sample and carries it safely to the lab.`,
  },
  {
    q: "Who collects the sample, and how soon do they arrive?",
    a: "A certified phlebotomist (lab technician) with a verified ID card comes to your home, usually within 60 minutes of your booking being confirmed. Every collection uses a sealed, single-use needle and a fresh vacutainer.",
  },
  {
    q: "When and how will I get my report?",
    a: "Most reports are ready within 24 hours and are sent as a PDF on both WhatsApp and email, so you can show them to your doctor right away. A few specialised tests take 48–72 hours — we tell you the exact timeline at the time of booking.",
  },
  {
    q: "Which tests require fasting?",
    a: "Tests such as Fasting Blood Sugar, Lipid Profile and the Full Body Checkup need 8–12 hours of fasting. That is why home visit slots start at 6 AM — give your sample early and have your breakfast right after. Tests like CBC, Thyroid Profile and Vitamin D need no fasting at all.",
  },
  {
    q: "Are the results accurate? Is the lab certified?",
    a: "Yes. All samples are processed at NABL-accredited partner labs and every report is verified by a qualified pathologist. From collection to reporting, each step is temperature-controlled and barcode-tracked.",
  },
  {
    q: "How do I book a test, and what payment options are available?",
    a: `Select a test on this page and fill the "Book Now" form, or simply call us at ${PHONE}. You can pay in cash at the time of sample collection, or by UPI (PhonePe, Google Pay, Paytm).`,
  },
];

export default function LabFaq({ city = "Varanasi" }) {
  const faqs = buildFaqs(city);
  const [open, setOpen] = useState(0);

  // FAQPage schema — the same answers, in the shape Google reads for rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="bg-white border-t border-slate-100"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-8 sm:pb-12">

        <h2 className="text-balance text-center text-xl min-[400px]:text-2xl sm:text-[28px] md:text-[32px] font-extrabold tracking-tight text-slate-900">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-center text-[12.5px] sm:text-[13.5px] text-slate-500">
          Common questions about lab tests, home collection and reports in {city}
        </p>

        {/* Only one answer open at a time so the list never becomes a wall of
            text; grid-rows animates the height instead of snapping open. */}
        <ul className="mt-6 sm:mt-8 space-y-2.5">
          {faqs.map(({ q, a }, i) => {
            const isOpen = open === i;
            return (
              <li
                key={q}
                className={`overflow-hidden rounded-xl bg-white transition-all duration-300 ${
                  isOpen
                    ? "ring-1 ring-emerald-300 shadow-[0_10px_26px_-18px_rgba(6,78,59,0.4)]"
                    : "ring-1 ring-slate-200 hover:ring-emerald-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left sm:py-3.5"
                >
                  <span
                    className={`text-[13px] sm:text-[14.5px] font-semibold leading-snug transition-colors duration-200 ${
                      isOpen ? "text-emerald-700" : "text-slate-800"
                    }`}
                  >
                    {q}
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={`h-4.5 w-4.5 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-emerald-600" : "text-slate-400"
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-[12px] sm:text-[13px] leading-relaxed text-slate-500">
                      {a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
