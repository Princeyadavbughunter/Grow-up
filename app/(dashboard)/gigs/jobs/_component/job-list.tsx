"use client";

import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
const jobs: Job[] = [
  {
    id: 1,
    title: "Web Developer",
    company: "Cat Group",
    location: "India",
    type: "Internship",
    posted: "1hr ago",
    salary: "₹8000/month",
    duration: "3 Months",
    workType: "Remote",
    description: "Seeking a talented UI/UX Designer to spearhead our mobile app's design, creating intuitive and engaging user experiences.Work alongside product managers and engineers in a collaborative environment to translate our vision into a functional and visually appealing app.",
    responsibilities: [
      "5+ years of experience as a UI/UX Designer with hands on experience in Crafting wireframes, user stories, journeys, and mockups for a diverse range of devices.",
      "Solve design challenges with elegant solutions.",
      "Employ a user-centered approach to design, with a cycle of testing and iteration.",
      "Engage in collaborative problem-solving and idea generation."
    ],
    offers: [
      "A competitive salary with performance incentives",
      "Flexible working hours",
      "Health insurance coverage",
      "Professional development opportunities"
    ]
  },
  {
    id: 2,
    title: "Web Developer",
    company: "Cat Group",
    location: "India",
    type: "Internship",
    posted: "1hr ago",
    salary: "₹8000/month",
    duration: "3 Months",
    workType: "Remote",
    description: "Seeking a talented UI/UX Designer to spearhead our mobile app's design, creating intuitive and engaging user experiences.Work alongside product managers and engineers in a collaborative environment to translate our vision into a functional and visually appealing app.",
    responsibilities: [
      "5+ years of experience as a UI/UX Designer with hands on experience in Crafting wireframes, user stories, journeys, and mockups for a diverse range of devices.",
      "Solve design challenges with elegant solutions.",
      "Employ a user-centered approach to design, with a cycle of testing and iteration.",
      "Engage in collaborative problem-solving and idea generation."
    ],
    offers: [
      "A competitive salary with performance incentives",
      "Flexible working hours",
      "Health insurance coverage",
      "Professional development opportunities"
    ]
  },
  {
    id: 3,
    title: "Web Developer",
    company: "Cat Group",
    location: "India",
    type: "Internship",
    posted: "1hr ago",
    salary: "₹8000/month",
    duration: "3 Months",
    workType: "Remote",
    description: "Seeking a talented UI/UX Designer to spearhead our mobile app's design, creating intuitive and engaging user experiences.Work alongside product managers and engineers in a collaborative environment to translate our vision into a functional and visually appealing app.",
    responsibilities: [
      "5+ years of experience as a UI/UX Designer with hands on experience in Crafting wireframes, user stories, journeys, and mockups for a diverse range of devices.",
      "Solve design challenges with elegant solutions.",
      "Employ a user-centered approach to design, with a cycle of testing and iteration.",
      "Engage in collaborative problem-solving and idea generation."
    ],
    offers: [
      "A competitive salary with performance incentives",
      "Flexible working hours",
      "Health insurance coverage",
      "Professional development opportunities"
    ]
  },
  {
    id: 4,
    title: "Web Developer",
    company: "Cat Group",
    location: "India",
    type: "Internship",
    posted: "1hr ago",
    salary: "₹8000/month",
    duration: "3 Months",
    workType: "Remote",
    description: "Seeking a talented UI/UX Designer to spearhead our mobile app's design, creating intuitive and engaging user experiences.Work alongside product managers and engineers in a collaborative environment to translate our vision into a functional and visually appealing app.",
    responsibilities: [
      "5+ years of experience as a UI/UX Designer with hands on experience in Crafting wireframes, user stories, journeys, and mockups for a diverse range of devices.",
      "Solve design challenges with elegant solutions.",
      "Employ a user-centered approach to design, with a cycle of testing and iteration.",
      "Engage in collaborative problem-solving and idea generation."
    ],
    offers: [
      "A competitive salary with performance incentives",
      "Flexible working hours",
      "Health insurance coverage",
      "Professional development opportunities"
    ]
  },
  {
    id: 5,
    title: "Web Developer",
    company: "Cat Group",
    location: "India",
    type: "Internship",
    posted: "1hr ago",
    salary: "₹8000/month",
    duration: "3 Months",
    workType: "Remote",
    description: "Seeking a talented UI/UX Designer to spearhead our mobile app's design, creating intuitive and engaging user experiences.Work alongside product managers and engineers in a collaborative environment to translate our vision into a functional and visually appealing app.",
    responsibilities: [
      "5+ years of experience as a UI/UX Designer with hands on experience in Crafting wireframes, user stories, journeys, and mockups for a diverse range of devices.",
      "Solve design challenges with elegant solutions.",
      "Employ a user-centered approach to design, with a cycle of testing and iteration.",
      "Engage in collaborative problem-solving and idea generation."
    ],
    offers: [
      "A competitive salary with performance incentives",
      "Flexible working hours",
      "Health insurance coverage",
      "Professional development opportunities"
    ]
  },
  {
    id: 6,
    title: "Web Developer",
    company: "Cat Group",
    location: "India",
    type: "Internship",
    posted: "1hr ago",
    salary: "₹8000/month",
    duration: "3 Months",
    workType: "Remote",
    description: "Seeking a talented UI/UX Designer to spearhead our mobile app's design, creating intuitive and engaging user experiences.Work alongside product managers and engineers in a collaborative environment to translate our vision into a functional and visually appealing app.",
    responsibilities: [
      "5+ years of experience as a UI/UX Designer with hands on experience in Crafting wireframes, user stories, journeys, and mockups for a diverse range of devices.",
      "Solve design challenges with elegant solutions.",
      "Employ a user-centered approach to design, with a cycle of testing and iteration.",
      "Engage in collaborative problem-solving and idea generation."
    ],
    offers: [
      "A competitive salary with performance incentives",
      "Flexible working hours",
      "Health insurance coverage",
      "Professional development opportunities"
    ]
  },
];

interface JobListProps {
  onSelectJob: (job: Job) => void;
  selectedJobId: number | null;
}

export default function JobList({ onSelectJob, selectedJobId }: JobListProps) {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          onClick={() => onSelectJob(job)}
          className={`bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${selectedJobId === job.id ? "ring-2 ring-purple-500" : ""
            }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-600">
                  {job.company} • {job.location}
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  {job.salary && (
                    <Badge variant="secondary">{job.salary}</Badge>
                  )}
                  {job.duration && (
                    <Badge variant="secondary">{job.duration}</Badge>
                  )}
                  {job.workType && (
                    <Badge variant="secondary">{job.workType}</Badge>
                  )}
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-500">{job.posted}</span>
          </div>
        </div>
      ))}
    </div>
  );
}