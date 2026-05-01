import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Home, Loader } from "lucide-react";
import UserProfile from "../components/profile/UserProfile";
import { getStoredAuth, logOut } from "../utils/firebaseAuth";
import { exampleUser, calcTotalPoints } from "../utils/profileUtils";

export default function ProfilePage({ theme = "dark", onThemeToggle }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const storedAuth = getStoredAuth();
        if (!storedAuth?.user) {
          navigate("/login", { replace: true });
          return;
        }

        const API_BASE = (
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
        ).replace(/\/$/, "");

        // Try to fetch user profile from backend, but don't fail if unavailable
        try {
          const response = await fetch(`${API_BASE}/api/users/profile`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedAuth.token}`,
            },
          });

          if (response.ok) {
            const profileData = await response.json();
            setUser(profileData);
            return;
          }
        } catch (backendErr) {
          console.warn("Backend unavailable, using fallback data", backendErr);
        }

        // Fallback to example/stored user data when backend is unavailable
        const userData = {
          ...exampleUser(),
          ...storedAuth.user,
        };
        setUser(userData);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await logOut();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to logout");
    }
  }, [navigate]);

  const handleGoHome = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-purple-400 animate-spin" />
          <p className="text-slate-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo / Home Button */}
            <button
              onClick={handleGoHome}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition">
                <span className="text-white font-bold text-sm">SKX</span>
              </div>
              <span className="text-white font-bold hidden sm:inline">
                SkyX
              </span>
            </button>

            {/* Profile Title */}
            <h1 className="text-white font-bold text-lg">
              {user?.fullName || "User"} Profile
            </h1>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleGoHome}
                className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white"
                title="Back to Home"
              >
                <Home size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-900/30 rounded-lg transition text-slate-300 hover:text-red-400"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 sm:py-8">
        {user && <UserProfile initialUser={user} />}
      </main>
    </div>
  );
}
