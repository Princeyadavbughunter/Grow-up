// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUser } from 'react-icons/fi';
import { MessageSquare, FileText, Users, Heart, Share, MoreVertical, Edit, Trash2 } from 'lucide-react';
import SharePopup from '../post/_components/SharePopup';
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

interface ImageData {
    id: string;
    file: string;
    author: string;
    uploaded_at: string;
}

interface Post {
    type: 'user_post' | 'page_post';
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
    author: string;
    club?: string;
    club_id?: string;
    club_name?: string;
    freelancer_profile: string | null;
    is_liked?: boolean;
    link?: string;
    likes_count?: number;
    comments?: any[];
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
    posts?: Post[];
}

const Posts = ({ posts: propPosts }: PostsProps = {}) => {
    const [posts, setPosts] = useState<Post[]>(propPosts || []);
    const [loading, setLoading] = useState<boolean>(!propPosts);
    const [error, setError] = useState<string | null>(null);
    const { api } = useAuthenticatedApi();
    const { authToken, userId } = useAuth();

    useEffect(() => {
        // Only fetch posts if not provided via props
        if (propPosts) {
            setPosts(propPosts);
            setLoading(false);
            return;
        }

        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get('/post/app/posts/');
                setPosts(response.data.results || []);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Failed to load posts. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchPosts();
        }
    }, [authToken, propPosts]);

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

    const handleDeletePost = async (postId: string) => {
        try {
            await api.delete(`/post/app/post-creation/?id=${postId}`);
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
            toast.success('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Failed to delete post');
        }
    };

    if (loading) {
        return (
            <div className="px-0 py-4 h-[calc(100vh-18rem)] overflow-y-scroll">
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl px-4 py-4 shadow-lg animate-pulse mx-0">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                </div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
                            <div className="flex items-center gap-4">
                                <div className="h-6 bg-gray-200 rounded w-12"></div>
                                <div className="h-6 bg-gray-200 rounded w-12"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-0 py-4 h-[calc(100vh-18rem)] overflow-y-scroll">
                <EmptyState
                    variant="error"
                    title="Unable to load posts"
                    description={error}
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="px-0 py-4 h-[calc(100vh-18rem)] overflow-y-scroll">
                <EmptyState
                    icon={<FileText className="w-6 h-6 text-gray-400" />}
                    title="No posts yet"
                    description="Be the first to share something with your community! Create a post to start the conversation."
                    action={
                        <Link
                            href="/create-post"
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Create First Post
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="px-0 py-4 h-[calc(100vh-18rem)] overflow-y-scroll">
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLikePost}
                    onDelete={handleDeletePost}
                    currentUserId={userId}
                />
            ))}
        </div>
    );
};

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onDelete: (postId: string) => void;
    currentUserId: string | null;
}

const PostCard = ({ post, onLike, onDelete, currentUserId }: PostCardProps) => {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { api } = useAuthenticatedApi();
    const router = useRouter();
    const formattedDate = formatTimeAgo(post.created_at);

    // Check if current user is the post owner
    const isOwner = currentUserId === post.author;

    // Helper function to safely get hostname from URL
    const getHostname = (url: string) => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return url;
        }
    };

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

    // Determine the profile link based on whether it's a page post or user post
    const profileLink = post.type === 'page_post'
        ? `/pages` // For now, link to pages list. You might want to create a page detail route
        : post.freelancer_profile 
            ? `/profile/${post.freelancer_profile}`
            : '#';
    
    // Determine the profile picture based on post type
    const profilePicture = post.type === 'page_post' 
        ? post.page_profile_picture 
        : post.profile_picture;
    
    // Determine the display name based on post type
    const displayName = post.type === 'page_post'
        ? post.page_name
        : post.first_name || post.company_name || 'Anonymous';

    const handleDelete = () => {
        onDelete(post.id);
        setShowDeleteDialog(false);
    };

    const handleEdit = () => {
        // Navigate to edit page - you can adjust the route as needed
        const clubId = post.club || post.club_id;
        if (clubId) {
            router.push(`/create-post?edit=${post.id}&clubId=${clubId}`);
        } else {
            router.push(`/create-post?edit=${post.id}`);
        }
    };

    return (
        <div className="bg-white rounded-xl px-4 py-4 mb-4 shadow-lg mx-0">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                    {(post.type === 'page_post' || post.freelancer_profile) ? (
                        <Link href={profileLink} className="flex items-center gap-3">
                            <div>
                                {profilePicture ? (
                                    <Image
                                        src={profilePicture}
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
                                    {displayName}
                                </h3>
                                <p className="text-sm text-gray-500">{formattedDate}</p>
                            </div>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div>
                                {profilePicture ? (
                                    <Image
                                        src={profilePicture}
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
                                    {displayName}
                                </h3>
                                <p className="text-sm text-gray-500">{formattedDate}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {post.type === 'user_post' && post.club_name && (
                        <Link
                            href={`/clubs/${post.club || post.club_id}`}
                            className="text-xs sm:text-sm bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors cursor-pointer whitespace-nowrap"
                        >
                            {post.club_name}
                        </Link>
                    )}
                    {isOwner && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <MoreVertical className="w-5 h-5 text-gray-600" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Post
                                </DropdownMenuItem>
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
            />

            {/* Post Content */}
            <div className="mb-4">
                <Link href={`/post/${post.id}`} className="block">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                        {post.title}
                    </h2>
                </Link>
                
                {post.content && (
                    <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-3">
                        {post.content}
                    </p>
                )}

                {/* Link Preview */}
                {post.link && (
                    <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-3 py-2 mb-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
                    >
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <div className="flex flex-col items-start min-w-0">
                            <span className="text-xs text-blue-600 font-medium group-hover:underline">
                                {getHostname(post.link)}
                            </span>
                            {/* <span className="text-xs text-gray-500 truncate max-w-[250px]">
                                {post.link}
                            </span> */}
                        </div>
                    </a>
                )}

                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                    <Link href={`/post/${post.id}`} className="block">
                        <Image
                            src={post.images[0].file}
                            alt="Post"
                            width={800}
                            height={600}
                            className="rounded-xl w-full h-auto object-cover hover:opacity-95 transition-opacity"
                        />
                    </Link>
                )}
            </div>

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
                            {replies.length > 0 ? (
                                replies.map(reply => (
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
};

export default Posts;