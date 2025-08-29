'use client'
import React from 'react'

const Partners = () => {
  return (
    <div className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Main heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] text-[#696C78] text-center font-medium mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-[24px] leading-tight">
        <span className="text-[#7052FF]">50+</span> Partners
      </h1>
      
      {/* Subtitle */}
      <p className="text-center text-[#4A4A4A] text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-[89px] leading-relaxed max-w-3xl mx-auto">
        <span className="font-bold">Just launched,</span> trusted us for their hiring needs from Our Community
      </p>
      
      {/* Companies logos with animation */}
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6 md:p-8 shadow-sm mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-32">
        <div className="animate-slideX flex items-center justify-center">
          {/* First set of logos */}
          <img
            src="/companies.png"
            alt="Partner companies logos including major tech and startup companies"
            className="w-full max-w-6xl h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 mr-8"
          />
          {/* Second set of logos for seamless loop */}
          <img
            src="/companies.png"
            alt="Partner companies logos including major tech and startup companies"
            className="w-full max-w-6xl h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
        
        {/* Subtle overlay gradients for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
      
      {/* Custom CSS for animation */}
      <style jsx>{`
        @keyframes slideX {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-slideX {
          animation: slideX 30s linear infinite;
          width: 200%; /* Double width to accommodate two sets of logos */
        }

        .animate-slideX:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

export default Partners