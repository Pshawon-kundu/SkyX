import React from "react";

export default function LeaderboardCard({
  rank = 42,
  level = 3,
  totalPoints = 0,
}) {
  return (
    <div className="rounded-2xl border p-4 bg-slate-900/30 text-sm">
      <h3 className="text-sm font-semibold text-purple-300">Leaderboard</h3>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-white text-lg font-bold">#{rank}</div>
          <div className="text-slate-400 text-xs">Level {level}</div>
        </div>
        <div className="text-right">
          <div className="text-emerald-300 font-bold">{totalPoints} pts</div>
          <div className="text-slate-400 text-xs">Your rank</div>
        </div>
      </div>
    </div>
  );
}
