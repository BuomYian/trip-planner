import { useToast } from "@/components/ui/use-toast";
import { getPlaceDetails } from "@/service/GlobalApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Hotels = (trip) => {
  const [hotelPhotos, setHotelPhotos] = useState({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (trip.trip?.tripData?.hotels) {
      fetchAllHotelPhotos();
    }
  }, [trip]);

  const fetchAllHotelPhotos = async () => {
    try {
      setLoading(true);
      const photoPromises = trip.trip.tripData.hotels.map((hotel) =>
        getPlacePhoto(hotel.hotelName)
      );

      const photos = await Promise.all(photoPromises);
      const photoMap = {};

      trip.trip.tripData.hotels.forEach((hotel, index) => {
        photoMap[hotel.hotelName] = photos[index];
      });

      setHotelPhotos(photoMap);
    } catch (error) {
      console.error("Error fetching hotel photos:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load some hotel photos",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlacePhoto = async (hotelName) => {
    try {
      const data = {
        textQuery: hotelName,
      };
      const response = await getPlaceDetails(data);
      const places = response.data.places;

      if (places?.[0]?.photos?.[0]?.name) {
        return places[0].photos[0].name;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching photo for ${hotelName}:`, error);
      return null;
    }
  };

  if (!trip.trip?.tripData?.hotels) {
    return (
      <div className="mt-8">
        <h2 className="font-bold text-2xl">Hotels Recommendation</h2>
        <p>No hotels available</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold text-xl">Hotels Recommendation</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
        {trip.trip.tripData.hotels.map((hotel, index) => (
          <Link
            to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              hotel.hotelName
            )}`}
            target="_blank"
            key={index}
          >
            <div className="bg-white rounded-lg shadow-md hover:scale-105 transition-all cursor-pointer p-4">
              <div className="relative h-48 mb-4">
                {hotelPhotos[hotel.hotelName] ? (
                  <img
                    src={`https://places.googleapis.com/v1/${
                      hotelPhotos[hotel.hotelName]
                    }/media?key=${
                      import.meta.env.VITE_GOOGLE_PLACE_API_KEY
                    }&maxHeightPx=400&maxWidthPx=800`}
                    alt={hotel.hotelName}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/hotel-placeholder.jpg";
                    }}
                  />
                ) : (
                  <img
                    src="/hotel-placeholder.jpg"
                    alt={hotel.hotelName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="font-medium text-gray-700 line-clamp-1">
                  {hotel.hotelName || "Hotel Name Not Available"}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2">
                  📍 {hotel.hotelAddress || "Address Not Available"}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-primary">
                    ${hotel.price || "N/A"}
                  </p>
                  <p className="text-sm text-yellow-500">
                    ⭐ {hotel.rating || "N/A"}
                  </p>
                </div>
                {hotel.amenities &&
                  Array.isArray(hotel.amenities) &&
                  hotel.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {hotel.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{hotel.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
