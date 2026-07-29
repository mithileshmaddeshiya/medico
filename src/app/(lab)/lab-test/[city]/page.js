import { notFound } from "next/navigation";

import LabCallBanner from "@/components/lab/LabCallBanner";
import LabContent from "@/components/lab/LabContent";
import LabCta from "@/components/lab/LabCta";
import LabFaq from "@/components/lab/LabFaq";
import LabHero from "@/components/lab/LabHero";
import LabRelatedLinks from "@/components/lab/LabRelatedLinks";
import LabServices from "@/components/lab/LabServices";
import LabTrustStrip from "@/components/lab/LabTrustStrip";
import { LAB_PHONE, LAB_OG_IMAGE } from "@/data/lab/defaults";
import { getLabCities, getLabCity, getLabCityOptions } from "@/lib/labCities";
import { SITE } from "@/lib/site";

// Cities are local data now, so every page we serve is known at build time.
// A slug that is not in the list is a city we do not serve → a real 404, which
// the page already handles by calling notFound() on an unknown slug.
export const dynamicParams = false;

// Every city we serve is prerendered at build time from the local data.
export async function generateStaticParams() {
  const cities = await getLabCities();
  return cities.map(({ slug }) => ({ city: slug }));
}

export async function generateMetadata({ params }) {
  const { city } = await params;
  const cityData = await getLabCity(city);

  // Unknown slug — the page 404s, so tell crawlers not to index the 404 body.
  if (!cityData) {
    return {
      title: "Lab Test Not Available",
      robots: { index: false, follow: false },
    };
  }

  // title / description / keywords come from the city entry, falling back
  // to the generated defaults — see src/data/lab/defaults.js.
  const { name, state, slug, title, description, keywords } = cityData;
  const url = `${SITE}/lab-test/${slug}`;

  // ── Share card (OG + Twitter) ───────────────────────────────────────────
  // NEVER the hero .webp here: WhatsApp and many scrapers do not render WebP,
  // so a mobile share came up blank. A city may set its own `ogImage`; else the
  // shared lab card is used. Path is made absolute — a relative og:image is a
  // common reason a preview fails to load off-site.
  const ogPath = cityData.ogImage || LAB_OG_IMAGE;
  const ogImage = ogPath.startsWith("http") ? ogPath : `${SITE}${ogPath}`;
  const ogType = ogImage.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
  const ogAlt = `Lab Test in ${name} with free home sample collection — MedicoBharat`;

  return {
    title,
    description,
    keywords,

    // One canonical per city. Without it every /lab-test/* page competes with
    // the others for the same "lab test at home" query.
    alternates: { canonical: url },

    // Must stay index:true. These URLs are in sitemap.xml and are linked from
    // the header and footer of every page — a noindex here would contradict
    // both, and Search Console reports it as "Submitted URL marked 'noindex'".
    // If the section ever needs taking down, pull it from sitemap.js too.
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    // Metadata is shallow-merged, so a page-level openGraph replaces the root
    // one wholesale — the image has to be repeated here or the card loses it.
    // width/height let WhatsApp reserve the large-image slot before the file
    // loads; secureUrl + type are what a strict scraper looks for.
    openGraph: {
      type: "website",
      url,
      siteName: "MedicoBharat",
      locale: "en_IN",
      title,
      description,
      images: [
        {
          url: ogImage,
          secureUrl: ogImage,
          width: 1200,
          height: 630,
          alt: ogAlt,
          type: ogType,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: ogImage, alt: ogAlt }],
    },

    other: {
      locality: name,
      region: state,
      country: "India",
    },
  };
}

/* ── Structured data ──────────────────────────────────────────────────────
   Built per city from the same local data, so a new city ships with complete
   schema instead of Varanasi's details under someone else's name. */

