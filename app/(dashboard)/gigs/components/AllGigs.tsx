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
      await api.post('/freelancer/saving-jobs/', { job_id: gig.id });
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
    <div className="bg-gray-50 lg:px-0 flex justify-center px-5">
      <div className="max-w-[450px] w-full">
        <div className="sticky top-0 z-10 bg-gray-50 py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by Title, Location" 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["Domain", "Remote", "Hybrid", "Onsite", "Latest"].map((tab) => (
              <Button
                key={tab}
                variant={activeWorkType === tab ? "default" : "secondary"}
                className={activeWorkType === tab ? "bg-violet-600 hover:bg-violet-500 rounded-full" : "rounded-full"}
                onClick={() => handleWorkTypeChange(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>

          <div className="flex space-x-4">
            {["All", "Freelance", "Collaboration", "Internship"].map((tab) => (
              <Button
                key={tab}
                variant={activeJobType === tab ? "default" : "ghost"}
                className={activeJobType === tab ? "bg-violet-600 hover:bg-violet-500 rounded-full" : "rounded-full"}
                onClick={() => handleJobTypeChange(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto h-[400px] space-y-4">
          {filteredGigs.length > 0 ? (
            filteredGigs.map((gig) => (
              <Card 
                key={gig.id} 
                className={`cursor-pointer transition-all ${
                  selectedGigId === gig.id 
                    ? 'border-violet-500 shadow-md' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleGigClick(gig)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-orange-500" />
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
                      <p className="text-sm text-gray-500">
                        {gig.about_role} | {gig.location}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{gig.salary_range}/month
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {gig.employment_type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-10 text-gray-500">
              <p>No gigs found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllGigs;