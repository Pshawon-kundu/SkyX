import { motion as Motion } from "framer-motion";
import {
  Radio,
  CheckCircle2,
  Palette,
  Rocket,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { animations } from "../data/animations";

const iconMap = {
  Radio: Radio,
  CheckCircle2: CheckCircle2,
  Palette: Palette,
  Rocket: Rocket,
  TrendingUp: TrendingUp,
};

function How({ content, theme }) {
  const isDark = theme === "dark";

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

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="how"
      className={`relative py-20 sm:py-28 overflow-hidden ${
        isDark
          ? "bg-gradient-to-b from-slate-900/50 to-slate-950/50"
          : "bg-gradient-to-b from-purple-50/50 to-white/50"
      }`}
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 h-96 w-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-96 w-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-16 sm:mb-20 text-center"
        >
          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {content.title}
          </h2>
          <p
            className={`mt-4 text-lg sm:text-xl ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {content.subtitle}
          </p>
          <div className="mt-6 flex justify-center">
            <div
              className={`h-1.5 w-24 rounded-full ${
                isDark
                  ? "bg-linear-to-r from-purple-500 to-pink-500"
                  : "bg-linear-to-r from-purple-600 to-pink-600"
              }`}
            />
          </div>
        </Motion.div>

        {/* Steps Flow */}
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative"
        >
          {/* Desktop: Show connecting lines */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-1">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 10"
              preserveAspectRatio="none"
            >
              <Motion.line
                x1="0"
                y1="5"
                x2="1000"
                y2="5"
                stroke={
                  isDark ? "rgba(168,85,247,0.2)" : "rgba(147,51,234,0.25)"
                }
                strokeWidth="2"
                strokeDasharray="10 5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </svg>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {content.steps.map((step, index) => {
              const IconComponent = iconMap[step.icon];
              return (
                <Motion.div
                  key={index}
                  variants={stepVariants}
                  className="relative group"
                >
                  {/* Card */}
                  <div
                    className={`relative h-full rounded-2xl border p-6 sm:p-8 backdrop-blur-sm transition ${
                      isDark
                        ? "border-purple-500/20 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/80 hover:border-purple-500/40"
                        : "border-purple-300/30 bg-gradient-to-br from-white/70 via-purple-50/40 to-white/50 hover:border-purple-400/50"
                    }`}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Step Number Badge */}
                    <div
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm mb-4 ${
                        isDark
                          ? "bg-purple-600/40 text-purple-300"
                          : "bg-purple-200/60 text-purple-700"
                      }`}
                    >
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div
                      className={`mb-4 p-3 w-fit rounded-xl ${
                        isDark ? "bg-purple-600/30" : "bg-purple-200/50"
                      }`}
                    >
                      <IconComponent
                        size={28}
                        className={
                          isDark ? "text-purple-300" : "text-purple-600"
                        }
                      />
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-xl font-bold mb-2 ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-sm font-semibold mb-3 ${
                        isDark ? "text-purple-300/80" : "text-purple-600/80"
                      }`}
                    >
                      {step.description}
                    </p>

                    {/* Details */}
                    <p
                      className={`text-sm leading-relaxed ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {step.details}
                    </p>

                    {/* Arrow Divider - Hidden on last step */}
                    {index < content.steps.length - 1 && (
                      <div className="lg:hidden mt-4 flex justify-end">
                        <Motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <ArrowRight
                            size={20}
                            className={
                              isDark
                                ? "text-purple-400/60"
                                : "text-purple-500/60"
                            }
                          />
                        </Motion.div>
                      </div>
                    )}
                  </div>

                  {/* Connecting Arrow on Desktop */}
                  {index < content.steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-2 top-20 z-20">
                      <Motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowRight
                          size={24}
                          className={
                            isDark ? "text-purple-500/60" : "text-purple-600/60"
                          }
                        />
                      </Motion.div>
                    </div>
                  )}
                </Motion.div>
              );
            })}
          </div>
        </Motion.div>

        {/* Operator Note */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <p
            className={`text-lg font-medium italic ${
              isDark ? "text-purple-300/80" : "text-purple-600/80"
            }`}
          >
            This workflow can be fully operated and managed by platform owners.
          </p>
        </Motion.div>

        {/* Bottom CTA */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 sm:mt-20 text-center"
        >
          <p
            className={`text-lg font-semibold ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Ready to launch your venture?
          </p>
          <Motion.a
            href="#apps"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-purple-500 to-pink-500 px-8 py-4 text-base font-bold text-white transition hover:shadow-lg hover:shadow-purple-500/50"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 25px 50px rgba(236, 72, 153, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Start with SkyX
            <ArrowRight size={18} />
          </Motion.a>
        </Motion.div>
      </div>
    </section>
  );
}

export default How;
