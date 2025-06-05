import React from 'react'
import Image from 'next/image';

const Future = () => {
    const cards = [
        {
          id: 1,
          title: 'Monetize Your Skills',
          description: 'Find gigs that match your skills and start earning with GrowUp Buddy.',
          buttonText: 'View',
          icon: '/landing-icon.png',
          bgColor: 'bg-white',
          borderColor: 'border-purple-600',
          textColor: 'text-gray-900',
          buttonColor: 'bg-purple-600 text-white',
          textBtnHover: 'hover:bg-purple-700',
        },
        {
          id: 2,
          title: 'Learn & Grow',
          description: 'Join clubs, learn from experts, and stay ahead in your field.',
          icon: '/landing-icon.png',
          bgColor: 'bg-purple-600',
          borderColor: 'border-transparent',
          textColor: 'text-white',
          buttonText: '',
        },
        {
          id: 3,
          title: 'Connect & Thrive',
          description: 'Network with like-minded individuals and find collaborators for your projects.',
          icon: '/landing-icon.png',
          bgColor: 'bg-purple-600',
          borderColor: 'border-transparent',
          textColor: 'text-white',
          buttonText: '',
        },
      ];
    
  return (
    <>
       <h1 className='flex items-center text-center justify-center font-semibold text-[#4A4A4A] sm:text-[40px] sm:mt-[214px] mt-[112px] sm:mb-[91px]'>Empower Your Future in <span className='bg-faq-gradient'>3 Steps</span></h1>
  <section className="flex sm:flex-row flex-col gap-6 justify-center sm:px-[137px] px-[10px] py-12">

    {cards.map((card) => (
      <div
        key={card.id}
        className={`w-full md:w-1/3   rounded-2xl border-2 ${card.bgColor} ${card.borderColor}`}
      >
        <div className="flex flex-col items-center text-center pt-[51px] px-[18px] pb-[40px]">
          <div className="p-4 bg-purple-100 rounded-lg mb-[50px]">
            <Image src={card.icon} alt={card.title} width={50} height={50} />
          </div>
          <h3 className={`text-2xl font-bold ${card.textColor}`}>{card.title}</h3>
          <p className={`text-lg mt-4 ${card.textColor}`}>{card.description}</p>
          {card.buttonText && (
            <button
              className={`mt-6 px-4 py-2 rounded-full ${card.buttonColor} ${card.textBtnHover}`}
            >
              {card.buttonText} →
            </button>
          )}
        </div>
      </div>
    ))}
  </section>

  </>
  )
}

export default Future
