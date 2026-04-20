import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { animations } from "../data/animations";
import {
  AlertCircle,
  Sparkles,
  Cog,
  DollarSign,
  Zap,
  AlertTriangle,
  Building2,
  Target,
  Search,
  Lightbulb,
} from "lucide-react";

function WhyMatters({ content, isDark }) {
  const [activeTab, setActiveTab] = useState("problem");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const problemIcons = [Cog, DollarSign, Zap, AlertTriangle];
  const approachIcons = [Building2, Target, Search];

  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
    hover: { y: -8, transition: { duration: 0.3 } },
  };

  return (
    <section
      id="why-matters"
      className={`relative overflow-hidden py-16 sm:py-20 ${
        isDark ? "bg-slate-900" : "bg-white"
      }`}
    >
      {/* Animated background elements */}
      <div
        className={`absolute top-20 right-10 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none ${
          isDark ? "bg-red-500/10" : "bg-red-300/20"
        }`}
      />
      <div
        className={`absolute bottom-40 left-10 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none ${
          isDark ? "bg-green-500/10" : "bg-green-300/20"
        }`}
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <Motion.div
          initial="hidden"
          whileInView="visible"
          viewport={animations.viewport}
          variants={animations.staggerContainer}
          className={`rounded-3xl border backdrop-blur-xl p-8 sm:p-12 shadow-2xl ${
            isDark
              ? "border-purple-400/30 bg-linear-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80"
              : "border-purple-300/40 bg-linear-to-br from-purple-50/60 via-white/80 to-purple-50/60"
          }`}
        >
          {/* Header */}
          <Motion.div variants={animations.fadeInUp} className="mb-10">
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {content.title}
            </h2>
            <div className="h-1 w-20 bg-linear-to-r from-red-400 via-purple-400 to-green-400 rounded-full" />
          </Motion.div>

          {/* Tab Toggle for Mobile/Tablet */}
          <Motion.div
            variants={animations.fadeInUp}
            className="mb-8 flex gap-2 sm:hidden"
          >
            {[
              { id: "problem", label: "The Problem", color: "red" },
              { id: "approach", label: "Our Approach", color: "green" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? isDark
                      ? `bg-${tab.color}-500/30 border border-${tab.color}-400 text-${tab.color}-300`
                      : `bg-${tab.color}-200/40 border border-${tab.color}-400 text-${tab.color}-700`
                    : isDark
                      ? "bg-slate-700/40 border border-slate-600/40 text-slate-400 hover:border-slate-500/60"
                      : "bg-slate-200/50 border border-slate-300/50 text-slate-600 hover:border-slate-400/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </Motion.div>

          {/* Desktop Grid / Mobile Single Column */}
          <div className="hidden sm:grid gap-8 sm:grid-cols-2">
            {/* The Problem Column */}
            <Motion.div variants={animations.fadeInLeft} className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`h-10 w-10 rounded-lg border flex items-center justify-center ${
                    isDark
                      ? "bg-red-500/20 border-red-400/50"
                      : "bg-red-200/30 border-red-400/60"
                  }`}
                >
                  <AlertCircle
                    className={`w-6 h-6 ${
                      isDark ? "text-red-400" : "text-red-600"
                    }`}
                  />
                </div>
                <h3
                  className={`text-xl sm:text-2xl font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  The Problem
                </h3>
              </div>
              <Motion.div
                variants={animations.staggerContainer}
                className="space-y-3"
              >
                {content.content.map((item, index) => (
                  <Motion.div
                    key={index}
                    custom={index}
                    variants={cardVariants}
                    whileHover="hover"
                    className="group cursor-pointer"
                    onHoverStart={() => setExpandedIndex(index)}
                    onHoverEnd={() => setExpandedIndex(null)}
                  >
                    <div
                      className={`relative rounded-xl border p-4 transition-all duration-300 overflow-hidden ${
                        isDark
                          ? "bg-red-500/10 border-red-400/30 hover:border-red-400/60 hover:bg-red-500/15"
                          : "bg-red-200/20 border-red-400/40 hover:border-red-400/70 hover:bg-red-200/30"
                      }`}
                    >
                      {/* Animated border glow */}
                      <div
                        className={`absolute inset-0 bg-linear-to-r from-red-400/0 via-red-400/0 to-red-400/0 group-hover:from-red-400/20 group-hover:via-red-400/40 group-hover:to-red-400/20 transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                          isDark ? "" : "opacity-50"
                        }`}
                      />

                      <div className="relative flex items-start gap-3">
                        {(() => {
                          const IconComponent = problemIcons[index];
                          return (
                            <IconComponent
                              className={`w-6 h-6 shrink-0 mt-0.5 ${
                                isDark ? "text-red-400" : "text-red-600"
                              }`}
                            />
                          );
                        })()}
                        <p
                          className={`text-sm leading-relaxed transition-colors ${
                            isDark
                              ? "text-slate-200 group-hover:text-white"
                              : "text-slate-700 group-hover:text-slate-900"
                          }`}
                        >
                          {item}
                        </p>
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </Motion.div>
            </Motion.div>

            {/* Our Approach Column */}
            <Motion.div variants={animations.fadeInRight} className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`h-10 w-10 rounded-lg border flex items-center justify-center ${
                    isDark
                      ? "bg-green-500/20 border-green-400/50"
                      : "bg-green-200/30 border-green-400/60"
                  }`}
                >
                  <Sparkles
                    className={`w-6 h-6 ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  />
                </div>
                <h3
                  className={`text-xl sm:text-2xl font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Our Approach
                </h3>
              </div>
              <Motion.div
                variants={animations.staggerContainer}
                className="space-y-3"
              >
                {content.approach.map((item, index) => (
                  <Motion.div
                    key={index}
                    custom={index}
                    variants={cardVariants}
                    whileHover="hover"
                    className="group cursor-pointer"
                    onHoverStart={() => setExpandedIndex(index + 10)}
                    onHoverEnd={() => setExpandedIndex(null)}
                  >
                    <div
                      className={`relative rounded-xl border p-4 transition-all duration-300 overflow-hidden ${
                        isDark
                          ? "bg-green-500/10 border-green-400/30 hover:border-green-400/60 hover:bg-green-500/15"
                          : "bg-green-200/20 border-green-400/40 hover:border-green-400/70 hover:bg-green-200/30"
                      }`}
                    >
                      {/* Animated border glow */}
                      <div
                        className={`absolute inset-0 bg-linear-to-r from-green-400/0 via-green-400/0 to-green-400/0 group-hover:from-green-400/20 group-hover:via-green-400/40 group-hover:to-green-400/20 transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                          isDark ? "" : "opacity-50"
                        }`}
                      />

                      <div className="relative flex items-start gap-3">
                        {(() => {
                          const IconComponent = approachIcons[index];
                          return (
                            <IconComponent
                              className={`w-6 h-6 shrink-0 mt-0.5 ${
                                isDark ? "text-green-400" : "text-green-600"
                              }`}
                            />
                          );
                        })()}
                        <p
                          className={`text-sm leading-relaxed transition-colors ${
                            isDark
                              ? "text-slate-200 group-hover:text-white"
                              : "text-slate-700 group-hover:text-slate-900"
                          }`}
                        >
                          {item}
                        </p>
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </Motion.div>
            </Motion.div>
          </div>

          {/* Mobile Responsive Content */}
          <Motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            className="sm:hidden space-y-4"
          >
            {activeTab === "problem" && (
              <Motion.div
                variants={animations.staggerContainer}
                className="space-y-3"
              >
                {content.content.map((item, index) => (
                  <Motion.div
                    key={index}
                    custom={index}
                    variants={cardVariants}
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                    className="group cursor-pointer"
                  >
                    <div
                      className={`relative rounded-xl p-4 transition-all duration-300 overflow-hidden ${
                        isDark
                          ? "bg-red-500/10 border border-red-400/30 active:bg-red-500/20"
                          : "bg-red-200/20 border border-red-400/40 active:bg-red-200/30"
                      }`}
                    >
                      <div className="relative flex items-start gap-3">
                        {(() => {
                          const IconComponent = problemIcons[index];
                          return (
                            <IconComponent
                              className={`w-6 h-6 shrink-0 mt-0.5 ${
                                isDark ? "text-red-400" : "text-red-600"
                              }`}
                            />
                          );
                        })()}
                        <p
                          className={`text-sm leading-relaxed ${
                            isDark ? "text-slate-200" : "text-slate-700"
                          }`}
                        >
                          {item}
                        </p>
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </Motion.div>
            )}

            {activeTab === "approach" && (
              <Motion.div
                variants={animations.staggerContainer}
                className="space-y-3"
              >
                {content.approach.map((item, index) => (
                  <Motion.div
                    key={index}
                    custom={index}
                    variants={cardVariants}
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                    className="group cursor-pointer"
                  >
                    <div
                      className={`relative rounded-xl p-4 transition-all duration-300 overflow-hidden ${
                        isDark
                          ? "bg-green-500/10 border border-green-400/30 active:bg-green-500/20"
                          : "bg-green-200/20 border border-green-400/40 active:bg-green-200/30"
                      }`}
                    >
                      <div className="relative flex items-start gap-3">
                        {(() => {
                          const IconComponent = approachIcons[index];
                          return (
                            <IconComponent
                              className={`w-6 h-6 shrink-0 mt-0.5 ${
                                isDark ? "text-green-400" : "text-green-600"
                              }`}
                            />
                          );
                        })()}
                        <p
                          className={`text-sm leading-relaxed ${
                            isDark ? "text-slate-200" : "text-slate-700"
                          }`}
                        >
                          {item}
                        </p>
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </Motion.div>
            )}
          </Motion.div>

          {/* Interactive Insight Box */}
          <Motion.div
            variants={animations.fadeInUp}
            className="mt-10 p-6 rounded-xl bg-linear-to-r from-purple-500/10 via-pink-500/5 to-purple-500/10 border border-purple-400/30 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 shrink-0 text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">Key Insight</h4>
                <p className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">
                  The gaming industry is a $200B+ market, but traditional models
                  keep players as consumers, not owners. SkyX changes that by
                  creating a structured ecosystem where participation, skill,
                  and engagement directly translate to ownership and value
                  retention.
                </p>
              </div>
            </div>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
}

export default WhyMatters;
