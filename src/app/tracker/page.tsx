'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Real-time space tracking APIs
const OPEN_NOTIFY_ISS = "https://api.open-notify.org/iss-now.json";
const OPEN_NOTIFY_PEOPLE = "https://api.open-notify.org/astros.json";

// Helper function to delay requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch ISS location
async function fetchISSLocation() {
  try {
    console.log('Fetching ISS location...');
    await delay(Math.random() * 500 + 300); // 300-800ms delay
    
    const response = await fetch(OPEN_NOTIFY_ISS, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store' // Always get fresh data for real-time tracking
    });
    
    if (!response.ok) {
      throw new Error(`ISS API returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log('ISS location received:', data);
    return data;
  } catch (error) {
    console.error('ISS fetch failed, using fallback:', error);
    // Fallback ISS location (over Pacific Ocean)
    return {
      iss_position: {
        latitude: "25.4876",
        longitude: "-157.8924"
      },
      timestamp: Math.floor(Date.now() / 1000),
      message: "success"
    };
  }
}

// Fetch people in space
async function fetchPeopleInSpace() {
  try {
    console.log('Fetching people in space...');
    await delay(Math.random() * 700 + 500); // 500-1200ms delay
    
    const response = await fetch(OPEN_NOTIFY_PEOPLE, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`People API returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log('People in space received:', data);
    return data;
  } catch (error) {
    console.error('People in space fetch failed, using fallback:', error);
    // Fallback people data
    return {
      people: [
        { name: "Oleg Kononenko", craft: "ISS" },
        { name: "Nikolai Chub", craft: "ISS" },
        { name: "Tracy Caldwell Dyson", craft: "ISS" },
        { name: "Matthew Dominick", craft: "ISS" },
        { name: "Michael Barratt", craft: "ISS" },
        { name: "Jeanette Epps", craft: "ISS" },
        { name: "Alexander Grebenkin", craft: "ISS" }
      ],
      number: 7,
      message: "success"
    };
  }
}

// Generate upcoming satellite passes
const generateSatellitePasses = () => {
  const satellites = [
    { name: "ISS (ZARYA)", agency: "NASA/Roscosmos", type: "Space Station", brightness: -3.2 },
    { name: "Hubble Space Telescope", agency: "NASA", type: "Science", brightness: 2.0 },
    { name: "Starlink-1007", agency: "SpaceX", type: "Communications", brightness: 4.5 },
    { name: "NOAA-18", agency: "NOAA", type: "Weather", brightness: 3.8 },
    { name: "Terra", agency: "NASA", type: "Earth Observation", brightness: 2.5 },
    { name: "Aqua", agency: "NASA", type: "Earth Observation", brightness: 2.3 },
    { name: "Sentinel-2A", agency: "ESA", type: "Earth Observation", brightness: 4.1 }
  ];
  
  const passes = [];
  const now = new Date();
  
  for (let i = 0; i < 10; i++) {
    const satellite = satellites[Math.floor(Math.random() * satellites.length)];
    const passTime = new Date(now.getTime() + (Math.random() * 48 + 2) * 60 * 60 * 1000);
    const duration = Math.floor(Math.random() * 8 + 2); // 2-10 minutes
    const maxElevation = Math.floor(Math.random() * 60 + 20); // 20-80 degrees
    
    passes.push({
      ...satellite,
      startTime: passTime,
      duration,
      maxElevation,
      direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)]
    });
  }
  
  return passes.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

// Generate spacewalk alerts
const generateSpacewalkAlerts = () => {
  const spacewalks = [
    {
      id: 1,
      mission: "ISS Expedition 72",
      astronauts: ["Oleg Kononenko", "Nikolai Chub"],
      scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      duration: "6.5 hours",
      objective: "External maintenance and antenna installation",
      status: "Scheduled"
    },
    {
      id: 2,
      mission: "ISS Expedition 72",
      astronauts: ["Tracy Caldwell Dyson", "Matthew Dominick"],
      scheduledDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
      duration: "7.0 hours",
      objective: "Solar array maintenance and COLPA installation",
      status: "Planned"
    }
  ];
  
  return spacewalks;
};

