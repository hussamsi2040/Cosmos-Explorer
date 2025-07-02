"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Globe, Thermometer, Ruler, Clock, Star, Info, Eye, Zap } from "lucide-react";

interface Exoplanet {
  id: string;
  name: string;
  discoveryMethod: "transit" | "radial_velocity" | "direct_imaging" | "gravitational_microlensing" | "other";
  discoveryYear: number;
  hostStar: string;
  orbitalPeriod: number; // days
  planetRadius: number; // Earth radii
  planetMass?: number; // Earth masses
  stellarDistance: number; // light years
  equilibriumTemp?: number; // Kelvin
  habitableZone: "too_hot" | "habitable" | "too_cold" | "unknown";
  composition: "rocky" | "gas_giant" | "ice_giant" | "super_earth" | "unknown";
  confirmed: boolean;
}

const DISCOVERY_METHODS = {
  transit: { 
    icon: Eye, 
    color: "text-blue-400", 
    bg: "bg-blue-900/30", 
    label: "Transit Method",
    description: "Planet passes in front of its star"
  },
  radial_velocity: { 
    icon: Zap, 
    color: "text-green-400", 
    bg: "bg-green-900/30", 
    label: "Radial Velocity",
    description: "Star wobbles due to planetary gravity"
  },
  direct_imaging: { 
    icon: Star, 
    color: "text-yellow-400", 
    bg: "bg-yellow-900/30", 
    label: "Direct Imaging",
    description: "Planet photographed directly"
  },
  gravitational_microlensing: { 
    icon: Globe, 
    color: "text-purple-400", 
    bg: "bg-purple-900/30", 
    label: "Microlensing",
    description: "Gravitational lensing effect"
  },
  other: { 
    icon: Search, 
    color: "text-gray-400", 
    bg: "bg-gray-900/30", 
    label: "Other Methods",
    description: "Various other detection techniques"
  }
};

const HABITABILITY = {
  too_hot: { color: "text-red-400", bg: "bg-red-900/30", label: "Too Hot", emoji: "🔥" },
  habitable: { color: "text-green-400", bg: "bg-green-900/30", label: "Potentially Habitable", emoji: "🌍" },
  too_cold: { color: "text-blue-400", bg: "bg-blue-900/30", label: "Too Cold", emoji: "❄️" },
  unknown: { color: "text-gray-400", bg: "bg-gray-900/30", label: "Unknown", emoji: "❓" }
};

const COMPOSITION = {
  rocky: { color: "text-orange-400", label: "Rocky Planet", emoji: "🪨" },
  gas_giant: { color: "text-purple-400", label: "Gas Giant", emoji: "🪐" },
  ice_giant: { color: "text-cyan-400", label: "Ice Giant", emoji: "🧊" },
  super_earth: { color: "text-green-400", label: "Super-Earth", emoji: "🌍" },
  unknown: { color: "text-gray-400", label: "Unknown", emoji: "❓" }
};

// Sample exoplanet data (in real app, would come from NASA Exoplanet Archive)
const generateExoplanetData = (): Exoplanet[] => {
  const planets: Exoplanet[] = [
    {
      id: "kepler-452b",
      name: "Kepler-452b",
      discoveryMethod: "transit",
      discoveryYear: 2015,
      hostStar: "Kepler-452",
      orbitalPeriod: 384.8,
      planetRadius: 1.6,
      stellarDistance: 1402,
      equilibriumTemp: 265,
      habitableZone: "habitable",
      composition: "super_earth",
      confirmed: true
    },
    {
      id: "proxima-b",
      name: "Proxima Centauri b",
      discoveryMethod: "radial_velocity",
      discoveryYear: 2016,
      hostStar: "Proxima Centauri",
      orbitalPeriod: 11.2,
      planetRadius: 1.1,
      planetMass: 1.27,
      stellarDistance: 4.24,
      equilibriumTemp: 234,
      habitableZone: "habitable",
      composition: "rocky",
      confirmed: true
    },
    {
      id: "trappist-1e",
      name: "TRAPPIST-1e",
      discoveryMethod: "transit",
      discoveryYear: 2017,
      hostStar: "TRAPPIST-1",
      orbitalPeriod: 6.1,
      planetRadius: 0.92,
      planetMass: 0.62,
      stellarDistance: 40.7,
      equilibriumTemp: 251,
      habitableZone: "habitable",
      composition: "rocky",
      confirmed: true
    },
    {
      id: "k2-18b",
      name: "K2-18b",
      discoveryMethod: "transit",
      discoveryYear: 2015,
      hostStar: "K2-18",
      orbitalPeriod: 33.0,
      planetRadius: 2.3,
      planetMass: 8.6,
      stellarDistance: 124,
      equilibriumTemp: 265,
      habitableZone: "habitable",
      composition: "super_earth",
      confirmed: true
    },
    {
      id: "hd-209458b",
      name: "HD 209458b",
      discoveryMethod: "transit",
      discoveryYear: 1999,
      hostStar: "HD 209458",
      orbitalPeriod: 3.5,
      planetRadius: 1.4,
      stellarDistance: 159,
      equilibriumTemp: 1400,
      habitableZone: "too_hot",
      composition: "gas_giant",
      confirmed: true
    },
    {
      id: "gliese-581g",
      name: "Gliese 581g",
      discoveryMethod: "radial_velocity",
      discoveryYear: 2010,
      hostStar: "Gliese 581",
      orbitalPeriod: 36.6,
      planetRadius: 1.5,
      planetMass: 3.1,
      stellarDistance: 20.4,
      habitableZone: "habitable",
      composition: "super_earth",
      confirmed: false
    },
    {
      id: "wolf-359c",
      name: "Wolf 359c",
      discoveryMethod: "radial_velocity",
      discoveryYear: 2019,
      hostStar: "Wolf 359",
      orbitalPeriod: 2800,
      planetRadius: 1.8,
      stellarDistance: 7.9,
      equilibriumTemp: 180,
      habitableZone: "too_cold",
      composition: "super_earth",
      confirmed: true
    },
    {
      id: "toi-715b",
      name: "TOI-715b",
      discoveryMethod: "transit",
      discoveryYear: 2024,
      hostStar: "TOI-715",
      orbitalPeriod: 19.3,
      planetRadius: 1.55,
      stellarDistance: 137,
      habitableZone: "habitable",
      composition: "super_earth",
      confirmed: true
    }
  ];

  return planets;
};

