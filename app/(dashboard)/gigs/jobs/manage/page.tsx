// @ts-nocheck
"use client";
import { useState, useEffect } from 'react';
import { Search, Plus, Briefcase } from "lucide-react";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import JobPostingsList from '../_component/job-postings-list';
import JobApplications from '../_component/job-applications';
import Link from "next/link";

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

export default function ManageJobsPage() {
    const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
    const [showApplications, setShowApplications] = useState(false);
    const [hasAccess, setHasAccess] = useState<boolean>(false);
    const [checking, setChecking] = useState<boolean>(true);
    
    const { api } = useAuthenticatedApi();
    const { authToken } = useAuth();
    const router = useRouter();

    // Check if user has job postings to access this page
    useEffect(() => {
        const checkAccess = async () => {
            try {
                setChecking(true);
                const response = await api.get('/company/app/job-posting/');
                
                if (response.data && response.data.length > 0) {
                    setHasAccess(true);
                } else {
                    // Redirect to gigs page if no job postings
                    router.push('/gigs');
                }
            } catch (error) {
                console.error('Error checking user job postings:', error);
                router.push('/gigs');
            } finally {
                setChecking(false);
            }
        };

        if (authToken) {
            checkAccess();
        }
    }, [authToken]);

    const handleJobSelect = (job: JobPosting) => {
        setSelectedJob(job);
        setShowApplications(false);
    };

    const handleViewApplications = (job: JobPosting) => {
        setSelectedJob(job);
        setShowApplications(true);
    };

    const handleBackToJobs = () => {
        setShowApplications(false);
        setSelectedJob(null);
    };

    // Show loading while checking access
    if (checking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking access...</p>
                </div>
            </div>
        );
    }

    // Don't render anything if no access (will be redirected)
    if (!hasAccess) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with navigation */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-6">
                            <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
                            <nav className="flex items-center gap-4">
                                <Link 
                                    href="/gigs" 
                                    className="text-gray-600 hover:text-purple-600 font-medium transition-colors flex items-center gap-2"
                                >
                                    <Search className="w-4 h-4" />
                                    Browse Gigs
                                </Link>
                                <span className="text-purple-600 font-medium border-b-2 border-purple-600 pb-1 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" />
                                    Manage Jobs
                                </span>
                            </nav>
                        </div>
                        <Link 
                            href="/gigs/post-gig" 
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Post Job
                        </Link>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!showApplications ? (
                    <div className="flex gap-8">
                        {/* Left Column - Job Postings List */}
                        <div className="w-[400px] flex-shrink-0">
                            <JobPostingsList 
                                onSelectJob={handleJobSelect}
                                onViewApplications={handleViewApplications}
                                selectedJobId={selectedJob?.id ?? null}
                            />
                        </div>

                        {/* Right Column - Job Details */}
                        <div className="flex-1">
                            {selectedJob ? (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <img 
                                            src={selectedJob.logo} 
                                            alt={selectedJob.company_name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">
                                                {selectedJob.job_title}
                                            </h1>
                                            <p className="text-gray-600">{selectedJob.company_name}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                                            <p className="text-gray-700">{selectedJob.job_description}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">About the Role</h3>
                                            <p className="text-gray-700">{selectedJob.about_role}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="font-medium">Location:</span>
                                                <p className="text-gray-700">{selectedJob.location}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Employment Type:</span>
                                                <p className="text-gray-700">{selectedJob.employment_type}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Experience:</span>
                                                <p className="text-gray-700">{selectedJob.experience}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Salary Range:</span>
                                                <p className="text-gray-700">{selectedJob.salary_range}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
                                            <p className="text-gray-700">{selectedJob.required_skills}</p>
                                        </div>

                                        <button
                                            onClick={() => handleViewApplications(selectedJob)}
                                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            View Applications
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                                    <h2 className="text-xl text-gray-600">Select a job posting to view details</h2>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <JobApplications 
                        job={selectedJob!}
                        onBack={handleBackToJobs}
                    />
                )}
            </main>
        </div>
    );
} 