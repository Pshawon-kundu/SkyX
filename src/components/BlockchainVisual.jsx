import { motion as Motion } from "framer-motion";

const nodes = [
  { id: "n1", x: 10, y: 20, size: "h-3.5 w-3.5" },
  { id: "n2", x: 34, y: 14, size: "h-3 w-3" },
  { id: "n3", x: 58, y: 22, size: "h-3.5 w-3.5" },
  { id: "n4", x: 82, y: 16, size: "h-3 w-3" },
  { id: "n5", x: 22, y: 50, size: "h-3.5 w-3.5" },
  { id: "n6", x: 47, y: 48, size: "h-4 w-4" },
  { id: "n7", x: 74, y: 52, size: "h-3.5 w-3.5" },
  { id: "n8", x: 14, y: 78, size: "h-3 w-3" },
  { id: "n9", x: 38, y: 84, size: "h-3.5 w-3.5" },
  { id: "n10", x: 62, y: 80, size: "h-3.5 w-3.5" },
  { id: "n11", x: 86, y: 76, size: "h-3 w-3" },
];

const links = [
  ["n1", "n2"],
  ["n2", "n3"],
  ["n3", "n4"],
  ["n1", "n5"],
  ["n2", "n6"],
  ["n3", "n6"],
  ["n3", "n7"],
  ["n5", "n6"],
  ["n6", "n7"],
  ["n5", "n8"],
  ["n6", "n9"],
  ["n6", "n10"],
  ["n7", "n11"],
  ["n9", "n10"],
  ["n10", "n11"],
];

const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));

function BlockchainVisual({ theme = "dark" }) {
  const isDark = theme === "dark";
  const surfaceClass = isDark
    ? "bg-[radial-gradient(circle_at_50%_50%,rgba(14,116,144,0.2),rgba(2,6,23,0.92)_64%)]"
    : "bg-[radial-gradient(circle_at_50%_48%,rgba(34,211,238,0.24),rgba(237,248,255,0.95)_68%)]";
  const linkStroke = isDark ? "rgba(168,85,247,0.55)" : "rgba(139,69,193,0.78)";
  const nodeClass = isDark
    ? "border-purple-200/65 bg-purple-300/45 shadow-[0_0_16px_rgba(168,85,247,0.9)]"
    : "border-purple-700/55 bg-purple-400/70 shadow-[0_0_16px_rgba(139,69,193,0.65)]";
  const coreClass = isDark
    ? "border-purple-200/35 bg-purple-300/5"
    : "border-purple-700/40 bg-purple-600/10";
  const coreCellClass = isDark
    ? "border-purple-200/35 bg-purple-400/15"
    : "border-purple-700/45 bg-purple-500/25";

  return (
    <Motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5 }}
      className={`relative mb-8 overflow-hidden rounded-3xl border p-6 shadow-[0_0_55px_rgba(168,85,247,0.12)] sm:mb-10 sm:p-7 ${isDark ? "border-purple-300/20 bg-slate-900/70" : "border-purple-300/40 bg-slate-100/60"}`}
    >
      <div className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-purple-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 right-12 h-44 w-44 rounded-full bg-sky-500/20 blur-3xl" />

      <div className="relative z-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p
            className={`text-xs font-semibold uppercase tracking-[0.22em] ${isDark ? "text-purple-300" : "text-purple-600"}`}
          >
            Chain Activity
          </p>
          <h3
            className={`mt-2 text-2xl font-black sm:text-3xl ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Live block mesh simulation
          </h3>
          <p
            className={`mt-2 max-w-xl text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            Animated transaction lanes and validator nodes visualizing real-time
            settlement flow across the MetaCrate network.
          </p>
        </div>
        <div
          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] ${isDark ? "border-purple-300/35 bg-purple-400/10 text-purple-200" : "border-purple-400/50 bg-purple-200/30 text-purple-700"}`}
        >
          12,240 tx / min
        </div>
      </div>

      <div
        className={`relative mt-7 h-64 overflow-hidden rounded-2xl border border-purple-300/20 sm:h-72 ${surfaceClass}`}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {links.map(([fromId, toId], index) => {
            const from = nodeMap[fromId];
            const to = nodeMap[toId];
            return (
              <Motion.line
                key={`${fromId}-${toId}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={linkStroke}
                strokeWidth="0.26"
                strokeDasharray="1.35 1"
                initial={{ pathLength: 0.2, opacity: 0.25 }}
                animate={{
                  pathLength: [0.25, 1, 0.25],
                  opacity: [0.2, 0.85, 0.2],
                }}
                transition={{
                  duration: 3.4,
                  delay: index * 0.07,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </svg>

        {nodes.map((node, index) => (
          <Motion.span
            key={node.id}
            className={`absolute ${node.size} rounded-full border ${nodeClass}`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              scale: [1, 1.18, 1],
              opacity: [0.65, 1, 0.65],
            }}
            transition={{
              duration: 2.2,
              delay: index * 0.08,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}

        <Motion.div
          className={`absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-2xl border ${coreClass}`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 14,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <div className="absolute inset-2 grid grid-cols-2 gap-1.5">
            {[...Array(4)].map((_, index) => (
              <Motion.div
                key={index}
                className={`rounded-md border ${coreCellClass}`}
                animate={{ opacity: [0.2, 0.85, 0.2] }}
                transition={{
                  duration: 1.8,
                  delay: index * 0.16,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </Motion.div>
      </div>
    </Motion.article>
  );
}

export default BlockchainVisual;
