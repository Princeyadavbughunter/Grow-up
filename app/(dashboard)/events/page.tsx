"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchIcon, MapPin, Calendar, Clock, User } from "lucide-react";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const scrollEvents = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const EventCard: React.FC<{ event: Event }> = ({ event }) => (
    <Card 
      className="p-4 border-2 border-purple-100 rounded-3xl bg-[#F9FAFF] cursor-pointer mb-4 hover:shadow-md transition-all duration-300 flex flex-col h-[400px]"
      onClick={() => setSelectedEvent(event)}
    >
      <div className="flex justify-between items-start mb-3">
        <Badge className="bg-purple-100 text-purple-800">{event.category_name || "Uncategorized"}</Badge>
        <Badge className="bg-yellow-100 text-yellow-800">
          {formatEventDate(event.date)}
        </Badge>
      </div>
      
      <div className="relative rounded-xl overflow-hidden mb-4 flex-shrink-0">
        <img
          src={event.freelancer_profile_picture || "/api/placeholder/400/320"}
          alt="Event cover"
          className="w-full h-32 object-cover rounded-xl"
        />
        <div className="absolute bottom-0 right-0 bg-white p-1 rounded-tl-xl">
          <Badge className="bg-purple-100 text-purple-800">
            {event.attendees.length} Buddies
          </Badge>
        </div>
      </div>
      
      <div className="flex-grow overflow-hidden">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{event.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-purple-600" />
            <span>{formatEventTime(event.date)}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-purple-600" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          
          {event.freelancer_first_name && (
            <div className="flex items-center gap-2">
              <User size={16} className="text-purple-600" />
              <span>By {event.freelancer_first_name} {event.freelancer_first_last || ''}</span>
            </div>
          )}
          
          {event.skills_learning && (
            <div className="flex flex-wrap gap-1 mt-2">
              {event.skills_learning.split(',').slice(0, 3).map((skill) => (
                <span key={skill.trim()} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                  {skill.trim()}
                </span>
              ))}
              {event.skills_learning.split(',').length > 3 && (
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                  +{event.skills_learning.split(',').length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Button 
        className="w-full rounded-full bg-[#7052FF] mt-3"
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
          <ScrollArea className="h-[calc(100vh-200px)]" ref={scrollContainerRef}>
            <div className="pr-4 space-y-4">
              {currentEvents && currentEvents.length > 0 ? (
                currentEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <p>No events found</p>
              )}
            </div>
          </ScrollArea>
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
    </div>
  );
}

