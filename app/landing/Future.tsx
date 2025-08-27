import React from 'react'
import Image from 'next/image'

const Future = () => {
  const cards = [
    {
      id: 1,
      title: 'Monetize Your Skills',
      description: 'Find gigs that match your skills and start earning with GrowUp Buddy.',
      icon: '/landing-icon.png',
      bgColor: 'bg-purple-600',
      borderColor: 'border-transparent',
      textColor: 'text-white',
    },
    {
      id: 2,
      title: 'Learn & Grow',
      description: 'Join clubs, learn from experts, and stay ahead in your field.',
      icon: '/landing-icon.png',
      bgColor: 'bg-purple-600',
      borderColor: 'border-transparent',
      textColor: 'text-white',
    },
    {
      id: 3,
      title: 'Connect & Thrive',
      description: 'Network with like-minded individuals and find collaborators for your projects.',
      icon: '/landing-icon.png',
      bgColor: 'bg-purple-600',
      borderColor: 'border-transparent',
      textColor: 'text-white',
    },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Title */}
      <div className="text-center mt-16 sm:mt-24 md:mt-32 lg:mt-40 xl:mt-52 mb-12 sm:mb-16 md:mb-20 lg:mb-24">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-[#4A4A4A] leading-tight max-w-4xl mx-auto">
          Empower Your Future in{' '}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            3 Steps
          </span>
        </h1>
      </div>

      {/* Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`group relative rounded-2xl sm:rounded-3xl border-2 ${card.bgColor} ${card.borderColor} shadow-lg hover:shadow-xl hover:bg-white hover:border-purple-600 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105`}
          >
            <div className="flex flex-col items-center text-center p-6 sm:p-8 lg:p-10">
              
              {/* Icon Container */}
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-purple-100 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 lg:mb-10 group-hover:bg-purple-200 transition-colors duration-300">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
                  <Image 
                    src={card.icon} 
                    alt={`${card.title} icon`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* Title */}
              <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${card.textColor} group-hover:text-gray-900 mb-3 sm:mb-4 lg:mb-5 leading-tight transition-colors duration-300`}>
                {card.title}
              </h3>

              {/* Description */}
              <p className={`text-base sm:text-lg lg:text-xl ${card.textColor} group-hover:text-gray-900 leading-relaxed mb-6 sm:mb-8 lg:mb-10 max-w-sm transition-colors duration-300`}>
                {card.description}
              </p>

              {/* Button (appears on hover) */}
              <button
                className={`opacity-0 group-hover:opacity-100 inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-md hover:shadow-lg`}
              >
                View
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>

            </div>
            
            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-transparent via-transparent to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Future