import { notFound } from "next/navigation";

import LabCallBanner from "@/components/lab/LabCallBanner";
import LabContent from "@/components/lab/LabContent";
import LabCta from "@/components/lab/LabCta";
import LabFaq from "@/components/lab/LabFaq";
import FloatingCallButton from "@/components/lab/FloatingCallButton";
import LabHero from "@/components/lab/LabHero";
import LabHowTo from "@/components/lab/LabHowTo";
import LabServices from "@/components/lab/LabServices";
import LabTrustStrip from "@/components/lab/LabTrustStrip";
import { LAB_PHONE, LAB_OG_IMAGE } from "@/data/lab/defaults";
import { getLabCities, getLabCity, getLabCityOptions } from "@/lib/labCities";
import {
  BRAND_PROFILES,
  GBP_MAP_URL,
  ORG_REF,
  WEBSITE_ID,
  graph,
  ldJson,
} from "@/lib/schema";
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
   schema instead of Varanasi's details under someone else's name.

   The three nodes below go out as ONE `@graph`, not as three separate scripts.
   That is what lets them reference each other by `@id` — the page is *about*
   the lab, the lab *belongs to* the organisation declared in the root layout,
   and the page *is part of* the website declared there too. Three loose scripts
   describe three unrelated facts; a graph describes one business.

   The reason that matters here: a search for "medicobharat" was being
   spell-corrected to "medical bharat", i.e. Google held no entity for this
   brand. Every node that resolves back to ORG_ID is another page telling it
   the same name belongs to the same organisation. See src/lib/schema.js. */

/** Ids for this city's nodes. Fragments off the page URL, so they are stable. */
const ids = (slug) => {
  const url = `${SITE}/lab-test/${slug}`;
  return {
    url,
    page: `${url}#webpage`,
    lab: `${url}#diagnosticlab`,
    breadcrumb: `${url}#breadcrumb`,
  };
};

/**
 * The Maps URL this city's local node should publish.
 *
 * A service like this ends up with ONE Business Profile per town, not one for
 * the brand — the Deoria profile is a different verified record from the
 * Varanasi one, with its own reviews, its own photos and its own map pin. So
 * the city's own `gbp` wins, and the brand-wide GBP_MAP_URL is only the
 * fallback for a city that has no profile of its own yet.
 *
 * Empty string when neither exists, and every property built from it below is
 * written to disappear in that case. That is deliberate: an unset link costs
 * nothing, while a guessed one claims another lab is us.
 */
const mapUrlFor = (city) => city.gbp || GBP_MAP_URL || "";

/**
 * `sameAs` for the local node — the brand profiles plus THIS city's profile.
 *
 * BRAND_PROFILES already folds in GBP_MAP_URL when that is set, so appending
 * would duplicate it on cities with no profile of their own. The membership
 * check keeps the list a set: a repeated `sameAs` entry is not invalid, but it
 * is the kind of noise that makes markup look generated rather than curated.
 */
const sameAsFor = (city) => {
  const map = mapUrlFor(city);
  return map && !BRAND_PROFILES.includes(map) ? [...BRAND_PROFILES, map] : BRAND_PROFILES;
};

const diagnosticLabNode = (city) => {
  const id = ids(city.slug);
  const mapUrl = mapUrlFor(city);

  return {
    // Two types on purpose. DiagnosticLab is the accurate description of what
    // this is, but it hangs off MedicalOrganization — NOT off LocalBusiness. That
    // matters because everything below (postal address, opening hours, telephone,
    // areaServed, price range) are local-business properties, and Google's local
    // results are built around LocalBusiness and its subtypes. MedicalBusiness is
    // a LocalBusiness subtype, so listing both keeps the precise description and
    // still files the page under the type the local signals belong to.
    "@type": ["DiagnosticLab", "MedicalBusiness"],
    "@id": id.lab,
    name: `MedicoBharat Lab Test — ${city.name}`,
    url: id.url,
    description: city.description,
    telephone: city.footer.phone,
    email: city.footer.email,
    priceRange: "₹₹",
    image: `${SITE}${city.hero.image}`,
    // Which page describes this business — the other half of the WebPage node's
    // `about`. Without it the two nodes sit in the same graph without ever
    // saying they are about each other.
    mainEntityOfPage: { "@id": id.page },
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: city.state,
      addressCountry: "IN",
      ...(city.postalCode ? { postalCode: city.postalCode } : {}),
    },
    // Town-centre coordinates, and only when the city entry actually has them.
    // This is a service-area business, not a walk-in counter — see the note on
    // `geo` in src/data/lab/cities.js.
    ...(city.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: city.geo.lat,
            longitude: city.geo.lng,
          },
        }
      : {}),
    // Every locality we serve, so the page can rank for "<test> in <locality>".
    areaServed: [
      { "@type": "City", name: city.name },
      ...city.areas.map((area) => ({ "@type": "Place", name: `${area}, ${city.name}` })),
    ],
    // The collection window, written as a specification rather than the old
    // "Mo-Su 06:00-21:00" string: the string form is legacy and Google's local
    // parsing prefers this. Same hours the copy and the FAQs state — 6 AM slots,
    // evening cut-off. It is NOT a 24-hour lab and must never say so.
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "06:00",
      closes: "21:00",
    },
    // Facts the page already states in prose. Kept in sync with the FAQ answer
    // about payment — cash or UPI, taken at collection.
    paymentAccepted: "Cash, UPI",
    currenciesAccepted: "INR",
    // `knowsLanguage`, not `availableLanguage`: the latter is defined on
    // ContactPoint and Service, not on LocalBusiness, so it would sit outside
    // its domain here. `knowsLanguage` is an Organization property, and a
    // DiagnosticLab is a MedicalOrganization.
    knowsLanguage: ["hi-IN", "en-IN"],
    // A LocalBusiness IS a Place, so the Maps link belongs here (unlike on the
    // Organization node). This city's own profile first, the brand-wide one as
    // fallback, and the property omitted entirely when neither is set.
    ...(mapUrl ? { hasMap: mapUrl } : {}),
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
        // Where the offer is actually bookable. An Offer with no url is a price
        // with nowhere to go; #tests is the anchor on the price grid.
        url: `${id.url}#tests`,
        // Free home collection is a real part of every offer here, and the one
        // thing that differentiates the price from a walk-in lab's.
        availableAtOrFrom: { "@type": "Place", name: `${city.name} — home sample collection` },
        itemOffered: { "@type": "MedicalTest", name: test.name },
      })),
    // The brand, by reference. This was a `{ name, url }` stub — a stub shares a
    // name with the organisation but carries no identifier, so a crawler cannot
    // tell it is the same company as the one on the home page. ORG_REF can only
    // ever resolve to one entity.
    parentOrganization: ORG_REF,
    // Off-domain profiles are the only part of this markup a search engine can
    // verify without taking our word for it, which is exactly why a brand with
    // no recognised entity needs them on its local nodes too. The city's own
    // Business Profile is the strongest of them: it is the one link that
    // resolves to a Google-verified record of THIS town's operation.
    sameAs: sameAsFor(city),
  };
};

