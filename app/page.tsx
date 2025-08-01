import LandingNav from '@/components/LandingNav'
import React from 'react'
import Community from './landing/Community'
import Future from './landing/Future'
import Download from './landing/Download'
import LandingFooter from '@/components/LandingFooter'
import Faqs from './landing/Faqs'
import LandingTestimonials from '@/components/LandingTestimonials'
import LandingFaqs from '@/components/LandingFaqs'
import Header from './landing/Header'
import Counter from './landing/Counter'

const Home = () => {
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

export default Home