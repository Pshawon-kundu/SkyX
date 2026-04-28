import { motion as Motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { animations } from "../data/animations";

const DailyLeaderboard = ({ theme }) => {
  const isDark = theme === "dark";

  // Leaderboard state - fetched from backend
  const [leaderboardData, setLeaderboardData] = useState([]);

  const [dailyStats, setDailyStats] = useState({
    newRegistrations: 24,
    dailyActiveUsers: 156,
    totalRewards: "4,280",
  });

  const [timeRemaining, setTimeRemaining] = useState({
    hours: 18,
    minutes: 42,
  });

  // Compute countdown to next UTC midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const next = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() + 1,
          0,
          0,
          0,
        ),
      );
      const diff = next.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining({ hours, minutes });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, []);

  // Poll leaderboard from backend and update every 15 seconds
  useEffect(() => {
    let mounted = true;

    const fetchLeaderboard = async () => {
      try {
        const API_BASE = import.meta.env.DEV ? "http://localhost:5000" : "";
        const res = await fetch(`${API_BASE}/api/leaderboard?limit=5`);
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        const mapped = (json.data || []).map((u, i) => ({
          rank: i + 1,
          name: u.name,
          points: u.points,
          avatar:
            u.avatar ||
            (u.name || "")
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("")
              .toUpperCase(),
          change: "+" + Math.floor(Math.random() * 400),
        }));
        setLeaderboardData(mapped);
      } catch (e) {
        // ignore
      }
    };

    fetchLeaderboard();
    const poll = setInterval(fetchLeaderboard, 15000);
    return () => {
      mounted = false;
      clearInterval(poll);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  const medalColors = {
    1: "from-yellow-400 to-yellow-600",
    2: "from-gray-300 to-gray-500",
    3: "from-orange-400 to-orange-600",
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <section
      id="daily-leaderboard"
      className={`relative py-20 sm:py-28 overflow-hidden ${
        isDark
          ? "bg-gradient-to-b from-slate-900/30 to-slate-950/50"
          : "bg-gradient-to-b from-slate-50 to-white/50"
      }`}
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 right-0 w-96 h-96 ${
            isDark ? "bg-purple-500/10" : "bg-purple-400/5"
          } blur-3xl rounded-full`}
        />
        <div
          className={`absolute bottom-20 left-0 w-96 h-96 ${
            isDark ? "bg-pink-500/10" : "bg-pink-400/5"
          } blur-3xl rounded-full`}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={animations.viewport}
          className="text-center mb-12 sm:mb-16"
        >
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Daily Champion Leaderboard
          </h2>
          <p
            className={`text-lg ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Top performers reset daily • Join the race for top rewards
          </p>
        </Motion.div>

        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Daily Stats Cards */}
          {[
            {
              label: "New Registrations",
              value: dailyStats.newRegistrations,
              icon: "📝",
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Active Today",
              value: dailyStats.dailyActiveUsers,
              icon: "👥",
              color: "from-purple-500 to-pink-500",
            },
            {
              label: "Total Rewards",
              value: dailyStats.totalRewards + " pts",
              icon: "⭐",
              color: "from-yellow-400 to-orange-500",
            },
          ].map((stat, idx) => (
            <Motion.div
              key={idx}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              custom={idx}
              viewport={animations.viewport}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className={`relative overflow-hidden rounded-xl border ${
                isDark
                  ? "border-slate-700/50 bg-slate-800/40"
                  : "border-slate-200/50 bg-white/40"
              } p-6 backdrop-blur-sm group`}
            >
              {/* Gradient overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{stat.icon}</span>
                  <div
                    className={`text-sm px-3 py-1 rounded-full font-semibold ${
                      isDark
                        ? "bg-slate-700/50 text-emerald-400"
                        : "bg-slate-100 text-emerald-600"
                    }`}
                  >
                    Today
                  </div>
                </div>
                <div
                  className={`text-3xl font-bold mb-1 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {stat.value}
                </div>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {stat.label}
                </p>
              </div>
            </Motion.div>
          ))}
        </div>

        {/* Main Leaderboard */}
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={animations.viewport}
          className={`mx-auto max-w-4xl rounded-2xl border ${
            isDark
              ? "border-slate-700/50 bg-slate-800/40"
              : "border-slate-200/50 bg-white/40"
          } backdrop-blur-sm overflow-hidden`}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b ${
              isDark
                ? "border-slate-700/30 bg-slate-900/30"
                : "border-slate-200/30 bg-slate-50/30"
            } flex items-center justify-between`}
          >
            <h3
              className={`text-lg font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Top 5 Today
            </h3>
            <div
              className={`flex items-center gap-2 text-sm font-semibold ${
                isDark ? "text-purple-400" : "text-purple-600"
              }`}
            >
              <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              Resets in {String(timeRemaining.hours).padStart(2, "0")}:
              {String(timeRemaining.minutes).padStart(2, "0")}
            </div>
          </div>

          {/* Leaderboard List */}
          <div className="divide-y divide-slate-700/20">
            <AnimatePresence>
              {leaderboardData.map((user, idx) => (
                <Motion.div
                  key={user.rank || user.name || idx}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={animations.viewport}
                  custom={idx}
                  whileHover={{
                    backgroundColor: isDark
                      ? "rgba(51, 65, 85, 0.3)"
                      : "rgba(241, 245, 249, 0.5)",
                    transition: { duration: 0.2 },
                  }}
                  className="px-6 py-4 group"
                >
                  <div className="flex items-center justify-between">
                    {/* Rank & User Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex items-center justify-center">
                        {getMedalIcon(user.rank) ? (
                          <span className="text-2xl">
                            {getMedalIcon(user.rank)}
                          </span>
                        ) : (
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              isDark
                                ? "bg-slate-700 text-slate-300"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            #{user.rank}
                          </div>
                        )}
                      </div>

                      {/* Avatar & Name */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                            user.rank === 1
                              ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900"
                              : user.rank === 2
                                ? "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900"
                                : user.rank === 3
                                  ? "bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900"
                                  : isDark
                                    ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                                    : "bg-gradient-to-br from-purple-400 to-pink-400 text-white"
                          }`}
                        >
                          {user.avatar}
                        </div>
                        <div className="min-w-0">
                          <div
                            className={`font-semibold truncate ${
                              isDark ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Points & Change */}
                    <div className="flex items-center gap-6 ml-4">
                      <div className="text-right">
                        <div
                          className={`text-xl font-bold ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {user.points}
                        </div>
                        <div className="text-xs text-emerald-500 font-semibold">
                          {user.change}
                        </div>
                      </div>

                      {/* Sparkle animation for top 3 */}
                      {user.rank <= 3 && (
                        <Motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="text-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✨
                        </Motion.div>
                      )}
                    </div>
                  </div>
                </Motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Footer CTA */}
          <div
            className={`px-6 py-4 border-t ${
              isDark
                ? "border-slate-700/30 bg-slate-900/20"
                : "border-slate-200/30 bg-slate-50/20"
            } text-center`}
          >
            <button
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isDark
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              }`}
            >
              Join the Race
            </button>
          </div>
        </Motion.div>

        {/* Info Bar */}
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={animations.viewport}
          className={`mt-8 p-4 rounded-lg border ${
            isDark
              ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
              : "border-blue-400/30 bg-blue-50/50 text-blue-700"
          }`}
        >
          <p className="text-sm font-medium">
            💡 <strong>Tip:</strong> Leaderboard resets daily at 00:00 UTC.
            Complete tasks, refer friends, and play games to climb the rankings
            and earn exclusive daily rewards!
          </p>
        </Motion.div>
      </div>
    </section>
  );
};

export default DailyLeaderboard;
