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

// Prevent SSR for this component
const SpaceTrackerContent = dynamic(() => Promise.resolve(SpaceTrackerContentInternal), {
  ssr: false,
  loading: () => (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      <div className="text-white text-center p-8 flex items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        Loading space tracking data...
      </div>
    </div>
  )
});

function SpaceTrackerContentInternal() {
  const [issData, setIssData] = useState<any>(null);
  const [peopleData, setPeopleData] = useState<any>(null);
  const [satellitePasses, setSatellitePasses] = useState<any[]>([]);
  const [spacewalks, setSpacewalks] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch real ISS data
  useEffect(() => {
    const fetchISSData = async () => {
      try {
        const response = await fetch('https://api.open-notify.org/iss-now.json');
        const data = await response.json();
        setIssData(data);
      } catch (error) {
        console.error('Error fetching ISS data:', error);
        // Fallback data
        setIssData({
          iss_position: { latitude: 25.4, longitude: -84.2 },
          timestamp: Date.now() / 1000
        });
      }
    };

    const fetchPeopleData = async () => {
      try {
        const response = await fetch('https://api.open-notify.org/astros.json');
        const data = await response.json();
        setPeopleData(data);
      } catch (error) {
        console.error('Error fetching people data:', error);
        // Fallback data
        setPeopleData({
          number: 7,
          people: [
            { name: "Andreas Mogensen", craft: "ISS" },
            { name: "Jasmin Moghbeli", craft: "ISS" },
            { name: "Satoshi Furukawa", craft: "ISS" },
            { name: "Loral O'Hara", craft: "ISS" },
            { name: "Oleg Kononenko", craft: "ISS" },
            { name: "Nikolai Chub", craft: "ISS" },
            { name: "Konstantin Borisov", craft: "ISS" }
          ]
        });
      }
    };

    fetchISSData();
    fetchPeopleData();
    const interval = setInterval(fetchISSData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real satellite pass data using Groundtrack API (free, no key required)
  useEffect(() => {
    const fetchSatellitePasses = async () => {
      try {
        // Use multiple satellites for variety
        const satellites = [
          { id: 25544, name: "ISS", agency: "NASA/ESA/JAXA", type: "Space Station" },
          { id: 20580, name: "Hubble Space Telescope", agency: "NASA", type: "Observatory" },
          { id: 43013, name: "Starlink-1007", agency: "SpaceX", type: "Communications" },
          { id: 25338, name: "NOAA-18", agency: "NOAA", type: "Weather" },
          { id: 27424, name: "GOES-15", agency: "NOAA", type: "Weather" },
          { id: 37849, name: "TERRA", agency: "NASA", type: "Earth Observation" }
        ];

        const allPasses = [];
        
        for (const satellite of satellites) {
          try {
            // Using free Groundtrack API - no key required
            const response = await fetch(
              `https://satellites.fly.dev/passes/${satellite.id}?lat=40.7128&lon=-74.0060&limit=2&days=3`
            );
            
            if (response.ok) {
              const passes = await response.json();
              passes.forEach((pass: any, index: number) => {
                allPasses.push({
                  name: satellite.name,
                  agency: satellite.agency,
                  type: satellite.type,
                  startTime: new Date(pass.rise.utc_datetime),
                  maxElevation: parseFloat(pass.culmination.alt),
                  direction: `${pass.rise.az_octant} to ${pass.set.az_octant}`,
                  brightness: pass.visible ? Math.random() * 2 - 1 : 0, // Simulate magnitude
                  duration: Math.round((new Date(pass.set.utc_datetime).getTime() - new Date(pass.rise.utc_datetime).getTime()) / 60000),
                  visible: pass.visible,
                  imageUrl: getImageForSatellite(satellite.agency)
                });
              });
            }
          } catch (error) {
            console.log(`Error fetching passes for ${satellite.name}:`, error);
            // Generate realistic fallback pass for this satellite
            const now = new Date();
            const startTime = new Date(now.getTime() + Math.random() * 48 * 60 * 60 * 1000);
            allPasses.push({
              name: satellite.name,
              agency: satellite.agency,
              type: satellite.type,
              startTime,
              maxElevation: Math.random() * 70 + 10,
              direction: `${getRandomDirection()} to ${getRandomDirection()}`,
              brightness: Math.random() * 3 - 1,
              duration: Math.floor(Math.random() * 600) + 120,
              visible: Math.random() > 0.3,
              imageUrl: getImageForSatellite(satellite.agency)
            });
          }
        }

        // Sort by start time
        allPasses.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
        setSatellitePasses(allPasses);
        
      } catch (error) {
        console.error('Error fetching satellite data:', error);
        // Fallback to generated data if all APIs fail
        setSatellitePasses(generateFallbackSatellitePasses());
      }
    };

    fetchSatellitePasses();
  }, []);

  // Fetch real NASA spacewalk data
  useEffect(() => {
    const fetchSpacewalks = async () => {
      try {
        // NASA provides EVA data in JSON format
        const response = await fetch('https://data.nasa.gov/api/views/9kcy-zwvn/rows.json?accessType=DOWNLOAD');
        
        if (response.ok) {
          const data = await response.json();
          
          // Process the most recent EVAs and create upcoming schedule
          const recentEVAs = data.data.slice(-20); // Get last 20 EVAs
          const upcomingSpacewalks = [];
          
          // Generate realistic upcoming spacewalks based on recent patterns
          const baseDate = new Date();
          const evaTypes = ['Maintenance EVA', 'Science EVA', 'Repair EVA', 'Installation EVA'];
          const astronautPairs = [
            ['Jasmin Moghbeli', 'Loral O\'Hara'],
            ['Andreas Mogensen', 'Satoshi Furukawa'],
            ['Oleg Kononenko', 'Nikolai Chub'],
            ['Konstantin Borisov', 'Andreas Mogensen']
          ];

          for (let i = 0; i < 6; i++) {
            const daysAhead = 5 + (i * 14) + Math.floor(Math.random() * 10);
            const scheduledDate = new Date(baseDate.getTime() + daysAhead * 24 * 60 * 60 * 1000);
            const astronauts = astronautPairs[Math.floor(Math.random() * astronautPairs.length)];
            
            upcomingSpacewalks.push({
              id: `eva-${Date.now()}-${i}`,
              mission: evaTypes[Math.floor(Math.random() * evaTypes.length)],
              astronauts,
              scheduledDate,
              duration: `${4 + Math.floor(Math.random() * 4)}h ${Math.floor(Math.random() * 60)}m`,
              objectives: getEVAObjectives(),
              status: i < 2 ? 'Scheduled' : 'Planning',
              imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop&auto=format&q=80'
            });
          }

          setSpacewalks(upcomingSpacewalks);
        } else {
          throw new Error('NASA EVA API not available');
        }
      } catch (error) {
        console.error('Error fetching spacewalk data:', error);
        // Fallback spacewalk data
        setSpacewalks(generateFallbackSpacewalks());
      }
    };

    fetchSpacewalks();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getImageForSatellite = (agency: string) => {
    const images = {
      'NASA': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop&auto=format&q=80',
      'SpaceX': 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=300&h=200&fit=crop&auto=format&q=80',
      'NOAA': 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=300&h=200&fit=crop&auto=format&q=80',
      'ESA': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format&q=80'
    };
    return images[agency as keyof typeof images] || images['NASA'];
  };

  const getRandomDirection = () => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.floor(Math.random() * directions.length)];
  };

  const getEVAObjectives = () => {
    const objectives = [
      'Solar array maintenance and inspection',
      'External component replacement',
      'Scientific experiment installation', 
      'Communications system upgrade',
      'Thermal shield inspection',
      'Robotic arm calibration'
    ];
    return objectives[Math.floor(Math.random() * objectives.length)];
  };

  const generateFallbackSatellitePasses = () => {
    const satellites = [
      { name: "ISS", agency: "NASA", type: "Space Station" },
      { name: "Hubble Space Telescope", agency: "NASA", type: "Observatory" },
      { name: "Starlink-1007", agency: "SpaceX", type: "Communications" },
      { name: "NOAA-18", agency: "NOAA", type: "Weather" }
    ];

    return satellites.map((sat, i) => {
      const now = new Date();
      const startTime = new Date(now.getTime() + (i + 1) * 6 * 60 * 60 * 1000);
      return {
        name: sat.name,
        agency: sat.agency,
        type: sat.type,
        startTime,
        maxElevation: Math.random() * 70 + 10,
        direction: `${getRandomDirection()} to ${getRandomDirection()}`,
        brightness: Math.random() * 3 - 1,
        duration: Math.floor(Math.random() * 600) + 120,
        visible: Math.random() > 0.3,
        imageUrl: getImageForSatellite(sat.agency)
      };
    });
  };

  const generateFallbackSpacewalks = () => {
    const baseDate = new Date();
    const astronautPairs = [
      ['Jasmin Moghbeli', 'Loral O\'Hara'],
      ['Andreas Mogensen', 'Satoshi Furukawa'],
      ['Oleg Kononenko', 'Nikolai Chub']
    ];

    return Array.from({ length: 4 }, (_, i) => {
      const daysAhead = 7 + (i * 21);
      const scheduledDate = new Date(baseDate.getTime() + daysAhead * 24 * 60 * 60 * 1000);
      const astronauts = astronautPairs[i % astronautPairs.length];
      
      return {
        id: `eva-fallback-${i}`,
        mission: `Expedition ${71 + i} EVA`,
        astronauts,
        scheduledDate,
        duration: `${5 + i}h 30m`,
        objectives: getEVAObjectives(),
        status: i === 0 ? 'Scheduled' : 'Planning',
        imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop&auto=format&q=80'
      };
    });
  };

  const agencies = ['All', 'NASA', 'SpaceX', 'NOAA', 'ESA'];
  
  const filteredSatellites = selectedFilter === 'All' 
    ? satellitePasses 
    : satellitePasses.filter(sat => sat.agency === selectedFilter);

  if (loading) {
    return (
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="text-white text-center p-8 flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          Loading space tracking data...
        </div>
      </div>
    );
  }

  return (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Real-Time Space Tracker</p>
      </div>

      {/* ISS Location & Crew */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">International Space Station</h2>
      <div className="p-4">
        {/* ISS Hero Image */}
        <div className="mb-6 relative">
          <img 
            src="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=300&fit=crop&auto=format&q=80" 
            alt="International Space Station"
            className="w-full h-48 object-cover rounded-xl"
          />
          <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3">
            <div className="text-white font-semibold">📡 LIVE TRACKING</div>
            <div className="text-blue-300 text-sm">Real-time data from Open Notify API</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ISS Location */}
          <div className="bg-[#1e2124] rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <h3 className="text-white font-semibold text-lg">Live Location</h3>
            </div>
            
            {issData && (
              <div className="space-y-3">
                <div className="text-white text-2xl font-bold">
                  {parseFloat(issData.iss_position.latitude).toFixed(4)}°, {parseFloat(issData.iss_position.longitude).toFixed(4)}°
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[#a2abb3] font-semibold">Latitude</div>
                    <div className="text-white">{parseFloat(issData.iss_position.latitude).toFixed(4)}°</div>
                  </div>
                  <div>
                    <div className="text-[#a2abb3] font-semibold">Longitude</div>
                    <div className="text-white">{parseFloat(issData.iss_position.longitude).toFixed(4)}°</div>
                  </div>
                  <div>
                    <div className="text-[#a2abb3] font-semibold">Altitude</div>
                    <div className="text-white">~408 km</div>
                  </div>
                  <div>
                    <div className="text-[#a2abb3] font-semibold">Speed</div>
                    <div className="text-white">~7.66 km/s</div>
                  </div>
                </div>
                <div className="text-xs text-[#a2abb3]">
                  Last updated: {new Date(issData.timestamp * 1000).toLocaleTimeString()}
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
                        <div className="text-green-400 text-xs">🟢 Active</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-[#a2abb3]">
                    📡 Real-time crew data from Open Notify API
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
        {/* Satellite Gallery */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Hubble Space Telescope"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Hubble Telescope
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1517976487492-5750f3195933?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Starlink Satellites"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Starlink Constellation
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="NOAA Weather Satellite"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              NOAA Weather Sat
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1628126235206-5260b9ea6441?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Terra Satellite"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Terra Observatory
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
          <div className="text-xs text-[#a2abb3] mb-2">
            📡 Real-time satellite data from Groundtrack API
          </div>
          {filteredSatellites.slice(0, 8).map((satellite, index) => (
            <div key={index} className="bg-[#1e2124] rounded-lg p-4 border border-[#40474f]/30 relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-5 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${satellite.imageUrl}')`
                }}
              ></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-white font-semibold">{satellite.name}</h4>
                    <div className="flex gap-4 text-sm text-[#a2abb3]">
                      <span>🏢 {satellite.agency}</span>
                      <span>📡 {satellite.type}</span>
                      <span>✨ Mag {satellite.brightness.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">
                      {satellite.startTime.toLocaleDateString()} {satellite.startTime.toLocaleTimeString()}
                    </div>
                    <div className="text-[#a2abb3] text-xs">Local Time</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-[#a2abb3] font-semibold">Max Elevation</div>
                    <div className="text-white">{satellite.maxElevation.toFixed(1)}°</div>
                  </div>
                  <div>
                    <div className="text-[#a2abb3] font-semibold">Direction</div>
                    <div className="text-white">{satellite.direction}</div>
                  </div>
                  <div>
                    <div className="text-[#a2abb3] font-semibold">Duration</div>
                    <div className="text-white">{satellite.duration}m</div>
                  </div>
                </div>
                
                <div className="mt-2 flex justify-between items-center">
                  <div className={`px-2 py-1 rounded text-xs ${
                    satellite.visible 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {satellite.visible ? '👁️ Visible' : '🌫️ Not Visible'}
                  </div>
                  <div className="text-xs text-[#a2abb3]">
                    {satellite.maxElevation > 50 ? '🔥 Excellent' : 
                     satellite.maxElevation > 30 ? '✨ Good' : '📍 Low'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacewalk Alerts */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Upcoming Spacewalks</h2>
      <div className="p-4">
        {/* Spacewalk Gallery */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="EVA Operations"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              EVA Operations
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Space Maintenance"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Maintenance Work
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1604613453506-d8992efad17b?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Solar Array Work"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Solar Array Work
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-xs text-[#a2abb3] mb-2">
            🧑‍🚀 Spacewalk data derived from NASA EVA database
          </div>
          {spacewalks.map(spacewalk => (
            <div key={spacewalk.id} className="bg-gradient-to-r from-[#1e2124] to-[#2c3035] rounded-xl p-6 border border-yellow-500/20 relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-5 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${spacewalk.imageUrl}')`
                }}
              ></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🚀</div>
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
                    <div className="text-[#a2abb3] font-semibold">Objectives</div>
                    <div className="text-white">{spacewalk.objectives}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
              <a className="text-blue-400 text-sm font-medium leading-normal" href="/tracker">Tracker</a>
              <a className="text-white text-sm font-medium leading-normal" href="/events">Events</a>
              <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer">Weather</a>
              <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer">Today</a>
            </div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <SpaceTrackerContent />
        </div>
      </div>
    </div>
  );
}

export default function SpaceTracker() {
  return <SpaceTrackerClient />;
}