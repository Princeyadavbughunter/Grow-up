import React, { useState, useEffect } from 'react';
import { Search, Building2, Bookmark, BookmarkCheck } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthenticatedApi } from "@/context/AuthContext";

interface Gig {
  id: string;
  job_title: string;
  about_role: string;
  location: string;
  salary_range: string;
  employment_type: string;
  is_bookmark: boolean;
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
  const [localGigs, setLocalGigs] = useState<Gig[]>(gigs);
  const { api } = useAuthenticatedApi();

  useEffect(() => {
    setLocalGigs(gigs);
  }, [gigs]);

  const filteredGigs = localGigs.filter(gig => {
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
      await api.post('/freelancer/saving-jobs/', { job_posting: gig.id });
      setLocalGigs(prevGigs =>
        prevGigs.map(g =>
          g.id === gig.id ? { ...g, is_bookmark: !g.is_bookmark } : g
        )
      );
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleWorkTypeChange = (tab: string) => {
    onFilterChange('work', tab);
  };

  const handleJobTypeChange = (tab: string) => {
    onFilterChange('job', tab);
  };

  return (
    <div className="bg-gray-50 py-3 px-2 lg:px-3 flex justify-center">
      <div className="max-w-[450px] w-full">
        <div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-3">
          <div className="relative bg-[#6A737D0F] rounded-xl mb-3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by Title, Location" 
              className="pl-8 py-1.5 rounded-xl border-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap mb-5 gap-2">
            {["Domain", "Remote", "Hybrid", "Onsite", "Latest"].map((tab) => (
              <Button
                key={tab}
                variant={activeWorkType === tab ? "default" : "secondary"}
                className={`px-3 py-1 text-sm ${activeWorkType === tab 
                  ? "bg-violet-600 hover:bg-violet-500 rounded-full" 
                  : "rounded-full"}`}
                onClick={() => handleWorkTypeChange(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>

          {["All", "Freelance", "Collaboration", "Internship"].map((tab) => (
        <button
          key={tab}
          className={`px-3 py-1 text-sm relative ${
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

        <div className="overflow-y-auto h-[450px] space-y-3 mt-1">
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
                          ₹{gig.salary_range}/month
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