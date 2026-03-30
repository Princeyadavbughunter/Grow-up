"use client";
import React, { useEffect, useState } from 'react';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { Bookmark, Briefcase, MapPin, Building2, Calendar, FileText, Pickaxe, Send, Lock } from 'lucide-react';
import Link from 'next/link';
import MyApplications from './MyApplications';
import { toast } from "sonner";

const ApplicationTracker = () => {
    const [activeTab, setActiveTab] = useState<'saved' | 'inprogress' | 'applied' | 'post'>('saved');
    const [savedJobs, setSavedJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { api } = useAuthenticatedApi();
    const { authToken, profileData } = useAuth();

    useEffect(() => {
        if (activeTab === 'saved' && authToken) {
            fetchSavedJobs();
        }
    }, [activeTab, authToken]);

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/freelancer/get-all-gigs/');
            const allGigs = response.data || [];
            const savedGigsOnly = allGigs.filter((gig: any) => gig.is_bookmark === true);
            setSavedJobs(savedGigsOnly);
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
            setSavedJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveBookmark = async (e: React.MouseEvent, gig: any) => {
        e.stopPropagation();
        try {
            const jobPostingId = gig.job_posting || gig.id;
            // The backend toggles save/unsave via POST payload with job_posting ID
            await api.post('/freelancer/saving-jobs/', { job_posting: jobPostingId });
            
            // Refetch array to catch the updated is_bookmark toggle
            const response = await api.get('/freelancer/get-all-gigs/');
            const allGigs = response.data || [];
            const savedGigsOnly = allGigs.filter((g: any) => g.is_bookmark === true);
            setSavedJobs(savedGigsOnly);
            
            toast.success('Job removed from saved');
        } catch (error) {
            console.error('Error removing bookmark:', error);
            toast.error('Failed to remove gig. Please try again.');
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Application</h2>
            
            {/* Navigation Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
                <button
                    onClick={() => setActiveTab('saved')}
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border ${activeTab === 'saved' ? 'border-[#7052FF] bg-purple-50 text-[#7052FF]' : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'} transition-all`}
                >
                    <Bookmark className={`w-5 h-5 mb-1 ${activeTab === 'saved' ? 'fill-current' : ''}`} />
                    <span className="text-xs font-semibold">Saved</span>
                </button>
                <button
                    onClick={() => setActiveTab('inprogress')}
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border ${activeTab === 'inprogress' ? 'border-[#7052FF] bg-purple-50 text-[#7052FF]' : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'} transition-all`}
                >
                    <Pickaxe className={`w-5 h-5 mb-1 ${activeTab === 'inprogress' ? 'fill-current' : ''}`} />
                    <span className="text-xs font-semibold">In Progress</span>
                </button>
                <button
                    onClick={() => setActiveTab('applied')}
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border ${activeTab === 'applied' ? 'border-[#7052FF] bg-purple-50 text-[#7052FF]' : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'} transition-all`}
                >
                    <Send className={`w-5 h-5 mb-1 ${activeTab === 'applied' ? 'fill-current' : ''}`} />
                    <span className="text-xs font-semibold">Applied</span>
                </button>
                <button
                    onClick={() => setActiveTab('post')}
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border ${activeTab === 'post' ? 'border-[#7052FF] bg-purple-50 text-[#7052FF]' : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'} transition-all`}
                >
                    <FileText className={`w-5 h-5 mb-1 ${activeTab === 'post' ? 'fill-current' : ''}`} />
                    <span className="text-xs font-semibold">Post</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[300px]">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7052FF]"></div>
                    </div>
                ) : (
                    <>
                        {/* SAVED TAB CONTENT */}
                        {activeTab === 'saved' && (
                            <div>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Bookmark className="w-5 h-5 text-[#7052FF]" />
                                    Saved Gigs
                                </h3>
                                
                                {savedJobs.length > 0 ? (
                                    <div className="space-y-4">
                                        {savedJobs.map((job) => (
                                            <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#7052FF]/30 hover:shadow-sm transition-all">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Building2 className="w-5 h-5 text-[#7052FF]" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-gray-900 line-clamp-1">
                                                            {job.job_title || job.title || 'Untitled Gig'}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 mb-2">
                                                            {job.about_role ? job.about_role : (job.company || job.company_name || 'GrowupBuddy Network')}
                                                        </p>
                                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="w-3.5 h-3.5" />
                                                                <span className="truncate">{job.location || 'Remote'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                <span>Saved: {formatDate(job.created_at)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={(e) => handleRemoveBookmark(e, job)}
                                                        className="text-[#7052FF] p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors group"
                                                        title="Remove from saved"
                                                    >
                                                        <Bookmark className="w-5 h-5 fill-current" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <Bookmark className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                        <p className="font-medium text-gray-600 mb-1">No Saved Gigs</p>
                                        <p className="text-sm text-gray-400 max-w-xs mx-auto">
                                            Jobs and gigs you save while browsing will appear here for quick access later.
                                        </p>
                                        <Link href="/gigs" className="mt-4 inline-block">
                                            <button className="text-sm font-medium text-[#7052FF] bg-purple-50 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors">
                                                Browse Gigs
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* APPLIED TAB CONTENT */}
                        {activeTab === 'applied' && (
                            <div className="-mt-8">
                                {/* Reusing the existing component logic for Applied! */}
                                <MyApplications profileId={profileData?.id} isOwnProfile={true} />
                            </div>
                        )}

                        {/* IN PROGRESS TAB CONTENT */}
                        {activeTab === 'inprogress' && (
                             <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <Pickaxe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="font-semibold text-gray-700 mb-2 text-lg">In Progress Gigs</h3>
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4 bg-white px-3 py-1.5 rounded-full shadow-sm w-fit mx-auto border border-gray-100">
                                    <Lock className="w-3 h-3" />
                                    <span>API Under Development</span>
                                </div>
                                <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
                                    This feature is currently being built by the development team. Soon you'll be able to track all your ongoing projects right here!
                                </p>
                            </div>
                        )}

                        {/* POST TAB CONTENT */}
                        {activeTab === 'post' && (
                             <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="font-semibold text-gray-700 mb-2 text-lg">Your Posted Gigs</h3>
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4 bg-white px-3 py-1.5 rounded-full shadow-sm w-fit mx-auto border border-gray-100">
                                    <Lock className="w-3 h-3" />
                                    <span>API Under Development</span>
                                </div>
                                <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
                                    The ability to manage your created posts and services directly from this dashboard will be unlocked once the backend APIs are deployed.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ApplicationTracker;
