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

const DATA_DIR = path.join(process.cwd(), 'nasa plus');
const SERIES_FILE = path.join(DATA_DIR, 'plus.nasa.gov_series_.json');

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
      nasaUrl: "https://plus.nasa.gov/",
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
      nasaUrl: "https://plus.nasa.gov/"
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
      nasaUrl: "https://plus.nasa.gov/"
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
      nasaUrl: "https://plus.nasa.gov/"
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
      nasaUrl: "https://plus.nasa.gov/"
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
      nasaUrl: "https://plus.nasa.gov/"
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
    if (!fs.existsSync(SERIES_FILE)) {
      console.log('⚠️ No series data file found, using fallback data');
      return FALLBACK_DATA;
    }
    
    // Read and parse the data file
    const seriesFileContent = fs.readFileSync(SERIES_FILE, 'utf8');
    const seriesData = JSON.parse(seriesFileContent);

    const seriesRegex = /\[\*\*([^\*]+)\*\* \\\\\n(\d+) Episodes\]\(([^)]+)\)/g;
    const seriesList = [];
    let match;
    while ((match = seriesRegex.exec(seriesData.markdown)) !== null) {
      seriesList.push({
        name: match[1].trim(),
        episodes: parseInt(match[2], 10),
        url: match[3],
        icon: '🚀',
        description: `Explore the ${match[1].trim()} series.`
      });
    }

    const shows = [];
    for (const series of seriesList as any[]) {
      const seriesSlug = series.url.split('/').filter(Boolean).pop();
      series.slug = seriesSlug;
      const seriesJsonFile = path.join(DATA_DIR, `plus.nasa.gov_series_${seriesSlug}_.json`);

      if (fs.existsSync(seriesJsonFile)) {
        const showFileContent = fs.readFileSync(seriesJsonFile, 'utf8');
        const showData = JSON.parse(showFileContent);
        
        if (showData.metadata && showData.metadata.ogImage) {
          const ogImage = Array.isArray(showData.metadata.ogImage) ? showData.metadata.ogImage[0] : showData.metadata.ogImage;
          series.thumbnail = ogImage;
        } else {
          series.thumbnail = "https://images.unsplash.com/photo-1541185934-01b600ea069c?w=400&h=225&fit=crop&auto=format&q=80";
        }
        
        // Use og:description from metadata for clean descriptions
        const ogDescription = showData.metadata?.['og:description'] || 
                            showData.metadata?.description || 
                            `Explore episodes from the ${series.name} series on NASA+`;
        
        const showRegex = /\[(\d{2}:\d{2}:\d{2})\]\([^)]+\)\n\n#### \[([^\]]+)\]\(([^)]+)\)/g;
        let showMatch;
        while ((showMatch = showRegex.exec(showData.markdown)) !== null) {
          shows.push({
            id: showMatch[2].toLowerCase().replace(/\s+/g, '-'),
            title: showMatch[2].trim(),
            duration: showMatch[1],
            category: series.name,
            description: ogDescription,
            thumbnail: series.thumbnail,
            series: series.name,
            publishDate: '2024',
            videoQuality: 'HD',
            rating: 'TV-G',
            nasaUrl: showMatch[3],
            scrapedAt: new Date().toISOString()
          });
        }
      }
    }

    const liveEvents = [
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
    ];

    const result = {
      ...FALLBACK_DATA,
      shows,
      series: seriesList,
      liveEvents,
      stats: {
        totalShows: shows.length,
        totalLiveEvents: liveEvents.length,
        totalSeries: seriesList.length,
      },
      featuredContent: shows.slice(0, 3),
      lastUpdated: new Date().toISOString(),
      timestamp: new Date().toISOString()
    };
    
    return result;
    
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
    if (!fs.existsSync(SERIES_FILE)) {
      return Infinity;
    }
    
    const stats = fs.statSync(SERIES_FILE);
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
 * Run the daily scraper programmatically (server-side only)
 * This function is not available in browser context
 */
export async function runDailyScraper(): Promise<NASAPlusData> {
  throw new Error('Daily scraper can only be run server-side via npm scripts. Use: npm run scrape');
}

// Export types for TypeScript
export type {
  NASAPlusData
};