"use client";

import Image from "next/image";
import Link from "next/link";

export default function CityHero() {
  return (
    <section className="w-full bg-gradient-to-t from-green-50 to-white px-4 md:px-6">
      <div className="relative max-w-6xl mx-auto h-[260px] md:h-[320px] rounded-2xl overflow-hidden">

        {/* Desktop Image */}
        <Image
          src="/citybn/medicoimg.webp"
          alt="Medicine Delivery in Deoria"
          fill
          priority
          className="object-cover hidden md:block"
        />

        {/* Mobile Image */}
        <Image
          src="/short/mobileimg1.webp
          "
          alt="Medicine Delivery in Deoria"
          fill
          priority
          className="object-cover block md:hidden"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent"></div>

        {/* ================= DESKTOP CONTENT ================= */}
        <div className="hidden md:flex absolute inset-0 z-20 flex-col justify-center px-10 text-white">

          {/* Badge */}
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full 
            bg-green-500/90 text-white text-xs font-medium mb-3 shadow backdrop-blur-sm
            self-start"
          >
            🚚 30 – 60 Min Delivery • Deoria
          </span>

          {/* Heading */}
          <h2 className="text-3xl font-bold leading-tight max-w-xl">
            Fast & Trusted Medicine <br /> Delivery in Deoria 💊
          </h2>

          {/* Subtext */}
          <p className="mt-2 text-base text-gray-200 max-w-md">
            Ghar baithe genuine medicines paayein. <br />
            Local verified pharmacies se direct delivery.
          </p>

          {/* CTA */}
          <div className="mt-5">
            <Link
              href="https://wa.me/917303995446"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-md text-sm font-semibold shadow inline-block"
            >
              Order Medicine Now
            </Link>
          </div>

        </div>

        {/* ================= MOBILE CONTENT ================= */}
        <div className="flex md:hidden absolute inset-0 z-20 flex-col justify-center p-5">

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/45 rounded-2xl"></div>

          {/* Content */}
          <div className="relative z-10">

            {/* Mobile Badge */}
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full 
      bg-green-500 text-white text-[11px] font-semibold mb-3 shadow-lg"
            >
              ⚡ Fast Medicine Delivery
            </span>

            {/* Mobile Heading */}
            <h2 className="text-[18px] font-extrabold leading-tight text-white drop-shadow-lg max-w-[260px]">
              Ghar Baithe Medicine <br /> Order Karein 💊
            </h2>

            {/* Mobile Subtext */}
            <p className="mt-3 text-[12px] text-gray-100 leading-relaxed max-w-[260px] drop-shadow">
              WhatsApp par medicine order karein <br /> aur
              <span className="font-semibold text-green-300">
                {" "}30–60 minute
              </span>{" "}
              mein fast delivery paayein.
            </p>

            {/* Mobile CTA */}
            <div className="mt-5">
              <Link
                href="https://wa.me/917303995446"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl inline-block text-white transition"
              >
                Order Now →
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}