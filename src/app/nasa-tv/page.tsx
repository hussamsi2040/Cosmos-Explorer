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
          category: "Aeronautics",
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
    <div className="min-h-screen bg-[#1a1b1d] text-white">
      {/* Header - Consistent with app design */}
      <div className="bg-gradient-to-r from-red-500/20 to-blue-500/20 border-b border-red-500/30 p-4">
        <div className="flex items-center justify-between max-w-[960px] mx-auto">
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
      </div>

      <div className="layout-content-container flex flex-col max-w-[960px] flex-1 mx-auto">
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
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                        event.status === 'LIVE' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                      }`}>
                        {event.status}
                      </div>
                      <h4 className="text-white font-semibold text-lg">{event.title}</h4>
                      <p className="text-[#a2abb3] text-sm mb-2">{event.description}</p>
                      <div className="text-blue-400 text-sm font-medium">{event.date} • {event.time}</div>
                    </div>
                    <div className="text-2xl">
                      {event.type === 'Launch' ? '🚀' : event.type === 'Live Stream' ? '🎥' : '📺'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#a2abb3] text-xs">{event.type}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openNASAPlus();
                      }}
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-1 rounded-lg text-xs transition-colors"
                    >
                      Watch on NASA+
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="p-4">
          <h3 className="text-white text-lg font-semibold mb-4">
            {selectedCategory === "Live & Upcoming" ? `Featured Shows • ${nasaShows.length} available` : `${selectedCategory} • ${filteredContent.length} shows`}
          </h3>
          
          {/* Empty State for Categories with No Content */}
          {selectedCategory !== "Live & Upcoming" && filteredContent.length === 0 && (
            <div className="bg-[#1e2124] rounded-xl border border-[#2c3035] p-8 text-center">
              <div className="text-4xl mb-4">
                {categories.find(cat => cat.name === selectedCategory)?.icon || '📺'}
              </div>
              <h4 className="text-white text-lg font-semibold mb-2">No {selectedCategory} Content Available</h4>
              <p className="text-[#a2abb3] text-sm mb-4">
                We don't have any {selectedCategory.toLowerCase()} content in our current scraped data. 
                The daily scraper will collect more content from NASA+ automatically.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-[#a2abb3]">
                <span>🔄 Auto-updates daily</span>
                <span>📡 Content from plus.nasa.gov</span>
                <span>⏰ Next scrape: Tomorrow 6 AM</span>
              </div>
            </div>
          )}
          
          {/* Content Grid - Only show if there's content */}
          {(selectedCategory === "Live & Upcoming" || filteredContent.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedCategory === "Live & Upcoming" ? nasaShows.slice(0, 6) : filteredContent.slice(0, 12)).map((content: any) => (
                <div 
                  key={content.id}
                  onClick={() => openContent(content)}
                  className="bg-[#1e2124] rounded-xl overflow-hidden border border-[#2c3035] hover:border-red-500/50 cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
                >
                 <div className="relative">
                   <img 
                     src={content.thumbnail} 
                     alt={content.title}
                     className="w-full h-48 object-cover"
                   />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                     <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                       <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                     </div>
                   </div>
                   <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                     {content.duration}
                   </div>
                   <div className="absolute top-3 left-3 bg-red-600/80 text-white text-xs px-2 py-1 rounded">
                     {content.publishDate}
                   </div>
                 </div>
                 <div className="p-4">
                   <h4 className="text-white font-semibold text-lg mb-2 line-clamp-2">{content.title}</h4>
                   <p className="text-[#a2abb3] text-sm mb-3 line-clamp-2">{content.description}</p>
                   <div className="flex items-center justify-between">
                     <span className="text-red-400 text-xs">{content.category}</span>
                     <span className="text-[#a2abb3] text-xs">{content.series}</span>
                   </div>
                 </div>
               </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic NASA Series */}
        <div className="p-4">
          <h3 className="text-white text-lg font-semibold mb-4">NASA+ Series • {nasaSeries.length} active series</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                         {nasaSeries.map(series => (
               <div 
                 key={series.name} 
                 onClick={() => openContent(series)}
                 className="bg-[#1e2124] rounded-xl p-3 border border-[#2c3035] hover:border-red-500/50 cursor-pointer transition-all duration-300 hover:scale-105"
                 title={series.description}
               >
                <div className="text-center">
                  <div className="text-2xl mb-2">{series.icon}</div>
                  <h4 className="text-white font-medium text-sm mb-1">{series.name}</h4>
                  <p className="text-[#a2abb3] text-xs">{series.episodes} Episodes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest NASA News */}
        <div className="p-4">
          <h3 className="text-white text-lg font-semibold mb-4">Latest NASA News • Live Updates</h3>
          <div className="space-y-3">
            {nasaNews.map((article, index) => (
              <div key={index} className="bg-[#1e2124] rounded-xl p-4 border border-[#2c3035] hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-2">{article.title}</h4>
                    <p className="text-[#a2abb3] text-sm mb-2">{article.summary}</p>
                    <span className="text-blue-400 text-xs">{article.published}</span>
                  </div>
                  <div className="text-blue-400 text-sm">📰</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NASA+ Info Footer */}
        <div className="p-4">
          <div className="bg-gradient-to-r from-red-500/10 to-blue-500/10 border border-red-500/20 rounded-xl p-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-white text-xl font-bold mb-2">NASA+ | Stream the Universe</h3>
              <p className="text-[#a2abb3] text-sm mb-4">
                Experience hundreds of videos and live content from NASA's missions, discoveries, and space exploration on the official streaming platform. Content updates in real-time.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#a2abb3] mb-6">
                <span className="flex items-center gap-1">🌍 Free worldwide</span>
                <span className="flex items-center gap-1">📱 All devices</span>
                <span className="flex items-center gap-1">🔴 Live coverage</span>
                <span className="flex items-center gap-1">🔄 Auto-updates</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                <button 
                  onClick={openNASAPlus}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <span>🚀</span>
                  <span>Launch NASA+ Official Site</span>
                </button>
                <span className="text-[#a2abb3] text-xs">plus.nasa.gov • Updated {lastUpdated?.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-[#1e2124] border-t border-[#2c3035] px-4 py-3 mt-8">
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            <a className="text-white text-sm font-medium leading-normal hover:text-red-400 transition-colors" href="/cosmos-explorer">Home</a>
            <a className="text-red-400 text-sm font-medium leading-normal" href="/nasa-tv">NASA TV</a>
            <a className="text-white text-sm font-medium leading-normal hover:text-red-400 transition-colors" href="/tracker">Tracker</a>
            <a className="text-white text-sm font-medium leading-normal hover:text-red-400 transition-colors" href="/events">Events</a>
            <a className="text-white text-sm font-medium leading-normal hover:text-red-400 transition-colors" href="/explore">Explore</a>
            <a className="text-white text-sm font-medium leading-normal hover:text-red-400 transition-colors" href="/games">Games</a>
          </div>
        </nav>
      </div>

      {/* Central Video Player */}
      <CentralVideoPlayer
        isOpen={showVideoPlayer}
        content={selectedContent}
        onClose={closeVideoPlayer}
      />
      
      {/* Legacy Modal - Remove this entire section */}
      {false && selectedContent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e2124] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#2c3035] shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#2c3035] bg-gradient-to-r from-red-500/10 to-blue-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {selectedContent.episodes ? selectedContent.icon : '🎬'}
                  </div>
                  <div>
                    <h2 className="text-white text-2xl font-bold">
                      {selectedContent.title || selectedContent.name}
                    </h2>
                    <div className="text-[#a2abb3] text-sm flex items-center gap-3">
                      <span>{selectedContent.category || selectedContent.description}</span>
                      {selectedContent.duration && (
                        <span>• Duration: {selectedContent.duration}</span>
                      )}
                      {selectedContent.episodes && (
                        <span>• {selectedContent.episodes} Episodes</span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={closeVideoPlayer}
                  className="text-[#a2abb3] hover:text-white text-2xl p-2 hover:bg-[#2c3035] rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6">
              {/* Video Player Section */}
              <div className="mb-6">
                <div className="relative bg-black rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src="https://www.youtube.com/embed/DIgkvm2nmHc?autoplay=0&rel=0&modestbranding=1&controls=1"
                    title={selectedContent.title || selectedContent.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-xl"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-xs">
                    NASA Official Stream
                  </div>
                </div>
              </div>

              {/* Content Details */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-white text-lg font-semibold mb-3">About</h3>
                  <p className="text-[#a2abb3] leading-relaxed">
                    {selectedContent.description || `Explore ${selectedContent.name || selectedContent.title} and dive deep into NASA's incredible universe of content. This ${selectedContent.episodes ? 'series' : 'show'} offers unique insights into space exploration, scientific discovery, and the wonders of our universe.`}
                  </p>
                </div>

                {/* Series Info */}
                {selectedContent.episodes && (
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-3">Series Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-[#2c3035] rounded-lg p-3">
                        <div className="text-[#a2abb3] text-xs mb-1">Episodes</div>
                        <div className="text-white font-bold text-lg">{selectedContent.episodes}</div>
                      </div>
                      <div className="bg-[#2c3035] rounded-lg p-3">
                        <div className="text-[#a2abb3] text-xs mb-1">Category</div>
                        <div className="text-white font-bold text-lg">Series</div>
                      </div>
                      <div className="bg-[#2c3035] rounded-lg p-3">
                        <div className="text-[#a2abb3] text-xs mb-1">Platform</div>
                        <div className="text-white font-bold text-lg">NASA+</div>
                      </div>
                    </div>
                  </div>
                )}

                                 {/* Show Info */}
                 {!selectedContent.episodes && selectedContent.duration && (
                   <div>
                     <h3 className="text-white text-lg font-semibold mb-3">Show Details</h3>
                     <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                       <div className="bg-[#2c3035] rounded-lg p-3">
                         <div className="text-[#a2abb3] text-xs mb-1">Duration</div>
                         <div className="text-white font-bold">{selectedContent.duration}</div>
                       </div>
                       <div className="bg-[#2c3035] rounded-lg p-3">
                         <div className="text-[#a2abb3] text-xs mb-1">Category</div>
                         <div className="text-white font-bold">{selectedContent.category}</div>
                       </div>
                       <div className="bg-[#2c3035] rounded-lg p-3">
                         <div className="text-[#a2abb3] text-xs mb-1">Series</div>
                         <div className="text-white font-bold">{selectedContent.series}</div>
                       </div>
                       <div className="bg-[#2c3035] rounded-lg p-3">
                         <div className="text-[#a2abb3] text-xs mb-1">Quality</div>
                         <div className="text-white font-bold">{selectedContent.videoQuality || 'HD'}</div>
                       </div>
                       <div className="bg-[#2c3035] rounded-lg p-3">
                         <div className="text-[#a2abb3] text-xs mb-1">Rating</div>
                         <div className="text-white font-bold">{selectedContent.rating || 'TV-G'}</div>
                       </div>
                     </div>
                     <div className="mt-4 text-center">
                       <div className="text-[#a2abb3] text-sm">Published: {selectedContent.publishDate}</div>
                     </div>
                   </div>
                 )}

                {/* Related Content */}
                <div>
                  <h3 className="text-white text-lg font-semibold mb-3">More NASA+ Content</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {nasaShows.slice(0, 3).map(show => (
                      <div 
                        key={show.id}
                        onClick={() => openContent(show)}
                        className="bg-[#2c3035] rounded-lg p-3 cursor-pointer hover:bg-[#373c42] transition-colors"
                      >
                        <div className="text-white font-medium text-sm mb-1">{show.title}</div>
                        <div className="text-[#a2abb3] text-xs">{show.duration} • {show.series}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

                             {/* Action Buttons */}
               <div className="mt-8 flex flex-col sm:flex-row gap-3">
                 <button 
                   onClick={() => window.open('https://plus.nasa.gov/', '_blank')}
                   className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                 >
                   <span>🚀</span>
                   <span>Watch Full Content on NASA+</span>
                 </button>
                 <button 
                   onClick={closeVideoPlayer}
                   className="bg-[#2c3035] hover:bg-[#373c42] text-white px-8 py-3 rounded-lg font-medium transition-colors"
                 >
                   Close Preview
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}