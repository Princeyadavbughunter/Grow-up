// @ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ClubsList from '../_components/Clubs-list';
import Link from 'next/link';
import { NetworkSection } from '../_components/club-network';
import { SearchIcon } from 'lucide-react';
import Posts from '../_components/club-posts';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

interface Club {
  id: string;
  name: string;
  description: string;
  created_at: string;
  created_by: string;
  participants_count?: number;
  chat_room_id?: string;
  is_user_member?: boolean;
  members?: string[];
}

const Page = () => {
  const params = useParams();
  const clubId = params?.id as string;
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'members' | 'clubs'>('posts');
  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();

  // Fetch selected club details when clubId changes
  useEffect(() => {
    const fetchSelectedClub = async () => {
      if (!clubId || !authToken || !api) {
        setSelectedClub(null);
        return;
      }
      
      try {
        const response = await api.get('/freelancer/club/');
        const clubs = response.data || [];
        const club = clubs.find((c: Club) => c.id === clubId);
        setSelectedClub(club || null);
      } catch (error) {
        console.error('Error fetching selected club:', error);
        setSelectedClub(null);
      }
    };

    if (authToken) {
      fetchSelectedClub();
    }
  }, [clubId, authToken]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Desktop: Left sidebar with clubs list */}
      <div className="hidden lg:block w-96 bg-[#F9FAFF] p-6 overflow-y-auto h-screen">
        <ClubsList selectedClubId={clubId} setSelectedClubId={() => {}} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Posts section */}
        <div className="flex-1 lg:flex-[2]">
          {/* Club header - always visible */}
          <div className="sticky top-0 z-10 bg-white border-b">
            <div className="flex items-center justify-between border mx-4 p-4 rounded-xl mt-5 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xl">
                    {selectedClub?.name?.[0]?.toUpperCase() || 'C'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{selectedClub?.name || 'Loading...'}</h3>
                  <p className="text-sm text-gray-500">{selectedClub?.participants_count || 0} members</p>
                </div>
              </div>
              <Link className="text-purple-600 text-sm font-medium" href={`/create-post/${clubId}`}>Create Post</Link>
            </div>

            {/* Mobile tabs */}
            <div className="lg:hidden flex border-b mx-4">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
                  activeTab === 'posts'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
                  activeTab === 'members'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Members
              </button>
              <button
                onClick={() => setActiveTab('clubs')}
                className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
                  activeTab === 'clubs'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Clubs
              </button>
            </div>
          </div>

          {/* Mobile: Conditional content based on active tab */}
          <div className="lg:hidden">
            {activeTab === 'posts' && (
              <div className="p-4">
                <Posts clubId={clubId} />
              </div>
            )}
            {activeTab === 'members' && (
              <div className="p-4">
                <NetworkSection title="Members" clubId={clubId} />
              </div>
            )}
            {activeTab === 'clubs' && (
              <div className="bg-[#F9FAFF] min-h-screen">
                <ClubsList selectedClubId={clubId} setSelectedClubId={() => {}} />
              </div>
            )}
          </div>

          {/* Desktop: Always show posts */}
          <div className="hidden lg:block p-4 h-full">
            <Posts clubId={clubId} />
          </div>
        </div>

        {/* Desktop: Right sidebar with members */}
        <div className="hidden lg:block lg:flex-1 lg:min-w-[320px] bg-[#F9FAFF] p-6 overflow-y-auto h-screen">
          <NetworkSection title="Members" clubId={clubId} />
        </div>
      </div>
    </div>
  );
};

export default Page;
