'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  MessageCircle, 
  BookOpen, 
  Brain, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff,
  Lightbulb
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

export default function LearnTab({ onTabChange }: LearnTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'ai-tutor' | 'topics' | 'quizzes'>('ai-tutor')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hi there! I\'m your Cosmic Tutor. Ask me anything about space, Earth, and the universe. I\'ll explain it in a fun, clear way.',
      timestamp: Date.now()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tutorMode, setTutorMode] = useState<'eli5' | 'regular' | 'nerdy'>('regular')
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognition = useRef<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  useEffect(() => {
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

    setTimeout(() => {
      const responses: Record<string, Record<string, string>> = {
        "Why is Mars red?": {
          eli5: "Mars looks red because it's covered in rusty dirt! Just like when a bike gets rusty and turns orange-red, Mars has lots of iron that got rusty over millions of years! 🔴",
          regular: "Mars appears red due to iron oxide (rust) on its surface. The planet's soil contains iron particles that have oxidized over time, giving it that distinctive reddish color.",
          nerdy: "Mars' red coloration results from extensive surface oxidation of iron-bearing minerals. The regolith contains approximately 14% iron oxide (Fe₂O₃), primarily in the form of hematite and maghemite."
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

  const sampleQuestions = [
    "Why is Mars red?",
    "How fast does the ISS travel?",
    "What causes auroras?", 
    "How big is the Sun compared to Earth?"
  ]

  const subTabs = [
    { id: 'ai-tutor', name: 'AI Tutor', icon: MessageCircle },
    { id: 'topics', name: 'Topic Explorer', icon: BookOpen },
    { id: 'quizzes', name: 'Quick Quizzes', icon: Brain }
  ]

  return (
    <div className="gap-1 px-6 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-white tracking-light text-[32px] font-bold leading-tight">Learn</p>
            <p className="text-[#a2acb3] text-sm font-normal leading-normal">Explore the universe with our AI tutor, curated topics, and quick quizzes.</p>
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

        {/* AI Tutor Content */}
        {activeSubTab === 'ai-tutor' && (
          <>
            {/* Mode Selection Tabs */}
            <div className="pb-3">
              <div className="flex border-b border-[#40484f] px-4 gap-8">
                <a 
                  onClick={() => setTutorMode('eli5')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 cursor-pointer ${
                    tutorMode === 'eli5' 
                      ? 'border-b-white text-white' 
                      : 'border-b-transparent text-[#a2acb3]'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">ELI5</p>
                </a>
                <a 
                  onClick={() => setTutorMode('regular')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 cursor-pointer ${
                    tutorMode === 'regular' 
                      ? 'border-b-white text-white' 
                      : 'border-b-transparent text-[#a2acb3]'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Regular</p>
                </a>
                <a 
                  onClick={() => setTutorMode('nerdy')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 cursor-pointer ${
                    tutorMode === 'nerdy' 
                      ? 'border-b-white text-white' 
                      : 'border-b-transparent text-[#a2acb3]'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Nerdy Space Club</p>
                </a>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex gap-6">
              {/* Left Side - Question Input */}
              <div className="flex-1 max-w-[480px]">
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your question here..."
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] focus:border-none min-h-36 placeholder:text-[#a2acb3] p-4 text-base font-normal leading-normal"
                    />
                  </label>
                </div>
                <div className="flex px-4 py-3 justify-end">
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#c5daeb] text-[#121516] text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
                  >
                    <span className="truncate">Ask</span>
                  </button>
                </div>
              </div>

              {/* Right Side - Chat Interface */}
              <div className="layout-content-container flex flex-col w-[360px]">
                <div className="flex items-end gap-3 p-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCffnpAchok3htGniMvhi3tTBwc69QDw3_vBLfvgFqqcXLBbsQqAmGSrq4HLQ6U9WI-czXDH7R802vafN0ZXzMPw3E6TE5pbxbxyAItAXZAq46rgGPerKp4sJErM8VDKUC2WoTf7LtyHgHBjLqdl1uMeX9ACjD8I1VF5CcnnazxKiXwW0fMBIuD9Fj1LoephuNrd-gaOsGtq83uYVYyfIfJj2u7EhdqjQP3h6qkvXENYoa9qiaOr3QlrT1zNusRB_SkiwZ5ItaTp-M")'}}
                  />
                  <div className="flex flex-1 flex-col gap-1 items-start">
                    <p className="text-[#a2acb3] text-[13px] font-normal leading-normal max-w-[360px]">Cosmic Tutor</p>
                    <p className="text-base font-normal leading-normal flex max-w-[360px] rounded-xl px-4 py-3 bg-[#2c3135] text-white">
                      Hi there! I'm your Cosmic Tutor. Ask me anything about space, Earth, and the universe. I'll explain it in a fun, clear way.
                    </p>
                  </div>
                </div>

                {/* Additional Chat Messages */}
                <div className="px-4 space-y-3">
                  {chatMessages.slice(1).map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.type === 'assistant' && (
                        <div 
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8 shrink-0 mr-2 mt-1"
                          style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCffnpAchok3htGniMvhi3tTBwc69QDw3_vBLfvgFqqcXLBbsQqAmGSrq4HLQ6U9WI-czXDH7R802vafN0ZXzMPw3E6TE5pbxbxyAItAXZAq46rgGPerKp4sJErM8VDKUC2WoTf7LtyHgHBjLqdl1uMeX9ACjD8I1VF5CcnnazxKiXwW0fMBIuD9Fj1LoephuNrd-gaOsGtq83uYVYyfIfJj2u7EhdqjQP3h6qkvXENYoa9qiaOr3QlrT1zNusRB_SkiwZ5ItaTp-M")'}}
                        />
                      )}
                      <div className={`max-w-xs p-3 rounded-xl ${
                        message.type === 'user' 
                          ? 'bg-[#c5daeb] text-[#121516]' 
                          : 'bg-[#2c3135] text-white'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div 
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8 shrink-0 mr-2 mt-1"
                        style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCffnpAchok3htGniMvhi3tTBwc69QDw3_vBLfvgFqqcXLBbsQqAmGSrq4HLQ6U9WI-czXDH7R802vafN0ZXzMPw3E6TE5pbxbxyAItAXZAq46rgGPerKp4sJErM8VDKUC2WoTf7LtyHgHBjLqdl1uMeX9ACjD8I1VF5CcnnazxKiXwW0fMBIuD9Fj1LoephuNrd-gaOsGtq83uYVYyfIfJj2u7EhdqjQP3h6qkvXENYoa9qiaOr3QlrT1zNusRB_SkiwZ5ItaTp-M")'}}
                      />
                      <div className="bg-[#2c3135] p-3 rounded-xl">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-aurora-green rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-aurora-green rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-aurora-green rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Topic Explorer */}
        {activeSubTab === 'topics' && (
          <div className="text-center p-8">
            <div className="text-6xl mb-4">📚</div>
            <h4 className="text-xl font-bold mb-2">Topic Explorer Coming Soon!</h4>
            <p className="text-gray-300">Curated learning modules about space and Earth science.</p>
          </div>
        )}

        {/* Quick Quizzes */}
        {activeSubTab === 'quizzes' && (
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🧠</div>
            <h4 className="text-xl font-bold mb-2">Quick Quizzes Coming Soon!</h4>
            <p className="text-gray-300">Test your knowledge with fun cosmic quizzes.</p>
          </div>
        )}
      </div>
    </div>
  )
}