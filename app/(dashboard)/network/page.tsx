// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { NetworkCard } from "./_components/NetworkCard";
import { NetworkSection } from "./_components/NetworkSection";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

interface Follower {
  profile_id: string;
  follower_id: string;
  follower_username: string;
  follower_email: string;
  follower_address: string;
  follower_bio: string;
  freelancer_image: string;
  followed_at: string;
}

interface FollowRequest {
  request_id: string;
  freelancer_id: string;
  follower_username: string;
  follower_email: string;
  follower_address: string;
  follower_bio: string;
  freelancer_image: string;
  requested_at: string;
}

interface FollowResponse {
  follower_count: number;
  approved_followers?: Follower[];
}

interface FollowingRequest {
  request_id: string;
  freelancer_username: string;
  freelancer_email: string;
  freelancer_address: string;
  freelancer_bio: string;
  freelancer_image: string | null;
  requested_at: string;
}

interface FollowingApproved {
  freelancer_id: string;
  freelancer_username: string;
  freelancer_email: string;
  freelancer_address: string;
  freelancer_bio: string;
  freelancer_image: string | null;
  followed_at: string;
}

interface RequestsResponse {
  approved_followers: Follower[];
  pending_follow_requests: FollowRequest[];
  following_requests: FollowingRequest[];
  following_approved: FollowingApproved[];
}

interface Freelancer {
  id: string;
  first_name: string;
  last_name: string;
  bio: string;
  profile_picture: string;
  address: string;
  city: string;
  state: string;
  position: string;
  follower_count: number;
}

interface NetworkUser {
  id: string;
  name: string;
  title: string;
  location: string;
  imageUrl: string;
  isOnline: boolean;
  summary?: string;
  followerCount?: number;
  requestSent?: boolean;
}

