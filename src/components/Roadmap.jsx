import { motion as Motion } from "framer-motion";
import { Flag, Rocket, Zap, Star, ChevronRight, Check } from "lucide-react";

const phaseIcons = [Flag, Rocket, Zap, Star];

const phaseColors = [
  {
    dark: "border-blue-400/30 bg-blue-500/10",
    light: "border-blue-400/40 bg-blue-100/30",
    badge: "bg-blue-500/20 text-blue-300",
    lightBadge: "bg-blue-200/50 text-blue-700",
    bullet: "bg-blue-400",
    accent: "from-blue-500/20 to-blue-500/5",
    number: "bg-blue-500/30 border-blue-400/50",
  },
  {
    dark: "border-purple-400/30 bg-purple-500/10",
    light: "border-purple-400/40 bg-purple-100/30",
    badge: "bg-purple-500/20 text-purple-300",
    lightBadge: "bg-purple-200/50 text-purple-700",
    bullet: "bg-purple-400",
    accent: "from-purple-500/20 to-purple-500/5",
    number: "bg-purple-500/30 border-purple-400/50",
  },
  {
    dark: "border-amber-400/30 bg-amber-500/10",
    light: "border-amber-400/40 bg-amber-100/30",
    badge: "bg-amber-500/20 text-amber-300",
    lightBadge: "bg-amber-200/50 text-amber-700",
    bullet: "bg-amber-400",
    accent: "from-amber-500/20 to-amber-500/5",
    number: "bg-amber-500/30 border-amber-400/50",
  },
  {
    dark: "border-emerald-400/30 bg-emerald-500/10",
    light: "border-emerald-400/40 bg-emerald-100/30",
    badge: "bg-emerald-500/20 text-emerald-300",
    lightBadge: "bg-emerald-200/50 text-emerald-700",
    bullet: "bg-emerald-400",
    accent: "from-emerald-500/20 to-emerald-500/5",
    number: "bg-emerald-500/30 border-emerald-400/50",
  },
];

function Roadmap({ content, isDark = true }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <section
      id="roadmap"
      className={`py-16 sm:py-20 ${isDark ? "bg-slate-900" : "bg-white"}`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className={`rounded-3xl border p-8 sm:p-10 ${
            isDark
              ? "border-purple-400/20 bg-slate-900/70"
              : "border-purple-300/40 bg-purple-50/50"
          }`}
        >
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className={`text-3xl font-black sm:text-4xl ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {content.title}
            </h2>
          </Motion.div>

          {/* Timeline Container */}
          <Motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="mt-12"
          >
            {/* Desktop Timeline Line */}
            <div className="hidden lg:block absolute left-0 right-0 h-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-emerald-500/30 mt-24 pointer-events-none" />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {content.phases.map((phase, index) => {
                const Icon = phaseIcons[index % phaseIcons.length];
                const colors = phaseColors[index];

                return (
                  <Motion.div key={index} variants={cardVariants}>
                    <Motion.div
                      whileHover={{ y: -12, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className={`relative rounded-2xl border p-6 ${
                        isDark ? colors.dark : colors.light
                      }`}
                    >
                      {/* Gradient background overlay */}
                      <div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.accent} pointer-events-none`}
                      />

                      {/* Phase Number Badge */}
                      <Motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", delay: index * 0.1 + 0.3 }}
                        className={`relative mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 ${colors.number} font-bold text-white`}
                      >
                        {index + 1}
                      </Motion.div>

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon and Title */}
                        <div className="flex items-start gap-3 mb-4">
                          <div
                            className={`p-2.5 rounded-lg shrink-0 ${
                              isDark ? colors.badge : colors.lightBadge
                            }`}
                          >
                            <Icon size={20} />
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-bold text-lg leading-tight ${
                                isDark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {phase.title}
                            </h3>
                          </div>
                        </div>

                        {/* Items List */}
                        <Motion.ul
                          variants={containerVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          className="space-y-3 ml-0"
                        >
                          {phase.items.map((item, itemIndex) => (
                            <Motion.li
                              key={itemIndex}
                              variants={itemVariants}
                              className="flex items-start gap-3"
                            >
                              <div
                                className={`mt-1.5 h-2 w-2 rounded-full ${colors.bullet} shrink-0`}
                              />
                              <p
                                className={`text-sm leading-relaxed ${
                                  isDark
                                    ? "text-slate-300"
                                    : "text-slate-700"
                                }`}
                              >
                                {item}
                              </p>
                            </Motion.li>
                          ))}
                        </Motion.ul>
                      </div>

                      {/* Connector Arrow - Only show for non-last items */}
                      {index < content.phases.length - 1 && (
                        <Motion.div
                          animate={{ x: [0, 6, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="hidden lg:block absolute -right-8 top-1/2 z-20 transform -translate-y-1/2"
                        >
                          <ChevronRight
                            size={24}
                            className={
                              isDark
                                ? "text-purple-400/60"
                                : "text-purple-600/60"
                            }
                          />
                        </Motion.div>
                      )}
                    </Motion.div>
                  </Motion.div>
                );
              })}
            </div>
          </Motion.div>

          {/* Timeline Status Indicator */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`mt-10 rounded-xl border p-4 ${
              isDark
                ? "border-purple-400/20 bg-purple-500/10"
                : "border-purple-400/30 bg-purple-100/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {content.phases.map((_, index) => (
                  <Motion.div
                    key={index}
                    animate={{
                      scaleX: index === 0 ? 1 : 0.5,
                      opacity: 0.6,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                    }}
                    className={`h-1 w-8 rounded-full ${
                      index === 0
                        ? isDark
                          ? "bg-gradient-to-r from-blue-400 to-purple-400"
                          : "bg-gradient-to-r from-blue-500 to-purple-600"
                        : isDark
                          ? "bg-slate-600"
                          : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Phase {1} of {content.phases.length} in progress
              </p>
            </div>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
}

export default Roadmap;
