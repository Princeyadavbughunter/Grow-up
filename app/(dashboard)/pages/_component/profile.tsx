// @ts-nocheck
'use client';
import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import { BsArrowLeft } from 'react-icons/bs';
import { IoLocationOutline } from 'react-icons/io5';
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';
import Followers from './followers';
import HomeTab from './HomeTab';
import AboutTab from './AboutTab';
import PostTab from './PostTab';
import PeopleTab from './PeopleTab';

interface PageDetails {
  id: string;
  name: string;
  description: string;
  profile_picture: string;
  cover_photo: string;
  followers_count: number;
  is_active: boolean;
  creator: string;
  location?: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  is_following: boolean;
  is_admin: boolean;
}

const ProfileView = ({ onBack, pageId }: { onBack: () => void, pageId?: string }) => {
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [pageDetails, setPageDetails] = useState<PageDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchPageDetails = async () => {
      try {
        setLoading(true);
        const endpoint = pageId 
          ? `/post/app/page/?page_id=${pageId}` 
          : '/post/app/page/';
        
        const response = await api.get(endpoint);
        const pageData = response.data;
        setPageDetails(pageData);
      } catch (error) {
        console.error('Error fetching page details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchPageDetails();
    }
  }, [authToken, pageId]);

  const handleFollowToggle = async () => {
    if (!pageDetails) return;

    try {
      const payload = {
        page_id: pageDetails.id,
      };

      await api.post('/post/app/pages-follow/', payload);
      setPageDetails(prev => prev ? {
        ...prev,
        is_following: !prev.is_following,
        followers_count: prev.is_following ? prev.followers_count - 1 : prev.followers_count + 1
      } : null);
    } catch (error) {
      console.error('Error toggling page follow:', error);
    }
  };

  const renderTabContent = () => {
    if (!pageDetails) return null;

    switch (activeTab) {
      case 'Home':
        return <HomeTab pageId={pageDetails.id} />;
      case 'About':
        return <AboutTab pageDetails={pageDetails} />;
      case 'Post':
        return <PostTab pageId={pageDetails.id} />; 
      case 'People':
        return <PeopleTab pageId={pageDetails.id} />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!pageDetails) {
    return <div className="text-center py-10">No page details found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col lg:flex-row gap-4 mx-auto w-full max-w-7xl">
      <div className="rounded-lg bg-white p-6 shadow-sm flex-1">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={onBack} className="rounded-full p-2 hover:bg-gray-100">
            <BsArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex flex-1 items-center gap-4">
            <img 
              src={pageDetails.profile_picture || '/white-room-logo.png'} 
              alt={pageDetails.name} 
              className="h-16 w-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{pageDetails.name}</h1>
              <p className="text-gray-600">{pageDetails.description}</p>
              {pageDetails.location && (
                <div className="flex items-center gap-2 text-gray-500">
                  <IoLocationOutline />
                  <span>{pageDetails.location}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
            {pageDetails.social_links?.linkedin && <FaLinkedin className="h-6 w-6 text-gray-500" />}
            {pageDetails.social_links?.twitter && <FaTwitter className="h-6 w-6 text-gray-500" />}
            {pageDetails.social_links?.instagram && <FaInstagram className="h-6 w-6 text-gray-500" />}
            {pageDetails.social_links?.facebook && <FaFacebook className="h-6 w-6 text-gray-500" />}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-lg text-purple-600">
            {pageDetails.followers_count} followers
          </p>
        </div>

        {!pageDetails.is_admin && (
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <button 
              className={`flex-1 rounded-lg py-3 ${
                pageDetails.is_following 
                  ? 'bg-gray-200 text-gray-700' 
                  : 'bg-[#7052FF] text-white'
              }`}
              onClick={handleFollowToggle}
            >
              {pageDetails.is_following ? 'Unfollow' : 'Follow'}
            </button>
            <button className="flex-1 rounded-lg border border-[#7052FF] py-3 text-[#7052FF]">
              Message
            </button>
          </div>
        )}

        <div className="mb-6 flex gap-4 justify-center flex-wrap">
          {['Home', 'About', 'Post', 'People'].map((tab) => (
            <button
              key={tab}
              className={`rounded-lg px-4 py-2 font-medium ${
                activeTab === tab ? 'bg-gray-200 text-black' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mb-6 overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>

      <Followers pageId={pageDetails.id} />
    </div>
  );
};

export default ProfileView;