import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://www.medicobharat.com"),

  title: {
    default:
      "MedicoBharat | Online Medicine Delivery in Deoria",

    template: "%s | MedicoBharat",
  },

  description:
    "MedicoBharat provides fast online medicine delivery in Deoria with genuine medicines, healthcare products, prescription support, and doorstep pharmacy delivery services.",

  keywords: [
    // PRIMARY SEO
    "Online Medicine Delivery in Deoria",
    "Medicine Delivery Deoria",
    "Online Pharmacy Deoria",
    "Medical Store in Deoria",
    "Medicine Home Delivery Deoria",

    // HIGH INTENT
    "Buy Medicines Online",
    "24x7 Medicine Delivery",
    "Prescription Medicine Delivery",
    "Emergency Medicine Delivery",
    "Healthcare Products Online",

    // BRAND
    "MedicoBharat",
    "Medico Bharat Pharmacy",
    "Trusted Pharmacy in Deoria",

    // LOCAL SEO
    "Best Pharmacy in Deoria",
    "Chemist Home Delivery Deoria",
    "Doorstep Medicine Delivery",
    "Online Medical Store Uttar Pradesh",

    // HEALTHCARE
    "Online Healthcare Platform",
    "Genuine Medicines",
    "Fast Pharmacy Delivery",
  ],

  authors: [{ name: "MedicoBharat" }],

  creator: "MedicoBharat",

  publisher: "MedicoBharat",

  applicationName: "MedicoBharat",

  category: "Healthcare",

  classification:
    "Online Pharmacy & Medicine Delivery Platform",

  robots: {
    index: true,
    follow: true,

    nocache: false,

    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://www.medicobharat.com",
  },

  openGraph: {
    type: "website",

    url: "https://www.medicobharat.com",

    title:
      "MedicoBharat | Online Medicine Delivery in Deoria",

    description:
      "Order genuine medicines online in Deoria with fast doorstep delivery, prescription support, and trusted pharmacy services.",

    siteName: "MedicoBharat",

    locale: "en_IN",

    images: [
      {
        url: "/images/og-image.jpg",

        width: 1200,

        height: 630,

        alt:
          "MedicoBharat - Online Medicine Delivery Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "MedicoBharat | Online Medicine Delivery in Deoria",

    description:
      "Fast online pharmacy and medicine delivery service in Deoria with genuine medicines and healthcare support.",

    images: ["/images/og-image.jpg"],
  },

  verification: {
    google:
      "LrAb_C1IjlUf70mhPXMzFJsg0pmpiPp6PhRKu_kVPR8",
  },

  icons: {
    icon: "/favicon/favpan.png",

    shortcut: "/favicon/favpan.png",

    apple: "/favicon/favpan.png",
  },

  other: {
    locality: "Deoria",

    region: "Uttar Pradesh",

    country: "India",

    coverage: "Deoria",

    target:
      "Online Medicine Delivery Users in Deoria",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-site-verification" content="LrAb_C1IjlUf70mhPXMzFJsg0pmpiPp6PhRKu_kVPR8" />
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
              "url": "https://www.medicobharat.com",
              "image": "https://www.medicobharat.com/navbar/navbg.webp",
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
                "https://www.instagram.com/medicobharat",
                "https://www.facebook.com/medicobharat"
              ]
            }),
          }}
        />

        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}