"use client";

import React from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import Modal from "./Modal";

function Header() {
  const user = useAuth();

  return (
    <header className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <span className="text-white text-xl font-bold ">Logo</span>
        {user ? (
          <div className="flex flex-col items-end">
            <Modal />
          </div>
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
