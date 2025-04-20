"use client";
import { useEffect, useState } from "react";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

interface Club {
    id: string;
    name: string;
    description: string;
    created_at: string;
    created_by: string;
    participants_count?: number;
    members?: string[];
}

interface ClubsListProps {
    selectedClubId: string;
    setSelectedClubId: (id: string) => void;
}

const ClubsList = ({ selectedClubId, setSelectedClubId }: ClubsListProps) => {
    const [activeTab, setActiveTab] = useState("all");
    const [allClubs, setAllClubs] = useState<Club[]>([]);
    const [myClubs, setMyClubs] = useState<Club[]>([]);
    const { api } = useAuthenticatedApi();
    const { authToken } = useAuth();

    const fetchClubs = async () => {
        try {
            const [allClubsResponse, myClubsResponse] = await Promise.all([
                api.get('/freelancer/club/'),
                api.get('/freelancer/joined-clubs/')
            ]);
            setAllClubs(allClubsResponse.data);
            setMyClubs(myClubsResponse.data);
            
            // Set default selected club if none is selected yet
            if (!selectedClubId && allClubsResponse.data.length > 0) {
                setSelectedClubId(allClubsResponse.data[0].id);
            }
        } catch (error) {
            console.error('Error fetching clubs:', error);
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchClubs();
        }
    }, [authToken]);

    const handleJoinToggle = async (clubId: string) => {
        try {
            await api.post(`/freelancer/club/${clubId}/join/`);
            fetchClubs();
            setActiveTab("my");
            setSelectedClubId(clubId);
        } catch (error) {
            console.error('Error toggling club membership:', error);
        }
    };

    const handleClubSelect = (clubId: string) => {
        setSelectedClubId(clubId);
    };

    return (
        <div className="p-4 max-w-sm">
            <div className="flex items-center gap-4 mb-4 border-b">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`py-2 px-4 ${activeTab === "all" ? "text-purple-600 border-b-2 border-purple-600 font-semibold" : "text-gray-500"}`}
                >
                    All Clubs
                </button>
                <button
                    onClick={() => setActiveTab("my")}
                    className={`py-2 px-4 ${activeTab === "my" ? "text-purple-600 border-b-2 border-purple-600 font-semibold" : "text-gray-500"}`}
                >
                    My Clubs
                </button>
            </div>

            {activeTab === "all" && allClubs.map((club) => (
                !myClubs.some(myClub => myClub.id === club.id) && (
                    <ClubCard
                        key={club.id}
                        club={club}
                        isMyClub={false}
                        isSelected={club.id === selectedClubId}
                        onJoinToggle={handleJoinToggle}
                        onSelect={handleClubSelect}
                    />
                )
            ))}

            {activeTab === "my" && myClubs.map((club) => (
                <ClubCard
                    key={club.id}
                    club={club}
                    isMyClub={true}
                    isSelected={club.id === selectedClubId}
                    onJoinToggle={handleJoinToggle}
                    onSelect={handleClubSelect}
                />
            ))}
        </div>
    );
};

interface ClubCardProps {
    club: Club;
    isMyClub: boolean;
    isSelected: boolean;
    onJoinToggle: (clubId: string) => void;
    onSelect: (clubId: string) => void;
}

const ClubCard = ({ club, isMyClub, isSelected, onJoinToggle, onSelect }: ClubCardProps) => {
    return (
        <div 
            className={`bg-white rounded-xl p-4 mb-4 shadow-sm w-[350px] cursor-pointer ${isSelected ? 'border-2 border-purple-500' : ''}`}
            onClick={() => onSelect(club.id)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 text-xl">{club.name[0]}</span>
                    </div>
                    <div>
                        <h3 className="font-semibold">{club.name}</h3>
                        <p className="text-sm text-gray-500">
                            {isMyClub ? `${club.members?.length || 0} members` : `${club.participants_count || 0} members`}
                        </p>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onJoinToggle(club.id);
                    }}
                    className={`text-purple-600 hover:text-purple-800 ${isMyClub ? "font-bold" : ""}`}
                >
                    {isMyClub ? "Joined" : "Join"}
                </button>
            </div>

            {!isMyClub && (
                <p className="text-sm text-gray-600 mt-2">
                    {club.description}
                    <button 
                        className="text-purple-600 ml-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Read More...
                    </button>
                </p>
            )}
        </div>
    );
};

export default ClubsList;