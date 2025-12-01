// @ts-nocheck
import React, { useState, useEffect } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { FaLinkedin, FaInstagramSquare, FaUserPlus, FaUserCheck, FaClock, FaShareAlt } from "react-icons/fa";
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
    connection_count?: number;
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
  const [followerCount, setFollowerCount] = useState(profileData?.follower_count || 0);
  const [connectionCount, setConnectionCount] = useState(profileData?.connection_count || 0);
  const [shareSuccess, setShareSuccess] = useState(false);
  const { profileData: userProfileData, isAuthenticated, authToken } = useAuth();

  // Fetch follow statistics for the profile
  useEffect(() => {
    const fetchFollowStats = async () => {
      // Wait for authentication before fetching
      if (!profileData?.id || !isAuthenticated || !authToken) return;
      
      try {
        // Use the existing follow-request endpoint
        const response = await api.get('/freelancer/follow-request/');
        if (response.data) {
          const { approved_followers, following_approved } = response.data;
          
          // Count followers
          const followersList = approved_followers || [];
          setFollowerCount(followersList.length);
          
          // Calculate connections (mutual follows)
          // Connections = people who follow you AND you follow them back
          const followingList = following_approved || [];
          const followerIds = new Set(followersList.map((f: any) => f.profile_id));
          const connections = followingList.filter((f: any) => followerIds.has(f.freelancer_id));
          setConnectionCount(connections.length);
        }
      } catch (error) {
        console.error('Error fetching follow stats:', error);
        // Fallback to the profile data if API doesn't exist
        setFollowerCount(profileData?.follower_count || 0);
        setConnectionCount(profileData?.connection_count || 0);
      }
    };

    if (profileData?.id && isAuthenticated && authToken) {
      fetchFollowStats();
    }
  }, [profileData?.id, api, isAuthenticated, authToken]);

  // Sync state with props when profileData changes (e.g., after page reload)
  useEffect(() => {
    if (profileData) {
      setIsFollowing(profileData.is_following || false);
      setFollowRequestSent(profileData.follow_request_sent || false);
      setFollowerCount(profileData.follower_count || 0);
      setConnectionCount(profileData.connection_count || 0);
    }
  }, [profileData?.is_following, profileData?.follow_request_sent, profileData?.follower_count, profileData?.connection_count]);

  if (!profileData) {
    return <div>Loading profile data...</div>;
  }

  const { first_name, last_name, bio, profile_picture, address, city, state, skills } = profileData;
  const skillsArray = skills ? skills.split(',') : [];
  const fullName = `${first_name} ${last_name}`;
  const location = `${address ? address + ', ' : ''}${city ? city + ', ' : ''}${state || ''}`;
  const profileImageUrl = profile_picture;

  const handleFollowAction = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (isFollowing) {
        // Unfollow an already approved connection
        await api.delete(`/freelancer/follow/?freelancer_id=${profileData.id}`);
        setIsFollowing(false);
        setFollowRequestSent(false);
      } else if (followRequestSent) {
        // Cancel a pending follow request
        await api.delete(`/freelancer/follow/?freelancer_id=${profileData.id}`);
        setFollowRequestSent(false);
      } else {
        // Send a new follow request
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

  const createProfileSlug = (firstName: string, lastName: string, id: string) => {
    // Create a URL-friendly slug from the name
    const namePart = `${firstName}-${lastName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    
    // Include full ID for backend compatibility
    return `${namePart}-${id}`;
  };

  const handleShareProfile = async () => {
    if (!profileData) return;

    const fullName = `${profileData.first_name} ${profileData.last_name}`;
    const profileSlug = createProfileSlug(profileData.first_name, profileData.last_name, profileData.id);
    const profileUrl = `${window.location.origin}/profile/${profileSlug}`;
    const shareData = {
      title: `${fullName}'s Profile - GrowupBuddy`,
      text: `Check out ${fullName}'s profile on GrowupBuddy!`,
      url: profileUrl,
    };

    try {
      // Check if Web Share API is available (mainly for mobile devices)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(profileUrl);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      }
    } catch (error) {
      // If user cancels share or clipboard fails, try clipboard as fallback
      if (error instanceof Error && error.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(profileUrl);
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 3000);
        } catch (clipboardError) {
          console.error("Failed to share profile:", clipboardError);
        }
      }
    }
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
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="font-medium text-xl sm:text-2xl">{fullName}</h3>
              <button
                onClick={handleShareProfile}
                className="text-[#7052FF] hover:text-[#5a42cc] transition-colors"
                aria-label="Share profile"
              >
                <FaShareAlt size={16} />
              </button>
            </div>
          </div>
          {shareSuccess && (
            <div className="text-green-600 text-sm mb-2 animate-fade-in">
              ✓ Profile link copied to clipboard!
            </div>
            )}
          {bio && (
            <p className="text-gray-600 text-sm sm:text-base mb-2">
              {bio}
            </p>
          )}
          {location && (
            <p className="text-gray-500 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1">
              <IoLocationSharp /> {location}
            </p>
          )}
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
              <div className="flex gap-3 flex-wrap">
                <Button className="bg-[#7052FF] hover:bg-[#5a42cc] text-white font-medium flex items-center gap-2 px-4 py-2 rounded w-auto">
                  <ImUsers /> {followerCount || 0} Followers
                </Button>
                {connectionCount > 0 && (
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2 px-4 py-2 rounded w-auto">
                    <ImUsers /> {connectionCount} Connections
                  </Button>
                )}
                <Button
                  onClick={handleShareProfile}
                  className="bg-[#7052FF] hover:bg-[#5a42cc] text-white font-medium flex items-center gap-2 px-4 py-2 rounded w-auto"
                >
                  <FaShareAlt /> Share
                </Button>
              </div>
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
          <div className="flex gap-3 flex-wrap">
            <Button className="bg-[#7052FF] hover:bg-[#5a42cc] text-white font-medium flex items-center gap-2 px-4 py-2 rounded w-auto">
              <ImUsers /> {followerCount || 0} Followers
            </Button>
            {connectionCount > 0 && (
              <Button className="bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2 px-4 py-2 rounded w-auto">
                <ImUsers /> {connectionCount} Connections
              </Button>
            )}
           
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileData;