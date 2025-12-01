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
      const followersResponse = await api.get("/freelancer/follow-request/");
      const followersData: RequestsResponse = followersResponse.data;

      // Get all freelancers
      const freelancersResponse = await api.get(
        "/freelancer/freelancer-profile/"
      );
      const freelancersData: Freelancer[] = freelancersResponse.data;

      // Process approved followers (people who follow you)
      const processedFollowers = (followersData.approved_followers || []).map(
        (follower: Follower) => ({
          id: follower.profile_id,
          name: follower.follower_username || "User",
          location: follower.follower_address || "Unknown",
          imageUrl: follower.freelancer_image,
          isOnline: Math.random() > 0.5,
          summary: follower.follower_bio,
        })
      );

      // Process following requests (people you are following - pending)
      const processedFollowingRequests = (
        followersData.following_requests || []
      ).map((following: FollowingRequest) => ({
        id: following.freelancer_id,
        name: following.freelancer_username,
        location: following.freelancer_address,
        imageUrl: following.freelancer_image,
        isOnline: Math.random() > 0.5,
        summary: following.freelancer_bio,
      }));

      // Process following approved (people you are following - approved)
      const processedFollowingApproved = (
        followersData.following_approved || []
      ).map((following: FollowingApproved) => ({
        id: following.freelancer_id,
        name: following.freelancer_username,
        location: following.freelancer_address,
        imageUrl: following.freelancer_image,
        isOnline: Math.random() > 0.5,
        summary: following.freelancer_bio,
      }));

      // Create sets for efficient lookups
      const followerIds = new Set(processedFollowers.map((f) => f.id));
      const followingIds = new Set(processedFollowingApproved.map((f) => f.id));

      // Debug logging
      console.log("API Response Data:", {
        approved_followers: followersData.approved_followers?.length || 0,
        following_approved: followersData.following_approved?.length || 0,
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

      // Process pending follow requests
      const processedRequests = (
        followersData.pending_follow_requests || []
      ).map((request: FollowRequest) => ({
        id: request.freelancer_id,
        name: request.follower_username,
        location: request.follower_address,
        imageUrl: request.freelancer_image,
        isOnline: Math.random() > 0.5,
        summary: request.follower_bio,
        requestId: request.request_id,
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
            `${freelancer.first_name || ""} ${
              freelancer.last_name || ""
            }`.trim() || "User",
          location:
            [freelancer.city, freelancer.state].filter(Boolean).join(", ") ||
            "Unknown",
          imageUrl: freelancer.profile_picture,
          isOnline: Math.random() > 0.5,
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
              isOnline: Math.random() > 0.5,
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
      await api.patch(
        `/freelancer/follow/?request_id=${requestId}&action=accept`
      );

      // Remove from invites
      setInvites((prevInvites) =>
        prevInvites.filter((invite) => invite.requestId !== requestId)
      );

      // Refresh followers list
      await fetchNetworkData();
    } catch (error) {
      console.error("Error accepting follow request:", error);
      setError("Failed to accept request. Please try again.");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await api.patch(
        `/freelancer/follow/?request_id=${requestId}&action=reject`
      );

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
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-full overflow-y-scroll md:overflow-y-hidden lg:flex-row gap-4 p-4">
      <div className="w-full lg:w-1/3 bg-white border border-gray-200 shadow-sm p-5 lg:h-auto lg:overflow-y-auto rounded-xl">
        {/* Tab Navigation */}

          <div className="mb-5 flex gap-2 md:gap-1 border-b border-gray-200 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab("followers")}
            className={`px-4 md:px-3 py-3 md:py-2.5 font-semibold text-sm md:text-xs transition-all relative flex items-center gap-2 md:gap-1.5 whitespace-nowrap flex-shrink-0 ${
              activeTab === "followers"
                ? "text-[#7052FF]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>Followers</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold min-w-[1.5rem] text-center ${
                activeTab === "followers"
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
            className={`px-4 md:px-3 py-3 md:py-2.5 font-semibold text-sm md:text-xs transition-all relative flex items-center gap-2 md:gap-1.5 whitespace-nowrap flex-shrink-0 ${
              activeTab === "connections"
                ? "text-[#7052FF]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>Connections</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold min-w-[1.5rem] text-center ${
                activeTab === "connections"
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
            className={`px-4 md:px-3 py-3 md:py-2.5 font-semibold text-sm md:text-xs transition-all relative flex items-center gap-2 md:gap-1.5 whitespace-nowrap flex-shrink-0 ${
              activeTab === "following"
                ? "text-[#7052FF]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>Following</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold min-w-[1.5rem] text-center ${
                activeTab === "following"
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
        <div className="max-h-[calc(100vh-20rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-1">
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

      <div className="w-full lg:w-2/3 p-4 lg:min-h-screen scrollbar-[1px] rounded-lg">
        <NetworkSection title="Invites" showAll={invites.length > 4}>
          {invites.length > 0 ? (
            invites.map((invite) => (
              <NetworkCard
                key={invite.requestId}
                {...invite}
                showAccept
                onAccept={() => handleAcceptRequest(invite.requestId)}
                onReject={() => handleRejectRequest(invite.requestId)}
              />
            ))
          ) : (
            <p className="text-gray-500">No pending invites.</p>
          )}
        </NetworkSection>

        <NetworkSection title="Near My Network">
          <div className="gap-4 space-y-6">
            {nearNetwork.length > 0 ? (
              nearNetwork.map((connection) => (
                <div key={connection.id} className="p-4 border rounded-lg">
                  <NetworkCard
                    {...connection}
                    showFollow={!connection.requestSent}
                    onFollow={() => handleFollowUser(connection.id)}
                    onCancelRequest={() => handleCancelRequest(connection.id)}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No freelancers found.</p>
            )}
          </div>
        </NetworkSection>
      </div>
    </div>
  );
}
