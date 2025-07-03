// NASA+ Data Service
// Reads scraped content from JSON files instead of live scraping

import fs from 'fs';
import path from 'path';

interface NASAPlusData {
  timestamp: string;
  lastUpdated: string;
  version: string;
  source: string;
  shows: any[];
  liveEvents: any[];
  series: any[];
  featuredContent: any[];
  stats: {
    totalShows: number;
    totalLiveEvents: number;
    totalSeries: number;
    scrapeDurationMs?: number;
  };
  error?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'nasa-plus-content.json');

// Fallback data in case no scraped data is available
const FALLBACK_DATA: NASAPlusData = {
  timestamp: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  version: '1.0.0',
  source: 'NASA+ Data Service (Fallback)',
  shows: [
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
      nasaUrl: "https://plus.nasa.gov/video/planetary-defenders/",
      scrapedAt: new Date().toISOString()
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
  ],
  liveEvents: [
    {
      id: 'nasa-live-stream',
      title: "NASA Live: Official Stream of Agency Activities",
      time: "Live Now",
      date: "Today",
      status: "LIVE",
      description: "24/7 coverage of NASA missions, ISS operations, launches, and space exploration activities",
      type: "Live Stream",
      scrapedAt: new Date().toISOString()
    },
    {
      id: 'crs-31',
      title: "NASA's SpaceX 31st Commercial Resupply Services Mission",
      time: "Next Launch Window",
      date: "Upcoming",
      status: "UPCOMING",
      description: "Coverage of the NASA/SpaceX CRS mission to the International Space Station",
      type: "Launch",
      scrapedAt: new Date().toISOString()
    }
  ],
  series: [
    { 
      name: "Far Out", 
      episodes: 2, 
      icon: "🔬", 
      description: "Explore cutting-edge NASA science",
      scrapedAt: new Date().toISOString()
    },
    { 
      name: "Our Alien Earth", 
      episodes: 3, 
      icon: "🌍", 
      description: "Earth's most extreme environments",
      scrapedAt: new Date().toISOString()
    },
    { 
      name: "Other Worlds", 
      episodes: 3, 
      icon: "🪐", 
      description: "Journey to distant planets and moons",
      scrapedAt: new Date().toISOString()
    },
    { 
      name: "Space Out", 
      episodes: 7, 
      icon: "🚀", 
      description: "NASA & Chill space content",
      scrapedAt: new Date().toISOString()
    },
    { 
      name: "NASA Explorers", 
      episodes: 34, 
      icon: "👨‍🚀", 
      description: "Meet NASA's pioneering scientists",
      scrapedAt: new Date().toISOString()
    },
    { 
      name: "Down To Earth", 
      episodes: 9, 
      icon: "🌎", 
      description: "Astronaut perspectives on Earth",
      scrapedAt: new Date().toISOString()
    },
    { 
      name: "Elements of Webb", 
      episodes: 13, 
      icon: "🔭", 
      description: "James Webb Space Telescope insights",
      scrapedAt: new Date().toISOString()
    },
    { 
      name: "Why with Nye", 
      episodes: 7, 
      icon: "🧪", 
      description: "Bill Nye explores space science",
      scrapedAt: new Date().toISOString()
    }
  ],
  featuredContent: [],
  stats: {
    totalShows: 6,
    totalLiveEvents: 2,
    totalSeries: 8
  }
};

// Initialize featured content from shows
FALLBACK_DATA.featuredContent = FALLBACK_DATA.shows.slice(0, 3);

/**
 * Get NASA+ content from saved JSON files
 * This replaces the live scraping approach with file-based data
 */
export async function getNASAPlusContent(): Promise<NASAPlusData> {
  try {
    console.log('📂 Reading NASA+ content from saved data...');
    
    // Check if data file exists
    if (!fs.existsSync(DATA_FILE)) {
      console.log('⚠️ No scraped data file found, using fallback data');
      console.log('💡 Run the daily scraper to generate fresh data: node scripts/daily-nasa-scraper.js');
      return FALLBACK_DATA;
    }
    
    // Read and parse the data file
    const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
    const data: NASAPlusData = JSON.parse(fileContent);
    
    // Validate data structure
    if (!data.shows || !data.liveEvents || !data.series) {
      throw new Error('Invalid data structure in saved file');
    }
    
    console.log('✅ Successfully loaded NASA+ content from file');
    console.log(`📊 Loaded: ${data.stats.totalShows} shows, ${data.stats.totalLiveEvents} events, ${data.stats.totalSeries} series`);
    console.log(`📅 Last updated: ${new Date(data.lastUpdated).toLocaleString()}`);
    
    return data;
    
  } catch (error) {
    console.error('❌ Failed to read NASA+ data from file:', error);
    console.log('🔄 Falling back to default content');
    return FALLBACK_DATA;
  }
}

/**
 * Get data file age in hours
 */
export function getDataAge(): number {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return Infinity;
    }
    
    const stats = fs.statSync(DATA_FILE);
    const ageMs = Date.now() - stats.mtime.getTime();
    return ageMs / (1000 * 60 * 60); // Convert to hours
  } catch (error) {
    return Infinity;
  }
}

/**
 * Check if data needs refresh (older than 24 hours)
 */
export function isDataStale(): boolean {
  return getDataAge() > 24;
}

/**
 * Get data freshness status
 */
export function getDataStatus(): {
  isFresh: boolean;
  age: number;
  ageString: string;
  needsRefresh: boolean;
} {
  const age = getDataAge();
  const isFresh = age < 1; // Less than 1 hour
  const needsRefresh = age > 24; // More than 24 hours
  
  let ageString: string;
  if (age === Infinity) {
    ageString = 'No data file';
  } else if (age < 1) {
    ageString = `${Math.round(age * 60)} minutes ago`;
  } else if (age < 24) {
    ageString = `${Math.round(age)} hours ago`;
  } else {
    ageString = `${Math.round(age / 24)} days ago`;
  }
  
  return {
    isFresh,
    age,
    ageString,
    needsRefresh
  };
}

/**
 * Get available archive files
 */
export function getAvailableArchives(): string[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      return [];
    }
    
    const files = fs.readdirSync(DATA_DIR);
    const archiveFiles = files
      .filter(file => file.match(/^nasa-plus-\d{4}-\d{2}-\d{2}\.json$/))
      .sort((a, b) => b.localeCompare(a)); // Newest first
    
    return archiveFiles;
  } catch (error) {
    console.error('Failed to read archive files:', error);
    return [];
  }
}

/**
 * Load data from a specific archive file
 */
export async function loadArchiveData(filename: string): Promise<NASAPlusData | null> {
  try {
    const archiveFile = path.join(DATA_DIR, filename);
    
    if (!fs.existsSync(archiveFile)) {
      throw new Error(`Archive file not found: ${filename}`);
    }
    
    const fileContent = fs.readFileSync(archiveFile, 'utf8');
    const data: NASAPlusData = JSON.parse(fileContent);
    
    console.log(`📂 Loaded archive data from ${filename}`);
    return data;
    
  } catch (error) {
    console.error(`Failed to load archive data from ${filename}:`, error);
    return null;
  }
}

/**
 * Check if the data directory exists and create it if needed
 */
export function ensureDataDirectory(): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      console.log('📁 Created data directory:', DATA_DIR);
    }
    return true;
  } catch (error) {
    console.error('Failed to create data directory:', error);
    return false;
  }
}

/**
 * Run the daily scraper programmatically (for testing)
 */
export async function runDailyScraper(): Promise<NASAPlusData> {
  try {
    console.log('🚀 Running daily scraper programmatically...');
    
    // Import and run the scraper
    const { runDailyScrape } = require('../../scripts/daily-nasa-scraper.js');
    const result = await runDailyScrape();
    
    console.log('✅ Daily scraper completed programmatically');
    return result;
  } catch (error) {
    console.error('❌ Failed to run daily scraper:', error);
    throw error;
  }
}

// Export types for TypeScript
export type {
  NASAPlusData
};