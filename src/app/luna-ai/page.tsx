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

// Luna AI responses
const lunaResponses = {
  'black holes': 'Black holes are fascinating cosmic objects! They form when massive stars collapse under their own gravity. The boundary around a black hole is called the event horizon - once something crosses this point, it can never escape. Even light cannot get out, which is why we call them "black" holes. They\'re not actually holes though - they\'re incredibly dense objects that warp spacetime around them!',
  
  'solar system': 'Our solar system is like a cosmic neighborhood! At the center is our Sun, a medium-sized star that provides light and heat. Eight planets orbit the Sun: Mercury, Venus, Earth, Mars (the rocky inner planets), and Jupiter, Saturn, Uranus, Neptune (the gas and ice giants). We also have moons, asteroids, comets, and dwarf planets like Pluto. Everything is held together by the Sun\'s gravity!',
  
  'rocket propulsion': 'Rockets work on Newton\'s third law: for every action, there\'s an equal and opposite reaction! They burn fuel to create hot gases that shoot out the bottom at high speed. This pushes the rocket upward. It\'s like when you blow up a balloon and let it go - the air rushing out one way pushes the balloon the other way. Rockets need to reach about 25,000 mph to escape Earth\'s gravity!',
  
  'space stations': 'Space stations are like homes in space! The International Space Station (ISS) orbits Earth about 250 miles up, traveling at 17,500 mph. Astronauts live there for months, conducting experiments in microgravity. They grow food, exercise to stay healthy, and help us learn how humans can live in space for future missions to Mars and beyond!',
  
  'neutron stars': 'Neutron stars are the universe\'s ultimate extreme objects! When a massive star explodes in a supernova, its core can collapse into a neutron star - a city-sized object so dense that a teaspoon would weigh as much as Mount Everest! They spin incredibly fast, sometimes hundreds of times per second, and have magnetic fields trillions of times stronger than Earth\'s.',
  
  'mars exploration': 'Mars is our next frontier! We\'ve sent rovers like Curiosity and Perseverance to explore the Red Planet. Mars has seasons, polar ice caps, and evidence of ancient rivers and lakes. NASA plans to send humans to Mars in the 2030s! The journey takes about 7 months, and astronauts would stay for over a year before Earth and Mars align again for the return trip.',
  
  'default': 'That\'s a great space question! Space is full of amazing phenomena. Did you know that in space, there\'s no sound because there\'s no air to carry sound waves? Or that astronauts on the ISS see 16 sunrises and sunsets every day because they orbit Earth so fast? What specific aspect of space would you like to explore?'
};

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
      content: 'Hello! I\'m Luna, your AI assistant for space exploration! 🌙 I\'m here to help you understand the wonders of the cosmos. Ask me about planets, stars, rockets, space missions, or any space concept you\'re curious about!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
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
    const lunaResponse = generateLunaResponse(inputMessage);
    const lunaMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'luna',
      content: lunaResponse,
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, lunaMessage]);
  };

  const generateLunaResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    for (const [key, response] of Object.entries(lunaResponses)) {
      if (key !== 'default' && input.includes(key)) {
        return response;
      }
    }
    
    // Check for general space terms
    if (input.includes('space') || input.includes('universe') || input.includes('cosmos')) {
      return 'Space is absolutely incredible! The universe is about 13.8 billion years old and contains over 2 trillion galaxies. Each galaxy has billions of stars, and many of those stars have planets. We\'re literally made of stardust - the heavy elements in our bodies were forged in the cores of ancient stars! What specific aspect of space fascinates you most?';
    }
    
    if (input.includes('astronaut') || input.includes('spacewalk')) {
      return 'Astronauts are real-life space explorers! They train for years to live and work in microgravity. During spacewalks (EVAs), they wear spacesuits that act like personal spacecraft, protecting them from the vacuum of space and extreme temperatures. Fun fact: spacesuits cost about $500 million each and take 6 hours to put on properly!';
    }
    
    if (input.includes('moon') || input.includes('lunar')) {
      return 'The Moon is Earth\'s faithful companion! 🌙 It\'s about 238,900 miles away and causes our ocean tides. The Moon is slowly moving away from Earth at about 1.5 inches per year. The Apollo missions landed 12 astronauts on the Moon between 1969-1972. NASA\'s Artemis program plans to return humans to the Moon soon, including the first woman!';
    }
    
    return lunaResponses.default;
  };

  const handleConceptClick = (concept: SpaceConcept) => {
    const conceptMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Tell me about ${concept.title}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, conceptMessage]);
    
    setTimeout(() => {
      const response = generateLunaResponse(concept.title);
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

  return (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <div>
          <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Luna AI Assistant</p>
          <p className="text-[#a2abb3] text-sm">Your personal guide to understanding space and the cosmos 🌙</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <div className="bg-[#1e2124] rounded-xl border border-blue-500/20 h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-[#2c3035] flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg">
                🌙
              </div>
              <div>
                <h3 className="text-white font-semibold">Luna AI</h3>
                <div className="text-[#a2abb3] text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Online • Ready to explore space
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-[#2c3035] text-white border border-purple-500/20'
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
            <div className="p-4 border-t border-[#2c3035]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Luna about space, planets, rockets, or any cosmic concept..."
                  className="flex-1 bg-[#2c3035] text-white p-3 rounded-lg border border-blue-500/20 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Space Concepts Sidebar */}
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="bg-[#1e2124] rounded-xl p-4 border border-blue-500/20">
            <h3 className="text-white font-semibold mb-3">Explore Topics</h3>
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
          <div className="bg-[#1e2124] rounded-xl p-4 border border-blue-500/20">
            <h3 className="text-white font-semibold mb-3">Quick Concepts</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {filteredConcepts.map(concept => (
                <button
                  key={concept.id}
                  onClick={() => handleConceptClick(concept)}
                  className="w-full text-left p-3 bg-[#2c3035] hover:bg-[#373c42] rounded-lg border border-purple-500/20 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{concept.emoji}</div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm group-hover:text-blue-300 transition-colors">
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