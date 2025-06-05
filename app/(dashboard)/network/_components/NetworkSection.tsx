"use client";

import React from "react";

interface NetworkSectionProps {
  title: string;
  showAll?: boolean;
  children?: React.ReactNode;
}

export function NetworkSection({ title, showAll, children }: NetworkSectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        {showAll && (
          <button className="text-purple-600 text-sm hover:underline">
            See All
          </button>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}