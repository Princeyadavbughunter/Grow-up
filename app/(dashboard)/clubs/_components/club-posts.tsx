// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import Link from 'next/link';
import { FiUser } from 'react-icons/fi';
import SharePopup from '../../post/_components/SharePopup';
import { CommentModal } from '@/components/ui/comment-modal';
import { formatTimeAgo } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import { HeartIcon } from '@/components/ui/heart';
import {UploadIcon} from "@/components/ui/upload";
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
    type?: 'user_post' | 'page_post';
    id: string;
    images: ImageData[];
    videos: VideoType[];
    profile_picture: string | null;
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
    company_logo: string | null;
    page_name?: string | null;
    page_profile_picture?: string | null;
    page_id?: string | null;
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
    club: string;
    club_name: string;
    club_id?: string;
    clubs_data?: Array<{ id: string; name: string; description?: string }>;
    freelancer_profile: string | null;
    is_liked?: boolean;
    link?: string;
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
    clubId: string;
}

const Posts = ({ clubId }: PostsProps) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const { api } = useAuthenticatedApi();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get(`/post/app/post-creation/?club_id=${clubId}`);
                console.log('Club posts response:', response.data);
                
                // Handle different response structures
                const postsData = response.data.response || response.data.results || response.data || [];
                
                // Get liked posts from localStorage cache
                const likedPostsCache = JSON.parse(localStorage.getItem('likedPosts') || '{}');
                
                const normalizedPosts = (Array.isArray(postsData) ? postsData : []).map((post: any) => {
                    let isLiked = post.is_liked ?? post.user_liked ?? post.liked;
                    
                    // Fall back to localStorage cache if API doesn't provide it
                    if (isLiked === undefined && likedPostsCache[post.id] !== undefined) {
                        isLiked = likedPostsCache[post.id];
                    } else if (isLiked === undefined) {
                        isLiked = false;
                    }
                    
                    return {
                        ...post,
                        is_liked: isLiked,
                        like_count: post.like_count ?? post.likes_count ?? 0
                    };
                });
                setPosts(normalizedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchPosts();
        }
    }, [authToken, clubId]);

    const handleLikePost = async (postId: string) => {
        // Store the original state before optimistic update
        const originalPost = posts.find(p => p.id === postId);
        if (!originalPost) return;

        const originalLiked = originalPost.is_liked;
        const originalCount = originalPost.like_count;

        // Optimistic update - update UI immediately
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? { 
                        ...post, 
                        like_count: originalLiked ? originalCount - 1 : originalCount + 1,
                        is_liked: !originalLiked 
                    }
                    : post
            )
        );

        try {
            // Check if this is a page post - they use a different endpoint
            const isPagePost = originalPost.type === 'page_post' || originalPost.page_id || originalPost.page;
            
            let response;
            
            if (isPagePost) {
                // Page posts use the /page-like/ endpoint
                response = await api.post(`/post/app/page-like/?post_id=${postId}`);
            } else {
                // Regular user posts use /toggle-like/ endpoint
                response = await api.post(`/post/app/toggle-like/?post_id=${postId}`);
            }
            
            // Handle different response structures between endpoints
            let updatedPost, is_like, likeCount;
            
            if (response.data.post && response.data.is_like !== undefined) {
                updatedPost = response.data.post;
                is_like = response.data.is_like;
                likeCount = updatedPost.like_count ?? updatedPost.likes_count;
            } else if (response.data.page_post) {
                updatedPost = response.data.page_post;
                is_like = response.data.is_like ?? response.data.liked;
                likeCount = updatedPost.like_count ?? updatedPost.likes_count;
            } else if (response.data.like_count !== undefined) {
                likeCount = response.data.like_count;
                is_like = response.data.is_liked ?? response.data.is_like;
            } else {
                likeCount = response.data.like_count ?? response.data.likes_count;
                is_like = response.data.is_liked ?? response.data.is_like ?? response.data.liked;
            }
            
            // Update localStorage cache
            const likedPostsCache = JSON.parse(localStorage.getItem('likedPosts') || '{}');
            likedPostsCache[postId] = is_like;
            localStorage.setItem('likedPosts', JSON.stringify(likedPostsCache));
            
            // Update with actual server response
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            like_count: likeCount ?? (is_like ? originalCount + 1 : originalCount - 1),
                            is_liked: is_like
                        }
                        : post
                )
            );
        } catch (error: any) {
            console.error('Error toggling like:', error);
            
            // Check if this is a page post error
            const isPagePostError = error?.response?.data?.details?.includes('No Post matches') ||
                                   error?.response?.data?.error?.includes('No Post matches');
            
            if (isPagePostError && (originalPost.type === 'page_post' || originalPost.page_id)) {
                console.warn('⚠️ Page posts cannot be liked. Backend does not support liking page posts.');
            }
            
            // Revert to original state on error
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId
                        ? { 
                            ...post, 
                            like_count: originalCount,
                            is_liked: originalLiked 
                        }
                        : post
                )
            );
        }
    };

    const handleUpdateCommentCount = (postId: string, newCount: number) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? { ...post, comment_count: newCount }
                    : post
            )
        );
    };

    if (loading) {
        return <div className="text-center py-10">Loading posts...</div>;
    }

    return (
        <div className="p-4 space-y-4 h-[calc(100vh-18rem)] overflow-y-auto">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        onLike={handleLikePost}
                        onUpdateCommentCount={handleUpdateCommentCount}
                    />
                ))
            ) : (
                <div className="bg-[#F6F8FF] shadow-sm rounded-xl p-4 text-gray-500 text-center">
                    No posts available in this club. Be the first to post!
                </div>
            )}
        </div>
    );
};

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onUpdateCommentCount?: (postId: string, newCount: number) => void;
}

