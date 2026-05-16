"use client";

import { useState } from "react";

export default function DeoriaLongSEOContent() {
  const [showMore, setShowMore] = useState(false);

  const features = [
    "100% genuine medicines from trusted pharmacy partners",
    "Fast medicine delivery support in Deoria",
    "Easy prescription upload and ordering process",
    "Trusted healthcare products and wellness essentials",
    "Simple and customer-friendly experience",
  ];

  const benefits = [
    "Save time with doorstep delivery",
    "Avoid visiting multiple medical stores physically",
    "Easy healthcare product access",
    "Reliable medicine ordering support",
    "Trusted online pharmacy experience",
  ];

  return (
    <section className="w-full bg-gradient-to-b from-white via-green-50/30 to-white py-2 md:py-5 overflow-hidden">
      <div className="bg-white border border-green-100 rounded-[28px] p-6 sm:p-10 shadow-sm hover:shadow-lg transition-all duration-300 mb-10">

        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Best Online Pharmacy & Medicine Delivery in Deoria
        </h2>

        <div className="space-y-5 text-gray-700 text-sm sm:text-base leading-relaxed">

          <p>
            MedicoBharat is one of the trusted platforms for online medicine delivery in Deoria.
            Customers searching for medicine home delivery in Deoria, online pharmacy in Deoria,
            medical store near me or fast medicine delivery services can easily order medicines online
            through MedicoBharat.
          </p>

          <p>
            The platform helps customers order prescription medicines, OTC medicines, healthcare
            products, baby care products, wellness supplements and daily healthcare essentials
            online with doorstep delivery support.
          </p>

          <p>
            MedicoBharat provides fast online medicine delivery across Civil Lines, Station Road,
            Malviya Road, Raghav Nagar, Saket Nagar, Hanuman Mandir Area, Rudrapur Road,
            Subhash Chowk and nearby areas of Deoria.
          </p>

          <p>
            Customers looking for trusted medical stores in Deoria can upload prescriptions online,
            search medicines easily and place medicine orders from home without visiting multiple
            pharmacy stores physically.
          </p>

          <p>
            Online medicine ordering helps save time and provides easy access to healthcare products,
            genuine medicines and wellness essentials. MedicoBharat focuses on customer-friendly
            service, fast support and reliable medicine delivery experience in Deoria.
          </p>

          <p>
            Many customers search for 24x7 medicine delivery in Deoria, emergency medicine delivery,
            online pharmacy near me and medicine delivery near railway station area. MedicoBharat
            aims to provide trusted online pharmacy support and convenient medicine ordering
            experience for customers in Deoria and nearby locations.
          </p>

        </div>
      </div>
    </section>
  );
}