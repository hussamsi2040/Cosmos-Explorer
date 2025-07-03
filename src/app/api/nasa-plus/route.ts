import { NextResponse } from 'next/server';
import { getNASAPlusContent, getDataStatus } from '@/lib/nasa-plus-data-service';

export async function GET() {
  try {
    const content = await getNASAPlusContent();
    const status = getDataStatus();
    
    return NextResponse.json({
      ...content,
      dataStatus: status
    });
  } catch (error) {
    console.error('API Error:', error);
    
    // Return fallback content
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
      source: 'NASA+ API Fallback',
      shows: [],
      liveEvents: [],
      series: [],
      featuredContent: [],
      stats: { totalShows: 0, totalLiveEvents: 0, totalSeries: 0 },
      dataStatus: { isFresh: false, age: Infinity, ageString: 'No data', needsRefresh: true }
    });
  }
}