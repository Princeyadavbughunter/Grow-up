import React from 'react'

const Hero = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Main heading */}
      <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] text-center text-[#4A4A4A] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-[500px] mx-auto leading-tight mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-[15px]">
        Empower your journey to grow with
      </h1>
      
      {/* Subtitle */}
      <p className="text-[#5A4862] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[20px] text-center leading-relaxed opacity-90 max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-[46px]">
        Unlock your potential and accelerate your professional growth
      </p>
      
      {/* CTA Button */}
      <div className="flex justify-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-[77px]">
        <button className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-3 sm:py-4 md:py-5 lg:py-6 xl:py-4 bg-[#7052FF] hover:bg-[#5d42e6] active:bg-[#4a35cc] text-white font-bold rounded-lg sm:rounded-xl md:rounded-2xl text-base sm:text-lg md:text-xl lg:text-2xl xl:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#7052FF]/30">
          Hire Now
        </button>
      </div>
    </div>
  )
}

export default Hero