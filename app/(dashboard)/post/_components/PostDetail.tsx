// @ts-nocheck
'use client';
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiUser } from 'react-icons/fi';
import { MessageSquare, Heart, Share } from 'lucide-react';
import { useAuthenticatedApi } from '@/context/AuthContext';
import SharePopup from './SharePopup';
import EmptyState from '@/components/ui/empty-state';
import { CommentModal } from '@/components/ui/comment-modal';

interface ImageData {
    id: string;
    file: string;
    author: string;
    uploaded_at: string;
}

interface Post {
    id: string;
    images: ImageData[];
    videos: any[];
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
    share_count: number;
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

interface PostDetailProps {
    post: Post;
    onLike: (postId: string) => void;
}

const PostDetail = memo(({ post, onLike }: PostDetailProps) => {
    const [showComments, setShowComments] = useState<boolean>(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [showSharePopup, setShowSharePopup] = useState<boolean>(false);
    const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);
    const { api } = useAuthenticatedApi();

    // Memoize formatted date to prevent recalculation on every render
    const formattedDate = useMemo(() =>
        new Date(post.created_at).toLocaleString(),
        [post.created_at]
    );

    // Memoize fetchComments function to prevent recreation on every render
    const fetchComments = useCallback(async () => {
        try {
            const response = await api.get(`/post/app/comments/?post_id=${post.id}`);
            setComments(response.data.response);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }, [api, post.id]);

    // Memoize handleCommentToggle to prevent recreation
    const handleCommentToggle = useCallback(() => {
        setShowComments(prev => {
            if (prev) {
                return false;
            } else {
                fetchComments();
                return true;
            }
        });
    }, [fetchComments]);

    // Memoize handleAddComment to prevent recreation
    const handleAddComment = useCallback(async (content: string) => {
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
    }, [api, post.id, fetchComments]);

    // Load comments on mount - only run when post.id changes
    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Post Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Link href={`/profile/${post.freelancer_profile}`} className="flex items-center gap-4">
                            <div>
                                {post.profile_picture ? (
                                    <Image
                                        src={post.profile_picture}
                                        alt="Profile"
                                        width={50}
                                        height={50}
                                        className="rounded-full w-12 h-12"
                                    />
                                ) : (
                                    <div className="rounded-full bg-gray-200 flex items-center justify-center w-12 h-12">
                                        <FiUser className="text-gray-600 w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    {post.first_name || post.company_name || 'Anonymous'}
                                </h3>
                                <p className="text-sm text-gray-500">{formattedDate}</p>
                            </div>
                        </Link>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Link
                            href={`/clubs/${post.club}`}
                            className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium hover:bg-green-200 transition-colors cursor-pointer"
                        >
                            {post.club_name}
                        </Link>
                        {post.link && (
                            <a 
                                href={post.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-sm text-blue-500 hover:text-blue-700 underline break-all max-w-xs text-right"
                            >
                                {post.link}
                            </a>
                        )}
                    </div>
                </div>

                {/* Post Title and Content */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">{post.title}</h2>
                    {post.content && (
                        <p className="text-gray-700 text-lg leading-relaxed">{post.content}</p>
                    )}
                </div>

                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                    <div className="mb-6">
                        <div className="space-y-4">
                            {post.images.map((image, index) => (
                                <div key={image.id} className="relative w-full">
                                    <Image
                                        src={image.file}
                                        alt={`Post image ${index + 1}`}
                                        width={800}
                                        height={600}
                                        className="rounded-xl w-full h-auto object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Post Videos */}
                {post.videos && post.videos.length > 0 && (
                    <div className="mb-6">
                        <div className="grid grid-cols-1 gap-4">
                            {post.videos.map((video, index) => (
                                <video 
                                    key={video.id || index} 
                                    src={video.file} 
                                    controls 
                                    className="rounded-xl w-full"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center gap-4 text-gray-500 pt-4 border-t border-gray-200">
                    <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            post.is_liked
                                ? 'text-red-500 bg-red-50'
                                : 'text-gray-500 hover:bg-gray-100'
                        }`}
                        onClick={() => onLike(post.id)}
                    >
                        <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                        <span className="font-medium">{post.like_count}</span>
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={handleCommentToggle}
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-medium">{post.comment_count}</span>
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setShowSharePopup(true)}
                    >
                        <Share className="w-5 h-5" />
                        <span className="font-medium">{post.share_count}</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Comments</h3>

                    {/* Scrollable Comments Container */}
                    <div className="max-h-96 overflow-y-auto mb-6">
                        {/* Comments List */}
                        <div className="space-y-6">
                            {comments.length > 0 ? (
                                comments.map(comment => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        api={api}
                                    />
                                ))
                            ) : (
                                <EmptyState
                                    icon={<MessageSquare className="w-5 h-5 text-gray-400" />}
                                    title="No comments yet"
                                    description="Be the first to share your thoughts on this post."
                                    className="py-4"
                                />
                            )}
                        </div>
                    </div>

                    {/* Add Comment Section - Fixed at bottom */}
                    <div className="border-t border-gray-200 pt-4">
                        <button
                            onClick={() => setShowCommentModal(true)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-left text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            Add a comment...
                        </button>
                    </div>
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
});

PostDetail.displayName = 'PostDetail';

interface CommentItemProps {
    comment: Comment;
    api: any;
}

const CommentItem = memo(({ comment, api }: CommentItemProps) => {
    const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
    const [replies, setReplies] = useState<CommentReply[]>([]);
    const [showReplies, setShowReplies] = useState<boolean>(false);
    const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
    const [isSubmittingReply, setIsSubmittingReply] = useState<boolean>(false);

    // Memoize formatted date
    const formattedDate = useMemo(() =>
        new Date(comment.created_at).toLocaleString(),
        [comment.created_at]
    );

    // Memoize fetchReplies function
    const fetchReplies = useCallback(async () => {
        try {
            const response = await api.get(`/post/app/comments-replies/?id=${comment.id}`);
            setReplies(response.data.response);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    }, [api, comment.id]);

    // Memoize handleReplyToggle
    const handleReplyToggle = useCallback(() => {
        setShowReplies(prev => {
            if (prev) {
                return false;
            } else {
                if (comment.comment_reply_count > 0) {
                    fetchReplies();
                }
                return true;
            }
        });
    }, [comment.comment_reply_count, fetchReplies]);

    // Memoize handleAddReply
    const handleAddReply = useCallback(async (content: string) => {
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
    }, [api, comment.id, fetchReplies]);

    return (
        <div className="border-l-2 sm:border-l-4 border-gray-200 pl-3 sm:pl-4">
            <div className="flex items-start gap-3">
                <Image
                    src={comment.profile_picture || "https://randomuser.me/portraits/men/2.jpg"}
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-800">
                            {comment.first_name || comment.company_name || 'Anonymous'}
                        </h4>
                        <span className="text-sm text-gray-500">{formattedDate}</span>
                    </div>
                    <p className="text-gray-700 mb-3 break-words">{comment.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button 
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="hover:text-blue-500 transition-colors"
                        >
                            Reply
                        </button>
                        {comment.comment_reply_count > 0 && (
                            <button 
                                onClick={handleReplyToggle}
                                className="hover:text-blue-500 transition-colors"
                            >
                                {showReplies ? 'Hide replies' : `View ${comment.comment_reply_count} replies`}
                            </button>
                        )}
                    </div>

                    {showReplyForm && (
                        <button
                            onClick={() => setShowReplyModal(true)}
                            className="mt-3 text-sm bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            Add a reply...
                        </button>
                    )}

                    {showReplies && (
                        <div className="mt-4 space-y-4">
                            {replies.length > 0 ? (
                                replies.map(reply => (
                                    <div key={reply.id} className="flex items-start gap-3 ml-4 sm:ml-6 pl-3 sm:pl-4 border-l-2 border-gray-100">
                                        <Image
                                            src={reply.profile_picture || "https://randomuser.me/portraits/men/2.jpg"}
                                            alt="User"
                                            width={32}
                                            height={32}
                                            className="rounded-full w-8 h-8 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h5 className="font-medium text-sm text-gray-800">
                                                    {reply.first_name || reply.company_name || 'Anonymous'}
                                                </h5>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(reply.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 break-words">{reply.content}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="ml-4 sm:ml-6 pl-3 sm:pl-4">
                                    <EmptyState
                                        icon={<MessageSquare className="w-4 h-4 text-gray-400" />}
                                        title="No replies yet"
                                        description="Start a conversation by replying to this comment."
                                        className="py-2"
                                    />
                                </div>
                            )}
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
});

CommentItem.displayName = 'CommentItem';

export default PostDetail;