const PostCard = ({ post, onLike, onUpdateCommentCount }: PostCardProps) => {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [localCommentCount, setLocalCommentCount] = useState(post.comment_count);
    const { api } = useAuthenticatedApi();
    const formattedDate = formatTimeAgo(post.created_at);

    const fetchComments = async () => {
        try {
            // Check if this is a page post
            const isPagePost = post.type === 'page_post' || post.page_id;
            const endpoint = isPagePost 
                ? `/post/app/page-comments/?post_id=${post.id}`
                : `/post/app/comments/?post_id=${post.id}`;
            
            const response = await api.get(endpoint);
            const commentsData = response.data.response || response.data || [];
            setComments(commentsData);
            
            // Update comment count based on fetched comments
            if (Array.isArray(commentsData)) {
                setLocalCommentCount(commentsData.length);
                if (onUpdateCommentCount) {
                    onUpdateCommentCount(post.id, commentsData.length);
                }
            }
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
            await fetchComments();
            
            // Update local comment count
            const newCount = localCommentCount + 1;
            setLocalCommentCount(newCount);
            if (onUpdateCommentCount) {
                onUpdateCommentCount(post.id, newCount);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const getImageUrl = (path: string): string => {
        return path;
    };

    // Determine the profile link based on whether it's a page post or user post
    const profileLink = post.type === 'page_post' && post.page_id
        ? `/pages`
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
        : (post.first_name && post.last_name 
            ? `${post.first_name} ${post.last_name}` 
            : post.company_name || 'Anonymous');

    return (
        <div className="bg-white rounded-xl p-4 mb-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {(post.type === 'page_post' || post.freelancer_profile) ? (
                        <Link href={profileLink} className="flex items-center gap-3">
                            <div>
                                {profilePicture ? (
                                    <Image
                                        src={getImageUrl(profilePicture)}
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
                                        src={getImageUrl(profilePicture)}
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
                <div className="flex flex-col items-end gap-2">
                    {post.club_name && (
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{post.club_name}</span>
                    )}
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
                <div className="flex flex-col gap-3">
                    <h3 className="font-medium">{post.title}</h3>
                    {post.content && <p className="text-gray-800">{post.content}</p>}
                    
                    {/* Display images if available */}
                    {post.images && post.images.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 mt-2">
                            {post.images.map((image: ImageData) => (
                                <Image
                                    key={image.id}
                                    src={getImageUrl(image.file)}
                                    alt="Post image"
                                    width={800}
                                    height={600}
                                    className="rounded-lg w-full object-cover"
                                />
                            ))}
                        </div>
                    )}
                    
                    {/* Display videos if available */}
                    {post.videos && post.videos.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 mt-2">
                            {post.videos.map((video: VideoType, index: number) => (
                                <video 
                                    key={video.id || index} 
                                    src={getImageUrl(video.file)} 
                                    controls 
                                    className="rounded-lg w-full"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </Link>

            <div className="flex items-center gap-4 py-3 text-gray-500">
                <button
                    className={`flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors ${
                        post.is_liked ? 'text-red-500 bg-red-50' : 'text-gray-500'
                    }`}
                    onClick={() => onLike(post.id)}
                    title={`${post.is_liked ? "Unlike" : "Like"} this post`}
                    >
                      <HeartIcon
                        className="w-5 h-5"
                        filled={post.is_liked} // Add this prop
                      />
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
                    <UploadIcon size={20} />
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
                    src={getImageUrl(comment.profile_picture) || "https://randomuser.me/portraits/men/2.jpg"}
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
                                        src={getImageUrl(reply.profile_picture) || "https://randomuser.me/portraits/men/2.jpg"}
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