import axios from "axios";

const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
    "X-Goog-FieldMask": "places.photos,places.displayName,places.id",
  },
};

export const getPlaceDetails = async (data) => {
  try {
    return await axios.post(BASE_URL, data, config);
  } catch (error) {
    console.error("Error fetching place details:", error.response || error);
    throw error;
  }
};
