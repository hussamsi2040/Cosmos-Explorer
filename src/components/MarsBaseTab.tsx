'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Camera, 
  Thermometer, 
  Wind, 
  CloudRain,
  Calendar,
  MapPin,
  Settings,
  Trophy,
  Play,
  Download,
  RefreshCw,
  Wrench,
  Eye,
  Zap
} from 'lucide-react'
import PlanetaryDataTab from './PlanetaryDataTab'

interface MarsBaseTabProps {
  onTabChange: (tabId: string) => void
}

interface RoverPhoto {
  id: number
  img_src: string
  earth_date: string
  rover: {
    name: string
    status: string
  }
  camera: {
    name: string
    full_name: string
  }
  sol: number
}

interface MarsWeather {
  sol: number
  earthDate: string
  season: string
  minTemp: number
  maxTemp: number
  pressure: number
  windSpeed: number
  windDirection: string
}

interface RoverComponent {
  id: string
  name: string
  type: 'wheels' | 'camera' | 'drill' | 'spectrometer' | 'antenna'
  description: string
  points: number
  unlocked: boolean
  emoji: string
}

interface MissionLog {
  sol: number
  title: string
  description: string
  activity: string
  discovery?: string
  emoji: string
}

const sampleRoverPhotos: RoverPhoto[] = [
  {
    id: 1,
    img_src: "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/04062/opgs/edr/fcam/FLB_742481249EDR_F1052924FHAZ00341M_.JPG",
    earth_date: "2024-06-30",
    rover: { name: "Curiosity", status: "active" },
    camera: { name: "FHAZ", full_name: "Front Hazard Avoidance Camera" },
    sol: 4062
  },
  {
    id: 2,
    img_src: "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/04061/opgs/edr/fcam/FLB_742395053EDR_F1052828FHAZ00341M_.JPG", 
    earth_date: "2024-06-29",
    rover: { name: "Curiosity", status: "active" },
    camera: { name: "FHAZ", full_name: "Front Hazard Avoidance Camera" },
    sol: 4061
  }
]

const roverComponents: RoverComponent[] = [
  { id: 'basic-wheels', name: 'Basic Wheels', type: 'wheels', description: 'Standard 6-wheel suspension system', points: 0, unlocked: true, emoji: '🛞' },
  { id: 'all-terrain-wheels', name: 'All-Terrain Wheels', type: 'wheels', description: 'Enhanced wheels for rocky terrain', points: 100, unlocked: false, emoji: '⚙️' },
  { id: 'pancam', name: 'Panoramic Camera', type: 'camera', description: 'Wide-angle landscape photography', points: 50, unlocked: true, emoji: '📷' },
  { id: 'microscope', name: 'Microscopic Imager', type: 'camera', description: 'Close-up rock and soil analysis', points: 75, unlocked: false, emoji: '🔬' },
  { id: 'drill', name: 'Rock Abrasion Tool', type: 'drill', description: 'Drill into Martian rocks', points: 125, unlocked: false, emoji: '🔨' },
  { id: 'spectrometer', name: 'APXS Spectrometer', type: 'spectrometer', description: 'Analyze chemical composition', points: 150, unlocked: false, emoji: '🧪' }
]

const missionLogs: MissionLog[] = [
  {
    sol: 4062,
    title: "Rock Sample Collection",
    description: "Successfully drilled and collected sample from 'Sequoia' rock formation",
    activity: "Drilling Operations",
    discovery: "Found evidence of ancient water activity!",
    emoji: "🔬"
  },
  {
    sol: 4061,
    title: "Terrain Navigation",
    description: "Navigated around large boulder field using enhanced imaging",
    activity: "Drive Sequence", 
    emoji: "🚗"
  },
  {
    sol: 4060,
    title: "Weather Monitoring",
    description: "Recorded daily atmospheric conditions and dust levels",
    activity: "Environmental Survey",
    emoji: "🌡️"
  }
]

export default function MarsBaseTab({ onTabChange }: MarsBaseTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'photos' | 'weather' | 'rover-builder' | 'mission-log'>('photos')
  const [selectedPhoto, setSelectedPhoto] = useState<RoverPhoto | null>(null)
  const [roverBuild, setRoverBuild] = useState<RoverComponent[]>([])
  const [userPoints, setUserPoints] = useState(250)

  // Sample Mars weather data
  const [marsWeather] = useState<MarsWeather>({
    sol: 4062,
    earthDate: "2024-06-30",
    season: "Late Summer",
    minTemp: -78,
    maxTemp: -20,
    pressure: 756,
    windSpeed: 16,
    windDirection: "WSW"
  })

  useEffect(() => {
    // Initialize with basic components
    const basicComponents = roverComponents.filter(c => c.unlocked)
    setRoverBuild(basicComponents)
  }, [])

  const subTabs = [
    { id: 'photos', name: 'Rover Photos', icon: Camera, description: 'Latest images from Mars' },
    { id: 'weather', name: 'Weather Station', icon: Thermometer, description: 'Martian weather data' },
    { id: 'rover-builder', name: 'Rover Builder', icon: Settings, description: 'Design your own rover' },
    { id: 'mission-log', name: 'Mission Log', icon: Calendar, description: 'Daily rover activities' }
  ]

  const handlePhotoSelect = (photo: RoverPhoto) => {
    setSelectedPhoto(photo)
  }

  const handleComponentAdd = (component: RoverComponent) => {
    if (component.unlocked && !roverBuild.find(c => c.id === component.id)) {
      setRoverBuild(prev => [...prev, component])
    }
  }

  const handleComponentRemove = (componentId: string) => {
    setRoverBuild(prev => prev.filter(c => c.id !== componentId))
  }

  const unlockComponent = (component: RoverComponent) => {
    if (userPoints >= component.points) {
      setUserPoints(prev => prev - component.points)
      // In real app, update component unlock status in database
    }
  }

  const compareWithEarth = (marsTemp: number) => {
    const earthTemp = 22 // Average Earth temp in Celsius
    const difference = Math.abs(marsTemp - earthTemp)
    return `${difference}°C ${marsTemp < earthTemp ? 'colder' : 'warmer'} than Earth`
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
          Mars Base Command 🪐
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Explore the Red Planet through rover eyes, monitor Martian weather, and build your own rover!
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
          <Calendar className="w-6 h-6 text-coral-glow mx-auto mb-2" />
          <h3 className="font-bold">Sol {marsWeather.sol}</h3>
          <p className="text-sm text-gray-400">{marsWeather.earthDate}</p>
        </div>
        <div className="cosmic-card p-4 text-center">
          <Thermometer className="w-6 h-6 text-starlight-blue mx-auto mb-2" />
          <h3 className="font-bold">{marsWeather.maxTemp}°C</h3>
          <p className="text-sm text-gray-400">High today</p>
        </div>
        <div className="cosmic-card p-4 text-center">
          <Trophy className="w-6 h-6 text-aurora-green mx-auto mb-2" />
          <h3 className="font-bold">{userPoints}</h3>
          <p className="text-sm text-gray-400">Cosmic Points</p>
        </div>
        <div className="cosmic-card p-4 text-center">
          <Settings className="w-6 h-6 text-nebula-purple mx-auto mb-2" />
          <h3 className="font-bold">{roverBuild.length}</h3>
          <p className="text-sm text-gray-400">Rover Components</p>
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
        {/* Rover Photos */}
        {activeSubTab === 'photos' && (
          <div className="space-y-6">
            <div className="cosmic-card p-6">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Camera className="w-6 h-6 text-coral-glow" />
                Latest Rover Photos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleRoverPhotos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    className="cosmic-card p-4 cursor-pointer"
                    onClick={() => handlePhotoSelect(photo)}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="aspect-square bg-gray-800 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={photo.img_src}
                        alt={`Mars photo from ${photo.rover.name}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-mars.jpg'
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-coral-glow">{photo.rover.name}</span>
                        <span className="text-sm text-gray-400">Sol {photo.sol}</span>
                      </div>
                      <p className="text-sm text-gray-300">{photo.camera.full_name}</p>
                      <p className="text-xs text-gray-400">{photo.earth_date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {selectedPhoto && (
                <motion.div
                  className="mt-6 cosmic-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h4 className="text-xl font-bold text-coral-glow mb-4">Photo Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img
                        src={selectedPhoto.img_src}
                        alt={`Mars photo from ${selectedPhoto.rover.name}`}
                        className="w-full rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-mars.jpg'
                        }}
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-bold mb-2">Mission Info</h5>
                        <p className="text-gray-300">
                          This photo was taken by {selectedPhoto.rover.name} rover on Sol {selectedPhoto.sol} 
                          ({selectedPhoto.earth_date}) using the {selectedPhoto.camera.full_name}.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">Fun Fact</h5>
                        <p className="text-aurora-green">
                          The {selectedPhoto.camera.name} camera helps rovers navigate safely and avoid obstacles!
                        </p>
                      </div>
                      <button className="cosmic-button flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Zoom & Explore
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Weather Station */}
        {activeSubTab === 'weather' && (
          <div className="space-y-6">
            <div className="cosmic-card p-6">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Thermometer className="w-6 h-6 text-starlight-blue" />
                Mars Weather Station
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-starlight-blue/20 rounded-lg p-4 text-center">
                  <Thermometer className="w-8 h-8 text-starlight-blue mx-auto mb-2" />
                  <h4 className="font-bold">Temperature</h4>
                  <p className="text-2xl font-bold text-starlight-blue">{marsWeather.maxTemp}°C</p>
                  <p className="text-sm text-gray-400">High: {marsWeather.maxTemp}°C</p>
                  <p className="text-sm text-gray-400">Low: {marsWeather.minTemp}°C</p>
                  <p className="text-xs text-aurora-green mt-2">
                    {compareWithEarth(marsWeather.maxTemp)}
                  </p>
                </div>
                
                <div className="bg-aurora-green/20 rounded-lg p-4 text-center">
                  <CloudRain className="w-8 h-8 text-aurora-green mx-auto mb-2" />
                  <h4 className="font-bold">Pressure</h4>
                  <p className="text-2xl font-bold text-aurora-green">{marsWeather.pressure}</p>
                  <p className="text-sm text-gray-400">Pascals</p>
                  <p className="text-xs text-aurora-green mt-2">
                    Much lower than Earth!
                  </p>
                </div>
                
                <div className="bg-solar-orange/20 rounded-lg p-4 text-center">
                  <Wind className="w-8 h-8 text-solar-orange mx-auto mb-2" />
                  <h4 className="font-bold">Wind</h4>
                  <p className="text-2xl font-bold text-solar-orange">{marsWeather.windSpeed}</p>
                  <p className="text-sm text-gray-400">km/h {marsWeather.windDirection}</p>
                  <p className="text-xs text-aurora-green mt-2">
                    Light breeze today
                  </p>
                </div>
                
                <div className="bg-nebula-purple/20 rounded-lg p-4 text-center">
                  <Calendar className="w-8 h-8 text-nebula-purple mx-auto mb-2" />
                  <h4 className="font-bold">Season</h4>
                  <p className="text-lg font-bold text-nebula-purple">{marsWeather.season}</p>
                  <p className="text-sm text-gray-400">Martian year cycle</p>
                  <p className="text-xs text-aurora-green mt-2">
                    687 Earth days/year
                  </p>
                </div>
              </div>
              
              <div className="bg-cosmic-navy/50 rounded-lg p-4">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-aurora-green" />
                  Weather Comparison: Mars vs Earth
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-bold text-coral-glow mb-2">🪐 Mars Today</h5>
                    <p>• Temperature: {marsWeather.maxTemp}°C to {marsWeather.minTemp}°C</p>
                    <p>• Pressure: {marsWeather.pressure} Pa (1% of Earth)</p>
                    <p>• Wind: {marsWeather.windSpeed} km/h</p>
                    <p>• Season: {marsWeather.season}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-starlight-blue mb-2">🌍 Earth Average</h5>
                    <p>• Temperature: 15°C average</p>
                    <p>• Pressure: 101,325 Pa</p>
                    <p>• Wind: Variable</p>
                    <p>• Season: Depends on location</p>
                  </div>
                </div>
              </div>
            </div>
            <PlanetaryDataTab />
          </div>
        )}

        {/* Rover Builder */}
        {activeSubTab === 'rover-builder' && (
          <div className="space-y-6">
            <div className="cosmic-card p-6">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Settings className="w-6 h-6 text-nebula-purple" />
                Build Your Mars Rover
              </h3>
              
              {/* Current Build */}
              <div className="bg-nebula-purple/20 rounded-lg p-4 mb-6">
                <h4 className="font-bold mb-3">Your Rover Configuration</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {roverBuild.map((component) => (
                    <div
                      key={component.id}
                      className="bg-cosmic-navy/50 rounded-lg p-3 text-center relative"
                    >
                      <span className="text-2xl block mb-1">{component.emoji}</span>
                      <p className="text-xs font-medium">{component.name}</p>
                      <button
                        onClick={() => handleComponentRemove(component.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-coral-glow rounded-full text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {roverBuild.length > 0 && (
                  <div className="mt-4 text-center">
                    <button className="cosmic-button-secondary flex items-center gap-2 mx-auto">
                      <Play className="w-4 h-4" />
                      Test Drive Your Rover
                    </button>
                  </div>
                )}
              </div>
              
              {/* Available Components */}
              <h4 className="font-bold mb-4">Available Components</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roverComponents.map((component) => (
                  <motion.div
                    key={component.id}
                    className={`cosmic-card p-4 ${
                      component.unlocked ? 'ring-2 ring-aurora-green' : 'opacity-60'
                    }`}
                    whileHover={component.unlocked ? { scale: 1.02 } : {}}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{component.emoji}</span>
                      <div>
                        <h5 className="font-bold">{component.name}</h5>
                        <p className="text-xs text-gray-400">{component.type}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{component.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-starlight-blue">
                        {component.points > 0 ? `${component.points} pts` : 'Free'}
                      </span>
                      {component.unlocked ? (
                        <button
                          onClick={() => handleComponentAdd(component)}
                          className="cosmic-button text-xs px-2 py-1"
                          disabled={roverBuild.find(c => c.id === component.id) !== undefined}
                        >
                          {roverBuild.find(c => c.id === component.id) ? 'Added' : 'Add'}
                        </button>
                      ) : (
                        <button
                          onClick={() => unlockComponent(component)}
                          className="cosmic-button-secondary text-xs px-2 py-1"
                          disabled={userPoints < component.points}
                        >
                          Unlock
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mission Log */}
        {activeSubTab === 'mission-log' && (
          <div className="space-y-6">
            <div className="cosmic-card p-6">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Calendar className="w-6 h-6 text-aurora-green" />
                Mars Mission Log
              </h3>
              <div className="space-y-4">
                {missionLogs.map((log) => (
                  <motion.div
                    key={log.sol}
                    className="cosmic-card p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{log.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-aurora-green">{log.title}</h4>
                          <span className="text-sm text-gray-400">Sol {log.sol}</span>
                        </div>
                        <p className="text-gray-300 mb-2">{log.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="bg-starlight-blue/20 text-starlight-blue px-2 py-1 rounded-full">
                            {log.activity}
                          </span>
                          {log.discovery && (
                            <span className="bg-aurora-green/20 text-aurora-green px-2 py-1 rounded-full">
                              🔬 Discovery!
                            </span>
                          )}
                        </div>
                        {log.discovery && (
                          <p className="text-aurora-green text-sm mt-2 font-medium">
                            {log.discovery}
                          </p>
                        )}
                      </div>
                    </div>
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