'use client'

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

import { Star } from "lucide-react"

const reviews = [
  {
    name: "Ravi Kumar",
    role: "Verified Customer • Deoria",
    text: "Bahut fast service thi. Maine subah order kiya aur 2–3 ghante me medicine mil gayi. Packaging bhi achhi thi aur medicines genuine thi.",
    img: "/user/rohit.webp",
  },
  {
    name: "Pooja Singh",
    role: "Verified Customer • Deoria",
    text: "WhatsApp se order karna bahut easy tha. Prescription bhejne ke baad turant response mila. Service reliable lagi.",
    img: "/user/priya.webp",
  },
  {
    name: "Amit Verma",
    role: "Verified Customer • Deoria",
    text: "Emergency me order kiya tha aur same-day delivery mil gayi. Local service hone ki wajah se kaafi fast hai.",
    img: "/user/amitsingh.webp",
  },
  {
    name: "Neha Gupta",
    role: "Verified Customer • Deoria",
    text: "Medicobharat se pehli baar order kiya aur experience kaafi smooth raha. Future me bhi use karungi.",
    img: "/user/neha1.webp",
  },
]

export default function Reviews() {
  return (
    <section className="py-2 bg-white">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">

        {/* Heading */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Trusted by Customers ❤️
        </h2>

        <p className="mt-2 text-gray-600 mb-3 text-sm sm:text-base">
          Deoria ke log Medicobharat par bharosa karte hain
        </p>

        {/* Swiper */}
        <div >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {reviews.map((review, i) => (
              <SwiperSlide key={i}>
                <div className="h-full bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition text-left flex flex-col justify-between">

                  {/* Top */}
                  <div>

                    {/* User */}
                    <div className="flex items-center gap-3">
                      <img
                        src={review.img}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {review.name}
                        </p>

                        {/* Stars */}
                        <div className="flex gap-1 text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="mt-4 text-sm text-gray-700 leading-relaxed">
                      “{review.text}”
                    </p>

                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  )
}