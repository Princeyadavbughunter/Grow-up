"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  already_registered: boolean;
}

interface Attendee {
  name: string;
  role?: string;
}

const UpcomingEvents = () => {
  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get("/company/app/event-api/");
        setUpcomingEvents(response.data.upcoming_events || []);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchEvents();
    }
  }, [authToken]);

  const handleRegister = async (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await api.post(`/company/app/events-register/?event_id=${eventId}`);
      const response = await api.get("/company/app/event-api/");
      setUpcomingEvents(response.data.upcoming_events || []);
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === upcomingEvents.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? upcomingEvents.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return <div className="p-4">Loading events...</div>;
  }

  if (upcomingEvents.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Upcoming events</h2>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          No upcoming events found
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Upcoming events</h2>
      </div>

      <div className="relative">
        <div 
          ref={carouselRef}
          className="overflow-hidden rounded-xl"
        >
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {upcomingEvents.map((event) => (
              <div key={event.id} className="w-full flex-shrink-0">
                <div className="bg-white rounded-xl p-4 shadow-sm mx-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                      })}
                    </span>
                    <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {event.attendees.length} Buddy
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Image
                        src={event.freelancer_profile_picture || "/logo.svg"}
                        alt="Event"
                        width={40}
                        height={40}
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{event.event_by || "Growbuddy Events"}</h4>
                      <p className="text-sm text-gray-500">{event.description}</p>
                    </div>
                  </div>

                  <button 
                    className="w-full bg-[#7052FF] text-white hover:bg-[#7052FF]/80 rounded-3xl py-3 font-medium"
                    onClick={(e) => handleRegister(event.id, e)}
                    disabled={event.already_registered}
                  >
                    {event.already_registered ? "Already Registered" : "Register Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={prevSlide} 
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white rounded-full p-2 shadow-md"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={nextSlide} 
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white rounded-full p-2 shadow-md"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvents;