// @ts-nocheck
"use client";

import { useEffect, useState } from 'react';
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
  requester_username?: string;
  follower_username?: string;
}

interface FollowResponse {
  follower_count: number;
  approved_followers?: Follower[];
}

interface RequestsResponse {
  approved_followers: Follower[];
  pending_follow_requests: FollowRequest[];
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

  const { api } = useAuthenticatedApi();
  const { authToken, profileData } = useAuth();

  const fetchNetworkData = async () => {
    if (!authToken || !api) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get followers and requests data
      const followersResponse = await api.get('/freelancer/follow-request/');
      const followersData: RequestsResponse = followersResponse.data;
      
      // Get all freelancers
      const freelancersResponse = await api.get('/freelancer/freelancer-profile/');
      const freelancersData: Freelancer[] = freelancersResponse.data;
      
      // Process approved followers
      const processedFollowers = (followersData.approved_followers || []).map((follower: Follower) => ({
        id: follower.profile_id,
        name: follower.follower_username || "User",
        title: "Freelancer",
        location: follower.follower_address || "Unknown",
        imageUrl: follower.freelancer_image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
        isOnline: Math.random() > 0.5,
        summary: follower.follower_bio
      }));
      
      // Process pending follow requests
      const processedRequests = (followersData.pending_follow_requests || []).map((request: FollowRequest) => ({
        id: request.request_id,
        name: request.follower_username || request.requester_username || "User",
        title: "Freelancer",
        location: "Unknown",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&crop=faces",
        isOnline: Math.random() > 0.5,
        summary: "Wants to connect with you",
      }));
      
      // Process other freelancers (exclude already connected ones)
      const connectedIds = new Set(processedFollowers.map(f => f.id));
      const processedFreelancers = (freelancersData || [])
        .filter((freelancer: Freelancer) => !connectedIds.has(freelancer.id) && freelancer.id !== profileData.id)
        .map((freelancer: Freelancer) => ({
          id: freelancer.id,
          name: `${freelancer.first_name || ""} ${freelancer.last_name || ""}`.trim() || "User",
          title: freelancer.position || "Freelancer",
          location: [freelancer.city, freelancer.state].filter(Boolean).join(", ") || "Unknown",
          imageUrl: freelancer.profile_picture || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
          isOnline: Math.random() > 0.5,
          followerCount: freelancer.follower_count || 0,
          summary: freelancer.bio || undefined,
          requestSent: false
        }));

      setMyNetwork(processedFollowers);
      setInvites(processedRequests);
      setNearNetwork(processedFreelancers);
    } catch (error) {
      console.error('Error fetching network data:', error);
      setError('Failed to load network data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkData();
  }, [authToken]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await api.patch(`/freelancer/follow/?request_id=${requestId}&action=accept`);
      
      // Remove from invites
      setInvites(prevInvites => prevInvites.filter(invite => invite.id !== requestId));
      
      // Refresh followers list
      await fetchNetworkData();
    } catch (error) {
      console.error('Error accepting follow request:', error);
      setError('Failed to accept request. Please try again.');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await api.patch(`/freelancer/follow/?request_id=${requestId}&action=reject`);
      
      setInvites(prevInvites => prevInvites.filter(invite => invite.id !== requestId));
    } catch (error) {
      console.error('Error rejecting follow request:', error);
      setError('Failed to reject request. Please try again.');
    }
  };

  const handleFollowUser = async (freelancerId: string) => {
    try {
      await api.post(`/freelancer/follow/?freelancer_id=${freelancerId}`);
      
      setNearNetwork(prevNetwork => 
        prevNetwork.map(user => 
          user.id === freelancerId 
            ? { ...user, requestSent: true } 
            : user
        )
      );
    } catch (error) {
      console.error('Error sending follow request:', error);
      setError('Failed to send follow request. Please try again.');
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

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      <div className="w-full lg:w-1/3 bg-[#F9FAFF] p-4 lg:h-auto lg:overflow-y-auto rounded-lg">
        <NetworkSection title="My network">
          {myNetwork.length > 0 ? (
            myNetwork.map((connection) => (
              <NetworkCard
                key={connection.id}
                {...connection} 
              />
            ))
          ) : (
            <p className="text-gray-500">No connections yet.</p>
          )}
        </NetworkSection>
      </div>

      <div className="w-full lg:w-2/3 p-4 overflow-y-auto lg:min-h-screen scrollbar-[1px] rounded-lg">
        <NetworkSection title="Invites" showAll={invites.length > 4}>
          {invites.length > 0 ? (
            invites.map((invite) => (
              <NetworkCard
                key={invite.id}
                {...invite} 
                showAccept
                onAccept={() => handleAcceptRequest(invite.id)}
                onReject={() => handleRejectRequest(invite.id)}
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