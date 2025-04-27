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
}

const MyExperience: React.FC<MyExperienceProps> = ({ id }) => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();

  useEffect(() => {
    if (authToken) {
      fetchExperiences();
    }
  }, [authToken]);

  const fetchExperiences = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get(`/freelancer/work-experience/?id=${id}`);
      console.log(response.data);
      
      // Sort experiences by start date (most recent first)
      const sortedExperiences = [...response.data].sort((a, b) => 
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      );
      setExperiences(sortedExperiences);
      setError(null);
    } catch (error) {
      console.error('Error fetching work experiences:', error);
      setError('Failed to load experiences. Please try refreshing the page.');
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
        <div className="mb-4">
          <h2 className="text-xl font-bold">Experience</h2>
        </div>
        
        {loading ? (
          <div className="text-center py-10">Loading experiences...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {experiences.length === 0 ? (
              <div className="text-center py-6 text-gray-500 border border-dashed rounded-md p-10">
                <p>No work experience available.</p>
              </div>
            ) : (
              experiences.map((experience) => (
                <div key={experience.id} className="flex gap-4 p-4 border rounded-md">
                  {/* Company logo placeholder */}
                  <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded text-lg font-bold">
                    {experience.company_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div>
                      <h3 className="font-semibold text-lg">{experience.position}</h3>
                      <p className="text-md">
                        {experience.company_name}
                        {experience.job_location && ` - ${experience.job_location}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(experience.start_date)} – {experience.currently_working ? 'Present' : formatDate(experience.end_date || '')} · {calculateDuration(experience.start_date, experience.end_date, experience.currently_working)}
                      </p>
                      {experience.location && (
                        <p className="text-sm text-gray-500">{experience.location}</p>
                      )}
                    </div>
                    {experience.description && (
                      <p className="text-sm text-gray-600 mt-3 whitespace-pre-line">
                        {experience.description}
                      </p>
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