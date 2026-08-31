import HomeGuides from "@/components/home/HomeGuides";
import HomeHero from "@/components/home/HomeHero";
import HomeSteps from "@/components/home/HomeSteps";
import HomeWhy from "@/components/home/HomeWhy";
import LabCallBanner from "@/components/lab/LabCallBanner";
import LabContent from "@/components/lab/LabContent";
import LabCta from "@/components/lab/LabCta";
import LabFaq from "@/components/lab/LabFaq";
import FloatingCallButton from "@/components/lab/FloatingCallButton";
import LabHowTo from "@/components/lab/LabHowTo";
import LabQuickLinks from "@/components/lab/LabQuickLinks";
import LabServices from "@/components/lab/LabServices";
import LabTrustStrip from "@/components/lab/LabTrustStrip";
import WelcomePopup from "@/components/lab/WelcomePopup";
import { getLatestBlogs } from "@/data/blogs";
import {
  HOME_CALL_BANNER,
  HOME_CONTENT,
  HOME_CTA,
  HOME_FAQS,
  HOME_GUIDES,
  HOME_HERO,
  HOME_HOW_TO,
  HOME_META,
  HOME_STEPS,
  HOME_WHY,
  homeRelatedLinks,
} from "@/data/home";
import {
  LAB_OG_IMAGE,
  LAB_PHONE,
  defaultFilters,
  defaultTests,
  defaultTrustStrip,
} from "@/data/lab/defaults";
import { getLabCities } from "@/lib/labCities";
import {
  BRAND_PROFILES,
  GBP_MAP_URL,
  ORG_REF,
  WEBSITE_ID,
  graph,
  ldJson,
} from "@/lib/schema";
import { SITE } from "@/lib/site";

/**
 * THE HOME PAGE.
 *
 * ── WHAT THIS REPLACED AND WHY ────────────────────────────────────────────
 * Until now this route rendered `HomeDataProvider` — a "use client" component
 * that assembled a medicine-delivery home page out of src/data/medicine/. The
 * lab section was a promo strip halfway down it. That is the reason Google
 * reads this domain as an online pharmacy: the page every external link and
 * every brand search points at said "medicine delivery" in its title, its h1,
 * its schema and its copy.
 *
 * The medicine section is gone (its URLs are permanently redirected in
 * next.config.mjs) and this page is now the lab service's front door. It is a
 * SERVER component: everything on it renders as HTML, so the copy, the price
 * list and every internal link are in the first response rather than behind a
 * hydration step.
 *
 * ── WHY IT REUSES THE LAB COMPONENTS ─────────────────────────────────────
 * The trust strip, the price grid, the FAQ accordion, the long-form block, the
 * CTA band and the call strip are the SAME components the city pages use, fed
 * from the same src/data/lab/defaults.js. Not to save work — to stop the home
 * page and the city pages drifting. A second price grid here would show a
 * stale ₹400 the first time a CBC price changed, and a price on the home page
 * that contradicts the city page is worse than no price at all.
 *
 * What is genuinely different about this page — the hero, the process steps,
 * the trust cards, the guide rail — lives in src/components/home/, and every
 * word of its copy is in src/data/home.js.
 *
 * ── WHERE THE CITY LINKS LIVE ────────────────────────────────────────────
 * There used to be a card grid here whose only job was to link the three city
 * pages. It is gone, and the links it carried are now spread across the page
 * instead: contextual anchors inside the long-form block (HOME_CONTENT — the
 * lead section and "Hum Kin Sheher Me Sample Collect Karte Hain", which sits
 * second so it is not buried), the "Aage Kahan Jaayein" block at the bottom,
 * the sitewide footer's "Cities We Serve" column, and the ItemList node below.
 * If a city page ever needs to be reachable from this page in one obvious tap,
 * that is the trade this removal made — see the note on cityListNode.
 */

