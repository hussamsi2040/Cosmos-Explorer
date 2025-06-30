export async function fetchISSPosition() {
  const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
  if (!res.ok) throw new Error("Failed to fetch ISS position");
  return res.json(); // { latitude, longitude, altitude, velocity, ... }
}

export async function fetchISSCrew() {
  const res = await fetch("http://api.open-notify.org/astros.json");
  if (!res.ok) throw new Error("Failed to fetch ISS crew");
  const data = await res.json();
  return data.people.filter((p: any) => p.craft === "ISS");
} 