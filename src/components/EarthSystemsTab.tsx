import React from "react";

const EarthSystemsTab = () => {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
      <h2 className="text-2xl font-bold mb-4">🌍 Earth Systems</h2>
      <div className="w-full max-w-xl bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 shadow-lg">
        <p className="mb-4 text-center text-lg">Check real-time air quality, pollution, and climate data from around the world.</p>
        <div className="aspect-video w-full bg-blue-100/10 rounded-lg flex items-center justify-center">
          {/* TODO: Show AQI, pollution, and climate data here */}
          <span className="text-gray-400">[Earth Data Placeholder]</span>
        </div>
      </div>
    </div>
  );
};

export default EarthSystemsTab; 