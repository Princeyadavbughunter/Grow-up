// @ts-nocheck
'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';
import PostDetail from '../_components/PostDetail';
import { ArrowLeft } from 'lucide-react';

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
    page_name: string | null;
    page_id: string | null;
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
    freelancer_profile: string | null;
    is_liked?: boolean;
    link: string;
}

const PostDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const { api } = useAuthenticatedApi();
    const { authToken } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPostDetails = async () => {
            if (!authToken || !params.id) return;

            try {
                setLoading(true);
                const response = await api.get(`/post/app/post-chat-details/?id=${params.id}`);
                
                if (response.data.response && response.data.response.length > 0) {
                    setPost(response.data.response[0]);
                } else if (response.data && response.data.id) {
                    // Handle different response structure
                    setPost(response.data);
                } else {
                    setError('Post not found');
                }
            } catch (error) {
                console.error('Error fetching post details:', error);
                setError('Failed to load post details');
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [authToken, params.id]);

    const handleLikePost = useCallback(async (postId: string) => {
        if (!post) return;

        try {
            const response = await api.post(`/post/app/toggle-like/?post_id=${postId}`);
            const { post: updatedPost, is_like } = response.data;

            setPost(prevPost =>
                prevPost ? {
                    ...prevPost,
                    like_count: updatedPost.like_count,
                    is_liked: is_like
                } : null
            );
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    }, [post]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Post Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The post you are looking for does not exist.'}</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800">Post Details</h1>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="max-w-4xl h-[calc(100vh-15rem)] overflow-y-auto mx-auto px-4 py-6">
                <PostDetail post={post} onLike={handleLikePost} />
            </div>
        </div>
    );
};

export default PostDetailPage;
