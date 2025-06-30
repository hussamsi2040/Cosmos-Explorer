import React from "react";

const LunarLabTab = () => {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
      <h2 className="text-2xl font-bold mb-4">🌙 Lunar Lab</h2>
      <div className="w-full max-w-xl bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 shadow-lg">
        <p className="mb-4 text-center text-lg">Discover moon phases, surface features, and lunar missions.</p>
        <div className="aspect-video w-full bg-gray-100/10 rounded-lg flex items-center justify-center">
          {/* TODO: Show moon phase, surface map, and mission data here */}
          <span className="text-gray-400">[Lunar Data Placeholder]</span>
        </div>
      </div>
    </div>
  );
};

export default LunarLabTab; 