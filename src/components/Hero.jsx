'use client'

import { CheckCircle, Truck } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="pt-24 md:pt-30 bg-gradient-to-b from-green-50 to-white">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 grid md:grid-cols-2 gap-10 md:gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className="order-2 md:order-1 text-center md:text-left">

          {/* Mobile Card Wrapper */}
          <div className="md:bg-transparent p-5 md:p-0 rounded-2xl md:rounded-none ">

            {/* Heading */}
            <h1 className="text-2xl sm:text-4xl md:text-4xl font-bold text-gray-900 leading-tight">
              Medicine ghar par mangao
              <span className="block text-green-600"> Deoria me</span>
            </h1>

            {/* Description */}
            <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">
              Bas WhatsApp par apni medicine bhejein aur ghar baithe delivery paayein.
              Fast service, trusted pharmacy.
            </p>

            {/* TRUST POINTS */}
            <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">

              {/* Delivery */}
              <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 
  px-3 py-1.5 sm:px-4 sm:py-2 rounded-full 
  text-[11px] sm:text-sm font-medium text-green-700 
  shadow-sm hover:shadow-md transition">

                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                <span>Fast Delivery</span>
              </div>

              {/* Trusted */}
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 
  px-3 py-1.5 sm:px-4 sm:py-2 rounded-full 
  text-[11px] sm:text-sm font-medium text-blue-700 
  shadow-sm hover:shadow-md transition">

                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                <span>Trusted Store</span>
              </div>

            </div>

            {/* CTA */}
            <div className="mt-6 md:mt-8 flex justify-center md:justify-start">
              <a
                href="https://wa.me/917303995446?text=Hi%20Medicobharat%0AName:%0AAddress:%0AMedicine:%0APrescription:"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-600 text-white px-5 py-3 rounded-lg text-sm md:text-base font-medium hover:bg-green-700 transition w-full sm:w-auto"
              >
                Place your Order
              </a>
            </div>

          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="order-1 md:order-2 relative flex justify-center mt-8 md:mt-0">

          {/* Background */}
          <div className="absolute w-40 h-40 md:w-72 md:h-72 bg-green-100 rounded-full blur-3xl opacity-50"></div>

          {/* Image */}
          <div className="relative w-52 sm:w-64 md:w-full max-w-xs sm:max-w-sm md:max-w-md">
            <Image
              src="/heroimage/medihero.webp"
              alt="Medicine Delivery Deoria"
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