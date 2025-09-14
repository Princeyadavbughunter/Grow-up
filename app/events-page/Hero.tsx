import React from 'react'

const Hero = () => {
  return (
    <div className="px-2 sm:px-3 lg:px-4 pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-[80px] pb-4 sm:pb-6 md:pb-8 lg:pb-10">
      {/* Main heading */}
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold bg-gradient-to-r from-[#FFFFFF] via-[#E9DAFF] to-[#FFFFFF] text text-[#4A4A4A] leading-tight mb-6 sm:mb-8 max-w-4xl mx-auto py-2 sm:py-4 md:py-6 lg:py-8 px-6 sm:px-8 md:px-12 rounded-2xl sm:rounded-3xl text-center">
        Our Speakers, Your Inspiration
      </h1>

      {/* Subtitle */}
      <p className="text-md sm:text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-[32px] text-[#4A4A4A] text-center max-w-3xl mx-auto leading-relaxed opacity-90">
        Learn directly from people making an impact in the field.
      </p>
    </div>
  )
}

export default Hero