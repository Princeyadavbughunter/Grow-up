import React from 'react'
import Image from 'next/image'
const Community = () => {
  return (
    <div>
      <div className='text-[#7052FF] sm:mt-[200px] mt-[100px] text-center flex flex-col mb-[120px] items-center px-4 sm:px-6 lg:px-8'>
        <h1 className='sm:text-[56px] md:text-[64px] text-[36px] lg:text-[72px] font-bold leading-tight mb-4'>Join a Global Community</h1>
        <p className='sm:text-[42px] md:text-[48px] text-[28px] lg:text-[54px] font-light leading-tight mb-8'>of Aspiring Change Makers</p>
        <p className='text-[#4A4A4A] text-[20px] sm:text-[24px] md:text-[28px] sm:mt-[50px] mt-[30px] font-medium max-w-2xl leading-relaxed'>Our community members are from leading companies and innovative startups worldwide</p>
      </div>
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

export default Community