export default function NetworkPage() {
  const [myNetwork, setMyNetwork] = useState<NetworkUser[]>([]);
  const [invites, setInvites] = useState<NetworkUser[]>([]);
  const [nearNetwork, setNearNetwork] = useState<NetworkUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showConnectionsBanner, setShowConnectionsBanner] = useState<boolean>(true);

  // Separate states for followers, connections, and following
  const [followers, setFollowers] = useState<NetworkUser[]>([]);
  const [connections, setConnections] = useState<NetworkUser[]>([]);
  const [following, setFollowing] = useState<NetworkUser[]>([]);
  const [activeTab, setActiveTab] = useState<
    "followers" | "connections" | "following"
  >("followers");

  const { api } = useAuthenticatedApi();
  const { authToken, profileData } = useAuth();

  const fetchNetworkData = async () => {
    if (!authToken || !api) return;

    try {
      setLoading(true);
      setError(null);

      // Get followers and requests data
      const [followersResponse, connectionsResponse, freelancersResponse] = await Promise.all([
        api.get("/freelancer/follow-request/"),
        api.get("/freelancer/my-connections-followers/"),
        api.get("/freelancer/freelancer-profile/")
      ]);

      const pendingRequestsData: any = followersResponse.data.results || followersResponse.data.pending_follow_requests || [];
      const connectionsData: any = connectionsResponse.data || {};
      const freelancersData: any = freelancersResponse.data;

      const getFullName = (obj: any) => {
        if (!obj) return "User";
        if (obj.name) return obj.name;
        if (obj.username) return obj.username;
        if (obj.freelancer_username) return obj.freelancer_username;
        if (obj.follower_username) return obj.follower_username;
        if (obj.first_name || obj.last_name) return `${obj.first_name || ""} ${obj.last_name || ""}`.trim();
        if (obj.freelancer_first_name || obj.freelancer_last_name) return `${obj.freelancer_first_name || ""} ${obj.freelancer_last_name || ""}`.trim();
        if (obj.follower_first_name || obj.follower_last_name) return `${obj.follower_first_name || ""} ${obj.follower_last_name || ""}`.trim();
        if (obj.from_user?.name) return obj.from_user.name;
        return "User";
      };

      const getAvatar = (obj: any) => {
        if (!obj) return "";
        return obj.profile_picture || obj.profile_image || obj.image || obj.freelancer_image || obj.follower_image || obj.freelancer_profile_picture || obj.follower_profile_picture || obj.from_user?.profile_picture || "";
      };

      const getLocation = (obj: any) => {
        if (!obj) return "Unknown";
        return obj.address || obj.location || obj.freelancer_address || obj.follower_address || obj.freelancer_location || obj.follower_location || obj.from_user?.location || "Unknown";
      };

      const getSummary = (obj: any) => {
        if (!obj) return "";
        return obj.title || obj.bio || obj.summary || obj.freelancer_bio || obj.follower_bio || obj.freelancer_summary || obj.follower_summary || obj.from_user?.title || "";
      };

      // Process approved followers (people who follow you)
      const processedFollowers = (connectionsData.followers || []).map(
        (follower: any) => ({
          id: follower.freelancer_id || follower.profile_id || follower.freelancer_profile || follower.id || follower.user_id,
          name: getFullName(follower),
          location: getLocation(follower),
          imageUrl: getAvatar(follower),
          isOnline: false,
          summary: getSummary(follower),
        })
      );

      // Process following requests (people you are following - pending) - we might not have this from this API
      const processedFollowingRequests = (
        connectionsData.following_requests || []
      ).map((following: any) => ({
        id: following.freelancer_id || following.profile_id || following.freelancer_profile || following.id || following.user_id,
        name: getFullName(following),
        location: getLocation(following),
        imageUrl: getAvatar(following),
        isOnline: false,
        summary: getSummary(following),
      }));

      // Process following approved (people you are following - approved)
      const processedFollowingApproved = (
        connectionsData.following || connectionsData.following_approved || []
      ).map((following: any) => ({
        id: following.freelancer_id || following.profile_id || following.freelancer_profile || following.id || following.user_id,
        name: getFullName(following),
        location: getLocation(following),
        imageUrl: getAvatar(following),
        isOnline: false,
        summary: getSummary(following),
      }));

      // Create sets for efficient lookups
      const followerIds = new Set(processedFollowers.map((f) => f.id));
      const followingIds = new Set(processedFollowingApproved.map((f) => f.id));

      // Debug logging
      console.log("API Response Data:", {
        approved_followers: processedFollowers.length || 0,
        following_approved: processedFollowingApproved.length || 0,
        processedFollowers: processedFollowers.length,
        processedFollowingApproved: processedFollowingApproved.length,
      });

      // Categorize users
      // Followers: ALL people who follow you (includes one-way and mutual)
      const allFollowers = processedFollowers;

      // Following: ALL people you follow (includes one-way and mutual)
      const allFollowing = processedFollowingApproved;

      // Connections: people who follow you AND you follow them back (mutual follows)
      const mutualConnections = processedFollowers.filter((user) =>
        followingIds.has(user.id)
      );

      // Debug logging
      console.log("Categorized Data:", {
        followers: allFollowers.length,
        following: allFollowing.length,
        connections: mutualConnections.length,
      });

      // Set the categorized data
      setFollowers(allFollowers);
      setConnections(mutualConnections);
      setFollowing(allFollowing);

      // Combine followers, following requests, and following approved into My Network
      const combinedNetwork = [
        ...processedFollowers,
        ...processedFollowingRequests,
        ...processedFollowingApproved,
      ].filter(
        (user, index, self) => index === self.findIndex((u) => u.id === user.id)
      );

      // Process pending follow requests with resilient fallbacks
      const processedRequests = (
        pendingRequestsData
      ).map((request: any) => ({
        id: request.freelancer_id || request.profile_id || request.freelancer_profile || request.id || request.from_user?.id || request.user_id || "unknown",
        name: getFullName(request),
        location: getLocation(request),
        imageUrl: getAvatar(request),
        isOnline: false,
        summary: getSummary(request),
        requestId: request.request_id || request.id || "no-req-id",
      }));

      console.log(processedRequests);

      // Process other freelancers (exclude already connected ones)
      const connectedIds = new Set(combinedNetwork.map((f) => f.id));
      const processedFreelancers = (freelancersData || [])
        .filter(
          (freelancer: Freelancer) =>
            !connectedIds.has(freelancer.id) &&
            freelancer.id !== profileData?.id
        )
        .map((freelancer: Freelancer) => ({
          id: freelancer.id,
          name:
            `${freelancer.first_name || ""} ${freelancer.last_name || ""
              }`.trim() || "User",
          location:
            [freelancer.city, freelancer.state].filter(Boolean).join(", ") ||
            "Unknown",
          imageUrl: freelancer.profile_picture,
          isOnline: false,
          followerCount: freelancer.follower_count || 0,
          summary: freelancer.bio || undefined,
          requestSent: false,
        }));

      setMyNetwork(combinedNetwork);
      setInvites(processedRequests);

      // Use similar profiles data for Near My Network section
      if (profileData?.id) {
        try {
          const similarResponse = await api.get(
            `/freelancer/freelancers-similar/?freelancer_id=${profileData.id}`
          );
          const similarData = similarResponse.data;

          const processedSimilarProfiles: NetworkUser[] = similarData.map(
            (freelancer: any) => ({
              id: freelancer.id,
              name: `${freelancer.first_name} ${freelancer.last_name}`.trim(),
              location:
                `${freelancer.city || ""}, ${freelancer.state || ""}`.replace(
                  /^,\s*|,\s*$/g,
                  ""
                ) ||
                freelancer.address ||
                "Unknown",
              imageUrl: freelancer.profile_picture || "",
              isOnline: false,
              followerCount: freelancer.follower_count || 0,
              summary: freelancer.bio || undefined,
              requestSent: freelancer.follow_request_sent || false,
            })
          );

          setNearNetwork(processedSimilarProfiles.slice(0, 5));
        } catch (error) {
          console.error("Error fetching similar profiles:", error);
          setNearNetwork(processedFreelancers);
        }
      } else {
        setNearNetwork(processedFreelancers);
      }

      // Cache all profile data in sessionStorage for quick access on profile page
      const allUsers = [
        ...processedFollowers,
        ...processedFollowingApproved,
        ...processedRequests,
        ...processedFreelancers
      ];
      const cache: Record<string, any> = {};
      allUsers.forEach((user) => {
        if (user.id) {
          cache[user.id] = {
            id: user.id,
            username: user.name,
            first_name: user.name?.split(' ')[0] || '',
            last_name: user.name?.split(' ').slice(1).join(' ') || '',
            bio: user.summary || '',
            profile_picture: user.imageUrl || '',
            profile_image: user.imageUrl || '',
            address: user.location !== 'Unknown' ? user.location : '',
          };
        }
      });
      try {
        sessionStorage.setItem('network_profile_cache', JSON.stringify(cache));
      } catch(e) { /* ignore storage errors */ }

    } catch (error) {
      console.error("Error fetching network data:", error);
      setError("Failed to load network data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchNetworkData();
    }
  }, [authToken]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      // Backend expects query params, NOT body - confirmed working
      await api.patch(`/freelancer/follow/?request_id=${requestId}&action=accept`);

      // Remove from invites immediately
      setInvites((prevInvites) =>
        prevInvites.filter((invite) => invite.requestId !== requestId)
      );

      // Refresh followers list after short delay for backend sync
      setTimeout(async () => {
        await fetchNetworkData();
      }, 800);
    } catch (error) {
      console.error("Error accepting follow request:", error);
      setError("Failed to accept request. Please try again.");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      // Backend expects query params, NOT body - confirmed working
      await api.patch(`/freelancer/follow/?request_id=${requestId}&action=reject`);

      setInvites((prevInvites) =>
        prevInvites.filter((invite) => invite.requestId !== requestId)
      );
    } catch (error) {
      console.error("Error rejecting follow request:", error);
      setError("Failed to reject request. Please try again.");
    }
  };

  const handleFollowUser = async (freelancerId: string) => {
    try {
      await api.post(`/freelancer/follow/?freelancer_id=${freelancerId}`);

      setNearNetwork((prevNetwork) =>
        prevNetwork.map((user) =>
          user.id === freelancerId ? { ...user, requestSent: true } : user
        )
      );
    } catch (error) {
      console.error("Error sending follow request:", error);
      setError("Failed to send follow request. Please try again.");
    }
  };

  const handleCancelRequest = async (freelancerId: string) => {
    try {
      await api.delete(`/freelancer/follow/?freelancer_id=${freelancerId}`);

      setNearNetwork((prevNetwork) =>
        prevNetwork.map((user) =>
          user.id === freelancerId ? { ...user, requestSent: false } : user
        )
      );
    } catch (error) {
      console.error("Error canceling follow request:", error);
      setError("Failed to cancel follow request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button
            onClick={fetchNetworkData}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get the appropriate list based on active tab
  const getActiveTabData = () => {
    switch (activeTab) {
      case "followers":
        return followers;
      case "connections":
        return connections;
      case "following":
        return following;
      default:
        return [];
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case "followers":
        return "No followers yet. People who follow you will appear here.";
      case "connections":
        return "No connections yet. Connections are people you follow who also follow you back.";
      case "following":
        return "You are not following anyone yet. People you follow will appear here.";
      default:
        return "No data available.";
    }
  };

  const activeTabData = getActiveTabData();

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-[100px] xl:gap-[180px] p-4 lg:px-28 w-full h-[calc(100vh-5rem)] md:h-[calc(100vh-10rem)] overflow-y-auto hide-scrollbar pb-32">
      <div className="w-full lg:w-[320px] xl:w-[380px] flex-shrink-0 bg-white border border-gray-100 shadow-sm p-6 h-fit rounded-xl hide-scrollbar">
        {/* Network Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[17px] font-bold text-gray-900">My network</h2>
          <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>

        {/* Info Banner */}
        {showConnectionsBanner && (
          <div className="bg-[#eceaff] rounded-xl p-4 mb-6 relative">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowConnectionsBanner(false); }}
              className="absolute top-3 right-3 text-[#7052FF] hover:text-purple-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center gap-2 mb-2 text-[#7052FF]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-xs tracking-wide">What are Connections?</h3>
            </div>
            <p className="text-[11px] text-gray-700 leading-relaxed max-w-[95%]">
              Connections are how you build your professional network on GrowUp Buddy. Connect with people you want to collaborate, learn, or grow with — based on shared interests and intent.
            </p>
          </div>
        )}

        {/* Tab Navigation - Tucked away minimal */}
        <div className="mb-4 flex gap-2 md:gap-1 border-b border-gray-100 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab("followers")}
            className={`px-4 md:px-3 py-3 md:py-2.5 font-semibold text-sm md:text-xs transition-all relative flex items-center gap-2 md:gap-1.5 whitespace-nowrap flex-shrink-0 ${activeTab === "followers"
              ? "text-[#7052FF]"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <span>Followers</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold min-w-[1.5rem] text-center ${activeTab === "followers"
                ? "bg-[#7052FF] text-white"
                : "bg-gray-200 text-gray-600"
                }`}
            >
              {followers.length}
            </span>
            {activeTab === "followers" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7052FF] -mb-[1px]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("connections")}
            className={`px-4 md:px-3 py-3 md:py-2.5 font-semibold text-sm md:text-xs transition-all relative flex items-center gap-2 md:gap-1.5 whitespace-nowrap flex-shrink-0 ${activeTab === "connections"
              ? "text-[#7052FF]"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <span>Connections</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold min-w-[1.5rem] text-center ${activeTab === "connections"
                ? "bg-[#7052FF] text-white"
                : "bg-gray-200 text-gray-600"
                }`}
            >
              {connections.length}
            </span>
            {activeTab === "connections" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7052FF] -mb-[1px]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`px-4 md:px-3 py-3 md:py-2.5 font-semibold text-sm md:text-xs transition-all relative flex items-center gap-2 md:gap-1.5 whitespace-nowrap flex-shrink-0 ${activeTab === "following"
              ? "text-[#7052FF]"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <span>Following</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold min-w-[1.5rem] text-center ${activeTab === "following"
                ? "bg-[#7052FF] text-white"
                : "bg-gray-200 text-gray-600"
                }`}
            >
              {following.length}
            </span>
            {activeTab === "following" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7052FF] -mb-[1px]"></span>
            )}
          </button>
        </div>

        {/* Network Section with Tab Content */}
        <div className="max-h-[500px] overflow-y-auto scrollbar-none pr-1">
          {activeTabData.length > 0 ? (
            <div className="space-y-0.5">
              {activeTabData.map((connection) => (
                <NetworkCard key={connection.id} {...connection} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {getEmptyMessage()}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-[1000px] flex-shrink-0 ml-auto py-4 rounded-lg hide-scrollbar">
        <NetworkSection title="Invites">
          <div className="max-h-[350px] overflow-y-auto pr-2 scrollbar-none flex flex-col gap-[20px]">
            {invites.length > 0 ? (
              invites.map((invite) => (
                <NetworkCard
                  key={invite.requestId}
                  {...invite}
                  showAccept
                  variant="invite"
                  onAccept={() => handleAcceptRequest(invite.requestId)}
                  onReject={() => handleRejectRequest(invite.requestId)}
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm pl-2">No pending invites.</p>
            )}
          </div>
          {invites.length > 4 && (
            <div className="flex items-center justify-center mt-6">
              <div className="h-[1px] bg-gray-100 flex-grow"></div>
              <button className="px-4 text-[#7052FF] text-sm font-semibold hover:underline">
                See all
              </button>
              <div className="h-[1px] bg-gray-100 flex-grow"></div>
            </div>
          )}
        </NetworkSection>

        <div className="mt-8">
          <NetworkSection title="Near My Network">
            <div className="flex-1 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearNetwork.length > 0 ? (
                  nearNetwork.map((connection) => (
                    <NetworkCard
                      key={connection.id}
                      {...connection}
                      variant="grid"
                      showFollow={!connection.requestSent}
                      onFollow={() => handleFollowUser(connection.id)}
                      onCancelRequest={() => handleCancelRequest(connection.id)}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No freelancers found.</p>
                )}
              </div>
            </div>
          </NetworkSection>
        </div>
      </div>
    </div>
  );
}
