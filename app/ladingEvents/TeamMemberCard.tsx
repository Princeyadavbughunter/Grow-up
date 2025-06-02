"use client"
import React from 'react'
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const TeamMemberCard = ({ name, title, image }) => {
    const teamMembers = [
        {
          name: "Priyanka Chopra",
          title: "Founder - Finzie | Ex Groww | BITS Pilani",
          image: "/Team1.png",
        },
        {
          name: "Priyanka Chopra",
          title: "Founder - Finzie | Ex Groww | BITS Pilani",
          image: "/Team1.png",
        },
        {
          name: "Priyanka Chopra",
          title: "Founder - Finzie | Ex Groww | BITS Pilani",
          image: "/Team1.png",
        },
        {
          name: "Priyanka Chopra",
          title: "Founder - Finzie | Ex Groww | BITS Pilani",
          image: "/Team1.png",
        },
        {
          name: "Priyanka Chopra",
          title: "Founder - Finzie | Ex Groww | BITS Pilani",
          image: "/Team1.png",
        },
        {
          name: "Priyanka Chopra",
          title: "Founder - Finzie | Ex Groww | BITS Pilani",
          image: "/Team1.png",
        },
        // Add more members here
      ];
  return (

    
    <div className="flex flex-row justify-center px-[100px] items-center p-4">
        <Swiper spaceBetween={20}
                  breakpoints={{
                    // When window width is >= 1024px, show 4 slides
                    1024: {
                      slidesPerView: 4,
                      spaceBetween: 30,
                    },
                    // When window width is >= 768px, show 2 slides
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    // When window width is <= 640px (mobile devices), show 1 slide
                    640: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                  }}
      >
    {teamMembers.map((member, index) => (
         <SwiperSlide key={index}>
      <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-sm mx-auto mb-6">
        {/* Gradient Background */}
        <div className="bg-gradient-to-b from-[#7052FF] to-[#A392FF] h-40 rounded-t-3xl flex justify-center items-end relative">
          {/* Circular Image */}
          <div className="absolute top-[70%] z-10 transform -translate-y-[50%] rounded-full overflow-hidden border-4 border-white w-28 h-28">
            <Image
              src={member.image}
              alt={member.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="pt-16 pb-6 px-4 text-center">
          <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
          <p className="text-sm text-gray-600 mt-2">{member.title}</p>
        </div>
      </div>
      </SwiperSlide>
    ))}
    </Swiper>
  </div>
  )
}

export default TeamMemberCard







