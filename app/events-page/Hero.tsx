import React from 'react'

const Hero = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 lg:pt-32 xl:pt-[158px] pb-8 sm:pb-12 md:pb-16 lg:pb-20">
      {/* Main heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] font-bold text-[#4A4A4A] text-center leading-tight max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-[40px]">
        Our Speakers, Your Inspiration
      </h1>
      
      {/* Subtitle */}
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[20px] text-[#4A4A4A] text-center max-w-3xl mx-auto leading-relaxed opacity-90">
        Learn directly from people making an impact in the field.
      </p>
    </div>
  )
}

export default Hero