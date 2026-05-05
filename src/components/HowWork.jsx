'use client'

import { ShieldCheck, BadgeCheck, Truck, PhoneCall } from "lucide-react"

export default function WhyChooseUs() {
  return (
    <section className="py-1 md:py-5">

      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Why Choose Medicobharat?
        </h2>

        <p className="mt-3 text-gray-600 text-sm md:text-base">
          Safe, fast aur trusted medicine delivery service
        </p>

        {/* Points */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">

          {/* Genuine */}
          <div className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <ShieldCheck className="w-8 h-8 text-green-600 mx-auto" />
            <h3 className="mt-3 font-semibold text-gray-900 text-sm md:text-base">
              100% Genuine
            </h3>
            <p className="mt-1 text-xs text-gray-600">
              Original medicines only
            </p>
          </div>

          {/* Licensed */}
          <div className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <BadgeCheck className="w-8 h-8 text-green-600 mx-auto" />
            <h3 className="mt-3 font-semibold text-gray-900 text-sm md:text-base">
              Licensed Pharmacy
            </h3>
            <p className="mt-1 text-xs text-gray-600">
              Verified partners
            </p>
          </div>

          {/* Fast Delivery */}
          <div className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <Truck className="w-8 h-8 text-green-600 mx-auto" />
            <h3 className="mt-3 font-semibold text-gray-900 text-sm md:text-base">
              Fast Delivery
            </h3>
            <p className="mt-1 text-xs text-gray-600">
              Same day delivery
            </p>
          </div>

          <a
            href="https://wa.me/917303995446"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
              <PhoneCall className="w-8 h-8 text-green-600 mx-auto" />

              <h3 className="mt-3 font-semibold text-gray-900 text-sm md:text-base">
                Easy Ordering
              </h3>

              <p className="mt-1 text-xs text-gray-600">
                WhatsApp: +91 7303995446
              </p>
            </div>
          </a>

        </div>

      </div>
    </section>
  )
}