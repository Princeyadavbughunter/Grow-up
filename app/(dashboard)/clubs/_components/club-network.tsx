// @ts-nocheck
"use client";
import { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, UserPlus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import _ from "lodash";
import { useRouter } from "next/navigation";

interface Participant {
  user_id: string;
  email: string;
  username: string;
  joined_at: string;
  is_admin: boolean;
  profile_picture: string | null;
  address: string | null;
  position: string | null;
  soft_skills: string | null;
  bio: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  freelancer_id: string;
}

interface ClubData {
  club: string;
  description: string;
  created_at: string;
  participants: Participant[];
}

interface NetworkCardProps {
  id: string;
  name: string;
  title: string;
  location: string;
  imageUrl: string;
  isOnline?: boolean;
  summary?: string;
  followerCount?: number;
  showAccept?: boolean;
  showFollow?: boolean;
  requestSent?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onFollow?: () => void;
}

interface NetworkSectionProps {
  title: string;
  children?: React.ReactNode;
  clubId?: string;
}

export function NetworkSection({ title, children, clubId }: NetworkSectionProps) {
  const [clubData, setClubData] = useState<ClubData | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();

  const fetchParticipants = useCallback(async (searchUsername = "") => {
    if (!clubId) return;
    
    setIsLoading(true);
    try {
      let url = `/freelancer/clubs-participants/?id=${clubId}`;
      if (searchUsername) {
        url += `&username=${encodeURIComponent(searchUsername)}`;
      }
      
      const response = await api.get(url);
      setClubData(response.data);
      setParticipants(response.data.participants);
    } catch (error) {
      console.error('Error fetching club participants:', error);
    } finally {
      setIsLoading(false);
    }
  }, [clubId]);

  // Debounced search function
  const debouncedSearch = useCallback(
    _.debounce((term) => {
      fetchParticipants(term);
    }, 500),
    [fetchParticipants]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    if (authToken) {
      fetchParticipants();
    }
    
    return () => {
      debouncedSearch.cancel();
    };
  }, [authToken, debouncedSearch]);

  return (
    <div className="mt-6 w-full">
      <h2 className="text-lg font-semibold mb-4">
        {clubData?.club ? `${clubData.club} Members` : title}
      </h2>
      
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-8 pr-4"
        />      
      </div>
      
      {isLoading && <div className="flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div></div>}
      
      <div className="space-y-6 w-full overflow-x-hidden overflow-y-scroll">
        {participants.length > 0 ? 
          participants.map((participant) => (
            <NetworkCard
              key={participant.user_id}
              id={participant.freelancer_id}
              name={participant.username || "User"}
              title={participant.position || "Member"}
              location={participant.city && participant.state ? `${participant.city}, ${participant.state}` : ""}
              imageUrl={participant.profile_picture || ""}
              isOnline={false}
              summary={participant.bio || ""}
              showFollow={true}
            />
          ))
        : !isLoading && (
          searchTerm ? <p className="text-sm text-gray-500">No results found</p> : children
        )}
      </div>
    </div>
  );
}

export function NetworkCard({ 
  id, 
  name = "User",
  title, 
  location, 
  imageUrl, 
  isOnline, 
  summary, 
  followerCount,
  showAccept, 
  showFollow,
  requestSent,
  onAccept,
  onReject,
  onFollow
}: NetworkCardProps) {
  const nameInitial = name && name.length > 0 ? name.charAt(0) : "U";
  const router = useRouter();
  
  return (
    <div onClick={() => router.push(`/profile/${id}`)} className="flex cursor-pointer flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b border-gray-200">
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{nameInitial}</AvatarFallback>
        </Avatar>
      </div>
      <div className="overflow-auto ">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{name}</h3>
            </div>
            <p className="text-sm text-gray-600 truncate">{title}</p>
            <p className="text-sm text-gray-500 truncate">{location}</p>
            {summary && <p className="text-sm text-gray-500 mt-1 truncate">{summary}</p>}
            {followerCount !== undefined && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}