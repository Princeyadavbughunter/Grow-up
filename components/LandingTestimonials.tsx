"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Image from 'next/image';


const LandingTestimonials = () => {
    const testimonials = [
        { name: 'Kiran', image: '/testimonial1.png', bgColor: 'bg-blue-100' },
        { name: 'Kiran', image: '/testimonial1.png', bgColor: 'bg-yellow-100' },
        { name: 'Kiran', image: '/testimonial1.png', bgColor: 'bg-green-100' },
        { name: 'Kiran', image: '/testimonial1.png', bgColor: 'bg-blue-100' },
        { name: 'Kiran', image: '/testimonial1.png', bgColor: 'bg-blue-100' },
        { name: 'Kiran', image: '/testimonial1.png', bgColor: 'bg-blue-100' },
      ];
  return (
    <div className="py-12 sm:pl-[88px] pr-[26px] pl-[26px]">
      <h2 className="text-center text-[40px] text-[#4A4A4A] font-bold">How <span className='bg-faq-gradient'>GrowUp Buddy is Changing</span> Lives</h2>
      <p className="text-center text-gray-500 mt-2 mb-8">Hear from Our Community</p>
      <Swiper spaceBetween={20} slidesPerView={1} breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 4 },
      }}>
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className={`rounded-lg ${testimonial.bgColor}`}>
            <div className="flex justify-end">
                <Image src="/linedin.png" alt="LinkedIn_Logo" width={35} height={35} className='m-1' />
                </div>

                <h3 className="text-[24px] text-[#4A4A4A] text-center flex items-center justify-center font-bold">{testimonial.name}</h3>
           

              <p className="text-[#696C78] text-[16px] text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
              </p>
              <div className="flex justify-center items-center">
  <Image src={testimonial.image} alt={testimonial.name} width={256} height={239} className="object-cover" />
</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default LandingTestimonials
