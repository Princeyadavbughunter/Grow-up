import React from 'react'
import LandingNav from '@/components/LandingNav'
import LandingFooter from '@/components/LandingFooter'
import Hero from './Hero'
import LandingFaqs from '@/components/LandingFaqs'
import WhyChoose from './WhyChoose'
import ClubPreview from './ClubPreview'
import LandingTestimonials from '@/components/LandingTestimonials'

const page = () => {
  return (
    <div>
      <LandingNav />
      <Hero />
      <WhyChoose />
      <ClubPreview />
      <LandingTestimonials />
      <LandingFaqs />
      <LandingFooter />
    </div>
  )
}

export default page