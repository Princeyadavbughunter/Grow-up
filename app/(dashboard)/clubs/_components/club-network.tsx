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
  first_name: string | null;
  last_name: string | null;
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
    <div className="w-full pb-24 h-[calc(100vh-10rem)] overflow-y-hidden">
      {title && (
        <h2 className="text-lg font-semibold mb-4 lg:mb-6">
          {clubData?.club ? `${clubData.club} Members` : title}
        </h2>
      )}
      
      <div className="relative mb-3 lg:mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search members..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 pr-4 h-10 text-sm"
        />      
      </div>
      
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        </div>
      )}
      
      <div className="w-full h-full pb-12 overflow-y-auto">
        {participants.length > 0 ? (
          <div className="space-y-0">
            {participants.map((participant) => (
              <NetworkCard
                key={participant.user_id}
                id={participant.freelancer_id}
                name={participant.first_name && participant.last_name 
                  ? `${participant.first_name} ${participant.last_name}` 
                  : participant.username || "User"}
                title={participant.position || "Member"}
                location={participant.city && participant.state ? `${participant.city}, ${participant.state}` : ""}
                imageUrl={participant.profile_picture || ""}
                isOnline={false}
                summary={participant.bio || ""}
                showFollow={true}
              />
            ))}
          </div>
        ) : !isLoading && (
          <div className="text-center py-8">
            {searchTerm ? (
              <div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No members found matching "{searchTerm}"</p>
              </div>
            ) : (
              children || (
                <div>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">No members in this club yet</p>
                </div>
              )
            )}
          </div>
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
    <div onClick={() => router.push(`/profile/${id}`)} className="flex cursor-pointer items-center gap-2 lg:gap-3 p-2 lg:p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="relative flex-shrink-0">
        <Avatar className="h-8 w-8 lg:h-12 lg:w-12">
          <AvatarImage src={imageUrl} />
          <AvatarFallback className="bg-purple-100 text-purple-600 text-xs lg:text-sm font-medium">{nameInitial}</AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 lg:w-3 lg:h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 lg:mb-1">
          <h3 className="font-medium text-gray-900 truncate text-sm lg:text-base">{name}</h3>
        </div>
        {location && <p className="text-xs text-gray-500 truncate hidden lg:block">{location}</p>}
        {summary && (
          <p className="text-xs text-gray-500 mt-0.5 lg:mt-1 line-clamp-1 hidden lg:block">{summary}</p>
        )}
        {followerCount !== undefined && (
          <p className="text-xs text-gray-400 mt-0.5 lg:mt-1 hidden lg:block">
            {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
          </p>
        )}
      </div>
    </div>
  );
}