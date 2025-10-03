// @ts-nocheck
import React, { useState } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { FaLinkedin, FaInstagramSquare, FaUserPlus, FaUserCheck, FaClock } from "react-icons/fa";
import { TiSocialFacebook, TiSocialTwitter } from "react-icons/ti";
import { FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { ImUsers } from "react-icons/im";
import { BsChatDots } from "react-icons/bs";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ProfileDataProps {
  profileData: {
    id: string;
    first_name: string;
    last_name: string;
    bio: string;
    profile_picture: string;
    address: string;
    city: string;
    state: string;
    skills: string;
    follower_count: number;
    github_account: string | null;
    dribble_account: string | null;
    figma_account: string | null;
    youtube_account: string | null;
    medium_account: string | null;
    facebook_account?: string | null;
    linkedin_account?: string | null;
    instagram_account?: string | null;
    twitter_account?: string | null;
    is_following: boolean;
    follow_request_sent: boolean;
    user: string;
  } | null;
}

const ProfileData: React.FC<ProfileDataProps> = ({ profileData }) => {
  const { api } = useAuthenticatedApi();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(profileData?.is_following || false);
  const [followRequestSent, setFollowRequestSent] = useState(profileData?.follow_request_sent || false);
  const [isLoading, setIsLoading] = useState(false);
  const { profileData: userProfileData } = useAuth();

  if (!profileData) {
    return <div>Loading profile data...</div>;
  }

  const { first_name, last_name, bio, profile_picture, address, city, state, skills, follower_count } = profileData;
  const skillsArray = skills ? skills.split(',') : [];
  const fullName = `${first_name} ${last_name}`;
  const location = `${address ? address + ', ' : ''}${city ? city + ', ' : ''}${state || ''}`;
  const profileImageUrl = profile_picture;

  const handleFollowAction = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (isFollowing) {
        await api.delete(`/freelancer/follow/?freelancer_id=${profileData.id}`);
        setFollowRequestSent(false);
      } else {
        // Send follow request or follow
        await api.post(`/freelancer/follow/?freelancer_id=${profileData.id}`);
        setFollowRequestSent(true);
      }
    } catch (error) {
      console.error('Error handling follow action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFollowButtonContent = () => {
    if (followRequestSent) {
      return {
        icon: <FaClock />,
        text: "Request Sent",
        className: "bg-yellow-600 hover:bg-yellow-700 text-white"
      };
    } else {
      return {
        icon: <FaUserPlus />,
        text: "Follow",
        className: "bg-[#7052FF] hover:bg-[#5a42cc] text-white"
      };
    }
  };

  const followButtonContent = getFollowButtonContent();

  const handleOpenInbox = () => {
    console.log('Opening inbox for user:', profileData.user);
    router.push(`/chat/${profileData.user}`);
  };

  return (
    <div className="py-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 py-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-gray-300 flex-shrink-0 flex items-center justify-center bg-gray-100">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FiUser className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
            <h3 className="font-medium text-xl sm:text-2xl">{fullName}</h3>
          </div>
          <p className="text-gray-600 text-sm sm:text-base mb-2">
            {bio || "Founder - Finzie | Ex Groww | BITS Pilani"}
          </p>
          <p className="text-gray-500 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1">
            <IoLocationSharp /> {location || "Lakshman Puri, Delhi"}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
          {skillsArray.length > 0 ? (
            skillsArray.map((skill, index) => (
              <span key={index} className="font-medium rounded-full px-3 py-1 text-xs sm:text-sm border bg-gray-50">
                {skill.trim()}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No skills added yet</span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-center sm:justify-start gap-4">
          {profileData.linkedin_account && (
            <a href={profileData.linkedin_account} target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={28} className="text-blue-600 hover:text-blue-800 transition-colors" />
            </a>
          )}
          {profileData.twitter_account && (
            <a href={profileData.twitter_account} target="_blank" rel="noopener noreferrer">
              <TiSocialTwitter size={32} className="text-blue-400 hover:text-blue-600 transition-colors" />
            </a>
          )}
          {profileData.instagram_account && (
            <a href={profileData.instagram_account} target="_blank" rel="noopener noreferrer">
              <FaInstagramSquare size={28} className="text-pink-600 hover:text-pink-800 transition-colors" />
            </a>
          )}
          {profileData.facebook_account && (
            <a href={profileData.facebook_account} target="_blank" rel="noopener noreferrer">
              <TiSocialFacebook size={28} className="text-blue-800 hover:text-blue-900 transition-colors" />
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start">
        {userProfileData?.id !== profileData.id && (
          isFollowing ? (
            <div className="flex flex-row gap-3">
              <Button
                onClick={handleFollowAction}
                disabled={isLoading}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium flex items-center gap-2 px-4 py-2 rounded w-full sm:w-auto transition-colors disabled:opacity-50"
              >
                <FaUserCheck />
                {isLoading ? "Loading..." : "Unfollow"}
              </Button>
              <Button
                onClick={handleOpenInbox}
                className="bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2 px-4 py-2 rounded w-full sm:w-auto transition-colors"
              >
                <BsChatDots /> Open Inbox
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button className="bg-[#7052FF] hover:bg-[#5a42cc] text-white font-medium flex items-center gap-2 px-4 py-2 rounded w-full sm:w-auto">
                <ImUsers /> {follower_count || 0} Followers
              </Button>
              <Button
                onClick={handleFollowAction}
                disabled={isLoading}
                className={`${followButtonContent.className} font-medium flex items-center gap-2 px-4 py-2 rounded w-full sm:w-auto transition-colors disabled:opacity-50`}
              >
                {followButtonContent.icon}
                {isLoading ? "Loading..." : followButtonContent.text}
              </Button>
            </div>
          )
        )}
        {userProfileData?.id === profileData.id && (
          <Button className="bg-[#7052FF] hover:bg-[#5a42cc] text-white font-medium flex items-center gap-2 px-4 py-2 rounded w-full sm:w-auto">
            <ImUsers /> {follower_count || 0} Followers
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileData;