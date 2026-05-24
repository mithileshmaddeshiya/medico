"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
  Truck,
  ChevronDown,
} from "lucide-react";

import { useState } from "react";

export default function SalempurMedicineLanding() {

  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question:
        "Salempur me medicine delivery kitne time me hoti hai?",
      answer:
        "Most medicine orders in Salempur are delivered within 30–90 minutes depending on location and medicine availability.",
    },
    {
      question:
        "Kya prescription upload karna zaroori hai?",
      answer:
        "Haan, prescription medicines order karne ke liye valid doctor prescription required hota hai.",
    },
    {
      question:
        "Kya genuine medicines milti hain?",
      answer:
        "Haan, MedicoBharat trusted pharmacy partners ke through genuine medicines provide karta hai.",
    },
    {
      question:
        "Kya nearby villages me bhi delivery available hai?",
      answer:
        "Haan, Salempur ke nearby areas aur villages me bhi medicine delivery support available hai.",
    },
  ];

  const features = [
    "Fast doorstep medicine delivery",
    "Trusted pharmacy partners",
    "Easy WhatsApp ordering",
    "Prescription medicine support",
    "Healthcare & wellness products",
    "Same-day delivery available",
  ];

  return (
    <>

      <main className="w-full bg-gradient-to-b from-white via-green-50/30 to-white overflow-hidden">

        {/* ================= HERO ================= */}
        <section className="relative">

          <div className="relative h-[520px] md:h-[650px] overflow-hidden">

            <Image
              src="/citybn/medicoimg.webp"
              alt="Medicine Delivery in Salempur"
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/60"></div>

            <div className="absolute inset-0 z-20 flex items-center">

              <div className="max-w-6xl mx-auto px-4 w-full">

                <div className="max-w-2xl text-white">

                  <span className="inline-flex items-center gap-2 bg-green-500 px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-5">
                    <Truck size={16} />
                    Fast Medicine Delivery in Salempur
                  </span>

                  <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                    Online Medicine Delivery
                    <span className="text-green-400"> in Salempur</span>
                  </h1>

                  <p className="mt-5 text-base md:text-lg text-gray-200 leading-relaxed">
                    Order genuine medicines, healthcare products, wellness essentials,
                    prescription medicines and daily healthcare items online in Salempur.
                    Fast doorstep delivery from trusted pharmacy partners.
                  </p>

                  {/* CTA */}
                  <div className="mt-8 flex flex-wrap gap-4">

                    <Link
                      href="https://wa.me/919891233525"
                      target="_blank"
                      className="bg-green-500 hover:bg-green-600 text-white px-7 py-4 rounded-xl font-semibold shadow-lg transition"
                    >
                      Order on WhatsApp
                    </Link>

                    <button className="border border-white/40 backdrop-blur-sm px-7 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition">
                      Explore Services
                    </button>

                  </div>

                  {/* Trust Points */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4">
                      <Clock3 className="text-green-400 mb-2" />
                      <p className="text-sm font-medium">
                        30–90 Min Delivery
                      </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4">
                      <ShieldCheck className="text-green-400 mb-2" />
                      <p className="text-sm font-medium">
                        Genuine Medicines
                      </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4">
                      <MapPin className="text-green-400 mb-2" />
                      <p className="text-sm font-medium">
                        Salempur Coverage
                      </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4">
                      <Star className="text-green-400 mb-2" />
                      <p className="text-sm font-medium">
                        Trusted Service
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ================= CONTENT ================= */}
        <section className="py-14">

          <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">

            <div>

              <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                Best Online Pharmacy in Salempur
              </span>

              <h2 className="mt-5 text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                Trusted Medicine Home Delivery Service in Salempur
              </h2>

              <p className="mt-6 text-gray-600 leading-relaxed text-base">
                MedicoBharat helps customers order medicines online in Salempur
                with easy WhatsApp ordering and fast delivery support.
                Customers searching for online pharmacy in Salempur,
                medicine home delivery, healthcare products, wellness supplements,
                emergency medicines and prescription medicines can easily order online.
              </p>

              <p className="mt-5 text-gray-600 leading-relaxed text-base">
                The platform provides access to genuine medicines,
                healthcare essentials, OTC products, baby care products,
                wellness supplements and personal care products from trusted pharmacy partners.
              </p>

            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {features.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                >
                  <CheckCircle className="text-green-600 mb-4" />

                  <h3 className="font-semibold text-gray-900">
                    {item}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2">
                    Trusted and convenient healthcare support in Salempur.
                  </p>
                </div>
              ))}

            </div>

          </div>

        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="py-14 bg-white">

          <div className="max-w-6xl mx-auto px-4 text-center">

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How Medicine Ordering Works
            </h2>

            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Order medicines online in Salempur in just 3 simple steps.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">

              {[
                {
                  title: "Upload Prescription",
                  desc: "WhatsApp par medicine ya prescription bhejein",
                },
                {
                  title: "Order Confirmation",
                  desc: "Availability aur pricing confirm ki jati hai",
                },
                {
                  title: "Doorstep Delivery",
                  desc: "Fast medicine delivery at your location",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-green-50 rounded-2xl p-8 border border-green-100"
                >
                  <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center mx-auto text-xl font-bold">
                    {index + 1}
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-gray-600">
                    {item.desc}
                  </p>
                </div>
              ))}

            </div>

          </div>

        </section>

        {/* ================= FAQ ================= */}
        <section className="py-14">

          <div className="max-w-4xl mx-auto px-4">

            <div className="text-center mb-10">

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>

              <p className="mt-3 text-gray-600">
                Common questions related to medicine delivery in Salempur.
              </p>

            </div>

            <div className="space-y-4">

              {faqs.map((faq, index) => {

                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-sm"
                  >

                    <button
                      onClick={() =>
                        setOpenIndex(isOpen ? null : index)
                      }
                      className="w-full px-6 py-5 flex items-center justify-between text-left"
                    >
                      <h3 className="font-semibold text-gray-900">
                        {faq.question}
                      </h3>

                      <ChevronDown
                        className={`transition ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-5 text-gray-600">
                        {faq.answer}
                      </div>
                    )}

                  </div>
                );
              })}

            </div>

          </div>

        </section>

        {/* ================= CTA ================= */}
        <section className="py-16">

          <div className="max-w-5xl mx-auto px-4">

            <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-10 md:p-14 text-center text-white shadow-2xl">

              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Need Medicines in Salempur?
              </h2>

              <p className="mt-5 text-green-50 text-lg">
                Order online now and get fast doorstep delivery from trusted pharmacy partners.
              </p>

              <div className="mt-8">

                <Link
                  href="https://wa.me/919891233525"
                  target="_blank"
                  className="inline-flex items-center bg-white text-green-700 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
                >
                  Order Medicines Now
                </Link>

              </div>

            </div>

          </div>

        </section>

      </main>
    </>
  );
}