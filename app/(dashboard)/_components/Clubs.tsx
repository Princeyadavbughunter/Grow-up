// @ts-nocheck
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

interface Club {
    id: string;
    name: string;
    description: string;
    participants_count: number;
    is_user_member:boolean;
}

const Clubs = () => {
    const [clubs, setClubs] = useState<Club[]>([]);
    const {authToken} = useAuth()
    const { api } = useAuthenticatedApi();

    const fetchClubs = async () => {
        try {
            const response = await api.get('/freelancer/club/');
            setClubs(response.data.slice(0, 4));
        } catch (error) {
            console.error('Error fetching clubs:', error);
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchClubs();
        }
    }, [authToken]);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Clubs</h2>
                <Link href="/clubs" className="text-sm text-purple-600">
                    View all
                </Link>
            </div>

            {/* Mobile: Horizontal scrollable container */}
            <div className="block lg:hidden">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                    {clubs.map((club) => (
                        <ClubCard key={club.id} club={club} refresh={fetchClubs} isMobile={true} />
                    ))}
                </div>
            </div>

            {/* Desktop: Vertical stack */}
            <div className="hidden lg:block">
                {clubs.map((club) => (
                    <ClubCard key={club.id} club={club} refresh={fetchClubs} isMobile={false} />
                ))}
            </div>
        </div>
    );
};

interface ClubCardProps {
    club: Club;
    refresh: any;
    isMobile: boolean;
}

const ClubCard = ({ club, refresh, isMobile }: ClubCardProps) => {
    const [isJoined, setIsJoined] = useState(false);
    const { api } = useAuthenticatedApi();

    const handleClick = async () => {
        try {
            if (club.is_user_member) {
                // Exit club
                await api.get(`/freelancer/exit-club/?id=${club.id}`);
            } else {
                // Join club
                await api.post(`/freelancer/join-club/?id=${club.id}`);
            }
            setIsJoined(!isJoined);
            refresh()
        } catch (error) {
            console.error('Error toggling club membership:', error);
        }
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm ${isMobile ? 'mb-0 w-64 flex-shrink-0' : 'mb-4'}`}>
            <Link href={`/clubs/${club.id}`} >
                <div className={`flex flex-col ${isMobile ? 'p-3' : 'p-4'}`} >

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`bg-purple-100 rounded-lg flex items-center justify-center ${isMobile ? 'w-10 h-10' : 'w-12 h-12'}`}>
                                <span className={`text-purple-600 ${isMobile ? 'text-lg' : 'text-xl'}`}>{club.name[0]}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className={`font-semibold ${isMobile ? 'text-sm' : ''} truncate`}>{club.name}</h3>
                                <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>{club.participants_count} members</p>
                            </div>
                        </div>
                        <button
                            className={`text-purple-600 hover:text-purple-800 whitespace-nowrap ${isMobile ? 'text-xs' : 'text-sm md:text-base'} ${club.is_user_member ? "font-bold" : ""}`}
                            onClick={(e) => {e.preventDefault(); handleClick()}}
                        >
                            {club.is_user_member ? "Joined" : "Join"}
                        </button>
                    </div>
                    <p className={`text-gray-600 mt-2 flex-grow ${isMobile ? 'text-xs line-clamp-2' : 'text-sm'}`}>
                        {club.description.substring(0, isMobile ? 80 : 150)}{club.description.length > (isMobile ? 80 : 150) ? '...' : ''}
                        <button className="text-purple-600 ml-1">Read More...</button>
                    </p>
                </div>
            </Link>
        </div>
    );
};

export default Clubs;