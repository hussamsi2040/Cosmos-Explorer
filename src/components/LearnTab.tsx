'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  BookOpen, 
  Brain, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff,
  Send,
  Sparkles,
  Trophy,
  ChevronRight,
  RefreshCw,
  Star,
  Target,
  Lightbulb,
  Rocket,
  Users
} from 'lucide-react'

interface LearnTabProps {
  onTabChange: (tabId: string) => void
}

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: number
  mode?: 'eli5' | 'regular' | 'nerdy'
}

interface Topic {
  id: string
  title: string
  icon: string
  description: string
  modules: TopicModule[]
  color: string
}

interface TopicModule {
  id: string
  title: string
  content: string
  image?: string
  quiz?: Quiz
}

interface Quiz {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  points: number
}

interface UserStats {
  totalQuestions: number
  correctAnswers: number
  topicsExplored: number
  streakDays: number
  badges: string[]
}

const topics: Topic[] = [
  {
    id: 'stars-galaxies',
    title: 'Stars & Galaxies',
    icon: '⭐',
    description: 'Explore the life cycle of stars and structure of galaxies',
    color: 'starlight-blue',
    modules: [
      {
        id: 'star-birth',
        title: 'How Stars Are Born',
        content: 'Stars are born in giant clouds of gas and dust called nebulae. When these clouds collapse under gravity, they heat up and nuclear fusion begins!',
        quiz: {
          id: 'star-birth-quiz',
          question: 'Where are stars born?',
          options: ['In planets', 'In nebulae', 'In black holes', 'In comets'],
          correctAnswer: 1,
          explanation: 'Stars are born in nebulae - giant clouds of gas and dust that collapse under gravity!',
          points: 25
        }
      }
    ]
  },
  {
    id: 'rockets',
    title: 'Rockets & Spacecraft',
    icon: '🚀',
    description: 'Learn how rockets work and explore spacecraft design',
    color: 'coral-glow',
    modules: [
      {
        id: 'rocket-science',
        title: 'Rocket Science Basics',
        content: 'Rockets work by Newton\'s third law: for every action, there\'s an equal and opposite reaction. Hot gases shoot down, rocket goes up!',
        quiz: {
          id: 'rocket-quiz',
          question: 'What law explains how rockets work?',
          options: ['First Law', 'Second Law', 'Third Law', 'Fourth Law'],
          correctAnswer: 2,
          explanation: 'Newton\'s Third Law states that for every action, there\'s an equal and opposite reaction!',
          points: 30
        }
      }
    ]
  },
  {
    id: 'earth-systems',
    title: 'Earth Systems',
    icon: '🌍',
    description: 'Understand Earth\'s atmosphere, climate, and natural events',
    color: 'aurora-green',
    modules: [
      {
        id: 'atmosphere',
        title: 'Earth\'s Atmosphere',
        content: 'Our atmosphere has layers: troposphere (weather), stratosphere (ozone), mesosphere (meteors burn up), and thermosphere (auroras)!',
      }
    ]
  },
  {
    id: 'space-weather',
    title: 'Space Weather',
    icon: '☀️',
    description: 'Discover solar flares, cosmic rays, and space storms',
    color: 'solar-orange',
    modules: [
      {
        id: 'solar-flares',
        title: 'Solar Flares',
        content: 'Solar flares are massive explosions on the Sun that release energy equivalent to billions of atomic bombs! They can affect satellites and power grids.',
      }
    ]
  }
]

const sampleQuestions = [
  "Why is Mars red?",
  "How fast does the ISS travel?",
  "What causes auroras?", 
  "How big is the Sun compared to Earth?",
  "Why don't we fall off the Earth?",
  "What is a black hole?",
  "How do rockets work in space?",
  "Why do we have seasons?"
]

