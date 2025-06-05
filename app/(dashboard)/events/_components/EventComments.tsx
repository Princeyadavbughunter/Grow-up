"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  event: string;
  user: string;
  user_name: string;
  user_profile_picture: string;
  comment_text: string;
  created_at: string;
}

interface EventCommentsProps {
  comments: Comment[];
}

export function EventComments({ comments }: EventCommentsProps) {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-4">
          <div className="flex items-start gap-3 flex-col sm:flex-row sm:items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user_profile_picture} alt={comment.user_name} />
              <AvatarFallback>{comment.user_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm sm:text-base">{comment.user_name}</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {comment.comment_text}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}