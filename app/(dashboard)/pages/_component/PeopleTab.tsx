// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useAuthenticatedApi } from '@/context/AuthContext'

interface PeopleTabProps {
  pageId: string;
  creatorId?: string;
}

interface PageMember {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  role?: string;
  location?: string;
}

const PeopleTab: React.FC<PeopleTabProps> = ({ pageId, creatorId }) => {
  const [pageMembers, setPageMembers] = useState<PageMember[]>([]);
  const [pageCreatorId, setPageCreatorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { api } = useAuthenticatedApi();

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        // Fetch both page members and page details
        const [membersResponse, pageDetailsResponse] = await Promise.all([
          api.get(`/post/app/pages-followers/?page_id=${pageId}`),
          api.get(`/post/app/page/?page_id=${pageId}`)
        ]);
        
        const creatorUserId = pageDetailsResponse.data?.creator;
        const followers = membersResponse.data || [];
        
        setPageCreatorId(creatorUserId);
        
        // Filter out creator from followers to avoid duplicates
        const followersWithoutCreator = followers.filter((member: PageMember) => member.id !== creatorUserId);
        
        if (creatorUserId) {
          // Fetch creator's profile information
          try {
            const creatorResponse = await api.get(`/freelancer/freelancer-details/?id=${creatorUserId}`);
            
            // Add creator to the beginning of the members list
            const creatorLocation = [
              creatorResponse.data.city,
              creatorResponse.data.state
            ].filter(Boolean).join(', ');
            
            const creatorMember: PageMember = {
              id: creatorUserId, // Use the creator user ID, not the profile ID
              first_name: creatorResponse.data.first_name || 'Admin',
              last_name: creatorResponse.data.last_name || '',
              profile_picture: creatorResponse.data.profile_picture || '',
              role: 'Page Admin',
              location: creatorLocation || undefined
            };
            
            // Filter out followers with the same name as creator to avoid showing duplicates
            const uniqueFollowers = followersWithoutCreator.filter((f: PageMember) => {
              const followerName = `${f.first_name} ${f.last_name}`.toLowerCase();
              const creatorName = `${creatorMember.first_name} ${creatorMember.last_name}`.toLowerCase();
              return followerName !== creatorName;
            });
            
            // Add creator first, then unique followers
            setPageMembers([creatorMember, ...uniqueFollowers]);
          } catch (error) {
            console.error('Error fetching creator profile:', error);
            // If we can't fetch creator profile, just show all followers
            setPageMembers(followers);
          }
        } else {
          setPageMembers(followers);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching page data:', error);
        setLoading(false);
      }
    };

    if (pageId) {
      fetchPageData();
    }
  }, [pageId]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Page Members</h2>
  
        {pageMembers.length === 0 ? (
          <p className="text-gray-500">No members found</p>
        ) : (
          pageMembers.map((member) => {
            const isCreator = (pageCreatorId && member.id === pageCreatorId) || (creatorId && member.id === creatorId);
            return (
              <div
                key={member.id}
                className={`flex items-center justify-between space-x-4 p-3 border rounded-lg ${isCreator ? 'border-purple-500 bg-purple-50' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  {member.profile_picture ? (
                    <img
                      src={member.profile_picture}
                      alt={`${member.first_name} ${member.last_name}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-lg">
                        {member.first_name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-base md:text-lg">{`${member.first_name} ${member.last_name}`}</p>
                    <div className="space-y-1">
                      {member.role && <p className="text-gray-500 text-sm">{member.role}</p>}
                      {member.location && <p className="text-gray-400 text-xs">📍 {member.location}</p>}
                    </div>
                  </div>
                </div>
  
                {isCreator && (
                  <div className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <span>👑</span>
                    <span>Admin</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
  
}

export default PeopleTab