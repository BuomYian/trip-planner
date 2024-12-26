import { Button } from "../ui/button";

const Header = () => {
  return (
    <div className="p-8 shadow-sm flex justify-between items-center w-full">
      <h2 className="font-bold text-2xl cursor-pointer">Ai Trip Planner</h2>
      <Button className="bg-[#f56551] text-white font-bold py-2 px-5 rounded-lg">
        Sign In
      </Button>
    </div>
  );
};

export default Header;
