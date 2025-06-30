"use client";
import { useEffect, useState } from "react";

export default function ISSTrackingTab() {
  const [position, setPosition] = useState<{latitude: number, longitude: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchISS() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://api.open-notify.org/iss-now.json");
        const data = await res.json();
        if (data && data.iss_position) {
          setPosition({
            latitude: parseFloat(data.iss_position.latitude),
            longitude: parseFloat(data.iss_position.longitude),
          });
        } else {
          setError("Could not get ISS position.");
        }
      } catch (e) {
        setError("Could not get ISS position.");
      } finally {
        setLoading(false);
      }
    }
    fetchISS();
    const interval = setInterval(fetchISS, 10000); // update every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-white p-6">Loading ISS position...</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;

  // Use a static map image (OpenStreetMap) with a marker for the ISS
  const mapUrl = position
    ? `https://static-maps.yandex.ru/1.x/?ll=${position.longitude},${position.latitude}&z=2&l=map&size=450,250&pt=${position.longitude},${position.latitude},pm2rdm`
    : "";

  return (
    <div className="flex flex-col gap-6 items-start">
      <h2 className="text-2xl font-bold text-white mb-2">ISS Real-Time Tracking</h2>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4 max-w-xl">
        <div className="flex flex-col gap-2">
          <span className="text-[#9dacb8]">Current ISS Position:</span>
          <span className="text-white font-mono">Lat: {position?.latitude.toFixed(2)}, Lon: {position?.longitude.toFixed(2)}</span>
        </div>
        {mapUrl && (
          <img src={mapUrl} alt="ISS position on map" className="rounded-xl border border-white/10" width={450} height={250} />
        )}
        <div className="text-xs text-[#9dacb8]">Data from <a href="http://open-notify.org/Open-Notify-API/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Open Notify ISS API</a></div>
      </div>
    </div>
  );
} 