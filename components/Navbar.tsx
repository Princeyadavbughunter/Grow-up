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

  const handleCreateClick = () => {
    if (buttonInfo) {
      router.push(buttonInfo.route);
    }
  };

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
      <div className="flex items-center justify-between md:p-4 p-2 border-b">
        <div onClick={() => router.push('/')} className="flex items-center gap-2 cursor-pointer">
          <Image src="/logo.svg" alt="GrowUp Buddy" width={40} height={40} className="md:w-10 md:h-10 w-8 h-8" />
          <span className=" md:text-xl text-lg font-semibold">GrowUp Buddy</span>
        </div>
        <div className="flex items-center md:gap-4 gap-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-gray-100"
          >
            <FiSearch className="w-5 h-5 text-gray-600" />
          </Button>

          {buttonInfo && (
            <Button
              onClick={handleCreateClick}
              className="border bg-white hover:bg-[#7052FF] hover:text-white border-[#7052FF] text-[#7052FF] md:px-4 md:py-1 px-2 py-1 text-sm md:text-base"
            >
              <LuPlus className="md:mr-2 mr-1" />
              <span className="hidden md:inline">{buttonInfo.label}</span>
              <span className="md:hidden">Create</span>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
                {profileData?.profile_picture ? (
                  <Image
                    src={profileData.profile_picture}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full md:w-10 md:h-10 w-8 h-8 cursor-pointer aspect-square object-cover"
                  />
                ) : (
                  <div className="rounded-full bg-gray-200 flex items-center justify-center md:w-10 md:h-10 w-8 h-8 cursor-pointer aspect-square">
                    <FiUser className="text-gray-600 md:w-5 md:h-5 w-4 h-4" />
                  </div>
                )}
              </Button>
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

      {/* Search Component */}
      <SearchComponent
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default NavBar;