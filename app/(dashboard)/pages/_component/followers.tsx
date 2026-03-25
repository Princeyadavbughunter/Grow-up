// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { BiLink } from 'react-icons/bi';
import { useAuthenticatedApi } from '@/context/AuthContext';

interface FollowersProps {
  pageId: string;
  mode?: 'sidebar' | 'default';
}

interface Follower {
  id: string;
  profile_picture: string;
  first_name: string;
  last_name: string;
  location?: string;
}

const Followers: React.FC<FollowersProps> = ({ pageId, mode = 'default' }) => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [pageDetails, setPageDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { api } = useAuthenticatedApi();

  useEffect(() => {
    const fetchFollowersAndPageDetails = async () => {
      try {
        const followersResponse = await api.get(`/post/app/pages-followers/?page_id=${pageId}`);
        setFollowers(followersResponse.data);

        const pageResponse = await api.get(`/post/app/page/?page_id=${pageId}`);
        setPageDetails(pageResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching followers and page details:', error);
        setLoading(false);
      }
    };

    if (pageId) {
      fetchFollowersAndPageDetails();
    }
  }, [pageId]);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="h-3 bg-gray-50 rounded w-32" />
          </div>
        </div>
      ))}
    </div>;
  }

  if (mode === 'sidebar') {
    return (
      <div className="space-y-6">
        {followers.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No followers yet</p>
        ) : (
          followers.map((follower) => (
            <div key={follower.id} className="flex items-center gap-4 transition-all hover:translate-x-1">
              <div className="h-14 w-14 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                <img 
                  src={follower.profile_picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                  alt={`${follower.first_name} ${follower.last_name}`} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate tracking-tight">{`${follower.first_name} ${follower.last_name}`}</h3>
                <p className="text-xs text-gray-400 truncate mt-0.5">{follower.location || 'Location not specified'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="hidden lg:block lg:w-80 overflow-y-auto flex-shrink-0">
      <div className="rounded-lg border p-4 flex flex-col bg-white">
        <div className="div">
          <div>
            <div className="mb-4 md:mb-2">
              <span className="font-medium text-gray-900">Website</span>
              <div className="mt-1">
                <a
                  href={pageDetails?.website || '#'}
                  className="text-[#7052FF] hover:underline text-sm break-words overflow-wrap-anywhere"
                  title={pageDetails?.website || ''}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pageDetails?.website || 'Not provided'}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="mb-6 text-xl font-bold text-gray-900 tracking-tight">Followers</h2>
          <div className="space-y-5">
            {followers.length === 0 ? (
              <p className="text-gray-500">No followers yet</p>
            ) : (
              followers.map((follower) => (
                <div key={follower.id} className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                    <img 
                      src={follower.profile_picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                      alt={`${follower.first_name} ${follower.last_name}`} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{`${follower.first_name} ${follower.last_name}`}</h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{follower.location || 'Location not specified'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Followers;