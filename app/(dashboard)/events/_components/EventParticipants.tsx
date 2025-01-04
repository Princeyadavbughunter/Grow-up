"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
      role: "Product Designer",
      company: "Microsoft"
    },
    {
      name: "Alex Chen",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=faces",
      role: "Software Engineer",
      company: "Google"
    }
  ];

  return (
    <div className="space-y-4">
      {participants.map((participant, index) => (
        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={participant.image} />
              <AvatarFallback>{participant.name[0]}</AvatarFallback>
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