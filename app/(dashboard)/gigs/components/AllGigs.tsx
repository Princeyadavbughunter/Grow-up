// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Building2, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthenticatedApi } from "@/context/AuthContext";
import { toast } from "sonner";
import ShareGigPopup from './ShareGigPopup';

interface Gig {
  id: string;
  job_title: string;
  about_role: string;
  location: string;
  salary_range: string;
  employment_type: string;
  is_bookmark: boolean;
  is_unpaid?: boolean;
}

interface AllGigsProps {
  gigs: Gig[];
  onSelectGig: (gig: Gig) => void;
  activeWorkType: string;
  activeJobType: string;
  onFilterChange: (type: string, value: string) => void;
}

const AllGigs = ({
  gigs,
  onSelectGig,
  activeWorkType,
  activeJobType,
  onFilterChange
}: AllGigsProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGigId, setSelectedGigId] = useState<string | null>(null);
  const [localGigs, setLocalGigs] = useState<Gig[]>(gigs || []);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showGigInfo, setShowGigInfo] = useState(true);
  const [gigToShare, setGigToShare] = useState<Gig | null>(null);
  const { api } = useAuthenticatedApi();

  useEffect(() => {
    setLocalGigs(gigs || []);
  }, [gigs]);

  const filteredGigs = (localGigs || []).filter(gig => {
    const searchLower = searchQuery.toLowerCase();
    return (
      gig.job_title.toLowerCase().includes(searchLower) ||
      gig.location.toLowerCase().includes(searchLower)
    );
  });

  const handleGigClick = (gig: Gig) => {
    setSelectedGigId(gig.id);
    onSelectGig(gig);
  };

  const handleBookmark = async (e: React.MouseEvent, gig: Gig) => {
    e.stopPropagation();

    try {
      // Backend treats POST as toggle operation
      await api.post('/freelancer/saving-jobs/', { job_posting: gig.id });

      // After successful API call, re-fetch gigs to get the updated bookmark state
      // This ensures we have the correct bookmark state from the backend
      const response = await api.get('/freelancer/get-all-gigs/', {
        params: {
          work_type: activeWorkType !== "Domain" ? activeWorkType.toLowerCase() : "",
          job_type: activeJobType !== "All" ? activeJobType.toLowerCase() : ""
        }
      });

      if (response.data) {
        setLocalGigs(response.data);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark. Please try again.');
    }
  };

  const handleWorkTypeChange = (tab: string) => {
    onFilterChange('work', tab);
  };

  const handleJobTypeChange = (tab: string) => {
    onFilterChange('job', tab);
  };

  const handleShare = (e: React.MouseEvent, gig: Gig) => {
    e.stopPropagation();
    setGigToShare(gig);
    setShowSharePopup(true);
  };

  return (
    <div className="bg-[#F4F7FF] py-2 px-1 sm:px-2 md:px-4 lg:px-3 w-full border-r border-[#EBE8FF] flex flex-col h-full rounded-xl lg:rounded-l-2xl">
      <div className="w-full mx-auto lg:max-w-full shrink-0 flex flex-col">
        <div className="sticky top-0 z-10 bg-[#F4F7FF] pt-1 pb-2">
          <div className="relative bg-white border border-[#EBE8FF] shadow-sm rounded-[20px] mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by Title, Location"
              className="pl-9 py-2 rounded-[20px] bg-white border-none text-xs sm:text-sm h-9 focus-visible:ring-0 placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1">
            <div
              onClick={() => handleWorkTypeChange("Domain")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-200 shrink-0 ${activeWorkType === "Domain"
                  ? "bg-[#6A5DE2] text-white border-none shadow-sm"
                  : "bg-white border-gray-200 text-gray-600"
                }`}
            >
              <span className="text-xs font-medium">Domain</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {["Remote", "Hybrid", "Onsite"].map((tab) => (
              <Button
                key={tab}
                variant={activeWorkType === tab ? "default" : "secondary"}
                className={`px-4 py-1.5 text-xs font-medium h-7 transition-all duration-200 ${activeWorkType === tab
                  ? "bg-[#6A5DE2] hover:bg-[#5849C9] text-white shadow-sm border-none"
                  : "bg-[#F4F5F7] hover:bg-gray-200 text-gray-600 border-none"} rounded-full shrink-0`}
                onClick={() => handleWorkTypeChange(tab)}
              >
                {tab}
              </Button>
            ))}
            <button className={`px-3 py-1.5 text-xs font-medium h-7 transition-all duration-200 bg-white border border-gray-200 text-gray-600 rounded-full shrink-0 flex items-center gap-1.5`}>
              Latest
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-6 mb-2 border-b border-[#F4F5F7] px-1 overflow-x-auto pb-1.5 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            {["All", "Freelance", "Collaboration", "Internship", "Contract", "Full Time", "Part time"].map((tab) => (
              <button
                key={tab}
                className={`py-2 text-xs sm:text-sm transition-colors duration-200 relative whitespace-nowrap ${activeJobType === tab
                  ? "text-[#6A5DE2] font-semibold"
                  : "text-gray-500 hover:text-gray-800 font-medium"
                  }`}
                onClick={() => handleJobTypeChange(tab)}
              >
                {tab}
                {activeJobType === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6A5DE2] rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Info Banner */}
          {showGigInfo && (
            <div className="bg-[#F8F7FF] rounded-xl p-3 mt-4 border border-[#EBE8FF]">
              <div className="flex items-start justify-between">
                <div className="flex gap-2.5">
                  <svg className="w-5 h-5 text-[#6A5DE2] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="8" r="1" fill="currentColor" />
                  </svg>
                  <div>
                    <h4 className="text-[#6A5DE2] text-xs font-semibold">What is a Gig?</h4>
                    <p className="text-[11px] text-gray-500 mt-1 leading-snug pr-2">
                      A gig is a freelancing opportunity where someone needs help with real work - design, development, marketing, content, or operations.
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowGigInfo(false)} className="text-[#6A5DE2] hover:bg-[#EBE8FF] rounded p-1 shrink-0 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-y-auto space-y-1 mt-2 pr-1 pb-4 h-[calc(100vh-18rem)]">
          {filteredGigs.length > 0 ? (
            filteredGigs.map((gig) => (
              <div
                key={gig.id}
                className={`cursor-pointer transition-all duration-200 relative group flex gap-3 py-3 pr-2 border-b border-[#F4F5F7] ${selectedGigId === gig.id
                  ? 'bg-[#F8F7FF]'
                  : 'bg-white hover:bg-gray-50'
                  }`}
                onClick={() => handleGigClick(gig)}
              >
                {/* Selection indicator line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-200 ${selectedGigId === gig.id ? 'bg-[#6A5DE2]' : 'bg-transparent group-hover:bg-gray-200'}`}></div>

                <div className="ml-3 h-12 w-12 bg-white rounded-xl flex items-center justify-center shrink-0 border border-gray-100 shadow-sm overflow-hidden p-1">
                  {/* Fallback pattern for logo */}
                  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="#FFEACB" />
                    <path d="M20 80L50 20L80 80H20Z" fill="#202020" stroke="#FFEACB" strokeWidth="4" strokeLinejoin="round" />
                    <path d="M35 80L50 50L65 80H35Z" fill="#F0B52B" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{gig.job_title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-0.5 truncate">
                        <span>{gig.about_role || "Company name"}</span>
                        <span className="mx-1 text-gray-300">|</span>
                        <span>{gig.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge variant="outline" className="text-[10px] font-medium px-2 py-0 border-gray-200 text-gray-600 rounded-full h-5">
                        {gig.employment_type}
                      </Badge>
                      {gig.is_bookmark && (
                        <span className="text-[10px] font-semibold text-green-600">Applied</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400">
                    <span>1hr ago</span>
                    {/* Hidden share/bookmark on hover for a cleaner look */}
                    <div className="hidden group-hover:flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 bottom-2">
                      <button
                        onClick={(e) => handleShare(e, gig)}
                        className="p-1 rounded bg-white border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-[#6A5DE2] transition-colors shadow-sm"
                        title="Share"
                      >
                        <Share2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => handleBookmark(e, gig)}
                        className="p-1 rounded bg-white border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-[#6A5DE2] transition-colors shadow-sm"
                        title="Bookmark"
                      >
                        <Bookmark className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
              <p>No gigs found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Share Popup */}
      {gigToShare && (
        <ShareGigPopup
          isOpen={showSharePopup}
          onClose={() => setShowSharePopup(false)}
          gigId={gigToShare.id}
          gigTitle={gigToShare.job_title}
        />
      )}
    </div>
  );
};

export default AllGigs;