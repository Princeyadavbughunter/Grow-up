'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const LandingNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10">
              <Image 
                src='/logo_grow_up_buddy.png' 
                alt='GrowUp Buddy Logo' 
                width={40} 
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              <span className="hidden sm:inline">GrowUp Buddy</span>
              <span className="sm:hidden">GrowUp</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
              Hire talent
            </Link>
            <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
              Events
            </Link>
            <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
              Gigs
            </Link>
            <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
              Community
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/signin" className="text-purple-600 hover:text-purple-800 transition-colors duration-200">
              Sign in
            </Link>
            <Link href="/login" className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors duration-200">
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
              href="/" 
              className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Hire talent
            </Link>
            <Link 
              href="/" 
              className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              href="/" 
              className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Gigs
            </Link>
            <Link 
              href="/" 
              className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </Link>
            
            {/* Mobile Auth Buttons */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3 space-y-3 flex-col">
                <Link 
                  href="/signin" 
                  className="w-full text-center py-2 text-purple-600 hover:text-purple-800 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link 
                  href="/login" 
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