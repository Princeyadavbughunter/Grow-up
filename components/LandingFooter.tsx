import Image from 'next/image'
import React from 'react'
import { Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';


const LandingFooter = () => {
  const footerLinks = [
    {
      title: 'Quick Links',
      links: ['Hire talent', 'Clubs', 'Gigs', 'Events', 'Community'],
    },
    {
      title: 'Contact Us',
      links: ['contact@growupbuddy.com'],
    },
  ];
  
  const socialIcons = [
    { name: 'X', icon: <Twitter /> },
    { name: 'Facebook', icon: <Facebook /> },
    { name: 'LinkedIn', icon: <Linkedin /> },
    { name: 'Instagram', icon: <Instagram /> },
  ];
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col ">
          <div className='flex justify-between sm:flex-row flex-col'>
            <h2 className="sm:text-[40px] text-[32px] font-bold mb-4">Download app now</h2>
            <div className="flex justify-center space-x-4 mb-8">
              <Image src="/playstore.png" alt="Google Play" className="w-36" width={150} height={44} />
              <Image src="/playstore.png" alt="App Store" className="w-36" width={150} height={44} />
            </div>
          </div>
          <div className="border-t border-gray-700 w-full mt-1"></div>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="text-center md:text-left">
             <span className='flex items-center'> <Image
              src="/logo_grow_up_buddy.png"
              alt="GrowUp Buddy"
              className="w-12 h-12 mx-auto md:mx-0"
              width={44}
              height={44}
            />
            <h1 className='font-bold text-[20px] text-[#F4ECFF]'>GrowUp Buddy</h1>
            </span>
            <p className="mt-4 text-gray-400">
              GrowUp Buddy is a community-based startup dedicated to empowering
              individuals to achieve their professional and personal goals. Join
              us and be part of a growing community that's changing the way
              people connect and grow.
            </p>
          </div>

          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold mb-4 text-purple-500">
                {section.title}
              </h3>
              <ul>
                {section.links.map((link, idx) => (
                  <li key={idx} className="mb-2 text-gray-400">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <h1 className='font-bold text-[#7052FF]'>FOLLOW US</h1>
        <div className="mt-2 flex  space-x-4">
          {socialIcons.map((icon, index) => (
            <a
              key={index}
              href="#"
              className="text-gray-400 hover:text-white"
            >
              {icon.icon}
            </a>
          ))}
        </div>

        <p className=" text-gray-500 mt-8">
          © 2024. All Rights Reserved. Made with love by GrowUpBuddy
        </p>
      </div>
    </footer> 
  )
}

export default LandingFooter
