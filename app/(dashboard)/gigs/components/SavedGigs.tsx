// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Search, Building2, X, Briefcase } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  job_posting?: string;
}

interface SavedGigsProps {
  onSelectGig: (gig: Gig) => void;
}

const SavedGigs = ({ onSelectGig }: SavedGigsProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGigId, setSelectedGigId] = useState<string | null>(null);
  const [savedGigs, setSavedGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { api } = useAuthenticatedApi();

  useEffect(() => {
    fetchSavedGigs();
  }, []);

  const fetchSavedGigs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/freelancer/saving-jobs/');
      setSavedGigs(response.data || []);
    } catch (error) {
      console.error('Error fetching saved gigs:', error);
      setSavedGigs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredGigs = (savedGigs || []).filter(gig => {
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

  const handleRemoveBookmark = async (e: React.MouseEvent, gig: Gig) => {
    e.stopPropagation();
    try {
      // The API might return job_posting field or use id
      const jobPostingId = gig.job_posting || gig.id;
      await api.post('/freelancer/saving-jobs/', { job_posting: jobPostingId });
      
      // Remove from local state
      setSavedGigs(prevGigs => prevGigs.filter(g => g.id !== gig.id));
      
      // If the removed gig was selected, clear selection
      if (selectedGigId === gig.id) {
        setSelectedGigId(null);
        onSelectGig(null);
      }
      
      toast.success('Job removed from saved');
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Failed to remove job. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-2 px-1 sm:px-2 md:px-4 lg:px-3 w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading saved jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-2 px-1 sm:px-2 md:px-4 lg:px-3 w-full">
      <div className="w-full mx-auto lg:max-w-full">
        <div className="sticky top-0 z-10 bg-gray-50 pt-1 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Saved Jobs
            </h2>
            <Badge variant="secondary" className="text-sm">
              {savedGigs.length} {savedGigs.length === 1 ? 'job' : 'jobs'}
            </Badge>
          </div>

          <div className="relative bg-[#6A737D0F] rounded-lg mb-2">
            <Search className="absolute left-2 top-2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            <Input 
              placeholder="Search saved jobs by title, location" 
              className="pl-7 sm:pl-8 py-1 sm:py-1.5 rounded-lg border-none text-xs sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-scroll h-[calc(100vh-25rem)] space-y-2 sm:space-y-3 mt-1">
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
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium text-sm sm:text-base flex-1">{gig.job_title}</h3>
                        <button 
                          onClick={(e) => handleRemoveBookmark(e, gig)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-all flex-shrink-0"
                          title="Remove from saved"
                        >
                          <X className="h-4 w-4" />
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
            <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
              {searchQuery ? (
                <>
                  <Search className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium">No saved jobs match your search</p>
                  <p className="text-gray-500 text-sm mt-1">Try different keywords</p>
                </>
              ) : (
                <>
                  <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-semibold text-lg">No saved jobs yet</p>
                  <p className="text-gray-500 text-sm mt-2 max-w-md">
                    Browse jobs and click the bookmark icon to save them for later
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedGigs;

