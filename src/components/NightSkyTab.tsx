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
            <div className="cosmic-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Telescope className="w-6 h-6 text-starlight-blue" />
                  Interactive Sky Map
                </h3>
                <button
                  onClick={() => setIsARMode(!isARMode)}
                  className={`cosmic-button text-sm px-3 py-1 ${isARMode ? 'bg-coral-glow' : 'bg-starlight-blue'}`}
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  {isARMode ? 'AR Mode' : '2D Mode'}
                </button>
              </div>
              <SkyMapsTab />
              {isARMode && (
                <div className="mt-4 p-4 bg-coral-glow/20 rounded-lg">
                  <p className="text-center text-coral-glow font-medium">
                    🔮 AR Mode: Point your device at the sky to see constellations overlay! 
                    (Feature coming soon with WebXR)
                  </p>
                </div>
              )}
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