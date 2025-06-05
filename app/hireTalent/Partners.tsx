import React from 'react'
import Image from 'next/image'


const Partners = () => {
  return (
    <div className=''>
          <h1 className='text-[40px] sm:mb-[24px] text-[#696C78] text-center font-medium'><span className='text-[#7052FF]'>50+</span> Partners</h1>
          <p className='text-center text-[#4A4A4A] mb-[89px]'><span className='font-bold'>Just launched,</span> trusted us for their hiring needs from Our Community</p>
          <Image src='/companies.png' alt='img' width={1342} height={88} className='w-full h-16 sm:mb-[230px] mb-20 animate-slideX'/>
    </div>
  )
}

export default Partners
