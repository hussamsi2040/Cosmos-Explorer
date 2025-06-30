'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Rocket, 
  MapPin, 
  Users, 
  Clock, 
  Target, 
  Zap,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Satellite,
  Globe,
  Calendar,
  TrendingUp
} from 'lucide-react'
import MissionDashboard from './MissionDashboard'
import ISSTrackingTab from './ISSTrackingTab'
import LaunchGameComponent from './LaunchGameComponent'

interface MissionsTabProps {
  onTabChange: (tabId: string) => void
}

interface SpaceXMission {
  id: string
  name: string
  date: string
  rocket: string
  payload: string
  success: boolean | null
  upcoming: boolean
  details?: string
}

interface ISSData {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: number
}

interface CrewMember {
  id: string
  name: string
  role: string
  country: string
  mission: string
  daysInSpace: number
  currentActivity: string
  bio: string
  avatar: string
}

interface LaunchConfig {
  rocket: 'falcon9' | 'falcon-heavy' | 'starship'
  fuel: number
  payload: string
  launchWindow: string
}

const sampleSpaceXMissions: SpaceXMission[] = [
  {
    id: '1',
    name: 'Starlink Group 8-7',
    date: '2024-07-01',
    rocket: 'Falcon 9',
    payload: '23 Starlink satellites',
    success: null,
    upcoming: true,
    details: 'Deploying next batch of Starlink internet satellites to low Earth orbit'
  },
  {
    id: '2', 
    name: 'Europa Clipper',
    date: '2024-06-28',
    rocket: 'Falcon Heavy',
    payload: 'Europa Clipper spacecraft',
    success: true,
    upcoming: false,
    details: 'Mission to explore Jupiter\'s icy moon Europa'
  },
  {
    id: '3',
    name: 'Crew-8 Return',
    date: '2024-06-25',
    rocket: 'Dragon',
    payload: '4 astronauts',
    success: true,
    upcoming: false,
    details: 'Safe return of Crew-8 astronauts from the ISS'
  }
]

const sampleCrewMembers: CrewMember[] = [
  {
    id: '1',
    name: 'Commander Sarah Chen',
    role: 'Commander',
    country: 'USA',
    mission: 'Expedition 71',
    daysInSpace: 127,
    currentActivity: 'Conducting materials science experiments',
    bio: 'Veteran astronaut with 3 previous space missions',
    avatar: '👩‍🚀'
  },
  {
    id: '2',
    name: 'Dr. Yuki Tanaka',
    role: 'Flight Engineer',
    country: 'Japan',
    mission: 'Expedition 71',
    daysInSpace: 89,
    currentActivity: 'Maintaining life support systems',
    bio: 'Specialist in space medicine and biology',
    avatar: '🧑‍🚀'
  },
  {
    id: '3',
    name: 'Alexei Volkov',
    role: 'Flight Engineer',
    country: 'Russia',
    mission: 'Expedition 71',
    daysInSpace: 127,
    currentActivity: 'EVA preparation for solar panel repairs',
    bio: 'Experienced in spacewalks and robotics',
    avatar: '👨‍🚀'
  }
]

export default function MissionsTab({ onTabChange }: MissionsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'iss-tracker' | 'simulator' | 'crew'>('timeline')
  const [issData, setIssData] = useState<ISSData | null>(null)
  const [launchConfig, setLaunchConfig] = useState<LaunchConfig>({
    rocket: 'falcon9',
    fuel: 100,
    payload: 'Satellite',
    launchWindow: 'Dawn'
  })
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)

  useEffect(() => {
    // Simulate ISS position updates
    const updateISSPosition = () => {
      setIssData({
        latitude: Math.random() * 180 - 90,
        longitude: Math.random() * 360 - 180,
        altitude: 408 + Math.random() * 10, // km
        velocity: 27600 + Math.random() * 100, // km/h
        timestamp: Date.now()
      })
    }

    updateISSPosition()
    const interval = setInterval(updateISSPosition, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (simulationRunning) {
      interval = setInterval(() => {
        setSimulationProgress(prev => {
          if (prev >= 100) {
            setSimulationRunning(false)
            return 100
          }
          return prev + 2
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [simulationRunning])

  const subTabs = [
    { id: 'timeline', name: 'Mission Timeline', icon: Rocket, description: 'SpaceX launches & missions' },
    { id: 'iss-tracker', name: 'ISS Live', icon: Satellite, description: 'Track the space station' },
    { id: 'simulator', name: 'Launch Sim', icon: Play, description: 'Simulate your own launch' },
    { id: 'crew', name: 'Crew Spotlight', icon: Users, description: 'Meet the astronauts' }
  ]

  const startSimulation = () => {
    setSimulationProgress(0)
    setSimulationRunning(true)
  }

  const resetSimulation = () => {
    setSimulationRunning(false)
    setSimulationProgress(0)
  }

  const getRocketEmoji = (rocket: string) => {
    switch (rocket.toLowerCase()) {
      case 'falcon9': return '🚀'
      case 'falcon-heavy': return '🚀🚀🚀'
      case 'starship': return '🛸'
      default: return '🚀'
    }
  }

  const getCountryFlag = (country: string) => {
    switch (country.toLowerCase()) {
      case 'usa': return '🇺🇸'
      case 'japan': return '🇯🇵'
      case 'russia': return '🇷🇺'
      case 'germany': return '🇩🇪'
      case 'italy': return '🇮🇹'
      default: return '🌍'
    }
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
          Mission Control 🚀
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Track SpaceX launches, follow the ISS, simulate missions, and meet the astronauts!
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="cosmic-card p-4 text-center">
          <Rocket className="w-6 h-6 text-coral-glow mx-auto mb-2" />
          <h3 className="font-bold">Next Launch</h3>
          <p className="text-sm text-gray-400">July 1, 2024</p>
        </div>
        <div className="cosmic-card p-4 text-center">
          <Satellite className="w-6 h-6 text-starlight-blue mx-auto mb-2" />
          <h3 className="font-bold">ISS Altitude</h3>
          <p className="text-sm text-gray-400">{issData ? `${issData.altitude.toFixed(0)} km` : '408 km'}</p>
        </div>
        <div className="cosmic-card p-4 text-center">
          <Users className="w-6 h-6 text-aurora-green mx-auto mb-2" />
          <h3 className="font-bold">Crew Members</h3>
          <p className="text-sm text-gray-400">{sampleCrewMembers.length} astronauts</p>
        </div>
        <div className="cosmic-card p-4 text-center">
          <Target className="w-6 h-6 text-nebula-purple mx-auto mb-2" />
          <h3 className="font-bold">Success Rate</h3>
          <p className="text-sm text-gray-400">95.8%</p>
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
        {/* SpaceX Mission Timeline */}
        {activeSubTab === 'timeline' && (
          <div className="space-y-6">
            <div className="cosmic-card p-6">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Rocket className="w-6 h-6 text-coral-glow" />
                SpaceX Mission Timeline
              </h3>
              <div className="space-y-4">
                {sampleSpaceXMissions.map((mission) => (
                  <motion.div
                    key={mission.id}
                    className={`cosmic-card p-4 border-l-4 ${
                      mission.upcoming ? 'border-l-starlight-blue' : 
                      mission.success ? 'border-l-aurora-green' : 'border-l-coral-glow'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getRocketEmoji(mission.rocket)}</span>
                          <h4 className="font-bold text-lg">{mission.name}</h4>
                          {mission.upcoming ? (
                            <span className="bg-starlight-blue/20 text-starlight-blue px-2 py-1 rounded-full text-sm">
                              Upcoming
                            </span>
                          ) : mission.success ? (
                            <CheckCircle className="w-5 h-5 text-aurora-green" />
                          ) : (
                            <XCircle className="w-5 h-5 text-coral-glow" />
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                          <div>
                            <span className="text-gray-400">Date:</span>
                            <p className="font-medium">{mission.date}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Rocket:</span>
                            <p className="font-medium">{mission.rocket}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Payload:</span>
                            <p className="font-medium">{mission.payload}</p>
                          </div>
                        </div>
                        {mission.details && (
                          <p className="text-gray-300 text-sm">{mission.details}</p>
                        )}
                      </div>
                      {mission.upcoming && (
                        <div className="text-right">
                          <Clock className="w-5 h-5 text-starlight-blue mx-auto mb-1" />
                          <p className="text-xs text-gray-400">T-2 days</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <MissionDashboard />
          </div>
        )}

        {/* ISS Live Tracker */}
        {activeSubTab === 'iss-tracker' && (
          <div className="space-y-6">
            <div className="cosmic-card p-6">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Satellite className="w-6 h-6 text-starlight-blue" />
                ISS Live Tracker
              </h3>
              {issData && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-starlight-blue/20 rounded-lg p-4 text-center">
                    <Globe className="w-6 h-6 text-starlight-blue mx-auto mb-2" />
                    <h4 className="font-bold">Latitude</h4>
                    <p className="text-lg font-bold text-starlight-blue">{issData.latitude.toFixed(2)}°</p>
                  </div>
                  <div className="bg-aurora-green/20 rounded-lg p-4 text-center">
                    <Globe className="w-6 h-6 text-aurora-green mx-auto mb-2" />
                    <h4 className="font-bold">Longitude</h4>
                    <p className="text-lg font-bold text-aurora-green">{issData.longitude.toFixed(2)}°</p>
                  </div>
                  <div className="bg-coral-glow/20 rounded-lg p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-coral-glow mx-auto mb-2" />
                    <h4 className="font-bold">Altitude</h4>
                    <p className="text-lg font-bold text-coral-glow">{issData.altitude.toFixed(0)} km</p>
                  </div>
                  <div className="bg-nebula-purple/20 rounded-lg p-4 text-center">
                    <Zap className="w-6 h-6 text-nebula-purple mx-auto mb-2" />
                    <h4 className="font-bold">Velocity</h4>
                    <p className="text-lg font-bold text-nebula-purple">{issData.velocity.toFixed(0)} km/h</p>
                  </div>
                </div>
              )}
              <div className="bg-cosmic-navy/50 rounded-lg p-4 mb-4">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-aurora-green" />
                  Fun Facts About the ISS
                </h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>• Orbits Earth every 90 minutes at 27,600 km/h</p>
                  <p>• About the size of a football field</p>
                  <p>• Continuously inhabited since November 2000</p>
                  <p>• Visible to the naked eye from Earth!</p>
                </div>
              </div>
            </div>
            <ISSTrackingTab />
          </div>
        )}

        {/* Launch Simulator */}
        {activeSubTab === 'simulator' && (
          <div className="space-y-6">
            <div className="cosmic-card p-6">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Play className="w-6 h-6 text-nebula-purple" />
                Launch Mission Simulator
              </h3>
              
              {/* Launch Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-bold mb-3">Mission Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rocket Type</label>
                      <select
                        value={launchConfig.rocket}
                        onChange={(e) => setLaunchConfig(prev => ({ ...prev, rocket: e.target.value as any }))}
                        className="cosmic-input w-full"
                      >
                        <option value="falcon9">Falcon 9 🚀</option>
                        <option value="falcon-heavy">Falcon Heavy 🚀🚀🚀</option>
                        <option value="starship">Starship 🛸</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Fuel Level: {launchConfig.fuel}%</label>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={launchConfig.fuel}
                        onChange={(e) => setLaunchConfig(prev => ({ ...prev, fuel: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Payload</label>
                      <select
                        value={launchConfig.payload}
                        onChange={(e) => setLaunchConfig(prev => ({ ...prev, payload: e.target.value }))}
                        className="cosmic-input w-full"
                      >
                        <option value="Satellite">Communications Satellite</option>
                        <option value="Crew Dragon">Crew Dragon (Astronauts)</option>
                        <option value="Starlink">Starlink Internet Satellites</option>
                        <option value="Cargo">ISS Cargo Resupply</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Launch Window</label>
                      <select
                        value={launchConfig.launchWindow}
                        onChange={(e) => setLaunchConfig(prev => ({ ...prev, launchWindow: e.target.value }))}
                        className="cosmic-input w-full"
                      >
                        <option value="Dawn">Dawn (Optimal)</option>
                        <option value="Noon">Noon (Good)</option>
                        <option value="Dusk">Dusk (Fair)</option>
                        <option value="Night">Night (Challenging)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold mb-3">Launch Status</h4>
                  <div className="bg-cosmic-navy/50 rounded-lg p-4">
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-2">{getRocketEmoji(launchConfig.rocket)}</div>
                      <p className="text-lg font-bold text-aurora-green">
                        {simulationRunning ? 'Launching...' : simulationProgress === 100 ? 'Mission Success!' : 'Ready for Launch'}
                      </p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Launch Progress</span>
                        <span>{simulationProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-starlight-blue to-aurora-green h-2 rounded-full transition-all duration-300"
                          style={{ width: `${simulationProgress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Control Buttons */}
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={startSimulation}
                        disabled={simulationRunning}
                        className="cosmic-button flex items-center gap-2 disabled:opacity-50"
                      >
                        <Play className="w-4 h-4" />
                        Launch
                      </button>
                      <button
                        onClick={resetSimulation}
                        className="cosmic-button-secondary flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {simulationProgress === 100 && (
                <motion.div
                  className="bg-aurora-green/20 rounded-lg p-4 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <h4 className="font-bold text-aurora-green mb-2">🎉 Mission Accomplished!</h4>
                  <p className="text-sm text-gray-300">
                    Your {launchConfig.rocket} successfully delivered {launchConfig.payload} to orbit!
                  </p>
                  <p className="text-xs text-aurora-green mt-2">+50 Cosmic Points Earned!</p>
                </motion.div>
              )}
            </div>
            <LaunchGameComponent />
          </div>
        )}

        {/* Crew Spotlight */}
        {activeSubTab === 'crew' && (
          <div className="space-y-6">
            <div className="cosmic-card p-6">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-aurora-green" />
                Current ISS Crew
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleCrewMembers.map((crew) => (
                  <motion.div
                    key={crew.id}
                    className="cosmic-card p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{crew.avatar}</div>
                      <h4 className="font-bold text-lg">{crew.name}</h4>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl">{getCountryFlag(crew.country)}</span>
                        <span className="text-sm text-gray-400">{crew.country}</span>
                      </div>
                      <span className="bg-starlight-blue/20 text-starlight-blue px-2 py-1 rounded-full text-sm">
                        {crew.role}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-400">Mission:</span>
                        <p className="font-medium">{crew.mission}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Days in Space:</span>
                        <p className="font-medium text-aurora-green">{crew.daysInSpace} days</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Current Activity:</span>
                        <p className="font-medium">{crew.currentActivity}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Bio:</span>
                        <p className="text-gray-300">{crew.bio}</p>
                      </div>
                    </div>
                    
                    <button 
                      className="w-full cosmic-button mt-4 text-sm"
                      onClick={() => {
                        // In real app, show more details or Q&A
                        alert(`Ask ${crew.name.split(' ')[1]} a question about life in space!`)
                      }}
                    >
                      Ask a Question
                    </button>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 bg-cosmic-navy/50 rounded-lg p-4">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-starlight-blue" />
                  Life in Space Facts
                </h4>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>• Astronauts exercise 2.5 hours daily to prevent muscle loss</p>
                  <p>• They eat rehydrated and thermostabilized food</p>
                  <p>• Sleep in sleeping bags attached to walls</p>
                  <p>• Experience 16 sunrises and sunsets every day!</p>
                  <p>• Conduct hundreds of scientific experiments</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}