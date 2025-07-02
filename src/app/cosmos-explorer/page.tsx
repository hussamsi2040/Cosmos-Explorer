import { getAPOD } from "../../lib/api/apod";
import { getEPICImage } from "../../lib/api/epic";
import { Suspense } from "react";

// Mock Mars weather data since NASA doesn't provide real-time Mars weather API
const getMarsWeather = () => {
  const sols = [3456, 3457, 3458, 3459, 3460];
  const currentSol = sols[Math.floor(Math.random() * sols.length)];
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return {
    sol: currentSol,
    date: dateStr,
    highTemp: Math.floor(Math.random() * 20) - 30, // -30 to -10
    lowTemp: Math.floor(Math.random() * 20) - 90,  // -90 to -70
    windSpeed: Math.floor(Math.random() * 20) + 10, // 10-30 km/h
    windDirection: ['northwest', 'northeast', 'southwest', 'southeast'][Math.floor(Math.random() * 4)],
    skyCondition: ['Mostly clear with occasional dust devils', 'Clear skies', 'Light dust haze', 'Scattered clouds'][Math.floor(Math.random() * 4)]
  };
};

// Mock Earth vs Mars comparison data
const getEarthVsMars = () => {
  const earthTemp = Math.floor(Math.random() * 30) + 10; // 10-40°C
  const earthCondition = ['Sunny', 'Partly cloudy', 'Overcast', 'Light rain'][Math.floor(Math.random() * 4)];
  
  return {
    earth: {
      temperature: earthTemp,
      condition: earthCondition,
      skyColor: 'blue'
    },
    mars: {
      temperature: Math.floor(Math.random() * 20) - 30,
      condition: 'Mostly clear',
      skyColor: 'reddish hue due to dust particles'
    }
  };
};

// Inspirational space quotes
const spaceQuotes = [
  { text: "The Earth is the cradle of humanity, but mankind cannot stay in the cradle forever.", author: "Konstantin Tsiolkovsky, Rocket Pioneer" },
  { text: "Space exploration is a force of nature unto itself that no other force in society can rival.", author: "Neil deGrasse Tyson, Astrophysicist" },
  { text: "The universe is not only queerer than we suppose, but queerer than we can suppose.", author: "J.B.S. Haldane, Scientist" },
  { text: "We are all made of star stuff.", author: "Carl Sagan, Astronomer" },
  { text: "The cosmos is within us. We are made of star-stuff.", author: "Carl Sagan, Astronomer" }
];

