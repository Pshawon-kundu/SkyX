import { motion as Motion } from "framer-motion";
import { useEffect, useState, memo } from "react";

const Stats = memo(function Stats({ stats, isDark = true }) {
  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    const extractNumber = (value) => {
      const match = value.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };

    const targets = stats.map((stat) => extractNumber(stat.value));
    const durations = 2000;

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
      className={`py-16 sm:py-20 relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900"
          : "bg-gradient-to-b from-white via-amber-50/20 to-white"
      }`}
    >
      {/* Bitcoin accent elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
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
                  ? "0 20px 40px rgba(217, 119, 6, 0.15)"
                  : "0 20px 40px rgba(180, 83, 9, 0.15)",
              }}
              transition={{ duration: 0.3 }}
              className={`group cursor-pointer overflow-hidden rounded-2xl border p-6 shadow-[0_0_30px_rgba(217,119,6,0.06)] transition-all ${
                isDark
                  ? "border-slate-800 bg-slate-900/70 hover:border-amber-400/30"
                  : "border-amber-200/40 bg-amber-50/50 hover:border-amber-400/60"
              }`}
            >
              {/* Gradient overlay on hover with Bitcoin colors */}
              <Motion.div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0"
                whileHover={{
                  background: isDark
                    ? "linear-gradient(135deg, rgba(217,119,6,0.08), rgba(234,88,12,0.05))"
                    : "linear-gradient(135deg, rgba(217,119,6,0.05), rgba(234,88,12,0.03))",
                }}
                transition={{ duration: 0.3 }}
              />

              <p
                className={`relative z-10 text-sm font-medium transition-colors ${
                  isDark
                    ? "text-slate-400 group-hover:text-amber-300"
                    : "text-slate-600 group-hover:text-amber-700"
                }`}
              >
                {stat.label}
              </p>

              <Motion.p
                className={`relative z-10 mt-3 text-3xl font-black ${
                  isDark ? "text-amber-200" : "text-amber-700"
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

              {/* Accent line that grows on hover with Bitcoin colors */}
              <Motion.div
                className={`absolute bottom-0 left-0 h-1 ${
                  isDark ? "bg-amber-400/50" : "bg-amber-500/50"
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
});

export default Stats;
