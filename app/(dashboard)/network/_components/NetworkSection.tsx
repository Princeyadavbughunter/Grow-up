"use client";

import React from "react";

interface NetworkSectionProps {
  title: string;
  showAll?: boolean;
  children?: React.ReactNode;
}

export function NetworkSection({ title, showAll, children }: NetworkSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {showAll && (
          <button className="text-[#7052FF] text-xs font-medium hover:underline transition-colors">
            See All
          </button>
        )}
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}