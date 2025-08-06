import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  return (
    <section className="bg-gradient-to-r from-[#23282C] via-[#23282C] to-[#7052FF] w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[600px] sm:min-h-[682px] lg:min-h-[732px] rounded-[20px] sm:rounded-[40px] lg:rounded-[80px] flex flex-col justify-center items-center relative overflow-hidden">
      
      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center h-full w-full py-8 sm:py-12 lg:py-16">
        
        {/* Header Text Section */}
        <div className='text-center w-full max-w-4xl px-4'>
          <p className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white mb-4 sm:mb-6'>
            Empower your grow
          </p>
          <h1 className='text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[128px] text-[#FDDF8E] font-bold leading-tight sm:leading-tight lg:leading-[120px] xl:leading-[150px] animate-slideX break-words'>
            Collaborate Connect
          </h1>
        </div>
        
        {/* Call to Action Section */}
        <div className='flex flex-col items-center mt-12 sm:mt-16 lg:mt-20 xl:mt-24'>
          
          {/* Star Icons */}
          <div className='flex space-x-1 sm:space-x-2'>
            <div className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 relative">
              <Image 
                src='/img-1.png' 
                fill
                alt='star icon'
                className="object-contain"
              />
            </div>
            <div className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 relative">
              <Image 
                src='/img-1.png' 
                fill
                alt='star icon'
                className="object-contain"
              />
            </div>
            <div className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 relative">
              <Image 
                src='/img-1.png' 
                fill
                alt='star icon'
                className="object-contain"
              />
            </div>
          </div>
          
          {/* Subtitle */}
          <p className='text-[#F4ECFF] mt-2 sm:mt-3 lg:mt-4 text-base sm:text-lg lg:text-xl xl:text-2xl font-medium'>
            create network
          </p>
          
          {/* CTA Button */}
          <Link href="/auth/google">
            <button className='bg-[#7052FF] hover:bg-[#5a42d4] active:bg-[#4a36b8] transition-all duration-200 mt-4 sm:mt-6 lg:mt-8 rounded-lg text-white text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold py-3 sm:py-4 lg:py-5 px-6 sm:px-8 lg:px-10 xl:px-12 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#7052FF] focus:ring-opacity-50'>
              Join now
            </button>
          </Link>
        </div>
      </div>
      
      {/* Background Decoration (optional) */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#7052FF] opacity-20 pointer-events-none"></div>
    </section>
  )
}

export default Header