/* ── Metadata ─────────────────────────────────────────────────────────────
   Static, because nothing here depends on a param. `title.absolute` matters:
   the root layout sets a `%s | MedicoBharat` template, and HOME_META.title
   already ends in "| MedicoBharat" — without `absolute` the rendered title
   would carry the brand twice. */
export const metadata = {
  title: { absolute: HOME_META.title },
  description: HOME_META.description,
  keywords: HOME_META.keywords,

  // The site's root canonical. It has to be the www form, and it has to be
  // this exact string — see src/lib/site.js for what the drift used to cost.
  alternates: { canonical: SITE },

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

  /* Metadata is shallow-merged, so a page-level `openGraph` replaces the root
     one wholesale — the image has to be repeated here or the card loses it.

     NOT the hero .webp: WhatsApp and several social scrapers refuse to render
     a WebP og:image, which is why a mobile share used to come up as a blank
     grey box. LAB_OG_IMAGE is the shared 1200×630 JPG. */
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "MedicoBharat",
    locale: "en_IN",
    title: HOME_META.title,
    description: HOME_META.description,
    images: [
      {
        url: `${SITE}${LAB_OG_IMAGE}`,
        secureUrl: `${SITE}${LAB_OG_IMAGE}`,
        width: 1200,
        height: 630,
        alt: "MedicoBharat — lab test at home with free sample collection",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: HOME_META.title,
    description: HOME_META.description,
    images: [
      {
        url: `${SITE}${LAB_OG_IMAGE}`,
        alt: "MedicoBharat — lab test at home with free sample collection",
      },
    ],
  },
};

/* ── Structured data ──────────────────────────────────────────────────────
   Three nodes in ONE `@graph`, not three separate scripts. A graph is what
   lets them reference each other by `@id` — this page is *about* the lab, the
   lab *belongs to* the organisation declared in the root layout, and the page
   *is part of* the website declared there too. See src/lib/schema.js.

   The node that used to sit on this page was a `Pharmacy` with a Deoria street
   address, declared in the root layout. It has been removed: it was the single
   strongest machine-readable statement that this is a pharmacy, and it was on
   every page of the site. What replaces it is below — the same business, typed
   as what it actually is. */

/* Fragment ids for this page's nodes.
   The `/` before the `#` is not cosmetic. ORG_ID and WEBSITE_ID in
   src/lib/schema.js are written the same way (`${SITE}/#organization`), and an
   `@id` is matched as an exact string — `…com#webpage` and `…com/#webpage` are
   two different nodes to a crawler. LabFaq builds its own ids off the
   `pageUrl` it is given, so that prop has to carry the same trailing slash or
   the FAQ node's `isPartOf` points at a WebPage that does not exist in the
   graph. HOME_URL below is what keeps the two in step. */
const HOME_URL = `${SITE}/`;

const IDS = {
  page: `${HOME_URL}#webpage`,
  lab: `${HOME_URL}#diagnosticlab`,
  cities: `${HOME_URL}#cities`,
};

/**
 * The brand-level lab.
 *
 * Two types on purpose, exactly as on the city pages: DiagnosticLab is the
 * accurate description, and it hangs off MedicalOrganization — but everything
 * here (telephone, opening hours, areaServed, price range, offers) is a
 * local-business property, and Google's local results are built around
 * LocalBusiness and its subtypes. MedicalBusiness IS a LocalBusiness subtype,
 * so listing both keeps the precise description and still files the page under
 * the type the local signals belong to.
 *
 * `areaServed` is built from the live city list rather than typed, so it can
 * never claim a town we have stopped serving.
 */
const labNode = (cities) => ({
  "@type": ["DiagnosticLab", "MedicalBusiness"],
  "@id": IDS.lab,
  name: "MedicoBharat",
  url: SITE,
  description: HOME_META.description,
  telephone: LAB_PHONE,
  email: "support.medicobharat@gmail.com",
  priceRange: "₹₹",
  image: `${SITE}${LAB_OG_IMAGE}`,
  // The other half of the WebPage node's `about` — without it the two nodes
  // sit in the same graph without ever saying they are about each other.
  mainEntityOfPage: { "@id": IDS.page },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Deoria",
    addressRegion: "Uttar Pradesh",
    postalCode: "274001",
    addressCountry: "IN",
  },
  // Every city we serve and every locality inside it, so this page supports
  // the "<test> in <locality>" queries the city pages compete for rather than
  // contradicting them.
  areaServed: cities.flatMap((city) => [
    { "@type": "City", name: city.name },
    ...city.areas.map((area) => ({
      "@type": "Place",
      name: `${area}, ${city.name}`,
    })),
  ]),
  // The collection window, as a specification rather than the legacy
  // "Mo-Su 06:00-21:00" string — Google's local parsing prefers this form.
  // Same hours the copy and the FAQs state. It is NOT a 24-hour lab and this
  // must never say so.
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
  paymentAccepted: "Cash, UPI",
  currenciesAccepted: "INR",
  // `knowsLanguage`, not `availableLanguage`: the latter is defined on
  // ContactPoint and Service, not on LocalBusiness.
  knowsLanguage: ["hi-IN", "en-IN"],
  // A LocalBusiness IS a Place, so the Maps link is in domain here. Omitted
  // entirely while GBP_MAP_URL is empty — see src/lib/schema.js.
  ...(GBP_MAP_URL ? { hasMap: GBP_MAP_URL } : {}),
  // The real price list, straight off the same cards the page renders. The
  // markup can therefore never disagree with what a patient sees.
  makesOffer: defaultTests()
    .filter((test) => typeof test.price === "number")
    .map((test) => ({
      "@type": "Offer",
      name: test.name,
      description: test.sub,
      price: test.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      // Where the offer is bookable. An Offer with no url is a price with
      // nowhere to go; #tests is the anchor on the price grid below.
      url: `${HOME_URL}#tests`,
      itemOffered: { "@type": "MedicalTest", name: test.name },
    })),
  parentOrganization: ORG_REF,
  // Off-domain profiles are the only part of this markup a search engine can
  // verify without taking our word for it.
  sameAs: BRAND_PROFILES,
});

