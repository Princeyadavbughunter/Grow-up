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
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Jobs
                    </button>
                </div>
                
                <div className="flex items-center gap-4">
                    <img 
                        src={job.logo} 
                        alt={job.company_name}
                        className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{job.job_title}</h1>
                        <p className="text-gray-600">{job.company_name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {applications.length} application{applications.length !== 1 ? 's' : ''} received
                        </p>
                    </div>
                </div>
            </div>

            {selectedApplication ? (
                /* Application Details View */
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => setSelectedApplication(null)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Applications
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Applicant Header */}
                        <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                {selectedApplication.job_seeker_image ? (
                                    <img 
                                        src={selectedApplication.job_seeker_image} 
                                        alt="Applicant"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {selectedApplication.email.split('@')[0]}
                                        </h2>
                                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                                            <Mail className="w-4 h-4" />
                                            <span>{selectedApplication.email}</span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedApplication.status)}`}>
                                        {selectedApplication.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                                <div className="space-y-2">
                                    {selectedApplication.mobile_number && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="font-medium">Mobile:</span>
                                            <span>{selectedApplication.mobile_number}</span>
                                        </div>
                                    )}
                                    {selectedApplication.address && (
                                        <div className="flex items-start gap-2 text-gray-600">
                                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span>{selectedApplication.address}</span>
                                        </div>
                                    )}
                                    {selectedApplication.date_of_birth && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>DOB: {formatDate(selectedApplication.date_of_birth)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Education</h3>
                                <div className="space-y-2">
                                    {selectedApplication.education && (
                                        <div className="text-gray-600">
                                            <span className="font-medium">Degree:</span> {selectedApplication.education}
                                        </div>
                                    )}
                                    {selectedApplication.name_of_institute && (
                                        <div className="text-gray-600">
                                            <span className="font-medium">Institute:</span> {selectedApplication.name_of_institute}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Cover Letter */}
                        {selectedApplication.cover_letter && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Cover Letter</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {selectedApplication.cover_letter}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Resume */}
                        {selectedApplication.resume && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Resume</h3>
                                <a
                                    href={selectedApplication.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Download className="w-5 h-5" />
                                    <span>Download Resume</span>
                                </a>
                            </div>
                        )}

                        {/* Application Info */}
                        <div className="border-t pt-4">
                            <div className="text-sm text-gray-500">
                                <span>Applied on: {formatDate(selectedApplication.submission_date)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Applications List View */
                <div className="space-y-4">
                    {applications.map((application) => (
                        <div
                            key={application.id}
                            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedApplication(application)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    {application.job_seeker_image ? (
                                        <img 
                                            src={application.job_seeker_image} 
                                            alt="Applicant"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {application.email.split('@')[0]}
                                            </h3>
                                            <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                                                <Mail className="w-3 h-3" />
                                                <span>{application.email}</span>
                                            </div>
                                            {application.address && (
                                                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>{application.address}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="text-right">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(application.status)}`}>
                                                {application.status}
                                            </span>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {formatDate(application.submission_date)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
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
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <div className="text-gray-400 mb-4">
                                <User className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                            <p className="text-gray-600">Applications for this job will appear here.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 