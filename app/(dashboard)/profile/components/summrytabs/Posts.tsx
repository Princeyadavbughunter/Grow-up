// @ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import Link from 'next/link';
import { FiUser } from 'react-icons/fi';
import SharePopup from '../../../post/_components/SharePopup';
import { CommentModal } from '@/components/ui/comment-modal';
import { formatTimeAgo } from '@/lib/utils';
import { Heart, MessageSquare, Share } from 'lucide-react';
interface ImageData {
    id: string;
    file: string;
    author: string;
    uploaded_at: string;
}

interface VideoType {
  id: string;
  file: string;
  author: string;
  uploaded_at: string;
}

interface Post {
    id: string;
    images: ImageData[];
    videos: VideoType[];
    profile_picture: string | null;
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
    company_logo: string | null;
    role: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    is_take_down: boolean;
    like_count: number;
    comment_count: number;
    author: string;
    club: string;
    club_name: string;
    freelancer_profile: string;
    is_liked?: boolean;
    link: string;
}

interface Comment {
    id: string;
    profile_picture: string | null;
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
    company_logo: string | null;
    role: string;
    content: string;
    created_at: string;
    updated_at: string;
    is_take_down: boolean;
    comment_reply_count: number;
    post: string;
    author: string; 
}

interface CommentReply {
    id: string;
    profile_picture: string | null;
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
    company_logo: string | null;
    role: string;
    content: string;
    created_at: string;
    updated_at: string;
    is_take_down: boolean;
    comment: string;
    author: string;
}

interface PostsProps {
    profileId?: string;
}

const Posts = ({ profileId }: PostsProps) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const { api } = useAuthenticatedApi();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (profileId) {
                    const response = await api.get(`/post/app/freelancer-posts/?freelancer_id=${profileId}`);
                    setPosts(response.data || []);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        if (authToken && profileId) {
            fetchPosts();
        }
    }, [authToken, profileId]);

    const handleLikePost = async (postId: string) => {
        try {
            const response = await api.post(`/post/app/toggle-like/?post_id=${postId}`);
            const { post: updatedPost, is_like } = response.data;
            
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId
                        ? { 
                            ...post, 
                            like_count: updatedPost.like_count,
                            is_liked: is_like 
                        }
                        : post
                )
            );
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    return (
        <div className="p-4 mt-10 h-[calc(100vh-10rem)] overflow-y-scroll">

            {loading ? (
                <div className="text-center py-10">Loading posts...</div>
            ) : (
                <div>
                    {posts.length > 0 ? (
                        posts.map((post: Post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onLike={handleLikePost}
                            />
                        ))
                    ) : (
                        <div className="bg-[#F6F8FF] shadow-sm rounded-xl p-4 text-gray-500 text-center">
                            No posts available. Be the first to post!
                        </div>
                    )}
                </div>
            )}

            <Link href={`/clubs`} className="text-center flex justify-center mt-4">
                <button className="text-blue-600 hover:underline">See more posts</button>
            </Link>
        </div>
    );
};

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
}

