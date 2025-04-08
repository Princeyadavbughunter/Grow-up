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

const ClubsList = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [allClubs, setAllClubs] = useState<Club[]>([]);
    const [myClubs, setMyClubs] = useState<Club[]>([]);
    const { api } = useAuthenticatedApi();
    const {authToken} = useAuth()

    const fetchClubs = async () => {
        try {
            const [allClubsResponse, myClubsResponse] = await Promise.all([
                api.get('/freelancer/club/'),
                api.get('/freelancer/joined-clubs/')
            ]);
            setAllClubs(allClubsResponse.data);
            setMyClubs(myClubsResponse.data);
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
        } catch (error) {
            console.error('Error toggling club membership:', error);
        }
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
                        onJoinToggle={handleJoinToggle}
                    />
                )
            ))}

            {activeTab === "my" && myClubs.map((club) => (
                <ClubCard
                    key={club.id}
                    club={club}
                    isMyClub={true}
                    onJoinToggle={handleJoinToggle}
                />
            ))}
        </div>
    );
};

interface ClubCardProps {
    club: Club;
    isMyClub: boolean;
    onJoinToggle: (clubId: string) => void;
}

const ClubCard = ({ club, isMyClub, onJoinToggle }: ClubCardProps) => {
    return (
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm w-[350px]">
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
                    onClick={() => onJoinToggle(club.id)}
                    className={`text-purple-600 hover:text-purple-800 ${isMyClub ? "font-bold" : ""}`}
                >
                    {isMyClub ? "Joined" : "Join"}
                </button>
            </div>

            {!isMyClub && (
                <p className="text-sm text-gray-600 mt-2">
                    {club.description}
                    <button className="text-purple-600 ml-1">Read More...</button>
                </p>
            )}
        </div>
    );
};

export default ClubsList;