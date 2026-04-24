import { motion as Motion } from "framer-motion";
import {
  CheckCircle,
  TrendingUp,
  Users,
  Zap,
  DollarSign,
  FileText,
  Award,
  Zap as ZapIcon,
} from "lucide-react";
import { animations } from "../data/animations";

const iconMap = {
  CheckCircle: CheckCircle,
  TrendingUp: TrendingUp,
  Users: Users,
  Zap: Zap,
  DollarSign: DollarSign,
  FileText: FileText,
  Award: Award,
  ZapIcon: ZapIcon,
};

function OperatorsSection({ theme }) {
  const isDark = theme === "dark";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const benefits = [
    {
      icon: "CheckCircle",
      title: "Manage and onboard projects",
      description: "Full control over project intake and approval workflows",
    },
    {
      icon: "TrendingUp",
      title: "Generate revenue from incubation and launch fees",
      description: "Monetize your venture platform operations",
    },
    {
      icon: "Users",
      title: "Access structured deal flow",
      description: "Curated pipeline of vetted projects ready to launch",
    },
    {
      icon: "Zap",
      title: "Build and control your own ecosystem",
      description: "Deploy SkyX as your proprietary platform",
    },
  ];

  const operatorTypes = ["Incubators", "VCs", "Launchpads", "Web3 communities"];

  return (
    <section
      id="operators"
      className={`relative py-20 sm:py-28 overflow-hidden ${
        isDark
          ? "bg-gradient-to-b from-slate-950/50 to-slate-900/50"
          : "bg-gradient-to-b from-purple-50/30 to-white/30"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-12 sm:space-y-16"
        >
          {/* Section Header */}
          <Motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white">
              For Operators & Buyers
            </h2>
            <p
              className={`text-lg sm:text-xl max-w-2xl mx-auto ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              SkyX can be operated as a venture platform by:
            </p>
          </Motion.div>

          {/* Operator Types */}
          <Motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            {operatorTypes.map((type, index) => (
              <div
                key={index}
                className={`px-5 sm:px-6 py-3 rounded-full font-semibold transition ${
                  isDark
                    ? "bg-purple-500/20 border border-purple-400/40 text-purple-200 hover:bg-purple-500/30"
                    : "bg-purple-100/40 border border-purple-300/50 text-purple-800 hover:bg-purple-100/60"
                }`}
              >
                {type}
              </div>
            ))}
          </Motion.div>

          {/* Benefits Grid */}
          <Motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, index) => {
              const IconComponent = iconMap[benefit.icon];
              return (
                <Motion.div
                  key={index}
                  className={`rounded-xl border p-6 backdrop-blur-sm transition hover:shadow-lg ${
                    isDark
                      ? "border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:bg-purple-500/15"
                      : "border-purple-300/30 bg-gradient-to-br from-purple-100/20 to-pink-100/20 hover:bg-purple-100/30"
                  }`}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div
                    className={`mb-4 inline-flex p-3 rounded-lg ${
                      isDark ? "bg-purple-600/30" : "bg-purple-300/30"
                    }`}
                  >
                    <IconComponent size={24} className="text-purple-400" />
                  </div>
                  <h3
                    className={`font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
                  >
                    {benefit.description}
                  </p>
                </Motion.div>
              );
            })}
          </Motion.div>

          {/* Monetization Model */}
          <Motion.div
            variants={itemVariants}
            className={`rounded-xl border p-8 backdrop-blur-sm ${
              isDark
                ? "border-purple-400/20 bg-gradient-to-br from-slate-800/50 to-slate-900/30"
                : "border-purple-300/30 bg-gradient-to-br from-slate-100/30 to-white/20"
            }`}
          >
            <h3
              className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Monetization Model
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: "DollarSign", label: "Incubation fees" },
                { icon: "Award", label: "Launch / listing fees" },
                { icon: "FileText", label: "Premium AI reports" },
                { icon: "ZapIcon", label: "Ecosystem participation" },
              ].map((item, index) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 rounded-lg p-4 ${
                      isDark
                        ? "bg-purple-500/10 border border-purple-400/20"
                        : "bg-purple-100/20 border border-purple-300/20"
                    }`}
                  >
                    <IconComponent
                      size={20}
                      className="text-purple-400 flex-shrink-0"
                    />
                    <span
                      className={`text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Motion.div>

          {/* Call to Action */}
          <Motion.div variants={itemVariants} className="text-center pt-8">
            <Motion.a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border-2 px-8 py-4 text-base font-bold transition"
              style={{
                borderColor: isDark
                  ? "rgba(168, 85, 247, 0.6)"
                  : "rgba(168, 85, 247, 0.7)",
                color: isDark
                  ? "rgba(216, 180, 254, 0.9)"
                  : "rgb(126, 34, 206)",
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: isDark
                  ? "rgba(168, 85, 247, 0.1)"
                  : "rgba(243, 232, 255, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Operate SkyX
            </Motion.a>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
}

export default OperatorsSection;
