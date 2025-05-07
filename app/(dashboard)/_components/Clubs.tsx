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

            {clubs.map((club) => (
                <ClubCard key={club.id} club={club} refresh={fetchClubs} />
            ))}
        </div>
    );
};

interface ClubCardProps {
    club: Club;
    refresh: any
}

const ClubCard = ({ club, refresh }: ClubCardProps) => {
    const [isJoined, setIsJoined] = useState(false);
    const { api } = useAuthenticatedApi();

    const handleClick = async () => {
        try {
            await api.post(`/freelancer/join-club/?id=${club.id}`);
            setIsJoined(!isJoined);
            refresh()
        } catch (error) {
            console.error('Error toggling club membership:', error);
        }
    };

    return (
        <Link href={`/clubs/${club.id}`} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 text-xl">{club.name[0]}</span>
                    </div>
                    <div>
                        <h3 className="font-semibold">{club.name}</h3>
                        <p className="text-sm text-gray-500">{club.participants_count} members</p>
                    </div>
                </div>
                <button
                    className={`text-purple-600 hover:text-purple-800 ${ club.is_user_member ? "font-bold" : ""}`}
                    onClick={handleClick}
                    disabled={club.is_user_member}
                >
                    { club.is_user_member ? "Joined" : "Join"}
                </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
                {club.description}
                <button className="text-purple-600 ml-1">Read More...</button>
            </p>
        </Link>
    );
};

export default Clubs;