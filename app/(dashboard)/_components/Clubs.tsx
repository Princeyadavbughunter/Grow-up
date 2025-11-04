// @ts-nocheck
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { ArrowRightIcon } from "@/components/ui/arrow-right";

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
                <h2 className="text-xl font-bold text-gray-900">Suggested Clubs</h2>
                <Link href="/clubs" className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors border border-purple-200 hover:border-purple-300 px-3 py-1.5 rounded-lg">
                    View all <ArrowRightIcon size={16} />
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
            <div className="hidden lg:block space-y-4">
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
        <div className={`bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${isMobile ? 'w-64 flex-shrink-0' : ''}`}>
            <Link href={`/clubs/${club.id}`}>
                <div className={`p-4 ${isMobile ? 'p-3' : 'p-5'}`}>
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0 pr-2">
                            <h3 className={`font-bold text-gray-900 ${isMobile ? 'text-sm' : 'text-base'} mb-1.5 line-clamp-1`}>
                                {club.name}
                            </h3>
                            <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                                {club.participants_count} {club.participants_count === 1 ? 'member' : 'members'}
                            </p>
                        </div>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                                club.is_user_member
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow'
                            }`}
                            onClick={(e) => { e.preventDefault(); handleClick(); }}
                        >
                            {club.is_user_member ? "Joined" : "Join"}
                        </button>
                    </div>

                    <div className="text-gray-600 leading-relaxed">
                        <p className={`${isExpanded ? '' : 'line-clamp-2 overflow-hidden'} ${isMobile ? 'text-xs' : 'text-sm'}`}>
                            {club.description}
                        </p>
                        {club.description.length > (isMobile ? 50 : 80) && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleExpanded();
                                }}
                                className={`text-purple-600 hover:text-purple-700 font-semibold mt-2 transition-colors ${isMobile ? 'text-xs' : 'text-sm'}`}
                            >
                                {isExpanded ? 'Show less ↑' : 'Read more →'}
                            </button>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Clubs;