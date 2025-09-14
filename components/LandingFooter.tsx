import Image from 'next/image'
import React from 'react'
import { Twitter, Facebook, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react'

const LandingFooter = () => {
  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Hire talent', href: '/talent' },
        { name: 'Gigs', href: '/gigs-page' },
        { name: 'Events', href: '/events-page' },
        { name: 'Community', href: '/community' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Contact Support', href: '/support' },
      ],
    },
    {
      title: 'Contact Us',
      links: [
        { name: 'contact@growupbuddy.com', href: 'mailto:contact@growupbuddy.com', icon: <Mail className="w-4 h-4" /> },
        { name: '+1 (555) 123-4567', href: 'tel:+15551234567', icon: <Phone className="w-4 h-4" /> },
        { name: 'San Francisco, CA', href: '#', icon: <MapPin className="w-4 h-4" /> },
      ],
    },
  ]

  const socialIcons = [
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com/growupbuddy', color: 'hover:text-blue-400' },
    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, href: 'https://facebook.com/growupbuddy', color: 'hover:text-blue-600' },
    { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, href: 'https://linkedin.com/company/growupbuddy', color: 'hover:text-blue-500' },
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, href: 'https://instagram.com/growupbuddy', color: 'hover:text-pink-500' },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#7052FF] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-500 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        
        {/* Download App Section */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            
            {/* Download Title */}
            <div className="text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white bg-clip-text text-transparent">
                Download app now
              </h2>
              <p className="text-gray-300 text-base sm:text-lg max-w-md">
                Get the full GrowUp Buddy experience on your mobile device. Available on all platforms.
              </p>
            </div>
            
            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-end items-center gap-4 sm:gap-6">
              <a 
                href="#" 
                className="group transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                aria-label="Download on App Store"
              >
                <Image 
                  src="/playstore.png" 
                  alt="Download on App Store" 
                  width={160} 
                  height={48}
                  className="w-36 sm:w-40 h-auto group-hover:brightness-110 transition-all duration-300"
                />
              </a>
            </div>
          </div>
          
          {/* Separator */}
          <div className="border-t border-gray-700 w-full mt-8 sm:mt-12"></div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16 mb-12 sm:mb-16">
          
          {/* Company Info */}
          <div className="lg:col-span-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-6">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 mr-3">
                <Image
                  src="/logo_grow_up_buddy.png"
                  alt="GrowUp Buddy Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="font-bold text-xl sm:text-2xl text-[#F4ECFF]">
                GrowUp Buddy
              </h1>
            </div>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 max-w-sm mx-auto md:mx-0">
              GrowUp Buddy is a community-based startup dedicated to empowering
              individuals to achieve their professional and personal goals. Join
              us and be part of a growing community that's changing the way
              people connect and grow.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="text-[#7052FF] font-semibold text-sm sm:text-base">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7052FF] text-white placeholder-gray-400"
                />
                <button className="px-4 py-2 bg-[#7052FF] hover:bg-[#5a42d4] text-white text-sm font-medium rounded-lg transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index} className="text-center md:text-left">
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-[#7052FF]">
                {section.title}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href || '#'}
                      className="text-gray-400 hover:text-white text-sm sm:text-base transition-colors duration-300 flex items-center justify-center md:justify-start gap-2 group"
                    >
                      {link.icon && (
                        <span className="text-[#7052FF] group-hover:text-[#8B5FFF] transition-colors duration-300">
                          {link.icon}
                        </span>
                      )}
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name || link}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media Section */}
        <div className="border-t border-gray-700 pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            
            {/* Social Media */}
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-[#7052FF] text-sm sm:text-base mb-4 sm:mb-6">
                FOLLOW US
              </h4>
              <div className="flex justify-center sm:justify-start space-x-4 sm:space-x-6">
                {socialIcons.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`p-2 sm:p-3 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 ${social.color} transition-all duration-300 transform hover:scale-110 hover:shadow-lg group`}
                    aria-label={`Follow us on ${social.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="group-hover:rotate-12 transition-transform duration-300 block">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Trust Badges / Awards (Optional) */}
            <div className="text-center sm:text-right">
              <div className="flex justify-center sm:justify-end items-center gap-4 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Secure Platform
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Trusted by 50K+
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center sm:text-left">
            <p className="text-gray-500 text-xs sm:text-sm">
              © 2024 GrowUp Buddy. All Rights Reserved. Made with ❤️ by the GrowUp Buddy Team
            </p>
            <div className="flex justify-center sm:justify-end gap-4 sm:gap-6 text-xs sm:text-sm">
              <a href="/privacy" className="text-gray-500 hover:text-white transition-colors duration-300">
                Privacy
              </a>
              <a href="/terms" className="text-gray-500 hover:text-white transition-colors duration-300">
                Terms
              </a>
              <a href="/cookies" className="text-gray-500 hover:text-white transition-colors duration-300">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter