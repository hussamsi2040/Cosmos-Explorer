'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

interface Message {
  id: string;
  type: 'user' | 'luna';
  content: string;
  timestamp: Date;
}

interface SpaceConcept {
  id: string;
  title: string;
  category: string;
  description: string;
  emoji: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Space concepts database
const spaceConcepts: SpaceConcept[] = [
  {
    id: '1',
    title: 'Black Holes',
    category: 'Astrophysics',
    description: 'Regions of spacetime where gravity is so strong that nothing can escape',
    emoji: '🕳️',
    difficulty: 'Intermediate'
  },
  {
    id: '2', 
    title: 'Solar System',
    category: 'Planetary Science',
    description: 'Our Sun and all the objects that orbit around it',
    emoji: '🌌',
    difficulty: 'Beginner'
  },
  {
    id: '3',
    title: 'Rocket Propulsion',
    category: 'Space Technology',
    description: 'How rockets generate thrust to escape Earth\'s gravity',
    emoji: '🚀',
    difficulty: 'Intermediate'
  },
  {
    id: '4',
    title: 'Space Stations',
    category: 'Space Technology',
    description: 'Habitable spacecraft designed for long-duration missions',
    emoji: '🛰️',
    difficulty: 'Beginner'
  },
  {
    id: '5',
    title: 'Neutron Stars',
    category: 'Astrophysics',
    description: 'Extremely dense stellar remnants from supernova explosions',
    emoji: '⭐',
    difficulty: 'Advanced'
  },
  {
    id: '6',
    title: 'Mars Exploration',
    category: 'Planetary Science',
    description: 'Human and robotic missions to explore the Red Planet',
    emoji: '🔴',
    difficulty: 'Intermediate'
  }
];

// AI-only responses - no more fallback content

// Prevent SSR for this component
const LunaAIContent = dynamic(() => Promise.resolve(LunaAIContentInternal), {
  ssr: false,
  loading: () => (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      <div className="text-white text-center p-8 flex items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        Initializing Luna AI Assistant...
      </div>
    </div>
  )
});

function LunaAIContentInternal() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'luna',
      content: 'Hello! I\'m Luna, your fully AI-powered assistant for space exploration! 🌙 I\'m powered by OpenRouter\'s advanced o4-mini model and ready to provide real-time, intelligent answers about the cosmos. Ask me anything about planets, stars, rockets, space missions, black holes, or any space concept - I\'ll give you authentic AI-generated responses!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Astrophysics', 'Planetary Science', 'Space Technology'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate Luna thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Generate Luna's response
    const lunaResponse = await generateLunaResponse(inputMessage);
    const lunaMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'luna',
      content: lunaResponse,
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, lunaMessage]);
  };

  const generateLunaResponse = async (userInput: string): Promise<string> => {
    try {
      // Use OpenRouter API with o4-mini model
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || 'sk-or-v1-demo-key'}`,
          "HTTP-Referer": "https://cosmos-explorer.vercel.app",
          "X-Title": "Cosmos Explorer - Luna AI Assistant",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "openai/o4-mini",
          "messages": [
            {
              "role": "system",
              "content": "You are Luna, a highly knowledgeable AI assistant specializing in space education for the Cosmos Explorer app. You have extensive knowledge about astronomy, astrophysics, space exploration, rockets, planets, stars, galaxies, space missions, and all cosmic phenomena. Explain concepts in an engaging, educational way suitable for all ages - from beginners to advanced learners. Always include fascinating facts, use relevant emojis, and make complex topics accessible. Keep responses informative but conversational, around 2-4 sentences. Be accurate with scientific information while maintaining enthusiasm for space exploration. After your response, suggest 3 follow-up questions that would help the user learn more about the topic, formatted as: FOLLOW_UP: question1|question2|question3"
            },
            {
              "role": "user", 
              "content": userInput
            }
          ],
          "max_tokens": 300,
          "temperature": 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const fullResponse = data.choices[0]?.message?.content || "I'm having trouble connecting to my AI brain right now. Please try asking your question again in a moment! 🤖✨";
      
      // Extract follow-up questions if present
      const followUpMatch = fullResponse.match(/FOLLOW_UP:\s*(.+)$/);
      if (followUpMatch) {
        const questions = followUpMatch[1].split('|').map((q: string) => q.trim());
        setFollowUpQuestions(questions);
        return fullResponse.replace(/FOLLOW_UP:\s*.+$/, '').trim();
      }
      
      // Set default follow-up questions if none provided
      setFollowUpQuestions(getDefaultFollowUpQuestions(userInput));
      return fullResponse;
      
    } catch (error) {
      console.error('OpenRouter API failed:', error);
      setFollowUpQuestions(getDefaultFollowUpQuestions(userInput));
      return "I'm experiencing some technical difficulties connecting to my AI brain right now! 🤖⚡ This might be due to network issues or API limitations. Please try asking your question again in a moment. If this continues, you might want to check your internet connection or try a simpler question. I'm excited to help you explore space once I'm back online! 🚀✨";
    }
  };

  // Removed getFallbackResponse - now using 100% AI-generated responses

  const getDefaultFollowUpQuestions = (userInput: string): string[] => {
    const input = userInput.toLowerCase();
    
    if (input.includes('black hole')) {
      return [
        "How are black holes formed?",
        "What happens if you fall into a black hole?", 
        "Can black holes evaporate?"
      ];
    }
    
    if (input.includes('rocket') || input.includes('launch')) {
      return [
        "What fuel do rockets use?",
        "How fast do rockets need to go to reach space?",
        "What is the most powerful rocket ever built?"
      ];
    }
    
    if (input.includes('mars') || input.includes('red planet')) {
      return [
        "How long does it take to get to Mars?",
        "Could humans live on Mars?",
        "What rovers are currently on Mars?"
      ];
    }
    
    if (input.includes('moon') || input.includes('lunar')) {
      return [
        "Why does the Moon have phases?",
        "How did the Moon form?",
        "When will humans return to the Moon?"
      ];
    }
    
    if (input.includes('space station') || input.includes('iss')) {
      return [
        "How do astronauts eat in space?",
        "How long can astronauts stay on the ISS?",
        "How does the ISS get supplies?"
      ];
    }
    
    // Default follow-up questions
    return [
      "What's the most amazing thing about space?",
      "How do astronauts train for space missions?",
      "What are we planning to explore next in space?"
    ];
  };

  const handleConceptClick = (concept: SpaceConcept) => {
    const conceptMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Tell me about ${concept.title}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, conceptMessage]);
    
    setTimeout(async () => {
      const response = await generateLunaResponse(concept.title);
      const lunaMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'luna',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, lunaMessage]);
    }, 1000);
  };

  const filteredConcepts = selectedCategory === 'All' 
    ? spaceConcepts 
    : spaceConcepts.filter(concept => concept.category === selectedCategory);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFollowUpClick = (question: string) => {
    setInputMessage(question);
    // Auto-send the follow-up question
    setTimeout(() => {
      const event = { key: 'Enter', shiftKey: false, preventDefault: () => {} };
      handleKeyPress(event as any);
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1a1d21] to-[#252930] border-b border-[#2c3035]/50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-lg shadow-lg">
            🌙
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">Luna AI Assistant</h1>
            <p className="text-[#a2abb3] text-xs">Powered by Advanced AI • Space Education</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#a2abb3]">Ask me anything about space! 🚀</div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">Online & Ready</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Chat Interface - Main Area */}
        <div className="flex-1 flex flex-col p-4 pr-2">
          <div className="bg-gradient-to-br from-[#1e2124] to-[#252930] rounded-xl border border-blue-500/30 shadow-2xl flex flex-col h-full">
            {/* Chat Header - Simplified */}
            <div className="p-4 border-b border-[#2c3035]/50 flex items-center justify-between bg-gradient-to-r from-[#1e2124] to-[#252930]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                  🌙
                </div>
                <div>
                  <h3 className="text-white font-semibold">Chat with Luna</h3>
                  <div className="text-[#a2abb3] text-xs flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span>AI-powered space education</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-[#a2abb3]">
                Real-time AI responses 🤖
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl shadow-lg ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/20' 
                      : 'bg-gradient-to-br from-[#2c3035] to-[#373c42] text-white border border-purple-500/30 shadow-purple-500/10'
                  }`}>
                    {message.type === 'luna' && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🌙</span>
                        <span className="text-xs text-purple-300 font-medium">Luna AI</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-[#a2abb3]'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#2c3035] text-white border border-purple-500/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🌙</span>
                      <span className="text-xs text-purple-300 font-medium">Luna AI</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <span className="text-sm text-[#a2abb3] ml-2">Luna is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#2c3035]/50 bg-[#1a1d21]">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Luna about space, planets, rockets, or any cosmic concept..."
                  className="flex-1 bg-[#2c3035] text-white p-4 rounded-xl border border-blue-500/30 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
                >
                  Send 🚀
                </button>
              </div>
              
              {/* Follow-up Questions */}
              {followUpQuestions.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs text-[#a2abb3] mb-2 flex items-center gap-2">
                    <span>💡</span>
                    <span>Continue exploring with these questions:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {followUpQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleFollowUpClick(question)}
                        className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-white text-sm px-4 py-2 rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all transform hover:scale-105"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 flex flex-col p-4 pl-2 space-y-4 overflow-y-auto">
          {/* Quick Start Section */}
          <div className="bg-gradient-to-br from-[#1e2124] to-[#252930] rounded-xl p-4 border border-blue-500/30 shadow-xl">
            <div className="text-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-xl mx-auto mb-2 shadow-lg">
                🚀
              </div>
              <h3 className="text-white font-bold mb-1">Quick Start</h3>
              <p className="text-[#a2abb3] text-xs">Popular space questions</p>
            </div>
            <div className="space-y-2">
              {[
                "How do black holes work?",
                "What is the International Space Station?",
                "How far is Mars from Earth?"
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleFollowUpClick(question)}
                  className="w-full text-left p-2 bg-[#2c3035] hover:bg-[#373c42] rounded-lg text-white text-xs transition-all transform hover:scale-105 border border-blue-500/20 hover:border-blue-500/40"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-gradient-to-br from-[#1e2124] to-[#252930] rounded-xl p-4 border border-blue-500/30 shadow-xl">
            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <span>🔍</span>
              Categories
            </h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'text-[#a2abb3] hover:bg-[#2c3035] hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Concepts */}
          <div className="bg-gradient-to-br from-[#1e2124] to-[#252930] rounded-xl p-4 border border-blue-500/30 shadow-xl">
            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <span>📚</span>
              Concepts Library
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredConcepts.map(concept => (
                <button
                  key={concept.id}
                  onClick={() => handleConceptClick(concept)}
                  className="w-full text-left p-2 bg-[#2c3035] hover:bg-[#373c42] rounded-lg border border-purple-500/20 transition-colors group"
                >
                                      <div className="flex items-start gap-2">
                      <div className="text-lg">{concept.emoji}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-xs group-hover:text-blue-300 transition-colors">
                          {concept.title}
                        </h4>
                        <p className="text-[#a2abb3] text-xs mt-1 line-clamp-2">
                          {concept.description}
                        </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          concept.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                          concept.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {concept.difficulty}
                        </span>
                        <span className="text-[#a2abb3] text-xs">{concept.category}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LunaAIClient() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#121416] group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Inter", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2c3035] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Cosmos Explorer</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer">Home</a>
              <a className="text-white text-sm font-medium leading-normal" href="/tracker">Tracker</a>
              <a className="text-white text-sm font-medium leading-normal" href="/events">Events</a>
              <a className="text-white text-sm font-medium leading-normal" href="/cosmos-explorer/nasa-tv">NASA TV</a>
              <a className="text-blue-400 text-sm font-medium leading-normal" href="/luna-ai">Luna AI Assistant</a>
            </div>
          </div>
        </header>
        <LunaAIContent />
      </div>
    </div>
  );
}

export default function LunaAI() {
  return <LunaAIClient />;
}