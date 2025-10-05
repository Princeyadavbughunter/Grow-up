"use client"
import React from 'react'

const Banner = () => {
  return (
    <div className="flex flex-col items-center pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Decorative dashed border */}
      <div className="border-t border-dashed border-gray-400 w-16 sm:w-20 md:w-24 lg:w-32 mb-6 sm:mb-8 md:mb-10 lg:mb-12" />
      
      {/* Main heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[58px] font-bold text-[#5A4862] text-center leading-tight max-w-6xl mx-auto mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-[70px]">
        Don't miss out on our next event!
      </h1>
      
      {/* CTA Button */}
      <button className="bg-[#7052FF] hover:bg-[#5d42e6] active:bg-[#4a35cc] text-white font-semibold rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#7052FF]/30 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[40px] px-6 sm:px-8 md:px-10 lg:px-12 xl:px-[17px] py-3 sm:py-4 md:py-5 lg:py-6 xl:py-[17px] mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-[70px]">
        Register now
      </button>
      
      {/* Supporting text */}
      <p className="text-[#5A4862] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[32px] font-medium text-center leading-relaxed max-w-3xl mx-auto opacity-90">
        to stay updated and be part of the GrowUp Buddy community
      </p>
    </div>
  )
}

export default Banner