'use client';

import { useState, useEffect } from 'react';

// NASA+ Live Events and Shows Data
const liveEvents = [
  {
    id: 1,
    title: "Progress 92 Cargo Ship Launch",
    time: "Today 3:10 pm",
    status: "LIVE",
    description: "Watch the Progress 92 cargo ship launch to the International Space Station",
    videoId: "21X5lGlDOfg", // NASA Live
    type: "Launch",
    featured: true
  },
  {
    id: 2,
    title: "Progress 92 Cargo Ship Docking",
    time: "July 5, 2025 4:45 pm",
    status: "UPCOMING",
    description: "Live coverage of Progress 92 docking with the ISS",
    videoId: "21X5lGlDOfg", // NASA Live
    type: "Docking",
    featured: false
  }
];

const nasaShows = [
  {
    id: 1,
    title: "Cosmic Dawn: The Untold Story of the James Webb Space Telescope",
    duration: "02:30:13",
    category: "Documentaries",
    description: "Explore the incredible journey of the James Webb Space Telescope",
    thumbnail: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=225&fit=crop&auto=format&q=80",
    videoId: "21X5lGlDOfg",
    series: "James Webb Space Telescope"
  },
  {
    id: 2,
    title: "Far Out: Science You Can Eat",
    duration: "00:28:45",
    category: "Kennedy Space Center",
    description: "Discover how NASA scientists are growing food in space",
    thumbnail: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&h=225&fit=crop&auto=format&q=80",
    videoId: "21X5lGlDOfg",
    series: "Far Out"
  },
  {
    id: 3,
    title: "Down to Earth: The Astronaut's Perspective",
    duration: "00:34:06",
    category: "Astronauts",
    description: "Astronauts share their unique perspective on Earth from space",
    thumbnail: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=225&fit=crop&auto=format&q=80",
    videoId: "21X5lGlDOfg",
    series: "Down to Earth"
  },
  {
    id: 4,
    title: "Artemis I: The Documentary",
    duration: "02:30:13",
    category: "Artemis",
    description: "The complete story of NASA's return to the Moon",
    thumbnail: "https://images.unsplash.com/photo-1612892483236-52d32a0e0ac1?w=400&h=225&fit=crop&auto=format&q=80",
    videoId: "21X5lGlDOfg",
    series: "Artemis"
  },
  {
    id: 5,
    title: "X-59: NASA's Quest for Quiet Supersonic Flight",
    duration: "00:30:02",
    category: "Aeronautics",
    description: "Revolutionary aircraft seeking to achieve quiet supersonic flight",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=225&fit=crop&auto=format&q=80",
    videoId: "21X5lGlDOfg",
    series: "Technology"
  },
  {
    id: 6,
    title: "Other Worlds: Europa",
    duration: "00:26:23",
    category: "Documentaries",
    description: "Explore Jupiter's mysterious moon Europa and its hidden ocean",
    thumbnail: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=225&fit=crop&auto=format&q=80",
    videoId: "21X5lGlDOfg",
    series: "Other Worlds"
  }
];

const categories = [
  { name: "Live & Upcoming", icon: "🔴" },
  { name: "Documentaries", icon: "🎬" },
  { name: "Launches", icon: "🚀" },
  { name: "Astronauts", icon: "👨‍🚀" },
  { name: "James Webb", icon: "🔭" },
  { name: "Artemis", icon: "🌙" },
  { name: "Earth & Climate", icon: "🌍" },
  { name: "Technology", icon: "⚙️" }
];

