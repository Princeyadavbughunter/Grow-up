"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  
  // Truncate summary to max 15 words
  const truncateText = (text: string, maxWords: number = 15): string => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  const truncatedSummary = summary ? truncateText(summary, 15) : "";
  
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 cursor-pointer">
      <Link href={`/profile/${id}`} className="relative flex-shrink-0">
        <Avatar className="h-11 w-11 border-2 border-gray-100">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback className="bg-purple-100 text-purple-600 text-sm font-semibold">
            {nameInitial.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/profile/${id}`} className="block">
              <h3 className="font-semibold text-gray-900 text-sm hover:text-[#7052FF] transition-colors truncate">
                {name}
              </h3>
            </Link>
            {location && (
              <p className="text-xs text-gray-500 mt-0.5 truncate">{location}</p>
            )}
            {truncatedSummary && (
              <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                {truncatedSummary}
              </p>
            )}
            {followerCount !== undefined && (
              <p className="text-xs text-gray-400 mt-1.5">
                {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
              </p>
            )}
          </div>

          <div className="flex-shrink-0">
            {showAccept ? (
              <div className="flex gap-1.5">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 w-7 p-0 rounded-full hover:bg-gray-100 text-gray-500"
                  onClick={onReject}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
                <Button 
                  size="sm" 
                  className="h-7 px-3 text-xs bg-[#7052FF] hover:bg-[#5a42cc] text-white rounded-full shadow-sm"
                  onClick={onAccept}
                >
                  Accept
                </Button>
              </div>
            ) : showFollow ? (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 px-3 text-xs flex items-center gap-1 border-gray-300 hover:bg-gray-50"
                onClick={onFollow}
              >
                <UserPlus className="h-3 w-3" />
                Follow
              </Button>
            ) : requestSent ? (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 px-3 text-xs bg-yellow-50 hover:bg-yellow-100 border-yellow-300 text-yellow-700"
                onClick={onCancelRequest}
              >
                Pending
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 px-3 text-xs border-gray-300 hover:bg-gray-50 hover:border-gray-400 flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/profile/${id}`);
                }}
              >
                
                View Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}