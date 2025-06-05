import React from 'react'

const Counter = () => {
  return (
    <div>
        <h1 className='text-[40px]  text-[#4A4A4A] text-center font-bold'> <span className='bg-faq-gradient'>Some Numbers That Matters</span> </h1>

       <div className='bg-cover bg-center bg-no-repeat'  style={{ backgroundImage: "url('/counter-bg.png')" }}>
       <div className='flex justify-between max-w-[1400px] mx-auto '>
            <div>
                <h1 className='text-[#7052FF] text-[80px] pb-[21px] font-bold'>50,000+</h1>
                <p className='text-[20px] text-white'>Community members</p>
            </div>              
            <div>
                <h1 className='text-[#7052FF] pb-[21px] text-[80px] font-bold'>50,000+</h1>
                <p className='text-[20px] text-white'>Community members</p>
            </div>              
            <div>
                <h1 className='text-[#7052FF] text-[80px] pb-[21px] font-bold'>50,000+</h1>
                <p className='text-[20px] text-white'>Community members</p>
            </div>              
         </div>
       </div>

    </div>
  )
}

export default Counter