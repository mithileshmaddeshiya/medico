"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function DeoriaFAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question:
        "Deoria me online medicine delivery kitne time me hoti hai?",
      answer:
        "MedicoBharat Deoria me fast medicine delivery service provide karta hai. City areas aur nearby locations me quick doorstep delivery support available hota hai.",
    },
    {
      question:
        "Kya MedicoBharat genuine medicines provide karta hai?",
      answer:
        "Haan, MedicoBharat trusted pharmacy partners aur verified suppliers ke through genuine medicines aur healthcare products provide karta hai.",
    },
    {
      question:
        "Kya prescription medicines order karne ke liye prescription zaroori hai?",
      answer:
        "Haan, prescription medicines order karne ke liye valid doctor prescription upload karna zaroori hota hai.",
    },
    {
      question:
        "Kya Deoria ke nearby villages me bhi medicine delivery available hai?",
      answer:
        "Haan, MedicoBharat Deoria city ke saath nearby towns aur villages me bhi medicine delivery support provide karta hai.",
    },
    {
      question:
        "Deoria me best online pharmacy kaunsi hai?",
      answer:
        "MedicoBharat Deoria me trusted online pharmacy services provide karta hai jahan users medicines, healthcare products aur wellness essentials online order kar sakte hain.",
    },
    {
      question:
        "Kya online medicine order karna safe hai?",
      answer:
        "Haan, MedicoBharat verified pharmacy partners ke through safe aur trusted medicine ordering experience provide karta hai.",
    },
  ];

  return (
    <>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* FAQ Section */}
<section className="w-full bg-gradient-to-b from-white via-green-50/20 to-white py-5 md:py-1">
  <div className="max-w-4xl mx-auto px-4 sm:px-5">

    {/* Heading */}
    <div className="text-center mb-7 sm:mb-9">
      <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
        ❓ FAQ - MedicoBharat Deoria
      </span>

      <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
        Frequently Asked Questions
      </h2>

      <p className="mt-2 text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
        Common questions related to online medicine delivery in Deoria.
      </p>
    </div>

    {/* FAQ Items */}
    <div className="space-y-3">

      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="bg-white border border-green-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >

            {/* Question */}
            <button
              onClick={() =>
                setOpenIndex(isOpen ? null : index)
              }
              className="w-full flex items-center justify-between gap-3 text-left px-4 sm:px-5 py-4"
            >

              <div className="flex items-start gap-3">

                {/* Icon */}
                <div className="min-w-[30px] h-[30px] rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                  ?
                </div>

                {/* Question Text */}
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
                  {faq.question}
                </h3>
              </div>

              {/* Arrow */}
              <ChevronDown
                className={`min-w-[18px] text-green-700 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Answer */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-4 sm:px-5 pb-4 pl-[48px]">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

    </div>
  </div>
</section>

    </>
  );
}