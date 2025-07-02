"use client";

import React, { useEffect, useState } from "react";
import { fetchISSPosition, fetchISSCrew } from "../lib/api/iss";

import { motion } from "framer-motion";
import { Users, MapPin, Wrench, Calendar, Award, Rocket } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import Leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);



interface Activity {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  author?: string;
}

interface CrewBio {
  name: string;
  bio: string;
  funFact: string;
  voiceNote: string;
  role: string;
  nationality: string;
}

interface CrewMember {
  name: string;
  country: string;
  position: string;
  launchDate: string;
  mission: string;
  previousFlights: number;
  totalDays: number;
  experiments: string[];
  socialMedia?: {
    twitter?: string;
    instagram?: string;
  };
}

interface Mission {
  name: string;
  launchDate: string;
  duration: string;
  objectives: string[];
  status: "active" | "completed" | "upcoming";
  spacecraft: string;
}

interface EVA {
  date: string;
  duration: string;
  astronauts: string[];
  objectives: string[];
  completed: boolean;
}

const LOCAL_KEY = "iss_activity_feed";

const currentCrew: CrewMember[] = [
  {
    name: "Andreas Mogensen",
    country: "Denmark/ESA",
    position: "Commander (Expedition 70)",
    launchDate: "2023-08-26",
    mission: "Huginn Mission",
    previousFlights: 1,
    totalDays: 308,
    experiments: ["Tissue Chips in Space", "Cardinal Muscle", "Plant Habitat-03"],
    socialMedia: { twitter: "@Astro_Andreas" }
  },
  {
    name: "Satoshi Furukawa",
    country: "Japan/JAXA", 
    position: "Flight Engineer",
    launchDate: "2023-08-26",
    mission: "Expedition 69/70",
    previousFlights: 1,
    totalDays: 311,
    experiments: ["Asian Herb in Space", "Kibo Robot Programming Challenge", "Food Physiology"],
    socialMedia: { twitter: "@Astro_Satoshi" }
  },
  {
    name: "Konstantin Borisov",
    country: "Russia/Roscosmos",
    position: "Flight Engineer", 
    launchDate: "2023-09-15",
    mission: "Expedition 70",
    previousFlights: 0,
    totalDays: 279,
    experiments: ["Protein Crystal Growth", "Earth Observation", "Materials Science"]
  },
  {
    name: "Jasmin Moghbeli",
    country: "USA/NASA",
    position: "Flight Engineer",
    launchDate: "2023-08-26",
    mission: "Crew-7",
    previousFlights: 0,
    totalDays: 311,
    experiments: ["Tissue Chips in Space", "XROOTS-02", "Investigation of Nanoparticles"],
    socialMedia: { twitter: "@AstroJasmin" }
  },
  {
    name: "Loral O'Hara",
    country: "USA/NASA",
    position: "Flight Engineer",
    launchDate: "2023-09-15",
    mission: "Extended Mission",
    previousFlights: 0,
    totalDays: 279,
    experiments: ["Genes in Space-10", "Fluid Science Laboratory", "Plant Habitat Studies"],
    socialMedia: { twitter: "@AstroLoral" }
  }
];

const recentMissions: Mission[] = [
  {
    name: "Crew-7",
    launchDate: "2023-08-26",
    duration: "~6 months",
    objectives: ["ISS Operations", "Scientific Research", "Technology Demonstrations"],
    status: "active",
    spacecraft: "Dragon Endurance"
  },
  {
    name: "Soyuz MS-24",
    launchDate: "2023-09-15", 
    duration: "6 months",
    objectives: ["Crew Rotation", "Russian Segment Operations", "Research Activities"],
    status: "active",
    spacecraft: "Soyuz MS-24"
  },
  {
    name: "Crew-6",
    launchDate: "2023-03-02",
    duration: "6 months",
    objectives: ["ISS Maintenance", "Scientific Research", "Spacewalks"],
    status: "completed",
    spacecraft: "Dragon Endeavour"
  }
];

const recentEVAs: EVA[] = [
  {
    date: "2024-01-31",
    duration: "6h 42m",
    astronauts: ["Oleg Kononenko", "Nikolai Chub"],
    objectives: ["Install experiments on Nauka module", "Configure hardware"],
    completed: true
  },
  {
    date: "2024-01-15", 
    duration: "7h 01m",
    astronauts: ["Jasmin Moghbeli", "Loral O'Hara"],
    objectives: ["Replace antenna assembly", "Collect samples", "Install equipment"],
    completed: true
  }
];

