"use client";

import { Button } from "@/components/ui/button";

const filters = ["Web3 Club", "Coders Club", "Designers Club","Growth Club", "Memes Club"];

export function EventFilters() {
  return (
    <div className="flex gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant="secondary"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full"
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}