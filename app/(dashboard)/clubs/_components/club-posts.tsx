// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import Link from 'next/link';
import { FiUser } from 'react-icons/fi';
import SharePopup from '../../post/_components/SharePopup';

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
                console.log(response.data.response);
                
                setPosts(response.data || []);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchPosts();
        }
    }, [authToken, clubId]);

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
}

const PostCard = ({ post, onLike }: PostCardProps) => {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [showSharePopup, setShowSharePopup] = useState(false);
    const { api } = useAuthenticatedApi();
    const formattedDate = new Date(post.created_at).toLocaleString();

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

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await api.post('/post/app/comments/', {
                post: post.id,
                content: newComment,
                is_take_down: "False"
            });

            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
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
                                {post.first_name && post.last_name 
                                    ? `${post.first_name} ${post.last_name}` 
                                    : post.company_name || 'Anonymous'}
                            </h3>
                            <p className="text-sm text-gray-500">{formattedDate}</p>
                        </div>
                    </Link>
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
                            className="text-sm text-blue-500 hover:text-blue-700 underline break-all max-w-xs text-right"
                        >
                            {post.link}
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
                                    className="rounded-lg w-full object-cover max-h-80"
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

            <div className="flex items-center justify-between mt-4 text-gray-500">
                <button
                    className={`flex items-center gap-2 ${post.is_liked ? 'text-red-500' : 'text-gray-500'}`}
                    onClick={() => onLike(post.id)}
                >
                    <span>❤️</span>
                    <span>{post.like_count}</span>
                </button>
                <button
                    className="flex items-center gap-2 text-sm md:text-base"
                    onClick={handleCommentToggle}
                >
                    <span>💬</span>
                    <span>{post.comment_count}</span>
                </button>
                <button
                    onClick={() => setShowSharePopup(true)}
                    className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                >
                    <span>📤</span>
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

                    <form onSubmit={handleAddComment} className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 border rounded-lg px-3 py-2 text-sm md:text-base"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                            Post
                        </button>
                    </form>
                </div>
            )}

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
    const [newReply, setNewReply] = useState('');
    const [replies, setReplies] = useState<CommentReply[]>([]);
    const [showReplies, setShowReplies] = useState(false);
    const formattedDate = new Date(comment.created_at).toLocaleString();

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

    const handleAddReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReply.trim()) return;

        try {
            await api.post('/post/app/comments-replies/', {
                comment: comment.id,
                content: newReply,
                is_take_down: "False"
            });

            setNewReply('');
            fetchReplies();
            setShowReplies(true);
            setShowReplyForm(false);
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const getImageUrl = (path: string): string => {
        return path;
    };

    return (
        <div className="border-l-2 border-gray-200 pl-4">
            <div className="flex items-start gap-3">
                <Image
                    src={getImageUrl(comment.profile_picture) || "https://randomuser.me/portraits/men/2.jpg"}
                    alt="User"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium">
                            {comment.first_name || comment.company_name || 'Anonymous'}
                        </h4>
                        <span className="text-xs text-gray-500">{formattedDate}</span>
                    </div>
                    <p className="text-sm mb-2">{comment.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <button onClick={() => setShowReplyForm(!showReplyForm)}>Reply</button>
                        {comment.comment_reply_count > 0 && (
                            <button onClick={handleReplyToggle}>
                                {showReplies ? 'Hide replies' : `View ${comment.comment_reply_count} replies`}
                            </button>
                        )}
                    </div>

                    {showReplyForm && (
                        <form onSubmit={handleAddReply} className="mt-2 flex gap-2">
                            <input
                                type="text"
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                placeholder="Add a reply..."
                                className="flex-1 border rounded-lg px-3 py-1 text-sm"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-3 py-1 text-sm rounded-lg"
                            >
                                Reply
                            </button>
                        </form>
                    )}

                    {showReplies && (
                        <div className="mt-2 space-y-3">
                            {replies.map(reply => (
                                <div key={reply.id} className="flex items-start gap-2">
                                    <Image
                                        src={getImageUrl(reply.profile_picture) || "https://randomuser.me/portraits/men/2.jpg"}
                                        alt="User"
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h5 className="font-medium text-xs">
                                                {reply.first_name || reply.company_name || 'Anonymous'}
                                            </h5>
                                            <span className="text-xs text-gray-500">
                                                {new Date(reply.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm">{reply.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Posts;