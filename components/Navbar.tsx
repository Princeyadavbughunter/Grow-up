// @ts-nocheck
'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { FiSearch, FiUser } from 'react-icons/fi';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LuPlus } from 'react-icons/lu';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import SearchComponent from './SearchComponent';

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { profileData } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
          <Link href='/profile' >
            {profileData?.profile_picture ? (
              <Image
                src={profileData.profile_picture}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full md:w-10 md:h-10 w-8 h-8"
              />
            ) : (
              <div className="rounded-full bg-gray-200 flex items-center justify-center md:w-10 md:h-10 w-8 h-8">
                <FiUser className="text-gray-600 md:w-5 md:h-5 w-4 h-4" />
              </div>
            )}
          </Link>
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