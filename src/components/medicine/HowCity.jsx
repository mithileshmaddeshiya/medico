"use client";

import { Upload, CheckCircle, Truck } from "lucide-react";

/**
 * Icon per step, positionally: step 1 uploads, step 2 confirms, step 3 delivers.
 *
 * Components, not rendered elements, and hoisted out of the component. As an
 * array of JSX *elements* built inside the map callback, this was three
 * elements in an array literal — which is what React needs `key` on, and what
 * eslint was failing the build on. It also rebuilt all three on every step just
 * to use one.
 *
 * A step beyond the third falls back to the first icon rather than rendering
 * nothing, so adding a fourth step to a city's data cannot produce a card with
 * an empty circle.
 */
const STEP_ICONS = [Upload, CheckCircle, Truck];

export default function HowItWorks({ data }) {
  return (
    <section className="py-5 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-xl md:text-3xl font-bold text-gray-900 leading-snug">
          {data?.howItWorks?.heading}
        </h2>

        <p className="text-sm md:text-base text-gray-600 mt-2 max-w-xl mx-auto">
          {data?.howItWorks?.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 mt-5">

          {data?.howItWorks?.steps?.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? STEP_ICONS[0];

            const Card = (
              <div className="bg-green-50 rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-auto bg-white rounded-full shadow mb-3 md:mb-4">
                  <Icon aria-hidden className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                </div>

                <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                  {step.title}
                </h3>

                <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">
                  {step.desc}
                </p>
              </div>
            );

            return step.link ? (
              <a
                key={index}
                href={step.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {Card}
              </a>
            ) : (
              <div key={index}>{Card}</div>
            );
          })}

        </div>

      </div>
    </section>
  );
}