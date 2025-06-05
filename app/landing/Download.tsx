import React from 'react'
import Image from 'next/image'

const Download = () => {
  return (
    <div className='sm:max-w-[1000px] sm:mx-auto'>
          <h1 className='text-[40px] bg-faq-gradient text-[#4A4A4A] font-semibold items-center text-center'>One Place for All Your Needs</h1>
          <p className='font-bold text-[16px] border border-b text-center text-[#7052FF]'>Download Now</p>
          <div className='flex bg-[#FFF7E3] px-[10px] max-h-[312px] rounded-2xl'>
               <div className=' sm:pl-[95px] sm:pr-[20px]'>
                    <h1 className='text-[#4A4A4A] text-[28px] mt-[56px] mb-8'>Earn Money</h1>
                    <p className='text-[16px] text-[#696C78]'> Get the right team, gigs, and partners to power your vision. Connect, collaborate, and bring it all to life—right here, in one place.- iska lia line</p>
               </div>
          </div>
               <span className='flex items-center justify-center'>
               <Image src='/gig1.png' alt='img' width={309} height={1000} className='bg-[#FFF7E3] rounded-md p-1'/>
               </span>
          <div className='flex bg-[#FFF7E3] px-[10px] max-h-[312px] rounded-2xl'>
               <div className=' sm:pl-[95px] sm:pr-[20px]'>
                    <h1 className='text-[#4A4A4A] text-[28px] mt-[56px] mb-8'>Earn Money</h1>
                    <p className='text-[16px] text-[#696C78]'> Get the right team, gigs, and partners to power your vision. Connect, collaborate, and bring it all to life—right here, in one place.- iska lia line</p>
               </div>
          </div>
               <span className='flex items-center justify-center'>
               <Image src='/gig1.png' alt='img' width={309} height={1000} className='bg-[#FFF7E3] rounded-md p-1'/>
               </span>
          <div className='flex bg-[#FFF7E3] px-[10px] max-h-[312px] rounded-2xl'>
               <div className=' sm:pl-[95px] sm:pr-[20px]'>
                    <h1 className='text-[#4A4A4A] text-[28px] mt-[56px] mb-8'>Earn Money</h1>
                    <p className='text-[16px] text-[#696C78]'> Get the right team, gigs, and partners to power your vision. Connect, collaborate, and bring it all to life—right here, in one place.- iska lia line</p>
               </div>
          </div>
               <span className='flex items-center justify-center'>
               <Image src='/gig1.png' alt='img' width={309} height={1000} className='bg-[#FFF7E3] rounded-md p-1'/>
               </span>
    </div>
  )
}

export default Download
