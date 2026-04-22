import React from "react";
import { calcTotalPoints, calcLevelProgress } from "../../utils/profileUtils";

export default function PointsSummary({
  taskPoints = 0,
  referralPoints = 0,
  gamePoints = 0,
}) {
  const total = calcTotalPoints({ taskPoints, referralPoints, gamePoints });
  const { level, progress } = calcLevelProgress(total, 1000);

  return (
    <div className="rounded-2xl border p-4 bg-gradient-to-br from-slate-900/30 to-slate-800/20">
      <h3 className="text-sm font-semibold text-purple-300">
        Points & Rewards
      </h3>
      <div className="mt-4 flex items-start gap-4">
        <div>
          <p className="text-3xl font-bold text-white">{total}</p>
          <p className="text-xs text-slate-400 mt-1">Total points</p>
        </div>
        <div className="flex-1">
          <div className="text-sm text-slate-300">Breakdown</div>
          <div className="mt-2 flex gap-4 text-sm">
            <div className="rounded px-2 py-1 bg-slate-800/40">
              Tasks: {taskPoints}
            </div>
            <div className="rounded px-2 py-1 bg-slate-800/40">
              Referrals: {referralPoints}
            </div>
            <div className="rounded px-2 py-1 bg-slate-800/40">
              Games: {gamePoints}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div>Level</div>
              <div>Next</div>
            </div>
            <div className="mt-2 h-3 w-full rounded bg-slate-800">
              <div
                style={{ width: `${Math.round(progress * 100)}%` }}
                className="h-3 rounded bg-emerald-400"
              />
            </div>
            <div className="mt-2 text-xs text-slate-300">
              Level {level} • {Math.round(progress * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
