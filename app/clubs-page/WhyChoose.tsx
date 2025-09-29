'use client'
import React, { useState } from 'react'

const WhyChoose = () => {
  const [activeCategory, setActiveCategory] = useState('Tech Trends')

  const categories = [
    {
      title: 'Tech Trends',
      description: 'Stay updated with the latest technology trends and emerging frameworks that shape the future.',
    },
    {
      title: 'Market Insights',
      description: 'Get valuable market analysis and business intelligence to make informed career decisions.',
    },
    {
      title: 'Inspirational Stories',
      description: 'Read success stories from community members and learn from their journeys.',
    },
    {
      title: 'Personal Growth',
      description: 'Access resources for skill development and career advancement to reach your potential.',
    }
  ]

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Section */}
      <div className="text-center mt-16 sm:mt-24 md:mt-32 lg:mt-40 mb-12 sm:mb-16 md:mb-20">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold bg-gradient-to-r from-[#FFFFFF] via-[#E9DAFF] to-[#FFFFFF] text text-[#4A4A4A] leading-tight mb-6 sm:mb-8 max-w-4xl mx-auto py-2 sm:py-4 md:py-6 lg:py-8 px-6 sm:px-8 md:px-12 rounded-2xl sm:rounded-3xl">
          Why Choose{' '}
          GrowUp Buddy?
        </h1>
      </div>

      {/* Categories Section */}
      <div className="max-w-xl mx-auto space-y-4">
        {categories.map((category, index) => (
          <div
            key={category.title}
            className={`
              group rounded-3xl border-2 transition-all duration-300 ease-in-out cursor-pointer
              ${activeCategory === category.title 
                ? 'bg-[#7052FF] text-white border-[#7052FF] shadow-lg' 
                : 'bg-white text-[#4A4A4A] border-[#7052FF]/20 hover:border-[#7052FF]/60 hover:shadow-md'
              }
            `}
            onClick={() => setActiveCategory(activeCategory === category.title ? '' : category.title)}
          >
            {/* Category Header */}
            <div className="flex justify-center items-center p-6">
              <div className="flex items-center justify-between w-full max-w-md mx-auto">
                <h3 className={`
                  text-lg sm:text-xl font-semibold leading-tight transition-colors duration-300
                  ${activeCategory === category.title 
                    ? 'text-white' 
                    : 'text-[#4A4A4A] group-hover:text-[#7052FF]'
                  }
                `}>
                  {category.title}
                </h3>
                
                {/* Toggle Arrow */}
                <button 
                  className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ml-4
                    ${activeCategory === category.title 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : 'bg-[#7052FF]/10 text-[#7052FF] group-hover:bg-[#7052FF]/20'
                    }
                  `}
                  aria-label={activeCategory === category.title ? 'Collapse' : 'Expand'}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`
                      w-4 h-4 transition-transform duration-300 
                      ${activeCategory === category.title ? 'rotate-90' : 'rotate-0'}
                    `}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Expandable Content */}
            <div className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${activeCategory === category.title 
                ? 'max-h-32 opacity-100' 
                : 'max-h-0 opacity-0'
              }
            `}>
              <div className="flex justify-center px-6 pb-6">
                <div className="w-full max-w-md mx-auto">
                  <p className={`
                    text-sm sm:text-base leading-relaxed
                    ${activeCategory === category.title 
                      ? 'text-white text-opacity-90' 
                      : 'text-[#696C78]'
                    }
                  `}>
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WhyChoose