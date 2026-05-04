'use client'

import { CheckCircle, Truck } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="pt-28 pb-16 md:pb-20 bg-gradient-to-b from-green-50 to-white">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 grid md:grid-cols-2 gap-10 md:gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className=" order-2 md:order-1 text-center md:text-left">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Ghar baithe medicine delivery
            <span className="text-green-600 "> Deoria me</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Fast, trusted aur same-day medicine delivery in Deoria.
            WhatsApp par order kare aur apni medicines ghar par paye.
          </p>

          {/* CTA */}
          <div className="mt-6 md:mt-8 flex justify-center md:justify-start">
            <a
              href="https://wa.me/917303995446?text=Hi%20Medicobharat%0AName:%0AAddress:%0AMedicine:%0APrescription:"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-green-600 text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-green-700 transition w-full sm:w-auto"
            >
              Order on WhatsApp
            </a>
          </div>

          {/* TRUST POINTS */}
          <div className="mt-6 md:mt-8 flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 text-sm text-gray-700">

            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-600" />
              <span>Same Day Delivery</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Trusted Pharmacy</span>
            </div>

          </div>

        </div>

        {/* RIGHT VISUAL */}
        <div className="order-1 md:order-2 relative flex justify-center mt-10 md:mt-0">

          {/* Soft background effect */}
          <div className="absolute w-40 h-40 md:w-72 md:h-72 bg-green-100 rounded-full blur-3xl opacity-50"></div>

          {/* Image */}
          <div className="relative w-52 sm:w-64 md:w-full max-w-xs sm:max-w-sm md:max-w-md ">
            <Image
              src="/heroimage/medihero.png"
              alt="Medicine Delivery deoria"
              width={400}
              height={400}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

        </div>

      </div>

    </section>
  )
}