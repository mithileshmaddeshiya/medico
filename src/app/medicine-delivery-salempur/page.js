import SalempurMedicineLanding from '@/components/SalempurData';
import React from 'react'

export async function generateMetadata() {
  return {
    title:
      "Online Medicine Delivery in Salempur | Fast Pharmacy Delivery - MedicoBharat",

    description:
      "Order genuine medicines online in Salempur with fast doorstep delivery, prescription medicine support, healthcare products, wellness essentials, and trusted pharmacy services from MedicoBharat.",

    keywords: [
      // PRIMARY SEO
      "Online Medicine Delivery in Salempur",
      "Medicine Delivery Salempur",
      "Medicine Home Delivery Salempur",
      "Online Pharmacy Salempur",
      "Medical Store in Salempur",
      "Chemist Home Delivery Salempur",

      // HIGH INTENT
      "Buy Medicines Online Salempur",
      "Prescription Medicine Delivery Salempur",
      "24x7 Medicine Delivery Salempur",
      "Emergency Medicine Delivery Salempur",
      "Fast Medicine Delivery Salempur",
      "Online Medical Store Salempur",

      // TRUST & BRAND
      "Genuine Medicines in Salempur",
      "Trusted Pharmacy in Salempur",
      "Healthcare Products Salempur",
      "Doorstep Medicine Delivery",
      "Best Pharmacy in Salempur",
      "Medicine Near Me Salempur",

      // LOCAL SEO
      "Medicine Delivery Salempur Bazar",
      "Medicine Delivery Lar Road",
      "Online Pharmacy Salempur Market",
      "Medical Store Near Salempur Railway Station",
      "Medicine Delivery Nearby Villages Salempur",

      // SEMANTIC SEO
      "Order Medicines Online",
      "Healthcare Delivery Service",
      "Online Chemist Shop",
      "Medicine Order on WhatsApp",
      "Wellness Products Salempur",
    ],

    authors: [{ name: "MedicoBharat" }],

    creator: "MedicoBharat",

    publisher: "MedicoBharat",

    metadataBase: new URL("https://www.medicobharat.com"),

    robots: {
      index: false,
      follow: false,

      googleBot: {
        index: false,
        follow: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    alternates: {
      canonical:
        "https://www.medicobharat.com/medicine-delivery-salempur",
    },

    openGraph: {
      title:
        "Online Medicine Delivery in Salempur | MedicoBharat",

      description:
        "Fast online pharmacy and medicine home delivery service in Salempur with genuine medicines, healthcare products, prescription support, and doorstep delivery.",

      url:
        "https://www.medicobharat.com/medicine-delivery-salempur",

      siteName: "MedicoBharat",

      locale: "en_IN",

      type: "website",

      images: [
        {
          url: "/images/salempur-medicobharat.jpg",

          width: 1200,

          height: 630,

          alt:
            "Online Medicine Delivery in Salempur - MedicoBharat",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title:
        "Medicine Delivery in Salempur | MedicoBharat",

      description:
        "Order medicines online in Salempur with fast doorstep delivery and trusted pharmacy support.",

      images: ["/images/salempur-medicobharat.jpg"],
    },

    category: "Healthcare",

    classification:
      "Online Pharmacy & Medicine Delivery",

    other: {
      locality: "Salempur",
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
        "name": "How fast is medicine delivery in Salempur?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most medicine orders in Salempur are delivered within 30 to 90 minutes depending on medicine availability and location."
        }
      },
      {
        "@type": "Question",
        "name": "Can I order prescription medicines online in Salempur?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, customers can upload valid doctor prescriptions and order prescription medicines online in Salempur."
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
        "name": "Is medicine delivery available in nearby villages of Salempur?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, medicine delivery support is available in Salempur and nearby villages depending on service availability."
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

      <SalempurMedicineLanding />
    </div>
  )
}

export default page