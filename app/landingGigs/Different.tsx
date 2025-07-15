import React from 'react'

const Different = () => {
  const features = [
    "Competitive Pay",
    "Exclusive Opportunities", 
    "Trusted Gigs",
    "Portfolio Growth",
    "Global Exposure",
  ];

  return (
    <section className="flex justify-center items-center py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1000px] mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Left side: Title */}
        <div className="text-center lg:text-left flex-1">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
            What Makes Us Different?
          </h2>
        </div>
        
        {/* Right side: Card with features */}
        <div className="bg-purple-600 text-white p-6 sm:p-8 rounded-3xl relative shadow-lg w-full max-w-sm lg:max-w-xs flex-shrink-0">
          {/* Features list */}
          <ul className="space-y-3 sm:space-y-4 relative z-10">
            {features.map((feature, index) => (
              <li 
                key={index} 
                className="text-sm sm:text-base py-3 sm:py-4 px-3 sm:px-4 bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:transform hover:scale-105"
              >
                {feature}
              </li>
            ))}
          </ul>
          
          {/* Decorative background elements */}
          <div className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 bg-purple-500 rounded-full opacity-30"></div>
          <div className="absolute bottom-4 right-4 w-24 h-24 sm:w-32 sm:h-32 bg-purple-500 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 left-4 w-12 h-12 sm:w-16 sm:h-16 bg-purple-400 rounded-full opacity-25"></div>
        </div>
      </div>
    </section>
  )
}

export default Different