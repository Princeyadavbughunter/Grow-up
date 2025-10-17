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
    setSelectedClubId?: (id: string) => void; // Make optional since we'll use router navigation
}

const ClubsList = ({ selectedClubId, setSelectedClubId }: ClubsListProps) => {
    const [activeTab, setActiveTab] = useState("all");
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
            
            // Separate clubs into my clubs and all clubs based on is_user_member flag
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
    }, [authToken, selectedClubId]);

    useEffect(() => {
        if (authToken) {    
            fetchClubs();
        }
    }, [authToken]);

    const handleJoinToggle = async (clubId: string, isCurrentlyJoined: boolean) => {
        if (!api) return;
        
        try {
            if (isCurrentlyJoined) {
                // Exit club
                await api.get(`/freelancer/exit-club/?id=${clubId}`);
            } else {
                // Join club
                await api.post(`/freelancer/join-club/?id=${clubId}`);
            }
            await fetchClubs();
            if (!isCurrentlyJoined) {
                setActiveTab("my");
                router.push(`/clubs/${clubId}`);
            }
        } catch (error) {
            console.error('Error toggling club membership:', error);
            setError(`Failed to ${isCurrentlyJoined ? 'leave' : 'join'} club. Please try again.`);
        }
    };

    const handleClubSelect = (clubId: string) => {
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
        <div className="p-4 h-[calc(100vh-10rem)] overflow-y-auto">
            <div className="flex flex-wrap items-center gap-4 mb-4 border-b">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`py-2 px-4 transition-colors ${
                        activeTab === "all" 
                            ? "text-purple-600 border-b-2 border-purple-600 font-semibold" 
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    All Clubs ({allClubs.length})
                </button>
                <button
                    onClick={() => setActiveTab("my")}
                    className={`py-2 px-4 transition-colors ${
                        activeTab === "my" 
                            ? "text-purple-600 border-b-2 border-purple-600 font-semibold" 
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    My Clubs ({myClubs.length})
                </button>
            </div>

            {displayClubs.length > 0 ? (
                displayClubs.map((club) => (
                    <ClubCard
                        key={club.id}
                        club={club}
                        isMyClub={club.is_user_member || false}
                        isSelected={club.id === selectedClubId}
                        onJoinToggle={handleJoinToggle}
                        onSelect={handleClubSelect}
                    />
                ))
            ) : (
                <div className="text-center py-8 text-gray-500">
                    {activeTab === "all" 
                        ? "No clubs available to join" 
                        : "You haven't joined any clubs yet"
                    }
                </div>
            )}
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

const ClubCard = ({ club, isMyClub, isSelected, onJoinToggle, onSelect }: ClubCardProps) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const truncatedDescription = club.description?.length > 60
        ? club.description.substring(0, 60) + "..."
        : club.description;

    return (
        <div 
            className={`bg-white rounded-xl p-4 mb-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'border-2 border-purple-500' : 'border border-gray-200'
            }`}
            onClick={() => onSelect(club.id)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 text-xl font-semibold">
                            {club.name?.[0]?.toUpperCase() || '?'}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{club.name}</h3>
                        <p className="text-sm text-gray-500">
                            {club.participants_count || 0} member{(club.participants_count || 0) !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onJoinToggle(club.id, isMyClub);
                    }}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                        isMyClub 
                            ? "bg-green-100 text-green-700 font-medium hover:bg-green-200" 
                            : "text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                    }`}
                >
                    {isMyClub ? "Joined" : "Join"}
                </button>
            </div>

            {club.description && (
                <div className="text-sm text-gray-600 mt-3">
                    <p className={`${showFullDescription ? 'whitespace-normal' : 'truncate'}`}>
                        {showFullDescription ? club.description : truncatedDescription}
                        {club.description.length > 60 && (
                            <button
                                className="text-purple-600 ml-1 hover:text-purple-800 font-medium"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowFullDescription(!showFullDescription);
                                }}
                            >
                                {showFullDescription ? "Read Less" : "Read More"}
                            </button>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ClubsList;