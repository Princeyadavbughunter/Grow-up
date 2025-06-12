// @ts-nocheck
"use client";
import { useEffect, useState } from 'react';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { Eye, Users, Calendar, MapPin } from 'lucide-react';

interface JobPosting {
    id: string;
    company_name: string;
    logo: string;
    job_description: string;
    job_title: string;
    location: string;
    employment_type: string;
    required_skills: string;
    salary_range: string;
    created_at: string;
    is_active: string;
    about_role: string;
    experience: string;
    role: string;
    view_count: number;
    work_type: string | null;
    job_type: string | null;
    lat: number | null;
    long: number | null;
    skill_set: string;
    recruiter: string;
    user: string;
}

interface JobPostingsListProps {
    onSelectJob: (job: JobPosting) => void;
    onViewApplications: (job: JobPosting) => void;
    selectedJobId: string | null;
}

export default function JobPostingsList({ onSelectJob, onViewApplications, selectedJobId }: JobPostingsListProps) {
    const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
    const [loading, setLoading] = useState(true);
    const [applicationCounts, setApplicationCounts] = useState<{[key: string]: number}>({});
    
    const { api } = useAuthenticatedApi();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchJobPostings = async () => {
            try {
                setLoading(true);
                const response = await api.get('/company/app/job-posting/');
                setJobPostings(response.data);
                
                // Fetch application counts for each job
                const counts: {[key: string]: number} = {};
                for (const job of response.data) {
                    try {
                        const applicantsResponse = await api.get(`/company/app/get-applicants/?pk=${job.id}`);
                        counts[job.id] = applicantsResponse.data.application_count || 0;
                    } catch (error) {
                        console.error(`Error fetching applications for job ${job.id}:`, error);
                        counts[job.id] = 0;
                    }
                }
                setApplicationCounts(counts);
            } catch (error) {
                console.error('Error fetching job postings:', error);
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchJobPostings();
        }
    }, [authToken]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">Your Job Postings</h2>
                <p className="text-gray-600 text-xs sm:text-sm">{jobPostings.length} active job{jobPostings.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
                {jobPostings.map((job) => (
                    <div
                        key={job.id}
                        className={`bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedJobId === job.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => onSelectJob(job)}
                    >
                        <div className="p-3 sm:p-4">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <img 
                                    src={job.logo} 
                                    alt={job.company_name}
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                                        {job.job_title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                                        {job.company_name}
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3 flex-shrink-0" />
                                            <span className="truncate">{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 flex-shrink-0" />
                                            <span>{formatDate(job.created_at)}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mt-3">
                                        <div className="flex items-center gap-3 sm:gap-4 text-xs">
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <Eye className="w-3 h-3" />
                                                <span>{job.view_count} views</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-green-600">
                                                <Users className="w-3 h-3" />
                                                <span>{applicationCounts[job.id] || 0} applications</span>
                                            </div>
                                        </div>
                                        
                                        <span className={`px-2 py-1 text-xs rounded-full self-start sm:self-auto ${
                                            job.is_active === 'open' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {job.is_active}
                                        </span>
                                    </div>

                                    {(applicationCounts[job.id] || 0) > 0 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewApplications(job);
                                            }}
                                            className="w-full mt-3 bg-blue-600 text-white py-2 px-3 rounded-md text-xs sm:text-sm hover:bg-blue-700 transition-colors"
                                        >
                                            <span className="hidden sm:inline">View {applicationCounts[job.id]} Application{applicationCounts[job.id] !== 1 ? 's' : ''}</span>
                                            <span className="sm:hidden">{applicationCounts[job.id]} Applications</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {jobPostings.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
                    <div className="text-gray-400 mb-4">
                        <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
                    <p className="text-sm sm:text-base text-gray-600">Create your first job posting to start hiring talent.</p>
                </div>
            )}
        </div>
    );
} 