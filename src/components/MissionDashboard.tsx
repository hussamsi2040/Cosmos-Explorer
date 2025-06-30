"use client";
import { useEffect, useState } from "react";
import { 
  getSpaceXLaunches, 
  getSpaceXUpcomingLaunches, 
  getSpaceXPayloads,
  getSpaceXLaunchpads,
  getSpaceXCrew,
  getSpaceXCompany
} from "../lib/api/spacex";

interface Mission {
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
  upcoming: boolean;
  rocket: string;
  launchpad: string;
  payloads: string[];
  crew: string[];
  flight_number: number;
  date_utc: string;
  fairings?: {
    reused: boolean;
  };
  cores: Array<{
    reused: boolean;
  }>;
}

interface Payload {
  id: string;
  name: string;
  type: string;
  mass_kg: number;
  customers: string[];
  orbit: string;
}

interface Launchpad {
  id: string;
  name: string;
  full_name: string;
  locality: string;
  region: string;
  launch_attempts: number;
  launch_successes: number;
  status: string;
  details: string;
  latitude: number;
  longitude: number;
}

interface CrewMember {
  id: string;
  name: string;
  agency: string;
  status: string;
}

interface Company {
  name: string;
  vehicles: number;
  launch_sites: number;
  employees: number;
  valuation: number;
}

