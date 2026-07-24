import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE),

  title: {
    default:
      "MedicoBharat | Online Medicine Delivery & Trusted Pharmacy Services",
    template: "%s | MedicoBharat",
  },

  description:
    "MedicoBharat is a trusted online medicine delivery platform providing genuine medicines, prescription support, healthcare products, and fast doorstep pharmacy delivery across Deoria and nearby cities.",

  keywords: [
    // BRAND
    "MedicoBharat",
    "Medico Bharat",
    "MedicoBharat Pharmacy",

    // PRIMARY
    "Online Medicine Delivery",
    "Online Pharmacy",
    "Medicine Home Delivery",
    "Online Medical Store",
    "Buy Medicines Online",

    // HIGH INTENT
    "Prescription Medicine Delivery",
    "Emergency Medicine Delivery",
    "Doorstep Medicine Delivery",
    "24x7 Medicine Delivery",
    "Healthcare Products Online",

    // LOCAL
    "Medicine Delivery in Deoria",
    "Online Pharmacy Deoria",
    "Medical Store Deoria",
    "Medicine Delivery Uttar Pradesh",

    // TRUST
    "Trusted Online Pharmacy",
    "Genuine Medicines",
    "Fast Pharmacy Delivery",
    "Healthcare Platform India",
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
    "Online Pharmacy, Medicine Delivery & Healthcare Platform",

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

    title:
      "MedicoBharat | Online Medicine Delivery & Trusted Pharmacy",

    description:
      "Order genuine medicines online with fast doorstep delivery, prescription support, and trusted pharmacy services from MedicoBharat.",

    images: [
      {
        url: `${SITE}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "MedicoBharat - Online Medicine Delivery",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "MedicoBharat | Online Medicine Delivery & Pharmacy",

    description:
      "Trusted online pharmacy with genuine medicines, prescription support, and fast doorstep medicine delivery.",

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
    coverage: "India",
    target:
      "Online Medicine Delivery & Healthcare Users",
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

        {/*
          Google Translate crash guard (React issue #11538).

          The lab pages are written in Hinglish, so Chrome/Edge offer to
          "Translate this page". The browser translator swaps text nodes for
          <font> wrappers behind React's back. The next time an accordion
          (LabFaq / LabContent "Read More") re-renders, React calls
          removeChild / insertBefore on a node the translator already moved and
          throws "NotFoundError: Failed to execute 'removeChild' on 'Node'",
          which surfaces only as commitMutationEffectsOnFiber in the stack and
          takes the whole page down.

          Patching these two DOM methods to no-op on a parent mismatch turns
          that fatal throw into a harmless skip. Must run before hydration, so
          it is an inline <head> script, not next/script.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof Node!=="function"||!Node.prototype)return;var r=Node.prototype.removeChild;Node.prototype.removeChild=function(c){return c.parentNode!==this?c:r.apply(this,arguments)};var i=Node.prototype.insertBefore;Node.prototype.insertBefore=function(n,ref){return ref&&ref.parentNode!==this?n:i.apply(this,arguments)}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">

        {/* MEDICAL BUSINESS SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Pharmacy",
              "name": "MedicoBharat",
              "url": SITE,
              "image": `${SITE}/navbar/navbg.webp`,
              "description": "Online medicine delivery service in Deoria with fast doorstep delivery and genuine medicines.",
              "telephone": "+916392108234",
              "priceRange": "₹₹",
              "openingHours": "Mo-Su 00:00-23:59",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Deoria",
                "addressRegion": "Uttar Pradesh",
                "postalCode": "274001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "26.5017",
                "longitude": "83.7794"
              },
              "areaServed": {
                "@type": "City",
                "name": "Deoria"
              },
              "sameAs": [
                "https://www.instagram.com/medicobharat_01/",
                "https://www.facebook.com/profile.php?id=61591803531075"
              ]
            }),
          }}
        />

        {children}
      </body>
    </html>
  );
}
