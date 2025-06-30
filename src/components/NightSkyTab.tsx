'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Telescope, 
  Star, 
  Eye, 
  Clock, 
  Compass,
  Volume2,
  Play,
  Trophy,
  Target,
  RefreshCw
} from 'lucide-react'
import SkyMapsTab from './SkyMapsTab'
import StarStoriesTab from './StarStoriesTab'
import ISSTrackingTab from './ISSTrackingTab'

interface NightSkyTabProps {
  onTabChange: (tabId: string) => void
}

interface Constellation {
  id: string
  name: string
  story: string
  stars: number
  visibility: 'high' | 'medium' | 'low'
  mythology: string
  bestTime: string
  emoji: string
}

interface ISSPass {
  risetime: number
  duration: number
  magnitude: number
}

interface StarPuzzle {
  id: string
  constellation: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
  completed: boolean
}

const constellations: Constellation[] = [
  {
    id: 'orion',
    name: 'Orion',
    story: 'The mighty hunter from Greek mythology, visible with his distinctive belt of three stars.',
    stars: 7,
    visibility: 'high',
    mythology: 'A great hunter who was placed among the stars by Zeus.',
    bestTime: 'Winter evenings',
    emoji: '🏹'
  },
  {
    id: 'ursa-major',
    name: 'Ursa Major',
    story: 'The Great Bear, home to the famous Big Dipper asterism.',
    stars: 7,
    visibility: 'high',
    mythology: 'The great bear that roams the northern sky.',
    bestTime: 'Spring and Summer',
    emoji: '🐻'
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia',
    story: 'The vain queen who sits on her throne in the northern sky.',
    stars: 5,
    visibility: 'medium',
    mythology: 'A queen condemned to circle the pole star forever.',
    bestTime: 'Fall evenings',
    emoji: '👑'
  }
]

const starPuzzles: StarPuzzle[] = [
  { id: 'orion-belt', constellation: 'Orion', difficulty: 'easy', points: 25, completed: false },
  { id: 'big-dipper', constellation: 'Ursa Major', difficulty: 'easy', points: 25, completed: true },
  { id: 'cassiopeia-w', constellation: 'Cassiopeia', difficulty: 'medium', points: 50, completed: false }
]

export default function NightSkyTab({ onTabChange }: NightSkyTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'sky-map' | 'stories' | 'iss-tracker' | 'puzzles'>('sky-map')
  const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null)
  const [nextISSPass, setNextISSPass] = useState<ISSPass | null>(null)
  const [isARMode, setIsARMode] = useState(false)
  const [selectedConstellation, setSelectedConstellation] = useState<Constellation | null>(null)
  const [speechEnabled, setSpeechEnabled] = useState(false)

  useEffect(() => {
    // Get user location for ISS passes and sky map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
        },
        (error) => {
          console.log('Location access denied:', error)
          // Default to a location (e.g., London)
          setUserLocation({ lat: 51.5074, lon: -0.1278 })
        }
      )
    }
  }, [])

  useEffect(() => {
    // Simulate ISS pass data (in real app, fetch from Open Notify API)
    if (userLocation) {
      setNextISSPass({
        risetime: Date.now() + (2 * 60 * 60 * 1000), // 2 hours from now
        duration: 378, // seconds
        magnitude: -2.5
      })
    }
  }, [userLocation])

  const handleConstellationSelect = (constellation: Constellation) => {
    setSelectedConstellation(constellation)
    if (speechEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(constellation.story)
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const subTabs = [
    { id: 'sky-map', name: 'Sky Map', icon: Telescope, description: 'Interactive star map' },
    { id: 'stories', name: 'Star Stories', icon: Star, description: 'Constellation mythology' },
    { id: 'iss-tracker', name: 'ISS Tracker', icon: MapPin, description: 'Track the space station' },
    { id: 'puzzles', name: 'Star Puzzles', icon: Target, description: 'Connect the dots games' }
  ]

  const formatISSTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">
          Night Sky Explorer 🌌
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Discover constellations, track the ISS, and explore the wonders above us!
        </p>
      </motion.div>

      {/* Quick Stats & Controls */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Location Status */}
        <div className="cosmic-card p-4 text-center">
          <MapPin className="w-6 h-6 text-aurora-green mx-auto mb-2" />
          <h3 className="font-bold">Your Location</h3>
          <p className="text-sm text-gray-400">
            {userLocation ? `${userLocation.lat.toFixed(2)}°, ${userLocation.lon.toFixed(2)}°` : 'Getting location...'}
          </p>
        </div>

        {/* Next ISS Pass */}
        <div className="cosmic-card p-4 text-center">
          <Clock className="w-6 h-6 text-starlight-blue mx-auto mb-2" />
          <h3 className="font-bold">Next ISS Pass</h3>
          <p className="text-sm text-gray-400">
            {nextISSPass ? formatISSTime(nextISSPass.risetime) : 'Calculating...'}
          </p>
        </div>

        {/* Controls */}
        <div className="cosmic-card p-4 text-center space-y-2">
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`cosmic-button text-sm px-3 py-1 ${speechEnabled ? 'bg-aurora-green' : 'bg-gray-600'}`}
          >
            <Volume2 className="w-4 h-4 inline mr-1" />
            Voice {speechEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </motion.div>

      {/* Sub-tab Navigation */}
      <motion.div
        className="flex flex-wrap gap-2 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {subTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeSubTab === tab.id 
                  ? 'tab-active shadow-lg' 
                  : 'tab-inactive'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.name}</span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Sub-tab Content */}
      <motion.div
        className="min-h-[500px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Sky Map */}
        {activeSubTab === 'sky-map' && (
          <div className="space-y-6">
            {/* Interactive Sky Map */}
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
            
            {/* AR Toggle */}
            <div className="p-4 @container">
              <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-[#40484f] bg-[#121516] p-5 @[480px]:flex-row @[480px]:items-center">
                <div className="flex flex-col gap-1">
                  <p className="text-white text-base font-bold leading-tight">Augmented Reality Mode</p>
                  <p className="text-[#a2acb3] text-base font-normal leading-normal">Experience the night sky in your surroundings with AR.</p>
                </div>
                <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-[#2c3135] p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#c5daeb]">
                  <div className="h-full w-[27px] rounded-full bg-white" style={{boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px'}} />
                  <input 
                    type="checkbox" 
                    className="invisible absolute" 
                    checked={isARMode}
                    onChange={() => setIsARMode(!isARMode)}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Star Stories */}
        {activeSubTab === 'stories' && (
          <div className="space-y-6">
            <div className="cosmic-card p-6">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Star className="w-6 h-6 text-aurora-green" />
                Constellation Stories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {constellations.map((constellation) => (
                  <motion.button
                    key={constellation.id}
                    onClick={() => handleConstellationSelect(constellation)}
                    className={`cosmic-card p-4 text-left transition-all hover:scale-105 ${
                      selectedConstellation?.id === constellation.id ? 'ring-2 ring-aurora-green' : ''
                    }`}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{constellation.emoji}</span>
                      <h4 className="font-bold">{constellation.name}</h4>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{constellation.stars} main stars</p>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        constellation.visibility === 'high' ? 'bg-aurora-green/20 text-aurora-green' :
                        constellation.visibility === 'medium' ? 'bg-solar-orange/20 text-solar-orange' :
                        'bg-coral-glow/20 text-coral-glow'
                      }`}>
                        {constellation.visibility} visibility
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              {selectedConstellation && (
                <motion.div
                  className="cosmic-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h4 className="text-2xl font-bold text-aurora-green mb-4 flex items-center gap-2">
                    {selectedConstellation.emoji} {selectedConstellation.name}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-bold mb-2">The Story</h5>
                      <p className="text-gray-300 mb-4">{selectedConstellation.story}</p>
                      <h5 className="font-bold mb-2">Mythology</h5>
                      <p className="text-gray-300">{selectedConstellation.mythology}</p>
                    </div>
                    <div>
                      <h5 className="font-bold mb-2">Best Viewing Time</h5>
                      <p className="text-aurora-green mb-4">{selectedConstellation.bestTime}</p>
                      <button
                        onClick={() => handleConstellationSelect(selectedConstellation)}
                        className="cosmic-button-secondary flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Hear the Story
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <StarStoriesTab />
          </div>
        )}

        {/* ISS Tracker */}
        {activeSubTab === 'iss-tracker' && (
          <div className="space-y-6">
            <div className="cosmic-card p-6">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-starlight-blue" />
                ISS Live Tracker
              </h3>
              {nextISSPass && (
                <div className="bg-starlight-blue/20 rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-starlight-blue mb-2">Next Visible Pass</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Rise Time:</span>
                      <p className="font-medium">{formatISSTime(nextISSPass.risetime)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Duration:</span>
                      <p className="font-medium">{Math.floor(nextISSPass.duration / 60)} minutes</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <ISSTrackingTab />
          </div>
        )}

        {/* Star Puzzles */}
        {activeSubTab === 'puzzles' && (
          <div className="space-y-6">
            <div className="cosmic-card p-6">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-coral-glow" />
                Star Puzzle Games
              </h3>
              <p className="text-gray-300 mb-6">
                Connect the dots to form constellations and earn cosmic points!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {starPuzzles.map((puzzle) => (
                  <motion.div
                    key={puzzle.id}
                    className={`cosmic-card p-4 ${puzzle.completed ? 'ring-2 ring-aurora-green' : ''}`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold">{puzzle.constellation}</h4>
                      {puzzle.completed && (
                        <Trophy className="w-5 h-5 text-aurora-green" />
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        puzzle.difficulty === 'easy' ? 'bg-aurora-green/20 text-aurora-green' :
                        puzzle.difficulty === 'medium' ? 'bg-solar-orange/20 text-solar-orange' :
                        'bg-coral-glow/20 text-coral-glow'
                      }`}>
                        {puzzle.difficulty}
                      </span>
                      <span className="text-sm text-starlight-blue">+{puzzle.points} pts</span>
                    </div>
                    <button
                      className={`w-full cosmic-button text-sm ${
                        puzzle.completed ? 'opacity-50' : ''
                      }`}
                      disabled={puzzle.completed}
                    >
                      {puzzle.completed ? 'Completed! ✨' : 'Start Puzzle'}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}