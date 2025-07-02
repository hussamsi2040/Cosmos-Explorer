"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Satellite, Shield, Trash2, Info, Zap, Globe, Target } from "lucide-react";

interface DebrisObject {
  id: string;
  name: string;
  type: "satellite_debris" | "rocket_body" | "operational_satellite" | "space_station" | "unknown";
  altitude: number; // km
  speed: number; // km/s
  size: string; // estimated size category
  riskLevel: "low" | "medium" | "high" | "critical";
  origin: string;
  launchDate?: string;
  lastUpdate: Date;
}

const DEBRIS_TYPES = {
  satellite_debris: { 
    icon: Satellite, 
    color: "text-red-400", 
    bg: "bg-red-900/30", 
    label: "Satellite Debris" 
  },
  rocket_body: { 
    icon: Zap, 
    color: "text-orange-400", 
    bg: "bg-orange-900/30", 
    label: "Rocket Body" 
  },
  operational_satellite: { 
    icon: Satellite, 
    color: "text-green-400", 
    bg: "bg-green-900/30", 
    label: "Active Satellite" 
  },
  space_station: { 
    icon: Globe, 
    color: "text-blue-400", 
    bg: "bg-blue-900/30", 
    label: "Space Station" 
  },
  unknown: { 
    icon: Target, 
    color: "text-gray-400", 
    bg: "bg-gray-900/30", 
    label: "Unknown Object" 
  }
};

