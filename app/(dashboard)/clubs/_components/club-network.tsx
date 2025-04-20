"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuthenticatedApi } from "@/context/AuthContext";

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
  const { api } = useAuthenticatedApi();

  useEffect(() => {
    const fetchClubParticipants = async () => {
      if (!clubId) return;
      
      try {
        const response = await api.get(`/freelancer/clubs-participants/?id=${clubId}`);
        setClubData(response.data);
        setParticipants(response.data.participants);
      } catch (error) {
        console.error('Error fetching club participants:', error);
      }
    };

    fetchClubParticipants();
  }, [clubId, api]);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">
        {clubData?.club ? `${clubData.club} Members` : title}
      </h2>
      <div className="space-y-6">
        {participants.length > 0 ? 
          participants.map((participant) => (
            <NetworkCard
              key={participant.user_id}
              id={participant.user_id}
              name={participant.username || "User"}
              title={participant.position || "Member"}
              location={participant.city && participant.state ? `${participant.city}, ${participant.state}` : ""}
              imageUrl={participant.profile_picture || ""}
              isOnline={false}
              summary={participant.bio || ""}
              showFollow={true}
            />
          ))
        : children}
      </div>
    </div>
  );
}

export function NetworkCard({ 
  id, 
  name = "User", // Provide default value
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
  // Safe access for name with fallback
  const nameInitial = name && name.length > 0 ? name.charAt(0) : "U";
  
  return (
    <div className="flex items-start gap-4">
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{nameInitial}</AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{name}</h3>
              <Badge variant="secondary" className="text-xs">1st</Badge>
            </div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-sm text-gray-500">{location}</p>
            {summary && <p className="text-sm text-gray-500 mt-1">{summary}</p>}
            {followerCount !== undefined && (
              <p className="text-xs text-gray-500 mt-1">
                {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {showAccept ? (
              <>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-gray-500 rounded-full border-slate-400 border-[1px] h-8 w-8 bg-white"
                  onClick={onReject}
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
                <Button 
                  size="sm" 
                  className="shadow-none hover:bg-white bg-white text-purple-600 border-purple-700 border-[1px] rounded-full"
                  onClick={onAccept}
                >
                  Accept
                </Button>
              </>
            ) : showFollow ? (
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={onFollow}
              >
                <UserPlus className="h-4 w-4" />
                Follow
              </Button>
            ) : requestSent ? (
              <Button size="sm" variant="outline" disabled>
                Request Sent
              </Button>
            ) : (
              <>
                <Button size="sm" variant="outline">View profile</Button>
                <Button size="sm" variant="ghost">
                  <Mail className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}