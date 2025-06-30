import Link from "next/link";

export default function SpaceWeatherPage() {
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
                <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">Space Weather</h1>
              </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-orange-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Solar Storms & Space Weather</h2>
                  <p className="text-[#9dacb8] text-lg">Monitor solar activity, geomagnetic storms, and space weather phenomena that can affect Earth's technology and create stunning auroras.</p>
                </div>
              </div>
            </div>

            {/* Space Weather Categories */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Solar Flares */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Solar Flares</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Sudden bursts of radiation from the Sun's surface that can disrupt communications and power grids.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Class A</span>
                    <span className="text-[#9dacb8]">Minor</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Class M</span>
                    <span className="text-[#9dacb8]">Moderate</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Class X</span>
                    <span className="text-[#9dacb8]">Major</span>
                  </div>
                </div>
              </div>

              {/* Coronal Mass Ejections */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-orange-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">CMEs</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Coronal Mass Ejections - massive clouds of solar plasma that can trigger geomagnetic storms.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Speed</span>
                    <span className="text-[#9dacb8]">100-3000 km/s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Mass</span>
                    <span className="text-[#9dacb8]">10^12-10^13 kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Travel Time</span>
                    <span className="text-[#9dacb8]">1-4 days</span>
                  </div>
                </div>
              </div>

              {/* Geomagnetic Storms */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Geomagnetic Storms</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Disturbances in Earth's magnetic field caused by solar wind and CMEs.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">G1</span>
                    <span className="text-[#9dacb8]">Minor</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">G3</span>
                    <span className="text-[#9dacb8]">Strong</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">G5</span>
                    <span className="text-[#9dacb8]">Extreme</span>
                  </div>
                </div>
              </div>

              {/* Auroras */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Auroras</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Natural light displays in the sky caused by solar particles interacting with Earth's atmosphere.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Aurora Borealis</span>
                    <span className="text-[#9dacb8]">Northern Lights</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Aurora Australis</span>
                    <span className="text-[#9dacb8]">Southern Lights</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Colors</span>
                    <span className="text-[#9dacb8]">Green, Red, Blue</span>
                  </div>
                </div>
              </div>

              {/* Solar Wind */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Solar Wind</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Stream of charged particles continuously emitted from the Sun's corona.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Speed</span>
                    <span className="text-[#9dacb8]">400-800 km/s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Density</span>
                    <span className="text-[#9dacb8]">1-10 particles/cm³</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Temperature</span>
                    <span className="text-[#9dacb8]">100,000-2M K</span>
                  </div>
                </div>
              </div>

              {/* Sunspots */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Sunspots</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Dark regions on the Sun's surface caused by intense magnetic activity.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Temperature</span>
                    <span className="text-[#9dacb8]">3,000-4,500 K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Size</span>
                    <span className="text-[#9dacb8]">16,000-160,000 km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Cycle</span>
                    <span className="text-[#9dacb8]">11 years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Monitoring */}
            <div className="mt-8 bg-gradient-to-r from-orange-900/20 to-red-900/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Real-time Space Weather Monitoring</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <h4 className="text-white font-semibold mb-2">Solar Activity</h4>
                  <div className="text-2xl font-bold text-orange-400 mb-1">Low</div>
                  <p className="text-[#9dacb8] text-sm">Current solar flare activity</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <h4 className="text-white font-semibold mb-2">Geomagnetic</h4>
                  <div className="text-2xl font-bold text-green-400 mb-1">Quiet</div>
                  <p className="text-[#9dacb8] text-sm">Earth's magnetic field</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <h4 className="text-white font-semibold mb-2">Aurora Activity</h4>
                  <div className="text-2xl font-bold text-purple-400 mb-1">Low</div>
                  <p className="text-[#9dacb8] text-sm">Northern/Southern lights</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <h4 className="text-white font-semibold mb-2">Solar Wind</h4>
                  <div className="text-2xl font-bold text-blue-400 mb-1">Normal</div>
                  <p className="text-[#9dacb8] text-sm">Particle stream speed</p>
                </div>
              </div>
            </div>

            {/* Interactive Features */}
            <div className="mt-6 bg-gradient-to-r from-purple-900/20 to-orange-900/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Interactive Features</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Aurora Forecast</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">Check the probability of seeing auroras in your location based on space weather conditions.</p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Check Forecast
                  </button>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Solar Activity Tracker</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">Monitor real-time solar activity, sunspots, and solar flares from NASA's observatories.</p>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Track Sun
                  </button>
                </div>
              </div>
            </div>

            {/* Educational Content */}
            <div className="mt-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Learn About Space Weather</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Solar Cycle</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">Understand the 11-year solar cycle and its impact on space weather.</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Learn More
                  </button>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Space Weather Effects</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">How space weather affects satellites, power grids, and communications.</p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Learn More
                  </button>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Aurora Science</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">The science behind auroras and how to photograph them.</p>
                  <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 