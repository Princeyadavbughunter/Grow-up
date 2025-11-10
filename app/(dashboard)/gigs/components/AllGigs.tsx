// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Search, Building2, Bookmark, BookmarkCheck } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthenticatedApi } from "@/context/AuthContext";
import { toast } from "sonner";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGigId, setSelectedGigId] = useState<string | null>(null);
  const [localGigs, setLocalGigs] = useState<Gig[]>(gigs || []);
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

  return (
    <div className="bg-gray-50  py-2 px-1 sm:px-2 md:px-4 lg:px-3 w-full">
      <div className="w-full mx-auto lg:max-w-full">
        <div className="sticky top-0 z-10 bg-gray-50 pt-1 pb-2">
          <div className="relative bg-[#6A737D0F] rounded-lg mb-2">
            <Search className="absolute left-2 top-2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            <Input 
              placeholder="Search by Title, Location" 
              className="pl-7 sm:pl-8 py-1 sm:py-1.5 rounded-lg border-none text-xs sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap mb-2 sm:mb-3 gap-1 sm:gap-2">
            {[ "Remote", "Hybrid", "Onsite"].map((tab) => (
              <Button
                key={tab}
                variant={activeWorkType === tab ? "default" : "secondary"}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm h-6 sm:h-8 ${activeWorkType === tab 
                  ? "bg-violet-600 hover:bg-violet-500 rounded-full" 
                  : "rounded-full"}`}
                onClick={() => handleWorkTypeChange(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4 mb-2 sm:mb-3">
            {["All", "Freelance", "Collaboration", "Internship", "Contract", "Full Time", "Part time"].map((tab) => (
              <button
                key={tab}
                className={`px-1 sm:px-2 py-1 text-xs sm:text-sm relative ${
                  activeJobType === tab 
                    ? "text-violet-600 font-medium" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => handleJobTypeChange(tab)}
              >
                {tab}
                {activeJobType === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-scroll h-[calc(100vh-32rem)] space-y-2 sm:space-y-3 mt-1">
          {filteredGigs.length > 0 ? (
            filteredGigs.map((gig) => (
              <Card 
                key={gig.id} 
                className={`cursor-pointer transition-all ${
                  selectedGigId === gig.id 
                    ? 'border-violet-500 shadow' 
                    : 'hover:shadow-sm'
                } rounded-lg`}
                onClick={() => handleGigClick(gig)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{gig.job_title}</h3>
                        <button 
                          onClick={(e) => handleBookmark(e, gig)}
                          className="text-violet-600 hover:text-violet-800"
                        >
                          {gig.is_bookmark ? (
                            <BookmarkCheck className="h-5 w-5" />
                          ) : (
                            <Bookmark className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        {gig.about_role} | {gig.location}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs font-medium text-gray-700">
                          {gig.is_unpaid || !gig.salary_range || gig.salary_range.trim() === '' ? (
                            <span className="text-orange-600 font-medium">Unpaid</span>
                          ) : (
                            `₹${gig.salary_range}/month`
                          )}
                        </p>
                        <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
                          {gig.employment_type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
              <p>No gigs found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllGigs;