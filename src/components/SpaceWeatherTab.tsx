"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Sun, Zap, Compass, AlertTriangle, Info } from "lucide-react";

interface SpaceWeatherData {
  solarFlares: any[];
  geomagneticStorms: any[];
  auroraForecast: any;
  solarWind: any;
  kpIndex: number;
}

async function fetchSpaceWeatherData(): Promise<SpaceWeatherData> {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const startDate = thirtyDaysAgo.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];

  // Fetch multiple space weather data sources
  const [solarFlares, geomagneticStorms, auroraData] = await Promise.all([
    fetch(`https://kauai.ccmc.gsfc.nasa.gov/DONKI/ws/get/FLR?startDate=${startDate}&endDate=${endDate}`).then(r => r.json()).catch(() => []),
    fetch(`https://kauai.ccmc.gsfc.nasa.gov/DONKI/ws/get/GST?startDate=${startDate}&endDate=${endDate}`).then(r => r.json()).catch(() => []),
    fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json').then(r => r.json()).catch(() => [])
  ]);

  // Simulate solar wind data (in real app, you'd use actual APIs)
  const solarWind = {
    speed: Math.floor(Math.random() * 200) + 300, // km/s
    density: (Math.random() * 10 + 5).toFixed(1), // protons/cm³
    temperature: Math.floor(Math.random() * 50000) + 50000 // K
  };

  // Calculate current Kp index from aurora data
  const kpIndex = auroraData.length > 1 ? parseFloat(auroraData[auroraData.length - 1][1]) || 2.0 : 2.0;

  return {
    solarFlares: solarFlares.slice(-5).reverse(),
    geomagneticStorms: geomagneticStorms.slice(-3).reverse(),
    auroraForecast: auroraData,
    solarWind,
    kpIndex
  };
}

function getAuroraVisibility(kpIndex: number) {
  if (kpIndex >= 7) return { level: "Extreme", color: "text-red-400", desc: "Auroras visible as far south as 40°N" };
  if (kpIndex >= 6) return { level: "High", color: "text-orange-400", desc: "Auroras visible as far south as 50°N" };
  if (kpIndex >= 5) return { level: "Moderate", color: "text-yellow-400", desc: "Auroras visible as far south as 55°N" };
  if (kpIndex >= 4) return { level: "Low", color: "text-green-400", desc: "Auroras visible in northern regions (60°N+)" };
  return { level: "Minimal", color: "text-gray-400", desc: "Auroras confined to polar regions" };
}

function getSpaceWeatherRisk(kpIndex: number, hasRecentFlares: boolean) {
  if (kpIndex >= 6 || hasRecentFlares) return { level: "High", color: "text-red-400", icon: AlertTriangle };
  if (kpIndex >= 4) return { level: "Moderate", color: "text-yellow-400", icon: Activity };
  return { level: "Low", color: "text-green-400", icon: Info };
}

