"use client"
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';



// import required modules
import { EffectCards } from 'swiper/modules';

const WhyUs = () => {
  return (
     <div className='flex sm:flex-row flex-col justify-center items-center sm:gap-x-[112px] max-w-[1400px]'>
         <h1 className='font-bold text-[32px] sm:max-w-[15%] text-center text-[#4A4A4A]'>Why Choose Us?</h1>
         <div>
         <Swiper
  effect={'cards'}
  grabCursor={true}
  modules={[EffectCards]}
  className="mySwiper sm:w-[418px] sm:h-[418px]"
  style={{
 
  }}
>
  <SwiperSlide className="swiper-slide">
    <div className='bg-[#00613B] p-4 w-full h-full justify-center items-center rounded-lg'>
      <p className='bg-white sm:w-[8%] w-[14%] text-[#5A4862] font-medium p-1 rounded-full'>04</p>
      <div className='text-center mt-[100px]'>
        <h1 className='font-semibold text-[white] text-[32px]'>Quality Candidates</h1>
        <p className='font-semibold mt-[68px] text-[white]'>Access a curated list of highly qualified professionals</p>
      </div>
    </div>
  </SwiperSlide>
  <SwiperSlide className="swiper-slide">
    <div className='bg-[#00613B] p-4 w-full h-full justify-center items-center rounded-lg'>
      <p className='bg-white w-[8%] text-[#5A4862] font-medium p-1 rounded-full'>04</p>
      <div className='text-center mt-[100px]'>
        <h1 className='font-semibold text-[white] text-[32px]'>Quality Candidates</h1>
        <p className='font-semibold mt-[68px] text-[white]'>Access a curated list of highly qualified professionals</p>
      </div>
    </div>
  </SwiperSlide>
  <SwiperSlide className="swiper-slide">
    <div className='bg-[#00613B] p-4 w-full h-full justify-center items-center rounded-lg'>
      <p className='bg-white w-[8%] text-[#5A4862] font-medium p-1 rounded-full'>04</p>
      <div className='text-center mt-[100px]'>
        <h1 className='font-semibold text-[white] text-[32px]'>Quality Candidates</h1>
        <p className='font-semibold mt-[68px] text-[white]'>Access a curated list of highly qualified professionals</p>
      </div>
    </div>
  </SwiperSlide>
  <SwiperSlide className="swiper-slide">
    <div className='bg-[#00613B] p-4 w-full h-full justify-center items-center rounded-lg'>
      <p className='bg-white w-[8%] text-[#5A4862] font-medium p-1 rounded-full'>04</p>
      <div className='text-center mt-[100px]'>
        <h1 className='font-semibold text-[white] text-[32px]'>Quality Candidates</h1>
        <p className='font-semibold mt-[68px] text-[white]'>Access a curated list of highly qualified professionals</p>
      </div>
    </div>
  </SwiperSlide>

</Swiper>

         </div>
     </div>
  )
}

export default WhyUs
