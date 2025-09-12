import React from 'react'

const Hero = () => {
  return (
    <div className="px-2 sm:px-3 lg:px-4 pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-[80px] pb-4 sm:pb-6 md:pb-8 lg:pb-10">
      {/* Main heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[80px] font-bold bg-gradient-to-r from-[#FFFFFF] via-[#E9DAFF] to-[#FFFFFF] text-[#7052FF] text-[#4A4A4A] text-center leading-tight max-w-6xl mx-auto mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-[40px]">
        Our Speakers, Your Inspiration
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-[32px] text-[#4A4A4A] text-center max-w-3xl mx-auto leading-relaxed opacity-90">
        Learn directly from people making an impact in the field.
      </p>
    </div>
  )
}

export default Hero