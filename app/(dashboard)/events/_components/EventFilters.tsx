"use client";

import { Button } from "@/components/ui/button";

const filters = ["Tech", "Product", "Design", "Web & Mobile Dev"];

export function EventFilters() {
  return (
    <div className="flex gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant="secondary"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}