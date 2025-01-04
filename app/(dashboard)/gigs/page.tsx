import React from 'react';
import { Search, MapPin, Clock, Building2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  duration: string;
  type: string;
  description: string;
  postedAgo: string;
}

const jobs: Job[] = Array(5).fill(null).map((_, i) => ({
  id: i + 1,
  title: "Web Developer",
  company: "Company name",
  location: "India",
  salary: "₹8000/month",
  duration: "3 Months",
  type: "Remote",
  description: "Seeking a talented UI/UX Designer to spearhead our mobile app's design, creating intuitive and engaging user experiences.",
  postedAgo: "1hr ago"
}));

const JobBoard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
        {/* Left Panel */}
        <div className="col-span-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by Title, Location" 
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary">Domain</Button>
            <Button variant="default" className="bg-violet-600">Remote</Button>
            <Button variant="secondary">Hybrid</Button>
            <Button variant="secondary">Onsite</Button>
            <Button variant="secondary">Latest</Button>
          </div>
          
          <div className="flex space-x-4">
            <Button variant="default" className="bg-violet-600">All</Button>
            <Button variant="ghost">Freelance</Button>
            <Button variant="ghost">Collaboration</Button>
            <Button variant="ghost">Internship</Button>
          </div>
          
          <div className="space-y-4">
            {jobs.map(job => (
              <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.company} | {job.location}</p>
                      <p className="text-sm text-gray-400">{job.postedAgo}</p>
                    </div>
                    <Badge variant="secondary">Internship</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Web Developer</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1" />
                  Cat Group India
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Remote
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  3 Months
                </div>
                <Badge variant="secondary">Internship</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">About Position</h3>
                <p className="text-gray-600">Seeking a talented UI/UX Designer to spearhead our mobile app's design, creating intuitive and engaging user experiences. Work alongside product managers and engineers in a collaborative environment to translate our vision into a functional and visually appealing app.</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Responsibilities</h3>
                <ul className="list-disc pl-4 space-y-2 text-gray-600">
                  <li>5+ years of experience as a UI/UX Designer with hands on experience in Crafting wireframes, user stories, journeys, and mockups for a diverse range of devices.</li>
                  <li>Solve design challenges with elegant solutions.</li>
                  <li>Employ a user-centered approach to design, with a cycle of testing and iteration.</li>
                  <li>Engage in collaborative problem-solving and idea generation.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">What we offer</h3>
                <p className="text-gray-600">A competitive salary with performance</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Add Project Link</h3>
                  <Input placeholder="https://uxofbhi.com/" />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Upload CV/Resume</h3>
                  <Input placeholder="Upload CV or Resume" />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Add Socials</h3>
                  <div className="space-y-2">
                    <Input placeholder="@username" />
                    <Input placeholder="@username" />
                  </div>
                </div>
                
                <Button className="w-full bg-violet-600">Apply</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;