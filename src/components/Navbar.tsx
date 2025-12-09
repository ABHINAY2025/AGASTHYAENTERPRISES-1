import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../components/firebase";
import { useNavigate } from "react-router-dom";

import Logo from "../components/Agasthya Enterprises (1).png"; // ✅ adjust path as needed

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
        
        {/* ✅ LEFT → LOGO + BRAND */}
        <div className="flex items-center gap-3">
          
          {/* ✅ LOGO */}
          <img 
            src={Logo}
            alt="Agasthya Logo"
            className="h-10 w-auto object-contain"
          />

          {/* ✅ BRAND NAME WITH COLOR SCHEME */}
          <h1 className="text-2xl font-extrabold tracking-wide">
            <span className="text-[#C5161C]">AGASTHYA</span>{" "}
            <span className="text-[#303295]">ENTERPRISES</span>
          </h1>
        </div>

        {/* ✅ RIGHT → USER + AUTH ACTION */}
        <div className="flex items-center gap-5">
          {user ? (
            <>
              <span className="text-gray-800 text-sm font-medium">
                Welcome,
                <span className="ml-1 text-blue-700">
                  {user.email}
                </span>
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-[#C5161C] text-white hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg bg-[#303295] text-white hover:bg-blue-800 transition"
            >
              Login
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
