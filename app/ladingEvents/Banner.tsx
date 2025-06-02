import React from 'react'

const banner = () => {
  return (
    <div className='flex mb-[160px] mt-[66px] flex-col items-center'>
        <div className="border-t border-dashed h-2 w-2 border-gray-500 my-4"/>

         <h1 className='text-[48px] font-bold text-[#5A4862]'>Don’t miss out on our next event! </h1>
         <button className='p-[17px] my-[70px] bg-[#7052FF] text-white font-semibold rounded-md text-[40px] items-center text-center'>Register now</button>
         <p className='text-[#5A4862] text-[32px] font-medium text-center'>to stay updated and be part of the GrowUp Buddy community</p>
    </div>
  )
}

export default banner