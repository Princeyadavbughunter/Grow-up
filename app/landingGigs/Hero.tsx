import React from 'react'
import Image from 'next/image'

const Hero = () => {
  return (
    <section className="relative bg-gray-900 mb-[80px] text-white py-20 flex items-center mx-[51px] justify-center px-[51px] md:px-12 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 rounded-full w-full h-full">
        <Image
          src="/bg-landingNav.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="rounded-4xl"
        />
      </div>
      <div className="relative text-[40px] z-10 text-center max-w-2xl mx-auto">
        <h1 className="font-bold">
          Explore a <span className="text-purple-500">wide range of job</span> opportunities tailored to your skills and interests.
        </h1>
        <p className="mt-4 text-[16px]">
          Whether you’re looking for freelance gigs, internships, or full-time positions, GrowUp Buddy has something for everyone.
        </p>
      </div>
    </section>

  )
}

export default Hero
