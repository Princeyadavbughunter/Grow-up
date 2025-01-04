"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function JobFilters() {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <Button variant="outline" className="text-sm">
        Domain <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
      <Button variant="secondary" className="text-sm">
        Remote
      </Button>
      <Button variant="outline" className="text-sm">
        Hybrid
      </Button>
      <Button variant="outline" className="text-sm">
        Onsite
      </Button>
      <Button variant="outline" className="text-sm">
        Latest <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}