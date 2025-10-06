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
  const [activeTab, setActiveTab] = useState("posts"); // Add tab state for mobile
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
    setActiveTab("posts"); // Reset to posts tab when club changes
  };

  const toggleClubSelector = () => {
    setShowClubSelector(!showClubSelector);
  };

  const handleBackToClubs = () => {
    setSelectedClubId("");
    setSelectedClub(null);
    setActiveTab("posts");
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gray-50">
      {/* Mobile Back Button */}
      {selectedClubId && (
        <div className="lg:hidden bg-white border-b px-4 py-3">
          <button
            onClick={handleBackToClubs}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Clubs</span>
          </button>
        </div>
      )}

      {/* Left Sidebar - Clubs List */}
      <div className={`w-full lg:w-1/4 bg-[#F9FAFF] ${selectedClubId ? 'hidden' : 'block'} overflow-y-auto`}>
        <div className="p-3 sm:p-4 md:p-6">
          <ClubsList selectedClubId={selectedClubId} setSelectedClubId={setSelectedClubId} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${!selectedClubId ? 'hidden lg:flex' : 'flex'} bg-white`}>
        {/* Header */}
        <div className="bg-white border-b shadow-sm relative">
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-3 sm:p-4 rounded-xl">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div 
                  className="flex items-center gap-3 flex-1 min-w-0 lg:cursor-default cursor-pointer"
                  onClick={toggleClubSelector}
                >
                  {/* Club Avatar */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-lg sm:text-xl font-semibold">
                      {selectedClub?.name?.[0]?.toUpperCase() || 'C'}
                    </span>
                  </div>
                  
                  {/* Club Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {selectedClub?.name || 'Select a club'}
                      </h3>
                      <svg className="w-4 h-4 lg:hidden text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {selectedClub?.participants_count || 0} members
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Create Post Button */}
              <Link 
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ml-3" 
                href="/create-post"
              >
                <span className="hidden sm:inline">Create Post</span>
                <span className="sm:hidden">Post</span>
              </Link>
            </div>
          </div>
          
          {/* Mobile Club Selector Dropdown */}
          {showClubSelector && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg z-50 max-h-80 overflow-y-auto">
              {allClubs && allClubs.length > 0 ? (
                <div className="p-2">
                  {allClubs.map((club) => (
                    <button
                      key={club.id}
                      onClick={() => handleClubChange(club.id)}
                      className={`w-full p-3 text-left hover:bg-gray-50 rounded-lg mb-1 flex items-center gap-3 transition-colors ${
                        club.id === selectedClubId ? 'bg-purple-50 border border-purple-200' : 'border border-transparent'
                      }`}
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 text-sm font-semibold">
                          {club.name?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate text-sm">{club.name}</h4>
                        <p className="text-xs text-gray-500">{club.participants_count || 0} members</p>
                      </div>
                      {club.id === selectedClubId && (
                        <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-sm">Loading clubs...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Tabs */}
        {selectedClubId && (
          <div className="lg:hidden bg-white border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === "posts"
                    ? "text-purple-600 bg-purple-50"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  Posts
                </div>
                {activeTab === "posts" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === "members"
                    ? "text-purple-600 bg-purple-50"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Members
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full ml-1">
                    {selectedClub?.participants_count || 0}
                  </span>
                </div>
                {activeTab === "members" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {selectedClubId ? (
            <div className="h-full">
              {/* Desktop: Show posts always, Mobile: Show based on active tab */}
              <div className={`h-full ${activeTab === "posts" ? "block" : "hidden lg:block"}`}>
                <Posts clubId={selectedClubId} />
              </div>
              
              {/* Mobile Members Tab Content */}
              <div className={`lg:hidden h-full ${activeTab === "members" ? "block" : "hidden"}`}>
                <div className="p-4">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Club Members</h2>
                    <p className="text-sm text-gray-500">
                      {selectedClub?.participants_count || 0} members in this club
                    </p>
                  </div>
                  <div className="space-y-2">
                    <NetworkSection title="" clubId={selectedClubId} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Club</h3>
                <p className="text-gray-500 text-sm max-w-sm">
                  Choose a club from the sidebar to view posts and connect with members.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Network Section (Desktop Only) */}
      <div className="hidden lg:block w-1/4 bg-[#F9FAFF] overflow-y-auto">
        <div className="p-4 md:p-6">
          <NetworkSection title="Members" clubId={selectedClubId || ""} />
        </div>
      </div>

      {/* Overlay for mobile dropdown */}
      {showClubSelector && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setShowClubSelector(false)}
        />
      )}
    </div>
  );
};

export default Page;
