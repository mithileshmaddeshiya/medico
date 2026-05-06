import FAQDeoria from '@/components/CityFaq'
import HeroImage from '@/components/CityHero'
import StatBanner from '@/components/CityStatsimg'
import DeoriaSEOContent from '@/components/ContentPage'
import FinalCTA from '@/components/Cta'
import HowItWorks from '@/components/HowCity'
import MedicoBharatSEOSection from '@/components/MetakeyDeoria'
import Reviews from '@/components/Review'
import React from 'react'



export async function generateMetadata() {
  return {
    title:
      "Online Medicine Delivery in Deoria | Fast Home Delivery - MedicoBharat",

    description:
      "Order genuine medicines online in Deoria with fast home delivery. MedicoBharat provides trusted pharmacy services, prescription medicines, healthcare products, and 24x7 medicine delivery in Deoria.",

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
      canonical: "https://www.medicobharat.com/deoria",
    },

    openGraph: {
      title:
        "Online Medicine Delivery in Deoria | MedicoBharat",
      description:
        "Fast and trusted medicine delivery service in Deoria. Order genuine medicines, healthcare products, and prescription medicines online with MedicoBharat.",
      url: "https://www.medicobharat.com/deoria",
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
    <div className='pt-25'>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Pharmacy",
            name: "MedicoBharat",
            url: "https://www.medicobharat.com/deoria",
            areaServed: "Deoria",
            description:
              "Online medicine delivery service in Deoria",
          }),
        }}
      />
      <StatBanner />
      <HowItWorks />
      <HeroImage />
      <Reviews />
      <FinalCTA />
      <MedicoBharatSEOSection />
      <DeoriaSEOContent />
      <FAQDeoria />
    </div>
  )
}

export default page