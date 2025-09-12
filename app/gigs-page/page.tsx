import LandingFooter from '@/components/LandingFooter'
import LandingNav from '@/components/LandingNav'
import React from 'react'
import Hero from './Hero'
import Featuredgig from './Featuredgig'
import Different from './Different'
import Testimonials from './Testimonials'
import ExploreGigs from './ExploreGigs'
import LandingFaqs from '@/components/LandingFaqs'
import LandingTestimonials from '@/components/LandingTestimonials'

const page = () => {
  return (
    <div className="font-work-sans">
          <LandingNav/>
          <Hero/>
          <Featuredgig/>
          <Different/>
          <LandingTestimonials/>
          <LandingFaqs/>
          <ExploreGigs/>
          <LandingFooter/>
    </div>
  )
}

export default page
