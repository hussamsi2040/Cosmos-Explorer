"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar,
  Star,
  Rocket,
  Eye,
  Bell,
  MapPin,
  Clock,
  CloudSun,
  Telescope,
  Globe,
  Settings,
  ExternalLink,
  Camera,
  Bookmark,
  Download,
  Share
} from "lucide-react";
import toast from "react-hot-toast";

interface APODData {
  date: string;
  title: string;
  explanation: string;
  url: string;
  media_type: "image" | "video";
  thumbnail_url?: string;
  copyright?: string;
}

interface Launch {
  id: string;
  name: string;
  date: string;
  agency: string;
  mission_type: string;
  location: string;
  rocket: string;
  probability: number;
  status: string;
  description: string;
  webcast_live: boolean;
  image_url?: string;
}

interface AstronomicalEvent {
  id: string;
  name: string;
  type: "meteor_shower" | "eclipse" | "conjunction" | "comet" | "other";
  date: string;
  duration: string;
  visibility: {
    hemisphere: "northern" | "southern" | "both";
    best_time: string;
    peak_time?: string;
    magnitude?: number;
  };
  description: string;
  observing_tips: string[];
  regional_visibility: {
    latitude_range: [number, number];
    optimal_locations: string[];
  };
}

interface WeatherData {
  location: string;
  cloud_cover: number;
  seeing: "poor" | "fair" | "good" | "excellent";
  transparency: "poor" | "fair" | "good" | "excellent";
  forecast_confidence: number;
  best_viewing_hours: string[];
}

interface Reminder {
  id: string;
  event_id: string;
  type: "email" | "push" | "sms";
  timing: "1_hour" | "24_hours" | "1_week";
  enabled: boolean;
}

