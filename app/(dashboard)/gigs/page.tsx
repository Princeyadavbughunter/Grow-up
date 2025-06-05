// GigsPage.tsx
"use client";
import { useEffect, useState } from 'react';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import AllGigs from './components/AllGigs';
import Description from './components/Description';
import ApplicationForm from './components/ApplicationForm';

const GigsPage = () => {
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
    const [workType, setWorkType] = useState<string>("Remote");
    const [jobType, setJobType] = useState<string>("All");

    const { api } = useAuthenticatedApi();
    const { authToken } = useAuth();
 
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
        <div className='max-w-[1350px] bg-gray-50 py-3 sm:py-5 justify-center gap-4 sm:gap-8 mx-auto grid lg:grid-cols-3 px-4 sm:px-10'>
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
    );
};

export default GigsPage;