import React, { useState } from "react";
import { Copy } from "lucide-react";
import { copyToClipboard } from "../../utils/profileUtils";

export default function ReferralCard({
  referralCode,
  baseUrl = window?.location?.origin || "",
  stats = {},
}) {
  const [copied, setCopied] = useState(false);
  const link = `${baseUrl}/?ref=${encodeURIComponent(referralCode)}`;

  const handleCopy = async () => {
    try {
      await copyToClipboard(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="rounded-2xl border p-4 bg-gradient-to-br from-slate-900/40 to-slate-800/30">
      <h3 className="text-sm font-semibold text-purple-300">Referral</h3>
      <div className="mt-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-mono text-white">{referralCode}</p>
          <p className="text-xs text-slate-400 mt-1">
            Share this link to invite friends
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-3 py-1 text-sm font-medium"
          >
            <Copy size={14} /> {copied ? "Copied" : "Copy"}
          </button>
          <div className="text-xs text-slate-400 text-right">
            <div>
              Referrals:{" "}
              <span className="font-semibold text-white">
                {stats.referrals ?? 0}
              </span>
            </div>
            <div>
              Successful:{" "}
              <span className="font-semibold text-white">
                {stats.successful ?? 0}
              </span>
            </div>
            <div>
              Earned:{" "}
              <span className="font-semibold text-emerald-300">
                {stats.referralPoints ?? 0} pts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
