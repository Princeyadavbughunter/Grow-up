// @ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { FaHeart, FaCommentDots, FaEye, FaShare } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

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
  // @ts-ignore
  const [posts, setPosts] = useState<PostType[]>([]);
  // @ts-ignore
  const [loading, setLoading] = useState<boolean>(true);
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
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getImageUrl = (path: string): string => {
    return path;
  };

  return (
    <div>
      <div className="mb-28">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-lg font-bold">Posts</h2>
          <div className="flex items-center gap-2">
            <CiEdit className="text-xl cursor-pointer" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading posts...</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white shadow-sm rounded-lg p-4 flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={getImageUrl(post.profile_picture)}
                      alt="Profile Picture"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-semibold">
                      {post.first_name} {post.last_name}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <HiDotsVertical className="text-gray-500 cursor-pointer" />
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
                
                <div className="flex flex-col gap-3">
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-gray-800">{post.content}</p>
                  
                  {/* Display images if available */}
                  {post.images && post.images.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {post.images.map((image) => (
                        <img 
                          key={image.id} 
                          src={getImageUrl(image.file)} 
                          alt="Post image" 
                          className="rounded-lg w-full object-cover max-h-80"
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Display videos if available */}
                  {post.videos && post.videos.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {post.videos.map((video, index) => (
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

                <div className="flex items-center justify-between mt-2 w-full">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-red-600">
                      <FaHeart />
                      <span>{post.like_count}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <FaCommentDots />
                      <span>{post.comment_count}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="flex items-center gap-1">
                      <FaEye />
                      <span>0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaShare />
                      <span>0</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Posted on {formatDate(post.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-4">
          <button className="text-blue-600 hover:underline">See more posts</button>
        </div>
      </div>
    </div>
  );
};

export default Posts;