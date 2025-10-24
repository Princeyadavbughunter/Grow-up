// @ts-nocheck
"use client";
import { useEffect, useState } from 'react';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { Briefcase, Users, Bookmark } from 'lucide-react';
import AllGigs from './components/AllGigs';
import Description from './components/Description';
import ApplicationForm from './components/ApplicationForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
                // Fetch all gigs from the general endpoint
                const response = await api.get('/freelancer/get-all-gigs/', {
                    params: {
                        work_type: workType !== "Domain" ? workType.toLowerCase() : "",
                        job_type: jobType !== "All" ? jobType.toLowerCase() : ""
                    }
                });
                
                // Merge with user's job postings to ensure they see their own gigs
                const allGigs = response.data || [];
                const userGigIds = new Set(userJobPostings.map(job => job.id));
                
                // Add user's job postings that might not be in the general list
                const mergedGigs = [...allGigs];
                for (const userJob of userJobPostings) {
                    const existsInGigs = allGigs.some(gig => gig.id === userJob.id);
                    if (!existsInGigs) {
                        // Transform user job posting to match gig format
                        const gigFormat = {
                            ...userJob,
                            employment_type: userJob.job_type || userJob.employment_type,
                            is_bookmark: false,
                            is_applied: false,
                        };
                        mergedGigs.push(gigFormat);
                    }
                }
                
                setGigs(mergedGigs);
            } catch (error) {
                console.error('Error fetching gigs:', error);
            }
        };
        if (authToken) {
            fetchGigs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authToken, workType, jobType, userJobPostings]);

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
        <div className='max-w-[1350px] font-work-sans bg-gray-50 md:py-3 sm:py-3 py-2 mx-auto px-2 sm:px-4 md:px-6 lg:px-10'>
            {/* Navigation to Saved Jobs */}
            <div className="mb-2 sm:mb-3 flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Browse Jobs</h1>
                <Link href="/gigs/saved">
                    <Button 
                        variant="outline" 
                        className="flex items-center gap-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50 border-violet-300"
                    >
                        <Bookmark className="w-4 h-4" />
                        <span className="hidden sm:inline">Saved Jobs</span>
                        <span className="sm:hidden">Saved</span>
                    </Button>
                </Link>
            </div>

                {!checkingJobs && hasJobPostings && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 md:p-4 mb-2 sm:mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-blue-800">
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Users className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                                <span className="font-medium text-xs sm:text-sm md:text-base">
                                    You have {userJobPostings.length} job posting{userJobPostings.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <Link href="/gigs/jobs/manage" className="underline text-xs sm:text-sm md:text-base hover:text-blue-900 sm:ml-1">
                                manage applications
                            </Link>
                        </div>
                    </div>
                )}
            

            {/* Main Gigs Content */}
            <div className=' overflow-y-auto md:overflow-y-hidden h-[calc(100vh-10rem)] gap-2 sm:gap-4 md:gap-6 lg:gap-8 grid lg:grid-cols-3'>
                <AllGigs
                    gigs={gigs}
                    onSelectGig={handleGigSelect}
                    activeWorkType={workType}
                    activeJobType={jobType}
                    onFilterChange={handleFilterChange}
                />
                <Description showSmaller={hasJobPostings} selectedGig={selectedGig} />
                <ApplicationForm
                    jobId={selectedGig?.id}
                    isApplied={selectedGig?.is_applied || false}
                />
            </div>
        </div>
    );
};

export default GigsPage;