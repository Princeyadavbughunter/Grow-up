import React from 'react'

const Unique = () => {
  const cards = [
    {
      title: "Learn from Experts",
      description: "Get advice from successful people who have made their mark in the industry",
      bgColor: "bg-gradient-to-br from-blue-500 via-[#7052FF] to-pink-500",
      textColor: "text-white",
      hoverColor: "hover:shadow-2xl hover:shadow-blue-500/25",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Get Practical Tips",
      description: "Learn skills you can apply right away to advance your career and projects",
      bgColor: "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-500",
      textColor: "text-white",
      hoverColor: "hover:shadow-2xl hover:shadow-emerald-500/25",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: "Meet New People",
      description: "Connect with like-minded individuals and expand your professional network",
      bgColor: "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500",
      textColor: "text-white",
      hoverColor: "hover:shadow-2xl hover:shadow-orange-500/25",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
    },
    {
      title: "Find New Opportunities",
      description: "Discover ways to grow your career and unlock new possibilities",
      bgColor: "bg-gradient-to-br from-violet-500 via-[#7052FF] to-indigo-500",
      textColor: "text-white",
      hoverColor: "hover:shadow-2xl hover:shadow-violet-500/25",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gradient-to-b from-gray-50 to-white">
      {/* Main heading */}
      <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold bg-gradient-to-r from-[#FFFFFF] via-[#E9DAFF] to-[#FFFFFF] text text-[#4A4A4A] leading-tight mb-6 sm:mb-8 max-w-4xl mx-auto py-2 sm:py-4 md:py-6 lg:py-8 px-6 sm:px-8 md:px-12 rounded-2xl sm:rounded-3xl">
          What Makes Our Events
          <span className="bg-gradient-to-r from-blue-600 via-[#7052FF] to-pink-600 bg-clip-text text-transparent"> Unique?</span>
        </h1>
        <p className="text-[#4A4A4A] text-lg sm:text-xl max-w-2xl mx-auto">
          Discover the exceptional features that set our events apart
        </p>
      </div>

      {/* Desktop staggered layout (hidden on mobile) */}
      <div className="hidden lg:flex justify-center gap-8 xl:gap-12 max-w-6xl mx-auto">
        {/* First column */}
        <div className="flex flex-col gap-8 xl:gap-12">
          {cards.slice(0, 2).map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} ${card.textColor} ${card.hoverColor} rounded-3xl p-6 xl:p-8 flex flex-col justify-center items-center text-center transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-64 xl:w-72 h-64 xl:h-72 relative overflow-hidden group`}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Icon */}
              <div className="mb-4 relative z-10">
                {card.icon}
              </div>

              <h2 className="text-xl xl:text-2xl font-bold mb-3 xl:mb-4 leading-tight relative z-10">
                {card.title}
              </h2>
              <p className="text-sm xl:text-base leading-relaxed opacity-90 relative z-10">
                {card.description}
              </p>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          ))}
        </div>

        {/* Second column with offset */}
        <div className="flex flex-col gap-8 xl:gap-12 mt-16 xl:mt-20">
          {cards.slice(2).map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} ${card.textColor} ${card.hoverColor} rounded-3xl p-6 xl:p-8 flex flex-col justify-center items-center text-center transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-64 xl:w-72 h-64 xl:h-72 relative overflow-hidden group`}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Icon */}
              <div className="mb-4 relative z-10">
                {card.icon}
              </div>

              <h2 className="text-xl xl:text-2xl font-bold mb-3 xl:mb-4 leading-tight relative z-10">
                {card.title}
              </h2>
              <p className="text-sm xl:text-base leading-relaxed opacity-90 relative z-10">
                {card.description}
              </p>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile and tablet grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:hidden max-w-4xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} ${card.textColor} ${card.hoverColor} rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center text-center transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 min-h-[200px] sm:min-h-[240px] md:min-h-[280px] relative overflow-hidden group`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Icon */}
            <div className="mb-4 relative z-10">
              {card.icon}
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 leading-tight relative z-10">
              {card.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed opacity-90 relative z-10">
              {card.description}
            </p>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Unique;