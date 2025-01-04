"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EventCard() {
  return (
    <Card className="p-6 border-2 border-purple-100 rounded-3xl">
      <Badge className="bg-purple-100 text-purple-800 mb-2">Product</Badge>
      <div className="relative h-48 rounded-xl overflow-hidden mb-4">
        <img
          src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=400&fit=crop"
          alt="Event cover"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-yellow-100 text-yellow-800">Web, May 08 @ 6:00 PM</Badge>
          <Badge className="bg-purple-100 text-purple-800">456 Buddy</Badge>
        </div>
        <h3 className="text-xl font-bold">Building the fastest growing gamimg tech in India</h3>
        <p className="text-gray-600 text-sm">Learn to build a product from scratch, market it and much more</p>
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=faces"
            alt="Author"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-medium">by Ishan Sukul</div>
            <div className="text-sm text-gray-500">Co-Founder At Kleo Tech</div>
          </div>
        </div>
        <Button className="w-full">Register Now</Button>
      </div>
    </Card>
  );
}