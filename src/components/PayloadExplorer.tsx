"use client";
import { useEffect, useState } from "react";
import { getSpaceXLaunches, getSpaceXPayloads, getSpaceXCrew } from "../lib/api/spacex";

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
  orbit_params: {
    reference_system: string;
    regime: string;
    longitude?: number;
    semi_major_axis_km?: number;
    eccentricity?: number;
    periapsis_km?: number;
    apoapsis_km?: number;
    inclination_deg?: number;
    period_min?: number;
    lifespan_years?: number;
    epoch?: string;
    mean_motion?: number;
    raan?: number;
    arg_of_pericenter?: number;
    mean_anomaly?: number;
  };
  dragon?: {
    capsule?: string;
    mass_returned_kg?: number;
    mass_returned_lbs?: number;
    flight_time_sec?: number;
    manifest?: string;
    water_landing?: boolean;
    land_landing?: boolean;
  };
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
  flight_number: number;
  rocket: string;
  launchpad: string;
  crew: string[];
  upcoming: boolean;
}

interface CrewMember {
  id: string;
  name: string;
  agency: string;
  status: string;
}

export default function PayloadExplorer() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [payloads, setPayloads] = useState<Payload[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [selectedPayload, setSelectedPayload] = useState<Payload | null>(null);
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [launchData, payloadData, crewData] = await Promise.all([
          getSpaceXLaunches(30),
          getSpaceXPayloads(),
          getSpaceXCrew()
        ]);
        setLaunches(launchData);
        setPayloads(payloadData);
        setCrew(crewData);
      } catch (e) {
        setError("Could not load payload data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getPayloadForLaunch = (launch: Launch): Payload | undefined => {
    return payloads.find(payload => launch.payloads.includes(payload.id));
  };

  const getCrewForLaunch = (launch: Launch): CrewMember[] => {
    return crew.filter(crewMember => launch.crew.includes(crewMember.id));
  };

  const getPayloadDescription = (payload: Payload, launch: Launch): string => {
    if (payload.name.toLowerCase().includes('starlink')) {
      return `This mission delivered Starlink satellites to expand global internet coverage!`;
    }
    if (payload.name.toLowerCase().includes('dragon')) {
      return `Delivered critical supplies and scientific experiments to the ISS crew!`;
    }
    if (payload.name.toLowerCase().includes('gps')) {
      return `Enhanced global positioning system for military and civilian use!`;
    }
    if (payload.name.toLowerCase().includes('inspiration')) {
      return `First all-civilian mission to orbit Earth, advancing space tourism!`;
    }
    if (payload.type === 'Satellite') {
      return `This mission delivered ${payload.name} to ${payload.orbit}!`;
    }
    if (payload.type === 'Crew') {
      return `Safely transported astronauts to the International Space Station!`;
    }
    if (payload.type === 'Cargo') {
      return `Delivered essential cargo and supplies to space!`;
    }
    return `This mission carried ${payload.name} to ${payload.orbit}!`;
  };

  const filteredLaunches = launches.filter(launch => {
    const payload = getPayloadForLaunch(launch);
    if (!payload) return false;
    
    if (filterType === "all") return true;
    if (filterType === "satellites" && payload.type === "Satellite") return true;
    if (filterType === "crew" && payload.type === "Crew") return true;
    if (filterType === "cargo" && payload.type === "Cargo") return true;
    if (filterType === "starlink" && payload.name.toLowerCase().includes('starlink')) return true;
    return false;
  });

  if (loading) return <div className="text-white p-6">Loading payload explorer...</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">📦 Payload Explorer</h2>
        <p className="text-[#9dacb8] mb-6">Click on any payload to learn what this mission delivered to space!</p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
        <h3 className="text-white font-bold mb-3">🔍 Filter Payloads</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Payloads", emoji: "🚀" },
            { id: "satellites", label: "Satellites", emoji: "🛰️" },
            { id: "crew", label: "Crew Missions", emoji: "👨‍🚀" },
            { id: "cargo", label: "Cargo", emoji: "📦" },
            { id: "starlink", label: "Starlink", emoji: "🌐" }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filterType === filter.id
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
              }`}
            >
              {filter.emoji} {filter.label}
            </button>
          ))}
        </div>
        <div className="text-[#9dacb8] text-sm mt-2">
          Showing {filteredLaunches.length} of {launches.length} missions
        </div>
      </div>

      {/* Payload Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLaunches.map((launch) => {
          const payload = getPayloadForLaunch(launch);
          const missionCrew = getCrewForLaunch(launch);
          
          if (!payload) return null;
          
          return (
            <div
              key={launch.id}
              onClick={() => {
                setSelectedPayload(payload);
                setSelectedLaunch(launch);
              }}
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
                  <span className="text-white">{payload.mass_kg?.toLocaleString() || 'N/A'} kg</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9dacb8]">Orbit:</span>
                  <span className="text-white">{payload.orbit}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9dacb8]">Customer:</span>
                  <span className="text-white">{payload.customers[0] || 'N/A'}</span>
                </div>
                {missionCrew.length > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-[#9dacb8]">Crew:</span>
                    <span className="text-white">{missionCrew.length} members</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-[#9dacb8] text-xs line-clamp-2">
                  {getPayloadDescription(payload, launch)}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  launch.success ? 'bg-green-500' : 
                  launch.success === false ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-[#9dacb8] text-xs">
                  Flight #{launch.flight_number} • {new Date(launch.date_unix * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Payload Detail Modal */}
      {selectedPayload && selectedLaunch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f2e] rounded-xl p-6 max-w-2xl w-full border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{selectedPayload.name}</h3>
              <button
                onClick={() => {
                  setSelectedPayload(null);
                  setSelectedLaunch(null);
                }}
                className="text-[#9dacb8] hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Mission Overview */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">🚀 Mission Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#9dacb8]">Mission:</span>
                    <div className="text-white font-semibold">{selectedLaunch.name}</div>
                  </div>
                  <div>
                    <span className="text-[#9dacb8]">Flight Number:</span>
                    <div className="text-white font-semibold">#{selectedLaunch.flight_number}</div>
                  </div>
                  <div>
                    <span className="text-[#9dacb8]">Date:</span>
                    <div className="text-white font-semibold">
                      {new Date(selectedLaunch.date_unix * 1000).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#9dacb8]">Status:</span>
                    <div className={`font-semibold ${
                      selectedLaunch.success ? 'text-green-400' : 
                      selectedLaunch.success === false ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {selectedLaunch.upcoming ? 'Upcoming' : 
                       selectedLaunch.success ? 'Successful' : 'Failed'}
                    </div>
                  </div>
                </div>
                <p className="text-[#9dacb8] text-sm mt-2">
                  {getPayloadDescription(selectedPayload, selectedLaunch)}
                </p>
              </div>

              {/* Payload Specifications */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-[#9dacb8] text-xs">Type</div>
                  <div className="text-white font-semibold">{selectedPayload.type}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-[#9dacb8] text-xs">Mass</div>
                  <div className="text-white font-semibold">
                    {selectedPayload.mass_kg?.toLocaleString() || 'N/A'} kg
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-[#9dacb8] text-xs">Orbit</div>
                  <div className="text-white font-semibold">{selectedPayload.orbit}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-[#9dacb8] text-xs">Reference System</div>
                  <div className="text-white font-semibold">{selectedPayload.orbit_params?.reference_system || 'N/A'}</div>
                </div>
              </div>

              {/* Customers */}
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-[#9dacb8] text-xs mb-2">Customers</div>
                <div className="flex flex-wrap gap-1">
                  {selectedPayload.customers.map((customer, index) => (
                    <span key={index} className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                      {customer}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nationalities */}
              {selectedPayload.nationalities && selectedPayload.nationalities.length > 0 && (
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-[#9dacb8] text-xs mb-2">Nationalities</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedPayload.nationalities.map((nationality, index) => (
                      <span key={index} className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                        {nationality}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Manufacturers */}
              {selectedPayload.manufacturers && selectedPayload.manufacturers.length > 0 && (
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-[#9dacb8] text-xs mb-2">Manufacturers</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedPayload.manufacturers.map((manufacturer, index) => (
                      <span key={index} className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                        {manufacturer}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Orbit Parameters */}
              {selectedPayload.orbit_params && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">🛰️ Orbit Parameters</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#9dacb8]">Regime:</span>
                      <div className="text-white">{selectedPayload.orbit_params.regime || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-[#9dacb8]">Inclination:</span>
                      <div className="text-white">{selectedPayload.orbit_params.inclination_deg?.toFixed(2) || 'N/A'}°</div>
                    </div>
                    <div>
                      <span className="text-[#9dacb8]">Periapsis:</span>
                      <div className="text-white">{selectedPayload.orbit_params.periapsis_km?.toLocaleString() || 'N/A'} km</div>
                    </div>
                    <div>
                      <span className="text-[#9dacb8]">Apoapsis:</span>
                      <div className="text-white">{selectedPayload.orbit_params.apoapsis_km?.toLocaleString() || 'N/A'} km</div>
                    </div>
                    <div>
                      <span className="text-[#9dacb8]">Period:</span>
                      <div className="text-white">{selectedPayload.orbit_params.period_min?.toFixed(0) || 'N/A'} min</div>
                    </div>
                    <div>
                      <span className="text-[#9dacb8]">Lifespan:</span>
                      <div className="text-white">{selectedPayload.orbit_params.lifespan_years || 'N/A'} years</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dragon Specific Info */}
              {selectedPayload.dragon && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">🐉 Dragon Capsule Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#9dacb8]">Capsule:</span>
                      <div className="text-white">{selectedPayload.dragon.capsule || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-[#9dacb8]">Mass Returned:</span>
                      <div className="text-white">{selectedPayload.dragon.mass_returned_kg?.toLocaleString() || 'N/A'} kg</div>
                    </div>
                    <div>
                      <span className="text-[#9dacb8]">Flight Time:</span>
                      <div className="text-white">{selectedPayload.dragon.flight_time_sec ? Math.floor(selectedPayload.dragon.flight_time_sec / 86400) : 'N/A'} days</div>
                    </div>
                    <div>
                      <span className="text-[#9dacb8]">Landing Type:</span>
                      <div className="text-white">
                        {selectedPayload.dragon.water_landing ? 'Water' : 
                         selectedPayload.dragon.land_landing ? 'Land' : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 