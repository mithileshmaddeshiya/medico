'use client'

import { Phone, Mail, MapPin } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-10">

      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3">

        {/* BRAND */}
        <div>
          <Image
            src="/navbar/navbg.png"
            alt="MedicoBharat Logo"
            width={140}
            height={40}
            className="object-contain"
          />

          <p className="mt-3 text-[16px] text-gray-600 leading-relaxed">
            Trusted medicine delivery service in Deoria.
            Order easily via WhatsApp and get medicines delivered to your doorstep.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Quick Links
          </h4>

          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-green-600">Home</a></li>
            <li><a href="#how" className="hover:text-green-600">How it Works</a></li>
            <li><a href="#contact" className="hover:text-green-600">Contact</a></li>
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
              <span>mithileshmaddeshiya123@gmail.com</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span>Deoria, Uttar Pradesh</span>
            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Medicobharat | All rights reserved .
      </div>

    </footer>
  )
}