// @ts-nocheck
"use client";

import { useState } from "react";
import { Search, Plus, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import JobList from "./job-list";
import JobDetails from "./job-details";
import JobApply from "./job-apply";
import JobFilters from "./job-filters";
import JobCategories from "./job-categories";
import Link from "next/link";

export default function JobBoard() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-gray-900">Job Board</h1>
              <nav className="flex items-center gap-4">
                <span className="text-purple-600 font-medium border-b-2 border-purple-600 pb-1">
                  Find Jobs
                </span>
                <Link 
                  href="/jobs/manage" 
                  className="text-gray-600 hover:text-purple-600 font-medium transition-colors flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  Manage Jobs
                </Link>
              </nav>
            </div>
            <Link 
              href="/jobs/post" 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Post Job
            </Link>
          </div>
        </div>
      </div>

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