import React from "react";

const ScienceExperimentsTab = () => {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
      <h2 className="text-2xl font-bold mb-4">🔬 Science Experiments</h2>
      <div className="w-full max-w-xl bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 shadow-lg">
        <p className="mb-4 text-center text-lg">Try interactive simulations and experiments about space science.</p>
        <div className="aspect-video w-full bg-green-100/10 rounded-lg flex items-center justify-center">
          {/* TODO: Add interactive P5.js or Three.js simulations here */}
          <span className="text-gray-400">[Experiments Placeholder]</span>
        </div>
      </div>
    </div>
  );
};

export default ScienceExperimentsTab; 