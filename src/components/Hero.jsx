import { motion as Motion } from "framer-motion";
import { useState, useEffect } from "react";
import { animations } from "../data/animations";
import Countdown from "./Countdown";
import AirdropAnimation from "./AirdropAnimation";
import { TrendingUp, Zap, Shield } from "lucide-react";

const pulseMetrics = [
  {
    label: "Gaming Market",
    value: "$200B+",
    duration: 2.8,
    icon: TrendingUp,
    color: "from-emerald-500 to-cyan-500",
  },
  {
    label: "Launch Date",
    value: "April 25",
    duration: 2.2,
    icon: Zap,
    color: "from-purple-500 to-pink-500",
  },
  {
    label: "Early Access",
    value: "Limited",
    duration: 3.1,
    icon: Shield,
    color: "from-amber-500 to-orange-500",
  },
];

const heroNodes = [
  { id: "h1", x: 12, y: 18 },
  { id: "h2", x: 31, y: 13 },
  { id: "h3", x: 50, y: 18 },
  { id: "h4", x: 69, y: 13 },
  { id: "h5", x: 88, y: 18 },
  { id: "h6", x: 17, y: 50 },
  { id: "h7", x: 36, y: 50 },
  { id: "h8", x: 50, y: 50 },
  { id: "h9", x: 64, y: 50 },
  { id: "h10", x: 83, y: 50 },
  { id: "h11", x: 12, y: 82 },
  { id: "h12", x: 31, y: 87 },
  { id: "h13", x: 50, y: 82 },
  { id: "h14", x: 69, y: 87 },
  { id: "h15", x: 88, y: 82 },
];

const heroLinks = [
  ["h1", "h2"],
  ["h2", "h3"],
  ["h3", "h4"],
  ["h4", "h5"],
  ["h1", "h6"],
  ["h2", "h7"],
  ["h3", "h8"],
  ["h4", "h9"],
  ["h5", "h10"],
  ["h6", "h7"],
  ["h7", "h8"],
  ["h8", "h9"],
  ["h9", "h10"],
  ["h6", "h11"],
  ["h7", "h12"],
  ["h8", "h13"],
  ["h9", "h14"],
  ["h10", "h15"],
  ["h11", "h12"],
  ["h12", "h13"],
  ["h13", "h14"],
  ["h14", "h15"],
];

