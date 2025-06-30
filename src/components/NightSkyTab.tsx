'use client'

import { useState, useEffect } from 'react'
import { 
  MapPin, 
  Telescope, 
  Star, 
  Clock, 
  Target,
  Play
} from 'lucide-react'

interface NightSkyTabProps {
  onTabChange: (tabId: string) => void
}

interface ConstellationStory {
  id: string
  name: string
  title: string
  description: string
  image: string
  emoji: string
}

export default function NightSkyTab({ onTabChange }: NightSkyTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'sky-map' | 'stories' | 'iss-tracker' | 'puzzles'>('sky-map')

  const subTabs = [
    { id: 'sky-map', name: 'Sky Map', icon: Telescope },
    { id: 'stories', name: 'Star Stories', icon: Star },
    { id: 'iss-tracker', name: 'ISS Tracker', icon: MapPin },
    { id: 'puzzles', name: 'Star Puzzles', icon: Target }
  ]

  const constellationStories: ConstellationStory[] = [
    {
      id: 'orion',
      name: 'Orion',
      title: 'The Hunter',
      description: 'Orion was a mighty hunter from Greek mythology, known for his incredible strength and skill.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAe7h1W5-eKUJkCdqDVNhDMQMSjJF_vgz_qKP8lKwx',
      emoji: '🏹'
    },
    {
      id: 'ursa-major',
      name: 'Ursa Major',
      title: 'The Great Bear',
      description: 'The story of a bear who was placed among the stars by Zeus to roam the northern sky.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmKdP5X9zY2qWrTn3HgL8FQsVfPdx',
      emoji: '🐻'
    },
    {
      id: 'cassiopeia',
      name: 'Cassiopeia',
      title: 'The Vain Queen',
      description: 'A queen who boasted about her beauty and was punished to circle the pole star forever.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8Mn9KrHwT4gF7VsLpQ2XzBhYx',
      emoji: '👑'
    }
  ]

  return (
    <div className="gap-1 px-6 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-white tracking-light text-[32px] font-bold leading-tight">Night Sky</p>
            <p className="text-[#a2acb3] text-sm font-normal leading-normal">Discover constellations, track the ISS, and explore the wonders above us.</p>
          </div>
        </div>
        
        {/* Main Tab Navigation */}
        <div className="pb-3">
          <div className="flex border-b border-[#40484f] px-4 gap-8">
            {subTabs.map((tab) => (
              <a 
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 cursor-pointer ${
                  activeSubTab === tab.id 
                    ? 'border-b-white text-white' 
                    : 'border-b-transparent text-[#a2acb3]'
                }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">{tab.name}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Sky Map Content */}
        {activeSubTab === 'sky-map' && (
          <div className="@container flex flex-col h-full flex-1">
            <div className="flex flex-1 flex-col @[480px]:px-4 @[480px]:py-3">
              <div
                className="bg-cover bg-center flex min-h-[320px] flex-1 flex-col justify-between px-4 pb-4 pt-5 @[480px]:rounded-xl @[480px]:px-8 @[480px]:pb-6 @[480px]:pt-8"
                style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA5xIBYLg04vTgZmDwcjHiFL-OAU4BwhrShpdkA7-SBEAf6Ffk3OsxG0on54JVrEE65h01TabtIQBjoq9IDOImiMjLLa6WUuKGsC-SOVfVeFiOt7Fg5lwGXENYJss8mmS00ptgFPafkScSITCfWPMoiGvW36vpJMbg8Bz6_Bmm33_YvkBhyW3gxy3zAxa5hXTyNaZtxbx3uPyoUxsuCtjcEWhT4_vMbj_LShZa8DsKzPRnzpTFfN3vYIoXz-IyRHsr5BXUnIZq-iwc")'}}
              >
                {/* Search Bar */}
                <label className="flex flex-col min-w-40 h-12">
                  <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                    <div className="text-[#a2acb3] flex border-none bg-[#1e2124] items-center justify-center pl-4 rounded-l-xl border-r-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                      </svg>
                    </div>
                    <input
                      placeholder="Search for constellations, planets, and more"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#1e2124] focus:border-none h-full placeholder:text-[#a2acb3] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    />
                  </div>
                </label>
                
                {/* Map Controls */}
                <div className="flex flex-col items-end gap-3">
                  {/* Zoom Controls */}
                  <div className="flex flex-col gap-0.5">
                    <button className="flex size-10 items-center justify-center rounded-t-full bg-[#1e2124] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                      <div className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
                        </svg>
                      </div>
                    </button>
                    <button className="flex size-10 items-center justify-center rounded-b-full bg-[#1e2124] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                      <div className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z" />
                        </svg>
                      </div>
                    </button>
                  </div>
                  
                  {/* Navigation Arrow */}
                  <button className="flex size-10 items-center justify-center rounded-full bg-[#1e2124] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                    <div className="text-white" style={{transform: 'scale(-1, 1)'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.33,98.21,53.41,33l-.16-.05A16,16,0,0,0,32.9,53.25a1,1,0,0,0,.05.16L98.21,229.33A15.77,15.77,0,0,0,113.28,240h.3a15.77,15.77,0,0,0,15-11.29l23.56-76.56,76.56-23.56a16,16,0,0,0,.62-30.38ZM224,113.3l-76.56,23.56a16,16,0,0,0-10.58,10.58L113.3,224h0l-.06-.17L48,48l175.82,65.22.16.06Z" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Star Stories Content */}
        {activeSubTab === 'stories' && (
          <div className="px-4 py-3">
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Constellation Stories</h3>
            
            {/* Horizontal Scroll Stories */}
            <div className="flex gap-3 pb-3 overflow-x-auto">
              {constellationStories.map((story) => (
                <div key={story.id} className="flex h-full w-full flex-1 flex-col gap-4 rounded-lg border border-[#40484f] bg-[#121516] p-6 min-w-[280px]">
                  <div className="flex items-center gap-4">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-14"
                      style={{backgroundImage: `url("${story.image}")`}}
                    />
                    <div className="flex flex-col justify-center">
                      <p className="text-white text-base font-medium leading-normal line-clamp-1">{story.emoji} {story.name}</p>
                      <p className="text-[#a2acb3] text-sm font-normal leading-normal line-clamp-2">{story.title}</p>
                    </div>
                  </div>
                  <p className="text-white text-sm font-normal leading-normal">{story.description}</p>
                  <div className="flex gap-3 justify-end">
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#2c3135] text-white text-sm font-medium leading-normal">
                      <Play className="w-4 h-4 mr-1" />
                      Listen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ISS Tracker Content */}
        {activeSubTab === 'iss-tracker' && (
          <div className="px-4 py-3">
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">ISS Flyover</h3>
            
            {/* Countdown Section */}
            <div className="flex flex-col gap-3 px-4">
              <div className="flex flex-col gap-3 rounded-lg border border-[#40484f] bg-[#121516] p-6">
                <div className="flex gap-4 justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-white text-base font-medium leading-normal">Next visible pass</p>
                    <p className="text-[#a2acb3] text-sm font-normal leading-normal">International Space Station flyover for your location</p>
                  </div>
                  <div className="shrink-0">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-[#2c3135]">
                      <Clock className="text-white" width="24" height="24" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <p className="text-[#c5daeb] text-2xl font-bold leading-tight tracking-[-0.015em]">2h 34m</p>
                    <p className="text-[#a2acb3] text-sm font-normal leading-normal">Time remaining</p>
                  </div>
                  <div className="flex flex-col text-right">
                    <p className="text-white text-base font-medium leading-normal">7:45 PM</p>
                    <p className="text-[#a2acb3] text-sm font-normal leading-normal">Rise time</p>
                  </div>
                </div>
              </div>
              
              {/* ISS Info */}
              <div className="flex flex-col gap-3 rounded-lg border border-[#40484f] bg-[#121516] p-6">
                <p className="text-white text-base font-medium leading-normal">About the ISS</p>
                <p className="text-[#a2acb3] text-sm font-normal leading-normal">The International Space Station orbits Earth every 90 minutes at 17,500 mph, 250 miles above us.</p>
                <div className="flex gap-3">
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#c5daeb] text-[#121516] text-sm font-medium leading-normal">
                    Set Reminder
                  </button>
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#2c3135] text-white text-sm font-medium leading-normal">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Star Puzzles Content */}
        {activeSubTab === 'puzzles' && (
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🧩</div>
            <h4 className="text-xl font-bold mb-2">Star Puzzles Coming Soon!</h4>
            <p className="text-gray-300">Connect the dots to form constellations and earn cosmic points.</p>
          </div>
        )}
      </div>
    </div>
  )
}