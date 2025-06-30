import Link from "next/link";
import { getLatestMarsRoverPhoto } from '../../../lib/api/mars';

export default async function MoonPlanetsPage() {
  // Fetch the latest Mars rover photo
  let marsPhoto = null;
  try {
    marsPhoto = await getLatestMarsRoverPhoto();
  } catch (e) {
    marsPhoto = null;
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111518] dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#293138] px-10 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-white">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Cosmic Classroom</h2>
            </div>
            <div className="flex items-center gap-9">
              <Link href="/" className="text-white text-sm font-medium leading-normal">Today</Link>
              <Link href="/explore" className="text-white text-sm font-medium leading-normal">Explore</Link>
              <Link href="/learn" className="text-white text-sm font-medium leading-normal">Learn</Link>
              <Link href="/games" className="text-white text-sm font-medium leading-normal">Games</Link>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <label className="flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div className="text-[#9dacb8] flex border-none bg-[#293138] items-center justify-center pl-4 rounded-l-xl border-r-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
                <input
                  placeholder="Search"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#293138] focus:border-none h-full placeholder:text-[#9dacb8] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                />
              </div>
            </label>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#293138] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <div className="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
                </svg>
              </div>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA63MYmwSQEKYlAGGkuIa5Q3VbZgKF_RJdq1uOaAUx_T06K1DstgaWsFgzvBY7h-nP4vMl2s4QTQ1VibSX1HLbMGX8mQp0dT_rK9AhZlKXhCSIF97q7o78AzDWzB3xfYFCyaxqcmJxpQUe6iVAGPkAhXjxIDTi7v0Ig61hWYSepEVnuzjr4kCL-7WOSdWdf5OQng_aXk8iUaiMg9DFFZI-Ee7imDVkRR1NGurkODPLhK2S9diHTSjld8vqf3DS-ZZ7spwBG6Hgn_mI")'
              }}
            ></div>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex items-center gap-4">
                <Link href="/explore" className="text-[#9dacb8] hover:text-white transition-colors">
                  ← Back to Explore
                </Link>
                <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">Moon & Planets</h1>
              </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Explore Our Solar System</h2>
                  <p className="text-[#9dacb8] text-lg">Journey through the planets, moons, and celestial bodies that make up our cosmic neighborhood.</p>
                </div>
              </div>
            </div>

            {/* Solar System Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Terrestrial Planets */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-orange-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Terrestrial</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Rocky planets with solid surfaces and thin atmospheres.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Mercury</span>
                    <span className="text-[#9dacb8]">Closest to Sun</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Venus</span>
                    <span className="text-[#9dacb8]">Hottest planet</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Earth</span>
                    <span className="text-[#9dacb8]">Our home</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Mars</span>
                    <span className="text-[#9dacb8]">Red planet</span>
                  </div>
                </div>
              </div>

              {/* Gas Giants */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Gas Giants</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Massive planets composed primarily of hydrogen and helium.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Jupiter</span>
                    <span className="text-[#9dacb8]">Largest planet</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Saturn</span>
                    <span className="text-[#9dacb8]">Ringed planet</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Uranus</span>
                    <span className="text-[#9dacb8]">Ice giant</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Neptune</span>
                    <span className="text-[#9dacb8]">Windy planet</span>
                  </div>
                </div>
              </div>

              {/* Dwarf Planets */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Dwarf Planets</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Smaller celestial bodies that orbit the Sun but aren't full planets.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Pluto</span>
                    <span className="text-[#9dacb8]">Former planet</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Ceres</span>
                    <span className="text-[#9dacb8]">Asteroid belt</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Eris</span>
                    <span className="text-[#9dacb8]">Kuiper belt</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Haumea</span>
                    <span className="text-[#9dacb8]">Oblate shape</span>
                  </div>
                </div>
              </div>

              {/* Moons */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Notable Moons</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Fascinating natural satellites orbiting planets in our solar system.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Luna</span>
                    <span className="text-[#9dacb8]">Earth's moon</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Europa</span>
                    <span className="text-[#9dacb8]">Jupiter's ocean</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Titan</span>
                    <span className="text-[#9dacb8]">Saturn's largest</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Triton</span>
                    <span className="text-[#9dacb8]">Neptune's retrograde</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Planet Details */}
            <div className="mt-8 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Planet Profiles</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Mercury</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">The smallest and innermost planet, with extreme temperature variations.</p>
                  <div className="text-xs space-y-1 mb-3">
                    <div className="flex justify-between">
                      <span className="text-white">Distance from Sun:</span>
                      <span className="text-[#9dacb8]">57.9M km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Day Length:</span>
                      <span className="text-[#9dacb8]">59 Earth days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Year Length:</span>
                      <span className="text-[#9dacb8]">88 Earth days</span>
                    </div>
                  </div>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Learn More
                  </button>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Venus</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">The hottest planet with a thick atmosphere of carbon dioxide.</p>
                  <div className="text-xs space-y-1 mb-3">
                    <div className="flex justify-between">
                      <span className="text-white">Distance from Sun:</span>
                      <span className="text-[#9dacb8]">108.2M km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Surface Temp:</span>
                      <span className="text-[#9dacb8]">462°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Atmosphere:</span>
                      <span className="text-[#9dacb8]">96% CO2</span>
                    </div>
                  </div>
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Learn More
                  </button>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Mars</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">The red planet with the largest volcano and canyon in the solar system.</p>
                  {marsPhoto ? (
                    <img
                      src={marsPhoto.img_src}
                      alt={`Mars Rover: ${marsPhoto.rover.name}`}
                      className="w-full h-48 object-cover rounded-xl mb-2 border border-white/10"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-[#222] rounded-xl text-[#9dacb8] mb-2 border border-white/10">
                      No recent Mars rover photo available.
                    </div>
                  )}
                  <div className="text-xs text-[#9dacb8]">
                    {marsPhoto ? `Photo by ${marsPhoto.rover.name} on ${marsPhoto.earth_date}` : 'Mars rover imagery from NASA API'}
                  </div>
                  <div className="text-xs space-y-1 mb-3">
                    <div className="flex justify-between">
                      <span className="text-white">Distance from Sun:</span>
                      <span className="text-[#9dacb8]">227.9M km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Moons:</span>
                      <span className="text-[#9dacb8]">2 (Phobos, Deimos)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Rovers:</span>
                      <span className="text-[#9dacb8]">Perseverance, Curiosity</span>
                    </div>
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Learn More
                  </button>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Jupiter</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">The largest planet with the Great Red Spot storm and 95 moons.</p>
                  <div className="text-xs space-y-1 mb-3">
                    <div className="flex justify-between">
                      <span className="text-white">Distance from Sun:</span>
                      <span className="text-[#9dacb8]">778.5M km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Mass:</span>
                      <span className="text-[#9dacb8]">318 Earths</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Great Red Spot:</span>
                      <span className="text-[#9dacb8]">400+ years old</span>
                    </div>
                  </div>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Learn More
                  </button>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Saturn</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">Famous for its spectacular ring system and 146 confirmed moons.</p>
                  <div className="text-xs space-y-1 mb-3">
                    <div className="flex justify-between">
                      <span className="text-white">Distance from Sun:</span>
                      <span className="text-[#9dacb8]">1.4B km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Ring System:</span>
                      <span className="text-[#9dacb8]">7 main rings</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Titan:</span>
                      <span className="text-[#9dacb8]">Largest moon</span>
                    </div>
                  </div>
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Learn More
                  </button>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Uranus & Neptune</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">Ice giants with tilted axes and strong winds in their atmospheres.</p>
                  <div className="text-xs space-y-1 mb-3">
                    <div className="flex justify-between">
                      <span className="text-white">Uranus Tilt:</span>
                      <span className="text-[#9dacb8]">98 degrees</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Neptune Winds:</span>
                      <span className="text-[#9dacb8]">2,100 km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Both:</span>
                      <span className="text-[#9dacb8]">Ice giants</span>
                    </div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Features */}
            <div className="mt-6 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Interactive Features</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Solar System Explorer</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">Take a virtual tour of the solar system with 3D models and real NASA data.</p>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Launch Explorer
                  </button>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Planet Quiz</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">Test your knowledge about the planets, moons, and solar system facts.</p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Start Quiz
                  </button>
                </div>
              </div>
            </div>

            {/* Current Missions */}
            <div className="mt-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Current Planetary Missions</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Perseverance Rover</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">Exploring Mars and searching for signs of ancient life.</p>
                  <div className="text-xs text-[#9dacb8]">Launched: 2020</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Juno Mission</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">Studying Jupiter's atmosphere, gravity, and magnetic field.</p>
                  <div className="text-xs text-[#9dacb8]">Launched: 2011</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">New Horizons</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">Explored Pluto and now studying Kuiper Belt objects.</p>
                  <div className="text-xs text-[#9dacb8]">Launched: 2006</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 