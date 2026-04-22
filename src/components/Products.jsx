import { motion as Motion } from "framer-motion";
import { Search, Cpu, Users, Rocket, Shield, Columns } from "lucide-react";
import { animations } from "../data/animations";

const iconMap = { Search, Cpu, Users, Rocket, Shield, Columns };

function Products({ content, theme }) {
  const isDark = theme === "dark";

  return (
    <section
      id="products"
      className={`py-16 sm:py-24 ${isDark ? "bg-slate-900/40" : "bg-white"}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            className={`text-3xl sm:text-4xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {content.title}
          </h2>
          <p
            className={`mt-3 text-sm sm:text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}
          >
            Practical modules that make SkyX a productized platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.items.map((item, idx) => {
            const Icon = iconMap[item.icon] || Search;
            return (
              <Motion.div
                key={idx}
                className={`rounded-2xl border p-6 transition hover:-translate-y-2 ${isDark ? "border-purple-700/40 bg-slate-900/60" : "border-slate-200 bg-white/80"}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={animations.viewport}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`p-3 rounded-lg ${isDark ? "bg-purple-700/30" : "bg-purple-100/60"}`}
                  >
                    <Icon
                      size={20}
                      className={isDark ? "text-purple-300" : "text-purple-600"}
                    />
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      {item.name}
                    </h3>
                    <p
                      className={`text-sm ${isDark ? "text-purple-300" : "text-purple-600"}`}
                    >
                      {item.tagline}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
                >
                  {item.description || ""}
                </p>
              </Motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Products;
