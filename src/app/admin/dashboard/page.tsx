"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/firebaseConfig";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  Query,
  query,
  startAt,
  where,
} from "firebase/firestore";
import Sidebar from "@/components/Sidebar";
import { useRecoilValue } from "recoil";
import { isLoggedIn } from "@/atoms/atom";
import Header from "@/components/Header";
import useAuth from "@/hooks/useAuth";

const AdminDashboard: React.FC = () => {
  const isLogged = useRecoilValue(isLoggedIn);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [selectedMenu, setSelectedMenu] = useState("users");
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  let userName: string | null = "";

  const user = useAuth();

  interface UserData {
    name: string;
    email: string;
  }
  const fetchItems = async () => {
    try {
      const colRef = collection(db, "users");
      let itemsQuery: Query<unknown, DocumentData> = colRef; // Initialize to colRef

      if (nameFilter) {
        itemsQuery = query(colRef, where("name", "==", nameFilter));
      }

      if (emailFilter) {
        itemsQuery = query(colRef, where("email", "==", emailFilter));
      }

      const itemsSnapshot = await getDocs(itemsQuery);
      const itemsData = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as UserData),
      }));

      setFilteredUsers(itemsData);
    } catch (error) {
      console.error(`Error fetching ${"users"}:`, error);
      setFilteredUsers([]);
    }
  };
  const getUserNameById = async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        console.log("No user document found for userId:", userId);
        return null;
      }

      const userData = userDocSnapshot.data() as UserData;
      return userData.name;
    } catch (error) {
      console.error("Error getting user document:", error);
      return null;
    }
  };

  const fetchApplications = async () => {
    try {
      const colRef = collection(db, "applications");
      let itemsQuery: Query<unknown, DocumentData> = colRef; // Initialize to colRef

      if (nameFilter) {
        itemsQuery = query(colRef, where("title", "==", nameFilter));
      }

      if (emailFilter) {
        itemsQuery = query(colRef, where("email", "==", emailFilter));
      }

      const itemsSnapshot = await getDocs(itemsQuery);
      const itemsData = await Promise.all(
        itemsSnapshot.docs.map(async (doc) => {
          const userData = doc.data() as UserData & { userId: string };
          const userName = await getUserNameById(userData?.userId);
          return {
            id: doc.id,
            userName,
            ...userData,
          };
        })
      );

      setFilteredApplications(itemsData);
    } catch (error) {
      console.error(`Error fetching applications:`, error);
      setFilteredApplications([]);
    }
  };

  const fetchJobs = async () => {
    try {
      const colRef = collection(db, "jobs");
      let itemsQuery: Query<unknown, DocumentData> = colRef; // Initialize to colRef

      if (nameFilter) {
        itemsQuery = query(colRef, where("title", "==", nameFilter));
      }

      if (emailFilter) {
        itemsQuery = query(colRef, where("experience", "==", emailFilter));
      }

      const itemsSnapshot = await getDocs(itemsQuery);
      const itemsData = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as UserData),
      }));

      setFilteredJobs(itemsData);
    } catch (error) {
      console.error(`Error fetching ${"users"}:`, error);
      setFilteredJobs([]);
    }
  };

  const getUserName = async (userId: string) => {
    try {
      const colRef = collection(db, "users");
      const itemsQuery = query(colRef, where("uid", "==", userId));
      const itemsSnapshot = await getDocs(itemsQuery);

      if (itemsSnapshot.empty) {
        console.log("No user document found for userId:", userId);
        return null;
      }

      const itemsData = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as UserData),
      }));
      return itemsData[0].name;
    } catch (error) {
      console.error("Error getting user document:", error);
      return null;
    }
  };

  const handleMenuSelect = (menu: string) => {
    setSelectedMenu(menu);
    if (menu == "jobs") {
      fetchJobs();
    } else if (menu == "users") {
      fetchItems();
    } else {
      fetchApplications();
    }
  };
  const handleNameFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNameFilter(event.target.value);
  };

  const handleEmailFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmailFilter(event.target.value);
  };

  useEffect(() => {
    fetchItems();
  }, [selectedMenu, nameFilter, emailFilter]);

  return (
    <>
      {isLogged && <Header />}
      <div className="flex">
        <Sidebar selectedMenu={selectedMenu} onSelectMenu={handleMenuSelect} />
        <div className="flex-1 p-4">
          <div className="flex text-gray-700">
            <div className="mb-4 mr-4">
              <input
                type="text"
                placeholder="Search by name"
                value={nameFilter}
                onChange={handleNameFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by email"
                value={emailFilter}
                onChange={handleEmailFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <h1 className="text-2xl font-semibold mb-4">
            {selectedMenu === "users" ? "Users" : "Applications"}
          </h1>
          {selectedMenu === "users" ? (
            <ul>
              {filteredUsers.map((user, index) => (
                <div key={index}>
                  {user.email !== "admin@admin.com" && (
                    <li key={user.id} className="border-b border-gray-200 py-2">
                      <div className="flex">
                        <p>{index + 1}</p>
                        <div className=" pl-5">
                          <h2 className="text-lg font-semibold">{user.name}</h2>
                          <p className="text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </li>
                  )}
                </div>
              ))}
            </ul>
          ) : selectedMenu === "jobs" ? (
            <ul>
              {filteredJobs.map((job, index) => (
                <div key={index}>
                  {job.email !== "admin@admin.com" && (
                    <li key={job.id} className="border-b border-gray-200 py-2">
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
                    </li>
                  )}
                </div>
              ))}
            </ul>
          ) : (
            <ul>
              {filteredApplications.map((user, index) => {
                // try {
                //   userName = getUserName(user.userId);
                // } catch (error) {
                //   console.error("Error getting username:", error);
                // }

                return (
                  <div key={index}>
                    {user.email !== "admin@admin.com" && (
                      <li
                        key={user.id}
                        className="border-b border-gray-200 py-2"
                      >
                        <div className="flex">
                          <p>{index + 1}</p>
                          <div className=" pl-5">
                            <h2 className="text-lg font-semibold">
                              Name: {user.userName}
                            </h2>
                            <p className="text-gray-600">Title: {user.title}</p>
                            <p className="text-gray-600">
                              Education: {user.education}
                            </p>
                            <p className="text-gray-600">
                              Experience: {user.experience}
                            </p>
                          </div>
                        </div>
                      </li>
                    )}
                  </div>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
