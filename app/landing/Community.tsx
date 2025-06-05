import React from 'react'
import Image from 'next/image'
const Community = () => {
  return (
    <div>
          <div className='text-[#7052FF] sm:mt-[187px] mt-[78px] text-center flex flex-col mb-[97px] items-center'>
                <h1 className='sm:text-[40px] text-[28px]'>Join a Global Community </h1>
                <p className='sm:text-[32px] text-[20px]'>of Aspiring Change Makers</p>
                <p className='text-[#4A4A4A] text-[16px] sm:mt-[44px] mt-[23px]'>our community members are from</p>
          </div>
                <Image src='/companies.png' alt='img' width={1342} height={88} className='w-full h-full overflow-hidden'/>
    </div>
  )
}

export default Community
