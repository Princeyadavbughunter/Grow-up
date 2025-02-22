import React, { useState } from 'react';
import { Search, Building2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AllGigsProps {
    gigs: Gig[];
    onSelectGig: (gig: Gig) => void;
}

const AllGigs = ({ gigs, onSelectGig }: AllGigsProps) => {
    const [activeDomainTab, setActiveDomainTab] = useState<string>("Remote");
    const [activeJobTypeTab, setActiveJobTypeTab] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedGigId, setSelectedGigId] = useState<string | null>(null);

    const filteredGigs = gigs.filter(gig => {
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
                                variant={activeDomainTab === tab ? "default" : "secondary"}
                                className={activeDomainTab === tab ? "bg-violet-600 hover:bg-violet-500 rounded-full" : "rounded-full"}
                                onClick={() => setActiveDomainTab(tab)}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>

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

                <div className="overflow-y-auto h-[400px] space-y-4">
                    {filteredGigs.map((gig) => (
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
                                        <h3 className="font-medium">{gig.job_title}</h3>
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllGigs;