"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Image from 'next/image'

const LandingTestimonials = () => {
  const testimonials = [
    { 
      name: 'Sarah Johnson', 
      image: '/testimonial1.png', 
      bgColor: 'bg-blue-50',
      role: 'Freelance Designer',
      testimonial: 'GrowUp Buddy transformed my freelance career. I found amazing clients and doubled my income within 3 months!'
    },
    { 
      name: 'Michael Chen', 
      image: '/testimonial1.png', 
      bgColor: 'bg-yellow-50',
      role: 'Software Developer',
      testimonial: 'The community here is incredible. I learned new skills and found my dream job through the connections I made.'
    },
    { 
      name: 'Emma Rodriguez', 
      image: '/testimonial1.png', 
      bgColor: 'bg-green-50',
      role: 'Marketing Specialist',
      testimonial: 'Amazing platform for networking and growth. The gigs I found here helped me build a strong portfolio.'
    },
    { 
      name: 'David Kim', 
      image: '/testimonial1.png', 
      bgColor: 'bg-[#7052FF]/5',
      role: 'Content Creator',
      testimonial: 'GrowUp Buddy gave me the tools and connections I needed to turn my passion into a profitable business.'
    },
    { 
      name: 'Lisa Thompson', 
      image: '/testimonial1.png', 
      bgColor: 'bg-pink-50',
      role: 'Business Consultant',
      testimonial: 'The learning opportunities and expert connections have accelerated my professional growth significantly.'
    },
    { 
      name: 'Alex Brown', 
      image: '/testimonial1.png', 
      bgColor: 'bg-indigo-50',
      role: 'Entrepreneur',
      testimonial: 'Found my co-founder and initial team through GrowUp Buddy. This platform is a game-changer for startups.'
    },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
      
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12 md:mb-16">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold bg-gradient-to-r from-[#FFFFFF] via-[#E9DAFF] to-[#FFFFFF] text-[#4A4A4A] leading-tight mb-6 sm:mb-8 max-w-4xl mx-auto py-2 sm:py-4 md:py-6 lg:py-8 px-6 sm:px-8 md:px-12 rounded-2xl sm:rounded-3xl whitespace-nowrap">
  How GrowUp Buddy is Changing Lives
</h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-500 font-medium">
          Hear from Our Community
        </p>
      </div>

      {/* Testimonials Slider */}
      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          breakpoints={{
            480: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 1.5,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 28,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 32,
            },
          }}
          className="testimonials-swiper pb-12 sm:pb-16"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className={`relative rounded-2xl mb-10 sm:rounded-3xl ${testimonial.bgColor} border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group overflow-hidden h-full`}>
                
                {/* LinkedIn Icon */}
                <div className="flex justify-end p-4 sm:p-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Image 
                      src="/linedin.png" 
                      alt="LinkedIn Logo" 
                      width={24} 
                      height={24}
                      className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 sm:px-6 pb-6 sm:pb-8">
                  
                  {/* Name and Role */}
                  <div className="text-center mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#4A4A4A] mb-1 sm:mb-2">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm sm:text-base text-[#7052FF] font-medium">
                      {testimonial.role}
                    </p>
                  </div>

                  {/* Testimonial Text */}
                  <div className="mb-6 sm:mb-8">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-[#696C78] text-sm sm:text-base md:text-lg text-center leading-relaxed line-clamp-4">
                      "{testimonial.testimonial}"
                    </p>
                  </div>

                  {/* Profile Image */}
                  <div className="flex justify-center">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Image 
                        src={testimonial.image} 
                        alt={`${testimonial.name} profile`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="hidden lg:block">
          <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-[#7052FF] hover:text-[#5a42d4] transition-all duration-300 z-10 group">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-[#7052FF] hover:text-[#5a42d4] transition-all duration-300 z-10 group">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .testimonials-swiper .swiper-pagination {
          bottom: 0 !important;
        }
        .testimonials-swiper .swiper-pagination-bullet {
          background: #7052FF !important;
          opacity: 0.3 !important;
          width: 12px !important;
          height: 12px !important;
        }
        .testimonials-swiper .swiper-pagination-bullet-active {
          opacity: 1 !important;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default LandingTestimonials