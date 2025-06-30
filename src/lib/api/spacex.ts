export async function getSpaceXLaunches(limit = 20) {
  const url = `https://api.spacexdata.com/v4/launches?limit=${limit}&sort=date_unix&order=desc`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch SpaceX launches');
  return res.json();
}

export async function getSpaceXRockets() {
  const url = 'https://api.spacexdata.com/v4/rockets';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch SpaceX rockets');
  return res.json();
}

export async function getSpaceXCompany() {
  const url = 'https://api.spacexdata.com/v4/company';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch SpaceX company info');
  return res.json();
}

export async function getSpaceXPayloads() {
  const url = 'https://api.spacexdata.com/v4/payloads';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch SpaceX payloads');
  return res.json();
}

export async function getSpaceXLaunchpads() {
  const url = 'https://api.spacexdata.com/v4/launchpads';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch SpaceX launchpads');
  return res.json();
}

export async function getSpaceXCrew() {
  const url = 'https://api.spacexdata.com/v4/crew';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch SpaceX crew');
  return res.json();
}

export async function getSpaceXStarlink() {
  const url = 'https://api.spacexdata.com/v4/starlink';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch SpaceX Starlink');
  return res.json();
}

export async function getSpaceXHistory() {
  const url = 'https://api.spacexdata.com/v4/history';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch SpaceX history');
  return res.json();
}

export async function getSpaceXLandpads() {
  const url = 'https://api.spacexdata.com/v4/landpads';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch SpaceX landpads');
  return res.json();
}

export async function getSpaceXCapsules() {
  const url = 'https://api.spacexdata.com/v4/capsules';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch SpaceX capsules');
  return res.json();
}

export async function getSpaceXUpcomingLaunches() {
  const url = 'https://api.spacexdata.com/v4/launches/upcoming';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch upcoming SpaceX launches');
  return res.json();
}

export async function getSpaceXPastLaunches() {
  const url = 'https://api.spacexdata.com/v4/launches/past';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch past SpaceX launches');
  return res.json();
} 