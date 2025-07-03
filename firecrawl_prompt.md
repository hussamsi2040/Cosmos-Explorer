# Firecrawl.dev Prompt for NASA+ Data Extraction

## 🎯 **Objective**
Extract video links and thumbnail links from NASA+ series pages and return data in a specific JSON structure.

## 📋 **Required Output Format**
```json
{
  "series": [
    {
      "video_link": "https://plus.nasa.gov/video/...",
      "thumbnail_link": "https://plus.nasa.gov/thumbnails/..."
    }
  ]
}
```

## 🔗 **Target URLs to Scrape**
```
https://plus.nasa.gov/series/far-out/
https://plus.nasa.gov/series/our-alien-earth/
https://plus.nasa.gov/series/other-worlds/
https://plus.nasa.gov/series/space-out/
https://plus.nasa.gov/series/nasa-explorers/
https://plus.nasa.gov/series/path-to-the-pad/
https://plus.nasa.gov/series/down-to-earth/
https://plus.nasa.gov/series/jpl-and-the-space-age/
https://plus.nasa.gov/series/sci-girls/
https://plus.nasa.gov/series/elements-of-webb/
https://plus.nasa.gov/series/the-traveler/
https://plus.nasa.gov/series/why-with-nye/
https://plus.nasa.gov/series/75-years-of-armstrong/
https://plus.nasa.gov/series/high-above-down-under/
https://plus.nasa.gov/series/moon-101/
https://plus.nasa.gov/series/leaders-in-lidar/
https://plus.nasa.gov/series/surprisingly-stem/
https://plus.nasa.gov/series/mars-in-a-minute/
https://plus.nasa.gov/series/space-place-in-a-snap/
https://plus.nasa.gov/series/new-horizons/
https://plus.nasa.gov/series/climate-tales/
https://plus.nasa.gov/series/elmo-visits-nasa/
https://plus.nasa.gov/series/stemonstrations/
https://plus.nasa.gov/series/earth-minute/
```

## 🎯 **Extraction Instructions**

### **Extract Video Links:**
- Look for individual video URLs in format: `https://plus.nasa.gov/video/[episode-name]/`
- Extract from `<a href="...">` tags linking to video pages
- Look for data attributes like `data-video-url` or `video-link`
- Find links in episode lists or video grids
- If no individual videos found, use the series URL itself as fallback

### **Extract Thumbnail Links:**
- Look for thumbnail images in `<img>` tags with `src` attributes
- Find images with keywords: "thumb", "preview", "poster" 
- Extract from `data-thumbnail` attributes
- Look for CSS `background-image` properties
- Generate fallback thumbnails as: `https://plus.nasa.gov/thumbnails/[series-slug].jpg`

### **Data Processing Rules:**
1. **Remove duplicates** - only unique video/thumbnail combinations
2. **Complete URLs** - convert relative URLs to absolute (add https://plus.nasa.gov)
3. **Validate URLs** - ensure they contain "plus.nasa.gov"
4. **Match pairs** - pair each video with appropriate thumbnail
5. **Fallback handling** - if no specific thumbnail found, generate one from video URL

## ⚙️ **Firecrawl Configuration**

### **Recommended Settings:**
```json
{
  "formats": ["html", "markdown"],
  "includeTags": ["img", "video", "a", "div"],
  "excludeTags": ["script", "style", "nav", "footer"],
  "waitFor": 3000,
  "timeout": 30000,
  "extractorOptions": {
    "extractionSchema": {
      "type": "object",
      "properties": {
        "series": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "video_link": {
                "type": "string",
                "format": "uri"
              },
              "thumbnail_link": {
                "type": "string",
                "format": "uri"
              }
            },
            "required": ["video_link", "thumbnail_link"]
          }
        }
      },
      "required": ["series"]
    }
  }
}
```

## 🔍 **Extraction Patterns**

### **HTML Patterns to Look For:**
```html
<!-- Video links -->
<a href="https://plus.nasa.gov/video/episode-name/">
<a href="/video/episode-name/">
<div data-video-url="...">
<span video-link="...">

<!-- Thumbnail images -->
<img src="https://plus.nasa.gov/thumbnails/...">
<img src="/thumbnails/...">
<div data-thumbnail="...">
<div style="background-image: url(...)">
```

### **CSS Selectors:**
```css
/* Video links */
a[href*="/video/"]
a[href*="plus.nasa.gov/video"]
[data-video-url]
[video-link]

/* Thumbnails */
img[src*="thumb"]
img[src*="preview"]
img[src*=".jpg"]
[data-thumbnail]
```

## 📝 **Step-by-Step Process**

1. **Load each series page** with JavaScript rendering enabled
2. **Wait for content** to fully load (3 seconds minimum)
3. **Extract video links** using patterns above
4. **Extract thumbnail images** from same page
5. **Process and clean URLs** (convert relative to absolute)
6. **Pair videos with thumbnails** logically
7. **Generate fallback thumbnails** if needed
8. **Format as JSON** according to required structure
9. **Validate output** ensures all required fields present

## 🚨 **Error Handling**

### **If Page Fails to Load:**
- Use series URL as video_link fallback
- Generate thumbnail as: `https://plus.nasa.gov/thumbnails/[series-name].jpg`

### **If No Videos Found:**
- Use series landing page URL as video_link
- Generate thumbnail_link from series name

### **If No Thumbnails Found:**
- Extract video slug from video_link
- Generate: `https://plus.nasa.gov/thumbnails/[video-slug].jpg`

## ✅ **Expected Output Example**
```json
{
  "series": [
    {
      "video_link": "https://plus.nasa.gov/video/far-out-episode-1/",
      "thumbnail_link": "https://plus.nasa.gov/thumbnails/far-out-episode-1.jpg"
    },
    {
      "video_link": "https://plus.nasa.gov/video/nasa-explorers-season-4/",
      "thumbnail_link": "https://plus.nasa.gov/thumbnails/nasa-explorers-season-4.jpg"
    },
    {
      "video_link": "https://plus.nasa.gov/series/mars-in-a-minute/",
      "thumbnail_link": "https://plus.nasa.gov/thumbnails/mars-in-a-minute.jpg"
    }
  ]
}
```

## 🎯 **Success Criteria**
- ✅ JSON structure exactly matches required format
- ✅ All URLs are valid and complete
- ✅ Both video_link and thumbnail_link present for each entry
- ✅ No duplicate entries
- ✅ Minimum 20+ series entries extracted
- ✅ Proper error handling with fallbacks

## 💡 **Priority Order**
1. **Individual episode videos** > Series landing pages
2. **Actual thumbnail images** > Generated fallbacks  
3. **Direct links** > Data attributes
4. **Absolute URLs** > Relative URLs
5. **Recent content** > Older content