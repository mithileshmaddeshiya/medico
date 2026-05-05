"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQDeoria() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            q: "Kya MedicoBharat Deoria me medicine delivery karta hai?",
            a: "Haan, MedicoBharat Deoria me fast medicine delivery provide karta hai. Aap WhatsApp par order bhej kar 30–60 minutes me delivery paa sakte hain.",
        },
        {
            q: "Deoria me delivery kitne time me milti hai?",
            a: "Usually 30–60 minutes ke andar aapke ghar tak medicine deliver kar di jati hai, location aur availability par depend karta hai.",
        },
        {
            q: "Kya prescription dena zaruri hai?",
            a: "Haan, kuch medicines ke liye valid prescription zaruri hota hai. Aap WhatsApp par apna prescription upload kar sakte hain.",
        },
        {
            q: "Payment kaise kar sakte hain?",
            a: "Aap UPI, cash on delivery (COD) ya online payment ke through payment kar sakte hain.",
        },
        {
            q: "Kya MedicoBharat original medicines deta hai?",
            a: "Haan, hum sirf verified pharmacies se original aur genuine medicines deliver karte hain.",
        },
        {
            q: "Kaun kaun si medicines Deoria me available hain?",
            a: "Fever, diabetes, BP, pain relief aur prescription medicines sab available hain, availability stock par depend karti hai.",
        },
    ];

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
    );
}