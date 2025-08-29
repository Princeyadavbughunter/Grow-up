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
      <div className="flex flex-col lg:flex-row justify-center  gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-[112px]">
        
        {/* Title Section */}
        <div className="text-center lg:text-left lg:flex-shrink-0 max-w-lg lg:max-w-xl">
          <div className="space-y-4 lg:space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7052FF]/10 to-[#E11D48]/10 px-4 py-2 rounded-full border border-[#7052FF]/20">
              <span className="w-2 h-2 bg-[#7052FF] rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-[#7052FF] tracking-wide uppercase">Why Choose Us</span>
            </div>
            <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[56px] bg-gradient-to-r from-[#4A4A4A] via-[#2D2D2D] to-[#1A1A1A] bg-clip-text text-transparent leading-tight">
              Discover What Makes Us Different
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md lg:max-w-none">
              Experience the future of talent acquisition with our innovative platform designed for modern businesses
            </p>
          </div>
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
                  className={`absolute inset-0 ${card.bgColor} rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-700 ease-out cursor-pointer group transform-gpu ${
                    isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  } hover:scale-105 hover:-translate-y-2`}
                  style={{
                    transform: `translateY(${offset * 8}px) translateX(${offset * 8}px) scale(${1 - offset * 0.05})`,
                    zIndex: cards.length - offset,
                  }}
                  onClick={nextCard}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-2xl"></div>

                  <div className="relative p-6 md:p-8 w-full h-full flex flex-col justify-between">
                    {/* Card Number */}
                    <div className="flex justify-start">
                      <span className="bg-white/95 backdrop-blur-sm text-[#5A4862] font-semibold px-4 py-2 rounded-full text-sm md:text-base shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {card.number}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="text-center flex-1 flex flex-col justify-center">
                      <h2 className="font-bold text-white text-2xl md:text-3xl lg:text-[32px] mb-4 md:mb-6 lg:mb-[68px] leading-tight drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                        {card.title}
                      </h2>
                      <p className="font-medium text-white/95 text-sm md:text-base lg:text-lg leading-relaxed drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                        {card.description}
                      </p>
                    </div>

                    {/* Hover Effect Indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: Single Card with Navigation */}
          <div className="block sm:hidden w-80 h-80">
            <div className={`w-full h-full ${cards[currentCard].bgColor} rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer group transform-gpu`}>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-2xl"></div>

              <div className="relative p-6 w-full h-full flex flex-col justify-between">
                {/* Card Number */}
                <div className="flex justify-start">
                  <span className="bg-white/95 backdrop-blur-sm text-[#5A4862] font-semibold px-4 py-2 rounded-full text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {cards[currentCard].number}
                  </span>
                </div>

                {/* Card Content */}
                <div className="text-center flex-1 flex flex-col justify-center">
                  <h2 className="font-bold text-white text-2xl mb-6 leading-tight drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                    {cards[currentCard].title}
                  </h2>
                  <p className="font-medium text-white/95 text-sm leading-relaxed drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                    {cards[currentCard].description}
                  </p>
                </div>

                {/* Hover Effect Indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center mt-8 gap-6">
            {/* Previous Button */}
            <button
              onClick={prevCard}
              className="group relative w-12 h-12 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-[#7052FF] hover:to-[#E11D48] flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#7052FF]/30 shadow-lg hover:shadow-xl hover:scale-110 transform-gpu"
              aria-label="Previous card"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7052FF]/20 to-[#E11D48]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-3">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCard(index)}
                  className={`relative w-3 h-3 rounded-full transition-all duration-300 transform-gpu hover:scale-125 ${
                    index === currentCard
                      ? 'bg-gradient-to-r from-[#7052FF] to-[#E11D48] shadow-lg scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to card ${index + 1}`}
                >
                  {index === currentCard && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7052FF] to-[#E11D48] animate-ping opacity-30"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextCard}
              className="group relative w-12 h-12 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-[#7052FF] hover:to-[#E11D48] flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#7052FF]/30 shadow-lg hover:shadow-xl hover:scale-110 transform-gpu"
              aria-label="Next card"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7052FF]/20 to-[#E11D48]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Auto-advance hint */}
          <div className="text-center mt-6 hidden sm:block">
            <p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full inline-block border border-gray-200">
              <span className="inline-block mr-2">💡</span>
              Click on cards or use controls to navigate
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhyUs