"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/utils/firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";

const Home = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        setLoading(false);
        setError("");

        if (userCredential.user.email === "admin@admin.com") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/dashboard");
        }
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    signIn();
  };

  const handleSignUp = async () => {
    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);

        var userData = {
          uid: user.uid,
          email: user.email,
        };

        var userRef = doc(collection(db, "users"), user.uid);
        setDoc(userRef, userData, { merge: true })
          .then(function () {
            setError("Signing in..");
            signIn();
          })
          .catch(function (error: any) {
            console.error("Error syncing user data to Firestore: ", error);
          });

        setLoading(false);
        setError("");
      })
      .catch((error) => {
        console.log(error.message);
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6  text-center text-3xl font-extrabold text-gray-900">
              Login
            </h2>
            <h4 className="text-center text-sm  text-gray-900">
              admin@admin.com
            </h4>
            <h4 className="text-center text-sm  text-gray-900">qweqwe</h4>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="text-red-500">{error}</div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                    />
                    <path
                      fillRule="evenodd"
                      d="M4 8a6 6 0 1112 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2V8zm12-3V5a3 3 0 00-3-3H7a3 3 0 00-3 3v1h10z"
                    />
                  </svg>
                </span>
                Login
              </button>
            </div>
            <div>
              <button
                type="button"
                disabled={loading}
                onClick={handleSignUp}
                className={`
              ${loading ? "bg-gray-400 hover:bg-gray-400" : "bg-gray-600"}
              group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white  hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-500 group-hover:text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                    />
                    <path
                      fillRule="evenodd"
                      d="M4 8a6 6 0 1112 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2V8zm12-3V5a3 3 0 00-3-3H7a3 3 0 00-3 3v1h10z"
                    />
                  </svg>
                </span>
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
