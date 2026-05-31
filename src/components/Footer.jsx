'use client'

import { Phone, Mail, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link";

export default function Footer({ data }) {

  const city = data?.city || "Deoria";



  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-10">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

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

          <p className="text-sm text-gray-600 leading-7">
            MedicoBharat provides trusted online medicine delivery in {city} <br />
            with fast doorstep delivery, genuine medicines, and easy online
            ordering support.
          </p>

        </div>

        {/* SEO LINKS */}
        <div>

          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Popular Searches
          </h4>

          <ul className="space-y-2 text-sm text-gray-600">

            <li>
              <Link
                href="/"
                className="hover:text-green-600 transition"
              >
                Medicine Home Delivery {city}
              </Link>
            </li>

            <li>
              <Link
                href="/"
                className="hover:text-green-600 transition"
              >
                Online Pharmacy {city}
              </Link>
            </li>

            <li>
              <Link
                href="/"
                className="hover:text-green-600 transition"
              >
                Medical Store in {city}
              </Link>
            </li>

            <li>
              <Link
                href="/"
                className="hover:text-green-600 transition"
              >
                24x7 Medicine Delivery {city}
              </Link>
            </li>

          </ul>

        </div>

        {/* QUICK LINKS */}
        <div>

          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Quick Links
          </h4>

          <ul className="space-y-2 text-sm text-gray-600">

            <li>
              <a
                href="/"
                className="hover:text-green-600 transition"
              >
                Home
              </a>
            </li>

            <li>
              <a
                href="/about"
                className="hover:text-green-600 transition"
              >
                About Us
              </a>
            </li>

            <li>
              <a
                href="/contact"
                className="hover:text-green-600 transition"
              >
                Contact
              </a>
            </li>

            <li>
              <a
                href="/privacy"
                className="hover:text-green-600 transition"
              >
                Privacy Policy
              </a>
            </li>

            <li>
              <a
                href="/terms"
                className="hover:text-green-600 transition"
              >
                Terms & Conditions
              </a>
            </li>

          </ul>

        </div>

        {/* CONTACT */}
        <div>

          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Contact
          </h4>

          <div className="space-y-3 text-sm text-gray-600">

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-600 shrink-0" />
              <span>+91 9891233525</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-600 shrink-0" />
              <span className="break-all">
                medicobharat@gmail.com
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600 shrink-0" />
              <span>{city}, Uttar Pradesh</span>
            </div>

          </div>

        </div>

      </div>

      {/* LOCAL SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-5 text-center text-[12px] text-gray-500 leading-6">

        MedicoBharat offers fast online medicine delivery in {city},
        medicine home delivery services, healthcare products,
        prescription medicines, and trusted pharmacy support across
        Civil Lines, Station Road, Saket Nagar, Rudrapur Road,
        and nearby areas.

      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500 px-4">

        © {new Date().getFullYear()} Medicobharat | Orders are fulfilled by licensed pharmacy partners | All rights reserved.

      </div>

    </footer>
  )
}