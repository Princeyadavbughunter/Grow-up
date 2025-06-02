"use client"
import React, {useState} from 'react'

const LandingFaqs = () => {
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
    <div className="max-w-[1200px] sm:mt-[200px] px-[10px] mb-[100px] mx-auto space-y-4">
        <h1 class="bg-faq-gradient text-[#4A4A4A] font-bold text-3xl text-center py-4 rounded-lg w-[300px] mx-auto">
           FAQ Insights
        </h1>

        <p className='text-[#696C78] text-[16px] text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
      {data.map((item, index) => (
        <div
          key={index}
          className={`p-6 rounded-xl border flex justify-between items-center transition duration-300 ease-in-out
            ${activeIndex === index ? 'bg-purple-500 text-white' : 'bg-white text-black'}
          `}
        >
          <div>
            <p className="text-lg">{item}</p>
            {activeIndex === index && (
              <p className="text-sm mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
              </p>
            )}
          </div>
          <button onClick={() => toggleActiveIndex(index)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={`M${activeIndex === index ? '19 9l-7 7-7-7' : '9 5l7 7-7 7'}`} 
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

export default LandingFaqs
