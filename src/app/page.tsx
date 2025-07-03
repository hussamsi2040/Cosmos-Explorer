import DailyCosmicJournal from "../components/DailyCosmicJournal";
import EpicGalleryWrapper from "../components/EpicGalleryWrapper";
import { getAPOD } from "../lib/api/apod";
import { getEPICDates } from "../lib/api/epic";
import { getEONETEvents } from "../lib/api/eonet";
import { Suspense } from "react";
import Link from "next/link";

export default async function Home() {
  let apod, eonet;
  let apodError: string | undefined = undefined, eonetError: string | undefined = undefined;

  try {
    apod = await getAPOD();
  } catch (e) {
    apodError = "Could not load Astronomy Picture of the Day.";
  }

  try {
    eonet = await getEONETEvents();
  } catch (e) {
    eonetError = "Could not load event data.";
  }

  // Fetch available EPIC dates (for SSR, get the latest as default)
  let epicDates: string[] = [];
  let epicDefaultDate = "";
  try {
    epicDates = await getEPICDates();
    epicDefaultDate = epicDates[epicDates.length - 1]; // Most recent
  } catch {}

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
              <Link href="/" className="text-white text-sm font-medium leading-normal">Today</Link>
              <Link href="/explore" className="text-white text-sm font-medium leading-normal">Explore</Link>
              <Link href="/learn" className="text-white text-sm font-medium leading-normal">Learn</Link>
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
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Today</p>
            </div>
            
            {/* Daily Cosmic Journal - All three data sources in one beautiful component */}
            <div className="p-4">
              <Suspense fallback={<div className="text-white text-center p-8">Loading your cosmic journal...</div>}>
                <DailyCosmicJournal
                  apod={apod}
                  apodError={apodError}
                  epicDates={epicDates}
                  epicDefaultDate={epicDefaultDate}
                  eonet={eonet}
                  eonetError={eonetError}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
