"use client";

import { useState } from "react";

export default function DeoriaLongSEOContent() {
  const [showMore, setShowMore] = useState(false);

  const features = [
    "100% genuine medicines from trusted pharmacy partners",
    "Fast medicine delivery support in Deoria",
    "Easy prescription upload and ordering process",
    "Trusted healthcare products and wellness essentials",
    "Simple and customer-friendly experience",
  ];

  const benefits = [
    "Save time with doorstep delivery",
    "Avoid visiting multiple medical stores physically",
    "Easy healthcare product access",
    "Reliable medicine ordering support",
    "Trusted online pharmacy experience",
  ];

  return (
    <section className="w-full bg-gradient-to-b from-white via-green-50/30 to-white py-2 md:py-5 overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-4">

        <div className="bg-white border border-green-100 rounded-[13px] p-6 sm:p-10 shadow-sm hover:shadow-lg transition-all duration-300 mb-10">

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Best Online Pharmacy & Medicine Delivery in Deoria
          </h2>

          {/* CONTENT */}
          <div
            className={`overflow-hidden transition-all duration-500 ${
              showMore ? "max-h-[2000px]" : "max-h-[260px]"
            }`}
          >
            <div className="space-y-5 text-gray-700 text-sm sm:text-base leading-relaxed">

              <p>
                MedicoBharat is one of the trusted platforms for online medicine delivery in Deoria.
                Customers searching for medicine home delivery in Deoria, online pharmacy in Deoria,
                medical store near me or fast medicine delivery services can easily order medicines online
                through MedicoBharat.
              </p>

              <p>
                The platform helps customers order prescription medicines, OTC medicines, healthcare
                products, baby care products, wellness supplements and daily healthcare essentials
                online with doorstep delivery support.
              </p>

              <p>
                MedicoBharat provides fast online medicine delivery across Civil Lines, Station Road,
                Malviya Road, Raghav Nagar, Saket Nagar, Hanuman Mandir Area, Rudrapur Road,
                Subhash Chowk and nearby areas of Deoria.
              </p>

              <p>
                Customers looking for trusted medical stores in Deoria can upload prescriptions online,
                search medicines easily and place medicine orders from home without visiting multiple
                pharmacy stores physically.
              </p>

              <p>
                Online medicine ordering helps save time and provides easy access to healthcare products,
                genuine medicines and wellness essentials. MedicoBharat focuses on customer-friendly
                service, fast support and reliable medicine delivery experience in Deoria.
              </p>

              <p>
                Many customers search for 24x7 medicine delivery in Deoria, emergency medicine delivery,
                online pharmacy near me and medicine delivery near railway station area. MedicoBharat
                aims to provide trusted online pharmacy support and convenient medicine ordering
                experience for customers in Deoria and nearby locations.
              </p>

            </div>
          </div>

          {/* BUTTON */}
          <div className="flex justify-center mt-7">
            <button
              onClick={() => setShowMore(!showMore)}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r cursor-pointer from-green-600 to-emerald-500 px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-emerald-200"
            >
              <span className="relative z-10 flex items-center gap-2">
                {showMore ? "Read Less" : "Read More"}

                <svg
                  className={`h-4 w-4 transition-transform duration-300 ${
                    showMore ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>

              <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}