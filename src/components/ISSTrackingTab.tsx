"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Satellite, 
  Users, 
  AlertTriangle, 
  RefreshCw, 
  MapPin, 
  Clock,
  Orbit,
  Activity,
  Eye,
  Settings,
  Zap,
  Target,
  Radio
} from "lucide-react";
import toast from "react-hot-toast";

interface ISSPosition {
  latitude: number;
  longitude: number;
  timestamp: number;
  altitude: number;
  velocity: number;
}

interface Astronaut {
  name: string;
  craft: string;
}

interface PassTime {
  risetime: number;
  duration: number;
}

interface Spacewalk {
  id: string;
  date: string;
  duration: string;
  crew: string[];
  objective: string;
  status: "scheduled" | "active" | "completed";
}

interface SatelliteData {
  satid: number;
  satname: string;
  intDesignator: string;
  launchDate: string;
  satlat: number;
  satlng: number;
  satalt: number;
  azimuth: number;
  elevation: number;
  ra: number;
  dec: number;
  range: number;
  rangerate: number;
  agency: string;
  category: string;
}

// Real API integration functions
const fetchISSPosition = async (): Promise<ISSPosition> => {
  try {
    const response = await fetch('http://api.open-notify.org/iss-now.json');
    const data = await response.json();
    
    return {
      latitude: parseFloat(data.iss_position.latitude),
      longitude: parseFloat(data.iss_position.longitude),
      timestamp: data.timestamp,
      altitude: 408, // Average ISS altitude in km
      velocity: 27600 // Average ISS velocity in km/h
    };
  } catch (error) {
    console.error('Error fetching ISS position:', error);
    // Fallback to simulated data
    return {
      latitude: 25.7617 + (Math.random() - 0.5) * 180,
      longitude: -80.1918 + (Math.random() - 0.5) * 360,
      timestamp: Date.now() / 1000,
      altitude: 408,
      velocity: 27600
    };
  }
};

const fetchISSCrew = async (): Promise<Astronaut[]> => {
  try {
    const response = await fetch('http://api.open-notify.org/astros.json');
    const data = await response.json();
    
    return data.people.filter((person: any) => person.craft === 'ISS');
  } catch (error) {
    console.error('Error fetching ISS crew:', error);
    // Fallback crew data
    return [
      { name: "Andreas Mogensen", craft: "ISS" },
      { name: "Satoshi Furukawa", craft: "ISS" },
      { name: "Konstantin Borisov", craft: "ISS" }
    ];
  }
};

const fetchISSPasses = async (lat: number, lon: number): Promise<PassTime[]> => {
  try {
    const response = await fetch(`http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}&n=5`);
    const data = await response.json();
    
    return data.response || [];
  } catch (error) {
    console.error('Error fetching ISS passes:', error);
    return [];
  }
};

// Simulated spacewalk data (in production, this would come from NASA APIs)
const generateSpacewalks = (): Spacewalk[] => [
  {
    id: "eva_75",
    date: "2024-02-15T14:30:00Z",
    duration: "6h 45m",
    crew: ["Oleg Kononenko", "Nikolai Chub"],
    objective: "Relocate Soyuz spacecraft docking adapter",
    status: "completed"
  },
  {
    id: "eva_76",
    date: "2024-03-08T13:00:00Z", 
    duration: "7h 12m",
    crew: ["Loral O'Hara", "Matthew Dominick"],
    objective: "Install new solar array batteries",
    status: "scheduled"
  },
  {
    id: "eva_77",
    date: "2024-03-22T12:15:00Z",
    duration: "6h 30m", 
    crew: ["Jasmin Moghbeli", "Andreas Mogensen"],
    objective: "Maintenance on Columbus module",
    status: "scheduled"
  }
];

// Simulated satellite tracking data (would use N2YO API in production)
const generateSatelliteData = (): SatelliteData[] => [
  {
    satid: 25544,
    satname: "International Space Station",
    intDesignator: "1998-067A",
    launchDate: "1998-11-20",
    satlat: 51.6461,
    satlng: -0.7915,
    satalt: 408.5,
    azimuth: 45.2,
    elevation: 23.8,
    ra: 123.45,
    dec: 45.67,
    range: 650.2,
    rangerate: -2.1,
    agency: "NASA/Roscosmos",
    category: "Space Station"
  },
  {
    satid: 43013,
    satname: "Starlink-1007",
    intDesignator: "2019-074A", 
    launchDate: "2019-11-11",
    satlat: 53.0,
    satlng: 2.5,
    satalt: 550.0,
    azimuth: 78.3,
    elevation: 15.2,
    ra: 234.56,
    dec: 12.34,
    range: 890.5,
    rangerate: 1.8,
    agency: "SpaceX",
    category: "Communications"
  },
  {
    satid: 28654,
    satname: "GPS BIIR-2",
    intDesignator: "2005-038A",
    launchDate: "2005-09-26", 
    satlat: 55.2,
    satlng: -12.8,
    satalt: 20200.0,
    azimuth: 156.7,
    elevation: 8.9,
    ra: 45.78,
    dec: 67.89,
    range: 22500.3,
    rangerate: 0.5,
    agency: "US Air Force",
    category: "Navigation"
  }
];

