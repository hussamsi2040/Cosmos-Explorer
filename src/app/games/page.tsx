"use client";

import React, { useState } from "react";
import LaunchGame from "../../components/LaunchGame";
import Link from "next/link";

const GamesPage = () => {
  const [activeGame, setActiveGame] = useState("launch");

  const games = [
    { 
      id: "launch", 
      label: "🚀 Launch Game", 
      description: "Pick a mission, fuel it, and launch with simple animations",
      component: LaunchGame,
      featured: true
    },
    { 
      id: "coming-soon-1", 
      label: "🛸 Space Navigation", 
      description: "Navigate through asteroid fields and space debris",
      component: null,
      featured: false
    },
    { 
      id: "coming-soon-2", 
      label: "🌍 Planet Builder", 
      description: "Create and terraform your own planets",
      component: null,
      featured: false
    },
    { 
      id: "coming-soon-3", 
      label: "⭐ Constellation Quest", 
      description: "Connect stars to form constellations and learn their stories",
      component: null,
      featured: false
    }
  ];

  const ActiveGame = games.find(game => game.id === activeGame)?.component;

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111418] dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#292f38] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Cosmic Classroom</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link href="/cosmos-explorer" className="text-white text-sm font-medium leading-normal">Today</Link>
              <Link href="/cosmos-explorer/nasa-tv" className="text-white text-sm font-medium leading-normal">NASA TV</Link>
              <Link href="/tracker" className="text-white text-sm font-medium leading-normal">Tracker</Link>
              <Link href="/events" className="text-white text-sm font-medium leading-normal">Events</Link>
              <Link href="/games" className="text-white text-sm font-medium leading-normal">Games</Link>
            </div>
            <div className="flex gap-2">
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#292f38] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                <div className="text-white" data-icon="MagnifyingGlass" data-size="20px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
              </button>
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#292f38] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                <div className="text-white" data-icon="User" data-size="20px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                  </svg>
                </div>
              </button>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvhvQwziuIKrHHCbgWuuZ0IgZpKnsQ3_TojyWFbS1AQgtP05L9HSM8kBPibkPH_AkoRyWqp45GOELtYgqhxIUYlzwl-nN8STtXsah3QjndKQjtd-AFdGx45kQhgp2IA2c0GkngYKH378N2_REvdz4cSRv8jZplkBrv0EDK1ZPeM-8ucfj8GobPxDzjQe6RPLu--tqA5z4_KJP0LXaCJGNdshEsQLl9qv2EP9GVkV_qKV4R3jfJeeMrzzmvr5EQERF5N1R9kzHQ2Rs")'
              }}
            ></div>
          </div>
        </header>
        
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <h1 className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Games</h1>
            </div>
            
            {/* Game Selection */}
            <div className="px-4 mb-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {games.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => game.component && setActiveGame(game.id)}
                    className={`bg-white/5 backdrop-blur-md rounded-xl p-4 shadow-lg border cursor-pointer transition-all duration-300 hover:scale-105 ${
                      activeGame === game.id
                        ? 'border-blue-500 bg-blue-900/20'
                        : game.component 
                          ? 'border-white/10 hover:bg-white/10 hover:border-blue-500/30'
                          : 'border-gray-600 bg-gray-800/20 opacity-60'
                    }`}
                  >
                    <div className="text-3xl mb-2">{game.label.split(' ')[0]}</div>
                    <h3 className="text-white font-bold mb-2">{game.label.split(' ').slice(1).join(' ')}</h3>
                    <p className="text-[#9dacb8] text-sm mb-3">{game.description}</p>
                    {game.featured && (
                      <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    {!game.component && (
                      <span className="bg-gray-500/20 text-gray-300 text-xs px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Game Content */}
            <div className="px-4 flex-1">
              {ActiveGame ? (
                <ActiveGame />
              ) : (
                <div className="text-center text-white p-8">
                  <div className="text-6xl mb-4">🎮</div>
                  <h2 className="text-2xl font-bold mb-4">Select a Game to Play</h2>
                  <p className="text-[#9dacb8]">Choose from the games above to start your cosmic adventure!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesPage; 