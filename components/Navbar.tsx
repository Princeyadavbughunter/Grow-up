// @ts-nocheck
'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { FiSearch, FiUser } from 'react-icons/fi';
import { FaSignOutAlt } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LuPlus } from 'react-icons/lu';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import SearchComponent from './SearchComponent';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { profileData, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const buttonConfig: Record<string, { label: string; route: string }> = {
    '/pages': { label: 'Create Pages', route: '/pages/create-page' },
    '/gigs': { label: 'Post Gigs', route: '/gigs/post-gig' },
  };

  const buttonInfo = buttonConfig[pathname];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative">
      {/* No border-b — clean Figma style */}
      <div className="flex items-center justify-between px-28 py-5 bg-white">
        {/* Logo */}
        <div onClick={() => router.push('/')} className="flex items-center gap-3 cursor-pointer select-none">
          <Image src="/logo.svg" alt="GrowUp Buddy" width={48} height={48} className="w-12 h-12" />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">GrowUp Buddy</span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {buttonInfo && (
            <Button
              onClick={() => router.push(buttonInfo.route)}
              className="rounded-full border bg-white hover:bg-[#7052FF] hover:text-white border-[#7052FF] text-[#7052FF] px-6 py-2 text-sm font-semibold transition-all shadow-sm"
            >
              <LuPlus className="mr-2" />
              {buttonInfo.label}
            </Button>
          )}

          {/* Search — round gray button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <FiSearch className="w-5 h-5 text-gray-600" />
          </button>

          {/* Profile Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-200 hover:ring-[#7052FF] transition-all flex-shrink-0 focus:outline-none">
                {profileData?.profile_picture ? (
                  <Image
                    src={profileData.profile_picture}
                    alt="Profile"
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <FiUser className="text-gray-600 w-5 h-5" />
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                  <FiUser className="w-4 h-4" />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 cursor-pointer text-[#7052FF] focus:text-[#5a42d4] hover:text-[#5a42d4]"
              >
                <FaSignOutAlt className="w-4 h-4" />
                {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <SearchComponent
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default NavBar;