import React, { Suspense, useMemo, useState } from "react";
import ReferralCard from "./ReferralCard";
import PointsSummary from "./PointsSummary";
import TaskList from "./TaskList";
import ActivityHistory from "./ActivityHistory";
import LeaderboardCard from "./LeaderboardCard";
import {
  exampleUser,
  calcTotalPoints,
  copyToClipboard,
} from "../../utils/profileUtils";
import DailyLeaderboard from "../DailyLeaderboard";

export default function UserProfile({ initialUser }) {
  const [user, setUser] = useState(initialUser || exampleUser());
  const total = useMemo(
    () =>
      calcTotalPoints({
        taskPoints: user.taskPoints,
        referralPoints: user.referralPoints,
        gamePoints: user.gamePoints,
      }),
    [user],
  );

  function handleClaim(task) {
    // Mock claim: add task points to taskPoints and mark as claimed
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
    } catch (err) {
      console.error("Failed to copy referral link", err);
    }
  };

  return (
    <section id="profile" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-2 space-y-6">
            <div className="rounded-2xl border p-6 bg-slate-900/30">
              <div className="flex items-center gap-4">
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className="h-16 w-16 rounded-lg"
                />
                <div>
                  <div className="text-xl font-bold text-white">
                    {user.fullName}
                  </div>
                  <div className="text-sm text-slate-400">{user.email}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Wallet: {user.wallet ?? "-"}
                  </div>
                  <div className="text-xs text-slate-500">
                    Joined: {new Date(user.joinedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm text-slate-400">Total points</div>
                  <div className="text-2xl font-bold text-white">{total}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            </div>

            <div className="mt-4 rounded-2xl border p-6 bg-slate-900/20">
              <h3 className="text-lg font-semibold text-white">Tasks</h3>
              <p className="text-sm text-slate-400">
                Daily tasks, achievements and rewards
              </p>
              <div className="mt-4">
                <TaskList tasks={user.tasks} onClaim={handleClaim} />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border p-6 bg-slate-900/20">
              <h3 className="text-lg font-semibold text-white">
                Game Activity
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded p-3 bg-slate-900/40">
                  Games Played:{" "}
                  <div className="font-bold text-white">
                    {user.games.played}
                  </div>
                </div>
                <div className="rounded p-3 bg-slate-900/40">
                  Wins:{" "}
                  <div className="font-bold text-white">{user.games.wins}</div>
                </div>
                <div className="rounded p-3 bg-slate-900/40">
                  Losses:{" "}
                  <div className="font-bold text-white">
                    {user.games.losses}
                  </div>
                </div>
                <div className="rounded p-3 bg-slate-900/40">
                  Points from games:{" "}
                  <div className="font-bold text-emerald-300">
                    {user.games.pointsFromGames}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <ActivityHistory history={user.pointsHistory} />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border p-6 bg-slate-900/20">
              <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
              <p className="text-sm text-slate-400">
                Your rank and points compared to others
              </p>
              <div className="mt-4">
                <Suspense fallback={<div className="min-h-96" />}>
                  <DailyLeaderboard theme="dark" />
                </Suspense>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <LeaderboardCard
              rank={42}
              level={Math.floor(total / 1000)}
              totalPoints={total}
            />
            <div className="rounded-2xl border p-4 bg-slate-900/30">
              <h3 className="text-sm font-semibold text-purple-300">
                Quick Actions
              </h3>
              <div className="mt-3 space-y-2">
                <button className="w-full rounded bg-purple-600 px-3 py-2 text-sm font-semibold">
                  Invite friends
                </button>
                <button className="w-full rounded border px-3 py-2 text-sm">
                  View referral analytics
                </button>
                <button
                  className="w-full rounded bg-emerald-500 px-3 py-2 text-sm font-semibold"
                  onClick={handleCopyReferral}
                >
                  Copy referral link
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
