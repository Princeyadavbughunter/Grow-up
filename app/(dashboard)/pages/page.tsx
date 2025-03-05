'use client'
import React, { useState, useEffect } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { IoSendSharp } from 'react-icons/io5';
import { BiSearch } from 'react-icons/bi';
import ProfileView from './_component/profile';
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';

interface Buddy {
  id: string;
  name: string;
  type: string;
  buddyCount: string;
  profile_picture?: string;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  author: {
    first_name: string;
    last_name: string;
    profile_picture: string;
  };
}

const ChatInterface = () => {
  const [searchInput, setSearchInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [recommendedBuddies, setRecommendedBuddies] = useState<Buddy[]>([]);
  const [myBuddies, setMyBuddies] = useState<Buddy[]>([]);
  const [selectedBuddy, setSelectedBuddy] = useState<Buddy | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const { userId, authToken } = useAuth();
  const { api } = useAuthenticatedApi();

  useEffect(() => {
    const fetchFollowedPages = async () => {
      try {
        const response = await api.get('/post/app/pages-follow/');
        setMyBuddies(response.data.pages.map((page: any) => ({
          id: page.id,
          name: page.name,
          type: page.description,
          buddyCount: `${page.followers_count} Buddies`,
          profile_picture: page.profile_picture
        })));
      } catch (error) {
        console.error('Error fetching followed pages:', error);
      }
    };

    if (authToken) {
      fetchFollowedPages();
    }
  }, [authToken]);

  // Send Message
  const sendMessage = async () => {
    if (!selectedBuddy || !messageInput.trim()) return;

    try {
      await api.post('/post/app/page-comments/', {
        post: selectedBuddy.id,
        content: messageInput
      });

      // Refresh messages after sending
      fetchMessages(selectedBuddy.id);
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Fetch Messages for a Page
  const fetchMessages = async (pageId: string) => {
    try {
      const response = await api.get(`/post/app/page-comments/?post_id=${pageId}`);
      setMessages(response.data.response);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Select a Buddy and Load Messages
  const handleBuddySelect = (buddy: Buddy) => {
    setSelectedBuddy(buddy);
    fetchMessages(buddy.id);
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <nav className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-8">
            <h1 className="text-xl font-bold">Recommended Pages</h1>
            <div className="flex gap-8 overflow-x-auto">
              {myBuddies.map((buddy) => (
                <div 
                  key={buddy.id} 
                  className="flex items-center gap-2 border p-6 rounded-xl cursor-pointer"
                  onClick={() => handleBuddySelect(buddy)}
                >
                  <img
                    src={buddy.profile_picture || 'https://randomuser.me/portraits/thumb/men/1.jpg'}
                    alt={buddy.name}
                    className="h-14 w-14 rounded-full"
                  />
                  <div>
                    <span className="text-sm font-medium">{buddy.name}</span>
                    <div className="text-xs text-gray-400 font-medium">{buddy.buddyCount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        <div className="border-r bg-white p-4">
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
            {myBuddies.map((buddy) => (
              <div 
                key={buddy.id} 
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleBuddySelect(buddy)}
              >
                <img
                  src={buddy.profile_picture || 'https://randomuser.me/portraits/thumb/women/1.jpg'}
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
            {selectedBuddy && (
              <div className="flex items-center justify-between border-b bg-white p-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedBuddy.profile_picture || <HiOutlineUserCircle className="h-8 w-8" />} 
                    alt={selectedBuddy.name} 
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <h2 className="font-semibold">{selectedBuddy.name}</h2>
                    <p className="text-sm text-gray-500">{selectedBuddy.buddyCount}</p>
                  </div>
                </div>
                <button
                  className="rounded-lg bg-gray-100 px-4 py-2"
                  onClick={() => setShowProfile(true)}
                >
                  View profile
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div key={message.id} className="mb-4 flex items-start gap-3">
                  <img 
                    src={message.author.profile_picture || <HiOutlineUserCircle className="h-8 w-8" />} 
                    alt={`${message.author.first_name} ${message.author.last_name}`} 
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{`${message.author.first_name} ${message.author.last_name}`}</div>
                    <div className="bg-gray-100 p-2 rounded-lg">{message.content}</div>
                    <div className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>

            {selectedBuddy && (
              <div className="border-t bg-white p-4">
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 resize-none bg-transparent outline-none"
                    rows={1}
                  />
                  <button 
                    className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                    onClick={sendMessage}
                  >
                    <IoSendSharp className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;