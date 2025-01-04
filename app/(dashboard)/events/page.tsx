"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventTabs } from "./_components/EventTabs";
import { EventFilters } from "./_components/EventFilters";
import { EventCard } from "./_components/EventCard";
import { EventParticipants } from "./_components/EventParticipants";

export default function EventsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <EventTabs />
      <EventFilters />
      
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-7">
          <EventCard />
        </div>
        
        <div className="col-span-5">
          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="comments" className="flex-1">Comments</TabsTrigger>
              <TabsTrigger value="participants" className="flex-1">Participants</TabsTrigger>
            </TabsList>
            <TabsContent value="comments">
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces"
                    alt="Priya Sharma"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">Priya Sharma</div>
                    <p className="text-sm text-gray-600">Lorem ipsum is simply dummy text of the printing and typesetting industry...</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">View all comments</Button>
              </div>
            </TabsContent>
            <TabsContent value="participants">
              <EventParticipants />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="fixed bottom-20 right-4">
        <Button className="rounded-full px-6" size="lg">
          Messages
        </Button>
      </div>
    </div>
  );
}