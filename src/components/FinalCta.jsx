import { motion as Motion } from "framer-motion";

function FinalCta({ content, isDark = true }) {
  return (
    <section
      className={`py-16 sm:py-20 ${isDark ? "bg-slate-900" : "bg-white"}`}
    >
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className={`rounded-3xl border p-8 sm:p-10 text-center ${
            isDark
              ? "border-purple-400/20 bg-linear-to-br from-purple-600/20 to-slate-900/70"
              : "border-purple-300/40 bg-linear-to-br from-purple-200/30 to-purple-50/50"
          }`}
        >
          <h2
            className={`text-3xl font-black sm:text-4xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {content.title}
          </h2>
          <p
            className={`mt-4 text-lg ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {content.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              className={`rounded-lg px-8 py-4 font-semibold transition-colors ${
                isDark
                  ? "bg-purple-600 text-white hover:bg-purple-500"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {content.primaryCta}
            </button>
            <button
              className={`rounded-lg border px-8 py-4 font-semibold transition-colors ${
                isDark
                  ? "border-purple-400/50 bg-transparent text-purple-300 hover:bg-purple-400/10"
                  : "border-purple-500/50 bg-transparent text-purple-600 hover:bg-purple-100/30"
              }`}
            >
              {content.secondaryCta}
            </button>
          </div>
        </Motion.div>
      </div>
    </section>
  );
}

export default FinalCta;
