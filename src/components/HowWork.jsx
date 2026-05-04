'use client'

import { MessageCircle, Pill, Truck } from "lucide-react"

export default function HowItWorks() {
  return (
    <section id="how" className="py-5 md:py-10 bg-white">

      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          How it Works
        </h2>

        <p className="mt-3 text-gray-600 text-sm md:text-base">
          Medicine order karna ab bilkul simple hai
        </p>

        {/* Steps */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Step 1 */}
          <div className="relative p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">

            <span className="absolute -top-3 left-6 text-xs font-semibold bg-green-600 text-white px-3 py-1 rounded-full">
              01
            </span>

            <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-lg bg-green-50">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              WhatsApp par message bheje
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Apni medicine ka naam ya prescription share kare
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">

            <span className="absolute -top-3 left-6 text-xs font-semibold bg-green-600 text-white px-3 py-1 rounded-full">
              02
            </span>

            <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-lg bg-green-50">
              <Pill className="w-6 h-6 text-green-600" />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              Order confirm hota hai
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Hum nearby pharmacy se check karke confirm karte hain
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">

            <span className="absolute -top-3 left-6 text-xs font-semibold bg-green-600 text-white px-3 py-1 rounded-full">
              03
            </span>

            <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-lg bg-green-50">
              <Truck className="w-6 h-6 text-green-600" />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              Ghar par delivery milegi
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Same-day delivery directly aapke ghar tak pahuchatey hai
            </p>
          </div>

        </div>

      </div>
    </section>
  )
}