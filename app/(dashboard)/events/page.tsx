// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchIcon, MapPin, Calendar, Clock, User, CalendarDays, MessageSquare, Users, Info, X } from "lucide-react";
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

const filters: string[] = ["Tech", "Product", "Design", "Web & Mobile Dev"];

const skillConfig: Record<string, { bg: string, text: string, icon: string }> = {
  // Frontend
  "HTML": { bg: "#FFEFEA", text: "#E34F26", icon: "https://cdn.simpleicons.org/html5/E34F26" },
  "CSS": { bg: "#EBF4FF", text: "#1572B6", icon: "https://cdn.simpleicons.org/css3/1572B6" },
  "JavaScript": { bg: "#FFFBEA", text: "#F7DF1E", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
  "React": { bg: "#E6F7FF", text: "#61DAFB", icon: "https://cdn.simpleicons.org/react/61DAFB" },
  "React js": { bg: "#E6F7FF", text: "#61DAFB", icon: "https://cdn.simpleicons.org/react/61DAFB" },
  "Angular": { bg: "#FFEBEB", text: "#DD0031", icon: "https://cdn.simpleicons.org/angular/DD0031" },
  "Vue": { bg: "#EBFCD6", text: "#4FC08D", icon: "https://cdn.simpleicons.org/vuedotjs/4FC08D" },
  "Next.js": { bg: "#F3F4F6", text: "#000000", icon: "https://cdn.simpleicons.org/nextdotjs/000000" },
  "Tailwind CSS": { bg: "#E6F7FF", text: "#06B6D4", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
  "TypeScript": { bg: "#EBF4FF", text: "#3178C6", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
  "Figma": { bg: "#FFEBEE", text: "#F24E1E", icon: "https://cdn.simpleicons.org/figma/F24E1E" },
  // Backend
  "Python": { bg: "#FFF9E6", text: "#3776AB", icon: "https://cdn.simpleicons.org/python/3776AB" },
  "Django": { bg: "#E6F2EA", text: "#092E20", icon: "https://cdn.simpleicons.org/django/092E20" },
  "Django REST Framework": { bg: "#E6F2EA", text: "#092E20", icon: "https://cdn.simpleicons.org/django/092E20" },
  "Node.js": { bg: "#EBFCD6", text: "#339933", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
  "Node": { bg: "#EBFCD6", text: "#339933", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
  "Java": { bg: "#FFEBEE", text: "#007396", icon: "https://cdn.simpleicons.org/java/007396" },
  "C++": { bg: "#EBF4FF", text: "#00599C", icon: "https://cdn.simpleicons.org/cplusplus/00599C" },
  "PHP": { bg: "#F3F4FB", text: "#777BB4", icon: "https://cdn.simpleicons.org/php/777BB4" },
  "Go": { bg: "#E6F7FF", text: "#00ADD8", icon: "https://cdn.simpleicons.org/go/00ADD8" },
  "Ruby": { bg: "#FFEBEB", text: "#CC342D", icon: "https://cdn.simpleicons.org/ruby/CC342D" },
  // Database & DevOps
  "Database": { bg: "#EBF4FF", text: "#336791", icon: "https://cdn.simpleicons.org/postgresql/336791" },
  "SQL": { bg: "#FFF5EB", text: "#F29111", icon: "https://cdn.simpleicons.org/mysql/F29111" },
  "MySQL": { bg: "#FFF5EB", text: "#F29111", icon: "https://cdn.simpleicons.org/mysql/F29111" },
  "PostgreSQL": { bg: "#EBF4FF", text: "#336791", icon: "https://cdn.simpleicons.org/postgresql/336791" },
  "MongoDB": { bg: "#EBFCD6", text: "#47A248", icon: "https://cdn.simpleicons.org/mongodb/47A248" },
  "Redis": { bg: "#FFEBEB", text: "#DC382D", icon: "https://cdn.simpleicons.org/redis/DC382D" },
  "Docker": { bg: "#E6F7FF", text: "#2496ED", icon: "https://cdn.simpleicons.org/docker/2496ED" },
  "Kubernetes": { bg: "#EBF4FF", text: "#326CE5", icon: "https://cdn.simpleicons.org/kubernetes/326CE5" },
  "AWS": { bg: "#FFF5EB", text: "#FF9900", icon: "https://cdn.simpleicons.org/amazonaws/FF9900" },
  "Git": { bg: "#FFEBEB", text: "#F05032", icon: "https://cdn.simpleicons.org/git/F05032" },
  // Security / Auth
  "Hacking": { bg: "#E6E6E6", text: "#000000", icon: "https://cdn.simpleicons.org/kali/000000" },
  "Cyber Security": { bg: "#EBF4FF", text: "#0052CC", icon: "https://cdn.simpleicons.org/owasp/0052CC" },
  "Penetration Testing": { bg: "#FFEBEB", text: "#D01A1E", icon: "https://cdn.simpleicons.org/metasploit/D01A1E" },
  "Authentication": { bg: "#F3F4FB", text: "#3B82F6", icon: "https://cdn.simpleicons.org/jsonwebtokens/000000" }, 
  "OAuth": { bg: "#E6E6E6", text: "#000000", icon: "https://cdn.simpleicons.org/auth0/000000" },
};

const categoryDefaults: Record<string, { keywords: string[], config: { bg: string, text: string, icon: string } }> = {
  "cloud": {
    keywords: ["cloud", "server", "aws", "gcp", "azure", "deploy", "hosting"],
    config: { bg: "#F0F9FF", text: "#0284C7", icon: "https://cdn.simpleicons.org/icloud/0284C7" }
  },
  "design": {
    keywords: ["design", "ui", "ux", "prototype", "wireframe", "art", "graphic", "illustrator", "figma"],
    config: { bg: "#FDF4FF", text: "#C026D3", icon: "https://cdn.simpleicons.org/figma/C026D3" }
  },
  "product": {
    keywords: ["product", "agile", "scrum", "pm", "management", "strategy", "business", "lead"],
    config: { bg: "#FFFBEB", text: "#D97706", icon: "https://cdn.simpleicons.org/notion/D97706" }
  },
  "database": {
    keywords: ["data", "sql", "db", "mongo", "query", "record", "backend"],
    config: { bg: "#F0FDF4", text: "#16A34A", icon: "https://cdn.simpleicons.org/databricks/16A34A" }
  },
  "security": {
    keywords: ["hack", "security", "cyber", "penetration", "auth", "crypto", "protect", "defense"],
    config: { bg: "#FEF2F2", text: "#DC2626", icon: "https://cdn.simpleicons.org/owasp/DC2626" }
  },
  "development": {
    keywords: ["dev", "code", "tech", "web", "app", "software", "program", "front", "stack"],
    config: { bg: "#F3F4F6", text: "#4B5563", icon: "https://cdn.simpleicons.org/gnubash/4B5563" }
  }
};

const defaultConfigs = [
  { bg: "#F3F4F6", text: "#374151", icon: "https://cdn.simpleicons.org/gnubash/374151" }, 
  { bg: "#EEF2FF", text: "#4F46E5", icon: "https://cdn.simpleicons.org/hashnode/4F46E5" }, 
];

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
  const [showBanner, setShowBanner] = useState(true);
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
            className={`px-3 py-2 text-sm sm:text-base hover:bg-gray-100 transition-colors ${activeTab === tabKey
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
          className={`rounded-full text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 h-auto ${selectedFilter === filter
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
      className="relative overflow-hidden p-6 border-2 border-purple-100 rounded-[2rem] bg-white cursor-pointer mb-6 hover:shadow-lg transition-all duration-300 flex flex-col h-auto"
      onClick={() => fetchEventComments(event)}
    >
      <div style={{
        position: 'absolute',
        top: '14px',
        right: '0',
        background: '#aaacafff',
        color: '#ffffffff',
        fontSize: '12px',
        fontWeight: 600,
        padding: '7px 18px 7px 26px',
        clipPath: 'polygon(22px 0%, 100% 0%, 100% 100%, 22px 100%, 0% 50%)',
        borderRadius: '0',
        letterSpacing: '0.4px',
        zIndex: 10,
        whiteSpace: 'nowrap'
      }}>
        {event.category_name_display || "Uncategorized"}
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
        {/* Left Side: Title and Host */}
        <div className="flex-1 order-2 sm:order-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{event.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

          {event.freelancer_first_name && (
            <div>
              <div className="font-semibold text-sm text-gray-900">
                by {event.freelancer_first_name} {event.freelancer_first_last || ''}
              </div>
              <div className="text-xs text-gray-500">
                {event.event_host_profession || 'Host'}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Image */}
        <div className="w-full sm:w-[140px] h-48 sm:h-40 flex-shrink-0 order-1 sm:order-2 mb-3 sm:mb-0">
          <img
            src={event.freelancer_profile_picture || "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=400&fit=crop"}
            alt="Event cover"
            className="w-full h-full object-cover rounded-[1.2rem]"
          />
        </div>
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <Badge className="bg-yellow-100/80 text-yellow-800 hover:bg-yellow-100 whitespace-nowrap border-none px-3 py-1">
          {formatEventDate(event.date)} @ {formatEventTime(event.date)}
        </Badge>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          background: '#ede9ff',
          color: '#5b4fcf',
          fontSize: '13px',
          fontWeight: 500,
          padding: '6px 14px',
          borderRadius: '6px',
          whiteSpace: 'nowrap'
        }}>
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="2.8" cy="2.2" r="1.2" fill="#2F2E41"/>
            <path d="M0.5 12c0-1.8 0.9-2.5 2.3-2.5s2.3 0.7 2.3 2.5z" fill="#2F2E41"/>
            <circle cx="13.2" cy="2.2" r="1.2" fill="#2F2E41"/>
            <path d="M11 12c0-1.8 0.9-2.5 2.3-2.5s2.3 0.7 2.3 2.5z" fill="#2F2E41"/>
            <circle cx="8" cy="4" r="2.1" fill="#2F2E41"/>
            <path d="M4.5 14c0-2.8 1.6-4.3 3.5-4.3s3.5 1.5 3.5 4.3z" fill="#2F2E41"/>
          </svg>
          {event.attendees.length} Buddy
        </div>
      </div>

      <h3 className="text-md font-bold text-gray-900 mb-6 line-clamp-2">
        {event.event_title || event.name}
      </h3>

      {/* Host Organization Info */}
      <div className="flex items-center gap-3 mb-6">
        <img 
          src="/logo.svg" 
          alt="Growbuddy Logo" 
          className="w-10 h-10 object-contain flex-shrink-0"
        />
        <div>
          <p className="font-semibold text-sm text-gray-900 leading-tight">Growbuddy Events</p>
          <p className="text-xs text-gray-500 mt-0.5">For the Community, From The community</p>
        </div>
      </div>

      {event.already_registered ? (
        <Button
          className="w-full rounded-full bg-gray-300 cursor-not-allowed text-gray-600 font-semibold py-6 text-[15px]"
          disabled
        >
          Registered
        </Button>
      ) : (
        <Button
          className="w-full rounded-full bg-[#7052FF] hover:bg-[#5C3FFF] text-white font-semibold py-6 text-[15px] transition-colors shadow-md hover:shadow-lg"
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

  const EventBanner = () => {
    if (!showBanner) return null;
    return (
      <div className="p-4 rounded-xl bg-purple-100/50 border border-purple-100 mb-6 flex items-start gap-3 relative mr-2">
        <Info className="text-purple-600 mt-0.5 flex-shrink-0" size={20} />
        <div className="pr-6">
          <h4 className="font-semibold text-purple-700 text-sm">What is a Event?</h4>
          <p className="text-xs text-purple-700/80 mt-1 leading-relaxed">
            A group for tech enthusiasts, follow a passion with people get your hands on something for your work done in tech group you should work on projects
          </p>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="absolute top-4 right-4 text-purple-500 hover:text-purple-700 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

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
            <div key={participant.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors w-full">
              <div 
                className="flex items-center gap-[8px] cursor-pointer"
                style={{ height: '62px' }}
                onClick={() => router.push(`/profile/${participant.freelancer_profile_id}`)}
              >
                <div className="w-[62px] h-[62px] rounded-full overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm border border-gray-100">
                  {participant.profile_picture ? (
                    <img src={participant.profile_picture} alt={participant.first_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-700 font-bold text-xl">
                      {participant.first_name[0]}
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '14px', color: '#1C1F25', lineHeight: '100%' }}>
                    {participant.first_name} {participant.last_name}
                  </div>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '12px', color: '#979797', lineHeight: '100%', marginTop: '6px' }}>
                    {participant.location || participant.city || 'Community Member'}
                  </div>
                </div>
              </div>
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
    <div className="w-full px-4 lg:px-28 py-4 sm:py-8 pb-20 md:pb-40 h-full md:h-[calc(100vh-10rem)] overflow-y-scroll md:overflow-y-hidden">
      <EventTabs />
      <EventFilters />

      <div className="flex flex-col lg:flex-row gap-0 lg:gap-8">
        <div className="w-full lg:w-1/3 mb-0">
          <ScrollArea className="h-[calc(100vh-20rem)]" ref={scrollContainerRef}>
            <div className="pr-4 space-y-4">
              <EventBanner />
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
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge className="bg-yellow-100/80 text-yellow-800 hover:bg-yellow-100 whitespace-nowrap border-none px-3 py-1">
                    {formatEventDate(selectedEvent.date)} @ {formatEventTime(selectedEvent.date)}
                  </Badge>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    background: '#ede9ff',
                    color: '#5b4fcf',
                    fontSize: '13px',
                    fontWeight: 500,
                    padding: '6px 14px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap'
                  }}>
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="2.8" cy="2.2" r="1.2" fill="#2F2E41"/>
                      <path d="M0.5 12c0-1.8 0.9-2.5 2.3-2.5s2.3 0.7 2.3 2.5z" fill="#2F2E41"/>
                      <circle cx="13.2" cy="2.2" r="1.2" fill="#2F2E41"/>
                      <path d="M11 12c0-1.8 0.9-2.5 2.3-2.5s2.3 0.7 2.3 2.5z" fill="#2F2E41"/>
                      <circle cx="8" cy="4" r="2.1" fill="#2F2E41"/>
                      <path d="M4.5 14c0-2.8 1.6-4.3 3.5-4.3s3.5 1.5 3.5 4.3z" fill="#2F2E41"/>
                    </svg>
                    {selectedEvent.attendees.length} Buddy
                  </div>
                </div>
                <h1 className="text-2xl font-bold">{selectedEvent.name}</h1>
                <p className="text-gray-600">{selectedEvent.description}</p>

                {selectedEvent.skills_learning && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Skills you'll be learning</h3>
                    <div className="flex gap-2 flex-wrap">
                      {selectedEvent.skills_learning.split(',').map((skill, index) => {
                        const s = skill.trim();
                        const lowerS = s.toLowerCase();
                        let config = null;

                        // 1. Exact Match
                        const matchedKey = Object.keys(skillConfig).find(k => k.toLowerCase() === lowerS);
                        if (matchedKey) config = skillConfig[matchedKey];

                        // 2. Category Keyword Match
                        if (!config) {
                          for (const category of Object.values(categoryDefaults)) {
                            if (category.keywords.some(keyword => lowerS.includes(keyword))) {
                              config = category.config;
                              break;
                            }
                          }
                        }

                        // 3. Ultimate Fallback
                        if (!config) {
                          config = defaultConfigs[index % defaultConfigs.length];
                        }

                        return (
                          <div 
                            key={s} 
                            style={{ backgroundColor: config.bg, color: config.text, borderColor: `${config.text}40` }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border"
                          >
                            <img src={config.icon} alt={s} className="w-4 h-4 object-contain" />
                            <span>{s}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-1/3">
              <Tabs defaultValue="comments" className="w-full">
                <TabsList className="w-full mb-4 rounded-full border-2 border-[#7052FF]">
                  <TabsTrigger value="comments" className="flex-1 rounded-full text-lg data-[state=active]:italic font-medium">
                    Comments
                  </TabsTrigger>
                  <TabsTrigger value="participants" className="flex-1 rounded-full text-lg data-[state=active]:italic font-medium">
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