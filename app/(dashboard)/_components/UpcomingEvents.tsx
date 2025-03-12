"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
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

const UpcomingEvents = () => {
  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      await api.post(`/company/app/event-api/${eventId}/register/`);
      const response = await api.get("/company/app/event-api/");
      setUpcomingEvents(response.data.upcoming_events || []);
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading events...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Upcoming events</h2>
      </div>

      {upcomingEvents.length === 0 ? (
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          No upcoming events found
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm">
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

              <h3 className="text-lg font-semibold mb-2">{event.name}</h3>

              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={event.freelancer_profile_picture || "/logo.svg"}
                  alt="Event"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <h4 className="font-semibold">{event.event_by || "Growbuddy Events"}</h4>
                  <p className="text-sm text-gray-500">{event.description}</p>
                </div>
              </div>

              <button 
                className="w-full bg-purple-600 text-white rounded-lg py-2"
                onClick={(e) => handleRegister(event.id, e)}
              >
                Register Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;