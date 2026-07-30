import PremiumCitySlider from "@/components/medicine/CitySlider";
import DeoriaLongSEOContent from "@/components/medicine/ContentPage";
import FinalCTA from "@/components/medicine/Cta";
import FAQ from "@/components/medicine/Faq";
import Hero from "@/components/medicine/Hero";
import HowItWorks from "@/components/medicine/HowCity";
import MedicoBharatSEOSection from "@/components/medicine/MetakeyDeoria";
import { getCity } from "@/lib/getCity";
import { notFound } from "next/navigation";
import { cityData } from "@/data/medicine/cityData";
import { BRAND_PROFILES, ORG_REF } from "@/lib/schema";
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
        // The brand, by reference — the same `@id` the root layout declares and
        // the lab city pages point at. This was a `{ name, url }` stub, which
        // shares a name with the organisation but carries no identifier, so a
        // crawler could not tell that the MedicoBharat on this page is the same
        // company as the one on /lab-test/deoria. See src/lib/schema.js.
        "parentOrganization": ORG_REF,
        "sameAs": BRAND_PROFILES
    }

    return (
        <div>
            {/*
                Native <script>, NOT next/script.

                These two were <Script> with the default "afterInteractive"
                strategy, which injects an inline script from the CLIENT after
                hydration. The consequence: neither block existed in the
                prerendered HTML — `curl` this page and there was no structured
                data on it at all. Google renders JavaScript and would usually
                still find it, but on a second render pass and with no guarantee,
                and every other crawler (Bing, and the AI answer engines) simply
                saw a page with no schema.

                JSON-LD is data, not executable code, so a plain tag is the right
                choice and it lands in the static HTML — which is the whole
                point. Next's own guide says exactly this:
                node_modules/next/dist/docs/01-app/02-guides/json-ld.md

                `<` is escaped for the same reason as on the lab pages: city copy
                is authored text, and a stray "</script>" in it would close the
                tag early and spill the payload into the document.
            */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(medicalBusinessSchema).replace(/</g, "\\u003c"),
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
