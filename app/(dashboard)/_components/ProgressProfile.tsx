// @ts-nocheck
'use client'
import { useState, useEffect } from 'react';
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';

interface WorkExperience {
  id: string;
  company_name: string;
}

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  bio: string;
  university_name: string;
  graduation_year_from: string;
  profile_picture: string;
  skills: string;
  soft_skills: string;
  is_degree: boolean;
}

interface Step {
  label: string;
  completed: boolean;
}

const StarBadgeIcon = ({ completed }: { completed: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={completed ? "#7052FF" : "none"}
    stroke={completed ? "none" : "#6A737D"}
    strokeWidth={completed ? "0" : "1.5"}
    strokeLinejoin="round"
    strokeLinecap="round"
    className="flex-shrink-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 8-pointed scalloped star path matching Figma closely */}
    <path d="M12 2L14.46 4.36L17.82 4.04L18.84 7.27L22 8.7L21.36 12L22 15.3L18.84 16.73L17.82 19.96L14.46 19.64L12 22L9.54 19.64L6.18 19.96L5.16 16.73L2 15.3L2.64 12L2 8.7L5.16 7.27L6.18 4.04L9.54 4.36L12 2Z" />
    {completed && (
      <path
        d="M8 12.5L10.5 15L16 9"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    )}
  </svg>
);

const ProgressProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { authToken } = useAuth();
  const { api } = useAuthenticatedApi();

  useEffect(() => {
    if (authToken) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [profileRes, workRes] = await Promise.all([
            api.get('/freelancer/freelancer-profile/'),
            api.get('/freelancer/work-experience/'),
          ]);
          if (profileRes.data && profileRes.data.length > 0) {
            setProfileData(profileRes.data[0]);
          }
          setWorkExperiences(workRes.data || []);
        } catch {
          // Errors expected if no profile yet
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [authToken]);

  if (loading) {
    return (
      <div className="mt-4 p-5 bg-white border border-gray-100 rounded-[20px] shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-32 mb-4" />
        <div className="h-1.5 bg-gray-200 rounded-full mb-6 w-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded-lg" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!profileData) return null;

  const steps: Step[] = [
    { label: 'Profile', completed: !!(profileData.first_name && profileData.last_name) },
    { label: 'Bio', completed: !!profileData.bio },
    { label: 'Education', completed: !!(profileData.university_name && profileData.graduation_year_from && profileData.is_degree) },
    { label: 'Work experience', completed: workExperiences.length > 0 },
    { label: 'Skills', completed: !!(profileData.skills || profileData.soft_skills) },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const pct = Math.round((completedCount / steps.length) * 100);
  const leftPct = 100 - pct;

  return (
    <div className="mt-4 p-5 bg-white border border-gray-200 rounded-[20px] shadow-sm w-full mx-auto">
      <h2 className="text-[17px] font-bold text-[#111827] tracking-tight mb-1">
        Complete your profile
      </h2>
      <p className="text-[13px] text-[#6A737D] mb-4">
        {leftPct === 0 ? 'Profile complete! 🎉' : `Just ${leftPct}% left to complete`}
      </p>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#7052FF] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="space-y-4 pl-1">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3.5">
            <StarBadgeIcon completed={step.completed} />
            <span
              className={`text-[15px] ${
                step.completed ? 'text-[#7052FF]' : 'text-[#6A737D]'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressProfile;