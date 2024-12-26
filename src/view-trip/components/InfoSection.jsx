import { Button } from "@/components/ui/button";
import { IoIosSend } from "react-icons/io";

const InfoSection = (trip) => {
  return (
    <div>
      <img
        src="/public/lisbon.jpg"
        alt={trip.trip.title}
        className="w-full h-[340px] object-cover rounded-lg"
      />

      <div className="my-5 flex flex-col gap-2">
        <h2 className="font-bold text-xl">
          {trip.trip?.userSelection?.location?.label}
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex gap-5">
            <h2 className="text-sm p-1 px-3 bg-gray-200 rounded-lg sm:text-xs md:text-sm">
              📅 {trip.trip.userSelection.noOfDays} Days
            </h2>
            <h2 className="text-sm p-1 px-3 bg-gray-200 rounded-lg sm:text-xs md:text-sm">
              💵 {trip.trip.userSelection.budget} Budget
            </h2>
            <h2 className="text-sm p-1 px-3 bg-gray-200 rounded-lg sm:text-xs md:text-sm">
              🧑‍🤝‍🧑 No. of Travelers: {trip.trip.userSelection.travelers} Peoples
            </h2>
          </div>

          <Button className="bg-[#f56551] text-white font-bold py-2 px-5 rounded-lg">
            <IoIosSend />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
