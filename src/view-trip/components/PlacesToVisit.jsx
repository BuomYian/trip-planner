const PlacesToVisit = (trip) => {
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
      <div className="space-y-6">
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
                  <div className="my-2 bg-gray-50 p-2 gap-4 border rounded-lg flex flex-cols-2 hover:scale-105 transition-all hover:shadow-md cursor-pointer">
                    {place.placeImageUrl && (
                      <img
                        src={place.placeImageUrl}
                        alt={place.placeName}
                        className="w-32 h-32 object-cover rounded-lg ml-4"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-lg">{place.placeName}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {place.placeDetails}
                      </p>
                      <div className="mt-2 text-sm text-gray-500">
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
