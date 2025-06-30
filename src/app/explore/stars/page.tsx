import Link from "next/link";

export default function StarsPage() {
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
                <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">Stars & Constellations</h1>
              </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M234.5,114.38L184.15,154.28,194.79,200.18a8,8,0,0,1-11.59,8.65L133.42,180.82,70.21,208.83a8,8,0,0,1-11.59-8.65L68.45,154.28,18.1,114.38a8,8,0,0,1,4.5-14.06l59.46-5.15,23.21-55.36a8,8,0,0,1,15.06,0L139.54,95.17l59.46,5.15a8,8,0,0,1,4.5,14.06Z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Explore the Cosmos</h2>
                  <p className="text-[#9dacb8] text-lg">Discover the wonders of stars, constellations, and stellar phenomena that light up our night sky.</p>
                </div>
              </div>
            </div>

            {/* Star Categories */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Brightest Stars */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M234.5,114.38L184.15,154.28,194.79,200.18a8,8,0,0,1-11.59,8.65L133.42,180.82,70.21,208.83a8,8,0,0,1-11.59-8.65L68.45,154.28,18.1,114.38a8,8,0,0,1,4.5-14.06l59.46-5.15,23.21-55.36a8,8,0,0,1,15.06,0L139.54,95.17l59.46,5.15a8,8,0,0,1,4.5,14.06Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Brightest Stars</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Explore the most luminous stars visible from Earth, including Sirius, Canopus, and Alpha Centauri.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Sirius</span>
                    <span className="text-[#9dacb8]">-1.46 magnitude</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Canopus</span>
                    <span className="text-[#9dacb8]">-0.74 magnitude</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Alpha Centauri</span>
                    <span className="text-[#9dacb8]">-0.27 magnitude</span>
                  </div>
                </div>
              </div>

              {/* Constellations */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Constellations</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Learn about the 88 official constellations that map our night sky and their fascinating mythology.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Ursa Major</span>
                    <span className="text-[#9dacb8]">Great Bear</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Orion</span>
                    <span className="text-[#9dacb8]">The Hunter</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Cassiopeia</span>
                    <span className="text-[#9dacb8]">The Queen</span>
                  </div>
                </div>
              </div>

              {/* Star Life Cycles */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Star Life Cycles</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Discover how stars are born, live, and die - from protostars to white dwarfs and supernovae.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Protostar</span>
                    <span className="text-[#9dacb8]">Birth</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Main Sequence</span>
                    <span className="text-[#9dacb8]">Adulthood</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Red Giant</span>
                    <span className="text-[#9dacb8]">Old Age</span>
                  </div>
                </div>
              </div>

              {/* Binary Stars */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Binary Stars</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Explore double star systems where two stars orbit around their common center of mass.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Visual Binary</span>
                    <span className="text-[#9dacb8]">Visible pairs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Spectroscopic</span>
                    <span className="text-[#9dacb8]">Spectrum analysis</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Eclipsing</span>
                    <span className="text-[#9dacb8]">Periodic dimming</span>
                  </div>
                </div>
              </div>

              {/* Variable Stars */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-orange-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Variable Stars</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Stars that change in brightness over time, from pulsating Cepheids to eruptive novae.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Cepheid</span>
                    <span className="text-[#9dacb8]">Pulsating</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">RR Lyrae</span>
                    <span className="text-[#9dacb8]">Short period</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Mira</span>
                    <span className="text-[#9dacb8]">Long period</span>
                  </div>
                </div>
              </div>

              {/* Star Clusters */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Star Clusters</h3>
                </div>
                <p className="text-[#9dacb8] mb-4">Groups of stars bound by gravity, from young open clusters to ancient globular clusters.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Open Clusters</span>
                    <span className="text-[#9dacb8]">Young stars</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Globular</span>
                    <span className="text-[#9dacb8]">Old stars</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Associations</span>
                    <span className="text-[#9dacb8]">Loose groups</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Features */}
            <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Interactive Features</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Star Finder</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">Use your location to find visible stars and constellations in real-time.</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Launch Star Finder
                  </button>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Star Quiz</h4>
                  <p className="text-[#9dacb8] text-sm mb-3">Test your knowledge about stars, constellations, and stellar phenomena.</p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Start Quiz
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