import { motion as Motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
  Funnel,
  FunnelChart,
  LabelList,
} from "recharts";
import { useEffect, useState } from "react";

function DataAnalysis({ content, isDark = true }) {
  const [hoveredDriver, setHoveredDriver] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Prepare user growth chart data
  const userGrowthData = content.userGrowth.map((period) => {
    const rangeMatch = period.range.match(
      /(\d+(?:,\d+)?)\s*–\s*(\d+(?:,\d+)?)/,
    );
    const minUsers = rangeMatch
      ? parseInt(rangeMatch[1].replace(/,/g, "")) || 1000
      : 1000;
    const maxUsers = rangeMatch
      ? parseInt(rangeMatch[2].replace(/,/g, "")) || 3000
      : 3000;
    const avgUsers = (minUsers + maxUsers) / 2;

    return {
      period: period.period,
      users: Math.round(avgUsers),
      min: minUsers,
      max: maxUsers,
    };
  });

  // Adoption funnel data
  const funnelData = [
    { name: "Awareness", value: 100, fill: "#a78bfa" },
    { name: "Signup", value: 75, fill: "#c084fc" },
    { name: "First Play", value: 52, fill: "#e879f9" },
    { name: "Regular User", value: 35, fill: "#f472b6" },
    { name: "Paying User", value: 18, fill: "#fb7185" },
  ];

  // Token flow visualization
  const tokenFlowStages = [
    { stage: "In-Game Rewards", percentage: 40, color: "#10b981" },
    { stage: "Marketplace", percentage: 30, color: "#06b6d4" },
    { stage: "Staking", percentage: 20, color: "#8b5cf6" },
    { stage: "Governance", percentage: 10, color: "#f59e0b" },
  ];

  const chartConfig = {
    dark: {
      gridStroke: "rgba(148, 163, 184, 0.1)",
      textColor: "#cbd5e1",
      labelColor: "#94a3b8",
      lineColor: "#a78bfa",
      areaFill: "rgba(167, 139, 250, 0.1)",
    },
    light: {
      gridStroke: "rgba(226, 232, 240, 0.4)",
      textColor: "#1e293b",
      labelColor: "#64748b",
      lineColor: "#7c3aed",
      areaFill: "rgba(124, 58, 237, 0.08)",
    },
  };

  const config = isDark ? chartConfig.dark : chartConfig.light;
  const bgClass = isDark ? "bg-slate-900/70" : "bg-purple-50/50";
  const borderClass = isDark ? "border-purple-400/20" : "border-purple-300/40";
  const textClass = isDark ? "text-white" : "text-slate-900";
  const subtextClass = isDark ? "text-slate-300" : "text-slate-700";
  const labelClass = isDark ? "text-purple-300" : "text-purple-600";

  return (
    <section
      id="data-analysis"
      className={`py-16 sm:py-20 ${isDark ? "bg-slate-900" : "bg-white"}`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
          <h2 className={`text-3xl font-black sm:text-4xl ${textClass}`}>
            {content.title}
          </h2>

          <div
            className={`mt-6 rounded-lg border p-4 ${
              isDark
                ? "border-amber-500/20 bg-amber-500/10"
                : "border-amber-400/30 bg-amber-100/20"
            }`}
          >
            <p
              className={`text-sm ${
                isDark ? "text-amber-200" : "text-amber-700"
              }`}
            >
              {content.disclaimer}
            </p>
          </div>

          {/* Market Context Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`rounded-2xl border p-6 ${borderClass} ${bgClass}`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${labelClass}`}
              >
                Gaming Market
              </p>
              <p className={`mt-2 text-2xl font-bold ${labelClass}`}>
                {content.marketContext.gamingMarket}
              </p>
              <p className={`mt-1 text-xs ${subtextClass}`}>
                Annual Market Size
              </p>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`rounded-2xl border p-6 ${borderClass} ${bgClass}`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${labelClass}`}
              >
                Web3 Gaming
              </p>
              <p className={`mt-2 text-xl font-bold text-cyan-400`}>
                {content.marketContext.web3Gaming}
              </p>
              <p className={`mt-1 text-xs ${subtextClass}`}>
                High-Growth Potential
              </p>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={`rounded-2xl border p-6 ${borderClass} ${bgClass}`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${labelClass}`}
              >
                Key Demands
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {content.marketContext.demands.map((demand, index) => (
                  <span
                    key={index}
                    className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                      isDark
                        ? "bg-purple-500/20 text-purple-200"
                        : "bg-purple-200/40 text-purple-700"
                    }`}
                  >
                    {demand}
                  </span>
                ))}
              </div>
            </Motion.div>
          </div>

          {/* User Growth Chart */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className={`mt-8 rounded-2xl border p-6 ${borderClass} ${bgClass}`}
          >
            <h3 className={`text-lg font-bold mb-6 ${labelClass}`}>
              Projected User Growth
            </h3>
            <div className="w-full" style={{ minHeight: isMobile ? 230 : 300 }}>
              <ResponsiveContainer width="100%" height={isMobile ? 240 : 320}>
                <AreaChart
                  data={userGrowthData}
                  margin={{
                    top: 10,
                    right: isMobile ? 0 : 16,
                    left: isMobile ? -10 : 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={isDark ? "#10b981" : "#059669"}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={isDark ? "#10b981" : "#059669"}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={config.gridStroke}
                  />
                  <XAxis
                    dataKey="period"
                    stroke={config.labelColor}
                    style={{ fontSize: isMobile ? "10px" : "12px" }}
                  />
                  <YAxis
                    stroke={config.labelColor}
                    width={isMobile ? 32 : 48}
                    style={{ fontSize: isMobile ? "10px" : "12px" }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                      border: isDark
                        ? "1px solid rgba(168,85,247,0.3)"
                        : "1px solid rgba(168,85,247,0.4)",
                      borderRadius: "8px",
                      color: isDark ? "#cbd5e1" : "#1e293b",
                    }}
                    formatter={(value) => `${value.toLocaleString()} users`}
                    labelStyle={{ color: isDark ? "#cbd5e1" : "#1e293b" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke={isDark ? "#10b981" : "#059669"}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Motion.div>

          {/* Growth Drivers vs Retention Strategy */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Growth Drivers with interactive visualization */}
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45 }}
              className={`rounded-2xl border p-6 ${borderClass} ${bgClass}`}
            >
              <h3 className={`text-lg font-bold mb-6 ${labelClass}`}>
                Growth Drivers
              </h3>
              <div className="space-y-3">
                {content.growthDrivers.map((driver, index) => (
                  <Motion.div
                    key={index}
                    onHoverStart={() => setHoveredDriver(index)}
                    onHoverEnd={() => setHoveredDriver(null)}
                    whileHover={{ x: 8 }}
                    className={`rounded-lg p-4 transition-all ${
                      hoveredDriver === index
                        ? isDark
                          ? "bg-purple-500/20 border border-purple-400/50"
                          : "bg-purple-200/30 border border-purple-400/50"
                        : isDark
                          ? "bg-slate-800/50"
                          : "bg-slate-100/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-purple-400 shrink-0" />
                      <span className={`text-sm font-medium ${subtextClass}`}>
                        {driver}
                      </span>
                    </div>
                  </Motion.div>
                ))}
              </div>
            </Motion.div>

            {/* Retention Strategy */}
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45 }}
              className={`rounded-2xl border p-6 ${borderClass} ${bgClass}`}
            >
              <h3 className={`text-lg font-bold mb-6 ${labelClass}`}>
                Retention Strategy
              </h3>
              <div className="space-y-3">
                {content.retentionStrategy.map((strategy, index) => (
                  <Motion.div
                    key={index}
                    onHoverStart={() => setHoveredDriver(index + 10)}
                    onHoverEnd={() => setHoveredDriver(null)}
                    whileHover={{ x: 8 }}
                    className={`rounded-lg p-4 transition-all ${
                      hoveredDriver === index + 10
                        ? isDark
                          ? "bg-green-500/20 border border-green-400/50"
                          : "bg-green-200/30 border border-green-400/50"
                        : isDark
                          ? "bg-slate-800/50"
                          : "bg-slate-100/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-400 shrink-0" />
                      <span className={`text-sm font-medium ${subtextClass}`}>
                        {strategy}
                      </span>
                    </div>
                  </Motion.div>
                ))}
              </div>
            </Motion.div>
          </div>

          {/* Adoption Funnel */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className={`mt-8 rounded-2xl border p-6 ${borderClass} ${bgClass}`}
          >
            <h3 className={`text-lg font-bold mb-6 ${labelClass}`}>
              User Adoption Funnel
            </h3>
            {isMobile ? (
              <div className="space-y-3">
                {funnelData.map((stage) => (
                  <div key={stage.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className={`text-sm font-medium ${subtextClass}`}>
                        {stage.name}
                      </span>
                      <span className={`text-sm font-bold ${labelClass}`}>
                        {stage.value}%
                      </span>
                    </div>
                    <div
                      className={`h-2 rounded-full overflow-hidden ${
                        isDark ? "bg-slate-700" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${stage.value}%`, backgroundColor: stage.fill }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full" style={{ minHeight: 300 }}>
                <ResponsiveContainer width="100%" height={320}>
                  <FunnelChart
                    margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
                  >
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                        border: isDark
                          ? "1px solid rgba(168,85,247,0.3)"
                          : "1px solid rgba(168,85,247,0.4)",
                        borderRadius: "8px",
                        color: isDark ? "#cbd5e1" : "#1e293b",
                      }}
                      formatter={(value) => `${value}%`}
                    />
                    <Funnel
                      dataKey="value"
                      data={funnelData}
                      shape="smooth"
                      isAnimationActive={false}
                    >
                      <LabelList
                        position="right"
                        fill={config.textColor}
                        stroke="none"
                        formatter={(value, name) => `${name}: ${value}%`}
                      />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>
            )}
          </Motion.div>

          {/* Token Flow Visualization */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className={`mt-8 rounded-2xl border p-6 ${borderClass} ${bgClass}`}
          >
            <h3 className={`text-lg font-bold mb-6 ${labelClass}`}>
              Token Flow Distribution
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-4">
                {tokenFlowStages.map((stage, index) => (
                  <Motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${subtextClass}`}>
                        {stage.stage}
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: stage.color }}
                      >
                        {stage.percentage}%
                      </span>
                    </div>
                    <div
                      className={`h-2 rounded-full overflow-hidden ${
                        isDark ? "bg-slate-700" : "bg-slate-300"
                      }`}
                    >
                      <Motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stage.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        style={{ backgroundColor: stage.color }}
                        className="h-full rounded-full"
                      />
                    </div>
                  </Motion.div>
                ))}
              </div>
              <Motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`rounded-lg p-6 flex flex-col items-center justify-center min-h-45 relative ${
                  isDark
                    ? "bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700"
                    : "bg-linear-to-br from-slate-100/50 to-slate-50/50 border border-slate-300"
                }`}
              >
                {/* Flow Cycle Title */}
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-4 ${labelClass}`}
                >
                  System Flow
                </p>

                {/* Animated Flow Stages */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {["Earn", "Use", "Upgrade", "Circulate", "Re-enter"].map(
                    (stage, index) => (
                      <Motion.div
                        key={index}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        {/* Stage Badge */}
                        <Motion.div
                          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                            isDark
                              ? "bg-purple-500/30 text-purple-200 border border-purple-400/50"
                              : "bg-purple-200/50 text-purple-700 border border-purple-400/60"
                          }`}
                          whileHover={{
                            scale: 1.1,
                            boxShadow: isDark
                              ? "0 0 15px rgba(168, 85, 247, 0.4)"
                              : "0 0 15px rgba(139, 69, 193, 0.3)",
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {stage}
                        </Motion.div>

                        {/* Arrow between stages */}
                        {index < 4 && (
                          <Motion.div
                            className={`text-lg font-bold ${
                              isDark
                                ? "text-purple-400/60"
                                : "text-purple-500/60"
                            }`}
                            animate={{
                              x: [0, 3, 0],
                              opacity: [0.6, 1, 0.6],
                            }}
                            transition={{
                              duration: 2,
                              delay: index * 0.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            →
                          </Motion.div>
                        )}
                      </Motion.div>
                    ),
                  )}
                </div>

                {/* Cycle Indicator */}
                <Motion.div
                  className="mt-4 text-xs"
                  animate={{
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span
                    className={`${
                      isDark ? "text-purple-300/70" : "text-purple-600/70"
                    }`}
                  >
                    ↻ Continuous cycle
                  </span>
                </Motion.div>

                {/* Animated circular progress indicator */}
                <svg
                  className="absolute top-2 right-2 w-8 h-8"
                  viewBox="0 0 40 40"
                >
                  <Motion.circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    strokeWidth="1"
                    stroke={
                      isDark
                        ? "rgba(168, 85, 247, 0.2)"
                        : "rgba(139, 69, 193, 0.2)"
                    }
                  />
                  <Motion.circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    strokeWidth="2"
                    stroke={
                      isDark
                        ? "rgba(168, 85, 247, 0.6)"
                        : "rgba(139, 69, 193, 0.6)"
                    }
                    strokeDasharray="113"
                    strokeDashoffset={113}
                    animate={{ strokeDashoffset: [113, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </svg>
              </Motion.div>
            </div>
          </Motion.div>

          {/* Engagement & Additional Info */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`rounded-lg p-4 ${borderClass} ${
                isDark
                  ? "border-purple-400/20 bg-slate-800/50"
                  : "border-purple-300/40 bg-purple-50/50"
              }`}
            >
              <h4 className={`font-semibold mb-2 ${labelClass}`}>
                Engagement Loop
              </h4>
              <p className={`text-sm ${subtextClass}`}>
                {content.engagementLoop}
              </p>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`rounded-lg p-4 ${borderClass} ${
                isDark
                  ? "border-purple-500/20 bg-purple-500/10"
                  : "border-purple-400/30 bg-purple-100/20"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-purple-200" : "text-purple-700"
                }`}
              >
                {content.tokenNote}
              </p>
            </Motion.div>
          </div>

          <Motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className={`mt-6 rounded-lg p-4 ${borderClass} ${bgClass}`}
          >
            <h4 className={`font-semibold mb-2 ${labelClass}`}>
              Adoption Strategy
            </h4>
            <p className={`text-sm ${subtextClass}`}>
              {content.adoptionFunnel}
            </p>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
}

export default DataAnalysis;
