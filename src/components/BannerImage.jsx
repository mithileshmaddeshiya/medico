'use client'

import Image from "next/image"

export default function BannerImage() {
  return (
    <section className="py-3">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="relative w-full h-[180px] md:h-[280px] rounded-2xl overflow-hidden shadow-sm">

          <Image
            src="/short/statsimg.png" // 👉 yaha apni generated image ka path daalo
            alt="Medicine delivery banner"
            fill
            priority
            className="object-cover"
          />

        </div>

      </div>
    </section>
  )
}