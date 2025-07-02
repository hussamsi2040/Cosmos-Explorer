"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Sparkles, Zap, Globe, Rocket, Star, Users, Calendar, Trash2, Bot, Target } from "lucide-react";

// Import components with lazy loading for better performance
import dynamic from "next/dynamic";

const MissionDashboardTab = dynamic(() => import("../../components/MissionDashboardTab"), { 
  loading: () => <ModernLoader title="Mission Dashboard" />,
  ssr: false 
});
const ISSTrackingTab = dynamic(() => import("../../components/ISSTrackingTab"), { 
  loading: () => <ModernLoader title="ISS Tracker" />,
  ssr: false 
});
const SpaceWeatherTab = dynamic(() => import("../../components/SpaceWeatherTab"), { 
  loading: () => <ModernLoader title="Space Weather" />,
  ssr: false 
});
const CosmicEventPlanner = dynamic(() => import("../../components/CosmicEventPlanner"), { 
  loading: () => <ModernLoader title="Cosmic Events" />,
  ssr: false 
});
const ExoplanetExplorer = dynamic(() => import("../../components/ExoplanetExplorer"), { 
  loading: () => <ModernLoader title="Exoplanet Explorer" />,
  ssr: false 
});
const SpaceDebrisTracker = dynamic(() => import("../../components/SpaceDebrisTracker"), { 
  loading: () => <ModernLoader title="Space Debris" />,
  ssr: false 
});
const AISpaceTutor = dynamic(() => import("../../components/AISpaceTutor"), { 
  loading: () => <ModernLoader title="AI Tutor" />,
  ssr: false 
});
const PayloadExplorerTab = dynamic(() => import("../../components/PayloadExplorerTab"), { 
  loading: () => <ModernLoader title="Payload Explorer" />,
  ssr: false 
});
const LaunchGameTab = dynamic(() => import("../../components/LaunchGameTab"), { 
  loading: () => <ModernLoader title="Launch Game" />,
  ssr: false 
});
const RocketsTab = dynamic(() => import("../../components/RocketsTab"), { 
  loading: () => <ModernLoader title="Rockets" />,
  ssr: false 
});
const ISSCrewLogTab = dynamic(() => import("../../components/ISSCrewLogTab"), { 
  loading: () => <ModernLoader title="ISS Crew" />,
  ssr: false 
});
const SpaceCareersTab = dynamic(() => import("../../components/SpaceCareersTab"), { 
  loading: () => <ModernLoader title="Space Careers" />,
  ssr: false 
});
const CosmicChallengesTab = dynamic(() => import("../../components/CosmicChallengesTab"), { 
  loading: () => <ModernLoader title="Cosmic Challenges" />,
  ssr: false 
});
const AILessonPathTab = dynamic(() => import("../../components/AILessonPathTab"), { 
  loading: () => <ModernLoader title="AI Lessons" />,
  ssr: false 
});

// Modern loading component
const ModernLoader = ({ title }: { title: string }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative min-h-[400px] rounded-2xl bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-purple-900/50 backdrop-blur-xl border border-white/10 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 animate-pulse" />
    <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-6 p-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
        <Sparkles className="absolute inset-0 w-6 h-6 m-auto text-blue-400 animate-pulse" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">Initializing advanced space technology...</p>
      </div>
    </div>
  </motion.div>
);

