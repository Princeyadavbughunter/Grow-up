import React, { useState, useEffect } from 'react'
import { useAuthenticatedApi } from '@/context/AuthContext'

interface AboutTabProps {
  pageDetails: {
    id: string;
    description?: string;
    created_at?: string;
    location?: string;
    website?: string;
  };
}

const AboutTab: React.FC<AboutTabProps> = ({ pageDetails }) => {
  const [overview, setOverview] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const { api } = useAuthenticatedApi();

  useEffect(() => {
    const fetchAdditionalDetails = async () => {
      try {
        // You can add additional API calls here if needed
        setOverview(pageDetails.description || 'No overview available');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching page details:', error);
        setLoading(false);
      }
    };

    fetchAdditionalDetails();
  }, [pageDetails]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl text-gray-600 border p-4">
        <p className='font-semibold text-lg mb-3'>Overview</p>
        <p>{overview}</p>
        {overview.length > 200 && (
          <button className="text-[#7052FF] mt-2">See more</button>
        )}
      </div>

      <div className="rounded-xl text-gray-600 border p-4">
        <p className='font-semibold text-lg mb-3'>Additional Information</p>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Founded:</span>{' '}
            {pageDetails.created_at ? new Date(pageDetails.created_at).toLocaleDateString() : 'Not specified'}
          </div>
          <div>
            <span className="font-medium">Location:</span>{' '}
            {pageDetails.location || 'Not specified'}
          </div>
          <div>
            <span className="font-medium">Website:</span>{' '}
            {pageDetails.website ? (
              <a 
                href={pageDetails.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#7052FF]"
              >
                {pageDetails.website}
              </a>
            ) : 'Not specified'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutTab