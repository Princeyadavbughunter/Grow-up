import React from 'react'

const Unique = () => {
    const cards = [
        {
          title: "Learn from Experts",
          description: "Get advice from successful people",
          bgColor: "bg-gray-800", // Dark background
          textColor: "text-white",
        },
        {
          title: "Get Practical Tips",
          description: "Learn skills you can apply right away.",
          bgColor: "bg-purple-500", // Purple background
          textColor: "text-white",
        },
        {
          title: "Meet New People",
          description: "Connect with like-minded individuals.",
          bgColor: "bg-purple-500", // Purple background
          textColor: "text-white",
        },
        {
          title: "Find New Opportunities",
          description: "Discover ways to grow your career.",
          bgColor: "bg-gray-800", // Dark background
          textColor: "text-white",
        },
      ];
  return (
    <div>
          <h1 className='text-[40px] text-[#4A4A4A] text-center font-bold'>What Makes Our Events Unique?</h1>
          <div className="flex  justify-center gap-6 p-6">
            <div className="flex flex-col gap-6">
              {cards.slice(0, 2).map((card, index) => (
                <div
                  key={index}
                  className={`${card.bgColor} ${card.textColor} rounded-xl p-8 flex flex-col justify-center items-center text-center`}
                  style={{
                    width: "200px", // Adjust width
                    height: "200px", // Adjust height
                  }}
                >
                  <h2 className="text-lg font-bold">{card.title}</h2>
                  <p className="text-sm mt-2">{card.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-6 mt-12"> {/* Add top margin to the second column */}
              {cards.slice(2).map((card, index) => (
                <div
                  key={index}
                  className={`${card.bgColor} ${card.textColor} rounded-xl p-8 flex flex-col justify-center items-center text-center`}
                  style={{
                    width: "200px", // Adjust width
                    height: "200px", // Adjust height
                  }}
                >
                  <h2 className="text-lg font-bold">{card.title}</h2>
                  <p className="text-sm mt-2">{card.description}</p>
                </div>
              ))}
            </div>
    </div>
    </div>
  )
}

export default Unique
