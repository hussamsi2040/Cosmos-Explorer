export async function getEONETEvents() {
  const url = 'https://eonet.gsfc.nasa.gov/api/v3/events?limit=5&status=open';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch EONET events');
  return res.json();
} 