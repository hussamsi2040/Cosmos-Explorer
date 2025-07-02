"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Bell, Star, Rocket, Sun, Moon, AlertCircle, Clock, MapPin } from "lucide-react";
import { format, addDays, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import toast from "react-hot-toast";

interface CosmicEvent {
  id: string;
  title: string;
  type: "meteor_shower" | "eclipse" | "rocket_launch" | "planetary_conjunction" | "asteroid" | "comet";
  date: Date;
  description: string;
  visibility: string;
  location?: string;
  peak_time?: string;
  magnitude?: number;
  constellation?: string;
  agency?: string;
  mission_name?: string;
}

const EVENT_TYPES = {
  meteor_shower: { icon: Star, color: "text-yellow-400", bg: "bg-yellow-900/30", label: "Meteor Shower" },
  eclipse: { icon: Sun, color: "text-orange-400", bg: "bg-orange-900/30", label: "Eclipse" },
  rocket_launch: { icon: Rocket, color: "text-blue-400", bg: "bg-blue-900/30", label: "Rocket Launch" },
  planetary_conjunction: { icon: Moon, color: "text-purple-400", bg: "bg-purple-900/30", label: "Planetary Event" },
  asteroid: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-900/30", label: "Asteroid" },
  comet: { icon: Star, color: "text-green-400", bg: "bg-green-900/30", label: "Comet" }
};

// Generate cosmic events data - moved to a function to avoid hydration issues
const generateCosmicEvents = (): CosmicEvent[] => {
  // Use a fixed date for server-side rendering consistency
  const baseDate = new Date('2024-07-02T00:00:00Z');
  return [
    {
      id: "1",
      title: "Geminids Meteor Shower Peak",
      type: "meteor_shower",
      date: new Date(baseDate.getFullYear(), 11, 14), // December 14
      description: "One of the year's most reliable meteor showers, producing up to 120 meteors per hour at peak.",
      visibility: "Worldwide",
      peak_time: "2:00 AM",
      constellation: "Gemini"
    },
    {
      id: "2", 
      title: "Total Solar Eclipse",
      type: "eclipse",
      date: new Date(baseDate.getFullYear() + 1, 3, 8), // April 8 next year
      description: "A total solar eclipse visible across parts of North America.",
      visibility: "North America",
      location: "Path of totality: Mexico, USA, Canada"
    },
    {
      id: "3",
      title: "SpaceX Starship IFT-4",
      type: "rocket_launch",
      date: addDays(baseDate, 7),
      description: "Integrated Flight Test 4 of Starship and Super Heavy booster.",
      visibility: "Global (Live Stream)",
      location: "Starbase, Texas",
      agency: "SpaceX",
      mission_name: "Starship IFT-4"
    },
    {
      id: "4",
      title: "Venus-Jupiter Conjunction",
      type: "planetary_conjunction", 
      date: addDays(baseDate, 15),
      description: "Venus and Jupiter will appear very close together in the sky.",
      visibility: "Worldwide",
      peak_time: "Evening twilight"
    },
    {
      id: "5",
      title: "Perseids Meteor Shower",
      type: "meteor_shower",
      date: new Date(baseDate.getFullYear(), 7, 12), // August 12
      description: "Swift and bright meteors from Comet Swift-Tuttle, peak at 60 meteors per hour.",
      visibility: "Northern Hemisphere",
      constellation: "Perseus",
      peak_time: "Pre-dawn hours"
    },
    {
      id: "6",
      title: "NASA Artemis III Launch",
      type: "rocket_launch",
      date: new Date(baseDate.getFullYear() + 1, 8, 15), // September 15 next year
      description: "Historic crewed mission to return humans to the Moon's surface.",
      visibility: "Global (Live Stream)",
      location: "Kennedy Space Center, Florida",
      agency: "NASA",
      mission_name: "Artemis III"
    },
    {
      id: "7",
      title: "Comet Nishimura Closest Approach",
      type: "comet",
      date: addDays(baseDate, 45),
      description: "Comet C/2023 P1 Nishimura makes its closest approach to Earth.",
      visibility: "Northern Hemisphere",
      magnitude: 4.5
    }
  ];
};

export default function CosmicEventPlanner() {
  const [events, setEvents] = useState<CosmicEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [notifications, setNotifications] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This runs only on client side, avoiding hydration mismatch
    setEvents(generateCosmicEvents());
    setSelectedDate(new Date());
    setMounted(true);
  }, []);

  // Don't render time-sensitive content until mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-white">Loading cosmic events...</span>
      </div>
    );
  }

  const filteredEvents = events.filter(event => {
    if (filter === "all") return true;
    return event.type === filter;
  });

  const upcomingEvents = filteredEvents
    .filter(event => selectedDate ? isAfter(event.date, selectedDate) : true)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 10);

  const todayEvents = selectedDate ? filteredEvents.filter(event => {
    return event.date >= startOfDay(selectedDate) && event.date <= endOfDay(selectedDate);
  }) : [];

  const toggleNotification = (eventId: string) => {
    const newNotifications = new Set(notifications);
    if (newNotifications.has(eventId)) {
      newNotifications.delete(eventId);
      toast.success("Notification disabled");
    } else {
      newNotifications.add(eventId);
      toast.success("Notification enabled! You'll be alerted before this event.");
    }
    setNotifications(newNotifications);
  };

  const EventCard = ({ event }: { event: CosmicEvent }) => {
    const eventType = EVENT_TYPES[event.type];
    const Icon = eventType.icon;
    const isNotified = notifications.has(event.id);
    const daysUntil = selectedDate ? Math.ceil((event.date.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${eventType.bg} border border-white/10 rounded-lg p-4 relative`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${eventType.color}`} />
            <div>
              <h3 className="text-white font-bold">{event.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${eventType.bg} ${eventType.color}`}>
                {eventType.label}
              </span>
            </div>
          </div>
          <button
            onClick={() => toggleNotification(event.id)}
            className={`p-2 rounded-full transition-all ${
              isNotified 
                ? "bg-blue-500 text-white" 
                : "bg-white/10 text-gray-400 hover:bg-white/20"
            }`}
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(event.date, "MMMM dd, yyyy")}</span>
            {daysUntil > 0 && (
              <span className="text-blue-400 ml-auto">
                {daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
              </span>
            )}
          </div>

          {event.peak_time && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Peak: {event.peak_time}</span>
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          )}

          <p className="text-gray-300 mt-2">{event.description}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs bg-white/10 px-2 py-1 rounded">
              Visibility: {event.visibility}
            </span>
            {event.constellation && (
              <span className="text-xs bg-white/10 px-2 py-1 rounded">
                {event.constellation}
              </span>
            )}
            {event.agency && (
              <span className="text-xs bg-white/10 px-2 py-1 rounded">
                {event.agency}
              </span>
            )}
            {event.magnitude && (
              <span className="text-xs bg-white/10 px-2 py-1 rounded">
                Magnitude: {event.magnitude}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-400 w-8 h-8" />
          <h2 className="text-3xl font-bold text-white">Cosmic Event Planner</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === "list" ? "bg-blue-500 text-white" : "bg-white/10 text-gray-300"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === "calendar" ? "bg-blue-500 text-white" : "bg-white/10 text-gray-300"
            }`}
          >
            Calendar View
          </button>
        </div>
      </div>

      {/* Notifications Summary */}
      {notifications.size > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Bell className="w-5 h-5" />
            <span className="font-bold">Active Notifications</span>
          </div>
          <p className="text-gray-300 text-sm">
            You have {notifications.size} event notification{notifications.size !== 1 ? 's' : ''} enabled. 
            You'll receive alerts before these events occur.
          </p>
        </motion.div>
      )}

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Today's Events
          </h3>
          <div className="grid gap-4">
            {todayEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-2 rounded-lg text-sm transition-all ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-white/10 text-gray-300"
          }`}
        >
          All Events
        </button>
        {Object.entries(EVENT_TYPES).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                filter === type ? "bg-blue-500 text-white" : "bg-white/10 text-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Upcoming Events */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Upcoming Events</h3>
        {upcomingEvents.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No upcoming events found for the selected filter.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Tips for observers */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Observer Tips 🔭</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="text-white font-semibold mb-2">Best Viewing Conditions:</h4>
            <ul className="space-y-1">
              <li>• Find a dark location away from city lights</li>
              <li>• Allow 20-30 minutes for your eyes to adjust</li>
              <li>• Check weather conditions beforehand</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">What to Bring:</h4>
            <ul className="space-y-1">
              <li>• Red flashlight to preserve night vision</li>
              <li>• Comfortable chair or blanket</li>
              <li>• Star chart or astronomy app</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}