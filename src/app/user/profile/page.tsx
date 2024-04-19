"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/utils/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import useAuth from "@/hooks/useAuth";
import Header from "@/components/Header";
import { useRecoilValue } from "recoil";
import { isLoggedIn } from "@/atoms/atom";
import { useRouter } from "next/navigation";

function Profile() {
  const user = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const isLogged = useRecoilValue(isLoggedIn);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name || "");
          setExperience(userData.experience || "");
          setEducation(userData.education || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchData();
  }, [user]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      if (!user) {
        console.error("User is not authenticated.");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          name,
          experience,
          education,
        },
        { merge: true }
      );
      router.back();
      console.log("Form data updated in Firestore successfully.");
    } catch (error) {
      console.error("Error updating form data in Firestore:", error);
    }
  };

  return (
    <>
      {isLogged && <Header />}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        <div className="max-w-md w-full px-6 py-8 bg-white shadow-md overflow-hidden sm:rounded-lg">
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-700"
              >
                Experience
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="education"
                className="block text-sm font-medium text-gray-700"
              >
                Education
              </label>
              <input
                type="text"
                id="education"
                name="education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                required
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile;
