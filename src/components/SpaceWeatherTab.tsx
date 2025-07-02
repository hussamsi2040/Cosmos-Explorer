"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Activity, 
  Zap, 
  Shield, 
  Satellite, 
  Globe,
  AlertTriangle,
  TrendingUp,
  Eye,
  Radio,
  Wind,
  Thermometer,
  Gauge,
  RefreshCw,
  Bell,
  MapPin,
  Clock,
  BarChart3,
  Waves
} from "lucide-react";
import toast from "react-hot-toast";

interface SolarFlare {
  id: string;
  class: "A" | "B" | "C" | "M" | "X";
  magnitude: number;
  begin_time: string;
  peak_time: string;
  end_time?: string;
  source_location: string;
  active_region: string;
  impacts: {
    radio_blackout: "none" | "minor" | "moderate" | "strong" | "extreme";
    radiation_storm: "none" | "minor" | "moderate" | "strong" | "extreme";
    geomagnetic_storm: "none" | "minor" | "moderate" | "strong" | "extreme";
  };
  description: string;
}

interface GeomagneticData {
  kp_index: number;
  kp_forecast: number[];
  storm_level: "quiet" | "unsettled" | "minor" | "moderate" | "strong" | "severe" | "extreme";
  dst_index: number;
  solar_wind_speed: number;
  solar_wind_density: number;
  interplanetary_magnetic_field: number;
  last_updated: string;
}

interface AuroraForecast {
  hemisphere: "northern" | "southern";
  oval_boundary: number; // latitude
  activity_level: "quiet" | "minor" | "moderate" | "strong" | "severe";
  visibility_locations: string[];
  peak_time: string;
  duration_hours: number;
  kp_threshold: number;
}

interface SpaceWeatherAlert {
  id: string;
  type: "solar_flare" | "geomagnetic_storm" | "radiation_storm" | "radio_blackout";
  severity: "minor" | "moderate" | "strong" | "severe" | "extreme";
  issued_time: string;
  valid_until: string;
  description: string;
  impacts: string[];
  affected_regions: string[];
}

interface SolarWindData {
  speed: number;
  density: number;
  temperature: number;
  dynamic_pressure: number;
  magnetic_field_strength: number;
  magnetic_field_direction: number;
  proton_flux: number;
  timestamp: string;
}

