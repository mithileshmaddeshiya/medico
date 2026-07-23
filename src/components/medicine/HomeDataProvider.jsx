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
import { homeData } from "@/data/homeData";

export default function HomeDataProvider() {
  const data = homeData;

  return (
    <>
      <Hero data={data} />
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
