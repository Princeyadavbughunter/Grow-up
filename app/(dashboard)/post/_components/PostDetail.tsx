// @ts-nocheck
'use client';
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUser } from 'react-icons/fi';
import { MessageSquare, MoreVertical, Trash2 } from 'lucide-react';
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';
import SharePopup from './SharePopup';
import { SafeImage } from '@/components/ui/safe-image';
import EmptyState from '@/components/ui/empty-state';
import { CommentModal } from '@/components/ui/comment-modal';
import { formatTimeAgo } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import { HeartIcon } from '@/components/ui/heart';  
import {UploadIcon} from "@/components/ui/upload";

interface ImageData {
    id: string;
    file: string;
    author: string;
    uploaded_at: string;
}

interface Post {
    type?: 'user_post' | 'page_post';
    id: string;
    images: ImageData[];
    videos: any[];
    profile_picture: string | null;
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
    company_logo: string | null;
    page_name: string | null;
    page_profile_picture: string | null;
    page_id: string | null;
    page?: string;
    role: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    is_take_down: boolean;
    like_count: number;
    comment_count: number;
    share_count?: number;
    author: string;
    club: string;
    club_name: string;
    clubs_data?: Array<{ id: string; name: string; description?: string }>;
    freelancer_profile: string | null;
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
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const { api } = useAuthenticatedApi();
    const { userId } = useAuth();
    const router = useRouter();

    // Check if current user is the post owner
    const isOwner = userId === post.author;

    // Helper function to safely get hostname from URL
    const getHostname = (url: string) => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return url;
        }
    };

    // Memoize formatted date to prevent recalculation on every render
    const formattedDate = useMemo(() =>
        formatTimeAgo(post.created_at),
        [post.created_at]
    );

    // Memoize fetchComments function to prevent recreation on every render
    const fetchComments = useCallback(async () => {
        try {
            // Check if this is a page post
            const isPagePost = post.type === 'page_post' || post.page_id;
            const endpoint = isPagePost 
                ? `/post/app/page-comments/?post_id=${post.id}`
                : `/post/app/comments/?post_id=${post.id}`;
            
            const response = await api.get(endpoint);
            setComments(response.data.response);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }, [post.id, post.type, post.page_id]);

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
            // Check if this is a page post
            const isPagePost = post.type === 'page_post' || post.page_id;
            const endpoint = isPagePost 
                ? '/post/app/page-comments/'
                : '/post/app/comments/';
            
            await api.post(endpoint, {
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
    }, [post.id, post.type, post.page_id, fetchComments]);

    // Load comments on mount - only run when post.id changes
    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // Determine the profile link based on whether it's a page post or user post
    const profileLink = post.type === 'page_post' || post.page_id
        ? `/pages` 
        : post.freelancer_profile 
            ? `/profile/${post.freelancer_profile}`
            : '#';
    
    // Determine the profile picture based on post type
    const profilePicture = post.type === 'page_post' || post.page_id
        ? post.page_profile_picture
        : post.profile_picture;

    const displayName = post.page_name || post.first_name || post.company_name || 'Anonymous';

    const handleDelete = useCallback(async () => {
        setIsDeleting(true);
        try {
            // Use PATCH to mark post as taken down (soft delete)
            const formData = new FormData();
            formData.append('title', post.title);
            formData.append('content', post.content || '');
            formData.append('is_take_down', 'true');
            
            if (post.link) {
                formData.append('link', post.link);
            }
            
            await api.patch(`/post/app/posts/?id=${post.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            toast.success('Post deleted successfully');
            setShowDeleteDialog(false);
            router.push('/'); // Redirect to home or feed after deletion
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Failed to delete post');
        } finally {
            setIsDeleting(false);
        }
    }, [post.id, post.title, post.content, post.link, api, router]);


    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Post Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                        {(post.type === 'page_post' || post.page_id || post.freelancer_profile) ? (
                            <Link href={profileLink} className="flex items-center gap-4">
                                <div>
                                    {profilePicture ? (
                                        <Image
                                            src={profilePicture}
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
                                        {displayName}
                                    </h3>
                                    <p className="text-sm text-gray-500">{formattedDate}</p>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div>
                                    {profilePicture ? (
                                        <Image
                                            src={profilePicture}
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
                                        {displayName}
                                    </h3>
                                    <p className="text-sm text-gray-500">{formattedDate}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Show club badge for user posts */}
                        {post.type === 'user_post' && post.club_name && (
                            <Link
                                href={`/clubs/${post.club}`}
                                className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium hover:bg-green-200 transition-colors cursor-pointer whitespace-nowrap"
                            >
                                {post.club_name}
                            </Link>
                        )}
                        {/* Show club badges for page posts */}
                        {post.type === 'page_post' && post.clubs_data && post.clubs_data.length > 0 && (
                            <>
                                {post.clubs_data.map((club) => (
                                    <Link
                                        key={club.id}
                                        href={`/clubs/${club.id}`}
                                        className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium hover:bg-green-200 transition-colors cursor-pointer whitespace-nowrap"
                                    >
                                        {club.name}
                                    </Link>
                                ))}
                            </>
                        )}
                        {isOwner && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <MoreVertical className="w-5 h-5 text-gray-600" />
                                    </button>
                                </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-red-600 focus:text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Post
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />

            {/* Post Title and Content */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>
                    {post.content && (
                        <p className="text-gray-700 text-base leading-relaxed mb-4 whitespace-pre-wrap">
                            {post.content}
                        </p>
                    )}

                    {/* Link Preview */}
                    {post.link && (
                        <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
                        >
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <div className="flex flex-col items-start min-w-0">
                                <span className="text-sm text-blue-600 font-medium group-hover:underline">
                                    {getHostname(post.link)}
                                </span>
                                <span className="text-xs text-gray-500 truncate w-full">
                                    {post.link}
                                </span>
                            </div>
                        </a>
                    )}
                </div>

                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                    <div className="mb-6">
                        <div className="space-y-4">
                            {post.images.map((image, index) => (
                                <div key={image.id} className="relative w-full">
                                    <SafeImage
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
                        onClick={() => onLike(post.id)}  title={`${post.is_liked ? "Unlike" : "Like"} this post`}
                        >
                          <HeartIcon
                            className="w-5 h-5"
                            filled={post.is_liked} // Add this prop
                          />
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
                        <UploadIcon size={20} />
                        {post.share_count !== undefined && (
                            <span className="font-medium">{post.share_count}</span>
                        )}
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
        formatTimeAgo(comment.created_at),
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
    }, [comment.id]);

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
    }, [comment.id, fetchReplies]);

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
                                                    {formatTimeAgo(reply.created_at)}
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
