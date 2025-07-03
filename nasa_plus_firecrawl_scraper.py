#!/usr/bin/env python3
"""
NASA+ Series Scraper using Firecrawl.dev
Extracts video links and thumbnail links from NASA+ series pages
"""

import json
import requests
import time
from typing import List, Dict, Any
import re
from urllib.parse import urljoin, urlparse

class NASAPlusFirecrawlScraper:
    def __init__(self, firecrawl_api_key: str):
        """Initialize the scraper with Firecrawl API key"""
        self.api_key = firecrawl_api_key
        self.base_url = "https://api.firecrawl.dev/v0"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # NASA+ series URLs to scrape
        self.series_urls = [
            "https://plus.nasa.gov/series/far-out/",
            "https://plus.nasa.gov/series/our-alien-earth/",
            "https://plus.nasa.gov/series/other-worlds/",
            "https://plus.nasa.gov/series/space-out/",
            "https://plus.nasa.gov/series/nasa-explorers/",
            "https://plus.nasa.gov/series/path-to-the-pad/",
            "https://plus.nasa.gov/series/down-to-earth/",
            "https://plus.nasa.gov/series/jpl-and-the-space-age/",
            "https://plus.nasa.gov/series/sci-girls/",
            "https://plus.nasa.gov/series/elements-of-webb/",
            "https://plus.nasa.gov/series/the-traveler/",
            "https://plus.nasa.gov/series/why-with-nye/",
            "https://plus.nasa.gov/series/75-years-of-armstrong/",
            "https://plus.nasa.gov/series/high-above-down-under/",
            "https://plus.nasa.gov/series/moon-101/",
            "https://plus.nasa.gov/series/leaders-in-lidar/",
            "https://plus.nasa.gov/series/surprisingly-stem/",
            "https://plus.nasa.gov/series/mars-in-a-minute/",
            "https://plus.nasa.gov/series/space-place-in-a-snap/",
            "https://plus.nasa.gov/series/new-horizons/",
            "https://plus.nasa.gov/series/climate-tales/",
            "https://plus.nasa.gov/series/elmo-visits-nasa/",
            "https://plus.nasa.gov/series/stemonstrations/",
            "https://plus.nasa.gov/series/earth-minute/"
        ]
        
        self.results = []

    def scrape_page(self, url: str) -> Dict[str, Any]:
        """Scrape a single page using Firecrawl"""
        print(f"Scraping: {url}")
        
        payload = {
            "url": url,
            "formats": ["markdown", "html"],
            "includeTags": ["img", "video", "a"],
            "excludeTags": ["script", "style"],
            "waitFor": 2000,
            "timeout": 30000
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/scrape",
                headers=self.headers,
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Successfully scraped: {url}")
                return data
            else:
                print(f"❌ Error scraping {url}: {response.status_code} - {response.text}")
                return {}
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed for {url}: {str(e)}")
            return {}

    def extract_video_data(self, scraped_data: Dict[str, Any], series_url: str) -> List[Dict[str, str]]:
        """Extract video links and thumbnail links from scraped data"""
        videos = []
        
        if not scraped_data:
            return videos
            
        # Get HTML and markdown content
        html_content = scraped_data.get('html', '')
        markdown_content = scraped_data.get('markdown', '')
        
        # Extract video links from HTML
        video_links = self.extract_video_links(html_content, series_url)
        
        # Extract thumbnail links
        thumbnail_links = self.extract_thumbnail_links(html_content)
        
        # Combine video and thumbnail data
        for i, video_link in enumerate(video_links):
            thumbnail_link = thumbnail_links[i] if i < len(thumbnail_links) else self.generate_thumbnail_url(video_link)
            
            videos.append({
                "video_link": video_link,
                "thumbnail_link": thumbnail_link
            })
            
        return videos

    def extract_video_links(self, html_content: str, base_url: str) -> List[str]:
        """Extract video links from HTML content"""
        video_links = []
        
        # Patterns to match NASA+ video URLs
        patterns = [
            r'href="(https://plus\.nasa\.gov/video/[^"]+)"',
            r'href="(/video/[^"]+)"',
            r'<a[^>]+href="([^"]*video[^"]*)"',
            r'data-video-url="([^"]+)"',
            r'video-link="([^"]+)"'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, html_content, re.IGNORECASE)
            for match in matches:
                if match.startswith('/'):
                    full_url = urljoin('https://plus.nasa.gov', match)
                else:
                    full_url = match
                    
                if 'plus.nasa.gov/video/' in full_url and full_url not in video_links:
                    video_links.append(full_url)
        
        # If no individual videos found, use the series URL itself
        if not video_links:
            video_links.append(base_url)
            
        return video_links

    def extract_thumbnail_links(self, html_content: str) -> List[str]:
        """Extract thumbnail image links from HTML content"""
        thumbnail_links = []
        
        # Patterns to match thumbnail images
        patterns = [
            r'<img[^>]+src="([^"]*thumb[^"]*)"',
            r'<img[^>]+src="([^"]*preview[^"]*)"',
            r'<img[^>]+src="([^"]*\.jpg[^"]*)"',
            r'<img[^>]+src="([^"]*\.png[^"]*)"',
            r'data-thumbnail="([^"]+)"',
            r'poster="([^"]+)"',
            r'background-image:\s*url\([\'"]?([^\'")]+)[\'"]?\)'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, html_content, re.IGNORECASE)
            for match in matches:
                if match.startswith('/'):
                    full_url = urljoin('https://plus.nasa.gov', match)
                else:
                    full_url = match
                    
                if any(ext in full_url.lower() for ext in ['.jpg', '.png', '.jpeg', '.webp']):
                    thumbnail_links.append(full_url)
        
        return thumbnail_links

    def generate_thumbnail_url(self, video_url: str) -> str:
        """Generate a thumbnail URL based on video URL"""
        # Extract video slug from URL
        video_slug = video_url.rstrip('/').split('/')[-1]
        return f"https://plus.nasa.gov/thumbnails/{video_slug}.jpg"

    def scrape_all_series(self) -> Dict[str, List[Dict[str, str]]]:
        """Scrape all NASA+ series and extract video data"""
        print("🚀 Starting NASA+ series scraping with Firecrawl...")
        print(f"📊 Total series to scrape: {len(self.series_urls)}")
        
        all_videos = []
        
        for i, url in enumerate(self.series_urls, 1):
            print(f"\n[{i}/{len(self.series_urls)}] Processing: {url}")
            
            # Scrape the page
            scraped_data = self.scrape_page(url)
            
            # Extract video data
            videos = self.extract_video_data(scraped_data, url)
            
            if videos:
                all_videos.extend(videos)
                print(f"✅ Found {len(videos)} videos")
            else:
                print("⚠️ No videos found, adding series URL as fallback")
                all_videos.append({
                    "video_link": url,
                    "thumbnail_link": self.generate_thumbnail_url(url)
                })
            
            # Rate limiting - be respectful to the API
            time.sleep(1)
        
        return {"series": all_videos}

    def save_results(self, data: Dict[str, Any], filename: str = "nasa_plus_scraped_data.json"):
        """Save results to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"💾 Results saved to: {filename}")

def main():
    """Main function to run the scraper"""
    # Firecrawl API key
    API_KEY = "fc-8d9a8363bd874121af40813178449815"
    
    if not API_KEY or API_KEY == "YOUR_FIRECRAWL_API_KEY_HERE":
        print("❌ Please set your Firecrawl API key in the script!")
        print("🔗 Get your API key from: https://firecrawl.dev")
        return
    
    # Initialize scraper
    scraper = NASAPlusFirecrawlScraper(API_KEY)
    
    # Scrape all series
    results = scraper.scrape_all_series()
    
    # Save results
    scraper.save_results(results)
    
    # Print summary
    print(f"\n🎉 Scraping completed!")
    print(f"📊 Total videos extracted: {len(results['series'])}")
    print(f"📁 Results saved to: nasa_plus_scraped_data.json")
    
    # Preview first few results
    print("\n📋 Sample results:")
    for i, video in enumerate(results['series'][:3]):
        print(f"{i+1}. Video: {video['video_link']}")
        print(f"   Thumb: {video['thumbnail_link']}")

if __name__ == "__main__":
    main()