/**
 * The page itself.
 *
 * Deliberately `WebPage` and not `MedicalWebPage`. MedicalWebPage is the more
 * precise type and it would look better in an audit, but it exists to be paired
 * with `reviewedBy` and `lastReviewed` — a named clinician who checked the
 * content. There is no such person here, and declaring the type that invites
 * those properties while leaving them empty is the medical-content equivalent
 * of the NABL claim this project already removed once. Use WebPage until a real
 * reviewer signs off; then switch the type and name them.
 */
const webPageNode = (city) => {
  const id = ids(city.slug);

  return {
    "@type": "WebPage",
    "@id": id.page,
    url: id.url,
    name: city.title,
    description: city.description,
    // The two links that tie this page to the brand entity in the root layout.
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": id.lab },
    breadcrumb: { "@id": id.breadcrumb },
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE}${city.hero.image}` },
    // Hinglish is Hindi vocabulary in Latin script, so both codes are true and
    // both are declared — a page tagged only "en" contradicts its own copy.
    inLanguage: ["hi-IN", "en-IN"],
    publisher: ORG_REF,
    // From the city entry, never from the build clock. A dateModified that
    // moves on every deploy is a freshness claim about content nobody touched,
    // and Google discounts a site that makes it. Bump `updated` in
    // src/data/lab/cities.js when the copy genuinely changes.
    ...(city.updated ? { dateModified: city.updated } : {}),
  };
};

const breadcrumbNode = (city) => {
  const id = ids(city.slug);

  return {
    "@type": "BreadcrumbList",
    "@id": id.breadcrumb,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      {
        "@type": "ListItem",
        position: 2,
        name: `Lab Test in ${city.name}`,
        item: id.url,
      },
    ],
  };
};

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
      {/* One graph, three linked nodes — see the block comment above.
          ldJson() escapes `<`: the city copy is authored text, and the day a
          string in it contains "</script>" an unescaped payload would close the
          tag early and dump the rest into the document as markup. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: ldJson(
            graph(
              webPageNode(cityData),
              diagnosticLabNode(cityData),
              breadcrumbNode(cityData)
            )
          ),
        }}
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
      <LabHowTo data={cityData.howTo} />


      {/* A safety cap on a runaway city document, not a target — raised from 6
          to 8 because both live cities now carry eight questions that are each
          a different query. At 6, Deoria's pathology-lab and booking answers
          were written and then never rendered, and Varanasi silently dropped
          its "Kya aap Banaras me lab test karte hain?" answer — the one that
          catches everyone who never types the official name. */}
      <LabFaq
        city={cityName}
        faqs={cityData.faqs?.slice(0, 8)}
        pageUrl={`${SITE}/lab-test/${cityData.slug}`}
        /* Names the town, because this <h2> used to be the string "Frequently
           Asked Questions" on all six city pages — the one generic heading on
           an otherwise entirely city-specific page. The sub-line below it drops
           the city in return, so the pair states two things instead of one
           thing twice. See the note in LabFaq. */
        heading={`${cityName} Me Lab Test — Aksar Puche Jane Wale Sawaal`}
        subheading="Home collection, fasting, report aur payment se jude seedhe jawab."
      />

      <LabCta cta={cityData.cta} phone={phone} />

      {/* The internal links used to be a LabRelatedLinks band of their own
          under this one. They are now passed in and rendered at the end of the
          guide's reading column — same links, one section instead of two. A
          city with no `relatedLinks` simply renders no block; see
          src/data/lab/cities.js. */}
      <LabContent
        city={cityName}
        sections={cityData.content}
        related={cityData.relatedLinks}
      />

      {/* Floats over everything, bottom-right, dismissible. `phone` is this
          city's number, so it can never dial a different one than the page. */}
      <FloatingCallButton phone={phone} />

      {/* How the visit actually works, under the guide. Last section on the
          page on purpose: the reader who has got this far has decided they want
          the test, and the only thing left in the way is not knowing what
          happens after the form. Copy in src/data/lab/defaults.js — read the
          claims warning above it before editing. */}
    </>
  );
}
