'use client'

import { Phone, Mail, MapPin } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-10">

      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-4">

        {/* BRAND */}
        <div className="flex flex-col items-start">

          <Image
            src="/navbar/navbg.webp"
            alt="MedicoBharat Logo"
            width={140}
            height={40}
            className="object-contain cursor-pointer mb-4"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />

          <p className="text-[15px] text-gray-600 leading-relaxed">
            MedicoBharat provides trusted online medicine delivery in Deoria
            with fast doorstep delivery, genuine medicines and easy online
            ordering support.
          </p>

        </div>

        {/* SEO LINKS */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Popular Searches
          </h4>

          <ul className="space-y-2 text-sm text-gray-600">

            <li>
              <a
                href="/medicine-delivery-deoria"
                className="hover:text-green-600 transition"
              >
                Online Medicine Delivery in Deoria
              </a>
            </li>

            <li>
              <a
                href="/medicine-delivery-deoria"
                className="hover:text-green-600 transition"
              >
                Medicine Home Delivery Deoria
              </a>
            </li>

            <li>
              <a
                href="/medicine-delivery-deoria"
                className="hover:text-green-600 transition"
              >
                Online Pharmacy Deoria
              </a>
            </li>

            <li>
              <a
                href="/medicine-delivery-deoria"
                className="hover:text-green-600 transition"
              >
                Medical Store in Deoria
              </a>
            </li>

            <li>
              <a
                href="/medicine-delivery-deoria"
                className="hover:text-green-600 transition"
              >
                24x7 Medicine Delivery Deoria
              </a>
            </li>

          </ul>
        </div>

        {/* WHY CHOOSE */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Why Choose Us
          </h4>

          <ul className="space-y-2 text-sm text-gray-600">
            <li>✔ Genuine Medicines</li>
            <li>✔ Fast Doorstep Delivery</li>
            <li>✔ Trusted Online Pharmacy</li>
            <li>✔ Easy Prescription Upload</li>
            <li>✔ Customer Support</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Contact
          </h4>

          <div className="space-y-3 text-sm text-gray-600">

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-600" />
              <span>+91 6392108234</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-600" />
              <span>medicobharat@gmail.com</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span>Deoria, Uttar Pradesh</span>
            </div>

          </div>
        </div>

      </div>

      {/* LOCAL SEO TEXT */}
      <div className="max-w-3xl mx-auto px-6 pb-5 text-center text-[12px] text-gray-500 leading-relaxed">
        MedicoBharat offers fast online medicine delivery in Deoria,
        medicine home delivery services, healthcare products,
        prescription medicines and trusted pharmacy support across
        Civil Lines, Station Road, Saket Nagar, Rudrapur Road and nearby areas.
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MedicoBharat | All rights reserved.
      </div>

    </footer>
  )
}