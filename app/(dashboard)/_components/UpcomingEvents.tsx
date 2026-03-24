// @ts-nocheck
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/company/app/event-api/');
        setUpcomingEvents(response.data.upcoming_events || []);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      } finally {
        setLoading(false);
      }
    };
    if (authToken) fetchEvents();
  }, [authToken]);

  const handleRegister = async (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await api.post(`/company/app/events-register/?event_id=${eventId}`);
      const response = await api.get('/company/app/event-api/');
      setUpcomingEvents(response.data.upcoming_events || []);
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const nextSlide = () =>
    setCurrentIndex((i) => (i === upcomingEvents.length - 1 ? 0 : i + 1));
  const prevSlide = () =>
    setCurrentIndex((i) => (i === 0 ? upcomingEvents.length - 1 : i - 1));

  const formatEventDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC',
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Upcoming events</h2>
        <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
          <div className="h-20 bg-gray-200 rounded-xl mb-3" />
          <div className="h-9 bg-gray-200 rounded-full" />
        </div>
      </div>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Upcoming events</h2>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-center text-sm text-gray-400 border border-gray-100">
          No upcoming events found
        </div>
      </div>
    );
  }

  const event = upcomingEvents[currentIndex];

  return (
    <div className="p-4">
      <h2 className="text-base font-semibold text-gray-900 mb-3">Upcoming events</h2>

      <div className="relative">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-xs font-medium bg-[#D4EDDA] text-[#155724] px-2.5 py-1 rounded-full">
                {formatEventDate(event.date)}
              </span>
              <span className="text-xs font-medium bg-[#EDE9FF] text-[#7052FF] px-2.5 py-1 rounded-full flex items-center gap-1">
                <Users size={11} />
                {event.attendees.length} Buddy
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-sm text-gray-900 leading-snug mb-3 line-clamp-2">
              {event.name}
            </h3>

            {/* Organizer row */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#EDE9FF] flex items-center justify-center overflow-hidden">
                {event.freelancer_profile_picture ? (
                  <Image
                    src={event.freelancer_profile_picture}
                    alt="Organizer"
                    width={36}
                    height={36}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <Image src="/logo.svg" alt="GrowUp Buddy" width={22} height={22} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 leading-tight">
                  {event.event_by || 'Growbuddy Events'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-snug">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Register Button */}
            <button
              onClick={(e) => handleRegister(event.id, e)}
              disabled={event.already_registered}
              className={`w-full py-2.5 rounded-full text-sm font-semibold transition-all ${
                event.already_registered
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#7052FF] text-white hover:bg-[#5a42d4] shadow-sm hover:shadow-md'
              }`}
            >
              {event.already_registered ? 'Already Registered' : 'Register Now'}
            </button>
          </div>
        </div>

        {/* Carousel Arrows */}
        {upcomingEvents.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3.5 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <ChevronLeft size={14} className="text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3.5 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <ChevronRight size={14} className="text-gray-600" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {upcomingEvents.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {upcomingEvents.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`rounded-full transition-all ${
                i === currentIndex
                  ? 'bg-[#7052FF] w-4 h-1.5'
                  : 'bg-gray-200 w-1.5 h-1.5'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;