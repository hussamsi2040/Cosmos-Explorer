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

function EventPlannerInternal() {
  const [launches, setLaunches] = useState<any>(null);
  const [astronomicalEvents, setAstronomicalEvents] = useState<any[]>([]);
  const [spaceWeatherAlerts, setSpaceWeatherAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventType, setSelectedEventType] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting cosmic event planner data fetch...');
        
        // Initialize static data immediately
        setAstronomicalEvents(generateAstronomicalEvents());
        setSpaceWeatherAlerts(generateSpaceWeatherAlerts());
        
        // Fetch launch data
        const launchResult = await fetchUpcomingLaunches();
        setLaunches(launchResult);
        console.log('Launch data loaded successfully');
        
        setIsLoading(false);
      } catch (error) {
        console.error('Critical error in event planner:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter events by type and month
  const allEvents = [
    ...(launches?.results || []).map((launch: any) => ({
      ...launch,
      eventType: 'Launch',
      date: new Date(launch.net),
      title: launch.name
    })),
    ...astronomicalEvents.map(event => ({
      ...event,
      eventType: event.type,
      title: event.name
    })),
    ...spaceWeatherAlerts.map(alert => ({
      ...alert,
      eventType: 'Space Weather',
      title: `${alert.type} Alert`,
      date: alert.date
    }))
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  const filteredEvents = allEvents.filter(event => {
    const typeMatch = selectedEventType === 'All' || event.eventType === selectedEventType;
    const monthMatch = event.date.getMonth() === selectedMonth;
    return typeMatch && (selectedMonth === -1 || monthMatch);
  });

  const eventTypes = ['All', 'Launch', 'Eclipse', 'Meteor Shower', 'Planetary', 'Space Weather'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (isLoading) {
    return (
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="text-white text-center p-8 flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          Loading cosmic events calendar...
        </div>
      </div>
    );
  }

  return (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <div>
          <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Cosmic Event Planner</p>
          <p className="text-[#a2abb3] text-sm mt-1">
            Upcoming rocket launches, astronomical events, and space weather alerts
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#2c3035] text-white text-sm font-medium leading-normal tracking-[0.015em] hover:bg-[#373c42] transition-colors">
            📧 Set Reminders
          </button>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#1e2124] text-white text-sm font-medium leading-normal tracking-[0.015em] hover:bg-[#262a2e] transition-colors">
            📅 Export Calendar
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[#a2abb3] text-sm font-medium">Filter by type:</span>
            <div className="flex gap-2">
              {eventTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedEventType(type)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedEventType === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#2c3035] text-[#a2abb3] hover:bg-[#373c42] hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[#a2abb3] text-sm font-medium">View month:</span>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="bg-[#2c3035] text-white px-3 py-1 rounded-lg text-sm border border-[#40474f]/30 focus:border-blue-500 focus:outline-none"
          >
            <option value={-1}>All Months</option>
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Upcoming Launches */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Upcoming Rocket Launches</h2>
      <div className="p-4">
        <div className="space-y-4">
          {launches?.results?.slice(0, 5).map((launch: any) => (
            <div key={launch.id} className="bg-[#1e2124] rounded-xl p-6 border border-orange-500/20">
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
                  <div className="text-[#a2abb3] text-xs">{launch.mission?.type || 'Operational'}</div>
                </div>
                <div>
                  <div className="text-[#a2abb3] text-xs font-semibold mb-1">LAUNCH SITE</div>
                  <div className="text-white text-sm">{launch.pad?.name || 'Launch Pad TBD'}</div>
                  <div className="text-[#a2abb3] text-xs">{launch.pad?.location?.name || 'Location TBD'}</div>
                </div>
                <div>
                  <div className="text-[#a2abb3] text-xs font-semibold mb-1">WINDOW</div>
                  <div className="text-white text-sm">
                    {launch.window_start && launch.window_end 
                      ? `${Math.floor((new Date(launch.window_end).getTime() - new Date(launch.window_start).getTime()) / (1000 * 60))} minutes`
                      : 'Instantaneous'
                    }
                  </div>
                  <div className="text-[#a2abb3] text-xs">Launch window</div>
                </div>
              </div>
              
              <div className="bg-[#2c3035] rounded-lg p-3">
                <div className="text-[#a2abb3] text-xs font-semibold mb-1">MISSION DESCRIPTION</div>
                <div className="text-white text-sm">
                  {launch.mission?.description || 'Mission details to be announced'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Astronomical Events */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Astronomical Events</h2>
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {astronomicalEvents.slice(0, 6).map(event => (
            <div key={event.id} className="bg-gradient-to-br from-[#1e2124] to-[#2c3035] rounded-xl p-6 border border-purple-500/20">
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
                {event.peakRate && (
                  <div className="text-xs">
                    <span className="text-[#a2abb3] font-semibold">Peak Rate:</span>
                    <span className="text-white ml-1">{event.peakRate}</span>
                  </div>
                )}
                {event.magnitude && (
                  <div className="text-xs">
                    <span className="text-[#a2abb3] font-semibold">Magnitude:</span>
                    <span className="text-white ml-1">{event.magnitude}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Space Weather Alerts */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Space Weather Alerts</h2>
      <div className="p-4">
        <div className="space-y-4">
          {spaceWeatherAlerts.map(alert => (
            <div key={alert.id} className="bg-gradient-to-r from-[#1e2124] to-[#2c3035] rounded-xl p-6 border border-red-500/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {alert.type === 'Solar Flare' ? '☀️' : 
                     alert.type === 'Geomagnetic Storm' ? '🌍' : '🌌'}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{alert.type}</h4>
                    <div className="flex gap-2 items-center">
                      <div className="text-[#a2abb3] text-sm">{alert.category}</div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.severity === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                        alert.severity === 'Minor' ? 'bg-green-500/20 text-green-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {alert.severity}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">
                    {alert.date.toLocaleDateString()}
                  </div>
                  <div className="text-[#a2abb3] text-sm">
                    {alert.date.toLocaleTimeString()}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    alert.status === 'Ongoing' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {alert.status}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-white text-sm">{alert.description}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#a2abb3] font-semibold">Impact:</span>
                    <div className="text-white">{alert.impact}</div>
                  </div>
                  <div>
                    <span className="text-[#a2abb3] font-semibold">Duration:</span>
                    <div className="text-white">{alert.duration}</div>
                  </div>
                  <div>
                    <span className="text-[#a2abb3] font-semibold">Affected Regions:</span>
                    <div className="text-white">{alert.affectedRegions}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar View */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Calendar View</h2>
      <div className="p-4">
        <div className="bg-[#1e2124] rounded-xl p-6">
          <div className="text-center mb-4">
            <h3 className="text-white text-lg font-semibold">{months[selectedMonth >= 0 ? selectedMonth : new Date().getMonth()]} 2025</h3>
            <p className="text-[#a2abb3] text-sm">{filteredEvents.length} events scheduled</p>
          </div>
          
          <div className="space-y-3">
            {filteredEvents.slice(0, 10).map((event, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-[#2c3035] rounded-lg hover:bg-[#373c42] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-lg">
                    {event.eventType === 'Launch' ? '🚀' :
                     event.eventType === 'Eclipse' ? '🌒' :
                     event.eventType === 'Meteor Shower' ? '☄️' :
                     event.eventType === 'Planetary' ? '🪐' :
                     event.eventType === 'Space Weather' ? '⚠️' : '✨'}
                  </div>
                  <div>
                    <div className="text-white font-medium">{event.title}</div>
                    <div className="text-[#a2abb3] text-sm">{event.eventType}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm font-medium">
                    {event.date.toLocaleDateString()}
                  </div>
                  <div className="text-[#a2abb3] text-xs">
                    {event.date.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredEvents.length === 0 && (
            <div className="text-center text-[#a2abb3] py-8">
              No events found for the selected filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Dynamic import to prevent SSR issues
const EventPlanner = dynamic(() => Promise.resolve(EventPlannerInternal), {
  ssr: false,
  loading: () => (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      <div className="text-white text-center p-8 flex items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        Loading cosmic event calendar...
      </div>
    </div>
  )
});

function EventPlannerClient() {
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
          <EventPlanner />
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return <EventPlannerClient />;
}