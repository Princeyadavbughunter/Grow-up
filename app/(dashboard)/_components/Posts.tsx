'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

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
}

const Posts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const { api } = useAuthenticatedApi();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/post/app/post-creation/');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        if (authToken) {
            fetchPosts();
        }
    }, [authToken]);

    return (
        <div className="p-4">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
};

interface PostCardProps {
    post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
    const formattedDate = new Date(post.created_at).toLocaleString();

    return (
        <div className="bg-white rounded-xl p-4 mb-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
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
                </div>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Tech</span>
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
                <button className="flex items-center gap-2">
                    <span>❤️</span>
                    <span>{post.like_count}</span>
                </button>
                <button className="flex items-center gap-2">
                    <span>💬</span>
                    <span>{post.comment_count}</span>
                </button>
                <button className="flex items-center gap-2">
                    <span>👁️</span>
                    <span>46</span>
                </button>
                <button>
                    <span>📤</span>
                </button>
            </div>
        </div>
    );
};

export default Posts;