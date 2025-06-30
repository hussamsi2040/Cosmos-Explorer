import axios from "axios";

const NASA_API_KEY = process.env.NASA_API_KEY;

export async function getLatestMarsRoverPhoto() {
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${NASA_API_KEY}`;
  const { data } = await axios.get(url);
  // Return the first photo or null if none
  return data.latest_photos?.[0] || null;
} 