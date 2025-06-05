"use client";
import React, { useEffect, useState } from 'react';
import ClubsList from './_components/Clubs-list';
import Link from 'next/link';
import { NetworkSection } from './_components/club-network';
import Posts from './_components/club-posts';

const Page = () => {
  const [selectedClubId, setSelectedClubId] = useState("");

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      <div className="w-full lg:w-1/4 bg-[#F9FAFF] p-4 md:p-6 overflow-y-auto rounded-lg">
        <ClubsList selectedClubId={selectedClubId} setSelectedClubId={setSelectedClubId} />
      </div>

      <div className="flex-1 p-4 overflow-y-auto scrollbar-[1px] rounded-lg">
        <div className="sticky top-0 z-10 bg-white pb-4">
          <div className="flex items-center justify-between border mx-4 p-4 rounded-xl mt-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">T</span>
              </div>
              <div>
                <h3 className="font-semibold line-clamp-1">Tech Minds</h3>
                <p className="text-sm text-gray-500">9899 members</p>
              </div>
            </div>
            <Link className="text-purple-600 text-sm font-medium" href="/create-post">Create Post</Link>
          </div>
        </div>
        <Posts clubId={selectedClubId} />
      </div>

      <div className="w-full lg:w-1/4 bg-[#F9FAFF] p-4 md:p-6 overflow-y-auto rounded-lg">
        <NetworkSection title="Members" clubId={selectedClubId} />
      </div>
    </div>
  );
};

export default Page;
