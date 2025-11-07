// @ts-nocheck
'use client';
import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaUser } from 'react-icons/fa';
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
        return <PostTab pageId={pageDetails.id} pageName={pageDetails.name} pageProfilePicture={pageDetails.profile_picture} />; 
      case 'People':
        return <PeopleTab pageId={pageDetails.id} creatorId={pageDetails.creator} />;
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
    <div className="flex flex-col lg:flex-row gap-2 md:gap-4 mx-auto w-full h-full overflow-hidden">
      <div className="rounded-lg overflow-y-auto bg-white p-3 md:p-6 shadow-sm flex-1">

        {/* Mobile Back Button - Above profile picture */}
        <div className="mb-3 md:hidden">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-3"
          >
            <BsArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-4 mb-3">
            {/* Desktop Back Button - Hidden on mobile */}
            <button onClick={onBack} className="rounded-full p-2 hover:bg-gray-100 flex-shrink-0 hidden md:flex">
              <BsArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {pageDetails.profile_picture ? (
                <img
                  src={pageDetails.profile_picture}
                  alt={pageDetails.name}
                  className="h-12 w-12 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <FaUser className="h-6 w-6 text-gray-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold truncate">{pageDetails.name}</h1>
                <p className="text-sm text-gray-600 truncate">{pageDetails.description}</p>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-sm text-purple-600 font-medium">
                    {pageDetails.followers_count} followers
                  </p>
                  {pageDetails.location && (
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <IoLocationOutline className="h-4 w-4" />
                      <span className="truncate">{pageDetails.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {!pageDetails.is_admin && (
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pageDetails.is_following
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-[#7052FF] text-white hover:bg-[#5a42cc]'
                  }`}
                  onClick={handleFollowToggle}
                >
                  {pageDetails.is_following ? 'Unfollow' : 'Follow'}
                </button>
              )}
              <div className="flex gap-2">
                {pageDetails.social_links?.linkedin && <FaLinkedin className="h-5 w-5 text-gray-500 hover:text-blue-600 cursor-pointer" />}
                {pageDetails.social_links?.twitter && <FaTwitter className="h-5 w-5 text-gray-500 hover:text-blue-400 cursor-pointer" />}
                {pageDetails.social_links?.instagram && <FaInstagram className="h-5 w-5 text-gray-500 hover:text-pink-500 cursor-pointer" />}
                {pageDetails.social_links?.facebook && <FaFacebook className="h-5 w-5 text-gray-500 hover:text-blue-600 cursor-pointer" />}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex gap-2 md:gap-4 justify-center flex-nowrap overflow-x-auto">
          {['Home', 'About', 'Post', 'People'].map((tab) => (
            <button
              key={tab}
              className={`rounded-lg px-2 md:px-4 py-2 font-medium text-sm md:text-base ${
                activeTab === tab ? 'bg-gray-200 text-black' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mb-3 md:mb-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {renderTabContent()}
        </div>
      </div>

      <Followers pageId={pageDetails.id} />
    </div>
  );
};

export default ProfileView;