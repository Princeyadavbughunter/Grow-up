import React from 'react'

const ExploreGigs = () => {
  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      {/* Main heading */}
      <h1 className="font-bold text-[#5A4862] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[48px] leading-tight max-w-4xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
        Take the first step toward your next big freelance gig.
      </h1>
      
      {/* CTA Button */}
      <div className="flex justify-center items-center mb-6 sm:mb-8 md:mb-12">
        <button className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[40px] text-white flex items-center justify-center py-3 sm:py-4 md:py-5 lg:py-6 xl:py-[12px] px-6 sm:px-8 md:px-10 lg:px-12 xl:px-[24px] rounded-3xl bg-[#7052FF] hover:bg-[#5d42e6] transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#7052FF]/30">
          Explore Gig
        </button>
      </div>
      
      {/* Tagline */}
      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[32px] font-medium text-center text-[#5A4862] opacity-90">
        Freelancing made simple
      </p>
    </div>
  )
}

export default ExploreGigs