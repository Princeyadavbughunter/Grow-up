import LandingFooter from '@/components/LandingFooter'
import LandingNav from '@/components/LandingNav'
import React from 'react'
import Hero from './Hero'
import Partners from './Partners'
import Talentpool from './Talentpool'
import Toptalent from './Toptalent'
import LandingTestimonials from '@/components/LandingTestimonials'
import LandingFaqs from '@/components/LandingFaqs'
import WhyUs from './WhyUs'

const page = () => {
  return (
    <div className="font-work-sans">
         <LandingNav/>
          <Hero/>
          <Toptalent/>
          <Partners/>
          <WhyUs/>
          <Talentpool/>
          <LandingTestimonials/>
          <LandingFaqs/>
          {/* <Banner/> */}
         <LandingFooter/>
    </div>
  )
}

export default page
