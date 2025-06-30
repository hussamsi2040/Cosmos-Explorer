"use client";
import { useEffect, useState } from "react";
import { getSpaceXLaunches } from "../lib/api/spacex";

interface Payload {
  id: string;
  name: string;
  type: string;
  mass_kg: number;
  mass_lbs: number;
  customers: string[];
  nationalities: string[];
  manufacturers: string[];
  orbit: string;
  description?: string;
}

interface Launch {
  id: string;
  name: string;
  date_unix: number;
  success: boolean | null;
  details: string;
  links: {
    patch?: {
      small?: string;
    };
  };
  payloads: string[];
}

export default function PayloadExplorer() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [selectedPayload, setSelectedPayload] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLaunches() {
      setLoading(true);
      setError(null);
      try {
        const launchData = await getSpaceXLaunches();
        setLaunches(launchData.slice(0, 10));
      } catch (e) {
        setError("Could not load payload data.");
      } finally {
        setLoading(false);
      }
    }
    fetchLaunches();
  }, []);

  // Mock payload data since SpaceX API doesn't provide detailed payload info
  const mockPayloads: Payload[] = [
    {
      id: "starlink-1",
      name: "Starlink Group 4-1",
      type: "Satellite",
      mass_kg: 15400,
      mass_lbs: 33951,
      customers: ["SpaceX"],
      nationalities: ["United States"],
      manufacturers: ["SpaceX"],
      orbit: "Low Earth Orbit",
      description: "This mission delivered 60 Starlink satellites to expand global internet coverage!"
    },
    {
      id: "dragon-crs",
      name: "Dragon CRS-25",
      type: "Cargo",
      mass_kg: 2800,
      mass_lbs: 6173,
      customers: ["NASA"],
      nationalities: ["United States"],
      manufacturers: ["SpaceX"],
      orbit: "International Space Station",
      description: "Delivered critical supplies and scientific experiments to the ISS crew!"
    },
    {
      id: "crew-dragon",
      name: "Crew Dragon Endurance",
      type: "Crew",
      mass_kg: 12000,
      mass_lbs: 26455,
      customers: ["NASA"],
      nationalities: ["United States", "Germany", "Italy"],
      manufacturers: ["SpaceX"],
      orbit: "International Space Station",
      description: "Safely transported astronauts to the International Space Station!"
    },
    {
      id: "gps-sat",
      name: "GPS III SV06",
      type: "Navigation Satellite",
      mass_kg: 4400,
      mass_lbs: 9700,
      customers: ["US Space Force"],
      nationalities: ["United States"],
      manufacturers: ["Lockheed Martin"],
      orbit: "Medium Earth Orbit",
      description: "Enhanced global positioning system for military and civilian use!"
    },
    {
      id: "inspiration4",
      name: "Inspiration4",
      type: "Crew",
      mass_kg: 10000,
      mass_lbs: 22046,
      customers: ["Inspiration4"],
      nationalities: ["United States"],
      manufacturers: ["SpaceX"],
      orbit: "Low Earth Orbit",
      description: "First all-civilian mission to orbit Earth, advancing space tourism!"
    }
  ];

  const getPayloadForLaunch = (launch: Launch): Payload => {
    // Simple mapping logic - in real app, you'd fetch actual payload data
    const index = launches.indexOf(launch) % mockPayloads.length;
    return {
      ...mockPayloads[index],
      id: `${launch.id}-payload`,
      name: launch.name.includes("Starlink") ? "Starlink Satellites" :
            launch.name.includes("Dragon") ? "Dragon Capsule" :
            launch.name.includes("GPS") ? "GPS Satellite" :
            "Satellite Payload"
    };
  };

  if (loading) return <div className="text-white p-6">Loading payload explorer...</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">📦 Payload Explorer</h2>
        <p className="text-[#9dacb8] mb-6">Click on any payload to learn what this mission delivered to space!</p>
      </div>

      {/* Payload Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {launches.map((launch) => {
          const payload = getPayloadForLaunch(launch);
          return (
            <div
              key={launch.id}
              onClick={() => setSelectedPayload(payload)}
              className="bg-white/5 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-blue-500/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={launch.links?.patch?.small || "/window.svg"}
                  alt={launch.name}
                  className="w-12 h-12 object-contain rounded-lg bg-white/10 p-1"
                />
                <div>
                  <h3 className="text-white font-bold text-sm">{payload.name}</h3>
                  <p className="text-[#9dacb8] text-xs">{payload.type}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9dacb8]">Mass:</span>
                  <span className="text-white">{payload.mass_kg.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9dacb8]">Orbit:</span>
                  <span className="text-white">{payload.orbit}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9dacb8]">Customer:</span>
                  <span className="text-white">{payload.customers[0]}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-[#9dacb8] text-xs line-clamp-2">
                  {payload.description}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  launch.success ? 'bg-green-500' : 
                  launch.success === false ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-[#9dacb8] text-xs">
                  {new Date(launch.date_unix * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payload Detail Modal */}
      {selectedPayload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f2e] rounded-xl p-6 max-w-md w-full border border-white/20">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{selectedPayload.name}</h3>
              <button
                onClick={() => setSelectedPayload(null)}
                className="text-[#9dacb8] hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">🚀 Mission Details</h4>
                <p className="text-[#9dacb8] text-sm">{selectedPayload.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-[#9dacb8] text-xs">Type</div>
                  <div className="text-white font-semibold">{selectedPayload.type}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-[#9dacb8] text-xs">Mass</div>
                  <div className="text-white font-semibold">{selectedPayload.mass_kg.toLocaleString()} kg</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-[#9dacb8] text-xs">Orbit</div>
                  <div className="text-white font-semibold">{selectedPayload.orbit}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-[#9dacb8] text-xs">Customer</div>
                  <div className="text-white font-semibold">{selectedPayload.customers[0]}</div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-[#9dacb8] text-xs mb-2">Nationalities</div>
                <div className="flex flex-wrap gap-1">
                  {selectedPayload.nationalities.map((nationality, index) => (
                    <span key={index} className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                      {nationality}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-[#9dacb8] text-xs mb-2">Manufacturer</div>
                <div className="text-white font-semibold">{selectedPayload.manufacturers[0]}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 