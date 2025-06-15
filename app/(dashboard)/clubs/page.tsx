// @ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import ClubsList from './_components/Clubs-list';
import Link from 'next/link';
import { NetworkSection } from './_components/club-network';
import Posts from './_components/club-posts';
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
  const [selectedClubId, setSelectedClubId] = useState("");
  const [selectedClub, setSelectedClub] = useState(null);
  const [allClubs, setAllClubs] = useState([]);
  const [showClubSelector, setShowClubSelector] = useState(false);
  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();

  // Fetch all clubs
  useEffect(() => {
    const fetchClubs = async () => {
      if (!authToken || !api) return;
      
      try {
        const response = await api.get('/freelancer/club/');
        setAllClubs(response.data || []);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };

    if(authToken){  
      fetchClubs();
    }
  }, [authToken]);

  // Fetch selected club details when selectedClubId changes
  useEffect(() => {
    const fetchSelectedClub = async () => {
      if (!selectedClubId || !authToken || !api) {
        setSelectedClub(null);
        return;
      }
      
      try {
        const response = await api.get('/freelancer/club/');
        const clubs = response.data || [];
        const club = clubs.find((c: Club) => c.id === selectedClubId);
        setSelectedClub(club || null);
      } catch (error) {
        console.error('Error fetching selected club:', error);
        setSelectedClub(null);
      }
    };

    if (authToken) {
      fetchSelectedClub();
    }

  }, [selectedClubId, authToken]);

  const handleClubChange = (clubId) => {
    setSelectedClubId(clubId);
    setShowClubSelector(false);
  };

  const toggleClubSelector = () => {
    setShowClubSelector(!showClubSelector);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <div className={`w-full lg:w-1/4 bg-[#F9FAFF] p-4 md:p-6 overflow-y-auto ${selectedClubId ? 'hidden lg:block' : 'block'}`}>
        <ClubsList selectedClubId={selectedClubId} setSelectedClubId={setSelectedClubId} />
      </div>

      <div className={`flex-1 flex flex-col ${!selectedClubId ? 'hidden lg:flex' : 'flex'}`}>
        <div className="bg-white border-b relative">
          <div className="flex items-center justify-between border mx-4 p-4 rounded-xl mt-5 mb-5">
            <div className="flex items-center gap-3 flex-1">
              <div 
                className="flex items-center gap-3 flex-1 lg:cursor-default cursor-pointer"
                onClick={toggleClubSelector}
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-xl">
                    {selectedClub?.name?.[0]?.toUpperCase() || 'T'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold line-clamp-1">{selectedClub?.name || 'Select a club'}</h3>
                    <svg className="w-4 h-4 lg:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">{selectedClub?.participants_count || 0} members</p>
                </div>
              </div>
            </div>
            <Link className="text-purple-600 text-sm font-medium flex-shrink-0" href="/create-post">Create Post</Link>
          </div>
          
          {showClubSelector && (
            <div className="lg:hidden absolute top-full left-4 right-4 bg-white border shadow-lg z-50 max-h-64 overflow-y-auto rounded-lg">
              {allClubs && allClubs.length > 0 ? (
                allClubs.map((club) => (
                  <button
                    key={club.id}
                    onClick={() => handleClubChange(club.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 border-b flex items-center gap-3 ${
                      club.id === selectedClubId ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 text-sm font-semibold">
                        {club.name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{club.name}</h4>
                      <p className="text-sm text-gray-500">{club.participants_count || 0} members</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Loading clubs...
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex-1 ">
          {selectedClubId && <Posts clubId={selectedClubId} />}
        </div>
      </div>

      <div className="hidden lg:block w-1/4 bg-[#F9FAFF] p-4 md:p-6 overflow-y-auto">
        <NetworkSection title="Members" clubId={selectedClubId || ""} />
      </div>
    </div>
  );
};

export default Page;
