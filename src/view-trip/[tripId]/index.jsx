import { useParams } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "@/service/FirebaseConfig";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import InfoSection from "../components/InfoSection";
import Hotels from "../components/Hotels";

const ViewTrip = () => {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    tripId && getTripData();
  }, [tripId]);

  // fetch trip data using tripId
  const getTripData = async () => {
    try {
      setLoading(true);
      const tripRef = ref(db, `AITrips/${tripId}`);
      const snapshot = await get(tripRef);

      if (snapshot.exists()) {
        setTripData(snapshot.val());
        console.log("Trip data:", snapshot.val());
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Trip not found",
        });
        console.log("No trip found!");
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load trip data",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-6">
        <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
      </div>
    );
  }

  if (!tripData) {
    return <div>Trip not found</div>;
  }

  return (
    <div className="p-10 md:px-20 lg:px-56">
      {/* Information Section */}
      <InfoSection trip={tripData} />

      {/* Recommended Hotels */}
      <Hotels trip={tripData} />

      {/* Daily Plan */}

      {/* Footer */}
    </div>
  );
};

export default ViewTrip;
