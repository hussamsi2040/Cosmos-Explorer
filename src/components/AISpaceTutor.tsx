"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Brain, Rocket, Star, HelpCircle, Zap, Globe } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  category?: string;
}

interface SpaceKnowledge {
  [key: string]: {
    answer: string;
    category: string;
    followUp?: string[];
    relatedTopics?: string[];
  };
}

// Enhanced space knowledge base
const spaceKnowledge: SpaceKnowledge = {
  "black hole": {
    answer: "A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape once it crosses the event horizon. They form when massive stars collapse at the end of their lives. The event horizon is the 'point of no return' - the boundary around a black hole beyond which nothing can escape.",
    category: "Astrophysics",
    followUp: ["How do black holes form?", "What happens if you fall into a black hole?", "Can black holes evaporate?"],
    relatedTopics: ["event horizon", "hawking radiation", "neutron stars"]
  },
  "solar system": {
    answer: "Our Solar System consists of the Sun and all the objects that orbit it, including 8 planets, their moons, asteroids, comets, and other debris. The planets in order from the Sun are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. The Solar System formed about 4.6 billion years ago from a giant molecular cloud.",
    category: "Planetary Science",
    followUp: ["How did the solar system form?", "Why is Pluto not a planet?", "What's in the asteroid belt?"],
    relatedTopics: ["planets", "asteroids", "comets", "kuiper belt"]
  },
  "space station": {
    answer: "A space station is a spacecraft capable of supporting a human crew in orbit for an extended period. The International Space Station (ISS) is currently humanity's only continuously occupied space station, orbiting Earth at about 408 km altitude. It serves as a microgravity research laboratory where scientific research is conducted in astrobiology, astronomy, meteorology, physics, and other fields.",
    category: "Space Technology",
    followUp: ["How fast does the ISS travel?", "How do astronauts live on the ISS?", "What experiments happen on the ISS?"],
    relatedTopics: ["microgravity", "orbital mechanics", "spacewalks"]
  },
  "exoplanet": {
    answer: "An exoplanet is a planet that orbits a star outside our Solar System. Over 5,000 exoplanets have been discovered so far! They're detected using methods like the transit method (watching for a planet to pass in front of its star) and the radial velocity method (detecting wobbles in a star's motion). Some exoplanets might be in the 'habitable zone' where liquid water could exist.",
    category: "Astrobiology",
    followUp: ["How do we find exoplanets?", "Could exoplanets have life?", "What's the habitable zone?"],
    relatedTopics: ["habitable zone", "kepler telescope", "transit method"]
  },
  "rocket": {
    answer: "A rocket is a vehicle that uses rocket engines to propel itself through space. Rockets work by expelling mass (propellant) at high speed in one direction, which creates thrust in the opposite direction according to Newton's third law. Modern rockets use multiple stages to achieve the high speeds needed to escape Earth's gravity and reach orbit.",
    category: "Space Technology",
    followUp: ["How do rockets work in space?", "What is escape velocity?", "Why do rockets have stages?"],
    relatedTopics: ["newton's laws", "escape velocity", "spacecraft propulsion"]
  },
  "mars": {
    answer: "Mars is the fourth planet from the Sun, often called the 'Red Planet' due to iron oxide (rust) on its surface. It has two small moons, Phobos and Deimos. Mars has a thin atmosphere, polar ice caps, and evidence of ancient river valleys and lake beds, suggesting water once flowed on its surface. Several rovers and orbiters are currently studying Mars.",
    category: "Planetary Science",
    followUp: ["Could humans live on Mars?", "What's the weather like on Mars?", "Does Mars have water?"],
    relatedTopics: ["mars rovers", "terraforming", "martian atmosphere"]
  },
  "galaxy": {
    answer: "A galaxy is a huge collection of stars, gas, dust, and dark matter held together by gravity. Our home galaxy, the Milky Way, contains over 100 billion stars! Galaxies come in different shapes: spiral (like the Milky Way), elliptical, and irregular. The nearest major galaxy to us is Andromeda, about 2.5 million light-years away.",
    category: "Astrophysics",
    followUp: ["How many galaxies are there?", "Will the Milky Way collide with Andromeda?", "What's in the center of a galaxy?"],
    relatedTopics: ["milky way", "dark matter", "galaxy clusters"]
  },
  "supernova": {
    answer: "A supernova is the explosive death of a massive star. When a star at least 8 times more massive than our Sun runs out of nuclear fuel, it collapses catastrophically and then explodes, briefly outshining an entire galaxy! Supernovae create and scatter heavy elements throughout the universe, and can leave behind neutron stars or black holes.",
    category: "Astrophysics",
    followUp: ["What causes a supernova?", "How bright is a supernova?", "What's left after a supernova?"],
    relatedTopics: ["neutron stars", "stellar evolution", "nucleosynthesis"]
  }
};

const quickQuestions = [
  "What is a black hole?",
  "How do rockets work?",
  "What are exoplanets?",
  "Tell me about Mars",
  "What is the ISS?",
  "How are stars born?",
  "What causes the seasons?",
  "Why is space cold?"
];

const categoryIcons = {
  "Astrophysics": Star,
  "Planetary Science": Globe,
  "Space Technology": Rocket,
  "Astrobiology": Brain,
  "Human Spaceflight": User,
  "General": HelpCircle
};

let messageIdCounter = 0;

