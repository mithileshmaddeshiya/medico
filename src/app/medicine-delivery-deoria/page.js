import PremiumCitySlider from '@/components/cityData'
import FAQDeoria from '@/components/CityFaq'
import HeroImage from '@/components/CityHero'
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
      "Online Medicine Delivery in Deoria | MedicoBharat",

    description:
      "MedicoBharat provides fast online medicine delivery in Deoria with genuine medicines, prescription support, healthcare products, and doorstep pharmacy delivery services across Deoria.",

    keywords: [
      // PRIMARY KEYWORDS
      "Online Medicine Delivery in Deoria",
      "Medicine Delivery Deoria",
      "Medicine Home Delivery Deoria",
      "Online Pharmacy Deoria",
      "Medical Store in Deoria",
      "Chemist Home Delivery Deoria",

      // HIGH INTENT KEYWORDS
      "Buy Medicines Online Deoria",
      "Prescription Medicine Delivery Deoria",
      "24x7 Medicine Delivery Deoria",
      "Pharmacy Delivery in Deoria",
      "Medicine Delivery Near Me Deoria",
      "Online Medical Store Deoria",

      // TRUST & SUPPORT KEYWORDS
      "Genuine Medicines in Deoria",
      "Trusted Pharmacy Support",
      "Fast Medicine Delivery Deoria",
      "Healthcare Products Deoria",
      "Doorstep Medicine Delivery",
      "Best Pharmacy in Deoria",

      // LOCAL SEO KEYWORDS
      "Medicine Delivery Civil Lines Deoria",
      "Medicine Delivery Station Road Deoria",
      "Online Pharmacy Saket Nagar Deoria",
      "Medical Store Rudrapur Road Deoria",
    ],

    authors: [{ name: "MedicoBharat" }],

    creator: "MedicoBharat",

    publisher: "MedicoBharat",

    metadataBase: new URL("https://www.medicobharat.com"),

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    alternates: {
      canonical:
        "https://www.medicobharat.com/medicine-delivery-deoria",
    },

    openGraph: {
      title:
        "Online Medicine Delivery in Deoria | MedicoBharat",

      description:
        "Order genuine medicines online in Deoria with fast doorstep delivery, prescription support, healthcare products, and trusted pharmacy assistance.",

      url:
        "https://www.medicobharat.com/medicine-delivery-deoria",

      siteName: "MedicoBharat",

      locale: "en_IN",

      type: "website",

      images: [
        {
          url: "/images/deoria-medicobharat.jpg",

          width: 1200,

          height: 630,

          alt:
            "Online Medicine Delivery in Deoria - MedicoBharat",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title:
        "Online Medicine Delivery in Deoria | MedicoBharat",

      description:
        "Fast online pharmacy and medicine home delivery service in Deoria with genuine medicines and healthcare support.",

      images: ["/images/deoria-medicobharat.jpg"],
    },

    category: "Healthcare",

    classification:
      "Online Pharmacy & Medicine Delivery",

    other: {
      locality: "Deoria",
      region: "Uttar Pradesh",
      country: "India",
    },
  };
}

const page = () => {

  let FaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How fast is medicine delivery in Deoria?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most medicine orders in Deoria are delivered within 30 to 90 minutes depending on medicine availability and location."
        }
      },
      {
        "@type": "Question",
        "name": "Can I order prescription medicines online in Deoria?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, customers can upload valid doctor prescriptions and order prescription medicines online in Deoria."
        }
      },
      {
        "@type": "Question",
        "name": "Does MedicoBharat provide genuine medicines?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, MedicoBharat provides genuine medicines and healthcare products through trusted pharmacy partners."
        }
      },
      {
        "@type": "Question",
        "name": "Is medicine delivery available in nearby villages of Deoria?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, medicine delivery support is available in Deoria and nearby villages depending on service availability."
        }
      }
    ]
  }

  return (
    <div>

      {/* FAQ SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(FaqSchema),
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
