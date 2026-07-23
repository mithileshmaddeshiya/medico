"use client";

import Hero from "@/components/medicine/Hero";
import CityInterlinking from "@/components/medicine/cityData";
import BannerImage from "@/components/medicine/BannerImage";
import Reviews from "@/components/medicine/Review";
import HowItWorks from "@/components/medicine/HowCity";
import MedicoBharatSEOSection from "@/components/medicine/MetakeyDeoria";
import FinalCTA from "@/components/medicine/Cta";
import CitySEOContent from "@/components/medicine/ContentPage";
import TrustSection from "@/components/medicine/HowWork";
import FAQ from "@/components/medicine/Faq";
import LatestBlogs from "@/components/medicine/LatestBlogs";
import LabTestPromo from "@/components/medicine/LabTestPromo";
import { homeData } from "@/data/homeData";

// `labCity` comes from page.js (a server component) — this file is "use client"
// and cannot read Firestore itself.
export default function HomeDataProvider({ labCity }) {
  const data = homeData;

  return (
    <>
      <Hero data={data} />
      {/* Straight under the hero: the strongest in-body link the site can give
          the lab section, and the first thing a visitor sees after the fold. */}
      <LabTestPromo city={labCity} />
      <CityInterlinking data={data} />
      <LatestBlogs />
      <BannerImage data={data} />
      {/* <Reviews data={data} /> */}
      <HowItWorks data={data} />
      <MedicoBharatSEOSection data={data} />
      <FinalCTA data={data} />
      <CitySEOContent data={data} />
      <TrustSection />
      <FAQ data={data} />
      {/* No <Footer /> here — the (main) layout already renders one, and having
          both put two full footers (and two copies of every footer link) into
          the homepage's HTML. */}
    </>
  );
}
