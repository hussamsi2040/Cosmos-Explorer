"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  Search, 
  Filter, 
  Info, 
  Eye, 
  Zap, 
  Thermometer, 
  Timer, 
  Target,
  Globe,
  Telescope,
  Orbit,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Sun
} from "lucide-react";

interface Exoplanet {
  id: string;
  name: string;
  hostStar: string;
  distanceFromEarth: number; // light years
  planetRadius: number; // Earth radii
  planetMass: number; // Earth masses
  orbitalPeriod: number; // days
  discoveryMethod: string;
  discoveryYear: number;
  temperature: number; // Kelvin
  habitableZone: boolean;
  atmosphereType: string;
  surfaceType: string;
  visualPosition: { x: number; y: number };
  starType: string;
  planetType: string;
}

const discoveryMethods = [
  "Transit",
  "Radial Velocity", 
  "Direct Imaging",
  "Gravitational Microlensing",
  "Astrometry"
];

const planetTypes = [
  "Super Earth",
  "Neptune-like", 
  "Jupiter-like",
  "Earth-like",
  "Rocky"
];

// Modern gradient colors for different planet types
const planetColors = {
  "Super Earth": "from-green-400 to-emerald-600",
  "Neptune-like": "from-blue-400 to-cyan-600",
  "Jupiter-like": "from-orange-400 to-red-600",
  "Earth-like": "from-blue-500 to-green-500",
  "Rocky": "from-gray-400 to-slate-600"
};

const methodColors = {
  "Transit": "from-purple-500 to-indigo-600",
  "Radial Velocity": "from-blue-500 to-cyan-600",
  "Direct Imaging": "from-yellow-400 to-orange-500",
  "Gravitational Microlensing": "from-pink-500 to-rose-600",
  "Astrometry": "from-green-500 to-teal-600"
};

// Enhanced mock data
const generateExoplanets = (): Exoplanet[] => [
  {
    id: "kepler_452b",
    name: "Kepler-452b",
    hostStar: "Kepler-452",
    distanceFromEarth: 1400,
    planetRadius: 1.6,
    planetMass: 5.0,
    orbitalPeriod: 385,
    discoveryMethod: "Transit",
    discoveryYear: 2015,
    temperature: 265,
    habitableZone: true,
    atmosphereType: "Unknown",
    surfaceType: "Possibly Rocky",
    visualPosition: { x: 25, y: 35 },
    starType: "G-type (Sun-like)",
    planetType: "Super Earth"
  },
  {
    id: "trappist_1e",
    name: "TRAPPIST-1e",
    hostStar: "TRAPPIST-1",
    distanceFromEarth: 40,
    planetRadius: 0.92,
    planetMass: 0.77,
    orbitalPeriod: 6.1,
    discoveryMethod: "Transit",
    discoveryYear: 2017,
    temperature: 251,
    habitableZone: true,
    atmosphereType: "Thin",
    surfaceType: "Rocky",
    visualPosition: { x: 60, y: 20 },
    starType: "M-dwarf",
    planetType: "Earth-like"
  },
  {
    id: "proxima_b",
    name: "Proxima Centauri b",
    hostStar: "Proxima Centauri",
    distanceFromEarth: 4.2,
    planetRadius: 1.1,
    planetMass: 1.3,
    orbitalPeriod: 11.2,
    discoveryMethod: "Radial Velocity",
    discoveryYear: 2016,
    temperature: 234,
    habitableZone: true,
    atmosphereType: "Unknown",
    surfaceType: "Rocky",
    visualPosition: { x: 80, y: 60 },
    starType: "M-dwarf",
    planetType: "Earth-like"
  },
  {
    id: "hd_209458b",
    name: "HD 209458 b",
    hostStar: "HD 209458",
    distanceFromEarth: 159,
    planetRadius: 1.35,
    planetMass: 0.69,
    orbitalPeriod: 3.5,
    discoveryMethod: "Transit",
    discoveryYear: 1999,
    temperature: 1130,
    habitableZone: false,
    atmosphereType: "Hydrogen-Helium",
    surfaceType: "Gas Giant",
    visualPosition: { x: 15, y: 75 },
    starType: "G-type",
    planetType: "Jupiter-like"
  },
  {
    id: "toi_715b",
    name: "TOI-715 b",
    hostStar: "TOI-715",
    distanceFromEarth: 137,
    planetRadius: 1.55,
    planetMass: 3.02,
    orbitalPeriod: 19.3,
    discoveryMethod: "Transit",
    discoveryYear: 2024,
    temperature: 280,
    habitableZone: true,
    atmosphereType: "Unknown",
    surfaceType: "Super Earth",
    visualPosition: { x: 45, y: 80 },
    starType: "M-dwarf",
    planetType: "Super Earth"
  },
  {
    id: "wasp_12b",
    name: "WASP-12b",
    hostStar: "WASP-12",
    distanceFromEarth: 871,
    planetRadius: 1.9,
    planetMass: 1.4,
    orbitalPeriod: 1.1,
    discoveryMethod: "Transit",
    discoveryYear: 2008,
    temperature: 2516,
    habitableZone: false,
    atmosphereType: "Hydrogen-Helium",
    surfaceType: "Hot Jupiter",
    visualPosition: { x: 70, y: 45 },
    starType: "G-type",
    planetType: "Jupiter-like"
  }
];

