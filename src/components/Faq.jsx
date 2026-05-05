'use client'

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Deoria me medicine delivery kitni der me hoti hai?",
    a: "MedicoBharat Deoria me 30–60 minutes ke andar fast medicine delivery provide karta hai, location aur availability par depend karta hai.",
  },
  {
    q: "Kya Deoria me Cash on Delivery (COD) available hai?",
    a: "Haan, Deoria me aap Cash on Delivery (COD) aur UPI (PhonePe, Google Pay, Paytm) se payment kar sakte hain.",
  },
  {
    q: "Deoria me online medicine order kaise karein?",
    a: "Aap MedicoBharat website ya WhatsApp ke through Deoria me easily medicine order kar sakte hain. Bas medicine name ya prescription bhejein aur hum delivery arrange kar denge.",
  },
  {
    q: "Kya Deoria me genuine medicines milti hain?",
    a: "Haan, MedicoBharat Deoria me trusted aur verified local pharmacies se 100% genuine medicines deliver karta hai.",
  },
  {
    q: "Deoria ke kaunse areas me service available hai?",
    a: "MedicoBharat Deoria city ke saath-saath Salempur, Bhatni, Rudrapur, Bhatpar aur nearby areas me bhi medicine delivery service provide karta hai.",
  },
  {
    q: "Kya Deoria me prescription zaruri hai?",
    a: "Haan, kuch medicines ke liye valid doctor prescription zaruri hota hai. Aap WhatsApp par prescription upload kar sakte hain.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="pt-5 bg-white">
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
                  className={`w-5 h-5 transition ${openIndex === index ? "rotate-180" : ""
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