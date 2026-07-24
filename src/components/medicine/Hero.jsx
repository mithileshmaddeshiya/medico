'use client'

import { CheckCircle, Truck } from "lucide-react"
import Image from "next/image"
import MobileSlider from "./HeroMobile"
import CallOrderBanner from "./CallOrder"
import ShopCategories from "./SlideCat"

export default function Hero({ data }) {
  return (

    <section className="pt-20 md:pt-30 bg-gradient-to-b from-green-50 to-white overflow-hidden">

      <div className="max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-2 md:gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className="order-2 md:order-1 text-center md:text-left">

          <div>

            <h1 className="text-[12px] md:text-3xl font-bold leading-tight">
              {data?.hero?.heading}
            </h1>

            {/* Description */}
            <p className="md:text-[16px]  hidden md:block mt-4 text-lg text-gray-600">
              {data?.hero?.subheading}
            </p>

            {/* MOBILE CALL BANNER */}
            <div className="block md:hidden mt-3">
              <CallOrderBanner />
            </div>

            {/* TRUST POINTS */}
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-8 md:gap-2">

              {/* Delivery */}
              <div
                className="flex items-center gap-1.5 bg-green-50 border border-green-200 
                px-3 py-1 rounded-full text-[10px] sm:text-sm font-medium 
                text-green-700 shadow-sm"
              >
                <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                <span>Fast Delivery</span>
              </div>

              {/* Trusted */}
              <div
                className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 
                px-3 py-1 rounded-full text-[10px] sm:text-sm font-medium 
                text-blue-700 shadow-sm"
              >
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                <span>Trusted Store</span>
              </div>

            </div>

            {/* CTA */}
            <div className="mt-5 md:mt-8 flex justify-center md:justify-start">
              <a
                href="https://wa.me/919891233525"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Order on WhatsApp"
                className="inline-flex items-center justify-center bg-green-600 
                text-white px-4 py-2.5 rounded-lg text-[12px] md:text-base 
                font-medium hover:bg-green-700 transition w-full sm:w-auto"
              >
                Place your Order
              </a>
            </div>

          </div>
        </div>

        {/* RIGHT VISUAL DESKTOP */}
        <div className="hidden md:flex order-2 justify-center relative">

          {/* Background Blur */}
          <div className="absolute w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-50"></div>

          <div className="relative w-full max-w-md">
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

        {/* MOBILE VIEW */}
        <div className="block md:hidden order-1 w-full">

          {/* Slider */}
          <div className="w-screen -mx-4 sm:-mx-6">
            <MobileSlider />
          </div>

          <ShopCategories />

        </div>

      </div>
    </section>
  )
}