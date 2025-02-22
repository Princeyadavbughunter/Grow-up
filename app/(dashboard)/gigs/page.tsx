"use client";
import { useEffect, useState } from 'react';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import AllGigs from './components/AllGigs';
import Description from './components/Description';
import ApplicationForm from './components/ApplicationForm';



const GigsPage = () => {
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [selectedGig, setSelectedGig] = useState<Gig | null>(null);

    const { api } = useAuthenticatedApi();
 
    useEffect(() => {
        const fetchGigs = async () => {
            try {
                const response = await api.get('/freelancer/get-all-gigs/');
                setGigs(response.data);
            } catch (error) {
                console.error('Error fetching gigs:', error);
            }
        };

        fetchGigs();
    }, [api]);

    const handleGigSelect = (gig: Gig) => {
        setSelectedGig(gig);
    };

    return (
        <div className='max-w-[1350px] justify-center gap-8 mx-auto grid lg:grid-cols-3 px-10'>
            <AllGigs gigs={gigs} onSelectGig={handleGigSelect} />
            <Description selectedGig={selectedGig} />
            <ApplicationForm jobId={selectedGig?.id} />
        </div>
    );
};

export default GigsPage;