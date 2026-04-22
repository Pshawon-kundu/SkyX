import { motion as Motion } from "framer-motion";
import { Grid, Star, Users, Rocket } from "lucide-react";
import { animations } from "../data/animations";

const iconMap = { Grid, Star, Users, Rocket };

function TokenSection({ content, isDark = true }) {
  return (
    <section
      id="token-section"
      className={`py-16 sm:py-20 ${isDark ? "bg-slate-900" : "bg-white"}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={animations.viewport}
          transition={{ duration: 0.6 }}
          className="mb-8 max-w-2xl"
        >
          <p
            className={`text-sm font-semibold uppercase tracking-[0.12em] ${isDark ? "text-purple-300" : "text-purple-600"}`}
          >
            Token & Ecosystem
          </p>
          <h2
            className={`mt-3 text-3xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {content.title}
          </h2>
          <p
            className={`mt-3 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
          >
            Practical access and incentive primitives. Token details are
            intentionally conservative and will evolve with governance and
            regulatory guidance.
          </p>
        </Motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.features.map((f, i) => {
            const Icon = iconMap[f.icon] || Grid;
            return (
              <Motion.article
                key={i}
                className={`rounded-2xl border p-6 ${isDark ? "border-purple-400/10 bg-slate-900/60" : "border-slate-200 bg-white/80"}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={animations.viewport}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-lg ${isDark ? "bg-purple-700/20" : "bg-purple-100/60"}`}
                  >
                    <Icon
                      size={20}
                      className={isDark ? "text-purple-300" : "text-purple-600"}
                    />
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      {f.title}
                    </h3>
                    <p
                      className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
                    >
                      {f.description}
                    </p>
                  </div>
                </div>
              </Motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TokenSection;
