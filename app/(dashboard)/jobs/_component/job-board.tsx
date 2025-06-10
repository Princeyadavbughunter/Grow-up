// @ts-nocheck
"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import JobList from "./job-list";
import JobDetails from "./job-details";
import JobApply from "./job-apply";
import JobFilters from "./job-filters";
import JobCategories from "./job-categories";

export default function JobBoard() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Column - Job List */}
          <div className="w-[400px] flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by Title, Location"
                  className="pl-10"
                />
              </div>
            </div>
            <JobFilters />
            <JobCategories />
            <JobList 
              onSelectJob={setSelectedJob}
              selectedJobId={selectedJob?.id ?? null}
            />
          </div>

          {/* Center Column - Job Details */}
          <div className="flex-1 min-w-[500px]">
            <JobDetails job={selectedJob} />
          </div>

          {/* Right Column - Job Apply */}
          <div className="w-[320px] flex-shrink-0">
            <JobApply job={selectedJob} />
          </div>
        </div>
      </main>
    </div>
  );
}