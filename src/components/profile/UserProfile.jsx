import React, { Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Zap,
  Users,
  TrendingUp,
  Award,
  Target,
  Copy,
  CheckCircle,
} from "lucide-react";
import ReferralCard from "./ReferralCard";
import PointsSummary from "./PointsSummary";
import TaskList from "./TaskList";
import ActivityHistory from "./ActivityHistory";
import LeaderboardCard from "./LeaderboardCard";
import {
  exampleUser,
  calcTotalPoints,
  copyToClipboard,
  calcLevelProgress,
} from "../../utils/profileUtils";
import DailyLeaderboard from "../DailyLeaderboard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function UserProfile({ initialUser }) {
  const [user, setUser] = useState(initialUser || exampleUser());
  const [copiedReferral, setCopiedReferral] = useState(false);
  const total = useMemo(
    () =>
      calcTotalPoints({
        taskPoints: user.taskPoints,
        referralPoints: user.referralPoints,
        gamePoints: user.gamePoints,
      }),
    [user],
  );

  const levelProgress = useMemo(() => calcLevelProgress(total), [total]);

  function handleClaim(task) {
    setUser((prev) => {
      const nextTasks = prev.tasks.map((t) =>
        t.id === task.id ? { ...t, status: "claimed" } : t,
      );
      return {
        ...prev,
        tasks: nextTasks,
        taskPoints: prev.taskPoints + task.points,
        pointsHistory: [
          {
            id: `h_${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            source: task.title,
            points: task.points,
          },
          ...prev.pointsHistory,
        ],
      };
    });
  }

  const handleCopyReferral = async () => {
    try {
      await copyToClipboard(
        `${window.location.origin}/?ref=${encodeURIComponent(user.referralCode)}`,
      );
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    } catch (err) {
      console.error("Failed to copy referral link", err);
    }
  };

  return (
    <motion.section
      id="profile"
      className="py-8 sm:py-12 lg:py-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===== SECTION 1: USER INFO HEADER ===== */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900/80 via-purple-900/40 to-slate-900/80 p-6 sm:p-8 mb-8 shadow-lg shadow-purple-500/10"
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl border border-purple-500/50 object-cover shadow-lg"
              />
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {user.fullName}
              </h1>
              <p className="text-sm text-slate-400 mb-3">{user.email}</p>

              {/* Level & Progress */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-slate-300">
                    Level {levelProgress.level}
                  </span>
                </div>
                <div className="w-full max-w-xs h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${levelProgress.progress * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {Math.floor(levelProgress.progress * 100)}% to next level
                </p>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded bg-slate-800/50 p-2">
                  <p className="text-slate-400">Wallet</p>
                  <p className="text-white font-semibold">
                    {user.wallet ?? "-"}
                  </p>
                </div>
                <div className="rounded bg-slate-800/50 p-2">
                  <p className="text-slate-400">Joined</p>
                  <p className="text-white font-semibold">
                    {new Date(user.joinedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="rounded bg-slate-800/50 p-2">
                  <p className="text-slate-400">Status</p>
                  <p className="text-emerald-400 font-semibold">Active</p>
                </div>
                <div className="rounded bg-slate-800/50 p-2">
                  <p className="text-slate-400">Rank</p>
                  <p className="text-purple-400 font-semibold">#42</p>
                </div>
              </div>
            </div>

            {/* Total Points Card */}
            <motion.div
              variants={itemVariants}
              className="flex-shrink-0 sm:text-right"
            >
              <p className="text-sm text-slate-400 mb-1">Total Points</p>
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {total.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                🔥 {(Math.random() * 50 + 10).toFixed(0)} pts this week
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ===== SECTION 2: POINTS BREAKDOWN (3 Cards) ===== */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {/* Task Points */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 hover:border-purple-500/50 transition">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                Task Points
              </h3>
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                {user.tasks?.filter((t) => t.status === "claimed").length || 0}{" "}
                claimed
              </span>
            </div>
            <p className="text-3xl font-bold text-white">
              {user.taskPoints.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              from daily tasks & achievements
            </p>
          </div>

          {/* Referral Points */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 hover:border-purple-500/50 transition">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Referral Points
              </h3>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">
                {user.referrals} referrals
              </span>
            </div>
            <p className="text-3xl font-bold text-white">
              {user.referralPoints.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              from successful referrals
            </p>
          </div>

          {/* Game Points */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 hover:border-purple-500/50 transition">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Game Points
              </h3>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">
                {user.games?.wins || 0} wins
              </span>
            </div>
            <p className="text-3xl font-bold text-white">
              {user.gamePoints.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-2">from games won</p>
          </div>
        </motion.div>

        {/* ===== SECTION 3: REFERRAL & POINTS SUMMARY ===== */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <ReferralCard
            referralCode={user.referralCode}
            stats={{
              referrals: user.referrals,
              successful: user.successfulReferrals,
              referralPoints: user.referralPoints,
            }}
          />
          <PointsSummary
            taskPoints={user.taskPoints}
            referralPoints={user.referralPoints}
            gamePoints={user.gamePoints}
          />
        </motion.div>

        {/* ===== SECTION 4: TASKS & ACHIEVEMENTS ===== */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900/80 via-purple-900/40 to-slate-900/80 p-6 sm:p-8 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Daily Tasks & Achievements
            </h2>
          </div>
          <p className="text-sm text-slate-400 mb-6">
            Complete tasks to earn points and level up
          </p>
          <Suspense fallback={<div>Loading tasks...</div>}>
            <TaskList tasks={user.tasks} onClaim={handleClaim} />
          </Suspense>
        </motion.div>

        {/* ===== SECTION 5: GAME ACTIVITY ===== */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900/80 via-purple-900/40 to-slate-900/80 p-6 sm:p-8 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Game Activity
            </h2>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-lg bg-slate-900/50 border border-slate-700/50 p-4">
              <p className="text-xs text-slate-400 mb-2">Games Played</p>
              <p className="text-2xl font-bold text-white">
                {user.games?.played || 0}
              </p>
            </div>
            <div className="rounded-lg bg-slate-900/50 border border-slate-700/50 p-4">
              <p className="text-xs text-slate-400 mb-2">Wins</p>
              <p className="text-2xl font-bold text-emerald-400">
                {user.games?.wins || 0}
              </p>
            </div>
            <div className="rounded-lg bg-slate-900/50 border border-slate-700/50 p-4">
              <p className="text-xs text-slate-400 mb-2">Losses</p>
              <p className="text-2xl font-bold text-red-400">
                {user.games?.losses || 0}
              </p>
            </div>
            <div className="rounded-lg bg-slate-900/50 border border-slate-700/50 p-4">
              <p className="text-xs text-slate-400 mb-2">Win Rate</p>
              <p className="text-2xl font-bold text-blue-400">
                {user.games?.played
                  ? Math.round((user.games.wins / user.games.played) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>

          {/* Activity History */}
          <Suspense fallback={<div>Loading activity...</div>}>
            <ActivityHistory history={user.pointsHistory} />
          </Suspense>
        </motion.div>

        {/* ===== SECTION 6: LEADERBOARD ===== */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Leaderboard
            </h2>
          </div>
          <Suspense fallback={<div>Loading leaderboard...</div>}>
            <DailyLeaderboard users={user.leaderboard} />
          </Suspense>
        </motion.div>
      </div>
    </motion.section>
  );
}
