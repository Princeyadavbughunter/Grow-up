// @ts-nocheck
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';
import { Code } from 'lucide-react';

interface Club {
  id: string;
  name: string;
  description: string;
  participants_count: number;
  is_user_member: boolean;
  profile_picture?: string;
}

// Generate a consistent color pair for a club based on its name
const getClubColor = (name: string) => {
  const palettes = [
    { bg: 'bg-[#EDE9FF]', text: 'text-[#7052FF]' },
    { bg: 'bg-[#E0F2FE]', text: 'text-[#0369A1]' },
    { bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]' },
    { bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]' },
    { bg: 'bg-[#FCE7F3]', text: 'text-[#9D174D]' },
    { bg: 'bg-[#FEE2E2]', text: 'text-[#B91C1C]' },
  ];
  const idx = name.charCodeAt(0) % palettes.length;
  return palettes[idx];
};

const Clubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();
  const { api } = useAuthenticatedApi();

  const fetchClubs = async () => {
    try {
      const response = await api.get('/freelancer/club/');
      setClubs(response.data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) fetchClubs();
  }, [authToken]);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[17px] font-bold text-[#111827]">Clubs</h2>
        <Link href="/clubs" className="text-[14px] text-[#4B5563] hover:text-gray-900 font-medium transition-colors">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse border border-[#E5E7EB] rounded-[16px] p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-[52px] h-[52px] bg-[#F4F2FF] rounded-[14px] flex-shrink-0" />
                <div className="flex-1 mt-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
                <div className="w-[60px] h-[28px] bg-gray-200 rounded-full mt-1" />
              </div>
              <div className="mt-1 h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Desktop: Vertical stack */}
          <div className="hidden lg:block space-y-4">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} refresh={fetchClubs} />
            ))}
          </div>

          {/* Mobile: Horizontal scroll */}
          <div className="block lg:hidden">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {clubs.map((club) => (
                <ClubCard key={club.id} club={club} refresh={fetchClubs} mobile />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface ClubCardProps {
  club: Club;
  refresh: () => void;
  mobile?: boolean;
}

const ClubCard = ({ club, refresh, mobile }: ClubCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { api } = useAuthenticatedApi();
  const color = getClubColor(club.name);

  const handleJoinToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      if (club.is_user_member) {
        await api.get(`/freelancer/exit-club/?id=${club.id}`);
      } else {
        await api.post(`/freelancer/join-club/?id=${club.id}`);
      }
      refresh();
    } catch (error) {
      console.error('Error toggling club membership:', error);
    } finally {
      setLoading(false);
    }
  };

  const TRUNCATE = mobile ? 80 : 100;
  const needsTruncate = club.description.length > TRUNCATE;
  
  // Custom parsing to match the image precisely with "Read More.."
  let displayDesc = club.description;
  if (needsTruncate && !expanded) {
    displayDesc = displayDesc.slice(0, TRUNCATE);
  }

  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-[16px] p-4 hover:shadow-md transition-all duration-200 ${
        mobile ? 'w-[280px] flex-shrink-0' : ''
      }`}
    >
      {/* Top Row: Icon, Title, Join Button */}
      <div className="flex items-center gap-3 mb-3">
        {/* Exact matched layered squircle Code icon */}
        <Link href={`/clubs/${club.id}`} className="flex-shrink-0">
          <div className="w-[52px] h-[52px] rounded-[12px] bg-[#F8F8FC] flex items-center justify-center p-2">
            <div className="w-full h-full bg-[#7052FF] rounded-[8px] flex items-center justify-center text-white">
              <Code size={18} strokeWidth={2.5} />
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0 mt-0.5">
          <Link href={`/clubs/${club.id}`}>
            <h3 className="text-[15px] font-semibold text-[#111827] leading-tight line-clamp-1 hover:text-[#7052FF] transition-colors">
              {club.name}
            </h3>
          </Link>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">
            {club.participants_count.toLocaleString()} members
          </p>
        </div>

        {/* Join Button */}
        <button
          onClick={handleJoinToggle}
          disabled={loading}
          className={`flex-shrink-0 text-[13px] font-medium px-5 py-[6px] rounded-full transition-all ${
            club.is_user_member
              ? 'bg-[#F4F2FF] text-[#7052FF] hover:bg-[#EBE7FF]'
              : 'bg-[#F4F2FF] text-[#7052FF] hover:bg-[#EBE7FF]'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? '...' : club.is_user_member ? 'Joined' : 'Join'}
        </button>
      </div>

      {/* Description below */}
      <p className="text-[13px] text-[#6B7280] leading-[20px]">
        {displayDesc}
        {needsTruncate && !expanded && (
          <span className="text-[#6B7280]">
            {' a '}
            <button
              onClick={(e) => { e.preventDefault(); setExpanded(true); }}
              className="text-[#7052FF] text-[12px] font-medium hover:underline tracking-tight"
            >
              Read More..
            </button>
          </span>
        )}
        {expanded && needsTruncate && (
          <button
            onClick={(e) => { e.preventDefault(); setExpanded(false); }}
            className="text-[#7052FF] text-[12px] font-medium ml-1 hover:underline tracking-tight"
          >
            Show less
          </button>
        )}
      </p>
    </div>
  );
};

export default Clubs;