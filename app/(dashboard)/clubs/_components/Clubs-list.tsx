// @ts-nocheck
"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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

interface ClubsListProps {
    selectedClubId: string;
    setSelectedClubId?: (id: string) => void;
}

const ClubsList = ({ selectedClubId, setSelectedClubId }: ClubsListProps) => {
    // Initialize activeTab from localStorage to persist across renders
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('clubsActiveTab') || 'all';
        }
        return 'all';
    });
    
    const [allClubs, setAllClubs] = useState<Club[]>([]);
    const [myClubs, setMyClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { api } = useAuthenticatedApi();
    const { authToken } = useAuth();
    const router = useRouter();

    const fetchClubs = useCallback(async () => {
        if (!authToken || !api) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await api.get('/freelancer/club/');
            console.log(response.data);
            
            const allClubsData = response.data || [];
            const myClubsData = allClubsData.filter((club: Club) => club.is_user_member);

            setAllClubs(allClubsData);
            setMyClubs(myClubsData);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            setError('Failed to load clubs. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [authToken, api]);

    useEffect(() => {
        if (authToken) {    
            fetchClubs();
        }
    }, [authToken]); // Removed fetchClubs from dependencies

    // Handler to change tab and persist to localStorage
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        if (typeof window !== 'undefined') {
            localStorage.setItem('clubsActiveTab', tab);
        }
    };

    const handleJoinToggle = async (clubId: string, isCurrentlyJoined: boolean) => {
        if (!api) return;
        
        try {
            if (isCurrentlyJoined) {
                await api.get(`/freelancer/exit-club/?id=${clubId}`);
            } else {
                await api.post(`/freelancer/join-club/?id=${clubId}`);
            }
            await fetchClubs();
            
            // Only switch to "my" tab and navigate when joining a new club
            if (!isCurrentlyJoined) {
                handleTabChange("my");
                router.push(`/clubs/${clubId}`);
            }
        } catch (error) {
            console.error('Error toggling club membership:', error);
            setError(`Failed to ${isCurrentlyJoined ? 'leave' : 'join'} club. Please try again.`);
        }
    };

    const handleClubSelect = (clubId: string) => {
        // Just navigate, don't change the active tab
        router.push(`/clubs/${clubId}`);
    };

    const displayClubs = activeTab === "all" ? allClubs : myClubs;

    if (loading) {
        return (
            <div className="p-4">
                <div className="text-center py-8 text-gray-500">
                    Loading clubs...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="text-center py-8 text-red-500">
                    {error}
                    <button 
                        onClick={fetchClubs}
                        className="block mx-auto mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(96vh-10rem)] flex flex-col">
            {/* Tabs Container - Fixed at top */}
            <div className="px-4 pt-4 pb-2 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center gap-4 md:gap-6">
                    <button
                        onClick={() => handleTabChange("all")}
                        className={`py-2 px-3 md:px-4 text-sm md:text-base font-medium transition-all rounded-t-lg whitespace-nowrap flex-shrink-0 ${
                            activeTab === "all" 
                                ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50/50" 
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                    >
                        All Clubs ({allClubs.length})
                    </button>
                    <button
                        onClick={() => handleTabChange("my")}
                        className={`py-2 px-3 md:px-4 text-sm md:text-base font-medium transition-all rounded-t-lg whitespace-nowrap flex-shrink-0 ${
                            activeTab === "my" 
                                ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50/50" 
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                    >
                        My Clubs ({myClubs.length})
                    </button>
                </div>
            </div>

            {/* Clubs List - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {displayClubs.length > 0 ? (
                    <div className="space-y-3">
                        {displayClubs.map((club) => (
                            <ClubCard
                                key={club.id}
                                club={club}
                                isMyClub={club.is_user_member || false}
                                isSelected={club.id === selectedClubId}
                                onJoinToggle={handleJoinToggle}
                                onSelect={handleClubSelect}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-sm text-gray-500">
                        {activeTab === "all" 
                            ? "No clubs available to join" 
                            : "You haven't joined any clubs yet"
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

interface ClubCardProps {
    club: Club;
    isMyClub: boolean;
    isSelected: boolean;
    onJoinToggle: (clubId: string, isCurrentlyJoined: boolean) => void;
    onSelect: (clubId: string) => void;
}

const ClubCard = ({
    club,
    isMyClub,
    isSelected,
    onJoinToggle,
    onSelect,
  }: ClubCardProps) => {
    return (
      <div
        onClick={() => onSelect(club.id)}
        className={`bg-white border rounded-2xl px-4 py-4 transition cursor-pointer
          ${isSelected ? "border-purple-500" : "border-gray-200 hover:border-gray-300"}
        `}
      >
        {/* Top Row */}
        <div className="flex items-start justify-between gap-4">
          {/* Left */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 font-semibold text-lg">
                {club.name?.[0]?.toUpperCase() || "C"}
              </span>
            </div>
  
            <div>
              <h3 className="font-semibold text-gray-900 leading-tight">
                {club.name}
              </h3>
              <p className="text-sm text-gray-500">
                {club.participants_count || 0} members
              </p>
            </div>
          </div>
  
          {/* Join Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onJoinToggle(club.id, isMyClub);
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition
              ${
                isMyClub
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-purple-50 text-purple-600 hover:bg-purple-100"
              }
            `}
          >
            {isMyClub ? "Joined" : "Join"}
          </button>
        </div>
  
        {/* Description */}
        {club.description && (
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            {club.description.length > 90
              ? club.description.slice(0, 90)
              : club.description}
            {club.description.length > 90 && (
              <span className="text-purple-600 ml-1 font-medium">
                Read More...
              </span>
            )}
          </p>
        )}
      </div>
    );
  };

export default ClubsList;