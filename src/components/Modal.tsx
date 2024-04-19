import { useState, useEffect, useRef } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";

const DropdownModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const _user = useAuth();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleProfileClick = () => {
    router.push("/user/profile");
  };
  const handleNewJobClick = () => {
    router.push("/admin/application");
  };

  const handleSignOut = async () => {
    signOut(auth);
    router.push("/");
  };

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="py-1">
        {_user?.email != "admin@admin.com" && (
          <button
            onClick={handleProfileClick}
            className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
          >
            Profile
          </button>
        )}
        {_user?.email == "admin@admin.com" && (
          <button
            onClick={handleNewJobClick}
            className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
          >
            New Job
          </button>
        )}
        <button
          onClick={handleSignOut}
          className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

const UserDropdown = () => {
  const user = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="text-gray-400 hover:text-gray-300 focus:outline-none"
      >
        {user?.email}
      </button>
      <DropdownModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default UserDropdown;
