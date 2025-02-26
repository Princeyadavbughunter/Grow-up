import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthenticatedApi } from "@/context/AuthContext";

interface Club {
    id: string;
    name: string;
    description: string;
    participants_count: number;
}

const Clubs = () => {
    const [clubs, setClubs] = useState<Club[]>([]);
    const { api } = useAuthenticatedApi();

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await api.get('/freelancer/club/');
                setClubs(response.data.slice(0, 4));
            } catch (error) {
                console.error('Error fetching clubs:', error);
            }
        };
        fetchClubs();
    }, []);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Clubs</h2>
                <Link href="/clubs" className="text-sm text-purple-600">
                    View all
                </Link>
            </div>

            {clubs.map((club) => (
                <ClubCard key={club.id} club={club} />
            ))}
        </div>
    );
};

interface ClubCardProps {
    club: Club;
}

const ClubCard = ({ club }: ClubCardProps) => {
    const [isJoined, setIsJoined] = useState(false);
    const { api } = useAuthenticatedApi();

    const handleClick = async () => {
        try {
            await api.post(`/freelancer/club/${club.id}/join/`);
            setIsJoined(!isJoined);
        } catch (error) {
            console.error('Error toggling club membership:', error);
        }
    };

    return (
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
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
                    className={`text-purple-600 hover:text-purple-800 ${isJoined ? "font-bold" : ""}`}
                    onClick={handleClick}
                >
                    {isJoined ? "Joined" : "Join"}
                </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
                {club.description}
                <button className="text-purple-600 ml-1">Read More...</button>
            </p>
        </div>
    );
};

export default Clubs;