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
  requester_username: string;
}

interface Freelancer {
  freelancer_id: string;
  freelancer_username: string;
  follower_count: number;
  followers: Follower[];
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
        
        // Fetch followers
        const followersResponse = await api.get('/freelancer/follow/');
        
        // Fetch follow requests
        const requestsResponse = await api.get('/freelancer/follow-request/');
        
        // Fetch freelancers and their followers
        const freelancersResponse = await api.get('/freelancer/freelancer-and-followers/');
        
        // Process data for my network (followers)
        const processedFollowers = followersResponse.data.map((follower: Follower) => ({
          id: follower.follower_id,
          name: follower.follower_username,
          title: "Freelancer",
          location: "Unknown",
          imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
          isOnline: Math.random() > 0.5, // Random online status for demonstration
        }));
        
        // Process data for invites (follow requests)
        const processedRequests = requestsResponse.data.map((request: FollowRequest) => ({
          id: request.request_id,
          name: request.requester_username,
          title: "Freelancer",
          location: "Unknown",
          imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&crop=faces",
          isOnline: Math.random() > 0.5,
          summary: "Wants to connect with you"
        }));
        
        // Process data for near network (other freelancers)
        const processedFreelancers = freelancersResponse.data
          .filter((freelancer: Freelancer) => !processedFollowers.some((f:any) => f.id === freelancer.freelancer_id))
          .map((freelancer: Freelancer) => ({
            id: freelancer.freelancer_id,
            name: freelancer.freelancer_username,
            title: "Freelancer",
            location: "Unknown",
            imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
            isOnline: Math.random() > 0.5,
            followerCount: freelancer.follower_count
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
  }, [authToken, api]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await api.patch(`/freelancer/follow/?request_id=${requestId}&action=accept`);
      
      // Update the UI by removing the accepted request from invites
      setInvites(prevInvites => prevInvites.filter(invite => invite.id !== requestId));
      
      // Refresh the network data
      const followersResponse = await api.get('/freelancer/follow/');
      const processedFollowers = followersResponse.data.map((follower: Follower) => ({
        id: follower.follower_id,
        name: follower.follower_username,
        title: "Freelancer",
        location: "Unknown",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
        isOnline: Math.random() > 0.5,
      }));
      
      setMyNetwork(processedFollowers);
    } catch (error) {
      console.error('Error accepting follow request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await api.patch(`/freelancer/follow/?request_id=${requestId}&action=reject`);
      
      // Update the UI by removing the rejected request from invites
      setInvites(prevInvites => prevInvites.filter(invite => invite.id !== requestId));
    } catch (error) {
      console.error('Error rejecting follow request:', error);
    }
  };

  const handleFollowUser = async (freelancerId: string) => {
    try {
      await api.post(`/freelancer/follow/?freelancer_id=${freelancerId}`);
      
      // Update near network to show the follow request has been sent
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