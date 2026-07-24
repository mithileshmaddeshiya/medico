"use client";

import Link from "next/link";
import { useState } from "react";

export default function CitySEOContent({ data }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="w-full bg-gradient-to-b from-white via-green-50/30 to-white py-2 md:py-5 overflow-hidden">

      <div className="max-w-6xl mx-auto px-4">

        <div className="bg-white border border-green-100 rounded-[13px] p-6 sm:p-10 shadow-sm hover:shadow-lg transition-all duration-300 mb-10">

          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            {data?.seoContent?.titles?.areas}
          </h3>

          {/* CONTENT */}
          <div
            className={`overflow-hidden transition-all duration-500 ${showMore ? "max-h-[5000px]" : "max-h-[260px]"
              }`}
          >
            <div className="space-y-5 text-gray-700 text-sm sm:text-base leading-relaxed">


              <h3>
                {data?.seoContent?.titles?.benefits}
              </h3>

              <div
                className={`overflow-hidden transition-all duration-500 ${showMore ? "max-h-[5000px]" : "max-h-[260px]"
                  }`}
              >
                <div className="space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed">

                  {/* INTRO */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {data?.seoContent?.titles?.intro}
                    </h3>

                    <p>{data?.seoContent?.intro}</p>
                  </div>

                  {/* SERVICES */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {data?.seoContent?.titles?.customerFocus}
                    </h3>

                    <ul className="grid sm:grid-cols-2 gap-2">
                      {data?.seoContent?.services?.map((service, index) => (
                        <li key={index}>
                          • {service}
                        </li>
                      ))}
                    </ul>

                  </div>

                  {/* AREAS */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {data?.seoContent?.titles?.areas}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {data?.seoContent?.areas?.map((area, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-sm text-blue-700"
                        >
                          {area}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4">
                      MedicoBharat provides medicine ordering support across
                      {" "}
                      {data?.seoContent?.areas?.join(", ")}
                      {" "}
                      and nearby locations in {data?.city}.
                    </p>

                    <div className="mt-10 rounded-xl border p-6">
                      <h2 className="text-xl font-bold mb-4">
                        {data?.seoContent?.titles?.nearby}
                      </h2>

                      <div className="grid md:grid-cols-2 gap-3">

                        <Link href="/medicine-delivery/deoria">
                          Medicine Delivery in Deoria
                        </Link>

                        <Link href="/medicine-delivery/salempur">
                          Medicine Delivery in Salempur
                        </Link>

                        <Link href="/medicine-delivery/bhatni">
                          Medicine Delivery in Bhatni
                        </Link>

                        <Link href="/medicine-delivery/barhaj">
                          Medicine Delivery in Barhaj
                        </Link>

                        <Link href="/medicine-delivery/lar">
                          Medicine Delivery in Lar
                        </Link>

                      </div>
                    </div>
                  </div>

                  {/* BENEFITS */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {data?.seoContent?.titles?.benefits}
                    </h3>

                    <ul className="grid sm:grid-cols-2 gap-2">
                      {data?.seoContent?.benefits?.map((benefit, index) => (
                        <li key={index}>
                          • {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* POPULAR SEARCHES */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {data?.seoContent?.titles?.popularSearch}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {data?.seoSection?.highlights?.map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-green-50 border border-green-200 text-xs text-green-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* EMERGENCY SUPPORT */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {data?.seoContent?.titles?.emergency}
                    </h3>

                    <p>{data?.seoContent?.emergencySupport}</p>
                  </div>

                  {/* PRESCRIPTION */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {data?.seoContent?.titles?.prescription}
                    </h3>

                    <p>{data?.seoContent?.prescriptionSupport}</p>
                  </div>

                  {/* HEALTHCARE PRODUCTS */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {data?.seoContent?.titles?.products}
                    </h3>

                    <p>{data?.seoContent?.healthcareProducts}</p>
                  </div>

                  {/* TRUST */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {data?.seoContent?.titles?.trust}
                    </h3>

                    <p>{data?.seoContent?.trustSection}</p>
                  </div>

                  {/* NEARBY CITIES */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {data?.seoContent?.titles?.onlinePharmacy}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href="/medicine-delivery/salempur"
                        className="px-3 py-1 rounded-full bg-green-50 border border-green-200 text-sm">
                        Salempur
                      </Link>

                      <Link
                        href="/medicine-delivery/bhatni"
                        className="px-3 py-1 rounded-full bg-green-50 border border-green-200 text-sm">
                        Bhatni
                      </Link>

                      <Link
                        href="/medicine-delivery/barhaj"
                        className="px-3 py-1 rounded-full bg-green-50 border border-green-200 text-sm">
                        Barhaj
                      </Link>

                      <Link
                        href="/medicine-delivery/lar"
                        className="px-3 py-1 rounded-full bg-green-50 border border-green-200 text-sm">
                        Lar
                      </Link>

                      <Link
                        href="/medicine-delivery/bhatpar"
                        className="px-3 py-1 rounded-full bg-green-50 border border-green-200 text-sm">
                        Bhatpar Rani
                      </Link>
                    </div>
                  </div>

                  {data?.seoContent?.localHealthcare && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Healthcare Accessibility in Deoria
                      </h3>
                      <p>{data?.seoContent?.localHealthcare}</p>
                    </div>
                  )}

                  {data?.seoContent?.whyOnlinePharmacy && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Why Choose an Online Pharmacy
                      </h3>
                      <p>{data?.seoContent?.whyOnlinePharmacy}</p>
                    </div>
                  )}

                  {data?.seoContent?.medicineCategories && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Medicine & Healthcare Categories
                      </h3>
                      <p>{data?.seoContent?.medicineCategories}</p>
                    </div>
                  )}

                  {data?.seoContent?.customerFocus && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Customer First Approach
                      </h3>
                      <p>{data?.seoContent?.customerFocus}</p>
                    </div>
                  )}

                  {data?.seoContent?.nearbyCities && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Serving Nearby Cities & Towns
                      </h3>
                      <p>{data?.seoContent?.nearbyCities}</p>
                    </div>
                  )}

                  {/* LOCAL HEALTHCARE */}
                  {data?.seoContent?.localHealthcare && (
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        Healthcare Accessibility in Deoria
                      </h3>
                      <p>{data?.seoContent?.localHealthcare}</p>
                    </div>
                  )}

                  {/* WHY ONLINE PHARMACY */}
                  {data?.seoContent?.whyOnlinePharmacy && (
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        Why Choose an Online Pharmacy?
                      </h3>
                      <p>{data?.seoContent?.whyOnlinePharmacy}</p>
                    </div>
                  )}

                  {/* MEDICINE CATEGORIES */}
                  {data?.seoContent?.medicineCategories && (
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        Medicine & Healthcare Categories
                      </h3>
                      <p>{data?.seoContent?.medicineCategories}</p>
                    </div>
                  )}

                  {/* CUSTOMER FOCUS */}
                  {data?.seoContent?.customerFocus && (
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        Customer First Approach
                      </h3>
                      <p>{data?.seoContent?.customerFocus}</p>
                    </div>
                  )}

                  {/* NEARBY CITIES */}
                  {data?.seoContent?.nearbyCities && (
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        Serving Deoria & Nearby Cities
                      </h3>
                      <p>{data?.seoContent?.nearbyCities}</p>
                    </div>
                  )}

                  {/* HEALTHCARE ACCESSIBILITY */}
                  {data?.seoContent?.healthcareAccessibility && (
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        Improving Healthcare Accessibility
                      </h3>
                      <p>{data?.seoContent?.healthcareAccessibility}</p>
                    </div>
                  )}

                  {/* FAMILY HEALTHCARE */}
                  {data?.seoContent?.familyHealthcare && (
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        Healthcare Support for Families
                      </h3>
                      <p>{data?.seoContent?.familyHealthcare}</p>
                    </div>
                  )}

                  {/* FUTURE VISION */}
                  {data?.seoContent?.futureVision && (
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        Our Vision for Healthcare in Deoria
                      </h3>
                      <p>{data?.seoContent?.futureVision}</p>
                    </div>
                  )}


                </div>
              </div>


            </div>

          </div>

          {/* BUTTON */}
          <div className="flex justify-center mt-7">
            <button
              onClick={() => setShowMore(!showMore)}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r cursor-pointer from-green-600 to-emerald-500 px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-emerald-200"
            >
              <span className="relative z-10 flex items-center gap-2">
                {showMore ? "Read Less" : "Read More"}

                <svg
                  className={`h-4 w-4 transition-transform duration-300 ${showMore ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>

              <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
