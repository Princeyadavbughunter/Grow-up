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
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24'>
    <div className='py-6 bg-[#23282C] sm:rounded-[80px] rounded-[40px] sm:px-[50px] flex items-center sm:justify-between sm:flex-row flex-col sm:h-[400px]'>
      <div className='hidden sm:block'>
          <h1 className='font-bold max-w-[450px] mx-auto text-white text-[36px]'>Top talent, just <span className='text-[#7052FF]'>60 seconds</span> away</h1>
      </div>
      <div className='flex items-center justify-center'>
        {/* Image container */}
        <Image src={'/mobile.png'} width={296} height={810} alt="iPhone Image" className='object-contain relative z-30 sm:mb-[250px] sm:pr-8 sm:mr-[100px] h-full' />
      </div>
      <div className='sm:hidden my-[10px] block'>
          <h1 className='font-bold text-center max-w-[450px] mx-auto text-white text-[36px]'>Top talent, just <span className='text-[#7052FF]'>60 seconds</span> away</h1>
      </div>
      <div className=''>
        <div className="relative">
          {/* Vertical line - more subtle */}
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-500 opacity-60"></div>
  
          {/* Timeline items - more subtle spacing */}
          <div className="space-y-6">
            {timelineData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="relative">
                  {/* Circle point - smaller and more subtle */}
                  <div className="w-4 h-4 rounded-full bg-gray-500 z-10 relative opacity-80"></div>
                </div>
                {/* Timeline item text */}
                <div className="ml-4">
                  <p className="text-white text-base opacity-90">{item}</p>
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
