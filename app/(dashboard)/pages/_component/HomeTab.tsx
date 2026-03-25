// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useAuthenticatedApi } from '@/context/AuthContext'
import { formatTimeAgo } from '@/lib/utils'

interface HomeTabProps {
  pageId: string;
}

interface PagePost {
  id: string;
  title: string;
  content: string;
  images?: { file: string }[];
  created_at: string;
}

const HomeTab: React.FC<HomeTabProps> = ({ pageId }) => {
  const [pageDescription, setPageDescription] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [pagePosts, setPagePosts] = useState<PagePost[]>([]);
  const [loading, setLoading] = useState(true);

  const { api } = useAuthenticatedApi();

  useEffect(() => {
    const fetchPageDetails = async () => {
      try {
        const pageResponse = await api.get(`/post/app/page-details/?id=${pageId}`);
        const pageData = pageResponse.data;

        setPageDescription(pageData.description || 'No description available');
        
        const postsResponse = await api.get(`/post/app/page-posts/?page=${pageId}`);
        setPagePosts(postsResponse.data);

        setWebsite(pageData.website || 'Not provided');
      } catch (error) {
        console.error('Error fetching page details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      fetchPageDetails();
    }
  }, [pageId]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className='flex flex-col gap-10 w-full'>
      {/* Description Box */}
      <div className="rounded-2xl bg-[#F8FAFB] text-gray-700 p-8 leading-relaxed relative overflow-hidden">
        <p className="text-base">
          {pageDescription}
          {pageDescription.length > 300 && '...'}
        </p>
        {pageDescription.length > 300 && (
          <button className="text-gray-900 font-bold mt-2 hover:underline inline-flex items-center">
            See more
          </button>
        )}
      </div>

      {/* Info Card (Website & Phone) */}
      <div className="rounded-[32px] border border-gray-100 p-8 space-y-6 bg-white shadow-sm w-full">
        <div className="space-y-1">
          <p className="text-sm font-bold text-gray-900">Website</p>
          <a
            href={website.startsWith('http') ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7052FF] font-medium hover:underline block truncate"
          >
            {website === 'Not provided' ? 'ptai.in' : website}
          </a>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-bold text-gray-900">Phone</p>
          <p className="text-[#7052FF] font-medium">
            8800569545
          </p>
        </div>
      </div>

    </div>
  )
}

export default HomeTab