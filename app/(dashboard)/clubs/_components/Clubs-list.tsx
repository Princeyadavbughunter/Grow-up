"use client";
import Link from "next/link";
import { SetStateAction, useState } from "react";

const ClubsList = () => {
    const [activeTab, setActiveTab] = useState("all"); // "all" or "my"
    const [joinedClubs, setJoinedClubs] = useState<number[]>([]); // Clubs that the user has joined

    const handleTabClick = (tab: SetStateAction<string>) => {
        setActiveTab(tab);
    };

    const clubs = [
        { id: 1, name: "Tech Minds", members: 9899 },
        { id: 2, name: "Design Enthusiasts", members: 1250 },
        { id: 3, name: "AI Innovators", members: 3400 },
        { id: 4, name: "Startup Builders", members: 2100 },
    ];

    const handleJoinToggle = (clubId: number) => {
        if (joinedClubs.includes(clubId)) {
            // Unjoin the club (move back to "All Clubs" tab)
            setJoinedClubs((prev) => prev.filter((id) => id !== clubId));
            if (activeTab === "my") {
                setActiveTab("all"); // Switch to "All Clubs" tab if the user is in "My Clubs"
            }
        } else {
            // Join the club (move to "My Clubs" tab)
            setJoinedClubs((prev) => [...prev, clubId]);
            if (activeTab === "all") {
                setActiveTab("my"); // Switch to "My Clubs" tab when the user joins a club
            }
        }
    };

    return (
        <div className="p-4 max-w-sm">
            <div className="flex items-center gap-4 mb-4 border-b">
                <button
                    onClick={() => handleTabClick("all")}
                    className={`py-2 px-4 ${activeTab === "all" ? "text-purple-600 border-b-2 border-purple-600 font-semibold" : "text-gray-500"}`}
                >
                    All Clubs
                </button>
                <button
                    onClick={() => handleTabClick("my")}
                    className={`py-2 px-4 ${activeTab === "my" ? "text-purple-600 border-b-2 border-purple-600 font-semibold" : "text-gray-500"}`}
                >
                    My Clubs
                </button>
            </div>

            {/* Display clubs based on the active tab */}
            {activeTab === "all" && clubs.map((club) => (
                !joinedClubs.includes(club.id) && (
                    <ClubCard
                        key={club.id}
                        club={club}
                        isMyClub={false}
                        onJoinToggle={handleJoinToggle}
                    />
                )
            ))}

            {activeTab === "my" && clubs.map((club) => (
                joinedClubs.includes(club.id) && (
                    <ClubCard
                        key={club.id}
                        club={club}
                        isMyClub={true}
                        onJoinToggle={handleJoinToggle}
                    />
                )
            ))}
        </div>
    );
};

const ClubCard = ({
    club,
    isMyClub,
    onJoinToggle,
}: {
    club: { id: number; name: string; members: number };
    isMyClub: boolean;
    onJoinToggle: (clubId: number) => void;
}) => {
    return (
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm  w-[350px]">
            <div className="flex items-center justify-between ">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 text-xl">{club.name[0]}</span>
                    </div>
                    <div>
                        <h3 className="font-semibold">{club.name}</h3>
                        <p className="text-sm text-gray-500">{club.members} members</p>
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
                    A group for {club.name} enthusiasts. Follow a passion with people
                    <button className="text-purple-600 ml-1">Read More...</button>
                </p>
            )}
        </div>
    );
};

export default ClubsList;
