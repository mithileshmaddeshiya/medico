import Link from "next/link";
import { ArrowRight, Clock3, MapPin, Phone } from "lucide-react";

import { LAB_PHONE } from "@/data/lab/defaults";
import { coverage } from "@/lib/coverage";
import { getLabCities } from "@/lib/labCities";
import { ORG_REF, WEBSITE_ID, graph, ldJson } from "@/lib/schema";
import { SITE, url } from "@/lib/site";

/**
 * /lab-test — the city index.
 *
 * ── WHY THIS PAGE EXISTS ──────────────────────────────────────────────────
 * `/lab-test/<city>` served six pages and `/lab-test` itself was a 404. Two
 * costs followed from that.
 *
 * The first is crawl shape. The only paths into the six city pages were the
 * sitewide footer and a handful of in-body links. Google discounts footer links
 * relative to header and in-content ones, so the section's most commercially
 * valuable pages were reachable only by the weakest form of internal linking the
 * site has. A hub gives them one parent that links every one of them with a
 * descriptive anchor, and gives the header somewhere to point.
 *
 * The second is the query it leaves on the table. Every city page targets
 * "lab test in <town>". Nothing targeted "lab test at home" without a town
 * attached — except the home page, which is busy being the booking page. This
 * page can hold that query without competing with any city.
 *
 * ── WHY IT IS NOT A CARD GRID AND NOTHING ELSE ────────────────────────────
 * A page whose entire content is six links is a doorway page, and Google treats
 * it as one. Each row carries that town's real localities, read from the same
 * city data the pages themselves use — so the hub genuinely answers "do you
 * cover my area", which is the actual question behind the search.
 */
export const metadata = {
  // 52 chars before the root layout appends " | MedicoBharat".
  title: "Lab Test at Home — Cities We Serve",

  description:
    "MedicoBharat kin sheher me ghar se lab test sample collect karta hai — har jile ke area, popular test aur booking number ek jagah par.",

  keywords: [
    "lab test at home cities",
    "home sample collection cities",
    "MedicoBharat cities",
    "blood test at home Uttar Pradesh",
    "pathology lab home collection Purvanchal",
  ],

  alternates: { canonical: url("/lab-test") },

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

  openGraph: {
    type: "website",
    title: "Lab Test at Home — Cities We Serve",
    description:
      "Har sheher ke area, popular test aur booking number — MedicoBharat home sample collection.",
    url: url("/lab-test"),
    siteName: "MedicoBharat",
    locale: "en_IN",
  },
};

