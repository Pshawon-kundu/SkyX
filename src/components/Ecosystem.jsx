import { motion as Motion } from "framer-motion";
import { AppWindow, DatabaseZap, Landmark } from "lucide-react";

const icons = [AppWindow, DatabaseZap, Landmark];

function Ecosystem({ products }) {
  return (
    <section id="ecosystem" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">
            Core Systems
          </p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Infrastructure for digital trade coordination
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {products.map((product, index) => {
            const Icon = icons[index];
            return (
              <Motion.article
                key={product.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 to-slate-950 p-7 shadow-[0_0_45px_rgba(34,211,238,0.08)]"
              >
                <span className="inline-flex rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-2.5 text-cyan-200">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-2xl font-bold text-white">
                  {product.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {product.description}
                </p>
                <p className="mt-5 text-sm font-semibold text-cyan-300">
                  {product.value}
                </p>
              </Motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Ecosystem;
