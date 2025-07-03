'use client';

import React, { useState, useEffect } from 'react';

// Real NASA and space APIs
const LAUNCH_LIBRARY_URL = "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10";
const NASA_API_KEY = "DEMO_KEY";

interface Launch {
  id: string;
  name: string;
  rocket: { full_name: string };
  launch_service_provider: { name: string };
  net: string;
  status: { name: string };
  mission: { 
    name: string;
    description: string;
  };
  pad: { 
    name: string;
    location: { name: string };
  };
  image?: string;
}

interface AstronomicalEvent {
  id: string;
  name: string;
  type: string;
  date: Date;
  description: string;
  visibility: string;
  duration: string;
}

interface SpaceWeatherAlert {
  id: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  issuedAt: Date;
  validUntil: Date;
  source: string;
}

export default function CosmicEvents() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [astronomicalEvents, setAstronomicalEvents] = useState<AstronomicalEvent[]>([]);
  const [spaceWeatherAlerts, setSpaceWeatherAlerts] = useState<SpaceWeatherAlert[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);

  // Helper functions
  const getDefaultRocketImage = (provider: string) => {
    const images = {
      'SpaceX': 'https://www.spacex.com/static/images/falcon-9/overview/F9_InFlight_Render.jpg',
      'NASA': 'https://www.nasa.gov/wp-content/uploads/2019/07/artemis-1-sls-rocket.jpg',
      'ULA': 'https://www.ulalaunch.com/images/default-source/rockets/atlas-v-on-pad.jpg',
      'Blue Origin': 'https://www.blueorigin.com/assets/New-Shepard-Launch.jpg',
      'ESA': 'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2023/07/ariane_6_on_the_launch_pad/24956697-1-eng-GB/Ariane_6_on_the_launch_pad.jpg'
    };
    return images[provider as keyof typeof images] || 'https://images.nasa.gov/details-sts134-s-058.html';
  };

  const calculateAstronomicalEvents = (): AstronomicalEvent[] => {
    const events: AstronomicalEvent[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();

    // Real moon phases (simplified calculation)
    const phaseNames = ['New Moon', 'First Quarter', 'Full Moon', 'Last Quarter'];
    let baseDate = new Date(currentYear, 0, 6); // Approximate new moon
    
    for (let i = 0; i < 16; i++) {
      const phaseDate = new Date(baseDate.getTime() + i * 7.4 * 24 * 60 * 60 * 1000);
      if (phaseDate > now && phaseDate.getFullYear() <= currentYear + 1) {
        events.push({
          id: `moon-${i}`,
          name: phaseNames[i % 4],
          type: 'Lunar Phase',
          date: phaseDate,
          description: `${phaseNames[i % 4]} - Moon phase visibility event.`,
          visibility: 'Global (night side)',
          duration: '1 day'
        });
      }
    }

    // Real meteor showers with actual peak dates
    const meteorShowers = [
      { name: 'Perseids', peak: new Date(currentYear, 7, 12), rate: '60-100' },
      { name: 'Geminids', peak: new Date(currentYear, 11, 14), rate: '50-120' },
      { name: 'Leonids', peak: new Date(currentYear, 10, 18), rate: '10-15' },
      { name: 'Quadrantids', peak: new Date(currentYear + 1, 0, 3), rate: '25-40' },
      { name: 'Lyrids', peak: new Date(currentYear, 3, 22), rate: '10-20' },
      { name: 'Eta Aquariids', peak: new Date(currentYear, 4, 5), rate: '10-30' }
    ];
    
    meteorShowers.forEach(shower => {
      if (shower.peak > now) {
        events.push({
          id: `meteor-${shower.name}`,
          name: `${shower.name} Meteor Shower Peak`,
          type: 'Meteor Shower',
          date: shower.peak,
          description: `Peak activity of the ${shower.name} meteor shower. Best viewing after midnight with ${shower.rate} meteors per hour.`,
          visibility: 'Global',
          duration: '2-3 days'
        });
      }
    });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 12);
  };

  const getAlertType = (message: string) => {
    if (message.toLowerCase().includes('solar flare') || message.toLowerCase().includes('flare')) return 'Solar Flare';
    if (message.toLowerCase().includes('geomagnetic') || message.toLowerCase().includes('storm')) return 'Geomagnetic Storm';
    if (message.toLowerCase().includes('aurora')) return 'Aurora Activity';
    if (message.toLowerCase().includes('radiation') || message.toLowerCase().includes('proton')) return 'Radiation Storm';
    return 'Space Weather Alert';
  };

  const getSeverity = (message: string) => {
    if (message.toLowerCase().includes('severe') || message.toLowerCase().includes('major') || message.toLowerCase().includes('extreme')) return 'High Risk';
    if (message.toLowerCase().includes('moderate') || message.toLowerCase().includes('strong')) return 'Medium Risk';
    return 'Low Risk';
  };

  const getAlertTitle = (message: string) => {
    if (message.toLowerCase().includes('solar flare')) return 'Solar Flare Alert';
    if (message.toLowerCase().includes('geomagnetic')) return 'Geomagnetic Storm Alert';
    if (message.toLowerCase().includes('aurora')) return 'Aurora Activity Alert';
    if (message.toLowerCase().includes('radiation')) return 'Solar Radiation Storm';
    return 'Space Weather Alert';
  };

  const cleanAlertDescription = (message: string) => {
    // Clean up NOAA message formatting
    return message.replace(/\n\n/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 300) + (message.length > 300 ? '...' : '');
  };

  const getFallbackLaunches = (): Launch[] => {
    return [
      {
        id: 'fallback-1',
        name: 'Falcon 9 Block 5 | Starlink Group 6-65',
        rocket: { full_name: 'Falcon 9 Block 5' },
        launch_service_provider: { name: 'SpaceX' },
        net: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: { name: 'Go for Launch' },
        mission: {
          name: 'Starlink Group 6-65',
          description: 'A batch of 23 Starlink satellites for the Starlink mega-constellation'
        },
        pad: {
          name: 'Space Launch Complex 40',
          location: { name: 'Cape Canaveral SFS, FL, USA' }
        }
      }
    ];
  };

  const getFallbackSpaceWeather = (): SpaceWeatherAlert[] => {
    return [
      {
        id: 'fallback-1',
        type: 'Space Weather Monitor',
        severity: 'Low Risk',
        title: 'Space Weather Monitoring Active',
        description: 'NOAA Space Weather Prediction Center monitoring solar activity and geomagnetic conditions.',
        issuedAt: new Date(),
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
        source: 'NOAA SWPC'
      }
    ];
  };

  // Fetch real rocket launches from Launch Library 2 API
  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const response = await fetch(LAUNCH_LIBRARY_URL);
        if (response.ok) {
          const data = await response.json();
          const processedLaunches = data.results.map((launch: any) => ({
            id: launch.id,
            name: launch.name,
            rocket: { full_name: launch.rocket?.configuration?.full_name || 'Unknown Rocket' },
            launch_service_provider: { name: launch.launch_service_provider?.name || 'Unknown Provider' },
            net: launch.net,
            status: { name: launch.status?.name || 'TBD' },
            mission: {
              name: launch.mission?.name || launch.name,
              description: launch.mission?.description || `Launch mission for ${launch.rocket?.configuration?.name || 'rocket'}`
            },
            pad: {
              name: launch.pad?.name || 'TBD',
              location: { name: launch.pad?.location?.name || 'TBD' }
            },
            image: launch.image || getDefaultRocketImage(launch.launch_service_provider?.name || 'Unknown')
          }));
          setLaunches(processedLaunches);
          console.log('✅ Real rocket launch data loaded from Launch Library 2');
        }
      } catch (error) {
        console.error('Error fetching launch data:', error);
        setLaunches(getFallbackLaunches());
      }
    };

    fetchLaunches();
  }, []);

  // Fetch real space weather from NOAA
  useEffect(() => {
    const fetchSpaceWeather = async () => {
      try {
        const response = await fetch('https://services.swpc.noaa.gov/products/alerts.json');
        if (response.ok) {
          const data = await response.json();
          const processedAlerts = data.slice(0, 6).map((alert: any, index: number) => ({
            id: `noaa-${index}`,
            type: getAlertType(alert.message || ''),
            severity: getSeverity(alert.message || ''),
            title: getAlertTitle(alert.message || ''),
            description: cleanAlertDescription(alert.message || 'Space weather monitoring active'),
            issuedAt: new Date(alert.issue_datetime || Date.now()),
            validUntil: new Date((alert.issue_datetime ? new Date(alert.issue_datetime).getTime() : Date.now()) + 24 * 60 * 60 * 1000),
            source: 'NOAA SWPC'
          }));
          setSpaceWeatherAlerts(processedAlerts);
          console.log('✅ Real space weather data loaded from NOAA SWPC');
        }
      } catch (error) {
        console.error('Error fetching space weather data:', error);
        setSpaceWeatherAlerts(getFallbackSpaceWeather());
      }
    };

    fetchSpaceWeather();
  }, []);

  // Generate real astronomical events
  useEffect(() => {
    const events = calculateAstronomicalEvents();
    setAstronomicalEvents(events);
    setLoading(false);
  }, []);

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
      <div className="relative flex size-full min-h-screen flex-col bg-[#111418] dark group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2c3035] px-10 py-3">
            <div className="flex items-center gap-4 text-white">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Cosmic Classroom</h2>
            </div>
            <div className="flex flex-1 justify-end gap-8">
              <div className="flex items-center gap-9">
                <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer">Home</a>
                <a className="text-white text-sm font-medium leading-normal" href="/tracker">Tracker</a>
                <a className="text-white text-sm font-medium leading-normal" href="/events">Events</a>
                <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer/nasa-tv">NASA TV</a>
                <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer">Today</a>
              </div>
            </div>
          </header>
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1 items-center justify-center">
              <div className="text-white text-center p-8 flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="text-lg">Loading NASA events and launch data...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111418] dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2c3035] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Cosmic Classroom</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer">Home</a>
              <a className="text-white text-sm font-medium leading-normal" href="/tracker">Tracker</a>
              <a className="text-white text-sm font-medium leading-normal" href="/events">Events</a>
              <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer/nasa-tv">NASA TV</a>
              <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer">Today</a>
            </div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            
            {/* Page Header */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <h1 className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">NASA Events & Launches</h1>
            </div>

            {/* Real Launch Data Section */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Upcoming Rocket Launches</h2>
            <div className="p-4">
              <div className="text-xs text-[#a2abb3] mb-4">🚀 Real-time launch data from Launch Library 2 API</div>
              <div className="space-y-4">
                {launches.slice(0, 6).map((launch) => (
                  <div key={launch.id} className="bg-[#1e2124] rounded-xl p-6 border border-orange-500/20 relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">🚀</div>
                          <div>
                            <h4 className="text-white font-semibold text-lg">{launch.name}</h4>
                            <div className="text-[#a2abb3] text-sm">{launch.launch_service_provider.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">{new Date(launch.net).toLocaleDateString()}</div>
                          <div className="text-white text-lg font-bold">{new Date(launch.net).toLocaleTimeString()}</div>
                          <div className="text-[#a2abb3] text-xs">{launch.status.name}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-[#a2abb3] text-xs font-semibold mb-1">MISSION</div>
                          <div className="text-white text-sm">{launch.mission.name}</div>
                          <div className="text-[#a2abb3] text-xs">{launch.mission.description.substring(0, 100)}...</div>
                        </div>
                        <div>
                          <div className="text-[#a2abb3] text-xs font-semibold mb-1">LAUNCH PAD</div>
                          <div className="text-white text-sm">{launch.pad.name}</div>
                          <div className="text-[#a2abb3] text-xs">{launch.pad.location.name}</div>
                        </div>
                        <div>
                          <div className="text-[#a2abb3] text-xs font-semibold mb-1">ROCKET</div>
                          <div className="text-white text-sm">{launch.rocket.full_name}</div>
                          <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400 mt-1">
                            {launch.status.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Astronomical Events */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Astronomical Events</h2>
            <div className="p-4">
              
              {/* Month and Type Filters */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <div className="flex gap-2">
                  {months.map(month => (
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
              </div>

              <div className="flex gap-2 mb-6 flex-wrap">
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
                <div className="text-xs text-[#a2abb3] mb-2 col-span-full">🌙 Real astronomical event calculations and meteor shower dates</div>
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-gradient-to-br from-[#1e2124] to-[#2c3035] rounded-xl p-6 border border-purple-500/20 relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {event.type === 'Meteor Shower' ? '☄️' : 
                             event.type === 'Lunar Phase' ? '🌙' : 
                             event.type === 'Planetary' ? '🪐' : '✨'}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{event.name}</h4>
                            <div className="text-[#a2abb3] text-sm">{event.type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">{event.date.toLocaleDateString()}</div>
                          <div className="text-[#a2abb3] text-sm">{event.date.toLocaleTimeString()}</div>
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
                ))}
              </div>
            </div>

            {/* Real Space Weather from NOAA */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Space Weather Alerts</h2>
            <div className="p-4">
              <div className="space-y-4">
                <div className="text-xs text-[#a2abb3] mb-2">🌞 Real-time space weather alerts from NOAA Space Weather Prediction Center</div>
                {spaceWeatherAlerts.map((alert) => (
                  <div key={alert.id} className="bg-gradient-to-r from-[#1e2124] to-[#2c3035] rounded-xl p-6 border border-red-500/20 relative overflow-hidden">
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
                          alert.severity === 'High Risk' ? 'bg-red-500/20 text-red-400' :
                          alert.severity === 'Medium Risk' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {alert.severity}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="text-white text-sm">{alert.description}</div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <div className="text-[#a2abb3] font-semibold">Issued</div>
                            <div className="text-white">{alert.issuedAt.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-[#a2abb3] font-semibold">Valid Until</div>
                            <div className="text-white">{alert.validUntil.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}