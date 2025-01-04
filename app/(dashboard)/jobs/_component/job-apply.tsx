"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit2, Github, Linkedin } from "lucide-react";

interface JobApplyProps {
  job: Job | null;
}

export default function JobApply({ job }: JobApplyProps) {
  if (!job) {
    return (
      <div className="bg-white rounded-lg p-6 text-center text-gray-500">
        Select a job to apply
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12" />
          <div>
            <h2 className="text-lg font-semibold">Aryan Trivedi</h2>
            <p className="text-sm text-gray-600">
              Summary: Hi, I am Aryan - Founder at....
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            <Badge>UX Research</Badge>
            <Badge>UI/UX Design</Badge>
            <Badge>Product Design</Badge>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Add Project Link</h3>
          <Input placeholder="https://uxgeni.com/" />
        </div>

        <div>
          <h3 className="font-medium mb-2">Upload CV/Resume</h3>
          <Button variant="outline" className="w-full">
            Upload CV or Resume
          </Button>
        </div>

        <div>
          <h3 className="font-medium mb-2">Add Socials</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Github className="h-5 w-5" />
              <Input placeholder="@username" />
            </div>
            <div className="flex items-center space-x-2">
              <Linkedin className="h-5 w-5" />
              <Input placeholder="@username" />
            </div>
          </div>
        </div>

        <Button className="w-full">Apply</Button>
      </div>
    </div>
  );
}