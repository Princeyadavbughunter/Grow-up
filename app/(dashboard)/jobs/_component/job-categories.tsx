"use client";

import { cn } from "@/lib/utils";

const categories = [
  { name: "All", current: true },
  { name: "Freelance", current: false },
  { name: "Collaboration", current: false },
  { name: "Internship", current: false },
];

export default function JobCategories() {
  return (
    <div className="flex space-x-6 mb-6">
      {categories.map((category) => (
        <button
          key={category.name}
          className={cn(
            "text-sm font-medium pb-2 border-b-2",
            category.current
              ? "text-purple-600 border-purple-600"
              : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}