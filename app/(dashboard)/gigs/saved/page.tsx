// @ts-nocheck
"use client";
import { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Bookmark, ArrowLeft } from 'lucide-react';
import SavedGigs from '../components/SavedGigs';
import Description from '../components/Description';
import ApplicationForm from '../components/ApplicationForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SavedJobsPage = () => {
    const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
    const { authToken } = useAuth();

    const handleGigSelect = (gig: Gig) => {
        setSelectedGig(gig);
    };

    if (!authToken) {
        return (
            <div className='max-w-[1350px] font-work-sans bg-gray-50 md:py-3 sm:py-3 py-2 mx-auto px-2 sm:px-4 md:px-6 lg:px-10'>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-600">Please log in to view saved jobs</p>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-[1350px] font-work-sans bg-gray-50 md:py-3 sm:py-3 py-2 mx-auto px-2 sm:px-4 md:px-6 lg:px-10'>
            {/* Header with back button */}
            <div className="mb-3 sm:mb-4">
                <Link href="/gigs">
                    <Button 
                        variant="ghost" 
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 px-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm">Back to All Jobs</span>
                    </Button>
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Jobs</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Jobs you've bookmarked for later
                        </p>
                    </div>
                    <Bookmark className="h-8 w-8 text-violet-600" />
                </div>
            </div>

            {/* Main Content */}
            <div className='overflow-y-auto md:overflow-y-hidden h-[calc(100vh-14rem)] gap-2 sm:gap-4 md:gap-6 lg:gap-8 grid lg:grid-cols-3'>
                <SavedGigs onSelectGig={handleGigSelect} />
                <Description showSmaller={false} selectedGig={selectedGig} />
                <ApplicationForm
                    jobId={selectedGig?.id}
                    isApplied={selectedGig?.is_applied || false}
                />
            </div>
        </div>
    );
};

export default SavedJobsPage;