const webPageNode = () => ({
  "@type": "WebPage",
  "@id": IDS.page,
  url: SITE,
  name: HOME_META.title,
  description: HOME_META.description,
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": IDS.lab },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${SITE}${LAB_OG_IMAGE}`,
  },
  // Hinglish is Hindi vocabulary in Latin script, so both codes are true and
  // both are declared — a page tagged only "en" contradicts its own copy.
  inLanguage: ["hi-IN", "en-IN"],
  publisher: ORG_REF,
});

/**
 * The city pages, as an explicit list.
 *
 * It tells a crawler that these three URLs are the members of one set rather
 * than three unrelated pages that happen to be linked from here — which is
 * what stops them being read as near-duplicates of each other.
 *
 * This node matters MORE now than it used to. It was the machine-readable half
 * of a visible card grid; that grid is gone, so this is the only place on the
 * page that states the three city pages are one set. Every URL in it is still
 * linked in the rendered HTML — the long-form block and the related-links
 * block both carry them — which is what keeps this markup honest.
 */
const cityListNode = (cities) => ({
  "@type": "ItemList",
  "@id": IDS.cities,
  name: "MedicoBharat — lab test cities",
  itemListElement: cities.map((city, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `Lab Test in ${city.name}`,
    url: `${SITE}/lab-test/${city.slug}`,
  })),
});

