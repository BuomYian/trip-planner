import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-16 mx-5 px-10 gap-9">
      <h1 className="text-[55px] font-bold text-center">
        <span className="text-[#f56551]">
          Discover your next adventure with AI:
        </span>
        <br />
        Personalized Itineraries at your fingertips
      </h1>
      <p className="text-gray-500 text-center">
        Your personal trip planner and travel curator, creating custom
        itineraries tailored to your interests and budget
      </p>
      <Link to="/create-trip">
        <Button className="bg-[#f56551] text-white font-bold py-2 px-5 rounded-lg">
          Get Started
        </Button>
      </Link>

      {/* <img
        src="/hero.jpg"
        alt="hero"
        className="w-[75%] md:w-full h-[950px] -mt-35"
      /> */}
    </div>
  );
};

export default Hero;