export default function ExoplanetExplorer() {
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null);
  const [filter, setFilter] = useState({
    method: "all",
    habitability: "all",
    composition: "all"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"distance" | "discovery" | "size">("distance");

  useEffect(() => {
    setExoplanets(generateExoplanetData());
  }, []);

  const filteredPlanets = useMemo(() => {
    return exoplanets
      .filter(planet => {
        const nameMatch = planet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         planet.hostStar.toLowerCase().includes(searchTerm.toLowerCase());
        const methodMatch = filter.method === "all" || planet.discoveryMethod === filter.method;
        const habitMatch = filter.habitability === "all" || planet.habitableZone === filter.habitability;
        const compMatch = filter.composition === "all" || planet.composition === filter.composition;
        
        return nameMatch && methodMatch && habitMatch && compMatch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "distance":
            return a.stellarDistance - b.stellarDistance;
          case "discovery":
            return b.discoveryYear - a.discoveryYear;
          case "size":
            return b.planetRadius - a.planetRadius;
          default:
            return 0;
        }
      });
  }, [exoplanets, filter, searchTerm, sortBy]);

  const stats = useMemo(() => {
    const habitable = exoplanets.filter(p => p.habitableZone === "habitable").length;
    const confirmed = exoplanets.filter(p => p.confirmed).length;
    const closest = exoplanets.reduce((min, planet) => 
      planet.stellarDistance < min.stellarDistance ? planet : min
    );
    
    return { habitable, confirmed, total: exoplanets.length, closest };
  }, [exoplanets]);

  const PlanetVisualization = ({ planet }: { planet: Exoplanet }) => {
    const size = Math.max(20, Math.min(100, planet.planetRadius * 30));
    const habitability = HABITABILITY[planet.habitableZone];
    const composition = COMPOSITION[planet.composition];

    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setSelectedPlanet(planet)}
        className="relative cursor-pointer group"
        style={{
          left: `${Math.random() * 70 + 10}%`,
          top: `${Math.random() * 70 + 10}%`,
          position: "absolute"
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: planet.orbitalPeriod / 10, repeat: Infinity, ease: "linear" }}
          className={`rounded-full ${habitability.bg} border-2 border-current ${habitability.color} flex items-center justify-center`}
          style={{ width: size, height: size }}
        >
          <span className="text-lg">{composition.emoji}</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {planet.name}
        </motion.div>
      </motion.div>
    );
  };

  const PlanetCard = ({ planet }: { planet: Exoplanet }) => {
    const method = DISCOVERY_METHODS[planet.discoveryMethod];
    const habitability = HABITABILITY[planet.habitableZone];
    const composition = COMPOSITION[planet.composition];
    const MethodIcon = method.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setSelectedPlanet(planet)}
        className={`${method.bg} border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-all`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <MethodIcon className={`w-6 h-6 ${method.color}`} />
            <div>
              <h3 className="text-white font-bold">{planet.name}</h3>
              <p className="text-sm text-gray-400">{planet.hostStar}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <span className="text-lg">{composition.emoji}</span>
            <span className="text-lg">{habitability.emoji}</span>
            {!planet.confirmed && <span className="text-lg">❓</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-gray-300">
          <div>
            <span className="text-gray-400">Distance:</span>
            <div className="text-white font-bold">{planet.stellarDistance.toFixed(1)} ly</div>
          </div>
          <div>
            <span className="text-gray-400">Radius:</span>
            <div className="text-white font-bold">{planet.planetRadius.toFixed(1)}× Earth</div>
          </div>
          <div>
            <span className="text-gray-400">Period:</span>
            <div className="text-white">{planet.orbitalPeriod.toFixed(1)} days</div>
          </div>
          <div>
            <span className="text-gray-400">Discovered:</span>
            <div className="text-white">{planet.discoveryYear}</div>
          </div>
        </div>

        <div className="mt-3 flex gap-2 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full ${habitability.bg} ${habitability.color}`}>
            {habitability.label}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full bg-white/10 ${composition.color}`}>
            {composition.label}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="text-blue-400 w-8 h-8" />
          <h2 className="text-3xl font-bold text-white">Exoplanet Explorer</h2>
        </div>
        <div className="text-sm text-gray-400">
          {filteredPlanets.length} of {exoplanets.length} planets
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-gray-400">Total Exoplanets</div>
        </div>
        <div className="bg-green-900/30 border border-green-400/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.habitable}</div>
          <div className="text-sm text-gray-400">Potentially Habitable</div>
        </div>
        <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.confirmed}</div>
          <div className="text-sm text-gray-400">Confirmed Planets</div>
        </div>
        <div className="bg-purple-900/30 border border-purple-400/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.closest.stellarDistance.toFixed(1)}</div>
          <div className="text-sm text-gray-400">Closest (ly)</div>
        </div>
      </div>

      {/* Interactive Visualization */}
      <div className="bg-gradient-to-b from-black via-purple-900/20 to-black rounded-2xl border border-white/10 h-96 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:50px_50px] opacity-30"></div>
        <div className="absolute top-4 left-4 text-white">
          <h3 className="text-lg font-bold mb-2">Solar Neighborhood</h3>
          <p className="text-sm text-gray-400">Click planets to explore • Size = radius • Color = habitability</p>
        </div>
        
        {filteredPlanets.slice(0, 15).map(planet => (
          <PlanetVisualization key={planet.id} planet={planet} />
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search planets or stars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="distance">Sort by Distance</option>
          <option value="discovery">Sort by Discovery Year</option>
          <option value="size">Sort by Size</option>
        </select>

        <div className="flex gap-2">
          <select
            value={filter.habitability}
            onChange={(e) => setFilter(prev => ({ ...prev, habitability: e.target.value }))}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Habitable Zones</option>
            <option value="habitable">Potentially Habitable</option>
            <option value="too_hot">Too Hot</option>
            <option value="too_cold">Too Cold</option>
          </select>
        </div>
      </div>

      {/* Planet List */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Discovered Exoplanets</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlanets.map(planet => (
            <PlanetCard key={planet.id} planet={planet} />
          ))}
        </div>
      </div>

      {/* Planet Detail Modal */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPlanet(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedPlanet.name}</h2>
                  <p className="text-gray-400">Orbiting {selectedPlanet.hostStar}</p>
                </div>
                <button
                  onClick={() => setSelectedPlanet(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Planet Properties</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Radius:</span>
                      <span className="text-white">{selectedPlanet.planetRadius.toFixed(2)} Earth radii</span>
                    </div>
                    {selectedPlanet.planetMass && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mass:</span>
                        <span className="text-white">{selectedPlanet.planetMass.toFixed(2)} Earth masses</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Orbital Period:</span>
                      <span className="text-white">{selectedPlanet.orbitalPeriod.toFixed(1)} days</span>
                    </div>
                    {selectedPlanet.equilibriumTemp && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Temperature:</span>
                        <span className="text-white">{selectedPlanet.equilibriumTemp}K ({(selectedPlanet.equilibriumTemp - 273).toFixed(0)}°C)</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Distance:</span>
                      <span className="text-white">{selectedPlanet.stellarDistance.toFixed(1)} light-years</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Discovery Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Discovery Year:</span>
                      <span className="text-white">{selectedPlanet.discoveryYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Method:</span>
                      <span className="text-white">{DISCOVERY_METHODS[selectedPlanet.discoveryMethod].label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={selectedPlanet.confirmed ? "text-green-400" : "text-yellow-400"}>
                        {selectedPlanet.confirmed ? "Confirmed" : "Candidate"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Composition:</span>
                      <span className={COMPOSITION[selectedPlanet.composition].color}>
                        {COMPOSITION[selectedPlanet.composition].label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Habitability:</span>
                      <span className={HABITABILITY[selectedPlanet.habitableZone].color}>
                        {HABITABILITY[selectedPlanet.habitableZone].label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Discovery Method: {DISCOVERY_METHODS[selectedPlanet.discoveryMethod].label}</h4>
                <p className="text-sm text-gray-300">
                  {DISCOVERY_METHODS[selectedPlanet.discoveryMethod].description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-xs text-gray-400 text-center">
        Data simplified for educational purposes. Real exoplanet data available from 
        <a href="https://exoplanetarchive.ipac.caltech.edu/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
          NASA Exoplanet Archive
        </a>
      </div>
    </div>
  );
}