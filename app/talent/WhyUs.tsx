'use client'
import React, { useState } from 'react'

const WhyUs = () => {
  const [currentCard, setCurrentCard] = useState(0);
  
  const cards = [
    {
      number: "01",
      title: "Quality Candidates",
      description: "Access a curated list of highly qualified professionals",
      bgColor: "bg-[#00613B]"
    },
    {
      number: "02", 
      title: "Fast Hiring Process",
      description: "Streamlined recruitment process that saves time and resources",
      bgColor: "bg-[#7052FF]"
    },
    {
      number: "03",
      title: "Perfect Match",
      description: "Advanced matching algorithm ensures the best fit for your needs",
      bgColor: "bg-[#E11D48]"
    },
    {
      number: "04",
      title: "Ongoing Support",
      description: "Continuous support throughout the entire hiring journey",
      bgColor: "bg-[#F59E0B]"
    }
  ];

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-[112px]">
        
        {/* Title Section */}
        <div className="text-center lg:text-left lg:flex-shrink-0">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[32px] text-[#4A4A4A] leading-tight max-w-xs mx-auto lg:mx-0">
            Why Choose Us?
          </h1>
        </div>

        {/* Cards Section */}
        <div className="relative">
          {/* Desktop: Stacked Cards Effect */}
          <div className="hidden sm:block relative w-80 h-80 md:w-96 md:h-96 lg:w-[418px] lg:h-[418px]">
            {cards.map((card, index) => {
              const offset = (index - currentCard + cards.length) % cards.length;
              const isVisible = offset < 3;
              
              return (
                <div
                  key={index}
                  className={`absolute inset-0 ${card.bgColor} rounded-2xl shadow-xl transition-all duration-500 cursor-pointer ${
                    isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  style={{
                    transform: `translateY(${offset * 8}px) translateX(${offset * 8}px) scale(${1 - offset * 0.05})`,
                    zIndex: cards.length - offset,
                  }}
                  onClick={nextCard}
                >
                  <div className="p-6 md:p-8 w-full h-full flex flex-col justify-between">
                    {/* Card Number */}
                    <div className="flex justify-start">
                      <span className="bg-white text-[#5A4862] font-medium px-3 py-1 rounded-full text-sm md:text-base">
                        {card.number}
                      </span>
                    </div>
                    
                    {/* Card Content */}
                    <div className="text-center flex-1 flex flex-col justify-center">
                      <h2 className="font-semibold text-white text-2xl md:text-3xl lg:text-[32px] mb-4 md:mb-6 lg:mb-[68px] leading-tight">
                        {card.title}
                      </h2>
                      <p className="font-medium text-white text-sm md:text-base lg:text-lg leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: Single Card with Navigation */}
          <div className="block sm:hidden w-80 h-80">
            <div className={`w-full h-full ${cards[currentCard].bgColor} rounded-2xl shadow-xl`}>
              <div className="p-6 w-full h-full flex flex-col justify-between">
                {/* Card Number */}
                <div className="flex justify-start">
                  <span className="bg-white text-[#5A4862] font-medium px-3 py-1 rounded-full text-sm">
                    {cards[currentCard].number}
                  </span>
                </div>
                
                {/* Card Content */}
                <div className="text-center flex-1 flex flex-col justify-center">
                  <h2 className="font-semibold text-white text-2xl mb-6 leading-tight">
                    {cards[currentCard].title}
                  </h2>
                  <p className="font-medium text-white text-sm leading-relaxed">
                    {cards[currentCard].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center mt-6 gap-4">
            {/* Previous Button */}
            <button
              onClick={prevCard}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#7052FF]/50"
              aria-label="Previous card"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCard(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentCard ? 'bg-[#7052FF]' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextCard}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#7052FF]/50"
              aria-label="Next card"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Auto-advance hint */}
          <p className="text-center text-sm text-gray-500 mt-4 hidden sm:block">
            Click on cards or use controls to navigate
          </p>
        </div>
      </div>
    </div>
  )
}

export default WhyUs