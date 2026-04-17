import { motion as Motion } from "framer-motion";
import { WalletMinimal, Zap, Cpu, Network } from "lucide-react";

const icons = [WalletMinimal, Zap, Cpu, Network];

function Features({ features }) {
  return (
    <section id="features" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">
            Core Features
          </p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Fast, affordable, and builder-ready
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = icons[index];
            return (
              <Motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-cyan-300/30"
              >
                <span className="inline-flex rounded-xl border border-cyan-300/30 bg-cyan-400/10 p-2 text-cyan-300">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {feature.description}
                </p>
              </Motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
