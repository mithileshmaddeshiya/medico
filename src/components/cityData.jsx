"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const cities = [
  "medicine-delivery/deoria",
  "medicine-delivery/bhatni",
  "medicine-delivery/salempur",
  "medicine-delivery/barhaj",
  "medicine-delivery/lar",
];

export default function PremiumCitySlider({data}) {

  // console.log(data);
  

  return (
    <section className="relative py-5 md:py-10 bg-gradient-to-b from-white via-green-50/40 to-white overflow-hidden">

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">

          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[11px] sm:text-xs font-semibold mb-3">
              <MapPin size={13} />
              {data?.otherCitiesSection?.badge}
            </span>

            <h2 className="text-[12px] md:text-2xl font-bold text-gray-900 leading-tight">
              {data?.otherCitiesSection?.heading}
            </h2>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">

            <button className="city-prev cursor-pointer w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-green-200 bg-white hover:bg-green-600 hover:text-white transition flex items-center justify-center shadow-sm">
              <ChevronLeft
                size={16}
                className="sm:w-[18px] sm:h-[18px]"
              />
            </button>

            <button className="city-next cursor-pointer w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-green-200 bg-white hover:bg-green-600 hover:text-white transition flex items-center justify-center shadow-sm">
              <ChevronRight
                size={16}
                className="sm:w-[18px] sm:h-[18px]"
              />
            </button>

          </div>
        </div>

        {/* Swiper */}
        <Swiper
          slidesPerView={2}
          spaceBetween={10}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: ".city-prev",
            nextEl: ".city-next",
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 14,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 18,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          modules={[Navigation, Autoplay]}
        >
          {cities.map((city, index) => {

            const slug = city.toLowerCase().replace(/\s+/g, "-");

            const formattedCity = city
              .replace(/-/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase());

            return (
              <SwiperSlide key={index}>
                <Link href={`/${slug}`}>

                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="group relative rounded-[12px] sm:rounded-[8px] border border-green-100 bg-white p-3 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer min-h-[190px] sm:min-h-[230px] flex flex-col justify-between overflow-hidden"
                  >

                    {/* Glow */}
                    <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-green-100 blur-3xl opacity-40"></div>

                    {/* Top */}
                    <div>

                      {/* Icon */}
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center shadow-md mb-3 sm:mb-4">
                        <MapPin className="text-white" size={16} />
                      </div>

                      {/* City Name */}
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-5 sm:leading-6 mb-2 sm:mb-3 group-hover:text-green-700 transition break-words line-clamp-2">
                        {formattedCity}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-gray-500 leading-5 sm:leading-6 line-clamp-3">
                        Trusted medicine delivery services available in{" "}
                        {formattedCity}.
                      </p>

                    </div>

                    {/* Bottom */}
                    <div className="flex items-center justify-between mt-4 sm:mt-5">

                      <span className="text-xs sm:text-sm font-medium text-green-700">
                        Explore
                      </span>

                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-600 transition">
                        <ArrowRight
                          size={15}
                          className="text-green-700 group-hover:text-white group-hover:translate-x-1 transition"
                        />
                      </div>

                    </div>

                  </motion.div>

                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

      </div>
    </section>
  );
}