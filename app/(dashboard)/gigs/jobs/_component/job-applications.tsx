// @ts-nocheck
"use client";
import { useEffect, useState } from 'react';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { ArrowLeft, Mail, MapPin, Calendar, Download, User, FileText } from 'lucide-react';

interface JobApplication {
    id: string;
    job_seeker_image: string;
    education: string | null;
    name_of_institute: string | null;
    mobile_number: string | null;
    address: string;
    date_of_birth: string | null;
    resume: string | null;
    email: string;
    company_user_id: string;
    cover_letter: string;
    submission_date: string;
    status: string;
    created_at: string;
    job_seeker: string;
    job_posting: string;
    user: string;
}

interface JobPosting {
    id: string;
    company_name: string;
    logo: string;
    job_title: string;
    location: string;
    employment_type: string;
    experience: string;
    salary_range: string;
    is_unpaid?: boolean;
}

interface JobApplicationsResponse {
    application_data: JobApplication[];
    application_count: number;
}

interface JobApplicationsProps {
    job: JobPosting;
    onBack: () => void;
}

export default function JobApplications({ job, onBack }: JobApplicationsProps) {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
    
    const { api } = useAuthenticatedApi();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const response = await api.get<JobApplicationsResponse>(`/company/app/get-applicants/?pk=${job.id}`);
                setApplications(response.data.application_data || []);
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setLoading(false);
            }
        };

        if (authToken && job.id) {
            fetchApplications();
        }
    }, [authToken, job.id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'submitted':
                return 'bg-blue-100 text-blue-800';
            case 'reviewed':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 h-[calc(100vh-17rem)] overflow-y-scroll sm:space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        Back to Jobs
                    </button>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <img 
                        src={job.logo} 
                        alt={job.company_name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 break-words">{job.job_title}</h1>
                        <p className="text-sm sm:text-base text-gray-600">{job.company_name}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {applications.length} application{applications.length !== 1 ? 's' : ''} received
                        </p>
                    </div>
                </div>
            </div>

            {selectedApplication ? (
                /* Application Details View */
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="flex items-center gap-4 mb-4 sm:mb-6">
                        <button
                            onClick={() => setSelectedApplication(null)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            Back to Applications
                        </button>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        {/* Applicant Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 mx-auto sm:mx-0">
                                {selectedApplication.job_seeker_image ? (
                                    <img 
                                        src={selectedApplication.job_seeker_image} 
                                        alt="Applicant"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                            {selectedApplication.email.split('@')[0]}
                                        </h2>
                                        <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 mt-1">
                                            <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="text-sm sm:text-base break-all">{selectedApplication.email}</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full self-center sm:self-auto ${getStatusColor(selectedApplication.status)}`}>
                                        {selectedApplication.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Contact Information</h3>
                                <div className="space-y-2">
                                    {selectedApplication.mobile_number && (
                                        <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                                            <span className="font-medium">Mobile:</span>
                                            <span>{selectedApplication.mobile_number}</span>
                                        </div>
                                    )}
                                    {selectedApplication.address && (
                                        <div className="flex items-start gap-2 text-gray-600 text-sm sm:text-base">
                                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                                            <span className="break-words">{selectedApplication.address}</span>
                                        </div>
                                    )}
                                    {selectedApplication.date_of_birth && (
                                        <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span>DOB: {formatDate(selectedApplication.date_of_birth)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Education</h3>
                                <div className="space-y-2">
                                    {selectedApplication.education && (
                                        <div className="text-gray-600 text-sm sm:text-base">
                                            <span className="font-medium">Degree:</span> <span className="break-words">{selectedApplication.education}</span>
                                        </div>
                                    )}
                                    {selectedApplication.name_of_institute && (
                                        <div className="text-gray-600 text-sm sm:text-base">
                                            <span className="font-medium">Institute:</span> <span className="break-words">{selectedApplication.name_of_institute}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Cover Letter */}
                        {selectedApplication.cover_letter && (
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Cover Letter</h3>
                                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                    <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words">
                                        {selectedApplication.cover_letter}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Resume */}
                        {selectedApplication.resume && (
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Resume</h3>
                                <a
                                    href={selectedApplication.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center sm:justify-start gap-2 bg-blue-50 text-blue-700 px-3 sm:px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors text-sm sm:text-base"
                                >
                                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>Download Resume</span>
                                </a>
                            </div>
                        )}

                        {/* Application Info */}
                        <div className="border-t pt-3 sm:pt-4">
                            <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                                <span>Applied on: {formatDate(selectedApplication.submission_date)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Applications List View */
                <div className="space-y-3 sm:space-y-4">
                    {applications.map((application) => (
                        <div
                            key={application.id}
                            className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedApplication(application)}
                        >
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    {application.job_seeker_image ? (
                                        <img 
                                            src={application.job_seeker_image} 
                                            alt="Applicant"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                                                {application.email.split('@')[0]}
                                            </h3>
                                            <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm mt-1">
                                                <Mail className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{application.email}</span>
                                            </div>
                                            {application.address && (
                                                <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm mt-1">
                                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{application.address}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="text-left sm:text-right flex-shrink-0">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(application.status)}`}>
                                                {application.status}
                                            </span>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {formatDate(application.submission_date)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs text-gray-500">
                                        {application.resume && (
                                            <div className="flex items-center gap-1">
                                                <FileText className="w-3 h-3" />
                                                <span>Resume attached</span>
                                            </div>
                                        )}
                                        {application.cover_letter && (
                                            <div className="flex items-center gap-1">
                                                <FileText className="w-3 h-3" />
                                                <span>Cover letter</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {applications.length === 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
                            <div className="text-gray-400 mb-4">
                                <User className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
                            </div>
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                            <p className="text-sm sm:text-base text-gray-600">Applications for this job will appear here.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 