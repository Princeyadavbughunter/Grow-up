"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchIcon } from "lucide-react";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  date: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  freelancer: string | null;
  attendees: Attendee[];
  category_name?: string;
  skills_learning?: string;
  event_by?: string;
  event_title?: string;
  event_host_profession?: string;
  freelancer_profile_picture?: string | null;
  freelancer_first_name?: string;
  freelancer_first_last?: string;
}

interface Attendee {
  name: string;
  role?: string;
}

interface EventsData {
  upcoming_events: Event[];
  past_events: Event[];
  todays_events: Event[];
  [key: string]: Event[];
}

const filters: string[] = ["Tech", "Product", "Design", "Web & Mobile Dev"];

export default function EventsPage() {
  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();
  const [events, setEvents] = useState<EventsData>({ upcoming_events: [], past_events: [], todays_events: [] });
  const [activeTab, setActiveTab] = useState<string>("past");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url = selectedFilter 
          ? `/company/app/event-api/?category_name=${selectedFilter}`
          : "/company/app/event-api/";
        const response = await api.get(url);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    if (authToken) {
      fetchEvents();
    }
  }, [authToken, selectedFilter]);

  const EventTabs = () => (
    <div className="flex gap-8 mb-6">
      {["Upcoming", "My Events", "Past Events"].map((tab) => {
        const tabKey = tab.toLowerCase().replace(" ", "_").replace("_events", "");
        return (
          <Button
            key={tab}
            variant="ghost"
            onClick={() => setActiveTab(tabKey)}
            className={`px-0 ${
              activeTab === tabKey
                ? "text-black font-semibold border-b-2 border-black rounded-none"
                : "text-gray-500"
            }`}
          >
            {tab}
          </Button>
        );
      })}
    </div>
  );

  const EventFilters = () => (
    <div className="flex gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant="secondary"
          onClick={() => setSelectedFilter(filter)}
          className={`rounded-full ${
            selectedFilter === filter
              ? "bg-[#7052FF] text-white hover:bg-[#7052FF]"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          {filter}
        </Button>
      ))}
    </div>
  );

  const EventCard: React.FC<{ event: Event }> = ({ event }) => (
    <Card 
      className="p-6 border-2 border-purple-100 rounded-3xl bg-[#F9FAFF] cursor-pointer mb-4"
      onClick={() => setSelectedEvent(event)}
    >
      <Badge className="bg-purple-100 text-purple-800 mb-2">{event.category_name || "Uncategorized"}</Badge>
      <div className="relative rounded-xl overflow-hidden mb-4">
        <div className="flex items-center">
          <div className="flex-1">
            <h3 className="text-md font-bold">{event.name}</h3>
            <p className="text-gray-600 text-sm">{event.description}</p>
          </div>
          <img
            src={event.freelancer_profile_picture || "/api/placeholder/400/320"}
            alt="Event cover"
            className="w-28 h-44 object-cover"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-yellow-100 text-yellow-800">
            {new Date(event.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            })}
          </Badge>
          <Badge className="bg-purple-100 text-purple-800">
            {event.attendees.length} Buddy
          </Badge>
        </div>
        <Button 
          className="w-full rounded-full bg-[#7052FF]"
          onClick={async (e: React.MouseEvent) => {
            e.stopPropagation();
            try {
              await api.post(`/company/app/event-api/${event.id}/register/`);
              const response = await api.get("/company/app/event-api/");
              setEvents(response.data);
            } catch (error) {
              console.error("Error registering for event:", error);
            }
          }}
        >
          Register Now
        </Button>
      </div>
    </Card>
  );

  const EventParticipants = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const participants = selectedEvent?.attendees || [];

    return (
      <div className="space-y-4">
        <div className="border-[1px] flex items-center rounded-full p-2">
          <SearchIcon size={18} color="gray" />
          <input 
            className="border-none ms-2 outline-none" 
            placeholder="search"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        {participants.map((participant, index) => (
          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/api/placeholder/48/48" />
                <AvatarFallback>{participant.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{participant.name}</div>
                <div className="text-sm text-gray-500">{participant.role}</div>
              </div>
            </div>
            <Button variant="ghost" size="sm">View Profile</Button>
          </div>
        ))}
      </div>
    );
  };

  const currentEvents = events[`${activeTab}_events`] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-40">
      <EventTabs />
      <EventFilters />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4">
          {currentEvents && currentEvents.length > 0 ? (
            currentEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <p>No events found</p>
          )}
        </div>

        {selectedEvent && (
          <>
            <div className="col-span-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric'
                    })}
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800">
                    {selectedEvent.attendees.length} Buddy
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold">{selectedEvent.name}</h1>
                <p className="text-gray-600">{selectedEvent.description}</p>

                {selectedEvent.skills_learning && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Skills you'll be learning</h3>
                    <div className="flex gap-2 flex-wrap">
                      {selectedEvent.skills_learning.split(',').map((skill) => (
                        <div key={skill.trim()} className="bg-gray-100 px-3 py-1 rounded-full">
                          <span>{skill.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-4">
              <Tabs defaultValue="comments" className="w-full">
                <TabsList className="w-full mb-4 rounded-full border-2 border-[#7052FF]">
                  <TabsTrigger value="comments" className="flex-1 rounded-full text-lg">
                    Comments
                  </TabsTrigger>
                  <TabsTrigger value="participants" className="flex-1 rounded-full text-lg">
                    Participants
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="comments">
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="/api/placeholder/48/48"
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium">User Comment</div>
                        <p className="text-sm text-gray-600">
                          This is a sample comment...
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View all comments
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="participants">
                  <EventParticipants />
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-20 right-4">
        <Button className="rounded-full px-6" size="lg">
          Messages
        </Button>
      </div>
    </div>
  );
}