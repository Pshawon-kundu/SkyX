import { motion as Motion } from "framer-motion";

function Stats({ stats }) {
  return (
    <section id="stats" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(34,211,238,0.06)]"
            >
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-3 text-3xl font-black text-cyan-200">
                {stat.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                {stat.detail}
              </p>
            </div>
          ))}
        </Motion.div>
      </div>
    </section>
  );
}

export default Stats;