const PostCard = ({ post, onLike }: PostCardProps) => {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const { api } = useAuthenticatedApi();
    const formattedDate = formatTimeAgo(post.created_at);

    const fetchComments = async () => {
        try {
            const response = await api.get(`/post/app/comments/?post_id=${post.id}`);
            setComments(response.data.response);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleCommentToggle = () => {
        setShowComments(!showComments);
        if (!showComments) {
            fetchComments();
        }
    };

    const handleAddComment = async (content: string) => {
        if (!content.trim()) return;

        setIsSubmittingComment(true);
        try {
            await api.post('/post/app/comments/', {
                post: post.id,
                content: content,
                is_take_down: "False"
            });

            setShowCommentModal(false);
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const getImageUrl = (path: string): string => {
        return path;
    };

    return (
        <div className="bg-white rounded-xl p-4 mb-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Link href={`/profile/${post.freelancer_profile}`} className="flex items-center gap-3">
                        <div>
                            {post.profile_picture ? (
                                <Image
                                    src={getImageUrl(post.profile_picture)}
                                    alt="Profile"
                                    width={40}
                                    height={40}
                                    className="rounded-full md:w-10 md:h-10 w-8 h-8"
                                />
                            ) : (
                                <div className="rounded-full bg-gray-200 flex items-center justify-center md:w-10 md:h-10 w-8 h-8">
                                    <FiUser className="text-gray-600 md:w-5 md:h-5 w-4 h-4" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold">
                                {post.first_name || post.company_name || 'Anonymous'}
                            </h3>
                            <p className="text-sm text-gray-500">{formattedDate}</p>
                        </div>
                    </Link>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Link
                        href={`/clubs/${post.club}`}
                        className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors cursor-pointer"
                    >
                        {post.club_name}
                    </Link>
                    {post.link && (
                        <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:text-blue-700 underline text-right"
                        >
                            Link
                        </a>
                    )}
                </div>
            </div>

            <Link href={`/post/${post.id}`} className="block hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
                <p className="mb-4">{post.title}</p>
                {post.content && <p className="mb-4">{post.content}</p>}

                {post.images && post.images.length > 0 && (
                    <Image
                        src={getImageUrl(post.images[0].file)}
                        alt="Post"
                        width={800}
                        height={600}
                        className="rounded-xl mb-4"
                    />
                )}
            </Link>

            <div className="flex items-center gap-4 text-gray-500">
                <button
                    className={`flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors ${
                        post.is_liked ? 'text-red-500 bg-red-50' : 'text-gray-500'
                    }`}
                    onClick={() => onLike(post.id)}
                >
                    <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{post.like_count}</span>
                </button>
                <button
                    className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                    onClick={handleCommentToggle}
                >
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium">{post.comment_count}</span>
                </button>
                <button
                    onClick={() => setShowSharePopup(true)}
                    className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                >
                    <Share className="w-5 h-5" />
                </button>
            </div>

            {showComments && (
                <div className="mt-4 border-t pt-4">
                    <div className="space-y-4 mb-4">
                        {comments.map(comment => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                api={api}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => setShowCommentModal(true)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-left text-gray-500 hover:bg-gray-100 transition-colors text-sm md:text-base"
                    >
                        Add a comment...
                    </button>
                </div>
            )}

            {/* Comment Modal */}
            <CommentModal
                isOpen={showCommentModal}
                onClose={() => setShowCommentModal(false)}
                onSubmit={handleAddComment}
                title="Add Comment"
                placeholder="Share your thoughts about this post..."
                submitButtonText="Post Comment"
                isLoading={isSubmittingComment}
            />

            {/* Share Popup */}
            <SharePopup
                isOpen={showSharePopup}
                onClose={() => setShowSharePopup(false)}
                postId={post.id}
                postTitle={post.title}
            />
        </div>
    );
};

interface CommentItemProps {
    comment: Comment;
    api: any;
}

const CommentItem = ({ comment, api }: CommentItemProps) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replies, setReplies] = useState<CommentReply[]>([]);
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const formattedDate = formatTimeAgo(comment.created_at);

    const fetchReplies = async () => {
        try {
            const response = await api.get(`/post/app/comments-replies/?id=${comment.id}`);
            setReplies(response.data.response);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    const handleReplyToggle = () => {
        setShowReplies(!showReplies);
        if (!showReplies && comment.comment_reply_count > 0) {
            fetchReplies();
        }
    };

    const handleAddReply = async (content: string) => {
        if (!content.trim()) return;

        setIsSubmittingReply(true);
        try {
            await api.post('/post/app/comments-replies/', {
                comment: comment.id,
                content: content,
                is_take_down: "False"
            });

            setShowReplyModal(false);
            fetchReplies();
            setShowReplies(true);
            setShowReplyForm(false);
        } catch (error) {
            console.error('Error adding reply:', error);
        } finally {
            setIsSubmittingReply(false);
        }
    };

    const getImageUrl = (path: string): string => {
        return path;
    };

    return (
        <div className="border-l-2 sm:border-l-4 border-gray-200 pl-3 sm:pl-4">
            <div className="flex items-start gap-3">
                <Image
                    src={comment.profile_picture || "https://randomuser.me/portraits/men/2.jpg"}
                    alt="User"
                    width={32}
                    height={32}
                    className="rounded-full w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium">
                            {comment.first_name || comment.company_name || 'Anonymous'}
                        </h4>
                        <span className="text-xs text-gray-500">{formattedDate}</span>
                    </div>
                    <p className="text-sm mb-2 break-words">{comment.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <button onClick={() => setShowReplyForm(!showReplyForm)}>Reply</button>
                        {comment.comment_reply_count > 0 && (
                            <button onClick={handleReplyToggle}>
                                {showReplies ? 'Hide replies' : `View ${comment.comment_reply_count} replies`}
                            </button>
                        )}
                    </div>

                    {showReplyForm && (
                        <button
                            onClick={() => setShowReplyModal(true)}
                            className="mt-2 text-sm bg-gray-50 border border-gray-300 rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            Add a reply...
                        </button>
                    )}

                    {showReplies && (
                        <div className="mt-2 space-y-3">
                            {replies.map(reply => (
                                <div key={reply.id} className="flex items-start gap-2 ml-4 sm:ml-6 pl-3 sm:pl-4 border-l-2 border-gray-100">
                                    <Image
                                        src={reply.profile_picture || "https://randomuser.me/portraits/men/2.jpg"}
                                        alt="User"
                                        width={24}
                                        height={24}
                                        className="rounded-full w-6 h-6 flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h5 className="font-medium text-xs">
                                                {reply.first_name || reply.company_name || 'Anonymous'}
                                            </h5>
                                            <span className="text-xs text-gray-500">
                                                {formatTimeAgo(reply.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-sm break-words">{reply.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Reply Modal */}
                    <CommentModal
                        isOpen={showReplyModal}
                        onClose={() => setShowReplyModal(false)}
                        onSubmit={handleAddReply}
                        title="Add Reply"
                        placeholder="Write your reply..."
                        submitButtonText="Post Reply"
                        isLoading={isSubmittingReply}
                    />
                </div>
            </div>
        </div>
    );
};

export default Posts;