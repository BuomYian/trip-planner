import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectBudgetOptions, SelectTravelList } from "@/constants/options";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const CreateTrip = () => {
  const [place, setPlace] = useState();

  const [formData, setFormData] = useState([]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const onGeneratedTrip = () => {
    if (formData.noOfDays > 5) {
      toast("Please enter a valid number of days");
      return;
    }

    console.log("Generated Trip", formData);
  };

  return (
    <div className="sm:px-10 md:px-10 lg:px-15 xl:px-40 px-8 mt-5 py-6">
      <h2 className="text-3xl font-bold">Tell us your preferences</h2>
      <p className="text-gray-500 mt-3 text-xl">
        Just tell some basic information about your trip and we&apos;ll create a
        personalized itinerary for you based on your preferences{" "}
      </p>
      <div className="mt-10 flex flex-col gap-10">
        <div>
          <h2 className="text-2xl my-3 font-medium">
            What is your destination?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v);
              },
            }}
          />
        </div>
        <div>
          <h2 className="text-2xl my-3 font-medium">
            How many days are you planning to spend there?
          </h2>
          <Input
            placeholder="Enter number of days"
            type="number"
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>
        <div>
          <h2 className="text-2xl my-3 font-medium">What is your budget?</h2>
          <div className="grid grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-5 mt-3">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${
                  formData.budget === item.title ? "border-[#f56551]" : ""
                }`}
                onClick={() => handleInputChange("budget", item.title)}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl my-3 font-medium">
            Whom are you tavelling with?
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-5 mt-3">
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${
                  formData.noOfTravellers === item.people
                    ? "border-[#f56551]"
                    : ""
                }`}
                onClick={() => handleInputChange("noOfTravellers", item.people)}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          onClick={onGeneratedTrip}
          className="bg-[#f56551] text-white font-bold py-2 px-5 rounded-lg mt-10"
        >
          Generate Trip
        </Button>
      </div>
    </div>
  );
};

export default CreateTrip;
