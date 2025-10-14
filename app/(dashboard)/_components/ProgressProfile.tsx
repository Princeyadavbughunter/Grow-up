// @ts-nocheck
import { useState, useEffect } from 'react';
import { HiOutlineStar } from "react-icons/hi2";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

interface WorkExperience {
  id: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string;
  location: string;
  created_at: string;
  updated_at: string;
  currently_working: boolean;
  job_location: string;
  job_title: string;
  freelancer: string;
}

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  bio: string;
  university_name: string;
  graduation_year_from: string;
  profile_picture: string;
  address: string;
  lat: number | null;
  long: number | null;
  city: string;
  district: string;
  pincode: number;
  state: string;
  interest_in: string;
  hobbies: string;
  highest_qualification: string;
  passing_year: string;
  created_at: string;
  degree_name: string;
  is_degree: boolean;
  is_diploma: boolean;
  diploma_name: string;
  is_disabled: boolean;
  resume: string | null;
  skills: string;
  gender: string;
  saved_jobs_count: number;
  follower_count: number;
  dribble_account: string | null;
  github_account: string | null;
  figma_account: string | null;
  youtube_account: string | null;
  medium_account: string | null;
  soft_skills: string;
  position: string;
  user: string;
}

interface Step {
  label: string;
  completed: boolean;
}

const ProgressProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { authToken } = useAuth();
  const { api } = useAuthenticatedApi();

  const fetchProfileData = async (): Promise<void> => {
    try {
      const response = await api.get('/freelancer/freelancer-profile/');
      if (response.data && response.data.length > 0) {
        setProfileData(response.data[0]);
      }
    } catch (error) { 
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchWorkExperiences = async (): Promise<void> => {
    try {
      const response = await api.get('/freelancer/work-experience/');
      setWorkExperiences(response.data || []);
    } catch (error) {
      console.error('Error fetching work experiences:', error);
      setWorkExperiences([]);
    }
  };

  useEffect(() => {
    if (authToken) {
      const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchProfileData(), fetchWorkExperiences()]);
        setLoading(false);
      };
      fetchData();
    }
  }, [authToken]);

  if (loading) {
    return <div className="px-4 py-5 border border-gray-200 rounded-xl text-center text-gray-500">Loading profile data...</div>;
  }

  if (!profileData) {
    return <div className="px-4 py-5 border border-gray-200 rounded-xl text-center text-gray-500">No profile data found</div>;
  }

  // Define steps and check completion based on profile data and work experiences
  const steps: Step[] = [
    { 
      label: "Personal Info", 
      completed: !!(profileData.first_name && profileData.last_name) 
    },
    { 
      label: "Bio", 
      completed: !!profileData.bio 
    },
    { 
      label: "Education", 
      completed: !!(profileData.university_name && profileData.graduation_year_from && 
                  (profileData.is_degree || profileData.is_diploma)) 
    },
    { 
      label: "Work Experience", 
      completed: workExperiences.length > 0 
    },
    {
      label: "Skills",
      completed: !!(profileData.skills || profileData.soft_skills)
    }
  ];

  const completedSteps = steps.filter((step) => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="p-4 border border-gray-200 rounded-xl">
      <p className="font-semibold text-base md:text-lg">Complete Your Profile</p>
      <p className="text-xs text-gray-500">
        {progressPercentage}% completed ({totalSteps - completedSteps} steps left)
      </p>
      <div className="w-full bg-gray-200 h-2 rounded-full mt-2 mb-4">
        <div
          className="h-2 rounded-full bg-[#7052FF]"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div>
        {steps.map((step, index) => (
          <div key={index} className="flex items-center mb-2">
            <HiOutlineStar
              className={`mr-2 ${step.completed ? "text-purple-600" : "text-gray-400"}`}
              size={18} // Adjust icon size for readability
            />
            <p className={`${step.completed ? "text-black" : "text-gray-400"}`}>
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressProfile;