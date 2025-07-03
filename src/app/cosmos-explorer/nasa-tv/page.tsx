'use client';

import { useState, useEffect } from 'react';
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
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2c3035] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Cosmos Explorer</h2>
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


            {/* Featured Live Stream */}
            <div className="p-4">
              <div className="relative bg-[#1e2124] rounded-xl overflow-hidden mb-4 border border-[#2c3035]">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full rounded-xl"
                    src="https://www.youtube.com/embed/DIgkvm2nmHc?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1"
                    title="NASA Live Stream"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse z-10">
                    ● LIVE on YouTube
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                          LIVE NOW
                        </div>
                        <span className="text-[#a2abb3] text-sm">YouTube Live Stream</span>
                      </div>
                      <h2 className="text-white text-xl font-bold mb-2">NASA Live Stream</h2>
                      <p className="text-[#a2abb3] text-sm mb-2">
                        Live coverage of NASA missions, space exploration, and agency activities
                      </p>
                      <div className="mt-3">
                        <button
                          onClick={() => window.open('https://www.youtube.com/watch?v=DIgkvm2nmHc', '_blank')}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                        >
                          <span>�</span>
                          <span>Watch on YouTube</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-mono text-lg">LIVE</div>
                      <div className="text-[#a2abb3] text-sm">YouTube</div>
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

            {/* Featured Series Grid */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                  Featured Series
                </h2>
                <div className="text-[#a2abb3] text-sm">
                  {(nasaSeries as any[]).filter(series => series.thumbnail && series.slug).length} with thumbnails
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(nasaSeries as any[]).filter(series => series.thumbnail && series.slug).map((series) => (
                  <a
                    key={series.slug}
                    href={series.url || "https://plus.nasa.gov/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block cursor-pointer"
                  >
                    <div className="relative h-0 pb-[150%] overflow-hidden rounded-lg bg-[#292f38]">
                      <img
                        src={series.thumbnail}
                        alt={series.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1541185934-01b600ea069c?w=400&h=225&fit=crop&auto=format&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h3 className="mt-2 text-white text-sm font-semibold line-clamp-2 group-hover:text-red-400 transition-colors">
                      {series.name}
                    </h3>
                  </a>
                ))}
              </div>
              {(nasaSeries as any[]).filter(series => series.thumbnail && series.slug).length === 0 && (
                <div className="text-center py-8">
                  <div className="text-[#a2abb3] text-lg mb-2">📡</div>
                  <p className="text-[#a2abb3]">Loading series thumbnails...</p>
                </div>
              )}
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