export default async function HomePage() {
  const cities = await getLabCities();
  const guides = getLatestBlogs(3);

  /* The booking form's dropdown: every city we serve, then "Other".
     Deliberately NOT every locality of every city — that is a 30-item select
     on a phone, and a visitor on the home page has usually not told us their
     town yet. The follow-up call confirms the exact address anyway, and each
     city page's own form does offer that city's localities. */
  const cityOptions = [...cities.map((city) => city.name), "Other"];

  return (
    <>
      {/* One graph, three linked nodes — see the block comment above. ldJson()
          escapes `<`: the copy is authored text, and the day a string in it
          contains "</script>" an unescaped payload would close the tag early
          and dump the rest into the document as markup. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: ldJson(
            graph(webPageNode(), labNode(cities), cityListNode(cities))
          ),
        }}
      />

      {/* Opens a beat after the page paints, once per visit — see the header
          comment in WelcomePopup. It carries the same form as the hero and
          posts through the same /api/lab-lead → Firestore → WhatsApp path, so
          a popup lead lands exactly where a hero booking does. */}
      <WelcomePopup cityOptions={cityOptions} />

      <HomeHero hero={HOME_HERO} cityOptions={cityOptions} />

      <LabTrustStrip promises={defaultTrustStrip()} />

      {/* The price grid, same component and same data as every city page — so
          a price change in src/data/lab/defaults.js lands here and on all
          three city pages at once, and they can never disagree. No `city`
          prop: this page serves all of them. */}
      <LabServices
        cityOptions={cityOptions}
        tests={defaultTests()}
        filters={defaultFilters()}
        phone={LAB_PHONE}
      />


      {/* <HomeWhy data={HOME_WHY} /> */}

      <LabCallBanner banner={HOME_CALL_BANNER} phone={LAB_PHONE} />

      <LabHowTo data={HOME_HOW_TO} />


      {/* <HomeGuides data={HOME_GUIDES} posts={guides} /> */}

      {/* `pageUrl` joins the FAQ node to this page's graph (#faqpage →
          isPartOf → #webpage) instead of leaving it floating unattached. It is
          HOME_URL, with the trailing slash — see the note beside IDS above for
          why passing bare SITE here silently breaks that link. */}
      {/* No `heading`: the default "Frequently Asked Questions" is right here,
          because this page serves every city and can name none of them. `city`
          only ever reaches the fallback sub-line, and it used to be the
          Hinglish "Aapke sheher" under English questions. The sub-line is
          passed explicitly now so the section does not depend on that fallback
          at all. */}
      <LabFaq
        city="your city"
        faqs={HOME_FAQS}
        pageUrl={HOME_URL}
        subheading="Straight answers on home collection, fasting, reports and payment."
      />

      <LabCta cta={HOME_CTA} phone={LAB_PHONE} />

      {/* The long read, last — a reader who has decided has already booked
          from the form above, and a reader who has not is exactly the one who
          wants to know which test to take.

          The "Aage Kahan Jaayein" links used to be a LabRelatedLinks band of
          their own below this. They are now rendered inside the guide, at the
          end of its reading column: the home page is already a long stack of
          bands, and a third one made of nothing but links was the easiest to
          fold in without losing a single href. Built from the live lists, so
          nothing in it can 404 — see homeRelatedLinks in src/data/home.js. */}
      <LabContent
        city="Purvanchal"
        sections={HOME_CONTENT}
        related={homeRelatedLinks(cities, guides)}
      />

      {/* The collapsed index that closes the page: every city we serve, every
          locality, and the site's own pages. Native <details>, so it costs no
          client JS and needs no Google-Translate guard — see the component. */}
      <LabQuickLinks cities={cities} />

      {/* Floats over everything, bottom-right, dismissible — the shortcut for a
          reader who decides mid-scroll. Same number the strips above dial. */}
      <FloatingCallButton phone={LAB_PHONE} />

      {/* How the visit actually works, under the guide — the same component and
          the same five steps the city pages carry, so the procedure never reads
          differently depending on where a patient landed. Copy is HOME_HOW_TO in
          src/data/home.js; read the note above it about HOME_STEPS before
          switching HomeSteps back on. */}
    </>
  );
}
