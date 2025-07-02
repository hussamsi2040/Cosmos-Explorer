"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Zap, 
  Activity, 
  AlertTriangle, 
  Wind, 
  Eye, 
  RefreshCw, 
  TrendingUp,
  Shield,
  Gauge,
  Waves,
  Satellite,
  Radio,
  Lightbulb,
  ChevronRight,
  Star
} from "lucide-react";

interface SolarFlare {
  id: string;
  intensity: "C" | "M" | "X";
  magnitude: number;
  timestamp: Date;
  duration: number;
  region: string;
  impact: "Low" | "Moderate" | "High";
}

interface SpaceWeatherData {
  kpIndex: number;
  solarWindSpeed: number;
  solarWindDensity: number;
  magneticField: number;
  flareRisk: "Low" | "Moderate" | "High" | "Extreme";
  auroraForecast: {
    visibility: "None" | "Weak" | "Moderate" | "Strong" | "Extreme";
    latitudeLimit: number;
  };
  radioBlackout: "None" | "Minor" | "Moderate" | "Strong" | "Extreme";
  satelliteRisk: "Green" | "Yellow" | "Orange" | "Red";
}

// Modern color schemes and gradients
const intensityColors = {
  C: "from-green-400 to-emerald-500",
  M: "from-yellow-400 to-orange-500", 
  X: "from-red-500 to-pink-600"
};

const riskColors = {
  Low: "from-green-400 to-emerald-500",
  Moderate: "from-yellow-400 to-orange-500",
  High: "from-orange-500 to-red-500",
  Extreme: "from-red-500 to-pink-600"
};

const visibilityColors = {
  None: "from-gray-400 to-gray-500",
  Weak: "from-green-400 to-emerald-500",
  Moderate: "from-yellow-400 to-orange-500",
  Strong: "from-orange-500 to-red-500",
  Extreme: "from-red-500 to-pink-600"
};

const generateMockData = (): SpaceWeatherData => ({
  kpIndex: 3.2,
  solarWindSpeed: 420,
  solarWindDensity: 8.5,
  magneticField: 6.2,
  flareRisk: "Moderate",
  auroraForecast: {
    visibility: "Moderate",
    latitudeLimit: 55
  },
  radioBlackout: "Minor",
  satelliteRisk: "Yellow"
});

const generateMockFlares = (): SolarFlare[] => [
  {
    id: "flare_001",
    intensity: "M",
    magnitude: 2.4,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    duration: 15,
    region: "AR3182",
    impact: "Moderate"
  },
  {
    id: "flare_002",
    intensity: "C",
    magnitude: 8.7,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    duration: 8,
    region: "AR3180",
    impact: "Low"
  },
  {
    id: "flare_003",
    intensity: "X",
    magnitude: 1.2,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    duration: 32,
    region: "AR3181",
    impact: "High"
  }
];

const ModernMetricCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  gradient, 
  description,
  trend 
}: {
  title: string;
  value: string | number;
  unit: string;
  icon: any;
  gradient: string;
  description: string;
  trend?: "up" | "down" | "stable";
}) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    className="relative group"
  >
    <div className={`bg-gradient-to-br ${gradient} p-0.5 rounded-2xl shadow-lg`}>
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
              trend === 'up' ? 'bg-green-500/20 text-green-400' :
              trend === 'down' ? 'bg-red-500/20 text-red-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              <TrendingUp className={`w-3 h-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
              {trend}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{value}</span>
            <span className="text-gray-400 text-sm">{unit}</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const FlareCard = ({ flare }: { flare: SolarFlare }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className="relative group"
  >
    <div className={`bg-gradient-to-br ${intensityColors[flare.intensity]} p-0.5 rounded-xl`}>
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 bg-gradient-to-br ${intensityColors[flare.intensity]} rounded-lg flex items-center justify-center shadow-lg`}>
              <Sun className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">
                {flare.intensity}{flare.magnitude.toFixed(1)}
              </h3>
              <p className="text-gray-400 text-sm">{flare.region}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            flare.impact === "High" ? "bg-red-500/20 text-red-400" :
            flare.impact === "Moderate" ? "bg-orange-500/20 text-orange-400" :
            "bg-green-500/20 text-green-400"
          }`}>
            {flare.impact} Impact
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Time:</span>
            <p className="text-white font-medium">{flare.timestamp.toLocaleTimeString()}</p>
          </div>
          <div>
            <span className="text-gray-400">Duration:</span>
            <p className="text-white font-medium">{flare.duration} min</p>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const RiskIndicator = ({ level, label, description }: { 
  level: "Green" | "Yellow" | "Orange" | "Red";
  label: string;
  description: string;
}) => {
  const colors = {
    Green: "from-green-400 to-emerald-500",
    Yellow: "from-yellow-400 to-orange-500",
    Orange: "from-orange-500 to-red-500",
    Red: "from-red-500 to-pink-600"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative group cursor-pointer"
    >
      <div className={`bg-gradient-to-r ${colors[level]} p-0.5 rounded-xl`}>
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 bg-gradient-to-br ${colors[level]} rounded-full shadow-lg`} />
            <div className="flex-1">
              <h4 className="text-white font-medium">{label}</h4>
              <p className="text-gray-400 text-sm">{description}</p>
            </div>
            <Shield className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function SpaceWeatherTab() {
  const [weatherData, setWeatherData] = useState<SpaceWeatherData>(generateMockData());
  const [recentFlares, setRecentFlares] = useState<SolarFlare[]>(generateMockFlares());
  const [activeTab, setActiveTab] = useState("overview");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherData(generateMockData());
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setWeatherData(generateMockData());
      setRecentFlares(generateMockFlares());
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1500);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "flares", label: "Solar Flares", icon: Sun },
    { id: "aurora", label: "Aurora Forecast", icon: Star },
    { id: "education", label: "Learn More", icon: Lightbulb }
  ];

  return (
    <div className="space-y-8">
      {/* Modern Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-3xl blur-xl" />
        <div className="relative bg-gradient-to-br from-slate-900/90 via-orange-900/30 to-red-900/40 backdrop-blur-2xl border border-orange-500/30 rounded-3xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <Sun className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Space Weather Monitor</h1>
                <p className="text-orange-200 text-lg">Real-time solar activity and space environment conditions</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-orange-300">
                  <Activity className="w-4 h-4" />
                  <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-2xl font-medium transition-all shadow-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Updating...' : 'Refresh Data'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;
          
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all relative ${
                isActive
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="whitespace-nowrap">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Current Conditions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ModernMetricCard
                  title="Kp Index"
                  value={weatherData.kpIndex}
                  unit=""
                  icon={Gauge}
                  gradient="from-purple-500 to-indigo-600"
                  description="Geomagnetic activity level (0-9 scale)"
                  trend="stable"
                />
                
                <ModernMetricCard
                  title="Solar Wind Speed"
                  value={weatherData.solarWindSpeed}
                  unit="km/s"
                  icon={Wind}
                  gradient="from-blue-500 to-cyan-600"
                  description="Current solar wind velocity"
                  trend="up"
                />
                
                <ModernMetricCard
                  title="Particle Density"
                  value={weatherData.solarWindDensity}
                  unit="p/cm³"
                  icon={Waves}
                  gradient="from-green-500 to-teal-600"
                  description="Solar wind particle density"
                  trend="down"
                />
                
                <ModernMetricCard
                  title="Magnetic Field"
                  value={weatherData.magneticField}
                  unit="nT"
                  icon={Activity}
                  gradient="from-orange-500 to-red-600"
                  description="Interplanetary magnetic field strength"
                  trend="stable"
                />
              </div>

              {/* Risk Assessment */}
              <div className="bg-gradient-to-br from-slate-900/50 via-red-900/20 to-orange-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-orange-400" />
                  Current Risk Assessment
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <RiskIndicator
                    level={weatherData.satelliteRisk}
                    label="Satellite Operations"
                    description="Risk to satellite systems and operations"
                  />
                  
                  <RiskIndicator
                    level={weatherData.radioBlackout === "None" ? "Green" : 
                           weatherData.radioBlackout === "Minor" ? "Yellow" :
                           weatherData.radioBlackout === "Moderate" ? "Orange" : "Red"}
                    label="Radio Communications"
                    description="HF radio blackout conditions"
                  />
                  
                  <RiskIndicator
                    level={weatherData.flareRisk === "Low" ? "Green" :
                           weatherData.flareRisk === "Moderate" ? "Yellow" :
                           weatherData.flareRisk === "High" ? "Orange" : "Red"}
                    label="Solar Flare Activity"
                    description="Probability of significant solar flares"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "flares" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900/50 via-orange-900/20 to-red-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Sun className="w-6 h-6 text-orange-400" />
                  Recent Solar Flares
                </h2>
                
                <div className="grid gap-4">
                  {recentFlares.map((flare) => (
                    <FlareCard key={flare.id} flare={flare} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "aurora" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900/50 via-green-900/20 to-blue-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Star className="w-6 h-6 text-green-400" />
                  Aurora Forecast
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className={`bg-gradient-to-r ${visibilityColors[weatherData.auroraForecast.visibility]} p-0.5 rounded-2xl`}>
                      <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Visibility Level</h3>
                        <div className="text-3xl font-bold text-white mb-2">
                          {weatherData.auroraForecast.visibility}
                        </div>
                        <p className="text-gray-300">
                          Current aurora visibility conditions
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Visibility Latitude</h3>
                      <div className="text-3xl font-bold text-white mb-2">
                        {weatherData.auroraForecast.latitudeLimit}°N
                      </div>
                      <p className="text-gray-300">
                        Southernmost latitude for aurora visibility
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Viewing Tips</h3>
                    <div className="space-y-3">
                      {[
                        "Best viewing is typically between 10 PM and 2 AM",
                        "Look north towards the magnetic pole",
                        "Find dark skies away from city lights",
                        "Clear weather conditions are essential",
                        "Aurora apps can provide real-time alerts"
                      ].map((tip, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                        >
                          <ChevronRight className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{tip}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900/50 via-blue-900/20 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-blue-400" />
                  Understanding Space Weather
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Sun className="w-5 h-5 text-orange-400" />
                        Solar Flares
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        Solar flares are sudden releases of electromagnetic energy from the Sun's surface. They're classified by intensity: C-class (small), M-class (medium), and X-class (large). These events can disrupt radio communications and damage satellites.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        Geomagnetic Storms
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        Geomagnetic storms occur when solar wind interacts with Earth's magnetic field. The Kp index measures these disturbances on a scale of 0-9, with higher values indicating stronger storms that can cause aurora and affect technology.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-green-400" />
                        Aurora Formation
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        Auroras form when charged particles from the solar wind collide with Earth's atmosphere. These collisions excite oxygen and nitrogen atoms, causing them to emit light in beautiful green, red, and blue colors typically seen near the polar regions.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Satellite className="w-5 h-5 text-blue-400" />
                        Technology Impacts
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        Space weather can affect GPS accuracy, disrupt radio communications, damage satellite electronics, and even cause power grid failures. Monitoring these conditions helps protect our technology-dependent society.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 