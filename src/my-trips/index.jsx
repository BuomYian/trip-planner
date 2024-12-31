import { db } from "@/service/FirebaseConfig";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import axios from "axios";

const MyTrip = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placePhotos, setPlacePhotos] = useState({});

  useEffect(() => {
    getUserTrips();
  }, []);

  const getPlacePhoto = async (location, tripId) => {
    try {
      const response = await axios.post(
        "https://places.googleapis.com/v1/places:searchText",
        {
          textQuery: location,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
            "X-Goog-FieldMask": "places.photos",
          },
        }
      );

      const places = response.data.places;
      if (
        places &&
        places.length > 0 &&
        places[0].photos &&
        places[0].photos.length > 0
      ) {
        setPlacePhotos((prev) => ({
          ...prev,
          [tripId]: places[0].photos[0].name,
        }));
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
    }
  };

  const getUserTrips = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        navigate("/");
        return;
      }

      setLoading(true);
      const tripsRef = ref(db, "AITrips");
      const tripsQuery = query(
        tripsRef,
        orderByChild("userEmail"),
        equalTo(user.email)
      );

      const snapshot = await get(tripsQuery);
      if (snapshot.exists()) {
        const tripsData = [];
        snapshot.forEach((childSnapshot) => {
          const tripData = {
            id: childSnapshot.key,
            ...childSnapshot.val(),
          };
          tripsData.push(tripData);
          // Fetch photo for each trip
          if (tripData.userSelection?.location?.label) {
            getPlacePhoto(tripData.userSelection.location.label, tripData.id);
          }
        });
        setTrips(tripsData);
      } else {
        console.log("No trips found");
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your trips",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center flex-col mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Trips</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer p-4"
              onClick={() => navigate(`/view-trip/${trip.id}`)}
            >
              <h2 className="font-semibold text-xl mb-2">
                {trip.userSelection?.location?.label || "Unnamed Location"}
              </h2>
              <div>
                {placePhotos[trip.id] ? (
                  <img
                    src={`https://places.googleapis.com/v1/${
                      placePhotos[trip.id]
                    }/media?key=${
                      import.meta.env.VITE_GOOGLE_PLACE_API_KEY
                    }&maxHeightPx=400&maxWidthPx=800`}
                    alt={trip.userSelection?.location?.label}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <img
                    src="/public/lisbon.jpg"
                    alt={trip.userSelection?.location?.label}
                    className="w-full h-[220px] object-cover rounded-lg mb-2"
                  />
                )}
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Duration: {trip.userSelection?.noOfDays || "N/A"} Days</p>
                  <p>Budget: {trip.userSelection?.budget || "N/A"}</p>
                  <p>Travelers: {trip.userSelection?.travelers || "N/A"}</p>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Created on:{" "}
                  {new Date(trip.timestamp || Date.now()).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            You haven&apos;t created any trips yet.
          </p>
          <Button
            onClick={() => navigate("/create-trip")}
            className="bg-[#f56551] text-white font-bold py-2 px-5 rounded-lg"
          >
            Create Your First Trip
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyTrip;
