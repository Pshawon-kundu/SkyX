import { motion as Motion } from "framer-motion";
import { useState } from "react";
import {
  Users,
  Zap,
  Lightbulb,
  Shield,
  AlertCircle,
  ChevronDown,
  CheckCircle2,
  Target,
  Compass,
  Eye,
  HelpCircle,
} from "lucide-react";

const sectionIcons = {
  whoFor: Users,
  gettingStarted: Zap,
  whatToExpect: Lightbulb,
  transparency: Eye,
  riskAwareness: AlertCircle,
};

function Audience({ content, isDark = true }) {
  const [expandedFaq, setExpandedFaq] = useState(null);

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const renderListSection = (title, items, icon, index) => {
    const Icon = sectionIcons[icon];
    const colorMap = {
      whoFor: {
        dark: "border-purple-400/30 bg-purple-500/10",
        light: "border-purple-400/40 bg-purple-100/30",
        iconBg: "bg-purple-500/20 text-purple-300",
        lightIconBg: "bg-purple-200/50 text-purple-700",
        bullet: "bg-purple-400",
      },
      gettingStarted: {
        dark: "border-green-400/30 bg-green-500/10",
        light: "border-green-400/40 bg-green-100/30",
        iconBg: "bg-green-500/20 text-green-300",
        lightIconBg: "bg-green-200/50 text-green-700",
        bullet: "bg-green-400",
      },
      whatToExpect: {
        dark: "border-blue-400/30 bg-blue-500/10",
        light: "border-blue-400/40 bg-blue-100/30",
        iconBg: "bg-blue-500/20 text-blue-300",
        lightIconBg: "bg-blue-200/50 text-blue-700",
        bullet: "bg-blue-400",
      },
      transparency: {
        dark: "border-amber-400/30 bg-amber-500/10",
        light: "border-amber-400/40 bg-amber-100/30",
        iconBg: "bg-amber-500/20 text-amber-300",
        lightIconBg: "bg-amber-200/50 text-amber-700",
        bullet: "bg-amber-400",
      },
      riskAwareness: {
        dark: "border-red-400/30 bg-red-500/10",
        light: "border-red-400/40 bg-red-100/30",
        iconBg: "bg-red-500/20 text-red-300",
        lightIconBg: "bg-red-200/50 text-red-700",
        bullet: "bg-red-400",
      },
    };

    const colors = colorMap[icon];

    return (
      <Motion.div
        key={icon}
        variants={cardVariants}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className={`rounded-2xl border p-6 ${
          isDark ? colors.dark : colors.light
        }`}
      >
        {/* Header with icon */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className={`p-2.5 rounded-lg ${
              isDark ? colors.iconBg : colors.lightIconBg
            }`}
          >
            <Icon size={20} />
          </div>
          <h3
            className={`text-lg font-bold ${
              isDark
                ? "text-white"
                : icon === "riskAwareness"
                  ? "text-red-700"
                  : icon === "transparency"
                    ? "text-amber-700"
                    : icon === "whatToExpect"
                      ? "text-blue-700"
                      : icon === "gettingStarted"
                        ? "text-green-700"
                        : "text-purple-700"
            }`}
          >
            {title}
          </h3>
        </div>

        {/* List items */}
        <Motion.ul
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-3"
        >
          {items.map((item, itemIndex) => (
            <Motion.li key={itemIndex} variants={itemVariants} className="flex items-start gap-3">
              <div
                className={`mt-1.5 h-2 w-2 rounded-full ${colors.bullet} shrink-0`}
              />
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {item}
              </p>
            </Motion.li>
          ))}
        </Motion.ul>
      </Motion.div>
    );
  };

  return (
    <section
      id="audience"
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

          {/* Top Section: Who For & Getting Started */}
          <Motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="mt-10 grid gap-6 lg:grid-cols-2"
          >
            {renderListSection("Who This Is For", content.whoFor, "whoFor", 0)}
            {renderListSection("Getting Started", content.gettingStarted, "gettingStarted", 1)}
          </Motion.div>

          {/* Middle Section: Three Columns */}
          <Motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {renderListSection("What to Expect", content.whatToExpect, "whatToExpect", 0)}
            {renderListSection("Transparency", content.transparency, "transparency", 1)}
            {renderListSection("Risk Awareness", content.riskAwareness, "riskAwareness", 2)}
          </Motion.div>

          {/* FAQ Section */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`p-2.5 rounded-lg ${
                  isDark
                    ? "bg-purple-500/20 text-purple-300"
                    : "bg-purple-200/50 text-purple-700"
                }`}
              >
                <HelpCircle size={20} />
              </div>
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {content.faq.map((item, index) => (
                <Motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Motion.button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className={`w-full rounded-xl border p-4 text-left transition-all ${
                      expandedFaq === index
                        ? isDark
                          ? "border-purple-400/50 bg-purple-500/15"
                          : "border-purple-400/60 bg-purple-100/40"
                        : isDark
                          ? "border-slate-700/50 bg-slate-800/30 hover:border-purple-400/30 hover:bg-slate-800/50"
                          : "border-slate-300/50 bg-slate-100/30 hover:border-purple-400/40 hover:bg-slate-100/50"
                    }`}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h4
                        className={`font-semibold ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {item.question}
                      </h4>
                      <Motion.div
                        animate={{
                          rotate: expandedFaq === index ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown
                          size={20}
                          className={
                            isDark
                              ? "text-purple-400"
                              : "text-purple-600"
                          }
                        />
                      </Motion.div>
                    </div>
                  </Motion.button>

                  {/* Expandable Answer */}
                  <Motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: expandedFaq === index ? 1 : 0,
                      height: expandedFaq === index ? "auto" : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`rounded-b-xl border border-t-0 border-slate-700/50 p-4 ${
                        isDark
                          ? "bg-slate-800/20"
                          : "bg-slate-100/20"
                      }`}
                    >
                      <p
                        className={`text-sm leading-relaxed ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </Motion.div>
                </Motion.div>
              ))}
            </div>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
}

export default Audience;