const diagnosticLabSchema = (city) => ({
  "@context": "https://schema.org",
  // Two types on purpose. DiagnosticLab is the accurate description of what
  // this is, but it hangs off MedicalOrganization — NOT off LocalBusiness. That
  // matters because everything below (postal address, opening hours, telephone,
  // areaServed, price range) are local-business properties, and Google's local
  // results are built around LocalBusiness and its subtypes. MedicalBusiness is
  // a LocalBusiness subtype, so listing both keeps the precise description and
  // still files the page under the type the local signals belong to.
  "@type": ["DiagnosticLab", "MedicalBusiness"],
  "@id": `${SITE}/lab-test/${city.slug}#diagnosticlab`,
  name: `MedicoBharat Lab Test — ${city.name}`,
  url: `${SITE}/lab-test/${city.slug}`,
  description: city.description,
  telephone: city.footer.phone,
  priceRange: "₹₹",
  image: `${SITE}${city.hero.image}`,
  openingHours: "Mo-Su 06:00-21:00",
  address: {
    "@type": "PostalAddress",
    addressLocality: city.name,
    addressRegion: city.state,
    addressCountry: "IN",
    ...(city.postalCode ? { postalCode: city.postalCode } : {}),
  },
  // Every locality we serve, so the page can rank for "<test> in <locality>".
  areaServed: [
    { "@type": "City", name: city.name },
    ...city.areas.map((area) => ({ "@type": "Place", name: `${area}, ${city.name}` })),
  ],
  // The real price list, straight off the cards — the same numbers a patient
  // sees, so the rich result can never disagree with the page.
  makesOffer: city.tests
    .filter((test) => typeof test.price === "number")
    .map((test) => ({
      "@type": "Offer",
      name: `${test.name} in ${city.name}`,
      description: test.sub,
      price: test.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      itemOffered: { "@type": "MedicalTest", name: test.name },
    })),
  parentOrganization: {
    "@type": "Organization",
    name: "MedicoBharat",
    url: SITE,
  },
});

const breadcrumbSchema = (city) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE },
    {
      "@type": "ListItem",
      position: 2,
      name: `Lab Test in ${city.name}`,
      item: `${SITE}/lab-test/${city.slug}`,
    },
  ],
});

export default async function LabCityPage({ params }) {
  const { city } = await params;

  const cityData = await getLabCity(city);
  // A city we do not serve is a genuine 404 — redirecting it to Varanasi used
  // to hand Google a page whose content never matched the URL that was crawled.
  if (!cityData) notFound();

  // The booking form's dropdown is scoped to THIS city — its name, its own
  // localities, then "Other". It used to list every live city, which put
  // Varanasi's localities at the top of Deoria's form. "Other" still covers the
  // visitor from a neighbouring town.
  const cityOptions = await getLabCityOptions(cityData.slug);

  const cityName = cityData.name;
  const phone = cityData.footer.phone ?? LAB_PHONE;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(diagnosticLabSchema(cityData)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(cityData)) }}
      />

      <LabHero hero={cityData.hero} cityOptions={cityOptions} />

      {/* Phone: tests first, promises after them. Desktop (lg+): promises sit
          between the hero and the tests. Flex order keeps a single instance in
          the DOM instead of duplicating the strip per breakpoint. */}
      <div className="flex flex-col">
        <div className="order-2 lg:order-1">
          <LabTrustStrip promises={cityData.trustStrip} />
        </div>
        <div className="order-1 lg:order-2">
          <LabServices
            city={cityName}
            cityOptions={cityOptions}
            tests={cityData.tests}
            filters={cityData.filters}
            phone={phone}
          />
        </div>
      </div>
      
      <LabCallBanner banner={cityData.callBanner} phone={phone} />

      {/* A safety cap on a runaway city document, not a target — raised from 6
          to 8 because both live cities now carry eight questions that are each
          a different query. At 6, Deoria's pathology-lab and booking answers
          were written and then never rendered, and Varanasi silently dropped
          its "Kya aap Banaras me lab test karte hain?" answer — the one that
          catches everyone who never types the official name. */}
      <LabFaq city={cityName} faqs={cityData.faqs?.slice(0, 8)} />

      <LabCta cta={cityData.cta} phone={phone} />

      <LabContent city={cityName} sections={cityData.content} />

      {/* Internal links, after the guide because that is where a reader who has
          finished reading is looking for somewhere to go. Renders nothing for a
          city with no `relatedLinks` — see src/data/lab/cities.js. */}
      <LabRelatedLinks related={cityData.relatedLinks} />

      {/* Closing call strip — last section before the footer */}
    </>
  );
}
