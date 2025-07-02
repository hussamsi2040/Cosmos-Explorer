"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Satellite, MapPin, Clock, Users, Bell, AlertTriangle, Activity, Globe } from "lucide-react";
import toast from "react-hot-toast";

interface ISSData {
  position: {
    latitude: number;
    longitude: number;
  };
  velocity: number;
  altitude: number;
  visibility: string;
  nextPass?: {
    time: string;
    duration: number;
    maxElevation: number;
  };
}

interface Spacewalk {
  id: string;
  date: string;
  duration: string;
  astronauts: string[];
  mission: string;
  objectives: string[];
  status: "completed" | "upcoming" | "in_progress";
}

interface SatelliteAlert {
  id: string;
  type: "conjunction" | "debris" | "maneuver" | "communication";
  severity: "low" | "medium" | "high";
  message: string;
  timestamp: Date;
}

const generateSpacewalks = (): Spacewalk[] => {
  const baseDate = new Date('2024-07-02T00:00:00Z');
  return [
    {
      id: "eva-1",
      date: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      duration: "6h 30m",
      astronauts: ["Andreas Mogensen", "Satoshi Furukawa"],
      mission: "Expedition 70 EVA",
      objectives: [
        "Install new solar array components",
        "Replace faulty antenna unit",
        "Collect external samples"
      ],
      status: "upcoming"
    },
    {
      id: "eva-2",
      date: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      duration: "7h 45m",
      astronauts: ["Jasmin Moghbeli", "Loral O'Hara"],
      mission: "Expedition 70 EVA",
      objectives: [
        "Maintenance of cooling system",
        "Camera installation",
        "External inspection"
      ],
      status: "completed"
    }
  ];
};

const generateInitialAlerts = (): SatelliteAlert[] => {
  const baseDate = new Date('2024-07-02T00:00:00Z');
  const alerts: SatelliteAlert[] = [];
  
  // Generate some sample alerts with fixed data for consistency
  alerts.push({
    id: "alert-1",
    type: "debris",
    severity: "medium",
    message: "Space debris detected in trajectory - monitoring for potential conjunction",
    timestamp: new Date(baseDate.getTime() - 2 * 60 * 60 * 1000)
  });

  alerts.push({
    id: "alert-2",
    type: "maneuver",
    severity: "low",
    message: "Minor orbital adjustment completed successfully",
    timestamp: new Date(baseDate.getTime() - 6 * 60 * 60 * 1000)
  });
  
  return alerts;
};

let alertIdCounter = 0;

