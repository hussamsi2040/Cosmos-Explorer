export async function getEPICImage() {
  const apiKey = process.env.NASA_API_KEY;
  const url = `https://api.nasa.gov/EPIC/api/natural/images?api_key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch EPIC image');
  const data = await res.json();
  if (!data.length) throw new Error('No EPIC images found');
  // Get the most recent image
  const latest = data[0];
  // Construct image URL
  const date = latest.date.split(' ')[0].replace(/-/g, '/');
  const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${date}/jpg/${latest.image}.jpg`;
  return { ...latest, imageUrl };
}

export async function getEPICDates() {
  const url = 'https://epic.gsfc.nasa.gov/api/natural/all';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch EPIC dates');
  return res.json();
}

export async function getEPICImagesByDate(date: string) {
  const url = `https://epic.gsfc.nasa.gov/api/natural/date/${date}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch EPIC images for date');
  const data = await res.json();
  // Add imageUrl to each image
  return data.map((img: any) => {
    const [year, month, day] = date.split('-');
    return {
      ...img,
      imageUrl: `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/jpg/${img.image}.jpg`,
    };
  });
} 