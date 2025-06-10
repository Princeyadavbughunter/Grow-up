import React, { useState, useEffect } from 'react';
import { FaLaptopCode } from 'react-icons/fa6';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import Link from "next/link";

interface Club {
    id: string;
    name: string;
    description: string;
    participants_count: number;
    is_user_member: boolean;
}

const Clubs = () => {
    // @ts-ignore
    const [clubs, setClubs] = useState([] as Club[]);
    const { authToken } = useAuth();
    const { api } = useAuthenticatedApi();

    const fetchClubs = async () => {
        try {
            const response = await api.get('/freelancer/club/');
            setClubs(response.data.slice(0, 3));
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
        <div>
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Clubs you may like</h3>
                    <Link href="/clubs" className="text-sm text-purple-600">
                        View all
                    </Link>
                </div>
                <div className="space-y-4">
                    {/* @ts-ignore */}
                    {clubs && clubs.length > 0 ? (
    // @ts-ignore
                        clubs.map((club) => (
                            <div
                                key={club.id}
                                className="flex gap-2 items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                            >
                                <div className="div">
                                    <FaLaptopCode color='#7052FF' size={40} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">{club.name}</h4>
                                    <p className="text-xs text-gray-500">{club.participants_count} members</p>
                                    <p className="text-xs text-gray-400 truncate">{club.description}</p>
                                </div>
                                <button 
                                    onClick={() => handleJoin(club.id)}
                                    disabled={club.is_user_member}
                                    className={`text-sm font-semibold ${club.is_user_member 
                                        ? "text-white bg-[#7052FF]" 
                                        : "text-[#7052FF] hover:bg-[#7052FF] hover:text-white"} 
                                        px-4 py-1 border border-[#7052FF] rounded-full transition-colors`}
                                >
                                    {club.is_user_member ? 'Joined' : 'Join'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="bg-[#F6F8FF] shadow-sm rounded-xl p-4 text-gray-500 text-center">
                            No clubs available. Explore more to join one.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Clubs