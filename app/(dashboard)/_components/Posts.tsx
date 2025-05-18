'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import Link from 'next/link';

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
    author: string;
    club: string;
    club_name: string;
    freelancer_profile: string;
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

const Posts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const { api } = useAuthenticatedApi();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/post/app/posts/');
                setPosts(response.data.response);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        if (authToken) {
            fetchPosts();
        }
    }, [authToken]);

    const handleLikePost = async (postId: string) => {
        try {
            await api.post(`/post/app/toggle-like/?post_id=${postId}`);
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post.id === postId 
                        ? { ...post, like_count: post.like_count + 1 } 
                        : post
                )
            );
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    return (
        <div className="p-4">
            {posts.map((post) => (
                <PostCard 
                    key={post.id} 
                    post={post} 
                    onLike={handleLikePost}
                />
            ))}
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

    return (
        <div className="bg-white rounded-xl p-4 mb-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <Link href={`/profile/${post.freelancer_profile}`} className="flex items-center gap-3">
                    <Image
                        src={post.profile_picture || "https://randomuser.me/portraits/men/2.jpg"}
                        alt="User"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div>
                        <h3 className="font-semibold">
                            {post.first_name || post.company_name || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-gray-500">{formattedDate}</p>
                    </div>
                </Link>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{post.club_name}</span>
            </div>

            <p className="mb-4">{post.title}</p>
            {post.content && <p className="mb-4">{post.content}</p>}
            
            {post.images && post.images.length > 0 && (
                <Image
                    src={post.images[0].file}
                    alt="Post"
                    width={800}
                    height={600}
                    className="rounded-xl mb-4"
                />
            )}

            <div className="flex items-center justify-between text-gray-500">
                <button 
                    className="flex items-center gap-2"
                    onClick={() => onLike(post.id)}
                >
                    <span>❤️</span>
                    <span>{post.like_count}</span>
                </button>
                <button 
                    className="flex items-center gap-2"
                    onClick={handleCommentToggle}
                >
                    <span>💬</span>
                    <span>{post.comment_count}</span>
                </button>
                <button>
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
                            className="flex-1 border rounded-lg px-3 py-2"
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
        <div className="border-l-2 border-gray-200 pl-4">
            <div className="flex items-start gap-3">
                <Image
                    src={comment.profile_picture || "https://randomuser.me/portraits/men/2.jpg"}
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

                    {showReplies && replies.length > 0 && (
                        <div className="mt-2 space-y-3">
                            {replies.map(reply => (
                                <div key={reply.id} className="flex items-start gap-2">
                                    <Image
                                        src={reply.profile_picture || "https://randomuser.me/portraits/men/2.jpg"}
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