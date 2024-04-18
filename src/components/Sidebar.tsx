import React from "react";

interface SidebarProps {
  selectedMenu: string;
  onSelectMenu: (menu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedMenu, onSelectMenu }) => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 flex-1">
        <h2 className="text-lg font-semibold mb-4">Admin Dashboard</h2>
        <ul className="space-y-2">
          <li
            className={`hover:bg-gray-700 rounded px-3 py-2 cursor-pointer ${
              selectedMenu === "users" ? "bg-gray-700" : ""
            }`}
            onClick={() => onSelectMenu("users")}
          >
            Users
          </li>
          <li
            className={`hover:bg-gray-700 rounded px-3 py-2 cursor-pointer ${
              selectedMenu === "applications" ? "bg-gray-700" : ""
            }`}
            onClick={() => onSelectMenu("applications")}
          >
            Applications
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
