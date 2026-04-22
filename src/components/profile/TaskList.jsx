import React from "react";
import { formatTaskStatus } from "../../utils/profileUtils";

function TaskCard({ task, onClaim }) {
  const status = formatTaskStatus(task.status);
  return (
    <div className="rounded-lg border p-3 bg-slate-900/40">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-white">{task.title}</h4>
          <p className="text-xs text-slate-400 mt-1">{task.description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-mono text-white">{task.points} pts</div>
          <div className="text-xs mt-1">{status}</div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        {status === "Completed" && (
          <button
            onClick={() => onClaim(task)}
            className="rounded bg-emerald-500 px-3 py-1 text-sm font-semibold"
          >
            Claim
          </button>
        )}
      </div>
    </div>
  );
}

export default function TaskList({ tasks = [], onClaim = () => {} }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-sm text-slate-400">No tasks available yet.</div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} onClaim={onClaim} />
      ))}
    </div>
  );
}
