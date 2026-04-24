import { motion as Motion } from "framer-motion";
import { BarChart2, PieChart, User, Star } from "lucide-react";

const stageColors = {
  intake: "bg-emerald-400",
  validate: "bg-amber-400",
  design: "bg-sky-400",
  launch: "bg-indigo-400",
  scale: "bg-lime-400",
};

function DashboardPreview({ theme = "dark" }) {
  const isDark = theme === "dark";
  const score = 82;
  const stage = { name: "Design", percent: 62 };
  const investors = [
    { name: "Alpha VC", share: "18%", color: "bg-indigo-500" },
    { name: "Beta Fund", share: "12%", color: "bg-rose-500" },
    { name: "Gamma Labs", share: "8%", color: "bg-emerald-500" },
  ];

  return (
    <section
      id="dashboard-preview"
      className={`py-16 sm:py-20 ${isDark ? "bg-slate-900/40" : "bg-white"}`}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 backdrop-blur-sm mb-4">
            <span className="text-xs font-semibold text-purple-200">
              For Operators
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Dashboard Preview
          </h3>
          <p
            className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
          >
            Mock UI — project snapshot for investor view
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`rounded-2xl p-6 ${isDark ? "bg-slate-900/60 border border-purple-700/30" : "bg-white shadow"}`}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(#7c3aed ${score * 3.6}deg, rgba(0,0,0,0.06) 0deg)`,
                }}
              >
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      {score}
                    </div>
                    <div
                      className={`text-xs ${isDark ? "text-slate-300" : "text-slate-500"}`}
                    >
                      /100
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  Project Score
                </div>
                <div
                  className={`text-xs mt-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  AI composite score from due diligence models
                </div>
              </div>
            </div>
          </div>

          <div
            className={`md:col-span-2 rounded-2xl p-6 ${isDark ? "bg-slate-900/60 border border-purple-700/30" : "bg-white shadow"}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div
                  className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  Stage Progress
                </div>
                <div
                  className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  {stage.name}
                </div>
              </div>
              <div
                className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {stage.percent}%
              </div>
            </div>

            <div className="w-full bg-slate-700/10 rounded-full h-3 overflow-hidden mb-6">
              <div
                className="h-3 rounded-full"
                style={{ width: `${stage.percent}%`, background: "#7c3aed" }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="col-span-1">
                <div
                  className={`text-xs font-medium ${isDark ? "text-white" : "text-slate-900"} mb-2`}
                >
                  Tokenomics Preview
                </div>
                <div className="rounded-lg p-3 bg-white/5">
                  <div className="flex items-center justify-between text-sm">
                    <div
                      className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                    >
                      Supply
                    </div>
                    <div
                      className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      1,000,000
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <div
                      className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                    >
                      Initial Price
                    </div>
                    <div
                      className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      $0.05
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <div
                  className={`text-xs font-medium ${isDark ? "text-white" : "text-slate-900"} mb-2`}
                >
                  Investor Snapshot
                </div>
                <div className="rounded-lg p-3 bg-white/5">
                  {investors.map((inv, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm mb-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full ${inv.color}`} />
                        <div
                          className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                        >
                          {inv.name}
                        </div>
                      </div>
                      <div
                        className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {inv.share}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-1">
                <div
                  className={`text-xs font-medium ${isDark ? "text-white" : "text-slate-900"} mb-2`}
                >
                  Quick Metrics
                </div>
                <div className="rounded-lg p-3 bg-white/5">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div
                      className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                    >
                      MC (est.)
                    </div>
                    <div
                      className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      $50k
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div
                      className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                    >
                      Launch Date
                    </div>
                    <div
                      className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      Apr 25
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operator Features */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-700/30">
          <div
            className={`p-4 rounded-lg ${isDark ? "bg-slate-900/40" : "bg-purple-50/40"}`}
          >
            <div
              className={`text-sm font-semibold mb-1 ${isDark ? "text-purple-300" : "text-purple-700"}`}
            >
              ✓ Review and approve projects
            </div>
            <p
              className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Full control over project pipeline
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${isDark ? "bg-slate-900/40" : "bg-purple-50/40"}`}
          >
            <div
              className={`text-sm font-semibold mb-1 ${isDark ? "text-purple-300" : "text-purple-700"}`}
            >
              ✓ Track revenue and activity
            </div>
            <p
              className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Real-time analytics and reporting
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${isDark ? "bg-slate-900/40" : "bg-purple-50/40"}`}
          >
            <div
              className={`text-sm font-semibold mb-1 ${isDark ? "text-purple-300" : "text-purple-700"}`}
            >
              ✓ Manage users and ecosystem growth
            </div>
            <p
              className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Scale your platform with ease
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;
