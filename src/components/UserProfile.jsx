import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Trophy, ArrowLeft } from "lucide-react";
import { logOut, getStoredAuth } from "../utils/firebaseAuth";
import { motion as Motion } from "framer-motion";

export default function UserProfile({ theme = "dark" }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // Get stored auth data from localStorage
    const authData = getStoredAuth();
    if (!authData || !authData.user) {
      navigate("/login");
      return;
    }
    setUser(authData.user);
    setLoading(false);
  }, [navigate]);

  const handleLogout = async () => {
    const result = await logOut();
    if (result.success) {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <section
        className={`py-20 sm:py-28 ${
          theme === "dark" ? "bg-slate-900" : "bg-white"
        }`}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className={theme === "dark" ? "text-slate-300" : "text-slate-600"}>
              Loading your profile...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section
      id="profile"
      className={`py-20 sm:py-28 ${
        theme === "dark" ? "bg-slate-900" : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className={`rounded-3xl border p-8 sm:p-10 ${
            theme === "dark"
              ? "border-purple-500/10 bg-slate-950/80"
              : "border-purple-200/40 bg-white/90"
          }`}
        >
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className={`inline-flex items-center gap-2 text-sm mb-6 hover:opacity-75 transition-opacity ${
              theme === "dark" ? "text-slate-400" : "text-slate-600"
            }`}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          {/* Profile Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-purple-500/20"
                    : "bg-purple-100"
                }`}
              >
                <User
                  size={32}
                  className={theme === "dark" ? "text-purple-300" : "text-purple-600"}
                />
              </div>
              <div>
                <h2
                  className={`text-2xl font-extrabold ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  {user.fullName || user.email}
                </h2>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {user.email}
                </p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {/* Points Card */}
            <Motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className={`rounded-lg border p-6 ${
                theme === "dark"
                  ? "border-purple-500/10 bg-slate-800/50"
                  : "border-purple-200/40 bg-purple-50/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Total Points
                  </p>
                  <p
                    className={`text-3xl font-bold mt-2 ${
                      theme === "dark" ? "text-purple-300" : "text-purple-600"
                    }`}
                  >
                    {points}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === "dark"
                      ? "bg-purple-500/20"
                      : "bg-purple-100"
                  }`}
                >
                  <Trophy
                    size={24}
                    className={theme === "dark" ? "text-purple-300" : "text-purple-600"}
                  />
                </div>
              </div>
            </Motion.div>

            {/* User ID Card */}
            <Motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className={`rounded-lg border p-6 ${
                theme === "dark"
                  ? "border-purple-500/10 bg-slate-800/50"
                  : "border-purple-200/40 bg-purple-50/30"
              }`}
            >
              <div>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  User ID
                </p>
                <p
                  className={`text-sm font-mono mt-2 break-all ${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {user.id}
                </p>
              </div>
            </Motion.div>
          </div>

          {/* Account Info */}
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className={`mt-8 rounded-lg border p-6 ${
              theme === "dark"
                ? "border-purple-500/10 bg-slate-800/50"
                : "border-purple-200/40 bg-purple-50/30"
            }`}
          >
            <h3
              className={`font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span
                  className={theme === "dark" ? "text-slate-400" : "text-slate-600"}
                >
                  Full Name:
                </span>
                <span
                  className={theme === "dark" ? "text-slate-200" : "text-slate-900"}
                >
                  {user.fullName || "Not set"}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={theme === "dark" ? "text-slate-400" : "text-slate-600"}
                >
                  Email:
                </span>
                <span
                  className={theme === "dark" ? "text-slate-200" : "text-slate-900"}
                >
                  {user.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={theme === "dark" ? "text-slate-400" : "text-slate-600"}
                >
                  Account Status:
                </span>
                <span className="text-emerald-400 font-medium">Active</span>
              </div>
            </div>
          </Motion.div>

          {/* Coming Soon Features */}
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className={`mt-8 rounded-lg border p-6 ${
              theme === "dark"
                ? "border-slate-700/50 bg-slate-800/30"
                : "border-slate-200/50 bg-slate-100/30"
            }`}
          >
            <h3
              className={`font-bold mb-3 ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              Coming Soon
            </h3>
            <ul
              className={`text-sm space-y-2 ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <li>• Referral tracking and rewards</li>
              <li>• Task completion history</li>
              <li>• Game leaderboard rankings</li>
              <li>• Withdrawal management</li>
              <li>• Wallet integration</li>
            </ul>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
}
