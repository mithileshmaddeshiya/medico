import BannerImage from '@/components/BannerImage'
import FinalCTA from '@/components/Cta'
import FAQ from '@/components/Faq'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import TrustSection from '@/components/HowWork'
import Reviews from '@/components/Review'
import React from 'react'

const page = () => {
  return (
    <div>
        <Hero />
        <TrustSection />
        <BannerImage />
        <Reviews />
        <FinalCTA />
        <FAQ />
        <Footer />
    </div>
  )
}

export default page