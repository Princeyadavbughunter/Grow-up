//@ts-nocheck
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { MessageCircle, Clock } from 'lucide-react';

interface Comment {
  id: string;
  event: string;
  user: string;
  user_name: string;
  user_profile_picture: string;
  comment_text: string;
  created_at: string;
  replies: Comment[];
  user_freelancer_profile: {
    freelancer_id: string;
    first_name: string;
    last_name: string;
    bio: string;
    profile_picture: string | null;
  };
}

interface EventCommentsProps {
  comments: Comment[];
  onAddReply: (parentId: string, replyText: string) => void;
  onUserClick: (userId: string) => void;
}

export function EventComments({ comments, onAddReply, onUserClick }: EventCommentsProps) {
  const [replyText, setReplyText] = useState<string>('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Flatten the comment tree with depth tracking
  const flattenComments = (comments: Comment[], depth: number = 0): Array<Comment & { depth: number }> => {
    return comments.flatMap(comment => [
      { ...comment, depth },
      ...(comment.replies ? flattenComments(comment.replies, depth + 1) : [])
    ]);
  };

  const flattened = flattenComments(comments);

  return (
    <div className="space-y-2 h-[calc(100vh-25rem)] overflow-y-auto overflow-x-hidden pr-2">
      {flattened.map((comment) => {
        // Cap the visual indentation at 5 levels
        const visualDepth = Math.min(comment.depth, 5);
        const paddingLeft = visualDepth * 12; // 12px per level, max 60px
        const isReply = comment.depth > 0;
        
        return (
          <div 
            key={comment.id} 
            className="relative mb-3 mt-1"
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            <div className="group bg-white transition-all duration-300">
              <div className="py-2">
                <div className="flex items-start gap-3">
                  <Avatar 
                    className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-gray-100 group-hover:ring-purple-200 shadow-sm cursor-pointer transition-all duration-200 flex-shrink-0"
                    onClick={() => onUserClick(comment.user_freelancer_profile.freelancer_id)}
                  >
                    <AvatarImage src={comment.user_profile_picture} alt={comment.user_name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-600 text-white text-xs sm:text-sm font-semibold">
                      {comment.user_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span 
                        className="font-semibold text-sm sm:text-base text-gray-900 cursor-pointer hover:text-purple-600 transition-colors duration-200"
                        onClick={() => onUserClick(comment.user_freelancer_profile.freelancer_id)}
                      >
                        {comment.user_name}
                      </span>
                      
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-purple-50/50 transition-all duration-300">
                      <p className="text-sm sm:text-base text-gray-800 leading-relaxed break-words">
                        {comment.comment_text}
                      </p>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="text-xs h-8 px-3 hover:bg-purple-50 hover:text-purple-600 transition-colors rounded-full"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {replyingTo === comment.id ? 'Cancel' : 'Reply'}
                      </Button>
                      
                      {/* Show reply count if has replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <span className="text-xs text-gray-500 flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                          {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                        </span>
                      )}
                    </div>
                    
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
                        className="flex gap-2 mt-3 p-3 bg-purple-50/50 rounded-lg border-2 border-purple-100"
                      >
                        <Input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${comment.user_name}...`}
                          className="flex-1 h-9 text-sm bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                          autoFocus
                        />
                        <Button 
                          type="submit" 
                          size="sm" 
                          className="h-9 px-4 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg"
                          disabled={!replyText.trim()}
                        >
                          Post
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="h-16"></div>
    </div>
  );
}