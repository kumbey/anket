"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/firebaseConfig";
import {
  collection,
  DocumentData,
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
  const [selectedMenu, setSelectedMenu] = useState("users");
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  const _user = useAuth();

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

  const handleMenuSelect = (menu: string) => {
    setSelectedMenu(menu);
    fetchItems();
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
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-lg font-semibold">{user.name}</h2>
                          <p className="text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </li>
                  )}
                </div>
              ))}
            </ul>
          ) : (
            <ul>
              {filteredUsers.map((user, index) => (
                <div key={index}>
                  {user.email !== "admin@admin.com" && (
                    <li key={user.id} className="border-b border-gray-200 py-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-lg font-semibold">
                            Name: {user.name}
                          </h2>
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
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
