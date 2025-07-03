'use client';

import { useState, useEffect } from 'react';

interface VideoContent {
  id: string;
  title: string;
  description: string;
  duration?: string;
  category?: string;
  series?: string;
  videoQuality?: string;
  rating?: string;
  nasaUrl?: string;
  publishDate?: string;
  thumbnail?: string;
}

interface VideoPlayerProps {
  isOpen: boolean;
  content: VideoContent | null;
  onClose: () => void;
}

// Central video configuration - the ONE place where all videos play
const CENTRAL_VIDEO_CONFIG = {
  // Main video URL that all content will use
  videoUrl: "https://www.youtube.com/embed/DIgkvm2nmHc?autoplay=0&rel=0&modestbranding=1&controls=1",
  
  // Video player settings
  autoplay: false,
  showRelated: false,
  modestBranding: true,
  showControls: true,
  
  // Player dimensions
  aspectRatio: "56.25%", // 16:9 aspect ratio
  
  // Overlay branding
  showNASABranding: true,
  brandingText: "NASA Official Stream"
};

export default function CentralVideoPlayer({ isOpen, content, onClose }: VideoPlayerProps) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && content) {
      setIsVideoReady(false);
      setPlayerError(null);
      
      // Simulate video loading
      const loadTimeout = setTimeout(() => {
        setIsVideoReady(true);
      }, 1000);
      
      return () => clearTimeout(loadTimeout);
    }
  }, [isOpen, content]);

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !content) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleVideoError = () => {
    setPlayerError('Video failed to load. Please try again later.');
    setIsVideoReady(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0" 
        onClick={handleBackdropClick}
      />
      
      <div className="relative bg-[#1e2124] rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-[#2c3035] shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[#2c3035] bg-gradient-to-r from-red-500/10 to-blue-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🎬</div>
              <div>
                <h1 className="text-white text-2xl font-bold">{content.title}</h1>
                <div className="text-[#a2abb3] text-sm flex items-center gap-3">
                  {content.category && <span>{content.category}</span>}
                  {content.duration && <span>• Duration: {content.duration}</span>}
                  {content.videoQuality && <span>• {content.videoQuality}</span>}
                  {content.rating && <span>• {content.rating}</span>}
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-[#a2abb3] hover:text-white text-2xl p-2 hover:bg-[#2c3035] rounded-lg transition-colors"
              aria-label="Close video player"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Video Player Section */}
        <div className="p-6">
          <div className="mb-6">
            <div 
              className="relative bg-black rounded-xl overflow-hidden" 
              style={{ paddingBottom: CENTRAL_VIDEO_CONFIG.aspectRatio }}
            >
              {/* Loading State */}
              {!isVideoReady && !playerError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <div className="text-white text-lg font-semibold">Loading Video...</div>
                    <div className="text-[#a2abb3] text-sm">Preparing {content.title}</div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {playerError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <div className="text-white text-lg font-semibold mb-2">Video Error</div>
                    <div className="text-[#a2abb3] text-sm mb-4">{playerError}</div>
                    <button 
                      onClick={() => {
                        setPlayerError(null);
                        setIsVideoReady(false);
                        setTimeout(() => setIsVideoReady(true), 1000);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* Main Video Player */}
              {isVideoReady && !playerError && (
                <iframe
                  src={CENTRAL_VIDEO_CONFIG.videoUrl}
                  title={content.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  onError={handleVideoError}
                />
              )}

              {/* NASA Branding Overlay */}
              {CENTRAL_VIDEO_CONFIG.showNASABranding && isVideoReady && !playerError && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-xs">
                  {CENTRAL_VIDEO_CONFIG.brandingText}
                </div>
              )}

              {/* Content Type Badge */}
              <div className="absolute top-4 left-4 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-bold">
                {content.series || content.category || 'NASA+ Content'}
              </div>

              {/* Video Quality Badge */}
              {content.videoQuality && (
                <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {content.videoQuality}
                </div>
              )}
            </div>
          </div>

          {/* Content Information */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-3">About This Content</h3>
              <p className="text-[#a2abb3] leading-relaxed">
                {content.description || `Experience ${content.title} and explore NASA's incredible universe of content. This video offers unique insights into space exploration, scientific discovery, and the wonders of our universe.`}
              </p>
            </div>

            {/* Content Details Grid */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-3">Content Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {content.duration && (
                  <div className="bg-[#2c3035] rounded-lg p-3">
                    <div className="text-[#a2abb3] text-xs mb-1">Duration</div>
                    <div className="text-white font-bold">{content.duration}</div>
                  </div>
                )}
                {content.category && (
                  <div className="bg-[#2c3035] rounded-lg p-3">
                    <div className="text-[#a2abb3] text-xs mb-1">Category</div>
                    <div className="text-white font-bold">{content.category}</div>
                  </div>
                )}
                {content.series && (
                  <div className="bg-[#2c3035] rounded-lg p-3">
                    <div className="text-[#a2abb3] text-xs mb-1">Series</div>
                    <div className="text-white font-bold">{content.series}</div>
                  </div>
                )}
                {content.publishDate && (
                  <div className="bg-[#2c3035] rounded-lg p-3">
                    <div className="text-[#a2abb3] text-xs mb-1">Published</div>
                    <div className="text-white font-bold">{content.publishDate}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Player Info */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="text-blue-400 text-xl">📺</div>
                <div>
                  <div className="text-white font-semibold mb-1">Central Video Player</div>
                  <div className="text-[#a2abb3] text-sm">
                    All NASA+ content plays through our unified video experience. 
                    This ensures consistent playback quality and optimal performance across all devices.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => window.open(content.nasaUrl || 'https://plus.nasa.gov/', '_blank')}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span>🚀</span>
              <span>View on NASA+ Official Site</span>
            </button>
            
            <button 
              onClick={onClose}
              className="bg-[#2c3035] hover:bg-[#373c42] text-white px-8 py-3 rounded-lg font-bold transition-colors"
            >
              Close Player
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the video configuration for external use
export { CENTRAL_VIDEO_CONFIG };