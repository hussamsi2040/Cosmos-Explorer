"use client";
import { useState } from "react";

export default function SkyMapsTab() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex flex-col gap-6 items-start">
      <h2 className="text-2xl font-bold text-white mb-2">Interactive Sky Map</h2>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4 max-w-2xl w-full">
        <div className="mb-2 text-[#9dacb8]">Explore the night sky in real time. Pan, zoom, and search for stars and constellations.</div>
        <div className="w-full h-[400px] rounded-xl overflow-hidden border border-white/10 bg-black relative">
          {!loaded && <div className="absolute inset-0 flex items-center justify-center text-[#9dacb8]">Loading sky map...</div>}
          <iframe
            src="https://stellarium-web.org/"
            title="Stellarium Web Sky Map"
            className="w-full h-full"
            style={{ minHeight: 400, border: 'none', opacity: loaded ? 1 : 0 }}
            onLoad={() => setLoaded(true)}
            allowFullScreen
          />
        </div>
        <div className="text-xs text-[#9dacb8]">Powered by <a href="https://stellarium-web.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Stellarium Web</a></div>
      </div>
    </div>
  );
} 