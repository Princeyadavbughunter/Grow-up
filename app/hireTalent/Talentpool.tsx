import React from 'react'

const Talentpool = () => {
  return (
     <div className='sm:px-6'>
            <div className='bg-[#23282C] py-6 mb-[47px] sm:m-8 sm:p-8 rounded-3xl'>
                <h1 className='font-bold text-white sm:text-[48px] text-[24px] text-center'>Our Talent Pool Includes</h1>
                <p className='sm:text-[16px] text-[14px] max-w-[400px] mx-auto sm:mt-[30px] text-center text-white'><span className='font-bold'>Just launched,</span> trusted us for their hiring needs from Our Community</p>
                <div className='sm:px-[138px] mt-[37px]'>
                    <span className='flex'>
                        <button className='sm:px-[66px] sm:py-[14px] p-2 text-[20px] font-bold sm:text-[40px] text-[#4A4A4A] bg-[#DFE691] rounded-2xl'>Developer</button>
                        <button className='sm:px-[66px] sm:py-[14px] p-2 ml-[22px] font-bold sm:text-[40px] text-[20px] text-[#4A4A4A] bg-[#DFE691] rounded-2xl'>Analyst</button>
                    </span>
                    <span className='flex items-center justify-center sm:justify-end mt-[22px]'>
                        <button className='sm:px-[66px] sm:py-[14px] font-bold sm:text-[40px] text-[20px] p-2 text-[#4A4A4A] bg-[#E9DAFF] rounded-2xl'>Designers</button>
                        <button className='sm:px-[66px] sm:py-[14px] ml-[22px] p-2 font-bold text-[20px] sm:text-[40px] text-[#4A4A4A] bg-[#E9DAFF] rounded-2xl'>Product Manager</button>
                    </span>
                </div>
            </div>
     </div>
  )
}

export default Talentpool