export default function NASATV() {
  const [selectedCategory, setSelectedCategory] = useState("Live & Upcoming");
  const [selectedVideo, setSelectedVideo] = useState(liveEvents[0]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredContent = selectedCategory === "Live & Upcoming" 
    ? liveEvents 
    : nasaShows.filter(show => show.category === selectedCategory);

  const playVideo = (content: any) => {
    setSelectedVideo(content);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-red-600/20 border-b border-blue-500/30 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-3xl">📺</div>
            <div>
              <h1 className="text-3xl font-bold text-white">NASA+</h1>
              <p className="text-blue-300 text-sm">Stream the universe at your fingertips</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white font-semibold">{currentTime.toLocaleTimeString()}</div>
              <div className="text-blue-300 text-sm">Eastern Time</div>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 font-semibold">LIVE</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Featured Video Player */}
        <div className="mb-8">
          <div className="relative bg-black rounded-xl overflow-hidden mb-4">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
            
            {/* Video Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedVideo.status === 'LIVE' ? 'bg-red-600 text-white' : 
                      selectedVideo.status === 'UPCOMING' ? 'bg-yellow-600 text-white' : 
                      'bg-blue-600 text-white'
                    }`}>
                      {selectedVideo.status || 'ON DEMAND'}
                    </div>
                                         <span className="text-blue-300 text-sm">{(selectedVideo as any).type || (selectedVideo as any).category}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedVideo.title}</h2>
                  <p className="text-gray-300 text-sm mb-2">{selectedVideo.description}</p>
                  {selectedVideo.time && (
                    <div className="text-blue-400 text-sm font-medium">{selectedVideo.time}</div>
                  )}
                </div>
                                 <div className="text-right">
                   {(selectedVideo as any).duration && (
                     <div className="text-white font-mono text-lg">{(selectedVideo as any).duration}</div>
                   )}
                   <div className="text-gray-400 text-sm">NASA+</div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="mb-6">
          <h3 className="text-white text-xl font-bold mb-4">Explore NASA+</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.name
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Events Section */}
        {selectedCategory === "Live & Upcoming" && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h3 className="text-white text-xl font-bold">Live & Upcoming Events</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveEvents.map(event => (
                <div 
                  key={event.id}
                  onClick={() => playVideo(event)}
                  className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                        event.status === 'LIVE' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'
                      }`}>
                        {event.status}
                      </div>
                      <h4 className="text-white font-semibold text-lg">{event.title}</h4>
                      <p className="text-gray-400 text-sm mb-2">{event.description}</p>
                      <div className="text-blue-400 text-sm font-medium">{event.time}</div>
                    </div>
                    <div className="text-2xl">
                      {event.type === 'Launch' ? '🚀' : '🛰️'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{event.type}</span>
                    <button className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1 rounded-lg text-xs transition-colors">
                      Watch Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="mb-8">
          <h3 className="text-white text-xl font-bold mb-4">
            {selectedCategory === "Live & Upcoming" ? "Featured Shows" : selectedCategory}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedCategory === "Live & Upcoming" ? nasaShows.slice(0, 6) : filteredContent).map((content: any) => (
              <div 
                key={content.id}
                onClick={() => playVideo(content)}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
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
                </div>
                <div className="p-4">
                  <h4 className="text-white font-semibold text-lg mb-2 line-clamp-2">{content.title}</h4>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{content.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 text-xs">{content.category}</span>
                    <span className="text-gray-500 text-xs">{content.series}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Series Section */}
        <div className="mb-8">
          <h3 className="text-white text-xl font-bold mb-4">Popular NASA Series</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: "Far Out", episodes: 2, icon: "🔬" },
              { name: "Our Alien Earth", episodes: 3, icon: "🌍" },
              { name: "Other Worlds", episodes: 3, icon: "🪐" },
              { name: "Space Out", episodes: 7, icon: "🚀" },
              { name: "NASA Explorers", episodes: 34, icon: "👨‍🚀" },
              { name: "Down To Earth", episodes: 9, icon: "🌎" },
              { name: "Elements of Webb", episodes: 13, icon: "🔭" },
              { name: "Why with Nye", episodes: 7, icon: "🧪" }
            ].map(series => (
              <div key={series.name} className="bg-gray-900 rounded-lg p-3 border border-gray-700 hover:border-blue-500/50 cursor-pointer transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="text-2xl mb-2">{series.icon}</div>
                  <h4 className="text-white font-medium text-sm mb-1">{series.name}</h4>
                  <p className="text-gray-400 text-xs">{series.episodes} Episodes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NASA+ Info Footer */}
        <div className="bg-gradient-to-r from-blue-600/10 to-red-600/10 border border-blue-500/20 rounded-xl p-6">
          <div className="text-center">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-white text-xl font-bold mb-2">NASA+ | Stream the Universe</h3>
            <p className="text-gray-300 text-sm mb-4">
              Explore hundreds of videos and live content from NASA's missions, discoveries, and the wonders of space exploration.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <span>🌍 Free to stream worldwide</span>
              <span>📱 Available on all devices</span>
              <span>🔴 Live mission coverage</span>
              <span>🎬 On-demand documentaries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-[#1e2124] border-t border-[#2c3035] px-4 py-3 mt-8">
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer">Home</a>
          <a className="text-blue-400 text-sm font-medium leading-normal" href="/nasa-tv">NASA TV</a>
          <a className="text-white text-sm font-medium leading-normal" href="/tracker">Tracker</a>
          <a className="text-white text-sm font-medium leading-normal" href="/events">Events</a>
          <a className="text-white text-sm font-medium leading-normal" href="/explore">Explore</a>
          <a className="text-white text-sm font-medium leading-normal" href="/games">Games</a>
        </div>
      </nav>
    </div>
  );
}