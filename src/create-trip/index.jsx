import React from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const CreateTrip = () => {
  return (
    <div className="sm:px-10 md:px-10 lg:px-15 xl:px-40 px-5 mt-10">
      <h2 className="text-3xl font-bold">Tell us your preferences</h2>
      <p className="text-gray-500 mt-3 text-xl">
        Just tell some basic information about your trip and we&apos;ll create a
        personalized itinerary for you based on your preferences{" "}
      </p>
      <div className="mt-10">
        <div>
          <h2 className="text-2xl my-3 font-medium">
            What is your destination?
          </h2>
          <GooglePlacesAutocomplete apiKey="" />
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
