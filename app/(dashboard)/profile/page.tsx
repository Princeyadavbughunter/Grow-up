"use client";
import React, { useEffect, useState } from "react";
import { useAuthenticatedApi } from "@/context/AuthContext";
import SummryTab from "./components/SummryTab";
import ProfileData from "./components/ProfileData";

const Page = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { api } = useAuthenticatedApi();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get('/freelancer/freelancer-profile/');
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [api]);

  return (
    <div className="flex flex-col justify-between px-40 mx-auto">
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <ProfileData profileData={profileData} />
          <SummryTab profileData={profileData} />
        </>
      )}
    </div>
  );
};

export default Page;