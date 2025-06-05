"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const Upcoming = () => {
    const eventCards = [
        {
          date: "Web, May 08 @ 6:00 PM",
          attendees: "456 Bubby",
          title: "Building the Fastest Growing Gaming Tech",
          organizer: "Growbuddy Events",
          description: "For the Community, From The community",
          buttonText: "Register Now",
          bgColor: "bg-purple-100",
          iconColor: "bg-yellow-400",
          attendeesColor: "bg-purple-200",
        },
     
        {
          date: "Web, May 08 @ 6:00 PM",
          attendees: "456 Bubby",
          title: "Building the Fastest Growing Gaming Tech",
          organizer: "Growbuddy Events",
          description: "For the Community, From The community",
          buttonText: "Register Now",
          bgColor: "bg-white",
          iconColor: "bg-yellow-400",
          attendeesColor: "bg-purple-200",
        },
        {
          date: "Web, May 08 @ 6:00 PM",
          attendees: "456 Bubby",
          title: "Building the Fastest Growing Gaming Tech",
          organizer: "Growbuddy Events",
          description: "For the Community, From The community",
          buttonText: "Register Now",
          bgColor: "bg-white",
          iconColor: "bg-yellow-400",
          attendeesColor: "bg-purple-200",
        },
        {
          date: "Web, May 08 @ 6:00 PM",
          attendees: "456 Bubby",
          title: "Building the Fastest Growing Gaming Tech",
          organizer: "Growbuddy Events",
          description: "For the Community, From The community",
          buttonText: "Register Now",
          bgColor: "bg-white",
          iconColor: "bg-yellow-400",
          attendeesColor: "bg-purple-200",
        },
        {
          date: "Web, May 08 @ 6:00 PM",
          attendees: "456 Bubby",
          title: "Building the Fastest Growing Gaming Tech",
          organizer: "Growbuddy Events",
          description: "For the Community, From The community",
          buttonText: "Register Now",
          bgColor: "bg-white",
          iconColor: "bg-yellow-400",
          attendeesColor: "bg-purple-200",
        },
      ];
  return (
     <div>
           <h1 className='text-[40px] font-bold text-center text-[#4A4A4A] mb-8 '>Upcoming Events</h1>
            <div className="sm:pl-[120px] flex flex-row px-2">
      <Swiper
        spaceBetween={30}
       
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        className="mySwiper"
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
        {eventCards.map((card, index) => (
          <SwiperSlide key={index}>
            <div className={`p-4 rounded-lg shadow-md ${card.bgColor}`}>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${card.iconColor}`}>
                  {card.date}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${card.attendeesColor}`}>
                  {card.attendees}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{card.title}</h3>
              <p className="text-sm font-semibold mt-2 text-gray-700">{card.organizer}</p>
              <p className="text-xs mt-1 text-gray-500">{card.description}</p>
              <button className="w-full mt-4 py-2 rounded-lg bg-purple-500 text-white text-sm font-semibold">
                {card.buttonText}
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
     </div>
  )
}

export default Upcoming
