import React from "react";

export default function ActivityHistory({ history = [] }) {
  if (!history || history.length === 0) {
    return <div className="text-sm text-slate-400">No recent activity.</div>;
  }

  return (
    <div className="rounded-2xl border p-4 bg-slate-900/30">
      <h3 className="text-sm font-semibold text-purple-300">Recent Activity</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {history.map((h) => (
          <li key={h.id} className="flex items-center justify-between">
            <div>
              <div className="text-white">{h.source}</div>
              <div className="text-slate-400 text-xs">{h.date}</div>
            </div>
            <div className="text-emerald-300 font-mono">+{h.points}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
