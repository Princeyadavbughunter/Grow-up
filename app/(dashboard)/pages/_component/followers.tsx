// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { BiLink } from 'react-icons/bi';
import { useAuthenticatedApi } from '@/context/AuthContext';

interface FollowersProps {
  pageId: string;
}

interface Follower {
  id: string;
  profile_picture: string;
  first_name: string;
  last_name: string;
  location?: string;
}

const Followers: React.FC<FollowersProps> = ({ pageId }) => {
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
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="hidden lg:block lg:w-80 overflow-y-auto flex-shrink-0">
      <div className="rounded-lg border p-4 flex flex-col bg-white">
        <div className="div">
          <div>
            <div className="mb-4 md:mb-2">
              <span className="font-medium">Website</span>
              <div className="mt-1">
                <a
                  href={pageDetails?.website || '#'}
                  className="text-purple-600 hover:underline text-sm break-words overflow-wrap-anywhere"
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
          <h2 className="mb-4 text-xl font-bold">Followers</h2>
          <div className="space-y-4">
            {followers.length === 0 ? (
              <p className="text-gray-500">No followers yet</p>
            ) : (
              followers.map((follower) => (
                <div key={follower.id} className="flex items-center gap-3">
                  <img 
                    src={follower.profile_picture || 'https://randomuser.me/portraits/thumb/men/1.jpg'}
                    alt={`${follower.first_name} ${follower.last_name}`} 
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{`${follower.first_name} ${follower.last_name}`}</h3>
                    <p className="text-gray-500">{follower.location || 'Location not specified'}</p>
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