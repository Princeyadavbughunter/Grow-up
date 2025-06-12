// @ts-nocheck
"use client";
import { useEffect, useState } from 'react';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { Briefcase, Users } from 'lucide-react';
import AllGigs from './components/AllGigs';
import Description from './components/Description';
import ApplicationForm from './components/ApplicationForm';
import Link from 'next/link';

const GigsPage = () => {
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
    const [workType, setWorkType] = useState<string>("Remote");
    const [jobType, setJobType] = useState<string>("All");
    const [userJobPostings, setUserJobPostings] = useState<any[]>([]);
    const [hasJobPostings, setHasJobPostings] = useState<boolean>(false);
    const [checkingJobs, setCheckingJobs] = useState<boolean>(true);

    const { api } = useAuthenticatedApi();
    const { authToken } = useAuth();
 
    // Fetch user's job postings to check if they have any
    useEffect(() => {
        const fetchUserJobPostings = async () => {
            try {
                setCheckingJobs(true);
                const response = await api.get('/company/app/job-posting/');
                setUserJobPostings(response.data || []);
                setHasJobPostings(response.data && response.data.length > 0);
            } catch (error) {
                console.error('Error fetching user job postings:', error);
                setHasJobPostings(false);
            } finally {
                setCheckingJobs(false);
            }
        };

        if (authToken) {
            fetchUserJobPostings();
        }
    }, [authToken]);

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                const response = await api.get('/freelancer/get-all-gigs/', {
 params: {
 work_type: workType !== "Domain" ? workType.toLowerCase() : "",
 job_type: jobType !== "All" ? jobType.toLowerCase() : ""
 }
                });
                setGigs(response.data);
            } catch (error) {
                console.error('Error fetching gigs:', error);
            }
        };
        if (authToken) {
            fetchGigs();
        }
 // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authToken, workType, jobType]);

    const handleGigSelect = (gig: Gig) => {
        setSelectedGig(gig);
    };

    const handleFilterChange = (type: string, value: string) => {
        if (type === 'work') {
            setWorkType(value);
        } else if (type === 'job') {
            setJobType(value);
        }
    };

    return (
        <div className='max-w-[1350px] bg-gray-50 py-3 sm:py-5 mx-auto px-4 sm:px-10'>
            {/* Header with View Applications Button */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Browse Gigs</h1>
                    
                    {!checkingJobs && hasJobPostings && (
                        <Link 
                            href="/gigs/jobs/manage" 
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-md"
                        >
                            <Briefcase className="w-4 h-4" />
                            View Applications
                            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full ml-1">
                                {userJobPostings.length}
                            </span>
                        </Link>
                    )}
                </div>
                
                {!checkingJobs && hasJobPostings && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 text-blue-800">
                            <Users className="w-5 h-5" />
                            <span className="font-medium">
                                You have {userJobPostings.length} job posting{userJobPostings.length !== 1 ? 's' : ''} - 
                                <Link href="/gigs/jobs/manage" className="underline ml-1 hover:text-blue-900">
                                    manage applications
                                </Link>
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Gigs Content */}
            <div className='justify-center gap-4 sm:gap-8 grid lg:grid-cols-3'>
                <AllGigs 
                    gigs={gigs} 
                    onSelectGig={handleGigSelect} 
                    activeWorkType={workType}
                    activeJobType={jobType}
                    onFilterChange={handleFilterChange}
                />
                <Description selectedGig={selectedGig} />
                <ApplicationForm 
                    jobId={selectedGig?.id} 
                    isApplied={selectedGig?.is_applied || false}
                />
            </div>
        </div>
    );
};

export default GigsPage;