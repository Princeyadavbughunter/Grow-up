'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { FiSearch } from 'react-icons/fi';

interface Story {
  type: 'image';
  url: string;
  duration: number;
}

interface User {
  id: number;
  name: string;
  img: string;
  stories: Story[];
  hasUnseenStories: boolean;
}

const StoryViewer: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);

  const users: User[] = [1, 2, 3, 4].map((id) => ({
    id,
    name: `User ${id}`,
    img: `https://randomuser.me/api/portraits/men/${id}.jpg`,
    stories: [
      { type: 'image', url: `/api/placeholder/${400}/${600}`, duration: 5000 },
      { type: 'image', url: `/api/placeholder/${400}/${600}`, duration: 5000 }
    ],
    hasUnseenStories: Math.random() > 0.5
  }));

  const handleStoryClick = (user: User): void => {
    setSelectedUser(user);
    setActiveStoryIndex(0);
  };

  const closeModal = (): void => {
    setSelectedUser(null);
    setActiveStoryIndex(0);
  };

  const handleNext = (): void => {
    if (selectedUser && activeStoryIndex < selectedUser.stories.length - 1) {
      setActiveStoryIndex(prev => prev + 1);
    } else {
      closeModal();
    }
  };

  const handlePrev = (): void => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prev => prev - 1);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="GrowUp Buddy" width={40} height={40} />
          <span className="text-xl font-semibold">GrowUp Buddy</span>
        </div>
        <div className="flex gap-2">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleStoryClick(user)}
              className="relative"
              type="button"
            >
              <div className={`p-0.5 rounded-full ${user.hasUnseenStories ? 'bg-gradient-to-tr from-purple-500 to-pink-500' : 'bg-gray-200'}`}>
                <Image
                  src={user.img}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                />
              </div>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600"><FiSearch size={30} /></span>
          <Image
            src="https://randomuser.me/api/portraits/men/5.jpg"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-lg">
            <div className="absolute top-4 left-4 right-4 flex gap-1">
              {selectedUser.stories.map((_, index) => (
                <div
                  key={index}
                  className="h-1 flex-1 bg-gray-600 overflow-hidden"
                >
                  <div
                    className={`h-full bg-white transition-all duration-[5000ms] ease-linear ${index === activeStoryIndex ? 'w-full' : index < activeStoryIndex ? 'w-full' : 'w-0'
                      }`}
                  />
                </div>
              ))}
            </div>

            <div className="relative aspect-[9/16] bg-gray-900">
              <Image
                src={selectedUser.stories[activeStoryIndex].url}
                alt="Story"
                layout="fill"
                objectFit="contain"
              />

              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white"
                disabled={activeStoryIndex === 0}
                type="button"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white"
                type="button"
              >
                →
              </button>

              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white text-xl"
                type="button"
              >
                ×
              </button>

              <div className="absolute top-8 left-4 flex items-center gap-2">
                <Image
                  src={selectedUser.img}
                  alt={selectedUser.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-white font-semibold">{selectedUser.name}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryViewer;