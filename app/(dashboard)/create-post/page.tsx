// @ts-nocheck
'use client'
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EmptyState from '@/components/ui/empty-state';
import { Users } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/freelancer/joined-clubs/');
        setClubs(response.data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchClubs();
    }
  }, [authToken]);

  const handleClubClick = (clubId: string) => {
    router.push(`/create-post/${clubId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Joined Clubs</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-4 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Joined Clubs</h1>
      
      {clubs.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <EmptyState
            icon={<Users className="w-12 h-12 text-gray-400" />}
            title="No Clubs Joined Yet"
            description="You need to join a club before you can create posts. Clubs are communities where you can share and discuss topics with like-minded people."
            action={
              <Link
                href="/clubs"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Explore Clubs
              </Link>
            }
          />
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default JoinedClubs;