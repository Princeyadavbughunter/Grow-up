import React from 'react'
import Image from 'next/image'

const Hero = () => {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
      
      {/* Main Hero Container */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl sm:rounded-3xl lg:rounded-4xl overflow-hidden shadow-2xl">
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/bg-landingNav.png"
            alt="Hero background showcasing job opportunities"
            fill
            className="object-cover opacity-40"
            quality={100}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-[#7052FF]/60"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          
          {/* Main Content */}
          <div className="text-center max-w-5xl mx-auto">
            
            {/* Main Heading */}
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-relaxed xl:leading-relaxed mb-4 sm:mb-6 md:mb-8">
              Explore a{' '}
              <span className="bg-gradient-to-r from-[#7052FF] via-[#8B5FFF] to-blue-500 bg-clip-text text-transparent relative">
                wide range of job
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#7052FF] to-blue-500 rounded-full opacity-50"></div>
              </span>{' '}
              opportunities tailored to your skills and interests.
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto font-light">
              Whether you're looking for freelance gigs, internships, or full-time positions, GrowUp Buddy has something for everyone.
            </p>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center">
              
              {/* Primary CTA */}
              <button className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#7052FF] to-blue-600 hover:from-[#5a42d4] hover:to-blue-700 text-white font-semibold text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#7052FF]/30 focus:ring-opacity-50 w-full sm:w-auto">
                <span>Explore Opportunities</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
              
              {/* Secondary CTA */}
              <button className="group inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 hover:border-white/50 font-semibold text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/20 w-full sm:w-auto">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Learn More</span>
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 sm:mt-12 md:mt-16">
              <p className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6 font-medium">
                Trusted by professionals worldwide
              </p>
              
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#7052FF] mb-1">
                    50K+
                  </div>
                  <div className="text-xs text-gray-300">
                    Active Users
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400 mb-1">
                    25K+
                  </div>
                  <div className="text-xs text-gray-300">
                    Jobs Posted
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400 mb-1">
                    98%
                  </div>
                  <div className="text-xs text-gray-300">
                    Success Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 mb-1">
                    4.9★
                  </div>
                  <div className="text-xs text-gray-300">
                    User Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-6 left-6 w-12 h-12 bg-[#7052FF] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-6 right-6 w-16 h-16 bg-blue-500 rounded-full opacity-15 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-white rounded-full opacity-40 animate-ping"></div>
        <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-[#7052FF]/60 rounded-full opacity-30 animate-ping delay-700"></div>
        
        {/* Floating Icons */}
        <div className="hidden lg:block absolute top-12 right-12 opacity-20 animate-bounce">
          <svg className="w-8 h-8 text-[#7052FF]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div className="hidden lg:block absolute bottom-12 left-12 opacity-20 animate-bounce delay-500">
          <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </div>
    </section>
  )
}

export default Hero