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
    <div className="flex flex-col md:flex-row">
      <div className="w-full bg-[#F9FAFF] p-4 md:p-6 fixed md:relative overflow-y-auto top-0 h-[580px]">
        <ClubsList selectedClubId={clubId} setSelectedClubId={() => {}} />
      </div>

      <div className="w-full p-4 overflow-y-auto scrollbar-[1px] h-[580px]">
        <div className="sticky top-0 z-10 bg-white">
          <div className="flex items-center justify-between border mx-4 p-4 rounded-xl mt-5">
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
        </div>
        <Posts clubId={clubId} />
      </div>

      <div className="w-full bg-[#F9FAFF] p-4 md:p-6 fixed md:relative overflow-y-auto top-0 h-[580px]">
        <NetworkSection title="Members" clubId={clubId} />
      </div>
    </div>
  );
};

export default Page;
