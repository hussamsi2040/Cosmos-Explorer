"use client";
import { useEffect, useState } from "react";
import { getSpaceXLaunches, getSpaceXRockets } from "../lib/api/spacex";

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
  rocket: string;
}

interface Rocket {
  id: string;
  name: string;
  description: string;
  height: { meters: number };
  mass: { kg: number };
  cost_per_launch: number;
  flickr_images: string[];
}

interface GameState {
  selectedMission: Mission | null;
  selectedRocket: Rocket | null;
  fuelLevel: number;
  isLaunching: boolean;
  launchResult: 'success' | 'failure' | null;
  score: number;
  launchCount: number;
}

export default function LaunchGameComponent() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    selectedMission: null,
    selectedRocket: null,
    fuelLevel: 100,
    isLaunching: false,
    launchResult: null,
    score: 0,
    launchCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [launchData, rocketData] = await Promise.all([
          getSpaceXLaunches(),
          getSpaceXRockets(),
        ]);
        setMissions(launchData.slice(0, 6));
        setRockets(rocketData);
      } catch (e) {
        setError("Could not load game data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectMission = (mission: Mission) => {
    setGameState(prev => ({
      ...prev,
      selectedMission: mission,
      launchResult: null
    }));
  };

  const selectRocket = (rocket: Rocket) => {
    setGameState(prev => ({
      ...prev,
      selectedRocket: rocket,
      launchResult: null
    }));
  };

  const adjustFuel = (amount: number) => {
    setGameState(prev => ({
      ...prev,
      fuelLevel: Math.max(0, Math.min(100, prev.fuelLevel + amount))
    }));
  };

  const launchMission = () => {
    if (!gameState.selectedMission || !gameState.selectedRocket) return;

    setGameState(prev => ({ ...prev, isLaunching: true, launchResult: null }));

    // Simulate launch sequence
    setTimeout(() => {
      const success = Math.random() > 0.3 && gameState.fuelLevel > 20;
      const scoreGain = success ? 
        Math.floor((gameState.fuelLevel / 100) * 100) + 50 : 
        Math.floor(gameState.fuelLevel / 10);

      setGameState(prev => ({
        ...prev,
        isLaunching: false,
        launchResult: success ? 'success' : 'failure',
        score: prev.score + scoreGain,
        launchCount: prev.launchCount + 1
      }));
    }, 3000);
  };

  const resetGame = () => {
    setGameState({
      selectedMission: null,
      selectedRocket: null,
      fuelLevel: 100,
      isLaunching: false,
      launchResult: null,
      score: 0,
      launchCount: 0
    });
  };

  if (loading) return <div className="text-white p-6">Loading launch game...</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;

  return (
    <div className="flex flex-col gap-8">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-white mb-4">🎮 Launch Game</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{gameState.score}</div>
            <div className="text-[#9dacb8] text-sm">Score</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{gameState.launchCount}</div>
            <div className="text-[#9dacb8] text-sm">Launches</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{gameState.fuelLevel}%</div>
            <div className="text-[#9dacb8] text-sm">Fuel</div>
          </div>
        </div>
      </div>

      {/* Mission Selection */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">🚀 Select Your Mission</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => (
            <div
              key={mission.id}
              onClick={() => selectMission(mission)}
              className={`bg-white/5 backdrop-blur-md rounded-xl p-4 shadow-lg border cursor-pointer transition-all duration-300 hover:scale-105 ${
                gameState.selectedMission?.id === mission.id
                  ? 'border-blue-500 bg-blue-900/20'
                  : 'border-white/10 hover:bg-white/10'
              }`}
            >
              <img
                src={mission.links?.patch?.small || "/window.svg"}
                alt={mission.name}
                className="w-16 h-16 object-contain rounded-lg mb-3 bg-white/10 p-2 mx-auto"
              />
              <h4 className="text-white font-bold text-center mb-2">{mission.name}</h4>
              <p className="text-[#9dacb8] text-xs text-center line-clamp-2">
                {mission.details || 'Mission details coming soon...'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Rocket Selection */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">🚀 Select Your Rocket</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rockets.map((rocket) => (
            <div
              key={rocket.id}
              onClick={() => selectRocket(rocket)}
              className={`bg-white/5 backdrop-blur-md rounded-xl p-4 shadow-lg border cursor-pointer transition-all duration-300 hover:scale-105 ${
                gameState.selectedRocket?.id === rocket.id
                  ? 'border-green-500 bg-green-900/20'
                  : 'border-white/10 hover:bg-white/10'
              }`}
            >
              <img
                src={rocket.flickr_images?.[0] || "/window.svg"}
                alt={rocket.name}
                className="w-full h-32 object-cover rounded-lg mb-3 bg-white/10"
              />
              <h4 className="text-white font-bold mb-2">{rocket.name}</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#9dacb8]">Height:</span>
                  <span className="text-white ml-1">{rocket.height.meters}m</span>
                </div>
                <div>
                  <span className="text-[#9dacb8]">Cost:</span>
                  <span className="text-white ml-1">${rocket.cost_per_launch?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fuel Control */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">⛽ Fuel Control</h3>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => adjustFuel(-10)}
            disabled={gameState.fuelLevel <= 0}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-bold"
          >
            -10%
          </button>
          <div className="flex-1">
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${gameState.fuelLevel}%` }}
              ></div>
            </div>
            <div className="text-center text-white font-bold mt-2">{gameState.fuelLevel}%</div>
          </div>
          <button
            onClick={() => adjustFuel(10)}
            disabled={gameState.fuelLevel >= 100}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-bold"
          >
            +10%
          </button>
        </div>
      </div>

      {/* Launch Controls */}
      <div className="flex gap-4">
        <button
          onClick={launchMission}
          disabled={!gameState.selectedMission || !gameState.selectedRocket || gameState.isLaunching}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300"
        >
          {gameState.isLaunching ? '🚀 LAUNCHING...' : '🚀 LAUNCH MISSION'}
        </button>
        <button
          onClick={resetGame}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-4 rounded-xl font-bold"
        >
          Reset
        </button>
      </div>

      {/* Launch Animation */}
      {gameState.isLaunching && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1f2e] rounded-xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-4 animate-bounce">🚀</div>
            <h3 className="text-2xl font-bold text-white mb-2">Launch Sequence Initiated</h3>
            <p className="text-[#9dacb8]">Mission: {gameState.selectedMission?.name}</p>
            <p className="text-[#9dacb8]">Rocket: {gameState.selectedRocket?.name}</p>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Launch Result */}
      {gameState.launchResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1f2e] rounded-xl p-8 border border-white/20 text-center max-w-md">
            <div className={`text-6xl mb-4 ${gameState.launchResult === 'success' ? 'animate-bounce' : 'animate-pulse'}`}>
              {gameState.launchResult === 'success' ? '🎉' : '💥'}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {gameState.launchResult === 'success' ? 'Mission Successful!' : 'Mission Failed'}
            </h3>
            <p className="text-[#9dacb8] mb-4">
              {gameState.launchResult === 'success' 
                ? 'Your rocket reached orbit successfully!' 
                : 'The rocket encountered issues during launch.'}
            </p>
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <div className="text-white font-bold">Score Gained: +{gameState.launchResult === 'success' ? Math.floor((gameState.fuelLevel / 100) * 100) + 50 : Math.floor(gameState.fuelLevel / 10)}</div>
            </div>
            <button
              onClick={() => setGameState(prev => ({ ...prev, launchResult: null }))}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Game Instructions */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">📋 How to Play</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="text-white font-semibold mb-2">🎯 Objective</h4>
            <ul className="text-[#9dacb8] text-sm space-y-1">
              <li>• Select a mission and rocket</li>
              <li>• Adjust fuel levels (20%+ for success)</li>
              <li>• Launch and earn points</li>
              <li>• Higher fuel = better success chance</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">🏆 Scoring</h4>
            <ul className="text-[#9dacb8] text-sm space-y-1">
              <li>• Successful launch: 50-150 points</li>
              <li>• Failed launch: 0-10 points</li>
              <li>• More fuel = higher score</li>
              <li>• Track your total score!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 