async function CosmosContent() {
  let apod, epic;
  let apodError: string | undefined = undefined;
  let epicError: string | undefined = undefined;

  try {
    apod = await getAPOD();
  } catch (e) {
    apodError = "Could not load Astronomy Picture of the Day.";
  }

  try {
    epic = await getEPICImage();
  } catch (e) {
    epicError = "Could not load Earth observation data.";
  }

  const marsWeather = getMarsWeather();
  const earthVsMars = getEarthVsMars();
  const todayQuote = spaceQuotes[Math.floor(Math.random() * spaceQuotes.length)];

  return (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Today in Space</p>
      </div>

      {/* NASA Astronomy Picture of the Day */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">NASA Astronomy Picture of the Day</h2>
      <div className="p-4 @container">
        <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
          <div
            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
            style={{
              backgroundImage: apod && !apodError 
                ? `url("${apod.url}")` 
                : 'url("https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop")'
            }}
          ></div>
          <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4">
            <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              {apod && !apodError ? apod.title : "The Whispering Galaxy"}
            </p>
            <div className="flex items-end gap-3 justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-[#a2abb3] text-base font-normal leading-normal">
                  {apod && !apodError 
                    ? apod.explanation.substring(0, 200) + "..."
                    : "This captivating image reveals a spiral galaxy, its arms adorned with bright nebulae and dark dust lanes, set against a backdrop of distant galaxies. The galaxy's core glows intensely, hinting at a supermassive black hole."
                  }
                </p>
                <p className="text-[#a2abb3] text-base font-normal leading-normal">
                  Image Credit & Copyright: {apod && !apodError ? (apod.copyright || "NASA") : "Dr. Robert Smith"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex px-4 py-3 justify-start">
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#2c3035] text-white text-sm font-bold leading-normal tracking-[0.015em]">
          <span className="truncate">Download as Wallpaper</span>
        </button>
      </div>

      {/* Mars Weather Report */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Mars Weather Report</h2>
      <div className="p-4 @container">
        <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
          <div
            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1614732414444-096040ec8ecf?w=800&h=600&fit=crop")'
            }}
          ></div>
          <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4">
            <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              Sol {marsWeather.sol} ({marsWeather.date})
            </p>
            <div className="flex items-end gap-3 justify-between">
              <p className="text-[#a2abb3] text-base font-normal leading-normal">
                Temperature: High {marsWeather.highTemp}°C, Low {marsWeather.lowTemp}°C. 
                Wind: {marsWeather.windSpeed} km/h from the {marsWeather.windDirection}. 
                Sky: {marsWeather.skyCondition}. Fun Fact: Today's weather on Mars is 
                similar to a winter day in the Antarctic, but with much thinner air!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Earth Observation */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Earth Observation</h2>
      <div className="p-4 @container">
        <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
          <div
            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
            style={{
              backgroundImage: epic && !epicError 
                ? `url("${epic.imageUrl}")` 
                : 'url("https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop")'
            }}
          ></div>
          <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4">
            <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Global Cloud Coverage</p>
            <div className="flex items-end gap-3 justify-between">
              <p className="text-[#a2abb3] text-base font-normal leading-normal">
                {epic && !epicError 
                  ? `This satellite image from NASA's EPIC camera shows Earth's natural color view. Captured on ${epic.date.split(' ')[0]}, revealing weather patterns and atmospheric conditions across our planet.`
                  : "This satellite image shows the Earth's cloud cover, revealing weather patterns and atmospheric conditions. The swirling clouds indicate active weather systems, while clear areas suggest calm conditions. The image provides a snapshot of the planet's dynamic atmosphere."
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compare Today on Earth vs Mars */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Compare Today on Earth vs Mars</h2>
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label className="flex flex-col min-w-40 flex-1">
          <select className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#40474f] bg-[#1e2124] focus:border-[#40474f] h-14 bg-[image:--select-button-svg] placeholder:text-[#a2abb3] p-[15px] text-base font-normal leading-normal">
            <option value="temperature">Temperature Comparison</option>
            <option value="weather">Weather Conditions</option>
            <option value="atmosphere">Atmospheric Differences</option>
          </select>
        </label>
      </div>
      <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4">
        Today on Earth: {earthVsMars.earth.condition} with a high of {earthVsMars.earth.temperature}°C. 
        Today on Mars: {earthVsMars.mars.condition} with a high of {earthVsMars.mars.temperature}°C. 
        The sky on Earth is {earthVsMars.earth.skyColor}, while on Mars it has a {earthVsMars.mars.skyColor} in the atmosphere.
      </p>

      {/* Quote of the Day */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Quote of the Day</h2>
      <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4">
        "{todayQuote.text}" - {todayQuote.author}
      </p>
    </div>
  );
}

export default function CosmosExplorer() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#121416] dark group/design-root overflow-x-hidden"
      style={{
        '--select-button-svg': "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(162,171,179)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e')",
        fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'
      } as React.CSSProperties}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2c3035] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Cosmos Explorer</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-white text-sm font-medium leading-normal" href="#">Home</a>
              <a className="text-white text-sm font-medium leading-normal" href="#">Tracker</a>
              <a className="text-white text-sm font-medium leading-normal" href="#">Events</a>
              <a className="text-white text-sm font-medium leading-normal" href="#">Weather</a>
              <a className="text-white text-sm font-medium leading-normal" href="#">Today</a>
            </div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <Suspense fallback={
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="text-white text-center p-8">Loading your cosmic journey...</div>
            </div>
          }>
            <CosmosContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}