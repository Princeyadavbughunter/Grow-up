import React from 'react'

const Unique = () => {
  const cards = [
    {
      title: "Learn from Experts",
      description: "Get advice from successful people who have made their mark in the industry",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      hoverColor: "hover:bg-gray-700",
    },
    {
      title: "Get Practical Tips",
      description: "Learn skills you can apply right away to advance your career and projects",
      bgColor: "bg-purple-500",
      textColor: "text-white",
      hoverColor: "hover:bg-purple-600",
    },
    {
      title: "Meet New People",
      description: "Connect with like-minded individuals and expand your professional network",
      bgColor: "bg-purple-500",
      textColor: "text-white",
      hoverColor: "hover:bg-purple-600",
    },
    {
      title: "Find New Opportunities",
      description: "Discover ways to grow your career and unlock new possibilities",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      hoverColor: "hover:bg-gray-700",
    },
  ];

  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Main heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] text-[#4A4A4A] text-center font-bold mb-8 sm:mb-12 md:mb-16 lg:mb-20 leading-tight max-w-4xl mx-auto">
        What Makes Our Events Unique?
      </h1>

      {/* Desktop staggered layout (hidden on mobile) */}
      <div className="hidden lg:flex justify-center gap-8 xl:gap-12 max-w-6xl mx-auto">
        {/* First column */}
        <div className="flex flex-col gap-8 xl:gap-12">
          {cards.slice(0, 2).map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} ${card.textColor} ${card.hoverColor} rounded-2xl p-6 xl:p-8 flex flex-col justify-center items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl w-64 xl:w-72 h-64 xl:h-72`}
            >
              <h2 className="text-xl xl:text-2xl font-bold mb-3 xl:mb-4 leading-tight">
                {card.title}
              </h2>
              <p className="text-sm xl:text-base leading-relaxed opacity-90">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Second column with offset */}
        <div className="flex flex-col gap-8 xl:gap-12 mt-16 xl:mt-20">
          {cards.slice(2).map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} ${card.textColor} ${card.hoverColor} rounded-2xl p-6 xl:p-8 flex flex-col justify-center items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl w-64 xl:w-72 h-64 xl:h-72`}
            >
              <h2 className="text-xl xl:text-2xl font-bold mb-3 xl:mb-4 leading-tight">
                {card.title}
              </h2>
              <p className="text-sm xl:text-base leading-relaxed opacity-90">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile and tablet grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:hidden max-w-4xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} ${card.textColor} ${card.hoverColor} rounded-2xl p-6 sm:p-8 flex flex-col justify-center items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl min-h-[200px] sm:min-h-[240px] md:min-h-[280px]`}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 leading-tight">
              {card.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed opacity-90">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Unique;