export default function MissionDashboard() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [upcomingMissions, setUpcomingMissions] = useState<Mission[]>([]);
  const [payloads, setPayloads] = useState<Payload[]>([]);
  const [launchpads, setLaunchpads] = useState<Launchpad[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      setError(null);
      try {
        const [
          launchData,
          upcomingData,
          payloadData,
          launchpadData,
          crewData,
          companyData
        ] = await Promise.all([
          getSpaceXLaunches(30),
          getSpaceXUpcomingLaunches(),
          getSpaceXPayloads(),
          getSpaceXLaunchpads(),
          getSpaceXCrew(),
          getSpaceXCompany()
        ]);
        
        setMissions(launchData);
        setUpcomingMissions(upcomingData);
        setPayloads(payloadData);
        setLaunchpads(launchpadData);
        setCrew(crewData);
        setCompany(companyData);
      } catch (e) {
        setError("Could not load mission data.");
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const nextMission = upcomingMissions[0];
      
      if (nextMission) {
        const timeLeft = (nextMission.date_unix * 1000) - now;
        if (timeLeft > 0) {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          
          setTimeUntilNext({ days, hours, minutes, seconds });
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [upcomingMissions]);

  const getPayloadForMission = (mission: Mission) => {
    return payloads.find(payload => mission.payloads.includes(payload.id));
  };

  const getLaunchpadForMission = (mission: Mission) => {
    return launchpads.find(launchpad => launchpad.id === mission.launchpad);
  };

  const getCrewForMission = (mission: Mission) => {
    return crew.filter(crewMember => mission.crew.includes(crewMember.id));
  };

  const pastMissions = missions.filter(m => !m.upcoming);
  const successfulMissions = pastMissions.filter(m => m.success);
  const failedMissions = pastMissions.filter(m => m.success === false);

  if (loading) return <div className="text-white p-6">Loading mission dashboard...</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;

  return (
    <div className="flex flex-col gap-8">
      {/* Company Overview */}
      {company && (
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">🏢 {company.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{company.vehicles}</div>
              <div className="text-[#9dacb8] text-sm">Vehicles</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{company.launch_sites}</div>
              <div className="text-[#9dacb8] text-sm">Launch Sites</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{company.employees}</div>
              <div className="text-[#9dacb8] text-sm">Employees</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">${(company.valuation / 1000000000).toFixed(1)}B</div>
              <div className="text-[#9dacb8] text-sm">Valuation</div>
            </div>
          </div>
        </div>
      )}

      {/* Mission Countdown */}
      {upcomingMissions.length > 0 && (
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">🚀 Next Mission Countdown</h2>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={upcomingMissions[0].links?.patch?.small || "/window.svg"}
              alt={upcomingMissions[0].name}
              className="w-16 h-16 object-contain rounded-lg bg-white/10 p-2"
            />
            <div>
              <h3 className="text-white font-bold text-lg">{upcomingMissions[0].name}</h3>
              <p className="text-blue-300 text-sm">
                Flight #{upcomingMissions[0].flight_number} • {new Date(upcomingMissions[0].date_utc).toLocaleDateString()}
              </p>
              {getLaunchpadForMission(upcomingMissions[0]) && (
                <p className="text-blue-300 text-xs">
                  {getLaunchpadForMission(upcomingMissions[0])?.full_name}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">{timeUntilNext.days}</div>
              <div className="text-blue-300 text-sm">Days</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">{timeUntilNext.hours}</div>
              <div className="text-blue-300 text-sm">Hours</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">{timeUntilNext.minutes}</div>
              <div className="text-blue-300 text-sm">Minutes</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">{timeUntilNext.seconds}</div>
              <div className="text-blue-300 text-sm">Seconds</div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mission Timeline */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">📅 Mission Timeline</h2>
        <div className="space-y-4">
          {missions.slice(0, 10).map((mission) => {
            const payload = getPayloadForMission(mission);
            const launchpad = getLaunchpadForMission(mission);
            const missionCrew = getCrewForMission(mission);
            
            return (
              <div
                key={mission.id}
                className={`bg-white/5 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10 transition-all duration-300 hover:scale-105 hover:bg-white/10 ${
                  mission.upcoming ? 'border-blue-500/30 bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full ${
                      mission.upcoming ? 'bg-blue-500 animate-pulse' :
                      mission.success ? 'bg-green-500' :
                      mission.success === false ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                  </div>
                  <img
                    src={mission.links?.patch?.small || "/window.svg"}
                    alt={mission.name}
                    className="w-12 h-12 object-contain rounded-lg bg-white/10 p-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold">{mission.name}</h3>
                      <span className="text-[#9dacb8] text-xs">#{mission.flight_number}</span>
                    </div>
                    <p className="text-[#9dacb8] text-sm mb-2">{mission.details || 'Mission details coming soon...'}</p>
                    
                    {/* Mission Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-2">
                      {payload && (
                        <div className="bg-white/5 rounded p-2">
                          <span className="text-[#9dacb8]">Payload:</span>
                          <div className="text-white font-semibold">{payload.name}</div>
                          <div className="text-[#9dacb8]">{payload.mass_kg?.toLocaleString()} kg</div>
                        </div>
                      )}
                      {launchpad && (
                        <div className="bg-white/5 rounded p-2">
                          <span className="text-[#9dacb8]">Launch Site:</span>
                          <div className="text-white font-semibold">{launchpad.name}</div>
                          <div className="text-[#9dacb8]">{launchpad.locality}, {launchpad.region}</div>
                        </div>
                      )}
                      {missionCrew.length > 0 && (
                        <div className="bg-white/5 rounded p-2">
                          <span className="text-[#9dacb8]">Crew:</span>
                          <div className="text-white font-semibold">{missionCrew.length} members</div>
                          <div className="text-[#9dacb8]">{missionCrew[0]?.name}</div>
                        </div>
                      )}
                      <div className="bg-white/5 rounded p-2">
                        <span className="text-[#9dacb8]">Date:</span>
                        <div className="text-white font-semibold">
                          {new Date(mission.date_utc).toLocaleDateString()}
                        </div>
                        <div className="text-[#9dacb8]">
                          {new Date(mission.date_utc).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    {/* Status Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#9dacb8] text-xs">
                        {new Date(mission.date_unix * 1000).toLocaleDateString()}
                      </span>
                      {mission.upcoming && (
                        <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                          Upcoming
                        </span>
                      )}
                      {!mission.upcoming && mission.success && (
                        <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                          Successful
                        </span>
                      )}
                      {!mission.upcoming && mission.success === false && (
                        <span className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full">
                          Failed
                        </span>
                      )}
                      {mission.fairings?.reused && (
                        <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded-full">
                          Fairings Reused
                        </span>
                      )}
                      {mission.cores.some(core => core.reused) && (
                        <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                          Core Reused
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Mission Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="text-3xl font-bold text-white mb-2">
            {successfulMissions.length}
          </div>
          <div className="text-[#9dacb8] text-sm">Successful Missions</div>
          <div className="text-green-400 text-xs mt-1">
            {pastMissions.length > 0 ? ((successfulMissions.length / pastMissions.length) * 100).toFixed(1) : 0}% Success Rate
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="text-3xl font-bold text-white mb-2">
            {upcomingMissions.length}
          </div>
          <div className="text-[#9dacb8] text-sm">Upcoming Missions</div>
          <div className="text-blue-400 text-xs mt-1">Next: {upcomingMissions[0]?.name || 'TBD'}</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="text-3xl font-bold text-white mb-2">
            {launchpads.length}
          </div>
          <div className="text-[#9dacb8] text-sm">Launch Sites</div>
          <div className="text-purple-400 text-xs mt-1">Active: {launchpads.filter(lp => lp.status === 'active').length}</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="text-3xl font-bold text-white mb-2">
            {crew.length}
          </div>
          <div className="text-[#9dacb8] text-sm">Crew Members</div>
          <div className="text-orange-400 text-xs mt-1">Active: {crew.filter(c => c.status === 'active').length}</div>
        </div>
      </div>

      {/* Launch Sites Map */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">🌍 Launch Sites</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {launchpads.slice(0, 6).map((launchpad) => (
            <div key={launchpad.id} className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-bold mb-2">{launchpad.full_name}</h3>
              <p className="text-[#9dacb8] text-sm mb-3">{launchpad.details}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#9dacb8]">Location:</span>
                  <div className="text-white">{launchpad.locality}, {launchpad.region}</div>
                </div>
                <div>
                  <span className="text-[#9dacb8]">Launches:</span>
                  <div className="text-white">{launchpad.launch_attempts} attempts</div>
                  <div className="text-green-400">{launchpad.launch_successes} successful</div>
                </div>
                <div>
                  <span className="text-[#9dacb8]">Status:</span>
                  <div className={`${launchpad.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {launchpad.status}
                  </div>
                </div>
                <div>
                  <span className="text-[#9dacb8]">Coordinates:</span>
                  <div className="text-white text-xs">
                    {launchpad.latitude.toFixed(2)}°, {launchpad.longitude.toFixed(2)}°
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 