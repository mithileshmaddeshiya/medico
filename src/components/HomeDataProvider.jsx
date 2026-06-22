"use client";

import Hero from "@/components/Hero";
import CityInterlinking from "@/components/cityData";
import BannerImage from "@/components/BannerImage";
import Reviews from "@/components/Review";
import HowItWorks from "@/components/HowCity";
import MedicoBharatSEOSection from "@/components/MetakeyDeoria";
import FinalCTA from "@/components/Cta";
import CitySEOContent from "@/components/ContentPage";
import TrustSection from "@/components/HowWork";
import FAQ from "@/components/Faq";
import Footer from "@/components/Footer";
import LatestBlogs from "@/components/LatestBlogs";
import { homeData } from "@/data/homeData";

export default function HomeDataProvider() {
  const data = homeData;

  return (
    <>
      <Hero data={data} />
      <CityInterlinking data={data} />
      <LatestBlogs />
      <BannerImage data={data} />
      <Reviews data={data} />
      <HowItWorks data={data} />
      <MedicoBharatSEOSection data={data} />
      <FinalCTA data={data} />
      <CitySEOContent data={data} />
      <TrustSection />
      <FAQ data={data} />
      <Footer data={data} />
    </>
  );
}
