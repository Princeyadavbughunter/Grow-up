import React, { useState, useEffect } from 'react'
import { useAuthenticatedApi } from '@/context/AuthContext'

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
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [pagePosts, setPagePosts] = useState<PagePost[]>([]);
  const [loading, setLoading] = useState(true);

  console.log(pageId);
  

  const { api } = useAuthenticatedApi();

  useEffect(() => {
    const fetchPageDetails = async () => {
      try {
        const pageResponse = await api.get(`/post/app/page/?page_id=${pageId}`);
        const pageData = pageResponse.data;
        
        setPageDescription(pageData.description || 'No description available');
        
        const postsResponse = await api.get(`/post/app/page-posts/?page=${pageId}`);
        setPagePosts(postsResponse.data);

        setWebsite(pageData.website || 'Not provided');
        setPhoneNumber(pageData.phone_number || 'Not provided');
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
    <div className='flex flex-col justify-center px-20'>
      <div className="rounded-xl bg-slate-50 text-gray-600 border p-4 mb-5">
        <p>{pageDescription}</p>
        {pageDescription.length > 200 && (
          <button className="text-[#7052FF] mt-2">See more</button>
        )}
      </div>

      <div className="rounded-xl border p-4 mb-5">
        <div className="mb-3">
          <p className="font-medium text-gray-700">Website</p>
          <p className='text-[#7052FF]'>{website}</p>
        </div>

        <div>
          <p className="font-medium text-gray-700">Phone</p>
          <p className='text-[#7052FF]'>{phoneNumber}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
        {pagePosts.length === 0 ? (
          <p className="text-gray-500">No posts yet</p>
        ) : (
          pagePosts.map((post) => (
            <div key={post.id} className="border rounded-xl p-4 mb-4">
              {post.images && post.images.length > 0 && (
                <img 
                  src={post.images[0].file} 
                  alt="Post image" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-2">{post.content}</p>
              <div className="text-sm text-gray-500">
                Posted on {new Date(post.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default HomeTab