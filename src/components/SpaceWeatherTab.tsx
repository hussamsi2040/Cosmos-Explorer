"use client";
import { useEffect, useState } from "react";

const DONKI_API_URL = "https://kauai.ccmc.gsfc.nasa.gov/DONKI/ws/get/FLR?startDate=2024-01-01&endDate=2024-12-31";

async function fetchSpaceWeather() {
  const res = await fetch(DONKI_API_URL);
  const data = await res.json();
  return data;
}

export default function SpaceWeatherTab() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSpaceWeather();
        setEvents(data.slice(-5).reverse());
      } catch (e) {
        setError("Could not load space weather data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-white p-6">Loading space weather data...</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;

  return (
    <div className="flex flex-col gap-6 items-start">
      <h2 className="text-2xl font-bold text-white mb-2">Recent Solar Flares</h2>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4 max-w-xl">
        {events.length === 0 ? (
          <div className="text-[#9dacb8]">No recent solar flare events found.</div>
        ) : (
          events.map((event, idx) => (
            <div key={idx} className="bg-white/10 rounded-lg p-4 mb-2">
              <div className="text-white font-semibold">{event.classType || "Solar Flare"}</div>
              <div className="text-[#9dacb8] text-xs mb-1">{event.beginTime?.slice(0, 10)} {event.beginTime?.slice(11, 16)}</div>
              <div className="text-[#9dacb8] text-sm">Active Region: {event.activeRegionNum || "N/A"}</div>
              <div className="text-[#9dacb8] text-sm">Peak Time: {event.peakTime?.replace("T", " ") || "N/A"}</div>
              <div className="text-[#9dacb8] text-sm">Source: {event.sourceLocation || "N/A"}</div>
            </div>
          ))
        )}
        <div className="text-xs text-[#9dacb8] mt-2">Data from <a href="https://kauai.ccmc.gsfc.nasa.gov/DONKI/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">NASA DONKI API</a></div>
      </div>
    </div>
  );
} 