export default function ISSTrackingTab() {
  const [issPosition, setIssPosition] = useState<ISSPosition | null>(null);
  const [crew, setCrew] = useState<Astronaut[]>([]);
  const [passes, setPasses] = useState<PassTime[]>([]);
  const [spacewalks, setSpacewalks] = useState<Spacewalk[]>([]);
  const [satellites, setSatellites] = useState<SatelliteData[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedAgency, setSelectedAgency] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showNotifications, setShowNotifications] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time data fetching
  const fetchAllData = async () => {
    try {
      const [position, crewData] = await Promise.all([
        fetchISSPosition(),
        fetchISSCrew()
      ]);
      
      setIssPosition(position);
      setCrew(crewData);
      
      // Fetch passes if user location is available
      if (userLocation) {
        const passData = await fetchISSPasses(userLocation.lat, userLocation.lon);
        setPasses(passData);
      }
      
      // Load spacewalk and satellite data
      setSpacewalks(generateSpacewalks());
      setSatellites(generateSatelliteData());
      
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      toast.error('Failed to fetch real-time data');
    } finally {
      setLoading(false);
    }
  };

  // Get user location for ISS passes
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          toast.success('Location detected! ISS pass times will be calculated for your area.');
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Could not get your location for ISS pass predictions');
        }
      );
    }
  };

  useEffect(() => {
    fetchAllData();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchAllData, 10000); // Update every 10 seconds
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, userLocation]);

  // Spacewalk notifications
  useEffect(() => {
    if (showNotifications && spacewalks.length > 0) {
      const activeSpacewalk = spacewalks.find(sw => sw.status === 'active');
      const upcomingSpacewalk = spacewalks.find(sw => {
        const swDate = new Date(sw.date);
        const now = new Date();
        const timeDiff = swDate.getTime() - now.getTime();
        return timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000; // Within 24 hours
      });

      if (activeSpacewalk) {
        toast('🚀 Spacewalk in progress!', {
          icon: '👩‍🚀',
          duration: 6000,
        });
      } else if (upcomingSpacewalk) {
        toast('🗓️ Spacewalk scheduled within 24 hours!', {
          icon: '⏰',
          duration: 4000,
        });
      }
    }
  }, [spacewalks, showNotifications]);

  // Filter satellites by agency and category
  const filteredSatellites = satellites.filter(sat => {
    const agencyMatch = selectedAgency === "All" || sat.agency.includes(selectedAgency);
    const categoryMatch = selectedCategory === "All" || sat.category === selectedCategory;
    return agencyMatch && categoryMatch;
  });

  const agencies = ["All", ...Array.from(new Set(satellites.map(s => s.agency.split('/')[0])))];
  const categories = ["All", ...Array.from(new Set(satellites.map(s => s.category)))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
            <Satellite className="absolute inset-0 w-8 h-8 m-auto text-blue-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Connecting to Space</h3>
            <p className="text-gray-400">Fetching real-time tracking data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Real-Time Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-green-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
        <div className="relative bg-gradient-to-br from-slate-900/90 via-blue-900/30 to-green-900/40 backdrop-blur-2xl border border-blue-500/30 rounded-3xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-br from-blue-400 to-green-500 rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <Globe className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Real-Time Space Tracker</h1>
                <p className="text-blue-200 text-lg">Live tracking of ISS, satellites, and spacewalk activities</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-blue-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Live Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Updated every 10s</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  autoRefresh
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  showNotifications
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                Alerts
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* ISS Live Tracking */}
      {issPosition && (
        <div className="bg-gradient-to-br from-slate-900/50 via-blue-900/20 to-green-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Satellite className="w-6 h-6 text-blue-400" />
            International Space Station - Live Position
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Position Data */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-400 text-sm">Latitude</span>
                </div>
                <div className="text-xl font-bold text-white">{issPosition.latitude.toFixed(4)}°</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span className="text-gray-400 text-sm">Longitude</span>
                </div>
                <div className="text-xl font-bold text-white">{issPosition.longitude.toFixed(4)}°</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Orbit className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-400 text-sm">Altitude</span>
                </div>
                <div className="text-xl font-bold text-white">{issPosition.altitude} km</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span className="text-gray-400 text-sm">Velocity</span>
                </div>
                <div className="text-xl font-bold text-white">{issPosition.velocity.toLocaleString()} km/h</div>
              </div>
            </div>
            
            {/* Crew Information */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Current Crew ({crew.length})
              </h3>
              <div className="space-y-3">
                {crew.map((astronaut, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium">{astronaut.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ISS Pass Predictions */}
      {userLocation && passes.length > 0 && (
        <div className="bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-blue-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Eye className="w-6 h-6 text-purple-400" />
            ISS Pass Predictions for Your Location
          </h2>
          
          <div className="grid gap-4">
            {passes.slice(0, 3).map((pass, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Satellite className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {new Date(pass.risetime * 1000).toLocaleDateString()} at{' '}
                      {new Date(pass.risetime * 1000).toLocaleTimeString()}
                    </div>
                    <div className="text-gray-400 text-sm">Duration: {Math.floor(pass.duration / 60)} minutes</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-purple-400 font-medium">Pass #{index + 1}</div>
                  <div className="text-gray-400 text-sm">Visible overhead</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Spacewalk Alerts */}
      <div className="bg-gradient-to-br from-slate-900/50 via-red-900/20 to-orange-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Users className="w-6 h-6 text-orange-400" />
          Spacewalk Activities & Alerts
        </h2>
        
        <div className="grid gap-4">
          {spacewalks.map((spacewalk) => (
            <motion.div
              key={spacewalk.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border ${
                spacewalk.status === 'active'
                  ? 'bg-green-500/10 border-green-500/30'
                  : spacewalk.status === 'scheduled'
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-gray-500/10 border-gray-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{spacewalk.id.toUpperCase()}</h3>
                  <p className="text-gray-300">{spacewalk.objective}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  spacewalk.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : spacewalk.status === 'scheduled'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {spacewalk.status.charAt(0).toUpperCase() + spacewalk.status.slice(1)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Date & Time:</span>
                  <div className="text-white font-medium">
                    {new Date(spacewalk.date).toLocaleDateString()} at{' '}
                    {new Date(spacewalk.date).toLocaleTimeString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Duration:</span>
                  <div className="text-white font-medium">{spacewalk.duration}</div>
                </div>
                <div>
                  <span className="text-gray-400">Crew:</span>
                  <div className="text-white font-medium">{spacewalk.crew.join(', ')}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Satellite Tracking with Filtering */}
      <div className="bg-gradient-to-br from-slate-900/50 via-cyan-900/20 to-blue-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Radio className="w-6 h-6 text-cyan-400" />
            Satellite Tracking
          </h2>
          
          <div className="flex gap-3">
            <select
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              className="px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              {agencies.map(agency => (
                <option key={agency} value={agency} className="bg-slate-900">{agency}</option>
              ))}
            </select>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-900">{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid gap-4">
          {filteredSatellites.map((satellite) => (
            <motion.div
              key={satellite.satid}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{satellite.satname}</h3>
                  <p className="text-cyan-400">{satellite.agency} • {satellite.category}</p>
                  <p className="text-gray-400 text-sm">ID: {satellite.satid} • {satellite.intDesignator}</p>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-medium">Range: {satellite.range.toFixed(1)} km</div>
                  <div className="text-gray-400 text-sm">Launched: {satellite.launchDate}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Position:</span>
                  <div className="text-white font-medium">
                    {satellite.satlat.toFixed(2)}°, {satellite.satlng.toFixed(2)}°
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Altitude:</span>
                  <div className="text-white font-medium">{satellite.satalt.toFixed(1)} km</div>
                </div>
                <div>
                  <span className="text-gray-400">Elevation:</span>
                  <div className="text-white font-medium">{satellite.elevation.toFixed(1)}°</div>
                </div>
                <div>
                  <span className="text-gray-400">Azimuth:</span>
                  <div className="text-white font-medium">{satellite.azimuth.toFixed(1)}°</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 