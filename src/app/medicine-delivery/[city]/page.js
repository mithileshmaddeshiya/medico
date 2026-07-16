import PremiumCitySlider from "@/components/cityData";
import DeoriaLongSEOContent from "@/components/ContentPage";
import FinalCTA from "@/components/Cta";
import FAQ from "@/components/Faq";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowCity";
import MedicoBharatSEOSection from "@/components/MetakeyDeoria";
import Reviews from "@/components/Review";
import { getCity } from "@/lib/getCity";
import { notFound } from "next/navigation";
import Script from "next/script";
import { cityData } from "@/data/cityData";


export async function generateMetadata({ params }) {

    const resolvedParams =
        await params;

     const data = await getCity(resolvedParams.city);
     
    
    if (!data) return {};

    return {
        title: data?.title,

        description: data?.description,

        keywords: data?.keywords,

        alternates: {
            canonical: `https://www.medicobharat.com/medicine-delivery/${data?.slug}`,
        },

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

        openGraph: {
            title: data?.title,
            description: data?.description,
            url: `https://www.medicobharat.com/medicine-delivery/${data?.slug}`,
            type: "website",
        },
    };

}

export async function generateStaticParams() {
  return Object.keys(cityData).map((city) => ({
    city,
  }));
}

export default async function Page({ params }) {

    const resolvedParams = await params;

    const data = await getCity(resolvedParams.city);

    if (!data) {
        notFound();
    }

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",

        mainEntity: data?.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };

    const medicalBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        "@id": `https://www.medicobharat.com/medicine-delivery/${data?.slug}#medicalbusiness`,
        "name": `MedicoBharat ${data?.city}`,
        "url": `https://www.medicobharat.com/medicine-delivery/${data?.slug}`,
        "description": data?.description,
        "telephone": "+91-9891233525",
        "priceRange": "₹₹",
        "image": "https://www.medicobharat.com/heroimage/medihero.webp",
        "areaServed": {
            "@type": "City",
            "name": data?.city
        },
        "address": {
            "@type": "PostalAddress",
            "addressLocality": data?.city,
            "addressRegion": "Uttar Pradesh",
            "addressCountry": "IN",
            "postalCode": data?.postalCode
        },
        "parentOrganization": {
            "@type": "Organization",
            "name": "MedicoBharat",
            "url": "https://www.medicobharat.com"
        }
    }

    return (
        <div>
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema),
                }}
            />

            <Script
                id="medical-business-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(medicalBusinessSchema),
                }}
            />

            <Hero data={data} />
            <PremiumCitySlider data={data} />
            {/* <Reviews data={data} /> */}
            <HowItWorks data={data} />
            <MedicoBharatSEOSection data={data} />
            <FinalCTA data={data} />
            <DeoriaLongSEOContent data={data} />
            <FAQ data={data} />
            <Footer />

        </div>

    );

} 
