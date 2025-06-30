"use client";
import { useEffect, useState } from "react";

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || process.env.NASA_API_KEY;

async function fetchMarsPhoto() {
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${NASA_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.latest_photos?.[0] || null;
}

async function fetchMarsWeather() {
  const url = `https://api.nasa.gov/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`;
  const res = await fetch(url);
  const data = await res.json();
  // Get the latest sol (Martian day)
  const sol = data.sol_keys?.[data.sol_keys.length - 1];
  return sol ? data[sol] : null;
}

export default function PlanetaryDataTab() {
  const [photo, setPhoto] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [p, w] = await Promise.all([
          fetchMarsPhoto(),
          fetchMarsWeather(),
        ]);
        setPhoto(p);
        setWeather(w);
      } catch (e) {
        setError("Could not load Mars data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-white p-6">Loading Mars data...</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;

  return (
    <div className="flex flex-col gap-6 items-start">
      <h2 className="text-2xl font-bold text-white mb-2">Mars Rover & Weather</h2>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4 max-w-xl">
        {photo ? (
          <>
            <img src={photo.img_src} alt="Mars Rover" className="rounded-xl border border-white/10 mb-2" />
            <div className="text-white font-semibold">{photo.rover.name} Rover</div>
            <div className="text-[#9dacb8] text-xs mb-2">{photo.earth_date}</div>
          </>
        ) : (
          <div className="text-[#9dacb8]">No recent Mars rover photo available.</div>
        )}
        {weather ? (
          <div className="mt-2">
            <div className="text-white font-semibold mb-1">Latest Mars Weather</div>
            <div className="text-[#9dacb8] text-sm">Sol: {weather.sol}</div>
            <div className="text-[#9dacb8] text-sm">Avg Temp: {weather.AT?.av}°C</div>
            <div className="text-[#9dacb8] text-sm">Pressure: {weather.PRE?.av} Pa</div>
            <div className="text-[#9dacb8] text-sm">Season: {weather.Season}</div>
          </div>
        ) : (
          <div className="text-[#9dacb8]">No recent Mars weather data available.</div>
        )}
        <div className="text-xs text-[#9dacb8] mt-2">Data from <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">NASA APIs</a></div>
      </div>
    </div>
  );
} 