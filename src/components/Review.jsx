'use client'

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

import { Star } from "lucide-react"



export default function Reviews({ data }) {


  const reviews = data?.reviews || [];

  // console.log(data);
  
  

  return (
    <section className="py-2 bg-white">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">

        {/* Heading */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Trusted by Customers ❤️
        </h2>

        <p className="mt-2 text-gray-600 mb-3 text-sm sm:text-base">
          {data?.testimonialSubheading}
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
                <div className="h-full bg-gray-50 p-6 rounded-2xl shadow-sm">

                  <div className="flex items-center gap-3">
                    <img
                      src={review.img}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {review.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {review.role}
                      </p>

                      <div className="flex gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-gray-700 leading-relaxed">
                    "{review.text}"
                  </p>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  )
}