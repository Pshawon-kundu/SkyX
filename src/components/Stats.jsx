import { motion as Motion } from "framer-motion";
import { useEffect, useState } from "react";

function Stats({ stats, isDark = true }) {
  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    // Extract numeric values from stat values
    const extractNumber = (value) => {
      const match = value.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };

    const targets = stats.map((stat) => extractNumber(stat.value));
    const durations = 2000; // 2 seconds

    const startTime = Date.now();
    const animateCounters = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durations, 1);

      setCounters(targets.map((target) => Math.floor(target * progress)));

      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      }
    };

    const timeout = setTimeout(() => {
      requestAnimationFrame(animateCounters);
    }, 300);

    return () => clearTimeout(timeout);
  }, [stats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section
      id="stats"
      className={`py-16 sm:py-20 ${isDark ? "bg-slate-900" : "bg-white"}`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={containerVariants}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <Motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{
                y: -8,
                boxShadow: isDark
                  ? "0 20px 40px rgba(168, 85, 247, 0.15)"
                  : "0 20px 40px rgba(139, 69, 193, 0.15)",
              }}
              transition={{ duration: 0.3 }}
              className={`group cursor-pointer overflow-hidden rounded-2xl border p-6 shadow-[0_0_30px_rgba(168,85,247,0.06)] transition-all ${
                isDark
                  ? "border-slate-800 bg-slate-900/70 hover:border-purple-400/30"
                  : "border-purple-200/40 bg-purple-50/50 hover:border-purple-400/60"
              }`}
            >
              {/* Gradient overlay on hover */}
              <Motion.div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0"
                whileHover={{
                  background: isDark
                    ? "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(236,72,153,0.05))"
                    : "linear-gradient(135deg, rgba(168,85,247,0.05), rgba(236,72,153,0.03))",
                }}
                transition={{ duration: 0.3 }}
              />

              <p
                className={`relative z-10 text-sm font-medium transition-colors ${
                  isDark
                    ? "text-slate-400 group-hover:text-slate-300"
                    : "text-slate-600 group-hover:text-slate-700"
                }`}
              >
                {stat.label}
              </p>

              <Motion.p
                className={`relative z-10 mt-3 text-3xl font-black ${
                  isDark ? "text-purple-200" : "text-purple-700"
                }`}
              >
                {counters[index] > 0 ? counters[index] : ""}
                {stat.value.replace(/\d+/g, "")}
              </Motion.p>

              <p
                className={`relative z-10 mt-1 text-xs uppercase tracking-wider ${
                  isDark ? "text-slate-500" : "text-slate-500"
                }`}
              >
                {stat.detail}
              </p>

              {/* Accent line that grows on hover */}
              <Motion.div
                className={`absolute bottom-0 left-0 h-1 ${
                  isDark ? "bg-purple-400/50" : "bg-purple-500/50"
                }`}
                initial={{ width: "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </section>
  );
}

export default Stats;
