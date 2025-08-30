import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  return (
    <section className="bg-gradient-to-r from-[#23282C] via-[#23282C] to-[#7052FF] w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[600px] sm:min-h-[682px] lg:min-h-[732px] rounded-[20px] sm:rounded-[40px] lg:rounded-[80px] flex flex-col justify-center items-center relative overflow-hidden">
      
      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center h-full w-full py-8 sm:py-12 lg:py-16">
        
        {/* Header Text Section */}
        <div className='text-center w-full max-w-5xl px-4'>
          <p className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white mb-6 sm:mb-8 lg:mb-10 tracking-wide'>
            Empower your growth
          </p>
          <h1 className='text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] 2xl:text-[140px] text-[#FDDF8E] font-black leading-tight sm:leading-tight lg:leading-[130px] xl:leading-[160px] 2xl:leading-[180px] animate-slideX break-words drop-shadow-2xl'>
            Collaborate Connect
          </h1>
        </div>
        
        {/* Call to Action Section */}
        <div className='flex flex-col items-center mt-16 sm:mt-20 lg:mt-24 xl:mt-28'>

          {/* Star Icons */}
          <div className='flex space-x-2 sm:space-x-3'>
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 relative">
              <Image
                src='/img-1.png'
                fill
                alt='star icon'
                className="object-contain animate-pulse"
              />
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 relative">
              <Image
                src='/img-1.png'
                fill
                alt='star icon'
                className="object-contain animate-pulse delay-200"
              />
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 relative">
              <Image
                src='/img-1.png'
                fill
                alt='star icon'
                className="object-contain animate-pulse delay-400"
              />
            </div>
          </div>

          {/* Subtitle */}
          <p className='text-[#F4ECFF] mt-4 sm:mt-6 lg:mt-8 text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold tracking-wide'>
            Create your network
          </p>

          {/* CTA Button */}
          <Link href="/auth/google">
            <button className='bg-[#7052FF] hover:bg-[#5a42d4] active:bg-[#4a36b8] transition-all duration-300 mt-6 sm:mt-8 lg:mt-10 xl:mt-12 rounded-xl text-white text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold py-4 sm:py-5 lg:py-6 xl:py-7 px-8 sm:px-10 lg:px-12 xl:px-14 2xl:px-16 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#7052FF] focus:ring-opacity-60 border-2 border-white/20 hover:border-white/40'>
              Join Now
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
    </section>
  )
}

export default Header