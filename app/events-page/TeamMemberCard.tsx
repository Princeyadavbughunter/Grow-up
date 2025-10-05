"use client";

import React from 'react'

const TeamMemberCard = () => {
  const teamMembers = [
    {
      name: "Dirghayu Kaushik",
      title: "Co-Founder & CEO, Ambitio | Building Copilot for Higher Education Abroad👨🏻‍🎓 | IIT BHU",
      image: "/events/dirghayu.jpeg",
      linkedin: "https://www.linkedin.com/in/dirghayukaushik",
    },
    {
      name: "Aryan Trivedi",
      title: "Founder - Finzie | Helping Startups with Freelancer Onboarding",
      image: "/events/aryan_trivedi.jpeg",
      linkedin: "https://www.linkedin.com/in/aryantrivedi/",
    },
    {
      name: "Akanksha Garg",
      title: "Sde2 @Salesforce| Ex SDE @Microsoft | SDE Intern @Amazon | GSoC'21 @AboutCode | IIT Kanpur'22",
      image: "/events/akansha_garg.jpeg",
      linkedin: "https://www.linkedin.com/in/akanksha-garg-5b2868194/",
    },
    {
      name: "Siddharth Prakash",
      title: "Co-Founder and COO @ Baylink | Product @Housing | Startups, Entrepreneurship",
      image: "/events/siddhart_prakash.jpeg",
      linkedin: "https://www.linkedin.com/in/siddharth-prakash-0551091b8",
    },
  ];

  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Grid Layout for responsive design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-7xl mx-auto">
        {teamMembers.map((member, index) => (
          <div 
            key={index} 
            className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden max-w-sm mx-auto w-full transform hover:scale-105 relative"
          >
            {/* LinkedIn Icon - Top Right */}
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 right-4 z-20 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#0077B5] hover:bg-[#005582] transition-colors duration-300 shadow-md hover:shadow-lg"
              aria-label={`Visit ${member.name}'s LinkedIn profile`}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            
            {/* Gradient Background */}
            <div className="bg-gradient-to-b from-[#7052FF] to-[#A392FF] h-32 sm:h-36 md:h-40 rounded-t-3xl flex justify-center items-end relative">
              {/* Circular Image */}
              <div className="absolute top-[70%] z-10 transform -translate-y-[50%] rounded-full overflow-hidden border-4 border-white w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gray-200">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRTVFN0VCIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzciIHI9IjEyIiBmaWxsPSIjOUM5Q0EzIi8+CjxwYXRoIGQ9Ik0yMCA3MEMyMCA2My4zNzI2IDI1LjM3MjYgNTggMzIgNThIMzZDNDIuNjI3NCA1OCA0OCA2My4zNzI2IDQ4IDcwVjc4SDIwVjcwWiIgZmlsbD0iIzlDOUNBMyIvPgo8cGF0aCBkPSJNNTIgNzBDNTIgNjMuMzcyNiA1Ny4zNzI2IDU4IDY0IDU4SDY4Qzc0LjYyNzQgNTggODAgNjMuMzcyNiA4MCA3MFY3OEg1MlY3MFoiIGZpbGw9IiM5QzlDQTMiLz4KPC9zdmc+';
                  }}
                />
              </div>
            </div>
            
            {/* Text Content */}
            <div className="pt-12 sm:pt-14 md:pt-16 pb-6 px-4 sm:px-5 md:px-6 text-center">
              <h3 className="text-lg sm:text-xl md:text-xl font-bold text-gray-800 mb-2 leading-tight">
                {member.name}
              </h3>
              <p className="text-xs sm:text-sm md:text-sm text-gray-600 leading-relaxed">
                {member.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMemberCard;