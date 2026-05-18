import {
  Phone,
  Mail,
  ShieldCheck,
  Clock3,
} from "lucide-react";

import { FaWhatsapp } from "react-icons/fa";

export const metadata = {
  title:
    "Contact MedicoBharat | Medicine Support & Customer Assistance",

  description:
    "Contact MedicoBharat for medicine support, healthcare assistance, and customer service. Reach us through WhatsApp, phone, or email for quick support across India.",

  keywords: [
    "Contact MedicoBharat",
    "medicine support",
    "customer assistance",
    "online medicine help",
    "healthcare support India",
    "medicine delivery support",
    "online pharmacy contact",
  ],

  alternates: {
    canonical: "https://medicobharat.com/contact",
  },

  authors: [{ name: "MedicoBharat" }],

  publisher: "MedicoBharat",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title:
      "Contact MedicoBharat | Medicine Support & Customer Assistance",

    description:
      "Get in touch with MedicoBharat for medicine ordering support, healthcare assistance, and customer service.",

    url: "https://medicobharat.com/contact",

    siteName: "MedicoBharat",

    type: "website",
  },
};


export default function Page() {
  return (
    <section className="w-full overflow-hidden bg-gradient-to-b from-white to-green-50/30 py-20 md:pt-23 px-4">

      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <div className="relative text-center max-w-3xl mx-auto mb-6 md:mb-8">

          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-52 h-52 rounded-full bg-green-100/40 blur-3xl"></div>

          <span className="relative inline-flex items-center rounded-full border border-green-200 bg-white px-4 py-1.5 text-xs md:text-sm font-semibold text-green-700 shadow-sm mb-3">
            Trusted Customer Support
          </span>

          <h1 className="relative text-3xl sm:text-4xl md:text-[42px] font-black tracking-tight text-gray-900 leading-tight">

            Contact{" "}

            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              MedicoBharat
            </span>

          </h1>

          <p className="relative mt-3 text-sm sm:text-base md:text-lg leading-7 text-gray-600">
            Reach out for medicine support, prescription assistance, healthcare
            guidance, and reliable customer service.
          </p>

        </div>

        {/* CONTACT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 md:mb-8">

          {/* WHATSAPP */}
          <div className="group relative overflow-hidden rounded-[28px] border border-green-100 bg-white p-4 md:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-green-100 blur-3xl opacity-30"></div>

            <div className="relative">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#25D366]/10 mb-4">
                <FaWhatsapp className="h-6 w-6 text-[#25D366]" />
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-2">
                WhatsApp Support
              </h2>

              <p className="text-sm text-gray-600 leading-6 mb-4">
                Connect instantly with our support team for medicine and
                healthcare assistance.
              </p>

              <a
                href="https://wa.me/917303995446"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90"
              >
                Chat Now
              </a>

            </div>
          </div>

          {/* PHONE */}
          <div className="group relative overflow-hidden rounded-[28px] border border-green-100 bg-white p-4 md:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-green-100 blur-3xl opacity-30"></div>

            <div className="relative">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 mb-4">
                <Phone className="h-5 w-5 text-green-600" />
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Phone Support
              </h2>

              <p className="text-sm text-gray-600 leading-6 mb-4">
                Get quick assistance and customer support for medicine-related
                queries.
              </p>

              <a
                href="tel:+917303995446"
                className="text-green-600 font-semibold text-sm hover:underline"
              >
                +91 7303995446
              </a>

            </div>
          </div>

          {/* EMAIL */}
          <div className="group relative overflow-hidden rounded-[28px] border border-green-100 bg-white p-4 md:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:col-span-2 lg:col-span-1">

            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-green-100 blur-3xl opacity-30"></div>

            <div className="relative">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 mb-4">
                <Mail className="h-5 w-5 text-green-600" />
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Email Support
              </h2>

              <p className="text-sm text-gray-600 leading-6 mb-4">
                Send your queries and healthcare assistance requests through
                email.
              </p>

              <a
                href="mailto:support@medicobharat.com"
                className="text-green-600 font-semibold text-sm break-all hover:underline"
              >
                support@medicobharat.com
              </a>

            </div>
          </div>

        </div>

        {/* INFO SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 md:mb-8">

          {/* LEFT */}
          <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3 mb-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100">
                <ShieldCheck className="h-5 w-5 text-green-600" />
              </div>

              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Customer Assistance
              </h2>

            </div>

            <p className="text-sm text-gray-600 leading-7 mb-4">
              MedicoBharat focuses on delivering reliable healthcare and
              medicine support with a customer-first experience.
            </p>

            <ul className="space-y-2 text-sm text-gray-700">

              <li>• Online medicine ordering assistance</li>

              <li>• Prescription support and guidance</li>

              <li>• Healthcare product support</li>

              <li>• Fast customer response</li>

            </ul>

          </div>

          {/* RIGHT */}
          <div className="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 to-white p-5 shadow-sm">

            <div className="flex items-center gap-3 mb-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100">
                <Clock3 className="h-5 w-5 text-green-600" />
              </div>

              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Support Availability
              </h2>

            </div>

            <div className="space-y-4 text-sm text-gray-700">

              <div>
                <p className="font-semibold text-gray-900">
                  Support Hours
                </p>

                <p className="text-gray-600 mt-1">
                  Monday to Sunday
                </p>

                <p className="text-gray-600">
                  8:00 AM – 10:00 PM
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  Reliable Assistance
                </p>

                <p className="text-gray-600 mt-1 leading-6">
                  Fast and responsive support for healthcare and medicine
                  related queries.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* TRUST SECTION */}
        <div className="relative overflow-hidden rounded-[8px] bg-gradient-to-r from-green-600 to-green-500 px-5 py-6 md:px-8 md:py-7 text-center text-white shadow-lg">

          <div className="absolute inset-0 opacity-20">

            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>

            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>

          </div>

          <div className="relative">

            <h2 className="text-2xl md:text-4xl font-black leading-tight mb-3">
              Reliable Healthcare Support You Can Trust
            </h2>

            <p className="max-w-3xl mx-auto text-sm md:text-base leading-7 text-green-50">
              MedicoBharat delivers a smooth, responsive, and customer-friendly
              healthcare experience with genuine medicine assistance.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}