const PlanetCard = ({ planet, onSelect }: { planet: Exoplanet; onSelect: (planet: Exoplanet) => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02, y: -2 }}
    onClick={() => onSelect(planet)}
    className="cursor-pointer group relative"
  >
    <div className={`bg-gradient-to-br ${planetColors[planet.planetType as keyof typeof planetColors]} p-0.5 rounded-2xl shadow-lg`}>
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${planetColors[planet.planetType as keyof typeof planetColors]} rounded-xl flex items-center justify-center shadow-lg`}>
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-tight">{planet.name}</h3>
              <p className="text-gray-400 text-sm">{planet.hostStar}</p>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            planet.habitableZone 
              ? "bg-green-500/20 text-green-400 border border-green-500/30" 
              : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
          }`}>
            {planet.habitableZone ? "Habitable Zone" : "Outside HZ"}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="text-gray-400">Distance:</span>
            <p className="text-white font-medium">{planet.distanceFromEarth} ly</p>
          </div>
          <div>
            <span className="text-gray-400">Discovery:</span>
            <p className="text-white font-medium">{planet.discoveryYear}</p>
          </div>
          <div>
            <span className="text-gray-400">Method:</span>
            <p className="text-white font-medium">{planet.discoveryMethod}</p>
          </div>
          <div>
            <span className="text-gray-400">Type:</span>
            <p className="text-white font-medium">{planet.planetType}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-gray-300">{planet.temperature}K</span>
          </div>
          
          <div className="flex items-center gap-1 text-blue-400 group-hover:text-blue-300 transition-colors">
            <span className="text-sm font-medium">Explore</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const PlanetModal = ({ planet, onClose }: { planet: Exoplanet; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div className={`bg-gradient-to-br ${planetColors[planet.planetType as keyof typeof planetColors]} p-1 rounded-3xl`}>
        <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${planetColors[planet.planetType as keyof typeof planetColors]} rounded-2xl flex items-center justify-center shadow-2xl`}>
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{planet.name}</h2>
                <p className="text-gray-300 text-lg">Orbiting {planet.hostStar}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-400 text-sm">{planet.starType}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <span className="sr-only">Close</span>
              <div className="w-6 h-6 text-gray-400">✕</div>
            </button>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Physical Properties</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Radius:</span>
                  <p className="text-white font-medium">{planet.planetRadius} Earth radii</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Mass:</span>
                  <p className="text-white font-medium">{planet.planetMass} Earth masses</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Temperature:</span>
                  <p className="text-white font-medium">{planet.temperature}K ({(planet.temperature - 273).toFixed(0)}°C)</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Orbit className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Orbital Characteristics</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Orbital Period:</span>
                  <p className="text-white font-medium">{planet.orbitalPeriod} days</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Distance from Earth:</span>
                  <p className="text-white font-medium">{planet.distanceFromEarth} light years</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Discovery Year:</span>
                  <p className="text-white font-medium">{planet.discoveryYear}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Telescope className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-bold text-white">Discovery & Environment</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Discovery Method:</span>
                  <p className="text-white font-medium">{planet.discoveryMethod}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Planet Type:</span>
                  <p className="text-white font-medium">{planet.planetType}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Surface Type:</span>
                  <p className="text-white font-medium">{planet.surfaceType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  Habitability Assessment
                </h3>
                <div className={`p-4 rounded-xl border ${
                  planet.habitableZone 
                    ? "bg-green-500/10 border-green-500/30" 
                    : "bg-red-500/10 border-red-500/30"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      planet.habitableZone ? "bg-green-400" : "bg-red-400"
                    }`} />
                    <span className={`font-medium ${
                      planet.habitableZone ? "text-green-400" : "text-red-400"
                    }`}>
                      {planet.habitableZone ? "In Habitable Zone" : "Outside Habitable Zone"}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {planet.habitableZone 
                      ? "This planet orbits within the habitable zone where liquid water could potentially exist on its surface, making it a candidate for supporting life as we know it."
                      : "This planet orbits outside the habitable zone, making it unlikely to support liquid water or Earth-like life on its surface."
                    }
                  </p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-400" />
                  Atmosphere & Composition
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm">Atmosphere Type:</span>
                    <p className="text-white font-medium">{planet.atmosphereType}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Surface Composition:</span>
                    <p className="text-white font-medium">{planet.surfaceType}</p>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Understanding a planet's atmospheric composition is crucial for determining its potential habitability and climate conditions.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Telescope className="w-5 h-5 text-purple-400" />
                  Discovery Method Explained
                </h3>
                <div className={`p-4 rounded-xl bg-gradient-to-r ${methodColors[planet.discoveryMethod as keyof typeof methodColors]}/10 border border-white/20`}>
                  <h4 className="font-medium text-white mb-2">{planet.discoveryMethod}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {planet.discoveryMethod === "Transit" && "Detected by observing the slight dimming of the host star's light as the planet passes in front of it."}
                    {planet.discoveryMethod === "Radial Velocity" && "Discovered by measuring the wobble of the host star caused by the gravitational pull of the orbiting planet."}
                    {planet.discoveryMethod === "Direct Imaging" && "Directly photographed by blocking out the light from the host star to reveal the planet."}
                    {planet.discoveryMethod === "Gravitational Microlensing" && "Detected when the planet's gravity bends and magnifies light from a background star."}
                    {planet.discoveryMethod === "Astrometry" && "Found by precisely measuring the position of the host star as it moves due to planetary gravitational influence."}
                  </p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Host Star Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm">Star Type:</span>
                    <p className="text-white font-medium">{planet.starType}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Distance from Earth:</span>
                    <p className="text-white font-medium">{planet.distanceFromEarth} light years</p>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    The characteristics of the host star greatly influence the planet's temperature, radiation environment, and potential for habitability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Learn More Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Want to Learn More?</h3>
                <p className="text-gray-300 text-sm">Explore detailed scientific data and discoveries about this exoplanet</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 font-medium transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  NASA Exoplanet Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default function ExoplanetExplorer() {
  const [planets] = useState<Exoplanet[]>(generateExoplanets());
  const [filteredPlanets, setFilteredPlanets] = useState<Exoplanet[]>(planets);
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState("All");
  const [filterHabitable, setFilterHabitable] = useState("All");
  const [showVisualMode, setShowVisualMode] = useState(false);

  useEffect(() => {
    let filtered = planets;

    if (searchQuery) {
      filtered = filtered.filter(planet =>
        planet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        planet.hostStar.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterMethod !== "All") {
      filtered = filtered.filter(planet => planet.discoveryMethod === filterMethod);
    }

    if (filterHabitable !== "All") {
      const isHabitable = filterHabitable === "Habitable";
      filtered = filtered.filter(planet => planet.habitableZone === isHabitable);
    }

    setFilteredPlanets(filtered);
  }, [searchQuery, filterMethod, filterHabitable, planets]);

  return (
    <div className="space-y-8">
      {/* Modern Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
        <div className="relative bg-gradient-to-br from-slate-900/90 via-purple-900/30 to-blue-900/40 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <Star className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Exoplanet Explorer</h1>
                <p className="text-purple-200 text-lg">Discover worlds beyond our solar system</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-purple-300">
                  <Telescope className="w-4 h-4" />
                  <span>{planets.length} confirmed exoplanets in database</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowVisualMode(!showVisualMode)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all shadow-lg ${
                  showVisualMode
                    ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white"
                    : "bg-white/10 backdrop-blur-xl text-purple-300 hover:bg-white/20 border border-white/20"
                }`}
              >
                <Eye className="w-5 h-5" />
                {showVisualMode ? 'Grid View' : 'Visual Mode'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Search & Filters */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search exoplanets or host stars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all"
            >
              <option value="All" className="bg-slate-900">All Methods</option>
              {discoveryMethods.map(method => (
                <option key={method} value={method} className="bg-slate-900">{method}</option>
              ))}
            </select>
            
            <select
              value={filterHabitable}
              onChange={(e) => setFilterHabitable(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all"
            >
              <option value="All" className="bg-slate-900">All Zones</option>
              <option value="Habitable" className="bg-slate-900">Habitable Zone</option>
              <option value="Non-Habitable" className="bg-slate-900">Outside HZ</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Filter className="w-4 h-4" />
            <span>Showing {filteredPlanets.length} of {planets.length} exoplanets</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Updated with latest discoveries</span>
          </div>
        </div>
      </div>

      {/* Content Display */}
      <AnimatePresence mode="wait">
        {showVisualMode ? (
          // Visual Star Field Mode
          <motion.div
            key="visual"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-blue-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 min-h-[600px] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
            
            {/* Star field background */}
            <div className="absolute inset-0">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    opacity: Math.random() * 0.8 + 0.2
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Exoplanet Star Field Visualization</h2>
              
              {filteredPlanets.map((planet) => (
                <motion.button
                  key={planet.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelectedPlanet(planet)}
                  className="absolute group"
                  style={{
                    left: `${planet.visualPosition.x}%`,
                    top: `${planet.visualPosition.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className={`w-4 h-4 bg-gradient-to-br ${planetColors[planet.planetType as keyof typeof planetColors]} rounded-full shadow-lg group-hover:shadow-xl transition-all`}>
                    <div className="absolute inset-0 rounded-full animate-ping bg-current opacity-30" />
                  </div>
                  
                  {/* Planet label */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2 whitespace-nowrap">
                      <p className="text-white font-medium text-sm">{planet.name}</p>
                      <p className="text-gray-400 text-xs">{planet.distanceFromEarth} ly away</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          // Grid Mode
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredPlanets.map((planet) => (
                <PlanetCard
                  key={planet.id}
                  planet={planet}
                  onSelect={setSelectedPlanet}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Planet Detail Modal */}
      <AnimatePresence>
        {selectedPlanet && (
          <PlanetModal
            planet={selectedPlanet}
            onClose={() => setSelectedPlanet(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}