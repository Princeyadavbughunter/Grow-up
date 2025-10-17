"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser } from 'react-icons/fi';

interface NetworkCardProps {
  id: string;
  name: string;
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
  onCancelRequest?: () => void;
}

export function NetworkCard({ 
  id, 
  name = "User",
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
  onFollow,
  onCancelRequest,
}: NetworkCardProps) {
  // Safe access for name with fallback
  const nameInitial = name && name.length > 0 ? name.charAt(0) : "U";
  const router = useRouter();
  
  return (
    <div className="flex items-start gap-4">
      <Link href={`/profile/${id}`} className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={imageUrl} />
          <AvatarFallback><FiUser className="h-6 w-6" /></AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
        )}
      </Link>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{name}</h3>
            </div>
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
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-yellow-100 hover:bg-yellow-200 border-yellow-400 text-yellow-800"
                onClick={onCancelRequest}
              >
                Request Sent
              </Button>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => router.push(`/profile/${id}`)}>View profile</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}