import React, { useState } from 'react';
import { Search, Building2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

const jobs: Job[] = Array(15).fill(null).map((_, i) => ({
    id: i + 1,
    title: "Web Developer",
    company: "Company name",
    location: "India",
    salary: "₹8000/month",
    duration: "3 Months",
    type: "Remote",
    description: "Seeking a talented UI/UX Designer to spearhead our mobile app's design, creating intuitive and engaging user experiences.",
    postedAgo: "1hr ago",
}));

const Sidebar = () => {
    // State to track active tabs
    const [activeDomainTab, setActiveDomainTab] = useState<string>("Remote");
    const [activeJobTypeTab, setActiveJobTypeTab] = useState<string>("All");

    return (
        <div className="bg-gray-50 lg:px-0 flex justify-center px-5">
            <div className="max-w-[450px] w-full">
                {/* Fixed Header Section */}
                <div className="sticky top-0 z-10 bg-gray-50 py-4 space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input placeholder="Search by Title, Location" className="pl-10" />
                    </div>

                    {/* Domain Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {["Domain", "Remote", "Hybrid", "Onsite", "Latest"].map((tab) => (
                            <Button
                                key={tab}
                                variant={activeDomainTab === tab ? "default" : "secondary"}
                                className={activeDomainTab === tab ? "bg-violet-600 hover:bg-violet-500 rounded-full" : "rounded-full"}
                                onClick={() => setActiveDomainTab(tab)}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>

                    {/* Job Type Tabs */}
                    <div className="flex space-x-4">
                        {["All", "Freelance", "Collaboration", "Internship"].map((tab) => (
                            <Button
                                key={tab}
                                variant={activeJobTypeTab === tab ? "default" : "ghost"}
                                className={activeJobTypeTab === tab ? "bg-violet-600 hover:bg-violet-500 rounded-full" : "rounded-full"}
                                onClick={() => setActiveJobTypeTab(tab)}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Scrollable Job Cards Section */}
                <div className="overflow-y-auto h-[400px] space-y-4">
                    {jobs.map((job) => (
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
        </div>
    );
};

export default Sidebar;
