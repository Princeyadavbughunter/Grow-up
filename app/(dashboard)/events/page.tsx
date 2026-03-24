// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchIcon, MapPin, Calendar, Clock, User, CalendarDays, MessageSquare, Users } from "lucide-react";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { checkCommentRateLimit, checkReplyRateLimit, formatRateLimitMessage } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventComments } from './_components/EventComments';
import { useRouter } from "next/navigation";
import EmptyState from "@/components/ui/empty-state";
import { toast } from "sonner";

interface Attendee {
  id: string;
  email: string;
  profile_picture: string;
  first_name: string;
  last_name: string;
  freelancer_profile_id: string;
}

interface Comment {
  id: string;
  event: string;
  user: string;
  user_name: string;
  user_profile_picture: string;
  comment_text: string;
  created_at: string;
  user_freelancer_profile: {
    freelancer_id: string;
    first_name: string;
    last_name: string;
    bio: string;
    profile_picture: string | null;
  };
}

interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  date: string;
  already_registered: boolean;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  freelancer: string | null;
  attendees: Attendee[];
  comments: Comment[];
  category_name_display?: string;
  skills_learning?: string;
  event_by?: string;
  event_title?: string;
  event_host_profession?: string;
  freelancer_profile_picture?: string | null;
  freelancer_first_name?: string;
  freelancer_first_last?: string;
}

type TabType = "upcoming" | "past" | "my";

interface EventsData {
  upcoming_events: Event[];
  past_events: Event[];
  my_events: Event[];
  todays_events: Event[];
}

const filters: string[] = ["Web3 Club", "Coders Club", "Designers Club","Growth Club", "Memes Club"];

