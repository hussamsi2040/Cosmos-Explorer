'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import CentralVideoPlayer from '@/components/CentralVideoPlayer';

interface Episode {
  id: string;
  title: string;
  duration: string;
  description: string;
  thumbnail: string;
  publishDate: string;
  nasaUrl: string;
}

interface SeriesData {
  name: string;
  description: string;
  episodes: Episode[];
  thumbnail: string;
}

export default function SeriesPage() {
  const params = useParams();
  const seriesSlug = params.series as string;
  
  const [seriesData, setSeriesData] = useState<SeriesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        // Fetch series data from the API
        const response = await fetch('/api/nasa-plus');
        const data = await response.json();
        
        // Find the series that matches the slug
        const series = data.series?.find((s: any) => s.slug === seriesSlug);
        
        if (series) {
          // Get all shows for this series
          const seriesShows = data.shows?.filter((show: any) => 
            show.series.toLowerCase().replace(/\s+/g, '-') === seriesSlug
          ) || [];
          
          setSeriesData({
            name: series.name,
            description: series.description,
            episodes: seriesShows.map((show: any) => ({
              id: show.id,
              title: show.title,
              duration: show.duration,
              description: show.description,
              thumbnail: show.thumbnail,
              publishDate: show.publishDate,
              nasaUrl: show.nasaUrl
            })),
            thumbnail: series.thumbnail
          });
        }
      } catch (error) {
        console.error('Failed to fetch series data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeriesData();
  }, [seriesSlug]);

  const openEpisode = (episode: Episode) => {
    setSelectedEpisode(episode);
    setShowVideoPlayer(true);
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setSelectedEpisode(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111418] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-white text-lg font-semibold">Loading Series...</div>
        </div>
      </div>
    );
  }

  if (!seriesData) {
    return (
      <div className="min-h-screen bg-[#111418] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Series Not Found</h1>
          <Link href="/cosmos-explorer/nasa-tv" className="text-blue-400 hover:text-blue-300">
            Back to NASA TV
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111418] dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#292f38] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Cosmos Explorer</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link href="/luna-ai" className="text-white text-sm font-medium leading-normal">Luna AI Assistant</Link>
              <Link href="/cosmos-explorer/nasa-tv" className="text-white text-sm font-medium leading-normal">NASA TV</Link>
              <Link href="/tracker" className="text-white text-sm font-medium leading-normal">Tracker</Link>
              <Link href="/events" className="text-white text-sm font-medium leading-normal">Events</Link>
              <Link href="/games" className="text-white text-sm font-medium leading-normal">Games</Link>
            </div>
            <div className="flex gap-2">
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#292f38] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                <div className="text-white" data-icon="MagnifyingGlass" data-size="20px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
              </button>
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#292f38] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                <div className="text-white" data-icon="User" data-size="20px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                  </svg>
                </div>
              </button>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvhvQwziuIKrHHCbgWuuZ0IgZpKnsQ3_TojyWFbS1AQgtP05L9HSM8kBPibkPH_AkoRyWqp45GOELtYgqhxIUYlzwl-nN8STtXsah3QjndKQjtd-AFdGx45kQhgp2IA2c0GkngYKH378N2_REvdz4cSRv8jZplkBrv0EDK1ZPeM-8ucfj8GobPxDzjQe6RPLu--tqA5z4_KJP0LXaCJGNdshEsQLl9qv2EP9GVkV_qKV4R3jfJeeMrzzmvr5EQERF5N1R9kzHQ2Rs")'
              }}
            ></div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Breadcrumb Navigation */}
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <Link href="/cosmos-explorer/nasa-tv" className="text-[#a2abb3] hover:text-white">
                  NASA TV
                </Link>
                <span className="text-[#a2abb3]">/</span>
                <span className="text-white">{seriesData.name}</span>
              </div>
            </div>

            {/* Series Header */}
            <div className="relative">
              <div className="relative h-64 overflow-hidden rounded-xl mx-4">
                <img
                  src={seriesData.thumbnail}
                  alt={seriesData.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h1 className="text-white text-[32px] font-bold leading-tight tracking-[-0.015em] mb-2">
                    {seriesData.name}
                  </h1>
                  <p className="text-[#a2abb3] text-lg">{seriesData.episodes.length} Episodes</p>
                </div>
              </div>
            </div>

            {/* Series Description */}
            <div className="p-4">
              <p className="text-[#a2abb3] text-base leading-relaxed">{seriesData.description}</p>
            </div>

            {/* Episodes Grid */}
            <div className="p-4">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Episodes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {seriesData.episodes.map((episode) => (
                  <div
                    key={episode.id}
                    onClick={() => openEpisode(episode)}
                    className="group cursor-pointer bg-[#1e2124] rounded-xl overflow-hidden border border-[#2c3035] hover:border-red-500/50 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="relative">
                      <img
                        src={episode.thumbnail}
                        alt={episode.title}
                        className="w-full h-40 object-cover group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 text-white text-xs font-bold">{episode.duration}</div>
                      <div className="absolute top-2 right-2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2 line-clamp-2">{episode.title}</h3>
                      <p className="text-[#a2abb3] text-sm line-clamp-2 mb-2">{episode.description}</p>
                      <p className="text-[#a2abb3] text-xs">{episode.publishDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Central Video Player */}
            {showVideoPlayer && selectedEpisode && (
              <CentralVideoPlayer
                isOpen={showVideoPlayer}
                content={selectedEpisode}
                onClose={closeVideoPlayer}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}