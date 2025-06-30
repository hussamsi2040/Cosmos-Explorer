'use client';
import React, { useState } from "react";
import ImageCard from "./ImageCard";
import MapEventCard from "./MapEventCard";
import EpicGalleryWrapper from "./EpicGalleryWrapper";

type JournalTab = 'apod' | 'epic';

interface DailyCosmicJournalProps {
  apod: any;
  apodError?: string;
  epicDates: string[];
  epicDefaultDate: string;
}

export default function DailyCosmicJournal({
  apod,
  apodError,
  epicDates,
  epicDefaultDate,
}: DailyCosmicJournalProps) {
  const [activeTab, setActiveTab] = useState<JournalTab>('apod');

  const tabs = [
    { id: 'apod', label: '🌌 Astronomy Picture', icon: '⭐' },
    { id: 'epic', label: '🌍 Earth Today', icon: '🛰️' },
  ] as const;

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Daily Cosmic Journal</h1>
        <p className="text-[#9da9b8]">Your daily dose of cosmic wonders and Earth observations</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/50 shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* APOD Tab */}
        {activeTab === 'apod' && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-white mb-2">Astronomy Picture of the Day</h2>
              <p className="text-[#9da9b8]">Discover the cosmos through NASA's daily space image</p>
            </div>
            {apodError ? (
              <div className="text-red-400 text-center p-8 bg-red-400/10 rounded-xl">
                {apodError}
              </div>
            ) : apod ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <ImageCard
                  title={apod.title}
                  imageUrl={apod.url}
                  description={apod.explanation}
                  credit={apod.copyright}
                />
              </div>
            ) : (
              <div className="text-white text-center p-8">Loading cosmic wonders...</div>
            )}
          </div>
        )}

        {/* EPIC Tab */}
        {activeTab === 'epic' && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-white mb-2">Earth from Space</h2>
              <p className="text-[#9da9b8]">See our beautiful planet from the DSCOVR satellite</p>
            </div>
            <EpicGalleryWrapper
              availableDates={epicDates}
              defaultDate={epicDefaultDate}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-white/10 text-center">
        <p className="text-[#9da9b8] text-sm">
          Data provided by NASA • Updated daily • Explore the cosmos with us
        </p>
      </div>
    </div>
  );
} 