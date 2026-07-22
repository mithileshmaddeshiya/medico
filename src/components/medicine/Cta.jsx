'use client'

export default function FinalCTA({ data }) {

  return (
    <section className="py-10 bg-gradient-to-b from-green-20 to-green-50 text-center">

      <div className="max-w-5xl mx-auto px-6">

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {data?.finalCTA?.heading}
        </h2>

        <p className="mt-3 text-gray-600">
          {data?.finalCTA?.description}
        </p>

        <div className="mt-6">
          <a
            href="https://wa.me/919891233525"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Order on WhatsApp"
            className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            {data?.finalCTA?.buttonText}
          </a>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          {data?.finalCTA?.bottomText}
        </p>

      </div>

    </section>
  )
}