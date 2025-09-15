'use client'
import React, { useState } from 'react'

const WhyUs = () => {
  const [currentCard, setCurrentCard] = useState(0);
  
  const cards = [
    {
      number: "01",
      title: "Quality Candidates",
      description: "Access a curated list of highly qualified professionals",
      bgColor: "bg-gradient-to-br from-[#00613B] to-[#004a2d]"
    },
    {
      number: "02", 
      title: "Fast Hiring Process",
      description: "Streamlined recruitment process that saves time and resources",
      bgColor: "bg-gradient-to-br from-[#7052FF] to-[#5a41cc]"
    },
    {
      number: "03",
      title: "Perfect Match",
      description: "Advanced matching algorithm ensures the best fit for your needs",
      bgColor: "bg-gradient-to-br from-[#E11D48] to-[#be1439]"
    },
    {
      number: "04",
      title: "Ongoing Support",
      description: "Continuous support throughout the entire hiring journey",
      bgColor: "bg-gradient-to-br from-[#F59E0B] to-[#d97706]"
    }
  ];

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-[112px]">
        
        {/* Title Section */}
        <div className="text-center lg:text-left lg:flex-shrink-0 max-w-lg lg:max-w-xl">
          <div className="space-y-4 lg:space-y-6 mb-8 sm:mb-12 lg:mb-14">
            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[56px] bg-gradient-to-r from-[#4A4A4A] via-[#2D2D2D] to-[#1A1A1A] bg-clip-text text-transparent leading-tight">
              Discover What Makes Us Different
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md lg:max-w-none mx-auto lg:mx-0">
              Experience the future of talent acquisition with our innovative platform designed for modern businesses
            </p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="relative">
          {/* Mobile: Single Card Display */}
          <div className="block sm:hidden w-full max-w-sm mx-auto">
            <div className={`w-full h-80 ${cards[currentCard].bgColor} rounded-3xl shadow-2xl transition-all duration-500 cursor-pointer group transform-gpu relative overflow-hidden`}>
              {/* Enhanced Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/30 rounded-3xl"></div>
              
              <div className="relative p-6 w-full h-full flex flex-col justify-between">
                {/* Card Number */}
                <div className="flex justify-start">
                  <span className="bg-white/95 backdrop-blur-sm text-gray-800 font-bold px-4 py-2 rounded-full text-sm shadow-lg border border-white/50">
                    {cards[currentCard].number}
                  </span>
                </div>

                {/* Card Content */}
                <div className="text-center flex-1 flex flex-col justify-center space-y-4">
                  <h2 className="font-bold text-white text-2xl leading-tight drop-shadow-lg">
                    {cards[currentCard].title}
                  </h2>
                  <p className="font-medium text-white/95 text-sm leading-relaxed drop-shadow-md px-2">
                    {cards[currentCard].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Stacked Cards Effect */}
          <div className="hidden sm:block relative w-80 sm:w-96 md:w-[400px] lg:w-[418px] h-80 sm:h-96 md:h-[400px] lg:h-[418px]">
            {cards.map((card, index) => {
              // Calculate the position of each card relative to current card
              const position = (index - currentCard + cards.length) % cards.length;
              const isActive = position === 0;
              const isVisible = position < 3;

              // Calculate transforms for stacking effect
              const translateY = position * 12;
              const translateX = position * 8;
              const scale = 1 - position * 0.06;
              const rotate = position * -2;
              const zIndex = cards.length - position;

              return (
                <div
                  key={index}
                  className={`absolute inset-0 ${card.bgColor} rounded-3xl shadow-2xl transition-all duration-700 ease-in-out cursor-pointer group transform-gpu ${
                    isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  } ${isActive ? 'hover:scale-105 hover:-translate-y-3 hover:rotate-1' : ''}`}
                  style={{
                    transform: `translateY(${translateY}px) translateX(${translateX}px) scale(${scale}) rotate(${rotate}deg)`,
                    zIndex: zIndex,
                    transformOrigin: 'center bottom',
                  }}
                  onClick={nextCard}
                >
                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/30 rounded-3xl"></div>
                  
                  {/* Subtle border glow */}
                  <div className={`absolute inset-0 rounded-3xl ${isActive ? 'ring-2 ring-white/30' : ''} transition-all duration-700`}></div>

                  <div className="relative p-8 w-full h-full flex flex-col justify-between">
                    {/* Card Number with enhanced styling */}
                    <div className="flex justify-start">
                      <span className="bg-white/95 backdrop-blur-sm text-gray-800 font-bold px-5 py-2.5 rounded-full text-sm md:text-base shadow-lg border border-white/50 group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                        {card.number}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="text-center flex-1 flex flex-col justify-center space-y-6">
                      <h2 className="font-bold text-white text-2xl md:text-3xl lg:text-[28px] leading-tight drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                        {card.title}
                      </h2>
                      <p className="font-medium text-white/95 text-sm md:text-base lg:text-base leading-relaxed drop-shadow-md group-hover:scale-105 transition-transform duration-300 px-2">
                        {card.description}
                      </p>
                    </div>

                    {/* Click indicator for active card */}
                    {/* {isActive && (
                      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    )} */}

                    {/* Subtle pattern overlay for non-active cards */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center items-center mt-6 sm:mt-8 gap-4 sm:gap-6">
            {/* Previous Button */}
            <button
              onClick={prevCard}
              className="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#7052FF]/20 shadow-lg hover:shadow-xl hover:scale-110 transform-gpu border border-gray-100"
              aria-label="Previous card"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-[#7052FF] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

           
            <div className="flex gap-2 sm:gap-3">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCard(index)}
                  className={`transition-all duration-300 transform hover:scale-125 ${
                    index === currentCard
                      ? 'w-6 sm:w-8 h-2 sm:h-3 bg-[#7052FF] rounded-full shadow-lg scale-110'
                      : 'w-2 sm:w-3 h-2 sm:h-3 bg-gray-300 hover:bg-[#7052FF]/50 rounded-full'
                  }`}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextCard}
              className="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#7052FF]/20 shadow-lg hover:shadow-xl hover:scale-110 transform-gpu border border-gray-100"
              aria-label="Next card"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-[#7052FF] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Card Counter */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500 font-medium">
              {currentCard + 1} / {cards.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhyUs