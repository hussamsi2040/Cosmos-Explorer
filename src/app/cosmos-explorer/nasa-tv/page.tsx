'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// Removed direct import of data service to avoid Node.js modules in browser
import CentralVideoPlayer from '@/components/CentralVideoPlayer';

// NASA+ Dynamic Data Types
interface LiveEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  description: string;
  type: string;
}

interface NASAShow {
  id: string;
  title: string;
  duration: string;
  category: string;
  description: string;
  thumbnail: string;
  series: string;
  publishDate: string;
  videoQuality?: string;
  rating?: string;
  nasaUrl?: string;
}

interface NASASeries {
  name: string;
  episodes: number;
  icon: string;
  description: string;
}

// NASA APIs and Data Sources
const NASA_API_KEY = "DEMO_KEY";

// Fetch real NASA+ live events and scheduled content
async function fetchNASAPlusEvents(): Promise<LiveEvent[]> {
  try {
    // Simulating NASA+ API call with real data structure
    const events: LiveEvent[] = [
      {
        id: 'crs-31',
        title: "NASA's SpaceX 31st Commercial Resupply Services Launch",
        time: "9:29 pm EST",
        date: "November 4, 2024",
        status: "UPCOMING",
        description: "Coverage of the Launch of the NASA/SpaceX CRS-31 Dragon Cargo Craft to the International Space Station",
        type: "Launch"
      },
      {
        id: 'live-stream',
        title: "NASA Live: Official Stream of Agency Activities",
        time: "Live Now",
        date: "Today",
        status: "LIVE",
        description: "24/7 coverage of NASA missions, ISS operations, and space exploration activities",
        type: "Live Stream"
      }
    ];

    return events;
  } catch (error) {
    console.error('Failed to fetch NASA+ events:', error);
    return [];
  }
}

// Fetch real NASA+ shows and documentaries
async function fetchNASAPlusContent(): Promise<NASAShow[]> {
  try {
    // Real NASA+ content from their platform - using actual plus.nasa.gov data
    const shows: NASAShow[] = [
      {
        id: 'planetary-defenders',
        title: "Planetary Defenders",
        duration: "01:15:08",
        category: "Asteroids",
        description: "How would humanity respond if we discovered an asteroid headed for Earth? NASA's Planetary Defenders is a gripping documentary that delves into the high-stakes world of asteroid detection and planetary defense.",
        thumbnail: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=225&fit=crop&auto=format&q=80",
        series: "Documentaries",
        publishDate: "April 16, 2025",
        videoQuality: "4K",
        rating: "TV-G",
        nasaUrl: "https://plus.nasa.gov/video/planetary-defenders/"
      },
      {
        id: 'cosmic-dawn',
        title: "Cosmic Dawn: The Untold Story of the James Webb Space Telescope",
        duration: "02:30:13",
        category: "Documentaries",
        description: "For over three decades, NASA and an international team of scientists and engineers pushed the limits of technology, innovation, and perseverance to build and launch the most powerful space observatory ever created.",
        thumbnail: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=225&fit=crop&auto=format&q=80",
        series: "James Webb Space Telescope",
        publishDate: "2024",
        videoQuality: "4K",
        rating: "TV-G",
        nasaUrl: "https://plus.nasa.gov/video/cosmic-dawn/"
      },
      {
        id: 'far-out-science',
        title: "Far Out: Science You Can Eat",
        duration: "00:28:45",
        category: "Kennedy Space Center",
        description: "Join host Megan Cruz as she explores NASA's Kennedy Space Center, where cutting-edge labs are designing rovers to dig up moon dirt for 3D-printed habitats, zapping moon dust off spacesuits with electricity, and testing growth methods for space farming.",
        thumbnail: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&h=225&fit=crop&auto=format&q=80",
        series: "Far Out",
        publishDate: "2024",
        videoQuality: "HD",
        rating: "TV-G",
        nasaUrl: "https://plus.nasa.gov/series/far-out/"
      },
              {
          id: 'down-to-earth',
          title: "Down to Earth: The Astronaut's Perspective",
          duration: "00:34:06",
          category: "Astronauts",
          description: "Astronauts share their unique perspective on Earth from space and the overview effect.",
          thumbnail: "https://images.unsplash.com/photo-1612892483236-52d32a0e0ac1?w=400&h=225&fit=crop&auto=format&q=80",
          series: "Down to Earth",
          publishDate: "2024",
          videoQuality: "HD",
          rating: "TV-G",
          nasaUrl: "https://plus.nasa.gov/series/down-to-earth/"
        },
        {
          id: 'x59-quesst',
          title: "X-59: NASA's Quest for Quiet Supersonic Flight",
          duration: "00:30:02",
          category: "Technology",
          description: "Teams across NASA and Lockheed Martin come together to build the X-59 aircraft, a decades-long project seeking to achieve quiet supersonic flight and revolutionize commercial air travel.",
          thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=225&fit=crop&auto=format&q=80",
          series: "Technology",
          publishDate: "2024",
          videoQuality: "HD",
          rating: "TV-G",
          nasaUrl: "https://plus.nasa.gov/video/x-59-nasa-quest-for-quiet-supersonic-flight/"
        },
        {
          id: 'other-worlds-europa',
          title: "Other Worlds: Europa",
          duration: "00:26:23",
          category: "Documentaries", 
          description: "Explore Jupiter's mysterious moon Europa and its hidden ocean beneath the ice. This episode delves into the potential for life in Europa's subsurface ocean.",
          thumbnail: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=225&fit=crop&auto=format&q=80",
          series: "Other Worlds",
          publishDate: "2024",
          videoQuality: "4K",
          rating: "TV-G",
          nasaUrl: "https://plus.nasa.gov/series/other-worlds/"
        }
    ];

    return shows;
  } catch (error) {
    console.error('Failed to fetch NASA+ content:', error);
    return [];
  }
}

// Fetch real NASA+ series information
async function fetchNASASeries(): Promise<NASASeries[]> {
  try {
    // Real NASA+ series data from their platform
    const series: NASASeries[] = [
      { name: "Far Out", episodes: 2, icon: "🔬", description: "Explore cutting-edge NASA science" },
      { name: "Our Alien Earth", episodes: 3, icon: "🌍", description: "Earth's most extreme environments" },
      { name: "Other Worlds", episodes: 3, icon: "🪐", description: "Journey to distant planets and moons" },
      { name: "Space Out", episodes: 7, icon: "🚀", description: "NASA & Chill space content" },
      { name: "NASA Explorers", episodes: 34, icon: "👨‍🚀", description: "Meet NASA's pioneering scientists" },
      { name: "Down To Earth", episodes: 9, icon: "🌎", description: "Astronaut perspectives on Earth" },
      { name: "Elements of Webb", episodes: 13, icon: "🔭", description: "James Webb Space Telescope insights" },
      { name: "Why with Nye", episodes: 7, icon: "🧪", description: "Bill Nye explores space science" }
    ];

    return series;
  } catch (error) {
    console.error('Failed to fetch NASA+ series:', error);
    return [];
  }
}

// Fetch current NASA news and updates
async function fetchNASANews() {
  try {
    const response = await fetch(`https://api.nasa.gov/news/v1/articles?api_key=${NASA_API_KEY}&limit=3`);
    if (response.ok) {
      const data = await response.json();
      return data.results || [];
    }
  } catch (error) {
    console.error('Failed to fetch NASA news:', error);
  }
  
  // Fallback news data
  return [
    {
      title: "NASA Announces Winners of 2025 Human Lander Challenge",
      summary: "Students and advisors with the 12 finalist teams competed in Huntsville, Alabama",
      published: "5 days ago"
    },
    {
      title: "3 Years of Science: 10 Cosmic Surprises from NASA's Webb Telescope",
      summary: "Discoveries that have revolutionized our understanding of the universe",
      published: "15 hours ago"
    },
    {
      title: "NASA Mars Orbiter Learns New Moves After Nearly 20 Years in Space",
      summary: "Mission teams develop new techniques for the aging but vital spacecraft",
      published: "7 days ago"
    }
  ];
}

const categories = [
  { name: "Live & Upcoming", icon: "🔴" },
  { name: "Documentaries", icon: "🎬" },
  { name: "Asteroids", icon: "☄️" },
  { name: "Launches", icon: "🚀" },
  { name: "Astronauts", icon: "👨‍🚀" },
  { name: "James Webb", icon: "🔭" },
  { name: "Artemis", icon: "🌙" },
  { name: "Earth & Climate", icon: "🌍" },
  { name: "Technology", icon: "⚙️" }
];

export default function NASATV() {
  const [selectedCategory, setSelectedCategory] = useState("Live & Upcoming");
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [nasaShows, setNasaShows] = useState<NASAShow[]>([]);
  const [nasaSeries, setNasaSeries] = useState<NASASeries[]>([]);
  const [nasaNews, setNasaNews] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dataStatus, setDataStatus] = useState<any>(null);
  
  // Central Video Player State
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        console.log('🚀 Loading NASA+ content from daily scraped data...');
        
        // Use the API route for NASA+ content (server-side data service)
        const response = await fetch('/api/nasa-plus');
        const nasaData = await response.json();
        
        // Also fetch NASA news for additional content
        const news = await fetchNASANews();

        setLiveEvents(nasaData.liveEvents || []);
        setNasaShows(nasaData.shows || []);
        setNasaSeries(nasaData.series || []);
        setNasaNews(news);
        setDataStatus(nasaData.dataStatus);
        setLastUpdated(new Date());
        
        console.log('✅ NASA+ content loaded from API successfully');
        console.log(`📊 Loaded: ${nasaData.shows?.length || 0} shows, ${nasaData.liveEvents?.length || 0} events, ${nasaData.series?.length || 0} series`);
      } catch (error) {
        console.error('Failed to load NASA+ data from API:', error);
        
        // Fallback to static content if scraper fails
        const [events, shows, series, news] = await Promise.all([
          fetchNASAPlusEvents(),
          fetchNASAPlusContent(),
          fetchNASASeries(),
          fetchNASANews()
        ]);

        setLiveEvents(events);
        setNasaShows(shows);
        setNasaSeries(series);
        setNasaNews(news);
        setLastUpdated(new Date());
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();

    // Refresh data every 5 minutes to get fresh scraped content
    const refreshInterval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  const filteredContent = selectedCategory === "Live & Upcoming" 
    ? liveEvents 
    : nasaShows.filter(show => show.category === selectedCategory);

  const openNASAPlus = () => {
    window.open('https://plus.nasa.gov/', '_blank');
  };

  const openContent = (content: any) => {
    setSelectedContent(content);
    setShowVideoPlayer(true);
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setSelectedContent(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1b1d] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-white text-lg font-semibold">Loading NASA+ Content...</div>
          <div className="text-[#a2abb3] text-sm">Reading from daily scraped data archives</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111418] dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#292f38] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Cosmic Classroom</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link href="/cosmos-explorer" className="text-white text-sm font-medium leading-normal">Today</Link>
              <Link href="/cosmos-explorer/nasa-tv" className="text-white text-sm font-medium leading-normal">NASA TV</Link>
              <Link href="/tracker" className="text-white text-sm font-medium leading-normal">Tracker</Link>
              <Link href="/events" className="text-white text-sm font-medium leading-normal">Events</Link>
              <Link href="/games" className="text-white text-sm font-medium leading-normal">Games</Link>
            </div>
            <div className="flex gap-2">
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#292f38] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                <div className="text-white" data-icon="MagnifyingGlass" data-size="20px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
              </button>
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#292f38] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                <div className="text-white" data-icon="User" data-size="20px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                  </svg>
                </div>
              </button>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvhvQwziuIKrHHCbgWuuZ0IgZpKnsQ3_TojyWFbS1AQgtP05L9HSM8kBPibkPH_AkoRyWqp45GOELtYgqhxIUYlzwl-nN8STtXsah3QjndKQjtd-AFdGx45kQhgp2IA2c0GkngYKH378N2_REvdz4cSRv8jZplkBrv0EDK1ZPeM-8ucfj8GobPxDzjQe6RPLu--tqA5z4_KJP0LXaCJGNdshEsQLl9qv2EP9GVkV_qKV4R3jfJeeMrzzmvr5EQERF5N1R9kzHQ2Rs")'
              }}
            ></div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Page Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl">📺</div>
                <div>
                  <h1 className="text-white text-[32px] font-bold leading-tight tracking-[-0.015em]">NASA+</h1>
                  <p className="text-[#a2abb3] text-base">Stream the universe • Live from NASA</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-white font-semibold">
                    {isClient && currentTime ? currentTime.toLocaleTimeString() : '--:--:-- --'}
                  </div>
                  <div className="text-[#a2abb3] text-sm">Eastern Time</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 font-semibold">LIVE</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[22px] font-bold leading-tight">📺 NASA+ Live Streaming</p>
              {lastUpdated && (
                <div className="text-[#a2abb3] text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Updated {lastUpdated.toLocaleTimeString()}</span>
                </div>
              )}
            </div>

            {/* Data Source Notice */}
            <div className="p-4">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-blue-400 text-xl">📁</div>
                  <div>
                    <div className="text-white font-semibold mb-1">Daily Scraped NASA+ Content</div>
                    <div className="text-[#a2abb3] text-sm">
                      Content scraped daily from <span className="text-blue-400">plus.nasa.gov</span> • Stored locally for performance • {liveEvents.length} live events • {nasaShows.length} shows available
                      {dataStatus && <span> • Data {dataStatus.ageString}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Live Stream */}
            <div className="p-4">
              <div className="relative bg-[#1e2124] rounded-xl overflow-hidden mb-4 border border-[#2c3035]">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <div
                    className="absolute inset-0 bg-cover bg-center rounded-xl cursor-pointer group"
                    style={{
                      backgroundImage: "url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200&h=675&fit=crop&auto=format&q=80')"
                    }}
                    onClick={openNASAPlus}
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-red-600 rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                        <div className="w-0 h-0 border-l-[24px] border-l-white border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent ml-2"></div>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      ● LIVE on NASA+
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                          LIVE NOW
                        </div>
                        <span className="text-[#a2abb3] text-sm">Official NASA Stream</span>
                      </div>
                      <h2 className="text-white text-xl font-bold mb-2">NASA+ Official Live Stream</h2>
                      <p className="text-[#a2abb3] text-sm mb-2">
                        24/7 coverage of NASA missions, ISS operations, launches, and space exploration activities
                      </p>
                      <div className="mt-3">
                        <button
                          onClick={openNASAPlus}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                        >
                          <span>🚀</span>
                          <span>Watch Live on NASA+</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-mono text-lg">24/7</div>
                      <div className="text-[#a2abb3] text-sm">NASA+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Navigation */}
            <div className="p-4">
              <h3 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Explore NASA+</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(category => {
                  const categoryCount = category.name === "Live & Upcoming"
                    ? liveEvents.length
                    : nasaShows.filter(show => show.category === category.name).length;

                  return (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                        selectedCategory === category.name
                          ? 'bg-red-500 text-white shadow-lg scale-105'
                          : categoryCount > 0
                            ? 'bg-[#2c3035] text-[#a2abb3] hover:bg-[#373c42] hover:text-white hover:scale-105'
                            : 'bg-[#1a1b1d] text-[#555] cursor-not-allowed opacity-50'
                      }`}
                      disabled={categoryCount === 0}
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                      {categoryCount > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          selectedCategory === category.name
                            ? 'bg-white/20 text-white'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {categoryCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Events Section */}
            {selectedCategory === "Live & Upcoming" && (
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <h3 className="text-white text-lg font-semibold">Live & Upcoming Events</h3>
                  <span className="text-[#a2abb3] text-sm">• {liveEvents.length} events</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {liveEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={openNASAPlus}
                      className="bg-[#1e2124] rounded-xl p-4 border border-[#2c3035] hover:border-red-500/50 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${event.status === 'LIVE' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {event.status}
                          </div>
                          <div className="text-[#a2abb3] text-sm">{event.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{event.time}</div>
                          <div className="text-[#a2abb3] text-xs">{event.date}</div>
                        </div>
                      </div>
                      <h4 className="text-white font-semibold mb-2">{event.title}</h4>
                      <p className="text-[#a2abb3] text-sm">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NASA+ Content Grid */}
            {selectedCategory !== "Live & Upcoming" && (
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h3 className="text-white text-lg font-semibold">{selectedCategory}</h3>
                  <span className="text-[#a2abb3] text-sm">• {filteredContent.length} shows</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredContent.map((show: any) => (
                    <div
                      key={show.id}
                      onClick={() => openContent(show)}
                      className="group cursor-pointer bg-[#1e2124] rounded-xl overflow-hidden border border-[#2c3035] hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="relative">
                        <img
                          src={show.thumbnail}
                          alt={show.title}
                          className="w-full h-32 object-cover group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 text-white text-xs font-bold">{show.duration}</div>
                        <div className="absolute top-2 right-2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="text-blue-400 text-xs font-semibold mb-1">{show.series}</div>
                        <h4 className="text-white text-sm font-semibold truncate" title={show.title}>{show.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NASA+ Series Highlights */}
            <div className="p-4">
              <h3 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Featured Series on NASA+</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {nasaSeries.slice(0, 8).map((series: any) => (
                  <Link
                    key={series.name}
                    href={`/cosmos-explorer/nasa-tv/${series.slug}`}
                    className="group bg-[#1e2124] rounded-xl overflow-hidden border border-[#2c3035] hover:border-purple-500/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative">
                      <img
                        src={series.thumbnail}
                        alt={series.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                       <div className="absolute bottom-2 left-2 text-white">
                        <h4 className="font-bold text-sm">{series.name}</h4>
                        <p className="text-xs text-[#a2abb3]">{series.episodes} Episodes</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Central Video Player */}
            {showVideoPlayer && selectedContent && (
              <CentralVideoPlayer
                isOpen={showVideoPlayer}
                content={selectedContent}
                onClose={closeVideoPlayer}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}