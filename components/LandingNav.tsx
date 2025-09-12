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
      <div className="max-w-[1400px] mx-auto px-20 lg:px-8=24">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <div onClick={() => router.push('/')} className="flex cursor-pointer items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10">
              <Image 
                src='/logo.svg' 
                alt='GrowUp Buddy Logo' 
                width={40} 
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">
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
            <Link href="/explore" className={`font-semibold transition-colors duration-200 ${
              pathname === '/explore' ? 'text-[#7052FF]' : 'text-gray-600 hover:text-[#7052FF]'
            }`}>
              Club
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/google" className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200">
              Sign in
            </Link>
            <Link href="/auth/google" className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md">
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link 
              href="/talent" 
              className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                pathname === '/talent' 
                  ? 'text-[#7052FF] bg-purple-50' 
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
                  ? 'text-[#7052FF] bg-purple-50' 
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
                  ? 'text-[#7052FF] bg-purple-50' 
                  : 'text-gray-700 hover:text-[#7052FF] hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Gigs
            </Link>
            <Link 
              href="/explore" 
              className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                pathname === '/explore' 
                  ? 'text-[#7052FF] bg-purple-50' 
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
                  className="w-full text-center py-2 text-purple-600 hover:text-purple-800 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link 
                  href="/auth/google" 
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors duration-200 text-center"
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