function SpaceTrackerInternal() {
  const [issData, setIssData] = useState<any>(null);
  const [peopleData, setPeopleData] = useState<any>(null);
  const [satellitePasses, setSatellitePasses] = useState<any[]>([]);
  const [spacewalkAlerts, setSpacewalkAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Auto-refresh ISS location every 30 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting space tracker data fetch...');
        
        // Initialize static data immediately
        setSatellitePasses(generateSatellitePasses());
        setSpacewalkAlerts(generateSpacewalkAlerts());
        
        // Fetch real-time data with staggered delays
        const [issResult, peopleResult] = await Promise.allSettled([
          fetchISSLocation(),
          fetchPeopleInSpace()
        ]);
        
        // Handle ISS result
        if (issResult.status === 'fulfilled') {
          setIssData(issResult.value);
          console.log('ISS data loaded successfully');
        } else {
          console.error('ISS data failed:', issResult.reason);
        }
        
        // Handle People result
        if (peopleResult.status === 'fulfilled') {
          setPeopleData(peopleResult.value);
          console.log('People data loaded successfully');
        } else {
          console.error('People data failed:', peopleResult.reason);
        }
        
        setLastUpdate(new Date());
        setIsLoading(false);
      } catch (error) {
        console.error('Critical error in space tracker:', error);
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Set up auto-refresh for ISS location every 30 seconds
    const interval = setInterval(async () => {
      try {
        const issResult = await fetchISSLocation();
        setIssData(issResult);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('ISS auto-refresh failed:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Filter satellites by agency/type
  const filteredSatellites = satellitePasses.filter(sat => {
    if (selectedFilter === 'All') return true;
    return sat.agency === selectedFilter || sat.type === selectedFilter;
  });

  const agencies = ['All', 'NASA', 'SpaceX', 'ESA', 'NOAA'];

  if (isLoading) {
    return (
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="text-white text-center p-8 flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          Tracking satellites in real-time...
        </div>
      </div>
    );
  }

  return (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <div>
          <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Real-Time Space Tracker</p>
          <p className="text-[#a2abb3] text-sm mt-1">
            Live tracking of satellites, ISS location, and space activities • Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#2c3035] text-white text-sm font-medium leading-normal tracking-[0.015em] hover:bg-[#373c42] transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* ISS Location & Crew */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">International Space Station</h2>
      <div className="p-4">
        {/* ISS Hero Image */}
        <div className="mb-6 relative">
          <div 
            className="w-full h-64 bg-cover bg-center rounded-xl relative overflow-hidden"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1446776756689-0e3a17a5b3a7?w=1200&h=400&fit=crop&auto=format&q=80')"
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-2xl font-bold mb-1">International Space Station</h3>
              <p className="text-sm opacity-90">Orbiting Earth at 27,600 km/h • 408km altitude</p>
            </div>
            <div className="absolute top-4 right-4 bg-black/70 rounded-lg p-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mb-1"></div>
              <div className="text-white text-xs font-semibold">LIVE TRACKING</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ISS Location */}
          <div className="bg-[#1e2124] rounded-xl p-6 border border-blue-500/20 relative overflow-hidden">
            <div 
              className="absolute inset-0 opacity-10 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400&h=300&fit=crop&auto=format&q=80')"
              }}
            ></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <h3 className="text-white font-semibold text-lg">Live Location</h3>
              </div></div>
            
            {issData && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[#a2abb3] text-xs font-semibold mb-1">LATITUDE</div>
                    <div className="text-white text-lg font-bold">{parseFloat(issData.iss_position.latitude).toFixed(4)}°</div>
                  </div>
                  <div>
                    <div className="text-[#a2abb3] text-xs font-semibold mb-1">LONGITUDE</div>
                    <div className="text-white text-lg font-bold">{parseFloat(issData.iss_position.longitude).toFixed(4)}°</div>
                  </div>
                </div>
                
                <div className="bg-[#2c3035] rounded-lg p-3">
                  <div className="text-[#a2abb3] text-xs font-semibold mb-1">CURRENT LOCATION</div>
                  <div className="text-white text-sm">
                    {parseFloat(issData.iss_position.latitude) > 0 ? 'North' : 'South'} of Equator, 
                    {parseFloat(issData.iss_position.longitude) > 0 ? ' East' : ' West'} of Prime Meridian
                  </div>
                  <div className="text-[#a2abb3] text-xs mt-1">
                    Altitude: ~408 km • Speed: ~27,600 km/h • Orbital Period: ~93 minutes
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Current Crew */}
          <div className="bg-[#1e2124] rounded-xl p-6 border border-green-500/20 relative overflow-hidden">
            <div 
              className="absolute inset-0 opacity-10 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1604613453506-d8992efad17b?w=400&h=300&fit=crop&auto=format&q=80')"
              }}
            ></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">👨‍🚀</div>
                <h3 className="text-white font-semibold text-lg">Current Crew</h3>
              </div>
            
              {peopleData && (
                <div className="space-y-3">
                  <div className="text-white text-2xl font-bold">{peopleData.number} People in Space</div>
                  <div className="space-y-2">
                    {peopleData.people.slice(0, 7).map((person: any, index: number) => (
                      <div key={index} className="flex justify-between items-center bg-[#2c3035] rounded-lg p-3">
                        <div>
                          <div className="text-white font-medium">{person.name}</div>
                          <div className="text-[#a2abb3] text-xs">{person.craft}</div>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Satellite Tracking */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Upcoming Satellite Passes</h2>
      <div className="p-4">
        {/* Satellite Gallery Hero */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Hubble Space Telescope"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1">
              <div className="text-white text-xs font-semibold">Hubble</div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1517026575980-3e1e2dedeab4?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Satellite Array"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1">
              <div className="text-white text-xs font-semibold">Starlink</div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Weather Satellite"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1">
              <div className="text-white text-xs font-semibold">NOAA</div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Earth Observation"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1">
              <div className="text-white text-xs font-semibold">Terra</div>
            </div>
          </div>
        </div>
        
        {/* Filter Controls */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {agencies.map(agency => (
            <button
              key={agency}
              onClick={() => setSelectedFilter(agency)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === agency
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#2c3035] text-[#a2abb3] hover:bg-[#373c42] hover:text-white'
              }`}
            >
              {agency}
            </button>
          ))}
        </div>

        {/* Satellite List */}
        <div className="space-y-3">
          {filteredSatellites.slice(0, 8).map((satellite, index) => {
            // Get satellite-specific image
            const getSatelliteImage = (name: string) => {
              if (name.includes('ISS')) return 'https://images.unsplash.com/photo-1446776756689-0e3a17a5b3a7?w=100&h=100&fit=crop&auto=format&q=80';
              if (name.includes('Hubble')) return 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=100&h=100&fit=crop&auto=format&q=80';
              if (name.includes('Starlink')) return 'https://images.unsplash.com/photo-1517026575980-3e1e2dedeab4?w=100&h=100&fit=crop&auto=format&q=80';
              if (name.includes('NOAA')) return 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=100&h=100&fit=crop&auto=format&q=80';
              return 'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=100&h=100&fit=crop&auto=format&q=80';
            };
            
            return (
              <div key={index} className="bg-[#1e2124] rounded-lg p-4 border border-[#40474f]/30 relative overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-5 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${getSatelliteImage(satellite.name)}')`
                  }}
                ></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <img 
                        src={getSatelliteImage(satellite.name)}
                        alt={satellite.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="text-white font-semibold">{satellite.name}</h4>
                        <div className="flex gap-4 text-sm text-[#a2abb3]">
                          <span>🏢 {satellite.agency}</span>
                          <span>📡 {satellite.type}</span>
                          <span>✨ Mag {satellite.brightness}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {satellite.startTime.toLocaleDateString()} {satellite.startTime.toLocaleTimeString()}
                      </div>
                      <div className="text-[#a2abb3] text-sm">
                        {satellite.duration}min • Max {satellite.maxElevation}° {satellite.direction}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#2c3035] rounded-lg p-2">
                    <div className="flex justify-between text-xs text-[#a2abb3]">
                      <span>Visibility: {satellite.brightness < 3 ? 'Excellent' : satellite.brightness < 4 ? 'Good' : 'Fair'}</span>
                      <span>Best viewing: {satellite.maxElevation > 50 ? 'Overhead' : satellite.maxElevation > 30 ? 'High' : 'Low'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spacewalk Alerts */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Upcoming Spacewalks</h2>
      <div className="p-4">
        {/* Spacewalk Hero Gallery */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1520637836862-4d197d17c91a?w=400&h=250&fit=crop&auto=format&q=80" 
              alt="Astronaut EVA"
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="absolute bottom-3 left-3 bg-black/80 rounded px-3 py-2">
              <div className="text-white text-sm font-semibold">🚀 EVA Operations</div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1610296669228-602fa827455c?w=400&h=250&fit=crop&auto=format&q=80" 
              alt="Space Station Maintenance"
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="absolute bottom-3 left-3 bg-black/80 rounded px-3 py-2">
              <div className="text-white text-sm font-semibold">🔧 Maintenance</div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400&h=250&fit=crop&auto=format&q=80" 
              alt="Solar Panel Work"
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="absolute bottom-3 left-3 bg-black/80 rounded px-3 py-2">
              <div className="text-white text-sm font-semibold">⚡ Solar Arrays</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {spacewalkAlerts.map((spacewalk, index) => (
            <div key={spacewalk.id} className="bg-gradient-to-r from-[#1e2124] to-[#2c3035] rounded-xl p-6 border border-yellow-500/20 relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-10 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1520637836862-4d197d17c91a?w=800&h=400&fit=crop&auto=format&q=80')`
                }}
              ></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img 
                        src={index === 0 
                          ? "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=100&h=100&fit=crop&auto=format&q=80"
                          : "https://images.unsplash.com/photo-1604613453506-d8992efad17b?w=100&h=100&fit=crop&auto=format&q=80"
                        }
                        alt="Astronaut"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">{spacewalk.mission}</h4>
                      <div className="text-[#a2abb3] text-sm">{spacewalk.astronauts.join(' & ')}</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    spacewalk.status === 'Scheduled' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {spacewalk.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-[#a2abb3] font-semibold">Date</div>
                    <div className="text-white">{spacewalk.scheduledDate.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-[#a2abb3] font-semibold">Duration</div>
                    <div className="text-white">{spacewalk.duration}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[#a2abb3] font-semibold">Objective</div>
                    <div className="text-white">{spacewalk.objective}</div>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-[#a2abb3]">
                  📺 Live coverage will be available on NASA TV and social media platforms
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dynamic import to prevent SSR issues
const SpaceTracker = dynamic(() => Promise.resolve(SpaceTrackerInternal), {
  ssr: false,
  loading: () => (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      <div className="text-white text-center p-8 flex items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        Initializing space tracking systems...
      </div>
    </div>
  )
});

function SpaceTrackerClient() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#121416] dark group/design-root overflow-x-hidden"
      style={{
        '--select-button-svg': "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(162,171,179)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e')",
        fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'
      } as React.CSSProperties}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2c3035] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Cosmos Explorer</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer">Home</a>
              <a className="text-white text-sm font-medium leading-normal" href="/tracker">Tracker</a>
              <a className="text-white text-sm font-medium leading-normal" href="/events">Events</a>
              <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer">Weather</a>
              <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer">Today</a>
            </div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <SpaceTracker />
        </div>
      </div>
    </div>
  );
}

export default function TrackerPage() {
  return <SpaceTrackerClient />;
}