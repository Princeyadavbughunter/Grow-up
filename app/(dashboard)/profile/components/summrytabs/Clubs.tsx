// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { FaLaptopCode } from 'react-icons/fa6';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import Link from "next/link";

interface ClubCardProps {
    club: Club;
    onJoin: (clubId: string) => void;
    isMobile: boolean;
}

interface Club {
    id: string;
    name: string;
    description: string;
    participants_count: number;
    is_user_member: boolean;
}

const ClubCard = ({ club, onJoin, isMobile }: ClubCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    return (
        <div
            className={`flex gap-2 items-center justify-between p-${isMobile ? '3' : '4'} border rounded-lg hover:shadow-sm transition-shadow ${isMobile ? 'w-64 flex-shrink-0 min-h-[100px]' : ''}`}
        >
            <div className="flex-shrink-0">
                <FaLaptopCode color='#7052FF' size={isMobile ? 32 : 40} />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold ${!isMobile ? 'truncate' : ''}`}>{club.name}</h4>
                <p className="text-xs text-gray-500">{club.participants_count} members</p>
                <div className="text-xs text-gray-400">
                    <p className={`${isExpanded ? '' : `${isMobile ? 'line-clamp-2 overflow-hidden' : 'truncate'}`}`}>
                        {isExpanded 
                            ? (() => {
                                // Show first 35 words only when expanded
                                const words = club.description.split(' ');
                                if (words.length > 35) {
                                    return words.slice(0, 35).join(' ') + '...';
                                }
                                return club.description;
                            })()
                            : club.description
                        }
                    </p>
                    {club.description.length > (isMobile ? 40 : 60) && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded();
                            }}
                            className="text-[#7052FF] hover:text-[#5a42d1] font-medium mt-1"
                        >
                            {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                    )}
                </div>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onJoin(club.id);
                }}
                className={`text-${isMobile ? 'xs' : 'sm'} font-semibold text-[#7052FF] hover:bg-[#7052FF] hover:text-white px-${isMobile ? '3' : '4'} py-1 border border-[#7052FF] rounded-full transition-colors whitespace-nowrap`}
            >
                Join
            </button>
        </div>
    );
};

const Clubs = () => {
    const [clubs, setClubs] = useState([] as Club[]);
    const { authToken } = useAuth();
    const { api } = useAuthenticatedApi();

    const fetchClubs = async () => {
        try {
            const response = await api.get('/freelancer/club/');
            const availableClubs = response.data.filter((club: Club) => club.is_user_member === false).slice(0, 3);
            setClubs(availableClubs);
        } catch (error) {
            console.error('Error fetching clubs:', error);
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchClubs();
        }
    }, [authToken]);

    const handleJoin = async (clubId: string) => {
        try {
            await api.post(`/freelancer/join-club/?id=${clubId}`);
            fetchClubs();
        } catch (error) {
            console.error('Error toggling club membership:', error);
        }
    };

    return (
        <div className="font-poppins">
            <div className="my-8">
                <div className="flex flex-col items-center mb-6">
                    <h3 className="text-[16px] font-semibold leading-[100%] text-center">Clubs you may like</h3>
                    <Link href="/clubs" className="text-[11px] text-[#7052FF] mt-2 border-b border-[#7052FF]">
                        View all
                    </Link>
                </div>
                
                {/* Mobile: Horizontal scrollable container */}
                <div className="block lg:hidden">
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                        {clubs && clubs.length > 0 ? (
                            clubs.map((club) => (
                                <div key={club.id} className="bg-[#F9FAFF] border border-gray-100 rounded-xl p-3 w-64 flex-shrink-0 min-h-[100px] flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                        <FaLaptopCode color='#7052FF' size={32} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-semibold truncate">{club.name}</h4>
                                        <p className="text-[10px] text-gray-500">{club.participants_count} members</p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleJoin(club.id);
                                            }}
                                            className="text-[10px] font-semibold text-[#7052FF] hover:bg-[#7052FF] hover:text-white px-3 py-1 border border-[#7052FF] rounded-full transition-colors mt-1"
                                        >
                                            Join
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-[#F9FAFF] border border-gray-100 rounded-xl p-4 text-gray-400 text-center text-xs w-full">
                                No clubs available to join.
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop: Vertical stack */}
                <div className="hidden lg:block space-y-3">
                    {clubs && clubs.length > 0 ? (
                        clubs.map((club) => (
                            <div key={club.id} className="bg-[#F9FAFF] border border-gray-100 rounded-xl p-3 flex items-center justify-between transition-all duration-200 hover:shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                        <FaLaptopCode color='#7052FF' size={32} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-semibold truncate text-gray-900">{club.name}</h4>
                                        <p className="text-[10px] text-gray-500">{club.participants_count} members</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleJoin(club.id);
                                    }}
                                    className="text-[10px] font-semibold text-[#7052FF] hover:bg-[#7052FF] hover:text-white px-4 py-1 border border-[#7052FF] rounded-full transition-colors whitespace-nowrap"
                                >
                                    Join
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="bg-[#F9FAFF] border border-gray-100 rounded-xl p-4 text-gray-400 text-center text-xs">
                            No clubs available to join.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Clubs