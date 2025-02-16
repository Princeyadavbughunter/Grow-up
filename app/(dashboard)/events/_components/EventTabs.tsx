"use client";

import { Button } from "@/components/ui/button";

const tabs = [
  { label: "Upcoming", active: true },
  { label: "My Events", active: false },
  { label: "Past Events", active: false },
];

export function EventTabs() {
  return (
    <div className="flex gap-8 mb-6">
      {tabs.map((tab) => (
        <Button
          key={tab.label}
          variant="ghost"
          className={`px-0 ${tab.active ? "text-black font-semibold border-b-2 border-black rounded-none" : "text-gray-500"
            }`}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}