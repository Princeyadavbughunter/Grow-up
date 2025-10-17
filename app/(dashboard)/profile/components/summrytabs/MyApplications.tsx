// @ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { Building2, MapPin, Calendar, Briefcase, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';

interface JobApplication {
    id: string;
    job_posting: {
        id: string;
        job_title: string;
        company_name: string;
        logo: string;
        location: string;
        job_type: string;
        work_type: string;
        salary_range: string;
        is_unpaid?: boolean;
        created_at: string;
    };
    status: string;
    submission_date: string;
    cover_letter: string;
}

interface MyApplicationsProps {
    profileId?: string;
    isOwnProfile?: boolean;
}

const MyApplications: React.FC<MyApplicationsProps> = ({ profileId, isOwnProfile = false }) => {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const { api } = useAuthenticatedApi();
    const { authToken, profileData } = useAuth();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                
                // If viewing own profile or no profileId, fetch current user's applications
                if (isOwnProfile || !profileId) {
                    // Try multiple possible endpoints to get user applications
                    let applicationsData = [];
                    
                    // Try endpoint 1: my-applications
                    try {
                        const response1 = await api.get('/freelancer/my-applications/');
                        applicationsData = response1.data || [];
                    } catch (err1) {
                        console.log('Endpoint /freelancer/my-applications/ not available, trying alternatives...');
                        
                        // Try endpoint 2: get-my-applications
                        try {
                            const response2 = await api.get('/freelancer/get-my-applications/');
                            applicationsData = response2.data || [];
                        } catch (err2) {
                            console.log('Endpoint /freelancer/get-my-applications/ not available, trying alternatives...');
                            
                            // Try endpoint 3: freelancer-details with applications
                            try {
                                if (profileData?.id) {
                                    const response3 = await api.get(`/freelancer/freelancer-details/?id=${profileData.id}`);
                                    applicationsData = response3.data?.applications || [];
                                }
                            } catch (err3) {
                                console.log('Could not fetch applications from any endpoint');
                                console.error('All endpoints failed:', { err1, err2, err3 });
                            }
                        }
                    }
                    
                    setApplications(applicationsData);
                } else {
                    // When viewing another user's profile, we don't have permission
                    setApplications([]);
                }
            } catch (error) {
                console.error('Error fetching applications:', error);
                setApplications([]);
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchApplications();
        }
    }, [authToken, profileId, isOwnProfile, profileData?.id]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'submitted':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'reviewed':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'accepted':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

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
            <div className="my-8">
                <h2 className="text-lg font-bold mb-4">
                    {isOwnProfile ? 'My Applications' : 'Applications'}
                </h2>
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="my-8">
            <h2 className="text-lg font-bold mb-4">
                {isOwnProfile ? 'My Applications' : 'Applications'}
            </h2>
            
            {applications && applications.length > 0 ? (
                <div className="space-y-4">
                    {applications.map((application) => (
                        <div
                            key={application.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    {application.job_posting.logo ? (
                                        <img 
                                            src={application.job_posting.logo} 
                                            alt={application.job_posting.company_name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-purple-600" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-base">
                                                {application.job_posting.job_title}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {application.job_posting.company_name}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border flex-shrink-0 ${getStatusColor(application.status)}`}>
                                            {application.status}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{application.job_posting.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Briefcase className="w-4 h-4" />
                                            <span>{application.job_posting.job_type || 'Full Time'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{application.job_posting.work_type || 'Remote'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <DollarSign className="w-4 h-4" />
                                            <span>
                                                {application.job_posting.is_unpaid || !application.job_posting.salary_range ? (
                                                    <span className="text-orange-600 font-medium">Unpaid</span>
                                                ) : (
                                                    `₹${application.job_posting.salary_range}`
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>Applied: {formatDate(application.submission_date)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {isOwnProfile ? "No Applications Found" : "Applications Not Available"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                        {isOwnProfile 
                            ? "No job applications found. If you've recently applied to jobs, the application history will appear."
                            : "Job applications are private and only visible to the profile owner."}
                    </p>
                    {isOwnProfile && (
                        <Link href="/gigs" className="inline-block mt-4">
                            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                                Browse Available Gigs
                            </button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyApplications;

