import React from "react";
import Image from "next/image";
import Link from "next/link";

const Download = () => {
  const phoneColors = [
    "bg-gradient-to-br from-[#FFF7E3] to-[#F5F0E8]", // Warm cream
    "bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE]", // Cool blue
    "bg-gradient-to-br from-[#FEF7ED] to-[#FED7AA]", // Soft orange
  ];

  const phoneBorders = [
    "border-[#FED7AA]", // Warm orange border
    "border-[#0EA5E9]", // Blue border
    "border-[#F97316]", // Orange border
  ];

  const features = [
    {
      id: 1,
      title: "Earn Money",
      description:
        "Get the right team, gigs, and partners to power your vision. Connect, collaborate, and bring it all to life—right here, in one place.",
      image: "/gig1.png",
      imageAlt: "Earn Money feature screenshot",
    },
    {
      id: 2,
      title: "Find Opportunities",
      description:
        "Discover exciting projects and collaborations that match your skills. Build meaningful connections with like-minded professionals.",
      image: "/gig1.png",
      imageAlt: "Find Opportunities feature screenshot",
    },
    {
      id: 3,
      title: "Grow Your Network",
      description:
        "Join a community of ambitious individuals. Share knowledge, learn from experts, and accelerate your professional growth.",
      image: "/gig1.png",
      imageAlt: "Grow Your Network feature screenshot",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12 md:mb-16">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold bg-gradient-to-r from-[#FFFFFF] via-[#E9DAFF] to-[#FFFFFF] text text-[#4A4A4A] leading-tight mb-6 sm:mb-8 max-w-4xl mx-auto py-2 sm:py-4 md:py-6 lg:py-8 px-6 sm:px-8 md:px-12 rounded-2xl sm:rounded-3xl">
          One Place for All Your Needs
        </h1>

        <div className="inline-block">
          <p className="font-bold text-xs sm:text-sm md:text-base text-[#7052FF] bg-white border-2 border-[#7052FF] py-2 px-4 sm:px-6 hover:bg-[#7052FF] hover:text-white transition-all duration-300 cursor-pointer rounded-full">
            Download Now
          </p>
        </div>
      </div>
      {/* Features Section */}
      <div className="space-y-8 sm:space-y-12 md:space-y-16">
        {features.map((feature, index) => (
          <div key={feature.id} className="w-full">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 ${
              index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
            }`}>
              {/* Data Card */}
              <div className={`bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm flex flex-col justify-center ${
                index % 2 === 1 ? "lg:col-start-2" : ""
              }`}>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#4A4A4A] mb-4 leading-tight">
                  {feature.title}
                </h2>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#7052FF] rounded-lg flex items-center justify-center mt-1">
                    <span className="text-white font-bold text-sm">{feature.id}</span>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-[#696C78] leading-relaxed flex-1">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className={`flex justify-center items-center ${
                index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
              }`}>
                <div className={`${phoneColors[index]} border-2 ${phoneBorders[index]} rounded-3xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300`}>
                  <div className="relative w-[240px] sm:w-[280px] md:w-[320px] aspect-[3/4]">
                    <Image
                      src={feature.image}
                      alt={feature.imageAlt}
                      fill
                      className="object-contain rounded-2xl"
                      sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, 320px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action Section */}
      <div className="text-center mt-12 sm:mt-16 md:mt-20 lg:mt-24">
        <Link href="/auth/google">
          <button className="inline-flex items-center justify-center gap-3 bg-[#7052FF] hover:bg-[#5a42d4] active:bg-[#4a36b8] text-white font-semibold text-base sm:text-lg md:text-xl px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#7052FF] focus:ring-opacity-50">
            <span>Get Started Today</span>
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Download;
