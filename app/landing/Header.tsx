'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-8 mt-8">
      <section className="bg-gradient-to-r from-[#23282C] via-[#23282C] to-[#7052FF] w-full min-h-[600px] sm:min-h-[682px] lg:min-h-[732px] rounded-[20px] sm:rounded-[40px] lg:rounded-[80px] flex flex-col justify-center items-center relative overflow-hidden">
      
      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center h-full w-full py-8 sm:py-12 lg:py-16">
        
        {/* Header Text Section */}
        <div className='text-center w-full px-4'>
          <p className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white mb-4 sm:mb-6 lg:mb-8 tracking-wide'>
            Empower your growth
          </p>
          
          {/* Animated Text Container */}
          <div className='relative h-[120px] sm:h-[180px] md:h-[210px] lg:h-[240px] xl:h-[270px] overflow-hidden flex items-center'>
            <div className='animate-scroll-text flex items-center whitespace-nowrap'>
              <h1 className='text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight drop-shadow-2xl text-[#90EE90] mx-8 sm:mx-12 lg:mx-16'>
                Collaborate
              </h1>
              <h1 className='text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight drop-shadow-2xl text-[#FDDF8E] mx-8 sm:mx-12 lg:mx-16'>
                Connect
              </h1>
              <h1 className='text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight drop-shadow-2xl text-[#B19CD9] mx-8 sm:mx-12 lg:mx-16'>
                Earn
              </h1>
              {/* Seamless duplicate for infinite loop */}
              <h1 className='text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight drop-shadow-2xl text-[#90EE90] mx-8 sm:mx-12 lg:mx-16'>
                Collaborate
              </h1>
              <h1 className='text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight drop-shadow-2xl text-[#FDDF8E] mx-8 sm:mx-12 lg:mx-16'>
                Connect
              </h1>
              <h1 className='text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight drop-shadow-2xl text-[#B19CD9] mx-8 sm:mx-12 lg:mx-16'>
                Earn
              </h1>
            </div>
          </div>
        </div>
        
        {/* Call to Action Section */}
        <div className='flex flex-col items-center mt-8 sm:mt-12 lg:mt-16'>

          {/* Profile Images */}
          <div className='flex -space-x-2 mb-4'>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white overflow-hidden">
              <Image
                src='/images/p.png'
                width={48}
                height={48}
                alt='profile'
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white overflow-hidden">
              <Image
                src='/images/p1.png'
                width={48}
                height={48}
                alt='profile'
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white overflow-hidden">
              <Image
                src='/images/p2.png'
                width={48}
                height={48}
                alt='profile'
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Subtitle */}
          <p className='text-white mt-2 mb-6 text-lg sm:text-xl lg:text-2xl font-medium'>
            Create top network
          </p>

          {/* CTA Button */}
          <Link href="/auth/google">
            <button className='bg-[#7052FF] hover:bg-[#5a42d4] active:bg-[#4a36b8] transition-all duration-300 rounded-xl text-white text-lg sm:text-xl font-semibold py-3 sm:py-4 px-8 sm:px-10 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#7052FF] focus:ring-opacity-60'>
              Join now
            </button>
          </Link>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-[#7052FF] rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#FDDF8E] rounded-full opacity-15 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-white rounded-full opacity-40 animate-ping"></div>
      <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-[#7052FF] rounded-full opacity-30 animate-ping delay-700"></div>

      {/* Floating Icons */}
      <div className="hidden lg:block absolute top-20 right-20 opacity-20 animate-bounce">
        <svg className="w-12 h-12 text-[#7052FF]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <div className="hidden lg:block absolute bottom-20 left-20 opacity-20 animate-bounce delay-500">
        <svg className="w-10 h-10 text-[#FDDF8E]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>

      {/* Background Decoration (optional) */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#7052FF] opacity-20 pointer-events-none"></div>
      
      {/* Custom CSS for infinite scroll animation */}
      <style jsx>{`
        @keyframes scroll-text {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-text {
          animation: scroll-text 15s linear infinite;
        }
        
        .animate-scroll-text:hover {
          animation-play-state: paused;
        }
      `}</style>
      </section>
    </div>
  )
}

export default Header