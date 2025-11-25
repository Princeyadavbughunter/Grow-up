// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';
import { ArrowLeft, Building2, MapPin, Clock, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ApplicationForm from '../components/ApplicationForm';
import ShareGigPopup from '../components/ShareGigPopup';
import { toast } from 'sonner';

interface Gig {
    id: string;
    job_title: string;
    about_role: string;
    location: string;
    salary_range: string;
    employment_type: string;
    job_description: string;
    experience: string;
    required_skills: string;
    work_type: string;
    is_active: string;
    is_bookmark: boolean;
    is_applied: boolean;
    is_unpaid?: boolean;
}

const GigDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const { api } = useAuthenticatedApi();
    const { authToken } = useAuth();
    const [gig, setGig] = useState<Gig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSharePopup, setShowSharePopup] = useState(false);

    useEffect(() => {
        const fetchGigDetails = async () => {
            if (!authToken || !params.id) return;

            try {
                setLoading(true);
                setError(null);

                // Fetch all gigs and find the specific one
                const response = await api.get('/freelancer/get-all-gigs/');
                
                if (response.data) {
                    const foundGig = response.data.find((g: Gig) => g.id === params.id);
                    
                    if (foundGig) {
                        setGig(foundGig);
                    } else {
                        setError('Gig not found');
                    }
                } else {
                    setError('Gig not found');
                }
            } catch (error) {
                console.error('Error fetching gig details:', error);
                setError('Failed to load gig details');
                toast.error('Failed to load gig details');
            } finally {
                setLoading(false);
            }
        };

        fetchGigDetails();
    }, [authToken, params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-violet-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading gig details...</p>
                </div>
            </div>
        );
    }

    if (error || !gig) {
        return (
            <div className="h-flex flex-col">
                <div className=" z-10 flex-shrink-0">
                    <div className="max-w-6xl mx-auto px-4 py-4 ">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/gigs')}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-800">Gig Details</h1>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <div className="text-center py-12">
                            <p className="text-gray-600 mb-4">{error || 'Gig not found'}</p>
                            <Button onClick={() => router.push('/gigs')} variant="outline">
                                Back to Gigs
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="z-10 flex-shrink-0">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/gigs')}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-800">Gig Details</h1>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowSharePopup(true)}
                            className="flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Share
                        </Button>
                    </div>
                </div>
            </div>

            {/* Gig Content */}
            <div className="flex-1 overflow-y-auto ">
                <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
                    <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Gig Details */}
                    <div className="lg:col-span-2 ">
                        <Card className="border-gray-200 border rounded-xl shadow-sm">
                            <CardHeader>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="h-14 w-14 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Building2 className="h-7 w-7 text-violet-600" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl mb-2">{gig.job_title}</CardTitle>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Building2 className="h-4 w-4 mr-1" />
                                                {gig.about_role}
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {gig.location}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {gig.is_unpaid || !gig.salary_range || gig.salary_range.trim() === '' ? (
                                                    <span className="text-orange-600 font-medium">Unpaid</span>
                                                ) : (
                                                    `₹${gig.salary_range}/month`
                                                )}
                                            </div>
                                            <Badge variant="secondary">{gig.employment_type}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-gray-800">About Position</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {gig.job_description}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Role Details</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <span className="w-2 h-2 bg-violet-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <div>
                                                <span className="font-medium text-gray-700">Experience Required: </span>
                                                <span className="text-gray-600">{gig.experience}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-2 h-2 bg-violet-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <div>
                                                <span className="font-medium text-gray-700">Required Skills: </span>
                                                <span className="text-gray-600">{gig.required_skills}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-2 h-2 bg-violet-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <div>
                                                <span className="font-medium text-gray-700">Employment Type: </span>
                                                <span className="text-gray-600">{gig.employment_type}</span>
                                            </div>
                                        </li>
                                        {gig.work_type && (
                                            <li className="flex items-start">
                                                <span className="w-2 h-2 bg-violet-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <div>
                                                    <span className="font-medium text-gray-700">Work Type: </span>
                                                    <span className="text-gray-600">{gig.work_type}</span>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Additional Information</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <span className="w-2 h-2 bg-violet-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <div>
                                                <span className="font-medium text-gray-700">Salary: </span>
                                                {gig.is_unpaid || !gig.salary_range || gig.salary_range.trim() === '' ? (
                                                    <span className="text-orange-600 font-medium">Unpaid</span>
                                                ) : (
                                                    <span className="text-gray-600">₹{gig.salary_range}/month</span>
                                                )}
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-2 h-2 bg-violet-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <div>
                                                <span className="font-medium text-gray-700">Location: </span>
                                                <span className="text-gray-600">{gig.location}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-2 h-2 bg-violet-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <div>
                                                <span className="font-medium text-gray-700">Status: </span>
                                                <span className="text-gray-600">{gig.is_active}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Application Form Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-6">
                            <ApplicationForm
                                jobId={gig.id}
                                isApplied={gig.is_applied || false}
                            />
                        </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Share Popup */}
            <ShareGigPopup
                isOpen={showSharePopup}
                onClose={() => setShowSharePopup(false)}
                gigId={gig.id}
                gigTitle={gig.job_title}
            />
        </div>
    );
};

export default GigDetailPage;

