"use client";
import React, { useState, useEffect, use } from "react";
import ProfileData from "./_components/ProfileData";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import Summry from "./_components/summrytabs/Summry";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ profileId: string }>;
}

const Page = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  const { authToken } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        
        // ── Step 1: Check sessionStorage cache first (set by network page) ──
        try {
          const cachedRaw = sessionStorage.getItem('network_profile_cache');
          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw);
            // Only use if cache is not expired (5 mins)
            if (cached.expiry && Date.now() < cached.expiry && cached.data[profileId]) {
              setProfileData(cached.data[profileId]);
              setLoading(false); // Show cached data immediately
            }
          }
        } catch(e) { /* ignore */ }

        // ── Step 2: Try API for richer profile data ──
        let profileInfo: any = null;
        try {
          const response = await api.get(`/freelancer/freelancer-and-followers/?id=${profileId}`);
          if (response.data) {
            const raw = response.data.freelancer || response.data;
            // Only use if it has actual profile fields (not just connection stats)
            if (raw && (raw.first_name || raw.username || raw.bio)) {
              profileInfo = raw;
            }
          }
        } catch (e: any) {
          // Error handled gracefully for 50k scale
        }

        // ── Step 3: Try freelancer-details as second fallback ──
        if (!profileInfo) {
          try {
            const response = await api.get(`/freelancer/freelancer-details/?id=${profileId}`);
            if (response.data && (response.data.first_name || response.data.username)) {
              profileInfo = response.data;
            }
          } catch (e2) {
            // Error handled gracefully
          }
        }

        if (profileInfo) {
          setProfileData(profileInfo);
          // Update URL to user-friendly slug if still a plain UUID
          if (
            profileInfo?.first_name &&
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resolvedParams.profileId)
          ) {
            const newSlug = createProfileSlug(
              profileInfo.first_name || "",
              profileInfo.last_name || "",
              profileInfo.id || profileId
            );
            router.replace(`/profile/${newSlug}`, { scroll: false });
          }
        }
        // Cache management complete
      } catch (err: any) {
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