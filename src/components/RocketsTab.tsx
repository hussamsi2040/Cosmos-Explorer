"use client";
import { useEffect, useState } from "react";
import { getSpaceXLaunches, getSpaceXRockets } from "../lib/api/spacex";

export default function RocketsTab() {
  const [launches, setLaunches] = useState<any[]>([]);
  const [rockets, setRockets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [launchData, rocketData] = await Promise.all([
          getSpaceXLaunches(),
          getSpaceXRockets(),
        ]);
        setLaunches(launchData.slice(0, 6));
        setRockets(rocketData);
      } catch (e) {
        setError("Could not load SpaceX data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-white p-6">Loading SpaceX data...</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Recent Launches</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {launches.map((launch) => (
            <div key={launch.id} className="bg-white/5 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10">
              <img
                src={launch.links?.patch?.small || "/window.svg"}
                alt={launch.name}
                className="w-16 h-16 object-contain rounded-lg mb-2 bg-white/10 p-2"
              />
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${launch.success ? 'bg-green-500' : launch.success === false ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                <h3 className="text-white font-bold">{launch.name}</h3>
              </div>
              <p className="text-[#9dacb8] text-sm mb-2">{launch.details || 'Launch details coming soon...'}</p>
              <div className="text-[#9dacb8] text-xs">
                {new Date(launch.date_unix * 1000).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Rocket Fleet</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rockets.map((rocket) => (
            <div key={rocket.id} className="bg-white/5 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10">
              <img
                src={rocket.flickr_images?.[0] || "/window.svg"}
                alt={rocket.name}
                className="w-full h-40 object-cover rounded-xl mb-4 bg-white/10"
              />
              <h3 className="text-white font-bold mb-2">{rocket.name}</h3>
              <p className="text-[#9dacb8] text-sm mb-3">{rocket.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/10 rounded p-2">
                  <div className="text-white font-semibold">Height</div>
                  <div className="text-[#9dacb8]">{rocket.height.meters}m</div>
                </div>
                <div className="bg-white/10 rounded p-2">
                  <div className="text-white font-semibold">Mass</div>
                  <div className="text-[#9dacb8]">{rocket.mass.kg.toLocaleString()}kg</div>
                </div>
                <div className="bg-white/10 rounded p-2">
                  <div className="text-white font-semibold">Stages</div>
                  <div className="text-[#9dacb8]">{rocket.stages}</div>
                </div>
                <div className="bg-white/10 rounded p-2">
                  <div className="text-white font-semibold">Cost</div>
                  <div className="text-[#9dacb8]">${rocket.cost_per_launch?.toLocaleString() || 'N/A'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 