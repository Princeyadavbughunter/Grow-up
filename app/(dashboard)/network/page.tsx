"use client";

import { useEffect, useState } from 'react';
import { NetworkCard } from "./_components/NetworkCard";
import { NetworkSection } from "./_components/NetworkSection";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

interface Follower {
  follower_id: string;
  follower_username: string;
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

  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchNetworkData = async () => {
      if (!authToken) return;
      
      try {
        setLoading(true);
        
        // Get followers data
        const followersResponse = await api.get('/freelancer/follow/');
        const followersData: FollowResponse = followersResponse.data;
        
        // Get follow requests
        const requestsResponse = await api.get('/freelancer/follow-request/');
        const requestsData: RequestsResponse = requestsResponse.data;
        
        // Get all freelancers
        const freelancersResponse = await api.get('/freelancer/freelancer-profile/');
        const freelancersData: Freelancer[] = freelancersResponse.data;
        
        // Process approved followers (if they exist)
        const processedFollowers = followersData.approved_followers 
          ? followersData.approved_followers.map((follower: Follower) => ({
              id: follower.follower_id,
              name: follower.follower_username || "User", // Fallback if username is undefined
              title: "Freelancer",
              location: "Unknown",
              imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
              isOnline: Math.random() > 0.5,
            }))
          : [];
        
        // Process pending follow requests
        const processedRequests = requestsData.pending_follow_requests
          ? requestsData.pending_follow_requests.map((request: FollowRequest) => ({
              id: request.request_id,
              name: request.follower_username || request.requester_username || "User", // Use appropriate field with fallback
              title: "Freelancer",
              location: "Unknown",
              imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&crop=faces",
              isOnline: Math.random() > 0.5,
              summary: "Wants to connect with you"
            }))
          : [];
        
        // Process other freelancers
        const processedFreelancers = freelancersData
          .filter((freelancer: Freelancer) => 
            !processedFollowers.some((f: NetworkUser) => f.id === freelancer.id)
          )
          .map((freelancer: Freelancer) => ({
            id: freelancer.id,
            name: `${freelancer.first_name || ""} ${freelancer.last_name || ""}`.trim() || "User", // Handle empty names
            title: freelancer.position || "Freelancer",
            location: [freelancer.city, freelancer.state].filter(Boolean).join(", ") || "Unknown",
            imageUrl: freelancer.profile_picture || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
            isOnline: Math.random() > 0.5,
            followerCount: freelancer.follower_count,
            summary: freelancer.bio || undefined
          }));
        
        setMyNetwork(processedFollowers);
        setInvites(processedRequests);
        setNearNetwork(processedFreelancers);
      } catch (error) {
        console.error('Error fetching network data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkData();
  }, [authToken]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await api.patch(`/freelancer/follow/?request_id=${requestId}&action=accept`);
      
      setInvites(prevInvites => prevInvites.filter(invite => invite.id !== requestId));
      
      // Refresh followers list
      const followersResponse = await api.get('/freelancer/follow/');
      const followersData: FollowResponse = followersResponse.data;
      
      // Process approved followers (if they exist)
      const processedFollowers = followersData.approved_followers 
        ? followersData.approved_followers.map((follower: Follower) => ({
            id: follower.follower_id,
            name: follower.follower_username || "User", // Fallback if username is undefined
            title: "Freelancer",
            location: "Unknown",
            imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
            isOnline: Math.random() > 0.5,
          }))
        : [];
      
      setMyNetwork(processedFollowers);
    } catch (error) {
      console.error('Error accepting follow request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await api.patch(`/freelancer/follow/?request_id=${requestId}&action=reject`);
      
      setInvites(prevInvites => prevInvites.filter(invite => invite.id !== requestId));
    } catch (error) {
      console.error('Error rejecting follow request:', error);
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
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-[#F9FAFF] p-4 h-full fixed overflow-y-auto px-10">
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

      <div className="ml-[33%] w-2/3 p-4 overflow-y-auto min-h-screen scrollbar-[1px]">
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