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
  variant?: "list" | "grid" | "invite";
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
  variant = "list",
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

  const truncatedSummary = summary ? truncateText(summary, 20) : "";

  if (variant === "grid") {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-2xl hover:shadow-lg transition-all bg-white text-center h-full min-h-[260px] w-full relative sm:aspect-[4/5] mx-auto">
        <Link href={`/profile/${id}`} className="relative mb-4 mt-2">
          <Avatar className="h-20 w-20 border-2 border-gray-50 shadow-sm">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className="bg-purple-100 text-purple-600 font-bold text-2xl">
              {nameInitial.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!isOnline && ( // matching the mock with green dots
            <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white shadow-sm" />
          )}
        </Link>
        <div className="flex flex-col items-center flex-1 w-full justify-start mt-2">
          <Link href={`/profile/${id}`}>
            <h3 className="font-bold text-gray-900 text-base hover:text-[#7052FF] transition-colors line-clamp-1 mb-1">
              {name}
            </h3>
          </Link>
          {location && (
            <p className="text-[13px] text-gray-500 mt-1 line-clamp-2 w-full font-medium px-2 leading-relaxed">
              {summary ? truncateText(summary, 8) : location}
            </p>
          )}
          {!summary && location && (
            <p className="text-[13px] text-gray-400 mt-2 truncate w-full">{location}</p>
          )}
        </div>
      </div>
    );
  }

  if (variant === "invite") {
    return (
      <div className="flex items-center gap-[20px] bg-white cursor-pointer relative group w-full min-h-[116px] hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 pl-2 py-3">
        <Link href={`/profile/${id}`} className="relative flex-shrink-0">
          <Avatar className="h-[60px] w-[60px] border-2 border-gray-100">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold text-lg">
              {nameInitial.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!isOnline && ( // Matching the mock green dot
            <div className="absolute bottom-1 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white shadow-sm" />
          )}
        </Link>
        <div className="flex-1 min-w-0 flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <Link href={`/profile/${id}`} className="block">
              <h3 className="font-semibold text-gray-900 text-base hover:text-[#7052FF] transition-colors line-clamp-1">
                {name}
              </h3>
            </Link>
            {location && (
              <p className="text-[13px] text-gray-600 mt-0.5 line-clamp-1">
                {location}
              </p>
            )}
            {summary && (
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                Summary: {summary}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 flex gap-3 items-center pr-2">
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9 rounded-full border-gray-300 text-gray-500 hover:bg-gray-100"
              onClick={(e) => { e.stopPropagation(); onReject?.(); }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
            <Button
              variant="outline"
              className="h-9 px-5 text-[13px] font-medium border-[#7052FF] text-[#7052FF] hover:bg-purple-50 rounded-full flex items-center gap-1.5"
              onClick={(e) => { e.stopPropagation(); onAccept?.(); }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Accept
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 py-4 bg-white transition-colors cursor-pointer relative group">
      <Link href={`/profile/${id}`} className="relative flex-shrink-0 mt-1">
        <Avatar className="h-[46px] w-[46px] border-2 border-gray-100">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback className="bg-purple-100 text-purple-600 text-sm font-semibold">
            {nameInitial.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white shadow-sm" />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 pt-1">
            <Link href={`/profile/${id}`} className="block">
              <h3 className="font-semibold text-gray-900 text-[15px] hover:text-[#7052FF] transition-colors truncate">
                {name}
              </h3>
            </Link>
            {location && (
              <p className="text-xs text-gray-600 mt-1 leading-snug pr-4">
                {location}
              </p>
            )}
            {showAccept && truncatedSummary && (
              <p className="text-[11px] text-gray-400 mt-1.5 line-clamp-1">
                Summary: {truncatedSummary}
              </p>
            )}
          </div>

          <div className="flex-shrink-0 pt-2 pr-2">
            {showAccept ? (
              <div className="flex gap-2 items-center">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full border-gray-300 text-gray-500 hover:bg-gray-100"
                  onClick={(e) => { e.stopPropagation(); onReject?.(); }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="h-8 px-4 text-xs font-medium border-[#7052FF] text-[#7052FF] hover:bg-purple-50 rounded-full flex items-center gap-1.5"
                  onClick={(e) => { e.stopPropagation(); onAccept?.(); }}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Accept
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {!showAccept && !showFollow && !requestSent && (
          <div className="flex items-center gap-2 mt-3.5">
            <Button
              variant="outline"
              className="h-8 px-5 py-0 text-xs font-medium rounded-full border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/profile/${id}`);
              }}
            >
              View profile
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-gray-300 text-gray-400 hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </Button>
          </div>
        )}

        {/* Bottom divider mimicking the design */}
        <div className="h-[1px] bg-gray-200 mt-5 w-full max-w-[85%]" />
      </div>
    </div>
  );
}