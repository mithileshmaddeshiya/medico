'use client'

import { CheckCircle, Truck } from "lucide-react"
import Image from "next/image"
import MobileSlider from "./HeroMoblie"
import CallOrderBanner from "./CallOrder"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import ShopCategories from "./SlideCat"

export default function Hero() {
  return (
    <section className="pt-20 md:pt-30 bg-gradient-to-b from-green-50 to-white overflow-hidden">

      <div className="max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-2 md:gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className="order-2 md:order-1 text-center md:text-left">

          <div>

            {/* Heading */}
            <h1 className="text-[14px] sm:text-4xl md:text-4xl font-bold text-gray-900 leading-snug">
              Medicine ghar par mangao-
              <span className="text-green-600">
                Deoria me
              </span>
            </h1>

            {/* Description */}
            <p className="mt-2 hidden md:block text-[11px] sm:text-lg text-gray-600 leading-normal max-w-md mx-auto md:mx-0">
              Bas WhatsApp par apni medicine bhejein aur ghar baithe delivery paayein.
              Fast service, trusted pharmacy.
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

          {/* Medicine Box Image */}
          {/* <div className="flex justify-center mt-2">
            <Image
              src="/heroimage/medihero.webp"
              alt="Medicine Delivery"
              width={120}
              height={90}
              className="w-full max-w-[170px] h-auto object-contain"
              priority
            />
          </div> */}

          <ShopCategories />

        </div>

      </div>
    </section>
  )
}