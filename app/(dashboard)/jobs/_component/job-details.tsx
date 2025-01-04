"use client";

import { Badge } from "@/components/ui/badge";

interface JobDetailsProps {
  job: Job | null;
}

export default function JobDetails({ job }: JobDetailsProps) {
  if (!job) {
    return (
      <div className="bg-white rounded-lg p-6 text-center text-gray-500">
        Select a job to view details
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <Badge variant="outline">{job.type}</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg">{job.company}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-500">{job.location}</span>
        </div>
        <div className="flex space-x-4">
          <Badge variant="secondary">{job.salary}</Badge>
          <Badge variant="secondary">{job.duration}</Badge>
          <Badge variant="secondary">{job.workType}</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">About Position</h2>
        
        <div>
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-gray-600">{job.description}</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Responsibilities</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            {job.responsibilities?.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-2">What we offer</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            {job.offers?.map((offer, index) => (
              <li key={index}>{offer}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}