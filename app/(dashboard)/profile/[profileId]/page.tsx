"use client";
import React, { useState, useEffect } from "react";
import ProfileData from "./_components/ProfileData";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import Summry from "./_components/summrytabs/Summry";

// @ts-ignore
const Page = ({ params }: any) => {
  const { authToken } = useAuth();
  // @ts-ignore
  const [profileData, setProfileData] = useState(null);
  // @ts-ignore
  const [loading, setLoading] = useState(true);
  // @ts-ignore
  const [error, setError] = useState(null);
  const { api } = useAuthenticatedApi();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // @ts-ignore
        setLoading(true);
        const response = await api.get(`/freelancer/freelancer-details/?id=${params.profileId}`);
        if (response.data) {
          console.log(response.data);
          setProfileData(response.data);
        } else {
          // @ts-ignore
          setError('No profile data found');
        }
      } catch (err: any) {
        console.error('Error fetching freelancer profile:', err);
        // @ts-ignore
        setError(err.response?.data?.message || 'Failed to fetch profile data');
      } finally {
        // @ts-ignore
        setLoading(false);
      }
    };

    if (authToken) {
      fetchProfileData();
    }
  }, [authToken, params.profileId]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col justify-between px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 mx-auto max-w-7xl">
      {!profileData ? (
        <div className="text-center py-10">No profile data available</div>
      ) : (
        <>
          <ProfileData profileData={profileData} />
          <Summry profileData={profileData} />
        </>
      )}
    </div>
  );
};

export default Page;