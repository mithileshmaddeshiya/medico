"use client";

import { Upload, CheckCircle, Truck } from "lucide-react";

export default function HowItWorks({ data }) {

  const steps = [
    {
      icon: <Upload className="w-5 h-5 md:w-6 md:h-6 text-green-600" />,
      title: "Send Prescription",
      desc: "Medicine name ya prescription WhatsApp par bhejein",
      link: "https://wa.me/919891233525",
    },
    {
      icon: <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />,
      title: "Order Confirm",
      desc: "Hum price aur availability confirm karte hain",
    },
    {
      icon: <Truck className="w-5 h-5 md:w-6 md:h-6 text-green-600" />,
      title: "Fast Delivery",
      desc: "30–60 min me ghar tak delivery",
    },
  ];

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
            const icons = [
              <Upload className="w-5 h-5 md:w-6 md:h-6 text-green-600" />,
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />,
              <Truck className="w-5 h-5 md:w-6 md:h-6 text-green-600" />,
            ];

            const Card = (
              <div className="bg-green-50 rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-auto bg-white rounded-full shadow mb-3 md:mb-4">
                  {icons[index]}
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