// @ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
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

interface MyExperienceProps {
  id: string;
  workExperiences?: any[]; // Pre-loaded from profile data
  isOwnProfile?: boolean;  // Whether this is the current user's own profile
}

const MyExperience: React.FC<MyExperienceProps> = ({ id, workExperiences, isOwnProfile }) => {
  // @ts-ignore
  const [experiences, setExperiences] = useState<WorkExperience[]>(workExperiences || []);
  // @ts-ignore
  const [loading, setLoading] = useState<boolean>(false);
  // @ts-ignore
  const [error, setError] = useState<string | null>(null);

  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();

  useEffect(() => {
    // If pre-loaded from parent (e.g., from freelancer-details API), use it directly
    if (workExperiences && workExperiences.length > 0) {
      setExperiences(workExperiences);
      return;
    }
    // Try to fetch experiences - the API may support freelancer_id for other users too
    if (authToken && id) {
      fetchExperiences();
    }
  }, [authToken, id, isOwnProfile]);


  const fetchExperiences = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // For own profile use the clean endpoint; for others try freelancer_id filter
      const url = isOwnProfile
        ? `/freelancer/work-experience/`
        : `/freelancer/work-experience/?freelancer_id=${id}`;
      
      const response = await api.get(url);

      const data = Array.isArray(response.data) ? response.data : (response.data?.results || []);
      // Sort experiences by start date (most recent first)
      const sortedExperiences = [...data].sort((a, b) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      );
      setExperiences(sortedExperiences);
      setError(null);
    } catch (error: any) {
      console.warn('Could not fetch work experiences:', error?.response?.status);
      // Silently show empty - don't display error message for other users' profiles
      if (!isOwnProfile) {
        setError(null);
        setExperiences([]);
      } else {
        setError('Failed to load experiences. Please try refreshing the page.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Function to calculate duration
  const calculateDuration = (startDate: string, endDate: string | null, currentlyWorking: boolean): string => {
    if (!startDate) return '';

    const start = new Date(startDate);
    const end = currentlyWorking ? new Date() : (endDate ? new Date(endDate) : new Date());

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();

    const totalMonths = years * 12 + months;
    const displayYears = Math.floor(totalMonths / 12);
    const displayMonths = totalMonths % 12;

    let result = '';
    if (displayYears > 0) {
      result += `${displayYears} yr${displayYears !== 1 ? 's' : ''}`;
    }
    if (displayMonths > 0 || displayYears === 0) {
      if (result) result += ' ';
      result += `${displayMonths} mo${displayMonths !== 1 ? 's' : ''}`;
    }
    return result;
  };

  return (
    <div>
      <div className="py-10">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Experience</h2>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading experiences...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 font-medium">{error}</div>
        ) : (
          <div className="space-y-8">
            {experiences.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-2xl p-10 bg-gray-50/50">
                <p>No work experience available.</p>
              </div>
            ) : (
              experiences.map((experience, index) => (
                <div key={experience.id} className={`flex gap-4 relative ${index !== experiences.length - 1 ? 'border-b border-gray-100 pb-8' : ''}`}>
                  {/* Company Initial Circle */}
                  <div className="h-12 w-12 bg-[#F6F8FF] border border-gray-100 flex items-center justify-center rounded-xl text-lg font-bold text-[#7052FF] flex-shrink-0">
                    {experience.company_name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {experience.position}
                        </h3>
                        <p className="text-[15px] font-medium text-[#7052FF] mt-1">
                          {experience.company_name}
                          {experience.job_location && <span className="text-gray-400 font-normal"> · {experience.job_location}</span>}
                        </p>
                        <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
                          {formatDate(experience.start_date)} – {experience.currently_working ? 'Present' : formatDate(experience.end_date || '')}
                          <span className="text-gray-200">•</span>
                          <span className="text-gray-500">{calculateDuration(experience.start_date, experience.end_date, experience.currently_working)}</span>
                        </p>
                      </div>
                    </div>

                    {experience.description && (
                      <div className="mt-4 text-[14px] text-gray-600 leading-relaxed max-w-2xl whitespace-pre-line">
                        {experience.description}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyExperience;