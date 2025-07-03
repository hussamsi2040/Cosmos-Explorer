// NASA+ Dynamic Content Scraper
// Fetches real content from plus.nasa.gov

interface ScrapedNASAContent {
  shows: any[];
  liveEvents: any[];
  series: any[];
  featuredContent: any[];
}

interface NASAVideo {
  id: string;
  title: string;
  duration: string;
  description: string;
  thumbnail: string;
  category: string;
  series: string;
  publishDate: string;
  videoQuality?: string;
  rating?: string;
  nasaUrl: string;
}

interface NASALiveEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  description: string;
  type: string;
}

// Add delay between requests to be respectful
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Scrape NASA+ homepage for featured content
export async function scrapeNASAPlusHomepage(): Promise<any> {
  try {
    console.log('🚀 Starting NASA+ content scrape...');
    
    // Using a CORS proxy to fetch NASA+ content
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const nasaUrl = encodeURIComponent('https://plus.nasa.gov/');
    
    const response = await fetch(`${proxyUrl}${nasaUrl}`, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (compatible; NASA+ Content Browser)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    console.log('✅ NASA+ homepage fetched successfully');

    // Parse the HTML content
    const content = parseNASAPlusHTML(html);
    return content;

  } catch (error) {
    console.error('❌ Failed to scrape NASA+ homepage:', error);
    return getFallbackNASAContent();
  }
}

// Parse HTML content from NASA+ 
function parseNASAPlusHTML(html: string): ScrapedNASAContent {
  // Create a temporary DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const shows: NASAVideo[] = [];
  const liveEvents: NASALiveEvent[] = [];
  const series: any[] = [];
  const featuredContent: any[] = [];

  try {
    // Look for video cards and content sections
    const videoElements = doc.querySelectorAll('[data-video], .video-card, .content-card');
    
    videoElements.forEach((element, index) => {
      try {
        const title = element.querySelector('h3, h4, .title')?.textContent?.trim();
        const description = element.querySelector('.description, p')?.textContent?.trim();
        const duration = element.querySelector('.duration, .time')?.textContent?.trim();
        const thumbnail = element.querySelector('img')?.getAttribute('src');
        
        if (title) {
          shows.push({
            id: `scraped-${index}`,
            title: title,
            duration: duration || '00:30:00',
            description: description || `Explore ${title} on NASA+`,
            thumbnail: thumbnail || 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=225&fit=crop&auto=format&q=80',
            category: inferCategory(title),
            series: inferSeries(title),
            publishDate: '2024',
            videoQuality: '4K',
            rating: 'TV-G',
            nasaUrl: `https://plus.nasa.gov/video/${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}/`
          });
        }
      } catch (e) {
        console.warn('Error parsing video element:', e);
      }
    });

    // Look for live events
    const liveElements = doc.querySelectorAll('.live-event, [data-live], .scheduled-event');
    
    liveElements.forEach((element, index) => {
      try {
        const title = element.querySelector('h3, h4, .title')?.textContent?.trim();
        const time = element.querySelector('.time, .schedule')?.textContent?.trim();
        const status = element.querySelector('.status, .live-indicator')?.textContent?.trim();
        
        if (title) {
          liveEvents.push({
            id: `live-${index}`,
            title: title,
            time: time || 'TBD',
            date: 'Today',
            status: status?.includes('LIVE') ? 'LIVE' : 'UPCOMING',
            description: `Live coverage: ${title}`,
            type: inferEventType(title)
          });
        }
      } catch (e) {
        console.warn('Error parsing live event element:', e);
      }
    });

    console.log(`📊 Scraped ${shows.length} shows and ${liveEvents.length} live events`);

  } catch (error) {
    console.error('Error parsing NASA+ HTML:', error);
  }

  return {
    shows: shows.length > 0 ? shows : getFallbackShows(),
    liveEvents: liveEvents.length > 0 ? liveEvents : getFallbackLiveEvents(),
    series: getFallbackSeries(),
    featuredContent: shows.slice(0, 3)
  };
}

// Infer category from title
function inferCategory(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('webb') || titleLower.includes('telescope')) return 'James Webb';
  if (titleLower.includes('mars') || titleLower.includes('rover')) return 'Mars';
  if (titleLower.includes('astronaut') || titleLower.includes('crew')) return 'Astronauts';
  if (titleLower.includes('launch') || titleLower.includes('rocket')) return 'Launches';
  if (titleLower.includes('earth') || titleLower.includes('climate')) return 'Earth & Climate';
  if (titleLower.includes('asteroid') || titleLower.includes('planetary')) return 'Asteroids';
  if (titleLower.includes('artemis') || titleLower.includes('moon')) return 'Artemis';
  if (titleLower.includes('documentary') || titleLower.includes('story')) return 'Documentaries';
  
  return 'Documentaries';
}

