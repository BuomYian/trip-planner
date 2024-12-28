import { useToast } from "@/components/ui/use-toast";
import { getPlaceDetails } from "@/service/GlobalApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PlacesToVisit = (trip) => {
  const [placePhotos, setPlacePhotos] = useState({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (trip.trip?.tripData?.itinerary) {
      fetchAllPlacePhotos();
    }
  }, [trip]);

  const fetchAllPlacePhotos = async () => {
    try {
      setLoading(true);
      const allPlaces = [];

      // Collect all places from the itinerary
      Object.values(trip.trip.tripData.itinerary).forEach((dayData) => {
        if (dayData.activities && Array.isArray(dayData.activities)) {
          allPlaces.push(...dayData.activities);
        }
      });

      // Fetch photos for all places in parallel
      const photoPromises = allPlaces.map((place) =>
        getPlacePhoto(place.placeName)
      );

      const photos = await Promise.all(photoPromises);
      const photoMap = {};

      allPlaces.forEach((place, index) => {
        if (photos[index]) {
          photoMap[place.placeName] = photos[index];
        }
      });

      setPlacePhotos(photoMap);
    } catch (error) {
      console.error("Error fetching place photos:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load some place photos",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlacePhoto = async (placeName) => {
    if (!placeName) return null;

    try {
      const data = {
        textQuery: placeName,
      };
      const response = await getPlaceDetails(data);
      const places = response.data.places;

      if (places?.[0]?.photos?.[0]?.name) {
        return places[0].photos[0].name;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching photo for ${placeName}:`, error);
      return null;
    }
  };

  if (!trip?.trip?.tripData?.itinerary) {
    return null;
  }

  // Convert itinerary object to array and sort by day
  const itineraryDays = Object.entries(trip.trip.tripData.itinerary)
    .map(([day, data]) => ({
      day,
      ...data,
    }))
    .sort((a, b) => a.day.localeCompare(b.day));

  return (
    <div className="mt-8">
      <h2 className="font-bold text-2xl mb-4">Places to Visit</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {itineraryDays.map((dayData, index) => (
          <div className="p-4" key={index}>
            <h3 className="font-semibold text-xl mb-3 text-primary">
              Day {dayData.day.replace("day", "")} - {dayData.theme}
            </h3>
            <p className="font-medium text-sm text-orange-600 mb-2">
              Best time to visit: {dayData.bestTimeToVisit}
            </p>
            <div className="space-y-4">
              {dayData.activities.map((place, placeIndex) => (
                <div
                  className="border-l-4 border-primary py-2"
                  key={placeIndex}
                >
                  <Link
                    to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      place.placeName
                    )}`}
                    target="_blank"
                    className="text-gray-800 hover:text-gray-800"
                  >
                    <div className="my-2 bg-gray-50 p-2 gap-4 border rounded-lg flex flex-cols-2 hover:scale-105 transition-all hover:shadow-md cursor-pointer">
                      <div className="relative w-32 h-32">
                        {placePhotos[place.placeName] ? (
                          <img
                            src={`https://places.googleapis.com/v1/${
                              placePhotos[place.placeName]
                            }/media?key=${
                              import.meta.env.VITE_GOOGLE_PLACE_API_KEY
                            }&maxHeightPx=400&maxWidthPx=800`}
                            alt={place.placeName}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/place-placeholder.jpg";
                            }}
                          />
                        ) : (
                          <img
                            src="/public/lisbon.jpg"
                            alt={place.placeName}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                        {loading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{place.placeName}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {place.placeDetails}
                        </p>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Travel Time: {place.travelTime}</p>
                          <p className="text-blue-700 text-sm">
                            Entry Fee:{" "}
                            {place.ticketPricing === "Free"
                              ? "Free Entry"
                              : `$${place.ticketPricing}`}
                          </p>
                          <p className="text-sm text-yellow-500">
                            Rating: {place.rating} ⭐
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesToVisit;
