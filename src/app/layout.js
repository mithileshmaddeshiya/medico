import "./globals.css";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { graph, ldJson, organizationNode, websiteNode } from "@/lib/schema";
import { SITE } from "@/lib/site";

/**
 * SITE-WIDE METADATA.
 *
 * ── READ THIS BEFORE CHANGING A WORD OF IT ────────────────────────────────
 * Every string here used to describe an online pharmacy: the default title,
 * the description, twenty-odd medicine keywords, the OG card, and the
 * `classification` line. Those are what a crawler reads on EVERY route of the
 * site, including all three lab city pages — so the lab section was
 * effectively publishing "we are a medicine delivery platform" on pages about
 * blood tests, and then wondering why it did not rank for lab test queries.
 *
 * MedicoBharat is a lab-test service. The medicine section is retired and its
 * URLs are permanently redirected (see next.config.mjs). Nothing on this site
 * may describe it as a pharmacy again.
 *
 * The `default` title only ever shows on a route that sets no title of its
 * own — every real page sets one. The `template` is what matters: it appends
 * " | MedicoBharat" to each page's own title, which is why the city titles in
 * src/data/lab/cities.js are kept short enough to survive it.
 */
export const metadata = {
  metadataBase: new URL(SITE),

  title: {
    default: "MedicoBharat | Lab Test at Home with Free Sample Collection",
    template: "%s | MedicoBharat",
  },

  description:
    "MedicoBharat books lab tests and full body health checkups with free home sample collection — CBC, thyroid, sugar, vitamin and organ function tests. Trained phlebotomists, reports in 24 hours, across Varanasi, Gorakhpur and Deoria.",

  keywords: [
    // BRAND — the reason this list exists at all. Google was spell-correcting
    // "medicobharat" to "medical bharat"; see src/lib/schema.js.
    "MedicoBharat",
    "Medico Bharat",
    "MedicoBharat Lab Test",

    // PRIMARY
    "Lab Test at Home",
    "Blood Test at Home",
    "Home Sample Collection",
    "Online Lab Test Booking",
    "Pathology Lab",
    "Diagnostic Centre",

    // HIGH INTENT — a searcher who types these has already decided
    "Full Body Checkup at Home",
    "CBC Test",
    "Thyroid Profile Test",
    "Blood Sugar Test",
    "HbA1c Test",
    "Lipid Profile Test",
    "Vitamin D Test",
    "Vitamin B12 Test",
    "Liver Function Test",
    "Kidney Function Test",
    "Dengue Test",

    // LOCAL — the three districts the service actually reaches
    "Lab Test in Varanasi",
    "Lab Test in Gorakhpur",
    "Lab Test in Deoria",
    "Blood Test Home Collection Uttar Pradesh",

    // Location-free — Google supplies the city from the searcher's position,
    // which the DiagnosticLab schema's areaServed answers.
    "Lab Test Near Me",
    "Blood Test Near Me",
    "Full Body Checkup Near Me",
  ],

  authors: [
    {
      name: "MedicoBharat",
    },
  ],

  creator: "MedicoBharat",

  publisher: "MedicoBharat",

  applicationName: "MedicoBharat",

  category: "Healthcare",

  classification:
    "Diagnostic Lab, Lab Test at Home & Health Checkup Service",

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: SITE,
  },

  openGraph: {
    type: "website",

    url: SITE,

    siteName: "MedicoBharat",

    locale: "en_IN",

    title: "MedicoBharat | Lab Test at Home with Free Sample Collection",

    description:
      "Book a lab test or full body checkup with free home sample collection. Trained phlebotomists, slots from 6 AM and reports in 24 hours on WhatsApp.",

    images: [
      {
        url: `${SITE}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "MedicoBharat — lab test at home with free sample collection",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "MedicoBharat | Lab Test at Home",

    description:
      "Lab tests and full body checkups with free home sample collection and reports in 24 hours.",

    images: [
      `${SITE}/opengraph-image`,
    ],
  },

  verification: {
    google:
      "LrAb_C1IjlUf70mhPXMzFJsg0pmpiPp6PhRKu_kVPR8",
  },

  icons: {
    icon: "/favicon/medicofav.ico",
    shortcut: "/favicon/medicofav.ico",
    apple: "/favicon/medicofav.ico",
  },

  other: {
    locality: "Deoria",
    region: "Uttar Pradesh",
    country: "India",
    coverage: "Varanasi, Gorakhpur, Deoria",
    target: "Lab Test & Health Checkup Users",
  },
};

export default function RootLayout({ children }) {



  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <meta name="google-site-verification" content="LrAb_C1IjlUf70mhPXMzFJsg0pmpiPp6PhRKu_kVPR8" />
      </head>
      <body className="min-h-full flex flex-col">

        {/*
          Google Translate crash guard (React issue #11538).

          The lab pages are written in Hinglish, so Chrome/Edge offer to
          "Translate this page". The browser translator swaps text nodes for
          <font> wrappers behind React's back. The next time an accordion
          (LabFaq / LabContent "Read More") re-renders, React calls
          removeChild / insertBefore on a node the translator already moved and
          throws "NotFoundError: Failed to execute 'removeChild' on 'Node'",
          which surfaces only as commitMutationEffectsOnFiber and crashes the page.

          Patching these two DOM methods to no-op on a parent mismatch turns the
          fatal throw into a harmless skip. It must be in place before hydration,
          so it runs via next/script "beforeInteractive" — a raw inline <script>
          in the React tree is not executed on the client (Next.js warns about it).
        */}
        <Script id="translate-crash-guard" strategy="beforeInteractive">
          {`(function(){if(typeof Node!=="function"||!Node.prototype)return;var r=Node.prototype.removeChild;Node.prototype.removeChild=function(c){return c.parentNode!==this?c:r.apply(this,arguments)};var i=Node.prototype.insertBefore;Node.prototype.insertBefore=function(n,ref){return ref&&ref.parentNode!==this?n:i.apply(this,arguments)}})();`}
        </Script>

        {/*
          BRAND ENTITY — the Organization and the WebSite.

          Both carry stable ids from src/lib/schema.js, and every other node on
          the site references those ids instead of repeating a nameless stub.
          That is the whole trick: one entity, many references. Google held no
          entity for the name "MedicoBharat" at all — a brand search was being
          spell-corrected to "medical bharat" — and a stub that shares a name
          but carries no identifier is something a crawler cannot connect.

          It renders on every route on purpose. The organisation is the same
          organisation on /lab-test/deoria as it is here, and repeating the
          identical `@id` across pages is how a crawler learns that.

          ── WHAT WAS REMOVED FROM THIS GRAPH ─────────────────────────────
          A third node used to sit here: a `Pharmacy` with a Deoria street
          address, geo coordinates and `openingHours: "Mo-Su 00:00-23:59"`. It
          was the single strongest machine-readable statement that this domain
          is an online pharmacy, it was on EVERY page including the lab city
          pages, and one of its claims (open 24 hours) was not even true.

          Its replacement is the `DiagnosticLab` / `MedicalBusiness` node on the
          home page — same business, typed as what it actually is, with the
          hours the site really keeps and the price list the page really shows.
          It lives on the home page rather than in this layout because the city
          pages already declare their own local node, and two overlapping
          local-business nodes on one page describe two businesses.

          DO NOT ADD A PHARMACY NODE BACK. The medicine section is retired and
          its URLs are permanently redirected — see next.config.mjs.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: ldJson(graph(organizationNode(), websiteNode())),
          }}
        />

        {children}

        {/*
          One toast host for the whole app — react-hot-toast renders into its
          own fixed container, so a form anywhere in the tree can call
          toast() without mounting anything of its own.

          The package ships its own "use client", so it drops straight into
          this Server Component; every prop below is a plain serializable
          object, which is what the client boundary requires.

          top-center, not the default corner: the lab booking form opens inside
          a modal, and a toast in the top-right of a wide desktop screen sits
          far away from the field the patient is looking at.
        */}
        <Toaster
          position="top-center"
          gutter={8}
          toastOptions={{
            duration: 3500,
            // Same surface as the navbar and the lab cards: white, a hairline
            // emerald ring and a soft lifted shadow — written as a two-layer
            // box-shadow because react-hot-toast takes inline styles, not
            // Tailwind's ring utilities. Was a dark slate pill, which looked
            // borrowed from another site sitting on the emerald-50 hero.
            style: {
              background: "#ffffff",
              color: "#0f172a", // slate-900, the body text colour
              fontSize: "13px",
              fontWeight: 600,
              lineHeight: "1.45",
              borderRadius: "12px",
              padding: "10px 14px",
              maxWidth: "22rem",
              boxShadow:
                "0 0 0 1px rgba(16,185,129,0.22), 0 12px 30px -12px rgba(15,23,42,0.28)",
            },
            // Tick in the brand green; the cross stays red — a validation
            // problem has to read as a problem, theme or no theme.
            success: { iconTheme: { primary: "#059669", secondary: "#fff" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