const heroNodeMap = Object.fromEntries(
  heroNodes.map((node) => [node.id, node]),
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Dynamic rotating text variants
const swappingWordVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function Hero({ brand, content, theme }) {
  const [swappingIndex, setSwappingIndex] = useState(0);
  
  // Dynamic word variations for swapping effect
  const dynamicWords = [
    "Smarter Gaming Economy",
    "Next-Gen Gaming Universe", 
    "PlayToEarn Revolution",
    "Decentralized Gaming",
  ];

  const isDark = theme === "dark";
  
  // Rotate through dynamic words every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSwappingIndex((prev) => (prev + 1) % dynamicWords.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const heroBackdrop = !isDark
    ? "bg-[radial-gradient(circle_at_15%_20%,rgba(168,85,247,0.2),transparent_38%),radial-gradient(circle_at_82%_16%,rgba(139,69,193,0.18),transparent_42%),linear-gradient(180deg,#f6fbff_0%,#edf6ff_55%,#e2f3ff_100%)]"
    : "bg-[radial-gradient(circle_at_15%_20%,rgba(168,85,247,0.18),transparent_40%),radial-gradient(circle_at_80%_18%,rgba(139,69,193,0.12),transparent_45%),linear-gradient(180deg,#020617_0%,#020617_60%,#030A15_100%)]";

  const innerSurface = isDark
    ? "bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950/40"
    : "bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100";

  const lineStroke = isDark ? "rgba(168,85,247,0.55)" : "rgba(139,69,193,0.72)";
  const nodeClass = isDark
    ? "border-purple-200/65 bg-purple-300/45 shadow-[0_0_14px_rgba(168,85,247,0.85)]"
    : "border-purple-700/55 bg-purple-500/65 shadow-[0_0_10px_rgba(139,69,193,0.5)]";

  const titleWords = content.title.split(" ");

  return (
    <section id="home" className="relative overflow-hidden pt-14 sm:pt-20">
      <div
        className={`pointer-events-none absolute inset-0 -z-10 ${heroBackdrop}`}
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Motion.div
          initial="hidden"
          whileInView="visible"
          viewport={animations.viewport}
          transition={{ staggerChildren: 0.15, delayChildren: 0.1 }}
          className="space-y-7"
        >
          <Motion.p
            variants={animations.fadeInUp}
            className="inline-flex rounded-full border border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200 backdrop-blur-sm"
            whileHover={{ scale: 1.05, borderColor: "rgba(168,85,247,0.6)" }}
          >
            ✨ {brand.name} • {brand.ticker}
          </Motion.p>

          <Motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="space-y-3"
          >
            {/* Main Title with Word Animation */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Motion.span
                variants={wordVariants}
                className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl text-white"
              >
                Build,
              </Motion.span>
              <Motion.span
                variants={wordVariants}
                className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl text-white"
              >
                Play,
              </Motion.span>
              <Motion.span
                variants={wordVariants}
                className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl text-white"
              >
                and
              </Motion.span>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Motion.span
                variants={wordVariants}
                className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl text-white"
              >
                Earn
              </Motion.span>
              <Motion.span
                variants={wordVariants}
                className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl text-white"
              >
                in
              </Motion.span>
              <Motion.span
                variants={wordVariants}
                className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl text-white"
              >
                a
              </Motion.span>
            </div>

            {/* Swapping Dynamic Text */}
            <div className="relative h-20 sm:h-24 lg:h-28 overflow-hidden">
              <Motion.div
                key={swappingIndex}
                initial="enter"
                animate="center"
                exit="exit"
                variants={swappingWordVariants}
                transition={{
                  y: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                }}
                className="absolute inset-0"
              >
                <span className="inline-block text-4xl font-black leading-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse">
                  {dynamicWords[swappingIndex]}
                </span>
              </Motion.div>
            </div>
          </Motion.div>
          <Motion.div
            variants={animations.fadeInUp}
            className="h-1.5 w-40 overflow-hidden rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20"
          >
            <Motion.span
              className="block h-full w-20 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
              animate={{
                x: [-28, 118, -28],
                boxShadow: [
                  "0 0 0 rgba(168, 85, 247, 0)",
                  "0 0 24px rgba(236, 72, 153, 0.6)",
                  "0 0 0 rgba(168, 85, 247, 0)",
                ],
              }}
              transition={{
                duration: 3.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </Motion.div>

          <Motion.div
            variants={animations.fadeInUp}
            className={`space-y-2 max-w-xl text-base leading-relaxed sm:text-lg ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            <p>{content.subtitle}</p>
          </Motion.div>

          <Motion.div
            variants={animations.fadeInUp}
            className={`max-w-xl rounded-2xl border p-5 sm:p-6 backdrop-blur-md ${
              isDark
                ? "border-purple-400/25 bg-gradient-to-br from-slate-900/80 via-purple-900/40 to-slate-950/80"
                : "border-purple-300/30 bg-gradient-to-br from-white/60 via-purple-50/40 to-white/50"
            }`}
            whileHover={{ borderColor: "rgba(168,85,247,0.5)", scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p
                  className={`text-xs font-bold uppercase tracking-[0.2em] ${
                    isDark ? "text-purple-300" : "text-purple-600"
                  }`}
                >
                  📊 Live Network Feed
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-2 text-xs font-semibold ${
                  isDark ? "text-emerald-300" : "text-emerald-600"
                }`}
              >
                <Motion.span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isDark ? "bg-emerald-400" : "bg-emerald-500"
                  }`}
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      "0 0 0 rgba(16, 185, 129, 0)",
                      "0 0 12px rgba(16, 185, 129, 0.8)",
                      "0 0 0 rgba(16, 185, 129, 0)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                Active
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {pulseMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <Motion.div
                    key={metric.label}
                    className={`rounded-xl border p-3 ${
                      isDark
                        ? "border-purple-400/15 bg-slate-900/50"
                        : "border-purple-300/20 bg-white/40"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={animations.viewport}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -4, borderColor: "rgba(168,85,247,0.4)" }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${metric.color} bg-opacity-20`}
                      >
                        <IconComponent
                          size={16}
                          className={
                            metric.color.includes("emerald")
                              ? "text-emerald-400"
                              : metric.color.includes("purple")
                                ? "text-purple-400"
                                : "text-amber-400"
                          }
                        />
                      </div>
                    </div>
                    <p
                      className={`text-xs font-medium mb-1 ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {metric.label}
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {metric.value}
                    </p>
                    <div
                      className={`mt-2 h-1 overflow-hidden rounded-full ${
                        isDark ? "bg-slate-800" : "bg-slate-200"
                      }`}
                    >
                      <Motion.span
                        className={`block h-full w-16 rounded-full bg-gradient-to-r ${metric.color}`}
                        animate={{
                          x: [-20, 160, -20],
                        }}
                        transition={{
                          duration: metric.duration,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </Motion.div>
                );
              })}
            </div>
          </Motion.div>

          <Motion.div
            variants={animations.fadeInUp}
            className="flex flex-wrap gap-3 pt-2"
          >
            <Motion.a
              href="#apps"
              className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-7 py-3.5 text-sm font-bold text-white transition hover:shadow-lg hover:shadow-purple-500/50"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(236, 72, 153, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 {content.ctaPrimary}
            </Motion.a>
            <Motion.a
              href="#roadmap"
              className={`rounded-full border-2 px-7 py-3.5 text-sm font-bold transition ${
                isDark
                  ? "border-purple-400/50 text-purple-200 hover:bg-purple-500/10 hover:border-purple-400"
                  : "border-purple-400/60 text-purple-700 hover:bg-purple-100 hover:border-purple-500"
              }`}
              whileHover={{ scale: 1.05, borderColor: "rgba(168,85,247,1)" }}
              whileTap={{ scale: 0.95 }}
            >
              📋 {content.ctaSecondary}
            </Motion.a>
          </Motion.div>

          {content.launchDate && (
            <Motion.div
              variants={animations.fadeInUp}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 ${
                isDark
                  ? "border-purple-500/30 bg-purple-500/10"
                  : "border-purple-400/40 bg-purple-100/30"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-lg">🎯</span>
              <p
                className={`text-sm font-semibold ${
                  isDark ? "text-purple-200" : "text-purple-700"
                }`}
              >
                Launch: {content.launchDate}
              </p>
            </Motion.div>
          )}

          <Motion.div
            variants={animations.fadeInUp}
            className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3"
          >
            {content.trustBadges.map((badge, index) => (
              <Motion.div
                key={badge.label}
                className={`rounded-2xl border p-4 backdrop-blur-sm ${
                  isDark
                    ? "border-slate-700/50 bg-gradient-to-br from-slate-900/70 to-slate-950/70"
                    : "border-slate-300/40 bg-gradient-to-br from-white/50 to-slate-100/50"
                }`}
                whileHover={{ scale: 1.05, y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={animations.viewport}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <p
                  className={`text-2xl font-black ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {badge.value}
                </p>
                <p
                  className={`text-xs font-medium ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {badge.label}
                </p>
              </Motion.div>
            ))}
          </Motion.div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="relative mx-auto h-70 w-full max-w-xl rounded-3xl border border-purple-300/20 bg-slate-900/70 p-4 shadow-[0_0_60px_rgba(168,85,247,0.12)] sm:h-85 sm:p-5 lg:h-95 lg:p-6"
        >
          <Countdown targetDate="2026-04-25T00:00:00" />
          <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-purple-400/30 blur-2xl" />
          <div className="absolute bottom-10 right-10 h-28 w-28 rounded-full bg-violet-500/30 blur-2xl" />
          <div
            className={`relative h-full overflow-hidden rounded-2xl border border-purple-200/20 ${innerSurface}`}
          >
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {heroLinks.map(([fromId, toId], index) => {
                const from = heroNodeMap[fromId];
                const to = heroNodeMap[toId];

                return (
                  <Motion.line
                    key={`${fromId}-${toId}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={lineStroke}
                    strokeWidth="0.22"
                    strokeDasharray="1.2 0.9"
                    animate={{
                      opacity: [0.2, 0.9, 0.2],
                      pathLength: [0.2, 1, 0.2],
                    }}
                    transition={{
                      duration: 3.1,
                      delay: index * 0.03,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                );
              })}
            </svg>

            {heroNodes.map((node, index) => (
              <Motion.span
                key={node.id}
                className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border ${nodeClass}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 2.2,
                  delay: index * 0.05,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            ))}

            <Motion.div
              className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-purple-300/30 bg-purple-300/10"
              animate={{ rotate: 360 }}
              transition={{
                duration: 11,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <div className="absolute inset-2 grid grid-cols-2 gap-1">
                {[...Array(4)].map((_, index) => (
                  <Motion.div
                    key={index}
                    className="rounded-md border border-purple-300/40 bg-purple-400/15"
                    animate={{ opacity: [0.25, 0.85, 0.25] }}
                    transition={{
                      duration: 1.7,
                      delay: index * 0.14,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </Motion.div>

            <div className="pointer-events-none absolute inset-2 rounded-xl border border-cyan-300/20" />

            <AirdropAnimation />
          </div>
        </Motion.div>
      </div>
    </section>
  );
}

export default Hero;
