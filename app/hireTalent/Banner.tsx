import React from 'react'

const Banner = () => {
  return (
    <div className='flex flex-col'>
    <h1 className='font-bold text-[#5A4862] sm:text-[48px] text-[20px] sm:px-[80px] sm:max-w-[80%] mx-auto text-center'>Take the first step toward your next big freelance gig.</h1>
    <div className="flex justify-center items-center">
      <button className='font-bold sm:text-[40px] text-[20px] text-white flex items-center justify-center py-[12px] px-[24px] rounded-3xl bg-[#7052FF]'>
          Explore Gig
      </button>
      </div>
      <p className='text-[32px] font-medium py-6 mb-12 text-center text-[#5A4862]'>Freelancing made simple</p>
</div>
  )
}

export default Banner