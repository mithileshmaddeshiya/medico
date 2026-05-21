"use client"

import {
  HeartPulse,
  ShieldPlus,
  Pill,
  Activity,
} from "lucide-react"

const categories = [
  {
    title: "Personal Care",
    icon: ShieldPlus,
    bg: "bg-[#EEF4FF]",
    color: "text-[#3B82F6]",
  },
  {
    title: "Health Conditions",
    icon: HeartPulse,
    bg: "bg-[#FFF6E9]",
    color: "text-[#F59E0B]",
  },
  {
    title: "Vitamins & Supplements",
    icon: Pill,
    bg: "bg-[#EEFCEB]",
    color: "text-[#22C55E]",
  },
  {
    title: "Diabetes Care",
    icon: Activity,
    bg: "bg-[#FFF1F1]",
    color: "text-[#EF4444]",
  },
]

export default function ShopCategories() {
  return (
    <section className="w-full py-2">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[16px] font-semibold text-[#1B1B1B]">
          Shop by categories
        </h2>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-4 gap-3">

        {categories.map((item, index) => {
          const Icon = item.icon

          return (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer group"
            >

              <a
                href="https://wa.me/919891233525"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-[74px] h-[56px] rounded-[6px] ${item.bg}
                flex items-center justify-center
                shadow-sm hover:shadow-md
                transition-all duration-300
                group-hover:-translate-y-1`}
              >

                <Icon
                  size={28}
                  strokeWidth={2.2}
                  className={`${item.color}`}
                />

              </a>

              <p className="mt-2 text-[11px] leading-[14px] font-medium text-center text-[#333] max-w-[70px]">
                {item.title}
              </p>

            </div>
          )
        })}

      </div>

    </section>
  )
}