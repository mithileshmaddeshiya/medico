"use client";

import Image from "next/image";
import Link from "next/link";

export default function CityHero() {
  return (
    <section className="w-full bg-gradient-to-t from-green-50 to-white px-4 md:px-6">
      <div className="relative max-w-6xl mx-auto h-[240px] md:h-[320px] rounded-2xl overflow-hidden">

        {/* Desktop Image */}
        <Image
          src="/short/bannerimg.png"
          alt="Medicine Delivery in Deoria"
          fill
          priority
          className="object-cover hidden md:block"
        />

        {/* Mobile Image */}
        <Image
          src="/short/mobileimg1.png" //👈 yaha tum apni mobile image add karoge
          alt="Medicine Delivery in Deoria"
          fill
          priority
          className="object-cover block md:hidden"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>

        {/* Content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-4 md:px-10 text-white">

          <span className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full 
  bg-green-500/90 text-white text-[10px] md:text-xs font-medium mb-3 shadow backdrop-blur-sm
  self-start">
            🚚 30–60 Min Delivery • Deoria
          </span>

          {/* Heading */}
          <h2 className="text-md md:text-3xl font-bold leading-tight max-w-xs md:max-w-xl">
            {/* Mobile text */}
            <span className="block md:hidden">
              Ghar Baithe Medicine 💊 <br /> 30–60 Min Delivery
            </span>

            {/* Desktop text */}
            <span className="hidden md:block">
              Fast & Trusted Medicine <br /> Delivery in Deoria 💊
            </span>
          </h2>

          {/* Subtext */}
          <p className="mt-2 text-xs md:text-base text-gray-200 max-w-xs md:max-w-md">
            {/* Mobile */}
            <span className="block md:hidden">
              WhatsApp se order karein <br /> aur ghar par delivery paayein.
            </span>

            {/* Desktop */}
            <span className="hidden md:block">
              Ghar baithe genuine medicines paayein. <br />
              Local verified pharmacies se direct delivery.
            </span>
          </p>

          {/* CTA */}
          <div className="mt-4">
            <Link
              href="https://wa.me/91XXXXXXXXXX"
              className="bg-green-500 hover:bg-green-600 px-4 py-2 md:px-5 md:py-2 rounded-md text-xs md:text-sm font-semibold shadow"
            >
              Order Medicine Now
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}