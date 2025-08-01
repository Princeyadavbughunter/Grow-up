// @ts-nocheck
import React from 'react'
import Hero from './Hero'
import LandingNav from '@/components/LandingNav'
import LandingFooter from '@/components/LandingFooter'
import TeamMemberCard from './TeamMemberCard'
import Unique from './Unique'
import Upcoming from './Upcoming'
import LandingFaqs from '@/components/LandingFaqs'
import LandingTestimonials from '@/components/LandingTestimonials'
import  Banner  from './Banner'


const page = () => {
  return (
    <div>
      <LandingNav/>
        <Hero/>
        <TeamMemberCard/>
        <Upcoming/>
        <Unique/>
        <LandingTestimonials/>
        <LandingFaqs/>
        <Banner/>
      <LandingFooter/>
    </div>
  )
}

export default page
