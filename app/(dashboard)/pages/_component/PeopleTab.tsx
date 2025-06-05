import React, { useState, useEffect } from 'react'
import { useAuthenticatedApi } from '@/context/AuthContext'

interface PeopleTabProps {
  pageId: string;
}

interface PageMember {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  role: string;
}

const PeopleTab: React.FC<PeopleTabProps> = ({ pageId }) => {
  const [pageMembers, setPageMembers] = useState<PageMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { api } = useAuthenticatedApi();

  useEffect(() => {
    const fetchPageMembers = async () => {
      try {
        const response = await api.get(`/page/members/?page=${pageId}`);
        setPageMembers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching page members:', error);
        setLoading(false);
      }
    };

    if (pageId) {
      fetchPageMembers();
    }
  }, [pageId]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Page Members</h2>
      {pageMembers.length === 0 ? (
        <p className="text-gray-500">No members found</p>
      ) : (
        pageMembers.map((member) => (
          <div 
            key={member.id} 
            className="flex items-center space-x-4 p-3 border rounded-lg"
>
            <img 
              src={member.profile_picture} 
              alt={`${member.first_name} ${member.last_name}`} 
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-base md:text-lg">{`${member.first_name} ${member.last_name}`}</p>
              <p className="text-gray-500">{member.role}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default PeopleTab