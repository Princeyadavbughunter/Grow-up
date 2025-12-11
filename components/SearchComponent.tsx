'use client'

import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface FreelancerSearchResult {
  id: string;
  is_following: boolean;
  follow_request_sent: boolean;
  work_experience: Array<{
    id: string;
    company_name?: string;
    position?: string;
    start_date?: string;
    end_date?: string;
    current?: boolean;
    description?: string;
  }>;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  bio: string;
  university_name: string;
  graduation_year_from: string;
  profile_picture: string | null;
  address: string;
  lat: number | null;
  long: number | null;
  city: string;
  district: string;
  pincode: number;
  state: string;
  interest_in: string;
  hobbies: string;
  highest_qualification: string;
  passing_year: string;
  created_at: string;
  degree_name: string;
  is_degree: boolean;
  resume: string | null;
  skills: string;
  gender: string;
  saved_jobs_count: number;
  follower_count: number;
  dribble_account: string | null;
  github_account: string | null;
  figma_account: string | null;
  youtube_account: string | null;
  medium_account: string | null;
  soft_skills: string;
  position: string;
  facebook_account: string | null;
  linkedin_account: string | null;
  instagram_account: string | null;
  twitter_account: string | null;
  user: string;
}

interface SearchComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FreelancerSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiCaller } = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiCaller.get(`/freelancer/freelancers-fulltext-search/?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data || []);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Failed to search freelancers');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const handleProfileClick = (profileId: string) => {
    router.push(`/profile/${profileId}`);
    onClose();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16">
      <div
        ref={searchRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
      >
        {/* Search Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <FiSearch className="text-gray-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search freelancers by name, email, skills..."
              value={searchQuery}
              onChange={handleInputChange}
              className="flex-1 border-none shadow-none text-lg focus-visible:ring-0"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="p-2"
            >
              <FiX className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7052FF] mx-auto mb-2"></div>
              Searching...
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          )}

          {!isLoading && !error && searchResults.length === 0 && searchQuery && (
            <div className="p-4 text-center text-gray-500">
              No freelancers found for "{searchQuery}"
            </div>
          )}

          {!isLoading && searchResults.map((freelancer) => (
            <div
              key={freelancer.id}
              className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleProfileClick(freelancer.id)}
            >
              <div className="flex items-center gap-3">
                {freelancer.profile_picture ? (
                  <Image
                    src={freelancer.profile_picture}
                    alt={`${freelancer.first_name} ${freelancer.last_name}`}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {freelancer.first_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {freelancer.first_name} {freelancer.last_name}
                    </h3>
                    {freelancer.position && (
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {freelancer.position}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {freelancer.city}, {freelancer.state}
                  </p>

                  {freelancer.bio && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {freelancer.bio}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    {freelancer.skills && (
                      <span>Skills: {freelancer.skills}</span>
                    )}
                    {freelancer.follower_count > 0 && (
                      <span>{freelancer.follower_count} followers</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {searchResults.length > 0 && (
          <div className="p-3 bg-gray-50 text-center">
            <span className="text-sm text-gray-500">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
