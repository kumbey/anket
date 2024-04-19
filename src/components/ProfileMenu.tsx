import { isLoggedIn } from "@/atoms/atom";
import { auth } from "@/utils/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";
import { useSetRecoilState } from "recoil";

const Profile = () => {
  const router = useRouter();
  const setIsLogged = useSetRecoilState(isLoggedIn);

  const handleSignOut = async () => {
    try {
      await signOut(auth).then(() => {
        router.push("/");
        setIsLogged(false);
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <div className=" flex flex-col">
      <div>Profile</div>
      <button
        onClick={handleSignOut}
        className="text-white hover:text-gray-200"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
