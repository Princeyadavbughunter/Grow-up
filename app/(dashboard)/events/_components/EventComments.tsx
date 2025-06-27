//@ts-nocheck
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface Comment {
  id: string;
  event: string;
  user: string;
  user_name: string;
  user_profile_picture: string;
  comment_text: string;
  created_at: string;
  replies: Comment[];
}

interface EventCommentsProps {
  comments: Comment[];
  onAddReply: (parentId: string, replyText: string) => void;
  onUserClick: (userId: string) => void;
}

export function EventComments({ comments, onAddReply, onUserClick }: EventCommentsProps) {
  const [replyText, setReplyText] = useState<string>('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const renderComments = (comments: Comment[]) => (
    <div className="space-y-1 sm:space-y-2 ml-2 pl-2 border-l border-gray-200">
      {comments.map((comment) => (
        <div key={comment.id} className="group bg-white border border-gray-100 rounded-lg p-1 sm:p-2 hover:shadow-sm transition-all duration-200 hover:border-purple-200">
          <div className="flex items-start gap-2">
            <Avatar className="h-6 w-6 sm:h-8 sm:w-8 ring-1 ring-purple-50">
              <AvatarImage src={comment.user_profile_picture} alt={comment.user_name} />
              <AvatarFallback className="bg-purple-100 text-purple-700 text-xs sm:text-sm font-medium">
                {comment.user_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1 sm:mb-1">
                <span 
                  className="font-semibold text-sm sm:text-base text-gray-900 truncate cursor-pointer hover:text-purple-600 transition-colors duration-200"
                  onClick={() => onUserClick(comment.user)}
                >
                  {comment.user_name}
                </span>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-1">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-1 sm:p-2 group-hover:bg-purple-50 transition-colors duration-200">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">
                  {comment.comment_text}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-1 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(comment.id)}
            >
              Reply
            </Button>
            {replyingTo === comment.id && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (replyText.trim()) {
                    onAddReply(comment.id, replyText);
                    setReplyText('');
                    setReplyingTo(null);
                  }
                }}
                className="flex gap-1 w-full"
              >
                <Input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 p-1"
                />
                <Button type="submit" size="sm">Post Reply</Button>
              </form>
            )}
          </div>
          {comment.replies && comment.replies.length > 0 && renderComments(comment.replies)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-2 sm:space-y-3 h-[calc(100vh-25rem)] overflow-y-auto overflow-x-hidden">
      {renderComments(comments)}
    </div>
  );
}