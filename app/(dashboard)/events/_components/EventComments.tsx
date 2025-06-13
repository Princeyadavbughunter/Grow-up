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
    <div className="space-y-3 sm:space-y-4">
      {comments.map((comment) => (
        <div 
          key={comment.id} 
          className="group bg-white border border-gray-100 rounded-xl p-3 sm:p-4 hover:shadow-sm transition-all duration-200 hover:border-purple-200"
        >
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-purple-50">
              <AvatarImage src={comment.user_profile_picture} alt={comment.user_name} />
              <AvatarFallback className="bg-purple-100 text-purple-700 text-xs sm:text-sm font-medium">
                {comment.user_name[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <span className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                  {comment.user_name}
                </span>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3 group-hover:bg-purple-50 transition-colors duration-200">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">
                  {comment.comment_text}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}