export default function ISSTrackingTab() {
  const [issData, setIssData] = useState<ISSData | null>(null);
  const [spacewalks, setSpacewalks] = useState<Spacewalk[]>([]);
  const [alerts, setAlerts] = useState<SatelliteAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [lastAlertTime, setLastAlertTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Initialize data only on client side
    setSpacewalks(generateSpacewalks());
    setAlerts(generateInitialAlerts());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    async function fetchISSData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://api.open-notify.org/iss-now.json");
        const data = await res.json();
        
        if (data && data.iss_position) {
          const newIssData: ISSData = {
            position: {
              latitude: parseFloat(data.iss_position.latitude),
              longitude: parseFloat(data.iss_position.longitude),
            },
            velocity: 27600, // km/h - approximate ISS velocity
            altitude: 408, // km - approximate ISS altitude
            visibility: Math.random() > 0.5 ? "Visible" : "In Earth's shadow"
          };

          setIssData(newIssData);
          
          // Generate random alerts occasionally (only if alerts enabled and mounted)
          if (Math.random() > 0.9 && alertsEnabled && mounted) {
            const newAlert: SatelliteAlert = {
              id: `alert-${++alertIdCounter}`,
              type: "communication",
              severity: "low",
              message: "ISS communication window open - clear signal quality",
              timestamp: new Date()
            };
            setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
            toast.success("ISS Alert: " + newAlert.message);
            setLastAlertTime(new Date());
          }
        } else {
          setError("Could not get ISS position.");
        }
      } catch (e) {
        setError("Could not get ISS position.");
      } finally {
        setLoading(false);
      }
    }

    fetchISSData();
    const interval = setInterval(fetchISSData, 10000); // update every 10s
    return () => clearInterval(interval);
  }, [alertsEnabled, mounted]);

  const toggleAlerts = () => {
    if (!mounted) return;
    
    setAlertsEnabled(prev => {
      const newState = !prev;
      if (newState) {
        toast.success("ISS alerts enabled! You'll receive notifications for important events.");
      } else {
        toast("ISS alerts disabled.");
      }
      return newState;
    });
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-400 bg-red-900/30 border-red-400/30";
      case "medium": return "text-yellow-400 bg-yellow-900/30 border-yellow-400/30";
      case "low": return "text-green-400 bg-green-900/30 border-green-400/30";
      default: return "text-gray-400 bg-gray-900/30 border-gray-400/30";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "debris": return AlertTriangle;
      case "conjunction": return Activity;
      case "maneuver": return Satellite;
      case "communication": return Globe;
      default: return Bell;
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-white">Initializing ISS tracker...</span>
      </div>
    );
  }

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
      />
      <span className="ml-3 text-white">Loading ISS tracking data...</span>
    </div>
  );

  if (error) return <div className="text-red-400 p-6">{error}</div>;

  const mapUrl = issData
    ? `https://static-maps.yandex.ru/1.x/?ll=${issData.position.longitude},${issData.position.latitude}&z=3&l=map&size=600,300&pt=${issData.position.longitude},${issData.position.latitude},pm2rdm`
    : "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Satellite className="text-blue-400 w-8 h-8" />
          <h2 className="text-3xl font-bold text-white">ISS Live Tracker</h2>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="text-blue-400"
          >
            <Globe className="w-6 h-6" />
          </motion.div>
        </div>
        <button
          onClick={toggleAlerts}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            alertsEnabled 
              ? "bg-blue-500 text-white" 
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }`}
        >
          <Bell className="w-4 h-4" />
          {alertsEnabled ? "Alerts On" : "Enable Alerts"}
        </button>
      </div>

      {/* Real-time Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-bold">Position</span>
          </div>
          <div className="text-white font-mono text-sm">
            Lat: {issData?.position.latitude.toFixed(2)}°<br/>
            Lon: {issData?.position.longitude.toFixed(2)}°
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-900/30 border border-green-400/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-bold">Velocity</span>
          </div>
          <div className="text-white font-bold">
            {issData?.velocity.toLocaleString()} km/h
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-purple-900/30 border border-purple-400/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Satellite className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-bold">Altitude</span>
          </div>
          <div className="text-white font-bold">
            {issData?.altitude} km
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-orange-900/30 border border-orange-400/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-orange-400" />
            <span className="text-orange-400 font-bold">Visibility</span>
          </div>
          <div className="text-white font-bold text-sm">
            {issData?.visibility}
          </div>
        </motion.div>
      </div>

      {/* Live Map */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Current ISS Location</h3>
          <p className="text-gray-400 text-sm">Updated every 10 seconds • Orbital period: ~90 minutes</p>
        </div>
        {mapUrl && (
          <div className="relative">
            <img 
              src={mapUrl} 
              alt="ISS position on map" 
              className="w-full h-64 object-cover" 
            />
            <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                Live Position
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map(alert => {
              const AlertIcon = getAlertIcon(alert.type);
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`border rounded-lg p-3 ${getAlertColor(alert.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <AlertIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{alert.message}</div>
                      <div className="text-xs opacity-75 mt-1">
                        {alert.timestamp.toLocaleTimeString()} • {alert.type} • {alert.severity} priority
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Spacewalks */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Recent & Upcoming Spacewalks (EVAs)
        </h3>
        <div className="space-y-4">
          {spacewalks.map(spacewalk => (
            <motion.div
              key={spacewalk.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-lg p-4 ${
                spacewalk.status === "upcoming" 
                  ? "bg-blue-900/30 border-blue-400/30" 
                  : spacewalk.status === "in_progress"
                  ? "bg-green-900/30 border-green-400/30"
                  : "bg-gray-900/30 border-gray-400/30"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-bold">{spacewalk.mission}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{spacewalk.date} • {spacewalk.duration}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  spacewalk.status === "upcoming" 
                    ? "bg-blue-500 text-white" 
                    : spacewalk.status === "in_progress"
                    ? "bg-green-500 text-white"
                    : "bg-gray-500 text-white"
                }`}>
                  {spacewalk.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="text-sm text-gray-400 mb-1">Astronauts:</div>
                <div className="text-white text-sm">{spacewalk.astronauts.join(', ')}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Mission Objectives:</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  {spacewalk.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center">
        ISS position data from{" "}
        <a href="http://open-notify.org/Open-Notify-API/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          Open Notify API
        </a>
        {lastAlertTime && alertsEnabled && (
          <span className="block mt-1">
            Last alert check: {lastAlertTime.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
} 