const RISK_LEVELS = {
  low: { color: "text-green-400", bg: "bg-green-900/30", label: "Low Risk" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-900/30", label: "Medium Risk" },
  high: { color: "text-orange-400", bg: "bg-orange-900/30", label: "High Risk" },
  critical: { color: "text-red-400", bg: "bg-red-900/30", label: "Critical Risk" }
};

// Simulated space debris data (in real app, would come from space surveillance networks)
const generateDebrisData = (): DebrisObject[] => {
  const debris: DebrisObject[] = [];
  
  // ISS
  debris.push({
    id: "iss",
    name: "International Space Station",
    type: "space_station",
    altitude: 408,
    speed: 7.66,
    size: "Large (109m × 73m)",
    riskLevel: "low",
    origin: "International",
    launchDate: "1998",
    lastUpdate: new Date()
  });

  // Sample debris objects
  const debrisData = [
    { name: "Cosmos 1408 Debris", type: "satellite_debris", altitude: 485, origin: "Russia", risk: "high" },
    { name: "Fengyun-1C Fragment", type: "satellite_debris", altitude: 850, origin: "China", risk: "medium" },
    { name: "Iridium 33 Debris", type: "satellite_debris", altitude: 790, origin: "USA", risk: "medium" },
    { name: "Starlink-1007", type: "operational_satellite", altitude: 550, origin: "SpaceX", risk: "low" },
    { name: "Falcon 9 R/B", type: "rocket_body", altitude: 300, origin: "SpaceX", risk: "medium" },
    { name: "Ariane 5 Upper Stage", type: "rocket_body", altitude: 35786, origin: "ESA", risk: "low" },
    { name: "Hubble Space Telescope", type: "operational_satellite", altitude: 547, origin: "NASA", risk: "low" },
    { name: "Unknown Fragment #4821", type: "unknown", altitude: 650, origin: "Unknown", risk: "high" },
    { name: "Sentinel-1A", type: "operational_satellite", altitude: 693, origin: "ESA", risk: "low" },
    { name: "Long March 3B R/B", type: "rocket_body", altitude: 250, origin: "China", risk: "critical" }
  ];

  debrisData.forEach((item, index) => {
    debris.push({
      id: `debris_${index}`,
      name: item.name,
      type: item.type as any,
      altitude: item.altitude + Math.random() * 20 - 10, // Add some variation
      speed: 7.5 + Math.random() * 2, // Typical orbital speeds
      size: ["Small (< 1m)", "Medium (1-5m)", "Large (> 5m)"][Math.floor(Math.random() * 3)],
      riskLevel: item.risk as any,
      origin: item.origin,
      launchDate: Math.random() > 0.5 ? (2000 + Math.floor(Math.random() * 24)).toString() : undefined,
      lastUpdate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days
    });
  });

  return debris.sort((a, b) => b.altitude - a.altitude);
};

export default function SpaceDebrisTracker() {
  const [debrisObjects, setDebrisObjects] = useState<DebrisObject[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading debris data
    setTimeout(() => {
      setDebrisObjects(generateDebrisData());
      setLoading(false);
    }, 1000);

    // Update positions every 30 seconds
    const interval = setInterval(() => {
      setDebrisObjects(prev => prev.map(obj => ({
        ...obj,
        lastUpdate: new Date()
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredObjects = debrisObjects.filter(obj => {
    const typeMatch = filter === "all" || obj.type === filter;
    const riskMatch = riskFilter === "all" || obj.riskLevel === riskFilter;
    return typeMatch && riskMatch;
  });

  const riskStats = {
    critical: debrisObjects.filter(obj => obj.riskLevel === "critical").length,
    high: debrisObjects.filter(obj => obj.riskLevel === "high").length,
    medium: debrisObjects.filter(obj => obj.riskLevel === "medium").length,
    low: debrisObjects.filter(obj => obj.riskLevel === "low").length,
    total: debrisObjects.length
  };

  const DebrisCard = ({ debris }: { debris: DebrisObject }) => {
    const debrisType = DEBRIS_TYPES[debris.type];
    const riskLevel = RISK_LEVELS[debris.riskLevel];
    const Icon = debrisType.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${debrisType.bg} border border-white/10 rounded-lg p-4`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${debrisType.color}`} />
            <div>
              <h3 className="text-white font-bold text-sm">{debris.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${debrisType.bg} ${debrisType.color}`}>
                {debrisType.label}
              </span>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-bold ${riskLevel.bg} ${riskLevel.color}`}>
            {riskLevel.label}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-gray-300">
          <div>
            <span className="text-gray-400">Altitude:</span>
            <div className="text-white font-bold">{debris.altitude.toFixed(0)} km</div>
          </div>
          <div>
            <span className="text-gray-400">Speed:</span>
            <div className="text-white font-bold">{debris.speed.toFixed(2)} km/s</div>
          </div>
          <div>
            <span className="text-gray-400">Size:</span>
            <div className="text-white">{debris.size}</div>
          </div>
          <div>
            <span className="text-gray-400">Origin:</span>
            <div className="text-white">{debris.origin}</div>
          </div>
        </div>

        {debris.launchDate && (
          <div className="mt-2 text-xs text-gray-400">
            Launch: {debris.launchDate}
          </div>
        )}

        <div className="mt-2 text-xs text-gray-400">
          Last updated: {debris.lastUpdate.toLocaleTimeString()}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
        />
        <span className="ml-3 text-white">Loading space debris data...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Trash2 className="text-red-400 w-8 h-8" />
        <h2 className="text-3xl font-bold text-white">Space Debris Tracker</h2>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="text-gray-400"
        >
          <Globe className="w-6 h-6" />
        </motion.div>
      </div>

      {/* Risk Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{riskStats.total}</div>
          <div className="text-sm text-gray-400">Total Objects</div>
        </div>
        <div className="bg-red-900/30 border border-red-400/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{riskStats.critical}</div>
          <div className="text-sm text-gray-400">Critical Risk</div>
        </div>
        <div className="bg-orange-900/30 border border-orange-400/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{riskStats.high}</div>
          <div className="text-sm text-gray-400">High Risk</div>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-400/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{riskStats.medium}</div>
          <div className="text-sm text-gray-400">Medium Risk</div>
        </div>
        <div className="bg-green-900/30 border border-green-400/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{riskStats.low}</div>
          <div className="text-sm text-gray-400">Low Risk</div>
        </div>
      </div>

      {/* Critical Alerts */}
      {riskStats.critical > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-900/30 border border-red-400/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-bold">Critical Debris Alert</span>
          </div>
          <p className="text-gray-300 text-sm">
            {riskStats.critical} object{riskStats.critical !== 1 ? 's' : ''} pose{riskStats.critical === 1 ? 's' : ''} critical collision risk. 
            These objects require immediate tracking and potential avoidance maneuvers.
          </p>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-2 rounded-lg text-sm transition-all ${
              filter === "all" ? "bg-blue-500 text-white" : "bg-white/10 text-gray-300"
            }`}
          >
            All Objects
          </button>
          {Object.entries(DEBRIS_TYPES).map(([type, config]) => {
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
        
        <div className="border-l border-white/20 pl-4 flex gap-2">
          <button
            onClick={() => setRiskFilter("all")}
            className={`px-3 py-2 rounded-lg text-sm transition-all ${
              riskFilter === "all" ? "bg-purple-500 text-white" : "bg-white/10 text-gray-300"
            }`}
          >
            All Risk Levels
          </button>
          {Object.entries(RISK_LEVELS).map(([risk, config]) => (
            <button
              key={risk}
              onClick={() => setRiskFilter(risk)}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                riskFilter === risk ? "bg-purple-500 text-white" : "bg-white/10 text-gray-300"
              }`}
            >
              <span className={config.color}>{config.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Debris Objects Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">
          Tracked Objects ({filteredObjects.length})
        </h3>
        {filteredObjects.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No objects match the current filters.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredObjects.map(debris => (
              <DebrisCard key={debris.id} debris={debris} />
            ))}
          </div>
        )}
      </div>

      {/* Educational Information */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">About Space Debris</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
          <div>
            <h4 className="text-white font-semibold mb-2">What is Space Debris?</h4>
            <p className="mb-4">
              Space debris consists of defunct human-made objects in space, primarily in Earth orbit. 
              This includes old satellites, spent rocket stages, fragments from collisions or explosions, 
              and other debris smaller than 1 cm.
            </p>
            
            <h4 className="text-white font-semibold mb-2">The Kessler Syndrome</h4>
            <p>
              A scenario where the density of objects in low Earth orbit is high enough that collisions 
              could cause a cascade effect, making space activities extremely dangerous.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-2">Current Statistics</h4>
            <ul className="space-y-1 mb-4">
              <li>• Over 34,000 tracked objects larger than 10 cm</li>
              <li>• ~900,000 objects between 1-10 cm</li>
              <li>• ~130 million objects smaller than 1 cm</li>
              <li>• Objects travel at speeds up to 17,500 mph</li>
            </ul>
            
            <h4 className="text-white font-semibold mb-2">Mitigation Efforts</h4>
            <ul className="space-y-1">
              <li>• Spacecraft design for post-mission disposal</li>
              <li>• Active debris removal missions</li>
              <li>• International guidelines for space activities</li>
              <li>• Collision avoidance maneuvers</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center">
        Data simulated for educational purposes. Real tracking data available from 
        <a href="https://www.space-track.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
          Space-Track.org
        </a>
      </div>
    </div>
  );
}