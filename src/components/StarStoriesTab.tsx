import React from "react";

const StarStoriesTab = () => {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
      <h2 className="text-2xl font-bold mb-4">🌌 Star Stories</h2>
      <div className="w-full max-w-xl bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 shadow-lg">
        <p className="mb-4 text-center text-lg">Explore the mythology and stories behind the stars and constellations.</p>
        <div className="aspect-video w-full bg-black/40 rounded-lg flex items-center justify-center">
          {/* TODO: Embed Stellarium Web or interactive sky map here */}
          <span className="text-gray-400">[Sky Map Placeholder]</span>
        </div>
      </div>
    </div>
  );
};

export default StarStoriesTab; 