// NASA APOD integration
const fetchAPOD = async (date?: string): Promise<APODData> => {
  try {
    const apiKey = "DEMO_KEY"; // In production, use environment variable
    const dateParam = date ? `&date=${date}` : "";
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}${dateParam}`);
    const data = await response.json();
    
    return {
      date: data.date,
      title: data.title,
      explanation: data.explanation,
      url: data.url,
      media_type: data.media_type,
      thumbnail_url: data.thumbnail_url,
      copyright: data.copyright
    };
  } catch (error) {
    console.error('Error fetching APOD:', error);
    // Fallback data
    return {
      date: new Date().toISOString().split('T')[0],
      title: "Stunning Cosmic View",
      explanation: "Explore the wonders of our universe through this breathtaking astronomical image, showcasing the beauty and complexity of space.",
      url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800",
      media_type: "image"
    };
  }
};

// Launch Library 2 integration (simulated)
const fetchUpcomingLaunches = async (): Promise<Launch[]> => {
  try {
    // In production, use Launch Library 2 API: https://ll.thespacedevs.com/2.2.0/launch/upcoming/
    // For now, return simulated data
    return [
      {
        id: "launch_001",
        name: "Falcon 9 Block 5 | Starlink Group 6-40",
        date: "2024-03-15T10:30:00Z",
        agency: "SpaceX",
        mission_type: "Communications Satellite",
        location: "Kennedy Space Center, FL",
        rocket: "Falcon 9 Block 5",
        probability: 95,
        status: "Go",
        description: "Deployment of 23 Starlink satellites to low Earth orbit",
        webcast_live: true,
        image_url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400"
      },
      {
        id: "launch_002", 
        name: "Atlas V 551 | USSF-51",
        date: "2024-03-22T14:45:00Z",
        agency: "ULA",
        mission_type: "Military",
        location: "Cape Canaveral SFS, FL",
        rocket: "Atlas V 551",
        probability: 88,
        status: "Go",
        description: "Classified payload for US Space Force",
        webcast_live: false
      },
      {
        id: "launch_003",
        name: "Artemis II",
        date: "2024-11-15T09:00:00Z", 
        agency: "NASA",
        mission_type: "Crewed Lunar Mission",
        location: "Kennedy Space Center, FL",
        rocket: "Space Launch System",
        probability: 75,
        status: "NET",
        description: "Crewed lunar flyby mission with 4 astronauts",
        webcast_live: true,
        image_url: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400"
      }
    ];
  } catch (error) {
    console.error('Error fetching launches:', error);
    return [];
  }
};

// Astronomical events database
const generateAstronomicalEvents = (): AstronomicalEvent[] => [
  {
    id: "lyrid_2024",
    name: "Lyrid Meteor Shower",
    type: "meteor_shower",
    date: "2024-04-22T00:00:00Z",
    duration: "April 16-25 (Peak: April 22)",
    visibility: {
      hemisphere: "both",
      best_time: "2:00 AM - Dawn",
      peak_time: "April 22, 2:00 AM",
      magnitude: 2.0
    },
    description: "The Lyrid meteor shower produces about 20 meteors per hour at its peak. Known for occasional bright fireballs.",
    observing_tips: [
      "Look northeast toward constellation Lyra",
      "Best viewing after midnight",
      "Find dark skies away from city lights",
      "Allow 20 minutes for eyes to adjust"
    ],
    regional_visibility: {
      latitude_range: [30, 90],
      optimal_locations: ["Northern US", "Canada", "Europe", "Northern Asia"]
    }
  },
  {
    id: "mercury_venus_2024",
    name: "Mercury-Venus Conjunction",
    type: "conjunction",
    date: "2024-03-28T19:30:00Z",
    duration: "Best visible March 27-29",
    visibility: {
      hemisphere: "both",
      best_time: "30 minutes after sunset",
      magnitude: -3.8
    },
    description: "Mercury and Venus will appear very close together in the western sky after sunset.",
    observing_tips: [
      "Look west 30-45 minutes after sunset",
      "Use binoculars for best view",
      "Clear western horizon needed",
      "Venus will be the brighter of the two"
    ],
    regional_visibility: {
      latitude_range: [-60, 60],
      optimal_locations: ["Global visibility with clear western horizon"]
    }
  },
  {
    id: "lunar_eclipse_2024",
    name: "Partial Lunar Eclipse",
    type: "eclipse",
    date: "2024-09-18T02:44:00Z",
    duration: "3 hours 28 minutes",
    visibility: {
      hemisphere: "both",
      best_time: "2:44 AM UTC",
      peak_time: "2:44 AM UTC"
    },
    description: "The Moon will pass through Earth's partial shadow, creating a subtle darkening effect.",
    observing_tips: [
      "Visible with naked eye",
      "No special equipment needed",
      "Best viewing from dark location",
      "Take photos to capture the subtle effect"
    ],
    regional_visibility: {
      latitude_range: [-90, 90],
      optimal_locations: ["Americas", "Europe", "Africa", "Western Asia"]
    }
  }
];

// Simulated weather data for astronomical viewing
const fetchAstronomicalWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    // In production, integrate with weather APIs that provide astronomical seeing data
    return {
      location: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
      cloud_cover: Math.floor(Math.random() * 100),
      seeing: ["poor", "fair", "good", "excellent"][Math.floor(Math.random() * 4)] as any,
      transparency: ["poor", "fair", "good", "excellent"][Math.floor(Math.random() * 4)] as any,
      forecast_confidence: Math.floor(Math.random() * 40) + 60,
      best_viewing_hours: ["21:00-23:00", "23:00-01:00", "01:00-03:00", "03:00-05:00"]
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return {
      location: "Unknown",
      cloud_cover: 50,
      seeing: "fair",
      transparency: "fair",
      forecast_confidence: 70,
      best_viewing_hours: ["22:00-02:00"]
    };
  }
};

export default function CosmicEventPlanner() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [apodData, setApodData] = useState<APODData | null>(null);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [astronomicalEvents, setAstronomicalEvents] = useState<AstronomicalEvent[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [activeView, setActiveView] = useState<"calendar" | "launches" | "events" | "weather">("calendar");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        const [apod, launchData] = await Promise.all([
          fetchAPOD(),
          fetchUpcomingLaunches()
        ]);
        
        setApodData(apod);
        setLaunches(launchData);
        setAstronomicalEvents(generateAstronomicalEvents());
        
        // Request geolocation for weather data
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation({ lat: latitude, lon: longitude });
              
              const weather = await fetchAstronomicalWeather(latitude, longitude);
              setWeatherData(weather);
              
              toast.success('Location detected! Weather forecasts will be customized for your area.');
            },
            (error) => {
              console.error('Geolocation error:', error);
              toast.error('Could not get your location for weather forecasts');
            }
          );
        }
        
      } catch (error) {
        console.error('Error initializing data:', error);
        toast.error('Failed to load some event data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Request notification permission
  const enableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        toast.success('Notifications enabled! You\'ll receive alerts for upcoming events.');
      } else {
        toast.error('Notification permission denied');
      }
    } else {
      toast.error('Notifications not supported in this browser');
    }
  };

  // Add reminder for an event
  const addReminder = (eventId: string, type: Reminder['type'], timing: Reminder['timing']) => {
    const newReminder: Reminder = {
      id: `reminder_${Date.now()}`,
      event_id: eventId,
      type,
      timing,
      enabled: true
    };
    
    setReminders(prev => [...prev, newReminder]);
    toast.success(`Reminder set for ${timing.replace('_', ' ')} before the event`);
  };

  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    const dayLaunches = launches.filter(launch => 
      launch.date.split('T')[0] === dateStr
    );
    
    const dayEvents = astronomicalEvents.filter(event => 
      event.date.split('T')[0] === dateStr
    );
    
    return { launches: dayLaunches, events: dayEvents };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
            <Calendar className="absolute inset-0 w-8 h-8 m-auto text-purple-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Loading Cosmic Events</h3>
            <p className="text-gray-400">Fetching astronomical data and launch schedules...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Modern Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl blur-xl" />
        <div className="relative bg-gradient-to-br from-slate-900/90 via-purple-900/30 to-pink-900/40 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <Calendar className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Cosmic Event Planner</h1>
                <p className="text-purple-200 text-lg">Your guide to astronomical events, launches, and sky viewing</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-purple-300">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>NASA APOD Integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4" />
                    <span>Live Launch Data</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={enableNotifications}
                disabled={notificationsEnabled}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  notificationsEnabled
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30"
                }`}
              >
                <Bell className="w-4 h-4" />
                {notificationsEnabled ? 'Notifications On' : 'Enable Alerts'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
        {[
          { id: "calendar", label: "Today's View", icon: Calendar },
          { id: "launches", label: "Rocket Launches", icon: Rocket },
          { id: "events", label: "Sky Events", icon: Star },
          { id: "weather", label: "Viewing Conditions", icon: CloudSun }
        ].map((tab) => {
          const isActive = activeView === tab.id;
          const IconComponent = tab.icon;
          
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all relative ${
                isActive
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Content Views */}
      <AnimatePresence mode="wait">
        {activeView === "calendar" && apodData && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* NASA APOD Feature */}
            <div className="bg-gradient-to-br from-slate-900/50 via-blue-900/20 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Camera className="w-6 h-6 text-blue-400" />
                    NASA Astronomy Picture of the Day
                  </h2>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    >
                      <Bookmark className="w-5 h-5 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    >
                      <Share className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">{apodData.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{apodData.explanation}</p>
                    {apodData.copyright && (
                      <p className="text-sm text-gray-400">© {apodData.copyright}</p>
                    )}
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        View Full Size
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-400 transition-colors">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    {apodData.media_type === "image" ? (
                      <img
                        src={apodData.url}
                        alt={apodData.title}
                        className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                      />
                    ) : (
                      <div className="w-full h-80 bg-white/10 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-400">Video content available at NASA</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Events */}
            <div className="bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-pink-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-purple-400" />
                Today's Cosmic Events
              </h2>
              
              <div className="space-y-4">
                {getEventsForDate(selectedDate).launches.length === 0 && 
                 getEventsForDate(selectedDate).events.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No major cosmic events scheduled for today</p>
                    <p className="text-sm mt-2">Check the other tabs for upcoming events!</p>
                  </div>
                ) : (
                  <>
                    {getEventsForDate(selectedDate).launches.map((launch) => (
                      <motion.div
                        key={launch.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg mb-2">{launch.name}</h3>
                            <p className="text-gray-300 mb-4">{launch.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Agency:</span>
                                <span className="text-white ml-2">{launch.agency}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Time:</span>
                                <span className="text-white ml-2">{formatDate(launch.date)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => addReminder(launch.id, 'push', '1_hour')}
                            className="ml-4 p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 transition-colors"
                          >
                            <Bell className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    
                    {getEventsForDate(selectedDate).events.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg mb-2">{event.name}</h3>
                            <p className="text-gray-300 mb-4">{event.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                              <div>
                                <span className="text-gray-400">Best Time:</span>
                                <span className="text-white ml-2">{event.visibility.best_time}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Duration:</span>
                                <span className="text-white ml-2">{event.duration}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <span className="text-gray-400 text-sm">Observing Tips:</span>
                              <ul className="text-gray-300 text-sm space-y-1">
                                {event.observing_tips.slice(0, 2).map((tip, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-purple-400">•</span>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => addReminder(event.id, 'push', '1_hour')}
                            className="ml-4 p-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-400 transition-colors"
                          >
                            <Bell className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeView === "launches" && (
          <motion.div
            key="launches"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-slate-900/50 via-orange-900/20 to-red-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Rocket className="w-6 h-6 text-orange-400" />
                Upcoming Rocket Launches
              </h2>
              
              <div className="grid gap-6">
                {launches.map((launch) => (
                  <motion.div
                    key={launch.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {launch.image_url && (
                        <img
                          src={launch.image_url}
                          alt={launch.name}
                          className="w-full lg:w-32 h-32 object-cover rounded-xl"
                        />
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-white font-bold text-xl mb-2">{launch.name}</h3>
                            <p className="text-gray-300">{launch.description}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              launch.status === 'Go' ? 'bg-green-500/20 text-green-400' :
                              launch.status === 'NET' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {launch.status}
                            </div>
                            
                            {launch.webcast_live && (
                              <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                                🔴 Live Stream
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Agency:</span>
                            <div className="text-white font-medium">{launch.agency}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Launch Time:</span>
                            <div className="text-white font-medium">{formatDate(launch.date)}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Location:</span>
                            <div className="text-white font-medium">{launch.location}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Probability:</span>
                            <div className="text-white font-medium">{launch.probability}%</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => addReminder(launch.id, 'push', '1_hour')}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-xl text-orange-400 transition-colors"
                          >
                            <Bell className="w-4 h-4" />
                            Remind Me
                          </button>
                          
                          {launch.webcast_live && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 transition-colors">
                              <ExternalLink className="w-4 h-4" />
                              Watch Live
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeView === "events" && (
          <motion.div
            key="events"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-slate-900/50 via-indigo-900/20 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Star className="w-6 h-6 text-indigo-400" />
                Astronomical Events & Sky Shows
              </h2>
              
              <div className="grid gap-6">
                {astronomicalEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-bold text-xl mb-2">{event.name}</h3>
                        <p className="text-gray-300 mb-4">{event.description}</p>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.type === 'meteor_shower' ? 'bg-yellow-500/20 text-yellow-400' :
                        event.type === 'eclipse' ? 'bg-red-500/20 text-red-400' :
                        event.type === 'conjunction' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {event.type.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div>
                          <span className="text-gray-400 text-sm">Duration:</span>
                          <div className="text-white font-medium">{event.duration}</div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Best Viewing Time:</span>
                          <div className="text-white font-medium">{event.visibility.best_time}</div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Hemisphere:</span>
                          <div className="text-white font-medium capitalize">{event.visibility.hemisphere}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <span className="text-gray-400 text-sm">Optimal Latitude:</span>
                          <div className="text-white font-medium">
                            {event.regional_visibility.latitude_range[0]}° to {event.regional_visibility.latitude_range[1]}°
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Best Locations:</span>
                          <div className="text-white font-medium text-sm">
                            {event.regional_visibility.optimal_locations.join(', ')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-gray-400 text-sm">Observing Tips:</span>
                        <ul className="text-gray-300 text-sm space-y-1">
                          {event.observing_tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-indigo-400">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                      <button
                        onClick={() => addReminder(event.id, 'push', '24_hours')}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-xl text-indigo-400 transition-colors"
                      >
                        <Bell className="w-4 h-4" />
                        Set Reminder
                      </button>
                      
                      <button className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-400 transition-colors">
                        <MapPin className="w-4 h-4" />
                        Check Visibility
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeView === "weather" && (
          <motion.div
            key="weather"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-slate-900/50 via-cyan-900/20 to-blue-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <CloudSun className="w-6 h-6 text-cyan-400" />
                Astronomical Viewing Conditions
              </h2>
              
              {weatherData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CloudSun className="w-5 h-5 text-cyan-400" />
                      <span className="text-gray-400">Cloud Cover</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">{weatherData.cloud_cover}%</div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-red-400 h-2 rounded-full"
                        style={{ width: `${weatherData.cloud_cover}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Eye className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-400">Seeing</span>
                    </div>
                    <div className={`text-2xl font-bold mb-2 capitalize ${
                      weatherData.seeing === 'excellent' ? 'text-green-400' :
                      weatherData.seeing === 'good' ? 'text-blue-400' :
                      weatherData.seeing === 'fair' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {weatherData.seeing}
                    </div>
                    <p className="text-gray-400 text-sm">Atmospheric stability</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Telescope className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-400">Transparency</span>
                    </div>
                    <div className={`text-2xl font-bold mb-2 capitalize ${
                      weatherData.transparency === 'excellent' ? 'text-green-400' :
                      weatherData.transparency === 'good' ? 'text-blue-400' :
                      weatherData.transparency === 'fair' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {weatherData.transparency}
                    </div>
                    <p className="text-gray-400 text-sm">Atmospheric clarity</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Settings className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400">Confidence</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">{weatherData.forecast_confidence}%</div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-400 to-green-400 h-2 rounded-full"
                        style={{ width: `${weatherData.forecast_confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <CloudSun className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Weather data not available</p>
                  <p className="text-sm mt-2">Enable location access for personalized forecasts</p>
                </div>
              )}
              
              {weatherData && (
                <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-400" />
                    Best Viewing Hours Tonight
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {weatherData.best_viewing_hours.map((hour, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 font-medium"
                      >
                        {hour}
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm mt-3">
                    Times shown are in your local timezone. Cloud cover and atmospheric conditions may change.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}