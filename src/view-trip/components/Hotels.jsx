import { Link } from "react-router-dom";

const Hotels = (trip) => {
  return (
    <div>
      <h2 className="font-bold text-xl">Hotels Recommendation</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
        {trip.trip.tripData?.hotels?.map((hotel, index) => (
          <Link
            to={
              "https://www.google.com/maps/search/?api=1&query=" +
              hotel?.hotelName +
              "," +
              hotel?.hotelAddress
            }
            target="_blank"
            key={index}
          >
            <div className="hover:scale-105 transition-all cursor-pointer">
              <img src="/public/lisbon.jpg" className="rounded-lg" />
              <div className="my-2 flex flex-col gap-2">
                <h2 className="font-medium text-gray-700">
                  {hotel?.hotelName}
                </h2>
                <h2 className="text-xs text-gray-500">
                  📍 {hotel?.hotelAddress}
                </h2>
                <h2 className="text-xs text-gray-700">💰 {hotel?.price}</h2>
                <h2 className="text-xs text-gray-700">⭐ {hotel?.rating}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
