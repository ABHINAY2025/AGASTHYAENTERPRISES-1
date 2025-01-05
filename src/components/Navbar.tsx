import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../components/firebase'; // Adjust the path to your firebase.js
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to the login page on logout
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <nav className="mb-10 p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-black  text-3xl font-bold">AGASTHYA ENTERPRISES</h1>
        
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <span className="text-black  text-lg">Welcome, {user.email}!</span>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-customRed transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate('/login')} 
              className="px-4 py-2 bg-blue-700 text-black  rounded-lg hover:bg-blue-800 transition"
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
