import React from 'react'

const Banner = () => {
  return (
    <div className='relative flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8'>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-[#7052FF]/10 to-[#E11D48]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-[#00613B]/10 to-[#F59E0B]/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 sm:space-y-10 md:space-y-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7052FF]/10 to-[#E11D48]/10 px-4 py-2 rounded-full border border-[#7052FF]/20">
          <span className="w-2 h-2 bg-[#7052FF] rounded-full animate-pulse"></span>
          <span className="text-sm font-semibold text-[#7052FF] tracking-wide uppercase">Premium Freelance Platform</span>
        </div>

        {/* Main Heading */}
        <h1 className='font-bold bg-gradient-to-r from-[#5A4862] via-[#2D2D2D] to-[#1A1A1A] bg-clip-text text-transparent leading-tight'>
          <span className='block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl'>
            Take the first step toward
          </span>
          <span className='block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-[#7052FF] to-[#E11D48] bg-clip-text text-transparent mt-2'>
            your next big freelance gig.
          </span>
        </h1>

        {/* Subtitle */}
        <p className='text-lg sm:text-xl md:text-2xl font-medium text-[#5A4862]/80 max-w-3xl mx-auto leading-relaxed'>
          <span className="inline-block mr-2">🚀</span>
          Freelancing made simple, efficient, and rewarding
        </p>

        {/* CTA Button */}
        <div className="flex justify-center items-center pt-4">
          <button className='group relative font-bold text-lg sm:text-xl md:text-2xl text-white flex items-center justify-center py-4 px-8 sm:py-5 sm:px-10 md:py-6 md:px-12 rounded-full bg-gradient-to-r from-[#7052FF] to-[#E11D48] hover:from-[#5A3FFF] hover:to-[#D11D48] shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#7052FF]/30'>
            {/* Button Background Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7052FF] to-[#E11D48] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

            {/* Button Content */}
            <span className="relative z-10 flex items-center gap-3">
              Explore Gig
              <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </span>

            {/* Animated Border */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Banner