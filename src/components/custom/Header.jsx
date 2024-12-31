import { useState } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   console.log("User:", user);
  // }, []);

  const login = useGoogleLogin({
    onSuccess: (userRes) => getUserProfile(userRes),
    onError: (error) => {
      console.log(error);
    },
  });

  const onSignOut = () => {
    googleLogout();
    localStorage.removeItem("user");
    window.location.reload();
  };

  const getUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((res) => {
        // console.log(res);
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        window.location.reload();
      });
  };

  return (
    <div className="p-8 shadow-sm flex justify-between items-center w-full">
      <a href="/">
        <h2 className="font-bold text-lg sm:text-2xl cursor-pointer text-gray-800">
          Ai Trip Planner
        </h2>
      </a>
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/create-trip">
              <Button
                varient="outline"
                className="bg-[#f56551] text-white font-bold py-2 px-5 rounded-lg"
                size="sm"
              >
                Create Trip
              </Button>
            </a>
            <a href="/my-trips">
              <Button
                varient="outline"
                className="bg-[#f56551] text-white font-bold py-2 px-5 rounded-lg"
                size="sm"
              >
                My Trip
              </Button>
            </a>

            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
              <Popover>
                <PopoverTrigger>
                  <img
                    src={user?.picture}
                    alt={user.name}
                    className="w-10 h-10 rounded-full ml-4 cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </PopoverTrigger>
                <PopoverContent className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
                  <div className="flex items-center gap-3 p-2">
                    <img
                      src={user?.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div
                    onClick={onSignOut}
                    className="mt-2 p-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer transition-colors"
                  >
                    Sign Out
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ) : (
          <Button
            className="bg-[#f56551] text-white font-bold py-2 px-5 rounded-lg"
            onClick={() => setOpenDialog(true)}
          >
            Sign In
          </Button>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-lg mt-7">
              Sign in with Google
            </DialogTitle>
            <DialogDescription className="flex flex-col items-center gap-4">
              To generate a trip, you need to sign in with your google account
              <Button
                disabled={loading}
                onClick={() => {
                  setLoading(true);
                  login();
                }}
                className="bg-[#f56551] text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2"
              >
                <FcGoogle className="text-2xl" />
                Sign in With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
