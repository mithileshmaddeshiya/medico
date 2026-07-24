import { url } from "@/lib/site";

export const metadata = {
  title:
    "Terms & Conditions - MedicoBharat | Healthcare & Medicine Support",

  description:
    "Read the Terms & Conditions of MedicoBharat regarding healthcare support, medicine ordering assistance, website usage, and customer responsibilities.",

  keywords: [
    "MedicoBharat terms",
    "medicine delivery terms",
    "online pharmacy conditions",
    "healthcare website terms",
    "medicine ordering policy",
  ],

  alternates: {
    canonical: url("/terms"),
  },

  authors: [{ name: "MedicoBharat" }],

  publisher: "MedicoBharat",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title:
      "Terms & Conditions - MedicoBharat | Healthcare & Medicine Support",

    description:
      "Read the official Terms & Conditions of MedicoBharat related to medicine support, healthcare assistance, and website usage.",

    url: url("/terms"),

    siteName: "MedicoBharat",

    type: "website",
  },
};

export default function Page() {
  return (
    <section className="w-full overflow-hidden bg-gradient-to-b from-white to-green-50/30 py-20  px-4">
      <div className="space-y-6 max-w-6xl mx-auto">

        {/* INTRODUCTION */}
        <div className="group rounded-3xl border border-green-100 bg-white p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300">

          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center">
              <span className="font-bold text-green-600">01</span>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              Introduction
            </h2>
          </div>

          <p className="text-sm md:text-base leading-8 text-gray-600">
            These Terms & Conditions govern the use of MedicoBharat. By
            accessing or using the platform, customers agree to comply with
            these terms, applicable laws, prescription requirements, and
            platform policies.
          </p>
        </div>

        {/* TRUST BADGES */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-center">
            <div className="text-2xl mb-2">🔒</div>
            <p className="font-semibold text-sm text-gray-800">
              Secure Platform
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-center">
            <div className="text-2xl mb-2">💊</div>
            <p className="font-semibold text-sm text-gray-800">
              Medicine Support
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-center">
            <div className="text-2xl mb-2">📄</div>
            <p className="font-semibold text-sm text-gray-800">
              Prescription Verification
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-center">
            <div className="text-2xl mb-2">📞</div>
            <p className="font-semibold text-sm text-gray-800">
              Customer Support
            </p>
          </div>

        </div>

        {/* ROLE */}

        <div className="group rounded-3xl border border-green-100 bg-white p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300">

          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center">
              <span className="font-bold text-green-600">02</span>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              Role of MedicoBharat
            </h2>
          </div>

          <p className="text-sm md:text-base leading-8 text-gray-600">
            MedicoBharat operates as a technology-enabled medicine ordering
            and delivery assistance platform. Medicines are supplied,
            invoiced, and fulfilled by independent licensed pharmacy
            partners. MedicoBharat does not provide medical diagnosis,
            treatment, prescriptions, or healthcare consultation services.
          </p>
        </div>

        {/* WEBSITE USAGE */}

        <div className="group rounded-3xl border border-green-100 bg-white p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300">

          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center">
              <span className="font-bold text-green-600">03</span>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              Website Usage
            </h2>
          </div>

          <p className="text-sm md:text-base leading-8 text-gray-600">
            Users are expected to use MedicoBharat responsibly, lawfully,
            and in accordance with applicable healthcare regulations. Any
            misuse of the platform, fraudulent activity, or submission of
            false information may result in suspension or rejection of
            services.
          </p>
        </div>

        {/* PRESCRIPTION */}

        <div className="group rounded-3xl border border-green-100 bg-white p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300">

          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center">
              <span className="font-bold text-green-600">04</span>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              Prescription Medicines
            </h2>
          </div>

          <p className="text-sm md:text-base leading-8 text-gray-600">
            Certain medicines require a valid prescription issued by a
            registered medical practitioner. Customers are responsible for
            providing authentic and accurate prescriptions whenever
            required. Orders may be declined if prescription requirements
            are not fulfilled.
          </p>
        </div>

        {/* DISCLAIMER */}

        <div className="group rounded-3xl border border-green-100 bg-white p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300">

          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center">
              <span className="font-bold text-green-600">05</span>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              Medical Disclaimer
            </h2>
          </div>

          <p className="text-sm md:text-base leading-8 text-gray-600">
            Information available on MedicoBharat is intended for general
            informational purposes only and should not be considered
            medical advice, diagnosis, or treatment. Customers should seek
            professional medical guidance from qualified healthcare
            providers regarding any health condition or medication.
          </p>
        </div>

        {/* RESPONSIBILITIES */}

        <div className="group rounded-3xl border border-green-100 bg-white p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300">

          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center">
              <span className="font-bold text-green-600">06</span>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              Customer Responsibilities
            </h2>
          </div>

          <ul className="space-y-4">

            <li className="flex gap-3">
              <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span>Provide accurate contact, address and delivery details</span>
            </li>

            <li className="flex gap-3">
              <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span>Submit valid prescriptions where legally required</span>
            </li>

            <li className="flex gap-3">
              <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span>Ensure medicines are ordered only for lawful purposes</span>
            </li>

            <li className="flex gap-3">
              <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span>Verify dosage instructions with healthcare professionals</span>
            </li>

          </ul>

        </div>

        {/* ORDER ACCEPTANCE */}

        <div className="rounded-3xl border border-green-100 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-4">
            Order Acceptance & Fulfillment
          </h2>

          <p className="text-sm md:text-base leading-8 text-gray-600">
            Order placement does not guarantee acceptance. Orders may be
            modified, delayed, or cancelled due to medicine availability,
            prescription verification, operational limitations, pricing
            errors, or legal compliance requirements.
          </p>
        </div>

        {/* SERVICE */}

        <div className="rounded-3xl border border-green-100 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-4">
            Service Availability
          </h2>

          <p className="text-sm md:text-base leading-8 text-gray-600">
            Services may vary depending on location, medicine availability,
            delivery coverage, prescription requirements, and operational
            limitations.
          </p>
        </div>

        {/* LIABILITY */}

        <div className="rounded-3xl border border-red-100 bg-red-50 p-6 md:p-8 shadow-sm">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-4">
            Limitation of Liability
          </h2>

          <p className="text-sm md:text-base leading-8 text-gray-700">
            To the maximum extent permitted by law, MedicoBharat shall not
            be liable for indirect losses, medicine unavailability,
            third-party delivery delays, prescription verification
            outcomes, or customer misuse of medicines.
          </p>
        </div>

        {/* CONTACT */}

        <div className="rounded-3xl bg-gradient-to-r from-green-600 to-green-500 p-8 text-white shadow-xl">

          <h2 className="text-2xl md:text-3xl font-black mb-6">
            Contact Information
          </h2>

          <div className="space-y-3 text-green-50">

            <p>📞 +91 989-123-3525</p>

            <p>✉️ support@medicobharat.com</p>

            <p>🌐 https://www.medicobharat.com</p>

          </div>

        </div>

      </div>

    </section>
  );
}