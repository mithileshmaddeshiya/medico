

export default function MedicoBharatSEOSection() {
 
  const relatedTerms = [
    "Online Medicine Delivery in Deoria",
    "Best Pharmacy in Deoria",
    "Medicine Home Delivery Deoria",
    "Online Pharmacy Deoria",
    "Medical Store in Deoria",
    "Buy Medicines Online Deoria",
    "Prescription Medicine Delivery Deoria",
    "Healthcare Products Deoria",
    "24x7 Medicine Delivery Deoria",
    "Fast Medicine Delivery Deoria",
    "Genuine Medicines in Deoria",
    "OTC Medicines Deoria",
  ];

  return (
    <section className="w-full py-3 sm:py-5 bg-gradient-to-b from-green-1 via-white to-green-50">
  <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-6">

    {/* Top Heading */}
    <div className="text-center mb-8 sm:mb-10">
      <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
        💚 Trusted Healthcare Partner in Deoria
      </span>

      <h2 className="mt-4 text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
        Fast & Trusted Online Medicine
        <br className="hidden sm:block" />
        Delivery in Deoria
      </h2>
    </div>

    {/* Bottom CTA Section */}
    <div className="bg-white rounded-[24px] sm:rounded-[32px] border border-green-100 p-5 sm:p-6 md:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div className="max-w-3xl">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Popular Searches in Deoria
          </h3>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
            Users frequently search for online pharmacy, medicine home
            delivery aur healthcare products in Deoria.
          </p>

          <div className="flex flex-wrap gap-2">
            {relatedTerms.map((term, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs sm:text-sm font-medium text-green-700 hover:bg-green-100 transition"
              >
                {term}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
            Order Medicines Now
          </button>

          <p className="text-xs sm:text-sm text-center text-gray-500">
            Safe • Genuine • Fast Delivery
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}