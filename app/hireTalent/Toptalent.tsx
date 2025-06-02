import React from 'react'
import Image from 'next/image'

const Toptalent = () => {
    const timelineData = [
        "Find the Perfect Fit",
        "Attract Top Talent",
        "Seamless Application Process",
        "Streamlined Communication",
        "Build Your Talent Pipeline",
      ];

  return (
    <div className='sm:max-w-[1400px] mx-auto sm:py-[60px]'>
    <div className='py-6 bg-[#23282C] sm:rounded-[80px] rounded-[40px] sm:px-[50px] mx-[10px] mt-[100px] flex items-center sm:justify-between sm:flex-row flex-col sm:mx-[40px]  sm:h-[400px]'>
      <div className='hidden sm:block'>
          <h1 className='font-bold max-w-[450px] mx-auto text-white text-[36px]'>Top talent, just <span className='text-[#7052FF]'>60 seconds</span> away</h1>
      </div>
      <div className='flex items-center justify-center'>
        {/* Image container */}
        <Image src={'/mobile.png'} width={296} height={810} alt="iPhone Image" className='object-contain sm:mb-[250px] sm:pr-8 sm:mr-[100px] h-full' />
      </div>
      <div className='sm:hidden my-[10px] block'>
          <h1 className='font-bold text-center max-w-[450px] mx-auto text-white text-[36px]'>Top talent, just <span className='text-[#7052FF]'>60 seconds</span> away</h1>
      </div>
      <div className=''>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-600"></div>
  
          {/* Timeline items */}
          <div className="space-y-8">
            {timelineData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="relative">
                  {/* Circle point */}
                  <div className="w-5 h-5 rounded-full bg-gray-600 z-10 relative shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                </div>
                {/* Timeline item text */}
                <div className="ml-6">
                  <p className="text-white text-lg">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  )
}

export default Toptalent
