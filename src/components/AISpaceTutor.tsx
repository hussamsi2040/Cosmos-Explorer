"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Book, Rocket, Star, HelpCircle } from "lucide-react";

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

// Comprehensive space knowledge base
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

// Simple keyword matching for educational responses
const generateResponse = (question: string): Message => {
  const lowerQuestion = question.toLowerCase();
  
  // Check for exact matches or partial matches in knowledge base
  for (const [key, knowledge] of Object.entries(spaceKnowledge)) {
    if (lowerQuestion.includes(key) || 
        lowerQuestion.includes(key.replace(/\s+/g, '')) ||
        key.split(' ').some(word => lowerQuestion.includes(word))) {
      
      let response = `🚀 **${knowledge.category}**: ${knowledge.answer}`;
      
      if (knowledge.followUp && knowledge.followUp.length > 0) {
        response += `\n\n💡 **You might also ask:**\n${knowledge.followUp.map(q => `• ${q}`).join('\n')}`;
      }
      
      if (knowledge.relatedTopics && knowledge.relatedTopics.length > 0) {
        response += `\n\n🔗 **Related topics:** ${knowledge.relatedTopics.join(', ')}`;
      }
      
      return {
        id: Date.now().toString(),
        type: "bot",
        content: response,
        timestamp: new Date(),
        category: knowledge.category
      };
    }
  }
  
  // General space responses for common patterns
  if (lowerQuestion.includes("how") && lowerQuestion.includes("work")) {
    return {
      id: Date.now().toString(),
      type: "bot",
      content: "🔧 Great question about how things work in space! Space physics involves fascinating concepts like gravity, orbital mechanics, and the laws of physics in a vacuum. Could you be more specific about what space technology or phenomenon you'd like to understand?",
      timestamp: new Date(),
      category: "General"
    };
  }
  
  if (lowerQuestion.includes("why") || lowerQuestion.includes("what causes")) {
    return {
      id: Date.now().toString(),
      type: "bot",
      content: "🤔 Excellent question! Space is full of amazing phenomena with fascinating explanations. Could you tell me more about the specific space topic you're curious about? I can explain concepts related to planets, stars, spacecraft, physics, and more!",
      timestamp: new Date(),
      category: "General"
    };
  }
  
  if (lowerQuestion.includes("astronaut") || lowerQuestion.includes("space travel")) {
    return {
      id: Date.now().toString(),
      type: "bot",
      content: "👨‍🚀 Space travel and astronauts are fascinating topics! Astronauts undergo years of training to live and work in the unique environment of space. They deal with microgravity, radiation, isolation, and many other challenges. What specific aspect of astronaut life or space travel interests you most?",
      timestamp: new Date(),
      category: "Human Spaceflight"
    };
  }
  
  // Default response with suggestions
  return {
    id: Date.now().toString(),
    type: "bot",
    content: `🌟 I'd love to help you learn about space! I have knowledge about many topics including planets, stars, galaxies, spacecraft, astronauts, and space physics.\n\n💡 **Try asking about:**\n${quickQuestions.slice(0, 4).map(q => `• ${q}`).join('\n')}\n\nOr ask me anything else about space - I'll do my best to explain it!`,
    timestamp: new Date(),
    category: "General"
  };
};

export default function AISpaceTutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: "🚀 Hello! I'm your AI Space Tutor. I'm here to help you explore the wonders of space and answer your cosmic questions!\n\nAsk me about planets, stars, spacecraft, black holes, or any other space topic you're curious about. I love sharing space knowledge! ✨",
      timestamp: new Date(),
      category: "Welcome"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate thinking time
    setTimeout(() => {
      const botResponse = generateResponse(input);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    // Auto-send the question
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[700px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Space Tutor</h2>
            <p className="text-blue-100 text-sm">Your cosmic learning companion</p>
          </div>
          <div className="ml-auto">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="p-4 bg-white/10 border-b border-white/10">
        <p className="text-sm text-gray-300 mb-2">Quick questions to get started:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.slice(0, 4).map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full hover:bg-blue-500/30 transition-all"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "bot" && (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.type === "user" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white/10 text-gray-100"
              }`}>
                {message.category && message.type === "bot" && (
                  <div className="flex items-center gap-1 mb-1">
                    <Book className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-blue-400">{message.category}</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                <div className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>

              {message.type === "user" && (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white/10 rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/5 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about space..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <HelpCircle className="w-3 h-3" />
          <span>Ask about planets, stars, spacecraft, physics, or any space topic!</span>
        </div>
      </div>
    </div>
  );
}