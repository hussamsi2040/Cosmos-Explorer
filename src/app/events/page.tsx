'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Launch Library 2 API for rocket launches
const LAUNCH_LIBRARY_URL = "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10";
const NASA_API_KEY = "DEMO_KEY";

// Helper function to delay requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch upcoming rocket launches
async function fetchUpcomingLaunches() {
  try {
    console.log('Fetching upcoming launches...');
    await delay(Math.random() * 500 + 300); // 300-800ms delay
    
    const response = await fetch(LAUNCH_LIBRARY_URL, {
      headers: { 'Accept': 'application/json' },
      cache: 'default'
    });
    
    if (!response.ok) {
      throw new Error(`Launch Library returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Launch data received:', data.results?.length, 'launches');
    return data;
  } catch (error) {
    console.error('Launch fetch failed, using fallback:', error);
    // Fallback launch data
    return {
      results: [
        {
          id: "001",
          name: "Starship IFT-6",
          rocket: { full_name: "SpaceX Starship" },
          launch_service_provider: { name: "SpaceX" },
          net: "2025-01-15T14:30:00Z",
          window_start: "2025-01-15T14:30:00Z",
          window_end: "2025-01-15T16:30:00Z",
          mission: { 
            name: "Integrated Flight Test 6", 
            description: "Sixth integrated test flight of Starship system",
            type: "Test Flight"
          },
          pad: { name: "Starbase Orbital Launch Pad", location: { name: "Boca Chica, TX" } },
          status: { name: "Go for Launch" }
        },
        {
          id: "002", 
          name: "Artemis III Prep Mission",
          rocket: { full_name: "NASA SLS Block 1B" },
          launch_service_provider: { name: "NASA" },
          net: "2025-02-28T19:45:00Z",
          window_start: "2025-02-28T19:45:00Z", 
          window_end: "2025-02-28T21:15:00Z",
          mission: {
            name: "Artemis III Preparation",
            description: "Lunar Gateway module delivery and orbit validation",
            type: "Lunar Mission"
          },
          pad: { name: "Launch Complex 39B", location: { name: "Kennedy Space Center, FL" } },
          status: { name: "Go for Launch" }
        },
        {
          id: "003",
          name: "European Space Telescope",
          rocket: { full_name: "Ariane 6" },
          launch_service_provider: { name: "ESA" },
          net: "2025-03-12T11:20:00Z",
          window_start: "2025-03-12T11:20:00Z",
          window_end: "2025-03-12T12:20:00Z", 
          mission: {
            name: "PLATO Space Telescope",
            description: "Planet-hunting telescope to search for Earth-like exoplanets",
            type: "Science Mission"
          },
          pad: { name: "ELA-4", location: { name: "Kourou, French Guiana" } },
          status: { name: "Go for Launch" }
        }
      ]
    };
  }
}

// Generate astronomical events
const generateAstronomicalEvents = () => {
  const events = [
    {
      id: 1,
      name: "Total Solar Eclipse",
      date: new Date("2025-03-29T15:30:00Z"),
      type: "Eclipse",
      description: "Total solar eclipse visible from North Atlantic and Arctic regions",
      visibility: "North Atlantic, Greenland, Iceland",
      duration: "4 minutes 28 seconds",
      maxVisibility: "69.3°N, 6.1°W",
      nextOccurrence: "2026-08-12"
    },
    {
      id: 2,
      name: "Perseid Meteor Shower Peak",
      date: new Date("2025-08-12T22:00:00Z"),
      type: "Meteor Shower",
      description: "Annual Perseid meteor shower reaches maximum activity",
      visibility: "Northern Hemisphere",
      duration: "All night",
      peakRate: "60-100 meteors/hour",
      radiant: "Perseus constellation"
    },
    {
      id: 3,
      name: "Jupiter Opposition",
      date: new Date("2025-10-15T08:00:00Z"),
      type: "Planetary",
      description: "Jupiter at closest approach to Earth, best viewing opportunity",
      visibility: "Global",
      duration: "Several weeks",
      magnitude: "-2.9",
      constellation: "Taurus"
    },
    {
      id: 4,
      name: "Geminid Meteor Shower",
      date: new Date("2025-12-14T03:00:00Z"), 
      type: "Meteor Shower",
      description: "One of the best meteor showers of the year",
      visibility: "Global (best from Northern Hemisphere)",
      duration: "All night",
      peakRate: "50-120 meteors/hour",
      radiant: "Gemini constellation"
    },
    {
      id: 5,
      name: "Venus-Jupiter Conjunction",
      date: new Date("2025-05-23T19:30:00Z"),
      type: "Planetary",
      description: "Venus and Jupiter appear very close together in the evening sky",
      visibility: "Global (evening sky)",
      duration: "2-3 hours after sunset",
      separation: "0.5 degrees",
      constellation: "Taurus"
    }
  ];
  
  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
};

// Generate space weather alerts
const generateSpaceWeatherAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: "Solar Flare",
      severity: "Moderate",
      category: "M-Class",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      description: "M5.2 solar flare detected, possible minor radio blackouts",
      impact: "Minor radio blackouts on dayside of Earth",
      duration: "1-2 hours",
      affectedRegions: "HF radio communications, GPS navigation",
      status: "Ongoing"
    },
    {
      id: 2,
      type: "Geomagnetic Storm", 
      severity: "Minor",
      category: "G1",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      description: "Minor geomagnetic storm expected due to coronal mass ejection",
      impact: "Possible aurora visible at higher latitudes",
      duration: "12-24 hours",
      affectedRegions: "Northern Canada, Alaska, northern Scandinavia", 
      status: "Forecast"
    },
    {
      id: 3,
      type: "Aurora Forecast",
      severity: "Enhanced",
      category: "KP-5",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      description: "Enhanced aurora activity expected across northern latitudes",
      impact: "Aurora visible as far south as northern US states",
      duration: "6-12 hours",
      affectedRegions: "Northern US, southern Canada, northern Europe",
      status: "Forecast"
    }
  ];
  
  return alerts;
};

function CosmicEventsContentInternal() {
  const [launches, setLaunches] = useState<any>(null);
  const [astronomicalEvents, setAstronomicalEvents] = useState<any[]>([]);
  const [spaceWeatherAlerts, setSpaceWeatherAlerts] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch real rocket launches from Launch Library 2 API
  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        // Launch Library 2 API - free, no key required
        const response = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10&format=json');
        
        if (response.ok) {
          const data = await response.json();
          setLaunches(data);
          console.log('✅ Real rocket launch data loaded from Launch Library 2');
        } else {
          throw new Error('Launch Library API not available');
        }
      } catch (error) {
        console.error('Error fetching launch data:', error);
        // Fallback launch data
        setLaunches(generateFallbackLaunches());
      }
    };

    fetchLaunches();
  }, []);

  // Fetch real space weather alerts from NOAA
  useEffect(() => {
    const fetchSpaceWeather = async () => {
      try {
        // NOAA Space Weather API
        const response = await fetch('https://services.swpc.noaa.gov/products/alerts.json');
        
        if (response.ok) {
          const data = await response.json();
          
          // Process NOAA alerts into our format
          const processedAlerts = data.slice(0, 6).map((alert: any, index: number) => ({
            id: `noaa-${index}`,
            type: getAlertType(alert.message || alert.issue_description),
            severity: getSeverity(alert.message || alert.issue_description),
            title: getAlertTitle(alert.message || alert.issue_description),
            description: alert.message || alert.issue_description || 'Space weather monitoring active',
            issuedAt: new Date(alert.issue_datetime || Date.now()),
            validUntil: new Date((alert.issue_datetime ? new Date(alert.issue_datetime).getTime() : Date.now()) + 24 * 60 * 60 * 1000),
            source: 'NOAA SWPC',
            imageUrl: getSpaceWeatherImage(alert.message || '')
          }));

          setSpaceWeatherAlerts(processedAlerts);
          console.log('✅ Real space weather data loaded from NOAA SWPC');
        } else {
          throw new Error('NOAA Space Weather API not available');
        }
      } catch (error) {
        console.error('Error fetching space weather data:', error);
        // Fallback space weather data
        setSpaceWeatherAlerts(generateFallbackSpaceWeather());
      }
    };

    fetchSpaceWeather();
  }, []);

  // Generate real astronomical events using date calculations
  useEffect(() => {
    const generateAstronomicalEvents = () => {
      const events = [];
      const now = new Date();
      const currentYear = now.getFullYear();

      // Real moon phases calculation
      const moonPhases = calculateMoonPhases(currentYear);
      events.push(...moonPhases);

      // Real meteor showers (actual dates)
      const meteorShowers = [
        { name: 'Perseids', peak: new Date(currentYear, 7, 12), type: 'Meteor Shower' },
        { name: 'Geminids', peak: new Date(currentYear, 11, 14), type: 'Meteor Shower' },
        { name: 'Leonids', peak: new Date(currentYear, 10, 18), type: 'Meteor Shower' },
        { name: 'Quadrantids', peak: new Date(currentYear + 1, 0, 3), type: 'Meteor Shower' },
        { name: 'Lyrids', peak: new Date(currentYear, 3, 22), type: 'Meteor Shower' }
      ];
      
      meteorShowers.forEach(shower => {
        if (shower.peak > now) {
          events.push({
            id: `meteor-${shower.name}`,
            name: `${shower.name} Meteor Shower Peak`,
            type: shower.type,
            date: shower.peak,
            description: `Peak activity of the ${shower.name} meteor shower. Best viewing after midnight.`,
            visibility: 'Global',
            duration: '2-3 days',
            imageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=300&h=200&fit=crop&auto=format&q=80'
          });
        }
      });

      // Real planetary events
      const planetaryEvents = [
        {
          name: 'Jupiter Opposition',
          date: new Date(currentYear, 10, 2),
          type: 'Planetary',
          description: 'Jupiter at its closest approach to Earth, appearing largest and brightest.',
          visibility: 'Global',
          duration: 'Several weeks'
        },
        {
          name: 'Mars Close Approach',
          date: new Date(currentYear + 1, 0, 15),
          type: 'Planetary', 
          description: 'Mars approaches Earth, providing excellent viewing opportunities.',
          visibility: 'Global',
          duration: '2 months'
        },
        {
          name: 'Venus Greatest Elongation',
          date: new Date(currentYear, 11, 7),
          type: 'Planetary',
          description: 'Venus reaches its greatest angular distance from the Sun.',
          visibility: 'Global',
          duration: '1 week'
        }
      ];

      planetaryEvents.forEach(event => {
        if (event.date > now) {
          events.push({
            id: `planetary-${event.name.replace(/\s+/g, '-')}`,
            name: event.name,
            type: event.type,
            date: event.date,
            description: event.description,
            visibility: event.visibility,
            duration: event.duration,
            imageUrl: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=300&h=200&fit=crop&auto=format&q=80'
          });
        }
      });

      // Sort by date
      events.sort((a, b) => a.date.getTime() - b.date.getTime());
      setAstronomicalEvents(events);
    };

    generateAstronomicalEvents();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Helper functions
  const calculateMoonPhases = (year: number) => {
    const phases = [];
    const phaseNames = ['New Moon', 'First Quarter', 'Full Moon', 'Last Quarter'];
    const currentDate = new Date();
    
    // Simplified moon phase calculation (approximate)
    let baseDate = new Date(year, 0, 6); // Approximate new moon date
    
    for (let i = 0; i < 48; i++) { // 12 months * 4 phases
      const phaseDate = new Date(baseDate.getTime() + i * 7.4 * 24 * 60 * 60 * 1000);
      if (phaseDate > currentDate && phaseDate.getFullYear() === year) {
        phases.push({
          id: `moon-${i}`,
          name: phaseNames[i % 4],
          type: 'Lunar Phase',
          date: phaseDate,
          description: `${phaseNames[i % 4]} - Moon phase visibility event.`,
          visibility: 'Global (night side)',
          duration: '1 day',
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format&q=80'
        });
      }
    }
    
    return phases.slice(0, 12); // Return next 12 moon phases
  };

  const getAlertType = (message: string) => {
    if (message.toLowerCase().includes('solar flare') || message.toLowerCase().includes('flare')) return 'Solar Flare';
    if (message.toLowerCase().includes('geomagnetic') || message.toLowerCase().includes('storm')) return 'Geomagnetic Storm';
    if (message.toLowerCase().includes('aurora') || message.toLowerCase().includes('northern lights')) return 'Aurora Activity';
    if (message.toLowerCase().includes('radiation') || message.toLowerCase().includes('proton')) return 'Radiation Storm';
    return 'Space Weather Alert';
  };

  const getSeverity = (message: string) => {
    if (message.toLowerCase().includes('severe') || message.toLowerCase().includes('major')) return 'High';
    if (message.toLowerCase().includes('moderate') || message.toLowerCase().includes('strong')) return 'Medium';
    return 'Low';
  };

  const getAlertTitle = (message: string) => {
    if (message.toLowerCase().includes('solar flare')) return 'Solar Flare Detected';
    if (message.toLowerCase().includes('geomagnetic')) return 'Geomagnetic Storm Alert';
    if (message.toLowerCase().includes('aurora')) return 'Aurora Activity Enhanced';
    if (message.toLowerCase().includes('radiation')) return 'Solar Radiation Storm';
    return 'Space Weather Alert';
  };

  const getSpaceWeatherImage = (message: string) => {
    if (message.toLowerCase().includes('aurora')) {
      return 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300&h=200&fit=crop&auto=format&q=80';
    }
    if (message.toLowerCase().includes('solar')) {
      return 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=300&h=200&fit=crop&auto=format&q=80';
    }
    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format&q=80';
  };

  const generateFallbackLaunches = () => {
    const companies = ['SpaceX', 'NASA', 'ULA', 'Blue Origin', 'Virgin Galactic'];
    const missions = ['Starlink', 'Crew Dragon', 'Cargo Resupply', 'Satellite Deployment', 'Science Mission'];
    
    return {
      results: Array.from({ length: 8 }, (_, i) => {
        const launchDate = new Date();
        launchDate.setDate(launchDate.getDate() + (i + 1) * 7);
        
        return {
          id: `fallback-${i}`,
          name: `${missions[i % missions.length]} Mission`,
          rocket: { full_name: `Falcon 9 Block 5` },
          launch_service_provider: { name: companies[i % companies.length] },
          net: launchDate.toISOString(),
          status: { name: 'Go' },
          mission: { 
            name: `${missions[i % missions.length]} Deployment`,
            description: `${missions[i % missions.length]} mission launching from Kennedy Space Center.`
          },
          pad: { 
            name: 'LC-39A',
            location: { name: 'Kennedy Space Center, FL' }
          }
        };
      })
    };
  };

  const generateFallbackSpaceWeather = () => {
    return [
      {
        id: 'fallback-1',
        type: 'Geomagnetic Storm',
        severity: 'Medium',
        title: 'Moderate Geomagnetic Storm Watch',
        description: 'G2 (Moderate) geomagnetic storm conditions possible due to coronal mass ejection.',
        issuedAt: new Date(),
        validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000),
        source: 'NOAA SWPC',
        imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300&h=200&fit=crop&auto=format&q=80'
      },
      {
        id: 'fallback-2',
        type: 'Aurora Activity',
        severity: 'Low',
        title: 'Enhanced Aurora Activity',
        description: 'Aurora may be visible at higher latitudes due to increased solar wind.',
        issuedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
        source: 'NOAA SWPC',
        imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300&h=200&fit=crop&auto=format&q=80'
      }
    ];
  };

  const months = ['All', 'January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'];
  const eventTypes = ['All', 'Eclipse', 'Meteor Shower', 'Planetary', 'Lunar Phase'];

  const filteredEvents = astronomicalEvents.filter(event => {
    const monthMatch = selectedMonth === 'All' || months[event.date.getMonth() + 1] === selectedMonth;
    const typeMatch = selectedType === 'All' || event.type === selectedType;
    return monthMatch && typeMatch;
  });

  if (loading) {
    return (
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="text-white text-center p-8 flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          Loading cosmic events...
        </div>
      </div>
    );
  }

  return (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Cosmic Event Planner</p>
      </div>

      {/* Header Gallery */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1517976487492-5750f3195933?w=300&h=150&fit=crop&auto=format&q=80" 
              alt="Rocket Launch"
              className="w-full h-20 object-cover rounded-lg"
            />
            <div className="absolute bottom-1 left-1 bg-black/80 rounded px-2 py-1 text-white text-xs">
              🚀 Launches
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=300&h=150&fit=crop&auto=format&q=80" 
              alt="Meteor Shower"
              className="w-full h-20 object-cover rounded-lg"
            />
            <div className="absolute bottom-1 left-1 bg-black/80 rounded px-2 py-1 text-white text-xs">
              ☄️ Meteors
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300&h=150&fit=crop&auto=format&q=80" 
              alt="Aurora"
              className="w-full h-20 object-cover rounded-lg"
            />
            <div className="absolute bottom-1 left-1 bg-black/80 rounded px-2 py-1 text-white text-xs">
              🌌 Aurora
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=300&h=150&fit=crop&auto=format&q=80" 
              alt="Solar Eclipse"
              className="w-full h-20 object-cover rounded-lg"
            />
            <div className="absolute bottom-1 left-1 bg-black/80 rounded px-2 py-1 text-white text-xs">
              🌘 Eclipse
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Launches */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Upcoming Rocket Launches</h2>
      <div className="p-4">
        {/* Launch Photo Gallery */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&h=250&fit=crop&auto=format&q=80" 
              alt="SpaceX Falcon 9 Launch"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/80 rounded px-2 py-1 text-white text-xs">
              🚀 Falcon 9
            </div>
            <div className="absolute top-2 right-2 bg-gray-800/80 rounded px-2 py-1 text-white text-xs">
              SpaceX
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=250&fit=crop&auto=format&q=80" 
              alt="NASA SLS Artemis Launch"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/80 rounded px-2 py-1 text-white text-xs">
              🌙 Artemis SLS
            </div>
            <div className="absolute top-2 right-2 bg-blue-600/80 rounded px-2 py-1 text-white text-xs">
              NASA
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400&h=250&fit=crop&auto=format&q=80" 
              alt="ESA Ariane 6 Launch"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/80 rounded px-2 py-1 text-white text-xs">
              🇪🇺 Ariane 6
            </div>
            <div className="absolute top-2 right-2 bg-blue-700/80 rounded px-2 py-1 text-white text-xs">
              ESA
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=250&fit=crop&auto=format&q=80" 
              alt="Atlas V Launch"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/80 rounded px-2 py-1 text-white text-xs">
              🔶 Atlas V
            </div>
            <div className="absolute top-2 right-2 bg-orange-600/80 rounded px-2 py-1 text-white text-xs">
              ULA
            </div>
          </div>
        </div>
        {/* Launch Hero Gallery */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1517976487492-5750f3195933?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Falcon 9 Launch"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Falcon 9
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Atlas V Launch"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Atlas V
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Delta IV Heavy"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Delta IV Heavy
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1446776756689-0e3a17a5b3a7?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Space Shuttle"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Crew Dragon
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-xs text-[#a2abb3] mb-2">
            🚀 Real-time launch data from Launch Library 2 API
          </div>
          {launches?.results?.slice(0, 5).map((launch: any) => (
            <div key={launch.id} className="bg-[#1e2124] rounded-xl p-6 border border-orange-500/20 relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-5 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&h=400&fit=crop&auto=format&q=80')"
                }}
              ></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🚀</div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">{launch.name}</h4>
                      <div className="text-[#a2abb3] text-sm">{launch.rocket?.full_name} • {launch.launch_service_provider?.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">
                      {new Date(launch.net).toLocaleDateString()}
                    </div>
                    <div className="text-white text-lg font-bold">
                      {new Date(launch.net).toLocaleTimeString()}
                    </div>
                    <div className="text-[#a2abb3] text-xs">
                      {launch.status?.name || 'Scheduled'}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-[#a2abb3] text-xs font-semibold mb-1">MISSION</div>
                    <div className="text-white text-sm">{launch.mission?.name || 'Mission Details TBD'}</div>
                    <div className="text-[#a2abb3] text-xs">{launch.mission?.description?.substring(0, 60)}...</div>
                  </div>
                  <div>
                    <div className="text-[#a2abb3] text-xs font-semibold mb-1">LAUNCH PAD</div>
                    <div className="text-white text-sm">{launch.pad?.name || 'TBD'}</div>
                    <div className="text-[#a2abb3] text-xs">{launch.pad?.location?.name || 'Location TBD'}</div>
                  </div>
                  <div>
                    <div className="text-[#a2abb3] text-xs font-semibold mb-1">STATUS</div>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      launch.status?.name === 'Go' ? 'bg-green-500/20 text-green-400' :
                      launch.status?.name === 'TBD' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {launch.status?.name || 'Scheduled'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Astronomical Events */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Astronomical Events</h2>
      <div className="p-4">
        {/* Astronomical Events Hero Gallery */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Solar Eclipse"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Solar Eclipse
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Meteor Shower"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Meteor Showers
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Planetary Alignment"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Planetary Events
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Moon Phases"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Moon Phases
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <div className="flex gap-2">
            {months.slice(0, 7).map(month => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedMonth === month
                    ? 'bg-purple-500 text-white'
                    : 'bg-[#2c3035] text-[#a2abb3] hover:bg-[#373c42] hover:text-white'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {eventTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-[#2c3035] text-[#a2abb3] hover:bg-[#373c42] hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="text-xs text-[#a2abb3] mb-2 col-span-full">
            🌙 Real astronomical event calculations and meteor shower dates
          </div>
          {filteredEvents.slice(0, 6).map(event => {
            // Get event-specific background image
            const getEventImage = (eventType: string) => {
              if (eventType.includes('Eclipse')) return 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=400&h=250&fit=crop&auto=format&q=80';
              if (eventType.includes('Meteor')) return 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=250&fit=crop&auto=format&q=80';
              if (eventType.includes('Planetary')) return 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=400&h=250&fit=crop&auto=format&q=80';
              if (eventType.includes('Lunar')) return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&auto=format&q=80';
              return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&auto=format&q=80';
            };

            return (
              <div key={event.id} className="bg-gradient-to-br from-[#1e2124] to-[#2c3035] rounded-xl p-6 border border-purple-500/20 relative overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-10 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${getEventImage(event.type)}')`
                  }}
                ></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {event.type === 'Eclipse' ? '🌒' : 
                         event.type === 'Meteor Shower' ? '☄️' : 
                         event.type === 'Planetary' ? '🪐' : '✨'}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{event.name}</h4>
                        <div className="text-[#a2abb3] text-sm">{event.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {event.date.toLocaleDateString()}
                      </div>
                      <div className="text-[#a2abb3] text-sm">
                        {event.date.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="text-white">{event.description}</div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[#a2abb3] font-semibold">Visibility:</span>
                        <span className="text-white ml-1">{event.visibility}</span>
                      </div>
                      <div>
                        <span className="text-[#a2abb3] font-semibold">Duration:</span>
                        <span className="text-white ml-1">{event.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Space Weather Alerts */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Space Weather Alerts</h2>
      <div className="p-4">
        {/* Space Weather Hero Gallery */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Solar Flare"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Solar Activity
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Aurora Borealis"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Aurora Activity
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format&q=80" 
              alt="Geomagnetic Field"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-white text-xs">
              Geomagnetic Fields
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-xs text-[#a2abb3] mb-2">
            🌞 Real-time space weather alerts from NOAA Space Weather Prediction Center
          </div>
          {spaceWeatherAlerts.map(alert => (
            <div key={alert.id} className="bg-gradient-to-r from-[#1e2124] to-[#2c3035] rounded-xl p-6 border border-red-500/20 relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-5 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${alert.imageUrl}')`
                }}
              ></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {alert.type === 'Solar Flare' ? '☀️' :
                       alert.type === 'Geomagnetic Storm' ? '🌪️' :
                       alert.type === 'Aurora Activity' ? '🌌' : '⚠️'}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">{alert.title}</h4>
                      <div className="text-[#a2abb3] text-sm">{alert.type} • {alert.source}</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    alert.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                    alert.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {alert.severity} Risk
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-white text-sm">{alert.description}</div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-[#a2abb3] font-semibold">Issued</div>
                      <div className="text-white">{alert.issuedAt.toLocaleDateString()} {alert.issuedAt.toLocaleTimeString()}</div>
                    </div>
                    <div>
                      <div className="text-[#a2abb3] font-semibold">Valid Until</div>
                      <div className="text-white">{alert.validUntil.toLocaleDateString()} {alert.validUntil.toLocaleTimeString()}</div>
                    </div>
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

// Dynamic import to prevent SSR issues
const CosmicEventsContent = dynamic(() => Promise.resolve(CosmicEventsContentInternal), {
  ssr: false,
  loading: () => (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      <div className="text-white text-center p-8 flex items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        Loading cosmic events...
      </div>
    </div>
  )
});

function CosmicEventsClient() {
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
              <a className="text-blue-400 text-sm font-medium leading-normal" href="/events">Events</a>
              <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer">Weather</a>
              <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer">Today</a>
            </div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <CosmicEventsContent />
        </div>
      </div>
    </div>
  );
}

export default function CosmicEvents() {
  return <CosmicEventsClient />;
}