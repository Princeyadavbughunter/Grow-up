//@ts-nocheck
'use client'
import LandingNav from '@/components/LandingNav'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Community from './landing/Community'
import Future from './landing/Future'
import Download from './landing/Download'
import LandingFooter from '@/components/LandingFooter'
import Faqs from './landing/Faqs'
import LandingTestimonials from '@/components/LandingTestimonials'
import LandingFaqs from '@/components/LandingFaqs'
import Header from './landing/Header'
import Counter from './landing/Counter'

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 text-lg">Loading...</p>
    </div>
  </div>
)

const Home = () => {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState<boolean>(true)

  useEffect(() => {
    // Check if user is authenticated by checking for access token
    const accessToken = Cookies.get('access_token')
    const refreshToken = Cookies.get('refresh_token')
    
    if (accessToken && refreshToken) {
      // User is authenticated, redirect to explore page
      router.push('/explore')
    } else {
      // User is not authenticated, show landing page
      setIsChecking(false)
    }
  }, [router])

  // Show loading spinner while checking authentication
  if (isChecking) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-white font-work-sans">
        <LandingNav/>
        <Header/>
        <div className="space-y-8 sm:space-y-12 md:space-y-16"> 
          <Community/>
          <Future/>
          <Download/>
          <LandingTestimonials/>
          <Counter/>
          <LandingFaqs/>
        </div>
        <LandingFooter/>
    </div>
  )
}

export default Home