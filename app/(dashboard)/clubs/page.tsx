"use client";
import React, { useState } from 'react';
import ClubsList from './_components/Clubs-list';
import Posts from '../_components/Posts';
import { NetworkCard } from '../network/_components/NetworkCard';
import Link from 'next/link';
import { NetworkSection } from '../network/_components/NetworkSection';
import { SearchIcon } from 'lucide-react';

const page = () => {
  const [isJoined, setIsJoined] = useState(false);

  const handleClick = () => {
    setIsJoined(!isJoined); // Toggle the state
  };

  const myNetwork = [
    {
      name: "Aryan Trivedi",
      title: "Founder - Finzie | Ex Groww | BITS Pilani",
      location: "Bengaluru",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
      isOnline: true,
    },
    {
      name: "Aryan Trivedi",
      title: "Founder - Finzie | Ex Groww | BITS Pilani",
      location: "Bengaluru",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
      isOnline: true,
    },
    {
      name: "Aryan Trivedi",
      title: "Founder - Finzie | Ex Groww | BITS Pilani",
      location: "Bengaluru",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
      isOnline: true,
    },
    {
      name: "Aryan Trivedi",
      title: "Founder - Finzie | Ex Groww | BITS Pilani",
      location: "Bengaluru",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
      isOnline: true,
    },
    {
      name: "Aryan Trivedi",
      title: "Founder - Finzie | Ex Groww | BITS Pilani",
      location: "Bengaluru",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
      isOnline: true,
    },
    {
      name: "Aryan Trivedi",
      title: "Founder - Finzie | Ex Groww | BITS Pilani",
      location: "Bengaluru",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
      isOnline: true,
    },
    {
      name: "Aryan Trivedi",
      title: "Founder - Finzie | Ex Groww | BITS Pilani",
      location: "Bengaluru",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
      isOnline: true,
    },
    {
      name: "Aryan Trivedi",
      title: "Founder - Finzie | Ex Groww | BITS Pilani",
      location: "Bengaluru",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
      isOnline: true,
    },
    {
      name: "Aryan Trivedi",
      title: "Founder - Finzie | Ex Groww | BITS Pilani",
      location: "Bengaluru",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
      isOnline: true,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Sidebar (Clubs List) */}
      <div className="w-full bg-[#F9FAFF] p-4 md:p-6  fixed md:relative overflow-y-auto top-0 h-[580px]">
        <ClubsList />
      </div>

      {/* Main Content */}
      <div className="w-full p-4 overflow-y-auto scrollbar-[1px] h-[580px]">
        {/* Sticky section */}
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
        <Posts />
      </div>

      {/* Right Sidebar (Network Section) */}
      <div className="w-full bg-[#F9FAFF] p-4 md:p-6  fixed md:relative overflow-y-auto top-0 h-[580px]">
        <div className="border rounded-full flex items-center gap-2 p-2">
          <SearchIcon color='gray' size={18} />
          <input placeholder='search members' className='outline-none border-none' />
        </div>
        <NetworkSection title="Members">
          {myNetwork.map((connection, index) => (
            <NetworkCard key={index} {...connection} />
          ))}
        </NetworkSection>
      </div>
    </div>
  );
};

export default page;
