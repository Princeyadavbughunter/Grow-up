// @ts-nocheck 
"use client";
import React, { useState, useEffect, use } from "react";
import ProfileData from "./_components/ProfileData";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import Summry from "./_components/summrytabs/Summry";
import { useRouter } from "next/navigation";

const Page = ({ params }: any) => {
  const resolvedParams = use(params);
  const { authToken } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { api } = useAuthenticatedApi();
  const router = useRouter();

  // Extract actual UUID from slug (handles both old UUID format and new name-based slugs)
  const extractIdFromSlug = (slug: string): string => {
    // If it's already a full UUID, return it
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
      return slug;
    }
    
    // For slugs like "john-doe-4f1bd207-7af0-4d60-8b91-4ace1feb91df"
    // Extract UUID pattern from the end (last 5 segments separated by hyphens)
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const match = slug.match(uuidPattern);
    
    if (match) {
      return match[0];
    }
    
    // If no UUID found, return the slug as-is (backward compatibility)
    return slug;
  };

  const createProfileSlug = (firstName: string, lastName: string, id: string) => {
    const namePart = `${firstName}-${lastName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${namePart}-${id}`;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profileId = extractIdFromSlug(resolvedParams.profileId);
        const response = await api.get(`/freelancer/freelancer-details/?id=${profileId}`);
        if (response.data) {
          console.log(response.data);
          setProfileData(response.data);
          
          // Update URL to user-friendly format if it's a plain UUID
          if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resolvedParams.profileId)) {
            const newSlug = createProfileSlug(
              response.data.first_name,
              response.data.last_name,
              response.data.id
            );
            router.replace(`/profile/${newSlug}`, { scroll: false });
          }
        } else {
          setError('No profile data found');
        }
      } catch (err: any) {
        console.error('Error fetching freelancer profile:', err);
        setError(err.response?.data?.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchProfileData();
    }
  }, [authToken, resolvedParams.profileId]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  const actualProfileId = profileData?.id || resolvedParams.profileId;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] overflow-y-scroll justify-between px-4 sm:px-8 md:px-16 lg:px-28 mx-auto w-full">
      {!profileData ? (
        <div className="text-center py-10">No profile data available</div>
      ) : (
        <>
          <ProfileData profileData={profileData} />
          <Summry profileData={profileData} profileId={actualProfileId} />
        </>
      )}
    </div>
  );
};

export default Page;