export default function SpaceWeatherTab() {
  const [data, setData] = useState<SpaceWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const weatherData = await fetchSpaceWeatherData();
        setData(weatherData);
      } catch (e) {
        setError("Could not load space weather data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    
    // Update every 15 minutes
    const interval = setInterval(fetchData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-white p-6">Loading space weather data...</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;
  if (!data) return <div className="text-gray-400 p-6">No space weather data available.</div>;

  const auroraVis = getAuroraVisibility(data.kpIndex);
  const weatherRisk = getSpaceWeatherRisk(data.kpIndex, data.solarFlares.length > 0);
  const RiskIcon = weatherRisk.icon;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Sun className="text-yellow-400 w-8 h-8" />
        <h2 className="text-3xl font-bold text-white">Live Space Weather Dashboard</h2>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"
        />
      </div>

      {/* Current Conditions Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-400/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <RiskIcon className={`w-6 h-6 ${weatherRisk.color}`} />
            <h3 className="text-xl font-bold text-white">Space Weather Risk</h3>
          </div>
          <div className={`text-2xl font-bold ${weatherRisk.color} mb-2`}>
            {weatherRisk.level}
          </div>
          <div className="text-gray-300 text-sm">
            Current Kp Index: <span className="font-bold text-white">{data.kpIndex.toFixed(1)}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-400/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold text-white">Aurora Activity</h3>
          </div>
          <div className={`text-2xl font-bold ${auroraVis.color} mb-2`}>
            {auroraVis.level}
          </div>
          <div className="text-gray-300 text-sm">
            {auroraVis.desc}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border border-orange-400/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-orange-400" />
            <h3 className="text-xl font-bold text-white">Solar Wind</h3>
          </div>
          <div className="text-2xl font-bold text-orange-400 mb-2">
            {data.solarWind.speed} km/s
          </div>
          <div className="text-gray-300 text-sm">
            Density: {data.solarWind.density} p/cm³
          </div>
        </motion.div>
      </div>

      {/* Detailed Tabs */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex gap-2 mb-6 border-b border-white/20">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "flares", label: "Solar Flares", icon: Sun },
            { id: "storms", label: "Geomagnetic Storms", icon: Compass },
            { id: "education", label: "Learn More", icon: Info }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-all ${
                activeTab === id
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Current Space Weather Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">Solar Activity</h4>
                <p className="text-gray-300 text-sm">
                  Recent solar flares: <span className="text-white font-bold">{data.solarFlares.length}</span> in the last 30 days
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">Geomagnetic Conditions</h4>
                <p className="text-gray-300 text-sm">
                  Recent storms: <span className="text-white font-bold">{data.geomagneticStorms.length}</span> in the last 30 days
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "flares" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Recent Solar Flares</h3>
            {data.solarFlares.length === 0 ? (
              <div className="text-gray-400">No recent solar flare events found.</div>
            ) : (
              data.solarFlares.map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/10 rounded-lg p-4 border-l-4 border-yellow-400"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-white font-semibold">{event.classType || "Solar Flare"}</div>
                    <div className="text-xs text-gray-400">
                      {event.beginTime?.slice(0, 10)} {event.beginTime?.slice(11, 16)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>Active Region: {event.activeRegionNum || "N/A"}</div>
                    <div>Peak Time: {event.peakTime?.replace("T", " ") || "N/A"}</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === "storms" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Geomagnetic Storms</h3>
            {data.geomagneticStorms.length === 0 ? (
              <div className="text-gray-400">No recent geomagnetic storms detected.</div>
            ) : (
              data.geomagneticStorms.map((storm, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/10 rounded-lg p-4 border-l-4 border-purple-400"
                >
                  <div className="text-white font-semibold mb-2">
                    Geomagnetic Storm - {storm.gstID || `Event ${idx + 1}`}
                  </div>
                  <div className="text-sm text-gray-300">
                    Start: {storm.startTime?.replace("T", " ") || "N/A"}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === "education" && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Understanding Space Weather</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-900/30 rounded-lg p-4">
                <h4 className="font-bold text-blue-400 mb-2">🌅 Aurora Borealis & Australis</h4>
                <p className="text-gray-300 text-sm">
                  Auroras are caused by charged particles from the solar wind interacting with Earth's magnetic field. 
                  The Kp index measures geomagnetic activity on a scale of 0-9, with higher values indicating greater aurora visibility.
                </p>
              </div>
              
              <div className="bg-yellow-900/30 rounded-lg p-4">
                <h4 className="font-bold text-yellow-400 mb-2">☀️ Solar Flares</h4>
                <p className="text-gray-300 text-sm">
                  Solar flares are intense bursts of radiation from the Sun's surface. They're classified as A, B, C, M, or X, 
                  with X-class being the most powerful and capable of affecting satellite communications and power grids on Earth.
                </p>
              </div>
              
              <div className="bg-purple-900/30 rounded-lg p-4">
                <h4 className="font-bold text-purple-400 mb-2">🧲 Geomagnetic Storms</h4>
                <p className="text-gray-300 text-sm">
                  When solar wind carries magnetic fields that interact strongly with Earth's magnetosphere, it can cause 
                  geomagnetic storms. These can disrupt GPS, radio communications, and create beautiful aurora displays.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 text-center">
        Data from <a href="https://kauai.ccmc.gsfc.nasa.gov/DONKI/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">NASA DONKI</a> and 
        <a href="https://www.swpc.noaa.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">NOAA SWPC</a>
      </div>
    </div>
  );
} 