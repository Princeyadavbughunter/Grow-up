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
  // Support multiple name formats from API
  const fullName = (first_name && last_name)
    ? `${first_name} ${last_name}`.trim()
    : (profileData as any).username || (profileData as any).name || first_name || 'Unknown User';
  const location = `${address ? address + ', ' : ''}${city ? city + ', ' : ''}${state || ''}`;
  const profileImageUrl = profile_picture || (profileData as any).profile_image;

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
    <div
      className="flex flex-col bg-white py-2 font-poppins"
      style={{ width: "100%", maxWidth: "450px", minHeight: "300px", gap: "16px" }}
    >
      <div className="flex flex-row items-center sm:items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#7052FF]/10 flex items-center justify-center bg-gray-50 overflow-hidden shadow-inner">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover text-xs"
              />
            ) : (
              <FiUser className="w-10 h-10 text-gray-300" />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between gap-3">
            <h3 className="font-bold text-xl text-gray-900 leading-tight truncate">
              {fullName}
            </h3>
            <button
              onClick={handleShareProfile}
              className="text-[#979797] hover:text-[#7052FF] transition-colors flex-shrink-0"
              aria-label="Share profile"
            >
              <FaShareAlt size={22} />
            </button>
          </div>
          {shareSuccess && (
            <div className="text-green-600 text-[10px] animate-fade-in">
              ✓ Link copied!
            </div>
          )}
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
            {bio || "No bio added yet."}
          </p>
          {location && (
            <p className="text-gray-400 text-xs flex items-center gap-1">
              <IoLocationSharp className="flex-shrink-0 text-sm text-[#7052FF]/60" />{" "}
              {location}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {skillsArray.length > 0 ? (
            Array.from(new Set(skillsArray)).map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="flex items-center justify-center min-w-[85px] h-[25px] font-medium rounded-[22px] px-2 py-1 text-[11px] border border-[#6A737D] bg-white text-[#6A737D] whitespace-nowrap"
              >
                {skill.trim()}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-gray-300 italic">No skills listed</span>
          )}
        </div>

        <div className="flex flex-row gap-4">
          {profileData.linkedin_account && (
            <a href={profileData.linkedin_account} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center">
              <FaLinkedin size={32} className="text-[#979797] hover:text-[#7052FF] transition-colors" />
            </a>
          )}
          {profileData.twitter_account && (
            <a href={profileData.twitter_account} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center">
              <TiSocialTwitter size={34} className="text-[#979797] hover:text-[#7052FF] transition-colors" />
            </a>
          )}
          {profileData.instagram_account && (
            <a href={profileData.instagram_account} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center">
              <FaInstagramSquare size={30} className="text-[#979797] hover:text-[#7052FF] transition-colors" />
            </a>
          )}
          {profileData.facebook_account && (
            <a href={profileData.facebook_account} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center">
              <TiSocialFacebook size={32} className="text-[#979797] hover:text-[#7052FF] transition-colors" />
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7052FF] text-white text-[11px] font-semibold rounded-lg hover:bg-[#5a42cc] transition-all shadow-sm">
            <ImUsers size={12} /> {followerCount || 0} Followers
          </button>
          {connectionCount > 0 && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-[11px] font-semibold rounded-lg hover:bg-green-600 transition-all shadow-sm">
              <ImUsers size={12} /> {connectionCount} Connect
            </button>
          )}
          {userProfileData?.id !== profileData.id && (
            <button
              onClick={handleFollowAction}
              disabled={isLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 ${followRequestSent ? 'bg-yellow-500' : 'bg-[#7052FF]'} text-white text-[11px] font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm disabled:opacity-50`}
            >
              {followRequestSent ? <FaClock size={12} /> : <FaUserPlus size={12} />}
              {isLoading ? "..." : (followRequestSent ? "Requested" : "Follow")}
            </button>
          )}
          {isFollowing && (
            <button
              onClick={handleOpenInbox}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-[11px] font-semibold rounded-lg hover:bg-green-600 transition-all shadow-sm"
            >
              <BsChatDots size={12} /> Inbox
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileData;