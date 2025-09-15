// @ts-nocheck
"use client"
import React, { useState } from 'react'

const LandingFaqs = () => {
  const [activeIndex, setActiveIndex] = useState(null)

  const faqData = [
    {
      question: "How do I get started with GrowUp Buddy?",
      answer: "Getting started is simple! Create your free account, complete your profile with your skills and interests, and start exploring opportunities. You can browse gigs, join communities, and connect with like-minded professionals right away."
    },
    {
      question: "What types of opportunities are available on the platform?",
      answer: "We offer a diverse range of opportunities including freelance gigs, full-time positions, project collaborations, mentorship programs, skill-building workshops, and networking events. Whether you're looking to earn money, learn new skills, or grow your network, we have something for everyone."
    },
    {
      question: "How does the payment system work for gigs?",
      answer: "Our secure payment system ensures safe transactions between clients and freelancers. Payments are held in escrow until project milestones are completed. We support multiple payment methods and provide detailed invoicing and tax documentation for your records."
    },
    {
      question: "Can I use GrowUp Buddy if I'm just starting my career?",
      answer: "Absolutely! GrowUp Buddy is designed for professionals at all stages of their careers. We have entry-level opportunities, mentorship programs, skill-building resources, and supportive communities specifically designed to help newcomers grow and succeed."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes! Our mobile app is available for both iOS and Android devices. You can manage your profile, browse opportunities, communicate with clients, and track your progress on the go. Download it from the App Store or Google Play Store."
    },
    {
      question: "How do you ensure the quality of opportunities and users?",
      answer: "We have a comprehensive vetting process for both opportunities and users. This includes identity verification, skill assessments, background checks for certain roles, and a robust review and rating system. Our community guidelines ensure a professional and respectful environment for everyone."
    }
  ]

  const toggleActiveIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
      
      {/* Header Section */}
      <div className="text-center mb-12 sm:mb-16 md:mb-20">
      <div className="text-center mb-8 sm:mb-12 md:mb-16">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold bg-gradient-to-r from-[#FFFFFF] via-[#E9DAFF] to-[#FFFFFF] text-[#4A4A4A] leading-tight mb-6 sm:mb-8 max-w-4xl mx-auto py-2 sm:py-4 md:py-6 lg:py-8 px-6 sm:px-8 md:px-12 rounded-2xl sm:rounded-3xl">
          FAQs Insights
        </h1>
      </div>
        <p className="text-[#696C78] text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Find answers to commonly asked questions about GrowUp Buddy and how our platform can help accelerate your professional growth.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`group rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md
              ${activeIndex === index 
                ? 'bg-gradient-to-r from-[#7052FF] to-[#5a42d4] text-white border-[#7052FF] shadow-[#7052FF]/20' 
                : 'bg-white text-[#4A4A4A] border-gray-200 hover:border-[#7052FF]/30'
              }
            `}
          >
            {/* Question Header */}
            <div 
              className="flex justify-between items-center p-4 sm:p-6 md:p-8 cursor-pointer"
              onClick={() => toggleActiveIndex(index)}
            >
              <div className="flex-1 pr-4">
                <h3 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-semibold leading-tight transition-colors duration-300
                  ${activeIndex === index ? 'text-white' : 'text-[#4A4A4A] group-hover:text-[#7052FF]'}
                `}>
                  {item.question}
                </h3>
              </div>
              
              {/* Toggle Button */}
              <button 
                className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200
                  ${activeIndex === index 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-[#7052FF]/10 group-hover:text-[#7052FF]'
                  }
                `}
                aria-label={activeIndex === index ? 'Collapse answer' : 'Expand answer'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 ${
                    activeIndex === index ? 'rotate-180' : 'rotate-0'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Answer Content */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
              activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 pt-0">
                <div className={`border-t pt-4 sm:pt-6 md:pt-8 ${
                  activeIndex === index ? 'border-white border-opacity-20' : 'border-gray-200'
                }`}>
                  <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${
                    activeIndex === index ? 'text-[#7052FF]/80' : 'text-gray-600'
                  }`}>
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12 sm:mt-16 md:mt-20">
        <p className="text-[#696C78] text-base sm:text-lg mb-6 sm:mb-8">
          Still have questions? We're here to help!
        </p>
        <button className="inline-flex items-center justify-center gap-2 bg-[#7052FF] hover:bg-[#5a42d4] active:bg-[#4a36b8] text-white font-semibold text-base sm:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7052FF]/30">
          <span>Contact Support</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default LandingFaqs