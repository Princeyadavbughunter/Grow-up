"use client";

import React from 'react'

const TeamMemberCard = () => {
  const teamMembers = [
    {
      name: "Priyanka Chopra",
      title: "Founder - Finzie | Ex Groww | BITS Pilani",
      image: "/Team1.png",
    },
    {
      name: "Rahul Sharma",
      title: "CTO - TechCorp | Ex Google | IIT Delhi",
      image: "/Team2.png",
    },
    {
      name: "Anita Desai",
      title: "Head of Design | Ex Adobe | NID Ahmedabad",
      image: "/Team3.png",
    },
    {
      name: "Vikram Singh",
      title: "VP Engineering | Ex Microsoft | IIT Bombay",
      image: "/Team4.png",
    },
    {
      name: "Shreya Patel",
      title: "Product Manager | Ex Flipkart | ISB Hyderabad",
      image: "/Team5.png",
    },
    {
      name: "Arjun Mehta",
      title: "Data Scientist | Ex Amazon | IISc Bangalore",
      image: "/Team6.png",
    },
  ];

  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Grid Layout for responsive design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-7xl mx-auto">
        {teamMembers.map((member, index) => (
          <div 
            key={index} 
            className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden max-w-sm mx-auto w-full transform hover:scale-105"
          >
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