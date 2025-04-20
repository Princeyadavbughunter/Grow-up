"use client";
import React, { useState } from 'react';
import ClubsList from './_components/Clubs-list';
import Link from 'next/link';
import { NetworkSection } from './_components/club-network';
import { SearchIcon } from 'lucide-react';
import Posts from './_components/club-posts';

const page = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState("");

  const handleClick = () => {
    setIsJoined(!isJoined);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full bg-[#F9FAFF] p-4 md:p-6 fixed md:relative overflow-y-auto top-0 h-[580px]">
        <ClubsList selectedClubId={selectedClubId} setSelectedClubId={setSelectedClubId} />
      </div>

      <div className="w-full p-4 overflow-y-auto scrollbar-[1px] h-[580px]">
        <div className="sticky top-0 z-10 bg-white">
          <div className="flex items-center justify-between border mx-4 p-4 rounded-xl mt-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">T</span>
              </div>
              <div>
                <h3 className="font-semibold">Tech Minds</h3>
                <p className="text-sm text-gray-500">9899 members</p>
              </div>
            </div>
            <Link className="text-purple-600 text-sm font-medium" href="/create-post">Create Post</Link>
          </div>
        </div>
        <Posts clubId={selectedClubId} />
      </div>

      <div className="w-full bg-[#F9FAFF] p-4 md:p-6 fixed md:relative overflow-y-auto top-0 h-[580px]">
        <div className="border rounded-full flex items-center gap-2 p-2">
          <SearchIcon color='gray' size={18} />
          <input placeholder='search members' className='outline-none border-none' />
        </div>
        <NetworkSection title="Members" clubId={selectedClubId} />
      </div>
    </div>
  );
};

export default page;