export default function EventsPage() {
  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();
  const [events, setEvents] = useState<EventsData>({
    upcoming_events: [],
    past_events: [],
    my_events: [],
    todays_events: []
  });
  const [activeTab, setActiveTab] = useState<TabType>("past");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [eventsLoading, setEventsLoading] = useState<boolean>(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        setEventsError(null);
        const url = selectedFilter
          ? `/company/app/event-api/?category_name=${selectedFilter}`
          : "/company/app/event-api/";
        const response = await api.get(url);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEventsError("Failed to load events. Please try again.");
      } finally {
        setEventsLoading(false);
      }
    };
    if (authToken) {
      fetchEvents();
    }
  }, [authToken, selectedFilter]);

  // Reset selected event when filter or tab changes
  useEffect(() => {
    setSelectedEvent(null);
  }, [selectedFilter, activeTab]);

  const scrollEvents = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const fetchEventComments = async (event: Event) => {
    try {
      const response = await api.get(`/company/app/event-comments/?event_id=${event.id}`);
      setSelectedEvent({
        ...event,
        comments: response.data
      });
    } catch (error) {
      console.error("Error fetching event comments:", error);
      setSelectedEvent(event);
    }
  };

  const EventTabs = () => (
    <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-8 mb-4 sm:mb-6">
      {["Upcoming", "My Events", "Past Events"].map((tab) => {
        const tabKey = tab.toLowerCase().replace(" ", "_").replace("_events", "") as TabType;
        return (
          <Button
            key={tab}
            variant="ghost"
            onClick={() => setActiveTab(tabKey)}
            className={`px-3 py-2 text-sm sm:text-base hover:bg-gray-100 transition-colors ${
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
    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-6 max-w-sm">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant="secondary"
          onClick={() => setSelectedFilter(filter)}
          className={`rounded-full text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 h-auto ${
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
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const EventCard = ({ event }: { event: Event }) => (
    <Card 
      className="p-4 border-2 border-purple-100 rounded-3xl bg-[#F9FAFF] cursor-pointer mb-4 hover:shadow-md transition-all duration-300 flex flex-col h-auto"
      onClick={() => fetchEventComments(event)}
    >
      <div className="flex justify-between items-start mb-3">
        <Badge className="bg-purple-100 text-purple-800">{event.category_name_display || "Uncategorized"}</Badge>
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
                <span key={skill.trim()} className="bg-gray-100 px-2 py-1 rounded-full text-xs whitespace-nowrap">
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
      
      {event.already_registered ? (
        <Button 
          className="w-full rounded-full bg-gray-300 mt-3 cursor-not-allowed"
          disabled
        >
          Registered
        </Button>
      ) : (
        <Button 
          className="w-full rounded-full bg-[#7052FF] mt-3"
          onClick={async (e: React.MouseEvent) => {
            e.stopPropagation();
            try {
              await api.post(`/company/app/events-register/?event_id=${event.id}`); 
              const response = await api.get("/company/app/event-api/");
              setEvents(response.data);
            } catch (error) {
              console.error("Error registering for event:", error);
            }
          }}
        >
          Register Now
        </Button>
      )}
    </Card>
  );

  const EventParticipants = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const participants = selectedEvent?.attendees || [];

    return (
      <div className="space-y-4 h-[calc(100vh-25rem)] overflow-y-auto overflow-x-hidden">
        <div className="border-[1px] flex items-center rounded-full p-2 w-full">
          <SearchIcon size={18} color="gray" />
          <input 
            className="border-none ms-2 outline-none" 
            placeholder="search"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        {participants.length > 0 ? (
          participants.map((participant) => (
            <div key={participant.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={participant.profile_picture} />
                  <AvatarFallback>{participant.first_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{participant.first_name} {participant.last_name}</div>
                </div>
              </div>
              <Button onClick={() => router.push(`/profile/${participant.freelancer_profile_id}`)} variant="ghost" size="sm">View Profile</Button>
            </div>
          ))
        ) : (
          <EmptyState
            icon={<Users className="w-5 h-5 text-gray-400" />}
            title="No participants yet"
            description="Be the first to join this event! Register now to connect with others."
            className="py-4"
          />
        )}
      </div>
    );
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !newComment?.trim()) return;

    // Check rate limit
    const { userId } = useAuth();
    if (userId) {
      const rateLimitCheck = checkCommentRateLimit(userId);
      if (!rateLimitCheck.allowed) {
        const message = formatRateLimitMessage(rateLimitCheck.remainingTime!);
        toast.error(message);
        return;
      }
    }

    try {
      await api.post(`/company/app/event-comments/`, {
        comment_text: newComment,
        event: selectedEvent.id,
      });

      // Refresh comments data and update the selected event
      const response = await api.get(`/company/app/event-comments/?event_id=${selectedEvent.id}`);
      setSelectedEvent({
        ...selectedEvent,
        comments: response.data
      });
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error("Failed to add comment");
    }
  };

  const handleAddReply = async (parentId: string, replyText: string) => {
    if (!selectedEvent || !replyText.trim()) return;

    // Check rate limit
    const { userId } = useAuth();
    if (userId) {
      const rateLimitCheck = checkReplyRateLimit(userId);
      if (!rateLimitCheck.allowed) {
        const message = formatRateLimitMessage(rateLimitCheck.remainingTime!);
        toast.error(message);
        return;
      }
    }

    try {
      await api.post('/company/app/event-comments/', {
        comment_text: replyText,
        event: selectedEvent.id,
        parent: parentId,  // Include the parent comment ID for replies
      });

      // Refresh comments after adding the reply
      const response = await api.get(`/company/app/event-comments/?event_id=${selectedEvent.id}`);
      setSelectedEvent({
        ...selectedEvent,
        comments: response.data  // Assuming response.data includes the updated comments with replies
      });
      toast.success("Reply added successfully");
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error("Failed to add reply");
    }
  };

  const currentEvents = events?.[`${activeTab}_events` as keyof EventsData] || [];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8 pb-20 md:pb-40 h-full md:h-[calc(100vh-10rem)] overflow-y-scroll md:overflow-y-hidden">
      <EventTabs />
      <EventFilters />

      <div className="flex flex-col lg:flex-row gap-0 lg:gap-8">
        <div className="w-full lg:w-1/3 mb-0">
          <ScrollArea className="h-[calc(100vh-20rem)]" ref={scrollContainerRef}>
            <div className="pr-4 space-y-4">
              {eventsLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-3xl p-4 shadow-lg animate-pulse">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                      <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="w-full h-32 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="space-y-2">
                      <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                      <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                      <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-full h-10 bg-gray-200 rounded-full mt-3"></div>
                  </div>
                ))
              ) : eventsError ? (
                <EmptyState
                  variant="error"
                  title="Unable to load events"
                  description={eventsError}
                  onRetry={() => window.location.reload()}
                />
              ) : currentEvents && currentEvents.length > 0 ? (
                currentEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <EmptyState
                  icon={<CalendarDays className="w-6 h-6 text-gray-400" />}
                  title="No events found"
                  description="No events match your current filter. Try selecting a different category or check back later for new events."
                  action={
                    selectedFilter ? (
                      <Button
                        onClick={() => setSelectedFilter("")}
                        variant="outline"
                        className="mt-2"
                      >
                        Clear Filter
                      </Button>
                    ) : null
                  }
                />
              )}
            </div>
          </ScrollArea>
        </div>

        {selectedEvent ? (
          <>
            <div className="w-full h-[calc(100vh-20rem)] px-2 lg:w-1/3">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      timeZone: 'UTC'
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

            <div className="w-full lg:w-1/3">
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
                    <form onSubmit={handleAddComment} className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 border rounded-lg px-3 py-2"
                      />
                      <Button type="submit">
                        Post
                      </Button>
                    </form>
                    
                    {selectedEvent?.comments && selectedEvent.comments.length > 0 ? (
                      <EventComments
                        comments={selectedEvent.comments}
                        onAddReply={handleAddReply}
                        onUserClick={(userId) => router.push(`/profile/${userId}`)}
                      />
                    ) : (
                      <EmptyState
                        icon={<MessageSquare className="w-5 h-5 text-gray-400" />}
                        title="No comments yet"
                        description="Be the first to share your thoughts about this event!"
                        className="py-4"
                      />
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="participants">
                  <EventParticipants />
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <EmptyState
            icon={<CalendarDays className="w-6 h-6 text-gray-400" />}
            title="Select an event"
            description="Choose an event from the list to view its details, participants, and join the conversation."
            className="flex-1"
          />
        )}
      </div>
    </div>
  );
}