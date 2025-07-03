#!/bin/bash

# NASA+ Daily Scraper Setup Script
# Sets up automated daily scraping with cron

set -e

echo "🚀 Setting up NASA+ Daily Scraper..."

# Get the absolute path to the project
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRAPER_SCRIPT="$PROJECT_DIR/scripts/daily-nasa-scraper.js"

echo "📁 Project directory: $PROJECT_DIR"

# Install required dependencies
echo "📦 Installing dependencies..."
cd "$PROJECT_DIR"

# Check if jsdom is installed
if ! node -e "require('jsdom')" 2>/dev/null; then
    echo "Installing jsdom..."
    npm install jsdom
else
    echo "✅ jsdom already installed"
fi

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x "$PROJECT_DIR/scripts/daily-nasa-scraper.js"
chmod +x "$PROJECT_DIR/scripts/setup-daily-scraper.sh"

# Create data directory
echo "📁 Creating data directory..."
mkdir -p "$PROJECT_DIR/data"

# Test the scraper
echo "🧪 Testing the scraper..."
cd "$PROJECT_DIR"
npm run scrape

if [ $? -eq 0 ]; then
    echo "✅ Scraper test successful!"
else
    echo "❌ Scraper test failed. Please check the output above."
    exit 1
fi

# Setup cron job
echo "⏰ Setting up daily cron job..."

# Remove any existing NASA scraper cron jobs
crontab -l 2>/dev/null | grep -v "nasa-scraper" | crontab -

# Add new cron job to run daily at 6:00 AM
(crontab -l 2>/dev/null; echo "0 6 * * * cd $PROJECT_DIR && /usr/bin/node scripts/daily-nasa-scraper.js >> logs/scraper.log 2>&1 # nasa-scraper") | crontab -

# Create logs directory
mkdir -p "$PROJECT_DIR/logs"

# Create a manual run script
cat > "$PROJECT_DIR/run-scraper.sh" << EOF
#!/bin/bash
# Manual NASA+ Scraper Runner
cd "$PROJECT_DIR"
echo "🚀 Running NASA+ scraper manually..."
npm run scrape
echo "✅ Manual scrape completed!"
EOF

chmod +x "$PROJECT_DIR/run-scraper.sh"

echo ""
echo "🎉 NASA+ Daily Scraper setup complete!"
echo ""
echo "📋 Setup Summary:"
echo "  • Daily scraping scheduled for 6:00 AM"
echo "  • Data saved to: $PROJECT_DIR/data/"
echo "  • Logs saved to: $PROJECT_DIR/logs/"
echo "  • Manual run: ./run-scraper.sh"
echo "  • Test run: npm run scrape"
echo ""
echo "📊 Current cron jobs:"
crontab -l | grep "nasa-scraper" || echo "  (No NASA scraper jobs found)"
echo ""
echo "🔧 Commands:"
echo "  npm run scrape          - Run scraper manually"
echo "  npm run data:status     - Check data status"
echo "  crontab -l             - View all cron jobs"
echo "  tail -f logs/scraper.log - Monitor scraper logs"
echo ""

# Show next scheduled run
echo "⏰ Next scheduled run: Tomorrow at 6:00 AM"
echo "🚀 Your NASA+ content will update automatically every day!"