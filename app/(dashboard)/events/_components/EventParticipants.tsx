"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SearchIcon, User } from "lucide-react";

interface Participant {
  name: string;
  image: string;
  role: string;
  company: string;
}

export function EventParticipants() {
  const participants: Participant[] = [
    {
      name: "Priya Sharma",
      image: "",
      role: "Product Designer",
      company: "Microsoft"
    },
    {
      name: "Alex Chen",
      image: "",
      role: "Software Engineer",
      company: "Google"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="border-[1px] flex items-center rounded-full p-2">
        <SearchIcon size={18} color="gray" />
        <input className="border-none ms-2 outline-none" placeholder="search" />
      </div>
      {participants.map((participant, index) => (
        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={participant.image} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{participant.name}</div>
              <div className="text-sm text-gray-500">{participant.role} at {participant.company}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm">View Profile</Button>
        </div>
      ))}
    </div>
  );
}