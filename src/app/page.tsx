'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CosmicNavigation from '../components/CosmicNavigation'
import HomeTab from '../components/HomeTab'
import NightSkyTab from '../components/NightSkyTab'
import MarsBaseTab from '../components/MarsBaseTab'
import MissionsTab from '../components/MissionsTab'
import LearnTab from '../components/LearnTab'
import { getAPOD } from "../lib/api/apod"
import { getEPICDates } from "../lib/api/epic"
import { getEONETEvents } from "../lib/api/eonet"

export default function Home() {
  const [activeTab, setActiveTab] = useState('home')
  const [apod, setApod] = useState(null)
  const [eonet, setEonet] = useState(null)
  const [apodError, setApodError] = useState<string | undefined>(undefined)
  const [eonetError, setEonetError] = useState<string | undefined>(undefined)
  const [epicDates, setEpicDates] = useState<string[]>([])
  const [epicDefaultDate, setEpicDefaultDate] = useState("")

  useEffect(() => {
    // Load API data on component mount
    const loadData = async () => {
      try {
        const apodData = await getAPOD()
        setApod(apodData)
      } catch (e) {
        setApodError("Could not load Astronomy Picture of the Day.")
      }

      try {
        const eonetData = await getEONETEvents()
        setEonet(eonetData)
      } catch (e) {
        setEonetError("Could not load event data.")
      }

      try {
        const dates = await getEPICDates()
        setEpicDates(dates)
        setEpicDefaultDate(dates[dates.length - 1] || "")
      } catch (e) {
        console.error("Could not load EPIC dates:", e)
      }
    }

    loadData()
  }, [])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            apod={apod}
            apodError={apodError}
            epicDates={epicDates}
            epicDefaultDate={epicDefaultDate}
            eonet={eonet}
            eonetError={eonetError}
            onTabChange={handleTabChange}
          />
        )
      case 'night-sky':
        return <NightSkyTab onTabChange={handleTabChange} />
      case 'mars-base':
        return <MarsBaseTab onTabChange={handleTabChange} />
      case 'missions':
        return <MissionsTab onTabChange={handleTabChange} />
      case 'learn':
        return <LearnTab onTabChange={handleTabChange} />
      default:
        return (
          <HomeTab
            apod={apod}
            apodError={apodError}
            epicDates={epicDates}
            epicDefaultDate={epicDefaultDate}
            eonet={eonet}
            eonetError={eonetError}
            onTabChange={handleTabChange}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-navy via-slate-900 to-black">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-star top-20 left-10 opacity-30" />
        <div className="floating-star top-40 right-20 opacity-50" />
        <div className="floating-star bottom-32 left-1/4 opacity-40" />
        <div className="floating-star top-1/3 right-1/3 opacity-60" />
        <div className="floating-star bottom-20 right-10 opacity-30" />
      </div>

      <CosmicNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
      />

      <main className="pt-4 pb-20 md:pb-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          {renderActiveTab()}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="hidden md:block bg-cosmic-navy/50 border-t border-starlight-blue/20 backdrop-blur-sm py-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            Cosmic Adventure Academy • Powered by NASA APIs • Made with ❤️ for young explorers
          </p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
            <span>Data: NASA APOD, EPIC, EONET, SpaceX</span>
            <span>•</span>
            <span>Real-time space data for education</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
