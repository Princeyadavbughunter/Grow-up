"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NetworkCardProps {
  name: string;
  title: string;
  location: string;
  imageUrl: string;
  isOnline?: boolean;
  summary?: string;
  showAccept?: boolean;
}

export function NetworkCard({ name, title, location, imageUrl, isOnline, summary, showAccept }: NetworkCardProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
        )}
      </div>
      <div className="flex-1 ">


        <div className="flex items-start justify-between ">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{name}</h3>
              <Badge variant="secondary" className="text-xs">1st</Badge>
            </div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-sm text-gray-500">{location}</p>
            {summary && <p className="text-sm text-gray-500 mt-1">{summary}</p>}
          </div>



          <div className="flex gap-2">
            {showAccept ? (
              <>
                <Button size="sm" variant="ghost" className="text-gray-500 rounded-full border-slate-400 border-[1px] h-8 w-8 bg-white">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
                <Button size="sm" className="shadow-none hover:bg-white bg-white text-purple-600 border-purple-700 border-[1px] rounded-full">Accept</Button>
              </>
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