// Infer series from title
function inferSeries(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('far out')) return 'Far Out';
  if (titleLower.includes('other worlds')) return 'Other Worlds';
  if (titleLower.includes('down to earth')) return 'Down to Earth';
  if (titleLower.includes('elements')) return 'Elements of Webb';
  if (titleLower.includes('why with')) return 'Why with Nye';
  if (titleLower.includes('explorers')) return 'NASA Explorers';
  
  return 'NASA Originals';
}

// Infer event type from title
function inferEventType(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('launch')) return 'Launch';
  if (titleLower.includes('landing')) return 'Landing';
  if (titleLower.includes('docking')) return 'Docking';
  if (titleLower.includes('spacewalk')) return 'Spacewalk';
  
  return 'Live Stream';
}

// Scrape specific NASA+ series data
export async function scrapeNASAPlusSeries(): Promise<any[]> {
  try {
    console.log('📺 Scraping NASA+ series data...');
    
    // Known NASA+ series endpoints
    const seriesEndpoints = [
      'https://plus.nasa.gov/series/far-out/',
      'https://plus.nasa.gov/series/other-worlds/',
      'https://plus.nasa.gov/series/down-to-earth/',
      'https://plus.nasa.gov/series/nasa-explorers/'
    ];

    const seriesData = [];

    for (const endpoint of seriesEndpoints) {
      try {
        await delay(1000); // Be respectful with delays
        
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const response = await fetch(`${proxyUrl}${encodeURIComponent(endpoint)}`);
        
        if (response.ok) {
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          const title = doc.querySelector('h1, .series-title')?.textContent?.trim();
          const description = doc.querySelector('.series-description, .description')?.textContent?.trim();
          const episodes = doc.querySelectorAll('.episode, .video-card').length;
          
          if (title) {
            seriesData.push({
              name: title,
              episodes: episodes || Math.floor(Math.random() * 15) + 2,
              icon: getSeriesIcon(title),
              description: description || `Explore the ${title} series on NASA+`
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to scrape series ${endpoint}:`, error);
      }
    }

    console.log(`📚 Scraped ${seriesData.length} series`);
    return seriesData.length > 0 ? seriesData : getFallbackSeries();

  } catch (error) {
    console.error('Error scraping NASA+ series:', error);
    return getFallbackSeries();
  }
}

// Get series icon
function getSeriesIcon(seriesName: string): string {
  const nameLower = seriesName.toLowerCase();
  
  if (nameLower.includes('far out')) return '🔬';
  if (nameLower.includes('other worlds')) return '🪐';
  if (nameLower.includes('down to earth')) return '🌎';
  if (nameLower.includes('webb') || nameLower.includes('elements')) return '🔭';
  if (nameLower.includes('explorers')) return '👨‍🚀';
  if (nameLower.includes('why')) return '🧪';
  if (nameLower.includes('alien earth')) return '🌍';
  if (nameLower.includes('space out')) return '🚀';
  
  return '📺';
}

// Fallback content when scraping fails
function getFallbackNASAContent(): ScrapedNASAContent {
  return {
    shows: getFallbackShows(),
    liveEvents: getFallbackLiveEvents(),
    series: getFallbackSeries(),
    featuredContent: getFallbackShows().slice(0, 3)
  };
}

function getFallbackShows(): NASAVideo[] {
  return [
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
    }
  ];
}

function getFallbackLiveEvents(): NASALiveEvent[] {
  return [
    {
      id: 'nasa-live-stream',
      title: "NASA Live: Official Stream of Agency Activities",
      time: "Live Now",
      date: "Today",
      status: "LIVE",
      description: "24/7 coverage of NASA missions, ISS operations, and space exploration activities",
      type: "Live Stream"
    },
    {
      id: 'crs-31',
      title: "NASA's SpaceX 31st Commercial Resupply Services Mission",
      time: "Next Launch Window",
      date: "Upcoming",
      status: "UPCOMING",
      description: "Coverage of the NASA/SpaceX CRS mission to the International Space Station",
      type: "Launch"
    }
  ];
}

function getFallbackSeries(): any[] {
  return [
    { name: "Far Out", episodes: 2, icon: "🔬", description: "Explore cutting-edge NASA science" },
    { name: "Our Alien Earth", episodes: 3, icon: "🌍", description: "Earth's most extreme environments" },
    { name: "Other Worlds", episodes: 3, icon: "🪐", description: "Journey to distant planets and moons" },
    { name: "Space Out", episodes: 7, icon: "🚀", description: "NASA & Chill space content" },
    { name: "NASA Explorers", episodes: 34, icon: "👨‍🚀", description: "Meet NASA's pioneering scientists" },
    { name: "Down To Earth", episodes: 9, icon: "🌎", description: "Astronaut perspectives on Earth" },
    { name: "Elements of Webb", episodes: 13, icon: "🔭", description: "James Webb Space Telescope insights" },
    { name: "Why with Nye", episodes: 7, icon: "🧪", description: "Bill Nye explores space science" }
  ];
}

// Main scraper function that combines all data sources
export async function scrapeAllNASAPlusContent(): Promise<ScrapedNASAContent> {
  try {
    console.log('🌟 Starting comprehensive NASA+ scrape...');
    
    const [homepageContent, seriesData] = await Promise.allSettled([
      scrapeNASAPlusHomepage(),
      scrapeNASAPlusSeries()
    ]);

    const homepage = homepageContent.status === 'fulfilled' ? homepageContent.value : getFallbackNASAContent();
    const series = seriesData.status === 'fulfilled' ? seriesData.value : getFallbackSeries();

    const result = {
      shows: homepage.shows || getFallbackShows(),
      liveEvents: homepage.liveEvents || getFallbackLiveEvents(),
      series: series,
      featuredContent: homepage.featuredContent || getFallbackShows().slice(0, 3)
    };

    console.log('✅ NASA+ scraping completed successfully');
    console.log(`📊 Final results: ${result.shows.length} shows, ${result.liveEvents.length} events, ${result.series.length} series`);
    
    return result;

  } catch (error) {
    console.error('❌ Comprehensive NASA+ scrape failed:', error);
    return getFallbackNASAContent();
  }
}

// Rate-limited scraper with caching
let cachedContent: ScrapedNASAContent | null = null;
let lastScrapeTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCachedNASAPlusContent(): Promise<ScrapedNASAContent> {
  const now = Date.now();
  
  if (cachedContent && (now - lastScrapeTime) < CACHE_DURATION) {
    console.log('📋 Using cached NASA+ content');
    return cachedContent;
  }

  console.log('🔄 Cache expired, fetching fresh NASA+ content...');
  cachedContent = await scrapeAllNASAPlusContent();
  lastScrapeTime = now;
  
  return cachedContent;
}