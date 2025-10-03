// @ts-nocheck
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

interface Club {
    id: string;
    name: string;
    description: string;
    participants_count: number;
    is_user_member: boolean;
}

const Clubs = () => {
    const [clubs, setClubs] = useState<Club[]>([]);
    const { authToken } = useAuth();
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
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Clubs</h2>
                <Link href="/clubs" className="text-sm text-gray-600 hover:text-gray-800">
                    View all
                </Link>
            </div>

            {/* Mobile: Horizontal scrollable container */}
            <div className="block lg:hidden">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                    {clubs.map((club) => (
                        <ClubCard key={club.id} club={club} refresh={fetchClubs} isMobile={true} />
                    ))}
                </div>
            </div>

            {/* Desktop: Vertical stack */}
            <div className="hidden lg:block space-y-3">
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
    const [isExpanded, setIsExpanded] = useState(false);
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
            refresh();
        } catch (error) {
            console.error('Error toggling club membership:', error);
        }
    };

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    return (
        <div className={`bg-white border border-gray-200 rounded-lg ${isMobile ? 'w-64 flex-shrink-0' : ''}`}>
            <Link href={`/clubs/${club.id}`}>
                <div className={`p-4 ${isMobile ? 'p-3' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                            <div className={`bg-gray-100 rounded-md flex items-center justify-center ${isMobile ? 'w-10 h-10' : 'w-11 h-11'}`}>
                                <span className={`text-gray-600 font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>
                                    {club.name[0].toUpperCase()}
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : 'text-base'} truncate`}>
                                    {club.name}
                                </h3>
                                <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                    {club.participants_count} members
                                </p>
                            </div>
                        </div>
                        <button
                            className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ml-3 ${
                                club.is_user_member
                                    ? 'bg-gray-100 text-gray-700 border border-gray-300'
                                    : 'bg-blue-600 text-white'
                            }`}
                            onClick={(e) => { e.preventDefault(); handleClick(); }}
                        >
                            {club.is_user_member ? "Joined" : "Join"}
                        </button>
                    </div>

                    <div className="text-gray-600 leading-relaxed">
                        <p className={`${isExpanded ? '' : 'line-clamp-1'} ${isMobile ? 'text-xs' : 'text-sm'}`}>
                            {club.description}
                        </p>
                        {club.description.length > (isMobile ? 80 : 120) && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleExpanded();
                                }}
                                className={`text-blue-600 hover:text-blue-800 font-medium mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}
                            >
                                {isExpanded ? 'Show less' : 'Read more'}
                            </button>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Clubs;