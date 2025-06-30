import Link from "next/link";
import { getSpaceXLaunches, getSpaceXRockets, getSpaceXCompany } from "../../../lib/api/spacex";
import { Suspense } from "react";

export default async function RocketsPage() {
  let launches, rockets, company;
  let launchesError, rocketsError, companyError;

  try {
    launches = await getSpaceXLaunches();
  } catch (e) {
    launchesError = "Could not load SpaceX launches.";
  }

  try {
    rockets = await getSpaceXRockets();
  } catch (e) {
    rocketsError = "Could not load SpaceX rockets.";
  }

  try {
    company = await getSpaceXCompany();
  } catch (e) {
    companyError = "Could not load SpaceX company info.";
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
                <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">Rockets & Spaceflight</h1>
              </div>
            </div>

            {/* SpaceX Company Info */}
            {companyError ? (
              <div className="text-red-400 p-4">{companyError}</div>
            ) : company ? (
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M103.77,185.94C103.38,187.49,93.63,224,40,224a8,8,0,0,1-8-8c0-53.63,36.51-63.38,38.06-63.77a8,8,0,0,1,3.88,15.53c-.9.25-22.42,6.54-25.56,39.86C81.7,204.48,88,183,88.26,182a8,8,0,0,1,15.51,4Zm93-67.4L192,123.31v58.33A15.91,15.91,0,0,1,187.32,193L153,227.3A15.91,15.91,0,0,1,141.7,232a16.11,16.11,0,0,1-5.1-.83,15.94,15.94,0,0,1-10.78-12.92l-5.37-38.49L76.24,135.55l-38.47-5.37A16,16,0,0,1,28.7,103L63,68.68A15.91,15.91,0,0,1,74.36,64h58.33l4.77-4.77c26.68-26.67,58.83-27.82,71.41-27.07a16,16,0,0,1,15,15C224.6,59.71,223.45,91.86,196.78,118.54ZM40,114.34l37.15,5.18L116.69,80H74.36ZM91.32,128,128,164.68l57.45-57.45a76.46,76.46,0,0,0,22.42-59.16,76.65,76.65,0,0,0-59.11,22.47ZM176,139.31l-39.53,39.53L141.67,216,176,181.64Z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{company.name}</h2>
                </div>
                <p className="text-[#9dacb8] mb-4">{company.summary}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{company.launches}</div>
                    <div className="text-[#9dacb8] text-sm">Launches</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{company.vehicles}</div>
                    <div className="text-[#9dacb8] text-sm">Vehicles</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{company.test_sites}</div>
                    <div className="text-[#9dacb8] text-sm">Test Sites</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{company.employees}</div>
                    <div className="text-[#9dacb8] text-sm">Employees</div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Recent Launches */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 px-4">Recent Launches</h2>
              {launchesError ? (
                <div className="text-red-400 p-4">{launchesError}</div>
              ) : launches ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {launches.slice(0, 6).map((launch: any) => (
                    <div key={launch.id} className="bg-white/5 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10">
                      <img
                        src={launch.links?.patch?.small || "/window.svg"}
                        alt={launch.name}
                        className="w-16 h-16 object-contain rounded-lg mb-2 bg-white/10 p-2"
                      />
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-3 h-3 rounded-full ${launch.success ? 'bg-green-500' : launch.success === false ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                        <h3 className="text-white font-bold">{launch.name}</h3>
                      </div>
                      <p className="text-[#9dacb8] text-sm mb-2">{launch.details || 'Launch details coming soon...'}</p>
                      <div className="text-[#9dacb8] text-xs">
                        {new Date(launch.date_unix * 1000).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white text-center p-8">Loading launches...</div>
              )}
            </div>

            {/* Rockets */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 px-4">Rocket Fleet</h2>
              {rocketsError ? (
                <div className="text-red-400 p-4">{rocketsError}</div>
              ) : rockets ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {rockets.map((rocket: any) => (
                    <div key={rocket.id} className="bg-white/5 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10">
                      <img
                        src={rocket.flickr_images?.[0] || "/window.svg"}
                        alt={rocket.name}
                        className="w-full h-40 object-cover rounded-xl mb-4 bg-white/10"
                      />
                      <h3 className="text-white font-bold mb-2">{rocket.name}</h3>
                      <p className="text-[#9dacb8] text-sm mb-3">{rocket.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white/10 rounded p-2">
                          <div className="text-white font-semibold">Height</div>
                          <div className="text-[#9dacb8]">{rocket.height.meters}m</div>
                        </div>
                        <div className="bg-white/10 rounded p-2">
                          <div className="text-white font-semibold">Mass</div>
                          <div className="text-[#9dacb8]">{rocket.mass.kg.toLocaleString()}kg</div>
                        </div>
                        <div className="bg-white/10 rounded p-2">
                          <div className="text-white font-semibold">Stages</div>
                          <div className="text-[#9dacb8]">{rocket.stages}</div>
                        </div>
                        <div className="bg-white/10 rounded p-2">
                          <div className="text-white font-semibold">Cost</div>
                          <div className="text-[#9dacb8]">${rocket.cost_per_launch?.toLocaleString() || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white text-center p-8">Loading rockets...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 