import React from 'react'

const Different = () => {
  const features = [
    {
      title: "Competitive Pay",
      icon: "💰",
      description: "Get paid what you deserve"
    },
    {
      title: "Exclusive Opportunities",
      icon: "🎯",
      description: "Access premium projects"
    },
    {
      title: "Trusted Gigs",
      icon: "🛡️",
      description: "Verified clients & projects"
    },
    {
      title: "Portfolio Growth",
      icon: "📈",
      description: "Build your professional reputation"
    },
    {
      title: "Global Exposure",
      icon: "🌍",
      description: "Work with clients worldwide"
    },
  ];

  return (
    <section className="relative flex justify-center items-center py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-gradient-to-r from-[#7052FF]/8 to-[#E11D48]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-gradient-to-r from-[#00613B]/8 to-[#F59E0B]/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#7052FF]/5 to-[#E11D48]/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">
        {/* Left side: Enhanced Title Section */}
        <div className="text-center lg:text-left flex-1 space-y-6 lg:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7052FF]/10 to-[#E11D48]/10 px-4 py-2 rounded-full border border-[#7052FF]/20">
            <span className="w-2 h-2 bg-[#7052FF] rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-[#7052FF] tracking-wide uppercase">Why Choose Us</span>
          </div>

          {/* Main Title */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="block bg-gradient-to-r from-[#5A4862] via-[#3D3D3D] to-[#1A1A1A] bg-clip-text text-transparent">
                What Makes
              </span>
              <span className="block bg-gradient-to-r from-[#7052FF] via-[#8B5FFF] to-[#E11D48] bg-clip-text text-transparent mt-2">
                Us Different?
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-[#5A4862]/70 max-w-md lg:max-w-none leading-relaxed">
              Experience the advantages that set us apart in the freelance marketplace
            </p>
          </div>
        </div>

        {/* Right side: Enhanced Card with features */}
        <div className="relative w-full max-w-md lg:max-w-lg flex-shrink-0">
          {/* Main Card Container */}
          <div className="relative bg-gradient-to-br from-[#7052FF] via-[#8B5FFF] to-[#E11D48] p-8 sm:p-10 rounded-3xl shadow-2xl hover:shadow-3xl transform transition-all duration-500 hover:scale-105 group">
            {/* Card Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:w-40 group-hover:h-40 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:w-32 group-hover:h-32 transition-all duration-700 delay-200"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/5 rounded-full blur-lg group-hover:w-24 group-hover:h-24 transition-all duration-700 delay-400"></div>

            {/* Features list */}
            <div className="relative z-10 space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center lg:text-left">
                Premium Benefits
              </h3>

              <ul className="space-y-3 sm:space-y-4">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="group/item relative text-white py-4 px-5 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:transform hover:scale-105 hover:shadow-lg cursor-pointer"
                  >
                    {/* Feature Content */}
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover/item:bg-white/30 transition-colors duration-300">
                          <span className="text-lg group-hover/item:scale-110 transition-transform duration-300">{feature.icon}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm sm:text-base group-hover/item:text-white transition-colors duration-300">
                          {feature.title}
                        </div>
                        <div className="text-xs sm:text-sm text-white/70 group-hover/item:text-white/90 transition-colors duration-300 mt-1">
                          {feature.description}
                        </div>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/item:translate-x-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-white/20 to-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-white/15 to-white/5 rounded-full blur-lg animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 -left-6 w-12 h-12 bg-gradient-to-r from-white/10 to-white/5 rounded-full blur-md animate-pulse delay-500"></div>
          </div>

          {/* Card Shadow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#7052FF]/20 to-[#E11D48]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
        </div>
      </div>
    </section>
  )
}

export default Different