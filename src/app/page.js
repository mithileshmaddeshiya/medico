import BannerImage from '@/components/BannerImage'
import CityInterlinking from '@/components/cityData'
import FinalCTA from '@/components/Cta'
import FAQ from '@/components/Faq'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import TrustSection from '@/components/HowWork'
import Reviews from '@/components/Review'
import React from 'react'
import { homeData } from '@/data/homeData'
import HowItWorks from '@/components/HowCity'
import MedicoBharatSEOSection from '@/components/MetakeyDeoria'
import CitySEOContent from '@/components/ContentPage'


const page = () => {

  const data = homeData;

  
  return (
    <div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Pharmacy",
                "@id": "https://www.medicobharat.com/#pharmacy",
                "name": "MedicoBharat",
                "url": "https://www.medicobharat.com",
                "logo": "https://www.medicobharat.com/images/logo.png",
                "description": data?.description,
                "telephone": "+91-9891233525",
                "priceRange": "₹",
                "image": "https://www.medicobharat.com/images/short/statsimg.webp",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Main Road, Near Chowk",
                  "addressLocality": "Deoria",
                  "addressRegion": "Uttar Pradesh",
                  "postalCode": "274501",
                  "addressCountry": "IN"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "26.5024",
                  "longitude": "83.7781"
                },
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                  ],
                  "opens": "08:00",
                  "closes": "22:00"
                },
                "areaServed": [
                  {
                    "@type": "AdministrativeArea",
                    "name": "Deoria"
                  },
                  {
                    "@type": "AdministrativeArea",
                    "name": "Salempur"
                  },
                  {
                    "@type": "AdministrativeArea",
                    "name": "Bhatni"
                  },
                  {
                    "@type": "AdministrativeArea",
                    "name": "Barhaj"
                  },
                  {
                    "@type": "AdministrativeArea",
                    "name": "Lar"
                  }
                ]
              },
              {
                "@type": "DeliveryService",
                "@id": "https://www.medicobharat.com/#delivery",
                "name": "MedicoBharat Medicine Delivery",
                "provider": {
                  "@id": "https://www.medicobharat.com/#pharmacy"
                },
                "areaServed": {
                  "@type": "AdministrativeArea",
                  "name": "Deoria District"
                }
              }
            ]
          }),
        }}
      />



      <Hero data={data} />
      <CityInterlinking />
      <BannerImage data={data} />
      <Reviews />
      <HowItWorks data={data} />
      <MedicoBharatSEOSection data={data} />
      <FinalCTA data={data} />
      <CitySEOContent data={data} />
      <TrustSection />
      <FAQ data={data} />
      <Footer data={data} />

    </div>
  )
}
export default page