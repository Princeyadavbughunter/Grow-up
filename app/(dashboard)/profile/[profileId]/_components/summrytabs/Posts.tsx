// @ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { FaHeart, FaCommentDots, FaEye, FaShare } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import Link from 'next/link';
import SharePopup from '../../../../post/_components/SharePopup';
import { formatTimeAgo } from '@/lib/utils';

interface ImageType {
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

interface PostType {
  id: string;
  images: ImageType[];
  videos: VideoType[];
  profile_picture: string;
  first_name: string;
  last_name: string;
  company_name: string;
  company_logo: string;
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
  link?: string;
}

interface PostsProps {
  profileId?: string;
}

const Posts: React.FC<PostsProps> = ({ profileId }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      try {
        if (profileId) {
          const response = await api.get(`/post/app/freelancer-posts/?freelancer_id=${profileId}`);
          setPosts(response.data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authToken && profileId) {
      fetchPosts();
    }
  }, [authToken, profileId]);

  const formatDate = (dateString: string): string => {
    return formatTimeAgo(dateString);
  };

  const getImageUrl = (path: string): string => {
    return path;
  };

  return (
    <div className="p-4 mt-10 h-[calc(100vh-10rem)] overflow-y-scroll">
      {loading ? (
        <div className="text-center py-10">Loading posts...</div>
      ) : (
        <div>
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl p-4 mb-4 border border-gray-200 mx-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={post.profile_picture}
                    alt="Profile Picture"
                    className="rounded-full md:w-10 md:h-10 w-8 h-8"
                  />
                  <div>
                    <h3 className="font-semibold">
                      {post.first_name || post.company_name || 'Anonymous'}
                    </h3>
                    <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
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
                <p className="mb-4">{post.title}</p>
                {post.content && <p className="mb-4">{post.content}</p>}

                {post.images && post.images.length > 0 && (
                  <img
                    src={post.images[0].file}
                    alt="Post"
                    className="rounded-xl mb-4 w-full object-cover"
                  />
                )}
              </Link>

              <div className="flex items-center justify-between text-gray-500">
                <button className="flex items-center gap-2 text-red-600">
                  <FaHeart />
                  <span>{post.like_count}</span>
                </button>
                <button className="flex items-center gap-2 text-sm md:text-base">
                  <FaCommentDots />
                  <span>{post.comment_count}</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedPost(post);
                    setShowSharePopup(true);
                  }}
                  className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                >
                  <FaShare />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-4">
        <button className="text-blue-600 hover:underline">See more posts</button>
      </div>

      {/* Share Popup */}
      {selectedPost && (
        <SharePopup
          isOpen={showSharePopup}
          onClose={() => {
            setShowSharePopup(false);
            setSelectedPost(null);
          }}
          postId={selectedPost.id}
          postTitle={selectedPost.title}
        />
      )}
    </div>
  );
};

export default Posts;