export default async function LabTestIndexPage() {
  const cities = await getLabCities();

  const pageUrl = url("/lab-test");

  /* ── Structured data ────────────────────────────────────────────────────
     A CollectionPage with an ItemList, not a LocalBusiness. This page is not a
     seventh branch — it is the index of the six that exist, and typing it as a
     business would put a nameless duplicate lab in the graph alongside them.

     The ItemList is what tells a crawler these six URLs are members of one set
     rather than six unrelated pages that happen to be linked together, which is
     what stops them being read as near-duplicates of each other. */
  const ids = {
    page: `${pageUrl}#webpage`,
    list: `${pageUrl}#cities`,
    breadcrumb: `${pageUrl}#breadcrumb`,
  };

  const jsonLd = graph(
    {
      "@type": "CollectionPage",
      "@id": ids.page,
      url: pageUrl,
      name: "Lab Test at Home — Cities We Serve",
      description: metadata.description,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ids.list },
      breadcrumb: { "@id": ids.breadcrumb },
      inLanguage: ["hi-IN", "en-IN"],
      publisher: ORG_REF,
    },
    {
      "@type": "ItemList",
      "@id": ids.list,
      name: "MedicoBharat — lab test cities",
      numberOfItems: cities.length,
      itemListElement: cities.map((city, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `Lab Test in ${city.name}`,
        url: `${SITE}/lab-test/${city.slug}`,
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": ids.breadcrumb,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Lab Test", item: pageUrl },
      ],
    }
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }}
      />

      <section className="border-b border-slate-200 bg-linear-to-b from-emerald-50/70 to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 sm:pt-28 pb-10 sm:pb-12">
          {/* Visible breadcrumb — the same trail as the schema above. */}
          <nav aria-label="Breadcrumb" className="text-[12px] text-slate-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-emerald-700">Home</Link>
              </li>
              <li aria-hidden className="text-slate-300">/</li>
              <li className="font-medium text-slate-700">Lab Test</li>
            </ol>
          </nav>

          {/* The page's only h1. Every section below starts at h2. */}
          <h1 className="mt-5 max-w-3xl text-balance text-[28px] min-[400px]:text-[32px] sm:text-[40px] font-extrabold leading-[1.12] tracking-tight text-slate-900">
            Lab test ghar baithe — hum kin sheher me sample collect karte hain
          </h1>

          <p className="mt-3.5 max-w-2xl text-pretty text-[14px] sm:text-[15.5px] leading-relaxed text-slate-600">
            {`Free home sample collection ${coverage()} me. Apna sheher chuniye — us jile ke area, test aur rate list uske page par hai. Slot subah 6 baje se, saaton din, aur report 24 ghante me.`}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={`tel:${LAB_PHONE.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-emerald-700"
            >
              <Phone aria-hidden className="h-4 w-4" />
              {LAB_PHONE}
            </a>

            <span className="inline-flex items-center gap-1.5 text-[12.5px] text-slate-500">
              <Clock3 aria-hidden className="h-3.5 w-3.5" />
              Collection 6 AM – 9 PM
            </span>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="cities-heading"
        className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14"
      >
        <h2
          id="cities-heading"
          className="text-[21px] sm:text-[26px] font-extrabold tracking-tight text-slate-900"
        >
          {`${cities.length} jile, ek hi service`}
        </h2>

        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-slate-600">
          Har sheher ka apna page hai — usme us jile ke area, wahan sabse zyada
          book hone wale test aur poori rate list milegi.
        </p>

        {/* Each row carries the town's real localities, read from the same data
            the city pages use. That is what keeps this a useful page rather than
            a list of six links — a reader's actual question is "do you come to
            my mohalla", and this answers it before they click. */}
        <ul className="mt-7 grid gap-4 sm:grid-cols-2">
          {cities.map((city) => (
            <li key={city.slug}>
              <Link
                href={`/lab-test/${city.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-[0_12px_30px_-18px_rgba(6,78,59,.45)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[16px] font-bold leading-snug text-slate-900">
                    {`Lab Test in ${city.name}`}
                  </h3>
                  <ArrowRight
                    aria-hidden
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 transition-transform group-hover:translate-x-0.5"
                  />
                </div>

                <p className="mt-1.5 text-[12px] font-medium uppercase tracking-wide text-emerald-700">
                  {city.state}
                </p>

                {city.areas?.length > 0 && (
                  <p className="mt-3 flex gap-2 text-[12.5px] leading-relaxed text-slate-600">
                    <MapPin
                      aria-hidden
                      className="mt-[3px] h-3.5 w-3.5 shrink-0 text-slate-400"
                    />
                    {/* Six localities, then a count. The full list is on the
                        city page; repeating all of it here would make this page
                        a duplicate of six pages at once. */}
                    <span>
                      {city.areas.slice(0, 6).join(" · ")}
                      {city.areas.length > 6 &&
                        ` +${city.areas.length - 6} aur area`}
                    </span>
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-[13.5px] leading-relaxed text-slate-600">
          Aapka sheher list me nahi hai?{" "}
          <a
            href={`tel:${LAB_PHONE.replace(/[^+\d]/g, "")}`}
            className="font-semibold text-emerald-700 underline underline-offset-2"
          >
            {LAB_PHONE}
          </a>{" "}
          par call kijiye — aas-paas ke jile me collection ho sakta hai, hum
          confirm kar denge.
        </p>
      </section>
    </>
  );
}
