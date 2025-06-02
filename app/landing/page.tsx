import LandingNav from '@/components/LandingNav'
import React from 'react'
import Community from './Community'
import Future from './Future'
import Download from './Download'
import LandingFooter from '@/components/LandingFooter'
import Faqs from './Faqs'
import LandingTestimonials from '@/components/LandingTestimonials'
import LandingFaqs from '@/components/LandingFaqs'
import Header from './Header'
import Counter from './Counter'

const page = () => {
  return (
    <div>
        <LandingNav/>
        <Header/>
        <Community/>
        <Future/>
        <Download/>
        <LandingTestimonials/>
        <Counter/>
        <LandingFaqs/>
        <LandingFooter/>
    </div>
  )
}

export default page
