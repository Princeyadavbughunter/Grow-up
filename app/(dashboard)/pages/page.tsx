'use client'
import React, { useState } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { IoSendSharp } from 'react-icons/io5';
import { BiSearch } from 'react-icons/bi';
import ProfileView from './_component/profile';

interface Buddy {
  name: string;
  type: string;
  buddyCount: string;
}

const ChatInterface = () => {
  const [searchInput, setSearchInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  const recommendedBuddies = [
    { name: 'The Design Buddy', type: 'Startup', buddyCount: '9.56k Buddy' },
    { name: 'The Founder Buddy', type: 'Influencer', buddyCount: '9.56k Buddy' },
    { name: 'Under 25 Dictionary', type: 'Influencer', buddyCount: '9.56k Buddy' },
    { name: 'The Design Buddy', type: 'Startup', buddyCount: '9.56k Buddy' },
    { name: 'The Founder Buddy', type: 'Influencer', buddyCount: '9.56k Buddy' },
    { name: 'Under 25 Dictionary', type: 'Influencer', buddyCount: '9.56k Buddy' },
    ,
  ];

  const myBuddies = [
    { name: 'White Room', type: 'Startup', buddyCount: '9.56k Buddy' },
    { name: 'Growup', type: 'Influencer', buddyCount: '9.56k Buddy' },
  ];

  return (
    <div className="flex h-full flex-col justify-between">
      <nav className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-8">
            <h1 className="text-xl font-bold">Recommended</h1>
            <div className="flex gap-8">
              {recommendedBuddies.map((buddy, index) => (
                <div key={index} className="flex items-center gap-2 border p-6 rounded-xl ">
                  <img
                    src={`https://randomuser.me/portraits/thumb/men/${index}.jpg`}
                    alt={buddy?.name}
                    className="h-14 w-14 rounded-full"
                  />
                  <div className="div">
                    <span className="text-sm font-medium">{buddy?.name}</span>
                    <div className="text-xs text-gray-400 font-medium">{buddy?.buddyCount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 ">
        <div className=" border-r bg-white p-4">
          <div className="mb-4">
            <div className="relative">
              <BiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search buddies..."
                className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4"
              />
            </div>
          </div>

          <div className="space-y-3 w-[300px]">
            <h2 className="mb-4 text-lg font-semibold">My Buddies</h2>
            {myBuddies.map((buddy, index) => (
              <div key={index} className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50">
                <img
                  src={`https://randomuser.me/portraits/thumb/women/${index}.jpg`}
                  alt={buddy.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{buddy.name}</h3>
                  <p className="text-sm text-gray-500">{buddy.buddyCount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showProfile ? (
          <ProfileView onBack={() => setShowProfile(false)} />
        ) : (
          <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-between border-b bg-white p-4">
              <div className="flex items-center gap-3">
                <HiOutlineUserCircle className="h-8 w-8" />
                <div>
                  <h2 className="font-semibold">White Room</h2>
                  <p className="text-sm text-gray-500">Broadcast channel - 2.4k Buddies</p>
                </div>
              </div>
              <button
                className="rounded-lg bg-gray-100 px-4 py-2"
                onClick={() => setShowProfile(true)}
              >
                View profile
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Messages will go here */}
            </div>

            <div className="border-t bg-white p-4">
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 resize-none bg-transparent outline-none"
                  rows={1}
                />
                <button className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600">
                  <IoSendSharp className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;