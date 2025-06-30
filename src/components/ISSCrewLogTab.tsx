"use client";

import React, { useEffect, useState } from "react";
import { fetchISSPosition, fetchISSCrew } from "../lib/api/iss";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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

const LOCAL_KEY = "iss_activity_feed";

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
    <div className="p-6 flex flex-col items-center min-h-[400px]">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        🛰️ Live from Space: ISS Crew Log
      </h2>
      
      <div className="w-full max-w-6xl grid gap-8">
        {/* Real-Time ISS Map */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-200 flex items-center">
            🌍 Real-Time ISS Tracking
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <p className="text-gray-200">
                <span className="font-semibold">Latitude:</span> {position?.latitude?.toFixed(4)}°
              </p>
              <p className="text-gray-200">
                <span className="font-semibold">Longitude:</span> {position?.longitude?.toFixed(4)}°
              </p>
              <p className="text-gray-200">
                <span className="font-semibold">Altitude:</span> {position?.altitude?.toFixed(1)} km
              </p>
              <p className="text-gray-200">
                <span className="font-semibold">Velocity:</span> {position?.velocity?.toFixed(0)} km/h
              </p>
            </div>
            <div className="text-sm text-gray-300">
              <p>🛰️ The International Space Station orbits Earth every 90 minutes</p>
              <p>🌍 It travels at about 28,000 km/h (17,500 mph)</p>
              <p>📡 Live data updates every 30 seconds</p>
            </div>
          </div>
          <div className="w-full h-80 rounded-lg overflow-hidden border border-white/20">
            {position && (
              <MapContainer 
                center={[position.latitude, position.longitude]} 
                zoom={3} 
                style={{ height: "100%", width: "100%" }} 
                scrollWheelZoom={false}
                className="z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[position.latitude, position.longitude]}>
                  <Popup>
                    <div className="text-center">
                      <div className="font-bold text-lg">🛰️ ISS</div>
                      <div>Lat: {position.latitude.toFixed(2)}°</div>
                      <div>Lon: {position.longitude.toFixed(2)}°</div>
                      <div>Alt: {position.altitude.toFixed(1)} km</div>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            )}
          </div>
        </div>

        {/* Meet the Crew */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-200 flex items-center">
            👨‍🚀 Meet the Crew
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {crew.map((c, i) => {
              const bio = bios.find(b => 
                b.name.toLowerCase().includes(c.name.toLowerCase()) ||
                c.name.toLowerCase().includes(b.name.toLowerCase())
              );
              return (
                <div key={i} className="bg-white/10 rounded-lg p-4 border border-white/20 hover:bg-white/15 transition">
                  <div className="font-bold text-white text-lg mb-1">{c.name}</div>
                  <div className="text-blue-300 text-sm mb-2">{c.craft}</div>
                  {bio && (
                    <>
                      <div className="text-gray-200 text-sm mb-2">{bio.bio}</div>
                      <div className="text-yellow-300 text-xs mb-2">
                        <span className="font-semibold">Fun Fact:</span> {bio.funFact}
                      </div>
                      <div className="text-purple-300 text-xs mb-3">
                        <span className="font-semibold">Role:</span> {bio.role} • {bio.nationality}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition flex items-center gap-1"
                          onClick={() => playVoiceNote(bio.voiceNote, bio.name)}
                          disabled={speaking === bio.name}
                        >
                          {speaking === bio.name ? "🔊" : "▶️"} 
                          {speaking === bio.name ? "Playing..." : "Voice Note"}
                        </button>
                        {speaking && (
                          <button
                            className="px-2 py-1 rounded bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition"
                            onClick={stopVoice}
                          >
                            ⏹️ Stop
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ISS Activity Feed */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-200 flex items-center">
            📝 ISS Activity Feed
          </h3>
          <form onSubmit={handleAddActivity} className="flex flex-col gap-3 mb-6 p-4 bg-white/5 rounded-lg">
            <input
              type="text"
              className="px-3 py-2 rounded border border-white/20 bg-white/10 text-white placeholder-gray-400"
              placeholder="Activity Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              required
            />
            <textarea
              className="px-3 py-2 rounded border border-white/20 bg-white/10 text-white placeholder-gray-400 resize-none"
              placeholder="Description"
              rows={3}
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition self-end"
            >
              ➕ Add Activity
            </button>
          </form>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activity.map((a) => (
              <div key={a.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                {editingId === a.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded border border-white/20 bg-white/10 text-white"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                    />
                    <textarea
                      className="w-full px-3 py-2 rounded border border-white/20 bg-white/10 text-white resize-none"
                      rows={3}
                      value={editDesc}
                      onChange={e => setEditDesc(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 rounded bg-green-500 text-white text-xs font-bold hover:bg-green-600"
                        onClick={handleSaveEdit}
                      >
                        💾 Save
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-gray-500 text-white text-xs font-bold hover:bg-gray-600"
                        onClick={() => setEditingId(null)}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-white text-lg">{a.title}</div>
                      <div className="flex gap-1">
                        <button
                          className="px-2 py-1 rounded bg-blue-500 text-white text-xs font-bold hover:bg-blue-600"
                          onClick={() => handleEditActivity(a.id)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="px-2 py-1 rounded bg-red-500 text-white text-xs font-bold hover:bg-red-600"
                          onClick={() => handleDeleteActivity(a.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    <div className="text-gray-300 text-xs mb-2">
                      {new Date(a.timestamp).toLocaleString()} • {a.author || "ISS Crew"}
                    </div>
                    <div className="text-gray-200 text-sm">{a.description}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISSCrewLogTab; 