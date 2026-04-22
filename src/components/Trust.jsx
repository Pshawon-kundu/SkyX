import { motion as Motion } from "framer-motion";
import { Cpu, Link, Shield, Lock } from "lucide-react";

function Trust({ content, isDark = true }) {
  return (
    <section
      id="trust"
      className={`py-16 sm:py-20 ${isDark ? "bg-slate-900" : "bg-white"}`}
    >
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
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
          <h2
            className={`text-3xl font-black sm:text-4xl text-center ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {content.title}
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {content.points.map((point, index) => {
              const icons = [Cpu, Link, Shield, Lock];
              const Icon = icons[index] || Cpu;
              return (
                <Motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className={`flex items-center gap-4 rounded-lg border p-4 ${
                    isDark
                      ? "border-green-400/20 bg-green-500/10"
                      : "border-green-400/40 bg-green-100/30"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isDark ? "bg-green-500/10" : "bg-green-100/30"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={isDark ? "text-green-300" : "text-green-700"}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isDark ? "text-green-200" : "text-green-700"
                    }`}
                  >
                    {point}
                  </span>
                </Motion.div>
              );
            })}
          </div>

          {content.disclaimer && (
            <div className="mt-6 text-center">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs ${isDark ? "bg-white/6 text-slate-300" : "bg-slate-100 text-slate-700"}`}
              >
                {content.disclaimer}
              </span>
            </div>
          )}
        </Motion.div>
      </div>
    </section>
  );
}

export default Trust;
