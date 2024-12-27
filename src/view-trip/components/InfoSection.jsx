import { Button } from "@/components/ui/button";
import { getPlaceDetails } from "@/service/GlobalApi";
import { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useToast } from "@/components/ui/use-toast";

const InfoSection = (trip) => {
  const [placePhoto, setPlacePhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (trip.trip?.userSelection?.location?.label) {
      getPlacePhoto();
    }
  }, [trip]);

  const getPlacePhoto = async () => {
    try {
      setLoading(true);
      const data = {
        textQuery: trip.trip.userSelection.location.label,
      };

      const response = await getPlaceDetails(data);
      const places = response.data.places;

      if (
        places &&
        places.length > 0 &&
        places[0].photos &&
        places[0].photos.length > 0
      ) {
        setPlacePhoto(places[0].photos[4].name);
      } else {
        console.log("No photos available for this place");
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load place photo",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {placePhoto ? (
        <img
          src={`https://places.googleapis.com/v1/${placePhoto}/media?key=${
            import.meta.env.VITE_GOOGLE_PLACE_API_KEY
          }&maxHeightPx=400&maxWidthPx=800`}
          alt={trip.trip?.userSelection?.location?.label}
          className="w-full h-[340px] object-cover rounded-lg"
        />
      ) : (
        <img
          src="/public/lisbon.jpg"
          alt={trip.userSelection?.location?.label}
          className="w-full h-[340px] object-cover rounded-lg"
        />
      )}

      <div className="my-5 flex flex-col gap-2">
        <h2 className="font-bold text-xl">
          {trip.trip?.userSelection?.location?.label}
        </h2>
        <div className="flex flex-wrap justify-between gap-5 items-center">
          <div className="flex gap-4 text-gray-600">
            <p className="bg-gray-200 rounded-lg p-1 px-3 text-sm">
              Duration: {trip.trip?.userSelection?.noOfDays} Days
            </p>
            <p className="bg-gray-200 rounded-lg p-1 px-3 text-sm">
              Budget: {trip.trip?.userSelection?.budget}
            </p>
            <p className="bg-gray-200 rounded-lg p-1 px-3 text-sm">
              Travelers: {trip.trip?.userSelection?.travelers}
            </p>
          </div>

          <div className="flex gap-4">
            <Button className="flex gap-2 bg-[#f56551] text-white font-bold py-2 px-5 rounded-lg">
              Share <IoIosSend />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