export default function LearnTab({ onTabChange }: LearnTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'ai-tutor' | 'topics' | 'quizzes'>('ai-tutor')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Cosmic Tutor! 🤖✨ Ask me anything about space, Earth, rockets, or the universe. I can explain things in different ways too!',
      timestamp: Date.now()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tutorMode, setTutorMode] = useState<'eli5' | 'regular' | 'nerdy'>('regular')
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [selectedModule, setSelectedModule] = useState<TopicModule | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [userStats, setUserStats] = useState<UserStats>({
    totalQuestions: 15,
    correctAnswers: 12,
    topicsExplored: 3,
    streakDays: 5,
    badges: ['🌟', '🚀', '🔬']
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognition = useRef<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognition.current = new (window as any).webkitSpeechRecognition()
      recognition.current.continuous = false
      recognition.current.interimResults = false
      recognition.current.lang = 'en-US'

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognition.current.onerror = () => {
        setIsListening(false)
      }
    }
  }, [])

  const subTabs = [
    { id: 'ai-tutor', name: 'AI Tutor', icon: MessageCircle, description: 'Ask cosmic questions' },
    { id: 'topics', name: 'Topic Explorer', icon: BookOpen, description: 'Curated learning modules' },
    { id: 'quizzes', name: 'Quick Quiz', icon: Brain, description: 'Test your knowledge' }
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: Date.now()
    }

    setChatMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, Record<string, string>> = {
        "Why is Mars red?": {
          eli5: "Mars looks red because it's covered in rusty dirt! Just like when a bike gets rusty and turns orange-red, Mars has lots of iron that got rusty over millions of years! 🔴",
          regular: "Mars appears red due to iron oxide (rust) on its surface. The planet's soil contains iron particles that have oxidized over time, giving it that distinctive reddish color.",
          nerdy: "Mars' red coloration results from extensive surface oxidation of iron-bearing minerals. The regolith contains approximately 14% iron oxide (Fe₂O₃), primarily in the form of hematite and maghemite, which formed through aqueous alteration processes during the Noachian period."
        },
        "How fast does the ISS travel?": {
          eli5: "The ISS zooms around Earth super fast - about 17,500 miles per hour! That's so fast it could fly from New York to Los Angeles in 10 minutes! 🚀",
          regular: "The International Space Station travels at approximately 17,500 mph (28,000 km/h) and completes one orbit around Earth every 90 minutes.",
          nerdy: "The ISS maintains an orbital velocity of 7.66 km/s at an average altitude of 408 km, completing 15.5 orbits per day with an orbital period of approximately 92.68 minutes."
        }
      }

      const defaultResponses = {
        eli5: "That's a great question! Let me think about how to explain this in a simple way... 🤔 Space is full of amazing things to discover!",
        regular: "That's an interesting question about space! While I'd love to give you a detailed answer, I recommend exploring our topic modules or asking a more specific question.",
        nerdy: "Excellent inquiry! This touches on complex astrophysical phenomena. For detailed explanations, I recommend consulting our advanced learning modules."
      }

      const response = responses[inputMessage] || defaultResponses
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response[tutorMode],
        timestamp: Date.now(),
        mode: tutorMode
      }

      setChatMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)

      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response[tutorMode])
        utterance.rate = 0.9
        speechSynthesis.speak(utterance)
      }
    }, 1500)
  }

  const startListening = () => {
    if (recognition.current) {
      setIsListening(true)
      recognition.current.start()
    }
  }

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop()
      setIsListening(false)
    }
  }

  const handleSampleQuestion = (question: string) => {
    setInputMessage(question)
  }

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic)
    setSelectedModule(null)
  }

  const handleModuleSelect = (module: TopicModule) => {
    setSelectedModule(module)
    setShowQuiz(false)
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
          Cosmic Learning Hub 🤖
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Ask questions, explore topics, and test your knowledge with our AI tutor!
        </p>
      </motion.div>

      {/* User Stats */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="cosmic-card p-4 text-center">
          <Trophy className="w-6 h-6 text-aurora-green mx-auto mb-2" />
          <h3 className="font-bold">{userStats.correctAnswers}/{userStats.totalQuestions}</h3>
          <p className="text-sm text-gray-400">Quiz Score</p>
        </div>
        <div className="cosmic-card p-4 text-center">
          <BookOpen className="w-6 h-6 text-starlight-blue mx-auto mb-2" />
          <h3 className="font-bold">{userStats.topicsExplored}</h3>
          <p className="text-sm text-gray-400">Topics Explored</p>
        </div>
        <div className="cosmic-card p-4 text-center">
          <Star className="w-6 h-6 text-solar-orange mx-auto mb-2" />
          <h3 className="font-bold">{userStats.streakDays} days</h3>
          <p className="text-sm text-gray-400">Learning Streak</p>
        </div>
        <div className="cosmic-card p-4 text-center">
          <Sparkles className="w-6 h-6 text-nebula-purple mx-auto mb-2" />
          <div className="flex justify-center gap-1">
            {userStats.badges.map((badge, index) => (
              <span key={index} className="text-lg">{badge}</span>
            ))}
          </div>
          <p className="text-sm text-gray-400">Badges</p>
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
        {/* AI Tutor */}
        {activeSubTab === 'ai-tutor' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2 cosmic-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-starlight-blue" />
                  AI Cosmic Tutor
                </h3>
                <div className="flex items-center gap-2">
                  <select
                    value={tutorMode}
                    onChange={(e) => setTutorMode(e.target.value as any)}
                    className="cosmic-input text-sm px-2 py-1"
                  >
                    <option value="eli5">ELI5 (Simple)</option>
                    <option value="regular">Regular</option>
                    <option value="nerdy">Nerdy (Advanced)</option>
                  </select>
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`p-2 rounded-lg transition-all ${
                      voiceEnabled ? 'bg-aurora-green text-cosmic-navy' : 'bg-cosmic-navy/50'
                    }`}
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto bg-cosmic-navy/30 rounded-lg p-4 mb-4 space-y-3">
                <AnimatePresence>
                  {chatMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className={`max-w-xs lg:max-w-md p-3 rounded-xl ${
                        message.type === 'user' 
                          ? 'bg-starlight-blue text-white' 
                          : 'bg-aurora-green/20 text-white border border-aurora-green/30'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        {message.mode && (
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.mode === 'eli5' ? '👶 Simple' : message.mode === 'nerdy' ? '🧠 Advanced' : '📚 Regular'}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="bg-aurora-green/20 p-3 rounded-xl border border-aurora-green/30">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-aurora-green rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-aurora-green rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-aurora-green rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about stars, planets, rockets..."
                  className="cosmic-input flex-1"
                />
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-3 rounded-xl transition-all ${
                    isListening ? 'bg-coral-glow' : 'bg-cosmic-navy/50'
                  }`}
                  disabled={!recognition.current}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="cosmic-button p-3 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sample Questions */}
            <div className="cosmic-card p-6">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-solar-orange" />
                Try These Questions
              </h4>
              <div className="space-y-2">
                {sampleQuestions.map((question, index) => (
                  <motion.button
                    key={question}
                    onClick={() => handleSampleQuestion(question)}
                    className="w-full text-left p-3 bg-cosmic-navy/30 rounded-lg hover:bg-cosmic-navy/50 transition-all text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Topic Explorer */}
        {activeSubTab === 'topics' && (
          <div className="space-y-6">
            {!selectedTopic ? (
              <div className="cosmic-card p-6">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <BookOpen className="w-6 h-6 text-aurora-green" />
                  Learning Topics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topics.map((topic) => (
                    <motion.button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic)}
                      className="cosmic-card p-6 text-left transition-all hover:scale-105"
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{topic.icon}</span>
                        <h4 className="font-bold text-lg">{topic.title}</h4>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{topic.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{topic.modules.length} modules</span>
                        <ChevronRight className="w-4 h-4 text-aurora-green" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="cosmic-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="p-2 bg-cosmic-navy/50 rounded-lg hover:bg-cosmic-navy/70"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <span className="text-3xl">{selectedTopic.icon}</span>
                  <h3 className="text-xl font-bold">{selectedTopic.title}</h3>
                </div>

                {!selectedModule ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTopic.modules.map((module) => (
                      <motion.button
                        key={module.id}
                        onClick={() => handleModuleSelect(module)}
                        className="cosmic-card p-4 text-left hover:scale-105 transition-all"
                        whileHover={{ y: -2 }}
                      >
                        <h4 className="font-bold mb-2">{module.title}</h4>
                        <p className="text-gray-300 text-sm">{module.content.substring(0, 100)}...</p>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-cosmic-navy/30 rounded-lg p-6">
                      <h4 className="text-xl font-bold mb-4">{selectedModule.title}</h4>
                      <p className="text-gray-300 leading-relaxed">{selectedModule.content}</p>
                    </div>

                    {selectedModule.quiz && !showQuiz && (
                      <div className="text-center">
                        <button
                          onClick={() => setShowQuiz(true)}
                          className="cosmic-button-secondary flex items-center gap-2 mx-auto"
                        >
                          <Target className="w-4 h-4" />
                          Test Your Knowledge
                        </button>
                      </div>
                    )}

                    {selectedModule.quiz && showQuiz && (
                      <motion.div
                        className="cosmic-card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <h5 className="font-bold mb-4">{selectedModule.quiz.question}</h5>
                        <div className="space-y-2 mb-4">
                          {selectedModule.quiz.options.map((option, index) => (
                            <button
                              key={index}
                              className="w-full text-left p-3 bg-cosmic-navy/30 rounded-lg hover:bg-cosmic-navy/50 transition-all"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Quick Quiz */}
        {activeSubTab === 'quizzes' && (
          <div className="cosmic-card p-6">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-nebula-purple" />
              Quick Cosmic Quiz
            </h3>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🧠</div>
              <h4 className="text-xl font-bold mb-2">Coming Soon!</h4>
              <p className="text-gray-300 mb-6">
                Get ready for exciting quizzes about space, rockets, and Earth science!
              </p>
              <button className="cosmic-button-secondary">
                Start Practice Quiz
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}