const modernTabs = [
  {
    id: "dashboard",
    label: "Mission Control",
    icon: Target,
    component: MissionDashboardTab,
    gradient: "from-blue-600 to-cyan-600",
    description: "Central command hub",
    category: "Core"
  },
  {
    id: "iss",
    label: "ISS Live",
    icon: Globe,
    component: ISSTrackingTab,
    gradient: "from-green-500 to-emerald-600",
    description: "Real-time tracking",
    category: "Live Data"
  },
  {
    id: "weather",
    label: "Space Weather",
    icon: Zap,
    component: SpaceWeatherTab,
    gradient: "from-orange-500 to-red-600",
    description: "Solar conditions",
    category: "Live Data"
  },
  {
    id: "events",
    label: "Cosmic Events",
    icon: Calendar,
    component: CosmicEventPlanner,
    gradient: "from-purple-500 to-pink-600",
    description: "Astronomical calendar",
    category: "Discovery"
  },
  {
    id: "exoplanets",
    label: "Exoplanet Explorer",
    icon: Star,
    component: ExoplanetExplorer,
    gradient: "from-indigo-500 to-purple-600",
    description: "Distant worlds",
    category: "Discovery"
  },
  {
    id: "debris",
    label: "Space Debris",
    icon: Trash2,
    component: SpaceDebrisTracker,
    gradient: "from-red-500 to-orange-600",
    description: "Orbital monitoring",
    category: "Safety"
  },
  {
    id: "tutor",
    label: "AI Tutor",
    icon: Bot,
    component: AISpaceTutor,
    gradient: "from-cyan-500 to-blue-600",
    description: "Smart learning",
    category: "Education"
  },
  {
    id: "payload",
    label: "Payload Explorer",
    icon: Target,
    component: PayloadExplorerTab,
    gradient: "from-emerald-500 to-green-600",
    description: "Mission cargo",
    category: "Discovery"
  },
  {
    id: "game",
    label: "Launch Simulator",
    icon: Rocket,
    component: LaunchGameTab,
    gradient: "from-rose-500 to-pink-600",
    description: "Interactive game",
    category: "Games"
  },
  {
    id: "rockets",
    label: "Rocket Fleet",
    icon: Rocket,
    component: RocketsTab,
    gradient: "from-blue-500 to-indigo-600",
    description: "Vehicle database",
    category: "Technology"
  },
  {
    id: "crew",
    label: "ISS Crew",
    icon: Users,
    component: ISSCrewLogTab,
    gradient: "from-teal-500 to-cyan-600",
    description: "Astronaut logs",
    category: "People"
  },
  {
    id: "careers",
    label: "Space Careers",
    icon: Target,
    component: SpaceCareersTab,
    gradient: "from-violet-500 to-purple-600",
    description: "Future pathways",
    category: "Education"
  },
  {
    id: "challenges",
    label: "Cosmic Challenges",
    icon: Zap,
    component: CosmicChallengesTab,
    gradient: "from-amber-500 to-orange-600",
    description: "Test your knowledge",
    category: "Games"
  },
  {
    id: "lessons",
    label: "AI Lessons",
    icon: Bot,
    component: AILessonPathTab,
    gradient: "from-fuchsia-500 to-pink-600",
    description: "Personalized learning",
    category: "Education"
  }
];

const categories = ["All", "Core", "Live Data", "Discovery", "Safety", "Education", "Games", "Technology", "People"];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTabs = modernTabs.filter(tab => {
    const matchesSearch = tab.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tab.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tab.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const ActiveComponent = modernTabs.find(tab => tab.id === activeTab)?.component || MissionDashboardTab;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-cyan-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {/* Modern Header */}
        <div className="px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-black mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Explore the Cosmos
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Discover the universe with cutting-edge space exploration tools powered by real-time data and AI
              </p>
            </div>

            {/* Modern Search & Filter */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search space tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                        : "bg-white/10 backdrop-blur-xl text-gray-300 hover:bg-white/20 hover:text-white border border-white/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Modern Tab Grid */}
        <div className="px-6 mb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8"
            >
              <AnimatePresence>
                {filteredTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const IconComponent = tab.icon;
                  
                  return (
                    <motion.button
                      key={tab.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group relative p-4 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 shadow-2xl shadow-blue-500/20"
                          : "bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${tab.gradient} p-2 mb-3 mx-auto ${
                        isActive ? "shadow-lg" : "group-hover:shadow-md"
                      } transition-all duration-300`}>
                        <IconComponent className="w-full h-full text-white" />
                      </div>
                      
                      <h3 className={`font-bold text-sm mb-1 transition-colors ${
                        isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                      }`}>
                        {tab.label}
                      </h3>
                      
                      <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                        {tab.description}
                      </p>

                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 pointer-events-none"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Modern Content Area */}
        <div className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <ActiveComponent />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 