// NOAA SWPC integration (simulated - in production use real API)
const fetchNOAASpaceWeather = async (): Promise<{
  geomagneticData: GeomagneticData;
  alerts: SpaceWeatherAlert[];
  solarWind: SolarWindData;
}> => {
  try {
    // In production, use real NOAA SWPC APIs:
    // - https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json
    // - https://services.swpc.noaa.gov/products/solar-wind/
    // - https://services.swpc.noaa.gov/products/alerts.json
    
    return {
      geomagneticData: {
        kp_index: Math.random() * 9,
        kp_forecast: Array.from({ length: 24 }, () => Math.random() * 9),
        storm_level: ["quiet", "unsettled", "minor", "moderate", "strong"][Math.floor(Math.random() * 5)] as any,
        dst_index: Math.random() * -100,
        solar_wind_speed: 300 + Math.random() * 400,
        solar_wind_density: 1 + Math.random() * 20,
        interplanetary_magnetic_field: Math.random() * 20,
        last_updated: new Date().toISOString()
      },
      alerts: [
        {
          id: "alert_001",
          type: "geomagnetic_storm",
          severity: "moderate",
          issued_time: new Date().toISOString(),
          valid_until: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          description: "Geomagnetic storm activity is expected due to enhanced solar wind conditions",
          impacts: ["Possible aurora visible at lower latitudes", "Minor GPS navigation errors", "Weak radio signal interference"],
          affected_regions: ["Northern United States", "Canada", "Northern Europe", "Scandinavia"]
        }
      ],
      solarWind: {
        speed: 350 + Math.random() * 300,
        density: 3 + Math.random() * 15,
        temperature: 50000 + Math.random() * 200000,
        dynamic_pressure: 1 + Math.random() * 10,
        magnetic_field_strength: 3 + Math.random() * 15,
        magnetic_field_direction: Math.random() * 360,
        proton_flux: Math.random() * 1000,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error fetching NOAA data:', error);
    throw error;
  }
};

// NASA DONKI integration (simulated)
const fetchNASADONKI = async (): Promise<{
  solarFlares: SolarFlare[];
  coronalMassEjections: any[];
}> => {
  try {
    // In production, use NASA DONKI API:
    // https://api.nasa.gov/DONKI/FLR?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=YOUR_KEY
    
    return {
      solarFlares: [
        {
          id: "flr_001",
          class: "M",
          magnitude: 2.3,
          begin_time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          peak_time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          source_location: "S15W45",
          active_region: "AR3559",
          impacts: {
            radio_blackout: "moderate",
            radiation_storm: "minor",
            geomagnetic_storm: "none"
          },
          description: "Moderate M2.3 solar flare from active region AR3559"
        },
        {
          id: "flr_002",
          class: "C",
          magnitude: 7.8,
          begin_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          peak_time: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
          source_location: "N20E30",
          active_region: "AR3560",
          impacts: {
            radio_blackout: "minor",
            radiation_storm: "none",
            geomagnetic_storm: "none"
          },
          description: "Minor C7.8 solar flare with minimal Earth impact"
        }
      ],
      coronalMassEjections: []
    };
  } catch (error) {
    console.error('Error fetching NASA DONKI data:', error);
    throw error;
  }
};

// Aurora forecast generation
const generateAuroraForecast = (kpIndex: number): AuroraForecast[] => {
  const forecasts: AuroraForecast[] = [];
  
  if (kpIndex >= 3) {
    forecasts.push({
      hemisphere: "northern",
      oval_boundary: Math.max(50, 70 - (kpIndex * 3)),
      activity_level: kpIndex >= 7 ? "severe" : kpIndex >= 5 ? "strong" : "moderate",
      visibility_locations: kpIndex >= 5 
        ? ["Alaska", "Northern Canada", "Greenland", "Northern Scandinavia", "Northern Russia", "Northern United States"]
        : ["Alaska", "Northern Canada", "Greenland", "Northern Scandinavia"],
      peak_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      duration_hours: Math.floor(3 + kpIndex),
      kp_threshold: kpIndex
    });
  }
  
  return forecasts;
};

export default function SpaceWeatherTab() {
  const [geomagneticData, setGeomagneticData] = useState<GeomagneticData | null>(null);
  const [solarFlares, setSolarFlares] = useState<SolarFlare[]>([]);
  const [alerts, setAlerts] = useState<SpaceWeatherAlert[]>([]);
  const [solarWind, setSolarWind] = useState<SolarWindData | null>(null);
  const [auroraForecast, setAuroraForecast] = useState<AuroraForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"24h" | "3d" | "7d">("24h");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch all space weather data
  const fetchAllData = async () => {
    try {
      const [noaaData, nasaData] = await Promise.all([
        fetchNOAASpaceWeather(),
        fetchNASADONKI()
      ]);
      
      setGeomagneticData(noaaData.geomagneticData);
      setAlerts(noaaData.alerts);
      setSolarWind(noaaData.solarWind);
      setSolarFlares(nasaData.solarFlares);
      
      // Generate aurora forecast
      const auroraData = generateAuroraForecast(noaaData.geomagneticData.kp_index);
      setAuroraForecast(auroraData);
      
      // Send alerts for significant events
      if (alertsEnabled) {
        noaaData.alerts.forEach(alert => {
          if (alert.severity === "severe" || alert.severity === "extreme") {
            toast.error(`🚨 ${alert.type.replace('_', ' ').toUpperCase()}: ${alert.description}`, {
              duration: 8000,
            });
          } else if (alert.severity === "strong") {
            toast.error(`⚠️ ${alert.type.replace('_', ' ').toUpperCase()}: ${alert.description}`, {
              duration: 6000,
            });
          }
        });
        
        nasaData.solarFlares.forEach(flare => {
          if (flare.class === "X" || (flare.class === "M" && flare.magnitude >= 5)) {
            toast.error(`☀️ ${flare.class}${flare.magnitude} Solar Flare detected from ${flare.active_region}`, {
              duration: 6000,
            });
          }
        });
      }
      
    } catch (error) {
      console.error('Error fetching space weather data:', error);
      toast.error('Failed to fetch space weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Auto refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchAllData, 300000); // 5 minutes
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, alertsEnabled]);

  const getKpColor = (kp: number) => {
    if (kp < 3) return "text-green-400";
    if (kp < 5) return "text-yellow-400";
    if (kp < 7) return "text-orange-400";
    return "text-red-400";
  };

  const getStormColor = (level: string) => {
    switch (level) {
      case "quiet": return "text-green-400 bg-green-900/30";
      case "unsettled": return "text-yellow-400 bg-yellow-900/30";
      case "minor": return "text-orange-400 bg-orange-900/30";
      case "moderate": return "text-orange-400 bg-orange-900/30";
      case "strong": return "text-red-400 bg-red-900/30";
      case "severe": return "text-red-400 bg-red-900/30";
      case "extreme": return "text-red-400 bg-red-900/30";
      default: return "text-gray-400 bg-gray-900/30";
    }
  };

  const getFlareColor = (flareClass: string) => {
    switch (flareClass) {
      case "X": return "text-red-400 bg-red-900/30";
      case "M": return "text-orange-400 bg-orange-900/30";
      case "C": return "text-yellow-400 bg-yellow-900/30";
      case "B": return "text-blue-400 bg-blue-900/30";
      case "A": return "text-green-400 bg-green-900/30";
      default: return "text-gray-400 bg-gray-900/30";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin"></div>
            <Sun className="absolute inset-0 w-8 h-8 m-auto text-orange-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Loading Space Weather</h3>
            <p className="text-gray-400">Fetching real-time solar and geomagnetic data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-yellow-500/20 rounded-3xl blur-xl" />
        <div className="relative bg-gradient-to-br from-slate-900/90 via-orange-900/30 to-red-900/40 backdrop-blur-2xl border border-orange-500/30 rounded-3xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <Sun className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Space Weather Dashboard</h1>
                <p className="text-orange-200 text-lg">Real-time solar activity and geomagnetic conditions</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-orange-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    <span>NOAA SWPC Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span>NASA DONKI</span>
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
                Auto Update
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAlertsEnabled(!alertsEnabled)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  alertsEnabled
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                }`}
              >
                <Bell className="w-4 h-4" />
                Alerts {alertsEnabled ? 'On' : 'Off'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Alerts */}
      {alerts.length > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-red-900/50 via-orange-900/20 to-yellow-900/30 backdrop-blur-xl border border-red-500/30 rounded-3xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              Active Space Weather Alerts
            </h2>
            
            <div className="grid gap-4">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-2xl border ${
                    alert.severity === 'extreme' ? 'bg-red-500/20 border-red-500/50' :
                    alert.severity === 'severe' ? 'bg-red-500/15 border-red-500/40' :
                    alert.severity === 'strong' ? 'bg-orange-500/15 border-orange-500/40' :
                    alert.severity === 'moderate' ? 'bg-yellow-500/15 border-yellow-500/40' :
                    'bg-blue-500/15 border-blue-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-bold text-lg capitalize">
                        {alert.type.replace('_', ' ')} Warning
                      </h3>
                      <p className="text-gray-300">{alert.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                      alert.severity === 'extreme' ? 'bg-red-500/30 text-red-300' :
                      alert.severity === 'severe' ? 'bg-red-500/25 text-red-300' :
                      alert.severity === 'strong' ? 'bg-orange-500/25 text-orange-300' :
                      alert.severity === 'moderate' ? 'bg-yellow-500/25 text-yellow-300' :
                      'bg-blue-500/25 text-blue-300'
                    }`}>
                      {alert.severity}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Potential Impacts:</span>
                      <ul className="text-gray-300 mt-1 space-y-1">
                        {alert.impacts.map((impact, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-orange-400">•</span>
                            {impact}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-gray-400">Affected Regions:</span>
                      <div className="text-gray-300 mt-1">
                        {alert.affected_regions.join(', ')}
                      </div>
                      <div className="text-gray-400 text-xs mt-2">
                        Valid until: {new Date(alert.valid_until).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Key Metrics */}
      {geomagneticData && solarWind && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Gauge className="w-6 h-6 text-blue-400" />
                <span className="text-gray-400">Kp Index</span>
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className={`text-3xl font-bold mb-2 ${getKpColor(geomagneticData.kp_index)}`}>
              {geomagneticData.kp_index.toFixed(1)}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStormColor(geomagneticData.storm_level)}`}>
              {geomagneticData.storm_level.toUpperCase()}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Wind className="w-6 h-6 text-cyan-400" />
                <span className="text-gray-400">Solar Wind</span>
              </div>
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {Math.round(solarWind.speed)}
            </div>
            <div className="text-sm text-gray-400">km/s</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Waves className="w-6 h-6 text-purple-400" />
                <span className="text-gray-400">IMF Strength</span>
              </div>
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {solarWind.magnetic_field_strength.toFixed(1)}
            </div>
            <div className="text-sm text-gray-400">nT</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Radio className="w-6 h-6 text-green-400" />
                <span className="text-gray-400">Proton Flux</span>
              </div>
              <Zap className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {Math.round(solarWind.proton_flux)}
            </div>
            <div className="text-sm text-gray-400">p/cm²/s</div>
          </motion.div>
        </div>
      )}

      {/* Solar Flares from NASA DONKI */}
      <div className="bg-gradient-to-br from-slate-900/50 via-orange-900/20 to-red-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Sun className="w-6 h-6 text-orange-400" />
          Recent Solar Flares (NASA DONKI)
        </h2>
        
        <div className="grid gap-4">
          {solarFlares.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Sun className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No significant solar flares detected recently</p>
            </div>
          ) : (
            solarFlares.map((flare) => (
              <motion.div
                key={flare.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl border ${getFlareColor(flare.class)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-xl">
                      {flare.class}{flare.magnitude} Solar Flare
                    </h3>
                    <p className="text-gray-300">{flare.description}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${getFlareColor(flare.class)}`}>
                    Class {flare.class}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-gray-400 text-sm">Source Location:</span>
                    <div className="text-white font-medium">{flare.source_location}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Active Region:</span>
                    <div className="text-white font-medium">{flare.active_region}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Peak Time:</span>
                    <div className="text-white font-medium">
                      {new Date(flare.peak_time).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm">Radio Blackout:</span>
                    <div className={`font-medium capitalize ${
                      flare.impacts.radio_blackout === 'extreme' ? 'text-red-400' :
                      flare.impacts.radio_blackout === 'strong' ? 'text-orange-400' :
                      flare.impacts.radio_blackout === 'moderate' ? 'text-yellow-400' :
                      flare.impacts.radio_blackout === 'minor' ? 'text-blue-400' : 'text-green-400'
                    }`}>
                      {flare.impacts.radio_blackout}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Radiation Storm:</span>
                    <div className={`font-medium capitalize ${
                      flare.impacts.radiation_storm === 'extreme' ? 'text-red-400' :
                      flare.impacts.radiation_storm === 'strong' ? 'text-orange-400' :
                      flare.impacts.radiation_storm === 'moderate' ? 'text-yellow-400' :
                      flare.impacts.radiation_storm === 'minor' ? 'text-blue-400' : 'text-green-400'
                    }`}>
                      {flare.impacts.radiation_storm}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Geomagnetic Impact:</span>
                    <div className={`font-medium capitalize ${
                      flare.impacts.geomagnetic_storm === 'extreme' ? 'text-red-400' :
                      flare.impacts.geomagnetic_storm === 'strong' ? 'text-orange-400' :
                      flare.impacts.geomagnetic_storm === 'moderate' ? 'text-yellow-400' :
                      flare.impacts.geomagnetic_storm === 'minor' ? 'text-blue-400' : 'text-green-400'
                    }`}>
                      {flare.impacts.geomagnetic_storm}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Aurora Forecast */}
      {auroraForecast.length > 0 && (
        <div className="bg-gradient-to-br from-slate-900/50 via-green-900/20 to-blue-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Eye className="w-6 h-6 text-green-400" />
            Aurora Forecast & Visibility
          </h2>
          
          <div className="grid gap-6">
            {auroraForecast.map((forecast, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-xl capitalize">
                      {forecast.hemisphere} Hemisphere Aurora
                    </h3>
                    <p className="text-gray-300">
                      High probability of aurora activity visible down to {forecast.oval_boundary}° latitude
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    forecast.activity_level === 'severe' ? 'bg-red-500/20 text-red-400' :
                    forecast.activity_level === 'strong' ? 'bg-orange-500/20 text-orange-400' :
                    forecast.activity_level === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {forecast.activity_level.toUpperCase()}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-gray-400 text-sm">Peak Viewing Time:</span>
                    <div className="text-white font-medium mb-3">
                      {new Date(forecast.peak_time).toLocaleString()}
                    </div>
                    
                    <span className="text-gray-400 text-sm">Duration:</span>
                    <div className="text-white font-medium mb-3">
                      {forecast.duration_hours} hours
                    </div>
                    
                    <span className="text-gray-400 text-sm">Kp Threshold:</span>
                    <div className={`font-medium ${getKpColor(forecast.kp_threshold)}`}>
                      {forecast.kp_threshold.toFixed(1)}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-400 text-sm">Likely Visible Locations:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {forecast.visibility_locations.map((location, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm"
                        >
                          {location}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Solar Wind Details */}
      {solarWind && (
        <div className="bg-gradient-to-br from-slate-900/50 via-cyan-900/20 to-blue-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Wind className="w-6 h-6 text-cyan-400" />
            Solar Wind Conditions (NOAA SWPC)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wind className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-400">Speed</span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {Math.round(solarWind.speed)} km/s
              </div>
              <div className="text-sm text-gray-400">
                Normal: 300-500 km/s
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Gauge className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">Density</span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {solarWind.density.toFixed(1)} p/cm³
              </div>
              <div className="text-sm text-gray-400">
                Normal: 1-10 p/cm³
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Thermometer className="w-5 h-5 text-red-400" />
                <span className="text-gray-400">Temperature</span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {Math.round(solarWind.temperature / 1000)}K
              </div>
              <div className="text-sm text-gray-400">
                Normal: 50-200K
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400">Dynamic Pressure</span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {solarWind.dynamic_pressure.toFixed(1)} nPa
              </div>
              <div className="text-sm text-gray-400">
                Normal: 1-5 nPa
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Waves className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">IMF Magnitude</span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {solarWind.magnetic_field_strength.toFixed(1)} nT
              </div>
              <div className="text-sm text-gray-400">
                Normal: 3-10 nT
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Last Updated</span>
              </div>
              <div className="text-lg font-bold text-white mb-2">
                {new Date(solarWind.timestamp).toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-400">
                {new Date(solarWind.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Info */}
      <div className="bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-blue-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Shield className="w-6 h-6 text-purple-400" />
          Understanding Space Weather
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Impact Categories</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-white/5 rounded-lg">
                <h4 className="text-white font-medium">Kp Index Scale</h4>
                <p className="text-gray-300 mt-1">
                  0-3: Quiet • 4: Minor storm • 5-6: Moderate • 7-8: Strong • 9: Severe
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <h4 className="text-white font-medium">Solar Flare Classes</h4>
                <p className="text-gray-300 mt-1">
                  A, B: Minimal • C: Minor radio disruption • M: Moderate • X: Major impacts
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Potential Effects</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-white/5 rounded-lg">
                <h4 className="text-white font-medium">Technology Impacts</h4>
                <p className="text-gray-300 mt-1">
                  GPS errors, radio blackouts, satellite damage, power grid fluctuations
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <h4 className="text-white font-medium">Aurora Visibility</h4>
                <p className="text-gray-300 mt-1">
                  Higher Kp values mean aurora visible at lower latitudes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 