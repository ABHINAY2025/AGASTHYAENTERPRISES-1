import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../components/firebase';
import { useNavigate } from 'react-router-dom';
import Loader from "../components/Loader";  // ✅ Import Loader

const LoginSignup: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const [loading, setLoading] = useState(false);      // ✅ Loader state
  const [error, setError] = useState("");             // ✅ Error message state
  const [success, setSuccess] = useState("");         // ✅ Success message state

  // ---------------- LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const password = e.target.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login error", error);
      setError( "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RESET PASSWORD ----------------
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email before resetting password.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setSuccess("Password reset email sent!");
    } catch (error) {
      console.error("Password reset error", error);
      setError(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400">

      {/* ===== LOADER OVERLAY ===== */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg relative">

        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-8">
          Login to Your Account
        </h2>

        {/* ===== ERROR MESSAGE ===== */}
        {error && (
          <p className="text-center text-red-600 font-semibold mb-3">
            {error}
          </p>
        )}

        {/* ===== SUCCESS MESSAGE ===== */}
        {success && (
          <p className="text-center text-green-600 font-semibold mb-3">
            {success}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 rounded-lg border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="p-3 rounded-lg border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            Login
          </button>

          <p className="text-center text-blue-600">
            Forgot your password?{" "}
            <button
              type="button"
              onClick={handleForgotPassword}
              className="font-semibold underline"
            >
              Reset Password
            </button>
          </p>

          {/* Reset email sent text */}
          {resetEmailSent && (
            <p className="text-center text-green-600 mt-2">
              Password reset email sent!
            </p>
          )}
        </form>

        <div className="flex items-center justify-between mt-4">
          <hr className="w-full border-blue-300" />
          <hr className="w-full border-blue-300" />
        </div>

      </div>
    </div>
  );
};

export default LoginSignup;
