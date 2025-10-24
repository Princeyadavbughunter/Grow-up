// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useAuthenticatedApi } from '@/context/AuthContext'
import Posts from '../../_components/Posts'

interface PostTabProps {
  pageId: string;
  pageName?: string;
  pageProfilePicture?: string;
}

const PostTab: React.FC<PostTabProps> = ({ pageId, pageName, pageProfilePicture }) => {
  const [pagePosts, setPagePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api } = useAuthenticatedApi();

  useEffect(() => {
    const fetchPagePosts = async () => {
      try {
        const response = await api.get(`/post/app/page-posts/?page=${pageId}`);
        // Enrich posts with page information and mark as page posts
        const enrichedPosts = response.data.map((post: any) => ({
          ...post,
          type: 'page_post',
          page_id: pageId,
          page: pageId,
          page_name: pageName || post.page_name,
          page_profile_picture: post.profile_picture || pageProfilePicture,
          profile_picture: post.profile_picture || pageProfilePicture,
        }));
        setPagePosts(enrichedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching page posts:', error);
        setLoading(false);
      }
    };

    if (pageId) {
      fetchPagePosts();
    }
  }, [pageId, pageName, pageProfilePicture]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className='flex flex-col justify-center w-full'>
      <Posts posts={pagePosts} />
    </div>
  )
}

export default PostTab