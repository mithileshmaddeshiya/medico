import FAQDeoria from '@/components/CityFaq'
import HeroImage from '@/components/CityHero'
import StatBanner from '@/components/CityStatsimg'
import FinalCTA from '@/components/Cta'
import HowItWorks from '@/components/HowCity'
import Reviews from '@/components/Review'
import React from 'react'

const page = () => {
  return (
    <div className='pt-25'>
      <HeroImage />
      <HowItWorks />
      <StatBanner />
      <Reviews />
      <FinalCTA />
      <FAQDeoria />
    </div>
  )
}

export default page