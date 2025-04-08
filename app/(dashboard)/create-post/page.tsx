'use client'
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Club {
  id: string;
  name: string;
  description: string;
  created_at: string;
  created_by: string;
  members: string[];
}

const JoinedClubs: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await api.get('/freelancer/joined-clubs/');
        setClubs(response.data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };

    if (authToken) {
      fetchClubs();
    }
  }, [authToken]);

  const handleClubClick = (clubId: string) => {
    router.push(`/create-post/${clubId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Joined Clubs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {clubs.map((club) => (
          <div
            key={club.id}
            onClick={() => handleClubClick(club.id)}
            className="bg-white cursor-pointer rounded-lg shadow-md p-4 flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <h2 className="text-lg font-semibold text-center">{club.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinedClubs;