// @ts-nocheck
'use client';
import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaUser } from 'react-icons/fa';
import { BsArrowLeft } from 'react-icons/bs';
import { IoLocationOutline } from 'react-icons/io5';
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';
import FollowersSection from './followers';
import HomeTab from './HomeTab';
import AboutTab from './AboutTab';
import PostTab from './PostTab';
import PeopleTab from './PeopleTab';
import { FiEdit2, FiLink, FiBell } from 'react-icons/fi';
import { RiUserFollowLine } from 'react-icons/ri';

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
        return <PostTab pageId={pageDetails.id} pageName={pageDetails.name} pageProfilePicture={pageDetails.profile_picture} isAdmin={pageDetails.is_admin} />;
      case 'Job':
        return <div className="w-full p-10 text-center text-gray-400 font-medium bg-[#F8FAFB] rounded-2xl border border-dashed border-gray-200">No jobs posted yet.</div>;
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
    <div className="flex flex-col lg:flex-row gap-8 w-full h-full bg-white">
      {/* Main Content Area (Independent Scroll) */}
      <div className="flex-1 h-full overflow-y-auto scrollbar-hide">
        <div className="max-w-4xl mx-auto px-6 py-8">

          {/* Profile Header (Responsive Left/Center Alignment) */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 -mt-2">
            {/* Back Button (Absolute on mobile) */}
            <button onClick={onBack} className="md:relative p-2 text-gray-400 hover:text-gray-900 transition-colors flex-shrink-0 mt-3 self-start md:self-auto">
              <BsArrowLeft className="h-6 w-6" />
            </button>

            <div className="flex items-start gap-6 flex-1">
              {/* Profile Photo (Circular) */}
              <div className="relative flex-shrink-0">
                {pageDetails.profile_picture ? (
                  <div className="h-20 w-20 rounded-full overflow-hidden ring-1 ring-gray-100 shadow-sm">
                    <img src={pageDetails.profile_picture} alt={pageDetails.name} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center ring-1 ring-gray-100 shadow-sm text-gray-300">
                    <FaUser className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* Info Column */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h1 className="text-[16px] font-semibold text-gray-900 leading-tight font-poppins mb-1" style={{ fontWeight: 600 }}>
                      {pageDetails.name}
                    </h1>
                    <p className="text-[14px] text-gray-500 font-poppins leading-tight mb-2 max-w-lg" style={{ fontWeight: 400 }}>
                      {pageDetails.description || 'No description provided.'}
                    </p>
                    <div className="flex flex-col items-center md:items-start gap-1 mb-6">
                      {pageDetails.location && (
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <IoLocationOutline className="h-4 w-4" />
                          <span className="text-xs font-medium">{pageDetails.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-[#7052FF]">
                        <span className="font-bold text-xs">
                          {pageDetails.followers_count >= 1000 ? `${(pageDetails.followers_count / 1000).toFixed(1)}k` : pageDetails.followers_count}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider">followers</span>
                      </div>
                    </div>

                    {/* Follow Action */}
                    {!pageDetails.is_admin && (
                      <button
                        onClick={handleFollowToggle}
                        className={`flex items-center gap-2 px-10 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${pageDetails.is_following
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-[#7052FF] text-white hover:bg-[#5a42cc] hover:shadow-md'
                          }`}
                      >
                        <RiUserFollowLine className="h-4 w-4" />
                        {pageDetails.is_following ? 'Unfollow' : 'Follow'}
                      </button>
                    )}
                  </div>

                  {/* Edit Icon (Absolute on mobile) */}
                  {pageDetails.is_admin && (
                    <button className="md:relative p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 flex-shrink-0">
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation & Content Group (Responsive Margins & Width) */}
          <div className="ml-0 md:ml-12 lg:ml-[7.5rem] w-full max-w-[600px] px-4 md:px-0">
            {/* Navigation Tabs */}
            <div className="flex items-center justify-start gap-4 mb-12 overflow-x-auto scrollbar-hide py-2">
              {['Home', 'About', 'Post', 'Job', 'People'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                    ? 'bg-gray-800 text-white shadow-md scale-105'
                    : 'bg-[#F2F4F7] text-gray-500 hover:bg-gray-200'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content Area (Synchronized 600px Width) */}
            <div className="pt-4 min-h-[514px] w-full">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar (Responsive Stacking) */}
      <div className="w-full lg:w-[320px] h-full bg-white border-t lg:border-t-0 lg:border-l border-gray-50 px-6 md:px-8 py-10 lg:overflow-y-auto scrollbar-hide">
        {/* Social Links */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-10">
            {[
              { icon: FaLinkedin, link: pageDetails.social_links?.linkedin },
              { icon: FaTwitter, link: pageDetails.social_links?.twitter },
              { icon: FaInstagram, link: pageDetails.social_links?.instagram },
              { icon: FaFacebook, link: pageDetails.social_links?.facebook }
            ].map((social, i) => (
              social.link && (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[#999999] rounded-xl flex items-center justify-center text-white hover:bg-gray-700 hover:scale-110 transition-all shadow-sm"
                >
                  <social.icon className="h-6 w-6" />
                </a>
              )
            ))}
            {(!pageDetails.social_links || Object.keys(pageDetails.social_links).length === 0) && (
              <p className="text-gray-400 text-sm italic">No social links added</p>
            )}
          </div>

          {/* Invitation Link */}
          <div className="space-y-3 group cursor-pointer">
            <div className="flex items-center gap-3 text-gray-900 font-bold text-xl">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white group-hover:bg-[#7052FF] transition-colors shadow-md">
                <FiLink className="h-6 w-6" />
              </div>
              <span>Invitation link</span>
            </div>
            <p className="text-sm text-gray-400 break-all px-1 font-medium group-hover:text-[#7052FF] transition-colors">
              https://growupbuddy.com/pages/{pageDetails.id}
            </p>
          </div>
        </div>

        {/* Followers List Sidebar */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Followers</h2>
          <FollowersSection pageId={pageDetails.id} mode="sidebar" />
        </div>
      </div>
    </div>
  );
};

export default ProfileView;