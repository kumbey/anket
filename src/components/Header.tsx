"use client";

import React from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/atoms/atom";
import { useSetRecoilState } from "recoil";

function Header() {
  const user = useAuth();
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
    <header className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <span className="text-white text-xl font-bold cursor-pointer">
            Your App Name
          </span>
        </Link>
        {user ? (
          <button
            onClick={handleSignOut}
            className="text-white hover:text-gray-200"
          >
            Logout
          </button>
        ) : (
          <Link href="/login">
            <span className="text-white hover:text-gray-200 cursor-pointer">
              Login
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
