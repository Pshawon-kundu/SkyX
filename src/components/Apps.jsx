import { motion as Motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import BlockchainVisual from "./BlockchainVisual";

function Apps({ apps, theme }) {
  return (
    <section id="apps" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">
            Featured Apps
          </p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Tools to activate the MetaCrate economy
          </h2>
        </div>

        <BlockchainVisual theme={theme} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app, index) => (
            <Motion.article
              key={app.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-cyan-300/35"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-white">{app.name}</p>
                <ArrowUpRight
                  size={18}
                  className="text-slate-400 transition group-hover:text-cyan-300"
                />
              </div>
              <p className="mt-2 text-sm text-slate-400">{app.type}</p>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Apps;
