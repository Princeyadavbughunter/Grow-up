// @ts-nocheck
'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';
import PostDetail from '../_components/PostDetail';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

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
    freelancer_profile: string | null;
    is_liked?: boolean;
    link: string;
}

const PostDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { api } = useAuthenticatedApi();
    const { authToken } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Get query parameters
    const postType = searchParams.get('type');
    const pageId = searchParams.get('pageId');

    useEffect(() => {
        const fetchPostDetails = async () => {
            if (!authToken || !params.id) return;

            try {
                setLoading(true);
                setError(null);
                
                // Check if this is a page post based on query parameters
                if (postType === 'page' && pageId) {
                    // Fetch page posts for this page
                    try {
                        const pagePostResponse = await api.get(`/post/app/page-posts/?page=${pageId}`);
                        
                        if (pagePostResponse.data) {
                            let pagePosts = [];
                            
                            // Handle different response structures
                            if (Array.isArray(pagePostResponse.data)) {
                                pagePosts = pagePostResponse.data;
                            } else if (pagePostResponse.data.response && Array.isArray(pagePostResponse.data.response)) {
                                pagePosts = pagePostResponse.data.response;
                            }
                            
                            // Find the specific post by ID
                            const pagePost = pagePosts.find((p: any) => p.id === params.id);
                            
                            if (pagePost) {
                                const isLiked = pagePost.is_liked ?? pagePost.user_liked ?? pagePost.liked ?? false;
                                setPost({ 
                                    ...pagePost, 
                                    type: 'page_post', 
                                    is_liked: isLiked,
                                    like_count: pagePost.like_count ?? pagePost.likes_count ?? 0
                                });
                                return;
                            }
                        }
                        
                        setError('Post not found');
                    } catch (pagePostError: any) {
                        console.error('Error fetching page post:', pagePostError);
                        setError('Failed to load post details');
                    }
                } else {
                    // Fetch as a user post
                    try {
                        const response = await api.get(`/post/app/post-chat-details/?id=${params.id}`);
                        
                        if (response.data.response && response.data.response.length > 0) {
                            const postData = response.data.response[0];
                            const isLiked = postData.is_liked ?? postData.user_liked ?? postData.liked ?? false;
                            // Check if it's a page post and mark it accordingly
                            if (postData.page_id || postData.page) {
                                setPost({ 
                                    ...postData, 
                                    type: 'page_post', 
                                    is_liked: isLiked,
                                    like_count: postData.like_count ?? postData.likes_count ?? 0
                                });
                            } else {
                                setPost({ 
                                    ...postData, 
                                    type: 'user_post', 
                                    is_liked: isLiked,
                                    like_count: postData.like_count ?? postData.likes_count ?? 0
                                });
                            }
                            return;
                        } else if (response.data && response.data.id) {
                            // Handle different response structure
                            const postData = response.data;
                            const isLiked = postData.is_liked ?? postData.user_liked ?? postData.liked ?? false;
                            if (postData.page_id || postData.page) {
                                setPost({ 
                                    ...postData, 
                                    type: 'page_post', 
                                    is_liked: isLiked,
                                    like_count: postData.like_count ?? postData.likes_count ?? 0
                                });
                            } else {
                                setPost({ 
                                    ...postData, 
                                    type: 'user_post', 
                                    is_liked: isLiked,
                                    like_count: postData.like_count ?? postData.likes_count ?? 0
                                });
                            }
                            return;
                        }
                        
                        setError('Post not found');
                    } catch (userPostError: any) {
                        console.error('Error fetching user post:', userPostError);
                        setError('Failed to load post details');
                    }
                }
            } catch (error) {
                console.error('Error fetching post details:', error);
                setError('Failed to load post details');
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [authToken, params.id, postType, pageId]);

    const handleLikePost = useCallback(async (postId: string) => {
        if (!post) return;

        // Store the original state before optimistic update
        const originalLiked = post.is_liked;
        const originalCount = post.like_count;

        // Optimistic update - update UI immediately
        setPost(prevPost =>
            prevPost ? {
                ...prevPost,
                like_count: originalLiked ? originalCount - 1 : originalCount + 1,
                is_liked: !originalLiked
            } : null
        );

        try {
            // Check if this is a page post - they use a different endpoint
            const isPagePost = post.type === 'page_post' || post.page_id;
            
            let response;
            
            if (isPagePost) {
                // Page posts use the /page-like/ endpoint
                response = await api.post(`/post/app/page-like/?post_id=${postId}`);
            } else {
                // Regular user posts use /toggle-like/ endpoint
                response = await api.post(`/post/app/toggle-like/?post_id=${postId}`);
            }
            
            console.log('🔍 Like API Response:', {
                postType: isPagePost ? 'page_post' : 'user_post',
                fullResponse: response.data
            });
            
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
            
            console.log('✅ Parsed like data:', { likeCount, is_like });
            
            // Update with actual server response
            setPost(prevPost =>
                prevPost ? {
                    ...prevPost,
                    like_count: likeCount ?? (is_like ? originalCount + 1 : originalCount - 1),
                    is_liked: is_like
                } : null
            );
        } catch (error: any) {
            console.error('Error toggling like:', error);
            
            // Revert to original state on error
            setPost(prevPost =>
                prevPost ? {
                    ...prevPost,
                    like_count: originalCount,
                    is_liked: originalLiked
                } : null
            );
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
