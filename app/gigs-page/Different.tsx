import React from 'react'

const Different = () => {
  const features = [
    { title: "Competitive Pay" },
    { title: "Exclusive Opportunities" },
    { title: "Trusted Gigs" },
    { title: "Portfolio Growth" },
    { title: "Global Exposure" },
  ];

  return (
    <section className="relative flex justify-center items-center py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-gradient-to-r from-[#7052FF]/8 to-[#E11D48]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-gradient-to-r from-[#00613B]/8 to-[#F59E0B]/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#7052FF]/5 to-[#E11D48]/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-20">
        {/* Left side: Title Section */}
        <div className="text-center lg:text-left flex-1 space-y-6 lg:space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight block text-[#4A4A4A]">
              What Makes
              Us Different?
            </h2>
            <p className="text-lg text-gray-600 max-w-md lg:max-w-none mx-auto lg:mx-0">
              Experience the advantages that set us apart in the 
              freelance marketplace
            </p>
          </div>
        </div>

        {/* Right side: Cards */}
        <div className="relative w-full max-w-md lg:max-w-lg flex-shrink-0">
          <div className="relative bg-[#7052FF] p-8 sm:p-10 rounded-3xl shadow-2xl">
            <div className="relative z-10 space-y-4">
              <ul className="space-y-3 sm:space-y-4">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="relative text-white py-4 px-6 rounded-2xl border border-white/20 transition-all duration-500 cursor-pointer
                               hover:bg-white hover:text-black hover:scale-105 hover:font-semibold"
                  >
                    <span className="block text-center sm:text-left text-base sm:text-xl transition-all duration-500">
                      {feature.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Different
