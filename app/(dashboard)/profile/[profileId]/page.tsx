"use client";
import { useState, useEffect } from "react";
import SummryTab from "./_components/SummryTab";
import ProfileData from "./_components/ProfileData";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

const Page = ({ params }) => {
  const {  authToken } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {api} = useAuthenticatedApi()
  

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/freelancer/freelancer-details/?id=${params.profileId}`);
        if (response.data) {
          console.log(response.data);
          
          setProfileData(response.data);
        } else {
          setError('No profile data found');
        }
      } catch (err) {
        console.error('Error fetching freelancer profile:', err);
        setError(err.response?.data?.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchProfileData();
    }
  }, [authToken ]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col justify-between px-40 mx-auto">
      {!profileData ? (
        <div className="text-center py-10">No profile data available</div>
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