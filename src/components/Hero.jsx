import { motion as Motion } from "framer-motion";
import { Zap, Cpu, Link as LinkIcon, Sparkles, ArrowRight } from "lucide-react";
import { animations } from "../data/animations";

const iconMap = {
  Zap: Zap,
  Cpu: Cpu,
  Link: LinkIcon,
};

function Hero({ brand, content, theme }) {
  const isDark = theme === "dark";

  const heroBackdrop = !isDark
    ? "bg-[radial-gradient(circle_at_15%_20%,rgba(168,85,247,0.2),transparent_38%),radial-gradient(circle_at_82%_16%,rgba(139,69,193,0.18),transparent_42%),linear-gradient(180deg,#f6fbff_0%,#edf6ff_55%,#e2f3ff_100%)]"
    : "bg-[radial-gradient(circle_at_15%_20%,rgba(168,85,247,0.18),transparent_40%),radial-gradient(circle_at_80%_18%,rgba(139,69,193,0.12),transparent_45%),linear-gradient(180deg,#020617_0%,#020617_60%,#030A15_100%)]";

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-28"
    >
      <div
        className={`pointer-events-none absolute inset-0 -z-10 ${heroBackdrop}`}
      />

      {/* Animated gradient blobs */}
      <div className="absolute top-20 left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-8 sm:space-y-12"
        >
          {/* Brand Badge */}
          <Motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-5 py-2 backdrop-blur-sm">
              <Sparkles size={16} className="text-purple-300" />
              <span className="text-sm font-semibold text-purple-200">
                {brand.name} • {brand.ticker}
              </span>
            </div>
          </Motion.div>

          {/* Main Title */}
          <Motion.div variants={itemVariants} className="space-y-4 text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight text-white">
              {content.title}
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text">
              {content.subtitle}
            </p>
          </Motion.div>

          {/* Description */}
          <Motion.div variants={itemVariants} className="max-w-3xl mx-auto">
            <p
              className={`text-center text-lg sm:text-xl leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              {content.description}
            </p>
          </Motion.div>

          {/* Trust Lines with Icons */}
          <Motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto pt-4"
          >
            {content.trustLines.map((line, index) => {
              const IconComponent = iconMap[line.icon];
              return (
                <Motion.div
                  key={index}
                  className={`flex items-center gap-3 rounded-xl border p-4 backdrop-blur-sm transition ${
                    isDark
                      ? "border-purple-400/20 bg-purple-500/10 hover:bg-purple-500/15"
                      : "border-purple-300/30 bg-purple-100/20 hover:bg-purple-100/30"
                  }`}
                  whileHover={{ scale: 1.05, y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div
                    className={`p-2 rounded-lg flex-shrink-0 ${isDark ? "bg-purple-600/50" : "bg-purple-300/50"}`}
                  >
                    <IconComponent size={20} className="text-purple-200" />
                  </div>
                  <span
                    className={`text-sm font-medium ${isDark ? "text-purple-100" : "text-purple-900"}`}
                  >
                    {line.text}
                  </span>
                </Motion.div>
              );
            })}
          </Motion.div>

          {/* CTA Buttons */}
          <Motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8"
          >
            <Motion.a
              href="#apps"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-base font-bold text-white transition hover:shadow-lg hover:shadow-purple-500/50"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(236, 72, 153, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {content.ctaPrimary}
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Motion.a>

            <Motion.a
              href="#roadmap"
              className={`inline-flex items-center gap-2 rounded-full border-2 px-8 py-4 text-base font-bold transition ${
                isDark
                  ? "border-purple-400/60 text-purple-200 hover:bg-purple-500/10 hover:border-purple-400"
                  : "border-purple-400/70 text-purple-700 hover:bg-purple-100 hover:border-purple-500"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {content.ctaSecondary}
            </Motion.a>
          </Motion.div>

          {/* Supporting Text */}
          <Motion.div
            variants={itemVariants}
            className={`text-center text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}
          >
            <p>Empowering teams to build, validate, and scale Web3 ventures</p>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
}

export default Hero;