// Enhanced response generation
const generateResponse = (question: string): Message => {
  const lowerQuestion = question.toLowerCase();
  
  // Check for exact matches or partial matches in knowledge base
  for (const [key, knowledge] of Object.entries(spaceKnowledge)) {
    if (lowerQuestion.includes(key) || 
        lowerQuestion.includes(key.replace(/\s+/g, '')) ||
        key.split(' ').some(word => lowerQuestion.includes(word))) {
      
      let response = `**${knowledge.category}**: ${knowledge.answer}`;
      
      if (knowledge.followUp && knowledge.followUp.length > 0) {
        response += `\n\n**💡 You might also ask:**\n${knowledge.followUp.map(q => `• ${q}`).join('\n')}`;
      }
      
      if (knowledge.relatedTopics && knowledge.relatedTopics.length > 0) {
        response += `\n\n**🔗 Related topics:** ${knowledge.relatedTopics.join(', ')}`;
      }
      
      return {
        id: `bot_${++messageIdCounter}`,
        type: "bot",
        content: response,
        timestamp: new Date(),
        category: knowledge.category
      };
    }
  }
  
  // Enhanced general responses
  if (lowerQuestion.includes("how") && lowerQuestion.includes("work")) {
    return {
      id: `bot_${++messageIdCounter}`,
      type: "bot",
      content: "Great question about how things work in space! Space physics involves fascinating concepts like gravity, orbital mechanics, and the laws of physics in a vacuum. Could you be more specific about what space technology or phenomenon you'd like to understand?",
      timestamp: new Date(),
      category: "General"
    };
  }
  
  if (lowerQuestion.includes("why") || lowerQuestion.includes("what causes")) {
    return {
      id: `bot_${++messageIdCounter}`,
      type: "bot",
      content: "Excellent question! Space is full of amazing phenomena with fascinating explanations. Could you tell me more about the specific space topic you're curious about? I can explain concepts related to planets, stars, spacecraft, physics, and more!",
      timestamp: new Date(),
      category: "General"
    };
  }
  
  if (lowerQuestion.includes("astronaut") || lowerQuestion.includes("space travel")) {
    return {
      id: `bot_${++messageIdCounter}`,
      type: "bot",
      content: "Space travel and astronauts are fascinating topics! Astronauts undergo years of training to live and work in the unique environment of space. They deal with microgravity, radiation, isolation, and many other challenges. What specific aspect of astronaut life or space travel interests you most?",
      timestamp: new Date(),
      category: "Human Spaceflight"
    };
  }
  
  // Default response with suggestions
  return {
    id: `bot_${++messageIdCounter}`,
    type: "bot",
    content: `I'd love to help you explore the cosmos! I have knowledge about many topics including planets, stars, galaxies, spacecraft, astronauts, and space physics.\n\n**💡 Try asking about:**\n${quickQuestions.slice(0, 4).map(q => `• ${q}`).join('\n')}\n\nOr ask me anything else about space - I'll do my best to explain it! ✨`,
    timestamp: new Date(),
    category: "General"
  };
};

export default function AISpaceTutor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize with welcome message only on client side
    setMessages([
      {
        id: "welcome",
        type: "bot",
        content: "🚀 Hello! I'm your AI Space Tutor. I'm here to help you explore the wonders of space and answer your cosmic questions!\n\nAsk me about planets, stars, spacecraft, black holes, or any other space topic you're curious about. I love sharing space knowledge! ✨",
        timestamp: new Date(),
        category: "Welcome"
      }
    ]);
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (mounted) {
      scrollToBottom();
    }
  }, [messages, mounted]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user_${++messageIdCounter}`,
      type: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    // Simulate thinking time
    setTimeout(() => {
      const botResponse = generateResponse(currentInput);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!mounted) {
    return (
      <div className="flex flex-col h-[700px] bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-purple-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto"></div>
              <Brain className="absolute inset-0 w-6 h-6 m-auto text-blue-400 animate-pulse" />
            </div>
            <span className="text-white font-medium">Initializing AI Space Tutor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[700px] bg-gradient-to-br from-slate-900/80 via-blue-900/40 to-purple-900/60 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-blue-600/90 via-purple-600/80 to-cyan-600/90 backdrop-blur-xl p-6 border-b border-white/20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center border border-white/30">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">AI Space Tutor</h2>
            <p className="text-blue-100 text-sm">Your intelligent cosmic learning companion</p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </motion.div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="p-4 bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10">
        <p className="text-sm text-gray-300 mb-3 font-medium">Quick questions to get started:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.slice(0, 4).map((question, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickQuestion(question)}
              className="text-xs bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 px-3 py-2 rounded-full hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 border border-blue-400/30 backdrop-blur-sm"
            >
              {question}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <AnimatePresence>
          {messages.map((message) => {
            const CategoryIcon = message.category ? categoryIcons[message.category as keyof typeof categoryIcons] || HelpCircle : HelpCircle;
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "bot" && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
                
                <div className={`max-w-[80%] ${
                  message.type === "user" 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" 
                    : "bg-white/10 backdrop-blur-xl border border-white/20"
                } rounded-2xl px-5 py-4 shadow-lg`}>
                  {message.category && message.type === "bot" && (
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/20">
                      <CategoryIcon className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-400 font-medium">{message.category}</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content.split('**').map((part, index) => {
                      if (index % 2 === 1) {
                        return <strong key={index} className="text-white font-semibold">{part}</strong>;
                      }
                      return part;
                    })}
                  </div>
                  <div className="text-xs opacity-60 mt-3 flex items-center gap-2">
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.type === "bot" && <Zap className="w-3 h-3" />}
                  </div>
                </div>

                {message.type === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Enhanced Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-4"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <span className="text-blue-400 text-sm ml-2">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Modern Input */}
      <div className="p-6 bg-gradient-to-r from-white/5 to-white/10 border-t border-white/20 backdrop-blur-xl">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about space..."
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all pr-12"
            />
            <HelpCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-all duration-300 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
          <Sparkles className="w-3 h-3" />
          <span>Ask about planets, stars, spacecraft, physics, or any space topic!</span>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
}