"use client"

import Image from "next/image"

const categories = [
  {
    title: "Personal Care",
    image: "/categoryimg/beautycare.webp",
    bg: "bg-[#EEF4FF]",
  },
  {
    title: "Health Conditions",
    image: "/categoryimg/healthcondition.webp",
    bg: "bg-[#FFF6E9]",
  },
  {
    title: "Vitamins & Supplements",
    image: "/categoryimg/vitamins.webp",
    bg: "bg-[#EEFCEB]",
  },
  {
    title: "Diabetes Care",
    image: "/categoryimg/diabetes.webp",
    bg: "bg-[#FFF1F1]",
  },
]

export default function ShopCategories() {
  return (
    <section className="w-full py-2">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">

        <div>
          <h2 className="text-[16px] font-semibold text-[#1B1B1B]">
            Shop by categories
          </h2>
        </div>

        

      </div>

      {/* Categories */}
      <div className="grid grid-cols-4 gap-3">

        {categories.map((item, index) => (

          <div
            key={index}
            className="flex flex-col items-center cursor-pointer group"
          >

            {/* Circle */}
            <div
              className={`w-[74px] h-[50px] rounded-[6px] ${item.bg} flex items-center justify-center shadow-sm group-hover:scale-105 transition duration-300`}
            >

              <Image
                src={item.image}
                alt={item.title}
                width={90}
                height={100}
                className="object-contain"
              />

            </div>

            {/* Text */}
            <p className="mt-2 text-[11px] leading-[14px] font-medium text-center text-[#333] max-w-[70px]">
              {item.title}
            </p>

          </div>

        ))}

      </div>

    </section>
  )
}