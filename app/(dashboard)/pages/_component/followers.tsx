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
        // Fetch page followers
        const followersResponse = await api.get(`/post/app/page-followers/?page=${pageId}`);
        setFollowers(followersResponse.data);

        // Fetch page details
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
    <div>
      <div className="mb-6 rounded-lg border p-4 flex flex-col">
        <div className="div">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <BiLink className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium">Invitation link</h3>
            </div>
            <p className="text-gray-500">https://sjsfhHAD44iddioAR.com/</p>
          </div>
          <div>
            <div className="mb-2">
              <span className="font-medium">Website</span>
              <a 
                href={pageDetails?.website || '#'} 
                className="ml-2 text-purple-600"
              >
                {pageDetails?.website || 'Not provided'}
              </a>
            </div>
            <div>
              <span className="font-medium">Phone</span>
              <span className="ml-2 text-purple-600">
                {pageDetails?.phone_number || 'Not provided'}
              </span>
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
                    src={follower.profile_picture} 
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