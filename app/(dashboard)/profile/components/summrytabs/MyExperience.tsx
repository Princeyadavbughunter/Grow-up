"use client";
import React, { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
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

const MyExperience: React.FC = () => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchExperiences = async (): Promise<void> => {
      try {
        const response = await api.get('/freelancer/work-experience/');
        setExperiences(response.data);
      } catch (error) {
        console.error('Error fetching work experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchExperiences();
    }
  }, [authToken]);

  // Function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Function to calculate duration
  const calculateDuration = (startDate: string, endDate: string | null, currentlyWorking: boolean): string => {
    const start = new Date(startDate);
    const end = currentlyWorking ? new Date() : new Date(endDate || '');
    
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    
    const totalMonths = years * 12 + months;
    const displayYears = Math.floor(totalMonths / 12);
    const displayMonths = totalMonths % 12;
    
    return `${displayYears} yr${displayYears !== 1 ? 's' : ''} ${displayMonths} mo${displayMonths !== 1 ? 's' : ''}`;
  };

  return (
    <div>
      <div className="py-10">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-lg font-bold">My Experience</h2>
          <div className="flex items-center gap-2">
            <IoMdAdd className="text-xl cursor-pointer" />
            <CiEdit className="text-xl cursor-pointer" />
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-10">Loading experiences...</div>
        ) : (
          <div className="space-y-4">
            {experiences.map((experience) => (
              <div key={experience.id} className="flex gap-2">
                {/* Company logo placeholder - replace with actual logo if available */}
                <div className="h-10 w-10 bg-gray-200 flex items-center justify-center rounded">
                  {experience.company_name.charAt(0)}
                </div>
                <div className="div">
                  <h3 className="font-semibold">{experience.position}</h3>
                  <p className="text-sm text-gray-500">
                    {experience.company_name} - {experience.job_location}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatDate(experience.start_date)} – {experience.currently_working ? 'Present' : formatDate(experience.end_date || '')} · {calculateDuration(experience.start_date, experience.end_date, experience.currently_working)}
                  </p>
                  <p className="text-sm text-gray-400">{experience.location}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {experience.description.length > 100 
                      ? `${experience.description.substring(0, 100)}...` 
                      : experience.description}
                  </p>
                  {/* Team members placeholder - can be replaced with actual team data if available */}
                  <div className="flex items-center gap-2 py-4">
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyExperience;