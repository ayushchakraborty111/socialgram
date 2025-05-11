import axios from "axios";
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const getUnsplashImages = async (query = "person", count = 9) => {
  const response = await axios.get(
    `https://api.unsplash.com/photos/random`,
    {
      params: {
        query,
        count,
        orientation: "squarish",
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );
  return response.data;
};

export default getUnsplashImages;
