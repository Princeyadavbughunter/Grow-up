import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Download = () => {
  const features = [
    {
      id: 1,
      title: 'Earn Money',
      description: 'Get the right team, gigs, and partners to power your vision. Connect, collaborate, and bring it all to life—right here, in one place.',
      image: '/gig1.png',
      imageAlt: 'Earn Money feature screenshot'
    },
    {
      id: 2,
      title: 'Find Opportunities', 
      description: 'Discover exciting projects and collaborations that match your skills. Build meaningful connections with like-minded professionals.',
      image: '/gig1.png',
      imageAlt: 'Find Opportunities feature screenshot'
    },
    {
      id: 3,
      title: 'Grow Your Network',
      description: 'Join a community of ambitious individuals. Share knowledge, learn from experts, and accelerate your professional growth.',
      image: '/gig1.png',
      imageAlt: 'Grow Your Network feature screenshot'
    }
  ]

  return (
    <div className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24'>
      
      {/* Header Section */}
      <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
        <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-[#4A4A4A] leading-tight mb-6 sm:mb-8 max-w-4xl mx-auto'>
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            One Place
          </span>{' '}
          for All Your Needs
        </h1>
        
        <div className="inline-block">
          <p className='font-bold text-sm sm:text-base md:text-lg text-[#7052FF] border-b-2 border-[#7052FF] pb-2 px-4 hover:bg-[#7052FF] hover:text-white transition-all duration-300 cursor-pointer rounded-t-lg'>
            Download Now
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">
        {features.map((feature, index) => (
          <div key={feature.id} className="w-full">
            
            {/* Feature Content Card */}
            <div className={`flex flex-col lg:flex-row items-center bg-[#FFF7E3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              
              {/* Text Content */}
              <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
                <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#4A4A4A] mb-4 sm:mb-6 md:mb-8 leading-tight'>
                  {feature.title}
                </h2>
                <p className='text-sm sm:text-base md:text-lg lg:text-xl text-[#696C78] leading-relaxed max-w-2xl'>
                  {feature.description}
                </p>
              </div>

              {/* Image Container */}
              <div className="flex-shrink-0 w-full lg:w-auto flex justify-center items-center p-4 sm:p-6 md:p-8">
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] aspect-[3/4] bg-[#FFF7E3] rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 shadow-md">
                  <Image 
                    src={feature.image} 
                    alt={feature.imageAlt}
                    fill
                    className="object-contain rounded-lg sm:rounded-xl"
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 360px, 400px"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Image (shown separately on very small screens for better layout) */}
            <div className="block sm:hidden mt-4">
              <div className="flex justify-center">
                <div className="relative w-full max-w-[250px] aspect-[3/4] bg-[#FFF7E3] rounded-xl p-2 shadow-md">
                  <Image 
                    src={feature.image} 
                    alt={feature.imageAlt}
                    fill
                    className="object-contain rounded-lg"
                    sizes="250px"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action Section */}
      <div className="text-center mt-12 sm:mt-16 md:mt-20 lg:mt-24">
        <Link href="/auth/google">
          <button className="inline-flex items-center justify-center gap-3 bg-[#7052FF] hover:bg-[#5a42d4] active:bg-[#4a36b8] text-white font-semibold text-base sm:text-lg md:text-xl px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#7052FF] focus:ring-opacity-50">
            <span>Get Started Today</span>
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Download