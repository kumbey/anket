"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from "@/components/Sidebar";
import { useRecoilValue } from "recoil";
import { isLoggedIn } from "@/atoms/atom";
import Header from "@/components/Header";
import useAuth from "@/hooks/useAuth";

const AdminDashboard: React.FC = () => {
  const _user = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const isLogged = useRecoilValue(isLoggedIn);
  const [selectedMenu, setSelectedMenu] = useState("users");

  const handleMenuSelect = (menu: string) => {
    setSelectedMenu(menu);
    if (menu === "users") {
      fetchUsers();
    } else {
      fetchUsers();
    }
  };

  const fetchUsers = async () => {
    const getUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);

        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return usersData;
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    };

    getUsers()
      .then((users) => {
        setUsers(users);
      })
      .catch((error) => {
        console.error("Error getting users:", error);
      });
  };

  const fetchApplications = async () => {
    const getApplications = async () => {
      try {
        const usersCollection = collection(db, "applications");
        const usersSnapshot = await getDocs(usersCollection);

        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return usersData;
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    };

    getApplications()
      .then((users) => {
        setUsers(users);
      })
      .catch((error) => {
        console.error("Error getting users:", error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      {isLogged && <Header />}
      <div className="flex">
        <Sidebar selectedMenu={selectedMenu} onSelectMenu={handleMenuSelect} />
        {selectedMenu === "users" ? (
          <div className="flex-1 p-4">
            <h1 className="text-2xl font-semibold mb-4">Users</h1>
            <ul>
              {users.map((user, index) => (
                <li key={index}>{user.email}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex-1 p-4">
            <h1 className="text-2xl font-semibold mb-4">Applications</h1>
            <ul>
              {users.map((user, index) => (
                <li key={index}>{user.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
