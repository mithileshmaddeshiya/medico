'use client'

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Delivery kitni der me hoti hai?",
    a: "Same-day delivery available hai, location par depend karta hai.",
  },
  {
    q: "Payment kaise karna hota hai?",
    a: "Aap Cash on Delivery ya UPI se payment kar sakte hain.",
  },
  {
    q: "Prescription zaruri hai kya?",
    a: "Kuch medicines ke liye valid prescription required hota hai.",
  },
  {
    q: "Kya medicines genuine hoti hain?",
    a: "Hum trusted local pharmacies se medicines deliver karte hain.",
  },
  {
    q: "Kaunse area me service available hai?",
    a: "Filhaal Deoria city me service available hai.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="py-5 md:py-10 bg-white">
      <div className="max-w-4xl mx-auto px-6">

        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
          Frequently Asked Questions
        </h2>

        <div className="mt-10 space-y-4">

          {faqs.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-medium text-gray-800">
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <p className="px-4 pb-4 text-sm text-gray-600">
                  {item.a}
                </p>
              )}
            </div>
          ))}

        </div>

      </div>
    </section>
  )
}