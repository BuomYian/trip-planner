import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelList,
} from "@/constants/options";
import { chatSession } from "@/service/AiModal";
import { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const CreateTrip = () => {
  const [place, setPlace] = useState();
  const { toast } = useToast();
  const [formData, setFormData] = useState([]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const onGeneratedTrip = async () => {
    if (
      !formData.noOfDays ||
      !formData.location ||
      !formData.budget ||
      !formData.travelers
    ) {
      toast({
        title: "Error",
        description: "Please enter all the details",
        variant: "destructive",
      });
      return;
    }

    const FINAL_PROMPT = AI_PROMPT.replace(
      `{location}`,
      formData.location.label
    )
      .replace(`{noOfDays}`, formData.noOfDays)
      .replace(`{travelers}`, formData.travelers)
      .replace(`{budget}`, formData.budget)
      .replace(`{noOfdays}`, formData.noOfDays);

    console.log(FINAL_PROMPT);
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log(result.response.text());
  };

  return (
    <div className="sm:px-10 md:px-10 lg:px-20 xl:px-20 px-8 mt-5 py-6">
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
            Whom are you travelling with?
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-5 mt-3">
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${
                  formData.travelers === item.people ? "border-[#f56551]" : ""
                }`}
                onClick={() => handleInputChange("travelers", item.people)}
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
