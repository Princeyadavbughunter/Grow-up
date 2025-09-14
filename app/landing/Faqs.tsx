// @ts-nocheck
"use client"
import React, {useState} from 'react'

const Faqs = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const data = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do."
    ];
  
    const toggleActiveIndex = (index) => {
      setActiveIndex(activeIndex === index ? null : index);
    };
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {data.map((item, index) => (
        <div
          key={index}
          className={`rounded-xl border transition-all duration-500 ease-in-out
            ${activeIndex === index ? 'bg-[#7052FF] text-white' : 'bg-white text-black'}
          `}
        >
          {/* Question Header */}
          <div className="p-6 flex justify-between items-center cursor-pointer" onClick={() => toggleActiveIndex(index)}>
            <div className="flex-1">
              <p className="text-lg font-medium">{item}</p>
            </div>
            <button className="ml-4 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transition-transform duration-300 ease-in-out ${
                  activeIndex === index ? 'rotate-180' : 'rotate-0'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
          
          {/* Answer Content with smooth animation */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
            activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-6 pb-6">
              <div className={`border-t pt-4 ${
                activeIndex === index ? 'border-white border-opacity-20' : 'border-gray-200'
              }`}>
                <p className="text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Faqs
