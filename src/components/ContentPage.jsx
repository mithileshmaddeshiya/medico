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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Heading */}
        <div className="text-center max-w-4xl mx-auto mb-5">
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
            💚 Trusted Online Pharmacy in Deoria
          </span>

          <h2 className="mt-2 text-[18px] md:text-3xl font-bold text-gray-900 leading-tight">
            Online Medicine Delivery <br className="hidden sm:block" />
            in Deoria
          </h2>

          <p className="hidden md:block mt-2 text-[14px] text-gray-600 leading-relaxed">
            MedicoBharat provides fast, trusted and reliable online medicine
            delivery services in Deoria <br /> with genuine medicines, healthcare
            products and quick doorstep delivery support.
          </p>
        </div>

        {/* Preview Card */}
        <div className="relative bg-white border border-green-100 rounded-[12px] sm:rounded-[8px] p-5 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">

          {/* Gradient Glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-40"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
                💊
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Trusted Medicine Delivery Service
                </h3>

                <p className="text-sm text-green-700 font-medium">
                  Fast • Genuine • Reliable
                </p>
              </div>
            </div>

            <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              <p>
                MedicoBharat is becoming one of the preferred online pharmacy
                platforms in Deoria because of its customer-friendly service,
                genuine medicines and fast delivery support.
              </p>

              <p>
                Customers searching for online medicine delivery in Deoria,
                medicine home delivery or trusted pharmacy services can easily
                order medicines online through MedicoBharat.
              </p>
            </div>

            {/* Read More Button */}
            {!showMore && (
              <div className="mt-7">
                <button
                  onClick={() => setShowMore(true)}
                  className="group cursor-pointer inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 sm:px-7 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                >
                  Read More
                  <span className="group-hover:translate-x-1 transition">
                    →
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        <div
          className={`transition-all duration-700 ease-in-out overflow-hidden ${showMore
            ? "max-h-[10000px] opacity-100 mt-8 sm:mt-10"
            : "max-h-0 opacity-0"
            }`}
        >

          {/* Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">

            {/* Left Card */}
            <div className="bg-white border border-green-100 rounded-[28px] p-5 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-5">
                Fast Medicine Home Delivery Across Deoria
              </h3>

              <div className=" hidden md:block space-y-5 text-gray-600 text-sm sm:text-base leading-relaxed">
                <p>
                  MedicoBharat provides medicine home delivery services across
                  Deoria including Civil Lines, Station Road, Malviya Road,
                  Raghav Nagar and nearby areas.
                </p>

                <p>
                  From emergency medicines to daily healthcare essentials,
                  customers can order medicines online easily with quick
                  doorstep delivery support.
                </p>

                <p>
                  Medicine delivery support is also available in nearby towns
                  and villages around Deoria.
                </p>
              </div>
            </div>

            {/* Right Card */}
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-[28px] p-5 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-5">
                Why People Choose MedicoBharat?
              </h3>

              <div className="space-y-4">
                {features.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-green-100 hover:shadow-sm transition"
                  >
                    <div className="min-w-[34px] h-[34px] rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>

                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10">

            {/* Healthcare */}
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-[28px] p-5 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-5">
                Healthcare Products Available Online
              </h3>

              <div className="space-y-5 text-gray-600 text-sm sm:text-base leading-relaxed">
                <p>
                  MedicoBharat provides prescription medicines, OTC medicines,
                  immunity products, baby care products and wellness essentials
                  online in Deoria.
                </p>

                <p>
                  Customers can search and order healthcare products according
                  to their daily healthcare needs.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white border border-green-100 rounded-[28px] p-5 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-5">
                Benefits of Ordering Medicines Online
              </h3>

              <div className="space-y-4">
                {benefits.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <div className="text-green-600 text-lg font-bold">
                      ✔
                    </div>

                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-green-500 rounded-[30px] sm:rounded-[40px] p-6 sm:p-8 md:p-12 text-white shadow-xl">

            {/* Glow Effect */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <h3 className="text-3xl sm:text-4xl font-bold leading-tight mb-5">
                Order Medicines Online in Deoria
              </h3>

              <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed mb-7">
                MedicoBharat helps customers in Deoria order medicines online
                easily with trusted healthcare support, genuine products and
                fast medicine delivery services.
              </p>

              <a
                href="https://wa.me/917303995446"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-green-700 hover:bg-green-50 transition-all duration-300 font-semibold px-7 py-3.5 rounded-2xl shadow-lg text-sm sm:text-base"
              >
                Order Medicines Now
              </a>
            </div>
          </div>

          {/* Read Less */}
          <div className="flex justify-center mt-7">
            <button
              onClick={() => setShowMore(false)}
              className="text-green-700 cursor-pointer hover:text-green-800 font-semibold text-sm sm:text-base transition-all duration-300"
            >
              Read Less ↑
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}