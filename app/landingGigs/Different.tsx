import React from 'react'

const Different = () => {
    const features = [
        "Compitatvive Pay",
        "Exclusive Opportunities",
        "Trusted Gigs",
        "Portfolio Growth",
        "Global Exposure",
      ];
    
      // Title for the card
      const title = "Competitive Pay";
  return (
    <section className="flex justify-center items-center py-16 ">
      <div className="max-w-[1000px] mx-auto w-full flex flex-col md:flex-row items-center justify-between">
        {/* Left side: Title */}
        <div className="text-center md:text-left mb-8 md:mb-0 ">
          <h2 className="text-3xl font-bold max-w-[60%] text-center text-gray-800">What Makes Us Different?</h2>
        </div>
        
        {/* Right side: Card with features */}
        <div className="bg-purple-600 text-white p-8 rounded-3xl relative shadow-lg max-w-xs w-full">
          {/* Card title */}
    

          {/* Features list */}
          <ul className="mt-2 space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="text-sm py-6 px-4">{feature}</li>
            ))}
          </ul>

          {/* Decorative background element */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full" style={{ opacity: 0.5 }}></div>
        </div>
      </div>
    </section>
  )
}

export default Different
