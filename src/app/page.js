import BannerImage from '@/components/BannerImage'
import FinalCTA from '@/components/Cta'
import FAQ from '@/components/Faq'
import Hero from '@/components/Hero'
import TrustSection from '@/components/HowWork'
import Reviews from '@/components/Review'
import React from 'react'

export async function generateMetadata() {
  return {
    title:
      "Online Medicine Delivery in Deoria | Fast Medicine Home Delivery",

    description:
      "Order medicines online in Deoria with fast home delivery. MedicoBharat provides genuine medicines, trusted pharmacy services, healthcare products and quick doorstep medicine delivery.",

    keywords: [
      "Online Medicine Delivery",
      "Medicine Home Delivery",
      "Online Pharmacy",
      "Best Pharmacy in Deoria",
      "Medical Store Near Me",
      "Medicine Delivery Deoria",
      "Buy Medicines Online",
      "Healthcare Products",
      "Prescription Medicines",
      "Fast Medicine Delivery",
      "Trusted Pharmacy",
      "OTC Medicines",
      "Online Medical Store",
      "Medicine Delivery Near Me",
      "24x7 Medicine Delivery",
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
      canonical: "https://www.medicobharat.com",
    },

    openGraph: {
      title:
        "Online Medicine Delivery | MedicoBharat",
      description:
        "Fast and trusted online medicine delivery service with genuine medicines and healthcare products.",
      url: "https://www.medicobharat.com",
      siteName: "MedicoBharat",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "/images/medicobharat-home.jpg",
          width: 1200,
          height: 630,
          alt: "MedicoBharat Online Medicine Delivery",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title:
        "Online Medicine Delivery | MedicoBharat",
      description:
        "Trusted online pharmacy and fast medicine home delivery service.",
      images: ["/images/medicobharat-home.jpg"],
    },
  };
}

const page = () => {
  return (
    <div>
      <Hero />
      <TrustSection />
      <BannerImage />
      <Reviews />
      <FinalCTA />
      <FAQ />
    </div>
  )
}

export default page