import { motion as Motion } from "framer-motion";
import { Zap, Search, TrendingDown, Lock } from "lucide-react";
import { animations } from "../data/animations";

const iconMap = {
  Zap: Zap,
  Search: Search,
  TrendingDown: TrendingDown,
  Lock: Lock,
};

function Problem({ content, theme }) {
  const isDark = theme === "dark";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
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

  return (
    <section
      id="problems"
      className={`relative py-20 sm:py-28 overflow-hidden ${isDark ? "bg-slate-900/50" : "bg-gradient-to-b from-white to-purple-50/30"}`}
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-64 w-64 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-16 sm:mb-20 text-center"
        >
          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-tight ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {content.title}
          </h2>
          <div className="mt-6 flex justify-center">
            <div
              className={`h-1.5 w-24 rounded-full ${isDark ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gradient-to-r from-purple-600 to-pink-600"}`}
            />
          </div>
        </Motion.div>

        {/* Problem Cards Grid */}
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {content.cards.map((card, index) => {
            const IconComponent = iconMap[card.icon];
            return (
              <Motion.div
                key={index}
                variants={itemVariants}
                className={`group relative rounded-2xl border p-6 sm:p-8 backdrop-blur-sm transition ${
                  isDark
                    ? "border-purple-500/20 bg-gradient-to-br from-slate-900/80 to-slate-950/80 hover:border-purple-500/40 hover:bg-slate-900/90"
                    : "border-purple-300/30 bg-gradient-to-br from-white/70 to-purple-50/50 hover:border-purple-400/50 hover:bg-white/80"
                }`}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon Container */}
                <div
                  className={`mb-6 inline-flex p-3 rounded-xl ${isDark ? "bg-purple-600/30" : "bg-purple-200/50"}`}
                >
                  <IconComponent
                    size={24}
                    className={isDark ? "text-purple-300" : "text-purple-600"}
                  />
                </div>

                {/* Card Title */}
                <h3
                  className={`text-lg sm:text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {card.title}
                </h3>

                {/* Card Description */}
                <p
                  className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  {card.description}
                </p>

                {/* Accent line on hover */}
                <div
                  className={`absolute bottom-0 left-0 h-1 w-0 rounded-full transition-all duration-300 group-hover:w-full ${isDark ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gradient-to-r from-purple-600 to-pink-600"}`}
                />
              </Motion.div>
            );
          })}
        </Motion.div>
      </div>
    </section>
  );
}

export default Problem;
