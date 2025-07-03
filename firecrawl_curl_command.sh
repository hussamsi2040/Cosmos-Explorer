#!/bin/bash

# Firecrawl API Test Command for NASA+ Series Extraction
# Replace YOUR_API_KEY with your actual Firecrawl API key

curl -X POST 'https://api.firecrawl.dev/v0/scrape' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer fc-8d9a8363bd874121af40813178449815' \
  -d '{
    "url": "https://plus.nasa.gov/series/far-out/",
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
      },
      "mode": "llm-extraction",
      "extractionPrompt": "Extract video links and thumbnail images from this NASA+ series page. For each video/episode found, return:\n\n- video_link: Direct URL to the video page (format: https://plus.nasa.gov/video/episode-name/)\n- thumbnail_link: Associated thumbnail image URL\n\nLook for individual episode links, video grids, and thumbnail images. If no individual videos found, use the series URL as video_link and generate thumbnail_link as https://plus.nasa.gov/thumbnails/[series-name].jpg\n\nReturn in exact format:\n{\n  \"series\": [\n    {\n      \"video_link\": \"https://plus.nasa.gov/video/...\",\n      \"thumbnail_link\": \"https://plus.nasa.gov/thumbnails/...\"\n    }\n  ]\n}"
    },
    "onlyMainContent": true
  }'

# Alternative simplified version for testing
echo -e "\n\n=== SIMPLIFIED VERSION ==="

curl -X POST 'https://api.firecrawl.dev/v0/scrape' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer fc-8d9a8363bd874121af40813178449815' \
  -d '{
    "url": "https://plus.nasa.gov/series/nasa-explorers/",
    "formats": ["html"],
    "waitFor": 2000,
    "onlyMainContent": true
  }'