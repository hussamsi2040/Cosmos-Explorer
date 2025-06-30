'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Award, 
  Zap, 
  ArrowRight, 
  Play, 
  Volume2,
  VolumeX,
  Target,
  Star,
  TrendingUp
} from 'lucide-react'
import DailyCosmicJournal from './DailyCosmicJournal'

interface HomeTabProps {
  apod?: any
  apodError?: string
  epicDates: string[]
  epicDefaultDate: string
  eonet?: any
  eonetError?: string
  onTabChange: (tabId: string) => void
}

interface UserProgress {
  learningStreak: number
  badges: Badge[]
  cosmicPoints: number
  totalDaysActive: number
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
}

interface DailyChallenge {
  id: string
  title: string
  description: string
  action: string
  targetTab: string
  points: number
  completed: boolean
}

export default function HomeTab({
  apod,
  apodError,
  epicDates,
  epicDefaultDate,
  eonet,
  eonetError,
  onTabChange
}: HomeTabProps) {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    learningStreak: 3,
    badges: [
      { id: 'star-spotter', name: 'Star Spotter', description: 'Viewed your first constellation', icon: '⭐', earned: true, earnedDate: '2024-06-28' },
      { id: 'mars-explorer', name: 'Mars Explorer', description: 'Viewed 5 Mars rover photos', icon: '🔴', earned: true, earnedDate: '2024-06-29' },
      { id: 'earth-watcher', name: 'Earth Watcher', description: 'Checked Earth imagery 3 days in a row', icon: '🌍', earned: false }
    ],
    cosmicPoints: 250,
    totalDaysActive: 7
  })

  const [dailyChallenge] = useState<DailyChallenge>({
    id: 'find-constellation',
    title: 'Constellation Hunter',
    description: 'Find and learn about Orion constellation in the Night Sky',
    action: 'Start Challenge',
    targetTab: 'night-sky',
    points: 50,
    completed: false
  })

  const [isNarrationEnabled, setIsNarrationEnabled] = useState(false)
  const [currentFactIndex, setCurrentFactIndex] = useState(0)

  const dailyFacts = [
    "The International Space Station travels at 17,500 mph! 🚀",
    "Mars has the largest volcano in our solar system - Olympus Mons! 🌋",
    "A day on Venus is longer than its year! ⏰",
    "There are more trees on Earth than stars in the Milky Way! 🌳"
  ]

  const quickLinks = [
    { title: 'Explore Mars', description: 'See today\'s rover photos', tab: 'mars-base', icon: '🪐', color: 'coral-glow' },
    { title: 'Track ISS', description: 'Find the space station', tab: 'missions', icon: '🛰️', color: 'starlight-blue' },
    { title: 'Night Sky', description: 'What\'s visible tonight?', tab: 'night-sky', icon: '🌙', color: 'nebula-purple' },
    { title: 'Ask AI', description: 'Get cosmic answers', tab: 'learn', icon: '🤖', color: 'aurora-green' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex(prev => (prev + 1) % dailyFacts.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleNarration = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isNarrationEnabled) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.8
        utterance.pitch = 1.1
        speechSynthesis.speak(utterance)
      }
    }
  }

  const handleChallengeStart = () => {
    onTabChange(dailyChallenge.targetTab)
    // In a real app, you'd track this challenge start
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Welcome Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">
          Welcome, Cosmic Explorer! 🚀
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Ready for another day of space adventures? Check out what's happening in the cosmos today!
        </p>
        
        {/* Voice Control */}
        <motion.button
          onClick={() => setIsNarrationEnabled(!isNarrationEnabled)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            isNarrationEnabled ? 'bg-aurora-green text-cosmic-navy' : 'bg-cosmic-navy/50 text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isNarrationEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          Voice Narration {isNarrationEnabled ? 'On' : 'Off'}
        </motion.button>
      </motion.div>

      {/* Progress Dashboard */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Learning Streak */}
        <div className="cosmic-card p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-6 h-6 text-solar-orange" />
            <h3 className="text-xl font-bold">Learning Streak</h3>
          </div>
          <div className="text-3xl font-bold text-aurora-green mb-2">
            {userProgress.learningStreak} Days
          </div>
          <p className="text-gray-400 text-sm">Keep exploring to maintain your streak!</p>
        </div>

        {/* Cosmic Points */}
        <div className="cosmic-card p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="w-6 h-6 text-starlight-blue" />
            <h3 className="text-xl font-bold">Cosmic Points</h3>
          </div>
          <div className="text-3xl font-bold text-starlight-blue mb-2">
            {userProgress.cosmicPoints}
          </div>
          <p className="text-gray-400 text-sm">Earned from challenges and exploration</p>
        </div>

        {/* Badges Earned */}
        <div className="cosmic-card p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Award className="w-6 h-6 text-coral-glow" />
            <h3 className="text-xl font-bold">Badges</h3>
          </div>
          <div className="flex justify-center gap-2 mb-2">
            {userProgress.badges.map(badge => (
              <motion.div
                key={badge.id}
                className={`text-2xl p-2 rounded-lg ${
                  badge.earned ? 'bg-aurora-green/20' : 'bg-gray-600/20 grayscale'
                }`}
                whileHover={{ scale: 1.1 }}
                title={badge.description}
              >
                {badge.icon}
              </motion.div>
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            {userProgress.badges.filter(b => b.earned).length} of {userProgress.badges.length} earned
          </p>
        </div>
      </motion.div>

      {/* Daily Challenge */}
      <motion.div
        className="cosmic-card p-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-6 h-6 text-coral-glow" />
              <h3 className="text-xl font-bold">Today's Challenge</h3>
              <span className="bg-coral-glow/20 text-coral-glow px-2 py-1 rounded-full text-sm font-medium">
                +{dailyChallenge.points} pts
              </span>
            </div>
            <h4 className="text-lg font-semibold text-aurora-green mb-2">
              {dailyChallenge.title}
            </h4>
            <p className="text-gray-300 mb-4">{dailyChallenge.description}</p>
          </div>
          <motion.button
            onClick={handleChallengeStart}
            className="cosmic-button-secondary flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-4 h-4" />
            {dailyChallenge.action}
          </motion.button>
        </div>
      </motion.div>

      {/* Rotating Daily Facts */}
      <motion.div
        className="cosmic-card p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
          <TrendingUp className="w-6 h-6 text-aurora-green" />
          Did You Know?
        </h3>
        <motion.p
          key={currentFactIndex}
          className="text-lg text-aurora-green font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          onClick={() => handleNarration(dailyFacts[currentFactIndex])}
        >
          {dailyFacts[currentFactIndex]}
        </motion.p>
        <p className="text-gray-400 text-sm mt-2">Click to hear this fact!</p>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-2xl font-bold text-center">Quick Adventures</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <motion.button
              key={link.tab}
              onClick={() => onTabChange(link.tab)}
              className={`cosmic-card p-6 text-center hover:scale-105 transition-all group`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-3">{link.icon}</div>
              <h4 className="font-bold text-lg mb-2 group-hover:text-aurora-green transition-colors">
                {link.title}
              </h4>
              <p className="text-gray-400 text-sm">{link.description}</p>
              <ArrowRight className="w-4 h-4 mx-auto mt-3 text-aurora-green opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Daily Cosmic Journal */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <h3 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Calendar className="w-6 h-6 text-starlight-blue" />
          Today's Cosmic Journal
        </h3>
        <DailyCosmicJournal
          apod={apod}
          apodError={apodError}
          epicDates={epicDates}
          epicDefaultDate={epicDefaultDate}
        />
      </motion.div>
    </div>
  )
}