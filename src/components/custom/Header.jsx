import { useEffect, useState } from "react";
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

  useEffect(() => {
    console.log("User:", user);
  }, []);

  const login = useGoogleLogin({
    onSuccess: (userRes) => getUserProfile(userRes),
    onError: (error) => {
      console.log(error);
    },
  });

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
        console.log(res);
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        window.location.reload();
      });
  };

  return (
    <div className="p-8 shadow-sm flex justify-between items-center w-full">
      <a href="/">
        <h2 className="font-bold text-2xl cursor-pointer text-gray-600">
          Ai Trip Planner
        </h2>
      </a>
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/my-trips">
              <Button className="bg-[#f56551] text-white font-bold py-2 px-5 rounded-lg">
                My Trip
              </Button>
            </a>

            <Popover className="">
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  alt={user.name}
                  className="w-10 h-10 rounded-full ml-4"
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="cursor-pointer"
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
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

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-lg mt-7">
              Sign in with Google
            </DialogTitle>
            <DialogDescription>
              To generate a trip, you need to sign in with your google account
              <Button
                disabled={loading}
                onClick={login}
                className="bg-[#f56551] text-white font-bold py-2 px-5 rounded-lg mt-10"
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
