import PremiumCitySlider from '@/components/cityData'
import FAQDeoria from '@/components/CityFaq'
import HeroImage from '@/components/CityHero'
import StatBanner from '@/components/CityStatsimg'
import DeoriaSEOContent from '@/components/ContentPage'
import FinalCTA from '@/components/Cta'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowCity'
import MedicoBharatSEOSection from '@/components/MetakeyDeoria'
import Reviews from '@/components/Review'
import React from 'react'



export async function generateMetadata() {
  return {
    title:
      "Online Medicine Delivery in Deoria | 24x7 Pharmacy - MedicoBharat",

    description:
      "Order genuine medicines online in Deoria with fast home delivery. MedicoBharat offers 24x7 online pharmacy services, prescription medicines, healthcare products, and doorstep medicine delivery in Deoria.",

    keywords: [
      "Online Medicine Delivery in Deoria",
      "Medicine Home Delivery Deoria",
      "Best Pharmacy in Deoria",
      "Online Pharmacy Deoria",
      "Medical Store in Deoria",
      "Buy Medicines Online Deoria",
      "Prescription Medicine Delivery Deoria",
      "24x7 Medicine Delivery Deoria",
      "Healthcare Products Deoria",
      "Fast Medicine Delivery Deoria",
      "Genuine Medicines in Deoria",
      "OTC Medicines Deoria",
      "Deoria Pharmacy",
      "Medicine Delivery Near Me Deoria",
      "Trusted Medical Store Deoria",
    ],

    authors: [{ name: "MedicoBharat" }],

    creator: "MedicoBharat",

    publisher: "MedicoBharat",

    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    alternates: {
      canonical: "https://www.medicobharat.com/medicine-delivery-deoria",
    },

    openGraph: {
      title:
        "Online Medicine Delivery in Deoria | MedicoBharat",
      description:
        "Order genuine medicines online in Deoria with fast doorstep delivery. MedicoBharat offers 24x7 pharmacy and healthcare products.",
      url: "https://www.medicobharat.com/medicine-delivery-deoria",
      siteName: "MedicoBharat",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "/images/deoria-medicobharat.jpg",
          width: 1200,
          height: 630,
          alt: "MedicoBharat Deoria Medicine Delivery",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title:
        "Online Medicine Delivery in Deoria | MedicoBharat",
      description:
        "Trusted online pharmacy and medicine home delivery service in Deoria.",
      images: ["/images/deoria-medicobharat.jpg"],
    },
  };
}

const page = () => {
  return (
    <div>

      {/* FAQ SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",

            mainEntity: [
              {
                "@type": "Question",

                name: "How fast is medicine delivery in Deoria?",

                acceptedAnswer: {
                  "@type": "Answer",

                  text: "Most orders are delivered within 30-60 minutes depending on location.",
                },
              },
            ],
          }),
        }}
      />

      {/* MEDICAL BUSINESS SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",

            "@type": "MedicalBusiness",

            name: "MedicoBharat",

            url: "https://www.medicobharat.com/medicine-delivery-deoria",

            image: "https://www.medicobharat.com/logo.png",

            description:
              "Online medicine delivery service in Deoria with fast doorstep delivery and genuine medicines.",

            telephone: "+916392108234",

            priceRange: "₹₹",

            openingHours: "Mo-Su 00:00-23:59",

            address: {
              "@type": "PostalAddress",

              addressLocality: "Deoria",

              addressRegion: "Uttar Pradesh",

              addressCountry: "IN",
            },

            areaServed: {
              "@type": "City",

              name: "Deoria",
            },

            sameAs: [
              "https://www.instagram.com/medicobharat",
              "https://www.facebook.com/medicobharat",
            ],
          }),
        }}
      />

      <Hero />
      <PremiumCitySlider />
      <HeroImage />
      <Reviews />
      <HowItWorks />
      <MedicoBharatSEOSection />
      <FinalCTA />
      <DeoriaSEOContent />
      <FAQDeoria />

    </div>
  )
}

export default page