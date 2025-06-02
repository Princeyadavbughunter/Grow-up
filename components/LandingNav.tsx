import React from 'react'
import Link from 'next/link'
import Image from 'next/image'


const LandingNav = () => {
  return (
    <nav className="flex items-center justify-between p-4 px-[88px] bg-white">
    <div className="flex items-center space-x-2">
      {/* Logo */}
      <div className="flex items-center space-x-1">
        <div className="">
          <Image src='/logo_grow_up_buddy.png' alt='img' width={100} height={100}/>
        </div>
        <span className="text-xl font-bold text-gray-900">GrowUp Buddy</span>
      </div>
    </div>

    {/* Navbar Links */}
    <div className="hidden md:flex items-center space-x-6">
      <Link href="/">
        <span className="text-gray-700 hover:text-purple-600 cursor-pointer">Hire talent</span>
      </Link>
      <Link href="/">
        <span className="text-gray-700 hover:text-purple-600 cursor-pointer">Events</span>
      </Link>
      <Link href="/">
        <span className="text-gray-700 hover:text-purple-600 cursor-pointer">Gigs</span>
      </Link>
      <Link href="/">
        <span className="text-gray-700 hover:text-purple-600 cursor-pointer">Community</span>
      </Link>
    </div>

    {/* Auth Buttons */}
    <div className="flex items-center space-x-4">
      <Link href="/signin">
        <span className="text-purple-600 hover:text-purple-800 cursor-pointer">Sign in</span>
      </Link>
      <Link href="/login">
        <div className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 cursor-pointer">
          Login
        </div>
      </Link>
    </div>
  </nav>
  )
}

export default LandingNav
