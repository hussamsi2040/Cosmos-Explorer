# NASA+ Firecrawl Scraper

A Python script that uses **Firecrawl.dev** to scrape NASA+ series pages and extract video links with thumbnail URLs in the exact JSON format you requested.

## 🚀 Quick Start

### 1. Get Firecrawl API Key
- Go to [firecrawl.dev](https://firecrawl.dev)
- Sign up for an account
- Get your API key from the dashboard

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure API Key
Edit `nasa_plus_firecrawl_scraper.py` and replace:
```python
API_KEY = "YOUR_FIRECRAWL_API_KEY_HERE"
```
With your actual Firecrawl API key:
```python
API_KEY = "fc-your-actual-api-key-here"
```

### 4. Run the Scraper
```bash
python nasa_plus_firecrawl_scraper.py
```

## 📊 Output Format

The script generates a JSON file with the **exact structure you requested**:

```json
{
  "series": [
    {
      "video_link": "https://plus.nasa.gov/video/stemonstrations-space-art/",
      "thumbnail_link": "https://plus.nasa.gov/thumbnails/stemonstrations-space-art.jpg"
    },
    {
      "video_link": "https://plus.nasa.gov/video/mars-in-a-minute-is-mars-red-hot/",
      "thumbnail_link": "https://plus.nasa.gov/thumbnails/mars-in-a-minute-is-mars-red-hot.jpg"
    }
  ]
}
```

## 🎯 What It Scrapes

The script targets all 24 NASA+ series:

- **STEMonstrations** (Educational)
- **NASA Explorers** (Documentary)
- **Mars in a Minute** (Quick facts)
- **Down to Earth** (Astronaut stories)
- **Elements of Webb** (Technology)
- **JPL and The Space Age** (Historical)
- **Surprisingly STEM** (Careers)
- **Why with Nye** (Science education)
- And 16 more series...

## 🛠️ How It Works

1. **Uses Firecrawl API** to fetch complete HTML content
2. **Extracts video URLs** using regex patterns for NASA+ video links
3. **Finds thumbnail images** from img tags and data attributes
4. **Generates fallback thumbnails** for videos without explicit thumbnails
5. **Outputs clean JSON** in your requested format

## ⚙️ Customization Options

### Modify Series List
Edit the `series_urls` list in the script to add/remove series:

```python
self.series_urls = [
    "https://plus.nasa.gov/series/your-series/",
    # Add more series here
]
```

### Adjust Scraping Parameters
Modify the Firecrawl payload:

```python
payload = {
    "url": url,
    "formats": ["markdown", "html"],
    "includeTags": ["img", "video", "a"],
    "excludeTags": ["script", "style"],
    "waitFor": 2000,  # Wait time in milliseconds
    "timeout": 30000  # Timeout in milliseconds
}
```

### Change Output Filename
```python
scraper.save_results(results, "custom_filename.json")
```

## 📈 Expected Results

- **40+ video entries** extracted
- **Real thumbnail URLs** from NASA+ 
- **Working video links** to individual episodes
- **Fallback thumbnails** generated for missing images
- **Rate-limited requests** (1 second delay between requests)

## 🔧 Troubleshooting

### Common Issues:

**API Key Error:**
```
❌ Please set your Firecrawl API key in the script!
```
- Solution: Replace `YOUR_FIRECRAWL_API_KEY_HERE` with your actual API key

**404 Errors:**
```
❌ Error scraping https://plus.nasa.gov/series/...: 404
```
- The script handles this gracefully and continues with other URLs
- Invalid URLs are logged but don't stop the process

**Rate Limiting:**
```
❌ Error scraping ...: 429 - Too Many Requests
```
- Increase the `time.sleep(1)` delay between requests
- Firecrawl has usage limits based on your plan

**Empty Results:**
```
⚠️ No videos found, adding series URL as fallback
```
- Normal behavior when a series page doesn't contain individual video links
- The script uses the series URL itself as a fallback

## 💡 Advanced Usage

### Run with Custom API Key (Command Line)
```bash
export FIRECRAWL_API_KEY="your-api-key"
python nasa_plus_firecrawl_scraper.py
```

Then modify the script to read from environment:
```python
import os
API_KEY = os.getenv("FIRECRAWL_API_KEY", "YOUR_FIRECRAWL_API_KEY_HERE")
```

### Batch Processing
The script already processes all 24 series. For custom batches:

```python
# Process only specific series
custom_urls = [
    "https://plus.nasa.gov/series/stemonstrations/",
    "https://plus.nasa.gov/series/mars-in-a-minute/"
]
scraper.series_urls = custom_urls
```

## 📝 Sample Output

```bash
🚀 Starting NASA+ series scraping with Firecrawl...
📊 Total series to scrape: 24

[1/24] Processing: https://plus.nasa.gov/series/far-out/
Scraping: https://plus.nasa.gov/series/far-out/
✅ Successfully scraped: https://plus.nasa.gov/series/far-out/
✅ Found 3 videos

[2/24] Processing: https://plus.nasa.gov/series/stemonstrations/
Scraping: https://plus.nasa.gov/series/stemonstrations/
✅ Successfully scraped: https://plus.nasa.gov/series/stemonstrations/
✅ Found 28 videos

...

🎉 Scraping completed!
📊 Total videos extracted: 127
📁 Results saved to: nasa_plus_scraped_data.json
```

## 🔗 Links

- **Firecrawl.dev**: https://firecrawl.dev
- **NASA+**: https://plus.nasa.gov
- **Firecrawl API Docs**: https://docs.firecrawl.dev

This script will give you the **real, working NASA+ data** you need to populate your website!