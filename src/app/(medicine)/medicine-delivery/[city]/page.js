import PremiumCitySlider from "@/components/medicine/CitySlider";
import DeoriaLongSEOContent from "@/components/medicine/ContentPage";
import FinalCTA from "@/components/medicine/Cta";
import FAQ from "@/components/medicine/Faq";
import Hero from "@/components/medicine/Hero";
import HowItWorks from "@/components/medicine/HowCity";
import MedicoBharatSEOSection from "@/components/medicine/MetakeyDeoria";
import { getCity } from "@/lib/getCity";
import { notFound } from "next/navigation";
import Script from "next/script";
import { cityData } from "@/data/medicine/cityData";
import { SITE } from "@/lib/site";


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
            canonical: `${SITE}/medicine-delivery/${data?.slug}`,
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

        // Metadata is shallow-merged: defining openGraph here replaces the root
        // layout's object outright, so siteName, locale and the image all have
        // to be repeated. Without them these pages shared with no picture at all.
        openGraph: {
            title: data?.title,
            description: data?.description,
            url: `${SITE}/medicine-delivery/${data?.slug}`,
            siteName: "MedicoBharat",
            locale: "en_IN",
            type: "website",
            images: [
                {
                    url: `${SITE}/medicine-delivery/${data?.slug}/og`,
                    width: 1200,
                    height: 630,
                    alt: data?.title,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: data?.title,
            description: data?.description,
            images: [`${SITE}/medicine-delivery/${data?.slug}/og`],
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
        "@id": `${SITE}/medicine-delivery/${data?.slug}#medicalbusiness`,
        "name": `MedicoBharat ${data?.city}`,
        "url": `${SITE}/medicine-delivery/${data?.slug}`,
        "description": data?.description,
        "telephone": "+91-9891233525",
        "priceRange": "₹₹",
        "image": `${SITE}/heroimage/medihero.webp`,
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
            "url": SITE
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
            <HowItWorks data={data} />
            <MedicoBharatSEOSection data={data} />
            <FinalCTA data={data} />
            <DeoriaLongSEOContent data={data} />
            <FAQ data={data} />

        </div>

    );

} 
