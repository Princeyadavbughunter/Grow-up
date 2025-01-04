"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface Comment {
  author: {
    name: string;
    image: string;
  };
  content: string;
  likes: number;
}

export function EventComments() {
  const comments: Comment[] = [
    {
      author: {
        name: "Priya Sharma",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces"
      },
      content: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      likes: 88826
    }
  ];

  return (
    <div className="space-y-6">
      {comments.map((comment, index) => (
        <div key={index} className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={comment.author.image} />
              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{comment.author.name}</div>
            </div>
          </div>
          <p className="text-sm text-gray-600">{comment.content}</p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-red-500">
              <Heart className="w-4 h-4 mr-1" />
              {comment.likes.toLocaleString()}
            </Button>
            <Button variant="ghost" size="sm">Reply</Button>
          </div>
        </div>
      ))}
    </div>
  );
}