'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiUser } from 'react-icons/fi';
import { useAuthenticatedApi } from '@/context/AuthContext';
import SharePopup from './SharePopup';

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

const PostDetail = ({ post, onLike }: PostDetailProps) => {
    const [showComments, setShowComments] = useState(true);
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

    // Load comments on mount
    useEffect(() => {
        fetchComments();
    }, []);

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
                        <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                            {post.club_name}
                        </span>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {post.images.map((image, index) => (
                                <div key={image.id} className="relative">
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
                <div className="flex items-center justify-between text-gray-500 pt-4 border-t border-gray-200">
                    <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            post.is_liked 
                                ? 'text-red-500 bg-red-50' 
                                : 'text-gray-500 hover:bg-gray-100'
                        }`}
                        onClick={() => onLike(post.id)}
                    >
                        <span className="text-xl">❤️</span>
                        <span className="font-medium">{post.like_count}</span>
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={handleCommentToggle}
                    >
                        <span className="text-xl">💬</span>
                        <span className="font-medium">{post.comment_count}</span>
                    </button>
                    <button 
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setShowSharePopup(true)}
                    >
                        <span className="text-xl">📤</span>
                        <span className="font-medium">{post.share_count}</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Comments</h3>
                    
                    {/* Comments List */}
                    <div className="space-y-6 mb-6">
                        {comments.map(comment => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                api={api}
                            />
                        ))}
                    </div>

                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} className="flex gap-3">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
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

    return (
        <div className="border-l-4 border-gray-200 pl-4">
            <div className="flex items-start gap-3">
                <Image
                    src={comment.profile_picture || "https://randomuser.me/portraits/men/2.jpg"}
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full w-10 h-10"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-800">
                            {comment.first_name || comment.company_name || 'Anonymous'}
                        </h4>
                        <span className="text-sm text-gray-500">{formattedDate}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{comment.content}</p>
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
                        <form onSubmit={handleAddReply} className="mt-3 flex gap-2">
                            <input
                                type="text"
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                placeholder="Add a reply..."
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Reply
                            </button>
                        </form>
                    )}

                    {showReplies && (
                        <div className="mt-4 space-y-4">
                            {replies.map(reply => (
                                <div key={reply.id} className="flex items-start gap-3">
                                    <Image
                                        src={reply.profile_picture || "https://randomuser.me/portraits/men/2.jpg"}
                                        alt="User"
                                        width={32}
                                        height={32}
                                        className="rounded-full w-8 h-8"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h5 className="font-medium text-sm text-gray-800">
                                                {reply.first_name || reply.company_name || 'Anonymous'}
                                            </h5>
                                            <span className="text-xs text-gray-500">
                                                {new Date(reply.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{reply.content}</p>
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

export default PostDetail;
