'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'

const LandingNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  return (
    <nav className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-24">
        <div className="flex items-center justify-between py-4 sm:py-6">
          {/* Logo */}
          <div onClick={() => router.push('/')} className="flex cursor-pointer items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10">
              <Image 
                src='/logo.svg' 
                alt='GrowUp Buddy Logo' 
                width={40} 
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              GrowUp Buddy
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/talent" className={`font-semibold transition-colors duration-200 ${
              pathname === '/talent' ? 'text-[#7052FF]' : 'text-gray-600 hover:text-[#7052FF]'
            }`}>
              Hire talent
            </Link>
            <Link href="/events-page" className={`font-semibold transition-colors duration-200 ${
              pathname === '/events-page' ? 'text-[#7052FF]' : 'text-gray-600 hover:text-[#7052FF]'
            }`}>
              Events
            </Link>
            <Link href="/gigs-page" className={`font-semibold transition-colors duration-200 ${
              pathname === '/gigs-page' ? 'text-[#7052FF]' : 'text-gray-600 hover:text-[#7052FF]'
            }`}>
              Gigs
            </Link>
            <Link href="/clubs-page" className={`font-semibold transition-colors duration-200 ${
              pathname === '/clubs-page' ? 'text-[#7052FF]' : 'text-gray-600 hover:text-[#7052FF]'
            }`}>
              Club
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/google" className="text-[#7052FF] hover:text-[#5a42d4] font-medium transition-colors duration-200">
              Get Started
            </Link>
            <Link href="/auth/google" className="bg-[#7052FF] text-white px-6 py-3 rounded-full hover:bg-[#5a42d4] font-medium transition-all duration-200 shadow-sm hover:shadow-md">
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex-shrink-0">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#7052FF] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#7052FF] transition-colors duration-200"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <span className="sr-only">{isMenuOpen ? "Close menu" : "Open main menu"}</span>
              {/* Hamburger icon */}
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-3 space-y-1 sm:px-6 bg-white border-t border-gray-200">
            <Link 
              href="/talent" 
              className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                pathname === '/talent' 
                  ? 'text-[#7052FF] bg-[#7052FF]/10' 
                  : 'text-gray-700 hover:text-[#7052FF] hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Hire talent
            </Link>
            <Link 
              href="/events-page" 
              className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                pathname === '/events-page' 
                  ? 'text-[#7052FF] bg-[#7052FF]/10' 
                  : 'text-gray-700 hover:text-[#7052FF] hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              href="/gigs-page" 
              className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                pathname === '/gigs-page' 
                  ? 'text-[#7052FF] bg-[#7052FF]/10' 
                  : 'text-gray-700 hover:text-[#7052FF] hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Gigs
            </Link>
            <Link 
              href="/clubs-page" 
              className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                pathname === '/clubs-page' 
                  ? 'text-[#7052FF] bg-[#7052FF]/10' 
                  : 'text-gray-700 hover:text-[#7052FF] hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Club
            </Link>
            
            {/* Mobile Auth Buttons */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3 space-y-3 flex-col">
                <Link 
                  href="/auth/google" 
                  className="w-full text-center py-2 text-[#7052FF] hover:text-[#5a42d4] transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link 
                  href="/auth/google" 
                  className="w-full bg-[#7052FF] text-white px-4 py-2 rounded-full hover:bg-[#5a42d4] transition-colors duration-200 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default LandingNav