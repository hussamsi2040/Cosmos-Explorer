import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, Home, Compass, Star, Users, BookOpen, Sparkles } from "lucide-react";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Cosmic Classroom - Explore the Universe",
  description: "An interactive space exploration platform with real-time data, AI tutoring, and immersive learning experiences",
  keywords: "space, education, NASA, ISS, astronomy, rockets, solar system, interactive learning",
  authors: [{ name: "Cosmic Classroom Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Cosmic Classroom - Explore the Universe",
    description: "An interactive space exploration platform with real-time data, AI tutoring, and immersive learning experiences",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cosmic Classroom - Explore the Universe",
    description: "An interactive space exploration platform with real-time data, AI tutoring, and immersive learning experiences",
  }
};

const navigation = [
  { name: "Home", href: "/", icon: Home, description: "Welcome to the cosmos" },
  { name: "Explore", href: "/explore", icon: Compass, description: "Space exploration tools" },
  { name: "Learn", href: "/learn", icon: BookOpen, description: "Educational content" },
  { name: "Community", href: "/community", icon: Users, description: "Join space enthusiasts" }
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/rocket-icon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 font-sans antialiased">
        {/* Animated background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Primary gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5" />
          
          {/* Floating cosmic elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
          <div 
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-cyan-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" 
            style={{ animationDelay: '2s' }}
          />
          <div 
            className="absolute top-3/4 left-1/3 w-32 h-32 bg-gradient-to-r from-indigo-400/10 to-emerald-400/10 rounded-full blur-2xl animate-pulse" 
            style={{ animationDelay: '4s' }}
          />
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        {/* Modern Navigation */}
        <nav className="relative z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                    <Rocket className="w-6 h-6 text-white transform group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                    Cosmic Classroom
                  </h1>
                  <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                    Explore the Universe
                  </p>
                </div>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group relative flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/10"
                    >
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{item.name}</span>
                      
                      {/* Tooltip */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-slate-900 border border-white/20 rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {item.description}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs font-medium">Live Data</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <Star 
                      key={i}
                      className="w-3 h-3 text-yellow-400 animate-pulse" 
                      style={{ animationDelay: `${i * 0.5}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-white/10 bg-slate-950/90 backdrop-blur-xl">
            <div className="px-4 py-3 flex justify-around">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="relative z-10 min-h-screen">
          {children}
        </main>

        {/* Enhanced Toast Notifications */}
        <Toaster
          position="top-right"
          gutter={8}
          containerClassName="!z-[9999]"
          toastOptions={{
            duration: 4000,
            className: "!bg-slate-900/95 !backdrop-blur-xl !border !border-white/20 !text-white !shadow-2xl",
            style: {
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              color: 'white',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              padding: '16px 20px'
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: 'white',
              },
              style: {
                border: '1px solid rgba(16, 185, 129, 0.3)',
                background: 'rgba(15, 23, 42, 0.95)',
              }
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
              style: {
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(15, 23, 42, 0.95)',
              }
            },
            loading: {
              iconTheme: {
                primary: '#3b82f6',
                secondary: 'white',
              },
              style: {
                border: '1px solid rgba(59, 130, 246, 0.3)',
                background: 'rgba(15, 23, 42, 0.95)',
              }
            }
          }}
        />

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white">Cosmic Classroom</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Exploring the universe through interactive education, real-time space data, and AI-powered learning experiences.
                </p>
              </div>

              {/* Links */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Explore Space</h3>
                <div className="space-y-2">
                  <Link href="/explore" className="block text-gray-400 hover:text-white transition-colors text-sm">
                    Space Tools
                  </Link>
                  <Link href="/learn" className="block text-gray-400 hover:text-white transition-colors text-sm">
                    Educational Content
                  </Link>
                  <Link href="/community" className="block text-gray-400 hover:text-white transition-colors text-sm">
                    Join Community
                  </Link>
                </div>
              </div>

              {/* Data Sources */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Data Sources</h3>
                <div className="space-y-2 text-sm">
                  <a 
                    href="https://nasa.gov" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    NASA Open Data
                  </a>
                  <a 
                    href="https://swpc.noaa.gov" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    NOAA Space Weather
                  </a>
                  <a 
                    href="https://iss-tracker.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    ISS Tracking
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Cosmic Classroom. Inspiring the next generation of space explorers.
              </p>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">Made with curiosity for the cosmos</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
