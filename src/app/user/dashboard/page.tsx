"use client";
import { isLoggedIn } from "@/atoms/atom";
import Header from "@/components/Header";
import useAuth from "@/hooks/useAuth";
import { db } from "@/utils/firebaseConfig";
import {
  collection,
  Query,
  DocumentData,
  getDocs,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const isLogged = useRecoilValue(isLoggedIn);
  const router = useRouter();
  const user = useAuth();
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const notify = () => toast("Applied successfully!");

  const handleApply = async (id: string) => {
    try {
      if (!user) {
        console.error("User is not authenticated.");
        return;
      }
      let data = filteredJobs.filter((item) => item.id == id);
      console.log(data[0]);
      let preData = data[0];

      const userRef = collection(db, "applications");
      await addDoc(userRef, {
        userId: user.uid,
        id: preData.id,
        title: preData.title,
        experience: preData.experience,
        education: preData.education,
        description: preData.description,
      });
      notify();
      console.log("Form data updated in Firestore successfully.");
    } catch (error) {
      console.error("Error updating form data in Firestore:", error);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const colRef = collection(db, "jobs");
        let itemsQuery: Query<unknown, DocumentData> = colRef; // Initialize to colRef

        const itemsSnapshot = await getDocs(itemsQuery);
        const itemsData = itemsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));

        setFilteredJobs(itemsData);
      } catch (error) {
        console.error(`Error fetching ${"jobs"}:`, error);
        setFilteredJobs([]);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    console.log(filteredJobs);
  }, [filteredJobs]);

  return (
    <>
      {isLogged && <Header />}
      <ToastContainer />

      <div className="flex">
        <ul>
          {filteredJobs.map((job, index) => (
            <div key={index}>
              {job.email !== "admin@admin.com" && (
                <li
                  key={job.id}
                  className="border-b border-gray-200 py-2 flex items-center ml-8 mt-5"
                >
                  <div className="flex">
                    <p>{index + 1}</p>
                    <div className=" pl-5">
                      <h2 className="text-lg font-semibold">{job.title}</h2>
                      <p className="text-gray-600">
                        experience: {job.experience}
                      </p>
                      <p className="text-gray-600">
                        education: {job.education}
                      </p>
                      <p className="text-gray-600">
                        description: {job.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApply(job.id)}
                    className="ml-6 text-green-600"
                  >
                    Apply
                  </button>
                </li>
              )}
            </div>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Dashboard;
