import React from 'react'
import Image from 'next/image'


const Header = () => {
  return (
    <section className="bg-[linear-gradient(97.71deg,#23282C_72.9%,#7052FF_125.69%)] items-center sm:max-w-[1400px] mx-auto sm:mx-6 sm:h-[682px] h-[732px] rounded-[25px] sm:rounded-[80px]">
     <div className='text-center pt-[116px] w-full'>
      <p className='text-[32px] font-semibold text-[white]'>Empower your grow</p>
      <h1 className='sm:pt-[22px] text-[48px] sm:text-[128px] overflow-hidden sm:leading-[150px] text-[#FDDF8E] font-bold animate-slideX'>
          Collaborate Connect
        </h1>
    </div>
    <div className='flex flex-col items-center mt-[97px]'>
        <div className='flex'>
        <Image src='/img-1.png' width={25} height={25} alt='img'/>
        <Image src='/img-1.png' width={25} height={25} alt='img'/>
        <Image src='/img-1.png' width={25} height={25} alt='img'/>
        </div>
        <p className='text-[#F4ECFF] mt-[4px] text-[20px] font-medium'>create network</p>
        <button className='bg-[#7052FF] mt-[18px] rounded-md text-[white] text-[20px] font-semibold py-[10px] px-[12px]'>Join now</button>
    </div>
   
  </section>
  )
}

export default Header