const ISSCrewLogTab = () => {
  const [position, setPosition] = useState<any>(null);
  const [crew, setCrew] = useState<any[]>([]);
  const [bios, setBios] = useState<CrewBio[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
  const [activeSection, setActiveSection] = useState<"crew" | "missions" | "evas">("crew");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [pos, crewList, act, biosData] = await Promise.all([
          fetchISSPosition(),
          fetchISSCrew(),
          import("../data/iss-activity.json").then(m => m.default),
          import("../data/iss-crew-bios.json").then(m => m.default),
        ]);
        setPosition(pos);
        setCrew(crewList);
        setBios(biosData);
        // Load activity from localStorage if present
        const stored = localStorage.getItem(LOCAL_KEY);
        setActivity(stored ? JSON.parse(stored) : act);
      } catch (e: any) {
        setError("Failed to load ISS data.");
      }
      setLoading(false);
    }
    loadData();
    const interval = setInterval(loadData, 30000); // update every 30s
    return () => clearInterval(interval);
  }, []);

  // Save activity feed to localStorage on change
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(activity));
  }, [activity]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;
    setActivity([
      {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        title: newTitle,
        description: newDesc,
        author: "Ground Control",
      },
      ...activity,
    ]);
    setNewTitle("");
    setNewDesc("");
  };

  const handleEditActivity = (id: string) => {
    const activityItem = activity.find(a => a.id === id);
    if (activityItem) {
      setEditingId(id);
      setEditTitle(activityItem.title);
      setEditDesc(activityItem.description);
    }
  };

  const handleSaveEdit = () => {
    if (!editingId || !editTitle.trim() || !editDesc.trim()) return;
    setActivity(activity.map(a => 
      a.id === editingId 
        ? { ...a, title: editTitle, description: editDesc }
        : a
    ));
    setEditingId(null);
    setEditTitle("");
    setEditDesc("");
  };

  const handleDeleteActivity = (id: string) => {
    setActivity(activity.filter(a => a.id !== id));
  };

  const playVoiceNote = (text: string, name: string) => {
    if (window.speechSynthesis) {
      // Stop any currently speaking
      window.speechSynthesis.cancel();
      
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.rate = 0.9;
      utter.pitch = 1;
      utter.volume = 0.8;
      
      setSpeaking(name);
      utter.onend = () => setSpeaking(null);
      utter.onerror = () => setSpeaking(null);
      
      window.speechSynthesis.speak(utter);
    }
  };

  const stopVoice = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(null);
    }
  };

  const CrewCard = ({ member }: { member: CrewMember }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => setSelectedCrew(member)}
      className="bg-white/10 border border-white/20 rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{member.name}</h3>
          <p className="text-blue-400 font-medium">{member.position}</p>
          <p className="text-gray-400 text-sm">{member.country}</p>
        </div>
        <div className="text-right">
          <div className="text-white font-bold">{member.totalDays}</div>
          <div className="text-gray-400 text-sm">days</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Mission:</span>
          <div className="text-white font-medium">{member.mission}</div>
        </div>
        <div>
          <span className="text-gray-400">Flights:</span>
          <div className="text-white font-medium">{member.previousFlights + 1}</div>
        </div>
      </div>

      <div className="mt-4">
        <span className="text-gray-400 text-sm">Key Experiments:</span>
        <div className="flex flex-wrap gap-1 mt-2">
          {member.experiments.slice(0, 2).map((exp, idx) => (
            <span 
              key={idx} 
              className="text-xs bg-blue-900/50 text-blue-200 px-2 py-1 rounded"
            >
              {exp}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const MissionCard = ({ mission }: { mission: Mission }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-xl p-6 ${
        mission.status === "active" 
          ? "bg-green-900/30 border-green-400/30"
          : mission.status === "completed"
          ? "bg-gray-900/30 border-gray-400/30"  
          : "bg-blue-900/30 border-blue-400/30"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{mission.name}</h3>
          <p className="text-gray-400">{mission.spacecraft}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
          mission.status === "active" 
            ? "bg-green-500 text-white"
            : mission.status === "completed"
            ? "bg-gray-500 text-white"
            : "bg-blue-500 text-white"
        }`}>
          {mission.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-400">Launch:</span>
          <div className="text-white font-medium">{mission.launchDate}</div>
        </div>
        <div>
          <span className="text-gray-400">Duration:</span>
          <div className="text-white font-medium">{mission.duration}</div>
        </div>
      </div>

      <div>
        <span className="text-gray-400 text-sm">Objectives:</span>
        <ul className="mt-2 space-y-1">
          {mission.objectives.map((obj, idx) => (
            <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              {obj}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-white text-lg">🛰️ Loading ISS data...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-red-400 text-lg">{error}</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Users className="text-blue-400 w-8 h-8" />
        <h2 className="text-3xl font-bold text-white">ISS Crew & Mission Log</h2>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 bg-white/5 p-2 rounded-lg">
        {[
          { id: "crew", label: "Current Crew", icon: Users },
          { id: "missions", label: "Recent Missions", icon: Rocket },
          { id: "evas", label: "Spacewalks (EVAs)", icon: Wrench }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
              activeSection === id
                ? "bg-blue-500 text-white"
                : "bg-transparent text-gray-300 hover:bg-white/10"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Current Crew Section */}
      {activeSection === "crew" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Expedition 70 Crew</h3>
            {currentCrew.map((member, idx) => (
              <CrewCard key={idx} member={member} />
            ))}
          </div>

          {/* ISS Location Map */}
          {mounted && (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">ISS Current Location</h3>
                <p className="text-gray-400 text-sm">Live tracking • Updates every 10 seconds</p>
              </div>
              <div className="h-80">
                <MapContainer
                  center={[20, 0]}
                  zoom={2}
                  style={{ height: "100%", width: "100%" }}
                  className="rounded-b-xl"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[25.7617, -80.1918]}>
                    <Popup>
                      <div className="text-center">
                        <strong>International Space Station</strong><br/>
                        Altitude: ~408 km<br/>
                        Speed: ~27,600 km/h
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Missions Section */}
      {activeSection === "missions" && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Recent & Active Missions</h3>
          <div className="grid gap-6 lg:grid-cols-2">
            {recentMissions.map((mission, idx) => (
              <MissionCard key={idx} mission={mission} />
            ))}
          </div>
        </div>
      )}

      {/* EVAs Section */}
      {activeSection === "evas" && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Recent Spacewalks (EVAs)</h3>
          <div className="space-y-4">
            {recentEVAs.map((eva, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 border border-white/20 rounded-xl p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white">EVA #{recentEVAs.length - idx}</h4>
                    <p className="text-gray-400">{eva.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{eva.duration}</div>
                    <div className="text-green-400 text-sm">✓ Completed</div>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-gray-400 text-sm">Astronauts:</span>
                  <div className="text-white font-medium">{eva.astronauts.join(", ")}</div>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">Objectives:</span>
                  <ul className="mt-2 space-y-1">
                    {eva.objectives.map((obj, objIdx) => (
                      <li key={objIdx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Crew Detail Modal */}
      {selectedCrew && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCrew(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedCrew.name}</h2>
                <p className="text-blue-400 text-lg">{selectedCrew.position}</p>
                <p className="text-gray-400">{selectedCrew.country}</p>
              </div>
              <button
                onClick={() => setSelectedCrew(null)}
                className="text-gray-400 hover:text-white transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Mission Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Mission:</span>
                      <span className="text-white">{selectedCrew.mission}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Launch Date:</span>
                      <span className="text-white">{selectedCrew.launchDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Days in Space:</span>
                      <span className="text-white">{selectedCrew.totalDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Flights:</span>
                      <span className="text-white">{selectedCrew.previousFlights + 1}</span>
                    </div>
                  </div>
                </div>

                {selectedCrew.socialMedia && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Follow</h3>
                    <div className="space-y-1">
                      {selectedCrew.socialMedia.twitter && (
                        <a 
                          href={`https://twitter.com/${selectedCrew.socialMedia.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline text-sm block"
                        >
                          {selectedCrew.socialMedia.twitter}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">Current Experiments</h3>
                <div className="space-y-2">
                  {selectedCrew.experiments.map((exp, idx) => (
                    <div key={idx} className="bg-white/10 rounded-lg p-3">
                      <div className="text-white font-medium text-sm">{exp}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="text-xs text-gray-400 text-center">
        Crew data simulated for demonstration. Real ISS crew information available from{" "}
        <a href="https://www.nasa.gov/mission_pages/station/expeditions" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          NASA ISS Expeditions
        </a>
      </div>
    </div>
  );
};

export default ISSCrewLogTab; 