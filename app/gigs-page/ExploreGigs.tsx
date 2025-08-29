import React from 'react'

const ExploreGigs = () => {
  return (
    <div className='relative flex flex-col items-center justify-center py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 overflow-hidden'>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-gradient-to-r from-[#7052FF]/8 to-[#E11D48]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/5 w-56 h-56 bg-gradient-to-r from-[#00613B]/8 to-[#F59E0B]/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#7052FF]/5 to-[#E11D48]/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-10 sm:space-y-12 md:space-y-16">
        {/* Premium Badge */}
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#7052FF]/15 to-[#E11D48]/15 px-5 py-3 rounded-full border border-[#7052FF]/25 backdrop-blur-sm">
          <span className="w-3 h-3 bg-gradient-to-r from-[#7052FF] to-[#E11D48] rounded-full animate-pulse"></span>
          <span className="text-sm font-semibold bg-gradient-to-r from-[#7052FF] to-[#E11D48] bg-clip-text text-transparent tracking-wide uppercase">
            Discover Amazing Opportunities
          </span>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className='font-bold leading-tight max-w-5xl mx-auto'>
            <span className='block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-[#5A4862] via-[#3D3D3D] to-[#1A1A1A] bg-clip-text text-transparent'>
              Take the first step toward
            </span>
            <span className='block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-[#7052FF] via-[#8B5FFF] to-[#E11D48] bg-clip-text text-transparent mt-2'>
              your next big freelance gig.
            </span>
          </h1>
        </div>

        {/* Enhanced Tagline */}
        <div className="space-y-4">
          <p className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-center bg-gradient-to-r from-[#5A4862] to-[#5A4862]/80 bg-clip-text text-transparent max-w-4xl mx-auto leading-relaxed'>
            <span className="inline-block mr-3">🚀</span>
            Freelancing made simple, efficient, and rewarding
          </p>
          <p className='text-base sm:text-lg md:text-xl text-[#5A4862]/70 max-w-3xl mx-auto leading-relaxed'>
            Join thousands of freelancers who have found their perfect projects and built successful careers on our platform
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center items-center pt-6">
          <button className='group relative font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white flex items-center justify-center py-5 px-10 sm:py-6 sm:px-12 md:py-7 md:px-14 lg:py-8 lg:px-16 rounded-full bg-gradient-to-r from-[#7052FF] via-[#8B5FFF] to-[#E11D48] hover:from-[#5A3FFF] hover:via-[#7A4FFF] hover:to-[#D11D48] shadow-2xl hover:shadow-3xl transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-[#7052FF]/40'>
            {/* Button Background Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7052FF] via-[#8B5FFF] to-[#E11D48] opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl"></div>

            {/* Button Background Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7052FF]/20 via-[#8B5FFF]/20 to-[#E11D48]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Button Content */}
            <span className="relative z-10 flex items-center gap-4">
              Explore Gig
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </span>

            {/* Animated Border */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/50 transition-all duration-500"></div>

            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-700 origin-center"></div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExploreGigs