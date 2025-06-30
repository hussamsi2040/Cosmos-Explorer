'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  Moon, 
  Globe, 
  Rocket, 
  BookOpen,
  Sparkles
} from 'lucide-react'

interface Tab {
  id: string
  name: string
  icon: React.ElementType
  emoji: string
  description: string
}

const tabs: Tab[] = [
  {
    id: 'home',
    name: 'Home',
    icon: Home,
    emoji: '🏠',
    description: 'Daily cosmic wonders and your progress'
  },
  {
    id: 'night-sky',
    name: 'Night Sky',
    icon: Moon,
    emoji: '🌌',
    description: 'AR stargazing and constellation stories'
  },
  {
    id: 'mars-base',
    name: 'Mars Base',
    icon: Globe,
    emoji: '🪐',
    description: 'Explore Mars with real rover photos'
  },
  {
    id: 'missions',
    name: 'Missions',
    icon: Rocket,
    emoji: '🚀',
    description: 'SpaceX launches and ISS tracking'
  },
  {
    id: 'learn',
    name: 'Learn',
    icon: BookOpen,
    emoji: '🤖',
    description: 'AI cosmic tutor and quizzes'
  }
]

interface CosmicNavigationProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export default function CosmicNavigation({ 
  activeTab, 
  onTabChange, 
  className = '' 
}: CosmicNavigationProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  return (
    <>
      {/* Desktop Navigation - Top Bar */}
      <nav className={`hidden md:flex bg-cosmic-gradient border-b border-starlight-blue/20 backdrop-blur-sm ${className}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <Sparkles className="w-8 h-8 text-aurora-green animate-twinkle" />
                <div className="absolute inset-0 w-8 h-8 bg-aurora-green/20 rounded-full blur-sm animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">
                  Cosmic Adventure Academy
                </h1>
                <p className="text-sm text-gray-300">Explore • Learn • Discover</p>
              </div>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex gap-2">
              {tabs.map((tab, index) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    onMouseEnter={() => setHoveredTab(tab.id)}
                    onMouseLeave={() => setHoveredTab(null)}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 accessibility-focus ${
                      isActive 
                        ? 'tab-active shadow-lg shadow-starlight-blue/25' 
                        : 'tab-inactive'
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden lg:block">{tab.name}</span>
                    <span className="text-lg">{tab.emoji}</span>
                    
                    {/* Hover tooltip */}
                    {hoveredTab === tab.id && !isActive && (
                      <motion.div
                        className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="bg-cosmic-navy border border-starlight-blue/30 rounded-lg px-3 py-2 text-sm whitespace-nowrap">
                          <p className="text-white font-medium">{tab.name}</p>
                          <p className="text-gray-300 text-xs">{tab.description}</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-cosmic-gradient border-t border-starlight-blue/20 backdrop-blur-sm">
        <div className="flex justify-around py-2">
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300 accessibility-focus ${
                  isActive 
                    ? 'tab-active' 
                    : 'tab-inactive'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" />
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-aurora-green rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">{tab.name}</span>
              </motion.button>
            )
          })}
        </div>
      </nav>
    </>
  )
}