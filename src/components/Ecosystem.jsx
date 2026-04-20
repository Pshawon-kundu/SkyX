import { motion as Motion } from "framer-motion";
import { animations } from "../data/animations";

function Ecosystem({
  products,
  title = "A Connected System — Not Just a Game",
  isDark = true,
}) {
  return (
    <section
      id="ecosystem"
      className={`py-16 sm:py-20 ${isDark ? "bg-slate-900" : "bg-white"}`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={animations.viewport}
          transition={{ duration: 0.6 }}
          className="mb-10 max-w-2xl"
        >
          <p
            className={`text-sm font-semibold uppercase tracking-[0.16em] ${
              isDark ? "text-purple-300" : "text-purple-600"
            }`}
          >
            Core Systems
          </p>
          <Motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={animations.viewport}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`mt-3 text-3xl font-black sm:text-4xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {title}
          </Motion.h2>
        </Motion.div>

        <Motion.div
          variants={animations.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={animations.viewport}
          className="grid gap-4 lg:grid-cols-3"
        >
          {products.map((product, index) => (
            <Motion.article
              key={product.title}
              variants={animations.staggerItem}
              className={`rounded-3xl border group cursor-pointer p-7 shadow-[0_0_45px_rgba(168,85,247,0.08)] ${
                isDark
                  ? "border-purple-400/20 bg-gradient-to-br from-slate-900 to-slate-950"
                  : "border-purple-300/40 bg-gradient-to-br from-purple-50 to-purple-100/50"
              }`}
              whileHover={animations.hoverLift}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Motion.span
                className={`inline-flex rounded-2xl border p-2.5 text-2xl ${
                  isDark
                    ? "border-purple-300/30 bg-purple-400/10 text-purple-200"
                    : "border-purple-400/50 bg-purple-200/30 text-purple-700"
                }`}
                whileHover={animations.float}
                transition={{ duration: 0.3 }}
              >
                {product.icon}
              </Motion.span>
              <Motion.h3
                className={`mt-4 text-2xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={animations.viewport}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                {product.title}
              </Motion.h3>
              <Motion.p
                className={`mt-3 text-sm leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={animations.viewport}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                {product.description}
              </Motion.p>
            </Motion.article>
          ))}
        </Motion.div>
      </div>
    </section>
  );
}

export default Ecosystem;
